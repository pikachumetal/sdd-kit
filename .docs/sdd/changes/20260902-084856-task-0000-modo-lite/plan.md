---
id: 20260902-084856-task-0000-modo-lite
task: 0000
title: Plan de implementación — Modo lite del carril task
spec: ./spec.md
status: approved
created: 2026-09-02
---

# Plan de implementación — Modo lite del carril task

**Goal**: añadir el modo lite al carril task (spec corta, sin `plan.md`, habilitado por predicado observable y confirmado por el usuario) y blindar el kit contra la clasificación de `brainstorming` de superpowers 6.3.0.

**Architecture**: cambio de contenido en tres skills y una plantilla, sin skills nuevas ni prefijos de carpeta nuevos. El modo se decide en el paso 2 de `sdd-start-task` (donde el enrutado ya vive), se marca con `mode:` en el frontmatter de `spec.md` y lo lee `sdd-end-task` al cerrar. La verificación sigue el Art. I: RED antes de escribir guidance, GREEN sobre los mismos escenarios.

**Tech Stack**: Markdown puro (SKILL.md con frontmatter YAML + plantillas). Sin build, sin CI, sin tests automáticos. La verificación es narrativa verificada en disco (`tests/*.md`), con subagentes sobre fixtures desechables en el scratchpad de sesión.

**Spec**: `./spec.md`

## Global Constraints

- Art. I — toda edición de skill exige ciclo RED→GREEN documentado en `tests/`. El RED se ejecuta ANTES de escribir la guidance.
- Art. II — el modo lite es comportamiento condicional → predicado observable, nunca cláusula de excepción. El fallo es de disciplina → prohibición + racionalizaciones + red flags.
- Art. III — castellano con ortografía correcta; nombres de fichero en inglés kebab-case.
- Art. IV — el naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` NO se toca. Lite es un modo de `task-`.
- Art. VIII — plantilla única con marcadores. No se crea `spec-lite-template.md`.
- Ejecución en línea con checkpoints (`superpowers:executing-plans`). El kit excluye `subagent-driven-development` para su propio flujo; los subagentes aparecen solo como sujeto de prueba en las tasks 1 y 5.
- Molde de fixture SIN `.git`: el `git init` se hace en la copia por run.
- Prompt de baseline **neutro**: no telegrafiar la conducta correcta. La conducta se infiere del log de acciones y se verifica en disco.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? Sí se evaluó: modo en vez de carril nuevo, plantilla única en vez de duplicada, override formulado sobre efectos en vez de sobre los nombres de superpowers.
- [ ] **YAGNI gate**: el campo `mode` tiene dos usos reales (lo escribe `sdd-start-task`, lo lee `sdd-end-task`). El predicado tiene cinco condiciones, todas derivadas de fallos concretos, ninguna especulativa.
- [ ] **Brownfield gate**: se respeta la estructura de las skills existentes (overview → gates → predicados → red flags). Sin refactor oportunista: no se recorta `sdd-start-task` (ítem 3 del roadmap, ciclo propio).
- [ ] **Constitution check**: Art. I, II, III, IV, V, VII y VIII revisados en la spec §7.1.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-start-task-lite-red.md` — evidencia del baseline sin guidance: qué hizo, con racionalizaciones citadas textualmente.
- `tests/sdd-start-task-lite-green.md` — mismos escenarios con guidance, veredicto contra cada fallo del RED.

**Modificar**:

- `skills/sdd-start-task/SKILL.md` — tercera salida en el enrutado, predicado del modo lite, ratchet, fila nueva en overrides, red flags y racionalizaciones.
- `skills/sdd-end-task/SKILL.md` — lee `mode:` y adapta el cierre.
- `skills/sdd-templates/templates/spec-template.md` — campo `mode:` en frontmatter, marcadores de sección por modo, bloque de estimación para lite.
- `skills/sdd-templates/SKILL.md` — el índice explica cómo se calca la spec en cada modo.
- `.docs/sdd/mission.md` — glosario: "modo lite" como variante del carril task.

**NO se tocan**:

- `skills/sdd-start-patch/SKILL.md` y `skills/sdd-end-patch/SKILL.md` — el carril patch no cambia; lite no lo invade (spec §3, alternativa descartada).
- `skills/sdd-templates/templates/plan-template.md` — el bloque de estimación se **copia** a la spec para el modo lite; el plan conserva el suyo para el modo completo.
- `.docs/sdd/constitution.md` — no se cambia ninguna convención del Art. IV.
- Las otras 7 skills del kit — no participan del enrutado de modo.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

Las cinco specs existentes en `.docs/sdd/specs/` no llevan `mode:`. `sdd-end-task` trata la ausencia del campo como `full` (retrocompatible por defecto, criterio brownfield del kit). No se editan retroactivamente.

### 1.4 Contratos API

No aplica.

---

## 2. Tasks

> Verificación: el kit no tiene build ni tests automáticos (`tech-stack.md`). La verificación por task
> es estructural y en disco; la verificación de comportamiento es el GREEN de la Task 5.

### Task 1 — RED: baseline sin guidance

