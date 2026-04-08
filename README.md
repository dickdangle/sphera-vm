# Sphera Workspace

This repository is now organized into three top-level buckets:

- `active/` for the code and specs most worth building on
- `experiments/` for prototypes, pre-alpha work, and sandbox outputs
- `archive/` for older assets, reference material, and side collections

## Active

Primary working area:

- `active/modules/Server/`
  - Python HTTP servers for the Goose surface
  - Official backend:
    - `python active/modules/Server/goose_server_sphera.py`
  - Alternate backend:
    - `python active/modules/Server/goose_server.py`
- `active/modules/goose/`
  - Goose-facing browser artifacts, cube launchers, and mixed world prototypes
  - Includes:
    - `active/modules/goose/index.html`
    - `active/modules/goose/sm7-goose-cube-v0.1.0.html`
    - `active/modules/goose/grok.master.3.5.html`
    - `active/modules/goose/sphera.3.5.html`
- `active/modules/spherai/`
  - Canonical Spherai interface surface
  - Primary entry point: `active/modules/spherai/spherai.kernel.html`
- `active/modules/kernel/`
  - Kernel and lower-level visualization work
  - Includes `active/modules/kernel/field.weaving.prototype.html`
- `active/modules/N.visualizer/`
- `active/modules/OASP/`
- `active/modules/Squidster/`
- `active/specs/`
  - Current spec and design documents

## Experiments

Prototype and sandbox material lives here:

- `experiments/pre.alpha.feats/`
  - Early Python experiments
  - Still contains a local `venv/`
- `experiments/SQDVM/`
  - Standalone concept demos
- `experiments/modules/spherai/`
  - Older Spherai previews and variant builds
- `experiments/root/`
  - Loose prototype exports, generated variants, and workbench files moved out of the root

## Archive

Older or less immediately actionable material lives here:

- `archive/Art/`
  - Media, recordings, and visual assets
- `archive/root/`
  - Older loose notes and documents moved out of the root

## Current Project Shape

The core project is still not a single packaged app. It is primarily:

- standalone HTML prototypes with inline CSS/JS
- a goose-specific Python backend in `active/modules/Server/`
- a separate Spherai interface track in `active/modules/spherai/`
- specs and design notes in `active/specs/`

There is still no repo-level package manifest, build pipeline, or shared test/lint setup.

## Recommended Working Surface

If you want to work on the most promising code first, start here:

1. `active/modules/Server/`
2. `active/modules/spherai/`
3. `active/modules/kernel/`
4. `active/modules/goose/`

For a quick start, see `RUNME.md`.

## Notes

- A root `.gitignore` is present to reduce noise from local environments and generated artifacts.
- `Vita/` is kept at the repo root.
- Windows is reporting some `Vita` path oddities as reparse points, so if both root and archive views appear in the shell, treat root `Vita/` as canonical.
