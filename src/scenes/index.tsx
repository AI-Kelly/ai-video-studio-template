import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { alpha, BRAND, C, DISPLAY } from '../brand';
import { progress, reveal } from '../motion';
import { CheckBadge, Eyebrow, Headline, local, SceneFrame, Sub, Wash } from '../primitives';
import type { SceneSpec } from '../types';

type Of<T extends SceneSpec['type']> = Extract<SceneSpec, { type: T }>;
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps }; };

// ---------- HOOK (dark, color blocks drop in) ----------
export const Hook: React.FC<{ s: Of<'hook'> }> = ({ s }) => {
  const { f, fps } = useT();
  const blocks = [
    { left: '0%', width: '44%', bg: `${alpha(C.paper, .06)}` },
    { left: '47%', width: '20%', bg: C.secondary },
    { left: '70%', width: '12%', bg: C.accent },
    { left: '85%', width: '20%', bg: C.extra },
  ];
  return (
    <SceneFrame bg="dark" decor={
      <div style={{ position: 'absolute', top: '-1.6em', left: 0, right: 0, height: '13em', zIndex: 1 }}>
        {blocks.map((b, i) => {
          const p = progress(f, fps, i * 0.1, 0.8);
          return <span key={i} style={{ position: 'absolute', top: 0, height: '100%', borderRadius: '1.6em', left: b.left, width: b.width, background: b.bg, transform: `translateY(${(p - 1) * 100}%)` }} />;
        })}
      </div>
    }>
      <Eyebrow text={s.eyebrow} dark at={0.3} />
      <Headline text={s.headline} size="h1" color={C.paper} at={0.45} />
      {s.sub && <Sub text={s.sub} dark at={local(s.subAt, s.start, 0.75)} />}
      <div style={{ fontFamily: DISPLAY, fontSize: '1.4em', fontWeight: 600, letterSpacing: '0.02em', color: `${alpha(C.paper, .6)}`, marginTop: '4em', ...reveal(f, fps, 1.05, 'fade') }}>
        {s.mark ?? BRAND.name}
      </div>
    </SceneFrame>
  );
};

// ---------- STATEMENT (headline + optional sub, any background) ----------
export const Statement: React.FC<{ s: Of<'statement'> }> = ({ s }) => {
  const bg = s.bg ?? 'light'; const dark = bg === 'dark' || bg === 'ink';
  return (
    <SceneFrame bg={bg} decor={!dark && <Wash kind="mist" style={{ width: '50em', height: '50em', right: '-18em', top: '-14em' }} />}>
      <Eyebrow text={s.eyebrow} dark={dark} />
      <Headline text={s.headline} color={dark ? C.paper : C.primary} />
      {s.sub && <Sub text={s.sub} dark={dark} at={local(s.subAt, s.start, 0.3)} />}
    </SceneFrame>
  );
};

