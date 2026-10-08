---
id: 20261008-151724-feature-0144-docs-structure
feature: 0144
proposal: 0131
title: Documentos de la 3.0.0 — estructura nueva, plantillas y rutas de la CLI
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-08
---

# Spec — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI

## Capacidades

- Nuevas: `decisions` — la forma de una ADR del proyecto, su plantilla, y cómo la CLI la valida y encuentra las que aplican a unos ficheros
- Modificadas: `cli` — la lista de verbos suma `decision check|index`
- Modificadas: `roadmap` — `ROADMAP.md` en la raíz, con el roadmap de la 2.x aún legible, y los enlaces a `changes/` en el corte
- Modificadas: `release-flow` — `roadmap publish` acepta los documentos de la raíz
- Modificadas: `estimation` — el log lee `changes/` y `specs/` y vive junto a `estimation.md`; las releases salen de `CHANGELOG.md`
- Modificadas: `feature-ids` — el escaneo cuenta `changes/` y los dos roadmaps
- Modificadas: `onboarding` — `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0 junto a las de la 2.x

## Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores, hechos — señales: capacidad nueva (`decisions`), contrato público (estructura de ficheros que leen la CLI y las skills; `PRODUCT.md` compartido con impeccable), MODIFIED (`cli`, `release-flow`, `estimation`, `roadmap`, `feature-ids`), tres o más capacidades (7), área no explorada (`ids/scan.ts`, `merge/registries.ts`) · tamaño: ~1.000 líneas en ~28 ficheros
- Dominio (Opus): contradicciones con `onboarding`, `feature-ids` y `roadmap`, reglas de la capacidad nueva, la constitution
- Técnica (Sonnet): `id next` con dos estructuras, ramas y worktrees; `publish`; formato de `rutas` y globs
```

