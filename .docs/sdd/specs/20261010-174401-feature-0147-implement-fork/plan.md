---
id: 20261010-174401-feature-0147-implement-fork
feature: 0147
title: Plan de implementación — implement: sdd-implement y el decálogo de calidad
spec: ./spec.md
status: approved
created: 2026-10-10
---

# Plan de implementación — implement: `sdd-implement` y el decálogo de calidad

## Decisiones que he tomado yo — valida estas

1. **Cuatro tasks: una de RED, una que mueve sin cambiar reglas, una con las reglas nuevas de implement y una con las de la 0007.** Mover antes de cambiar (como la 0160): si la Task 2 forkea y cambia a la vez, un humo en rojo no dice si falló el fork o la regla nueva.
2. **Ejecución Native**: las cuatro tasks van en serie sobre `skills/sdd-implement/` y son texto y evidencia. Revisor final de rama con `sdd-kit:effort-high` + `opus`.
3. **Effort**: esta sesión no tiene los tipos `sdd-kit:effort-*` (el plugin del kit no cargó: «unmet dependency», superpowers no está instalado en la sesión). Los despachos van con su `model` y «effort: no disponible en este harness, hereda el de la sesión», registrado como ruling.
4. **Molde**: `mold-reservas` de las baterías de `sdd-propose` y `sdd-start-feature` (la app de salas de `using-sdd`, JS con `node:test`), copiado a `tests/batteries/sdd-implement/`. Ruling sobre la decisión 20 de la spec, que lo llamaba «`salas` (TypeScript)»: es la misma app de salas, y el molde en TypeScript de la 0044 no está versionado; «Dónde se prueba» no cambia.
5. **Sujetos**: Sonnet; RED con el kit del commit de apertura (`git archive`, que aún tiene el paso 6 y las dos skills de superpowers) y `SUPERPOWERS_DIR` en la caché 7.0.0; GREEN con el kit de la rama. `r2`, `r3` y `h1` llevan el hook que deniega `Agent` (como la re-medida de la 0007): miden lo que hace el hilo, no lo que despacha. `h2` lo lleva permitido, porque mide el bucle SDD.
6. **Regla de RED limpio** (Art. I y spec, decisión 14): una regla cuyo RED sale limpio no se escribe; si es el decálogo (`r1`), que decidió el dev-lead en la propuesta, paro y te pregunto antes de quitarlo.
7. **Gate de cierre de este repo** (§3): sin `operations.md` ni §Testing con gate en `tech-stack.md`, como la 0160: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
8. **Topes**: `WordBudget.Tests.ps1` necesita uno para `sdd-implement` desde su primer commit: la Task 2 pone el medido redondeado a la centena de arriba; la Task 4 fija los finales (spec, decisión 18: techo 6.000 / 9.000).
9. **Coste estimado**: ~5 h de reloj y ~34 $ de sujetos (techo 40 $: `COST_CAP`), más la revisión final (~3 $).
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que la implementación de una feature la lleve `sdd-implement`, fork de `executing-plans` y `subagent-driven-development` con las reglas del paso 6 dentro, el decálogo en el encargo del implementador, el workspace anunciado, la recuperación tras caída o corte, los commits por ruta y la línea de compactación; y saldar la 0007 y lo que quedaba de la 0054.

**Architecture**: `skills/sdd-implement/` (inglés) con `SKILL.md` y tres prompts en `references/`. `sdd-start-feature` paso 6 queda en una línea que la invoca, y la skill vuelve al paso 7. La prueba es la batería nueva `tests/batteries/sdd-implement/` (r1-r5, h1, h2, u1, u2) y los Pester de forma.

