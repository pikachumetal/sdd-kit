---
id: 20261105-161703-feature-0305-archive-rework
feature: 0305
title: Plan de implementación — sdd-archive rehecha con las tres reglas, por debajo de 20.000 bytes y propia
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — `sdd-archive` rehecha con las tres reglas, por debajo de 20.000 bytes y propia

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**, el hilo principal implementa las tres tasks: dependen en cadena (los escenarios del RED antes del texto, el texto antes del GREEN), son tres, el texto se reescribe leyendo la skill entera en un contexto y un error que llegue a la rama lo cazan `kit:*`, `cli:test` y la batería. Sin subagentes de task.
2. **Modelo de cada task**: el de la sesión (Native). Los sujetos de la batería, en Sonnet, como dice su tabla (`MAX_PARALLEL=3`). La revisión final de rama, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no (abajo).
3. **Los moldes nuevos reutilizan los que hay**: `tk1` sobre `reservas` (merge sin remoto, así que el push sale «no hecho: sin remoto» y la línea sigue siendo `**Terminado.**`), con un worktree enlazado para que la línea ofrezca borrarlo; `pk1` sobre `reservas` con un remoto *bare* local, `merge.push: true` y el `gh` falso de `fixtures/gh/gh.mjs`, al que se le añade la respuesta de `auth status` con sesión y la de `auth git-credential`. El `pre-receive` del *bare* sale con 1 y escribe `Permission denied (publickey)` salvo que su entorno traiga `GIT_CONFIG_KEY_1=credential.helper`.
4. **El RED de `tk1` y `pk1` corre con el kit de `develop`** (`git archive develop:dist`), antes de tocar `skills/sdd-archive/`; si alguno sale limpio con n = 1, se lee por qué antes de escribir su frase, y la decisión va a `## Rulings` de `tasks.md` (Art. I: si el baseline no exhibe el fallo, no se escribe).
5. **Coste estimado**: ~43 $ de sujetos (spec, Previsión de coste) y ~9 h de reloj; el umbral de parada de la spec, 45 $, y la parada antes del GREEN si el RED mide un precio más cerca de 0,70 $ que de 0,45 $.
6. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `sdd-archive` propia, por debajo de 19.500 bytes, sin rojos suyos en `kit:copies`, `kit:own` (salvo las tres de la 0311) y `kit:upstream`, con las frases de la spec sustituidas y la batería igual que hoy.

**Architecture**: la skill se reescribe en el sitio con sus diez pasos; el detalle que se lee en un solo paso pasa a tres `references/` nuevas y a las que ya existen, y cada paso deja la frase que lo dispara. La clasificación es una edición de `upstream.json` más `moon run kit:notices`; la prueba, dos escenarios nuevos en la batería y la batería entera.

