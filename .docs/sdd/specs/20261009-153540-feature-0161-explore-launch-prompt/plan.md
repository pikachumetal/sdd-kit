---
id: 20261009-153540-feature-0161-explore-launch-prompt
feature: 0161
title: Plan de implementación — explore, el paso por el roadmap y el prompt de arranque
spec: ./spec.md
status: approved
created: 2026-10-10
---

# Plan de implementación — explore, el paso por el roadmap y el prompt de arranque

## Decisiones que he tomado yo — valida estas

1. **Cinco tasks: una de RED, una que renombra sin cambiar reglas y tres de reglas nuevas.** La Task 1 monta las baterías y lanza todos los RED con el kit del commit de apertura, de una vez: si un baseline sale limpio, paro una sola vez a pedir otra aprobación (decisión 19 de la spec). La Task 2 renombra y traduce `sdd-consult` a `sdd-explore` y lo mide con controles; las Tasks 3 a 5 añaden cada regla tras su RED.
2. **Renombrar antes de cambiar** (como la 0160): si la Task 2 tradujera y cambiara la salida a la vez, un control en rojo no diría qué falló.
3. **Ejecución Native**: tasks de texto y evidencia, en serie, que tocan los mismos `SKILL.md`. Revisor final de rama con `sdd-kit:effort-high` + `opus`.
4. **Sujetos**: Sonnet. RED con el kit del commit de apertura (`git archive`); GREEN con el kit de la rama.
5. **Moldes**: `sdd-explore` y `sdd-roadmap` usan el molde `salas` de `tests/batteries/using-sdd/mold-salas`, copiado a cada batería (`tech-stack.md`: un molde que reutilizan dos tasks se copia). El `subject.sh` de `sdd-roadmap` le añade la fila 0013 «Aviso semanal a los responsables» con `proposal: 0010` y la propuesta 0010; los dos ponen en el marcador `control.profile: delegate` y `merge.push: true`. `a5` usa `mold-reservas` de `sdd-propose`.
6. **Gate de cierre de este repo** (§3): sin `operations.md` ni §Testing en `tech-stack.md`, sería `no declarado`. Uso las tareas de moon que nombra `tech-stack.md`, «Contenido y build», como la 0160: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
7. **Topes intermedios**: la Task 2 pone a `sdd-explore` el tope medido, redondeado a la centena de arriba; la Task 4 sube el de `sdd-roadmap` al medido; la Task 5 fija los finales (decisión 15 de la spec).
8. **Coste estimado**: ~7 h de reloj y ~32 $ de sujetos (techo 39 $), más la revisión final.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: renombrar `sdd-consult` a `sdd-explore`, mandar el trabajo que sale de explore al roadmap (config, con su prompt directo), crear la plantilla del prompt de arranque y enseñar a `sdd-roadmap` a dimensionar cada fila y a dar el prompt, con cada regla nueva tras su RED.

**Architecture**: `sdd-explore` (inglés) piensa sin artefactos y, al acabar en trabajo, invoca `sdd-roadmap` o da el prompt de un config. `sdd-roadmap` escribe filas dimensionadas y cierra con el prompt de la primera; «dame el prompt de la <id>» lo da sin escribir. La forma del prompt vive solo en `launch-prompt-template.md`. La prueba son dos baterías nuevas de humo, un escenario nuevo en `sdd-propose`, `sdd-rubber-duck` y `using-sdd`, y la batería de `using-sdd` entera.

