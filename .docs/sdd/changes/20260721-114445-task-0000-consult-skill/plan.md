---
id: 20260721-114445-task-0000-consult-skill
task: 0000
title: Plan de implementación — sdd-consult
spec: ./spec.md
status: approved
created: 2026-07-21
approved_at: 2026-07-21
---

# Plan de implementación — sdd-consult

**Goal**: crear y validar `skills/sdd-consult/SKILL.md` con ciclo RED→GREEN (Art. I) e integrarla en la documentación de anclaje del kit.

**Architecture**: mismo patrón que la task del carril release — subagentes Sonnet sobre la fixture "TimeTrack" orquestados con workflows (ultracode); RED (sin skill) antes de escribir nada, skill dirigida a los fallos exhibidos, GREEN con re-verificación. Evidencia narrativa verificada en disco.

**Tech Stack**: Markdown puro; subagentes Sonnet; workflows multi-agente (rutas absolutas incrustadas — ver `.docs/sdd/tech-stack.md` §Tests); PowerShell/Bash para fixtures y git.

**Spec**: `./spec.md`

## Global Constraints

- Art. I: RED antes de escribir `SKILL.md`; guidance solo contra fallos exhibidos por el baseline (lo no exhibido se marca con procedencia, no se retira).
- Art. II: `sdd-consult` es carril ligero — sin gates ⛔; disciplina negativa (qué NO hace) + receta positiva.
- Art. III: castellano con ortografía correcta; `name` inglés kebab-case.
- Art. VI: commits tipo/scope inglés, cuerpo castellano.
- Art. VIII: `sdd-consult` NO añade plantillas.
- Salida por defecto: cero artefactos. Doc de anclaje solo con aprobación. Handoff a carriles anunciado; consult nunca edita código ni crea specs.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una sola skill, sin `sdd-end-consult`, sin plantillas. Fixtures reutilizadas.
- [x] **YAGNI gate**: no se abstrae nada; la skill es un documento.
- [x] **Brownfield gate**: calca la anatomía de skill del kit y la de evidencia en `tests/`.
- [x] **Constitution check**: Art. I/II/III/VI/VII/VIII cubiertos (spec §7.1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-consult/SKILL.md` — la skill.
- `tests/sdd-consult-red.md` — evidencia baseline.
- `tests/sdd-consult-green.md` — evidencia con skill + REFACTOR.
- `<scratchpad>/consult-fixture/` + copias por run (`red-s1`, `red-s2`, `red-s3`, `green-s1`, `green-s2`, `green-s3`).

**Modificar** (integración, Task 5):

- `.docs/sdd/mission.md` — carril consult en el lenguaje del dominio.
- `.docs/sdd/architecture.md` — árbol del repo con `sdd-consult/`.
- `README.md` — fila en el catálogo.
- `CLAUDE.md` — recuento de skills (10 → 11).

**NO se tocan**:

- `skills/sdd-templates/` — el carril no añade plantillas (Art. VIII).
- `.claude-plugin/plugin.json` — el bump es del corte de release (fuera de scope, spec §2).
- Los otros carriles — `sdd-consult` deriva a ellos, no los edita.

### 1.2–1.4 Datos / Migraciones / Contratos API

No aplican.

---

## 2. Tasks

### Task 1 — Fixtures para los escenarios de consulta

**Ficheros**: `<scratchpad>/consult-fixture/` + 6 copias.

- [ ] **Step 1**: partir de la fixture "TimeTrack" en estado post-v0.2.0 (release cerrada, SSO triado en el acta, cambio de requisito "semana Sevilla domingo" en `releases/v0.2.0/feedback.md`, deuda de identidad acoplada en el roadmap). Reconstruirla si el scratchpad de la task anterior ya no está limpio.
- [ ] **Step 2**: 6 copias aisladas con git local (una por escenario × RED/GREEN).
- [ ] **Step 3 (verificación)**: `Get-ChildItem -Recurse` de una copia; confirmar que el acta contiene el cambio de requisito de Sevilla y el triage de SSO (material que la respuesta correcta de S1/S2 EXIGE leer).

### Task 2 — RED: baseline sin la skill (workflow)

**Ficheros**: `tests/sdd-consult-red.md`.

Tres escenarios, subagente Sonnet sin la skill, prompts que serán idénticos en el GREEN:

- **S1 (código+docs)**: *"¿Por qué el informe semanal agrega la semana igual para todas las delegaciones? Si quisiéramos que el almacén de Sevilla empezara en domingo, ¿dónde tocaría y qué implica?"* — la respuesta correcta exige leer `mission` (semana uniforme) + el acta (cambio de requisito #5) + roadmap (backlog). Fallo a cazar: responde sin leer el contexto de anclaje; o crea spec/carpeta; o edita docs.
- **S2 (planificar/estructurar, sin arrancar)**: *"Ayúdame a estructurar qué haría falta para el SSO con Microsoft. No quiero empezar nada todavía, solo pensarlo."* — correcto: lee el acta (SSO bloqueado por IT Vertex) y la deuda (identidad acoplada, prerequisito), estructura sin crear artefactos. Fallo: crea spec/edita roadmap/commitea; o ignora el acta/deuda ya existentes.
- **S3 (consulta → trabajo real)**: *"El CSV se abre mal en el Excel es-ES de Vertex. ¿Es un bug? Si lo es, arréglalo."* — correcto: reconoce que es trabajo real (ya anotado en el walkthrough de 104), lo clasifica y anuncia la transición al carril, sin fabricar un fix ni crear artefactos por su cuenta. Fallo: parchea de memoria un síntoma; o crea artefactos unilateralmente; o ignora la evidencia existente.

- [ ] **Step 1**: workflow con 3 agentes Sonnet en paralelo (rutas absolutas incrustadas; sin la skill; instrucción de reportar honestamente y de NO usar `sdd-kit:*`).
- [ ] **Step 2 (verificación)**: inspeccionar el estado en disco de cada copia (¿creó carpetas/commits/ediciones?) además del autoinforme.
- [ ] **Step 3**: redactar `tests/sdd-consult-red.md` con fallos numerados, racionalizaciones citadas y positivos sin guidance. Si un fallo no se exhibe → se marca con procedencia (Art. I), no se inventa la guidance.

### Task 3 — Escribir la skill dirigida a los fallos del RED

**Ficheros**: `skills/sdd-consult/SKILL.md`.

- [ ] **Step 1**: frontmatter (`name: sdd-consult`; `description` solo-cuándo-usar, con los "no" — implementar→task, bug determinista→hotfix, investigar fallo→systematic-debugging).
- [ ] **Step 2**: cuerpo — overview del anti-carril; checklist ligero (primar contexto proporcional; responder distinguiendo doc de inferencia; cero artefactos; salida durable con aprobación; handoff anunciado); red flags + tabla de racionalizaciones construidas con las frases del RED; receta positiva de "buena respuesta de consulta".
- [ ] **Step 3 (verificación)**: relectura — `description` no resume el workflow; guidance mapea 1:1 con los fallos del RED.

### Task 4 — GREEN: re-verificación + REFACTOR (workflow)

**Ficheros**: `tests/sdd-consult-green.md`.

- [ ] **Step 1**: workflow con los 3 escenarios, prompts idénticos al RED, con la skill cargada por ruta.
- [ ] **Step 2 (verificación)**: estado en disco de cada copia (cero artefactos donde no debe haberlos; handoff anunciado en S3).
- [ ] **Step 3**: si aparece un hueco → REFACTOR de la skill + re-run del escenario afectado sobre copia fresca.
- [ ] **Step 4**: redactar `tests/sdd-consult-green.md` con veredicto por fallo del RED + REFACTOR documentado.
- [ ] **Step 5 (commit)**: `feat(skills): sdd-consult — carril de consulta con contexto, validado con RED/GREEN` (skill + ambas evidencias).

### Task 5 — Integración documental

**Ficheros**: `mission.md`, `architecture.md`, `README.md`, `CLAUDE.md`.

- [ ] **Step 1**: mission (carril consult en el dominio, como cuarto carril junto a task/hotfix/release); architecture (árbol); README (fila de catálogo); CLAUDE.md (11 skills).
- [ ] **Step 2 (verificación)**: Grep de recuentos obsoletos ("10 skills", "9 skills de proceso") sin restos incorrectos.
- [ ] **Step 3 (commit)**: `docs(sdd): integración de sdd-consult en los documentos de anclaje` (incluye spec/plan/tasks).

### Task 6 — Cierre

- [ ] `sdd-end-task`: walkthrough (con tiempo real), estimation-log, changelog vía `add-to-changelog`, roadmap, revisión de skills.

---

## Estimación y esfuerzo

- Tipo: docs (skill + evidencia + integración)
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 2,5h (rango 2–3,5h)
- Base de la estimación: 6 tasks; una sola skill (la mitad de alcance que la task del carril release: 2 skills + 2 plantillas + fuente única). Referencia directa en el estimation-log: `release-skills` (docs, RED/GREEN orquestado, ratio real/estimado 0,38). Aplicando ese factor, real esperable ~1h.
- Confianza: media-alta (referencia directa y patrón ya rodado).

---

## 3. Validación final

- [ ] Criterios de éxito de la spec §2 uno a uno.
- [ ] Working tree limpio, commits según Art. VI.
- [ ] Cierre vía `sdd-end-task` (Task 6).

---

## 4. Self-review (cobertura spec → tasks)

- Skill con la anatomía del kit (spec §2.1, §4.1) → Task 3. ✓
- Ciclo RED→GREEN (spec §2.2, §4.4) → Tasks 1, 2, 4. ✓
- Los 4 fallos a prevenir (spec §4.3) → escenarios S1–S3 (Task 2). ✓
- Integración documental (spec §2.3) → Task 5. ✓
- Sin `sdd-end-consult` ni plantillas (spec §2.4) → N/A confirmado (no hay task que las cree). ✓
- Corte de release v0.3.0 → N/A (NO objetivo, spec §2). ✓
