import React, { Suspense, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ChargingStationModel } from './ChargingStationModel';
import { ChargingCable } from './ChargingCable';
import { VehicleStage } from './VehicleStage';
import { MultiBayStationEnvironment } from './MultiBayStationEnvironment';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { CAR_PORT_OFFSETS, getVehicleConfig } from '../../data/vehicleConfigs';

export interface ChargingSceneHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetCamera: () => void;
}

export type ChargingSceneMode = 'idle' | 'reserved' | 'charging' | 'completed';

interface ChargingSceneProps {
  vehicleId?: string;
  modelPath?: string;
  mode?: ChargingSceneMode;
  reservedBay?: string;
  showCharger?: boolean;
  autoRotate?: boolean;
  cameraPosition?: [number, number, number];
  className?: string;
  showDebug?: boolean;
  backdropMode?: boolean;
}

// ---------------------------------------------------------------------------
// Dynamic WebGL Concentric Electromagnetic Charging Wave under Battery Pack
// ---------------------------------------------------------------------------
const ChargingFloorAura: React.FC<{ position: [number, number, number]; isCharging: boolean }> = ({
  position,
  isCharging,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const auraShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        isCharging: { value: isCharging ? 1.0 : 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float isCharging;
        varying vec2 vUv;

        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0;
          if (dist > 1.0) discard;

          // Outward propagating charging energy rings
          float speed = time * 3.2 * isCharging;
          float ring1 = sin(dist * 16.0 - speed);
          float ring2 = sin(dist * 28.0 - speed * 1.25);
          float pulse = smoothstep(0.42, 0.96, ring1) * 0.65 + smoothstep(0.58, 0.98, ring2) * 0.35;

          // Soft radial falloff toward perimeter
          float edgeFade = 1.0 - smoothstep(0.12, 0.98, dist);

          vec3 emerald = vec3(0.06, 0.95, 0.52);
          vec3 cyan = vec3(0.04, 0.76, 0.96);
          vec3 col = mix(emerald, cyan, sin(dist * 6.0 - time) * 0.5 + 0.5);

          float alpha = pulse * edgeFade * 0.65 * isCharging;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.isCharging.value = isCharging ? 1.0 : 0.0;
    }
  });

    return (
      <mesh
        ref={meshRef}
        position={[position[0], (position[1] ?? 0) + 0.003, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[4.8, 3.4]} />
        <primitive object={auraShader} ref={materialRef} attach="material" />
      </mesh>
    );
  };

  // ---------------------------------------------------------------------------
  // Main State-Driven 3D Charging Scene Component
  // ---------------------------------------------------------------------------

  export const ChargingScene = forwardRef<ChargingSceneHandle, ChargingSceneProps>(({
    vehicleId,
    modelPath,
    mode,
    reservedBay,
    showCharger = true,
    autoRotate = false,
    cameraPosition,
    className = "w-full h-full",
    showDebug = false,
    backdropMode = false,
  }, ref) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const nozzleRef = useRef<THREE.Group>(null);
    const portAnchorRef = useRef<THREE.Group>(null);

    const chargingSession = useChargeFlowStore((s) => s.chargingSession);
    const vehicle = useChargeFlowStore((s) => s.vehicle);
    const reservation = useChargeFlowStore((s) => s.reservation);

    const activeVehicleId = vehicleId || vehicle.id || 'byd-atto-3';
    const activeModelPath = modelPath || vehicle.modelPath || '/models/byd-atto-3.glb';
    const activeBayName = reservedBay || reservation?.bayNumber || 'Bay 03';
    const bayNum = activeBayName.replace(/[^0-9]/g, '').padStart(2, '0');
    const bayX = backdropMode ? 0.0 : (bayNum === '01' ? -8.0 : bayNum === '02' ? -4.0 : bayNum === '04' ? 4.0 : 0.0);
    
    // Determine port side configuration for same-side charger placement
    const vehicleConfig = useMemo(() => {
      return getVehicleConfig(activeVehicleId || activeModelPath);
    }, [activeVehicleId, activeModelPath]);

    const portOffset = useMemo(() => {
      return CAR_PORT_OFFSETS[activeVehicleId] || {
        position: [vehicleConfig.chargingPort.position.x, vehicleConfig.chargingPort.position.y, vehicleConfig.chargingPort.position.z] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        side: vehicleConfig.chargingPort.side.includes('left') ? 'left' : 'right',
      };
    }, [activeVehicleId, vehicleConfig]);

    const isLeftPort = portOffset.side === 'left' || vehicleConfig.chargingPort.side.includes('left');
    const chargerX = isLeftPort ? bayX - 1.85 : bayX + 1.85;
    const chargerRotation: [number, number, number] = isLeftPort ? [0, 0.4, 0] : [0, -0.4, 0];

    // Effective vehicle placement grounded firmly on asphalt in Bay 03 and matching reference angle
    const carPosition: [number, number, number] = backdropMode ? [-1.12, -0.12, -1.05] : [bayX, 0, 0];
    const carRotation: [number, number, number] = backdropMode ? [0, -2.93, 0] : [0, -2.75, 0];
    const defaultCamPos: [number, number, number] = cameraPosition || (backdropMode ? [-0.35, 1.15, 3.90] : [bayX - 0.25, 1.22, 3.95]);
    const defaultTarget: [number, number, number] = backdropMode ? [-0.15, 0.50, 0.0] : [bayX + 0.35, 0.72, 0.0];

  // Determine effective visual state
  const effectiveMode: ChargingSceneMode = mode || (
    chargingSession.status === 'CHARGING' ? 'charging' :
    chargingSession.status === 'COMPLETED' ? 'completed' :
    reservation ? 'reserved' : 'charging'
  );

  const isCharging = effectiveMode === 'charging';
  const isIdle = effectiveMode === 'idle';
  const showChargerUnit = !isIdle && showCharger;
  const showCableUnit = isCharging && showChargerUnit;

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (controlsRef.current) {
        const controls = controlsRef.current;
        const camera = controls.object;
        const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
        if (offset.length() > 1.8) {
          offset.multiplyScalar(0.82);
          camera.position.addVectors(controls.target, offset);
          controls.update();
        }
      }
    },
    zoomOut: () => {
      if (controlsRef.current) {
        const controls = controlsRef.current;
        const camera = controls.object;
        const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
        if (offset.length() < 7.5) {
          offset.multiplyScalar(1.22);
          camera.position.addVectors(controls.target, offset);
          controls.update();
        }
      }
    },
    resetCamera: () => {
      if (controlsRef.current) {
        const controls = controlsRef.current;
        const camera = controls.object;
        camera.position.set(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]);
        controls.target.set(defaultTarget[0], defaultTarget[1], defaultTarget[2]);
        controls.update();
      }
    },
  }));

  return (
    <div 
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      <Canvas
        className="w-full h-full"
        camera={{
          position: defaultCamPos,
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        {/* Studio & Station Lighting Setup */}
        <ambientLight intensity={backdropMode ? 1.5 : 1.3} color="#0F172A" />

        {/* Primary Key Light */}
        <directionalLight
          position={[bayX + 5.0, 8.0, 4.5]}
          intensity={backdropMode ? 3.0 : 2.6}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Cool Fill Light for Body Definition */}
        <directionalLight
          position={[bayX - 5.0, 6.0, 2.0]}
          intensity={1.4}
          color="#CBD5E1"
        />

        {/* Subtle Green Rim Light */}
        <directionalLight
          position={[bayX, 4.5, -5.5]}
          intensity={1.8}
          color="#10B981"
        />

        {/* Downward Canopy Spot in Backdrop Mode */}
        {backdropMode && (
          <spotLight
            position={[carPosition[0], 4.8, 1.0]}
            target-position={[carPosition[0], carPosition[1], carPosition[2]]}
            intensity={2.8}
            color="#FFE0B2"
            angle={Math.PI / 4}
            penumbra={0.6}
          />
        )}

        {/* Orbit Controls with Smooth Damping & 360° Rotation */}
        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={7.0}
          enablePan={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          target={defaultTarget}
          enableDamping={true}
          dampingFactor={0.06}
        />

        {/* Full 3D Multi-Bay EV Charging Station Environment (Only in full-3d mode) */}
        {!backdropMode ? (
          !isIdle ? (
            <MultiBayStationEnvironment 
              reservedBay={activeBayName} 
              isCharging={isCharging} 
            />
          ) : (
            <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#060911" roughness={0.3} metalness={0.6} />
            </mesh>
          )
        ) : (
          /* Invisible ground shadow catcher plane grounded precisely on asphalt */
          <mesh position={[0, carPosition[1] - 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <shadowMaterial opacity={0.45} />
          </mesh>
        )}

        {/* Real 3D Modern DC Fast Charger Pedestal (Only rendered in full-3d mode) */}
        {!backdropMode && showChargerUnit && (
          <ChargingStationModel 
            nozzleRef={nozzleRef}
            position={[chargerX, 0, 0.2]} 
            rotation={chargerRotation} 
            isCharging={isCharging}
            powerKw={chargingSession.powerKw || 86}
            soc={vehicle.batterySoc || 66}
            holsterSide={isLeftPort ? 'right' : 'left'}
          />
        )}

        {/* Realistic Automotive Reflection Environment */}
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.9} />
        </Suspense>

        {/* Vehicle Stage: Dynamically Swapped 3D Car Model Grounded inside Bay */}
        <group position={carPosition} rotation={carRotation}>
          <VehicleStage 
            key={activeVehicleId}
            vehicleId={activeVehicleId}
            modelPath={activeModelPath}
            scale={vehicle.scale || 4.2}
            paintColor={vehicle.paintColor || '#1d4ed8'}
            isCharging={isCharging}
            portAnchorRef={portAnchorRef}
            showDebug={showDebug}
          />
        </group>

        {/* Universal Dynamic 3D Charging Cable connected from 2D Dispenser Holster to Vehicle Body Port */}
        {showCableUnit && (
          <ChargingCable 
            isCharging={isCharging} 
            startRef={nozzleRef}
            endRef={portAnchorRef}
            startPoint={backdropMode ? [1.21, 0.535, 0.20] : [chargerX + (isLeftPort ? 0.28 : -0.28), 1.02, 0.2]}
            endPoint={backdropMode ? [0.00, 0.62, -0.11] : [bayX + (isLeftPort ? -0.85 : 0.85), 0.74, 0.95]}
          />
        )}

        {/* Dynamic WebGL Floor Energy Waves pulsing under battery pack */}
        <ChargingFloorAura position={carPosition} isCharging={isCharging} />

        {/* Dynamic Glow Point Light illuminating ground and chassis under battery pack */}
        {isCharging && (
          <pointLight
            position={[carPosition[0], carPosition[1] + 0.25, carPosition[2]]}
            intensity={2.2}
            color="#10B981"
            distance={3.2}
          />
        )}

        {/* Soft Contact Shadow grounded on wet pavement under Car */}
        <Suspense fallback={null}>
          <ContactShadows
            position={[carPosition[0], carPosition[1] + 0.002, carPosition[2]]}
            resolution={512}
            frames={1}
            opacity={0.88}
            scale={7.5}
            blur={1.8}
            far={2.8}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default ChargingScene;

