---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | (commit de la task 1) | afectada por enmienda 2026-10-10 → Task 3 |
| 2 | Listado de canceladas | done | dde3e2f | mismo commit que la Task 3 (ver Rulings) |
| 3 | Task 3 — enmienda 2026-10-10: `--por <nombre>` en `cancelar` | done | dde3e2f | ejecutada antes que la 2 |

## Rulings

- Orden: la Task 3 (enmienda) se ejecuta antes que la Task 2, porque el listado lee lo que `--por` guarda — coste si falla: ninguno, el orden solo mueve el commit.
- Tasks 2 y 3 en un solo commit (`dde3e2f`) y un solo RED: lo que guarda `--por` solo se observa por `canceladas`; el test de `--por` solo ya pasaba antes (se ignoraba) y el RED real fue el del listado (2 de 3 fallaban con `salas`) — coste si falla: un commit menos granular de lo que pide el plan.
- Los tests nuevos importan `app.js` con un query (`?n`) para tener un módulo limpio, porque las reservas viven en memoria y solo hay una — coste si falla: el truco de import se quita al llegar a persistencia.
- «sin indicar» (enmienda): decisión mía dentro de la enmienda aprobada, a validar.

## Revisión final

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 2 Important, 5 Minor), sobre c708952
Pasada de fix: ee09cad, 1 hallazgo (Important 1; el test ya pasaba: lo perdió la Task 1, no es RED)

- Final: fixed Important 1 (test de «sin reserva» perdido en la Task 1) — test repuesto, suite 8/8.
- Final: Important 2 (mensaje de `canceladas` vacío; desde la terminal siempre sale vacío por la falta de persistencia) — decisión del usuario, pendiente.
- Final: minor (deferred): el test del motivo no válido usa `Sur mar`, no el GIVEN `Norte lun`.
- Final: minor (deferred): `cancelar Norte lun` sin `--motivo` sin test.
- Final: minor (deferred): `--por ""` o `--por --motivo …` toman un valor raro como nombre.
- Final: minor (deferred): dos estilos de test en `cancel.test.js` (módulo compartido frente a `fresh`).
- Final: minor (deferred): `tasks.md` fila 1 sin hash, Task 3 colgada de «## 3. Validación final» en `plan.md`, «a validar» de «sin indicar» aún sin cerrar.
