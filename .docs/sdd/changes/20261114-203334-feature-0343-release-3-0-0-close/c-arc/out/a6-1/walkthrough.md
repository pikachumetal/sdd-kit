---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva — `src/app.js`, `test/cancel.test.js` (1ea82f4).
- Comando `canceladas`: lista «sala día — motivo» de las reservas con estado cancelada — `src/app.js`, `test/cancel.test.js` (fc52af0).
- Capacidad nueva `capabilities/bookings.md`, mergeada con `sdd capability merge`; ADR 0003.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero, sobre el commit de cierre (sin cambios de código desde fc52af0): 5/5 pasan, 0 fallos.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre. Sin «Suites» ni gate de tareas en el proyecto (no hay `operations.md`).
- Nota: `npm test` no existe (`package.json` sin script `test`); el gate de la constitución es `node --test`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real (el listado, en proceso único porque las reservas viven en memoria) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre fc52af0; la revisión de Arquitectura no se hizo (el plan no la pedía); los commits posteriores solo tocan documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso tras cancelar) | ok |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` usa la cancelación del primer test → «Por triar» de `debt.md`.
- La spec numera sus «Decisiones que he tomado yo» como 1 y 3 (falta la 2): erratas de la spec, sin efecto.

## 5. Aprendizajes

- El motivo vive en la propia reserva mientras las reservas estén en memoria → ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md
- Comportamiento observable nuevo → `capabilities/bookings.md`.
- La ADR 0002 no tenía «### Confirmación» y `decision check` la rechazaba: añadida (`node --test` como gate).

ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md

Retro: sin señales

## 6. Adendas

- _Ninguna_