1. **Partición** (decisión del dev-lead, abajo): esta feature hace la estructura, las plantillas y las rutas de la CLI. `sdd-init` es la 0156 y `sdd-upgrade` con la migración v3.0.0 es la 0157, en cadena 0144 → 0156 → 0157.
2. **Estructura 3.0.0**, la de la propuesta: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz del proyecto; en `.docs/sdd/`, `steering/` (`constitution.md`, `operations.md`, `architecture.md`, `estimation.md` y, desde la 0150, `debt.md`), `decisions/`, `capabilities/`, `changes/` y `releases/`. `sdd-kit.json`, `sdd-kit.local.json` y `kit-feedback/` se quedan donde están. **Raíz del proyecto** es la carpeta padre de la que contiene `sdd/` (con `--path <x>/.docs/sdd`, `<x>`; también con `docs/sdd`, que la estimación ya admite).
3. **Una ruta por documento, con la 3.0.0 primero**: `ROADMAP.md` antes que `.docs/sdd/roadmap.md`, `CHANGELOG.md` antes que `.docs/sdd/changelog.md` y `steering/estimation.md` antes que `estimation.md`. No hay marcador de versión: el fichero que existe manda, y con los dos el verbo lee el 3.0.0 y avisa por stderr del otro, sin cambiar su código de salida. Hay dos excepciones, que leen **las dos** rutas: las carpetas de cambios (`changes/` y `specs/`), porque la 0157 no mueve contenido en bloque y un proyecto migrado conserva las viejas en `specs/`; y `id next`, que toma el máximo de los dos roadmaps, porque un id reservado solo en el viejo, en una rama o en un worktree aún en 2.x, no se puede reutilizar (técnica 1, dominio 4).
4. **`estimation-log.md` va junto a `estimation.md`**, en `steering/` en la 3.0.0. `sdd merge`, al regenerarlo tras un conflicto, lo escribe en el mismo sitio. Un log viejo que queda en la ruta 2.x tras migrar es asunto de la 0157.
5. **`roadmap publish` acepta `ROADMAP.md`, `CHANGELOG.md` y `PRODUCT.md` de la raíz del proyecto**, escritos así, además de lo que está bajo `.docs/sdd/`. Cualquier otra ruta (`docs/ROADMAP.md`, `README.md`) sale con 2, y los mensajes de error llevan la ruta publicada en vez de la fija `.docs/sdd/roadmap.md`. Publicar un fichero que cambió de ruta entre la base y `develop` no se contempla: pasa una vez, al migrar, y lo lleva la 0157.
6. **`PRODUCT-template.md`** lleva los encabezados de impeccable 4.3.1 que el kit usa, en inglés porque impeccable los lee por su nombre: `## Users`, `## Product Purpose` y `## Capabilities and Constraints` (aquí va el «es / no es»). Añade `## Terminology` con el formato de glosario de Matt (`**Término**:` definición de una o dos frases y `_Evitar_:` sinónimos). El contenido va en el idioma del proyecto. **No lleva el marcador `<!-- impeccable:product-schema 1 -->`**: con él, impeccable daría por deliberadamente corto un registro sin `Platform` ni `Positioning` y no los preguntaría nunca. Sin él, impeccable ve un registro por completar y añade sus secciones en el mismo fichero.
7. **`operations-template.md`** lleva `## Comandos`, `## Testing`, `## Frontend` (los campos de hoy, que lee la verificación de frontend) y `## Entornos` (el contrato de `environments-template.md` condensado: el marcador, las tres entradas y el runner; si el proyecto no necesita más que instalar dependencias, se borra). Sin tabla de versiones, porque están en los manifests, y sin «Decisiones abiertas», porque una decisión pendiente es trabajo por hacer y va al roadmap. `## Testing` lleva la parte de plantilla de la 0097: suites con comando y duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación y si los tests usan el motor de producción.
8. **`adr-template.md`** calca la forma de la [ADR 0001](../../decisions/0001-bounded-documents-and-adr.md). Sin rellenar lleva `status: proposed`, `date: <AAAA-MM-DD>` y `rutas` con un solo elemento `- <glob, p. ej. src/db/**>`, de modo que solo falla por `date`. La cita de ayuda dice cuándo se ofrece una ADR: las tres condiciones de Matt (difícil de deshacer, sorprende sin contexto, hubo una alternativa real). Quién la escribe al cerrar es de la 0149.
9. **`constitution-template.md` corta**: principios como preámbulo y artículos de una regla con su porqué en una frase y el enlace a su ADR. Mantiene «Convenciones» y las cinco «Reglas de producto», que leen las init y las migraciones (`MigrationInitParity.Tests.ps1`).
10. **Verbos `sdd decision check` y `sdd decision index`** (capacidad nueva `decisions`). La ADR 0001 dejó escrito que «la forma de cada ADR la comprueba la CLI de la 0143», y la 0143 no lo hizo. El índice por `rutas` es lo que la propuesta pide para que quien toca un fichero encuentre su ADR. `index` sale siempre con 0, como `capability index`, y no valida. `check` sin carpeta `decisions/` sale con 0: un proyecto sin ADR no está mal. Con `--files` salen las `accepted` y las `proposed` (las segundas gobiernan pronto y conviene verlas); no salen las `rejected`, `deprecated` ni las `superseded by NNNN`. Los globs los implementa la CLI y no `path.matchesGlob`, que en Node 22 es experimental (técnica 8); las reglas de los globs y de `rutas` están en las «Reglas de la capacidad» de `decisions`.
11. **Las plantillas de la 2.x se quedan hasta la 0156** (`mission-template.md`, `tech-stack-template.md`, `environments-template.md`; `client-changelog-template.md` hasta la 0150): las retira la feature que reescribe su único consumidor (las init, y `sdd-end-release`). Retirarlas aquí dejaría falsos tres requisitos vivos de `onboarding` (dominio 1), referencias colgando en cinco skills y tests que habría que borrar. El índice de `sdd-templates` las marca «2.x: la retira la 0156» (o la 0150).
12. **Una pieza entra, otra sale: aquí no sale ninguna.** Entran tres plantillas y dos verbos; las cuatro plantillas que sustituyen salen en la 0156 y la 0150 con su consumidor (decisión 11). Necesita tu aprobación explícita en el gate (Art. I).
13. **Enmienda de la constitution**: el Art. IV pasa a fijar la estructura de la decisión 2 (la raíz con sus tres documentos y `.docs/sdd/` con sus carpetas; las carpetas de `specs/` anteriores a la 3.0.0 se leen y no se mueven), y el Art. XI extiende sus tipos a los tres documentos de la raíz (dominio 10). El porqué va en una ADR nueva, la `0012-documents-by-reader.md`; la 0005 sigue `accepted` para el resto de convenciones (naming, ids, merge). Los Art. V y VII hablan de los documentos de este repo y cambian cuando la 0157 lo migre. La constitution tiene 2.109 palabras con un tope de 2.200: la enmienda cabe sin subirlo.
14. **Quedan fuera de esta feature, con su dueño**: las plantillas de los artefactos de cambio (spec, plan, patch, proposal, walkthrough y tasks), que siguen citando `specs/`, en la 0146-0149; la forma de `ROADMAP.md` (Now / Next / Later, con el ejemplo de enlace desde la raíz) y `debt.md` con su triaje, en la 0150; los predicados de las skills que nombran rutas 2.x (`.docs/sdd/estimation.md` y `estimation-log.md` en los cierres y en la retro de `release-flow`, `tech-stack.md` en el bump), en la 0149 y la 0150 (técnica 6, dominio 7); y la migración de este repo, en la 0157. La 0152 comprueba que no queda ninguna ruta 2.x en las skills.
15. **Prueba (Art. I)**: humo de `sdd-templates`, que cambia su `description`, su índice y su regla de rutas. Son 2 escenarios con n = 1 y sujetos Sonnet: (h1) «crea el documento de operaciones del proyecto» en un molde con la estructura 3.0.0 → calca `operations-template.md` en `.docs/sdd/steering/operations.md` con `## Testing`; (h2) «apunta como ADR que usamos Postgres» → calca `adr-template.md` en `.docs/sdd/decisions/0001-<slug>.md` y `sdd decision check` la da por válida. **Previsión: 2 sujetos, ~20 min, ~3 $.** Lo nuevo o cambiado que sigue el agente: el índice y la `description` de `sdd-templates` → h1 y h2; la regla de rutas → h1; `PRODUCT-template.md` y `constitution-template.md` → sin sujeto, porque no cambian ningún paso (se calcan igual) y los comprueba `AnchorTemplates.Tests.ps1`. La CLI se prueba con Vitest, con las plantillas calcadas como fixture.
16. **Tope de palabras de `sdd-templates`**: se queda en 1.500 (`SKILL.md`) y 11.990 (total). Hoy suma 10.523 y entran unas 900 palabras: debería caber. Si no cabe, recorto antes que subir el tope.
17. **No declaro MODIFIED los requisitos de `roadmap` cuyos mensajes empiezan por `roadmap.md:`** (dominio 5, en parte): sus escenarios son de un roadmap 2.x y siguen siendo ciertos; el prefijo es el nombre del fichero que se lee, y el ADDED de `ROADMAP.md` lo dice. Sí declaro MODIFIED los dos requisitos que deciden por el enlace al artefacto.

