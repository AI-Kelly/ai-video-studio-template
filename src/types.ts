import type { Background } from './brand';

// All times are in SECONDS FROM THE START OF THE AUDIO (absolute), taken from the
// word timings in words.json. Omit a cue time to have the item come in with the scene.

export type Highlight = { at?: number; top: number; height: number; left?: number; right?: number };

export type SceneSpec =
  | { type: 'hook'; start: number; eyebrow: string; headline: string; sub?: string; subAt?: number; mark?: string }
  | { type: 'statement'; start: number; bg?: Background; eyebrow: string; headline: string; sub?: string; subAt?: number }
  | {
      type: 'inbox'; start: number; bg?: Background; eyebrow: string; headline: string;
      folder: string; folderAt?: number; tag: string; tagAt?: number; from: string; subject: string;
      badge: string; badgeAt?: number; wallAt?: number;
    }
  | { type: 'steps'; start: number; bg?: Background; eyebrow: string; headline: string; steps: { title: string; text: string; at?: number }[] }
  | { type: 'screenshot'; start: number; bg?: Background; eyebrow: string; headline: string; image: string; highlights?: Highlight[] }
  | { type: 'stat'; start: number; bg?: Background; eyebrow: string; headline: string; value: number; prefix?: string; suffix?: string; label: string; at?: number }
  | { type: 'quote'; start: number; text: string }
  | {
      type: 'cta'; start: number; eyebrow: string; headline: string;
      checks: { text: string; at?: number }[]; button: { text: string; at?: number }; footer?: { text: string; at?: number };
    };

export type VideoSpec = {
  id: string;            // composition id, letters/numbers/dashes
  format: 'half' | 'full'; // half = 5:6 (left half of a 16:9 talking-head frame), full = 16:9
  fps: number;
  duration: number;      // seconds (length of the audio)
  audio?: string;        // path inside public/ (leave out for a silent video)
  scenes: SceneSpec[];
};
