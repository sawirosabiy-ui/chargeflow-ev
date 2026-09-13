import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Navigation, 
  Activity
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { useTranslation } from '../../localization/useTranslation';
import { VehicleCutout } from '../vehicle/VehicleCutout';

export const QueueView: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const reservation = useChargeFlowStore((s) => s.reservation);
  const setView = useChargeFlowStore((s) => s.setView);
  const startChargingSession = useChargeFlowStore((s) => s.startChargingSession);
  const setReadyToCharge = useChargeFlowStore((s) => s.setReadyToCharge);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const theme = useChargeFlowStore((s) => s.theme);
  const { t } = useTranslation();
  const isCream = theme === 'cream';

  // Live countdown timer (simulating ~12 min wait)
  const [secondsRemaining, setSecondsRemaining] = useState(12 * 60);

  const isReady = reservation?.status === 'READY_TO_CHARGE';

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setReadyToCharge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setReadyToCharge]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `~${minutes} min remaining`;

  const handleStartCharging = () => {
    startChargingSession();
    setView('charging');
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none font-sans transition-colors duration-300 ${isCream ? "bg-[#FAF8F5] text-stone-900" : "bg-[#070B12] text-slate-100"}`}>

      {/* 0. PROMINENT "YOUR TURN" BANNER WHEN AUTHORIZED */}
      {isReady && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/10 border-2 border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-top-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[11px] font-black uppercase tracking-wider">
                  ✓ YOUR TURN
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                  {reservation?.bayNumber || 'Bay 02'} is ready for your vehicle
                </span>
              </div>
              <p className={`text-xs ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                Please connect your vehicle within 5 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() =>
                openDirectionsModal({
                  name: reservation?.stationName || 'Addis EV Hub',
                  address: 'Bole Road, Addis Ababa',
                  distanceKm: 0.8,
                  etaMin: 2,
                  baysAvailable: reservation?.bayNumber || 'Bay 02',
                  powerKw: 120,
                })
              }
              className={`flex-1 md:flex-initial py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isCream
                  ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                  : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
              }`}
            >
              <Navigation className="w-4 h-4 text-teal-400" />
              <span>GET DIRECTIONS TO BAY</span>
            </button>

            <button
              onClick={handleStartCharging}
              className="flex-1 md:flex-initial py-3 px-5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>START CHARGING</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isCream ? "text-stone-900" : "text-white"}`}>
              {t.queueTitle}
            </h1>
            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold flex items-center gap-1.5 ${
              isReady
                ? "bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.4)]"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-teal-400 animate-ping" : "bg-amber-400"}`}></span>
              {isReady ? "READY TO CHARGE" : "QUEUED (#2 IN LINE)"}
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isCream ? "text-stone-500" : "text-slate-400"}`}>
            {t.queueSubtitle}
          </p>
        </div>

        {/* Station Pill Header */}
        <div className={`p-3 sm:px-4 sm:py-2.5 rounded-2xl border flex items-center gap-3 ${isCream ? "bg-white border-stone-200 shadow-sm text-stone-900" : "bg-[#0E131F] border-white/5 text-white"}`}>
          <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>
              {reservation?.stationName || t.stationHub}
            </div>
            <div className={`text-[10px] font-mono ${isCream ? "text-stone-500" : "text-slate-400"}`}>
              DC Fast Charging • 120 kW • Bay {reservation?.bayNumber || '02'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Queue Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Queue Overview & Queue Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Queue 3-Car Progression Cards */}
          <div className="space-y-3">
            <div className={`text-[11px] font-mono font-bold tracking-widest uppercase ${isCream ? "text-stone-500" : "text-slate-400"}`}>
              {t.queueOverview}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Car #01 Currently Charging */}
              <div className={`p-4 rounded-3xl border space-y-3 ${isCream ? "bg-white border-stone-200 shadow-sm" : "bg-[#0E131F] border-white/5"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isCream ? "text-stone-500" : "text-slate-400"}`}>#01</span>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wide">{t.currentlyCharging}</span>
                </div>
                {/* Vehicle Thumbnail */}
                <div className="h-16 flex items-center justify-center">
                  <VehicleCutout modelId="tesla-model-y" modelName="Tesla Model Y" paintColor="#64748B" className="w-28 h-16 shrink-0 opacity-80" />
                </div>
                <div className="text-center font-mono">
                  <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>91% • 86 kW</div>
                  <div className={`text-[10px] mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>~8 min remaining</div>
                </div>
              </div>

              {/* Car #02 YOU (Active Highlighted Border - Exact Selected Vehicle Cutout) */}
              <div className={`p-4 rounded-3xl border border-[#2DD4BF] space-y-3 shadow-[0_0_20px_rgba(45,212,191,0.15)] ring-1 ring-[#2DD4BF]/40 ${isCream ? "bg-white" : "bg-[#0E131F]"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#2DD4BF]">#02 {user.name.split(" ")[0]}</span>
                  <span className="text-[9px] font-bold text-[#2DD4BF] uppercase tracking-wide">{t.yourVehicleBadge}</span>
                </div>
                {/* Vehicle Thumbnail */}
                <div className="h-16 flex items-center justify-center">
                  <VehicleCutout 
                    modelId={vehicle.id} 
                    modelName={vehicle.model} 
                    paintColor={vehicle.paintColor} 
                    className="w-28 h-16 shrink-0" 
                  />
                </div>
                <div className="text-center font-mono">
                  <div className="text-xs font-bold text-emerald-500">{vehicle.batterySoc}% • {t.reserved}</div>
                  <div className="text-[10px] text-[#2DD4BF] font-semibold mt-0.5">Est. start 14:42</div>
                </div>
              </div>

              {/* Car #03 Next in Queue */}
              <div className={`p-4 rounded-3xl border space-y-3 ${isCream ? "bg-white border-stone-200 shadow-sm" : "bg-[#0E131F] border-white/5"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isCream ? "text-stone-500" : "text-slate-400"}`}>#03</span>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">{t.nextInQueue}</span>
                </div>
                {/* Vehicle Thumbnail */}
                <div className="h-16 flex items-center justify-center">
                  <VehicleCutout modelId="byd-atto-3" modelName="BYD Atto 3" paintColor="#CBD5E1" className="w-28 h-16 shrink-0 opacity-80" />
                </div>
                <div className="text-center font-mono">
                  <div className={`text-xs font-bold ${isCream ? "text-stone-900" : "text-white"}`}>54% • Waiting</div>
                  <div className={`text-[10px] mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>Waiting for your turn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Queue Details Table */}
          <div className={`p-5 rounded-3xl border space-y-4 shadow-xl ${isCream ? "bg-white border-stone-200" : "bg-[#0E131F] border-white/10"}`}>
            <div className={`text-[11px] font-mono font-bold tracking-widest uppercase ${isCream ? "text-stone-500" : "text-slate-400"}`}>
              {t.liveQueueDetails}
            </div>

            {/* Mobile View: Stacked Queue Cards (< md) */}
            <div className="md:hidden space-y-3">
              {/* Item #1 */}
              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                isCream ? 'bg-stone-50/80 border-stone-200' : 'bg-white/[0.02] border-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                      #1
                    </span>
                    <div>
                      <div className={`text-xs font-bold font-sans ${isCream ? 'text-stone-900' : 'text-white'}`}>
                        Vehicle #01
                      </div>
                      <div className="text-[10px] font-mono opacity-50">(Anonymous)</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold">
                    {t.chargingTitle}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="opacity-60">{t.batteryLabel}</span>
                    <span className="font-bold text-cyan-400">91%</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                    <div className="bg-cyan-400 h-full rounded-full w-[91%]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                  <div>
                    <div className="opacity-50">{t.powerLabel}</div>
                    <div className={`font-bold mt-0.5 ${isCream ? 'text-stone-800' : 'text-slate-200'}`}>86 kW</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estTimeLabel}</div>
                    <div className={`font-bold mt-0.5 ${isCream ? 'text-stone-800' : 'text-slate-200'}`}>~8 min</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estStartLabel}</div>
                    <div className="opacity-50 mt-0.5">—</div>
                  </div>
                </div>
              </div>

              {/* Item #2: YOU */}
              <div className={`p-3.5 rounded-2xl border border-[#2DD4BF]/50 space-y-2.5 shadow-[0_0_15px_rgba(45,212,191,0.1)] ${
                isCream ? 'bg-[#2DD4BF]/10' : 'bg-[#2DD4BF]/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-mono font-bold flex items-center justify-center">
                      #2
                    </span>
                    <div>
                      <div className="text-xs font-black font-sans text-[#2DD4BF] uppercase">
                        {vehicle.model}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-500 font-semibold">
                        {t.yourVehicleBadge}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    {t.reserved}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="opacity-60">{t.batteryLabel}</span>
                    <span className="font-bold text-emerald-400">{vehicle.batterySoc}%</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${vehicle.batterySoc}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2DD4BF]/20 text-[10px] font-mono">
                  <div>
                    <div className="opacity-50">{t.powerLabel}</div>
                    <div className="font-bold mt-0.5 opacity-50">—</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estTimeLabel}</div>
                    <div className="font-bold mt-0.5 text-[#2DD4BF]">~12 min</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estStartLabel}</div>
                    <div className="font-bold mt-0.5 text-emerald-400">14:42</div>
                  </div>
                </div>
              </div>

              {/* Item #3 */}
              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                isCream ? 'bg-stone-50/80 border-stone-200' : 'bg-white/[0.02] border-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-mono font-bold flex items-center justify-center">
                      #3
                    </span>
                    <div>
                      <div className={`text-xs font-bold font-sans ${isCream ? 'text-stone-900' : 'text-white'}`}>
                        Vehicle #03
                      </div>
                      <div className="text-[10px] font-mono opacity-50">(Anonymous)</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold">
                    Waiting
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="opacity-60">{t.batteryLabel}</span>
                    <span className="font-bold text-amber-400">54%</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                    <div className="bg-amber-400 h-full rounded-full w-[54%]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                  <div>
                    <div className="opacity-50">{t.powerLabel}</div>
                    <div className="opacity-50 mt-0.5">—</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estTimeLabel}</div>
                    <div className="opacity-50 mt-0.5">—</div>
                  </div>
                  <div>
                    <div className="opacity-50">{t.estStartLabel}</div>
                    <div className={`font-bold mt-0.5 ${isCream ? 'text-stone-800' : 'text-slate-200'}`}>After you</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop View: Full Enterprise Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className={`border-b text-[10px] uppercase ${isCream ? "border-stone-200 text-stone-500" : "border-white/5 text-slate-500"}`}>
                    <th className="pb-3 font-normal">#</th>
                    <th className="pb-3 font-normal">{t.vehicleLabel}</th>
                    <th className="pb-3 font-normal">{t.statusLabel}</th>
                    <th className="pb-3 font-normal">{t.batteryLabel}</th>
                    <th className="pb-3 font-normal">{t.powerLabel}</th>
                    <th className="pb-3 font-normal">{t.estTimeLabel}</th>
                    <th className="pb-3 font-normal">{t.estStartLabel}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isCream ? "divide-stone-100" : "divide-white/5"}`}>
                  {/* Row 1 */}
                  <tr className={isCream ? "text-stone-700" : "text-slate-300"}>
                    <td className="py-3.5 font-bold">1</td>
                    <td className="py-3.5">
                      <div className={`font-sans font-bold ${isCream ? "text-stone-900" : "text-white"}`}>Vehicle #01</div>
                      <div className={`text-[10px] font-mono ${isCream ? "text-stone-400" : "text-slate-500"}`}>(Anonymous)</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-bold">{t.chargingTitle}</span>
                    </td>
                    <td className="py-3.5">
                      <div className={`font-bold ${isCream ? "text-stone-900" : "text-white"}`}>91%</div>
                      <div className={`w-16 h-1 rounded-full mt-1 ${isCream ? "bg-stone-200" : "bg-slate-800"}`}>
                        <div className="bg-cyan-400 h-full rounded-full w-[91%]"></div>
                      </div>
                    </td>
                    <td className={`py-3.5 ${isCream ? "text-stone-900" : "text-white"}`}>86 kW</td>
                    <td className={`py-3.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>~8 min remaining</td>
                    <td className={`py-3.5 ${isCream ? "text-stone-400" : "text-slate-500"}`}>—</td>
                  </tr>

                  {/* Row 2: YOU */}
                  <tr className={`font-bold ${isCream ? "bg-[#2DD4BF]/10 text-stone-900" : "bg-[#2DD4BF]/5 text-white"}`}>
                    <td className="py-3.5 font-black text-[#2DD4BF]">2</td>
                    <td className="py-3.5">
                      <div className="font-sans font-black text-[#2DD4BF] uppercase">{vehicle.model}</div>
                      <div className="text-[10px] text-emerald-500 font-mono">{t.yourVehicleBadge}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-bold border border-emerald-500/30">{t.reserved}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-emerald-500">{vehicle.batterySoc}%</div>
                      <div className={`w-16 h-1 rounded-full mt-1 ${isCream ? "bg-stone-200" : "bg-slate-800"}`}>
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${vehicle.batterySoc}%` }}></div>
                      </div>
                    </td>
                    <td className={`py-3.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>—</td>
                    <td className="py-3.5 text-[#2DD4BF]">~12 min remaining</td>
                    <td className="py-3.5 text-emerald-500 font-bold">14:42</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className={isCream ? "text-stone-700" : "text-slate-300"}>
                    <td className="py-3.5 font-bold">3</td>
                    <td className="py-3.5">
                      <div className={`font-sans font-bold ${isCream ? "text-stone-900" : "text-white"}`}>Vehicle #03</div>
                      <div className={`text-[10px] font-mono ${isCream ? "text-stone-400" : "text-slate-500"}`}>(Anonymous)</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">Waiting</span>
                    </td>
                    <td className="py-3.5">
                      <div className={`font-bold ${isCream ? "text-stone-900" : "text-white"}`}>54%</div>
                      <div className={`w-16 h-1 rounded-full mt-1 ${isCream ? "bg-stone-200" : "bg-slate-800"}`}>
                        <div className="bg-amber-400 h-full rounded-full w-[54%]"></div>
                      </div>
                    </td>
                    <td className={`py-3.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>—</td>
                    <td className={`py-3.5 ${isCream ? "text-stone-400" : "text-slate-500"}`}>—</td>
                    <td className={`py-3.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>After you</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`flex items-center gap-2 text-[10px] pt-2 border-t ${isCream ? "border-stone-200 text-stone-500" : "border-white/5 text-slate-400"}`}>
              <Activity className="w-3.5 h-3.5 text-[#2DD4BF] animate-pulse" />
              <span>Live updates • Queue status is refreshing automatically</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Your Reservation Summary Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-2xl space-y-5 ${isCream ? "bg-white border-stone-200" : "bg-[#0E131F] border-white/10"}`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isCream ? "border-stone-200" : "border-white/5"}`}>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#2DD4BF] uppercase">
                {t.yourReservation}
              </span>
              <Calendar className="w-4 h-4 text-[#2DD4BF]" />
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                <div>
                  <div className={`font-bold font-sans text-sm ${isCream ? "text-stone-900" : "text-white"}`}>{reservation?.stationName || t.stationHub}</div>
                  <div className={`text-[11px] mt-0.5 ${isCream ? "text-stone-500" : "text-slate-400"}`}>Bole Road, Addis Ababa</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#2DD4BF]" />
                <span className={isCream ? "text-stone-700" : "text-slate-300"}>{reservation?.bayNumber || 'Bay 03'} • DC Fast • 120 kW</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#2DD4BF]" />
                <span className={isCream ? "text-stone-700" : "text-slate-300"}>Today 14:30 – 15:00</span>
              </div>

              {/* Confirmed Badge */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-500 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.resConfirmed}</span>
              </div>

              <div className={`flex items-center gap-2 ${isCream ? "text-stone-600" : "text-slate-400"}`}>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.arrivalDeadlineLabel}: <strong className={isCream ? "text-stone-900" : "text-white"}>14:45</strong></span>
              </div>
            </div>

            {/* CTAs with Strict Ready-to-Charge Lifecycle */}
            <div className="space-y-2.5 pt-2">
              {isReady ? (
                <button
                  onClick={handleStartCharging}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.01] cursor-pointer animate-pulse"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>START CHARGING</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3.5 rounded-2xl bg-slate-800/80 border border-white/5 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Waiting for Bay — #2 in Line</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReadyToCharge()}
                    className="w-full py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-mono text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-teal-400"
                    title="Simulate earlier vehicle finishing and vacating bay"
                  >
                    <Zap className="w-3 h-3 text-teal-400" />
                    <span>Simulate Bay Available (Ready to Charge)</span>
                  </button>
                </div>
              )}

              <button
                onClick={() =>
                  openDirectionsModal({
                    name: reservation?.stationName || 'Addis EV Hub',
                    address: 'Bole Road, Addis Ababa',
                    distanceKm: 0.8,
                    etaMin: 2,
                    baysAvailable: reservation?.bayNumber || 'Bay 02',
                    powerKw: 120,
                  })
                }
                className={`w-full py-3 rounded-2xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${isCream ? "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800" : "bg-[#131A29] hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white"}`}
              >
                <Navigation className="w-4 h-4 text-teal-400" />
                <span>GET DIRECTIONS</span>
              </button>
            </div>
          </div>

          {/* 3 Status Info Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className={`p-2 sm:p-3 rounded-2xl border space-y-0.5 sm:space-y-1 ${isCream ? "bg-white border-stone-200 shadow-sm" : "bg-[#0E131F] border-white/5"}`}>
              <div className={`text-[10px] sm:text-xs font-bold leading-tight ${isCream ? "text-stone-900" : "text-white"}`}>1 CHARGING</div>
              <div className={`text-[8px] sm:text-[10px] font-mono leading-tight ${isCream ? "text-stone-500" : "text-slate-400"}`}>~8m to slot</div>
            </div>

            <div className={`p-2 sm:p-3 rounded-2xl border border-[#2DD4BF]/30 space-y-0.5 sm:space-y-1 ${isCream ? "bg-white shadow-sm" : "bg-[#0E131F]"}`}>
              <div className="text-[10px] sm:text-xs font-bold text-[#2DD4BF] leading-tight">{t.youAreNext}</div>
              <div className={`text-[8px] sm:text-[10px] font-mono leading-tight ${isCream ? "text-stone-500" : "text-slate-400"}`}>In ~12 min</div>
            </div>

            <div className={`p-2 sm:p-3 rounded-2xl border space-y-0.5 sm:space-y-1 ${isCream ? "bg-white border-stone-200 shadow-sm" : "bg-[#0E131F] border-white/5"}`}>
              <div className={`text-[10px] sm:text-xs font-bold leading-tight ${isCream ? "text-stone-900" : "text-white"}`}>LIVE UPDATES</div>
              <div className={`text-[8px] sm:text-[10px] font-mono leading-tight ${isCream ? "text-stone-500" : "text-slate-400"}`}>Every 5s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueView;
