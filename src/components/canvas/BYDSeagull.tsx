import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BYDSeagull2D } from '../vehicle/BYDSeagull2D';

interface BYDSeagullProps {
  modelPath?: string;
  autoRotate?: boolean;
}

// Error Boundary for 3D Loading Fallback
class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const BYDSeagullModel: React.FC<BYDSeagullProps> = ({
  modelPath = '/models/byd-seagull.glb',
  autoRotate = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  const { bodyPaintMaterial, glassMaterial, trimMaterial } = useMemo(() => {
    const bodyPaint = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#84cc16'),
      metalness: 0.65,
      roughness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      envMapIntensity: 1.1,
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0f172a'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
      ior: 1.52,
      envMapIntensity: 1.5,
    });

    const trim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#090d14'),
      roughness: 0.85,
      metalness: 0.15,
      envMapIntensity: 0.4,
    });

    return { bodyPaintMaterial: bodyPaint, glassMaterial: glass, trimMaterial: trim };
  }, []);

  const processedScene = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.z);
    const targetLength = 3.65;
    const scaleFactor = maxDimension > 0 ? targetLength / maxDimension : 1.0;
    clone.scale.setScalar(scaleFactor);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        const nodeName = mesh.name.toLowerCase();
        const matName = (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name)?.toLowerCase() || '';

        // Assign materials based on mesh naming, with a fallback to body paint for any remaining meshes
        if (
          nodeName.includes('body') ||
          nodeName.includes('paint') ||
          nodeName.includes('car_body') ||
          matName.includes('body') ||
          matName.includes('paint') ||
          matName.includes('exterior')
        ) {
          mesh.material = bodyPaintMaterial;
        } else if (
          nodeName.includes('glass') ||
          nodeName.includes('window') ||
          nodeName.includes('windshield') ||
          matName.includes('glass') ||
          matName.includes('window')
        ) {
          mesh.material = glassMaterial;
        } else if (
          nodeName.includes('plastic') ||
          nodeName.includes('trim') ||
          nodeName.includes('diffuser') ||
          nodeName.includes('bumper_black') ||
          matName.includes('trim')
        ) {
          mesh.material = trimMaterial;
        } else {
          // Fallback: apply body paint material to any other mesh
          mesh.material = bodyPaintMaterial;
          const fallbackMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          fallbackMats.forEach((m) => {
            if ('envMapIntensity' in m) (m as THREE.MeshStandardMaterial).envMapIntensity = 0.8;
            if ('toneMapped' in m) m.toneMapped = true;
          });
        }
      }
    });

    return clone;
  }, [scene, bodyPaintMaterial, glassMaterial, trimMaterial]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={processedScene} />
      </Center>
    </group>
  );
};

export const BYDSeagull: React.FC<BYDSeagullProps> = (props) => {
  return (
    <ModelErrorBoundary fallback={<BYDSeagull2D />}>
      <BYDSeagullModel {...props} />
    </ModelErrorBoundary>
  );
};

useGLTF.preload('/models/byd-seagull.glb');
