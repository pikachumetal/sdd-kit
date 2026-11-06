---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos las hace la sesión en Native (Sonnet, effort medium): son edición de prosa de una skill de 2 líneas más lanzar sujetos. Los sujetos de la batería son Sonnet (`tech-stack.md`). La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: `native`, fijado en `sdd-kit.json`.
3. **El molde de `c1` es una copia de `mold-cierre` sin `.docs/sdd/pendientes.md`**, en `tests/batteries/aviso-cierre/mold-sin-lista/`: el actual lleva esa lista y `c1` pide un molde sin ella. `c2` sigue con `mold-cierre`. La spec no fija los moldes.
4. **La batería sube `c2` a n = 3 para el RED** (la spec fija n = 3) y vuelve a n = 2 para el GREEN, como dice la previsión de coste.
5. **El paso 2 de la skill solo se escribe si el RED de `c2` exhibe el fallo** (Scope de la spec). Si no lo exhibe, la Task 2 acaba sin editar la skill y lo deja dicho en el walkthrough.
6. **Coste**: el de la previsión de la spec, 6,30 $ (9 sujetos, ~0,70 $ cada uno según `tech-stack.md`). Si la prueba lo supera, REFACTOR incluido, se para y decide el dev-lead (Art. V). Tiempo: ~1,5 h.
7. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `aviso-cierre` nombre lo que queda pendiente (sacado del roadmap) cuando el molde no trae lista de pendientes.

**Architecture**: se edita solo `skills/aviso-cierre/SKILL.md`, test-first con sujetos (Art. V): RED sin tocar la skill, edición mínima, GREEN. Los sujetos cierran una feature en un molde y se lee su aviso.

**Tech Stack**: Node 22 sin dependencias; los sujetos son Sonnet; el gate es `node --test && node scripts/lint.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su batería; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED antes (Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task).
- La skill no toca `.docs/sdd/roadmap.md`: es lo que se lee, no lo que se edita (No entra de la spec).

### De proceso

- Sujetos: Sonnet. Previsión de coste de la spec: RED 3,50 $, GREEN 2,80 $.
- Commits: un commit por task al quedar limpia su revisión, con la atribución del kit.

## Review Focus

- Un molde cuyo roadmap no tiene filas pendientes → el aviso dice que no queda nada pendiente, no inventa filas · Task 1, sujeto `c1` con ese caso anotado en su rúbrica (si el RED no lo cubre, se añade como comprobación al leer los avisos)
- `c1` y `c2` en un molde que trae `pendientes.md` → el aviso sigue nombrando lo pendiente (de la lista o del roadmap) sin duplicarlo · Task 2, sujeto `c2`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas de skill como máximo.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: retrocompatible: el paso 1 sigue diciendo qué se cierra; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (tests antes), Art. 4 (castellano), Art. 5 (RED → GREEN con previsión de coste).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-sin-lista/` — copia de `mold-cierre` sin `.docs/sdd/pendientes.md`: el molde de `c1`.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 dice qué queda pendiente; el paso 2, solo si lo exhibe el RED.
- `tests/batteries/aviso-cierre/battery.md` — `c2` n = 3 en el RED, n = 2 en el GREEN.

**NO se tocan**:

- `.docs/sdd/roadmap.md` — fuera del Scope.
- `src/`, `test/` — el producto no cambia.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c2` no exhibe el fallo del paso 2 | Media | Bajo | No se escribe el paso 2 (decisión 5) |
| Sujetos más caros de lo previsto | Baja | Medio | Parar y que decida el dev-lead (Art. 5) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: la sesión en Native (Sonnet, effort medium); sujetos `model: sonnet`.
**Tests RED**: hilo principal · sujeto `c1` × 2 sobre `tests/batteries/aviso-cierre/mold-sin-lista/`, lanzado con la skill sin tocar; los avisos en bruto van a la carpeta de la spec.

**Superficies**: docs (skill) · tooling (batería)
**Verificación**: sujeto `c1` × 2 en GREEN: los dos avisos nombran las filas del roadmap que siguen abiertas (0010, 0011, 1) y no tocan el roadmap; `git diff --stat` solo muestra los ficheros de §1.1.

**Interfaces**:
- Consume: nada.
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 corregido y `mold-sin-lista`, que usa la Task 2 como referencia de molde sin lista.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-sin-lista/` (copia de `mold-cierre` sin `.docs/sdd/pendientes.md`); modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde** — copiar `mold-cierre` a `mold-sin-lista` y borrar de la copia `.docs/sdd/pendientes.md`.
- [ ] **Step 2: RED** — lanzar `c1` × 2 con la skill tal cual. Esperado: los avisos dicen qué se cierra y no nombran lo pendiente; se guardan en bruto. Si lo nombran, no hay RED: parar y decirlo.
- [ ] **Step 3: Implementación** — el paso 1 pasa a «Di qué se cierra y qué queda pendiente, sacándolo del roadmap». El texto exacto es el de esa frase; el implementador no añade más.
- [ ] **Step 4: GREEN** — lanzar `c1` × 2. Esperado: los dos avisos nombran 0010, 0011 y la fila 1.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

---

### Task 2 — El paso 2 repite lo pendiente (solo si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: la sesión en Native (Sonnet, effort medium); sujetos `model: sonnet`.
**Tests RED**: hilo principal · sujeto `c2` × 3 sobre `mold-cierre`, con la skill ya con el paso 1 corregido; los avisos en bruto van a la carpeta de la spec.

**Superficies**: docs (skill) · tooling (batería)
**Verificación**: sujeto `c2` × 2 en GREEN: el aviso repite lo pendiente antes de correr el gate. Sin RED que lo exhiba, la verificación es el RED mismo y la skill queda sin cambios.

**Interfaces**:
- Consume: `skills/aviso-cierre/SKILL.md` de la Task 1; la batería con `c2`.
- Produce: la skill final.

**Ficheros**: modificar `tests/batteries/aviso-cierre/battery.md` y, si procede, `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Batería** — `c2` pasa a n = 3 para el RED.
- [ ] **Step 2: RED** — lanzar `c2` × 3. Esperado: se anota en cuántos el paso 2 corre el gate sin repetir lo pendiente. Si en ninguno, parar aquí: el paso 2 no se escribe (decisión 5), `c2` vuelve a n = 2 y la task acaba sin commit de skill.
- [ ] **Step 3: Implementación** — solo con RED exhibido: el paso 2 pasa a «Repite lo pendiente y corre el gate».
- [ ] **Step 4: GREEN** — `c2` vuelve a n = 2 y se lanza ×2. Esperado: ambos repiten lo pendiente antes del gate.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks, 9 sujetos, la calibración del proyecto aún sin notas
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: coste real de los sujetos ≤ 6,30 $
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en GREEN: nombran 0010, 0011 y la fila 1. ✓
- «Entra, si el RED lo exhibe: el paso 2 repite lo pendiente» → Task 2, `c2` × 3 en RED y × 2 en GREEN. ✓
- No entra: el roadmap → Task 1, `git diff --stat` sin `.docs/sdd/roadmap.md`. ✓
- Previsión de coste → §3, coste real frente a 6,30 $. ✓
- Review Focus, línea 1 → Task 1, `c1`. ✓
- Review Focus, línea 2 → Task 2, `c2`. ✓
