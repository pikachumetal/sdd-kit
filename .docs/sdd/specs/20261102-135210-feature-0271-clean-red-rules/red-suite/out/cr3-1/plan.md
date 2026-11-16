---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-02
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las 4 tasks las hace la sesión (Native). Los sujetos de cada tanda se despachan con `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (`tech-stack.md` fija Sonnet; el effort medio lo pongo yo, porque el proyecto no lo fija). La revisión final de rama sigue la política de `sdd-verify` (ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. **El molde de la batería no sirve tal como está y la Task 1 lo cambia.** `mold-cierre` trae `.docs/sdd/pendientes.md` (una lista de pendientes) y su `roadmap.md` está vacío: ahí ni c1 es «un molde sin lista de pendientes» ni el aviso podría sacar nada del roadmap. La Task 1 borra `pendientes.md` y pone en el `roadmap.md` del molde la fila 0005 (la que se cierra) y la 0011 (la pendiente, la misma de la lista borrada). No toca el `roadmap.md` del proyecto, que el Scope deja fuera.
4. **La batería no tiene escenarios, solo una tabla** (`battery.md`). La Task 1 añade, por id, el enunciado que recibe el sujeto y lo que se observa. Los fijo yo (ver Task 1).
5. **Orden de las tandas distinto al de la previsión, mismo coste.** La spec agrupa «RED: c1 × 2 y c2 × 3». Con el paso 1 aún sin escribir, c2 fallaría seguro (no habría pendiente que repetir) y no probaría el paso 2. Por eso c2 corre su RED (n = 3) después de escribir el paso 1 y verlo en verde. Los 9 sujetos y los 6,30 $ son los mismos.
6. **Criterio de «el RED lo exhibe»** (Scope, paso 2): basta que 1 de los 3 sujetos de c2 vaya al gate sin repetir lo pendiente. Si los 3 lo repiten, el paso 2 no se escribe y se dice. El GREEN pasa si los 2 sujetos cumplen.
7. **Previsión de coste, repetida de la spec (Art. V)**: 9 sujetos × ~0,70 $ = 6,30 $. No lleva línea de REFACTOR ni de controles: **margen cero**. Un sujeto más (un GREEN que falle y pida otra tanda) supera la previsión y la sesión **para para que decida el dev-lead**.
8. **Evidencia**: cada tanda deja en `tests/batteries/aviso-cierre/battery.md`, sección «Procedencia», su línea: tanda, sujetos, pasan/fallan, dólares y la frase literal del sujeto que falla.
9. **Texto del paso 1** (la spec fija el comportamiento, no la frase): «Di qué se cierra y qué queda pendiente en el roadmap.» Es el mínimo; si el GREEN falla se para (decisión 7), no se adorna.
10. **Aviso sobre la spec**: su «Capacidades» dice «Ninguna» y a la vez el delta es «Capacidad: `aviso-cierre`». El proyecto no tiene `capabilities/`. Este plan no crea ni fusiona ninguna capacidad; el cierre no debería intentar `capability merge`.
11. **Coste estimado**: unas 2 h de trabajo y 6,30 $ en sujetos.

Review Focus: 1 entrada que la spec no fija y que ningún test pinza (ver la sección).

**Goal**: que `aviso-cierre` nombre lo que queda pendiente, sacándolo del roadmap, y —solo si el RED lo exhibe— lo repita antes de correr el gate.

**Architecture**: se edita el texto de una skill (`skills/aviso-cierre/SKILL.md`) y se prueba con sujetos sobre `mold-cierre`, RED → GREEN, una pasada por paso. No hay código de producto.

**Tech Stack**: Node 22 sin dependencias; Sonnet para los sujetos.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su batería de pruebas.

## Restricciones globales

### De código

- Los textos, en castellano (constitution, Art. 4).
- Ninguna edición de una skill sin su prueba con sujetos, RED → GREEN (constitution, Art. 5): `SKILL.md` no se toca hasta ver fallar el sujeto.
- Si la prueba supera los 6,30 $ / 9 sujetos de la previsión, se para y decide el dev-lead (constitution, Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); el proyecto no declara un artículo de calidad más.

### De proceso

- Git-flow: todo en `feature/0028-close-notice-pending`; sin merge a `main`.
- Los sujetos son Sonnet; ninguna task usa otro modelo para los sujetos.
- Commits de Native: apertura (spec + plan + `tasks.md`), uno por task, cierre.
- Atribución de commits: la que fije el arnés.

## Review Focus

- Roadmap sin filas pendientes, o con filas ya cerradas (✅) → el aviso no inventa pendientes ni nombra las cerradas · **sin test**: la previsión no tiene sujetos para él (margen cero) y la spec no fija ese comportamiento. Lo cubre la lectura del texto final del paso 1 en la revisión final; si el dev-lead lo quiere probado, es una tanda más fuera de la previsión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una línea en el paso 1 y, solo si el RED lo pide, una en el paso 2.
- [x] **YAGNI gate**: no se escribe el paso 2 sin RED que lo exhiba; sin abstracciones.
- [x] **Brownfield gate**: la batería y el molde de `aviso-cierre` se tocan lo mínimo; ninguna otra skill.
- [x] **Constitution check**: Arts. 1, 2, 4 y 5 respetados (ver Restricciones y decisión 7).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `tests/batteries/aviso-cierre/battery.md` — escenarios de c1 y c2 y sección «Procedencia».
- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/roadmap.md` — filas 0005 y 0011.
- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 2) y, condicionado, paso 2 (Task 4).

