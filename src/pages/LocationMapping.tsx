import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, Search, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWasm } from '../hooks/useWasm';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MagneticButton } from '../components/ui/Button';

// Fix Leaflet marker icons issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored markers for Start and End
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type LocationPoint = {
  coords: [number, number];
  address: string;
};

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// A component that updates the map view and draws a dashed path between points
const MapBoundsUpdater = ({ start, end }: { start: [number, number] | null, end: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds(start, end);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (start) {
      map.flyTo(start, 15);
    } else if (end) {
      map.flyTo(end, 15);
    }
  }, [start, end, map]);
  return null;
};

// Allows tapping map as a fallback
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
};

export const LocationMapping = () => {
  const navigate = useNavigate();
  const { setLocation, riderCount } = useStore();
  const { api } = useWasm();
  
  const [startPoint, setStartPoint] = useState<LocationPoint | null>(null);
  const [endPoint, setEndPoint] = useState<LocationPoint | null>(null);
  
  // Selection Mode: 'start' or 'end' indicates which input is active
  const [selectionMode, setSelectionMode] = useState<'start' | 'end' | null>(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [fareData, setFareData] = useState<{dist: number, fare: number, time: number} | null>(null);

  // Search autocomplete states
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus tracking to close dropdowns
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Helper to fetch address from coordinates using free Nominatim API Reverse Geocoding
  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      return data.display_name.split(',').slice(0, 3).join(',') || "Custom Location";
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Helper for Free Text Search (Forward Geocoding)
  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search handler
  const handleTypeSearch = (query: string, mode: 'start' | 'end') => {
    if (mode === 'start') setStartQuery(query);
    else setEndQuery(query);
    setSelectionMode(mode);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(query);
    }, 500);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    // Simple display name
    const address = result.display_name.split(',').slice(0, 3).join(',');
    
    if (selectionMode === 'start') {
      setStartPoint({ coords: [lat, lng], address });
      setStartQuery(address);
      setSelectionMode('end'); // Focus next
      if (endInputRef.current) endInputRef.current.focus();
    } else {
      setEndPoint({ coords: [lat, lng], address });
      setEndQuery(address);
      setSelectionMode(null); // Close dropdown
    }
    setSearchResults([]);
  };

  // Trigger GPS immediately on mount
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const addr = await fetchAddress(lat, lng);
          
          setStartPoint({ coords: [lat, lng], address: addr });
          setStartQuery(addr);
          setSelectionMode('end'); // Auto switch to destination selection focus
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location automatically. Please search for it manually.");
          setIsLocating(false);
          setSelectionMode('start');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const addr = await fetchAddress(lat, lng);
    // Determine which point to set based on what is currently missing or selected
    if (selectionMode === 'start' || (!startPoint && !endPoint)) {
      setStartPoint({ coords: [lat, lng], address: addr });
      setStartQuery(addr);
      setSelectionMode('end');
    } else {
      setEndPoint({ coords: [lat, lng], address: addr });
      setEndQuery(addr);
      setSelectionMode(null);
    }
  };

  useEffect(() => {
    if (startPoint && endPoint) {
      const dist = api.calculateDistance(
        startPoint.coords[0], startPoint.coords[1], 
        endPoint.coords[0], endPoint.coords[1]
      );
      const time = api.estimateTimeMinutes(dist);
      const fare = api.calculateFare(dist, riderCount, 12); 
      
      setFareData({ dist, fare, time });
      
      setLocation({
        start: startPoint.coords,
        end: endPoint.coords,
        distanceKm: dist,
        estimatedFare: fare,
        estimatedTimeMin: time
      });
    } else {
      setFareData(null);
    }
  }, [startPoint, endPoint, riderCount]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectionMode) {
        // If clicking on the map or somewhere else not in the panel, close dropdown
        const target = e.target as HTMLElement;
        if (!target.closest('.search-panel') && !target.closest('.leaflet-container')) {
          setSelectionMode(null);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectionMode]);

  return (
    <PageWrapper className="flex flex-col md:flex-row h-screen">
      
      {/* Map Area (60%) */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-full relative z-0">
        <MapContainer 
          center={[12.9716, 77.5946]} // Default center before GPS
          zoom={11} 
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />
          
          {startPoint && <Marker position={startPoint.coords} icon={startIcon} />}
          {endPoint && <Marker position={endPoint.coords} icon={endIcon} />}
          
          {startPoint && endPoint && (
            <Polyline 
              positions={[startPoint.coords, endPoint.coords]} 
              color="#66FCF1" 
              dashArray="10, 10" 
              weight={4}
              className="animate-pulse"
            />
          )}
          
          <MapBoundsUpdater 
            start={startPoint ? startPoint.coords : null} 
            end={endPoint ? endPoint.coords : null} 
          />
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
        
        {/* GPS Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleGetCurrentLocation}
          title="Locate Me"
          className={`absolute bottom-6 right-6 z-[1000] p-4 rounded-full shadow-xl bg-surface border border-primary/50 text-primary hover:bg-primary hover:text-black transition-colors ${isLocating ? 'animate-pulse' : ''}`}
        >
          <Crosshair className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Details Panel (40%) */}
      <div className="search-panel w-full md:w-[40%] h-[50vh] md:h-full bg-surface z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] p-8 flex flex-col relative overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-[#66FCF1] font-bold mb-2">Step 4</h2>
          <h1 className="text-3xl font-bold text-white">Route Details</h1>
        </div>

        <div className="space-y-4">
          {/* Start Location Input Box */}
          <div className="relative">
            <div className="absolute left-4 top-[1.3rem] w-3 h-3 rounded-full bg-[#2ecc71] z-10" />
            <div className={`relative transition-all rounded-xl border ${selectionMode === 'start' ? 'ring-2 ring-primary border-transparent' : 'border-white/10'}`}>
              <span className="absolute left-10 top-1 text-[10px] uppercase font-bold text-secondary">Pick Up From</span>
              <input
                ref={startInputRef}
                type="text"
                placeholder={isLocating ? "Detecting GPS..." : "Search start location"}
                value={startQuery}
                onFocus={() => { setSelectionMode('start'); executeSearch(startQuery); }}
                onChange={(e) => handleTypeSearch(e.target.value, 'start')}
                className="w-full bg-white/5 pt-6 pb-2 pl-10 pr-10 rounded-xl outline-none text-white text-md focus:bg-white/10 transition-colors"
                autoComplete="off"
              />
              {startQuery && (
                <button onClick={() => {setStartQuery(''); setStartPoint(null); setSelectionMode('start');}} className="absolute right-3 top-[1rem] text-secondary hover:text-white">
                  &times;
                </button>
              )}
            </div>
            
            <div className="absolute left-[1.125rem] top-[3.5rem] h-6 w-0.5 border-l-2 border-dashed border-secondary/50 z-0" />
          </div>

          {/* End Location Input Box */}
          <div className="relative mt-2">
            <div className="absolute left-4 top-[1.3rem] w-3 h-3 rounded-sm bg-[#e74c3c] z-10" />
            <div className={`relative transition-all rounded-xl border ${selectionMode === 'end' ? 'ring-2 ring-red-500 border-transparent' : 'border-white/10'}`}>
              <span className="absolute left-10 top-1 text-[10px] uppercase font-bold text-secondary">Drop Off At</span>
              <input
                ref={endInputRef}
                type="text"
                placeholder="Search destination"
                value={endQuery}
                onFocus={() => { setSelectionMode('end'); executeSearch(endQuery); }}
                onChange={(e) => handleTypeSearch(e.target.value, 'end')}
                className="w-full bg-white/5 pt-6 pb-2 pl-10 pr-10 rounded-xl outline-none text-white text-md focus:bg-white/10 transition-colors"
                autoComplete="off"
              />
              {endQuery && (
                <button onClick={() => {setEndQuery(''); setEndPoint(null); setSelectionMode('end');}} className="absolute right-3 top-[1rem] text-secondary hover:text-white">
                  &times;
                </button>
              )}
            </div>
          </div>
          
          {/* Autocomplete Dropdown Search Results */}
          <AnimatePresence>
            {selectionMode && (startQuery || endQuery || isSearching) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#1a1a2e] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-2 z-50 max-h-60 overflow-y-auto absolute left-8 right-8"
                style={{ top: selectionMode === 'start' ? '4rem' : '8.5rem' }}
              >
                {isSearching ? (
                  <div className="p-4 flex items-center justify-center text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full text-left p-3 hover:bg-white/10 transition flex items-start border-b border-white/5 last:border-0"
                    >
                      <Search className="w-4 h-4 mr-3 mt-1 shrink-0 text-secondary" />
                      <span className="text-secondary text-sm truncate">{result.display_name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-secondary text-sm text-center">No results found for your search.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fare Card - Flips in when calculated */}
        {fareData && (
          <motion.div
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="mt-8 bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 p-6 rounded-2xl flex-shrink-0"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-secondary">
                <Navigation className="w-5 h-5 mr-2 text-primary" />
                {fareData.dist.toFixed(1)} km
              </div>
              <div className="text-secondary opacity-80 text-sm">
                Est. Time: {fareData.time} mins
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t border-primary/20 pt-4 mb-6">
              <span className="text-sm font-medium uppercase tracking-wider text-secondary">Est. Fare</span>
              <span className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
                ₹{Math.round(fareData.fare)}
              </span>
            </div>

            <MagneticButton onClick={() => navigate('/confirm')} className="w-full bg-primary text-black hover:text-white border-none">
              Review Booking
            </MagneticButton>
          </motion.div>
        )}
      </div>
      
    </PageWrapper>
  );
};
