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

1. **Modelo y effort por task**: la sesión (Native) las hace con Sonnet, effort medium; editar una skill de dos líneas y despachar sujetos no pide más. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Código; Arquitectura no aplica).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde no cumple la premisa de `c1`**: `tests/batteries/aviso-cierre/mold-cierre/` trae `.docs/sdd/pendientes.md` (con «0011») y su `ROADMAP.md` está vacío (`# ROADMAP.md`). La spec pide «un molde sin lista de pendientes» y que lo pendiente salga del roadmap. La Task 1 borra `pendientes.md` del molde y pone en su `ROADMAP.md` una fila pendiente (`0011`, ⏳) y otra cerrada.
4. **Los criterios de `c1` y `c2` no están escritos en la batería**: `battery.md` solo lista ids, pasos, n y modelo. Se escriben aquí, en cada task, y no se añade columna a `battery.md` (`scripts/plan.mjs` lee la columna 3 como n).
5. **`c2` es condicional**: el paso 2 se escribe solo si el RED con n = 3 lo exhibe. Se exhibe si al menos 1 de los 3 sujetos corre el gate sin repetir lo pendiente. Si los 3 lo repiten sin el paso 2, la Task 2 acaba sin tocar la skill y el paso 2 sale del scope por enmienda.
6. **Coste**: el de la spec, 9 sujetos y 6,30 $ (RED 5 × 0,70 = 3,50 $; GREEN 4 × 0,70 = 2,80 $). Si una tanda lo supera, se para y decide el dev-lead (constitution, Art. 5). Una tanda de REFACTOR cuenta contra esa previsión.
7. **Riesgos altos**: un sujeto puede pasar `c1` por leer la skill y no por el cambio. El criterio exige que el aviso nombre la fila `0011` del `ROADMAP.md` del molde, que ningún otro fichero del molde contiene como pendiente.
8. **Roadmap sin fila pendiente no se ejercita**: pedirlo exigiría sujetos con otro molde y rompería la previsión de 9 sujetos de la spec. La skill dice «si no queda nada, dilo» y queda sin observar; se avisa aquí, antes de ejecutar.
9. **Coste estimado**: 1,5 h, más 6,30 $ de sujetos.

Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el aviso de cierre de `aviso-cierre` nombra lo que queda pendiente, y, si el RED lo exhibe, el paso 2 lo repite antes de correr el gate.

**Architecture**: se edita `skills/aviso-cierre/SKILL.md` guiada por RED → GREEN con sujetos sobre el molde `mold-cierre`. No hay código de producción ni módulos nuevos.

**Tech Stack**: Node 22 sin dependencias; `node --test`, `scripts/lint.mjs`, `scripts/plan.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y el molde de su batería; no hay módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill, del molde y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED con sujetos antes (constitution, Art. 5).
- `skills/aviso-cierre/SKILL.md` conserva el frontmatter (`name`, `description`) y sus pasos numerados.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código claro.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Sujetos: Sonnet. Un sujeto cuesta ~0,70 $. La previsión de una tanda: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.
- Modo de ejecución: native.
- Commits: convención del proyecto (`feat:`), con la atribución del kit al final.
- El hilo principal despacha los sujetos; cada sujeto trabaja sobre una copia del molde en un directorio temporal, no sobre el molde.

## Review Focus

- Molde con `pendientes.md` además del roadmap → el aviso toma lo pendiente del `ROADMAP.md`, la fuente que dice la spec, y no del fichero que quedó · Task 1, el molde ya no lo trae y el criterio de `c1` exige la fila del roadmap.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: dos pasos de skill y un molde; no hay forma más simple.
- [ ] **YAGNI gate**: sin abstracciones.
- [ ] **Brownfield gate**: respeta el patrón de la batería y no toca `scripts/` ni `src/`.
- [ ] **Constitution check**: Art. 4 (castellano) y Art. 5 (RED → GREEN y previsión de coste) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 dice qué se cierra y qué queda pendiente, sacado del `ROADMAP.md`; si el RED de `c2` lo exhibe, el paso 2 repite lo pendiente antes de correr el gate.
- `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md` — de vacío a una fila pendiente (`0011`, ⏳) y otra cerrada.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — el molde no puede tener lista de pendientes para que `c1` pruebe la spec.

**NO se tocan**:

- `tests/batteries/aviso-cierre/battery.md` — la batería ya trae `c1` y `c2`; el n de la tanda se pasa con `N=`.
- `scripts/`, `src/`, `test/` — no hay código de producción.
- El `ROADMAP.md` del repo — fuera del scope.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `c1` pasa sin que el paso 1 cambie | media | falso GREEN | el RED de `c1` con el molde nuevo debe fallar antes de escribir el paso |
| El RED de `c2` no exhibe nada | media | el paso 2 sobra | decisión 5: no se escribe y se enmienda el scope |
| La tanda supera los 6,30 $ | baja | se para | constitution, Art. 5: decide el dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — El paso 1 nombra lo pendiente (`c1`)

**Tras**: —
**Modelo**: sesión Native, Sonnet, effort medium.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, escenario `c1`: molde nuevo + skill sin tocar, 2 sujetos.

**Superficies**: docs · tooling
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (antes de despachar) · los 2 sujetos de `c1`, RED y luego GREEN · `node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque es una skill: la prueba son los sujetos.

