---
id: 20261105-125409-feature-0315-copies-reader-and-guards
feature: 0315
proposal: 0301
title: kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo
mode: full
profile: delegate
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo

🦆 Hoy, quien anota una copia del kit puede meter dos líneas del texto original dentro de un bloque del kit, y la comprobación de copias no se queja: le pasó a `sdd-worktrees`, en su bloque de Node.js. Con esta feature esa comprobación da rojo en la marca y dice desde qué línea se come el original, y un bloque con su cierre explícito ya no se corta en la primera línea en blanco. La comparación de lo que viaja con lo de `develop` nombra además cada línea con otra sangría o con líneas en blanco de más. Y tres comprobaciones nuevas dan rojo antes de que el fallo llegue a la CI: un test que ejecuta un bloque de código leído de la fuente anotada, un enlace roto que solo existe tras el build, y un fichero propio con una línea literal de una fuente, que se quedaría sin su aviso de licencia. Ninguna skill cambia de texto: cambian las herramientas que vigilan las copias, antes de que la 0296, la 0305, la 0306 y la 0307 anoten más.

Validación: agente — `validation.mode: field` en `sdd-kit.json`; son herramientas del repo, y lo que se observa son sus rojos y sus verdes, que miden los tests.

## Capacidades

- Modificadas: `kit-distribution` — un bloque con `fin` antes de la marca siguiente acaba en `fin` (requisito «La marca del kit se escribe con su gramática»); y tres requisitos nuevos: un bloque `add` que se come el original, la comparación de `dist/` con su forma, y un `own` con una línea literal de una fuente.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec hecha: un revisor con los siete puntos (Sonnet, effort medium), pedido por el dev-lead («1», 2026-11-05) aunque la rúbrica daba ninguna — señales: contrato público (la gramática de la marca y los mensajes de `kit:copies` y `kit:upstream`, que leen la 0296 y la 0305 a la 0307), `MODIFIED` (un requisito de `kit-distribution`), área no explorada (`tests/upstream/clones.ts` y el resto de `upstream-watch.slow.test.ts` sin leer enteros) · tamaño: ~350 líneas en ~10 ficheros

### Hallazgos de la review

- **Aceptado** — Importante 1: «su sitio» sin definir, y sin orden entre la racha y «falta texto del original» → decisión 3: el sitio es el de la decisión 4 de la 0302, el tramo del original entre las dos líneas vecinas que casan fuera de los bloques; con la racha, ese rojo no sale, porque las palabras del bloque cubren el tramo (es el fallo de hoy), y la racha es el único rojo del caso. El escenario lo fija («da solo»).
- **Rechazado** — Importante 2: faltan «Dónde viven los datos» y «Regla ante conflicto» → no cambian: la plantilla pide solo las entradas que cambian, y la fusión sustituye entera la que se escribe. Los topes nuevos van en «Límites»; la racha es solo de `add` (decisión 3), así que no hay conflicto con `sustituye`.
- **Aceptado** — Importante 3: el test de lectores se detectaría a sí mismo, y «nombra una valla» es de fichero entero → decisión 7: se excluye por nombre; la condición sigue siendo de fichero, como límite declarado: un falso rojo se arregla leyendo `dist/`, que no rompe nada.
- **Aceptado** — Importante 4: el Intent promete tres comprobaciones y el delta solo trae una → decisión 12: las de las decisiones 7 y 8 son tests del repo, no comportamiento de `kit-distribution`, como la decisión 16 de la 0302, y no van al delta ni a «Avisos»; su prueba está en «Dónde se prueba».
- **Aceptado** — Importante 5: no dice qué partes del `own` se leen, ni prueba la sangría → decisión 9: todo el fichero, frontmatter, vallas y tablas incluidos, salvo las marcas de línea entera; `NOTICE` no se lee. Escenario nuevo con la línea sangrada en el `own` y sin sangrar en el clon. Una URL o un comando de 70 caracteres copiado de una fuente también es texto literal: si sale, se reescribe; el barrido de la 0312 no encontró ninguno.
- **Aceptado** — Importante 6: solo el último tag deja fuera la versión copiada → decisión 9: se busca en el último tag y en cada `version` de las entradas de esa fuente; el mensaje nombra la primera en que la encuentra, empezando por el último tag.
- **Aceptado** — Importante 7: sin salida cuando difieren párrafos y forma, ni con una base que no existe → decisión 6 y escenarios: salen las dos secciones, párrafos primero; una `--base` que no existe da `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` y sale con 1; un fichero que no está en la base cuenta como vacío.
- **Aceptado en parte** — Menor 8: falta el caso de una marca que no es `fin` antes del `fin` → escenario nuevo en el `MODIFIED`. El `- REMOVED <línea>` dentro de un `MODIFIED` es la forma de la plantilla, y se queda.
- **Rechazado** — Menor 9: «Validación: agente» sin origen → ya lo cita: `validation.mode: field`. La dependencia de `develop` la cubre la decisión 6.
- **Aceptado** — Menor 10: sin camino si la Task 1 encuentra un `add` real con racha → Scope: es un desvío y paro, con dos opciones, subir el tope de la racha o poner `arregla: <fila dueña>` en esa marca.

