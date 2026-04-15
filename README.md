# 🏍️ Ride-Flow: Next-Gen Bike Booking Platform

![Ride-Flow Preview](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-3D_Rendering-black)
![C++](https://img.shields.io/badge/C++-WebAssembly-purple)

**Ride-Flow** is a high-performance, single-page bike rental application designed to provide an unparalleled user experience. It combines an immersive 3D frontend with lightning-fast C++ core logic running directly in the browser via WebAssembly (WASM).

Operating on a seamless "Pay-After-Ride" cash model, Ride-Flow ensures high-conversion bookings without the friction of complex payment gateway integrations.

---

## ✨ Key Features

- **🚀 WebAssembly Core Logic:** Heavy computational tasks (fare calculations, distance algorithms, and time estimations) are written in C++17 and compiled to WASM via Emscripten for unmatched execution speed right in the browser.
- **🌌 Immersive 3D UI:** Powered by Three.js and React-Three-Fiber, featuring a responsive, dynamic particle environment and a sleek Glassmorphism aesthetic.
- **🗺️ Advanced Location Mapping:** Built-in interactive map powered by React-Leaflet. Features real-time GPS synchronization, Google Maps-style free text search natively powered by Nominatim OpenStreetMap API, and dynamic route drawing.
- **⚡ Reactive & Fluid:** Utilizing Framer Motion for buttery-smooth page transitions and Zustand for minimalist, hyper-efficient global state management.
- **📱 Fully Responsive:** Carefully crafted with Tailwind CSS to ensure a beautiful experience on both mobile devices and desktop environments.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework:** React 18+ (Vite Bundler)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** Three.js, React-Three-Fiber, Drei
- **Routing:** React Router v6
- **State Management:** Zustand
- **Mapping:** React Leaflet & Leaflet.js

### Core Processing Hub
- **Language:** C++17
- **Compilation Target:** WebAssembly (WASM)
- **Compiler:** Emscripten (emcc)

---

## 💻 Setup & Local Development

### Prerequisites
1. **Node.js**: v18 or higher
2. **Emscripten SDK (emsdk)**: Required only if you intend to modify and recompile the C++ WASM bindings.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yathinsaireddy/ride-flow.git
   cd ride-flow
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Navigate to:** `http://localhost:5173/`

### Compiling C++ to WASM
If you modify `/src/cpp/bindings.cpp`, you must recompile the WebAssembly modules. Navigate to the project root and run your emcc compilation script:

```bash
emcc src/cpp/bindings.cpp -o public/wasm/core.js -O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="createModule" --bind
```

---

## 🚦 System Flow

1. **Hero Landing:** Abstract 3D environment greeting the user.
2. **Ride Configuration:** Select the number of riders.
3. **Garage Selection:** Dynamic 3D presentation of available vehicle chassis based on the requested capacity.
4. **Identity Verification:** Frictionless form capture for rider details.
5. **Interactive Mapping:** Drop pins or search specific addresses using the Nominatim reverse/forward geocoding system. Calculates estimated fare using WASM logic based on geometric distance.
6. **Booking Confirmation:** Overview of selection and Cash-On-Delivery finalization.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and available under the MIT License.
