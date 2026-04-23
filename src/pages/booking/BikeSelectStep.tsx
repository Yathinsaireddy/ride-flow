import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Fuel } from 'lucide-react';

const BIKES = [
  // Fuel
  { id: 1, name: 'Activa 6G', cc: '110cc', color: 'Pearl White', rate: 8, type: 'fuel', image: 'bike-1.jpg' },
  { id: 2, name: 'Jupiter 125', cc: '125cc', color: 'Matte Blue', rate: 9, type: 'fuel', image: 'bike-2.jpg' },
  { id: 3, name: 'Classic 350', cc: '350cc', color: 'Stealth Black', rate: 15, type: 'fuel', image: 'bike-3.jpg' },
  { id: 4, name: 'Duke 200', cc: '200cc', color: 'Orange/Black', rate: 14, type: 'fuel', image: 'bike-4.jpg' },
  { id: 5, name: 'MT-15 V2', cc: '155cc', color: 'Cyan Storm', rate: 13, type: 'fuel', image: 'bike-5.jpg' },
  { id: 6, name: 'Himalayan 450', cc: '450cc', color: 'Kamet White', rate: 18, type: 'fuel', image: 'bike-6.jpg' },
  { id: 7, name: 'Ninja 300', cc: '300cc', color: 'Lime Green', rate: 22, type: 'fuel', image: 'bike-7.jpg' },
  { id: 8, name: 'Access 125', cc: '125cc', color: 'Metallic Silver', rate: 9, type: 'fuel', image: 'bike-8.jpg' },
  { id: 9, name: 'Dominar 400', cc: '373cc', color: 'Aurora Green', rate: 16, type: 'fuel', image: 'bike-9.jpg' },
  { id: 10, name: 'R15 V4', cc: '155cc', color: 'Racing Blue', rate: 14, type: 'fuel', image: 'bike-10.jpg' },
  // EV
  { id: 11, name: 'Ather 450X', cc: 'EV', color: 'Space Grey', rate: 10, type: 'ev', image: 'bike-11.png' },
  { id: 12, name: 'Ola S1 Pro', cc: 'EV', color: 'Neon Lime', rate: 11, type: 'ev', image: 'bike-12.png' },
  { id: 13, name: 'TVS iQube', cc: 'EV', color: 'Pearl White', rate: 9, type: 'ev', image: 'bike-13.png' },
  { id: 14, name: 'Bajaj Chetak', cc: 'EV', color: 'Metallic Blue', rate: 9, type: 'ev', image: 'bike-14.png' },
  { id: 15, name: 'Vida V1 Pro', cc: 'EV', color: 'Fiery Red', rate: 10, type: 'ev', image: 'bike-15.png' },
];

interface Props {
  onSelect: (bike: { bikeId: number; bikeName: string; bikeRate: number; isEv: boolean }) => void;
}

export const BikeSelectStep: React.FC<Props> = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState<'fuel' | 'ev'>('fuel');

  const filteredBikes = BIKES.filter(b => b.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-8 py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-3">Step 01</p>
        <h1 className="font-brand font-bold text-5xl md:text-6xl text-secondary mb-2">Choose Your Savior.</h1>
        <p className="text-tertiary text-sm font-sans mb-8">Select the bike that suits you.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setActiveTab('fuel')}
          className={`px-8 py-3 rounded-full font-brand font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${activeTab === 'fuel' ? 'bg-secondary text-[#0F0F0F]' : 'bg-[#1A1A1A] text-tertiary hover:bg-[#252525]'}`}
        >
          <Fuel className="w-4 h-4" /> Fuel Bikes
        </button>
        <button 
          onClick={() => setActiveTab('ev')}
          className={`px-8 py-3 rounded-full font-brand font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${activeTab === 'ev' ? 'bg-primary text-[#0F0F0F] shadow-[0_0_15px_rgba(194,240,58,0.4)]' : 'bg-[#1A1A1A] text-tertiary hover:bg-[#252525]'}`}
        >
          <Zap className="w-4 h-4" /> EV Bikes
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filteredBikes.map((bike, i) => (
            <motion.button
              key={bike.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ borderColor: activeTab === 'ev' ? '#C2F03A' : '#ffffff', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect({ bikeId: bike.id, bikeName: bike.name, bikeRate: bike.rate, isEv: bike.type === 'ev' })}
              className="flex flex-col bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden text-left transition-colors duration-200 group"
            >
              {/* Image area */}
              <div className="w-full aspect-[4/3] bg-[#111111] relative overflow-hidden">
                <img
                  src={`/bikes/${bike.image}`}
                  alt={bike.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                    t.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">🏍️</div>`;
                  }}
                />
                {/* CC badge */}
                <span className={`absolute top-2 right-2 text-[#0F0F0F] text-[10px] font-brand font-bold px-2 py-0.5 rounded-full ${activeTab === 'ev' ? 'bg-primary' : 'bg-secondary'}`}>
                  {bike.cc}
                </span>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-brand font-bold text-secondary text-sm">{bike.name}</h3>
                  <p className="text-tertiary text-[10px] font-sans mt-0.5">{bike.color}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`${activeTab === 'ev' ? 'text-primary' : 'text-secondary'} font-brand font-bold text-base`}>₹{bike.rate}<span className="text-tertiary text-[10px] font-sans">/km</span></span>
                  <ArrowRight className={`w-4 h-4 text-tertiary ${activeTab === 'ev' ? 'group-hover:text-primary' : 'group-hover:text-secondary'} transition-colors duration-200`} strokeWidth={1.5} />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
