---
id: 20260922-083703-task-0013-postponed-anchor
task: 0013
title: Plan de implementación — Anclaje pospuesto sin vía de retorno
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Anclaje pospuesto sin vía de retorno

## Decisiones que he tomado yo — valida estas

1. **Tres tasks**: plantillas (T1), consumidores de las plantillas (T2) y GREEN (T3). La enmienda estimaba unas 5; al trazar los ficheros, las siete plantillas son un solo entregable que revisar junto (comparten forma y reglas), y los cuatro consumidores otro.
2. **T1 y T2 en línea**, en el hilo principal, con Opus. Motivo: es texto de skills cuya forma sale del RED y de dos tickets de campo que el hilo ya tiene cargados, y un encargo tendría que reproducir todo ese contexto. Por ser en línea, el cierre exige `requesting-code-review` (paso 9 de `sdd-end-task`): un revisor Sonnet, effort medio, con las Restricciones globales al principio del encargo.
3. **Tests RED de T1 y T2 los escribe el hilo antes de implementar**: `tests/AnchorTemplates.Tests.ps1` (Pester), uno por THEN estructural. Las conductas (THEN de cierre y de init) las mide el GREEN con sujetos, no Pester.
4. **GREEN (T3)**: 6 sujetos Sonnet headless, 2 a la vez: E1b y E2 repetidos sobre el kit nuevo y E3, un greenfield con las respuestas de la entrevista en la petición. Coste estimado: 6–9 $.
5. **Validación**: el dev-lead avisó de que el kit solo se valora con el uso diario. Previsión: validación diferida a la primera init o task con el kit 1.2.0, como las 0003, 0004 y 0008.

**Goal**: siete plantillas de documentos SDD en `sdd-templates`, calcadas por las dos init y por el cierre cuando falta un destino, que además lo dice.

**Architecture**: la forma vive en la fuente única de plantillas. `estructura.md` (greenfield), `generacion.md` (brownfield) y `aprendizajes-skills.md` (cierre) nombran la plantilla en el punto de uso, y `nombrado.md` dice de dónde sale la forma de `architecture.md`.

**Tech Stack**: Markdown (skills y plantillas) y Pester ≥ 5 en pwsh 7 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`).

**Spec**: `./spec.md`

## Restricciones globales

- Siete plantillas, ni una más: `mission-template.md`, `constitution-template.md`, `tech-stack-template.md`, `architecture-template.md`, `roadmap-template.md`, `estimation-template.md`, `changelog-template.md`. Sin plantilla de `sdd-kit.json` ni de `estimation-log.md`.
- Ninguna plantilla copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto. Sin nombres de proyectos reales.
- Las tablas y cabeceras que leen otras skills van literales: tabla de patches `| Fecha | Id | Descripción |`, sección `## Backlog`, tabla de deuda técnica, `## [Unreleased]` en el changelog, sección «Reglas de producto» con las cinco reglas por nombre (Dónde viven los datos · Idioma de los nombres · Límites · Avisos · Regla ante conflicto).
- Art. I: ninguna edición de skill sin RED→GREEN documentado en `tests/`. Art. III: texto humano en castellano con tildes; nombres de fichero en inglés kebab-case. Art. VI: commits con tipo/scope en inglés y título y cuerpo en castellano. Art. VIII: las plantillas viven solo en `skills/sdd-templates/templates/`.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible. **Sin comentarios que citen documentos** (constitution, spec, task, requisito, `capabilities/`). Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. El revisor marca el incumplimiento como Important.
- Política de modelos (Art. IV): modelo y effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos por defecto. Modo por defecto: `subagent-driven-development`; esta task declara T1 y T2 en línea (decisión 2).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una plantilla por documento y una línea por consumidor; sin script ni validador nuevo.
- [x] **YAGNI gate**: nada se abstrae; `sdd-kit.json` y `estimation-log.md` quedan fuera.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en T3), VIII (fuente única), III y X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/{mission,constitution,tech-stack,architecture,roadmap,estimation,changelog}-template.md` — forma de cada documento.
- `tests/AnchorTemplates.Tests.ps1` — contrato estructural de las plantillas y de sus consumidores.
- `tests/postponed-anchor-red.md` y `tests/postponed-anchor-green.md` — evidencia (Art. I), con enlaces a `red/` y `green/` de esta carpeta.

**Modificar**:

- `skills/sdd-templates/SKILL.md` — siete filas en el índice.
- `README.md` — recuento «Las 20 plantillas canónicas».
- `skills/sdd-end-task/references/aprendizajes-skills.md` — paso 4: destino que falta.
- `skills/sdd-start-task/references/nombrado.md` — fila de `architecture.md`.
- `skills/sdd-init-greenfield/references/estructura.md` y `skills/sdd-init-greenfield/SKILL.md` (paso 3: «NO copiar plantillas» pasa a distinguir calcar de copiar).
- `skills/sdd-init-brownfield/references/generacion.md` — pasos 3 y 5.
- `.docs/sdd/capabilities/` — no se toca aquí: la fusión es del cierre.

**NO se tocan**:

- `skills/sdd-consult/` — decisión 5 de la spec.
- `skills/sdd-end-release/` y `skills/sdd-start-release/` — leen el roadmap; la plantilla copia lo que leen, no al revés.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una plantilla fija una columna distinta de la que lee una skill | Media | Alto | T1 lee cada skill consumidora antes de escribir y Pester comprueba las cabeceras literales |
| El GREEN de init no carga la skill o se para en la entrevista | Media | Medio | Respuestas de la entrevista en la petición y «toma tú las decisiones»; comprobar en el stream que cargó `sdd-init-greenfield` |

### 1.8 Rollout

Directo: entra en la 1.2.0. No cambia la estructura de `.docs/sdd/` de un proyecto existente, así que no hace falta migración (Art. V).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Siete plantillas de documentos SDD

**Modelo**: Opus (hilo principal), effort de la sesión.
**Ejecución**: en línea — la forma sale del RED y de los tickets de campo que el hilo tiene cargados.
**Tests RED**: hilo principal · `tests/AnchorTemplates.Tests.ps1` (bloque «Plantillas de anclaje»), escritos y en rojo antes de crear las plantillas.

- [ ] **Step 1: Tests RED** — cada una de las siete existe y está en el índice; roadmap con `## Backlog`, `## Deuda técnica` y `| Fecha | Id | Descripción |`; changelog con `## [Unreleased]`; constitution con las cinco reglas por nombre; estimation con una sección de calibración vacía; ninguna nombra un proyecto real ni el kit como ejemplo. Ejecutar: fallan.
- [ ] **Step 2: Leer a los consumidores** — `sdd-end-patch`, `sdd-start-release` (+ `roadmap-fuente.md`), `sdd-end-release/references/notas-y-roadmap.md`, `add-to-changelog`, `sdd-end-task`, `estimation.md` de `sdd-end-task`, las dos init. Anotar qué sección o columna lee cada una.
- [ ] **Step 3: Escribir las siete plantillas**, más el índice y el recuento del README.
- [ ] **Step 4: Suite** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: verde.
- [ ] **Step 5: Commit** — `feat(sdd-templates): plantillas de los documentos de anclaje`.

