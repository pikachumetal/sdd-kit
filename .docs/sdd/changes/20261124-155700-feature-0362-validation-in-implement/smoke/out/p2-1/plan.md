---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: done
created: 2026-11-25
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Task 1 y Task 2 con sonnet effort medium, en el hilo principal (Native); la revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Técnica: el motivo se guarda en el campo `reason` de la reserva cancelada; la lista cerrada vive como constante `REASONS` en `src/app.js`. `canceladas` filtra `status === 'cancelled'` (las anuladas, `voided`, no entran: 0011).
4. Técnica: se valida el motivo antes de buscar la reserva, así un motivo inválido nunca cancela nada.
5. Riesgo alto: ninguno. Coste estimado: ~1 h, sin despachar subagentes.
6. Gate de cierre: el de `operations.md` §Testing, `node --test && node scripts/lint.mjs`.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: Todo en `src/app.js`, el único fichero de entrada. `cancelBooking` recibe el motivo, lo valida contra `REASONS` y lo guarda en la reserva; `run` parsea `--motivo` y despacha el nuevo comando `canceladas`.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo fichero; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista de motivos cerrada, exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin dependencias externas (architecture: Node 22, un solo fichero de entrada `src/app.js`).

### De proceso

- Native: la sesión implementa todas las tasks; TDD, tests antes que código (constitution, art. 2).
- Sin código ni tests de `anular`: las anulaciones son de la 0011.
- Commits: convención del proyecto, referenciando la feature 0010.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "Sala Ocupada"` (otra capitalización) → motivo no válido, la lista es exacta · Task 1, `motivo con otra capitalización no es válido`
- `canceladas` sin ninguna reserva cancelada, o con una anulada (`anular`) → no lista nada (cadena vacía), nunca una anulada · Task 2, `canceladas vacío` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y una constante; sin abstracciones.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `cancelBooking` cambia de firma y su test existente se actualiza al nuevo contrato; `anular` y `libres` no se tocan.
- [x] **Constitution check**: tests primero, texto en castellano, gate de cierre `node --test`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/void-listing.test.js` — comprueba que `canceladas` no lista una reserva anulada (proceso propio, estado limpio).

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()`, y `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — el test existente de cancelar pasa a llevar motivo; tests nuevos de motivo y de `canceladas`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones, feature 0011.
- `freeRooms`, `findBooking` — sin cambio.
- `test/app.test.js` — sin cambio.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Las reservas son objetos en memoria; sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

Salida de texto de los comandos, literal de la spec (ver cada task).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El estado en memoria es compartido entre tests de `test/cancel.test.js` | Media | Bajo | Cada test usa una sala y día distintos, o `Sur`/`mar` sin reserva; Norte lun solo lo cancela un test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), sonnet effort medium: sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` de `src/app.js`, devuelve la reserva activa o `undefined`; reservas `{ room, day, slot, status }`, con `status` `'active' | 'cancelled' | 'voided'`; sembrada `Norte lun 10:00-12:00` activa.
- Produce: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `cancelada <room> <day> (<reason>)`, `motivo no válido: cambio de planes, sala ocupada, otro` o `sin reserva <room> <day>`, y deja `reason` en la reserva cancelada; `run('cancelar', [room, day, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituir el test `cancelar una reserva activa` (que cancelaba Norte lun sin motivo) y añadir, en este orden, porque Norte lun solo puede cancelarse una vez:
  - `motivo fuera de la lista` y `motivo con otra capitalización no es válido`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` y con `'Sala Ocupada'` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` se mantiene, con `--motivo otro` en los params: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
- [ ] **Step 2: Ver los tests en rojo** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: fallan los tests nuevos.
- [ ] **Step 3: Implementación** — en `src/app.js`: constante `REASONS`; `cancelBooking(room, day, reason)` valida `REASONS.includes(reason)` antes de buscar la reserva (comparación exacta) y guarda `booking.reason = reason`; en `run`, `cancelar` toma el motivo como el valor que sigue a `--motivo` en `params` (`undefined` si falta).
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: motivo al cancelar (0010)`. Uno solo, al quedar limpia su revisión.

### Task 2 — Listado de canceladas con su motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), sonnet effort medium: sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js test/void-listing.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: las reservas viven en memoria, así que cada `node src/app.js` es un proceso nuevo y `canceladas` solo ve las cancelaciones de su proceso: en un mismo proceso (`run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` y después `run('canceladas', [])`) se ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: reservas con `status === 'cancelled'` y `reason` (las deja `cancelBooking(room, day, reason)` de la Task 1), y `voidBooking(room, day)` que deja `status = 'voided'`; `run(cmd, params)` de `src/app.js`.
- Produce: `listCancelled()` devuelve `string`: una línea `<room> <day> — <reason>` por reserva cancelada, unidas con `\n`, y `''` si no hay ninguna; `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/void-listing.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden porque el estado es compartido:
  - `canceladas vacío`, el primero del fichero, antes de cualquier cancelación: `run('canceladas', [])` → `''`.
  - `canceladas no lista las anuladas`, en el fichero nuevo `test/void-listing.test.js` (cada fichero corre en su proceso, con Norte lun intacto): `run('anular', ['Norte', 'lun'])` → `'anulada Norte lun'` y después `run('canceladas', [])` → `''`.
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` (el de la Task 1), `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver los tests en rojo** — `NO_COLOR=1 node --test test/cancel.test.js test/void-listing.test.js`. Esperado: fallan los de `canceladas`.
- [ ] **Step 3: Implementación** — en `src/app.js`: `listCancelled()` filtra `status === 'cancelled'` y da el formato de «Interfaces»; `run('canceladas')` la devuelve. `node src/app.js canceladas` imprime `''` como línea vacía; no se trata aparte.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js test/void-listing.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: listado de canceladas con motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas en un solo fichero
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista`. ✓
- `canceladas` → «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en spec). ✓
- `cancelar` sin `--motivo` → Task 1, `cancelar sin motivo no cancela`. ✓
- Otra capitalización → Task 1, `motivo con otra capitalización no es válido`. ✓
- `canceladas` vacío y con anuladas → Task 2, `canceladas vacío`, `canceladas no lista las anuladas`. ✓
