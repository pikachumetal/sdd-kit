---
id: 20260722-103807-task-0000-carril-rama-worktree
task: 0000
title: Plan de implementación — Desacople carril↔rama git-flow, consciencia de worktree y rename hotfix→patch
spec: ./spec.md
status: approved
created: 2026-07-22
---

# Plan de implementación — Desacople carril↔rama git-flow, consciencia de worktree y rename hotfix→patch

**Goal**: Renombrar el carril ligero `hotfix`→`patch` (claridad de naming) y reescribir el override `using-git-worktrees → No-op` de `sdd-start-task`, que contradice la constitution de un proyecto con worktrees.

> **RECORTE tras el RED (2026-07-22).** El RED (`tests/sdd-start-patch-red.md`, workflow `wf_d6ee43e7-75c`) demostró que el baseline **ya acierta** la conducta de worktree/rama leyendo la constitution del proyecto. Por Art. I, se retira la guidance de comportamiento (consciencia de worktree, desacople carril↔rama con nota anti-atajo): sin baseline que falle, no se escribe. Quedan dos cambios que el RED sí respalda: rename + reescritura del override. Las Tasks 3 y 4 originales se simplifican; ya no añaden guidance de conducta.

**Architecture**: Cambio de contenido en skills Markdown. RED ya ejecutado (acotó el alcance). Implementación: rename mecánico + contenido patch + reescritura del override, en un solo barrido coherente para no dejar referencias colgadas; el histórico se preserva intacto. GREEN: verificar que la contradicción del override desaparece (agente en proyecto con worktrees ya no razona contra el kit) y que las referencias del rename resuelven.

**Tech Stack**: Markdown puro (SKILL.md con frontmatter YAML, plantillas). Sin build ni CI. Verificación = evidencia narrativa RED/GREEN verificada en disco (`tests/*.md`). Orquestación de runs con **workflow multi-agente** (Sonnet sobre fixtures en scratchpad): rutas absolutas incrustadas en el script (los `args` llegan serializados), una copia de fixture por run con git local propio, `cd` explícito en operaciones git de subagentes, verificación en disco además del autoinforme.

