---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `bookings`: `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos — `src/app.js`, `test/cancel.test.js` — 9b0d732.
- `bookings`: comando `canceladas`, que enseña el motivo de cada cancelada — `src/app.js`, `test/cancel.test.js` — 79fea55.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,33h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): Esperas y huecos: 09:40Z 140 min; 12:40Z 60 min (200 min en total, ya descontados del esfuerzo real); la estimación de 4h era alta para dos tasks cortas en el mismo fichero
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 166.466 — claude-sonnet-5-5 166.458; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Pendiente del cierre completo: la suite (`node --test`) no se ha ejecutado en este paso.

### 4.2 Smoke / tests

- Revisión final: Spec y Código, limpias, sobre 79fea55 (de `tasks.md`). Validación pendiente del cierre completo.

### 4.3 Residuales / deuda generada

- El workaround del test de `canceladas` (ver §3) queda sin fila de deuda todavía.

## 5. Aprendizajes

- Pendiente del cierre completo.

## 6. Adendas

- Ninguna.
