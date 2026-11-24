import themeJson from '../../theme/theme.json';
import contentJson from '../../content/content.json';

export const theme = themeJson;
export const content = contentJson;
export const C = theme.colors;
export const FPS = theme.output.fps;
export const FA = `'${theme.typography.persian}', 'Vazirmatn', sans-serif`;
export const EN = `'${theme.typography.latin}', 'Inter', sans-serif`;

export type VariantName = keyof typeof contentJson.variants;
type RawVariant = {
  file: string;
  segments?: number[][];
  segmentsFrom?: string;
  outroSeconds: number;
  captions: boolean;
  storyMode?: boolean;
};

export type Variant = {
  name: VariantName;
  footage: string;
  segments: [number, number][]; // source frames [start, end)
  speechFrames: number;
  outroFrames: number;
  total: number;
  captions: boolean;
  storyMode: boolean;
};

const q = (sec: number) => Math.round(sec * FPS);

export const getVariant = (name: VariantName): Variant => {
  const raw = (contentJson.variants as Record<string, RawVariant>)[name];
  const footageName = raw.segmentsFrom ?? name;
  const segRaw = raw.segments ?? (contentJson.variants as Record<string, RawVariant>)[footageName].segments!;
  const segments = segRaw.map(([s, e]) => [q(s), q(e)] as [number, number]);
  const speechFrames = segments.reduce((a, [s, e]) => a + (e - s), 0);
  const outroFrames = q(raw.outroSeconds);
  return {
    name,
    footage: `generated/footage-${footageName}.mp4`,
    segments,
    speechFrames,
    outroFrames,
    total: speechFrames + outroFrames,
    captions: raw.captions,
    storyMode: Boolean(raw.storyMode),
  };
};

/** Map a SOURCE time (seconds) to an OUTPUT frame of this variant. Times inside a cut snap to the next kept frame. */
export const mapTime = (v: Variant, sec: number): number => {
  const f = sec * FPS;
  let acc = 0;
  for (const [s, e] of v.segments) {
    if (f < s) return acc;
    if (f < e) return acc + Math.round(f - s);
    acc += e - s;
  }
  return acc;
};

export const mapWindow = (v: Variant, s: number, e: number) => {
  const from = mapTime(v, s);
  const to = mapTime(v, e);
  return { from, to, dur: to - from };
};

/** Output frame where each kept segment starts (used for punch-in jump cuts). */
export const segmentStarts = (v: Variant) => {
  const starts: number[] = [];
  let acc = 0;
  for (const [s, e] of v.segments) {
    starts.push(acc);
    acc += e - s;
  }
  return starts;
};

export const toFaDigits = (n: number | string) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
export const isLatin = (s: string) => /[A-Za-z]/.test(s);
