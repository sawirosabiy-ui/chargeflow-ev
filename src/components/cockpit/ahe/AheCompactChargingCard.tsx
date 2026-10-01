import React from 'react';
import { Zap } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheCompactChargingCardProps {
  batterySoc: number;
  powerKw: number;
  timeRemainingMin: number;
  isCharging: boolean;
}

/**
 * Compact Charging Information Panel (Under the Vehicle)
 * - Positioned cleanly under the vehicle scene
 * - Structure:
 *   ⚡ CHARGING | 36% | 149 kW • 22 min remaining
 *   [ thin progress bar ]
 * - Compact, unobtrusive glass card
 */
export const AheCompactChargingCard: React.FC<AheCompactChargingCardProps> = ({
  batterySoc,
  powerKw,
  timeRemainingMin,
  isCharging,
}) => {
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const displaySoc = Math.min(100, Math.max(0, Math.round(batterySoc)));
  const isFull = displaySoc >= 100;
  const isActivelyCharging = isCharging && !isFull;

  return (
    <div className="absolute bottom-[72px] sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none w-[90%] sm:w-auto sm:min-w-[360px] max-w-md">
      <div className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900'
          : 'bg-[#070D18]/85 border-white/10 text-white'
      }`}>
        {/* Top Info Row */}
        <div className="flex items-center justify-between gap-3 text-xs">
          {/* Status */}
          <div className="flex items-center gap-1.5 font-bold">
            <Zap className={`w-3.5 h-3.5 ${isActivelyCharging ? 'text-teal-400 fill-teal-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-[11px] font-mono uppercase tracking-wider ${
              isActivelyCharging ? 'text-teal-300 font-black' : isFull ? 'text-emerald-300 font-black' : 'text-slate-400 font-bold'
            }`}>
              {isFull ? 'COMPLETED' : isCharging ? 'CHARGING' : 'STANDBY'}
            </span>
          </div>

          {/* Battery % */}
          <div className="font-mono font-black text-sm tracking-tight text-white">
            {displaySoc}%
          </div>

          {/* Power & Remaining */}
          <div className="text-[11px] font-mono text-slate-300 font-semibold">
            {isActivelyCharging ? `${powerKw || 149} kW • ${timeRemainingMin || 22} min remaining` : isFull ? 'Fully Charged' : 'Ready'}
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFull
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300'
            }`}
            style={{
              width: `${displaySoc}%`,
              boxShadow: isActivelyCharging ? '0 0 6px rgba(45,212,191,0.5)' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};
