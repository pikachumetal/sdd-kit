---
id: 20261011-130007-feature-0168-fork-brainstorming-writing-plans
feature: 0168
title: Plan de implementación — propose sin superpowers: spec-writing.md y plan-writing.md
spec: ./spec.md
status: approved
created: 2026-10-11
---

# Plan de implementación — propose sin superpowers: `spec-writing.md` y `plan-writing.md`

## Decisiones que he tomado yo — valida estas

1. **Cuatro tasks: RED, mover, reglas de propose, regla de grilling.** Como en la 0147: primero el RED de todas las reglas nuevas con el kit del commit de apertura; después se mueve el texto a las referencias sin cambiar reglas (si el humo sale rojo, falló el fork y no una regla nueva); después las reglas nuevas que el RED confirme.
2. **Ejecución Native**: las tasks van en serie sobre `skills/sdd-propose/` y son texto y evidencia. Revisor final de rama con `sdd-kit:effort-high` + `opus`.
3. **Sujetos**: Sonnet, con `SUPERPOWERS_DIR` en la caché 7.0.0. RED con `git archive` del commit de apertura (kit vigente); GREEN con el kit de la rama. Escenarios nuevos en las baterías: `pb`, `pb-c`, `adr`, `adr-c` y `h1` en la de `sdd-propose`; `sk` y `sk-c` en la de `sdd-grilling`. Los humos de `sdd-roadmap` y `sdd-init-greenfield` son `g4` y `g2` de la batería de `sdd-grilling`, n = 1, y el de `using-sdd`, su escenario de feature.
4. **Molde de `adr`**: el de `reservas` más `.docs/sdd/decisions/0003-bookings-in-memory.md` (`accepted`, `rutas: src/**`, descarta SQLite), y una petición que lleva a guardar en disco con naturalidad («que las reservas sobrevivan a reiniciar el proceso»).
5. **Regla de RED limpio** (Art. I, spec ✋17): una regla cuyo RED sale limpio no se escribe y su GREEN no se lanza; si es una de las que decidiste en la entrevista (secciones, ADR, boceto), paro y te lo enseño antes de quitarla.
6. **Gate de cierre de este repo** (§3): sin `operations.md` ni §Testing con gate en `tech-stack.md`, como la 0147 y la 0160: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
7. **Topes**: la Task 2 pone los medidos de `sdd-propose` y `sdd-grilling` redondeados a la centena de arriba, dentro del techo de la spec (7.500 total, 5.000 `SKILL.md`, 750 `sdd-grilling`), y el del kit entero; las Tasks 3 y 4 los reajustan si crecen.
8. **Coste estimado**: ~4 h de reloj (rango 3–5, condicionado al RED) y ~15 $ de sujetos (techo 18 $: `COST_CAP`), más la revisión final (~3 $).
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd-propose`, `sdd-roadmap`, `sdd-init-greenfield` y `using-sdd` dejen de invocar `superpowers:brainstorming` y `superpowers:writing-plans`, con su texto forkeado en `skills/sdd-propose/references/spec-writing.md` y `plan-writing.md`, y con las tres reglas nuevas de la entrevista: diseño por secciones, ADR y boceto.

**Architecture**: dos referencias nuevas en `skills/sdd-propose/references/` que los pasos 4 y 5 cargan lo primero; `sdd-grilling` gana la regla del boceto. Las plantillas solo cambian sus avisos. La prueba son escenarios nuevos en las baterías de `sdd-propose` y `sdd-grilling` y Pester de forma.

**Tech Stack**: Markdown (skills, referencias, plantillas), Bash y Node (`tests/headless/`), Pester (`SuperpowersCompat`, `PlanEntry`, `PlanReviewFocus`, `NativeDefault`, `WordBudget`, `Skills`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks van encadenadas sobre `skills/sdd-propose/references/`, un error lo caza el humo de su task y la revisión final, y el plan cabe en un contexto; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- `spec-writing.md`, `plan-writing.md` y lo nuevo de `sdd-propose` y `sdd-grilling`, en inglés; hablan con el usuario en su idioma. Nombres de fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Cada referencia abre con «Adapted from superpowers 7.0.0 `<brainstorming | writing-plans>` (MIT, see NOTICE).»; `skills/sdd-propose/NOTICE` con el aviso y la licencia MIT de Jesse Vincent.
- Literales de la spec: umbral «4 o más tasks previstas»; secciones de «unas frases a ~250 palabras»; pregunta tras cada sección «¿va bien?»; `sdd decision index --path .docs/sdd --files <ficheros>`; `sustituye a NNNN`.
- Ninguna skill invoca `superpowers:brainstorming` ni `superpowers:writing-plans`; las dos prohibiciones que se quedan son las de `using-sdd` («prevalece sobre la regla de superpowers de invocar `brainstorming` primero») y `sdd-explore` («NEVER `superpowers:brainstorming`»).
- El comando con ruta (`node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" …`) solo en un `SKILL.md`; las referencias nombran el verbo.
- Cada regla nueva cita solo la ruta de su evidencia (`tests/…`), sin recuentos; los recuentos, en «Procedencia de las reglas» de la batería.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.

