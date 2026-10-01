import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';

interface ReplicaCircularStageProps {
  isCharging?: boolean;
  batterySoc?: number;
  theme?: 'dark' | 'cream';
  position?: [number, number, number];
}

/**
 * Premium Architectural Contactless Charging Floor
 * Matches exact mobile visual reference (phone charging.png):
 * - Dark circular platform stage
 * - Concentric glowing cyan/teal neon rings (inner & outer)
 * - Photorealistic contact shadows under vehicle tires
 * - Subtle inductive charging core
 */
export const ReplicaCircularStage: React.FC<ReplicaCircularStageProps> = ({
  isCharging = false,
  batterySoc = 66,
  theme = 'dark',
  position = [0, 0, 0],
}) => {
  const isCream = theme === 'cream';
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const outerRingRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerRingRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (outerRingRef.current) {
      if (isActivelyCharging) {
        // Gentle breathing pulse
        const pulse = Math.sin(elapsed * 2.0) * 0.2 + 0.75;
        outerRingRef.current.opacity = pulse;
      } else if (isComplete) {
        outerRingRef.current.opacity = 0.85;
      } else {
        outerRingRef.current.opacity = 0.55;
      }
    }

    if (innerRingRef.current) {
      if (isActivelyCharging) {
        const pulse = Math.sin(elapsed * 2.5 + 1.0) * 0.2 + 0.8;
        innerRingRef.current.opacity = pulse;
      } else if (isComplete) {
        innerRingRef.current.opacity = 0.9;
      } else {
        innerRingRef.current.opacity = 0.6;
      }
    }
  });

  const ringColor = isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#0D9488';

  return (
    <group position={position} name="ArchitecturalChargingFloor">
      {/* 1. Master Ground Plane (Blends seamlessly with station background) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={isCream ? '#DFD8CC' : '#070B12'}
          roughness={isCream ? 0.6 : 0.4}
          metalness={isCream ? 0.05 : 0.3}
          envMapIntensity={isCream ? 0.4 : 0.8}
        />
      </mesh>

      {/* 2. Main Circular Stage Disc Pedestal */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.7, 64]} />
        <meshStandardMaterial
          color={isCream ? '#EDE8DE' : '#0B111E'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 3. Photorealistic Contact Shadow Layer beneath Vehicle Wheels & Body */}
      <ContactShadows
        position={[0, -0.003, 0]}
        opacity={0.88}
        scale={6.2}
        blur={1.5}
        far={2.2}
        resolution={1024}
        color={isCream ? '#4A3B32' : '#000000'}
      />

      {/* 4. Concentric Glowing Neon Rings (Matches phone charging.png) */}
      {/* Outer Glowing Neon Ring */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.34, 64]} />
        <meshBasicMaterial
          ref={outerRingRef}
          color={ringColor}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Inner Glowing Neon Ring */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.38, 64]} />
        <meshBasicMaterial
          ref={innerRingRef}
          color={ringColor}
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>

      {/* Center Induction Pad Core Disc */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.48, 48]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={isActivelyCharging ? 0.9 : 0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
