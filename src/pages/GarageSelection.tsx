import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PageWrapper } from '../components/layout/PageWrapper';
import { BikeCard, BikeData } from '../components/ui/BikeCard';
import { MagneticButton } from '../components/ui/Button';
import { Canvas } from '@react-three/fiber';

// Mock DB of 10 Bikes
const BIKES: BikeData[] = [
  { id: 1, name: "Activa 6G", cc: "110cc", color: "Pearl White", pricePerKm: 8, capacity: 1 },
  { id: 2, name: "Jupiter 125", cc: "125cc", color: "Matte Blue", pricePerKm: 9, capacity: 1 },
  { id: 3, name: "Classic 350", cc: "350cc", color: "Stealth Black", pricePerKm: 15, capacity: 2 },
  { id: 4, name: "Duke 200", cc: "200cc", color: "Orange/Black", pricePerKm: 14, capacity: 2 },
  { id: 5, name: "MT-15 V2", cc: "155cc", color: "Cyan Storm", pricePerKm: 13, capacity: 2 },
  { id: 6, name: "Himalayan 450", cc: "450cc", color: "Kamet White", pricePerKm: 18, capacity: 2 },
  { id: 7, name: "Ninja 300", cc: "300cc", color: "Lime Green", pricePerKm: 22, capacity: 2 },
  { id: 8, name: "Access 125", cc: "125cc", color: "Metallic Silver", pricePerKm: 9, capacity: 1 },
  { id: 9, name: "Dominar 400", cc: "373cc", color: "Aurora Green", pricePerKm: 16, capacity: 2 },
  { id: 10, name: "R15 V4", cc: "155cc", color: "Racing Blue", pricePerKm: 14, capacity: 2 },
];

const WireframeBikeBackground = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none opacity-20 z-0">
      <Canvas>
        <ambientLight intensity={1} />
        <mesh rotation={[0.4, 0.5, 0]} scale={2.5} position={[0, -1, 0]}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshBasicMaterial color="#3B82F6" wireframe />
        </mesh>
      </Canvas>
    </div>
  );
};

export const GarageSelection = () => {
  const navigate = useNavigate();
  const { riderCount, selectedBikeId, setSelectedBikeId } = useStore();

  return (
    <PageWrapper className="bg-background flex flex-col justify-center min-h-screen">
      <WireframeBikeBackground />
      
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-between items-end flex-wrap gap-4"
        >
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[#ffd700] font-bold mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Step 2</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Choose Your Ride</h1>
            <p className="text-secondary mt-2">Showing vehicles suitable for {riderCount} rider{riderCount > 1 ? 's' : ''}.</p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedBikeId ? 1 : 0 }}
            className={selectedBikeId ? 'pointer-events-auto' : 'pointer-events-none'}
          >
            <MagneticButton onClick={() => navigate('/identity')} className="border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700] hover:bg-[#ffd700]/20 hover:border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              Confirm Vehicle
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Horizontal scroll carousel container */}
        <div className="w-full overflow-x-auto pb-12 pt-4 px-4 -mx-4 hide-scrollbar snap-x snap-mandatory">
          <div className="flex gap-8 w-max">
            {BIKES.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="snap-center"
              >
                <BikeCard 
                  bike={bike}
                  isSelected={selectedBikeId === bike.id}
                  onSelect={setSelectedBikeId}
                  disabled={riderCount > bike.capacity}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styles locally */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </PageWrapper>
  );
};
