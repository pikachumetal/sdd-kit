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

- `bookings`: cancelar con un motivo de la lista (`cancelar <sala> <día> --motivo <motivo>`) — 506a371.
- `bookings`: comando `canceladas`, que lista las canceladas con su motivo — 6ca3a37.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.2 Smoke / tests

- Revisión final de Spec (opus+high) y Código (sonnet+high), limpias, sobre 6ca3a37 (de `tasks.md`).
- Validación en campo: no registrada en este cierre parcial; la suite y el smoke no se han vuelto a ejecutar aquí.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → tech-stack.md (la línea del puerto, que ya vive en `operations.md`, salió por el tope de palabras).

Retro: sin señales