**Tech Stack**: Markdown (skills, plantillas), Bash y Node (`tests/headless/`), Pester (`Skills`, `WordBudget`, uno nuevo de forma).

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks van encadenadas sobre los mismos ficheros de `skills/sdd-implement/`, un error lo caza el humo de su task y la revisión final, y el plan cabe en un contexto; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- `sdd-implement` y sus tres prompts, en inglés; hablan con el usuario en su idioma. Nombres de skill y fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Literales de la spec, exactos: `Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia` (y `· retomo en la Task <N>`); `Task <N>: Ruling: compactación — sigo con <Native | SDD> — quedan <k> tasks` (con una: `queda 1 task`); `Compactación: no` · `Compactación: sí, en la Task <N> → <Native | SDD> desde la Task <M>`; `Task <N>: Ruling: recuperación tras <caída | corte por cuota> — <qué se retomó>`; sección `## Quality decalogue`; `Ajustes de espera`; `Invariante: <n>/<n>`.
- Ninguna skill invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`; los verbos de la CLI se nombran como `sdd <verbo>` (nunca `task-start`, `review-package`, `sdd-workspace` sueltos).
- Cada regla de `sdd-implement` cita solo la ruta de su evidencia (`tests/…`), sin recuentos; los recuentos, en «Procedencia de las reglas» de la batería.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: sujetos Sonnet; revisor final `sdd-kit:effort-high` + `opus` (aquí, `opus` sin tipo: decisión 3); `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, RED apartado fuera del repo, commit, `sdd task done`.
- Una regla cuyo RED sale limpio no se escribe (decisión 6).
- Techo de sujetos: 40 $ (`COST_CAP`); si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; `git add` por ruta.

## Review Focus

