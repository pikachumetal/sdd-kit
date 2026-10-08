# Capacidad — cli

## Propósito

la CLI del kit: cómo se invoca, qué verbos y opciones tiene, su salida y sus códigos de salida, y cómo la nombran las skills.

## Requisitos

### La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

### Node demasiado viejo se dice antes de ejecutar nada

- GIVEN Node 20.11.0
- WHEN se ejecuta `node sdd.js capability index --path .docs/sdd`
- THEN escribe en stderr `sdd necesita Node 22.18 o posterior; tienes 20.11.0` y sale con 2, sin un `SyntaxError` de ningún módulo de la CLI
- AND un test lo comprueba llamando a la comprobación de `sdd.js` con la versión `20.11.0` simulada

### Un verbo, una opción o un valor fuera de tope salen con 2

- GIVEN la CLI
- WHEN se ejecuta `node sdd.js capability lista`, `node sdd.js capability index --ruta x` o `node sdd.js id next --reserve --count 0`
- THEN escribe en stderr qué no reconoce o qué tope incumple y el uso del sustantivo (`sdd capability index|check|merge …`), y sale con 2

### Los verbos de datos dan JSON con `--json`

- GIVEN `.docs/sdd/capabilities/` con `bookings.md` (propósito «Reservar, consultar y cancelar salas por franja horaria.») y `rooms.md`, sin propósito
- WHEN se ejecuta `node sdd.js capability index --path .docs/sdd --json`
- THEN escribe `[{"name":"bookings","purpose":"Reservar, consultar y cancelar salas por franja horaria."},{"name":"rooms","purpose":null}]` y sale con 0
- AND sin `--json` escribe las mismas dos líneas de texto que hoy (`` - `bookings` — … `` y `` - `rooms` — (sin propósito) ``)

### El hook de sesión es un verbo de la CLI

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` en `2.2.0` y el kit cargado en `3.0.0`, con migraciones hasta la `2.3.0`
- WHEN Claude Code arranca la sesión y ejecuta `hooks/hooks.json`
- THEN escribe el JSON de la fixture `cli/test/fixtures/hook/pending-migration.json`, que es la salida del hook bash con esa entrada: `additionalContext` con `using-sdd` y el `systemMessage` de las migraciones pendientes
- AND en una sesión headless con el plugin por `--plugin-dir`, el `hook_response` del stream trae ese `additionalContext`
- AND sin `.docs/sdd/` no escribe nada y sale con 0
- AND con Node 20.11.0 escribe el mismo JSON con `sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0` añadido a `systemMessage`, y sale con 0

### Las skills solo nombran verbos que existen

- GIVEN `skills/**/*.md` y `.docs/sdd/capabilities/*.md`
- WHEN se ejecuta el test de `cli/test/docs-claims.test.ts`
- THEN cada `sdd <sustantivo> <verbo>` (o `sdd merge`, `sdd workspace`) que aparece, con o sin `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js"` delante, es un verbo de la CLI, y cada `--opción` que le sigue en la misma línea es una opción de ese verbo; los huecos `<…>` no se analizan
- AND falla si esos ficheros nombran un `.ps1` del kit, `hooks/session-start`, `task-start`, `task-done`, `task-brief`, `review-package` o `sdd-workspace` sin `sdd` delante, `cygpath` o `PLAN_FILE`
- AND no mira `.docs/sdd/specs/`, `.docs/sdd/decisions/`, `.docs/sdd/field-reports/`, `changelog.md` ni `tests/*.md`: son eventos y no se reescriben
