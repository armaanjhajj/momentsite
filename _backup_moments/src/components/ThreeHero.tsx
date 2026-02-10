'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Generate asterisk logo shape positions (5-pronged star)
function generateAsteriskPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const numProng = 5; // 5 prongs
  const particlesPerProng = Math.floor(count / numProng);
  
  for (let i = 0; i < numProng; i++) {
    // Angle for this prong (start from top, go clockwise)
    const angle = (i * 72 - 90) * (Math.PI / 180); // -90 to start from top
    
    for (let j = 0; j < particlesPerProng; j++) {
      const idx = i * particlesPerProng + j;
      if (idx >= count) break;
      
      // Distance along the prong (from center to edge)
      const distance = (j / particlesPerProng) * 1.8 + 0.2; // Start 0.2 from center, go out to 2.0
      
      // Width variation for rectangular bar effect
      const width = 0.15;
      const widthOffset = (Math.random() - 0.5) * width;
      
      // Calculate position along the prong
      const x = Math.cos(angle) * distance + Math.sin(angle) * widthOffset;
      const y = Math.sin(angle) * distance - Math.cos(angle) * widthOffset;
      const z = (Math.random() - 0.5) * 0.1; // Slight depth variation
      
      arr[idx * 3 + 0] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = z;
    }
  }
  
  return arr;
}

// Generate scattered positions
function generateScatteredPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Spherical distribution
    const radius = Math.random() * 3 + 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    arr[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  return arr;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  const { asteriskPos, scatteredPos } = useMemo(() => {
    const count = 600;
    return {
      asteriskPos: generateAsteriskPositions(count),
      scatteredPos: generateScatteredPositions(count)
    };
  }, []);
  
  useFrame(({ clock }) => {
    if (!ref.current || !ref.current.geometry.attributes.position) return;
    
    const time = clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position;
    
    // Cycle: 0-3s form, 3-6s hold, 6-9s disperse, 9-12s scattered
    const cycleDuration = 12;
    const cycleTime = time % cycleDuration;
    
    let t = 0;
    if (cycleTime < 3) {
      // Forming phase (0-3s)
      t = cycleTime / 3;
      t = t * t * (3 - 2 * t); // Smooth ease
    } else if (cycleTime < 6) {
      // Hold formed (3-6s)
      t = 1;
    } else if (cycleTime < 9) {
      // Dispersing phase (6-9s)
      t = 1 - (cycleTime - 6) / 3;
      t = t * t * (3 - 2 * t); // Smooth ease
    } else {
      // Hold scattered (9-12s)
      t = 0;
    }
    
    // Interpolate between scattered and asterisk positions
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      positions.array[i3 + 0] = scatteredPos[i3 + 0] * (1 - t) + asteriskPos[i3 + 0] * t;
      positions.array[i3 + 1] = scatteredPos[i3 + 1] * (1 - t) + asteriskPos[i3 + 1] * t;
      positions.array[i3 + 2] = scatteredPos[i3 + 2] * (1 - t) + asteriskPos[i3 + 2] * t;
    }
    
    positions.needsUpdate = true;
    
    // Gentle rotation
    ref.current.rotation.z = Math.sin(time * 0.1) * 0.05;
  });
  
  return (
    <Points ref={ref} positions={scatteredPos} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.9}
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

