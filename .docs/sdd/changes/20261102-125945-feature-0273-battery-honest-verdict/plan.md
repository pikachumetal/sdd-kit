---
id: 20261102-125945-feature-0273-battery-honest-verdict
feature: 0273
title: Plan de implementación — battery.mjs dice lo que de verdad comprobó
spec: ./spec.md
status: draft
created: 2026-11-02
---

# Plan de implementación — battery.mjs dice lo que de verdad comprobó

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: la sesión en las tres tasks (Native); la revisión final, con los ejes de `sdd-verify`.
2. `compileCheck` pasa a devolver `fails({ label, text }, read)`: la comprobación `file:` necesita la etiqueta, la carpeta de salida y el fs; `tools:` ignora lo que no usa.
3. `readChecks` devuelve `{ checks, unread }`: las máquina y las filas en prosa, cada una con su `covers(id)`. Un solo sitio clasifica las filas.
4. Coste estimado: 1,5 h; sin sujetos, 0 $ salvo la revisión final.
5. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: que la salida de `battery.mjs` y `run.mjs` diga lo que de verdad comprobó.

**Architecture**: `verdict` clasifica las filas de la rúbrica en máquina y prosa, y matiza el `verde`. `runCampaign` recuerda lo lanzado en esta ejecución y mira su `tools.txt` al acabar. Sin módulos nuevos.

**Tech Stack**: Node (`.mjs`), Vitest con `memoryFs`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks pequeñas casi independientes, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — sin módulo, dependencia ni datos; solo cambia salida y código de dos scripts de prueba.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code y umbrales.
- Comentarios en español; explican el porqué.
- Un rojo sigue saliendo con 1; `puerta verde`, con 0; falta de evidencia, con 3.
- Ninguna `battery.md` cambia.

### De proceso

- Native, sin subagentes salvo la revisión final.
- Commits: tipo/scope en inglés, título y cuerpo en castellano.

## Review Focus

- Fichero `file:` con CRLF → `$` y `^` casan igual que con LF · Task 1, `file: casa una línea con CRLF`.
- Una fila que no cubre el escenario pedido no lo marca: `k2` no nombra una fila solo de `k1` · Task 1, `nombra solo las filas que cubren el escenario`.
- Un sujeto reintentado: etiqueta `ya existe` sin lanzar junto a otra lanzada con RESULTADO → devuelve 0, porque sí midió · Task 2, `una etiqueta ya existente no cuenta como sin RESULTADO`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin tipos nuevos ni opciones.
- [x] **YAGNI gate**: sin `ausente` en `file:`.
- [x] **Brownfield gate**: los códigos existentes no cambian; sin refactor fuera de scope.
- [x] **Constitution check**: Art. X en las restricciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `tests/headless/battery.mjs` — veredicto, `file:`, sin escenarios, cabecera.
- `tests/headless/campaign.mjs` — código de `runCampaign`.
- `tests/headless/run.mjs` — cabecera.
- `cli/test/kit/headless/battery.test.ts`, `campaign.test.ts` — tests.
- `.docs/sdd/tech-stack.md` — líneas 108, 110, 125 y 149.

**NO se tocan**:

- `tests/batteries/*/battery.md` — decisión 12 de la spec.
- `tests/headless/lib.mjs` — `s.keep` ya deja el fichero donde se lee.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una celda real se toma por mal escrita | Baja | `verdict` rompe una batería | Test sobre las 15 `battery.md` reales |
| Tests con batería real que esperaban `verde` | Media | Rojo en la suite | Se ajustan en la Task 1; están en el Scope |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `puerta verde` y la fila `file:`

**Tras**: —
**Modelo**: la sesión; effort: no aplica el despacho, Native.
**Tests RED**: TDD del propio hilo, en `cli/test/kit/headless/battery.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/battery.test.ts` → `Tests  N passed (N)`

**Interfaces**:
- Consume: nada.
- Produce: líneas `<id> · <p>/<n> · umbral <u> · puerta verde · sin leer: <filas>`; fila `` `file: <fichero> /<regex>/` ``.

**Ficheros**: modificar `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`

- [ ] **Step 1: Implementación** —
  - `compileCheck(cell)` reconoce `` /^`file: ([^\s`]+) \/(.+)\/`$/ ``; un nombre con `/` o `\` lanza `SyntaxError`, y por tanto `<id>: comprobación mal escrita`. La regex se compila con flag `m`, con `\|` → `|`. Falla si el fichero `join(outDir, label, nombre)` no existe o no casa; el texto se lee con `\r\n` → `\n`.
  - `readChecks` trata como máquina las celdas que empiezan por `` `tools: `` o `` `file: ``, y devuelve el resto como prosa.
  - `proseCovers(cell, id, known)`: `todos` → todos; `todos menos …` → todos menos los ids conocidos nombrados; si no, ids conocidos de la celda partida por `/[^\w-]+/`; sin ninguno, todos.
  - `judge`: si el estado es `verde` y hay filas en prosa que cubren el escenario, escribe `puerta verde · sin leer: <ids>` con el primer token de «Fila».
  - `verdict`: `red` sigue con `includes('· rojo')`; `puerta verde` no lo activa.
- Tests, con el helper `withRubric`:
  - `puerta verde y nombra sus filas`: `` `| J1 Juicio | k1 | `tools.txt` tiene `x` |` `` → `'k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: J1'`, y `red` falso.
  - `solo tools y file da verde`: → `'k1 · 2/2 · umbral 2/2 · verde'`.
  - `file: la línea solo en el chat da rojo`: `k1-1/walkthrough.md` con la línea; `k1-2` sin el fichero y la línea en `tools.txt` → `'k1 · 1/2 · umbral 2/2 · rojo · R1 falla en k1-2'`.
  - `file: casa una línea con CRLF`.
  - `file: con barras es mal escrita`: `toThrow(new BatteryError('K6: comprobación mal escrita'))`.
  - `todos menos`: `k1` puerta verde y `k2` verde; `Escenarios sin ids`: `ver arriba` → los dos puerta verde.
  - `nombra solo las filas que cubren el escenario`.
  - `verdict sobre las 15 baterías reales no lanza`.
  - Se actualiza `deja a mano las filas de juicio` y lo que afirme `verde` con batería real.
- [ ] **Step 2: Build** — no hay build; `moon run cli:typecheck`, verde.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(headless): …`.

