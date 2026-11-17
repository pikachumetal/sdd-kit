---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `ee029c5`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`. El motivo tiene que estar en la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`). Sin `--motivo`, o con uno fuera de la lista, responde `motivo no válido: cambio de planes, sala ocupada, otro`. Si el motivo vale, la reserva pasa a `cancelled` y guarda su motivo.
- **Listado de canceladas** (Task 2, `14043e7`): el comando `canceladas` lista las reservas canceladas como `<sala> <día> — <motivo>`.
- Pruebas en `test/cancel.test.js`, por la salida de `run('cancelar', …)` y `run('canceladas', [])`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. Native, dos tasks, como dice `plan.md`.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` en lugar de `node --test`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — es un workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Queda en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 tests, 5 pasan, 0 fallan, 0.9 s (salida completa guardada en el scratchpad de la sesión).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 2 s · configuración: la del gate del plan, con `--test-concurrency=1` por el ruling de la Task 2 · sobre el commit de cierre (el cierre solo suma documentación sobre el código de `14043e7`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real, sobre el código de `14043e7` · revisión final Spec y Código, limpia, sobre `14043e7` (el commit posterior solo suma `tasks.md`, sin re-revisión). No probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real, `cancelar Norte lun` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar la de Norte del lunes | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`; el almacén es en memoria y `node src/app.js canceladas` suelto arranca vacío) | `Norte lun — sala ocupada` |

Verificado por el agente; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie por el ruling de la Task 2 → fila en «Deuda técnica» del roadmap.
- La fila 0014 («Motivo guardado») pide guardar el motivo en el almacén de reservas; esta feature ya lo guarda en la reserva en memoria. La fila queda como está: decide el dev-lead si se solapa.

## 5. Aprendizajes

- El almacén de reservas es un array de módulo compartido entre tests: todo test que cancele una reserva cambia el estado que ve el siguiente → fila de deuda en el roadmap («Deuda técnica»). No cambia ninguna convención, la arquitectura ni el stack.
- Sin cambio de comportamiento que no esté ya en el delta de la spec → `capabilities/bookings.md`, con `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
