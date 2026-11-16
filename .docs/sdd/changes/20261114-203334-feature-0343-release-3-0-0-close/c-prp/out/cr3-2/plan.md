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

1. **Modelo y effort**: las dos tasks las hace la sesión (Native) con Sonnet, effort medium: es editar prosa de una skill de 2 pasos y leer la salida de sujetos; el plan lleva el texto exacto. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks, no una**: el paso 2 de la skill solo entra si el RED de `c2` lo exhibe (spec, Scope); partir deja que la Task 1 se cierre sola y que la Task 2 pueda cerrarse sin tocar la skill.
4. **El texto del paso 1** lo fija este plan, porque la spec solo dice «nombra lo pendiente sacándolo del roadmap»: «Di qué se cierra y qué queda pendiente: léelo de `ROADMAP.md`, las filas sin cerrar, y nómbralas.»
5. **Riesgos altos**: el coste (constitución, art. 5). Previsión de la spec: 9 sujetos, 6,30 $. Si la prueba lo supera, REFACTOR incluido, se para y decide el dev-lead.
6. **Coste estimado**: 1,5 h; dinero, el de la previsión (6,30 $).
7. **Gate de cierre**: el de `operations.md` §Testing, literal.
8. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo pendiente, y el paso 2 lo repite antes del gate solo si el RED de `c2` lo exhibe.

**Architecture**: se edita el texto de una skill; no hay código. La prueba son sujetos de la batería `tests/batteries/aviso-cierre/` (RED → GREEN, constitución art. 5), uno por tanda, con el molde `mold-cierre`.

**Tech Stack**: Node ≥ 20, `node --test`, `scripts/lint.mjs`, `scripts/plan.mjs` para la previsión.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitución, art. 4).
- Ninguna edición de la skill sin su prueba con sujetos, RED antes que GREEN (art. 5); sujetos con Sonnet.
- El roadmap no se toca (spec, «No entra»).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Modo de ejecución: Native; sin modelos prohibidos por defecto distintos de los de `sdd-verify`.
- Commits con la atribución del harness; uno por task al quedar limpia su revisión.
- La previsión de una tanda: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`; se corre antes del primer sujeto de cada tanda.

## Review Focus

- El roadmap del molde no tiene filas pendientes → el aviso dice que no queda nada pendiente, no inventa filas · Task 1, la observación de `c1` en GREEN (se lee la salida de cada sujeto, no solo que nombre algo).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase en el paso 1 y, solo si hace falta, otra en el paso 2.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: retrocompatible; el resto de la skill queda igual.
- [x] **Constitution check**: arts. 2, 4 y 5 respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, si el RED lo exhibe, paso 2 (Task 2).

**NO se tocan**:

- `ROADMAP.md` — la spec lo deja fuera.
- `tests/batteries/aviso-cierre/mold-cierre/` y `battery.md` — son la prueba, no el cambio.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La prueba supera los 6,30 $ | media | para y decide el dev-lead | previsión con `plan.mjs` antes de cada tanda; se cuenta REFACTOR |
| El RED de `c2` no falla | media | el paso 2 sobra | la Task 2 se cierra sin tocar la skill, con la evidencia de los 3 sujetos |
| Los prompts de `c1` y `c2` no están en el repo (la batería solo tiene la tabla) | media | no hay sujeto que correr | se para y se pregunta al dev-lead antes de inventarlos |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: Sonnet, effort medium; la hace el hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `c1` × 2 sujetos sobre la skill sin tocar, en el molde sin lista de pendientes; deben fallar (el aviso no nombra lo pendiente). Previsión antes: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`.

**Superficies**: docs (skill)
**Verificación**: `c1` × 2 sujetos en GREEN: los dos avisos nombran lo pendiente sacado del roadmap · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es el texto de una skill: se prueba con sujetos.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de `skills/aviso-cierre/SKILL.md` con este texto exacto: `1. Di qué se cierra y qué queda pendiente: léelo de ROADMAP.md, las filas sin cerrar, y nómbralas.`

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: RED** — previsión con `plan.mjs`, `c1` × 2 sujetos sobre la skill sin tocar. Esperado: los dos avisos no nombran lo pendiente. Si alguno lo nombra, se anota y se decide con lo observado.
- [ ] **Step 2: Implementación** — sustituir el paso 1 por el texto de «Produce»; el paso 2 queda igual.
- [ ] **Step 3: GREEN** — `c1` × 2 sujetos. Esperado: ambos nombran lo pendiente; si el molde no tiene filas pendientes, dicen que no queda nada (Review Focus). `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión (`feat: el aviso de cierre nombra lo pendiente`).

### Task 2 — El paso 2 repite lo pendiente (solo si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: Sonnet, effort medium; la hace el hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `c2` × 3 sujetos con la skill de la Task 1, antes de escribir el paso 2. Previsión antes: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`.

**Superficies**: docs (skill)
**Verificación**: `c2` × 2 sujetos en GREEN, solo si se escribió el paso 2: el aviso repite lo pendiente antes de correr el gate · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es el texto de una skill: se prueba con sujetos.

**Interfaces**:
- Consume: el paso 1 de la Task 1.
- Produce: solo si el RED falla, el paso 2 de `skills/aviso-cierre/SKILL.md` con este texto exacto: `2. Repite lo pendiente y corre el gate.`

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe)

- [ ] **Step 1: RED** — previsión con `plan.mjs` y `c2` × 3 sujetos. Esperado: al menos un sujeto no repite lo pendiente antes del gate. Si los 3 lo repiten, la skill no cambia: se registra la evidencia, el paso 2 no entra y la task se cierra sin commit de skill.
- [ ] **Step 2: Implementación** *(solo con RED)* — sustituir el paso 2 por el texto de «Produce».
- [ ] **Step 3: GREEN** *(solo con RED)* — `c2` × 2 sujetos. Esperado: ambos repiten lo pendiente antes del gate. `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — uno solo (`feat: el aviso repite lo pendiente antes del gate`); sin RED, solo la evidencia en la carpeta de la spec.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks, 9 sujetos de ~0,7 $ cada uno; incertidumbre en si hay paso 2 y en los prompts de la batería
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): el aviso del molde nombra lo pendiente
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Coste de la prueba ≤ 6,30 $; si lo supera, se paró y decidió el dev-lead
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en GREEN: el aviso del molde sin lista de pendientes nombra lo pendiente del roadmap. ✓
- Entra, si el RED lo exhibe: el paso 2 repite lo pendiente antes del gate → Task 2, `c2` × 3 en RED y `c2` × 2 en GREEN. ✓
- No entra: el roadmap → `ROADMAP.md` en «NO se tocan». ✓
- Previsión de coste (9 sujetos, 6,30 $) → RED 2 + 3 y GREEN 2 + 2 entre las dos tasks; `plan.mjs` antes de cada tanda. ✓
- Review Focus: roadmap sin filas pendientes → Task 1, observación de `c1` en GREEN. ✓
