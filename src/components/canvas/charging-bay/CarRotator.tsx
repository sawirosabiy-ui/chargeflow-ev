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
  const lastClientX = useRef(0);
  const activePointerId = useRef<number | null>(null);

  // Sync target rotation from props (e.g. angle preset buttons) ONLY if not currently dragging
  useEffect(() => {
    if (targetRotation !== undefined && !isDragging.current) {
      currentRotY.current = targetRotation;
      velocity.current = 0;
    }
  }, [targetRotation]);

  useEffect(() => {
    // 1. Pointer Down: Immediately cancel all momentum, auto-rotation, and take direct finger control
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow drag on canvas or on 3D container
      if (target && (target.tagName.toLowerCase() === 'canvas' || target.closest('canvas'))) {
        isDragging.current = true;
        activePointerId.current = e.pointerId;
        lastClientX.current = e.clientX;
        velocity.current = 0; // Cancel any inertia instantly
      }
    };

    // 2. Pointer Move: Immediately apply pointer delta to rotation. NO animation lock, NO delay.
    // Instant response to dragging left, right, left, right in real time.
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;

      const deltaX = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;

      if (deltaX !== 0) {
        // Direct angular control: 1px = ~0.009 radians
        const rotDelta = deltaX * 0.009;
        currentRotY.current += rotDelta;
        velocity.current = rotDelta; // Track instantaneous velocity for subtle release inertia

        if (groupRef.current) {
          groupRef.current.rotation.y = currentRotY.current;
        }

        if (onRotationChange) {
          onRotationChange(currentRotY.current);
        }
      }
    };

    // 3. Pointer Up & Cancel: Release drag and enter gentle decay inertia
    const handlePointerUp = (e: PointerEvent) => {
      if (activePointerId.current !== null && e.pointerId === activePointerId.current) {
        isDragging.current = false;
        activePointerId.current = null;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [onRotationChange]);

  // Frame tick: Handles auto-rotate and short inertia decay ONLY when user is NOT touching the screen
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isDragging.current) {
      // While dragging, group rotation is strictly locked to currentRotY
      groupRef.current.rotation.y = currentRotY.current;
      return;
    }

    if (autoRotate) {
      currentRotY.current += autoRotateSpeed * delta;
      if (onRotationChange) onRotationChange(currentRotY.current);
    } else if (Math.abs(velocity.current) > 0.0001) {
      // Very short, physically responsive inertia that stops instantly on next touch
      currentRotY.current += velocity.current;
      velocity.current *= 0.88; // Quick decay so it never runs away
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

export default CarRotator;