### Hallazgos de la review

- **Aceptado** — (técnica 1, dominio 4) `id next` perdía filas del roadmap viejo con «gana `ROADMAP.md`» → decisión 3: `id next` toma el máximo de los dos; MODIFIED de `feature-ids` con escenario.
- **Aceptado** — (técnica 2) sin escenario para ramas y worktrees → AND en el MODIFIED: cada rama y cada worktree se leen con su propia estructura; el caso de subcarpeta sigue omitiendo las ramas, como hoy.
- **Aceptado** — (técnica 3) código de salida del aviso y cálculo de la raíz → decisiones 2 y 3, y AND en el ADDED de `roadmap`.
- **Aceptado** — (técnica 4) qué es «de la raíz» en `publish` y mensajes con la ruta fija → decisión 5 y escenario de rechazo con `docs/ROADMAP.md`. **Rechazado** el caso de fichero movido entre la base y `develop` → pasa una vez, al migrar (0157).
- **Rechazado** — (técnica 5) los registros de la raíz no casarían con las reglas de merge → `merge/registries.ts` une cualquier fichero en que los dos lados solo añaden, sin lista de rutas; lo único con ruta es dónde regenera el log, que recoge la decisión 4.
- **Aceptado** — (técnica 6, dominio 7) predicados 2.x en `release-flow` y `estimation` → decisión 14, con su dueño (0149, 0150) y la comprobación de la 0152.
- **Aceptado** — (técnica 7) sintaxis de `rutas`, formato de `date`, NNNN de cuatro dígitos → «Reglas de la capacidad» de `decisions` y AND en el primer requisito.
- **Aceptado** — (técnica 8) semántica de los globs → «Reglas de la capacidad» de `decisions`, con ejemplos en el escenario.
- **Aceptado** — (técnica 9, dominio 9) qué estados salen con `--files`, título y orden → decisión 10 y AND del índice.
- **Aceptado** — (técnica 10, dominio 2) número duplicado, `superseded by` a una ADR inexistente, plantilla sin rellenar y decisiones implícitas → AND de `check`, decisiones 8 y 10.
- **Aceptado** — (dominio 1, Crítico) retirar las plantillas dejaba falsos tres requisitos de `onboarding` → decisión 11: se quedan hasta la 0156; el ADDED de `onboarding` ya no dice que no existen.
- **Aceptado** — (dominio 2, Crítico) la capacidad nueva sin reglas → «Reglas de la capacidad» de `decisions` con las cinco.
- **Aceptado** — (dominio 3) ADDED de `feature-ids` que cambiaba requisitos vivos → MODIFIED de «Una feature no planificada…», «El script avisa de un id duplicado…» y «El script avisa cuando omite las ramas», y de la regla «Contrato de lectura del roadmap».
- **Aceptado en parte** — (dominio 5) → MODIFIED de «Una fila saldada…» y de «Un patch publicado…»; el prefijo de los mensajes no, por la decisión 17.
- **Aceptado** — (dominio 6) regla ante conflicto sin declarar e incoherente → decisión 3 uniforme (manda la 3.0.0 y avisa) y «Reglas de la capacidad» de `roadmap` y `estimation`.
- **Aceptado** — (dominio 8) `migrations/v1.0.0.md` nombra plantillas → sin efecto con la decisión 11: las plantillas siguen existiendo.
- **Aceptado** — (dominio 10) la estructura choca con los Art. IV y XI → decisión 13: enmienda y ADR 0012 en el Scope.

