import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChargingEnergyProps {
  isCharging: boolean;
  batterySoc?: number;
  padY?: number;
  underbodyY?: number;
}

export const ChargingEnergy: React.FC<ChargingEnergyProps> = ({
  isCharging,
  batterySoc = 66,
  padY = 0.005,
  underbodyY = 0.28,
}) => {
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const count = 160;
  const pointsRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const underbodyLightRef = useRef<THREE.PointLight>(null);

  // Generate particles initialized in a vortex column between pad and car underbody
  const [positions, speeds, ang, rad] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.15 + Math.random() * 0.75;
      const y = padY + Math.random() * (underbodyY - padY);

      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * (radius * 1.5); // Oval to match car wheelbase

      spd[i] = 0.004 + Math.random() * 0.007;
      ang[i] = angle;
      rad[i] = radius;
    }
    return [pos, spd, ang, rad];
  }, [count, padY, underbodyY]);

  useFrame(({ clock }) => {
    if (!isActivelyCharging) return;
    const time = clock.getElapsedTime();

    // 1. Animate upward swirling green energy quanta
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds[i];
        ang[i] += 0.035; // Swirling magnetic vortex

        // Mild inward pinch as particles reach vehicle underside battery pack
        const progress = (pos[i * 3 + 1] - padY) / (underbodyY - padY);
        const currentRad = rad[i] * (1.0 - progress * 0.25);

        pos[i * 3 + 0] = Math.cos(ang[i]) * currentRad;
        pos[i * 3 + 2] = Math.sin(ang[i]) * (currentRad * 1.4);

        // Recycle when reaching car chassis floor
        if (pos[i * 3 + 1] >= underbodyY) {
          pos[i * 3 + 1] = padY + 0.002;
          ang[i] = Math.random() * Math.PI * 2;
          rad[i] = 0.15 + Math.random() * 0.75;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Animate 3 ascending inductive wave rings (Stage -> Car)
    const totalHeight = underbodyY - padY;
    const ringSpeed = 0.7; // cycle per second

    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current];
    rings.forEach((mesh, idx) => {
      if (!mesh) return;
      const phase = (time * ringSpeed + idx / 3) % 1.0;
      mesh.position.y = padY + phase * totalHeight;
      const scale = 0.7 + phase * 0.55;
      mesh.scale.set(scale, scale, scale);

      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        // Fade in from pad, peak at mid-height, fade out as absorbed into car
        mat.opacity = Math.sin(phase * Math.PI) * 0.85;
      }
    });

    // 3. Dynamic green underbody point light pulsation
    if (underbodyLightRef.current) {
      underbodyLightRef.current.intensity = 2.2 + Math.sin(time * 5.0) * 1.1;
    }
  });

  if (!isActivelyCharging) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Luminous Green Magnetic Energy Quanta Vortex (Stage -> Car) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#10B981"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Ascending Electromagnetic Inductive Pulse Rings */}
      <mesh ref={ring1Ref} position={[0, padY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.44, 48]} />
        <meshBasicMaterial
          color="#34D399"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ring2Ref} position={[0, padY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.48, 48]} />
        <meshBasicMaterial
          color="#10B981"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ring3Ref} position={[0, padY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.46, 0.52, 48]} />
        <meshBasicMaterial
          color="#22C55E"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Stage Ground Pad Inductive Coil Emitter Base */}
      <mesh position={[0, padY + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 48]} />
        <meshBasicMaterial
          color="#059669"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Pulsing Green Underbody Point Light casting on Stage and Vehicle Bottom */}
      <pointLight
        ref={underbodyLightRef}
        position={[0, (padY + underbodyY) / 2, 0]}
        color="#10B981"
        intensity={2.8}
        distance={2.5}
        decay={2}
      />
    </group>
  );
};
