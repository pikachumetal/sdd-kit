---
id: 20261019-083116-feature-0197-v3-migration
feature: 0197
title: Plan de implementación — Migración v3.0.0, los documentos a la estructura de la 3.0.0
spec: ./spec.md
status: draft
created: 2026-10-19
---

# Plan de implementación — Migración v3.0.0: los documentos a la estructura de la 3.0.0

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa (Opus 5.5). Sujetos en Sonnet y la persona en Haiku (`subject_converse`). Revisión final en ejes de `sdd-verify`: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: Native (línea de abajo).
3. **Molde propio**: `tests/batteries/sdd-upgrade/mold-v2x/`, un proyecto 2.x completo con todo lo que mide la spec. Las secciones de las plantillas 2.x salen del historial (`git show bcd4db7b~1:skills/sdd-templates/templates/…`). El molde `salas` de `using-sdd` no sirve, porque sus documentos no tienen secciones.
4. **Hoja de la persona**: `tests/batteries/sdd-upgrade/persona-v2x.md`. Aprueba cada tabla tal como viene, da `M` como Tamaño a cada fila y, a cualquier otra pregunta, «sí, como propones».
5. **Riesgo alto**: un sujeto que migra conversando puede pasar de 30 turnos. `MAX_TURNS=60` en `v1`, y la previsión (8 sujetos, ~6 $) se vigila con `COST_CAP`.
6. **Coste estimado**: ~3,5 h de implementación y ~6 $ de sujetos.
7. Review Focus: 3 entradas; ver la sección.

**Goal**: `migrations/v3.0.0.md` lleva un proyecto 2.x a la estructura de la 3.0.0 (sin textos ni marcador, que son de la 0199), `roadmap-template.md` queda deprecada y los topes vuelven.

**Architecture**: una migración de texto con pasos que siguen el patrón de la v2.3.0 (punto de partida, tabla de destinos, gate, aplicar y validar), sin código nuevo. La prueba es una batería de sujetos sobre un molde 2.x que valida `sdd roadmap check`.

