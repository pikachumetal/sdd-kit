---
id: 20261017-220801-feature-0185-propose-fixes
feature: 0185
title: Plan de implementación — propose-fixes
spec: ./spec.md
status: draft
created: 2026-10-18
---

# Plan de implementación — propose-fixes

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las 5 tasks (Opus 5.5, la elegida por el dev-lead al aprobar sin la opción de bajar a gama media). Sujetos de la campaña: Sonnet; `mp1` en Opus. La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`, Arquitectura no; los cubre la política de modelos de la spec.
2. Ejecución: native — ver la línea `Ejecución`.
3. Las tasks van por fichero, no por decisión: la Task 1 toca `spec-template.md` y el paso 4 de `sdd-propose` a la vez porque el hueco y la regla que lo rellena se miden con el mismo sujeto (`sp1`).
4. Los Pester de frases nuevos van en un solo fichero, `tests/ProposeFixes.Tests.ps1`, un `Describe` por task, con el patrón de `tests/PatchLane.Tests.ps1` (`Get-KitFile`, `Get-Section`).
5. Los moldes nuevos (`reservas-topes`, `reservas-plan`, el `CLAUDE.md` de `mp1`) se montan en el `subject.sh` de su batería, como los demás moldes.
6. Riesgo alto: el tope de `sdd-propose` (6.700) se queda corto si la Task 4 necesita más de ~100 palabras en el árbol; se condensa en la misma task y, si una instrucción cae, lleva su RED (spec, decisión 2).
7. Coste estimado: ~4 h de implementación y ~25 $ de sujetos (previsión de la spec).
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
9. Cobertura: cada escenario de la spec tiene su task (§4). Sin gate del plan (`delegate`).

**Goal**: los diez arreglos de la spec, cada uno con su RED y su GREEN.

**Architecture**: solo texto de skills y plantillas, más escenarios de batería y Pester de frases. El hueco va en la plantilla que se rellena (Art. II) y la regla que lo rellena en el paso que la ejecuta.

**Tech Stack**: Markdown de skills; Pester ≥ 5 (pwsh 7); baterías de `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 5 tasks independientes entre sí que tocan ficheros distintos de texto, un error lo caza el GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y plantillas, sin módulos, dependencias ni contratos nuevos.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes.
- Las skills se escriben en inglés; las plantillas, en castellano (Art. III).
- Topes: `sdd-propose` `SkillMd = 5200; Total = 6700`; `sdd-parallel-agents` `SkillMd = 1150; Total = 1150`.

### De proceso

- Política de modelos de la spec (decisión 5): ejes Spec opus+high y Código sonnet+high; sujetos Sonnet (`mp1` en Opus), por tandas de hasta 5; en paralelo hasta `control.maxParallelAgents` (3), confirmado al aprobar la spec.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- Los RED de Pester se guardan fuera de `tests/` hasta su task: el pre-commit rechaza un test en rojo.

## Review Focus

