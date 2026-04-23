/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        surface: '#1A1A1A',
        'surface-2': '#161616',
        'surface-3': '#141414',
        navy: '#111111',
        primary: '#C2F03A',       // Electric Lime
        secondary: '#F0F0F0',     // Off-white headings
        tertiary: '#888888',      // Muted text
        'border-dark': '#2A2A2A',
        'border-medium': '#1F1F1F',
        'border-card': '#252525',
        'dot-red': '#FF4B4B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        brand: ['Chakra Petch', 'sans-serif'],
      },
      boxShadow: {
        'lime-halo': '0 0 20px rgba(194, 240, 58, 0.15)',
        'lime-glow': '0 0 30px rgba(194, 240, 58, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}
