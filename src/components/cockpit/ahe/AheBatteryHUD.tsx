import React from 'react';
import { RotateCw, Zap } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheBatteryHUDProps {
  batterySoc: number;
  powerKw: number;
  voltage: number;
  timeRemainingMin: number;
  isCharging: boolean;
  bayNumber?: string;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
}

/**
 * Top Charging Status Card
 * - Apple Vision Pro-style dark glass panel
 * - Structure:
 *   [ Bay 03 • CHARGING ] [ 36% ] [ 149 kW • 22 min ] [ 360° ]
 * - Thin, elegant battery progress bar
 */
export const AheBatteryHUD: React.FC<AheBatteryHUDProps> = ({
  batterySoc,
  powerKw,
  timeRemainingMin,
  isCharging,
  bayNumber = 'Bay 03',
  autoRotate = false,
  onToggleAutoRotate,
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const displaySoc = Math.min(100, Math.max(0, Math.round(batterySoc)));
  const isFull = displaySoc >= 100;
  const isActivelyCharging = isCharging && !isFull;
  const cleanBay = bayNumber.replace(/\s*\(.*?\)/, '').trim();

  const statusLabel = isFull
    ? 'COMPLETED'
    : isCharging
    ? 'CHARGING'
    : 'STANDBY';

  return (
    <div className="absolute top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto select-none sm:min-w-[440px] max-w-lg">
      {/* Premium Dark Glass Panel */}
      <div className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.65)] ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900'
          : 'bg-[#070D18]/85 border-white/10 text-white'
      }`}>
        {/* Main Telemetry Flex Row */}
        <div className="flex items-center justify-between gap-3">
          {/* 1. Bay & Status Tag */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              isActivelyCharging ? 'bg-teal-400 animate-pulse' : isFull ? 'bg-emerald-400' : 'bg-slate-400'
            }`} />
            <div className="text-left leading-tight">
              <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
                {cleanBay}
              </div>
              <div className={`text-xs font-black tracking-wider uppercase font-sans ${
                isActivelyCharging ? 'text-teal-300' : isFull ? 'text-emerald-300' : 'text-slate-300'
              }`}>
                {statusLabel}
              </div>
            </div>
          </div>

          {/* 2. Big Hero Battery % */}
          <div className="text-center font-mono font-black text-2xl sm:text-3xl tracking-tight leading-none px-2 text-white">
            <span>{displaySoc}</span>
            <span className="text-sm sm:text-base font-bold text-teal-400 ml-0.5">%</span>
          </div>

          {/* 3. Power & Time Remaining */}
          <div className="text-right leading-tight">
            <div className="text-xs font-mono font-bold text-white">
              {isActivelyCharging ? `${powerKw || 149} kW` : '0 kW'}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {isActivelyCharging ? `${timeRemainingMin || 22} min left` : isFull ? 'Ready' : 'Ready to plug'}
            </div>
          </div>

          {/* 4. 360° Orbit View Toggle */}
          {onToggleAutoRotate && (
            <button
              onClick={onToggleAutoRotate}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                autoRotate
                  ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Toggle 360° View"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span className="text-[10px] font-mono font-bold ml-1 hidden sm:inline">360°</span>
            </button>
          )}
        </div>

        {/* Thin Elegant Battery Progress Bar */}
        <div className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden mt-2.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFull
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300'
            }`}
            style={{
              width: `${displaySoc}%`,
              boxShadow: isActivelyCharging ? '0 0 8px rgba(45,212,191,0.6)' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};
