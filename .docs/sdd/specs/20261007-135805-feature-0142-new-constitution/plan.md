---
id: 20261007-135805-feature-0142-new-constitution
feature: 0142
title: Plan de implementación — Constitution nueva del kit para la 3.0.0, con ADR
spec: ./spec.md
status: approved
created: 2026-10-07
---

# Plan de implementación — Constitution nueva del kit para la 3.0.0, con ADR

## Decisiones que he tomado yo — valida estas

1. **Modelo**: la sesión ejecuta las tres tasks (Native). Revisor final: `subagent_type: sdd-kit:effort-high` + `model: opus`, el techo por defecto de Art. IV.
2. **Ejecución Native**: tres tasks de texto muy acopladas (los enlaces de la constitution apuntan a las ADR de la Task 1 y la Task 3 cita la constitution de la Task 2); un subagente por task pagaría tres contextos para releer lo mismo.
3. **El test de `CLAUDE.md` que busca la regla por su número** (`ControlProfiles.Tests.ps1`, `^6\. `) pasa a buscarla por su texto (`Cuando el dev-lead delega`): al quitar cuatro reglas, la de delegate deja de ser la 6. Las aserciones sobre su contenido no cambian.
4. **Sin tests RED nuevos**: la spec decide no escribir test de las ADR (decisión 11). Cada task verifica con la suite Pester que ya fija los literales y con una comprobación de forma en la línea de comandos que no se versiona.
5. **Coste**: ~3 h de sesión y un revisor final (~130k tokens, ~3 $).
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: sustituir la constitution del kit por una corta (preámbulo de cinco principios, un artículo = regla + porqué) con su historia en diez ADR, y dejar `CLAUDE.md` enlazándola.

**Architecture**: documentos en Markdown. Las ADR se escriben primero porque la constitution enlaza cada una; después la constitution y los documentos que fijan su forma (topes y método de baterías); al final `CLAUDE.md` y `architecture.md`, que la describen.

