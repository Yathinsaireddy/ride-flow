import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Search, Loader2, MapPin, ArrowRight } from 'lucide-react';
import type { BookingData } from '../BookingPage';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function toRad(v: number) { return (v * Math.PI) / 180; }
function haversine(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

type SearchResult = { place_id: number; display_name: string; lat: string; lon: string };

interface Props { data: BookingData; onUpdate: (p: Partial<BookingData>) => void; onNext: () => void; }

export const LocationStep: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [dropQuery, setDropQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [permAsked, setPermAsked] = useState(false);

  // Auto-request GPS on mount
  useEffect(() => {
    if (permAsked) return;
    setPermAsked(true);
    fetchGPS();
  }, []);

  const fetchGPS = () => {
    setLocating(true);
    setLocError('');
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const json = await res.json();
        const addr = json.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onUpdate({ pickup: addr, pickupCoords: [lat, lng] });
        mapRef.current?.flyTo([lat, lng], 14);
        setLocating(false);
      },
      (err) => { setLocError('Location access denied. Please search manually.'); setLocating(false); },
      { enableHighAccuracy: true }
    );
  };

  const searchDrop = (q: string) => {
    setDropQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=in`);
      setResults(await res.json());
      setSearching(false);
    }, 500);
  };

  const selectDrop = (r: SearchResult) => {
    const coords: [number, number] = [parseFloat(r.lat), parseFloat(r.lon)];
    const addr = r.display_name.split(',').slice(0, 3).join(', ');
    const dist = data.pickupCoords ? haversine(data.pickupCoords, coords) : 0;
    onUpdate({ dropoff: addr, dropoffCoords: coords, distanceKm: dist });
    setDropQuery(addr);
    setResults([]);
    if (data.pickupCoords) {
      mapRef.current?.fitBounds([data.pickupCoords, coords], { padding: [50, 50] });
    }
  };

  const canProceed = data.pickupCoords && data.dropoffCoords;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-65px)]">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          className="w-full h-full"
          zoomControl={false}
          ref={mapRef as any}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {data.pickupCoords && <Marker position={data.pickupCoords} icon={pickupIcon} />}
          {data.dropoffCoords && <Marker position={data.dropoffCoords} icon={dropIcon} />}
          {data.pickupCoords && data.dropoffCoords && (
            <Polyline positions={[data.pickupCoords, data.dropoffCoords]} color="#C2F03A" dashArray="10,8" weight={3} />
          )}
        </MapContainer>
      </div>

      {/* Panel */}
      <div className="w-full md:w-[380px] bg-[#111111] border-l border-[#1F1F1F] p-8 flex flex-col overflow-y-auto">
        <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-2">Step 02</p>
        <h2 className="font-brand font-bold text-2xl text-secondary mb-1">Route Details</h2>
        <p className="text-tertiary text-xs font-sans mb-8">Set your pickup and drop-off points.</p>

        {/* Pickup (GPS) */}
        <div className="mb-5">
          <p className="text-[9px] text-tertiary uppercase tracking-[0.25em] font-sans mb-2">📍 Pick Up (GPS)</p>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              {locating ? (
                <div className="flex items-center gap-2 text-tertiary text-xs font-sans">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting your location...
                </div>
              ) : locError ? (
                <div>
                  <p className="text-[#FF4B4B] text-xs font-sans">{locError}</p>
                  <button onClick={fetchGPS} className="text-primary text-xs font-brand mt-1 hover:underline">Retry GPS</button>
                </div>
              ) : data.pickup ? (
                <p className="text-secondary text-xs font-sans truncate">{data.pickup}</p>
              ) : (
                <p className="text-tertiary text-xs font-sans italic">Fetching location...</p>
              )}
            </div>
            <button onClick={fetchGPS} className="text-tertiary hover:text-primary transition-colors shrink-0" title="Refresh GPS">
              <Navigation className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Dropoff search */}
        <div className="mb-6 relative">
          <p className="text-[9px] text-tertiary uppercase tracking-[0.25em] font-sans mb-2">🏁 Drop Off</p>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4B4B]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search destination..."
              value={dropQuery}
              onChange={(e) => searchDrop(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-secondary text-sm font-sans outline-none focus:border-primary transition-colors duration-200 placeholder:text-[#555]"
            />
            {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-tertiary" />}
          </div>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden mt-2"
              >
                {results.map((r) => (
                  <button
                    key={r.place_id}
                    onClick={() => selectDrop(r)}
                    className="w-full text-left px-4 py-3 hover:bg-[#222] transition-colors flex items-center gap-3 border-b border-[#222] last:border-0"
                  >
                    <Search className="w-3.5 h-3.5 text-tertiary shrink-0" strokeWidth={1.5} />
                    <span className="text-secondary text-xs font-sans line-clamp-1">{r.display_name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Distance summary */}
        {data.distanceKm > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-[9px] text-tertiary uppercase tracking-widest font-sans">Distance</p>
              <p className="text-secondary font-brand font-bold text-lg">{data.distanceKm.toFixed(1)} km</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-tertiary uppercase tracking-widest font-sans">Est. Fare</p>
              <p className="text-primary font-brand font-bold text-xl">₹{Math.round(data.distanceKm * data.bikeRate)}</p>
            </div>
          </motion.div>
        )}

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-xl font-brand font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200
            ${canProceed ? 'bg-primary text-[#0F0F0F] hover:bg-[#d4ff4a]' : 'bg-[#1A1A1A] text-tertiary border border-[#2A2A2A] cursor-not-allowed'}`}
        >
          Continue <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
