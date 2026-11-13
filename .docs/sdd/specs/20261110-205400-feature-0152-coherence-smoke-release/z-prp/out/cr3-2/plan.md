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

1. **Modelo y effort por task**: Native, la sesión implementa todas; gama media (Sonnet, effort medium) porque el cambio es prosa de una skill de dos líneas y la tanda de sujetos la fija la batería. La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Decisión técnica que la spec no fija**: la Task 3 (paso 2) es condicional: solo se ejecuta si la tanda RED de `c2` exhibe que el aviso del paso 2 pierde lo pendiente; si no, se omite y se anota en el walkthrough.
4. **`c2` no tiene escenario definido en la spec**: el plan toma `c2` como el cierre en el que el gate ya corre (paso 2) sobre `mold-cierre`; si el dev-lead lo entiende de otro modo, se corrige antes de la Task 1.
5. **Riesgo alto**: el coste. Previsión de la spec: RED 5 sujetos (3,50 $) + GREEN 4 sujetos (2,80 $) = 9 sujetos, 6,30 $. Si la prueba lo supera, REFACTOR incluido, se para y decide el dev-lead (constitution, art. 5).
6. **Coste estimado**: ~1,5 h de trabajo y 6,30 $ de sujetos.
7. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que el paso 1 de `skills/aviso-cierre/SKILL.md` nombre lo pendiente (sacado de `ROADMAP.md`) cuando el molde no trae lista de pendientes, probado RED → GREEN con sujetos.

**Architecture**: la skill es un `SKILL.md` de dos pasos; el cambio es una frase en el paso 1 y, solo si el RED lo exhibe, otra en el paso 2. La prueba usa la batería `tests/batteries/aviso-cierre` sobre `mold-cierre`.

**Tech Stack**: Node ≥ 20, `node --test`, `scripts/plan.mjs` (previsión), `scripts/lint.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- Ninguna edición de la skill antes de su RED con sujetos (constitution, art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- No se toca el roadmap (spec, «No entra»): la skill lo lee, nunca lo edita.

### De proceso

- Sujetos: Sonnet. Un sujeto de `aviso-cierre` cuesta ~0,70 $.
- Previsión de coste por tanda: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`, declarada antes del primer sujeto.
- Commits con la atribución del kit; uno por task al quedar limpia su revisión.

## Review Focus

- Molde con `ROADMAP.md` sin ninguna fila abierta → el aviso dice que no queda nada pendiente, no inventa filas · Task 2, sujeto `c1` (lectura de la salida del sujeto).
- Pendiente en el roadmap pero no en la lista del cierre → el aviso lo nombra con su id, sin editar el roadmap · Task 2, sujeto `c1` (comprueba que `ROADMAP.md` del molde queda intacto).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase por paso, sin estructura nueva.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: retrocompatible; el resto del `SKILL.md` queda igual.
- [x] **Constitution check**: arts. 2, 4 y 5 respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 2) y, si procede, paso 2 (Task 3).
- `tests/batteries/aviso-cierre/battery.md` — `n` de `c2` a 3 para el RED (Task 1) y a 2 para el GREEN (Task 2).

**NO se tocan**:

- `ROADMAP.md` y `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md` — la skill lee el roadmap, no lo cambia.
- `src/`, `test/` — no hay código de producto.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La tanda supera los 6,30 $ | Media | Medio | Se para y decide el dev-lead (art. 5); la Task 3 es condicional. |
| `c2` mal entendido | Media | Medio | Decisión 4: se confirma antes del primer sujeto. |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — RED: la skill actual no nombra lo pendiente

**Tras**: —
**Modelo**: sesión nativa, Sonnet, effort medium.
**Evidencia**: no aplica (`mode: full`); el RED es la salida de los sujetos.
**Tests RED**: hilo principal · tanda `c1` × 2 y `c2` × 3 contra la skill sin tocar; salida de cada sujeto guardada junto a la spec.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c1 c2" N=… node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 5 sujetos · coste previsto: 3.50 $`, antes del primer sujeto.
**Se prueba en la aplicación**: no, porque es la tanda de prueba de una skill: no cambia nada que vea el usuario.

