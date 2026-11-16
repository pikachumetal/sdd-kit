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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo se valida contra la lista cerrada (cambio de planes, sala ocupada, otro) y se guarda con la reserva cancelada. Sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (f0c533c).
- `canceladas`: lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` (ac454f1).
- Capacidad nueva `bookings`, fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el registro: el cierre retiró el ruling de `tasks.md` que cambiaba el gate a `--test-concurrency=1` (ver abajo) y corrigió el commit citado para la Task 1.

### Decisiones tomadas sin el dev-lead

- Retirar el ruling `--test-concurrency=1` de la Task 2 — la re-revisión mostró que la causa estaba mal (cada fichero de test corre en su propio proceso) y `node --test` da verde 3 de 3 pasadas; el gate sigue siendo el de la constitución — coste si está mal: ninguno, el gate por defecto pasa.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5, en verde (pasada del cierre); `node --test` → 5/5 en verde, 3 pasadas.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre ac454f1, limpia; re-revisión del commit de registro posterior con 2 hallazgos de registro (`tasks.md`), corregidos en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar pide un motivo de la lista: `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| El listado de canceladas enseña el motivo: `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso (`cancelar` y luego `canceladas` vía `run`): `Norte lun — sala ocupada`. Por la CLI en dos invocaciones sale vacío: el almacén es en memoria (lo cubre la fila 0014) |

### 4.3 Residuales / deuda generada

- Test dependiente del orden: «canceladas enseña sala, día y motivo» solo pasa si antes corrió «cancelar con un motivo de la lista»; solo, falla. Fila en «Por triar» de `debt.md`.
- Las cancelaciones no persisten entre invocaciones de la CLI: ya es la fila 0014 del roadmap.

## 5. Aprendizajes

- La causa de un test que falla en aislamiento es el orden entre tests del mismo fichero, no la concurrencia entre ficheros: `node --test` corre cada fichero en su proceso → deuda («Por triar»).

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de `tasks.md` (carrera entre ficheros) lo desmintió la re-revisión y tres pasadas verdes de `node --test` (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)
Retro: error que cazaría un chequeo → un chequeo que corra cada test aislado, apuntado en la deuda hasta que se haga (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna_
