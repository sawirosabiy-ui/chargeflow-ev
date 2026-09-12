import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three-stdlib';
import { ProceduralEVCar } from './ProceduralEVCar';

// ---------------------------------------------------------------------------
// 1. Explicit Local DRACOLoader Setup
// ---------------------------------------------------------------------------

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

// Preload standard vehicle models
try {
  useLoader.preload(GLTFLoader, '/models/byd-atto-3.glb', (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });
  useLoader.preload(GLTFLoader, '/models/byd-seagull.glb', (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });
} catch (e) {
  // Preload gracefully handles errors
}

import { getVehicleConfig } from '../../data/vehicleConfigs';
import { VirtualChargingPort } from './VirtualChargingPort';

export interface Vehicle3DModelProps {
  modelPath: string;
  scale?: number;
  paintColor?: string;
  autoRotate?: boolean;
  isCharging?: boolean;
  rotation?: [number, number, number];
  portAnchorRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
  showDebug?: boolean;
}

// ---------------------------------------------------------------------------
// 2. GLTF Vehicle Mesh Component
// ---------------------------------------------------------------------------

interface GLTFVehicleMeshProps {
  modelPath: string;
  scale?: number;
  paintColor?: string;
  isCharging?: boolean;
  portAnchorRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
  showDebug?: boolean;
}

const GLTFVehicleMesh: React.FC<GLTFVehicleMeshProps> = ({
  modelPath,
  scale = 4.2,
  paintColor = '#0284c7',
  isCharging = true,
  portAnchorRef,
  showDebug = false,
}) => {
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  const vehicleConfig = useMemo(() => {
    return getVehicleConfig(modelPath);
  }, [modelPath]);

  const processedScene = useMemo(() => {
    if (!gltf?.scene) return null;

    const clone = gltf.scene.clone(true);
    clone.updateMatrixWorld(true);

    // 1. Calculate raw Bounding Box & Center
    const rawBox = new THREE.Box3().setFromObject(clone);
    const rawSize = new THREE.Vector3();
    const rawCenter = new THREE.Vector3();
    rawBox.getSize(rawSize);
    rawBox.getCenter(rawCenter);

    // Center the model locally
    clone.position.sub(rawCenter);
    clone.updateMatrixWorld(true);

    // Auto-align orientation if car length is along X axis
    if (rawSize.x > rawSize.z * 1.25) {
      clone.rotation.y = Math.PI / 2;
      clone.updateMatrixWorld(true);
    }

    // Dynamic auto-scaling to target length
    const alignedBox = new THREE.Box3().setFromObject(clone);
    const alignedSize = new THREE.Vector3();
    alignedBox.getSize(alignedSize);

    const maxDimension = Math.max(alignedSize.x, alignedSize.z);
    const targetLength = scale || vehicleConfig.defaultScale || 4.2;
    const scaleFactor =
      maxDimension > 0.001 && !isNaN(maxDimension) && isFinite(maxDimension)
        ? targetLength / maxDimension
        : 1.0;

    clone.scale.setScalar(scaleFactor);
    clone.updateMatrixWorld(true);

    // Ground vehicle bottom precisely at Y = 0
    const finalBox = new THREE.Box3().setFromObject(clone);
    if (!isNaN(finalBox.min.y) && isFinite(finalBox.min.y)) {
      clone.position.y -= finalBox.min.y;
      clone.updateMatrixWorld(true);
    }

    // Restore realistic PBR materials and glossy car paint
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.visible = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.set(0);

        const nameLower = (mesh.name || '').toLowerCase();
        const matNameLower = (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name || '').toLowerCase();

        const isGlass = nameLower.includes('glass') || nameLower.includes('window') || matNameLower.includes('glass') || matNameLower.includes('window') || nameLower.includes('defogger');
        const isLight = nameLower.includes('light') || nameLower.includes('lamp') || matNameLower.includes('light');
        const isTire = nameLower.includes('tire') || nameLower.includes('wheel') || nameLower.includes('rubber') || nameLower.includes('tyre') || matNameLower.includes('tire') || matNameLower.includes('rubber');
        const isChrome = nameLower.includes('chrome') || nameLower.includes('badge') || nameLower.includes('crme') || nameLower.includes('crome') || nameLower.includes('metal_badges');
        const isCaliper = nameLower.includes('caliper') || nameLower.includes('break');

        if (isGlass) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#0A111E'),
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.88,
            transparent: true,
            opacity: 0.85,
            ior: 1.5,
          });
        } else if (isLight) {
          const isTail = nameLower.includes('rear') || nameLower.includes('tail') || nameLower.includes('tl_') || matNameLower.includes('tail') || matNameLower.includes('rear');
          mesh.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(isTail ? '#EF4444' : '#A5F3FC'),
          });
        } else if (isTire) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#111827'),
            roughness: 0.85,
            metalness: 0.1,
          });
        } else if (isChrome) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#E2E8F0'),
            metalness: 0.95,
            roughness: 0.08,
            envMapIntensity: 2.0,
          });
        } else if (isCaliper) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#38BDF8'),
            metalness: 0.8,
            roughness: 0.3,
          });
        } else {
          // Glossy PBR Automotive Paint
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).map) {
            const m = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
            m.envMapIntensity = 1.6;
            m.roughness = Math.min(m.roughness, 0.25);
            m.metalness = Math.max(m.metalness, 0.55);
            m.needsUpdate = true;
          } else {
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(paintColor),
              metalness: 0.75,
              roughness: 0.18,
              clearcoat: 1.0,
              clearcoatRoughness: 0.06,
              envMapIntensity: 1.8,
            });
          }
        }
      }
    });

    // 2. Native Port Detection
    let detectedNativePort: { position: { x: number; y: number; z: number }; rotation?: { x?: number; y?: number; z?: number } } | null = null;

    clone.traverse((child) => {
      const name = (child.name || '').toLowerCase();
      if (
        name.includes('charge_port') ||
        name.includes('charging_port') ||
        name.includes('port_charge') ||
        name.includes('charging_socket') ||
        name.includes('charge_socket') ||
        name.includes('chargeport') ||
        name.includes('chargingport')
      ) {
        const localPos = child.position.clone();
        detectedNativePort = {
          position: { x: localPos.x, y: localPos.y, z: localPos.z },
          rotation: { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z }
        };
      }
    });

    return { scene: clone, nativePort: detectedNativePort };
  }, [gltf, scale, modelPath, paintColor, vehicleConfig]) as {
    scene: THREE.Group;
    nativePort: { position: { x: number; y: number; z: number }; rotation?: { x?: number; y?: number; z?: number } } | null;
  } | null;

  if (!processedScene?.scene) {
    return <ProceduralEVCar paintColor={paintColor} isCharging={isCharging} portAnchorRef={portAnchorRef} />;
  }

  const nativePort = processedScene.nativePort;
  const effectivePortConfig = nativePort
    ? {
        ...vehicleConfig.chargingPort,
        position: nativePort.position,
        rotation: nativePort.rotation || vehicleConfig.chargingPort.rotation,
      }
    : vehicleConfig.chargingPort;

  return (
    <group>
      {/* Centered Grounded 3D Vehicle Model */}
      <primitive object={processedScene.scene} position={[0, 0, 0]} />

      {/* Universal Virtual Charging Port Parented to Vehicle Group */}
      <VirtualChargingPort
        ref={portAnchorRef}
        config={effectivePortConfig}
        paintColor={paintColor}
        isCharging={isCharging}
        showDebug={showDebug}
      />
    </group>
  );
};

