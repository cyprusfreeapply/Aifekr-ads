import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile } from 'remotion';
import { C, content, EN, FA, getVariant, mapTime } from '../config';
import { ensureFonts } from '../components/fonts';
import { GradeOverlays } from '../components/InfluencerFootage';

export const ReelCover: React.FC = () => {
  ensureFonts();
  const v = getVariant('full');
  const at = mapTime(v, content.cover.frameAt);
  const h = content.cover.headline;
  return (
    <AbsoluteFill style={{ backgroundColor: C.charcoal }}>
      <AbsoluteFill style={{ transform: 'scale(1.06)', transformOrigin: '50% 40%' }}>
        <Freeze frame={at}><OffthreadVideo src={staticFile(v.footage)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Freeze>
      </AbsoluteFill>
      <GradeOverlays />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 56%, rgba(14,15,18,0.97) 86%)' }} />
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Img src={staticFile(content.brand.logo)} style={{ height: 200, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.7))' }} />
      </div>
      <div dir="rtl" style={{ position: 'absolute', top: 1265, left: 80, right: 80, textAlign: 'center', fontFamily: FA, fontWeight: 900, lineHeight: 1.2 }}>
        <div style={{ fontSize: 104, color: C.orange, textShadow: '0 0 34px rgba(255,107,0,0.5)' }}>{h[0]}</div>
        <div style={{ fontSize: 96, color: C.white, textShadow: '0 6px 24px rgba(0,0,0,0.7)' }}>{h[1]}</div>
        <div style={{ fontSize: 96, color: C.white, textShadow: '0 6px 24px rgba(0,0,0,0.7)' }}>{h[2]}</div>
      </div>
      <div style={{ position: 'absolute', top: 1665, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div dir="rtl" style={{ fontFamily: FA, fontWeight: 800, fontSize: 40, color: C.white, border: `3px solid ${C.orange}`, borderRadius: 999, padding: '8px 36px', background: 'rgba(23,25,29,0.8)' }}>
          کد دعوت: <span dir="ltr" style={{ fontFamily: EN, fontWeight: 900, color: C.orange }}>{content.brand.referralCode}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
