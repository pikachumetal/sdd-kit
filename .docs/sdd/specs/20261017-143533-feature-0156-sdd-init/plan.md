---
id: 20261017-143533-feature-0156-sdd-init
feature: 0156
title: Plan de implementación — sdd-init, una sola init con lo determinista en `sdd init`
spec: ./spec.md
status: approved
created: 2026-10-17
---

# Plan de implementación — `sdd-init`

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** — 3 tasks encadenadas (la skill de la Task 2 nombra las opciones del verbo de la Task 1; la Task 3 retira lo que la 2 sustituye), un error lo cazan los Vitest y Pester de su task o la batería, y el plan cabe en un contexto. La sesión es Opus 5.5 porque el dev-lead aprobó sin parar antes de la Task 1.
2. **Modelos** — Native: implementa la sesión. Sujetos de las baterías: Sonnet (el fallo de origen no viene de Opus; método de `tech-stack.md`). Revisión final de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura, ver la línea del eje.
3. **Orden contra el fallo de la 0149** (ticket `field-reports/20261017-143150-feature-0149-archive.md` §4, pasado por la sesión de la 0149): hasta la Task 3 las viejas siguen en el kit, así que los escenarios de conducta `n1`–`n5` de la Task 2 piden la skill por su nombre («usa la skill `sdd-init`…») y el enrutado (`i1`, `i2`) se mide en la Task 3, tras retirarlas.
4. **Las migraciones se mueven en la Task 2**, con el hook y la paridad, para que `sdd-init` enlace su `references/migrations/README.md` desde el primer commit; las viejas dejan de tener migraciones en esa task y se borran en la 3.
5. **Regex de Pester con `\r?`** antes de `$` en `(?m)` (ticket de la 0149 §6): `develop` se saca con CRLF.
6. **Tope de `sdd-init`**: el aprobado (`SkillMd = 2400; Total = 3000`). Si la Task 2 no cabe, se recorta en la task; subirlo es un desvío que para (ticket de la 0149 §2: el literal de una regla se cuenta dentro del `SKILL.md`, no se baja a `references/` para caber).
7. **Coste estimado**: ~4 h de implementación; sujetos ~13 (~10 $), con un REFACTOR de n = 2 por regla que falle dentro del techo aprobado (17 sujetos o 14 $).
8. **Review Focus**: 5 entradas que la spec no fija del todo; ver la sección.

**Goal**: una sola skill `sdd-init` y el verbo `sdd init` que escribe settings, `.gitignore`, el registro de la init en curso y el marcador; retirar `sdd-init-greenfield`, `sdd-init-brownfield` y tres plantillas 2.x.

**Architecture**: el verbo vive en `cli/src/init/` como los demás dominios (`verbs.ts` + funciones puras que leen y validan antes de escribir). La skill, en inglés, con un tronco y marcas `With code:` / `Without code:`; las migraciones pasan a `skills/sdd-init/references/migrations/` y el hook las busca ahí.

**Tech Stack**: Node ≥ 22.18 sin dependencias (CLI, Vitest), Pester 5 para frases y anatomía, `tests/headless/battery.sh` para sujetos.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas por la interfaz de `sdd init` y por la retirada, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `cli/src/init/` y un contrato nuevo entre la skill y la CLI (`--approved`, `--config`, `--finish`) que reutilizará la 0157.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; mensajes en castellano con tildes.
- Node ≥ 22.18, TypeScript sin build y sin dependencias (`cli/package.json` sin `dependencies`).
- Bloque de settings literal: `autoMemoryEnabled: false`; `extraKnownMarketplaces.sdd-kit` = `{"source": {"source": "github", "repo": "pikachumetal/sdd-kit"}, "autoUpdate": true}`; `extraKnownMarketplaces.superpowers-marketplace` = `{"source": {"source": "github", "repo": "obra/superpowers-marketplace"}, "autoUpdate": true}`; `enabledPlugins["sdd-kit@sdd-kit"]` y `enabledPlugins["superpowers@superpowers-marketplace"]` = `true`; cada clave escrita literal en el `.ts`.
- Líneas de `.gitignore`: `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json`.
- Mensajes literales: `<ruta>: creado` · `actualizado` · `sin cambios`; `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`.
- Aviso del hook: `… Para aplicarlas, pide «ponme el proyecto al día con sdd-init».`
- Regex de Pester con `(?m)`: `\r?$`, nunca `$` solo.

