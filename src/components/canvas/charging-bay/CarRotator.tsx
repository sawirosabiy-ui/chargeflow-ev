import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CarRotatorProps {
  children: React.ReactNode;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: number;
  targetRotation?: number;
  onRotationChange?: (angle: number) => void;
}

export const CarRotator: React.FC<CarRotatorProps> = ({
  children,
  autoRotate = false,
  autoRotateSpeed = 0.6,
  initialRotation = 0,
  targetRotation,
  onRotationChange,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentRotY = useRef(initialRotation);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  // Sync target rotation from props if supplied (e.g. angle preset buttons)
  useEffect(() => {
    if (targetRotation !== undefined && !isDragging.current) {
      currentRotY.current = targetRotation;
      velocity.current = 0;
    }
  }, [targetRotation]);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Check if target is inside canvas
      const target = e.target as HTMLElement | null;
      if (target && target.tagName.toLowerCase() === 'canvas') {
        isDragging.current = true;
        lastX.current = e.clientX;
        velocity.current = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      const rotDelta = deltaX * 0.008;
      currentRotY.current += rotDelta;
      velocity.current = rotDelta;
      if (onRotationChange) {
        onRotationChange(currentRotY.current);
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [onRotationChange]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (autoRotate && !isDragging.current) {
      currentRotY.current += autoRotateSpeed * delta;
      if (onRotationChange) onRotationChange(currentRotY.current);
    } else if (!isDragging.current && Math.abs(velocity.current) > 0.0001) {
      // Smooth physical momentum decay
      currentRotY.current += velocity.current;
      velocity.current *= 0.92;
      if (onRotationChange) onRotationChange(currentRotY.current);
    }

    groupRef.current.rotation.y = currentRotY.current;
  });

  return (
    <group ref={groupRef} name="CarRotatorGroup">
      {children}
    </group>
  );
};
