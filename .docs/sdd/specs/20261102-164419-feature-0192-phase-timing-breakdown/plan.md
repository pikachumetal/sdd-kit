---
id: 20261102-164419-feature-0192-phase-timing-breakdown
feature: 0192
title: Plan de implementación — Desglose de tiempos por fase
spec: ./spec.md
status: done
created: 2026-11-02
---

# Plan de implementación — Desglose de tiempos por fase

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tres tasks en la sesión (Native); la revisión final con Spec y Arquitectura en `sdd-kit:effort-high` + `opus` y Código en `sdd-kit:effort-high` + `sonnet`. El eje Arquitectura corre en serie tras los otros dos, porque la confirmación de paralelizar de la spec nombra solo Spec y Código.
2. Ejecución: Native, por el motivo de la línea de abajo.
3. El clasificador trabaja con tramos (`Span`), no por entrada: `clock.ts` guarda los tramos de espera y de hueco, y de ahí salen sus totales; agente es el tramo de la fase menos lo demás. Así la suma cuadra por construcción, y cortar una fase es recortar tramos.
4. Con tramos, una espera dentro de una ejecución cuenta solo como espera, y un hueco dentro de una ejecución no existe, porque `clock.ts` no lo abre con una herramienta en curso.
5. El RED de `c1` corre al empezar la Task 1, antes de escribir código: decide si existe la línea `Esperas y huecos`.
6. Riesgo alto: ninguno. Coste: ~8,25 $ de techo en sujetos (spec, «Previsión de coste»).
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd session tokens --artifact` escriba `timing.json` por fases y `sdd estimation log` lo sume, con el % de ceremonia.

**Architecture**: `clock.ts` expone tramos y llamadas de cada transcript; `phases.ts` saca las fronteras de los eventos y reparte los tramos; `timing.ts` añade estimados y gate y escribe el fichero; `estimation/phases.ts` lee los ficheros y pinta la tabla.

**Tech Stack**: CLI en TypeScript sobre Node, tests con Vitest; sujetos con `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas por la interfaz de `timing.json`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulos nuevos `cli/src/session/phases.ts` y `timing.ts`, y el contrato `timing.json` entre `session` y `estimation`.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Lo que se conserva es el porqué no deducible. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- Las claves de `timing.json` van en inglés, en segundos enteros, sin marca de tiempo de generación.
- Margen: `|agente + ejecución + espera + hueco − reloj| ≤ máx(60 s, 1 % del reloj)`.

### De proceso

- Política de modelos: la de la decisión 1. Commits: tipo/scope en inglés, título y cuerpo en castellano.

## Review Focus

- Una herramienta en curso cuando acaba el transcript, sin resultado → no abre tramo de ejecución, como `clock.ts` hoy · Task 1, `una llamada sin resultado no cuenta como ejecución`
- Una frontera de fase que cae en mitad de un tramo de ejecución → el tramo se parte entre las dos fases · Task 1, `parte un tramo entre dos fases`
- `timing.json` ilegible en una carpeta al generar el log → aviso por stderr con su carpeta y la tarea no entra, sin romper el log · Task 2, `un timing.json ilegible avisa y no entra`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin verbo nuevo, y sin cambiar la tabla principal.
- [x] **YAGNI gate**: `Span` tiene más de tres usos reales (espera, hueco, ejecución y gate).
- [x] **Brownfield gate**: `clock.test.ts` sin tocar es la guarda; la salida sin `--artifact` no cambia.
- [x] **Constitution check**: Art. I (RED y previsión), Art. X, Art. XI (el log sigue generado).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/session/phases.ts` — eventos, fronteras y reparto de tramos por fase.
- `cli/src/session/timing.ts` — gate, estimados, margen y escritura de `timing.json`.
- `cli/src/estimation/phases.ts` — lee los `timing.json` y genera `## Tiempos por fase`.
- `cli/test/session/phases.test.ts`, `cli/test/session/timing.test.ts`, `cli/test/estimation/phases.test.ts`.
- `cli/test/session/fixtures/feature-0271/` — el fixture reducido.
- `tests/phase-timing-red.md`, `tests/phase-timing-green.md` — evidencia.

**Modificar**:

