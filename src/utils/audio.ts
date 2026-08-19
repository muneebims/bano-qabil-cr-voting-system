/**
 * Web Audio API synthesizer for clean, zero-dependency celebration sound
 * Plays a triumphant fanfare arpeggio upon the 100th vote completion
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playCelebrationFanfare(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Victory fanfare notes: C5, E5, G5, C6 with layered harmonics
    const notes = [
      { freq: 523.25, time: 0.00, duration: 0.15, gain: 0.25 }, // C5
      { freq: 659.25, time: 0.15, duration: 0.15, gain: 0.25 }, // E5
      { freq: 783.99, time: 0.30, duration: 0.18, gain: 0.30 }, // G5
      { freq: 1046.50, time: 0.48, duration: 0.70, gain: 0.40 }, // C6
      { freq: 1318.51, time: 0.65, duration: 0.60, gain: 0.25 }, // E6 harmony
      { freq: 1567.98, time: 0.80, duration: 0.80, gain: 0.35 }, // G6 climax
    ];

    notes.forEach(({ freq, time, duration, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth attack and exponential decay
      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + time + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });

    // Add a gentle warm bass foundation note
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(261.63, now + 0.48); // C4
    bassGain.gain.setValueAtTime(0.001, now + 0.48);
    bassGain.gain.exponentialRampToValueAtTime(0.3, now + 0.52);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(now + 0.48);
    bassOsc.stop(now + 1.5);

  } catch {
    // AudioContext blocked or not supported in environment
  }
}

export function playVoteSubmitChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Ignore audio error
  }
}
