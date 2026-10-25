# Capacidad — cli

## Propósito

la CLI del kit: cómo se invoca, qué verbos y opciones tiene, su salida y sus códigos de salida, y cómo la nombran las skills.

## Requisitos

### La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`, `validation serve`) con una línea de ayuda, y sale con 0
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
- THEN escribe el JSON de la fixture `cli/test/fixtures/hook/pending-migration.json`: el `systemMessage` de las migraciones pendientes, y `additionalContext` con ese aviso, la orden de ofrecer la migración y `using-sdd`
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
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json`, `.temp/` y `.auth/` con CRLF, y termina en salto de línea
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

### `sdd upgrade` lista las migraciones pendientes en orden SemVer

- GIVEN un kit con `v0.9.0.md`, `v0.10.0.md`, `v2.3.1.md` y `v2.3.2.md` en `skills/sdd-upgrade/references/migrations/`, y un proyecto con `"version": "0.9.0"` en `.docs/sdd/sdd-kit.json`
- WHEN se ejecuta `sdd upgrade --root <raíz>`
- THEN escribe, una por línea, las rutas absolutas de `v0.10.0.md`, `v2.3.1.md` y `v2.3.2.md`, en ese orden, y sale con 0
- AND con el marcador en `2.3.2` escribe `el proyecto ya está al día con el kit 2.3.2` y sale con 0
- AND sin `sdd-kit.json` escribe `sin sdd-kit.json: se aplican todas` y después las rutas de las cuatro, y sale con 0
- AND con la clave `init` en `sdd-kit.json` escribe `init en curso: sigue con sdd-init` y sale con 1

### `sdd upgrade --mark` escribe el marcador de una versión

- GIVEN el mismo kit y un proyecto con `sdd-kit.json` = `{"version": "2.3.1", "channel": "plugin", "updated": "2026-10-01", "ids": {"mode": "sequence"}}`
- WHEN se ejecuta `sdd upgrade --root <raíz> --mark 2.3.2` el 2026-10-18
- THEN `sdd-kit.json` queda con `"version": "2.3.2"`, `"channel": "plugin"`, `"updated": "2026-10-18"` e `ids` como estaba, y escribe `.docs/sdd/sdd-kit.json: actualizado`
- AND con `--mark 2.9.9` escribe `--mark 2.9.9: el kit no trae esa migración`, sale con 2 y no escribe
- AND con `--mark 2.3.1` escribe `--mark 2.3.1: el proyecto ya está en 2.3.1`, sale con 1 y no escribe
- AND con la clave `init` en `sdd-kit.json` escribe `init en curso: sigue con sdd-init`, sale con 1 y no escribe
- AND con `sdd-kit.json` que no es JSON escribe `.docs/sdd/sdd-kit.json no es JSON válido: no se toca`, sale con 1 y no escribe

### `sdd upgrade` rechaza un uso mal formado sin tocar nada

- GIVEN el mismo kit y proyecto
- WHEN se ejecuta `sdd upgrade --root <raíz> --mark`, `sdd upgrade --root <raíz> --mark 2.x`, `sdd upgrade --root <raíz> --mark ../x`, `sdd upgrade --root <raíz> --foo` o `sdd upgrade --root <no existe>`
- THEN cada uno escribe en stderr qué no reconoce y el uso (`uso: sdd upgrade …`), sale con 2 y `sdd-kit.json` no cambia

### `sdd validation serve` sirve el panel y guarda las marcas

- GIVEN un `pasos.json` con `[{"id": "1", "title": "libres 10:00-12:00 → «Sur»"}, {"id": "2", "title": "cancelar mie 10:00 → «no hay reserva mie 10:00»"}]`
- WHEN se ejecuta `sdd validation serve --steps pasos.json --out .temp/validation/0008.json`, sin `.temp/validation/`
- THEN crea `.temp/validation/`, escucha solo en `127.0.0.1`, en un puerto que elige el sistema, e imprime `panel: http://127.0.0.1:<puerto>/`
- AND la página lista los dos pasos con OK, KO y un comentario
- AND al marcar el paso 1 en OK, `.temp/validation/0008.json` y `GET /results` dan `[{"id": "1", "title": "libres 10:00-12:00 → «Sur»", "status": "ok", "comment": "", "markedAt": "<ISO 8601>"}, {"id": "2", "title": "cancelar mie 10:00 → «no hay reserva mie 10:00»", "status": "pending", "comment": "", "markedAt": null}]`
- AND una marca enviada con `Origin: http://evil.example` o con un `Host` que no es `127.0.0.1:<puerto>` sale con 403, y una con el id `9` o el `status` `hecho`, con 400; en los dos casos `0008.json` no cambia
- AND con un `--steps` que no existe, no es JSON, es `[]`, repite un id o tiene un `title` que no es texto, escribe en stderr `<ruta>: no es una lista de pasos {id, title}` y el uso, sale con 2 y no escucha
- AND sin `--steps` o sin `--out`, escribe qué falta y el uso (`uso: sdd validation serve --steps <fichero> --out <fichero>`), sale con 2 y no escucha
- AND `sdd validation serve --help` enseña ese uso sin escuchar y sale con 0

