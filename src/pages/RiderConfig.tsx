import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MagneticButton } from '../components/ui/Button';

export const RiderConfig = () => {
  const navigate = useNavigate();
  const { riderCount, setRiderCount } = useStore();

  const handleIncrement = () => setRiderCount(Math.min(2, riderCount + 1));
  const handleDecrement = () => setRiderCount(Math.max(1, riderCount - 1));

  return (
    <PageWrapper className="bg-background relative flex items-center justify-center">
      {/* Abstract particle background simulation using CSS radial gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] mix-blend-screen animate-blob" />
        <div className="absolute top-[40%] right-[20%] w-[40vw] h-[40vw] bg-[#1D4ED8]/10 rounded-full blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Counter Selection */}
        <div className="flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Step 1</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">How many riders?</h1>
            <p className="text-secondary text-lg">Select the number of passengers for your ride.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-6"
          >
            <button 
              onClick={handleDecrement}
              disabled={riderCount <= 1}
              className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-3xl font-light hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/20 transition-all cursor-pointer"
            >
              -
            </button>
            <div className="w-24 text-center font-bold text-6xl text-white tracking-tighter">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={riderCount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="inline-block"
                >
                  {riderCount}
                </motion.span>
              </AnimatePresence>
            </div>
            <button 
              onClick={handleIncrement}
              disabled={riderCount >= 2}
              className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-3xl font-light hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/20 transition-all cursor-pointer"
            >
              +
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <MagneticButton 
              onClick={() => navigate('/garage')} 
              className={riderCount > 0 ? "border-[#3B82F6] shadow-[0_0_15px_rgba(102,252,241,0.2)]" : "opacity-50 pointer-events-none"}
            >
              Continue to Garage
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Side: Visual Feedback */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-card rounded-3xl p-10 h-96 flex items-center justify-center relative overflow-hidden"
        >
          <div className="flex justify-center gap-8 relative z-10">
            <AnimatePresence>
              {[...Array(riderCount)].map((_, i) => (
                <motion.div
                  key={`avatar-${i}`}
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -50 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(102,252,241,0.2)] ${i === 0 ? 'bg-primary/20 border-2 border-primary' : 'bg-[#1D4ED8]/20 border-2 border-[#1D4ED8]'}`}>
                    <User className={`w-16 h-16 ${i === 0 ? 'text-primary' : 'text-[#1D4ED8]'}`} />
                  </div>
                  <span className="text-secondary font-medium tracking-wide uppercase text-sm">
                    {i === 0 ? "Primary Rider" : "Pillion / Co-Rider"}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-0" />
        </motion.div>

      </div>
    </PageWrapper>
  );
};
