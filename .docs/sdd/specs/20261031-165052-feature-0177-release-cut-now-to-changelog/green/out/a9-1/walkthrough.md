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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js`, commit 0512205.
- `canceladas` lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`) — `src/app.js`, `test/cancel.test.js`, commit 206a8a4.
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ respecto a las dos tasks del plan.

### Decisiones tomadas sin el dev-lead

- Gate de cierre con `node --test --test-concurrency=1` en vez de `node --test` — los tests corren una carrera sobre el almacén compartido en memoria — coste si está mal: la suite tarda el doble. Es un workaround hasta aislar el almacén por test; queda en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 de 5 pasan, 0 fallos.
- Gate: `node --test --test-concurrency=1` → suite completa: corrió 5/5 · sin filtro por tarea (el proyecto no declara tareas) · configuración: la del plan más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-31 · suite 5/5 · smoke de los 4 THEN con ejecución real (comando `node src/app.js` y `run()` en un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 206a8a4; lo único posterior es `tasks.md` (17 líneas, solo documentación), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista (`xyz`) → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | suite · ejecución real (en un solo proceso, porque el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie; aislarlo por test permitiría quitar `--test-concurrency=1` → fila en `debt.md` («Por triar»).
- Los motivos siguen sin traducirse al inglés: la fila de deuda queda con lo que falta.
- El test «sin `--motivo`» no existe en `test/cancel.test.js`; el THEN solo lo cubre el smoke.

## 5. Aprendizajes

- El almacén compartido en memoria obliga a correr los tests en serie → `debt.md` (Por triar), sin escribirlo en `tech-stack.md`.
- Revisión de skills: no aplica, `.claude/skills/` no existe en el proyecto y nada de esta feature es un patrón reutilizable.
- Sin ADR: la spec no declara candidatas.

## 6. Adendas

- _Ninguna._
