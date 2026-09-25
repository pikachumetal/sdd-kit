---
id: 20260925-180228-feature-0074-using-sdd
feature: 0074
title: Plan de implementación — Skill using-sdd, la puerta de entrada al kit
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Skill using-sdd, la puerta de entrada al kit

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** — tres tasks encadenadas: el hook lee la skill de la Task 1, y el GREEN de la Task 3 necesita las dos anteriores. Un error aquí es barato de ver en el GREEN, así que no compensa un revisor por task. Revisión final de rama con Opus y effort high (`sdd-kit:effort-high`).
2. **Modelo de la sesión** — Opus 5.5, porque el dev-lead aprobó la spec sin la parada para bajar de modelo. Queda registrado para el walkthrough.
3. **Los literales de la 0074 van en un solo test nuevo, `tests/UsingSdd.Tests.ps1`**, y `Hook.Tests.ps1` solo cambia lo que nombraba el router: así el diff no pisa tests que puedan tocar la 0078 o la 0036.
4. **Tope de la skill: 450 palabras**, que comprueba el test. Se carga en cada sesión, y `using-superpowers` tiene 485.
5. **Coste** — ~1,5 h. GREEN: 28 sujetos Sonnet, ~4,5 $, dentro del techo de 50 sujetos y 18 $ (RED: 18 y 2,88 $). Revisión final: ~100k tokens de Opus.

**Goal**: sustituir `hooks/router.md` por la skill `using-sdd`, que el hook inyecta, y cerrar los tres fallos del RED.

**Architecture**: la skill es la única fuente de las puertas. `hooks/session-start` inyecta su `SKILL.md` entero, como hace superpowers con `using-superpowers`. Dos `description` de skills de entrada cambian. El cuerpo de ninguna cambia.

**Tech Stack**: Markdown (skills), bash (hook), Pester 5 con `pwsh` 7 (tests) y el lanzador headless de `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks dependen una de otra y el GREEN valida el conjunto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor (task 0021, decisión del dev-lead, 2026-09-22).
- Sin números de tamaño en `using-sdd`: «algo grande» remite al criterio de partir del paso 2 de `sdd-start-feature`.
- De las skills de entrada solo se toca la `description` del frontmatter, nunca el cuerpo.
- `hooks/session-start` se guarda con LF y sigue siendo ejecutable (`100755`).

### De proceso

- Política de modelos de la constitution (Art. IV): modelo y effort explícitos al despachar; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un `cat` de la skill en el hook, sin plantillas ni parsers.
- [x] **YAGNI gate**: sin `.codex-plugin/` ni migración.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 3), Art. V (sin migración: nada se escribe en el consumidor), Art. IX (la skill cita a superpowers, no lo copia).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/using-sdd/SKILL.md` — la puerta de entrada.
- `tests/UsingSdd.Tests.ps1` — literales de la 0074.
- `tests/using-sdd-green.md` — evidencia GREEN.

**Modificar**:

- `hooks/session-start` — inyecta la skill.
- `tests/Hook.Tests.ps1`, `tests/FeatureRename.Tests.ps1`, `tests/PlanEntry.Tests.ps1` — de `hooks/router.md` a `skills/using-sdd/SKILL.md`.
- `skills/sdd-config/SKILL.md`, `skills/sdd-roadmap/SKILL.md` — solo la `description`.
- `README.md`, `CLAUDE.md`, `.docs/sdd/architecture.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/roadmap.md` (fila de deuda de Codex).

**Borrar**: `hooks/router.md`.

**NO se tocan**:

- Cuerpo de `sdd-start-feature`, `sdd-roadmap` y demás skills de entrada — van en paralelo la 0078 (paso 2) y la 0036 (paso 7).
- `skills/sdd-init-brownfield/references/migrations/` — no hay nada que migrar.

### 1.6 Dependencias

- superpowers 6.4.1 (medido en el RED con él).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La skill larga compite peor que el router corto | media | alto | tope de 450 palabras; el GREEN repite los 11 aciertos del RED como control |
| La 0078 o la 0036 tocan los mismos tests | baja | medio | literales nuevos en un fichero propio; cruzar la base antes de cada task |