**Interfaces**:
- Consume: nada.
- Produce: veredicto RED de `c1` (el aviso no nombra lo pendiente) y de `c2` (si el paso 2 pierde lo pendiente o no), que decide la Task 3.

**Ficheros**: modificar `tests/batteries/aviso-cierre/battery.md` (`c2` con n = 3).

- [ ] **Step 1: Previsión** — correrla con el comando de «Verificación» y confirmar 5 sujetos y 3,50 $.
- [ ] **Step 2: Tanda RED** — lanzar `c1` × 2 y `c2` × 3 con Sonnet; anotar por sujeto si nombra lo pendiente.
- [ ] **Step 3: Veredicto** — `c1` debe fallar (si no falla, parar: la spec no describe un fallo real). `c2` decide si la Task 3 entra.
- [ ] **Step 4: Commit de la task**.

### Task 2 — GREEN: el paso 1 nombra lo pendiente

**Tras**: Task 1
**Modelo**: sesión nativa, Sonnet, effort medium.
**Tests RED**: los de la Task 1 (`c1`).

**Superficies**: docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → previsión de 2 sujetos antes de lanzarlos; tanda GREEN `c1` × 2 con Sonnet, los dos nombran lo pendiente sacándolo del roadmap.
**Se prueba en la aplicación**: no, porque es una skill: no cambia nada que vea el usuario.

**Interfaces**:
- Consume: veredicto RED de la Task 1.
- Produce: `SKILL.md` con el paso 1 corregido.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Implementación** — paso 1 pasa a: «Di qué se cierra y qué queda pendiente, sacándolo de las filas abiertas de `ROADMAP.md`.» (valor exacto que fija la spec: lo pendiente sale del roadmap).
- [ ] **Step 2: Tanda GREEN** — `c1` × 2 (y `c2` × 2 si la Task 3 se omite). Esperado: todos nombran lo pendiente y `ROADMAP.md` del molde queda intacto.
- [ ] **Step 3: Commit de la task**.

### Task 3 — *(condicional)* El paso 2 repite lo pendiente antes del gate

**Tras**: Task 2
**Modelo**: sesión nativa, Sonnet, effort medium.
**Condición**: solo si el RED de `c2` (Task 1) exhibe que el paso 2 lo pierde; si no, se omite y se anota en el walkthrough.
**Tests RED**: `c2` × 3 de la Task 1.

**Superficies**: docs
**Verificación**: tanda GREEN `c2` × 2 con Sonnet; ambos repiten lo pendiente antes de correr el gate.
**Se prueba en la aplicación**: no, porque es una skill.

**Interfaces**:
- Consume: `SKILL.md` de la Task 2.
- Produce: `SKILL.md` con el paso 2 que repite lo pendiente.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Implementación** — paso 2: «Repite lo pendiente y corre el gate.»
- [ ] **Step 2: Tanda GREEN** — `c2` × 2.
- [ ] **Step 3: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks seguras y 1 condicional, dos frases de prosa; la incertidumbre es el comportamiento de los sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Coste real de sujetos ≤ 6,30 $ (o parada y decisión del dev-lead)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1 (RED `c1`) y Task 2 (GREEN `c1` × 2). ✓
- «Entra, si el RED lo exhibe: el paso 2 repite lo pendiente» → Task 3, condicionada al RED de `c2` de la Task 1. ✓
- «No entra: el roadmap» → N/A: ningún fichero de roadmap se modifica (§1.1, «NO se tocan»). ✓
- Previsión de coste de la spec (9 sujetos, 6,30 $) → Tasks 1 y 2 (y 3 si entra), con la tanda declarada antes del primer sujeto. ✓
- Review Focus, molde sin filas abiertas → Task 2, sujeto `c1`. ✓
- Review Focus, roadmap intacto → Task 2, sujeto `c1`. ✓
