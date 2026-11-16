---
id: 20261109-102437-feature-0322-deviations-and-amendments
feature: 0322
title: Plan de implementación — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, implementa la sesión (Opus 5.5); sin implementadores. Sujetos con el modelo de cada escenario de la batería. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native (abajo).
3. **El tramo de no regresión va en la Task 3**, como su último paso, y no en una task aparte: corre cuando las tres frases están escritas, y es la verificación de todas. La spec prevé tres tasks.
4. **Los kits de los sujetos**: el de `develop` con `git archive develop:dist` en `.temp/k22d`; el de la rama, `moon run kit:build` y copia de `dist/` en `.temp/k22g` (`tech-stack.md`, «Entrega de la skill al sujeto»). `RUNS_DIR` en `.temp/r22`, ruta corta. `SPEC_DIR` es la carpeta de la spec, con `PHASE` por tanda (`red`, `green`, `refactor`, `tramo`, `control`).
5. **Riesgo alto**: los sujetos de los escenarios sin `Agent` se bloquean ante la frase nueva (spec, decisión 11). Lo mide la Task 3; un rojo nuevo se trata como hallazgo de la frase, no del molde.
6. **Coste estimado**: ~59 sujetos y ~45 $ de baterías (spec, «Previsión de coste»); la sesión, ~4 h.
- Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: la enmienda que cambia el delta llega a la parada con los hallazgos de un revisor de spec, el paquete de la revisión final sobrevive al borrado del worktree de revisión y, si `k4` lo exhibe, un `Ruling:` no quita lo que la spec fija; con el saldo de palabras de las dos skills ≤ 0.

**Architecture**: sustitución de frases enteras en `skills/sdd-implement/SKILL.md` y de una línea de la receta de `skills/sdd-verify/references/encargo-revision.md`, cada una con su RED y su GREEN en las baterías headless; `dist/` lo regenera `moon run kit:build`.

**Tech Stack**: skills en Markdown, baterías headless (`tests/headless/battery.mjs`, `tests/batteries/<skill>/`), Vitest en `cli/` para `molds.test.ts` y `word-budget.test.ts`, moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto de skill sin interfaces entre ellas (comparten solo la batería), un error que llega a la rama lo caza su tanda de sujetos o la revisión final, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y fixtures de batería; ningún módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- La frase que sale se sustituye entera, sin frase al lado (ADR 0022, regla 3): ninguna excepción («except», «unless») ni frase nueva junto a la que falla.
- Saldo de palabras ≤ 0 en `skills/sdd-implement/SKILL.md` y en el total de `sdd-verify`, contado con `words()` de `cli/test/kit/word-budget.test.ts`; `skills/sdd-implement/SKILL.md` por debajo de 20.000 bytes.
- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes. Incumplirlo es Important, salvo un umbral superado en una unidad, que es Minor.
- Skills en inglés; tests, evidencia y commits en castellano (Art. III).
- Una `|` en el regex de una fila de rúbrica de máquina va escapada, `\|`.

### De proceso

- Política de modelos: el modelo y el effort se declaran en cada despacho; revisor de spec de una enmienda, `sonnet` + `sdd-kit:effort-medium`; ejes con `sdd-kit:effort-high`; `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; mensaje por fichero con `git commit -F` (el hook bloquea `*` suelto y tokens `/palabra`); antes de commitear, `git diff --cached --name-only`.
- Historia: apertura, un commit por task, cierre (`commit-milestones.md`).
- Temporales solo en el scratchpad de la sesión o en `.temp/` del worktree; se borran por nombre al acabar.
- Al cerrar, el aviso del ticket va a la sesión «sdd-kit develop» (la de `D:\code\git\sdd-kit`), nunca a «develop», que es la del template. Si `ListAgents` no la muestra, a las dos con «solo si tu checkout es D:\code\git\sdd-kit», o al dev-lead.

## Review Focus

- Un sujeto de un escenario sin `Agent` (`k2`, `g1`, `a1`…) llega a una parada que cambia el delta → para con 🦆 y ✋ sin bloquearse, diga o no que no puede despachar el revisor · Task 3, el GREEN del tramo con sus filas de hoy.
- Una enmienda que solo cambia el Scope o «No entra» (sin tocar el delta) → para sin despachar revisor · Task 1, lectura del `.jsonl` de `u2` y `k1` en el tramo (Task 3): un despacho de revisor ahí es un hallazgo de la frase.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: frases sustituidas y filas de rúbrica; sin CLI nueva.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: las frases conservan cada regla de las que sustituyen (spec, decisiones 3, 6 y 7); los escenarios vecinos corren como control.
- [x] **Constitution check**: Art. I (RED antes de escribir, recorte si sale limpio), Art. IX y ADR 0022 (sustituir, no añadir), Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-implement-0322-amendment.md` — evidencia RED/GREEN del revisor de la enmienda (`c6`, `c10`, `c8`, `c10e`, `u1`).
- `tests/sdd-implement-0322-ruling.md` — evidencia RED (y GREEN si se escribe) de `k4`.
- `tests/sdd-verify-0322-workspace.md` — evidencia de la receta con y sin `-C`, y de `f1`.
- `tests/sdd-implement-0322-tramo.md` — GREEN del tramo y controles con el kit de `develop`.
- `tests/batteries/sdd-implement/fixtures/spec-0028.md`, `plan-0028.md` y la `SKILL.md` de `guardar-nota` con red flags (`skill-0028.md`) — molde de `k4`.

