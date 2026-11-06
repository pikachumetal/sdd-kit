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

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro) — `17997fb`.
- Comando `canceladas`, que lista las reservas canceladas con su motivo — `cc2423e`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,68 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,32h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): Esperas y huecos: 09:40Z 140 min; 12:40Z 60 min (ya descontadas del real); por qué salió por debajo de lo estimado, sin medir
- Compactación: no registrada
- Modelo del hilo: claude-sonnet-5-5, effort no registrado
- Tokens del hilo: 112.137 — claude-sonnet-5-5 112.129; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## 4. Verificación

Pendiente del cierre: validación, gate y smoke aún sin registrar.

## 5. Aprendizajes

Pendiente del cierre.
