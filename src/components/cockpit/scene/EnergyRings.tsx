import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SingleRingProps {
  delay: number;
  speed: number;
  intensity: number;
  status: string;
}

const SingleRing: React.FC<SingleRingProps> = ({ delay, speed, intensity, status }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const progressRef = useRef(delay);

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';

  useFrame((_, delta) => {
    // Only advance when active
    if (isCharging || isStarting) {
      const activeSpeed = isStarting ? speed * 0.7 : speed;
      progressRef.current = (progressRef.current + delta * activeSpeed) % 1.0;
    }

    const p = progressRef.current;

    // 1. Smooth outward expansion from near-center (0.25) to outer boundary (1.40)
    if (meshRef.current) {
      const currentScale = THREE.MathUtils.lerp(0.25, 1.40, p);
      meshRef.current.scale.set(currentScale, currentScale, 1);
    }

    // 2. Opacity envelope:
    // 0.0 -> 0.2: rapid fade in
    // 0.2 -> 0.6: sustained luminous glow
    // 0.6 -> 1.0: fade out to 0 at edge
    if (matRef.current) {
      let alpha = 0;
      if (p < 0.2) {
        alpha = (p / 0.2) * 0.65;
      } else if (p < 0.6) {
        alpha = 0.65;
      } else {
        alpha = (1.0 - (p - 0.6) / 0.4) * 0.65;
      }

      const stateMultiplier = isCharging ? intensity : isStarting ? intensity * 0.5 : 0;
      matRef.current.opacity = Math.max(0.0, alpha * stateMultiplier);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0.035, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {/* Thin concentric energy ring */}
      <ringGeometry args={[0.96, 1.00, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color="#00FF9D"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

interface EnergyRingsProps {
  intensity: number;
  status: string;
}

export const EnergyRings: React.FC<EnergyRingsProps> = ({ intensity, status }) => {
  // 6 staggered concentric rings forming continuous traveling waves
  const rings = [0, 1, 2, 3, 4, 5];
  const ringSpeed = 0.48; // speed of expansion cycle

  // Hide if idle or complete
  if (status === 'idle' || status === 'complete' || intensity <= 0.02) {
    return null;
  }

  return (
    <group position={[0, 0, 0]}>
      {rings.map((idx) => (
        <SingleRing
          key={idx}
          delay={idx * (1.0 / rings.length)}
          speed={ringSpeed}
          intensity={intensity}
          status={status}
        />
      ))}
    </group>
  );
};

export default EnergyRings;
