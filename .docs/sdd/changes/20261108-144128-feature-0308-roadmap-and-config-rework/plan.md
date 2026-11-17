---
id: 20261108-144128-feature-0308-roadmap-and-config-rework
feature: 0308
title: Plan de implementación — sdd-roadmap y sdd-config con las tres reglas de la ADR 0022
spec: ./spec.md
status: draft
created: 2026-11-08
---

# Plan de implementación — sdd-roadmap y sdd-config con las tres reglas de la ADR 0022

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa cada task; ningún subagente implementador. Los sujetos de las baterías, `sonnet` (su `Modelo` en `battery.md`), por tandas de `battery.mjs run`. La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; sin eje Arquitectura.
2. Ejecución: native (motivo en la línea `Ejecución`).
3. **Orden invertido respecto al Approach de la spec**: el adelgazamiento va primero (Task 1) y la regla del triaje después (Task 2). La frase nueva del triaje suma ~400 bytes: sobre los 21.680 de hoy, `kit:skill-size` daría rojo en la puerta de esa task, y la decisión 9 pide que corra en la de cada una. El RED de `ts1` y `ts2` va con el kit de `develop`, así que el orden no lo cambia. El Approach es la narración del orden, no una regla; ninguna decisión ni THEN cambia.
4. Las ediciones de `SKILL.md` se aplican con Edit desde la tabla «Lo que se retira o cambia de forma» de la spec y el borrador medido del scratchpad (`draft/`), no copiando el fichero: el borrador ya lleva la frase del triaje, que es de la Task 2.
5. Capas nuevas en `subject.mjs`: `salas-3-fix` y `salas-qa-fix` reescriben el informe del molde con `replace` sobre la línea del hallazgo 2 (y `s.die` si no está), como `salas0013`; `salas-3-retro-ask` reutiliza la capa `salas-3-retro` y vuelve a escribir el marcador sin `release` con `s.putKitMarker` (sobrescribe `sdd-kit.json`).
6. Copias del kit: la de `develop` con `git archive dc74103c:dist` (el merge-base) en `.temp/k308-dev`; la de la rama, `moon run kit:build` y copia de `dist/` en `.temp/k308`. `RUNS_DIR` en `.temp/r308`. `SPEC_DIR` la carpeta de esta spec; `PHASE` una por tanda (`refactor-t1`, `red-ts`, `green-ts`, `smoke-config`, `control`, `branch`).
7. Riesgo alto: una regla que baja a `references/` y el sujeto no abre. Lo miden `M2b`, `M7b` y `M7r` en la Task 1 y la batería entera en la Task 4; un rojo es un REFACTOR de la frase «First thing in this entry: read …», nunca subir el bloque entero.
8. Coste estimado: ~3,5 h de hilo; 16,92 $ de sujetos (previsión de la spec), umbral de parada 20 $, con `COST_CAP` por tanda; la revisión final, ~3 $.
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: dejar `sdd-roadmap` por debajo de 20.000 bytes sin perder reglas, con la frase del triaje sustituida por una que exige probar la solución con el caso real, y `sdd-config` sin las dos frases de excepción pegada.

**Architecture**: solo texto de dos skills, dos `references/` nuevas de `sdd-roadmap` y su batería; la CLI no cambia. Los dos tramos que bajan se enlazan desde su entrada con «First thing in this entry: read …».

