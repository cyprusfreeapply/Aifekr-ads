# Quality report: aifekr-student-cfa-2026-11

## 1. Output verification (measured with FFprobe / FFmpeg)
| File | Resolution | fps | Pixel format | Duration | Integrated loudness | Peak | Full decode | Faststart |
|---|---|---|---|---|---|---|---|---|
| AIFekr-Academic-Influencer-CFA-Full.mp4 (= final-video.mp4) | 1080×1920 | 30 | yuv420p (TV range, BT.709) | 64.8 s | −14.0 LUFS | −1.5 dBFS | 0 errors | yes |
| AIFekr-Academic-Influencer-CFA-NoCaptions.mp4 | 1080×1920 | 30 | yuv420p | 64.8 s | −14.0 LUFS | −1.5 dBFS | 0 errors | yes |
| AIFekr-Academic-Influencer-CFA-Short.mp4 | 1080×1920 | 30 | yuv420p | 37.6 s | −14.0 LUFS | −1.5 dBFS | 0 errors | yes |
| AIFekr-Academic-Influencer-CFA-Story.mp4 | 1080×1920 | 30 | yuv420p | 13.9 s | −14.0 LUFS | −1.5 dBFS | 0 errors | yes |
| preview.mp4 | 540×960 | 30 | yuv420p | 64.8 s | −14.0 LUFS | −1.5 dBFS | 0 errors | yes |
| AIFekr-Academic-Influencer-CFA-Cover.png (= thumbnail.png) | 1080×1920 | — | RGBA PNG | — | — | — | — | — |

Codecs: H.264 High, AAC 256 kb/s, 48 kHz. Peaks were measured as sample peak with `ebur128=peak=true`. The limiter is set to 0.89 (about −1 dBFS), and the loudnorm target is TP −1.5, so true peak should be at or below −1 dBTP. True peak was **not** measured separately with oversampling.
`blackdetect` (≥0.1 s, pix_th 0.05) on the full render found **no black segments**. The only darkening is the deliberate fade to black in the last ~0.5 s of the outro.

## 2. Visual checks performed
- Contact sheets of every 2 s of the Full and Short cuts, and every 1 s of the Story cut, were inspected. So were 16 half-resolution stills at every scene trigger and 2 full-resolution stills.
- Persian text shaping and RTL order are correct (Vazirmatn). Mixed Persian and Latin strings (ChatGPT, AIFekr.com, CFA, Pro) render as isolated LTR runs in Inter.
- Cards sit in the wall area above the head, and captions sit at chest height. No text covers the eyes or mouth in any inspected frame. Hand gestures sometimes pass behind the captions, as they do in the reference.
- All essential text is inside the conservative safe guides (left 90, right 170, top 220, bottom 400). The small logo watermark sits at y = 96, above the 220 px top guide, matching the reference's watermark position. It is decorative, not essential information.
- Official logo artwork is used without changes (with a head-only crop for small marks). It was not regenerated.
- The cover headline was moved down after a first test showed it covering the chin. It now sits inside the 4:5 profile-grid crop (y 285–1635).

## 3. Content accuracy
- Every subtitle is the speaker's actual words. They were transcribed with Whisper large-v3, then corrected by hand for brand and common mishearings (see `analysis/source-analysis.md` §3). **One phrase is flagged for human review:** «جزء جدانشدنی» at 00:00.9.
- **Bug found and fixed:** in the Short and Story cuts, a caption carried words that had been edited out («و جدا از همه این موارد»). The caption was split, and a guard now only shows a caption when its spoken start survives the cut. The Full, Short and Story cuts were re-rendered after the fix and the fix was verified in a frame.
- The dialogue order is never changed. Dead air was trimmed: 17 internal pauses (about 10.8 s) plus about 1.2 s of trailing silence. No sentence, claim or qualifier was removed from the Full cut.
- Marketing headlines (hook, outro, cover) are styled differently from subtitles and are never presented as speech.
- Claude is not shown (it is not mentioned). There is no competitor-bashing: no red crosses, fake errors or price comparisons beyond the speaker's own "€20/month" statement. ChatGPT appears as a text label only, never as a logo.

## 4. Open items for the client (could not be verified here)
1. **Product claims are unverified.** aifekr.com was blocked by this environment's network policy and no product repository was supplied. Before paid promotion, confirm these spoken claims: ChatGPT is available inside AIFekr; image and audio generation; student panel with planning and notes storage; **"get credits" with the code**; and **"use the features for free"**. The last two appear only as subtitles and are deliberately not amplified with graphics.
2. **Invitation code field:** confirm that the AIFekr registration form accepts `CFA`. The speaker says the code is "in the caption", so put CFA in the post caption.
3. **Real UI:** no real screenshots were available, so no dashboard was drawn. The student-panel card is an icon and label summary of the spoken features. Supply screenshots or screen recordings to add genuine product footage.
4. **Music:** no licensed track was supplied, so the mix is voice plus synthesized SFX only.
5. The user's message wrote the Instagram handle as "aifekeofficial". The product brief's handle **@aifekrofficial** was used. Please confirm.
6. The source footage is 464×848, upscaled 2.33× with Lanczos and mild sharpening. Detail is limited by the source, and no AI face reconstruction was applied.
