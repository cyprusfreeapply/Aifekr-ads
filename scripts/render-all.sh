#!/usr/bin/env bash
# Renders every deliverable for the production defined in content/content.json.
# Usage: bash scripts/render-all.sh [full|nocaptions|short|story|cover|preview ...]
set -euo pipefail
cd "$(dirname "$0")/.."
PID=$(node -p "require('./content/content.json').productionId")
OUT="output/$PID"; RAW="out/raw"; mkdir -p "$OUT" "$RAW"
TARGETS=("$@"); [ ${#TARGETS[@]} -eq 0 ] && TARGETS=(full nocaptions short story cover preview)

master() { bash scripts/master.sh "$1" "$2"; }  # yuv420p/BT.709 video + 2-pass loudnorm audio

comp_for() { case $1 in full) echo AcademicInfluencerAd;; nocaptions) echo AcademicInfluencerAdNoCaptions;; short) echo AcademicShortAd;; story) echo AcademicStoryAd;; esac; }
file_for() { node -p "require('./content/content.json').variants['$1'].file"; }

for t in "${TARGETS[@]}"; do
  case $t in
    full|nocaptions|short|story)
      echo "== rendering $t"
      npx remotion render src/index.ts "$(comp_for "$t")" "$RAW/$t.mp4" --log=error
      master "$RAW/$t.mp4" "$OUT/$(file_for "$t")"
      [ "$t" = full ] && cp "$OUT/$(file_for full)" "$OUT/final-video.mp4"
      ;;
    preview)
      echo "== rendering preview (540x960)"
      npx remotion render src/index.ts AcademicInfluencerAd "$RAW/preview.mp4" --scale=0.5 --crf=26 --log=error
      master "$RAW/preview.mp4" "$OUT/preview.mp4"
      ;;
    cover)
      echo "== rendering cover"
      npx remotion still src/index.ts ReelCover "$OUT/AIFekr-Academic-Influencer-CFA-Cover.png" --log=error
      cp "$OUT/AIFekr-Academic-Influencer-CFA-Cover.png" "$OUT/thumbnail.png"
      ;;
  esac
done
echo "== done → $OUT"; ls -la "$OUT"
