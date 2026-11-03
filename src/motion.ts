import { Easing, interpolate } from 'remotion';

// Same easing as the HTML decks: cubic-bezier(0.25,0.46,0.45,0.94)
export const EASE = Easing.bezier(0.25, 0.46, 0.45, 0.94);

export type Kind = 'up' | 'left' | 'right' | 'scale' | 'fade' | 'pop';

/** Progress 0..1 of an entrance that starts at `startSec` (scene-local) and lasts `dur` seconds. */
export const progress = (frame: number, fps: number, startSec: number, dur = 0.7) =>
  interpolate(frame, [startSec * fps, (startSec + dur) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

/** Style for an element that animates in at `startSec`. */
export const reveal = (frame: number, fps: number, startSec: number, kind: Kind = 'up', dur?: number): React.CSSProperties => {
  const d = dur ?? (kind === 'pop' ? 0.6 : 0.7);
  const p = progress(frame, fps, startSec, d);
  const t =
    kind === 'up' ? `translateY(${(1 - p) * 30}px)` :
    kind === 'left' ? `translateX(${(1 - p) * -40}px)` :
    kind === 'right' ? `translateX(${(1 - p) * 40}px)` :
    kind === 'scale' ? `scale(${0.92 + p * 0.08})` :
    kind === 'pop' ? `scale(${0.6 + p * 0.4})` : 'none';
  return { opacity: p, transform: t };
};
