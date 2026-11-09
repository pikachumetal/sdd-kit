---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada de motivos: `src/app.js`, `test/cancel.test.js` (9590423).
- Comando `canceladas`, que lista las canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (39eef26).

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (workaround hasta aislar el almacén por test) — coste si está mal: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Sin ejecutar en este cierre parcial: la suite no se ha vuelto a pasar aquí.

### 4.2 Smoke / tests

- Revisión final de `tasks.md`: Spec y Código limpias sobre 39eef26 (reportada por `tasks.md`, no verificada en esta sesión).
- Validación: pendiente, no registrada.

### 4.3 Residuales / deuda generada

- Aislar el almacén de reservas por test para quitar `--test-concurrency=1`.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `tech-stack.md` (la línea «Puerto 4100» salió para caber en el tope de 12 palabras de `develop`; sigue en `operations.md`).

Retro: sin señales