**Tech Stack**: Markdown de skills, `moon run kit:build`, `kit:copies`, `kit:own`, `kit:skill-size`, `kit:test-headless`; Vitest en `cli/` (`word-budget.test.ts`); `tests/headless/battery.mjs` con sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks editan los mismos dos `SKILL.md` y la misma batería, en cadena (la Task 2 escribe sobre el `SKILL.md` que deja la Task 1 y su control es la Task 4), un error lo cazan `kit:*` y la batería de cada task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y la batería: ningún módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Constitution Art. X: sin comentarios que repitan el código; sin comentarios que citen la constitution, una spec, una task, un requisito ni `capabilities/`; nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes, `s.die`) en castellano con tildes.
- ADR 0022: la frase que falla se sustituye entera; nunca se añade otra al lado ni una excepción («except», «unless», «instead of») junto a una absoluta («only», «never», «always», «must», «every»).
- Skills en inglés (Art. III); un literal que el agente escribe para el proyecto o el usuario sigue en castellano y entre «».
- Una frase que la batería mide en su paso no se mueve; cada frase que sale de `SKILL.md` está en `references/` o en la tabla «Lo que se retira o cambia de forma» de la spec. Quitar algo que la spec dice que se queda es un desvío: se para.
- `dist/skills/sdd-roadmap/SKILL.md` por debajo de 20.000 bytes.
- Topes de `cli/test/kit/word-budget.test.ts` sin cambio: `sdd-roadmap` 3600/3600, `sdd-config` 1450/1450.
- Nunca se edita `dist/` a mano: `moon run kit:build`.

### De proceso

- Política de modelos de la spec: sujetos sonnet; ejes de la revisión final Spec opus+high, Código sonnet+high; en paralelo hasta `control.maxParallelAgents` (3).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task (`commit-milestones.md`); antes de cada commit, `git diff --cached --name-only`; mensaje con `git commit -F <fichero del scratchpad>` si lleva `*` suelto o `/palabra`.
- Temporales en el scratchpad de la sesión; `RUNS_DIR` y las copias del kit en `.temp/` del worktree (ignorado). Umbral de parada de sujetos: 20 $ en toda la campaña.

## Review Focus

- Un sujeto de `ts1` que da el hallazgo 3 por falso (el código no responde «indica una planta» sin número) y no fija la sustitución → la cláusula de `docs/ayuda.md` queda sin ejercer en ese sujeto; se apunta en la evidencia, no cuenta como verde de esa cláusula · Task 2, fila `TS1`.
- Un sujeto que prueba la solución en el árbol del molde y la revierte → `git status` limpio pero sin copia: falla igual si `tools.txt` muestra la edición de `src/app.js` del molde · Task 2, filas `TS1` y `TS2`.
- `m7r`: el sujeto pregunta el destinatario y además escribe `"hasRecipient"` dando la respuesta por supuesta → falla · Task 1, fila `M7r`, `tools: /hasRecipient"?\s*:\s*(true|false)/` ausente.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos `references/` con texto literal y una frase sustituida; ningún mecanismo nuevo.
- [x] **YAGNI gate**: no se abstrae nada; las capas nuevas siguen la forma de las de `subject.mjs`.
- [x] **Brownfield gate**: los escenarios y filas de rúbrica existentes no cambian salvo `m7` (n = 2, decisión 8 de la spec).
- [x] **Constitution check**: Art. I (RED antes de la regla, control de lo que se mueve), Art. II (la frase que falla se sustituye), Art. III (skills en inglés), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-roadmap/references/proposal.md` — la forma de la propuesta de «Something big»: las cuatro viñetas, literales.
- `skills/sdd-roadmap/references/prepare-release.md` — los pasos 2 a 6 de «Prepare a release», literales y con su número.
- `tests/batteries/sdd-roadmap/mold-salas-3-fix/docs/ayuda.md` — la frase de ayuda del hallazgo 3.

**Modificar**:

- `skills/sdd-roadmap/SKILL.md` — tabla de equivalencias, P2, las dos entradas que bajan, las cuatro líneas que salen (Task 1); la frase del triaje (Task 2).
- `skills/sdd-config/SKILL.md` — `:11` y `:16` (Task 3).
- `tests/batteries/sdd-roadmap/subject.mjs` — capas `salas-3-retro-ask` (Task 1), `salas-3-fix` y `salas-qa-fix` (Task 2).
- `tests/batteries/sdd-roadmap/battery.md` — escenarios `m7r`, `ts1`, `ts2`; `m7` a n = 2; filas `M2b`, `M7b`, `M7r`, `TS1`, `TS2`; «Procedencia de las reglas» y el párrafo «Retirado (feature 0308…)».
- `dist/` — con `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-roadmap/SKILL.md:3` (la `description`), `:10`, `:54`, `:56` — de la 0311.
- `skills/sdd-propose/references/control-profiles.md:244` — de la 0306, cerrada.
- `.docs/sdd/capabilities/planning.md` — el delta lo fusiona `sdd-archive` al cerrar.
- `cli/test/kit/word-budget.test.ts` — topes sin cambio.

### 1.6 Dependencias

- El molde `tests/batteries/using-sdd/mold-salas` y las capas `mold-salas-3`, `mold-salas-qa` de la batería, sin cambio.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto no abre la `reference` nueva y se salta la forma de la propuesta o el destinatario | media | una regla perdida | `M2b`, `M7b`, `M7r` con n = 2 en la Task 1; un rojo es REFACTOR de la frase de entrada |
| El RED de `ts1`/`ts2` sale limpio | baja | sin fallo no se escribe (Art. I) | desvío: se para y decide el dev-lead (decisión 7 de la spec) |
| La frase del triaje lleva `SKILL.md` por encima de 20.000 bytes | baja | `kit:skill-size` rojo | ~810 bytes de margen medidos en el borrador; lo que crezca se paga dentro de la skill |
| Coste por encima de 20 $ | baja | — | `COST_CAP` por tanda; se para y decide el dev-lead |

### 1.8 Rollout

Directo: entra con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Adelgazar `sdd-roadmap`: P2, tabla, dos tramos a `references/` y saldo

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet` por `battery.mjs`.
**Tests RED**: no es conducta nueva: es REFACTOR, medido con filas nuevas de rúbrica sobre escenarios que ya existen (`m2`, `m7`) y uno nuevo (`m7r`), escritas antes de editar `SKILL.md`.

