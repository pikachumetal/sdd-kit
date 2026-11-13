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

- **Cancelar con motivo** (`8ae2ccb`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`8ae2ccb`, mismos ficheros): el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- **Capacidad** `bookings` creada desde el delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en código. El plan preveía dos tasks y salieron en un solo commit (`8ae2ccb`); `tasks.md` lo refleja.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ojo: la bandera no está en `gate.json` (los comandos de `bookings:test` y `rooms:test` no la llevan), así que el gate del cierre corre como está declarado.

## 4. Verificación

### 4.1 Builds

- Gate: corre una sola vez en la fusión de sincronización del paso 6 del cierre, porque hay otra rama abierta (`feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final, porque este fichero ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real (importando `run` de `src/app.js` y por la CLI `node src/app.js cancelar …`) · revisión final Spec opus+high limpia y Código sonnet+high limpia, sobre `8ae2ccb`; Arquitectura no (plan) · `5abe6b2` solo añade el registro de `tasks.md` (17 líneas, documentación), revisado en el hilo · suite en el paso 6.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (tras cancelar en el mismo proceso) |

No probado: nada. Nota de alcance: el almacén es en memoria, así que `canceladas` en un proceso aparte de la CLI no ve lo cancelado en otro; la spec no pide persistencia (la cubre la 0014 «Motivo guardado»).

### 4.3 Residuales / deuda generada

- La carrera de los tests sobre el almacén compartido en memoria pasa a deuda («Por triar» de `debt.md`).

## 5. Aprendizajes

- Los tests de `src/app.js` comparten el almacén en memoria y se pisan si corren en paralelo → deuda en `debt.md` («Por triar»); no es una convención ni un cambio estructural.
- El comportamiento nuevo (motivo y listado) → `capabilities/bookings.md`, fusionado con `sdd capability merge`.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de `tasks.md` decía que el gate llevaba `--test-concurrency=1` y `gate.json` no lo lleva (`tasks.md`)

## 6. Adendas

- _Ninguna._
