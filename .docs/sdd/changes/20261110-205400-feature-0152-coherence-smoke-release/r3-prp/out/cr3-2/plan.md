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

1. **Modelo y effort por task**: Task 1 y Task 2 con la sesión en Sonnet, effort medium — editan una skill de 2 líneas y la prueba la hacen los sujetos; la revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde de `c1` se prepara en la Task 1**: la spec pide «un molde sin lista de pendientes» y que el aviso saque lo pendiente «del roadmap», pero `mold-cierre` tiene `.docs/sdd/pendientes.md` (con la 0011) y un `ROADMAP.md` vacío. Se borra `pendientes.md` y la 0011 pasa a una fila de `Now` en el `ROADMAP.md` del molde; si no, `c1` no mide lo que dice la spec. Efecto: `c2` usa el mismo molde.
4. **La tanda RED de `c2` va con n = 3**, que la spec fija y la batería no (`battery.md` dice 2): se corre con `N=3`, sin tocar la batería; la GREEN de `c2` usa el 2 de la batería.
5. **Task 2 es condicional**: solo se escribe el paso 2 si el RED de `c2` exhibe que el aviso del paso 1 se pierde antes del gate (Scope de la spec). Si no lo exhibe, la Task 2 se cierra sin tocar la skill y se anota en el walkthrough.
6. **Riesgo alto**: el coste. La spec prevé 6,30 $ (9 sujetos); si la prueba lo supera, REFACTOR incluido, se para y decide el dev-lead (constitution, art. 5).
7. **Coste estimado**: 2,5 h de implementación; 6,30 $ en sujetos (Sonnet, ~0,70 $ cada uno).
8. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `skills/aviso-cierre/SKILL.md` diga, en su paso 1, qué queda pendiente al cerrar una feature, y que su paso 2 lo repita antes del gate solo si el RED lo exige.

**Architecture**: se edita una skill de texto; no hay código. Cada edición va precedida de su RED con sujetos (constitution, art. 5): la batería `tests/batteries/aviso-cierre` corre el escenario sin la edición, se ve fallar, se escribe el paso y se corre el GREEN.

