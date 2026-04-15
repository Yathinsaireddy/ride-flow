import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useWasm } from '../hooks/useWasm';
import { FloatingInput } from '../components/ui/FloatingInput';
import { MagneticButton } from '../components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export const RiderIdentity = () => {
  const navigate = useNavigate();
  const { riderDetails, setRiderDetails } = useStore();
  const { api } = useWasm();
  
  // Local validation states (using WASM logic)
  const isValidName = riderDetails.fullName.length >= 3;
  const isValidPhone = riderDetails.phone.length > 0 ? api.validatePhone(riderDetails.phone) : null;
  const isValidEmail = riderDetails.email.length > 0 ? api.validateEmail(riderDetails.email) : null;
  const isValidAddress = riderDetails.address.length >= 10;
  
  const formValid = isValidName && isValidPhone === true && isValidEmail === true && isValidAddress;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      navigate('/location');
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden absolute top-0 left-0 bg-background flex flex-col justify-center relative">
      {/* Page Peel Effect overlay using clip path */}
      <motion.div
        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
        animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        exit={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
        transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
        className="absolute inset-0 bg-surface z-0"
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      </motion.div>

      <div className="w-full max-w-2xl mx-auto px-6 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-10"
        >
          <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Step 3</h2>
          <h1 className="text-4xl font-bold text-white mb-2">Your Details</h1>
          <p className="text-secondary text-lg">We need a few details to secure your booking.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card p-8 md:p-12 rounded-3xl"
        >
          <form onSubmit={handleSubmit}>
            <FloatingInput 
              label="Full Name (Min 3 characters)"
              value={riderDetails.fullName}
              onChange={(e) => setRiderDetails({ fullName: e.target.value })}
              isValid={riderDetails.fullName.length > 0 ? isValidName : null}
            />
            
            <FloatingInput 
              label="Phone Number (+91...)"
              type="tel"
              value={riderDetails.phone}
              onChange={(e) => setRiderDetails({ phone: e.target.value })}
              isValid={isValidPhone}
            />

            <FloatingInput 
              label="Email Address"
              type="email"
              value={riderDetails.email}
              onChange={(e) => setRiderDetails({ email: e.target.value })}
              isValid={isValidEmail}
            />

            <FloatingInput 
              label="Current Address"
              isTextArea={true}
              value={riderDetails.address}
              onChange={(e) => setRiderDetails({ address: e.target.value })}
              isValid={riderDetails.address.length > 0 ? isValidAddress : null}
            />

            <div className="mt-10 flex justify-center">
              <MagneticButton 
                onClick={() => {}}
                className={formValid ? '' : 'opacity-50 pointer-events-none'}
              >
                Proceed to Destination
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
