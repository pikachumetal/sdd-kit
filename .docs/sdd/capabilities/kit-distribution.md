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
- AND una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita; un `<!-- kit:` con texto delante o detrás dentro de un bloque de código se copia tal cual
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

### Una copia es su original más bloques del kit marcados

- GIVEN una copia anotada, sin `pending`, cuyo original es `skills/subagent-driven-development/SKILL.md` de superpowers `v7.0.0` (el fixture del experimento)
- WHEN corre `moon run kit:copies`
- THEN cada línea fuera de un bloque del kit casa, exacta y en su orden, con una línea del original, y cada tramo del original que no casa está cubierto por la S de las marcas `sustituye` o `quita` que hay entre sus dos líneas vecinas
- AND borrar la línea del original «Never start implementation on a main/master branch without your human» sin marca da `<fichero>:<línea>: falta texto del original sin marca quita: «Never start implementation on a main/master…»`, en la línea de la vecina anterior
- AND una línea que no casa, también una línea en blanco nueva que parte un párrafo, da `<fichero>:<línea>: texto que no es del original ni está en un bloque del kit`
- AND el frontmatter queda fuera de la comparación
- AND un bloque `de: Wondel <ruta>` cuyo texto, con los espacios normalizados, no está en ese original da `<fichero>:<línea>: el bloque dice de Wondel <ruta>, y su texto no está en ese original`

### Lo que sustituye una marca es lo que el bloque quita

- GIVEN la línea del original «superpowers:using-git-worktrees to create one or verify the existing one.» y un bloque `<!-- kit: d59bf7b5 · sustituye: «superpowers:using-git-worktrees» -->` con «`sdd-worktrees` to create one or verify the existing one.»
- WHEN corre `moon run kit:copies`
- THEN no da rojo: lo quitado es solo «superpowers:using-git-worktrees»
- AND con `sustituye: «superpowers:using-git-worktrees to create»` da `<fichero>:<línea>: la marca sustituye «superpowers:using-git-worktrees to create», y el bloque quita «superpowers:using-git-worktrees»`
- AND una `quita: «S»` cuya S no cuadra con lo quitado da el mismo aviso con `quita`
- AND un `…` en S salta lo de en medio: `sustituye: «Four things stop you, and only these…For those, stop and ask.»` cuadra con el párrafo entero quitado

### Una frase sustituida no queda al lado de la del kit

- GIVEN un bloque `<!-- kit: 0296 · sustituye: «Four things stop you, and only these…For those, stop and ask.» -->` cuyo contenido vuelve a decir el párrafo de la fuente y añade «The kit's own stops are a fifth class»
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>:<línea>: la marca sustituye «Four things stop you, and only these…», y el bloque vuelve a decir «Four things stop you, and only these»`
- AND una S que el original repite en otro sitio que el kit no toca no da rojo
- AND si S no está en ningún sitio del original da `<fichero>:<línea>: la marca sustituye «S», que no está en el original <ruta>@<versión>: la marca es vieja`

### Un añadido junto a una absoluta del original da rojo

- GIVEN el párrafo del original «Four things stop you, and only these: … For those, stop and ask.» y, en ese mismo párrafo, un bloque `<!-- kit: 4597d47e -->` con «The kit's own stops are a fifth class, not an exception to the four» (el A+C de `sdd-implement:18`)
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>:<línea>: añadido del kit sin sustituye en un párrafo con una absoluta del original («only»)`
- AND las absolutas son `only`, `never`, `always`, `must` y `every`, como palabra entera y sin distinguir mayúsculas, y el aviso cita la primera
- AND el mismo bloque separado del párrafo por una línea en blanco no da rojo

### La marca del kit se escribe con su gramática

- GIVEN la fuente anotada de una copia sin `pending`
- WHEN corre `moon run kit:copies`
- THEN una marca sin tarea o con un campo desconocido da `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: <campo>`
- AND `sustituye` sin contenido da `<fichero>:<línea>: la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita`
- AND `<!-- kit: fin -->` sin bloque abierto da `<fichero>:<línea>: <!-- kit: fin --> sin bloque abierto`
- AND una S con `«`, `»` o `-->` da `<fichero>:<línea>: la cita de la marca no puede llevar «, » ni -->: sáltalos con …`
- AND un `de: <fuente> <ruta>` que no está en el `from` de su entrada da `<fichero>:<línea>: el bloque dice de <fuente> <ruta>, que no está en el from de su entrada`
- AND un bloque sin `fin` acaba en la primera línea en blanco fuera de una valla, también si la valla lleva líneas en blanco dentro
- AND una marca dentro de una valla abre un bloque, que acaba en `fin` o en la marca siguiente, y sus líneas en blanco son del bloque