**Superficies**: docs (skill), tooling (batería).
**Verificación**:
- `moon run kit:build kit:skill-size` → `OK: todos los SKILL.md ocupan menos de 20000 bytes`
- `moon run kit:own` → de `sdd-roadmap`, solo las líneas `:10`, `:54` (dos) y `:56` (0311)
- `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  … passed`
- `moon run kit:test-headless` → verde (construye en seco el molde nuevo)
- `BATTERY=sdd-roadmap SCENARIOS='m2 m7 m7r' SPEC_DIR=<spec> PHASE=refactor-t1 KIT_DIR=<abs .temp/k308> RUNS_DIR=<abs .temp/r308> COST_CAP=2 node tests/headless/battery.mjs run` → puerta verde en 6/6; `M2`, `M2b`, `M7`, `M7b`, `M7r` y `L` leídas por el hilo, sin rojo

**Interfaces**:
- Consume: nada.
- Produce: `SKILL.md` de `sdd-roadmap` con la frase del triaje sin tocar (la de hoy, `:123`), sobre la que escribe la Task 2; molde `salas-3-retro-ask`.

**Ficheros**: crear `skills/sdd-roadmap/references/proposal.md`, `skills/sdd-roadmap/references/prepare-release.md`; modificar `skills/sdd-roadmap/SKILL.md`, `tests/batteries/sdd-roadmap/subject.mjs`, `tests/batteries/sdd-roadmap/battery.md`.

