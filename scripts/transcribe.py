"""Transcribe a voiceover and save the time of every word.

Usage:  python3 scripts/transcribe.py public/videos/<video-id>/voiceover.wav
Writes: public/videos/<video-id>/words.json      (every word with start/end seconds)
        public/videos/<video-id>/transcript.txt  (readable lines with times, for writing the cue sheet)
Prints the audio length to use as "duration" in the cue sheet.

One-time setup:  pip3 install faster-whisper   (and have ffmpeg installed: brew install ffmpeg)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    sys.exit(__doc__)
audio = Path(sys.argv[1])
out_dir = audio.parent

# Decode with ffmpeg to 16 kHz mono so any format works (wav, m4a, mp3, mp4...).
raw = subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-i", str(audio), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
    check=True, capture_output=True,
).stdout
samples = np.frombuffer(raw, dtype=np.float32)

model = WhisperModel("small.en", device="cpu", compute_type="int8")
segments, _ = model.transcribe(samples, word_timestamps=True)

words, lines = [], []
for seg in segments:
    lines.append(f"[{seg.start:6.2f} - {seg.end:6.2f}] {seg.text.strip()}")
    words += [{"start": round(w.start, 2), "end": round(w.end, 2), "word": w.word.strip()} for w in seg.words]

(out_dir / "words.json").write_text(json.dumps(words, indent=1))
(out_dir / "transcript.txt").write_text("\n".join(lines) + "\n\nWORD TIMES\n" + " | ".join(f"{w['start']:.2f} {w['word']}" for w in words) + "\n")
print("\n".join(lines))
print(f"\nduration: {len(samples) / 16000:.2f} seconds")
print(f"saved {out_dir / 'words.json'} and {out_dir / 'transcript.txt'}")
