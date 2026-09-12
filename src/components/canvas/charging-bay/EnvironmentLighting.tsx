import React from 'react';
import { Environment } from '@react-three/drei';

interface EnvironmentLightingProps {
  isCharging?: boolean;
  theme?: 'dark' | 'cream';
  batterySoc?: number;
}

export const EnvironmentLighting: React.FC<EnvironmentLightingProps> = ({
  isCharging = false,
  theme = 'dark',
  batterySoc = 66,
}) => {
  const isCream = theme === 'cream';

  return (
    <>
      {/* 1. Deep Architectural Ambient Base */}
      <ambientLight
        intensity={isCream ? 1.8 : 1.2}
        color={isCream ? '#F5EFE6' : '#0B132B'}
      />

      {/* 2. Overhead Architectural Ceiling Softbox Downlight */}
      <directionalLight
        position={[0, 7.5, 0.8]}
        intensity={isCream ? 2.6 : 2.2}
        color="#FFFFFF"
        castShadow={false}
      />

      {/* 3. Primary 3/4 Front Automotive Beauty Key Light */}
      <directionalLight
        position={[4.8, 4.2, 4.5]}
        intensity={isCream ? 2.2 : 1.9}
        color="#FFFFFF"
        castShadow={false}
      />

      {/* 4. Rear/Rim Kick Light to Define Shoulder Lines */}
      <directionalLight
        position={[-4.5, 3.2, -3.2]}
        intensity={isCharging ? 1.6 : 1.1}
        color={isCharging ? '#2DD4BF' : '#94A3B8'}
        castShadow={false}
      />

      {/* 5. Front Fill Light for Grill & Headlamps */}
      <directionalLight
        position={[-2.8, 2.4, 3.8]}
        intensity={0.9}
        color="#E2E8F0"
      />

      {/* 6. Realistic Diffuse Floor Bounce Light */}
      <pointLight
        position={[0, 0.08, 0]}
        intensity={isCharging ? 0.8 : 0.35}
        color={isCharging ? '#2DD4BF' : '#64748B'}
        distance={3.2}
      />

      {/* 7. Realistic HDRI Reflections for Car Paint & Metallic Trim */}
      <Environment preset="night" environmentIntensity={isCream ? 0.7 : 0.85} />
    </>
  );
};
