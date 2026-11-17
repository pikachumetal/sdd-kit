---
id: 20261104-172830-feature-0304-own-and-size-checks
feature: 0304
title: Plan de implementación — Las comprobaciones de las skills propias y del tamaño
spec: ./spec.md
status: approved
created: 2026-11-04
---

# Plan de implementación — Las comprobaciones de las skills propias y del tamaño

## Decisiones que he tomado yo — valida estas

1. **Modelo**: Native, la sesión implementa las 4 tasks (Opus 5.5, el modelo que eligió el dev-lead para la sesión; no paró antes de la Task 1 para bajarla). Revisión final con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura, no (abajo).
2. **Ejecución**: native (abajo, con su motivo).
3. **La salida por líneas sale del build**: `build/dist.ts` gana `renderLines`, que expande las inclusiones y quita las marcas línea a línea, recordando de qué línea de la fuente sale cada una. El build y `kit:own` la usan los dos, así que «las mismas funciones del build» (decisión 6 de la spec) es literal. `stripMarks` no cambia, porque la usa `kit:copies` con `outputOf`.
4. **Clasificar un fichero**: `build/sources.ts` gana `kindOf(registry, file)`, que reutiliza `covers` y la misma precedencia que `classify`, para que `kit:own` y `classify` no discrepen.
5. **El texto del kit de una copia**: `tests/copies/annotated.ts` exporta `kitBlockLines`, sobre el `Reader` que ya existe, para no escribir un segundo lector de marcas.
6. **Ficheros de `kit:own`**: `tests/own/`, como `tests/copies/` y `tests/skill-size/`, con un fichero por comprobación (`kit-text.ts`, `repeated.ts`, `exceptions.ts`, `spanish.ts`) y `check.ts` de entrada.
7. **Coste**: ~3 h de implementación, sin subagentes en las tasks; la revisión final, ~2 $ (dos ejes).
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `moon run kit:own` y `moon run kit:skill-size` dan rojo con `fichero:línea` en cada clase de la spec, y el build expande `<!-- kit: incluye <nombre> -->`.

**Architecture**: la inclusión vive en el build (`build/dist.ts`), porque cambia lo que viaja. Las comprobaciones viven en `tests/own/` y `tests/skill-size/`, tareas moon fuera del gate, como `kit:copies`. `kit:own` lee `skills/` con `renderLines` del build y `kitBlockLines` de `kit:copies`, y nombra las líneas de `dist/`.

**Tech Stack**: TypeScript que Node ≥ 22.18.0 ejecuta sin compilar; Vitest en `cli/test/kit/`; moon 2.6.0 (`moon.yml` de la raíz).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 4 tasks encadenadas por dos interfaces (`renderLines` de la Task 1 y `skillLines` de la Task 2), cada error lo caza el test de su task antes de llegar a la rama, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no entra ningún módulo, dependencia ni contrato entre módulos nuevo: `tests/own/` sigue el patrón de `tests/copies/`, y la inclusión es una marca más del build que ya existe.

## Restricciones globales

### De código

- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Node ≥ 22.18.0, TypeScript sin build (`erasableSyntaxOnly`: sin `enum`, sin parameter properties), sin dependencias nuevas.
- Todo `.md` que se lee se normaliza a LF antes de partirlo en líneas; los avisos nombran rutas con `/`.
- Los textos de aviso son literales de la spec (Task de cada uno); no se parafrasean.

### De proceso

- Política de modelos de `sdd-implement`; `fable` y `opus xhigh`, prohibidos.
- Native: la sesión implementa; un commit por task al quedar limpia (`commit-milestones.md`).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; mensajes por `git commit -F <fichero del scratchpad>` (el hook bloquea tokens `/palabra`).

## Review Focus