1. **Tres tasks, sin partir**: (1) `kit:copies`, el `Reader` y la comparación de `dist/`; (2) los lectores de `skills/`, el test nuevo y `skills.test.ts`; (3) el `own` con texto de terceros en `kit:upstream`. Las cinco piezas de la fila son herramientas del repo, en la misma superficie y sin migración.
2. **El cierre en `fin` mira hacia delante**: en el texto, una línea en blanco con un bloque abierto lo cierra salvo que la siguiente marca de línea entera sea `<!-- kit: fin -->`; entonces el bloque sigue hasta ella. Es la decisión 2 de la 0302 («Un bloque de varios párrafos, también»). Dentro de una valla no cambia nada.
3. **La racha**: un bloque `add` da rojo si su contenido tiene **2 o más líneas seguidas, sin contar las en blanco, iguales byte a byte y en el mismo orden** a líneas seguidas de lo que su sitio quita del original. El sitio es el de la decisión 4 de la 0302: el tramo del original entre las dos líneas vecinas que casan fuera de los bloques. «Falta texto del original sin marca quita» no sale en ese caso, porque las palabras del bloque cubren el tramo: la racha es su único rojo. Solo `add`, como dice la fila: un `sustituye` ya tiene su cita. Con una sola línea igual no da rojo: un ```` ``` ```` o un `fi` se repiten sin comerse nada.
4. **Mensaje de la racha**: `<fichero>:<línea de la marca>: el bloque add lleva <n> líneas seguidas del original en su sitio, desde «<primera línea, abreviada a 6 palabras>»: ciérralo con <!-- kit: fin --> antes de ellas`.
5. **La comparación de `dist/` pasa a ser una tarea del repo**, `moon run kit:dist-compare -- [--base <ref>] <rutas de dist/>…`, en `tests/copies/dist-compare.ts`, con `develop` de base por defecto. Hasta hoy era `real-copies/compare-dist.mjs` en la carpeta de la 0312, que se queda allí como historia; la 0296, la 0305, la 0306 y la 0307 usarán la tarea.
6. **Las dos comparaciones**: la de párrafos es la de `compare-dist.mjs`, igual (`<ruta>: <n> párrafos distintos` y sus líneas `  - `/`  + `). La de forma reduce cada línea a su sangría: una línea en blanco cuenta con sus bytes; fuera de una valla, una línea que abre un elemento (`-`, `*`, `+`, `1.`, `|`, `>`, `#` o una valla) cuenta con su sangría y su marcador, y las líneas seguidas de un mismo párrafo con la misma sangría cuentan como una, para tolerar los saltos de línea del original; dentro de una valla, cada línea cuenta con su sangría. Las dos secuencias se comparan por LCS, y cada diferencia sale como `  - <ref>:<línea> «<texto>»` o `  + <línea> «<texto>»`, bajo `<ruta>: <n> líneas con otra forma`. Si difieren las dos, salen las dos secciones, párrafos primero. Igual en las dos: `<ruta>: igual`. Sale con 1 si algún fichero difiere. Una `--base` que no existe da `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` y sale con 1; un fichero que no está en la base cuenta como vacío.
7. **El test de los lectores de `skills/`** (`cli/test/kit/skills-readers.test.ts`) mira cada `.ts` de `cli/test/` salvo `fixtures/` y él mismo: da rojo si el fichero lee el `skills/` del repo (`readText('skills/…')` o `join(repoRoot, 'skills…')`) y nombra una valla (tres comillas invertidas o `~~~`). Mensaje: `<test>:<línea de la lectura>: lee skills/ y ejecuta o compara un bloque de código: léelo de dist/skills/, que es lo que carga el agente`. Hoy no da rojo: los ocho ficheros de `cli/test/` que leen `skills/` no nombran ninguna valla, y `worktrees-setup.slow.test.ts` ya lee `dist/`. La valla se busca en todo el fichero, no junto a la lectura: un falso rojo se arregla leyendo `dist/`, que no rompe nada.
8. **`skills.test.ts` lee `dist/skills/` en todo el bloque por skill** (frontmatter, `description`, `@`, enlaces y `references/` huérfanos) y en el índice de `sdd-templates`. Siguen en `skills/` las que miran la fuente que se publica en el repo: la privacidad, las skills invocadas, el NOTICE de las adaptadas y la lista de superpowers del README.
9. **El `own` con texto de terceros**: `kit:upstream` lee cada fichero bajo una ruta de `own` (salvo `NOTICE`), entero, frontmatter, vallas y tablas incluidos, y busca, con `git grep -F`, cada línea de **70 caracteres o más**, sin los espacios de los bordes y sin las marcas de línea entera, en el último tag de cada fuente con entradas y en cada `version` de esas entradas; el mensaje nombra la primera en que la encuentra, empezando por el último tag. Una URL o un comando copiados de una fuente también cuentan: se reescriben. 70 es el tope del barrido de la 0312, que no encontró ninguna. Mensaje: `<fichero>:<línea>: línea literal de <fuente> <ruta>@<tag>, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «<línea abreviada a 6 palabras>»`. `build/notices.ts` y `build/sources.ts` no cambian: `kit:upstream` vive en `tests/upstream/check.ts`, y de `build/` solo usa lo que ya exportan.
10. **Docs**: `architecture.md` nombra `kit:dist-compare` en la línea de `tests/copies/`; `tech-stack.md` no cambia, porque no lista las tareas de `tests/copies/`.
11. **Mensajes y topes**, todos míos: los de las decisiones 4, 6, 7 y 9, y los topes de 2 líneas y 70 caracteres.
12. **Las decisiones 7 y 8 no van al delta**: son tests del repo, no comportamiento de `kit-distribution`, como la decisión 16 de la 0302; su prueba está en «Dónde se prueba».
- Política de modelos (solo en `delegate`): revisores de la spec, uno en Sonnet con effort medium, ya hecho · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Fusión del delta probada en una copia de `.docs/sdd` con `sdd capability merge`: sustituido «La marca del kit se escribe con su gramática»; añadidos «Un bloque del kit que se come el original da rojo», «La comparación de dist/ nombra lo que cambia de forma» y «Un fichero propio no lleva líneas literales de una fuente»; reglas «Límites», «Idioma de los nombres» y «Avisos» sustituidas. Sin rechazos.

