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
  hideTitle?: boolean;
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
  hideTitle = false,
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

  // Hero car camera framing: Car is larger, closer, and clearly fills the frame
  let cameraZ = isMobile ? 4.1 : 4.2;
  let cameraY = isMobile ? 0.36 : 0.38;
  let baseFov = isMobile ? 38 : 34;
  let stageScale = isMobile ? 1.45 : 1.35;
  let stageY = isMobile ? -0.58 : -0.56;

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

      {/* If title not hidden, display discrete title */}
      {!hideTitle && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
          <h2 className="text-lg sm:text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {selectedCar.name}
          </h2>
        </div>
      )}
    </div>
  );
});

export default ShowroomStage;
