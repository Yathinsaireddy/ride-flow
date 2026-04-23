import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Booking {
  id: string;
  bikeName: string;
  bikeRate: number;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  date: string;
  fare: number;
  riderName: string;
  riderPhone: string;
  riderEmail: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  clearBookings: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            ...state.bookings,
            {
              ...booking,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      clearBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'ride-flow-bookings', // name of the item in the storage (must be unique)
    }
  )
);
