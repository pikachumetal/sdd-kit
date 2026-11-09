# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits e2b72f7..6e30a05, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 6e30a05..9f86c5d, tests: node --test test/cancel.test.js → 3/3 pass)
Final review: Ruling: menor de spec (test de canceladas dependía del orden) arreglado con GIVEN propio en el test; añado el test del AND «sin --motivo», que la revisión de spec no echó en falta — commit test(bookings) tras 9f86c5d, entra en la re-review única
Final review: Ruling: tasks.md no estaba commiteado y Task 1 apuntaba a 9f86c5d; corregido a 6e30a05 y commiteado (doc <20 líneas, revisado en el hilo)
Final review: Desvío: Important de código (recortar espacios del motivo) cambia qué motivos se aceptan, fuera del AND «fuera de la lista» — parado, enmienda sin commitear en spec.md
Final review: Desvío: Minor de código (separador « - » por cp850) contradice el THEN «Norte lun — sala ocupada» y la decisión 4 — parado, enmienda sin commitear en spec.md
Final review: re-review única de 9f86c5d..HEAD pendiente hasta la decisión del dev-lead, para que cubra las enmiendas
