import React from 'react';
import { Img, interpolate, staticFile } from 'remotion';
import { C, content, EN, FA, isLatin, toFaDigits } from '../config';
import { clamp, ease, fadeUp, sp } from './anim';
import { Cursor, Icon } from './Icons';
import { ReferralCodeCard } from './ReferralCodeCard';
import { glass, IconTile, Sweep, Txt } from './ui';

export type SceneProps = {
  s: any; // scene entry from content.json
  f: number; // frame relative to scene start
  dur: number;
  at: (sec: number) => number; // source time -> frame relative to scene start
  variant: string;
};

const Row: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 22, ...style }}>{children}</div>
);

// ---------- Hook headline (first 3 seconds) ----------
export const HookHeadline: React.FC<SceneProps> = ({ s, f }) => {
  const lines: string[] = s.lines;
  return (
    <div style={{ ...glass, padding: '30px 46px 34px', textAlign: 'center', ...fadeUp(f, 0, 30) }}>
      {lines.map((line, i) => {
        const hero = i === 1;
        const st = fadeUp(f, 3 + i * 5, 34);
        if (hero && isLatin(line)) {
          const p = sp(f, 8, 'bouncy');
          return (
            <div key={i} style={{ ...st, margin: '12px 0' }}>
              <span dir="ltr" style={{
                display: 'inline-block', fontFamily: EN, fontWeight: 800, fontSize: 104, color: C.white,
                padding: '4px 38px 10px', borderRadius: 28, border: `3px solid ${C.orange}`,
                background: 'rgba(255,107,0,0.12)', transform: `scale(${0.7 + 0.3 * p})`,
                boxShadow: '0 0 34px rgba(255,107,0,0.45)', letterSpacing: '-0.02em',
              }}>{line}</span>
            </div>
          );
        }
        return (
          <div key={i} dir="rtl" style={{
            ...st, fontFamily: FA, fontWeight: hero ? 900 : 800, fontSize: hero ? 88 : 56,
            color: hero ? C.orange : C.white, lineHeight: 1.3,
            textShadow: hero ? '0 0 26px rgba(255,107,0,0.5)' : undefined,
          }}><Txt>{line}</Txt></div>
        );
      })}
    </div>
  );
};

// ---------- Icon chips (reference: logo cards popping side by side) ----------
export const Chips: React.FC<SceneProps> = ({ s, f, at }) => (
  <Row style={{ flexWrap: 'wrap', justifyContent: 'center', rowGap: 22, maxWidth: 800 }}>
    {s.items.map((it: any, i: number) => {
      const t = at(it.at);
      if (f < t) return null;
      return (
        <div key={i} style={{ ...glass, borderRadius: 999, padding: '14px 34px 14px 18px', display: 'flex', alignItems: 'center', gap: 18, ...fadeUp(f, t, 50) }}>
          <IconTile size={72}><Icon name={it.icon} size={42} stroke={2.2} /></IconTile>
          <span style={{ fontFamily: FA, fontWeight: 800, fontSize: 50, color: C.white }}>{it.label}</span>
        </div>
      );
    })}
  </Row>
);