// ---------- INBOX (an ignored email: folder, tag, wall of text, badge) ----------
const WALL = [[0, 96], [0, 88], [0, 92], [1, 80], [1, 84], [1, 70], [0, 94], [0, 90], [1, 78], [1, 86], [1, 64], [0, 60]];
export const Inbox: React.FC<{ s: Of<'inbox'> }> = ({ s }) => {
  const { f, fps } = useT();
  const L = (at?: number) => local(at, s.start, 0.45);
  const pop = (at?: number) => reveal(f, fps, L(at), 'pop');
  return (
    <SceneFrame bg={s.bg ?? 'surface'} decor={<Wash kind="warm" style={{ width: '50em', height: '50em', right: '-18em', top: '-14em' }} />}>
      <Eyebrow text={s.eyebrow} />
      <Headline text={s.headline} />
      <div style={{ marginTop: '3.6em', background: C.paper, border: `1px solid ${C.line}`, borderRadius: '1.6em', boxShadow: `0 20px 50px ${alpha(C.primary, .10)}`, overflow: 'hidden', position: 'relative', ...reveal(f, fps, 0.45) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em', padding: '1.6em 2.2em', borderBottom: `1px solid ${C.line}`, background: C.surface, minHeight: '5.2em' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.6em', color: C.primary, ...reveal(f, fps, L(s.folderAt), 'left') }}>{s.folder}</span>
          <span style={{ marginLeft: 'auto', fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.3em', letterSpacing: '0.12em', textTransform: 'uppercase', background: C.accent, color: C.onAccent, padding: '0.45em 0.9em', borderRadius: '0.5em', ...pop(s.tagAt) }}>{s.tag}</span>
        </div>
        <div style={{ padding: '2em 2.2em 0.6em', fontFamily: DISPLAY, fontSize: '1.7em', color: C.inkMuted }}><b style={{ color: C.ink, fontWeight: 600 }}>{s.from.split('·')[0]}</b>{s.from.includes('·') ? ' · ' + s.from.split('·')[1].trim() : ''}</div>
        <div style={{ padding: '0 2.2em', fontFamily: DISPLAY, fontSize: '2.1em', fontWeight: 600, color: C.ink }}>{s.subject}</div>
        <div style={{ padding: '1.8em 2.2em 2.6em' }}>
          {WALL.map(([b, w], i) => (
            <i key={i} style={{ display: 'block', height: '0.75em', borderRadius: '0.4em', background: C.line, margin: '0.9em 0', marginLeft: b ? '2em' : 0, width: `${w}%`, ...reveal(f, fps, L(s.wallAt) + i * 0.07, 'fade', 0.35) }} />
          ))}
        </div>
        <div style={{ position: 'absolute', right: '2.2em', bottom: '2.2em', fontFamily: DISPLAY, fontSize: '1.5em', fontWeight: 600, color: C.inkMuted, background: C.surface, border: `1px solid ${C.line}`, padding: '0.5em 1em', borderRadius: '2em', ...pop(s.badgeAt) }}>{s.badge}</div>
      </div>
    </SceneFrame>
  );
};

// ---------- STEPS (vertical flow, last step highlighted) ----------
export const Steps: React.FC<{ s: Of<'steps'> }> = ({ s }) => {
  const { f, fps } = useT();
  return (
    <SceneFrame bg={s.bg ?? 'light'} decor={<Wash kind="mist" style={{ width: '50em', height: '50em', left: '-20em', bottom: '-20em' }} />}>
      <Eyebrow text={s.eyebrow} />
      <Headline text={s.headline} />
      <div style={{ marginTop: '3.6em', display: 'flex', flexDirection: 'column' }}>
        {s.steps.map((st, i) => {
          const at = local(st.at, s.start, 0.45 + i * 0.15);
          const hl = i === s.steps.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: '0.25em', height: '2.6em', marginLeft: '4.6em', background: C.secondary, transformOrigin: 'top', transform: `scaleY(${progress(f, fps, Math.max(0, at - 0.2), 0.45)})` }} />}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '2em', borderRadius: '1.6em', padding: '2.2em 2.4em',
                background: hl ? C.primary : C.paper, border: `1px solid ${hl ? C.primary : C.line}`,
                boxShadow: hl ? `0 22px 50px ${alpha(C.primary, .22)}` : `0 4px 16px ${alpha(C.primary, .04)}`, ...reveal(f, fps, at),
              }}>
                <span style={{ flexShrink: 0, width: '4.6em', height: '4.6em', borderRadius: '0.9em', background: hl ? C.accent : C.surface, color: hl ? C.onAccent : C.secondary, fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.3em', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontSize: '2.4em', fontWeight: 600, color: hl ? C.paper : C.primary, letterSpacing: '-0.01em' }}>{st.title}</div>
                  <div style={{ fontSize: '1.6em', color: hl ? `${alpha(C.paper, .72)}` : C.inkMuted, marginTop: '0.2em' }}>{st.text}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};

// ---------- SCREENSHOT (real image with accent highlight boxes) ----------
export const Screenshot: React.FC<{ s: Of<'screenshot'> }> = ({ s }) => {
  const { f, fps } = useT();
  return (
    <SceneFrame bg={s.bg ?? 'light'}>
      <Eyebrow text={s.eyebrow} />
      <Headline text={s.headline} />
      <div style={{ position: 'relative', marginTop: '3em', borderRadius: '1.8em', overflow: 'hidden', border: `1px solid ${C.line}`, boxShadow: `0 20px 50px ${alpha(C.primary, .12)}`, background: '#fff', ...reveal(f, fps, 0.45) }}>
        <Img src={staticFile(s.image)} style={{ display: 'block', width: '100%', height: 'auto' }} />
        {(s.highlights ?? []).map((h, i) => {
          const p = progress(f, fps, local(h.at, s.start, 0.9 + i * 0.15), 0.5);
          return <div key={i} style={{ position: 'absolute', top: `${h.top}%`, height: `${h.height}%`, left: `${h.left ?? 1.5}%`, right: `${h.right ?? 1.5}%`, border: `0.3em solid ${C.accent}`, borderRadius: '1em', background: `${alpha(C.accent, .08)}`, opacity: p, transform: `scale(${1.04 - p * 0.04})` }} />;
        })}
      </div>
    </SceneFrame>
  );
};

// ---------- STAT (big number that counts up) ----------
export const Stat: React.FC<{ s: Of<'stat'> }> = ({ s }) => {
  const { f, fps } = useT();
  const at = local(s.at, s.start, 0.45);
  const v = Math.round(interpolate(f, [at * fps, (at + 1.5) * fps], [0, s.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }));
  return (
    <SceneFrame bg={s.bg ?? 'light'}>
      <Eyebrow text={s.eyebrow} />
      <Headline text={s.headline} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.6em', marginTop: '2em', ...reveal(f, fps, at) }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '11em', fontWeight: 700, color: C.accent, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.prefix ?? ''}{v.toLocaleString()}{s.suffix ?? ''}</span>
        <span style={{ fontFamily: DISPLAY, fontSize: '2.4em', fontWeight: 500, color: C.primary, lineHeight: 1.25, maxWidth: '12em' }}>{s.label}</span>
      </div>
    </SceneFrame>
  );
};

// ---------- QUOTE (dark, underline draws in) ----------
export const Quote: React.FC<{ s: Of<'quote'> }> = ({ s }) => {
  const { f, fps } = useT();
  const parts = s.text.split(/\*(.+?)\*/g);
  return (
    <SceneFrame bg="dark">
      <div style={{ fontFamily: DISPLAY, fontSize: '12em', lineHeight: 0.6, color: C.accent, opacity: 0.9 * progress(f, fps, 0), height: '0.5em' }}>&ldquo;</div>
      <p style={{ fontFamily: DISPLAY, fontSize: '4.6em', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.paper, marginTop: '0.5em', ...reveal(f, fps, 0.15) }}>
        {parts.map((p, i) => (i % 2 ? <em key={i} style={{ color: C.accent, fontStyle: 'italic', fontWeight: 700 }}>{p}</em> : p))}
      </p>
      <span style={{ display: 'block', height: '0.25em', width: '9em', background: C.accent, marginTop: '3.4em', borderRadius: 2, transformOrigin: 'left', transform: `scaleX(${progress(f, fps, 1, 0.8)})` }} />
    </SceneFrame>
  );
};

// ---------- CTA (ink, centered: checks, accent button, footer line) ----------
export const Cta: React.FC<{ s: Of<'cta'> }> = ({ s }) => {
  const { f, fps } = useT();
  const btnAt = local(s.button.at, s.start, 0.9);
  const nudge = interpolate((f / fps - btnAt - 1.6) % 1.6, [0, 0.8, 1.6], [0, 4, 0]);
  const nudging = f / fps > btnAt + 1.6 && f / fps < btnAt + 1.6 + 3.2;
  return (
    <SceneFrame bg="ink" center decor={<div style={{ position: 'absolute', width: '70em', height: '70em', left: '50%', top: '55%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${alpha(C.accent, .16)}, transparent 60%)`, zIndex: 1 }} />}>
      <Eyebrow text={s.eyebrow} dark center />
      <Headline text={s.headline} color={C.headingOnDark} />
      <ul style={{ listStyle: 'none', margin: '3.4em auto 0', maxWidth: '36em', textAlign: 'left', padding: 0 }}>
        {s.checks.map((c, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.4em', fontFamily: DISPLAY, fontSize: '2.1em', color: `${alpha(C.paper, .88)}`, padding: '0.7em 0', borderBottom: i < s.checks.length - 1 ? `1px solid ${alpha(C.paper, .08)}` : 'none', ...reveal(f, fps, local(c.at, s.start, 0.45 + i * 0.15), 'left') }}>
            <CheckBadge />{c.text}
          </li>
        ))}
      </ul>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8em', marginTop: '3.6em', background: C.accent, color: C.onAccent, fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.9em', padding: '1em 1.8em', borderRadius: '0.6em', boxShadow: `0 8px 24px ${alpha(C.accent, .28)}`, ...reveal(f, fps, btnAt) }}>
        {s.button.text} <span style={{ display: 'inline-block', transform: `translateX(${nudging ? nudge : 0}px)` }}>&rarr;</span>
      </div>
      {s.footer && <p style={{ fontSize: '1.6em', color: `${alpha(C.paper, .6)}`, marginTop: '1.6em', ...reveal(f, fps, local(s.footer.at, s.start, 1.2), 'fade') }}>{s.footer.text}</p>}
    </SceneFrame>
  );
};

export const renderScene = (s: SceneSpec) => {
  switch (s.type) {
    case 'hook': return <Hook s={s} />;
    case 'statement': return <Statement s={s} />;
    case 'inbox': return <Inbox s={s} />;
    case 'steps': return <Steps s={s} />;
    case 'screenshot': return <Screenshot s={s} />;
    case 'stat': return <Stat s={s} />;
    case 'quote': return <Quote s={s} />;
    case 'cta': return <Cta s={s} />;
  }
};
