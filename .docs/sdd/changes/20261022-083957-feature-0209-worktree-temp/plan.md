---
id: 20261022-083957-feature-0209-worktree-temp
feature: 0209
title: Plan de implementación — Temporales por worktree
spec: ./spec.md
status: draft
created: 2026-10-22
---

# Plan de implementación — Temporales por worktree

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las tres tasks; la sonda de la Task 2 con `general-purpose` + `model: haiku` (headless, `claude -p`); los sujetos de la Task 3, Sonnet por `tests/headless/`; revisión final con `sdd-kit:effort-high` + `opus` (Spec) y `sdd-kit:effort-high` + `sonnet` (Código).
2. Ejecución native: tres tasks que no comparten interfaces de código, cada error lo caza el test de su task, y el plan cabe en un contexto.
3. Pester fija su entorno en `tests/Invoke-KitTests.ps1`, no en el `env` de moon: el propio script ya documenta que moon trata `$nombre` en los args como variable de entorno (patch 0183), y el script corre igual desde moon y a mano. Es la caída prevista en la decisión 2 de la spec.
4. La config de Vitest vive en `cli/vitest.config.ts` con un `globalSetup` en `cli/test/temp-setup.ts`; la API de `globalSetup` y de `test.env` se comprueba en los tipos de `node_modules/vitest` (v5) antes de escribirla.
5. La Task 2 empieza por la sonda: si da desvío (decisión 6 de la spec), paro antes de tocar `Start-KitSession.ps1`.
6. Coste: ~4 h de implementación; sujetos ≤ 10 $ (techo de la spec), sonda ~0,03 $.
7. Review Focus: 4 entradas; ver la sección.

**Goal**: que los temporales del repo, de sus sesiones y de sus sujetos vivan en `.temp/` de cada worktree, y que la init y la migración ignoren `.temp/` y apunten los temporales de las suites.

**Architecture**: un sitio (`<raíz>/.temp`) fijado por entorno en los tres lanzadores que ya existen —la config de Vitest, `Invoke-KitTests.ps1` y `Start-KitSession.ps1`— y borrado donde hay dueño: el teardown de Vitest y `run.sh`. En los proyectos, una línea más de `INIT_IGNORES` y texto de skill.

**Tech Stack**: TypeScript sin build y Vitest 5 (`cli/`), Pester 5 en pwsh 7, bash de Git Bash (`tests/headless/`), moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks sin interfaces compartidas, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo ni dependencia ni contrato entre módulos; un fichero de config de Vitest y líneas en lanzadores existentes.

## Restricciones globales

### De código

- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- La carpeta es `.temp/` en la raíz del repo o worktree; la de Vitest, `.temp/vitest-<aleatorio>`; el barrido, más de 24 h; el borrado, 5 reintentos.
- Todo código que llame a git limpia `GIT_DIR` y compañía del entorno del hijo (dentro del pre-commit, git las exporta).

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh`, prohibidos.
- Con una tanda de sujetos en marcha, el hilo no commitea ni corre la suite (tech-stack, «Sujetos headless»).
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia.

## Review Focus

- Un fixture que hace `git init` en una subcarpeta de `tmpdir()` y luego trabaja en ella → sigue funcionando con `GIT_CEILING_DIRECTORIES=<raíz>/.temp` (el techo solo impide subir *a* `.temp`) · Task 1, la suite `cli:test-slow` entera en verde.
- Dos `cli:test` a la vez en el mismo worktree (pre-commit durante un gate) → cada uno borra solo su `vitest-*`; el barrido no toca una carpeta de menos de 24 h · Task 1, `sweeps only run folders older than a day`.
- `run.sh` con una campaña cuyo sujeto murió antes de crear el molde → no borra nada fuera de `RUNS_DIR/<fase>/<etiqueta>` ni falla · Task 2, caso `DRY_RUN=1` «no borra con etiqueta vacía ni fuera de RUNS_DIR».
- La ruta más larga de un fixture de merge (`Fusión ñ <nombre>` + worktrees) bajo `D:\code\.worktrees\sdd-kit\<worktree>\.temp\vitest-xxxxxx\` → cabe sin `Filename too long` · Task 1, `cli:test-slow` en verde y la medida en el walkthrough.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un sitio por entorno en tres lanzadores; ningún test individual cambia.
- [x] **YAGNI gate**: sin helpers nuevos salvo el `globalSetup`; `KEEP_MOLD` lo pide la spec.
- [x] **Brownfield gate**: `INIT_IGNORES` solo gana una línea; `mergeGitignore` no cambia.
- [x] **Constitution check**: Art. I (Task 3 con su batería), Art. V (v3.0.0 sin publicar), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/vitest.config.ts` — `globalSetup` y nada más.
- `cli/test/temp-setup.ts` — crea `.temp/vitest-<aleatorio>`, fija `TEMP`, `TMP` y `GIT_CEILING_DIRECTORIES`, barre las de más de 24 h y devuelve el teardown que borra la suya.
- `cli/test/temp-dir.test.ts` — el contrato de la carpeta por ejecución.
- `tests/TempDir.Tests.ps1` — el contrato del entorno de Pester.

