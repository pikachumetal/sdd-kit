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
- AND una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita, salvo `<!-- kit: incluye <nombre> -->`, que para el build con `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código`; un `<!-- kit:` con texto delante o detrás dentro de un bloque de código se copia tal cual
- AND una `<!-- kit: incluye <nombre> -->` en el texto no se quita: el build la sustituye antes de quitar las demás marcas
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
- AND cada `from` de una entrada se compara igual, con su propia fuente y versión, y su línea nombra el `kit` de la entrada
- AND en una copia sin `pending`, `<kit>` es su único fichero

### Quien tiene la 2.3.4 actualiza sin pasos

- GIVEN un proyecto con la 2.3.4 instalada desde `"source": "."`
- WHEN Claude Code refresca el marketplace y actualiza el plugin a una versión con `"./dist"`
- THEN la caché de la versión nueva tiene solo lo de «Lo que viaja en el plugin»
- AND la carpeta de la 2.3.4 queda marcada con `.orphaned_at`, que Claude Code borra a los 14 días, sin nada que hacer en el proyecto

### Una skill que remite a su NOTICE lo tiene

- GIVEN `skills/sdd-grilling/SKILL.md` con «(MIT, see `NOTICE`)» y `sdd-grilling` solo con una entrada `concept` en `upstream.json`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-grilling/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`
- AND la forma sin comillas invertidas, «see NOTICE», cuenta igual

### La versión de una fuente no se escribe en el texto de una skill

- GIVEN `skills/sdd-tdd/SKILL.md:10` con «… of superpowers 7.0.0»
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-tdd/SKILL.md:10: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»`
- AND vale para la clave o el `repo` de cada fuente: «`wondelai/skills` 1.8.0» falla igual
- AND «superpowers.** Desde la v2.0.0», en `migrations/v2.0.0.md`, no falla: `migrations/`, los `NOTICE` y las marcas `<!-- kit: … -->` no cuentan

### Una inclusión se escribe una vez y el build la expande

- GIVEN `includes/user-language.md` con «Write everything the user reads in the language of their message.» y `skills/example-a/SKILL.md` con la línea `<!-- kit: incluye user-language -->` en su texto y una `<!-- kit: 0186 -->` más abajo
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/example-a/SKILL.md` lleva el contenido de `includes/user-language.md` en el sitio de la inclusión, sin la otra marca, y lo demás byte a byte
- AND `dist/` no tiene `includes/`
- AND una inclusión cuyo fichero no existe para el build con `skills/example-a/SKILL.md:<línea>: la inclusión user-language no existe: crea includes/user-language.md`, y `dist/` no cambia
- AND un `includes/<nombre>.md` con una línea `<!-- kit: … -->` para el build con `includes/<nombre>.md: una inclusión no lleva marcas del kit`
- AND en una copia, la inclusión sigue «Una copia incluye dentro de un bloque del kit»

### Una frase del kit repetida en otra skill da rojo

- GIVEN `skills/example-a/SKILL.md` y `skills/example-b/SKILL.md`, propias, cada una con «Write everything the user reads in their language, skill announcements included.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/SKILL.md:<línea> y dist/skills/example-b/SKILL.md:<línea> repiten «write everything the user reads in their language skill announcements»: déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla`
- AND una palabra es `[\p{L}\p{N}'’-]+`, en minúsculas; repetida es una racha de 10 palabras seguidas en dos carpetas distintas de `dist/skills/`, fuera del frontmatter, de los bloques de código y del código en línea
- AND la racha no cruza una línea en blanco, un elemento de lista, un título ni una celda de tabla, y sí las líneas partidas de un mismo párrafo
- AND una racha de 12 palabras da una sola línea; dos rachas separadas en la misma pareja dan dos
- AND con la misma racha en tres skills, la línea nombra los tres sitios, ordenados por ruta
- AND dos copias anotadas que comparten una racha, en su original o en sus bloques del kit, no dan rojo; el bloque del kit de una copia que repite una propia sí lo da
- AND la racha que entra por `<!-- kit: incluye user-language -->` en dos skills, propias o copias, no da rojo; la misma racha escrita a mano en una tercera, propia o en un bloque del kit de una copia, sí
- AND una racha repetida entre el `SKILL.md` de una skill y sus `references/`, o dentro de `sdd-templates/templates/` o de `sdd-upgrade/references/migrations/`, no da rojo
- AND una copia con `pending` cuenta entera como texto del kit

