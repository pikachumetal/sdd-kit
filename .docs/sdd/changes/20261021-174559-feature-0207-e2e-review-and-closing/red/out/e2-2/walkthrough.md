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

- `src/app.js` (53ca1db, 971bceb): `cancelar` exige `--motivo` de la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y lo devuelve entre paréntesis; comando nuevo `canceladas`.
- `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (53ca1db, 971bceb): tests del motivo válido, del inválido y del listado.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (El gate de `operations.md` y `package.json` siguen con `node --test test/`; el ruling no llegó a escribirse allí.)

## 4. Verificación

### 4.1 Builds

- Suite unitaria: `node --test test/` → 5/5 · 0,1 s.
- Suite E2E: `node e2e/run.mjs` → 7/7 · 48 s, **tres pasadas seguidas** (48,2 s · 48,2 s · 48,1 s), entorno levantado con `scripts/env-up.mjs`, sin retries y con los mismos 7 verdes en cada una: sin inestabilidad. Las specs de la rama son `cancel.e2e.mjs` y `free.e2e.mjs`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · suite unitaria 5/5 · E2E 7/7 ×3 · smoke de los 4 THEN con ejecución real · revisión final Spec y Código sobre 971bceb limpia; después solo cambia documentación (`tasks.md`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite + E2E | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite + E2E | ok |
| sin `--motivo` → el mismo «motivo no válido: …» | ejecución real (ni la suite ni el E2E lo cubren) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite + E2E | ok |

### 4.3 Residuales / deuda generada

- El test unitario de `canceladas` depende del estado que deja el test anterior (almacén compartido): fila de deuda.
- El cambio de 53ca1db quitó el test de «cancelar sin reserva lo dice»; con motivo válido sigue respondiendo «sin reserva Sur mar» (ejecución real), pero ya no lo guarda ningún test: fila de deuda.
- Sin `--motivo` no tiene test automático: fila de deuda.
- `roadmap check` ya fallaba antes de este cierre en dos líneas que no escribí (cabecera de «Deuda técnica» y de la release v0.3.0).

## 5. Aprendizajes

- Capacidad nueva `bookings` → `capabilities/bookings.md` (`sdd capability merge`).
- Sin `architecture.md`, sin `constitution` que cambie y sin `.claude/skills/`: miradas, no aplica.

## 6. Adendas