- Una spec en `pair` (sin `delegate`) → no exige la línea «Política de modelos»: el hueco dice «solo en `delegate`» · Task 1, `ProposeFixes: la política de modelos es solo de delegate`
- Un patch de un texto literal («Cambia "Guardar" por "Guardar y cerrar"») → sigue siendo patch: un test · Task 4, escenario `a2` del tramo de control y `ProposeFixes: el patch nombra su test`
- Una «Verificación» en un proyecto sin tests automáticos → el placeholder deja el smoke manual: la línea de resumen es «de un comando», no obliga a inventar uno · Task 3, `ProposeFixes: la verificación admite smoke manual`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada arreglo es una frase o un hueco; ningún verbo nuevo de la CLI.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (RED y GREEN por arreglo, previsión), Art. II (huecos en plantilla), Art. III (idioma), Art. VIII (plantillas solo en `sdd-templates`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ProposeFixes.Tests.ps1` — Pester de frases de las cinco tasks.
- `tests/sdd-propose-0185-red.md` y `tests/sdd-propose-0185-green.md` — la evidencia de la campaña.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md` — topes, lo que se retira, política de modelos, ayuda del `MODIFIED`, «Aprobaciones», `approvers`.
- `skills/sdd-propose/SKILL.md` — paso 2, «Is it really a patch?», «Coherence pass».
- `skills/sdd-propose/references/spec-writing.md` — «Design by sections».
- `skills/sdd-templates/templates/plan-template.md` y `skills/sdd-propose/references/plan-writing.md` — §4 por cláusula, regla retirada, «Verificación».
- `skills/sdd-parallel-agents/SKILL.md` — la aprobación de la spec como confirmación.
- `tests/WordBudget.Tests.ps1` — topes.
- `tests/batteries/sdd-propose/battery.md` y `subject.sh` — `sp1`, `pl2`, rúbrica y procedencia de `pl1`, `pb`.
- `tests/batteries/sdd-verify/battery.md` y `subject.sh` — `mp1`.

**NO se tocan**:

- `skills/sdd-verify/SKILL.md`, `review-spec.md`, `sdd-start-patch`, `patch-template.md`, la constitution y las fixtures con «Rol» — spec, «No entra».

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El GREEN de `mp1` no reproduce la parada sin un `CLAUDE.md` que la pida | media | el escenario no mide nada | el molde lleva un `CLAUDE.md` con «antes de paralelizar subagentes, pide confirmación»; RED de `mp1` con n = 1 antes de la regla |
| Un hueco nuevo de la plantilla tienta a rellenarlo en specs sin topes ni retiradas | baja | ruido | marcador «nada: comprobado con …» y bloque condicional; `pb-c` y `s1` de control |

### 1.8 Rollout

Directo; va en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Plantilla de spec y repaso de coherencia

**Tras**: —
**Modelo**: la sesión (Native), sin despacho
**Tests RED**: hilo principal · `tests/ProposeFixes.Tests.ps1`, `Describe 'spec-template y repaso'`; RED estructural ya leído (spec, Approach)

**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ProposeFixes.Tests.ps1,tests/WordBudget.Tests.ps1 -CI -Output Normal"`, que acaba en `Tests Passed: <n>, Failed: 0` y sale con 1 si algo falla
**Verificación lenta**: `BATTERY=sdd-propose STEPS=spec-slots … bash tests/headless/battery.sh` (`sp1`, n = 2, Sonnet), ~15 min

**Interfaces**:
- Consume: nada
- Produce: las secciones `## Topes de palabras` y `## Lo que se retira o cambia de forma` de `spec-template.md`, y la línea `Política de modelos:` del ✋

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-propose/SKILL.md`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-propose/battery.md`, `tests/batteries/sdd-propose/subject.sh`; crear `tests/ProposeFixes.Tests.ps1`

- [ ] **Step 1: Implementación**
  - `spec-template.md`:
    - frontmatter `approvers` con `name` y `approved_at`, sin `role`;
    - tras «Scope», `## Lo que se retira o cambia de forma`: tabla `| Qué | Dónde aparece | Destino |`, fila `Filas que implementa: <id> → <ficheros>` y marcador «nada: comprobado con `<búsqueda>`», con su ayuda (no se borra);
    - antes de «Enmiendas», `## Topes de palabras *(solo si el proyecto pone topes a lo que la spec edita)*` con la tabla `| Fichero | Medido / tope | Margen | Tope propuesto |` y las tres reglas (lo previsto + 2 %, mínimo 20; skill que funde otras; recorte = edición con RED);
    - en el ✋, la línea `- Política de modelos (solo en delegate): …` con su efecto;
    - la ayuda del `MODIFIED` cambia «lo que no esté aquí desaparece» por `- REMOVED <línea>` y renombrado = REMOVED + ADDED;
    - «Aprobaciones» con `| Nombre | Fecha | Estado |` y la regla del Estado (`aprobada (opción «<etiqueta sin sufijo>»)` / `aprobada: «<frase>»`).
  - `sdd-propose/SKILL.md`, «Coherence pass»: la frase de cada `MODIFIED` se funde con la de lo que se retira o cambia de forma y los ids de fila, todo escrito en la sección nueva; la prueba del delta con `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, con la línea del resultado en ✋; y, en `delegate`, la línea «Política de modelos».
  - `WordBudget.Tests.ps1`: `'sdd-propose' = @{ SkillMd = 5200; Total = 6700 }`.
  - Pester: `spec-template.md` no tiene `| Rol |` ni `role:`; tiene `## Lo que se retira o cambia de forma`, `## Topes de palabras`, `Política de modelos`, `- REMOVED <línea>`, `REMOVED` + `ADDED` en la ayuda del `MODIFIED`, y `aprobada (opción`; `sdd-propose/SKILL.md` nombra `capability merge` y «Lo que se retira o cambia de forma» dentro de «Coherence pass»; `ProposeFixes: la política de modelos es solo de delegate`.
  - Batería: `sp1` (paso `spec-slots`), molde `reservas-topes`, con `capabilities/bookings.md` («Cancelar una reserva propia» y «Anular una reserva»), `docs/guia.md` con tope de 300 palabras en `test/words.test.js`, el comando `anular` nombrado en `README.md` y en `docs/guia.md`, y la fila 0009 que la 0012 implementa. Petición: «Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La entrevista ya está hecha; decidido con el dev-lead: se retira el comando anular; el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»; la guía docs/guia.md se actualiza. Perfil delegate. Escribe la spec en su carpeta y preséntamela para aprobar.» Rúbrica SP1: falla si `spec-new.md` no lleva la tabla de topes con `docs/guia.md`, o la sección de lo que se retira sin `README.md` y `docs/guia.md` para `anular` y sin la fila 0009, o el renombrado no va como REMOVED + ADDED, o `tools.txt` no tiene `capability merge` sobre una ruta fuera del molde, o falta `Política de modelos`, o «Aprobaciones» lleva «Rol».
- [ ] **Step 2: Build** — sin build.
- [ ] **Step 3: Verificación** — Pester verde; `sp1` 2/2 con la rúbrica SP1, y `s1` y `t1` 1/1 de control.
- [ ] **Step 4: Commit de la task**.

### Task 2 — La aprobación de la spec como confirmación de paralelizar

**Tras**: Task 1
**Modelo**: la sesión (Native), sin despacho
**Tests RED**: hilo principal · `tests/ProposeFixes.Tests.ps1`, `Describe 'parallel-agents'`; `mp1` con n = 1 sobre el kit de la base

**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ProposeFixes.Tests.ps1,tests/WordBudget.Tests.ps1 -CI -Output Normal"`
**Verificación lenta**: `BATTERY=sdd-verify STEPS=policy … bash tests/headless/battery.sh` (`mp1`, n = 2, Opus), ~20 min

**Interfaces**:
- Consume: la línea `Política de modelos: …` del ✋ de `spec-template.md` (Task 1)
- Produce: nada

**Ficheros**: modificar `skills/sdd-parallel-agents/SKILL.md`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-verify/battery.md`, `tests/batteries/sdd-verify/subject.sh`, `tests/ProposeFixes.Tests.ps1`

- [ ] **Step 1: Implementación**
  - En «The project's cap» de `sdd-parallel-agents`: en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` y nombra estos despachos, esa aprobación es la confirmación que pidan las instrucciones del usuario antes de paralelizar, así que no se vuelve a preguntar. Un despacho o un modelo que la línea no nombra se confirma.
  - `WordBudget.Tests.ps1`: `'sdd-parallel-agents' = @{ SkillMd = 1150; Total = 1150 }`.
  - Pester: la frase nombra `Política de modelos` y `delegate`.
  - Batería de `sdd-verify`: `mp1` (paso `policy`), el montaje de `f1` más un `CLAUDE.md` en la raíz del molde con «Antes de paralelizar subagentes, justifica el modelo y pide confirmación», y la spec de la 0010 con la línea `Política de modelos: revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`. Rúbrica MP1: falla si el sujeto pregunta o para antes de despachar los ejes, o si los despacha en mensajes distintos.
- [ ] **Step 2: Build** — sin build.
- [ ] **Step 3: Verificación** — Pester verde; RED `mp1` 1/1 parando (si sale limpio, se mira de dónde saca la conducta antes de seguir); GREEN `mp1` 2/2.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Plantilla de plan: cláusulas, regla retirada y «Verificación»

**Tras**: Task 1
**Modelo**: la sesión (Native), sin despacho
**Tests RED**: hilo principal · `tests/ProposeFixes.Tests.ps1`, `Describe 'plan-template'`

**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ProposeFixes.Tests.ps1,tests/PlanReviewFocus.Tests.ps1,tests/WordBudget.Tests.ps1 -CI -Output Normal"`
**Verificación lenta**: `BATTERY=sdd-propose STEPS=plan-clauses … bash tests/headless/battery.sh` (`pl2`, n = 2, Sonnet), ~15 min

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-propose/references/plan-writing.md`, `tests/batteries/sdd-propose/battery.md`, `tests/batteries/sdd-propose/subject.sh`, `tests/ProposeFixes.Tests.ps1`

- [ ] **Step 1: Implementación**
  - `plan-template.md` §4: `- <THEN o AND de la spec> → Task <n>, <test o fila de medición que la observa>. ✓`, `- <cláusula> → sin observar: <motivo> (avisado en las decisiones)`, `- <fila de «regla retirada → dónde vive ahora»> → Task <n>, <test que busca la regla en su destino>. ✓`; el placeholder de «Verificación» pide la última línea de resumen sin códigos de color (`NO_COLOR=1`, `--reporter=dot`, `-CI` en Pester) y sigue admitiendo el smoke manual.
  - `plan-writing.md`, Self-review 1: cada cláusula de cada THEN (y cada fila de la tabla «regla retirada») apunta a lo que la observa; una que nada observa se avisa antes de ejecutar.
  - Pester: §4 tiene `sin observar` y `regla retirada`; «Verificación» nombra `NO_COLOR` y el resumen; `ProposeFixes: la verificación admite smoke manual`.
  - Batería: `pl2` (paso `plan-clauses`), molde `reservas-plan`: la 0010 aprobada con un THEN «el comando pregunta el motivo · AND el listado de canceladas lo enseña» y un anexo «regla retirada → dónde vive ahora» con dos filas. Petición: la de `p2`. Rúbrica PL2: falla si §4 de `plan-new.md` no tiene una línea por cláusula de ese THEN, o no tiene las dos filas del anexo con su test, o una «Verificación» no dice cómo sale el resumen.
- [ ] **Step 2: Build** — sin build.
- [ ] **Step 3: Verificación** — Pester verde; `pl2` 2/2; `p2` 1/1 de control.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Un patch es lo que un solo test reproduce

**Tras**: Task 1
**Modelo**: la sesión (Native), sin despacho
**Tests RED**: hilo principal · `tests/ProposeFixes.Tests.ps1`, `Describe 'patch con su test'`; RED de conducta `pl1` 0/2, hecho

**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ProposeFixes.Tests.ps1,tests/PatchLane.Tests.ps1,tests/WordBudget.Tests.ps1 -CI -Output Normal"`
**Verificación lenta**: `BATTERY=sdd-propose STEPS=ceremony … bash tests/headless/battery.sh` con `pl1` n = 2 y `a2`, `a3`, `a4`, `l1` n = 1, ~25 min

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-propose/SKILL.md`, `tests/batteries/sdd-propose/battery.md`, `tests/ProposeFixes.Tests.ps1`

- [ ] **Step 1: Implementación**
  - Paso 2, viñeta **patch**: un patch nombra el test que hoy sale en rojo y el arreglo pone en verde; en un ajuste o una retirada, la captura del estado actual; con dos o más comportamientos nuevos, no es patch: lite si su predicado se cumple, feature si no. La pregunta del carril de un patch nombra el test.
  - «Is it really a patch?»: la misma condición en el nodo de la petición cerrada y en **Fixed solution**, con el contraejemplo `reservas <sala>` + mensaje vacío + `libres` → lite.
  - Pester: `ProposeFixes: el patch nombra su test` (el paso 2 nombra el test que reproduce y «two or more»); `PatchLane.Tests.ps1` sigue verde.
  - Batería: rúbrica PL1 (falla si abre `patch.md` o rama de patch, o no ofrece lite citando sus condiciones); procedencia de la regla.
- [ ] **Step 2: Build** — sin build.
- [ ] **Step 3: Verificación** — Pester verde; `pl1` 2/2; `a2`, `a3`, `a4`, `l1` 1/1.
- [ ] **Step 4: Commit de la task**.

### Task 5 — Secciones del diseño en llano

**Tras**: Task 1
**Modelo**: la sesión (Native), sin despacho
**Tests RED**: hilo principal · `tests/ProposeFixes.Tests.ps1`, `Describe 'secciones en llano'`; RED de conducta `pb` 0/2, hecho

**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ProposeFixes.Tests.ps1,tests/SuperpowersCompat.Tests.ps1,tests/WordBudget.Tests.ps1 -CI -Output Normal"`
**Verificación lenta**: `BATTERY=sdd-propose STEPS=sections … bash tests/headless/battery.sh` (`pb` n = 2, `pb-c` n = 1), ~10 min

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-propose/references/spec-writing.md`, `tests/batteries/sdd-propose/battery.md`, `tests/ProposeFixes.Tests.ps1`

- [ ] **Step 1: Implementación**
  - «Design by sections»: cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos, y la pregunta es sobre eso; los nombres de código, ficheros y flags internos, detrás y solo si hacen falta (la forma del modo corto de `sdd-rubber-duck`), con un contraejemplo de otro dominio.
  - Pester: «Design by sections» nombra «for whoever uses the product» y el contraejemplo.
  - Batería: rúbrica PB-L (falla si la primera sección abre con un identificador de código o una ruta antes de decir qué ve quien usa `informes`); procedencia.
- [ ] **Step 2: Build** — sin build.
- [ ] **Step 3: Verificación** — Pester verde; `pb` 2/2 con PB y PB-L; `pb-c` 1/1.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Base de la estimación: 5 tasks de texto con un escenario de batería cada una (~15-25 min de campaña cada uno, en segundo plano); referencia: la 0149 (~3 h de campaña con 32 sujetos)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Tramo de control de `sdd-propose`: `a1`, `p2`, `s1`, `t1` (los que no corrieron en sus tasks), n = 1
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` «La spec se repasa antes del gate», THEN y AND vigentes → sin cambio de conducta; control `s1` y `t1` (Task 1). ✓
- AND lo que se retira o cambia de forma → Task 1, `sp1` (rúbrica SP1, `anular` en `README.md` y `docs/guia.md`). ✓
- AND ids de fila que implementa → Task 1, `sp1` (fila 0009) y `t1`. ✓
- AND `capability merge` sobre una copia → Task 1, `sp1` (`tools.txt`). ✓
- «Una feature grande… por secciones», AND vigentes → control `pb-c` (Task 5). ✓
- AND cada sección abre en llano → Task 5, `pb` (PB-L). ✓
- «La spec mide el margen de palabras», THEN tabla → Task 1, `sp1`; AND tope + 2 % → Task 1, Pester (ayuda de la plantilla); AND skill que funde otras → Task 1, Pester; AND recorte = edición con RED → Task 1, Pester; AND sin topes no se escribe → Task 1, control `s1`. ✓
- «La política de modelos… confirmación», THEN despacha sin preguntar → Task 2, `mp1`; AND revisores de spec → Task 2, Pester (la frase nombra los dos despachos); AND lo no nombrado se confirma → Task 2, Pester; AND en `delegate` sin la línea no pasa el repaso → Task 1, `sp1` (SP1, `Política de modelos`). ✓
- «El self-review del plan asigna cada cláusula», THEN una línea por cláusula → Task 3, `pl2`; AND `sin observar` → Task 3, Pester; AND filas de la regla retirada → Task 3, `pl2`. ✓
- «La verificación de una task dice su línea de resumen» (enmienda 2026-10-18), THEN → Task 3, `pl2` (PL2) y Pester; AND smoke manual → Task 3, `ProposeFixes: la verificación admite smoke manual`. ✓
- «La fila de Aprobaciones», THEN columnas y opción → Task 1, Pester y `sp1`; AND frase literal → Task 1, Pester; AND `approvers` sin `role` → Task 1, Pester. ✓
- `capabilities` «El delta declara…», AND `- REMOVED <línea>` y renombrado → Task 1, Pester y `sp1` (REMOVED + ADDED). ✓
- `routing` «Un patch es lo que un solo test reproduce», THEN lite recomendado → Task 4, `pl1`; AND el fallo sigue patch con su test → Task 4, `a3`; AND la captura en presentación → Task 4, Pester. ✓
- Review Focus, delegate → Task 1, `ProposeFixes: la política de modelos es solo de delegate`. ✓
- Review Focus, texto literal → Task 4, `a2` y `ProposeFixes: el patch nombra su test`. ✓
- Review Focus, smoke manual → Task 3, `ProposeFixes: la verificación admite smoke manual`. ✓
