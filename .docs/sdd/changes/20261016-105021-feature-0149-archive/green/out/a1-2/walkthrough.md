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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js`, 236d17e.
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js`, 236d17e.
- Capacidad nueva `bookings` en `capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- Tokens del hilo: 644.375 — claude-sonnet-5-5 644.375
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,04 h — reloj de 2 sesiones 0,04 h desde 2026-10-16T11:39Z, sin 0 min de espera al dev-lead (0 esperas)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre la suite también pasa sin la opción (5/5); la deuda queda en el roadmap.
- Al cerrar: `bookings` pasó de «Modificadas» a «Nuevas» en la spec, porque no existía en `capabilities/` y todo su delta es `ADDED`; lo señaló `sdd capability merge`.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 · 0,5 s · sobre 6464666. Sin la opción: `node --test` → 5/5 · 0,16 s.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre 236d17e, limpia; el commit posterior solo cambia `tasks.md` (17 líneas) y no se re-revisó. El dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` → el mismo texto | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | suite · ejecución real (importando `run`, porque el almacén es en memoria y no persiste entre invocaciones de la CLI) | ok |

### 4.3 Residuales / deuda generada

- Carrera de los tests sobre el almacén compartido → fila en la deuda técnica del roadmap.
- 0014 «Motivo guardado» sigue en el roadmap: el almacén es en memoria.

## 5. Aprendizajes

- El gate necesita `--test-concurrency=1` por el almacén compartido → deuda técnica del roadmap (no se escribe en `tech-stack.md`).
- Sin `.claude/skills/` en el proyecto: revisado, no hay patrón que justifique una skill. `architecture.md` no existe y no hubo aprendizaje estructural.

## 6. Adendas

- _Ninguna_
