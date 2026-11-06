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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, d574c23).
- `canceladas` lista las reservas canceladas como «Norte lun — sala ocupada» (`src/app.js`, `test/cancel.test.js`, c572e17).
- Capacidad nueva `bookings` fusionada en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda.

## 4. Verificación

### 4.1 Builds

- `node --test`: 5/5 · `node --test --test-concurrency=1`: 5/5.
- Gate: `node --test` → suite: corrió 5/5 · sobre 2e1a653 (el cierre solo añade documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c572e17.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` y `--motivo` sin valor → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso (el almacén es en memoria): `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y compiten; fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- El almacén de reservas vive en memoria por proceso: `canceladas` en una invocación aparte no ve lo cancelado antes (lo cubre 0014) → roadmap 0014.

Retro: sin señales

## 6. Adendas

- _Ninguna_
