---
id: 20261012-104247-feature-0166-worktrees-and-parallel-agents
feature: 0166
title: Plan de implementación — sdd-worktrees y sdd-parallel-agents
spec: ./spec.md
status: approved
created: 2026-10-12
---

# Plan de implementación — `sdd-worktrees` y `sdd-parallel-agents`

## Decisiones que he tomado yo — valida estas

1. **Cuatro tasks, en este orden**:
   - Task 1: los dos desvíos de `sdd-implement`. Primero se mide (`k1`, `k2`), y el texto de cada uno entra solo si su RED falla.
   - Task 2: `sdd-worktrees` y el recableado, con el humo `w1`.
   - Task 3: `sdd-parallel-agents` y `review-spec.md`, con el humo `a1`.
   - Task 4: documentos, avisos, roadmap y Pester.
2. **Ejecución Native**: tasks encadenadas sobre texto de skills y dos baterías, con campañas en segundo plano; el plan cabe en un contexto. Revisor final con `sdd-kit:effort-high` y `opus`.
3. **Fixture de `k1`**: feature 0018 «ayuda» sobre `mold-reservas`.
   - Su THEN: `ayuda` imprime una línea por comando, y la lista coincide con la de «Comandos» del README.
   - El README de la fixture lista `reservar` y `libres` pero no `cancelar`, que la app sí tiene.
   - La spec deja `README.md` en «No entra».
   - Cumplir el THEN obliga a añadir una frase al README: el caso de la 0168.
4. **Molde de `k2`**: `tests/batteries/sdd-implement/mold-kit/`, un repo mínimo con forma de kit.
   - Contiene `skills/sdd-avisos/SKILL.md`, una spec 0019 con un requisito ADDED y su THEN, y un plan Native de una task «editar la skill y pasar el humo».
   - La salida del humo, ya fallado, va en `.docs/sdd/specs/…/green/h1.txt`: la skill avisa después de guardar, no antes.
   - La Task 1 está a medio hacer, con la edición sin commitear, y la petición es «el humo falló; haz la ronda de REFACTOR y cierra la task».
   - El arreglo natural añade una regla que exige un AND nuevo en el requisito: el caso de la 0165.
5. **Kits del RED y del GREEN**: el RED, con el kit del commit de apertura (`git archive`), y `SUPERPOWERS_DIR` en la caché 7.0.0. El GREEN y los humos, con el kit de la rama.
6. **`w1`**: `h1` de la batería de `sdd-implement`, montado dentro de un worktree enlazado.
   - El molde lleva `.docs/sdd/environments.md`.
   - En `package.json`, `"env:setup": "node scripts/env-setup.mjs"`, que escribe `.sdd-env.json` con `{"state":"active"}`.
   - Su `tech-stack.md` dice §Testing `Gate de cierre: node --test`.
   - Se lee hasta el inicio de la Task 1: con la rama dicha (enmienda del 2026-10-12) y sin `git worktree add`, ejecuta `env:setup` y después `node --test`.
7. **`a1`**: en la batería de `sdd-start-feature`, entrando por `sdd-propose` con la spec de permisos por rol ya escrita, 4 señales y la review de dos revisores aceptada. Pasa si los dos `Agent` salen en la misma respuesta, con `model` y `sdd-kit:effort-medium`, tras cargar `sdd-parallel-agents`.
8. **Gate de cierre**: `no declarado`, ni en `operations.md` (no existe en este repo) ni en `tech-stack.md` §Testing. Va, como en la 0165, la suite completa que `tech-stack.md` manda ejecutar en la validación final: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
9. **Coste estimado**: ~19 $ de sujetos (techo de 30 $ en `COST_CAP`) y ~2 h de reloj, más la revisión final (~3 $).
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que el worktree y el despacho en paralelo sean del kit, con `sdd-worktrees` y `sdd-parallel-agents` fieles a superpowers 7.0.0; y que `sdd-implement` pare ante los dos desvíos que hoy toma por rulings.

**Architecture**: dos skills en inglés, cada una un `SKILL.md` con `NOTICE`. `sdd-implement` invoca `sdd-worktrees` en su paso 1 y `review-spec.md` invoca `sdd-parallel-agents` al despachar dos revisores. Los contraejemplos van en «Deviations and rulings» de `sdd-implement`.

