# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Pre-flight scan
| Par/Task | Produce vs consume | Hallazgo |
| --- | --- | --- |
| Task 1 (única, sin pares) | Consume `handlers`/`commands`; produce `ayuda` en `handlers` | Conflicto interno: `ayuda` en `handlers` + `commands = Object.keys(handlers)` rompe `test/readme.test.js` (README no documenta `ayuda`; README es «No entra», de la 0020) |
| Task 1 texto propio | Tests `test/ayuda.test.js` vs código en `src/app.js` | Coherente; ficheros declarados bastan |

Ruling: trabajo en sitio sobre `feature/0018-help` (checkout normal, no main, sin preferencia de worktree declarada) — el baseline corrió en un worktree desacoplado, 5/5 verde — si es erróneo, se mueve la rama a un worktree sin coste.
Task 1: Ruling: `ayuda` entra en `handlers` pero `commands` la excluye (`Object.keys(handlers).filter(c => c !== 'ayuda')`) — la spec manda: README «No entra» y el test de README debe seguir verde; la interfaz del plan («commands = Object.keys(handlers)») choca con eso — si es erróneo, la 0020 debe incluir `ayuda` en `commands` al documentarla en el README.
Task 1: complete (commits 09db6cf..de150d4, tests: node --test → ℹ duration_ms 122.9301)
Final: Revisión final: self-review (no subagent tool) — sin herramienta de subagentes en la sesión; ejes Spec, Código y Arquitectura leídos por el hilo, más débil que contextos frescos.
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo nuevo, sin dependencia en manifiesto, sin dato; `commands` sigue siendo el contrato que lee `test/readme.test.js`) → no sale
Final: Spec: THEN cumplido (cuatro comandos en `<comando>: <frase>`), README intacto, otros comandos sin cambios; Review Focus vacío. Sin hallazgos.
Final: Ruling: `ayuda` no se lista a sí misma — la spec enumera libres, reservar, cancelar y anular, y `commands` la excluye por el ruling de Task 1 — si es erróneo, añadir una línea `ayuda: …` a `phrases` y a `commands` junto con el README de la 0020.
Final: minor (deferred): `phrases` es una segunda tabla paralela a `handlers`; un comando nuevo sin frase quedaría fuera de la ayuda sin aviso.
Final: Código: sin hallazgos Critical ni Important; restricciones de código cumplidas (castellano, sin comentarios).