### 1.8 Rollout

Directo: sale con la 2.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Skill `using-sdd` y el hook que la inyecta

**Modelo**: la sesión (Native), Opus 5.5 con el effort de la sesión.
**Tests RED**: hilo principal · `tests/UsingSdd.Tests.ps1` y los cambios en `tests/Hook.Tests.ps1`, `tests/FeatureRename.Tests.ps1` y `tests/PlanEntry.Tests.ps1`, antes del código.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/UsingSdd.Tests.ps1,tests/Hook.Tests.ps1,tests/FeatureRename.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/Skills.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: sí: al abrir una sesión en un proyecto con `.docs/sdd/`, el contexto de arranque lleva el texto de `using-sdd`, que nombra `sdd-config` y `sdd-roadmap`.

**Interfaces**:
- Consume: nada.
- Produce: `skills/using-sdd/SKILL.md` con `name: using-sdd`; la salida del hook, `hookSpecificOutput.additionalContext`, lleva ese fichero entero.

**Ficheros**: crear `skills/using-sdd/SKILL.md`, `tests/UsingSdd.Tests.ps1`; modificar `hooks/session-start`, `tests/Hook.Tests.ps1`, `tests/FeatureRename.Tests.ps1`, `tests/PlanEntry.Tests.ps1`; borrar `hooks/router.md`.

- [ ] **Step 1: Tests RED**. `tests/UsingSdd.Tests.ps1` comprueba que:
  - la skill existe y tiene como máximo 450 palabras;
  - nombra las ocho puertas `sdd-kit:sdd-init-greenfield`, `sdd-kit:sdd-init-brownfield`, `sdd-kit:sdd-consult`, `sdd-kit:sdd-roadmap`, `sdd-kit:sdd-start-feature`, `sdd-kit:sdd-start-patch`, `sdd-kit:sdd-end-release` y `sdd-kit:sdd-config`;
  - remite al criterio de partir de `sdd-start-feature` sin ningún dígito en la fila de la puerta grande;
  - lleva la regla de duda («una sola pregunta») y la precedencia sobre `brainstorming`;
  - `hooks/router.md` no existe.

  En `Hook.Tests.ps1`, el `Describe 'hooks/router.md'` se va, y «inyecta el router» pasa a «inyecta using-sdd», que exige `name: using-sdd`, `sdd-kit:sdd-config` y `sdd-kit:sdd-roadmap` en `additionalContext`. En `FeatureRename` y `PlanEntry`, `hooks/router.md` pasa a `skills/using-sdd/SKILL.md`. Se ejecuta y falla.
- [ ] **Step 2: Implementación**. Escribir la skill con la tabla de puertas, la regla de duda, la precedencia y la tabla de racionalizaciones con las frases del RED (s1, r3, d1). En `session-start`, cambiar `cat "${SCRIPT_DIR}/router.md"` por `cat "${SCRIPT_DIR}/../skills/using-sdd/SKILL.md"`, con la variable `doors`. `git rm hooks/router.md`.
- [ ] **Step 3: Verificación**. La de arriba, en verde. Comprobar `git ls-files -s hooks/session-start` → `100755`.
- [ ] **Step 4: Commit de la task**. `feat(using-sdd): skill de entrada al kit que inyecta el hook de sesión`.

### Task 2 — `description` de `sdd-config` y `sdd-roadmap`

**Modelo**: la sesión (Native), Opus 5.5 con el effort de la sesión.
**Tests RED**: hilo principal · dos `It` más en `tests/UsingSdd.Tests.ps1`.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/UsingSdd.Tests.ps1,tests/Skills.Tests.ps1,tests/PlanEntry.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: sí: con «No me gusta que me pares tanto» se invoca `sdd-config`; se mide en la Task 3.

**Interfaces**:
- Consume: nada.
- Produce: las dos `description`, que la Task 3 mide.

**Ficheros**: modificar el frontmatter de `skills/sdd-config/SKILL.md` y `skills/sdd-roadmap/SKILL.md`.

