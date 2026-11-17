# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 0c0afa5..7d409b2, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 7d409b2..a52e6b7, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed reasonOf conserva espacios (Important, código) — test/reason-trim.test.js RED→GREEN, suite 8/8
Final: fixed cancelledList sin tope (Minor, spec; review.minors: fix) — test/cancelled-cap.test.js RED→GREEN, suite 8/8; tope 20 + «… y N más» de la decisión 4, no el 10 que sugería el revisor
Final: Ruling: enmienda sin aprobar — AND del tope aplicado literalmente de la decisión 4 en spec.md — el listado sin tope imprimiría todo el historial — cost if wrong: el dev-lead pidió otro tope
Final: Ruling: tope de canceladas por orden de creación de la reserva, no de cancelación (re-revisión, Minor) — no hay forma de crear más de una reserva por el comando y el listado real nunca pasa de 1; registrar el orden de cancelación añade un campo que el spec no pide — cost if wrong: con más de 20 canceladas, `canceladas` puede omitir una reciente en vez de la más antigua
