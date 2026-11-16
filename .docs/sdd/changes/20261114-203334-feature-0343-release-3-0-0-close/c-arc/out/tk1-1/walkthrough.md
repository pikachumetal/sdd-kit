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

- **Cancelar con motivo** (`6e93da0`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`bc4f8df`, `src/app.js`, `test/cancel.test.js`): el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` en el worktree: 5/5 en verde, sin fallos ni saltados.
- Gate: `node --test` → 5/5 · sin `operations.md` ni tarea de gate declarada · sobre el commit de cierre (el código es el de `bc4f8df`; después solo cambia documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre `bc4f8df`; `HEAD` solo añadió `tasks.md`, sin re-revisión. No probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` (la suite no lo cubre) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y listar en el mismo proceso → `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria del proceso: `canceladas` solo enseña lo cancelado en ese mismo proceso, desde la CLI siempre vacío. Lo cierra la 0014.
- Sin test para el THEN «sin `--motivo`»: pasa por el mismo camino que el motivo inválido; ejecutado a mano arriba.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014 → `steering/architecture.md`
- El comportamiento de `bookings` (motivo y listado) → `capabilities/bookings.md`, con `sdd capability merge`

Retro: sin señales

## 6. Adendas

- _Ninguna_
