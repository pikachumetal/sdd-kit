---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: la sesión (Sonnet, effort medium) hace las dos tasks; los sujetos de la batería van con `sonnet`, como fija `battery.md`. La revisión final de rama va con los ejes de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json` (`execution: native`).
3. Dos tasks y no tres: el RED es una tanda con su propio gate de coste (Art. 5); escribir el paso 1, el paso 2 si el RED lo pide y la tanda GREEN son una sola rebanada, porque el GREEN es lo único que dice si el texto sirve.
4. El paso 2 solo se escribe si el RED de `c2` lo exhibe (spec, Scope). Si no, la Task 2 no lo toca y la tanda GREEN corre solo `c1` × 2 (1,40 $).
5. La batería fija n = 2 para `c1` y `c2`; el RED de `c2` sube a 3 con `N=3`, como prevé la spec.
6. Coste estimado: 6,30 $ y 9 sujetos (spec, «Previsión de coste»); si la prueba lo supera, una tanda más de REFACTOR incluida, se para y decide el dev-lead (Art. 5).
7. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el aviso de `aviso-cierre` nombra lo que queda pendiente en el roadmap, y la skill queda probada con sujetos (RED → GREEN).

**Architecture**: se edita solo `skills/aviso-cierre/SKILL.md`. La prueba usa la batería existente (`tests/batteries/aviso-cierre/`) y su molde, sin cambiarlos; la evidencia de cada tanda queda en la carpeta de la spec.

**Tech Stack**: Node 22, `node --test`, `node scripts/lint.mjs`; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill.

## Restricciones globales

### De código

- Texto de la skill en castellano (Art. 4).
- El paso 1 dice qué queda pendiente sacándolo del roadmap; el roadmap no se modifica (Scope, «No entra»).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Ninguna edición de `SKILL.md` sin su RED antes (Art. 5); la previsión de coste se declara antes del primer sujeto: `SCENARIOS="c1 c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.
- Sujetos: `sonnet`, ~0,70 $ cada uno.
- Commits: convención del proyecto (`feat:`), con la atribución del kit; uno por task al quedar limpia su revisión.

## Review Focus

- Roadmap del molde sin filas pendientes → el aviso lo dice («no queda nada pendiente») y no inventa filas · Task 2, salida del sujeto `c1` en `evidence/green-c1.md`, que la revisión final lee contra el `ROADMAP.md` del molde.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una línea en el paso 1 y, si el RED lo exige, otra en el paso 2.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: retrocompatible; los dos pasos actuales se conservan.
- [x] **Constitution check**: Art. 2 (la prueba antes del texto, gate de cierre) y Art. 5 (RED → GREEN, previsión de coste) se cumplen.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `evidence/red.md` y `evidence/green-c1.md` (y `green-c2.md` si hay GREEN de `c2`), en la carpeta de la spec — salida en bruto de los sujetos de cada tanda.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente; el paso 2, solo si el RED de `c2` lo exhibe.

**NO se tocan**:

- `ROADMAP.md` y el del molde — la spec deja el roadmap fuera.
- `tests/batteries/aviso-cierre/` — la batería y su molde son la prueba, no el objeto.

### 1.2 a 1.5

No aplican.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` no falla (el sujeto ya nombra lo pendiente) | baja | la skill no necesita cambio | parar y decidir con el dev-lead: sin RED no se edita (Art. 5) |
| La prueba supera los 6,30 $ | media | coste | parar y decidir con el dev-lead tras la tanda que lo cruce |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED: el aviso actual no nombra lo pendiente

**Tras**: —
**Modelo**: sesión Sonnet, effort medium; sujetos `sonnet`
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` (`c1` × 2 y `c2` × 3 contra el `SKILL.md` sin tocar); no se commitea código, la evidencia va en `evidence/red.md`.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`, y `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (previsión antes del primer sujeto; juntas suman 5 sujetos y 3,50 $, como la spec)
**Se prueba en la aplicación**: no, porque es evidencia de una prueba, sin cambio visible.