**Tech Stack**: Markdown (skills y plantillas), Bash y Node (lanzador `tests/headless/`), Pester (anatomía, nombres y topes).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en serie sobre los mismos ficheros y son texto y evidencia; `execution: auto`, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Las skills se escriben en inglés y hablan con el usuario en su idioma; nombres de skill y de fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Nombre de la skill: `sdd-explore`. Plantilla: `skills/sdd-templates/templates/launch-prompt-template.md`. Carriles, literales: `config`, `patch`, `lite`, `feature`, `spike`.
- Frase del cierre, literal: «si prefieres hacerlo en esta sesión, di "arráncalo"».
- Prompt de arranque: título `**<id> — <nombre>**` (sin id: `**<nombre>**`); `Base: \`develop\`` (`main` para un hotfix); la rama `<tipo>/<id>-<slug>` (sin id: `<tipo>/<slug>`) sola en un bloque `text`; `Carril: <carril>`; el prompt en otro bloque `text`, que arranca con `sdd-propose` y lleva enunciado, requisitos, «Decisiones ya tomadas:», «Salda …» o «Nada que saldar.», «Perfil <perfil>.» y «Al fusionar, …».
- Ítem de un patch pendiente en el roadmap: empieza por «Patch:».
- Cada regla de una skill cita solo la ruta de su evidencia (`tests/…`), sin recuentos; los recuentos van a «Procedencia de las reglas» de la batería.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: sujetos Sonnet; revisor final `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, RED apartado fuera del repo, commit, `sdd task done`.
- Una regla cuyo RED sale limpio no se escribe: sale con su THEN y se pide otra aprobación (Art. I). Antes de recortar por un baseline limpio, mira de dónde sacó el sujeto la conducta (`tech-stack.md`, matices de campaña).
- Techo de sujetos: 39 $ (`COST_CAP` de `run.sh`); si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una conversación de explore que acaba en algo grande («informes: ocupación, Excel y aviso semanal») → explore no lo parte él: lo pasa a `sdd-roadmap`, que propone la partición · Task 3, paso 5 de `sdd-explore`; lectura en la revisión.
- «Dame el prompt de la 0013» en un proyecto sin `merge.*` en `sdd-kit.json` → «Al fusionar» dice la política que decide el usuario, sin inventar `--push` · Task 4, regla de la plantilla; lectura en la revisión.
- Una conversación de explore que acaba en un spike («quiero la tabla de medidas») → pasa por `sdd-roadmap` como fila con carril spike, no da un prompt sin fila · Task 3, paso 5 de `sdd-explore`; lectura en la revisión. (Sustituye a la línea del dimensionado, que salió por el RED: enmienda del 2026-10-10.)
- «Arráncalo» tras un prompt de config en la rama `develop` → `sdd-propose` lo clasifica config y aplica su regla de rama, sin saltarse el gate · Task 3, frase del paso 5; lectura en la revisión.
- Un prompt de arranque que trae un carril más ligero que el que ve `sdd-propose` → pregunta con el pesado recomendado, como cualquier petición (0160) · Task 5, la frase de decisiones no toca la regla del carril; lectura en la revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin clave de configuración; la plantilla es la única fuente de la forma; el dimensionado reutiliza el umbral de `sdd-propose`.
- [x] **YAGNI gate**: sin verbo nuevo de la CLI; sin sincronización con gestores (propuesta aparte).
- [x] **Brownfield gate**: los Pester que nombran `sdd-consult` se adaptan en la task que renombra.
- [x] **Constitution check**: Art. I (RED antes, humo de skills tocadas, tabla de reglas movidas, previsión, topes), Art. III (inglés), Art. VIII (plantilla en `sdd-templates`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-explore/SKILL.md` — por `git mv` de `skills/sdd-consult/SKILL.md` (Task 2) y su salida nueva (Task 3).
- `skills/sdd-templates/templates/launch-prompt-template.md` — la forma del prompt (Task 3).
- `tests/batteries/sdd-explore/` (`battery.md`, `subject.sh`, `mold-salas/`) y `tests/batteries/sdd-roadmap/` (ídem) — Task 1.
- `tests/LaunchPrompt.Tests.ps1` — forma de la plantilla y quién la nombra (Task 3).
- `tests/sdd-explore-0161-red.md`, `tests/sdd-explore-0161-green.md` — evidencia de la feature.
- `.docs/sdd/specs/20261009-153540-feature-0161-explore-launch-prompt/red/out/`, `green/out/` — salidas versionadas.