### De proceso

- Política de modelos del Art. IV: sujetos Sonnet; revisor final `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, commit, `sdd task done`.
- Una regla cuyo RED sale limpio no se escribe (decisión 5).
- Techo de sujetos: 18 $ (`COST_CAP`); si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; `git add` por ruta.

## Review Focus

- Una spec cuyo Scope nombra un directorio y no ficheros → `decision index` recibe los ficheros de ese directorio que cambian, no el directorio · Task 3, texto de la regla; lectura en la revisión.
- Una feature con exactamente 4 tasks previstas → sí lleva secciones (el umbral es «4 o más») · Task 3, Pester del literal y `pb` (5 tasks) / `pb-c` (2).
- El usuario contesta a una sección «empieza ya» → se acaban las secciones y se escribe la spec, con lo pendiente en ✋ · Task 3, texto de la regla; lectura en la revisión.
- `sdd-roadmap` sin `brainstorming` → la entrevista sigue acabando en `proposal.md` y filas, no en una spec · Task 2, humo `g4`.
- `execution: native` fijado en `sdd-kit.json` → `plan-writing.md` no pregunta el método ni en `pair` · Task 2, Pester `NativeDefault` y texto del handoff.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos referencias en vez de dos skills (decidido con el dev-lead).
- [x] **YAGNI gate**: no se forkea el visual companion ni su servidor.
- [x] **Brownfield gate**: las plantillas no se tocan salvo sus avisos; no se mueve ninguna regla medida.
- [x] **Constitution check**: Art. I (RED antes, batería de propose, previsión), Art. III (inglés en skills), Art. VIII (plantillas únicas), Art. IX (fork con aviso).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-propose/references/spec-writing.md` — cómo se escribe la spec: propósito, qué cubre frente a `spec-template.md`, empezar ya, diseño por secciones y ADR.
- `skills/sdd-propose/references/plan-writing.md` — cómo se escribe el plan: estructura de ficheros, tamaño de task, granularidad de paso, self-review en cinco comprobaciones, handoff con los ajustes del kit, commits frecuentes.
- `skills/sdd-propose/NOTICE` — aviso y licencia MIT de superpowers.
- `tests/batteries/sdd-propose/fixtures/adr-0003-bookings-in-memory.md` — la ADR plantada de `adr`.
- `tests/superpowers-fork-red.md`, `tests/superpowers-fork-green.md` — evidencia.

**Modificar**:

- `skills/sdd-propose/SKILL.md` — pasos 4 y 5 (lo primero, leer la referencia; el comando de `decision index`), red flags y racionalizaciones que nombran las dos skills.
- `skills/sdd-grilling/SKILL.md` — regla del boceto.
- `skills/sdd-roadmap/SKILL.md`, `skills/sdd-init-greenfield/SKILL.md`, `skills/using-sdd/SKILL.md` — la frase que atribuye la entrevista a `brainstorming`.
- `skills/sdd-config/SKILL.md` (fila 6), `skills/sdd-start-feature/references/control-profiles.md` (§execution), `skills/sdd-start-feature/references/overrides-superpowers.md` (cinco filas fuera).
- `skills/sdd-templates/templates/spec-template.md` y `plan-template.md` — solo los avisos que nombran `superpowers:writing-plans`.
- `.docs/sdd/constitution.md` (Art. IV), `.docs/sdd/architecture.md`, `.docs/sdd/mission.md`, `README.md`, `THIRD_PARTY_NOTICES.md`.
- `tests/SuperpowersCompat.Tests.ps1`, `PlanEntry.Tests.ps1`, `PlanReviewFocus.Tests.ps1`, `NativeDefault.Tests.ps1`, `WordBudget.Tests.ps1`.
- `tests/batteries/sdd-propose/battery.md` y `subject.sh`; `tests/batteries/sdd-grilling/battery.md` y `subject.sh`.

