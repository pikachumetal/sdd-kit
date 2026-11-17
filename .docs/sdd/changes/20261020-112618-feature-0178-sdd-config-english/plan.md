---
id: 20261020-112618-feature-0178-sdd-config-english
feature: 0178
title: Plan de implementación — sdd-config en inglés, con la tabla pricing y la clave review.minors
spec: ./spec.md
status: approved
created: 2026-10-20
---

# Plan de implementación — sdd-config en inglés, con la tabla pricing y la clave review.minors

## Decisiones que he tomado yo — valida estas

1. **Modelo**: Native, la sesión implementa las tres tasks. Los sujetos de prueba son Sonnet headless (`tests/headless`), por tandas de hasta 3 en paralelo (`control.maxParallelAgents`).
2. **Ejecución**: native (ver la línea `Ejecución`).
3. **Humos de `sdd-config` sin batería nueva**: `cf1` y `cf2` se lanzan con `tests/headless/run.sh` sobre el molde `salas` de la batería de `using-sdd`, como el RED/GREEN de la task 0061 (`tests/sdd-config-red.md`). Una batería de `sdd-config` es un humo con más andamio, y el Art. I solo pide humo.
4. **`cf1` contesta la 9 en la petición** («para los Minor, defer») y así el único turno de `claude -p` llega a la 10. La rúbrica puntúa la pregunta de la 10, con su tabla propuesta, la fuente y la fecha.
5. **En `claude -p` no hay `AskUserQuestion`** (tech-stack, feature 0146): la rúbrica puntúa la pregunta en prosa y su opción recomendada.
6. **Coste estimado**: ~41 sujetos y ~30 $ (spec, decisión 14); unas 2,5 h de reloj.
- Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `sdd-config` en inglés con `review.minors` y `pricing` en su catálogo, y `sdd-verify` que mete los Minor en la pasada de fix con `review.minors: fix`.

**Architecture**: solo texto de skills, el contrato de claves de `control-profiles.md`, los Pester y la evidencia. La forma de `pricing` es la que ya lee `cli/src/session/cost.ts`; no cambia código.