**Modificar**:

- `skills/sdd-roadmap/SKILL.md` (Task 4), `skills/sdd-propose/SKILL.md` (Tasks 2 y 5), `skills/using-sdd/SKILL.md` (Tasks 2 y 4), `skills/sdd-grilling/SKILL.md`, `skills/sdd-templates/SKILL.md`, `skills/sdd-start-feature/references/overrides-superpowers.md` (Task 2).
- `tests/batteries/sdd-propose/battery.md` y `subject.sh` (a5), `tests/batteries/sdd-rubber-duck/battery.md` (c1, c2), `tests/batteries/using-sdd/battery.md` (c1, r6), `tests/batteries/sdd-grilling/battery.md` (g1, g9, k1).
- `tests/CapabilityRules.Tests.ps1`, `PlanEntry.Tests.ps1`, `SingleEntry.Tests.ps1`, `Skills.Tests.ps1`, `TaskIds.Tests.ps1`, `UsingSdd.Tests.ps1`, `WordBudget.Tests.ps1`.
- `README.md`, `CLAUDE.md` (regla 4), `.claude-plugin/plugin.json` (`description`), `.docs/sdd/mission.md`, `.docs/sdd/architecture.md`.

**NO se tocan**:

- `.docs/workflow/` (0152); `tests/sdd-consult-*.md` (evidencia de eventos pasados); las migraciones (0157).
- Los requisitos de `.docs/sdd/capabilities/`: el delta se fusiona en el cierre.
- `sdd-start-feature` y `sdd-start-patch`: la frase de las decisiones va en `sdd-propose`.

### 1.6 Dependencias

- `tests/headless/` (`battery.sh`, `battery.mjs`, `lib.sh`, `run.sh`) y superpowers 6.4.2 en `SUPERPOWERS_DIR`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un baseline sale limpio (a5 es el más probable) | media | la regla sale y hay que volver a aprobar | todos los RED en la Task 1, una sola parada |
| La traducción cambia una regla sin querer | media | un control en rojo en la Task 2 | renombrar sin cambiar (decisión 2); el control dice qué regla |
| La `description` de explore roba frases de `sdd-rubber-duck` o de `sdd-roadmap` | media | rojos en la batería de `using-sdd` o en c2 | batería entera en la Task 5; se ajusta la `description` que solape |
| `sdd-roadmap` en `claude -p` para en «propón y espera» antes del cierre | alta | `m2` no llega al prompt | la petición de `m2` delega («decide tú»), que el paso 3 trata como decisión delegada |

### 1.8 Rollout

Directo: entra en la release 3.0.0. El renombrado lo cuenta la entrada del changelog para la migración de la 0157.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Baterías de `sdd-explore` y `sdd-roadmap`, a5, y RED de las reglas nuevas

**Tras**: —
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: la propia campaña con el kit del commit de apertura (`git archive <apertura> skills .claude-plugin hooks cli agents`): la rúbrica de cada escenario debe fallar. En el RED, `subject.sh` pasa `using-sdd` a la guarda de `subject_init` (las skills esperadas no existen o no tienen la regla).
**Superficies**: tooling (baterías y moldes), docs (evidencia).
**Verificación**: `bash -n` de cada `subject.sh` nuevo o tocado; `node tests/headless/battery.mjs plan tests/batteries/<skill>/battery.md` para `sdd-explore`, `sdd-roadmap` y `sdd-propose` (sale 0 y lista los escenarios); `pwsh -NoProfile -Command "Invoke-Pester tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1,tests/Battery.Tests.ps1 -CI"`.