Repaso de coherencia: «siete lectores» de la decisión 7 pasa a «los ocho lectores» (con `kit-files.ts`), y «Límites» lleva el valor vigente entero más los dos topes nuevos, porque la fusión sustituye la regla completa.

### Decisiones tomadas con el dev-lead

- Los cinco arreglos son los de la fila 0315, del triaje de los tickets de la 0312 («ok») y de la 0304 (2026-11-05: «si»).
- El cierre en `fin` es el que fija la decisión 2 de la spec de la 0302; el `Reader` de hoy la contradice, y le pasó a `skills/sdd-worktrees/SKILL.md:115-121` sin rojo (prompt de arranque, 2026-11-05).
- `skills.test.ts` pasa a leer `dist/skills/`, como `worktrees-setup.slow.test.ts` desde `35e08439`, porque las inclusiones de la 0304 (`includes/`) solo existen en `dist/` (prompt de arranque).
- El rojo del `own` con texto de terceros sale hoy en verde: la 0312 barrió los 22 `own` contra los 7 clones sin ninguna línea literal de 70 caracteres o más (prompt de arranque).
- Cada arreglo cambia código del kit, no texto de una skill (ADR 0022, regla 3) (prompt de arranque).

## Intent

Las herramientas que vigilan las copias dejan pasar fallos reales. `kit:copies` dio por buenas líneas del original metidas en un bloque del kit (`sdd-worktrees`, Task 1 de la 0312) y corta en la primera línea en blanco un bloque con `fin`; la comparación de `dist/` normaliza los espacios y no vio 72-79 líneas con otra sangría ni las líneas en blanco dobles; un test lento ejecutó un bloque de `skills/` con marcas y solo lo cazó la CI tras el cierre; `skills.test.ts` no verá el texto de una inclusión; y un `own` con texto de terceros perdería su aviso de licencia. Antes de que la 0296, la 0305, la 0306 y la 0307 anoten más copias, cada uno tiene que dar rojo. Éxito: cada escenario de abajo se ve en rojo antes del arreglo y en verde después, y `moon run kit:build kit:copies kit:upstream` y `cli:test` dan sobre las copias de `develop` lo mismo que hoy (en `kit:copies`, solo las líneas con ` → <fila>`). Fracasaría si una de las cinco piezas siguiera en verde con su caso, o si una copia anotada de hoy pasara a rojo sin fila.

