# Spherai GBA Target

This folder contains a minimal Game Boy Advance proof ROM for Spherai.

Purpose:

- prove we can emit a `.gba` artifact from this repo
- prove the project can boot on the desired platform
- establish a tiny target surface before attempting a fuller port

Current state:

- `make_spherai_audio_seed_rom.py` builds a ROM directly from Python
- `spherai_audio_seed.gba` is the generated ROM artifact
- the ROM now boots into GBA video Mode 3, syncs to VBlank, renders a tiny central pixel sphere with two movable seeds, and drives a quieter two-voice sketch with one pulse voice plus one smoother custom wave voice

Why it is this small:

- there is no GBA SDK/toolchain installed in this workspace right now
- this approach avoids blocking on `devkitARM` just to prove platform viability

What this ROM proves:

- we can produce a valid GBA ROM file in-repo
- the Spherai project has a concrete platform foothold on GBA
- we can run a persistent frame loop without a separate SDK
- we can read GBA button input and turn it into visible state changes
- we can draw a tiny interactive surface with direct ARM machine code emitted from Python
- we can initialize and sustain two native GBA voices from the same ROM, including a channel 3 wave-RAM voice

Current controls:

- D-pad moves the main seed
- the second seed mirrors the main seed automatically, so the two-voice field stays alive without any modifier combo
- `Start` recenters both seeds
- the central pixel sphere stays fixed as the field core
- each seed always plays its own tone
- horizontal position snaps each seed to a small consonant note set instead of a continuous glide
- vertical position jumps each seed through four clear register bands
- each seed changes color with its vertical band, so the mapping is visible on-screen
- the left seed uses a softer pulse voice at a lower mix level
- the right seed uses a smoother custom wave voice

Quick launch options:

- Windows Explorer: double-click `Launch Spherai GBA.cmd`
- WSL / bash: run `bash ./targets/gba/launch_spherai_gba.sh` from the repo root
- if `mGBA` is already holding the main ROM open, rebuilds may land in `spherai_audio_seed.next.gba`; the launchers prefer that automatically

What it does not prove yet:

- a full Spherai runtime loop
- performance characteristics of a richer kernel

Next sensible step after this input/visual/audio proof:

1. let vertical position swap between multiple custom wave tables instead of register only
2. add a slower envelope or gentle note lag so movements feel even less abrupt
3. give the pixel sphere a real field shell or simple orbit logic instead of static nested squares