**Interfaces**:
- Consume: `subject_init`, `put`, `commit`, `put_kit_marker`, `subject_launch`, `subject_save`, `subject_keep` y `TURN2` de `tests/headless/lib.sh`; el formato de tabla de `battery.mjs`; `tests/batteries/using-sdd/subject.sh` como modelo de montaje; `tests/batteries/sdd-propose/mold-reservas/`.
- Produce: los ids y la rúbrica de abajo, que las Tasks 2 a 5 usan sin cambiarla.

**Ficheros**: crear `tests/batteries/sdd-explore/`, `tests/batteries/sdd-roadmap/`, `tests/sdd-explore-0161-red.md`, `red/out/`; modificar `tests/batteries/sdd-propose/battery.md` y `subject.sh`.

- [ ] **Step 1: Baterías.** Escenarios (Modelo sonnet, Umbral n/n):

  | Batería | Id | Paso | Petición | Molde | Esperado | n |
  | --- | --- | --- | --- | --- | --- | --- |
  | sdd-explore | e1 | control | ¿Dónde se cancelan las reservas? | salas | `sdd-kit:sdd-explore` | 2 |
  | sdd-explore | e2 | config | ¿Podemos subir node a 22.18 en los engines de package.json? Si se puede, lo quiero. | salas | `sdd-kit:sdd-explore` | 2 |
  | sdd-explore | e3 | roadmap | ¿Se podría filtrar libres por planta? Si se puede, lo quiero. | salas | `sdd-kit:sdd-explore` | 2 |
  | sdd-roadmap | m1 | prompt | dame el prompt de la 0013 | salas-0013 | `sdd-kit:sdd-roadmap` | 2 |
  | sdd-roadmap | m2 | size | El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Decide tú los detalles. | salas | `sdd-kit:sdd-roadmap` | 2 |
  | sdd-propose | a5 | decisions | Arranca este cambio con sdd-propose: filtrar libres por planta. Decisiones ya tomadas: la opción se llama --planta; sin --planta, lista todas las salas. Perfil delegate. Escribe la spec y preséntamela. | reservas | `sdd-kit:sdd-propose` | 2 |

  Marcador de los moldes `salas`: el de `using-sdd` más `"control": {"profile": "delegate"}` y `"merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}`; `package.json` con `"engines": {"node": ">=22"}`. `salas-0013`: además, fila `| 0013 | Aviso semanal a los responsables — \`proposal: 0010\` | ⏳ |` en «Próximo» y `.docs/sdd/specs/20261001-090000-proposal-0010-reports/proposal.md` con una regla «el aviso sale los lunes a las 8:00 con las reservas de la semana» y su reparto. MAX_TURNS 30.

  Rúbrica (falla si…), cada fila con su escenario:
  - E1 (e1): crea rama, carpeta o fila; lanza una entrevista; o no dice dónde se cancela.
  - E2 (e2): no termina con el prompt en la forma de las Restricciones (título sin id ni «—», `Base: develop`, rama `feature/<slug>` sola en su bloque, `Carril: config`, segundo bloque que arranca con `sdd-propose` y lleva «Nada que saldar», «Perfil delegate» y «Al fusionar, `sdd merge --push`»); o escribe fila, reserva id o toca `package.json`; o falta la frase «arráncalo».
  - E3 (e3): tras responder no invoca `sdd-roadmap` (en `tools.txt`), o invoca `sdd-propose`, crea rama o carpeta, o da un prompt sin fila.
  - M1 (m1): el prompt no tiene la forma (título «0013 — Aviso semanal a los responsables», `Base: develop`, rama `feature/0013-<slug>` sola, carril, prompt que arranca la 0013 con `sdd-propose`, nombra la propuesta 0010, «Perfil delegate», «Al fusionar, `sdd merge --push`»); o escribe, reserva, publica o commitea.
  - M2 (m2): alguna fila propuesta no dice sus tasks previstas, o alguna pasa el umbral (más de 5, o 4-5 en superficies distintas); o el mensaje final no da el prompt de la primera fila con la frase «arráncalo».
  - A5 (a5): pregunta el nombre de la opción o qué pasa sin ella, o la spec lleva esas decisiones en «✋ Decisiones que he tomado yo» y no en «Decisiones tomadas con el dev-lead».
