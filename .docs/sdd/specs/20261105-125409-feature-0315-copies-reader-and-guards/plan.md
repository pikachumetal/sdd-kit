---
id: 20261105-125409-feature-0315-copies-reader-and-guards
feature: 0315
title: Plan de implementación — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: Native, las tres en esta sesión. Si una se despachara tras una compactación, `sdd-kit:effort-medium` + `model: sonnet`: son cambios de código con la interfaz y los tests fijados aquí.
2. **Ejecución**: Native (ver la línea `Ejecución`).
3. **La racha se mide en `checkSite`**, que ya tiene el tramo quitado (`site.removed`) y los bloques del sitio; se compara contra las líneas, no contra las palabras.
4. **El cierre en `fin` mira hacia delante con un índice precalculado**: el `Reader` guarda, para cada línea, si la siguiente marca de línea entera es `fin`; así `take` no recorre el fichero en cada línea en blanco.
5. **`kit:dist-compare` exporta funciones puras** (`paragraphDiff`, `shapeDiff`) que el test llama con textos; la lectura de git (`git show <ref>:<ruta>`, `git rev-parse --verify <ref>^{commit}`) solo va en `main`.
6. **El `own` se busca con `git grep -F -I -n -f -`**, con las líneas por la entrada estándar: sin ficheros temporales ni el tope de longitud de la línea de órdenes de Windows. Se usa `spawnSync` de `node:child_process` con `input`, porque `git()` de `cli/src/git/git.ts` no acepta entrada.
7. **Riesgos altos**: que un bloque real de `develop` caiga en la racha (desvío: para, spec §Scope).
8. **Coste**: ~2 h de implementación, sin subagentes salvo los tres ejes de la revisión final.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que las cinco herramientas de la fila 0315 den rojo con su caso, sin cambiar lo que dan hoy sobre las copias de `develop`.

**Architecture**: tres arreglos independientes en las herramientas del repo: el `Reader` y `checkSite` de `tests/copies/annotated.ts`, una tarea nueva `kit:dist-compare` en `tests/copies/`, y una pasada más en `tests/upstream/check.ts`; y dos tests de `cli/test/kit/`, uno nuevo y `skills.test.ts` leyendo `dist/skills/`.

**Tech Stack**: Node 26 con TypeScript sin compilar (`node build/dist.ts`), moon 2.6.0, Vitest en `cli/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks sin interfaces compartidas entre ellas, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `tests/copies/dist-compare.ts` con su tarea `kit:dist-compare` en `moon.yml`.

## Restricciones globales

### De código

- Los mensajes, literales de la spec: `<fichero>:<línea de la marca>: el bloque lleva <n> líneas seguidas del original en su sitio, desde «<primera línea, abreviada a 6 palabras>»: ciérralo con <!-- kit: fin --> antes de ellas` · `<ruta>: <n> líneas con otra forma` con `  - <ref>:<línea> «<texto>»` / `  + <línea> «<texto>»` · `<ruta>: <n> párrafos distintos` · `<ruta>: igual` · `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` · `<test>:<línea de la lectura>: lee skills/ y ejecuta o compara un bloque de código: léelo de dist/skills/, que es lo que carga el agente` · `<fichero>:<línea>: línea literal de <fuente> <ruta>@<tag>, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «<línea abreviada a 6 palabras>»`.
- Topes: racha de 2 líneas o más, sin contar las en blanco; línea literal de 70 caracteres o más sin los espacios de los bordes.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones de ~20 líneas, anidamiento ≤ 3. Comentarios en castellano, solo el porqué.
- Ningún fichero de `skills/` cambia (ADR 0022, regla 3).

### De proceso

- Native: esta sesión implementa; la revisión final de `sdd-verify` va en ejes (Spec opus+high, Código sonnet+high, Arquitectura opus+high), confirmados por la `Política de modelos` de la spec.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task. Antes de commitear, `git diff --cached --name-only`; los `M` de `dist/` que solo cambian de finales de línea no se commitean.

## Review Focus

- Un bloque en el texto con `fin` tras una línea en blanco y **sin** otra marca antes, pero con un `fin` que pertenece a un bloque abierto en una valla posterior → cierra en la línea en blanco: la búsqueda de la siguiente marca no salta vallas, y una marca dentro de una valla es la siguiente · Task 1, `does not extend a text block to a fin inside a later fence`
- Una racha cuyas líneas iguales son en blanco o de una sola línea con texto (una línea en blanco y `pnpm install --frozen-lockfile`) → no da rojo · Task 1, `ignores blank lines and a lone equal line`
- `kit:dist-compare` sobre un fichero CRLF en el árbol (los `dist/` de este worktree) → se compara en LF y sale `igual` · Task 1, `compares in LF`
- Un `own` con la misma línea literal dos veces → un rojo por línea, no uno por fuente repetida · Task 3, `reports each literal line once`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada arreglo reusa el código de su herramienta (`sitesOf`, `lcsPairs`, `prepareSource`, `kindOf`); la única pieza nueva es `kit:dist-compare`, que la fila pide.
- [x] **YAGNI gate**: sin opciones nuevas salvo `--base`, que ya tenía `compare-dist.mjs`.
- [x] **Brownfield gate**: las copias de `develop` dan lo mismo que hoy (§3).
- [x] **Constitution check**: Art. I (rojo antes del arreglo en cada task), Art. X, Art. XI (`architecture.md` nombra la tarea nueva).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/copies/dist-compare.ts` — `kit:dist-compare`: compara ficheros de `dist/` con una referencia de git, por párrafos y por forma.
- `cli/test/kit/dist-compare.test.ts` — tests de `paragraphDiff` y `shapeDiff`.
- `cli/test/kit/skills-readers.test.ts` — da rojo si un test lee `skills/` y nombra una valla.

