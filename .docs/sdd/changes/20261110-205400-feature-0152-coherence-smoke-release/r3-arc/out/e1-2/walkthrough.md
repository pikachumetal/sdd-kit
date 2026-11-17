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

- **Cancelar con motivo** (Task 1, `716c607`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`) y guarda motivo y estado `cancelled` en la reserva (`src/app.js`, `test/cancel.test.js`).
- **Listado de canceladas** (Task 2, `7847b6e`): el comando `canceladas` lista las reservas con estado cancelada como `<sala> <día> — <motivo>` (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`).
- Capacidad `bookings` creada con el delta de la spec (ver §5).

## 3. Desviaciones del plan

- _Ninguna_ en alcance ni en ficheros.

### Decisiones tomadas sin el dev-lead

- Task 2: ejecutar los tests con `node --test --test-concurrency=1` para esquivar una carrera sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate corrió tal como lo declara `operations.md` y la carrera no se reprodujo; el workaround no está en el gate ni en `operations.md`, y tiene su fila en `debt.md` (Lista).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 pasan (0,3 s). `node e2e/run.mjs` → 7/7 pasan (48 s, `trace: on`, `retries: 0`).
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48 s · configuración: la del gate · sobre el commit de cierre (el cierre junta el commit sobre el que corrió; entre uno y otro solo cambia `.docs/`)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:64993/health` → `entorno arriba` y `ok`, levantado en esta sesión; parado al acabar con `node scripts/env-down.mjs`.
- E2E: 48 s de 0,5 min (Presupuesto E2E) — fuera de presupuesto, apuntado en 4.3.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite unitaria 5/5 y E2E 7/7 sobre el gate declarado · smoke 4/4 THEN con ejecución real contra el servidor levantado en la sesión, sesión propia por llamada · revisión final Spec y Código sobre 7847b6e, limpia; re-revisión del commit posterior a 7847b6e (solo `tasks.md`): 1 Important y 1 Minor, arreglados en el cierre · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

Son los cuatro THEN de la spec (tres de «Cancelar pide un motivo de la lista», uno del listado); los provoqué yo, con el input que falla en los dos de rechazo. Smoke: 4/4, no 5/5.

### 4.3 Residuales / deuda generada

- Suite E2E fuera de presupuesto: 48 s de 0,5 min — deuda del proyecto (`debt.md`, Por triar). La traza completa pone 6 s por paso.
- Carrera entre tests por el almacén compartido en memoria — deuda del proyecto (`debt.md`, Lista), con el workaround del ruling de la Task 2.
- Sin validación del formato de franja horaria: ya estaba en la deuda, no es de esta feature.

## 5. Aprendizajes

- El almacén de reservas en memoria es compartido por los tests: hay una carrera si corren en paralelo → `steering/debt.md` (Lista), con su remedio temporal; no entra en `operations.md` porque el gate no lo usa.
- El cambio de comportamiento (`cancelar` con motivo y `canceladas`) → `capabilities/bookings.md`, con `sdd capability merge`.

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` citaba para la Task 1 el commit de la Task 2 (`7847b6e` en vez de `716c607`) y nada compara la columna «Commit» con `git log` antes del cierre; lo cazó la re-revisión

## 6. Adendas

- _Ninguna_
