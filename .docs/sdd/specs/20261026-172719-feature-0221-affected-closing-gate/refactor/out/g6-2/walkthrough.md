---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (8ce2b0b).
- `canceladas` lista las reservas canceladas como «sala día — motivo»: `src/app.js`, `test/cancel.test.js` (45dd4ba).
- Capacidad `bookings` fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La re-revisión comprobó que el flag no está en `gate.json` ni en el plan, y que con un solo fichero de test la carrera no se ve: queda como deuda para que el dev-lead decida si se aplica o se retira.

## 4. Verificación

### 4.1 Builds

- Gate: no corrió en la validación; hay otra rama abierta (`feature/0011-others`) y la base `develop` va por delante. Corre una sola vez en el merge de sincronización (paso 6 de `sdd-archive`, `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`); su resultado y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-27 · verificación del agente: smoke de los 3 THEN con ejecución real sobre `src/app.js`; revisión final Spec y Código sobre 45dd4ba, limpia; re-revisión del tramo posterior (solo `tasks.md`) con tres hallazgos, dos corregidos o adjudicados abajo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real | `--motivo vacaciones` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` → el mismo mensaje | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» (sin test en la suite: ver 4.3) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | cancelar y listar en un mismo proceso (el almacén es en memoria) → «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Falta el test de «sin `--motivo`» en `test/cancel.test.js`, aunque la spec lo sitúa ahí: fila en la deuda del roadmap.
- Ruling `--test-concurrency=1` sin aplicar: fila en la deuda del roadmap.

## 5. Aprendizajes

- Sin aprendizajes estructurales; no hay `architecture.md` que tocar. Revisión de skills: no existe `.claude/skills/` en el proyecto, no aplica.

## 6. Adendas

