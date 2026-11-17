---
id: 20261101-150956-feature-0116-session-start-and-resume
feature: 0116
title: Plan de implementación — Arranque de sesión sin el kit y puerta para retomar
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Arranque de sesión sin el kit y puerta para retomar

## Decisiones que he tomado yo — valida estas

1. Modelo: las tres tasks en esta sesión (Opus 5.5); subagentes solo en la revisión final y los sujetos, Sonnet — el dev-lead eligió no parar para bajar de gama.
2. Ejecución: native — ver la línea de abajo.
3. La fuente del hook del proyecto es `hooks/project/sdd-kit-loaded.mjs`, dentro del plugin, y `installProjectHook` la copia: un test la ejecuta tal cual.
4. La migración lo instala con una opción nueva: `sdd upgrade --root <raíz> --project-hook`. Es mecánica y no pide gate.
5. Riesgo alto: que `session_id` difiera entre SessionStart y UserPromptSubmit, o que el tmpdir difiera entre hooks; lo decide el smoke de la Task 1, antes de instalar nada.
6. Coste estimado: 3 h y ~10 $.
7. Review Focus: 4 entradas que la spec no fija; ver la sección.

**Goal**: avisar con la ruta cuando la sesión no cargó el kit, y dar a «retoma» su puerta en `sdd-implement`.

**Architecture**: el hook del plugin marca la sesión; un hook del proyecto, que corre aunque el plugin no cargue, mira la marca en el primer mensaje. La puerta es una fila de `using-sdd`, las `description` y dos reglas de entrada.

**Tech Stack**: CLI TypeScript sin build, JS plano en `cli/bin/`, Vitest, baterías headless.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks con una sola interfaz entre ellas (la ruta de la marca, fijada por test), un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — contrato nuevo entre el plugin y un fichero copiado a cada proyecto.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. Texto humano en castellano con tildes.
- Toda lectura opcional de un hook se protege con `existsSync`, y cada rama lleva su test de «falta el fichero».
- Un hook nunca rompe la sesión: acaba con 0.
- `hooks/project/sdd-kit-loaded.mjs` usa solo módulos `node:*` y no importa nada del kit.
- Saldo de palabras de cada skill editada: igual o menor que `using-sdd` 524, `sdd-implement` 9.737 y 17.507 con referencias, `sdd-propose` 5.336 y 13.929.

### De proceso

- Política de modelos del Art. IV; final: Spec y Arquitectura opus+high, Código sonnet+high.
- Commits con `git commit -F <fichero del scratchpad>` (el hook de comandos bloquea tokens con barra).

## Review Focus

- `sdd-kit.json` roto o sin `version` → el aviso sale sin ruta, el hook acaba con 0 · Task 1, `warns without a route when the marker has no version`
- Dos mensajes en la misma sesión → un solo aviso · Task 1, `warns once per session`
- `hooks.UserPromptSubmit` con otra entrada del usuario → se conserva y se añade la nuestra · Task 2, `keeps the user prompt hooks of the project`
- Hook de plugin lanzado sin stdin → no se cuelga y sigue inyectando · Task 1, `injects without a session id`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin abstracciones; un fichero y una función de instalación.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `sessionStartOutput` no cambia de firma.
- [x] **Constitution check**: Art. I (RED hecho, previsión en la spec), V (migración), X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `hooks/project/sdd-kit-loaded.mjs` — el hook del proyecto.
- `cli/src/init/project-hook.ts` — `installProjectHook`.
- `cli/test/hook/project-hook.test.ts`, `cli/test/init/project-hook.test.ts`.

**Modificar**:

- `cli/bin/session-start.js`, `cli/bin/session-end.js`, `hooks/hooks.json` — marca.
- `cli/src/init/run.ts`, verbo de `sdd upgrade`, `README.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`.
- `skills/using-sdd/SKILL.md`, `skills/sdd-implement/SKILL.md`, `skills/sdd-implement/references/patch-flow.md`, `skills/sdd-propose/SKILL.md`.
- `tests/batteries/using-sdd/battery.md`, `tests/batteries/using-sdd/subject.mjs`.

