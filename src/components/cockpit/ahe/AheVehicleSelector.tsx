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
 * Matches exact mobile visual reference (phone charging.png):
 * - Vehicle Carousel (< MODEL NAME >)
 * - Paint Color Swatches
 * - Prominent High-End Action Button:
 *   [ Power Icon ] Start Charging / Begin contact charging session
 *   [ Stop Icon ] Stop Charging / End charging session
 * - 100% collision-free responsive glass panel
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
    <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto select-none sm:min-w-[420px] max-w-lg mx-auto">
      {/* Frosted Dark Glass Dock */}
      <div
        className={`p-3 sm:p-4 rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.75)] space-y-2.5 ${
          isCream
            ? 'bg-[#FAF7F2]/95 border-amber-900/15 text-slate-900 shadow-amber-950/10'
            : 'bg-[#08101E]/85 border-teal-500/20 text-white shadow-black/80'
        }`}
      >
        {/* Top Row of Dock: Vehicle Selector Carousel + Color Swatches */}
        <div className="flex items-center justify-between gap-2">
          {/* Vehicle Switcher (< MODEL NAME >) */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={handlePrev}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Previous Vehicle"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-left min-w-0 px-1">
              <div className="text-xs sm:text-sm font-black uppercase font-sans tracking-wide truncate max-w-[130px] sm:max-w-[160px] text-white">
                {vehicle.model || 'POLESTAR 4'}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Next Vehicle"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-Time Paint Color Swatches */}
          <div className="flex items-center gap-1.5 shrink-0">
            {VEHICLE_COLORS.map((color) => {
              const isSelected = currentColorHex === color.hex.toLowerCase();
              const isLight = color.id === 'white' || color.id === 'silver';

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setVehicleColor(color.hex, color.name)}
                  title={`Color: ${color.name}`}
                  className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'scale-110 ring-2 ring-teal-400 ring-offset-1 ring-offset-[#08101E]'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    border: `1px solid ${color.borderHex || 'rgba(255,255,255,0.25)'}`,
                  }}
                >
                  {isSelected && (
                    <Check
                      className={`w-2.5 h-2.5 ${isLight ? 'text-slate-950' : 'text-white'}`}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row of Dock: High-End Full-Width Action Button (Matching phone charging.png) */}
        <div>
          {isCharging ? (
            <button
              onClick={onStopCharging}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 hover:from-red-900/90 hover:to-red-900/80 text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Square className="w-4 h-4 text-red-400 fill-current" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-black tracking-wider uppercase text-red-300">
                    Stop Charging
                  </div>
                  <div className="text-[10px] text-red-200/70 truncate">
                    End charging session
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                ACTIVE
              </div>
            </button>
          ) : (
            <button
              onClick={onStartCharging}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black transition-all shadow-[0_0_25px_rgba(45,212,191,0.45)] cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-950/90 text-teal-300 flex items-center justify-center shrink-0 shadow-sm">
                  <Power className="w-4 h-4 stroke-[2.8]" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-black tracking-wide uppercase leading-tight text-slate-950">
                    Start Charging
                  </div>
                  <div className="text-[10px] font-semibold text-slate-800/80 truncate">
                    Begin contact charging session
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-slate-950/15 text-slate-900 text-[10px] font-mono font-black uppercase tracking-wider shrink-0">
                DISPENSER READY
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
