---
id: 20261103-201153-feature-0302-annotated-copies
feature: 0302
title: Plan de implementación — Las copias anotadas contra su fuente
spec: ./spec.md
status: approved
created: 2026-11-03
---

# Plan de implementación — Las copias anotadas contra su fuente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native. Las cuatro tasks las implementa la sesión, en Opus 5.5: el dev-lead eligió «Apruebo» y no la parada para bajar de modelo. La revisión final va en tres ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet` y Arquitectura `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: Native, por la línea `Ejecución`.
3. **Las funciones puras viven en `tests/copies/annotated.ts`**, y las órdenes en `check.ts` y `update.ts`. La lectura de los clones (`findClones`) sale de `tests/upstream/check.ts` a `tests/upstream/clones.ts`, compartida, sin duplicarla.
4. **`git merge-file` corre sobre ficheros de una carpeta temporal de `os.tmpdir()`**, como `build/dist.ts`. Los tests fijan `TMP` a `.temp/` (`cli/test/temp-setup.ts`).
5. **El diff por palabras de «lo quitado» (decisión 3 de la spec) es un LCS de palabras normalizadas**, entre las líneas del tramo del original y el contenido de los bloques de ese sitio. Si dos bloques caen en el mismo tramo, sus S se concatenan en orden.
6. **Riesgo alto**: que el alineado o el LCS de palabras den falsos rojos con texto real. Lo mide la anotación de `code-reviewer-prompt.md` de la Task 3, antes de la Task 4.
7. **Coste**: unas 3 h de implementación. Los subagentes son solo los tres ejes, unos 4 $.
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: la maquinaria con la que la 0312 y la 0296 anotan las copias: la marca, `kit:copies`, `upstream.json` fichero a fichero y `kit:copies-update`.

**Architecture**: funciones puras sobre texto en `tests/copies/annotated.ts`, probadas con fixtures en `cli:test`. Dos órdenes finas leen los clones sin red. El registro gana campos que `build/sources.ts` valida y que `build/notices.ts` y `kit:upstream` aplanan.

