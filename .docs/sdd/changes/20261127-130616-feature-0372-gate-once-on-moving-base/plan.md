---
id: 20261127-130616-feature-0372-gate-once-on-moving-base
feature: 0372
title: Plan de implementación — Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera
spec: ./spec.md
status: approved
created: 2026-11-27
---

# Plan de implementación — Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en el hilo (Native), que corre en Opus 5.5; los sujetos de la batería, `sonnet`, como fija cada fila — por qué: dos tasks cortas de texto, y la sesión ya tiene el contexto del diseño.
2. Ejecución: native — ver la línea `Ejecución`.
3. Orden: primero la batería y su RED con las skills de `develop` (Task 1), después el texto de las skills y el GREEN (Task 2) — Art. I: la regla nueva no se escribe sin su RED.
4. Riesgo alto: que el GREEN de g8 salga 1/2 porque el sujeto sigue la regla vieja que otro sitio repite (`sdd-verify` punto 2). Mitigación: la Task 2 quita la regla de los cuatro sitios a la vez y la deja escrita en el paso 6, donde la 0305 midió que se sigue.
5. Coste estimado: ~2 h y 3,31 $ de sujetos (5,83 $ con la contingencia de la spec, decisión 13).
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: tras una gate de cierre verde, un fichero de «Sin filtro» que trae la base deja de repetir la gate entera en el cierre, y la batería de `sdd-archive` lo prueba.

**Architecture**: cambio de texto en cuatro sitios que hoy mandan la gate entera por la base (paso 6 y literal del paso 9 de `sdd-archive`, «After the sync merge», punto 2 de «Running a gate», la plantilla de `operations.md`), con la regla escrita en el paso 6. La batería reescribe g8 y ajusta el molde y la rúbrica de av2.

**Tech Stack**: skills en Markdown (`skills/`, construidas a `dist/` con `moon run kit:build`); batería headless (`tests/headless/battery.mjs`) con los moldes de `tests/batteries/sdd-archive/subject.mjs`; Vitest para `cli/test/kit/word-budget.test.ts`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas (el GREEN de la Task 2 usa los moldes y la rúbrica de la Task 1), un error lo caza el RED/GREEN de la batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, una plantilla y moldes de batería; ningún módulo, dependencia ni contrato.

## Restricciones globales

### De código

- Ninguna skill se alarga: el saldo de palabras de `sdd-archive`, `sdd-verify` y `sdd-templates`, contadas juntas, queda igual o baja (regla 6 de `CLAUDE.md`); los topes de `cli/test/kit/word-budget.test.ts` no cambian.
- Las skills se escriben en inglés (Art. III); los literales que el agente escribe, en castellano y tal cual: `saltada (solo la toca la base)`, `saltada (la base no toca sus inputs)`, `(sin filtro: cambia el build)`.
- Sin comentarios que repitan el código ni que citen documentos (Art. X).

### De proceso

- Sujetos en `sonnet`, por tandas, hasta `control.maxParallelAgents` (3).
- Commits: tipo/scope en inglés, título y cuerpo en castellano; `git commit -F <fichero>` del scratchpad.

## Review Focus

