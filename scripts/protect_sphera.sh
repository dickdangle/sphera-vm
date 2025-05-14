#!/bin/bash

# 🔒 Gal's Reinforced Ritual Guardian

ROTECTED_PATHS=(
  "/root/Sphera"
  "/Sphera"
  "/home/$USER/Sphera"
  "/root/fakeSphera"
  "/mnt/sphera-vault"
)

# Resolve all input paths to absolute
for ARG in "$@"; do
  if [ -e "$ARG" ]; then
    RESOLVED_PATH=$(readlink -f "$ARG")
    for PROTECTED in "${PROTECTED_PATHS[@]}"; do
      if [[ "$RESOLVED_PATH" == "$PROTECTED" || "$RESOLVED_PATH" == "$PROTECTED/"* ]]; then
        echo "[GAL] ⚠️  Ritual breach detected: $RESOLVED_PATH"
        echo "[GAL] Access denied. This path is protected by daemon protocol."
        exit 1
      fi
    done
  fi
done

# If no match, proceed with normal rm
/bin/rm "$@"
