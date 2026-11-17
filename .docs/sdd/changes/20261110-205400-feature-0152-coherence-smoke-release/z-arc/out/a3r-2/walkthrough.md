---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js` (4b85d62).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (5d428a4).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: solo, falla con `''` en vez de `Norte lun — sala ocupada`). Fila en la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js test/cancel.test.js` → 5/5 verdes, sobre 5cb86cb.
- `node --test` entero → 5/6: falla solo `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms»). Mismo fallo, mismo error, con el fichero solo en la rama y en un worktree desacoplado de `develop` (922ada5): no lo causa esta feature; ya está en la deuda («Por triar», revisión de la 0007).
- Gate: el proyecto no declara gate ni suites (no hay `operations.md`) → `node --test` entero, sobre 5cb86cb.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite de la feature 5/5 · smoke 5/5 THEN con ejecución real (el listado, en un solo proceso: ver nota) · revisión final Spec y Código limpias sobre 5d428a4; `HEAD` solo añadió `tasks.md`, sin re-revisión. Nadie del equipo ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (`cancelar Norte lun`) | ok (la suite no lo cubre) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` y `run('canceladas')` seguidos) + suite | ok en un proceso; **por la CLI, en procesos separados, `canceladas` no imprime nada**: el estado vive en memoria. Lo cubre la 0014 «Motivo guardado» |

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden → «Por triar» de `debt.md`.
- La CLI no conserva las canceladas entre ejecuciones: pendiente de la 0014, ya en el roadmap.

## 5. Aprendizajes

- Cada test debe preparar sus datos; el de `canceladas` no lo hace → deuda («Por triar»).

Retro: sin señales

## 6. Adendas

- _Ninguna_
