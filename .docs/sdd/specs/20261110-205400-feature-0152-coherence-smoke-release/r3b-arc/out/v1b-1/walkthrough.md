---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit 5d14cce (Task 1, retocado en 4fcada7).
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas con estado cancelada. Commit 4fcada7 (Task 2).
- `test/cancel.test.js`: tests de ambos comandos. Commits 5d14cce y 4fcada7.
- Sin `estimation.md` en el proyecto: no hay bloque de tiempo y coste.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test (fila en la deuda, «Por triar») — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 tests, 5 pasan, 0 fallan, 167 ms, sobre el commit de cierre.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,4 s · configuración: la del ruling de la Task 2 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 4fcada7; el commit de `tasks.md` posterior solo añade `tasks.md` con esa revisión y los rulings (17 líneas de documentación), sin código nuevo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) y suite | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) y suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | verificado por el agente |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso, porque el almacén es en memoria) y suite | verificado por el agente |

Reportado por el usuario: nada; nadie ha probado a mano esta feature.

### 4.3 Residuales / deuda generada

- El almacén de reservas es global y en memoria: los tests comparten estado y obligan a `--test-concurrency=1`. Fila en «Por triar» de la deuda. La fila 0014 del roadmap («Motivo guardado») ya toca el almacén.
- `canceladas` solo muestra algo dentro del mismo proceso, por lo mismo: cada invocación de la CLI parte del almacén inicial.

## 5. Aprendizajes

- Cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md`, con `sdd capability merge`.
- El almacén en memoria compartido entre tests fuerza la ejecución serie → deuda «Por triar», sin copia en otro documento.

Retro: sin señales

## 6. Adendas

- _Ninguna_
