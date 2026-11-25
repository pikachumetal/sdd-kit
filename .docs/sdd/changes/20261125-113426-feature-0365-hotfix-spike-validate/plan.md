---
id: 20261125-113426-feature-0365-hotfix-spike-validate
feature: 0365
title: Plan de implementación — El hotfix y el spike también validan en sdd-validate
spec: ./spec.md
status: approved
created: 2026-11-25
---

# Plan de implementación — El hotfix y el spike también validan en sdd-validate

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión hace las tres tasks — son ediciones de texto de skills y de moldes con el texto ya fijado en la spec; la revisión final va con el modelo de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native (ver la línea `Ejecución`).
3. El molde `salas-hotfix` que ya existe en `tests/batteries/sdd-archive/subject.mjs` (escenario `a4` de `sdd-archive`) llega sin validar: con el cambio, `sdd-archive` lo devolvería a `sdd-validate` y `a4` dejaría de medir la fusión del hotfix. Gana `recordValidation0008()`, y `vf8` usa un molde nuevo, `salas-hotfix-open` (`done0008(true)` sin validar): la spec lo llamaba `salas-hotfix` (decisión 10), y el nombre ya estaba cogido.
4. `vf8` lleva en «Esperado» `sdd-kit:sdd-implement`, porque entra por ahí (decisión 10 de la spec).
5. La evidencia RED y GREEN va en `tests/sdd-validate-0365-red.md` y `tests/sdd-validate-0365-green.md`, como `tests/sdd-propose-0185-green.md`.
6. Riesgo alto: un sujeto del spike puede medir O2 él mismo dentro de `sdd-validate` en vez de abrir una task: la rúbrica `VF9` lo cuenta como fallo («la task de O2»), y la regla nueva dice «its task».
7. Coste: ~1 h de sesión y ~14,8 $ de sujetos (previsión de la spec).
- Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: que el hotfix y el spike validen en `sdd-validate`, y que `sdd-archive` solo compruebe la línea registrada.

**Architecture**: dos líneas nuevas en `skills/sdd-validate/SKILL.md` («Order» y «A failure goes back») y la excepción quitada en cuatro sitios (`validation-modes.md:3`, `sdd-archive` paso 1, `closing-suite.md:7`, `patch-flow.md` paso 7). La batería de `sdd-validate` gana `vf8` y `vf9` con sus moldes en el `subject.mjs` compartido de `sdd-archive`.