### Una absoluta con su excepción en la misma frase da rojo

- GIVEN `skills/example-a/SKILL.md`, propia, con «The validation is never removed, except with `validation.mode: field`, which does it in the field.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/SKILL.md:<línea>: absoluta con excepción en la misma frase («never» … «except»): sustituye la regla por una que ya diga su caso`
- AND las absolutas son `only`, `never`, `always`, `must` y `every`, y las excepciones `except`, `unless` e `instead of`, como palabras enteras y sin distinguir mayúsculas
- AND la frase acaba en `.`, `?` o `!` seguidos de espacio o de fin de línea, o al acabar el párrafo, el elemento de lista o la celda; no la cortan `e.g.`, `i.e.`, `etc.` ni `vs.`, ni un punto dentro de una cita «…»
- AND «Never skip the gate, e.g. for a typo, unless the user asks.» da rojo; la absoluta en una frase y la excepción en la siguiente, no
- AND el código en línea y los bloques de código no cuentan, y una frase del original de una copia, fuera de sus bloques del kit, tampoco
- AND en `includes/<nombre>.md` el aviso nombra `includes/<nombre>.md:<línea>`

### La prosa en castellano de una skill da rojo

- GIVEN `skills/example-a/references/profiles.md:7` con «- **`pair`** — para en todos los gates de la tabla.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/references/profiles.md:7: prosa en castellano; las skills van en inglés: «- **`pair`** — para en todos los gates de la tabla.»`
- AND una línea corta como `## Restricciones de código` también da rojo
- AND «Open with `Ahora: <qué haces>` and a counter like «van 7 de 15».», con el castellano solo en código en línea y en una cita «…», no da rojo
- AND quedan fuera `sdd-templates/templates/`, el frontmatter salvo la `description`, los bloques de código, el código en línea y las citas «…»
- AND en `includes/<nombre>.md` el aviso nombra `includes/<nombre>.md:<línea>`

### Lo que dice kit:own

- GIVEN el kit con rojos de las tres clases (repetida, absoluta con excepción y castellano)
- WHEN corre `moon run kit:own`
- THEN lee `skills/` y `includes/` con las inclusiones expandidas, sin reconstruir `dist/`, escribe una línea por rojo y sale con código 1
- AND sin ningún rojo escribe `Skills al día: <n> ficheros.`, con `<n>` los `.md` de `skills/` y de `includes/` que mira, y sale con 0
- AND corre en el pre-commit y en la CI, y un rojo para el commit

### Ninguna skill ni ninguna fase pasa de su tamaño

- GIVEN `skills/example-a/SKILL.md`, que sale del build con 20.000 bytes
- WHEN corre `moon run kit:skill-size`
- THEN da `FALLA: dist/skills/example-a/SKILL.md ocupa 20000 bytes (límite: menos de 20000)` y sale con código 1
- AND mide cada `SKILL.md` de `skills/` con sus marcas quitadas y sus inclusiones expandidas, como sale del build, sin reconstruir `dist/`
- AND con una skill `lead` de 20.000 caracteres que manda invocar cinco skills de 19.000 (`a`, `b`, `c`, `d`, `e`), da `FALLA: la fase de lead (a, b, c, d, e) suma 115000 caracteres (límite: 100000)`
- AND cada skill de la fase cuenta como mín(caracteres, 20.000), y una fase de 100.000 exactos pasa
- AND manda invocar una skill del kit entre comillas invertidas, con o sin `sdd-kit:`, precedida de «invoke», «load» o «**REQUIRED SUB-SKILL:**», o seguida en la misma frase y sin otro código en medio de «with `Skill`» o «with the `Skill` tool»; en «closing in `example-b`: invoke `example-c` with `Skill`» cuenta `example-c` y no `example-b`
- AND una skill nombrada sin ninguna de esas formas, o dentro de un bloque de código, no cuenta, y solo cuentan las invocaciones directas, no las de las skills invocadas
- AND sin rojos escribe `OK: todos los SKILL.md ocupan menos de 20000 bytes` y `OK: ninguna fase pasa de 100000 caracteres (la mayor, <skill>: <n>)`, y sale con 0
- AND corre en el pre-commit y en la CI, y un rojo para el commit

