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

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b1294f0 | |
| 2 | Listado de canceladas | done | 2e39a48 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: Spec opus+high, Yes · Código sonnet+high, Yes · Arquitectura no (plan), sobre 2e39a48

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Ruling: trabajo en el sitio, en feature/0010-cancel-reason, sin worktree nuevo — el usuario no pidió uno, la rama ya aísla de main y el baseline corrió desacoplado — si es un error, se mueve la rama a un worktree sin coste
- Ruling: effort — los tipos sdd-kit:effort-low/medium/high están en el harness; el plan no fija Modelo: implementadores y revisores con sonnet + sdd-kit:effort-medium — 2 tasks de 2 ficheros con prosa — si queda corto, escalo en el fix-loop
- Ruling: el test existente «cancelar una reserva activa» se reescribe con --motivo «sala ocupada» en la Task 1 — la spec (ADDED, THEN/AND sin --motivo) lo contradice si no — si es un error, se restaura la aserción vieja
- Ruling: orden de validación en cancelar: primero existe la reserva, luego el motivo — la spec solo cubre reserva existente y así «sin reserva Sur mar» (test existente, sin motivo) no cambia — si es un error, el dev-lead lo decide en la validación
- Ruling: tests de cancel.test.js ordenados (motivo inválido, sin motivo, motivo válido, canceladas) porque el estado del módulo no se reinicia — la spec manda probarlo por el comando — coste: orden frágil si alguien reordena
- Task 2: Ruling: listado sin canceladas devuelve cadena vacía — la spec no lo dice y no invento texto observable — si es un error, el dev-lead fija el texto en la validación
- Final: Ruling: Eje Arquitectura no — el diff son dos funciones y un campo en memoria dentro de un único módulo — si es un error, el dev-lead lo pide en la validación
- Final: Ruling: sin pasada de fix ni re-revisión — 0 Critical/Important y sin review.minors: fix — si es un error, se arregla en la validación con su commit
- Final: minor (deferred): `--motivo sala ocupada` sin comillas lee «sala» y se rechaza con el mensaje de la lista
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco; el texto lo fija el dev-lead (cambia la salida observable)
- Final: minor (deferred): tests de cancel.test.js dependen del orden y del estado de módulo; el de canceladas sin comentario ni reset
- Final: minor (deferred): sin test de anuladas excluidas de `canceladas` ni de listado vacío
- Final: minor (deferred): `cancelBooking` recibe argv crudo y parsea --motivo (mejor parsear en `run`)
- Final: minor (deferred): cancel.test.js pasó de CRLF a LF (reescritura entera del fichero en el diff)
- Final: minor (deferred): CANCEL_REASONS declarada entre funciones, no arriba con rooms/bookings
- Ruling (declined, Spec): persistencia entre ejecuciones del CLI — cada `node src/app.js …` arranca con los datos fijos, así que `canceladas` en un proceso nuevo no ve lo cancelado en otro (verificado: imprime una línea en blanco); ya era así antes de 0010 y el roadmap 0014 guarda el motivo — el dev-lead confirma en la validación que 0010 se acepta con estado en memoria — coste: el comando no es útil desde la terminal hasta la 0014
- Ruling (declined, Spec): mayúsculas/acentos del motivo, --motivo antes de sala/día o repetido — la lista cerrada y la sintaxis las fijó el dev-lead y el mensaje enseña los valores exactos — coste: «Sala ocupada» se rechaza
- Ruling (declined, Spec/Código): CHANGELOG/ROADMAP, decisión 3 de la spec, estructura de un solo módulo — son de sdd-archive, de proceso o del eje Arquitectura — coste: ninguno en el código
- Ruling (declined, Código): nombre/renombrado del test viejo — la spec lo fuerza (ruling del preflight)
- Ruling (no verificado, Spec): numeración de decisiones 1→3 en la spec — leída: la spec aprobada solo trae las decisiones 1 y 3, ninguna regla perdida — si hubo una 2, el dev-lead la repone en la validación
