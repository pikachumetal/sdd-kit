---
id: 20261107-211900-feature-0320-battery-launcher-n-forecast-resume
feature: 0320
title: Plan de implementación — El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash
spec: ./spec.md
status: approved
created: 2026-11-07
---

# Plan de implementación — El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, esta sesión implementa las cinco tasks; la revisión final, con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native (ver la línea `Ejecución`).
3. `withN(rows, value)` es la única función que aplica `N`: la usan `batteryPlan`, `verdict` y `planLines`, para que los tres validen y sustituyan igual.
4. `--resume` se lee de los argumentos de `run` (`node battery.mjs run --resume`); cualquier otro argumento de `run` sigue sin leerse, como hoy.
5. El humo real de S1 va al final de la Task 1, con el lanzador ya cambiado; si se corta sin evidencia, se usa el sujeto de reserva de la Suma.
6. Riesgo alto: ninguno; el medio es que la previsión lea miles de ficheros de `specs/`: se lee `state.txt` antes que `tools.txt`, y `tools.txt` solo si la llave casa.
7. Coste estimado: ~2,5 h de implementación y cierre; 1–2 sujetos (~0,86–1,72 $) y la revisión final (~3 $).
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: las cinco conductas de la spec en `tests/headless/battery.mjs` y `campaign.mjs`, cada una con su Vitest, y `tech-stack.md` al día.

**Architecture**: sin ficheros nuevos de código: funciones puras nuevas en `battery.mjs` (`withN`, `slashSkill`, `forecastCost`, `planLines`) con el `fs` inyectado, como el resto del lanzador; `labelTaken` se exporta de `campaign.mjs` y `runBattery` la usa con `--resume`.

**Tech Stack**: Node (`.mjs`) y Vitest (`cli/test/kit/headless/`), `memory-fs.ts` como `fs` de los tests.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 5 tasks pequeñas sobre dos ficheros que se tocan en zonas distintas, un error lo caza el Vitest de su task y el plan cabe en un contexto; `execution: auto` en `sdd-kit.json` deja el método a esta recomendación. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos: cambia dos scripts de `tests/headless/` que ya existen y exporta una función que solo usa `battery.mjs`.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); un comentario solo dice el porqué que el código no muestra.
- Literales de la spec, exactos: `N tiene que ser un entero positivo: <valor>` (código 2); `suma: <n> sujetos · coste previsto: <x.xx> $`; ` · sin precio medido: <ids> (a <p> $, la media de los escenarios medidos)`; `suma: <n> sujetos · coste previsto: sin campañas guardadas de esta batería`; `reanudo: guardadas <k>, lanzo <m>`; `ya existe <etiqueta> en <out>: borra esa carpeta, cambia PHASE o reanuda con --resume`.
- Decimales con punto y dos cifras (`toFixed(2)`), como `formatCost` de `campaign.mjs`.
- Los Vitest no usan cifras del repo real: baterías y campañas sintéticas en el `memory-fs`.
- Scripts agnósticos del sistema: rutas con `join`, sin comandos de shell.

### De proceso