**NO se tocan**:

- `skills/sdd-explore/SKILL.md` — su prohibición de `brainstorming` se queda.
- `skills/sdd-implement/SKILL.md` — spec ✋19.
- `.docs/workflow/`, `tech-stack.md` (menciones históricas).

### 1.6 Dependencias

Superpowers 7.0.0 sigue instalado (lo necesitan 0165, 0166, 0148 y 0149); esta feature solo deja de invocar dos de sus skills.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto no lee la referencia del paso 4 | media | alto: la spec sale sin las reglas | «lo primero de este paso: lee…» (0147, 4 de 4); `h1` lo mide en `tools.txt` |
| Un RED limpio quita una regla decidida en la entrevista | media | medio | decisión 5: paro y lo enseño |
| La campaña pasa del techo | baja | medio | `COST_CAP=18`; escenarios de un turno |

### 1.8 Rollout

Directo: entra en la release 3.0.0; sin migración (spec ✋14).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED de las reglas nuevas

**Tras**: —
**Modelo**: hilo (Native, sesión); sujetos `claude -p --model sonnet`
**Tests RED**: escenarios `pb`, `adr`, `sk` (n = 2) y `h1` (n = 1) con el kit del commit de apertura
**Superficies**: tooling, docs
**Verificación**: `BATTERY=sdd-propose STEPS="pb adr h1" … bash tests/headless/battery.sh` y `BATTERY=sdd-grilling STEPS="sk" … bash tests/headless/battery.sh`, con `PHASE=red`, `KIT_DIR` = `git archive` del commit de apertura, `SUPERPOWERS_DIR` en la caché 7.0.0, `COST_CAP=18`; el veredicto de conducta, leído con la rúbrica de cada escenario
**Se prueba en la aplicación**: no, porque es la campaña de evidencia previa al cambio

**Interfaces**:
- Consume: nada
- Produce: `tests/superpowers-fork-red.md` con el veredicto por regla (falla → se escribe; limpia → decisión 5); los escenarios en `battery.md` con su rúbrica

**Ficheros**: crear `tests/superpowers-fork-red.md`, `tests/batteries/sdd-propose/fixtures/adr-0003-bookings-in-memory.md`; modificar `tests/batteries/sdd-propose/battery.md`, `subject.sh`, `tests/batteries/sdd-grilling/battery.md`, `subject.sh`

- [ ] **Step 1: Escenarios** — filas nuevas en `battery.md`, con petición, molde, esperado, n, umbral y procedencia (spec ✋17):
  - `pb`: «Arranca con sdd-propose: quiero usuarios con rol (responsable de sala y empleado), que cada reserva guarde quién la hizo, que el responsable pueda anular reservas de su sala, un listado de anuladas por sala y un aviso al empleado cuya reserva se anula. Decisiones ya tomadas: <las de cada parte>. Perfil delegate.» Rúbrica: antes de existir `spec.md`, un mensaje con una sección del diseño y una pregunta de si va bien.
  - `pb-c`: «…filtrar libres por planta…» con sus decisiones (2 tasks). Rúbrica: escribe `spec.md` sin secciones.
  - `adr`: «Arranca con sdd-propose: que las reservas sobrevivan a reiniciar el proceso. Perfil delegate.», molde `reservas-adr`. Rúbrica: la spec cita la ADR 0003 y, si guarda en disco con otra cosa que la ADR, lo marca contra la ADR.
  - `adr-c`: la petición de `pb-c` con el molde `reservas-adr-docs` (la misma ADR con `rutas: docs/**`, que no casa con el Scope). Rúbrica: la spec no añade nada de ADR.
  - `h1`: la petición de `pb-c`, hasta el plan en un turno con «apruebo la spec por delegación». Rúbrica RED: `>>> Skill` de `superpowers:brainstorming` en `tools.txt`; GREEN: lectura de `spec-writing.md` y `plan-writing.md`, ningún `>>> Skill` de las dos.
  - `sk` (grilling): «Añade al listado de reservas una columna de estado con un color por estado.», molde `salas` con `§Frontend` (detector impeccable, Playwright, URL). Rúbrica: ante cómo se ve, propone enseñar la variante sobre la app real o una captura de la pantalla actual, no una maqueta suelta.
  - `sk-c`: «Añade una pantalla nueva de informes de ocupación.». Rúbrica: propone un boceto aparte; en `claude -p`, sin Artifact, lo describe en texto con su escena y dice por qué.
