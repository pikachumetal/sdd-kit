---
id: 20261022-140232-feature-0208-dev-validation-script
feature: 0208
title: Plan de implementación — Validación del dev con guion desde el reporte
spec: ./spec.md
status: approved
created: 2026-10-22
---

# Plan de implementación — Validación del dev con guion desde el reporte

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**, con la sesión como implementadora: 3 tasks encadenadas (la referencia nombra el verbo y el panel de la Task 1), y un error lo caza el test de su task o el GREEN; el plan cabe en un contexto. La revisión final, en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`, Arquitectura `sdd-kit:effort-high` + `opus`.
2. **El verbo bloquea hasta SIGINT o SIGTERM**: `run()` resuelve al parar el servidor; la lógica vive en `startValidationServer()`, que los tests usan directamente sin lanzar procesos.
3. **El panel es un único fichero**, `validation-panel.js`, que se inyecta tal cual en Chrome y que la página del plan B carga desde `/panel.js`; en el plan B, la página pone `window.sddValidationPanelOnChange`, y el panel lo llama tras cada marca con `read()` (el contrato de la decisión 7 de la spec no cambia).
4. **Las marcas del plan B entran por `POST /mark`** con `{id, status?, comment?}`; el servidor fija `markedAt` al cambiar `status`. La página no envía la lista entera: así el 400 por id o estado se comprueba marca a marca.
5. **El GREEN usa el kit de la rama**, exportado con `git archive HEAD` a `.temp/kit-green/` tras el commit de la Task 2.
6. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
7. Coste: ~5 h; campaña restante ~14 sujetos Sonnet, ~3,5 $.

**Goal**: el guion de la validación manual se compone desde el reporte, se ensaya antes y no compite con el entorno, y la persona marca sus resultados en un panel que el agente lee.

**Architecture**: la receta vive en una referencia de `sdd-archive`, que el paso 1 y los dos sitios que hoy describen el guion nombran. El panel es un JS sin dependencias que la sesión inyecta con Claude in Chrome, o que sirve un verbo nuevo de la CLI sobre `node:http` cuando no hay Chrome.

**Tech Stack**: Node 22.18+ con TypeScript por type stripping, Vitest (`cli/test/`), Pester para frases y topes (`tests/*.Tests.ps1`), baterías headless (`tests/headless/battery.sh`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas por el contrato del panel y del verbo, un error lo caza el test de su task o el GREEN, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — módulo nuevo `cli/src/validation/` y un contrato entre la skill y la CLI (`validation-panel.js`, `sdd validation serve`)

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen la constitution, una spec, una task, un requisito ni `capabilities/`; nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; mensajes en castellano con tildes.
- `cli/package.json` sin `dependencies`: solo `node:` (`node:http`, `node:fs`, `node:path`).
- El servidor escucha solo en `127.0.0.1`, puerto `0`.
- Textos literales: `panel: http://127.0.0.1:<puerto>/` · `<ruta>: no es una lista de pasos {id, title}` · `uso: sdd validation serve --steps <fichero> --out <fichero>`.
- Claves de `localStorage` con el prefijo `sdd-validation-`: `sdd-validation-<id>` y `sdd-validation-panel-src`.
- Skills en inglés; lo que leen las personas, en castellano.

### De proceso

- Política de modelos de `sdd-implement`; `fable` y `opus xhigh` prohibidos por defecto.
- Ejecución Native; sujetos de la batería en Sonnet, de 2 en 2, con `SUBJECT_CAP=22` y `COST_CAP=15`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- `--out` apunta a una carpeta sin permiso de escritura → sale con 1 y el mensaje del sistema, sin escuchar · Task 1, `serve fails before listening when --out cannot be written`
- Dos `POST /mark` seguidos al mismo paso (OK y luego KO) → queda el último, con su `markedAt` nuevo · Task 1, `the last mark of a step wins`
- La app recarga mientras la persona escribe un comentario → el comentario escrito antes de la recarga sigue tras reinyectar · Task 3, verificación a mano (`verification/panel.md`, recargas)
- El agente, sin Chrome y con prisa, pide copiar y pegar los resultados en vez del plan B → G6 del GREEN · Task 2

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el panel del spike se reutiliza; el plan B es un servidor de una página.
- [x] **YAGNI gate**: sin capa de abstracción para Chrome o la CLI: el mismo fichero en los dos.
- [x] **Brownfield gate**: un verbo más en `VERBS`, con el patrón de `cli/src/<sustantivo>/verbs.ts`.
- [x] **Constitution check**: Art. I (RED hecho, GREEN previsto), Art. III, Art. VIII (plantillas solo en `sdd-templates`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-archive/references/validation-panel.js` — el panel: `mount`, `read`, `clear` y `onChange`.
- `skills/sdd-archive/references/dev-validation.md` — la receta: guion, entorno, nada contra el entorno, panel en Chrome, plan B, registro.
- `cli/src/validation/server.ts` — `parseSteps`, `startValidationServer`.
- `cli/src/validation/verbs.ts` — `validationServeVerb`.
- `cli/test/validation/serve.test.ts` — tests del verbo y del servidor.
- `.docs/sdd/specs/<carpeta>/verification/panel.md` — evidencia de la Task 3.
- `tests/dev-validation-green.md` — evidencia del GREEN.

**Modificar**:

- `cli/src/cli/verbs.ts` — registra `validationServeVerb`.
- `skills/sdd-archive/SKILL.md` — paso 1, rama `manual`: puntero a `dev-validation.md`.
- `skills/sdd-start-feature/SKILL.md` — paso 7: la descripción del guion pasa a puntero.
- `skills/sdd-implement/SKILL.md` — parada de `pair`: «shaped like step 7 of `sdd-start-feature`» pasa a puntero.
- `skills/sdd-templates/templates/operations-template.md`, `plan-template.md`, `spec-template.md` — decisiones 11 y 12 de la spec.
- `tests/WordBudget.Tests.ps1` — topes de la spec.
- `tests/batteries/sdd-archive/battery.md` — procedencia de G1-G6 si hace falta.

**NO se tocan**:

- `.docs/sdd/capabilities/` — los fusiona el cierre.
- `skills/sdd-config/` — la pregunta de `validation.startEnvironment` ya existe.

### 1.6 Dependencias

- Feature 0209 (`.temp/` por worktree), ya en `develop`.
- Research de la 0162 (`probe/app`, `probe/panel.js`) para la verificación a mano.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La extensión de Chrome no está conectada en esta sesión | media | la Task 3 queda sin verificar | `list_connected_browsers` primero; si falla, `no probado` con su motivo en `verification/panel.md` y en el walkthrough |
| `sdd-archive` no cabe en 3.920 palabras | media | sube otro tope sin aprobar | puntero corto en el paso 1; el detalle va en la referencia |
| El GREEN de G4 sigue fallando | media | una vuelta de REFACTOR (4 sujetos) | tabla de racionalizaciones con las frases de `g4` |

### 1.8 Rollout

Directo, con la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `sdd validation serve` y el panel

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/validation/serve.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/validation` → `Tests  N passed (N)` · `pnpm --dir cli exec tsc --noEmit` → sin salida
**Se prueba en la aplicación**: no, porque es base común: la usa la referencia de la Task 2

**Interfaces**:
- Consume: nada
- Produce:
  - `validation-panel.js` define `window.sddValidationPanel = { mount(id: string, steps?: {id, title}[]), read(): Mark[], clear() }` y llama a `window.sddValidationPanelOnChange?.(read())` tras cada marca o comentario. `Mark = {id, title, status: 'pending'|'ok'|'ko', comment: string, markedAt: string|null}`. Claves `sdd-validation-<id>` y `sdd-validation-panel-src`. `mount(id, steps)` conserva las marcas guardadas de ese `id` si existen; con otro `id` empieza de cero.
  - `parseSteps(text: string, path: string): Step[]` — lanza `UsageError('<path>: no es una lista de pasos {id, title}')` si no es JSON, no es lista, está vacía, repite un id o un `title` no es texto.
  - `startValidationServer(options: {steps: Step[], out: string, panelSource: string}): Promise<{url: string, close(): Promise<void>}>`.
  - `validationServeVerb`: `noun: 'validation'`, `verb: 'serve'`, opciones `steps` y `out` (string), summary «Sirve el panel de validación y guarda las marcas».

**Ficheros**: crear `skills/sdd-archive/references/validation-panel.js`, `cli/src/validation/server.ts`, `cli/src/validation/verbs.ts`, `cli/test/validation/serve.test.ts`; modificar `cli/src/cli/verbs.ts`

- [ ] **Step 1: Tests RED** — en `serve.test.ts`, con un `pasos` de dos pasos de la spec (`libres 10:00-12:00 → «Sur»`, `cancelar mie 10:00 → «no hay reserva mie 10:00»`) y `out` en un directorio temporal sin la carpeta `validation/`:
  - `serves the page with every step on 127.0.0.1`: `url` empieza por `http://127.0.0.1:`; `GET /` contiene los dos `title` y `<script src="/panel.js">`; la carpeta de `out` existe.
  - `writes all steps pending at start`: `out` y `GET /results` dan los dos con `status: 'pending'`, `comment: ''`, `markedAt: null`.
  - `stores a mark and returns it in results`: `POST /mark {id: '1', status: 'ok'}` → 200; `out` y `/results` dan el 1 en `ok` con `markedAt` ISO 8601, el 2 en `pending`.
  - `the last mark of a step wins`.
  - `rejects a foreign origin with 403`: con `Origin: http://evil.example` → 403 y `out` sin cambios; con `Host: localhost:<puerto>` → 403.
  - `rejects an unknown step or status with 400`: `{id: '9', status: 'ok'}` y `{id: '1', status: 'hecho'}` → 400, `out` sin cambios.
  - `parseSteps rejects bad step lists`: `'no json'`, `'{}'`, `'[]'`, dos ids `'1'`, `title: 3` → `UsageError` con `<ruta>: no es una lista de pasos {id, title}`.
  - `serve without --steps exits 2 with usage`: `run(['validation', 'serve', '--out', 'x.json'], io)` → 2, stderr contiene `falta la opción --steps` y `uso: sdd validation serve`.
  - `serve fails before listening when --out cannot be written`: `out` dentro de un fichero que existe (no una carpeta) → `startValidationServer` rechaza.
  - `help lists validation serve`: `run(['--help'], io)` contiene `sdd validation serve`.
- [ ] **Step 2: Implementación** — el panel, desde `probe/panel.js` de la 0162, con el contrato de «Interfaces»; `server.ts` con `parseSteps` y `startValidationServer` (`GET /`, `GET /panel.js`, `GET /results`, `POST /mark`; 403 si `Host` no es `127.0.0.1:<puerto>` o un `Origin` presente no es `http://127.0.0.1:<puerto>`); `verbs.ts` lee `--steps`, lee el panel de `../../../skills/sdd-archive/references/validation-panel.js` relativo al módulo, imprime `panel: <url>` y resuelve con 0 al recibir `SIGINT` o `SIGTERM`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd validation serve y el panel de validación`.

### Task 2 — La receta de la validación del dev

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: el RED de la spec (`tests/dev-validation-red.md`, `g1`-`g4`)
**Superficies**: docs (skills, plantillas)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1, tests/Templates.Tests.ps1 -CI"` → `Tests Passed: N, Failed: 0` · `pnpm --dir cli exec vitest run test/docs-claims.test.ts` → verde · GREEN: `BATTERY=sdd-archive STEPS="script-report hands-off start-env hands-off-rush" PHASE=green KIT_DIR=.temp/kit-green RUNS_DIR=.temp/runs SUBJECT_CAP=22 COST_CAP=15 SUPERPOWERS_DIR=<superpowers 7.0.0> bash tests/headless/battery.sh`, y los controles `a1` y `a2` ×1
**Verificación lenta**: el GREEN · ~20 min
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba con la batería

**Interfaces**:
- Consume: `validation-panel.js` (`mount(id, steps)`, `read()`, `clear()`), `sdd validation serve --steps <fichero> --out <fichero>` y su línea `panel: <url>`
- Produce: `skills/sdd-archive/references/dev-validation.md`

**Ficheros**: crear `skills/sdd-archive/references/dev-validation.md`, `tests/dev-validation-green.md`; modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `skills/sdd-implement/SKILL.md`, las tres plantillas, `tests/WordBudget.Tests.ps1`

- [ ] **Step 1: Referencia** — `dev-validation.md`, en inglés, con la forma de `e2e-suite.md` (cuándo se carga, pasos en orden y «Common Rationalizations»):
  1. **The script**: decisión 4 de la spec, con el ejemplo del patch 0008.
  2. **The environment**: decisión 5.
  3. **Hands off**: decisión 6, con las frases de `g4` en la tabla.
  4. **The panel in Chrome**: decisión 7, con el contrato y las cuatro reglas literales.
  5. **Plan B**: decisión 9.
  6. **The record**: decisión 8, con el registro `Validado: <fecha> · panel: <n>/<n> OK · «listo»`.
- [ ] **Step 2: Punteros** — `sdd-archive` paso 1, rama `manual`: «the test script and how the person marks it follow [dev-validation.md](references/dev-validation.md)»; `sdd-start-feature` paso 7: la descripción del guion («El guion de pruebas son pasos numerados…» hasta «…remitió a «los cuatro comandos de arriba»» se queda en lo visual) pasa a «el guion, el entorno y el panel siguen `../sdd-archive/references/dev-validation.md`»; `sdd-implement` parada de `pair`: «shaped like step 7 of `sdd-start-feature`» pasa a «shaped as `../sdd-archive/references/dev-validation.md` says».
- [ ] **Step 3: Plantillas** — decisiones 11 y 12 de la spec.
- [ ] **Step 4: Topes** — los de la spec; `sdd-start-feature` a lo medido.
- [ ] **Step 5: GREEN** — commit, `git archive HEAD` a `.temp/kit-green/`, la batería; puntuar G1-G6 y escribir `tests/dev-validation-green.md`. Si una fila falla, una vuelta de REFACTOR dentro del techo.
- [ ] **Step 6: Commit de la task** — `feat(sdd-archive): guion de la validación desde el reporte, ensayado y con panel`.

### Task 3 — El panel en Chrome, a mano

**Tras**: Task 2
**Modelo**: la sesión (Native), con las herramientas `claude-in-chrome`
**Tests RED**: ninguno: verificación a mano (decisión 10 de la spec)
**Superficies**: tooling
**Verificación**: `verification/panel.md` con cada paso → resultado → hora
**Se prueba en la aplicación**: sí: la app del spike de la 0162 (`probe/app`), levantada con Vite en un puerto libre

**Interfaces**:
- Consume: `validation-panel.js`
- Produce: `verification/panel.md`

**Ficheros**: crear `.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/verification/panel.md`

- [ ] **Step 1** — levantar `probe/app`, conectar el navegador e inyectar el panel con `mount('0208', [3 pasos])`, más `read_network_requests` y `read_console_messages` con `clear: true`.
- [ ] **Step 2** — marcar 2 OK y 1 KO con comentario; 3 recargas con reinyección y `mount('0208')`; leer con `read()`.
- [ ] **Step 3** — un KO con «Guardar (petición 500)» y «Exportar (error de consola)», leídos, y una captura.
- [ ] **Step 4** — `mount('0209', [1 paso])` en el mismo origen: empieza sin marcas; `clear()`.
- [ ] **Step 5** — parar la app por su PID; commit `test(sdd-archive): verificación a mano del panel en Chrome`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 5h
- Base de la estimación: 3 tasks; la 0207 (una referencia de `sdd-archive` con batería) cerró en ~6 h; aquí, más un verbo pequeño de la CLI
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` «El trabajo se valida…», AND del guion → Task 2, G1-G3 del GREEN. ✓
- `feature-flow` «El guion de pruebas empieza con el entorno parado…», AND nuevos → Task 2, G5 de `g3`. ✓
- `archive` «El guion de la validación empieza por el reporte…»: THEN y AND de reporte, dato, ensayo e invento → Task 2, G1-G3 de `g1`; `no ensayado` → Task 2, revisión del texto de la referencia (ningún molde tiene una pantalla sin detector). ⚠ avisado: sin escenario de sujeto
- `archive` «Mientras la persona prueba…» → Task 2, G4 de `g2` y `g4`. ✓
- `archive` «La persona valida con un panel…» → Task 3 (inyección, reglas, recargas, KO, otra validación), y el registro `Validado` y la validación parcial → Task 2, texto de la referencia. ⚠ el registro con el panel no lo observa ningún sujeto (sin Chrome)
- `archive` «Sin Claude in Chrome, el panel lo sirve la CLI» → Task 2, G6; `.temp/` sin ignorar → texto de la referencia. ✓
- `cli` «La CLI se ejecuta con Node…» → Task 1, `help lists validation serve`. ✓
- `cli` «`sdd validation serve` sirve el panel…» → Task 1, los tests del Step 1. ✓
- «Lo que se retira o cambia de forma» → Task 2, Steps 2 y 3. ✓
- Review Focus → Tasks 1 y 3. ✓
