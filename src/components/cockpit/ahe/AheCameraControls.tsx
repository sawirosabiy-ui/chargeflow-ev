import React from 'react';
import { RotateCw, Plus, Minus, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheCameraControlsProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  activeDotIndex?: number;
  onSelectDot?: (index: number) => void;
}

export const AheCameraControls: React.FC<AheCameraControlsProps> = ({
  autoRotate,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onReset,
  activeDotIndex = 0,
  onSelectDot,
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  return (
    <>
      {/* 1. WIDE HORIZONTAL CONTROLS BAR (Shown ONLY on large desktop screens >= xl where there is plenty of room) */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none hidden xl:flex flex-col items-center gap-2.5">
        {/* Floating Glass Controls Pill */}
        <div className={`flex items-center gap-6 px-6 py-2 rounded-full border backdrop-blur-2xl transition-all duration-300 ${
          isCream
            ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-800 shadow-[0_20px_50px_rgba(40,20,10,0.15)]'
            : 'bg-[#08101E]/85 border-teal-500/30 text-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
        }`}>
          {/* 360° Rotate Button */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex flex-col items-center group transition-all cursor-pointer ${
              autoRotate
                ? 'text-[#0D9488] dark:text-[#2DD4BF]'
                : (isCream ? 'text-slate-600 hover:text-slate-950' : 'text-slate-300 hover:text-white')
            }`}
            title={autoRotate ? t.autoOrbiting : t.autoRotate}
          >
            <div
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                autoRotate
                  ? 'border-[#2DD4BF] bg-teal-500/20 shadow-[0_0_12px_rgba(45,212,191,0.4)]'
                  : (isCream ? 'border-slate-300 hover:border-slate-500' : 'border-white/20 hover:border-white/40')
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase mt-1">360°</span>
          </button>

          {/* Vertical Divider */}
          <div className={`h-6 w-px ${isCream ? 'bg-black/10' : 'bg-white/10'}`} />

          {/* Zoom Controls: Minus | ZOOM | Plus */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onZoomOut}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isCream
                  ? 'border-slate-300 hover:border-teal-600 hover:bg-teal-50 text-slate-700'
                  : 'border-white/20 hover:border-[#2DD4BF] hover:bg-teal-500/10 text-slate-300 hover:text-[#2DD4BF]'
              }`}
              title={t.zoomOut}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className={`text-[10px] font-black uppercase tracking-widest px-1 ${
              isCream ? 'text-slate-700' : 'text-slate-300'
            }`}>
              ZOOM
            </span>

            <button
              onClick={onZoomIn}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isCream
                  ? 'border-slate-300 hover:border-teal-600 hover:bg-teal-50 text-slate-700'
                  : 'border-white/20 hover:border-[#2DD4BF] hover:bg-teal-500/10 text-slate-300 hover:text-[#2DD4BF]'
              }`}
              title={t.zoomIn}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vertical Divider */}
          <div className={`h-6 w-px ${isCream ? 'bg-black/10' : 'bg-white/10'}`} />

          {/* Reset Button */}
          <button
            onClick={onReset}
            className={`flex flex-col items-center group transition-all cursor-pointer ${
              isCream ? 'text-slate-600 hover:text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
            title={t.resetView}
          >
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all group-hover:scale-105 ${
              isCream ? 'border-slate-300 hover:border-teal-600 hover:bg-teal-50' : 'border-white/20 hover:border-[#2DD4BF] hover:bg-teal-500/10'
            }`}>
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase mt-1">{t.resetView.split(' ')[0]}</span>
          </button>
        </div>

        {/* 3 Pagination / Angle Dots underneath */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => onSelectDot && onSelectDot(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeDotIndex
                  ? 'bg-[#2DD4BF] w-4 shadow-[0_0_8px_#2DD4BF]'
                  : (isCream ? 'bg-slate-300 hover:bg-slate-400' : 'bg-slate-700 hover:bg-slate-500')
              }`}
              title={`${t.viewAngle} ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. COMPACT VERTICAL 3D DOCKED TOOL PILL (For screens < xl: tablets, phones, narrow viewports) */}
      <div className={`absolute right-3 sm:right-6 bottom-20 sm:bottom-24 z-20 pointer-events-auto select-none flex xl:hidden flex-col items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-2xl transition-all shadow-xl ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-800'
          : 'bg-[#08101E]/85 border-teal-500/30 text-slate-300'
      }`}>
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isCream
              ? 'border-slate-300 hover:bg-black/5 text-slate-700'
              : 'border-white/15 hover:border-[#2DD4BF] hover:bg-teal-500/10 text-slate-300 hover:text-[#2DD4BF]'
          }`}
          title={t.zoomIn}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isCream
              ? 'border-slate-300 hover:bg-black/5 text-slate-700'
              : 'border-white/15 hover:border-[#2DD4BF] hover:bg-teal-500/10 text-slate-300 hover:text-[#2DD4BF]'
          }`}
          title={t.zoomOut}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera View */}
        <button
          onClick={onReset}
          className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isCream
              ? 'border-slate-300 hover:bg-black/5 text-slate-700'
              : 'border-white/15 hover:border-[#2DD4BF] hover:bg-teal-500/10 text-slate-300 hover:text-[#2DD4BF]'
          }`}
          title={t.resetView}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
