---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 6ac19a6): el motivo ha de ser uno de la lista cerrada (cambio de planes, sala ocupada, otro); la reserva pasa a `cancelled` y guarda su `reason`. Un motivo fuera de la lista, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, c9b2957): lista «<sala> <día> — <motivo>» de las reservas canceladas.
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).
- ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-in-booking.md

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test`: 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test` → node:test: corrió 5/5 · 0,07 s · configuración: la del gate de la constitución · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c9b2957; los commits posteriores solo tocan `.docs/`, sin re-revisión.

Verificado por el agente (ninguna fila reportada por el usuario):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "porque sí"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» (en el mismo proceso: las reservas viven en memoria hasta la 0014) |

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen del orden: reutilizan la cancelación del primer test (ruling de la Task 2). Pasa a «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta que la 0014 guarde el motivo en el almacén de reservas (ya en el roadmap).

## 5. Aprendizajes

- El motivo vive en la propia reserva, sin tabla aparte → `decisions/0003-cancel-reason-in-booking.md`.
- El comportamiento observable (motivo obligatorio y listado de canceladas) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