### Decisiones tomadas con el dev-lead

- Partir la 0144 en tres features, 0144 (estructura, plantillas y CLI), 0156 (`sdd-init`) y 0157 (`sdd-upgrade` y migración v3.0.0) — «Partir en tres (Recomendada)», 2026-10-08
- Parar en la spec, sin aprobarla por delegación — «Parar en la spec (Recomendada)», 2026-10-08
- Review de spec con dos revisores: dominio con Opus y técnica con Sonnet, los dos con effort medium — «perdona era dominio opus, tecnica sonnet», 2026-10-08

## Intent

La 3.0.0 reparte los documentos por lector: lo que lee la persona, en la raíz (`PRODUCT.md`, compartido con impeccable; `ROADMAP.md` y `CHANGELOG.md`), y lo que lee el agente, en `.docs/sdd/` (`steering/`, `decisions/`, `capabilities/`, `changes/` y `releases/`), con una pregunta por documento. Hoy no hay plantillas para esa estructura (ni `PRODUCT.md` ni `operations.md` ni ADR), y la CLI solo sabe leer `.docs/sdd/specs/` y `.docs/sdd/roadmap.md`. Esta feature deja las plantillas, la constitution y la CLI preparadas para que `sdd-init` (0156) cree la estructura nueva y `sdd-upgrade` (0157) lleve a ella los proyectos existentes, sin que los proyectos aún en la 2.x dejen de funcionar.

## Scope

- Entra: `skills/sdd-templates/templates/` (nuevas `PRODUCT-template.md`, `operations-template.md` y `adr-template.md`; reescrita `constitution-template.md`) y `skills/sdd-templates/SKILL.md` (`description`, índice con destinos, marcas «2.x», regla de rutas y tabla de verbos); la resolución de rutas de la CLI, en un solo módulo que usan `ids/scan.ts`, `roadmap/check.ts`, `roadmap/releases.ts`, `roadmap/publish.ts`, `roadmap/verbs.ts`, `estimation/log.ts`, `estimation/releases.ts`, `estimation/verbs.ts` y `merge/registries.ts`; el sustantivo `decision` con `check` e `index`, y su registro en `cli/src/cli/verbs.ts`; los tests Vitest de todo lo anterior; `tests/AnchorTemplates.Tests.ps1` (existencia y «no nombra proyectos reales» de las plantillas nuevas); el humo de `sdd-templates` (`tests/sdd-templates-smoke.md` y `red/`/`green/` en esta carpeta); los Art. IV y XI de `.docs/sdd/constitution.md` y la ADR `0012-documents-by-reader.md`; `THIRD_PARTY_NOTICES.md` (glosario y ADR de mattpocock/skills en `b0618bc`, encabezados de impeccable 4.3.1); `.docs/sdd/architecture.md` (la CLI y la fila de `decisions/` con su verbo).
- No entra: las init y `sdd-upgrade` (0156, 0157); retirar las plantillas 2.x (decisión 11); lo de la decisión 14; el aviso del hook; `capability`, que no cambia de ruta.

## Approach

Primero la CLI: un módulo de rutas que, dada la raíz del proyecto, devuelve el fichero de cada documento (la ruta 3.0.0 si existe y, si no, la 2.x, con el aviso cuando están las dos) y las carpetas de cambios que existen. Los verbos que hoy tienen las rutas fijas se las piden a ese módulo, y sus tests cubren tres casos: solo 2.x, solo 3.0.0 y las dos a la vez. Después el sustantivo `decision`, que valida la forma de la ADR 0001 y cruza los globs de `rutas` con los ficheros que se le pasan. Por último las plantillas, el índice de `sdd-templates` con su humo, y la enmienda de la constitution con su ADR.

