import React, { useState, useEffect } from "react";
import { useChargeFlowStore } from "../../../store/useChargeFlowStore";
import { getUserActiveReservation } from "../../../data/db";
import { useTranslation } from "../../../localization/useTranslation";
import { AheStation3DStage } from "./AheStation3DStage";
import { AheBatteryHUD } from "./AheBatteryHUD";
import { AheVehicleSelector } from "./AheVehicleSelector";
import { AheCameraControls } from "./AheCameraControls";
import { AheSessionModal } from "./AheSessionModal";
import { 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  KeyRound, 
  Timer, 
  ShieldCheck, 
  X, 
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

  // 3D Camera navigation state
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
    if (activeReservation?.authCode) {
      setPinInput(activeReservation.authCode);
      setPinError(null);
      submitPin(activeReservation.authCode);
    }
  };

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

  const handleStart = () => {
    if (isCharging) return;
    const activeRes = reservation || (user?.id ? getUserActiveReservation(user.id) : null);
    if (!activeRes) {
      setUnauthorizedModalOpen(true, 'Bay 03', 'Addis EV Hub (Bole)');
      return;
    }
    setPinInput('');
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const handleStop = () => {
    setStopChargingConfirmOpen(true);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.35, +(prev + 0.1).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.85, +(prev - 0.1).toFixed(2)));
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setAutoRotate(false);
    setActiveAngleIndex(0);
  };

  const calculatedCostEtb = energyDeliveredKwh * 19.50 + (energyDeliveredKwh > 0 ? 4.50 : 0);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none font-sans transition-colors duration-300 ${
      isCream ? "bg-[#FAF7F2] text-slate-900" : "bg-[#070B12] text-slate-100"
    }`}>
      {/* 1. 3D WEBGL HERO STAGE (Grounded Architectural Floor + Realistic Vehicle) */}
      <AheStation3DStage
        isCharging={isCharging}
        autoRotate={autoRotate}
        zoom={zoom}
        activeAngleIndex={activeAngleIndex}
        batterySoc={batterySoc}
        onUserInteraction={() => setAutoRotate(false)}
      />

      {/* 2. TOP CHARGING STATUS CARD (Apple Vision Pro Glass HUD) */}
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

      {/* 3. UPPER-RIGHT CAMERA CONTROLS (+ / - / ↻) */}
      <AheCameraControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetCamera}
      />

      {/* 4. UNIFIED BOTTOM CONTROL DOCK (Vehicle Carousel + Live Colors + Start/Stop Action) */}
      <AheVehicleSelector
        isCharging={isCharging}
        onStartCharging={handleStart}
        onStopCharging={handleStop}
      />

      {/* 5. PREREQUISITE WARNING CARD (Shown only if no active session or reservation) */}
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

      {/* 6. SESSION SUMMARY MODAL */}
      <AheSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        energyKwh={energyDeliveredKwh}
        costEtb={calculatedCostEtb}
        durationMinutes={Math.max(1, Math.floor(elapsedSeconds / 60))}
        batterySoc={batterySoc}
      />

      {/* 7. STOP CHARGING CONFIRMATION DIALOG */}
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

      {/* 8. 4-DIGIT DISPENSER UNLOCK PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className={`relative border rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(45,212,191,0.25)] text-center ${
            isPinShake ? 'animate-shake' : ''
          } ${
            isCream 
              ? "bg-[#FAF7F2] border-teal-600/30 text-slate-900" 
              : "bg-[#090F1C] border-teal-400/40 text-white"
          }`}>
            <button 
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-400/40 flex items-center justify-center mx-auto text-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.35)]">
              <KeyRound className="w-7 h-7 stroke-[2.5]" />
            </div>

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

            {pinError && (
              <div className="text-rose-400 text-xs font-semibold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 animate-in fade-in flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

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
                className="h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-400 font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AheChargingCockpit;
