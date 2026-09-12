import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { ChargingStage } from './ChargingStage';
import { ChargingPad } from './ChargingPad';
import { WirelessEnergy } from './WirelessEnergy';
import { SceneLighting } from './SceneLighting';
import { CinematicCamera } from './CinematicCamera';
import { VehicleStage } from '../../canvas/VehicleStage';

// Inner component inside Canvas to handle dynamic frame lerp of chargingIntensity
const CockpitSceneContent: React.FC = () => {
  const cockpitCharging = useChargeFlowStore((s) => s.cockpitCharging);
  const vehicle = useChargeFlowStore((s) => s.vehicle);

  const status = cockpitCharging.status;
  const isCharging = status === 'charging';

  // State-driven target intensity
  // Idle: 0.05 | Starting: 0.60 | Charging: 1.00 | Paused: 0.12 | Stopping: 0.05 | Complete: 0.05
  let targetIntensity = 0.05;
  if (status === 'charging') targetIntensity = 1.00;
  else if (status === 'starting') targetIntensity = 0.60;
  else if (status === 'paused') targetIntensity = 0.12;
  else if (status === 'stopping') targetIntensity = 0.05;
  else if (status === 'complete') targetIntensity = 0.05;
  else targetIntensity = 0.05;

  const [intensity, setIntensity] = useState(targetIntensity);
  const intensityRef = useRef(targetIntensity);

  useFrame((_, delta) => {
    // Smooth exponential damping toward target intensity (prevents jarring snaps)
    const next = THREE.MathUtils.damp(intensityRef.current, targetIntensity, 3.5, delta);
    if (Math.abs(next - intensityRef.current) > 0.005) {
      intensityRef.current = next;
      setIntensity(next);
    }
  });

  return (
    <>
      {/* 1. Dynamic State-driven Cinematic Camera */}
      <CinematicCamera
        status={status}
        autoRotate={cockpitCharging.autoRotate}
      />

      {/* 2. Coordinated Environmental Studio Lighting (Floor bounce, rocker panels, tires) */}
      <SceneLighting
        status={status}
        intensity={intensity}
      />

      {/* 3. Wet Asphalt Ground & Specular Reflections */}
      <ChargingStage />

      {/* 4. Physical Rectangular Beveled Inductive Platform */}
      <ChargingPad
        intensity={intensity}
        status={status}
        isCharging={isCharging}
      />

      {/* 5. 4-Layer Wireless Energy Field (Horizontal rings + Vertical volume + Particles + Undercarriage) */}
      <WirelessEnergy
        intensity={intensity}
        status={status}
        battery={cockpitCharging.battery}
      />

      {/* 6. Centerpiece: Selected EV Model with NO conventional cable/plug */}
      <group position={[0, 0.02, 0]} rotation={[0, -Math.PI / 1.08, 0]}>
        <VehicleStage
          vehicleId={vehicle.id}
          modelPath={vehicle.modelPath}
          scale={vehicle.scale || 4.2}
          paintColor={vehicle.paintColor || '#1d4ed8'}
          isCharging={isCharging}
          showChargingPort={false}
        />
      </group>
    </>
  );
};

export const ChargeFlowScene: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0B0F17] select-none">
      <Canvas
        className="w-full h-full"
        camera={{ position: [4.9, 2.15, 5.4], fov: 34, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        <CockpitSceneContent />
      </Canvas>
    </div>
  );
};

export default ChargeFlowScene;
