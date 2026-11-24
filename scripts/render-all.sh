#!/usr/bin/env bash
# Renders every deliverable for the production defined in content/content.json.
# Usage: bash scripts/render-all.sh [full|nocaptions|short|story|cover|preview ...]
set -euo pipefail
cd "$(dirname "$0")/.."
PID=$(node -p "require('./content/content.json').productionId")
OUT="output/$PID"; RAW="out/raw"; mkdir -p "$OUT" "$RAW"
TARGETS=("$@"); [ ${#TARGETS[@]} -eq 0 ] && TARGETS=(full nocaptions short story cover preview)

master() { # $1 raw input, $2 final output: 2-pass loudnorm to -14 LUFS / -1 dBTP, video stream copied
  local stats
  stats=$(ffmpeg -hide_banner -i "$1" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  local mi mtp mlra mth off
  mi=$(echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j.input_i)")
  mtp=$(echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j.input_tp)")
  mlra=$(echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j.input_lra)")
  mth=$(echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j.input_thresh)")
  off=$(echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j.target_offset)")
  ffmpeg -v error -y -i "$1" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true,alimiter=limit=0.89:level=false,aresample=48000" \
    -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$2"
}

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
