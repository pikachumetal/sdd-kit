---
id: 20261103-173149-feature-0300-skill-source-build-dist
feature: 0300
title: Plan de implementación — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit
spec: ./spec.md
status: approved
created: 2026-11-03
---

# Plan de implementación — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native. La sesión implementa las cuatro tasks con su modelo, que hoy es Opus 5.5. La revisión final sale en ejes, como fija `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`; Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura con `sdd-kit:effort-high` + `opus`, porque el eje es `sí`.
2. **Ejecución**: native (ver la línea `Ejecución`).
3. **El build se parte en dos funciones**: `listSources` (un `git ls-files`) y `buildDist`, que recibe la lista. Así los tests unitarios no lanzan git, y el de frescura del repo solo hace un `git ls-files`, la misma excepción que `path-length.test.ts` en `tech-stack.md` §«Conjunto rápido y tests lentos». El repo de juguete con ficheros ignorados y la ejecución de `dist/cli/bin/sdd.js` van en `dist.slow.test.ts`.
4. **`kit:test-headless` gana `/dist/**` y `/build/**` en sus `inputs`**, porque la copia del kit para sujetos sale ahora de `dist/`.
5. **El fallo de build en `start-kit-session.mjs` se prueba a mano** (Task 2, Step 3). Es un `try/catch` de tres líneas, y probarlo con un test obligaría a copiar el script y `build/` a un repo de juguete.
6. **La prueba de instalación se versiona** en `install/` de la carpeta de la spec: el servidor git HTTP (`githttp.mjs`), el guion (`install.mjs`) y su salida (`install.md`). Va en la Task 4.
7. **Riesgo alto**: el texto legal de los `NOTICE` al regenerarlos. Lo cubre el Step 1 de la Task 3, que compara las líneas `Copyright` y el cuerpo MIT antes de sustituirlos.
8. **Coste estimado**: unas 4 h de implementación y los tres ejes de la revisión final (~3-4 $). Sin sujetos.
9. **Review Focus**: 6 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que el plugin instalado venga de `dist/`, construido desde `skills/` con una lista blanca, y que la versión de cada fuente de terceros viva solo en `upstream.json`.

**Architecture**: `build/` es una carpeta nueva de herramientas del repo, que no viaja. `build/dist.ts` lista los ficheros con git, quita las marcas de los `.md` y sincroniza `dist/`. `build/sources.ts` lee `upstream.json`, y genera la tabla de `THIRD_PARTY_NOTICES.md` y los `NOTICE`; `tests/upstream/check.ts` también lo usa. La CLI no cambia: `dist/cli` resuelve `dist/skills` porque las rutas son relativas.

**Tech Stack**: TypeScript que Node ≥ 22.18.0 ejecuta sin compilar; Vitest en `cli/`; moon 2.6.0; git. Ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 4 tasks encadenadas por `build/dist.ts`, un error lo caza el test de su task y el pre-commit (que corre el test de `dist/`), y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `build/`, el contrato `upstream.json` (lo leerán la 0302 y la 0304) y la forma del plugin que consume Claude Code (`marketplace.json` → `./dist`).

## Restricciones globales

### De código

- Node ≥ 22.18.0, TypeScript sin compilar ni dependencias nuevas (`.ts` con `import … from '….ts'`, como `tests/upstream/check.ts`).
- Lista blanca exacta de `dist/`: `.claude-plugin/plugin.json`, `agents/`, `cli/bin/`, `cli/src/`, `cli/package.json`, `hooks/`, `skills/`, `LICENSE`, `THIRD_PARTY_NOTICES.md`.
- Ninguna frase de ninguna skill cambia: ningún `.md` de `skills/` ni de `agents/` se edita. Los `NOTICE` sí se regeneran (Task 3).
- Mensajes literales:
  - `dist/ no es lo que sale del build: ejecuta moon run kit:build`
  - `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`
  - `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices`
  - `<fuente>: licencia <licencia> sin plantilla en build/notices.ts`
  - `start-kit-session: arregla la fuente y vuelve a lanzarlo; dist/ no se ha tocado.`
- Constitution, Art. X: **sin comentarios que repitan el código**. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible. **Sin comentarios que citen documentos**: nunca la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones de 20 líneas o menos y 3 parámetros o menos, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Código que llama a git: limpia `GIT_DIR` y compañía del entorno del hijo (usa `git` de `cli/src/git/git.ts`, que ya lo hace).

### De proceso

- Política de modelos: la de `sdd-implement`; modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Ejecución: native.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Antes de commitear, `git diff --cached --name-only`. Sin `*` suelto ni tokens `/palabra` en la orden; el mensaje, con `git commit -F <fichero del scratchpad>`.
- Antes de cada commit que toque `skills/`, `agents/`, `hooks/`, `cli/src/`, `cli/bin/`, `.claude-plugin/plugin.json`, `LICENSE` o `THIRD_PARTY_NOTICES.md`: `moon run kit:build`.