- `cli/src/session/clock.ts`, `session.ts`, `verbs.ts`, `format.ts` o `measure.ts` (la línea condicionada).
- `cli/src/estimation/log.ts` — añade la sección.
- `skills/sdd-archive/SKILL.md`, `skills/sdd-templates/templates/plan-template.md`, `walkthrough-template.md`.
- `tests/batteries/sdd-archive/battery.md` y `subject.mjs` — escenarios `f1` y `c1`.
- `.docs/sdd/estimation.md`, `.docs/sdd/architecture.md`.

**NO se tocan**: `cli/test/session/clock.test.ts` y `clock.slow.test.ts` (son la guarda); `cli/src/estimation/calibration.ts` y la tabla principal; `skills/sdd-upgrade/references/migrations/`.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Refactorizar `clock.ts` cambia el `Esfuerzo real` | Baja | Alto: la serie de calibración | Sus tests, sin tocar, y comparar `--json` de la 0271 y la 0287 antes y después |
| El fixture público filtra datos | Baja | Alto: repo público | Lista de campos permitidos, `extract.mjs clean` y el test de patrones |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El reloj por fases y `--artifact`

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: TDD del propio hilo.
**Superficies**: tooling.
**Verificación**: desde `cli/`, `npx vitest run test/session/ --test-timeout 120000` → `Tests  N passed (N)`; `npx tsc --noEmit` → sin salida.

**Interfaces**:
- Consume: nada.
- Produce: `timing.json`, con esta forma: `{ version: 1, branch, measured, clockSeconds, withinMargin, totals: { agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds }, gateCommand, phases: [{ name, ceremony, measured, reason?, agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds, estimateHours, tasks?: [{ task, source, done, agentSeconds, execSeconds, waitSeconds }] }] }`. Sin transcripts: `{ version: 1, measured: false, reason }`.

**Ficheros**: crear `cli/src/session/phases.ts`, `cli/src/session/timing.ts`, sus tests y el fixture; modificar `cli/src/session/clock.ts`, `session.ts`, `verbs.ts`.

- [ ] **Step 0: RED de `c1`** — añade `c1` y `f1` a `tests/batteries/sdd-archive/`: una feature hecha con el transcript sembrado (una espera de 45 min y otra de 12), estimación que da una desviación de más del 30 %. Sin pedirle la cita en la petición. Lanza n = 3 con el kit de hoy y escribe `tests/phase-timing-red.md`. Fallo: un sujeto escribe la causa sin horas y minutos medidos ni «sin medir». Limpio (0/3 fallan): el frente condicionado sale, y se dice en §3 del walkthrough.
- [ ] **Step 1: `clock.ts`** — añade `export interface Span { from: number; to: number }` y `export interface ToolCall extends Span { name: string; input: Json }`. `Timeline` gana `waitSpans`, `idleSpans`, `runSpans`, `calls`; `waitMillis` e `idleMillis` pasan a ser la suma de sus tramos. `runSpans`: de `tool_use` a su `tool_result` (salvo `AskUserQuestion`), y del cierre de turno a la notificación cuando el hueco acaba en una. `export function readTimelines(files, selector): Timeline[]`; `readClock` la usa. `Session` gana `timelines`.
- [ ] **Step 2: `phases.ts`** — `export function kitEvents(timelines: Timeline[], commits: Commit[]): KitEvent[]`; `export function phaseStarts(events): PhaseStarts`, con las reglas siguientes: `implementacion`, lo más temprano de `sdd-implement`, commit de apertura o primer `sdd task start`; `cierre`, lo más temprano de `sdd-archive`, `sdd-retro` o commit de cierre (solo con la rama fusionada); `revision`, el último `sdd-verify` anterior a `cierre` sin `sdd task start` detrás. El nombre de la skill se compara sin el prefijo `sdd-kit:`. `sdd task start|done` se reconoce con `/\btask (start|done)\b[^\n;&|]*?\s(\d+)(?=\s|$)/g`, en cada coincidencia del comando. `export function breakdown(timelines, starts): PhaseTimes[]`: agente = tramo − espera − hueco − (ejecución sin espera ni hueco). Fase sin evento: `measured: false`, `reason: 'sin eventos: su tiempo queda en <anterior>'`, con ese tiempo en la anterior.
  Tests de `phases.test.ts`: `abre cada fase con su evento`, `las fases no retroceden con un sdd-verify tras el cierre`, `sdd-retro abre el cierre`, `una fase sin eventos da null y su tiempo queda en la anterior`, `parte un tramo entre dos fases`, `una llamada sin resultado no cuenta como ejecución`, `las tasks salen de sdd task start y done marca done`, `sin eventos de task, tasks salen de los commits si coinciden con las del plan`, `si no coinciden, no hay tasks`.