- [ ] **Step 2: RED.** `PHASE=red KIT_DIR=<archive de la apertura> SUBJECT_CAP=12 COST_CAP=39 tests/headless/run.sh` por batería y `STEPS`, guardando en `red/out/`. Puntúa con la rúbrica y escribe `tests/sdd-explore-0161-red.md`: por escenario, la cita literal del fallo o «limpio». Si alguno sale limpio, repite su baseline una vez (`tech-stack.md`: un RED limpio con n=2 puede ser suerte) y, si sigue limpio, para y pide otra aprobación con la regla y su THEN fuera.
- [ ] **Step 3: Verificación** (comandos de arriba).
- [ ] **Step 4: Commit de la task** — `test(batteries): baterías de sdd-explore y sdd-roadmap y RED de la 0161`.

### Task 2 — `sdd-consult` pasa a `sdd-explore`, traducida, sin reglas nuevas

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: los Pester renombrados fallan antes del `git mv` (`Skills.Tests.ps1` pide `argument-hint` a `sdd-explore`).
**Superficies**: docs (skills, README, mission, architecture), tooling (Pester, baterías).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/CapabilityRules.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/SingleEntry.Tests.ps1,tests/Skills.Tests.ps1,tests/TaskIds.Tests.ps1,tests/UsingSdd.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; `git grep -n "sdd-consult" -- skills README.md .claude-plugin .docs/sdd/mission.md .docs/sdd/architecture.md tests/*.ps1 tests/batteries` sin salida salvo la procedencia histórica de las baterías; GREEN de control e1, g1, g9, k1 y c1.

**Interfaces**:
- Consume: los ids `e1`, `g1`, `g9`, `k1`, `c1` y la rúbrica de la Task 1.
- Produce: `skills/sdd-explore/SKILL.md` con los pasos 1-5, sus red flags y su tabla, numerados como en `sdd-consult`; el nombre `sdd-kit:sdd-explore` en `using-sdd`.

**Ficheros**: `git mv skills/sdd-consult skills/sdd-explore`; modificar los listados en «Modificar» de §1.1 salvo `sdd-roadmap` y `launch-prompt-template.md`.

- [ ] **Step 1: Renombrado y traducción.** `name: sdd-explore`; `description` en inglés: «Use when the user asks about their project with .docs/sdd/ loaded — how something works, why, whether something can be done, where a change would go, how to approach it («¿cómo funciona…?», «¿se puede…?», «no lo pillo», «¿cómo enfocarías…?», «¿qué hacemos ahora?») — without starting work. Not for a change of any size (sdd-propose), planning without doing (sdd-roadmap) or investigating a failure (superpowers:systematic-debugging).» Cuerpo: traducción fiel de cada fila de «Reglas que se mueven» de la spec, con la frase «write everything the user reads in their language, skill announcements included». El paso 5 conserva hoy su traspaso a `sdd-propose`: la salida nueva es de la Task 3.
- [ ] **Step 2: Referencias.** Cada fichero de «Modificar» que nombra `sdd-consult` pasa a `sdd-explore`; `mission.md`: «Carril consult» → «**Explore**» (sustituye la línea; sin «Prompt de arranque» todavía, que entra en la Task 3); `WordBudget.Tests.ps1`: `'sdd-explore' = @{ SkillMd = <medido, centena de arriba>; Total = <ídem> }` en lugar de `sdd-consult`. Las baterías cambian «Esperado» y «Paso» de `sdd-consult` a `sdd-explore`; la procedencia histórica no se toca.
- [ ] **Step 3: Verificación** (comandos de arriba) y GREEN de control con `PHASE=green` y el kit de la rama; evidencia en `tests/sdd-explore-0161-green.md`.
- [ ] **Step 4: Commit de la task** — `refactor(skills): sdd-consult pasa a sdd-explore, en inglés y sin reglas nuevas`.

