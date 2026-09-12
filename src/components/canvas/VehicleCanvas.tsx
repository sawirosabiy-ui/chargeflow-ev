import React, { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BYDSeagull2D } from '../vehicle/BYDSeagull2D';
import { ChargingStationModel } from './ChargingStationModel';

export type VehicleModelKey =
  | 'byd_seagull'
  | 'byd-seagull'
  | 'tesla_model_y'
  | 'tesla-model-y'
  | 'byd_atto_3'
  | 'byd-atto-3'
  | 'byd_seal_u'
  | 'byd-seal-u'
  | 'byd_song_plus'
  | 'byd-song-plus'
  | 'byd_yangwang_u8'
  | 'byd-yangwang-u8'
  | 'byd_yangwang_u9'
  | 'byd-yangwang-u9'
  | 'byd_sealion_7'
  | 'byd-sealion-7';

// Map model keys to their public GLTF paths and physical scale constraints
export const VEHICLE_CONFIGS: Record<
  string,
  {
    id: string;
    name: string;
    path: string;
    targetLength: number;
    paintColor: string;
    batteryCapacityKwh: number;
    rangeKm: number;
    drivetrain: string;
  }
> = {
  byd_seagull: {
    id: 'byd-seagull',
    name: 'BYD Seagull',
    path: '/models/byd-seagull.glb',
    targetLength: 3.65,
    paintColor: '#84cc16',
    batteryCapacityKwh: 30.1,
    rangeKm: 305,
    drivetrain: 'FWD',
  },
  'byd-seagull': {
    id: 'byd-seagull',
    name: 'BYD Seagull',
    path: '/models/byd-seagull.glb',
    targetLength: 3.65,
    paintColor: '#84cc16',
    batteryCapacityKwh: 30.1,
    rangeKm: 305,
    drivetrain: 'FWD',
  },
  tesla_model_y: {
    id: 'tesla-model-y',
    name: 'Tesla Model Y',
    path: '/models/tesla-model-y.glb',
    targetLength: 4.45,
    paintColor: '#94a3b8',
    batteryCapacityKwh: 75.0,
    rangeKm: 533,
    drivetrain: 'AWD',
  },
  'tesla-model-y': {
    id: 'tesla-model-y',
    name: 'Tesla Model Y',
    path: '/models/tesla-model-y.glb',
    targetLength: 4.45,
    paintColor: '#94a3b8',
    batteryCapacityKwh: 75.0,
    rangeKm: 533,
    drivetrain: 'AWD',
  },
  byd_atto_3: {
    id: 'byd-atto-3',
    name: 'BYD Atto 3',
    path: '/models/byd-atto-3.glb',
    targetLength: 4.2,
    paintColor: '#0284c7',
    batteryCapacityKwh: 60.5,
    rangeKm: 420,
    drivetrain: 'FWD',
  },
  'byd-atto-3': {
    id: 'byd-atto-3',
    name: 'BYD Atto 3',
    path: '/models/byd-atto-3.glb',
    targetLength: 4.2,
    paintColor: '#0284c7',
    batteryCapacityKwh: 60.5,
    rangeKm: 420,
    drivetrain: 'FWD',
  },
  byd_seal_u: {
    id: 'byd-seal-u',
    name: 'BYD Seal U',
    path: '/models/byd-seal-u.glb',
    targetLength: 4.4,
    paintColor: '#10b981',
    batteryCapacityKwh: 71.8,
    rangeKm: 500,
    drivetrain: 'AWD',
  },
  'byd-seal-u': {
    id: 'byd-seal-u',
    name: 'BYD Seal U',
    path: '/models/byd-seal-u.glb',
    targetLength: 4.4,
    paintColor: '#10b981',
    batteryCapacityKwh: 71.8,
    rangeKm: 500,
    drivetrain: 'AWD',
  },
  byd_song_plus: {
    id: 'byd-song-plus',
    name: 'BYD Song Plus EV',
    path: '/models/byd-song-plus.glb',
    targetLength: 4.45,
    paintColor: '#6366f1',
    batteryCapacityKwh: 71.7,
    rangeKm: 505,
    drivetrain: 'FWD',
  },
  'byd-song-plus': {
    id: 'byd-song-plus',
    name: 'BYD Song Plus EV',
    path: '/models/byd-song-plus.glb',
    targetLength: 4.45,
    paintColor: '#6366f1',
    batteryCapacityKwh: 71.7,
    rangeKm: 505,
    drivetrain: 'FWD',
  },
  byd_yangwang_u8: {
    id: 'byd-yangwang-u8',
    name: 'BYD Yangwang U8',
    path: '/models/byd-yangwang-u8.glb',
    targetLength: 4.8,
    paintColor: '#d97706',
    batteryCapacityKwh: 49.0,
    rangeKm: 1000,
    drivetrain: '4WD',
  },
  'byd-yangwang-u8': {
    id: 'byd-yangwang-u8',
    name: 'BYD Yangwang U8',
    path: '/models/byd-yangwang-u8.glb',
    targetLength: 4.8,
    paintColor: '#d97706',
    batteryCapacityKwh: 49.0,
    rangeKm: 1000,
    drivetrain: '4WD',
  },
  byd_yangwang_u9: {
    id: 'byd-yangwang-u9',
    name: 'BYD Yangwang U9',
    path: '/models/byd-yangwang-u9.glb',
    targetLength: 4.6,
    paintColor: '#e11d48',
    batteryCapacityKwh: 80.0,
    rangeKm: 450,
    drivetrain: 'AWD',
  },
  'byd-yangwang-u9': {
    id: 'byd-yangwang-u9',
    name: 'BYD Yangwang U9',
    path: '/models/byd-yangwang-u9.glb',
    targetLength: 4.6,
    paintColor: '#e11d48',
    batteryCapacityKwh: 80.0,
    rangeKm: 450,
    drivetrain: 'AWD',
  },
  byd_sealion_7: {
    id: 'byd-sealion-7',
    name: 'BYD Sealion 7',
    path: '/models/byd-sealion-7.glb',
    targetLength: 4.55,
    paintColor: '#059669',
    batteryCapacityKwh: 82.5,
    rangeKm: 550,
    drivetrain: 'AWD',
  },
  'byd-sealion-7': {
    id: 'byd-sealion-7',
    name: 'BYD Sealion 7',
    path: '/models/byd-sealion-7.glb',
    targetLength: 4.55,
    paintColor: '#059669',
    batteryCapacityKwh: 82.5,
    rangeKm: 550,
    drivetrain: 'AWD',
  },
};

