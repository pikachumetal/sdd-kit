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

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos (`src/app.js`, `test/cancel.test.js`) — 75e9c30.
- Comando `canceladas`: «<sala> <día> — <motivo>» — 23fbd4c.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,33h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): esperas al dev-lead de 140 min (09:40Z) y 60 min (12:40Z) ya descontadas del real; el resto, el plan estimó de más para dos tasks cortas
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 190.581 — claude-sonnet-5-5 190.573; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pass, 0 fail, 145 ms (verificado por mí en este cierre).

### 4.2 Smoke / tests

- Revisión final: Spec y Código, limpias, sobre 23fbd4c (de `tasks.md`).
- Validación en campo y THEN por THEN: no hechos en este paso; el cierre se ha limitado al walkthrough y a su §2.

## 5. Aprendizajes

- Sin aprendizajes registrados en este paso.

## 6. Adendas

- _Ninguna_
