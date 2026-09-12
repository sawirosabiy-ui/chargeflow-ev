import React from 'react';
import { Zap, Clock } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheLiveDataCardProps {
  powerKw: number;
  voltage: number;
  timeRemainingMin: number;
  isCharging: boolean;
}

export const AheLiveDataCard: React.FC<AheLiveDataCardProps> = ({
  powerKw,
  voltage,
  timeRemainingMin,
  isCharging,
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  return (
    <div className={`absolute top-[54%] -translate-y-1/2 right-5 sm:right-8 z-20 pointer-events-auto select-none w-[200px] sm:w-[220px] rounded-3xl p-5 border backdrop-blur-2xl transition-all duration-500 animate-in fade-in slide-in-from-right-4 ${
      isCream
        ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900 shadow-[0_20px_50px_rgba(40,20,10,0.12)]'
        : 'bg-[#08101E]/80 border-teal-500/25 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
    }`}>
      {/* Header: LIVE DATA */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-black uppercase tracking-wider font-sans ${
          isCream ? 'text-slate-900' : 'text-white'
        }`}>
          {t.liveData}
        </span>
        {isCharging && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-[9px] font-mono font-bold text-[#2DD4BF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
            {t.stream}
          </span>
        )}
      </div>

      {/* 3 Telemetry Metric Rows */}
      <div className="space-y-3.5">
        {/* Row 1: Power */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)] shrink-0">
            <Zap className="w-4 h-4 fill-current text-[#2DD4BF]" />
          </div>
          <div className="text-left min-w-0">
            <div className={`text-sm sm:text-base font-extrabold font-mono leading-tight ${
              isCream ? 'text-slate-900' : 'text-white'
            }`}>
              {isCharging ? powerKw : 0} <span className="text-[10px] opacity-70 font-sans font-normal">kW</span>
            </div>
            <div className="text-[10px] opacity-60 font-medium leading-none mt-0.5 truncate">
              {t.power}
            </div>
          </div>
        </div>

        {/* Row 2: Voltage */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)] shrink-0">
            <Zap className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="text-left min-w-0">
            <div className={`text-sm sm:text-base font-extrabold font-mono leading-tight ${
              isCream ? 'text-slate-900' : 'text-white'
            }`}>
              {isCharging ? voltage : 0} <span className="text-[10px] opacity-70 font-sans font-normal">V</span>
            </div>
            <div className="text-[10px] opacity-60 font-medium leading-none mt-0.5 truncate">
              {t.voltage}
            </div>
          </div>
        </div>

        {/* Row 3: Time Remaining */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)] shrink-0">
            <Clock className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="text-left min-w-0">
            <div className={`text-sm sm:text-base font-extrabold font-mono leading-tight ${
              isCream ? 'text-slate-900' : 'text-white'
            }`}>
              {timeRemainingMin} <span className="text-[10px] opacity-70 font-sans font-normal">min</span>
            </div>
            <div className="text-[10px] opacity-60 font-medium leading-none mt-0.5 truncate">
              {t.timeRemaining}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
