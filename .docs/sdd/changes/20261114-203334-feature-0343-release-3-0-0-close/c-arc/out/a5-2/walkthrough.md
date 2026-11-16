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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)» — `src/app.js`, `test/cancel.test.js` (6549ab1).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (69e97e0).
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, 0 fallan (verificado por mí, sobre 2c33835; el cierre solo añade documentación). El proyecto no declara «Suites» ni gate: no hay más que correr.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 69e97e0 (los commits posteriores solo tocan documentación) · sin validación del dev-lead: nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real y suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (cancelar y canceladas en el mismo proceso: las reservas viven en memoria hasta la 0014) y suite | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.
- Sin test para «cancelar sin `--motivo`» (verificado solo por ejecución real).

## 5. Aprendizajes

- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya recogido en el Approach de la spec; el motivo persistente es la 0014.

Retro: sin señales

## 6. Adendas

- (ninguna)
