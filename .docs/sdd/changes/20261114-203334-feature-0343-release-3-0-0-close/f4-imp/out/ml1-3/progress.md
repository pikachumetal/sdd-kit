# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
| pre-flight | una sola task, sin pares de tasks ni ficheros compartidos | sin hallazgos |
Task 1: Ruling: el save va en el punto de entrada de la CLI, no en run() — cancel.test.js llama a run('cancelar') en proceso y escribiría data/ en la raíz, rompiendo la segunda pasada — si me equivoco, otro punto de entrada que llame a run no guardaría
Task 1: complete (commits e7cfcb5..8ccc41e, tests: node --test test/persist.test.js → ℹ duration_ms 321.4894)
Final: Revisión final: self-review (no subagent tool), sobre 8ccc41e
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js; sin dependencias; contrato load/save → sale como pasada propia
Final: Ruling: Eje Arquitectura sin línea en el plan, lo reviso yo — store.js no contradice architecture.md (Node sin dependencias, app.js único punto de entrada) — si me equivoco, una frontera de módulo sin revisar por un contexto fresco
Final: Spec: el THEN y el AND de la spec se cumplen (persist.test.js 2/2); sin hallazgos
Final: Código: sin Critical ni Important
Final: minor (deferred): load() lanza si data/bookings.json está corrupto
Final: minor (deferred): app.js llama a load() al importarse, así que un import en proceso lee data/ del directorio actual
Final: minor (deferred): cancelar sobre una reserva inexistente también escribe el fichero
