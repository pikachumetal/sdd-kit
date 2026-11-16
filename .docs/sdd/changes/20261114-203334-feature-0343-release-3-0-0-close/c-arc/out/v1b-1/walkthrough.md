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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, da73a59): `cancelar <sala> <día> --motivo <motivo>` acepta solo `cambio de planes`, `sala ocupada` y `otro`; un motivo fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, dc2b682): `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- Las reservas siguen en la memoria del proceso hasta la 0014: `canceladas` enseña lo cancelado en el mismo proceso, y lanzado como comando aparte sale vacío.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/steering/estimation.md`: no se mide.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes (3 de `cancel.test.js`, 2 de `app.test.js`), sobre el commit de cierre (el código es el de dc2b682; lo posterior solo toca `.docs/`).
- El proyecto no declara `operations.md` ni gate: no hay `Gate:`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre dc2b682; lo posterior es solo documentación, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | con `--motivo "me aburro"`: `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun`: `motivo no válido: cambio de planes, sala ocupada, otro` (los tests no lo cubren) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso tras cancelar: `Norte lun — sala ocupada` |

Verificado por el agente todo lo anterior; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de `debt.md`.
- `canceladas` como comando aparte sale vacío hasta que la 0014 guarde las reservas: ya está en el roadmap.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014 → `steering/architecture.md`
- El motivo es de una lista cerrada y `canceladas` enseña lo cancelado en el mismo proceso → `capabilities/bookings.md` (delta de la spec)

Retro: sin señales

## 6. Adendas

- _Ninguna_
