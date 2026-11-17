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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); si falta o es otro, responde `motivo no válido: …`. `src/app.js`, `test/cancel.test.js` — a20308d.
- `canceladas`: lista las reservas con estado cancelada como `<sala> <día> — <motivo>`. `src/app.js`, `test/cancel.test.js` — e02d080.
- Capacidad `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el código. La spec ganó `parent: 0009` tras la revisión final (solo documentación).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pass, 0 fail · 0,22 s · sobre 40b2899.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke de los 4 THEN con ejecución real (`run()` en un proceso y CLI `node src/app.js`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre e02d080; lo posterior a esa sha es solo documentación. Nadie ha probado la feature a mano: es verificación del agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite + ejecución real (CLI) | ok |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real | ok |
| Sin `--motivo` → el mismo mensaje | ejecución real (CLI); la suite no lo cubre | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- El caso «sin `--motivo`» no tiene test en `test/cancel.test.js`: solo lo cubre la ejecución real.
- Los tests comparten el almacén en memoria y obligan a `--test-concurrency=1` → fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El gate de la suite lleva `--test-concurrency=1` mientras el almacén sea compartido → `tech-stack.md` (con su fila de deuda).
- Comportamiento observable de cancelar y `canceladas` → `capabilities/bookings.md`.
- Sin cambio estructural ni convención nueva → `constitution.md` y `architecture.md` no se tocan (este último no existe).
- Revisión de skills: el proyecto no tiene `.claude/skills/`; el trabajo no revela ningún patrón reutilizable. No aplica.

## 6. Adendas

- _Ninguna_
