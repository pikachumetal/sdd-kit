---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Task 1, `bbd3547`.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas. Task 2, `2cf52bd`.
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.
- ADR: ninguna candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a «Por triar» en `debt.md`.

## 4. Verificación

### 4.1 Builds

- Cierre, sobre el árbol de la rama (el commit de cierre): `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → exit 0; `bookings:test` 6 pasados, 0 fallidos.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 1/1 · rooms:test: saltada (no toca sus inputs) · menos de 1 s · configuración: la del gate · sobre el commit de cierre
- `node --test test/` completa: 7/7 en verde, pero a la primera pasada falló `test/store.test.js` («el almacén guarda una reserva», `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`). Contrastado: el fichero solo pasa en la rama y en un worktree desechable de `develop` (`2fbb8f9`) a la vez; el error es un recurso de la máquina. «No se repite»: fila en «Por triar» de `debt.md`. El test no es de esta feature (viene de `2fbb8f9`, ya en `develop`).

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

Verificado por el agente en el cierre, con ejecución real:

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) · suite | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) · suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | «motivo no válido: cambio de planes, sala ocupada, otro»; sin test propio en la suite |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real, en el mismo proceso (`run('cancelar', …)` y `run('canceladas', [])`) · suite | «Norte lun — sala ocupada» |

Reportado por el dev-lead: lo de la línea de validación de arriba; no detalló más.

### 4.3 Residuales / deuda generada

- `test/store.test.js` falla la primera vez que corre (`EBUSY`, no se repite): deuda en «Por triar».
- El test de `canceladas` depende del estado que deja el primer test: deuda en «Por triar».
- Sin test propio para `cancelar` sin `--motivo`: lo cubre el THEN verificado a mano, no la suite.
- Las reservas siguen en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (`node src/app.js canceladas` en un proceso aparte sale vacío).

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso (`src/app.js`) hasta la 0014 → `steering/architecture.md`.
- El comportamiento observable (motivo, listado) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
