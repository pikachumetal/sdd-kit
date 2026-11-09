---
id: 20261109-162249-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace esta sesión en Native, sonnet con effort medium: son cambios de pocas líneas con el código y los tests ya fijados en el plan. La revisión final va aparte: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Parada tras el commit de la Task 1, por instrucción del dev-lead: «cuando tengas el commit de la Task 1, para». Se retoma con «sigue».
4. Las reservas se siembran con `import('../src/app.js?<caso>')`: cada URL da un módulo con las reservas recién creadas, sin añadir código para reiniciarlas.
5. Coste estimado: ~1,5 h; sin despachos salvo la revisión final.
6. Review Focus: 5 entradas que la spec no fija; ver la sección.

**Goal**: cancelar con un motivo de la lista y poder listar las canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo contra una constante `REASONS` y lo guarda en la reserva; el comando `canceladas` lee las reservas con estado `cancelled`.

**Tech Stack**: Node 22, sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22 sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Textos de la interfaz en castellano, literales de la spec: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`, `cancelada <sala> <día> (<motivo>)`, `sin canceladas`, `<sala> <día> <franja> · <motivo>`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits en castellano, referenciando la 0010; atribución según el kit.

## Review Focus

- `cancelar Sur mar` (sin motivo, sin reserva) → `motivo no válido…`, no `sin reserva` · Task 1, `sin motivo ni reserva dice motivo no válido`
- `cancelar Norte lun sala ocupada` (motivo con espacio) → `motivo no válido…` y la reserva sigue activa · Task 1, `motivo con espacio es inválido`
- Segunda cancelación de la misma reserva → `sin reserva Norte lun` · Task 1, `cancelar dos veces dice sin reserva`
- Reserva anulada no sale en `canceladas` → `sin canceladas` · Task 2, `una anulada no sale`
- Segunda cancelación no cambia el motivo guardado → `canceladas` sigue con el primero · Task 2, `cancelar dos veces conserva el motivo`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tercer argumento posicional, sin parser.
- [x] **YAGNI gate**: ninguna abstracción nueva más allá de `REASONS`.
- [x] **Brownfield gate**: rompe `cancelar` sin motivo, deliberado (spec, decisión 3); respeta el patrón de `run`.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking` con motivo, comando `canceladas`.
- `test/cancel.test.js` — escenarios de cancelar con motivo.

**Crear**:

- `test/canceled.test.js` — escenarios del listado `canceladas`.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `PRODUCT.md` — la definición de Cancelación no menciona el motivo.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un test comparte reservas con otro del mismo fichero | Media | Bajo | `import('../src/app.js?<caso>')`: un módulo por caso |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Native, esta sesión: sonnet, effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; con `node src/app.js cancelar Norte lun` ve `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` en `src/app.js`; `REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; la reserva cancelada guarda `reason` con la clave (`'sala-ocupada'`).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — reescribe `test/cancel.test.js`; cada caso importa `../src/app.js?<caso>`:
  - `cancelar con sala-ocupada` → `run('cancelar', ['Norte','lun','sala-ocupada'])` = `cancelada Norte lun (sala ocupada)`; igual con `cambio-de-planes` → `(cambio de planes)` y `otro` → `(otro)`.
  - `motivo fuera de la lista` → `['Norte','lun','aburrimiento']` = `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`, y después `run('libres', ['10:00-12:00'])` = `Sur`.
  - `sin motivo` → `['Norte','lun']`, mismo error y `libres` = `Sur`.
  - `sin motivo ni reserva dice motivo no válido` → `['Sur','mar']` = el error.
  - `motivo con espacio es inválido` → `['Norte','lun','sala','ocupada']` = el error; `OTRO` también.
  - `tercer argumento exacto, el resto se ignora` → `['Norte','lun','otro','extra']` = `cancelada Norte lun (otro)`.
  - `cancelar sin reserva lo dice` → `['Sur','mar','otro']` = `sin reserva Sur mar`.
  - `cancelar dos veces dice sin reserva` → segunda llamada `['Norte','lun','otro']` = `sin reserva Norte lun`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los de motivo.
- [ ] **Step 3: Implementación** — `REASONS` en `src/app.js`; `cancelBooking(room, day, reason)` devuelve el error si `reason` no es clave de `REASONS` (antes de buscar la reserva), si no, guarda `booking.reason = reason` y responde `cancelada ${room} ${day} (${REASONS[reason]})`; `run` pasa `params[2]`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar con motivo`. Luego PARAR (instrucción del dev-lead) y decir que se retoma con «sigue».

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native, esta sesión: sonnet, effort medium.
**Tests RED**: hilo principal · `test/canceled.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/canceled.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada invocación de `node src/app.js` empieza de cero: se observa por `run`, en los tests.

**Interfaces**:
- Consume: `REASONS`, `booking.reason` y `status: 'cancelled'` de la Task 1; `status: 'voided'` de `voidBooking`.
- Produce: comando `canceladas` en `run`.

**Ficheros**: crear `test/canceled.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — cada caso importa `../src/app.js?<caso>`:
  - `lista la cancelada con su motivo` → tras `cancelar Norte lun sala-ocupada`, `run('canceladas', [])` = `Norte lun 10:00-12:00 · sala ocupada`.
  - `sin canceladas` → `run('canceladas', [])` = `sin canceladas`.
  - `una anulada no sale` → tras `anular Norte lun`, `canceladas` = `sin canceladas`.
  - `cancelar dos veces conserva el motivo` → cancelar con `sala-ocupada` y con `otro`; `canceladas` = `Norte lun 10:00-12:00 · sala ocupada`.
- [ ] **Step 2: Ver fallar** — `node --test test/canceled.test.js`.
- [ ] **Step 3: Implementación** — en `run`, `canceladas` devuelve las reservas con `status === 'cancelled'` como `${room} ${day} ${slot} · ${REASONS[reason]}` unidas por salto de línea, o `sin canceladas` si no hay.
- [ ] **Step 4: Verificación** — `node --test test/canceled.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): listado de canceladas con motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,8h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; única referencia, el patch 0007 (0,5h).
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar con sala-ocupada`. ✓
- AND `canceladas` muestra el motivo → Task 2, `lista la cancelada con su motivo`. ✓
- AND `cambio-de-planes` y `otro` → Task 1, mismos tests por motivo. ✓
- Motivo fuera de la lista: THEN error y AND sigue activa → Task 1, `motivo fuera de la lista`. ✓
- Sin motivo: THEN, AND activa, AND Sur mar → Task 1, `sin motivo` y `sin motivo ni reserva…`. ✓
- Tercer argumento exacto: `OTRO`, `sala ocupada`, `extra` → Task 1, `motivo con espacio es inválido`, `tercer argumento exacto…`. ✓
- Sin reserva: THEN y AND ya cancelada → Task 1, `cancelar sin reserva lo dice`, `cancelar dos veces…`; motivo conservado → Task 2, `cancelar dos veces conserva el motivo`. ✓
- Listado: THEN, `sin canceladas`, anulada → Task 2. ✓
- Filas «lo que se retira»: `cancelar` sin motivo y la respuesta nueva → Task 1, `sin motivo` y `cancelar con sala-ocupada`. ✓
- Review Focus → Tasks 1 y 2, tests nombrados arriba. ✓
