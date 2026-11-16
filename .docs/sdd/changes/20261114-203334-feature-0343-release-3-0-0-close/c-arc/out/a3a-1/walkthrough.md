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

- **Cancelar con motivo** (Task 1, `1789089`): `src/app.js` y `test/cancel.test.js`. `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), guarda `status: cancelled` y `reason` en la reserva y responde «cancelada Norte lun (sala ocupada)». Sin motivo o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (Task 2, `1d7daca`): `src/app.js` y `test/cancel.test.js`. `canceladas` lista las reservas con estado `cancelled` como «Norte lun — sala ocupada».
- Las reservas siguen en la memoria del proceso hasta la 0014: `canceladas` enseña solo lo cancelado en el mismo proceso.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → exit 0, `bookings:test (6 passed, 0 failed)`.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 6/6 · rooms:test: saltada (la rama no toca sus inputs) · 1 s · configuración: la del gate (`gate.json`) · sobre el commit de cierre
- Una primera pasada salió en rojo en `test/store.test.js` («el almacén guarda una reserva») con `EBUSY: resource busy or locked, open 'data/bookings.json'`, un test que ya estaba en `develop` y que esta feature no toca. Contrastado: el fichero solo, a la vez en la rama y en un worktree desacoplado de `develop`, sale verde en los dos; no se repite y el error es un fichero bloqueado. Fila en «Por triar» de `debt.md` y segunda pasada del gate verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · gate 6/6 sobre el árbol de la rama (`rooms:test` saltada) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre `1d7daca`; `HEAD` solo añade `tasks.md`, sin re-revisión. No probado: nada. El usuario no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso, tras cancelar Norte lun: «Norte lun — sala ocupada» (en procesos separados saldría vacío: es el límite de la memoria del proceso hasta la 0014) |

### 4.3 Residuales / deuda generada

- Test `store.test.js` que falla la primera vez que corre en un clon (EBUSY) y pasa después → «Por triar» de `debt.md`.
- Test de `canceladas` que depende del orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria dentro de `src/app.js` hasta la 0014 → `steering/architecture.md`.
- El test de `canceladas` depende del primer test, y `store.test.js` falla la primera vez en un clon → sin destino de convención; van a la deuda (§4.3).

Retro: sin señales

## 6. Adendas

- _Ninguna_
