import React from 'react';
import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { theme, Variant, segmentStarts } from '../config';
import { clamp } from './anim';

/** Edited speech footage with alternating punch-in levels on every jump cut + slow drift; freezes on the last frame for the outro whip. */
export const InfluencerFootage: React.FC<{ v: Variant; intro?: boolean }> = ({ v, intro = true }) => {
  const frame = useCurrentFrame();
  const starts = segmentStarts(v);
  const levels = theme.motion.punchIn.levels;
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) idx = i;
  const segStart = starts[idx];
  const segEnd = idx + 1 < starts.length ? starts[idx + 1] : v.speechFrames;
  const prog = interpolate(frame, [segStart, segEnd], [0, 1], clamp);
  const scale = levels[idx % levels.length] * (1 + theme.motion.punchIn.drift * prog);
  const blur = intro ? interpolate(frame, [0, 8], [14, 0], clamp) : 0; // reference opens with a defocus pull
  const video = (
    <OffthreadVideo src={staticFile(v.footage)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  );
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: '50% 44%', filter: blur ? `blur(${blur}px)` : undefined }}>
      {frame >= v.speechFrames ? <Freeze frame={v.speechFrames - 1}>{video}</Freeze> : video}
    </AbsoluteFill>
  );
};

export const GradeOverlays: React.FC = () => {
  const g = theme.grade;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${g.topGradient.color} ${g.topGradient.from * 100}%, transparent ${g.topGradient.to * 100}%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent ${g.bottomGradient.from * 100}%, ${g.bottomGradient.color} ${g.bottomGradient.to * 100}%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 42%, transparent 55%, rgba(0,0,0,${g.vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

export const Watermark: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const w = theme.layout.watermark;
  return (
    <img src={src} style={{
      position: 'absolute', left: w.x, top: w.y, height: w.height,
      opacity: interpolate(frame, [4, 14], [0, 0.95], clamp),
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.55))',
    }} />
  );
};