### Task 2 — Una campaña que no midió nada sale con 3

**Tras**: Task 1
**Modelo**: la sesión; effort: no aplica el despacho, Native.
**Tests RED**: TDD del propio hilo, en `campaign.test.ts` y `battery.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless` → `Tests  N passed (N)`

**Interfaces**:
- Consume: nada.
- Produce: `runCampaign` devuelve 0 o 3; `battery.mjs run` y `verdict` devuelven 3 sin escenarios.

**Ficheros**: modificar `tests/headless/campaign.mjs`, `tests/headless/battery.mjs`, sus tests.

- [ ] **Step 1: Implementación** —
  - `runCampaign` guarda las etiquetas lanzadas. Tras `Promise.all`, `measuredCode(config, deps, launched, planned)`: sin lanzadas, `deps.log('sin sujetos: a-1, b-1')` con las planeadas de `config.scenarios` y devuelve 3; con lanzadas sin `RESULTADO` o sin `tools.txt`, `deps.log('sin RESULTADO: a-1')` y 3; si no, 0. Sale antes de `finalReport`, que sigue corriendo.
  - `verdict`, con `selectSteps` vacío: `lines` vacío; `exitCode` devuelve 3 con `lines.length === 0`; `runBattery` y el verbo `verdict` escriben `sin escenarios en <tabla>`.
- Tests:
  - `devuelve 3 y nombra las etiquetas sin ningún sujeto`: `RUNS_DIR/stop` y `SCENARIOS='a'` → 3 y log `sin sujetos: a-1`.
  - `devuelve 3 y nombra la etiqueta sin RESULTADO`: `tools.txt` sin RESULTADO → `sin RESULTADO: a-1`; `sin tools.txt` igual.
  - `devuelve 0 con todos con RESULTADO`.
  - `una etiqueta ya existente no cuenta como sin RESULTADO`.
  - `battery run sin escenarios sale con 3 y lo dice`.
- [ ] **Step 2: Build** — `moon run cli:typecheck`, verde.
- [ ] **Step 3: Verificación** — el comando de «Verificación», también `run.test.ts`.
- [ ] **Step 4: Commit de la task** — `feat(headless): …`.

### Task 3 — Cabeceras y `tech-stack.md`

**Tras**: Task 2
**Modelo**: la sesión; effort: no aplica el despacho, Native.
**Tests RED**: TDD del propio hilo, en `battery.test.ts`.
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless test/kit/word-budget.test.ts` → `Tests  N passed (N)`

**Interfaces**:
- Consume: los textos y códigos de las Tasks 1 y 2.
- Produce: nada.

**Ficheros**: modificar `tests/headless/battery.mjs`, `tests/headless/run.mjs`, `.docs/sdd/tech-stack.md`, `cli/test/kit/headless/battery.test.ts`

- [ ] **Step 1: Implementación** —
  - Cabecera de `battery.mjs`: el verbo `verdict` dice `verde|puerta verde|rojo|sin evidencia`; qué significa `puerta verde` y que sale con 0; la fila `file:`, que falla si el fichero o la línea faltan; y las tres frases: `KIT_DIR` sale de `git archive <commit> skills .claude-plugin agents cli hooks`, sin `.docs/` ni `tests/`; `SUBJECT_CAP` acumula entre fases de `SPEC_DIR`; el id de un escenario choca dentro de una fase (`ya existe`), también entre baterías con el mismo `SPEC_DIR` y `PHASE`.
  - Cabecera de `run.mjs`: sale con 3 y nombra la etiqueta si no lanzó ningún sujeto o uno no dejó RESULTADO.
  - `tech-stack.md`: 108 (`puerta verde`, código), 110 (fila `file:`), 125 (`SPEC_DIR`), 149 (código 3).
  - Test `la cabecera nombra los tres tropiezos`: lee `battery.mjs`; `toContain` de `git archive`, `SUBJECT_CAP acumula` y `ya existe`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `docs(headless): …`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 3 tasks de un script ya cubierto por tests; patches 0260 y 0265 como referencia.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Prosa → `puerta verde · sin leer: J1`, salida 0 → Task 1, `puerta verde y nombra sus filas`. ✓
- Solo `tools:` y `file:` → `verde` → Task 1, `solo tools y file da verde`. ✓
- Línea solo en el chat → rojo → Task 1, `file: la línea solo en el chat da rojo`. ✓
- `file:` con barras → mal escrita → Task 1. ✓
- `todos menos` y celda sin ids → Task 1. ✓
- Rúbricas reales no rompen → Task 1. ✓
- `stop` → 3 y `sin sujetos: a-1` → Task 2. ✓
- Sin RESULTADO o sin `tools.txt` → 3 y `sin RESULTADO: a-1` → Task 2. ✓
- Todos con RESULTADO → 0 → Task 2. ✓
- Tabla vacía → 3 y `sin escenarios en <tabla>` → Task 2. ✓
- Cabecera → Task 3, `la cabecera nombra los tres tropiezos`. ✓
- Review Focus → Task 1 y Task 2, sus tests. ✓