- Una feature lite sin plan que llega a `sdd-implement` → usa `spec.md` como plan, Native con `execution: auto`, y el encargo lleva el artículo de calidad de la constitution más el decálogo · Task 2, texto de la regla; lectura en la revisión.
- Recuperación con un informe de task a medias (sin `Status:`) → cuenta como sin informe: se relanza una vez con el mismo brief · Task 3, `r4` y el texto de la regla.
- Compactación en la última task de un plan Native → sigue en Native y deja `queda 1 task`, y el walkthrough dice `→ Native desde la Task <N+1>`… o, si no queda ninguna después, `→ Native` sin «desde» · Task 3, la plantilla del walkthrough; lectura en la revisión.
- Un `git add` por ruta cuando la task borra un fichero → `git add -- <ruta borrada>` (o `git rm`) entra en el commit; no hace falta `-A` · Task 3, texto de la regla.
- Una referencia del kit que nombra `executing-plans` o `subagent-driven-development` como nombre de método (no como skill), p. ej. `execution: subagent` en `sdd-kit.json` → el valor de la clave no cambia; solo cambian las invocaciones · Task 2, Pester de forma.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill para los dos métodos; sin verbo nuevo de la CLI; la ruta del workspace no cambia.
- [x] **YAGNI gate**: sin paralelo de tasks; los prompts del revisor final quedan para la 0148.
- [x] **Brownfield gate**: los Pester que leen lo movido se adaptan en la task que lo mueve; `execution: native | subagent` mantiene sus valores.
- [x] **Constitution check**: Art. I (RED antes, humo, tabla de reglas movidas en el anexo de la spec, previsión, topes), Art. III (inglés), Art. IV (método y política de modelos), Art. IX (aviso del fork), Art. X (restricciones).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-implement/SKILL.md` — la skill: Overview, Method, Setup, Native loop, SDD loop, Deviations and rulings, Compaction, Recovery, Final review, Finish, red flags y racionalizaciones.
- `skills/sdd-implement/references/implementer-prompt.md` — fork del de superpowers con «Restricciones de código», «Tests RED», «Verificación», reglas del implementador (de `encargo-revision.md`) y el decálogo.
- `skills/sdd-implement/references/task-reviewer-prompt.md`, `re-review-prompt.md` — forks con «Restricciones de código» dentro.
- `skills/sdd-implement/NOTICE` — fuente, versión 7.0.0 y licencia MIT.
- `tests/batteries/sdd-implement/` — `battery.md`, `subject.sh`, `fixtures/`, `mold-reservas/`.
- `tests/sdd-implement-red.md`, `tests/sdd-implement-green.md` — evidencia de la campaña.
- `tests/ImplementSkill.Tests.ps1` — Pester de forma.

**Modificar**:

- `skills/sdd-start-feature/SKILL.md` — paso 6 a una línea; red flags, racionalizaciones y nota de detalle de la implementación pasan a `sdd-implement`.
- `skills/sdd-start-feature/references/overrides-superpowers.md` (salen tres filas), `encargo-revision.md` (sale «Encargo del implementador»; las cabeceras del revisor de task y del re-revisor apuntan a los prompts forkeados), `control-profiles.md`, `commit-milestones.md`, `frontend-verification.md` — nombres de las skills.
- `skills/sdd-templates/templates/plan-template.md` (línea `Ejecución` y regla de la task que no remite a otra), `walkthrough-template.md` (línea `Compactación`).
- `tests/batteries/sdd-start-feature/` — `u1` y `u2` salen a la batería de `sdd-implement`.
- `README.md`, `THIRD_PARTY_NOTICES.md`, `CLAUDE.md`, `.docs/sdd/constitution.md` (Art. IV y IX), `.docs/sdd/architecture.md`, `.docs/sdd/mission.md` si cuenta skills, `.docs/sdd/tech-stack.md` (fidelidad del molde, si falta), `.docs/sdd/roadmap.md` (0007, 0054 y filas de deuda nuevas).
- `tests/Skills.Tests.ps1`, `tests/WordBudget.Tests.ps1` y cualquier Pester que lea el paso 6.

**NO se tocan**:

- `cli/` — la ruta del workspace y los verbos no cambian.
- `skills/sdd-propose/SKILL.md` — remite el método al handoff y a la plantilla.
- `.docs/workflow/`, `tests/*.md` anteriores, migraciones — 0152, artefactos de evento, 0157.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `r1` sale limpio y el decálogo no tiene RED | media | medio | decisión 6: paro y pregunto |
| `h2` (SDD con `Agent`) dispara el coste | media | medio | `MAX_TURNS` acotado y `COST_CAP` 40 $ |
| Se pierde una regla al fusionar | baja | alto | tabla del anexo de la spec, `u1`/`u2`, humo y revisión final |
| La sesión compacta | media | medio | ledger y rescate del propio plan |

### 1.8 Rollout

Directo: entra en `develop` y viaja en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Batería de `sdd-implement` y RED de las reglas nuevas

**Tras**: —
**Modelo**: Native (la sesión); sujetos `sonnet`.
**Tests RED**: los escenarios de la batería, lanzados con el kit del commit de apertura.
**Superficies**: tooling (batería), docs (evidencia).
**Verificación**: `bash -n tests/batteries/sdd-implement/subject.sh` y `node tests/headless/battery.mjs field tests/batteries/sdd-implement/battery.md r1 Petición` (sale con 0).
**Se prueba en la aplicación**: no, porque es la base de prueba de las tasks siguientes.

**Interfaces**:
- Consume: `tests/headless/{lib.sh,battery.sh,run.sh,battery.mjs}`; `tests/batteries/sdd-start-feature/{subject.sh,fixtures,mold-reservas}` como base.
- Produce: escenarios `r1`-`r5`, `h1`, `h2` (y `u1`, `u2`, que la Task 2 mueve), con su rúbrica «Falla si…»; `tests/sdd-implement-red.md` con el veredicto por regla.

**Ficheros**: crear `tests/batteries/sdd-implement/*`, `tests/sdd-implement-red.md`; las salidas de los sujetos en `.docs/sdd/specs/20261010-174401-feature-0147-implement-fork/red/`.

- [ ] **Step 1: Batería** — `battery.md` con la forma de la de `sdd-start-feature` y estos escenarios (n = 2 en `r*`, n = 1 en `h*`), cada uno con su «Falla si…»:
  - `r1` (encargo de implementador como petición): task «`informe` lista las canceladas agrupadas por sala con su total», en una app cuyo código ya tiene una función larga y un envoltorio que solo pasa la llamada. Falla si el código nuevo tiene una función de más de 20 líneas, un envoltorio sin lógica propia o un parámetro u opción que la task no pide.
  - `r2` (hilo, paso 6, `Agent` denegado): Task 1 de la 0012 con el THEN «cada reserva cancelada aparece en el informe con su motivo» y tres canceladas en el molde. Falla si el RED comprueba menos de las tres.
  - `r3` (hilo, paso 6, `Agent` denegado): task «extrae `PriceCalculator` de `BookingService` sin cambiar comportamiento». Falla si no apunta el recuento de la suite como invariante o no escribe antes un test estructural que falle.
  - `r4` (hilo, SDD): ledger con `Task 1: complete …`, `task-2-report.md` con `Status: DONE` y su commit, y la petición con la notificación «Agent "Task 2 implementer" failed: usage limit reached». Falla si relanza el implementador de la Task 1 o de la 2, o no deja línea de recuperación.
  - `r5` (encargo de implementador como petición): RED de E2E que espera 500 ms a un guardado que tarda 2 s, código de la task ya correcto. Falla si cambia una aserción o un dato del test, o para sin ajustar la espera.
  - `h1` (Native, `Agent` denegado): plan de la 0010 con 2 tasks. Falla si no anuncia el workspace, usa `git add -A`, `git add .` o `git commit -a`, o no deja `Task <N>: complete` por task.
  - `h2` (SDD, `Agent` permitido, `MAX_TURNS` 80): el mismo plan con `Ejecución: subagent`. Falla si no anuncia el workspace, el encargo del implementador no lleva «Restricciones de código», o el hilo arregla un hallazgo él mismo.
- [ ] **Step 2: `subject.sh`** — monta cada escenario sobre `mold-reservas`, con las fixtures del Step 1; `r1` y `r5` lanzan el encargo como petición; `r2`, `r3`, `h1` instalan el hook que deniega `Agent`. La petición de los escenarios de hilo empieza por «Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6.» en RED y por «Invoca la skill sdd-kit:sdd-implement y sigue:» en GREEN (columna aparte).
- [ ] **Step 3: RED** — `BATTERY=sdd-implement PHASE=red KIT_DIR=<git archive del commit de apertura> SUPERPOWERS_DIR=<caché 7.0.0> SUBJECT_CAP=22 COST_CAP=40 bash tests/headless/battery.sh`, en segundo plano con su vigía. Esperado: un veredicto por escenario.
- [ ] **Step 4: Evidencia** — `tests/sdd-implement-red.md`, por regla: qué hizo cada sujeto, sus frases literales y si la regla se escribe. Si `r1` sale limpio, paro (decisión 6).
- [ ] **Step 5: Commit de la task**.

### Task 2 — `sdd-implement` nace con lo movido, sin cambiar reglas

**Tras**: Task 1
**Modelo**: Native (la sesión).
**Tests RED**: `tests/ImplementSkill.Tests.ps1` (Pester de forma), escrito antes, y `u1`, `u2` como control.
**Superficies**: skills, plantillas, docs, tests.
**Verificación**: `Invoke-Pester tests/ImplementSkill.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1 -CI` y GREEN de `u1`, `u2` (`STEPS=update`).
**Se prueba en la aplicación**: no, porque es un refactor: mueve y traduce sin cambiar reglas.

**Interfaces**:
- Consume: el anexo de la spec («Regla de la fuente → dónde vive ahora»); los textos de superpowers 7.0.0 (`executing-plans/SKILL.md`, `subagent-driven-development/{SKILL.md,implementer-prompt.md,task-reviewer-prompt.md,re-review-prompt.md}`); el paso 6 de `sdd-start-feature`; las filas de `overrides-superpowers.md`; «Encargo del implementador» de `encargo-revision.md`.
- Produce: `skills/sdd-implement/SKILL.md` con las secciones `## Overview`, `## Method`, `## Setup`, `## Native loop`, `## SDD loop`, `## Deviations and rulings`, `## Final review`, `## Finish`, `## Red flags`, tabla de racionalizaciones; `references/implementer-prompt.md` con `## Restricciones de código`, `## Tests RED`, `## Verificación`, `## Reglas del implementador` y el cuerpo forkeado.

**Ficheros**: los de §1.1 salvo la batería y la evidencia.

- [ ] **Step 1: Pester de forma** — `tests/ImplementSkill.Tests.ps1`: (a) existe `skills/sdd-implement/SKILL.md` con las secciones de «Produce»; (b) ningún fichero de `skills/` contiene `superpowers:executing-plans` ni `superpowers:subagent-driven-development`; (c) el paso 6 de `sdd-start-feature` nombra `sdd-implement`; (d) `NOTICE` nombra superpowers 7.0.0 y MIT. Ejecutarlo: falla.
- [ ] **Step 2: Fork** — escribir la skill y los tres prompts siguiendo el anexo de la spec fila a fila; mover el paso 6 entero con sus red flags y racionalizaciones; `sdd-start-feature` paso 6 queda en: invocar `sdd-implement` y seguir en el paso 7 al volver.
- [ ] **Step 3: Recableado** — referencias de §1.1, README (lista de 8 y catálogo), `THIRD_PARTY_NOTICES.md`, constitution (Art. IV, IX), `CLAUDE.md`, `architecture.md`, `mission.md`, Pester que lean el paso 6; `u1` y `u2` pasan a la batería de `sdd-implement`; tope provisional de `sdd-implement` y el de `sdd-start-feature` rebajado.
- [ ] **Step 4: Verificación** — Pester en verde y GREEN de `u1`, `u2` con el kit de la rama.
- [ ] **Step 5: Commit de la task**.

### Task 3 — Reglas nuevas de implement: decálogo, workspace, recuperación, commits por ruta, compactación y método

**Tras**: Task 2
**Modelo**: Native (la sesión).
**Tests RED**: `r1`, `r4`, `h1`, `h2` de la Task 1 (los que fallaron), y los casos nuevos del Pester de forma.
**Superficies**: skills, plantillas, tests.
**Verificación**: `Invoke-Pester tests/ImplementSkill.Tests.ps1, tests/WordBudget.Tests.ps1 -CI` y GREEN de `r1`, `r4`, `h1`, `h2`.
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba con los sujetos de la batería.

**Interfaces**:
- Consume: `skills/sdd-implement/{SKILL.md,references/implementer-prompt.md}` de la Task 2; los literales de las Restricciones de código.
- Produce: `## Quality decalogue` en `implementer-prompt.md` (diez reglas de la spec, decisión 9, y la frase de precedencia); en `SKILL.md`, el anuncio del workspace en `## Setup`, `## Compaction`, `## Recovery`, los commits por ruta en los dos bucles y los cuatro factores en `## Method`; la línea `Compactación:` en `walkthrough-template.md` y el cuarto factor en la línea `Ejecución` de `plan-template.md`.

**Ficheros**: `skills/sdd-implement/SKILL.md`, `references/implementer-prompt.md`, `skills/sdd-templates/templates/{plan-template.md,walkthrough-template.md}`, `tests/ImplementSkill.Tests.ps1`, `tests/batteries/sdd-implement/battery.md` (procedencia), `tests/sdd-implement-green.md`.

- [ ] **Step 1: Pester** — casos nuevos: `walkthrough-template.md` lleva `Compactación:`; `implementer-prompt.md` lleva `## Quality decalogue`; `SKILL.md` lleva el literal del anuncio del workspace y prohíbe `git add -A`. Ejecutar: falla.
- [ ] **Step 2: Reglas** — escribir cada regla cuyo RED falló, en el paso que la dispara (no solo en una referencia), con la ruta de su evidencia.
- [ ] **Step 3: Verificación** — Pester y GREEN de `r1`, `r4`, `h1`, `h2`; `tests/sdd-implement-green.md`.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Piezas de la 0007, filas del roadmap y topes finales

**Tras**: Task 3
**Modelo**: Native (la sesión).
**Tests RED**: `r2`, `r3`, `r5` de la Task 1 (los que fallaron).
**Superficies**: skills, docs, tests.
**Verificación**: `Invoke-Pester tests/ImplementSkill.Tests.ps1, tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1 -CI`, `node cli/bin/sdd.js roadmap check --path .docs/sdd` y GREEN de `r2`, `r3`, `r5`.
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba con los sujetos de la batería.

**Interfaces**:
- Consume: `skills/sdd-implement/SKILL.md` y `implementer-prompt.md` de la Task 3.
- Produce: en `SKILL.md`, el THEN universal y el contrato de refactor donde el hilo escribe los RED; en `implementer-prompt.md`, `Ajustes de espera`; roadmap sin las filas 0007 y 0054 abiertas y con las de deuda nuevas («Esperar 3.er caso»: el hilo ejecuta los RED antes de despachar); `tech-stack.md` con la fidelidad del molde si falta; topes finales.

**Ficheros**: `skills/sdd-implement/SKILL.md`, `references/implementer-prompt.md`, `.docs/sdd/roadmap.md`, `.docs/sdd/tech-stack.md`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-implement/battery.md`, `tests/sdd-implement-green.md`.

- [ ] **Step 1: Reglas** — cada pieza cuyo RED falló; la que salió limpia, a su fila de deuda con su RED citado.
- [ ] **Step 2: Roadmap y tech-stack** — 0007 y 0054 se marcan saldadas por la 0147 (las cierra `sdd-end-feature`); filas de deuda nuevas.
- [ ] **Step 3: Topes** — medir y fijar los de `sdd-implement` (techo 6.000 / 9.000) y `sdd-start-feature`.
- [ ] **Step 4: Verificación** — Pester, `roadmap check` y GREEN.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 5h
- Base de la estimación: 4 tasks; la Task 2 es la más larga (fusionar ~12.700 palabras de superpowers y ~3.000 del paso 6); 0160 (5 tasks parecidas) se estimó en 7,5 h.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (decisión 7)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- La implementación la lleva `sdd-implement` → Task 2 (Pester (b), (c); `u1`, `u2`). ✓
- Una task Native se registra en el ledger de `sdd-implement` (REMOVED + ADDED) → Task 2 (lo movido), `h1`. ✓
- El encargo del implementador lleva el decálogo → Task 3, `r1`. ✓
- El workspace del plan se anuncia → Task 3, `h1`, `h2`. ✓
- Tras una caída o un corte por cuota… → Task 3, `r4`. ✓
- Los commits van por ruta → Task 3, `h1`. ✓
- El walkthrough dice si compactó (y la línea del ledger) → Task 3, Pester y plantilla. ✓
- Cada task del plan viaja sola (MODIFIED) → Task 3, `plan-template.md`. ✓
- THEN universal, refactor, E2E (condicionales) → Task 4, `r2`, `r3`, `r5`. ✓
- `control-profiles`: método con los cuatro factores → Task 3, `plan-template.md` y `## Method`. ✓
- `control-profiles`: compactación registrada → Task 3. ✓
- Spec decisiones 14-15 (0007 y 0054 saldadas) → Task 4. ✓
- Review Focus → Tasks 2 y 3, lectura en la revisión. ✓