**Interfaces**:
- Consume: `skills/aviso-cierre/SKILL.md` tal como está (`1. Di qué se cierra.` / `2. Corre el gate.`) y el molde `tests/batteries/aviso-cierre/mold-cierre/`.
- Produce: `evidence/red.md` con, por sujeto, su salida en bruto y si el aviso nombra o no lo pendiente; y la decisión «paso 2 sí/no» según si algún sujeto de `c2` corre el gate sin repetir lo pendiente.

**Ficheros**: crear `evidence/red.md`

- [ ] **Step 1: Previsión** — corre los dos comandos de `Verificación` y copia sus líneas de suma al principio de `evidence/red.md`.
- [ ] **Step 2: Sujetos** — despacha 2 sujetos de `c1` y 3 de `c2` (`sonnet`) con el molde y el `SKILL.md` actual; guarda cada salida en bruto en `evidence/red.md`. Esperado: en `c1`, ningún aviso nombra lo pendiente. Si alguno ya lo nombra, para y decide con el dev-lead.
- [ ] **Step 3: Decisión del paso 2** — anota en `evidence/red.md` si el RED de `c2` exhibe que el gate corre sin repetir lo pendiente. Esperado: una línea «paso 2: sí» o «paso 2: no», con la prueba.
- [ ] **Step 4: Commit de la task** — `test: RED de aviso-cierre (0028)`.

### Task 2 — GREEN: el aviso nombra lo pendiente

**Tras**: Task 1
**Modelo**: sesión Sonnet, effort medium; sujetos `sonnet`
**Tests RED**: los de la Task 1 (`evidence/red.md`); el GREEN corre los mismos escenarios contra el texto nuevo.

**Superficies**: docs · tooling
**Verificación**: `node --test && node scripts/lint.mjs` → `ℹ fail 0` y lint con código 0; y la tanda GREEN: `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` (con «paso 2: no», solo `c1`: `suma: 2 sujetos · coste previsto: 1.40 $`)
**Se prueba en la aplicación**: no, porque es el texto de una skill; lo prueban los sujetos.

**Interfaces**:
- Consume: `evidence/red.md` — la decisión «paso 2 sí/no».
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 que nombra lo pendiente.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`; crear `evidence/green-c1.md` (y `green-c2.md` con «paso 2: sí»)

- [ ] **Step 1: Paso 1** — en `skills/aviso-cierre/SKILL.md`, el paso 1 pasa de `Di qué se cierra.` a decir qué se cierra y qué queda pendiente, sacándolo del roadmap del proyecto; si el roadmap no tiene nada pendiente, lo dice. Sin tocar el roadmap.
- [ ] **Step 2: Paso 2 (solo con «paso 2: sí»)** — el paso 2 repite lo pendiente antes de correr el gate. Con «paso 2: no», no se toca.
- [ ] **Step 3: Previsión y GREEN** — declara la previsión de la tanda (comando de `Verificación`), despacha `c1` × 2 y, con «paso 2: sí», `c2` × 2; guarda las salidas en bruto en `evidence/green-c1.md` (y `green-c2.md`). Esperado: todos los avisos de `c1` nombran lo pendiente del roadmap del molde; con «paso 2: sí», los de `c2` lo repiten antes del gate. Si algún sujeto falla, se corrige el texto en una tanda más de REFACTOR; si el total supera 6,30 $, para y decide el dev-lead.
- [ ] **Step 4: Gate** — corre `node --test && node scripts/lint.mjs`. Esperado: verde.
- [ ] **Step 5: Commit de la task** — `feat: el aviso de cierre dice qué queda pendiente (0028)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: los sujetos de `c1` nombran lo pendiente
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1 (RED de `c1`: no lo nombra) y Task 2 (GREEN de `c1` × 2: lo nombra). ✓
- Scope «el paso 2 repite lo pendiente, si el RED lo exhibe» → Task 1 Step 3 decide; Task 2 Step 2 y el GREEN de `c2` × 2. ✓
- No entra «el roadmap» → N/A: ningún fichero de roadmap se modifica (§1.1). ✓
- Previsión de coste (spec) → Task 1 y Task 2, con la previsión declarada antes de cada tanda y el tope de 6,30 $. ✓
- Review Focus (roadmap sin filas pendientes) → Task 2, `evidence/green-c1.md` leída contra el molde. ✓
