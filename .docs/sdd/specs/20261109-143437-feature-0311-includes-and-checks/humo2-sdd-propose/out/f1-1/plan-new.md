---
id: 20261109-200152-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo por task: las dos, sesión actual en Native, Sonnet con effort medium — cambios de pocas líneas en un fichero, con la firma y los tests dados.
2. Ejecución: native, fijado en sdd-kit.json.
3. Parada: tras el commit de la Task 1 el hilo se detiene — «cuando tengas el commit de la Task 1, para».
4. Orden de los tests en `test/cancel.test.js`: los que dejan la reserva activa (sin motivo, motivo no válido) van antes del que cancela Norte lun, porque `bookings` es estado del proceso y el fichero comparte proceso.
5. `canceladas` va en ficheros de test propios (`canceladas.test.js` y `canceladas-lista.test.js`), no en `cancel.test.js`, por la razón de «Dónde se prueba» de la spec; allí el listado de la spec dice `test/canceladas.test.js`, y el segundo fichero es un detalle del plan.
6. Sin observar: que el motivo guardado no cambia al re-cancelar una ya cancelada — `reason` no se exporta y no vale la pena exportarlo para un test.
7. Coste: ~1 h de implementación, sin despachos; la revisión final de rama sí despacha: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lo muestra.

**Architecture**: todo en `src/app.js`: una constante `CANCEL_REASONS`, `cancelBooking` con un tercer parámetro y una función `cancelledList()`; `run` extrae `--motivo` de los parámetros.

**Tech Stack**: Node 22 sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto y lógica de `cancelar` en el fichero único, sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Mensajes literales de la spec, en castellano: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`, `motivo no válido: <x>; elige cambio-de-planes, sala-ocupada u otro`, `cancelada <sala> <día> (<texto del motivo>)`, `sin canceladas`.
- Sin dependencias nuevas; Node 22.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); código limpio.

### De proceso

- Tests antes que código (constitution, art. 2).
- Atribución de commits: la del proyecto, con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` al final.

## Review Focus

- `cancelar --motivo otro Norte lun` (flag antes de sala y día) → toma `--motivo` por sala, no ve motivo y responde `falta el motivo: …`, sin cancelar nada · Task 1, `flag_antes_de_sala_no_cancela`
- `cancelar Norte lun --motivo` (sin valor) → `falta el motivo: …` · Task 1, `motivo_sin_valor`
- `anular Norte lun` y luego `canceladas` → `sin canceladas` · Task 2, `anuladas_no_salen`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, un parámetro y una función; sin módulos nuevos.
- [x] **YAGNI gate**: sin texto libre en `otro`, sin filtros ni persistencia.
- [x] **Brownfield gate**: `anular` y `reservar` intactos; el cambio de `cancelar` sin motivo está declarado en la spec (decisión 3).
- [x] **Constitution check**: texto en castellano (art. 4), tests primero (art. 2).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledList()`, rutas `cancelar` y `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests actuales pasan a llevar `--motivo` y entran los de motivo.

**Crear**:

- `test/canceladas.test.js` — activas y anuladas no salen.
- `test/canceladas-lista.test.js` — una cancelada sale con su motivo.

**NO se tocan**:

- `voidBooking`, `freeRooms`, `reservar` — fuera de alcance (decisión 18 de la spec).
- `.docs/sdd/changelog.md` — histórico; el cierre añade su entrada.

### 1.2 Modelo de datos

