#!/usr/bin/env bash
# Masters a raw Remotion render: video → H.264 yuv420p (TV range, BT.709) CRF 15, audio → 2-pass loudnorm -14 LUFS / ≤ -1 dBTP, AAC 256k, faststart.
# Usage: bash scripts/master.sh <raw.mp4> <final.mp4>
set -euo pipefail
in="$1"; out="$2"
stats=$(ffmpeg -hide_banner -i "$in" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | node -e "const j=JSON.parse(require('fs').readFileSync(0));console.log(j['$1'])"; }
ffmpeg -v error -y -i "$in" \
  -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -preset slow -crf 15 -profile:v high -level 4.1 -r 30 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,alimiter=limit=0.89:level=false,aresample=48000" \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$out"