- [ ] **Step 2: Montaje** — `subject.sh` monta `reservas-adr` (la fixture de la ADR en `.docs/sdd/decisions/`), y el `§Frontend` de `sk` en el `tech-stack.md` del molde.
- [ ] **Step 3: Verificación** — `DRY_RUN=1` de los dos `battery.sh`; después el RED. Esperado: sin sujetos invalidados por el molde.
- [ ] **Step 4: Evidencia** — `tests/superpowers-fork-red.md`: tabla por sujeto (coste, conducta), veredicto por regla.
- [ ] **Step 5: Commit de la task**

### Task 2 — Mover a las referencias sin cambiar reglas

**Tras**: Task 1
**Modelo**: hilo (Native, sesión)
**Tests RED**: Pester de forma, escritos antes del cambio: ningún `superpowers:brainstorming` ni `superpowers:writing-plans` invocado en `skills/` (salvo las dos prohibiciones), las dos referencias abren con su línea de origen, `NOTICE` existe, las cinco filas no están en `overrides-superpowers.md`
**Superficies**: docs (skills, plantillas, anclaje), tooling (Pester, baterías)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SuperpowersCompat.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/PlanReviewFocus.Tests.ps1,tests/NativeDefault.Tests.ps1,tests/UsingSdd.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`; GREEN de `h1` (n = 2), `n`, `y`, `p2`, el de feature de `using-sdd`, `g2` y `g4` (n = 1)
**Se prueba en la aplicación**: no, porque mueve texto sin cambiar comportamiento; lo prueban los humos

**Interfaces**:
- Consume: los veredictos de la Task 1
- Produce: `skills/sdd-propose/references/spec-writing.md` con las secciones `## Purpose`, `## What the spec covers`, `## Starting right away` (y huecos para las reglas de la Task 3); `plan-writing.md` con `## File structure`, `## Task right-sizing`, `## Step granularity`, `## Self-review`, `## Execution handoff`, `## Commits`

**Ficheros**: los de §1.1 salvo `sdd-grilling` y las baterías

- [ ] **Step 1: Pester RED** — en `SuperpowersCompat.Tests.ps1`: `It 'ninguna skill invoca brainstorming ni writing-plans'` (busca `superpowers:brainstorming` y `superpowers:writing-plans` en `skills/**/*.md` y solo admite las líneas de las dos prohibiciones), `It 'cada referencia forkeada abre con su origen'` (`Adapted from superpowers 7.0.0`), `It 'sdd-propose lleva NOTICE'`, y la fila de overrides que hoy fija el tamaño de `brainstorming` pasa a `Should -Not -Match`. Correr: rojo.
- [ ] **Step 2: Referencias** — `spec-writing.md` y `plan-writing.md` con lo que el anexo de la spec manda a cada una; pasos 4 y 5 de `sdd-propose` con «First thing in this step: read `references/<…>.md`», sin la frase de la oferta de saltarse las preguntas; red flags y racionalizaciones que nombraban las dos skills, a la referencia o al nombre del paso.
- [ ] **Step 3: El resto** — `using-sdd`, `sdd-roadmap`, `sdd-init-greenfield`, `sdd-config`, `control-profiles.md`, `overrides-superpowers.md`, avisos de las plantillas, constitution Art. IV, `architecture.md`, `mission.md`, README (6 skills), `THIRD_PARTY_NOTICES.md` (enlace al anexo de la spec), `NOTICE`; los Pester que fijaban literales movidos, al literal nuevo; topes de `WordBudget` (decisión 7).
- [ ] **Step 4: Verificación** — el Pester de arriba en verde; los humos GREEN.
- [ ] **Step 5: Commit de la task**

### Task 3 — Diseño por secciones y ADR en `spec-writing.md`

**Tras**: Task 2
**Modelo**: hilo (Native, sesión)
**Tests RED**: `pb` y `adr` de la Task 1 (los que salieron en rojo); Pester del umbral «4 or more» y del verbo `decision index` en `spec-writing.md`
**Superficies**: docs (skill), tooling
**Verificación**: Pester `SuperpowersCompat`, `WordBudget`; GREEN de `pb` y `adr` (n = 2), `pb-c` y `adr-c` (n = 1)
**Se prueba en la aplicación**: no, porque es texto de skill; lo prueban los sujetos

**Interfaces**:
- Consume: `spec-writing.md` de la Task 2
- Produce: secciones `## Design by sections` y `## Decisions that apply (ADR)` de `spec-writing.md`; el comando `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" decision index --path .docs/sdd --files <files>` en el paso 4 de `sdd-propose`