### Las comprobaciones de las skills corren en el commit y en la CI

- GIVEN un clon con `core.hooksPath` en `.githooks`, `SDD_UPSTREAM_DIR` sin definir, y staged un cambio a `skills/example-a/SKILL.md` que escribe a mano «Write everything the user reads in their language, skill announcements included.», ya escrita en `skills/example-b/SKILL.md`, propia
- WHEN se ejecuta `git commit`
- THEN el pre-commit corre `kit:own` y `kit:skill-size` además de `cli:typecheck`, `cli:test` y `kit:roadmap`, y `kit:copies` porque el commit toca `skills/`; el commit no entra, y la salida lleva la línea «… repiten «write everything the user reads in their language skill announcements»: …» de `kit:own` y `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.` de `kit:copies`
- AND un commit staged que solo toca `.docs/` no corre `kit:copies` (lo decide `git diff --cached --name-only`: `skills/`, `includes/` o `upstream.json`) y entra sin la variable
- AND con la variable y un clon sin el tag que pide `upstream.json`, un commit que toca `skills/` no entra, con `<fuente>: falta <versión> en el clon <ruta>`
- AND en cada push a `develop`, `feature/**` y `patch/**`, la CI clona cada `repo` de las `sources` de `upstream.json` con sus tags en `$RUNNER_TEMP/upstream`, exporta `SDD_UPSTREAM_DIR` y corre `kit:copies`, `kit:own` y `kit:skill-size` junto a su suite; un rojo de cualquiera deja el run en `failure`

## Reglas de la capacidad

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja, y en los avisos que salen de él; nunca en el texto de una skill. También vive allí si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`. Una regla que necesitan dos skills, solo en `includes/<nombre>.md`, en la raíz, que no viaja: el build la pone en cada skill que la incluye; una copia la incluye dentro de un bloque del kit. Los clones de las fuentes que lee `kit:copies`, en la carpeta de `SDD_UPSTREAM_DIR`, fuera del repo; en la CI, `$RUNNER_TEMP/upstream`.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`, `pending`, `from`, `own`, `notCopied`, `includes/`, `kit:own`, `kit:dist-compare`); los campos de la marca y los mensajes, en castellano (`sustituye`, `quita`, `de`, `arregla`, `fin`, `incluye`); el `<nombre>` de una inclusión, en inglés kebab-case.
- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`; las excepciones, `except`, `unless` e `instead of`. La cita S de una marca no lleva `«`, `»` ni `-->`. Una versión escrita en el texto es la clave o el `repo` de una fuente, entre comillas invertidas opcionales, espacios y `v?N.N[.N…]` (`` `?(<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``), en un `.md` de `skills/` fuera de `migrations/`. Una frase repetida es una racha de 10 palabras en dos skills. Un `SKILL.md` de `dist/` ocupa menos de 20.000 bytes, y una fase suma 100.000 caracteres o menos, con cada skill contada como mín(caracteres, 20.000). Un bloque `add` o `sustituye` se come el original con 2 líneas seguidas o más, sin contar las en blanco, iguales a las de su sitio. Una línea literal de un `own` tiene 70 caracteres o más sin los espacios de los bordes.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código` · los de la inclusión del requisito «Una inclusión se escribe una vez y el build la expande» · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` de los requisitos «El corte compara cada entrada del registro con su fuente» y «Un fichero propio no lleva líneas literales de una fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Un bloque del kit que se come el original da rojo», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · los de `kit:dist-compare` del requisito «La comparación de dist/ nombra lo que cambia de forma» · los de `kit:own` de los requisitos «Una frase del kit repetida en otra skill da rojo», «Una absoluta con su excepción en la misma frase da rojo», «La prosa en castellano de una skill da rojo» y «Lo que dice kit:own» · los de `kit:skill-size` del requisito «Ninguna skill ni ninguna fase pasa de su tamaño» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera` · `<fichero>:<línea>: la versión de una fuente vive en upstream.json, no en el texto: «<trozo>»`.
- **Regla ante conflicto**: manda la fuente (`skills/`, `includes/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original. Entre una inclusión y el mismo texto escrito a mano en otra skill manda la inclusión: el rojo es de la skill que lo escribe a mano. Entre el disco y el índice, el fin de línea de una copia lo dice el índice (`git ls-files --eol`) y el texto que se compara, el disco en LF; sin índice, el disco.