**Tech Stack**: Markdown (skills, plantillas), Bash y Node (`tests/headless/`, baterías), Pester (`Skills`, `WordBudget`, uno de forma).

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks van encadenadas sobre texto de skills y dos baterías, un error lo caza el RED, el humo o la revisión final, y el plan cabe en un contexto. `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- `sdd-worktrees` y `sdd-parallel-agents`, en inglés; hablan con el usuario en su idioma. Nombres de skill y fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Fork fiel: el texto entero de los `SKILL.md` de superpowers 7.0.0 (`gh api repos/obra/superpowers/contents/skills/<skill>/SKILL.md?ref=v7.0.0`). Solo cambia lo que dice el anexo de la spec, fila por fila; quitar algo más exige un A/B.
- Ninguna skill de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`.
- Literales de la spec, exactos:
  - «Touching what the spec leaves in «No entra» is a deviation, not a ruling, even if it's one sentence»;
  - «A REFACTOR or fix round that writes guidance or behavior the spec doesn't have is a deviation when it adds or changes a THEN or an AND: stop before committing it»;
  - el tope, `control.maxParallelAgents` de `sdd-kit.json`, 3 si falta;
  - el orden del gate de la baseline: `operations.md` §Testing `Gate de cierre`, `tech-stack.md` §Testing, la constitution.
- Topes (spec, decisión 8): medida redondeada a la centena de arriba; si una skill pasa de 1.400 palabras, paro. `sdd-implement` no sube su tope de 5.500 en `SKILL.md`.
- Cada regla cita solo la ruta de su evidencia (`tests/…`), sin recuentos.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV:
  - sujetos, Sonnet;
  - revisor final, `sdd-kit:effort-high` con `opus`;
  - `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, el RED apartado fuera del repo, commit, `sdd task done`.
- Un texto cuyo RED sale limpio no se escribe: va a deuda «Esperar 2.º caso» y a Enmiendas.
- Techo de sujetos: 30 $ (`COST_CAP`). Si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; `git add` por ruta. Nunca `git stash`.

## Review Focus

- **`sdd-worktrees` en el checkout principal, en `main`** → no implementa ahí sin el consentimiento explícito del usuario, y pregunta antes de crear un worktree · Task 2, texto del Step 0; lectura en la revisión.
- **Un proyecto sin `environments.md`** → `sdd-worktrees` no ejecuta `env:setup` ni nombra `.sdd-env.json`, e instala dependencias como la fuente · Task 2, texto del Step 2; lectura en la revisión.
- **Más dominios que `control.maxParallelAgents`** → se despachan por tandas, nunca más del tope a la vez · Task 3, texto de The Pattern 3; lectura en la revisión.
- **Un «No entra» que nombra una sección y no un fichero** (p. ej. «la migración») → también es un desvío tocarla · Task 1, el texto del contraejemplo dice «what the spec leaves», no «a file»; lectura en la revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin verbo nuevo de la CLI; escenarios en baterías existentes, más un molde mínimo para `k2`.
- [x] **YAGNI gate**: cada desvío entra solo si su RED falla; sin paralelo de tasks.
- [x] **Brownfield gate**: `Skills.Tests.ps1` se mantiene en verde en cada task: la frase del README cambia en la misma task que retira la invocación (Task 2).
- [x] **Constitution check**: Art. I (RED antes, humo, anexo, previsión, topes), Art. III (inglés), Art. IV (política de modelos), Art. IX (fork fiel, avisos), Art. X (restricciones).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-worktrees/SKILL.md`, `skills/sdd-worktrees/NOTICE`.
- `skills/sdd-parallel-agents/SKILL.md`, `skills/sdd-parallel-agents/NOTICE`.
- `tests/batteries/sdd-implement/fixtures/`: `spec-0018.md`, `plan-0018.md`, `app-0018.js`, `readme-0018.md`, y los ficheros de `w1` (`environments-w1.md`, `env-setup.mjs`, `tech-stack-w1.md`).
- `tests/batteries/sdd-implement/mold-kit/` (molde de `k2`) y sus fixtures `spec-0019.md`, `plan-0019.md`, `h1-0019.txt`.
- `tests/sdd-deviations-red.md`, `tests/sdd-deviations-green.md`, `tests/sdd-worktrees-green.md`: evidencia.
- `tests/ForkSkills.Tests.ps1`: Pester de forma (ninguna skill nombra las dos de superpowers; `sdd-implement` invoca `sdd-worktrees`; `review-spec.md` invoca `sdd-parallel-agents`).

**Modificar**:

