import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VerticalEnergyFieldProps {
  intensity: number;
  status: string;
}

export const VerticalEnergyField: React.FC<VerticalEnergyFieldProps> = ({ intensity, status }) => {
  const columnRef = useRef<THREE.Mesh>(null);
  const planesGroupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerColumnRef = useRef<THREE.Mesh>(null);

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      if (isCharging) {
        // Soft volumetric breathing
        const pulse = Math.sin(t * 2.6) * 0.04 + 0.14;
        materialRef.current.opacity = pulse * intensity;
      } else if (isStarting) {
        materialRef.current.opacity = 0.06 * intensity;
      } else {
        materialRef.current.opacity = 0;
      }
    }

    if (columnRef.current && isCharging) {
      // Very subtle organic wave distortion
      const scaleWobble = 1.0 + Math.sin(t * 1.8) * 0.02;
      columnRef.current.scale.set(scaleWobble, 1, scaleWobble);
    }

    if (innerColumnRef.current && isCharging) {
      const innerWobble = 1.0 + Math.cos(t * 2.2) * 0.03;
      innerColumnRef.current.scale.set(innerWobble, 1, innerWobble);
    }

    if (planesGroupRef.current && (isCharging || isStarting)) {
      // Gentle rotation of the volumetric field planes
      planesGroupRef.current.rotation.y = t * 0.08;
    }
  });

  if (status === 'idle' || status === 'complete' || intensity <= 0.02) {
    return null;
  }

  return (
    <group position={[0, 0.20, 0]}>
      {/* 1. Outer Soft Cylindrical Volumetric Energy Column */}
      <mesh ref={columnRef}>
        {/* Radius top: 1.0, Radius bottom: 1.15, Height: 0.36 */}
        <cylinderGeometry args={[1.05, 1.25, 0.36, 48, 1, true]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#00FF9D"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Inner Resonant Core Column */}
      <mesh ref={innerColumnRef}>
        <cylinderGeometry args={[0.65, 0.82, 0.35, 36, 1, true]} />
        <meshBasicMaterial
          color="#10B981"
          transparent
          opacity={isCharging ? 0.09 * intensity : 0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Intersecting Cross Planes for Volumetric Soft Density */}
      <group ref={planesGroupRef}>
        {[0, 45, 90, 135].map((angle, idx) => (
          <mesh
            key={idx}
            rotation={[0, (angle * Math.PI) / 180, 0]}
          >
            <planeGeometry args={[1.8, 0.36]} />
            <meshBasicMaterial
              color="#059669"
              transparent
              opacity={isCharging ? 0.06 * intensity : 0.02}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default VerticalEnergyField;
