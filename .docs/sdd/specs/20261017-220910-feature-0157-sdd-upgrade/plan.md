---
id: 20261017-220910-feature-0157-sdd-upgrade
feature: 0157
title: Plan de implementación — sdd-upgrade, el hook ofrece la migración y lo determinista va a la CLI
spec: ./spec.md
status: draft
created: 2026-10-18
---

# Plan de implementación — `sdd-upgrade`: el hook ofrece la migración y lo determinista va a la CLI

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa las tres tasks (Opus 5.5, el dev-lead no eligió bajar la sesión). Los sujetos de las baterías, en Sonnet (Art. I, como las baterías). La revisión final, en ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`, Arquitectura con `sdd-kit:effort-high` + `opus` (ver la línea del eje).
2. **Ejecución**: Native (línea de abajo).
3. **Orden de las tasks**: primero lo determinista (CLI y hook, con Vitest), después la skill, que lo nombra. El RED de los sujetos corre sobre una copia del kit sacada con `git archive c04fc5c7` (la base de la rama): mide el hook y `sdd-init` de antes aunque la Task 2 ya haya cambiado el hook.
4. **`sdd upgrade` separa el cálculo del verbo**: `runUpgrade` recibe `migrationsDir` y `today`, y los tests lo llaman con un kit de juguete en un directorio temporal; el verbo pasa la carpeta real del plugin. Así los tests no dependen de las migraciones reales que existan.
5. **Una función de fecha local compartida**, `localDay(date: Date): string` en `cli/src/cli/dates.ts`, la usan `sdd init` y `sdd upgrade --mark` (decisión 11 de la spec).
6. **El formato de `--mark` se valida con `/^\d+\.\d+\.\d+$/`** antes de componer ninguna ruta.
7. **Riesgo alto**: mover `migrations/` rompe referencias que nadie lista; lo cierra el `git grep` final de la Task 3 (decisión 13 de la spec).
8. **Coste estimado**: ~4 h de implementación; campaña de 20 sujetos, ~4,5 $ (spec, decisión 18).
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: la migración entra por su skill, `sdd-upgrade`; el hook la ofrece, y la lista, el orden y el marcador los da `sdd upgrade`.

**Architecture**: un verbo nuevo en `cli/src/upgrade/` con la forma de `cli/src/init/` (un `run` puro y un `verbs.ts`); el hook sigue en `cli/bin/session-start.js` con la ruta nueva y la orden de ofrecer en `additionalContext`; la skill `sdd-upgrade` se lleva `references/migrations/` y absorbe su `README.md`.

**Tech Stack**: Node ≥ 22.18 con TypeScript sin compilar y Vitest para la CLI; Markdown para las skills; Pester para frases y anatomía; sujetos headless (`tests/headless/battery.sh`) para la conducta.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks encadenadas por pocas interfaces (`runUpgrade` y la ruta de las migraciones), un error de la CLI lo caza su test en la misma task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `cli/src/upgrade/` y contrato nuevo entre la CLI y las skills (`sdd upgrade` y su salida), y una skill nueva que mueve `migrations/`.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Node ≥ 22.18, sin dependencias en `cli/package.json`; todo código que llame a git limpia `GIT_DIR` y compañía (`cli/src/git/git.ts`).
- Literales de `sdd upgrade`, exactos: `el proyecto ya está al día con el kit <versión>` · `sin sdd-kit.json: se aplican todas` · `init en curso: sigue con sdd-init` · `.docs/sdd/sdd-kit.json no es JSON válido: no se toca` · `--mark <versión>: el kit no trae esa migración` · `--mark <versión>: el proyecto ya está en <versión>` · `.docs/sdd/sdd-kit.json: actualizado`. Códigos: 0 lista o al día; 1 init en curso, JSON roto o `--mark` hacia atrás; 2 uso mal formado o versión sin migración.
- Aviso del hook al usuario, exacto: `AVISO sdd-kit: el proyecto tiene aplicado el kit <marcador> (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la <mayor>. Para aplicarlas, pide «actualízame al kit».`
- Orden del hook al agente, exacta, solo en `additionalContext`, tras los avisos y antes de `using-sdd`: `Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.`
- Carpeta de las migraciones: `skills/sdd-upgrade/references/migrations/`.

### De proceso

- Native: la sesión implementa con `sdd-implement` y `sdd-tdd`; la revisión final, por ejes con `sdd-verify`.
- Política de modelos: sujetos en Sonnet; `fable` y `opus xhigh`, prohibidos.
- Cada molde nuevo pasa por `DRY_RUN=1` antes del primer RED; el RED con `KIT_DIR` de `git archive c04fc5c7 skills .claude-plugin cli hooks`.
- Una task que mueve una ruta cambia en la misma task cada referencia que da `git grep` (ticket de la 0156 §5).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`. El pre-commit (`.githooks`) tiene que estar activo: `git config core.hooksPath` → `.githooks`.

## Review Focus

- `sdd-kit.json` con BOM al principio → `sdd upgrade` lo lee igual (el `readText` de la CLI quita el BOM) · Task 1, `reads a marker with BOM`.
- Migración con un nombre que no es `vX.Y.Z.md` (`vNEXT.md`, `notes.md`) en la carpeta → se ignora en la lista y en el hook · Task 1, `ignores files that are not vX.Y.Z.md`; Task 2, `ignores non-semver migration names`.
- `--mark` con la versión mayor que la última del kit pero con su fichero (una release en preparación) → se acepta: manda el fichero · Task 1, `marks a version that has its file`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un verbo sin subverbos, sin `--json`; la orden de ofrecer va en el texto que el hook ya inyecta.
- [x] **YAGNI gate**: `localDay` tiene dos usos y quita una duplicación; nada más se abstrae.
- [x] **Brownfield gate**: los `vX.Y.Z.md` no cambian; `sdd init` mantiene su salida salvo `--ignore` con espacios al borde.
- [x] **Constitution check**: Art. I (RED antes de la guidance, previsión en la spec, tabla de la regla retirada), Art. V (cada release con su migración, ruta nueva), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/upgrade/run.ts` — `runUpgrade`: lee el marcador, lista las migraciones pendientes en orden SemVer o escribe el marcador con `--mark`.
- `cli/src/upgrade/verbs.ts` — `upgradeVerb`: opciones, carpeta real de las migraciones del plugin y fecha del día.
- `cli/src/cli/dates.ts` — `localDay`.
- `cli/test/upgrade/upgrade.test.ts` — tests de `runUpgrade` y del verbo.
- `skills/sdd-upgrade/SKILL.md` — la skill: procedimiento de migración, gate de un paso sin marca, red flags.
- `tests/batteries/sdd-upgrade/` — `battery.md`, `subject.sh` y el molde (`o1`, `o2`, `m1`, `m2`).
- `tests/sdd-upgrade-red.md` y `tests/sdd-upgrade-green.md` — evidencia de la campaña.

**Modificar**:

- `skills/sdd-init/references/migrations/` → `skills/sdd-upgrade/references/migrations/` (`git mv`); `README.md` sale (su texto pasa a `SKILL.md`).
- `cli/src/cli/verbs.ts` — registra `upgradeVerb` tras `initVerb`.
- `cli/src/init/settings.ts`, `cli/src/init/verbs.ts`, `cli/src/init/run.ts` — los menores de la 0156.
- `cli/bin/session-start.js` — ruta nueva, aviso nuevo y orden de ofrecer.
- `cli/test/hook/session-start.test.ts`, `cli/test/fixtures/hook/` (las cuatro `.json` que llevan aviso y el árbol `plugin/skills/…/migrations`).
- `skills/sdd-init/SKILL.md` (predicados 3 y 4, `description`), `skills/using-sdd/SKILL.md` (fila de puerta), `skills/sdd-archive/SKILL.md`, `skills/sdd-end-release/SKILL.md` (ruta).
- Los Pester que nombran la ruta, `tests/MigrationInitParity.Tests.ps1` (lectura y exclusión de `skills/sdd-upgrade/`), `tests/WordBudget.Tests.ps1` (tope de `sdd-upgrade`), `tests/headless/lib.sh`, la batería de `sdd-archive`, la de `using-sdd` (`u1` y su molde con migraciones pendientes), `cli/test/capability/check.test.ts`.
- `.docs/sdd/constitution.md` (Art. V), `.docs/sdd/mission.md` (glosario), `.docs/sdd/architecture.md` (árbol), `.docs/sdd/tech-stack.md` (línea del aviso), `README.md`.

**NO se tocan**:

- El texto de los `vX.Y.Z.md`: describen versiones pasadas.
- `.docs/workflow/usage-guide.md`: la 0152.
- Specs, tickets, releases, changelog, roadmap fuera del cierre, campañas `tests/*.md` viejas y la ADR 0007: historia.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una referencia a la ruta vieja queda viva | media | una skill manda a una carpeta que no existe | `git grep` final de la Task 3, sin salida |
| El RED de `o1` sale limpio: el agente ya ofrece con el aviso viejo | baja | la orden sobra | Art. I: se reencuadra y se vuelve a pedir la aprobación |
| La orden de ofrecer tapa la petición | media | el usuario pierde lo que pidió | `o1` y `o2` miden que atiende la petición |

### 1.8 Rollout

Directo: entra en `develop` y sale con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd upgrade` y los menores de `sdd init`

**Tras**: —
**Modelo**: Native, la sesión (Opus 5.5, effort de la sesión)
**Tests RED**: hilo principal, TDD · `cli/test/upgrade/upgrade.test.ts`, `cli/test/init/*.test.ts`
**Superficies**: tooling
**Verificación**: `moon run cli:typecheck cli:test`
**Se prueba en la aplicación**: no, porque es la base común de la Task 3: la skill la nombra.

**Interfaces**:
- Consume: `readText` (`cli/src/cli/files.ts`, quita el BOM), `UsageError`/`DomainError` y `requiredOption`/`text` (`cli/src/cli/args.ts`), `isRecord` (`cli/src/cli/records.ts`), el patrón de `cli/src/init/run.ts` (`parseJson`, escribir con `\n` final).
- Produce: `runUpgrade(options: UpgradeOptions, io: Io): number` con `interface UpgradeOptions { root: string; migrationsDir: string; today: string; mark: string | null }`; `upgradeVerb` (`noun: 'upgrade'`, opciones `root`, `mark`); `localDay(date: Date): string` (`AAAA-MM-DD` con la fecha local).

**Ficheros**: crear `cli/src/upgrade/run.ts`, `cli/src/upgrade/verbs.ts`, `cli/src/cli/dates.ts`, `cli/test/upgrade/upgrade.test.ts`; modificar `cli/src/cli/verbs.ts`, `cli/src/init/settings.ts`, `cli/src/init/verbs.ts`, `cli/src/init/run.ts` y sus tests.

- [ ] **Step 1: Tests RED de `sdd upgrade`** — kit de juguete con `v0.9.0.md`, `v0.10.0.md`, `v2.3.1.md`, `v2.3.2.md` y `notes.md`, llamando a `runUpgrade` con `memoryIo()`:
  - `lists pending migrations in semver order`: marcador `0.9.0` → `io.stdout` = las rutas absolutas de `v0.10.0.md`, `v2.3.1.md`, `v2.3.2.md`, en ese orden; código 0.
  - `says up to date`: marcador `2.3.2` → `['el proyecto ya está al día con el kit 2.3.2']`, 0.
  - `lists all without a marker`: sin `sdd-kit.json` (y otro con `{"ids":{}}`) → primera línea `sin sdd-kit.json: se aplican todas` y las cuatro rutas; 0.
  - `refuses an init in progress`: `{"init":{}}` → `init en curso: sigue con sdd-init`, 1, con y sin `mark`.
  - `refuses a broken marker`: `{` → `.docs/sdd/sdd-kit.json no es JSON válido: no se toca`, 1.
  - `reads a marker with BOM`, `ignores files that are not vX.Y.Z.md`.
  - `marks a version`: `{"version":"2.3.1","channel":"plugin","updated":"2026-10-01","ids":{"mode":"sequence"}}`, `mark: '2.3.2'`, `today: '2026-10-18'` → el JSON queda `{"version":"2.3.2","channel":"plugin","updated":"2026-10-18","ids":{"mode":"sequence"}}`, salida `.docs/sdd/sdd-kit.json: actualizado`, 0.
  - `marks a version that has its file`: `--mark` mayor que la última del listado pero con su fichero → 0.
  - `refuses a version without migration`: `2.9.9` → lanza `UsageError('--mark 2.9.9: el kit no trae esa migración')`; el fichero no cambia.
  - `refuses marking backwards`: `2.3.1` con marcador `2.3.1` → `--mark 2.3.1: el proyecto ya está en 2.3.1`, 1, sin escribir.
  - Por el verbo (`run([...], memoryIo())` de `cli/src/main.ts`): `--mark` sin valor, `--mark 2.x`, `--mark ../x`, `--foo` y `--root <no existe>` → 2, el uso en stderr, `sdd-kit.json` sin cambios.
- [ ] **Step 2: Tests RED de los menores** — `localDay(new Date(2026, 9, 18, 0, 30))` → `'2026-10-18'`; `sdd init --finish --ignore ' .auth/'` y `--ignore $'a\nb'` → 2; un `.claude/settings.json` = `[]` → `--finish` sale con 1 y no escribe; `kitVersion` con un `plugin.json` con BOM (extraer `kitVersion(file)` para probarlo con una ruta temporal).
- [ ] **Step 3: Implementación** — `cli/src/upgrade/run.ts`: `pendingMigrations(dir, from: string | null): string[]` (filtra `/^v(\d+)\.(\d+)\.(\d+)\.md$/`, ordena por los tres números, devuelve rutas absolutas posteriores a `from`); `readMarker(root)` (lanza `DomainError` para JSON roto); `markVersion(...)` con `localDay`. `cli/src/upgrade/verbs.ts`: `migrationsDir = fileURLToPath(new URL('../../../skills/sdd-upgrade/references/migrations', import.meta.url))`, `today = localDay(new Date())`, valida `mark` con `/^\d+\.\d+\.\d+$/` (si no, `UsageError`). Registro en `VERBS` tras `initVerb`. `mergeNode` a 3 parámetros (las `notes` en el valor devuelto o en un objeto de contexto); fuera el `as Record<string, unknown>` de `parseConfig`; `validateIgnore` rechaza `path !== path.trim()` y `/[\r\n]/`; `kitVersion` con `readText`; `initVerb` usa `localDay`.
- [ ] **Step 4: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 5: Verificación** — `moon run cli:test`. Esperado: verde, con los tests nuevos.
- [ ] **Step 6: Commit de la task** — `feat(cli): sdd upgrade lista las migraciones pendientes y escribe el marcador`.

### Task 2 — El hook ofrece la migración

**Tras**: Task 1
**Modelo**: Native, la sesión (Opus 5.5, effort de la sesión)
**Tests RED**: hilo principal, TDD · `cli/test/hook/session-start.test.ts`
**Superficies**: tooling
**Verificación**: `moon run cli:typecheck cli:test`
**Se prueba en la aplicación**: no, porque la conducta del agente con la orden la mide la Task 3 con sujetos.

**Interfaces**:
- Consume: nada de la Task 1 (el hook no importa la CLI: corre en Node viejo y debe avisar).
- Produce: `sessionStartOutput(projectDir, pluginRoot, nodeVersion)` igual que hoy, con la carpeta `skills/sdd-upgrade/references/migrations` y el texto nuevo.

**Ficheros**: modificar `cli/bin/session-start.js`, `cli/test/hook/session-start.test.ts`, `cli/test/fixtures/hook/*.json` y mover `cli/test/fixtures/hook/plugin/skills/sdd-init/references/migrations` a `…/sdd-upgrade/references/migrations`.

- [ ] **Step 1: Tests RED** — `pending-migration.json` regenerado con el aviso y la orden exactos de las Restricciones globales (`systemMessage` = el aviso; `additionalContext` = aviso + `\n\n` + orden + `\n\n` + `using-sdd`); `orders migrations by semver`: un plugin temporal con `v0.9.0.md` y `v0.10.0.md` y el marcador `0.9.0` → `systemMessage` contiene `hasta la 0.10.0`; `shows both warnings`: plugin `2.0.0` con migraciones hasta `2.2.0` y marcador `2.1.0` → el aviso de versión, `\n\n`, el de migraciones, en ese orden; `ignores non-semver migration names`: `vNEXT.md` no cuenta; `old node keeps the migration warning` sigue pasando con el texto nuevo; la orden no aparece en `systemMessage`.
- [ ] **Step 2: Implementación** — `latestMigration` filtra `/^v\d+\.\d+\.\d+\.md$/`; la ruta pasa a `skills/sdd-upgrade/references/migrations`; `versionWarnings` devuelve los avisos y `sessionStartOutput` añade la orden al contexto solo si hay aviso de migraciones.
- [ ] **Step 3: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 4: Verificación** — `moon run cli:test`. Esperado: verde.
- [ ] **Step 5: Commit de la task** — `feat(hook): el arranque ofrece migrar con sdd-upgrade y ordena las migraciones por SemVer`.

### Task 3 — La skill `sdd-upgrade`

**Tras**: Task 2
**Modelo**: Native, la sesión (Opus 5.5, effort de la sesión); sujetos, `claude -p` con `sonnet` desde `tests/headless/battery.sh`
**Tests RED**: hilo principal · campaña RED de `o1` (n = 2), `u1` (n = 1) y `m2` (n = 2) sobre el kit de `git archive c04fc5c7`, antes de escribir `SKILL.md`; los Pester que cambian, en el commit de la task
**Superficies**: docs (skills) · tooling (tests, baterías)
**Verificación**: `moon run kit:test`; las baterías: `BATTERY=sdd-upgrade tests/headless/battery.sh`, `BATTERY=using-sdd STEPS=sdd-init,sdd-upgrade tests/headless/battery.sh`, `BATTERY=sdd-init STEPS=resume tests/headless/battery.sh`
**Verificación lenta**: la campaña de sujetos, ~100 min en total, en segundo plano
**Se prueba en la aplicación**: sí: en un proyecto con el marcador en `2.3.3`, «Mete un filtro por sala en el comando libres.» recibe primero la pregunta de migrar hasta la 2.3.4; con «sí», `sdd-kit.json` queda en `2.3.4` con su commit `chore(sdd): migrar al kit v2.3.4` y después se atiende el filtro.

**Interfaces**:
- Consume: `sdd upgrade --root <raíz>` y `sdd upgrade --root <raíz> --mark <versión>` (Task 1), con sus literales; la orden del hook (Task 2).
- Produce: la skill `sdd-kit:sdd-upgrade`, la carpeta `skills/sdd-upgrade/references/migrations/`.

**Ficheros**: crear `skills/sdd-upgrade/SKILL.md`, `tests/batteries/sdd-upgrade/{battery.md,subject.sh,mold-*/}`, `tests/sdd-upgrade-red.md`, `tests/sdd-upgrade-green.md`; mover `skills/sdd-init/references/migrations/` (sin `README.md`); modificar `skills/sdd-init/SKILL.md`, `skills/using-sdd/SKILL.md`, `skills/sdd-archive/SKILL.md`, `skills/sdd-end-release/SKILL.md`, los Pester de la ruta, `tests/MigrationInitParity.Tests.ps1`, `tests/WordBudget.Tests.ps1`, `tests/headless/lib.sh`, `tests/batteries/sdd-archive/{subject.sh,battery.md}`, `tests/batteries/using-sdd/{battery.md,subject.sh}`, `tests/batteries/sdd-init/battery.md` si su rúbrica nombra la ruta, `cli/test/capability/check.test.ts`, `.docs/sdd/{constitution,mission,architecture,tech-stack}.md`, `README.md`.

- [ ] **Step 1: Molde y RED** — batería `sdd-upgrade` con el molde `salas` (de `tests/batteries/using-sdd/mold-salas/`) y el marcador en `2.3.3`; `m2` añade a la copia del kit `skills/sdd-init/references/migrations/v9.9.9.md` (RED) o `skills/sdd-upgrade/references/migrations/v9.9.9.md` (GREEN) con el paso sin marca «borra `.docs/sdd/legacy.md`», el molde lleva `legacy.md` y el marcador en `9.9.8`. `u1` en la batería de `using-sdd` con el marcador `2.3.3`. Rúbrica escrita antes del RED: `o1` falla si cambia algún fichero antes del «sí», si no pregunta antes de atender, o si tras el «no» no sigue con la petición; `o2` falla si con el «sí» no deja `version` `2.3.4` y su commit, o si no vuelve a la petición; `m1` falla si no usa `sdd upgrade --mark`, si cambia otro fichero o si no hay commit `chore(sdd): migrar al kit v2.3.4`; `m2` falla si `legacy.md` desaparece o si cambia el marcador; `u1` falla si la primera skill no es `sdd-kit:sdd-upgrade`. `DRY_RUN=1` de cada escenario; después el RED con `KIT_DIR` del `git archive`. Evidencia en `tests/sdd-upgrade-red.md`. Si un escenario sale limpio, se reencuadra con el dev-lead (Art. I).
- [ ] **Step 2: Mover la carpeta y las referencias** — `git mv skills/sdd-init/references/migrations skills/sdd-upgrade/references/migrations`; `git rm` de su `README.md`; cambia cada fichero de `git grep -l "sdd-init/references/migrations"`; `MigrationInitParity` lee la carpeta nueva y excluye `skills/sdd-upgrade/` de las fuentes de la init; test Vitest `lists the real kit migrations`: un proyecto temporal con el marcador `2.3.3` → `sdd upgrade --root` escribe la ruta de `skills/sdd-upgrade/references/migrations/v2.3.4.md`.
- [ ] **Step 3: `skills/sdd-upgrade/SKILL.md`** — frontmatter (`name: sdd-upgrade`; `description`: «Use when a project with .docs/sdd/sdd-kit.json asks to update to the loaded kit ("actualízame al kit", "ponme el proyecto al día"), or accepts the offer of the pending-migrations notice. Not for a new project or an init in progress (that is sdd-init).»); Overview (habla en el idioma del usuario; no migra sin el «sí»; no mueve contenido en bloque); pasos 1-5 del `README.md` traducidos, con `sdd upgrade` en el 1 y el 2 y `sdd upgrade --mark` en el 5, sin el canal `cli`; el paso del gate de un paso sin marca con su predicado y su regla ante conflicto; sin marcador, invocar `sdd-init` si la sesión no respondió la pregunta del predicado 4; «Al escribir una migración nueva»; red flags y racionalizaciones de la tabla de la decisión 19. Tope `sdd-upgrade = @{ SkillMd = 900; Total = 900 }`.
- [ ] **Step 4: `sdd-init` y `using-sdd`** — predicado 3: «**Initialized**: `.docs/sdd/sdd-kit.json` without `init` → invoke `sdd-upgrade` with `Skill`; don't migrate from here.»; predicado 4: con «anterior a la v0.2.0», invoca `sdd-upgrade`; `description` sin las frases de actualizar; el red flag de migrar con `init` sale (vive en `sdd-upgrade`). `using-sdd`: la fila de la decisión 16.
- [ ] **Step 5: Docs** — constitution Art. V (ruta), mission (glosario: «la ejecuta `sdd-upgrade`…»), architecture (árbol con `sdd-upgrade/SKILL.md (+ references/migrations/…)`), tech-stack (línea del aviso), `README.md` («Tras actualizar el kit, pide en el proyecto: «actualízame al kit»» o la oferta del arranque).
- [ ] **Step 6: GREEN** — `o1` (2), `o2` (1), `u1` (1), `m1` (1), `m2` (2), controles `i1`, `i2` y `n2` (4); REFACTOR de reserva en `o1` y `m2` (4). Evidencia en `tests/sdd-upgrade-green.md`. Si la campaña supera ~4,5 $, paro y decide el dev-lead.
- [ ] **Step 7: Verificación** — `moon run kit:test` verde; `git grep -n -I -e "sdd-init/references/migrations" -e "al día con sdd-init" -e "ponme el proyecto al día con" -- ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!.docs/sdd/releases' ':!.docs/sdd/changelog*.md' ':!.docs/sdd/roadmap.md' ':!.docs/sdd/decisions' ':!.docs/workflow' ':!tests/*.md' ':!skills/sdd-upgrade/references/migrations'` sin salida.
- [ ] **Step 8: Commit de la task** — `feat(sdd-upgrade): la migración sale de sdd-init a su propia skill`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Base de la estimación: 3 tasks; la 0156 (una skill que fundía dos, `sdd init`, 15 sujetos) estimó 4 h y tardó 2,13 h; aquí hay menos texto de skill y más campaña (20 sujetos) y un traslado con muchas referencias
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, una vez y al cerrar (patch 0183).
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `migration` · Cada release lleva su migración (ruta nueva) → Task 3, Step 2 (`MigrationInitParity`, la versión de `plugin.json` con su fichero). ✓
- `migration` · Una migración sin cambios solo avanza el marcador → Task 1 (`marks a version`), Task 3 (`m1`). ✓
- `migration` · La sesión avisa… (aviso, orden, SemVer, dos avisos, sin aviso) → Task 2. ✓
- `migration` · El agente ofrece la migración… (no, sí, «actualízame», `unattended`) → Task 3 (`o1`, `o2`, `u1`); `unattended`, sin sujeto (spec, decisión 18), lo fija el texto de la orden en Task 2. ✓
- `migration` · Un proyecto ya inicializado se migra… → Task 1 (al día, init en curso, sin marcador), Task 3 (skill, `sdd-init` enruta; control `n2`). ✓
- `migration` · Un paso que borra o reestructura pregunta antes… → Task 3 (`m2`). ✓
- `migration` · Lo que escribe una migración lo reciben también las init → Task 3, Step 2 (`MigrationInitParity`). ✓
- `migration` · Reglas (Dónde viven, Avisos, Regla ante conflicto) → Tasks 1-3. ✓
- `cli` · La CLI se ejecuta con Node… (`upgrade` en `--help`) → Task 1 (registro en `VERBS`; el test de `--help` existente). ✓
- `cli` · El hook de sesión es un verbo de la CLI → Task 2. ✓
- `cli` · `sdd upgrade` lista… / `--mark` / uso mal formado → Task 1. ✓
- `cli` · Reglas (`--ignore`, avisos, conflicto) → Task 1. ✓
- `routing` · El router solo existe donde hay SDD / Ponerse al día entra por `sdd-upgrade` → Task 3 (`using-sdd`, `u1`). ✓
- `archive` · Un hotfix se cierra… (ruta) → Task 3, Step 2 (`sdd-archive`, su batería). ✓
- Review Focus → Task 1 y Task 2, con los tests que nombra. ✓
- Escenarios cubiertos por tasks: comprobado en `delegate`, sin gate del plan.
