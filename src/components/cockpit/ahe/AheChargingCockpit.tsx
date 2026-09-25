import React, { useState, useEffect } from "react";
import { useChargeFlowStore } from "../../../store/useChargeFlowStore";
import { getUserActiveReservation } from "../../../data/db";
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
import { 
  Hand, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  Lock, 
  KeyRound, 
  Timer, 
  ShieldCheck, 
  X, 
  Delete, 
  FileText,
  ClipboardPaste
} from "lucide-react";

export const AheChargingCockpit: React.FC = () => {
  const { t } = useTranslation();
  const {
    user,
    vehicle,
    reservation,
    chargingSession,
    startChargingSession,
    verifyAndStartCharging,
    openReceiptModal,
    stopChargingSession,
    confirmReservation,
    cancelActiveReservation,
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
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
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

  // 4-Digit Dispenser Unlock PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinShake, setIsPinShake] = useState(false);
  const [pinRemainingSec, setPinRemainingSec] = useState<number | null>(null);

  const activeReservation = reservation || (user?.id ? getUserActiveReservation(user.id) : null);

  // Sync remaining validity seconds for the 1-hour PIN & clean up on expiry
  useEffect(() => {
    const expiresAt = activeReservation?.reservationEnd || activeReservation?.authCodeExpiresAt;
    if (!expiresAt) return;
    
    if (Date.now() > expiresAt) {
      cancelActiveReservation();
      if (isPinModalOpen) {
        setIsPinModalOpen(false);
      }
      return;
    }

    if (!isPinModalOpen) return;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setPinRemainingSec(remaining);
      if (remaining <= 0) {
        cancelActiveReservation();
        setIsPinModalOpen(false);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isPinModalOpen, activeReservation?.reservationEnd, activeReservation?.authCodeExpiresAt, cancelActiveReservation]);

  const submitPin = (pinToSubmit: string) => {
    const res = verifyAndStartCharging(pinToSubmit);
    if (res.success) {
      playSoundChime("start");
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError(null);
      setView("charging");
    } else {
      setIsPinShake(true);
      setTimeout(() => setIsPinShake(false), 500);
      if (res.error === 'EXPIRED') {
        setPinError('⚠️ This 4-digit PIN has expired (valid for 1 hour from reservation). Please re-reserve.');
      } else if (res.error === 'INVALID_PIN') {
        setPinError('❌ Incorrect PIN. Please check your reservation ticket.');
      } else {
        setPinError('Unable to authorize charging dispenser. Please check your reservation.');
      }
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    setPinError(null);
    const newPin = pinInput + digit;
    setPinInput(newPin);
    if (newPin.length === 4) {
      submitPin(newPin);
    }
  };

  const handlePinDelete = () => {
    setPinError(null);
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinError(null);
    setPinInput('');
  };

  const handlePastePin = async () => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        text = await navigator.clipboard.readText();
      }
      const clean = text.trim().replace(/\D/g, '').slice(0, 4);
      if (clean.length === 4) {
        setPinInput(clean);
        setPinError(null);
        submitPin(clean);
        return;
      }
    } catch {
      // ignore clipboard permission error
    }
    // Fallback: If user has an active reservation PIN
    if (activeReservation?.authCode) {
      setPinInput(activeReservation.authCode);
      setPinError(null);
      submitPin(activeReservation.authCode);
    }
  };

  // Physical keyboard support for 4-digit PIN entry
  useEffect(() => {
    if (!isPinModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        handlePinDelete();
      } else if (e.key === 'Escape') {
        setIsPinModalOpen(false);
      } else if (e.key === 'Enter' && pinInput.length === 4) {
        submitPin(pinInput);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinModalOpen, pinInput]);

  // Handlers for charging session
  const handleStart = () => {
    if (isCharging) return;
    const activeRes = reservation || (user?.id ? getUserActiveReservation(user.id) : null);
    if (!activeRes) {
      setUnauthorizedModalOpen(true, 'Bay 03', 'Addis EV Hub (Bole)');
      return;
    }
    // Prompt for 4-digit dispenser unlock PIN from receipt
    setPinInput('');
    setPinError(null);
    setIsPinModalOpen(true);
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

      {/* 10.4 4-DIGIT DISPENSER UNLOCK PIN MODAL (Enforces 1-hour code validity) */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className={`relative border rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(45,212,191,0.25)] text-center ${
            isPinShake ? 'animate-shake' : ''
          } ${
            isCream 
              ? "bg-[#FAF7F2] border-teal-600/30 text-slate-900" 
              : "bg-[#090F1C] border-teal-400/40 text-white"
          }`}>
            {/* Close Button */}
            <button 
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-400/40 flex items-center justify-center mx-auto text-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.35)]">
              <KeyRound className="w-7 h-7 stroke-[2.5]" />
            </div>

            {/* Header & Subtitle */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Dispenser Authorization
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase">
                ENTER 4-DIGIT PIN
              </h3>
              <p className={`text-xs leading-relaxed ${isCream ? "text-slate-600" : "text-slate-300"}`}>
                Enter the 4-digit code from your reservation receipt to unlock <strong className="text-teal-400">{activeReservation?.bayNumber || 'Bay 03'}</strong>.
              </p>

              {/* 1-Hour Validity Countdown Pill */}
              {pinRemainingSec !== null && (
                <div className="pt-1">
                  {pinRemainingSec > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[11px] font-semibold">
                      <Timer className="w-3 h-3 animate-pulse" />
                      Expires in {Math.floor(pinRemainingSec / 60)}m {(pinRemainingSec % 60).toString().padStart(2, '0')}s
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold">
                      <AlertCircle className="w-3 h-3" />
                      PIN Expired (&gt; 1 hour)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1">
              {[0, 1, 2, 3].map((index) => {
                const char = pinInput[index];
                const isCurrent = pinInput.length === index;
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-mono font-black transition-all ${
                      char
                        ? 'border-teal-400 bg-teal-500/10 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                        : isCurrent
                        ? 'border-teal-400/80 bg-white/5 animate-pulse'
                        : 'border-white/10 bg-white/[0.02] text-slate-500'
                    }`}
                  >
                    {char ? char : isCurrent ? '·' : ''}
                  </div>
                );
              })}
            </div>

            {/* Paste / Auto-fill helper */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handlePastePin}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-400/30 text-teal-400 text-[10px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Paste PIN from clipboard or use active reservation PIN"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>PASTE / AUTO-FILL PIN</span>
              </button>
            </div>

            {/* Error Message */}
            {pinError && (
              <div className="text-rose-400 text-xs font-semibold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 animate-in fade-in flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* High-Tech Virtual Numeric Keypad */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 max-w-[260px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="h-10 rounded-xl bg-white/5 hover:bg-teal-500/20 active:scale-95 border border-white/10 hover:border-teal-400/40 text-white font-mono text-base font-bold transition-all flex items-center justify-center cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinClear}
                className="h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-400 font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                title="Clear"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-10 rounded-xl bg-white/5 hover:bg-teal-500/20 active:scale-95 border border-white/10 hover:border-teal-400/40 text-white font-mono text-base font-bold transition-all flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                className="h-10 rounded-xl bg-white/5 hover:bg-rose-500/20 active:scale-95 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Actions: View Ticket / Start */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                disabled={pinInput.length !== 4}
                onClick={() => submitPin(pinInput)}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  pinInput.length === 4
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.35)] scale-[1.01]'
                    : 'bg-white/10 text-slate-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                UNLOCK &amp; START CHARGING
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  openReceiptModal();
                }}
                className="w-full py-1.5 px-3 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                View Reservation Ticket (Forgot PIN?)
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
