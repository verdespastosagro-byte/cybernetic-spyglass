// Web Audio API based retro terminal sounds

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Keystroke/typing sound
export const playKeystroke = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Random frequency for variation
  oscillator.frequency.value = 800 + Math.random() * 400;
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
};

// Terminal beep sound
export const playBeep = (frequency = 1200, duration = 0.08) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

// Success/connection beep
export const playSuccessBeep = () => {
  const ctx = getAudioContext();
  
  // Two-tone ascending beep
  [800, 1200].forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'square';

    const startTime = ctx.currentTime + i * 0.08;
    gainNode.gain.setValueAtTime(0.05, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.08);
  });
};

// Warning/alert beep
export const playWarningBeep = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 600;
  oscillator.type = 'sawtooth';

  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

// Critical error alarm
export const playErrorAlarm = () => {
  const ctx = getAudioContext();
  
  // Three descending tones for error
  [800, 600, 400].forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sawtooth';

    const startTime = ctx.currentTime + i * 0.12;
    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.12);
  });
};

// Data transmission sound
export const playDataSound = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Rapid frequency modulation for "data" effect
  oscillator.frequency.setValueAtTime(2000, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.1);
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
};

// Boot/startup sound
export const playBootSound = () => {
  const ctx = getAudioContext();
  
  // Ascending sequence for boot
  [200, 400, 600, 800, 1000].forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    const startTime = ctx.currentTime + i * 0.06;
    gainNode.gain.setValueAtTime(0.06, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
  });
};
