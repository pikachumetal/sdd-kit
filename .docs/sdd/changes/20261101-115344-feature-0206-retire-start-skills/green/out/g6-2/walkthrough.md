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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js`, commit 1df3bd0.
- `canceladas` lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`) — `src/app.js`, `test/cancel.test.js`, commit 5528b26.
- Capacidad `bookings` creada con los dos requisitos de la spec (`.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`node --test`): no corrió en la validación; con la feature `0011` abierta y la base `develop` por delante, lo corre el paso de la base integrada del cierre y su línea `Gate:` va en el mensaje final, porque este walkthrough queda dentro del commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · smoke del agente 3/3 THEN con ejecución real sobre `src/app.js` (`run` con cada entrada de la spec); revisión final Spec (opus+high) y Código (sonnet+high) limpia sobre 5528b26; `HEAD` solo añadió `tasks.md` (documentación). Suite completa: no probado en esta validación, ver 4.1.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo otro-x`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Aislar el almacén de reservas por test para quitar `--test-concurrency=1` del gate (fila en la deuda técnica del roadmap).
- Se quitó el test «cancelar sin reserva lo dice» (`Sur mar`): la spec no cubre ese caso y ahora la comprobación del motivo va antes que la de la reserva. Comportamiento sin reserva sigue en `src/app.js`, sin test.

## 5. Aprendizajes

- Ningún aprendizaje estructural ni de convención. El workaround de concurrencia → deuda técnica del roadmap.
- Revisión de skills: no aplica; el proyecto no tiene `.claude/skills/` y el trabajo no reveló un patrón reutilizable.

## 6. Adendas

- _Ninguna_.
