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

1. **Modelo y effort por task**: la propia sesión (Sonnet, effort medium) en las 3 tasks — editan una frase de una skill y un molde de prueba; los sujetos van con `model: sonnet` (`operations.md` §Testing). La revisión final de rama no sigue esta política: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **El molde actual no vale para `c1`**: `tests/batteries/aviso-cierre/mold-cierre/` trae `.docs/sdd/pendientes.md` (una lista de pendientes, con la 0011) y su `ROADMAP.md` está vacío, así que ni es «un molde sin lista de pendientes» ni hay de dónde sacar lo pendiente. La Task 1 borra la lista y da al `ROADMAP.md` una fila cerrada (0012) y una abierta (0013, `⏳`). `c2` usa el mismo molde.
4. **Qué es «pendiente»**: las filas del `ROADMAP.md` del molde con estado `⏳`. La spec no lo define; el texto del paso 1 lo fija así.
5. **Orden RED/GREEN**: el RED de `c2` corre tras dejar el paso 1 en GREEN, no antes: con el paso 1 sin escribir mediría el hueco que ya cierra el paso 1. El total de sujetos y el coste son los de la spec.
6. **Cuándo «el RED lo exhibe»** (spec, Scope): el RED de `c2` exhibe si al menos 1 de sus 3 sujetos corre el gate sin repetir antes lo pendiente. Si ninguno, el paso 2 no se escribe, la Task 3 cierra con esa medición y se ahorran los 2 sujetos del GREEN de `c2`.
7. **Cómo corre un sujeto**: el hilo principal despacha un subagente `general-purpose` + `model: sonnet` sobre una copia del molde en un directorio temporal, con la skill de `skills/aviso-cierre/SKILL.md` y el encargo «cierra la 0012». Guarda su aviso literal en `pruebas.md`.
8. **Coste**: ~3 h; previsión de la spec 6,30 $ (9 sujetos × 0,70 $ en la tabla de `operations.md`), 5,60 $ si `c2` no exhibe en el RED. Constitution Art. 5: si la prueba supera 6,30 $, se para y decide el dev-lead.
9. **Sin observar**: ver Review Focus; las 3 entradas necesitarían un sujeto más que el presupuesto aprobado (avisado aquí, antes de ejecutar).
10. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso de cierre nombre lo pendiente del roadmap, y el paso 2 lo repite antes del gate si el RED lo exhibe.

**Architecture**: la skill es un texto; su prueba es la batería `tests/batteries/aviso-cierre/` (sujetos Sonnet sobre un molde). Se prepara el molde, se mide el RED, se edita el paso 1 y se mide el GREEN; el paso 2 repite el ciclo solo si su RED lo justifica.