**Ficheros**: modificar `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-propose/SKILL.md`, `tests/SuperpowersCompat.Tests.ps1`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-propose/battery.md`

- [ ] **Step 1: Implementación** — las dos reglas con todas las condiciones de la spec (✋5, ✋6 y los dos ADDED de `feature-flow`): recuento al entrar en el paso 4, exclusiones (≤3, lite, spike, spec delegada, `unattended`, empezar ya), turnos de la entrevista dentro de la parada de la spec; ADR en full y lite, ficheros sin directorios, `proposed` como pendiente, contra una `accepted` a ✋ o a «Decisiones tomadas con el dev-lead» según quién lo eligió, `sustituye a NNNN`. Cada regla cita su evidencia (`tests/superpowers-fork-red.md`). Solo las que el RED confirmó (decisión 5).
- [ ] **Step 2: Verificación** — Pester en verde; GREEN de los cuatro escenarios.
- [ ] **Step 3: Evidencia** — `tests/superpowers-fork-green.md` (tramo de propose); «Procedencia de las reglas» en `battery.md`.
- [ ] **Step 4: Commit de la task**

### Task 4 — Boceto en `sdd-grilling`

**Tras**: Task 3
**Modelo**: hilo (Native, sesión)
**Tests RED**: `sk` de la Task 1 (si salió en rojo)
**Superficies**: docs (skill), tooling
**Verificación**: Pester `WordBudget`; GREEN de `sk` (n = 2) y `sk-c` (n = 1)
**Se prueba en la aplicación**: no, porque es texto de skill; lo prueban los sujetos

**Interfaces**:
- Consume: nada de las anteriores
- Produce: la regla del boceto en la forma de la pregunta de `sdd-grilling`, con el respaldo en texto

**Ficheros**: modificar `skills/sdd-grilling/SKILL.md`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-grilling/battery.md`, `tests/superpowers-fork-green.md`

- [ ] **Step 1: Implementación** — la frase de la spec ✋7: Artifact si la pantalla no existe; si existe, sobre la app real con `§Frontend` (detector en vivo o captura de la pantalla actual junto a la variante); sin `§Frontend`, Artifact; sin app o sin Artifact, texto con escena y motivo. Solo si el RED la confirmó.
- [ ] **Step 2: Verificación** — Pester en verde; GREEN de `sk` y `sk-c`.
- [ ] **Step 3: Evidencia** — tramo de grilling en `tests/superpowers-fork-green.md`; procedencia en `battery.md`; tope final de `sdd-grilling`.
- [ ] **Step 4: Commit de la task**

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 4h (rango 3–5, condicionado al RED)
- Base de la estimación: 4 tasks de texto de skill con campaña headless (unos 20 sujetos en paralelo, ≈10 min de redacción por fichero de evidencia, estimation.md); la 0147 (4 tasks, mismo patrón) como referencia; ratio de la release sin publicar 0,46
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (decisión 6)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` MODIFIED «El diseño de una feature pregunta con `sdd-grilling`» → Task 2 (`h1`). ✓
- `feature-flow` ADDED «Una feature grande devuelve el diseño por secciones antes de la spec» → Task 3 (`pb`, `pb-c`). ✓
- `feature-flow` ADDED «La spec cita las ADR de los ficheros que toca» → Task 3 (`adr`, `adr-c`). ✓
- `feature-flow` REMOVED + ADDED «Pedir empezar ya no se lleva la spec» → Task 2 (`n`, `y`). ✓
- `feature-flow` reglas · Límites → Task 3 (texto). ✓
- `routing` MODIFIED → Task 2 (`h1`, humo de `using-sdd`, Pester). ✓
- `interviewing` MODIFIED y reglas → Task 4 (`sk`, `sk-c`). ✓
- ✋2, ✋3 (NOTICE, origen, enlace al anexo) → Task 2. ✓
- ✋11 (cinco filas fuera de overrides) → Task 2, Pester. ✓
- ✋13, ✋14 (roadmap, init, literales, README, constitution, mission) → Task 2 (`g2`, `g4`, Pester). ✓
- ✋17 (previsión) → Tasks 1, 3 y 4. ✓
- ✋18 (topes) → Tasks 2, 3 y 4. ✓
- ✋20 (filas de deuda) → cierre (`sdd-end-feature`). ✓
- Review Focus → Tasks 2 y 3, como dice cada línea. ✓