**Tech Stack**: skills en Markdown; Pester 5 (`tests/*.Tests.ps1`); sujetos headless (`tests/headless/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto encadenadas solo por el catálogo de la Task 1, un error lo caza su humo o su escenario de batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulos, dependencias ni contratos entre módulos; las dos claves nuevas son datos de un fichero que ya existe

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, nombres en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, sin alias de PowerShell; texto humano (mensajes, títulos de test) en castellano con tildes.
- Art. III: `sdd-config` en inglés; dice al agente que hable con el usuario en su idioma.
- Claves exactas: `review.minors` con `fix` | `defer`, default `defer`; `pricing.usdPerMillionTokens.<id de modelo>.{input, cacheWrite5m, cacheWrite1h, cacheRead, output}`, `pricing.source`, `pricing.updated`.
- Fuente de precios: `https://platform.claude.com/docs/en/about-claude/pricing`.
- Topes aprobados: `sdd-config` 1.450; `sdd-verify` SKILL.md 3.060; kit 87.800.

### De proceso

- Política de modelos (Art. IV): sujetos con `--model sonnet`; revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By`; mensaje con `git commit -F <fichero>` (el hook bloquea `*` sueltos y `/palabra`).
- Un RED limpio no se relanza para sacar rojo: se lee por qué.

## Review Focus

- `sdd-config` invocada en un proyecto con `pricing` escrita y un modelo que `sdd session` dio como «sin precio» → la tabla enseña `updated` y los modelos; no se pregunta salvo que el usuario lo pida · Task 1, rúbrica de `cf2` (tabla con `pricing` y su fecha, sin pregunta de la 10)
- Revisión final con `review.minors: fix` y un Minor de redacción que ningún test reproduce → `Final: fixed <hallazgo> — suite <N>/<N>`, sin `minor (deferred)` · Task 2, `c1f` (su Minor es una dependencia de orden entre tests, que el sujeto puede reproducir o no; la rúbrica pide una línea `Final: fixed` del Minor)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos filas de catálogo y una frase condicionada; sin CLI.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (humo y tramo de batería por edición, previsión en la spec), Art. II (predicado observable), Art. III (inglés), Art. V (sin migración: las claves no rompen nada).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-config-0178-red.md` y `tests/sdd-config-0178-green.md` — evidencia de `cf1` y `cf2`.
- Salidas de los sujetos en `.docs/sdd/specs/20261020-112618-feature-0178-sdd-config-english/runs/`.

**Modificar**:

- `skills/sdd-config/SKILL.md` — reescrita en inglés; filas 9 y 10.
- `skills/sdd-verify/SKILL.md` — «Closing the review», la viñeta del Minor.
- `skills/sdd-init/SKILL.md` — la lista de preguntas del paso de claves (línea 53).
- `skills/sdd-start-feature/references/control-profiles.md` — dos filas en «Claves de sdd-kit.json»; ancla `#catalog`.
- `tests/SddConfig.Tests.ps1` — frases en inglés, diez filas.
- `tests/WordBudget.Tests.ps1` — topes aprobados.
- `tests/batteries/sdd-verify/battery.md` y `subject.sh` — escenario `c1f`.
- `.docs/sdd/sdd-kit.json` — `"review": {"minors": "fix"}`.
- `README.md` — fila de `sdd-config`, si su texto queda corto.

**NO se tocan**:

- `cli/` — `sdd session` y `sdd ledger rulings` ya hacen lo que pide la spec.
- `skills/sdd-upgrade/references/migrations/` — sin migración (spec, decisión 3).
- `skills/using-sdd/SKILL.md` — su fila de `sdd-config` no cambia.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La `description` en inglés roba peticiones a otras puertas | baja | media | batería entera de `using-sdd` (Task 3) |
| El sujeto no puede leer la página de precios (red del sandbox) | media | baja | la rúbrica acepta «no puedo leerla, no la escribo» como conducta correcta y lo apunta; si ocurre en GREEN, se repite una vez con red |

### 1.8 Rollout

Directo, en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-config` en inglés con `review.minors` y `pricing`

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · humos `cf1` y `cf2` con el kit de `develop` antes de editar; Pester de `SddConfig.Tests.ps1` actualizado antes de reescribir la skill
**Superficies**: docs (skills), tooling (Pester)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/SddConfig.Tests.ps1, tests/WordBudget.Tests.ps1 -CI"` → `Tests Passed: <N>, Failed: 0`; humos `cf1`, `cf2` (GREEN) y `n4` de `sdd-init` con su rúbrica
**Se prueba en la aplicación**: no, porque es un kit de skills: se prueba con los humos

**Interfaces**:
- Consume: nada
- Produce: filas 9 (`review.minors`) y 10 (`pricing`) del catálogo `## Catalog` de `skills/sdd-config/SKILL.md`, que la Task 2 y la Task 3 dan por escritas

**Ficheros**: `skills/sdd-config/SKILL.md`, `skills/sdd-init/SKILL.md`, `skills/sdd-start-feature/references/control-profiles.md`, `tests/SddConfig.Tests.ps1`, `tests/WordBudget.Tests.ps1`, `tests/sdd-config-0178-red.md`, `tests/sdd-config-0178-green.md`

- [ ] **Step 1: RED** — molde: copia del molde `salas` de la batería de `using-sdd`, con su `sdd-kit.json` sin `pricing` ni `review` (`cf1`) y con la tabla `pricing` de este repo y sin `review` (`cf2`). Petición `cf1`: «Revisa la configuración del kit y ponla al día. Para los Minor de la revisión final, defer.»; `cf2`: «Revisa la configuración del kit y ponla al día.». Kit: `develop`. n = 1 cada uno. Rúbrica:
  - `cf1`: enseña `pricing` como «falta» y que el cierre da «sin precio»; propone la tabla con modelos de Opus, Sonnet y Haiku, las cinco columnas, `source` = la URL oficial y `updated` = la fecha de lectura; o dice que no puede leer la fuente y no escribe nada. No inventa precios. No escribe ninguna clave sin respuesta. Habla en castellano.
  - `cf2`: enseña `review.minors` como «falta» y que rige `defer`; una pregunta, `defer` recomendada primero con el motivo del catálogo; enseña `pricing` con su `updated` y no la pregunta. Habla en castellano.
  Evidencia en `tests/sdd-config-0178-red.md`.
- [ ] **Step 2: Pester** — en `SddConfig.Tests.ps1`: la regex del catálogo pasa a `## Catalog`; «el catálogo tiene diez preguntas, en su orden» con `$rows[8] | Should -Match 'review\.minors'` y `$rows[9] | Should -Match '`pricing`'`; las dos filas escriben en `sdd-kit.json` (`'\| `sdd-kit\.json` \|\s*$'`); la 10 nombra `https://platform\.claude\.com/docs/en/about-claude/pricing`, `pricing\.source` y `pricing\.updated`; `description:` sin `Usar `, con `(?m)^description: Use `; las frases fijadas pasan a sus equivalentes en inglés de la Step 3; «do 1 to 7, 9 and 10». Corre y ve fallar.
- [ ] **Step 3: Reescribir** `skills/sdd-config/SKILL.md` en inglés, con su estructura: Overview (más «Talk to the user in their language»), `## Steps` 1-4, `## Catalog` (diez filas: las ocho de hoy traducidas sin cambiar recomendada ni fichero, más la 9 y la 10 con el texto de la spec, decisiones 4-6) y las cuatro notas, la primera con «An init does 1 to 7, 9 and 10, in that order…». Las preguntas literales del catálogo quedan en inglés: el agente las dice en el idioma del usuario.
- [ ] **Step 4: Contrato e init** — `control-profiles.md`, tabla «Claves de sdd-kit.json»: `| \`review.minors\` | \`fix\` \| \`defer\` (solo en \`sdd-kit.json\`) | \`"defer"\` |` y `| \`pricing\` | objeto: \`source\`, \`updated\`, \`usdPerMillionTokens\` (solo en \`sdd-kit.json\`) | — (sin ella, el cierre da «sin precio») |`; el enlace `#catálogo` → `#catalog`. `sdd-init/SKILL.md:53`: añade a la lista «how final-review Minors are handled (`review.minors`) and the price table (`pricing`)».
- [ ] **Step 5: Topes** — `WordBudget.Tests.ps1`: `sdd-config` 1450, `sdd-verify` SkillMd 3060, `Kit` 87800 (los dos últimos, para la Task 2).
- [ ] **Step 6: Verificación** — Pester en verde; GREEN de `cf1` y `cf2` con el kit de la rama (n = 1 cada uno) y `n4` de `sdd-init` (`STEPS=smoke` en `tests/headless/battery.sh`). Evidencia en `tests/sdd-config-0178-green.md`.
- [ ] **Step 7: Commit de la task**.

### Task 2 — `review.minors: fix` en el cierre de la revisión final

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `c1f` en la batería de `sdd-verify` con el kit antes de editar
**Superficies**: docs (skills), tooling (batería)
**Verificación**: `BATTERY=sdd-verify STEPS=closing bash tests/headless/battery.sh` con `c1f` (n = 2) y `c1` (n = 2) → veredicto verde por escenario; `Invoke-Pester tests/WordBudget.Tests.ps1, tests/ImplementSkill.Tests.ps1 -CI` → `Failed: 0`
**Se prueba en la aplicación**: no, porque es un kit de skills: se prueba con la batería

**Interfaces**:
- Consume: la fila 9 del catálogo de `sdd-config` (`review.minors`, `fix` | `defer`, default `defer`)
- Produce: nada

**Ficheros**: `skills/sdd-verify/SKILL.md`, `tests/batteries/sdd-verify/battery.md`, `tests/batteries/sdd-verify/subject.sh`

- [ ] **Step 1: Escenario** — `battery.md`: fila `c1f`, paso `closing`, la petición y el molde de `c1`, n = 2, umbral 2/2, sonnet, procedencia «ticket de la feature 0204 §2»; fila de rúbrica `C1f Minor a la pasada`: «falla si el Minor no entra en la única pasada de fix; o el ledger tiene `minor (deferred)`; o pregunta al dev-lead si arreglarlo; o no hay `Final: fixed` del Minor». `subject.sh`: `c1f` construye como `c1` y añade `, "review": {"minors": "fix"}` al marcador.
- [ ] **Step 2: RED** — `c1f` con el kit de `develop` (n = 1). Esperado: el Minor queda `minor (deferred)`.
- [ ] **Step 3: Editar** `sdd-verify`, «Closing the review», la viñeta del Minor: «**Minor**, with `review.minors: fix` in `sdd-kit.json`, enters the fix pass with the Critical and Important, without asking; in Native its ledger line is `Final: fixed <finding> — <test> RED→GREEN, suite <N>/<N>`, or `Final: fixed <finding> — suite <N>/<N>` when no test can reproduce it (a name, a wording). Without the key, or with `defer`, it goes to the ledger as `Final: minor (deferred): <one-liner>` and to your final message under «Deferred minors»; deferred Minors never enter the fix pass…» (el resto de la frase de hoy).
- [ ] **Step 4: Verificación** — GREEN `c1f` (n = 2) y `c1` de control (n = 2); Pester.
- [ ] **Step 5: Commit de la task**.

### Task 3 — Enrutado con la `description` nueva y `review.minors: fix` en este repo

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: ninguno: es control de no regresión del enrutado
**Superficies**: tooling (batería), docs
**Verificación**: `BATTERY=using-sdd bash tests/headless/battery.sh` (batería entera) → todos los escenarios en su umbral; `node -e "JSON.parse(require('fs').readFileSync('.docs/sdd/sdd-kit.json','utf8')).review.minors==='fix'||process.exit(1)"` → salida 0
**Se prueba en la aplicación**: no, porque es un kit de skills

**Interfaces**:
- Consume: la `description` nueva de `sdd-config` (Task 1)
- Produce: nada

**Ficheros**: `.docs/sdd/sdd-kit.json`, `README.md` (si hace falta), evidencia de la batería en `tests/`

- [ ] **Step 1: Batería de `using-sdd`** entera con el kit de la rama, en segundo plano con su vigía. Un rojo se lee antes de nada; si lo causa la `description` de `sdd-config`, se arregla y se repite su escenario y `s1`.
- [ ] **Step 2: Este repo** — `"review": {"minors": "fix"}` en `.docs/sdd/sdd-kit.json`; el cuerpo del commit cita: «Este repo queda con review.minors: fix (dev-lead: punto 2 de la spec de la 0202 y enmienda «Sí, todos» de la 0204)», 2026-10-20.
- [ ] **Step 3: README** — la fila de `sdd-config` nombra los precios y la política de Minor si su texto actual no los cubre.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 2,5h
- Base de la estimación: 3 tasks de texto; la mayor parte es reloj de sujetos (~41); referencia: 0150 (traducción de dos skills con batería) y 0061 (humos de `sdd-config`)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `configuration` · precios: tabla enseña `pricing` «falta» y «sin precio» → Task 1, `cf1`. ✓
- · pregunta sola con «sí» recomendada y tabla propuesta (modelos, columnas, ids) → Task 1, `cf1`. ✓
- · con «sí» escribe `usdPerMillionTokens`, `source`, `updated` → Task 1, Pester (fila 10 nombra las tres) y `cf1` (la propuesta las lleva); la escritura tras el «sí» no la observa un turno de `claude -p`. ⚠ cubierta por el texto del catálogo
- · sin poder leer la página, no inventa → Task 1, rúbrica de `cf1` (rama aceptada). ✓
- · «no» / «no sé» no escribe → Task 1, rúbrica de `cf1` (no escribe sin respuesta). ✓
- · con `pricing` escrita: enseña `updated` y modelos, no la pregunta → Task 1, `cf2`. ✓ · actualizar a petición → sin observar: no se mide (texto del catálogo). ⚠
- `configuration` · Minor: tabla enseña `review.minors` «falta» y `defer` → Task 1, `cf2`. ✓
- · pregunta sola, `defer` recomendada con motivo → Task 1, `cf2`. ✓
- · escribe `fix`/`defer` en `sdd-kit.json`; «no sé» nada → Task 1, Pester (fichero de la fila 9). ✓
- `configuration` · escribe lo respondido: `review.minors` y `pricing` a `sdd-kit.json` → Task 1, Pester. ✓ · resto de AND sin cambio → N/A. ✓
- `verification` · sin clave o `defer`: Minor diferido → Task 2, `c1` (control). ✓
- · con `fix`: entra en la pasada sin preguntar, `Final: fixed`, nunca `minor (deferred)` → Task 2, `c1f`. ✓
- · resto de AND (re-revisión) → Task 2, `c1` y `c1f` (la rúbrica de C1 ya los mide). ✓
- «Lo que se retira…»: frase de `sdd-verify` → Task 2; catálogo, Pester, init, contrato, ancla → Task 1; filas del roadmap → cierre (`sdd-archive`). ✓
- Este repo con `fix` → Task 3, comprobación con `node`. ✓
- Review Focus → Task 1 `cf2`; Task 2 `c1f`. ✓
