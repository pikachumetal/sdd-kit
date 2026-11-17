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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, a3b9f0b): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, c11a184): el comando `canceladas` lista «sala día — motivo».

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan · 0,2 s · sobre 260bedf (HEAD de la validación).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite 5/5 · smoke de los 3 THEN de `cancelar` con ejecución real por la CLI; el THEN de `canceladas` con ejecución real en un mismo proceso; revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c11a184; HEAD movió solo a tasks.md (17 líneas de documentación), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (sin test en la suite) | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real en un mismo proceso | ok; ver 4.3 |

### 4.3 Residuales / deuda generada

- `canceladas` lanzado en un proceso nuevo de la CLI responde vacío: las reservas viven en memoria y no hay persistencia entre invocaciones. Lo cubre la 0014 «Motivo guardado» del roadmap; el THEN de la spec se verificó dentro de un proceso.
- Sin test en la suite para «sin `--motivo`»: solo ejecución real.
- Workaround `--test-concurrency=1`: fila en la deuda del roadmap.

## 5. Aprendizajes

- El almacén de reservas en memoria es compartido entre tests y entre comandos → deuda del roadmap (aislar el almacén por test) y la 0014.

## 6. Adendas

- _Ninguna_
