import React from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheCameraControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/**
 * Upper-Right Camera Controls Dock (+ / - / ↻)
 * - Positioned cleanly in the upper-right out of the vehicle rotation sweep path
 */
export const AheCameraControls: React.FC<AheCameraControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  const { t } = useTranslation();
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  return (
    <div className={`absolute top-20 sm:top-24 right-3 sm:right-6 z-20 pointer-events-auto select-none flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl border backdrop-blur-2xl transition-all shadow-[0_10px_25px_rgba(0,0,0,0.6)] ${
      isCream
        ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-800'
        : 'bg-[#070D18]/85 border-white/10 text-slate-300'
    }`}>
      {/* Zoom In (+) */}
      <button
        onClick={onZoomIn}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
        title={t.zoomIn || "Zoom In"}
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Zoom Out (-) */}
      <button
        onClick={onZoomOut}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
        title={t.zoomOut || "Zoom Out"}
      >
        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Reset Camera View (↻) */}
      <button
        onClick={onReset}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
        title={t.resetView || "Reset View"}
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
