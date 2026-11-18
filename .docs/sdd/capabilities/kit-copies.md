# Capacidad — kit-copies

## Propósito

Las copias de las fuentes en `skills/`: cómo se marcan los bloques del kit, qué comprueba `kit:copies` y cómo se actualiza una copia.

## Requisitos

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
- AND un bloque sin `fin` antes de la marca siguiente acaba en la primera línea en blanco fuera de una valla, también si la valla lleva líneas en blanco dentro
- AND un bloque fuera de una valla con `fin` antes de la marca siguiente acaba en `fin`, y las líneas en blanco de en medio son del bloque
- AND un bloque seguido de una línea en blanco, otra marca que abre bloque y después `fin` acaba en esa línea en blanco, y el `fin` cierra el segundo
- AND una marca dentro de una valla abre un bloque, que acaba en `fin` o en la marca siguiente, y sus líneas en blanco son del bloque

### Lo que dice kit:copies de cada copia

- GIVEN `upstream.json` con una copia anotada y `skills/sdd-debugging/SKILL.md` con `pending: "0312"`
- WHEN corre `moon run kit:copies`
- THEN escribe una línea por rojo
- AND un rojo dentro de un bloque con `arregla: 0307` acaba en ` → 0307`
- AND la copia con `pending` da solo `skills/sdd-debugging/SKILL.md: sin anotar → 0312`
- AND con algún rojo sale con código 1; sin ninguno, escribe `Copias al día: <n> ficheros.`, con `<n>` las copias sin `pending`, y sale con 0
- AND cuándo corre en el pre-commit y en la CI lo dice «Las comprobaciones de las skills corren en el commit y en la CI»

### Una copia que ya no lo es da rojo

- GIVEN una copia anotada cuya salida conserva el 40 % de las frases de 6 palabras de su original base
- WHEN corre `moon run kit:copies`
- THEN da `<kit>: conserva el 40 % de su original <ruta>; por debajo del 50 % es propia: pásala a own`
- AND con el 50 % o más no da rojo

### La fuente de una copia va en LF

- GIVEN una copia sin `pending` cuyo blob del índice tiene un `\r\n` (`git ls-files --eol` da `i/crlf` o `i/mixed`), con el disco en CRLF o en LF
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>: tiene finales de línea CRLF; la fuente de una copia va en LF`
- AND una copia que no es `.md` que difiere de su original en LF da `<fichero>: no es su original <ruta>@<versión> byte a byte`
- AND `.gitattributes` lleva `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`
- AND una copia con `i/lf w/crlf` cuyo contenido en LF es su original no da ese aviso: `kit:copies` sale con 0 y `Copias al día: <n> ficheros.`
- AND una copia sin seguir por git con `\r\n` en el disco da el aviso
- AND fuera de un repo, una copia con `\r\n` en el disco da el aviso

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
- AND una copia cuyo original base `git diff --name-status -M --diff-filter=R <vieja> <nueva>` da como renombrado (`skills/writing-skills/testing-skills-with-subagents.md` → `skills/writing-skills/references/testing-skills-with-subagents.md` en `v7.0.2`) se fusiona con el original en su ruta nueva, su `paths` pasa a esa ruta y escribe `<kit>: su original <ruta> pasa a <ruta nueva> en v7.0.2`
- AND una copia cuyo original base no existe en el tag nuevo, sin renombrar, no se toca: `<kit>: su original <ruta> no existe en v7.0.1: mapéalo antes de actualizar`, y su `version` no cambia
- AND un `git merge-file` que falla para la orden sin escribir ninguna copia ni el registro
- AND una copia con `pending` no se toca

### Cada fichero de skills/ es copia o propia

- GIVEN `skills/sdd-tdd/references/writing-e2e.md`, que no está en ningún `kit` de una copia ni bajo `own`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-tdd/references/writing-e2e.md no está clasificado en upstream.json: ponlo en una entrada copy o en own`
- AND un fichero en una copia y bajo `own` a la vez falla igual
- AND los `NOTICE` no cuentan, y un fichero bajo la carpeta `kit` de una copia con `pending` está clasificado
- AND una entrada `copy` sin `pending` con más de un fichero en `kit` o más de una ruta en `paths` falla con `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero`

### Un bloque del kit que se come el original da rojo

