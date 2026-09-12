import React from 'react';
import { Zap, Hand } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { getBatteryVisualState } from '../../../utils/batteryVisualState';

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

export const AheBatteryHUD: React.FC<AheBatteryHUDProps> = ({
  batterySoc,
  powerKw,
  voltage,
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
  const batteryState = getBatteryVisualState(displaySoc);
  const isFull = displaySoc >= 100;
  const isActivelyCharging = isCharging && !isFull;

  const statusText = isFull
    ? t.chargingComplete
    : isCharging
    ? t.chargingTitle
    : t.ready;

  const cleanBay = bayNumber.replace(/\s*\(.*?\)/, '').trim();

  return (
    <div className={`absolute top-3 sm:top-20 inset-x-3 sm:inset-x-auto sm:left-8 z-20 pointer-events-auto select-none sm:w-[320px] rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border backdrop-blur-2xl transition-all duration-500 animate-in fade-in slide-in-from-top-3 ${
      isCream
        ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900 shadow-[0_15px_40px_rgba(40,20,10,0.12)]'
        : 'bg-[#08101E]/85 border-teal-500/25 text-white shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
    }`}>
      {/* 1. TOP ROW: BATTERY ICON + STATUS + PERCENTAGE + MOBILE 360° & TELEMETRY */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Reactive Battery Icon & % */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <div
            className="relative w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500"
            style={{
              borderColor: batteryState.color,
              boxShadow: `0 0 16px ${batteryState.glowColor}`,
              background: isCream ? 'rgba(250,247,242,0.9)' : 'rgba(8,16,30,0.85)',
            }}
          >
            <div className="relative">
              {/* Battery outline */}
              <div
                className="w-3.5 h-5 sm:w-6 sm:h-9 rounded sm:rounded-md border-2 flex flex-col justify-end p-0.5 relative"
                style={{ borderColor: batteryState.color }}
              >
                <div 
                  className="w-full rounded-sm transition-all duration-700" 
                  style={{
                    height: `${displaySoc}%`,
                    backgroundColor: batteryState.color,
                    boxShadow: `0 0 8px ${batteryState.color}`,
                  }}
                />
                {/* Battery positive nub */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 sm:w-2.5 rounded-t-sm"
                  style={{ backgroundColor: batteryState.color }}
                />
              </div>
              {/* Centered bolt */}
              <Zap className="w-2 h-2 sm:w-3.5 sm:h-3.5 text-white fill-white absolute inset-0 m-auto drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
            </div>
          </div>

          {/* Text Header & Big % */}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 leading-none whitespace-nowrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-teal-400">
                {cleanBay}
              </span>
              <span className="text-slate-500 text-[10px]">•</span>
              <span
                className="text-[9px] sm:text-[11px] font-black tracking-wider uppercase font-sans"
                style={{ color: batteryState.color }}
              >
                {statusText}
              </span>
              {isActivelyCharging && (
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                  style={{ backgroundColor: batteryState.color }}
                />
              )}
            </div>
            <div className={`text-lg sm:text-4xl font-black font-mono tracking-tight leading-tight mt-0.5 sm:mt-1 ${
              isCream ? 'text-slate-900' : 'text-white'
            }`}>
              {displaySoc}
              <span className="text-sm sm:text-2xl font-bold ml-0.5" style={{ color: batteryState.color }}>%</span>
            </div>
          </div>
        </div>

        {/* Mobile Right Controls: Live Telemetry (if charging) + 360° Rotate Button (< sm) */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          {/* Live kW & min (Only shown if actively charging) */}
          {isActivelyCharging && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-300 font-mono text-[10px] whitespace-nowrap">
              <Zap className="w-2.5 h-2.5 text-teal-400 animate-pulse shrink-0" />
              <span>{powerKw}kW</span>
              <span className="opacity-40">•</span>
              <span>{timeRemainingMin}m</span>
            </div>
          )}

          {/* Mobile 360° Rotate button */}
          {onToggleAutoRotate && (
            <button
              onClick={onToggleAutoRotate}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border backdrop-blur-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                isCream
                  ? "bg-black/5 hover:bg-black/10 border-black/10 text-slate-800"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-teal-300"
              }`}
              title="Toggle 360° Rotation"
            >
              <Hand className="w-3 h-3 text-[#2DD4BF] shrink-0" />
              <span>{autoRotate ? '360°' : '360°'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. HORIZONTAL SHIMMER PROGRESS BAR */}
      <div className="mt-2.5 sm:mt-3.5 space-y-1">
        <div className={`h-1.5 sm:h-2 w-full rounded-full overflow-hidden border p-0.5 ${
          isCream ? 'bg-slate-200 border-amber-900/10' : 'bg-slate-900/90 border-white/10'
        }`}>
          <div
            className="h-full rounded-full relative transition-all duration-500"
            style={{
              width: `${displaySoc}%`,
              backgroundColor: batteryState.color,
              boxShadow: `0 0 12px ${batteryState.glowColor}`,
            }}
          >
            {isCharging && !isFull && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
            )}
          </div>
        </div>
      </div>

      {/* 3. DESKTOP TELEMETRY COLUMNS: POWER, VOLTAGE, TIME REMAINING (Hidden on Mobile) */}
      <div className={`hidden sm:grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t text-left ${
        isCream ? 'border-amber-900/10' : 'border-white/10'
      }`}>
        <div>
          <div className={`text-base font-extrabold font-mono leading-none ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {isCharging ? powerKw : 0} <span className="text-[10px] opacity-70 font-sans font-normal">kW</span>
          </div>
          <div className="text-[9px] font-bold tracking-wider uppercase opacity-60 mt-1">
            {t.power}
          </div>
        </div>

        <div>
          <div className={`text-base font-extrabold font-mono leading-none ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {isCharging ? voltage : 0} <span className="text-[10px] opacity-70 font-sans font-normal">V</span>
          </div>
          <div className="text-[9px] font-bold tracking-wider uppercase opacity-60 mt-1">
            {t.voltage}
          </div>
        </div>

        <div>
          <div className={`text-base font-extrabold font-mono leading-none ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {timeRemainingMin} <span className="text-[10px] opacity-70 font-sans font-normal">min</span>
          </div>
          <div className="text-[9px] font-bold tracking-wider uppercase opacity-60 mt-1">
            {t.timeRemaining}
          </div>
        </div>
      </div>
    </div>
  );
};