**Borrar**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — el molde de c1 no tiene lista de pendientes.

**NO se tocan**:

- `.docs/sdd/roadmap.md` del proyecto — el Scope lo deja fuera.
- El resto del molde (`src/`, `docs/`, `test/`) — no interviene en lo que se observa.

### 1.2–1.5

No aplican (sin datos, migraciones, API ni UI).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El control sin guía de c1 ya nombra lo pendiente | Baja | Alto: no hay nada que arreglar | Se para en la Task 1, no se escribe el paso 1 (`skill-testing.md`, control) |
| Un GREEN falla y pide otra tanda | Media | Medio: supera la previsión | Decisión 7: se para y decide el dev-lead |
| El sujeto cita la fila 0011 sin sacarla del roadmap (la inventa) | Baja | Medio | El molde ya no tiene otra fuente; lo pendiente solo está en el roadmap |

### 1.8 Rollout

Directo: es una skill del propio repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde, escenarios y RED de c1

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo principal · tanda de 2 sujetos de c1 sobre `mold-cierre` con `skills/aviso-cierre/SKILL.md` tal cual está.

**Superficies**: tooling (batería) · docs
**Verificación**: los 2 sujetos de c1 sin el cambio **fallan** los dos: ninguno nombra la fila 0011. Si alguno la nombra, **se para**: no hay fallo que arreglar. Gate de la task: `node --test test/app.test.js` en `mold-cierre` → `ℹ fail 0` (el molde sigue sano).
**Se prueba en la aplicación**: no, porque es la preparación de una batería de pruebas de una skill.

**Interfaces**:
- Consume: nada.
- Produce: escenarios `c1` y `c2` en `battery.md`; molde con `roadmap.md` con las filas 0005 y 0011 y sin `pendientes.md`; línea de Procedencia «RED c1».

**Ficheros**: modificar `battery.md`, `mold-cierre/.docs/sdd/roadmap.md`; borrar `mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde** — `roadmap.md` del molde, tabla `| # | Ítem | Estado |` con `| 0005 | Reservas semanales | 🚧 |` y `| 0011 | Responsables de sala | ⏳ |`; borrar `pendientes.md`.
- [ ] **Step 2: Escenarios en `battery.md`** — `c1`: enunciado «Cierra la 0005 siguiendo la skill `aviso-cierre`; el gate de este molde es `node --test`»; se observa que el mensaje del paso 1 contiene `0011`. `c2`: el mismo enunciado; se observa que, justo antes de correr `node --test`, el sujeto vuelve a nombrar `0011`. La columna `n` de c2 se queda en 2 (el del GREEN); el RED de c2 usa n = 3 y lo dice su línea de Procedencia.
- [ ] **Step 3: RED** — despachar 2 sujetos de c1 (`sonnet`, `sdd-kit:effort-medium`), cada uno con el molde recién copiado a una carpeta temporal fuera del repo. Esperado: 2 de 2 sin `0011` en el aviso. Anotar en Procedencia: tanda, sujetos, 2 fallan, ~1,40 $, frase literal del aviso de uno.
- [ ] **Step 4: Commit de la task** — `test(aviso-cierre): molde con roadmap y RED de c1 (0028)`.

### Task 2 — Paso 1 y GREEN de c1

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: los de la Task 1 (c1 fallando); no se escribe nada nuevo.

**Superficies**: docs (skill)
**Verificación**: 2 sujetos de c1 con el paso 1 escrito **pasan** los dos (el aviso contiene `0011`). Un fallo → se para (decisión 7).
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo prueban los sujetos.

