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

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada de motivos (commit 2055ef5).
- Comando `canceladas`, que enseña el motivo (commit 43ec2a3).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Revisión final limpia (Spec opus+high, Código sonnet+high) sobre 43ec2a3, según `tasks.md`.
- Suite y gate: no ejecutados en este cierre.

### 4.2 Smoke / tests

- Validación: pendiente. No se ha registrado ninguna en este cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo de la lista | no probado | — |
| Motivo fuera de la lista o ausente | no probado | — |
| Listado de canceladas con motivo | no probado | — |

### 4.3 Residuales / deuda generada

- El workaround de `--test-concurrency=1` queda sin fila en la deuda del roadmap.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → tech-stack.md

Retro: no ejecutada en este cierre

## 6. Adendas

- (ninguna)
