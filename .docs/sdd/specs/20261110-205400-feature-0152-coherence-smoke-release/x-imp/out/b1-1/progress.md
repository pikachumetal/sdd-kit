# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

Ejecución: native (plan). Effort: aún sin dispatch; se comprueba antes de la revisión final. Workspace en sitio: checkout normal en feature/0027-free-rooms-empty, sin worktree aparte. Baseline `node --test` en worktree detached: 4/4 verde.

## Pre-flight scan

| Qué | Comprobado | Resultado |
| --- | --- | --- |
| Pares de tasks que comparten fichero/interfaz | 1 sola task | sin pares |
| Task 1 contra sí misma | Tests RED en test/free.test.js consumen `run`; Ficheros Crear test/free.test.js, Modificar src/app.js y README (solo línea de `libres`) | coherente; el GIVEN (Norte y Sur ocupadas) no se puede montar solo con `run` → Ruling de Task 1 |
| Restricciones globales | texto de interfaz en castellano | `sin salas` en castellano: ok |

Task 1: Ruling: base — develop cambió README.md línea 17 (§Soporte, f25ccd3); la task toca la línea 11 (§Comandos) — sin solapamiento, sigo — si me equivoco, conflicto de merge trivial en README al cerrar.
Task 1: Ruling: el GIVEN «Norte y Sur ocupadas» no se puede crear con `run` (`reservar` no guarda reservas) — añado a los datos de ejemplo de src/app.js dos reservas activas (Norte y Sur, mie 16:00-18:00) en una franja que ningún test existente usa, en vez de exportar el array solo para el test — si me equivoco, `libres 16:00-18:00` del CLI pasa de «Norte, Sur» a «sin salas» con los datos de ejemplo; se revierte quitando las dos filas y montando el GIVEN de otro modo.
Task 1: RED copia en scratchpad/kit-x-0152/red-0027/free.test.js; `git diff --no-index` contra test/free.test.js: idéntica. RED 1: actual 'Norte, Sur' (falta GIVEN); RED 2 con GIVEN: actual '' vs 'sin salas'.
Task 1: complete (commits 1ad8a3a..b3bbcd8, tests: node --test → ℹ duration_ms 154.5532)
