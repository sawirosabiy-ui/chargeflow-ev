import React from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { useTranslation } from '../../../localization/useTranslation';
import { AVAILABLE_CARS } from '../../../data/cars';

interface AheVehicleSelectorProps {
  onSelectNextCar?: () => void;
  onSelectPrevCar?: () => void;
}

export const AheVehicleSelector: React.FC<AheVehicleSelectorProps> = ({
  onSelectNextCar,
  onSelectPrevCar,
}) => {
  const { t } = useTranslation();
  const { vehicle, selectCar, reservation, theme } = useChargeFlowStore();
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

  // Car category / subtitle mapping
  const carCategory = vehicle.id.includes('byd-atto')
    ? t.electricSuv
    : vehicle.id.includes('byd-seagull')
    ? t.urbanCompact
    : vehicle.id.includes('tesla')
    ? t.electricCrossover
    : t.electricVehicle;

  const bayTitle = reservation?.bayNumber || `${t.bayLabel} 03`;
  const hubTitle = reservation?.stationName ? reservation.stationName.split('(')[0].trim() : t.stationHub;

  return (
    <div className="absolute bottom-6 sm:bottom-10 left-3 sm:left-8 z-20 pointer-events-auto select-none flex flex-col gap-2 sm:gap-3 max-w-[calc(100vw-130px)] sm:max-w-[270px] md:max-w-[320px]">
      {/* 1. Car Switcher Pill */}
      <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-2xl transition-all duration-300 group ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900 shadow-[0_15px_35px_rgba(40,20,10,0.12)]'
          : 'bg-[#08101E]/80 border-teal-500/25 text-white shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
      }`}>
        {/* Previous Car Button */}
        <button
          onClick={handlePrev}
          className={`p-0.5 sm:p-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isCream ? 'hover:bg-black/5 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
          title={t.prevVehicle}
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Vehicle Thumbnail */}
        <div className={`w-8 h-6 sm:w-14 sm:h-9 rounded-lg overflow-hidden border flex items-center justify-center shrink-0 ${
          isCream ? 'bg-amber-50 border-amber-900/10' : 'bg-slate-900/60 border-white/5'
        }`}>
          <img
            src={vehicle.image2D || '/images/cars/atto3_hud_thumb.png'}
            alt={vehicle.model}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cars/atto3_hud_thumb.png';
            }}
          />
        </div>

        {/* Vehicle Name & Type with generous breathing room */}
        <div className="px-2 text-left min-w-0 flex-1">
          <div className={`text-[11px] sm:text-xs font-black uppercase font-sans tracking-wider leading-tight truncate ${
            isCream ? 'text-slate-900' : 'text-white'
          }`}>
            {vehicle.model || 'BYD ATTO 3'}
          </div>
          <div className="hidden sm:block text-[10px] opacity-60 font-medium leading-tight mt-0.5 truncate">
            {carCategory}
          </div>
        </div>

        {/* Next Car Button with margin separation */}
        <button
          onClick={handleNext}
          className={`ml-1 p-1 sm:p-1.5 rounded-xl transition-all cursor-pointer shrink-0 border ${
            isCream 
              ? 'border-black/5 hover:bg-black/5 text-slate-600 hover:text-slate-950' 
              : 'border-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title={t.nextVehicle}
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* 2. Location Tag Pill (Hidden on mobile to preserve viewport space) */}
      <div className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-xl shadow-lg w-fit transition-all duration-300 ${
        isCream
          ? 'bg-[#FAF7F2]/90 border-amber-900/15 text-slate-900'
          : 'bg-[#08101E]/80 border-teal-500/20 text-white'
      }`}>
        <div className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center text-[#2DD4BF] shrink-0">
          <MapPin className="w-3 h-3 text-[#2DD4BF]" />
        </div>
        <div className="text-left truncate max-w-[170px]">
          <span className={`text-xs font-black font-sans mr-1.5 ${isCream ? 'text-slate-900' : 'text-white'}`}>
            {bayTitle}
          </span>
          <span className="text-[10px] opacity-60 truncate">{hubTitle}</span>
        </div>
      </div>
    </div>
  );
};
