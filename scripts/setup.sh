#!/usr/bin/env bash
# Installs what the project needs. Safe to run any number of times.
# Runs automatically at the start of every Claude Code session in the browser (see .claude/settings.json).
set -e
cd "$(dirname "$0")/.."

# Only auto-run in cloud (browser) sessions; on a Mac, run the README setup once by hand.
if [ "${1:-}" != "--force" ] && [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then exit 0; fi

# 1. Remotion and the other project packages
if [ ! -d node_modules/remotion ]; then
  npm install --no-fund --no-audit --loglevel=error
fi

# 2. The transcription tool (word timings)
if ! python3 -c "import faster_whisper" 2>/dev/null; then
  pip3 install --quiet --break-system-packages faster-whisper 2>/dev/null || pip3 install --quiet faster-whisper
fi

echo "ai-lab-video-studio: setup done"
