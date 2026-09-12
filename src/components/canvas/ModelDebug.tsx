import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function CarModel() {
  const gltf = useGLTF('/models/byd-seagull.glb');

  useEffect(() => {
    if (!gltf?.scene) return;

    // Phase 5: Normalization on the loaded scene
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);

    // 1. Calculate Box3 and center
    const initialBox = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    initialBox.getCenter(center);
    initialBox.getSize(size);

    // 2. Subtract center from model position
    scene.position.sub(center);
    scene.updateMatrixWorld(true);

    // 3. Calculate max dimension and scale to ~3 units
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 3 / maxDim : 1;
    scene.scale.setScalar(targetScale);
    scene.updateMatrixWorld(true);

    // 4. Move bottom to touch Y = 0
    const finalBox = new THREE.Box3().setFromObject(scene);
    scene.position.y -= finalBox.min.y;
    scene.updateMatrixWorld(true);

    // 5. Count meshes
    let meshCount = 0;
    scene.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) meshCount++;
    });

    console.log('MODEL LOADED', gltf);
    console.log('mesh count:', meshCount);
    console.log('bounding box size:', size);
    console.log('bounding box center:', center);
    console.log('final scale:', targetScale);
    console.log('final position:', scene.position);
  }, [gltf]);

  return <primitive object={gltf.scene} />;
}

export const ModelDebug: React.FC = () => {
  return (
    <div className="relative w-full h-[550px] bg-[#111827] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-teal-400 font-mono text-sm">
            Loading 3D vehicle (/models/byd-seagull.glb)...
          </div>
        }
      >
        <Canvas
          camera={{ position: [4, 2.5, 4], fov: 45 }}
          style={{ width: '100%', height: '550px', background: '#0F172A' }}
        >
          {/* Lights */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 15, 10]} intensity={2.0} />
          <directionalLight position={[-10, 10, -10]} intensity={1.0} />

          {/* Orbit Controls */}
          <OrbitControls makeDefault />

          {/* Phase 1 Primitives */}
          <gridHelper args={[20, 20, '#2DD4BF', '#475569']} />
          <axesHelper args={[5]} />

          {/* Red Cube at [0, 1, 0] */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Green Sphere at [2, 1, 0] */}
          <mesh position={[2, 1, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#10B981" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Uncompressed BYD Seagull Model */}
          <CarModel />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ModelDebug;
