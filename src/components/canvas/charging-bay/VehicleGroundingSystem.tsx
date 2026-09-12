import React, { useRef, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';

interface VehicleGroundingSystemProps {
  children: React.ReactNode;
  /** Surface height of the charging pad / architectural floor (default 0.0) */
  surfaceY?: number;
  /** Tunable grounding offset (negative values embed tires slightly into floor for weight compression) */
  groundingOffset?: number;
  /** Center X position for the bay (default 0.0) */
  targetX?: number;
  /** Center Z position for the bay (default 0.0) */
  targetZ?: number;
  /** Optional callback receiving calculated metrics */
  onGrounded?: (metrics: {
    lowestPoint: number;
    height: number;
    width: number;
    length: number;
    isTireDetected: boolean;
  }) => void;
}

/**
 * Inspects vehicle geometry, isolates wheel/tire meshes if present,
 * and calculates the exact vertical offset to ensure all four tires
 * physically sit on the charging bay surface without floating or sinking.
 */
export function calculateVehicleGrounding(root: THREE.Object3D): {
  lowestPoint: number;
  center: THREE.Vector3;
  size: THREE.Vector3;
  isTireDetected: boolean;
} {
  root.updateMatrixWorld(true);
  const overallBox = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  overallBox.getSize(size);
  overallBox.getCenter(center);

  let lowestTireY = Infinity;
  let tireFound = false;

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const name = (mesh.name || '').toLowerCase();
      const matName = Array.isArray(mesh.material)
        ? (mesh.material[0]?.name || '').toLowerCase()
        : (mesh.material?.name || '').toLowerCase();

      const isWheelOrTire =
        name.includes('tire') ||
        name.includes('tyre') ||
        name.includes('wheel') ||
        name.includes('rim') ||
        matName.includes('tire') ||
        matName.includes('tyre') ||
        matName.includes('rubber');

      if (isWheelOrTire) {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        if (!isNaN(meshBox.min.y) && isFinite(meshBox.min.y)) {
          lowestTireY = Math.min(lowestTireY, meshBox.min.y);
          tireFound = true;
        }
      }
    }
  });

  const lowestPoint = tireFound && isFinite(lowestTireY) ? lowestTireY : overallBox.min.y;

  return {
    lowestPoint: isNaN(lowestPoint) || !isFinite(lowestPoint) ? 0 : lowestPoint,
    center,
    size,
    isTireDetected: tireFound,
  };
}

export const VehicleGroundingSystem: React.FC<VehicleGroundingSystemProps> = ({
  children,
  surfaceY = 0.0,
  groundingOffset = -0.002, // Subtle tire compression for physical weight realism
  targetX = 0.0,
  targetZ = 0.0,
  onGrounded,
}) => {
  const containerRef = useRef<THREE.Group>(null);
  const [groundingApplied, setGroundingApplied] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const metrics = calculateVehicleGrounding(containerRef.current);
    
    // Calculate delta needed so lowest point touches surfaceY exactly
    const currentLowest = metrics.lowestPoint;
    const deltaY = surfaceY - currentLowest + groundingOffset;

    if (!isNaN(deltaY) && isFinite(deltaY)) {
      containerRef.current.position.y += deltaY;
      containerRef.current.position.x += (targetX - metrics.center.x);
      containerRef.current.position.z += (targetZ - metrics.center.z);
      containerRef.current.updateMatrixWorld(true);
      setGroundingApplied(true);
    }

    if (onGrounded) {
      onGrounded({
        lowestPoint: metrics.lowestPoint,
        height: metrics.size.y,
        width: metrics.size.x,
        length: metrics.size.z,
        isTireDetected: metrics.isTireDetected,
      });
    }
  }, [surfaceY, groundingOffset, targetX, targetZ, onGrounded]);

  return (
    <group ref={containerRef} name="VehicleGroundingContainer">
      {children}
    </group>
  );
};
