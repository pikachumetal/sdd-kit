---
id: 20260721-082038-task-0000-release-skills
task: 0000
title: Plan de implementación — Carril release sdd-start-release y sdd-end-release
spec: ./spec.md
status: approved
created: 2026-07-21
---

# Plan de implementación — Carril release

**Goal**: validar con ciclo RED→GREEN las dos skills de release, mejorarlas contra los fallos exhibidos, dotarlas de plantillas canónicas e integrarlas en la documentación del kit, consolidando además la fuente única de plantillas ya editada en las 7 skills existentes.

**Architecture**: el "test" del kit son subagentes Sonnet sobre fixtures desechables en el scratchpad (tech-stack §Tests). Los runs RED (sin skill) y GREEN (con skill) son independientes entre sí → se orquestan en paralelo con un workflow multi-agente (ultracode, autorizado por el usuario); el análisis de huecos, las ediciones de skills y la evidencia narrativa se hacen en línea.

**Tech Stack**: Markdown puro; subagentes Sonnet para baselines; PowerShell para fixtures y git.

**Spec**: `./spec.md`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: fixtures compactas, un run por escenario, sin framework nuevo.
- [x] **YAGNI gate**: las 2 plantillas nuevas tienen uso real inmediato (decisión del usuario en la spec §3).
- [x] **Brownfield gate**: la evidencia nueva calca la anatomía de `tests/` existente; las skills calcan la anatomía del kit.
- [x] **Constitution check**: Art. I/II/III/VI/VII/VIII cubiertos en spec §7.1.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `<scratchpad>/fixture-timetrack/` — proyecto ficticio con material de release completo; copias por run (`red-start`, `red-end`, `green-start`, `green-end`, `single-source`).
- `tests/sdd-start-release-red.md` / `-green.md` — evidencia del ciclo.
- `tests/sdd-end-release-red.md` / `-green.md` — evidencia del ciclo.
- `tests/templates-single-source-green.md` — verificación dirigida de la edición de las 7 skills (RED = comportamiento anterior, anotado dentro).
- `skills/sdd-templates/templates/feedback-template.md` — acta de release (inventario + triage + retro).
- `skills/sdd-templates/templates/release-notes-template.md` — notas de cliente.

**Modificar**:

- `skills/sdd-start-release/SKILL.md` y `skills/sdd-end-release/SKILL.md` — solo contra huecos del ciclo + forma (ruta `.docs/sdd/releases/`, calco de plantillas).
- `skills/add-to-changelog/SKILL.md` — puntero: el corte de versión lo hace `sdd-end-release`.
- `skills/sdd-templates/SKILL.md` — 2 filas nuevas en la tabla.
- `.docs/sdd/mission.md`, `architecture.md`, `constitution.md` (Art. IV, editorial), `roadmap.md`, `README.md`, `CLAUDE.md` — integración 7→9 skills.

**NO se tocan**:

- Las 7 skills ya editadas en el working tree — sus diffs se commitean tal cual tras la verificación GREEN dirigida (no se re-editan salvo fallo).
- `.claude-plugin/plugin.json` — el bump de versión es del corte de release (fuera de scope, spec §2).
- `skills/sdd-templates/templates/*` existentes.

### 1.2–1.4 Modelo de datos / Migraciones / Contratos API

No aplican.

---

## 2. Tasks

### Task 1 — Fixture "TimeTrack" con material de release

**Ficheros**: crear `<scratchpad>/fixture-timetrack/` + 5 copias.

- [ ] Proyecto ficticio con `.docs/sdd/` completo: mission, constitution, tech-stack, roadmap (backlog + deuda + sección release anterior con pendientes vivos), changelog (`[Unreleased]` poblada con tasks/hotfix), estimation.md + estimation-log con desviaciones, specs/ con 2 tasks cerradas, `releases/v0.1.0/feedback.md` con action items previos, y transcripción de demo con peticiones de cliente (incluye una que suena a breaking y presión "todo es importante").
- [ ] Copias por run para evitar contaminación cruzada.
- [ ] Verificación: `Get-ChildItem -Recurse` de la fixture; escenarios cubren todas las tentaciones de la spec §4.1.

### Task 2 — Ciclo RED+GREEN en paralelo (workflow ultracode)

**Ficheros**: ninguno del repo (solo scratchpad + salidas estructuradas).

