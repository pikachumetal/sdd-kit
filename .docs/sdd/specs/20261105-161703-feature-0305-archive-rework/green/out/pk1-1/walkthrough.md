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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, commit 22e20f5).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (commit cde22c2).
- Capacidad nueva `bookings` creada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/estimation.md`: sin medición de tiempo.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Entra en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre · configuración: la del gate.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre cde22c2; Arquitectura no (plan). El commit b0c6688 solo toca `tasks.md` (el registro de la propia revisión): su paquete de revisión queda vacío, no se despachó re-revisión. sin revisar: b0c6688 — solo `tasks.md`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 5/5 · smoke con ejecución real de 3 de 4 THEN, el cuarto solo dentro de un proceso (ver 4.3) · revisión final Spec y Código limpia sobre cde22c2.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista (`--motivo "me aburro"`) | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: `run('cancelar')` y luego `run('canceladas')`) y `suite`; como comando suelto de la CLI, no probado | un proceso: `Norte lun — sala ocupada`; `node src/app.js canceladas` aparte: línea vacía |

Verificado por el agente todo lo anterior; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- `canceladas` desde la CLI, en un proceso aparte del `cancelar`, sale vacío: el almacén de reservas vive en memoria y el motivo no se guarda entre ejecuciones. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- Workaround `--test-concurrency=1` del gate: fila de deuda abierta en el roadmap.

## 5. Aprendizajes

- El comportamiento observable nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`.
- Los tests comparten un almacén en memoria y chocan en paralelo → deuda del roadmap (aislar el almacén por test).

Retro: sin señales

## 6. Adendas

