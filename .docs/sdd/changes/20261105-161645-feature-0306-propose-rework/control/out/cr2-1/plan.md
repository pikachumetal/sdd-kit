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

1. **El molde `mold-c` contradice la spec.** La spec dice que `mold-c` no tiene `pendientes.md`; el repo sí lo tiene (`- 0011: responsables de sala`), y tampoco hay roadmap en el molde. Con ese fichero el sujeto de `c1` lee lo pendiente de ahí y no de la skill, así que el RED no probaría el paso 1. La Task 1 quita `pendientes.md` y le da al molde `.docs/sdd/roadmap.md` con la fila 0011 pendiente, que es lo que el THEN pide («sacándolo del roadmap»). Tocar el molde no está en el Scope ni en «Dónde se prueba» de la spec: lo trato como enmienda pendiente de tu validación antes de empezar (ver el final del mensaje).
2. **Qué cuenta como «el RED lo exhibe» para el paso 2**: que al menos 1 de los 3 sujetos de `c2` no repita lo pendiente antes de correr el gate, con el paso 1 ya escrito. Con 0 de 3 fallando el RED es limpio: no se escribe el paso 2, se anota como ruling y no hay GREEN de `c2`.
3. **Orden de las tandas**: `c2` RED corre con el paso 1 ya en la skill; en la skill original no hay lo pendiente que repetir. La previsión de la spec (9 sujetos, 6,30 $) es el máximo: si el RED de `c2` sale limpio, bajan a 4 sujetos.
4. **Sujetos**: Sonnet, ~0,70 $ cada uno (`tech-stack.md`), despachados por el hilo con `Agent` sobre una copia de `mold-c`. Constitución, art. 5: si la prueba supera la previsión de 6,30 $, REFACTOR incluido, se para y decide el dev-lead.
5. **Modelo y effort**: ninguna task despacha subagente de implementación; las dos las hace el hilo principal (Native), en gama media. Los sujetos son la verificación, no un implementador.
6. **Ejecución**: native, fijado en `sdd-kit.json`.
7. **Coste estimado**: ~1,5 h; 6,30 $ de sujetos como máximo.
8. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: la skill `aviso-cierre` nombra lo pendiente del roadmap en su paso 1 y, solo si el RED lo exhibe, lo repite en el paso 2 antes del gate.

**Architecture**: se edita el texto de una skill y se prueba con sujetos (RED → GREEN) sobre la batería `aviso-cierre`. El molde se alinea con la spec para que lo pendiente solo pueda venir del roadmap.

**Tech Stack**: Node 22 sin dependencias; la skill es Markdown. Sujetos: Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un molde de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitución, art. 4).
- La skill queda en pasos numerados cortos, como hoy; el paso 1 nombra lo pendiente «sacándolo del roadmap».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Ninguna edición de la skill sin su sujeto RED antes (constitución, art. 5): el RED se ve fallar antes de escribir el paso.
- Sujetos con `model: sonnet`; la previsión de 6,30 $ no se supera sin parar.
- Commits: uno por task, con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` al final.

## Review Focus

- Un roadmap sin filas pendientes → el aviso no inventa pendientes · sin observar: exigiría un molde y sujetos fuera de los 9 de la previsión; la redacción del paso 1 («las filas que siguen en ⏳») lo cubre por texto, y queda a la revisión final.
- El aviso nombra una fila ya hecha (✅) como pendiente → debe nombrar solo las `⏳` · Task 1, criterio de `c1`: el molde lleva una fila ✅ y el aviso no la cita como pendiente.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks, un paso de texto cada una.
- [x] **YAGNI gate**: sin abstracciones; el paso 2 solo si el RED lo pide.
- [x] **Brownfield gate**: la skill y la batería existen; no se toca nada fuera de ellas.
- [x] **Constitution check**: arts. 4 y 5 cubiertos arriba.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/.docs/sdd/roadmap.md` — roadmap del molde: fila `0011` ⏳ y una fila `0009` ✅.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, si el RED lo exhibe, paso 2 (Task 2).
- `tests/batteries/aviso-cierre/battery.md` — describe el criterio de `c1` y `c2` bajo la tabla.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — es lo que hace que el sujeto no necesite la skill.

**NO se tocan**:

