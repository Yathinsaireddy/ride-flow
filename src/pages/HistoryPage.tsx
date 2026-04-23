import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Zap, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';

const Logo = () => (
  <div className="flex flex-col leading-none">
    <span className="font-brand font-bold text-xl tracking-tight">
      <span className="text-secondary">RIDE</span>
      <span className="text-primary mx-1">⚡</span>
      <span className="text-primary">FLOW</span>
    </span>
  </div>
);

const PirateETACard = ({ distanceKm }: { distanceKm: number }) => {
  const initialSeconds = Math.max(60, Math.round((distanceKm / 40) * 60 * 60));
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex justify-between items-center bg-[#141414] border border-primary/30 rounded-xl p-4 shadow-[0_0_15px_rgba(194,240,58,0.1)] relative overflow-hidden">
      {/* Background pulse */}
      <motion.div 
        className="absolute inset-0 bg-primary/5"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="relative z-10">
        <span className="text-[10px] uppercase tracking-widest font-sans flex items-center gap-2 mb-1">
          <motion.span 
            animate={{ opacity: [1, 0.5, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-primary font-bold tracking-[0.3em]"
          >
            PIRATE ETA
          </motion.span>
        </span>
        <p className="text-primary font-brand font-bold text-3xl tracking-widest drop-shadow-[0_0_8px_rgba(194,240,58,0.4)]">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </p>
      </div>
      <motion.div 
        animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0px rgba(194,240,58,0)", "0 0 20px rgba(194,240,58,0.5)", "0 0 0px rgba(194,240,58,0)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="bg-primary/20 p-3 rounded-full border border-primary relative z-10"
      >
        <Bike className="w-7 h-7 text-primary drop-shadow-[0_0_5px_rgba(194,240,58,0.8)]" />
      </motion.div>
    </div>
  );
};

export const HistoryPage = () => {
  const navigate = useNavigate();
  const bookings = useBookingStore(state => state.bookings);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-tertiary hover:text-primary transition-colors text-sm uppercase tracking-widest font-sans"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Home
        </button>
        <Logo />
        <div className="w-20" /> {/* Spacer for alignment */}
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-brand font-bold text-4xl text-secondary mb-2">Booking History.</h1>
          <p className="text-tertiary text-sm font-sans mb-10">Review your past rides and reservations.</p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#2A2A2A] flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-tertiary" strokeWidth={1.5} />
            </div>
            <h3 className="font-brand font-bold text-xl text-secondary mb-2">No Bookings Yet</h3>
            <p className="text-tertiary text-sm font-sans mb-6">You haven't made any reservations. Time to book a ride?</p>
            <button onClick={() => navigate('/booking')}
              className="bg-primary text-[#0F0F0F] px-8 py-3 rounded-full font-brand font-bold text-sm uppercase tracking-widest hover:bg-[#d4ff4a] transition-colors duration-200">
              Book a Ride
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.slice().reverse().map((booking, i) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-brand font-bold text-2xl text-secondary">{booking.bikeName}</h3>
                    <p className="text-tertiary text-xs font-sans mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[#2A2A2A] rounded-full px-4 py-1.5 flex items-center gap-2 self-start md:self-auto">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary text-xs uppercase tracking-wider font-brand font-bold">Confirmed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Route Info */}
                  <div className="space-y-4">
                    {/* Pirate ETA Timer */}
                    <PirateETACard distanceKm={booking.distanceKm} />

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center pt-2 gap-2 relative">
                        <div className="w-3 h-3 rounded-full border-2 border-tertiary bg-[#0F0F0F] z-10" />
                        
                        <div className="w-1 flex-1 min-h-[4rem] bg-[#2A2A2A] rounded-full relative">
                          <motion.div
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] p-1 rounded-full z-20 shadow-[0_0_10px_rgba(194,240,58,0.3)] border border-primary/50"
                          >
                             <Bike className="w-3.5 h-3.5 text-primary" />
                          </motion.div>
                        </div>
                        
                        <MapPin className="w-4 h-4 text-primary z-10 bg-[#0F0F0F]" />
                      </div>
                      
                      <div className="space-y-6 py-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-tertiary uppercase tracking-widest font-sans mb-1">Pickup</p>
                          <p className="text-sm text-secondary font-sans leading-snug">{booking.pickup}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-tertiary uppercase tracking-widest font-sans mb-1">Drop-off</p>
                          <p className="text-sm text-secondary font-sans leading-snug">{booking.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Info */}
                  <div className="bg-[#141414] border border-[#252525] rounded-xl p-4 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">Date</span>
                        <span className="text-xs text-secondary font-sans">{booking.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">Distance</span>
                        <span className="text-xs text-secondary font-sans">{booking.distanceKm.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">Rider</span>
                        <span className="text-xs text-secondary font-sans">{booking.riderName}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-[#252525] flex justify-between items-center">
                      <span className="text-[10px] text-tertiary uppercase tracking-widest font-sans">Total Fare</span>
                      <span className="text-primary font-brand font-bold text-xl">₹{booking.fare}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