## Review Focus

- Un `.md` de `agents/` con una marca → sale sin ella, como uno de `skills/` · Task 1, `strips marks from every travelling markdown file`.
- Una fuente en CRLF (la copia de trabajo en Windows) → la línea de marca sale con su `\r\n`, sin dejar un `\r` suelto · Task 1, `strips a whole-line kit mark with its LF and CRLF`.
- Un fichero borrado de la copia de trabajo pero aún en el índice (`git ls-files --cached` lo lista) → se salta, no rompe el build · Task 1, `skips listed files that no longer exist`.
- `dist/` comparado en un clon con `core.autocrlf=true` y en la CI con LF → igual tras normalizar · Task 1, `dist/ is what the build outputs` (normaliza a LF).
- Una entrada del registro con dos rutas en `kit` → `<kit>` las une con «, » · Task 3, `joins the kit paths of an entry`.
- `start-kit-session.mjs` con una marca mal puesta → no lanza claude y sale con 1 · Task 2, Step 3 (a mano, decisión 5).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un build de copia más filtro de líneas; el registro es un JSON plano; sin verbo nuevo en la CLI.
- [x] **YAGNI gate**: la marca solo se quita; su significado lo trae la 0302. Sin plantillas de licencia salvo MIT, la única que usan las copias.
- [x] **Brownfield gate**: la CLI no cambia; los lectores relativos siguen igual; la lista vieja de `git archive` se conserva para commits anteriores.
- [x] **Constitution check**: Art. VIII cambia de letra con la aprobación de la spec (decisión 1) y la ADR 0023; Art. V, una ruta; Art. X en las Restricciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `build/dist.ts` — la lista blanca, `listSources`, `stripMarks`, `buildDist`, `syncDir` y la orden `node build/dist.ts`.
- `build/sources.ts` — los tipos y la carga de `upstream.json`, `renderSourcesTable` y `renderNotice`.
- `build/notices.ts` — la orden `node build/notices.ts`, que escribe `THIRD_PARTY_NOTICES.md` (sección `## Fuentes`) y los `NOTICE`.
- `upstream.json` — el registro.
- `dist/` — generado.
- `.ignore` — `dist/`.
- `cli/test/kit/dist.test.ts`, `cli/test/kit/dist.slow.test.ts`, `cli/test/kit/notices.test.ts`.
- `.docs/sdd/decisions/0023-dist-committed.md` — la ADR.
- `.docs/sdd/specs/<carpeta>/install/` — `githttp.mjs`, `install.mjs` e `install.md`.

**Modificar**:

- `.claude-plugin/marketplace.json` — `"source": "./dist"`.
- `.gitattributes` — `dist/** -diff linguist-generated`.
- `moon.yml` — las tareas `build` y `notices`; `skill-size` con `deps: ['~:build']`; `test-headless` con `/dist/**` y `/build/**` en `inputs`.
- `tests/skill-size/check.ts`, `cli/test/kit/skill-size.test.ts` — miden `dist/skills/`.
- `start-kit-session.mjs`, `.claude/hooks/kit-session-source.mjs`, `cli/test/kit/kit-session-source.slow.test.ts`.
- `tests/headless/{battery,campaign,lib}.mjs`, `cli/test/kit/headless/{campaign,lib,molds}.test.ts`.
- `tests/upstream/check.ts`, `cli/test/kit/upstream-watch.slow.test.ts`.
- `THIRD_PARTY_NOTICES.md`, `skills/*/NOTICE` (los once) — regenerados.
- `cli/test/kit/manifests.slow.test.ts` — solo si `claude plugin validate` del marketplace cambia con `./dist`.
- `CLAUDE.md` (índice, reglas 1 y 5), `README.md` (§ probar el kit desde tu clon).
- `.docs/sdd/constitution.md` (Art. V y VIII), `.docs/sdd/architecture.md` (árbol), `.docs/sdd/tech-stack.md` (líneas 19, 138, 158 y 324), `.docs/sdd/mission.md` (glosario).

**NO se tocan**:

- `cli/src/**`, `cli/bin/**` — resuelven `../../../skills` relativo a sí mismos; desde `dist/` ya caen en `dist/skills` (decisión 3 de la spec).
- `cli/test/init/init.slow.test.ts`, `cli/test/kit/workflow-docs.test.ts` — leen el `plugin.json` de la raíz, el único donde se escribe la versión (decisión 4 de la spec).
- Todo `.md` de `skills/` y `agents/` — ninguna frase cambia.
- Los tests de contenido que leen `skills/` (`skills.test.ts`, `word-budget.test.ts`, `docs-integrity.test.ts`…) — siguen en la fuente (decisión 13 de la spec).

