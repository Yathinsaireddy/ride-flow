import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BookingData } from '../BookingPage';

interface Props { data: BookingData; onUpdate: (p: Partial<BookingData>) => void; onNext: () => void; }

export const ConfirmStep: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const fare = Math.round(data.distanceKm * data.bikeRate);
  const canBook = !!data.date;

  return (
    <div className="max-w-xl mx-auto px-8 py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-3">Step 03</p>
        <h1 className="font-brand font-bold text-4xl text-secondary mb-8">Confirm Your Booking.</h1>
      </motion.div>

      {/* Summary card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 mb-6 space-y-4">
        {[
          { label: 'Bike', value: data.bikeName },
          { label: 'Pickup', value: data.pickup },
          { label: 'Drop-off', value: data.dropoff },
          { label: 'Distance', value: `${data.distanceKm.toFixed(1)} km` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">{label}</span>
            <span className="text-secondary text-xs font-sans text-right font-medium max-w-[60%] truncate">{value}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center">
          <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">Est. Fare (Cash)</span>
          <span className="text-primary font-brand font-bold text-2xl">₹{fare}</span>
        </div>
      </motion.div>

      {/* Date only */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8">
        <p className="text-[9px] text-tertiary uppercase tracking-[0.25em] font-sans mb-2">📅 Date</p>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary pointer-events-none" strokeWidth={1.5} />
          <input type="date" value={data.date} onChange={(e) => onUpdate({ date: e.target.value })}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-3 text-secondary text-sm font-sans outline-none focus:border-primary transition-colors duration-200"
          />
        </div>
      </motion.div>

      {/* Book button */}
      <motion.button
        whileHover={canBook ? { scale: 1.02, backgroundColor: '#d4ff4a' } : {}}
        whileTap={canBook ? { scale: 0.97 } : {}}
        onClick={() => canBook && onNext()}
        className={`w-full py-5 rounded-2xl font-brand font-bold text-base uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200
          ${canBook ? 'bg-primary text-[#0F0F0F] cursor-pointer' : 'bg-[#1A1A1A] text-tertiary border border-[#2A2A2A] cursor-not-allowed'}`}
      >
        {canBook ? <>Proceed to Rider Details <ArrowRight className="w-5 h-5" strokeWidth={1.5} /></> : 'Pick a date to continue'}
      </motion.button>

      <p className="text-center text-[10px] text-[#444] uppercase tracking-widest font-sans mt-4">
        Pay cash on pickup · Free cancellation
      </p>
    </div>
  );
};
