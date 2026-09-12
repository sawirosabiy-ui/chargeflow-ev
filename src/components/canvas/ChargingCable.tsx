import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChargingCableProps {
  isCharging?: boolean;
  startPoint?: [number, number, number];
  endPoint?: [number, number, number];
  startRef?: React.RefObject<THREE.Object3D | THREE.Group | null> | React.RefObject<THREE.Object3D | THREE.Group>;
  endRef?: React.RefObject<THREE.Object3D | THREE.Group | null> | React.RefObject<THREE.Object3D | THREE.Group>;
}

export const ChargingCable: React.FC<ChargingCableProps> = ({
  isCharging = true,
  startPoint = [1.85, 0.98, 0.2],
  endPoint = [0.88, 0.72, 0.95],
  startRef,
  endRef,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const prevP0 = useRef(new THREE.Vector3());
  const prevP3 = useRef(new THREE.Vector3());

  // Glowing neon green energy pulse shader matching reference image
  const energyShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        isCharging: { value: isCharging ? 1.0 : 0.0 },
        baseColor: { value: new THREE.Color('#080D1A') },
        pulseColor: { value: new THREE.Color('#10B981') },
        coreColor: { value: new THREE.Color('#34D399') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float isCharging;
        uniform vec3 baseColor;
        uniform vec3 pulseColor;
        uniform vec3 coreColor;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Rapid animated emerald/cyan energy pulses streaming along the cable length
          float flowSpeed = 5.2 * isCharging;
          float wave = sin(vUv.x * 42.0 - time * flowSpeed);
          float ringPulse = smoothstep(0.58, 0.98, wave);

          // Subtle rim lighting on outer edge of rubber cable
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.2);

          vec3 col = mix(baseColor, vec3(0.08, 0.16, 0.12), rim * 0.5);

          // Intense glowing neon green & electric core
          if (isCharging > 0.01) {
            vec3 neonGreen = vec3(0.06, 0.98, 0.55);
            vec3 coreWhite = vec3(0.75, 1.0, 0.92);
            col = mix(col, neonGreen, ringPulse * 0.98);
            col = mix(col, coreWhite, pow(ringPulse, 3.2) * 2.2);
          } else {
            // Paused state: subtle static amber/cyan standby indicator
            col = mix(col, vec3(0.2, 0.25, 0.35), rim * 0.3);
          }

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  // Update shader uniform on isCharging change
  if (energyShader?.uniforms) {
    energyShader.uniforms.isCharging.value = isCharging ? 1.0 : 0.0;
  }

  // Initial geometry
  const initialGeometry = useMemo(() => {
    const p0 = new THREE.Vector3(...startPoint);
    const p3 = new THREE.Vector3(...endPoint);
    const curve = new THREE.CatmullRomCurve3([
      p0,
      new THREE.Vector3(p0.x, 0.35, p0.z),
      new THREE.Vector3((p0.x + p3.x) * 0.5, 0.18, (p0.z + p3.z) * 0.5),
      new THREE.Vector3(p3.x, 0.35, p3.z),
      p3
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.026, 16, false);
  }, [startPoint, endPoint]);

  // Recalculate cable spline dynamically every frame as the vehicle rotates or moves
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (energyShader && energyShader.uniforms) {
      energyShader.uniforms.time.value = t;
      energyShader.uniforms.isCharging.value = isCharging ? 1.0 : 0.0;
    }

    const p0 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const q0 = new THREE.Quaternion();
    const q3 = new THREE.Quaternion();

    if (startRef?.current) {
      startRef.current.getWorldPosition(p0);
      startRef.current.getWorldQuaternion(q0);
    } else {
      p0.set(...startPoint);
    }

    if (endRef?.current) {
      endRef.current.getWorldPosition(p3);
      endRef.current.getWorldQuaternion(q3);
    } else {
      p3.set(...endPoint);
    }

    // Check if position or orientation changed
    if (
      meshRef.current &&
      (p0.distanceToSquared(prevP0.current) > 0.00005 ||
       p3.distanceToSquared(prevP3.current) > 0.00005)
    ) {
      prevP0.current.copy(p0);
      prevP3.current.copy(p3);

      const dist = p0.distanceTo(p3);
      // Realistic catenary sag: dips naturally toward the ground with gravity curvature matching the reference photo
      const floorBound = 0.04;
      const sagY = Math.max(floorBound, Math.min(p0.y, p3.y) - Math.min(0.48, dist * 0.35));

      // 1. Vector leaving the charger dispenser downward towards the vehicle
      const toVehicleDir = new THREE.Vector3().subVectors(p3, p0).normalize();
      const holsterExitVec = new THREE.Vector3(toVehicleDir.x * 0.22, -0.28, toVehicleDir.z * 0.16);
      const p1 = new THREE.Vector3().addVectors(p0, holsterExitVec);

      // 2. Vector entering the vehicle plug: approach cleanly from dispenser side in open air above wheel
      const approachSign = p0.x >= p3.x ? 1 : -1;
      const pApproach = new THREE.Vector3(p3.x + approachSign * 0.26, p3.y - 0.10, p3.z + 0.08);

      // 3. Intermediate gravity catenary curve points
      const pMid1 = new THREE.Vector3(
        p1.x + (pApproach.x - p1.x) * 0.32,
        sagY,
        p1.z + (pApproach.z - p1.z) * 0.32 + 0.05
      );

      const pMid2 = new THREE.Vector3(
        p1.x + (pApproach.x - p1.x) * 0.68,
        Math.max(sagY, Math.min(p1.y, pApproach.y) - 0.24),
        p1.z + (pApproach.z - p1.z) * 0.68 + 0.03
      );

      const curve = new THREE.CatmullRomCurve3([p0, p1, pMid1, pMid2, pApproach, p3], false, 'catmullrom', 0.5);
      const newGeo = new THREE.TubeGeometry(curve, 64, 0.026, 16, false);

      if (meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
      }
      meshRef.current.geometry = newGeo;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={initialGeometry} material={energyShader} castShadow />
    </group>
  );
};

export default ChargingCable;
