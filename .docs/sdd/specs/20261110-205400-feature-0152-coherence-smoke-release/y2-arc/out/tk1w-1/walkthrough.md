---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1 (`5b54207`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; el motivo debe estar en la lista cerrada (cambio de planes, sala ocupada, otro), y sin `--motivo` o con otro valor responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- Task 2 (`4ea9074`): comando `canceladas`, que lista «sala día — motivo» de las reservas con estado cancelada.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El plan no cubría que el estado de las reservas es solo del proceso: ver 4.2 y 4.3.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre (el código es el de `4ea9074`; después solo cambió documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3 de 4 THEN con ejecución real por la CLI y el cuarto solo dentro de un proceso (no desde la CLI) · revisión final Spec y Código limpias sobre `4ea9074`, sin re-revisión (después solo cambió documentación). Lo que el dev-lead haya probado no consta.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real solo en un mismo proceso (`run('cancelar')` y `run('canceladas')` seguidos); por la CLI en un proceso aparte: **no cumple**, sale vacío | proceso nuevo: salida vacía · mismo proceso: `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El listado de canceladas no se ve desde la CLI: cada invocación es un proceso nuevo y las reservas viven en memoria, así que `canceladas` sale vacío. Lo cubre la 0014 («Motivo guardado»); fila en «Por triar» de `debt.md`.
- Los tests de `cancel.test.js` dependen del orden (workaround del ruling de la Task 2): fila en «Por triar».

## 5. Aprendizajes

- Las reservas viven en memoria del proceso y no persisten entre invocaciones de la CLI → `steering/architecture.md`.

Retro: error que cazaría un chequeo → un test que lanza la CLI en procesos aparte (`cancelar` y luego `canceladas`), a añadir con la 0014, que es la que lo pone en verde (`.docs/sdd/steering/debt.md`)