- Una inclusión cuyo fichero acaba sin salto de línea → la salida no pega la línea siguiente a la última incluida: se añade el `\n` que falte · Task 1, `adds the missing newline of an include`
- Una racha de 10 palabras repetida dentro del mismo fichero de una skill y también en otra → una sola línea con los tres sitios, no dos · Task 2, `lists every site of the same run once`
- Un `SKILL.md` que se manda invocar a sí mismo (`invoke \`sdd-x\`` dentro de `sdd-x`) → no cuenta dos veces en su fase · Task 4, `does not count a skill invoking itself`
- `kit:own` con `skills/` sin `upstream.json` legible → falla con el mensaje de `readRegistry`, no con un rojo de cada fichero · Task 2, `fails on an unreadable registry`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres comprobaciones de texto sobre una sola lectura (`skillLines`), y la fase dentro de la tarea de tamaño que ya existe.
- [x] **YAGNI gate**: ninguna abstracción nueva; `renderLines` y `kindOf` tienen dos usos reales cada una (build y `kit:own`; `classify` y `kit:own`).
- [x] **Brownfield gate**: `stripMarks`, la gramática de `kit:copies` y la lista blanca no cambian; `dist/` sale igual byte a byte con las fuentes de hoy, que no llevan inclusiones.
- [x] **Constitution check**: Art. III (mensajes en castellano), Art. VIII (las plantillas no se tocan), Art. X (restricciones de arriba), Art. XI (lo aprendido, al walkthrough).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/own/kit-text.ts` — `skillLines`: cada línea de salida de los `.md` de `skills/` y de `includes/`, con su ruta en `dist/`, su número, su región y si es texto del kit.
- `tests/own/repeated.ts` — la frase repetida.
- `tests/own/exceptions.ts` — la absoluta con excepción y el corte de frase.
- `tests/own/spanish.ts` — la prosa en castellano.
- `tests/own/check.ts` — `ownReport`, `checkOwn` y la entrada de `kit:own`; la inclusión en una copia.
- `tests/own/package.json` — `{"type": "module"}`, como `tests/copies/package.json`.
- `cli/test/kit/own.test.ts` — los tests de `kit:own`.
- `cli/test/fixtures/own/spanish-sample.md` — la muestra etiquetada del castellano.

**Modificar**:

- `build/dist.ts` — `renderLines`, `includesFrom`, avisos de la inclusión; `buildDist` usa `renderLines`.
- `build/sources.ts` — `kindOf`.
- `tests/copies/annotated.ts` — exporta `kitBlockLines`.
- `tests/skill-size/check.ts` — la fase.
- `moon.yml` — la tarea `own`.
- `.gitattributes` — `includes/** text eol=lf` y `cli/test/fixtures/own/** text eol=lf`.
- `cli/test/kit/dist.test.ts`, `cli/test/kit/copies.test.ts`, `cli/test/kit/skill-size.test.ts` — sus tests nuevos.
- `CLAUDE.md` (regla 5), `.docs/sdd/tech-stack.md` (línea 6), `.docs/sdd/architecture.md` (estructura).

**NO se tocan**:

- `skills/` — ninguna skill cambia ni gana una inclusión real (0296, 0305-0310, 0314, 0316).
- `.githooks/pre-commit`, `.github/workflows/ci.yml` — la 0311.
- `stripMarks` y la gramática de `parseMark` — `kit:copies` sigue igual.

### 1.6 Dependencias

- La maquinaria de la 0300 (build) y la 0302 (`annotated.ts`, `sources.ts`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La heurística del castellano da falsos positivos en skills en inglés con literales sin citar | media | rojo que se ignora | RED con la muestra antes del GREEN; contrato de mínimo de `red/spanish-inventory.md` y revisión a mano de cada fichero de más (Task 3) |
| `renderLines` cambia un byte de `dist/` | baja | `dist.test.ts` rojo | `dist.test.ts` («dist/ is what the build outputs») corre en la Task 1 |
| Los números de línea de `dist/` no cuadran con la fuente | media | avisos con la línea equivocada | test que comprueba la línea de `dist/` tras una marca quitada y una inclusión (Task 2) |

### 1.8 Rollout

Directo: herramientas del repo, fuera del pre-commit y de la CI.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La inclusión en el build

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/dist.test.ts`, `cli/test/kit/copies.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/dist.test.ts test/kit/copies.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:build` → `dist/: <n> ficheros desde .`, y `git status --short dist` sin cambios de contenido
**Se prueba en la aplicación**: no, porque base común: ninguna skill lleva todavía una inclusión.

**Interfaces**:
- Consume: nada.
- Produce, en `build/dist.ts`:
  - `export interface OutputLine { text: string; source: number | null }` — `text` con su salto de línea; `source`, la línea de la fuente en base 0, o `null` si viene de una inclusión.
  - `export type IncludeReader = (name: string) => string | null`
  - `export function renderLines(text: string, file: string, readInclude: IncludeReader): OutputLine[]`
  - `export function includesFrom(repoRoot: string): IncludeReader` — lee `includes/<name>.md` en LF, `null` si no existe; lanza `BuildError` si lleva una línea `<!-- kit: … -->`.
  - `export const INCLUDE_MARK = /^\s*<!-- kit: incluye ([a-z0-9-]+) -->\s*$/`

**Ficheros**: modificar `build/dist.ts`, `.gitattributes`, `.docs/sdd/architecture.md`; tests en `cli/test/kit/dist.test.ts` y `cli/test/kit/copies.test.ts`.

- [ ] **Step 1: Implementación**
  - `renderLines` recorre las líneas con `nextBlock`, como `stripMarks`. Una línea que casa `INCLUDE_MARK` en la región `text` se sustituye por las líneas del fichero, cada una con `source: null`, añadiendo el `\n` final si falta. En una valla lanza `BuildError` `${file}:${n}: una inclusión va en el texto, fuera de un bloque de código`; en el frontmatter, el aviso de marca mal puesta de hoy (`isMarkToDrop`). Si `readInclude` da `null`, lanza `${file}:${n}: la inclusión ${name} no existe: crea includes/${name}.md`. Las demás líneas siguen `isMarkToDrop`.
  - `includesFrom` lanza `includes/${name}.md: una inclusión no lleva marcas del kit`.
  - `buildDist(repoRoot, files, outDir)`: un `.md` se escribe con `renderLines(text, file, includesFrom(repoRoot)).map((line) => line.text).join('')`.
  - `.gitattributes`: `includes/** text eol=lf` y `cli/test/fixtures/own/** text eol=lf`.
  - `architecture.md`, en «Estructura del repo», tras `skills/`: `├── includes/                    (una regla que necesitan dos skills propias: el build la pone donde va su <!-- kit: incluye <nombre> -->; no viaja)`.
  - Tests en `dist.test.ts`, `describe('renderLines')`:
    - `expands an include and strips the other marks`: fuente `a\n<!-- kit: incluye user-language -->\n<!-- kit: 0186 -->\nb\n`, include `Write everything.\n` → `expect(texts).toBe('a\nWrite everything.\nb\n')` y `expect(lines.map((l) => l.source)).toEqual([0, null, 3])`.
    - `adds the missing newline of an include`: include `x` sin `\n` → `'a\nx\nb\n'`.
    - `fails on a missing include`: `toThrow('skills/a/SKILL.md:2: la inclusión user-language no existe: crea includes/user-language.md')`.
    - `fails on an include inside a fence`: `toThrow('skills/a/SKILL.md:3: una inclusión va en el texto, fuera de un bloque de código')`.
    - `fails on an include in the frontmatter`: `toThrow('marca mal puesta')`.
    - `includesFrom fails on an include with a kit mark`: `toThrow('includes/x.md: una inclusión no lleva marcas del kit')`.
  - En `describe('buildDist')`: `writes includes and leaves includes/ out of dist` — con `includes/user-language.md` en el repo temporal, `dist/skills/a/SKILL.md` lleva el texto y `existsSync(join(out, 'includes'))` es `false`.
  - En `copies.test.ts`, junto a los de la gramática: `rejects an include in an annotated copy` → `checkCopy` da un problema con `message: 'marca del kit sin tarea o con un campo desconocido: incluye user-language'`.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: `dist/` igual (ninguna fuente lleva inclusiones).
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(build): expandir las inclusiones <!-- kit: incluye … --> desde includes/`.

### Task 2 — `kit:own`: el texto del kit, la frase repetida, la absoluta con excepción y la inclusión en una copia

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/own.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/own.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:own` → sale con 1 y una línea por rojo
**Se prueba en la aplicación**: no, porque base común: herramienta del repo; su salida sobre el kit real va al walkthrough.

**Interfaces**:
- Consume: `renderLines`, `includesFrom`, `listSources`, `nextBlock` de `build/dist.ts`; `readRegistry` de `build/sources.ts`; `Problem`, `formatProblem` de `tests/copies/annotated.ts`.
- Produce:
  - `build/sources.ts`: `export function kindOf(registry: Registry, file: string): 'own' | 'copy' | 'pending' | null`.
  - `tests/copies/annotated.ts`: `export function kitBlockLines(file: string, annotated: string): Set<number>` — líneas de la fuente (base 0) dentro de un bloque `add` o `sustituye`.
  - `tests/own/kit-text.ts`: `export interface SkillLine { file: string; line: number; text: string; region: 'front' | 'text' | 'code'; kit: boolean; copy: boolean; included: boolean }` (`file`: `dist/skills/<skill>/…` o `includes/<nombre>.md`; `line`: base 1 en la salida) y `export function skillLines(repoRoot: string, files: string[]): SkillLine[]`, con `files` las rutas de `skills/` que da `listSources`.
  - `tests/own/repeated.ts`: `export function repeatedProblems(lines: SkillLine[]): Problem[]`.
  - `tests/own/exceptions.ts`: `export function sentencesOf(lines: SkillLine[]): { file: string; line: number; text: string }[]` y `export function exceptionProblems(lines: SkillLine[]): Problem[]`.
  - `tests/own/check.ts`: `export function ownReport(repoRoot: string, files: string[]): { code: number; lines: string[] }` y `export async function checkOwn(repoRoot: string): Promise<{ code: number; lines: string[] }>`, que es `ownReport(repoRoot, await listSources(repoRoot))`; corre como entrada con `node tests/own/check.ts`.

**Ficheros**: crear `tests/own/{kit-text,repeated,exceptions,check}.ts`, `tests/own/package.json`, `cli/test/kit/own.test.ts`; modificar `build/sources.ts`, `tests/copies/annotated.ts`, `moon.yml`.

- [ ] **Step 1: Implementación**
  - `skillLines`: los `.md` de `files` bajo `skills/`, más los de `includes/` del disco. Para cada uno, `renderLines` con `includesFrom(repoRoot)`, y la región de cada línea con `nextBlock`. `kit` es `true` si: el fichero es `own` y la línea no es `included`; es `pending`; es `copy` y su `source` está en `kitBlockLines`; o el fichero es de `includes/`. `copy` es `true` para `copy` y `pending`.
  - `repeatedProblems`: fuera de `sdd-templates/templates/` y `sdd-upgrade/references/migrations/`, y solo en la región `text` sin código en línea (`` `…` ``). Los elementos (párrafo, elemento de lista, título, celda de tabla) se parten en palabras `/[\p{L}\p{N}'’-]+/gu` en minúsculas, y las rachas de 10 se indexan por skill (`dist/skills/<skill>/`). Una pareja cuenta si las skills son distintas, al menos un lado es `kit` y no son los dos `kit && copy`. Las rachas que avanzan de una en una en todos sus sitios se juntan; las rachas máximas con las mismas 10 primeras palabras van en una línea, con sus sitios ordenados por ruta. Mensaje, literal: `` `${sites}` repiten «${first10}»: déjala en un solo sitio, en includes/ si la necesitan varias propias `` con `sites` = `a:1 y b:2` o `a:1, b:2 y c:3`; el `Problem` va sin `line` y con `file` = esa lista.
  - `sentencesOf`: frases de las líneas `kit` en la región `text`, sin código en línea. Corta en `[.?!]` seguido de espacio o fin, y al acabar el elemento; no corta tras `e.g.`, `i.e.`, `etc.` ni `vs.`, ni dentro de «…».
  - `exceptionProblems`: `/\b(only|never|always|must|every)\b/i` y `/\b(except|unless|instead of)\b/i` en la misma frase → `{ file, line, message: \`absoluta con excepción en la misma frase («${absolute}» … «${exception}»): sustituye la regla por una que ya diga su caso\` }`, con la primera de cada una en minúsculas.
  - `ownReport`: reúne `repeatedProblems`, `exceptionProblems` y la inclusión en una copia. Esta última sale de cada línea de un fichero `copy` o `pending` de `skills/` que casa `INCLUDE_MARK` en la fuente: `{ file: <ruta en skills/>, line, message: \`una inclusión es solo de las propias, y ${file} es una copia\` }`. Con problemas, `{ code: 1, lines: problems.map(formatProblem) }`; sin ellos, `{ code: 0, lines: [\`Skills al día: ${n} ficheros.\`] }`.
  - `moon.yml`, junto a `copies`: tarea `own` con `command: node`, `args: [tests/own/check.ts]`, `deps: ['~:build']`, `options: { cache: false }`, y el comentario `# Fuera del pre-commit y de la CI: las propias entran en rojo hasta que su fila las reescribe.`
  - Tests en `own.test.ts`, con `ownReport` sobre un directorio temporal sin git (`skills/`, `includes/`, `upstream.json` con `own` y copias) y la lista de ficheros escrita en el test:
    - `reports a run of 10 words repeated in two own skills` → `'dist/skills/example-a/SKILL.md:3 y dist/skills/example-b/SKILL.md:3 repiten «write everything the user reads in their language skill announcements»: déjala en un solo sitio, en includes/ si la necesitan varias propias'`.
    - `joins a run of 12 words in one line`; `reports two separate runs of the same pair twice`; `lists every site of the same run once` (tres skills, `a:…, b:… y c:…`).
    - `does not cross a blank line, a list item, a heading or a table cell`; `ignores inline code and fenced code`.
    - `ignores two copies that share a run`; `reports a copy block that repeats an own skill`.
    - `ignores a run that two skills include; reports it written by hand in a third`.
    - `ignores runs within one skill, in templates and in migrations`; `counts a pending copy as kit text`.
    - `reports an absolute with its exception in one sentence` (`«never» … «except»`); `does not cut after e.g.` (`Never skip the gate, e.g. for a typo, unless the user asks.` → rojo); `ignores an absolute and an exception in two sentences`; `ignores an original sentence of a copy`; `names includes/<nombre>.md:<línea> for an include`.
    - `reports an include in a copy, pending too`.
    - `reports dist line numbers after a stripped mark and an include`.
    - `prints Skills al día with no problems` → `{ code: 0, lines: ['Skills al día: 3 ficheros.'] }`.
    - `fails on an unreadable registry` → rechaza con el mensaje de `readRegistry`.
- [ ] **Step 2: Build** — `moon run kit:build`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; la salida real de `moon run kit:own` se guarda en el scratchpad para el walkthrough.
- [ ] **Step 4: Commit de la task** — `feat(tests): kit:own, la frase repetida y la absoluta con excepción en rojo`.

### Task 3 — La prosa en castellano, con su RED

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/own.test.ts` (`describe('isSpanish')`), con `cli/test/fixtures/own/spanish-sample.md`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/own.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:own` → los 21 ficheros de `red/spanish-inventory.md` entre los rojos de castellano
**Se prueba en la aplicación**: no, porque base común: herramienta del repo.

**Interfaces**:
- Consume: `SkillLine`, `skillLines`, `ownReport` de la Task 2.
- Produce: `tests/own/spanish.ts`: `export function isSpanish(text: string): boolean` y `export function spanishProblems(lines: SkillLine[]): Problem[]`.

**Ficheros**: crear `tests/own/spanish.ts`, `cli/test/fixtures/own/spanish-sample.md`; modificar `tests/own/check.ts`, `cli/test/kit/own.test.ts`.

- [ ] **Step 1: RED** — `spanish-sample.md` con dos secciones, `## es` y `## en`, una línea de muestra por línea, sacadas del kit real: títulos cortos (`## Restricciones de código`), celdas de tabla, líneas de lista, la cita «(ticket de la task 0057)» suelta en una línea en inglés (`en`: va entre «…»), líneas en inglés con código en línea o citas en castellano (`Open with \`Ahora: <qué haces>\` and a counter like «van 7 de 15».`), y líneas en inglés con nombres propios (`superpowers`, `Wondel`). Al menos 20 por sección. Test `classifies every line of the sample`: cada línea de `## es` da `isSpanish === true` y cada una de `## en`, `false`. Se ejecuta con la heurística de `develop` (`red/spanish-inventory.md`) en `isSpanish`, y se apuntan en el walkthrough las líneas que falla. Ese es el RED.
- [ ] **Step 2: GREEN** — `isSpanish` quita el código en línea, las citas «…», los destinos de enlace `](…)` y lo que va entre comillas dobles. Decide con las señales que el RED pida, partiendo de la de `develop` (palabras gramaticales, tildes, ñ, ¿ y ¡), hasta que pase la muestra. `spanishProblems` mira las líneas `text` de todo fichero salvo `sdd-templates/templates/`, más la `description` del frontmatter, y da `{ file, line, message: \`prosa en castellano; las skills van en inglés: «${abbreviated}»\` }`, con la línea entera hasta 12 palabras y, si pasa, sus 12 primeras y `…` (con 12, la línea del THEN de la spec sale entera). `ownReport` lo suma.
- [ ] **Step 3: Contraste con el kit real** — `moon run kit:own`: cada fichero de `red/spanish-inventory.md` tiene al menos un rojo de castellano. Cada fichero de más se abre a mano: si su línea es castellano, entra en la tabla de `red/spanish-inventory.md` con su línea; si no, es un falso positivo, va a la muestra (`## en`) y se vuelve al Step 2.
- [ ] **Step 4: Verificación** y **commit de la task** — `feat(tests): kit:own da rojo con la prosa en castellano de las skills`.

### Task 4 — El tamaño por fase y los docs

**Tras**: Task 3
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/skill-size.test.ts`
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skill-size.test.ts test/kit/word-budget.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:skill-size` → sale con 1 por las 5 skills de hoy y escribe la línea de la fase mayor
**Se prueba en la aplicación**: no, porque base común: herramienta del repo.

**Interfaces**:
- Consume: nada de las tasks anteriores.
- Produce, en `tests/skill-size/check.ts`: `export function invokedSkills(text: string, self: string, names: string[]): string[]` y `checkSkillSize(repoRoot)` con las líneas de la fase.

**Ficheros**: modificar `tests/skill-size/check.ts`, `cli/test/kit/skill-size.test.ts`, `CLAUDE.md`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Implementación**
  - `invokedSkills`: en el cuerpo sin frontmatter ni bloques de código, partido en frases con el corte de `sentencesOf` (decisión 11 de la spec: `.`, `?`, `!` con espacio o fin, sin `e.g.`, `i.e.`, `etc.`, `vs.`), los nombres de `names` distintos de `self` que casan `` /(?:invoke|load|\*\*REQUIRED SUB-SKILL:\*\*)\s+`(?:sdd-kit:)?([a-z0-9-]+)`/i `` o `` /`(?:sdd-kit:)?([a-z0-9-]+)`[^`]*?with (?:the )?`Skill`/ ``, sin repetir y en el orden en que aparecen. El corte de frase se importa de `tests/own/exceptions.ts` si su firma lo admite; si no, se extrae a una función común en `tests/own/sentences.ts` que usan los dos.
  - La fase de cada skill: `min(length, 20_000)` de la skill más el de cada invocada, sobre `dist/skills/<x>/SKILL.md`, en caracteres (`string.length`). Con más de 100.000: `` `FALLA: la fase de ${skill} (${invoked.join(', ')}) suma ${total} caracteres (límite: 100000)` ``. Sin rojos de fase: `` `OK: ninguna fase pasa de 100000 caracteres (la mayor, ${skill}: ${total})` ``. La línea `Mueve a su references/ …` sigue solo tras los rojos de bytes.
  - Tests nuevos: `fails on a phase of 100.001 characters` (`lead` de 20.000 que invoca `a`-`e` de 19.000 → `FALLA: la fase de lead (a, b, c, d, e) suma 115000 caracteres (límite: 100000)`); `passes a phase of exactly 100.000`; `counts invoke, load and REQUIRED SUB-SKILL`; `counts only the last name before with Skill` (`closing in \`b\`: invoke \`c\` with \`Skill\`` → `['c']`); `ignores a name without an invoking form and one in a code block`; `does not count a skill invoking itself`; `caps each skill at 20.000`. Se actualiza `pasa con un SKILL.md de 19.999 bytes` para esperar también `OK: ninguna fase pasa de 100000 caracteres (la mayor, cabe: 19999)`.
  - `CLAUDE.md:34`: la orden del corte pasa a `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own cli:test-slow cli:test-min`, y el paréntesis suma «ni una fase de más de 100.000 caracteres; `kit:own`, sin reglas repetidas, excepciones pegadas ni castellano: 0304».
  - `tech-stack.md:6`: tras «`kit:skill-size` (ningún `SKILL.md` de 20.000 bytes o más, patch 0298)», «y por fase, 0304», y en la misma enumeración `kit:own` (las propias, [`kit-distribution`](capabilities/kit-distribution.md)).
- [ ] **Step 2: Build** — `moon run kit:build`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; la salida real de `kit:skill-size` va al walkthrough.
- [ ] **Step 4: Commit de la task** — `feat(tests): kit:skill-size mide también la fase`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 3 h (2,5-4)
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 4 tasks de tooling con TDD; la 0312 (M, tooling y anotación) salió en 1,59 h frente a 4 h; la heurística del castellano es la incertidumbre (RED, quizá dos vueltas)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `moon run kit:own` y `moon run kit:skill-size` sobre la rama, con su salida en el walkthrough
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `cli:test-min` antes del push (ticket de la 0312 §2)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «La skill que carga…», THEN y AND vigentes → Task 1, los tests de `stripMarks` y `buildDist` que ya existen. ✓
- AND inclusión en bloque de código → Task 1, `fails on an include inside a fence`. ✓
- AND la inclusión se sustituye antes de quitar las demás → Task 1, `expands an include and strips the other marks`. ✓
- AND marca mal puesta (frontmatter) → Task 1, `fails on an include in the frontmatter`. ✓
- ADDED «Una inclusión…», THEN → Task 1, `writes includes and leaves includes/ out of dist`; AND `dist/` sin `includes/` → el mismo. ✓
- AND inclusión que no existe → Task 1, `fails on a missing include`. ✓
- AND inclusión con marcas → Task 1, `includesFrom fails on an include with a kit mark`. ✓
- AND `kit:copies` en una copia anotada → Task 1, `rejects an include in an annotated copy`. ✓
- AND `kit:own` en cualquier copia → Task 2, `reports an include in a copy, pending too`. ✓
- ADDED «Una frase… repetida», THEN → Task 2, `reports a run of 10 words repeated in two own skills`. ✓
- AND palabra y racha → Task 2, el mismo y `ignores inline code and fenced code`. ✓
- AND no cruza → Task 2, `does not cross a blank line, a list item, a heading or a table cell`. ✓
- AND 12 palabras / dos rachas → Task 2, `joins a run of 12 words in one line`, `reports two separate runs of the same pair twice`. ✓
- AND tres skills → Task 2, `lists every site of the same run once`. ✓
- AND dos copias / bloque de copia contra propia → Task 2, `ignores two copies that share a run`, `reports a copy block that repeats an own skill`. ✓
- AND inclusión en dos, a mano en una tercera → Task 2, `ignores a run that two skills include; reports it written by hand in a third`. ✓
- AND misma skill, plantillas, migraciones → Task 2, `ignores runs within one skill, in templates and in migrations`. ✓
- AND `pending` entera → Task 2, `counts a pending copy as kit text`. ✓
- ADDED «Una absoluta…», THEN y AND de las palabras → Task 2, `reports an absolute with its exception in one sentence`. ✓
- AND el corte y `e.g.` → Task 2, `does not cut after e.g.`; la siguiente frase → `ignores an absolute and an exception in two sentences`. ✓
- AND código y original de una copia → Task 2, `ignores inline code and fenced code`, `ignores an original sentence of a copy`. ✓
- AND `includes/<nombre>.md:<línea>` → Task 2, `names includes/<nombre>.md:<línea> for an include`; en el castellano, Task 3, el mismo caso en `spanishProblems`. ✓
- ADDED «La prosa en castellano…», THEN, línea corta, código y citas → Task 3, `classifies every line of the sample` y la muestra. ✓
- AND exclusiones (plantillas, frontmatter salvo `description`, código, citas) → Task 3, casos de `spanishProblems` con un fichero de `sdd-templates/templates/` y un frontmatter. ✓
- ADDED «Lo que dice kit:own», THEN → Task 2, `moon run kit:own` sale con 1 (Verificación) y `deps: ['~:build']` en `moon.yml`; AND `Skills al día` → `prints Skills al día with no problems`; AND fuera del pre-commit y la CI → `.githooks/pre-commit` y `ci.yml` no se tocan (§1.1). ✓
- ADDED «Ninguna skill ni ninguna fase…», THEN → Task 4, el test de 20.000 bytes que ya existe; AND 115.000 → `fails on a phase of 100.001 characters`; AND mín y 100.000 exactos → `caps each skill at 20.000`, `passes a phase of exactly 100.000`; AND formas de invocar → `counts invoke, load and REQUIRED SUB-SKILL`, `counts only the last name before with Skill`; AND sin forma, en código, solo directas → `ignores a name without an invoking form and one in a code block` (las directas: `invokedSkills` solo lee la skill dada); AND OK → `pasa con un SKILL.md de 19.999 bytes`. ✓
- Reglas de la capacidad → la fusión del delta al cerrar (`sdd-archive`), con `sdd capability merge` ya probado (spec, decisión 20). ✓
- Tabla «Lo que se retira o cambia de forma» → Task 1 (`dist.test.ts`, `copies.test.ts`, `build/dist.ts`), Task 4 (`CLAUDE.md`, `tech-stack.md`, `skill-size.test.ts`); `moon.yml:51-52`, sin cambio. ✓
- Review Focus → Task 1, `adds the missing newline of an include`; Task 2, `lists every site of the same run once` y `fails on an unreadable registry`; Task 4, `does not count a skill invoking itself`. ✓
