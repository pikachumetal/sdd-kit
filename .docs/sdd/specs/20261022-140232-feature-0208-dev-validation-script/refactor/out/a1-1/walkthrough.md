---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-22
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: …». Commit 844ab70.
- `src/app.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. Commit 59f6e5d.
- `test/cancel.test.js` — tests de ambos comandos (mismos commits).
- `capabilities/bookings.md` — capacidad nueva, fusionada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Esfuerzo real: 0,01 h — reloj de la sesión de cierre 0,01 h desde 2026-10-22T15:27Z, sin 0 min de espera al dev-lead (0 esperas) *(solo cuenta la sesión del cierre; la implementación fue en una sesión anterior y no consta aquí; no hay `estimation.md`)*
- Tokens del hilo: 333.895 — claude-sonnet-5-5 333.895
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Apuntado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 0,17 s · configuración: la del gate (`node --test`; el ruling de concurrencia 1 no está en ningún fichero del proyecto) · sobre cefef85.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-22 · suite 5/5 · smoke 4/4 THEN con ejecución real (módulo y CLI) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 59f6e5d; lo posterior es solo `tasks.md` (17 líneas de documentación), sin re-revisión. Arquitectura no revisada (el plan no la pide). El dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- El almacén es memoria de proceso: por CLI, `canceladas` en una ejecución nueva sale vacío. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap.
- El caso «sin `--motivo`» no tiene test propio; lo cubre la ejecución real de este smoke.
- Workaround `--test-concurrency=1`: fila en la deuda del roadmap.

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio de lista cerrada, listado de canceladas) → `capabilities/bookings.md`.
- El workaround de concurrencia de tests → deuda técnica del roadmap (no es un aprendizaje estructural).
- Revisión de skills: el proyecto no tiene `.claude/skills/` y esta feature no revela un patrón reutilizable; no aplica.

## 6. Adendas

- _Ninguna_.