- [ ] **Step 3: `timing.ts`** — `readGateCommand(docsPath)`: el literal de `- **Gate de cierre**: `<comando>``, `operations.md` antes que `tech-stack.md` (rutas de `resolveDocument`); `isGateCall(command, gate)`: segmentos por `&&`, `;` o `|`, el segmento empieza por la primera palabra del gate y contiene todas sus palabras, sin opciones ni sus valores (un `--x y` quita las dos). `readEstimates(folder)`: de `plan.md`; sin él, de `spec.md`. `writeTiming(folder, timing)`: JSON con dos espacios y salto final. Aviso por stderr: `timing.json fuera del margen: fases <a> s, reloj <b> s`.
  Commits de la rama (`commitsOf`, en `session/branches.ts`): con la rama sin fusionar, `git log --first-parent --no-merges --reverse --format=%cI <into>..<branch>`; fusionada, el mismo rango con `<merge>^1..<merge>^2`, del último merge en `into`.
  Tests de `timing.test.ts`: los THEN de los tres requisitos de la spec, con estos valores: gate 240 s y `vitest` 30 s → `gateSeconds: 240`, `execSeconds` 270; `moon run cli:test` no suma; `echo moon run kit:test-headless cli:typecheck cli:test` no suma; sin gate, `null`. Estimados 0.5, 1, 0.25, 0.25; lite 0.5, 1, `null`, `null`; sin nada, `null`. Fuera del margen: `withinMargin: false`, aviso y salida 0. Regenerar deja el fichero idéntico. Sin `--artifact` no escribe.
- [ ] **Step 4: `--artifact`** — opción de `sessionTokensVerb`; sin transcripts escribe el fichero con `measured: false`. La salida de texto no cambia.
- [ ] **Step 5: fixture** — con un script del scratchpad (no se versiona) reduce el transcript de la 0271 a los campos de la decisión 14 de la spec y lo pasa por `extract.mjs clean`. Test: `el fixture no lleva rutas de usuario ni emails`, `da las cuatro fases con withinMargin true`. Comprueba que `--json` de la 0271 y la 0287 da lo mismo que antes del Step 1: 1,40 h y 0,56 h.
- [ ] **Step 6 (solo si el RED lo exhibe): línea `Esperas y huecos`** — en `measure.ts`, tras `Medición`: `- Esperas y huecos: 14:59Z 45 min; 15:40Z 12 min`, hora de inicio de cada tramo. Ni con «no medido» ni en `--json`. Test: el THEN del requisito.
- [ ] **Step 7: Commit de la task**.

### Task 2 — La tabla del log

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: TDD del propio hilo.
**Superficies**: tooling.
**Verificación**: desde `cli/`, `npx vitest run test/estimation/ --test-timeout 120000` → `Tests  N passed (N)`.

**Interfaces**:
- Consume: `timing.json`, con `phases[].name|ceremony|measured|agentSeconds|execSeconds|waitSeconds|gateSeconds|estimateHours` y `withinMargin`.
- Produce: la sección `## Tiempos por fase` de `estimation-log.md`.

**Ficheros**: crear `cli/src/estimation/phases.ts` y `cli/test/estimation/phases.test.ts`; modificar `cli/src/estimation/log.ts`.

- [ ] **Step 1: tabla** — `export function phaseSection(folders: string[], warn: Warn): string[]`, al final de `formatLog`, tras la calibración. Cabecera `| Fase | n | Agente (h) | Ejecución (h) | Espera (h) | Gate (h) | % del trabajo | Ceremonia | Est (h) | Real (h) | Ratio |`, nombres con tilde, `formatNumber`. Línea: `Ceremonia: <X> % del trabajo (<n> tareas, <m> fuera por una fase sin eventos).`, sin la parte de `<m>` con `m` = 0. Sin datos: `Sin datos: ninguna tarea tiene timing.json.`
  Tests: el escenario de la spec, con la A y la B (`apertura` n 1, 11 %, ratio 0.5; `implementación` n 2, 89 %, ratio 1; `Ceremonia: 20 % del trabajo (1 tareas, 1 fuera por una fase sin eventos).`); `la tabla principal no cambia con timing.json`; `withinMargin false no entra y avisa`; `un timing.json ilegible avisa y no entra`; `sin datos`.
- [ ] **Step 2: Commit de la task**.

