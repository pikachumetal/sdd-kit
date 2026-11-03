# Capacidad — kit-distribution

## Propósito

Qué viaja en el plugin instalado, cómo sale de la fuente y de dónde salen los avisos de terceros.

## Requisitos

### Lo que viaja en el plugin

- GIVEN el marketplace del kit con `"source": "./dist"`
- WHEN un proyecto instala `sdd-kit@sdd-kit` o lo actualiza
- THEN la carpeta de esa versión en `~/.claude/plugins/cache/sdd-kit/sdd-kit/` tiene solo `.claude-plugin/plugin.json`, `agents/`, `cli/bin/`, `cli/src/`, `cli/package.json`, `hooks/`, `skills/`, `LICENSE` y `THIRD_PARTY_NOTICES.md`
- AND no tiene `.docs/`, `tests/`, `cli/test/` ni ninguna línea `<!-- kit: … -->`

### La skill que carga el agente sale limpia del build

- GIVEN `skills/sdd-tdd/SKILL.md` con una línea `<!-- kit: 0186 · sustituye: «…» -->` encima de un bloque
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/sdd-tdd/SKILL.md` es esa fuente sin esa línea, y lo demás byte a byte
- AND una fuente sin marcas sale idéntica en `dist/`
- AND un `<!-- kit:` dentro de un bloque de código se copia tal cual
- AND una línea con `<!-- kit:` y texto delante o detrás, sin cerrar, o en el frontmatter, para el build con `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`, y `dist/` no cambia

### dist/ es lo que sale del build

- GIVEN un commit que cambia `skills/sdd-verify/SKILL.md` sin reconstruir `dist/`
- WHEN corre `cli:test`, en el pre-commit o en la CI
- THEN falla con `dist/ no es lo que sale del build: ejecuta moon run kit:build` y la ruta `dist/skills/sdd-verify/SKILL.md`
- AND tras `moon run kit:build`, también después de subir la versión en `.claude-plugin/plugin.json`, el mismo commit pasa
- AND un fichero ignorado por git dentro de `skills/` (un `node_modules/`) no entra en `dist/`

### Los avisos de terceros salen del registro de fuentes

- GIVEN `upstream.json` con la copia de `test-driven-development` de superpowers `v7.0.0` en `skills/sdd-tdd/`
- WHEN alguien edita a mano `skills/sdd-tdd/NOTICE` para que diga `7.0.1`
- THEN `cli:test` falla con `skills/sdd-tdd/NOTICE no es lo que sale de upstream.json: ejecuta moon run kit:notices`
- AND `moon run kit:notices` vuelve a escribir `THIRD_PARTY_NOTICES.md` y los `NOTICE` desde el registro

### El corte compara cada entrada del registro con su fuente

- GIVEN un concepto de OpenSpec revisado en `v1.16.0`, con sus rutas, y un tag `v1.17.0` en el clon
- WHEN corre `moon run kit:upstream`
- THEN si `v1.17.0` no toca esas rutas, pasa y escribe `Fuentes al día: <n> entradas.`
- AND si las toca, falla con `OpenSpec · <kit>: v1.16.0 → v1.17.0, cambian sus rutas: git -C <clon> diff v1.16.0 v1.17.0 -- <rutas>`
- AND si una ruta no existe en `v1.17.0`, falla con `OpenSpec · <kit>: la ruta <ruta> no existe en v1.17.0`
- AND si `v1.16.0` no está en el clon, falla con `OpenSpec: falta v1.16.0 en el clon <clon>`
- AND una entrada cuya `version` es un commit (`85f83d3`) se compara igual, contra el último tag de su fuente
- AND sin `SDD_UPSTREAM_DIR`, falla con `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`

### Quien tiene la 2.3.4 actualiza sin pasos

- GIVEN un proyecto con la 2.3.4 instalada desde `"source": "."`
- WHEN Claude Code refresca el marketplace y actualiza el plugin a una versión con `"./dist"`
- THEN la caché de la versión nueva tiene solo lo de «Lo que viaja en el plugin»
- AND la carpeta de la 2.3.4 queda marcada con `.orphaned_at`, que Claude Code borra a los 14 días, sin nada que hacer en el proyecto

## Reglas de la capacidad

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja. La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`); mensajes en castellano.
- **Límites**: no aplica.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente».
- **Regla ante conflicto**: manda la fuente (`skills/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano.
