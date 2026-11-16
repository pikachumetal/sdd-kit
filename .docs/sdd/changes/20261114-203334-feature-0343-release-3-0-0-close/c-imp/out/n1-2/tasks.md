---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-15
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6cfdc19 | |
| 2 | Listado de canceladas | done | ecb3580 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: autorrevisión del autor (sin herramienta de subagentes) — Spec limpio · Código 1 minor diferido · Arquitectura limpio (subido: datos), sobre ecb3580

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Setup: Ruling: trabajo en sitio sobre `feature/0010-cancel-reason`, sin worktree aparte — el dev-lead está fuera y no puede dar el consentimiento que pide sdd-worktrees; la rama ya es la de la feature, no main ni develop — si se quería worktree, el trabajo está igualmente aislado en su rama y se mueve con un `git worktree add` sin pérdida.
- Setup: Ruling: effort — este harness no expone herramienta de subagentes ni el tipo `sdd-kit:effort-<level>`: effort no disponible en este harness, hereda el de la sesión; la revisión final se hará como sdd-verify permita sin subagentes — si hacía falta revisor fresco, la revisión pierde la segunda mirada y lo digo en el ✋ final.
- Task 1: Ruling: el test «cancelar una reserva activa» (sin `--motivo` → `cancelada Norte lun`) se sustituye por el THEN de la spec con `--motivo "sala ocupada"` — la spec manda que sin `--motivo` responda «motivo no válido…», así que el test viejo contradice el contrato aprobado — si se quería mantener cancelar sin motivo, es la spec la que tendría que cambiar.
- Task 1: Ruling: se comprueba primero que exista la reserva y después el motivo; `cancelar Sur mar` (sin reserva) sigue respondiendo «sin reserva Sur mar» con o sin motivo — es la salida de hoy y la spec solo fija el motivo con la reserva del GIVEN; así no cambio una salida que la spec no toca — si se quería validar el motivo antes, `cancelar <sin reserva>` sin motivo respondería «motivo no válido…»: un cambio de una línea.
- Task 2: Ruling: el test de `canceladas` importa una instancia fresca del módulo (`import('../src/app.js?canceladas')`) y monta su propio GIVEN — así no depende del orden ni de lo que cancelen los tests de Task 1 — si el runner cambiase la semántica de la query en el import, el test fallaría en rojo, no en falso verde.
- Task 2: Ruling: guardar el motivo en la reserva (`cancelReason`) pasa de Task 1 a Task 2 — ningún THEN de Task 1 lo exige y el código mínimo de su GREEN no lo lleva; entra bajo el RED de `canceladas` — si se esperaba en Task 1, solo cambia en qué commit está.
- Task 2: Ruling: `canceladas` sin ninguna cancelada responde una línea vacía (join de lista vacía) — la spec no fija ese caso y no añado texto que nadie ha aprobado — si se quería un mensaje («sin canceladas»), es una línea y un THEN nuevo.
- Final: Ruling: Eje Arquitectura sin línea → sí — el diff añade un dato a la reserva y la spec ya nombraba la señal «datos» — si no hacía falta, solo costó una pasada corta.
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF (el resto del repo está en CRLF), y el diff reescribe el fichero entero — no cambia comportamiento; se arregla con un commit que solo normalice el fin de línea.
- Final: Ruling: (declined) `cancelar --motivo otro Norte lun` (opción antes de los posicionales) toma «--motivo» como sala y responde «sin reserva --motivo otro» — la spec y el uso documentado ponen la sala y el día primero, como el resto de comandos — si alguien lo escribe al revés, ve un mensaje confuso pero no se cancela nada.
- Final: Ruling: (declined) el motivo distingue mayúsculas («Sala ocupada» se rechaza) — la lista es cerrada y el mensaje de error enseña los valores exactos — si molesta, normalizar con toLowerCase es una línea.
