import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const IMAGES = [
  '/wildlife/panther.png',
  '/wildlife/tiger.png',
  '/wildlife/elephant.png',
  '/wildlife/rhino.png',
  '/wildlife/lion.png'
];

const QUOTES = [
  '"The earth has music for those who listen." - William Shakespeare',
  '"Look deep into nature, and then you will understand everything better." - Albert Einstein',
  '"Conservation is a state of harmony between men and land." - Aldo Leopold',
  '"What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves." - Mahatma Gandhi',
  '"The greatest threat to our planet is the belief that someone else will save it." - Robert Swan',
  '"In every walk with nature one receives far more than he seeks." - John Muir',
  '"Nature is not a place to visit. It is home." - Gary Snyder',
  '"We don\'t inherit the earth from our ancestors, we borrow it from our children." - Native American Proverb'
];

export const EVTransitionAnimation: React.FC<Props> = ({ onComplete }) => {
  const [bgImage, setBgImage] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a random image and quote on mount
    const randomImg = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setBgImage(randomImg);
    setQuote(randomQuote);

    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // Wait 4.5 seconds before moving to next step
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!bgImage) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 4.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

      {/* Text Content */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 text-center px-4"
      >
        <h2 className="font-brand font-bold text-5xl md:text-7xl text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] tracking-tight uppercase">
          You saved a wildlife
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[#39FF14] text-xl md:text-2xl font-sans mt-6 uppercase tracking-[0.3em] font-bold drop-shadow-[0_0_10px_rgba(57,255,20,0.6)]"
        >
          Zero Emissions. Pure Future.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <p className="text-white/90 text-sm md:text-base font-sans italic tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            {quote}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
