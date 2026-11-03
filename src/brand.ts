// ============================================================
//  YOUR BRAND. This is the only file you need to change to make
//  the videos look like yours. Ask Claude: "set up my brand".
// ============================================================
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const BRAND = {
  /** Shown small on the opening scene. */
  name: 'Your Company',

  colors: {
    paper: '#fff9f3',        // light background (never pure white)
    surface: '#f5efe6',      // second light background, used every 2nd or 3rd scene
    line: '#e4ddd4',         // thin borders and empty bars
    primary: '#0d4a54',      // headlines on light, dark scene background
    primaryLift: '#0f5b66',  // lighter shade of primary (dark gradient start)
    primaryShade: '#0a3a42', // darker shade of primary (dark gradient end)
    secondary: '#1a7a8a',    // small labels, step numbers, connector lines
    soft: '#b8dae0',         // soft background glows
    accent: '#d4922a',       // THE one accent: payoff words, highlights, button
    ink: '#1e2430',          // body text, closing scene background
    inkMuted: '#5c6470',     // secondary body text
    headingOnDark: '#f1e9e9',// headline color on the closing scene
    extra: '#8a9a6e',        // one extra color for the opener's color blocks
  },

  // Font files live in public/fonts (.woff2). See "set up my brand" in CLAUDE.md.
  fonts: {
    display: { family: 'Outfit', files: { 400: 'outfit-latin-400-normal.woff2', 500: 'outfit-latin-500-normal.woff2', 600: 'outfit-latin-600-normal.woff2', 700: 'outfit-latin-700-normal.woff2' } },
    body: { family: 'Source Sans 3', files: { 400: 'source-sans-3-latin-400-normal.woff2', 500: 'source-sans-3-latin-500-normal.woff2', 600: 'source-sans-3-latin-600-normal.woff2' } },
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