- [ ] **Step 1: Batería primero**.
  - `battery.md`: `m7` pasa a n = 2, umbral 2/2. Fila nueva de escenario: `| m7r | recipient | Prepara la release 1.6: qué entra de lo que tenemos. | salas-3-retro-ask | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | feature 0308: el paso del destinatario baja a \`references/prepare-release.md\`; con \`hasRecipient: false\` en el marcador, \`m7\` no lo ejerce |`.
  - Filas de rúbrica: `M2b Forma de la propuesta` (`m2`): «la propuesta no lleva `source: interview`, alguna regla de negocio va sin un ejemplo con datos de entrada y salida, el reparto no da id y dependencia de cada feature, o una fila no lleva «`proposal: <id>`» y «tras NNNN» en el «Ítem» (el molde `salas` es 2.x)». `M7b Estado y sección` (`m7`): «el título de Now no es `## Now — 1.6 · en preparación`, pregunta el destinatario (`hasRecipient: false` en el marcador), escribe «comprometida», o una fila en alcance va sin `**Toca:**`». `M7r Destinatario` (`m7r`): «no pregunta una sola vez si la release se entrega a alguien distinto de quien la hace; o `tools: /hasRecipient"?\s*:\s*(true\|false)/` presente».
  - `subject.mjs`, en `molds`: `'salas-3-retro-ask'`: llama a `molds['salas-3-retro']()` y vuelve a escribir el marcador con `MARKER` sin `'"release": {"hasRecipient": false}, '`; `s.die('el marcador cambió: no hay release que quitar')` si el `replace` no cambia nada.
- [ ] **Step 2: Editar `SKILL.md`**, cada fila de «Lo que se retira o cambia de forma» de la spec salvo la frase del «Destino» y las dos de `sdd-config`, con el texto del borrador `draft/sdd-roadmap/SKILL.md` del scratchpad:
  - Tabla de equivalencias: «Lista», «En espera», «Descartada», «Por triar» entre «».
  - Paso 1 del checklist, con la definición única: «A row is in flight with 🔄 or an open `feature/<id>-*` branch, and closed with ✅ or 🧪 in the integration branch. In **any** entry, an in-flight or closed feature is not touched —neither its row nor its spec—, even if the new thing is on its topic: it goes to a new row, «tras» it if in flight.»; la entrada 1 dice «If the row is closed or in flight (checklist step 1), say so instead…» y «Reorder or change», «a closed or in-flight feature (checklist step 1) is not touched».
  - «Something big»: «First thing in this entry: read [references/proposal.md](references/proposal.md), the shape of the proposal and of its rows. Interview with the `sdd-grilling` skill (invoke it with `Skill`): **the interview never ends in a spec** or a plan; it ends in `proposal.md` and in roadmap rows. The rules do **not** go to the roadmap: the roadmap is the index every skill reads; the definition lives in the proposal.»; las cuatro viñetas, literales, a `references/proposal.md` bajo `# The proposal of something big`.
  - «Prepare a release»: «First thing in this entry: read [references/prepare-release.md](references/prepare-release.md), steps 2 to 6 (order, scope, recipient, state and the section). Step 1:» y el inventario; los pasos 2 a 6, literales y numerados, a `references/prepare-release.md` bajo `# Prepare a release`.
  - Salen las red flags de `:134`, `:139` y `:141` y la racionalización de `:149`.
- [ ] **Step 3: Build** — `moon run kit:build`. Esperado: verde. `dist/skills/sdd-roadmap/SKILL.md` < 20.000 bytes; `diff` de las dos `references/` contra el borrador, vacío.
- [ ] **Step 4: Verificación** — los comandos de «Verificación», la tanda en `.temp/k308` copiado de `dist/` tras el build. Un rojo de `M2b`/`M7b`/`M7r` se lee y es REFACTOR de la frase de entrada (nueva tanda de ese escenario, n = 2).
- [ ] **Step 5: Procedencia** — en `battery.md`, filas «Forma de la propuesta (`references/proposal.md`)» → `m2` (`M2b`) y «Pasos 2 a 6 de «Prepare a release» (`references/prepare-release.md`)» → `m7` (`M7b`), `m7r` (`M7r`), con el resultado de la tanda; párrafo «**Retirado** (feature 0308, para pagar el saldo): …» con las tres red flags, la racionalización y sus controles (`m5`, `id3`, `wn1`-`wn3`, `M1`, `M4`), resultado en `control/` y `branch/` de su spec (Task 4).
- [ ] **Step 6: Commit de la task** — `refactor(sdd-roadmap): …`.

