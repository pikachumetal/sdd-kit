---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con un motivo de la lista (`cancelar <sala> <día> --motivo <motivo>`) — `src/app.js`, `test/cancel.test.js` — 5e1c052.
- Listado de canceladas con su motivo (`canceladas`) — `src/app.js`, `test/cancel.test.js` — 4392b81.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,33h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): esperas y huecos 09:40Z 140 min; 12:40Z 60 min (200 min en total, ya descontados del esfuerzo real)
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 216.096 — claude-sonnet-5-5 216.088; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

Pendiente del resto del cierre (suite, smoke y validación en campo): no se ha ejecutado en este paso.

## 5. Aprendizajes

Pendiente del resto del cierre.

## 6. Adendas

- _Ninguna_
