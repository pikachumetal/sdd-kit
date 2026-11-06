---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, d5d03f7): `cancelar <sala> <día> --motivo <motivo>` acepta solo los de la lista cerrada (cambio de planes, sala ocupada, otro); uno fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». El motivo se guarda con la reserva cancelada.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, de7eade): `canceladas` lista las reservas con estado cancelada como «<sala> <día> — <motivo>».
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), con los dos requisitos de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` (el gate del plan con el ruling de la Task 2): primera pasada 6/7, roja en `test/store.test.js` («el almacén guarda una reserva») con `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`; contrastada a mano (ver 4.3), pasa sola en la rama y en `develop`; segunda pasada completa 7/7, exit 0.
- Gate: `node --test --test-concurrency=1` · `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 6/6 · rooms:test: saltada (sus inputs, `src/rooms.js` y `test/rooms.test.js`, no cambian en la rama) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 7/7 (tras el rojo inestable de `store.test.js`, 4.3) · gate filtrado bookings:test 6/6 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre de7eade; el commit posterior (el de `tasks.md`, 17 líneas de documentación) revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', …)` importando `src/app.js`) | `Norte lun — sala ocupada` |

Nota del smoke: el almacén es memoria del proceso, así que dos invocaciones sueltas de la CLI (`cancelar …` y luego `canceladas`) no comparten estado y la segunda responde vacío. El THEN se verificó en un mismo proceso; que el motivo sobreviva entre invocaciones es la 0014 («Motivo guardado»).

### 4.3 Residuales / deuda generada

- Test inestable: `test/store.test.js` («el almacén guarda una reserva») falló una vez con `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`. Contraste por el protocolo de la suite roja: el fichero solo, en la rama y en un worktree desanclado de `develop`, a la vez y sin limpiar estado, dio verde en los dos (1/1). Es un recurso de máquina (fichero bloqueado) y no lo trae la rama: fila en «Deuda técnica» del roadmap.
- El workaround `--test-concurrency=1` sigue vigente hasta aislar el almacén por test: fila de deuda.

## 5. Aprendizajes

- Con el almacén en memoria, `canceladas` solo muestra lo cancelado en el mismo proceso → la 0014 («Motivo guardado») del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
