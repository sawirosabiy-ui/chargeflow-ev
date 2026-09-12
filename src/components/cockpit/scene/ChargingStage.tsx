import React, { Suspense } from 'react';
import * as THREE from 'three';
import { ContactShadows, Environment } from '@react-three/drei';

export const ChargingStage: React.FC = () => {
  return (
    <group>
      {/* 1. Reflective Wet Dark Asphalt / Showroom Floor */}
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#060913"
          roughness={0.18}
          metalness={0.72}
        />
      </mesh>

      {/* 2. Soft Contact Shadows Grounded on Floor */}
      <Suspense fallback={null}>
        <ContactShadows
          position={[0, 0.002, 0]}
          resolution={1024}
          frames={1}
          opacity={0.88}
          scale={9.0}
          blur={1.4}
          far={3.0}
          color="#000000"
        />
      </Suspense>

      {/* 3. Showroom Ceiling Canopy & Architectural Soffit */}
      <mesh position={[0, 4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color="#080C14"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Ceiling Recessed Linear Downlight Strips */}
      <mesh position={[-2.5, 4.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 12]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>
      <mesh position={[2.5, 4.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 12]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>
      <mesh position={[0, 4.78, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.08]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      {/* 4. Left Architectural Support Columns */}
      <group position={[-5.8, 0, -2.5]}>
        {/* Main Column */}
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 4.8, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Warm Accent Uplight Wash on Column */}
        <pointLight position={[0.4, 0.4, 0.4]} color="#F59E0B" intensity={0.6} distance={3.2} />
      </group>

      <group position={[-5.8, 0, 3.5]}>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 4.8, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        <pointLight position={[0.4, 0.4, 0.4]} color="#F59E0B" intensity={0.5} distance={3.0} />
      </group>

      {/* 5. Terrace Planter Balustrade & Warm Accent Garden Lighting Behind/Left */}
      <group position={[-5.2, 0, 0]}>
        {/* Planter Box */}
        <mesh position={[0, 0.22, 0]} receiveShadow>
          <boxGeometry args={[0.8, 0.44, 9.0]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Dark Architectural Shrub Foliage */}
        <mesh position={[0, 0.55, -2.0]}>
          <boxGeometry args={[0.6, 0.35, 1.8]} />
          <meshStandardMaterial color="#061F14" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 1.5]}>
          <boxGeometry args={[0.6, 0.35, 2.2]} />
          <meshStandardMaterial color="#061F14" roughness={0.8} />
        </mesh>
        {/* Warm Garden Accent Uplight Strip */}
        <mesh position={[0.3, 0.46, 0]}>
          <boxGeometry args={[0.04, 0.02, 7.5]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <pointLight position={[0.35, 0.55, 0]} color="#F59E0B" intensity={0.8} distance={4.0} />
      </group>

      {/* 6. Rear Terrace Edge & Distant Twilight Horizon Backdrop */}
      <group position={[0, 0, -8.5]}>
        {/* Low Balcony Wall */}
        <mesh position={[0, 0.45, 0]} receiveShadow>
          <boxGeometry args={[22, 0.9, 0.4]} />
          <meshStandardMaterial color="#0D1322" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Subtle Edge Warm Light Line on Balcony */}
        <mesh position={[0, 0.91, 0.18]}>
          <boxGeometry args={[20, 0.02, 0.03]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <pointLight position={[0, 0.95, 0.25]} color="#F59E0B" intensity={0.5} distance={5.0} />
      </group>

      {/* 7. Automotive Reflection HDR Preset */}
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.85} />
      </Suspense>
    </group>
  );
};

export default ChargingStage;
