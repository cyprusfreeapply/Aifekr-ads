# Source analysis

## 1. Reference video (`assets/source/reference.mp4`)
Probed with FFprobe: **1080×1920, 30 fps, H.264 + AAC 44.1 kHz stereo, 64.71 s**. Inspected through 1-fps contact sheets (`analysis/frames/ref/sheet_0*.png`).

| Time | What happens | Design element extracted |
|---|---|---|
| 00:00–00:01 | Opens on a defocused frame, then pulls into focus | 8-frame blur-in at the start (`InfluencerFootage intro`) |
| 00:00–00:64 | Brand watermark ("CYPRUS FREE APPLY") at the top left the whole time | `Watermark`: AIFekr logo at the top left |
| whole video | Warm, moody grade; lower ~45% fades to near-black; vignette | `theme.grade` (ffmpeg eq/colorbalance) plus top and bottom gradients and a vignette |
| 00:02–00:10 | Frosted light "Message" card holding a viewer question | `chatCard` template (light card, header, bubbles typed in) |
| 00:11–00:15 | Bold white phrase at chest level; Duolingo logo pops in | `chips` template: icon cards that pop in |
| 00:18–00:22 | IELTS, then TOEFL square logo cards pop in side by side | `aiHub` and `chips`: tool cards that pop in one after another |
| 00:25–00:29 | "PTE SAT ACE" words stagger in with a glitch glow | Word-stagger caption reveal |
| 00:34–00:46 | Phrase captions reveal word by word, right to left, with blur; key words coloured red with a glow | `AnimatedPersianCaptions` (RTL stagger and blur; brand orange replaces red) |
| 00:47–00:50 | Neon gradient outline box draws around «رایگانه» | `neon` caption treatment (box drawn with an SVG stroke-dash) |
| 00:50–00:62 | Large glowing yellow words «ولی», «ومجدد» bounce into the caption zone | `big` caption treatment (orange glow plus a bouncy spring) |
| 00:62–00:63 | Footage whips left to reveal the brand panel | Outro whip-slide with motion blur |
| 00:64 | Lens-flare streak on black | Outro lens flare, then fade to black |

Rhythm: a new visual change roughly every 2–4 s, with text locked to the words being spoken. Placement: text sits in the lower-middle area at chest height, and the area above the head is mostly clean.
The reference's audio and footage are **not** reused.

## 2. New footage (`assets/source/influencer.mp4`)
**464×848, 30 fps, 71.90 s, AAC stereo.** Integrated loudness was **−36.3 LUFS** (very quiet), so it is normalised to −14 LUFS.
The framing is stable and handheld-free, in a bright home interior. The face sits around 33–62% of frame height, and the hands gesture in front of the chest.
Negative space: the white wall and ceiling above the head (y ≈ 235–620 after the 1080×1920 upscale). Cards go there on dark glass so they stay readable against the bright wall.
Captions sit at chest height (y ≈ 1410) over a dark bottom gradient, as in the reference.

Pauses were found with `silencedetect` (−35 dB, ≥0.35 s): 25 of them. 17 longer pauses (about 10.8 s) plus about 1.2 s of trailing silence were trimmed with ~0.12 s of padding left on each side. Every jump cut is hidden by alternating punch-in levels (1.00 / 1.075 / 1.00 / 1.045) plus a slow drift.
The order of the dialogue is never changed.

## 3. Transcription
faster-whisper **large-v3**, Persian, word timestamps, with a terminology prompt. Average word confidence was high (most words above 0.8).
These Whisper mishearings were corrected: «ای آی فیک» → «ای‌آی‌فکر», «گوش مصنوعی» → «هوش مصنوعی», «دانشویی» → «دانشجویی», «رایگاتش» → «رایگانش», «کودی» → «کدی», «جدایی از» → «جدا از».
«اشتراک پروت» is rendered as «اشتراک پرو» (the Pro subscription).
**For human review:** the speaker's exact wording at 00:00.9–00:02 («جزء جدانشدنی») is inferred from Whisper's «از به جدا نشدن».

## 4. Topics detected (from the brief's list)
| Topic | Present? | Source time |
|---|---|---|
| General-purpose AI tools / ChatGPT | yes | 0.24 s, 43.0 s |
| Claude | **no, never mentioned**, so it is not shown anywhere | — |
| Student problems | yes: translation, lecture notes, exercise solving, free-tier limits, €20/month cost | 8–28.9 s |
| AIFekr platform | yes | 30.4–33.2 s |
| Dedicated student module | yes («پنل دانشجویی»): planning, storing notes | 54.8–63 s |
| Referral / invitation code | yes: «کدی که توی کپشن نوشتم», «لینک معرفی» | 35.2 s, 65.5 s |
