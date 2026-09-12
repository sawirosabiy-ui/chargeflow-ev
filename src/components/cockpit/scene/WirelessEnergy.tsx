import React from 'react';
import { EnergyRings } from './EnergyRings';
import { VerticalEnergyField } from './VerticalEnergyField';
import { EnergyParticles } from './EnergyParticles';
import { UndercarriagePulse } from './UndercarriagePulse';

interface WirelessEnergyProps {
  intensity: number;
  status: string;
  battery: number;
}

export const WirelessEnergy: React.FC<WirelessEnergyProps> = ({
  intensity,
  status,
  battery,
}) => {
  const batteryProgress = battery / 100;

  return (
    <group position={[0, 0, 0]}>
      {/* Layer B: Horizontal Traveling Concentric Rings */}
      <EnergyRings
        intensity={intensity}
        status={status}
      />

      {/* Layer C1: Soft Vertical Volumetric Energy Column & Additive Planes */}
      <VerticalEnergyField
        intensity={intensity}
        status={status}
      />

      {/* Layer C2: Continuous Upward Moving Energy Particles */}
      <EnergyParticles
        intensity={intensity}
        status={status}
        count={120}
      />

      {/* Layer D: Underside Battery Chassis Receiver Glow */}
      <UndercarriagePulse
        batteryProgress={batteryProgress}
        intensity={intensity}
        status={status}
      />
    </group>
  );
};

export default WirelessEnergy;
