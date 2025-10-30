'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    
    // Create constellation-like distribution
    for (let i = 0; i < count; i++) {
      // Spherical distribution with bias toward center
      const radius = Math.random() * 3 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      arr[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return arr;
  }, []);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      // Slow, gentle rotation
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.1;
    }
  });
  
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

export default function ThreeHero() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <Particles />
    </Canvas>
  );
}

