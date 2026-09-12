import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { VirtualChargingPortConfig } from '../../data/vehicleConfigs';

export interface VirtualChargingPortHandle {
  getAnchorGroup: () => THREE.Group | null;
  getCableInletGroup: () => THREE.Group | null;
}

interface VirtualChargingPortProps {
  config: VirtualChargingPortConfig;
  paintColor?: string;
  isCharging?: boolean;
  showDebug?: boolean;
}

export const VirtualChargingPort = forwardRef<THREE.Group, VirtualChargingPortProps>(({
  config,
  paintColor = '#0284c7',
  isCharging = true,
  showDebug = false,
}, ref) => {
  const flapSign = config.position.x >= 0 ? 1 : -1;
  const isRightSide = flapSign > 0;

  const internalRef = useRef<THREE.Group>(null);
  const cableInletRef = useRef<THREE.Group>(null);
  const portLightRef = useRef<THREE.PointLight>(null);
  const haloRingRef = useRef<THREE.Mesh>(null);

  useImperativeHandle(ref, () => internalRef.current as THREE.Group);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (portLightRef.current) {
      if (isCharging) {
        portLightRef.current.intensity = Math.sin(t * 5.0) * 0.8 + 2.2;
        portLightRef.current.color.set('#10B981');
      } else {
        portLightRef.current.intensity = 0.8;
        portLightRef.current.color.set('#F59E0B');
      }
    }
    if (haloRingRef.current) {
      const scale = isCharging ? (Math.sin(t * 5.0) * 0.08 + 1.0) : 1.0;
      haloRingRef.current.scale.set(scale, scale, 1.0);
    }
  });

  return (
    <group
      ref={internalRef}
      position={[config.position.x, config.position.y, config.position.z]}
      rotation={[
        config.rotation?.x || 0,
        config.rotation?.y || 0,
        config.rotation?.z || 0,
      ]}
    >
      {/* 1. Only render Flap, Socket, and Plugged-in Connector Gun when Charging */}
      {isCharging && (
        <group>
          {/* A. Open Port Door Flap Hinged Backwards & Outwards */}
          <group position={[flapSign * 0.02, 0, -0.09]} rotation={[0, -flapSign * 1.15, 0]}>
            <mesh position={[0, 0, -0.06]}>
              <boxGeometry args={[0.012, config.flapHeight || 0.14, config.flapWidth || 0.13]} />
              <meshPhysicalMaterial
                color={paintColor}
                metalness={0.7}
                roughness={0.2}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
            {/* Flap interior black trim */}
            <mesh position={[-flapSign * 0.007, 0, -0.06]}>
              <planeGeometry args={[0.01, config.flapHeight || 0.13]} />
              <meshStandardMaterial color="#0A0E17" roughness={0.8} />
            </mesh>
          </group>

          {/* B. Recessed Charging Port Cavity & Socket Housing */}
          <group position={[0, 0, 0]} rotation={[0, flapSign * (Math.PI / 2), 0]}>
            {/* Recessed Cup */}
            <mesh position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.062, 0.07, 24]} />
              <meshStandardMaterial color="#060911" roughness={0.9} />
            </mesh>

            {/* Socket Face Bezel */}
            <mesh position={[0, 0, 0.002]}>
              <ringGeometry args={[0.042, 0.064, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Glowing Emerald Green Socket Inlet Halo Ring */}
            <mesh ref={haloRingRef} position={[0, 0, 0.005]}>
              <ringGeometry args={[0.046, 0.058, 24]} />
              <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
            </mesh>

            {/* Dual DC Fast Charge Female Contact Pins */}
            <mesh position={[-0.018, -0.015, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.03, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.018, -0.015, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.03, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* C. Heavy-Duty Industrial Fast Charging Connector Gun Plugged into Socket */}
          <group 
            position={[flapSign * 0.06, -0.01, 0.01]} 
            rotation={[0, flapSign * -0.12, flapSign * 0.18]}
          >
            {/* Connector Nozzle Insertion Barrel */}
            <mesh rotation={[0, 0, flapSign * (Math.PI / 2)]}>
              <cylinderGeometry args={[0.042, 0.048, 0.12, 18]} />
              <meshStandardMaterial color="#0B0F19" roughness={0.35} metalness={0.7} />
            </mesh>

            {/* Connector Main Handle Housing (Vibrant Emerald Green matching reference image) */}
            <mesh position={[flapSign * 0.07, -0.05, 0]} rotation={[0, 0, flapSign * 0.75]}>
              <boxGeometry args={[0.048, 0.14, 0.055]} />
              <meshStandardMaterial 
                color="#10B981" 
                emissive="#059669"
                emissiveIntensity={0.5}
                roughness={0.25} 
                metalness={0.5} 
              />
            </mesh>

            {/* Glowing Green Status Light Ring on Gun Body */}
            <mesh position={[flapSign * 0.015, 0, 0]} rotation={[0, flapSign * (Math.PI / 2), 0]}>
              <ringGeometry args={[0.044, 0.052, 18]} />
              <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
            </mesh>

            {/* Top Latch Release Button */}
            <mesh position={[flapSign * 0.04, 0.038, 0]}>
              <boxGeometry args={[0.04, 0.015, 0.024]} />
              <meshStandardMaterial color="#047857" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Rubberized Cable Strain Relief Boot (Where cable enters the plug) */}
            <group 
              ref={cableInletRef} 
              position={[flapSign * 0.12, -0.11, 0]} 
              rotation={[0, 0, flapSign * 0.85]}
            >
              <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.024, 0.032, 0.06, 16]} />
                <meshStandardMaterial color="#080C14" roughness={0.85} />
              </mesh>
            </group>
          </group>

          {/* D. Port Illumination Glow Light */}
          <pointLight
            ref={portLightRef}
            position={[flapSign * 0.15, 0, 0]}
            intensity={1.8}
            color="#10B981"
            distance={2.2}
          />
        </group>
      )}

      {/* 2. Debug Coordinate Visualizer */}
      {showDebug && (
        <group>
          <mesh>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FF4500" wireframe />
          </mesh>
          <axesHelper args={[0.25]} />
          <Html position={[0, 0.14, 0]} center distanceFactor={8}>
            <div className="bg-orange-600 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg border border-white/20 whitespace-nowrap pointer-events-none">
              PORT: [{config.position.x.toFixed(2)}, {config.position.y.toFixed(2)}, {config.position.z.toFixed(2)}]
            </div>
          </Html>
        </group>
      )}
    </group>
  );
});

export default VirtualChargingPort;
