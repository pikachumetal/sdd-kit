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

1. **Modelo y effort por task**: las dos tasks las hace la sesión Native (Sonnet, effort medium), porque el plan lleva el texto a escribir y los sujetos ya están fijados en `tech-stack.md` (Sonnet). La revisión final de rama no sigue esta política: sus ejes van con `sdd-kit:effort-high` + `opus` (Spec y Arquitectura) y `sdd-kit:effort-high` + `sonnet` (Código).
2. **Ejecución**: native, fijado en `sdd-kit.json`; son 2 tasks encadenadas por el mismo fichero, el plan cabe en un contexto y un error lo caza la batería de su task.
3. **El RED de `c2` corre con el paso 1 ya escrito** (Task 1 cerrada): la spec no dice sobre qué versión de la skill se mide, y medirlo sobre la original mezclaría el fallo del paso 1 con el del paso 2.
4. **«Si el RED lo exhibe» = al menos 1 de los 3 sujetos de `c2` llega al gate sin repetir lo pendiente.** La spec no fija el umbral; con 3 sujetos, 1 fallo ya es evidencia de que el texto actual no lo garantiza. Si los 3 lo repiten, la Task 2 se salta, sin tocar el paso 2, y queda apuntada en `tasks.md` con su evidencia.
5. **El molde de la batería no cumple el GIVEN de `c1`**: `mold-cierre` trae `.docs/sdd/pendientes.md` (una lista de pendientes) y su `roadmap.md` está vacío, así que «sacándolo del roadmap» no se podría observar. La Task 1 quita `pendientes.md` y siembra en `roadmap.md` una fila ⏳ (`0011`); es un cambio de la batería, no del roadmap del proyecto (que no entra, según la spec).
6. **`battery.md` solo tiene la tabla de ids**, sin enunciado ni rúbrica de `c1` y `c2`. La Task 1 los escribe antes del primer sujeto, y la Task 2 escribe el de `c2` antes de su RED.
7. **Riesgo alto: coste.** Previsión de la spec: 9 sujetos, 6,30 $ (RED 3,50 $ · GREEN 2,80 $, a ~0,70 $ el sujeto). Art. 5 de la constitución: si se supera, REFACTOR incluido, se para y decide el dev-lead. Si la Task 2 se salta, se gastan 2 + 2 sujetos de `c1` más los 3 del RED de `c2`.
8. **Coste estimado**: 1,5 h (docs). Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo pendiente sacándolo del roadmap, y el paso 2 lo repite antes del gate solo si el RED de `c2` lo pide.

**Architecture**: se edita un único fichero de skill (`SKILL.md`), cada paso tras su RED con sujetos (Art. 5); la batería vive en `tests/batteries/aviso-cierre/` y no se toca más que su molde y su enunciado.

**Tech Stack**: Node 22 sin dependencias, `node --test`; sujetos Sonnet (~0,70 $ cada uno).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y el molde de su batería; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (Art. 4).
- Ninguna edición de `SKILL.md` sin su RED con sujetos antes (Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); la constitución del proyecto no tiene artículo de calidad, valen estas dos reglas.
- No se toca el roadmap del proyecto (`.docs/sdd/roadmap.md`).

### De proceso

- Sujetos: Sonnet, un solo modelo; la previsión de coste de la spec manda (6,30 $).
- Atribución de commits: la del kit (`Co-Authored-By`); sin `--no-verify`.
- Commits: apertura, uno por task, cierre.

## Review Focus

