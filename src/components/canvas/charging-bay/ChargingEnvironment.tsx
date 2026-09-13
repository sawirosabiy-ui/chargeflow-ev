import React, { Suspense } from 'react';
import { ContactShadows } from '@react-three/drei';
import { ReplicaCircularStage } from './ReplicaCircularStage';
import { VehicleGroundingSystem } from './VehicleGroundingSystem';
import { ChargingEnergy } from './ChargingEnergy';
import { EnvironmentLighting } from './EnvironmentLighting';
import { CarRotator } from './CarRotator';

interface ChargingEnvironmentProps {
  children: React.ReactNode;
  isCharging?: boolean;
  batterySoc?: number;
  theme?: 'dark' | 'cream';
  groundingOffset?: number;
  showEnergy?: boolean;
  showBackdrop?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: number;
  targetRotation?: number;
  onRotationChange?: (angle: number) => void;
  onUserInteraction?: () => void;
}

/**
 * ChargingEnvironment:
 * - 3D replica of the circular architectural stage matching showroom-bg.jpg & ahe_image.png
 * - The stage, camera, and original background stay completely still
 * - Only the car model rotates 360° on top of the stage
 * - All four wheels physically sit on the stage with live contact shadows
 */
export const ChargingEnvironment: React.FC<ChargingEnvironmentProps> = ({
  children,
  isCharging = false,
  batterySoc = 66,
  theme = 'dark',
  groundingOffset = -0.002,
  showEnergy = true,
  autoRotate = false,
  autoRotateSpeed = 0.6,
  initialRotation = -Math.PI / 5.5,
  targetRotation,
  onRotationChange,
  onUserInteraction,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Master Studio Environment Lighting & Photorealistic Reflections */}
      <Suspense fallback={null}>
        <EnvironmentLighting
          isCharging={isCharging}
          theme={theme}
          batterySoc={batterySoc}
        />
      </Suspense>

      {/* 2. Exact 3D Replica of the Circular Architectural Turntable Stage */}
      {/* (Stationary, permanently anchored to terrace floor, NEVER rotates) */}
      <ReplicaCircularStage
        isCharging={isCharging}
        batterySoc={batterySoc}
        theme={theme}
        position={[0, 0, 0]}
      />

      {/* 3. Rising Wireless Energy Flows (From Stage Surface to Vehicle Underside) */}
      {showEnergy && (
        <ChargingEnergy
          isCharging={isCharging}
          batterySoc={batterySoc}
          padY={0.005}
          underbodyY={0.28}
        />
      )}

      {/* 4. ONLY THE CAR ROTATES 360 DEGREES (Everything else stays completely still) */}
      <CarRotator
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        initialRotation={initialRotation}
        targetRotation={targetRotation}
        onRotationChange={onRotationChange}
        onUserInteraction={onUserInteraction}
      >
        <VehicleGroundingSystem
          surfaceY={0.0}
          groundingOffset={groundingOffset}
        >
          {children}
        </VehicleGroundingSystem>

        {/* Live Tire Contact Patches that Rotate with the Wheels for Weight Realism */}
        <group position={[0, 0.003, 0]}>
          <mesh position={[-0.58, 0, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.36]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.58, 0, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.36]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          <mesh position={[-0.58, 0, -1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.36]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.58, 0, -1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.36]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
        </group>
      </CarRotator>

      {/* 5. Live Grounding Contact Shadows on the Stage Deck Surface (for Car Wheels) */}
      <Suspense fallback={null}>
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.96}
          blur={1.4}
          scale={4.8}
          far={2.0}
          frames={Infinity}
          resolution={512}
          color="#000000"
        />
      </Suspense>

      {/* 6. Live Grounding Contact Shadow for the Entire Stage onto the Terrace Floor */}
      <Suspense fallback={null}>
        <ContactShadows
          position={[0, -0.081, 0]}
          opacity={0.98}
          blur={2.4}
          scale={7.6}
          far={2.5}
          frames={Infinity}
          resolution={512}
          color="#000000"
        />
      </Suspense>
    </group>
  );
};