**NO se tocan**: `versionWarning` y `migrationWarning`; `.claude/settings.json` de este repo (0198).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `session_id` distinto entre eventos | baja | alto | smoke de la Task 1 |
| Rodeo por `sdd-propose` persiste | media | medio | la `description`; una tanda de REFACTOR |
| Un recorte de `using-sdd` tumba `brainstorming` | baja | alto | batería entera |

### 1.8 Rollout

Con la 3.0.0, por init y migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La marca y el aviso

**Tras**: —
**Modelo**: esta sesión; effort de la sesión.
**Tests RED**: hilo principal · `cli/test/hook/project-hook.test.ts` y casos nuevos en `cli/test/hook/session-start.test.ts`.
**Superficies**: tooling
**Verificación**: `npx vitest run test/hook test/kit/hooks.slow.test.ts --test-timeout 120000` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: smoke con Haiku: sesión sin plugin → aviso en el primer `UserPromptSubmit`; con `--plugin-dir` → sin aviso.

**Interfaces**:
- Consume: nada.
- Produce: marca `join(tmpdir(), 'sdd-kit-sessions[-<uid>]', <session_id>)` (uid: enmienda de la spec); `sessionMarkerPath(id, base = tmpdir())` exportada de `cli/bin/session-start.js`; `hooks/project/sdd-kit-loaded.mjs`.

**Ficheros**: los de la marca y `hooks/project/sdd-kit-loaded.mjs`.

- [ ] **Step 1: Implementación**
  - `session-start.js`: `sessionMarkerPath(id, base)`; `runSessionStart` lee stdin dentro de `try`, valida `session_id` con `/^[A-Za-z0-9-]+$/`, escribe la marca y, con `source: 'resume'`, no escribe salida.
  - `session-end.js`: borra la marca y su `.warned`, sin romper si faltan.
  - `hooks.json`: SessionStart sin `matcher`.
  - `sdd-kit-loaded.mjs`: lee stdin; sin `.docs/sdd/` del proyecto, con marca o con `<id>.warned`, sale sin escribir; si no, crea `.warned` y escribe `{ systemMessage, hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext } }` con los literales de la spec (decisión 4); todo en `try`.
  - Tests, con `spawnSync(process.execPath, [script], { input, env: { TMP, TEMP, TMPDIR, CLAUDE_PROJECT_DIR, CLAUDE_CONFIG_DIR } })`: `warns with the route of the declared version`, `says the version is not cached`, `warns without a route when the marker has no version`, `warns once per session`, `stays silent with the marker`, `stays silent without .docs/sdd`, `exits 0 with broken input`, `uses the marker path of the plugin hook`; en `session-start`: `marks the session`, `injects nothing on resume`, `injects without a session id`.
- [ ] **Step 2: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 3: Verificación** — los tests y el smoke; sus resultados, en el ledger.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Instalar el hook en cada proyecto

**Tras**: Task 1
**Modelo**: esta sesión; effort de la sesión.
**Tests RED**: hilo principal · `cli/test/init/project-hook.test.ts`, caso en `cli/test/init/verbs.test.ts`.
**Superficies**: tooling, docs
**Verificación**: `npx vitest run test/init test/upgrade test/kit` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: no, porque es una escritura mecánica: la cubren los tests y la «Verificación» de la migración.

**Interfaces**:
- Consume: `hooks/project/sdd-kit-loaded.mjs`.
- Produce: `installProjectHook(root: string, pluginRoot: string): string[]`, que devuelve sus líneas de salida; `sdd upgrade --root <raíz> --project-hook`.

**Ficheros**: `cli/src/init/project-hook.ts`, `cli/src/init/run.ts`, el verbo de upgrade, `README.md`, `migrations/v3.0.0.md`.