**Tech Stack**: Node 22 sin dependencias (`node --test`, `scripts/lint.mjs`, `scripts/plan.mjs`); sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su molde de pruebas; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Ninguna edición de una skill sin su prueba con sujetos, RED → GREEN (constitution, art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- No se toca el roadmap del repo (spec, «No entra»).

### De proceso

- Sujetos: Sonnet; un sujeto de `aviso-cierre` cuesta ~0,70 $.
- Previsión de la spec: RED `c1` × 2 y `c2` × 3 = 3,50 $; GREEN `c1` × 2 y `c2` × 2 = 2,80 $; suma 9 sujetos, 6,30 $. Si se supera, se para y decide el dev-lead.
- Commits: convención del proyecto, referenciando la 0028; atribución del kit al final del mensaje.

## Review Focus

- Roadmap sin ninguna fila abierta → el aviso dice que no queda nada pendiente, sin inventarlo · sin test propio (un sujeto más rebasa la previsión): lo cubre leer en la Task 1 que el texto del paso 1 trae «si no queda ninguna, dilo».
- Roadmap con la 0011 abierta y la feature que se cierra ya ✅ → el aviso nombra la 0011 y no la que se cierra · Task 1, transcripts del GREEN de `c1`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas de skill y un molde.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: la skill sigue con sus dos pasos; el molde cambia solo en lo que `c1` necesita.
- [x] **Constitution check**: arts. 2, 4 y 5 respetados; el art. 5 manda la previsión de coste.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 nombra lo pendiente sacándolo del roadmap; paso 2 lo repite antes del gate, solo si el RED de `c2` lo exige.
- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — se borra.
- `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md` — fila de `Now` con la 0011 `responsables de sala` pendiente.

**NO se tocan**:

- `ROADMAP.md` del repo — fuera de scope.
- `tests/batteries/aviso-cierre/battery.md` — el n = 3 del RED de `c2` se pasa con `N=3`.
- `src/`, `test/`, `scripts/` — sin cambios de código.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El coste supera los 6,30 $ | media | para y decide el dev-lead | previsión con `plan.mjs` antes de cada tanda; contar sujetos gastados |
| El paso 1 ya basta y el paso 2 sería ruido | media | texto de más en la skill | Task 2 condicional al RED de `c2` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: sesión native en Sonnet, effort medium; sin despacho (`execution: native`).
**Tests RED**: hilo principal · tanda `c1` × 2 con la skill sin editar, sobre el molde preparado en el Step 1; no se commitea la tanda, sus transcripts van al walkthrough.

**Superficies**: docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (antes de la tanda) · tanda GREEN `c1` × 2: los 2 transcripts nombran la 0011 como pendiente · `node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo prueban los sujetos de la batería.

**Interfaces**:
- Consume: nada.
- Produce: paso 1 de `SKILL.md` que nombra lo pendiente sacándolo del roadmap.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md`; borrar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde** — borrar `pendientes.md`; en `mold-cierre/ROADMAP.md` añadir una sección `## Now` con la tabla de columnas del `ROADMAP.md` del repo y una sola fila: `| 0011 | — | **Responsables de sala** | ⏳ | — | M |`.
- [ ] **Step 2: RED** — correr `c1` × 2 con la skill intacta. Esperado: en los dos el aviso dice qué se cierra y no nombra la 0011. Si alguno la nombra, el RED no exhibe el fallo: parar y decidir con el dev-lead.
- [ ] **Step 3: Implementación** — paso 1 de `SKILL.md`: «Di qué se cierra y qué queda pendiente en el ROADMAP.md (las filas de `Now` que no están ✅); si no queda ninguna, dilo.»
- [ ] **Step 4: GREEN** — correr `c1` × 2. Esperado: los dos nombran la 0011 y no la feature que se cierra.
- [ ] **Step 5: Verificación** — `node --test`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — uno solo, `feat: el aviso de cierre nombra lo pendiente (0028)`.

---

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: sesión native en Sonnet, effort medium; sin despacho.
**Tests RED**: hilo principal · tanda `c2` × 3 con la skill tal como queda tras la Task 1; sin commitear. Si no exhibe el fallo, esta task no edita la skill.

**Superficies**: docs
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (antes del RED) · GREEN `c2` × 2, previsión `SCENARIOS="c2" N=2 …` → `suma: 2 sujetos · coste previsto: 1.40 $` · `node --test && node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo prueban los sujetos de la batería.

**Interfaces**:
- Consume: el paso 1 de la Task 1.
- Produce: paso 2 de `SKILL.md`, si el RED lo exige.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exige).

- [ ] **Step 1: RED** — correr `c2` × 3. Esperado para escribir el paso 2: en al menos uno el aviso no repite lo pendiente antes del gate. Si en los 3 lo repite, anotarlo en el walkthrough, cerrar la task sin editar la skill y saltar al Step 4.
- [ ] **Step 2: Implementación** — paso 2 de `SKILL.md`: «Repite lo pendiente y corre el gate.»
- [ ] **Step 3: GREEN** — `c2` × 2 (1,40 $; el GREEN de `c1` ya se corrió en la Task 1, así la suma de la spec son 9 sujetos). Esperado: los dos repiten lo pendiente antes del gate.
- [ ] **Step 4: Commit de la task** — `feat: el paso 2 del aviso de cierre repite lo pendiente (0028)`; o, sin edición, nada que commitear.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 2,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks, 9 sujetos de batería; incertidumbre en si el RED de `c2` exhibe el fallo; sin estimation-log previo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, GREEN de `c1` × 2: el transcript nombra la 0011, que está en el `ROADMAP.md` del molde. ✓
- Scope «el paso 2 repite lo pendiente antes de correr el gate, si el RED lo exhibe» → Task 2, RED y GREEN de `c2`. ✓
- «Dónde se prueba»: `c1` en molde sin lista de pendientes → Task 1, Step 1 (se borra `pendientes.md`). ✓
- «Dónde se prueba»: `c2` con RED n = 3 antes de escribirlo → Task 2, Step 1 con `N=3`. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Task 1: 2 + 2 y Task 2: 3 + 2 = 9; comprobada con `plan.mjs` antes de cada tanda. ✓
- «No entra: el roadmap» → N/A, el `ROADMAP.md` del repo no se toca (solo el del molde). ✓
- Review Focus → Task 1, transcripts del GREEN de `c1`. ✓
