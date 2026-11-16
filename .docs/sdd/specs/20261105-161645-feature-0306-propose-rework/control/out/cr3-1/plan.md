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

1. **Modelo y effort por task**: las dos tasks las hace la sesión (Native). Los sujetos de la batería van con `sdd-kit:effort-medium` + `model: sonnet`, el de `tech-stack.md`. La revisión final de rama va con los ejes de `sdd-verify`: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde de `c1` es uno nuevo, `mold-sin-pendientes`.** La spec pide «un molde sin lista de pendientes», y `mold-cierre` trae `.docs/sdd/pendientes.md` y un `roadmap.md` vacío: con él el sujeto no tendría de dónde sacar lo pendiente. Se copia `mold-cierre` sin `pendientes.md` y con filas pendientes en su `roadmap.md`. `mold-cierre` no se toca, para que `c2` siga como estaba.
4. **«Si el RED lo exhibe» (paso 2) = al menos 1 de los 3 sujetos de `c2` corre el gate sin repetir antes lo pendiente.** Con 0 de 3 no se escribe el paso 2 y la Task 2 acaba en el RED, con su coste. La spec no fija el umbral y es lo que más cambia el resultado: corrígelo si quieres otro.
5. **Coste**: 9 sujetos, 6,30 $ (0,70 $ × 9, `tech-stack.md`), los de la spec. Se declara aquí, antes del primer sujeto, y la tanda de REFACTOR cuenta dentro. Si el total lo supera, se para y decide el dev-lead (constitution, art. 5). Horas: ~1,5 h.
6. **El gate de cierre está en rojo antes de empezar y no lo causa esta feature.** `node --test` recoge `tests/batteries/aviso-cierre/mold-cierre/test/app.test.js`, que es un stub (`# test/app.test.js`, JS no válido): hoy da `ℹ fail 1`. El plan **no cambia el gate ni el molde**: quedan fuera del Scope. §3 copia el gate literal y avisa de esto. Si `mold-sin-pendientes` copia ese `test/app.test.js`, suma otro fallo igual, y por eso no se copia.
7. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo pendiente, sacándolo del roadmap, y, solo si el RED lo exhibe, el paso 2 lo repite antes de correr el gate.

**Architecture**: es texto de una skill, probado con sujetos (RED → GREEN) de la batería `aviso-cierre`. Task 1 prueba y escribe el paso 1 (`c1`). Task 2 prueba el paso 2 (`c2`) y lo escribe solo si el RED lo pide.

**Tech Stack**: Node 22 sin dependencias; sujetos Sonnet; Markdown.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y la batería que la prueba; no hay módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- El paso 1 nombra lo pendiente **sacándolo del roadmap** (`.docs/sdd/roadmap.md`), no de otra lista.
- No se edita el roadmap del proyecto (No entra, spec).
- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Ninguna edición de la skill sin su RED antes (constitution, art. 5).

### De proceso

- Native: la sesión implementa las dos tasks; sujetos con `sdd-kit:effort-medium` + `model: sonnet`.
- Cada sujeto cuenta contra los 6,30 $; se apunta el coste al terminar cada tanda.
- Commits con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un molde cuyo roadmap no tiene filas pendientes → el aviso dice que no queda nada pendiente, no inventa filas · sin sujeto que lo fije: los 9 de la previsión no lo incluyen y uno más supera los 6,30 $. Se anota como no probado en el walkthrough y el dev-lead decide si añade una tanda.
- El sujeto de `c2` ya dijo lo pendiente en el paso 1 → el paso 2 no lo duplica entero: lo repite en una línea · Task 2, aserción de la rúbrica de `c2` «una sola mención por paso».

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks, un fichero de skill; el paso 2 solo si hace falta.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: se respeta el formato de la skill (pasos numerados); `mold-cierre` queda intacto.
- [x] **Constitution check**: art. 1 (flujo SDD), art. 4 (castellano) y art. 5 (RED → GREEN y coste declarado).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-sin-pendientes/` — copia de `mold-cierre` sin `.docs/sdd/pendientes.md` ni `test/app.test.js`, con ≥ 2 filas pendientes en `.docs/sdd/roadmap.md`. Es el molde de `c1`.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente; el paso 2 lo repite, solo si el RED de `c2` lo exhibe.
- `tests/batteries/aviso-cierre/battery.md` — `c1` apunta a `mold-sin-pendientes`; `c2` pasa a n = 3 en el RED (el GREEN corre 2).

**NO se tocan**:

- `.docs/sdd/roadmap.md` — No entra (spec).
- `tests/batteries/aviso-cierre/mold-cierre/` — es el molde de `c2` y su stub causa el rojo previo del gate: arreglarlo es otra feature.
- `.docs/sdd/operations.md` — el gate no se cambia desde aquí.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` ya pasa (el sujeto nombra lo pendiente sin la regla) | Baja | La edición del paso 1 no se justifica | Se para y se avisa al dev-lead antes de escribir; art. 5 |
| La prueba supera los 6,30 $ | Media | Parada | Se apunta el coste tras cada tanda; al superarlo, decide el dev-lead |
| El gate de cierre sigue rojo por el stub del molde | Alta | No se puede afirmar «gate verde» | Se informa tal cual en el cierre; fuera de Scope |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente (`c1`)

