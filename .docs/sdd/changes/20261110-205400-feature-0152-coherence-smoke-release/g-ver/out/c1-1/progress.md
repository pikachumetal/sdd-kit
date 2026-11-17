# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits fb90427..56e0bfd, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 56e0bfd..c661fff, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed reasonOf keeps spaces (Important, código) — «cancelar recorta los espacios del motivo» RED→GREEN, suite 6/6
Final: minor (deferred): test `canceladas` depende del orden del test `cancelar` (review.minors no es fix)
Final: Ruling: re-review Minor (el test del trim no cancela una reserva real ni comprueba el motivo guardado) — el código guarda el valor recortado (src/app.js:24) y el test falla sin el fix — cobertura algo corta si alguien cambia cancelBooking
Final: Ruling: anular/voidBooking fuera del alcance (0011) observado por la re-revisión — ya estaba en la base (8f5f233), no es de esta feature — nulo
