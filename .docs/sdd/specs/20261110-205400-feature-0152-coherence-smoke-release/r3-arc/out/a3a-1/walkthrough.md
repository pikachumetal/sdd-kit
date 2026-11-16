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

- `src/app.js`, `test/cancel.test.js` — Task 1, `337621c`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o la ausencia de `--motivo` responden «motivo no válido: cambio de planes, sala ocupada, otro».
- `src/app.js`, `test/cancel.test.js` — Task 2, `f90ee39`: comando `canceladas`, que lista las reservas canceladas como «Norte lun — sala ocupada».
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, con los dos requisitos del delta, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. Una errata de registro: `tasks.md` daba `f90ee39` como commit de la Task 1 y es `337621c`; corregida en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (fila en `debt.md`).
- Cierre: el commit que añadió `tasks.md` (17 líneas, solo documentación) cae después del último sha revisado (`f90ee39`); no abre re-revisión: `revisado en el hilo: tasks.md · 17 líneas`.
- Cierre: el `EBUSY` de la primera pasada de la suite lo traté como inestable y seguí (contraste abajo); está en `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el árbol de la rama antes del cierre: la primera pasada salió en rojo (6/7, `el almacén guarda una reserva`, `EBUSY`); la segunda, sin tocar nada, en verde (7/7).
- Contraste del rojo: `node --test test/store.test.js` solo, a la vez en la rama y en un worktree desacoplado de `develop` (`da98ef4`): verde y verde. El error es un recurso bloqueado, así que no se repite; fila de tests inestables en `debt.md`.
- Gate: `node --test --test-concurrency=1` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 6/6 · rooms:test: corrió 1/1 · menos de 1 s · configuración: la del gate, más `--test-concurrency=1` en la suite entera · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 7/7 (tras un rojo que no se repite) · gate 7/7 · smoke del CLI 3/4 THEN con ejecución real y 1 solo en el mismo proceso (ver la fila de `canceladas`) · revisión final Spec y Código limpias sobre `f90ee39`, sin re-revisión (solo un commit de documentación de 17 líneas, revisado en el hilo)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real: `--motivo "me aburro"` | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real: `node src/app.js cancelar Norte lun` | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real solo en el mismo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`): «Norte lun — sala ocupada». Por el CLI, en otro proceso tras cancelar: salida vacía | el estado vive en memoria y no pasa de un proceso a otro; el THEN de `canceladas` no se puede ver con dos invocaciones del CLI |

Cobertura de la suite: los THEN de motivo válido, motivo fuera de la lista y `canceladas` tienen test en `test/cancel.test.js`; el de sin `--motivo` no tiene test, solo la ejecución real de arriba.

### 4.3 Residuales / deuda generada

- El CLI no conserva el estado entre procesos, así que `canceladas` solo es útil si el almacén persiste; lo cubriría 0014 «Motivo guardado». Fila en `debt.md`.
- Test `cancelar sin reserva lo dice` quitado en la Task 1; `cancelBooking` conserva la rama «sin reserva» sin test. Fila en `debt.md`.
- Sin test para «sin `--motivo`»: solo ejecución real.
- Test inestable `el almacén guarda una reserva` y workaround `--test-concurrency=1`: filas en `debt.md`.

## 5. Aprendizajes

- Un THEN de una CLI con estado previo (GIVEN) pide que el estado sobreviva entre invocaciones; con un almacén en memoria solo se prueba dentro de un proceso → `steering/debt.md` (fila) y 0014 en el roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
