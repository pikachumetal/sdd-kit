---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **El molde `mold-c` SÍ tiene `pendientes.md` hoy** (`- 0011: responsables de sala`), y la spec da por hecho que no. Con ese fichero el sujeto de `c1` lee lo pendiente de ahí y no de la skill, así que la prueba no mediría el paso 1. La Task 1 lo borra y deja un `.gitkeep` (git no versiona carpetas vacías y `mold-c` desaparecería). Es lo que la spec describe; si prefieres conservar el fichero, hay que cambiar la spec.
2. **«Sacándolo del roadmap» y el molde**: `mold-c` no trae `ROADMAP.md`. El plan no lo añade (la spec no lo pide): si en el GREEN de `c1` el sujeto no encuentra roadmap de donde sacar lo pendiente, se para y se avisa en lugar de ampliar el molde. Riesgo alto, ver §1.7.
3. `battery.md` solo tiene la tabla: no hay texto de escenario para `c1` ni `c2`. El plan fija el criterio de cada uno (aserto observable, abajo) y no inventa prompts nuevos; los sujetos se lanzan con lo que ya usa el proyecto para esas filas.
4. **La Task 2 es condicional**, como dice el Scope: el paso 2 solo se edita si el RED de `c2` (n = 3) lo exhibe, es decir, si al menos un sujeto no repite lo pendiente antes de correr el gate. Si los tres lo repiten, la Task 2 acaba sin cambios y sin GREEN; el ahorro es 2 sujetos (1,40 $).
5. **Modelo y effort**: ambas tasks en la sesión (Native), gama media (Sonnet, effort medium): editar tres líneas de una skill y leer salidas de sujetos no necesita más. Sujetos: Sonnet, como fija `battery.md`.
6. **Ejecución**: native, fijado en `sdd-kit.json` (`"execution": "native"`).
7. **Coste**: ~2 h en total. Sujetos: 9 como máximo, 6,30 $ (RED 3,50 $ + GREEN 2,80 $), a 0,70 $ por sujeto (`operations.md` §Testing). La constitution (art. 5) manda parar si la prueba lo supera, una tanda más de REFACTOR incluida: decide el dev-lead.
8. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
9. **Gate de cierre**: `node --test && node scripts/lint.mjs`, de `operations.md` §Testing. No toca `src/`: se corre una vez, en §3.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo pendiente sacado del roadmap, y el paso 2 lo repite antes del gate si el RED lo exige.

**Architecture**: una sola skill de texto y su molde de batería. El cambio se prueba con sujetos (RED → GREEN, art. 5) sobre `tests/batteries/aviso-cierre/battery.md`; no hay código.

**Tech Stack**: Markdown, `node scripts/plan.mjs` para la previsión; Node 22 (`node --test`, `scripts/lint.mjs`) solo para el gate.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fichero de un molde de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- La spec no fija versiones, límites ni naming; el único valor exacto es el alcance: solo el paso 1 y, si el RED lo exhibe, el paso 2 de `skills/aviso-cierre/SKILL.md`. El roadmap no se toca.
- Ningún comentario que repita lo que hace el texto ni que cite documentos (constitution, spec, task, capacidad); texto claro y corto.
- Ninguna edición de la skill sin su RED previo con sujetos (constitution, art. 5).

### De proceso

- Sujetos: Sonnet. Previsión: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.
- Si la prueba supera los 9 sujetos / 6,30 $, se para y decide el dev-lead.
- Native: la sesión implementa; revisión final de rama con los ejes de `sdd-verify`.
- Commits con la convención del proyecto, referenciando la 0028, y con la línea de coautoría que indique el entorno.

## Review Focus

