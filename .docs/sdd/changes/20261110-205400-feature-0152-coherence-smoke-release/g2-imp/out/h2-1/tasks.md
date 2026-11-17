# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | c4c3d9a |
| 2 — Listado de canceladas | hecha | de9368f |

Revisión final: Spec opus+high, con arreglos (0 Critical, 0 Important, 5 Minor) · Código sonnet+high, con arreglos (1 Important, 5 Minor) · Arquitectura no (plan sin línea; sin señales en el diff), sobre de9368f
Pasada de fix: ca0bbbf, 1 hallazgo RED→GREEN
Re-revisión: de9368f..ca0bbbf, sdd-kit:effort-high + opus, limpia

## Rulings

Ruling: trabajo en el sitio, sin worktree nuevo — la rama feature/0010-cancel-reason ya está aislada de main y la sesión no es interactiva — coste si me equivoco: ninguno, la base se comprobó en un worktree detached.
Ruling: validar el motivo antes de buscar la reserva — la spec dice que sin --motivo responde «motivo no válido…» y no fija el orden; así un cancelar sin motivo nunca cancela — si me equivoco, un cancelar sin motivo sobre sala sin reserva diría «motivo no válido» en vez de «sin reserva».
Ruling: los tests existentes de cancelar pasan a llevar --motivo (el 1.º «sala ocupada»... ver RED) — la spec cambia el contrato de cancelar — coste: ninguno.
Ruling: cancel.test.js comparte estado de módulo entre tests (una reserva sola, Norte lun); el test de canceladas depende de que el de cancelar con «sala ocupada» corra antes (node:test es secuencial en un fichero) — coste: orden frágil si alguien reordena.
Ruling: implementador sonnet + sdd-kit:effort-medium en ambas tasks — plan sin línea Modelo, tasks de un fichero pero de prosa — coste: algo más caro que haiku.
Final: minor (deferred): aceptar los tres motivos en un test (solo «sala ocupada» tiene test de aceptación)
Final: minor (deferred): motivo de varias palabras sin comillas (`--motivo sala ocupada`) se rechaza con el mensaje de lista
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía
Final: minor (deferred): `--motivo` sin valor da el mismo «motivo no válido» (spec lo fija así); orden de argumentos posicionales; CANCEL_REASONS entre funciones en vez de arriba
Final: Ruling: persistencia entre invocaciones del CLI — cada proceso arranca con bookings en memoria; la spec no la pide y el roadmap la tiene en 0014 «Motivo guardado» — si me equivoco, `canceladas` en otro proceso sale vacío
Final: Ruling: --motivo antes de sala/día — el orden lo fija la spec (`cancelar <sala> <día> --motivo`) y los posicionales ya se leían así — coste: «sin reserva --motivo otro»
Final: Ruling: mayúsculas en el motivo — lista cerrada con coincidencia exacta y mensaje que enumera los valores — coste: «Sala ocupada» se rechaza
Final: Ruling: cancelaciones previas sin motivo — sin persistencia no pueden existir — coste: ninguno hoy
Final: Ruling: anulaciones fuera del listado — «No entra» de la spec (0011) — coste: ninguno