### Task 3 — Plantilla del prompt de arranque y salida de explore

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `tests/LaunchPrompt.Tests.ps1` falla antes de crear la plantilla; e2 y e3 de la Task 1.
**Superficies**: docs (plantilla, skills, `CLAUDE.md`, mission), tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/LaunchPrompt.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN de e2 y e3; control e1.

**Interfaces**:
- Consume: `skills/sdd-explore/SKILL.md` de la Task 2.
- Produce: `skills/sdd-templates/templates/launch-prompt-template.md`, que enlaza la Task 4 con la ruta relativa `../sdd-templates/templates/launch-prompt-template.md`.

**Ficheros**: crear la plantilla y `tests/LaunchPrompt.Tests.ps1`; modificar `skills/sdd-explore/SKILL.md`, `skills/sdd-templates/SKILL.md`, `CLAUDE.md`, `.docs/sdd/mission.md`.

- [ ] **Step 1: Test.** `LaunchPrompt.Tests.ps1`: la plantilla existe; contiene `Base:`, `Carril:`, `Decisiones ya tomadas:`, `Nada que saldar`, `Perfil`, `Al fusionar` y dos bloques ```` ```text ````; `skills/sdd-explore/SKILL.md` y `skills/sdd-roadmap/SKILL.md` nombran `launch-prompt-template.md` (el de roadmap queda `-Skip` hasta la Task 4).
- [ ] **Step 2: Plantilla.** Forma de la decisión 6 de la spec, con el ejemplo relleno de la 0144 («0144 — Documentos y migración», `feature/0144-docs-and-migration`, carril feature) y las cuatro reglas de redacción de la decisión 7. Fila en el índice de `sdd-templates`: destino «en el chat, no se guarda»; la escriben `sdd-explore` (config) y `sdd-roadmap`.
- [ ] **Step 3: Salida de explore.** Paso 5 de `sdd-explore`: con el trabajo dimensionado, feature, patch o spike → invoca `sdd-roadmap` con qué, por qué, decisiones con su literal y carril visto, sin escribir fila ni reservar; config → el prompt de la plantilla, sin id, y la frase «arráncalo»; con «arráncalo», `sdd-propose`; un fallo a investigar → `superpowers:systematic-debugging`. Red flag nueva solo si el RED de e3 la muestra (p. ej. «You're about to invoke sdd-propose for work that has no roadmap row»). `CLAUDE.md` regla 4 → «**Prompts para lanzar trabajo**: los da el kit con la forma de `skills/sdd-templates/templates/launch-prompt-template.md`.». `mission.md`: nace «**Prompt de arranque**» en una línea, adelgazando otra para no pasar 1.700.
- [ ] **Step 4: Verificación** (comandos de arriba); evidencia en `tests/sdd-explore-0161-green.md`.
- [ ] **Step 5: Commit de la task** — `feat(skills): explore pasa el trabajo al roadmap y da el prompt de un config`.

### Task 4 — `sdd-roadmap`: dimensionar filas, patch como fila, prompt en el cierre y «dame el prompt»

**Tras**: Task 3
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: m1 y m2 de la Task 1; el caso `-Skip` de `LaunchPrompt.Tests.ps1` se activa.
**Superficies**: docs (skills), tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/LaunchPrompt.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/UsingSdd.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN de m1 y m2.

**Interfaces**:
- Consume: la plantilla de la Task 3.
- Produce: la entrada «Dar el prompt de una fila» y la frase «dame el prompt de la <id>» en la `description` de `sdd-roadmap` y en la fila de planificar de `using-sdd`, que mide la Task 5 (`r6`).

**Ficheros**: modificar `skills/sdd-roadmap/SKILL.md`, `skills/using-sdd/SKILL.md`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Reglas.** «Qué entrada es»: nueva primera entrada, «**Dar el prompt de una fila** — «dame el prompt de la <id>»: lee la fila, su propuesta con sus enmiendas y `sdd-kit.json` y da el prompt de la plantilla; no escribe, no reserva, no publica ni commitea; fila cerrada o en marcha → lo dice». Paso 2 o sección «Algo grande»/«Algo concreto»: cada fila que escribes prevé sus tasks con el umbral de `sdd-propose` y la que lo pasa se parte antes de escribirla; la propuesta de filas dice «<id> — prevé N tasks». «Algo concreto»: un patch pendiente es fila de «Próximo» con «Patch:» al inicio. Paso 7: da el prompt de la fila que va primero y termina con la frase «arráncalo»; con «arráncalo», `sdd-propose` con esa fila. `description`: suma «"dame el prompt de la <id>"». `using-sdd`, fila de planificar: suma «dame el prompt de la <id>». Tope de `sdd-roadmap`: el medido, a la centena de arriba.
- [ ] **Step 2: Verificación** (comandos de arriba); evidencia.
- [ ] **Step 3: Commit de la task** — `feat(skills): sdd-roadmap dimensiona cada fila y da el prompt de arranque`.

### Task 5 — Decisiones del prompt en `sdd-propose`, c2 y batería de `using-sdd`

**Tras**: Task 4
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: a5 de la Task 1; c2 y r6 son controles (solo GREEN).
**Superficies**: docs (skills), tooling (baterías, Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1,tests/UsingSdd.Tests.ps1 -CI"`; GREEN de a5, c1, c2 y la batería entera de `using-sdd` con r6.

