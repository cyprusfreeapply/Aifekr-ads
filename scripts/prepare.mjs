#!/usr/bin/env node
// Prepares all render inputs from content/content.json + theme/theme.json:
//  1. Per-variant edited footage (frame-accurate cuts, 1080x1920 upscale, grade, cleaned speech audio)
//  2. Logo crops (full logo + head mark) in public/assets
//  3. Procedurally generated SFX (royalty-free by construction) in public/generated/sfx
// Usage: node scripts/prepare.mjs [variant ...]
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const content = JSON.parse(readFileSync(path.join(root, 'content/content.json'), 'utf8'));
const theme = JSON.parse(readFileSync(path.join(root, 'theme/theme.json'), 'utf8'));
const fps = theme.output.fps;
const gen = path.join(root, 'public/generated');
mkdirSync(path.join(gen, 'sfx'), { recursive: true });
mkdirSync(path.join(root, 'public/assets'), { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

// ---------- logo ----------
const logoSrc = path.join(root, 'assets/source/aifekr-logo.png');
const logoOut = path.join(root, 'public/assets/aifekr-logo.png');
if (!existsSync(logoOut)) copyFileSync(logoSrc, logoOut);
const markOut = path.join(root, 'public/assets/aifekr-mark.png');
if (!existsSync(markOut)) {
  // Head + neural network + bulb only (top part of the official artwork, geometry untouched)
  ff(['-i', logoSrc, '-vf', 'crop=iw*0.70:ih*0.70:iw*0.17:0', markOut]);
}

// ---------- SFX (synthesized, low level, no third-party audio) ----------
const sfx = {
  whoosh: "anoisesrc=d=0.55:c=pink:a=0.6,bandpass=f=1800:width_type=o:w=2.2,afade=t=in:d=0.28:curve=exp,afade=t=out:st=0.28:d=0.27,volume=0.9",
  pop: "aevalsrc='0.55*sin(2*PI*t*(520+900*exp(-t*28)))*exp(-t*22)':d=0.22",
  click: "aevalsrc='0.5*sin(2*PI*1900*t)*exp(-t*90)+0.25*sin(2*PI*950*t)*exp(-t*60)':d=0.08",
  tick: "aevalsrc='0.45*sin(2*PI*1250*t)*exp(-t*45)':d=0.12",
  riser: "aevalsrc='0.22*sin(2*PI*t*(180+520*t))*min(t/1.0,1)':d=1.1,afade=t=out:st=0.95:d=0.15",
  impact: "aevalsrc='0.9*sin(2*PI*t*(46+90*exp(-t*9)))*exp(-t*4.5)':d=0.9,lowpass=f=900",
  flare: "anoisesrc=d=1.2:c=white:a=0.25,highpass=f=3500,afade=t=in:d=0.5:curve=exp,afade=t=out:st=0.6:d=0.6",
};
for (const [name, src] of Object.entries(sfx)) {
  const out = path.join(gen, 'sfx', `${name}.wav`);
  if (!existsSync(out)) ff(['-f', 'lavfi', '-i', src, '-ac', '2', '-ar', '48000', out]);
}

// ---------- footage ----------
const quant = (segs) => segs.map(([s, e]) => [Math.round(s * fps), Math.round(e * fps)]);
const want = process.argv.slice(2);
const srcVideo = path.join(root, content.source.video);
for (const [name, v] of Object.entries(content.variants)) {
  if (v.segmentsFrom) continue; // shares footage with another variant
  if (want.length && !want.includes(name)) continue;
  const out = path.join(gen, `footage-${name}.mp4`);
  const segs = quant(v.segments);
  const parts = [];
  const labels = [];
  segs.forEach(([sf, ef], i) => {
    const d = (ef - sf) / fps;
    const fade = Math.min(0.012, d / 4).toFixed(4);
    parts.push(`[0:v]trim=start_frame=${sf}:end_frame=${ef},setpts=PTS-STARTPTS[v${i}]`);
    parts.push(`[0:a]atrim=start=${(sf / fps).toFixed(5)}:end=${(ef / fps).toFixed(5)},asetpts=PTS-STARTPTS,afade=t=in:d=${fade},afade=t=out:st=${(d - fade).toFixed(4)}:d=${fade}[a${i}]`);
    labels.push(`[v${i}][a${i}]`);
  });
  const cropY = theme.layout.footageCropY;
  parts.push(`${labels.join('')}concat=n=${segs.length}:v=1:a=1[cv][ca]`);
  parts.push(`[cv]scale=1080:-2:flags=lanczos,crop=1080:1920:0:${cropY},${theme.grade.ffmpeg},fps=${fps},format=yuv420p[vo]`);
  // speech cleanup: rumble cut, gentle denoise, de-ess-ish shelf, compression, rough level (final 2-pass loudnorm happens after render)
  parts.push(`[ca]highpass=f=75,afftdn=nr=8:nf=-42,equalizer=f=6500:t=q:w=1.2:g=-2,equalizer=f=180:t=q:w=1:g=1.5,acompressor=threshold=-24dB:ratio=3:attack=6:release=90:makeup=2,loudnorm=I=-15:TP=-2:LRA=8,aresample=48000[ao]`);
  console.log(`[prepare] ${name}: ${segs.length} segments → ${out}`);
  ff(['-i', srcVideo, '-filter_complex', parts.join(';'), '-map', '[vo]', '-map', '[ao]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-g', '15', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out]);
}
console.log('[prepare] done');
