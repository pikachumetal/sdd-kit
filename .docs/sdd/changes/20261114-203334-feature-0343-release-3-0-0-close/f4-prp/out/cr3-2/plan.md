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

1. **Modelo y effort**: lo implementa la sesión (Native). Los sujetos de la batería van con `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (el modelo de `battery.md` y de `operations.md`). La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde no cumple el GIVEN de `c1`**: `mold-cierre/.docs/sdd/pendientes.md` (oculto) ya trae una lista de pendientes (`0011: responsables de sala`) y el `ROADMAP.md` del molde está vacío. Un sujeto que lee `pendientes.md` nombraría lo pendiente sin que el paso 1 lo diga, y el RED no distinguiría nada. La Task 1 borra `pendientes.md` y pone en el `ROADMAP.md` del molde la fila pendiente `0011`.
4. **El gate de cierre falla de base**: `node --test` recoge `mold-cierre/test/app.test.js`, cuyo contenido es `# test/app.test.js` (no es JavaScript) → `ℹ fail 1`. Medido en esta rama antes de tocar nada. La Task 1 pone `//` en vez de `#` en esa primera línea para que el gate pueda pasar; es un fichero del molde, ningún sujeto lo lee para decidir.
5. **`battery.md` no dice qué hace cada sujeto ni cómo se puntúa**. La Task 1 añade bajo la tabla el enunciado común y el criterio de `c1` y de `c2`, antes del primer sujeto: sin criterio escrito el RED no se puede falsar.
6. **«Si el RED lo exhibe» (paso 2)**: se aplica la regla de `sdd-implement`: un RED limpio con n = 3 (los 3 sujetos de `c2` cumplen el criterio) saca el paso 2 del alcance con un `Ruling:`; con que uno falle, la Task 3 entra. `c2` se ejecuta antes de escribir el paso 1 (así lo fija la tabla de coste de la spec), así que su RED no separa el efecto del paso 1 del del paso 2. Los 2 sujetos de la GREEN de `c1` también se puntúan con el criterio de `c2`, sin coste extra, y el resultado se anota.
7. **Coste**: el de la spec, 6,30 $ (9 sujetos × ~0,70 $): RED 3,50 $ (Task 1), GREEN `c1` 1,40 $ (Task 2), GREEN `c2` 1,40 $ (Task 3, solo si entra). No hay tanda de REFACTOR prevista: si una GREEN falla y hace falta una, el total supera la previsión y se para a decidir con el dev-lead (Art. 5 de la constitution).
8. **Sin observar**: un `ROADMAP.md` sin nada pendiente. La spec no lo fija y la batería no lo cubre (no hay presupuesto para otro escenario); el texto del paso 1 no inventa nada que decir en ese caso. ⚠ avisado aquí.
9. **Capacidades**: el delta de la spec nombra la capacidad `aviso-cierre` y su apartado «Capacidades» dice «Ninguna»; no existe `capabilities/` y este plan no la crea.
10. **Estimación**: 2 h de implementación, confianza media.

Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: El paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo que queda pendiente en el roadmap, y el paso 2 lo repite antes del gate si el RED lo exhibe.

**Architecture**: Es texto de una skill con su prueba con sujetos (Art. 5): primero se arregla el molde y se mide el RED, después se escribe cada paso y se mide su GREEN. No hay código de producción.

