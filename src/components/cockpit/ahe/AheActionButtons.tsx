import React from 'react';
import { Power, Square } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheActionButtonsProps {
  isCharging: boolean;
  onStartCharging: () => void;
  onStopCharging: () => void;
}

export const AheActionButtons: React.FC<AheActionButtonsProps> = ({
  isCharging,
  onStartCharging,
  onStopCharging,
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  return (
    <div className="absolute bottom-6 sm:bottom-10 right-3 sm:right-8 z-20 pointer-events-auto select-none flex items-center">
      {/* If Charging: Show Stop Button */}
      {isCharging ? (
        <button
          onClick={onStopCharging}
          className={`flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full border text-left transition-all duration-300 backdrop-blur-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 group cursor-pointer ${
            isCream
              ? 'bg-[#FAF7F2]/95 hover:bg-rose-50 border-rose-300 text-slate-900'
              : 'bg-[#14080A]/90 hover:bg-red-950/60 border-red-500/50 text-white'
          }`}
          title={t.endChargingNotice}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400 transition-all shrink-0">
            <Square className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-red-400 tracking-tight leading-tight whitespace-nowrap">
              <span className="sm:hidden">{t.stopCharging.split(' ')[0]}</span>
              <span className="hidden sm:inline">{t.stopCharging}</span>
            </div>
            <div className="hidden sm:block text-[9px] sm:text-[10px] opacity-60 text-red-300 font-medium leading-tight mt-0.5">
              {t.endChargingNotice}
            </div>
          </div>
        </button>
      ) : (
        /* If Not Charging: Show Start Button */
        <button
          onClick={onStartCharging}
          className="flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-300 text-left cursor-pointer group bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 hover:scale-105 active:scale-95"
          title={t.beginChargingNotice}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
            <Power className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black tracking-tight leading-tight text-slate-950 whitespace-nowrap">
              <span className="sm:hidden">{t.startCharging.split(' ')[0]}</span>
              <span className="hidden sm:inline">{t.startCharging}</span>
            </div>
            <div className="hidden sm:block text-[9px] sm:text-[10px] font-medium leading-tight mt-0.5 text-slate-900/80">
              {t.beginChargingNotice}
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