**Modificar**:

- `.gitignore` — `.temp/`.
- `tests/Invoke-KitTests.ps1` — `TEMP`, `TMP` y `GIT_CEILING_DIRECTORIES` en `<raíz>/.temp`.
- `tests/headless/run.sh`, `tests/headless/lib.sh` — guarda de `RUNS_DIR` y borrado por sujeto con sus guardas.
- `tests/HeadlessLauncher.Tests.ps1` — casos `DRY_RUN=1` de la guarda y del borrado.
- `Start-KitSession.ps1` — `CLAUDE_CODE_TMPDIR`.
- `cli/src/init/gitignore.ts` y `cli/test/init/` — `.temp/` en `INIT_IGNORES`.
- `skills/sdd-init/SKILL.md` (fila «How it is tested»), `skills/sdd-init/references/structure.md`, `skills/sdd-templates/templates/operations-template.md` (campo «Temporales»), `skills/sdd-upgrade/references/migrations/v3.0.0.md` (paso de `.gitignore` y «Temporales»).
- `tests/batteries/sdd-init/battery.md` (fila T3) y `tests/batteries/sdd-upgrade/` (escenario sin E2E y rúbrica).
- `tests/WordBudget.Tests.ps1` — topes de la spec.
- `.docs/sdd/tech-stack.md` — líneas 52, 65 y 132.

**NO se tocan**:

- Los 25 `mkdtemp(tmpdir())` de `cli/test/` y los `.Tests.ps1` — el entorno los lleva a `.temp/`.
- `cli/src/merge/verify.ts` — decisión 3 de la spec.
- `cli/moon.yml`, `moon.yml` — el entorno lo fijan la config de Vitest y `Invoke-KitTests.ps1`.

### 1.6 Dependencias

Ninguna nueva. La regla del nombre de la carpeta de Claude Code la mide la sonda de la Task 2.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Rutas largas en los fixtures de merge | media | gate rojo | medir en la Task 1; si rompe, la carpeta por ejecución pasa a `.temp/v-<6>` |
| Los workers de Vitest no heredan el entorno del `globalSetup` | baja | fixtures en `%TEMP%` | `temp-dir.test.ts` lo detecta; caída a `env` de `cli/moon.yml` (decisión 1 de la spec) |
| El sujeto en `.temp/` ve el repo del kit | media | campañas contaminadas | sonda antes de tocar `Start-KitSession.ps1`; desvío si sale |

### 1.8 Rollout

Directo; el prompt de `Select-Claude` al cerrar.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Los tests del repo en `.temp/`

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/temp-dir.test.ts`, `tests/TempDir.Tests.ps1`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test kit:test-fast` → `Tests  N passed (N)` en Vitest y `Failed: 0` en Pester; cuenta de `sdd-*` en `%TEMP%` y de `vitest-*` en `.temp/` antes y después igual a cero nuevas.
**Verificación lenta**: `moon run cli:test-slow cli:test-min` · ~15 min, en segundo plano.

**Interfaces**:
- Consume: nada.
- Produce: `.temp/` en `.gitignore`; `TEMP`/`TMP`/`GIT_CEILING_DIRECTORIES` fijados en Vitest y en Pester.

**Ficheros**: crear `cli/vitest.config.ts`, `cli/test/temp-setup.ts`, `cli/test/temp-dir.test.ts`, `tests/TempDir.Tests.ps1`; modificar `.gitignore`, `tests/Invoke-KitTests.ps1`, `.docs/sdd/tech-stack.md:65`.