### Task 2 — La frase del triaje: solo se fija una solución probada con el caso real

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet` por `battery.mjs`.
**Tests RED**: `ts1` y `ts2` con el kit de `develop` (`.temp/k308-dev`), n = 2; filas `TS1` y `TS2` escritas antes del RED, con sus dos salidas correctas nombradas.

**Superficies**: docs (skill), tooling (batería).
**Verificación**:
- RED: `BATTERY=sdd-roadmap SCENARIOS='ts1 ts2' SPEC_DIR=<spec> PHASE=red-ts KIT_DIR=<abs .temp/k308-dev> RUNS_DIR=<abs .temp/r308> COST_CAP=1.5 node tests/headless/battery.mjs run` → al menos un sujeto falla `TS1` o `TS2` (fija `<` o no corre la solución ni dice «solución por confirmar»). Limpio en 4/4: desvío, se para.
- GREEN: lo mismo con `PHASE=green-ts` y `KIT_DIR=<abs .temp/k308>` → puerta verde 4/4; `TS1`, `TS2` y `L` sin rojo.
- `moon run kit:build kit:skill-size` → `OK: …`; `moon run kit:own` → como en la Task 1; `npx vitest run test/kit/word-budget.test.ts` → passed; `moon run kit:test-headless` → verde.

**Interfaces**:
- Consume: `SKILL.md` de la Task 1, con la frase del «Destino» de hoy en la entrada «Triage».
- Produce: moldes `salas-3-fix` y `salas-qa-fix`.

**Ficheros**: crear `tests/batteries/sdd-roadmap/mold-salas-3-fix/docs/ayuda.md`; modificar `tests/batteries/sdd-roadmap/subject.mjs`, `tests/batteries/sdd-roadmap/battery.md`, `skills/sdd-roadmap/SKILL.md`.

- [ ] **Step 1: Moldes**.
  - `mold-salas-3-fix/docs/ayuda.md`: `# Ayuda`, línea en blanco, «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».»
  - `subject.mjs`: función `withProposedFix(informe)` que sustituye en el informe (`docs/qa/2026-10-12-informe.md`) la línea del hallazgo 2 por la misma con « Arreglo propuesto: en `roomsOnFloor` de `src/app.js`, cambiar `<=` por `<`.» al final; `s.die('el informe del molde cambió: no hay hallazgo 2')` si no está.
  - `'salas-3-fix'`: `layer3()`, `s.copy(join(HERE, 'mold-salas-3-fix'))`, `withProposedFix`, y añade al informe «3. `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres. Arreglo propuesto: cambiar «`libres --planta <n>` lista las salas de la planta <n>» por «`libres --planta <n>` lista las salas libres de la planta <n>».» y a «Por triar» de `debt.md` la fila «| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres | `docs/qa/2026-10-12-informe.md` | 2026-10-12 |» (`s.die` si no encuentra la fila de la planta tras la que va).
  - `'salas-qa-fix'`: `layerQa()` y `withProposedFix`.
- [ ] **Step 2: Escenarios y rúbrica** en `battery.md`:
  - `| ts1 | triage-solution | Tria lo que hay por triar en la deuda. Decide tú. | salas-3-fix | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | feature 0308: tickets de la 0315, 0317 y 0318 (la fila fijó la solución del ticket sin probarla) |`
  - `| ts2 | triage-solution | Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú. | salas-qa-fix | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | feature 0308: el mismo fallo en 2.x, la forma de los tres casos de campo |`
  - `TS1 Solución probada` (`ts1`): «alguna fila que escribe o propone (`debt.md` o `ROADMAP.md`, también con «Destino» `sin fila`) fija cambiar `<=` por `<` para la planta; la solución que fija no la corrió en una copia fuera del árbol del sujeto con `libres --planta 2` (`tools.txt`) y la fila no dice «solución por confirmar»; `tools.txt` muestra una edición de `src/app.js` del molde; la fila que fija la sustitución de `docs/ayuda.md` no cita la frase entera, con «sin número, responde «indica una planta»»; o `git status` da cambios fuera de `ROADMAP.md` y `debt.md`. Salidas correctas: una solución corrida en una copia que no da `Norte`, o «solución por confirmar»; se apunta cuál dio cada sujeto».
  - `TS2 Solución probada en 2.x` (`ts2`): lo mismo para la fila `**Actuar**` de la planta (también tras su `· arreglo:`) y su fila de «Próximo», con `git status` sin cambios fuera de `.docs/sdd/roadmap.md`.
- [ ] **Step 3: RED** — la tanda RED de «Verificación»; evidencia en `red-ts/` de la spec, con la cita literal de cada fila que falla.
- [ ] **Step 4: Sustituir la frase** de la entrada «Triage», entera: de «- The «Destino» of a «Lista» row is the id of a row of Now or Next, new or existing, or `sin fila`; never empty. A new row is written like any concrete thing, and the `**Salda:**` of a brief names only «Lista» rows.» a «- The «Destino» of a «Lista» row is the id of a row of Now or Next, new or existing, or `sin fila`; never empty. A new row is written like any concrete thing. A solution a row fixes is one you ran, on a copy, with the real case the tickets cite (a command, a file:line, a sha) up to where the failure shows, the row's WHEN; if you didn't, the row says «solución por confirmar». A solution that replaces a sentence quotes the whole sentence that leaves. The `**Salda:**` of a brief names only «Lista» rows.»
- [ ] **Step 5: Build y GREEN** — `moon run kit:build`, copia a `.temp/k308`, la tanda GREEN y los checks de «Verificación».
- [ ] **Step 6: Procedencia** — fila «Triage: una solución que fija una fila se corrió en una copia con el caso real, o la fila dice «solución por confirmar»; una sustitución cita la frase entera» → RED y GREEN de `ts1` y `ts2`, con su resultado.
- [ ] **Step 7: Commit de la task** — `feat(sdd-roadmap): …`.

### Task 3 — `sdd-config` sin las dos frases de excepción pegada

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet` por `battery.mjs`.
**Tests RED**: no es conducta nueva: humo de lo que ya mide `g7` (`sdd-grilling`) y `s1` (`using-sdd`), N = 1.