- [ ] **Step 1: Implementación** — copia el script a `.claude/hooks/sdd-kit-loaded.mjs` y añade a `hooks.UserPromptSubmit` `{ hooks: [{ type: 'command', command: 'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/sdd-kit-loaded.mjs"' }] }` si ninguna entrada nombra ese fichero. Un `hooks` que no es objeto da `DomainError`, como `mergeNode`. `--finish` lo llama. Paso de la migración antes del marcador, y su línea `**Escribe**:` y su «Verificación». README: un párrafo. Tests: `installs the script and the entry`, `does not duplicate the entry`, `keeps the user prompt hooks of the project`, `refuses hooks that are not an object`; `--finish` deja los dos.
- [ ] **Step 2: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task**.

### Task 3 — La puerta de retomar

**Tras**: —
**Modelo**: esta sesión; sujetos Sonnet.
**Tests RED**: batería `using-sdd`, tramo `retomar`: RED en `red/out/` (rf1 0/2, rf2 2/2, rp1 0/2).
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; `BATTERY=using-sdd STEPS=retomar PHASE=green node tests/headless/battery.mjs run` → rf1, rf2 y rp1 verdes, y lectura a mano de que nadie repite lo hecho ni crea carpeta o `patch.md`.
**Verificación lenta**: batería entera, `PHASE=green-entera`, ~30 min, en segundo plano; `d1` leído a mano.
**Se prueba en la aplicación**: no, porque el kit se prueba con sujetos.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: las skills de §1.1, `tests/batteries/using-sdd/`.

- [ ] **Step 1: Molde** — corrige `PATCH` en `subject.mjs`: el fix es «si no hay reserva de ese día y franja, responde `no existe`; el test `cancelar respeta el día` pasa a usar `lun 10:00-12:00`». Relanza `rp1` con `PHASE=red2`.
- [ ] **Step 2: Implementación** — la fila, las `description` y las dos reglas, con la cola de cada skill recortada según la decisión 12 de la spec. Tabla «Procedencia de las reglas» de la batería: fila de la puerta.
- [ ] **Step 3: Verificación** — los comandos de arriba; recuento de palabras.
- [ ] **Step 4: Commit de la task**, con evidencia en `tests/session-start-resume-red.md` y `-green.md`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 3h
- Base de la estimación: 3 tasks, batería entera en segundo plano; incertidumbre en el rodeo por `sdd-propose`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama: `sdd-archive`, `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- Aviso con la ruta y literal → Task 1, `warns with the route of the declared version`. ✓
- Segundo mensaje sin aviso → Task 1, `warns once per session`. ✓
- Carpeta ausente → Task 1, `says the version is not cached`. ✓
- Sin `version` → `warns without a route…`; sin `.docs/sdd/` → `stays silent without .docs/sdd`. ✓
- Con plugin, `--plugin-dir` o al reanudar → `stays silent with the marker`, `marks the session`, `injects nothing on resume` y el smoke. ✓
- Si falla, sale con 0 → `exits 0 with broken input`. ✓
- Retomar: primera skill → batería, `rf1`, `rf2`. ✓
- Sin carpeta ni rama, sin repetir, por la Task 2, tras mirar la base → lectura de `tools.txt` de `rf1` y `rf2`. ✓
- Patch por el primer paso que falta → `rp1`, lectura de `tools.txt`. ✓
- Sin spec ni `patch.md`, a `sdd-propose` → regla existente de Setup, sin sujeto; control por lectura. ⚠
- Init deja el hook, una sola vez → Task 2, `installs…`, `does not duplicate…`, caso de `--finish`. ✓
- Migración deja el hook, sin duplicar, y `**Escribe**:` → Task 2, tests de `--project-hook` y lectura de la migración. ✓
- Review Focus → los cuatro tests nombrados. ✓
