# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 7639dd8..86cc7cc, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 86cc7cc..c9f8e75, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed test de canceladas dependía del orden — «canceladas enseña sala, día y motivo» RED→GREEN (en solitario: '' → ok), suite 6/6
Final: Ruling: AND «sin --motivo» sin test — añadido «cancelar sin --motivo responde lo mismo…»; pasa a la primera porque reasonOf ya devuelve undefined — si fallara, el AND quedaría sin cubrir
Final: Ruling: Minor « — » ilegible en cp850 — no se cambia: la decisión 4 de la spec y el THEN de «canceladas» fijan « — » literalmente; cambiarlo es una enmienda que decide el dev-lead — si la recepción usa cp850, ve «ÔÇö» hasta que se cambie
Final: Desvío: Important recortar el motivo — añade un AND a «Cancelar pide un motivo de la lista»; spec.md y su línea de Enmiendas quedan sin commit, a la espera del dev-lead
