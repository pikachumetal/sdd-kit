---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (121ae57).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas (8be0ed1).
- `test/cancel.test.js`: tests de ambos comportamientos.
- Capacidad `bookings` creada con `sdd capability merge` (los dos ADDED de la spec).

## 3. Desviaciones del plan

- Una: el gate de cierre del plan es `node --test`; se ejecutó con `--test-concurrency=1` (ruling de la Task 2, abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre (el cierre solo añade documentación a lo que corrió: 8be0ed1).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 verde · smoke de los 3 THEN con ejecución real (`run()` en un mismo proceso, porque el almacén es en memoria) · revisión final de Spec (opus+high) y Código (sonnet+high) limpias sobre 8be0ed1; Arquitectura no, por el plan.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (sin test propio en la suite) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie por eso: aislar el almacén por test (fila en la deuda técnica).
- El caso «sin `--motivo`» no tiene test propio; lo cubre el mismo camino que el motivo inválido.
- El motivo no persiste entre ejecuciones del CLI (almacén en memoria): es el 0014.

## 5. Aprendizajes

- El almacén compartido en memoria obliga a serializar los tests → deuda técnica del roadmap (no es un aprendizaje de convención, no va a `constitution.md`).
- Revisión de skills: no aplica; el proyecto no tiene `.claude/skills/` y el trabajo no reveló un patrón reutilizable.

## 6. Adendas

- (ninguna)
