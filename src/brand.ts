// ============================================================
//  YOUR BRAND. This is the only file you need to change to make
//  the videos look like yours. Ask Claude: "set up my brand".
//  The defaults below are a plain, neutral placeholder look.
// ============================================================
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const BRAND = {
  /** Shown small on the opening scene. */
  name: 'Your Company',

  colors: {
    paper: '#faf9f7',        // light background (never pure white)
    surface: '#f1f0ed',      // second light background, used every 2nd or 3rd scene
    line: '#e2e0dc',         // thin borders and empty bars
    primary: '#2b2f36',      // headlines on light, dark scene background
    primaryLift: '#3a3f48',  // lighter shade of primary (dark gradient start)
    primaryShade: '#1e2126', // darker shade of primary (dark gradient end)
    secondary: '#6b7280',    // small labels, step numbers, connector lines
    soft: '#d9dce1',         // soft background glows
    accent: '#3f6fd9',       // THE one accent: payoff words, highlights, button
    onAccent: '#faf9f7',     // text and check marks drawn ON the accent color (must be readable on it)
    ink: '#22252a',          // body text, closing scene background
    inkMuted: '#6b6f76',     // secondary body text
    headingOnDark: '#f3f3f1',// headline color on the closing scene
    extra: '#9aa0a8',        // one extra color for the opener's color blocks
  },

  // Font files live in public/fonts (.woff2). See "set up my brand" in CLAUDE.md.
  fonts: {
    display: { family: 'Inter', files: { 400: 'inter-latin-400-normal.woff2', 500: 'inter-latin-500-normal.woff2', 600: 'inter-latin-600-normal.woff2', 700: 'inter-latin-700-normal.woff2' } },
    body: { family: 'Inter', files: { 400: 'inter-latin-400-normal.woff2', 500: 'inter-latin-500-normal.woff2', 600: 'inter-latin-600-normal.woff2' } },
  },
};

// ---------- nothing below needs changing ----------
export const C = BRAND.colors;

/** A brand color at a given opacity, e.g. alpha(C.accent, 0.2). */
export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const { display, body } = BRAND.fonts;
for (const [w, file] of Object.entries(display.files)) loadFont({ family: display.family, url: staticFile(`fonts/${file}`), weight: w });
for (const [w, file] of Object.entries(body.files)) loadFont({ family: body.family, url: staticFile(`fonts/${file}`), weight: w });
export const DISPLAY = `'${display.family}', sans-serif`;
export const BODY = `'${body.family}', sans-serif`;

export type Background = 'light' | 'surface' | 'dark' | 'ink';
export const BG: Record<Background, string> = {
  light: C.paper,
  surface: C.surface,
  dark: `linear-gradient(150deg, ${C.primaryLift}, ${C.primary} 55%, ${C.primaryShade})`,
  ink: C.ink,
};
export const isDark = (b: Background) => b === 'dark' || b === 'ink';