**Tech Stack**: Markdown de skills, `moon run kit:build`, Vitest (`cli/test/kit/word-budget.test.ts`), baterías headless (`tests/headless/battery.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto encadenadas por la batería (la Task 1 la crea y las otras dos la ponen en verde), un error en la rama lo caza la batería de su task y el plan cabe en un contexto; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y moldes de batería: ni módulo, ni dependencia, ni contrato nuevo.

## Restricciones globales

### De código

- Skills en inglés; registros y mensajes al usuario en castellano (`Validación en campo:`, «Evidencia»).
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- Topes de `sdd-validate` en `cli/test/kit/word-budget.test.ts`: `skillMd: 765`, `total: 1847`.
- Texto literal de `skills/sdd-validate/SKILL.md`, «Order», en lugar de «A patch has no final review: 1, 2, 4, 5.»: «A patch, and a hotfix, has no final review: 1, 2, 4, 5. A spike: 1 only if a committed file outside its `changes/` folder changed since the `merge-base`; in 2, you check each objective's row of `research.md` against its evidence instead of a script; 3 with the Spec axis only.»
- Texto literal al final de «A failure goes back to `sdd-implement`»: «In a spike, its task carries «Evidencia» instead of a test, and only a row that doesn't hold fails: a `no medido` you can measure, an endurance table under 10 runs or without the worst load, a recommendation resting on an unmeasured row; `no cumple` and `no medido con una persona` are results.»

### De proceso

- Native; la revisión final en ejes, Spec opus+high y Código sonnet+high.
- Sujetos de batería en `sonnet`, por tandas, hasta `control.maxParallelAgents`.
- Commits con tipo y scope en inglés y título en castellano; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un spike sin `research.md` (las tasks acabaron sin escribirlo) → `sdd-validate` lo trata como filas sin evidencia y vuelve a `sdd-implement`, no pasa a `sdd-archive` · Task 2, la regla «only a row that doesn't hold fails» lo cubre; sin escenario propio.
- Un hotfix en `validation.mode: manual` → presenta el guion como un patch y espera al dev-lead · Task 3, igual que `vf5`/`g1` (patch manual); sin escenario propio.
- Un spike cuya rama toca `src/` (contra su propia regla) → corre el gate · Task 2, línea «Order»; declarado no probado en la spec.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas nuevas y cuatro frases quitadas.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: respeta la forma de «Order» (la línea del patch) y de la batería.
- [x] **Constitution check**: Art. XI (cada regla en su paso), word budget con decisión del dev-lead en la spec.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-validate-0365-red.md`, `tests/sdd-validate-0365-green.md` — evidencia de las tandas.

**Modificar**:

- `tests/batteries/sdd-archive/subject.mjs` — `salas-hotfix` con la validación registrada; moldes `salas-hotfix-open` y `reservas-spike`.
- `tests/batteries/sdd-archive/battery.md` — la descripción de `salas-hotfix` dice que llega validado.
- `tests/batteries/sdd-validate/battery.md` — moldes, `vf8`, `vf9` y las filas `VF8` y `VF9` de la rúbrica.
- `skills/sdd-validate/SKILL.md` — «Order» y «A failure goes back».
- `skills/sdd-validate/references/validation-modes.md` — línea 3: «Step 4 of `sdd-validate`.»
- `skills/sdd-archive/SKILL.md` — paso 1 sin la frase del hotfix y el spike.
- `skills/sdd-archive/references/closing-suite.md` — línea 7 sin el paréntesis.
- `skills/sdd-implement/references/patch-flow.md` — paso 7 sin «a hotfix goes straight to `sdd-archive`, which validates it».
- `cli/test/kit/word-budget.test.ts` — topes de `sdd-validate`.

**NO se tocan**:

- `skills/sdd-implement/SKILL.md` — ya invoca `sdd-validate` tras la última task (línea 77).
- `skills/sdd-archive/references/merge-recipe.md` y el pre-check 5 — son de la fusión.
- `.docs/sdd/capabilities/` y la ADR — los escriben los borradores de `sdd-validate` y el cierre.

### 1.6 Dependencias

- La 0362 (fusionada): `sdd-validate` y su batería.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `vf9` pasa en RED porque el sujeto ya razona bien el spike | media | el RED no prueba nada | la rúbrica mira `tools.txt` (gate, `Agent` de ejes); si pasa en RED, se dice en la evidencia y se endurece el molde |
| `a4` cambia de comportamiento al llegar validado | baja | control roto | se corre `a4` como control en la Task 3 |

### 1.8 Rollout

Directo: sale con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Los escenarios `vf8` y `vf9`, en rojo sobre las skills de hoy

**Tras**: —
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: hilo principal · `vf8` y `vf9` de `tests/batteries/sdd-validate/battery.md`, `N=2`, sobre las skills de la base; esperado: rojo.
**Superficies**: tooling (batería)
**Verificación**: `SCENARIOS="vf8 vf9" N=2 BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` → cada sujeto puntuado contra `VF8` o `VF9`; esperado: al menos un fallo por escenario.
**Verificación lenta**: la misma línea, ~15 min.

**Interfaces**:
- Consume: `done0008(hotfix)`, `recordValidation0008()`, `moldReservas()`, `branch()`, `s.put()`, `s.commit()` de `tests/batteries/sdd-archive/subject.mjs`.
- Produce: moldes `salas-hotfix-open` y `reservas-spike`; escenarios `vf8`, `vf9`; filas `VF8`, `VF9`.

**Ficheros**: modificar `tests/batteries/sdd-archive/subject.mjs`, `tests/batteries/sdd-archive/battery.md`, `tests/batteries/sdd-validate/battery.md`; crear `tests/sdd-validate-0365-red.md`.

- [ ] **Step 1: Moldes** — en la tabla de moldes de `subject.mjs`:
  - `'salas-hotfix'`: añade `recordValidation0008()` tras `done0008(true)`; `battery.md` de `sdd-archive`, línea 61: «…salida de `main`, con la validación en campo ya registrada en `patch.md` §4, y una carpeta…».
  - `'salas-hotfix-open': () => done0008(true)`.
  - `'reservas-spike': () => doneSpike0030()`, función nueva `doneSpike0030()`: `moldReservas()`; `branch('feature/0030-libres-load')`; en `.docs/sdd/changes/20261125-090000-feature-0030-libres-load/`: `spec.md` (`mode: spike`, `status: approved`, «Capacidades: Ninguna, porque investigación», objetivos O1 «`libres` con 1.000 reservas < 200 ms», O2 «memoria < 50 MB», O3 «un recepcionista encuentra la sala libre en < 10 s»), `plan.md` (`**Ejecución**: native`, dos tasks con «Evidencia»), `medidas/medir-libres.mjs`, `medidas/o1-libres.txt` (10 repeticiones con la peor carga, media 340 ms), `research.md` calcado de `research-template.md` con O1 `no cumple tal como se definió` (evidencia `medidas/o1-libres.txt`), O2 `no medido` sin fichero y O3 `no medido con una persona`, y recomendación «no seguir con `libres` en memoria: O1 no cumple»; `tasks.md` con las dos tasks `done`, sin línea `Revisión final:`; un commit por task. Cada `s.put` comprobado con `s.die` si no queda escrito, como `rows0008()`.
- [ ] **Step 2: Escenarios y rúbrica** en `tests/batteries/sdd-validate/battery.md`: moldes `salas-hotfix-open` y `reservas-spike` en «Moldes»; filas:
  - `| vf8 | validation-hotfix | Invoca la skill sdd-kit:sdd-implement y sigue. Retoma el hotfix 0008: el fix está commiteado. | salas-hotfix-open | \`sdd-kit:sdd-implement\` | 2 | 2/2 | sonnet | feature 0365: el hotfix valida en \`sdd-validate\` como un patch, sin revisión final (dev-lead, 2026-11-25: «vale pues hay que arreglarlo joder») |`
  - `| vf9 | validation-spike | Invoca la skill sdd-kit:sdd-validate y sigue. Las tasks del spike 0030 están acabadas y commiteadas: valídalo. | reservas-spike | \`sdd-kit:sdd-validate\` | 2 | 2/2 | sonnet | feature 0365: el spike valida su evidencia; vuelve una fila sin medir, no un umbral (dev-lead, 2026-11-25: «1») |`
  - Rúbrica `VF8 Hotfix como patch` (vf8): falla si `tools.txt` invoca `sdd-archive` antes de escribir `Validación en campo:` en `patch.md` §4, si no corre el gate, o si hay una llamada a `Agent` de revisión final o de eje.
  - Rúbrica `VF9 Spike` (vf9): falla si `tools.txt` corre el gate, si hay una llamada a `Agent` con un eje que no es Spec, si invoca `sdd-archive` con O2 `no medido`, si el plan o `tasks.md` ganan una task por O1 o por O3, o si la task de O2 lleva «Tests RED» en vez de «Evidencia».
- [ ] **Step 3: RED** — la línea de «Verificación»; resultados, con la rúbrica fila a fila y la línea `suma:`, en `tests/sdd-validate-0365-red.md`.
- [ ] **Step 4: Commit de la task** — `test(sdd-validate): escenarios vf8 y vf9 del hotfix y el spike, en rojo`.

### Task 2 — El spike valida su evidencia en `sdd-validate`

**Tras**: Task 1
**Modelo**: Native: la sesión.
**Tests RED**: `vf9` de la Task 1 (rojo en la base).
**Superficies**: docs (skills), tooling
**Verificación**: `moon run kit:build` → sale con 0; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts` → `Tests  … passed`; `SCENARIOS="vf9" N=2 BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` → `VF9` 2/2.
**Verificación lenta**: la batería, ~8 min.

**Interfaces**:
- Consume: escenario `vf9` y molde `reservas-spike` (Task 1).
- Produce: la línea del spike en «Order» y su vuelta en «A failure goes back».

**Ficheros**: modificar `skills/sdd-validate/SKILL.md`, `skills/sdd-validate/references/validation-modes.md`, `cli/test/kit/word-budget.test.ts`; crear `tests/sdd-validate-0365-green.md`.

- [ ] **Step 1: Implementación** —
  - `skills/sdd-validate/SKILL.md`, «Order»: sustituye «A patch has no final review: 1, 2, 4, 5.» por «A patch, and a hotfix, has no final review: 1, 2, 4, 5. A spike: 1 only if a committed file outside its `changes/` folder changed since the `merge-base`; in 2, you check each objective's row of `research.md` against its evidence instead of a script; 3 with the Spec axis only.»
  - «A failure goes back to `sdd-implement`», al final del párrafo: «In a spike, its task carries «Evidencia» instead of a test, and only a row that doesn't hold fails: a `no medido` you can measure, an endurance table under 10 runs or without the worst load, a recommendation resting on an unmeasured row; `no cumple` and `no medido con una persona` are results.»
  - `validation-modes.md:3` → «Step 4 of `sdd-validate`.»
  - `word-budget.test.ts`: `'sdd-validate': { skillMd: 765, total: 1847 }`.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: 0.
- [ ] **Step 3: Verificación** — word budget en verde y `vf9` 2/2, en `tests/sdd-validate-0365-green.md`.
- [ ] **Step 4: Commit de la task** — `feat(sdd-validate): el spike valida su evidencia antes del cierre`.

### Task 3 — El hotfix valida como un patch y el cierre deja de validar

**Tras**: Task 2
**Modelo**: Native: la sesión.
**Tests RED**: `vf8` de la Task 1 (rojo en la base).
**Superficies**: docs (skills), tooling
**Verificación**: `moon run kit:build` → 0; `git grep -n "Hotfix only:\` and a spike" skills/` → sin salida; `SCENARIOS="vf8" N=2` y los controles `SCENARIOS="vf5 vf1" N=1` con `BATTERY=sdd-validate`, y `SCENARIOS="a4" N=1` con `BATTERY=sdd-archive` (`node tests/headless/battery.mjs run tests/batteries/<skill>/battery.md`) → `VF8` 2/2 y los controles en verde.
**Verificación lenta**: las tandas, ~15 min.

**Interfaces**:
- Consume: `vf8`, `salas-hotfix-open` y `salas-hotfix` validado (Task 1); la línea «A patch, and a hotfix…» (Task 2).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/closing-suite.md`, `skills/sdd-implement/references/patch-flow.md`, `tests/sdd-validate-0365-green.md`.

- [ ] **Step 1: Implementación** —
  - `skills/sdd-archive/SKILL.md` paso 1: borra «`Hotfix only:` and a spike don't go through `sdd-validate`: they validate here, as [validation-modes.md](../sdd-validate/references/validation-modes.md) says.»
  - `closing-suite.md:7`: borra « (a hotfix or a spike runs it in step 1 of `sdd-archive`)».
  - `patch-flow.md` paso 7: borra «; a hotfix goes straight to `sdd-archive`, which validates it».
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: 0.
- [ ] **Step 3: Verificación** — el `git grep` vacío, `vf8` 2/2 y los controles, añadidos a `tests/sdd-validate-0365-green.md`.
- [ ] **Step 4: Commit de la task** — `feat(sdd-archive): el cierre deja de validar el hotfix y el spike`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,5h
- Base de la estimación: 3 tasks de texto, la parte incierta es el molde del spike y lo que tarda cada tanda de sujetos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: el `git grep` vacío y `vf8`, `vf9` 2/2
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `validation` MODIFIED «`sdd-validate` valida antes…», AND nuevo (patch y hotfix sin revisión final; spike según su requisito) → Tasks 2 y 3, `VF8` y `VF9`. ✓
- Resto de cláusulas de ese requisito → sin cambio; los cubren `vf1`–`vf7`. ✓
- `validation` MODIFIED «Un fallo de la validación vuelve…», AND del spike (task con «Evidencia», gate solo fuera de su carpeta, vuelve a contrastar filas) → Task 2, `VF9` («la task de O2 lleva «Evidencia»»); el gate de la vuelta y el recontraste de las filas no se observan: el sujeto para al devolver O2. ⚠
- Hotfix: invoca `sdd-validate`, gate, guion, `Validación en campo:` en §4 antes de `sdd-archive` → Task 3, `VF8`. ✓
- Hotfix: sin revisión final ni ejes → Task 3, `VF8`. ✓
- Hotfix: un paso del guion que falla vuelve como task con test → por la regla del patch, sin escenario propio (el molde no falla). ⚠
- Hotfix: pre-check 5 y fusión a `main` siguen en `sdd-archive` → Task 1 y 3, control `a4`. ✓
- Spike: sin gate ni guion, contrasta filas → Task 2, `VF9`. ✓
- Spike: O2 vuelve como task con «Evidencia»; O1 y O3 no → Task 2, `VF9`. ✓
- Spike: tabla de aguante < 10 o recomendación sin medir también vuelven → texto de la regla; el molde no lo ejerce. ⚠
- Spike: revisión final solo con el eje Spec → Task 2, `VF9` (en el GREEN, tras medir O2, si el sujeto llega). ✓
- Spike: registra la línea de su modo y una fila por objetivo antes de `sdd-archive` → Task 2, `VF9` («invoca `sdd-archive` con O2 `no medido`»). ✓
- Spike: con un fichero fuera de su carpeta corre el gate → no probado (declarado en la spec). ⚠
- `validation` Límites → Task 2 (texto). ✓
- `archive` MODIFIED: `REMOVED` de la línea del hotfix y el spike; vuelven a `sdd-validate` sin línea → Task 3, `git grep`; no probado en batería (spec). ⚠
- `archive` Avisos «…vuelve a `sdd-validate`» → la escribe el cierre al fusionar el delta; la skill ya lo dice. ✓
- Tabla «Lo que se retira»: `sdd-archive/SKILL.md:27`, `validation-modes.md:3`, `patch-flow.md:24`, `closing-suite.md:7`, «A patch has no final review» → Tasks 2 y 3, `git grep` de cada frase en la Verificación de la Task 3. ✓
- ADR 0043 → la escribe el cierre (decisión 11 de la spec). ✓
- Review Focus (tres líneas) → Tasks 2 y 3, sin escenario propio. ✓
