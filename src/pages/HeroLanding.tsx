import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroScene } from '../components/3d/HeroScene';
import { MagneticButton } from '../components/ui/Button';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ChevronDown } from 'lucide-react';

export const HeroLanding = () => {
  const navigate = useNavigate();

  // Scroll to trigger transition, as well as button click
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navigate('/config');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <PageWrapper className="h-[120vh]"> {/* Allowing slight scroll to trigger next page */}
      <HeroScene />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="glass-card p-10 md:p-14 rounded-3xl max-w-lg text-center mx-4 pointer-events-auto relative overflow-hidden"
        >
          {/* Subtle moving gradient background in card */}
          <div className="absolute -inset-24 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 animate-blob blur-3xl pointer-events-none" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-white drop-shadow-lg"
          >
            <span className="text-[#3B82F6]">RIDE</span>
            <span className="text-white px-1">-</span>
            <span className="text-gradient">FLOW</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-secondary mb-10 font-medium font-sans"
          >
            Rent. Ride. Return. Pay Cash.
          </motion.p>
          
          <MagneticButton onClick={() => navigate('/config')} className="w-full text-lg shadow-[0_0_20px_rgba(102,252,241,0.3)]">
            Start Your Journey
          </MagneticButton>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 animate-bounce flex flex-col items-center opacity-70 pointer-events-none"
        >
          <span className="text-sm font-medium tracking-widest text-[#F1F5F9] mb-2 uppercase">Scroll down</span>
          <ChevronDown className="w-6 h-6 text-[#3B82F6]" />
        </motion.div>
      </div>
    </PageWrapper>
  );
};