- [ ] Workflow con 5 agentes Sonnet en paralelo: RED start-release, RED end-release (sin skill), GREEN start-release, GREEN end-release (con el texto actual de la skill), single-source (con las 7 skills editadas, crear un artefacto sin `templates/` en el proyecto).
- [ ] Prompts idénticos palabra por palabra entre RED y GREEN; presión realista en ambos escenarios.
- [ ] Verificación: salidas estructuradas + estado en disco de cada copia de fixture inspeccionado.

### Task 3 — Análisis de huecos y mejoras de las skills

**Ficheros**: `skills/sdd-start-release/SKILL.md`, `skills/sdd-end-release/SKILL.md`.

- [ ] Contrastar fallos RED vs comportamiento GREEN; tabla de racionalizaciones reconstruida desde citas reales del RED (Art. I: guidance sin fallo exhibido, se retira o se marca).
- [ ] Aplicar mejoras de forma de la spec §4.2 (ruta explícita, calco de plantillas, ejemplos si el ciclo los justifica).
- [ ] Re-verificación de huecos: re-run dirigido de los escenarios afectados con la skill mejorada.
- [ ] Commit: `feat(skills): carril release — sdd-start-release y sdd-end-release validadas` (incluye Task 5 y 6 si salen juntas).

### Task 4 — Verificación y commit de la fuente única de plantillas

**Ficheros**: `tests/templates-single-source-green.md`.

- [ ] Redactar evidencia con el resultado del run single-source (RED = instrucción anterior de copiar, citada del git history).
- [ ] Commit: `refactor(skills): fuente única de plantillas — los proyectos dejan de llevar templates/` (los 7 SKILL.md + evidencia).

### Task 5 — Plantillas nuevas en sdd-templates

**Ficheros**: `feedback-template.md`, `release-notes-template.md`, `skills/sdd-templates/SKILL.md`, `skills/add-to-changelog/SKILL.md`.

- [ ] Plantillas calcando la estructura fijada en `sdd-end-release` (spec §4.3); bloques de ayuda en citas `>`.
- [ ] Tabla de `sdd-templates` + puntero en `add-to-changelog`.
- [ ] Verificación: las dos skills de release referencian las plantillas por nombre.

### Task 6 — Evidencia RED/GREEN en tests/

**Ficheros**: los 4 `tests/sdd-*-release-*.md`.

- [ ] Anatomía estándar: escenarios, fallos numerados con racionalizaciones citadas, positivos sin guidance, veredicto por fallo, conclusión.
- [ ] Verificación: cada fallo del RED tiene veredicto en el GREEN.

### Task 7 — Integración documental

**Ficheros**: mission, architecture, constitution (Art. IV), roadmap, README, CLAUDE.md.

- [ ] 7→9 skills de proceso; árbol del repo; catálogo README (+2 skills, 9 plantillas); carril release en el lenguaje del dominio; roadmap refleja estreno en curso y esta task.
- [ ] Commit: `docs(sdd): integración del carril release en los documentos de anclaje`.

### Task 8 — Cierre

- [ ] `sdd-end-task`: walkthrough (con tiempo real), estimation-log, changelog vía `add-to-changelog`, roadmap, revisión de skills.

---

## Estimación y esfuerzo

- Tipo: docs (skills + plantillas + evidencia)
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 4h (rango 3–5h)
- Base de la estimación: 8 tasks; la incertidumbre grande es el ciclo RED→GREEN (5 runs + análisis + posibles re-runs); las plantillas y la integración documental son mecánicas. Sin referencia directa en el estimation-log (primera task con ciclo de test completo orquestado).
- Confianza: media

---

## 3. Validación final

- [ ] Criterios de éxito de la spec §2 uno a uno.
- [ ] Working tree limpio, commits según Art. VI.
- [ ] Cierre vía `sdd-end-task` (Task 8).

---

## 4. Self-review (cobertura spec → tasks)

- Ciclo RED→GREEN de las 2 skills (spec §4.1) → Tasks 1, 2, 3, 6. ✓
- Mejoras de forma (spec §4.2) → Task 3. ✓
- Plantillas nuevas (spec §4.3) → Task 5. ✓
- Fuente única de plantillas (spec §4.4) → Tasks 2, 4. ✓
- Integración documental (spec §4.5) → Task 7. ✓
- Corte de release del kit → N/A (NO objetivo, spec §2). ✓
