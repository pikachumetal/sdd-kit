---
id: 20261026-172719-feature-0221-affected-closing-gate
feature: 0221
title: Plan de implementación — El gate de cierre corre solo lo afectado
spec: ./spec.md
status: draft
created: 2026-10-26
---

# Plan de implementación — El gate de cierre corre solo lo afectado

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: las cuatro las hace la sesión (Native); los sujetos headless, `sonnet` (método de `tech-stack.md`, «Baterías por skill»). Revisión final: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura no.
2. **Ejecución: native**, porque las cuatro tasks comparten el molde de la Task 1 y la regla de la línea `Gate:` de la Task 2, que citan las Tasks 3 y 4; un error en el texto lo caza su GREEN, y el plan cabe en un contexto.
3. **El gate filtrado de los moldes es un script, no moon**: `scripts/gate.mjs`, con los mismos flags que moon (`run <tareas> --affected --base <ref>`, `task <t>`), sus tareas e inputs en `gate.json`. Así no hace falta montar un workspace de moon en cada sujeto, y la salida es determinista. Riesgo: un sujeto razona sobre una herramienta que no conoce; se mitiga dándole `task <t>` (lo que en moon es `moon task`).
4. **RED de los cuatro escenarios de una vez, en la Task 1**, con la copia del kit de `develop` (`b999c87d`): un solo molde y una sola tanda de 4 sujetos (n = 1), en lugar de cuatro arranques.
5. **Los escenarios nuevos viven en la batería de `sdd-archive`** (`g5` base que solo trae un test, `g6` otra rama abierta y base por delante, `w2` línea base filtrada) y en la de `sdd-propose` (`k5` config con gate filtrado), con la procedencia de los tickets de la 0211, la 0220 y la 0223.
6. **Coste**: ~4,5 h de implementación (molde ~1 h, cuatro textos ~1,5 h, 12 sujetos ~2 h en tandas de 3), ~6 $ de sujetos.
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el cierre repite tras la base integrada solo las tareas del gate que lee lo que trajo, corre una sola suite si otra rama está abierta o la base va por delante, y toda línea `Gate:` nombra cada tarea.

**Architecture**: solo texto de skills y su prueba. Una regla en `sdd-verify` («Common Failures») y cuatro sitios que la aplican: `sdd-archive` pasos 1 y 6 con su receta, `sdd-start-feature` paso 7, `sdd-worktrees` Step 3 y el carril config de `sdd-propose`. Los moldes de prueba ganan un gate filtrado de juguete.

