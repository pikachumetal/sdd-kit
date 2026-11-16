---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las 3 tasks las hace la sesión (Native), sin despacho; los sujetos de la batería van con Sonnet (`operations.md` §Testing). La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde no cumple el GIVEN de la spec**: la spec dice que `mold-c` no tiene `pendientes.md`, pero lo tiene (`- 0011: responsables de sala`) y no tiene `ROADMAP.md`. Con ese molde el sujeto de `c1` saca lo pendiente del fichero y no de la skill: el RED no exhibiría nada, y sin roadmap el THEN («sacándolo del roadmap») no se puede observar. La Task 1 deja el molde como pide el GIVEN: borra `mold-c/pendientes.md` y añade `mold-c/ROADMAP.md` con la fila pendiente 0011. Es una corrección de fixture, no de alcance: el roadmap del proyecto («No entra») no se toca.
4. **`c2` con n = 3 en el RED**: la batería declara n = 2 para `c2` y la spec pide 3. No se edita la batería: el RED corre con `N=3` sobre `c2` (la previsión: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`). El GREEN usa los n de la batería (2).
5. **Una sola tanda RED para las dos tasks de texto**: `c1` × 2 y `c2` × 3 se lanzan juntos antes de editar la skill (Art. 5), 5 sujetos, 3,50 $. Así la Task 3 sabe si el RED exhibe el fallo del paso 2.
6. **Paso 2 condicional**: la spec lo admite «si el RED lo exhibe». Si `c2` pasa en RED, la Task 3 no escribe el paso 2 y lo anota en el walkthrough.
7. **Coste**: 9 sujetos, 6,30 $ (RED 3,50 + GREEN 2,80), el de la spec. Si la prueba lo supera, una tanda de REFACTOR incluida, se para y decide el dev-lead (Art. 5). Horas: ~1,5 h.
8. **Riesgo alto**: la variabilidad de los sujetos con n = 2; un `c1` GREEN que pase una vez de dos no vale, se repite la tanda solo con el dev-lead.

Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo pendiente, sacado del roadmap; y, si el RED lo exhibe, el paso 2 lo repite antes de correr el gate.

**Architecture**: es texto de una skill probada con sujetos (RED → GREEN) sobre la batería `aviso-cierre`; no hay código. Primero se deja el molde según el GIVEN, después se mide el fallo, después se escribe lo mínimo.

**Tech Stack**: Node 22 sin dependencias; `scripts/plan.mjs` para la previsión y `node --test` + `scripts/lint.mjs` como gate.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su molde de prueba; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED medido antes (constitution, art. 5).
- La previsión de coste de la spec: 9 sujetos, 6,30 $; si se supera, se para y decide el dev-lead.
- No se toca `ROADMAP.md` del proyecto (spec, «No entra»).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Native: la sesión implementa cada task; sujetos con Sonnet; revisión final de rama por `sdd-verify`.
- Commits con la atribución que fije el proyecto; uno por task al quedar limpia su revisión.

## Review Focus

- `c1` con el molde sin `pendientes.md` pero con `ROADMAP.md` de una fila → el aviso nombra `0011` y su título, no inventa pendientes · Task 2, `c1` GREEN.
- Molde con el roadmap vacío de pendientes → el aviso no inventa nada ni falla; dice que no queda nada · Task 2, `c1` GREEN (se comprueba a mano sobre la salida de un sujeto con el molde sin la fila).
- Un `c2` que ya pasa en RED → no se escribe el paso 2 (YAGNI) · Task 3, decisión registrada en la salida del RED.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas de skill como máximo.
- [x] **YAGNI gate**: el paso 2 solo si el RED lo exhibe.
- [x] **Brownfield gate**: retrocompatible; sin refactor fuera de `aviso-cierre`.
- [x] **Constitution check**: arts. 1, 2, 4 y 5 respetados; el art. 5 gobierna el orden de las tasks.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/ROADMAP.md` — roadmap del molde con una fila pendiente (`0011`), para que lo pendiente salga del roadmap.

**Modificar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — se borra (GIVEN de la spec).
- `skills/aviso-cierre/SKILL.md` — paso 1 nombra lo pendiente; paso 2, solo si el RED lo exhibe.

**NO se tocan**:

- `tests/batteries/aviso-cierre/battery.md` — `c2` queda con n = 2; el RED usa `N=3`.
- `ROADMAP.md` del proyecto — fuera de alcance.
- `src/`, `test/` — no hay código.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde corregido no refleja el GIVEN y el RED no falla | media | alto | Task 1 comprueba el molde antes de gastar sujetos |
| Sujetos con n = 2 dan un GREEN ruidoso | media | medio | criterio de paso: los 2 sujetos de `c1` nombran lo pendiente |
| Se supera el coste previsto | baja | medio | parar y decidir el dev-lead (art. 5) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde según el GIVEN y tanda RED

**Tras**: —
**Modelo**: sesión Native (Sonnet, effort medium); sujetos `sonnet`.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, filas `c1` y `c2`; la skill aún sin editar.

**Superficies**: tooling · docs
**Verificación**:
- `SCENARIOS="c1" node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`
- `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`
- RED: los 2 sujetos de `c1` no nombran `0011` en el aviso (si lo nombran, el molde sigue filtrando lo pendiente: se para y se revisa).
**Se prueba en la aplicación**: no, porque es una skill, no una aplicación.

**Interfaces**:
- Consume: nada.
- Produce: `mold-c` sin `pendientes.md` y con `ROADMAP.md`; la salida en bruto del RED de `c1` × 2 y `c2` × 3, guardada en la carpeta de la spec.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `tests/batteries/aviso-cierre/mold-c/ROADMAP.md`.

- [ ] **Step 1: Molde** — borrar `mold-c/pendientes.md`; crear `mold-c/ROADMAP.md` con la tabla `Now` y una sola fila `0011 · Responsables de sala · ⏳`.
- [ ] **Step 2: Previsión** — correr los dos comandos de «Verificación»; esperado: 1.40 $ y 2.10 $, total 3,50 $, lo de la spec.
- [ ] **Step 3: RED** — lanzar `c1` × 2 y `c2` × 3 con la skill sin editar; guardar las salidas; esperado: `c1` no nombra `0011`. Anotar si `c2` falla (decide la Task 3).
- [ ] **Step 4: Commit de la task** — molde y salidas del RED.

### Task 2 — Paso 1 nombra lo pendiente (GREEN de `c1`)

**Tras**: Task 1
**Modelo**: sesión Native (Sonnet, effort medium); sujetos `sonnet`.
**Tests RED**: los de la Task 1 (`c1`), ya medidos.

**Superficies**: docs
**Verificación**: `SCENARIOS="c1" node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`; GREEN: los 2 sujetos de `c1` nombran `0011` sacado de `ROADMAP.md`.
**Se prueba en la aplicación**: no, porque es una skill, no una aplicación.

**Interfaces**:
- Consume: el molde de la Task 1.
- Produce: paso 1 de `skills/aviso-cierre/SKILL.md` con el texto que pide la spec.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Paso 1** — el paso 1 pasa de «Di qué se cierra.» a «Di qué se cierra y qué queda pendiente, sacándolo del roadmap.» Solo ese cambio.
- [ ] **Step 2: GREEN** — lanzar `c1` × 2; esperado: los 2 nombran `0011`.
- [ ] **Step 3: Commit de la task** — skill y salidas del GREEN.

### Task 3 — Paso 2 repite lo pendiente, si el RED lo exhibe (GREEN de `c2`)

**Tras**: Task 2
**Modelo**: sesión Native (Sonnet, effort medium); sujetos `sonnet`.
**Tests RED**: `c2` × 3 de la Task 1.

**Superficies**: docs
**Verificación**: `SCENARIOS="c2" node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`; GREEN: los 2 sujetos de `c2` repiten lo pendiente antes de correr el gate. Si `c2` pasó en RED: no se edita, no se lanza el GREEN y se anota en el walkthrough.
**Se prueba en la aplicación**: no, porque es una skill, no una aplicación.

**Interfaces**:
- Consume: paso 1 de la Task 2; el resultado de `c2` en el RED.
- Produce: paso 2 de `skills/aviso-cierre/SKILL.md`, o nada.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si `c2` falló en RED)

