import React from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../localization/useTranslation';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';

interface AheCameraControlsProps {
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  activeDotIndex?: number;
  onSelectDot?: (index: number) => void;
}

/**
 * Premium Right-Side Vertical Camera Controls
 * - Plus (Zoom In), Minus (Zoom Out), RefreshCw (Reset to default 3/4 rear view)
 * - Styled as high-end automotive camera controls
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
    <div className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto select-none flex flex-col items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl border backdrop-blur-2xl transition-all shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${
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
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out (-) */}
      <button
        onClick={onZoomOut}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 transition-all flex items-center justify-center cursor-pointer active:scale-95"
        title={t.zoomOut || "Zoom Out"}
      >
        <Minus className="w-4 h-4" />
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
