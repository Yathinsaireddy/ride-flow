import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, CheckCircle2, Ticket } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageWrapper } from '../components/layout/PageWrapper';

export const Confirmation = () => {
  const navigate = useNavigate();
  const { riderCount, selectedBikeId, location, riderDetails } = useStore();

  const handleConfirm = () => {
    // Generate simulated booking ID and alert or just console, in a real app would talk to backend
    alert('Booking Confirmed! Pay Cash on Delivery. Rider will contact you shortly.');
    navigate('/');
  };

  return (
    <PageWrapper className="bg-background flex items-center justify-center p-6">
      
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-background to-background" />

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl"
      >
        {/* Ticket Top */}
        <div className="p-8 text-center bg-zinc-800/50">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50"
          >
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Summary</h1>
          <p className="text-secondary text-sm">Review details before confirmation</p>
        </div>

        {/* Ticket Divider (Holes) */}
        <div className="flex items-center justify-between px-[-8px] relative -my-4 z-10 w-full overflow-hidden">
             
             <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-zinc-700 pointer-events-none" />
             <div className="w-8 h-8 bg-background rounded-full translate-x-[-50%] z-20" />
             <div className="w-8 h-8 bg-background rounded-full translate-x-[50%] z-20" />
        </div>

        {/* Ticket Bottom Details */}
        <div className="p-8 space-y-6 pt-6">
          
          <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
            <div>
              <p className="text-xs uppercase tracking-widest text-secondary mb-1">Vehicle</p>
              <p className="font-semibold text-white">Bike #{selectedBikeId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-secondary mb-1">Riders</p>
              <p className="font-semibold text-white flex items-center justify-end">{riderCount} <Ticket className="w-4 h-4 ml-2 text-primary" /></p>
            </div>
          </div>

          <div className="pb-4 border-b border-zinc-800">
             <div className="flex items-start mb-3">
               <div className="mt-1 w-2 h-2 rounded-full bg-primary mr-3" />
               <p className="text-sm text-secondary">Start: <span className="text-white">Current GPS Location</span></p>
             </div>
             <div className="flex items-start">
               <div className="mt-1 w-2 h-2 rounded-sm bg-red-500 mr-3" />
               <p className="text-sm text-secondary">Dest: <span className="text-white">Selected Dropoff</span></p>
             </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-secondary mb-1">Cash on Delivery</p>
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm text-white">{location.distanceKm.toFixed(1)} km</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white text-gradient">₹{Math.round(location.estimatedFare)}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(102,252,241,0.2)] hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all flex items-center justify-center mt-6"
          >
            CONFIRM RIDE
          </motion.button>
          
          <p className="text-center text-xs text-secondary/60 uppercase tracking-wide">
            No app payment required
          </p>

        </div>
      </motion.div>
    </PageWrapper>
  );
};
