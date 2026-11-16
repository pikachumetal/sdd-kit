---
id: 20261026-111623-patch-0212-plan-workspace-temp
task: 0212
title: Patch — el workspace del plan pasa de `.superpowers/sdd/` a `.temp/sdd/`
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: patch/0212-plan-workspace-temp
commit: b4db4f3a
---

# Patch 0212 — el workspace del plan pasa de `.superpowers/sdd/` a `.temp/sdd/`

## Capacidades

- Modificadas: `feature-flow` — «El workspace del plan se anuncia» nombra la ruta nueva

## 1. Síntoma

Dev-lead, 2026-10-25: «veo que se sigue creando una carpeta .superpowers… tendríamos que usar una de nuestras carpetas para ella, porque creo que es datos temporales de agentes».

## 2. Solución fijada

Fila 0212 del roadmap (dev-lead, 2026-10-25, y prompt de arranque del 2026-10-26): «la base pasa a `<raíz del worktree>/.temp/sdd/`, que muere con el worktree desde la 0209 y queda fuera de `.temp/claude/`, la única carpeta que borra la 0210, así que el ledger de una feature parada más de 24 h sobrevive; la línea `.superpowers/` sigue en `INIT_IGNORES` y en la migración v2.0.0, porque superpowers usado fuera del kit escribe ahí».

Lo que da por existente, comprobado: la carpeta la crea la CLI del kit, no superpowers, en `cli/src/tasks/workspace.ts:70` (`join(root, '.superpowers', 'sdd')`), y de ahí la leen `sdd workspace`, `sdd task brief`, `sdd ledger` y el paquete de revisión. Ninguna skill nombra la ruta: `sdd-implement` y `sdd-verify` usan `<ruta>` o `$(sdd workspace "<plan>")`.

## 3. Fix

- **Fichero(s)**: `cli/src/tasks/workspace.ts`; `cli/test/tasks/workspace.slow.test.ts`, `executing.slow.test.ts`, `native.slow.test.ts`; `cli/test/watch/helpers.ts`; `tests/batteries/sdd-implement/subject.sh`, `tests/batteries/sdd-verify/subject.sh`; `tests/batteries/sdd-implement/mold-kit/.gitignore`, `mold-reservas/.gitignore`
- **Cambio**: la base del workspace pasa a `<raíz>/.temp/sdd`; los tests, la ruta de ejemplo de `watch` y la recogida del ledger de las dos baterías la siguen, y los moldes ignoran `.temp/` como hace `sdd init`.
- **Decisiones**:
  - Base `<raíz del worktree>/.temp/sdd/`; `.superpowers/` sigue en `INIT_IGNORES` y en la migración v2.0.0 — dev-lead
  - La evidencia RED/GREEN cerrada y los tickets de campo que citan `.superpowers/sdd/` no se reescriben — dev-lead
  - Sin texto de skill: no pide RED de sujetos (Art. I) — dev-lead
  - Los moldes de `sdd-implement` ganan `.temp/` y conservan `.superpowers/`, como el `.gitignore` que deja `sdd init` — sin el dev-lead (no cambia lo que ve ni puede hacer el usuario del kit: son fixtures de las baterías)
  - `tests/batteries/sdd-verify/compose-axis.mjs`, que nombraba la fila, no se toca: solo lee el `code-reviewer.md` del plugin superpowers (`--superpowers`), no el workspace — sin el dev-lead
  - Un workspace a medias en `.superpowers/sdd/` de una feature abierta antes de este patch no se migra: el plan arranca un workspace nuevo en `.temp/sdd/` y el ledger viejo queda donde estaba — sin el dev-lead (no cambia lo que ve ni puede hacer el usuario: el ledger es un registro interno del agente)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: tests de `cli/test/tasks/` con `.temp/sdd` esperado, código sin tocar | 18/46 fallan (`workspace.slow`, `executing.slow`) |
| 2 | GREEN: `vitest run test/tasks/ test/watch/` | 78/78 |
| 3 | `bash -n` de los dos `subject.sh` | sin errores |
| 4 | Commit del fix con el pre-commit activo (`git config core.hooksPath` → `.githooks`) | `kit:test-fast` en verde |
| 5 | `sdd capability merge` del delta en una copia de `.docs/sdd` y, al cerrar, en el repo | `feature-flow.md: sustituido «El workspace del plan se anuncia»`; el literal `.superpowers/sdd` no queda en `feature-flow.md` |
| 6 | Gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre `b4db4f3a` | 1ª pasada: `cli:test` 1182/1182, `kit:test` 1418/0 (14 omitidos), `cli:test-min` 1480/1: `test/ids/claim.slow.test.ts`, `TypeError: Cannot read properties of undefined (reading 'trim')`, fichero ajeno a la rama. Ese fichero solo con node 22.18.0: 29/29 (385 s). 2ª pasada de `cli:typecheck cli:test-slow cli:test-min`: `cli:test-slow` 299/299, `cli:test-min` 1481/1481. El intermitente va a una fila de deuda |

Validación en campo: 2026-10-26 · RED 18/46 → GREEN 78/78 en `cli/test/tasks/` y `cli/test/watch/` · gate de cierre en verde en la 2ª pasada (`cli:test-min` intermitente en `claim.slow.test.ts`, ajeno, a la deuda) · no probado: una batería de `sdd-implement` o `sdd-verify` con sujetos que escriba su ledger en `.temp/sdd/` (sin texto de skill, no se lanzan sujetos)

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-26T11:16Z
- Esfuerzo real: 1,20 h — reloj de la sesión 1,20 h desde 2026-10-26T11:15Z, sin 0 min de espera al dev-lead (0 esperas)
- Desvío: +140 %, por el gate de cierre: 33 min la 1ª pasada, 6 min el contraste del rojo de `claim.slow.test.ts` y 25 min la 2ª pasada
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**MODIFIED — El workspace del plan se anuncia**
- GIVEN un plan sin workspace en `.temp/sdd/`
- WHEN `sdd-implement` lo crea
- THEN dice al dev-lead `Workspace del plan: .temp/sdd/plan/ — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con un ledger del mismo plan con `Task 1: complete …`, la línea acaba en `· retomo en la Task 2`