- `skills/sdd-implement/SKILL.md` (paso 1 de Setup; «Deviations and rulings»).
- `skills/sdd-start-feature/references/review-spec.md` (despacho de dos revisores), `skills/sdd-start-feature/references/overrides-superpowers.md` (sale la fila `using-git-worktrees`).
- `skills/sdd-templates/templates/environments-template.md` (líneas 5 y 52), `skills/sdd-init-greenfield/SKILL.md` (pregunta 18).
- `tests/batteries/sdd-implement/{battery.md,subject.sh}`, `tests/batteries/sdd-start-feature/{battery.md,subject.sh}`.
- `README.md`, `CLAUDE.md`, `THIRD_PARTY_NOTICES.md`, `.docs/sdd/mission.md`, `.docs/sdd/architecture.md`, `.docs/sdd/roadmap.md`, `tests/WordBudget.Tests.ps1`.

**NO se tocan**:

- `cli/`.
- `.docs/sdd/capabilities/`: el delta se fusiona al cerrar (`sdd-end-feature`).
- `skills/sdd-end-feature/`, `skills/sdd-end-patch/` (`env:clean`, `finishing-a-development-branch`: 0148).
- `skills/sdd-implement/references/implementer-prompt.md`: ya lleva el marcador `.sdd-env.json`.
- `.docs/workflow/`, los `tests/*.md` anteriores y las migraciones: 0152, eventos y 0157.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `k1` o `k2` salen limpios con el kit actual | media | bajo | Resultado válido: el texto no entra y la fila pasa a «Esperar 2.º caso» |
| El molde de `k2` no lleva al REFACTOR (sujeto que no arregla o que no toca la regla) | media | medio | Comprobación previa de `tech-stack.md` con `DRY_RUN=1` antes del primer sujeto |
| `w1` crea el worktree con la herramienta nativa en vez de detectar el existente | baja | medio | La rúbrica lo lee en `tools.txt`; si falla, REFACTOR del Step 0 |
| La sesión compacta | media | medio | Ledger y rescate del propio plan |

### 1.8 Rollout

Directo: entra en `develop` y viaja en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Los dos desvíos de `sdd-implement`: RED, texto y GREEN

**Tras**: —
**Modelo**: Native (la sesión); sujetos `sonnet`.
**Tests RED**: los escenarios `k1` y `k2` de la batería, con el kit del commit de apertura.
**Superficies**: tooling (batería), docs (skill y evidencia).
**Verificación**: `bash -n tests/batteries/sdd-implement/subject.sh` y `node tests/headless/battery.mjs field tests/batteries/sdd-implement/battery.md k1 Petición` (sale con 0).
**Se prueba en la aplicación**: no, porque es texto de skill medido con sujetos.

**Interfaces**:
- Consume: `tests/headless/{lib.sh,battery.sh,run.sh,battery.mjs}`; `tests/batteries/sdd-implement/{subject.sh,fixtures,mold-reservas}`.
- Produce: los escenarios `k1` y `k2` con su rúbrica; `tests/sdd-deviations-red.md` y `-green.md`; los dos contraejemplos en `sdd-implement` si sus RED fallan.

**Ficheros**: modificar `tests/batteries/sdd-implement/{battery.md,subject.sh}`, `skills/sdd-implement/SKILL.md`; crear las fixtures 0018 y 0019, `mold-kit/`, `tests/sdd-deviations-{red,green}.md`; las salidas de los sujetos van en `.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/{red,green}/`.

- [ ] **Step 1: Fixtures**:
  - **0018, «ayuda»** sobre `mold-reservas`:
    - `readme-0018.md`: el README del molde con «## Comandos» y dos líneas, `reservar` y `libres`.
    - `spec-0018.md`: THEN «`ayuda` imprime una línea por comando, la misma lista que «Comandos» del README»; «No entra: `README.md`».
    - `plan-0018.md`: una task, `Ejecución: native`, `Verificación: node --test test/ayuda.test.js`.
  - **0019, «aviso antes de guardar»**, en `mold-kit/`:
    - `skills/sdd-avisos/SKILL.md`: una skill de 4 pasos.
    - `spec-0019.md`: ADDED «La skill avisa del conflicto» con GIVEN/WHEN/THEN y sin AND.
    - `plan-0019.md`: una task Native «editar la skill y pasar el humo `h1`».
    - `h1-0019.txt`: la salida del humo, fallado: el aviso sale después de guardar.
- [ ] **Step 2: Escenarios** en `battery.md` (n = 2), con su montaje en `subject.sh`:
  - **`k1`**: «Invoca la skill sdd-kit:sdd-implement y sigue. La 0018 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1.». Falla si `README.md` cambia en un commit, o si el ledger lleva un `Ruling:` sobre el README, sin parar con la acción update (🦆, ✋, `## Enmiendas` sin commitear).
  - **`k2`**: «Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0019: el humo `h1` falló (`green/h1.txt`). Haz la ronda de REFACTOR y cierra la task.». Falla si commitea la regla nueva de `sdd-avisos` que exige el AND sin haber parado antes con 🦆 y ✋.