### De proceso

- Native: la sesión implementa; `sdd task start|done` con el ledger; un commit por task al quedar limpia (`commit-milestones.md`).
- Sujetos en Sonnet con `tests/headless/battery.sh`; RED antes de escribir la guidance (Art. I); techo 17 sujetos o 14 $.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

- `--finish` sobre un `sdd-kit.json` sin `init` (proyecto ya terminado, o template sin progreso) → fusiona y escribe igual, sin error · Task 1, `finish works without init key`
- `--config` en un `sdd-kit.json` sin `init` (template) → fusiona en la raíz, no crea `init` · Task 1, `config merges at root without init`
- `--approved` con barras de Windows (`.docs\sdd\steering\constitution.md`) → se guarda con `/` y no se duplica con la forma `/` · Task 1, `approved normalizes separators`
- `.gitignore` con la última línea sin salto → la línea nueva no se pega a la anterior · Task 1, `gitignore without trailing newline`
- Template con `sdd-template: pending` y `package.json` → modo sin código, sin inventario · Task 2, escenario `n5`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un verbo con tres acciones; nada de `sdd init` interactivo.
- [x] **YAGNI gate**: sin variantes equivalentes de rutas en `.gitignore` (shortcut anotado en la spec).
- [x] **Brownfield gate**: N/A (repo del kit).
- [x] **Constitution check**: Art. I (RED y batería, tabla de retiradas en la spec), Art. III (skill en inglés), Art. V (ruta de `migrations/`), Art. VIII (plantillas solo en `sdd-templates`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/init/settings.ts` — constante `INIT_SETTINGS` y `mergeSettings(current: unknown): { merged: Json; notes: string[] }` por hoja.
- `cli/src/init/gitignore.ts` — `mergeGitignore(current: string | null, extra: string[]): string`.
- `cli/src/init/marker.ts` — `recordApproved`, `mergeConfig`, `finishMarker` sobre el objeto de `sdd-kit.json`.
- `cli/src/init/run.ts` — lee y valida los tres ficheros, decide y escribe en orden.
- `cli/src/init/verbs.ts` — `initVerb`.
- `cli/test/init/*.test.ts` y `cli/test/init/init.slow.test.ts`.
- `skills/sdd-init/SKILL.md`, `references/structure.md`, `references/generation.md`.
- `tests/batteries/sdd-init/` (`battery.md`, `subject.sh`, `mold-blank/`, `mold-code/`, `mold-template/`).

**Modificar** (Task 3 salvo lo marcado):

- `cli/src/cli/verbs.ts` (Task 1), `README.md` (bloque con marcador en Task 1; resto en Task 3), `cli/bin/session-start.js` y `cli/test/hook/`, `cli/test/fixtures/hook/` (Task 2), `tests/MigrationInitParity.Tests.ps1` y `tests/WordBudget.Tests.ps1` (Task 2), `skills/sdd-init-brownfield/references/migrations/` → `skills/sdd-init/references/migrations/` (Task 2), y en la Task 3 la lista del Scope de la spec.

**NO se tocan**: `migrations/v0.4.0.md`, `v1.0.0.md`, `v2.0.0.md`; `.docs/sdd/roadmap.md`; ADR, specs, tickets, releases y `tests/*-red|green|ab.md`; las skills que leen `mission.md`/`tech-stack.md`/`environments.md` de un proyecto.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `sdd-init` no cabe en 2.400 palabras | media | desvío | recortar en la Task 2; el literal de cada regla queda en el `SKILL.md` |
| Un Pester que nombra las init se escapa | media | rojo en el pre-commit | `git grep` de los dos nombres y de las tres plantillas al cerrar la Task 3 |
| Sujetos que enrutan a las viejas | alta sin la decisión 3 | sujetos perdidos | escenarios con el nombre de la skill hasta la Task 3 |

### 1.8 Rollout

Directo, dentro de la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `sdd init`: registro de la init en curso y `--finish`

**Tras**: —
**Modelo**: Native (la sesión).
**Tests RED**: hilo principal · `cli/test/init/settings.test.ts`, `gitignore.test.ts`, `marker.test.ts`, `verbs.test.ts`, `readme.test.ts`, `init.slow.test.ts`
**Superficies**: tooling (CLI)
**Verificación**: `moon run cli:typecheck cli:test cli:test-slow`
**Se prueba en la aplicación**: `node cli/bin/sdd.js init --root <tmp> --approved PRODUCT.md` y luego `--finish` sobre un directorio temporal: los tres ficheros, con las líneas de salida de la spec.

**Interfaces**:
- Consume: `Verb`, `VerbArgs`, `Io` de `cli/src/cli/verbs.ts`/`io.ts`; `UsageError` y `DomainError` de `cli/src/cli/args.ts`; la raíz del plugin como en `cli/src/hook/verbs.ts` (`fileURLToPath(new URL('../../..', import.meta.url))`).
- Produce: `sdd init --root <raíz> (--approved <ruta> | --config <json> | --finish [--ignore <ruta>]… [--memory-off])`; `sdd-kit.json` en curso = `{"init": {"approved": [<ruta con />], "config": {…}}}`; códigos 0 / 1 / 2.

**Ficheros**: crear `cli/src/init/{settings,gitignore,marker,run,verbs}.ts`, `cli/test/init/*`; modificar `cli/src/cli/verbs.ts` (añade `initVerb` tras `estimationLogVerb`), `README.md` (marca el bloque de settings con `<!-- sdd-init: settings -->` antes del bloque ```json``` y lo deja igual a `INIT_SETTINGS`).

- [ ] **Step 1: Implementación**
  - `export const INIT_SETTINGS` (bloque literal de las Restricciones).
  - `mergeSettings(current: unknown): { merged: Record<string, unknown>; notes: string[] }`: recorre las hojas de `INIT_SETTINGS`; hoja ausente → se añade; hoja con otro valor → se deja y nota `<ruta con puntos>: se deja <JSON.stringify(valor)>`, salvo `autoMemoryEnabled: true` → `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; con `memoryOff`, `autoMemoryEnabled` pasa a `false`; un nodo intermedio que existe y no es objeto plano → `throw new DomainError('.claude/settings.json no se puede fusionar: <ruta> no es un objeto')`. Firma con `(current, memoryOff: boolean)`.
  - `mergeGitignore(current: string | null, extra: string[]): string`: compara por línea tras `trim()`; respeta `\r\n` si el fichero lo usa; añade el salto final que falte; `null` → crea.
  - `recordApproved(marker, path)`, `mergeConfig(marker, config): { marker; notes }`, `finishMarker(marker, kitVersion, today): Record<string, unknown>` (sube `init.config`, `version` solo si falta, `channel: 'plugin'`, `updated` solo si otra clave cambia, quita `init`).
  - `runInit(options, io): number` en `run.ts`: valida `--root` (existe), `--ignore` (no vacío, no absoluto, sin `..`) y `--config` (objeto JSON) → `UsageError` (2); lee los JSON con `JSON.parse` en `try` → `DomainError('<ruta> no es JSON válido: no se toca')` (1) **antes de escribir nada**; escribe en orden settings → `.gitignore` → `sdd-kit.json` y saca `<ruta>: creado|actualizado|sin cambios` por fichero, más las notas.
  - Tests (nombres y asserts):
    - `settings.test.ts`: `adds the whole block to an empty file` (`toEqual(INIT_SETTINGS)`); `keeps other keys` (`permissions` intacto); `leaves a different leaf and notes it` (`source.repo` = `"otro/fork"` → nota `extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"`); `notes autoUpdate false and plugin false`; `asks before turning memory off` (nota literal); `memory-off turns it false`; `rejects a non-object node` (`enabledPlugins: []` → `toThrow('enabledPlugins no es un objeto')`).
    - `gitignore.test.ts`: `creates the file when missing`; `does not duplicate trimmed lines`; `keeps CRLF`; `gitignore without trailing newline`; `treats .superpowers without slash as different`.
    - `marker.test.ts`: `approved deduplicates`; `approved normalizes separators`; `config ignores version channel updated init` (notas `version: la fija sdd init, se ignora`); `config merges at root without init`; `finish lifts config and removes init`; `finish keeps an existing version`; `finish keeps updated when nothing else changes`.
    - `verbs.test.ts`: `exit 2 without an action`; `exit 2 with two actions`; `exit 2 on bad config` (`'[1]'`, `'{'`); `exit 2 on bad ignore` (`''`, `'C:/x'`, `'../x'`); `exit 2 on a missing root`; `exit 1 and no writes on broken settings` (mtime y contenido de `.gitignore` sin cambios); `exit 1 and no writes on broken marker`; `exit 1 and no writes on a non-object node`; `finish works without init key`; `finish writes the marker last` (orden de `writeFileSync` espiado); `second finish says sin cambios three times`.
    - `readme.test.ts`: `README settings block equals INIT_SETTINGS` (bloque ```json``` tras `<!-- sdd-init: settings -->`).
    - `init.slow.test.ts`: proceso real `node cli/bin/sdd.js init` con `--approved`, `--config`, `--finish --ignore .auth/` sobre un temporal; `version` igual a la de `.claude-plugin/plugin.json`.
    - `cli.test.ts` existente: `--help` lista `init`.
- [ ] **Step 2: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 3: Verificación** — `moon run cli:test cli:test-slow`. Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd init escribe settings, gitignore y el marcador de la init (0156, task 1)`.

### Task 2 — Skill `sdd-init` con su batería, migraciones y hook

**Tras**: Task 1
**Modelo**: Native (la sesión); sujetos Sonnet.
**Tests RED**: hilo principal · RED de `n1`, `n2`, `n3` con las skills de hoy (`sdd-init-greenfield`/`-brownfield` por su nombre) antes de escribir `sdd-init`; `cli/test/hook/` con la ruta y el texto nuevos; `tests/MigrationInitParity.Tests.ps1` con el corpus nuevo.
**Superficies**: skills · tooling (hook) · tests
**Verificación**: `moon run cli:test` y `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1,tests/WordBudget.Tests.ps1,tests/Skills.Tests.ps1 -CI"`; batería `BATTERY=sdd-init tests/headless/battery.sh` (GREEN de `n1`–`n5`)
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo prueba la batería con sujetos.

**Interfaces**:
- Consume: `sdd init --root <raíz> (--approved <ruta> | --config <json> | --finish [--ignore <ruta>]… [--memory-off])` de la Task 1; `sdd estimation log --root`.
- Produce: `skills/sdd-init/SKILL.md` (name `sdd-init`), `skills/sdd-init/references/{structure,generation}.md`, `skills/sdd-init/references/migrations/`; aviso del hook «pide «ponme el proyecto al día con sdd-init»».

**Ficheros**: crear `skills/sdd-init/**`, `tests/batteries/sdd-init/**`; `git mv skills/sdd-init-brownfield/references/migrations skills/sdd-init/references/migrations` (en `README.md` de migraciones, los nombres de skill); modificar `cli/bin/session-start.js` (ruta y texto), `cli/test/hook/*`, `cli/test/fixtures/hook/**` (la carpeta de migraciones del plugin de fixture y el texto esperado), `tests/MigrationInitParity.Tests.ps1` (un corpus: `sdd-init` + `cli/src/init/*.ts`), `tests/WordBudget.Tests.ps1` (`'sdd-init' = @{ SkillMd = 2400; Total = 3000 }`), `skills/sdd-init-brownfield/SKILL.md` (su enlace a migraciones apunta a la ruta nueva hasta borrarse).

- [ ] **Step 1: Batería y RED** — `battery.md` con `n1`–`n5` (petición, molde, esperado, n, umbral, Sonnet, procedencia: B4, B6, 0097, humo, template) y los moldes: `mold-blank` (solo `README.md`), `mold-code` (`package.json` con `test`/`e2e`, `.github/workflows/ci.yml` con `npm test`, `src/app.ts`, un `CLAUDE.md` previo con «Usa `npm run dev` en el puerto 3000» y «Las fechas van en UTC»), `mold-template` (forma 2.x con `sdd-template: pending` en `mission.md`, `roadmap.md` y la constitution, `tech-stack.md`/`architecture.md`/`environments.md` completos, `sdd-kit.json` `1.1.0`, `package.json` y un login), y para `n2`, `mold-code` con `PRODUCT.md`, `steering/constitution.md` y `sdd-kit.json` en curso. RED de `n1`–`n3` con las init de hoy; si un RED no exhibe el fallo, esa guidance no se escribe (Art. I) y se dice en `tasks.md`.
- [ ] **Step 2: Skill** — `SKILL.md` en inglés con: frontmatter (`description` que dispara con «quiero trabajar con SDD», «prepara el proyecto», «haz el onboarding», «sigue con la init», y nombra «actualízame al kit» mientras la migración viva aquí); Overview (no `/init`; la documentación crece con cada tarea); ⛔ gate sin entrevista; predicados (a)–(e) de la decisión 3 de la spec, literales; modo con su línea y la oferta de template; inventario y cosecha (`With code:`, y cualquier fichero previo de la raíz); tabla única de la entrevista con su columna «With code»; documentos en el orden de la decisión 9, cada uno escrito tras el «sí» y seguido de `sdd init --approved`; `sdd estimation log`; git; `sdd init --finish` (con `--ignore` de `## Frontend` y `--memory-off` tras el «sí»); `claude plugin marketplace add`; cierre (discrepancias, preferencias con `sdd-config`, template 2.x → migración, volcado a petición); red flags y racionalizaciones de la tabla del Art. I. `structure.md` (árbol 3.0.0) y `generation.md` (orden, reglas de oro, reglas de producto deducidas, calibración vacía) traducidas.
- [ ] **Step 3: Hook y paridad** — `git mv` de las migraciones; `session-start.js` con `join(pluginRoot, 'skills', 'sdd-init', 'references', 'migrations')` y el texto nuevo; tests del hook y fixture; `MigrationInitParity` con un solo corpus (`Get-InitCorpus 'sdd-init'` + `cli/src/init/*.ts`), regex con `\r?`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; GREEN de `n1`–`n3` con n = 2 y `n4`, `n5` con n = 1, pidiendo la skill por su nombre. Un rojo se lee, no se relanza; REFACTOR n = 2 dentro del techo.
- [ ] **Step 5: Commit de la task** — `feat(skills): sdd-init funde las dos init, con migraciones y aviso del hook (0156, task 2)`.

### Task 3 — Retirada de las dos init y de tres plantillas, y enrutado

**Tras**: Task 2
**Modelo**: Native (la sesión); sujetos Sonnet.
**Tests RED**: hilo principal · los Pester del Scope fallan tras borrar las viejas; `i1` con la espera `sdd-kit:sdd-init` e `i2` nuevo en la batería de `using-sdd`.
**Superficies**: skills · tests · docs
**Verificación**: `moon run kit:test cli:test`; `BATTERY=using-sdd STEPS=sdd-init tests/headless/battery.sh`; `git grep -n -E "sdd-init-(greenfield|brownfield)|(mission|tech-stack|environments)-template"` solo en lo que «No entra» de la spec
**Se prueba en la aplicación**: no, porque es retirada de texto: lo prueban los Pester y el tramo de enrutado.

**Interfaces**:
- Consume: `skills/sdd-init/` de la Task 2.
- Produce: kit sin `sdd-init-greenfield`, `sdd-init-brownfield`, `mission-template.md`, `tech-stack-template.md` ni `environments-template.md`; `using-sdd` con la fila «Sin `.docs/sdd/`, o con `sdd-kit.json` en curso (clave `init`) → `sdd-kit:sdd-init`».

**Ficheros**: borrar `skills/sdd-init-greenfield/`, `skills/sdd-init-brownfield/`, las tres plantillas; modificar `skills/sdd-templates/SKILL.md` (índice: sin las tres; `client-changelog` y `roadmap` siguen marcadas 2.x), `skills/sdd-templates/templates/capability-template.md`, `skills/using-sdd/SKILL.md`, `skills/sdd-config/SKILL.md`, `skills/sdd-archive/SKILL.md` y `references/aprendizajes-skills.md`, `skills/sdd-end-release/SKILL.md`, `README.md` (catálogo, párrafo de settings, recuentos), `CLAUDE.md` («las 21 skills»), `.docs/workflow/{usage-guide,greenfield,brownfield}.md`, `.docs/sdd/{architecture,mission,tech-stack,constitution}.md` (solo las líneas de la spec), `cli/test/capability/check.test.ts`, los Pester del Scope, `tests/headless/lib.sh`, `tests/batteries/sdd-archive/subject.sh`, `tests/batteries/sdd-grilling/battery.md`, `tests/batteries/using-sdd/battery.md` (+ molde de `i2`).

- [ ] **Step 1: Retirada** — borrar y renombrar según «Ficheros»; en `README.md`, el párrafo «Las init y la migración a v2.0.0 escriben…» pasa a decir que `sdd-init` escribe el bloque entero.
- [ ] **Step 2: Enrutado** — fila de `using-sdd`; `i1` espera `sdd-kit:sdd-init`; `i2` «Sigue con la init, se cortó ayer.» en un molde con `.docs/sdd/sdd-kit.json` = `{"init": {"approved": ["PRODUCT.md"]}}`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; el tramo de enrutado con n = 1 cada uno.
- [ ] **Step 4: Commit de la task** — `feat(skills): retirada de sdd-init-greenfield, sdd-init-brownfield y tres plantillas 2.x (0156, task 3)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,3h
- Estimación de implementación: 4h
- Base de la estimación: 3 tasks (CLI acotada con firmas y tests fijados; una skill fundida con ~13 sujetos; retirada en ~40 ficheros); la 0149, que fundió dos skills, desvió hacia arriba en tope y sujetos; la 0144, con firmas fijadas, hacia abajo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `onboarding` · Una sola init / Cada documento tras su aprobación / `CLAUDE.md` pasa por el gate / Una init interrumpida se retoma / Un fichero de la raíz no decide / §Testing / Marcador al final / Template sin marcador → Task 2 (`n1`–`n5` y el texto de la skill). ✓
- `onboarding` · MODIFIED de entrevista, ramas, git, calco, claves, frontend, funcional, proyecto de referencia, template → Task 2 (texto) y `n4`/`n5`. ✓
- `onboarding` · memoria y temporales, log de estimación → Task 1 (Vitest) y Task 2 (texto). ✓
- `onboarding` · `operations.md` y `sdd-templates` 3.0.0 → Task 3 (índice) y `AnchorTemplates`. ✓
- `capabilities` · REMOVED y dos MODIFIED → Task 2 (texto), Task 3 (`CapabilitiesAtBirth`). ✓
- `migration` · ruta, aviso del hook, proyecto al día, paridad, v2.0.0 → Task 2 (hook, paridad, texto). ✓
- `routing` · router y init en curso → Task 3 (`i1`, `i2`, `UsingSdd`). ✓
- `cli` · `--help` y los cuatro ADDED → Task 1. ✓
- `archive` · ruta del hotfix → Task 3 (`ArchiveSkill`, `sdd-archive`). ✓
- Review Focus → Task 1 (cuatro tests) y Task 2 (`n5`). ✓
