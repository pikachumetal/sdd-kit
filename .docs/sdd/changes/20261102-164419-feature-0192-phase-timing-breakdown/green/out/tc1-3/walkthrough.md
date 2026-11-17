---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: draft
created: 2026-11-02
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos (`src/app.js`, `test/cancel.test.js`) — 9f774d3.
- Comando `canceladas`, que enseña el motivo de cada cancelación (`src/app.js`, `test/cancel.test.js`) — f227adb.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 1,67 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: −2,33 h (−58 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): las esperas (09:40Z 140 min; 12:40Z 60 min) ya están descontadas del esfuerzo real, así que no la explican; el resto no se midió («sin medir»). Dato a mano: eran dos tasks cortas sobre el mismo fichero.
- Compactación: no consta (sin línea `Ruling: compactación` en el ledger)
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 163.065 — claude-sonnet-5-5 163.057; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (workaround hasta aislar el almacén por test) — coste si está mal: la suite tarda el doble.

## 4. Verificación

Pendiente: no se ha hecho en este paso (solo walkthrough mínimo y §2). Falta el `Gate:`, la validación y la tabla de THEN.

### 4.3 Residuales / deuda generada

- El workaround de `--test-concurrency=1` necesita su fila de deuda (aislar el almacén por test).

## 5. Aprendizajes

Pendiente (cierre sin hacer).

Retro: pendiente

## 6. Adendas

- (ninguna)
