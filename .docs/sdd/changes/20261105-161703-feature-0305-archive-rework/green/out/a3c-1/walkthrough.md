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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit 930a13a): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit e3708c7): el comando `canceladas` lista cada reserva cancelada como «<sala> <día> — <motivo>».
- **Capacidad `bookings`** (`.docs/sdd/capabilities/bookings.md`): mezclados los dos requisitos ADDED de la spec con `sdd capability merge`.
- La spec decía «Nuevas: `bookings`» y la capacidad ya existía: corregido a «Modificadas» antes del cierre.

## 3. Desviaciones del plan

- _Ninguna_ respecto a `plan.md`: dos tasks, Native, tal como estaba escrito.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — para esquivar la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. En el cierre, `node --test` a secas también pasa 5/5; el workaround está en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pasan; `node --test` (el gate del plan) → 5/5 pasan. Ambos sobre 7486f0a, el árbol que se fusiona salvo los ficheros de documentación del cierre.
- Gate: `node --test` → 5 tests, 0 fallos · sobre el commit de cierre (solo se le añaden ficheros `.docs/`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre e3708c7; los dos commits posteriores solo tocan `.docs/` (<20 líneas), revisados en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| AND motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| AND sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` con Norte lun cancelada por «sala ocupada» → «Norte lun — sala ocupada» | ejecución real, un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) + suite | ok |

### 4.3 Residuales / deuda generada

- Por la CLI, `canceladas` en un proceso nuevo no enseña nada: el almacén es en memoria y no sobrevive entre invocaciones (la spec lo decía así: «Dónde viven los datos: en memoria»). Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- Workaround `--test-concurrency=1` → fila nueva en la deuda técnica del roadmap.

## 5. Aprendizajes

- Un cambio de comportamiento observable (motivo al cancelar, listado) → `capabilities/bookings.md`, mezclado con `sdd capability merge`.
- Los tests comparten el almacén en memoria y dependen del orden de ejecución → deuda técnica del roadmap («Aislar el almacén por test»).

Retro: sin señales

## 6. Adendas

- _Ninguna._