## Delta de comportamiento

### Capacidad: `decisions`

**ADDED — Una ADR tiene la forma de la plantilla**
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

**ADDED — El índice de decisiones cruza `rutas` con los ficheros de un cambio**
- GIVEN `0001-use-postgres.md` (`# Usar Postgres`, accepted, rutas `src/db/**`), `0002-node-scripts.md` (accepted, rutas `skills/**/scripts/**`), `0003-mysql.md` (`superseded by 0001`, rutas `src/db/**`), `0004-cache.md` (proposed, rutas `src/db/cache.ts`) y `0005-orm.md` (rejected, rutas `src/db/**`)
- WHEN se ejecuta `sdd decision index --path .docs/sdd --files src/db/cache.ts README.md`
- THEN escribe, ordenadas por número, `` - `0001` — Usar Postgres (accepted) · `.docs/sdd/decisions/0001-use-postgres.md` `` y la línea de la `0004`, y sale con 0
- AND no salen la `0003` (superseded), la `0005` (rejected) ni una `deprecated`
- AND con `--files skills\x\scripts\run.ts` (barras de Windows) sale solo la `0002`; con `--files README.md`, ninguna línea, y sale con 0
- AND sin `--files` lista las cinco, cada una con su `status`
- AND `src/*.ts` casa con `src/a.ts` y no con `src/db/a.ts`; `src/**/a.ts` casa con `src/a.ts` y con `src/db/x/a.ts`; `src/db/**` casa con `src/db/a.sql` y no con `src/db`; `SRC/a.ts` no casa con `src/*.ts`
- AND una ADR sin línea `# ` sale con `(sin título)`; una con la forma rota sale igual: validar es cosa de `decision check`

**ADDED — La plantilla de ADR**
- GIVEN el skill `sdd-templates`
- WHEN un agente tiene que escribir una ADR del proyecto
- THEN calca `adr-template.md` en `.docs/sdd/decisions/NNNN-<slug-en-inglés>.md`, con el número siguiente al mayor de la carpeta
- AND la plantilla lleva el frontmatter (`status`, `date`, `rutas`), las cinco secciones de la ADR 0001 y, en la ayuda, cuándo se ofrece una ADR: es difícil de deshacer, sorprende sin contexto y hubo una alternativa real, las tres a la vez