// Error boundary for 3D load fallback
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

// 1. Dynamic Model Loader & Automotive Material Processor
const DynamicCarMesh: React.FC<{ modelKey: VehicleModelKey; autoRotate?: boolean }> = ({
  modelKey,
  autoRotate = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const config = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.byd_seagull;
  const { scene } = useGLTF(config.path);

  const processedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Normalize model dimensions to natural physical scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxHorizontal = Math.max(size.x, size.z);
    const scaleFactor = maxHorizontal > 0 ? config.targetLength / maxHorizontal : 1.0;
    clone.scale.setScalar(scaleFactor);

    // Automotive physical shaders
    const bodyPaintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(config.paintColor),
      metalness: 0.7,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      envMapIntensity: 1.2,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0f172a'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
      ior: 1.52,
      envMapIntensity: 1.5,
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#090d14'),
      roughness: 0.85,
      metalness: 0.15,
      envMapIntensity: 0.5,
    });

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        const name = mesh.name.toLowerCase();
        const matName =
          (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name)?.toLowerCase() ||
          '';

        if (
          name.includes('body') ||
          name.includes('paint') ||
          name.includes('car_body') ||
          name.includes('exterior') ||
          matName.includes('body') ||
          matName.includes('paint') ||
          matName.includes('exterior')
        ) {
          mesh.material = bodyPaintMaterial;
        } else if (
          name.includes('glass') ||
          name.includes('window') ||
          name.includes('windshield') ||
          matName.includes('glass') ||
          matName.includes('window')
        ) {
          mesh.material = glassMaterial;
        } else if (
          name.includes('plastic') ||
          name.includes('trim') ||
          name.includes('diffuser') ||
          name.includes('bumper_black') ||
          matName.includes('trim')
        ) {
          mesh.material = trimMaterial;
        } else if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if ('envMapIntensity' in m) (m as THREE.MeshStandardMaterial).envMapIntensity = 0.8;
            if ('toneMapped' in m) m.toneMapped = true;
          });
        }
      }
    });

    return clone;
  }, [scene, config]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Center bottom position={[0, 0, 0]}>
        <primitive object={processedScene} />
      </Center>
    </group>
  );
};

