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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`cff014c`).
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas (`2dd2d7a`).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- Ruling de la Task 2 retirado en el cierre: `tasks.md` anotaba `--test-concurrency=1` en el gate contra una carrera entre tests, pero ese flag no se aplicó nunca (`gate.json` y el plan no lo llevan) y `node --test` aísla cada fichero en su proceso. Lo real es un acoplamiento por orden dentro de `test/cancel.test.js`; queda como deuda — coste si está mal: la fila de deuda describe un riesgo que no existe, y se borra al triar.

## 4. Verificación

### 4.1 Builds

- Suite: corre una sola vez en el merge de sincronización del paso 6 del cierre, porque la base (`develop`) llevaba un commit por delante (`1ae59c7`, tests de rooms). Su `Gate:` y su sha van en el mensaje final: el walkthrough ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · smoke 4/4 THEN con ejecución real, ejecutado por el agente; suite en el merge de sincronización (ver 4.1); revisión final Spec y Código limpias sobre `2dd2d7a`; re-revisión del tramo posterior (solo `tasks.md`, juntado en el cierre) con 1 Important y 1 Minor sobre `tasks.md`, corregidos en el cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | verificado por el agente |
| motivo fuera de la lista (`--motivo "me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` → la misma respuesta | ejecución real | verificado por el agente |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run` importado de `src/app.js`): por la CLI en procesos separados sale vacío, porque el almacén es en memoria | verificado por el agente |

### 4.3 Residuales / deuda generada

- Acoplamiento por orden en `test/cancel.test.js`: el test de `canceladas` depende de que el primero haya cancelado Norte lun → fila de deuda.
- Ningún test cubre `cancelar` sin `--motivo`; solo el smoke lo verifica → fila de deuda.
- El almacén es en memoria: lo cancelado no sobrevive entre invocaciones de la CLI (lo cubre la 0014, «Motivo guardado»).

## 5. Aprendizajes

- Capacidad `bookings` (cancelar con motivo, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
