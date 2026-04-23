import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HeroLanding } from './pages/HeroLanding';
import { BookingPage } from './pages/BookingPage';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroLanding />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