- Native: esta sesión implementa; commits por task, juntados al quedar limpia su revisión (`commit-milestones.md`). Mensajes: tipo/scope en inglés, título y cuerpo en castellano; pie `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Sujetos reales: solo el humo de S1 (Task 1), con `SPEC_DIR` = la carpeta de la spec, `PHASE=smoke-n1`, kit de `git archive HEAD:dist` en `.temp/k320/kit` y `RUNS_DIR=.temp/k320/runs`.

## Review Focus

- `N=` con espacios o `N=01` → `01` es un entero positivo y se usa como `1` en la n y el umbral (`1/1`), no como `01/01` · Task 1, `N=01 deja n = 1 y umbral 1/1`
- Una carpeta de `specs/` con una fase que no es carpeta (`spec.md`, `plan.md`) → la previsión la salta sin error · Task 3, `salta ficheros sueltos de specs/`
- `--resume` junto a `SCENARIOS` → solo mira las etiquetas de los escenarios filtrados · Task 4, `--resume con SCENARIOS mira solo lo filtrado`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: funciones puras en los dos scripts que ya existen; ningún fichero ni opción más allá de los cinco de la spec.
- [x] **YAGNI gate**: ninguna abstracción nueva; `labelTaken` se reutiliza, no se copia.
- [x] **Brownfield gate**: la salida de `plan` conserva sus líneas; `run` sin `--resume` ni `N` se comporta igual salvo el texto del error de etiquetas guardadas.
- [x] **Constitution check**: Art. X (comentarios) en las restricciones; sin edición de skills, así que sin RED/GREEN de sujetos salvo el humo.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `tests/headless/battery.mjs` — `withN`, `slashSkill` en el juicio, `forecastCost` y `planLines` para `plan`, `--resume` en `runBattery`, texto de `refuseSavedLabels`, cabecera de uso.
- `tests/headless/campaign.mjs` — rango en `forecastSubjects`; `export` de `labelTaken`.
- `cli/test/kit/headless/battery.test.ts` — tests de `N`, `plan`, `--resume` y slash; los dos que citan el mensaje viejo.
- `cli/test/kit/headless/campaign.test.ts` — tests del rango.
- `.docs/sdd/tech-stack.md` — líneas 109, 137, 138 y 141 (decisión 8 de la spec).

**NO se tocan**:

- `tests/batteries/` — fuera de alcance (dev-lead).
- `tests/headless/run.mjs` — campaña suelta sin batería; su cabecera sigue siendo cierta.
- `skills/sdd-templates/templates/spec-template.md` — la 0309.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `plan` tarda en un repo con miles de salidas | media | bajo | leer `state.txt` primero y `tools.txt` solo si casa la llave |
| El humo real sale 0/1 por la conducta del sujeto | baja | bajo | el THEN fija n y umbral; un 0/1 se informa tal cual, sin relanzar |

### 1.8 Rollout

Directo: herramienta del repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `N=` sustituye n y umbral en `run` y `verdict`

**Tras**: —
**Modelo**: Native, esta sesión
**Tests RED**: hilo principal · `cli/test/kit/headless/battery.test.ts`
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/battery.test.ts` → `Tests  <n> passed (<n>)`; humo real: `N=1 SCENARIOS=c1 BATTERY=sdd-verify SPEC_DIR=<carpeta de la spec> PHASE=smoke-n1 KIT_DIR=.temp/k320/kit RUNS_DIR=.temp/k320/runs COST_CAP=1.72 node tests/headless/battery.mjs run` → lanza `c1-1` y la última línea empieza por `c1 · ` y lleva `/1 · umbral 1/1`
**Se prueba en la aplicación**: no, porque herramienta del repo: lo prueba el humo real

**Interfaces**:
- Consume: nada
- Produce: `withN(rows, value)` en `battery.mjs` → `rows` sin cambios si `value` es `undefined` o `''`; si no casa `/^[0-9]+$/` o vale 0, `throw new BatteryError(\`N tiene que ser un entero positivo: ${value}\`, 2)`; si no, cada fila con `n: String(Number(value))` y `Umbral: \`${Number(value)}/${Number(value)}\``. `verdict(batteryPath, outDir, steps, fs, n)` con `n` opcional (el `N` del entorno).

