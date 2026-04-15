import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Crosshair, Search, Loader2, RotateCcw } from 'lucide-react';
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

export const LocationMapping = () => {
  const navigate = useNavigate();
  const { setLocation, riderCount } = useStore();
  const { api } = useWasm();
  
  const [startPoint, setStartPoint] = useState<LocationPoint | null>(null);
  const [endPoint, setEndPoint] = useState<LocationPoint | null>(null);
  
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [fareData, setFareData] = useState<{dist: number, fare: number, time: number} | null>(null);

  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      return data.display_name.split(',').slice(0, 3).join(',') || "Custom Location";
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      // Option B fix: Removed Bengaluru viewbox to allow nationwide/global search. 
      // Kept `countrycodes=in` to prevent completely random global matches like Cameroon.
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTypeSearch = (query: string, mode: 'start' | 'end') => {
    if (mode === 'start') setStartQuery(query);
    else setEndQuery(query);
    setActiveInput(mode);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(query);
    }, 500);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name.split(',').slice(0, 3).join(',');
    
    if (activeInput === 'start') {
      setStartPoint({ coords: [lat, lng], address });
      setStartQuery(address);
      setActiveInput('end'); 
      if (endInputRef.current) endInputRef.current.focus();
    } else if (activeInput === 'end') {
      setEndPoint({ coords: [lat, lng], address });
      setEndQuery(address);
      setActiveInput(null); 
    }
    setSearchResults([]);
  };

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
          setActiveInput('end');
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location automatically. Please search manually.");
          setIsLocating(false);
          setActiveInput('start');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeInput) {
        const target = e.target as HTMLElement;
        if (!target.closest('.search-container') && !target.closest('.leaflet-container')) {
          setActiveInput(null);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeInput]);

  return (
    <PageWrapper className="flex flex-col md:flex-row h-screen">
      
      {/* Map Area */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-full relative z-0">
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={11} 
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {startPoint && <Marker position={startPoint.coords} icon={startIcon} />}
          {endPoint && <Marker position={endPoint.coords} icon={endIcon} />}
          
          {startPoint && endPoint && (
            <Polyline 
              positions={[startPoint.coords, endPoint.coords]} 
              color="#3B82F6" 
              dashArray="10, 10" 
              weight={4}
              className="animate-pulse"
            />
          )}
          
          <MapBoundsUpdater 
            start={startPoint ? startPoint.coords : null} 
            end={endPoint ? endPoint.coords : null} 
          />
        </MapContainer>
        
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

      {/* Details Panel */}
      <div className="w-full md:w-[40%] h-[50vh] md:h-full bg-surface z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] p-8 flex flex-col relative overflow-y-auto">
        <div className="mb-8 flex justify-between">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[#3B82F6] font-bold mb-2">Step 4</h2>
            <h1 className="text-3xl font-bold text-white">Route Details</h1>
          </div>
          <button 
            onClick={() => { setStartPoint(null); setEndPoint(null); setActiveInput('start'); setStartQuery(''); setEndQuery(''); setFareData(null); }}
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-secondary transition self-start"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 search-container">
          
          {/* Start Input Block */}
          <div className="flex flex-col relative">
             <div className="relative">
                <div className="absolute left-4 top-[1.3rem] w-3 h-3 rounded-full bg-[#2ecc71] z-10" />
                <div className={`relative transition-all rounded-xl border ${activeInput === 'start' ? 'ring-2 ring-primary border-transparent' : 'border-white/10'}`}>
                  <span className="absolute left-10 top-1 text-[10px] uppercase font-bold text-secondary">Pick Up From</span>
                  <input
                    ref={startInputRef}
                    type="text"
                    placeholder={isLocating ? "Detecting GPS..." : "Search start location"}
                    value={startQuery}
                    onFocus={() => { setActiveInput('start'); executeSearch(startQuery); }}
                    onChange={(e) => handleTypeSearch(e.target.value, 'start')}
                    className="w-full bg-white/5 pt-6 pb-2 pl-10 pr-10 rounded-xl outline-none text-white text-md focus:bg-white/10 transition-colors"
                    autoComplete="off"
                  />
                  {startQuery && (
                    <button onClick={() => {setStartQuery(''); setStartPoint(null); setActiveInput('start');}} className="absolute right-3 top-[1rem] text-secondary hover:text-white">
                      &times;
                    </button>
                  )}
                </div>
             </div>

             {/* Dynamic Dropdown - Normal Flow (Pushes content down) */}
             <AnimatePresence>
              {activeInput === 'start' && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#1a1a2e] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-2 flex-shrink-0"
                >
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        onClick={() => handleSelectSearchResult(result)}
                        className="w-full text-left p-3 hover:bg-white/10 transition flex items-start border-b border-white/5 last:border-0"
                      >
                        <Search className="w-4 h-4 mr-3 mt-1 shrink-0 text-secondary" />
                        <span className="text-secondary text-sm line-clamp-2">{result.display_name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
             </AnimatePresence>

             {/* Connection Line */}
             <div className="absolute left-[1.125rem] top-[3.5rem] bottom-[-2.5rem] w-0.5 border-l-2 border-dashed border-secondary/50 pointer-events-none" />
          </div>

          {/* End Input Block */}
          <div className="flex flex-col relative mt-4">
            <div className="relative">
              <div className="absolute left-4 top-[1.3rem] w-3 h-3 rounded-sm bg-[#e74c3c] z-10" />
              <div className={`relative transition-all rounded-xl border ${activeInput === 'end' ? 'ring-2 ring-red-500 border-transparent' : 'border-white/10'}`}>
                <span className="absolute left-10 top-1 text-[10px] uppercase font-bold text-secondary">Drop Off At</span>
                <input
                  ref={endInputRef}
                  type="text"
                  placeholder="Search destination"
                  value={endQuery}
                  onFocus={() => { setActiveInput('end'); executeSearch(endQuery); }}
                  onChange={(e) => handleTypeSearch(e.target.value, 'end')}
                  className="w-full bg-white/5 pt-6 pb-2 pl-10 pr-10 rounded-xl outline-none text-white text-md focus:bg-white/10 transition-colors"
                  autoComplete="off"
                />
                {endQuery && (
                  <button onClick={() => {setEndQuery(''); setEndPoint(null); setActiveInput('end');}} className="absolute right-3 top-[1rem] text-secondary hover:text-white">
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Dropdown - Normal Flow (Pushes content down) */}
            <AnimatePresence>
            {activeInput === 'end' && Math.max(searchResults.length, isSearching ? 1 : 0) > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#1a1a2e] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-2 flex-shrink-0"
              >
                <div className="max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center text-secondary">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Searching...
                    </div>
                  ) : searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full text-left p-3 hover:bg-white/10 transition flex items-start border-b border-white/5 last:border-0"
                    >
                      <Search className="w-4 h-4 mr-3 mt-1 shrink-0 text-secondary" />
                      <span className="text-secondary text-sm line-clamp-2">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fare Card */}
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
