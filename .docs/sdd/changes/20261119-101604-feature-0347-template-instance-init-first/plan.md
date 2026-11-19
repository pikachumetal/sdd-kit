---
id: 20261119-101604-feature-0347-template-instance-init-first
feature: 0347
title: Plan de implementación — Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Native, las tres en el hilo (Opus 5.5, effort de la sesión); la revisión final de rama con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`). Los sujetos de las baterías, `sonnet`, como dice cada escenario.
2. Ejecución: Native (ver la línea `Ejecución`).
3. La detección es una función de `cli/bin/session-start.js`, `templatePendingFile(projectDir)`, que devuelve la ruta relativa con `/` del primer fichero con marca o `''`; la usan el hook, `cli/src/upgrade/run.ts` y `cli/src/init/run.ts`. Para la línea de `--finish` hace falta la lista entera: `templatePendingFiles(projectDir): string[]`, y `templatePendingFile` es su primer elemento.
4. El RED de `t1` corre en la Task 1 antes de tocar la CLI, y el de `n8` en la Task 3 antes de tocar la skill: cada RED mide el kit de hoy en su parte.
5. Riesgo alto: ninguno. Coste estimado: ~2,5 h y 0,91 $ de sujetos (spec, «Previsión de coste»).
6. Review Focus: 3 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: con una marca de template, el hook remite a `sdd-init` en lugar de ofrecer migrar, `sdd upgrade` no migra y `--finish` la señala; el resumen de `sdd-init` nombra lo que `--finish` escribió fuera de `.docs/`.

**Architecture**: una función pura de detección en el hook (`.js` sin compilar, que `run.ts` de `upgrade` ya importa), usada por tres llamadores. El resumen sale de la salida que `--finish` ya imprime; la skill solo cambia sus pasos 7 y 8.

**Tech Stack**: Node 22+ y TypeScript en `cli/`, Vitest; baterías headless (`tests/headless/battery.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks que comparten una función pequeña de la Task 1, un error lo caza el test de su task y el plan cabe en un contexto (`execution: auto` en `sdd-kit.json`). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no hay módulo, dependencia ni contrato entre módulos nuevo: una función más en un fichero que `run.ts` ya importa.

## Restricciones globales

### De código

