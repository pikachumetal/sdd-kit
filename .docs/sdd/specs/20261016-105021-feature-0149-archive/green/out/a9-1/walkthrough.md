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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` que lista «sala día — motivo». Commits `0e21768` (Task 1) y `158bb05` (Task 2).
- `test/cancel.test.js`: tests de cancelar con motivo válido, con motivo fuera de la lista y del listado.
- Capacidad `bookings` creada desde el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Spec aprobada (Laura, 2026-10-08); el plan era de dos tasks en modo Native y se hicieron así.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 verdes, sin fallos · 0,2 s · sobre `057b4c1`. También en verde con `node --test` (5/5, 0,1 s).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/3 THEN con ejecución real (la salida de `run` de `src/app.js` en un mismo proceso, y la CLI `node src/app.js cancelar …`) · revisión final de Spec y Código sobre `158bb05`, limpia; `HEAD` solo añadió `tasks.md` (documentación). No probado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| `cancelar Sur mar --motivo xyz` y `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (los dos casos) · suite solo el de la lista | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Los motivos siguen sin traducirse al inglés (la parte de la deuda «Los motivos no se traducen» que esta feature no salda): queda en la deuda.
- Sin `--motivo`, la respuesta no tiene test propio en la suite (solo ejecución real).
- Workaround `--test-concurrency=1`: fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Ninguno que pida `constitution.md`, `architecture.md` ni `tech-stack.md`: el comportamiento observable vive en `capabilities/bookings.md`. Skills: el proyecto no tiene `.claude/skills/` y la feature no revela un patrón reutilizable → no aplica (mirado).

## 6. Adendas

- _Ninguna_
