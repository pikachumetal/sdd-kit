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

1. **Modelo y effort por task**: hilo principal en Native, sin subagentes; los sujetos de la batería son Sonnet (`battery.md`). La revisión final de rama va con el modelo de `sdd-verify`, también con 2 tasks.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks, la segunda condicional**: la Task 1 escribe el paso 1 y prueba `c1`; la Task 2 solo escribe el paso 2 si el RED de `c2` (n = 3) lo exhibe, como dice el Scope. Si el RED de `c2` no falla, la Task 2 se cierra sin tocar la skill y el plan lo apunta.
4. **El molde de `c1` se prepara en la Task 1**: `tests/batteries/aviso-cierre/mold-cierre/` trae hoy `.docs/sdd/pendientes.md` (una lista de pendientes) y un `ROADMAP.md` vacío (`# ROADMAP.md`), así que no es «un molde sin lista de pendientes» ni deja nada que sacar del roadmap. Decisión: para `c1` se usa una copia del molde sin `pendientes.md` y con una fila abierta en su `ROADMAP.md`; el molde original no se toca.
5. **Gate de cierre rojo de base**: `node --test` sin ruta recorre también `tests/batteries/**/test/app.test.js` y el del molde tiene un `SyntaxError` a propósito; `node --test test/` da `ℹ fail 0`. §3 copia el gate declarado, literal, como pide el kit; hoy sale rojo antes de empezar y no por esta feature. No invento otro comando: lo decide el dev-lead.
6. **Coste**: el de la spec (RED 3,50 $, GREEN 2,80 $, suma 9 sujetos, 6,30 $). Según la constitution, Art. 5, si una tanda lo supera —un REFACTOR incluido— se para y decide el dev-lead. Horas: ~1,5 h.
7. **Review Focus**: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `aviso-cierre` nombra lo pendiente, sacado del roadmap, y el paso 2 lo repite solo si el RED lo exhibe.

**Architecture**: un solo fichero de producción, `skills/aviso-cierre/SKILL.md`. Se prueba con sujetos (RED → GREEN) sobre la batería `tests/batteries/aviso-cierre/`, sin código ni tests automáticos.

