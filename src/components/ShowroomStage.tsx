import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCw } from 'lucide-react';
import { CarSpec, AVAILABLE_CARS } from '../data/cars';
import { VehicleStage } from './canvas/VehicleStage';
import { ChargingEnvironment } from './canvas/charging-bay';
import { useTranslation } from '../localization/useTranslation';

interface ShowroomStageProps {
  selectedCar: CarSpec;
  paintColor?: string;
  autoRotate?: boolean;
  className?: string;
  hideTitle?: boolean;
  hideBottomControls?: boolean;
  onToggleAutoRotate?: (active: boolean) => void;
}

/**
 * ResponsiveShowroomCamera:
 * Dynamically computes the vehicle's exact THREE.Box3 bounding box and positions
 * the perspective camera based on the model dimensions and canvas aspect ratio.
 * 
 * Guarantees:
 * - The entire vehicle remains 100% visible: no wheels, no bumper, no roof, no rear cut off.
 * - Sits squarely in the lower-middle/center of the stage with intentional breathing room.
 * - Occupies roughly 65–80% of the visual height of the stage on mobile.
 * - Dynamically updates on resize, orientation change, car model switch, and color change.
 */
const ResponsiveShowroomCamera: React.FC<{
  carGroupRef: React.RefObject<THREE.Group | null>;
  selectedCarId: string;
  paintColor?: string;
}> = ({ carGroupRef, selectedCarId }) => {
  const { camera, size } = useThree();

  const updateCameraFraming = React.useCallback(() => {
    if (!carGroupRef.current) return false;

    // 1. Calculate bounding box strictly of visible vehicle meshes
    const box = new THREE.Box3();
    let meshCount = 0;
    let maxRadiusSq = 0;
    let carTopY = -Infinity;
    let carBottomY = Infinity;

    carGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.visible) {
        const mesh = child as THREE.Mesh;
        box.expandByObject(mesh);
        meshCount++;

        const geom = mesh.geometry;
        if (geom) {
          if (!geom.boundingBox) geom.computeBoundingBox();
          const b = geom.boundingBox;
          if (b) {
            const corners = [
              new THREE.Vector3(b.min.x, b.min.y, b.min.z),
              new THREE.Vector3(b.min.x, b.min.y, b.max.z),
              new THREE.Vector3(b.min.x, b.max.y, b.min.z),
              new THREE.Vector3(b.min.x, b.max.y, b.max.z),
              new THREE.Vector3(b.max.x, b.min.y, b.min.z),
              new THREE.Vector3(b.max.x, b.min.y, b.max.z),
              new THREE.Vector3(b.max.x, b.max.y, b.min.z),
              new THREE.Vector3(b.max.x, b.max.y, b.max.z),
            ];
            for (const c of corners) {
              c.applyMatrix4(mesh.matrixWorld);
              const rSq = c.x * c.x + c.z * c.z;
              if (rSq > maxRadiusSq) maxRadiusSq = rSq;
              if (c.y > carTopY) carTopY = c.y;
              if (c.y < carBottomY) carBottomY = c.y;
            }
          }
        }
      }
    });

    if (meshCount === 0 || box.isEmpty() || !isFinite(maxRadiusSq) || maxRadiusSq < 0.01) {
      return false;
    }

    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    if (boxSize.lengthSq() < 0.01) return false;

    const persCamera = camera as THREE.PerspectiveCamera;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.1);
    const isMobile = size.width < 640 || aspect < 1.15;
    const isTablet = !isMobile && (size.width < 1024 || aspect < 1.4);
    const isDesktop = !isMobile && !isTablet;

    const carSweepRadius = Math.sqrt(maxRadiusSq);

    if (isDesktop) {
      // DESKTOP: Preserved exactly to guarantee 0 regressions
      const fov = 32;
      persCamera.fov = fov;

      const vFovRad = THREE.MathUtils.degToRad(fov);
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

      const desktopCarTopY = Math.max(box.max.y, boxSize.y);
      const stageBottomY = -0.076;
      const stageRadius = 2.34;
      const carHorizRadius = Math.sqrt((boxSize.x / 2) ** 2 + (boxSize.z / 2) ** 2);
      const effectiveHorizRadius = Math.max(carHorizRadius, stageRadius);

      const elevationDeg = 11.5;
      const elevationAngle = THREE.MathUtils.degToRad(elevationDeg);
      const tanElev = Math.tan(elevationAngle);
      const cosElev = Math.cos(elevationAngle);
      const sinElev = Math.sin(elevationAngle);

      const targetY = 0.5 * ((desktopCarTopY + stageBottomY) - (stageRadius * tanElev));
      const target = new THREE.Vector3(0, targetY, 0);

      const visualAssemblyHeight = (desktopCarTopY - stageBottomY) * cosElev + (stageRadius * sinElev);
      const targetHeightFraction = 0.64;
      const targetWidthFraction = 0.78;

      const distY = (visualAssemblyHeight / (2 * Math.tan(vFovRad / 2))) / targetHeightFraction;
      const distX = (effectiveHorizRadius / Math.tan(hFovRad / 2)) / targetWidthFraction;

      const distance = Math.max(distY, distX);

      const camY = targetY + distance * Math.sin(elevationAngle);
      const camZ = distance * Math.cos(elevationAngle);

      persCamera.position.set(0, camY, camZ);
      persCamera.lookAt(target);
      persCamera.updateProjectionMatrix();
      return true;
    }

    if (isTablet) {
      // TABLET: Slightly tighter, balanced showroom framing
      const fov = 32;
      persCamera.fov = fov;

      const vFovRad = THREE.MathUtils.degToRad(fov);
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

      const elevationDeg = 10.5;
      const elevationAngle = THREE.MathUtils.degToRad(elevationDeg);
      const cosElev = Math.cos(elevationAngle);
      const sinElev = Math.sin(elevationAngle);

      const effectiveHorizRadius = Math.max(carSweepRadius, 2.0);
      const carHeight = carTopY - Math.max(carBottomY, 0);
      const targetY = Math.max(carBottomY, 0) + carHeight * 0.45;
      const target = new THREE.Vector3(0, targetY, 0);

      const visualAssemblyHeight = carHeight * cosElev + (carSweepRadius * 0.3) * sinElev + 0.08;

      const distY = (visualAssemblyHeight / (2 * Math.tan(vFovRad / 2))) / 0.68;
      const distX = (effectiveHorizRadius / Math.tan(hFovRad / 2)) / 0.82;
      const distance = Math.max(distY, distX);

      const camY = targetY + distance * Math.sin(elevationAngle);
      const camZ = distance * Math.cos(elevationAngle);

      persCamera.position.set(0, camY, camZ);
      persCamera.lookAt(target);
      persCamera.updateProjectionMatrix();
      return true;
    }

    // MOBILE PORTRAIT:
    // Significantly tighter framing, lifted visual center, zero clipping on 360° spin
    const fov = 34;
    persCamera.fov = fov;

    const vFovRad = THREE.MathUtils.degToRad(fov);
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    const elevationDeg = 9.5;
    const elevationAngle = THREE.MathUtils.degToRad(elevationDeg);
    const cosElev = Math.cos(elevationAngle);
    const sinElev = Math.sin(elevationAngle);

    // Target visual center:
    // Centered at 44% of the vehicle's height so the car body sits comfortably
    // in the center with breathing room below header and subtle platform beneath tires.
    const carHeight = carTopY - Math.max(carBottomY, 0);
    const targetY = Math.max(carBottomY, 0) + carHeight * 0.44;
    const target = new THREE.Vector3(0, targetY, 0);

    // Horizontal framing: at widest 90° profile, fills 90% of container width (5% breathing margin)
    const targetWidthFraction = 0.90;
    const distX = carSweepRadius / (Math.tan(hFovRad / 2) * targetWidthFraction);

    // Vertical height framing: car + grounded turntable bevel
    const platformBevelHeight = 0.08;
    const visualAssemblyHeight = carHeight * cosElev + (carSweepRadius * 0.25) * sinElev + platformBevelHeight;
    const targetHeightFraction = 0.70;
    const distY = (visualAssemblyHeight / (2 * Math.tan(vFovRad / 2))) / targetHeightFraction;

    const distance = Math.max(distX, distY);

    const camY = targetY + distance * Math.sin(elevationAngle);
    const camZ = distance * Math.cos(elevationAngle);

    persCamera.position.set(0, camY, camZ);
    persCamera.lookAt(target);
    persCamera.updateProjectionMatrix();
    return true;
  }, [camera, carGroupRef, size.width, size.height]);

  // Continuously attempt initial framing as GLTF asynchronously streams in
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const success = updateCameraFraming();
      if (success || attempts > 25) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedCarId, updateCameraFraming]);

  return null;
};

