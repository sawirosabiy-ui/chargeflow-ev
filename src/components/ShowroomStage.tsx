import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCw } from 'lucide-react';
import { CarSpec, AVAILABLE_CARS } from '../data/cars';
import { VehicleStage } from './canvas/VehicleStage';
import { ChargingEnvironment } from './canvas/charging-bay';

interface ShowroomStageProps {
  selectedCar: CarSpec;
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

export const ShowroomStage: React.FC<ShowroomStageProps> = React.memo(({
  selectedCar = AVAILABLE_CARS[0],
  autoRotate: propAutoRotate = true,
  className = 'w-full h-full',
}) => {
  const [interactiveAutoRotate, setInteractiveAutoRotate] = useState(propAutoRotate);

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

  let cameraZ = 4.65;
  let cameraY = 0.44;
  let baseFov = 34;
  let stageScale = 1.0;
  let stageY = -0.52;

  if (aspect < 1.15) {
    const targetFillRatio = isMobile ? 0.86 : 0.80;
    const targetVisibleWidth = 3.45 / targetFillRatio;
    cameraZ = isMobile ? 5.6 : 5.0;
    cameraY = isMobile ? 0.40 : 0.42;
    stageY = isMobile ? -0.50 : -0.52;
    stageScale = isMobile ? 0.90 : 0.96;

    const tanHalfVFov = targetVisibleWidth / (2 * cameraZ * aspect);
    baseFov = (2 * Math.atan(tanHalfVFov) * 180) / Math.PI;
  }

  const cameraPosition: [number, number, number] = [0.0, cameraY, cameraZ];
  const cameraFov = baseFov;

  return (
    <div className={`relative ${className} select-none cursor-grab active:cursor-grabbing w-full h-full`}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true,
        }}
        className="w-full h-full"
      >
        <ResponsiveCamera position={cameraPosition} fov={cameraFov} />

        {/* Stationary Stage / Ground Pad with Car-Only 360 Rotation */}
        <group position={[0, stageY, 0]} scale={stageScale}>
          <ChargingEnvironment
            isCharging={false}
            batterySoc={75}
            theme="dark"
            groundingOffset={-0.002}
            showEnergy={false}
            showBackdrop={false}
            autoRotate={interactiveAutoRotate}
            autoRotateSpeed={0.8}
            initialRotation={-Math.PI / 5.5}
          >
            <VehicleStage
              key={selectedCar.id}
              vehicleId={selectedCar.id}
              modelPath={selectedCar.modelPath}
              scale={2.55}
              paintColor={selectedCar.paintColor || '#2DD4BF'}
              isCharging={false}
              showChargingPort={false}
            />
          </ChargingEnvironment>
        </group>
      </Canvas>

      {/* Floating 360° Sign & Chosen Car Name as H2 under the Car */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 space-y-2 text-center pointer-events-none">
        {/* Chosen Car Name as an H2 */}
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          {selectedCar.name}
        </h2>

        {/* 360° Interactive Toggle Badge */}
        <button
          onClick={() => setInteractiveAutoRotate((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#070B14]/85 hover:bg-[#070B14] backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)] transition-all cursor-pointer pointer-events-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#2DD4BF] ${interactiveAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '5s' }} />
          <span className="font-mono tracking-wider text-[#2DD4BF] font-bold text-[11px]">360° VIEW</span>
          <span className="text-slate-600">•</span>
          <span className="text-[10px] text-slate-300 tracking-wide font-medium">Click to toggle / Drag to rotate</span>
        </button>
      </div>
    </div>
  );
});

export default ShowroomStage;
