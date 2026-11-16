# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 9d8b3ac..4cb10f4, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 4cb10f4..b6aa62f, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed Code Important (reasonOf conservaba espacios) — «cancelar acepta el motivo con espacios alrededor» RED→GREEN, suite 6/6
Final: fixed Code Minor (« — » en consola cp850) — «canceladas enseña sala, día y motivo» RED→GREEN, suite 6/6; aplica la decisión del dev-lead, THEN corregido en spec.md (Enmiendas, sin aprobar)
Final: fixed Spec Minor (test de canceladas dependía del orden) — el test cancela por su cuenta, suite 6/6
Final: Ruling: re-revisión Minor — test «cancelar acepta el motivo con espacios alrededor» asserta «sin reserva Sur mar», no el caso reportado — prueba que el motivo con espacios pasa la validación y sigue sin depender del estado compartido; se queda — coste si falla: una regresión que valide recortado pero guarde el valor crudo no la cazaría este test
Final: Ruling: re-revisión Minor — los tests comparten el módulo `bookings` y dependen del orden de declaración — node:test los ejecuta en orden; se queda — coste si falla: reordenar los tests rompe el primero
Final: Ruling: fuera de alcance — el THEN «sin --motivo responde lo mismo» no tiene test en test/ — no lo introdujo el fix y se hereda de la Task 1; reaparece en ✋ — coste si falla: una regresión de esa rama no la caza ninguna prueba
