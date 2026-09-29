import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CheckCircle2, 
  X, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Navigation, 
  RotateCcw,
  Sparkles,
  Car,
  Clock,
  ExternalLink,
  Layers,
  Volume2,
  VolumeX,
  KeyRound,
  Timer,
  Copy,
  Check,
  Users,
  Printer,
  FileCheck
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { generateQRCodeSVG } from '../../utils/qrCode';
import { createThermalPrinterSound, playLuxuryConfirmationChime } from '../../utils/audio';

export const ReservationReceiptModal: React.FC = () => {
  const receiptModal = useChargeFlowStore((s) => s.receiptModal);
  const closeReceiptModal = useChargeFlowStore((s) => s.closeReceiptModal);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const setView = useChargeFlowStore((s) => s.setView);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const reservation = useChargeFlowStore((s) => s.reservation);

  // Animation Phase: 'feeding' (active mechanical line feed) -> 'settling' -> 'confirmed' (settled with checkmark & actions)
  const [animationPhase, setAnimationPhase] = useState<'feeding' | 'settling' | 'confirmed'>('feeding');
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const soundControllerRef = useRef<{ stop: () => void } | null>(null);

  const shouldAnimate = receiptModal?.initialAnimation ?? true;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      soundControllerRef.current?.stop();
    };
  }, []);

  const startPrinterSimulation = () => {
    soundControllerRef.current?.stop();
    soundControllerRef.current = createThermalPrinterSound(isMuted);
  };

  useEffect(() => {
    if (!receiptModal?.isOpen) return;

    if (!shouldAnimate || prefersReducedMotion) {
      setAnimationPhase('confirmed');
      return;
    }

    setAnimationPhase('feeding');
    setHasPlayedChime(false);

    // Start authentic receipt printer sound
    startPrinterSimulation();

    // Slower, deliberate mechanical feed phase (0 - 3200ms)
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settling');
    }, 3200);

    // Final Confirmed State with Checkmark & Controls (3450ms)
    const confirmedTimer = setTimeout(() => {
      setAnimationPhase('confirmed');
      if (!hasPlayedChime) {
        playLuxuryConfirmationChime(isMuted);
        setHasPlayedChime(true);
      }
    }, 3450);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(confirmedTimer);
      soundControllerRef.current?.stop();
    };
  }, [receiptModal?.isOpen, shouldAnimate, prefersReducedMotion]);

  const handleSkipAnimation = () => {
    soundControllerRef.current?.stop();
    setAnimationPhase('confirmed');
    if (!hasPlayedChime) {
      playLuxuryConfirmationChime(isMuted);
      setHasPlayedChime(true);
    }
  };

  const handleReplayAnimation = () => {
    soundControllerRef.current?.stop();
    setAnimationPhase('feeding');
    setHasPlayedChime(false);
    startPrinterSimulation();
    setTimeout(() => setAnimationPhase('settling'), 3200);
    setTimeout(() => {
      setAnimationPhase('confirmed');
      playLuxuryConfirmationChime(isMuted);
      setHasPlayedChime(true);
    }, 3450);
  };

  const handleClose = () => {
    soundControllerRef.current?.stop();
    closeReceiptModal();
  };

  // Bulletproof fallback coercions for all receipt properties
  const safeReceiptNo = String(receiptModal?.receiptNo || `CF-${Date.now().toString().slice(-8)}`);
  const safeDate = String(receiptModal?.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
  const safeStationName = String(receiptModal?.stationName || 'Addis EV Hub (Bole)');
  const safeBayNumber = String(receiptModal?.bayNumber || 'Bay 03');
  const safePowerKw = Number(receiptModal?.powerKw || 120);
  const safeAmountEtb = Number(typeof receiptModal?.amountEtb === 'number' ? receiptModal.amountEtb : 50.0);
  const safeStatus = String(receiptModal?.status || 'PAID');
  const activeResId = String(receiptModal?.reservationId || reservation?.id || `RES-${safeReceiptNo.slice(-4)}`);
  const activeVehicleModel = String(receiptModal?.vehicleModel || vehicle?.model || 'BYD Seal AWD');
  const activePlate = String(receiptModal?.vehiclePlate || vehicle?.plate || 'ET-3-A48291');
  const activeSlot = String(receiptModal?.slotTime || reservation?.slotTime || '18:00 - 18:30');
  const activeQueue = receiptModal?.queuePosition ?? reservation?.queuePosition;
  const estimatedCost = Number(receiptModal?.estimatedEnergyCostEtb || 360);
  const activePin = String(receiptModal?.authCode || reservation?.authCode || '8492');
  const activeExpiresAt = Number(receiptModal?.authCodeExpiresAt || reservation?.authCodeExpiresAt || (Date.now() + 60 * 60 * 1000));
  
  const expiresTimeString = !isNaN(new Date(activeExpiresAt).getTime())
    ? new Date(activeExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '1 Hour';

  const handleCopyPin = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(activePin);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = activePin;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } catch (err) {
      console.error('Copy PIN failed:', err);
    }
  };

  const qrCodeUrl = useMemo(() => {
    return `https://chargeflow-ev.com/v?r=${encodeURIComponent(activeResId)}&p=${encodeURIComponent(activePin)}`;
  }, [activeResId, activePin]);

  const qrSvgString = useMemo(() => {
    try {
      return generateQRCodeSVG(qrCodeUrl, {
        padding: 4,
        fgColor: '#090F1C',
        bgColor: '#FFFFFF',
        size: 140,
      });
    } catch (e) {
      console.error('QR generation failed:', e);
      return '';
    }
  }, [qrCodeUrl]);

  if (!receiptModal?.isOpen) return null;

  const handleGoToLiveSession = () => {
    handleClose();
    setView('charging');
  };

  const handleGoToLiveQueue = () => {
    handleClose();
    setView('queue');
  };

  const handleBackToCockpit = () => {
    handleClose();
    setView('cockpit');
  };

  const handleGetDirections = () => {
    handleClose();
    openDirectionsModal({
      name: safeStationName,
      address: 'Bole Road, Near Bole Medhanialem, Addis Ababa',
      distanceKm: 2.4,
      etaMin: 7,
      baysAvailable: '4 / 6 bays available',
      powerKw: safePowerKw,
    });
  };

  const isComplete = animationPhase === 'confirmed';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto my-auto rounded-3xl border border-teal-500/40 bg-[#070B14] text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Subtle Background Radial Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="relative px-4 sm:px-5 pt-3.5 pb-2 flex items-center justify-between border-b border-white/10 shrink-0 z-30 bg-[#070B14]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-300 uppercase">
              CHARGEFLOW POS DISPENSER
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute printer sound' : 'Mute printer sound'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
            </button>
            {isComplete && (
              <button
                onClick={handleReplayAnimation}
                title="Replay Print Simulation"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {!isComplete && (
              <button
                onClick={handleSkipAnimation}
                className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 transition-colors"
              >
                Skip ➔
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hardware Printer Top Housing & Emitter Slit */}
        <div className="relative px-3 sm:px-5 pt-2 pb-2 bg-gradient-to-b from-[#0A101D] to-[#060911] border-b border-teal-500/30 shrink-0 z-20">
          <div className="flex items-center justify-between pb-1.5 text-[9px] font-mono">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]"></span>
                PWR
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${!isComplete ? 'bg-cyan-400 print-head-indicator shadow-[0_0_6px_#22D3EE]' : 'bg-emerald-400'}`}></span>
                FEED
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2DD4BF]"></span>
                ONLINE
              </span>
            </div>
            <div className="text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              {!isComplete ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                  <span>DISPENSING THERMAL PASS...</span>
                </>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                  <span>DISPENSER CUT COMPLETE</span>
                </span>
              )}
            </div>
          </div>

          {/* 3D Dispenser Mouth / Emitter Slot */}
          <div className="relative w-full h-3.5 rounded-md bg-[#020408] border border-slate-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent laser-aperture" />
          </div>
        </div>

        {/* Status Confirmation Badge Banner */}
        <div className="px-4 py-2 text-center bg-[#090E1A] shrink-0 z-20 border-b border-white/10">
          <div className="flex items-center justify-center gap-2">
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                isComplete 
                  ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-teal-500/20 border border-teal-400 text-teal-300 animate-pulse'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white font-mono">
              {isComplete ? 'RESERVATION CONFIRMED • 50 ETB PAID' : 'PRINTING DIGITAL RECEIPT PASS...'}
            </h2>
          </div>
          <p className="text-[10px] text-slate-300 mt-0.5 font-sans">
            {isComplete ? 'Bay secured for 1 hour. Present 4-digit PIN or QR code at dispenser.' : 'Hold on • Physical receipt simulation emerging from dispenser'}
          </p>
        </div>

        {/* Scrollable Container with High-Contrast White Thermal Receipt Paper */}
        <div className="relative px-3 sm:px-5 py-3 overflow-y-auto flex-1 min-h-0 overscroll-contain bg-[#070B14]">
          
          {/* ========================================================================= */}
          {/* AUTHENTIC WHITE THERMAL RECEIPT PASS (HIGH CONTRAST & BEAUTIFUL)          */}
          {/* ========================================================================= */}
          <div
            ref={ticketRef}
            onClick={!isComplete ? handleSkipAnimation : undefined}
            className={`relative rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-[0_15px_50px_rgba(0,0,0,0.6)] transition-all duration-300 overflow-hidden ${
              !isComplete ? 'ticket-feed-motion cursor-pointer' : ''
            }`}
          >
            {/* Transient Laser Scanline during thermal print feed */}
            {!isComplete && (
              <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent laser-scan-sweep pointer-events-none z-30 shadow-[0_0_12px_#22D3EE]" />
            )}

            {/* 1. Thermal Header: Brand & Official Verification Stamp */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center text-teal-400 font-black shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-teal-400" />
                  </div>
                  <span className="font-sans font-black tracking-widest text-sm text-slate-950">CHARGEFLOW</span>
                </div>
                <div className="text-[9px] font-mono font-bold text-teal-700 tracking-wider mt-0.5 uppercase">
                  EXCLUSIVE BAY ALLOCATION PASS
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-[11px] font-extrabold text-slate-900">{safeReceiptNo}</div>
                <div className="text-[9px] text-slate-500 font-semibold">{safeDate}</div>
              </div>
            </div>

            {/* 2. Primary Reservation Details Matrix */}
            <div className="p-4 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans">
                    RESERVATION ID
                  </span>
                  <span className="font-black text-slate-900 text-xs tracking-wider">{activeResId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans">
                    STATUS
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    {safeStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-teal-600" />
                    VEHICLE
                  </span>
                  <span className="font-bold text-slate-900 truncate block text-[11px] mt-0.5">{activeVehicleModel}</span>
                  <span className="text-[10px] text-slate-600 font-semibold">{activePlate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    TIME WINDOW
                  </span>
                  <span className="font-black text-emerald-700 text-[11px] block mt-0.5">{activeSlot}</span>
                  <span className="text-[10px] text-slate-500">15 min grace window</span>
                </div>
              </div>

              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  CHARGING STATION &amp; BAY
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-black text-slate-950 text-xs">{safeStationName}</span>
                  <span className="text-xs font-black text-teal-900 px-2 py-0.5 rounded-md bg-teal-100 border border-teal-300">
                    {safeBayNumber}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center gap-2 mt-1 font-medium">
                  <span>Power: {safePowerKw} kW DC Fast</span>
                  <span>•</span>
                  <span>{activeQueue ? `Queue: #${activeQueue}` : 'Direct Bay Access'}</span>
                </div>
              </div>

              {/* 3. Financial Separation Matrix */}
              <div className="pt-1 space-y-2.5">
                <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  PAYMENT &amp; COST BREAKDOWN
                </div>

                {/* Reservation Fee (Paid Now) */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-sans font-black text-emerald-900">RESERVATION FEE</span>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase font-black">
                        PAID NOW
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 block font-sans mt-0.5">
                      Secures slot &amp; locks dispenser for arrival
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-900 font-mono">
                      {safeAmountEtb.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                {/* Estimated Energy Cost (Billed Later) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-sans font-bold text-slate-800">ESTIMATED CHARGING ENERGY</span>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-bold">
                        BILLED LATER
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                      ~18.5 kWh @ 19.50 ETB/kWh upon completion
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 font-mono">
                      ~{estimatedCost.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-500 font-sans leading-tight pl-1">
                  * Note: The 50 ETB reservation fee holds your bay. Actual energy consumed is billed separately after charging stops.
                </p>
              </div>

              {/* 3.5 4-Digit Dispenser Unlock PIN */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#090F1C] to-[#040810] text-white border-2 border-teal-400 shadow-lg text-center space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                      DISPENSER UNLOCK PIN
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyPin}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 text-[9px] font-mono font-bold transition-all active:scale-95 cursor-pointer"
                        title="Copy PIN"
                      >
                        {copiedPin ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                            <span className="text-emerald-300">COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-teal-300" />
                            <span>COPY PIN</span>
                          </>
                        )}
                      </button>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3 text-teal-300" />
                        UNTIL {expiresTimeString}
                      </span>
                    </div>
                  </div>

                  {/* 4 Digit Monospace High-Contrast PIN Boxes */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    {activePin.slice(0, 4).split('').map((digit, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-14 rounded-xl bg-[#0F172A] border-2 border-teal-400/80 shadow-[inset_0_0_12px_rgba(45,212,191,0.4)] flex items-center justify-center"
                      >
                        <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-teal-200 to-emerald-400 tracking-wider">
                          {digit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-300 font-sans leading-tight">
                    Enter this 4-digit PIN at charger dispenser or tap <strong className="text-teal-300">START CHARGING</strong> in Live Session.
                  </p>
                </div>
              </div>

              {/* 4. High Resolution Camera-Scannable QR Code */}
              <div className="pt-3 border-t border-slate-200 text-center space-y-2">
                <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl inline-block shadow-md mx-auto">
                  {qrSvgString ? (
                    <div
                      className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrSvgString }}
                    />
                  ) : (
                    <div className="w-28 h-28 bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-mono">
                      QR Generated
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-black text-slate-900 uppercase tracking-wider">
                    SCAN TO OPEN LIVE SESSION &amp; VERIFY
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans max-w-[260px] mx-auto leading-tight">
                    Scan with any smartphone camera for bay authorization and unlock status.
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Jagged Tear Fringe */}
            <div className="w-full h-3 receipt-tear-edge mt-2" />
          </div>
        </div>

        {/* Pinned Bottom User Action Buttons */}
        <div 
          className={`p-3.5 sm:p-4 pt-2.5 border-t border-white/10 space-y-2 shrink-0 z-30 bg-[#070B14] transition-all duration-300 ${
            isComplete ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none'
          }`}
        >
          {/* Primary Action Button */}
          {reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? (
            <button
              onClick={handleGoToLiveQueue}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.01] cursor-pointer active:scale-98"
            >
              <Users className="w-4 h-4 text-slate-950" />
              <span>GO TO LIVE QUEUE (#{activeQueue || 2} IN LINE)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleGoToLiveSession}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>GO TO LIVE SESSION</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? handleGoToLiveSession : handleGoToLiveQueue}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>{reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? 'Live Session' : 'Live Queue'}</span>
            </button>

            <button
              onClick={handleBackToCockpit}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Car className="w-3.5 h-3.5 text-teal-400" />
              <span>Back to Cockpit</span>
            </button>
          </div>

          {/* Navigation Link */}
          <button
            onClick={handleGetDirections}
            className="w-full py-1.5 px-3 rounded-xl text-teal-300 hover:text-white hover:bg-teal-500/10 text-[11px] font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Navigation className="w-3 h-3" />
            <span>GET TURN-BY-TURN NAVIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationReceiptModal;