- Roadmap sin ninguna fila abierta → el aviso dice que no queda nada pendiente, no inventa filas · Task 1, sin sujeto propio (fuera de la previsión de 9): lo fija la lectura del paso 1 editado, que debe contemplar el caso.
- La fila de la propia feature que se cierra aparece abierta en el roadmap → no cuenta como pendiente · Task 1, misma verificación por lectura.
- Aviso largo con varias filas abiertas → el paso 2 las repite todas, no solo la primera · Task 2, aserto de `c2` («repite todas las filas que nombró el paso 1»).

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: cambio mínimo, dos líneas de una skill.
- [ ] **YAGNI gate**: no se abstrae nada.
- [ ] **Brownfield gate**: retrocompatible; sin refactor fuera de scope (no se toca el roadmap ni `src/`).
- [ ] **Constitution check**: arts. 2, 4 y 5 respetados; art. 5 con previsión declarada.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/.gitkeep` — mantiene la carpeta del molde sin `pendientes.md`.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 1) y, condicionado al RED, paso 2 (Task 2).

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — la spec exige que el molde no lo tenga.

**NO se tocan**:

- `ROADMAP.md` — la spec lo deja fuera.
- `tests/batteries/aviso-cierre/battery.md` — la tabla ya trae `c1` y `c2`; el n de `c2` en el RED se fuerza con `N=3`, sin editarla.
- `src/`, `test/`, `scripts/` — nada de código.

### 1.2–1.6

No aplican (sin datos, migraciones, API, UX ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `mold-c` sin roadmap: el sujeto no tiene de dónde sacar lo pendiente | Media | Alto: `c1` no pasa a GREEN | Se para y se avisa; no se amplía el molde sin decisión (decisión 2) |
| Un sujeto del RED de `c1` ya nombra lo pendiente | Baja | Medio: no hay RED, la edición no se justifica | No se edita el paso 1; se informa |
| La prueba supera 9 sujetos / 6,30 $ | Baja | Medio | Parar y que decida el dev-lead (art. 5) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: la sesión (Native), Sonnet, effort medium: son pocas líneas de una skill y no hay interpretación difícil. Sujetos: `sonnet`.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, fila `c1` (n = 2), escenario «cierre de la 0005 con `mold-c` sin `pendientes.md`». Aserto: el aviso nombra al menos una fila abierta del roadmap (`0010`, `0011` o `0008`) y no dice que no queda nada pendiente. Sin cambios sin commitear en la skill al lanzarlos.

**Superficies**: docs (skill + fixture)
**Verificación**:
- `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`
- RED: los 2 sujetos de `c1` incumplen el aserto con la skill actual.
- GREEN: los 2 sujetos de `c1` cumplen el aserto con la skill editada.

**Se prueba en la aplicación**: no, porque es una skill del propio repo: no hay aplicación.

**Interfaces**:
- Consume: nada.
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 editado (el paso 2 intacto: `2. Corre el gate.`) y `mold-c` sin `pendientes.md`. La Task 2 lo usa como punto de partida.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `tests/batteries/aviso-cierre/mold-c/.gitkeep`; modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 0: Apertura** — commit de apertura del hito antes de cualquier RED (`sdd-implement/references/commit-milestones.md`), y `sdd task start` de la Task 1.
- [ ] **Step 1: Molde** — `git rm tests/batteries/aviso-cierre/mold-c/pendientes.md` y crear `mold-c/.gitkeep` vacío. Esperado: `mold-c` contiene solo `.gitkeep`.
- [ ] **Step 2: RED** — lanzar `c1` × 2 con la skill sin tocar. Esperado: ambos incumplen el aserto. Si alguno ya nombra lo pendiente, parar: no hay RED y el paso 1 no se edita; informar.
- [ ] **Step 3: Edición** — en `skills/aviso-cierre/SKILL.md`, solo el paso 1 (`1. Di qué se cierra.`): además de qué se cierra, nombra lo que queda pendiente sacándolo de las filas del roadmap que no están ✅, sin contar la feature que se cierra; si no queda ninguna, lo dice. El texto lo redacta el implementador, en castellano y sin tocar el paso 2.
- [ ] **Step 4: GREEN** — lanzar `c1` × 2 con la skill editada. Esperado: ambos cumplen el aserto. Si alguno falla, una tanda de REFACTOR solo si cabe en los 9 sujetos / 6,30 $; si no, parar (art. 5).
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión, convención del proyecto, referenciando la 0028.

### Task 2 — El paso 2 repite lo pendiente (condicional)

**Tras**: Task 1
**Modelo**: la sesión (Native), Sonnet, effort medium. Sujetos: `sonnet`.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, fila `c2` con `N=3`, escenario «cierre con filas abiertas en el roadmap, ya con el paso 1 de la Task 1». Aserto: antes de correr el gate, el sujeto repite todas las filas pendientes que nombró en el paso 1.

**Superficies**: docs (skill)
**Verificación**:
- `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $`
- RED: se decide con los 3 sujetos. Si al menos uno incumple el aserto, el RED lo exhibe y se edita; si los 3 lo cumplen, no hay edición y la task acaba aquí.
- GREEN (solo si se editó): `SCENARIOS="c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`; los 2 sujetos cumplen el aserto.

