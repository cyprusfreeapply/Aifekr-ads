import { interpolate, spring, Easing } from 'remotion';
import { FPS, theme } from '../config';

type SpringName = keyof typeof theme.motion.springs;
export const sp = (frame: number, delay = 0, name: SpringName = 'pop') =>
  spring({ frame: frame - delay, fps: FPS, config: theme.motion.springs[name] });

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);

/** 0→1 enter, 1→0 exit over the last `out` frames of a scene of length `dur`. */
export const lifecycle = (frame: number, dur: number, out = theme.motion.durations.cardOut) => {
  const enter = sp(frame, 0, 'pop');
  const exit = interpolate(frame, [dur - out, dur], [1, 0], { ...clamp, easing: easeIn });
  return { enter, exit, vis: Math.min(1, enter) * exit };
};

export const fadeUp = (frame: number, delay: number, dist = 40) => {
  const p = sp(frame, delay, 'pop');
  return {
    opacity: interpolate(frame - delay, [0, 6], [0, 1], clamp),
    transform: `translateY(${(1 - p) * dist}px) scale(${0.92 + 0.08 * p})`,
    filter: `blur(${interpolate(frame - delay, [0, 7], [10, 0], clamp)}px)`,
  };
};
