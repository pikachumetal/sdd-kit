---
id: 20261101-175259-feature-0182-doc-citing-comments
feature: 0182
title: Plan de implementación — Comentarios que citan documentos, detectados por la CLI
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Comentarios que citan documentos, detectados por la CLI

## Decisiones que he tomado yo — valida estas

1. Modelo: las dos tasks las hace la sesión en Native; la revisión final, con los ejes de `sdd-verify`.
2. Ejecución: Native (abajo).
3. Módulo `cli/src/comments/` con tres ficheros: lexer, patrones y escaneo más verbo. El lexer es puro, para probarlo sin git.
4. `sin leer:` conserva el orden de `git diff`, sin ordenar aparte.
5. Riesgo alto: ninguno; `f6` puede salir limpio en el RED, y la spec ya dice qué pasa entonces.
6. Coste: ~2 h de sesión y hasta 4 $ de sujetos, los de la spec.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el verbo `sdd review comments` y su salida en el encargo del eje Código.

**Architecture**: se leen las líneas añadidas de `git diff -U0` y el fichero entero en `HEAD`; el lexer de su familia da los comentarios por línea, y los patrones dicen qué citan. El verbo no conoce ningún proyecto: solo git y extensiones.

**Tech Stack**: TypeScript con `node:*`, sin dependencias; Vitest; batería headless de `sdd-verify`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks con una sola interfaz entre ellas (el verbo y su salida), un error lo caza el test de su task o `f6`, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `cli/src/comments/` y un contrato nuevo entre CLI y encargo del eje Código.

## Restricciones globales

### De código

- Solo módulos `node:*`, sin `dependencies`; solo sintaxis que el type stripping borra.
- Todo acceso a git, por `cli/src/git/git.ts`.
- Un test que crea un repo git va en `*.slow.test.ts`, con `git -C` y `cleanGitEnv`.
- Art. X de la constitution, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV; sujetos en Sonnet.
- Commits con tipo/scope en inglés y cuerpo en castellano; atribución de la sesión.

## Review Focus

