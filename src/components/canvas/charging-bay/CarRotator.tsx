import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CarRotatorProps {
  children: React.ReactNode;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: number;
  targetRotation?: number;
  onRotationChange?: (angle: number) => void;
  onUserInteraction?: () => void;
}

/**
 * Ultra-Smooth CarRotator with Direct Pointer & Touch Finger Tracking
 * - Direct Canvas Binding: Attaches directly to the WebGL canvas via gl.domElement with touch-action: none.
 * - Universal Input: Supports mouse drag, single-finger touch swipe, and pointer capture.
 * - Gesture Prevention: Calls preventDefault() on touchmove to stop mobile browser page swipe/scroll conflicts.
 * - Sub-Pixel Critically Damped Smoothing: THREE.MathUtils.damp removes discrete micro-stutters and input quantization.
 * - Immediate Stop on Touch: Zeroes inertia immediately upon contact for 1:1 responsive tactile control.
 * - Natural Momentum Glide: Rolling filtered velocity calculation produces a silky deceleration glide upon release.
 * - Shortest-Path Easing: Seamlessly transitions to target angle when preset camera buttons are clicked.
 */
export const CarRotator: React.FC<CarRotatorProps> = ({
  children,
  autoRotate = false,
  autoRotateSpeed = 0.6,
  initialRotation = 0,
  targetRotation,
  onRotationChange,
  onUserInteraction,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  
  // Physical simulation refs
  const currentRotY = useRef(initialRotation);
  const targetRotY = useRef(initialRotation);
  const velocity = useRef(0);
  
  // Drag state
  const isDragging = useRef(false);
  const lastClientX = useRef(0);
  const lastClientY = useRef(0);
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
    const canvas = gl.domElement;
    if (!canvas) return;

    // Allow vertical scrolling while keeping horizontal rotation responsive
    canvas.style.touchAction = 'pan-y';
    canvas.style.userSelect = 'none';
    (canvas.style as any).webkitUserSelect = 'none';

    // 1. Pointer Down (Mouse & Stylus & Touch)
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isDragging.current = true;
      activePointerId.current = e.pointerId;
      lastClientX.current = e.clientX;
      lastTimestamp.current = performance.now();
      
      // Stop all momentum instantly so car is locked to finger
      velocity.current = 0;
      targetRotY.current = currentRotY.current;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if browser doesn't support pointer capture
      }

      if (onUserInteraction) {
        onUserInteraction();
      }
    };

    // 2. Pointer Move: High-resolution angular update with rolling velocity
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

        // Rolling velocity estimation in rad/sec
        const instVelocity = (rotDelta / dt) * 1000;
        velocity.current = velocity.current * 0.5 + instVelocity * 0.5;
      }
    };

    // 3. Pointer Up & Release
    const handlePointerUp = (e: PointerEvent) => {
      if (activePointerId.current !== null && e.pointerId === activePointerId.current) {
        isDragging.current = false;
        activePointerId.current = null;

        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {}

        // If finger remained stationary for > 70ms before lifting, deliberate stop
        if (performance.now() - lastTimestamp.current > 70) {
          velocity.current = 0;
        } else {
          // Clamp flick velocity to comfortable cinematic max
          velocity.current = THREE.MathUtils.clamp(velocity.current, -6.5, 6.5);
        }
      }
    };

    // 4. Native Touch Event Fallbacks (Smoothly coordinates horizontal car rotation and vertical page scrolling)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        const touch = e.touches[0];
        lastClientX.current = touch.clientX;
        lastClientY.current = touch.clientY;
        lastTimestamp.current = performance.now();
        velocity.current = 0;
        targetRotY.current = currentRotY.current;

        if (onUserInteraction) {
          onUserInteraction();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length === 0) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastClientX.current;
      const deltaY = touch.clientY - lastClientY.current;

      // Allow vertical page scroll if vertical motion dominates
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 5) {
        isDragging.current = false;
        return;
      }

      if (e.cancelable) {
        e.preventDefault(); // Stop mobile browser back/forward navigation gestures on horizontal drag
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastTimestamp.current);
      lastClientX.current = touch.clientX;
      lastClientY.current = touch.clientY;
      lastTimestamp.current = now;

      if (deltaX !== 0) {
        const rotDelta = deltaX * 0.0075;
        targetRotY.current += rotDelta;
        const instVelocity = (rotDelta / dt) * 1000;
        velocity.current = velocity.current * 0.5 + instVelocity * 0.5;
      }
    };

    const handleTouchEnd = () => {
      if (isDragging.current) {
        isDragging.current = false;
        if (performance.now() - lastTimestamp.current > 70) {
          velocity.current = 0;
        } else {
          velocity.current = THREE.MathUtils.clamp(velocity.current, -6.5, 6.5);
        }
      }
    };

    // Attach to canvas directly for highest priority and exact element binding
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('lostpointercapture', handlePointerUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Window-level safety listeners in case mouse drag leaves the canvas boundary
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('lostpointercapture', handlePointerUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, onUserInteraction]);

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
    // Lambda 30 during drag provides instantaneous tactile tracking; lambda 16 gives cinematic smoothness
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