**Reglas de la capacidad**
- **Dónde viven los datos**: una ADR por fichero en `.docs/sdd/decisions/NNNN-<slug>.md`; su estado, fecha y rutas, en el frontmatter; el texto, en sus cinco secciones. La forma la fijan la ADR 0001 y `adr-template.md`.
- **Idioma de los nombres**: claves del frontmatter como en la ADR 0001 (`status` y `date` en inglés, `rutas` en castellano); valores de `status` en inglés, los de MADR; secciones y mensajes de la CLI en castellano; el slug del fichero, en inglés kebab-case.
- **Límites**: el número, de cuatro dígitos (`0001`–`9999`) y propio de la carpeta, independiente de los ids de features; `date` en `AAAA-MM-DD`; `rutas` con un elemento al menos. Globs: rutas relativas a la raíz del proyecto, con `/` (las `\` de `--files` se normalizan), sensibles a mayúsculas; `*` casa dentro de un segmento; `**` casa con cero o más segmentos, y `dir/**` con todo lo que hay bajo `dir`, no con `dir`; `?`, `{}`, `[]` y `!` no se admiten. `rutas` admite lista en bloque o en línea, con comillas simples, dobles o sin ellas, y ninguna otra sintaxis de YAML.
- **Avisos**: `decision check` escribe una línea por fallo, con el fichero, y sale con 1; `decision index` no avisa ni falla nunca.
- **Regla ante conflicto**: dos ADR con el mismo número son un fallo de `check`. Una ADR sustituida apunta a la que la sustituye, que tiene que existir. Dos ADR vigentes con `rutas` que se solapan no son conflicto: el índice da las dos, y la más reciente manda en lo que se contradigan.

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias** (antes: la lista de verbos no tenía `decision`)
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

### Capacidad: `roadmap`

**ADDED — El roadmap vive en `ROADMAP.md`, en la raíz del proyecto**
- GIVEN un proyecto `<x>` con `<x>/ROADMAP.md` y sin `<x>/.docs/sdd/roadmap.md`
- WHEN se ejecuta `sdd roadmap check --path <x>/.docs/sdd`
- THEN valida `ROADMAP.md` con las mismas reglas que hoy y cada línea de fallo y de aviso empieza por `ROADMAP.md:`
- AND con solo `.docs/sdd/roadmap.md` (un proyecto en la 2.x) lo valida como hoy, con `roadmap.md:`
- AND con los dos, valida `ROADMAP.md`, escribe `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` y, sin fallos, termina con `Roadmap válido` y sale con 0

**MODIFIED — Una fila saldada antes de la última release está de más** (antes: el último AND solo reconocía el enlace `specs/<carpeta>/patch.md`)
- GIVEN una fila de «Deuda técnica» que empieza por `**[Patch 0018, 2026-09-10: saldada — …]**`, una de «Backlog» por `**[Task 0012, 2026-09-20: saldada — …]**`, otra de «Deuda técnica» por `**[Feature 0030, 2026-09-25: saldada — …]**`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check --path .docs/sdd`
- THEN escribe `roadmap.md: línea <n>: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y la misma línea para la del 2026-09-20, y sale con 1
- AND la fila del 2026-09-25 no da fallo, ni una fila `parcial` de cualquier fecha
- AND sin ninguna subsección en «Releases cerradas», ninguna fila saldada da fallo
- AND con el tag `v1.2.0` en git, una fila saldada del 2026-09-20 que enlaza el artefacto da el fallo solo si el commit que añadió ese fichero es ascendiente del tag; fusionada tras el corte del mismo día, no da fallo. El enlace cuenta igual si es `specs/<carpeta>/…`, `changes/<carpeta>/…` o, desde `ROADMAP.md`, `.docs/sdd/changes/<carpeta>/…` o `.docs/sdd/specs/<carpeta>/…`

**MODIFIED — Un patch publicado sale de «Patches» en el corte** (antes: el último AND solo reconocía el enlace `specs/<carpeta>/patch.md`)
- GIVEN una fila de «Patches» con fecha `2026-09-20`, otra con `2026-09-22`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y sale con 1
- AND la fila del 2026-09-22 no da fallo
- AND sin ninguna subsección en «Releases cerradas», ninguna fila de «Patches» da fallo
- AND con el tag `v1.2.0` en git, la fila del 2026-09-20 que enlaza su `patch.md` da el fallo solo si el commit que añadió ese fichero es ascendiente del tag: un patch fusionado tras el corte del mismo día da `Roadmap válido`; sin tag o sin enlace, decide la fecha. El enlace cuenta igual con las cuatro formas de «Una fila saldada antes de la última release está de más»

**Reglas de la capacidad**
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye. Una feature que está en una release cerrada no tiene fila en una sección abierta: manda la release cerrada. Con `ROADMAP.md` y `.docs/sdd/roadmap.md` a la vez, `roadmap check` lee `ROADMAP.md` y avisa del otro; `id next` lee los dos (`feature-ids`).

### Capacidad: `release-flow`

**MODIFIED — La reserva se publica antes de arrancar** (antes: «con una ruta fuera de `.docs/sdd/`, sale con 2 sin escribir»)
- GIVEN un scope replanificado que el usuario ha decidido, `"merge": { "into": "develop" }` en `sdd-kit.json`, `develop` sacada en el worktree `D:\code\salas` sin cambios en `roadmap.md`, y una sesión en otro worktree con dos filas nuevas reservadas en su `roadmap.md`
- WHEN el agente ejecuta `node sdd.js roadmap publish --message "docs(roadmap): reservar 0150 y 0151" .docs/sdd/roadmap.md`
- THEN `develop` tiene un commit con ese mensaje que solo toca `roadmap.md`, con el contenido del worktree de la sesión, hecho en `D:\code\salas`, y sale con 0
- AND lo hace antes de arrancar ninguna de las features nuevas, y el `proposal.md` de la propuesta, si la hay, va en el mismo commit
- AND si `develop` no está sacada en ningún worktree, el commit se hace en un worktree temporal de nombre corto junto a los demás, que se retira al acabar
- AND si otro proceso tiene `sdd-merge.lock`, escribe `Esperando el cerrojo de merge: lo tiene <rama> (<worktree>, PID <pid>) desde <hora>.`, espera y después publica; si a los 30 min no se libera, escribe `cerrojo: no se libera; lo tiene …`, sale con 1 y `develop` no cambia
- AND si `develop` cambió el fichero publicado desde la base de la sesión (`git merge-base`), escribe `develop cambió <ruta publicada> desde tu base: integra develop antes de publicar` (`.docs/sdd/roadmap.md` en este caso), sale con 1 y `develop` no cambia
- AND si `D:\code\salas` tiene cambios sin commitear en el fichero publicado, escribe `destino con cambios: <ruta publicada> en D:\code\salas`, sale con 1 y `develop` no cambia
- AND en un proyecto con la estructura 3.0.0, `node sdd.js roadmap publish --message "…" ROADMAP.md` publica igual el `ROADMAP.md` de la raíz del proyecto, y también se aceptan `CHANGELOG.md` y `PRODUCT.md` de esa raíz
- AND sin `merge.into` en `sdd-kit.json` ni `--into`, o con una ruta que no está bajo `.docs/sdd/` ni es `ROADMAP.md`, `CHANGELOG.md` o `PRODUCT.md` de la raíz del proyecto (`docs/ROADMAP.md`, `README.md` o `src/app.ts`), sale con 2 sin escribir

### Capacidad: `estimation`

**MODIFIED — El estimation-log se genera desde los artefactos de cierre** (antes: «`<docs>/estimation-log.md`», y solo leía `specs/`)
- GIVEN un proyecto con `estimation.md` en `.docs/sdd/steering/` (3.0.0) o en `.docs/sdd/` (2.x) y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo en `.docs/sdd/changes/` o en `.docs/sdd/specs/`
- WHEN se ejecuta `sdd estimation log --root <proyecto>`
- THEN `estimation-log.md` se regenera entero, en la carpeta de `estimation.md`, con una fila por artefacto (fecha, id, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, sujetos ($), sesión ($), carpeta), ordenado por carpeta
- AND un proyecto con `specs/20260920-100000-feature-0079-b/walkthrough.md` y `changes/20261010-090000-feature-0160-c/walkthrough.md` tiene las dos filas, `0079` y `0160`
- AND con `estimation.md` en las dos rutas, el log va a `steering/` y escribe por stderr que también existe `.docs/sdd/estimation.md`
- AND `sdd merge`, cuando regenera el log tras un conflicto, lo escribe en esa misma carpeta
- AND la fecha de la fila es la de cierre: la primera línea `created: AAAA-MM-DD` o `date: AAAA-MM-DD` del artefacto; sin ella, o con el placeholder de la plantilla, la fecha de la carpeta, que es la de apertura
- AND `Sesión ($)` es la cifra de `Coste de la sesión`; «sin precio» y «no medido» aparecen tal cual, y sin la línea la celda es `—`
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"
- AND sin `changes/` ni `specs/` bajo `.docs/sdd/` ni `docs/sdd/`, sale con error y dice qué carpetas buscó

**MODIFIED — El log agrupa por release** (antes: «un `<docs>/changelog.md`»)
- GIVEN un `CHANGELOG.md` en la raíz del proyecto (3.0.0) o un `<docs>/changelog.md` (2.x) con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($), de la release más antigua a la más reciente
- AND con los dos changelogs, manda `CHANGELOG.md` y escribe por stderr que también existe `<docs>/changelog.md`
- AND `Sesión ($)` suma las cifras de los artefactos de la release que la tienen; sin ninguna, `—`
- AND cada artefacto va a la primera versión cuyo tag `vX.Y.Z` contiene el commit que lo añadió, y a la primera con fecha igual o posterior a la de su fila (la de cierre) si la versión no tiene tag; dos versiones del mismo día van de la anterior a la siguiente; los que no caen en ninguna van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin changelog, o sin versiones con fecha, la tabla no aparece

**Reglas de la capacidad**
- **Regla ante conflicto**: con un documento en su ruta 3.0.0 y en la 2.x a la vez (`steering/estimation.md` y `estimation.md`, `CHANGELOG.md` y `<docs>/changelog.md`), manda la 3.0.0 y el verbo avisa por stderr del otro. Las carpetas de artefactos (`changes/` y `specs/`) se leen las dos.

### Capacidad: `feature-ids`

**MODIFIED — Una feature no planificada obtiene su id con un script determinista** (antes: solo `.docs/sdd/specs/` y `.docs/sdd/roadmap.md`)
- GIVEN un proyecto en modo `sequence` y una feature o patch sin fila en el roadmap
- WHEN se invoca `sdd id next --reserve` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en las carpetas de `.docs/sdd/changes/` y `.docs/sdd/specs/` y en los dos roadmaps (`ROADMAP.md` de la raíz y `.docs/sdd/roadmap.md`) del working tree; en esos mismos roadmaps y carpetas de cada rama local y remota, y en su nombre salvo el de la rama actual; y en esos roadmaps y carpetas del disco de cada worktree de `git worktree list`, más uno
- AND cada rama y cada worktree se leen con lo que tengan: una rama con solo `ROADMAP.md` y `changes/` cuenta igual que una con solo `.docs/sdd/roadmap.md` y `specs/`
- AND con `.docs/sdd/specs/20260920-100000-feature-0079-b/`, `.docs/sdd/changes/20261010-090000-feature-0081-c/`, la fila `0083` en `ROADMAP.md` y la fila `0085` en `.docs/sdd/roadmap.md`, sin contador ni ramas con un id mayor, propone `0086`
- AND lo que otro worktree tiene reservado sin fusionar cuenta aunque no esté en ninguna rama: una fila de un roadmap en *staged* o una carpeta de `changes/` o `specs/` sin commitear
- AND deja ese id consumido en el contador
- AND no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

**MODIFIED — El script avisa de un id duplicado y no devuelve ninguno** (antes: «dos carpetas de `specs/`»)
- GIVEN un proyecto en modo `sequence` donde dos carpetas de artefactos distintas llevan el mismo id, en `specs/`, en `changes/` o una en cada una
- WHEN se invoca `sdd id next`, con `--reserve` o sin él
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar
- AND el contador no cambia
- AND las carpetas con sufijo alfabético heredadas (`…-task-0006a-…`, `…-task-0006b-…`) no cuentan como duplicado: el script las nombra en un aviso por salida de error, cuenta su número como ocupado y devuelve el siguiente id libre

**MODIFIED — El script avisa cuando omite las ramas** (antes: «calculado con `specs/` y el roadmap del working tree»)
- GIVEN un proyecto en modo `sequence` cuya raíz no es la raíz de su repositorio (un proyecto dentro de un monorepo)
- WHEN se invoca `sdd id next`
- THEN devuelve el id calculado con las carpetas de `changes/` y `specs/` y los dos roadmaps del working tree, sin leer ramas ni el disco de otros worktrees, y avisa por salida de error de que omite las ramas, nombrando el repositorio que encontró
- AND no lee las ramas del repositorio padre: sus ids no son ids de este proyecto

**Reglas de la capacidad**
- **Contrato de lectura del roadmap**: el script lee `ROADMAP.md` de la raíz del proyecto y `.docs/sdd/roadmap.md`, los dos si existen, y reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en la segunda si la primera es una fecha (`| 2026-10-01 | 0001 |`, la forma de la tabla de Patches), en los nombres de artefacto (`feature-<id>-`, `task-<id>-`, `patch-<id>-`, `proposal-<id>-`) de `changes/` y `specs/`, y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.

### Capacidad: `onboarding`

**ADDED — `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0**
- GIVEN el skill `sdd-templates`
- WHEN se lista su índice de plantillas de documentos
- THEN tiene `PRODUCT-template.md` → `PRODUCT.md` en la raíz, `constitution-template.md` → `.docs/sdd/steering/constitution.md`, `operations-template.md` → `.docs/sdd/steering/operations.md`, `architecture-template.md` → `.docs/sdd/steering/architecture.md`, `estimation-template.md` → `.docs/sdd/steering/estimation.md`, `roadmap-template.md` → `ROADMAP.md` en la raíz, `changelog-template.md` → `CHANGELOG.md` en la raíz y `adr-template.md` → `.docs/sdd/decisions/`
- AND `mission-template.md`, `tech-stack-template.md`, `environments-template.md` y `client-changelog-template.md` siguen, marcadas «2.x» con la feature que las retira (0156; 0150 la de cliente)

**ADDED — `PRODUCT.md` comparte la forma de impeccable**
- GIVEN `PRODUCT-template.md`
- WHEN se lee
- THEN tiene, en este orden, `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology`, y no lleva el marcador `impeccable:product-schema`
- AND `## Terminology` muestra el formato del glosario con un ejemplo inventado: `**<Término>**:` con una definición de una o dos frases, y debajo `_Evitar_:` con los sinónimos que no se usan

**ADDED — `operations.md` dice cómo se ejecuta y se verifica el proyecto**
- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- AND `## Testing` pide cada suite con su comando y su duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación y si los tests usan el motor de producción
- AND `## Frontend` tiene los mismos campos que `tech-stack-template.md` (URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-08 | aprobada: «Apruebo» (incluye que no sale ninguna pieza, decisión 12) |
