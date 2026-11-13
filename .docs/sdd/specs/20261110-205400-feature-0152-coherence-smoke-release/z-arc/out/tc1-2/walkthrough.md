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

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos — `3cf9a2e`.
- Comando `canceladas` con el motivo de cada reserva cancelada — `a0ff396`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,33h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): 3 h 20 min de `Esperas y huecos` (09:40Z 140 min; 12:40Z 60 min), ya descontados del esfuerzo real
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 250.088 — claude-sonnet-5-5 250.080; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

Pendiente: este walkthrough es solo el borrador de tiempo y coste; la validación (`validation.mode: field`), el gate y el smoke se registran en el resto del cierre.

## 5. Aprendizajes

Pendiente del resto del cierre.