**Ficheros**: modificar `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Tests RED** — en `describe('runBattery')`: `N=1 con SCENARIOS=r1 lanza solo r1-1 y juzga 1/1` (`launched` = `['r1-1']`, log contiene `r1 · 1/1 · umbral 1/1 · verde`); `N=3 sobre r1 (n = 2) lanza r1-1, r1-2 y r1-3 con umbral 3/3`; `N=1 sin SCENARIOS ni STEPS deja n = 1 en todos` (ninguna etiqueta `-2`); `N=01 deja n = 1 y umbral 1/1`; `it.each(['0', 'dos'])` `N=%s para con código 2 y no lanza` (`rejects.toMatchObject({ code: 2, message: \`N tiene que ser un entero positivo: ${v}\` })`, `launched` vacío). En `describe('verdict')`: `con n juzga sobre esa n` (`verdict(TABLE, OUT, [], fs, '1')` con solo `r1-1` guardado → `r1 · 1/1 · umbral 1/1 · verde`) y `con n = 0 para con código 2`.
- [ ] **Step 2: Implementación** — `withN` como en Interfaces; `batteryPlan` aplica `withN(rows, env.N)` tras cruzar `SCENARIOS` y `STEPS`; `verdict` aplica `withN(selectSteps(...), n)`; `main` pasa `process.env.N` a `verdict`.
- [ ] **Step 3: Verificación** — el Vitest de la task, verde.
- [ ] **Step 4: Docs** — `tech-stack.md:137`: la receta de la copia con junctions se sustituye por «Un humo con n = 1 sobre una batería de n = 2 va con `N=1`» (feature 0320), con el porqué de antes en una frase (la 0307 copió `tests/batteries/` con junctions); `:109` nombra `N` entre las variables de `run` y que `verdict` lo lee también.
- [ ] **Step 5: Humo real** — `git archive HEAD:dist` a `.temp/k320/kit`, y el comando de «Verificación»; si sale sin evidencia, una vez más con el sujeto de reserva. La línea y el coste van al ledger.
- [ ] **Step 6: Commit de la task** — `feat(headless): N= sustituye n y umbral en run y verdict`.

### Task 2 — un rango en la Suma

**Tras**: —
**Modelo**: Native, esta sesión
**Tests RED**: hilo principal · `cli/test/kit/headless/campaign.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/campaign.test.ts` → `Tests  <n> passed (<n>)`
**Se prueba en la aplicación**: no, porque herramienta del repo

**Interfaces**:
- Consume: nada
- Produce: `forecastSubjects(text)` devuelve `max(a, b)` para la celda `<a> a <b>`, con o sin « sujetos».

**Ficheros**: modificar `tests/headless/campaign.mjs`, `cli/test/kit/headless/campaign.test.ts`

- [ ] **Step 1: Tests RED** — en `describe('el techo de la previsión de la spec')`: `it.each([['2 a 4', 4], ['4 a 8 sujetos', 8], ['4 a 2', 4], ['5', 5]])` `lee «%s» como techo %i sin aviso` (`readConfig(baseEnv({ SUBJECT_CAP: undefined }), CWD, specFs(forecast(cell))).subjectCap` igual, y `capNotice` `undefined`); y `'2 a 4 sujetos por tanda'` añadido al `it.each` de «usa SUBJECT_CAP y avisa».
- [ ] **Step 2: Implementación** — el regex de `forecastSubjects` admite `(?:\s+a\s+([0-9]+))?` tras el primer número y devuelve el mayor; el comentario de la línea 33 dice que vale un número o un rango.
- [ ] **Step 3: Verificación** — el Vitest de la task, verde.
- [ ] **Step 4: Commit de la task** — `feat(headless): la Suma de la previsión admite un rango`.

### Task 3 — `plan` suma n y prevé el coste

**Tras**: Task 1
**Modelo**: Native, esta sesión
**Tests RED**: hilo principal · `cli/test/kit/headless/battery.test.ts`
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/battery.test.ts` → `Tests  <n> passed (<n>)`; real: `node tests/headless/battery.mjs plan tests/batteries/sdd-propose/battery.md` → 65 líneas, la última `suma: 119 sujetos · coste previsto: <x.xx> $`; con `SCENARIOS` = los 58 ids de `control/out` de la 0306 → `suma: 107 sujetos`; y el backtest de la spec (decisión 13): `forecastCost` con un `fs` que oculta las carpetas de `specs/` desde `20261105-161645`, entre 57.14 y 85.72 $
**Se prueba en la aplicación**: no, porque herramienta del repo

**Interfaces**:
- Consume: `withN(rows, value)` (Task 1)
- Produce: `forecastCost(rows, specsRoot, fs)` → `{ cost: number | null, unmeasured: string[], fallback: number | null }`; `planLines(batteryPath, steps, env, specsRoot, fs)` → `string[]` (las líneas `<id> <modelo> <n>` y la de la suma). `fs` con `read`, `exists` y `list`; `fileFs` gana `list: (dir) => readdirSync(dir)`.

**Ficheros**: modificar `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Tests RED** — `describe('plan')`, con una batería sintética `a1` (n = 2, Petición `Haz A.`) y `b1` (n = 1, Petición `Haz B.`) y `SPECS = join(CWD, 'specs')`: carpeta `20261101-000000-feature-0001-x/red/out` con `a1-1` a 1.00 $; `20261102-000000-feature-0002-y/green/out` con `a1-1` a 0.40 $ y `a1-2` a 0.60 $; cada sujeto con `state.txt` = `## petición\nHaz A.\n## git status\n`. Tests: `suma y coste con la carpeta más reciente y la media para b1` → última línea `suma: 3 sujetos · coste previsto: 1.50 $ · sin precio medido: b1 (a 0.50 $, la media de los escenarios medidos)`; `no cuentan a10-1, otra petición, sin state.txt ni sin RESULTADO` (los cuatro en la carpeta reciente a 9.00 $ → la línea no cambia); `sin campañas que casen` → `suma: 3 sujetos · coste previsto: sin campañas guardadas de esta batería`; `sin la carpeta specs` → la misma línea; `con N=1, suma: 2 sujetos`; `con SCENARIOS=a1, suma: 2 sujetos · coste previsto: 1.00 $`; `salta ficheros sueltos de specs/` (un `spec.md` en la carpeta de spec no rompe nada); `con N=0 para con código 2`; y las líneas `a1 sonnet 2`, `b1 sonnet 1` antes de la suma.
- [ ] **Step 2: Implementación** — `forecastCost`: para cada carpeta de `list(specsRoot)` y cada fase de `list(<carpeta>)` con `<fase>/out` existente, cada `<id>-<k>.tools.txt` (regex `^(.+)-([0-9]+)\.tools\.txt$`) cuyo id está en `rows` y cuyo `state.txt` (CRLF normalizado) casa `^## petición\n<Petición>\n`: su último `=== RESULTADO (… turnos, <x> $` entra en la llave `id`, con su carpeta; precio por id = media de su carpeta mayor por nombre; `fallback` = media de esos precios; `cost` = Σ n × (precio ?? fallback), `null` sin ningún precio. `planLines` aplica `selectScenarios(words(env.SCENARIOS))`, `selectSteps(steps)` y `withN(…, env.N)`, y monta la línea de la spec. `main`: `plan` imprime `planLines(batteryPath, rest, process.env, join(REPO_ROOT, '.docs', 'sdd', 'specs'), fileFs)`.
- [ ] **Step 3: Verificación** — el Vitest de la task y las tres medidas reales; las cifras van al ledger.
- [ ] **Step 4: Docs** — cabecera de `battery.mjs`, línea de `plan`: `<id> <modelo> <n> por escenario, y la suma de n con el coste previsto (SCENARIOS y N como run)`; `tech-stack.md:141`: la previsión de sujetos y dólares sale de `battery.mjs plan` (feature 0320), y las cifras de la 0230 y la 0306 quedan como evidencia; `:109` nombra la línea de la suma.
- [ ] **Step 5: Commit de la task** — `feat(headless): plan suma n y prevé el coste con las campañas guardadas`.

### Task 4 — `run --resume` lanza solo lo que falta

**Tras**: Task 1
**Modelo**: Native, esta sesión
**Tests RED**: hilo principal · `cli/test/kit/headless/battery.test.ts`
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/battery.test.ts test/kit/headless/campaign.test.ts` → `Tests  <n> passed (<n>)`
**Se prueba en la aplicación**: no, porque herramienta del repo

**Interfaces**:
- Consume: `withN` (Task 1); `labelTaken(config, deps, label)` de `campaign.mjs`, que pasa a `export`.
- Produce: `runBattery(env, cwd, deps, { resume = false } = {})`.

**Ficheros**: modificar `tests/headless/battery.mjs`, `tests/headless/campaign.mjs`, `cli/test/kit/headless/battery.test.ts`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Tests RED** — con la tabla de juguete y `SCENARIOS='r1 d1'` (r1 n = 2, d1 n = 2): `--resume lanza solo lo que falta` (guardados `r1-1`, `r1-2`, `d1-1` → `launched` = `['d1-2']`, log contiene `reanudo: guardadas 3, lanzo 1`, y las líneas de `r1` y `d1`); `--resume con todo guardado no lanza y da el veredicto` (`reanudo: guardadas 4, lanzo 0`, `launched` vacío, líneas de `r1` y `d1`); `--resume con N=1 mira solo -1` (`reanudo: guardadas 2, lanzo 0`); `--resume salta una marca viva y lanza una muerta` (marca `battery.d1-2` en `RUNS/dry/live` con PID 7; `isAlive` → `true` no la lanza; `false` sí); `--resume cuenta lo guardado en el techo` (`spec.md` con Suma 3 en `SPEC`, sin `SUBJECT_CAP` → `d1-2` no se lanza y el log contiene el techo de 3 sujetos); `--resume con SCENARIOS mira solo lo filtrado`. Y los dos tests de hoy con el mensaje nuevo: `ya existe r1-1 en ${OUT}: borra esa carpeta, cambia PHASE o reanuda con --resume`.
- [ ] **Step 2: Implementación** — `export function labelTaken` en `campaign.mjs`; en `runBattery`, sin `resume`, `refuseSavedLabels` como hoy con el mensaje nuevo; con `resume`, las etiquetas `<id>-<i>` (i de 1 a n) con `labelTaken(config, deps, label)` salen de la tanda, el log dice `reanudo: guardadas <k>, lanzo <m>`, y `launchIndex` lanza solo los ids pendientes en ese índice; el veredicto se da siempre. `main`: `run` pasa `{ resume: batteryPath === '--resume' }`. Cabecera: `node battery.mjs run [--resume]`, que salta lo guardado.
- [ ] **Step 3: Verificación** — el Vitest de la task, verde.
- [ ] **Step 4: Docs** — `tech-stack.md:109`: `run --resume` lanza solo las etiquetas sin `tools.txt` ni sujeto vivo, y no relanza un sujeto guardado sin RESULTADO.
- [ ] **Step 5: Commit de la task** — `feat(headless): run --resume lanza solo las etiquetas que faltan`.

### Task 5 — la skill de una petición slash es la primera

**Tras**: —
**Modelo**: Native, esta sesión
**Tests RED**: hilo principal · `cli/test/kit/headless/battery.test.ts`
**Superficies**: tooling · docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/battery.test.ts` → `Tests  <n> passed (<n>)`; real: `node tests/headless/battery.mjs verdict tests/batteries/sdd-propose/battery.md .docs/sdd/specs/20261105-161645-feature-0306-propose-rework/control/out` → la línea de `c1` empieza por `c1 · 2/2 · umbral 2/2`
**Se prueba en la aplicación**: no, porque herramienta del repo

**Interfaces**:
- Consume: nada
- Produce: `slashSkill(state)` → el nombre cualificado o `null`; `readRuns` devuelve cada run con `state` (texto o `undefined`).

**Ficheros**: modificar `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Tests RED** — en `describe('verdict')`, con `f1` («Esperado» `sdd-kit:sdd-propose`, n = 1) y `tools.txt` con primera `>>> Skill: sdd-kit:sdd-grilling`: `it.each` de `state.txt` → resultado: `'## petición\n/sdd-kit:sdd-propose añade el motivo\n'` → `f1 · 1/1`; `'## petición\n/sdd-kit:sdd-propose\r\n'` → `1/1`; `'## petición\n/sdd-propose\n'`, `'## petición\n/clear\n'`, `'## petición\nAñade un filtro.\n'`, `'## git status\n'` y sin `state.txt` → `0/1`; `'## petición\n/sdd-kit:sdd-nope\n'` → `0/1`; y `/sdd-kit:using-sdd` con `tools.txt` `>>> Skill: sdd-kit:using-sdd` y luego `>>> Skill: sdd-kit:sdd-propose` → `1/1`.
- [ ] **Step 2: Implementación** — `readRuns` lee `<etiqueta>.state.txt` si existe; `slashSkill(state)`: la línea tras `^## petición\r?\n`, casada con `^\/([\w-]+:[\w-]+)(?:\s|$)`, distinta de `ROUTER`; `judge` compara `slashSkill(state) ?? firstSkill(text)` con «Esperado».
- [ ] **Step 3: Verificación** — el Vitest de la task y el veredicto real de la 0306.
- [ ] **Step 4: Docs** — `tech-stack.md:138`: «/sdd-kit:<skill>» en `claude -p` carga la skill sin `>>> Skill:`; desde la feature 0320 `battery.mjs verdict` la toma de `## petición` de `state.txt` (antes salía roja).
- [ ] **Step 5: Commit de la task** — `feat(headless): el veredicto cuenta la skill de una petición slash`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 2h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 5 tasks pequeñas sobre dos scripts con tests en proceso ya montados (`fakeDeps`, `memory-fs`); la incertidumbre es el humo real y la medida del backtest
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): las cinco conductas y el backtest dentro del ±20 %
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- S1 THEN lanza `c1-1` con `/1 · umbral 1/1` → Task 1, humo real. ✓
- S1 AND `N=1 verdict` da la misma línea → Task 1, `con n juzga sobre esa n` y el humo. ✓
- S1 AND `N=3`, `N=1` sin filtro, `N=0`/`N=dos` en `run`, `plan` y `verdict` → Task 1 (`run`, `verdict`) y Task 3 (`plan`: `N=0` añadido a sus tests). ✓
- S2 THEN «2 a 4» techo 4 sin aviso, y los AND → Task 2. ✓
- S3 THEN y los AND sintéticos → Task 3, `describe('plan')`. ✓
- S3 AND repo real (64 + 1 líneas, 119, 107, backtest ±20 %) → Task 3, Verificación real, al ledger y al walkthrough. ✓
- S4 THEN y los AND → Task 4. ✓
- S5 THEN real `c1 · 2/2` → Task 5, Verificación real. ✓
- S5 AND formas del slash → Task 5, `it.each`. ✓
- Tabla «Lo que se retira o cambia de forma» → Tasks 1, 3, 4 y 5 (tech-stack, cabecera, mensaje); `spec-template.md` y `run.mjs`, sin cambio (spec). ✓
- Review Focus → Task 1 (`N=01`), Task 3 (ficheros sueltos), Task 4 (`--resume` con `SCENARIOS`). ✓
