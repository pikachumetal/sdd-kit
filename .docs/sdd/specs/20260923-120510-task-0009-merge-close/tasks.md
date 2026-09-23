---
id: 20260923-120510-task-0009-merge-close
title: Tasks — Merge en el cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Merge en el cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0009`

| Task | Estado | Commit | Notas |
| --- | --- | --- | --- |
| 1 — RED del delta y anclas | done | `935c8af` | el pre-commit rechaza la suite en rojo: el test viaja con la implementación |
| 2 — Receta y pasos de rama | done | `935c8af`, `8484a9a` | el segundo es el REFACTOR del GREEN (enmienda aprobada) |
| 3 — GREEN | done | ver commit de la evidencia | 14 sujetos, 6,71 $; R4 retrocedió y se corrigió |

## Evidencia del RED de las anclas

`pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1 -Output Detailed"`, antes de la Task 2:

```text
[-] los dos pasos de rama enlazan la receta
Expected regular expression '\(references/merge-recipe\.md\)' to match '---
[-] el cierre de patch lee la política de merge
Expected regular expression 'merge\.noFf' to match '---
[-] el Art. IV nombra el cierre de patch
Expected regular expression 'el cierre de task y el de patch' to match '# Constitution — sdd-kit
[-] la receta regenera el log con el script
Expected regular expression 'Build-EstimationLog\.ps1' to match $null, but it did not match.
[-] la receta fija los tres datos del informe de denegación
Expected regular expression 'comando' to match $null, but it did not match.
Tests Passed: 20, Failed: 5, Skipped: 0, Inconclusive: 0, NotRun: 0
```

## Revisión de rama

Revisor `general-purpose`, `sonnet` (el tool `Agent` no admite effort: deuda de la 0031), cabecera de `encargo-revision.md`, paquete sin `red/` ni `green/` (64 KB). Veredicto: «With fixes (opcional-recomendado, no bloqueante)», ~119k tokens.

| Hallazgo | Decisión |
| --- | --- |
| Important 1: un `merge-<id>` que sobra de un intento anterior haría fallar `git worktree add` | ruling, sin cambio: «Cuándo» va primero; con `merge-<id>` vivo la rama destino está sacada y el reintento entra por «Sacada» |
| Important 2: sin forma de informe cuando la suite falla tras el merge | a deuda sin medir: ningún escenario lo mostró (Art. I) y superpowers ya dice que se pare |
| Minor 1: «en la carpeta del worktree de la feature» admite dos lecturas | sin cambio: 4/4 sujetos lo leyeron bien en el GREEN; tocarlo pide otro ciclo |
| Minor 2: `ControlProfiles.Tests.ps1` sin salto de línea final | arreglado |

## Smoke del hilo

La receta a mano en PowerShell sobre un repo bare del molde (`DRY=1 subject.sh … r1`), fuera de todo sujeto: `git worktree list` sin `develop` sacada → `git worktree add "$parent/merge-0009" develop` con `$parent = Split-Path (git rev-parse --show-toplevel)` → `git merge --no-ff feature/0009` → `node --test`: `pass 6`, `fail 0` → `git worktree remove` → la lista vuelve a `0008` y `0009`, la feature sigue en `feature/0009` y `develop` apunta al merge commit (`19bf28d merge: task 0009`).

## Fixes adicionales

| # | Qué | Decisión | Commit |
| --- | --- | --- | --- |
| 1 | R4 del GREEN retrocede: se fusiona sin mirar el worktree destino sucio | desvío → enmienda aprobada («si, apruebo») | `8484a9a` |
| 2 | Paso 10 nombraba `sdd-kit.json` sin ruta y un sujeto lo buscó en la raíz | ruling: ruta `.docs/sdd/sdd-kit.json` | `8484a9a` |
