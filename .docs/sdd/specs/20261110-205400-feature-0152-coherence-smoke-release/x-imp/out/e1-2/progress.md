# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

## Pre-flight scan

| Filas | Produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`, `test/cancel.test.js`) | T1 guarda `booking.reason` al cancelar; T2 lo lee para `canceladas` | coherente; comparten ficheros → T2 no arranca mientras corra la verificación lenta de T1 |
| Task 1 | Verificación `node --test test/cancel.test.js` contra el delta «Cancelar pide un motivo» (THEN + 2 AND) | el test sin commitear cubre THEN y el AND «fuera de la lista»; falta el AND «sin `--motivo`» → ruling 1 |
| Task 2 | Verificación `node --test test/cancel.test.js` contra el delta «El listado de canceladas» (1 THEN) | coherente |

Base: `develop` sin cambios desde el merge-base `fd84c89` (ni ROADMAP.md ni los ficheros de las tasks). Sin remoto.

Task 1: Ruling: RED incompleto — el test recibido no tenía el AND «sin --motivo»; añado `cancelar sin motivo lo rechaza` — la spec manda uno por THEN/AND — si sobra, es un test redundante.
Task 1: Ruling: código escrito antes de ver el RED — no lo borro: comprobé el RED de los 3 tests contra HEAD (8fb0aa8) en un worktree aparte (3 fail por falta del motivo) y el verde contra el parche (3 pass); el parche y la copia RED quedan fuera del repo (scratchpad e1-2-red) — si el código esconde algo que el test no ve, lo caza la revisión final.
Task 1: Ruling: se quitaron los tests previos «cancelar una reserva activa» y «cancelar sin reserva lo dice» — el primero lo sustituye el THEN nuevo; el segundo (sin reserva) sigue siendo comportamiento vivo sin test → lo repongo con motivo válido — si sobra, un test más.
Task 1: Ruling: verificación lenta lanzada por el usuario, no visible en esta sesión (sin PID ni comando) — no la envuelvo con `watch` ni la toco; no modifico `src/app.js` ni `test/cancel.test.js` hasta que acabe — si la espero sin necesidad, cuesta ~10 min.