// 2. Studio Glowing Ground Pedestal & Neon Ring
const StudioPedestal: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Seamless Base Floor (#0B0F17) */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0B0F17" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Radial Soft Ambient Glow */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.4, 64]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.08} />
      </mesh>

      {/* Primary Circular Neon Emerald Floor Ring (#10B981) */}
      <mesh ref={ringRef} position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.25, 2.29, 96]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer Cyan Subtle Accent Ring */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.42, 2.435, 96]} />
        <meshBasicMaterial color="#2DD4BF" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 3. Architectural Canopy & Ambient Fast Charger in Background
const BackgroundEnvironment: React.FC = () => {
  return (
    <group position={[-1.8, 0, -1.6]} rotation={[0, Math.PI / 5, 0]}>
      <ChargingStationModel position={[0, 0, 0]} rotation={[0, 0, 0]} isCharging={false} powerKw={120} soc={80} />
      
      {/* Overhead Canopy Structure Accent */}
      <mesh position={[0, 2.7, 0.3]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.8, 0.06, 2.0]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Canopy Under-glow Light Strip */}
      <mesh position={[0, 2.66, 0.3]}>
        <boxGeometry args={[1.4, 0.02, 0.08]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
    </group>
  );
};

// 4. Main Exported Canvas Component
interface VehicleCanvasProps {
  selectedModel: VehicleModelKey;
  autoRotate?: boolean;
  showBackgroundStation?: boolean;
  className?: string;
}

export const VehicleCanvas: React.FC<VehicleCanvasProps> = ({
  selectedModel = 'byd_seagull',
  autoRotate = false,
  showBackgroundStation = true,
  className = 'w-full h-full',
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className={`relative ${className} select-none cursor-grab active:cursor-grabbing`}>
      <Canvas
        camera={{ position: [3.4, 1.45, 3.5], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* Studio Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 8, 4]} intensity={0.85} />
        <pointLight position={[-4, 3, -2]} intensity={0.35} color="#10B981" />
        <pointLight position={[3, 2, -3]} intensity={0.25} color="#38BDF8" />

        {/* Orbit Controls: Smooth 360° Horizontal Rotation with Clamped Vertical Pitch */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          target={[0, 0.45, 0]}
        />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <StudioPedestal />
          {showBackgroundStation && <BackgroundEnvironment />}
          <ModelErrorBoundary fallback={<BYDSeagull2D />}>
            <DynamicCarMesh key={selectedModel} modelKey={selectedModel} autoRotate={autoRotate} />
          </ModelErrorBoundary>
          <ContactShadows
            position={[0, 0.002, 0]}
            resolution={256}
            frames={1}
            opacity={0.55}
            scale={7.0}
            blur={1.6}
            far={2.0}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload models
Object.values(VEHICLE_CONFIGS).forEach((cfg) => {
  try {
    useGLTF.preload(cfg.path);
  } catch (e) {
    // ignore
  }
});

