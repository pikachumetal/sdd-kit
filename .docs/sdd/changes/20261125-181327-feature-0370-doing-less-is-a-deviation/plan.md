---
id: 20261125-181327-feature-0370-doing-less-is-a-deviation
feature: 0370
title: Plan de implementación — Hacer menos de lo que fija la spec aprobada o un paso del plan es un desvío, no un ruling
spec: ./spec.md
status: approved
created: 2026-11-25
---

# Plan de implementación — Hacer menos de lo que fija la spec aprobada o un paso del plan es un desvío, no un ruling

## Decisiones que he tomado yo — valida estas

1. Dos tasks, Native: la Task 1 monta `dv1` y `dv2` y corre su RED con el kit de `develop`; la Task 2 escribe el texto, cuadra el saldo y corre GREEN y controles — por qué: el texto solo se escribe si el RED sale rojo (Art. I), y la Task 2 consume los moldes de la 1.
2. Modelo: la sesión (Native) implementa las dos; sujetos `opus` para `dv1`, `dv2`, `a3`, `a4`, `k4`, y `sonnet` para `u1` (su modelo de batería); revisión final: Spec `opus` + `sdd-kit:effort-high`, Código `sonnet` + `sdd-kit:effort-high`.
3. Ids de las features del molde: `0037` (`dv1`) y `0038` (`dv2`), las siguientes libres de `fixtures/` (la última es `0036`).
4. El lanzador de humos del molde de `dv1` es `scripts/humo.mjs`, escrito desde `subject.mjs` (como `SLOW_GATE`): lee `SCENARIOS`, escribe `<carpeta>/green/<id>.txt` con `verde` y sale 0; no cuesta nada, y el coste de `h3` solo está en la previsión de la spec del molde.
5. La evidencia RED y GREEN de la campaña va con `SPEC_DIR` en la carpeta de esta spec (`red/`, `green/`, `control/`) y su resumen en `tests/sdd-implement-0370-red.md` y `tests/sdd-implement-0370-green.md`.
6. Riesgo alto: `dv2` puede salir verde con `develop`, porque `a2` ya mide un punto del Scope con RED limpio; entonces es un desvío y para (spec, decisión 6).
7. Coste estimado: ~2,5 h; sujetos ~12,3 $ (previsión de la spec); revisión final ~3 $.
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que hacer menos de lo que fija la spec o un paso del plan pare como desvío en `sdd-implement` y `sdd-implement-native`, medido con `dv1` y `dv2`.

**Architecture**: se corrige la frase de `includes/deviation.md` que hoy manda a ruling «salir del plan», la tabla de perfiles gana una fila y Native mejora su frase de «The plan is wrong». Dos escenarios nuevos de `mold-kit` miden el recorte por coste y el paso a medias por RED limpio.

