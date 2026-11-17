---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «sala día — motivo» (9c0e8d9).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado) (9c0e8d9).
- `capabilities/bookings.md`: fusionados con `sdd capability merge` los dos requisitos ADDED.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Al cierre la suite pasa también con el gate de la constitución (`node --test`), así que el workaround no está en ningún fichero del proyecto; queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 119 ms · sobre el árbol del cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · verificación del agente: suite 5/5 · smoke con ejecución real de los 4 THEN (salida de la CLI y de `run`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 9c0e8d9; los dos commits posteriores solo tocan documentación (spec.md, tasks.md). El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con «me aburro» + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar')` y luego `run('canceladas')`) + suite | ok en un proceso; vía CLI, un `node src/app.js canceladas` aparte sale vacío porque el almacén es en memoria (ver 4.3) |

### 4.3 Residuales / deuda generada

- El motivo no sobrevive entre ejecuciones de la CLI: los datos viven en memoria (regla de `bookings`). Ya planificado en 0014 «Motivo guardado»; no se abre fila nueva.
- Workaround `--test-concurrency=1` por la carrera del almacén compartido en los tests: fila en la deuda del roadmap.
- Los tests de `cancel.test.js` dependen del orden (el listado usa la cancelación del primer test): mismo origen que la fila anterior.

## 5. Aprendizajes

- El almacén en memoria compartido entre tests obliga a ordenarlos o serializarlos → fila de deuda del roadmap (no es una convención ni un cambio estructural).
- Comportamiento observable nuevo → `capabilities/bookings.md` (fusionado).
- Skills: el proyecto no tiene `.claude/skills/`; ningún patrón reutilizable que lo justifique, no se crea ninguna.

## 6. Adendas

