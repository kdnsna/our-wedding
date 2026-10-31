#!/usr/bin/env bash
# 从 96 秒无缝循环的 WAV 母版生成网页用的两份音轨。
# 用法: scripts/encode-audio.sh path/to/wedding-loop.wav
set -euo pipefail
WAV="${1:?用法: $0 <96 秒循环的 WAV 母版>}"
OUT="$(dirname "$0")/../assets/audio"
mkdir -p "$OUT"

# 立体声、44.1kHz、96kbps：实测与母版的片段信噪比约 28dB，手机外放足够，文件约 1.1MB。
# 单声道只有约 12dB，听感会明显发闷，所以这里保留立体声（母版本身只有约 12dB 的立体声宽度）。
ffmpeg -hide_banner -nostats -v error -y -i "$WAV" -ac 2 -ar 44100 \
  -c:a aac -b:a 96k -movflags +faststart \
  -metadata title="奔赴山海" -metadata artist="高嘉琪 & 张靖" "$OUT/wedding-loop.m4a"

ffmpeg -hide_banner -nostats -v error -y -i "$WAV" -ac 2 -ar 44100 \
  -c:a libmp3lame -b:a 96k -write_xing 1 -id3v2_version 3 \
  -metadata title="奔赴山海" -metadata artist="高嘉琪 & 张靖" "$OUT/wedding-loop.mp3"

ls -l "$OUT"
