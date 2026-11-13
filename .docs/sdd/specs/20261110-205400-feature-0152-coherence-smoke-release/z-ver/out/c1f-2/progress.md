# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits c659b84..1d9ed25, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 1d9ed25..33d91a5, tests: node --test test/cancel.test.js → 3/3 pass)
Final: fixed reasonOf keeps spaces (Important, Código) — cancelar ignora los espacios alrededor del motivo RED→GREEN, suite 6/6
Final: fixed canceladas test depende del orden (Minor, Spec; review.minors: fix) — suite 6/6, el test pasa también solo
Final: Ruling: test del trim solo prueba el paso por «sin reserva Sur mar», no que se guarde el motivo recortado (Minor, re-revisión) — el código recorta en reasonOf antes de comprobar y de guardar (src/app.js:16,24); el estado compartido `bookings` solo tiene una reserva — cost if wrong: una regresión que guarde el motivo sin recortar no la vería ningún test
Final: Ruling: el AND «sin --motivo responde lo mismo» no tiene test (fuera del rango del fix, re-revisión) — el código lo cubre (reasonOf devuelve undefined y la lista lo rechaza) — cost if wrong: una regresión ahí pasaría la suite
