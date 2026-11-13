# SDD ledger — plan: .docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations/plan.md
Pre-flight scan: una sola task; sin pares de tasks que compartan fichero o interfaz. Task 1: su texto es coherente (crea src/store.js, modifica src/app.js; el test ya existe).
Task 1: Ruling: base check sin rama de integración distinta de la actual con cambios; sin remoto — sin solape — nada que frenar
Task 1: Ruling: save va en el punto de entrada de la CLI (tras run de 'cancelar'), no dentro de run — con save dentro de run, cancel.test.js (en proceso) escribía data/bookings.json en la raíz y la 2ª ejecución de node --test fallaba (2 tests); así run sigue pura y los tests existentes no se tocan — si me equivoco, un llamador en proceso de run('cancelar') no persiste
Task 1: complete (commits a9dbb2c..9eb6fd4, tests: node --test test/persist.test.js → ℹ duration_ms 264.9823)
Final review: self-review (no subagent tool) — sin herramienta de subagentes en este harness; ejes Spec, Código y Arquitectura leídos como pasadas separadas sobre a9dbb2c..9eb6fd4
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: módulo nuevo src/store.js (sin dependencia nueva en manifiesto, sin contrato entre módulos más que load/save) → sale (autorrevisado)
Final: Spec: THEN «Norte, Sur» tras cancelar en otra ejecución y AND «Sur» sin cancelaciones, ambos cubiertos por test/persist.test.js en verde; Scope respetado (solo store.js y app.js; salida de comandos intacta) — sin hallazgos
Final: Código: sin Critical ni Important
Final: minor (deferred): `anular` no persiste (solo `cancelar`, como fija la spec); una anulación se pierde entre ejecuciones
Final: minor (deferred): un data/bookings.json corrupto hace que la CLI falle al arrancar con la excepción de JSON.parse, sin mensaje en castellano
Final: minor (deferred): load(fallback) lee data/ del directorio actual al importar app.js; ejecutar `cancelar` a mano en la raíz del repo deja data/bookings.json (ignorado por git) que sí afecta a node --test local
