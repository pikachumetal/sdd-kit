---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — a4a1adc.
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — 4327e99.
- La capacidad `bookings` nace en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. En `tasks.md` la Task 1 apuntaba a 4327e99 (el commit de la Task 2); corregido a a4a1adc.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en lugar del `node --test` del plan, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas también pasa 5/5 (la carrera no se reproduce).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 · 0,11 s; `node --test --test-concurrency=1` → 5/5 · 0,18 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/4 THEN con ejecución real por el CLI (`node src/app.js …`), el cuarto solo en proceso · revisión final Spec y Código sobre 4327e99, limpia; HEAD solo añade `tasks.md` (documentación) · no probado: `canceladas` tras `cancelar` entre procesos del CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista (`--motivo xyz`) → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (la suite no lo cubre) | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real solo en proceso (`run()` tras `cancelar`); por el CLI, `node src/app.js canceladas` imprime una línea vacía | ok en proceso · **no se cumple por el CLI** |

### 4.3 Residuales / deuda generada

- **El almacén es en memoria y cada comando del CLI es un proceso nuevo**: el usuario no puede ver con `canceladas` lo que canceló con `cancelar`. La spec no pedía persistencia y el escenario solo se cumple en proceso. Además `test/cancel.test.js` prueba `canceladas` apoyándose en el estado que deja el test anterior: depende del orden. Fila nueva en `steering/debt.md`.
- Sin test para «sin `--motivo`» (un THEN de la spec). Va en la misma fila de deuda.
- Los motivos siguen solo en castellano: el inglés queda en la deuda «Los motivos no se traducen».

## 5. Aprendizajes

- El comportamiento de cancelar con motivo y de `canceladas` → `.docs/sdd/capabilities/bookings.md` (fusión del delta).
- Un THEN de un listado que depende de estado previo hay que probarlo por el CLI real, no solo por `run()`: con almacén en memoria, ambos divergen → fila de deuda en `steering/debt.md`, sin doc de anclaje nuevo que lo recoja (el proyecto no tiene `architecture.md`).

## 6. Adendas

