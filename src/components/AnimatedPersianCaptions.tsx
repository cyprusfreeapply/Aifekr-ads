import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, content, EN, FA, FPS, isLatin, mapWindow, theme, Variant } from '../config';
import { clamp, sp } from './anim';

type Token = { text: string; hl: boolean };
const tokenize = (t: string): Token[] => {
  const out: Token[] = [];
  t.split(/(\{[^}]+\})/g).filter(Boolean).forEach((part) => {
    if (part.startsWith('{')) out.push({ text: part.slice(1, -1), hl: true });
    else part.split(/\s+/).filter(Boolean).forEach((w) => out.push({ text: w, hl: false }));
  });
  return out;
};

const shadow = '0 4px 18px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)';
const glow = '0 0 26px rgba(255,107,0,0.55), 0 4px 16px rgba(0,0,0,0.7)';

const Phrase: React.FC<{ text: string; dur: number; f: number }> = ({ text, dur, f }) => {
  const tokens = tokenize(text);
  const totalChars = tokens.reduce((a, t) => a + t.text.length, 0);
  const revealSpan = Math.max(6, Math.min(dur * 0.55, 24));
  const exit = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const size = totalChars > 38 ? 56 : theme.typography.captionSize;
  let acc = 0;
  return (
    <div dir="rtl" style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline',
      columnGap: size * 0.28, rowGap: 4, maxWidth: theme.layout.captionZone.maxWidth,
      opacity: exit, lineHeight: theme.typography.lineHeight,
    }}>
      {tokens.map((tk, i) => {
        const delay = (acc / totalChars) * revealSpan;
        acc += tk.text.length;
        const p = sp(f, delay, 'pop');
        const o = interpolate(f - delay, [0, 4], [0, 1], clamp);
        const pop = tk.hl ? 1 + 0.12 * Math.max(0, 1 - Math.abs(f - delay - 6) / 6) : 1;
        return (
          <span key={i} style={{
            fontFamily: isLatin(tk.text) ? EN : FA,
            direction: isLatin(tk.text) ? 'ltr' : 'rtl', unicodeBidi: 'isolate',
            fontSize: size, fontWeight: theme.typography.captionWeight,
            color: tk.hl ? C.orange : C.white, textShadow: tk.hl ? glow : shadow,
            opacity: o, display: 'inline-block',
            transform: `translateY(${(1 - p) * 26}px) scale(${pop})`,
            filter: `blur(${interpolate(f - delay, [0, 5], [6, 0], clamp)}px)`,
          }}>{tk.text}</span>
        );
      })}
    </div>
  );
};

/** Reference 'ولی' treatment: big glowing word + optional neon outline box (reference 'رایگانه'). */
const BigPhrase: React.FC<{ text: string; dur: number; f: number; neon?: boolean }> = ({ text, dur, f, neon }) => {
  const p = sp(f, 0, 'bouncy');
  const exit = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const size = text.length > 12 ? 104 : theme.typography.bigWordSize * 0.82;
  const draw = interpolate(f, [2, 18], [0, 1], clamp);
  const w = 900, h = 220;
  const perim = 2 * (w + h);
  return (
    <div style={{ position: 'relative', opacity: exit, transform: `scale(${0.6 + 0.4 * p})` }}>
      {neon && (
        <svg width={w} height={h} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', overflow: 'visible' }}>
          <defs>
            <linearGradient id="neon" x1="0" x2="1">
              <stop offset="0" stopColor={C.orange} /><stop offset="0.5" stopColor="#FFD2B0" /><stop offset="1" stopColor={C.orange} />
            </linearGradient>
          </defs>
          <rect x={4} y={4} width={w - 8} height={h - 8} rx={30} fill="rgba(23,25,29,0.35)" stroke="url(#neon)" strokeWidth={5}
            strokeDasharray={perim} strokeDashoffset={perim * (1 - draw)} style={{ filter: 'drop-shadow(0 0 14px rgba(255,107,0,0.9))' }} />
        </svg>
      )}
      <div dir="rtl" style={{
        position: 'relative', fontFamily: FA, fontWeight: 900, fontSize: size, color: C.orange, whiteSpace: 'nowrap',
        textShadow: '0 0 30px rgba(255,107,0,0.85), 0 0 70px rgba(255,107,0,0.45), 0 6px 20px rgba(0,0,0,0.6)',
        WebkitTextStroke: '1.5px rgba(255,220,190,0.55)', padding: '0 30px',
      }}>{text}</div>
    </div>
  );
};

export const AnimatedPersianCaptions: React.FC<{ v: Variant }> = ({ v }) => {
  const frame = useCurrentFrame();
  const active = content.captions
    // only captions whose spoken start survives in this cut (prevents showing words that were edited out)
    .filter((c) => v.segments.some(([s, e]) => c.s * FPS >= s - 0.5 * FPS && c.s * FPS < e))
    .map((c) => ({ c, w: mapWindow(v, c.s, c.e) }))
    .find(({ w }) => w.dur > 3 && frame >= w.from && frame < w.to);
  if (!active) return null;
  const { c, w } = active;
  const f = frame - w.from;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: theme.layout.captionZone.centerY - 960, pointerEvents: 'none' }}>
      {'big' in c && c.big ? (
        <BigPhrase text={c.t} dur={w.dur} f={f} neon={'neon' in c && Boolean(c.neon)} />
      ) : (
        <Phrase text={c.t} dur={w.dur} f={f} />
      )}
    </AbsoluteFill>
  );
};
