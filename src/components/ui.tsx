import React from 'react';
import { C, EN, FA, isLatin } from '../config';

export const glass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(41,45,51,0.90) 0%, rgba(23,25,29,0.88) 100%)',
  border: '1.5px solid rgba(255,255,255,0.10)',
  borderRadius: 34,
  boxShadow: '0 28px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
  backdropFilter: 'blur(18px)',
};

/** Renders a string; Latin runs (ChatGPT, AIFekr.com, CFA) are isolated LTR in Inter. */
export const Txt: React.FC<{ children: string; style?: React.CSSProperties }> = ({ children, style }) => {
  const parts = children.split(/([A-Za-z][A-Za-z0-9.@&+\- ]*[A-Za-z0-9]|[A-Za-z])/g).filter(Boolean);
  return (
    <span style={{ fontFamily: FA, ...style }}>
      {parts.map((p, i) =>
        isLatin(p) ? (
          <bdi key={i} dir="ltr" style={{ fontFamily: EN, unicodeBidi: 'isolate', letterSpacing: '-0.01em' }}>{p}</bdi>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </span>
  );
};

export const IconTile: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 70 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
    background: `radial-gradient(circle at 30% 25%, ${C.orangeSoft}, ${C.orange} 60%, #C24E00)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(255,107,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
  }}>{children}</div>
);

/** Diagonal light sweep, progress 0..1 */
export const Sweep: React.FC<{ p: number; radius?: number }> = ({ p, radius = 34 }) => (
  <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', top: '-30%', bottom: '-30%', width: '28%',
      left: `${-40 + p * 160}%`, transform: 'skewX(-20deg)',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
      opacity: p > 0 && p < 1 ? 1 : 0,
    }} />
  </div>
);