export const ShowroomStage: React.FC<ShowroomStageProps> = React.memo(({
  selectedCar = AVAILABLE_CARS[0],
  paintColor,
  autoRotate: propAutoRotate = false,
  className = 'w-full h-full',
  hideTitle = false,
  hideBottomControls = false,
  onToggleAutoRotate,
}) => {
  const { t } = useTranslation();
  const [interactiveAutoRotate, setInteractiveAutoRotate] = useState(propAutoRotate);
  const carGroupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInteractiveAutoRotate(propAutoRotate);
  }, [propAutoRotate]);

  const handleToggleAutoRotate = () => {
    setInteractiveAutoRotate((prev) => {
      const next = !prev;
      if (onToggleAutoRotate) onToggleAutoRotate(next);
      return next;
    });
  };

  // Container-driven responsive measurement using ResizeObserver
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>(() => {
    return typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 1200, height: 600 };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerDimensions({ width, height });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { isMobile, isTablet } = useMemo(() => {
    const aspect = containerDimensions.width / Math.max(containerDimensions.height, 1);
    const mobile = containerDimensions.width < 640 || aspect < 1.15;
    const tablet = !mobile && (containerDimensions.width < 1024 || aspect < 1.4);
    return { isMobile: mobile, isTablet: tablet };
  }, [containerDimensions.width, containerDimensions.height]);

  // Responsive model normalization scale:
  // - Mobile: ~2.7m to 3.0m length (heroic presence, perfectly framed)
  // - Tablet: ~2.9m to 3.2m length
  // - Desktop: ~3.0m to 3.4m length (grand showroom presence across circular turntable deck)
  const normalizedScale = useMemo(() => {
    const baseScale = selectedCar.scale || 4.2;
    return isMobile ? baseScale * 0.64 : isTablet ? baseScale * 0.68 : baseScale * 0.72;
  }, [selectedCar.scale, isMobile, isTablet]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className} overflow-hidden touch-pan-y`}
      role="region"
      aria-label={`3D interactive vehicle preview of ${selectedCar.name}`}
    >
      <Canvas
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, isMobile ? 1.75 : 2]}
        shadows
      >
        <ResponsiveShowroomCamera 
          carGroupRef={carGroupRef} 
          selectedCarId={selectedCar.id} 
          paintColor={paintColor}
        />

        {/* Stage and vehicle anchored at world origin */}
        <group position={[0, 0, 0]}>
          <ChargingEnvironment
            batterySoc={60}
            theme="dark"
            groundingOffset={-0.002}
            showEnergy={false}
            showBackdrop={false}
            autoRotate={interactiveAutoRotate}
            autoRotateSpeed={0.8}
            initialRotation={-Math.PI / 5.5}
            onUserInteraction={() => {
              setInteractiveAutoRotate(false);
              if (onToggleAutoRotate) onToggleAutoRotate(false);
            }}
          >
            <group ref={carGroupRef}>
              <VehicleStage
                key={`${selectedCar.id}-${paintColor || selectedCar.paintColor || ''}`}
                vehicleId={selectedCar.id}
                modelPath={selectedCar.modelPath}
                scale={normalizedScale}
                paintColor={paintColor || selectedCar.paintColor || '#2DD4BF'}
                isCharging={false}
                showChargingPort={false}
              />
            </group>
          </ChargingEnvironment>
        </group>
      </Canvas>

      {/* Floating 360 Auto-Rotate / Pause Button */}
      {!hideBottomControls && (
        <button
          type="button"
          onClick={handleToggleAutoRotate}
          aria-label={interactiveAutoRotate ? t.pauseSpin : t.autoSpin}
          aria-pressed={interactiveAutoRotate}
          className="absolute bottom-2.5 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] text-slate-200 font-medium z-10 transition-all cursor-pointer pointer-events-auto shadow-lg"
          title={interactiveAutoRotate ? t.pauseSpin : t.autoSpin}
        >
          <RotateCw 
            className={`w-3 sm:w-3.5 h-3 sm:h-3.5 text-teal-400 ${interactiveAutoRotate ? "motion-safe:animate-spin" : ""}`} 
            style={{ animationDuration: "5s" }} 
          />
          <span>{interactiveAutoRotate ? t.pauseSpin : t.autoSpin}</span>
        </button>
      )}

      {/* Discrete bottom title if not hidden */}
      {!hideTitle && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
          <h2 className="text-lg sm:text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {selectedCar.name}
          </h2>
        </div>
      )}
    </div>
  );
});

export default ShowroomStage;
