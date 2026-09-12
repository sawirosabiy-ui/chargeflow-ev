import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RotateCw } from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { VehicleStage } from "./VehicleStage";
import { ChargingEnvironment } from "./charging-bay";
import { useTranslation } from "../../localization/useTranslation";

interface Cockpit3DStageProps {
  autoRotate?: boolean;
  className?: string;
}

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

export const Cockpit3DStage: React.FC<Cockpit3DStageProps> = React.memo(({
  autoRotate: propAutoRotate = false,
  className = "w-full h-full",
}) => {
  const [interactiveAutoRotate, setInteractiveAutoRotate] = useState(propAutoRotate);
  const { vehicle, chargingSession, theme } = useChargeFlowStore();
  const activeModelPath = vehicle.modelPath || "/models/byd-seagull.glb";
  const { t } = useTranslation();

  const isCharging = chargingSession?.status === "CHARGING";

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fixed eye-level automotive camera - responsive for mobile vs desktop
  const cameraPosition: [number, number, number] = [0.0, isMobile ? 0.32 : 0.44, isMobile ? 5.8 : 4.45];
  const cameraFov = isMobile ? 40 : 34;
  const stageScale = isMobile ? 0.82 : 1.0;

  return (
    <div className={`relative ${className} select-none cursor-grab active:cursor-grabbing w-full h-full`}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
        }}
        className="w-full h-full"
      >
        <ResponsiveCamera position={cameraPosition} fov={cameraFov} />

        {/* Stationary Stage / Ground Pad with Car-Only 360 Rotation */}
        <group position={[0, isMobile ? -0.36 : -0.46, 0]} scale={stageScale}>
          <ChargingEnvironment
            isCharging={isCharging}
            batterySoc={vehicle.batterySoc || 66}
            theme={theme}
            groundingOffset={-0.002}
            showEnergy={isCharging}
            showBackdrop={false}
            autoRotate={interactiveAutoRotate}
            autoRotateSpeed={0.8}
            initialRotation={-Math.PI / 5.5}
          >
            <VehicleStage
              key={vehicle.id}
              vehicleId={vehicle.id}
              modelPath={activeModelPath}
              scale={2.55}
              paintColor={vehicle.paintColor || "#0284c7"}
              isCharging={isCharging}
              showChargingPort={false}
            />
          </ChargingEnvironment>
        </group>
      </Canvas>

      {/* Floating 360 Spin / Auto-Rotate Toggle Button */}
      <button
        onClick={() => setInteractiveAutoRotate((v) => !v)}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-medium z-10 drop-shadow transition-all cursor-pointer pointer-events-auto"
        title={t.dragToRotate}
      >
        <RotateCw className={`w-3.5 h-3.5 text-teal-400 ${interactiveAutoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "5s" }} />
        <span>{t.dragToRotate}</span>
      </button>

      {/* Modern Pagination Dots */}
      <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 pointer-events-none z-10">
        <span className="w-3 h-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
      </div>
    </div>
  );
});

export default Cockpit3DStage;