**Spec**: `./spec.md`

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿más simple? El rename es inherentemente multi-fichero; no hay atajo (una redirección de alias rompería la fuente única). Los 2 comportamientos son texto en 2 skills. No se puede simplificar sin dejar el equívoco a medias.
- [ ] **YAGNI gate**: no se abstrae nada nuevo; se reescribe texto existente y se renombra. Sin código especulativo.
- [ ] **Brownfield gate**: el kit es su propio "codebase" de skills. Retrocompatible: el histórico con prefijo `hotfix-` se preserva; solo cambian los arranques futuros. Se respeta el patrón de anatomía de skill (Art. architecture). Sin refactor oportunista fuera de scope.
- [ ] **Constitution check**: Art. I (RED→GREEN, Tasks 1 y 6), II (predicado observable en comportamiento B), III (idioma), IV (cambio mayor con spec+revisión), VII (dogfooding), VIII (plantilla fuente única). Ver spec §7.1.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-start-patch-red.md` — evidencia RED del baseline (carril ligero + task) sin las skills nuevas.
- `tests/sdd-start-patch-green.md` — evidencia GREEN con las skills nuevas.
- `tests/sdd-start-task-worktree-red.md` y `-green.md` — evidencia del comportamiento de worktree/rama en `sdd-start-task` (si el mismo run cubre ambas skills, se consolida; ver Task 1/6 notas).
- `skills/sdd-start-patch/SKILL.md` — resultado del rename de `sdd-start-hotfix/` (git mv de la carpeta).
- `skills/sdd-end-patch/SKILL.md` — resultado del rename de `sdd-end-hotfix/`.
- `skills/sdd-templates/templates/patch-template.md` — resultado del rename de `hotfix-template.md`.

**Modificar**:

- `skills/sdd-start-task/SKILL.md` — reescribir paso 3 (Branch), override `using-git-worktrees`, nombrado (`task|patch`), enrutado (referencia a `sdd-start-patch`), red flags; añadir nota anti-atajo carril↔rama.
- `skills/sdd-start-patch/SKILL.md` (tras rename) — `name:`, cuerpo, description; añadir comportamiento worktree/rama + nota anti-atajo; ajustar árbol de decisión.
- `skills/sdd-end-patch/SKILL.md` (tras rename) — `name:`, cuerpo, description, referencias a `patch.md`.
- `skills/sdd-templates/templates/patch-template.md` (tras rename) — `id:`, `type: patch`, `branch: <feature|hotfix>/<id>`, título, cuerpo.
- `skills/sdd-templates/SKILL.md` — fila del índice (`patch-template.md` → `patch.md`).
- `skills/sdd-consult/SKILL.md` — handoff (L22), description, racionalización (L35).
- `skills/sdd-end-task/SKILL.md` — nota (L29), description.
- `skills/add-to-changelog/SKILL.md` — description.
- `skills/sdd-start-release/SKILL.md`, `skills/sdd-end-release/SKILL.md` — referencias a `hotfix.md`→`patch.md` / carril.
- `README.md` — filas del catálogo (L38-39).
- `CLAUDE.md` — referencia "carril hotfix" (L23).
- `.docs/sdd/constitution.md` — Art. VII (L33).
- `.docs/sdd/mission.md` — dominio "carril hotfix" (L22).
- `.docs/sdd/architecture.md` — árbol de ficheros (L17-18).

**NO se tocan** (histórico — sería falsificar):

- `.docs/sdd/changelog.md` — entradas de releases publicadas.
- `.docs/sdd/specs/2026...` (specs/walkthroughs/tasks.md cerradas) — excepto esta carpeta.
- `.docs/sdd/releases/v0.x/` — actas y notes.
- `tests/sdd-*-hotfix-*.md` (v0.1.0) y otras evidencias con "hotfix" histórico.
- `.docs/flux/*` — documentos del equipo en catalán, otro ámbito.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica. El histórico con prefijo `hotfix-` convive con los nuevos `patch-` sin migración.

### 1.4 Contratos API

No aplica. El "contrato" es el frontmatter `description` + cuerpo de cada skill.

---

## 2. Tasks

> Verificación según `tech-stack.md` §Tests: no hay tests automáticos → evidencia RED/GREEN narrativa verificada en disco, orquestada con workflow. Hay más de una task → se crea `tasks.md` como registro vivo. El "build" del kit es lint/estructura implícita (frontmatter válido, referencias que resuelven); no hay comando de build.

### Task 1 — RED: baseline (COMPLETADA — acotó el alcance)

**Ficheros**: `tests/sdd-start-patch-red.md` (creado).

- [x] **Step 1-4** — RED ejecutado en dos rondas: v1 (`wf_ca5f594f-2e5`) descartada por método (molde con git, bug irreproducible); v2 (`wf_d6ee43e7-75c`) válida con molde sin git, bug real y 3 escenarios (S1a dentro de worktree, S1b en develop, S2 hotfix urgente). **Hallazgo**: el baseline acierta la conducta de worktree/rama vía la constitution del proyecto; el único fallo reproducido es la **contradicción del override `No-op`** (S1b lo citó). El rename es claridad de naming. → Alcance recortado. Evidencia completa en `tests/sdd-start-patch-red.md`.
- [ ] **Commit** del RED: `test(patch): RED baseline — el override No-op contradice proyectos con worktrees; conducta ya correcta vía constitution` (se hace junto al resto en el orden de commits).

### Task 2 — Rename mecánico de carpetas y plantilla

**Ficheros**: `git mv` de `skills/sdd-start-hotfix/`→`skills/sdd-start-patch/`, `skills/sdd-end-hotfix/`→`skills/sdd-end-patch/`, `skills/sdd-templates/templates/hotfix-template.md`→`patch-template.md`.

- [ ] **Step 1: git mv de las carpetas y el fichero** — preservar historial. Actualizar `name:` frontmatter de ambas skills a `sdd-start-patch`/`sdd-end-patch`.
- [ ] **Step 2: Verificación** — `git status` muestra renames (R), no delete+add; los 3 ficheros existen en su nueva ruta.
- [ ] **Step 3: Commit** — `refactor(skills): renombrar carril hotfix→patch (git mv de carpetas y plantilla)`.

### Task 3 — Contenido de las skills patch + plantilla (rename, SIN guidance nueva de conducta)

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md`, `skills/sdd-end-patch/SKILL.md`, `skills/sdd-templates/templates/patch-template.md`, `skills/sdd-templates/SKILL.md`.

- [ ] **Step 1: `patch-template.md`** — `id: <...>-patch-<id>-<slug>`, `type: patch`, `branch: <feature|hotfix>/<id>` (placeholder de ejemplo, el git-flow lo fija el proyecto), título "Patch", cuerpo con `patch.md` como nombre del artefacto. Borrar rastros de "hotfix" salvo donde `hotfix/` sea un valor legítimo de rama git-flow.
- [ ] **Step 2: `sdd-start-patch/SKILL.md`** — SOLO rename de contenido: description (patch, no hotfix), Overview (fix ligero determinista → `patch.md`), árbol de decisión, paso Carpeta (`patch-<id>-<slug>/patch.md`), red flags (prefijo `patch-`). **NO se añade guidance de worktree/rama** (el RED la descartó). Mantener el resto del cuerpo intacto.
- [ ] **Step 3: `sdd-end-patch/SKILL.md`** — rename: description, cuerpo, referencias `hotfix.md`→`patch.md`, `sdd-end-hotfix`→`sdd-end-patch`.
- [ ] **Step 4: `sdd-templates/SKILL.md`** — fila del índice: `patch-template.md` | `patch.md` | Carril patch; y `(task|hotfix)`→`(task|patch)` en la regla de ubicación (L25).
- [ ] **Step 5: Verificación** — grep en `skills/sdd-start-patch`, `skills/sdd-end-patch`, `patch-template.md`: 0 ocurrencias de "hotfix" salvo como valor de rama git-flow (`hotfix/*`). Frontmatter `name:` correcto.
- [ ] **Step 6: Commit** — `refactor(skills): contenido del carril patch (rename hotfix→patch)`.

### Task 4 — sdd-start-task: rename de referencias + reescritura del override

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`.

- [ ] **Step 1: Override worktrees (el fallo del RED)** — reescribir la fila `using-git-worktrees` de la tabla de overrides: de `No-op: se usa el git-flow del proyecto` a una redacción neutral que **no niega** los worktrees. P.ej.: "El kit no gestiona worktrees desde el flujo (no invoca `superpowers:using-git-worktrees` ni crea entornos); trabaja dentro del git-flow del proyecto, worktrees incluidos, que el dev gestiona fuera del flujo." Sin prescribir.
- [ ] **Step 2: Enrutado + nombrado + red flags (rename)** — `sdd-start-hotfix`→`sdd-start-patch`, `hotfix`→`patch` en el paso Enrutado (L30), nombrado (`(task|hotfix)`→`(task|patch)`, prefijo, L41-44), red flag del prefijo (L78), y "carril hotfix" en "Cuándo NO aplicar SDD" (L67). **NO se añade nota anti-atajo** (el RED la descartó).
- [ ] **Step 3: Verificación** — grep: 0 `sdd-start-hotfix`; "hotfix" solo como valor de rama git-flow. La fila del override lee coherente y sin contradicción.
- [ ] **Step 4: Commit** — `refactor(skills): sdd-start-task — override de worktrees neutral y referencias hotfix→patch`.

### Task 5 — Referencias vivas en docs de anclaje y skills auxiliares

**Ficheros**: modificar `sdd-consult`, `sdd-end-task`, `add-to-changelog`, `sdd-start-release`, `sdd-end-release`, `README.md`, `CLAUDE.md`, `constitution.md`, `mission.md`, `architecture.md`.

- [ ] **Step 1: Skills auxiliares** — `sdd-consult` (handoff L22, description, racionalización L35), `sdd-end-task` (nota L29, description), `add-to-changelog` (description), `sdd-start-release`/`sdd-end-release` (`hotfix.md`→`patch.md`, carril).
- [ ] **Step 2: Docs de anclaje del kit** — `README.md` (catálogo L38-39), `CLAUDE.md` (L23), `constitution.md` Art. VII (L33), `mission.md` (dominio L22), `architecture.md` (árbol L17-18). **Preservar** los que son histórico (no tocar changelog ni specs cerradas).
- [ ] **Step 3: Verificación (barrido de cierre)** — grep global de `sdd-start-hotfix|sdd-end-hotfix` en todo el repo **excluyendo** `tests/sdd-*-hotfix-*.md`, `releases/`, `changelog.md`, `specs/2026...` cerradas y `flux/`: 0 referencias vivas colgadas. Confirmar que las ocurrencias restantes de "hotfix" son (a) histórico legítimo o (b) valor de rama git-flow.
- [ ] **Step 4: Commit** — `refactor(docs): actualizar referencias vivas del carril hotfix→patch`.

### Task 6 — GREEN: verificación del override reescrito + integridad del rename

**Ficheros**: crear `tests/sdd-start-patch-green.md`.

- [ ] **Step 1: Escribir el workflow GREEN** — reproducir el escenario S1b del RED (agente arranca `sdd-start-task` en un proyecto con worktrees en la constitution), ahora con `sdd-start-task` **modificada** (override reescrito). Fixture idéntica, copia por run. Objetivo: verificar que el agente **ya no cita la contradicción** del override — no tiene que razonar contra el kit.
- [ ] **Step 2: Verificación en disco del rename** — grep global (excluyendo histórico ②): 0 referencias vivas a `sdd-start-hotfix`/`sdd-end-hotfix`/`hotfix.md` como artefacto vivo. Los handoffs de `sdd-consult`, la referencia de `sdd-start-task`, etc. apuntan a `sdd-start-patch`. Un run de handoff (agente en consult que transiciona a patch) confirma que el nombre resuelve.
- [ ] **Step 3: Redactar veredicto** — contra los dos hallazgos del RED: (1) ¿desapareció la contradicción del override? (2) ¿resuelven las referencias del rename? ✅/❌ con evidencia en disco. Si el GREEN destapa un hueco → REFACTOR + re-verificación en el mismo fichero.
- [ ] **Step 4: Commit** — `test(patch): GREEN — override neutral sin contradicción + rename íntegro (verificado en disco)`.

---

## Estimación y esfuerzo *(OBLIGATORIO — existe `.docs/sdd/estimation.md`)*

- Tipo: docs (contenido de skills) + infra/tooling (workflow de test)
- Esfuerzo spec + plan: ~1,3h (incluye consulta+grilling+brainstorming y el re-encuadre tras el RED)
- Estimación de implementación: **2h** (rango 1,5–2,8h) — revisada a la baja tras el recorte
- Base de la estimación: el RED consumió más de lo previsto (dos rondas: v1 descartada por método + v2 válida), pero **acotó el alcance**: fuera la guidance de comportamiento en 2 skills, queda rename multi-fichero (~15 ficheros vivos, mecánico) + una reescritura puntual del override + un GREEN más simple (verificar ausencia de contradicción + integridad del rename, no conducta nueva). Referencia: release-skills 1,5h, consult-skill 1,4h reales, ambas de menor superficie de rename. El riesgo alcista es el barrido de referencias vivas (distinguir vivo de histórico sin falsificar).
- Confianza: media-alta (el rename es predecible; el GREEN es más acotado que el original).

---

## 3. Validación final

- [ ] "Build" verde: frontmatter YAML válido en las skills renombradas; referencias vivas resuelven (grep de cierre limpio).
- [ ] Criterios de éxito de la spec §2 verificados: (1) instrucción desacople + nota anti-atajo presentes; (2) comportamiento observar/heredar/avisar presente en ambos carriles; (3) rename completo con histórico preservado; (4) RED→GREEN en disco.
- [ ] Spec satisfecha: cada requisito con su task (ver Self-review).
- [ ] Cierre de rama vía `sdd-end-task` (merge = decisión del usuario).

---

## 4. Self-review (cobertura spec → tasks) — actualizada tras el recorte

- Reescritura del override `using-git-worktrees` (spec §3.1, US2) → Task 4 Step 1. ✓
- Rename hotfix→patch, regla de categorías (spec §3.2, US1) → Task 2 (mecánico) + Task 3 (contenido) + Task 4 Step 2 + Task 5 (referencias vivas). ✓
- Histórico preservado (spec §2 NO-objetivos, §3.2 ②) → §1.1 "NO se tocan" + Task 5 Step 3 + Task 6 Step 2 (grep excluye histórico). ✓
- Artefactos nuevos prefijo `patch-`/`patch.md` (spec §3.2 ③) → Task 3 Step 1-2. ✓
- RED ejecutado, acotó alcance (spec §7.1 Art. I) → Task 1 (COMPLETADA). ✓
- GREEN: override sin contradicción + integridad del rename (spec §2 def. éxito 3) → Task 6. ✓
- **Guidance de conducta (worktree/desacople) NO se escribe** (spec §2 NO-objetivos, Art. I) → Tasks 3 y 4 explicitan "SIN guidance nueva". ✓
- `sdd-start-release`/`sdd-end-release` solo rename de refs (spec §2 NO-objetivos) → Task 5 Step 1. ✓
- Estimación obligatoria (predicado `.docs/sdd/estimation.md`) → bloque Estimación. ✓