**Tech Stack**: Markdown; Pester 5 para la suite existente (`tests/*.Tests.ps1`, pre-commit en `.githooks/pre-commit`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks son texto que se cita entre sí y caben en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de fichero en inglés kebab-case (Art. III).
- ADR: `.docs/sdd/decisions/NNNN-<slug-en-inglés>.md`, secuencia propia desde `0001`; frontmatter `status` (`proposed | accepted | rejected | deprecated | superseded by NNNN`), `date` (`YYYY-MM-DD`, la de la última decisión que la formó) y `rutas` (lista de globs del repo); secciones, en este orden: `## Contexto y problema`, `## Opciones consideradas`, `## Decisión`, `### Consecuencias`, `### Confirmación`. Inmutables: solo cambia `status` al sustituirlas.
- Constitution: numeración I a XI intacta; cada artículo, la regla y una sola línea `*Por qué*: <una frase>` con el enlace a su ADR si la tiene (VI y VII sin ADR).
- Se conservan literales que fijan los tests: `hereda el de la sesión`; `que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json``; `va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto`; `La sesión que ejecuta en Native es el implementador`; `Bajar solo el effort de Opus no es gama media`; `el cierre de feature y el de patch`; `commit-milestones.md` dentro de Art. IV; `sequence` y `tracker`; en Art. X `una unidad` y `Minor` en la misma línea. Y no aparecen: `defecto de ese modelo`, `el merge es SIEMPRE decisión del usuario`, `con la ejecución en línea como excepción que el plan declara por task`.
- Art. X (código ejecutable del kit): sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Un umbral superado en una unidad es Minor; el resto, Important.
- Topes: `architecture.md` ≤ 1.900 y `tech-stack.md` ≤ 18.700 palabras sin subir el tope; el de `constitution.md` baja al medido redondeado a la centena superior.

### De proceso

- Modelos: el revisor final va con `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh` prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only; terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una regla normativa de la constitution vieja que no aparece ni en la nueva, ni en `tech-stack.md`, ni como retirada en la tabla del Approach → se pierde una regla que aplican las skills · Task 2, comparación artículo a artículo en el Step 2 (smoke).
- Un enlace `decisions/NNNN-…md` de la constitution con el slug mal escrito → enlace roto · Task 2, comprobación de enlaces del Step 3.
- `CLAUDE.md` deja una regla que contradice la constitution nueva (el Art. I viejo en la regla 1, la compatibilidad con superpowers) → la sesión sigue la vieja · Task 3, `grep` del Step 2.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres tasks de texto; sin código nuevo.
- [x] **YAGNI gate**: sin test nuevo ni plantilla de ADR (llegan con la 0143 y la 0144).
- [x] **Constitution check**: Art. I no aplica (ninguna skill cambia); Art. III, VI, VII y XI se respetan.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/decisions/0001-bounded-documents-and-adr.md` … `0010-executable-code-quality.md` — la historia de cada regla.

**Modificar**:

- `.docs/sdd/constitution.md` — reescrita.
- `tests/WordBudget.Tests.ps1` — baja el tope de `constitution.md`.
- `.docs/sdd/tech-stack.md` — §Baterías gana los cuatro matices de campaña, condensando texto del mismo documento.
- `tests/ControlProfiles.Tests.ps1` — la regla de delegate se busca por su texto.
- `CLAUDE.md` — enlaza la constitution; índice con `decisions/`.
- `.docs/sdd/architecture.md` — árbol y fila de `decisions/`; sale el párrafo del estado del arte de superpowers 6.3.0.

**NO se tocan**:

- `skills/**` — ninguna skill cambia (Art. I).
- `THIRD_PARTY_NOTICES.md`, `.docs/sdd/mission.md` — fuera del Scope.

### 1.6 Dependencias

Propuesta 0131 (`specs/20261007-144256-proposal-0131-kit-rework/proposal.md`), secciones Principios, Documentos y Pruebas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Perder una regla al compactar | media | alto | tabla regla → destino del Approach recorrida en el Step 2 de la Task 2 |
| `architecture.md` sin sitio bajo el tope | alta | bajo | sale el párrafo de superpowers 6.3.0 (~170 palabras) |

### 1.8 Rollout

Directo: merge a `develop`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Diez ADR iniciales

**Modelo**: la sesión (Native).
**Tests RED**: ninguno (decisión 11 de la spec); comprobación de forma en el Step 2.
**Superficies**: docs
**Verificación**: el comando del Step 2.

**Interfaces**:
- Consume: la constitution vigente (`.docs/sdd/constitution.md`) como fuente de la historia; la propuesta 0131.
- Produce: estos diez ficheros, que la Task 2 enlaza por su ruta exacta:
  - `0001-bounded-documents-and-adr.md` — Art. XI · rutas `.docs/sdd/**`, `CLAUDE.md`
  - `0002-skill-testing-by-battery.md` — Art. I · rutas `skills/**`, `tests/**`
  - `0003-form-follows-failure.md` — Art. II · rutas `skills/**/SKILL.md`, `skills/**/references/**`
  - `0004-skills-in-english.md` — Art. III · rutas `skills/**`
  - `0005-artifact-and-branch-conventions.md` — Art. IV (naming, ids, merge, historia de commits) · rutas `skills/sdd-start-feature/**`, `skills/sdd-end-feature/**`, `skills/sdd-start-patch/**`, `skills/sdd-end-patch/**`, `skills/sdd-templates/scripts/**`
  - `0006-model-policy-and-execution.md` — Art. IV (método, modelos, effort, nivel de verificación) · rutas `skills/sdd-start-feature/**`, `agents/**`, `skills/sdd-config/**`
  - `0007-versioning-and-migrations.md` — Art. V · rutas `.claude-plugin/plugin.json`, `skills/sdd-init-brownfield/references/migrations/**`, `skills/sdd-init-greenfield/**`
  - `0008-single-template-source.md` — Art. VIII · rutas `skills/sdd-templates/templates/**`
  - `0009-fork-instead-of-dressing-superpowers.md` — Art. IX · rutas `skills/**`, `THIRD_PARTY_NOTICES.md`
  - `0010-executable-code-quality.md` — Art. X · rutas `skills/**/scripts/**`, `tests/**/*.ps1`, `hooks/**`

**Ficheros**: crear los diez anteriores.

- [ ] **Step 1: Escribir las ADR** con la forma de «De código». «Contexto y problema» lleva la historia que hoy está en el artículo (tasks, tickets, fechas, mediciones); «Opciones consideradas», la vigente y las descartadas que la historia nombra; «Decisión», la regla en una frase; «Consecuencias», qué gana y qué cuesta; «Confirmación», el test que la fija (p. ej. `tests/WordBudget.Tests.ps1`) o «revisión final». 0002 y 0009 son decisiones de la 0131 (`date: 2026-10-07`); 0002 recoge las reglas viejas de Art. I que salen (A/B obligatorio, los cuatro matices) y 0009 la regla vieja de Art. IX («adoptar al máximo · aportar · extender ante hueco»). `status: accepted` en todas.
- [ ] **Step 2: Verificación** —
  ```bash
  cd .docs/sdd/decisions && ls | grep -cE '^[0-9]{4}-[a-z0-9-]+\.md$' && for f in *.md; do for k in '^status: (proposed|accepted|rejected|deprecated|superseded by [0-9]{4})$' '^date: [0-9]{4}-[0-9]{2}-[0-9]{2}$' '^rutas:' '^## Contexto y problema' '^## Opciones consideradas' '^## Decisión' '^### Consecuencias' '^### Confirmación'; do grep -qE "$k" "$f" || { echo "FALTA $k en $f"; exit 1; }; done; done && echo ok
  ```
  Esperado: `10` y `ok`.
- [ ] **Step 3: Commit de la task** — `docs(decisions): diez ADR iniciales del kit`.

### Task 2 — Constitution nueva

**Modelo**: la sesión (Native).
**Tests RED**: ninguno nuevo; fijan la forma los nueve tests de literales y `WordBudget.Tests.ps1`.
**Superficies**: docs, tooling (tope)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/AgentDefinitions.Tests.ps1,tests/CommitMilestones.Tests.ps1,tests/ControlProfiles.Tests.ps1,tests/NativeAdapt.Tests.ps1,tests/NativeDefault.Tests.ps1,tests/ProportionalReview.Tests.ps1,tests/SessionModel.Tests.ps1,tests/TaskIds.Tests.ps1,tests/WordBudget.Tests.ps1,tests/NamingConvention.Tests.ps1,tests/FeatureRename.Tests.ps1,tests/SuperpowersCompat.Tests.ps1 -CI -Output Minimal"` y el comando del Step 3.

**Interfaces**:
- Consume: las diez rutas de ADR de la Task 1.
- Produce: `.docs/sdd/constitution.md` con `## Principios` (lista numerada de cinco) y `## Art. I — …` a `## Art. XI — …`, cada uno con una línea `*Por qué*:`.

**Ficheros**: modificar `.docs/sdd/constitution.md`, `tests/WordBudget.Tests.ps1`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Reescribir la constitution**:
  - Preámbulo: los cinco principios literales de la propuesta 0131.
  - Art. I: test que falla antes de la guidance nueva; batería completa en las skills de entrada, propose, verify y archive, humo (1-2 escenarios, n = 1) en todas, las dos antes de cada release; A/B solo ante una duda concreta; cada fallo de campo pasa a escenario; transición (la skill nueva nace con su batería; una edición de una skill de la 2.3.x lleva el tramo de su batería si la tiene y, si no, humo); previsión de coste con techo que para; una pieza entra, otra sale, con los topes de `tests/WordBudget.Tests.ps1`; renombrar, retirar o fusionar una skill es editarla; el método, en `tech-stack.md`.
  - Art. II y III: la regla vigente sin historia.
  - Art. IV: el contenido normativo vigente, sin historia ni mediciones, con los literales de «De código».
  - Art. V: la regla vigente sin historia, con la vigilancia de fuentes de `THIRD_PARTY_NOTICES.md` en lugar de la compatibilidad con superpowers.
  - Art. VI, VII, VIII y X: la regla vigente sin historia.
  - Art. IX: fork de superpowers, OpenSpec, mattpocock/skills, Wondel, MADR y skill-creator con aviso en `THIRD_PARTY_NOTICES.md` (fuente, versión y licencia); la pieza copiada es del kit y se prueba con Art. I; hasta que la 0147 retire superpowers, el kit invoca las skills suyas que aún no ha copiado.
  - Art. XI: estado (se reescribe), evento (no se reescribe, adenda fechada) y ADR en `.docs/sdd/decisions/` para el porqué de una regla (inmutable, se sustituye); changelog y log de estimación fuera de la pareja; la tabla en `architecture.md`.
- [ ] **Step 2: Smoke regla a regla** — recorre la constitution vieja (`git show HEAD~1:.docs/sdd/constitution.md`) frase normativa a frase normativa y comprueba que cada una está en la nueva, en `tech-stack.md`, o en la tabla de retiradas del Approach de la spec. Apunta las que falten y escríbelas.
- [ ] **Step 3: Enlaces y forma** —
  ```bash
  c=.docs/sdd/constitution.md; grep -oE 'decisions/[0-9]{4}-[a-z0-9-]+\.md' $c | sort -u | while read p; do test -f ".docs/sdd/$p" || { echo "ROTO $p"; exit 1; }; done && test "$(grep -c '^\*Por qué\*:' $c)" -eq 11 && test "$(grep -c '^## Art\. ' $c)" -eq 11 && echo ok
  ```
  Esperado: `ok`.
- [ ] **Step 4: Tope** — mide `constitution.md` (`wc -w`) y pon en `WordBudget.Tests.ps1` el medido redondeado a la centena superior.
- [ ] **Step 5: Matices en `tech-stack.md` §Baterías por skill** — cuatro líneas: fuente incidental (mirar de dónde sacó cada sujeto la conducta antes de recortar), el recorte quita la guía y no la medición, la batería cuenta como escenario las conductas vecinas que ya se cumplían, la previsión lista cada paso que el agente ejecuta (`SKILL.md`, `references/`, `migrations/`). Condensa texto del mismo documento hasta quedar ≤ 18.700.
- [ ] **Step 6: Verificación** — los comandos de «Verificación». Esperado: 0 fallos.
- [ ] **Step 7: Commit de la task** — `docs(constitution): constitution corta para la 3.0.0`.

### Task 3 — `CLAUDE.md` y `architecture.md`

**Modelo**: la sesión (Native).
**Tests RED**: el cambio de `ControlProfiles.Tests.ps1` (Step 1), que debe seguir en verde con la regla de delegate renumerada.
**Superficies**: docs, tooling (test)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1,tests/WordBudget.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/NamingConvention.Tests.ps1 -CI -Output Minimal"` y el `grep` del Step 3.

**Interfaces**:
- Consume: la constitution de la Task 2 y las rutas de la Task 1.
- Produce: nada que use otra task.

**Ficheros**: modificar `tests/ControlProfiles.Tests.ps1`, `CLAUDE.md`, `.docs/sdd/architecture.md`.

- [ ] **Step 1: Test** — en `ControlProfiles.Tests.ps1`, `[regex]::Match((Get-KitFile 'CLAUDE.md'), '(?m)^\d+\. \*\*Cuando el dev-lead delega.+$').Value`; el `It` pasa a «la regla de delegate nombra…».
- [ ] **Step 2: `CLAUDE.md`** — índice: la línea de la constitution dice «preámbulo de cinco principios y once artículos, cada uno con su porqué» y una línea nueva para `.docs/sdd/decisions/` (ADR: el porqué de cada regla, inmutables). Reglas críticas: una frase que enlaza la constitution («las reglas del kit son las de la constitution; aquí solo las de la sesión»); salen las reglas 1, 3, 4 y 7 y la frase de Art. VII de la 2; quedan, renumeradas, la 2 (sesión), la 5, la 6 y la 8.
- [ ] **Step 3: Comprobación** — `grep -nE 'RED→GREEN|bump de .version|NO se duplican|compatibilidad con la versión de superpowers' CLAUDE.md` no devuelve nada (`! grep … && echo ok`).
- [ ] **Step 4: `architecture.md`** — árbol: `decisions/` bajo `.docs/sdd/`; tabla: fila `` `decisions/NNNN-<slug>.md` `` · evento (ADR) · la feature que toma la decisión · quien toca sus `rutas` · inmutable, solo cambia `status` al sustituirse; sale el párrafo del estado del arte de superpowers 6.3.0 del punto 6 de la anatomía. ≤ 1.900 palabras.
- [ ] **Step 5: Verificación** — los comandos de «Verificación». Esperado: 0 fallos.
- [ ] **Step 6: Commit de la task** — `docs(claude-md): enlazar la constitution y registrar decisions/`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,75h
- Estimación de implementación: 2–3h
- Base de la estimación: tres tasks de redacción; la mayor, diez ADR desde la historia de la constitution; sin campaña de sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -CI -Output Minimal"`
- [ ] Smoke: una fila por ADR (forma) y por artículo (regla + porqué + enlace).
- [ ] Spec satisfecha (Self-review).
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- Decisiones 1-3, 4-7 (artículos) → Task 2. ✓
- Decisiones 8-9 (ADR) → Task 1. ✓
- Decisión 10 (sin plantilla) → N/A, `skills/**` en «NO se tocan». ✓
- Decisión 11 (sin test nuevo) → comprobaciones de línea de comandos en Task 1 y 2. ✓
- Decisión 12 (topes) → Task 2 Steps 4-5 y Task 3 Step 4. ✓
- Decisión 13 (`CLAUDE.md`) → Task 3. ✓
- Decisión 14 (`THIRD_PARTY_NOTICES.md`) → «NO se tocan». ✓
- Review Focus → Task 2 Steps 2-3, Task 3 Step 3. ✓
