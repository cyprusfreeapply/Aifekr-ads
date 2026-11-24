import { continueRender, delayRender, staticFile } from 'remotion';

const weights: [string, number][] = [
  ['Regular', 400], ['Medium', 500], ['Bold', 700], ['ExtraBold', 800], ['Black', 900],
];
let started = false;

export const ensureFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading Vazirmatn');
  Promise.all(
    weights.map(([name, w]) => {
      const face = new FontFace('Vazirmatn', `url(${staticFile(`fonts/Vazirmatn-${name}.woff2`)}) format('woff2')`, { weight: String(w) });
      return face.load().then((f) => (document.fonts as any).add(f));
    }),
  )
    .then(() => document.fonts.load('800 40px Inter'))
    .then(() => continueRender(handle))
    .catch((err) => { console.error(err); continueRender(handle); });
};
