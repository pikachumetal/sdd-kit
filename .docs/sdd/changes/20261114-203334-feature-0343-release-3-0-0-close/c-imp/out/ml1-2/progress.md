# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md

Pre-flight scan (1 task, no pairs de tasks que compartan fichero/interfaz):
| Task 1 | texto coherente: tests (cancelar+libres entre ejecuciones) vs código (store.js + app.js); crea store.js, modifica app.js | limpio |
Task 1: complete (commits b9c8d28..ecb0415, tests: node --test test/persist.test.js → ℹ duration_ms 428.4118)
Final review: self-review (no subagent tool) — ejes Spec y Código hechos en el hilo; Arquitectura: ver línea siguiente
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js → sale, hecho en el hilo (architecture.md solo fija «un solo fichero de entrada»: store.js no lo contradice, es un módulo importado por app.js)
Final: Ruling: Eje Arquitectura sin subagente — revisado por el autor — un reviewer fresco podría objetar el segundo módulo — bajo
Final: fixed la suite completa no se podía repetir (cancel.test.js escribía data/bookings.json en la raíz y la 2.ª pasada de node --test fallaba 2 tests) — RED observado (2.ª pasada: 4/6), GREEN en 2 pasadas seguidas 6/6, suite 6/6 [38130fe]
Final: Ruling: cancel.test.js editado (fichero fuera de los «Ficheros» del plan, aserciones intactas) — sin ello el gate de cierre no es repetible — si se prefiere, un override del directorio del almacén por variable de entorno, que sería ampliar el alcance
Final: minor (deferred): load() lanza si data/bookings.json está corrupto
Final: minor (deferred): anular no persiste (la spec solo cubre cancelar)
Final: sin revisar: 38130fe — test de aislamiento de cancel.test.js (>20 líneas de test, sin subagente para la re-revisión)
