import React from 'react';
import { BatteryCharging, BatteryFull, Zap } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheBatteryHUDProps {
  batterySoc: number;
  powerKw: number;
  voltage?: number;
  timeRemainingMin: number;
  isCharging: boolean;
  bayNumber?: string;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
}

/**
 * Top Charging Status Card
 * Matches exact mobile visual reference (phone charging.png):
 * - Rounded dark glass card with glowing battery icon box
 * - "CHARGING COMPLETE" / "CHARGING" / "DISPENSER READY" + Large bold 100% (or current SOC)
 * - Thin neon teal/emerald progress bar
 * - 3 Telemetry Columns: [POWER] | [VOLTAGE] | [TIME REMAINING]
 */
export const AheBatteryHUD: React.FC<AheBatteryHUDProps> = ({
  batterySoc,
  powerKw,
  voltage = 0,
  timeRemainingMin,
  isCharging,
  bayNumber = 'Bay 03',
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const displaySoc = Math.min(100, Math.max(0, Math.round(batterySoc)));
  const isFull = displaySoc >= 100;
  const isActivelyCharging = isCharging && !isFull;

  // Status subtitle matching reference exactly
  const statusLabel = isFull
    ? 'CHARGING COMPLETE'
    : isCharging
    ? 'CHARGING'
    : 'STANDBY';

  const displayPower = isActivelyCharging ? `${powerKw || 149} kW` : isFull ? '0 kW' : '0 kW';
  const displayVoltage = isActivelyCharging ? `${voltage || 402} V` : '0 V';
  const displayTime = isActivelyCharging
    ? `${timeRemainingMin || 18} min`
    : isFull
    ? '0 min'
    : '--';

  return (
    <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto select-none sm:min-w-[390px] max-w-md mx-auto">
      {/* Dark Glass Card with Subtle Border Glow */}
      <div
        className={`p-3.5 sm:p-4 rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.7)] ${
          isCream
            ? 'bg-[#FAF7F2]/95 border-amber-900/15 text-slate-900 shadow-amber-950/10'
            : 'bg-[#08101E]/85 border-teal-500/20 text-white shadow-black/80'
        }`}
      >
        {/* Top Section: Battery Box + Status Header + Hero Percentage */}
        <div className="flex items-center gap-3.5">
          {/* Glowing Green Battery Icon Box */}
          <div
            className={`w-12 h-14 sm:w-13 sm:h-15 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
              isCream
                ? 'bg-teal-500/10 border-teal-600/30 text-teal-700'
                : 'bg-teal-950/50 border-teal-400/40 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.25)]'
            }`}
          >
            {isFull ? (
              <BatteryFull className="w-7 h-7 text-emerald-400 stroke-[2.2]" />
            ) : isActivelyCharging ? (
              <div className="relative flex items-center justify-center">
                <BatteryCharging className="w-7 h-7 text-teal-300 stroke-[2.2] animate-pulse" />
                <Zap className="w-3 h-3 text-teal-200 fill-teal-200 absolute" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <Zap className="w-5 h-5 text-teal-400/70" />
                <div className="w-4 h-1 rounded-full bg-teal-400/40" />
              </div>
            )}
          </div>

          {/* Status Sub-title + Large % */}
          <div className="flex-1 min-w-0 text-left">
            <div
              className={`text-[10px] sm:text-[11px] font-bold font-mono tracking-widest uppercase truncate ${
                isFull
                  ? 'text-emerald-400'
                  : isActivelyCharging
                  ? 'text-teal-300'
                  : isCream
                  ? 'text-slate-500'
                  : 'text-slate-400'
              }`}
            >
              {statusLabel}
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white font-sans">
                {displaySoc}
              </span>
              <span className="text-lg sm:text-xl font-bold text-teal-400 font-sans">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Thin Neon Teal/Emerald Progress Bar */}
        <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden my-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFull
                ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.8)]'
            }`}
            style={{
              width: `${displaySoc}%`,
            }}
          />
        </div>

        {/* Bottom Section: 3 Telemetry Columns (Power | Voltage | Time Remaining) */}
        <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
          {/* Col 1: Power */}
          <div className="flex flex-col items-center">
            <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight">
              {displayPower}
            </div>
            <div className="text-[9px] font-bold font-sans tracking-widest text-slate-400 uppercase mt-0.5">
              POWER
            </div>
          </div>

          {/* Col 2: Voltage */}
          <div className="flex flex-col items-center border-x border-white/5">
            <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight">
              {displayVoltage}
            </div>
            <div className="text-[9px] font-bold font-sans tracking-widest text-slate-400 uppercase mt-0.5">
              VOLTAGE
            </div>
          </div>

          {/* Col 3: Time Remaining */}
          <div className="flex flex-col items-center">
            <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight truncate max-w-full">
              {displayTime}
            </div>
            <div className="text-[9px] font-bold font-sans tracking-widest text-slate-400 uppercase mt-0.5 truncate">
              TIME REMAINING
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