**Tech Stack**: Markdown (skills), Bash (`tests/batteries/*/subject.sh`), Node (`scripts/gate.mjs` del molde), sujetos headless con `tests/headless/battery.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las cuatro tasks se encadenan por el molde de la Task 1 y la regla de la Task 2, un error lo caza el GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y moldes de prueba; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral superado en una unidad, que es Minor.
- Las skills se escriben en inglés (Art. III); los textos que el agente escribe al usuario o en los registros (`Gate:`, `corrió`, `saltada`), en castellano, literales de la spec.
- Formato literal de la línea: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué>) ``; con la definición cambiada, `<tarea>: corrió <N>/<M> (sin filtro: cambia su definición)`; en la línea base, `<tarea>: saltada (fuera del Scope de la spec)`.
- Predicado de la suite única: `git worktree list` muestra otra rama `feature/*` o `patch/*`, o `git rev-list --count HEAD..<remote>/<merge.into>` > 0 tras `git fetch`.
- El texto de skills y referencias se edita con `Edit`, no con scripts de reemplazo (ticket del patch 0220 §4).

### De proceso

- Política de modelos de `sdd-implement`; `fable` y `opus xhigh` prohibidos.
- Sujetos por tandas de 3 (`control.maxParallelAgents`); un rojo no se relanza para sacar verde: se lee por qué.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- La base trae solo `.docs/**/*.md` y el gate filtrado tiene una tarea con inputs `**/*` → no corre nada y el merge lleva `--verified-at <sha de la validación>`, como dice la spec; el filtro de la herramienta no gana a la regla de solo docs · Task 3, rúbrica de `g5` fila G5c (el molde añade una fila del roadmap a la base)
- El gate filtrado sale con 0 y todas las tareas saltadas en el carril config, sin definición cambiada → se commitea con cada tarea `saltada (<porqué>)`, no se fuerza ninguna · Task 2, el párrafo de `sdd-verify` lo dice literal; sin sujeto propio (lo cubre la misma regla que `k5`)
- Línea base con un Scope que no casa con ninguna tarea (solo `.docs/`) → todas `saltada (fuera del Scope de la spec)` y lo dice, sin «Tests passing» · Task 4, rúbrica `w2` fila W2c (nota en el informe; sin sujeto propio: la cubre la misma regla)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: texto en los sitios que hoy deciden la suite; ningún verbo nuevo.
- [x] **YAGNI gate**: sin campo nuevo en §Testing; el predicado sale del comando.
- [x] **Brownfield gate**: un gate sin filtro de base sigue con la regla de hoy.
- [x] **Constitution check**: Art. I (RED/GREEN y coste en la spec), Art. II (predicados observables), Art. III, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-archive/fixtures/gate/gate.mjs` — el gate de juguete (se copia a `scripts/gate.mjs` del molde).
- `tests/affected-gate-red.md` y `tests/affected-gate-green.md` — evidencia RED y GREEN de los cuatro escenarios.

**Modificar**:

- `tests/batteries/sdd-archive/subject.sh` — función `affected_gate` y moldes `reservas-gate-base`, `reservas-gate-open`, `reservas-gate-plan`.
- `tests/batteries/sdd-archive/battery.md` — escenarios `g5`, `g6`, `w2`, moldes y rúbrica.
- `tests/batteries/sdd-propose/subject.sh` y `battery.md` — molde `reservas-gate` y escenario `k5`.
- `skills/sdd-verify/SKILL.md` — fila de «Common Failures» y párrafo de la línea `Gate:`.
- `skills/sdd-propose/SKILL.md` — §Config lane paso 4.
- `skills/sdd-templates/templates/walkthrough-template.md` — 4.1, la línea `Gate:`.
- `skills/sdd-archive/SKILL.md` — pasos 1 y 6.
- `skills/sdd-archive/references/merge-recipe.md` — «Integrated base», «The suite again».
- `skills/sdd-start-feature/SKILL.md` — paso 7, la suite de la validación.
- `skills/sdd-worktrees/SKILL.md` — Step 3, «Report» y Quick Reference.

**NO se tocan**:

- `moon.yml`, `cli/moon.yml`, `.docs/sdd/tech-stack.md` §Testing — el gate de este repo ya es el de la 0223.
- `cli/src/merge/` — `--verified-at` ya hace lo que hace falta.
- Los Pester de frases, salvo el que rompa una edición (spec, decisión 11).

### 1.6 Dependencias

- Feature 0223 (gate con `--affected --base develop`), ya en `develop`. En paralelo: 0226 y 0227 borran y portan Pester.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La 0226 borra o cambia `WordBudget.Tests.ps1` o `ArchiveSkill.Tests.ps1` antes de mi cierre | alta | bajo | el merge de sincronización trae lo suyo; mido los topes con el test que haya |
| El RED sale limpio en algún escenario | media | medio | se lee de dónde sacó la conducta; si fue de una fuente incidental, otra tanda; si no, la regla de ese escenario no se escribe (Art. I) |
| El script de juguete confunde al sujeto | baja | medio | `task <t>` y una salida calcada de moon («No tasks affected by changed files», «Tasks: N completed, M skipped») |

### 1.8 Rollout

Directo: entra en la próxima release del kit; la migración la escribe la release («sin cambios en el proyecto»).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde con gate filtrado y RED de los cuatro escenarios

**Tras**: —
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · los escenarios `g5`, `g6`, `w2` (batería `sdd-archive`) y `k5` (batería `sdd-propose`), con la copia del kit de `develop` (`b999c87d`), n = 1
**Superficies**: tooling
**Verificación**: `bash -n tests/batteries/sdd-archive/subject.sh tests/batteries/sdd-propose/subject.sh` → sin salida; `node tests/batteries/sdd-archive/fixtures/gate/gate.mjs` en un molde montado → las salidas de abajo; y `KIT_DIR=<copia de develop> PHASE=red BATTERY=sdd-archive STEPS=… tests/headless/battery.sh` para los cuatro
**Verificación lenta**: la tanda de 4 sujetos, ~40 min, en segundo plano

**Interfaces**:
- Consume: nada
- Produce: `scripts/gate.mjs` en el molde, con
  - `node scripts/gate.mjs run <t1> <t2>… [--affected --base <ref>]` — corre cada tarea (`command` de `gate.json`) y, con `--affected`, solo las que tienen algún fichero de `git diff --name-only <ref>...HEAD` dentro de sus `inputs` (globs); imprime por tarea `▪ <t> (<N> passed, <F> failed)` o `▪ <t> skipped`, y al final `Tasks: <c> completed, <s> skipped`; sin ninguna tarea afectada, `No tasks affected by changed files` y sale con 0; sale con 1 si alguna falla
  - `node scripts/gate.mjs task <t>` — imprime `Inputs:` y un glob por línea
  - `gate.json`: `bookings:test` (inputs `src/app.js`, `test/cancel.test.js`; `node --test test/cancel.test.js`) y `rooms:test` (inputs `src/rooms.js`, `test/rooms.test.js`; `node --test test/rooms.test.js`); `docs:check` (inputs `**/*`; `node -e "process.exit(0)"`), para el Review Focus
  - Gate de cierre del molde (`tech-stack.md` §Testing): `node scripts/gate.mjs run bookings:test rooms:test docs:check --affected --base develop`
- Moldes:
  - `reservas-gate-base` (`g5`): `reservas` + gate; la validación de la 0010 ya hecha en su paso 7: borradores sin commitear y «4.1 Builds» con el gate en verde sobre el último commit; `develop` avanza con la 0015, que solo cambia `test/rooms.test.js` y añade una fila del roadmap. Sin otra rama abierta.
  - `reservas-gate-open` (`g6`): `reservas` + gate + `develop_advances` + `other_worktree`, validación sin hacer; petición: «Invoca la skill sdd-kit:sdd-start-feature y sigue: la 0010 está implementada y su revisión final está limpia; valídala y ciérrala.»
  - `reservas-gate-plan` (`w2`): `reservas-plan` + gate; el Scope de la spec de la 0010 solo nombra `src/app.js` y `test/cancel.test.js`.
  - `reservas-gate` (`k5`, batería `sdd-propose`): el molde de `sdd-propose` + gate; petición: «config: añade `src/shared/**` a los inputs de `rooms:test` en `gate.json`».

**Ficheros**: crear `tests/batteries/sdd-archive/fixtures/gate/gate.mjs`, `tests/affected-gate-red.md`; modificar los `subject.sh` y `battery.md` de las dos baterías

- [ ] **Step 1: Implementación** — `gate.mjs` y los moldes; rúbrica en `battery.md`:
  - `g5`: G5a corre `gate.mjs run … --affected --base <sha de la validación>` (o equivalente que solo corre `rooms:test` y `docs:check`) y no el gate con `--base develop` ni sin filtro; G5b el 4.1 o el mensaje final llevan una entrada por tarea con `bookings:test: saltada (<porqué>)`; G5c `--verified-at` con el sha del merge de sincronización.
  - `g6`: G6a `tools.txt` no tiene ninguna ejecución de `gate.mjs run` antes del commit de cierre; G6b tiene exactamente una después de `sdd merge --sync`; G6c `Validación en campo:` y `--verified-at` llevan el sha del merge de sincronización.
  - `w2`: W2a la línea base no se da por buena con `No tasks affected by changed files`; W2b corre `bookings:test` sin `--affected`; W2c el informe nombra `rooms:test: saltada (fuera del Scope de la spec)`.
  - `k5`: K5a corre `rooms:test` sin filtro antes de commitear; K5b el cuerpo del commit lleva `Gate:` con una entrada por tarea (`corrió N/M` o `saltada (<porqué>)`), no `→ verde` ni solo el código de salida.
- [ ] **Step 2: Build** — `bash -n` de los dos `subject.sh`.
- [ ] **Step 3: Verificación** — monta cada molde a mano y comprueba las salidas de `gate.mjs`; lanza el RED (4 sujetos) y escribe `tests/affected-gate-red.md` con fila por rúbrica. Esperado: G5a, G6a/b, W2a, K5b fallan.
- [ ] **Step 4: Commit de la task**.

### Task 2 — La línea `Gate:` nombra cada tarea

**Tras**: Task 1
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: `k5` (Task 1)
**Superficies**: docs (skills)
**Verificación**: GREEN de `k5`, n = 2 → K5a y K5b 2/2; `Invoke-Pester -CI tests/WordBudget.Tests.ps1` → `Tests Passed`, 0 failed

**Interfaces**:
- Consume: el molde `reservas-gate` de la batería de `sdd-propose`
- Produce: en `sdd-verify` «Common Failures», la fila `| Filtered gate passes | Each task of the gate: ran N/M, or skipped with the reason the tool gives | Exit 0, «Tasks: n completed» |` y el párrafo «The `Gate:` line» con el formato literal, la regla de la definición cambiada y «a gate where the filter skipped every task is not green on its own». Las Tasks 3 y 4 lo citan como «the `Gate:` line of `sdd-verify`».

**Ficheros**: `skills/sdd-verify/SKILL.md`, `skills/sdd-propose/SKILL.md` (§Config lane paso 4: la línea pasa al formato por tarea, citando `sdd-verify`), `skills/sdd-templates/templates/walkthrough-template.md` (4.1: `Gate: … → <tarea>: corrió N/M · <tarea>: saltada (<porqué>)`)

- [ ] **Step 1: Implementación** — los tres textos, con el formato de «De código».
- [ ] **Step 2: Build** — n/a.
- [ ] **Step 3: Verificación** — GREEN de `k5` y topes.
- [ ] **Step 4: Commit de la task**.

### Task 3 — El cierre repite solo lo afectado y corre una sola suite

**Tras**: Task 2
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: `g5` y `g6` (Task 1)
**Superficies**: docs (skills)
**Verificación**: GREEN de `g5` y `g6`, n = 2 cada uno → G5a–c y G6a–c 2/2; control de `a3` y `a3n` (n = 1) sin regresión; `Invoke-Pester -CI tests/WordBudget.Tests.ps1 tests/ArchiveSkill.Tests.ps1` → 0 failed (si la 0226 ya los borró, lo dice)

**Interfaces**:
- Consume: «the `Gate:` line of `sdd-verify`» (Task 2)
- Produce: —

**Ficheros**: `skills/sdd-archive/SKILL.md` paso 1 (con el predicado, la suite no corre en la validación: la corre el paso 6), paso 6 (con un gate filtrado, repite el gate con su base en el sha de la última suite en verde; sin filtro, la regla de hoy; la línea `Gate:`); `skills/sdd-archive/references/merge-recipe.md` «The suite again» (la misma regla, y la suite única tras `--sync` como validación); `skills/sdd-start-feature/SKILL.md` paso 7 (con el predicado, el smoke por THEN sí y la suite no: la corre `sdd-archive` paso 6, y vale de validación)

- [ ] **Step 1: Implementación** — los tres textos; el paso 7 de `sdd-start-feature` lleva la frase en el paso que decide, no solo en la referencia (tech-stack: «Una regla que solo vive en una referencia no se lee»).
- [ ] **Step 2: Build** — n/a.
- [ ] **Step 3: Verificación** — GREEN y controles.
- [ ] **Step 4: Commit de la task**.

### Task 4 — La línea base con un gate filtrado corre las tareas del Scope

**Tras**: Task 2
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: `w2` (Task 1)
**Superficies**: docs (skills)
**Verificación**: GREEN de `w2`, n = 2 → W2a–c 2/2; control de `w1` (n = 1); `Invoke-Pester -CI tests/WordBudget.Tests.ps1` → 0 failed

**Interfaces**:
- Consume: «the `Gate:` line of `sdd-verify`» (Task 2)
- Produce: —

**Ficheros**: `skills/sdd-worktrees/SKILL.md` Step 3 (con un gate filtrado: sin el filtro, solo las tareas cuyos inputs, según la herramienta, incluyen ficheros del Scope de la spec; nunca «ready» con un gate que no corrió ninguna tarea), «Report» (la línea `Gate:` en lugar de `Tests passing (<N> tests, 0 failures)`), Quick Reference (una fila)

- [ ] **Step 1: Implementación** — el texto.
- [ ] **Step 2: Build** — n/a.
- [ ] **Step 3: Verificación** — GREEN y control.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 4,5 h
- Base de la estimación: 4 tasks, una de molde nuevo y 12 sujetos; referencia: patch 0220 (dos textos de skill con batería, 1,08 h) y feature 0211 (lite, 2,39 h)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- archive «…repite solo lo que afecta…» THEN (sync + gate con `--base <sha>`, corre una tarea y no la otra) → Task 3, `g5` G5a. ✓
- AND línea `Gate:` del 4.1 con la saltada → Task 3, `g5` G5b. ✓
- AND `--verified-at <sha del merge de sincronización>` → Task 3, `g5` G5c. ✓
- AND solo `.docs/sdd/roadmap.md` → nada y `--verified-at <validación>` → Review Focus 1; control `a3n`. ✓
- AND gate sin filtro → regla de hoy → control `a3` (molde `reservas`, `node --test`). ✓
- AND conflictos de `--sync` → control `a3`. ✓
- archive «…una sola vez, tras el merge de sincronización» THEN smoke sí, suite no antes del cierre → Task 3, `g6` G6a. ✓
- AND una sola ejecución tras `--sync` → `g6` G6b. ✓
- AND `Validación en campo:` y `--verified-at` con el sha del sync → `g6` G6c. ✓
- AND sin otra rama y base al día, como hasta ahora → control `a3n`. ✓
- AND en `manual`, guion igual y suite tras el sync → sin observar: no hay sujeto en `manual` con otra rama abierta (avisado: lo cubre el mismo texto del paso 1, sin marca de modo). ⚠
- Reglas «Límites» → la fusión del delta en el cierre (`sdd capability merge`). ✓
- feature-flow «El gate de cierre se ejecuta una vez», AND nuevo → Task 3, `g5` y `g6`. ✓
- feature-flow «…lo prepara `sdd-worktrees`», AND gate filtrado → Task 4, `w2` W2a–c; el resto, control `w1`. ✓
- verification «La línea `Gate:` nombra cada tarea» THEN corre sin `--affected` la tarea cuya definición cambia → Task 2, `k5` K5a. ✓
- AND la línea literal → `k5` K5b. ✓
- AND nunca `→ verde` → `k5` K5b. ✓
- AND la misma forma en 4.1, `patch.md` §4 y la baseline → `g5` G5b, `w2` W2c; `patch.md` §4 sin sujeto (lo cubre la regla única de `sdd-verify`). ⚠
- Lo que se retira (regla de la suite del paso 6 y de la receta, informe `Tests passing`) → Tasks 3 y 4, búsqueda de los literales viejos con `grep` antes del commit de cada task. ✓
- Review Focus 2 → Task 2, texto literal de `sdd-verify`, sin sujeto. ⚠
- Review Focus 3 → Task 4, `w2` W2c. ✓