// ---------------------------------------------------------------------------
// 3. Error Boundary for GLTF Rendering
// ---------------------------------------------------------------------------

class GLTFErrorBoundary extends React.Component<
  { modelPath: string; paintColor: string; isCharging: boolean; portAnchorRef?: any; showDebug?: boolean; children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Vehicle GLB failed to load or decode:', this.props.modelPath, error);
  }

  render() {
    if (this.state.hasError) {
      return <ProceduralEVCar paintColor={this.props.paintColor} isCharging={this.props.isCharging} portAnchorRef={this.props.portAnchorRef} />;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// 4. Main Exported 3D Vehicle Component
// ---------------------------------------------------------------------------

export const Vehicle3DModel: React.FC<Vehicle3DModelProps> = ({
  modelPath,
  scale = 4.2,
  paintColor = '#0284c7',
  isCharging = true,
  portAnchorRef,
  showDebug = false,
}) => {
  return (
    <GLTFErrorBoundary
      key={modelPath}
      modelPath={modelPath}
      paintColor={paintColor}
      isCharging={isCharging}
      portAnchorRef={portAnchorRef}
      showDebug={showDebug}
    >
      <Suspense fallback={<ProceduralEVCar paintColor={paintColor} isCharging={isCharging} portAnchorRef={portAnchorRef} />}>
        <GLTFVehicleMesh
          key={modelPath}
          modelPath={modelPath}
          scale={scale}
          paintColor={paintColor}
          isCharging={isCharging}
          portAnchorRef={portAnchorRef}
          showDebug={showDebug}
        />
      </Suspense>
    </GLTFErrorBoundary>
  );
};

export default Vehicle3DModel;


