import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { videos } from './videos';

const SIZE = { half: { width: 1080, height: 1296 }, full: { width: 1920, height: 1080 } } as const;

export const Root: React.FC = () => (
  <>
    {videos.flatMap((v) => {
      const comps = [
        <Composition key={v.id} id={v.id} component={Video} defaultProps={{ spec: v }}
          fps={v.fps} durationInFrames={Math.round(v.duration * v.fps)} {...SIZE[v.format]} />,
      ];
      // Every video also gets the other size, so a half-frame video can be previewed full-screen and vice versa.
      const other = v.format === 'half' ? 'full' : 'half';
      comps.push(<Composition key={v.id + '-' + other} id={`${v.id}-${other}`} component={Video} defaultProps={{ spec: v }}
        fps={v.fps} durationInFrames={Math.round(v.duration * v.fps)} {...SIZE[other]} />);
      return comps;
    })}
  </>
);
