import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, X, Menu, Zap, Leaf, Clock, ArrowRight, Shield, MapPin } from 'lucide-react';

// ─── Shared Logo ──────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex flex-col leading-none cursor-pointer">
    <span className="font-brand font-bold text-xl tracking-tight">
      <span className="text-secondary">RIDE</span>
      <span className="text-primary mx-1">⚡</span>
      <span className="text-primary">FLOW</span>
    </span>
    <span className="text-[9px] text-tertiary tracking-[0.22em] uppercase font-sans mt-0.5">
      Rent. Ride. Return.
    </span>
  </div>
);

// ─── Full-Screen Menu Overlay ─────────────────────────────────────────────────
const navItems = ['Home', 'About Us', 'Our Mission', 'My Bookings'];

const MenuOverlay = ({ open, onClose, onBook }: { open: boolean; onClose: () => void; onBook: () => void }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        key="menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
      >
        {/* top bar */}
        <div className="flex justify-between items-center px-8 py-6">
          <Logo />
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary transition-colors duration-200 p-2"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* nav links */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={item === 'My Bookings' ? '/history' : `#${item.toLowerCase().replace(/ /g, '-')}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              onClick={onClose}
              className="font-brand font-bold text-4xl md:text-6xl text-secondary hover:text-primary transition-colors duration-200 uppercase tracking-wider"
            >
              {item}
            </motion.a>
          ))}

          {/* Primary CTA */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => { onBook(); onClose(); }}
            className="mt-6 bg-primary text-[#0F0F0F] font-brand font-bold text-xl px-12 py-4 rounded-full uppercase tracking-widest hover:bg-[#d4ff4a] transition-colors duration-200 flex items-center gap-3"
          >
            Book Your Ride <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* bottom line */}
        <div className="px-8 py-6 border-t border-[#1A1A1A]">
          <p className="text-tertiary text-xs font-sans tracking-widest text-center uppercase">
            Eco-Friendly · Affordable · Instant
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Section: About ───────────────────────────────────────────────────────────
const AboutSection = () => (
  <section id="about-us" className="relative bg-[#0F0F0F] py-28 px-8">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-4">Who We Are</p>
        <h2 className="font-brand font-bold text-5xl md:text-6xl text-secondary leading-tight mb-8">
          Smart Mobility<br />
          <span className="text-primary">Redefined.</span>
        </h2>
        <div className="w-12 h-px bg-primary mb-10" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            icon: <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />,
            title: 'Instant Booking',
            desc: 'Reserve your ride in under 60 seconds — no app required. Walk up, scan, and go.',
          },
          {
            icon: <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />,
            title: 'Urban Focused',
            desc: 'Strategically placed docking hubs across the city for maximum convenience.',
          },
          {
            icon: <Shield className="w-6 h-6 text-primary" strokeWidth={1.5} />,
            title: 'Safe & Insured',
            desc: 'Every ride is fully insured. Helmets, safety checks, and 24/7 roadside support included.',
          },
          {
            icon: <Leaf className="w-6 h-6 text-primary" strokeWidth={1.5} />,
            title: 'Zero Emissions',
            desc: 'Our fleet runs entirely on electricity. No fumes, no guilt — just clean miles.',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-5 group"
          >
            <div className="mt-1 w-10 h-10 rounded-xl border border-[#2A2A2A] group-hover:border-primary flex items-center justify-center shrink-0 transition-colors duration-200">
              {card.icon}
            </div>
            <div>
              <h3 className="font-brand font-bold text-secondary text-lg mb-2">{card.title}</h3>
              <p className="text-tertiary text-sm font-sans leading-relaxed">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Section: EV Vision ───────────────────────────────────────────────────────
const EVSection = () => (
  <section id="our-mission" className="relative bg-[#111111] py-28 px-8 overflow-hidden">
    {/* Accent radial */}
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(194,240,58,0.06) 0%, transparent 70%)' }}
    />
    <div className="max-w-5xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-4">Our Vision</p>
          <h2 className="font-brand font-bold text-5xl md:text-6xl text-secondary leading-tight mb-6">
            Driving the<br />
            Future with<br />
            <span className="text-primary">EV.</span>
          </h2>
          <div className="w-12 h-px bg-primary mb-8" />
          <p className="text-tertiary font-sans leading-relaxed mb-6">
            We're on a mission to replace every fuel-powered two-wheeler in the city with clean, electric alternatives. Urban transport shouldn't cost the planet.
          </p>
          <p className="text-tertiary font-sans leading-relaxed">
            By 2027, we aim to eliminate <span className="text-secondary font-medium">50,000 tonnes</span> of CO₂ emissions through our EV fleet expansion across 20 cities.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { stat: '100%', label: 'Electric Fleet' },
            { stat: '0g', label: 'CO₂ per km' },
            { stat: '20+', label: 'Cities by 2027' },
            { stat: '₹8/km', label: 'Starting Rate' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-primary transition-colors duration-200"
            >
              <p className="font-brand font-bold text-3xl text-primary mb-1">{item.stat}</p>
              <p className="text-tertiary text-xs font-sans uppercase tracking-widest">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Section: Why Choose Us ───────────────────────────────────────────────────
const WhySection = () => {
  const features = [
    { icon: <Clock className="w-7 h-7" strokeWidth={1.5} />, title: 'Fast Booking', desc: 'Book in under 60 seconds from any device. No account needed.' },
    { icon: <Zap className="w-7 h-7" strokeWidth={1.5} />, title: 'Affordable Pricing', desc: 'Starting at ₹8/km — the most competitive rate in the market.' },
    { icon: <Leaf className="w-7 h-7" strokeWidth={1.5} />, title: 'Eco-Friendly', desc: '100% electric fleet — zero emissions, zero guilt, pure freedom.' },
    { icon: <ArrowRight className="w-7 h-7" strokeWidth={1.5} />, title: 'Easy Return', desc: 'Drop off at any hub location. No penalties for early returns.' },
  ];

  return (
    <section className="bg-[#0F0F0F] py-28 px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-brand font-bold uppercase tracking-[0.3em] mb-4">Why RIDEFLOW</p>
          <h2 className="font-brand font-bold text-5xl md:text-6xl text-secondary">
            Built for the<br /><span className="text-primary">Modern Rider.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-7 hover:border-primary group transition-colors duration-200"
            >
              <div className="text-tertiary group-hover:text-primary transition-colors duration-200 mb-5">
                {f.icon}
              </div>
              <h3 className="font-brand font-bold text-secondary text-lg mb-3">{f.title}</h3>
              <p className="text-tertiary text-sm font-sans leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section: CTA ─────────────────────────────────────────────────────────────
const CTASection = ({ onBook }: { onBook: () => void }) => (
  <section className="bg-[#111111] py-28 px-8">
    <div className="max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Big lime line accent */}
        <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />
        <h2 className="font-brand font-bold text-5xl md:text-7xl text-secondary leading-tight mb-6">
          Start Your<br /><span className="text-primary">EV Journey</span><br />Today.
        </h2>
        <p className="text-tertiary font-sans text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Join thousands of riders choosing clean, affordable, and instant electric mobility across the city.
        </p>
        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: '#d4ff4a' }}
          whileTap={{ scale: 0.97 }}
          onClick={onBook}
          className="bg-primary text-[#0F0F0F] font-brand font-bold text-lg px-14 py-5 rounded-full uppercase tracking-widest transition-colors duration-200 inline-flex items-center gap-3"
        >
          Book Now <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] py-10 px-8">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <Logo />
      <p className="text-tertiary text-xs font-sans tracking-widest uppercase">
        © 2026 RideFlow. All rights reserved.
      </p>
    </div>
  </footer>
);

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = ({ onMenu, onBook }: { onMenu: () => void; onBook: () => void }) => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section className="relative min-h-screen flex flex-col bg-[#0F0F0F] overflow-hidden">
      {/* Lime radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(194,240,58,0.07) 0%, transparent 68%)' }}
      />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <Logo />
        <button
          onClick={onMenu}
          className="text-tertiary hover:text-primary transition-colors duration-200 flex items-center gap-2 font-sans text-sm tracking-widest uppercase"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
          <span className="hidden sm:inline">Menu</span>
        </button>
      </nav>

      {/* Hero content */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-brand font-bold leading-none mb-6 select-none"
          style={{ fontSize: 'clamp(5rem, 15vw, 11rem)' }}
        >
          <span className="text-secondary">RIDE</span>
          <span className="text-primary">FLOW</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-tertiary text-sm md:text-base tracking-[0.35em] uppercase font-sans mb-12"
        >
          Rent. Ride. Return. Pay Cash.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          whileHover={{ scale: 1.04, backgroundColor: '#d4ff4a' }}
          whileTap={{ scale: 0.97 }}
          onClick={onBook}
          className="bg-primary text-[#0F0F0F] font-brand font-bold text-base px-10 py-4 rounded-full uppercase tracking-widest transition-colors duration-200 flex items-center gap-3"
        >
          Start Your Journey <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] text-tertiary tracking-[0.3em] uppercase font-sans">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-tertiary" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const HeroLanding = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBook = () => navigate('/booking');
  const handleHistory = () => navigate('/history');

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onBook={handleBook} />

      <HeroSection onMenu={() => setMenuOpen(true)} onBook={handleBook} />
      <AboutSection />
      <EVSection />
      <WhySection />
      <CTASection onBook={handleBook} />
      <Footer />
    </div>
  );
};