### Task 3 — El cierre lo escribe, y su saldo

**Tras**: Task 2
**Modelo**: la sesión (Native).
**Tests RED**: el RED de `c1` (Task 1, Step 0); `f1`, RED leído: hoy el paso no pasa `--artifact`.
**Superficies**: docs, skills.
**Verificación**: desde `cli/`, `npx vitest run test/kit/word-budget.test.ts test/kit/` → `Tests  N passed (N)`; `f1` y, si sigue el frente, `c1`, con `tests/headless/battery.mjs`.

**Interfaces**:
- Consume: `--artifact`, y la línea `Esperas y huecos` si existe.
- Produce: nada.

**Ficheros**: `skills/sdd-archive/SKILL.md`, `skills/sdd-templates/templates/plan-template.md`, `walkthrough-template.md`, `.docs/sdd/estimation.md`, `.docs/sdd/architecture.md`, `tests/phase-timing-green.md`.

- [ ] **Step 1: skill** — `sdd-archive` paso 2: comando con `--artifact <carpeta del artefacto>`, «`timing.json` goes in the closing commit»; salen «`Esfuerzo real` counts from the start of the session that opened the work, without waits» y «outside Claude Code the lines say «no medido»». Con el frente: «A deviation beyond ±30 % names its cause by the `Esperas y huecos` line, or says «sin medir»».
- [ ] **Step 2: plantillas** — `plan-template.md`: `- Estimación de revisión: <Zh>` y `- Estimación de cierre: <Zh>`, tras la de implementación. `walkthrough-template.md`: salen «(la línea abre con el total sumado: el log lee esa primera cifra, no la lista)» y «(«sin precio» si falta la tabla `pricing` de `sdd-kit.json` o un modelo en ella: el script no inventa precios)»; con el frente, la cita en «Causa de la desviación». Busca antes esas frases en `cli/test/kit/`: un test que las fije se actualiza.
- [ ] **Step 3: docs** — párrafo en `estimation.md` (fases, ceremonia, límites); fila de `timing.json` en `architecture.md`, recortando lo equivalente.
- [ ] **Step 4: saldo** — recuenta con el conteo de `word-budget.test.ts`: `sdd-archive` ≤ 4846 y 9915, `sdd-templates` ≤ 16796, kit ≤ 102448, `architecture.md` ≤ 2036.
- [ ] **Step 5: GREEN** — `f1` n = 1 y, con el frente, `c1` n = 3; `tests/phase-timing-green.md`.
- [ ] **Step 6: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,75h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,4h
- Estimación de cierre: 0,4h
- Base de la estimación: 3 tasks; CLI con módulo nuevo y una campaña de sujetos en segundo plano; referencia 0188 (0,99 h con 10 sujetos) y 0271 (1,40 h).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `sdd session tokens --artifact` sobre una feature real y `sdd estimation log`.
- [ ] Spec satisfecha: cada requisito tiene su task.
- [ ] Cierre de rama con `sdd-archive`; al fusionar, `sdd merge --push`.

---

## 4. Self-review (cobertura spec → tasks)

- «El cierre guarda el desglose»: fases en orden, `ceremony`, `tasks`, margen → Task 1, `phases.test.ts` y fixture. ✓
- agente + ejecución = `Esfuerzo real`; misma salida; sin `--artifact` nada; regenerar idéntico; claves en inglés → Task 1, `timing.test.ts`. ✓
- «Una fase sin eventos»: `null` y `reason`, suma, sin `tasks`, `source: "commits"`, sin transcripts → Task 1. ✓
- «El gate»: los cinco AND → Task 1, `timing.test.ts`. ✓
- «Cada fase lleva su estimado»: plan, lite y nada → Task 1, `timing.test.ts`. ✓
- «El log suma»: cabecera, filas, línea de ceremonia, tabla principal, fuera del margen, sin datos → Task 2. ✓
- «La causa…»: línea, orden, cita → Task 1 Step 6 y Task 3, `c1`; condicionado. ✓
- `MODIFIED` «El cierre rellena…» y `timing.json` en el commit → Task 3, `f1`. ✓
- Reglas (fuera del margen por stderr, gate de `operations.md` primero) → Task 1 y Task 2. ✓
- Fixture limpio → Task 1, Step 5. ✓
- Retirados: las dos frases de `sdd-archive` y las dos de la plantilla → Task 3, y el GREEN `f1`. ✓
- Review Focus → sus tres tests. ✓
