---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de la lista cerrada (cambio de planes, sala ocupada, otro); se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — e813246.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 281f365.
- Capacidad `bookings` creada con `sdd capability merge` (no existía `capabilities/`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 verdes, 129 ms, sobre 7988597. También con `--test-concurrency=1`: 5/5, 174 ms.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · verificación del agente: suite 5/5 · smoke de 4 THEN con ejecución real en un mismo proceso · revisión final Spec y Código limpias sobre 281f365; HEAD solo añade `tasks.md`. Nada lo ha probado el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (la suite no lo cubre) | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y dependen del orden (`canceladas` espera la cancelación del test anterior): deuda en el roadmap.
- «sin `--motivo`» no tiene test propio.

## 5. Aprendizajes

- Comportamiento observable → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Sin convención, cambio estructural ni versión nuevos; sin `architecture.md` que tocar. `.claude/skills/` no existe y no se revela un patrón reutilizable: skills, no aplica.

## 6. Adendas

