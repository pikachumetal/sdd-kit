# Capacidad — decisions

## Propósito

la forma de una ADR del proyecto, su plantilla, y cómo la CLI la valida y encuentra las que aplican a unos ficheros

## Requisitos

### Una ADR tiene la forma de la plantilla

- GIVEN `.docs/sdd/decisions/0001-use-postgres.md` con frontmatter `status: accepted`, `date: 2026-10-08` y `rutas` con el elemento `src/db/**`, y las secciones `## Contexto y problema`, `## Opciones consideradas`, `## Decisión`, `### Consecuencias` y `### Confirmación` en ese orden
- WHEN se ejecuta `sdd decision check --path .docs/sdd`
- THEN escribe `Decisiones válidas` y sale con 0
- AND con `status: aceptada`, o con `status: superseded by 12`, escribe `0001-use-postgres.md: status «aceptada» no es proposed, accepted, rejected, deprecated ni superseded by NNNN` (con su valor) y sale con 1
- AND con `status: superseded by 0009` y sin ninguna `0009-*.md` en la carpeta, escribe `0001-use-postgres.md: sustituida por 0009, que no existe` y sale con 1
- AND con `date: 8/10/2026` escribe `0001-use-postgres.md: date «8/10/2026» no es AAAA-MM-DD` y sale con 1
- AND sin `rutas`, o con `rutas` vacía, escribe `0001-use-postgres.md: falta rutas` y sale con 1; con el elemento `src/{a,b}/**`, escribe `0001-use-postgres.md: glob no soportado «src/{a,b}/**»` y sale con 1
- AND `rutas` se lee igual en bloque (`- src/db/**`) que en línea (`[src/db/**, "**/*.sql"]`), con comillas o sin ellas
- AND sin `### Confirmación`, o con `## Decisión` antes de `## Opciones consideradas`, escribe qué sección falta o está fuera de orden y sale con 1
- AND `use-postgres.md`, sin `NNNN-` delante, escribe `use-postgres.md: el nombre no es NNNN-<slug>.md` y sale con 1; `0001-use-postgres.md` y `0001-mysql.md` a la vez escriben `número 0001 repetido: 0001-mysql.md, 0001-use-postgres.md` y sale con 1
- AND un fichero que no acaba en `.md` no se lee; sin carpeta `decisions/`, o con la carpeta sin ningún `.md`, escribe `Sin decisiones` y sale con 0
- AND `adr-template.md` calcada y rellenada pasa la comprobación, y calcada sin rellenar falla solo por `date`

### El índice de decisiones cruza `rutas` con los ficheros de un cambio

- GIVEN `0001-use-postgres.md` (`# Usar Postgres`, accepted, rutas `src/db/**`), `0002-node-scripts.md` (accepted, rutas `skills/**/scripts/**`), `0003-mysql.md` (`superseded by 0001`, rutas `src/db/**`), `0004-cache.md` (proposed, rutas `src/db/cache.ts`) y `0005-orm.md` (rejected, rutas `src/db/**`)
- WHEN se ejecuta `sdd decision index --path .docs/sdd --files src/db/cache.ts README.md`
- THEN escribe, ordenadas por número, `` - `0001` — Usar Postgres (accepted) · `.docs/sdd/decisions/0001-use-postgres.md` `` y la línea de la `0004`, y sale con 0
- AND no salen la `0003` (superseded), la `0005` (rejected) ni una `deprecated`
- AND con `--files skills\x\scripts\run.ts` (barras de Windows) sale solo la `0002`; con `--files README.md`, ninguna línea, y sale con 0
- AND sin `--files` lista las cinco, cada una con su `status`
- AND `src/*.ts` casa con `src/a.ts` y no con `src/db/a.ts`; `src/**/a.ts` casa con `src/a.ts` y con `src/db/x/a.ts`; `src/db/**` casa con `src/db/a.sql` y no con `src/db`; `SRC/a.ts` no casa con `src/*.ts`
- AND una ADR sin línea `# ` sale con `(sin título)`; una con la forma rota sale igual: validar es cosa de `decision check`

### La plantilla de ADR

- GIVEN el skill `sdd-templates`
- WHEN un agente tiene que escribir una ADR del proyecto
- THEN calca `adr-template.md` en `.docs/sdd/decisions/NNNN-<slug-en-inglés>.md`, con el número siguiente al mayor de la carpeta
- AND la plantilla lleva el frontmatter (`status`, `date`, `rutas`), las cinco secciones de la ADR 0001 y, en la ayuda, cuándo se ofrece una ADR: es difícil de deshacer, sorprende sin contexto y hubo una alternativa real, las tres a la vez

## Reglas de la capacidad

- **Dónde viven los datos**: una ADR por fichero en `.docs/sdd/decisions/NNNN-<slug>.md`; su estado, fecha y rutas, en el frontmatter; el texto, en sus cinco secciones. La forma la fijan la ADR 0001 y `adr-template.md`.
- **Idioma de los nombres**: claves del frontmatter como en la ADR 0001 (`status` y `date` en inglés, `rutas` en castellano); valores de `status` en inglés, los de MADR; secciones y mensajes de la CLI en castellano; el slug del fichero, en inglés kebab-case.
- **Límites**: el número, de cuatro dígitos (`0001`–`9999`) y propio de la carpeta, independiente de los ids de features; `date` en `AAAA-MM-DD`; `rutas` con un elemento al menos. Globs: rutas relativas a la raíz del proyecto, con `/` (las `\` de `--files` se normalizan), sensibles a mayúsculas; `*` casa dentro de un segmento; `**` casa con cero o más segmentos, y `dir/**` con todo lo que hay bajo `dir`, no con `dir`; `?`, `{}`, `[]` y `!` no se admiten. `rutas` admite lista en bloque o en línea, con comillas simples, dobles o sin ellas, y ninguna otra sintaxis de YAML.
- **Avisos**: `decision check` escribe una línea por fallo, con el fichero, y sale con 1; `decision index` no avisa ni falla nunca.
- **Regla ante conflicto**: dos ADR con el mismo número son un fallo de `check`. Una ADR sustituida apunta a la que la sustituye, que tiene que existir. Dos ADR vigentes con `rutas` que se solapan no son conflicto: el índice da las dos, y la más reciente manda en lo que se contradigan.