**Tech Stack**: Markdown (migración y plantillas); Pester (`MigrationInitParity`, `WordBudget`); sujetos headless (`tests/headless/battery.sh`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks sobre un mismo fichero de texto, el plan cabe en un contexto, un error lo caza la campaña de la Task 2 y no hay interfaces de código entre tasks. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — cambia la estructura de documentos de los proyectos consumidores, que es un contrato que leen todas las skills y la CLI.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- `v3.0.0.md` se escribe en castellano, como las demás migraciones, con pasos que empiezan por su predicado y gates marcados **gate**.
- Literales: `**Escribe**: ``PRODUCT.md``, ``ROADMAP.md``, ``CHANGELOG.md``, ``steering/operations.md``, ``steering/debt.md``, ``steering/constitution.md``, ``steering/architecture.md``, ``steering/estimation.md``, ``steering/estimation-log.md``.`; la marca de la plantilla, «2.x, deprecada: la leen `migrations/v2.3.0.md` y los proyectos sin migrar; se borra en la 4.0.0».
- La fecha de una fila de deuda sale de `git log -S"<primeras palabras del ítem>" --format=%as --reverse -- .docs/sdd/roadmap.md`, la primera línea.

### De proceso

- Native, con `sdd-implement` y `sdd-tdd`; revisión final por ejes con `sdd-verify`.
- RED con `KIT_DIR` = `git archive e71ce503 skills .claude-plugin cli hooks` (sin `v3.0.0.md`), y `DRY_RUN=1` del molde antes del primer sujeto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

- Un proyecto 2.x sin `environments.md` ni `estimation.md` → esos pasos se saltan y lo dicen, sin crear `## Entornos` vacío ni `estimation-log.md` · Task 1, verificación de lectura de los predicados de `v3.0.0.md`.
- Una fila de deuda cuyo «Ítem» no aparece en el historial (`git log -S` vacío) → la tabla pide la fecha al dev-lead, nunca la de hoy · Task 2, el predicado de la receta, por lectura.
- `ROADMAP.md` migrado con un «Tras» a un id que no está en `CHANGELOG.md` → `—` con aviso · Task 2, `v1` (la 0022 tras la 0021 sigue en Now; el patch 0017 sale).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin código; una migración de texto y una batería.
- [x] **YAGNI gate**: el molde solo lleva lo que mide la spec.
- [x] **Brownfield gate**: los `vX.Y.Z.md` anteriores y `roadmap-template.md` no cambian de contenido.
- [x] **Constitution check**: Art. I (RED antes, previsión), Art. IV (estructura), Art. V (migración con `**Escribe**:` y «Verificación»), Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — los pasos de estructura y de roadmap de la migración.
- `tests/batteries/sdd-upgrade/mold-v2x/` — el proyecto 2.x de prueba.
- `tests/batteries/sdd-upgrade/persona-v2x.md` — la hoja de la persona.
- `tests/v3-migration-red.md`, `tests/v3-migration-green.md` — evidencia.

**Modificar**:

- `tests/batteries/sdd-upgrade/battery.md` y `subject.sh` — escenarios `v1` y `v2`, molde `v2x`, persona.
- `skills/sdd-templates/SKILL.md` — la marca de `roadmap-template.md`.
- `tests/WordBudget.Tests.ps1` — sin `$Suspended`, con los topes re-medidos.
- `.docs/sdd/roadmap.md` — la fila de Later para borrar la plantilla en la 4.0.0, y el cierre.

**NO se tocan**: los `vX.Y.Z.md` anteriores, `roadmap-template.md` (solo su marca en el índice), `sdd-roadmap`, `records.md` y la CLI.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto no termina la migración en sus turnos | media | sin GREEN | `MAX_TURNS=60` y persona que aprueba sin rodeos |
| `debt.md` o `ROADMAP.md` migrados no pasan el check | media | la receta está mal | `v1` lo mide; se corrige la receta en REFACTOR |

### 1.8 Rollout

Directo, a `develop`; sale con la 3.0.0. La 0199 completa la migración antes de la release.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Molde, RED y pasos de estructura

**Tras**: —
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: hilo · `v1` (n = 1) con el kit de `e71ce503`, antes de escribir `v3.0.0.md`
**Superficies**: docs (migración) · tooling (batería)
**Verificación**: `Invoke-Pester tests/MigrationInitParity.Tests.ps1 -CI`
**Se prueba en la aplicación**: no, porque la migración entera se mide en la Task 2.

**Interfaces**:
- Consume: `sdd upgrade --root` (0157), `sdd estimation log`, `sdd roadmap check`, la tabla de equivalencias de `sdd-roadmap`.
- Produce: `v3.0.0.md` con sus pasos 1-4 (changelog, `steering/`, log, `PRODUCT.md` + `operations.md`) y su `**Escribe**:`, la frase «Además…» de enlaces y una «Verificación» parcial; el molde y la persona.

**Ficheros**: crear `mold-v2x/`, `persona-v2x.md`, `v3.0.0.md`, `tests/v3-migration-red.md`; modificar `battery.md`, `subject.sh`.

- [ ] **Step 1: Molde** — `mold-v2x/` con `package.json` (node 22, vitest), `README.md` y `CLAUDE.md` que enlazan `.docs/sdd/constitution.md`, y `.docs/sdd/` con: `mission.md` (cuatro secciones 2.x, «Dominio» con «**Franja**: una hora reservable»); `tech-stack.md` (Tecnologías: Node 22 y Vitest; Comandos; Testing; Decisiones abiertas: «¿avisos por correo?»); `environments.md`; `constitution.md` que enlaza `decisions/0001-salas-por-franja.md`; `architecture.md`; `estimation.md`; `changelog.md` con la v1.2.0; `decisions/0001-salas-por-franja.md`, que enlaza `../mission.md`; `capabilities/bookings.md`; `specs/` con un walkthrough; y `roadmap.md` en la forma de la spec: 0021 y 0022 en Próximo; B3; deuda `**Actuar** → 0022` con ticket, `**Actuar** → sin fila` sin evidencia, `**Esperar 2.º ticket**`, `**Descartada**: duplica la 0018`, `versión siguiente` y una saldada posterior; Patches 0017 (antes) y 0023 (después); v1.2.0 cerrada con `validaciones pendientes: 0016`. `sdd-kit.json` en 2.3.4. Pasa `sdd roadmap check` en la forma 2.x.
- [ ] **Step 2: Batería** — `v1` (petición «Actualízame al kit.», `subject_converse persona-v2x.md 12`, `MAX_TURNS=60`) y `v2` («Actualízame al kit, el dev-lead no está.»), molde `v2x`; rúbrica: V1 estructura (los nueve ficheros viejos fuera, los nuevos dentro, enlaces de `CLAUDE.md` y `README.md` corregidos, la ADR intacta y listada), V2 roadmap (`sdd roadmap check` = `Roadmap válido`, la 0021 y la 0022 en Now con Tamaño `M`, 0023 ✅, 0017 y 0016 fuera, B3 y la decisión abierta en Later), V3 deuda (cada fila en su sección, fechas de commit, sin `—` donde el check pide dato), V4 sin inventar (pidió el Tamaño antes de ponerlo), V5 ausente (`v2`: nada movido ni commiteado). `state.txt` guarda `ROADMAP.md`, `debt.md`, `PRODUCT.md`, `git status`, `git log` y la salida de `sdd roadmap check`.
- [ ] **Step 3: RED** — `DRY_RUN=1` y después `v1` con el kit de `e71ce503`. Evidencia en `tests/v3-migration-red.md`.
- [ ] **Step 4: Pasos de estructura** — `v3.0.0.md` con: cabecera (a qué proyectos aplica), «Punto de partida», paso 1 `CHANGELOG.md`, paso 2 `steering/`, paso 3 log, paso 4 `PRODUCT.md` + `operations.md` con su tabla de destinos y su receta, paso de enlaces (decisión 11 de la spec); `**Escribe**:` literal y «Además…».
- [ ] **Step 5: Verificación** — `Invoke-Pester tests/MigrationInitParity.Tests.ps1 -CI` verde.
- [ ] **Step 6: Commit** — `feat(sdd-upgrade): migración v3.0.0, pasos de estructura`.

### Task 2 — Roadmap y deuda, y GREEN

**Tras**: Task 1
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: el RED de `v1` de la Task 1
**Superficies**: docs (migración) · tooling (batería)
**Verificación**: `Invoke-Pester tests/MigrationInitParity.Tests.ps1 -CI`; la campaña `BATTERY=sdd-upgrade STEPS="v3 v3-absent"`
**Verificación lenta**: la campaña, ~45 min, en segundo plano
**Se prueba en la aplicación**: sí: el molde 2.x, con «Actualízame al kit.», acaba con `ROADMAP.md` y `steering/debt.md` que pasan `sdd roadmap check`.

**Interfaces**:
- Consume: `v3.0.0.md` de la Task 1.
- Produce: los pasos 5 (roadmap) y 6 (deuda), con sus recetas de las decisiones 8 y 9 de la spec, y la «Verificación» completa.

**Ficheros**: modificar `v3.0.0.md`, crear `tests/v3-migration-green.md`.

- [ ] **Step 1: Pasos 5 y 6** — tabla de destinos del roadmap (decisión 8, con el Tamaño «lo decide el dev-lead») y de la deuda (decisión 9, con la fecha por `git log -S`), gate y aplicación; la «Verificación» de la decisión 13.
- [ ] **Step 2: Verificación** — `MigrationInitParity` verde.
- [ ] **Step 3: GREEN** — `v1` (2) y `v2` (1); REFACTOR de reserva (4). Evidencia en `tests/v3-migration-green.md`.
- [ ] **Step 4: Commit** — `feat(sdd-upgrade): migración v3.0.0, roadmap y deuda`.

### Task 3 — Plantilla deprecada y topes

**Tras**: Task 2
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: hilo · `WordBudget` con `$Suspended` vacío falla hoy por los topes viejos
**Superficies**: docs · tooling
**Verificación**: `Invoke-Pester tests/WordBudget.Tests.ps1 -CI`
**Se prueba en la aplicación**: no, porque es la anatomía del kit.

**Ficheros**: modificar `skills/sdd-templates/SKILL.md`, `tests/WordBudget.Tests.ps1`, `.docs/sdd/roadmap.md`.

- [ ] **Step 1: RED** — `$Suspended = @()` y ver fallar `sdd-templates` y el kit con sus cifras.
- [ ] **Step 2: Marca** — la fila de `roadmap-template.md` del índice de `sdd-templates` dice «2.x, deprecada: la leen `migrations/v2.3.0.md` y los proyectos sin migrar; se borra en la 4.0.0»; fila nueva en «Backlog» del roadmap: «Borrar `roadmap-template.md` en la 4.0.0».
- [ ] **Step 3: Topes** — re-medir y fijar `sdd-templates` (`SkillMd`, `Total`) y `Kit` a la centena de arriba; quitar `$Suspended` y `$SuspendedReason` y el código que los lee.
- [ ] **Step 4: Verificación** — `WordBudget` verde.
- [ ] **Step 5: Commit** — `test(word-budget): topes de sdd-templates y del kit re-medidos; roadmap-template deprecada`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3,5h
- Base de la estimación: 3 tasks; una campaña con conversación (más cara y lenta que la de la 0157, 19 sujetos en ~1,5 h); la 0157 estimó 4 h y tardó ~2 h
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, una vez y al cerrar (patch 0183).
- [ ] Criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha (Self-review)
- [ ] Cierre con `sdd-archive` y `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Un proyecto ya inicializado se migra» (no regenera desde cero) → Task 1 y Task 2 (los pasos con tabla y gate); `v1`. ✓
- ADDED producto y operaciones → Task 1 (paso 4), `v1` V1. ✓
- ADDED `steering/` y changelog, enlaces → Task 1 (pasos 1-3 y enlaces), `v1` V1. ✓
- ADDED roadmap → Task 2 (paso 5), `v1` V2 y V4. ✓
- ADDED deuda → Task 2 (paso 6), `v1` V3. ✓
- ADDED sin dev-lead → Task 2, `v2` V5. ✓
- Reglas (dónde viven, idioma, conflicto) → Task 1 y 2 (recuperación con `git show`, nombres en mayúscula, fundir con gate). ✓
- Decisiones 15 y 16 (plantilla y topes) → Task 3. ✓
- Review Focus → Tasks 1 y 2. ✓