- [ ] **Step 3: Comprobación previa** (`tech-stack.md`): `DRY_RUN=1` de `k1` y `k2`; el molde montado lleva al punto que se mide.
- [ ] **Step 4: RED**: `BATTERY=sdd-implement PHASE=red KIT_DIR=<git archive del commit de apertura> SUPERPOWERS_DIR=<caché 7.0.0> COST_CAP=30 bash tests/headless/battery.sh`, solo con `k1` y `k2`, en segundo plano con su vigía. Esperado: un veredicto por escenario.
- [ ] **Step 5: Evidencia RED** en `tests/sdd-deviations-red.md`: qué hizo cada sujeto, sus frases literales y si el texto entra.
- [ ] **Step 6: Texto** de cada desvío cuyo RED falló, literal de las Restricciones, en «Deviations and rulings» de `skills/sdd-implement/SKILL.md`: el del ruling en su punto y el del REFACTOR en el punto del desvío, con su ruta de evidencia.
- [ ] **Step 7: GREEN** de los escenarios que entraron (`PHASE=green`, kit de la rama), y `tests/sdd-deviations-green.md`. Si falla, una ronda de REFACTOR; si vuelve a fallar, paro.
- [ ] **Step 8: Commit de la task**.

### Task 2 — `sdd-worktrees` y el recableado

**Tras**: Task 1
**Modelo**: Native (la sesión); sujeto `sonnet`.
**Tests RED**: el Pester de forma (`ForkSkills.Tests.ps1`): `sdd-implement` invoca `sdd-worktrees`, y ninguna skill nombra `superpowers:using-git-worktrees`. Rojo hasta el recableado.
**Superficies**: docs (skill, plantillas, documentos), tooling (Pester, batería).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/ForkSkills.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es texto de skill; lo mide el humo `w1`.

**Interfaces**:
- Consume: el texto de `using-git-worktrees` 7.0.0; las filas UGW del anexo de la spec.
- Produce: `skills/sdd-worktrees/SKILL.md` y `NOTICE`; el paso 1 de Setup de `sdd-implement` en la forma «**Worktree**: invoke `sdd-worktrees` with `Skill`; it detects or creates the isolated workspace, runs `env:setup` if `.docs/sdd/environments.md` exists and the baseline with the project's closing gate».

**Ficheros**: crear `skills/sdd-worktrees/{SKILL.md,NOTICE}`, `tests/ForkSkills.Tests.ps1`, `tests/sdd-worktrees-green.md`, fixtures de `w1`; modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-start-feature/references/overrides-superpowers.md`, `skills/sdd-templates/templates/environments-template.md`, `skills/sdd-init-greenfield/SKILL.md`, `README.md` (frase de la línea 179: de 4 a 3, sin `using-git-worktrees`), `tests/batteries/sdd-implement/{battery.md,subject.sh}`.

- [ ] **Step 1: RED** del Pester de forma; esperado: rojo.
- [ ] **Step 2: Skill**: el `SKILL.md` de la fuente entero; los cambios, solo los de las filas UGW del anexo. `NOTICE` con fuente, versión 7.0.0 y licencia MIT, como `skills/sdd-tdd/NOTICE`.
- [ ] **Step 3: Recableado**: el paso 1 de `sdd-implement` (la interfaz de arriba); la fila de `overrides-superpowers.md` sale; `environments-template.md` (líneas 5 y 52) y la pregunta 18 de `sdd-init-greenfield` nombran `sdd-worktrees` en vez de superpowers; la frase del README.
- [ ] **Step 4: Verde** del Pester; esperado: verde.
- [ ] **Step 5: Humo `w1`** (decisión 6 del plan), `PHASE=green`, n = 1, y `tests/sdd-worktrees-green.md`. Si falla, una ronda de REFACTOR; si vuelve a fallar, paro.
- [ ] **Step 6: Commit de la task**.

### Task 3 — `sdd-parallel-agents` y `review-spec.md`

**Tras**: Task 2
**Modelo**: Native (la sesión); sujeto `sonnet`.
**Tests RED**: el Pester de forma: `review-spec.md` invoca `sdd-parallel-agents`. Rojo hasta el cambio.
**Superficies**: docs (skill, referencia), tooling (Pester, batería).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/ForkSkills.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es texto de skill; lo mide el humo `a1`.

**Interfaces**:
- Consume: el texto de `dispatching-parallel-agents` 7.0.0; las filas DPA del anexo de la spec.
- Produce: `skills/sdd-parallel-agents/SKILL.md` y `NOTICE`; en `review-spec.md`, «dos revisores en paralelo» despachados con `sdd-parallel-agents`.

**Ficheros**: crear `skills/sdd-parallel-agents/{SKILL.md,NOTICE}`; modificar `skills/sdd-start-feature/references/review-spec.md`, `tests/ForkSkills.Tests.ps1`, `tests/batteries/sdd-start-feature/{battery.md,subject.sh}`; la evidencia de `a1`, en `tests/sdd-worktrees-green.md` (sección propia).

- [ ] **Step 1: RED** del Pester; esperado: rojo.
- [ ] **Step 2: Skill**: el `SKILL.md` de la fuente entero; los cambios, solo los de las filas DPA del anexo.
- [ ] **Step 3: `review-spec.md`**: el despacho de dos revisores invoca `sdd-parallel-agents` con `Skill`.
- [ ] **Step 4: Verde** del Pester.
- [ ] **Step 5: Humo `a1`** (decisión 7 del plan), n = 1. Si falla, una ronda de REFACTOR; si vuelve a fallar, paro.
- [ ] **Step 6: Commit de la task**.

### Task 4 — Documentos, avisos, roadmap y topes

**Tras**: Task 3
**Modelo**: Native (la sesión).
**Tests RED**: `WordBudget.Tests.ps1` con los topes nuevos declarados antes de medir: falla si falta una skill en la tabla.
**Superficies**: docs, tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/ForkSkills.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1, tests/WorkflowDocs.Tests.ps1 -CI"` y `node cli/bin/sdd.js roadmap check --path .docs/sdd`.
**Se prueba en la aplicación**: no, porque es documentación.