## Scope

- Entra: `tests/copies/annotated.ts` (`Reader.take` y la racha en `checkSite` o `checkBlock`), `tests/copies/dist-compare.ts` nuevo y su tarea en `moon.yml`, `cli/test/kit/copies.test.ts`, `cli/test/kit/dist-compare.test.ts` nuevo, `cli/test/kit/skills-readers.test.ts` nuevo, `cli/test/kit/skills.test.ts`, `tests/upstream/check.ts`, `cli/test/kit/upstream-watch.slow.test.ts`, `.docs/sdd/architecture.md` (línea de `tests/copies/`), `capabilities/kit-distribution.md` (al cerrar, por el delta).
- No entra: anotar más copias o corregir las anotadas (0296, 0305, 0306 y 0307); que `sdd merge` vea como sucio un fichero que solo cambia de finales de línea (0318); el texto de cualquier skill; `build/notices.ts` y `build/sources.ts` (decisión 9); `real-copies/compare-dist.mjs` de la 0312, que es historia.
- Si la Task 1 encuentra en las copias de `develop` un `add` real con racha: es un desvío, y paro con dos opciones, subir el tope de la racha o poner `arregla: <fila dueña>` en esa marca.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «un bloque sin `fin` acaba en la primera línea en blanco fuera de una valla» pasa a «sin `fin` antes de la marca siguiente» | `capabilities/kit-distribution.md:105`; `tests/copies/annotated.ts:187`; `cli/test/kit/copies.test.ts:202` | delta, `MODIFIED`; Scope |
| La comparación de `dist/` sale de la carpeta de la 0312 a `kit:dist-compare` | `specs/20261104-103810-feature-0312-annotate-real-copies/real-copies/compare-dist.mjs`, su `plan.md:17,79,134,161` | decisión 5: la de la 0312 se queda como historia |
| `skills.test.ts` lee `dist/skills/` en vez de `skills/` | `cli/test/kit/skills.test.ts:7,44,75` | decisión 8; Scope |

- Filas que implementa: 0315 → `roadmap.md:150` (la fila) y las tres de deuda de `roadmap.md:717-719` que la apuntan, que cierra `sdd-archive`; las filas 0296, 0305, 0306, 0307 y 0311 (`roadmap.md:141-144,154`) la nombran solo como dependencia y no cambian. En `skills/`, `capabilities/` y los demás documentos no aparece: comprobado con `grep -rn 0315 skills .docs/sdd/capabilities .docs/sdd/*.md upstream.json moon.yml CLAUDE.md`.

## Approach

Lo decidido por el dev-lead, como lo decidió: los cinco arreglos de la fila 0315, cada uno en código del kit y con su caso en rojo antes del arreglo; `skills.test.ts` lee `dist/skills/`; el cierre en `fin` es el de la decisión 2 de la 0302.