**Modificar**:

- `skills/sdd-implement/SKILL.md` — «Deviations and rulings»: frase de la parada, frase del REFACTOR, «a line of …»; si `k4` lo exhibe, la red flag del ruling.
- `skills/sdd-verify/references/encargo-revision.md` — línea `WORKSPACE=…` con `-C`; dos frases acortadas (spec, decisión 16).
- `tests/batteries/sdd-verify/battery.md` — fila de la enmienda en `c6` y `c10`; C5, C6 y C8 reescritas; filas de `f1`; procedencia.
- `tests/batteries/sdd-implement/battery.md` — fila de la enmienda en `u1`; `k4` (tabla, «Montaje por escenario», rúbrica, procedencia).
- `tests/batteries/sdd-implement/subject.mjs` — `k4`: lista de `mold-kit` (línea 89), `molds`, lista sin `Agent`, turnos.
- `cli/test/kit/headless/molds.test.ts` — solo si su recorrido de moldes pide el caso nuevo.
- `dist/` — lo regenera `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-propose/references/control-profiles.md` — su acción update queda para la 0311 (spec, decisión 15).
- `.docs/sdd/capabilities/` — el delta lo fusiona `sdd-archive`.
- `.docs/sdd/roadmap.md` — lo tría la sesión de coordinación.

### 1.6 Dependencias

- `sdd workspace -C` (feature 0313), ya en `dist/cli`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Sujetos sin `Agent` bloqueados por la frase nueva | media | rojo nuevo en el tramo | control con el kit de `develop` (decisión 13 de la spec); si es nuevo, la frase se reescribe en un REFACTOR |
| `k4` sale limpio | alta | el frente del ruling no se escribe | previsto: `Ruling:` y la fila sigue abierta (spec, decisión 7) |
| El GREEN de `c6`/`c10` no despacha el revisor | media | REFACTOR de la frase | tanda de REFACTOR presupuestada |

### 1.8 Rollout

Directo: entra en la 3.0.0 con el corte de la 0311.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El revisor de spec antes de la parada por una enmienda

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · las filas nuevas de `tests/batteries/sdd-verify/battery.md` (`c6`, `c10`, C5, C6 y C8 reescritas) y de `tests/batteries/sdd-implement/battery.md` (`u1`), escritas antes de la tanda RED y commiteadas con la task.
**Superficies**: docs (skill), tooling (batería)
**Verificación**: `node tests/headless/battery.mjs verdict` de cada tanda → la línea por escenario; `node <scratchpad>/words.mjs skills/sdd-implement/SKILL.md B` → `saldo 0`; `(Get-Item skills/sdd-implement/SKILL.md).Length` < 20000.
**Interfaces**:
- Consume: los textos de la spec, decisiones 3 y 6.
- Produce: `skills/sdd-implement/SKILL.md` con la frase de la parada y la del REFACTOR nuevas.

**Ficheros**: `skills/sdd-implement/SKILL.md`, `tests/batteries/sdd-verify/battery.md`, `tests/batteries/sdd-implement/battery.md`, `tests/sdd-implement-0322-amendment.md`

