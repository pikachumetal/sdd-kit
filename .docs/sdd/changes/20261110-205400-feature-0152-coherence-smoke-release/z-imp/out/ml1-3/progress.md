# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Task 1: complete (commits 960eb9b..841f485, tests: node --test test/persist.test.js → ℹ duration_ms 376.982)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js (load/save, sin dependencias nuevas) → no sale (sin subagentes; revisado en el hilo)
Final: fixed Important — run('cancelar') escribía data/bookings.json en el cwd y la suite pasaba a depender del estado (2 fallos en la 2ª pasada) — usar run desde código no toca el disco RED→GREEN, suite 7/7 dos pasadas seguidas (222fa45)
Final: Ruling: load y save pasan de run/módulo al arranque de la CLI (`if (command)`) — el plan decía «cancelar llama a save», pero así cancel.test.js y app.test.js, que usan run en el proceso, no tocan el disco; el spec («carga al arrancar y guarda al cancelar») sigue cumplido — si se prefiere guardar dentro de run, los tests existentes necesitan un directorio temporal
Final: Ruling: añadida una 3ª prueba en test/persist.test.js (las dos del RED intactas) — reproduce el fallo del fix — cuesta tocar un fichero del RED recibido
Final: minor (deferred): cancelar sin reserva activa también reescribe data/bookings.json
Final: minor (deferred): un data/bookings.json corrupto tumba la CLI con un SyntaxError sin mensaje
