import React from 'react';
import { interpolate } from 'remotion';
import { C, content, EN, FA } from '../config';
import { clamp, sp } from './anim';
import { Sweep } from './ui';

/** Reusable CFA invitation-code card. Code text comes from content.brand.referralCode (single source of truth). */
export const ReferralCodeCard: React.FC<{ f: number; scale?: number; showSite?: boolean }> = ({ f, scale = 1, showSite = true }) => {
  const code = content.brand.referralCode;
  const p = sp(f, 0, 'pop');
  const sweep = interpolate(f, [16, 40], [0, 1], clamp);
  const breathe = 0.5 + 0.5 * Math.sin(f / 14);
  return (
    <div style={{
      position: 'relative', width: 760 * scale, padding: `${30 * scale}px ${40 * scale}px ${32 * scale}px`,
      borderRadius: 40 * scale, textAlign: 'center',
      background: 'linear-gradient(160deg, #2E3239 0%, #17191D 100%)',
      border: `${3 * scale}px solid ${C.orange}`,
      boxShadow: `0 0 ${30 + 16 * breathe}px rgba(255,107,0,${0.28 + 0.12 * breathe}), 0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)`,
      transform: `scale(${0.82 + 0.18 * p})`, opacity: interpolate(f, [0, 6], [0, 1], clamp),
    }}>
      <div dir="rtl" style={{ fontFamily: FA, fontWeight: 700, fontSize: 40 * scale, color: C.white }}>{content.referralCard.title}</div>
      <div dir="ltr" style={{ display: 'flex', justifyContent: 'center', gap: 18 * scale, margin: `${6 * scale}px 0 ${2 * scale}px` }}>
        {code.split('').map((ch, i) => {
          const lp = sp(f, 6 + i * 4, 'bouncy');
          return (
            <span key={i} style={{
              fontFamily: EN, fontWeight: 900, fontSize: 168 * scale, lineHeight: 1.05, color: C.orange,
              display: 'inline-block', transform: `translateY(${(1 - lp) * 60 * scale}px) scale(${0.5 + 0.5 * lp})`,
              opacity: interpolate(f - 6 - i * 4, [0, 4], [0, 1], clamp),
              textShadow: '0 0 28px rgba(255,107,0,0.6), 0 6px 18px rgba(0,0,0,0.5)', letterSpacing: '0.02em',
            }}>{ch}</span>
          );
        })}
      </div>
      <div dir="rtl" style={{ fontFamily: FA, fontWeight: 500, fontSize: 34 * scale, color: C.textSecondary }}>{content.referralCard.hint}</div>
      {showSite && (
        <div dir="ltr" style={{ fontFamily: EN, fontWeight: 700, fontSize: 36 * scale, color: C.white, marginTop: 8 * scale, letterSpacing: '0.01em' }}>
          {content.brand.website}
        </div>
      )}
      <Sweep p={sweep} radius={40 * scale} />
    </div>
  );
};