**Tech Stack**: Node 22 sin dependencias (`operations.md`); solo se usa `scripts/plan.mjs` para la previsión.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED con sujetos antes (constitution, Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- El paso 1 saca lo pendiente del roadmap; no entra editar el roadmap (Scope de la spec).

### De proceso

- Native: el hilo implementa cada task; la revisión final de `sdd-verify` mira toda la rama.
- Sujetos: Sonnet. La previsión de cada tanda sale de `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` y se declara antes del primer sujeto.
- Commits con la convención del proyecto, referenciando la 0028; atribución según el kit.

## Review Focus

- Un roadmap sin ninguna fila abierta → el aviso dice que no queda nada pendiente, no inventa una fila · Task 1, `c1` con un molde de roadmap sin filas abiertas (comprobación manual de la salida del sujeto).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, dos pasos de una skill.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: los pasos 1 y 2 conservan su orden; el molde original no se toca.
- [x] **Constitution check**: Arts. 1, 4 y 5 respetados; el Art. 2 (gate verde) choca con el gate rojo de base, ver decisión 5.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c1/` — copia del molde sin `.docs/sdd/pendientes.md` y con una fila abierta en su `ROADMAP.md`; el escenario `c1` corre sobre ella.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, si el RED de `c2` lo exhibe, paso 2 (Task 2).

**NO se tocan**:

- `ROADMAP.md` — la spec lo deja fuera.
- `tests/batteries/aviso-cierre/mold-cierre/` — el molde original sigue siendo el de `c2`.
- `tests/batteries/aviso-cierre/battery.md` — `n` por defecto no cambia; los `n` de la spec van por `N=`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` no falla con n = 2 (el sujeto ya nombra lo pendiente) | Media | Media | Sin RED no se edita la skill: se para y decide el dev-lead |
| La tanda supera los 6,30 $ | Baja | Media | Constitution, Art. 5: parar y decidir el dev-lead |
| El gate de cierre sale rojo por el molde | Alta | Baja | Decisión 5 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: hilo principal en Native, sin despacho; sujetos Sonnet (`battery.md`).
**Tests RED**: hilo principal · tanda `c1` × 2 sobre `tests/batteries/aviso-cierre/mold-c1/` con la skill sin tocar; los sujetos son el test, y el RED es que el aviso no nombra lo pendiente.

**Superficies**: docs (una skill) y tooling (el molde de la batería)
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (se declara antes del RED y del GREEN); después, `c1` × 2 con la skill editada: los dos avisos nombran la fila abierta del roadmap.
**Se prueba en la aplicación**: no, porque es una skill, sin aplicación.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de `skills/aviso-cierre/SKILL.md` con el texto de abajo, que la Task 2 puede citar.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-c1/`; modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Molde de `c1`** — copiar `mold-cierre/` a `mold-c1/`, borrar `.docs/sdd/pendientes.md` y dejar en `mold-c1/ROADMAP.md` una tabla con una fila abierta (`| 0011 | Anular reservas de otros | ⏳ |`).
- [ ] **Step 2: RED** — declarar la previsión (1,40 $), correr `c1` × 2 sobre `mold-c1` con la skill sin tocar. Esperado: ningún aviso nombra la 0011 como pendiente. Si alguno la nombra, parar: sin RED no se edita.
- [ ] **Step 3: Implementación** — el paso 1 pasa a «Di qué se cierra y qué queda pendiente, sacándolo de las filas abiertas del roadmap.» El paso 2 no se toca.
- [ ] **Step 4: GREEN** — declarar la previsión (1,40 $), correr `c1` × 2. Esperado: los dos avisos nombran la 0011.
- [ ] **Step 5: Commit de la task** — uno solo, referenciando la 0028.

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: hilo principal en Native, sin despacho; sujetos Sonnet.
**Tests RED**: hilo principal · tanda `c2` × 3 sobre `mold-cierre/` con la skill como la dejó la Task 1.

**Superficies**: docs (una skill)
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`; GREEN con `N=2` → `suma: 2 sujetos · coste previsto: 1.40 $`.
**Se prueba en la aplicación**: no, porque es una skill, sin aplicación.

**Interfaces**:
- Consume: el paso 1 de la Task 1.
- Produce: el paso 2 de `skills/aviso-cierre/SKILL.md`, si el RED lo pide.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: RED** — declarar la previsión (2,10 $) y correr `c2` × 3. Esperado: en alguno, el paso 2 corre el gate sin repetir lo pendiente. Si en ninguno, la task se cierra sin tocar la skill y el plan lo apunta.
- [ ] **Step 2: Implementación** *(solo si el RED falló)* — el paso 2 pasa a «Repite lo pendiente y corre el gate.»
- [ ] **Step 3: GREEN** *(solo si hubo Step 2)* — declarar la previsión (1,40 $) y correr `c2` × 2. Esperado: los dos repiten lo pendiente antes del gate.
- [ ] **Step 4: Commit de la task** — uno solo, referenciando la 0028.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks sobre un fichero, 9 sujetos de batería, la segunda task condicional; incertidumbre en el RED de `c1`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs` (de `operations.md` §Testing). Rojo de base por el `SyntaxError` del molde; ver decisión 5.
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en GREEN: cada aviso nombra la fila abierta del roadmap. ✓
- Scope «el paso 2 repite lo pendiente, si el RED lo exhibe» → Task 2, `c2` × 3 RED y × 2 GREEN. ✓
- Scope «no entra: el roadmap» → N/A (`ROADMAP.md` en «NO se tocan»). ✓
- Previsión de coste → declarada antes de cada tanda: 3,50 $ RED y 2,80 $ GREEN. ✓
- Review Focus (1 entrada) → Task 1, `c1` sobre un roadmap sin filas abiertas (comprobación manual de la salida). ✓