### Lo que dice kit:copies de cada copia

- GIVEN `upstream.json` con una copia anotada y `skills/sdd-debugging/SKILL.md` con `pending: "0312"`
- WHEN corre `moon run kit:copies`
- THEN escribe una línea por rojo
- AND un rojo dentro de un bloque con `arregla: 0307` acaba en ` → 0307`
- AND la copia con `pending` da solo `skills/sdd-debugging/SKILL.md: sin anotar → 0312`
- AND con algún rojo sale con código 1; sin ninguno, escribe `Copias al día: <n> ficheros.`, con `<n>` las copias sin `pending`, y sale con 0

### Una copia que ya no lo es da rojo

- GIVEN una copia anotada cuya salida conserva el 40 % de las frases de 6 palabras de su original base
- WHEN corre `moon run kit:copies`
- THEN da `<kit>: conserva el 40 % de su original <ruta>; por debajo del 50 % es propia: pásala a own`
- AND con el 50 % o más no da rojo

### La fuente de una copia va en LF

- GIVEN una copia sin `pending` con un `\r\n`
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>: tiene finales de línea CRLF; la fuente de una copia va en LF`
- AND una copia que no es `.md` que difiere de su original en LF da `<fichero>: no es su original <ruta>@<versión> byte a byte`
- AND `.gitattributes` lleva `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`

### Un fichero de la fuente sin mapear da rojo

- GIVEN una copia anotada cuyo original es `skills/subagent-driven-development/SKILL.md`, subida a `v7.0.1`, versión que añade `skills/subagent-driven-development/references/fix-loop.md`, sin mapear en `upstream.json`
- WHEN corre `moon run kit:copies`
- THEN da `superpowers@v7.0.1: skills/subagent-driven-development/references/fix-loop.md está en la carpeta de una copia y no en upstream.json: mapéalo en paths, from o notCopied`
- AND un original que ya no existe en su versión da `<kit>: su original <ruta> no existe en <versión>`
- AND con un tag que no está en el clon da `superpowers: falta v7.0.1 en el clon <clon>`, sin ir a la red

### Actualizar una copia es fusionarla con git merge-file

- GIVEN la fuente anotada de `subagent-driven-development/SKILL.md` de `v7.0.0` con los seis bloques del experimento de la review
- WHEN corre `moon run kit:copies-update -- superpowers v7.0.1`
- THEN fusiona con `git merge-file -L kit -L v7.0.0 -L v7.0.1 <fuente anotada> <original v7.0.0> <original v7.0.1>`, en LF, escribe `<kit>: v7.0.0 → v7.0.1, 2 conflictos` y cambia su `version` en `upstream.json`
- AND los dos conflictos son el del bloque que tocaron los dos (B4) y el de la sección que la 7.0.1 movió a `references/fix-loop.md` (B5), cada uno con su línea `<kit>:<línea>: conflicto con el bloque 4597d47e; si te quedas con la versión de la fuente, el bloque se pierde`; los otros cuatro fusionan solos
- AND `kit:copies` da `<fichero>:<línea>: conflicto de git merge-file sin resolver` mientras queden marcadores
- AND una copia cuyo original base no existe en el tag nuevo no se toca: `<kit>: su original <ruta> no existe en v7.0.1: mapéalo antes de actualizar`, y su `version` no cambia
- AND un `git merge-file` que falla para la orden sin escribir ninguna copia ni el registro
- AND una copia con `pending` no se toca

### Cada fichero de skills/ es copia o propia

- GIVEN `skills/sdd-tdd/references/writing-e2e.md`, que no está en ningún `kit` de una copia ni bajo `own`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-tdd/references/writing-e2e.md no está clasificado en upstream.json: ponlo en una entrada copy o en own`
- AND un fichero en una copia y bajo `own` a la vez falla igual
- AND los `NOTICE` no cuentan, y un fichero bajo la carpeta `kit` de una copia con `pending` está clasificado
- AND una entrada `copy` sin `pending` con más de un fichero en `kit` o más de una ruta en `paths` falla con `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero`

### Una skill que remite a su NOTICE lo tiene

- GIVEN `skills/sdd-grilling/SKILL.md` con «(MIT, see `NOTICE`)» y `sdd-grilling` solo con una entrada `concept` en `upstream.json`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-grilling/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`
- AND la forma sin comillas invertidas, «see NOTICE», cuenta igual

## Reglas de la capacidad

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja; también si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`, `pending`, `from`, `own`, `notCopied`); los campos de la marca y los mensajes, en castellano (`sustituye`, `quita`, `de`, `arregla`, `fin`).
- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`. La cita S de una marca no lleva `«`, `»` ni `-->`.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`.
- **Regla ante conflicto**: manda la fuente (`skills/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original.