- [ ] **Step 1: RED** — `temp-dir.test.ts`:
  - `'tmpdir lives in the run folder under .temp'`: `expect(resolve(tmpdir()).replaceAll('\\','/')).toMatch(/\/\.temp\/vitest-[^/]+$/)`.
  - `'git does not climb into .temp'`: `process.env.GIT_CEILING_DIRECTORIES` termina en `/.temp`; `spawnSync('git', ['rev-parse','--show-toplevel'], { cwd: mkdtempSync(join(tmpdir(),'ceil-')), env: <sin GIT_DIR y compañía> }).status` distinto de 0.
  - `'sweeps only run folders older than a day'`: con `sweepRunFolders(root, now)` exportada de `temp-setup.ts`, una carpeta con `mtime` de hace 25 h se borra y otra de hace 1 h se queda.
  `TempDir.Tests.ps1`: `$env:TEMP` cuelga de `<raíz>/.temp`; `git -C $TestDrive rev-parse` sale distinto de 0. Ver los dos en rojo.
- [ ] **Step 2: Implementación** — `temp-setup.ts`: `export default function setup(): () => void` (crea con `mkdtempSync(join(root,'.temp','vitest-'))`, fija las tres variables en `process.env`, llama a `sweepRunFolders`, devuelve el teardown con `rmSync(dir, { recursive: true, force: true, maxRetries: 5 })` en `try`/`catch` que avisa por `console.warn`); `export function sweepRunFolders(tempRoot: string, now: number): void` (borra `vitest-*` con `mtimeMs < now - 24 h`). `root` sale de `import.meta.dirname` (dos niveles arriba de `cli/test/`). `vitest.config.ts`: `test.globalSetup: ['./test/temp-setup.ts']`; si los workers no heredan `process.env` del setup, `test.env` con los mismos valores (comprobado en los tipos de vitest v5). `Invoke-KitTests.ps1`: antes de `Invoke-Pester`, `$temp = Join-Path (Split-Path $PSScriptRoot) '.temp'`, `New-Item -ItemType Directory -Force`, y `$env:TEMP`, `$env:TMP`, `$env:GIT_CEILING_DIRECTORIES` a esa ruta. `.gitignore`: `.temp/`. `tech-stack.md:65`: la carpeta temporal está siempre dentro del repo (`.temp/`), y la config de Vitest e `Invoke-KitTests.ps1` fijan el techo.
- [ ] **Step 3: Verificación** — la de arriba, y la ruta más larga de un fixture de `test/merge/` anotada para el walkthrough.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Sesiones y sujetos headless en `.temp/`

**Tras**: —
**Modelo**: la sesión (Native); la sonda, `claude -p --model haiku` por `lib.sh`.
**Tests RED**: hilo principal · casos nuevos en `tests/HeadlessLauncher.Tests.ps1`.
**Superficies**: tooling.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/HeadlessLauncher.Tests.ps1 -CI"` → `Failed: 0`.

**Interfaces**:
- Consume: `.temp/` en `.gitignore` (Task 1).
- Produce: `CLAUDE_CODE_TMPDIR` fijado por `Start-KitSession.ps1`; `KEEP_MOLD`; mensaje `RUNS_DIR fuera del scratchpad o de .temp/: <ruta>`.

**Ficheros**: modificar `tests/headless/run.sh`, `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`, `Start-KitSession.ps1`, `.docs/sdd/tech-stack.md:52,132`.

