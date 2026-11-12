# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 18f8016..e178450, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits e178450..e6768c4, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo ni dependencia nuevos; package.json intacto) → no sale
Final: minor (deferred): test `canceladas` depende del orden respecto a `cancelar` (test/cancel.test.js:13)
Final: fixed `parseSince` sin día no avisa (src/app.js:20-23) — «canceladas --desde sin día avisa y no lista» RED→GREEN, suite 4/4
Final: Ruling: re-revisión Minor «missing» cubre también un día inválido — nombre algo laxo, comportamiento correcto — coste: lectura algo confusa
Final: Ruling: re-revisión, falta THEN de --desde en la spec — enmienda escrita en spec.md sin aprobar y sin commitear — coste: si el dev-lead no la aprueba, hay que revertir el aviso
