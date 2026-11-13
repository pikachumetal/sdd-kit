# SDD ledger — plan: .docs/sdd/specs/20261009-110000-feature-0013-price-module/plan.md
Pre-flight: una sola task, sin pares de tasks que compartan fichero/interfaz; su texto es coherente (crea src/price.js, modifica src/app.js). Sin conflictos.
Task 1: Ruling: trabajo en el sitio, sin worktree nuevo — GIT_DIR == GIT_COMMON pero ya en la rama feature/0013-price-module, no en main — si falla, se mueve la rama a un worktree
Task 1: Ruling: sin test RED nuevo — la spec fija «Dónde se prueba: test/price.test.js, sin cambios» (refactor, comportamiento ya cubierto por 5 tests en verde); añadir un test cambiaría esa línea de la spec — coste si falla: `priceFor` solo se prueba a través de `run('precio')`
Task 1: Ruling: las tarifas por sala viven en price.js (`rates`), `rooms` se queda en app.js para `libres` — así «sala desconocida» se decide en el módulo del precio — coste: el nombre de la sala está en dos sitios hasta la 0015
Base check: develop sin cambios en ROADMAP.md ni en ficheros de la task (develop = 48a7109, ancestro).
Task 1: complete (commits 4721d8b..908bf05, tests: node --test → ℹ duration_ms 124.6889)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: módulo nuevo src/price.js (lo declara el Scope de la spec); sin dependencia nueva, sin contrato entre módulos más allá de priceFor, sin datos → no sale; autorrevisado contra architecture.md (sin dependencias externas, un solo fichero de entrada: src/price.js lo importa app.js, no contradice)
Final: Spec — Important · contradicts · src/price.js:4 · `room in rates` acepta 'constructor'/'toString' y devuelve «NaN €» donde antes decía «sala desconocida: constructor» · «precio responde lo mismo»
Final: fixed room in rates → Object.hasOwn — reproducido a mano (node src/app.js precio constructor lun 1: NaN € → sala desconocida: constructor), suite 9/9
Final: Ruling: el fix no lleva test commiteado — la spec fija «Dónde se prueba: test/price.test.js, sin cambios» y un test nuevo la cambiaría — coste si falla: la regresión de claves heredadas no queda cubierta por la suite
Final: Ruling: sin re-revisión por subagente — no hay herramienta de subagentes y el fix es de código (no de solo docs) — coste si falla: el commit 02fd82f llega sin revisión independiente
Final: Code — sin hallazgos: sin comentarios, función de 6 líneas, sin duplicación salvo los nombres de sala (ya con Ruling)
Declined to judge: validar `hours` no numérico (NaN €) — igual que antes del refactor, la spec dice «cambiar respuestas» no entra
