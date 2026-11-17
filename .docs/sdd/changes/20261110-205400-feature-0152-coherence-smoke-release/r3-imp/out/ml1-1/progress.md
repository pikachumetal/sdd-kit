# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md

Pre-flight: una sola task → sin pares de tasks que compartan fichero; la Task 1 es coherente consigo misma (tests RED ya escritos, ficheros: src/store.js nuevo, src/app.js).
Ruling: trabajo en el checkout actual, ya en la rama feature/0036-saved-cancellations (no main) — el RED sin commitear vive aquí y un worktree nuevo lo perdería — si falla, el RED se copia a mano
Ruling: constitution sin operations.md, gate de cierre = node --test (baseline verde 4/4 en worktree detached) — es el único declarado — nada
Task 1: complete (commits 6b8288e..01944fa, tests: node --test test/persist.test.js → ℹ duration_ms 288.5223)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js (sin dependencias nuevas; architecture.md solo fija «un solo fichero de entrada», que sigue siendo app.js) → no sale
Final: Ruling: Eje Arquitectura sin línea en el plan, decidido en el despacho: no — store.js no añade dependencia ni contrato entre módulos más allá de load/save — si falla, un segundo módulo de persistencia habría que moverlo
Final: Spec: sin hallazgos — los dos THEN/AND de la spec tienen test verde (persist.test.js 2/2), la salida de los comandos no cambia y no se guarda más que las reservas
Final: Ruling: `anular` no persiste su cambio — la spec solo habla de `cancelar` y su «No entra» excluye lo demás — si falla, una anulación se pierde entre ejecuciones
Final: minor (deferred): `load` lanza si data/bookings.json está corrupto y la CLI cae al arrancar
Final: minor (deferred): `cancelar` sin reserva también reescribe data/bookings.json con el estado sin cambios
Final: minor (deferred): app.js llama a `load` al importarse, así que un data/bookings.json en el cwd afecta a los tests que lo importan en proceso
Final: fixed cancelar guardaba desde run() y cancel.test.js dejaba data/bookings.json en la raíz, así que la 2.ª pasada del gate fallaba 4/6 — run no escribe en disco: solo la CLI guarda RED→GREEN, suite 7/7 dos pasadas seguidas (commit fce583d)
Final: Ruling: save movido de run() a la entrada de la CLI, en vez de «cancelar llama a save» del plan — la spec solo exige que la segunda ejecución vea la cancelación y así los tests en proceso no ensucian el cwd — si falla, otro llamador de run() no persistirá
Final: Ruling: el minor «load en el import» queda como riesgo aceptado — la spec fija data/bookings.json relativo al cwd — un data/bookings.json en la raíz (CLI a mano) rompe cancel.test.js
Final: sin revisar: fce583d — mueve el guardado a la entrada de la CLI y añade test/store.test.js (sin subagente para la re-revisión)
