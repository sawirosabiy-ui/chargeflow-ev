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
  const isCream = theme === "cream";
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
  // Dynamically computes camera distance, FOV, and stage height so the car occupies ~55–60% of the visual space without clipping
  let cameraZ = 4.4;
  let cameraY = 0.42;
  let baseFov = 34;
  let stageScale = 1.0;
  let stageY = -0.38;
  let carScale = 2.5;
  const centerX = 0.0;

  if (aspect < 1.05) {
    // Mobile Portrait / Tall Screen Devices:
    const targetWidth = isMobile ? 2.65 : 2.9;
    cameraZ = isMobile ? 4.7 : 4.5;
    cameraY = isMobile ? 0.38 : 0.40;
    stageY = isMobile ? -0.28 : -0.34;
    stageScale = isMobile ? 0.95 : 0.98;
    carScale = isMobile ? 2.35 : 2.45;

    // Calculate vertical FOV to maintain horizontal coverage without edge clipping
    const tanHalfVFov = targetWidth / (2 * cameraZ * aspect);
    const calculatedFov = (2 * Math.atan(tanHalfVFov) * 180) / Math.PI;
    baseFov = Math.max(34, Math.min(46, calculatedFov));
  }

  const cameraFov = baseFov / (zoom || 1.0);
  const cameraPosition: [number, number, number] = [centerX, cameraY, cameraZ];

  // Default camera angle: Authentic 3/4 rear beauty perspective matching phone charging.png
  const targetRotation = useMemo(() => {
    switch (activeAngleIndex) {
      case 0:
        return -Math.PI / 4.2; // 3/4 Rear-Side Beauty Angle (~ -43°)
      case 1:
        return Math.PI; // Front Direct
      case 2:
        return -Math.PI / 2; // Side Profile
      case 3:
        return 0; // Direct Rear
      default:
        return -Math.PI / 4.2;
    }
  }, [activeAngleIndex]);

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (onUserInteraction) onUserInteraction();
  };

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden select-none transition-colors duration-500 ${
      isCream ? "bg-[#FAF7F2]" : "bg-[#060913]"
    }`}>
      {/* 1. Pure Minimalist Dark Studio Environment (No building images or background clutter) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isCream
            ? "bg-gradient-to-b from-[#F7F3EB] via-[#ECE5D8] to-[#E3DCD0]"
            : "bg-gradient-to-b from-[#050811] via-[#09101D] to-[#04060C]"
        }`}
      >
        {/* Soft Radial Center Uplight to highlight the vehicle silhouette and circular pad */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isCream
              ? "radial-gradient(circle at 50% 55%, rgba(20, 184, 166, 0.08) 0%, transparent 65%)"
              : "radial-gradient(circle at 50% 55%, rgba(45, 212, 191, 0.12) 0%, rgba(13, 148, 136, 0.04) 40%, transparent 70%)",
          }}
        />
        {/* Subtle Vignette on edges */}
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
      </div>

      {/* 2. Interactive Three.js 3D Layer: Grounded Circular Stage & Car 360 Rotation */}
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
            toneMappingExposure: isCream ? 1.0 : 1.1,
          }}
          shadows
        >
          {/* Synchronize camera dynamically on window resize or mobile orientation change */}
          <ResponsiveCamera position={cameraPosition} fov={cameraFov} />

          {/* Grounded stage placed at exact center level with responsive scaling */}
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
              initialRotation={-Math.PI / 4.2}
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

      {/* 3. Subtle "↔ DRAG TO ROTATE ↔" Hint */}
      {!hasInteracted && !autoRotate && (
        <div className="absolute top-[62%] sm:top-[64%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse transition-opacity duration-700">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono tracking-widest uppercase shadow-lg ${
            isCream
              ? "bg-white/70 border-slate-300/60 text-slate-700"
              : "bg-black/50 border-white/10 text-slate-300"
          }`}>
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
