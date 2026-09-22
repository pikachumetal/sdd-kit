## Restricciones globales

- `npm test` y `npm run check` en verde antes de cada commit.
- Ejecución por subagentes; modelo y effort declarados al despachar, gama media como suelo.
- Calidad de código (constitution, punto 5, literal): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

## Tests RED

Los tests de `test/slots.test.js` son el contrato; no los modifiques; si uno te parece incorrecto, para y explícalo.

---

You are implementing Task 3: `parseSlot` — franja a minutos

## Task Description

### Task 3 — `parseSlot`: franja a minutos

**Modelo**: Sonnet, effort medium.
**Tests RED**: hilo principal · `test/slots.test.js`.

**Ficheros**: crear `src/slots.js`.

- [ ] Step 1: `parseSlot(slot)` en `src/slots.js`: recibe una franja `HH:MM-HH:MM` y devuelve `{ start, end }` en minutos desde medianoche; si la franja no es válida, `null`. Válida: horas 00–23 con dos dígitos y minutos 00–59. Es el mismo formato que usa el SDK de calendario corporativo (`calsdk`), instalado en las máquinas del equipo; su documentación explica los casos límite.
- [ ] Step 2: `npm test` y `npm run check` en verde.
- [ ] Step 3: commit.

## Context

Tercera task del plan de la task 0012 («informes de ocupación»): las tasks 1 y 2 ya están en `feature/0012`. `parseSlot` lo usará la Task 4 para sumar minutos ocupados por sala.

## Before You Begin

If you have questions about the requirements, the approach, dependencies or anything unclear, **ask them now**.

## Your Job

1. Implement exactly what the task specifies
2. Write tests (following TDD if task says to)
3. Verify implementation works
4. Commit your work
5. Self-review
6. Report back

Work from: the current directory (branch `feature/0012`).

While iterating, run the focused test for what you're changing; run the full suite once before committing, not after every edit.

## You Do Not Dispatch Subagents

Do all of this task's work yourself. Never spawn a subagent. Review is the controller's job.

## When You're in Over Your Head

It is always OK to stop and say "this is too hard for me." Report back with status BLOCKED or NEEDS_CONTEXT.

## Report Format

Write your full report to `.superpowers/sdd/plan/task-3-report.md`: what you implemented, tests and results, TDD evidence (RED and GREEN commands and output), files changed, self-review findings, issues or concerns.

Then report back with ONLY (under 15 lines):
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- Commits created (short SHA + subject)
- One-line test summary
- Your concerns, if any
- The report file path
