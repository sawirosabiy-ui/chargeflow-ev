import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { Zap, Clock, Gauge } from 'lucide-react';

export const BatteryHUD: React.FC = () => {
  const { cockpitCharging } = useChargeFlowStore();
  const {
    battery,
    energyDeliveredKwh,
    rangeAddedKm,
    estimatedMinutes,
    status
  } = cockpitCharging;

  const isCharging = status === 'charging';
  const isComplete = status === 'complete';
  const batteryPct = Math.round(battery);

  // SVG Circular dial calculation
  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (batteryPct / 100) * circumference;

  // Active ring color: Amber/Gold matching reference image, or Emerald when active charging
  const ringColor = isCharging ? '#10B981' : '#F59E0B';
  const ringGlow = isCharging ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';

  const chargingTimeDisplay = isComplete
    ? '48 min'
    : isCharging
    ? `${estimatedMinutes} min`
    : '0 min';

  const energyDisplay = `${energyDeliveredKwh.toFixed(1)} kWh`;
  const rangeDisplay = `+${rangeAddedKm} km`;

  return (
    <aside
      aria-label="Battery Dial and Charging Metrics"
      className="absolute right-8 top-20 z-20 w-72 rounded-2xl p-6 select-none pointer-events-auto transition-all duration-300 shadow-2xl backdrop-blur-xl border border-white/10"
      style={{
        background: 'rgba(11, 19, 34, 0.72)',
        boxShadow: `0 20px 40px -15px ${ringGlow}, 0 0 1px 1px rgba(255,255,255,0.08)`
      }}
    >
      {/* Title */}
      <div className="text-xs font-semibold tracking-wider text-slate-300 uppercase mb-4">
        BATTERY
      </div>

      {/* Glowing Circular Dial */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor})`,
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease'
            }}
          />
        </svg>

        {/* Center Battery Percentage & State */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Zap
            className="w-5 h-5 mb-0.5"
            style={{ color: ringColor }}
          />
          <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {batteryPct}%
          </div>
          <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mt-0.5">
            {status === 'complete' ? 'CHARGE COMPLETE' : status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* 3 Telemetry Metrics with Amber Circular Badges */}
      <div className="mt-5 space-y-3.5 pt-4 border-t border-white/10">
        {/* Row 1: Energy Delivered */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Energy Delivered</span>
          </div>
          <span className="text-sm font-bold text-white font-sans">{energyDisplay}</span>
        </div>

        {/* Row 2: Range Added */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Range Added</span>
          </div>
          <span className="text-sm font-bold text-white font-sans">{rangeDisplay}</span>
        </div>

        {/* Row 3: Charging Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Charging Time</span>
          </div>
          <span className="text-sm font-bold text-white font-sans">{chargingTimeDisplay}</span>
        </div>
      </div>
    </aside>
  );
};
