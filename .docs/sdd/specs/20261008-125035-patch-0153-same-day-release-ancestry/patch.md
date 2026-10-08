---
id: 20261008-125035-patch-0153-same-day-release-ancestry
task: 0153
title: Patch — Test-Roadmap.ps1 y Build-EstimationLog.ps1 deciden lo publicado por ascendencia en git
type: patch
solution: dev-lead
status: done
created: 2026-10-08
branch: patch/fix-same-day-release-and-template-gaps
commit: 236e171a
---

# Patch 0153 — Test-Roadmap.ps1 y Build-EstimationLog.ps1 deciden lo publicado por ascendencia en git

## Capacidades

- Modificadas: `roadmap` — una fila saldada o un patch del día del corte sale en él solo si su artefacto es ascendiente del tag
- Modificadas: `estimation` — el log asigna la release por el tag que contiene el artefacto

## 1. Síntoma

Ticket del patch 0058 de sdd-project-template (`field-reports/20261008-115325-patch-0058-skeleton-kit-232.md` §1, en `develop`): «la última release se cortó el 2026-10-08 y el patch se cerró ese mismo día, después del corte. Su fila en «Patches» (`| 2026-10-08 | 0058 | … |`) la rechaza `Test-Roadmap.ps1`: `roadmap.md: línea 31: patch del 2026-10-08, no posterior a la v0.1.1 (2026-10-08): sale en el corte`. […] Además, `Build-EstimationLog.ps1` asigna los dos patches a la v0.1.1, que no los publica.»

## 2. Solución fijada

Dev-lead, 2026-10-08: «Test-Roadmap.ps1 y Build-EstimationLog.ps1 deciden si un patch o una fila saldada está publicada por ascendencia en git (git merge-base --is-ancestor <commit del patch> <commit de corte de la release>), no por la fecha del día. Criterio: un patch fusionado después del commit de corte, el mismo día, da «Roadmap válido» y queda «sin publicar» en el log.»