**Tech Stack**: TypeScript que Node ≥ 22.18 ejecuta sin compilar, Vitest, moon, git (`merge-file`, `show`, `ls-tree`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 4 tasks encadenadas por la interfaz de `annotated.ts` y del registro, un error lo caza el test de su task y la revisión final por ejes, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — un módulo nuevo (`tests/copies/`) y un contrato entre módulos: la forma de `upstream.json` que leen `build/`, `tests/upstream/` y `tests/copies/`.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Los mensajes son los literales de la spec, carácter a carácter.
- Todo código que llame a git limpia `GIT_DIR` y compañía: usa `git()` de `cli/src/git/git.ts`.
- Sin dependencias nuevas.
- Las tareas de moon van sin shell (`taskOptions.shell: false`).

### De proceso

- Native: la sesión implementa, con el ledger `sdd task start` y `done`. Commits por task, con el formato de la constitution (Art. VI) y la línea `Co-Authored-By` del harness.
- El pre-commit (`.githooks`) corre `cli:test`. `kit:copies` no entra en él: lo lleva la 0311.

## Review Focus

- Una marca `<!-- kit: … -->` dentro de una valla de la fuente anotada → se copia como texto y no abre bloque, igual que en el build · Task 1, `treats a mark inside a fence as text`
- Dos bloques seguidos que caen en el mismo tramo del original → sus S se concatenan en orden y cuadran juntas con lo quitado · Task 1, `concatenates the cites of two blocks at one site`
- Un original sin frontmatter (un `references/*.md`) con una fuente anotada sin frontmatter → no se quita nada en ninguno de los lados · Task 1, `compares files without frontmatter`
- `upstream.json` reescrito por `kit:copies-update` → `JSON.stringify(registro, null, 2)` con salto final, y el resto de entradas queda igual · Task 4, `rewrites only the versions it merged`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: funciones puras más dos órdenes finas, sobre el patrón de `tests/upstream/`.
- [x] **YAGNI gate**: no hay `renombra` global ni marca de evidencia; los límites están nombrados en la spec.
- [x] **Brownfield gate**: `stripMarks` no cambia, solo exporta lo que ya tenía, y los mensajes de `kit:upstream` no cambian de forma.
- [x] **Constitution check**: Art. I (el RED de la frase de atribución es un test), Art. VIII (`dist/` regenerado), Art. IX (registro) y Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/copies/annotated.ts` — leer la fuente anotada (marcas y bloques) y las comprobaciones puras: diff, lo quitado, A+C, absoluta, gramática, 50 %, LF y conflictos.
- `tests/copies/check.ts` — `kit:copies`: recorre el registro, lee los originales de los clones y escribe los rojos.
- `tests/copies/update.ts` — `kit:copies-update`: fusiona con `git merge-file` y actualiza el registro.
- `tests/copies/package.json` — `{"type":"module"}`, como `tests/upstream/`.
- `tests/upstream/clones.ts` — `findClones`, `originRepo` y `repoOfUrl`, que salen de `check.ts`.
- `cli/test/kit/copies.test.ts` — las funciones puras y el experimento.
- `cli/test/kit/copies.slow.test.ts` — las dos órdenes contra un repo git temporal.
- `cli/test/fixtures/copies/sdd-v7.0.0.md`, `sdd-v7.0.1.md` y `sdd-annotated-v7.0.0.md` — el experimento.

**Modificar**:

- `build/dist.ts` — exporta `nextBlock`, `Block`, `FENCE` y `WHOLE_LINE_MARK`; nada más cambia.
- `build/sources.ts` — tipos y validación de `pending`, `from`, `own` y `notCopied`.
- `build/notices.ts` — `NOTICE` agrupado por fuente y versión, con los `from`.
- `tests/upstream/check.ts` — aplana `from` y usa `clones.ts`.
- `upstream.json` — fichero a fichero y la clasificación de la decisión 8 de la spec.
- `cli/test/kit/notices.test.ts` — `toy` nuevo, la clasificación y «see NOTICE».
- `cli/test/kit/upstream-watch.slow.test.ts` — sus registros de prueba con la forma nueva, y `from`.
- `cli/test/kit/word-budget.test.ts` — cuenta `dist/skills/`.
- `skills/sdd-grilling/SKILL.md:10` y `skills/sdd-rubber-duck/SKILL.md:10` — «(MIT, see `NOTICE`)» → «(MIT)».
- `.gitattributes` — `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`.
- `moon.yml` — las tareas `copies` y `copies-update`.
- `THIRD_PARTY_NOTICES.md`, `skills/*/NOTICE` y `dist/` — regenerados con `moon run kit:notices`.

**NO se tocan**:

- Las copias de `skills/`: las anota la 0312. Solo se reescriben sus finales de línea en la copia de trabajo, sin cambio de blob.
- `.githooks/` y `.github/workflows/`: la 0311.

### 1.2-1.5

No aplica.

### 1.6 Dependencias

Los clones de `SDD_UPSTREAM_DIR` (`D:/code/github/upstream` en esta máquina), para la Task 3 y la prueba real; los tests no los necesitan.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El alineado da falsos rojos con texto real (vallas, tablas) | media | la 0312 rehace la marca | la anotación real de `code-reviewer-prompt.md` en la Task 3 |
| `git merge-file` da más de 2 conflictos con las marcas de cierre `fin` | baja | el experimento sale distinto de la review | el fixture copia `make-ours.mjs`; si sale distinto, la cifra va al walkthrough como hallazgo, no se fuerza |
| Reescribir la copia de trabajo en LF rompe `dist.test.ts` | baja | pre-commit en rojo | el test ya normaliza a LF; se corre en la Task 2 |

### 1.8 Rollout

Directo: nada viaja salvo los `NOTICE` y las dos frases de atribución en `dist/`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La marca y las comprobaciones puras

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/copies.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/dist.test.ts` → `Tests  <n> passed (<n>)`

**Interfaces**:
- Consume: `nextBlock`, `Block`, `FENCE` y `WHOLE_LINE_MARK`, exportados de `build/dist.ts` en esta task.
- Produce, en `tests/copies/annotated.ts`:
  - `interface Problem { file: string; line?: number; message: string; fixes?: string }` y `formatProblem(problem: Problem): string`, que da `<file>:<line>: <message>[ → <fixes>]`, o `<file>: <message>` sin línea.
  - `interface CopyInput { file: string; annotated: string; original: string; label: string; fragments: Map<string, string> }`, donde `label` es `<ruta>@<versión>` y `fragments` va de `"<fuente> <ruta>"` al texto de ese `from`.
  - `checkCopy(input: CopyInput): Problem[]`, con todos los rojos de un fichero `.md`.
  - `checkVerbatim(file: string, kit: string, original: string, label: string): Problem[]`, para un fichero que no es `.md`.
  - `keptShare(output: string, original: string): number`, de 0 a 100, entero redondeado, por frases de 6 palabras.
  - `outputOf(annotated: string): string`, la salida sin marcas (lo que deja `stripMarks`).
  - `markTask(line: string): string | null`, la tarea de una línea que es una marca que abre bloque, o `null`.

**Ficheros**: crear `tests/copies/annotated.ts`, `tests/copies/package.json` y `cli/test/kit/copies.test.ts`; modificar `build/dist.ts`.

- [ ] **Step 1: Implementación**:
  - La gramática de la decisión 2 de la spec: campos separados por ` · `; S entre `«` y `»`; `<tarea>` con `/^(\d{4}|[0-9a-f]{7,40})$/`; `fin` sin tarea.
  - El diff de la decisión 4: LCS de líneas exactas tras quitar el frontmatter de los dos lados, con desempate por la primera casa del original.
  - «Lo quitado» de la decisión 3: LCS de palabras con los espacios normalizados.
  - `…` como comodín dentro de un trozo de S y como separador entre trozos: los trozos se comparan en orden con los trozos quitados.
  - La absoluta de la decisión 6: `/\b(only|never|always|must|every)\b/i` en las líneas del original del párrafo, fuera de los bloques.
  - CR, con `/\r/`. Los marcadores de conflicto, con `/^(<{7}|={7}|>{7})( |$)/`.
  - Tests, uno por cláusula, con el mensaje literal de la spec en el assert:
    - `reports a deleted original line without quita`: borra «Never start implementation on a main/master branch without your human» y espera `falta texto del original sin marca quita: «Never start implementation on a main/master…»` en la línea de la vecina anterior;
    - `reports an unmarked line`, también con una línea en blanco nueva;
    - `ignores the frontmatter` y `compares files without frontmatter`;
    - `accepts a mid-line rename cited alone`, con el ejemplo `superpowers:using-git-worktrees`;
    - `rejects a cite that does not match what the block removes`;
    - `accepts an ellipsis cite for a whole paragraph`;
    - `reports a block that says the substituted text again (A+C)`: espera `la marca sustituye «Four things stop you, and only these…», y el bloque vuelve a decir «Four things stop you, and only these»`;
    - `does not report a cite the original repeats elsewhere`;
    - `reports a stale cite`;
    - `reports an addition next to an absolute`, con `(«only»)`, y `ignores an addition in its own paragraph`;
    - `reports each grammar error`, uno por cada mensaje de «La marca del kit se escribe con su gramática»;
    - `ends a block at the first blank line outside a fence`;
    - `treats a mark inside a fence as text`;
    - `concatenates the cites of two blocks at one site`;
    - `reports a de block whose text is not in its fragment`;
    - `appends the fixing row`;
    - `reports CRLF`;
    - `reports a non-md copy that is not its original`;
    - `reports an unresolved merge conflict`;
    - `keptShare measures the original kept`: 40 % y 50 % con textos sintéticos.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit -p .` (lo que corre `cli:typecheck`). Esperado: sin errores.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: todos verdes, `dist.test.ts` incluido.
- [ ] **Step 4: Commit de la task** — `feat(kit): marca de bloque y comprobaciones de una copia contra su original`.

### Task 2 — El registro fichero a fichero

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/notices.test.ts` y `cli/test/kit/upstream-watch.slow.test.ts`.
**Superficies**: tooling · docs (`skills/`, avisos)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/notices.test.ts test/kit/dist.test.ts test/kit/word-budget.test.ts` → `Tests  <n> passed (<n>)`; `pnpm --dir cli exec vitest run test/kit/upstream-watch.slow.test.ts` → `Tests  <n> passed (<n>)`; `node build/dist.ts` → `dist/: <n> ficheros desde .`

**Interfaces**:
- Consume: nada de la Task 1.
- Produce, en `build/sources.ts`:
  - `interface FromRef { source: string; version: string; path: string }`;
  - `Entry` con `from?: FromRef[]` y `pending?: string`;
  - `Source` con `notCopied?: string[]`;
  - `Registry` con `own?: string[]`;
  - `watchedRefs(entry: Entry): { source: string; version: string; paths: string[] }[]`, la entrada con sus `from` aplanados por fuente y versión;
  - `classify(registry: Registry, files: string[]): string[]`, los mensajes de los ficheros sin clasificar o con dos clases.

**Ficheros**: modificar `build/sources.ts`, `build/notices.ts`, `tests/upstream/check.ts`, `upstream.json`, `.gitattributes`, `cli/test/kit/notices.test.ts`, `cli/test/kit/upstream-watch.slow.test.ts`, `cli/test/kit/word-budget.test.ts`, `skills/sdd-grilling/SKILL.md` y `skills/sdd-rubber-duck/SKILL.md`; crear `tests/upstream/clones.ts`.

- [ ] **Step 1: Implementación**:
  - Primero el RED: el test `every skill that says see NOTICE has one` falla en cuanto `upstream.json` pasa `sdd-grilling` y `sdd-rubber-duck` a `concept`. Mensaje: `skills/sdd-grilling/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`. Después se cambian las dos frases.
  - `validateRegistry` lanza `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero`.
  - `renderNotice` agrupa las entradas `copy` y sus `from` por fuente y versión, con las rutas en orden de aparición.
  - `checkEntry` de `kit:upstream` recorre `watchedRefs`.
  - El `upstream.json` nuevo, con la tabla de la decisión 8 de la spec: `pending: "0312"` en las seis copias, y `pending` en `0296`, `0305`, `0306` y `0297`. `own` lleva el resto de `skills/` (también `skills/sdd-tdd/references/writing-e2e.md`, `skills/sdd-verify/references/encargo-revision.md`, `skills/sdd-rubber-duck/` y `skills/sdd-grilling/`) y las rutas de los ports. Se escribe con `JSON.stringify(registry, null, 2)`.
  - `.gitattributes` con las dos líneas, y la copia de trabajo de `skills/` reescrita en LF con un script del scratchpad que solo quita `\r`.
  - `word-budget.test.ts`: `skillWords` lee `join(repoRoot, 'dist', 'skills', skill)`, y `SKILL.md` se lee de `dist/skills/`.
  - Tests:
    - `classifies every file of skills/`, con el mensaje literal, más el caso doble y el de la carpeta `pending`;
    - `rejects a copy without pending with more than one file`;
    - `groups a notice by source and version`;
    - `every skill that says see NOTICE has one`, con y sin comillas invertidas;
    - en `upstream-watch.slow.test.ts`, `watches the from of an entry`.
  - Al final, `moon run kit:notices`. Antes de sobrescribir, se comprueba que cada `NOTICE` conserva sus líneas `Copyright` y el texto de su licencia.
- [ ] **Step 2: Build** — `node build/dist.ts`. Esperado: `dist/` reconstruido, y `git status dist/` solo con los `NOTICE` y las dos `SKILL.md`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación», más `node tests/upstream/check.ts`: los mismos rojos que antes de la task, ahora con un fichero por línea.
- [ ] **Step 4: Commit de la task** — `feat(kit): upstream.json fichero a fichero, con cada pieza copia o propia`.

### Task 3 — `kit:copies` contra los clones

**Tras**: Task 2
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/copies.slow.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/copies.slow.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:copies` en el repo → solo líneas `… sin anotar → <fila>` y salida 1.

**Interfaces**:
- Consume: `checkCopy`, `checkVerbatim`, `keptShare`, `outputOf`, `formatProblem` y `Problem` de `tests/copies/annotated.ts`; `readRegistry`, `watchedRefs` y `Registry` de `build/sources.ts`; `findClones` de `tests/upstream/clones.ts`.
- Produce, en `tests/copies/check.ts`:
  - `checkRegistryCopies(registry: Registry, repoRoot: string, clonesDir: string): Promise<string[]>`, las líneas ya formateadas;
  - `showAt(clone: string, version: string, path: string): Promise<string | null>`.

**Ficheros**: crear `tests/copies/check.ts` y `cli/test/kit/copies.slow.test.ts`; modificar `moon.yml`.

- [ ] **Step 1: Implementación**:
  - Antes de nada se comprueba el tag: `<fuente>: falta <tag> en el clon <clon>`.
  - Ficheros sin mapear: `git ls-tree -r --name-only <version> <carpeta>/`.
  - Por copia, el orden de las comprobaciones es: `pending`, después el 50 % (`<kit>: conserva el <n> % de su original <ruta>; por debajo del 50 % es propia: pásala a own`) y después `checkCopy` o `checkVerbatim`.
  - Sin rojos escribe `Copias al día: <n> ficheros.` y sale con 0; con alguno, con 1.
  - La tarea `copies` en `moon.yml`: `node tests/copies/check.ts`, `cache: false`.
  - Tests, contra un repo git temporal con tags `v1.0.0` y `v1.1.0`, como `upstream-watch.slow.test.ts`:
    - `reports a pending copy in one line`;
    - `reports an unmapped source file`, con `superpowers@v1.1.0:` adaptado a la fuente del repo de prueba;
    - `reports a missing original`;
    - `reports a missing tag without fetching`;
    - `reports a copy below 50 %`;
    - `prints Copias al día and exits 0`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit -p .`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación». Además, la prueba real de la decisión 12 de la spec:
  - se anota `skills/sdd-verify/references/code-reviewer-prompt.md` en el scratchpad, contra `requesting-code-review/code-reviewer.md` v7.0.0 y sus `from` de wondelai v1.8.0;
  - se pasa por `checkCopy` con un script del scratchpad;
  - la salida de `outputOf` tiene que coincidir con el fichero de hoy, con los espacios normalizados;
  - los rojos van al walkthrough;
  - si la gramática no aguanta, se arregla en esta task antes de la 4.
- [ ] **Step 4: Commit de la task** — `feat(kit): kit:copies compara cada copia con su original en los clones`.

### Task 4 — `kit:copies-update` y el experimento de 7.0.0 a 7.0.1

**Tras**: Task 3
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/copies.test.ts` (el experimento) y `cli/test/kit/copies.slow.test.ts` (la orden).
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/copies.slow.test.ts` → `Tests  <n> passed (<n>)`

**Interfaces**:
- Consume: `markTask` de `annotated.ts`; `showAt` de `check.ts`; `readRegistry` de `build/sources.ts`.
- Produce, en `tests/copies/update.ts`:
  - `mergeCopy(annotated: string, older: string, newer: string, labels: [string, string]): Promise<{ text: string; conflicts: number }>`;
  - `conflictBlocks(text: string): { line: number; tasks: string[] }[]`.

**Ficheros**: crear `tests/copies/update.ts` y los tres fixtures de `cli/test/fixtures/copies/`; modificar `moon.yml`, `cli/test/kit/copies.test.ts` y `cli/test/kit/copies.slow.test.ts`.

- [ ] **Step 1: Implementación**:
  - Los fixtures: `sdd-v7.0.0.md` y `sdd-v7.0.1.md` salen de `git -C $SDD_UPSTREAM_DIR/superpowers show <tag>:skills/subagent-driven-development/SKILL.md`. `sdd-annotated-v7.0.0.md` es `make-ours.mjs` de la review, pasado a la gramática de la spec: B3 con la línea entera, y `fin` donde el bloque acaba a mitad de párrafo.
  - `git merge-file -p -L kit -L <vieja> -L <nueva>` en una carpeta temporal. Un código negativo lanza un error, y la orden sale sin escribir nada.
  - Las líneas de conflicto: `<kit>:<línea>: conflicto con el bloque <tarea>; si te quedas con la versión de la fuente, el bloque se pierde`.
  - El registro se escribe una vez al final, con las versiones de las copias fusionadas y de sus `from` de esa fuente.
  - La tarea `copies-update` en `moon.yml`: `node tests/copies/update.ts`, `cache: false`, con los argumentos tras `--`.
  - Tests:
    - `merges the 7.0.0 experiment into 7.0.1 with its two conflicts`: 2 conflictos; uno contiene el texto de B4 y otro el de B5; los de B1, B2, B3 y B6 están en el resultado sin marcadores;
    - `lists the blocks inside each conflict`;
    - `kit:copies reports the unresolved conflict`;
    - `skips a copy whose original moved`, con el mensaje y la `version` sin cambiar;
    - `writes nothing when merge-file fails`;
    - `leaves a pending copy untouched`;
    - `rewrites only the versions it merged`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit -p .`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: 2 conflictos en el experimento.
- [ ] **Step 4: Commit de la task** — `feat(kit): kit:copies-update fusiona una copia con git merge-file`.

### Task 5 — enmienda 2026-11-03: marcas dentro de una valla

**Tras**: Task 4
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/dist.test.ts` y `cli/test/kit/copies.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/dist.test.ts test/kit/copies.test.ts` → `Tests  <n> passed (<n>)`

**Interfaces**:
- Consume: `stripMarks` de `build/dist.ts`; el `Reader` de `tests/copies/annotated.ts`.
- Produce: nada nuevo; cambia qué es una marca dentro de una valla.

**Ficheros**: modificar `build/dist.ts`, `tests/copies/annotated.ts`, `cli/test/kit/dist.test.ts` y `cli/test/kit/copies.test.ts`; `dist/` no cambia, porque ninguna skill tiene marcas.

- [ ] **Step 1: Implementación**:
  - `isMarkToDrop` quita una línea entera `<!-- kit: … -->` también dentro de una valla. Un `<!-- kit:` con texto delante o detrás dentro de una valla se sigue copiando tal cual; fuera sigue siendo «marca mal puesta».
  - El `Reader` lee una marca de línea entera también dentro de una valla. Dentro de una valla, un bloque no acaba en una línea en blanco: acaba en `fin` o en la marca siguiente.
  - Tests:
    - en `dist.test.ts`, `keeps a kit mark inside a fenced code block` pasa a `strips a whole-line kit mark inside a fenced code block`, con `x <!-- kit: a` todavía copiado tal cual;
    - en `copies.test.ts`, `treats a mark inside a fence as text` pasa a `reads a mark inside a fence`;
    - `ends a block inside a fence only at fin` es nuevo: un cambio en un ejemplo dentro de una valla con líneas en blanco, cerrado con `fin`, da verde.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit -p .` y `node build/dist.ts`. Esperado: sin errores, y `dist/` sin cambios.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Después se repite la prueba real de la decisión 12 con `code-reviewer-prompt.md` y `sdd-parallel-agents/SKILL.md`, y su resultado va al walkthrough.
- [ ] **Step 4: Commit de la task** — `feat(kit): una marca vale también dentro de una valla de código`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5 h (la entrevista y la medida de las copias, la revisión con dos revisores y su pasada)
- Estimación de implementación: 3 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 4 tasks de tooling sin skills que medir con sujetos. La 0300, del mismo tipo, estimó 4 h e hizo 1,3 h (ratio 0,33, `estimation-log.md`). La incertidumbre está en el alineado con texto real (Task 3).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` (`tech-stack.md` §Testing). `cli:test-slow`, también una vez: los tests nuevos son `*.slow.test.ts`.
- [ ] `moon run kit:copies` en el repo: solo líneas `sin anotar → <fila>`. `node tests/upstream/check.ts`: los mismos rojos que en `develop`, con un fichero por línea.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según `sdd-archive`.

---

## 4. Self-review (cobertura spec → tasks)

- «Una copia es su original…», THEN (líneas en orden, tramos cubiertos) → Task 1, `reports a deleted original line without quita` y `reports an unmarked line`. ✓
- La misma, AND «Never start implementation…» en la vecina anterior → Task 1, `reports a deleted original line without quita`. ✓
- La misma, AND línea en blanco nueva → Task 1, `reports an unmarked line`. ✓
- La misma, AND frontmatter → Task 1, `ignores the frontmatter`. ✓
- La misma, AND `de: Wondel` → Task 1, `reports a de block whose text is not in its fragment`. ✓
- «Lo que sustituye una marca…», THEN y sus tres AND → Task 1, `accepts a mid-line rename cited alone`, `rejects a cite that does not match what the block removes` (también con `quita`) y `accepts an ellipsis cite for a whole paragraph`. ✓
- «Una frase sustituida…», THEN y sus dos AND → Task 1, `reports a block that says the substituted text again (A+C)`, `does not report a cite the original repeats elsewhere` y `reports a stale cite`. ✓
- «Un añadido junto a una absoluta…», THEN y sus dos AND → Task 1, `reports an addition next to an absolute` e `ignores an addition in its own paragraph`. ✓
- «La marca del kit se escribe con su gramática», cada AND → Task 1, `reports each grammar error` y `ends a block at the first blank line outside a fence`. ✓
- «Lo que dice kit:copies…», THEN, `arregla`, `pending` y código de salida → Task 1, `appends the fixing row`; Task 3, `reports a pending copy in one line` y `prints Copias al día and exits 0`. ✓
- «Una copia que ya no lo es…» → Task 1, `keptShare measures the original kept`; Task 3, `reports a copy below 50 %`. ✓
- «La fuente de una copia va en LF», THEN y sus dos AND → Task 1, `reports CRLF` y `reports a non-md copy that is not its original`; Task 2, `.gitattributes` con las dos líneas (revisado en el diff). ✓
- «Un fichero de la fuente sin mapear…», THEN y sus dos AND → Task 3, `reports an unmapped source file`, `reports a missing original` y `reports a missing tag without fetching`. ✓
- «Actualizar una copia…», THEN y cada AND → Task 4, `merges the 7.0.0 experiment into 7.0.1 with its two conflicts`, `lists the blocks inside each conflict`, `kit:copies reports the unresolved conflict`, `skips a copy whose original moved`, `writes nothing when merge-file fails` y `leaves a pending copy untouched`. ✓
- «Cada fichero de skills/…», THEN y sus tres AND → Task 2, `classifies every file of skills/` y `rejects a copy without pending with more than one file`. ✓
- «Una skill que remite a su NOTICE…» → Task 2, `every skill that says see NOTICE has one`. ✓
- MODIFIED «El corte compara…», AND `from` y `<kit>` de fichero → Task 2, `watches the from of an entry`; las demás cláusulas, con los tests que ya tiene `upstream-watch.slow.test.ts`. ✓
- Tabla «Lo que se retira o cambia de forma»:
  - las entradas agrupadas, los ports, los `NOTICE` y `word-budget` → Task 2;
  - lo que se exporta de `build/dist.ts` → Task 1;
  - `code-reviewer-prompt.md:210`, la ADR 0022 y `checks.mjs` → sin cambio aquí: la 0312 o «se queda». ✓
- Decisión 12 de la spec (la copia real) → Task 3, Step 3, y Task 5, Step 3, en el walkthrough. ✓
- Enmienda 2026-11-03 (marcas dentro de una valla; AND nuevo de la gramática; MODIFIED de «La skill que carga el agente sale limpia del build») → Task 5, `strips a whole-line kit mark inside a fenced code block`, `reads a mark inside a fence` y `ends a block inside a fence only at fin`. ✓
- Review Focus → Task 1, `treats a mark inside a fence as text`, `concatenates the cites of two blocks at one site` y `compares files without frontmatter`; Task 4, `rewrites only the versions it merged`. ✓
