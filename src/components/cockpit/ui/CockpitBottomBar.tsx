import React from 'react';
import { useChargeFlowStore } from '../../../store/useChargeFlowStore';
import { 
  Car, 
  Thermometer, 
  CheckCircle2, 
  Leaf, 
  ArrowRight, 
  Clock, 
  Zap, 
  RotateCw, 
  Settings, 
  Check
} from 'lucide-react';

export const CockpitBottomBar: React.FC = () => {
  const { 
    vehicle, 
    cockpitCharging, 
    toggleVehicleDrawer, 
    setCockpitAutoRotate, 
    setView,
    startCockpitCharging,
    stopCockpitCharging
  } = useChargeFlowStore();

  const { 
    status, 
    battery, 
    energyDeliveredKwh, 
    rangeAddedKm,
    batteryTempC,
    autoRotate
  } = cockpitCharging;

  const isCharging = status === 'charging';
  const isComplete = status === 'complete';
  const batteryPct = Math.round(battery);

  const handleHeroAction = () => {
    if (isCharging) {
      stopCockpitCharging();
    } else {
      startCockpitCharging();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col pointer-events-none select-none">
      {/* ---------------------------------------------------- */}
      {/* 1. FLOATING MID-LOWER ACTION BAR                     */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center justify-between px-8 sm:px-12 mb-4 pointer-events-auto">
        {/* Left Stats: Session & Energy Delivered */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">SESSION</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">48:00</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">ENERGY DELIVERED</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                {energyDeliveredKwh.toFixed(1)} kWh
              </span>
            </div>
          </div>
        </div>

        {/* Center Prominent Glowing Pill CTA */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleHeroAction}
            className={`flex items-center gap-2.5 px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-xl backdrop-blur-xl border ${
              isComplete
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:border-amber-400 hover:bg-amber-900/50'
                : isCharging
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-pulse'
                : 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
            }`}
          >
            {isComplete ? (
              <>
                <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-amber-300 stroke-[3]" />
                </div>
                <span>CHARGE COMPLETE</span>
              </>
            ) : isCharging ? (
              <>
                <Zap className="w-4 h-4 fill-current text-emerald-400 animate-bounce" />
                <span>CHARGING ACTIVE...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>START CHARGING</span>
              </>
            )}
          </button>
        </div>

        {/* Right Controls: Dashboard, Vehicle, 360°, Settings */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <button
            onClick={() => setView('cockpit')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            title="Return to Cockpit Dashboard"
          >
            <Car className="w-4 h-4 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={toggleVehicleDrawer}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Car className="w-4 h-4 text-slate-400" />
            <span>Vehicle</span>
          </button>

          <button
            onClick={() => setCockpitAutoRotate(!autoRotate)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>360°</span>
          </button>

          <button
            onClick={() => setView('settings')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. FOUR-CARD DASHBOARD TELEMETRY TRAY (NO HISTORY)   */}
      {/* ---------------------------------------------------- */}
      <div className="w-full bg-[#070D18]/90 border-t border-white/10 backdrop-blur-2xl px-6 sm:px-8 py-4 pointer-events-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: VEHICLE */}
          <div className="bg-[#0B1322]/80 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between hover:border-white/15 transition-all">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span>VEHICLE</span>
            </div>

            <div className="flex items-center justify-center my-1.5">
              <img
                src={vehicle.image2D || '/images/cars/halo-car.jpg'}
                alt={vehicle.model}
                className="h-12 w-auto object-contain drop-shadow-md rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="text-xs font-bold text-white">{vehicle.model || 'Polestar 4'}</div>
              <div className="text-[10px] text-slate-400">{vehicle.drive || 'Performance AWD'}</div>
              <button
                onClick={toggleVehicleDrawer}
                className="text-[10px] text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Card 2: BATTERY & RANGE */}
          <div className="bg-[#0B1322]/80 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between hover:border-white/15 transition-all">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              BATTERY & RANGE
            </div>

            <div className="flex items-center gap-3 my-1">
              {/* Mini circular progress */}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                {batteryPct}%
              </div>
              <div>
                <div className="text-sm font-bold text-white">{batteryPct}%</div>
                <div className="text-[10px] text-slate-400">
                  {status === 'complete' ? 'Charge Complete' : status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/5">
              <div>
                <span className="text-slate-400 block">Range</span>
                <span className="font-bold text-white">438 km</span>
              </div>
              <div>
                <span className="text-slate-400 block">Efficiency</span>
                <span className="font-bold text-white">18.2 kWh/100 km</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-white/5">
              <span className="inline-flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-blue-400" />
                <span>Battery Temp</span>
              </span>
              <span className="font-mono text-slate-200">{batteryTempC.toFixed(0)}°C</span>
            </div>
          </div>

          {/* Card 3: VEHICLE HEALTH */}
          <div className="bg-[#0B1322]/80 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between hover:border-white/15 transition-all">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              VEHICLE HEALTH
            </div>

            <div className="space-y-1 my-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                  <span>Battery</span>
                </span>
                <span className="text-emerald-400 font-medium">Healthy</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                  <span>Motor</span>
                </span>
                <span className="text-emerald-400 font-medium">Healthy</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                  <span>Thermal System</span>
                </span>
                <span className="text-emerald-400 font-medium">Healthy</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                  <span>Charging System</span>
                </span>
                <span className="text-emerald-400 font-medium">Healthy</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                  <span>Tires</span>
                </span>
                <span className="text-slate-300 font-medium">Normal</span>
              </div>
            </div>
          </div>

          {/* Card 4: STATUS & ACTION */}
          <div className="bg-[#0B1322]/80 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between hover:border-white/15 transition-all">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Fully Charged</div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Your vehicle is ready for the road.
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              <button
                onClick={handleHeroAction}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isCharging ? 'Stop Session' : 'Start New Session'}
              </button>
              <button
                onClick={() => setView('history')}
                className="w-full py-1 px-3 rounded-lg bg-[#0F172A]/80 hover:bg-[#1E293B] text-slate-300 font-medium text-[11px] border border-white/5 transition-colors"
                title="View Charging History"
              >
                View History
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. CLEAN FOOTER BAR                                  */}
        {/* ---------------------------------------------------- */}
        <footer className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">ChargeFlow</span>
            <span className="text-slate-500">•</span>
            <span>More than charging. It's a better tomorrow.</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <Leaf className="w-3.5 h-3.5" />
            <span className="text-slate-300">Clean Energy. A Brighter Future.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CockpitBottomBar;
