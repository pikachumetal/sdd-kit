---
id: 20261104-103810-feature-0312-annotate-real-copies
feature: 0312
title: Plan de implementación — Las copias del kit, anotadas contra su fuente y subidas a su último tag
spec: ./spec.md
status: approved
created: 2026-11-04
---

# Plan de implementación — Las copias del kit, anotadas contra su fuente y subidas a su último tag

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native. La sesión implementa las cuatro tasks, en Opus 5.5: el dev-lead eligió «Apruebo», no la parada para bajar de modelo. La revisión final va en tres ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet` y Arquitectura `sdd-kit:effort-high` + `opus`, como fija la política de modelos de la spec. Los dos sujetos del humo van en Sonnet, con el lanzador de baterías.
2. **Ejecución**: Native, por la línea `Ejecución`.
3. **El borrador sale de la 0302 a la carpeta de esta spec** como `real-copies/annotate.mjs`, con el fallo de la decisión 1 de la spec arreglado: un bloque cuyo tramo del original acaba en una línea en blanco no lleva `fin`, y esa línea en blanco queda tras el contenido. El borrador de la 0302 no se toca, porque es evidencia de su cierre.
4. **La comparación de `dist/` con el texto de hoy** es `real-copies/compare-dist.mjs <fichero de dist/>…`. Lee cada fichero de `develop` con `git show develop:<ruta>` y el del árbol, normaliza los espacios y escribe las diferencias por palabras. La salida de cada task va al walkthrough.
5. **La comprobación de la versión vive en `build/notices.ts`** como `versionsInText(root, files, registry): string[]`, junto a `seeNoticeWithout`, y la llama `notices.test.ts` igual. El patrón se construye con las claves y los `repo` de `registry.sources`, escapados.
6. **El renombrado vive en `planEntry` de `tests/copies/update.ts`.** Si `showAt` da `null` en el tag nuevo, llama a `renamedPath(clone, older, newer, path): Promise<string | null>`, que lee `git diff --name-status -M --diff-filter=R <older> <newer>`. El `Planned` gana `newPath?: string`; `updateSource` cambia `entry.paths[0]` y escribe la línea `<kit>: su original <ruta> pasa a <ruta nueva> en <tag>` antes de la de la fusión.
7. **Riesgo alto**: que `git merge-file` de `skill-mechanics.md` de v7.0.0 a v7.0.2 deje conflictos grandes, porque la 7.0.2 reescribe 324 líneas de `SKILL.md`. La Task 4 los resuelve con la regla de la decisión 12 de la spec, y la comparación de `dist/` de la decisión 4 dice qué texto cambió.
8. **Coste**: unas 4 h de implementación. Los subagentes son los tres ejes, unos 4 $, y los dos sujetos, de ~2 $ a ~4 $.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: las seis skills copiadas, anotadas contra su original y subidas a superpowers v7.0.2 y mattpocock/skills v1.3.2, sin versiones en el texto.

**Architecture**: casi todo es texto de `skills/` y datos de `upstream.json`, comprobados por `kit:copies`, `kit:upstream` y `cli:test`. El código cambia en dos sitios: `kit:copies-update` sigue un renombrado (`tests/copies/update.ts`) y una función nueva de `build/notices.ts` busca versiones en el texto.

**Tech Stack**: TypeScript que Node ≥ 22.18 ejecuta sin compilar, Vitest, moon, git (`merge-file`, `show`, `diff -M`), el lanzador de baterías `tests/headless/battery.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las cuatro tasks van en cadena sobre los mismos ficheros y el mismo registro, un error lo caza `kit:copies` en su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no hay módulo, dependencia ni contrato nuevos: `upstream.json` mantiene la forma de la 0302, y `update.ts` y `notices.ts` ganan una función cada uno.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Los mensajes son los literales de la spec, carácter a carácter: `<fichero>:<línea>: la versión de una fuente vive en upstream.json, no en el texto: «<trozo>»` y `<kit>: su original <ruta> pasa a <ruta nueva> en <tag>`.
- Todo código que llame a git usa `git()` de `cli/src/git/git.ts`.
- Sin dependencias nuevas.
- La fuente de una copia va en LF y con los saltos de línea de su original; ninguna frase de la fuente se cambia salvo con su marca, y ninguna frase del kit cambia salvo la palabra de la versión de las atribuciones (decisión 3 de la spec) y la cabecera de `sdd-worktrees/SKILL.md:10` (decisión 4).
- Nunca se edita `dist/` a mano: sale de `moon run kit:build`, y `THIRD_PARTY_NOTICES.md` y los `NOTICE`, de `moon run kit:notices`.

