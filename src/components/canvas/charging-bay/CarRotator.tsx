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

/**
 * Ultra-Smooth CarRotator with Critically Damped Sub-Pixel Interpolation
 * - Immediate interruptibility: touching immediately halts inertia and gives 1:1 control.
 * - Sub-pixel smoothing: uses delta-independent damping (THREE.MathUtils.damp) to remove
 *   mouse/touch discrete event stepping and micro-stutters.
 * - Natural release glide: tracks rolling pointer velocity and smoothly glides to a stop on flick.
 * - Shortest-path angle easing: clicking presets glides smoothly to the target angle.
 */
export const CarRotator: React.FC<CarRotatorProps> = ({
  children,
  autoRotate = false,
  autoRotateSpeed = 0.6,
  initialRotation = 0,
  targetRotation,
  onRotationChange,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Physical simulation refs
  const currentRotY = useRef(initialRotation);
  const targetRotY = useRef(initialRotation);
  const velocity = useRef(0);
  
  // Drag state
  const isDragging = useRef(false);
  const lastClientX = useRef(0);
  const lastTimestamp = useRef(0);
  const activePointerId = useRef<number | null>(null);

  // Sync target rotation from props (e.g. angle preset buttons) via shortest angular distance
  useEffect(() => {
    if (targetRotation !== undefined && !isDragging.current) {
      const twoPi = Math.PI * 2;
      let diff = (targetRotation - targetRotY.current) % twoPi;
      if (diff > Math.PI) diff -= twoPi;
      if (diff < -Math.PI) diff += twoPi;

      targetRotY.current += diff;
      velocity.current = 0;
    }
  }, [targetRotation]);

  useEffect(() => {
    // 1. Pointer Down: Immediately cancel all momentum, auto-rotation, and take direct control
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName.toLowerCase() === 'canvas' || target.closest('canvas'))) {
        isDragging.current = true;
        activePointerId.current = e.pointerId;
        lastClientX.current = e.clientX;
        lastTimestamp.current = performance.now();
        
        // Zero out velocity instantly so car stops dead on finger contact
        velocity.current = 0;
        
        // Align target to current to guarantee zero lurch or jump on touch
        targetRotY.current = currentRotY.current;
      }
    };

    // 2. Pointer Move: Instantaneous angular update with weighted rolling velocity estimation
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;

      const now = performance.now();
      const dt = Math.max(1, now - lastTimestamp.current);
      const deltaX = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;
      lastTimestamp.current = now;

      if (deltaX !== 0) {
        // High-precision angular sensitivity: 1px = ~0.0075 radians (~0.43 deg/px)
        const rotDelta = deltaX * 0.0075;
        targetRotY.current += rotDelta;

        // Filtered velocity estimation in rad/sec for natural, non-jittery flick physics
        const instVelocity = (rotDelta / dt) * 1000;
        velocity.current = velocity.current * 0.55 + instVelocity * 0.45;
      }
    };

    // 3. Pointer Up & Cancel: Release drag with momentum glide
    const handlePointerUp = (e: PointerEvent) => {
      if (activePointerId.current !== null && e.pointerId === activePointerId.current) {
        isDragging.current = false;
        activePointerId.current = null;

        // If the finger remained stationary for > 80ms before lifting, clear velocity (deliberate stop)
        if (performance.now() - lastTimestamp.current > 80) {
          velocity.current = 0;
        } else {
          // Clamp flick velocity to comfortable cinematic max
          velocity.current = THREE.MathUtils.clamp(velocity.current, -6.5, 6.5);
        }
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
  }, []);

  // Frame tick: 60fps/120fps delta-independent damping and physics
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Guard against frame rate hiccups (e.g. background tab return)
    const clampedDelta = Math.min(delta, 0.05);

    if (!isDragging.current) {
      if (autoRotate) {
        // Continuous, silky smooth auto-orbit
        targetRotY.current += autoRotateSpeed * clampedDelta;
      } else if (Math.abs(velocity.current) > 0.0005) {
        // Natural air friction deceleration
        targetRotY.current += velocity.current * clampedDelta;
        const friction = Math.pow(0.92, clampedDelta * 60);
        velocity.current *= friction;
        if (Math.abs(velocity.current) < 0.0005) {
          velocity.current = 0;
        }
      }
    }

    // Critically damped interpolation removes all sensor pixel noise while keeping latency < 16ms
    // Lambda 28 during drag provides instantaneous tactile tracking; lambda 16 gives cinematic smoothness
    const lambda = isDragging.current ? 30 : 16;
    currentRotY.current = THREE.MathUtils.damp(
      currentRotY.current,
      targetRotY.current,
      lambda,
      clampedDelta
    );

    groupRef.current.rotation.y = currentRotY.current;

    if (onRotationChange) {
      onRotationChange(currentRotY.current);
    }
  });

  return (
    <group ref={groupRef} name="CarRotatorGroup">
      {children}
    </group>
  );
};

export default CarRotator;