**Interfaces**:
- Consume: molde y escenario `c1` de la Task 1.
- Produce: `SKILL.md` con el paso 1 nuevo; línea de Procedencia «GREEN c1».

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Paso 1** — sustituir «1. Di qué se cierra.» por «1. Di qué se cierra y qué queda pendiente en el roadmap.»; el paso 2 queda igual.
- [ ] **Step 2: GREEN** — 2 sujetos de c1. Esperado: 2 de 2 nombran `0011`. Anotar en Procedencia (~1,40 $).
- [ ] **Step 3: Commit de la task** — `feat(aviso-cierre): el aviso dice qué queda pendiente (0028)`.

### Task 3 — RED de c2

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: tanda de 3 sujetos de c2 sobre `mold-cierre` con la skill de la Task 2.

**Superficies**: docs (batería)
**Verificación**: se cuenta cuántos de los 3 vuelven a nombrar `0011` justo antes de correr el gate. ≥ 1 sin repetirlo → RED exhibido, sigue la Task 4. Los 3 lo repiten → el paso 2 **no se escribe**, la Task 4 se salta y se dice en el ledger y en el cierre.
**Se prueba en la aplicación**: no, porque es una tanda de medición sobre una skill.

**Interfaces**:
- Consume: skill con el paso 1 y escenario `c2`.
- Produce: línea de Procedencia «RED c2 (n = 3)» y la decisión escrita: Task 4 sí o no.

**Ficheros**: modificar `battery.md` (Procedencia).

- [ ] **Step 1: RED** — 3 sujetos de c2. Anotar en Procedencia: pasan/fallan, ~2,10 $ y la frase literal de un sujeto que falla.
- [ ] **Step 2: Decisión** — escribir en Procedencia «paso 2: se escribe» o «paso 2: no se escribe, 3 de 3 repiten lo pendiente».
- [ ] **Step 3: Commit de la task** — `test(aviso-cierre): RED de c2 (0028)`.

### Task 4 — Paso 2 y GREEN de c2 *(solo si la Task 3 exhibe el fallo)*

**Tras**: Task 3
**Modelo**: la sesión (Native); sujetos `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: los de la Task 3 (c2 fallando).

**Superficies**: docs (skill)
**Verificación**: 2 sujetos de c2 con el paso 2 nuevo **pasan** los dos. Un fallo → se para (decisión 7). Gate de la task: el de §3.
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo prueban los sujetos.

**Interfaces**:
- Consume: la decisión de la Task 3.
- Produce: `SKILL.md` con el paso 2 nuevo; línea de Procedencia «GREEN c2».

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `battery.md`.

- [ ] **Step 1: Paso 2** — sustituir «2. Corre el gate.» por «2. Repite lo pendiente y corre el gate.»
- [ ] **Step 2: GREEN** — 2 sujetos de c2. Esperado: 2 de 2 nombran `0011` justo antes del gate. Anotar en Procedencia (~1,40 $).
- [ ] **Step 3: Commit de la task** — `feat(aviso-cierre): repite lo pendiente antes del gate (0028)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 2 h
- Base de la estimación: 4 tasks, 2 de ellas tandas de sujetos; el patch 0006 de la misma skill no declara tiempo; incertidumbre en si hace falta la Task 4 y en un posible GREEN fallido.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): Procedencia con RED y GREEN de c1 y, si se escribió, de c2; coste ≤ 6,30 $
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1 (RED: 2 sujetos sin `0011`) y Task 2 (GREEN: 2 sujetos con `0011`, única fuente el roadmap del molde). ✓
- Scope «Entra, si el RED lo exhibe: el paso 2 repite lo pendiente antes del gate» → Task 3 (RED de c2, n = 3) y Task 4 (GREEN de c2, n = 2). ✓
- «Dónde se prueba»: c1 en un molde sin lista de pendientes → Task 1, Step 1 (se borra `pendientes.md`). ✓
- Previsión de coste (9 sujetos, 6,30 $) → Task 1: 2, Task 2: 2, Task 3: 3, Task 4: 2 = 9. ✓
- «No entra: el roadmap» → no se toca `.docs/sdd/roadmap.md`; solo el del molde. ✓
- Delta de capacidad `aviso-cierre` → N/A: el proyecto no tiene `capabilities/` y «Capacidades» dice «Ninguna» (decisión 10). ✓
- Línea del Review Focus (roadmap sin pendientes) → sin observar: fuera de la previsión (avisado en Review Focus). ⚠
