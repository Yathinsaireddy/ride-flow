import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface BikeData {
  id: number;
  name: string;
  cc: string;
  color: string;
  pricePerKm: number;
  capacity: number; // 1 for scooter, 2 for bike
}

interface BikeCardProps {
  bike: BikeData;
  isSelected: boolean;
  onSelect: (id: number) => void;
  disabled: boolean; // if riderCount > bike capacity
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, isSelected, onSelect, disabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // 3D Parallax effect on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !disabled && onSelect(bike.id)}
      animate={{
        scale: isSelected ? 1.05 : 1,
        borderColor: isSelected ? '#ffd700' : 'rgba(255,255,255,0.1)',
        boxShadow: isSelected ? '0 0 30px rgba(255,215,0,0.3)' : '0 10px 30px rgba(0,0,0,0.5)',
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-[300px] h-[400px] shrink-0 rounded-2xl overflow-hidden glass-card cursor-pointer border-2 transition-colors duration-300 group
        ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      {/* Top 60%: Image container */}
      <div 
        className="h-[60%] w-full relative overflow-hidden bg-white/5 bike-image-slot"
        data-bike-id={bike.id}
        style={{ transform: "translateZ(30px)" }} // Pop out effect
      >
        {/* Placeholder gradient mimicking a studio light setup for the bike */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
        
        {/* The actual image path for user to drop files */}
        <img 
          src={`/bikes/bike-${bike.id}.jpg`} 
          alt={bike.name}
          className="w-full h-full object-cover relative z-0 transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Fallback if user hasn't added the image yet
            (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="240" fill="%231a1a2e"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="%2366FCF1" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">bike-${bike.id}.jpg</text></svg>`;
          }}
        />

        {disabled && (
          <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-20">
            Capacity: {bike.capacity}
          </div>
        )}
      </div>

      {/* Bottom 40%: Details */}
      <div className="h-[40%] bg-surface/90 backdrop-blur-xl p-5 flex flex-col justify-between relative z-20">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-white">{bike.name}</h3>
            <span className="text-sm font-medium px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30">
              {bike.cc}
            </span>
          </div>
          <p className="text-sm text-secondary capitalize">{bike.color}</p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-secondary block uppercase tracking-wider">Rate</span>
            <span className="text-xl font-bold text-white">₹{bike.pricePerKm}<span className="text-sm font-normal text-secondary">/km</span></span>
          </div>
        </div>
      </div>

      {/* Select Overlay -> Slides up on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-primary/90 to-primary/40 backdrop-blur-md flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
        <span className="text-white font-bold tracking-widest text-lg drop-shadow-md">
          {isSelected ? 'SELECTED' : 'SELECT VEHICLE'}
        </span>
      </div>
    </motion.div>
  );
};
