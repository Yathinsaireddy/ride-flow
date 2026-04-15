import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { generateSpherePositions } from './utils'; // We'll create this to generate floating particles

const AbstractBike = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Front Wheel */}
      <mesh position={[1.5, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} wireframe />
      </mesh>
      
      {/* Rear Wheel */}
      <mesh position={[-1.5, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Frame (Abstract) */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[2.5, 0.15, 0.15]} />
        <meshStandardMaterial color="#F1F5F9" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1.5, 0.15, 0.15]} />
        <meshStandardMaterial color="#0A192F" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Handlebars */}
      <mesh position={[1, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#1D4ED8" />
      </mesh>
      
      <mesh position={[1, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color="#F1F5F9" metalness={0.9} />
      </mesh>
    </group>
  );
};

const Particles = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Create 500 particles as per spec
  const [positions] = React.useState(() => generateSpherePositions(500, 5));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3B82F6"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#3B82F6" />
        <spotLight position={[-10, -10, -5]} intensity={0.5} color="#1D4ED8" />
        
        <Particles />
        


        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
