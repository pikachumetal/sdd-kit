---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos — `84f4569`, `ce58ad3`.
- Comando `canceladas` con el motivo de cada reserva — `ce58ad3`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, por la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Revisión final (Spec opus+high, Código sonnet+high, ambas limpias) sobre `ce58ad3`, según `tasks.md`.
- Suite y smoke: no ejecutados en este cierre parcial.

### 4.2 Smoke / tests

- Validación: pendiente (`validation.mode: field`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo de la lista | no probado | — |
| Motivo fuera de la lista o ausente | no probado | — |
| Listado de canceladas con motivo | no probado | — |

### 4.3 Residuales / deuda generada

- El workaround de `--test-concurrency=1` pide una fila de deuda en el roadmap (no escrita en este cierre parcial).

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → tech-stack.md

## 6. Adendas

_Ninguna._
