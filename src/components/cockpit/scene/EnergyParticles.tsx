import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyParticlesProps {
  intensity: number;
  status: string;
  count?: number;
}

export const EnergyParticles: React.FC<EnergyParticlesProps> = ({
  intensity,
  status,
  count = 120,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const isCharging = status === 'charging';
  const isStarting = status === 'starting';

  // Initialize random distribution across the inductive pad transfer window
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 1.7, // pad width span
        y: 0.04 + Math.random() * 0.34,  // vertical span between pad and car undercarriage
        z: (Math.random() - 0.5) * 2.8, // pad length span
        speed: 0.16 + Math.random() * 0.16, // 16 - 32 cm/s
        seed: Math.random() * 100,
        scale: 0.7 + Math.random() * 0.6,
      });
    }
    return data;
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      if (isCharging || isStarting) {
        const speedFactor = isStarting ? 0.6 : 1.0;
        // Continuous upward drift from pad into vehicle undercarriage
        p.y += delta * p.speed * intensity * speedFactor;

        // Reset to pad surface when entering chassis
        if (p.y > 0.40) {
          p.y = 0.04;
          p.x = (Math.random() - 0.5) * 1.7;
          p.z = (Math.random() - 0.5) * 2.8;
        }
      }

      // Organic subtle lateral curl
      const currentX = p.x + Math.sin(t * 1.8 + p.seed) * 0.025;
      const currentZ = p.z + Math.cos(t * 1.8 + p.seed) * 0.025;

      // Soft life envelope: smooth fade-in from pad, bright mid-transfer, dissolve at undercarriage
      const life = Math.min(1.0, Math.max(0.0, (p.y - 0.04) / 0.36));
      const scaleFade = Math.sin(life * Math.PI) * p.scale * Math.max(0.05, intensity);

      dummy.position.set(currentX, p.y, currentZ);
      dummy.scale.setScalar(scaleFade * 0.022);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (status === 'idle' || status === 'complete' || intensity <= 0.02) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#00FF9D"
        transparent
        opacity={isCharging ? 0.85 * intensity : 0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default EnergyParticles;
