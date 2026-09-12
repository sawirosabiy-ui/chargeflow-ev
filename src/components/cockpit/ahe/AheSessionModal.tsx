import React from 'react';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { useTranslation } from '../../../localization/useTranslation';

interface AheSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  energyKwh: number;
  costEtb: number;
  durationMinutes: number;
  batterySoc: number;
}

export const AheSessionModal: React.FC<AheSessionModalProps> = ({
  isOpen,
  onClose,
  energyKwh,
  costEtb,
  durationMinutes,
  batterySoc,
}) => {
  const { t } = useTranslation();
  const { setView, reservation, theme } = useChargeFlowStore();
  const isCream = theme === 'cream';

  if (!isOpen) return null;

  const handleGoToHistory = () => {
    onClose();
    setView('history');
  };

  const handleGoToCockpit = () => {
    onClose();
    setView('cockpit');
  };

  const stationTitle = reservation?.stationName || t.stationHub;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className={`border rounded-3xl p-5 sm:p-7 max-w-md w-full space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200 ${
        isCream
          ? 'bg-[#FAF7F2] border-amber-900/15 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.2)]'
          : 'bg-[#0A1220] border-teal-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
      }`}>
        {/* Header with Glowing Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#06b6d4] to-[#10b981] flex items-center justify-center mx-auto text-slate-950 shadow-[0_0_25px_rgba(45,212,191,0.5)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className={`text-xl font-black tracking-tight ${isCream ? 'text-slate-900' : 'text-white'}`}>
            {t.chargingComplete}
          </h3>
          <p className={`text-xs ${isCream ? 'text-slate-600' : 'text-slate-400'}`}>
            {stationTitle} • {t.sessionAtEnded}
          </p>
        </div>

        {/* Metrics Summary Grid */}
        <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl border ${
          isCream ? 'bg-amber-50/60 border-amber-900/10' : 'bg-[#060B14] border-white/5'
        }`}>
          <div className={`p-3 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
            <div className="text-[10px] uppercase font-bold opacity-60">{t.energyDelivered}</div>
            <div className={`text-lg font-black font-mono mt-0.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>
              {energyKwh.toFixed(1)} <span className="text-xs text-teal-500">kWh</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
            <div className="text-[10px] uppercase font-bold opacity-60">{t.totalBilled}</div>
            <div className="text-lg font-black text-emerald-500 font-mono mt-0.5">
              {t.currencyEtb} {costEtb.toFixed(2)}
            </div>
          </div>

          <div className={`p-3 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
            <div className="text-[10px] uppercase font-bold opacity-60">{t.duration}</div>
            <div className={`text-lg font-black font-mono mt-0.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>
              {durationMinutes} <span className="text-xs opacity-60">min</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl ${isCream ? 'bg-white/80' : 'bg-white/[0.02]'}`}>
            <div className="text-[10px] uppercase font-bold opacity-60">{t.finalSoc}</div>
            <div className="text-lg font-black text-[#0D9488] dark:text-[#2DD4BF] font-mono mt-0.5">
              {Math.round(batterySoc)}%
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="space-y-2.5">
          {/* Primary CTA: Go to Step 08 History */}
          <button
            onClick={handleGoToHistory}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>{t.proceedToHistory}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Secondary CTA: Return to Cockpit */}
          <button
            onClick={handleGoToCockpit}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isCream
                ? 'bg-black/5 hover:bg-black/10 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.returnToCockpit}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
