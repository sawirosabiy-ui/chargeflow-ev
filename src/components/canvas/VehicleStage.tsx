import React, { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center, Text } from '@react-three/drei';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { CAR_PORT_OFFSETS, getVehicleConfig } from '../../data/vehicleConfigs';
import { ProceduralEVCar } from './ProceduralEVCar';
import { VirtualChargingPort } from './VirtualChargingPort';

// Configure Draco decoder path for useGLTF
useGLTF.setDecoderPath('/draco/');

interface VehicleStageProps {
  vehicleId?: string;
  modelPath?: string;
  scale?: number;
  paintColor?: string;
  autoRotate?: boolean;
  isCharging?: boolean;
  rotation?: [number, number, number];
  portAnchorRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
  showDebug?: boolean;
  showChargingPort?: boolean;
}

// ---------------------------------------------------------------------------
// 1. Dynamic Car Model Sub-Component using useGLTF
// ---------------------------------------------------------------------------

interface DynamicCarModelProps {
  vehicleKey: string;
  resolvedPath: string;
  scale?: number;
  paintColor?: string;
  isCharging?: boolean;
  portAnchorRef?: React.RefObject<THREE.Group | null> | React.RefObject<THREE.Group>;
  showDebug?: boolean;
  showChargingPort?: boolean;
}

