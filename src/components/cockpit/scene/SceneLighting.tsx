import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SceneLightingProps {
  status: string;
  intensity: number;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ status, intensity }) => {
  const floorLightRef = useRef<THREE.PointLight>(null);
  const floorBounceSpotRef = useRef<THREE.SpotLight>(null);
  const sideBounceLeftRef = useRef<THREE.PointLight>(null);
  const sideBounceRightRef = useRef<THREE.PointLight>(null);

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';
  const isComplete = status === 'complete';
  const isPaused = status === 'paused';

  // Environmental illumination color
  const envColor = isComplete ? '#F59E0B' : '#10B981';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Central ground inductive floor light
    if (floorLightRef.current) {
      if (isCharging) {
        const pulse = Math.sin(t * 3.0) * 0.35 + 2.6;
        floorLightRef.current.intensity = pulse * intensity;
      } else if (isStarting) {
        floorLightRef.current.intensity = 1.2 * intensity;
      } else if (isPaused) {
        floorLightRef.current.intensity = 0.45;
      } else if (isComplete) {
        floorLightRef.current.intensity = 0.8;
      } else {
        // Idle: minimal floor ambient (5%)
        floorLightRef.current.intensity = 0.15;
      }
    }

    // 2. Upward undercarriage & rocker bounce spot
    if (floorBounceSpotRef.current) {
      if (isCharging) {
        const pulse = Math.sin(t * 2.8) * 0.25 + 1.75;
        floorBounceSpotRef.current.intensity = pulse * intensity;
      } else if (isStarting) {
        floorBounceSpotRef.current.intensity = 0.8 * intensity;
      } else if (isPaused) {
        floorBounceSpotRef.current.intensity = 0.25;
      } else if (isComplete) {
        floorBounceSpotRef.current.intensity = 0.5;
      } else {
        floorBounceSpotRef.current.intensity = 0.05;
      }
    }

    // 3. Side tire / rocker panel bounce lights
    const sideIntensity = isCharging ? (1.1 * intensity) : isStarting ? 0.5 : isComplete ? 0.3 : 0.08;
    if (sideBounceLeftRef.current) sideBounceLeftRef.current.intensity = sideIntensity;
    if (sideBounceRightRef.current) sideBounceRightRef.current.intensity = sideIntensity;
  });

  return (
    <group>
      {/* 1. Deep Midnight Studio Ambient (#0B0F17) */}
      <ambientLight intensity={1.35} color="#0B132B" />

      {/* 2. Studio Key Light (Cool Neutral White from upper three-quarter) */}
      <directionalLight
        position={[6.5, 8.0, 5.5]}
        intensity={2.6}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Studio Fill Light for Crisp Body Contours */}
      <directionalLight
        position={[-6.0, 5.0, -3.0]}
        intensity={1.1}
        color="#94A3B8"
      />

      {/* Subtle Cyan/Ice Rim Light */}
      <directionalLight
        position={[0, 5.5, -6.5]}
        intensity={1.4}
        color="#38BDF8"
      />

      {/* 3. Primary Inductive Floor Emerald Illumination */}
      {/* Lights asphalt floor reflection, lower bumper, rocker panels, tires */}
      <pointLight
        ref={floorLightRef}
        position={[0, 0.10, 0]}
        intensity={0.2}
        color={envColor}
        distance={6.2}
        decay={2}
      />

      {/* Upward floor bounce spot focused under vehicle chassis */}
      <spotLight
        ref={floorBounceSpotRef}
        position={[0, 0.04, 0]}
        target-position={[0, 0.75, 0]}
        intensity={0.1}
        color={envColor}
        angle={Math.PI / 2.8}
        penumbra={0.75}
        distance={3.8}
      />

      {/* Lateral bounce hitting left tires & rocker panel */}
      <pointLight
        ref={sideBounceLeftRef}
        position={[-1.6, 0.15, 0]}
        intensity={0.08}
        color={envColor}
        distance={3.0}
        decay={2}
      />

      {/* Lateral bounce hitting right tires & rocker panel */}
      <pointLight
        ref={sideBounceRightRef}
        position={[1.6, 0.15, 0]}
        intensity={0.08}
        color={envColor}
        distance={3.0}
        decay={2}
      />
    </group>
  );
};

export default SceneLighting;
