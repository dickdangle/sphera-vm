# Run Guide

This repo now has a separated Goose surface and Spherai surface.

## Official Backend

Preferred server:

```powershell
python active/modules/Server/goose_server_sphera.py
```

Shortcut from repo root in PowerShell:

```powershell
.\run.ps1
```

Shortcut from repo root in bash or WSL:

```bash
./run.sh
```

Then open:

```text
http://localhost:8080
```

Fallback/basic server:

```powershell
python active/modules/Server/goose_server.py
```

## Spherai Interface

Primary browser entry point:

[`active/modules/spherai/spherai.kernel.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\spherai\spherai.kernel.html)

This is the kernel-facing Spherai interface: state engine, field simulator, visualizer, and living entity surface.

## Legacy Goose-Centric Spherai Artifacts

Older mixed-surface prototypes remain available here:

[`active/modules/goose/grok.master.3.5.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\goose\grok.master.3.5.html)

[`active/modules/goose/sphera.3.5.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\goose\sphera.3.5.html)

## Goose Cube

Primary goose entry point:

[`active/modules/goose/index.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\goose\index.html)

Primary active cube surface:

[`active/modules/goose/sm7-goose-cube-v0.1.0.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\goose\sm7-goose-cube-v0.1.0.html)

This is the cleaner promoted goose-cube lane from `byte.txt/`: seeded sheets, formulas, craft bench, and voxel hatch view.

## Kernel Sandbox

Field and operator sandbox:

[`active/modules/kernel/field.weaving.prototype.html`](C:\Users\tmacd\OneDrive\Desktop\Sphera\active\modules\kernel\field.weaving.prototype.html)

This is a standalone canvas prototype for composing vector-field operators and watching particle flow emerge.

## Current Active Layout

```text
active/
  modules/
    Server/
    goose/
    spherai/
    kernel/
    N.visualizer/
    OASP/
    Squidster/
  specs/
```

## Notes

- Older Spherai previews and variants have been moved to `experiments/modules/spherai/`.
- `active/modules/spherai/` is now meant to contain the current working set, not every historical variant.
