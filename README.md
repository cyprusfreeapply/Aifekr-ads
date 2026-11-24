# AIFekr Ads: Reference-Based Motion Graphics Engine

This is a Remotion + FFmpeg pipeline. It rebuilds the **visual language of a reference reel** (`assets/source/reference.mp4`) on **new footage** (`assets/source/influencer.mp4`) for the AIFekr Student / CFA invitation campaign.

The theme (how it looks) and the content (what it says) are kept separate:

| File | Controls |
|---|---|
| `theme/theme.json` | Colours, fonts, safe areas, top-card and caption zones, grade, springs, punch-in levels, scene templates, output specs, loudness targets |
| `content/content.json` | Brand (website, Instagram, **referral code `CFA`**, logos), source video, edit segments per variant, caption sentences (source timestamps), scenes and their triggers, outro and cover copy |

All times in `content.json` are **source-video seconds** taken from the transcript. The engine remaps them to every edited variant on its own (`src/config/index.ts → mapTime`), so changing a cut never means re-timing the graphics.

## Deliverables (`output/aifekr-student-cfa-2026-11/`)
| File | What |
|---|---|
| `AIFekr-Academic-Influencer-CFA-Full.mp4` (= `final-video.mp4`) | Full reel, ~64.8 s, dead air trimmed |
| `AIFekr-Academic-Influencer-CFA-NoCaptions.mp4` | Same edit without the burned-in subtitles |
| `AIFekr-Academic-Influencer-CFA-Short.mp4` | ~37.6 s conversion cut |
| `AIFekr-Academic-Influencer-CFA-Story.mp4` | ~13.8 s story; the outro leaves room for a link sticker |
| `AIFekr-Academic-Influencer-CFA-Cover.png` (= `thumbnail.png`) | Reel cover, 1080×1920 |
| `preview.mp4` | 540×960 preview |
| `storyboard.json`, `quality-report.md` | Timeline and QA |

Analysis files are in `analysis/`: transcript (JSON / SRT / TXT), source analysis, motion timeline, feature-verification matrix, pain points, layout map and contact sheets.

## Reproduce
```bash
npm install
pip install faster-whisper            # only needed to re-transcribe new footage
node scripts/prepare.mjs              # edited/upscaled/graded footage per variant, logo crops, synthesized SFX → public/generated/
bash scripts/render-all.sh            # renders all variants + cover + preview, masters audio/video → output/<productionId>/
# or a single one:  bash scripts/render-all.sh short
npm run studio                        # interactive preview (set safeAreaDebug: true in props for safe-area guides)
```
Requirements: Node 18+ and FFmpeg. Remotion uses the Chromium headless shell configured in `remotion.config.ts`; change `setBrowserExecutable` on another machine.

## Making a new production
1. Put the new footage in `assets/source/`, then transcribe it (see `analysis/transcript.json` for the format).
2. In `content/content.json`, update `productionId`, `source.video`, each variant's `segments` (the source ranges to keep), `captions` (wrap a word in `{…}` to make it orange; use `"big": true` for a glowing emphasis word and `"neon": true` to add the neon box), and `scenes` (pick a template from `src/components/Scenes.tsx → sceneRegistry` and give it trigger times).
3. Change `brand.referralCode` in one place, and every card and the outro update with it.
4. Run `node scripts/prepare.mjs`, then `bash scripts/render-all.sh`.

Scene templates: `hookHeadline`, `chips`, `chatCard`, `limitCard`, `priceCard`, `logoReveal`, `referral`, `aiHub`, `studentPanel`, `ctaClick`, plus the automatic `AcademicFinalCTA` outro.

## Audio
- Influencer voice cleanup: high-pass, light FFT denoise, presence EQ, compression.
- Final two-pass loudnorm to **−14 LUFS** with true peak ≤ −1 dBTP.
- SFX (whoosh, pop, click, tick, riser, impact, flare) are **synthesized with FFmpeg**, so there are no licensing issues.
- No music bed is included because no licensed track was supplied. Add one as an `<Audio>` in `AcademicInfluencerAd.tsx` and duck it under speech.