**Tech Stack**: Markdown de skill; Node 22 sin dependencias (`node --test`, `scripts/plan.mjs`, `scripts/lint.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un molde de prueba: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill, del molde y de los documentos en castellano (constitution Art. 4).
- Sin dependencias externas (Node 22) (`architecture.md`).
- Entra solo `skills/aviso-cierre/SKILL.md`; no entra el roadmap: `ROADMAP.md` de la raíz no se toca (spec, Scope).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Ninguna edición de la skill sin su prueba con sujetos, RED → GREEN (constitution Art. 5); la previsión se declara antes del primer sujeto: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` y `SCENARIOS="c2" N=3 …` (`plan.mjs` aplica la misma `N` a todas las filas elegidas).
- Sujetos: Sonnet, ~0,70 $ cada uno.
- Git-flow: rama `feature/0028-close-notice-pending`. Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Perfil `delegate`: sin paradas entre spec, plan e implementación.

## Review Focus

- `ROADMAP.md` del molde sin ninguna fila `⏳` → el aviso dice que no queda nada pendiente, sin inventar una fila · sin observar: ningún escenario de la batería lo ejercita (un sujeto más que el presupuesto); el texto del paso 1 lo pide expresamente, y lo mira la revisión final de la skill.
- Fila `⏳` en `Next` o `Later`, no en `Now` → se nombra igual, porque pendiente es toda fila `⏳` · sin observar, mismo motivo; el molde de `c1` solo tiene la fila en `Now`.
- Aviso que nombra lo pendiente pero lo saca de otro sitio que no es el roadmap (README, `docs/`) → no debe pasar: el aviso cita la fila del roadmap · Task 2, aserción de `c1` («no cita la 0011»: la lista antigua ya no existe, así que cualquier mención sería inventada).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un molde, una frase en el paso 1, un registro de pruebas.
- [x] **YAGNI gate**: ningún script ni escenario nuevo; `c2` solo escribe el paso 2 si el RED lo exhibe.
- [x] **Brownfield gate**: la batería y el molde existentes se conservan; solo cambia lo que `c1` necesita.
- [x] **Constitution check**: Art. 4 (castellano), Art. 5 (RED → GREEN con previsión de coste declarada y tope), Art. 2 (gate de cierre).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/pruebas.md` — registro de los sujetos: escenario, tanda (RED/GREEN), aviso literal, veredicto.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 (Task 2); paso 2 solo si el RED de `c2` exhibe (Task 3).
- `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md` — de vacío a una fila cerrada y una abierta (Task 1).

**Borrar**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — es la lista de pendientes que `c1` no debe tener.

**NO se tocan**:

- `ROADMAP.md` (raíz) — fuera de scope.
- `tests/batteries/aviso-cierre/battery.md` — `c1` y `c2` ya existen; el `n = 3` del RED de `c2` se pasa con `N=3`.
- Resto del molde (`README.md`, `docs/guia.md`, `docs/salas.md`, `src/app.js`, `src/rooms.js`, `test/app.test.js`) — listado completo, sin entradas ocultas más allá de `.docs/sdd/pendientes.md`.
- `src/`, `test/`, `scripts/` — el código de salas no cambia.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los sujetos no dan una señal distinta entre RED y GREEN con n = 2 | media | no se demuestra el efecto | el veredicto es por aserción literal sobre el aviso; si el RED de `c1` ya nombra lo pendiente, se para y decide el dev-lead (la skill no tendría el hueco) |
| La prueba supera los 6,30 $ | baja | Art. 5 | se para tras cada tanda; no hay tanda de REFACTOR prevista |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde de `c1` y RED de `c1`

**Tras**: —
**Modelo**: la propia sesión, Sonnet + effort medium (sujetos: `general-purpose` + `model: sonnet`).
**Tests RED**: hilo principal · escenario `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, sobre la skill sin editar.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (antes de despachar); tras el RED, `pruebas.md` con 2 filas `c1 · RED`.
**Se prueba en la aplicación**: no, porque es tooling de pruebas de una skill: sin cambio visible.

**Interfaces**:
- Consume: nada.
- Produce: el molde `mold-cierre` con `ROADMAP.md` así (columnas del roadmap real) y sin `.docs/sdd/pendientes.md`; `pruebas.md` con la tabla `| Escenario | Tanda | Aviso (literal) | Veredicto |`.

```markdown
# ROADMAP.md

## Now

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| 0012 | — | **Lista de espera de salas** | ✅ | — | S |
| 0013 | — | **Reservas recurrentes** | ⏳ | — | M |
```

Aserciones de `c1` (las mira el hilo sobre el aviso literal de cada sujeto, encargo «cierra la 0012»): (a) nombra «0013» o «Reservas recurrentes»; (b) no nombra «0011» ni «responsables de sala». Veredicto del sujeto: `pasa` si cumple las dos, `falla` si no.

**Ficheros**: crear `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/pruebas.md`; modificar `tests/batteries/aviso-cierre/mold-cierre/ROADMAP.md`; borrar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde** — `ROADMAP.md` como arriba y borrar `pendientes.md` (`git rm`). Dejar `.docs/sdd/` del molde vacío no es problema: git no guarda carpetas vacías.
- [ ] **Step 2: Previsión** — correr el comando de «Verificación» y copiar su salida a `pruebas.md`.
- [ ] **Step 3: RED de `c1`** — despachar 2 sujetos (decisión 7), anotar su aviso literal y su veredicto en `pruebas.md`. Esperado: al menos 1 `falla` (aserción a). Si los 2 `pasan`, parar y avisar al dev-lead (riesgo de §1.7).
- [ ] **Step 4: Commit de la task** — uno solo: `test(0028): molde sin lista de pendientes y RED de c1`, con la atribución de las Restricciones.

### Task 2 — Paso 1 y GREEN de `c1`

**Tras**: Task 1
**Modelo**: la propia sesión, Sonnet + effort medium (sujetos: `general-purpose` + `model: sonnet`).
**Tests RED**: el RED de la Task 1 (`pruebas.md`); no hay test nuevo.

**Superficies**: docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $`; 2 filas `c1 · GREEN` con veredicto `pasa` en `pruebas.md`.
**Se prueba en la aplicación**: no, porque cambia el texto de una skill: sin cambio visible.

**Interfaces**:
- Consume: el molde y `pruebas.md` de la Task 1; aserciones (a) y (b) de `c1`.
- Produce: el paso 1 de `aviso-cierre` con el texto exacto de abajo.

Texto exacto del paso 1 en `skills/aviso-cierre/SKILL.md` (el paso 2 queda como está):

```markdown
1. Di qué se cierra y qué queda pendiente: las filas con ⏳ de `ROADMAP.md`, en cualquier sección. Si no queda ninguna, dilo.
```

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/pruebas.md`.

- [ ] **Step 1: Implementación** — sustituir el paso 1 por el texto de arriba.
- [ ] **Step 2: GREEN de `c1`** — despachar 2 sujetos sobre el molde de la Task 1 (decisión 7), anotar aviso literal y veredicto. Esperado: 2 `pasa`. Si alguno `falla`, ajustar la frase del paso 1 y repetir la tanda dentro del tope de 6,30 $; si el tope se supera, parar (Art. 5).
- [ ] **Step 3: Commit de la task** — `feat(0028): el aviso de cierre nombra lo pendiente`, con la atribución.

### Task 3 — RED de `c2` y, solo si exhibe, paso 2

**Tras**: Task 2
**Modelo**: la propia sesión, Sonnet + effort medium (sujetos: `general-purpose` + `model: sonnet`).
**Tests RED**: hilo principal · escenario `c2` de la batería, n = 3, sobre la skill con el paso 1 de la Task 2.

**Superficies**: docs
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (antes del RED); si exhibe, `SCENARIOS="c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (antes del GREEN); gate de cierre en §3.
**Se prueba en la aplicación**: no, porque cambia el texto de una skill: sin cambio visible.

**Interfaces**:
- Consume: el paso 1 de la Task 2; el molde; `pruebas.md`.
- Produce: el veredicto sobre el paso 2 en `pruebas.md` y, si exhibe, el paso 2 con el texto de abajo.

Aserción de `c2` (sobre el aviso o mensaje que el sujeto da justo antes de correr el gate, encargo «cierra la 0012»): nombra «0013» o «Reservas recurrentes» antes de ejecutar `node --test`. El sujeto `falla` si corre el gate sin nombrarlo antes. El RED exhibe con al menos 1 `falla` de 3 (decisión 6).

Texto exacto del paso 2, solo si exhibe:

```markdown
2. Antes de correr el gate, repite lo pendiente. Corre el gate.
```

**Ficheros**: modificar `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/pruebas.md`; y, solo si exhibe, `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: RED de `c2`** — previsión (comando de «Verificación»), despachar 3 sujetos, anotar aviso literal y veredicto en `pruebas.md`.
- [ ] **Step 2: Decisión** — con 0 `falla` en `pruebas.md`: anotar «el RED de c2 no exhibe: el paso 2 no entra» y saltar al Step 5. Con 1 o más: seguir.
- [ ] **Step 3: Implementación** — sustituir el paso 2 por el texto de arriba.
- [ ] **Step 4: GREEN de `c2`** — previsión, despachar 2 sujetos, anotar. Esperado: 2 `pasa`. Si falla, ajustar la frase y repetir dentro del tope de 6,30 $; si se supera, parar (Art. 5).
- [ ] **Step 5: Commit de la task** — `feat(0028): el paso 2 repite lo pendiente antes del gate` si entró; si no, `test(0028): RED de c2 sin hallazgo, el paso 2 no entra`. Con la atribución.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 3 tasks; hasta 9 sujetos en tandas pequeñas; la incertidumbre es si el paso 2 entra y si alguna tanda hay que repetirla.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: `pruebas.md` tiene el RED de `c1` con al menos 1 `falla` y el GREEN con 2 `pasa`; el coste total ≤ 6,30 $
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» (GIVEN molde sin lista de pendientes, WHEN se avisa) → Task 1 (molde sin lista, RED) y Task 2, `c1` aserciones (a) y (b) sobre el aviso literal. ✓
- Scope «entra, si el RED lo exhibe: el paso 2 repite lo pendiente antes del gate» → Task 3, `c2` RED n = 3 y su aserción. ✓
- «No entra: el roadmap» → `ROADMAP.md` de la raíz en «NO se tocan». ✓
- Previsión de coste (RED 5 sujetos 3,50 $, GREEN 4 sujetos 2,80 $, suma 9 y 6,30 $) → comandos de «Verificación» de las 3 tasks y tope de las decisiones. ✓
- Aspectos sin cambios (src, test, scripts) → N/A (confirmado en spec: «Capacidades: ninguna»). ✓
- Entradas del Review Focus 1 y 2 → sin observar: ningún escenario de la batería las ejercita y un sujeto más supera el presupuesto (avisado en las decisiones). ⚠
- Entrada del Review Focus 3 → Task 2, aserción (b) de `c1`. ✓