const DynamicCarModel: React.FC<DynamicCarModelProps> = ({
  vehicleKey,
  resolvedPath,
  scale,
  paintColor = '#0284c7',
  isCharging = true,
  portAnchorRef,
  showDebug = false,
  showChargingPort = true,
}) => {
  const tailLightRef = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF(resolvedPath);
  
  const vehicleConfig = useMemo(() => {
    return getVehicleConfig(vehicleKey || resolvedPath);
  }, [vehicleKey, resolvedPath]);

  const portOffset = useMemo(() => {
    return CAR_PORT_OFFSETS[vehicleKey] || {
      position: [vehicleConfig.chargingPort.position.x, vehicleConfig.chargingPort.position.y, vehicleConfig.chargingPort.position.z] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    };
  }, [vehicleKey, vehicleConfig]);

  // Animate tail light breathing while charging
  useFrame(({ clock }) => {
    if (tailLightRef.current) {
      if (isCharging) {
        tailLightRef.current.intensity = Math.sin(clock.getElapsedTime() * 2.2) * 0.9 + 2.4;
      } else {
        tailLightRef.current.intensity = 1.0;
      }
    }
  });

  // Clone and optimize scene geometry
  const processedScene = useMemo(() => {
    if (!scene) return null;

    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    // Calculate Bounding Box & Center
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

    // Dynamic auto-scaling to standard vehicle length
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

    // Ground vehicle bottom precisely at Y = 0 using wheel/tire contact points
    const finalBox = new THREE.Box3().setFromObject(clone);
    let lowestTireY = Infinity;
    let tireFound = false;

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = (mesh.name || '').toLowerCase();
        const matName = Array.isArray(mesh.material)
          ? (mesh.material[0]?.name || '').toLowerCase()
          : (mesh.material?.name || '').toLowerCase();

        const isWheelOrTire =
          name.includes('tire') ||
          name.includes('tyre') ||
          name.includes('wheel') ||
          name.includes('rim') ||
          matName.includes('tire') ||
          matName.includes('tyre') ||
          matName.includes('rubber');

        if (isWheelOrTire) {
          const meshBox = new THREE.Box3().setFromObject(mesh);
          if (!isNaN(meshBox.min.y) && isFinite(meshBox.min.y)) {
            lowestTireY = Math.min(lowestTireY, meshBox.min.y);
            tireFound = true;
          }
        }
      }
    });

    const groundY = tireFound && isFinite(lowestTireY) ? lowestTireY : finalBox.min.y;
    if (!isNaN(groundY) && isFinite(groundY)) {
      clone.position.y -= groundY;
      clone.updateMatrixWorld(true);
    }

    // Enable shadows and apply car paint material
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.visible = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.set(0);

        // Ensure ultra-smooth shading normals
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
        }

        const nameLower = (mesh.name || '').toLowerCase();
        const matNameLower = (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name || '').toLowerCase();

        const isChrome = nameLower.includes('chrome') || matNameLower.includes('chrome') || nameLower.includes('trim') || matNameLower.includes('trim');
        const isGlass = nameLower.includes('glass') || nameLower.includes('window') || matNameLower.includes('glass') || matNameLower.includes('window') || matNameLower.includes('in_glass');
        const isBody = nameLower.includes('body') || nameLower.includes('paint') || nameLower.includes('hood') || nameLower.includes('door') || matNameLower.includes('carpaint') || matNameLower.includes('body') || matNameLower.includes('paint');
        const isTailLight = nameLower.includes('tail') || matNameLower.includes('tail') || nameLower.includes('red_glass') || matNameLower.includes('red_glass') || nameLower.includes('back_lines') || matNameLower.includes('back_lines');
        const isRim = nameLower.includes('rim') || matNameLower.includes('rim') || nameLower.includes('wheel') || matNameLower.includes('wheel');

        if (isTailLight) {
          const baseMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          if (baseMat instanceof THREE.MeshStandardMaterial) {
            baseMat.color = new THREE.Color('#FF1E27');
            baseMat.emissive = new THREE.Color('#FF0011');
            baseMat.emissiveIntensity = 3.5;
            baseMat.roughness = 0.08;
          }
        } else if (isChrome) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFFFFF'),
            roughness: 0.06,
            metalness: 0.98,
            envMapIntensity: 2.8,
          });
        } else if (isGlass) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#050912'),
            metalness: 0.12,
            roughness: 0.03,
            transmission: 0.82,
            transparent: true,
            opacity: 0.94,
            reflectivity: 0.98,
            ior: 1.52,
          });
        } else if (isBody && paintColor) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(paintColor || '#1249BB'),
            roughness: 0.14,
            metalness: 0.88,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            reflectivity: 0.98,
            envMapIntensity: 2.6,
          });
        } else if (isRim) {
          const baseMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          if (baseMat instanceof THREE.MeshStandardMaterial) {
            baseMat.roughness = 0.16;
            baseMat.metalness = 0.94;
            baseMat.envMapIntensity = 2.2;
          }
        }
      }
    });

    return clone;
  }, [scene, scale, vehicleConfig, paintColor]);

  const isAtto3 = vehicleKey.toLowerCase().includes('atto');
  const isBydBrand = vehicleKey.toLowerCase().includes('byd');

  return (
    <group>
      {processedScene && <primitive object={processedScene} />}

      {/* Rear Light Bar & Emblems only if relevant for BYD Atto 3 */}
      {isAtto3 && (
        <>
          <group position={[0, 0.88, -1.98]}>
            <mesh>
              <boxGeometry args={[1.48, 0.035, 0.025]} />
              <meshBasicMaterial color="#FF1E27" />
            </mesh>
            <pointLight ref={tailLightRef} position={[0, 0, -0.18]} intensity={2.2} color="#FF1E27" distance={3.0} />
          </group>

          <group position={[0, 0.96, -1.95]} rotation={[0.08, Math.PI, 0]}>
            <Text
              fontSize={0.065}
              color="#E2E8F0"
              anchorX="center"
              anchorY="middle"
              fontWeight="black"
              letterSpacing={0.16}
            >
              BYD
            </Text>
          </group>
        </>
      )}

      {/* Universal Virtual Charging Port Anchor & Plug Socket (Disabled in wireless mode) */}
      {showChargingPort && (
        <VirtualChargingPort
          ref={portAnchorRef}
          config={vehicleConfig.chargingPort}
          isCharging={isCharging}
          showDebug={showDebug}
        />
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------
// 2. Main Exported VehicleStage Component
// ---------------------------------------------------------------------------

export const VehicleStage: React.FC<VehicleStageProps> = ({
  vehicleId,
  modelPath,
  scale,
  paintColor,
  autoRotate = false,
  isCharging = true,
  rotation = [0, 0, 0],
  portAnchorRef,
  showDebug = false,
  showChargingPort = true,
}) => {
  const currentStoreVehicle = useChargeFlowStore((s) => s.vehicle);
  const selectedVehicleKey = vehicleId || currentStoreVehicle.id || 'byd-atto-3';

  // Resolve standard model path with fallback options matching user selection
  const resolvedPath = useMemo(() => {
    const key = selectedVehicleKey.toLowerCase();
    if (key.includes('polestar')) return '/models/byd-seal-u.glb';
    if (key.includes('seagull') || key.includes('bolt')) return '/models/byd-seagull.glb';
    if (key.includes('song')) return '/models/byd-song-plus.glb';
    if (key.includes('sealion')) return '/models/byd-sealion-7.glb';
    if (key.includes('seal-u') || key.includes('ioniq') || key.includes('ev6') || key.includes('i4') || key.includes('eqe')) return '/models/byd-seal-u.glb';
    if (key.includes('tesla') || key.includes('model-y') || key.includes('model-3')) return '/models/tesla-model-y.glb';
    if (key.includes('u8')) return '/models/byd-yangwang-u8.glb';
    if (key.includes('u9')) return '/models/byd-yangwang-u9.glb';
    if (key.includes('atto') || key.includes('id-4') || key.includes('ariya') || key.includes('q4')) return '/models/byd-atto-3.glb';
    if (modelPath) return modelPath;
    if (currentStoreVehicle.modelPath) return currentStoreVehicle.modelPath;
    
    return '/models/byd-atto-3.glb';
  }, [modelPath, currentStoreVehicle.modelPath, selectedVehicleKey]);

  return (
    <group rotation={rotation}>
      <Suspense fallback={
        <ProceduralEVCar 
          paintColor={paintColor || currentStoreVehicle.paintColor || '#0284c7'} 
          isCharging={isCharging} 
        />
      }>
        <DynamicCarModel
          vehicleKey={selectedVehicleKey}
          resolvedPath={resolvedPath}
          scale={scale}
          paintColor={paintColor || currentStoreVehicle.paintColor}
          isCharging={isCharging}
          portAnchorRef={portAnchorRef}
          showDebug={showDebug}
          showChargingPort={showChargingPort}
        />
      </Suspense>
    </group>
  );
};

export default VehicleStage;
