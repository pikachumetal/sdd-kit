---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit 8f39b01.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo». Commit 0c90ffb.
- `test/cancel.test.js`: pruebas de ambos comandos.
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ sobre el plan (dos tasks, Native).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Desmentido en el cierre:** `gate.json` nunca lo llevó y el rojo era un `EBUSY` del fichero de bloqueo de `test/store.test.js`; la causa va a la deuda.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 6/6 · rooms:test: saltada (sus inputs no cambian) · 1 s · configuración: la del gate de la constitución · sobre el commit de cierre.
- Suite completa sin filtro: bookings:test 6/6, rooms:test 1/1 (7/7), verde en la segunda pasada. La primera pasada dio rojo en `test/store.test.js` por `EBUSY`; contrastado solo, en la rama y en un worktree desprendido de `develop`, verde en las dos (No se repite).
- Revisión final: Spec (opus) y Código (sonnet) limpias sobre 0c90ffb; Arquitectura no (plan). Lo posterior, `a136e17`, es el registro de esa revisión en `tasks.md` (17 líneas, solo documentación): revisado en el hilo, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 7/7 · smoke 3/3 THEN con ejecución real (incluidos los dos de fallo, con la entrada que falla) · revisión final Spec y Código limpias sobre 0c90ffb, `a136e17` revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo «me aburro» → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → la misma respuesta | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (un solo proceso: el almacén vive en memoria) | ok |

### 4.3 Residuales / deuda generada

- Test inestable `test/store.test.js` («el almacén guarda una reserva», `EBUSY`): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El almacén de reservas vive en memoria: cada ejecución de la CLI parte con la reserva de Norte del lunes y `canceladas` solo enseña algo dentro del mismo proceso → ya lo cubre la capacidad `bookings` y la feature 0014 («Motivo guardado») del roadmap; sin destino nuevo.
- Un ruling sin comprobar contra el gate real acaba en el registro como hecho → `debt.md` (fila del test inestable) y corrección en `tasks.md`.

Retro: documento o skill desmentido → corregido el ruling de la Task 2 (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
