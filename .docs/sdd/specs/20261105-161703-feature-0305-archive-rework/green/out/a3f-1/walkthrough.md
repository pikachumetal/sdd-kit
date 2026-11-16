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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit c96d529.
- `src/app.js`: el comando `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>». Commit f530a1a.
- `test/cancel.test.js`: tests de los dos comportamientos (motivo de la lista, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con el delta de la spec fusionado con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1`: 6/6 en verde.
- Gate: `node --test --test-concurrency=1` → suite: corrió 6/6 · sobre el commit de cierre
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre f530a1a. Lo único posterior es `tasks.md` (17 líneas, solo documentación), revisado en el hilo; no hubo re-revisión.
- Rojo ajeno a la rama en la primera pasada: `test/ids.test.js` falló una vez con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` porque su fichero `ids-store` del `git-common-dir` aún no existía. Con el fichero creado, el test solo y la suite entera pasan en la rama (6/6) y en `develop` (5/5). No se repite; fila abierta en la deuda técnica.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 6/6 · smoke 4/4 THEN con ejecución real (el listado, solo dentro del mismo proceso) · revisión final Spec y Código limpias sobre f530a1a

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`), verificado por el agente | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, verificado por el agente (con `--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real, verificado por el agente | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso que el `cancelar` (import de `run`), verificado por el agente; `suite` en `test/cancel.test.js` | `Norte lun — sala ocupada` |

- No probado: `canceladas` en una invocación de la CLI distinta a la del `cancelar`. Sale vacío porque las reservas viven en memoria y cada proceso parte de cero. La spec no pide persistencia; la cubre la fila 0014 del roadmap.

### 4.3 Residuales / deuda generada

- `canceladas` no ve lo cancelado en otro proceso → fila 0014 del roadmap, ya existente («Motivo guardado»).
- `test/ids.test.js` depende de un fichero en el `git-common-dir` y falla la primera vez en un clon nuevo → fila en «Deuda técnica» del roadmap.
- Los tests comparten el almacén en memoria y el gate necesita `--test-concurrency=1` → fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- Cambio de comportamiento observable: cancelar con motivo y listado de canceladas → `capabilities/bookings.md`.
- Los tests comparten el almacén en memoria del módulo y hay que correrlos de uno en uno → deuda técnica del roadmap (aislar el almacén por test).
- Un test que escribe en el `git-common-dir` no es repetible en un clon nuevo → deuda técnica del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
