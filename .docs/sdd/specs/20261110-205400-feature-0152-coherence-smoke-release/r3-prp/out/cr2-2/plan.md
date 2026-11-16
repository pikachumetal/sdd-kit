---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las tres las hace la sesión (Native); sin despacho. Los sujetos de la batería van con Sonnet, como fija `operations.md`. La revisión final de rama va con `sdd-verify`: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde no es como dice la spec.** La spec parte de que `mold-c` no tiene `pendientes.md`, pero `tests/batteries/aviso-cierre/mold-c/pendientes.md` existe desde `de92b1e` (`- 0011: responsables de sala`). Con él, el sujeto de `c1` lee lo pendiente del fichero y no de la skill, así que el RED no probaría el paso 1. La Task 1 borra ese fichero para que el molde sea el que la spec describe. No toco la spec aprobada; queda dicho aquí y en el resumen al dev-lead.
4. **`c2` pasa de n = 2 a n = 3 solo en el RED**: `N=3` en la línea de la previsión, sin tocar `battery.md` (la batería sigue con n = 2 para el GREEN).
5. **Coste de los sujetos**: previsión de la spec, 9 sujetos y 6,30 $ (RED 3,50 $ + GREEN 2,80 $). Salen de `scripts/plan.mjs` a 0,70 $ por sujeto. Si la prueba la supera, REFACTOR incluido, se para y decide el dev-lead (Art. 5).
6. **Task 3 depende del RED de `c2`**: se edita el paso 2 solo si el RED lo exhibe. Si no, la task no cambia la skill y solo corre el GREEN de `c2`.
7. **Estimación**: 1,5 h; ver el bloque de estimación.
8. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el aviso de cierre de `aviso-cierre` nombra lo que queda pendiente, sacado del roadmap.

**Architecture**: se edita el texto de `skills/aviso-cierre/SKILL.md` (paso 1 y, si el RED lo pide, paso 2) y se prueba con sujetos de la batería, RED antes de GREEN. El único fichero de prueba que cambia es el molde `mold-c`.

**Tech Stack**: Node 22 sin dependencias; los sujetos son Sonnet y la previsión sale de `scripts/plan.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un molde de prueba; no añade módulo, dependencia ni contrato.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (Art. 4 de la constitution).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su prueba con sujetos, RED antes de GREEN (Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- No se toca `ROADMAP.md` (fuera de scope).

### De proceso

- Native: la sesión implementa cada task con TDD; el RED de cada tanda de sujetos va antes de editar la skill.
- La previsión de coste se declara antes del primer sujeto; si se supera, se para.
- Commits con la convención del proyecto (`feat:`), un commit por task al quedar limpia su revisión.

## Review Focus

- Molde con `pendientes.md` → el RED de `c1` no vale: el sujeto lo lee del fichero, no de la skill · Task 1, comprobación de que `mold-c` ya no lo tiene (`git ls-files tests/batteries/aviso-cierre/mold-c`) antes de lanzar sujetos.
- Roadmap sin filas pendientes → el aviso dice que no queda nada pendiente, en vez de inventar filas · Task 2, lectura del resultado de `c1`: ningún sujeto cita una fila que no esté en el roadmap.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un cambio de una línea en la skill, y un tercero solo si el RED lo exhibe.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: la skill sigue con sus dos pasos y su orden; el paso 2 conserva el gate.
- [x] **Constitution check**: Arts. 2, 4 y 5 respetados; el gate de cierre es el de `operations.md`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/tasks.md` — registro vivo de la ejecución.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente; el paso 2, solo si el RED lo exhibe.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — el molde pasa a no tenerlo, como dice la spec.

**NO se tocan**:

- `ROADMAP.md` — fuera de scope en la spec.
- `tests/batteries/aviso-cierre/battery.md` — `c1` y `c2` ya existen; el n = 3 del RED va en la línea de la previsión.
- `src/`, `test/`, `scripts/` — no cambia el producto.

### 1.2 a 1.6

No aplican. Sin dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde sigue dando lo pendiente al sujeto y el RED pasa sin la skill | Media | Alto: un GREEN que no prueba nada | Task 1 borra `pendientes.md` y lo comprueba antes del primer sujeto |
| El coste de las tandas supera los 6,30 $ | Baja | Medio | Se declara antes del primer sujeto; si se supera, se para y decide el dev-lead |
| El RED de `c2` no exhibe fallo en el paso 2 | Media | Bajo | Task 3 no edita la skill y solo corre el GREEN de `c2` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED: el molde sin `pendientes.md` y los sujetos con la skill sin tocar

