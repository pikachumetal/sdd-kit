---
id: 20260920-202137-task-0001-task-ids
title: Tasks — Ids de task y numeración sin gestor de tickets
spec: ./spec.md
plan: ./plan.md
created: 2026-09-20
---

# Tasks — Ids de task y numeración sin gestor de tickets (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0001`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Baseline RED (Art. I) | done | 4796426 | `tests/task-ids-red.md`. 2 sujetos (1,46 $ y 1,80 $) + evidencia de campo. Recorte: el sufijo `0006a` no lo respaldan los sujetos (0/2), solo la evidencia de campo |
| 2 | Script `Get-NextSddId.ps1` | done | 4796426 | Sonnet high + dos fixes del contrato: aislar la fuente de ramas al repo del proyecto y limpiar `GIT_DIR`/`GIT_WORK_TREE` del entorno |
| 3 | Skills de carril leen el modo de ids | done | d37c93d | Sonnet high. 6 ficheros, cambios de 1-3 líneas |
| 4 | Init, plantillas, migración y Art. IV | done | 5466145 | Sonnet high, en paralelo con la 3 sin conflictos |
| 5 | Campaña GREEN (Art. I) | done | 541c8d1 | 3 sujetos (1,17 $ · 2,10 $ · 0,97 $). 1 hueco de la guidance corregido: la fila de la mitad partida en el roadmap |

## Verificación por task

- [x] Task 1 — `tests/task-ids-red.md` escrito, con resultados verificados en disco
- [x] Task 2 — `Invoke-Pester tests/Get-NextSddId.Tests.ps1` verde + suite completa sin regresiones
- [x] Task 3 — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Skills.Tests.ps1` verde
- [x] Task 4 — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Manifests.Tests.ps1 tests/NamingConvention.Tests.ps1` verde
- [x] Task 5 — `tests/task-ids-green.md` con veredicto contra cada fallo del RED + suite completa verde

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| El hook de pre-commit del repo bloquea cualquier commit con la suite en rojo, así que el paso 6 de `sdd-start-task` («el hilo escribe los tests y los commitea antes de despachar») es imposible de cumplir aquí | El hook corre `Invoke-Pester tests/` sobre el **working tree**, no sobre el índice; un test RED en disco basta para bloquear | Los tests viajan al implementador como ficheros del working tree (contrato igual de vinculante) y se commitean junto a la implementación que los pone en verde. `TaskIds.Tests.ps1` espera en el scratchpad con `$env:SDD_KIT_ROOT` hasta que las Tasks 3 y 4 acaben. **Va al ticket de campo del kit**: el choque entre el paso 6 y un hook de suite verde no está resuelto en ninguna skill | — |
| `git init` + `git add -A` + `commit` de un helper de test cayeron en el worktree real (commit `3d09ef9 fixture`), y dejaron dos ramas basura (`feature/0009-export`, `hotfix/0011`) | `$TestDrive` llega `$null` dentro de una función definida en `BeforeAll`: `Join-Path $null <guid>` dio una ruta relativa y `Push-Location` no cambió de directorio, así que git operó sobre el cwd | Deshecho con `git reset --mixed b1df975` (árbol intacto). Helper reescrito: `git -C` en vez de `Push-Location` y directorio temporal propio verificado — la clase de bug desaparece, no solo el caso. Las dos ramas las borra el dev-lead (`git branch -D` está bloqueado para el agente) | — |

## Revisión final de rama

Un revisor (Sonnet medium) sobre el diff completo contra `main`: **4 hallazgos, todos aceptados y corregidos** en `541c8d1` — ramas omitidas en silencio en un proyecto dentro de un monorepo (Crítico), carpetas históricas con sufijo fuera del cómputo (Importante), `generacion.md` con el literal de `sdd-kit.json` sin `ids` (Importante) y `sdd-start-patch` sin la regla inline (Menor). Los dos primeros llevan caso de test propio.

**Desviación del plan**: el plan preveía un revisor por task; se ejecutó **un solo revisor final** sobre el diff de la rama. Motivo: las tres tasks de implementación son pequeñas y ninguna toca ficheros de otra, así que un revisor con el diff completo ve también las incoherencias entre ellas — y de hecho el hallazgo 3 es justo de ese tipo. Ruling del hilo, sin consultar al dev-lead.
