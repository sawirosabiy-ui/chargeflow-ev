import React, { useRef, useMemo } from 'react';
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
 * - Replaces the old sci-fi circular UFO platform with a subtle, physically grounded architectural surface.
 * - Flat wet architectural floor with realistic contact shadows.
 * - Subtle recessed contactless charging pad directly beneath the vehicle with restrained teal/emerald edge illumination.
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

  const padEdgeGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const padCenterGridRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (padEdgeGlowRef.current) {
      if (isActivelyCharging) {
        // Very subtle, gentle breathing pulse
        const pulse = Math.sin(elapsed * 2.0) * 0.2 + 0.65;
        padEdgeGlowRef.current.opacity = pulse;
      } else if (isComplete) {
        padEdgeGlowRef.current.opacity = 0.7;
      } else {
        padEdgeGlowRef.current.opacity = 0.35;
      }
    }

    if (padCenterGridRef.current) {
      if (isActivelyCharging) {
        const pulse = Math.sin(elapsed * 2.2) * 0.15 + 0.35;
        padCenterGridRef.current.emissiveIntensity = pulse;
      } else {
        padCenterGridRef.current.emissiveIntensity = 0.1;
      }
    }
  });

  // Procedural soft feathered radial contact shadow texture for under-chassis depth
  const ambientShadowTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 60, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.35, 'rgba(2, 6, 14, 0.75)');
    gradient.addColorStop(0.65, 'rgba(3, 8, 18, 0.35)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group position={position} name="ArchitecturalChargingFloor">
      {/* 1. Master Architectural Ground Plane (Dark Wet Architectural Terrace Floor) */}
      <mesh position={[0, -0.008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial
          color={isCream ? '#DFD8CC' : '#070B12'}
          roughness={isCream ? 0.6 : 0.38}
          metalness={isCream ? 0.05 : 0.25}
          envMapIntensity={isCream ? 0.4 : 0.8}
        />
      </mesh>

      {/* 2. Soft Radial Ambient Occlusion Ground Shadow */}
      {ambientShadowTex && (
        <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 3.8]} />
          <meshBasicMaterial
            map={ambientShadowTex}
            transparent
            opacity={0.88}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Photorealistic Contact Shadow Layer beneath Vehicle Wheels & Body */}
      <ContactShadows
        position={[0, -0.004, 0]}
        opacity={0.85}
        scale={6.0}
        blur={1.6}
        far={2.2}
        resolution={1024}
        color={isCream ? '#4A3B32' : '#000000'}
      />

      {/* 4. Subtle Recessed Contactless Charging Surface (Directly beneath vehicle) */}
      <group position={[0, -0.002, 0]}>
        {/* Outer Chamfered Dark Metal Frame Bezel */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.52, 1.42]} />
          <meshStandardMaterial
            color={isCream ? '#C8C0B2' : '#111827'}
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>

        {/* Dark Tinted Tempered Glass / Ceramic Inductive Plate */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.42, 1.32]} />
          <meshStandardMaterial
            ref={padCenterGridRef}
            color={isCream ? '#EFEAE2' : '#060A12'}
            roughness={0.2}
            metalness={0.9}
            emissive={isActivelyCharging ? '#0D9488' : '#042F2E'}
            emissiveIntensity={isActivelyCharging ? 0.35 : 0.05}
          />
        </mesh>

        {/* Hairline Restrained Glowing Perimeter Indicator (Teal/Emerald) */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.58, 48]} />
          <meshBasicMaterial
            ref={padEdgeGlowRef}
            color={isActivelyCharging ? '#2DD4BF' : isComplete ? '#10B981' : '#0D9488'}
            transparent
            opacity={isActivelyCharging ? 0.65 : 0.35}
            depthWrite={false}
          />
        </mesh>

        {/* Corner Alignment Hash Marks on Pad (Subtle Engineering Detail) */}
        <mesh position={[-1.12, 0.002, -0.58]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color={isActivelyCharging ? '#2DD4BF' : '#475569'} opacity={0.6} transparent />
        </mesh>
        <mesh position={[1.12, 0.002, -0.58]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color={isActivelyCharging ? '#2DD4BF' : '#475569'} opacity={0.6} transparent />
        </mesh>
        <mesh position={[-1.12, 0.002, 0.58]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color={isActivelyCharging ? '#2DD4BF' : '#475569'} opacity={0.6} transparent />
        </mesh>
        <mesh position={[1.12, 0.002, 0.58]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color={isActivelyCharging ? '#2DD4BF' : '#475569'} opacity={0.6} transparent />
        </mesh>
      </group>
    </group>
  );
};
