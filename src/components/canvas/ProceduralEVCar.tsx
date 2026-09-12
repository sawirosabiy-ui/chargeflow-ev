import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ProceduralEVCarProps {
  paintColor?: string;
  isCharging?: boolean;
  modelName?: string;
  portAnchorRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
}

export const ProceduralEVCar: React.FC<ProceduralEVCarProps> = ({
  paintColor = '#0284c7',
  isCharging = true,
  modelName = 'BYD ATTO 3',
  portAnchorRef,
}) => {
  const isBYD = modelName.toLowerCase().includes('byd') || modelName.toLowerCase().includes('seagull');
  const isTesla = modelName.toLowerCase().includes('tesla');

  return (
    <group position={[0, 0, 0]}>
      {/* Lower Main Chassis / Body with Automotive Clearcoat */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 0.46, 3.75]} />
        <meshPhysicalMaterial
          color={paintColor}
          metalness={0.82}
          roughness={0.18}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Aerodynamic Front Hood & Sculpted Creases */}
      <mesh position={[0, 0.42, 1.42]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.74, 0.32, 1.05]} />
        <meshPhysicalMaterial
          color={paintColor}
          metalness={0.82}
          roughness={0.18}
          clearcoat={1.0}
        />
      </mesh>

      {/* Upper Cabin Greenhouse & Dark Tinted Glass */}
      <mesh position={[0, 0.92, -0.12]} castShadow>
        <boxGeometry args={[1.52, 0.54, 2.15]} />
        <meshPhysicalMaterial
          color="#04070D"
          metalness={0.1}
          roughness={0.04}
          transmission={0.85}
          transparent
          opacity={0.92}
          ior={1.52}
        />
      </mesh>

      {/* Roof Top Panel */}
      <mesh position={[0, 1.20, -0.15]}>
        <boxGeometry args={[1.46, 0.05, 1.98]} />
        <meshPhysicalMaterial
          color={paintColor}
          metalness={0.82}
          roughness={0.18}
          clearcoat={1.0}
        />
      </mesh>

      {/* Rear Roof Aero Spoiler with High-Mounted Brake Light */}
      <group position={[0, 1.22, -1.2]}>
        <mesh rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[1.48, 0.06, 0.38]} />
          <meshPhysicalMaterial color={paintColor} metalness={0.82} roughness={0.18} clearcoat={1.0} />
        </mesh>
        {/* High Stop Light Strip */}
        <mesh position={[0, -0.01, -0.19]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Front Windshield Slanted Glass */}
      <mesh position={[0, 0.86, 0.98]} rotation={[-0.58, 0, 0]}>
        <boxGeometry args={[1.5, 0.54, 0.06]} />
        <meshPhysicalMaterial
          color="#060A14"
          transmission={0.88}
          roughness={0.04}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Rear Hatchback Slanted Window (Matching Charging.jpg) */}
      <mesh position={[0, 0.86, -1.22]} rotation={[0.48, 0, 0]}>
        <boxGeometry args={[1.5, 0.54, 0.06]} />
        <meshPhysicalMaterial
          color="#060A14"
          transmission={0.88}
          roughness={0.04}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Front Dual LED Matrix Headlights & Cyan Accent Strip */}
      <mesh position={[-0.66, 0.46, 1.88]}>
        <boxGeometry args={[0.34, 0.08, 0.06]} />
        <meshBasicMaterial color="#67E8F9" />
      </mesh>
      <mesh position={[0.66, 0.46, 1.88]}>
        <boxGeometry args={[0.34, 0.08, 0.06]} />
        <meshBasicMaterial color="#67E8F9" />
      </mesh>
      <mesh position={[0, 0.47, 1.89]}>
        <boxGeometry args={[1.02, 0.025, 0.04]} />
        <meshBasicMaterial color="#2DD4BF" />
      </mesh>

      {/* Rear Full-Width Connected Glowing Red LED Tail Light Bar (Matching Charging.jpg) */}
      <group position={[0, 0.58, -1.88]}>
        {/* Main Glowing Red Tail Light Bar */}
        <mesh>
          <boxGeometry args={[1.72, 0.075, 0.05]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
        {/* Tail Light Red Ambient Glow */}
        <pointLight position={[0, 0, -0.3]} intensity={1.2} color="#EF4444" distance={2.5} />
      </group>

      {/* Rear Badging: "BYD" / "TESLA" Emblem + Model Name Badge (Matching Charging.jpg) */}
      <group position={[0, 0.48, -1.885]}>
        {/* Center Brand Emblem Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.01]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Secondary "SEAGULL" / Model Sub-Badge on Right Tailgate */}
        <mesh position={[0.42, -0.06, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.01]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Bumper & "CHARGEFLOW" License Plate (Matching Charging.jpg) */}
      <group position={[0, 0.28, -1.88]}>
        {/* Rear License Plate Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.16, 0.03]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* White License Plate Face with "CHARGEFLOW" */}
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.5, 0.13]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>
        {/* License Plate Inner Dark Emblem Strip */}
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.38, 0.045]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Sculpted Rear Aero Diffuser with Painted Body Accents (Matching Charging.jpg) */}
      <group position={[0, 0.14, -1.72]}>
        <mesh>
          <boxGeometry args={[1.72, 0.14, 0.35]} />
          <meshStandardMaterial color="#080C14" roughness={0.85} metalness={0.3} />
        </mesh>
        {/* Left/Right Sport Diffuser Wing Accents */}
        <mesh position={[-0.55, 0.05, -0.16]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.22, 0.16, 0.04]} />
          <meshPhysicalMaterial color={paintColor} metalness={0.82} roughness={0.18} />
        </mesh>
        <mesh position={[0.55, 0.05, -0.16]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.22, 0.16, 0.04]} />
          <meshPhysicalMaterial color={paintColor} metalness={0.82} roughness={0.18} />
        </mesh>
      </group>

      {/* 4 Sport Alloy Wheels with Dark Aero Rims */}
      {/* Front Left */}
      <group position={[-0.90, 0.28, 1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.29, 0.22, 24]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.9} />
        </mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.90, 0.28, 1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.29, 0.22, 24]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Left */}
      <group position={[-0.90, 0.28, -1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.29, 0.22, 24]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.9} />
        </mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Right */}
      <group position={[0.90, 0.28, -1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.29, 0.22, 24]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Open Charge Port Flap on Right Fender (Rendered only when isCharging is true) */}
      <group ref={portAnchorRef} position={[0.90, 0.58, 0.85]}>
        {isCharging && (
          <>
            {/* Open Flap Door Hinge */}
            <mesh position={[0.08, 0, -0.06]} rotation={[0, -Math.PI / 3, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.18]} />
              <meshPhysicalMaterial color={paintColor} metalness={0.82} roughness={0.18} />
            </mesh>

            {/* Illuminated Cyan Charging Socket Port Ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.045, 0.075, 24]} />
              <meshBasicMaterial color="#2DD4BF" side={THREE.DoubleSide} />
            </mesh>
            
            <pointLight position={[0.15, 0, 0]} intensity={1.2} color="#2DD4BF" distance={1.8} />
          </>
        )}
      </group>
    </group>
  );
};

export default ProceduralEVCar;

