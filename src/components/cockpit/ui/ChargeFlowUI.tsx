import React, { useEffect } from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { CockpitHeader } from './CockpitHeader';
import { TopLeftVehicleSpecs } from './TopLeftVehicleSpecs';
import { BatteryHUD } from './BatteryHUD';
import { CockpitBottomBar } from './CockpitBottomBar';
import { VehicleDrawer } from './VehicleDrawer';

export const ChargeFlowUI: React.FC = () => {
  const tickCockpitCharging = useChargeFlowStore((s) => s.tickCockpitCharging);
  const status = useChargeFlowStore((s) => s.cockpitCharging.status);

  // Periodic ticker during active charging
  useEffect(() => {
    if (status !== 'charging') return;
    const timer = setInterval(() => {
      tickCockpitCharging();
    }, 1000);
    return () => clearInterval(timer);
  }, [status, tickCockpitCharging]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 font-sans overflow-hidden">
      {/* 1. Top Navigation Bar */}
      <CockpitHeader />

      {/* 2. Top-Left Vehicle Model & Specs */}
      <TopLeftVehicleSpecs />

      {/* 3. Top-Right Glowing Circular Dial Battery Card */}
      <BatteryHUD />

      {/* 4. Mid-Lower Floating Action Bar + Bottom 5-Card Dashboard Tray + Footer */}
      <CockpitBottomBar />

      {/* 5. Interactive Vehicle Selection & Customization Drawer */}
      <VehicleDrawer />
    </div>
  );
};

export default ChargeFlowUI;
