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
  Radio
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
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

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

  if (!receiptModal?.isOpen) return null;

  // Safe fallback defaults for all receipt properties
  const safeReceiptNo = receiptModal.receiptNo || `CF-${Date.now().toString().slice(-8)}`;
  const safeDate = receiptModal.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const safeStationName = receiptModal.stationName || 'Addis EV Hub (Bole)';
  const safeBayNumber = receiptModal.bayNumber || 'Bay 03';
  const safePowerKw = receiptModal.powerKw || 120;
  const safeAmountEtb = typeof receiptModal.amountEtb === 'number' ? receiptModal.amountEtb : 50.0;
  const safeStatus = receiptModal.status || 'PAID';
  const activeResId = receiptModal.reservationId || reservation?.id || `RES-${safeReceiptNo.slice(-4)}`;
  const activeVehicleModel = receiptModal.vehicleModel || vehicle?.model || 'BYD Seal AWD';
  const activePlate = receiptModal.vehiclePlate || vehicle?.plate || 'ET-3-A48291';
  const activeSlot = receiptModal.slotTime || reservation?.slotTime || '18:00 - 18:30';
  const activeQueue = receiptModal.queuePosition ?? reservation?.queuePosition;
  const estimatedCost = receiptModal.estimatedEnergyCostEtb || 360;
  const activePin = receiptModal.authCode || reservation?.authCode || '8492';
  const activeExpiresAt = receiptModal.authCodeExpiresAt || reservation?.authCodeExpiresAt || (Date.now() + 60 * 60 * 1000);
  const expiresTimeString = new Date(activeExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    // Compact canonical URI for instant camera barcode scanning across iOS & Android Lens
    return `https://chargeflow-ev.com/v?r=${encodeURIComponent(activeResId)}&p=${encodeURIComponent(activePin)}`;
  }, [activeResId, activePin]);

  const qrSvgString = useMemo(() => {
    try {
      return generateQRCodeSVG(qrCodeUrl, {
        padding: 4,
        fgColor: '#070C18',
        bgColor: '#FFFFFF',
        size: 144,
      });
    } catch (e) {
      console.error('QR generation failed:', e);
      return '';
    }
  }, [qrCodeUrl]);

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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2.5 sm:p-4 animate-in fade-in select-none overflow-y-auto overscroll-contain py-3 sm:py-6">
      <div 
        className={`relative w-full max-w-md mx-auto my-auto rounded-3xl border shadow-2xl transition-all duration-300 flex flex-col max-h-[94vh] overflow-hidden ${
          isCream
            ? 'bg-[#FAF7F2] border-amber-900/20 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.25)]'
            : 'bg-[#070B14]/95 border-teal-500/30 text-white shadow-[0_25px_70px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Subtle Background Radial Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="relative px-4 sm:px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/5 shrink-0 z-30 bg-[#070B14]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase">
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

        {/* ========================================================================= */}
        {/* HARDWARE PRINTER DISPENSER HOUSING (TOP CASING & EMITTER MOUTH)          */}
        {/* ========================================================================= */}
        <div className="relative px-3 sm:px-5 pt-2 pb-1 bg-gradient-to-b from-[#0A101D] to-[#060911] border-b border-teal-500/20 shrink-0 z-20">
          <div className="flex items-center justify-between pb-1.5 text-[9px] font-mono">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                PWR
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${!isComplete ? 'bg-cyan-400 print-head-indicator' : 'bg-emerald-400'}`}></span>
                FEED
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                READY
              </span>
            </div>
            <div className="text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
              {!isComplete ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                  <span>DISPENSING THERMAL TICKET...</span>
                </>
              ) : (
                <span className="text-emerald-400">✓ TICKET CUT COMPLETE</span>
              )}
            </div>
          </div>

          {/* Realistic 3D Inset Printer Dispenser Mouth / Slit */}
          <div className="relative w-full h-4 rounded-lg bg-[#020408] border border-slate-700/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
            {/* Glowing Laser Print-Head Aperture Beam */}
            <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent laser-aperture" />
            <div className="w-3/4 h-[1px] bg-cyan-300/80 shadow-[0_0_8px_#22D3EE]" />
          </div>
        </div>

        {/* Status Confirmation Sub-Banner */}
        <div className="px-4 py-2 text-center bg-[#070B14]/80 shrink-0 z-20 border-b border-white/5">
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

        {/* ========================================================================= */}
        {/* TICKET BODY WITH MECHANICAL EXTRUSION / FEED-DOWN ANIMATION               */}
        {/* ========================================================================= */}
        <div className="relative px-2.5 sm:px-4 py-2 overflow-y-auto flex-1 overscroll-contain">
          <div
            ref={ticketRef}
            onClick={!isComplete ? handleSkipAnimation : undefined}
            className={`relative rounded-2xl border transition-all duration-300 ${
              isCream
                ? 'bg-white border-amber-900/20 text-slate-900 shadow-xl'
                : 'bg-[#0E172A] border-teal-500/40 text-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.85)]'
            } ${!isComplete ? 'ticket-feed-motion cursor-pointer' : ''}`}
          >
            {/* Transient Laser Scanline during thermal print feed */}
            {!isComplete && (
              <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent laser-scan-sweep pointer-events-none z-30 shadow-[0_0_10px_#22D3EE]" />
            )}

            {/* 1. Ticket Brand Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  </div>
                  <span className="font-sans font-black tracking-widest text-xs text-white">CHARGEFLOW</span>
                </div>
                <div className="text-[9px] font-mono text-teal-400 tracking-wider mt-0.5">
                  EXCLUSIVE BAY ALLOCATION PASS
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-[10px] font-bold text-slate-300">{safeReceiptNo}</div>
                <div className="text-[9px] text-slate-400">{safeDate}</div>
              </div>
            </div>

            {/* 2. Primary Reservation Details Matrix */}
            <div className="p-3.5 sm:p-4 space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                    RESERVATION ID
                  </span>
                  <span className="font-bold text-white text-xs tracking-wider">{activeResId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                    STATUS
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {safeStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans flex items-center gap-1">
                    <Car className="w-3 h-3 text-teal-400" />
                    VEHICLE
                  </span>
                  <span className="font-semibold text-white truncate block text-[11px]">{activeVehicleModel}</span>
                  <span className="text-[10px] text-slate-400">{activePlate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-400" />
                    TIME WINDOW
                  </span>
                  <span className="font-bold text-emerald-400 text-[11px] block">{activeSlot}</span>
                  <span className="text-[10px] text-slate-400">15 min grace window</span>
                </div>
              </div>

              <div className="pb-2.5 border-b border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  CHARGING STATION & BAY
                </span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="font-bold text-white text-xs">{safeStationName}</span>
                  <span className="text-[11px] font-black text-teal-400 px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30">
                    {safeBayNumber}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                  <span>Power: {safePowerKw} kW DC</span>
                  <span>•</span>
                  <span>{activeQueue ? `Queue: #${activeQueue}` : 'Direct Bay Access'}</span>
                </div>
              </div>

              {/* 3. FINANCIAL SEPARATION: RESERVATION FEE VS CHARGING COST */}
              <div className="pt-1 space-y-2">
                <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-teal-400" />
                  PAYMENT &amp; COST BREAKDOWN
                </div>

                {/* Section A: Reservation Fee (Paid Now) */}
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-sans font-bold text-emerald-400">RESERVATION FEE</span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase font-black">
                        PAID NOW
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 block font-sans mt-0.5">
                      Secures slot &amp; locks dispenser for arrival
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {safeAmountEtb.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                {/* Section B: Estimated Charging Cost (Billed Later) */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-sans font-semibold text-slate-300">ESTIMATED CHARGING ENERGY</span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/10 text-slate-400 uppercase">
                        BILLED LATER
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 block font-sans mt-0.5">
                      ~18.5 kWh @ 19.50 ETB/kWh upon completion
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300 font-mono">
                      ~{estimatedCost.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 font-sans leading-tight pl-1">
                  * Note: The 50 ETB reservation fee holds your bay. Actual energy consumed is billed separately after charging stops.
                </div>
              </div>

              {/* 3.5 4-DIGIT DISPENSER UNLOCK PIN (VALID FOR 1 HOUR) */}
              <div className="pt-2">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-teal-500/5 border-2 border-teal-400/40 shadow-[0_0_25px_rgba(45,212,191,0.2)] text-center space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                      DISPENSER UNLOCK PIN
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyPin}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 text-[9px] font-mono font-bold transition-all active:scale-95 cursor-pointer shadow"
                        title="Copy 4-digit PIN to clipboard"
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

                  {/* 4 Digit High-Contrast Monospace PIN Boxes */}
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1">
                    {activePin.split('').slice(0, 4).map((digit, idx) => (
                      <div
                        key={idx}
                        className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-[#090F1C] border-2 border-teal-400/60 shadow-[inset_0_0_15px_rgba(45,212,191,0.3)] flex items-center justify-center"
                      >
                        <span className="font-mono text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-teal-200 to-emerald-400 tracking-wider">
                          {digit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-300 font-sans leading-tight">
                    Enter this 4-digit PIN at charger dispenser or tap <strong className="text-teal-300">START CHARGING</strong> in Live Session. Code expires in 1 hour.
                  </p>
                </div>
              </div>

              {/* 4. Realistic Camera-Scannable QR Code */}
              <div className="pt-2 border-t border-white/10 text-center space-y-2">
                <div className="p-2.5 bg-white rounded-xl inline-block shadow-lg mx-auto">
                  {qrSvgString ? (
                    <div
                      className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrSvgString }}
                    />
                  ) : (
                    <div className="w-28 h-28 bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                      QR Generated
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-teal-300 uppercase tracking-wider">
                    SCAN TO OPEN LIVE SESSION &amp; VERIFY
                  </div>
                  <div className="text-[9px] text-slate-400 font-sans max-w-[260px] mx-auto leading-tight">
                    Scan with any smartphone camera to access station checkout, bay authorization, and unlock status.
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Bottom Micro-Fringe */}
            <div className="relative h-2 bg-transparent border-t border-dashed border-white/20 flex items-center justify-between px-3">
              <span className="w-2 h-2 -mt-2 -ml-4 rounded-full bg-[#070B14]"></span>
              <span className="w-2 h-2 -mt-2 -mr-4 rounded-full bg-[#070B14]"></span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* POST-ANIMATION USER ACTIONS                                               */}
        {/* ========================================================================= */}
        <div 
          className={`p-3.5 sm:p-4 pt-2 border-t border-white/5 space-y-2 shrink-0 z-30 bg-[#070B14] transition-all duration-300 ${
            isComplete ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'
          }`}
        >
          {/* Primary Action: Go to Live Queue or Live Session */}
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

          {/* Secondary Actions Row: Live Queue / Session Toggle & Back to Cockpit */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? handleGoToLiveSession : handleGoToLiveQueue}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>{reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? 'Live Session' : 'Live Queue'}</span>
            </button>

            <button
              onClick={handleBackToCockpit}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Car className="w-3.5 h-3.5 text-teal-400" />
              <span>Back to Cockpit</span>
            </button>
          </div>

          {/* Tertiary Action: Get Turn-by-Turn Directions */}
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
