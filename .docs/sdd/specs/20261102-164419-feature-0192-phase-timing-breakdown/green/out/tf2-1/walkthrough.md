---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit 287ed1c): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista, o ninguno, responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit c8b6900): el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- **Capacidad** `bookings` creada desde el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. `tasks.md` daba el mismo commit a las dos tasks; la Task 1 es 287ed1c y se ha corregido.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` en vez de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — si es erróneo, la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 tests, 5 pass, 0 fail.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,2 s · configuración: la del gate con `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · verificación del agente: suite 5/5 · smoke con ejecución real: 3 THEN por la CLI y 1 solo en un proceso (el cuarto por la CLI, `no probado` abajo) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c8b6900; Arquitectura no (plan).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | responde exactamente eso |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `--motivo "me aburro"`) | responde exactamente eso |
| Sin `--motivo` responde lo mismo | ejecución real (CLI) | responde exactamente eso |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real en un mismo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y suite | responde eso; **por la CLI en un proceso aparte, `node src/app.js canceladas` no imprime nada**: el almacén es en memoria y no sobrevive entre invocaciones. Por la CLI: `no probado` como cumplido, no se cumple |

### 4.3 Residuales / deuda generada

- Las cancelaciones no persisten entre invocaciones de la CLI, así que `canceladas` solo enseña algo dentro del mismo proceso. Ya lo recoge la fila 0014 «Motivo guardado» del roadmap; hasta entonces el THEN del listado no se cumple de punta a punta por la CLI.
- Workaround `--test-concurrency=1` del gate: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El almacén de reservas vive en memoria, por proceso: lo que una invocación de la CLI guarda no lo ve la siguiente, y los tests comparten estado entre sí → `tech-stack.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