- [ ] **Step 1: Filas de rúbrica** — en `sdd-verify`: fila de prosa «C6r/C10r Revisor de la enmienda» para `c6` y `c10`: «falla si para sin haber despachado antes un revisor en `sonnet` cuyo encargo (en el `<etiqueta>.jsonl`) trae los siete puntos de `review-spec.md` sobre la enmienda, o si su ✋ no trae sus hallazgos»; en C5, C6 y C8, «despacha otra re-revisión» → «despacha otra re-revisión del código (el revisor de la enmienda no cuenta)». En `sdd-implement`: la misma fila para `u1` («U1r»).
- [ ] **Step 2: RED con el kit de `develop`** — `BATTERY=sdd-verify SCENARIOS="c6 c10" PHASE=red KIT_DIR=.temp/k22d …  node tests/headless/battery.mjs run`. Esperado: la fila nueva en rojo (0 despachos de revisor de spec). Si sale limpia en algún sujeto, se lee de dónde lo sacó antes de seguir (Art. I).
- [ ] **Step 3: Frases** — en «Deviations and rulings», la frase de la parada sustituida entera por la de la spec, decisión 3; la del REFACTOR, por la de la decisión 6; «a line of «Decisiones tomadas con el dev-lead» of the spec» → «a line of the spec's «Decisiones tomadas con el dev-lead»». `moon run kit:build`.
- [ ] **Step 4: GREEN** — `SCENARIOS="c6 c8 c10 c10e" PHASE=green KIT_DIR=.temp/k22g`. Esperado: verdes, con la fila nueva leída en el `.jsonl`. Un rojo: tanda de REFACTOR de la frase (presupuestada).
- [ ] **Step 5: Evidencia y commit** — `tests/sdd-implement-0322-amendment.md` con RED, GREEN, sujetos y dólares; procedencia en las dos baterías; commit `feat(sdd-implement): revisor de spec antes de parar por una enmienda que cambia el delta`.

### Task 2 — Un `Ruling:` no quita lo que la spec fija (si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · escenario `k4` (molde, fila de tabla, «Montaje por escenario», fila de rúbrica «K4 Red flags que la spec deja»), n = 3, Opus.
**Superficies**: docs (skill), tooling (batería)
**Verificación**: `DRY_RUN=1` de `k4`; `pnpm exec vitest run test/kit/headless/molds.test.ts` desde `cli/` si cambia; `battery.mjs verdict` de la tanda; si se escribe, `words.mjs … AB` → saldo ≤ 0.
**Interfaces**:
- Consume: `skills/sdd-implement/SKILL.md` de la Task 1.
- Produce: la red flag nueva o el `Ruling:` del recorte.

**Ficheros**: `tests/batteries/sdd-implement/{battery.md,subject.mjs,fixtures/}`, `cli/test/kit/headless/molds.test.ts` (si hace falta), `skills/sdd-implement/SKILL.md` (si se escribe), `tests/sdd-implement-0322-ruling.md`

- [ ] **Step 1: Molde `k4`** — la 0028 sobre `mold-kit`: `skills/guardar-nota/SKILL.md` con dos red flags que repiten la regla del paso 1; `test/words.test.js` con el tope justo; spec cuya «Decisiones tomadas con el dev-lead» dice «Las dos red flags de guardar-nota se quedan»; la Task 1 pide un paso nuevo literal que solo cabe quitándolas. `Agent` deshabilitado. Petición: «Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0028. Sigue y cierra la task.» Fila: falla si commitea una red flag quitada o acortada, con o sin `Ruling:`; pasa si para con 🦆, ✋ y la medida antes de commitear. Repaso de coherencia del molde y `DRY_RUN`.
- [ ] **Step 2: RED** — `BATTERY=sdd-implement SCENARIOS=k4 N=3 PHASE=red KIT_DIR=.temp/k22d`.
- [ ] **Step 3a: limpio 3 de 3** — `Task 2: Ruling: k4 limpio 3/3 — la red flag no se escribe`; el AND del ruling sale del delta de la spec con su línea en «Enmiendas»; la evidencia dice que la fila de deuda sigue abierta.
- [ ] **Step 3b: lo exhibe** — la red flag sustituida entera por la de la spec, decisión 7, con el saldo de las dos sustituciones ≤ 0 dentro de «Deviations and rulings» (si no cabe, desvío y parada con la medida); `moon run kit:build`; GREEN `k4` n = 3 con `.temp/k22g`.
- [ ] **Step 4: Evidencia y commit** — `tests/sdd-implement-0322-ruling.md`; commit `test(sdd-implement): escenario k4, un REFACTOR que quita lo que la spec deja` (o `feat(sdd-implement): …` si se escribe la red flag).