**Modificar**:

- `tests/copies/annotated.ts` — `Reader.take` cierra en `fin`; `checkSite` mide la racha.
- `cli/test/kit/copies.test.ts` — tests del cierre y de la racha.
- `moon.yml` — tarea `dist-compare`.
- `cli/test/kit/skills.test.ts` — el bloque por skill y el índice de `sdd-templates` leen `dist/skills/`.
- `tests/upstream/check.ts` — líneas literales de los `own`.
- `cli/test/kit/upstream-watch.slow.test.ts` — casos del `own`.
- `.docs/sdd/architecture.md` — la línea de `tests/copies/` nombra `kit:dist-compare`.

**NO se tocan**:

- `build/notices.ts`, `build/sources.ts` — `kit:upstream` usa lo que ya exportan (spec, decisión 9).
- `skills/` — la feature no cambia texto de skills.
- `.docs/sdd/specs/20261104-103810-feature-0312-annotate-real-copies/real-copies/compare-dist.mjs` — historia (spec, decisión 5).

### 1.6 Dependencias

Clones de `SDD_UPSTREAM_DIR` (`D:/code/github/upstream`) para `kit:copies` y `kit:upstream`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un bloque real de `develop` cae en la racha | baja | desvío | `moon run kit:copies` en la Task 1 antes de commitear; si sale, para (spec §Scope) |
| La forma da falsos rojos en `dist/` de hoy | media | la herramienta no sirve | `moon run kit:dist-compare` sobre todo `dist/skills/` frente a `develop` debe dar `igual` |
| `git grep -f -` no lee de la entrada en el git de la CI | baja | `kit:upstream` falla | el test lento corre en la CI con Linux |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — kit:copies: el cierre en `fin`, la racha y `kit:dist-compare`

