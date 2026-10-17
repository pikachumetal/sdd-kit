---
id: 20261016-105021-feature-0149-archive
feature: 0149
title: Plan de implementación — archive: sdd-archive, cierre único de feature y patch
spec: ./spec.md
status: approved
created: 2026-10-16
---

# Plan de implementación — archive: `sdd-archive`, cierre único de feature y patch

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** — las cinco tasks escriben el mismo `skills/sdd-archive/SKILL.md` y cada una apoya en el tronco de la anterior; un error lo caza la batería o el Pester de su task, y el plan cabe en un contexto.
2. **Modelo**: la sesión implementa cada task (Native). Los sujetos de la batería van en Sonnet con `tests/batteries/sdd-archive/subject.sh`; la revisión final, con los ejes de `sdd-verify`.
3. **El RED de cada escenario va en su task**, con el kit de `develop` (las dos skills viejas), antes de escribir el texto que lo arregla; el GREEN, con la rama, al acabarlo. Así las skills viejas viven hasta la Task 5 y el RED no depende de una rama a medias.
4. **Orden**: tronco y feature → patch y hotfix → receta de merge y base integrada → registros, ADR y «qué sigue» → retirada. La retirada va al final para que los Pester de las skills viejas sigan en verde hasta entonces.
5. **`ArchiveSkill.Tests.ps1`** nace en la Task 1 con la anatomía y crece por task con los literales de la spec (avisos, marcas de carril, comandos).
6. **El tope de `sdd-archive`** entra en `tests/WordBudget.Tests.ps1` en la Task 1 (`SkillMd = 3600; Total = 6000`); los de `sdd-end-feature` y `sdd-end-patch` salen en la Task 5.
7. **Coste**: ~6 h de implementación y ~32 sujetos Sonnet (~35 $, previsión de la spec); si la prueba lo supera, se para y decide el dev-lead.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: sustituir `sdd-end-feature` y `sdd-end-patch` por `sdd-archive`, con su receta de merge, su batería y la deuda con destino 0149 saldada.

**Architecture**: una skill nueva en inglés con un tronco común y ramas `Feature only:`, `Patch only:` y `Hotfix only:`; lo que no cabe en `SKILL.md` va a `references/` (`merge-recipe.md`, `estimation.md`, `aprendizajes-skills.md`). La CLI no cambia: la skill describe sus salidas.

**Tech Stack**: skills en Markdown; Pester para frases y anatomía; sujetos Sonnet con `subject.sh` (`tech-stack.md`, «Cómo se testean las skills»).

**Spec**: `./spec.md`

**Ejecución**: native, porque las cinco tasks escriben el mismo `SKILL.md` y dependen del tronco de la anterior, un error lo caza la batería o el Pester de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — una skill nueva (`sdd-archive`) y la retirada de dos, que cambia el contrato de nombres que consumen las otras skills y los proyectos.

## Restricciones globales

### De código