**Ficheros**: crear `tests/sdd-start-task-lite-red.md`

Se ejecuta con el kit en su estado ACTUAL (sin nada de las tasks 2–4). Requiere subagentes: pedir confirmación de modelo al usuario antes de lanzar (guía del equipo: justificar modelo y confirmar antes de paralelizar). Propuesta: **Sonnet**, que es el modelo con el que se validaron los RED/GREEN anteriores del kit.

- [ ] **Step 1: Montar el molde de fixture** — proyecto "Bookline" en el scratchpad de sesión, **sin `.git`**: `.docs/sdd/` con `constitution.md`, `mission.md`, `tech-stack.md`, `roadmap.md` y `estimation.md` (mínimos pero coherentes), más un módulo de código con un flujo de listado ya existente y legible.
- [ ] **Step 2: Copia por run + git** — una copia del molde por escenario; `git init` + commit inicial dentro de la copia.
- [ ] **Step 3: Escenario E1 (cumple el predicado)** — prompt neutro al subagente: *"Añade un filtro por estado a la pantalla de listado de pedidos"*, con el kit instalado y `sdd-start-task` disponible. Sin pistas sobre gates, artefactos ni lo que se espera que lea.
- [ ] **Step 4: Escenario E2 (no cumple, con presión)** — prompt neutro: *"Cambia el formato del identificador de pedido en la API y migra los existentes. El cliente lo espera hoy."* Toca contrato público y exige migración: dos condiciones del predicado incumplidas.
- [ ] **Step 5: Verificar en disco** — no fiarse del autoinforme del subagente: comprobar qué ficheros existen realmente en cada copia (`spec.md`, `plan.md`, carpeta con naming correcto) y con qué contenido.
- [ ] **Step 6: Documentar el RED** — `tests/sdd-start-task-lite-red.md` con los fallos observados y las racionalizaciones **citadas textualmente** del log del subagente, más los positivos que NO requieren guidance.
- [ ] **Step 7: Decisión de alcance** — si algún escenario sale limpio, el Art. I manda recortar: esa guidance no se escribe. Registrar la decisión en el propio RED y avisar al usuario antes de seguir.
- [ ] **Step 8: Commit** — `test(task): RED del modo lite del carril task`

### Task 2 — Guidance del modo lite en `sdd-start-task`

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `.docs/sdd/mission.md`

Solo se escribe la guidance que repare un fallo exhibido en la Task 1.

- [ ] **Step 1: Tercera salida en el enrutado (paso 2)** — hoy el paso 2 solo distingue task de patch. Pasa a distinguir tres: patch (bug determinista), task lite (cumple el predicado) y task completa. El texto nombra las cinco condiciones de la spec §4.1 y deja explícito que cumplirlas habilita el modo pero no lo activa: lo activa la confirmación del usuario.
- [ ] **Step 2: Ratchet** — párrafo corto: si al implementar cae cualquier condición, la task sube a modo completo y se escribe el `plan.md` que faltaba con su gate. Nunca al revés.
- [ ] **Step 3: Fila nueva en "Overrides sobre superpowers"** — con el texto de la spec §4.3, formulado sobre qué artefactos manda el kit y no sobre los nombres de los caminos de superpowers.
- [ ] **Step 4: Red flags y racionalizaciones** — construidas con las frases textuales del RED, no inventadas. Como mínimo cubren: proponer lite sin citar las condiciones, tratar el silencio del usuario como confirmación, y usar la presión de calendario como si fuera una condición del predicado.
- [ ] **Step 5: Glosario en `mission.md`** — "modo lite" como variante del carril task, con una frase que deje claro que no es un carril nuevo (no tiene skills propias ni prefijo de carpeta).
- [ ] **Step 6: Verificación estructural** — el frontmatter sigue siendo válido; la skill sigue apareciendo en el listado; no se ha duplicado ninguna plantilla; el naming del Art. IV no aparece modificado en ningún punto del fichero.
- [ ] **Step 7: Commit** — `feat(skills): sdd-start-task - modo lite y override de la clasificación de brainstorming`

