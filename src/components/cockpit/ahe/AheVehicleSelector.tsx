import React from 'react';
import { ChevronLeft, ChevronRight, Check, Power, Square } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { useTranslation } from '../../../localization/useTranslation';
import { AVAILABLE_CARS, VEHICLE_COLORS } from '../../../data/cars';

interface AheVehicleSelectorProps {
  isCharging: boolean;
  onStartCharging: () => void;
  onStopCharging: () => void;
  onSelectNextCar?: () => void;
  onSelectPrevCar?: () => void;
}

/**
 * Unified Bottom Cockpit Control Dock
 * - Integrates Vehicle Carousel, Live Color Swatches, and Start/Stop Action Buttons into a single collision-free glass panel.
 * - Responsive: Works cleanly on 360px mobile screens up to 4K displays.
 */
export const AheVehicleSelector: React.FC<AheVehicleSelectorProps> = ({
  isCharging,
  onStartCharging,
  onStopCharging,
  onSelectNextCar,
  onSelectPrevCar,
}) => {
  const { t } = useTranslation();
  const { vehicle, selectCar, setVehicleColor, theme } = useChargeFlowStore();
  const isCream = theme === 'cream';

  const handlePrev = () => {
    if (onSelectPrevCar) {
      onSelectPrevCar();
      return;
    }
    const currentIndex = AVAILABLE_CARS.findIndex((c) => c.id === vehicle.id);
    const prevIndex = (currentIndex - 1 + AVAILABLE_CARS.length) % AVAILABLE_CARS.length;
    selectCar(AVAILABLE_CARS[prevIndex]);
  };

  const handleNext = () => {
    if (onSelectNextCar) {
      onSelectNextCar();
      return;
    }
    const currentIndex = AVAILABLE_CARS.findIndex((c) => c.id === vehicle.id);
    const nextIndex = (currentIndex + 1) % AVAILABLE_CARS.length;
    selectCar(AVAILABLE_CARS[nextIndex]);
  };

  const currentColorHex = (vehicle.paintColor || '#0284c7').toLowerCase();

  return (
    <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto select-none sm:max-w-2xl max-w-full">
      {/* Dark Glass Dock Panel */}
      <div className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-5 ${
        isCream
          ? 'bg-[#FAF7F2]/92 border-amber-900/15 text-slate-900'
          : 'bg-[#070D18]/85 border-white/10 text-white'
      }`}>
        {/* Row 1 (Mobile) / Left Section (Desktop): Vehicle Carousel + Action Button */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          {/* Vehicle Switcher */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Previous Vehicle"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Thumbnail */}
            <div className="w-9 h-6 sm:w-11 sm:h-7 rounded-lg overflow-hidden bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0">
              <img
                src={vehicle.image2D || '/images/cars/atto3_hud_thumb.png'}
                alt={vehicle.model}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/cars/atto3_hud_thumb.png';
                }}
              />
            </div>

            {/* Vehicle Name */}
            <div className="text-left min-w-0 px-1">
              <div className="text-xs sm:text-sm font-black uppercase font-sans tracking-wide truncate max-w-[110px] sm:max-w-[140px]">
                {vehicle.model || 'BYD ATTO 3'}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Next Vehicle"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button: Start / Stop (Mobile embedded in row 1, Desktop placed on right) */}
          <div className="sm:hidden shrink-0">
            {isCharging ? (
              <button
                onClick={onStopCharging}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/50 bg-red-950/70 hover:bg-red-900/80 text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer active:scale-95"
                title={t.stopCharging}
              >
                <Square className="w-3 h-3 text-red-400 fill-current" />
                <span className="text-[11px] font-black tracking-wider uppercase text-red-300">STOP</span>
              </button>
            ) : (
              <button
                onClick={onStartCharging}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95"
                title={t.startCharging}
              >
                <Power className="w-3 h-3 stroke-[2.5]" />
                <span className="text-[11px] font-black tracking-wider uppercase">START</span>
              </button>
            )}
          </div>
        </div>

        {/* Vertical Divider for Desktop */}
        <div className="hidden sm:block h-6 w-px bg-white/10" />

        {/* Row 2 (Mobile) / Middle Section (Desktop): Real-Time Color Swatches */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
          {VEHICLE_COLORS.map((color) => {
            const isSelected = currentColorHex === color.hex.toLowerCase();
            const isLight = color.id === 'white' || color.id === 'silver';

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setVehicleColor(color.hex, color.name)}
                title={`Color: ${color.name}`}
                className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'scale-110 ring-2 ring-teal-400 ring-offset-2 ring-offset-[#070D18]'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: color.hex,
                  border: `1px solid ${color.borderHex || 'rgba(255,255,255,0.25)'}`,
                }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${isLight ? 'text-slate-950' : 'text-white'}`}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop-only Right Action Button */}
        <div className="hidden sm:flex items-center shrink-0">
          {isCharging ? (
            <button
              onClick={onStopCharging}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-950/70 hover:bg-red-900/80 text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              title={t.stopCharging}
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <Square className="w-2.5 h-2.5 text-red-400 fill-current" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-red-300">STOP CHARGE</span>
            </button>
          ) : (
            <button
              onClick={onStartCharging}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
              title={t.startCharging}
            >
              <div className="w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center text-emerald-400">
                <Power className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase">START CHARGE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