**Superficies**: docs (skill).
**Verificación**:
- `moon run kit:build kit:own` → ninguna línea de `sdd-config`
- `npx vitest run test/kit/word-budget.test.ts` → passed
- `BATTERY=sdd-grilling SCENARIOS='g7' N=1 SPEC_DIR=<spec> PHASE=smoke-config KIT_DIR=<abs .temp/k308> RUNS_DIR=<abs .temp/r308> COST_CAP=1 node tests/headless/battery.mjs run` y lo mismo con `BATTERY=using-sdd SCENARIOS='s1'` → verde, o un rojo con su control con `.temp/k308-dev`.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-config/SKILL.md`.

- [ ] **Step 1: Editar** — `:11`: «…This skill is the kit's only interview of keys: the user invokes it, and `sdd-init` and the migrations ask their keys through it. …»; `:16`: «2. **Ask** — only the keys without a value, and those the user asks to change. …» y sale «A key with a value isn't asked again unless asked.». El resto de la línea, sin cambio (texto del borrador `draft/sdd-config/SKILL.md`).
- [ ] **Step 2: Build** — `moon run kit:build`; copia a `.temp/k308`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; evidencia en `smoke-config/` de la spec.
- [ ] **Step 4: Commit de la task** — `refactor(sdd-config): …`.

### Task 4 — Control: la batería entera contra el kit de `develop` y las comprobaciones

**Tras**: Task 3
**Modelo**: la sesión (Native); sujetos `sonnet` por `battery.mjs`.
**Tests RED**: no aplica: control (decisión 12 de la spec).

**Superficies**: tooling.
**Verificación**:
- Control: `BATTERY=sdd-roadmap SCENARIOS='<todos salvo ts1 ts2 m7r>' SPEC_DIR=<spec> PHASE=control KIT_DIR=<abs .temp/k308-dev> RUNS_DIR=<abs .temp/r308> COST_CAP=7 node tests/headless/battery.mjs run`.
- Rama: la batería entera con `PHASE=branch`, `KIT_DIR=<abs .temp/k308>`, `COST_CAP=8`.
- Criterio: ningún rojo de la rama que el control no dé, por fila de rúbrica (los de la 0194 en `m2`, `c2` y `m3` ya están anotados).
- `moon run kit:build kit:copies kit:own kit:skill-size` → `kit:copies` solo con «`skills/sdd-verify/references/`: sin anotar → 0297»; `kit:own` sin líneas de `sdd-roadmap` ni `sdd-config` fuera de `:10`, `:54` (dos) y `:56`, y sin rojos que `develop` no dé; `kit:skill-size` y `kit:build` verdes.

**Interfaces**:
- Consume: los `SKILL.md` de las Tasks 1 a 3.
- Produce: evidencia en `control/` y `branch/` de la spec.

**Ficheros**: modificar `tests/batteries/sdd-roadmap/battery.md` (el resultado, en «Procedencia» y en el párrafo «Retirado»).

- [ ] **Step 1: Control** — la tanda con el kit de `develop`.
- [ ] **Step 2: Rama** — la batería entera con el kit de la rama; tabla rama/control por fila de rúbrica.
- [ ] **Step 3: Comprobaciones** — `moon run kit:build kit:copies kit:own kit:skill-size`, con los rojos de `develop` que nombra la decisión 10 bis de la spec como referencia.
- [ ] **Step 4: Commit de la task** — `test(sdd-roadmap): …`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 2,5 h (4 tasks; las tandas en minutos, en paralelo)
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 4 tasks de texto con su batería, como la 0305 y la 0306; el RED puede desautorizar la Task 2 (aviso de sesgo de `estimation.md`)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` (`tech-stack.md` §Testing, «Gate de cierre»)
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN ninguna fila fija «cambiar `<=` por `<`» → Task 2, `TS1`. ✓
- AND la solución fijada se corrió en una copia o dice «solución por confirmar» → Task 2, `TS1` (`tools.txt`). ✓
- AND `git status` sin cambios fuera de `ROADMAP.md` y `debt.md` → Task 2, `TS1` (`git status` de `state.txt`). ✓
- AND GIVEN `docs/ayuda.md` → la fila cita la frase entera → Task 2, `TS1`; si el sujeto no fija la sustitución, sin ejercer (Review Focus). ✓
- AND GIVEN `salas-qa-fix` (2.x) → Task 2, `TS2`. ✓
- Reglas de la capacidad (Idioma, Límites, Regla ante conflicto) → texto del delta, lo fusiona `sdd-archive`; «Límites» lo observa `TS1`/`TS2` (`git status`). ✓
- Filas de «Lo que se retira o cambia de forma»: `:37`, `:50`, `:96` (P2) → Task 1, `m1`, `wn1`-`wn3` en la Task 4; tabla `:28`-`:31` → Task 1, `kit:own` y `m6` en la Task 4; viñetas de «Something big» → Task 1, `M2b`; pasos 2-6 → Task 1, `M7b` y `M7r`; frase del «Destino» → Task 2; `sdd-config:11` y `:16` → Task 3, `kit:own` y humo `g7`/`s1`; red flags `:134`, `:139`, `:141` y racionalización `:149` → Task 4, `m5`, `id3`, `wn1`-`wn3`, `M1`, `M4` contra el control. ✓
- `SKILL.md` < 20.000 bytes y topes de palabras sin cambio → Tasks 1 y 2, `kit:skill-size` y `word-budget.test.ts`. ✓
- Review Focus → Task 1 (`M7r`) y Task 2 (`TS1`, `TS2`). ✓