### Task 3 — Plantilla de spec con marcadores de modo

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-templates/SKILL.md`

- [ ] **Step 1: Campo `mode` en el frontmatter** — `mode: full | lite`, con comentario de una línea sobre para qué sirve (lo lee `sdd-end-task`).
- [ ] **Step 2: Marcadores de sección** — cada sección que el modo lite omite se marca de forma visible y uniforme. Conservadas en lite: Contexto, Objetivo, Decisión clave, Especificación funcional, Estimación y esfuerzo, Aprobaciones. Omitidas: Datos, UX, Constraints técnicos, Riesgos, Rollout, Open questions.
- [ ] **Step 3: Bloque de estimación para lite** — copiar el bloque "Estimación y esfuerzo" de `plan-template.md`, marcado como obligatorio en modo lite cuando existe `.docs/sdd/estimation.md`. El de `plan-template.md` se queda donde está para el modo completo.
- [ ] **Step 4: Índice de `sdd-templates`** — explicar que la spec se calca de la misma plantilla en ambos modos, y que en lite se borran las secciones marcadas. Reiterar que no existe ni debe crearse `spec-lite-template.md` (Art. VIII).
- [ ] **Step 5: Verificación estructural** — `ls skills/sdd-templates/templates/` sigue mostrando 9 plantillas, ninguna nueva; el frontmatter de ejemplo parsea como YAML.
- [ ] **Step 6: Commit** — `feat(templates): spec-template - modo lite con marcadores de sección y estimación`

### Task 4 — Cierre consciente del modo en `sdd-end-task`

**Ficheros**: modificar `skills/sdd-end-task/SKILL.md`

**Interfaces**: consume el campo `mode:` que la Task 3 define en el frontmatter de `spec.md`.

- [ ] **Step 1: Lectura del modo** — el checklist de cierre lee `mode:` de `spec.md`. Ausencia del campo = `full` (las cinco specs previas no lo llevan).
- [ ] **Step 2: Adaptación del cierre** — en modo lite no se reclama `plan.md` ni `tasks.md`. Todo lo demás se conserva idéntico: smoke ejecutado y documentado, `walkthrough.md` con tiempo real, entrada de changelog, fila del estimation-log.
- [ ] **Step 3: Red flag** — cerrar una task lite sin smoke o con el tiempo en blanco sigue prohibido. El modo abarata los artefactos de planificación, nunca la verificación.
- [ ] **Step 4: Verificación estructural** — frontmatter válido; el checklist de cierre no ha perdido ningún paso en el modo completo.
- [ ] **Step 5: Commit** — `feat(skills): sdd-end-task - cierre consciente del modo lite`

### Task 5 — GREEN: verificación de la guidance

**Ficheros**: crear `tests/sdd-start-task-lite-green.md`

Mismos escenarios de la Task 1, con las tasks 2–4 aplicadas. Mismo modelo que el RED.

- [ ] **Step 1: Copias limpias del molde** — una por escenario, con el kit ya modificado.
- [ ] **Step 2: Re-ejecutar E1 y E2** — prompts idénticos a los del RED, palabra por palabra. Cambiarlos invalidaría la comparación.
- [ ] **Step 3: Verificar en disco** — E1: existe `spec.md` con `mode: lite`, no existe `plan.md`, y el agente pidió confirmación antes de omitirlo. E2: existe `spec.md` con `mode: full` y `plan.md`, sin degradación por la presión de calendario.
- [ ] **Step 4: Veredicto por fallo** — una entrada por cada fallo del RED, con su veredicto. Si el GREEN destapa un hueco de la propia guidance, el REFACTOR y su re-verificación se documentan en este mismo fichero.
- [ ] **Step 5: Commit** — `test(task): GREEN del modo lite del carril task`

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 3h
- Base de la estimación: 5 tasks, dos rondas de subagentes con dos escenarios cada una. Referencia del estimation-log: `carril-rama-worktree` (2h estimadas / 2,1h reales), que también combinó edición de skills con RED/GREEN sobre fixture; esta task toca más ficheros (4 frente a 2) y añade un campo de frontmatter con consumidor en otra skill. Incertidumbre principal: si el RED sale limpio en algún escenario, el alcance se recorta y el real baja.
- Confianza: media

---

## 3. Validación final

- [ ] Las cinco skills/plantillas modificadas conservan frontmatter válido y siguen cargando
- [ ] Criterios de éxito de la spec §2 verificados uno a uno contra el GREEN
- [ ] Ninguna plantilla duplicada; `templates/` sigue con 9 ficheros (Art. VIII)
- [ ] El naming del Art. IV intacto en todo el kit
- [ ] Cierre vía `sdd-end-task`: smoke documentado, walkthrough con tiempo real, changelog, estimation-log, roadmap

---

## 4. Self-review (cobertura spec → tasks)

- §4.1 Predicado del modo lite → Task 2, Step 1. ✓
- §4.2 Ratchet de una vía → Task 2, Step 2. ✓
- §4.3 Override sobre brainstorming → Task 2, Step 3. ✓
- §4.4 Artefactos por modo → Task 3 (spec y estimación) + Task 4 (cierre). ✓
- §4.5 Secciones de la spec en lite → Task 3, Step 2. ✓
- §4.6 Detección por `mode:` en frontmatter → Task 3 Step 1 (escritura) + Task 4 Step 1 (lectura). ✓
- §4.7 Flujos alternativos → Task 2, Step 4 (racionalizaciones) + Task 5, Step 3 (verificación en disco). ✓
- §2 Criterios de éxito 1–3 → Task 5, escenarios E1 y E2. ✓
- §2 Criterio de éxito 4 (cierre lite) → Task 4. ✓
- §2 Criterio de éxito 5 (RED exhibe, GREEN repara) → Tasks 1 y 5. ✓
- §7.1 Art. IV sin cambios de convención → §1.1 "NO se tocan" + Validación final. ✓
- §5 Datos, §6 UX → N/A (confirmado en spec). ✓
- NO objetivos (grilling, todos, dependencies, OpenSpec, recorte) → ninguna task los toca. ✓
