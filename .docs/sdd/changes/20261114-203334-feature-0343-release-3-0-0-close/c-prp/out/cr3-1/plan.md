---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace la sesión (Native); los sujetos de la batería van con Sonnet, como fija `operations.md`. Revisión final de rama con el modelo de `sdd-verify`.
2. Ejecución: Native, porque 2 tasks cortas sobre un solo fichero, un error lo caza el RED/GREEN de su task y el plan cabe en un contexto.
3. La Task 2 es condicional, como la spec: si el RED de `c2` no exhibe el fallo, no se escribe el paso 2 y la task se cierra sin cambio de la skill.
4. El molde `mold-cierre` se usa tal cual: su `ROADMAP.md` solo tiene el título, así que un aviso correcto dice que no queda nada pendiente. Si con ese molde un sujeto no puede distinguir RED de GREEN, se para y decide el dev-lead; no se edita el molde por mi cuenta.
5. Las filas `c1` y `c2` de `battery.md` no definen su escenario más allá de `cierre`; no las toco. `c2` usa N=3 en el RED por la spec, aunque la fila diga 2.
6. Coste: 5 sujetos RED (3,50 $) + 4 GREEN (2,80 $) = 6,30 $, calculado con `scripts/plan.mjs`. Un REFACTOR que supere eso para y lo decide el dev-lead (Art. 5).
7. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo pendiente sacándolo del roadmap; el paso 2 lo repite antes del gate solo si el RED lo exhibe.

**Architecture**: se edita el texto de una skill y nada más, guiado por pruebas con sujetos (RED → GREEN).

**Tech Stack**: Node ≥ 20 (`node --test`, `scripts/plan.mjs`, `scripts/lint.mjs`); sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks cortas sobre un solo fichero, un error lo caza el RED/GREEN de su task y el plan cabe en un contexto · fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de la skill sin su prueba con sujetos, RED antes de GREEN (constitution, Art. 5).
- Sin comentarios que repitan el texto ni que citen documentos (constitution, spec, task).

### De proceso

- Sujetos con Sonnet; la previsión de una tanda sale de `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.
- Commits del proyecto, con el trailer de atribución del kit.

## Review Focus

- Molde con `ROADMAP.md` vacío → el aviso dice que no queda nada pendiente, sin inventar filas · Task 1, `c1` GREEN: el aviso no cita ninguna fila.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase en un paso de la skill; no hay forma más simple.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: el paso 1 sigue diciendo qué se cierra; el paso 2 sigue corriendo el gate.
- [x] **Constitution check**: respeta los Arts. 1, 2, 4 y 5.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, si el RED lo exhibe, paso 2 (Task 2).

**NO se tocan**:

- `ROADMAP.md` — fuera de scope en la spec.
- `tests/batteries/aviso-cierre/` — el molde y la batería se usan como están.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde vacío no distingue RED de GREEN | Media | La prueba no demuestra nada | Parar y decidir con el dev-lead (decisión 4) |
| El coste de las tandas supera 6,30 $ | Baja | Rompe el Art. 5 | Parar y decidir con el dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: la sesión (Native); sujetos `c1` con `model: sonnet`.
**Tests RED**: hilo principal · `c1` × 2 sobre la skill sin tocar, en una copia del molde `mold-cierre`.

**Superficies**: docs (skill).
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` antes de lanzar; GREEN: `c1` × 2, y en ambos el aviso nombra lo pendiente según el roadmap.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 con la frase de lo pendiente, que la Task 2 deja intacto.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: RED** — lanzar `c1` × 2 con la skill actual; esperado: el aviso dice qué se cierra y no menciona lo pendiente en ninguno.
- [ ] **Step 2: Implementación** — paso 1 pasa a «Di qué se cierra y qué queda pendiente, leyéndolo del roadmap del proyecto.»; si el roadmap no tiene nada pendiente, el aviso lo dice.
- [ ] **Step 3: GREEN** — `c1` × 2; esperado: ambos nombran lo pendiente sacándolo del roadmap, sin inventar filas. `node --test && node scripts/lint.mjs` no se corre aquí: va en §3.
- [ ] **Step 4: Commit de la task** — `feat(0028): el aviso de cierre nombra lo pendiente`.

---

### Task 2 — El paso 2 repite lo pendiente *(condicional)*

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `c2` con `model: sonnet`.
**Tests RED**: hilo principal · `c2` × 3 sobre la skill tal como queda tras la Task 1, en una copia del molde.

**Superficies**: docs (skill).
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` antes del RED; GREEN `c2` × 2 → `1.40 $`.

**Interfaces**:
- Consume: el paso 1 de la Task 1.
- Produce: el paso 2 que repite lo pendiente antes del gate, o nada si el RED no lo exhibe.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe)

- [ ] **Step 1: RED** — `c2` × 3; esperado: si al menos un sujeto corre el gate sin repetir lo pendiente, el RED lo exhibe. Si ninguno falla, la task acaba aquí: se anota en el cierre y no se toca la skill.
- [ ] **Step 2: Implementación** — paso 2 pasa a «Repite lo pendiente y corre el gate.»
- [ ] **Step 3: GREEN** — `c2` × 2; esperado: en ambos el aviso repite lo pendiente antes de correr el gate.
- [ ] **Step 4: Commit de la task** — `feat(0028): el paso 2 repite lo pendiente antes del gate` (sin commit si no hubo cambio).

---

## Estimación y esfuerzo

No existe `estimation.md` con tipo declarado para esta feature; tipo docs, ~1,5 h de implementación, confianza media.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: el GREEN de `c1` y, si hubo, de `c2`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` GREEN × 2: el aviso cita lo que dice el roadmap del molde. ✓
- «El paso 2 repite lo pendiente antes del gate» (Scope, condicional) → Task 2, `c2` RED × 3 y GREEN × 2. ✓
- «No entra: el roadmap» → N/A: el `ROADMAP.md` del repo no se toca. ✓
- Review Focus (molde vacío) → Task 1, `c1` GREEN. ✓