- Un sujeto que, sin gate entera, tampoco calcula el cruce y pone las dos tareas como saltadas a ojo → G8b exige el porqué de cada tarea sin cambiarlos · Task 1, rúbrica G8b.
- Un sujeto que lee «Running a gate» de `sdd-verify` antes que el paso 6 y corre la gate entera por el `package.json` de la base → el punto 2 deja de nombrar la base · Task 2, `grep` de «what the base brought» en `skills/sdd-verify/SKILL.md` sin resultado, y el GREEN de g8.
- Un sujeto que, sin nada que correr, para a preguntar en lugar de fusionar → G8c · Task 1, rúbrica G8c.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se quita una excepción; no se añade campo ni código.
- [x] **YAGNI gate**: dos funciones de molde nuevas, una por escenario.
- [x] **Brownfield gate**: `cli/src/merge/` intacto; la regla de la rama no cambia.
- [x] **Constitution check**: Art. I (RED antes de escribir la regla), Art. III (inglés), regla 6 de `CLAUDE.md` (saldo).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-archive/SKILL.md` — paso 6, «The suite on the sync merge»: la última frase (`A file of «Sin filtro» from the base runs the gate without `--affected`, suite before or not, each task with `(sin filtro: cambia el build)`.`) se sustituye por la regla nueva; paso 9, punto 4: el literal pierde `(sin filtro: cambia el build) |`.
- `skills/sdd-archive/references/closing-suite.md` — «After the sync merge»: quita `without a file of «Sin filtro» from the base,`.
- `skills/sdd-verify/SKILL.md` — «Running a gate», punto 2: quita `—or, after `sdd merge --sync`, what the base brought—`.
- `skills/sdd-templates/templates/operations-template.md` — línea «Sin filtro»: `si la rama o la base tocan uno, el gate corre sin filtro` → `si la rama toca uno, el gate de cierre corre sin filtro`.
- `tests/batteries/sdd-archive/subject.mjs` — `developManifest` (nueva), `developAppTest` (nueva); `reservas-gate-lock` llama a `developManifest`; `reservas-rojo-cierre` añade `developAppTest`.
- `tests/batteries/sdd-archive/battery.md` — descripciones de `reservas-gate-lock` (línea 20) y `reservas-rojo-cierre` (línea 48); fila y razón de g8; rúbrica G8a-G8c; AV2b; procedencia (línea 264).

**NO se tocan**:

- `cli/src/merge/` — `--verify` ya cruza sin leer «Sin filtro» (spec, decisión 5).
- `.docs/sdd/capabilities/` — el delta lo funde `sdd-archive` al cerrar.
- `skills/sdd-validate/SKILL.md:28`, `skills/sdd-verify/SKILL.md:70` — hablan del arreglo, que es de la rama.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de g8 pasa con las skills de `develop` (el sujeto ya no corre la gate entera) | baja | sin RED no se escribe la regla (Art. I) | si pasa, se para y se dice: el RED decide |
| av2 deja de dar rojo con `developAppTest` (el test de la base rompe o no cruza) | media | av2 deja de probar lo suyo | antes de la tanda, el molde se monta en seco y se corre `node scripts/gate.mjs run bookings:test rooms:test --affected --base <sha de validated0010>` tras integrar: `bookings:test` sale y falla |

### 1.8 Rollout

Directo: entra en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — g8 y av2 con la base en movimiento, y su RED

**Tras**: —
**Modelo**: hilo principal (Native), Opus 5.5; sujetos `sonnet`.
**Tests RED**: hilo principal · g8 (N=2) y av2 (N=1) de `tests/batteries/sdd-archive/battery.md` con las skills de `develop`.
**Superficies**: tooling (batería)
**Verificación**: `SCENARIOS="g8" N=2` y `SCENARIOS="av2" N=1` con `node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md` y `KIT_DIR` el `dist/` de `develop`, como dice `operations.md` («`RUNS_DIR` en una ruta corta…»). Esperado RED: g8 0/2 (falla G8a o G8b: corre la gate entera por el `package.json`); av2 falla AV2b (el rojo sale en la pasada sin `--affected`).

**Interfaces**:
- Consume: `developRoomsTest()`, `developLockfile()`, `validated0010()`, `affectedGate()` de `subject.mjs`; `gate.json` del molde (`bookings:test`: `src/app.js`, `test/app.test.js`, `test/cancel.test.js`; `rooms:test`: `src/rooms.js`, `test/rooms.test.js`).
- Produce: `developManifest()` y `developAppTest()` en `subject.mjs`; rúbrica G8a, G8b, G8c y AV2b en `battery.md`.

**Ficheros**: modificar `tests/batteries/sdd-archive/subject.mjs`, `tests/batteries/sdd-archive/battery.md`

- [ ] **Step 1: Moldes** — en `subject.mjs`:
  - `function developManifest()`: llama a `developRoomsTest()`, saca `develop`, escribe `package.json` en la raíz (`{ "name": "salas", "private": true }` con salto de línea final), commit `chore: package.json (0015)`, vuelve a `feature/0010-cancel-reason`. Comentario de una línea con el porqué: un manifiesto de «Sin filtro» por la lista por defecto que no es input de ninguna tarea.
  - `function developAppTest()`: saca `develop`, añade a `test/app.test.js` un test que pasa con el código de `develop` (p. ej. que `run('listar', [])` no lanza), commit `test(bookings): … (0016)`, vuelve a la rama.
  - `'reservas-gate-lock'`: `developLockfile()` → `developManifest()`.
  - `'reservas-rojo-cierre'`: tras `developLockfile()`, `developAppTest()`.
- [ ] **Step 2: Batería** — en `battery.md`:
  - línea 20: `reservas-gate-lock`: `reservas-gate-base` con la 0015 que trae también un `package.json` raíz a `develop`, en «Sin filtro» por la lista por defecto e input de ninguna tarea.
  - línea 48: el rojo de `reservas-rojo-cierre` sale porque la 0016 de `develop` toca `test/app.test.js`, input de `bookings:test`: el cruce la corre tras `--sync`.
  - fila g8: razón `feature 0372: tras una gate de cierre verde, el package.json de la base no repite la gate entera, y la línea Gate: nombra cada tarea saltada con su porqué (ticket de la 0718 de document-manager §1)`.
  - rúbrica, sustituye G8a y G8b y añade G8c:
    - `| G8a Sin gate entera | g8 | tras \`sdd merge --sync\`, \`tools.txt\` tiene \`scripts/gate.mjs run\` sin \`--affected\`, o corre \`bookings:test\` o \`rooms:test\` |`
    - `| G8b Saltadas con su porqué | g8 | la línea \`Gate:\` del mensaje final no lleva \`bookings:test: saltada (la base no toca sus inputs\` (admite \`: <comando>\` antes del \`)\`) y \`rooms:test: saltada (solo la toca la base)\`, cada una con su porqué, o lleva \`(sin filtro: cambia el build)\` |`
    - `| G8c Fusionada | g8 | \`develop\` no gana el merge de \`feature/0010-cancel-reason\`, o \`--verified-at\` no es el sha de «Suite completa» del 4.1 del borrador ni el del commit de cierre |`
  - rúbrica, añade `| AV2b Rojo por el cruce | av2 | la pasada que da el rojo es \`scripts/gate.mjs run\` sin \`--affected\` |`
  - procedencia, línea 264: `Tras una gate de cierre verde, un fichero de «Sin filtro» de la base no repite la gate entera` · `feature 0372 (sustituye la regla de la 0236; ticket de la 0718 §1)` · `g8, av2`.
