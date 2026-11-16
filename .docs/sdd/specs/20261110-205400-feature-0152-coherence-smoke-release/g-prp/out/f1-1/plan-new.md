---
id: 20261112-151905-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: ambas tasks las hace el hilo principal (Native), sin despachos; cambios de ~20 líneas en un fichero.
2. Ejecución: Native, porque 2 tasks encadenadas por el mismo fichero `src/app.js`, un error lo caza el test de su task y el plan cabe en un contexto.
3. `listCancelled()` y `REASONS` se exportan/definen en `src/app.js`; no se crea módulo nuevo (arquitectura: un solo fichero de entrada).
4. Coste estimado: ~1 h entre las dos tasks; sin despachos en paralelo.
5. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lista las canceladas con su motivo.

**Architecture**: un mapa `REASONS` (clave → texto) en `src/app.js`; `cancelBooking(room, day, reason)` valida y guarda `reason` en la reserva; `listCancelled()` filtra por estado `cancelled`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por el mismo fichero `src/app.js`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el fichero de entrada, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Mensajes de la interfaz en castellano (constitution, art. 4); claves de motivo exactas: `cambio-de-planes`, `sala-ocupada`, `otro`.
- Sin dependencias externas (Node, `src/app.js` como único fichero de entrada).

### De proceso

- Tests antes que código; un commit por task, referenciando la feature 0010.
- Commits con la atribución que fije el entorno.

## Review Focus

- `cancelar Sur mar xyz` sin reserva → `motivo no válido: …`, no `sin reserva` · Task 1, `cancelar con motivo inválido gana a reserva inexistente`
- `cancelar Norte lun sala ocupada` (con espacios) → `motivo no válido: sala; …` y la reserva sigue activa · Task 1, `cancelar con motivo con espacios es inválido`
- `canceladas` no incluye anuladas con `anular` · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un mapa y dos funciones.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: respeta el único fichero de entrada; los dos tests existentes de `cancelar` se actualizan a la sintaxis nueva (cambio incompatible declarado en la spec).
- [x] **Constitution check**: tests primero, castellano, gate `node --test && node scripts/lint.mjs`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()`, rutas `cancelar` y `canceladas` en `run`.
- `test/cancel.test.js` — tests de `cancelar` con motivo y del listado.

**NO se tocan**:

- `PRODUCT.md`, `CHANGELOG.md` — la terminología no cambia; el changelog lo escribe el corte de la release.
- `voidBooking` — `anular` no pide motivo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper los dos tests actuales de `cancelar` | Alta | Bajo | La Task 1 los actualiza a la sintaxis con motivo |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun sala-ocupada` → `cancelada Norte lun (sala ocupada)`

