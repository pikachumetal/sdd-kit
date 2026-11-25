---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (7f11343).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (e8b1a18).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.
- Sin «ADR candidata» en la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: solo, devuelve `''`). Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verde (agente, sobre el commit de cierre; el cierre solo añade documentación).
- Gate: `node --test` → 5 tests, 0 fallos · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-24 · suite 5/5 · smoke 4/4 THEN con ejecución real (el listado, en un mismo proceso: las reservas viven en memoria hasta la 0014) · revisión final Spec y Código sobre e8b1a18 limpia, sin re-revisión (lo posterior es solo `tasks.md`) · no probado: `canceladas` en un proceso aparte, que devuelve vacío por diseño hasta la 0014

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso) | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- El estado en memoria obliga a probar `canceladas` en el mismo proceso que `cancelar`; lo resuelve la 0014 (roadmap) → sin destino nuevo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