- [ ] **Step 2b: Molde en seco** — monta `reservas-rojo-cierre` y `reservas-gate-lock` con el modo en seco del lanzador (`node tests/headless/battery.mjs` `dry-run`, feature 0366) y comprueba: en g8, `git diff --name-only <sha validated0010> develop` da `package.json` y `test/rooms.test.js`; en av2, `test/app.test.js` también, y `node --test test/cancel.test.js` falla en la rama.
- [ ] **Step 3: RED** — `KIT_DIR` = `dist/` construido desde `develop` (`git worktree add --detach` de `origin/develop` en una ruta corta, `pnpm install`, `moon run kit:build`, copia de `dist/`). Esperado: g8 0/2, av2 falla AV2b. Guarda el resumen de la tanda en `red/` de la carpeta de la spec.
- [ ] **Step 4: Commit de la task** — `test(sdd-archive): g8 y av2 con la base que trae un manifiesto (0372)`.

### Task 2 — La base que trae un manifiesto no repite la gate entera

**Tras**: Task 1
**Modelo**: hilo principal (Native), Opus 5.5; sujetos `sonnet`.
**Tests RED**: los de la Task 1 (g8, av2), que deben pasar a verde.
**Superficies**: docs (skills, plantilla) · tooling (batería)
**Verificación**:
- `moon run kit:build kit:skill-size kit:own kit:copies` → `Tasks: … completed` sin fallos.
- `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts test/kit/operations-gate-fields.test.ts` → `Tests  N passed (N)`.
- GREEN: `SCENARIOS="g8" N=2` → 2/2; control `SCENARIOS="av2" N=1` → 1/1, con `KIT_DIR` el `dist/` de la rama.