## Dónde se prueba

- El cierre en `fin` y la racha: `checkCopy` en `cli/test/kit/copies.test.ts`, como sus tests de la gramática; además, la fuente de `skills/sdd-worktrees/SKILL.md` de antes de `57be1a76` contra su original da rojo en la marca, y la de `develop`, no.
- La comparación de forma: la función pura en `cli/test/kit/dist-compare.test.ts`, con los tres casos del ticket de la 0312 §4 (sangría, líneas juntadas, línea en blanco doble) y un salto de línea dentro de un párrafo que no cuenta; y `moon run kit:dist-compare` sobre `dist/skills/` frente a `develop`, que da `igual`.
- Los lectores de `skills/`: la función de búsqueda con un texto como el de `worktrees-setup.slow.test.ts` antes de `35e08439` (rojo) y el de hoy (verde), y la pasada por el repo (verde).
- `skills.test.ts`: experimento sin commitear, `includes/x.md` con un enlace a `references/no-existe.md` incluido en una skill propia y `kit:build`; antes del cambio `skills.test.ts` pasa, después da rojo con el enlace. Se deshace al acabar.
- El `own` con texto de terceros: `upstream-watch.slow.test.ts`, como sus casos con un clon de juguete; y `moon run kit:upstream` real, en verde.

## Términos y ADR

- Términos resueltos: racha — 2 o más líneas seguidas de un bloque `add`, sin contar las en blanco, iguales a líneas seguidas del original en su sitio.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### MODIFIED — La marca del kit se escribe con su gramática (antes: "un bloque sin `fin` acaba en la primera línea en blanco fuera de una valla")

- GIVEN la fuente anotada de una copia sin `pending`
- WHEN corre `moon run kit:copies`
- THEN una marca sin tarea o con un campo desconocido da `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: <campo>`
- AND `sustituye` sin contenido da `<fichero>:<línea>: la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita`
- AND `<!-- kit: fin -->` sin bloque abierto da `<fichero>:<línea>: <!-- kit: fin --> sin bloque abierto`
- AND una S con `«`, `»` o `-->` da `<fichero>:<línea>: la cita de la marca no puede llevar «, » ni -->: sáltalos con …`
- AND un `de: <fuente> <ruta>` que no está en el `from` de su entrada da `<fichero>:<línea>: el bloque dice de <fuente> <ruta>, que no está en el from de su entrada`
- REMOVED AND un bloque sin `fin` acaba en la primera línea en blanco fuera de una valla, también si la valla lleva líneas en blanco dentro
- AND un bloque sin `fin` antes de la marca siguiente acaba en la primera línea en blanco fuera de una valla, también si la valla lleva líneas en blanco dentro
- AND un bloque fuera de una valla con `fin` antes de la marca siguiente acaba en `fin`, y las líneas en blanco de en medio son del bloque
- AND un bloque seguido de una línea en blanco, otra marca que abre bloque y después `fin` acaba en esa línea en blanco, y el `fin` cierra el segundo
- AND una marca dentro de una valla abre un bloque, que acaba en `fin` o en la marca siguiente, y sus líneas en blanco son del bloque

#### ADDED — Un bloque del kit que se come el original da rojo

- GIVEN la fuente anotada de `skills/sdd-x/SKILL.md` con una valla `bash` que lleva `<!-- kit: 0186 -->`, una línea del kit, una línea en blanco y dos líneas del original, `pnpm install --frozen-lockfile` y `npm ci`, sin `fin`
- WHEN corre `moon run kit:copies`
- THEN da solo `skills/sdd-x/SKILL.md:<línea de la marca>: el bloque add lleva 2 líneas seguidas del original en su sitio, desde «pnpm install --frozen-lockfile»: ciérralo con <!-- kit: fin --> antes de ellas`
- AND con `<!-- kit: fin -->` antes de la línea en blanco no da rojo
- AND un bloque fuera de una valla cuyo `fin` deja dentro dos líneas seguidas de un párrafo del original da el mismo rojo
- AND un bloque `add` con una sola línea igual a una del original en su sitio no da rojo

