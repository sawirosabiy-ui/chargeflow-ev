import React, { useMemo, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VehicleStage } from "../../canvas/VehicleStage";
import { ChargingEnvironment } from "../../canvas/charging-bay";
import { useChargeFlowStore } from "../../../store/useChargeFlowStore";

interface AheStation3DStageProps {
  isCharging: boolean;
  autoRotate: boolean;
  zoom: number;
  activeAngleIndex?: number;
  orbitRef?: React.RefObject<any>;
  batterySoc?: number;
  onUserInteraction?: () => void;
}

// Active camera responder inside Canvas to handle window resize & mobile device aspect ratio changes
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
  const { vehicle, theme } = useChargeFlowStore();
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;

  const [hasInteracted, setHasInteracted] = useState(false);

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

  // Responsive camera framing:
  // Dynamically computes camera distance, FOV, and stage height so the car occupies ~55–65% of the visual space on any phone screen size.
  let cameraZ = 4.4;
  let cameraY = 0.44;
  let baseFov = 34;
  let stageScale = 1.0;
  let stageY = -0.46;
  let carScale = 2.55;
  const centerX = 0.0;

  if (aspect < 1.05) {
    // Mobile Portrait / Tall Screen Devices:
    // Effective target visible width across vehicle wheelbase ~2.7m
    const targetWidth = isMobile ? 2.65 : 3.0;
    cameraZ = isMobile ? 4.8 : 4.6;
    cameraY = isMobile ? 0.36 : 0.40;
    stageY = isMobile ? -0.26 : -0.36;
    stageScale = isMobile ? 0.94 : 0.98;
    carScale = isMobile ? 2.25 : 2.45;

    // Calculate vertical FOV to maintain horizontal coverage without edge clipping
    const tanHalfVFov = targetWidth / (2 * cameraZ * aspect);
    const calculatedFov = (2 * Math.atan(tanHalfVFov) * 180) / Math.PI;
    // Keep FOV within a natural 34° - 48° range to prevent perspective distortion
    baseFov = Math.max(34, Math.min(48, calculatedFov));
  }

  const cameraFov = baseFov / (zoom || 1.0);
  const cameraPosition: [number, number, number] = [centerX, cameraY, cameraZ];

  // Default camera angle: 3/4 rear beauty angle
  const targetRotation = useMemo(() => {
    switch (activeAngleIndex) {
      case 0:
        return -Math.PI / 1.15; // 3/4 Rear-Side Beauty Angle
      case 1:
        return Math.PI; // Front Direct
      case 2:
        return -Math.PI / 2; // Side Profile
      case 3:
        return 0; // Direct Rear
      default:
        return -Math.PI / 1.15;
    }
  }, [activeAngleIndex]);

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (onUserInteraction) onUserInteraction();
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none">
      {/* 1. Cinematic Nighttime Architectural EV Facility Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-500"
        style={{
          backgroundImage: `url('/images/ahe_image.png')`,
        }}
      >
        {/* Soft environmental lighting vignette that anchors the 3D stage */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-[#070B12]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-35 pointer-events-none" />
      </div>

      {/* 2. Interactive Three.js 3D Layer: Grounded Architectural Stage & Car-Only 360 Rotation */}
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
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          shadows
        >
          {/* Synchronize camera dynamically on window resize or mobile orientation change */}
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
              autoRotateSpeed={0.8}
              initialRotation={-Math.PI / 1.15}
              targetRotation={targetRotation}
              onUserInteraction={handleInteraction}
            >
              <VehicleStage
                key={`${vehicle.id}-${vehicle.paintColor || '#0284c7'}`}
                vehicleId={vehicle.id}
                modelPath={vehicle.modelPath}
                scale={carScale}
                paintColor={vehicle.paintColor || "#0284c7"}
                isCharging={isCharging}
                showChargingPort={false}
              />
            </ChargingEnvironment>
          </group>
        </Canvas>
      </div>

      {/* 3. Subtle "↔ DRAG TO ROTATE ↔" Hint (Disappears smoothly after user interaction) */}
      {!hasInteracted && !autoRotate && (
        <div className="absolute top-[61%] sm:top-[63%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse transition-opacity duration-700">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono tracking-widest uppercase shadow-lg">
            <span className="text-teal-400">↔</span>
            <span>DRAG TO ROTATE</span>
            <span className="text-teal-400">↔</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AheStation3DStage;
