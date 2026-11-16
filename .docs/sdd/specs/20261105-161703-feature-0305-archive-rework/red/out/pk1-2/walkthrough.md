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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit `ad7b758`.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo». Commit `7ca8ff3`.
- `test/cancel.test.js`: un test por THEN (`ad7b758`, `7ca8ff3`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Un ruling de la ejecución sobre el gate (abajo).

### Decisiones tomadas sin el dev-lead

- El gate corre con `node --test --test-concurrency=1` y no con `node --test` — esquiva la carrera de los tests sobre el almacén de reservas compartido en memoria; es un workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Anotado en la deuda.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → corrió 5/5 tests, 0 fallos · configuración: la del plan más `--test-concurrency=1` (ruling anterior) · sobre `52bf2f3`. Además `node --test` sin la opción: 5/5, verde. Salida completa guardada en el scratchpad de la sesión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · verificación del agente: suite 5/5 · smoke de los 3 THEN con ejecución real (CLI y un mismo proceso para el listado) · revisión final de Spec y Código sobre `7ca8ff3`, limpia; `HEAD` solo añadió `tasks.md`. No probado: `canceladas` en un proceso nuevo de la CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso) + suite | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: lanzar `canceladas` en una invocación nueva de la CLI imprime una línea vacía, porque la cancelación de otra invocación no existe. Dentro del alcance de la spec (el listado se prueba por la salida del comando en el mismo proceso), y ya lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Workaround del gate (`--test-concurrency=1`): fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- Los tests de `cancel.test.js` comparten el almacén en memoria y dependen del orden; el aislamiento por test está en la deuda → deuda técnica del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna._
