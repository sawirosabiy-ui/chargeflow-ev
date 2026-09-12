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
}) => {
  const { vehicle, theme } = useChargeFlowStore();
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
    cameraZ = isMobile ? 4.9 : 4.6;
    cameraY = isMobile ? 0.40 : 0.42;
    stageY = isMobile ? -0.52 : -0.56;
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
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
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
            >
              <VehicleStage
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
    </div>
  );
};

export default AheStation3DStage;
