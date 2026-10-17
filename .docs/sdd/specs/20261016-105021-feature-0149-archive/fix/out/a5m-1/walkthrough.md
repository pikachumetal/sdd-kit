---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 1905612): el motivo tiene que ser de la lista cerrada (cambio de planes, sala ocupada, otro); si no, o si falta, responde «motivo no válido: …». Al cancelar guarda el motivo con la reserva.
- `canceladas` (`src/app.js`, `test/cancel.test.js`, fe71289): lista las reservas canceladas como «sala día — motivo».
- Capacidad `bookings` creada al fusionar el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. El plan declaraba el gate de cierre `node --test`.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre no he reproducido la carrera: `node --test` a secas pasa 5/5. Queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 pasan, 0 fallos · 207 ms · sobre el código de fe71289 (desde ahí solo cambian `.docs/`).

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real (`node src/app.js …`, y `run` en un solo proceso para `canceladas`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre fe71289; Arquitectura no (plan). Nada validado por el dev-lead: no probado por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre: no hay test de este THEN) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` sin reproducir la carrera → fila en «Deuda técnica» del roadmap.
- Falta un test del THEN «sin `--motivo`»; lo cubre solo el smoke.

## 5. Aprendizajes

- El workaround de concurrencia del gate no es una decisión de stack → deuda del roadmap, no a `tech-stack.md`.
- Revisión de skills: no aplica, mirado: el proyecto no tiene `.claude/skills/`.
- Sin `architecture.md` en el proyecto ni cambio estructural que volcar.

## 6. Adendas

- (ninguna)