- Marca de template: el texto `<!-- sdd-template: pending` sin un backtick justo delante, fuera de un bloque vallado (se abre con tres o más ``` o ~~~ y se cierra con la misma secuencia; uno sin cerrar llega al final del fichero), en `PRODUCT.md`, `ROADMAP.md`, `.docs/sdd/*.md` y `.docs/sdd/steering/*.md`, en ese orden, cada carpeta con `sort()`.
- Aviso literal: «AVISO sdd-kit: el proyecto viene de un template sin inicializar (`<fichero>` lleva `<!-- sdd-template: pending -->`): entra primero por la skill `sdd-init`; las migraciones del kit, hasta la <mayor>, después.»
- Error literal de `sdd upgrade`: `template sin inicializar: sigue con sdd-init`.
- Línea literal de `--finish`: `<fichero>: queda <!-- sdd-template: pending -->: hasta quitarla, el kit no migra el proyecto y manda a sdd-init`.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: el hilo implementa; revisión final con `sdd-verify`.
- Commits: tipo y scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia (`commit-milestones.md`).
- Saldo de palabras de `sdd-init` ≤ 0 (`cli/test/kit/word-budget.test.ts`, tope sin subir).

## Review Focus

- Marca dentro de un comentario HTML de varias líneas o con mayúsculas (`<!-- SDD-TEMPLATE: pending -->`) → no cuenta: el contrato es el texto literal en minúsculas · Task 1, `ignores an uppercase mark`.
- `--mark` sobre una instancia con marca y `init` a la vez → `init en curso: sigue con sdd-init` · Task 1, `init in progress wins over a template mark`.
- `--finish` en un proyecto sin `.docs/sdd/` (init nueva antes de escribir nada) → sin línea de marca y sin error · Task 2, `finish without docs prints no mark line`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de detección y tres llamadas.
- [x] **YAGNI gate**: tres usos reales.
- [x] **Brownfield gate**: retrocompatible; sin marca, todo igual.
- [x] **Constitution check**: Art. I (RED antes de cada edición de skill), Art. II (la orden delante: la salida de `--finish`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/init/finish-template.test.ts` — la línea de marca de `--finish`, llamando a `runInit` con `memoryIo`.

**Modificar**:

- `cli/bin/session-start.js` — `templatePendingFiles`, `templatePendingFile` y el aviso de template en `sessionStartOutput`.
- `cli/src/upgrade/run.ts` — el error de template tras `readMarker`.
- `cli/src/init/run.ts` — la línea por cada marca en la acción `finish`.
- `cli/test/hook/session-start.test.ts`, `cli/test/upgrade/upgrade.test.ts` — casos de «Dónde se prueba».
- `skills/sdd-init/SKILL.md` — pasos 7 y 8.
- `tests/batteries/sdd-init/battery.md` y `subject.mjs` — `n8`, molde `template-finish`.
- `tests/batteries/sdd-upgrade/battery.md` y `subject.mjs` — `t1`, molde `template`.

**NO se tocan**:

- `skills/sdd-upgrade/SKILL.md` — salvo que `t1` salga rojo con la CLI nueva (spec, Scope).
- `cli/src/hook/session-start.ts` — solo reexporta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto de `t1` entra por `sdd-init` por el texto de la petición y no por el aviso, y el RED no sale rojo | media | el RED no prueba nada | leer `tools.txt`: el RED es rojo si invoca `sdd-upgrade` o escribe `sdd-kit.json`; si sale verde, se dice y se cierra con el test de `cli/` como prueba |

### 1.8 Rollout

Directo, en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El hook y `sdd upgrade` remiten a `sdd-init` con una marca de template

**Tras**: —
**Modelo**: Native, el hilo
**Tests RED**: hilo principal · `cli/test/hook/session-start.test.ts`, `cli/test/upgrade/upgrade.test.ts`; batería `t1` antes del código
**Superficies**: tooling
**Verificación**: `npx vitest run test/hook/session-start.test.ts test/upgrade/upgrade.test.ts` desde `cli/` → `Tests  N passed (N)`; `BATTERY=sdd-upgrade SCENARIOS=t1 N=1 node tests/headless/battery.mjs run` (RED y GREEN) y su `verdict`

**Interfaces**:
- Consume: nada
- Produce: `export function templatePendingFiles(projectDir: string): string[]` y `export function templatePendingFile(projectDir: string): string` en `cli/bin/session-start.js` (rutas relativas con `/`, p. ej. `PRODUCT.md`, `.docs/sdd/steering/constitution.md`)

**Ficheros**: `cli/bin/session-start.js`, `cli/src/upgrade/run.ts`, los dos tests, `tests/batteries/sdd-upgrade/battery.md` y `subject.mjs`

- [ ] **Step 1: RED de `t1`** — fila `t1 | template | Actualízame al kit. | template | `sdd-kit:sdd-init` | 1 | 1/1 | sonnet | 0347: …` en `battery.md`, con rúbrica «falla si `tools:` invoca `sdd-upgrade` antes que `sdd-init`, o `file: .docs/sdd/sdd-kit.json` cambia de versión»; molde `template` en `subject.mjs`: un repo con `PRODUCT.md` (`<!-- sdd-template: pending -->`), `ROADMAP.md` y `steering/` completos, y `sdd-kit.json` con la `version` de la penúltima migración del kit (sin `putKitMarker`), para que haya una pendiente. Construir el kit (`moon run kit:build`), lanzar el RED con la CLI de hoy y anotar el veredicto.
- [ ] **Step 2: Tests** — en `session-start.test.ts`, con `pluginWith('3.0.3', ['v3.0.2.md', 'v3.0.3.md'])` y `projectAt('3.0.2')` más el fichero con marca: `warns template instead of migrations` (aviso literal con `PRODUCT.md`, sin `actualízame al kit`, sin `Antes de atender`), `finds the mark in a table cell` (`| Reglas | <!-- sdd-template: pending --> |` en `.docs/sdd/steering/constitution.md`), `uses the canonical mark for a mark with text` (`.docs/sdd/mission.md` con `<!-- sdd-template: pending — no sé -->`, 2.x con `v3.0.0.md`: sin `El kit cargado exige`), `ignores a quoted mark` (`` `<!-- sdd-template: pending -->` `` en `ROADMAP.md` → aviso de siempre), `ignores a mark in a fenced block` (```` y `~~~`, y uno sin cerrar), `ignores an uppercase mark`, `no warning without pending migrations`, `unattended gets the same template warning` (`control.profile: unattended` en `sdd-kit.json`, sin `no ofrezcas ni migres`). En `upgrade.test.ts`: `refuses a template instance` (con y sin `--mark 2.3.2`, `toThrow(new DomainError('template sin inicializar: sigue con sdd-init'))`, `readMarker` igual), `refuses a template instance already up to date`, `init in progress wins over a template mark`. Verlos fallar.
- [ ] **Step 3: Implementación** — `templatePendingFiles` lee los ficheros en el orden de las Restricciones, recorre las líneas con un estado de valla (abre con `/^\s*(`{3,}|~{3,})/`, cierra con la misma secuencia) y casa `/(^|[^`])<!-- sdd-template: pending/` fuera de valla. En `sessionStartOutput`, si `migration.length > 0` y hay fichero, el aviso de template sustituye a `migration` y `order` queda vacío. En `runUpgrade`, tras `readMarker` (que ya da JSON inválido e `init en curso`), si `templatePendingFile(options.root)` no es `''`, `throw new DomainError('template sin inicializar: sigue con sdd-init')`.
- [ ] **Step 4: Verificación** — los tests de la task en verde; `moon run kit:build`; GREEN de `t1` con la CLI nueva.
- [ ] **Step 5: Commit de la task** — `feat(cli): una instancia de template sin inicializar no recibe la oferta de migrar`.

### Task 2 — `--finish` señala cada marca de template que queda

**Tras**: Task 1
**Modelo**: Native, el hilo
**Tests RED**: hilo principal · `cli/test/init/finish-template.test.ts`
**Superficies**: tooling
**Verificación**: `npx vitest run test/init/` desde `cli/` (con `--test-timeout 120000` por `init.slow.test.ts`) → `Tests  N passed (N)`

**Interfaces**:
- Consume: `templatePendingFiles(projectDir: string): string[]` de `cli/bin/session-start.js`
- Produce: la línea `<fichero>: queda <!-- sdd-template: pending -->: hasta quitarla, el kit no migra el proyecto y manda a sdd-init` en la salida de `sdd init --finish`

**Ficheros**: `cli/src/init/run.ts`, `cli/test/init/finish-template.test.ts`

- [ ] **Step 1: Tests** — con `runInit({ root, action: { kind: 'finish', ignores: [], memoryOff: false }, kitVersion: '3.0.3', today: '2026-11-19' }, io)`: `finish names each file that keeps a template mark` (`PRODUCT.md` con marca → `io.stdout` contiene la línea literal con `PRODUCT.md`), `finish prints no mark line without marks`, `finish without docs prints no mark line`. Verlos fallar.
- [ ] **Step 2: Implementación** — en `runInit`, solo con `action.kind === 'finish'`, tras las líneas de escritura, una línea por fichero de `templatePendingFiles(options.root)`.
- [ ] **Step 3: Verificación** — los tests de `cli/test/init/` en verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd init --finish señala las marcas de template que quedan`.

### Task 3 — El resumen de cierre de `sdd-init` nombra lo de fuera de `.docs/`

**Tras**: Task 2
**Modelo**: Native, el hilo
**Tests RED**: batería `n8` de `sdd-init`, antes de editar la skill
**Superficies**: docs (skill), tooling (batería)
**Verificación**: `BATTERY=sdd-init SCENARIOS=n8 N=1 node tests/headless/battery.mjs run` (RED), `N=2` (GREEN), `SCENARIOS=n5 N=1` (control), cada uno con su `verdict`; `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`

**Interfaces**:
- Consume: la salida de `--finish` (`<fichero>: creado | actualizado | sin cambios` y la línea de marca de la Task 2)
- Produce: nada

**Ficheros**: `skills/sdd-init/SKILL.md`, `tests/batteries/sdd-init/battery.md` y `subject.mjs`

- [ ] **Step 1: RED de `n8`** — molde `template-finish` en `subject.mjs`: `moldTemplate()` con los documentos completos (sin marca) salvo `PRODUCT.md`, que guarda `<!-- sdd-template: pending -->` bajo `## Terminology`; `CLAUDE.md`; `sdd-kit.json` con `init.approved` de todos y `version` del template; `.claude/settings.json` propio (`{"permissions": {"allow": ["Bash(npm test)"]}}`); `.gitignore` con `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json` y `.temp/`. Fila `n8 | finish | Usa la skill sdd-kit:sdd-init. Sigue con la init, se cortó ayer. | template-finish | `sdd-kit:sdd-init` | 1 | 1/1 | sonnet | 0347: …` y rúbrica: falla si `text:` no casa `/\.claude\/settings\.json: actualizado/` y `/sdd-kit-loaded\.mjs: creado/` y `/commit de cierre/`, si casa `/\.gitignore/` en el resumen, o si no nombra `PRODUCT.md` entre lo pendiente. Lanzar con la skill de hoy.
- [ ] **Step 2: Edición de la skill** — paso 7: «It writes, in this order and without asking: `.claude/settings.json` (…), `.claude/hooks/sdd-kit-loaded.mjs`, `.gitignore` and `.docs/sdd/sdd-kit.json` …» pierde el paréntesis de `settings.json` y «in this order and»; paso 8 gana, tras «what was created»: «each `--finish` line outside `.docs/` that says `creado` or `actualizado`, literal, and that they go in the closing commit; each template mark `--finish` says is left». `moon run kit:build`; saldo ≤ 0 con `word-budget.test.ts`.
- [ ] **Step 3: GREEN** — `n8` con N=2 y el control `n5` con N=1; si `n8` sale rojo, una tanda de REFACTOR (spec, «Previsión de coste»).
- [ ] **Step 4: Commit de la task** — `fix(sdd-init): el resumen de cierre nombra lo que --finish escribió fuera de .docs/`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,4h
- Base de la estimación: 3 tasks pequeñas, dos de CLI con tests unitarios y una de skill con dos tandas de sujetos; incertidumbre en el molde de `t1`
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «La sesión avisa…», AND «con una marca de template, en su lugar…» → Task 1, `warns template instead of migrations`. ✓
- MODIFIED «Un proyecto ya inicializado…», GIVEN «sin marca de template» y AND del error → Task 1, `refuses a template instance`. ✓
- ADDED «…no recibe la oferta de migrar», THEN aviso literal → Task 1, `warns template instead of migrations`. ✓
- AND «el agente recibe el mismo aviso… sin orden» → Task 1, mismo test (sin `Antes de atender`). ✓
- AND `unattended` → Task 1, `unattended gets the same template warning`. ✓
- AND 2.x con «no sé» y forma canónica → Task 1, `uses the canonical mark for a mark with text`. ✓
- AND celda de tabla → Task 1, `finds the mark in a table cell`. ✓
- AND sin migraciones pendientes → Task 1, `no warning without pending migrations`. ✓
- ADDED «Una marca citada no cuenta», THEN y AND (valla, `changes/`) → Task 1, `ignores a quoted mark`, `ignores a mark in a fenced block`; `changes/` no está en la lista de ficheros (mismo test con la marca solo en `.docs/sdd/changes/x/spec.md`). ✓
- ADDED «`sdd upgrade` no migra…», THEN, `sdd-kit.json` igual, al día, `init` gana → Task 1, sus tres tests de `upgrade.test.ts`. ✓
- AND «el agente invoca `sdd-init`» → Task 1, batería `t1`. ✓
- Reglas de `migration` (Avisos, Regla ante conflicto) → Task 1, los mismos tests; la precedencia, `init in progress wins over a template mark`. ✓
- ADDED de `onboarding`, THEN (dos líneas literales y commit de cierre) y AND `.gitignore` → Task 3, batería `n8`. ✓
- AND marca que queda tras `--finish` → Task 2, `finish names each file that keeps a template mark`; el resumen, Task 3, `n8`. ✓
- Regla Avisos de `onboarding` → Task 3, `n8`. ✓
- «Lo que se retira»: paso 7 de `sdd-init` → Task 3, Step 2; la orden de `autoMemoryEnabled` queda literal (diff). ✓
- Review Focus → Task 1 y Task 2, sus tests nombrados. ✓
