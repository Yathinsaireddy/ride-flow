import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BIKES = [
  { id: 1, name: 'Activa 6G', cc: '110cc', color: 'Pearl White', rate: 8 },
  { id: 2, name: 'Jupiter 125', cc: '125cc', color: 'Matte Blue', rate: 9 },
  { id: 3, name: 'Classic 350', cc: '350cc', color: 'Stealth Black', rate: 15 },
  { id: 4, name: 'Duke 200', cc: '200cc', color: 'Orange/Black', rate: 14 },
  { id: 5, name: 'MT-15 V2', cc: '155cc', color: 'Cyan Storm', rate: 13 },
  { id: 6, name: 'Himalayan 450', cc: '450cc', color: 'Kamet White', rate: 18 },
  { id: 7, name: 'Ninja 300', cc: '300cc', color: 'Lime Green', rate: 22 },
  { id: 8, name: 'Access 125', cc: '125cc', color: 'Metallic Silver', rate: 9 },
  { id: 9, name: 'Dominar 400', cc: '373cc', color: 'Aurora Green', rate: 16 },
  { id: 10, name: 'R15 V4', cc: '155cc', color: 'Racing Blue', rate: 14 },
];

interface Props {
  onSelect: (bike: { bikeId: number; bikeName: string; bikeRate: number }) => void;
}

export const BikeSelectStep: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-8 py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-3">Step 01</p>
        <h1 className="font-brand font-bold text-5xl md:text-6xl text-secondary mb-2">Choose Your Ride.</h1>
        <p className="text-tertiary text-sm font-sans mb-10">Select the EV bike that suits your journey.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {BIKES.map((bike, i) => (
          <motion.button
            key={bike.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ borderColor: '#C2F03A', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect({ bikeId: bike.id, bikeName: bike.name, bikeRate: bike.rate })}
            className="flex flex-col bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden text-left transition-colors duration-200 group"
          >
            {/* Image area */}
            <div className="w-full aspect-[4/3] bg-[#111111] relative overflow-hidden">
              <img
                src={`/bikes/bike-${bike.id}.jpg`}
                alt={bike.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  t.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">🏍️</div>`;
                }}
              />
              {/* CC badge */}
              <span className="absolute top-2 right-2 bg-primary text-[#0F0F0F] text-[10px] font-brand font-bold px-2 py-0.5 rounded-full">
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
                <span className="text-primary font-brand font-bold text-base">₹{bike.rate}<span className="text-tertiary text-[10px] font-sans">/km</span></span>
                <ArrowRight className="w-4 h-4 text-tertiary group-hover:text-primary transition-colors duration-200" strokeWidth={1.5} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
