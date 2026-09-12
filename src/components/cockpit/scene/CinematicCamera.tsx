import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CinematicCameraProps {
  status: string;
  autoRotate: boolean;
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({ status, autoRotate }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const userInteractingRef = useRef(false);

  // Target presets according to spec
  const presets = useMemo(() => ({
    hero: {
      position: new THREE.Vector3(4.9, 2.15, 5.4),
      target: new THREE.Vector3(-0.15, 0.72, 0),
      fov: 34,
    },
    charging: {
      position: new THREE.Vector3(4.6, 2.0, 5.0),
      target: new THREE.Vector3(-0.15, 0.68, 0),
      fov: 36,
    },
    complete: {
      position: new THREE.Vector3(4.9, 2.15, 5.4),
      target: new THREE.Vector3(-0.15, 0.72, 0),
      fov: 34,
    }
  }), []);

  const currentPreset = useMemo(() => {
    if (status === 'charging' || status === 'starting') return presets.charging;
    if (status === 'complete') return presets.complete;
    return presets.hero;
  }, [status, presets]);

  // Set initial camera position on mount
  useEffect(() => {
    camera.position.copy(presets.hero.position);
    if (controlsRef.current) {
      controlsRef.current.target.copy(presets.hero.target);
      controlsRef.current.update();
    }
  }, [camera, presets]);

  useFrame(({ clock }, delta) => {
    if (userInteractingRef.current) return;

    const t = clock.getElapsedTime();
    const lerpSpeed = delta * 2.2;

    // Smooth position interpolation
    const desiredPos = currentPreset.position.clone();

    // Subtle breathing harmonic motion during active charging (~0.1 Hz, amp 0.015)
    if (status === 'charging') {
      desiredPos.x += Math.sin(t * 0.6) * 0.02;
      desiredPos.y += Math.cos(t * 0.5) * 0.015;
      desiredPos.z += Math.sin(t * 0.4) * 0.02;
    }

    camera.position.lerp(desiredPos, lerpSpeed);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(currentPreset.target, lerpSpeed);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={true}
      enableZoom={true}
      enablePan={false}
      minPolarAngle={Math.PI * 0.30}
      maxPolarAngle={Math.PI * 0.58}
      minDistance={4.0}
      maxDistance={9.0}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      enableDamping={true}
      dampingFactor={0.06}
      onStart={() => { userInteractingRef.current = true; }}
      onEnd={() => {
        // Resume smooth cinematic control after 4 seconds of inactivity
        setTimeout(() => { userInteractingRef.current = false; }, 4000);
      }}
    />
  );
};
