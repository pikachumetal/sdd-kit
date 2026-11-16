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

1. **Modelo y effort por task**: Task 1 y Task 2 en el hilo principal, sin despacho; la sesión va en gama media (Sonnet, effort medium) porque el plan lleva el texto exacto de la skill. La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde `mold-c` contradice la spec**: la spec dice que `mold-c` no tiene `pendientes.md`, pero lo tiene (`- 0011: responsables de sala`). Con él, el sujeto de `c1` lee lo pendiente del fichero y no lo saca de la skill, y el RED no prueba el paso 1. La Task 1 empieza por comprobarlo y, si sigue así, quita `pendientes.md` del molde y le pone un `ROADMAP.md` mínimo con una fila abierta (`0011`), que es de donde la spec dice que sale lo pendiente. Es un cambio de fixture, no de la skill; **si el dev-lead prefiere enmendar la spec en vez de tocar el molde, se para antes de la Task 1**.
4. **La batería declara `c2` con n = 2 y la spec pide RED con n = 3**: el RED de `c2` se corre con `N=3` por variable de entorno, sin tocar `battery.md`.
5. **El paso 2 es condicional** (Scope de la spec): la Task 2 solo edita la skill si el RED de `c2` exhibe que el sujeto no repite lo pendiente antes del gate. Si no lo exhibe, la Task 2 acaba sin cambio y se anota.
6. **Coste estimado**: 9 sujetos, 6,30 $ (RED 3,50 $ + GREEN 2,80 $, ~0,70 $ por sujeto), tal como la spec. Superarlo, REFACTOR incluido, para y decide el dev-lead (Constitution, art. 5). Horas: ~1,5 h.
7. **Gate de cierre**: `node --test && node scripts/lint.mjs`, de `operations.md` §Testing. La constitution dice solo `node --test`; vale el de operations, que lo contiene.
8. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo pendiente, sacado del roadmap, y, si el RED lo exhibe, el paso 2 lo repite antes del gate.

**Architecture**: se edita solo el texto de la skill, con RED → GREEN con sujetos de la batería `aviso-cierre` (art. 5). El fixture `mold-c` se ajusta para que lo pendiente solo pueda salir del roadmap.

