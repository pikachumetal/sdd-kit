# SDD ledger — plan: .docs/sdd/specs/20261009-150000-feature-0017-reactivate/plan.md

Método: Native (execution: native). Base: e53e99a. Ramas: base sin cambios en roadmap ni en ficheros de la task (develop == merge-base).

## Pre-flight scan

| Qué | Hallazgo | Ruling |
| --- | --- | --- |
| Pares de tasks | Una sola task: no hay pares | — |
| Task 1: tests vs código | `bookings` arranca con Norte/lun/10:00-12:00 `cancelled`: encaja con el GIVEN; `reactivar Norte lun` lo pasa a `active` y `libres` deja de listar Norte | — |
| Task 1: ficheros | `src/app.js` y `test/reactivar.test.js`: coinciden con los que toca | — |
| Plan manda algo que el rubric llama defecto | Nada | — |
| Línea base de la suite | `node --test` ya está en rojo ANTES de tocar nada: `app.test.js` «libres excluye la sala reservada» (da `Norte, Sur`) y `cancel.test.js` «cancelar una reserva activa» (da `sin reserva Norte lun`); ambos por el seed de `bookings` en `cancelled` | Task 1: Ruling: dos tests rojos previos — no los toco (el spec dice «No entra: cambiar otros comandos») — el gate de cierre `node --test` no podrá quedar verde sin una decisión del dev-lead |

Task 1: RED escrito en test/reactivar.test.js (2 tests, 1 por THEN); fallan con `salas` en vez de la salida esperada (comando inexistente). Copia en ../reactivar.test.red.js.
Task 1: complete (commits e53e99a..e765afa, tests: node --test test/reactivar.test.js → ℹ duration_ms 208.7626)
Final review: self-review (no subagent tool) sobre e765afa — sin Critical ni Important; diff de 8 líneas, un solo caso del spec por THEN, sin comentarios, texto en castellano.
Final: minor (deferred): con dos canceladas de la misma sala y día en franjas distintas, `reactivar` recupera solo la primera; el spec no lo cubre.
