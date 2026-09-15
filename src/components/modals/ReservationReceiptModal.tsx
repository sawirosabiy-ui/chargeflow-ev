import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  X, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Navigation, 
  Calendar,
  RotateCcw,
  Sparkles,
  Car,
  Clock,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';

export const ReservationReceiptModal: React.FC = () => {
  const receiptModal = useChargeFlowStore((s) => s.receiptModal);
  const closeReceiptModal = useChargeFlowStore((s) => s.closeReceiptModal);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const setView = useChargeFlowStore((s) => s.setView);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const reservation = useChargeFlowStore((s) => s.reservation);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  // Animation Phase: 'feeding' (upward feed) -> 'settling' -> 'confirmed' (settled with checkmark & actions)
  const [animationPhase, setAnimationPhase] = useState<'feeding' | 'settling' | 'confirmed'>('feeding');
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = receiptModal?.initialAnimation ?? true;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!receiptModal?.isOpen) return;

    if (!shouldAnimate || prefersReducedMotion) {
      setAnimationPhase('confirmed');
      return;
    }

    setAnimationPhase('feeding');
    setHasPlayedChime(false);

    // Mechanical Feed Phase (0 - 2000ms)
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settling');
    }, 2000);

    // Final Confirmed State with Checkmark & Controls (2300ms)
    const confirmedTimer = setTimeout(() => {
      setAnimationPhase('confirmed');
      playConfirmationChime();
    }, 2350);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(confirmedTimer);
    };
  }, [receiptModal?.isOpen, shouldAnimate, prefersReducedMotion]);

  // Subtle luxury EV confirmation chime synthesized via Web Audio API
  const playConfirmationChime = () => {
    if (hasPlayedChime) return;
    setHasPlayedChime(true);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5

      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.22); // D6

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not permitted or not supported
    }
  };

  const handleSkipAnimation = () => {
    setAnimationPhase('confirmed');
    playConfirmationChime();
  };

  const handleReplayAnimation = () => {
    setAnimationPhase('feeding');
    setHasPlayedChime(false);
    setTimeout(() => setAnimationPhase('settling'), 2000);
    setTimeout(() => {
      setAnimationPhase('confirmed');
      playConfirmationChime();
    }, 2350);
  };

  if (!receiptModal?.isOpen) return null;

  const {
    receiptNo,
    date,
    stationName,
    bayNumber,
    powerKw,
    amountEtb,
    status,
    reservationId,
    vehicleModel,
    vehiclePlate,
    slotTime,
    queuePosition,
    estimatedEnergyCostEtb,
  } = receiptModal;

  const activeResId = reservationId || reservation?.id || `RES-${receiptNo.slice(-4)}`;
  const activeVehicleModel = vehicleModel || vehicle.model || 'BYD Seal AWD';
  const activePlate = vehiclePlate || vehicle.plate || 'ET-3-A48291';
  const activeSlot = slotTime || reservation?.slotTime || '18:00 - 18:30';
  const activeQueue = queuePosition ?? reservation?.queuePosition;
  const estimatedCost = estimatedEnergyCostEtb || 360;

  const handleGoToLiveSession = () => {
    closeReceiptModal();
    setView('charging');
  };

  const handleViewReservation = () => {
    closeReceiptModal();
    setView('reservation');
  };

  const handleBackToCockpit = () => {
    closeReceiptModal();
    setView('cockpit');
  };

  const handleGetDirections = () => {
    closeReceiptModal();
    openDirectionsModal({
      name: stationName,
      address: 'Bole Road, Near Bole Medhanialem, Addis Ababa',
      distanceKm: 2.4,
      etaMin: 7,
      baysAvailable: '4 / 6 bays available',
      powerKw: powerKw || 120,
    });
  };

  const isComplete = animationPhase === 'confirmed';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none overflow-y-auto">
      <div 
        className={`relative w-full max-w-md my-auto rounded-3xl border shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
          isCream
            ? 'bg-[#FAF7F2] border-amber-900/20 text-slate-900 shadow-[0_25px_60px_rgba(40,20,10,0.25)]'
            : 'bg-[#070B14]/95 border-teal-500/30 text-white shadow-[0_25px_70px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Subtle Background Radial Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header Bar */}
        <div className="relative px-5 pt-4 pb-2 flex items-center justify-between border-b border-white/5 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase">
              CHARGEFLOW DIGITAL PASS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isComplete && (
              <button
                onClick={handleReplayAnimation}
                title="Replay Print Animation"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {!isComplete && (
              <button
                onClick={handleSkipAnimation}
                className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-teal-300 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={closeReceiptModal}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Confirmation Stage: Emerges at the End of Print Feed */}
        <div className="px-5 pt-3 pb-2 text-center transition-all duration-300 shrink-0 z-20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                isComplete 
                  ? 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-100'
                  : 'bg-teal-500/10 border border-teal-500/20 text-teal-300 scale-95 animate-pulse'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 stroke-[2.5] ${isComplete ? 'animate-in zoom-in-50 duration-300' : ''}`} />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-white font-mono">
              {isComplete ? 'RESERVATION CONFIRMED' : 'ISSUING DIGITAL PASS...'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {isComplete ? 'Your charging slot is secured.' : 'Thermal emitter active • Encrypting station verification token'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THE DIGITAL TICKET DISPENSER & UPWARD "FEED/PRINT" MOTION CONTAINER       */}
        {/* ========================================================================= */}
        <div className="relative px-4 sm:px-6 py-2 overflow-hidden flex-1">
          {/* Subtle Top Digital Emitter Slit */}
          <div className="relative z-10 w-full mb-1">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-teal-400 to-transparent laser-aperture" />
          </div>

          {/* Ticket Body with Upward Feed Animation */}
          <div
            ref={ticketRef}
            onClick={!isComplete ? handleSkipAnimation : undefined}
            className={`relative rounded-2xl border transition-all duration-300 ${
              isCream
                ? 'bg-white border-amber-900/15 text-slate-900 shadow-md'
                : 'bg-gradient-to-b from-[#0E1626] via-[#09101C] to-[#050912] border-white/10 text-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            } ${!isComplete ? 'ticket-feed-motion cursor-pointer' : ''}`}
          >
            {/* Transient Laser Scanline during upward print */}
            {!isComplete && (
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent laser-scan-sweep pointer-events-none z-20" />
            )}

            {/* 1. Ticket Brand Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
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
                <div className="text-[10px] font-bold text-slate-300">{receiptNo}</div>
                <div className="text-[9px] text-slate-400">{date}</div>
              </div>
            </div>

            {/* 2. Primary Reservation Details Matrix */}
            <div className="p-4 space-y-3 text-xs font-mono">
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
                    {status}
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
                  <span className="font-bold text-white text-xs">{stationName}</span>
                  <span className="text-[11px] font-black text-teal-400 px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30">
                    {bayNumber}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                  <span>Power: {powerKw || 120} kW DC</span>
                  <span>•</span>
                  <span>{activeQueue ? `Queue: #${activeQueue}` : 'Direct Bay Access'}</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 3. STRICT FINANCIAL SEPARATION: RESERVATION FEE VS CHARGING COST          */}
              {/* ========================================================================= */}
              <div className="pt-1 space-y-2">
                <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-teal-400" />
                  PAYMENT & COST BREAKDOWN
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
                      Secures slot & locks dispenser for arrival
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {amountEtb.toFixed(2)} ETB
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
                  * Note: The 50 ETB reservation fee does not cover electricity. Actual energy consumed is billed separately after charging stops.
                </div>
              </div>

              {/* 4. Realistic High-Res Vector SVG QR Code for Attendant & Dispenser Verification */}
              <div className="pt-2 border-t border-white/10 text-center space-y-1.5">
                <div className="p-2 bg-white rounded-xl inline-block shadow-inner mx-auto">
                  <svg className="w-24 h-24 sm:w-28 sm:h-28 mx-auto" viewBox="0 0 100 100" fill="none">
                    {/* Corner 1 */}
                    <rect x="6" y="6" width="24" height="24" fill="#090F1C" rx="2" />
                    <rect x="9" y="9" width="18" height="18" fill="#fff" />
                    <rect x="13" y="13" width="10" height="10" fill="#090F1C" />

                    {/* Corner 2 */}
                    <rect x="70" y="6" width="24" height="24" fill="#090F1C" rx="2" />
                    <rect x="73" y="9" width="18" height="18" fill="#fff" />
                    <rect x="77" y="13" width="10" height="10" fill="#090F1C" />

                    {/* Corner 3 */}
                    <rect x="6" y="70" width="24" height="24" fill="#090F1C" rx="2" />
                    <rect x="9" y="73" width="18" height="18" fill="#fff" />
                    <rect x="13" y="77" width="10" height="10" fill="#090F1C" />

                    {/* Simulated Data Grid */}
                    <rect x="36" y="8" width="6" height="6" fill="#090F1C" />
                    <rect x="46" y="8" width="6" height="6" fill="#090F1C" />
                    <rect x="56" y="8" width="6" height="6" fill="#090F1C" />
                    <rect x="36" y="18" width="6" height="6" fill="#090F1C" />
                    <rect x="48" y="24" width="6" height="6" fill="#090F1C" />
                    <rect x="8" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="18" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="28" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="38" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="58" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="68" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="78" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="88" y="36" width="6" height="6" fill="#090F1C" />
                    <rect x="36" y="46" width="6" height="6" fill="#090F1C" />
                    <rect x="56" y="46" width="6" height="6" fill="#090F1C" />
                    <rect x="66" y="46" width="6" height="6" fill="#090F1C" />
                    <rect x="36" y="58" width="6" height="6" fill="#090F1C" />
                    <rect x="46" y="58" width="6" height="6" fill="#090F1C" />
                    <rect x="76" y="58" width="6" height="6" fill="#090F1C" />
                    <rect x="86" y="58" width="6" height="6" fill="#090F1C" />
                    <rect x="36" y="68" width="6" height="6" fill="#090F1C" />
                    <rect x="56" y="68" width="6" height="6" fill="#090F1C" />
                    <rect x="46" y="78" width="6" height="6" fill="#090F1C" />
                    <rect x="66" y="78" width="6" height="6" fill="#090F1C" />
                    <rect x="76" y="78" width="6" height="6" fill="#090F1C" />
                    <rect x="46" y="86" width="6" height="6" fill="#090F1C" />
                    <rect x="56" y="86" width="6" height="6" fill="#090F1C" />
                    <rect x="86" y="86" width="6" height="6" fill="#090F1C" />

                    {/* Central Verification Hologram Pill */}
                    <rect x="42" y="42" width="16" height="16" rx="4" fill="#0D9488" />
                    <path d="M50 45 L47 51 L50 51 L49 55 L54 49 L51 49 Z" fill="#fff" />
                  </svg>
                </div>
                <div className="text-[9px] text-slate-400 font-sans">
                  Scan at Bay Dispenser scanner or present to attendant
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
          className={`p-4 sm:p-5 pt-2 border-t border-white/5 space-y-2 shrink-0 z-20 transition-all duration-500 ${
            isComplete ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'
          }`}
        >
          {/* Primary Action: Go to Live Session */}
          <button
            onClick={handleGoToLiveSession}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>GO TO LIVE SESSION</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Secondary Actions Row: View Reservation & Back to Cockpit */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleViewReservation}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>View Reservation</span>
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
            className="w-full py-2 px-3 rounded-xl text-teal-300 hover:text-white hover:bg-teal-500/10 text-[11px] font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