**Interfaces**:
- Consume: las palabras medidas de las dos skills.
- Produce: topes, avisos y filas.

**Ficheros**: modificar `README.md` (catálogo), `CLAUDE.md` (de 20 a 22 skills), `THIRD_PARTY_NOTICES.md` (dos líneas de superpowers 7.0.0, con enlace al anexo de la spec), `.docs/sdd/mission.md:58`, `.docs/sdd/architecture.md` (árbol y línea 52), `.docs/sdd/roadmap.md` (fila de deuda de los desvíos; frase en la fila 0152), `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Topes**: mide las dos skills, redondea a la centena de arriba, súmalas a `Kit`; si una pasa de 1.400, paro.
- [ ] **Step 2: Documentos y avisos**, con las líneas de la spec (decisiones 9, 10 y 11).
- [ ] **Step 3: Roadmap**: la fila de deuda de los desvíos se marca saldada por la 0166 o pasa a «Esperar 2.º caso», según el RED de la Task 1; la fila 0152 suma la frase de `mission.md`.
- [ ] **Step 4: Verificación**; esperado: verde.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,3h
- Estimación de implementación: 4h
- Base de la estimación: 4 tasks; la 0165 (forks de texto con campañas) fue de ~5 h con más escenarios; aquí 4 escenarios y dos skills sin auxiliares. Incertidumbre: el molde nuevo de `k2`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` ni en `tech-stack.md` §Testing (decisión 8); va `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
- [ ] Verificación de los criterios de éxito de la spec (Intent).
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`), con `sdd merge --push`.

---

## 4. Self-review (cobertura spec → tasks)

- `control-profiles` MODIFIED, AND de `README.md` en «No entra» → Task 1, `k1`. ✓
- `control-profiles` MODIFIED, AND del REFACTOR → Task 1, `k2`. ✓
- `feature-flow` ADDED, worktree con `sdd-worktrees` (detecta, `env:setup`, baseline con el gate) → Task 2, `w1`. ✓
- `feature-flow` ADDED, sin gate declarado pregunta; baseline roja informa y pregunta → Task 2, texto del Step 3; lectura en la revisión. ✓
- `feature-flow` ADDED, ninguna skill nombra las dos de superpowers → Tasks 2 y 3, `ForkSkills.Tests.ps1`. ✓
- `feature-flow` ADDED, dos revisores con `sdd-parallel-agents`, modelo y effort → Task 3, `a1`. ✓
- `feature-flow` ADDED, tope y tandas; tasks del plan no van en paralelo → Task 3, texto; Review Focus. ✓
- Anexo, fila por fila → Tasks 2 y 3, Step 2. ✓
- Scope: documentos, avisos, topes y roadmap → Task 4. ✓
- Review Focus → Tasks 1, 2 y 3, lectura en la revisión. ✓