- [ ] **Step 1: Sonda** — un `subject.sh` en `.temp/probe/` sobre `lib.sh`, con `CLAUDE_CODE_TMPDIR=<raíz>/.temp` exportado, `RUNS_DIR=<raíz>/.temp/probe/runs` (la guarda del Step 3 se aplica antes, o la sonda va con la guarda ya cambiada), `MODEL=haiku`, `MAX_TURNS=3`, `SUPERPOWERS_DIR`, petición: «Lista, sin herramientas, los ficheros CLAUDE.md, las memorias y las skills que tienes cargados». Desvío si el stream nombra el `CLAUDE.md` del kit, trae el `hook_response` de `SessionStart` del repo, o lista skills que no son de la copia del kit ni de superpowers. Medir qué carpeta crea Claude Code en `<raíz>/.temp/claude/` para el `cwd` del molde: esa es la regla del nombre. Borrar `.temp/probe/` y esa carpeta al acabar.
- [ ] **Step 2: RED** — casos `DRY_RUN=1`: `'acepta RUNS_DIR bajo .temp/ del repo'`; `'aborta con RUNS_DIR fuera del scratchpad y de .temp/'` con `fuera del scratchpad o de .temp/`; `'borra el molde y conserva jsonl, err y args'`; `'con KEEP_MOLD=1 conserva el molde'`; `'borra la carpeta de Claude del sujeto y no la del resto'` (dos carpetas plantadas en `<CLAUDE_CODE_TMPDIR>/claude/`, una con el nombre medido en el Step 1); `'no borra con etiqueta vacía ni fuera de RUNS_DIR'`. Ver en rojo los nuevos.
- [ ] **Step 3: Implementación** — `lib.sh`: guarda `case "$RUNS" in *scratchpad*|"$REPO_ROOT"/.temp/*) ;; *) die "RUNS_DIR fuera del scratchpad o de .temp/: $RUNS"`; `subject_cleanup` (una función: comprueba `LABEL` no vacío y que `$RUN` empieza por `$RUNS/`, borra `$RUN` salvo `KEEP_MOLD=1`, calcula la carpeta de Claude con la regla medida sobre `cygpath -w "$R"`, la borra solo si es hija directa de `<base>/claude/` con nombre no vacío y distinto del de la sesión del hilo; si una guarda falla, avisa y sigue). `run.sh`: misma guarda y `subject_cleanup` tras cada sujeto. Comentario de cabecera de los dos con la variable `KEEP_MOLD`. `Start-KitSession.ps1`: guarda el valor previo de `CLAUDE_CODE_TMPDIR`, lo fija a `Join-Path $PSScriptRoot '.temp'` y lo restaura en el `finally`, como `SDD_KIT_SESSION_ROOT`. `tech-stack.md:52` y `:132`: se quedan los streams, el molde se borra salvo `KEEP_MOLD=1`; la guarda acepta el scratchpad o `.temp/`.
- [ ] **Step 4: Verificación** — la de arriba.
- [ ] **Step 5: Commit de la task**.

### Task 3 — La init y la migración ignoran `.temp/` y apuntan los temporales

**Tras**: —
**Modelo**: la sesión (Native); sujetos Sonnet por `tests/headless/` (batería).
**Tests RED**: hilo principal · el test de `--finish` de `cli/test/init/` con `.temp/`; RED de sujetos: `n6` ×2 de `sdd-init` y v3 con Playwright ×1 y sin E2E ×1 de `sdd-upgrade`, con la skill vigente.
**Superficies**: tooling, docs (skills).
**Verificación**: `moon run cli:test kit:test-fast` → verdes; batería: T3 2/2 en `n6`, `n3` sin regresión (T1, T2), v3 2/2 con Playwright y 2/2 sin E2E.
**Verificación lenta**: la tanda de sujetos · ~60 min, en segundo plano, tandas de ≤ 5.

**Interfaces**:
- Consume: nada.
- Produce: `INIT_IGNORES` con `.temp/`; campo «Temporales» en `operations-template.md`.

**Ficheros**: modificar `cli/src/init/gitignore.ts`, `cli/test/init/` (el test de `--finish`), `skills/sdd-init/SKILL.md`, `skills/sdd-init/references/structure.md`, `skills/sdd-templates/templates/operations-template.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/batteries/sdd-init/battery.md`, `tests/batteries/sdd-upgrade/` (battery y molde sin E2E), `tests/WordBudget.Tests.ps1`; evidencia `tests/temp-dir-red.md` y `tests/temp-dir-green.md`.