- Molde con `pendientes.md` y roadmap vacío → el sujeto de `c1` no tiene de dónde sacar lo pendiente; el molde lleva la fila ⏳ en `roadmap.md` y no lleva `pendientes.md` · Task 1, comprobación del molde antes del RED (`git ls-files` sin `pendientes.md`, `roadmap.md` con `0011`).
- Roadmap sin filas pendientes → el aviso lo dice («no queda nada pendiente»), no inventa filas · Task 1, sujeto de `c1` con el roadmap sin ⏳ (1 de los 2 sujetos de la batería; ver su rúbrica).
- El gate corre aunque el paso 2 repita lo pendiente → la repetición no sustituye al gate · Task 2, rúbrica de `c2` («corre el gate» sigue siendo obligatorio).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero de skill y un molde; nada más simple.
- [x] **YAGNI gate**: sin abstracciones; el paso 2 solo se escribe si el RED lo exige.
- [x] **Brownfield gate**: retrocompatible (el paso 1 conserva «Di qué se cierra»); sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (gate de cierre), Art. 4 (castellano), Art. 5 (RED → GREEN y previsión de coste).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- ninguno.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, si el RED lo exhibe, paso 2 (Task 2).
- `tests/batteries/aviso-cierre/battery.md` — enunciado y rúbrica de `c1` (Task 1) y de `c2` (Task 2).
- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/roadmap.md` — fila ⏳ `0011` (Task 1).

**Eliminar**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — contradice el GIVEN de `c1` (Task 1).

**NO se tocan**:

- `.docs/sdd/roadmap.md` — la spec lo deja fuera.
- `src/`, `test/`, `scripts/` — no cambia código del producto.

### 1.2 a 1.6

No aplican: sin datos, migraciones, API, UX ni dependencias.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Superar los 6,30 $ por un REFACTOR | Media | Medio | Se para y decide el dev-lead (Art. 5) |
| Rúbrica de `c1` demasiado laxa: un sujeto pasa sin nombrar lo pendiente | Media | Alto | La rúbrica exige citar la fila del roadmap, no solo mencionar «pendientes» |
| El RED de `c2` sale 0 de 3 | Media | Bajo | Se salta la Task 2 y se apunta |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); sujetos `c1`: Sonnet.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` (`c1`, n = 2), sin commitear: va en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: `node --test` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos` · batería `c1`: RED con n = 2 (los sujetos no nombran lo pendiente) y GREEN con n = 2 (los dos lo nombran con la fila del roadmap).
**Se prueba en la aplicación**: no, porque es una skill del propio repo: se prueba con los sujetos de la batería.

**Interfaces**:
- Consume: nada.
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 reescrito; el molde con `roadmap.md` sembrado, que reutiliza la Task 2.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/battery.md`, `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/roadmap.md`; eliminar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde y enunciado** — quitar `pendientes.md`; `roadmap.md` del molde lleva la tabla de roadmap con la fila `| 0011 | Responsables de sala | ⏳ |`; `battery.md` recibe, para `c1`, el prompt («cierra la 0005») y la rúbrica: el aviso dice qué se cierra **y** nombra `0011` como pendiente sacándolo del roadmap. Esperado: `git ls-files tests/batteries/aviso-cierre/mold-cierre/.docs/sdd` solo lista `roadmap.md`.
- [ ] **Step 2: RED de `c1`** — 2 sujetos Sonnet sobre la skill sin tocar. Esperado: ninguno nombra `0011`; la salida en bruto se guarda en la evidencia.
- [ ] **Step 3: Implementación** — paso 1 de `SKILL.md`: dice qué se cierra y, aparte, qué queda pendiente según las filas abiertas del roadmap; si no queda ninguna, lo dice. El texto exacto lo escribe quien implementa, sin añadir pasos.
- [ ] **Step 4: GREEN de `c1`** — 2 sujetos nuevos. Esperado: 2 de 2 cumplen la rúbrica. Si falla, una tanda de REFACTOR contará contra la previsión.
- [ ] **Step 5: Verificación** — `node --test` y `node scripts/lint.mjs` con los resúmenes de arriba.
- [ ] **Step 6: Commit de la task** — uno solo: `feat(aviso-cierre): el paso 1 nombra lo pendiente (0028)`.

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium); sujetos `c2`: Sonnet.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` (`c2`, n = 3), sin commitear: va en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: `node --test` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos` · batería `c2`: RED n = 3 con al menos 1 sujeto que llega al gate sin repetir lo pendiente; GREEN n = 2 con 2 de 2 que lo repiten y corren el gate.
**Se prueba en la aplicación**: no, porque es una skill del propio repo: se prueba con los sujetos de la batería.

**Interfaces**:
- Consume: `SKILL.md` con el paso 1 de la Task 1 y el molde sembrado.
- Produce: `SKILL.md` con el paso 2 ampliado, o sin cambios si el RED sale 0 de 3.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/battery.md`.

- [ ] **Step 1: Enunciado de `c2`** — en `battery.md`, prompt («cierra la 0005 y corre el gate») y rúbrica: antes de correr el gate el sujeto repite lo pendiente y después corre el gate.
- [ ] **Step 2: RED de `c2`** — 3 sujetos Sonnet sobre la skill de la Task 1. Con 0 de 3 fallando: no se toca el paso 2, se apunta en `tasks.md` como `skipped` con la evidencia y se salta al Step 6.
- [ ] **Step 3: Implementación** — paso 2 de `SKILL.md`: repite lo pendiente antes de correr el gate, y el gate se sigue corriendo.
- [ ] **Step 4: GREEN de `c2`** — 2 sujetos nuevos; esperado 2 de 2.
- [ ] **Step 5: Verificación** — `node --test` y `node scripts/lint.mjs`.
- [ ] **Step 6: Commit de la task** — uno solo: `feat(aviso-cierre): el paso 2 repite lo pendiente (0028)`; si se saltó, solo lleva el enunciado de `c2` y la evidencia: `test(aviso-cierre): c2 no exhibe fallo (0028)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks, 9 sujetos de batería y un solo fichero de skill; la incertidumbre es el REFACTOR de `c1`; sin estimation-log previo de este tipo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de la spec: `c1` GREEN 2/2; `c2` RED medido y, si falló, GREEN 2/2
- [ ] Spec satisfecha: el THEN tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` GREEN: el aviso cita la fila `0011` del roadmap. ✓
- GIVEN «un cierre en un molde sin lista de pendientes» → Task 1, Step 1: el molde sin `pendientes.md`. ✓
- Scope «paso 2 repite lo pendiente antes del gate, si el RED lo exhibe» → Task 2, `c2` RED n = 3 y GREEN n = 2. ✓
- «No entra: el roadmap» → N/A: ninguna task toca `.docs/sdd/roadmap.md`. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Task 1: 4 sujetos; Task 2: 5 sujetos. ✓
- Review Focus (3 líneas) → Task 1 (molde y roadmap sin ⏳) y Task 2 (el gate sigue corriendo). ✓
