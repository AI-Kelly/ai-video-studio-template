import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { renderScene } from './scenes';
import type { VideoSpec } from './types';

const FADE = 0.5; // seconds each scene takes to fade in over the previous one

const FadeIn: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = first ? 1 : interpolate(f, [0, FADE * fps], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Video: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const { fps } = useVideoConfig();
  const total = Math.round(spec.duration * fps);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {spec.scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const next = spec.scenes[i + 1];
        // keep each scene on screen until the next one has fully faded in
        const end = next ? Math.round((next.start + FADE) * fps) : total;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)} name={`${i + 1}. ${s.type}`}>
            <FadeIn first={i === 0}>{renderScene(s)}</FadeIn>
          </Sequence>
        );
      })}
      {spec.audio && <Audio src={staticFile(spec.audio)} />}
    </AbsoluteFill>
  );
};