**Tech Stack**: Markdown (skill y batería); `node scripts/plan.mjs` para la previsión de coste; `node --test` y `node scripts/lint.mjs` para el gate.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fixture de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin un RED con sujetos antes (constitution, art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- No se toca el roadmap del proyecto (`ROADMAP.md` de la raíz), por el Scope de la spec.

### De proceso

- Sujetos: Sonnet. Previsión por tanda: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`, declarada antes del primer sujeto.
- Tope de coste: 6,30 $; si se supera, se para y decide el dev-lead.
- Atribución de commits: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `c1` sobre el molde con `pendientes.md` presente → el RED no prueba nada, porque el sujeto lo lee del fichero · Task 1, comprobación del molde antes del RED (`ls tests/batteries/aviso-cierre/mold-c` sin `pendientes.md`).
- Cierre sin ninguna fila abierta en el roadmap → el aviso no inventa pendientes; no dice que quede algo · Task 1, la redacción del paso 1 incluye «si no queda nada, dilo» y se mira en los sujetos de GREEN con el molde actual; sin molde propio de «nada pendiente», queda como verificación de lectura del texto, avisada aquí.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: un paso nuevo en una skill de dos pasos; sin más.
- [ ] **YAGNI gate**: no se abstrae nada.
- [ ] **Brownfield gate**: sin refactor fuera de scope; el paso 2 solo si el RED lo exhibe.
- [ ] **Constitution check**: arts. 2 (tests antes), 4 (castellano) y 5 (RED → GREEN con previsión de coste) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/ROADMAP.md` — roadmap mínimo del molde con la fila abierta `0011` (solo si la comprobación de la Task 1 confirma que el molde tiene `pendientes.md`).

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 nombra lo pendiente; paso 2 lo repite antes del gate, solo si el RED de `c2` lo exhibe.

**Eliminar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — la spec lo da por inexistente; con él el sujeto no usa el roadmap.

**NO se tocan**:

- `ROADMAP.md` de la raíz — fuera de scope.
- `tests/batteries/aviso-cierre/battery.md` — `c2` con n = 3 se corre por `N=3`.
- `scripts/plan.mjs` — solo se usa.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde sigue con `pendientes.md` y el RED de `c1` pasa en falso | Alta | Alto | Task 1 lo comprueba y arregla antes del RED |
| Los sujetos de RED ya nombran lo pendiente y no hay RED | Media | Medio | Si `c1` pasa sin la edición con el molde arreglado, se para: no hay cambio que hacer, decide el dev-lead |
| El coste supera 6,30 $ | Baja | Medio | Se para y decide el dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: hilo principal, Sonnet con effort medium (Native); los sujetos, Sonnet.
**Tests RED**: hilo principal · `c1` de `tests/batteries/aviso-cierre/battery.md`, × 2 sujetos sobre `mold-c`, antes de editar la skill; sin commitear: van en el commit de la task.

**Superficies**: docs · tooling
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (previsión antes del RED); GREEN: los 2 sujetos de `c1` con el aviso nombrando la fila `0011`; `node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no una aplicación.

**Interfaces**:
- Consume: nada.
- Produce: paso 1 de `skills/aviso-cierre/SKILL.md` con el texto «Di qué se cierra y qué queda pendiente en el roadmap; si no queda nada, dilo.».

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`; eliminar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `tests/batteries/aviso-cierre/mold-c/ROADMAP.md`.

- [ ] **Step 1: Molde** — `ls tests/batteries/aviso-cierre/mold-c`. Si hay `pendientes.md`, bórralo y crea `ROADMAP.md` con la tabla de `now-next-later-template.md` y una sola fila abierta (`0011`, «Responsables de sala», `⏳`). Esperado: el molde no tiene `pendientes.md` y su roadmap tiene una fila abierta.
- [ ] **Step 2: RED** — declara la previsión (1,40 $) y corre `c1` × 2 sobre la skill sin tocar. Esperado: los 2 avisos no nombran la `0011`. Si alguno la nombra, para y avisa al dev-lead.
- [ ] **Step 3: Implementación** — sustituye el paso 1 de `SKILL.md` por el texto de «Produce».
- [ ] **Step 4: GREEN** — corre `c1` × 2. Esperado: ambos avisos nombran la `0011` como pendiente.
- [ ] **Step 5: Verificación** — `node --test`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — uno solo al quedar limpia su revisión, con la atribución de proceso.

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: hilo principal, Sonnet con effort medium (Native); los sujetos, Sonnet.
**Tests RED**: hilo principal · `c2` de `tests/batteries/aviso-cierre/battery.md`, × 3 sujetos, sobre la skill tal como queda tras la Task 1; sin commitear.

**Superficies**: docs · tooling
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (previsión antes del RED); GREEN: `SCENARIOS="c2" N=2 …` → `suma: 2 sujetos · coste previsto: 1.40 $`, con los 2 sujetos repitiendo lo pendiente antes de correr el gate; `node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cambia el texto de una skill, no una aplicación.

**Interfaces**:
- Consume: el paso 1 de la Task 1.
- Produce: paso 2 de `skills/aviso-cierre/SKILL.md` con el texto «Repite lo pendiente y corre el gate.», solo si el RED lo exhibe.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: RED** — declara la previsión (2,10 $) y corre `c2` × 3. Esperado: si en alguno el sujeto no repite lo pendiente antes del gate, el RED se exhibe; si los 3 lo repiten, para aquí: la task acaba sin cambio y se anota en el plan y en el walkthrough.
- [ ] **Step 2: Implementación** — solo con el RED exhibido, sustituye el paso 2 por el texto de «Produce».
- [ ] **Step 3: GREEN** — corre `c2` × 2. Esperado: ambos repiten lo pendiente antes del gate.
- [ ] **Step 4: Verificación** — `node --test`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión; sin cambio, no hay commit.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,0 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks de texto con 9 sujetos en total; incertidumbre en el molde y en si el RED de `c2` se exhibe; sin referencia en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): el aviso nombra lo pendiente sacándolo del roadmap
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` GREEN: los 2 avisos nombran la `0011`. ✓
- GIVEN «un cierre sin `pendientes.md` en el molde» → Task 1, Step 1: el molde sin `pendientes.md`. ✓
- Scope «el paso 2 repite lo pendiente antes del gate, si el RED lo exhibe» → Task 2, `c2` RED n = 3 y GREEN. ✓
- Previsión de coste (RED 5 sujetos, GREEN 4, 6,30 $) → Tasks 1 y 2, previsión declarada antes de cada tanda. ✓
- No entra el roadmap → N/A (confirmado en spec): la raíz no se toca; el `ROADMAP.md` es del molde. ✓
- Review Focus: molde con `pendientes.md` → Task 1, Step 1. ✓ · Cierre sin filas abiertas → verificación de lectura del texto del paso 1. ⚠ (avisado en las decisiones)
