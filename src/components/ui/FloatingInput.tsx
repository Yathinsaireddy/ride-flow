import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isValid?: boolean | null; // null means untested
  required?: boolean;
  isTextArea?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  isValid = null,
  required = true,
  isTextArea = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative w-full mb-6 py-2 group">
      {isTextArea ? (
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className="w-full bg-transparent outline-none text-white text-lg py-2 border-b-2 border-white/20 focus:border-transparent transition-colors resize-none min-h-[100px]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className="w-full bg-transparent outline-none text-white text-lg py-2 border-b-2 border-white/20 focus:border-transparent transition-colors"
        />
      )}
      
      {/* Animated Label */}
      <motion.label
        initial={false}
        animate={{
          y: isActive ? (isTextArea ? -24 : -24) : (isTextArea ? 10 : 8),
          scale: isActive ? 0.8 : 1,
          color: isFocused ? '#66FCF1' : (isValid === false ? '#ef4444' : '#C5C6C7'),
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-0 top-2 origin-top-left pointer-events-none"
      >
        {label}
      </motion.label>

      {/* SVG Stroke animation border */}
      <div className="absolute bottom-2 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: isFocused ? "0%" : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-full h-full ${isValid === false ? 'bg-red-500' : 'bg-primary'}`}
        />
      </div>

      {/* Morphing checkmark for success state */}
      <AnimatePresence>
        {isValid === true && value.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0, right: -20 }}
            animate={{ scale: 1, opacity: 1, right: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-4 text-green-400"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
