import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WirelessChargingPadProps {
  isCharging: boolean;
  batterySoc?: number;
  theme?: 'dark' | 'cream';
  position?: [number, number, number];
}

export const WirelessChargingPad: React.FC<WirelessChargingPadProps> = ({
  isCharging,
  batterySoc = 66,
  theme = 'dark',
  position = [0, 0, 0],
}) => {
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const coilMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const underbodyLightRef = useRef<THREE.PointLight>(null);
  const statusGlyphRef = useRef<THREE.MeshBasicMaterial>(null);

  // Animated pulse for wireless induction coils
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (coilMaterialRef.current) {
      if (isActivelyCharging) {
        // Smooth architectural breathing pulse
        const pulse = Math.sin(elapsed * 2.8) * 0.5 + 0.5;
        coilMaterialRef.current.emissiveIntensity = 0.8 + pulse * 1.8;
        coilMaterialRef.current.emissive.set(pulse > 0.5 ? '#2DD4BF' : '#10B981');
      } else if (isComplete) {
        // Steady serene emerald green when 100% full
        coilMaterialRef.current.emissiveIntensity = 1.6;
        coilMaterialRef.current.emissive.set('#10B981');
      } else {
        // Idle standby state
        coilMaterialRef.current.emissiveIntensity = 0.15;
        coilMaterialRef.current.emissive.set('#0E7490');
      }
    }

    if (underbodyLightRef.current) {
      if (isActivelyCharging) {
        underbodyLightRef.current.intensity = 1.4 + Math.sin(elapsed * 2.8) * 0.6;
        underbodyLightRef.current.color.set('#2DD4BF');
      } else if (isComplete) {
        underbodyLightRef.current.intensity = 1.2;
        underbodyLightRef.current.color.set('#10B981');
      } else {
        underbodyLightRef.current.intensity = 0.2;
        underbodyLightRef.current.color.set('#0F172A');
      }
    }

    if (statusGlyphRef.current) {
      if (isActivelyCharging) {
        statusGlyphRef.current.opacity = 0.6 + Math.sin(elapsed * 3.2) * 0.35;
      } else if (isComplete) {
        statusGlyphRef.current.opacity = 0.95;
      } else {
        statusGlyphRef.current.opacity = 0.25;
      }
    }
  });

  // Concentric rounded induction coil tracks
  const coilTracks = useMemo(() => {
    return [
      { width: 1.48, depth: 3.20, thickness: 0.022 },
      { width: 1.18, depth: 2.60, thickness: 0.020 },
      { width: 0.88, depth: 1.95, thickness: 0.018 },
      { width: 0.54, depth: 1.25, thickness: 0.016 },
    ];
  }, []);

  return (
    <group position={position}>
      {/* 1. Recessed Floor Tray Bezel (Beveled Gunmetal Titanium Perimeter) */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[1.86, 0.025, 3.76]} />
        <meshStandardMaterial
          color="#181E29"
          roughness={0.25}
          metalness={0.88}
        />
      </mesh>

      {/* 2. Main High-Tech Ceramic Induction Slab Surface (Flush with floor at Y = 0.001) */}
      <mesh position={[0, 0.001, 0]} receiveShadow>
        <boxGeometry args={[1.76, 0.003, 3.66]} />
        <meshStandardMaterial
          color="#0C1019"
          roughness={0.36}
          metalness={0.22}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* 3. Flush Induction Coil Concentric Ring Guides */}
      {coilTracks.map((track, i) => (
        <mesh key={i} position={[0, 0.002, 0]} receiveShadow>
          <boxGeometry args={[track.width, 0.001, track.depth]} />
          <meshStandardMaterial
            ref={i === 0 ? coilMaterialRef : undefined}
            color="#082F49"
            emissive={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#0E7490'}
            emissiveIntensity={isActivelyCharging ? 1.4 : isComplete ? 1.5 : 0.2}
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      {/* 4. Center High-Coupling Induction Plate (Directly below vehicle battery tray) */}
      <group position={[0, 0.003, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.34, 0.001, 0.65]} />
          <meshBasicMaterial
            ref={statusGlyphRef}
            color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#38BDF8'}
            transparent
            opacity={isActivelyCharging ? 0.9 : isComplete ? 1.0 : 0.3}
          />
        </mesh>
      </group>

      {/* 5. Precision Vehicle Alignment Guides (Longitudinal Edge Markers) */}
      {/* Left alignment micro-strip */}
      <mesh position={[-0.82, 0.002, 0]}>
        <boxGeometry args={[0.012, 0.001, 3.4]} />
        <meshBasicMaterial
          color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#334155'}
          transparent
          opacity={isActivelyCharging ? 0.8 : 0.35}
        />
      </mesh>
      {/* Right alignment micro-strip */}
      <mesh position={[0.82, 0.002, 0]}>
        <boxGeometry args={[0.012, 0.001, 3.4]} />
        <meshBasicMaterial
          color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#334155'}
          transparent
          opacity={isActivelyCharging ? 0.8 : 0.35}
        />
      </mesh>

      {/* 6. Subtle Underbody Architectural Bounce Light (Reflects off lower rocker panels) */}
      <pointLight
        ref={underbodyLightRef}
        position={[0, 0.12, 0]}
        intensity={isActivelyCharging ? 1.6 : isComplete ? 1.2 : 0.25}
        color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#0F172A'}
        distance={2.8}
      />
    </group>
  );
};