**Tras**: —
**Modelo**: la sesión (Native); sujetos con `model: sonnet`.
**Tests RED**: `c1` × 2 y `c2` × 3 sobre `mold-c`, con `skills/aviso-cierre/SKILL.md` sin cambios.
**Superficies**: tooling · docs
**Verificación**: `git ls-files tests/batteries/aviso-cierre/mold-c` → sin salida · `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` · `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`
**Se prueba en la aplicación**: no, porque es un molde de prueba: no cambia el producto.

**Interfaces**:
- Consume: nada.
- Produce: el molde `mold-c` sin `pendientes.md` y la evidencia del RED (salida de cada sujeto y qué dijo el aviso del paso 1 y, en `c2`, si repitió lo pendiente antes del gate), en la carpeta de la spec.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/evidencia-red.md`.

- [ ] **Step 1: Molde** — `git rm tests/batteries/aviso-cierre/mold-c/pendientes.md`; comprobar que `git ls-files tests/batteries/aviso-cierre/mold-c` no lista nada.
- [ ] **Step 2: Previsión** — correr las dos líneas de «Verificación» y declarar la suma (5 sujetos, 3,50 $) antes del primer sujeto.
- [ ] **Step 3: RED** — lanzar `c1` × 2 y `c2` × 3 con Sonnet. Esperado: ningún aviso nombra lo pendiente en el paso 1 (`c1`); en `c2`, anotar si el paso 2 repite lo pendiente antes de correr el gate.
- [ ] **Step 4: Evidencia y commit de la task** — escribir `evidencia-red.md` con la salida en bruto y la conclusión sobre el paso 2; un solo commit al quedar limpia la revisión.

### Task 2 — GREEN del paso 1

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos con `model: sonnet`.
**Tests RED**: los de la Task 1 (`c1`); ya fallan.
**Superficies**: docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` · los dos sujetos de `c1` nombran lo pendiente sacándolo del roadmap.
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no el producto.

**Interfaces**:
- Consume: el molde y la evidencia de la Task 1.
- Produce: el paso 1 de la skill con este texto exacto: `1. Di qué se cierra y qué queda pendiente, sacándolo del roadmap.`

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Implementación** — sustituir la línea del paso 1 por el texto exacto de «Produce»; el paso 2 queda como está.
- [ ] **Step 2: Build** — no hay build. Esperado: nada que construir.
- [ ] **Step 3: Verificación** — lanzar `c1` × 2 (1,40 $). Esperado: ambos avisos nombran lo pendiente; ninguno cita una fila que no esté en el roadmap.
- [ ] **Step 4: Commit de la task** — `feat: el aviso de cierre dice qué queda pendiente (0028)`.

### Task 3 — El paso 2 y el GREEN de `c2`

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos con `model: sonnet`.
**Tests RED**: `c2`, el de la Task 1.
**Superficies**: docs
**Verificación**: `SCENARIOS="c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` · `node --test && node scripts/lint.mjs` no es de esta task: va en §3.
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no el producto.

**Interfaces**:
- Consume: la conclusión sobre el paso 2 de `evidencia-red.md`.
- Produce: si el RED de `c2` exhibió el fallo, el paso 2 con este texto exacto: `2. Repite lo que queda pendiente y corre el gate.`; si no, la skill no cambia.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe).

- [ ] **Step 1: Implementación** — leer la conclusión del RED de `c2`. Si exhibió que el paso 2 no repite lo pendiente, sustituir la línea del paso 2 por el texto exacto de «Produce»; si no, no tocar la skill y anotarlo en el commit.
- [ ] **Step 2: Build** — no hay build.
- [ ] **Step 3: Verificación** — lanzar `c2` × 2 (1,40 $). Esperado: antes de correr el gate, ambos sujetos repiten lo pendiente.
- [ ] **Step 4: Commit de la task** — `feat: el paso 2 de aviso-cierre repite lo pendiente (0028)`; si la skill no cambió, `test: c2 verde con el paso 1 (0028)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 3 tasks encadenadas, 9 sujetos de prueba en dos tandas; la incertidumbre es el paso 2, que solo se edita si el RED lo exhibe. Sin referencia en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): el aviso nombra lo pendiente sacándolo del roadmap (`c1`) y, si se editó, el paso 2 lo repite antes del gate (`c2`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 2, `c1` × 2 en GREEN; Task 1 lo observa en RED. ✓
- Alcance «el paso 2 repite lo pendiente antes de correr el gate» → Task 3, `c2` × 2 en GREEN, con el RED de la Task 1. ✓
- GIVEN «un cierre sin `pendientes.md` en el molde» → Task 1, Step 1: el molde deja de tenerlo. ✓
- No entra el roadmap → N/A (confirmado en spec); «NO se tocan». ✓
- Previsión de coste (9 sujetos, 6,30 $) → Task 1 (5 sujetos) + Tasks 2 y 3 (4 sujetos). ✓
- Review Focus: molde con `pendientes.md` → Task 1, Step 1; roadmap sin pendientes → Task 2, Step 3. ✓
