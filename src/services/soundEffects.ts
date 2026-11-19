// Sound Effects & Speech Synthesis Utilities for WhatsApp Voice Assistant (100% Offline-First)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a pleasant WhatsApp-like "pop" sent sound using Web Audio API
 */
export function playMessageSentSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // audio context not allowed yet
  }
}

/**
 * Plays a classic WhatsApp double-tone incoming message chime
 */
export function playMessageReceivedSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First tone (587 Hz - D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // Second tone (880 Hz - A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.22, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.3);
  } catch {
    // audio context not allowed
  }
}

/**
 * Plays an audio tone simulation for voice notes when the user taps "Play"
 */
export function playVoiceNoteTone(durationSec: number = 3, onProgress?: (pct: number) => void, onEnded?: () => void): () => void {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      if (onEnded) setTimeout(onEnded, durationSec * 1000);
      return () => {};
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    // Soft melody while voice note plays
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(320, now + durationSec * 0.5);
    osc.frequency.linearRampToValueAtTime(280, now + durationSec);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.12, now + durationSec - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min(100, (elapsed / durationSec) * 100);
      if (onProgress) onProgress(pct);
      if (elapsed >= durationSec) {
        clearInterval(interval);
        if (onEnded) onEnded();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    };
  } catch {
    if (onEnded) setTimeout(onEnded, durationSec * 1000);
    return () => {};
  }
}

/**
 * Speaks text using Text-to-Speech (TTS)
 */
export function speakAssistantResponse(text: string, enabled: boolean = true): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // cancel any ongoing speech
    // Clean text of emojis or complex markdown
    const cleanText = text
      .replace(/[👋🎙️🚀🧾📊🏦📦🍽️👥👤🏠📈⏱️✨•\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang.startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // speech synthesis blocked or not permitted
  }
}
