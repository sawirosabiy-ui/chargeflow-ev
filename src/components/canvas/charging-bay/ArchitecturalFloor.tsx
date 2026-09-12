import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ArchitecturalFloorProps {
  theme?: 'dark' | 'cream';
  isCharging?: boolean;
  showBackdrop?: boolean;
}

export const ArchitecturalFloor: React.FC<ArchitecturalFloorProps> = ({
  theme = 'dark',
  isCharging = false,
  showBackdrop = false,
}) => {
  const isCream = theme === 'cream';

  // Floor materials
  const floorColor = isCream ? '#E5DFD5' : '#0D111A';
  const seamColor = isCream ? '#C8C1B5' : '#070A10';
  const curbColor = isCream ? '#A8A29E' : '#1E2433';
  const wallColor = isCream ? '#D6D0C4' : '#090D15';

  // Generate expansion joint grid coordinates
  const expansionJoints = useMemo(() => {
    const lines: Array<{ position: [number, number, number]; size: [number, number, number] }> = [];
    const span = 20;
    const step = 2.4;

    // Cross-axis lines (along X)
    for (let z = -span / 2; z <= span / 2; z += step) {
      if (Math.abs(z) > 0.1) {
        lines.push({
          position: [0, 0.001, z],
          size: [span, 0.001, 0.018],
        });
      }
    }

    // Long-axis lines (along Z)
    for (let x = -span / 2; x <= span / 2; x += step) {
      if (Math.abs(x) > 0.1) {
        lines.push({
          position: [x, 0.001, 0],
          size: [0.018, 0.001, span],
        });
      }
    }

    return lines;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Physical Floor Slab (Y = 0 top surface) */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[26, 0.4, 26]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={isCream ? 0.42 : 0.34}
          metalness={isCream ? 0.05 : 0.15}
          envMapIntensity={0.65}
        />
      </mesh>

      {/* 2. Recessed Expansion Joints / Tile Seams */}
      {expansionJoints.map((joint, idx) => (
        <mesh key={idx} position={joint.position} receiveShadow>
          <boxGeometry args={joint.size} />
          <meshBasicMaterial color={seamColor} />
        </mesh>
      ))}

      {/* 3. Charging Bay Parking Guide Curbs (Flanking vehicle footprint) */}
      {/* Left Bay Curb */}
      <group position={[-1.72, 0.014, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.09, 0.028, 5.2]} />
          <meshStandardMaterial
            color={curbColor}
            metalness={0.75}
            roughness={0.28}
          />
        </mesh>
        {/* Subtle LED channel on curb inner edge */}
        <mesh position={[0.046, 0.006, 0]}>
          <boxGeometry args={[0.006, 0.012, 5.1]} />
          <meshBasicMaterial
            color={isCharging ? '#2DD4BF' : '#38BDF8'}
            transparent
            opacity={isCharging ? 0.85 : 0.45}
          />
        </mesh>
      </group>

      {/* Right Bay Curb */}
      <group position={[1.72, 0.014, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.09, 0.028, 5.2]} />
          <meshStandardMaterial
            color={curbColor}
            metalness={0.75}
            roughness={0.28}
          />
        </mesh>
        {/* Subtle LED channel on curb inner edge */}
        <mesh position={[-0.046, 0.006, 0]}>
          <boxGeometry args={[0.006, 0.012, 5.1]} />
          <meshBasicMaterial
            color={isCharging ? '#2DD4BF' : '#38BDF8'}
            transparent
            opacity={isCharging ? 0.85 : 0.45}
          />
        </mesh>
      </group>

      {/* 4. Rear Wheel Stop / Parking Boundary Bar */}
      <group position={[0, 0.012, -2.55]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.2, 0.024, 0.08]} />
          <meshStandardMaterial
            color={curbColor}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.006, 0.041]}>
          <boxGeometry args={[2.16, 0.01, 0.004]} />
          <meshBasicMaterial
            color={isCharging ? '#2DD4BF' : '#475569'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* Front Entrance Approach Marking */}
      <group position={[0, 0.002, 2.58]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.4, 0.002, 0.03]} />
          <meshBasicMaterial
            color={isCharging ? '#2DD4BF' : '#334155'}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* 5. Minimalist Showroom Architectural Backdrop (Optional) */}
      {showBackdrop && (
        <>
          {/* Rear Architectural Accent Wall */}
          <mesh position={[0, 3.2, -6.8]} receiveShadow>
            <boxGeometry args={[26, 7.0, 0.4]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.65}
              metalness={0.08}
            />
          </mesh>

          {/* Architectural Baseboard Wall Wash Reveal */}
          <mesh position={[0, 0.05, -6.58]}>
            <boxGeometry args={[25.8, 0.1, 0.04]} />
            <meshStandardMaterial color={curbColor} metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Baseboard indirect illumination strip */}
          <mesh position={[0, 0.01, -6.55]}>
            <boxGeometry args={[25.6, 0.015, 0.02]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>

          {/* Architectural Flanking Columns (Left & Right) */}
          <mesh position={[-6.2, 3.2, -3.2]} receiveShadow castShadow>
            <boxGeometry args={[0.55, 7.0, 0.55]} />
            <meshStandardMaterial color={wallColor} roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh position={[6.2, 3.2, -3.2]} receiveShadow castShadow>
            <boxGeometry args={[0.55, 7.0, 0.55]} />
            <meshStandardMaterial color={wallColor} roughness={0.5} metalness={0.1} />
          </mesh>

          {/* Overhead Lighting Baffle / Architectural Soffit */}
          <group position={[0, 5.8, -0.4]}>
            <mesh receiveShadow>
              <boxGeometry args={[5.2, 0.15, 7.4]} />
              <meshStandardMaterial color={curbColor} roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Recessed Softbox Diffuser Face */}
            <mesh position={[0, -0.08, 0]}>
              <planeGeometry args={[4.8, 7.0]} />
              <meshBasicMaterial color="#F8FAFC" toneMapped={false} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
};