### El hook de cierre borra las sesiones viejas del proyecto

- GIVEN `CLAUDE_CODE_TMPDIR=<t>`, `CLAUDE_PROJECT_DIR=D:\code\facturas` y, en `<t>/claude/D--code-facturas/`, las sesiones `actual` (último fichero escrito hace 30 h), `vieja` (hace 30 h), `reciente` (hace 2 h) y `tarea` (carpeta y `notas.txt` de hace 30 h, `tasks/b1.output` de hace 10 min), el fichero suelto `leeme.txt` de hace 30 h, y `<t>/claude/D--code-otro/vieja/` de hace 30 h
- WHEN Claude Code cierra la sesión y ejecuta `hooks/hooks.json`, que llama a `sdd hook session-end` con `{"session_id":"actual","cwd":"D:\\code\\facturas","hook_event_name":"SessionEnd","reason":"other"}` por stdin
- THEN borra `<t>/claude/D--code-facturas/vieja/` y nada más: se quedan `actual`, `reciente`, `tarea`, `leeme.txt`, la carpeta `D--code-facturas/` y `D--code-otro/vieja/`
- AND no escribe nada en stdout ni en stderr y sale con 0
- AND sin `CLAUDE_CODE_TMPDIR` la base es la carpeta temporal del sistema (`%TEMP%` en Windows); sin `CLAUDE_PROJECT_DIR`, la ruta es el `cwd` del stdin
- AND `D:\code\_worktrees\sdd-kit-0180` da la carpeta `D--code--worktrees-sdd-kit-0180`: cada carácter que no es letra ASCII ni cifra, guion bajo incluido, pasa a `-`
- AND un nombre de más de 200 caracteres se recorta a 200 y gana `-` y el hash de 32 bits de la ruta (multiplicador 31, por unidades UTF-16) en base 36: la ruta de 231 caracteres de la sonda (`…\scratchpad\probe-` + 30 `a` + `_x.y`) da `…-scratchpad-probe-aaa-bjejxf`
- AND si una sesión no se puede borrar entera (un fichero en uso, una carpeta que otro proceso ya borró), deja lo que no pudo, sigue con las demás y sale con 0
- AND un enlace simbólico o un junction dentro de la carpeta del proyecto no se borra ni se sigue

### El hook de cierre no borra si una guarda falla

- GIVEN las mismas carpetas que en el requisito anterior
- WHEN `sdd hook session-end` recibe por stdin `{"cwd":"D:\\code\\facturas"}`, sin `session_id`, o un texto que no es JSON
- THEN no borra nada, escribe en stderr `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook` y sale con 0
- AND con `CLAUDE_CODE_TMPDIR=temporales`, relativa, escribe `sdd-kit: no borro los temporales de Claude Code: temporales no es una ruta absoluta`, no borra nada y sale con 0
- AND si `<t>/claude/<carpeta del proyecto>/` no existe, no escribe nada y sale con 0

## Reglas de la capacidad

- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe solo `.docs/sdd/sdd-kit.json`. `sdd validation serve` lee los pasos de `--steps` y el panel de `skills/sdd-archive/references/validation-panel.js` del kit cargado, y escribe solo el fichero de `--out`. `sdd hook session-end` lee el JSON de stdin, `CLAUDE_CODE_TMPDIR` y `CLAUDE_PROJECT_DIR`, y solo borra subcarpetas de `<CLAUDE_CODE_TMPDIR o la carpeta temporal del sistema>/claude/<carpeta del proyecto>/`.
- **Idioma de los nombres**: las opciones y las claves en inglés; los mensajes, en castellano.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto; `sdd validation serve` escucha solo en `127.0.0.1` y en un puerto que elige el sistema, acepta solo peticiones con `Host` y `Origin` de `127.0.0.1:<puerto>`, y `--steps` es una lista JSON de al menos un `{id, title}` con ids únicos y `title` de texto; `--out` es relativo al directorio de trabajo, su carpeta se crea si falta, y el fichero se escribe de nuevo al arrancar; `sdd hook session-end` borra solo las sesiones sin escrituras en las últimas 24 h, nunca la del `session_id`, y tras 1 s desde que arranca no empieza a borrar ninguna más.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`; `panel: http://127.0.0.1:<puerto>/`; `<ruta>: no es una lista de pasos {id, title}`; `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook`; `sdd-kit: no borro los temporales de Claude Code: <base> no es una ruta absoluta`; `sdd-kit: no borro los temporales de Claude Code: no sale el nombre de la carpeta del proyecto de <ruta>`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`; con `sdd upgrade --mark`, `version` es la que se marca y el resto de claves se queda; con `sdd validation serve`, un `--out` que ya existe se escribe de nuevo con los pasos de `--steps` en `pending`: cada validación empieza de cero.
