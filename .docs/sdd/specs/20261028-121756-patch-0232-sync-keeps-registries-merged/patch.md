---
id: 20261028-121756-patch-0232-sync-keeps-registries-merged
task: 0232
title: Patch — `sdd merge --sync` deja unidos los registros cuando choca otro fichero
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: patch/0232-sync-keeps-registries-merged
commit: <hash>
---

# Patch 0232 — `sdd merge --sync` deja unidos los registros cuando choca otro fichero

## Capacidades

- Modificadas: `control-profiles` — «Un conflicto que no se puede conservar entero es de una persona» y «El merge de sincronización lo hace `sdd merge --sync`»: con un conflicto que no resuelve, `--sync` deja el merge a medias en vez de abortarlo

## 1. Síntoma

[Ticket de la feature 0221](../../field-reports/20261027-172742-feature-0221-affected-closing-gate.md) §3: los dos syncs de la 0221 abortaron por conflictos en `tech-stack.md`, una capacidad y dos Pester borrados por la otra rama; con `git merge --no-commit` a mano, `roadmap.md` y `estimation-log.md` salieron también en conflicto y el pre-commit rechazó el commit: «roadmap.md: línea 104: fila fuera de una tabla con cabecera y separador».

## 2. Solución fijada

Fila 0232 del roadmap (dev-lead, 2026-10-27, al triar el ticket de la feature 0221: «Patch nuevo de la CLI»): «Con conflictos fuera de los registros, `--sync` deja el merge a medias con los registros ya unidos por id y lista solo el resto. GIVEN una rama y una base que editan filas contiguas del roadmap y la misma línea de `tech-stack.md` WHEN `sdd merge --sync` THEN el roadmap queda unido y solo `tech-stack.md` queda en conflicto».

Lo que da por existente, comprobado: `completeMergeAttempt` (`cli/src/merge/attempt.ts`) hace `git merge --abort` en cuanto `resolveConflicts` devuelve algún fichero, y `resolveConflicts` (`cli/src/merge/registries.ts`) solo hace `git add` de lo resuelto cuando no queda nada; el registro unido se pierde con el abort. El RED lo midió: con el test nuevo, la salida ya lista solo `tech-stack.md`, pero no hay `MERGE_HEAD` (`fatal: ambiguous argument 'MERGE_HEAD'`).

## 3. Fix

- **Fichero(s)**: `cli/src/merge/attempt.ts`, `cli/src/merge/registries.ts`, `cli/test/merge/sync.slow.test.ts`, `skills/sdd-archive/references/merge-recipe.md`
- **Cambio**: en un merge de sincronización (`mergedDestination` definido, solo lo pone `--sync`), `resolveConflicts` añade al índice lo que resolvió —con el `estimation-log.md` regenerado— aunque quede algo, y `completeMergeAttempt` ya no aborta: sale con `base: conflicto en <lo que queda>.` y el merge a medias. El merge del cierre y la vuelta de un hotfix siguen abortando. La receta, en «Integrated base», dice que el merge queda a medias para una persona. El test «un conflicto real aborta y deja la rama como estaba» pasa a medir la conducta nueva.
- **Decisiones**:
  - El test va en `cli/test/merge/`, con filas contiguas del roadmap y la misma línea de `tech-stack.md` — dev-lead
  - En `merge-recipe.md` solo se toca «Integrated base»; «A red suite» la toca la 0230 — dev-lead
  - El mensaje sigue siendo `base: conflicto en <ficheros>.`, sin línea nueva: lo que significa lo dice la receta — sin el dev-lead (no cambia lo que se ve: el literal es el de hoy)
  - La fila de salidas `base: conflicto en <files>.` de «Its outputs» no se toca: «leaves a conflict nothing resolved» sigue siendo cierto — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test nuevo de `sync.slow.test.ts` sin el arreglo | ❌ como se esperaba: `git rev-parse MERGE_HEAD … fatal: ambiguous argument 'MERGE_HEAD'` (el merge se abortó) |
| 2 | GREEN: `vitest run test/merge` con el arreglo | ✅ 20 ficheros, 157/157; `tsc --noEmit` en verde |

## 5. Tiempo (ligero)

- Estimación: 1 h + 1,17 h del gate de cierre (70 min, patch 0222)
- Inicio: 2026-10-28T12:17Z

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — Un conflicto que no se puede conservar entero es de una persona**
- GIVEN un cierre cuyo `sdd merge --sync` o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`), o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy; `sdd merge` ya ha abortado el merge, y `--sync` lo deja a medias en el worktree, con los registros ya unidos, para que una persona resuelva los ficheros que lista y lo commitee
- AND con `vuelta: conflicto en <ficheros>` de un hotfix, el script ya lo ha deshecho todo: una persona porta el arreglo a la rama de integración y relanza el hotfix

**MODIFIED — El merge de sincronización lo hace `sdd merge --sync`**
- GIVEN la rama `feature/0186-x` con su commit de cierre, y `origin/develop` con la 0185 fusionada, que, como la rama, añade un requisito al final de `.docs/sdd/capabilities/routing.md` y una fila al roadmap
- WHEN se ejecuta `sdd merge --sync --project-root <worktree de la 0186>`
- THEN integra `origin/develop` en `feature/0186-x` con la misma resolución que el merge del cierre, sin coger el cerrojo, sin `--verify` y sin push; la capacidad queda con los dos requisitos (primero el de `develop`) y el roadmap con las dos filas, y escribe `base: integrada 'origin/develop' en 'feature/0186-x': <hash>`
- AND si `origin/develop` ya es antecesora de la rama, no hace nada y escribe `base: al día: 'origin/develop' ya está en 'feature/0186-x'`
- AND con un conflicto que no resuelve, no aborta: deja el merge a medias, con lo que sí resuelve —los registros unidos por id— ya en el índice, y sale con 1 con `base: conflicto en <ficheros>.`, que lista solo lo que queda; con filas contiguas del roadmap y la misma línea de `tech-stack.md` editadas en los dos lados, el roadmap queda unido y solo `tech-stack.md` en conflicto
- AND con cambios sin commitear, o con otro merge a medias, sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- AND en un HEAD desacoplado sale con 1 sin tocar nada: `base: HEAD desacoplado; --sync integra la base en una rama`
- AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at`, `--check` o `--branch` sale con 2: `--sync no admite <opción>`