### 1.6 Dependencias

- Clones de `SDD_UPSTREAM_DIR` (`D:/code/github/upstream` en esta máquina), para rellenar las `paths` del registro y para `kit:upstream`.
- Claude Code 2.1.317 para la prueba de instalación (Task 4).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un `NOTICE` regenerado pierde texto legal | media | alto | Task 3, Step 1: comparar `Copyright` y cuerpo MIT antes de escribir |
| `path-length.test.ts` rojo por las rutas de `dist/` | baja | medio | Task 1 corre ese test; la ruta más larga de `skills/` crece 5 caracteres |
| `claude plugin validate` del marketplace exige `dist/` | media | bajo | Task 1 commitea `dist/` antes; Task 2 ajusta `manifests.slow.test.ts` si cambia |

### 1.8 Rollout

Directo. El primer usuario real llega con el corte de la 3.0.0 (0311), al fusionar en `main`.

### 1.9 Excepciones a la constitution

Ninguna: el Art. VIII se cambia, no se excepciona (decisión 1 de la spec, aprobada).

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Build, `dist/` y marketplace

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/dist.test.ts`, `cli/test/kit/dist.slow.test.ts`, `cli/test/kit/skill-size.test.ts` (actualizado).
**Superficies**: tooling · docs
**Verificación**:
- `pnpm --dir cli exec vitest run test/kit/dist.test.ts test/kit/skill-size.test.ts test/kit/path-length.test.ts` → `Tests  N passed (N)`
- `pnpm --dir cli exec vitest run test/kit/dist.slow.test.ts --test-timeout 120000` → `Tests  N passed (N)`
- `moon run kit:build kit:skill-size` → `kit:skill-size` rojo con las cinco skills de hoy (estado conocido, patch 0298), ahora con rutas `dist/skills/…`.
- `moon run cli:typecheck` → verde.

**Interfaces**:
- Consume: `git(cwd, args)` de `cli/src/git/git.ts`.
- Produce, en `build/dist.ts`:
  - `export const WHITELIST: readonly string[]` — `['.claude-plugin/plugin.json', 'agents/', 'cli/bin/', 'cli/src/', 'cli/package.json', 'hooks/', 'skills/', 'LICENSE', 'THIRD_PARTY_NOTICES.md']` (con `/` final, carpeta).
  - `export class BuildError extends Error`.
  - `export async function listSources(repoRoot: string): Promise<string[]>` — `git ls-files --cached --others --exclude-standard -z`, filtrado por `WHITELIST` y por existencia; rutas con `/`.
  - `export function stripMarks(text: string, file: string): string` — lanza `BuildError` con el mensaje literal de marca mal puesta.
  - `export function buildDist(repoRoot: string, files: string[], outDir: string): void` — escribe en `outDir` (vacío): `.md` por `stripMarks`, lo demás copiado.
  - `export function syncDir(from: string, to: string): void` — escribe en `to` solo los ficheros que difieren, borra los que sobran y las carpetas vacías.
  - `export async function buildInto(repoRoot: string, distDir: string): Promise<void>` — `listSources`, `buildDist` a una carpeta temporal y `syncDir` a `distDir`; si el build lanza, `distDir` no cambia.
  - La orden `node build/dist.ts` hace `buildInto(<raíz>, <raíz>/dist)` y, con `BuildError`, escribe su mensaje y sale con 1.

**Ficheros**: crear `build/dist.ts`, `cli/test/kit/dist.test.ts`, `cli/test/kit/dist.slow.test.ts`, `.ignore`, `dist/`, `.docs/sdd/decisions/0023-dist-committed.md`; modificar `moon.yml`, `.gitattributes`, `.claude-plugin/marketplace.json`, `tests/skill-size/check.ts`, `cli/test/kit/skill-size.test.ts`, `.docs/sdd/constitution.md` (Art. VIII), `.docs/sdd/architecture.md`, `.docs/sdd/tech-stack.md:19`.

- [ ] **Step 1: Tests RED** — en `dist.test.ts`, sin git ni procesos, salvo el último bloque:
  - `strips a whole-line kit mark with its LF and CRLF`: `stripMarks('a\n<!-- kit: 0186 · sustituye: «x» -->\nb\n', 'x.md')` → `'a\nb\n'`; con `\r\n` → `'a\r\nb\r\n'`; con espacios alrededor de la marca, igual.
  - `keeps a kit mark inside a fenced code block`: entre ```` ``` ```` y entre `~~~` (también con la valla sangrada 3 espacios) se conserva literal.
  - `fails on a misplaced kit mark`: con texto delante (`x <!-- kit: a -->`), detrás, sin cerrar (`<!-- kit: a`) y en el frontmatter (entre las dos `---` del principio) → `toThrow('x.md:<n>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código')`.
  - `copies a source without marks byte for byte`: `buildDist` sobre una carpeta temporal con `skills/a/SKILL.md`, `skills/a/NOTICE` y `cli/src/x.ts` → los bytes iguales.
  - `strips marks from every travelling markdown file`: con un `agents/x.md` que lleva una marca, sale sin ella.
  - `skips listed files that no longer exist`: `buildDist` con una ruta listada que no existe no lanza.
  - `syncs dist without emptying it`: `syncDir` borra un fichero sobrante, reescribe uno cambiado y deja intacto (mismo `mtimeMs`) uno igual.
  - Contra el repo, con `vi.setConfig({ testTimeout: 20_000 })`:
    - `dist/ is what the build outputs`: `listSources` y `buildDist` a una carpeta temporal, comparada con `dist/` fichero a fichero y con `\r\n` → `\n`. Si difiere, falla con `dist/ no es lo que sale del build: ejecuta moon run kit:build` y las rutas, una por línea.
    - `dist has no kit mark outside code blocks`: ningún `.md` de `dist/` tiene, fuera de un bloque de código, una línea que contenga `<!-- kit:`.
    - `dist holds only the whitelist`: las entradas de primer nivel de `dist/` y de `dist/cli/` son las de `WHITELIST`.

  En `dist.slow.test.ts`:
  - `takes only tracked or addable files of the whitelist`: un repo de juguete (`git init`) con `skills/a/SKILL.md` commiteado, `skills/a/new.md` sin añadir, `skills/a/node_modules/x.js` ignorado por `.gitignore`, y `tests/t.md` fuera de la lista → `listSources` da `['skills/a/SKILL.md', 'skills/a/new.md']`.
  - `leaves dist untouched when the build fails`: con una marca mal puesta, `buildInto` lanza y `dist/` conserva su fichero previo.
  - `runs the session-start hook from dist`: `node dist/cli/bin/sdd.js hook session-start`, con un proyecto temporal que declara `"version":"2.0.0"` en `.docs/sdd/sdd-kit.json` → la salida trae `name: using-sdd` y el aviso de migraciones, sin stderr. Prueba que `dist/cli` lee `dist/skills`.

  En `skill-size.test.ts`: los ficheros de juguete van en `dist/skills/<nombre>/SKILL.md`, y los mensajes esperados dicen `FALLA: dist/skills/justo/SKILL.md ocupa 20000 bytes (límite: menos de 20000)`.

  Correrlos: rojos (no existe `build/dist.ts`).
