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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos (38c8ab6).
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista las reservas canceladas con su motivo (82dfd52).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- No se ejecutó nada en este paso del cierre, que solo escribe el walkthrough.
- Revisión final: Spec y Código limpias sobre 82dfd52 (`Revisión final:` de `tasks.md`).

### 4.2 Smoke / tests

- Validación: pendiente. No consta ni validación del dev-lead ni la verificación del agente en campo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Todos los de la spec | `no probado` | sin verificar en este paso |

### 4.3 Residuales / deuda generada

- El workaround de `--test-concurrency=1` queda sin fila de deuda en este paso.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `tech-stack.md` (pendiente: el tope de palabras de ese fichero lo impide, ver el mensaje del cierre).

## 6. Adendas

- Ninguna.
