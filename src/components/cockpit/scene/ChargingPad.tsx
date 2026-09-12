import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChargingPadProps {
  intensity: number; // 0 to 1
  status: string;
  isCharging: boolean;
}

export const ChargingPad: React.FC<ChargingPadProps> = ({ intensity, status, isCharging }) => {
  const outerLineMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerLineMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const contactPlateMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const surfaceGlowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const floorGlowPointRef = useRef<THREE.PointLight>(null);

  const isComplete = status === 'complete';
  const isStarting = status === 'starting';
  const isPaused = status === 'paused';

  // Primary warm amber/gold color from the reference image, with subtle variation for charging
  const primaryColor = isComplete
    ? '#F59E0B' // Warm amber/gold matching reference
    : isCharging
    ? '#10B981' // Dynamic emerald charging pulse
    : '#F59E0B';

  const secondaryColor = isComplete
    ? '#D97706'
    : isCharging
    ? '#059669'
    : '#B45309';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse animation for dual glowing lines
    if (outerLineMatRef.current && innerLineMatRef.current) {
      if (isCharging) {
        const pulse = Math.sin(t * 3.2) * 0.2 + 0.8;
        outerLineMatRef.current.opacity = Math.max(0.3, intensity * pulse * 0.95);
        innerLineMatRef.current.opacity = Math.max(0.4, intensity * pulse * 1.0);
      } else if (isStarting) {
        const pulse = Math.sin(t * 5.5) * 0.25 + 0.65;
        outerLineMatRef.current.opacity = intensity * pulse;
        innerLineMatRef.current.opacity = intensity * pulse * 0.9;
      } else if (isPaused) {
        outerLineMatRef.current.opacity = 0.35;
        innerLineMatRef.current.opacity = 0.25;
      } else {
        // Complete / Ready: steady warm golden presence as in reference
        const breathe = Math.sin(t * 1.5) * 0.08 + 0.88;
        outerLineMatRef.current.opacity = 0.85 * breathe;
        innerLineMatRef.current.opacity = 0.95 * breathe;
      }
    }

    // Floor glow intensity
    if (floorGlowPointRef.current) {
      if (isCharging) {
        const pulse = Math.sin(t * 3.0) * 0.3 + 2.0;
        floorGlowPointRef.current.intensity = pulse * intensity;
      } else {
        const breathe = Math.sin(t * 1.5) * 0.15 + 1.85;
        floorGlowPointRef.current.intensity = breathe;
      }
    }

    // Surface glow sheet
    if (surfaceGlowMatRef.current) {
      const breath = Math.sin(t * 1.8) * 0.03 + 0.12;
      surfaceGlowMatRef.current.opacity = (isCharging ? breath * intensity * 1.5 : breath);
    }
  });

  return (
    <group position={[0, 0.012, 0]}>
      {/* 1. Base Recessed Stage (3.3m wide x 5.5m long x 0.02m high) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[3.3, 0.02, 5.5]} />
        <meshStandardMaterial
          color="#0B0F17"
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Metallic Beveled Chamfer Frame */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[3.38, 0.005, 5.58]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* 2. Recessed Dark Ceramic/Glass Contact Area */}
      <mesh position={[0, 0.022, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.004, 4.8]} />
        <meshStandardMaterial
          ref={contactPlateMatRef}
          color="#0A0F1D"
          emissive={secondaryColor}
          emissiveIntensity={0.06}
          roughness={0.16}
          metalness={0.82}
        />
      </mesh>

      {/* 3. Dual Glowing Perimeter Lines (Matching Reference Image) */}
      {/* --- OUTER GLOWING RECTANGLE --- */}
      {/* Outer Left */}
      <mesh position={[-1.38, 0.028, 0]}>
        <boxGeometry args={[0.025, 0.004, 4.9]} />
        <meshBasicMaterial ref={outerLineMatRef} color={primaryColor} transparent opacity={0.85} />
      </mesh>
      {/* Outer Right */}
      <mesh position={[1.38, 0.028, 0]}>
        <boxGeometry args={[0.025, 0.004, 4.9]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.85} />
      </mesh>
      {/* Outer Front */}
      <mesh position={[0, 0.028, 2.45]}>
        <boxGeometry args={[2.785, 0.004, 0.025]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.85} />
      </mesh>
      {/* Outer Rear */}
      <mesh position={[0, 0.028, -2.45]}>
        <boxGeometry args={[2.785, 0.004, 0.025]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.85} />
      </mesh>

      {/* --- INNER GLOWING RECTANGLE --- */}
      {/* Inner Left */}
      <mesh position={[-1.22, 0.029, 0]}>
        <boxGeometry args={[0.018, 0.004, 4.56]} />
        <meshBasicMaterial ref={innerLineMatRef} color={primaryColor} transparent opacity={0.95} />
      </mesh>
      {/* Inner Right */}
      <mesh position={[1.22, 0.029, 0]}>
        <boxGeometry args={[0.018, 0.004, 4.56]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.95} />
      </mesh>
      {/* Inner Front */}
      <mesh position={[0, 0.029, 2.28]}>
        <boxGeometry args={[2.46, 0.004, 0.018]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.95} />
      </mesh>
      {/* Inner Rear */}
      <mesh position={[0, 0.029, -2.28]}>
        <boxGeometry args={[2.46, 0.004, 0.018]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.95} />
      </mesh>

      {/* 4. Center Inductive Resonant Coil Ring */}
      <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.88, 48]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Soft Ground Glow Surface */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 4.6]} />
        <meshBasicMaterial
          ref={surfaceGlowMatRef}
          color={primaryColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 6. Dedicated Platform Warm Ground Point Light for Realistic Floor Bounce */}
      <pointLight
        ref={floorGlowPointRef}
        position={[0, 0.12, 0]}
        color={primaryColor}
        intensity={2.0}
        distance={5.5}
        decay={2}
      />
    </group>
  );
};

export default ChargingPad;