### Task 2 — Consumidores: cierre, nombrado e init

**Modelo**: Opus (hilo principal), effort de la sesión.
**Ejecución**: en línea — mismo motivo que T1.
**Tests RED**: hilo principal · `tests/AnchorTemplates.Tests.ps1` (bloque «Consumidores»): `aprendizajes-skills.md` nombra la plantilla cuando falta el destino y exige decirlo en el informe; `nombrado.md` enlaza `architecture-template.md`; `estructura.md` y `generacion.md` nombran las siete plantillas.

- [ ] **Step 1: Tests RED** — escribirlos y verlos fallar.
- [ ] **Step 2: Editar** los cuatro ficheros y el paso 3 de greenfield.
- [ ] **Step 3: Suite** en verde.
- [ ] **Step 4: Commit** — `feat(sdd-end-task): el destino que falta se calca de su plantilla y se avisa`.

### Task 3 — GREEN

**Modelo**: sujetos Sonnet headless, effort por defecto del lanzador (el del RED, para comparar).
**Ejecución**: en línea — la campaña la lanza el hilo principal.
**Tests RED**: N/A (la campaña es la verificación).

- [ ] **Step 1**: copia limpia del kit de la rama tras T2.
- [ ] **Step 2**: E1b y E2 con los mismos moldes, lanzador y turnos que el RED; E3 greenfield con molde vacío y respuestas de la entrevista en la petición. 2 sujetos por escenario, 2 a la vez.
- [ ] **Step 3**: veredicto por THEN en `green/README.md` y en `tests/postponed-anchor-green.md`; `tests/postponed-anchor-red.md` con el resumen del RED. Si falla algún THEN: REFACTOR y rerun del escenario.
- [ ] **Step 4: Commit** — `test(sdd-kit): GREEN de la task 0013`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h (RED incluido)
- Estimación de implementación: 3 h (T1 1,5 h · T2 0,5 h · T3 1 h)
- Base de la estimación: siete plantillas de prosa con formato fijado por los consumidores; referencia, 0002 (skill nueva + plantilla, M)
- Confianza: media

---

## 3. Validación final

- [ ] Suite Pester verde
- [ ] GREEN: cada THEN de la spec con veredicto
- [ ] Code-review (`requesting-code-review`) por ir en línea
- [ ] Presentación al dev-lead y cierre con `sdd-end-task`

## 4. Self-review (cobertura spec → tasks)

- Un aprendizaje sin destino no se redirige en silencio → T2 (texto) + T3 (E1b). ✓
- Un documento de anclaje que falta se calca de su plantilla → T1 (plantillas) + T2 (`nombrado.md`) + T3 (E2). ✓
- La init calca cada documento de su plantilla → T1 + T2 (`estructura.md`, `generacion.md`) + T3 (E3; brownfield por lectura). ✓
- Deuda saldada (`estimation-template`, A2) → T1; filas del roadmap, al cierre. ✓