**Interfaces**:
- Consume: la `description` de `sdd-roadmap` y `using-sdd` de la Task 4.
- Produce: los topes finales.

**Ficheros**: modificar `skills/sdd-propose/SKILL.md`, `tests/batteries/sdd-rubber-duck/battery.md`, `tests/batteries/using-sdd/battery.md`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Regla** (solo si a5 salió rojo). Junto a «Lane in the request» del paso 2: «**Decisions in the request.** A launch prompt or a request that lists decisions already taken brings the dev-lead's decisions: record them in «Decisiones tomadas con el dev-lead» with their literal and don't ask them again. If your investigation contradicts one, ask it with what you found (`tests/sdd-explore-0161-red.md`, a5).»
- [ ] **Step 2: Escenarios.** `sdd-rubber-duck`: `c2 | control | ¿Cómo funciona la exportación? | exportes | \`sdd-kit:sdd-explore\` | 1 | 1/1 | sonnet | fila de deuda de la 0145, c2 (feature 0161)` y fila C3 de la rúbrica «la primera skill invocada no es `sdd-kit:sdd-explore`»; c1 y C2 pasan a `sdd-explore`. `using-sdd`: `r6 | sdd-roadmap | dame el prompt de la 0013 | salas | \`sdd-kit:sdd-roadmap\` | 2 | 2/2 | sonnet | feature 0161`. Si c2 o la batería sale roja por solape, ajusta la `description` que solape y relanza solo ese tramo.
- [ ] **Step 3: Topes finales**: `sdd-explore`, `sdd-roadmap` y, si lo pasa, `sdd-propose`, al medido redondeado a la centena de arriba.
- [ ] **Step 4: Verificación** (comandos de arriba); evidencia y «Procedencia de las reglas» de cada batería tocada.
- [ ] **Step 5: Commit de la task** — `feat(skills): propose respeta las decisiones del prompt de arranque; c2 y batería de using-sdd`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 3h (dos rondas de spec con entrevista)
- Estimación de implementación: 7h
- Base de la estimación: 5 tasks de texto y evidencia; 10 sujetos de RED y 49 de GREEN; la 0160 (5 tasks, 78 sujetos) tardó ~7,5 h
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (de `tech-stack.md`, «Contenido y build»; sin §Testing en este repo: decisión 6)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `routing` · «Una pregunta entra por explore», «El router solo existe donde hay SDD» → Task 2 (`e1`, `UsingSdd.Tests.ps1`). ✓
- `routing` · «Una petición de explicar en llano…» → Task 5 (`c1`, `c2`). ✓
- `routing` · «Una investigación con evidencia entra por el carril spike» → Task 2 (texto de `sdd-propose`); batería de `using-sdd` en la Task 5. ✓
- `routing` · «El trabajo que sale de explore pasa por el roadmap» → Task 3 (`e3`). ✓
- `routing` · «Un config que sale de explore da su prompt directo» → Task 3 (`e2`). ✓
- `routing` · «Las decisiones que trae la petición no se vuelven a preguntar» → Task 5 (`a5`). ✓
- `planning` · «Cada fila que escribe el roadmap es del tamaño de una feature», «El cierre del roadmap da el prompt…» → Task 4 (`m2`). ✓
- `planning` · «Un patch pendiente es una fila de "Próximo"» → Task 4, sin escenario (motivo en la decisión 19 de la spec). ✓
- `planning` · «"Dame el prompt de la <id>"…» → Task 4 (`m1`), Task 5 (`r6`). ✓
- `capabilities`, `feature-ids`, `interviewing` (solo el nombre) → Task 2 (`CapabilityRules`, `TaskIds`, `g1`). ✓
- Decisión 16 (regla 4 de `CLAUDE.md`) → Task 3. ✓ · decisión 17 (referencias) → Task 2. ✓ · decisión 18 (Pester de forma) → Task 3. ✓
- Review Focus → Tasks 3, 4 y 5, lectura en la revisión final. ✓

