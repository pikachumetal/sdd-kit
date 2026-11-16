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

1. **Modelo por task**: sesión en Native; los sujetos de la batería, Sonnet (`operations.md` §Testing). La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde de `c1`**: la spec pide «un molde sin lista de pendientes», pero `mold-cierre` trae `.docs/sdd/pendientes.md` y su `ROADMAP.md` solo tiene el título. La Task 1 crea `mold-cierre-sin-lista/` (copia sin `pendientes.md` y con un `ROADMAP.md` que tiene una fila abierta, la 0011). Sin fila abierta, «sacándolo del roadmap» no se puede observar.
4. **El paso 2 es condicional** (Scope de la spec): la Task 2 solo se hace si el RED de `c2` falla en alguno de sus 3 sujetos. Si pasa, se apunta y se cierra sin tocar el paso 2.
5. **Coste estimado**: 9 sujetos, 6,30 $ (RED 3,50 $ + GREEN 2,80 $, como la spec). Si la prueba lo supera, una tanda de REFACTOR incluida, se para y decide el dev-lead (Art. 5). Esfuerzo: ~1 h.
6. **Gate de cierre**: `node --test && node scripts/lint.mjs`, el de `operations.md`. No toca código, pero se corre una vez.

Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo que queda pendiente del roadmap, y el paso 2 lo repite antes del gate solo si el RED lo exhibe.

**Architecture**: se edita el texto de una skill, guiado por la batería (RED → GREEN, Art. 5). No hay código de producción.

**Tech Stack**: Markdown, `node --test` y `scripts/lint.mjs` como gate; `scripts/plan.mjs` para la previsión de coste.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill; no añade módulo, dependencia ni contrato.

## Restricciones globales

### De código

- Texto de la skill en castellano (constitución, Art. 4).
- Ninguna edición de la skill sin su prueba con sujetos: RED primero, GREEN después (Art. 5).
- Sin comentarios que repitan el texto ni que citen documentos (constitución, spec, task, capacidad).
- La previsión de coste se declara antes del primer sujeto: 9 sujetos, 6,30 $.

### De proceso

- Sujetos: Sonnet. Un sujeto de `aviso-cierre` cuesta ~0,70 $.
- Commits de Co-Authored-By según la atribución del proyecto; un commit por task al quedar limpia su revisión.

## Review Focus

- Molde con `pendientes.md` además del roadmap (el actual `mold-cierre`) → el aviso sigue sacando lo pendiente del roadmap, no de otro fichero · Task 1, segundo sujeto de `c1` en el GREEN, lanzado sobre `mold-cierre` (verificación manual del texto del aviso).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase en el paso 1 y, solo si el RED lo exige, otra en el paso 2.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: la skill ya existe; se respeta su forma de dos pasos y no se toca el roadmap.
- [x] **Constitution check**: Art. 4 (castellano) y Art. 5 (RED → GREEN con sujetos y previsión).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-cierre-sin-lista/` — molde de `c1`: copia de `mold-cierre` sin `.docs/sdd/pendientes.md` y con `ROADMAP.md` con la 0011 abierta.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente sacándolo del roadmap; el paso 2, solo si el RED de `c2` falla, lo repite antes del gate.

**NO se tocan**:

- `ROADMAP.md` del repo — la spec deja fuera el roadmap.
- `src/`, `test/`, `scripts/` — no hay código de producción en juego.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` pasa ya, sin editar | Baja | Se editaría sin RED (Art. 5) | Si pasa, se para y se avisa al dev-lead |
| El GREEN supera los 6,30 $ | Media | Hay que parar (Art. 5) | Se cuenta cada sujeto; al llegar a 5,60 $ se decide antes de lanzar más |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: sesión Native (Sonnet, effort medium); sujetos Sonnet.
**Tests RED**: hilo principal · tanda con `c1` × 2 sobre `mold-cierre-sin-lista` y `c2` × 3 sobre `mold-cierre`, antes de editar la skill; sin commitear, van en el commit de la task.

**Superficies**: docs (una skill) y tooling (el molde de la batería).
**Verificación**: `node scripts/lint.mjs` → `lint: sin hallazgos`; y los sujetos del GREEN (`c1` × 2): el aviso de cada uno nombra la fila abierta 0011 sacada del roadmap.
**Se prueba en la aplicación**: no, porque es el texto de una skill, sin cambio visible en la aplicación.

**Interfaces**:
- Consume: nada.
- Produce: `mold-cierre-sin-lista/` y el resultado del RED de `c2` (cuántos de 3 fallan), que decide la Task 2.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-cierre-sin-lista/`; modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde** — copiar `mold-cierre` sin `.docs/sdd/pendientes.md`; su `ROADMAP.md` lleva una fila abierta con `| 0011 | … | ⏳ |` bajo `## Now`.
- [ ] **Step 2: Previsión y RED** — `SCENARIOS="c1 c2" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` para declarar la previsión (5 sujetos, 3,50 $); lanzar `c1` × 2 y `c2` × 3. Esperado: `c1` no nombra la 0011 en ninguno de sus 2 sujetos. Anotar cuántos de los 3 de `c2` fallan.
- [ ] **Step 3: Implementación** — en el paso 1 de `skills/aviso-cierre/SKILL.md`: «Di qué se cierra y qué queda pendiente, sacándolo del roadmap.»- [ ] **Step 4: GREEN** — `c1` × 2: uno sobre `mold-cierre-sin-lista` y otro sobre `mold-cierre` (Review Focus), sin salir de los 4 sujetos de GREEN de la spec. Esperado: el aviso nombra la 0011 y sale del roadmap, no de `pendientes.md`.
- [ ] **Step 5: Verificación** — `node scripts/lint.mjs`. Esperado: `lint: sin hallazgos`.
- [ ] **Step 6: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: sesión Native (Sonnet, effort medium); sujetos Sonnet.
**Tests RED**: el RED de `c2` × 3 ya hecho en la Task 1. **Solo se hace si falla alguno de los 3 sujetos**; si pasan los 3, se anota en el ledger «Task 2: no aplica, el RED de `c2` pasó» y no se edita el paso 2.

**Superficies**: docs (una skill).
**Verificación**: `node scripts/lint.mjs` → `lint: sin hallazgos`; y `c2` × 2 en GREEN: el aviso del paso 2 repite lo pendiente antes de correr el gate.
**Se prueba en la aplicación**: no, porque es el texto de una skill.

**Interfaces**:
- Consume: el paso 1 editado y el resultado del RED de `c2` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Implementación** — en el paso 2: «Repite lo que queda pendiente y corre el gate.»
- [ ] **Step 2: GREEN** — `c2` × 2 sobre `mold-cierre`. Esperado: el paso 2 repite lo pendiente antes del gate en los 2.
- [ ] **Step 3: Verificación** — `node scripts/lint.mjs`. Esperado: `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 2 tasks (la segunda condicional), 9 sujetos de batería, sin código de producción; el estimation-log no tiene referencia.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en GREEN (uno por molde): el aviso nombra la 0011. ✓
- Scope «el paso 2 repite lo pendiente antes del gate, si el RED lo exhibe» → Task 2, `c2` × 2 en GREEN, condicionada al RED de `c2` × 3 de la Task 1. ✓
- No entra «el roadmap» → N/A (confirmado en spec): `ROADMAP.md` queda en «NO se tocan». ✓
- Previsión de coste (RED 3,50 $, GREEN 2,80 $, 9 sujetos, 6,30 $) → declarada en las decisiones y en el Step 2 de la Task 1. ✓
- Molde con `pendientes.md` → Task 1, Review Focus. ✓
