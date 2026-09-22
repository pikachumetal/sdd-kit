---
id: 20260922-153843-task-0010-token-cost
task: 0010
title: Tasks — Estimación con tokens y modelos reales
plan: ./plan.md
---

# Tasks — registro vivo

| Task | Estado | Commit | Notas |
| --- | --- | --- | --- |
| 1 — Sección 2 de `walkthrough-template.md` | ✅ | `6fd401c` + ajuste tras la ronda 1 del GREEN | En línea |
| 2 — Tres columnas de coste en `Build-EstimationLog.ps1` | ✅ | `cfe160f` | En línea, TDD: 19 tests en rojo → 35/0 |
| 3 — Calibración en `estimation.md` | ✅ | `1039c02` | En línea |
| 4 — GREEN con sujetos | ✅ | este commit | 4 sujetos Sonnet en dos rondas, 4,40 $ |

## Fuera del plan

- `merge` `7e257b9` — integración de `develop` (tasks 0018 y 0025, patch 0030). Conflicto de `estimation-log.md` resuelto regenerando con el script.
- Dentro de ese merge, dos tests que llegan de `develop` (`RoadmapClosing`, `ScopeBrake`) resolvían la raíz del repo con `git rev-parse --show-toplevel` y fallaban por el mismo defecto de codificación de la decisión 8; pasan al patrón `$PSScriptRoot/..` que usan los otros seis.

- `fix(templates)` `c4fab15` — arreglo de `Get-NextSddId.ps1` con rutas no ASCII (decisión 8 de la spec), hecho antes del plan porque bloqueaba el pre-commit.