La reserva gana `reason` (clave) al cancelarse.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests del mismo fichero | media | tests que pasan o fallan según el orden | orden fijado en decisión 4; `canceladas` en su propio fichero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión actual, Sonnet con effort medium (Native); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tests.
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin `--motivo` ve `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` — reserva activa de `room` y `day`; `reason` es una clave de `CANCEL_REASONS` (`cambio-de-planes` → `cambio de planes`, `sala-ocupada` → `sala ocupada`, `otro` → `otro`) o `undefined`. Devuelve `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` si `reason` es `undefined`; `motivo no válido: ${reason}; elige cambio-de-planes, sala-ocupada u otro` si no está en la lista; `sin reserva ${room} ${day}` si no hay reserva activa; si no, marca `status = 'cancelled'`, guarda `reason` y devuelve `cancelada ${room} ${day} (${texto})`. El motivo se valida antes de buscar la reserva. `run('cancelar', params)`: sala = `params[0]`, día = `params[1]`, motivo = valor tras el primer `--motivo` en `params.slice(2)`, o `undefined`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en este orden, en `test/cancel.test.js`:
  - `cancelar_sin_motivo_no_cancela`: `run('cancelar', ['Norte', 'lun'])` → `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.
  - `motivo_sin_valor`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo texto.
  - `motivo_no_valido`: `run('cancelar', ['Norte', 'lun', '--motivo', 'lluvia'])` → `motivo no válido: lluvia; elige cambio-de-planes, sala-ocupada u otro`.
  - `flag_antes_de_sala_no_cancela`: `run('cancelar', ['--motivo', 'otro', 'Norte', 'lun'])` → `falta el motivo: …`.
  - `motivo_se_valida_antes_que_la_reserva`: `run('cancelar', ['Sur', 'mar'])` → `falta el motivo: …`, y con `['Sur', 'mar', '--motivo', 'lluvia']` → `motivo no válido: lluvia; …`.
  - `cancelar_con_motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'cambio-de-planes'])` → `cancelada Norte lun (cambio de planes)`.
  - `sin_reserva_activa`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `sin reserva Sur mar`.
  - `ya_cancelada_no_se_cancela_otra_vez`: `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `sin reserva Norte lun`.
  Ejecutar y ver que fallan por la razón esperada.
- [ ] **Step 2: Implementación** — `CANCEL_REASONS`, `cancelBooking` y `run` como en Interfaces.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión actual, Sonnet con effort medium (Native); sin despacho.
**Tests RED**: hilo principal · `test/canceladas.test.js` y `test/canceladas-lista.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend, tests.
**Verificación**: `node --test test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada comando de la línea de comandos corre en su proceso y las reservas viven en memoria: `canceladas` solo se ve en tests (decisión 16 de la spec).

**Interfaces**:
- Consume: `cancelBooking(room, day, reason)` y `CANCEL_REASONS` de la Task 1; `reason` guardado en la reserva.
- Produce: `cancelledList()` — líneas `${room} ${day} ${slot} · ${texto}` de las reservas con `status === 'cancelled'`, unidas con `\n`, o `sin canceladas` si no hay. `run('canceladas', [])` la devuelve.

**Ficheros**: crear `test/canceladas.test.js` y `test/canceladas-lista.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** en `test/canceladas.test.js`, en este orden:
  - `activas_no_salen`: `run('canceladas', [])` → `sin canceladas`.
  - `anuladas_no_salen`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` → `sin canceladas`. Va el último: deja Norte lun anulada.
  - En `test/canceladas-lista.test.js`, otro fichero porque la anulada de arriba deja Norte lun sin poder cancelarse: `cancelada_sale_con_su_motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala-ocupada'])`, `run('canceladas', [])` → `Norte lun 10:00-12:00 · sala ocupada`.
- [ ] **Step 2: Implementación** — `cancelledList()` y la ruta en `run`.
- [ ] **Step 3: Verificación** — `node --test test/canceladas.test.js test/canceladas-lista.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): comando canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks en un fichero; incertidumbre baja; sin `estimation-log` previo.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN → Task 1, `cancelar_con_motivo`. ✓
- El motivo es obligatorio: THEN y AND (`--motivo` sin valor) → Task 1, `cancelar_sin_motivo_no_cancela`, `motivo_sin_valor`. ✓
- Que la reserva «sigue activa» tras el error → Task 1, `cancelar_con_motivo` va después y cancela con éxito. ✓
- Motivo validado antes de la reserva → Task 1, `motivo_se_valida_antes_que_la_reserva`. ✓
- Sin reserva activa → Task 1, `sin_reserva_activa`. ✓
- Ya cancelada → Task 1, `ya_cancelada_no_se_cancela_otra_vez`; que el motivo guardado no cambia → sin observar: ningún test lee `reason` (no se exporta) (avisado en las decisiones; lo cubre el eje Código de la revisión final). ⚠
- Solo valen los de la lista → Task 1, `motivo_no_valido`. ✓
- Listado de canceladas → Task 2, `cancelada_sale_con_su_motivo`. ✓
- El listado no incluye anuladas ni activas → Task 2, `anuladas_no_salen`, `activas_no_salen`. ✓
- Fila de la tabla «cancelar sin motivo deja de cancelar» → Task 1, `cancelar_sin_motivo_no_cancela`. ✓
- Review Focus → Task 1, `flag_antes_de_sala_no_cancela`, `motivo_sin_valor`; Task 2, `anuladas_no_salen`. ✓
