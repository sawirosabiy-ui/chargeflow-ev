import React, { useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCw } from 'lucide-react';
import { CarSpec, AVAILABLE_CARS } from '../data/cars';
import { VehicleStage } from './canvas/VehicleStage';
import { ChargingEnvironment } from './canvas/charging-bay';

interface ShowroomStageProps {
  selectedCar: CarSpec;
  paintColor?: string;
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
  paintColor,
  autoRotate: propAutoRotate = false,
  className = 'w-full h-full',
  hideTitle = false,
}) => {
  const [interactiveAutoRotate, setInteractiveAutoRotate] = useState(propAutoRotate);

  useEffect(() => {
    setInteractiveAutoRotate(propAutoRotate);
  }, [propAutoRotate]);

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

  const cameraConfig = useMemo(() => {
    const w = viewport.width;
    if (w < 640) {
      return { position: [0.75, 1.45, 4.4] as [number, number, number], fov: 46 };
    }
    if (w < 1024) {
      return { position: [1.2, 1.6, 4.7] as [number, number, number], fov: 41 };
    }
    return { position: [1.5, 1.65, 4.8] as [number, number, number], fov: 38 };
  }, [viewport.width]);

  return (
    <div className={`relative ${className} select-none overflow-hidden touch-none`}>
      <Canvas
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        <ResponsiveCamera position={cameraConfig.position} fov={cameraConfig.fov} />

        <group position={[0, -0.42, 0]}>
          <ChargingEnvironment
            batterySoc={60}
            theme="dark"
            groundingOffset={-0.002}
            showEnergy={false}
            showBackdrop={false}
            autoRotate={interactiveAutoRotate}
            autoRotateSpeed={0.8}
            initialRotation={-Math.PI / 5.5}
            onUserInteraction={() => setInteractiveAutoRotate(false)}
          >
            <VehicleStage
              key={`${selectedCar.id}-${paintColor || selectedCar.paintColor || ''}`}
              vehicleId={selectedCar.id}
              modelPath={selectedCar.modelPath}
              scale={2.55}
              paintColor={paintColor || selectedCar.paintColor || '#2DD4BF'}
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
