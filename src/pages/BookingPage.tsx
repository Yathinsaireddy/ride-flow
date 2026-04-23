import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BikeSelectStep } from './booking/BikeSelectStep';
import { LocationStep } from './booking/LocationStep';
import { ConfirmStep } from './booking/ConfirmStep';

export interface BookingData {
  bikeId: number | null;
  bikeName: string;
  bikeRate: number;
  pickup: string;
  pickupCoords: [number, number] | null;
  dropoff: string;
  dropoffCoords: [number, number] | null;
  distanceKm: number;
  date: string;
  time: string;
}

const Logo = () => (
  <div className="flex flex-col leading-none">
    <span className="font-brand font-bold text-xl tracking-tight">
      <span className="text-secondary">RIDE</span>
      <span className="text-primary mx-1">⚡</span>
      <span className="text-primary">FLOW</span>
    </span>
  </div>
);

const STEPS = ['Choose Ride', 'Route', 'Confirm'];

export const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({
    bikeId: null, bikeName: '', bikeRate: 0,
    pickup: '', pickupCoords: null,
    dropoff: '', dropoffCoords: null,
    distanceKm: 0, date: '', time: '',
  });

  const update = (partial: Partial<BookingData>) =>
    setData(prev => ({ ...prev, ...partial }));

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]">
        <button
          onClick={() => step === 0 ? navigate('/') : setStep(s => s - 1)}
          className="flex items-center gap-2 text-tertiary hover:text-primary transition-colors text-sm uppercase tracking-widest font-sans"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          {step === 0 ? 'Home' : 'Back'}
        </button>
        <Logo />
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === step ? 'bg-primary' : i < step ? 'bg-primary/40' : 'bg-[#2A2A2A]'}`} />
              <span className={`text-[10px] uppercase tracking-widest font-sans hidden sm:block ${i === step ? 'text-primary' : 'text-tertiary'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#2A2A2A]" />}
            </div>
          ))}
        </div>
      </nav>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <BikeSelectStep onSelect={(bike) => { update(bike); setStep(1); }} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <LocationStep data={data} onUpdate={update} onNext={() => setStep(2)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <ConfirmStep data={data} onUpdate={update} onDone={() => navigate('/')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
