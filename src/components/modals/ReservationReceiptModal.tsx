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
  Users
} from 'lucide-react';
import { useChargeFlowStore } from '../../store/useChargeFlowStore';
import { generateQRCodeSVG } from '../../utils/qrCode';

export const ReservationReceiptModal: React.FC = () => {
  const receiptModal = useChargeFlowStore((s) => s.receiptModal);
  const closeReceiptModal = useChargeFlowStore((s) => s.closeReceiptModal);
  const openDirectionsModal = useChargeFlowStore((s) => s.openDirectionsModal);
  const setView = useChargeFlowStore((s) => s.setView);
  const vehicle = useChargeFlowStore((s) => s.vehicle);
  const reservation = useChargeFlowStore((s) => s.reservation);
  const theme = useChargeFlowStore((s) => s.theme);
  const isCream = theme === 'cream';

  // Animation Phase: 'feeding' (slower upward feed) -> 'settling' -> 'confirmed' (settled with checkmark & actions)
  const [animationPhase, setAnimationPhase] = useState<'feeding' | 'settling' | 'confirmed'>('feeding');
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  // Authentic Web Audio API Synthesizer for Thermal Receipt Machine Sound
  // Generates:
  // 1. Stepper motor gear whine with slight mechanical load variation (~170Hz - 190Hz)
  // 2. Bandpass-filtered thermal paper hiss with rhythmic 85ms micro-pulses (as each dot line feeds upward)
  // 3. Digital thermal print-head chatter
  // 4. Mechanical cutter snip ("chhk-tick!") when the receipt finishes emerging
  const startReceiptPrinterSound = () => {
    if (isMuted) return;
    soundControllerRef.current?.stop();

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const feedDuration = 3.6; // active thermal printing duration (sec)
      const now = ctx.currentTime;
      const sampleRate = ctx.sampleRate;

      // 1. Thermal Paper Friction & Hiss Noise
      const bufferSize = Math.floor(sampleRate * (feedDuration + 0.3));
      const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const paperFilter = ctx.createBiquadFilter();
      paperFilter.type = 'bandpass';
      paperFilter.frequency.setValueAtTime(1750, now);
      paperFilter.Q.setValueAtTime(1.9, now);

      const stepperGain = ctx.createGain();
      const pulseInterval = 0.085; // 85ms rhythm per thermal line advance

      for (let t = 0; t < feedDuration; t += pulseInterval) {
        const pTime = now + t;
        stepperGain.gain.setValueAtTime(0.001, pTime);
        stepperGain.gain.linearRampToValueAtTime(0.042, pTime + 0.02);
        stepperGain.gain.exponentialRampToValueAtTime(0.006, pTime + pulseInterval * 0.72);
        stepperGain.gain.setValueAtTime(0.001, pTime + pulseInterval * 0.95);
      }
      stepperGain.gain.setValueAtTime(0, now + feedDuration);

      // 2. Stepper Motor Gear Whine
      const motorOsc = ctx.createOscillator();
      motorOsc.type = 'triangle';
      motorOsc.frequency.setValueAtTime(178, now);
      for (let t = 0; t < feedDuration; t += pulseInterval * 2) {
        motorOsc.frequency.setValueAtTime(174, now + t);
        motorOsc.frequency.linearRampToValueAtTime(188, now + t + pulseInterval);
      }

      const motorGain = ctx.createGain();
      motorGain.gain.setValueAtTime(0.014, now);
      motorGain.gain.linearRampToValueAtTime(0.02, now + 1.5);
      motorGain.gain.setValueAtTime(0, now + feedDuration);

      // 3. Digital Print Head Chatter
      const headOsc = ctx.createOscillator();
      headOsc.type = 'square';
      headOsc.frequency.setValueAtTime(680, now);

      const headGain = ctx.createGain();
      headGain.gain.setValueAtTime(0.003, now);
      for (let t = 0; t < feedDuration; t += pulseInterval) {
        const pTime = now + t;
        headGain.gain.setValueAtTime(0.005, pTime);
        headGain.gain.setValueAtTime(0.0008, pTime + pulseInterval * 0.5);
      }
      headGain.gain.setValueAtTime(0, now + feedDuration);

      // Connect noise and oscillators to master
      noiseSource.connect(paperFilter);
      paperFilter.connect(stepperGain);
      stepperGain.connect(ctx.destination);

      motorOsc.connect(motorGain);
      motorGain.connect(ctx.destination);

      headOsc.connect(headGain);
      headGain.connect(ctx.destination);

      noiseSource.start(now);
      motorOsc.start(now);
      headOsc.start(now);

      noiseSource.stop(now + feedDuration + 0.3);
      motorOsc.stop(now + feedDuration + 0.3);
      headOsc.stop(now + feedDuration + 0.3);

      // 4. Mechanical Cutter Snip at Completion (3.6s)
      const cutterTime = now + feedDuration;
      const cutterNoise = ctx.createBufferSource();
      const cutterSize = Math.floor(sampleRate * 0.08);
      const cutterBuf = ctx.createBuffer(1, cutterSize, sampleRate);
      const cData = cutterBuf.getChannelData(0);
      for (let i = 0; i < cutterSize; i++) {
        cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.016));
      }
      cutterNoise.buffer = cutterBuf;

      const cutterFilter = ctx.createBiquadFilter();
      cutterFilter.type = 'highpass';
      cutterFilter.frequency.setValueAtTime(2500, cutterTime);

      const cutterGain = ctx.createGain();
      cutterGain.gain.setValueAtTime(0.075, cutterTime);
      cutterGain.gain.exponentialRampToValueAtTime(0.001, cutterTime + 0.07);

      cutterNoise.connect(cutterFilter);
      cutterFilter.connect(cutterGain);
      cutterGain.connect(ctx.destination);

      cutterNoise.start(cutterTime);
      cutterNoise.stop(cutterTime + 0.1);

      soundControllerRef.current = {
        stop: () => {
          try {
            stepperGain.gain.cancelScheduledValues(ctx.currentTime);
            stepperGain.gain.setValueAtTime(0, ctx.currentTime);
            motorGain.gain.cancelScheduledValues(ctx.currentTime);
            motorGain.gain.setValueAtTime(0, ctx.currentTime);
            headGain.gain.cancelScheduledValues(ctx.currentTime);
            headGain.gain.setValueAtTime(0, ctx.currentTime);
            cutterGain.gain.cancelScheduledValues(ctx.currentTime);
            cutterGain.gain.setValueAtTime(0, ctx.currentTime);
            noiseSource.stop();
            motorOsc.stop();
            headOsc.stop();
            cutterNoise.stop();
            ctx.close();
          } catch {}
        },
      };
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Subtle luxury EV confirmation chime synthesized via Web Audio API
  const playConfirmationChime = () => {
    if (isMuted || hasPlayedChime) return;
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

  useEffect(() => {
    if (!receiptModal?.isOpen) return;

    if (!shouldAnimate || prefersReducedMotion) {
      setAnimationPhase('confirmed');
      return;
    }

    setAnimationPhase('feeding');
    setHasPlayedChime(false);

    // Start authentic receipt printer sound
    startReceiptPrinterSound();

    // Slower, deliberate mechanical feed phase (0 - 3600ms)
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settling');
    }, 3600);

    // Final Confirmed State with Checkmark & Controls (3900ms)
    const confirmedTimer = setTimeout(() => {
      setAnimationPhase('confirmed');
      playConfirmationChime();
    }, 3900);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(confirmedTimer);
      soundControllerRef.current?.stop();
    };
  }, [receiptModal?.isOpen, shouldAnimate, prefersReducedMotion]);

  const handleSkipAnimation = () => {
    soundControllerRef.current?.stop();
    setAnimationPhase('confirmed');
    playConfirmationChime();
  };

  const handleReplayAnimation = () => {
    soundControllerRef.current?.stop();
    setAnimationPhase('feeding');
    setHasPlayedChime(false);
    startReceiptPrinterSound();
    setTimeout(() => setAnimationPhase('settling'), 3600);
    setTimeout(() => {
      setAnimationPhase('confirmed');
      playConfirmationChime();
    }, 3900);
  };

  const handleClose = () => {
    soundControllerRef.current?.stop();
    closeReceiptModal();
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
    authCode,
    authCodeExpiresAt,
  } = receiptModal;

  const activeResId = reservationId || reservation?.id || `RES-${receiptNo.slice(-4)}`;
  const activeVehicleModel = vehicleModel || vehicle.model || 'BYD Seal AWD';
  const activePlate = vehiclePlate || vehicle.plate || 'ET-3-A48291';
  const activeSlot = slotTime || reservation?.slotTime || '18:00 - 18:30';
  const activeQueue = queuePosition ?? reservation?.queuePosition;
  const estimatedCost = estimatedEnergyCostEtb || 360;
  const activePin = authCode || reservation?.authCode || '8492';
  const activeExpiresAt = authCodeExpiresAt || reservation?.authCodeExpiresAt || (Date.now() + 60 * 60 * 1000);
  const expiresTimeString = new Date(activeExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [copiedPin, setCopiedPin] = useState(false);

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

  const handleViewReservation = () => {
    handleClose();
    setView('reservation');
  };

  const handleBackToCockpit = () => {
    handleClose();
    setView('cockpit');
  };

  const handleGetDirections = () => {
    handleClose();
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none overflow-y-auto scroll-smooth">
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
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Confirmation Stage: Emerges with Print Feed */}
        <div className="px-5 pt-3 pb-2 text-center transition-all duration-300 shrink-0 z-20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                isComplete 
                  ? 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-100'
                  : 'bg-teal-500/20 border border-teal-400/50 text-teal-300 scale-100 animate-pulse'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 stroke-[2.5] ${isComplete ? 'animate-in zoom-in-50 duration-300' : ''}`} />
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-white font-mono">
              {isComplete ? 'RESERVATION CONFIRMED • 50 ETB PAID' : 'PRINTING DIGITAL RECEIPT PASS...'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-300 font-sans">
            {isComplete ? 'Your charging slot is secured. Pass is active for 1 hour.' : 'Dispensing thermal ticket • Laser aperture active'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THE DIGITAL TICKET DISPENSER & UPWARD "FEED/PRINT" MOTION CONTAINER       */}
        {/* ========================================================================= */}
        <div className="relative px-3 sm:px-5 py-2 overflow-hidden flex-1 min-h-[460px]">
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
                ? 'bg-white border-amber-900/20 text-slate-900 shadow-xl'
                : 'bg-[#0E172A] border-teal-500/40 text-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.85)]'
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

              {/* ========================================================================= */}
              {/* 3.5 4-DIGIT DISPENSER UNLOCK PIN (VALID FOR 1 HOUR)                      */}
              {/* ========================================================================= */}
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

                  {/* 4 Digit Futuristic Monospace PIN Boxes */}
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

              {/* 4. Realistic Camera-Scannable QR Code for Attendant & Station Verification */}
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
          className={`p-4 sm:p-5 pt-2 border-t border-white/5 space-y-2 shrink-0 z-20 transition-all duration-500 ${
            isComplete ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'
          }`}
        >
          {/* Primary Action: Go to Live Queue or Live Session */}
          {reservation?.status === 'QUEUED' || (activeQueue && activeQueue > 1) ? (
            <button
              onClick={handleGoToLiveQueue}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-950" />
              <span>GO TO LIVE QUEUE (#{activeQueue || 2} IN LINE)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleGoToLiveSession}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
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
