# Capacidad — cli

## Propósito

la CLI del kit: cómo se invoca, qué verbos y opciones tiene, su salida y sus códigos de salida, y cómo la nombran las skills.

## Requisitos

### La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `init`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
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

### Cada verbo enseña su uso con `--help` sin ejecutarse

- GIVEN la CLI
- WHEN se ejecuta `node sdd.js <sustantivo> <verbo> --help` (o `node sdd.js merge --help`, `node sdd.js workspace --help`) con cualquier verbo registrado
- THEN escribe `uso: sdd <sustantivo> <verbo>` con sus opciones y argumentos y su línea de ayuda, sale con 0 y no ejecuta el verbo
- AND `node sdd.js <sustantivo> --help` lista los verbos de ese sustantivo
- AND un `--help` detrás de `--` en `sdd task done` es del comando de tests, no de la CLI

### `sdd merge` sin argumentos no fusiona

- GIVEN un worktree con una rama por fusionar
- WHEN se ejecuta `node sdd.js merge` sin ninguna opción
- THEN escribe en stderr que necesita al menos una opción y el uso de `sdd merge`, sale con 2 y no fusiona

### `sdd task done` no registra una task sin commits

- GIVEN un plan y `HEAD` en el mismo commit que la `BASE` de la task, por ejemplo porque el pre-commit rechazó su commit
- WHEN se ejecuta `node sdd.js task done <plan> <n> <base> -- <comando>`
- THEN escribe en stderr `Task <n> NOT recorded: sin commits en el rango: ¿falló el pre-commit?`, sale con 1, no ejecuta el comando y no escribe en el ledger

### `sdd init` registra el progreso de la init

- GIVEN un proyecto sin `.docs/sdd/sdd-kit.json`
- WHEN se ejecutan `sdd init --root <raíz> --approved PRODUCT.md`, `sdd init --root <raíz> --config '{"ids":{"mode":"sequence"},"version":"9.9.9"}'` y otra vez `--approved PRODUCT.md`
- THEN `sdd-kit.json` es `{"init": {"approved": ["PRODUCT.md"], "config": {"ids": {"mode": "sequence"}}}}`, sin `version` ni rutas repetidas
- AND la segunda llamada dice `version: la fija sdd init, se ignora`
- AND sin `--approved`, `--config` ni `--finish`, o con dos de ellos, sale con 2 y el uso

### `sdd init --finish` escribe lo determinista de la init

- GIVEN un proyecto sin `.claude/settings.json`, con un `.gitignore` con CRLF que tiene `node_modules/` y `.superpowers/`, y un `sdd-kit.json` en curso con `init.config` = `{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}`
- WHEN se ejecuta `sdd init --root <raíz> --finish --ignore .auth/`
- THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, los dos marketplaces con `autoUpdate: true` y los dos plugins activados), igual al bloque marcado con `<!-- sdd-init: settings -->` del README
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json` y `.auth/` con CRLF, y termina en salto de línea
- AND `.docs/sdd/sdd-kit.json` tiene `version` igual a la de `.claude-plugin/plugin.json`, `channel` `plugin`, `updated` del día, `ids.mode` `sequence` y `control.profile` `delegate`, sin `init`, y es el último fichero que se escribe
- AND la salida tiene una línea por fichero con `creado` o `actualizado`, y sale con 0
- AND repetir el mismo comando deja los tres ficheros iguales y dice `sin cambios` en los tres
- AND sin `.gitignore`, lo crea con las líneas de la init
- AND con un `sdd-kit.json` de template que ya tiene `"version": "1.1.0"`, la conserva

### `sdd init --finish` fusiona `settings.json` por hoja sin pisar

- GIVEN un `.claude/settings.json` con `extraKnownMarketplaces.sdd-kit.source.repo` = `"otro/fork"`, `extraKnownMarketplaces.superpowers-marketplace.autoUpdate` = `false` y `enabledPlugins["sdd-kit@sdd-kit"]` = `false`
- WHEN se ejecuta `sdd init --root <raíz> --finish`
- THEN esas tres hojas no cambian, se añaden las que faltan del bloque, y la salida dice `extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"`, `extraKnownMarketplaces.superpowers-marketplace.autoUpdate: se deja false` y `enabledPlugins.sdd-kit@sdd-kit: se deja false`
- AND con `"autoMemoryEnabled": true`, dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`, y con `--memory-off` la deja en `false`

### `sdd init` no escribe nada si un fichero no se puede fusionar

- GIVEN un proyecto con un `.gitignore` sin `.superpowers/` y, en un caso, un `.claude/settings.json` con `{"autoMemoryEnabled": false,` (JSON roto); en otro, un `sdd-kit.json` roto con un `settings.json` válido; en otro, `{"enabledPlugins": []}`
- WHEN se ejecuta `sdd init --root <raíz> --finish`
- THEN en los tres sale con 1, ningún fichero del proyecto cambia (tampoco `.gitignore`), y dice `.claude/settings.json no es JSON válido: no se toca`, `.docs/sdd/sdd-kit.json no es JSON válido: no se toca` o `.claude/settings.json no se puede fusionar: enabledPlugins no es un objeto`
- AND con `--root` inexistente, `--config '[1]'`, `--config '{'`, `--ignore ''`, `--ignore C:/x` o `--ignore ../x`, sale con 2 sin escribir nada

## Reglas de la capacidad

- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`.
- **Idioma de los nombres**: las opciones y las claves en inglés; los mensajes, en castellano.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto ni `..`; una acción por llamada.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`.
