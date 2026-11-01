---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, a829b83.
- `canceladas` lista las reservas canceladas como «sala día — motivo» — `src/app.js`, cba627a.
- Tests en `test/cancel.test.js` (commits a829b83 y cba627a).
- Capacidad `bookings` creada desde el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotada en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1`: 5/5 pasan, 0 fallos (salida guardada y leída entera).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre 3d82065 (el commit de cierre no cambia código).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 5/5 · smoke 3/3 THEN de `cancelar` con ejecución real por la CLI y el de `canceladas` con ejecución real solo dentro de un proceso · revisión final (Spec opus+high, Código sonnet+high) limpia sobre cba627a; 3d82065 solo añade `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) | ok |
| Motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con la entrada que falla | ok |
| Sin `--motivo` responde lo mismo | ejecución real, con la entrada que falla | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (cancelar y luego listar) | ok en proceso; **por la CLI en un proceso nuevo responde vacío**: el almacén es en memoria. No es un fallo de la spec (no pide persistir; lo cubre la 0014), pero el usuario no verá el listado entre ejecuciones |

### 4.3 Residuales / deuda generada

- `canceladas` no persiste entre procesos → deuda, la cubre la 0014.
- Workaround `--test-concurrency=1` → fila de deuda en el roadmap.

## 5. Aprendizajes

- El workaround de la concurrencia de tests no va a `tech-stack.md`: queda como fila de deuda → roadmap (Deuda técnica).
- Skills: no aplica; el proyecto no tiene `.claude/skills/` y el trabajo no reveló un patrón reutilizable.
- ADR: ninguna candidata en la spec.

## 6. Adendas

- (ninguna)