- Un comentario al final de una línea de código (`save(); // Task 4`) → se lista · Task 1, `lists a trailing comment`
- `#` dentro de una palabra en shell o YAML (`echo a#Task 4`, `$#`) → no abre comentario · Task 1, `ignores a hash inside a word`
- Fichero con finales CRLF → la línea y el texto salen sin `\r` · Task 1, `strips the carriage return`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lexer por tabla de familias, sin parsers.
- [x] **YAGNI gate**: sin configuración de patrones ni de lenguajes.
- [x] **Brownfield gate**: verbo nuevo; nada existente cambia de forma.
- [x] **Constitution check**: Art. I (`f6`), Art. X, Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/comments/lexer.ts` — familias de lenguaje y extracción de comentarios por línea.
- `cli/src/comments/citations.ts` — patrones y tipos de cita.
- `cli/src/comments/verbs.ts` — diff, cruce, salida y verbo.
- `cli/test/comments/lexer.test.ts`, `cli/test/comments/citations.test.ts`, `cli/test/comments/verb.slow.test.ts`.
- `tests/batteries/sdd-verify/fixtures/app-f6.js`, `fixtures/axis-f6.json`, si `f4` los usa con esa forma.

**Modificar**:

- `cli/src/cli/verbs.ts` — registrar `reviewCommentsVerb`.
- `skills/sdd-verify/SKILL.md`, `references/code-reviewer-prompt.md`, `references/encargo-revision.md` — los textos literales de la spec.
- `tests/batteries/sdd-verify/battery.md`, `subject.mjs`, `compose-axis.mjs` — `f6`.
- `.docs/sdd/roadmap.md` — tres filas a «Actuar → 0152».

**NO se tocan**:

- `cli/src/merge/affected.ts` y demás comentarios ya existentes: fuera del diff.
- `skills/sdd-implement/references/*`: el revisor de task y la re-revisión no reciben la salida.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `f6` limpio en el RED | media | baja | decisión 11 de la spec |
| Mucho falso positivo en este repo | media | baja | el revisor juzga; el verbo no bloquea |

### 1.8 Rollout

Directo, con la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna. Art. I: batería reducida a `f6` por decisión del dev-lead en la spec.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El verbo `sdd review comments`

**Tras**: —
**Modelo**: sesión Native (hereda el de la sesión).
**Tests RED**: Native: TDD del propio hilo.
**Superficies**: tooling
**Verificación**: `npx vitest run test/comments --test-timeout 120000` desde `cli/` → `Tests  <n> passed (<n>)`; `moon run cli:typecheck`
**Se prueba en la aplicación**: no, porque es una herramienta de CLI; se prueba con el verbo sobre una rama de prueba en `verb.slow.test.ts`.

**Interfaces**:
- Consume: `git`, `gitLines` de `cli/src/git/git.ts`.
- Produce: línea `<fichero>:<línea> · <tipos> · <texto>`, cierre `<n> comentarios citan documentos` | `1 comentario cita documentos` | `ningún comentario cita documentos`, línea `sin leer: a, b`, y `--json` con `{"comments":[{"file","line","cites","text"}],"unread":[…]}`.

**Ficheros**: los de `cli/src/comments/`, `cli/test/comments/`, `cli/src/cli/verbs.ts`.

- [ ] **Step 1: Lexer** — `commentLinesOf(path: string, source: string): Map<number, string> | null`: `null` con extensión desconocida; la clave es la línea desde 1, y el valor, el texto de esa línea sin sangría. Familias, por extensión o nombre: `//` y `/* */` con cadenas `"`, `'` y `` ` `` (ts, tsx, js, jsx, mjs, cjs, cs, java, kt, go, rs, swift, c, h, cpp, hpp, php, scss, less); `/* */` (css); `#` tras espacio o inicio de línea, con cadenas `"` y `'` (py y triple comilla como cadena multilínea, rb, sh, bash, yml, yaml, toml, ps1 y `<# #>`, `Dockerfile`, `Makefile`); `--` y `/* */` con cadena `'` (sql); `<!-- -->`, sin cadenas (html, xml, csproj; y `@* *@` en cshtml, razor). `"` y `'` acaban en fin de línea; `` ` `` y triple comilla, no. `\` escapa dentro de una cadena. Con un `// shortcut:` por límite (regex de JS, docstring, `<script>`). Tests en `lexer.test.ts`: `lists a line comment` (por familia), `lists every line of a block comment`, `ignores the same text in a string`, `ignores a comment inside a multiline template`, `lists a trailing comment`, `ignores a hash inside a word`, `strips the carriage return`, `returns null for an unknown extension`.
- [ ] **Step 2: Citas** — `citedKinds(comment: string): string[]`, en este orden: `spec`, `task`, `constitution`, `requisito`, `capabilities/`. Regex, con `iu`: `(?<![\w.-])specs?(?![\w-])|§\s*\d` · `\b(?:task|tarea)\s*#?\d+\b|\b(?:feature|patch)\s*#?\d{2,}\b` · `\bconstituci[oó]n\b|\bconstitution\b|\bArt\.\s*[IVXLC]+\b|\bart[ií]culo\s+[IVXLC]+\b` · `\brequisitos?\b|\brequirements?\b|\bREQ-\d+` · `capabilities\/`. Tests en `citations.test.ts`, con `expect(citedKinds('// requisito de la spec')).toEqual(['spec', 'requisito'])`, `foo.spec.ts` → `[]`, `Task 4` → `['task']`, `patch 0258` → `['task']`, `patch 3` → `[]`, `Art. X` → `['constitution']`, y un porqué → `[]`.
- [ ] **Step 3: Verbo** — `reviewCommentsVerb` (noun `review`, verb `comments`, opciones `base`, `project-root` y `json`). Sin `--base`: `UsageError`, sale con 2. `git merge-base HEAD <base>`; si falla, stderr `base: no se encuentra <ref>` y sale con 1. `git diff -U0 --diff-filter=d --no-color --no-renames --no-ext-diff <base>` contra `HEAD`, para añadidas por fichero, leyendo cabeceras `+++ b/` y `@@ … +a,b @@`. Fuera, en silencio: `.md`, `.mdx`, `.json`, `.docs/sdd/specs/**`, `.docs/sdd/changes/**`. Contenido con `git show HEAD:<fichero>`. Tests en `verb.slow.test.ts`, con un test por THEN y AND de los cinco `ADDED` de `cli`, con sus literales, sobre un repo con `develop` y una rama de prueba: el `spec §3`, `Task 4`, un porqué y la cadena de la spec; salir con 0 sin encontrar nada; sin `--base` → 2; base inexistente → 1; líneas ya existentes y merge de `develop`; lenguajes; `sin leer`.
- [ ] **Step 4: Registro** — añadir `reviewCommentsVerb` a `VERBS`. Si `cli/test/` tiene una lista de verbos o `--help`, se actualiza.
- [ ] **Step 5: Verificación** — los comandos de arriba, en verde.
- [ ] **Step 6: Commit de la task**.

### Task 2 — El eje Código recibe la salida y la juzga