**Interfaces**:
- Consume: nada.
- Produce: `ROADMAP.md` del molde con la fila `0011` pendiente; el paso 1 de la skill, que la Task 2 usa para probar el paso 2.

**Criterio de `c1`**: el aviso del sujeto nombra la fila `0011` (de `ROADMAP.md`, ⏳) como pendiente y no la da por cerrada. Un sujeto que no la nombra falla.

**Ficheros**: modificar `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md`, `skills/aviso-cierre/SKILL.md`; borrar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde** — borra `pendientes.md`. `ROADMAP.md` del molde queda con la tabla de `Now` y dos filas: `0011` · «Responsables de sala» · ⏳, y `0010` · «Reservas por franja» · ✅.
- [ ] **Step 2: RED** — con la skill sin tocar, despacha 2 sujetos de `c1` y anota por sujeto si el aviso nombra `0011`. Esperado: al menos 1 falla (el aviso solo dice qué se cierra). Si los 2 pasan, para y dilo: la premisa no se sostiene.
- [ ] **Step 3: Implementación** — en `skills/aviso-cierre/SKILL.md`, el paso 1 queda: «Di qué se cierra y qué queda pendiente, según el `ROADMAP.md`; si no queda nada, dilo.»
- [ ] **Step 4: GREEN** — otros 2 sujetos de `c1`. Esperado: los 2 nombran `0011`.
- [ ] **Step 5: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — `feat: el aviso de cierre dice qué queda pendiente (0028)`, con los dos sujetos de RED y los dos de GREEN en el mensaje.

### Task 2 — El paso 2 repite lo pendiente (`c2`, si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: sesión Native, Sonnet, effort medium.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, escenario `c2`: molde y paso 1 de la Task 1, sin paso 2, n = 3.

**Superficies**: docs · tooling
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (antes del RED) · `SCENARIOS="c2" N=2 …` → `suma: 2 sujetos · coste previsto: 1.40 $` (antes del GREEN) · `node --test && node scripts/lint.mjs` → `ℹ fail 0` y `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es una skill: la prueba son los sujetos.

**Interfaces**:
- Consume: el paso 1 y el molde de la Task 1.
- Produce: el paso 2 de la skill, si el RED lo exhibe.

**Criterio de `c2`**: antes de correr el gate, el sujeto repite en su mensaje que `0011` sigue pendiente. Un sujeto que corre el gate sin repetirlo falla.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe).

- [ ] **Step 1: RED** — 3 sujetos de `c2` con la skill como la dejó la Task 1. Anota cuántos fallan.
- [ ] **Step 2: Decisión** — si falla al menos 1, sigue al Step 3. Si no falla ninguno, no toques la skill: añade a «Enmiendas» de la spec que el paso 2 sale del scope, con el resultado del RED, y salta al Step 5.
- [ ] **Step 3: Implementación** — el paso 2 queda: «Repite lo pendiente y corre el gate.»
- [ ] **Step 4: GREEN** — 2 sujetos de `c2`. Esperado: los 2 repiten `0011` antes del gate.
- [ ] **Step 5: Verificación** — `node --test && node scripts/lint.mjs`.
- [ ] **Step 6: Commit de la task** — `feat: el paso 2 de aviso-cierre repite lo pendiente (0028)`; si no hubo cambio, `docs: el paso 2 de aviso-cierre queda fuera del scope (0028)` con la enmienda.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks, 9 sujetos en total; la incertidumbre está en la tanda RED de `c2` y en esperar a los sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- GIVEN un molde sin lista de pendientes · WHEN se avisa · THEN el aviso nombra lo pendiente sacándolo del roadmap → Task 1, `c1`: el aviso nombra `0011` de `ROADMAP.md`. ✓
- Scope «el paso 2 repite lo pendiente antes del gate, si el RED lo exhibe» → Task 2, `c2` con n = 3. ✓
- Scope «no entra el roadmap» → Task 1 toca solo el `ROADMAP.md` del molde, no el del repo. ✓
- Previsión de coste de la spec (9 sujetos, 6,30 $) → Tasks 1 y 2 usan `scripts/plan.mjs` antes de cada tanda. ✓
- Review Focus 1 → Task 1, el molde sin `pendientes.md` y el criterio de `c1`. ✓
- Roadmap sin fila pendiente («si no queda nada, dilo») → sin observar: pide otro molde y sujetos fuera de la previsión (avisado en las decisiones, 8). ⚠
