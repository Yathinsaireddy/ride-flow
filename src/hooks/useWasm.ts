import { useState, useEffect } from 'react';

// Mock implementation of the C++ WebAssembly module bindings.
// When Emscripten is configured, this hook will load the actual WASM bundle.
export const useWasm = () => {
  const [isReady, setIsReady] = useState(true); // Mocking instant load since it's just JS right now.

  const validatePhone = (number: string, country: string = "IN") => {
    // Basic regex simulating the C++ behavior
    // Indian format: +91 xxxxxxxxxx or just 10 digits
    const regex = /^(\+91[\-\s]?)?[0-9]{10}$/;
    return regex.test(number);
  };

  const validateEmail = (email: string) => {
    // Basic RFC 5322 regex approximation for JS
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula simulated
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateFare = (distanceKm: number, riders: number, basePrice: number) => {
    // (Base ₹30 + (PriceRate * km)) * (surge 1.2 if 2 riders but bike handles 2) -> Let's keep it simple
    return 30 + (basePrice * distanceKm);
  };

  const estimateTimeMinutes = (distanceKm: number) => {
    // Average bike speed: 25km/h urban
    return Math.ceil((distanceKm / 25) * 60);
  };

  return {
    isReady,
    api: {
      validatePhone,
      validateEmail,
      calculateDistance,
      calculateFare,
      estimateTimeMinutes
    }
  };
};