**Tras**: Task 1
**Modelo**: sesión Native; sujetos `f6` con Sonnet.
**Tests RED**: el sujeto de `f6` con `KIT_DIR` en el kit sin esta task.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/docs-claims.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  <n> passed (<n>)`; `BATTERY=sdd-verify STEPS=<f6> node tests/headless/battery.mjs run` (con la forma exacta que documente `battery.mjs`) → `f6` en verde.
**Se prueba en la aplicación**: no, porque es texto de skill; lo mide `f6`.

**Interfaces**:
- Consume: la salida de `sdd review comments`, con las líneas de la spec.
- Produce: nada.

**Ficheros**: `skills/sdd-verify/**`, `tests/batteries/sdd-verify/**`, `.docs/sdd/roadmap.md`.

- [ ] **Step 1: Escenario** — `f6` en `battery.md` (eje Código, Sonnet, n = 1, umbral 1/1): diff con `// Task 4: validar antes de guardar` y `// requisito del proveedor: el IBAN va sin espacios`, bloque «De código» que no habla de comentarios. «Falla si…»: no marca Important la línea de `Task 4`; o marca como hallazgo la del IBAN; y en el GREEN, además, si esa línea no sale en «Declined to judge». `subject.mjs` y `compose-axis.mjs` inyectan la salida del verbo cuando el encargo lleva la sección; en el RED no la lleva.
- [ ] **Step 2: RED** — un sujeto con el kit sin la edición. Evidencia en `red/` de la spec y en `tests/` con la forma de la batería. Si marca la cita y calla el falso positivo, sale la frase de juicio (decisión 11), y `f6` queda como control.
- [ ] **Step 3: Texto** — los literales de «Approach» en `SKILL.md` y `code-reviewer-prompt.md`; en `encargo-revision.md`, las cuatro sustituciones:
  - «Medido en `tests/gates-reviews-green.md` (E3): con la instrucción en prosa el bloque llegó a 2 de 3 encargos; el revisor final se quedó sin él en 3 de 3 runs.» → «Medido: `tests/gates-reviews-green.md`, E3.»
  - borra «; en un proyecto del equipo, 27 minutos por revisor frente a los 7 de uno que solo lee el diff»
  - «Con el cuerpo de los borrados y la carpeta de la feature dentro, el paquete de una feature en campo pesó 235.524 bytes y el primer `Read` del revisor falló con `File content (28006 tokens) exceeds maximum allowed tokens (25000)` (su ticket de campo, §3).» → «Con ellos, el primer `Read` del revisor falló por tamaño (su ticket de campo, §3).»
  - «Sin esta frase, 2 de 2 sujetos en Native lo despacharon con el modelo de los subagentes del plan y sin effort (`tests/native-adapt-red.md`).» → «Medido: `tests/native-adapt-red.md`.»
- [ ] **Step 4: GREEN** — un sujeto de `f6` con el kit editado. Si falla, una tanda de REFACTOR, dentro del techo de 4 $.
- [ ] **Step 5: Roadmap** — filas de `.docs/sdd/roadmap.md` «Menores de la revisión final de la 0148», «El paquete del revisor final…» y «`git worktree remove`…»: «Actuar → 0182» pasa a «Actuar → 0152»; `moon run kit:roadmap` en verde.
- [ ] **Step 6: Verificación y cuenta** — los comandos de arriba; el saldo medido con el conteo del test, igual o por debajo de 9.635.
- [ ] **Step 7: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 2 h
- Base de la estimación: 2 tasks, un lexer nuevo sin dependencias y un escenario de batería sobre `f4`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `cli`, «lista los comentarios añadidos»: THEN, las dos líneas; AND no escribe 5 y 6; AND cierre y 0 → Task 1, `verb.slow.test.ts`. ✓
- `cli`, «sale con 0 sin encontrar nada»: THEN; AND sin `--base` → 2; AND base inexistente → 1 → Task 1, `verb.slow.test.ts`. ✓
- `cli`, «mira solo las líneas añadidas»: THEN; AND merge de `develop` → Task 1, `verb.slow.test.ts`. ✓
- `cli`, «reconoce los comentarios de cada lenguaje»: THEN; AND tipos y `foo.spec.ts` → Task 1, `verb.slow.test.ts` y `citations.test.ts`. ✓
- `cli`, «dice qué no ha leído»: THEN; AND `unread` → Task 1, `verb.slow.test.ts`. ✓
- `verification`, MODIFIED: el eje Código recibe la salida → Task 2, `f6` (`tools` y encargo compuesto), y la línea de `SKILL.md`, `docs-claims.test.ts`. El resto del bloque no cambia. ✓
- `verification`, ADDED: Important en `save.ts:4`; AND IBAN en «Declined to judge» → Task 2, `f6`. ✓
- AND «una cita que la lista no trae es hallazgo» y AND «bloque que prohíbe citar» → sin observar en `f6`, que tiene un solo sujeto (decisión del dev-lead); lo mira el eje Spec. ⚠
- Tabla de lo que se retira → Task 2, Step 3 y Step 5. ✓
- Review Focus → Task 1, sus tres tests. ✓
