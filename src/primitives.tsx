import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { alpha, BG, BODY, C, DISPLAY, isDark, type Background } from './brand';
import { reveal } from './motion';

/** Base size: every measurement inside a scene is in em so it scales with the frame. */
export const useBase = () => {
  const { width, height } = useVideoConfig();
  const portraitish = width / height < 1.2;
  return portraitish ? Math.min(height * 0.016, width * 0.01333) : height * 0.0135;
};

export const SceneFrame: React.FC<{ bg: Background; center?: boolean; children: React.ReactNode; decor?: React.ReactNode }> = ({ bg, center, children, decor }) => {
  const base = useBase();
  const { width, height } = useVideoConfig();
  const wide = width / height >= 1.2;
  return (
    <AbsoluteFill style={{ background: BG[bg], fontSize: base, fontFamily: BODY, overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }} className={isDark(bg) ? 'dark' : ''}>
      {decor}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: wide ? '96em' : undefined, padding: '5.5em 6em', position: 'relative', zIndex: 2, textAlign: center ? 'center' : 'left' }}>
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Turns "Plain words *accent words*" into a headline with one accent italic payoff. */
export const Accent: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? <em key={i} style={{ color: C.accent, fontStyle: 'italic', fontWeight: 700 }}>{p}</em> : <React.Fragment key={i}>{p}</React.Fragment>,
      )}
    </>
  );
};

export const Eyebrow: React.FC<{ text: string; dark?: boolean; at?: number; center?: boolean }> = ({ text, dark, at = 0, center }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const col = dark ? C.accent : C.secondary;
  return (
    <div style={{ display: 'flex', justifyContent: center ? 'center' : 'flex-start', marginBottom: '2.2em' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1em', ...reveal(f, fps, at, center ? 'up' : 'left') }}>
        <span style={{ width: '2.8em', height: '0.2em', borderRadius: 2, background: col }} />
        <span style={{ fontFamily: DISPLAY, fontSize: '1.25em', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: col }}>{text}</span>
      </div>
    </div>
  );
};

export const Headline: React.FC<{ text: string; size?: 'h1' | 'h2'; color?: string; at?: number }> = ({ text, size = 'h2', color = C.primary, at = 0.15 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const h1 = size === 'h1';
  return (
    <div style={{
      fontFamily: DISPLAY, color, fontSize: h1 ? '6.6em' : '4.8em', fontWeight: h1 ? 500 : 600,
      letterSpacing: h1 ? '-0.035em' : '-0.025em', lineHeight: h1 ? 1 : 1.04, ...reveal(f, fps, at),
    }}>
      <Accent text={text} />
    </div>
  );
};

export const Sub: React.FC<{ text: string; dark?: boolean; at?: number }> = ({ text, dark, at = 0.3 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <p style={{ fontSize: '1.9em', lineHeight: 1.55, color: dark ? `${alpha(C.paper, .72)}` : C.inkMuted, marginTop: '1.4em', maxWidth: '28em', ...reveal(f, fps, at) }}>{text}</p>
  );
};

export const Wash: React.FC<{ kind: 'mist' | 'warm'; style: React.CSSProperties }> = ({ kind, style }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%', filter: 'blur(10px)', zIndex: 1, ...style,
    background: kind === 'mist' ? `radial-gradient(circle, ${alpha(C.soft, .55)}, transparent 65%)` : `radial-gradient(circle, ${alpha(C.line, .6)}, transparent 65%)`,
  }} />
);

export const CheckBadge: React.FC = () => (
  <span style={{ flexShrink: 0, width: '1.6em', height: '1.6em', borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg viewBox="0 0 16 16" fill="none" style={{ width: '0.95em', height: '0.95em' }}>
      <path d="M3.5 8.5l3 3 6-7" stroke={C.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

/** Convert an absolute cue (seconds from audio start) into scene-local seconds. */
export const local = (at: number | undefined, sceneStart: number, fallback: number) =>
  at === undefined ? fallback : Math.max(0, at - sceneStart);
