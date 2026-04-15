import { create } from 'zustand';

interface RideState {
  riderCount: number;
  selectedBikeId: number | null;
  riderDetails: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  location: {
    start: [number, number] | null;
    end: [number, number] | null;
    distanceKm: number;
    estimatedFare: number;
    estimatedTimeMin: number;
  };
  
  // Actions
  setRiderCount: (count: number) => void;
  setSelectedBikeId: (id: number) => void;
  setRiderDetails: (details: Partial<RideState['riderDetails']>) => void;
  setLocation: (loc: Partial<RideState['location']>) => void;
}

export const useStore = create<RideState>((set) => ({
  riderCount: 1,
  selectedBikeId: null,
  riderDetails: {
    fullName: '',
    phone: '',
    email: '',
    address: '',
  },
  location: {
    start: null,
    end: null,
    distanceKm: 0,
    estimatedFare: 0,
    estimatedTimeMin: 0,
  },
  
  setRiderCount: (count) => set({ riderCount: count }),
  setSelectedBikeId: (id) => set({ selectedBikeId: id }),
  setRiderDetails: (details) => set((state) => ({ 
    riderDetails: { ...state.riderDetails, ...details } 
  })),
  setLocation: (loc) => set((state) => ({ 
    location: { ...state.location, ...loc } 
  })),
}));