- [ ] **Step 2: Implementación**:
  - `build/dist.ts` con las interfaces de arriba.
  - `tests/skill-size/check.ts` lee `join(repoRoot, 'dist', 'skills')` y escribe `dist/skills/<nombre>/SKILL.md` en sus líneas.
  - `moon.yml`:
    - `build: { command: node, args: [build/dist.ts], options: { cache: false } }`;
    - `skill-size` con `deps: ['~:build']`.
  - `.gitattributes`: `dist/** -diff linguist-generated`.
  - `.ignore`: `dist/`.
  - `marketplace.json`: `"source": "./dist"`.
  - `moon run kit:build`, y `dist/` generado.
  - Documentos:
    - Art. VIII: «Ninguna copia, ni en este repo ni en los proyectos» pasa a «Ninguna copia a mano, ni en este repo ni en los proyectos: la de `dist/` la genera el build y un test la compara», con el enlace a la ADR 0023 en su línea *Por qué*.
    - ADR 0023 con la forma de `adr-template.md` (`sdd decision check` en verde):
      - `status: accepted`, `date: 2026-11-03`, `rutas: [dist/**, build/**, .claude-plugin/marketplace.json]`;
      - contexto: la caché de 20.117 ficheros;
      - opciones: `dist/` commiteado o rama `dist` con fuente `github`;
      - decisión: commiteado, por las tres razones de la decisión 1 de la spec;
      - consecuencias: el Art. VIII acotado, `-diff` y `.ignore`;
      - confirmación: `cli/test/kit/dist.test.ts`.
    - `architecture.md`: el árbol, con `dist/`, `build/` y `upstream.json`; la fila de `marketplace.json`, con `source "./dist"`.
    - `tech-stack.md:19`: `(source: `./dist`, construido desde `skills/` con `moon run kit:build`)`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; y `node cli/bin/sdd.js decision check --path .docs/sdd` → sin errores.
- [ ] **Step 4: Commit de la task** — `feat(kit): build de dist/ y marketplace apuntando a ./dist`.