**Interfaces**:
- Consume: `findBooking(room, day)` y la lista `bookings` de `src/app.js`.
- Produce: `REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', 'otro': 'otro' }`; `cancelBooking(room, day, reason)` guarda `booking.reason = reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con las tres reservas del test aisladas de las de otros tests (el fichero comparte estado en memoria: usar `Norte lun`, que es la reserva sembrada):
  - `cancelar con motivo`: `run('cancelar', ['Norte', 'lun', 'sala-ocupada'])` → `cancelada Norte lun (sala ocupada)`.
  - `cancelar sin motivo lo pide`: `run('cancelar', ['Norte', 'lun'])` → `indica un motivo: cambio-de-planes, sala-ocupada, otro`.
  - `cancelar con motivo desconocido`: `run('cancelar', ['Norte', 'lun', 'xyz'])` → `motivo no válido: xyz; usa cambio-de-planes, sala-ocupada, otro`.
  - `cancelar con motivo inválido gana a reserva inexistente`: `run('cancelar', ['Sur', 'mar', 'xyz'])` → `motivo no válido: xyz; usa cambio-de-planes, sala-ocupada, otro`.
  - `cancelar con motivo con espacios es inválido`: `run('cancelar', ['Norte', 'lun', 'sala', 'ocupada'])` → `motivo no válido: sala; usa cambio-de-planes, sala-ocupada, otro`.
  - `cancelar sin reserva lo dice` (actualizado): `run('cancelar', ['Sur', 'mar', 'otro'])` → `sin reserva Sur mar`.
  Los tests que no deben cancelar (sin motivo, inválidos) van antes del que cancela, o la reserva sembrada ya estará cancelada: orden en el fichero: inválidos, sin reserva, y al final `cancelar con motivo`. Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`, `cancelBooking(room, day, reason)`: sin `reason` → `indica un motivo: ${claves.join(', ')}`; `reason` fuera de `REASONS` → `motivo no válido: ${reason}; usa ${claves.join(', ')}`; después, la búsqueda actual; al cancelar guarda `booking.reason = reason` y devuelve `cancelada ${room} ${day} (${REASONS[reason]})`. En `run`, `cancelar` pasa `params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista (Task 1)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque el estado vive en memoria y la CLI no lo conserva entre ejecuciones: se prueba por `run`.

**Interfaces**:
- Consume: `bookings`, `REASONS` y `reason` guardado por la Task 1.
- Produce: `listCancelled()` → `string` con una línea `<sala> <día> <franja> · <motivo>` por reserva `cancelled`, en el orden de `bookings`, unidas con `\n`; sin ninguna, `sin canceladas`; `run('canceladas', [])` la llama.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin ninguna`: `sin canceladas` (ejecutar antes de que ningún test cancele; si el orden lo impide, aislar con una función `resetBookings` solo si ya existe: no se crea).
  - `canceladas lista motivo y orden`: tras cancelar Norte lun con `sala-ocupada`, `run('canceladas', [])` → `Norte lun 10:00-12:00 · sala ocupada`.
  - `canceladas no lista las anuladas`: tras `run('anular', …)` de otra reserva, no aparece.
  El orden de tests importa porque el estado es compartido: ver el orden en el fichero tras la Task 1.
- [ ] **Step 2: Implementación** — `listCancelled()` en `src/app.js` y la ruta `canceladas` en `run`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con motivo (Task 2)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 0,6h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks, un fichero, patrón ya presente en `cancelBooking`; el estado en memoria compartido entre tests es la incertidumbre.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo → `cancelada Norte lun (sala ocupada)` y reserva cancelada con motivo → Task 1, `cancelar con motivo`. ✓
- Sin motivo → `indica un motivo: …`, reserva activa → Task 1, `cancelar sin motivo lo pide`. ✓
- Motivo `xyz` → `motivo no válido: …` → Task 1, `cancelar con motivo desconocido`. ✓
- Sin reserva con motivo válido → `sin reserva Sur mar` → Task 1, `cancelar sin reserva lo dice`. ✓
- Motivo inválido antes que reserva inexistente → Task 1, `cancelar con motivo inválido gana a reserva inexistente`. ✓
- Listado con dos canceladas, orden, sin la activa → Task 2, `canceladas lista motivo y orden`. ⚠ sin observar del todo: `src/app.js` solo siembra Norte lun y no hay forma de crear reservas, así que el orden entre dos canceladas no se puede probar sin exportar `bookings`; la Task 2 prueba una cancelada y la ausencia de la activa si hubiera, y el orden queda a la revisión final (avisado aquí, en las decisiones).
- `sin canceladas` → Task 2, `canceladas sin ninguna`. ✓
- Anulada no aparece → Task 2, `canceladas no lista las anuladas`. ✓
- Reglas de la capacidad (lista cerrada de tres motivos) → Task 1, `cancelar con motivo desconocido`. ✓
- Fila «sintaxis antigua» de la tabla de retirados → Task 1, tests actualizados a la sintaxis con motivo. ✓
- Review Focus: las tres líneas → Task 1 y Task 2, tests nombrados arriba. ✓
