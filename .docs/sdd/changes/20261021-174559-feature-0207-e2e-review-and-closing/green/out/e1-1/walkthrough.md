---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`) — 4478991.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (`src/app.js`, tests, E2E) — 91b6588.
- Capacidad `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- Task 1 figuraba en `tasks.md` con el commit 91b6588; el suyo es 4478991. Corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate durante la ejecución, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate se pasó tal como lo declara `operations.md`, sin la opción, y salió verde.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/ && node e2e/run.mjs` → unit 5/5 en 0,6 s; E2E 7/7 en 48,7 s · configuración: la del gate · sobre 353f93b (el código es el de 91b6588; después solo cambió `tasks.md`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4549/health` → `ok`, levantado en esta sesión (había otro proceso escuchando en el puerto; `env-up` lo paró y arrancó el suyo). Parado al acabar con `env-down`.
- E2E: 48,7 s de 0,5 min (30 s) — pasa del presupuesto, deuda del proyecto (4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · verificación del agente: suite unit 5/5 y E2E 7/7 con el entorno levantado por esta sesión · smoke 5 casos con ejecución real contra el servidor, una sesión nueva por caso · revisión final de Spec (opus+high) y Código (sonnet+high), limpias, sobre 91b6588; Arquitectura no (plan de dos tasks). Nadie ha probado a mano la aplicación: lo no probado queda como tal.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real + suite | verificado por el agente |

### 4.3 Residuales / deuda generada

- E2E fuera de presupuesto: 48,7 s de 30 s — fila en «Deuda técnica» del roadmap (ya pasaba antes de esta feature con 5 tests: cada paso espera 6 s con la traza completa).
- Tests que dependen del orden por el almacén compartido en memoria (`canceladas` ve la cancelación del test anterior) — fila en «Deuda técnica»: es lo que el ruling de la Task 2 esquivaba.
- Con `canceladas` sin ninguna cancelada responde una línea vacía; la spec no dice qué debe responder. Sin deuda abierta: lo apunto aquí para que lo decida quien escriba la 0012.

## 5. Aprendizajes

- Cancelar pide motivo y `canceladas` lo enseña → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Ningún aprendizaje de convención ni estructural: `constitution.md` y `tech-stack.md` siguen igual.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y el trabajo no reveló un patrón reutilizable; no aplica.
- ADR: la spec no declara candidatas; `sdd decision check` pasa.

## 6. Adendas

- _Ninguna_
