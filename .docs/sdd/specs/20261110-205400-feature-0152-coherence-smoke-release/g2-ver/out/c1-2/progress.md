# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 189e97c..27be5cc, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 27be5cc..09fb78d, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed reasonOf conserva los espacios del motivo (Code, Important) — «cancelar acepta un motivo con espacios alrededor» RED→GREEN, suite 6/6 (9a016d1)
Final: minor (deferred): el test «canceladas» depende del orden del test «cancelar» (Spec, test/cancel.test.js:13)
Final: fixed test de espacios dependía del orden (Re-revisión, Important traído por la pasada de fix) — aislado fallaba con 'cancelada Norte lun (sala ocupada)'; módulo fresco + aserción exacta, RED sin trim → GREEN aislado, suite 6/6 (ba9d768)
Final: Ruling: anular/voidBooking fuera del diff (Re-revisión, fuera de alcance) — la spec lo deja en 0011 (spec.md:34); no se toca — coste si falla: ninguno en la 0010
Final: sin revisar: ba9d768 — reescribe el test de espacios (solo test/cancel.test.js)