- [ ] **Step 1: Decidir** — si `c2` falló en RED, el paso 2 pasa a «Repite lo pendiente y corre el gate.»; si no, parar aquí.
- [ ] **Step 2: GREEN** — lanzar `c2` × 2; esperado: los 2 repiten lo pendiente antes del gate.
- [ ] **Step 3: Commit de la task** — skill y salidas del GREEN.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 3 tasks, 9 sujetos de skill, esperas de sujetos; incertidumbre en el molde y en el ruido con n = 2; sin referencia en `estimation-log.md`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 2, `c1` GREEN (los 2 sujetos nombran `0011` de `ROADMAP.md`) y Task 1, `c1` RED (no lo nombraban). ✓
- GIVEN «un cierre sin `pendientes.md` en el molde» → Task 1, Step 1 (molde corregido; la spec lo daba por cierto y no lo era). ✓
- Alcance «paso 2 repite lo pendiente, si el RED lo exhibe» → Task 3, `c2` RED n = 3 y GREEN n = 2. ✓
- «No entra: el roadmap» → N/A, `ROADMAP.md` del proyecto no se toca. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Tasks 1 (5), 2 (2) y 3 (2). ✓
- Review Focus → Task 2, `c1` GREEN (entradas 1 y 2) y Task 3, Step 1 (entrada 3). ✓
