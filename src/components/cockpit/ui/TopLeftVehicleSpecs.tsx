import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { ArrowRight } from 'lucide-react';

export const TopLeftVehicleSpecs: React.FC = () => {
  const { vehicle, toggleVehicleDrawer } = useChargeFlowStore();

  const title = vehicle.model || 'Polestar 4';
  const subtitle = vehicle.drive || 'Performance AWD';
  const capacity = vehicle.capacityKwh ? `${vehicle.capacityKwh} kWh` : '102 kWh';
  const range = vehicle.maxRangeKm ? `${vehicle.maxRangeKm} km` : '438 km';
  const efficiency = '18.2 kWh/100 km';

  return (
    <div className="absolute top-20 left-8 z-20 pointer-events-auto select-none max-w-sm sm:max-w-md animate-fade-in">
      {/* Vehicle Model & Trim */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans drop-shadow-md">
        {title}
      </h1>
      <p className="text-sm sm:text-base font-medium text-slate-300 tracking-wide mt-0.5">
        {subtitle}
      </p>

      {/* 3 Column Quick Specs */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-4 pt-3 border-t border-white/10">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-500 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </span>
            <span className="font-semibold text-white text-xs sm:text-sm">{capacity}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Battery Capacity</span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-500 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </span>
            <span className="font-semibold text-white text-xs sm:text-sm">{range}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Range (est.)</span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-500 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </span>
            <span className="font-semibold text-white text-xs sm:text-sm">{efficiency}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Efficiency</span>
        </div>
      </div>

      {/* Action Button: Vehicle Details */}
      <div className="mt-5">
        <button
          onClick={toggleVehicleDrawer}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-[#0F172A]/60 hover:bg-[#1E293B]/80 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white transition-all duration-200 backdrop-blur-xl shadow-lg hover:border-white/40 group"
        >
          <span>Vehicle Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default TopLeftVehicleSpecs;
