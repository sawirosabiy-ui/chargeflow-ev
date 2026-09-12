import React from "react";
import { 
  Zap, 
  MapPin, 
  Calendar, 
  Navigation, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles,
  RotateCw,
  Sliders,
  BatteryCharging
} from "lucide-react";
import { useChargeFlowStore } from "../../store/useChargeFlowStore";
import { Cockpit3DStage } from "../canvas/Cockpit3DStage";
import { VehicleCutout } from "../vehicle/VehicleCutout";
import { useTranslation } from "../../localization/useTranslation";
import { getBatteryVisualState } from "../../utils/batteryVisualState";

export const CockpitView: React.FC = () => {
  const user = useChargeFlowStore((s) => s.user);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const setView = useChargeFlowStore((s) => s.setView);
  const toggleCopilot = useChargeFlowStore((s) => s.toggleCopilot);
  const theme = useChargeFlowStore((s) => s.theme);
  const { t } = useTranslation();

  const batteryVisual = getBatteryVisualState(vehicle.batterySoc || 66);
  const isCream = theme === "cream";

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 select-none min-w-0 font-sans transition-colors duration-300 ${
      isCream ? "bg-[#F7F4EE] text-stone-900" : "bg-[#040711] text-slate-100"
    }`}>
      {/* 1. Main Upper Section: Left (Greeting + 3D Vehicle Stage) & Right (Vehicle Status + Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Columns: Greeting + Open Cinematic 3D Vehicle Stage */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
          {/* Greeting Header */}
          <div className="space-y-0.5">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none drop-shadow-sm ${
              isCream ? "text-stone-900" : "text-white"
            }`}>
              {t.goodEvening}, {user.name ? user.name.split(" ")[0] : "Samuel"}
            </h1>
            <p className={`text-xs sm:text-sm font-medium ${
              isCream ? "text-stone-600" : "text-slate-400"
            }`}>
              {t.connectedAndReady}
            </p>
          </div>

          {/* 3D Vehicle Seamless Stage: Blended directly into environment (One Stage, Not Two) */}
          <div className={`w-full h-[340px] sm:h-[400px] lg:h-[450px] rounded-3xl relative overflow-hidden transition-all duration-300 shadow-2xl ${
            isCream 
              ? "bg-[#EAE4D9] border border-stone-300/70 shadow-stone-300/40" 
              : "bg-[#040711] border border-white/5 shadow-black/80"
          }`}>
            {/* Original Showroom Terrace Photo Backdrop */}
            <div 
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300 ${
                isCream ? "opacity-75" : "opacity-85"
              }`}
              style={{ backgroundImage: `url("/images/showroom-bg.jpg")` }}
            />
            {/* Soft environmental blending gradients */}
            <div className={`absolute inset-0 pointer-events-none ${
              isCream 
                ? "bg-gradient-to-t from-[#EAE4D9] via-transparent to-transparent" 
                : "bg-gradient-to-t from-[#040711] via-transparent to-[#040711]/60"
            }`} />
            <div className={`absolute inset-0 pointer-events-none ${
              isCream
                ? "bg-gradient-to-r from-[#EAE4D9]/40 via-transparent to-[#EAE4D9]/40"
                : "bg-gradient-to-r from-[#040711]/60 via-transparent to-[#040711]/60"
            }`} />

            {/* 3D Interactive Car Layer: Dominant, grounded, and rotatable */}
            <div className="absolute inset-0 z-10 w-full h-full">
              <Cockpit3DStage autoRotate={false} />
            </div>

            {/* Quick Mode Pill in Corner */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold shadow-lg ${
                isCream 
                  ? "bg-white/80 border-stone-300 text-stone-800" 
                  : "bg-slate-950/70 border-white/10 text-slate-200"
              }`}>
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: batteryVisual.color }} 
                />
                <span className="font-mono">{vehicle.batterySoc || 66}%</span>
                <span className="text-slate-500">•</span>
                <span>{t[batteryVisual.labelKey]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Selected Vehicle Specs Card & Quick Actions Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {/* Top Vehicle Status & Specs Card */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 flex-1 flex flex-col justify-between space-y-4 ${
            isCream
              ? "bg-white/90 border-stone-300/80 shadow-lg text-stone-900"
              : "bg-[#090F1C]/85 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-slate-100 backdrop-blur-2xl"
          }`}>
            <div>
              {/* Header: Vehicle Name, Connected Badge & Angled Cutout */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${
                    isCream ? "text-stone-900" : "text-white"
                  }`}>
                    {vehicle.model || "BYD SEAGULL"}
                  </h2>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${batteryVisual.bgBadge}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: batteryVisual.color }} />
                      {vehicle.batterySoc || 66}% SOC
                    </span>
                  </div>
                  <p className={`text-xs font-mono pt-0.5 ${
                    isCream ? "text-stone-500" : "text-slate-400"
                  }`}>
                    Plate: {vehicle.plate || "ET-3-A49281"}
                  </p>
                </div>

                {/* Angled Vehicle Cutout Thumbnail */}
                <VehicleCutout 
                  modelId={vehicle.id} 
                  modelName={vehicle.model} 
                  paintColor={vehicle.paintColor} 
                  className="w-28 sm:w-32 h-16 shrink-0" 
                />
              </div>

              {/* Specs Rows */}
              <div className={`space-y-2.5 pt-4 border-t text-xs ${
                isCream ? "border-stone-200" : "border-white/10"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={isCream ? "text-stone-500" : "text-slate-400"}>{t.batteryStatus}</span>
                  <span className={`font-bold font-mono ${isCream ? "text-stone-900" : "text-white"}`}>
                    {vehicle.capacityKwh || "30.1"} kWh
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isCream ? "text-stone-500" : "text-slate-400"}>{t.estimatedRange}</span>
                  <span className={`font-bold font-mono ${isCream ? "text-stone-900" : "text-white"}`}>
                    {Math.round(((vehicle.batterySoc || 66) / 100) * (vehicle.maxRangeKm || 305))} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isCream ? "text-stone-500" : "text-slate-400"}>Drivetrain</span>
                  <span className={`font-bold font-mono ${isCream ? "text-stone-900" : "text-white"}`}>
                    {vehicle.drive || "FWD"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isCream ? "text-stone-500" : "text-slate-400"}>Status</span>
                  <span className={`font-bold flex items-center gap-1.5 ${batteryVisual.textColor}`}>
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: batteryVisual.color, boxShadow: `0 0 8px ${batteryVisual.color}` }} 
                    />
                    {t[batteryVisual.labelKey]}
                  </span>
                </div>
              </div>
            </div>

            {/* View Full Vehicle Status Link Button */}
            <button
              onClick={() => setView("settings")}
              className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all group shadow-sm ${
                isCream
                  ? "bg-stone-100 hover:bg-stone-200/80 border-stone-300/70 text-stone-800"
                  : "bg-white/[0.04] hover:bg-white/[0.08] border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
              }`}
            >
              <span>{t.settingsTitle}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 space-y-3 ${
            isCream
              ? "bg-white/90 border-stone-300/80 shadow-lg"
              : "bg-[#090F1C]/85 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          }`}>
            <div className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
              isCream ? "text-emerald-700" : "text-[#2DD4BF]"
            }`}>
              {t.quickActions}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* 1. Start Charging */}
              <button
                onClick={() => setView("charging")}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-emerald-500/10 transition-all group text-center"
              >
                <div className="w-10 h-10 rounded-full border border-teal-500/40 bg-teal-500/15 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.25)] group-hover:scale-110 transition-all">
                  <Zap className="w-4 h-4 text-teal-400" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.charging}
                </span>
              </button>

              {/* 2. Find Charging */}
              <button
                onClick={() => setView("find_charge")}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-teal-500/10 transition-all group text-center"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 ${
                  isCream 
                    ? "border-stone-300 bg-stone-100 text-stone-700 group-hover:border-stone-400" 
                    : "border-white/10 bg-white/5 text-slate-300 group-hover:border-white/30 group-hover:text-white"
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.findCharging}
                </span>
              </button>

              {/* 3. My Reservations */}
              <button
                onClick={() => setView("reservation")}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-teal-500/10 transition-all group text-center"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 ${
                  isCream 
                    ? "border-stone-300 bg-stone-100 text-stone-700 group-hover:border-stone-400" 
                    : "border-white/10 bg-white/5 text-slate-300 group-hover:border-white/30 group-hover:text-white"
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.reservation}
                </span>
              </button>

              {/* 4. Live Queue */}
              <button
                onClick={() => setView("queue")}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-teal-500/10 transition-all group text-center"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 ${
                  isCream 
                    ? "border-stone-300 bg-stone-100 text-stone-700 group-hover:border-stone-400" 
                    : "border-white/10 bg-white/5 text-slate-300 group-hover:border-white/30 group-hover:text-white"
                }`}>
                  <Navigation className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isCream ? "text-stone-700" : "text-slate-300"}`}>
                  {t.queue}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Row: 3 Feature Cards (Vehicle Status, Station Finder, AI Copilot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: VEHICLE STATUS */}
        <div 
          onClick={() => setView("settings")}
          className={`p-5 rounded-3xl border transition-all duration-300 space-y-3 cursor-pointer group relative overflow-hidden flex flex-col justify-between shadow-lg ${
            isCream
              ? "bg-white/90 border-stone-300/80 hover:border-emerald-600/40"
              : "bg-[#090F1C]/85 border-white/10 hover:border-[#2DD4BF]/40 backdrop-blur-2xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-800" : "text-slate-300"}`}>
              {t.batteryStatus}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="space-y-1.5">
              <h3 className={`text-sm font-bold ${batteryVisual.textColor}`}>
                {t[batteryVisual.labelKey]}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{vehicle.batterySoc || 66}% • {t.doorsClosed}</span>
              </div>
            </div>

            {/* Battery Indicator Graphic */}
            <div className="w-24 h-12 flex items-center justify-center">
              <div 
                className="px-3 py-1 rounded-xl text-xs font-mono font-black border flex items-center gap-1.5"
                style={{
                  color: batteryVisual.color,
                  borderColor: batteryVisual.color,
                  backgroundColor: `${batteryVisual.color}15`,
                }}
              >
                <BatteryCharging className="w-4 h-4" />
                <span>{vehicle.batterySoc || 66}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: STATION FINDER & TRIP */}
        <div 
          onClick={() => setView("find_charge")}
          className={`p-5 rounded-3xl border transition-all duration-300 space-y-3 cursor-pointer group relative overflow-hidden flex flex-col justify-between shadow-lg ${
            isCream
              ? "bg-white/90 border-stone-300/80 hover:border-emerald-600/40"
              : "bg-[#090F1C]/85 border-white/10 hover:border-[#2DD4BF]/40 backdrop-blur-2xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-800" : "text-slate-300"}`}>
              {t.findCharging}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="space-y-1">
              <h3 className={`text-sm font-bold ${isCream ? "text-stone-900" : "text-white"}`}>
                {t.findStationTitle}
              </h3>
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                Addis EV Hub • Bole, Meskel Sq, Kazanchis
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: AI COPILOT */}
        <div 
          onClick={toggleCopilot}
          className={`p-5 rounded-3xl border transition-all duration-300 space-y-3 cursor-pointer group relative overflow-hidden flex flex-col justify-between shadow-lg ${
            isCream
              ? "bg-white/90 border-stone-300/80 hover:border-emerald-600/40"
              : "bg-[#090F1C]/85 border-white/10 hover:border-[#2DD4BF]/40 backdrop-blur-2xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isCream ? "text-stone-800" : "text-slate-300"}`}>
              AI Copilot
            </span>
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="space-y-1">
              <h3 className={`text-sm font-bold ${isCream ? "text-stone-900" : "text-white"}`}>
                {t.aiCopilotHint}
              </h3>
              <p className={`text-xs ${isCream ? "text-stone-500" : "text-slate-400"}`}>
                Smart route, charging tips & telemetry
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400 border border-teal-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitView;