### Task 2 — La sesión de desarrollo y la copia para sujetos desde `dist/`

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/kit-session-source.slow.test.ts`, `cli/test/kit/headless/{lib,campaign}.test.ts` (literales nuevos).
**Superficies**: tooling · docs
**Verificación**:
- `pnpm --dir cli exec vitest run test/kit/kit-session-source.slow.test.ts --test-timeout 120000` → `Tests  N passed (N)`
- `moon run kit:test-headless` → verde
- `pnpm --dir cli exec vitest run test/kit/manifests.slow.test.ts --test-timeout 120000` → verde (si `claude` está en el PATH)
- `rg -n "skills/" start-kit-session.mjs .claude/hooks CLAUDE.md` → toda ruta que manda contrastar o seguir una skill dice `dist/skills/`; `skills/` solo como fuente que se edita.

**Interfaces**:
- Consume: `buildInto(repoRoot, distDir)` y `BuildError` de `build/dist.ts`.
- Produce: nada que usen las tasks siguientes.

**Ficheros**: modificar `start-kit-session.mjs`, `.claude/hooks/kit-session-source.mjs`, `cli/test/kit/kit-session-source.slow.test.ts`, `tests/headless/{battery,campaign,lib}.mjs`, `cli/test/kit/headless/{campaign,lib,molds}.test.ts`, `moon.yml` (`test-headless`), `cli/test/kit/manifests.slow.test.ts` (si hace falta), `CLAUDE.md`, `README.md`, `.docs/sdd/tech-stack.md:138,158`.

- [ ] **Step 1: Tests RED**:
  - `kit-session-source.slow.test.ts`:
    - `passes the variables and the arguments to claude` espera `'--plugin-dir', join(root, 'dist')`.
    - Los dos `additionalContext manda contrastar…` esperan `dist/skills/<nombre>/SKILL.md`.
  - `campaign.test.ts:143` y `lib.test.ts:174` esperan los mensajes con `sácala con git archive <commit>:dist (antes de la feature 0300: git archive <commit> skills .claude-plugin agents cli hooks)`.

  Correrlos: rojos.
- [ ] **Step 2: Implementación**:
  - `start-kit-session.mjs`: antes de lanzar, `await buildInto(root, join(root, 'dist'))`. Con `BuildError`, escribe su mensaje y `start-kit-session: arregla la fuente y vuelve a lanzarlo; dist/ no se ha tocado.` por stderr, y sale con 1 sin lanzar claude. Después, `--plugin-dir`, `join(root, 'dist')`. El comentario de cabecera pasa a decir «con las skills de `dist/`, construidas desde el working tree».
  - `kit-session-source.mjs`: en `sourceContext`, `skills/<nombre>/SKILL.md` pasa a `dist/skills/<nombre>/SKILL.md` en sus dos apariciones, y «de la rama» pasa a «de la rama, tras `moon run kit:build`» en la primera.
  - `tests/headless/{battery,campaign,lib}.mjs`: el literal de la copia del kit, con `git archive <commit>:dist (antes de la feature 0300: git archive <commit> skills .claude-plugin agents cli hooks)`.
  - `molds.test.ts`: `cpSync(join(kitRoot, 'dist'), kit, …)` en vez de las cinco carpetas.
  - `moon.yml`, en `test-headless.inputs`: `/dist/**` y `/build/**`.
  - `manifests.slow.test.ts`: si `validate('.claude-plugin/marketplace.json', true)` cambia, ajustarlo y añadir `acepta dist/ en modo strict`, sobre `dist`.
  - `CLAUDE.md`:
    - En el índice, `skills/<nombre>/SKILL.md` es la fuente de las skills, que se edita, y lo que carga el agente es `dist/skills/`, construido con `moon run kit:build`.
    - En la regla 1, «contrasta su texto con `skills/<nombre>/SKILL.md` de la rama» pasa a «reconstruye con `moon run kit:build` y contrasta su texto con `dist/skills/<nombre>/SKILL.md`», y «léela con Read de `skills/<nombre>/SKILL.md`» pasa a `dist/skills/<nombre>/SKILL.md`.
    - En la regla 5, la orden del corte pasa a `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size cli:test-slow cli:test-min`.
  - `README.md:142-150`: `--plugin-dir <raíz del clon>/dist`, y que el script construye `dist/` antes de lanzar.
  - `tech-stack.md`:
    - Línea 138: `git archive <commit>:dist`, y la lista vieja para commits anteriores a la 0300.
    - Línea 158: «una copia limpia del kit» es `dist/` de un commit.
- [ ] **Step 3: Verificación** — los comandos de «Verificación», y a mano:
  1. Edita `skills/sdd-tdd/SKILL.md` añadiendo al final una línea `x <!-- kit: prueba -->`.
  2. Ejecuta `node start-kit-session.mjs --version`. Esperado: sale con 1, escribe el mensaje de marca mal puesta y la línea de `start-kit-session`, y no lanza claude.
  3. Deshaz el edit con Edit inverso.
  4. Comprueba que `git status --short dist` sale vacío.
- [ ] **Step 4: Commit de la task** — `feat(kit): la sesión de desarrollo y los sujetos cargan dist/`.

### Task 3 — El registro de fuentes y los avisos generados

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/notices.test.ts`, `cli/test/kit/upstream-watch.slow.test.ts`.
**Superficies**: tooling · docs
**Verificación**:
- `pnpm --dir cli exec vitest run test/kit/notices.test.ts test/kit/dist.test.ts` → `Tests  N passed (N)`
- `pnpm --dir cli exec vitest run test/kit/upstream-watch.slow.test.ts --test-timeout 120000` → `Tests  N passed (N)`
- `moon run kit:upstream` → rojo solo con líneas `superpowers · …: v7.0.0 → v7.0.1, cambian sus rutas: …` (decisión 8 de la spec), ninguna «falta» ni «no existe».

**Interfaces**:
- Consume: `git(cwd, args)` de `cli/src/git/git.ts`; `buildInto` de `build/dist.ts` (para reconstruir tras regenerar).
- Produce, en `build/sources.ts`:
  - `export interface Source { repo: string; tagPrefix: string; license: string; copyright: string }`
  - `export interface Entry { kind: 'copy' | 'concept'; source: string; version: string; paths: string[]; kit: string[]; note?: string }`
  - `export interface Registry { sources: Record<string, Source>; entries: Entry[] }`
  - `export function readRegistry(path: string): Registry`
  - `export function renderSourcesTable(registry: Registry): string` — la sección `## Fuentes`: cabecera `| Fichero del kit | Fuente | Tipo | Versión | Rutas de la fuente | Licencia | Nota |`, una fila por entrada, en el orden del registro; `Tipo` es `copia` o `concepto`.
  - `export function renderNotice(registry: Registry, skillDir: string): string | null` — `null` si la carpeta no tiene entradas `copy`. Lanza `BuildError` con `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` si la licencia no es `MIT`.
  - `export function noticeFiles(registry: Registry): Map<string, string>` — de `skills/<x>/NOTICE` a su contenido, más `THIRD_PARTY_NOTICES.md`, cuya sección `## Fuentes` se sustituye y el resto se conserva.
  - En `build/notices.ts`: `node build/notices.ts` escribe `noticeFiles` y sale con 0.
- Formato de `upstream.json`:

  ```json
  {
    "sources": {
      "superpowers": { "repo": "obra/superpowers", "tagPrefix": "v", "license": "MIT", "copyright": "Copyright (c) 2025 Jesse Vincent" }
    },
    "entries": [
      { "kind": "copy", "source": "superpowers", "version": "v7.0.0", "paths": ["skills/test-driven-development/SKILL.md", "skills/test-driven-development/writing-good-tests.md"], "kit": ["skills/sdd-tdd/"] }
    ]
  }
  ```

**Ficheros**: crear `build/sources.ts`, `build/notices.ts`, `upstream.json`, `cli/test/kit/notices.test.ts`; modificar `tests/upstream/check.ts`, `cli/test/kit/upstream-watch.slow.test.ts`, `moon.yml` (`notices`), `THIRD_PARTY_NOTICES.md`, `skills/*/NOTICE`, `dist/`, `.docs/sdd/constitution.md` (Art. V), `.docs/sdd/tech-stack.md:324`.

- [ ] **Step 1: El registro** — escribir `upstream.json` con:
  - Las siete fuentes de la tabla de hoy, con su `tagPrefix`: superpowers `v`, OpenSpec `v`, Spec Kit `v`, mattpocock `v`, MADR `''`, impeccable `skill-v`, Wondel `v`.
  - Una entrada por cada pareja de fuente y fichero del kit que nombran hoy `THIRD_PARTY_NOTICES.md` y los once `NOTICE`, con la versión que dice el `NOTICE` o la frase (decisión 8 de la spec), y con la clasificación de la decisión 7.

  Cada ruta de `paths` se comprueba con `git -C <clon> cat-file -e <version>:<ruta>`. Después, comparar cada `NOTICE` de hoy con `renderNotice`: mismas líneas `Copyright`, y el cuerpo de la licencia igual tras normalizar espacios; solo cambian las cabeceras. Si algo legal difiere, para y anótalo.
- [ ] **Step 2: Tests RED**:
  - `notices.test.ts`:
    - `renders a notice per copy entry with its license text` (registro de juguete: cabecera con fuente, versión y rutas, y el texto MIT con el `copyright`).
    - `has no notice for a skill with only concepts` (`renderNotice` → `null`).
    - `fails on a copy with a license without template` (`toThrow('juguete: licencia Apache-2.0 sin plantilla en build/notices.ts')`).
    - `renders the sources table in registry order`.
    - Contra el repo: `every notice is what upstream.json generates`. Compara cada fichero de `noticeFiles(readRegistry('upstream.json'))` con el del repo y falla con `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices`.
  - `upstream-watch.slow.test.ts`, con clones de juguete como hoy, pero leyendo un `upstream.json` de juguete en vez de la tabla:
    - `passes when the newest tag does not touch the entry paths` (`Fuentes al día: 1 entradas.`).
    - `fails when the entry paths change` (`Juguete · skills/juguete/: v1.0.0 → v2.0.0, cambian sus rutas: git -C <clon> diff v1.0.0 v2.0.0 -- a.md`).
    - `fails when a path is gone in the newest tag` (`… la ruta a.md no existe en v2.0.0`).
    - `fails when the version is not in the clone` (`Juguete: falta v0.9.0 en el clon <clon>`).
    - `compares a commit version against the newest tag`.
    - `fails without tags of its prefix` (`Juguete: el clon <clon> no tiene tags vX.Y.Z`).
    - `joins the kit paths of an entry` (`Juguete · skills/a/, skills/b/: …`).
    - Se conservan los casos de hoy sin `SDD_UPSTREAM_DIR`, sin clon y con `fetch` fallido, con sus literales.

  Correrlos: rojos.
- [ ] **Step 3: Implementación**:
  - `build/sources.ts` y `build/notices.ts`, con las interfaces de arriba.
  - `tests/upstream/check.ts` lee `upstream.json` (ruta por argumento, por defecto la raíz) con `readRegistry`. Conserva `findClones`, `fetch` y `newestTag` con el `tagPrefix` de la fuente, y para cada entrada aplica las reglas de la decisión 10 de la spec, con `git diff --quiet <versión> <último> -- <paths>` y `git cat-file -e <último>:<ruta>`.
  - `moon.yml`: `notices: { command: node, args: [build/notices.ts], options: { cache: false } }`.
  - `moon run kit:notices kit:build`.
  - `THIRD_PARTY_NOTICES.md`:
    - Las secciones «Fuentes vigiladas» y «Skills y plantillas del kit» se sustituyen por `## Fuentes`, generada.
    - La introducción dice que la tabla sale de `upstream.json` con `moon run kit:notices`.
    - «Skills de desarrollo de este repo» queda igual.
  - Art. V: «(`THIRD_PARTY_NOTICES.md`)» pasa a «(`upstream.json`)».
  - `tech-stack.md:324`: las fuentes con versión, en `upstream.json`, y `kit:upstream` compara las rutas de cada entrada.
