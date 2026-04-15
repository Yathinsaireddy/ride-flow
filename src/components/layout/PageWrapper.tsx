import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: 100, // Slide in right
    scale: 1,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: -100, // Slide out left
    scale: 0.95,
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1], // cubic-bezier(0.4, 0, 0.2, 1) as requested
  duration: 0.4,
};

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`min-h-screen w-full overflow-hidden absolute top-0 left-0 ${className}`}
    >
      {children}
    </motion.div>
  );
};
