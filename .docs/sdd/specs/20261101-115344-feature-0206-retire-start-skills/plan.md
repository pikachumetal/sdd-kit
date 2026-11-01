---
id: 20261101-115344-feature-0206-retire-start-skills
feature: 0206
title: Plan de implementación — Retirar sdd-start-feature y sdd-start-patch
spec: ./spec.md
status: done
created: 2026-11-01
---

# Plan de implementación — Retirar `sdd-start-feature` y `sdd-start-patch`

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: el hilo, en Native, con el modelo de la sesión; sujetos en Sonnet, salvo las filas que ya declaran Opus; revisión final con los ejes de `sdd-verify` — un solo contexto conoce ya la tabla de reglas.
2. Ejecución: native — ver la línea de abajo.
3. La Task 1 es un traslado sin conducta, para que el diff con texto nuevo de las Tasks 2 y 3 se lea solo.
4. Mientras existan, `sdd-start-feature` y `sdd-start-patch` siguen en disco hasta la Task 4; sus enlaces se actualizan en la Task 1 para que `skills.test.ts` siga en verde en cada commit.
5. Riesgos altos: un rojo de enrutado por la `description` de `sdd-implement`, que se mide en la Task 4. Coste: ~4 h y 52 $ de techo.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: quitar las dos skills de arranque sin perder ninguna regla, con el patch dentro de `sdd-implement`.

**Architecture**: las referencias se trasladan con `git mv` a la skill que las usa. `sdd-implement` abre con una sección del patch que manda a `references/patch-flow.md`. Las reglas que solo vivían en el paso 7 van a `sdd-implement` y al paso 1 de `sdd-archive`.

**Tech Stack**: Markdown de skills, Vitest en `cli/test/kit/`, baterías en `tests/batteries/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 4 tasks encadenadas sobre los mismos textos, un error lo cazan `skills.test.ts` y la batería de su task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos; solo traslada texto.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos; nombres en inglés; funciones ≤ 20 líneas y ≤ 3 parámetros; texto humano en castellano con tildes.
- Art. III: el texto nuevo de una skill en inglés; lo trasladado no se traduce, salvo `patch-flow.md`, que se reescribe.
- `${CLAUDE_PLUGIN_ROOT}` solo en un `SKILL.md`; en `references/`, el verbo (`sdd id claim`).
- Texto de `sdd-start-patch` conservado en su sentido: no se añade ninguna regla salvo N1 y N2 de la tabla de la spec.

### De proceso

- Sujetos por tandas, con 3 en paralelo como máximo; los pares de batería van en `tests/batteries/<skill>/`.
- Commits con tipo en inglés, título y cuerpo en castellano; `git commit -F` si el mensaje lleva `/palabra`.

## Review Focus

- Un patch con `tasks.md` o plan por error en la carpeta → sigue siendo patch: la sección manda por el carril, no por los ficheros · Task 3, `pt1`.
- `sdd-implement` invocada por su nombre, con spec aprobada y sin pasar por `sdd-propose` → sigue, sin mandar a propose · Task 2, `t2` de `sdd-implement` (control).
- Un patch que sube a feature a mitad → vuelve a `sdd-propose`, paso 4, y deja de seguir `patch-flow.md` · Task 3, `pt2` (lectura) y `a4` de `sdd-propose` (control).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin skill ni verbo nuevos; una referencia.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: no aplica a un cambio de texto; la migración recoge los nombres.
- [x] **Constitution check**: Art. I (tabla, previsión de coste), III, VIII y X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-implement/references/patch-flow.md` — el flujo del patch.

**Modificar**: los de «Entra» de la spec.

**NO se tocan**:

- `tests/*.md`, `.docs/sdd/specs/`, `field-reports/`, `changelog.md`, ADR, `migrations/v0.4.0.md` y `v2.0.0.md`, `cli/test/fixtures/` — historia.
- `skills/using-sdd/SKILL.md` y el castellano de `skills/sdd-templates/SKILL.md` — son de la 0272.

### 1.6 Dependencias

