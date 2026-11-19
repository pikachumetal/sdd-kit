---
id: 20261119-162900-feature-0010-motivo-cancelacion
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en `sdd-kit:effort-medium` + `sonnet` — texto exacto fijado por la spec y un solo fichero; la revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura en `effort-high` + `opus`, Código en `effort-high` + `sonnet`).
2. Ejecución: native — fijado en `sdd-kit.json`; 2 tasks encadenadas por `CANCEL_REASONS` y `cancelledBookings`, el error lo caza el test de cada task.
3. Se exporta `bookings` desde `src/app.js` — los tests necesitan sembrar su propio estado y no hay otra vía (`reservar` no crea reservas); es el array que ya existe, sin función nueva.
4. `cancelledBookings()` devuelve el texto ya formateado, no los datos — `run` solo imprime líneas y no hay otro consumidor (YAGNI).
5. Coste estimado: ~1,5 h en total, sin despacho de subagentes salvo la revisión final.
6. Review Focus: 4 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y el comando nuevo `canceladas` lo enseña.

**Architecture**: todo en `src/app.js`, el único fichero de entrada: una constante `CANCEL_REASONS`, `cancelBooking` valida y guarda `reason`, y una función nueva formatea las canceladas; `run` las enruta.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo fichero; sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Motivos válidos, exactos: `cambio-de-planes`, `sala-ocupada`, `otro`; etiquetas en pantalla: `cambio de planes`, `sala ocupada`, `otro`.
- Texto de la interfaz y de los documentos en castellano (constitution, Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Node 22, sin dependencias externas; un solo fichero de entrada `src/app.js`.

### De proceso

- Native, sin subagentes; commits referenciando `0010`.
- Gate de cierre una sola vez, en §3.

## Review Focus

- `cancelar Norte lun Otro` (mayúscula) → `motivo no válido: Otro; usa cambio-de-planes, sala-ocupada, otro`, sin cancelar · Task 1, `motivo distingue mayúsculas`
- `cancelar Norte lun otro extra` → se ignora el sobrante: `cancelada Norte lun (otro)` · Task 1, `argumento sobrante se ignora`
- cancelar dos veces la misma reserva → la segunda responde `sin reserva Norte lun` y conserva el motivo de la primera · Task 1, `cancelar una ya cancelada no cambia su motivo`
- una reserva anulada junto a otra cancelada → `canceladas` solo lista la cancelada · Task 2, `las anuladas no salen en canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones, sin módulos.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `cancelar` sin reserva se comporta igual; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (Art. 2); texto en castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledBookings`, ruta `canceladas`, export de `bookings`.
- `test/cancel.test.js` — tests de `cancelar` con motivo y de `canceladas`, cada test sembrando su estado.

**NO se tocan**:

- `voidBooking` y `anular` — fuera de scope (decisión 7 de la spec).
- `test/app.test.js` — corre en su propio proceso con su propio `bookings`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests que dependen del orden por compartir `bookings` | media | tests intermitentes | cada test siembra con `seed(...)` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native, la propia sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin motivo ve `falta el motivo: cambio-de-planes, sala-ocupada, otro`.

**Interfaces**:
- Consume: nada.
- Produce: `export const CANCEL_REASONS` (`{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`), `export const bookings`, y `cancelBooking(room, day, reason)` que guarda `reason` (la clave) junto a `status: 'cancelled'`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `seed(...list)` (vacía `bookings` y mete `{ room, day, slot, status }`), importando `run` y `bookings`. Nombres y asserts:
  - `cancelar con motivo`: seed `Norte lun 10:00-12:00 active`; `run('cancelar', ['Norte','lun','sala-ocupada'])` = `cancelada Norte lun (sala ocupada)`; `bookings[0].status` = `cancelled` y `bookings[0].reason` = `sala-ocupada`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` = `falta el motivo: cambio-de-planes, sala-ocupada, otro`; `bookings[0].status` = `active`.
  - `motivo fuera de lista no cancela`: `aburrimiento` → `motivo no válido: aburrimiento; usa cambio-de-planes, sala-ocupada, otro`; sigue `active`.
  - `motivo distingue mayúsculas`: `Otro` → `motivo no válido: Otro; usa cambio-de-planes, sala-ocupada, otro`.
  - `argumento sobrante se ignora`: `['Norte','lun','otro','extra']` → `cancelada Norte lun (otro)`.
  - `cancelar sin reserva lo dice`: seed vacío; `['Sur','mar','aburrimiento']` → `sin reserva Sur mar`.
  - `cancelar una ya cancelada no cambia su motivo`: tras cancelar con `otro`, `['Norte','lun','sala-ocupada']` → `sin reserva Norte lun` y `bookings[0].reason` = `otro`; con la reserva sembrada `voided`, también `sin reserva Norte lun`.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: falla (`ℹ fail` > 0).
- [ ] **Step 3: Implementación** — en `src/app.js`: `export const CANCEL_REASONS`, `export const bookings` (el array actual), `export function cancelBooking(room, day, reason)`: primero la reserva (`sin reserva <sala> <día>`), luego `falta el motivo: cambio-de-planes, sala-ocupada, otro` si no hay `reason`, o `motivo no válido: <reason>; usa cambio-de-planes, sala-ocupada, otro` si no es clave de `CANCEL_REASONS`; si es válido, `status = 'cancelled'`, `reason` y `cancelada <sala> <día> (<etiqueta>)`. `run` pasa `params[2]`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native, la propia sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js canceladas` y ve `sin canceladas` (la memoria no persiste entre ejecuciones).

**Interfaces**:
- Consume: `bookings` y `CANCEL_REASONS` de la Task 1; las canceladas llevan `reason` con una clave de `CANCEL_REASONS`.
- Produce: `export function cancelledBookings()` que devuelve una línea `<sala> <día> <franja> · <etiqueta>` por reserva con `status === 'cancelled'`, en orden de alta, unidas con `\n`, o `sin canceladas`; `run('canceladas', [])` lo devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — con `seed`: `canceladas en orden de alta`: seed `Norte lun 10:00-12:00 cancelled reason cambio-de-planes` y `Sur mar 09:00-10:00 cancelled reason otro` → `Norte lun 10:00-12:00 · cambio de planes\nSur mar 09:00-10:00 · otro`; `sin canceladas`: seed vacío → `sin canceladas`; `las anuladas no salen en canceladas`: seed `Norte lun voided` y `Sur mar cancelled reason otro` → solo `Sur mar 09:00-10:00 · otro`; y solo una anulada → `sin canceladas`.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: falla.
- [ ] **Step 3: Implementación** — `cancelledBookings()` y la ruta `canceladas` en `run`, en `src/app.js`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): comando canceladas con el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 0,6 h
- Estimación de revisión: 0,2 h
- Estimación de cierre: 0,2 h
- Base de la estimación: 2 tasks en un fichero, texto exacto fijado por la spec; sin referencia en el log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo → `cancelada Norte lun (sala ocupada)` y motivo guardado → Task 1, `cancelar con motivo`. ✓
- Motivos válidos de la lista (AND) → Task 1, `cancelar con motivo` y `argumento sobrante se ignora`. ✓
- Sin motivo → `falta el motivo…` y sigue activa → Task 1, `cancelar sin motivo no cancela`. ✓
- Motivo fuera de lista → `motivo no válido…` y sigue activa → Task 1, `motivo fuera de lista no cancela`. ✓
- Cancelar sin reserva (la reserva antes que el motivo) → Task 1, `cancelar sin reserva lo dice`. ✓
- Cancelar ya cancelada o anulada → Task 1, `cancelar una ya cancelada no cambia su motivo`. ✓
- Listado: una línea por reserva, en orden de alta → Task 2, `canceladas en orden de alta`. ✓
- Listado vacío o solo anuladas → Task 2, `sin canceladas` y `las anuladas no salen en canceladas`. ✓
- Fila «cancelar sin motivo deja de cancelar» de la tabla de la spec → Task 1, `cancelar sin motivo no cancela`. ✓
- Review Focus (4 líneas) → Tasks 1 y 2, tests nombrados arriba. ✓
