---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-31
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; un motivo fuera de la lista o ausente responde «motivo no válido: …». Commit 2a3443c (Task 1).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. Commit 348998a (Task 2).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, fusionada desde el delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Una en el gate, recogida abajo.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` en vez de `node --test` — para esquivar la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Abre una fila en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` en el árbol del cierre: 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,15 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-10-31 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real (3 por la CLI, 1 en un solo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 348998a; Arquitectura no (plan). Nadie del equipo lo ha probado a mano: es lo que corrió el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) · suite | «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`cancelar Sur mar --motivo xyz`) · suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) · sin test | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (el almacén es en memoria: dos invocaciones de la CLI no comparten estado) · suite | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- «Sin `--motivo`» no tiene test en `test/cancel.test.js`: solo lo cubre el smoke. Fila en «Por triar».
- Carrera de los tests sobre el almacén en memoria compartido: el gate lo esquiva con `--test-concurrency=1`. Fila en «Por triar».
- Los motivos siguen sin traducirse: esta feature cubre solo el castellano; falta el inglés. La fila de deuda queda marcada como parcial.

## 5. Aprendizajes

- Comportamiento observable de cancelar con motivo y del listado de canceladas → `.docs/sdd/capabilities/bookings.md` (creada desde el delta de la spec).
- Sin aprendizaje de convención, estructura o versión que vuelque en `constitution.md`, `architecture.md` o `tech-stack.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` (comprobado); no aplica.

## 6. Adendas

_(ninguna)_
