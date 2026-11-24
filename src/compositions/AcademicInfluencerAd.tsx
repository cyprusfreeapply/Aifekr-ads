import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { content, getVariant, mapTime, mapWindow, theme, VariantName } from '../config';
import { AcademicFinalCTA } from '../components/AcademicFinalCTA';
import { AnimatedPersianCaptions } from '../components/AnimatedPersianCaptions';
import { clamp, lifecycle } from '../components/anim';
import { ensureFonts } from '../components/fonts';
import { GradeOverlays, InfluencerFootage, Watermark } from '../components/InfluencerFootage';
import { sceneRegistry } from '../components/Scenes';

export type AdProps = { variant: VariantName; safeAreaDebug?: boolean };

const SceneHost: React.FC<{ scene: any; dur: number; startSec: number; variant: string; vName: VariantName }> = ({ scene, dur, vName, variant }) => {
  const f = useCurrentFrame();
  const v = getVariant(vName);
  const start = mapTime(v, scene.s);
  const Comp = sceneRegistry[scene.type];
  const { exit } = lifecycle(f, dur);
  const z = theme.layout.topZone;
  if (!Comp) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: z.y, height: z.height, left: z.centerX - z.maxWidth / 2, width: z.maxWidth,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: exit, transform: `translateY(${(1 - exit) * -30}px) scale(${0.96 + 0.04 * exit})`,
      }}>
        <Comp s={scene} f={f} dur={dur} at={(sec) => mapTime(v, sec) - start} variant={variant} />
      </div>
    </AbsoluteFill>
  );
};

const SafeAreaDebug: React.FC = () => {
  const s = theme.layout.safeArea;
  return <div style={{ position: 'absolute', left: s.left, right: s.right, top: s.top, bottom: s.bottom, border: '3px dashed #0f0' }} />;
};

export const AcademicInfluencerAd: React.FC<AdProps> = ({ variant, safeAreaDebug }) => {
  ensureFonts();
  const v = getVariant(variant);
  const frame = useCurrentFrame();
  const scenes = content.scenes.filter((s: any) => !s.variants || s.variants.includes(variant));
  const whip = interpolate(frame, [v.speechFrames - 6, v.speechFrames + 8], [0, -1080], clamp);
  const whipBlur = interpolate(frame, [v.speechFrames - 6, v.speechFrames, v.speechFrames + 8], [0, 22, 0], clamp);
  const sfxVol = theme.audio.sfxVolume;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.charcoal }}>
      {frame < v.speechFrames + 10 && (
        <AbsoluteFill style={{ transform: `translateX(${whip}px)`, filter: whipBlur ? `blur(${whipBlur}px)` : undefined }}>
          <InfluencerFootage v={v} intro={variant !== 'story'} />
          <GradeOverlays />
          <Watermark src={staticFile(content.brand.logo)} />
          {scenes.map((sc: any) => {
            const w = mapWindow(v, sc.s, sc.e);
            if (w.dur < 8) return null;
            return (
              <Sequence key={sc.id} from={w.from} durationInFrames={w.dur} layout="none">
                <SceneHost scene={sc} dur={w.dur} startSec={sc.s} variant={variant} vName={variant} />
              </Sequence>
            );
          })}
          {v.captions && <AnimatedPersianCaptions v={v} />}
        </AbsoluteFill>
      )}
      <Sequence from={v.speechFrames} durationInFrames={v.outroFrames} layout="none">
        <AcademicFinalCTA dur={v.outroFrames} storyMode={v.storyMode} />
      </Sequence>
      {/* sound design */}
      {scenes.flatMap((sc: any) => {
        const w = mapWindow(v, sc.s, sc.e);
        if (w.dur < 8) return [];
        return (sc.sfx ?? []).map(([t, name]: [number, string], i: number) => {
          const at = mapTime(v, t);
          if (at < w.from || at >= w.to) return null;
          return (
            <Sequence key={`${sc.id}-${i}`} from={at} durationInFrames={45} layout="none">
              <Audio src={staticFile(`generated/sfx/${name}.wav`)} volume={sfxVol} />
            </Sequence>
          );
        });
      })}
      <Sequence from={v.speechFrames - 6} durationInFrames={30} layout="none"><Audio src={staticFile('generated/sfx/whoosh.wav')} volume={sfxVol * 1.2} /></Sequence>
      <Sequence from={v.speechFrames + 28} durationInFrames={30} layout="none"><Audio src={staticFile('generated/sfx/impact.wav')} volume={sfxVol * 0.8} /></Sequence>
      <Sequence from={v.total - 22} durationInFrames={22} layout="none"><Audio src={staticFile('generated/sfx/flare.wav')} volume={sfxVol} /></Sequence>
      {safeAreaDebug && <SafeAreaDebug />}
    </AbsoluteFill>
  );
};
