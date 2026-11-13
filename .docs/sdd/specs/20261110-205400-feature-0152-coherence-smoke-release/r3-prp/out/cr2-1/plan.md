---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: la sesión Native las hace todas (Sonnet, effort medium); son ediciones de dos líneas de una skill y tandas de sujetos que lanza el hilo principal. La revisión final de rama no se quita: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`mold-c` ya tiene `pendientes.md`** (`- 0011: responsables de sala`), y la spec dice que no. Con el fichero, el sujeto de `c1` lo lee y el RED no mide si la skill dice qué queda pendiente. La Task 1 lo borra antes de la tanda RED, para que la premisa de la spec sea cierta. Es una corrección del molde, no del alcance; se anota en el walkthrough.
4. **El paso 2 es condicional**, como dice la spec: la Task 3 solo se hace si el RED de `c2` (n = 3) exhibe que el sujeto no repite lo pendiente antes del gate. Si no lo exhibe, no se toca y se anota.
5. **Coste estimado**: 1,5 h de implementación. La tanda RED son 5 sujetos (3,50 $) y la GREEN hasta 4 (2,80 $), igual que la previsión de la spec (6,30 $). Si una tanda la supera, se para y decide el dev-lead (constitution, Art. 5).
6. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `skills/aviso-cierre/SKILL.md` haga que el aviso de cierre nombre lo pendiente del roadmap, probado con sujetos (RED → GREEN).

**Architecture**: solo cambia texto de una skill y un fixture de prueba. El paso 1 pasa a decir qué queda pendiente según el roadmap; el paso 2 repite lo pendiente antes del gate solo si el RED lo pide.

**Tech Stack**: Node ≥ 20, `node --test`, `scripts/plan.mjs` para la previsión de coste, baterías en `tests/batteries/`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json` · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fixture de prueba; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de una skill sin su prueba con sujetos, RED antes de GREEN (constitution, Art. 5).
- La previsión de coste va antes del primer sujeto; si la prueba la supera, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitution, Art. 5).
- No entra el roadmap (spec, Scope).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Native, un commit por task al quedar limpia su revisión.
- Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un sujeto de `c1` con `pendientes.md` presente en el molde → la medida no vale, porque lee el fichero y no la skill · Task 1, el paso que comprueba que `mold-c` ya no lo tiene antes de lanzar `c1`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas de skill y un fixture; no hay forma más simple.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: la skill conserva sus dos pasos; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 4 y 5 respetados (castellano; RED → GREEN con previsión de coste).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/tasks.md` — registro vivo de las tasks.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 dice qué queda pendiente según el roadmap; el paso 2, solo si el RED de `c2` lo exhibe, repite lo pendiente antes de correr el gate.
- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — se borra, para que el sujeto de `c1` saque lo pendiente de la skill.

**NO se tocan**:

- `ROADMAP.md` — spec, Scope: «No entra: el roadmap».
- `tests/batteries/aviso-cierre/battery.md` — `c1` y `c2` ya están; la tanda RED de `c2` con n = 3 va por `N=3`.
- `src/`, `test/`, `scripts/` — no cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `c1` en RED ya pasa sin tocar la skill (el sujeto saca lo pendiente solo) | media | la edición del paso 1 no se justifica | se anota la medida; no se escribe el paso 1 sin un RED que falle |
| Una tanda supera la previsión | baja | gasto no previsto | `plan.mjs` antes de cada tanda; si la supera, se para y decide el dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED: el aviso no nombra lo pendiente

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, `c1` × 2 y `c2` × 3, sin tocar `skills/aviso-cierre/SKILL.md`.

**Superficies**: tooling, docs
**Verificación**: la previsión de coste de cada escenario con `plan.mjs` (Step 2); luego la tanda, con `c1` × 2 y `c2` × 3 (5 sujetos, 3,50 $). Esperado: `c1` no nombra lo pendiente en ninguno de sus 2 sujetos.
**Se prueba en la aplicación**: no, porque es un cambio de skill sin aplicación.