Tras la 0186, ya en la base.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `patch-flow.md` no se abre | media | alto | «lo primero» en la sección; `pt1` lo mide; si falla, sube al `SKILL.md` lo que decide |
| Se dispara la revisión final en un patch | media | alto | exclusión literal en la sección; `tools:` ausente en `pt1`-`pt3` |
| Enrutado: «retoma la feature» cae en otra puerta | alta | bajo | declarado en la spec; 0116 |

### 1.8 Rollout

Directo; sale con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Trasladar las referencias y actualizar los enlaces

**Tras**: —
**Modelo**: hilo de la sesión.
**Tests RED**: hilo: `cli/test/kit/skills.test.ts` y `word-budget.test.ts` ya cubren enlaces y topes; el RED es ver el rojo de los topes tras el `git mv`.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: no, porque refactor: traslado sin conducta.

**Interfaces**:
- Consume: nada.
- Produce: `skills/sdd-propose/references/{control-profiles,nombrado,modo-lite,review-spec}.md`; `skills/sdd-implement/references/{commit-milestones,frontend-verification}.md`.

**Ficheros**: `git mv` de las seis; enlaces en `skills/`, `CLAUDE.md`, `constitution.md`:50, `migrations/v3.0.0.md`:147, propósito de las capacidades en el cierre; `word-budget.test.ts`.

- [ ] **Step 1: Implementación** — `git mv` de las seis. Reescribe cada enlace y cada ruta en texto con un script por ruta destino, recalculando el relativo desde el fichero que enlaza. Topes totales: `sdd-implement` 17.740 y `sdd-propose` 14.200.
- [ ] **Step 2: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 3: Verificación** — la de arriba, y `git grep -n "sdd-start-feature/references"` solo devuelve historia.
- [ ] **Step 4: Commit de la task**.

### Task 2 — El camino de la feature: propose → implement → archive

**Tras**: Task 1
**Modelo**: hilo de la sesión.
**Tests RED**: `tests/batteries/sdd-propose/battery.md`, fila `f1`, y `tests/batteries/sdd-implement/battery.md`, fila `f2`; RED con `f1`, n = 1.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` y `BATTERY=sdd-propose STEPS=handoff node tests/headless/battery.mjs run`
**Se prueba en la aplicación**: no, porque es una skill: lo mide la batería.

**Interfaces**:
- Consume: las rutas de la Task 1.
- Produce: paso 6 de `sdd-propose` invoca `sdd-implement`; `description` de `sdd-implement`: «Use when sdd-propose hands off an approved spec (and plan, in full mode) or a confirmed patch…»; salida a `sdd-archive`.

**Ficheros**: `skills/sdd-propose/SKILL.md`, `references/spec-writing.md` si cita el paso 7; `skills/sdd-implement/SKILL.md`; `skills/sdd-archive/SKILL.md`, `references/dev-validation.md`; `skills/sdd-templates/SKILL.md` (3 menciones), `templates/validation-template.md`, `templates/plan-template.md`.

- [ ] **Step 1: Implementación** — F4, F5, F6, P7d, P7f, P7h y P7i de la tabla de la spec, en inglés. Las menciones «step 7 of `sdd-start-feature`» pasan a `sdd-archive` y los diagramas apuntan a `sdd-archive`. Fila `f1`: «Añade el motivo de cancelación» con un segundo turno que aprueba; rúbrica `tools: /Skill: sdd-kit:sdd-start-/` ausente y `tools: /Skill: sdd-kit:sdd-implement/` presente. Fila `f2`: `Invoca la skill sdd-kit:sdd-implement` sin `spec.md` aprobada → manda a `sdd-propose`. Filas `se1` en `sdd-archive`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba; `f1` n = 2, `f2`, `se1`, `c1`, `v1a`, `v1b`, `g6`, `c2` n = 1, reescritas para entrar por `sdd-archive` o `sdd-implement`.
- [ ] **Step 4: Commit de la task**.

### Task 3 — El camino del patch en `sdd-implement`

**Tras**: Task 2
**Modelo**: hilo de la sesión.
**Tests RED**: `tests/batteries/sdd-implement/battery.md`, filas `pt1`, `pt2`, `pt3`; RED con `pt1`, n = 1.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` y `BATTERY=sdd-implement STEPS=patch node tests/headless/battery.mjs run`
**Se prueba en la aplicación**: no, porque es una skill: lo mide la batería.

