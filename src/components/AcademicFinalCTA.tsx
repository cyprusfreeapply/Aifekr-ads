import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, content, EN, FA } from '../config';
import { clamp, ease, fadeUp, sp } from './anim';
import { ReferralCodeCard } from './ReferralCodeCard';
import { Txt } from './ui';

/** Brand panel that slides in from the right as the footage whips left (reference 00:62), ending on a lens flare to black (reference 00:64). */
export const AcademicFinalCTA: React.FC<{ dur: number; storyMode: boolean }> = ({ dur, storyMode }) => {
  const f = useCurrentFrame();
  const o = content.outro;
  const slide = interpolate(f, [-6, 8], [1080, 0], { ...clamp, easing: ease });
  const logoP = sp(f, 6, 'smooth');
  const logoSweep = interpolate(f, [16, 40], [0, 1], clamp);
  const flareStart = dur - 20;
  const flare = interpolate(f, [flareStart, flareStart + 10, dur], [0, 1, 0.6], clamp);
  const toBlack = interpolate(f, [flareStart + 6, dur - 2], [0, 1], clamp);
  const logo = staticFile(content.brand.logo);
  const y = storyMode
    ? { logo: 230, head: 610, card: 905, ins: 1290 }
    : { logo: 290, head: 690, card: 1000, ins: 1400 };
  return (
    <AbsoluteFill style={{ transform: `translateX(${slide}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 55% at 50% 22%, #3A3029 0%, ${C.graphite} 38%, ${C.charcoal} 100%)` }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const x1 = (i * 157 + f * 0.8) % 1200 - 60, y1 = 120 + ((i * 263) % 1700);
          const x2 = (i * 211 + 300 + f * 0.5) % 1200 - 60, y2 = 200 + ((i * 377) % 1650);
          return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.orange} strokeWidth={1.2} /><circle cx={x1} cy={y1} r={4} fill={C.orange} /></g>;
        })}
      </svg>
      <div style={{ position: 'absolute', top: y.logo, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 380, height: 356, opacity: logoP, transform: `scale(${0.85 + 0.15 * logoP})`, filter: `blur(${(1 - logoP) * 12}px)` }}>
          <Img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: `url(${logo})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '35%', left: `${-40 + logoSweep * 150}%`, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)', opacity: logoSweep > 0 && logoSweep < 1 ? 1 : 0 }} />
          </div>
        </div>
      </div>
      <div dir="rtl" style={{ position: 'absolute', top: y.head, left: 90, right: 90, textAlign: 'center' }}>
        <div style={{ ...fadeUp(f, 12, 40), fontFamily: FA, fontWeight: 900, fontSize: 84, color: C.orange, lineHeight: 1.25, textShadow: '0 0 30px rgba(255,107,0,0.45)' }}>{o.headline[0]}</div>
        <div style={{ ...fadeUp(f, 16, 40), fontFamily: FA, fontWeight: 900, fontSize: 80, color: C.white, lineHeight: 1.25 }}>{o.headline[1]}</div>
        <div style={{ ...fadeUp(f, 20, 30), fontFamily: FA, fontWeight: 600, fontSize: 40, color: C.textSecondary, marginTop: 10 }}>{o.subline}</div>
      </div>
      <div style={{ position: 'absolute', top: y.card, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        {f >= 22 && <ReferralCodeCard f={f - 22} scale={0.95} showSite={false} />}
      </div>
      <div dir="rtl" style={{ position: 'absolute', top: y.ins, left: 90, right: 90, textAlign: 'center', ...fadeUp(f, 34, 30) }}>
        <Txt style={{ fontWeight: 800, fontSize: 46, color: C.white }}>{o.instruction}</Txt>
        <div dir="ltr" style={{ fontFamily: EN, fontWeight: 600, fontSize: 32, color: C.textSecondary, marginTop: 10 }}>{content.brand.instagram}</div>
      </div>
      {/* lens flare + fade to black */}
      <AbsoluteFill style={{ background: '#000', opacity: toBlack }} />
      <AbsoluteFill style={{ opacity: flare, mixBlendMode: 'screen', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: -200, right: -200, top: 951, height: 18, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95), rgba(255,170,110,0.35) 40%, transparent 70%)', filter: 'blur(3px)' }} />
        <div style={{ position: 'absolute', left: 540 - 60, top: 960 - 22, width: 120, height: 44, borderRadius: '50%', background: 'radial-gradient(ellipse, #fff 0%, rgba(255,210,170,0.6) 45%, transparent 75%)' }} />
        <div style={{ position: 'absolute', left: 540 - 400, top: 960 - 400, width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.22) 0%, transparent 60%)' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
