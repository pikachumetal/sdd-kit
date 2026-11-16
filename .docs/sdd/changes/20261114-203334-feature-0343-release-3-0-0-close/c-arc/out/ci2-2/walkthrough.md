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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`) — commit e3e5196: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`) — commit 05d87a8: el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- **Capacidad nueva** `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test`: 5 tests, 5 pasan, 0 fallan (224 ms).
- Gate: `node --test` → suite entera: corrió 5/5 · 224 ms · configuración: la del gate de cierre de la constitución · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-11-15 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI y `run` en un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 05d87a8; HEAD solo movió documentación (`tasks.md`), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso, tras cancelar: `Norte lun — sala ocupada` |

Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

Nota: `canceladas` lanzado en un proceso aparte del `cancelar` no enseña nada, porque las reservas viven en la memoria del proceso hasta la 0014 (lo dice el Approach de la spec).

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` usa la cancelación del test anterior → «Por triar» de `debt.md`.
- Las reservas siguen en memoria del proceso: lo cubre la 0014 del roadmap.

## 5. Aprendizajes

- `bookings` es una capacidad nueva con el comportamiento de cancelar y de `canceladas` → `.docs/sdd/capabilities/bookings.md`
- Sin cambios estructurales ni de convención: `architecture.md`, `constitution.md` y `operations.md` no cambian.

Retro: sin señales

## 6. Adendas

- (ninguna)