- [ ] **Step 1: RED** — CLI: el test de `--finish` exige `.temp/` en `.gitignore` (con CRLF) y la idempotencia; rojo. Sujetos: previsión declarada (spec, decisión 11), RED con el kit de la rama base; criterio: T3 falla si «Temporales» no existe o propone sin leer la config, y en v3 si `.gitignore` no gana `.temp/` o el proyecto sin E2E no lleva `unit · no declarado`.
- [ ] **Step 2: Implementación** — `INIT_IGNORES` gana `'.temp/'` (tras `.docs/sdd/sdd-kit.local.json`). `operations-template.md` §Testing, tras «Motor de producción»: `- **Temporales**: <dónde deja hoy cada suite sus temporales y, si no es `.temp/`, la propuesta para llevarlos ahí, leída de su config, p. ej. `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`; si la config no lo dice, `no declarado`, sin propuesta>`. `sdd-init/SKILL.md`, fila «How it is tested», columna «With code»: «Temporales: where each suite writes them today, read from its config, and the proposal to move them to `.temp/`; unread, `no declarado`; never edit the suite's config». `structure.md:10`: `.temp/` en la lista. `v3.0.0.md`: paso «`.temp/` en `.gitignore`» con la forma del paso de v2.0.0 (si falta, sin duplicar, crea el fichero), y en la fila «Testing» «Temporales» como en la init; en `**Escribe**:` `.gitignore`. Topes de `WordBudget.Tests.ps1` con los valores de la spec.
- [ ] **Step 3: GREEN** — la tanda de la Verificación; REFACTOR como máximo una vuelta de 4 sujetos dentro del techo (16, 10 $).
- [ ] **Step 4: Verificación** — la de arriba, y la fila T3 añadida a la rúbrica de `battery.md`.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2h
- Estimación de implementación: 4h
- Base de la estimación: 3 tasks; Task 1 y 2 de lanzadores con tests existentes, Task 3 con campaña de sujetos (~16 sujetos, como la 0207 con 21); incertidumbre en la sonda y en las rutas largas; infra/tooling del estimation-log, mediana 0,4.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent): cuenta de `sdd-*` y `vitest-*` tras el gate; molde y carpeta de Claude de un sujeto borrados
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- cli · `.gitignore` gana `.temp/` con CRLF e idempotente → Task 3, test de `--finish`. ✓
- onboarding · `.gitignore` con `.temp/` una vez → Task 3, mismo test. ✓
- onboarding · `## Testing` pide dónde deja cada suite sus temporales → Task 3, `n6` (T3) y `operations-template.md` leído por `docs-claims`/`ClosingVerification` si lo cubren; si no, la batería. ✓
- onboarding · «Temporales» propone `outputDir` sin editar config ni añadir filas → Task 3, `n6` ×2 (T3: config sin cambios en el diff del sujeto). ✓
- onboarding · suite sin sitio legible → `no declarado` → Task 3, `n3` (vitest sin carpeta) y v3 sin E2E. ✓
- onboarding · regla «Dónde viven los datos» → Task 3, la fusión del cierre. ✓
- migration · `## Testing` pasa tal cual salvo «Temporales» sin E2E → Task 3, v3 sin E2E ×2. ✓
- migration · `.gitignore` gana `.temp/` una vez → Task 3, v3 ×2. ✓
- migration · «Temporales» con Playwright → Task 3, v3 con Playwright ×2. ✓
- migration · `.temp/` ya estaba → sin observar por sujeto: el molde lleva `.gitignore` sin `.temp/`; el paso copia la forma idempotente de v2.0.0 (avisado en las decisiones). ⚠
- migration · «no» del dev-lead → sin observar por sujeto: los sujetos headless no pueden contestar «no» a mitad sin persona; la persona de `subject_converse` lo cubriría con coste extra, no previsto. ⚠
- migration · sin dev-lead, nada cambia → sin observar: es la regla general de la v3.0.0 («Sin el dev-lead… no mueve nada»), ya medida. ⚠
- Retirada «copias por run» → Task 2, `'borra el molde y conserva jsonl, err y args'`. ✓
- Retirada «aborta si RUNS_DIR no está en el scratchpad» → Task 2, los dos casos de la guarda. ✓
- Retirada «carpeta temporal dentro de un repo» → Task 1, `'git does not climb into .temp'`. ✓
- Intent · cero `sdd-*` nuevas y cero `vitest-*` → Task 1 Verificación y §3. ✓
- Intent · sujetos sin molde ni carpeta de Claude en `C:` → Task 2, casos de borrado; en campo, la siguiente campaña. ✓
- Intent · `git worktree remove` sin `--force` → probado al especificar (spec, Approach). ✓
- Review Focus (4) → Task 1 y Task 2, los tests nombrados. ✓
