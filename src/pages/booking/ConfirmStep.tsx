import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Calendar, ArrowRight, Zap } from 'lucide-react';
import type { BookingData } from '../BookingPage';

interface Props { data: BookingData; onUpdate: (p: Partial<BookingData>) => void; onDone: () => void; }

export const ConfirmStep: React.FC<Props> = ({ data, onUpdate, onDone }) => {
  const [confirmed, setConfirmed] = useState(false);

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
        onClick={() => canBook && setConfirmed(true)}
        className={`w-full py-5 rounded-2xl font-brand font-bold text-base uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200
          ${canBook ? 'bg-primary text-[#0F0F0F] cursor-pointer' : 'bg-[#1A1A1A] text-tertiary border border-[#2A2A2A] cursor-not-allowed'}`}
      >
        {canBook ? <><Zap className="w-5 h-5" strokeWidth={1.5} /> Confirm Booking</> : 'Pick a date to continue'}
      </motion.button>

      <p className="text-center text-[10px] text-[#444] uppercase tracking-widest font-sans mt-4">
        Pay cash on pickup · Free cancellation
      </p>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirmed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="bg-[#141414] border border-[#252525] rounded-3xl p-10 max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="font-brand font-bold text-2xl text-secondary uppercase tracking-wider mb-2">Booking Confirmed!</h2>
              <p className="text-tertiary text-sm font-sans mb-8">Your EV ride is reserved. Pay cash on pickup.</p>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 text-left space-y-3 mb-8">
                {[
                  { k: 'Bike', v: data.bikeName },
                  { k: 'Date', v: data.date },
                  { k: 'Fare', v: `₹${fare}` },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">{k}</span>
                    <span className={`text-xs font-sans font-medium ${k === 'Fare' ? 'text-primary font-brand text-base' : 'text-secondary'}`}>{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={onDone}
                className="w-full bg-primary text-[#0F0F0F] font-brand font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#d4ff4a] transition-colors duration-200 flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" /> Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
