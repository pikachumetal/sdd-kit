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

1. **`mold-c/pendientes.md` se borra en la Task 1** — la spec afirma que el molde no lo tiene, pero el repo sí (`tests/batteries/aviso-cierre/mold-c/pendientes.md`, con `0011: responsables de sala`). Con él, el sujeto leería lo pendiente de ahí y el RED de `c1` no probaría el paso 1. Borrarlo hace cierta la premisa de la spec; si prefieres otro molde, dímelo antes de la Task 1.
2. **Modelo y effort**: sin subagentes de task (Native); la sesión va en Sonnet, effort medium. Los sujetos de la batería van con Sonnet (`operations.md`).
3. **Ejecución**: native, fijado en `sdd-kit.json`.
4. **`c2` con n = 3 en el RED** — la batería declara n = 2; el RED lo sube con `N=3` en la línea de comando, como pide la spec, sin tocar `battery.md`.
5. **Task 2 condicional** — solo se hace si el RED de `c2` exhibe que el paso 2 no repite lo pendiente (la spec: «si el RED lo exhibe»). Si no lo exhibe, se descarta con la evidencia en el walkthrough.
6. **Coste estimado**: 2–3 h; sujetos 9 → 6,30 $ (RED 3,50 + GREEN 2,80), calculado con `scripts/plan.mjs`. Si la prueba supera esa suma, REFACTOR incluido, se para y decide el dev-lead (Art. 5).
7. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: El paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo que queda pendiente en el roadmap, y el paso 2 lo repite antes del gate si el RED lo exige.

**Architecture**: Se edita solo el texto de la skill, guiado por sujetos (RED → GREEN) de la batería `aviso-cierre`. Sin código de producción.

**Tech Stack**: Node 22 sin dependencias; `node scripts/plan.mjs` para la previsión de coste.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su batería; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (Art. 4).
- Ninguna edición de la skill sin su RED con sujetos antes (Art. 5); la previsión de coste (9 sujetos, 6,30 $) está declarada en la spec.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Sujetos con Sonnet. Convención de commits del proyecto, referenciando la 0028; atribución al final del mensaje.
- El gate completo corre una vez, en §3.

## Review Focus

- Sujeto de `c1` que, aun sin `pendientes.md`, no encuentra un roadmap en el molde → debe decir que no puede verificar lo pendiente en vez de inventarlo · Task 1, la tanda GREEN de `c1` (la lectura de los 2 sujetos comprueba que no inventan filas).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase por paso, sin estructura nueva.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: la skill sigue siendo de dos pasos; no se toca el roadmap (fuera de scope).
- [x] **Constitution check**: Art. 2, 4 y 5 respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 nombra lo pendiente sacándolo del roadmap; paso 2 lo repite antes del gate, solo si el RED de `c2` lo exige.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — ver decisión 1.

**NO se tocan**:

- `ROADMAP.md` — fuera de scope de la spec.
- `tests/batteries/aviso-cierre/battery.md` — el n = 3 del RED se pasa por entorno.
- `src/`, `test/` — no hay código de producción.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde no tiene roadmap y el sujeto no puede sacar lo pendiente de ningún sitio | media | el GREEN de `c1` no se puede dar | Task 1 lo detecta en el RED; si ocurre, se para y decide el dev-lead (la spec habla de «roadmap» y el molde no lo trae) |
| La prueba supera los 6,30 $ | baja | sobrecoste | Art. 5: parar y decidir |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: native, en la sesión (Sonnet, effort medium); sujetos: `model: sonnet`.
**Tests RED**: hilo principal · `c1` de `tests/batteries/aviso-cierre/battery.md` × 2 sujetos, sin `pendientes.md` en el molde; el aviso no nombra lo pendiente.

**Superficies**: docs (la skill y su batería)
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (previsión antes de lanzar) · la tanda GREEN de `c1` × 2: los 2 avisos nombran lo pendiente.
**Se prueba en la aplicación**: no, porque es el texto de una skill, sin aplicación.

**Interfaces**:
- Consume: nada
- Produce: paso 1 de `SKILL.md` con el texto que nombra lo pendiente; `mold-c` sin `pendientes.md`

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`; borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`

- [ ] **Step 1: Molde y previsión** — borrar `mold-c/pendientes.md` (`git rm`) y declarar la previsión de la tanda RED.
- [ ] **Step 2: RED** — lanzar `c1` × 2 y `c2` × 3 con Sonnet; esperado: el aviso de `c1` no nombra lo pendiente; guardar la salida en bruto en la carpeta de la spec. Si `c2` exhibe que el paso 2 no repite lo pendiente, la Task 2 sigue; si no, se descarta.
- [ ] **Step 3: Implementación** — paso 1 de `SKILL.md`: «1. Di qué se cierra y qué queda pendiente en el roadmap (las filas abiertas de Now); si no hay roadmap, dilo.»
- [ ] **Step 4: GREEN** — `c1` × 2; esperado: los dos avisos nombran lo pendiente y ninguno inventa filas.
- [ ] **Step 5: Commit de la task** — `feat(0028): el aviso de cierre nombra lo pendiente`.

### Task 2 — El paso 2 repite lo pendiente *(solo si el RED de `c2` lo exhibe)*

**Tras**: Task 1
**Modelo**: native, en la sesión; sujetos: `model: sonnet`.
**Tests RED**: el RED de `c2` × 3 ya lanzado en la Task 1, Step 2.

**Superficies**: docs
**Verificación**: `c2` × 2 en GREEN: el aviso repite lo pendiente antes de correr el gate.
**Se prueba en la aplicación**: no, porque es el texto de una skill.

**Interfaces**:
- Consume: paso 1 de la Task 1
- Produce: paso 2 de `SKILL.md` que repite lo pendiente antes del gate

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Implementación** — paso 2: «2. Repite lo que queda pendiente y corre el gate.»
- [ ] **Step 2: GREEN** — `c2` × 2; esperado: los dos repiten lo pendiente antes del gate.
- [ ] **Step 3: Commit de la task** — `feat(0028): el paso 2 repite lo pendiente`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 (GREEN). ✓
- Scope «entra, si el RED lo exhibe: el paso 2 repite lo pendiente» → Task 2, `c2` × 2 (GREEN), condicionada al RED de `c2` × 3. ✓
- Scope «no entra: el roadmap» → N/A, `ROADMAP.md` no se toca. ✓
- Capacidades: ninguna → N/A. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Task 1 Step 1 y Task 2. ✓
- Review Focus → Task 1, lectura de la tanda GREEN de `c1`. ✓