**Interfaces**:
- Consume: g8 y av2 de la Task 1.
- Produce: el texto de las skills.

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/closing-suite.md`, `skills/sdd-verify/SKILL.md`, `skills/sdd-templates/templates/operations-template.md`

- [ ] **Step 1: Implementación** — mide antes las palabras (`word-budget.test.ts`) y:
  - `SKILL.md` paso 6: sustituye `A file of «Sin filtro» from the base runs the gate without `--affected`, suite before or not, each task with `(sin filtro: cambia el build)`.` por una frase de 19 palabras o menos que diga que un fichero de «Sin filtro» de la base no repite la gate entera: cuenta para el cruce como cualquier otro fichero (p. ej. `A file of «Sin filtro» from the base doesn't run the gate whole: it counts for the crossing like any other file.`).
  - `SKILL.md` paso 9, punto 4: `<tarea>: corrió <N>/<M> (sin filtro: cambia el build) | saltada (<porqué>)` → `<tarea>: corrió <N>/<M> | saltada (<porqué>)`.
  - `closing-suite.md` «After the sync merge»: `and, without a file of «Sin filtro» from the base, the gate runs where it crosses the branch` → `and the gate runs where it crosses the branch, a file of «Sin filtro» from the base too` (o más corto).
  - `sdd-verify/SKILL.md` punto 2: `If the branch —or, after `sdd merge --sync`, what the base brought— touches` → `If the branch touches`.
  - `operations-template.md`: `si la rama o la base tocan uno, el gate corre sin filtro` → `si la rama toca uno, el gate de cierre corre sin filtro`.
- [ ] **Step 2: Build** — `moon run kit:build`; `git grep -n "what the base brought— touches\|from the base runs the gate" -- skills dist` vacío.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; el saldo de palabras de las tres skills juntas, medido, ≤ 0 (previsto −22 a −15). GREEN g8 2/2 (con 1/2, otra tanda N=2), av2 1/1. Resumen en `green/` de la carpeta de la spec.
- [ ] **Step 4: Commit de la task** — `fix(sdd-archive): la base que trae un manifiesto no repite la gate entera tras una gate verde (0372)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks de texto y moldes; incertidumbre en el molde de av2 (Step 2b) y en el GREEN de g8 (la 0305 midió 0/2 con la regla fuera del paso 6).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: g8 GREEN 2/2 y el saldo de palabras ≤ 0
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `closing-suite` THEN: corre solo las tareas que tocan la rama y la base → sin cambios (requisito vigente, g5). ✓
- AND de la línea `Gate:` con las saltadas → g5 (vigente); en g8, Task 1, G8b. ✓
- AND `--verified-at <sha del merge de sincronización>` → vigente (g5). ✓
- AND solo `.docs/` → vigente. ✓
- AND gate sin filtro de base → vigente (spec, decisión 12). ✓
- AND conflictos → vigente (m1, m2). ✓
- AND nuevo: `package.json` raíz y `pnpm-lock.yaml` de la base no repiten la gate entera, sin `(sin filtro: cambia el build)` → Task 2, GREEN g8, G8a y G8b. ✓
- AND nuevo: todas saltadas → `--verified-at` el sha de la gate de cierre → Task 2, GREEN g8, G8c. ✓
- AND suites unitarias tras la sincronización → vigente (g7). ✓
- `verification` AND: `(sin filtro: cambia el build)` solo por la rama, en la gate de cierre o en un arreglo, no tras `--sync` → la marca de la rama: g7 (vigente); su ausencia tras `--sync`: Task 2, G8b. ✓
- `archive` «Límites» sin la cláusula de la base → Task 2, el texto del paso 6 y «After the sync merge»; la regla de la capacidad la funde el cierre. ✓
- Tabla «Lo que se retira»: `SKILL.md:44`, `closing-suite.md:31`, `sdd-verify/SKILL.md:67`, `operations-template.md:18`, `SKILL.md:52` → Task 2, Step 2 (`git grep` vacío). Capacidades → delta al cierre. g8, av2, `battery.md:20,48` → Task 1. ✓
- Rojo de la rama por el cruce → Task 1/2, av2 y AV2b. ✓
- Saldo de palabras ≤ 0 → Task 2, Step 3. ✓
- Review Focus → Task 1 (G8b, G8c), Task 2 (`git grep`, GREEN). ✓