- [ ] **Step 4: Verificación** — los comandos de «Verificación».
- [ ] **Step 5: Commit de la task** — `feat(kit): registro único de fuentes y avisos generados`.

### Task 4 — Prueba de instalación, byte a byte y glosario

**Tras**: Task 2, Task 3
**Modelo**: la sesión (Native).
**Tests RED**: no aplica: es la medida de instalación y una comprobación de una vez, con su evidencia en `install/install.md` y en el walkthrough.
**Superficies**: tooling · docs
**Verificación**:
- `node .docs/sdd/specs/20261103-173149-feature-0300-skill-source-build-dist/install/install.mjs` → escribe `install.md` con las tres filas de la tabla de «Dónde se prueba» de la spec, y sale con 0 si las dos instalaciones con `dist/` cumplen:
  - en la caché, solo las entradas de la lista blanca, más `.in_use/` de Claude Code;
  - ninguna línea `<!-- kit:`;
  - la 2.3.4 con `.orphaned_at`;
  - el hook `session-start` desde la caché devuelve `using-sdd` sin stderr.
- Byte a byte: un script en el scratchpad compara `git rev-parse <base>:skills/<f>` con `git rev-parse HEAD:dist/skills/<f>` para cada fichero de `skills/` de la base, donde la base es el merge-base con `develop`. Esperado: iguales todos salvo los once `NOTICE`.

