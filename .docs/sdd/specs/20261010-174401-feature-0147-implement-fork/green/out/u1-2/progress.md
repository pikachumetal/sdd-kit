# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 2: complete (commits 3ba979b..627593b, tests: node --test test/cancel.test.js → ℹ duration_ms 68.0556)
Final: minor (deferred): el test «cancelar sin reserva lo dice» desapareció en el commit de la Task 1 (3ba979b); el caso se alcanza solo con `--motivo`.
Final: minor (deferred): `cancelar <sala> <día>` sin `--motivo` responde «motivo no válido…» aunque no haya reserva; sin comillas, `--motivo sala ocupada` solo coge «sala».
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (la spec no define el caso).
Final: minor (deferred): el test del listado depende del estado que deja el primer test (estado de módulo compartido).
Final: Ruling: reservas solo en memoria, `canceladas` desde otra ejecución sale vacío — la spec y el plan no piden persistencia, es del molde base — si se quiere uso real por CLI, falta una feature de persistencia.
