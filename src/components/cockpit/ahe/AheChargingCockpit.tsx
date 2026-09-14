import React, { useState, useEffect } from "react";
import { useChargeFlowStore } from "../../../store/useChargeFlowStore";
import { useTranslation } from "../../../localization/useTranslation";
import { AheStation3DStage } from "./AheStation3DStage";
import { AheBatteryHUD } from "./AheBatteryHUD";
import { AheChargingModeCard } from "./AheChargingModeCard";
import { AheVehicleSelector } from "./AheVehicleSelector";
import { AheLiveDataCard } from "./AheLiveDataCard";
import { AheCameraControls } from "./AheCameraControls";
import { AheActionButtons } from "./AheActionButtons";
import { AheSessionModal } from "./AheSessionModal";
import { AheHologramFloor } from "./AheHologramFloor";
import { AICopilotModal } from "../../copilot/AICopilotModal";
import { Hand, AlertCircle, ArrowRight, Zap, Lock } from "lucide-react";

export const AheChargingCockpit: React.FC = () => {
  const { t } = useTranslation();
  const {
    vehicle,
    reservation,
    chargingSession,
    startChargingSession,
    stopChargingSession,
    confirmReservation,
    setView,
    theme,
    unauthorizedModal,
    setUnauthorizedModalOpen,
    isStopChargingConfirmOpen,
    setStopChargingConfirmOpen,
  } = useChargeFlowStore();

  const isCream = theme === "cream";
  const isCharging = chargingSession.status === "CHARGING";
  const hasActiveSession = chargingSession.status === "CHARGING" || chargingSession.status === "PAUSED" || Boolean(reservation);

  // Live interactive telemetry state
  const batterySoc = vehicle.batterySoc || 66;
  const isComplete = batterySoc >= 100;
  const isActivelyCharging = isCharging && !isComplete;
  const powerKw = isActivelyCharging ? chargingSession.powerKw || 149 : 0;
  const voltage = isActivelyCharging ? 402 : 0;
  const energyDeliveredKwh = chargingSession.energyDeliveredKwh || 0;
  const elapsedSeconds = chargingSession.elapsedSeconds || 0;
  const timeRemainingMin = isActivelyCharging ? Math.max(1, Math.round((100 - batterySoc) * 0.35)) : 0;

  // 3D Camera navigation state (controls 3D camera FOV/angle without moving background)
  const [zoom, setZoom] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  // Completion modal state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Web Audio Synthesized Chime for Charging Start / Stop
  const playSoundChime = (type: "start" | "stop") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "start") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio blocked or not supported
    }
  };

  // Handlers for charging session
  const handleStart = () => {
    playSoundChime("start");
    startChargingSession();
    setView("charging");
  };

  const handleStop = () => {
    setStopChargingConfirmOpen(true);
  };

  // Zoom handlers for 3D Camera
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.4, +(prev + 0.1).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.85, +(prev - 0.1).toFixed(2)));
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setAutoRotate(false);
    setActiveAngleIndex(0);
  };

  const handleSelectAngle = (idx: number) => {
    setActiveAngleIndex(idx);
  };

  const calculatedCostEtb = energyDeliveredKwh * 19.50 + (energyDeliveredKwh > 0 ? 4.50 : 0);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none font-sans transition-colors duration-300 ${
      isCream ? "bg-[#FAF7F2] text-slate-900" : "bg-[#070B12] text-slate-100"
    }`}>
      {/* 1. 3D WEBGL STAGE ON ARCHITECTURAL BACKDROP */}
      <AheStation3DStage
        isCharging={isCharging}
        autoRotate={autoRotate}
        zoom={zoom}
        activeAngleIndex={activeAngleIndex}
        batterySoc={batterySoc}
        onUserInteraction={() => setAutoRotate(false)}
      />

      {/* 2. IN-CANVAS HEADER: Bay & Minimal Status Badge (Desktop Only, unified into AheBatteryHUD on mobile) */}
      <div className="hidden sm:flex absolute top-4 inset-x-6 z-20 items-center justify-between pointer-events-none">
        {/* Left: Bay & Minimal Charging Status Badge (No 'wireless' label) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full backdrop-blur-xl shadow-lg border transition-all ${
            isCream 
              ? "bg-[#FAF7F2]/90 border-amber-900/15 text-slate-800"
              : "bg-[#08101E]/85 border-teal-500/30 text-white"
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-wide font-sans truncate max-w-[85px] sm:max-w-none">
              {reservation?.bayNumber || `${t.bayLabel} 03`}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#0D9488] dark:text-teal-300 font-semibold truncate">
              {isCharging ? t.chargingTitle : t.ready} ({Math.round(batterySoc)}%)
            </span>
          </div>
        </div>

        {/* Right: Drag to Rotate Hint */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full backdrop-blur-xl text-xs font-semibold transition-all shadow-lg group cursor-pointer border ${
              isCream
                ? "bg-[#FAF7F2]/90 hover:bg-[#F3EFEA] border-amber-900/15 text-amber-900"
                : "bg-[#08101E]/85 hover:bg-[#0E1B33] border-teal-500/30 text-teal-300"
            }`}
            title="Toggle 360° Car Rotation"
          >
            <Hand className="w-3.5 h-3.5 text-[#2DD4BF] group-hover:rotate-12 transition-transform shrink-0" />
            <span className="tracking-wider uppercase text-[10px] font-bold hidden sm:inline">
              {autoRotate ? t.autoOrbiting : t.dragToRotate}
            </span>
            <span className="tracking-wider uppercase text-[10px] font-bold sm:hidden">
              {autoRotate ? '360°' : 'Rotate'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. PREREQUISITE WARNING CARD (Shown only if no active session or reservation) */}
      {!hasActiveSession && (
        <div className={`absolute top-28 sm:top-24 inset-x-3 sm:inset-x-auto sm:left-6 z-30 pointer-events-auto sm:max-w-sm rounded-2xl p-4 backdrop-blur-xl shadow-2xl border animate-in fade-in slide-in-from-top-3 ${
          isCream
            ? "bg-[#FAF7F2]/95 border-amber-500/40 text-slate-800"
            : "bg-[#08101E]/95 border-amber-500/40 text-slate-100"
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left min-w-0">
              <div className="text-xs font-black uppercase tracking-wider text-amber-500">
                {t.stepPrereqRequired}
              </div>
              <p className={`text-[11px] leading-relaxed ${isCream ? "text-slate-600" : "text-slate-300"}`}>
                {t.stepPrereqDesc}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setView("find_charge")}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  <span>{t.findStationReserveBay}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleStart}
                  className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-[11px] border transition-all cursor-pointer ${
                    isCream
                      ? "bg-black/5 hover:bg-black/10 text-slate-700 border-black/10"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                  }`}
                >
                  <Zap className="w-3 h-3 text-teal-500" />
                  <span>{t.instantDemoSession}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOP-LEFT FLOATING BATTERY & POWER HUD CARD (Unified Sleek Bar on Mobile, Vertical Card on Desktop) */}
      <AheBatteryHUD
        batterySoc={batterySoc}
        powerKw={powerKw}
        voltage={voltage}
        timeRemainingMin={timeRemainingMin}
        isCharging={isCharging}
        bayNumber={reservation?.bayNumber || `${t.bayLabel} 03`}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
      />

      {/* 5. MID-LEFT CHARGING MODE & BATTERY STATUS CARD */}
      <div className="hidden md:block pointer-events-none">
        <AheChargingModeCard batterySoc={batterySoc} isCharging={isCharging} />
      </div>

      {/* 6. BOTTOM-LEFT VEHICLE SWITCHER & LOCATION BADGE */}
      <AheVehicleSelector />

      {/* 7. MID-RIGHT LIVE DATA TELEMETRY CARD */}
      <div className="hidden lg:block pointer-events-none">
        <AheLiveDataCard
          powerKw={powerKw}
          voltage={voltage}
          timeRemainingMin={timeRemainingMin}
          isCharging={isCharging}
        />
      </div>

      {/* 7.5 HOLOGRAPHIC ENERGY FLOOR PROJECTION (Grounds stage to wet terrace tiles) */}
      <AheHologramFloor batterySoc={batterySoc} isCharging={isCharging} />

      {/* 8. BOTTOM-CENTER CAMERA & ROTATION CONTROLS PILL */}
      <AheCameraControls
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetCamera}
        activeDotIndex={activeAngleIndex}
        onSelectDot={handleSelectAngle}
      />

      {/* 9. BOTTOM-RIGHT ACTION BUTTONS: START & STOP */}
      <AheActionButtons
        isCharging={isCharging}
        onStartCharging={handleStart}
        onStopCharging={handleStop}
      />

      {/* 10. SESSION SUMMARY MODAL (Routes to Step 08 History) */}
      <AheSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        energyKwh={energyDeliveredKwh}
        costEtb={calculatedCostEtb}
        durationMinutes={Math.max(1, Math.floor(elapsedSeconds / 60))}
        batterySoc={batterySoc}
      />

      {/* 10.25 STOP CHARGING CONFIRMATION DIALOG */}
      {isStopChargingConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className={`border rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl text-center ${
            isCream
              ? "bg-[#FAF7F2] border-amber-900/15 text-slate-900"
              : "bg-[#0B1220] border-amber-500/30 text-white"
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <AlertCircle className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight uppercase">
                STOP CHARGING?
              </h3>
              <p className={`text-xs leading-relaxed ${isCream ? "text-slate-600" : "text-slate-300"}`}>
                Are you sure you want to stop charging and disconnect your vehicle? Your current charging session will end.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setStopChargingConfirmOpen(false)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  isCream
                    ? "bg-black/5 hover:bg-black/10 text-slate-700 border-black/10"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10"
                }`}
              >
                CANCEL
              </button>

              <button
                onClick={() => {
                  setStopChargingConfirmOpen(false);
                  playSoundChime("stop");
                  stopChargingSession();
                  setIsSessionModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                YES, STOP CHARGING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10.5 CHARGING AUTHORIZATION BLOCKED MODAL */}
      {unauthorizedModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className={`border rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl text-center ${
            isCream 
              ? "bg-[#FAF7F2] border-amber-900/15 text-slate-900" 
              : "bg-[#0B1220] border-rose-500/30 text-white"
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Charging Not Authorized
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase">
                CHARGING NOT AUTHORIZED
              </h3>
              <p className={`text-xs leading-relaxed ${isCream ? "text-slate-600" : "text-slate-300"}`}>
                You need an active reservation before you can start charging. Please find a charger and complete the reservation process first.
              </p>
              <div className="pt-1 text-xs font-mono font-bold text-teal-400">
                Reservation fee: 50 ETB
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setUnauthorizedModalOpen(false);
                  setView('find_charge');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                FIND A CHARGER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. AI COPILOT CHATBOT ASSISTANT */}
      <AICopilotModal />
    </div>
  );
};

export default AheChargingCockpit;