**Interfaces**:
- Consume: `dist/` de las tasks 1 a 3.
- Produce: nada.

**Ficheros**: crear `install/githttp.mjs` (el servidor de esta sesión, del scratchpad), `install/install.mjs` e `install/install.md`, en la carpeta de la spec; modificar `.docs/sdd/mission.md` (glosario).

- [ ] **Step 1: Implementación** — `install.mjs`, con `GIT_CONFIG_COUNT=1`, `GIT_CONFIG_KEY_0=core.longpaths` y `GIT_CONFIG_VALUE_0=true` en el entorno de git y de claude:
  1. Clona en `--bare` la rama actual a `<scratch>/mkt.git`.
  2. Crea con `GIT_INDEX_FILE` y `commit-tree`, sin copia de trabajo:
     - `base`: el commit base con `"source": "."`;
     - `with-dist`: `HEAD` con `dist/.claude-plugin/plugin.json` en una versión de prueba (`<versión>-test`), solo en ese commit.
  3. Lanza `githttp.mjs` en un puerto libre.
  4. Con un `CLAUDE_CONFIG_DIR` nuevo:
     - `claude plugin marketplace add http://127.0.0.1:<puerto>/mkt.git#main`, con `main` en `base`, y `claude plugin install sdd-kit@sdd-kit`;
     - mueve `main` a `with-dist`, y después `claude plugin marketplace update sdd-kit` y `claude plugin update sdd-kit@sdd-kit`.
  5. Mide la caché, ejecuta el hook desde ella y escribe `install.md`.
  6. Para el servidor y borra `<scratch>`.

  El scratch es `.temp/i0300` del worktree, una ruta corta, por `Filename too long` (`tech-stack.md`, feature 0230).

  Glosario de `mission.md`, «Dominio»:
  - fuente intermedia: `skills/` del repo, que admite marcas y no viaja;
  - `dist/`: lo que construye `moon run kit:build` y lo único que viaja;
  - marca: una línea entera `<!-- kit: … -->` de la fuente, que el build quita;
  - registro de fuentes: `upstream.json`, con la versión de cada copia y cada concepto.
