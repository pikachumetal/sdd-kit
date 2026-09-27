---
id: 20260925-080508-patch-0071-roadmap-structure-tests
task: 0071
title: Patch — nada comprueba la estructura del roadmap
type: patch
status: done
created: 2026-09-25
branch: feature/0071-roadmap-structure-tests
commit: 9f0b902
---

# Patch 0071 — nada comprueba la estructura del roadmap

## 1. Síntoma

Fila de deuda del roadmap «Nada comprueba la estructura del roadmap» ([ticket 0063](../../field-reports/20260925-070256-task-0063-end-release-cut.md) §1, [ticket del patch 0069](../../field-reports/20260925-072140-patch-0069-scope-brake-registries.md) §1a): dos filas de deuda quedaron encima de `# Roadmap`, la fila del patch 0051 pegada en la cabecera de «Próximo» y un triaje dejó dos filas vacías (`9b62ba2`); se repararon a mano en `0fc231e`. Además, `PathLength.Tests.ps1` pasa en falso antes de `git add` ([ticket 0063](../../field-reports/20260925-070256-task-0063-end-release-cut.md) §3).

## 2. Causa raíz

- Ningún fichero de `tests/` lee `.docs/sdd/roadmap.md` para validar su forma: los cuatro defectos de `0fc231e^` pasaron el pre-commit de sus commits (`1da9ec3`, `9b62ba2`) sin que nada fallase.
- `PathLength.Tests.ps1` construía la lista con `git ls-files`, que solo devuelve el índice. Reproducido: con un fichero sin versionar de 148 caracteres en `tests/fixtures/`, el test pasaba 2/2.

## 3. Fix

- **Fichero(s)**: `tests/RoadmapStructure.Tests.ps1` (nuevo), `tests/fixtures/roadmap-structure/roadmap-0fc231e-parent.md` (nuevo), `tests/PathLength.Tests.ps1`
- **Cambio**: `RoadmapStructure.Tests.ps1`, sin tag `Slow`, entra en el conjunto rápido. Comprueba que la primera línea empieza por `# Roadmap`, que cada fila `|` va tras una cabecera y un separador en su bloque, que la cabecera tiene las mismas celdas que el separador y que no hay filas vacías. Un segundo `It` fija los defectos que detecta sobre un extracto literal del roadmap de `0fc231e^`, que tiene los cuatro: el de `1da9ec3` y el de `9b62ba2`. `PathLength` añade `--others --exclude-standard` a `git ls-files`.

## 4. Verificación

Verificado por el agente.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `RoadmapStructure` con `SDD_KIT_ROOT` apuntando a una copia entera del roadmap de `0fc231e^` | ✅ falla con 7 problemas: línea 1 sin `# Roadmap`, filas sueltas en 1, 2 y 7, cabecera de 1 celda contra separador de 3 en la 8, filas vacías en 162 y 163 |
| 2 | GREEN: `RoadmapStructure` sobre el roadmap actual y sobre el extracto | ✅ 2/2 |
| 3 | RED: `PathLength` con un fichero sin versionar de 148 caracteres, antes del fix | ✅ reproduce el falso verde: 2/2 pasan |
| 4 | GREEN: el mismo fichero después del fix | ✅ falla y nombra `148 tests/fixtures/xxx….md`; al borrarlo, 2/2 |
| 5 | Conjunto rápido (`-ExcludeTagFilter Slow`) | ✅ 630 pasan, 0 fallan, 18,4 s |
| 6 | Validación del dev-lead | 🧪 diferida a uso (dev-lead, 2026-09-25: «pruebas diferidas a uso»): el próximo commit que toque `roadmap.md` y la próxima ruta larga sin versionar |

## 5. Tiempo (ligero)

- Estimación: no la hubo
- Real: 0,25 h