- Las skills se escriben en inglés y le dicen al agente que hable con el usuario en su idioma (Art. III); texto humano de docs y tests en castellano con tildes.
- Los literales de la spec (avisos, comandos, marcas de carril) van tal cual, sin parafrasear.
- Topes de `tests/WordBudget.Tests.ps1`: `sdd-archive` `SkillMd = 3600; Total = 6000`; los demás no suben: si una edición no cabe, se recorta en la misma task.
- Un fork conserva el texto de su fuente salvo donde el kit trabaja distinto, con su fila en el anexo de la spec (ADR 0013).
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Sujetos de la batería en Sonnet; RED con el kit de `develop`, GREEN con la rama.
- Nada de `--no-verify`; `git config core.hooksPath` devuelve `.githooks`.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una pieza con `parent:` cuya madre ya está `✅` → nombra solo las hermanas abiertas, sin la línea «su fila se puede cerrar» · Task 4, `a5` (variante) y `ArchiveSkill.Tests.ps1` «la madre cerrada no se anuncia».
- La base no avanzó desde la rama → el cierre no crea merge de sincronización ni repite la suite, y pasa `--verified-at` con el sha de la validación · Task 3, `a3` (variante sin avance).
- Un patch con `parent:` → «qué sigue» vale igual que en una feature (el `parent:` del frontmatter de `patch.md`) · Task 4, `ArchiveSkill.Tests.ps1` «qué sigue lee patch.md».

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill en lugar de dos; la CLI no cambia.
- [x] **YAGNI gate**: sin skill puente ni alias.
- [x] **Brownfield gate**: los nombres viejos se retiran en la misma feature y la migración de los proyectos va a la 0157.
- [x] **Constitution check**: Art. I (batería completa por ser archive), III (inglés), IV (historia y rama estable), IX/ADR 0013 (fork con anexo).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-archive/SKILL.md` — el cierre: tronco, ramas por carril, red flags y racionalizaciones.
- `skills/sdd-archive/NOTICE` — procedencia de `finishing-a-development-branch` 7.0.0 (MIT).
- `skills/sdd-archive/references/merge-recipe.md` — qué significa cada salida de `sdd merge` y de `capability check --artifact`, y qué hace el agente.
- `skills/sdd-archive/references/estimation.md` y `references/aprendizajes-skills.md` — movidos de `sdd-end-feature/references/`.
- `tests/batteries/sdd-archive/` — movida de `tests/batteries/sdd-end-patch/` y ampliada con los escenarios de la previsión.
- `tests/ArchiveSkill.Tests.ps1` — anatomía, literales y retirada de nombres.
- `.docs/sdd/specs/20261016-105021-feature-0149-archive/red/` y `green/` — evidencia de los sujetos.

**Modificar**:

- `skills/sdd-start-patch/SKILL.md` (pasos 5 y 6), `skills/sdd-worktrees/SKILL.md` (Step 3), `skills/sdd-start-feature/references/commit-milestones.md` (guarda de shas).
- Nombres en `skills/` (`add-to-changelog`, `sdd-end-release`, `sdd-feedback`, `sdd-propose`, `sdd-start-feature` y sus referencias, `sdd-templates` y sus plantillas, `sdd-verify`), `.docs/sdd/` (`mission.md`, `tech-stack.md`, `architecture.md`), `.docs/workflow/*`, `README.md`, `CLAUDE.md`, `THIRD_PARTY_NOTICES.md`, las baterías y moldes y los Pester de la spec.
- `tests/WordBudget.Tests.ps1`.

**NO se tocan**:

- `cli/` — la skill describe sus salidas; el código va a la 0193.
- ADR, specs, tickets, releases, campañas `tests/*-red.md`, `*-green.md`, `*-ab.md`, migraciones v0.4.0 y v2.0.0 y la fixture `roadmap-0fc231e-parent.md` — son historia.

### 1.6 Dependencias

- Las salidas de `sdd merge` (0187) y de `capability check --artifact` (0191), ya en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El tronco común no cabe en 3.600 palabras | media | medio | lo que no es del tronco va a `references/`; el anexo dice dónde vive cada regla |
| Un Pester busca una frase en la ruta vieja y se queda en verde por no encontrar el fichero | media | alto | la Task 5 corre `kit:test` y revisa cada Pester tocado con un caso que falla |
| `sdd-start-feature` (6 de margen) o `sdd-verify` (15) no caben tras renombrar | baja | bajo | renombrar resta palabras; si no, recorte en la misma task |

### 1.8 Rollout

Directo: entra en `develop` y sale con la 3.0.0; los proyectos migran con la 0157.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Tronco de `sdd-archive`, rama de feature y enrutado

**Tras**: —
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `tests/ArchiveSkill.Tests.ps1` (anatomía: `name: sdd-archive`, `description` con «cierra la feature», «cierra el patch», «hemos acabado» y «haz el walkthrough», marcas `Feature only:`/`Patch only:`/`Hotfix only:`, enlaces a `references/`); RED de `a1` con el kit de `develop`
**Superficies**: docs (skills), tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ArchiveSkill.Tests.ps1,tests/WordBudget.Tests.ps1,tests/Skills.Tests.ps1 -CI"`; GREEN de `a1` (n = 2) y `r1` (n = 2)
**Se prueba en la aplicación**: no, porque es una skill: se prueba con sujetos de la batería.

**Interfaces**:
- Consume: nada.
- Produce: `skills/sdd-archive/SKILL.md` con las secciones `## Overview`, `## Checklist` (tronco con los pasos de la decisión 5 de la spec, en orden: comprobaciones previas → validación → registro del evento → docs vivos → índices → historia → base integrada → merge → ticket y mensaje final), `## Red flags` y la tabla de racionalizaciones; `references/estimation.md` y `references/aprendizajes-skills.md`; `tests/batteries/sdd-archive/` con `battery.md`, `subject.sh` y los moldes.

**Ficheros**: crear `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/NOTICE`, `skills/sdd-archive/references/estimation.md`, `skills/sdd-archive/references/aprendizajes-skills.md` (copias de `sdd-end-feature/references/`, que se borra en la Task 5), `tests/ArchiveSkill.Tests.ps1`; mover `tests/batteries/sdd-end-patch/` a `tests/batteries/sdd-archive/`; modificar `tests/WordBudget.Tests.ps1` (`'sdd-archive' = @{ SkillMd = 3600; Total = 6000 }`).

- [ ] **Step 1: RED** — `battery.md` gana `a1` (cierre de la 0081 en el molde de reservas, en campo, con un workaround en el walkthrough) y `r1` (las dos frases sin nombrar la skill). Corre `a1` con el kit de `develop` (n = 1) y guarda la evidencia en `red/a1/`.
- [ ] **Step 2: Implementación** — el tronco y la rama de feature, fundiendo los pasos 0-12 de `sdd-end-feature` y 0-8 de `sdd-end-patch` según el anexo de la spec; las comprobaciones previas con los avisos literales «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» y «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.»; el workaround con su fila de deuda; el 4.1 con el sha. Los tests de `ArchiveSkill.Tests.ps1`: `Should -Match` de cada literal en `SKILL.md`.
- [ ] **Step 3: Build** — no aplica (Markdown).
- [ ] **Step 4: Verificación** — los Pester de «Verificación» en verde; GREEN de `a1` y `r1` con la rama, puntuados contra los THEN de «El cierre de una feature y el de un patch van por la misma skill», «El cierre comprueba el árbol…», «Un workaround…», «El walkthrough dice de dónde sale cada THEN…» y «El cierre de una feature o de un patch entra por `sdd-archive`».
- [ ] **Step 5: Commit de la task**.

### Task 2 — Rama de patch y de hotfix

**Tras**: Task 1
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `ArchiveSkill.Tests.ps1` (literales del hotfix: «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?», `sdd merge --check --into`, `--order`; paso 5 de `sdd-start-patch` sin tocar la deuda; ayuda de `patch-template.md` con `sdd capability index`); RED de `a2` y `a4`
**Superficies**: docs (skills, plantillas), tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ArchiveSkill.Tests.ps1,tests/WordBudget.Tests.ps1,tests/PatchLane.Tests.ps1 -CI"`; GREEN de `a2` y `a4` (n = 2)
**Se prueba en la aplicación**: no, porque es una skill.

**Interfaces**:
- Consume: el tronco de la Task 1.
- Produce: las ramas `Patch only:` y `Hotfix only:` de `SKILL.md`.

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-start-patch/SKILL.md` (paso 5: «La fila de deuda que salda el patch la cierra `sdd-archive`; el commit del fix no la toca»; paso 6: `sdd-archive`), `skills/sdd-templates/templates/patch-template.md`, `tests/batteries/sdd-archive/battery.md`.

- [ ] **Step 1: RED** — `a2` (el `x1` de hoy con `patch-0008.md`, una fila «Patch:» en Próximo y una fila de deuda que salda) y `a4` (`hotfix/0200-fix-login` en el repo del kit, con la frase «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo» y la respuesta «sí, la clave `auth.sameSite`»), con el kit de `develop`.
- [ ] **Step 2: Implementación** — la rama de patch (sin walkthrough, `tasks.md` ni revisión de skills; la fila «Patch:» se marca `✅` y se queda) y la de hotfix (decisión 13 de la spec: frase del dev-lead en `--order`, `--push` solo si la frase lo pide, el paso de migración solo con `skills/sdd-init-brownfield/references/migrations/`, «No terminado» con `vuelta: conflicto en`).
- [ ] **Step 3: Verificación** — Pester en verde; GREEN de `a2` y `a4` contra «El cierre de una feature y el de un patch van por la misma skill», «Un hotfix se cierra en la rama estable solo con la frase del dev-lead», «En el roadmap 2.x, la fila «Patch:» de Próximo se marca y se queda» y «El patch queda en dos commits».
- [ ] **Step 4: Commit de la task**.

### Task 3 — Receta de merge, base integrada y rojo ajeno

**Tras**: Task 2
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `ArchiveSkill.Tests.ps1` (la receta nombra `destino sacado:`, `--verified-at`, `base: en rojo`, `base: en verde`, `base: conflicto en`, `merge: conflicto en`, `vuelta: conflicto en`, `push: … sigue moviéndose`; no contiene «Conflicto solo en los registros» como camino del script; `sdd-worktrees` Step 3 contrasta con la rama de integración); RED de `a3` y `w1`
**Superficies**: docs (skills), tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ArchiveSkill.Tests.ps1,tests/WordBudget.Tests.ps1,tests/SyncMerge.Tests.ps1 -CI"`; GREEN de `a3` (n = 2, más la variante sin avance de la base del Review Focus, n = 1) y `w1` (n = 2)
**Se prueba en la aplicación**: no, porque es una skill.

**Interfaces**:
- Consume: el paso «base integrada» y «merge» del tronco.
- Produce: `skills/sdd-archive/references/merge-recipe.md`, con una entrada por salida de `sdd merge` (literal de `.docs/sdd/capabilities/control-profiles.md`) y lo que hace el agente; el bloque del informe de rojo.

**Ficheros**: crear `skills/sdd-archive/references/merge-recipe.md` (desde `skills/sdd-end-feature/references/merge-recipe.md`, reescrita); modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-worktrees/SKILL.md`, `tests/batteries/sdd-archive/battery.md`.

- [ ] **Step 1: RED** — `a3` (repo con `develop` que avanzó en `src/rooms.js` y en `roadmap.md`, un `notes.md` sin seguimiento, otra rama con worktree, y un E2E que falla también en `develop` y ya está en la deuda) y `w1` (la línea base falla también en la rama de integración), con el kit de `develop`.
- [ ] **Step 2: Implementación** — decisiones 8 a 12 de la spec: merge de sincronización tras el commit de cierre, conflicto de registros con la regla de hoy y `git merge --abort` en otro caso, suite repetida solo con cambios fuera de `.docs/` que no sean `*.md`, `--verified-at`, contraste a mano en un worktree desanclado, búsqueda en la deuda, informe con «`<merge.into>` sin tocar en `<hash>`».
- [ ] **Step 3: Verificación** — Pester en verde; GREEN de `a3` y `w1` contra «El cierre integra la base tras su commit…», «Un rojo ajeno se busca en la deuda…», «Un conflicto solo en los registros…», «Un conflicto que no se puede conservar entero…» y «El worktree de la implementación lo prepara `sdd-worktrees`».
- [ ] **Step 4: Commit de la task**.

### Task 4 — Registros, ADR, «qué sigue» y guardas

**Tras**: Task 3
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `ArchiveSkill.Tests.ps1` (los literales de «qué sigue», `ADR: <candidata> → decisions/`, `sdd decision check --path .docs/sdd`, la forma 3.0.0 por `ROADMAP.md`, la búsqueda del literal del `MODIFIED`, «la madre cerrada no se anuncia», «qué sigue lee patch.md»; `commit-milestones.md` nombra `walkthrough.md`, `patch.md`, la deuda y las ADR en la guarda); RED de `a5`, `a6`, `a7`, `a8` y `a9`
**Superficies**: docs (skills), tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ArchiveSkill.Tests.ps1,tests/WordBudget.Tests.ps1,tests/CommitMilestones.Tests.ps1,tests/RoadmapClosing.Tests.ps1 -CI"`; GREEN de `a5` a `a9` (n = 2)
**Se prueba en la aplicación**: no, porque es una skill.

**Interfaces**:
- Consume: los pasos «docs vivos», «índices», «historia» y «mensaje final» del tronco.
- Produce: las reglas de la decisión 14 a 20 de la spec en `SKILL.md`; la guarda de shas en `commit-milestones.md`.

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-start-feature/references/commit-milestones.md`, `tests/batteries/sdd-archive/battery.md`.

- [ ] **Step 1: RED** — `a5` (0201 con `parent: 0200` y la 0202 «Fotos de las salas» tras ella), `a6` (spec con una candidata, `decisions/` con la más alta `0015` y una ADR ajena sin `### Confirmación`), `a7` (el caso del patch 0078 con «más de 6 tasks»), `a8` (walkthrough que cita un sha del tramo) y `a9` (`ROADMAP.md` y `debt.md` con una fila saldada entera y otra en parte), con el kit de `develop`.
- [ ] **Step 2: Implementación** — los literales de «qué sigue» de la spec, las ADR candidatas, el `decision check` sin fallos ajenos, la forma 3.0.0, la corrección del literal por el delta y la guarda de los shas de 7 a 40 caracteres hexadecimales.
- [ ] **Step 3: Verificación** — Pester en verde; GREEN contra «Al cerrar una pieza de una familia…», «El cierre escribe las ADR candidatas…», «El cierre ejecuta `sdd decision check`», «El cierre busca el literal viejo…», «El cierre de una feature queda en un commit» y «Con `ROADMAP.md`, lo hecho queda en Now…».
- [ ] **Step 4: Commit de la task**.

### Task 5 — Retirada de `sdd-end-feature` y `sdd-end-patch`

**Tras**: Task 4
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `ArchiveSkill.Tests.ps1` «ningún fichero de `skills/` nombra `finishing-a-development-branch`, `sdd-end-feature` ni `sdd-end-patch`», salvo `skills/sdd-archive/NOTICE`, el anexo y `skills/sdd-init-brownfield/references/migrations/v0.4.0.md` y `v2.0.0.md` (RED: falla hoy)
**Superficies**: docs (skills, `.docs/`, README), tooling (tests)
**Verificación**: el gate de cierre (§3)
**Se prueba en la aplicación**: no, porque es una retirada de nombres.

**Interfaces**:
- Consume: `sdd-archive` completa.
- Produce: el kit sin las dos skills viejas.

**Ficheros**: borrar `skills/sdd-end-feature/` y `skills/sdd-end-patch/`; modificar los de 1.1 «Modificar» (nombres), `skills/sdd-start-feature/references/overrides-superpowers.md` (fuera la fila de `finishing-a-development-branch`), `skills/sdd-templates/templates/environments-template.md` («borrarlo, `sdd-archive`»), `CLAUDE.md` («las 23 skills» → «las 22 skills»), `THIRD_PARTY_NOTICES.md`, `tests/WordBudget.Tests.ps1` (fuera los dos topes) y los Pester de la spec.

- [ ] **Step 1: RED** — el test de retirada en `ArchiveSkill.Tests.ps1`, en rojo.
- [ ] **Step 2: Implementación** — borrar, renombrar y ajustar cada Pester a la ruta nueva; cada Pester tocado se comprueba con un caso que falla (quitando la frase de la copia en el scratchpad).
- [ ] **Step 3: Verificación** — el gate de cierre completo en verde.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 3h
- Estimación de implementación: 6h
- Base de la estimación: 5 tasks en una superficie y ~32 sujetos; la 0148 (docs, 5 tasks, ~39 sujetos) estimó 5 h y tardó 5,5 h.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`, leída de la rama con `Read`: el harness no la conoce hasta la próxima sesión)

---

## 4. Self-review (cobertura spec → tasks)

- `archive` «El cierre de una feature y el de un patch van por la misma skill» → Tasks 1 y 2 (`a1`, `a2`). ✓
- `archive` «El cierre comprueba el árbol, el destino y las otras ramas…» → Task 1 (`a1`) y Task 3 (`a3`). ✓
- `archive` «El cierre integra la base tras su commit…» → Task 3 (`a3`). ✓
- `archive` «Un rojo ajeno se busca en la deuda…» → Task 3 (`a3`). ✓
- `archive` «Un hotfix se cierra en la rama estable solo con la frase del dev-lead» → Task 2 (`a4`). ✓
- `archive` «Al cerrar una pieza de una familia…» → Task 4 (`a5`). ✓
- `archive` «El cierre escribe las ADR candidatas…» → Task 4 (`a6`). ✓
- `archive` «Un workaround…» → Task 1 (`a1`). ✓
- `archive` «El kit no invoca `finishing-a-development-branch`» → Task 5 (Pester). ✓
- `archive` «Un aprendizaje sin destino…», «Una carpeta `-task-`…», «El walkthrough dice de dónde sale cada THEN…» → Task 1 (texto movido; `a1` para el 4.1). ✓
- `feature-flow` MODIFIED «El trabajo se valida…» → Task 5 (nombre). ✓
- `feature-flow` MODIFIED «El gate de cierre se ejecuta una vez» → Task 3 (`a3`). ✓
- `feature-flow` MODIFIED «El worktree de la implementación lo prepara `sdd-worktrees`» → Task 3 (`w1`). ✓
- `routing` ADDED «El cierre de una feature o de un patch entra por `sdd-archive`» → Task 1 (`r1`). ✓
- `routing` MODIFIED de patch visual y de decisiones del patch → Task 2 (rama de patch) y Task 5 (nombres). ✓
- `control-profiles` MODIFIED de validación en campo, política de merge, línea de terminado y verificación del merge → Tasks 1 y 3. ✓
- `control-profiles` MODIFIED «El merge del cierre parte de la rama destino publicada», «Un conflicto solo en los registros…», «Un conflicto que no se puede conservar entero…» → Task 3 (`merge-recipe.md`, `a3`). ✓
- `capabilities` MODIFIED de los tres requisitos → Task 1 (texto) y Task 5 (nombres); ADDED «El cierre busca el literal viejo…» → Task 4 (`a7`). ✓
- `commit-history` MODIFIED → Task 4 (`a8`) y Task 2 (`a2`). ✓
- `roadmap` MODIFIED y ADDED → Task 2 (`a2`) y Task 4 (`a9`). ✓
- `decisions` ADDED → Task 4 (`a6`). ✓
- `estimation`, `kit-feedback`, `verification` MODIFIED → Task 1 (texto) y Task 5 (nombres). ✓
- Review Focus: madre cerrada → Task 4; base sin avance → Task 3; «qué sigue» en un patch → Task 4. ✓