- [ ] **Step 2: Verificación** — los comandos de «Verificación».
- [ ] **Step 3: Commit de la task** — `test(kit): prueba de instalación desde dist/ y glosario`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Estimación de revisión: 0,75h
- Estimación de cierre: 0,5h
- Base de la estimación: 4 tasks; el build y el registro son código nuevo con tests, y lo demás son cambios de literales. Incertidumbres: rellenar las `paths` del registro contra siete clones, y el texto legal de los `NOTICE`. En el estimation-log, la implementación media de la release es de 0,48h por task con IA (fila «implementación»), y aquí cada task es más grande que la media.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Lo que viaja: THEN, solo la lista blanca en la caché → Task 4, `install.md` (fila con `./dist`), y Task 1, `dist holds only the whitelist`. ✓
- Lo que viaja: AND, sin `.docs/`, `tests/`, `cli/test/` ni marca → Task 4, `install.md`, y Task 1, `dist has no kit mark outside code blocks`. ✓
- Sale limpia: THEN, la marca quitada y lo demás byte a byte → Task 1, `strips a whole-line kit mark with its LF and CRLF`. ✓
- Sale limpia: AND, sin marcas sale idéntica → Task 1, `copies a source without marks byte for byte`. ✓
- Sale limpia: AND, una marca en un bloque de código se copia → Task 1, `keeps a kit mark inside a fenced code block`. ✓
- Sale limpia: AND, marca mal puesta → error y `dist/` sin cambios → Task 1, `fails on a misplaced kit mark` y `leaves dist untouched when the build fails`. ✓
- dist = build: THEN, el mensaje y la ruta → Task 1, `dist/ is what the build outputs`. ✓
- dist = build: AND, tras `kit:build` (también tras subir la versión) pasa → Task 1, el mismo test en verde tras `moon run kit:build`; la versión, porque `.claude-plugin/plugin.json` está en la lista blanca. ✓
- dist = build: AND, lo ignorado no entra → Task 1, `takes only tracked or addable files of the whitelist`. ✓
- Avisos: THEN, el `NOTICE` editado da rojo con su mensaje → Task 3, `every notice is what upstream.json generates`. ✓
- Avisos: AND, `kit:notices` los reescribe → Task 3, Step 3 (`moon run kit:notices` y el test en verde). ✓
- El corte: THEN y los AND de rutas que cambian, ruta que no existe, versión que falta, versión commit y sin `SDD_UPSTREAM_DIR` → Task 3, sus tests de `upstream-watch.slow.test.ts`. ✓
- 2.3.4: THEN, la caché nueva solo con la lista blanca → Task 4, `install.md`. ✓
- 2.3.4: AND, `.orphaned_at` → Task 4, `install.md`. ✓ La validación con GitHub queda post-merge, en el corte de la 3.0.0 (0311).
- Tabla de retiradas, `"source": "."` → Task 1 (marketplace, `architecture.md`, `tech-stack.md:19`). ✓
- Tabla de retiradas, «Fuentes vigiladas» y versiones en prosa → Task 3. ✓
- Tabla de retiradas, `git archive` y `--plugin-dir`, `skills/<nombre>/SKILL.md` e índice → Task 2. ✓
- Tabla de retiradas, Art. V → Task 3. ✓
- Tabla de retiradas, Art. VIII → Task 1. ✓
- Tabla de retiradas, regla 5 → Task 2. ✓
- Tabla de retiradas, `skill-size` → Task 1. ✓
- Byte a byte (Intent) → Task 4, Verificación. ✓
- Review Focus → cada línea con su task y su test, o la verificación a mano de la Task 2. ✓
