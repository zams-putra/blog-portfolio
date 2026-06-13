import { useRef, useCallback } from "react";

export function useTypingSound({
  frequency = 520,
  randomRange = 80,
  volume = 0.04,
  duration = 0.06,
  type = "square",
} = {}) {
  const ctxRef = useRef(null);

  const play = useCallback(() => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(
        frequency + Math.random() * randomRange,
        ctx.currentTime
      );

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      /* AudioContext tidak tersedia — abaikan */
    }
  }, [frequency, randomRange, volume, duration, type]);

  return play;
}