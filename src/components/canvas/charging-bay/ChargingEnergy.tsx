import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChargingEnergyProps {
  isCharging: boolean;
  batterySoc?: number;
  padY?: number;
  underbodyY?: number;
}

/**
 * Restrained Contactless Charging Energy Transfer
 * - Soft underbody illumination onto the vehicle chassis.
 * - Faint, delicate vertical energy quanta close to the ground.
 * - Subtle, gentle inductive pulse wave without video-game effects.
 */
export const ChargingEnergy: React.FC<ChargingEnergyProps> = ({
  isCharging,
  batterySoc = 66,
  padY = 0.005,
  underbodyY = 0.28,
}) => {
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const count = 45; // Restrained particle count
  const pointsRef = useRef<THREE.Points>(null);
  const waveRef = useRef<THREE.Mesh>(null);
  const underbodyLightRef = useRef<THREE.PointLight>(null);

  // Initialize faint vertical energy particles directly between charging pad and underbody
  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1.8;
      const z = (Math.random() - 0.5) * 1.0;
      const y = padY + Math.random() * (underbodyY - padY);

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      spd[i] = 0.0015 + Math.random() * 0.0025;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, phs];
  }, [count, padY, underbodyY]);

  useFrame(({ clock }) => {
    if (!isActivelyCharging) return;
    const time = clock.getElapsedTime();

    // 1. Upward soft drifting energy quanta
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds[i];

        // Subtle gentle sway
        pos[i * 3 + 0] += Math.sin(time * 1.5 + phases[i]) * 0.0008;

        // Recycle when reaching underbody
        if (pos[i * 3 + 1] >= underbodyY) {
          pos[i * 3 + 1] = padY + 0.002;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 1.8;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Soft inductive field pulse wave
    if (waveRef.current) {
      const wavePhase = (time * 0.45) % 1.0;
      waveRef.current.position.y = padY + wavePhase * (underbodyY - padY);
      const s = 0.85 + wavePhase * 0.35;
      waveRef.current.scale.set(s, 1, s);

      const mat = waveRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.sin(wavePhase * Math.PI) * 0.28;
      }
    }

    // 3. Subtle undercarriage light breathing
    if (underbodyLightRef.current) {
      underbodyLightRef.current.intensity = Math.sin(time * 2.0) * 0.25 + 0.75;
    }
  });

  if (!isActivelyCharging) return null;

  return (
    <group position={[0, 0, 0]} name="RestrainedChargingEnergy">
      {/* Soft Undercarriage Ambient Uplight */}
      <pointLight
        ref={underbodyLightRef}
        position={[0, 0.12, 0]}
        intensity={0.75}
        color="#2DD4BF"
        distance={2.8}
        decay={2}
      />

      {/* Subtle Gentle Energy Quanta Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.024}
          color="#2DD4BF"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Faint Inductive Transfer Field Plane */}
      <mesh ref={waveRef} position={[0, padY + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshBasicMaterial
          color="#10B981"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
