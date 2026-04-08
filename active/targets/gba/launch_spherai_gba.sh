#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
if [[ -f "$SCRIPT_DIR/spherai_audio_seed.next.gba" ]]; then
  ROM_UNIX="$SCRIPT_DIR/spherai_audio_seed.next.gba"
else
  ROM_UNIX="$SCRIPT_DIR/spherai_audio_seed.gba"
fi
EMU_UNIX="$REPO_ROOT/mGBA-0.10.5-win32/mGBA.exe"

if [[ ! -f "$ROM_UNIX" ]]; then
  echo "ROM not found: $ROM_UNIX" >&2
  exit 1
fi

if [[ ! -f "$EMU_UNIX" ]]; then
  echo "mGBA not found: $EMU_UNIX" >&2
  exit 1
fi

ROM_WIN="$(wslpath -w "$ROM_UNIX")"
EMU_WIN="$(wslpath -w "$EMU_UNIX")"

cmd.exe /C start "" "$EMU_WIN" "$ROM_WIN" >/dev/null 2>&1
