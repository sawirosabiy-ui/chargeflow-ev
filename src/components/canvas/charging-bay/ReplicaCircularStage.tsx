import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ReplicaCircularStageProps {
  isCharging?: boolean;
  batterySoc?: number;
  theme?: 'dark' | 'cream';
  position?: [number, number, number];
}

/**
 * 3D Physical Replica of the architectural circular EV turntable stage.
 * Dimensions calibrated to match the exact size and proportions of the before image (ahe_update.png).
 * Outer ring diameter ~4.16m, top turntable deck ~3.56m.
 */
export const ReplicaCircularStage: React.FC<ReplicaCircularStageProps> = ({
  isCharging = false,
  batterySoc = 66,
  theme = 'dark',
  position = [0, 0, 0],
}) => {
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const neonRingRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerCoilRef = useRef<THREE.MeshStandardMaterial>(null);
  const centerNodeRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (neonRingRef.current) {
      if (isActivelyCharging) {
        // Breathing electromagnetic glow
        const pulse = Math.sin(elapsed * 2.8) * 0.35 + 0.65;
        neonRingRef.current.opacity = pulse;
      } else if (isComplete) {
        neonRingRef.current.opacity = 0.95;
      } else {
        neonRingRef.current.opacity = 0.75;
      }
    }

    if (innerCoilRef.current) {
      if (isActivelyCharging) {
        const pulse = Math.sin(elapsed * 3.2) * 0.6 + 0.8;
        innerCoilRef.current.emissiveIntensity = pulse;
        innerCoilRef.current.emissive.set(pulse > 0.8 ? '#2DD4BF' : '#10B981');
      } else if (isComplete) {
        innerCoilRef.current.emissiveIntensity = 1.4;
        innerCoilRef.current.emissive.set('#10B981');
      } else {
        innerCoilRef.current.emissiveIntensity = 0.25;
        innerCoilRef.current.emissive.set('#0E7490');
      }
    }

    if (centerNodeRef.current) {
      if (isActivelyCharging) {
        centerNodeRef.current.opacity = Math.sin(elapsed * 3.5) * 0.3 + 0.7;
      } else if (isComplete) {
        centerNodeRef.current.opacity = 0.95;
      } else {
        centerNodeRef.current.opacity = 0.35;
      }
    }
  });

  // Procedural feathered ambient occlusion shadow plane (seamlessly binds stage to terrace floor)
  const shadowTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 110, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
    gradient.addColorStop(0.40, 'rgba(2, 5, 12, 0.85)');
    gradient.addColorStop(0.65, 'rgba(3, 7, 16, 0.50)');
    gradient.addColorStop(0.85, 'rgba(4, 9, 20, 0.16)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Procedural neon reflection bounce on wet terrace tiles
  const glowTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    gradient.addColorStop(0.35, 'rgba(45, 212, 191, 0.45)');
    gradient.addColorStop(0.60, 'rgba(16, 185, 129, 0.22)');
    gradient.addColorStop(0.85, 'rgba(45, 212, 191, 0.05)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group position={position} name="ReplicaCircularStage">
      {/* 0. Soft Feathered Radial Ambient Occlusion Shadow (Seamlessly binds stage to terrace floor) */}
      {shadowTexture && (
        <mesh position={[0, -0.076, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.2, 7.2]} />
          <meshBasicMaterial
            map={shadowTexture}
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floor light bounce from perimeter neon ring reflecting on wet stone tiles */}
      {glowTexture && (
        <mesh position={[0, -0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.8, 7.8]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={isActivelyCharging ? 0.85 : isComplete ? 0.65 : 0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Deep Ground Contact Crevice Gasket (Dark sealing rim right at the floor intersection) */}
      <mesh position={[0, -0.074, 0]}>
        <cylinderGeometry args={[2.32, 2.42, 0.012, 64]} />
        <meshStandardMaterial
          color="#04070D"
          roughness={0.95}
          metalness={0.15}
        />
      </mesh>

      {/* 1. Flared Architectural Base Skirt (Slopes gently from neon ring down into floor) */}
      <mesh position={[0, -0.052, 0]} receiveShadow>
        <cylinderGeometry args={[1.92, 2.34, 0.045, 64]} />
        <meshStandardMaterial
          color="#0B111D"
          roughness={0.35}
          metalness={0.88}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* 2. Recessed Neon Perimeter Glow Ring (Encircles the car turntable) */}
      <mesh position={[0, -0.032, 0]}>
        <cylinderGeometry args={[1.82, 1.82, 0.016, 64, 1, true]} />
        <meshBasicMaterial
          ref={neonRingRef}
          color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#38BDF8'}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic point light emanating from the perimeter ring onto stage and floor */}
      <pointLight
        position={[0, -0.022, 0]}
        intensity={isActivelyCharging ? 2.2 : isComplete ? 1.6 : 0.8}
        color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#38BDF8'}
        distance={4.2}
      />

      {/* 3. Middle Stepped Tier (Dark brushed titanium chamfer) */}
      <mesh position={[0, -0.022, 0]} receiveShadow>
        <cylinderGeometry args={[1.76, 1.92, 0.025, 64]} />
        <meshStandardMaterial
          color="#141C2A"
          roughness={0.25}
          metalness={0.92}
        />
      </mesh>

      {/* 4. Top Turntable Deck Slab (Surface at Y = 0.0, holds entire vehicle) */}
      <mesh position={[0, -0.009, 0]} receiveShadow>
        <cylinderGeometry args={[1.70, 1.76, 0.018, 64]} />
        <meshStandardMaterial
          color="#101624"
          roughness={0.32}
          metalness={0.45}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* 5. Concentric Grooves on the Turntable Surface */}
      <mesh position={[0, 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.45, 1.48, 64]} />
        <meshBasicMaterial color="#080C14" />
      </mesh>

      {/* Inner induction track ring */}
      <mesh position={[0, 0.0012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.98, 1.02, 64]} />
        <meshStandardMaterial
          ref={innerCoilRef}
          color="#082F49"
          emissive={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#0E7490'}
          emissiveIntensity={isActivelyCharging ? 1.3 : 0.3}
          roughness={0.28}
          metalness={0.75}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Center Induction Coupling Disc */}
      <mesh position={[0, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.34, 48]} />
        <meshBasicMaterial
          ref={centerNodeRef}
          color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#38BDF8'}
          transparent
          opacity={isActivelyCharging ? 0.9 : isComplete ? 0.95 : 0.4}
        />
      </mesh>
    </group>
  );
};