- `.docs/sdd/roadmap.md` del proyecto — la spec lo deja fuera.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` sale limpio con el molde nuevo | Baja | Hay que rediseñar la prueba | El molde solo trae lo pendiente en el roadmap y la skill no lo menciona: se para y se avisa |
| El coste supera 6,30 $ | Baja | Parada obligatoria (art. 5) | Máximo 9 sujetos; contar tras cada tanda |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium; los sujetos, `general-purpose` + `model: sonnet`.
**Tests RED**: hilo principal · sujetos `c1` × 2 sobre una copia de `mold-c` ya alineado, con la skill sin tocar; el RED es que el aviso no nombre la fila 0011. Sin commitear: van en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: sujetos `c1` × 2 en GREEN (el aviso nombra `0011` y no nombra `0009`) · `node --test && node scripts/lint.mjs` no se corre aquí: va en §3.
**Se prueba en la aplicación**: no, porque es el texto de una skill: se prueba con sujetos, no en una aplicación.

**Interfaces**:
- Consume: nada.
- Produce: el molde alineado y el paso 1 de la skill; la Task 2 corre `c2` sobre ellos.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-c/.docs/sdd/roadmap.md`; borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; modificar `tests/batteries/aviso-cierre/battery.md` y `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde** — borra `mold-c/pendientes.md`; crea `mold-c/.docs/sdd/roadmap.md` con la tabla `| # | Ítem | Estado |` y dos filas: `0009 | Reservas semanales | ✅` y `0011 | Responsables de sala | ⏳`. Añade a `battery.md`, bajo la tabla, el criterio de `c1`: «el aviso nombra la 0011 como pendiente y no cita la 0009».
- [ ] **Step 2: RED** — despacha 2 sujetos `c1` (Sonnet) con el brief «cierra la feature 0010» sobre una copia del molde y la skill original. Esperado: en ninguno el aviso nombra la 0011. Si algún sujeto la nombra, para y avisa (el RED no es limpio para esta task).
- [ ] **Step 3: Implementación** — en `skills/aviso-cierre/SKILL.md`, el paso 1 pasa a: «1. Di qué se cierra y qué queda pendiente en el roadmap: las filas que siguen en ⏳, por su número y su nombre.»
- [ ] **Step 4: GREEN** — 2 sujetos `c1` con la skill editada. Esperado: los dos nombran `0011` y ninguno cita `0009`. Anota sujetos y coste.
- [ ] **Step 5: Commit de la task** — `feat(aviso-cierre): el paso 1 nombra lo pendiente`.

---

### Task 2 — El paso 2 repite lo pendiente (solo si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium; los sujetos, `general-purpose` + `model: sonnet`.
**Tests RED**: hilo principal · sujetos `c2` × 3 sobre una copia del molde con la skill de la Task 1; el RED es que no repitan lo pendiente antes de correr el gate. Sin commitear: van en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: sujetos `c2` × 2 en GREEN (el aviso repite `0011` antes de la línea que corre el gate) · el gate completo va en §3.
**Se prueba en la aplicación**: no, porque es el texto de una skill: se prueba con sujetos.

**Interfaces**:
- Consume: el molde y el paso 1 de la Task 1.
- Produce: el paso 2 de la skill, o el ruling «RED limpio, paso 2 no escrito».

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` y `tests/batteries/aviso-cierre/battery.md`.

- [ ] **Step 1: Criterio** — añade a `battery.md` el criterio de `c2`: «antes de correr el gate, el sujeto repite lo pendiente (0011)».
- [ ] **Step 2: RED** — despacha 3 sujetos `c2` (Sonnet, n = 3 fijado aquí aunque la tabla diga 2). Esperado, si lo exhibe: al menos 1 de 3 corre el gate sin repetir lo pendiente. Con 0 de 3: RED limpio; apunta el ruling en `tasks.md`, no escribas el paso 2, salta al Step 5 y no hay GREEN.
- [ ] **Step 3: Implementación** — el paso 2 pasa a: «2. Repite lo pendiente y corre el gate.»
- [ ] **Step 4: GREEN** — 2 sujetos `c2` con la skill editada. Esperado: los dos repiten `0011` antes del gate. Anota sujetos y coste acumulado (máximo 6,30 $).
- [ ] **Step 5: Commit de la task** — `feat(aviso-cierre): el paso 2 repite lo pendiente`, o `test(aviso-cierre): c2 RED limpio, paso 2 no escrito`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks de un paso de texto cada una; el tiempo lo ponen los sujetos (9 como máximo); incertidumbre: el RED de `c2`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): `c1` GREEN y `c2` GREEN o RED limpio anotado
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El aviso nombra lo pendiente»: GIVEN un cierre sin `pendientes.md` en el molde → Task 1, Step 1 (molde sin `pendientes.md`, con roadmap). ✓
- WHEN se avisa → Task 1, Step 2 y 4 (sujetos `c1` con «cierra la feature 0010»). ✓
- THEN el aviso nombra lo pendiente sacándolo del roadmap → Task 1, Step 4: el aviso nombra `0011`, que solo está en el roadmap del molde. ✓
- Scope «si el RED lo exhibe», paso 2 repite lo pendiente antes del gate → Task 2, Steps 2–4. ✓
- No entra: el roadmap → N/A, el del proyecto no se toca. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Tasks 1 y 2, anotado tras cada tanda. ✓
- Review Focus: roadmap sin pendientes → sin observar: ningún sujeto de la previsión lo ejerce (avisado en el Review Focus). ⚠
- Review Focus: fila ✅ citada como pendiente → Task 1, criterio de `c1` (no cita la 0009). ✓
- Molde con `pendientes.md` frente a la spec → sin cubrir por la spec: la Task 1 lo corrige y queda como enmienda por validar (decisión 1). ⚠