**Tras**: —
**Modelo**: la sesión (Native). Sujetos: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, fila `c1`, 2 sujetos sobre la skill sin editar y `mold-sin-pendientes`. Se commitean con la task.
**Superficies**: docs, tooling
**Verificación**: RED `c1` × 2: en los dos el aviso no nombra lo pendiente · GREEN `c1` × 2: en los dos el aviso nombra las filas pendientes del roadmap del molde · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no una aplicación.

**Interfaces**:
- Consume: nada.
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 que nombra lo pendiente; `mold-sin-pendientes` para `c1`.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-sin-pendientes/`; modificar `tests/batteries/aviso-cierre/battery.md` y `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde y batería** — crea `mold-sin-pendientes` como en §1.1, con las filas `| 0011 | Anular reservas de otros | ⏳ |` y `| 0010 | Motivo al cancelar | ⏳ |` en su `roadmap.md`, con la cabecera de tabla del roadmap del proyecto. En `battery.md`, `c1` apunta al molde nuevo.
- [ ] **Step 2: RED** — 2 sujetos de `c1`. Esperado: en los 2 el aviso no nombra 0010 ni 0011. Si alguno los nombra, no escribas el paso 1: para y avisa.
- [ ] **Step 3: Implementación** — en `SKILL.md`, el paso 1 pasa a «Di qué se cierra y qué queda pendiente, sacándolo de `.docs/sdd/roadmap.md`.»
- [ ] **Step 4: GREEN y lint** — 2 sujetos de `c1`; luego `node scripts/lint.mjs`. Esperado: los 2 nombran 0010 y 0011; `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia la revisión. Apunta el coste de la tanda.

### Task 2 — El paso 2 repite lo pendiente, si el RED lo pide (`c2`)

**Tras**: Task 1
**Modelo**: la sesión (Native). Sujetos: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, fila `c2`, n = 3 sobre la skill de la Task 1 y `mold-cierre`.
**Superficies**: docs, tooling
**Verificación**: RED `c2` × 3 · si exhibe (≥ 1 de 3 corre el gate sin repetir lo pendiente), GREEN `c2` × 2: en los 2 lo repite antes del gate · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no una aplicación.

**Interfaces**:
- Consume: el paso 1 de la Task 1 en `skills/aviso-cierre/SKILL.md`.
- Produce: el paso 2 con lo pendiente repetido, o ningún cambio si el RED no lo exhibe.

**Ficheros**: modificar `tests/batteries/aviso-cierre/battery.md` y, si el RED lo pide, `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Batería** — `c2` pasa a n = 3.
- [ ] **Step 2: RED** — 3 sujetos de `c2`. Esperado: apunta cuántos corren el gate sin repetir lo pendiente. Con 0 de 3, para aquí, apunta «paso 2 no exhibido» y salta al Step 5.
- [ ] **Step 3: Implementación** — con ≥ 1 de 3, el paso 2 pasa a «Repite en una línea lo pendiente y corre el gate.»
- [ ] **Step 4: GREEN y lint** — 2 sujetos de `c2`; luego `node scripts/lint.mjs`. Esperado: los 2 repiten lo pendiente antes del gate; `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — uno solo, con el coste de la tanda y el total frente a los 6,30 $.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks, 9 sujetos; la incertidumbre es si el RED de `c2` exhibe el paso 2; sin referencia en `estimation-log.md`
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`. Hoy falla antes de esta feature por el stub `tests/batteries/aviso-cierre/mold-cierre/test/app.test.js` (`ℹ fail 1`); si sigue así, se informa tal cual y decide el dev-lead.
- [ ] Verificación de los criterios de éxito de la spec: `c1` y, si se escribió, `c2` en GREEN.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` GREEN: el aviso nombra 0010 y 0011, que solo están en el roadmap del molde. ✓
- «Entra, si el RED lo exhibe: el paso 2…» (Scope; la spec no le da THEN) → Task 2, RED y GREEN de `c2`. El delta no tiene escenario del paso 2, así que lo observa solo la batería; se avisa en las decisiones (4). ⚠
- Coste: 5 sujetos RED y 4 GREEN = 9 · 6,30 $ → Tasks 1 y 2, el coste apuntado por tanda. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus, roadmap sin filas pendientes → sin observar: ningún sujeto de la previsión lo ejerce (avisado en el Review Focus). ⚠
- Review Focus, no duplicar → Task 2, aserción de `c2`. ✓
