import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HeroLanding } from './pages/HeroLanding';
import { RiderConfig } from './pages/RiderConfig';
import { GarageSelection } from './pages/GarageSelection';

import { RiderIdentity } from './pages/RiderIdentity';
import { LocationMapping } from './pages/LocationMapping';
import { Confirmation } from './pages/Confirmation';

function App() {
  return (
    <BrowserRouter>
      {/* Route level abstraction to capture location key for animate presence */}
      <AppRoutes />
    </BrowserRouter>
  );
}

import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroLanding />} />
        <Route path="/config" element={<RiderConfig />} />
        <Route path="/garage" element={<GarageSelection />} />
        <Route path="/identity" element={<RiderIdentity />} />
        <Route path="/location" element={<LocationMapping />} />
        <Route path="/confirm" element={<Confirmation />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