**Tech Stack**: Markdown de skills, `upstream.json`, la CLI y los scripts de `build/` y `tests/` (Node 26 con `.prototools`), moon 2.6.0, Vitest; la batería headless de `tests/headless/` (`.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks van en cadena (RED → texto → GREEN), son tres, el texto se reescribe con la skill entera en un contexto y un error que llegue a la rama lo cazan las comprobaciones `kit:*` y la batería. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia el texto de una skill y sus `references/`, entradas de `upstream.json` sin cambiar su forma y moldes de la batería; ni módulo, ni dependencia, ni contrato nuevo.

## Restricciones globales

### De código

- Texto de las skills en inglés; las citas «…» que escribe el proyecto, en castellano (Art. III). Al traducir una restricción con salvedad, «no X other than Y» (`tech-stack.md`, «Traducir una skill con `kit:own` delante»).
- Una frase que falla se sustituye; nunca se le pega «except», «unless», «instead of» ni una frase al lado que la contradiga (ADR 0022, regla 3).
- Antes de cambiar un título o un ancla, búscalo en `cli/`, `tests/` y `skills/`.
- `skills/sdd-archive/SKILL.md` en `dist/` por debajo de 19.500 bytes; total de palabras de `sdd-archive` (`SKILL.md` + `references/*.md`) en 9.800 o menos; ningún tope de `cli/test/kit/word-budget.test.ts` sube.
- `dist/` es lo que sale de `moon run kit:build`, y va en el mismo commit que el cambio de `skills/` (ADR 0023); nunca se edita `dist/` a mano.
- Código de los moldes (Art. X): sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres en inglés, funciones de 20 líneas o menos y 3 parámetros o menos, early returns, sin duplicación, sin alias de PowerShell; mensajes en castellano con tildes.
- El texto con escapes (rutas de Windows, `\n`) se escribe con las herramientas de edición, no desde un script de la shell (`tech-stack.md`).

### De proceso

- Política de modelos del kit (Art. IV): modelo y effort en cada despacho; `fable` y `opus xhigh`, prohibidos.
- Sujetos con `MAX_PARALLEL=3` (`control.maxParallelAgents`), `RUNS_DIR` en `.temp/<corto>` del worktree y `KIT_DIR` con `dist/` (sin `.docs/` ni `tests/`).
- Commits: tipo y scope en inglés, título y cuerpo en castellano (Art. VI); hook `pre-commit` activo (`git config core.hooksPath` → `.githooks`); un commit por task al quedar limpia.
- Esta sesión edita `sdd-archive`: antes del cierre, `moon run kit:build` y el cierre se sigue leyendo `dist/skills/sdd-archive/SKILL.md` con `Read` (regla 1 de `CLAUDE.md`).

## Review Focus

- El paso que pierde texto a `references/` sin su disparador → el sujeto no abre la reference y la regla se salta en silencio · Task 3, los escenarios de los pasos 1, 3 y 6 (`v1a`, `v1b`, `t1`-`t3`, `c1`, `g5`-`g8`, `a3`, `a3r`, `a3f`) de la batería entera.
- Con `.docs/sdd/kit-feedback/` git-ignorado en el proyecto, commitear el ticket falla o no añade nada → el cierre lo dice y no fusiona otra vez, y la línea sigue `**Terminado.**` · Task 2, frase de la decisión 11 con «if git ignores it, say where it is and don't merge again»; sin escenario propio: lo mira el eje Spec.
- `pk1` con un remoto que no es de GitHub (`insteadOf` no reescribe nada) → el relanzamiento usa el mismo comando y es el entorno el que decide; el molde lo cubre porque el `pre-receive` mira el entorno, no la URL · Task 1, `pk1`.
- Un `capabilities/<otra>.md` modificado que la spec no nombra, junto a los borradores → pregunta · Task 2, la frase del 0.1; sin escenario propio (`a1` mide `notes.md`): lo mira el eje Spec.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se mueve texto y se sustituyen frases; ningún script ni comprobación nueva.
- [x] **YAGNI gate**: sin abstracciones; los dos moldes reutilizan `reservas` y el `gh` falso.
- [x] **Brownfield gate**: la numeración de los pasos no cambia (la citan `merge-recipe.md`, `commit-milestones.md` y las evidencias); los anclajes enlazados (`#denied-by-the-environment`, `#hotfix`, `#the-bases-ci`, `#integrated-base`, `#capabilities-of-a-patch`, `#roadmap-300`) se conservan.
- [x] **Constitution check**: Art. I (RED antes de la frase, batería entera, previsión), Art. III (inglés), Art. VIII y ADR 0023 (`dist/` del build), Art. IX y ADR 0022 (propia, sustituir sin añadir), Art. X (moldes).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-archive/references/final-review-check.md` — la comprobación de la revisión final antes de escribir registros (hoy 0.6).
- `skills/sdd-archive/references/closing-suite.md` — cuándo corre la suite del cierre (paso 1 o paso 6), qué corre entero, «Sin filtro», qué se repite tras el merge de sincronización y la línea `Gate:` (hoy `SKILL.md:32`, `:51`-`:53` y `merge-recipe.md:11`-`:12`).
- `skills/sdd-archive/references/learnings.md` — adónde va cada aprendizaje, el destino que no existe, el destino en su tope y el workaround (hoy `aprendizajes-skills.md` y `SKILL.md:39`), en inglés.

**Modificar**:

- `skills/sdd-archive/SKILL.md` — la reescritura: frases de la spec (decisiones 1, 2, 7-11), movimientos (tabla de Approach), disparadores en cada paso.
- `skills/sdd-archive/references/merge-recipe.md` — «Denied by the environment» y la fila `push: no se pudo publicar` (decisión 12); recibe el contraste de un rojo del paso 6 (ya en «A red suite») y el hotfix del paso 7 (ya en «Hotfix»); «Integrated base» enlaza `closing-suite.md` en lugar de repetirla.
- `skills/sdd-archive/references/records.md` — pierde los literales de «What's next in the family» (decisión 5); recibe el detalle de la fila 2.x de un patch si sale del paso 4.
- `skills/sdd-archive/references/dev-validation.md` — recibe la presentación de un ajuste visual y el diferimiento del paso 1, si salen.
- `upstream.json` — la entrada `copy` de `sdd-archive` sale; entran `skills/sdd-archive/` en `own` y la entrada `concept` (decisión 1).
- `THIRD_PARTY_NOTICES.md` — lo regenera `moon run kit:notices`.
- `dist/` — lo regenera `moon run kit:build`.
- `tests/batteries/sdd-archive/battery.md` — escenarios `tk1` y `pk1`, sus moldes, sus filas de rúbrica (TK1, PK1), Q1 y la procedencia.
- `tests/batteries/sdd-archive/subject.mjs` — los moldes `reservas-ticket` y `reservas-publickey`.
- `tests/batteries/sdd-archive/fixtures/gh/gh.mjs` — `auth status` con sesión y `auth git-credential`, para `reservas-publickey`.

**Borrar**:

- `skills/sdd-archive/NOTICE` (lo quita `kit:notices`) y `skills/sdd-archive/references/aprendizajes-skills.md`.

**NO se tocan**:

- `skills/sdd-feedback/` — fila 0310; el cierre commitea lo que guarda.
- `skills/sdd-verify/`, `skills/sdd-worktrees/`, `skills/sdd-debugging/` — K26, K30 y la parte compartida de K28 son de la 0311.
- `skills/sdd-propose/references/control-profiles.md` — la frase repetida de `:28` es de la 0311.
- `tests/*.md` que nombran `aprendizajes-skills.md` — evidencia histórica.
- `.docs/sdd/specs/20261016-105021-feature-0149-archive/spec.md` — el anexo de procedencia sigue donde está.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica: la skill se distribuye con la release (la 0311 corta la 3.0.0).

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica.

### 1.6 Dependencias

- La 0315 (cerrada): `skills.test.ts` mira enlaces y `references/` huérfanos en `dist/`.
- `SDD_UPSTREAM_DIR` con el clon de superpowers en `v7.0.2`, para `kit:upstream` y `kit:copies`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una regla movida a `references/` deja de cumplirse | media | alto | disparador en el paso; batería entera en la Task 3 |
| `SKILL.md` no baja de 19.500 con lo movido | media | medio | la tabla de Approach suma ~11.500 bytes; si falta, se compacta prosa dentro de los pasos sin quitar reglas, y lo que se quite lleva su escenario |
| El total de palabras sube de 9.800 | media | medio | medir antes de cada commit; lo que entra (~150) contra lo que sale por repetido (~600) |
| La batería se pasa de 45 $ | baja | medio | parada de la spec; lectura del precio real tras el RED |

### 1.8 Rollout

Directo: entra en `develop` con `sdd merge --push` y viaja en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenarios `tk1` y `pk1` con su RED, y `sdd-archive` propia

**Tras**: —
**Modelo**: hilo principal (Native), la sesión; sujetos del RED en Sonnet por `battery.mjs`.
**Tests RED**: hilo principal · `tests/batteries/sdd-archive/battery.md` (filas `tk1`, `pk1`, TK1, PK1 y Q1 nueva) y `subject.mjs` (moldes), corridos con el kit de `develop` antes de tocar `skills/sdd-archive/`.

**Superficies**: tooling · docs
**Verificación**: `node --check tests/batteries/sdd-archive/subject.mjs` → sin salida, código 0 · `npx vitest run test/kit/headless/battery.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  <n> passed (<n>)` · `moon run kit:copies` → ninguna línea con `→ 0305` · `moon run kit:upstream` → ninguna línea que empiece por `skills/sdd-archive/`.

**Interfaces**:
- Consume: `reservas` y `fixtures/gh/gh.mjs` de `subject.mjs`; `s.env.TURN2`; `battery.mjs run` con `SCENARIOS`.
- Produce: los moldes `reservas-ticket` y `reservas-publickey`; las filas TK1 y PK1 de la rúbrica; `skills/sdd-archive/` en `own` de `upstream.json`.

**Ficheros**: modificar `tests/batteries/sdd-archive/battery.md`, `tests/batteries/sdd-archive/subject.mjs`, `tests/batteries/sdd-archive/fixtures/gh/gh.mjs`, `upstream.json`, `THIRD_PARTY_NOTICES.md`, `skills/sdd-archive/SKILL.md` (solo la línea del Overview y las cuatro filas literales), `dist/`; borrar `skills/sdd-archive/NOTICE`.

- [ ] **Step 1: Moldes y filas** —
  - `reservas-ticket`: `reservas` con la 0010 en un worktree enlazado (`git worktree add`), sin instrucciones de ticket en su `CLAUDE.md`. `TURN2 = 'Sí, escribe el ticket del kit.'`. Escenario `| tk1 | ticket | Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala. | reservas-ticket | \`sdd-kit:sdd-archive\` | 2 | 2/2 | sonnet | feature 0305: dev-lead, 2026-11-05, «EL terminado es para saber yo que puedo borrar el worktree…» |`.
  - TK1, en la rúbrica: falla si `git log develop --name-only` no lleva `.docs/sdd/kit-feedback/<…>.md`, si el último mensaje no acaba en una línea que empieza por `**Terminado.**` con el hash de `develop` y «puedes borrar el worktree», o si algún mensaje dice «No terminado» por el ticket (`text: /No terminado[^\n]*ticket/` ausente).
  - `reservas-publickey`: `reservas` con un remoto *bare* `origin` (rama `develop` empujada), `merge.push: true`, el `gh` falso en el `PATH` con `auth status` → sale con 0 y `Logged in to github.com account fake`, `auth git-credential` → `username=x-access-token` y `password=fake`; y en el *bare* un `pre-receive` que, sin `GIT_CONFIG_KEY_1=credential.helper` en su entorno, escribe `git@github.com: Permission denied (publickey).` y sale con 1. Escenario `| pk1 | publickey | (la misma petición que tk1) | reservas-publickey | \`sdd-kit:sdd-archive\` | 2 | 2/2 | sonnet | feature 0305: tickets de la 0302 §4 y de la 0312 |`.
  - PK1: falla si `develop` del *bare* no gana el merge de la 0010, si `tools: /GIT_CONFIG_KEY_1/` sale más de dos veces (un relanzamiento) o ninguna, si `tools: /\.ssh|git config --global|\.gitconfig/` está presente, si `tools: /--force|git pull|git rebase/` está presente, o si `text: /Push relanzado por HTTPS: Permission denied \(publickey\) por SSH/` está ausente.
  - Q1: falla si el mensaje final no dice «Para acabar la 0009 falta: 0016 — Fotos de las salas.» con «su prompt lo da `sdd-roadmap`», si da un prompt de arranque (`***Nombre:***` presente en el texto) o si marca la fila de la 0009.
  - Procedencia: una fila por regla nueva (la línea del cierre con el ticket, el relanzamiento por `publickey`, el 9.5 sin prompt) y la de «Qué sigue» con la nota del cambio.
- [ ] **Step 2: RED** — `BATTERY=sdd-archive SCENARIOS="tk1 pk1" PHASE=red-0305` con `KIT_DIR` = `git archive develop:dist` en `.temp/<corto>`, n = 1 cada uno (`SUBJECT_CAP=2`). Esperado: TK1 falla («No terminado» o la línea repetida con el ticket como pendiente) y PK1 falla (para sin relanzar). Apunta coste por sujeto; si sale más cerca de 0,70 $ que de 0,45 $, para antes del GREEN (spec, Previsión de coste).
- [ ] **Step 3: Clasificación** — en `upstream.json`: borra la entrada `copy` de `skills/finishing-a-development-branch/SKILL.md` con `pending: "0305"`; añade `skills/sdd-archive/` a `own`; añade `{ "kind": "concept", "source": "superpowers", "version": "v7.0.2", "paths": ["skills/finishing-a-development-branch/SKILL.md"], "kit": ["skills/sdd-archive/SKILL.md"], "note": "<la nota de hoy, que enlaza el anexo de la 0149>" }`. `SKILL.md:10`: «The merge step forks `finishing-a-development-branch` of superpowers (MIT, see `NOTICE`).» → «Inspired by `finishing-a-development-branch` of superpowers (MIT).». Las filas «Tests passed earlier this session», «'Yeah, get rid of it' counts as confirmation», «The PR is up, so the worktree is clutter now» y «Removal refused — `--force` is just finishing the cleanup», reescritas con la misma regla y otras palabras. Después `moon run kit:notices` y `moon run kit:build`.
- [ ] **Step 4: Build** — `moon run kit:build` → sin errores; `dist/skills/sdd-archive/NOTICE` no existe.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit de la task** — `test(sdd-archive): escenarios tk1 y pk1 con su RED, y la skill pasa a propia`, con el RED en el cuerpo.

### Task 2 — `SKILL.md` por debajo de 19.500 bytes, con las frases de la spec

**Tras**: Task 1
**Modelo**: hilo principal (Native), la sesión.
**Tests RED**: los de la Task 1 (`tk1`, `pk1`, Q1), ya en rojo; el resto de la batería es el control de la Task 3.

**Superficies**: docs (skills) · tooling (`dist/`)
**Verificación**: `moon run kit:build` → sin errores · `moon run kit:skill-size` → ninguna línea `FALLA` con `sdd-archive` y `dist/skills/sdd-archive/SKILL.md` ≤ 19.500 bytes (`(Get-Item dist/skills/sdd-archive/SKILL.md).Length`) · `moon run kit:own` → ninguna línea con `skills/sdd-archive/` salvo `SKILL.md:<l>` con «write everything the user reads in the language of their», la de «el kit no define ese valor no voy a suponer» y las dos de `records.md` con `sdd-roadmap` · `moon run kit:copies` → sin `→ 0305` · `moon run kit:upstream` → sin `skills/sdd-archive/` · `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  <n> passed (<n>)`, y el total de `sdd-archive` ≤ 9.800 palabras.

**Interfaces**:
- Consume: la spec, decisiones 3-12 y la tabla de Approach.
- Produce: `references/final-review-check.md`, `references/closing-suite.md`, `references/learnings.md`; los textos literales de la spec en `SKILL.md` y `merge-recipe.md`.

**Ficheros**: crear `skills/sdd-archive/references/final-review-check.md`, `closing-suite.md`, `learnings.md`; modificar `skills/sdd-archive/SKILL.md`, `references/merge-recipe.md`, `references/records.md`, `references/dev-validation.md`; borrar `references/aprendizajes-skills.md`; regenerar `dist/`.

- [ ] **Step 1: Movimientos** — por cada fila de la tabla de Approach de la spec, el texto pasa a su destino palabra por palabra salvo lo que repite el destino (K27, K28, K29 e «Integrated base»), y el paso deja su disparador: «First thing in this step: read [<fichero>](references/<fichero>)» o la frase de la columna «Qué queda en el paso». `learnings.md`, en inglés, con el contenido de `aprendizajes-skills.md` sin lo que ya dice el paso 3 (la fusión del delta) y con el tope de palabras y el workaround de `SKILL.md:39`.
- [ ] **Step 2: Frases** — las de las decisiones 7 (K25 ×2, K38 en `closing-suite.md`, `:39` en `learnings.md`, `:56`), 8 (0.1 y la red flag), 9 (9.5), 10 (9.7) y 11 (el ticket, con «if git ignores the folder, say where the ticket is and don't merge again», Review Focus) de la spec, literales; la 12 en `merge-recipe.md` y su fila de salidas. `records.md`, «What's next in the family», se queda con cómo se calcula la familia y remite al paso 9.5 para los literales.
- [ ] **Step 3: Build** — `moon run kit:build` → sin errores.
- [ ] **Step 4: Verificación** — los comandos de «Verificación». Si `SKILL.md` pasa de 19.500, compacta prosa dentro de los pasos sin quitar ninguna regla ni ningún literal; una regla que se quite lleva su escenario.
- [ ] **Step 5: Commit de la task** — `refactor(sdd-archive): bajar SKILL.md de 20.000 bytes y sustituir las frases que fallan`.

### Task 3 — GREEN: la batería entera

**Tras**: Task 2
**Modelo**: hilo principal (Native); sujetos en Sonnet por `battery.mjs`.
**Tests RED**: —

**Superficies**: tooling (batería)
**Verificación lenta**: `BATTERY=sdd-archive SCENARIOS="<los 42 de sdd-kit:sdd-archive> tk1 pk1" PHASE=green-0305 KIT_DIR=<dist del árbol> MAX_PARALLEL=3 SUBJECT_CAP=80 COST_CAP=45 node tests/headless/battery.mjs run` · ~2,5 h en segundo plano, con `sdd watch command`.
**Verificación**: `node tests/headless/battery.mjs verdict tests/batteries/sdd-archive/battery.md <salida>` → cada escenario `verde` o `puerta verde · sin leer: <filas>` con esas filas leídas a mano; ninguno `rojo` sin su lectura.

**Interfaces**:
- Consume: la skill de la Task 2 y los escenarios de la Task 1.
- Produce: la evidencia GREEN y su fila en la procedencia de `battery.md`.

**Ficheros**: modificar `tests/batteries/sdd-archive/battery.md` (procedencia con el GREEN); `skills/sdd-archive/` y `dist/` solo en el REFACTOR.

- [ ] **Step 1: GREEN** — la orden de «Verificación lenta». Lectura por regla del `SKILL.md` (`tech-stack.md`, feature 0145), no solo por fila.
- [ ] **Step 2: Control** — un rojo que no toca lo cambiado se repite con el kit de `develop`, n = 1: si también falla, es de antes y va a `## Rulings` con su fila de deuda; si no, es regresión y va al REFACTOR.
- [ ] **Step 3: REFACTOR** — una tanda: arreglo de la frase que falla (ADR 0022, regla 3) y su escenario otra vez; un rojo que sigue tras ella, al dev-lead con el coste medido (Art. I).
- [ ] **Step 4: Verificación** — los comandos de «Verificación» y, si cambió la skill, los de la Task 2.
- [ ] **Step 5: Commit de la task** — `test(sdd-archive): GREEN de la batería con la skill rehecha`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 6 h (Task 1: 1,5 h; Task 2: 3 h; Task 3: 1,5 h de hilo más ~2,5 h de sujetos en segundo plano)
- Estimación de revisión: 1 h
- Estimación de cierre: 1 h
- Base de la estimación: 3 tasks; la reescritura de una skill de 31 KB con movimientos y frases fijadas en la spec; dos moldes sobre `reservas`; la batería de `sdd-archive` de la 0236 (53 sujetos, 23,78 $) como referencia de reloj
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Criterios de éxito de la spec: `moon run kit:skill-size`, `moon run kit:copies`, `moon run kit:own` y `moon run kit:upstream`, con las salidas de la Task 2
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `archive`, «El cierre comprueba el árbol…», THEN la pregunta con `notes.md` → Task 3, `a1` (A4). ✓
- AND los borradores no preguntan → Task 3, `g5` y `g8`. ✓
- AND `capabilities/rooms.md` que la spec no nombra pregunta → sin escenario: lo mira el eje Spec (Review Focus). ⚠
- AND `sdd merge --check` y `destino sacado:` → Task 3, `a1`. ✓
- AND «Abiertas a la vez» → Task 3, `a3`. ✓
- «Al cerrar una pieza de una familia…», THEN el literal sin prompt → Task 1 (Q1 nueva) y Task 3, `a5`. ✓
- AND «Ninguna se puede arrancar todavía» → sin escenario hoy (texto que no cambia de sitio en el paso 9.5); lo mira el eje Spec. ⚠
- AND «La 0200 ya no tiene piezas abiertas» y no marca la fila → Task 3, `a5m` (Q2). ✓
- AND la familia por `proposal:` y una pieza sin familia → sin escenario hoy; no cambian. ⚠
- «El kit no invoca `finishing-a-development-branch`» → Task 1, Step 3 y `Select-String -Path skills -Recurse -Pattern finishing-a-development-branch` en su verificación (solo `SKILL.md:10` y migraciones). ✓
- AND sin `NOTICE`, `own` y `concept` → Task 1, `cli:test` (`skills.test.ts`) y `kit:copies`. ✓
- Reglas «Dónde viven los datos», «Avisos», «Límites» de `archive` → la fusión del delta en el cierre y `sdd capability check`. ✓
- `control-profiles`, «El cierre acaba con una línea de terminado», THEN el contenido del mensaje → Task 3, `a1`, `a5`. ✓
- AND la línea con «sin cambios sin commitear del propio cambio» → Task 1 y Task 3, `tk1`. ✓
- AND el ticket no cuenta → `tk1` (TK1). ✓
- AND merge o push denegados → Task 3, `ci1`, `ci2` y `pk1`. ✓
- AND worktree no enlazado → Task 3, `a1` (el molde `reservas` no enlaza) frente a `tk1` (enlazado). ✓
- AND el ticket aceptado después se commitea y se fusiona, con la línea otra vez → `tk1` (TK1). ✓
- «Un push que no sale…», THEN y AND sin `--force`, `pull` ni `rebase` → `pk1` (PK1). ✓
- AND el relanzamiento por `publickey` → `pk1`. ✓
- AND sin sesión de `gh` o fallo del relanzamiento → sin escenario (`pk1` mide la salida fácil, Art. II); lo mira el eje Spec. ⚠
- Reglas «Avisos» y «Regla ante conflicto» de `control-profiles` → la fusión del delta y `pk1`. ✓
- Tabla «Lo que se retira o cambia de forma», fila a fila → Task 1 (NOTICE, `upstream.json`, filas literales) y Task 2 (el resto), con la búsqueda de cada literal viejo en `skills/` en la verificación de la Task 2. ✓
- Review Focus → sus tasks, arriba. ✓
