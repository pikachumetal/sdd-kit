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

- Cancelar con un motivo de la lista (`cancelar <sala> <día> --motivo <motivo>`): `5b877f3`, `31171e5`.
- Comando `canceladas`, que lista las reservas canceladas con su motivo: `31171e5`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,33h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): la estimación fue holgada; la línea `Esperas y huecos` mide 09:40Z 140 min y 12:40Z 60 min, ya descontados del esfuerzo real
- Compactación: no (el ledger no registra ninguna línea `Ruling: compactación`)
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 155.002 — claude-sonnet-5-5 154.994; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## 4. Verificación

Pendiente del cierre (no incluido en este borrador).

## 5. Aprendizajes

Pendiente del cierre.

## 6. Adendas

- _Ninguna_
