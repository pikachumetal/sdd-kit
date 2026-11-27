---
id: 20261127-120333-feature-0374-estimation-report
feature: 0374
title: Plan de implementación — sdd estimation report
spec: ./spec.md
status: approved
created: 2026-11-27
---

# Plan de implementación — sdd estimation report

## Decisiones que he tomado yo — valida estas

1. Modelo: Native, la sesión implementa las tres tasks; revisión final con los ejes de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`). Sujetos de la batería de `sdd-retro` en Sonnet, por tandas — la política de modelos aprobada en la spec.
2. Ejecución: native — ver la línea `Ejecución`.
3. La atribución va en un módulo propio, `authors.ts`, con su propio `git log --diff-filter=AM`: `addedCommits` de `releases.ts` usa `--diff-filter=A` para decidir la release y no se toca, porque su semántica (el commit que añadió) es otra.
4. La versión marcada se lee con `git cat-file --batch` alimentado por stdin con `execFileSync(..., { input })`, en `authors.ts`: `gitSync` no admite stdin, y un proceso por commit serían cientos en un proyecto real.
5. `--release v3.1.0` vale como `3.1.0` (Review Focus): la spec calla y quien escribe la versión del tag la escribiría así.
6. Gate de cierre literal de `operations.md` §Testing.
7. Coste: ~2,5 h de implementación; batería ~1,3 $ (7 sujetos Sonnet, de la spec).
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `sdd estimation report` saca, desde los artefactos de cierre y el historial de git, las tablas por persona, carril, versión marcada del kit y fase × persona, filtrables por release, y `sdd-retro` pega su salida.

**Architecture**: `report.ts` lee las filas con `readRows` (las mismas que el log), les añade persona y versión desde `authors.ts` (un `git log` y un `git cat-file --batch`), filtra por release con `releaseLabel` de `releases.ts` y lee las fases con la función de `phases.ts` que ya usa «Tiempos por fase». Solo exporta piezas existentes: la salida de `estimation log` no cambia.

**Tech Stack**: TypeScript en Node 22.18 sin dependencias, Vitest, git por `child_process`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks en serie (la 2 amplía la interfaz de filas de la 1 y la 3 usa la salida del verbo), un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulos nuevos `report.ts` y `authors.ts` en `cli/src/estimation/`, que consumen exportaciones nuevas de `phases.ts` y `releases.ts`.

## Restricciones globales

### De código

- La salida de `sdd estimation log` no cambia: `cli/test/estimation/*` y `releases.slow.test.ts` siguen en verde sin editarlos.
- `cli/package.json` sin `dependencies`; Node 22.18.0 o posterior.
- Números con `formatNumber` de `numbers.ts` (hasta dos decimales, sin ceros finales, punto decimal); celdas vacías con `MISSING` de `text.ts` (`—`).
- Literales de la spec, exactos: `sin atribuir`, `sin marcador`, `Sin cierres.`, `Sin cierres en la <X.Y.Z>.`, `Sin datos: ninguna tarea tiene timing.json.`, `* n < 5: mediana orientativa.`, `Sin historial de git en <ruta>: persona y versión salen sin atribuir y sin marcador.`, `Fuera de toda release: <n> cierres sin publicar o sin fecha; no cuentan en la <X.Y.Z>.`, `La versión <X.Y.Z> no está con fecha en el changelog (<ruta>): nada que informar.`, `Sin changelog en <ruta>: --release necesita las versiones del changelog.`
- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano (mensajes, avisos, ayuda) en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral superado en una unidad, que es Minor.

### De proceso

- Native: la sesión implementa; TDD del propio hilo (`sdd-tdd`).
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `fable` y `opus xhigh` prohibidos.

## Review Focus

- Un autor con tilde y espacio (`Ana Pérez`) → sale tal cual en la celda y ordena con `localeCompare` · Task 2, `keeps accented author names`
- Una carpeta con `walkthrough.md` y `patch.md` → la persona sale del fichero que dio la fila (el walkthrough primero, como `readRows`) · Task 2, `attributes the file that produced the row`
- `--release v3.1.0` → igual que `--release 3.1.0` · Task 2, `accepts a leading v in --release`
- Salida de `git cat-file --batch` con `\r\n` o un objeto `missing` → `sin marcador`, sin romper el resto · Task 2, `missing marker in a commit is sin marcador`
- Proyecto con `docs/sdd/` en vez de `.docs/sdd/` → el informe lee la misma carpeta que el log (`resolveDocsPath`) · Task 1, `reads the same docs folder as the log`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un módulo por responsabilidad (tablas, git); se reutilizan `readRows`, `releaseLabel`, la lectura de `timing.json`.
- [x] **YAGNI gate**: sin opciones más allá de `--root`, `--project-root` y `--release`.
- [x] **Brownfield gate**: la salida del log no cambia; solo se exportan funciones.
- [x] **Constitution check**: Art. I (batería de `sdd-retro`), Art. X, Art. XI (el informe no es documento).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/estimation/report.ts` — agrega filas en las cuatro tablas y compone la salida Markdown.
- `cli/src/estimation/authors.ts` — persona y versión marcada de cada cierre desde git.
- `cli/test/estimation/report.test.ts` — tablas, formato, n < 5, sin cierres, fases (sin git).
- `cli/test/estimation/report.slow.test.ts` — atribución, migración, versión, `--release` (repo git temporal).

**Modificar**:

- `cli/src/estimation/verbs.ts` — `estimationReportVerb`.
- `cli/src/cli/verbs.ts` — registra el verbo tras `estimationLogVerb`.
- `cli/src/estimation/phases.ts` — exporta `readTiming` y `PhaseRecord`.
- `cli/src/estimation/releases.ts` — exporta `releaseVersions`, `addedCommits`, `releaseLabel`, `UNPUBLISHED`, `UNDATED`.
- `cli/src/estimation/log.ts` — exporta `resolveDocsPath`.
- `cli/test/cli.test.ts` — `--help` lista `estimation report`; `--project-root` alias.
- `skills/sdd-retro/SKILL.md` — paso 4.
- `skills/sdd-templates/templates/retro-template.md` — sección «Estimación y action items».
- `tests/batteries/sdd-retro/battery.md` y `subject.mjs` — escenario `r7`, molde `corte-estimacion`, fila `R10`.

**NO se tocan**:

- `estimation-log.md` y `formatLog` — fuera de alcance.
- `skills/sdd-templates/SKILL.md` — decisión 21 de la spec.

### 1.6 Dependencias

- Binario `git` en el `PATH` (ya lo usa `releases.ts`); sin él, el informe sale sin atribuir.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `cat-file` con `<sha>:./ruta` no resuelve relativo al cwd en `--batch` | media | todo `sin marcador` | el slow test lo fija; si falla, se pasa la ruta relativa a la raíz con `git rev-parse --show-prefix` |
| El RED de `r7` pega igual la tabla a mano y pasa | baja | RED sin fallo | R10 exige el literal de la cabecera `| Persona | n | Real (h) | Ratio | Real > est |`, que solo da el verbo |

### 1.8 Rollout

Directo: entra en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Tablas del informe y el verbo, sin git

**Tras**: —
**Modelo**: Native, la sesión.
**Tests RED**: hilo principal · `cli/test/estimation/report.test.ts`, `cli/test/cli.test.ts`
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/estimation test/cli.test.ts` → `Tests  N passed (N)` (en Git Bash, `pnpm exec vitest run …`)
**Se prueba en la aplicación**: `node cli/bin/sdd.js estimation report --root <fixture>` imprime las cuatro tablas.

**Interfaces**:
- Consume: `readRows(specsPath, warn): Row[]` (`artifacts.ts`), `changeFolders(docsPath): string[]` (`cli/layout.ts`), `formatNumber`, `median` (`numbers.ts`), `MISSING`, `PHASE_NAMES`.
- Produce:
  - `phases.ts`: `export type PhaseRecord`; `export function readTiming(root: string, folder: string, warn: Warn): PhaseRecord[] | null` (la de hoy, exportada).
  - `log.ts`: `export function resolveDocsPath(root: string): string`.
  - `report.ts`: `export interface ReportRow extends Row { person: string; kitVersion: string; root: string }` (`root`: la carpeta `changes/` o `specs/` de la fila); `export interface Attribution { person: string; kitVersion: string }`; `export interface ReportSource { row: Row; root: string }`; `export function buildReport(root: string, options: ReportOptions, warn: Warn): string` con `ReportOptions = { release: string | null; attribute: (docsPath: string, sources: ReportSource[], warn: Warn) => Attribution[] }` (un `Attribution` por fuente, en el mismo orden) — en esta task, `attribute` por defecto devuelve `sin atribuir` / `sin marcador` para todas.
  - `verbs.ts`: `estimationReportVerb` (`noun: 'estimation'`, `verb: 'report'`, `summary: 'Saca el tiempo del proyecto por persona, carril, versión del kit y fase'`, opciones `root`, `project-root`, `release`), stdout = `buildReport(...)`, código 0.

**Ficheros**: crear `report.ts`, `report.test.ts`; modificar `phases.ts`, `log.ts`, `verbs.ts` (los dos), `cli.test.ts`.

- [ ] **Step 1: RED** — en `report.test.ts`, con `project()` y `walkthrough()` de `helpers.ts` (sin git: `project()` crea en `tmpdir`):
  - `groups by lane with medians, ratio and over-estimate count`: dos `feature` (est 1 h / real 1 h; est 2 h / real 3 h) y un `patch.md` con `## 5. Tiempo` (`- Estimación: 0,5 h (post hoc)`, `- Real: 1 h`) → la salida contiene `| Carril | n | Real (h) | Ratio | Real > est |`, `| feature | 2 * | 2 | 1.25 | 1 |`, `| patch | 1 * | 1 | — | 0 |`, `* n < 5: mediana orientativa.`; `| sin atribuir | 3 * |` en `| Persona | …` y `| sin marcador | 3 * |` en `| Versión marcada del kit | …`.
  - `five closings drop the asterisk and the note`: cinco `feature` (reales 1, 3, 1, 1, 1; estimados 1, 2, 1, 1, 1) → `| feature | 5 | 1 | 1 | 1 |` y ninguna línea `* n < 5` en la tabla de carril.
  - `phases by person`: dos cierres con `timing.json` (versión 1, `measured: true`, `withinMargin: true`, `clockSeconds`/`totals` coherentes): `implementacion` 1800+1800 `estimateHours` 0.5 y `revision` `measured: false`; `implementacion` 3600+1800 `estimateHours` 1 y `apertura` 600+0 sin estimado; un tercero `withinMargin: false`; un cuarto sin `timing.json` → `| Fase | Persona | n | Real (h) | Ratio |`, `| apertura | sin atribuir | 1 * | 0.17 | — |` antes de `| implementación | sin atribuir | 2 * | 1.25 | 1.75 |`, sin `| revisión |`; aviso `timing.json fuera del margen, fuera de la tabla de fases: <carpeta>.`; `| sin atribuir | 4 * |` en persona.
  - `no closings`: solo `steering/estimation.md` → cada tabla es `Sin cierres.`; sin `timing.json`, `Sin datos: ninguna tarea tiene timing.json.`
  - `reads the same docs folder as the log`: el fixture con `docs/sdd/specs/...` da la misma n que `estimation log`.
  - En `cli.test.ts`: `--help` contiene `estimation report`; `project-root is an alias of --root in estimation report` (misma salida que `--root`); `--root` + `--project-root` → código 2 y `--root y --project-root no van juntas`.
- [ ] **Step 2: Implementación** — exportar `readTiming`, `PhaseRecord`, `resolveDocsPath`; en `report.ts`, `buildReport` y una función por tabla (`groupTable(title: string, rows: ReportRow[], key: (row) => string): string[]`, `phaseTable(rows, warn): string[]`); orden por `localeCompare`, `sin atribuir`/`sin marcador` al final; la tabla de versión por SemVer (ordenación numérica por componente). `Real > est` cuenta `ratio > 1`. Fases: mediana de `agentSeconds + execSeconds` / 3600 por (fase, persona) y mediana de ese real / `estimateHours` solo donde `estimateHours > 0`. Registrar el verbo.
- [ ] **Step 3: Build** — desde `cli/`, `npx tsc --noEmit -p .` → sin errores.
- [ ] **Step 4: Verificación** — el comando de «Verificación»: todo verde, `test/estimation/*` sin editar.
- [ ] **Step 5: Commit** — `feat(cli): sdd estimation report agrega por persona, carril, versión y fase`.

### Task 2 — Persona y versión desde git, y `--release`

**Tras**: Task 1
**Modelo**: Native, la sesión.
**Tests RED**: hilo principal · `cli/test/estimation/report.slow.test.ts`
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/estimation --test-timeout 120000` → `Tests  N passed (N)`
**Se prueba en la aplicación**: `node cli/bin/sdd.js estimation report --root .` en este repo atribuye los cierres a sus autores.

**Interfaces**:
- Consume: `buildReport`, `ReportOptions`, `Attribution` (Task 1); `gitSync` (`git/git.ts`); `releaseVersions(docsPath): Version[]`, `releaseLabel(row, versions, added): string`, `addedCommits(docsPath): Map<string, string>`, `UNPUBLISHED`, `UNDATED` (exportados aquí de `releases.ts`, sin cambiar su cuerpo).
- Produce: `authors.ts`: `export const MIGRATION_SUBJECT = 'chore(sdd): migrar al kit'`; `export function closingCommits(docsPath: string): Map<string, { sha: string; author: string | null }> | null` (clave `<carpeta>/<fichero>`, valor del commit más antiguo de `git log --no-renames --diff-filter=AM --format=%x00%H%x09%aN%x09%s --name-only -- changes specs`; `author: null` si su asunto empieza por `MIGRATION_SUBJECT`; `null` sin git); `export function markedVersions(docsPath: string, shas: string[]): Map<string, string>` (un `git cat-file --batch` con `<sha>:./sdd-kit.json` desde `docsPath`; `JSON.parse(...).version` o ausente). `attributeRows` que `verbs.ts` pasa como `attribute`.

**Ficheros**: crear `authors.ts`, `report.slow.test.ts`; modificar `releases.ts` (solo `export`), `report.ts`, `estimation/verbs.ts`.

- [ ] **Step 1: RED** — en `report.slow.test.ts`, con el `git()` de `releases.slow.test.ts` pero con autor por commit (`-c user.name=<autor>`):
  - `attributes 2.x closings to their writers, not to the migrator`: Ana añade `specs/20260910-100000-feature-0010-a/walkthrough.md` con `sdd-kit.json` `{"version":"2.3.4"}`; Luis, `specs/20260912-100000-patch-0011-b/patch.md`; Pepe hace `git mv specs changes`, añade `changes/20260915-100000-feature-0012-c/walkthrough.md`, sube el marcador a `3.0.1` y commitea `chore(sdd): migrar al kit v3.0.1`; Luis edita el walkthrough de `0010` → en `| Persona |`: `| Ana | 1 * |`, `| Luis | 1 * |`, `| sin atribuir | 1 * |` (la última), sin `Pepe`.
  - `marks the kit version of the attributing commit`: sobre el anterior, Ana añade `changes/20261110-100000-feature-0020-d/walkthrough.md` → `| 2.3.4 | 2 * |`, `| 3.0.1 | 1 * |`, `| sin marcador | 1 * |`, en ese orden.
  - `sorts kit versions by SemVer`: marcadores `3.9.0` y `3.10.0` → `3.9.0` antes.
  - `--release keeps only that release's closings`: `CHANGELOG.md` en la raíz con `## [3.1.0] - 2026-11-20` y `## [3.0.5] - 2026-11-18`; `0030` (`created: 2026-11-17`) y tag `v3.0.5`; `0031` (`created: 2026-11-19`); `0032` (`created: 2026-11-22`) → con `release: '3.1.0'`, la tabla de carril da n `1 *` y el aviso es `Fuera de toda release: 1 cierres sin publicar o sin fecha; no cuentan en la 3.1.0.`; con `'3.0.5'`, n `1 *`; sin release, n `3 *`.
  - `unknown release and missing changelog fail`: por el verbo (`run([...])`), `--release 9.9.9` → código 1 y `La versión 9.9.9 no está con fecha en el changelog (`; sin changelog → código 1 y `Sin changelog en `.
  - `release without closings`: `## [3.2.0] - 2026-12-01` sin cierres nuevos → `Sin cierres en la 3.2.0.`
  - `no git warns once`: proyecto fuera de repo → un solo aviso `Sin historial de git en`.
  - Review Focus: `keeps accented author names` (`Ana Pérez`), `attributes the file that produced the row`, `accepts a leading v in --release`, `missing marker in a commit is sin marcador`.
- [ ] **Step 2: Implementación** — `authors.ts` según «Produce»; en `report.ts`, el filtro: `releaseLabel(row, releaseVersions(docsPath), addedCommits(docsPath)) === release` (sin la `v` inicial), error con los literales si no hay changelog o la versión no está, aviso si hay filas en `UNPUBLISHED`/`UNDATED`; `estimationReportVerb` pasa `attributeRows` y traduce el error a código 1 (`DomainError`).
- [ ] **Step 3: Build** — `npx tsc --noEmit -p .` → sin errores.
- [ ] **Step 4: Verificación** — el comando de «Verificación»; `releases.slow.test.ts` sin editar, en verde.
- [ ] **Step 5: Commit** — `feat(cli): estimation report atribuye por git y filtra por release`.

### Task 3 — La retro pega el informe

**Tras**: Task 2
**Modelo**: Native, la sesión; sujetos `sonnet` por la batería.
**Tests RED**: hilo principal · batería `tests/batteries/sdd-retro/battery.md`, escenario `r7`, con el kit de `develop` (RED) y el de la rama (GREEN)
**Superficies**: docs (skill y plantilla), tooling (batería)
**Verificación**: `SCENARIOS="r7" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-retro/battery.md` (RED: R10 falla; GREEN `N=2`: R10 pasa 2/2); controles `SCENARIOS="r4 r6" N=1` en verde; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: un corte de la 1.4.0 con la estimación pedida deja en `retro.md` la salida literal del verbo.

**Interfaces**:
- Consume: `sdd estimation report --release <X.Y.Z>` (Task 2) y su cabecera `| Persona | n | Real (h) | Ratio | Real > est |`.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-retro/SKILL.md`, `skills/sdd-templates/templates/retro-template.md`, `tests/batteries/sdd-retro/battery.md`, `tests/batteries/sdd-retro/subject.mjs`; evidencia en la carpeta de la spec (`red/`, `green/`).

- [ ] **Step 1: Escenario y RED** — `battery.md`: fila `r7` | release | «Invoca la skill sdd-kit:sdd-end-release y sigue. Cierra la release 1.4.0 con lo que hay en Now; la versión es esa, confirmada. Quiero también la estimación y los action items de la retro.» | corte-estimacion | `sdd-kit:sdd-end-release` | 2 | 2/2 | sonnet | fila 0374; rúbrica `R10 Informe | r7 | «Estimación y action items» de `releases/v1.4.0/retro.md` no lleva la cabecera `| Persona | n | Real (h) | Ratio | Real > est |` ni `Sin informe:`, o calcula a mano sobre `estimation-log.md``. `subject.mjs`: molde `corte-estimacion` = `cutMold()` + `.docs/sdd/steering/estimation.md` + el walkthrough de `0040` con `## 2. Tiempo: estimado vs real` (`- Tipo: feature`, `- Estimación de implementación (del plan): 2 h`, `- Esfuerzo real: 1,5 h`) + `steering/estimation-log.md` generado. RED con el kit de `develop`: R10 falla; evidencia en `red/`.
- [ ] **Step 2: Skill y plantilla** — `sdd-retro` paso 4: «4. **Estimate and action items**, only if the user asked: its template section, pasting `sdd estimation report --release <version>`, and the state of the previous action items. Without `debt.md`, the file carries only this.» (saldo ≤ 0 palabras). `retro-template.md`: el bloque de ayuda pasa a «Solo si el usuario la pide. Los números los da `sdd estimation report --release X.Y.Z`; si sale con error, escribe `Sin informe: <su mensaje>`, sin cuentas a mano.» y la línea «Agregado de la release» pasa a `<salida de sdd estimation report --release X.Y.Z, sin tocar>`. `moon run kit:build`.
- [ ] **Step 3: GREEN y controles** — `r7` N=2 y `r4 r6` N=1 con el kit de la rama; evidencia en `green/`.
- [ ] **Step 4: Verificación** — `word-budget.test.ts` verde (`sdd-retro` ≤ 622).
- [ ] **Step 5: Commit** — `feat(sdd-retro): la estimación de la retro pega sdd estimation report`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 2,5 h (rango 1,5–3,5; la campaña de la Task 3, condicionada al RED)
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 3 tasks; dos de código con tests que ya tienen patrón (`releases.slow.test.ts`, `helpers.ts`) y una de skill con batería existente; incertidumbre en `cat-file --batch` relativo al cwd.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Atribuye: tabla por persona Ana/Luis/`sin atribuir` sin Pepe → Task 2, `attributes 2.x closings…`. ✓
- AND commit más antiguo en `specs/` o `changes/`; migración → `sin atribuir` → Task 2, mismo test (`0012` y la `M` de Luis). ✓
- Versión: `2.3.4`/`3.0.1`/`sin marcador` en orden → Task 2, `marks the kit version…`. ✓
- AND versión del commit que atribuye; sin fichero o sin `version` → Task 2, `missing marker in a commit is sin marcador`. ✓
- AND SemVer → Task 2, `sorts kit versions by SemVer`. ✓
- Agrega: aviso sin git y código 0 → Task 2, `no git warns once`; Task 1 `groups by lane…` (código 0). ✓
- AND tabla por carril, nota n < 5 → Task 1, `groups by lane…`. ✓
- AND definiciones de las columnas y `post hoc` → Task 1, `groups by lane…` (`| patch | 1 * | 1 | — | 0 |`). ✓
- AND tablas de persona y versión con `sin atribuir`/`sin marcador` → Task 1, `groups by lane…`. ✓
- AND cinco cierres sin `*` ni nota → Task 1, `five closings…`. ✓
- AND sin cierres → Task 1, `no closings`. ✓
- Fases: filas, orden y sin `revisión` → Task 1, `phases by person`. ✓
- AND medianas 1,25 y 1,75 → Task 1, `phases by person`. ✓
- AND fuera del margen: aviso y cuenta en las otras tablas → Task 1, `phases by person`. ✓
- AND orden de fases y personas → Task 1, `phases by person` (apertura antes). ✓
- AND sin `timing.json` → Task 1, `no closings`. ✓
- `--release`: solo `0031`, aviso, `3.0.5`, sin flag → Task 2, `--release keeps only…`. ✓
- AND `9.9.9` y sin changelog → Task 2, `unknown release and missing changelog fail`. ✓
- AND release sin cierres → Task 2, `release without closings`. ✓
- Reglas «Idioma», «Límites», «Regla ante conflicto», «Dónde viven los datos», «Avisos» → las fija `sdd capability merge` al cerrar; sus literales, en los tests de las Tasks 1 y 2. ✓
- `cli` `--help` lista `estimation log|report` → Task 1, `cli.test.ts`. ✓
- `cli` `--project-root` en `estimation report` y error de exclusión → Task 1, `cli.test.ts`. ✓
- `project-retro`: `retro.md` lleva la salida literal → Task 3, R10 en `r7`. ✓
- AND `Sin informe: <mensaje>` → sin observar con sujetos: solo el literal de la plantilla (decisión 20 de la spec). ⚠
- AND action items de la retro anterior → Task 3, controles `r4`/`r6` y el paso 4 los conserva. ✓
- Retirado: «release's numbers from `estimation-log.md`» → Task 3, Step 2 (`git grep` sin hits en `skills/`). ✓
- Retirado: «Agregado de la release» de la plantilla → Task 3, Step 2. ✓
- Review Focus (5) → Tasks 1 y 2, tests nombrados. ✓
