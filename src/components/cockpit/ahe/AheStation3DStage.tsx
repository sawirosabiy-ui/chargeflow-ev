import React, { useMemo, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Check } from "lucide-react";
import { VehicleStage } from "../../canvas/VehicleStage";
import { ChargingEnvironment } from "../../canvas/charging-bay";
import { useChargeFlowStore } from "../../../store/useChargeFlowStore";
import { VEHICLE_COLORS } from "../../../data/cars";

interface AheStation3DStageProps {
  isCharging: boolean;
  autoRotate: boolean;
  zoom: number;
  activeAngleIndex?: number;
  orbitRef?: React.RefObject<any>;
  batterySoc?: number;
  onUserInteraction?: () => void;
}

// Active camera responder component inside Canvas to handle window resizes & mobile device aspect ratio changes immediately
const ResponsiveCamera: React.FC<{
  position: [number, number, number];
  fov: number;
}> = ({ position, fov }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    (camera as THREE.PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, position, fov]);

  return null;
};

export const AheStation3DStage: React.FC<AheStation3DStageProps> = ({
  isCharging,
  autoRotate,
  zoom = 1.0,
  activeAngleIndex = 0,
  batterySoc = 66,
  onUserInteraction,
}) => {
  const { vehicle, theme, setVehicleColor } = useChargeFlowStore();
  const isCream = theme === 'cream';
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewport.width < 640;
  const aspect = viewport.width / (viewport.height || 1);

  // Dynamic responsive framing for any device width and aspect ratio
  // On desktop: standard eye-level studio framing (fov 34, Z 4.8, stageScale 1.0)
  // On mobile / tablet portrait: adaptively adjust fov and camera position so the car looks bold and prominent, filling ~86% of the screen width without clipping.
  let cameraZ = 4.45;
  let cameraY = 0.42;
  let baseFov = 34;
  let stageScale = 1.0;
  let stageY = -0.56;
  let centerX = 0.08;

  if (aspect < 1.15) {
    // Portrait / Square mobile & tablet devices
    const targetFillRatio = isMobile ? 0.88 : 0.84;
    // Effective car width in world units ~3.45m with scale 1.95
    const targetVisibleWidth = 3.20 / targetFillRatio;
    cameraZ = isMobile ? 4.7 : 4.6;
    cameraY = isMobile ? 0.20 : 0.32;
    stageY = isMobile ? -0.10 : -0.32;
    centerX = 0.0;
    stageScale = isMobile ? 0.94 : 0.98;

    // Calculate exact vertical FOV to maintain horizontal coverage = targetVisibleWidth
    const tanHalfVFov = targetVisibleWidth / (2 * cameraZ * aspect);
    baseFov = (2 * Math.atan(tanHalfVFov) * 180) / Math.PI;
  }

  const cameraFov = baseFov / (zoom || 1.0);
  const cameraPosition: [number, number, number] = [centerX, cameraY, cameraZ];

  // Map angle preset index to vehicle rotation angle (only the car turns, camera and background stay completely still)
  const targetRotation = useMemo(() => {
    switch (activeAngleIndex) {
      case 0:
        return -Math.PI / 1.12; // 3/4 Front Beauty
      case 1:
        return Math.PI; // Front Direct
      case 2:
        return -Math.PI / 2; // Side Profile
      case 3:
        return 0; // Rear View
      default:
        return -Math.PI / 1.12;
    }
  }, [activeAngleIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none">
      {/* 1. ORIGINAL STATION BACKGROUND IMAGE (Completely still, never moves) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/images/ahe_image.png')`,
        }}
      >
        {isActivelyCharging && (
          <div className="absolute inset-0 bg-teal-500/5 mix-blend-screen pointer-events-none animate-pulse" />
        )}
      </div>

      {/* 2. Interactive Three.js 3D Layer: Stationary Stage & Car-Only 360 Rotation */}
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-pan-y">
        <Canvas
          className="w-full h-full"
          camera={{
            position: cameraPosition,
            fov: cameraFov,
            near: 0.1,
            far: 80,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          shadows
        >
          {/* Synchronize camera dynamically on window resize or mobile rotation */}
          <ResponsiveCamera position={cameraPosition} fov={cameraFov} />

          {/* Grounded stage placed at exact station terrace level with responsive scaling */}
          <group position={[centerX, stageY, 0]} scale={stageScale}>
            <ChargingEnvironment
              isCharging={isCharging}
              batterySoc={batterySoc}
              theme={theme}
              groundingOffset={-0.002}
              showEnergy={isActivelyCharging}
              showBackdrop={false}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
              initialRotation={-Math.PI / 1.12}
              targetRotation={targetRotation}
              onUserInteraction={onUserInteraction}
            >
              <VehicleStage
                key={`${vehicle.id}-${vehicle.paintColor || '#0284c7'}`}
                vehicleId={vehicle.id}
                modelPath={vehicle.modelPath}
                scale={2.60}
                paintColor={vehicle.paintColor || "#0284c7"}
                isCharging={isCharging}
                showChargingPort={false}
              />
            </ChargingEnvironment>
          </group>
        </Canvas>
      </div>

      {/* 3. Floating Studio Swatch Bar (Option 1: 1-Tap Live Exterior Color Swatches in Cockpit) */}
      <div className="absolute bottom-20 sm:bottom-24 xl:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none">
        <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border backdrop-blur-2xl transition-all shadow-xl ${
          isCream
            ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-800 shadow-[0_10px_30px_rgba(40,20,10,0.15)]'
            : 'bg-[#08101E]/85 border-teal-500/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
        }`}>
          {VEHICLE_COLORS.map((color) => {
            const isSelected = (vehicle.paintColor || '#0284c7').toLowerCase() === color.hex.toLowerCase();
            const isLight = color.id === 'white' || color.id === 'silver';
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setVehicleColor(color.hex, color.name)}
                title={`Vehicle Color: ${color.name}`}
                className={`relative w-6 h-6 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'scale-110 ring-2 ring-teal-400 ring-offset-2 shadow-[0_0_12px_rgba(45,212,191,0.6)]'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                } ${isCream ? 'ring-offset-[#FAF7F2]' : 'ring-offset-[#070D1A]'}`}
                style={{
                  backgroundColor: color.hex,
                  border: `1px solid ${color.borderHex || 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${isLight ? 'text-slate-950' : 'text-white'}`}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AheStation3DStage;
