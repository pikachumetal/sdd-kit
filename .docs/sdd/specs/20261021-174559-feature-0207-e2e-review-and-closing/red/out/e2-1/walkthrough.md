---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando nuevo `canceladas` (Tasks 1 y 2, commit `db03372`).
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado.
- Soporte E2E (commit `f4a9290`, previo a la spec): `e2e/`, `server.mjs`, `scripts/env-up.mjs`, `scripts/env-down.mjs`.
- Capacidad nueva `capabilities/bookings.md`, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El plan decía «Gate de cierre: `node --test`» y `operations.md` dice `node --test test/ && node e2e/run.mjs`; el cierre ha corrido este último.

### Decisiones tomadas sin el dev-lead

- Task 2: usar `node --test --test-concurrency=1` en el gate para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre ese flag no está en `package.json` ni en `operations.md`, y la suite pasa 5/5 con y sin él; queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa, sobre `db03372` más la documentación del cierre (sin cambios de código): `node --test test/` → 5/5 verdes · 0,14 s; `node e2e/run.mjs` sobre las dos specs (`cancel`, `free`, que son todas las de `e2e/`) con `--repeat-each=3` → 21 passed, 0 failed, 0 reintentos · 144,4 s. Son 7 tests por pasada, todos estables en las tres.
- Revisión final: Spec (opus + high) y Código (sonnet + high), limpias, sobre `db03372`. Después solo se añadió `tasks.md` (17 líneas de documentación, juntado en el cierre): no se re-revisa.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · suite unitaria 5/5 · E2E 21/21 (3 pasadas) · smoke de 4 THEN con ejecución real contra el servidor del entorno E2E (sesión propia) · revisión final Spec y Código limpia sobre `db03372`. Ningún humano ha probado el cambio.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras esa cancelación responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Tests que comparten el almacén en memoria: fila de deuda en `roadmap.md`.
- La suite E2E tarda ~48 s frente al presupuesto de 0,5 min de `operations.md`: fila de deuda en `roadmap.md`.
- `roadmap.md` no pasa `sdd roadmap check` por dos líneas anteriores a esta feature (cabecera de «Deuda técnica» y cabecera de la release `v0.3.0`); no se han tocado.
- Posible solape con la fila 0014 («Motivo guardado… en el almacén de reservas»): esta feature ya guarda el motivo con la reserva en memoria. No se ha marcado; lo decide el dev-lead.
- La spec numera sus decisiones 1 y 3, sin la 2.

## 5. Aprendizajes

- Comportamiento observable nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`, creada por la fusión del delta.
- Carrera entre tests por el almacén compartido → fila de deuda en `roadmap.md`.
- Presupuesto E2E superado por el ritmo de la traza completa → fila de deuda en `roadmap.md`.
- Sin aprendizajes para `constitution.md`, `architecture.md` (no existe; nada estructural que volcar) ni `tech-stack.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y esta feature no revela un patrón reutilizable. No aplica.
- ADR: la spec no declara candidatas; `sdd decision check` sale con 0.

## 6. Adendas

- _Ninguna._
