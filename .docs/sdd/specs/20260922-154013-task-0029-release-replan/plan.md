---
id: 20260922-154013-task-0029-release-replan
task: 0029
title: Plan de implementación — Replanificar la release en curso
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Replanificar la release en curso

## Decisiones que he tomado yo — valida estas

1. **Una sola task, en línea** — es una sección nueva de un `SKILL.md` y su test es el GREEN con sujetos, que ya existe: los lanzadores del RED (`red/subject.sh`, `red/subject3.sh`) se escribieron desde los THEN antes de tocar la skill, y el hilo los reutiliza sin cambios. Un implementador aparte no añade una segunda mano: el contrato ya está escrito.
2. **GREEN = los seis escenarios del RED**, con el kit modificado: r (m1), s (m2) y u (m3), dos sujetos por molde. E1 con la fila visible (r, s) se repite como control de no regresión (`tech-stack.md`: un requisito recortado se repite en el GREEN).
3. **Modelos** — sujetos: Sonnet (método de `tech-stack.md`); revisor final: Sonnet, effort high (gama media como suelo para revisores, Art. IV). Sin paralelizar implementadores.
4. **Coste estimado**: GREEN ~5 $, dentro del techo de 12 $ aprobado (RED: 5,26 $). Revisor final ~100k tokens.
5. **Perfil `delegate`**: sin gate del plan. Comprobado: cada escenario de la spec tiene su task (§4).

**Goal**: que `sdd-start-release` sepa replanificar una release en curso sin tocar tasks en marcha, sin choques de ids y publicando la reserva.

**Architecture**: sección nueva «Replanificar la release en curso» en `skills/sdd-start-release/SKILL.md`, con predicado, checklist de cuatro pasos, red flags y una racionalización. La apertura no cambia.

**Tech Stack**: Markdown de skills; verificación con sujetos headless y Pester (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`).

**Spec**: `./spec.md`

## Restricciones globales

- Art. I: ninguna edición de skill sin RED → GREEN documentado en `tests/` (`release-replan-red.md`, `release-replan-green.md`).
- Art. III: texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case.
- Art. VI: commits con tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.
- Art. X (calidad de código): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito ni `capabilities/`); Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes; el revisor marca el incumplimiento como Important.
- Política de modelos (Art. IV): modelo y effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos por defecto.
- Ejecución por defecto: `subagent-driven-development`; esta task va en línea (decisión 1).
- Rutas de evidencia ≤ 140 caracteres (test de rutas del repo).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una sección en un fichero; sin script ni referencia nueva.
- [x] **YAGNI gate**: sin sección de entrada ni cambios en `Get-NextSddId.ps1`.
- [x] **Constitution check**: Art. I (RED hecho, GREEN planificado), Art. IX (superpowers no cubre roadmaps de release).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-start-release/SKILL.md` — sección «Replanificar la release en curso».

**Crear**:

- `tests/release-replan-green.md` — evidencia GREEN.

**NO se tocan**:

- `skills/sdd-start-release/references/roadmap-fuente.md` — el camino nuevo vive en el `SKILL.md` (spec, decisión 6).
- `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `sdd-start-task`, `sdd-end-task` — ficheros de otras tasks (0009, 0015).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto commitea también otros ficheros con la reserva | media | bajo | el paso pide «solo `roadmap.md`» y el GREEN lo mira en `git show --stat` |
| El camino nuevo se aplica al abrir una release | baja | medio | predicado observable: sección de release abierta en el roadmap |
| La salida «worktree temporal» del paso 4 (rama de integración sin worktree) no tiene GREEN | media | medio | riesgo aceptado tras la revisión final (presupuesto agotado); fila de deuda en el roadmap |

### 1.8 Rollout

Directo, con la release 1.2.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Camino de replanificación en `sdd-start-release`

**Modelo**: hilo principal (Opus 5), en línea.
**Ejecución**: en línea — decisión 1.
**Tests RED**: hilo principal · lanzadores `red/subject.sh` y `red/subject3.sh`, con sus veredictos en `tests/release-replan-red.md`.

**Interfaces**:
- Consume: nada.
- Produce: sección «Replanificar la release en curso» en `skills/sdd-start-release/SKILL.md`.

**Ficheros**: modificar `skills/sdd-start-release/SKILL.md`; crear `tests/release-replan-green.md`.

- [ ] **Step 1: Implementación** — sección con predicado (sección de release abierta en el roadmap y petición de meter, partir, mover o crear tasks), cuatro pasos (estado real de la rama de integración y de cada `feature/*` · task en marcha intocable, trabajo nuevo a task nueva tras ella · id mayor que el del script y que todo id leído · commit solo de `roadmap.md` en la rama de integración antes de arrancar nada), red flags y la racionalización «el roadmap de mi worktree es el estado de la release».
- [ ] **Step 2: Build** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: 0 fallos.
- [ ] **Step 3: Verificación** — GREEN: `run.sh`, `run2.sh` y `run3.sh` con el kit modificado; veredicto por frente en `tests/release-replan-green.md`.
- [ ] **Step 4: Commit** — `feat(skills): replanificar la release en curso en sdd-start-release`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (RED incluido: tres rondas)
- Estimación de implementación: 1,5h (sección, GREEN de 6 sujetos, revisión y cierre)
- Base de la estimación: una sección de skill; referencia 0020 (S, ~3 h en total)
- Confianza: media

---

## 3. Validación final

- [ ] Suite Pester en verde
- [ ] GREEN: E1–E4 sin fallos en los seis sujetos
- [ ] Revisión final (Sonnet, effort high) con las Restricciones globales en la cabecera del encargo
- [ ] Validación del dev-lead y cierre con `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- Replanificar parte del estado real de la release → Task 1, escenario u (E1 con base vieja) y r/s (control con la fila visible). ✓
- Una task en marcha no se toca al replanificar → Task 1, escenarios s y u (E2). ✓
- Los ids nuevos no chocan con reservas de otras ramas → Task 1, escenarios r y s (E3). ✓
- La reserva se publica antes de arrancar → Task 1, los seis escenarios (E4). ✓