#### ADDED — La comparación de dist/ nombra lo que cambia de forma

- GIVEN `dist/skills/sdd-x/SKILL.md` en `develop` y en el árbol con las mismas palabras, y su línea 12, `  - item`, con dos espacios más de sangría en el árbol
- WHEN corre `moon run kit:dist-compare -- dist/skills/sdd-x/SKILL.md`
- THEN escribe `dist/skills/sdd-x/SKILL.md: <n> líneas con otra forma` con la línea `  + 12 «    - item»`, y sale con 1, aunque los párrafos salgan iguales
- AND dos elementos de lista juntados en una línea, o una línea en blanco doble donde `develop` tenía una, salen igual, con su línea
- AND un párrafo partido en otros saltos de línea, con la misma sangría, no cuenta
- AND con las mismas palabras y la misma forma escribe `dist/skills/sdd-x/SKILL.md: igual` y sale con 0
- AND si difieren también los párrafos, escribe `<n> párrafos distintos` con sus líneas y después la sección de forma
- AND `--base <ref>` compara con esa referencia en vez de `develop`, y una referencia que no existe da `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` y sale con 1
- AND un fichero que no está en la base cuenta como vacío

#### ADDED — Un fichero propio no lleva líneas literales de una fuente

- GIVEN `upstream.json` con `own: ["skills/juguete-propia/"]` y `skills/juguete-propia/SKILL.md`, cuya línea 3 tiene 80 caracteres y está igual en `a.md` del clon de `Juguete` en su último tag `v1.0.0`
- WHEN corre `moon run kit:upstream`
- THEN falla con `skills/juguete-propia/SKILL.md:3: línea literal de Juguete a.md@v1.0.0, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «<sus 6 primeras palabras>…»`
- AND la misma línea sangrada cuatro espacios en el `own` y sin sangrar en el clon da el mismo rojo
- AND una línea que solo está en la `version` de una entrada, `v0.9.0`, y no en el último tag da el rojo con `a.md@v0.9.0`
- AND una línea de menos de 70 caracteres igual a una del clon no da rojo
- AND sin ninguna línea literal escribe lo de hoy, `Fuentes al día: <n> entradas.`

#### Reglas de la capacidad — kit-distribution

- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`; las excepciones, `except`, `unless` e `instead of`. La cita S de una marca no lleva `«`, `»` ni `-->`. Una versión escrita en el texto es la clave o el `repo` de una fuente, entre comillas invertidas opcionales, espacios y `v?N.N[.N…]` (`` `?(<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``), en un `.md` de `skills/` fuera de `migrations/`. Una frase repetida es una racha de 10 palabras en dos skills. Un `SKILL.md` de `dist/` ocupa menos de 20.000 bytes, y una fase suma 100.000 caracteres o menos, con cada skill contada como mín(caracteres, 20.000). Un bloque `add` se come el original con 2 líneas seguidas o más, sin contar las en blanco, iguales a las de su sitio. Una línea literal de un `own` tiene 70 caracteres o más sin los espacios de los bordes.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`, `pending`, `from`, `own`, `notCopied`, `includes/`, `kit:own`, `kit:dist-compare`); los campos de la marca y los mensajes, en castellano (`sustituye`, `quita`, `de`, `arregla`, `fin`, `incluye`); el `<nombre>` de una inclusión, en inglés kebab-case.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código` · los de la inclusión del requisito «Una inclusión se escribe una vez y el build la expande» · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` de los requisitos «El corte compara cada entrada del registro con su fuente» y «Un fichero propio no lleva líneas literales de una fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Un bloque del kit que se come el original da rojo», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · los de `kit:dist-compare` del requisito «La comparación de dist/ nombra lo que cambia de forma» · los de `kit:own` de los requisitos «Una frase del kit repetida en otra skill da rojo», «Una absoluta con su excepción en la misma frase da rojo», «La prosa en castellano de una skill da rojo» y «Lo que dice kit:own» · los de `kit:skill-size` del requisito «Ninguna skill ni ninguna fase pasa de su tamaño» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera` · `<fichero>:<línea>: la versión de una fuente vive en upstream.json, no en el texto: «<trozo>»`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |
