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

- **Cancelar con motivo** (Task 1, `8f30fd9`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`. El motivo es de una lista cerrada (`cambio de planes`, `sala ocupada`, `otro`); fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`. El motivo se guarda en la reserva cancelada. Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `cdbfaf5`): comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas con estado cancelada. Test en `test/cancel.test.js`.

## 3. Desviaciones del plan

- _Ninguna_ en la spec ni en las tasks: dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate de la task corrió con `node --test --test-concurrency=1` — para esquivar la carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (En el cierre el gate del plan, `node --test`, también pasa; ver 4.1.)

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde (0 fallos); `node --test --test-concurrency=1` → 5/5 en verde. Ejecutados por el agente en el cierre.
- Gate: `node --test` → suite: corrió 5/5 · 0,12 s · configuración: la del gate (más la pasada con `--test-concurrency=1`) · sobre el commit de cierre
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high), limpias, sobre `cdbfaf5`; Arquitectura no (plan). Después de ella solo hay un commit de documentación (`tasks.md` con esa revisión, 17 líneas), revisado en el hilo.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 (`node --test`, y con `--test-concurrency=1`) · smoke de los 4 THEN con ejecución real (abajo) · revisión final Spec y Código limpias sobre `cdbfaf5`. Verificado por el agente; el dev-lead no ha probado nada a mano. **No probado:** `canceladas` por la CLI en una invocación aparte (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) y suite | OK |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) y suite | OK |
| Sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`); sin test en la suite | OK |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real, cancelar y listar en un mismo proceso (`run` de `src/app.js`) y suite; por la CLI, una invocación aparte da la salida vacía | OK en proceso; no probado por la CLI entre invocaciones |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria del proceso: `canceladas` lanzado solo por la CLI no ve nada de lo cancelado antes en otra invocación. Es lo que recoge la fila 0014 «Motivo guardado» del roadmap; no se toca aquí.
- No hay test del THEN «sin `--motivo`»: se comprobó a mano (4.2). El código lo cubre porque `reasonOf` da `undefined` y no está en la lista.
- El test `canceladas enseña sala, día y motivo` depende del estado que deja el test anterior del mismo fichero (almacén compartido): pasa a la deuda técnica del roadmap.

## 5. Aprendizajes

- La lista de motivos es cerrada y vive en `src/app.js` (`reasons`); un motivo nuevo es un cambio de comportamiento y entra por el delta de `bookings` → `capabilities/bookings.md`.
- ADR: ninguna candidata en la spec.

Retro: sin señales

## 6. Adendas

- (ninguna)
