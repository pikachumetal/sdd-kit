---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (7e168e6, 664b1ed).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (664b1ed).

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-10-26T18:34Z, sin 0 min de espera al dev-lead (0 esperas) *(solo la sesión de cierre: la implementación fue de una sesión anterior que no se mide aquí)*
- Tokens del hilo: 562.514 — claude-sonnet-5-5 562.514
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 664b1ed. Sin re-revisión: lo único posterior es `cfe0564`, que solo toca `tasks.md`.
- Suite completa: no corrió antes del cierre porque hay otra rama abierta (`feature/0011-others`); corre una sola vez en el paso de integración sobre el merge de sincronización, y su resultado va en el mensaje final del cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre 664b1ed, limpia · suite en la integración de la base (ver mensaje final).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista (`vacaciones`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén de reservas en memoria y corren en carrera: aislarlo por test y quitar `--test-concurrency=1` — fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El almacén de reservas en memoria es estado compartido entre tests → deuda técnica del roadmap.
- Revisión de skills: no aplica, el proyecto no tiene `.claude/skills/`.

## 6. Adendas

- _Ninguna_