**Se prueba en la aplicación**: no, porque es una skill del propio repo: no hay aplicación.

**Interfaces**:
- Consume: `skills/aviso-cierre/SKILL.md` con el paso 1 de la Task 1.
- Produce: el paso 2 con la repetición, o el paso 2 intacto si el RED no lo exhibe.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe).

- [ ] **Step 1: RED** — lanzar `c2` × 3 (`N=3`) con la skill tal como quedó en la Task 1. Esperado: lo decide el aserto, como arriba. Anotar el resultado en el ledger.
- [ ] **Step 2: Edición (solo si el RED lo exhibió)** — en el paso 2 (`2. Corre el gate.`), antes de correr el gate, repetir las filas pendientes que nombró el paso 1. El texto lo redacta el implementador, en castellano. Si el RED no lo exhibió, saltar a Step 4 sin editar y decirlo.
- [ ] **Step 3: GREEN (solo si hubo edición)** — lanzar `c2` × 2. Esperado: ambos cumplen el aserto; si no, regla de coste de la Task 1, Step 4.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión; si no hubo edición, no hay commit de código y la task se cierra con su línea en el ledger.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks (la segunda condicional), hasta 9 sujetos de ~0,70 $, sin código; la incertidumbre es el molde sin roadmap
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: GREEN de `c1` (aviso nombra lo pendiente) y, si se editó, de `c2`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente» (GIVEN un cierre sin `pendientes.md` en el molde, WHEN se avisa) → Task 1: Step 1 deja el molde sin `pendientes.md`; `c1` × 2 RED y GREEN observan que el aviso nombra una fila abierta. ✓
- AND «sacándolo del roadmap» → Task 1, aserto de `c1`: la fila nombrada es una de las abiertas del roadmap (`0010`, `0011`, `0008`), no una inventada. ⚠ el molde no trae roadmap: decisión 2 y riesgo en §1.7.
- Scope «si el RED lo exhibe: el paso 2 repite lo pendiente antes del gate» → Task 2, `c2` × 3 RED y, si hay edición, GREEN × 2. ✓
- «No entra: el roadmap» → N/A: `ROADMAP.md` en «NO se tocan». ✓
- Previsión de coste de la spec (RED 5 sujetos 3,50 $, GREEN 4 sujetos 2,80 $, suma 9 y 6,30 $) → Verificación de cada task con `plan.mjs`: 1,40 $ + 2,10 $ de RED y 1,40 $ + 1,40 $ de GREEN. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Roadmap sin filas abiertas → Task 1, lectura del paso 1 (sin sujeto, fuera de la previsión). ✓
- Fila de la propia feature abierta → Task 1, lectura del paso 1. ✓
- Varias filas abiertas → Task 2, aserto de `c2`. ✓