### De proceso

- Native: la sesión implementa, con el ledger `sdd task start` y `done`. Commits por task, con el formato de la constitution (Art. VI) y la línea `Co-Authored-By` del harness.
- El pre-commit (`.githooks`) corre `cli:typecheck cli:test kit:roadmap`. `kit:copies` y `kit:upstream` no entran en él: lo lleva la 0311.
- Un push a GitHub, con SSH caído, va por HTTPS con el token de `gh` en `GIT_CONFIG_*`, solo en el entorno del comando.
- Si `kit:copies` da un rojo en una skill sin fila (decisión 5 de la spec), su fila de deuda se abre con `sdd-roadmap` en la task que lo encuentra, con el id de `sdd id next`.

## Review Focus

- Una línea de un original v7.0.2 que menciona una versión de otra fuente → no hay ninguna hoy (medido); si la trae una subida futura, el test da rojo y obliga a decidir → Task 1, `every skill text is free of source versions`, que lee las fuentes anotadas de `skills/`, con el texto de los originales dentro: tras la subida de la Task 4 sigue en verde.
- Un renombrado con menos del 50 % de parecido → git no da `R`, y la copia sigue sin tocarse con «no existe… mapéalo» → Task 3, `treats a rewrite below git's rename threshold as missing`.
- Un bloque del kit que vivía en una sección que la 7.0.2 saca de `SKILL.md` → conflicto de `git merge-file`, y el bloque pasa al fichero nuevo, nunca se pierde → Task 4, comparación de `dist/` (decisión 4) sin palabras del kit perdidas.
- `notCopied` con una ruta que no existe en la versión de las copias → no da rojo, pero es ruido → Task 4 deja solo las rutas de v7.0.2, comprobado a mano contra `git ls-tree`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el código nuevo son dos funciones; el resto es anotar con la maquinaria de la 0302.
- [x] **YAGNI gate**: el renombrado lo usa esta feature (`testing-skills-with-subagents.md`); un `from` renombrado no se sigue, porque nadie lo necesita aquí.
- [x] **Brownfield gate**: el formato de `upstream.json` y la gramática de la marca no cambian.
- [x] **Constitution check**: Art. I (humo y motivos en la Previsión de la spec), Art. IX (sustituye, no añade; nada se arregla), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261104-103810-feature-0312-annotate-real-copies/real-copies/annotate.mjs` — el borrador de anotación arreglado.
- `.docs/sdd/specs/20261104-103810-feature-0312-annotate-real-copies/real-copies/compare-dist.mjs` — la comparación de `dist/` con `develop`.
- `skills/sdd-agent-writing/references/discovery.md`, `flowcharts.md`, `bulletproofing.md` y `persuasion-principles.md` — copias de superpowers v7.0.2 (Task 4).

**Modificar**:

- Las fuentes anotadas: `skills/sdd-tdd/SKILL.md`, `skills/sdd-tdd/references/writing-good-tests.md`, `skills/sdd-debugging/SKILL.md`, `skills/sdd-debugging/references/{root-cause-tracing,defense-in-depth,condition-based-waiting}.md`, `skills/sdd-debugging/references/condition-based-waiting-example.ts`, `skills/sdd-worktrees/SKILL.md`, `skills/sdd-parallel-agents/SKILL.md`, `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/references/{architecture,code,spec}-reviewer-prompt.md`, `skills/sdd-agent-writing/SKILL.md`, `skills/sdd-agent-writing/references/{skill-mechanics,skill-testing}.md`.
- La palabra de la versión: `skills/sdd-implement/SKILL.md:10`, `skills/sdd-archive/SKILL.md:10`, `skills/sdd-propose/references/{spec,plan}-writing.md:3`.
- `upstream.json` — sin `pending: "0312"`, `notCopied`, las entradas de `sdd-agent-writing` y las de mattpocock en v1.3.2.
- `build/notices.ts` — `versionsInText`.
- `tests/copies/update.ts` — el renombrado.
- `cli/test/kit/notices.test.ts`, `cli/test/kit/copies.slow.test.ts` — sus tests.
- `tests/batteries/sdd-agent-writing/battery.md` — la procedencia de las reglas, al reparto nuevo.
- `THIRD_PARTY_NOTICES.md`, `skills/*/NOTICE`, `dist/` — regenerados.
- `.docs/sdd/capabilities/kit-distribution.md` — la fusión del delta, en el cierre (`sdd-archive`).

**NO se tocan**:

- `tests/copies/annotated.ts` y `check.ts` — la maquinaria de la 0302 vale tal cual; si no aguanta el texto real, es un desvío y se para.
- `.docs/sdd/specs/20261103-201153-feature-0302-annotated-copies/real-copies/` — evidencia de la 0302.
- Las entradas `pending` de 0296, 0297, 0305 y 0306, y los conceptos de 0313 y 0314.

### 1.6 Dependencias

- La maquinaria de la 0302 (`kit:copies`, `kit:copies-update`, `kit:notices`, `kit:upstream`).
- Los clones de `SDD_UPSTREAM_DIR` (`D:/code/github/upstream`) con superpowers v7.0.2, mattpocock/skills v1.3.2 y wondelai/skills v1.8.0, comprobados el 2026-11-04.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El borrador da falsos rojos que no son del texto (vallas, listas, tablas) | media | una task más larga | revisar cada rojo a mano; si la gramática de la 0302 no aguanta un caso real, parar por desvío |
| La fusión de `skill-mechanics.md` da conflictos grandes | alta | Task 4 larga | resolver con la decisión 12 de la spec; comparar `dist/` con `develop` (decisión 4) |
| Un fichero repartido baja del 50 % | baja | la decisión 8 de la spec se cae | medirlo con `kit:copies` en la Task 4; si pasa, parar por desvío |
| El humo falla por el reparto | baja | una tanda de REFACTOR | la previsión ya la cuenta; por encima de ~4 $ o ~40 min, parar |

### 1.8 Rollout

Directo: entra en la 3.0.0 con el resto de la propuesta 0301.

### 1.9 Excepciones a la constitution

Ninguna. El Art. I se cumple con el humo y el motivo de no medir de cada skill, en la Previsión de la spec.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Las copias de superpowers con una sola fuente, y la versión fuera del texto

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/notices.test.ts`, escritos antes de tocar las skills y sin commitear.
**Superficies**: tooling · docs (skills).
**Verificación**: `moon run cli:typecheck cli:test` → `Tests  <n> passed (<n>)`; `moon run kit:copies` → solo líneas con ` → <fila>`; `node .docs/sdd/specs/20261104-103810-feature-0312-annotate-real-copies/real-copies/compare-dist.mjs <ficheros de dist/ de la task>` → solo la palabra de la versión y la cabecera de `sdd-worktrees`.

**Interfaces**:
- Consume: `checkCopy`, `outputOf` y `keptShare` de `tests/copies/annotated.ts`; `readRegistry` de `build/sources.ts`; `listSources` de `build/dist.ts`.
- Produce: `versionsInText(root: string, files: string[], registry: Registry): string[]` en `build/notices.ts`; `real-copies/annotate.mjs <original> <kit> <out> <tarea>` y `real-copies/compare-dist.mjs <ruta de dist/>…`.

**Ficheros**: `build/notices.ts`, `cli/test/kit/notices.test.ts`, las dos herramientas de `real-copies/`, `skills/sdd-tdd/`, `skills/sdd-debugging/`, `skills/sdd-worktrees/SKILL.md`, `skills/sdd-parallel-agents/SKILL.md`, la palabra de la versión en los trece sitios, `upstream.json`.

- [ ] **Step 1: RED** — en `notices.test.ts`, `it('every skill text is free of source versions')`. Primero, `expect(versionsInText(repoRoot, files, readRegistry(join(repoRoot, 'upstream.json')))).toEqual([])` sobre los `.md` de `skills/` que da `listSources`, fuera de `skills/sdd-upgrade/references/migrations/`. Después, un caso de prueba en una carpeta temporal:
  - `skills/a/SKILL.md` con `Forked from x of superpowers 7.0.0 (MIT)` → `'skills/a/SKILL.md:1: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»'`;
  - `skills/b/SKILL.md` con ``from `wondelai/skills` 1.8.0`` → `'skills/b/SKILL.md:1: la versión de una fuente vive en upstream.json, no en el texto: «`wondelai/skills` 1.8.0»'`;
  - `skills/c/SKILL.md` con `<!-- kit: 0312 · sustituye: «superpowers 7.0.0» -->` → nada;
  - `skills/sdd-upgrade/references/migrations/v2.0.0.md` con `superpowers 7.0.0` → nada.

  Corre y falla: sin la función, y con ella, con los trece sitios.
- [ ] **Step 2: GREEN del test** — `versionsInText` con el patrón `` (<clave>|<repo>)`?\s+v?\d+(\.\d+)+ ``, que salta las líneas de marca y los `NOTICE`. Se quita la palabra de la versión en los trece sitios de la decisión 3 de la spec, y en `sdd-worktrees/SKILL.md:10` la cabecera pasa a su propio párrafo. El test pasa.
- [ ] **Step 3: Anotar** — copia del borrador de la 0302 a `real-copies/annotate.mjs`, con el arreglo de la decisión 3 del plan. Anota contra superpowers v7.0.0 (`git -C $SDD_UPSTREAM_DIR/superpowers show v7.0.0:<ruta>`): `sdd-tdd/SKILL.md`, `references/writing-good-tests.md`, `sdd-debugging/SKILL.md` y sus tres `references/*.md`, `sdd-worktrees/SKILL.md` y `sdd-parallel-agents/SKILL.md`. `condition-based-waiting-example.ts` pasa a ser su original byte a byte, en LF. Cada marca lleva la tarea `0312`. El añadido «(the task's «Verificación»)» de la lista de `sdd-tdd` lleva `arregla: 0307`.
- [ ] **Step 4: Registro** — en `upstream.json`, quitar `pending` de esas nueve entradas. `sources.superpowers.notCopied` pasa a `["skills/systematic-debugging/CREATION-LOG.md", "skills/systematic-debugging/find-polluter.sh", "skills/systematic-debugging/test-academic.md", "skills/systematic-debugging/test-pressure-1.md", "skills/systematic-debugging/test-pressure-2.md", "skills/systematic-debugging/test-pressure-3.md"]`. Después, `moon run kit:notices kit:build`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación». `kit:copies` da solo `skills/sdd-tdd/SKILL.md:<línea>: añadido del kit sin sustituye en un párrafo con una absoluta del original («every») → 0307`, los rojos con su fila y los `sin anotar → <fila>`.
- [ ] **Step 6: Commit de la task**.

### Task 2 — `sdd-verify`

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: ninguno: no hay código; lo comprueba `kit:copies`.
**Superficies**: docs (skills).
**Verificación**: `moon run cli:test` → `Tests  <n> passed (<n>)`; `moon run kit:copies` → sin rojos en `skills/sdd-verify/` salvo los de ` → 0307`; `compare-dist.mjs dist/skills/sdd-verify/SKILL.md dist/skills/sdd-verify/references/*-reviewer-prompt.md` → solo la palabra de la versión.

**Interfaces**:
- Consume: `real-copies/annotate.mjs` y `compare-dist.mjs` de la Task 1; la gramática de la marca, con `de: Wondel <ruta>` para los fragmentos de wondelai.
- Produce: nada que usen las tasks siguientes.

**Ficheros**: `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/references/{architecture,code,spec}-reviewer-prompt.md`, `upstream.json`.

- [ ] **Step 1: Anotar** — `SKILL.md` contra `verification-before-completion/SKILL.md` v7.0.0, con los bloques de `requesting-code-review/SKILL.md` como `de: superpowers skills/requesting-code-review/SKILL.md`. Los tres `*-reviewer-prompt.md` contra `requesting-code-review/code-reviewer.md` v7.0.0, con las tablas de wondelai en bloques `de: Wondel plugins/wondelai-skills/skills/<skill>/SKILL.md` según el `from` de su entrada. Un rojo dentro de un bloque lleva `arregla: 0307`.
- [ ] **Step 2: Registro** — quitar `pending` de las cuatro entradas; `moon run kit:notices kit:build`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 3 — El renombrado en `kit:copies-update`, y `sdd-agent-writing` anotada en su versión de hoy

**Tras**: Task 2
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/kit/copies.slow.test.ts`, escritos antes de tocar `update.ts` y sin commitear.
**Superficies**: tooling · docs (skills).
**Verificación**: `moon run cli:typecheck cli:test` → `Tests  <n> passed (<n>)`; en `cli/`, `pnpm exec vitest run test/kit/copies.slow.test.ts --test-timeout 120000` → `Tests  <n> passed (<n>)`; `moon run kit:copies` → sin rojos en `skills/sdd-agent-writing/` salvo los que lleven fila.

**Interfaces**:
- Consume: `planEntry`, `updateSource` y `showAt` de `tests/copies/update.ts` y `tests/upstream/clones.ts`; `newClone`, `newRepo` y `runUpdate` de `copies.slow.test.ts`.
- Produce: `renamedPath(clone: string, older: string, newer: string, path: string): Promise<string | null>` en `tests/copies/update.ts`; la línea `<kit>: su original <ruta> pasa a <ruta nueva> en <tag>`.

**Ficheros**: `tests/copies/update.ts`, `cli/test/kit/copies.slow.test.ts`, `skills/sdd-agent-writing/SKILL.md`, `skills/sdd-agent-writing/references/{skill-mechanics,skill-testing}.md`, `upstream.json`.

- [ ] **Step 1: RED** — en `copies.slow.test.ts`, dentro de `describe('kit:copies-update …')`:
  - `it('follows an original that the source renames')`: un clon con `skills/a/SKILL.md` en v1.0.0 y `skills/a/references/SKILL.md`, con una línea cambiada, en v1.1.0 (un `git mv` más un cambio). `runUpdate(registry, …, 'Juguete', 'v1.1.0')` da `output` con `'skills/sdd-a/SKILL.md: su original skills/a/SKILL.md pasa a skills/a/references/SKILL.md en v1.1.0'` y `'skills/sdd-a/SKILL.md: v1.0.0 → v1.1.0, 0 conflictos'`. El registro queda con `paths: ['skills/a/references/SKILL.md']` y `version: 'v1.1.0'`, y la copia lleva la línea cambiada.
  - `it("treats a rewrite below git's rename threshold as missing")`: el mismo movimiento con el texto reescrito entero da `'skills/sdd-a/SKILL.md: su original skills/a/SKILL.md no existe en v1.1.0: mapéalo antes de actualizar'`, y el registro no cambia.

  Corren y fallan.
- [ ] **Step 2: GREEN** — `renamedPath` y su uso en `planEntry` y `updateSource` (decisión 6 del plan). Los dos tests pasan, y los demás de `copies.slow.test.ts` siguen en verde.
- [ ] **Step 3: Anotar** — `sdd-agent-writing/SKILL.md` contra `writing-for-agents/SKILL.md` de mattpocock v1.3.1. `skill-mechanics.md` contra `writing-skills/SKILL.md` de superpowers v7.0.0, con los bloques de `SKILL-MECHANICS.md` (mattpocock v1.3.1) como `de:`. `skill-testing.md` contra `testing-skills-with-subagents.md` v7.0.0, con `de: superpowers skills/writing-skills/SKILL.md` en las secciones de prueba y `de: superpowers skills/writing-skills/persuasion-principles.md` en los principios de persuasión. A su entrada se le añade `from` `persuasion-principles.md` v7.0.0.
- [ ] **Step 4: Registro** — quitar `pending` de las tres entradas. `sources["mattpocock/skills"].notCopied` pasa a `["skills/productivity/writing-for-agents/agents/openai.yaml"]`, y `sources.superpowers.notCopied` suma `skills/writing-skills/anthropic-best-practices.md`, `skills/writing-skills/examples/CLAUDE_MD_TESTING.md`, `skills/writing-skills/graphviz-conventions.dot` y `skills/writing-skills/render-graphs.js`. Después, `moon run kit:notices kit:build`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación»; `compare-dist.mjs` sobre los tres ficheros → solo la palabra de la versión.
- [ ] **Step 6: Commit de la task**.

### Task 4 — La subida a v7.0.2 y v1.3.2, el reparto de `sdd-agent-writing` y el humo

**Tras**: Task 3
**Modelo**: la sesión (Native); los dos sujetos del humo, `sonnet`, con el lanzador de baterías.
**Tests RED**: ninguno nuevo: lo comprueban `kit:copies`, `kit:upstream` y el humo.
**Superficies**: tooling (registro) · docs (skills, batería).
**Verificación**: `moon run cli:test` → `Tests  <n> passed (<n>)`; `moon run kit:copies` → solo rojos con ` → <fila>` y los `sin anotar → 0296`, `0297`, `0305` y `0306`; `moon run kit:upstream` → solo rojos en las entradas de 0296, 0297, 0305, 0306, 0313 y 0314; el humo, con su veredicto.

**Interfaces**:
- Consume: `kit:copies-update` con el renombrado de la Task 3; las anotaciones de las tasks 1 a 3; `compare-dist.mjs`.
- Produce: el registro final; las cuatro copias nuevas.

**Ficheros**: `upstream.json`, `skills/sdd-agent-writing/references/*.md`, las copias que toque la fusión, `tests/batteries/sdd-agent-writing/battery.md`.

- [ ] **Step 1: Subida** — `moon run kit:copies-update -- superpowers v7.0.2` y `moon run kit:copies-update -- mattpocock/skills v1.3.2`. Su salida va al walkthrough. Esperado: las copias sin cambio de texto, con 0 conflictos; `skill-testing.md`, con su línea «pasa a skills/writing-skills/references/testing-skills-with-subagents.md en v7.0.2»; y `skill-mechanics.md`, con los conflictos de los bloques en las secciones que la 7.0.2 saca.
- [ ] **Step 2: Conflictos y texto nuevo** — resolver cada conflicto con la regla de la decisión 12 de la spec: el texto de la fuente entra; lo que el kit ya sustituye recibe la misma sustitución; cualquier otra contradicción queda como rojo con `arregla` y su fila. No queda ningún marcador de `git merge-file`.
- [ ] **Step 3: Reparto** — lo de la decisión 8 de la spec:
  - crear `references/discovery.md`, `flowcharts.md`, `bulletproofing.md` y `persuasion-principles.md`, anotados contra su original v7.0.2, con los bloques del kit que tenían esas secciones y con la lista de «Entra», «Sigue sustituido» y «Sigue quitado» de la decisión 8;
  - llevar las secciones de prueba de `skill-testing.md` a `skill-mechanics.md`, donde las pone `SKILL.md` v7.0.2, con sus enlaces (`references/x.md` → `x.md`, `references/testing-skills-with-subagents.md` → `skill-testing.md`);
  - quitar de `skill-testing.md` lo que pasa a otros ficheros.

  En `upstream.json`, una entrada `copy` por cada fichero nuevo (superpowers v7.0.2, su ruta en `references/`). Se quitan los `from` de `skill-testing.md`, y `skill-mechanics.md` se queda solo con el de `SKILL-MECHANICS.md`. `sources.superpowers.notCopied` pasa a las rutas de v7.0.2 de la decisión 10 de la spec.
- [ ] **Step 4: Las dos entradas de mattpocock** — `code-review` y `teach`/`wait-what` a `v1.3.2` en `upstream.json` (decisión 9 de la spec). Después, `moon run kit:notices kit:build`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación». `kit:copies` mide el porcentaje de cada fichero de `sdd-agent-writing`; si uno baja del 50 %, parar por desvío. `compare-dist.mjs` sobre `dist/skills/sdd-agent-writing/` → las palabras del kit de hoy siguen en algún fichero, y lo nuevo es texto de la 7.0.2, con su lista al walkthrough.
- [ ] **Step 6: Batería y humo** — la procedencia de `tests/batteries/sdd-agent-writing/battery.md:48-52`, al reparto nuevo. Después, `BATTERY=sdd-agent-writing SCENARIOS="p1 b1"` con `node tests/headless/battery.mjs run`, n = 1, Sonnet, con el `SPEC_DIR` de esta spec, `PHASE=green` y `COST_CAP=4`. El veredicto y la rúbrica (R1, R2 y R6) van al walkthrough. Si falla por el reparto, una tanda de REFACTOR; por encima de ~4 $ o ~40 min, parar.
- [ ] **Step 7: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,6 h (con la review de spec)
- Estimación de implementación: 4 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,6 h
- Base de la estimación: 4 tasks; la anotación de las tasks 1 y 2 es casi mecánica con el borrador (la 0302 midió 9 de 15 copias limpias). La Task 4 es la incierta, por la fusión de `skill-mechanics.md`. Referencia: la 0302, 2,05 h reales frente a 3 h estimadas, con código nuevo.
- Confianza: media.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): `kit:copies`, `kit:upstream` y `upstream.json` en v7.0.2, con su salida en el walkthrough.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`).

---

## 4. Self-review (cobertura spec → tasks)

- ADDED THEN: `skills/sdd-tdd/SKILL.md:10: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»` → Task 1, `every skill text is free of source versions` (caso `skills/a`). ✓
- ADDED AND: la clave o el `repo`, «`wondelai/skills` 1.8.0» → Task 1, el mismo test (caso `skills/b`). ✓
- ADDED AND: `migrations/`, `NOTICE` y marcas no cuentan → Task 1, el mismo test (casos `skills/c` y `migrations/v2.0.0.md`). ✓
- MODIFIED THEN, y sus AND de B4/B5, del conflicto sin resolver, del `merge-file` que falla y de `pending` → sin cambio: los tests de la 0302 en `copies.test.ts` y `copies.slow.test.ts`, que siguen en verde en la Task 3. ✓
- MODIFIED AND: el renombrado → Task 3, `follows an original that the source renames`; y en real, Task 4, Step 1. ✓
- MODIFIED AND: «no existe… sin renombrar» → Task 3, `treats a rewrite below git's rename threshold as missing`, y `skips a copy whose original moved`, que ya existe. ✓
- Reglas «Dónde viven los datos», «Límites» y «Avisos» → la fusión del delta en el cierre; el límite y el aviso, Task 1, el mismo test. ✓
- Intent: `kit:copies` sobre las seis copias, con cada rojo con su fila → Task 4, Step 5. ✓
- Intent: `upstream.json` en v7.0.2 → Task 4, Step 1, más el registro. ✓
- Intent: `kit:upstream` solo con 0296, 0297, 0305, 0306, 0313 y 0314 → Task 4, «Verificación». ✓
- Decisión 8: ningún texto perdido y nada por debajo del 50 % → Task 4, Step 5 (`kit:copies` y `compare-dist.mjs`). ✓
- Decisión 11: el humo p1 y b1 → Task 4, Step 6. ✓
- Tabla «Lo que se retira o cambia de forma»: las trece versiones → Task 1; «mapéalo» → Task 3; `skill-mechanics`/`skill-testing`, sus enlaces y la batería → Task 4; la ruta de `testing-skills-with-subagents.md` → Task 4, Step 1; `pending: "0312"` → Tasks 1 a 3; la forma de línea → Tasks 1 a 3; mattpocock → Task 4, Step 4. ✓
- Review Focus → Tasks 1, 3 y 4, con sus tests o comprobaciones. ✓
