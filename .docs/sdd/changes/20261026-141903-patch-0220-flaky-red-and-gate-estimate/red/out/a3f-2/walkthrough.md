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

- Cancelar con motivo: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`src/app.js`, `test/cancel.test.js`) — 44ec557.
- Listado de canceladas: el comando `canceladas` lista `<sala> <día> — <motivo>` (`src/app.js`, `test/cancel.test.js`) — 6f9a9b4.
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- El gate del plan es `node --test`; la ejecución añadió `--test-concurrency=1` (ver el ruling).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 6/6 pasan, 3 ejecuciones seguidas · ~0,3-0,4 s · configuración: la del plan. Con `node --test --test-concurrency=1` (la del ruling) → 6/6 · ~0,5 s. Sha de la validación: 172fa88.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite 6/6 (plana y en serie) · smoke 5/5 THEN con ejecución real por la CLI · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 6f9a9b4; HEAD se movió después solo con `tasks.md` (documentación), sin re-revisión. Arquitectura no se revisó (el plan no lo pedía). `no probado`: persistencia entre invocaciones de la CLI (el almacén es en memoria; `cancelar` y `canceladas` en procesos distintos no comparten estado, fuera del scope de la spec — lo cubre la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (cancelar y canceladas en un mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` → fila nueva en la deuda técnica del roadmap.
- Persistir el motivo entre ejecuciones → ya es la 0014 del roadmap.

## 5. Aprendizajes

- El almacén de reservas en memoria obliga a serializar los tests → deuda del roadmap (aislar el almacén por test).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; no hay skill que actualizar ni patrón reutilizable nuevo → no aplica.
- `constitution.md`, `tech-stack.md`: sin cambios; el comportamiento observable vive en `capabilities/bookings.md`. No hay `architecture.md` y no se tocó la estructura.
- ADR: la spec no declara ninguna candidata.

## 6. Adendas

- (ninguna)