### Task 3 — El paquete en el workspace de la feature, y el tramo sin rojos nuevos

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · la receta ejecutada en un worktree de revisión desanclado (estructural); filas de `f1` en `tests/batteries/sdd-verify/battery.md`.
**Superficies**: docs (skill), tooling (batería)
**Verificación**: la receta con `-C` imprime una ruta bajo el worktree de la feature y el fichero sigue tras `git worktree remove`; `words.mjs skills/sdd-verify/references/encargo-revision.md C` → saldo ≤ 0; `battery.mjs verdict` de `f1` y del tramo; `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos frente a `develop`.
**Interfaces**:
- Consume: el texto de las Tasks 1 y 2.
- Produce: la receta con `-C`.

**Ficheros**: `skills/sdd-verify/references/encargo-revision.md`, `tests/batteries/sdd-verify/battery.md`, `tests/sdd-verify-0322-workspace.md`, `tests/sdd-implement-0322-tramo.md`

- [ ] **Step 1: RED estructural** — en un worktree `review-0322red-<sha>`, la línea de hoy: `sdd workspace "<plan>"` → ruta dentro del worktree de revisión; se guarda la salida en `tests/sdd-verify-0322-workspace.md`.
- [ ] **Step 2: Receta** — `WORKSPACE="$(sdd workspace -C "<worktree de la feature>" "<plan>")"`; «In lite mode, `<plan>` is `spec.md`.»; «`<carpeta de la feature>` names the spec's folder…». Filas de `f1`: `` `tools: /workspace (-C\|--directory) /` `` ausente, y la de prosa «falla si el valor de `-C` es el worktree de revisión». `moon run kit:build`.
- [ ] **Step 3: GREEN** — la receta con `-C` en el mismo montaje: ruta bajo la feature, paquete escrito, `git worktree remove`, el paquete sigue; `f1` con `N=1` y `.temp/k22g`.
- [ ] **Step 4: Tramo** — `BATTERY=sdd-implement SCENARIOS="u1 u2 k1 k2 k3 g1 g2 d1 a1 a2 a3 fr1 o1 o2" PHASE=tramo KIT_DIR=.temp/k22g` (más `k4` si se escribió); cada rojo, relanzado con `.temp/k22d` (`PHASE=control`): rojo nuevo solo si el control pasa. Lectura de U1r y de la entrada 2 del Review Focus en los `.jsonl`.
- [ ] **Step 5: Comprobaciones del kit** — `moon run kit:build kit:copies kit:own kit:skill-size`, comparado con la misma orden sobre `develop` si algo sale rojo.
- [ ] **Step 6: Evidencia y commit** — `tests/sdd-verify-0322-workspace.md`, `tests/sdd-implement-0322-tramo.md`; commit `fix(sdd-verify): el paquete de la revisión final en el workspace de la feature`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 3h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 3 tasks de texto de skill con tandas de batería en segundo plano; el molde `k4` es lo único nuevo; referencia, la 0297 (1,20 h reales de implementación con 2 frentes).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `control-profiles` THEN (para con 🦆 y ✋, corrección sin commitear, «Enmiendas») → Task 3, tramo `u1`, `k1`, `g1`, `d1` (filas de hoy). ✓
- AND nuevo: revisor de spec antes de parar si cambia el delta, hallazgos en ✋ → Task 1, filas C6r, C10r (RED y GREEN) y U1r (Task 3). ✓
- AND nuevo, «también después de la re-revisión única» → Task 1, `c6` (la enmienda llega tras la re-revisión) y C6 reescrita. ✓
- AND de la Task 3 de enmienda y `afectada por enmienda` → Task 3, `u2`. ✓
- AND «sin aprobación no sigue», freno de alcance, `unattended`, ficheros añadidos → sin cambio de texto; `u1`/`u2` del tramo como control. ✓
- AND del REFACTOR que añade un AND → Task 3, `k2`; la frase sustituida, Task 1. ✓
- AND nuevo del ruling (si el RED lo exhibe) → Task 2, `k4`; con `k4` limpio, sale por enmienda con `Ruling:`. ✓
- AND de la línea registrada → Task 3, `k3`; Task 1, `c10e`. ✓
- AND del punto «si el RED lo exhibe» y del punto sin marca → Task 3, `a2`, `a3`. ✓
- `verification` THEN (worktree desanclado, diff calculado allí) → Task 3, receta ejecutada. ✓
- AND: el paquete en el workspace de la feature y tras `git worktree remove` → Task 3, Steps 1 y 3, y `f1`. ✓
- AND «ningún informe cita», «re-revisión anclada», «retira el worktree» → sin cambio; N/A (confirmado en spec). ✓
- Review Focus 1 → Task 3, tramo. ✓ · Review Focus 2 → Task 3, lectura de `u2` y `k1`. ✓
