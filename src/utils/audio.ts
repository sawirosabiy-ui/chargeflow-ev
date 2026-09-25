// ============================================================================
// CHARGEFLOW DIGITAL AUDIO ENGINE (Mobile Web Audio & Thermal Printer Synthesizer)
// ============================================================================

let sharedAudioCtx: AudioContext | null = null;

/**
 * Get or initialize the shared AudioContext, ensuring it is resumed upon user gesture
 */
export const getSharedAudioContext = (): AudioContext | null => {
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
};

/**
 * Pre-warm audio on user touch/click interaction (crucial for mobile Safari & Chrome)
 */
export const prewarmAudioContext = (): void => {
  try {
    const ctx = getSharedAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {}
};

/**
 * Realistic Thermal Receipt Printer Audio Synthesizer
 * Synthesizes:
 * 1. Stepper motor mechanical drive gear whine (~174Hz-188Hz)
 * 2. Bandpass-filtered paper friction hiss with 85ms line-feed micro-pulses
 * 3. High-speed digital dot-matrix thermal head chatter
 * 4. High-frequency guillotine mechanical cutter snap ("chhk-tick!")
 */
export const createThermalPrinterSound = (isMuted: boolean = false): { stop: () => void } => {
  if (isMuted || typeof window === 'undefined') {
    return { stop: () => {} };
  }

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return { stop: () => {} };

    const feedDuration = 3.2; // 3.2s mechanical feed time
    const now = ctx.currentTime;
    const sampleRate = ctx.sampleRate;

    // 1. Thermal Paper Friction & Stepper Pulse Noise
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
    const pulseInterval = 0.085; // 85ms line feed step

    for (let t = 0; t < feedDuration; t += pulseInterval) {
      const pTime = now + t;
      stepperGain.gain.setValueAtTime(0.001, pTime);
      stepperGain.gain.linearRampToValueAtTime(0.045, pTime + 0.02);
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
    motorGain.gain.setValueAtTime(0.015, now);
    motorGain.gain.linearRampToValueAtTime(0.022, now + 1.5);
    motorGain.gain.setValueAtTime(0, now + feedDuration);

    // 3. Digital Print Head Chatter
    const headOsc = ctx.createOscillator();
    headOsc.type = 'square';
    headOsc.frequency.setValueAtTime(680, now);

    const headGain = ctx.createGain();
    headGain.gain.setValueAtTime(0.003, now);
    for (let t = 0; t < feedDuration; t += pulseInterval) {
      const pTime = now + t;
      headGain.gain.setValueAtTime(0.006, pTime);
      headGain.gain.setValueAtTime(0.0008, pTime + pulseInterval * 0.5);
    }
    headGain.gain.setValueAtTime(0, now + feedDuration);

    // Master node graph
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

    // 4. Mechanical Cutter Snip at Completion (3.2s)
    const cutterTime = now + feedDuration;
    const cutterNoise = ctx.createBufferSource();
    const cutterSize = Math.floor(sampleRate * 0.09);
    const cutterBuf = ctx.createBuffer(1, cutterSize, sampleRate);
    const cData = cutterBuf.getChannelData(0);
    for (let i = 0; i < cutterSize; i++) {
      cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.018));
    }
    cutterNoise.buffer = cutterBuf;

    const cutterFilter = ctx.createBiquadFilter();
    cutterFilter.type = 'highpass';
    cutterFilter.frequency.setValueAtTime(2600, cutterTime);

    const cutterGain = ctx.createGain();
    cutterGain.gain.setValueAtTime(0.08, cutterTime);
    cutterGain.gain.exponentialRampToValueAtTime(0.001, cutterTime + 0.08);

    cutterNoise.connect(cutterFilter);
    cutterFilter.connect(cutterGain);
    cutterGain.connect(ctx.destination);

    cutterNoise.start(cutterTime);
    cutterNoise.stop(cutterTime + 0.1);

    return {
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
        } catch {}
      },
    };
  } catch {
    return { stop: () => {} };
  }
};

/**
 * Luxury EV Confirmation Chime
 */
export const playLuxuryConfirmationChime = (isMuted: boolean = false): void => {
  if (isMuted || typeof window === 'undefined') return;

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22); // D6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch {}
};