- [ ] **Step 1: Tests RED**. `sdd-config` lleva «me paras mucho» y «menos preguntas»; `sdd-roadmap` lleva «asignado». Ejecutar: falla.
- [ ] **Step 2: Implementación**. `sdd-config`: añadir a las frases «"me paras mucho", "quiero menos preguntas", cómo trabajas conmigo». `sdd-roadmap`: «items del gestor (Azure DevOps, Jira), también los que te han asignado para hacerlos». Cada una ≤ 1024 caracteres y sin tocar nada fuera del frontmatter.
- [ ] **Step 3: Verificación**. La de arriba, en verde; `git diff` de los dos ficheros solo en la línea `description`.
- [ ] **Step 4: Commit de la task**. `feat(routing): frases de preferencias y de items asignados en las description`.

### Task 3 — GREEN y documentación

**Modelo**: la sesión (Native) para lanzar y leer; sujetos Sonnet por `claude -p`.
**Tests RED**: no aplica: esta task es el GREEN de las anteriores.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Skills.Tests.ps1,tests/WorkflowDocs.Tests.ps1 -Output Detailed"` y la campaña, con techo de 50 sujetos y 18 $.
**Se prueba en la aplicación**: sí: las 14 frases del RED, dos sujetos cada una, con el kit de la rama.

**Interfaces**:
- Consume: `red/subject.sh`, `tests/headless/run.sh` con `SUPERPOWERS_DIR`, y el kit de la rama tras la Task 2.
- Produce: `tests/using-sdd-green.md`.

**Ficheros**: crear `tests/using-sdd-green.md`; modificar `README.md`, `CLAUDE.md`, `.docs/sdd/architecture.md`, `.docs/sdd/tech-stack.md` y `.docs/sdd/roadmap.md`.

- [ ] **Step 1: Campaña**. `git archive HEAD` al scratchpad (`kit-green`) y `run.sh` con `PHASE=green`, `SCENARIOS="i1 c1 r1 r2 r3 r4 f1 f2 f3 p1 e1 s1 d1 t1"`, primero `SUBJECT=1` y luego `SUBJECT=2`, con `SUBJECT_CAP=50 COST_CAP=18` y `SUPERPOWERS_DIR` de superpowers 6.4.1.
- [ ] **Step 2: Evidencia**. `tests/using-sdd-green.md`, con la misma tabla que el RED y el veredicto por fallo y por control. Si un fallo sigue, se hace una ronda de REFACTOR dentro del techo, y si no cabe, para.
- [ ] **Step 3: Docs**. README: fila de `using-sdd` en el catálogo y «Enrutado automático» reescrito. `CLAUDE.md`: 14 skills. `architecture.md`: la skill en el árbol y `hooks/` sin `router.md`. `tech-stack.md`: cómo repetir la batería en cada release (`red/subject.sh` con `SUPERPOWERS_DIR`). `roadmap.md`: fila de deuda de Codex reescrita (queda `.codex-plugin/` y su RED).
- [ ] **Step 4: Commit de la task**. `test(using-sdd): GREEN de la batería de puertas y documentación`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 1,5h
- Base de la estimación: 3 tasks, una de ellas una campaña de 28 sujetos; referencia, 0014 (L) y 0073 (S–M)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"`
- [ ] Los cinco requisitos del delta de `routing` en verde en el GREEN
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El router solo existe donde hay SDD» → Task 1 (test del hook). ✓
- ADDED «Una preferencia de cómo trabajar entra por `sdd-config`» → Tasks 1 y 2, medido en la Task 3 (s1). ✓
- ADDED «Los items asignados del gestor entran por `sdd-roadmap`» → Tasks 1 y 2, medido en la Task 3 (r3). ✓
- ADDED «Algo grande entra por `sdd-roadmap`» → Task 1, medido en la Task 3 (r1). ✓
- ADDED «Una petición vaga se pregunta antes de elegir puerta» → Task 1, medido en la Task 3 (d1). ✓
- `SUPERPOWERS_DIR` en el lanzador → hecho en la apertura, con su test (`HeadlessLauncher.Tests.ps1`). ✓
- Sin migración ni `.codex-plugin/` → N/A (confirmado en spec). ✓
