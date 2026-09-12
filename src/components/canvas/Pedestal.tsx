import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Pedestal: React.FC = () => {
  // Generate soft radial glow texture for seamless floor blending
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      gradient.addColorStop(0.3, 'rgba(16, 185, 129, 0.15)');
      gradient.addColorStop(0.65, 'rgba(45, 212, 191, 0.05)');
      gradient.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Seamless Base Obsidian Floor (Matches #0B0F17 exactly) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow={false}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0B0F17" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Seamless Soft Radial Ambient Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Emerald Glowing Inner Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.0, 2.03, 96]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.7} />
      </mesh>

      {/* Secondary Cyan Outer Accent Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.18, 2.195, 96]} />
        <meshBasicMaterial color="#2DD4BF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
