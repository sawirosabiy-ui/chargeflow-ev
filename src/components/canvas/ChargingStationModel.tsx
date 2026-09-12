import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface ChargingStationModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isCharging?: boolean;
  powerKw?: number;
  soc?: number;
  holsterSide?: 'left' | 'right';
  nozzleRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
}

export const ChargingStationModel = forwardRef<THREE.Group, ChargingStationModelProps>(({
  position = [1.85, 0, 0.2],
  rotation = [0, -0.4, 0],
  isCharging = true,
  powerKw = 86,
  soc = 66,
  holsterSide = 'left',
  nozzleRef,
}, ref) => {
  const holsterX = holsterSide === 'right' ? 0.28 : -0.28;
  const holsterRotZ = holsterSide === 'right' ? -0.3 : 0.3;
  const holsterDir = holsterSide === 'right' ? 1 : -1;

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Matte Black Mounting Base Plate Bolted to Floor */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.06, 0.62]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Main Pedestal Monolith Column */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 2.2, 0.44]} />
        <meshStandardMaterial 
          color="#0B101D" 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>

      {/* Curved Brushed Silver / White Outer Shell (Left & Right Flanks) */}
      <mesh position={[-0.31, 1.15, 0]} castShadow>
        <boxGeometry args={[0.06, 2.22, 0.46]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.31, 1.15, 0]} castShadow>
        <boxGeometry args={[0.06, 2.22, 0.46]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Top Curved Cap */}
      <mesh position={[0, 2.26, 0]}>
        <boxGeometry args={[0.66, 0.06, 0.46]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Glossy Dark Glass Front Fascia */}
      <mesh position={[0, 1.15, 0.222]} castShadow>
        <planeGeometry args={[0.54, 2.12]} />
        <meshPhysicalMaterial
          color="#02050A"
          metalness={0.95}
          roughness={0.03}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Vertical Glowing Neon Teal/Green Light Blades along both outer flanks */}
      <mesh position={[-0.30, 1.15, 0.224]}>
        <planeGeometry args={[0.018, 2.05]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <mesh position={[0.30, 1.15, 0.224]}>
        <planeGeometry args={[0.018, 2.05]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <pointLight position={[-0.32, 1.15, 0.3]} intensity={0.9} color="#10B981" distance={2.0} />
      <pointLight position={[0.32, 1.15, 0.3]} intensity={0.9} color="#10B981" distance={2.0} />

      {/* High-Resolution OLED Screen Display matching crop_charger.png */}
      <group position={[-0.04, 1.22, 0.226]}>
        {/* Screen Background Glass */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.42, 1.45]} />
          <meshBasicMaterial color="#020409" />
        </mesh>

        {/* 1. Header: ADDIS EV HUB with Lightning Logo */}
        <group position={[0, 0.58, 0.002]}>
          {/* Neon Lightning Bolt Logo */}
          <mesh position={[-0.09, 0, 0]} scale={[0.018, 0.018, 0.018]}>
            <shapeGeometry
              args={[
                (() => {
                  const shape = new THREE.Shape();
                  shape.moveTo(0, 4);
                  shape.lineTo(-2.5, 0.2);
                  shape.lineTo(-0.2, 0.2);
                  shape.lineTo(-1.6, -4);
                  shape.lineTo(3.2, -0.4);
                  shape.lineTo(0.5, -0.4);
                  shape.closePath();
                  return shape;
                })()
              ]}
            />
            <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0.03, 0, 0]}
            fontSize={0.032}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            fontWeight="black"
            letterSpacing={0.06}
          >
            ADDIS EV HUB
          </Text>
        </group>

        {/* 2. Middle: Circular Progress Ring Gauge with 66% and CHARGING */}
        <group position={[0, 0.28, 0.003]}>
          {/* Background Ring Track */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.13, 0.155, 36]} />
            <meshBasicMaterial color="#042F2C" />
          </mesh>
          {/* Active Arc Gauge */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.13, 0.155, 36, 1, 0, Math.PI * 2 * (soc / 100)]} />
            <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
          </mesh>
          {/* Center Text: "66%" */}
          <Text
            position={[0, 0.02, 0.002]}
            fontSize={0.075}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight="black"
          >
            {soc}%
          </Text>
          {/* Sub-text: "CHARGING" */}
          <Text
            position={[0, -0.05, 0.002]}
            fontSize={0.024}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.08}
          >
            CHARGING
          </Text>
        </group>

        {/* 3. Bottom Telemetry Rows: POWER 149kW, VOLTAGE 402v, TIME 18min */}
        <group position={[0, -0.15, 0.003]}>
          {/* Row 1: POWER 149 kW */}
          <group position={[0, 0.11, 0]}>
            <Text
              position={[-0.14, 0, 0]}
              fontSize={0.022}
              color="#10B981"
              anchorX="left"
              anchorY="middle"
              fontWeight="bold"
              letterSpacing={0.05}
            >
              POWER
            </Text>
            <Text
              position={[0.14, 0, 0]}
              fontSize={0.038}
              color="#FFFFFF"
              anchorX="right"
              anchorY="middle"
              fontWeight="black"
            >
              {powerKw} kW
            </Text>
          </group>

          {/* Row 2: VOLTAGE 402 v */}
          <group position={[0, 0.02, 0]}>
            <Text
              position={[-0.14, 0, 0]}
              fontSize={0.022}
              color="#10B981"
              anchorX="left"
              anchorY="middle"
              fontWeight="bold"
              letterSpacing={0.05}
            >
              VOLTAGE
            </Text>
            <Text
              position={[0.14, 0, 0]}
              fontSize={0.038}
              color="#FFFFFF"
              anchorX="right"
              anchorY="middle"
              fontWeight="black"
            >
              402 v
            </Text>
          </group>

          {/* Row 3: TIME 18 min */}
          <group position={[0, -0.07, 0]}>
            <Text
              position={[-0.14, 0, 0]}
              fontSize={0.022}
              color="#10B981"
              anchorX="left"
              anchorY="middle"
              fontWeight="bold"
              letterSpacing={0.05}
            >
              TIME
            </Text>
            <Text
              position={[0.14, 0, 0]}
              fontSize={0.038}
              color="#FFFFFF"
              anchorX="right"
              anchorY="middle"
              fontWeight="black"
            >
              18 min
            </Text>
          </group>
        </group>
      </group>

      {/* Right Flank: Secondary Holster with Gun & Cable Loop */}
      <group position={[0.22, 1.25, 0.18]}>
        {/* Upper Indicator Badge [ ⚡ ] */}
        <mesh position={[0, 0.28, 0]}>
          <planeGeometry args={[0.04, 0.08]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        {/* Recessed Holster Cavity */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.26, 0.1]} />
          <meshStandardMaterial color="#050811" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Holstered Secondary Handle */}
        <mesh position={[0, -0.02, 0.05]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.035, 0.18, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Secondary Cable Hanging Loop */}
        <mesh position={[0.02, -0.35, 0.02]} rotation={[0, 0, 0.1]}>
          <torusGeometry args={[0.22, 0.016, 12, 24, Math.PI * 0.9]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* Active Left Cable Dispenser Holster / Exit Socket (Mounted toward car) */}
      <group ref={nozzleRef} position={[holsterX, 1.02, 0.08]} rotation={[0, 0, holsterRotZ]}>
        <mesh position={[holsterDir * 0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.08, 0.24, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Holster Illuminated Neon Green Ring */}
        <mesh position={[holsterDir * 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.055, 0.08, 16]} />
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[holsterDir * 0.05, 0, 0]} intensity={0.8} color="#10B981" distance={1.5} />
      </group>

      {/* Stainless Steel Station Bollard with Glowing Green Band (matching reference image) */}
      <group position={[-0.55, 0, 0.2]}>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.76, 24]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Glowing Green Band */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.046, 0.046, 0.08, 24]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <pointLight position={[0, 0.58, 0]} intensity={0.5} color="#10B981" distance={1.2} />
      </group>

      {/* Station Pedestal Ground Glow */}
      <pointLight position={[0, 0.2, 0.45]} intensity={1.0} color="#10B981" distance={3.0} />
    </group>
  );
});

export default ChargingStationModel;
