---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde `motivo no válido: …` y no cancela. `src/app.js`, `test/cancel.test.js` — 53a68c3.
- `canceladas` lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`). `src/app.js`, `test/cancel.test.js` — 42ae064.
- Capacidad nueva `bookings` fusionada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

- Review de spec: no (dos señales: MODIFIED, datos; decidido en la spec)

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas también pasa 5/5; el workaround queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 verdes · 0,19 s · sha 8464893 (también `node --test` sin concurrencia: 5/5, 0,14 s).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · verificación del agente: suite 5/5 · smoke de los 4 THEN con ejecución real (3 por la CLI, el listado en un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 42ae064; Arquitectura no, por el plan. El dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite (`me aburro`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` + `run('canceladas')`) y suite; **no probado** como dos invocaciones de la CLI: el almacén está en memoria y `node src/app.js canceladas` en un proceso nuevo responde vacío | ok con la salvedad |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria: `canceladas` desde la CLI solo ve lo cancelado en el mismo proceso. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Workaround `--test-concurrency=1` del gate: fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- La lista de motivos y los mensajes de `cancelar`/`canceladas` → `capabilities/bookings.md` (creada en este cierre, no existía).
- Sin aprendizajes de convención, estructura o herramientas: no hay `architecture.md` ni cambios en `tech-stack.md` que hacer. Revisión de skills: no aplica, `.claude/skills/` no existe y no apareció ningún patrón reutilizable.

## 6. Adendas

- _Ninguna_