- GIVEN la fuente anotada de `skills/sdd-x/SKILL.md` con una valla `bash` que lleva `<!-- kit: 0186 -->`, una línea del kit, una línea en blanco y dos líneas del original, `pnpm install --frozen-lockfile` y `npm ci`, sin `fin`
- WHEN corre `moon run kit:copies`
- THEN da solo `skills/sdd-x/SKILL.md:<línea de la marca>: el bloque lleva 2 líneas seguidas del original en su sitio, desde «pnpm install --frozen-lockfile»: ciérralo con <!-- kit: fin --> antes de ellas`
- AND con `<!-- kit: fin -->` antes de la línea en blanco no da rojo
- AND un bloque fuera de una valla cuyo `fin` deja dentro dos líneas seguidas de un párrafo del original da el mismo rojo
- AND un bloque `sustituye` sin `fin` que se queda las líneas del original tras su línea en blanco, como `skills/sdd-worktrees/SKILL.md` antes de `57be1a76`, da el mismo rojo
- AND un bloque con una sola línea igual a una del original en su sitio no da rojo

### La comparación de dist/ nombra lo que cambia de forma

- GIVEN `dist/skills/sdd-x/SKILL.md` en `develop` y en el árbol con las mismas palabras, y su línea 12, `  - item`, con dos espacios más de sangría en el árbol
- WHEN corre `moon run kit:dist-compare -- dist/skills/sdd-x/SKILL.md`
- THEN escribe `dist/skills/sdd-x/SKILL.md: <n> líneas con otra forma` con la línea `  + 12 «    - item»`, y sale con 1, aunque los párrafos salgan iguales
- AND dos elementos de lista juntados en una línea, o una línea en blanco doble donde `develop` tenía una, salen igual, con su línea
- AND un párrafo partido en otros saltos de línea, con la misma sangría, no cuenta
- AND con las mismas palabras y la misma forma escribe `dist/skills/sdd-x/SKILL.md: igual` y sale con 0
- AND si difieren también los párrafos, escribe `<n> párrafos distintos` con sus líneas y después la sección de forma
- AND `--base <ref>` compara con esa referencia en vez de `develop`, y una referencia que no existe da `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` y sale con 1
- AND un fichero que no está en la base cuenta como vacío

### Un fichero propio no lleva líneas literales de una fuente

- GIVEN `upstream.json` con `own: ["skills/juguete-propia/"]` y `skills/juguete-propia/SKILL.md`, cuya línea 3 tiene 80 caracteres y está igual en `a.md` del clon de `Juguete` en su último tag `v1.0.0`
- WHEN corre `moon run kit:upstream`
- THEN falla con `skills/juguete-propia/SKILL.md:3: línea literal de Juguete a.md@v1.0.0, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «<sus 6 primeras palabras>…»`
- AND la misma línea sangrada cuatro espacios en el `own` y sin sangrar en el clon da el mismo rojo
- AND una línea que solo está en la `version` de una entrada, `v0.9.0`, y no en el último tag da el rojo con `a.md@v0.9.0`
- AND una línea de menos de 70 caracteres igual a una del clon no da rojo
- AND sin ninguna línea literal escribe lo de hoy, `Fuentes al día: <n> entradas.`

### Una copia incluye dentro de un bloque del kit

- GIVEN `includes/user-language.md` y la fuente anotada de `skills/sdd-tdd/SKILL.md`, copia sin `pending`, con `<!-- kit: 0312 -->` seguida de `<!-- kit: incluye user-language -->` y de la línea «Forked from `test-driven-development` of superpowers…», en el mismo párrafo
- WHEN corren `moon run kit:copies` y `moon run kit:build`
- THEN `kit:copies` no da rojo por la inclusión, que es una línea del bloque, y `dist/skills/sdd-tdd/SKILL.md` lleva el contenido de `includes/user-language.md` en su sitio
- AND la inclusión no abre ni cierra un bloque: los bordes son los de «La marca del kit se escribe con su gramática». Justo antes del `fin` de un bloque es del bloque y no da rojo; tras la línea en blanco que cierra un bloque sin `fin`, está fuera
- AND fuera de un bloque `add` o `sustituye`, `kit:copies` da `<fichero>:<línea>: una inclusión en una copia va dentro de un bloque del kit`
- AND dentro de una valla de código de la copia, `kit:copies` da `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código`, el mismo aviso que el build
- AND en una copia `pending`, una inclusión vale en cualquier sitio del texto
- AND lo que entra por la inclusión no es texto del kit de la copia: no lo compara con su original, y no se empareja con lo mismo incluido en otra skill
