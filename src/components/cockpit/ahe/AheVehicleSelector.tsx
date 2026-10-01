import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { useTranslation } from '../../../localization/useTranslation';
import { AVAILABLE_CARS, VEHICLE_COLORS } from '../../../data/cars';

interface AheVehicleSelectorProps {
  onSelectNextCar?: () => void;
  onSelectPrevCar?: () => void;
}

/**
 * Bottom Vehicle & Color Swatch Selector
 * - Left: [ ← ] [ Mini Car Image ] Model Name [ → ]
 * - Right: Color Swatches (dark, black, white, blue, red, green)
 * - Directly updates 3D model and persists in ChargeFlow store.
 */
export const AheVehicleSelector: React.FC<AheVehicleSelectorProps> = ({
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
    <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-6 z-20 pointer-events-auto select-none max-w-[calc(100vw-24px)] sm:max-w-none">
      {/* Dark Glass Dock */}
      <div className={`flex items-center flex-wrap gap-2.5 sm:gap-4 p-2 sm:px-3.5 sm:py-2 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.65)] ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900'
          : 'bg-[#070D18]/85 border-white/10 text-white'
      }`}>
        {/* 1. Vehicle Carousel Section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Car Button */}
          <button
            onClick={handlePrev}
            className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Previous Vehicle"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mini Car Thumbnail */}
          <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg overflow-hidden bg-slate-900/80 border border-white/10 flex items-center justify-center shrink-0">
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
          <div className="text-left min-w-0 pr-1">
            <div className="text-xs sm:text-sm font-black uppercase font-sans tracking-wide truncate max-w-[110px] sm:max-w-[150px]">
              {vehicle.model || 'BYD ATTO 3'}
            </div>
          </div>

          {/* Next Car Button */}
          <button
            onClick={handleNext}
            className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Next Vehicle"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-6 w-px bg-white/10" />

        {/* 2. Color Swatches Section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {VEHICLE_COLORS.map((color) => {
            const isSelected = currentColorHex === color.hex.toLowerCase();
            const isLight = color.id === 'white' || color.id === 'silver';

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setVehicleColor(color.hex, color.name)}
                title={`Color: ${color.name}`}
                className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
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
      </div>
    </div>
  );
};