Lo que da por existente, comprobado: `Test-ReleasedPatches` y `Test-SettledRows` comparan `$Matches[1] -gt $LastRelease.Date` con fechas sin hora, y `Get-ReleaseLabel` toma la primera versión con `Date -ge` la de la fila. El commit de corte existe como el tag anotado `vX.Y.Z` que fija `sdd-end-release` paso 5; este repo tiene los 13, de `v0.1.0` a `v2.3.2`.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Test-Roadmap.ps1`
  - `skills/sdd-templates/scripts/Build-EstimationLog.ps1`
  - `tests/Test-Roadmap.Tests.ps1`
  - `tests/Build-EstimationLog.Tests.ps1`
- **Cambio**: `Test-Roadmap.ps1` resuelve el tag `v<versión>` de la última release; una fila con fecha no posterior a la release y enlace `specs/…` sale en el corte solo si el commit que añadió ese artefacto es ascendiente del tag. `Build-EstimationLog.ps1` lleva cada artefacto a la primera versión cuyo tag lo contiene, y las versiones del mismo día se recorren de la anterior a la siguiente.
- **Decisiones**:
  - El commit de corte es el tag `v<versión>`, el que `sdd-end-release` pone sobre el merge al estable — sin el dev-lead
  - El commit del patch es el que añadió el artefacto enlazado en la fila (`patch.md`, `walkthrough.md`), con `--no-renames`: una carpeta renumerada cuenta desde el renombrado — sin el dev-lead
  - Sin tag (la release recién cortada, antes del tag: `sdd-end-release` valida el roadmap antes de taggear), sin enlace `specs/…` o sin git, se queda el criterio de la fecha — sin el dev-lead
  - Una fila con fecha posterior a la release no consulta git: no puede estar en ella — sin el dev-lead
  - Dos versiones del mismo día se ordenan por su número de commits (el tag anterior es ascendiente del otro): sin eso, la ascendencia asignaba a la 2.2.0 los artefactos de la 2.1.0 en este repo — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: repo temporal con tag `v1.2.0`, patch y fila saldada del 2026-09-20 añadidos tras el tag | ❌ antes: `línea 26: fila saldada el 2026-09-20 … sale en el corte` y `línea 34: patch del 2026-09-20 … sale en el corte` · ✅ ahora: `Roadmap válido` |
| 2 | el patch del mismo día añadido antes del tag | ✅ sigue fallando con `patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte` |
| 3 | RED: log con `v0.1.0` y `v0.1.1` del 2026-10-08 y un patch tras cada una | ❌ antes: `0.1.1 \| 2` · ✅ ahora: `0.1.0 \| 1`, `0.1.1 \| 1`, `sin publicar \| 1`; sin el desempate del mismo día, falla |
| 4 | log regenerado sobre este repo, contrastado con `git merge-base --is-ancestor` artefacto a artefacto contra los 13 tags | ✅ los recuentos coinciden en las 13 versiones; cambian 0.2.0/0.3.0, 1.0.0, 1.1.0, 2.0.0 y 2.1.0/2.2.0 (fusionados tras el corte o del mismo día). El log se regenera en el corte de la release |
| 5 | `Test-Roadmap.ps1 -Path .docs/sdd` en este repo | ✅ `Roadmap válido`, 1 s |
| 6 | `tests/Test-Roadmap.Tests.ps1`, `tests/Build-EstimationLog.Tests.ps1` | ✅ 43/0 y 71/0 |

Los casos los verificó el agente.

Validación en campo: 2026-10-08 · RED/GREEN en Test-Roadmap.Tests.ps1 y Build-EstimationLog.Tests.ps1 (2 casos nuevos, 43/0 y 71/0) · log de este repo contrastado tag a tag con `git merge-base --is-ancestor` · pre-commit 955/0

## 5. Tiempo (ligero)

- Real: 0,6h

## 6. Delta de capacidad

### Capacidad: `roadmap`

**MODIFIED — Una fila saldada antes de la última release está de más**
- GIVEN una fila de «Deuda técnica» que empieza por `**[Patch 0018, 2026-09-10: saldada — …]**`, una de «Backlog» por `**[Task 0012, 2026-09-20: saldada — …]**`, otra de «Deuda técnica» por `**[Feature 0030, 2026-09-25: saldada — …]**`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `pwsh -NoProfile -File Test-Roadmap.ps1 -Path .docs/sdd`
- THEN escribe `roadmap.md: línea <n>: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y la misma línea para la del 2026-09-20, y sale con 1
- AND la fila del 2026-09-25 no da fallo, ni una fila `parcial` de cualquier fecha
- AND sin ninguna subsección en «Releases cerradas», ninguna fila saldada da fallo
- AND con el tag `v1.2.0` en git, una fila saldada del 2026-09-20 que enlaza `specs/<carpeta>/patch.md` da el fallo solo si el commit que añadió ese fichero es ascendiente del tag; fusionada tras el corte del mismo día, no da fallo

**MODIFIED — Un patch publicado sale de «Patches» en el corte**
- GIVEN una fila de «Patches» con fecha `2026-09-20`, otra con `2026-09-22`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea <n>: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y sale con 1
- AND la fila del 2026-09-22 no da fallo
- AND sin ninguna subsección en «Releases cerradas», ninguna fila de «Patches» da fallo
- AND con el tag `v1.2.0` en git, la fila del 2026-09-20 que enlaza `specs/<carpeta>/patch.md` da el fallo solo si el commit que añadió ese fichero es ascendiente del tag: un patch fusionado tras el corte del mismo día da `Roadmap válido`; sin tag o sin enlace, decide la fecha

### Capacidad: `estimation`

**MODIFIED — El log agrupa por release**
- GIVEN un `<docs>/changelog.md` con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($), de la release más antigua a la más reciente
- AND `Sesión ($)` suma las cifras de los artefactos de la release que la tienen; sin ninguna, `—`
- AND cada artefacto va a la primera versión cuyo tag `vX.Y.Z` contiene el commit que lo añadió, y a la primera con fecha igual o posterior a la de su fila (la de cierre) si la versión no tiene tag; dos versiones del mismo día van de la anterior a la siguiente; los que no caen en ninguna van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin `changelog.md`, o sin versiones con fecha, la tabla no aparece
