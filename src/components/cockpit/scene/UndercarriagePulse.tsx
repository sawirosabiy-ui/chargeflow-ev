import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface UndercarriagePulseProps {
  batteryProgress: number; // 0 to 1
  intensity: number;
  status: string;
}

export const UndercarriagePulse: React.FC<UndercarriagePulseProps> = ({
  batteryProgress,
  intensity,
  status,
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';
  const isComplete = status === 'complete';
  const isPaused = status === 'paused';

  const glowColor = isComplete ? '#F59E0B' : '#10B981';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Breathing cycle synchronized with inductive wave (~2.8 rad/s)
    const wave = isCharging ? (Math.sin(t * 2.8) * 0.25 + 0.75) : 0.2;
    
    if (lightRef.current) {
      if (isCharging) {
        lightRef.current.intensity = Math.max(0.2, 2.4 * intensity * wave);
      } else if (isStarting) {
        lightRef.current.intensity = 1.0 * intensity;
      } else if (isPaused) {
        lightRef.current.intensity = 0.35;
      } else if (isComplete) {
        lightRef.current.intensity = 0.6;
      } else {
        lightRef.current.intensity = 0.0;
      }
    }

    if (matRef.current) {
      if (isCharging) {
        matRef.current.opacity = Math.max(0.04, 0.24 * intensity * wave);
      } else if (isStarting) {
        matRef.current.opacity = 0.08 * intensity;
      } else if (isPaused) {
        matRef.current.opacity = 0.04;
      } else if (isComplete) {
        matRef.current.opacity = 0.08;
      } else {
        matRef.current.opacity = 0.0;
      }
    }
  });

  return (
    <group position={[0, 0.26, 0]}>
      {/* 1. Point Light illuminating vehicle floorpan & battery casing */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color={glowColor}
        distance={3.2}
        decay={2}
      />

      {/* 2. Underside Inductive Receiver Luminous Core Sheet */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.8, 3.2]} />
        <meshBasicMaterial
          ref={matRef}
          color={glowColor}
          transparent
          opacity={0.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Concentric Receiver Induction Guide Ring at chassis bottom */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.60, 48]} />
        <meshBasicMaterial
          color={isComplete ? '#F59E0B' : '#00FF9D'}
          transparent
          opacity={isCharging ? 0.35 * intensity : isComplete ? 0.2 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default UndercarriagePulse;