### Task 6 — enmienda 2026-10-10: la fila «Patch:» se cierra y el config se fusiona

**Tras**: Task 5
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `k5` (batería de `sdd-propose`) y `x1` (batería nueva de humo de `sdd-end-patch`), con el kit de la pasada de fix (`afb312aa`).
**Superficies**: docs (skills), tooling (baterías).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/PatchLane.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN de `k5` y `x1`; tramo `sdd-propose` de `using-sdd` (las `description` de `sdd-start-feature` y `sdd-start-patch` cambiaron en la pasada de fix).

**Interfaces**:
- Consume: la fila «Patch:» de la Task 4; el prompt de config de la Task 3.
- Produce: nada que usen otras tasks.

**Ficheros**: modificar `skills/sdd-end-patch/SKILL.md` (paso 4) y `skills/sdd-propose/SKILL.md` («Config lane»); crear `tests/batteries/sdd-end-patch/`; modificar `tests/batteries/sdd-propose/` (k5).

- [ ] **Step 1: RED.** `k5`: molde `reservas` en la rama `feature/bump-node-22-18` desde `develop`, `merge` sin push, petición «Arranca este cambio con sdd-propose, carril config: sube el mínimo de node a 22.18 en los engines de package.json.», `TURN2` «Sí.». Falla si no fusiona en `develop`. `x1`: molde `salas` con la fila 0008 «Patch:» en «Próximo», la rama `feature/0008-cancel-missing` con el fix y su `patch.md`, `validation.mode: field`, petición «Cierra el patch 0008.». Falla si la fila 0008 no queda ✅.
- [ ] **Step 2: Reglas.** `sdd-end-patch` paso 4: «si "Próximo" tiene la fila del patch ("Patch:" con su id), márcala ✅, o 🧪 con la validación diferida». «Config lane» paso 4: en una rama que no es la de integración ni la estable, tras el commit, `sdd merge --project-root <worktree>` con `--push` si `merge.push`; sin bloque `merge`, pregunta.
- [ ] **Step 3: Verificación** y evidencia en `tests/sdd-explore-0161-green.md`.
- [ ] **Step 4: Commit de la task** — `Task 6 — enmienda 2026-10-10: …`.
