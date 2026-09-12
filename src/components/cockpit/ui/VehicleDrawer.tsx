import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { X, Check, Battery, Gauge, Cpu } from 'lucide-react';
import { AVAILABLE_CARS, CarSpec } from '../../../data/cars';

export const VehicleDrawer: React.FC = () => {
  const { cockpitCharging, toggleVehicleDrawer, vehicle, selectCar } = useChargeFlowStore();
  const { isVehicleDrawerOpen, batteryTempC } = cockpitCharging;

  if (!isVehicleDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      {/* Drawer backdrop dismiss */}
      <div className="flex-1 cursor-pointer" onClick={toggleVehicleDrawer} />

      {/* Slide-out Drawer Panel */}
      <aside
        className="w-full max-w-md h-full bg-[#0B0F17]/95 border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto backdrop-blur-2xl shadow-2xl animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Digital Twin</span>
              <h2 className="text-xl font-bold text-white font-mono">
                {vehicle.brand ? `${vehicle.brand} ${vehicle.model}` : vehicle.model}
              </h2>
            </div>
            <button
              onClick={toggleVehicleDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-[#0F172A]/70 border border-white/5 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Battery className="w-4 h-4 text-emerald-400" />
                <span>Battery Capacity</span>
              </div>
              <div className="text-xl font-mono font-bold text-white">{vehicle.capacityKwh || 60} kWh</div>
              <div className="text-[10px] font-mono text-slate-500">Lithium-NMC 800V</div>
            </div>

            <div className="bg-[#0F172A]/70 border border-white/5 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Max Range</span>
              </div>
              <div className="text-xl font-mono font-bold text-white">{vehicle.maxRangeKm || 420} km</div>
              <div className="text-[10px] font-mono text-slate-500">WLTP Rated</div>
            </div>

            <div className="bg-[#0F172A]/70 border border-white/5 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Chassis Temp</span>
              </div>
              <div className="text-xl font-mono font-bold text-white">
                {batteryTempC.toFixed(1)}°C
              </div>
              <div className="text-[10px] font-mono text-emerald-400">Thermal Guard OK</div>
            </div>

            <div className="bg-[#0F172A]/70 border border-white/5 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Battery className="w-4 h-4 text-amber-400" />
                <span>Pad Efficiency</span>
              </div>
              <div className="text-xl font-mono font-bold text-white">93.8%</div>
              <div className="text-[10px] font-mono text-slate-500">Resonant Inductive</div>
            </div>
          </div>

          {/* Vehicle Switcher */}
          <div className="mt-8">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Select 3D GLB Model</h3>
            <div className="space-y-2.5">
              {AVAILABLE_CARS.map((car: CarSpec) => {
                const isSelected = vehicle.id === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => selectCar(car)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border font-mono text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                        : 'bg-[#0F172A]/50 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{car.name}</div>
                      <div className="text-xs text-slate-500">
                        {car.rangeKm} km • {car.capacityKwh} kWh
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 text-[11px] font-mono text-slate-500">
          Selected vehicle 3D GLB model is dynamically mounted and illuminated on the inductive charging base.
        </div>
      </aside>
    </div>
  );
};
