import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Trail, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AtomProps } from '../types';

// Helper to distribute points on a sphere
const getSpherePoints = (n: number, radius: number) => {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return points;
};

// Nucleus Component
const Nucleus: React.FC<{ protons: number; neutrons: number }> = ({ protons, neutrons }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Distribute nucleons
  const particles = useMemo(() => {
    const totalParticles = protons + neutrons;
    // Tightly pack them
    const positions = getSpherePoints(totalParticles, Math.pow(totalParticles, 1/3) * 0.4);
    
    return positions.map((pos, i) => ({
      position: pos,
      type: i < protons ? 'proton' : 'neutron'
    }));
  }, [protons, neutrons]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={p.type === 'proton' ? '#ff3333' : '#4444ff'} 
            emissive={p.type === 'proton' ? '#550000' : '#000055'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
      {/* Glow for Nucleus */}
      <pointLight distance={10} intensity={2} color="#ffaa00" />
    </group>
  );
};

// Electron Component
const Electron: React.FC<{ 
  radius: number; 
  speed: number; 
  offset: number; 
  tilt: [number, number, number];
  color: string;
}> = ({ radius, speed, offset, tilt, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  const angleRef = useRef(offset);

  useFrame((state, delta) => {
    if (ref.current) {
      angleRef.current += speed * delta;
      
      // Calculate position on a tilted orbit
      const x = Math.cos(angleRef.current) * radius;
      const z = Math.sin(angleRef.current) * radius;
      
      // Apply tilt logic manually or utilize group rotation. 
      // Here we just set position relative to parent group which handles tilt.
      ref.current.position.set(x, 0, z);
    }
  });

  return (
    <group rotation={new THREE.Euler(...tilt)}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Orbital Path Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color={color} opacity={0.1} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const ElectronShells: React.FC<{ count: number; speedMultiplier: number }> = ({ count, speedMultiplier }) => {
  // Simple shell config (2, 8, 18...)
  const shells = [2, 8, 18, 32, 32, 18, 8];
  const electrons = useMemo(() => {
    let remaining = count;
    const result = [];
    let shellIndex = 0;
    
    while (remaining > 0 && shellIndex < shells.length) {
      const inThisShell = Math.min(remaining, shells[shellIndex]);
      const radius = 2.5 + shellIndex * 1.5;
      
      for (let i = 0; i < inThisShell; i++) {
        result.push({
          radius,
          speed: (1.5 - shellIndex * 0.2) * speedMultiplier,
          offset: (Math.PI * 2 * i) / inThisShell,
          tilt: [
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            Math.random() * Math.PI
          ] as [number, number, number],
          id: `e-${shellIndex}-${i}`
        });
      }
      
      remaining -= inThisShell;
      shellIndex++;
    }
    return result;
  }, [count, speedMultiplier]);

  return (
    <group>
      {electrons.map((e) => (
        <Electron 
          key={e.id}
          radius={e.radius}
          speed={e.speed}
          offset={e.offset}
          tilt={e.tilt}
          color="#00ffff"
        />
      ))}
    </group>
  );
};

export const AtomScene: React.FC<AtomProps> = ({ atomicNumber, speed = 1 }) => {
  // Estimate neutron count for stability (rough approximation for viz)
  const neutrons = useMemo(() => {
    if (atomicNumber === 1) return 0; // Protium
    return Math.round(atomicNumber * 1.2); // Rough heuristic
  }, [atomicNumber]);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} className="w-full h-full bg-transparent">
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          <Nucleus protons={atomicNumber} neutrons={neutrons} />
          <ElectronShells count={atomicNumber} speedMultiplier={speed} />
        </group>
      </Float>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
      </EffectComposer>
      
      <OrbitControls enablePan={false} maxDistance={50} minDistance={5} />
    </Canvas>
  );
};