**Tech Stack**: Node 22 sin dependencias (solo para `scripts/plan.mjs`, `scripts/lint.mjs` y `node --test`); Markdown.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y ficheros de un molde de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de los documentos y de la skill en castellano (Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- El paso 1 de la skill dice qué queda pendiente y lo saca de `ROADMAP.md`; el roadmap del proyecto no se toca (Scope: «No entra: el roadmap»).
- Los sujetos corren sobre una copia nueva del molde fuera del repo, con `skills/aviso-cierre/SKILL.md` en la versión de ese momento.

### De proceso

- Política de modelos: sujetos con Sonnet (`subagent_type: sdd-kit:effort-medium` + `model: sonnet`); sin Haiku, `fable` ni `opus xhigh`.
- Modo de ejecución: native.
- Commits con la convención del proyecto (`feat:`, `test:`, `docs:`) y, al final, `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Ninguna edición de la skill antes de que el RED esté medido (Art. 5). Si el coste supera 6,30 $, se para.

## Review Focus

- `.docs/sdd/pendientes.md` oculto en el molde → el molde de `c1` no lo tiene, y `git ls-files -- tests/batteries/aviso-cierre/mold-cierre` no lo lista · Task 1, paso de verificación del molde.
- Que el sujeto saque lo pendiente del roadmap y no de otra parte → el único sitio con una fila pendiente en el molde es `ROADMAP.md` (`0011`) · Task 1 (molde) y Task 2 (c1 GREEN lo nombra).
- Que el gate de cierre pase tras tocar el molde → `node --test` sin ningún `✖` · Task 1, `node --test` → `ℹ fail 0`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos pasos de texto y un molde; nada más.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: retrocompatible; sin refactor fuera de scope (el roadmap del proyecto no se toca).
- [x] **Constitution check**: Art. 2 (gate de cierre en verde: Task 1 lo arregla), Art. 4 (castellano), Art. 5 (RED → GREEN y previsión declarada).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/red.md` — salida en bruto de los 5 sujetos del RED y su puntuación.
- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/green.md` — salida en bruto de las GREEN y su puntuación.
- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/tasks.md` — registro vivo.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 2) y, si entra, paso 2 (Task 3).
- `tests/batteries/aviso-cierre/battery.md` — enunciado y criterio de `c1` y `c2`.
- `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md` — una fila en curso (`0010`) y una pendiente (`0011`).
- `tests/batteries/aviso-cierre/mold-cierre/test/app.test.js` — primera línea con `//`.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — la lista de pendientes que contradice el GIVEN.

**NO se tocan**:

- `ROADMAP.md` del proyecto — fuera de scope.
- El resto de ficheros del molde (`README.md`, `docs/`, `src/`) — no intervienen en el aviso.
- `scripts/plan.mjs` — solo se usa para la previsión.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una GREEN falla y hace falta REFACTOR | media | supera 6,30 $ | Parar y decidir con el dev-lead antes de otra tanda (Art. 5) |
| El RED de `c2` sale limpio y el paso 2 no entra | baja | Task 3 saltada | `Ruling:` y `skipped` en `tasks.md`; coste real 4,90 $ |
| Los sujetos leen `pendientes.md` o el repo en vez del molde | baja | RED/GREEN sin valor | Copia del molde fuera del repo, sin `pendientes.md` |

### 1.8 Rollout

Directo: es una skill del propio repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde falsable y RED

**Tras**: —
**Modelo**: la sesión (Native, Sonnet effort medium). Sujetos: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: la propia tanda RED: `c1` × 2 y `c2` × 3 contra el `SKILL.md` actual, sin editarlo; salida en bruto en `red.md`.
**Superficies**: tooling · docs
**Verificación**:
- `node --test` → `ℹ fail 0`
- `git ls-files -- tests/batteries/aviso-cierre/mold-cierre` no incluye `pendientes.md`
- `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`
- `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`

**Interfaces**:
- Consume: nada.
- Produce: molde con `ROADMAP.md` que tiene `0010` en curso y `0011` pendiente y sin `pendientes.md`; en `battery.md`, el criterio de `c1` («el aviso del paso 1 nombra `0011` / «responsables de sala») y el de `c2` («`0011` aparece otra vez en el mensaje, después de la salida del gate»); `red.md` con una línea de veredicto por sujeto.

**Ficheros**: modificar `tests/batteries/aviso-cierre/battery.md`, `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md`, `tests/batteries/aviso-cierre/mold-cierre/test/app.test.js`; borrar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`; crear `red.md`.

- [ ] **Step 1: Molde** — borrar `pendientes.md`; `ROADMAP.md` del molde con las filas `0010` (Motivo al cancelar, 🔄, la que se cierra) y `0011` (Responsables de sala, ⏳); `test/app.test.js` del molde con `// test/app.test.js`.
- [ ] **Step 2: Criterio** — bajo la tabla de `battery.md`, el enunciado común («Cierra la feature 0010 con la skill `skills/aviso-cierre/SKILL.md`; el molde es tu directorio de trabajo») y el criterio de `c1` y de `c2` con las frases de «Produce».
- [ ] **Step 3: Verificación del molde** — `node --test` → `ℹ fail 0`; `git ls-files` sin `pendientes.md`.
- [ ] **Step 4: Previsión** — los dos `plan.mjs`, antes del primer sujeto; suman 5 sujetos y 3,50 $, igual que la spec.
- [ ] **Step 5: RED** — 5 sujetos (`c1` × 2, `c2` × 3), cada uno sobre una copia nueva del molde fuera del repo con el `SKILL.md` actual; volcar cada salida en bruto a `red.md` y puntuarla. Esperado: `c1` falla en los 2 (el aviso no nombra `0011`). Anotar cuántos de `c2` cumplen el criterio: con 3 de 3 el paso 2 sale con `Ruling:`.
- [ ] **Step 6: Commit de la task** — `test: molde falsable y RED de aviso-cierre (0028)`.