// ---------- Chat card (reference: frosted 'Message' notification card) ----------
export const ChatCard: React.FC<SceneProps> = ({ s, f, at }) => (
  <div style={{
    width: 780, borderRadius: 34, padding: '22px 28px 26px', background: C.cardLight,
    boxShadow: '0 30px 70px rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.6)', ...fadeUp(f, 0, 40),
  }}>
    <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="chat" size={26} color={C.white} stroke={2.2} />
      </div>
      <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 32, color: '#3A3F46' }}>{s.title}</span>
      <span style={{ fontFamily: EN, fontWeight: 500, fontSize: 26, color: '#8A9099', marginLeft: 'auto' }}>now</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {s.items.map((it: any, i: number) => {
        const t = at(it.at);
        const vis = f >= t;
        const chars = Math.floor(interpolate(f - t, [0, 14], [0, it.label.length], clamp));
        return (
          <div key={i} dir="rtl" style={{ display: 'flex', ...(vis ? fadeUp(f, t, 24) : { opacity: 0 }) }}>
            <div style={{
              fontFamily: FA, fontWeight: 700, fontSize: 40, color: C.white, background: C.graphite,
              padding: '12px 28px 14px', borderRadius: '28px 28px 8px 28px', minHeight: 56,
              boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
            }}>
              {it.label.slice(0, chars)}
              <span style={{ opacity: chars < it.label.length && Math.floor(f / 4) % 2 === 0 ? 1 : 0, color: C.orange }}>|</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ---------- Free-plan limit card ----------
export const LimitCard: React.FC<SceneProps> = ({ s, f, at }) => (
  <div style={{ ...glass, width: 760, padding: '28px 40px 34px', ...fadeUp(f, 0, 40) }}>
    <Row style={{ marginBottom: 22 }}>
      <Icon name="gift" size={46} color={C.orange} stroke={2} />
      <span style={{ fontFamily: FA, fontWeight: 900, fontSize: 54, color: C.white }}>{s.title}</span>
      <span dir="ltr" style={{ fontFamily: EN, fontWeight: 600, fontSize: 26, color: C.textSecondary, marginRight: 'auto', border: `1.5px solid ${C.textSecondary}55`, borderRadius: 999, padding: '4px 16px' }}>Free plan</span>
    </Row>
    {s.items.map((it: any, i: number) => {
      const t = at(it.at);
      const on = f >= t;
      const fill = interpolate(f - t, [0, 22], [0.08, 1], { ...clamp, easing: ease });
      return (
        <div key={i} style={{ marginTop: i ? 22 : 0, opacity: on ? 1 : 0.28, transition: 'none' }}>
          <Row style={{ marginBottom: 10 }}>
            <Icon name={it.icon} size={38} color={on ? C.orange : C.textSecondary} stroke={2.2} />
            <span style={{ fontFamily: FA, fontWeight: 800, fontSize: 42, color: C.white }}>{it.label}</span>
            {on && fill > 0.98 && <span style={{ marginRight: 'auto', fontFamily: EN, fontWeight: 900, fontSize: 40, color: C.orange, ...fadeUp(f, t + 22, 10) }}>!</span>}
          </Row>
          <div dir="rtl" style={{ height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
            <div style={{ width: `${(on ? fill : 0.08) * 100}%`, height: '100%', borderRadius: 9, background: `linear-gradient(270deg, ${C.orangeSoft}, ${C.orange})`, boxShadow: '0 0 16px rgba(255,107,0,0.6)' }} />
          </div>
        </div>
      );
    })}
  </div>
);

// ---------- Price card (reference: '100 یورو جریمه' emphasis) ----------
export const PriceCard: React.FC<SceneProps> = ({ s, f, at }) => {
  const t = at(s.countAt);
  const n = Math.round(interpolate(f - t, [0, 18], [0, s.value], { ...clamp, easing: ease }));
  const lt = at(s.labelAt);
  const bump = f >= t + 18 ? 1 + 0.08 * Math.max(0, 1 - (f - t - 18) / 8) : 1;
  return (
    <div style={{ ...glass, width: 700, padding: '24px 40px 30px', textAlign: 'center', ...fadeUp(f, 0, 40) }}>
      <Row style={{ justifyContent: 'center' }}>
        <Icon name="suitcase" size={42} color={C.orange} />
        <span style={{ fontFamily: FA, fontWeight: 800, fontSize: 42, color: C.textSecondary }}>هزینه‌های اول مهاجرت</span>
      </Row>
      <div dir="rtl" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 18, transform: `scale(${bump})` }}>
        <span style={{ fontFamily: FA, fontWeight: 900, fontSize: 168, lineHeight: 1.15, color: f >= t ? C.orange : '#5B616A', textShadow: f >= t ? '0 0 34px rgba(255,107,0,0.55)' : undefined }}>{toFaDigits(n)}</span>
        <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 104, color: C.white }}>€</span>
        <span style={{ fontFamily: FA, fontWeight: 800, fontSize: 48, color: C.white }}>{s.unit}</span>
      </div>
      <div style={{ height: 62 }}>
        {f >= lt && (
          <div style={{ display: 'inline-block', ...fadeUp(f, lt, 20), fontSize: 38, fontWeight: 800, color: C.white, background: 'rgba(255,107,0,0.16)', border: `1.5px solid ${C.orange}`, borderRadius: 999, padding: '6px 28px' }}>
            <Txt>{s.label}</Txt>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Logo reveal (official artwork, light sweep masked to the logo) ----------
export const LogoReveal: React.FC<SceneProps> = ({ s, f, at, variant }) => {
  const chipT = at(s.chipAt);
  const revT = at(s.revealAt);
  const showChip = variant !== 'story';
  const p = sp(f, revT, 'bouncy');
  const chipOut = interpolate(f, [revT - 4, revT + 4], [1, 0], clamp);
  const sweep = interpolate(f, [revT + 8, revT + 30], [0, 1], clamp);
  const glowPulse = interpolate(f, [revT, revT + 8, revT + 30], [0, 1, 0.45], clamp);
  const logo = staticFile(content.brand.logo);
  return (
    <div style={{ position: 'relative', width: 800, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showChip && f >= chipT && f < revT + 4 && (
        <div style={{ position: 'absolute', opacity: chipOut }}>
          <div style={{ ...glass, borderRadius: 999, padding: '16px 40px', ...fadeUp(f, chipT, 40) }}>
            <Row><Icon name="spark" size={46} color={C.orange} fill /><span style={{ fontFamily: FA, fontWeight: 900, fontSize: 56, color: C.white }}>{s.chip}</span></Row>
          </div>
        </div>
      )}
      {f >= revT && (
        <div style={{ position: 'relative', opacity: interpolate(f - revT, [0, 5], [0, 1], clamp), transform: `scale(${0.55 + 0.45 * p})`, filter: `blur(${interpolate(f - revT, [0, 8], [18, 0], clamp)}px)` }}>
          <div style={{ position: 'absolute', inset: -40, borderRadius: 60, background: 'radial-gradient(ellipse at 50% 45%, rgba(41,45,51,0.96) 0%, rgba(23,25,29,0.93) 60%, rgba(23,25,29,0) 100%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '38%', width: 260, height: 260, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, rgba(255,107,0,${0.55 * glowPulse}) 0%, transparent 70%)` }} />
          <div style={{ position: 'relative', width: 390, height: 365 }}>
            <Img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: `url(${logo})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: '35%', left: `${-40 + sweep * 150}%`, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)', opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Referral: React.FC<SceneProps> = ({ f }) => <ReferralCodeCard f={f} scale={0.86} />;

// ---------- AI hub: several AI tools on one platform (from spoken content) ----------
export const AIHub: React.FC<SceneProps> = ({ s, f, at }) => {
  const W = 800, H = 380, cx = 400, cy = 236;
  const pos = [[640, 150], [160, 150], [640, 318], [160, 318]];
  const hT = at(s.headlineAt);
  const centerP = sp(f, 0, 'pop');
  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {s.items.map((it: any, i: number) => {
          const t = at(it.at);
          const d = interpolate(f - t, [0, 10], [0, 1], clamp);
          const [x, y] = pos[i];
          const len = Math.hypot(x - cx, y - cy);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.orange} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - d)} opacity={0.85} style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,0,0.8))' }} />;
        })}
      </svg>
      {f >= hT && (
        <div dir="rtl" style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', ...fadeUp(f, hT, 20) }}>
          <span style={{ ...glass, borderRadius: 999, padding: '8px 34px', fontFamily: FA, fontWeight: 900, fontSize: 46, color: C.white, display: 'inline-block' }}>
            چند هوش مصنوعی، <span style={{ color: C.orange }}>یک پلتفرم</span>
          </span>
        </div>
      )}
      <div style={{ position: 'absolute', left: cx - 82, top: cy - 82, width: 164, height: 164, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #363B42, #17191D)', border: `3px solid ${C.orange}`, boxShadow: `0 0 ${30 + 10 * Math.sin(f / 8)}px rgba(255,107,0,0.55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${centerP})` }}>
        <Img src={staticFile(content.brand.logoMark)} style={{ width: 120, height: 120, objectFit: 'contain' }} />
      </div>
      {s.items.map((it: any, i: number) => {
        const t = at(it.at);
        if (f < t) return null;
        const [x, y] = pos[i];
        const p = sp(f, t, 'bouncy');
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * p})`, opacity: interpolate(f - t, [0, 4], [0, 1], clamp) }}>
            <div style={{ ...glass, borderRadius: 999, padding: '10px 24px 10px 12px', display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }} dir="rtl">
              <IconTile size={54}><Icon name={it.icon} size={32} stroke={2.2} /></IconTile>
              <Txt style={{ fontWeight: 800, fontSize: 36, color: C.white }}>{it.label}</Txt>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Student panel hero ----------
export const StudentPanel: React.FC<SceneProps> = ({ s, f, at }) => {
  const sweep = interpolate(f, [10, 34], [0, 1], clamp);
  return (
    <div style={{ ...glass, position: 'relative', width: 780, padding: '24px 36px 28px', border: `2px solid ${C.orange}88`, ...fadeUp(f, 0, 50) }}>
      <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 16, borderBottom: '1.5px solid rgba(255,255,255,0.10)' }}>
        <Img src={staticFile(content.brand.logoMark)} style={{ width: 72, height: 72, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 46, color: C.white, lineHeight: 1.05 }}>AIFekr <span style={{ color: C.orange }}>Student</span></div>
          <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 20, letterSpacing: '0.32em', color: C.textSecondary, marginTop: 6 }}>{content.brand.tagline}</div>
        </div>
        <div dir="rtl" style={{ marginLeft: 'auto', fontFamily: FA, fontWeight: 800, fontSize: 30, color: C.orange, border: `1.5px solid ${C.orange}`, borderRadius: 999, padding: '4px 18px' }}>پنل دانشجویی</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, minHeight: 222 }}>
        {s.items.map((it: any, i: number) => {
          const t = at(it.at);
          if (f < t) return <div key={i} style={{ height: 66 }} />;
          return (
            <Row key={i} style={{ height: 66, ...fadeUp(f, t, 30) }}>
              <IconTile size={62}><Icon name={it.icon} size={36} stroke={2.2} /></IconTile>
              <span style={{ fontFamily: FA, fontWeight: 800, fontSize: 44, color: C.white }}>{it.label}</span>
              <span style={{ marginRight: 'auto', opacity: interpolate(f - t, [6, 12], [0, 1], clamp) }}><Icon name="check" size={40} color={C.orange} stroke={3} /></span>
            </Row>
          );
        })}
      </div>
      <Sweep p={sweep} />
    </div>
  );
};

// ---------- CTA: click AIFekr.com, then the invitation code ----------
export const CtaClick: React.FC<SceneProps> = ({ s, f, at }) => {
  const cT = at(s.clickAt);
  const kT = at(s.codeAt);
  const press = interpolate(f - cT, [0, 3, 8], [1, 0.94, 1], clamp);
  const ripple = interpolate(f - cT, [0, 16], [0, 1], clamp);
  const cur = interpolate(f, [0, Math.max(1, cT)], [0, 1], { ...clamp, easing: ease });
  const barOut = interpolate(f, [kT - 2, kT + 6], [1, 0], clamp);
  return (
    <div style={{ position: 'relative', width: 800, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {f < kT + 6 && (
        <div style={{ position: 'relative', opacity: barOut }}><div style={{ position: 'relative', ...fadeUp(f, 0, 40) }}>
          <div dir="ltr" style={{ ...glass, borderRadius: 999, padding: '22px 54px', display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${press})`, border: `2px solid ${C.orange}` }}>
            <Icon name="lock" size={44} color={C.orange} stroke={2.4} />
            <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 72, color: C.white, letterSpacing: '-0.01em' }}>AIFekr<span style={{ color: C.orange }}>.com</span></span>
          </div>
          {f >= cT && <div style={{ position: 'absolute', left: '70%', top: '60%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: '50%', border: `4px solid ${C.orange}`, transform: `scale(${1 + ripple * 5})`, opacity: 1 - ripple }} />}
          <div style={{ position: 'absolute', left: `${70 + (1 - cur) * 30}%`, top: `${60 + (1 - cur) * 120}%`, transform: `scale(${press})` }}><Cursor size={70} /></div>
        </div></div>
      )}
      {f >= kT && <div style={{ position: 'absolute' }}><ReferralCodeCard f={f - kT} scale={0.86} /></div>}
    </div>
  );
};

export const sceneRegistry: Record<string, React.FC<SceneProps>> = {
  hookHeadline: HookHeadline,
  chips: Chips,
  chatCard: ChatCard,
  limitCard: LimitCard,
  priceCard: PriceCard,
  logoReveal: LogoReveal,
  referral: Referral,
  aiHub: AIHub,
  studentPanel: StudentPanel,
  ctaClick: CtaClick,
};
