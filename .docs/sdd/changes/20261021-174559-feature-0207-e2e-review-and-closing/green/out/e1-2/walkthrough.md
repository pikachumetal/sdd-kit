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

- `src/app.js`: lista cerrada de motivos (cambio de planes, sala ocupada, otro); `cancelar <sala> <día> --motivo <motivo>` guarda el motivo con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o ausente responde «motivo no válido: …». Task 1, commit 97cc981.
- `src/app.js`: comando `canceladas`, lista «sala día — motivo» de las reservas canceladas. Task 2, commit 48b19d6.
- `test/cancel.test.js` y `e2e/cancel.e2e.mjs`: pruebas de ambos comportamientos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance.

### Decisiones tomadas sin el dev-lead

- Task 2: gate de tests con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate se corrió tal como lo declara `operations.md`, sin el flag, y pasó; el workaround queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/ && node e2e/run.mjs` → unit 5/5 (0,9 s) + e2e 7/7 (49,7 s) · sobre fc41439 · configuración: la del gate.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4515/health` → ok, levantado en esta sesión (había otro servidor escuchando en el puerto; `env-up` lo reinició) y parado al acabar.
- E2E: 49,7 s de 0,5 min — pasa del presupuesto; fila de deuda abierta.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · suite 5/5 unit + 7/7 e2e con el gate declarado · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) sobre 48b19d6, limpia; HEAD solo añade `tasks.md`. No hay prueba del dev-lead: `no probado` por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real (sin test automático) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del estado compartido del almacén en memoria; fila de deuda (con el workaround del ruling).
- Suite e2e: 49,7 s de 0,5 min de presupuesto — deuda del proyecto.
- Falta el test automático del THEN «sin `--motivo`»; fila de deuda.

## 5. Aprendizajes

- Un workaround de gate (`--test-concurrency=1`) esconde una dependencia entre tests → fila en «Deuda técnica» del roadmap; no se escribe en `tech-stack.md` ni `operations.md`.
- Revisión de skills: no aplica; `.claude/skills/` no existe en el proyecto y el trabajo no reveló un patrón reutilizable.
- Sin cambios en `constitution.md`, `architecture.md` (no existe; nada estructural) ni `tech-stack.md`.

## 6. Adendas

- (ninguna)