### Task 2 — Paso 1 del aviso y GREEN de `c1`

**Tras**: Task 1
**Modelo**: la sesión (Native, Sonnet effort medium). Sujetos: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: el RED de `c1` de la Task 1 (`red.md`).
**Superficies**: docs
**Verificación**:
- `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`
- GREEN de `c1`: los 2 sujetos cumplen su criterio (el aviso nombra `0011`, sacado de `ROADMAP.md`).

**Se prueba en la aplicación**: no, porque no cambia ninguna aplicación: es una skill.

**Interfaces**:
- Consume: el molde y el criterio de `c1` de la Task 1.
- Produce: `SKILL.md` con el paso 1 `1. Di qué se cierra y nombra lo que queda pendiente, sacándolo de \`ROADMAP.md\`.`; el paso 2 queda como está; `green.md` con la GREEN de `c1` y, aparte, la puntuación de esos 2 sujetos con el criterio de `c2`.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`; crear `green.md`.

- [ ] **Step 1: Implementación** — el paso 1 con el texto de «Produce», sin tocar el paso 2.
- [ ] **Step 2: GREEN** — 2 sujetos de `c1` sobre copia nueva del molde con el `SKILL.md` nuevo; salida en bruto a `green.md`. Esperado: los 2 cumplen. Si alguno falla: parar (una tanda de REFACTOR supera la previsión; decide el dev-lead).
- [ ] **Step 3: Commit de la task** — `feat: el aviso de cierre nombra lo pendiente (0028)`.

### Task 3 — Paso 2 repite lo pendiente (solo si el RED lo exhibe)

**Tras**: Task 2
**Modelo**: la sesión (Native, Sonnet effort medium). Sujetos: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: el RED de `c2` de la Task 1 (`red.md`). Entra si al menos 1 de los 3 sujetos no cumplió el criterio; con 3 de 3 limpios, esta task se salta: `Ruling:` y `skipped` en `tasks.md`.
**Superficies**: docs
**Verificación**:
- `SCENARIOS="c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`
- GREEN de `c2`: los 2 sujetos cumplen su criterio (`0011` aparece otra vez después de la salida del gate).

**Se prueba en la aplicación**: no, porque no cambia ninguna aplicación: es una skill.

**Interfaces**:
- Consume: `SKILL.md` de la Task 2 y el criterio de `c2`.
- Produce: `SKILL.md` con el paso 2 `2. Repite lo que queda pendiente y corre el gate.`; la GREEN de `c2` en `green.md`.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `green.md`.

- [ ] **Step 1: Implementación** — el paso 2 con el texto de «Produce». Se comprueba antes en `red.md` que la condición de entrada se cumple.
- [ ] **Step 2: GREEN** — 2 sujetos de `c2`; salida en bruto a `green.md`. Esperado: los 2 cumplen. Si alguno falla: parar (supera la previsión).
- [ ] **Step 3: Commit de la task** — `feat: el aviso repite lo pendiente antes del gate (0028)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 2 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 3 tasks (la 3.ª condicional), 9 sujetos como mucho, sin código de producción; sin estimation-log previo
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1 (RED de `c1` falla) y Task 2 (GREEN de `c1`: el aviso nombra `0011` y solo `ROADMAP.md` lo trae). ✓
- GIVEN «un molde sin lista de pendientes» → Task 1, `git ls-files` sin `pendientes.md`. ✓
- Scope «el paso 2 repite lo pendiente, si el RED lo exhibe» → Task 3, GREEN de `c2`, o `Ruling:` si el RED sale limpio. ✓
- Previsión de coste (RED 3,50 · GREEN 2,80 · 6,30 $) → Task 1 (RED), Tasks 2 y 3 (GREEN). ✓
- «No entra: el roadmap» → ninguna task toca `ROADMAP.md` del proyecto. ✓
- Roadmap sin pendientes → sin observar: la batería no lo cubre (avisado en las decisiones). ⚠
- Review Focus → Task 1 (molde, `node --test`) y Task 2 (c1 GREEN). ✓