**Tras**: —
**Modelo**: Native, esta sesión (despacho tras compactación: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`)
**Tests RED**: hilo principal · `cli/test/kit/copies.test.ts`, `cli/test/kit/dist-compare.test.ts`; TDD del propio hilo.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/kit/copies.test.ts test/kit/dist-compare.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:copies` → las mismas 6 líneas de hoy, todas con ` → <fila>`; `moon run kit:build` y después `moon run kit:dist-compare -- <cada .md de dist/skills/>` → `<ruta>: igual` en todas
**Se prueba en la aplicación**: no, porque herramientas del repo.

**Interfaces**:
- Consume: `lcsPairs`, `sitesOf`, `Site`, `KitBlock`, `report` de `tests/copies/annotated.ts`; `nextBlock`, `WHOLE_LINE_MARK` de `build/dist.ts`.
- Produce: `paragraphDiff(base: string, now: string): string[]` y `shapeDiff(base: string, now: string, ref: string): string[]` en `tests/copies/dist-compare.ts`; la tarea `moon run kit:dist-compare -- [--base <ref>] <rutas>…`.

**Ficheros**: modificar `tests/copies/annotated.ts`, `cli/test/kit/copies.test.ts`, `moon.yml`, `.docs/sdd/architecture.md`; crear `tests/copies/dist-compare.ts`, `cli/test/kit/dist-compare.test.ts`.

- [ ] **Step 1: RED del cierre y de la racha** — en `copies.test.ts`, `describe('checkCopy: la gramática de la marca')`, con `check`, `BASE`, `FENCED` y `replaceLine` del fichero:
  - `ends a text block at fin across a blank line`: un `<!-- kit: 0186 -->` tras `## Setup\n` con `uno\n\ndos\n<!-- kit: fin -->\n` → `toEqual([])` (hoy da `<!-- kit: fin --> sin bloque abierto`).
  - `ends a text block at a blank line when the next mark is not fin`: bloque, línea en blanco, `<!-- kit: 0186 -->`, una línea, `<!-- kit: fin -->` → `toEqual([])`, y el segundo bloque es el que cierra `fin` (sin `sin bloque abierto`).
  - `does not extend a text block to a fin inside a later fence` (Review Focus).
  - `reports a block that eats original lines inside a fence`: original con una valla `bash` con `npm ci\npnpm install --frozen-lockfile\nyarn install --frozen-lockfile\n`; anotada con `<!-- kit: 0186 -->`, `bun install`, línea en blanco y las dos últimas líneas → `toEqual([\`${FILE}:<línea de la marca>: el bloque lleva 2 líneas seguidas del original en su sitio, desde «pnpm install --frozen-lockfile»: ciérralo con <!-- kit: fin --> antes de ellas\`])`, y con `<!-- kit: fin -->` antes de la línea en blanco → `toEqual([])`.
  - `reports a text block whose fin eats an original paragraph`: un bloque con `fin` que deja dentro dos líneas seguidas de `STOPS_PARAGRAPH` → el mismo mensaje con su primera línea.
  - `ignores blank lines and a lone equal line` (Review Focus).
  - El test `ends a block at the first blank line outside a fence` sigue igual.
  Ver los nuevos en rojo.
- [ ] **Step 2: Implementación en `annotated.ts`** — `Reader`: un `nextIsFin: boolean[]` calculado en `read()` (para cada índice, si la siguiente línea con `WHOLE_LINE_MARK` es `fin`); `take` cierra en blanco solo si `!this.nextIsFin[index]`. Mensaje nuevo en `MESSAGES`: `eats: (count: number, first: string): string`. `checkSite`: para cada bloque `add` del sitio, `runOf(block.content, site.removed): { count: number; first: string } | null` — la racha más larga de líneas con texto, seguidas en los dos lados saltando las en blanco, iguales byte a byte; con `count >= EAT_RUN` (`const EAT_RUN = 2`), `report` en `block.index + 1` con `fixes: block.mark.fixes`. Ver en verde.
- [ ] **Step 3: RED de `kit:dist-compare`** — `dist-compare.test.ts` con textos en línea:
  - `names a line with another indent`: base con `- a\n  - item\n`, ahora con `- a\n    - item\n` → `shapeDiff` contiene `  + 2 «    - item»`; `paragraphDiff` → `[]`.
  - `names two list items joined`: `- a\n- b\n` → `- a - b\n` → `shapeDiff` no vacío.
  - `names a doubled blank line`: `a\n\nb\n` → `a\n\n\nb\n` → `shapeDiff` contiene `  + 3 «»`.
  - `ignores a paragraph wrapped at other points`: `uno dos\ntres\n` → `uno\ndos tres\n` → `shapeDiff` y `paragraphDiff` → `[]`.
  - `keeps every line inside a fence`: dos líneas de código juntadas en una → `shapeDiff` no vacío.
  - `compares in LF` (Review Focus).
  - `paragraphDiff` de `compare-dist.mjs`: un párrafo con otras palabras → `['  - …', '  + …']`.
  - `rejects a base that does not exist`: `run(process.execPath, ['tests/copies/dist-compare.ts', '--base', 'no-existe', 'dist/skills/sdd-tdd/SKILL.md'], { cwd: kitRoot })` (de `process.ts`) → código 1 y `kit:dist-compare: la referencia no-existe no existe: usa --base <ref>`.
  - `writes igual for a file equal to its base`: `--base HEAD` sobre `README.md` → `README.md: igual`, código 0.
  Ver en rojo (el módulo no existe).
- [ ] **Step 4: `tests/copies/dist-compare.ts`** — `paragraphDiff` y el `diff` por LCS portados de `compare-dist.mjs`; `shapeDiff` con los tokens de la spec (decisión 6): blanco = sus bytes; fuera de valla, `/^(\s*)([-*+]|\d+\.|\||>|#+|`{3,}|~{3,})(\s|$)/` = sangría + marcador; si no, sangría, y las seguidas con la misma sangría en un párrafo cuentan como una; dentro de valla (por `nextBlock`), cada línea con su sangría. Cada token lleva su número de línea y su texto; salida `  - ${ref}:${línea} «${texto}»` / `  + ${línea} «${texto}»`. `main(argv)`: `--base` (por defecto `develop`), `git rev-parse --verify <ref>^{commit}` o `kit:dist-compare: la referencia <ref> no existe: usa --base <ref>` y 1; por fichero, `git show <ref>:<ruta>` (vacío si no está) y el árbol (vacío si no está), en LF; escribe `<ruta>: igual` o `<ruta>: <n> párrafos distintos` + líneas y después `<ruta>: <n> líneas con otra forma` + líneas; `process.exitCode` 1 si alguno difiere. `moon.yml`: tarea `dist-compare` (`command: node`, `args: [tests/copies/dist-compare.ts]`, `options: cache: false`), con un comentario de una línea de para qué sirve. Ver en verde.
- [ ] **Step 5: Caso real** — `git show 57be1a76^:skills/sdd-worktrees/SKILL.md` frente a su original (la entrada de `upstream.json` de `skills/sdd-worktrees/SKILL.md` en esa revisión, del clon) pasado por `checkCopy` en un script del scratchpad, dos veces: con el `annotated.ts` del árbol (rojo de racha en la marca del bloque de Node.js) y con el de `develop`, copiado al scratchpad con `git show develop:tests/copies/annotated.ts` (sin ese rojo). Salida de los dos al walkthrough.
- [ ] **Step 6: Build y verificación** — los comandos de «Verificación». `kit:copies` con una línea nueva sin ` → <fila>`: para (desvío).
- [ ] **Step 7: Docs** — `architecture.md:38`: `copies/ (\`kit:copies\`, \`kit:copies-update\` y \`kit:dist-compare\`…` en la misma frase.
- [ ] **Step 8: Commit de la task** — `feat(kit): kit:copies cierra en fin y da rojo con un bloque que se come el original, y kit:dist-compare ve la forma`.

### Task 2 — Los lectores de `skills/` y `skills.test.ts` sobre `dist/skills/`

**Tras**: —
**Modelo**: Native, esta sesión (despacho tras compactación: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`)
**Tests RED**: hilo principal · `cli/test/kit/skills-readers.test.ts`; el experimento de la inclusión para `skills.test.ts`.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/kit/skills-readers.test.ts test/kit/skills.test.ts` → `Tests  <n> passed (<n>)`
**Se prueba en la aplicación**: no, porque tests del repo.

**Interfaces**:
- Consume: `readText`, `repoRoot`, `filesUnder`, `markdownFiles`, `skillNames` de `cli/test/kit/kit-files.ts`.
- Produce: nada; `skillsReaders(file: string, text: string): string[]` es local del test y se prueba con textos en línea.

**Ficheros**: crear `cli/test/kit/skills-readers.test.ts`; modificar `cli/test/kit/skills.test.ts`.

- [ ] **Step 1: RED** — `skills-readers.test.ts`:
  - `flags a test that runs a fenced block read from skills/`: el texto de `worktrees-setup.slow.test.ts` de `35e08439^` (`git show 35e08439^:cli/test/kit/worktrees-setup.slow.test.ts`, pegado como fixture recortada a la línea de la lectura y la regex de la valla) → `['<fichero>:<línea>: lee skills/ y ejecuta o compara un bloque de código: léelo de dist/skills/, que es lo que carga el agente']`.
  - `accepts the same test reading dist/skills/` → `[]`.
  - `accepts a reader of skills/ without a fence` → `[]`.
  - `no test reads skills/ to run or compare a code block`: cada `.ts` de `cli/test/` (`filesUnder`, sin `fixtures/` ni este fichero) → `[]`.
  Lectura = `/readText\(\s*['"\`]skills\//` o `/join\(\s*repoRoot\s*,\s*['"\`]skills/`; valla = tres comillas invertidas o `~~~` en el texto del fichero. La línea es la de la primera lectura. Ver los tres primeros en rojo con la función vacía.
- [ ] **Step 2: Implementación** — la función. Ver en verde los cuatro.
- [ ] **Step 3: RED de `skills.test.ts`** — experimento sin commitear: `includes/x.md` con `[enlace](references/no-existe.md)`, `<!-- kit: incluye x -->` en `skills/sdd-rubber-duck/SKILL.md` (propia), `moon run kit:build`; `npx vitest run test/kit/skills.test.ts` pasa (el hueco). Salida al walkthrough.
- [ ] **Step 4: `skills.test.ts` lee `dist/skills/`** — `const distSkills = join(repoRoot, 'dist', 'skills')`; el `describe.each(skills)` (con `readText(\`dist/skills/${skill}/SKILL.md\`)`, enlaces, `@` y `references/` huérfanos, también en `reachableReferences`) y `índice de sdd-templates` usan `distSkills`; privacidad, skills invocadas, NOTICE de las adaptadas y la lista del README siguen en `skillsRoot`. Con el experimento puesto, `skills.test.ts` da rojo con `references/no-existe.md`. Deshacer el experimento (Edit inverso de `SKILL.md`, borrar `includes/x.md` e `includes/` si queda vacía, `moon run kit:build`) y ver en verde.
- [ ] **Step 5: Verificación** — los comandos de «Verificación»; `git status --short` sin `includes/` ni `skills/`.
- [ ] **Step 6: Commit de la task** — `test(kit): los tests que leen skills/ para ejecutar un bloque dan rojo, y skills.test.ts mira dist/skills/`.

### Task 3 — kit:upstream: un `own` con una línea literal de una fuente da rojo

**Tras**: —
**Modelo**: Native, esta sesión (despacho tras compactación: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`)
**Tests RED**: hilo principal · `cli/test/kit/upstream-watch.slow.test.ts`.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/kit/upstream-watch.slow.test.ts --test-timeout 120000` → `Tests  <n> passed (<n>)`; `moon run kit:upstream` → `Fuentes al día: <n> entradas.`
**Se prueba en la aplicación**: no, porque herramientas del repo.

**Interfaces**:
- Consume: `prepareSource` y `SourceClone` de `tests/upstream/check.ts`; `kindOf`, `Registry`, `watchedRefs` de `build/sources.ts`; `WHOLE_LINE_MARK` de `build/dist.ts`.
- Produce: `ownLiterals(registry: Registry, repoRoot: string, prepared: SourceClone[]): Promise<string[]>` en `tests/upstream/check.ts`.

**Ficheros**: modificar `tests/upstream/check.ts`, `cli/test/kit/upstream-watch.slow.test.ts`.

- [ ] **Step 1: RED** — en `upstream-watch.slow.test.ts`, `newRegistry` acepta `own`; un helper escribe `skills/juguete-propia/SKILL.md` junto a `upstream.json`; con `release(origin, 'v1.0.0', { 'a.md': <línea de 80 caracteres> })`:
  - `fails on an own line copied literally from a source` → `{ output: 'skills/juguete-propia/SKILL.md:3: línea literal de Juguete a.md@v1.0.0, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «<6 primeras palabras>…»', code: 1 }`.
  - `fails on the same line indented in the own` → el mismo rojo.
  - `finds a line only in the version of an entry`: la línea en `v0.9.0`, quitada en `v1.0.0`, entrada con `version: 'v0.9.0'` y el diff de rutas en verde → el rojo con `a.md@v0.9.0` (más la línea de `cambian sus rutas`, que se espera literal).
  - `ignores an own line under 70 characters` → `upToDate`.
  - `reports each literal line once` (Review Focus).
  Ver en rojo.
- [ ] **Step 2: Implementación** — en `checkRegistry`, guardar los `SourceClone` preparados y, tras las referencias, `problems.push(...await ownLiterals(registry, dirname(registryPath), prepared))` (`main` pasa la raíz). `ownLiterals`: ficheros de `registry.own` bajo la raíz (por `readdirSync` recursivo, sin `NOTICE`), líneas `trim()` de 70 o más y que no casan `WHOLE_LINE_MARK`; por fuente, versiones = último tag, después cada `version` de sus `watchedRefs` sin repetir; por versión, `spawnSync('git', ['-C', clone, 'grep', '-F', '-I', '-f', '-', version], { input: líneas.join('\n'), encoding: 'utf8' })`, que da `<version>:<ruta>:<texto>`; cada línea del `own` cuyo texto `trim()` está contenido en un resultado se informa una vez, con la primera versión que la da. Salida 1 de `git grep` = sin coincidencias. Ver en verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; `moon run kit:upstream` real en verde (si sale una línea literal, es un desvío: para).
- [ ] **Step 4: Commit de la task** — `feat(kit): kit:upstream da rojo con un own que lleva una línea literal de una fuente`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,3 h
- Estimación de implementación: 2 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,6 h
- Base de la estimación: 3 tasks de herramientas, con los tests fijados; la incertidumbre es si la racha o la forma dan falsos rojos en las copias reales.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Criterios de éxito de la spec: `moon run kit:build kit:copies kit:upstream` (en `kit:copies`, solo las 6 líneas de hoy con ` → <fila>`) y `npx vitest run test/kit/upstream-watch.slow.test.ts --test-timeout 120000`
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED gramática, los cinco THEN/AND de errores sin cambios → Task 1, los tests de `checkCopy: la gramática de la marca` de hoy. ✓
- AND sin `fin` antes de la marca siguiente acaba en la línea en blanco → Task 1, `ends a block at the first blank line outside a fence` y `ends a text block at a blank line when the next mark is not fin`. ✓
- AND con `fin` antes de la marca siguiente acaba en `fin` → Task 1, `ends a text block at fin across a blank line`. ✓
- AND marca, línea en blanco, otra marca y `fin` → Task 1, `ends a text block at a blank line when the next mark is not fin`. ✓
- AND marca dentro de una valla → Task 1, `reads a mark inside a fence` y `ends a block inside a fence only at fin` de hoy. ✓
- ADDED racha, THEN «da solo» → Task 1, `reports a block that eats original lines inside a fence`. ✓
- AND con `fin` antes de la línea en blanco no da rojo → Task 1, el mismo test. ✓
- AND fuera de valla con `fin` que se come un párrafo → Task 1, `reports a text block whose fin eats an original paragraph`. ✓
- AND una sola línea igual no da rojo → Task 1, `ignores blank lines and a lone equal line`. ✓
- ADDED dist-compare, THEN sangría → Task 1, `names a line with another indent`. ✓
- AND listas juntadas, línea en blanco doble → Task 1, `names two list items joined`, `names a doubled blank line`. ✓
- AND párrafo partido en otros saltos no cuenta → Task 1, `ignores a paragraph wrapped at other points`. ✓
- AND `igual` y salida 0 → Task 1, `writes igual for a file equal to its base`. ✓
- AND `--base` con una referencia que no existe → Task 1, `rejects a base that does not exist`. ✓
- AND las dos secciones, párrafos primero, y un fichero que no está en la base → Task 1, Step 6, a mano (un fichero nuevo de `dist/` con `--base develop`), apuntado en el walkthrough: lo decide `main`, sin test unitario. ⚠
- ADDED own, THEN rojo con la línea → Task 3, `fails on an own line copied literally from a source`. ✓
- AND sangrada → Task 3, `fails on the same line indented in the own`. ✓
- AND solo en la `version` de una entrada → Task 3, `finds a line only in the version of an entry`. ✓
- AND menos de 70 → Task 3, `ignores an own line under 70 characters`. ✓
- AND `Fuentes al día` sin literales → Task 3, el S1 de hoy y `moon run kit:upstream` real. ✓
- Decisión 7 (lectores de `skills/`) → Task 2, `skills-readers.test.ts`. ✓
- Decisión 8 (`skills.test.ts` en `dist/skills/`) → Task 2, Steps 3-4, experimento de la inclusión. ✓
- Tabla «Lo que se retira o cambia de forma», fila 1 → Task 1; fila 2 → Task 1, `architecture.md`; fila 3 → Task 2. ✓
- Review Focus → Task 1 y Task 3, sus tests nombrados. ✓