**Interfaces**:
- Consume: la `description` de la Task 2.
- Produce: `skills/sdd-implement/references/patch-flow.md`; `## Patch` al principio de `sdd-implement`, tras el Overview.

**Ficheros**: `skills/sdd-implement/SKILL.md`, `references/patch-flow.md`; `skills/sdd-propose/SKILL.md`, paso 6 y paso 2; `skills/sdd-debugging/SKILL.md` si nombra el patch; baterías.

- [ ] **Step 1: Implementación** — `## Patch`: «A confirmed patch: first thing, read references/patch-flow.md and follow it. Setup, the Native and SDD loops and After the last task don't apply: no final review, no axes.» más la ruta de la CLI. `patch-flow.md`: filas P1-P6, RF y RZ de la tabla con destino `patch-flow.md`, y N1 y N2. Fila `pt1`: el fallo de `findBooking` del molde; `pt2`: ajuste visual; `pt3`: petición cerrada. Rúbrica: `tools: /Skill: sdd-kit:sdd-start-/` ausente; `tools: /Agent/` ausente; §4 de `patch.md` con el comando y su salida.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba, con `pt1` n = 2, `pt2` y `pt3` n = 1; controles `h1`, `h2` y `w1`.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Retirada, migración, documentos y baterías

**Tras**: Task 3
**Modelo**: hilo de la sesión.
**Tests RED**: la `git grep` del criterio de hecho, con hits antes.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts test/kit/headless/battery.test.ts test/kit/workflow-docs.test.ts` y `BATTERY=using-sdd node tests/headless/battery.mjs run`
**Se prueba en la aplicación**: no, porque es una skill: lo mide la batería.

**Interfaces**:
- Consume: lo anterior.
- Produce: `skills/sdd-start-feature/` y `skills/sdd-start-patch/` no existen.

**Ficheros**: las dos carpetas (borrar); `tests/batteries/sdd-start-feature/` (retirar, repartir); baterías con peticiones viejas; `migrations/v3.0.0.md`, pasos 5 y Verificación; `README.md`, `architecture.md`, `tech-stack.md`:88, `.docs/workflow/`; `CLAUDE.md`; `.claude-plugin/plugin.json` si nombra; `word-budget.test.ts`, filas fuera y kit 89.328; `battery.test.ts`.

- [ ] **Step 1: Implementación** — lo de «Ficheros». Paso 5 de `v3.0.0.md`: añade `sdd-start-feature|sdd-start-patch` a la `git grep` y la fila «`sdd-start-feature`, `sdd-start-patch` → `sdd-propose`», «`/sdd-start-feature`, `/sdd-start-patch` → `/sdd-propose`». Excluye de esa sustitución las rutas `references/` no aplica: un proyecto no las nombra; si una aparece, va al informe.
- [ ] **Step 2: Build** — `moon run cli:typecheck`.
- [ ] **Step 3: Verificación** — la de arriba, y `git grep -E "sdd-start-(feature|patch)" -- skills hooks cli CLAUDE.md` solo devuelve `migrations/` y la fixture.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 3,5 h
- Base de la estimación: 4 tasks, una mecánica; ~60 ficheros; 61 sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `sdd-propose` entrega a `sdd-implement` → Task 2, `f1`. ✓
- Patch: `patch-flow.md` lo primero; §4 con salida; sin ejes; sigue en archive → Task 3, `pt1`-`pt3`. ✓
- Sin skill intermedia; borradores → Task 2, `f1`, `c1`. ✓
- Migración, paso 5 → Task 4, lectura y `git grep` de su Verificación; sin sujeto (avisado en la spec); la 0198. ⚠
- MODIFIED de `routing`, `feature-ids`, `capabilities`, `control-profiles` → enrutado, Task 4; los demás son nombres. ✓
- Tabla, filas «ya está» → Task 4, lectura del destino por el eje Spec. ✓
- Tabla, filas P7 → Task 2. Filas `patch-flow.md` → Task 3. R2, RF1, RZ1, F9, D1, D2 → sin destino, con motivo. ✓
- Review Focus → Tasks 2 y 3. ✓