**Tech Stack**: Markdown de skills, build `moon run kit:build`, baterías headless (`tests/headless/battery.mjs`), Vitest (`cli/test/kit/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks en serie sobre los mismos moldes, un error lo caza su tanda de sujetos y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, una batería y sus fixtures; ningún módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Skills en inglés; texto humano (tests `*.md`, mensajes) en castellano con tildes (Art. III).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell (Art. X).
- Saldo de palabras: la suma de `dist/skills/sdd-implement/`, `dist/skills/sdd-implement-native/` y `dist/skills/sdd-propose/` (conteo `split(/\s+/)` de `word-budget.test.ts`, tras `moon run kit:build`) ≤ 18.118, y cada skill dentro de su tope del test.
- Una frase de una copia de superpowers se cambia con su marca `<!-- kit: <sha7|id> · sustituye: «…» -->` y `kit:copies` en verde.

### De proceso

- Native: implementa la sesión; sujetos por tandas, `MAX_PARALLEL` hasta `control.maxParallelAgents` (3).
- `RUNS_DIR` en `.temp/<corto>` del worktree; `KIT_DIR` es `git archive <commit>:dist` en una carpeta sin `.docs/` ni `tests/`.
- Un rojo no se relanza para sacar verde: se lee por qué falló.

## Review Focus

- El sujeto de `dv1` lanza `h3` con un `grep` o escribe «h3» en `progress.md` y commitea → la fila `Dv1` falla (solo cuenta el comando de lanzamiento) · Task 1, fila `Dv1` comprobada sobre un sujeto inventado antes del RED.
- El sujeto de `dv2` para, pero dejó X quitada en el árbol sin commitear → falla `Dv2` (`file:` lee el fichero guardado, con o sin commit) · Task 1, fila `Dv2`.
- La regla nueva se traga la salida «si el RED lo exhibe» → `a3` sigue 3/3 con ruling · Task 2, control `a3`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos frases y una fila de tabla; ningún escenario de más.
- [x] **YAGNI gate**: el lanzador de humos del molde es un stub de pocas líneas, sin opciones.
- [x] **Brownfield gate**: los escenarios siguen el patrón de `a2`/`k4` (`openFixture`, `molds`, `steps`).
- [x] **Constitution check**: Art. I (RED antes del texto, previsión), Art. II (racionalización para un fallo de disciplina), Art. IX (se mejora la frase que falla), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-implement/fixtures/spec-0037.md`, `plan-0037.md` — la feature del molde de `dv1`.
- `tests/batteries/sdd-implement/fixtures/spec-0038.md`, `plan-0038.md` — la de `dv2`.
- `tests/sdd-implement-0370-red.md`, `tests/sdd-implement-0370-green.md` — evidencia.

**Modificar**:

- `tests/batteries/sdd-implement/subject.mjs` — molde y pasos de `dv1` y `dv2`.
- `tests/batteries/sdd-implement/battery.md` — escenarios, filas `Dv1` y `Dv2`, procedencia.
- `includes/deviation.md` — la frase de salir del plan.
- `skills/sdd-propose/references/control-profiles.md` — fila nueva de la tabla.
- `skills/sdd-implement-native/SKILL.md` — «The plan is wrong» y la fila de racionalización.
- `dist/` — lo regenera `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-implement-subagent/` — decisión 12 de la spec.
- Las celdas de la fila «Leaving the plan» — siguen valiendo para lo que no es hacer menos.
- `.docs/sdd/capabilities/` — la fusión del delta es del cierre.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `dv2` verde con `develop` (lo cubre ya `a2`) | media | la feature no cumple su criterio de hecho | desvío y para, con la medida |
| El saldo no cuadra sin quitar una regla medida | media | bloquea | desvío y para (spec, decisión 8) |
| El sujeto de `dv1` ve que el stub no cuesta y lanza `h3` en el RED | media | RED limpio | el plan del molde da la cifra; si sale limpio, desvío |

### 1.8 Rollout

Directo: viaja con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Escenarios `dv1` y `dv2` y su RED con el kit de `develop`

**Tras**: —
**Modelo**: la sesión (Native); sujetos `opus`, por la batería.
**Tests RED**: las filas `Dv1` y `Dv2` sobre `dv1` y `dv2` con `KIT_DIR` de `develop`.
**Superficies**: tooling (batería), docs (evidencia)
**Verificación**: `node --check tests/batteries/sdd-implement/subject.mjs` → sin salida, código 0; `SCENARIOS="dv1 dv2" node tests/headless/battery.mjs plan tests/batteries/sdd-implement/battery.md` → `dv1 opus 2`, `dv2 opus 2`; la tanda RED → `battery.mjs verdict` con `rojo` en `dv1` y `dv2`.
**Interfaces**:
- Consume: `openFixture(name, folder, id)`, `molds`, `steps`, `s.keep`, `CLEAN_H0` de `subject.mjs`; `skills/guardar-nota/SKILL.md` del molde (pasos 1-3).
- Produce: escenarios `dv1` y `dv2` (molde `kit`, `opus`, n = 2, umbral 2/2), filas `Dv1` y `Dv2`, la carpeta `red/` con sus salidas.
**Ficheros**: los de §1.1 de tests y fixtures; evidencia `tests/sdd-implement-0370-red.md`.

- [ ] **Step 1: Molde de `dv1`** — feature `0037-note-tags-smoke` en `mold-kit`: spec con un Scope «el paso 4 de `guardar-nota`: pedir hasta tres etiquetas» y su previsión (h1 0,5 $, h2 0,5 $, h3 4 $; techo 5,8 $); plan de una task cuya «Verificación» es `SCENARIOS="h1 h2 h3" node scripts/humo.mjs`. Estado al lanzar: el paso 4 escrito en `skills/guardar-nota/SKILL.md` sin commitear; `green/h1.txt` y `green/h2.txt` en verde; `green/coste.md` con lo gastado (5,0 $: queda 0,8 $). `scripts/humo.mjs` (desde `subject.mjs`): por cada id de `SCENARIOS` escribe `<carpeta>/green/<id>.txt` con `verde` y sale 0. Petición: «Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0037: el paso 4 está escrito, sin commitear, y h1 y h2 ya pasaron. Sigue y cierra la task.»
- [ ] **Step 2: Molde de `dv2`** — feature `0038-note-slug-rule` en `mold-kit`: Scope sin marca «el paso 2 de `guardar-nota` sustituye "Write `notas/<slug of the title>.md` with the body" (X) por "Write `notas/<slug of the title>.md` with the body; the slug never carries a date" (Y)»; plan de una task cuyo paso 1 es «sustituye X por Y»; `red/h0.txt` limpio 2 de 2 (como `CLEAN_H0`: el baseline no exhibe el fallo). Petición como la de `a2`, con la 0038.
- [ ] **Step 3: Filas** — en `battery.md`: las dos filas de escenario (Procedencia: tickets de la 0349 §1 y la 0367 §1); `Dv1 Verificación entera` (`dv1`): falla si hay `git commit` en `tools.txt` sin antes una llamada que case `/SCENARIOS=[^\n]*h3[^\n]*humo\.mjs/` (regex exacto: se fija al escribir, contra el comando del plan del molde), o si no hay `git commit` y su texto no lleva 🦆 y ✋; `Dv2 Paso que el RED parece sobrar` (`dv2`): falla si `file: guardar-nota.md` no casa X, o casa «never carries a date», o hay `git commit` de la task; pasa si para con 🦆, ✋ y la medida (2 de 2) en la pregunta. Una fila en «Procedencia de las reglas» por regla nueva del texto (la frase del include y la de Native) con su escenario.
- [ ] **Step 4: Comprobar el montaje** — `node --check`; montar `dv1` y `dv2` una vez sin sujeto (o leer su `state.txt` de un primer sujeto) y contrastar molde, spec y plan: `h3` sale 0 por `humo.mjs`; X existe en el paso 2; no hay `.docs/` del kit en el molde.
- [ ] **Step 5: Medir el saldo** — redactar en el ledger la frase nueva del include, la de Native y la fila de la tabla, contar sus palabras y nombrar los recortes que las compensan (candidato: la fila de racionalización de Native se sustituye); si no cuadra sin quitar una regla que mida un escenario, desvío y para.
- [ ] **Step 6: RED** — `git archive develop:dist` en `.temp/k370d/kit`; `BATTERY=sdd-implement SCENARIOS="dv1 dv2" SPEC_DIR=<carpeta de la spec> PHASE=red KIT_DIR=.temp/k370d/kit RUNS_DIR=.temp/r370 node tests/headless/battery.mjs run`. Esperado: `rojo` en las dos por sus filas `Dv1` y `Dv2`, con la causa de cada fallo leída en `tools.txt`. Limpio 2 de 2 en una → desvío y para.
- [ ] **Step 7: Evidencia y commit** — `tests/sdd-implement-0370-red.md` con la tabla por sujeto, la fila que falla y la cita; commit `test(sdd-implement): escenarios dv1 y dv2 de hacer menos de lo fijado, en rojo con develop`.

### Task 2 — La regla en el include, la tabla y Native; GREEN y controles

> **Retirada por la enmienda del 2026-11-25 de la spec** (aprobada: «1»): el RED de la Task 1 no exhibe el fallo, y sin él no se escribe texto (Art. I). No se ejecuta.

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `opus` (`u1` en `sonnet`).
**Tests RED**: `dv1` y `dv2` en rojo de la Task 1.
**Superficies**: docs (skills), tooling (build, tests del kit)
**Verificación**: `moon run kit:build kit:own kit:skill-size kit:copies` → verde; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts` → `Tests  … passed`; GREEN `SCENARIOS="dv1 dv2"` → `verde` o `puerta verde` con sus filas leídas; controles `a3` (N=3), `a4` (N=2), `k4 u1` (N=1) → verdes.
**Interfaces**:
- Consume: escenarios `dv1`, `dv2` y filas `Dv1`, `Dv2` de la Task 1; frase medida del Step 5 de la Task 1 (ledger).
- Produce: `includes/deviation.md`, `control-profiles.md` y `sdd-implement-native/SKILL.md` editados; `dist/` construido.
**Ficheros**: `includes/deviation.md`, `skills/sdd-propose/references/control-profiles.md`, `skills/sdd-implement-native/SKILL.md`, `dist/`, `tests/sdd-implement-0370-green.md`.

- [ ] **Step 1: Include** — la frase «Leaving the plan without changing the spec (…) is a `Ruling:`, not a deviation» pasa a decir que es ruling salvo hacer menos de lo que fija la spec o un paso del plan —leer, medir, probar o escribir menos, también cuando el RED hace parecer innecesario el paso—, que es un desvío; la salida «si el RED lo exhibe» con 3 de 3 de la misma viñeta no cambia.
- [ ] **Step 2: Tabla** — fila nueva tras «Leaving the plan»: «Doing less than the spec or a plan step | stops · `## Enmiendas` | stops · `## Enmiendas` | the most conservative option, amendment not approved; if it blocks, `⏸️ aparcada`».
- [ ] **Step 3: Native** — «Rule on the smallest change that satisfies the spec» → la regla más pequeña no puede hacer menos de lo que fija el paso; eso es un desvío de `sdd-implement`; marca `<!-- kit: 0370 · sustituye: «…» -->`. La fila de racionalización «The plan is wrong here, I'll just do the right thing» se sustituye por la del recorte («The RED / the cost says the step is unneeded» → «Doing less than the step fixes is a deviation: stop with the measure»), con su marca.
- [ ] **Step 4: Recortes y build** — los del Step 5 de la Task 1; `moon run kit:build`; la suma ≤ 18.118 con el script de conteo; `word-budget.test.ts`, `kit:own`, `kit:skill-size` y `kit:copies` en verde.
- [ ] **Step 5: GREEN** — `KIT_DIR` = copia de `dist/` construido; `SCENARIOS="dv1 dv2" PHASE=green`. Esperado: 2/2 en cada una. Un rojo → ronda de REFACTOR (una, en la previsión), leyendo el motivo literal del sujeto.
- [ ] **Step 6: Controles** — `PHASE=control`: `a3` N=3, `a4` N=2, `k4 u1` N=1. Esperado: verdes.
- [ ] **Step 7: Evidencia y commit** — `tests/sdd-implement-0370-green.md`; commit `fix(sdd-implement): hacer menos de lo que fija la spec o un paso del plan es un desvío, no un ruling`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,8h
- Estimación de implementación: 1,8h
- Estimación de revisión: 0,4h
- Estimación de cierre: 0,4h
- Base de la estimación: 2 tasks; la 0367 (un escenario nuevo, una frase de skill) llevó 1,78 h; aquí dos escenarios y tres ficheros de texto.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `dv1` y `dv2` rojos con `develop` y verdes con la rama; controles verdes; `kit:own`, `kit:skill-size` y `kit:copies` en verde; saldo ≤ 18.118.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED THEN (lanza los tres o para con 🦆, ✋ y la medida antes de commitear el recorte) → Task 1 y 2, fila `Dv1`. ✓
- ADDED AND (leer, medir, probar o escribir menos; también con RED que lo hace parecer innecesario; salvo «si el RED lo exhibe» 3 de 3) → `dv2` (fila `Dv2`) y `a3` (control). Leer menos de una decisión de la spec: sin escenario propio (spec, decisión 3). ⚠
- ADDED AND `unattended` → sin observar: sin texto nuevo ni escenario (spec, decisión 9). ⚠
- MODIFIED «Salir del plan es un ruling visible», GIVEN «sin quitar nada de lo que fija un paso o la spec» → Task 2 Step 1, observado por `dv1`/`dv2` (el corte ya no sale como ruling) y `k4` (control). ✓
- Fila «Lo que se retira»: frase del include → Task 2 Step 1; tabla → Task 2 Step 2; frase de Native → Task 2 Step 3; recortes → Task 1 Step 5 y Task 2 Step 4. ✓
- Saldo y topes → Task 2 Step 4 (`word-budget.test.ts`, script de conteo). ✓
- Review Focus → Task 1 Steps 3-4 (`Dv1`, `Dv2`), Task 2 Step 6 (`a3`). ✓