**Interfaces**:
- Consume: nada.
- Produce: la medida RED de `c1` y de `c2`, anotada en el walkthrough, que decide si la Task 3 se hace.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`

- [ ] **Step 1: Molde** — borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md` y comprobar que `tests/batteries/aviso-cierre/mold-c/` ya no lo contiene (`git ls-files tests/batteries/aviso-cierre/mold-c` sin salida).
- [ ] **Step 2: Previsión** — `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`, y `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`.
- [ ] **Step 3: Tanda RED** — lanzar `c1` × 2 y `c2` × 3 contra la skill sin editar. Esperado: `c1` falla (el aviso no nombra lo pendiente); anotar qué hace `c2` antes de correr el gate.
- [ ] **Step 4: Commit de la task** — el borrado del molde y las medidas RED, con el id de la feature.

---

### Task 2 — GREEN del paso 1

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: la tanda RED de `c1` de la Task 1, ya medida.

**Superficies**: docs
**Verificación**: tanda `c1` × 2 (1,40 $); luego `node --test` → `ℹ fail 0`. Esperado: los 2 sujetos nombran lo pendiente sacándolo del roadmap.
**Se prueba en la aplicación**: no, porque es un cambio de skill sin aplicación.

**Interfaces**:
- Consume: la medida RED de `c1`.
- Produce: el paso 1 de `skills/aviso-cierre/SKILL.md` con lo pendiente.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Edición** — el paso 1 pasa de «Di qué se cierra.» a un texto que dice qué se cierra y qué queda pendiente según `ROADMAP.md`, en castellano. El paso 2 queda igual.
- [ ] **Step 2: Tanda GREEN** — `c1` × 2. Esperado: ambos sujetos nombran lo pendiente sacándolo del roadmap; si alguno no, REFACTOR del texto y otra tanda dentro del tope de coste.
- [ ] **Step 3: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, con el id de la feature.

---

### Task 3 — GREEN del paso 2, solo si el RED de `c2` lo exhibe

**Tras**: Task 2
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: la tanda RED de `c2` × 3 de la Task 1, ya medida.

**Superficies**: docs
**Verificación**: tanda `c2` × 2 (1,40 $); luego `node --test` → `ℹ fail 0`. Esperado: los 2 sujetos repiten lo pendiente antes de correr el gate.
**Se prueba en la aplicación**: no, porque es un cambio de skill sin aplicación.

**Interfaces**:
- Consume: la medida RED de `c2` y el paso 1 de la Task 2.
- Produce: el paso 2 de `skills/aviso-cierre/SKILL.md` repitiendo lo pendiente, o la nota de que el RED no lo exhibió y no se toca.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Decisión** — si el RED de `c2` no exhibió que falte lo pendiente antes del gate, anotarlo en el walkthrough, no editar y pasar al cierre de la task sin tanda.
- [ ] **Step 2: Edición** — el paso 2 repite lo pendiente antes de correr el gate, en castellano.
- [ ] **Step 3: Tanda GREEN** — `c2` × 2. Esperado: ambos sujetos repiten lo pendiente antes del gate.
- [ ] **Step 4: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, con el id de la feature.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 3 tasks, dos de ellas ediciones de una línea; la incertidumbre son las tandas de sujetos, hasta una de REFACTOR
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 2, tanda GREEN de `c1` × 2, con RED en la Task 1. ✓
- Scope «el paso 2 repite lo pendiente antes de correr el gate» (si el RED lo exhibe) → Task 3, tanda GREEN de `c2` × 2, con RED de `c2` × 3 en la Task 1. ✓
- Scope «No entra: el roadmap» → N/A: ninguna task toca `ROADMAP.md` (§1.1). ✓
- «Dónde se prueba»: `mold-c` sin `pendientes.md` → Task 1, Step 1 (el molde la tenía; se borra). ✓
- Previsión de coste: RED 3,50 $ y GREEN 2,80 $ → Task 1, Step 2 y Steps de tanda de las Tasks 2 y 3. ✓
- Review Focus: `c1` con `pendientes.md` en el molde → Task 1, Step 1. ✓
