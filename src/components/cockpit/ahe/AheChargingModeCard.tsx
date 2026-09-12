import React from 'react';
import { Radio, Battery } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { getBatteryVisualState } from '../../../utils/batteryVisualState';

interface AheChargingModeCardProps {
  batterySoc: number;
  isCharging: boolean;
}

export const AheChargingModeCard: React.FC<AheChargingModeCardProps> = ({ batterySoc, isCharging }) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  const displaySoc = Math.min(100, Math.max(0, Math.round(batterySoc)));
  const batteryState = getBatteryVisualState(displaySoc);
  const activeSegments = Math.ceil((displaySoc / 100) * 5);

  return (
    <div className={`absolute top-[320px] sm:top-[340px] left-5 sm:left-8 z-20 pointer-events-auto select-none w-[240px] sm:w-[260px] rounded-3xl p-4.5 border backdrop-blur-2xl transition-all duration-500 animate-in fade-in slide-in-from-left-4 ${
      isCream
        ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900 shadow-[0_20px_50px_rgba(40,20,10,0.12)]'
        : 'bg-[#08101E]/80 border-teal-500/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
    }`}>
      {/* Top Part: Charging Mode */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500"
          style={{
            borderColor: batteryState.color,
            background: isCream ? 'rgba(250,247,242,0.9)' : 'rgba(8,16,30,0.85)',
            boxShadow: `0 0 15px ${batteryState.glowColor}`,
          }}
        >
          <Radio
            className={`w-5 h-5 ${isCharging ? 'animate-pulse' : ''}`}
            style={{ color: batteryState.color }}
          />
        </div>

        <div className="min-w-0">
          <div
            className="text-[10px] font-black uppercase tracking-wider font-sans truncate"
            style={{ color: batteryState.color }}
          >
            {t.chargingMode}
          </div>
          <div className={`text-sm font-bold tracking-tight leading-snug truncate ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {isCharging ? t.chargingActive : t.ready}
          </div>
          <div className="text-[10px] opacity-70 font-medium truncate mt-0.5">
            {isCharging ? t.energyFlowing : t.connectedAndReady}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={`my-3 border-t ${isCream ? 'border-amber-900/10' : 'border-white/10'}`} />

      {/* Bottom Part: Battery Status with Segmented Meter */}
      <div className="space-y-2">
        <div className="text-[9px] font-bold uppercase tracking-wider opacity-60">
          {t.batteryStatus}
        </div>

        <div className="flex items-center gap-2">
          {/* Battery Icon */}
          <Battery className="w-4 h-4 shrink-0" style={{ color: batteryState.color }} />
          <span className={`text-sm font-black font-mono ${isCream ? 'text-slate-900' : 'text-white'}`}>
            {displaySoc}%
          </span>

          {/* 5-Segment Level Bars */}
          <div className="flex-1 flex items-center gap-1 pl-2">
            {[1, 2, 3, 4, 5].map((seg) => (
              <div
                key={seg}
                className="h-2 flex-1 rounded-sm transition-all duration-300"
                style={{
                  backgroundColor: seg <= activeSegments ? batteryState.color : (isCream ? '#E2DCD5' : '#1E293B'),
                  boxShadow: seg <= activeSegments ? `0 0 8px ${batteryState.color}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
