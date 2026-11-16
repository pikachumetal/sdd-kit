---
id: 20261101-122449-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: sesión Native en Sonnet con effort medium para las dos — son un cambio de una función y un comando nuevo, con los textos exactos de la spec.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Los tests nuevos van en un fichero por tema (`cancel-reason.test.js`, `cancelled-list.test.js`): el estado vive en memoria y cada fichero corre en su proceso, así que no se pisan.
4. El motivo se valida con `Object.hasOwn` sobre la tabla, no con `in`: `toString` no puede colarse como motivo.
5. Coste estimado: 1 h entre spec, plan e implementación; sin despachos, así que sin gasto de subagentes más allá de la revisión final.
6. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: todo en `src/app.js`: una tabla de motivos, `cancelBooking` con tercer parámetro y un `cancelledBookings()` que arma el listado; `run` enruta `cancelar` y `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de `cancelar` y añade un comando en el mismo fichero, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Textos de la spec, literales: `indica un motivo. Elige: cambio-de-planes, sala-ocupada, otro` · `motivo no válido: <motivo>. Elige: cambio-de-planes, sala-ocupada, otro` · `sin canceladas`.
- Node 22, sin dependencias externas, un solo fichero de entrada `src/app.js` (`tech-stack.md`).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).

### De proceso

- Tests antes que código (constitution, art. 2); texto de la interfaz en castellano (art. 4).
- Commits: uno por task, referenciando la 0010.

## Review Focus

- Motivo `toString` (o `constructor`) → `motivo no válido: toString. Elige: cambio-de-planes, sala-ocupada, otro`, y la reserva sigue activa · Task 1, `un motivo heredado del objeto no vale`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una tabla y dos funciones; nada que simplificar.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo la firma de `cancelar`, que pide la spec; respeta el patrón del fichero.
- [x] **Constitution check**: tests antes que código, castellano, git-flow.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancel-reason.test.js` — cancelar con motivo, sin motivo y con motivo no válido.
- `test/cancelled-list.test.js` — el comando `canceladas`.

**Modificar**:

- `src/app.js` — tabla de motivos, `cancelBooking(room, day, reason)`, `cancelledBookings()` y el enrutado de `run`.
- `test/cancel.test.js` — el test de cancelar una reserva activa pasa el motivo `otro`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — la 0011 los trata; las anuladas no tienen motivo.

### 1.2 Modelo de datos

La reserva gana el campo `reason` (clave del motivo) al cancelarse. Sin migración: memoria.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un motivo heredado del objeto (`toString`) pasa la validación | Baja | Bajo | `Object.hasOwn` y su test (Review Focus) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (la task trae textos y firmas exactos).
**Tests RED**: hilo principal · `test/cancel-reason.test.js` y el ajuste de `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/cancel-reason.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun`; sin motivo o con `vacaciones`, ve el mensaje con la lista y la reserva sigue activa.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`, tal como están.
- Produce: `cancelBooking(room, day, reason)` — con reserva activa y motivo válido devuelve `cancelada <sala> <día>`, pone `status: 'cancelled'` y `reason: <clave>`; `run('cancelar', [sala, día, motivo])` la llama.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancel-reason.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, el primer test pasa a `run('cancelar', ['Norte', 'lun', 'otro'])`. En `test/cancel-reason.test.js`, en este orden (comparten estado en memoria; el último es el único que cancela):
  - `sin motivo no se cancela`: `run('cancelar', ['Norte','lun'])` → `indica un motivo. Elige: cambio-de-planes, sala-ocupada, otro`.
  - `un motivo fuera de la lista no se acepta`: `run('cancelar', ['Norte','lun','vacaciones'])` → `motivo no válido: vacaciones. Elige: cambio-de-planes, sala-ocupada, otro`.
  - `un motivo heredado del objeto no vale`: `run('cancelar', ['Norte','lun','toString'])` → `motivo no válido: toString. Elige: cambio-de-planes, sala-ocupada, otro`.
  - `con motivo válido cancela`: `run('cancelar', ['Norte','lun','sala-ocupada'])` → `cancelada Norte lun` (que llegue a cancelar tras los tres rechazos prueba que la reserva seguía activa).
  Ejecutar y ver fallar.
- [ ] **Step 2: Implementación** — en `src/app.js`: tabla `REASONS` (`'cambio-de-planes'` → `'cambio de planes'`, `'sala-ocupada'` → `'sala ocupada'`, `otro` → `'otro'`); `cancelBooking(room, day, reason)` mira primero la reserva (`sin reserva …`), luego `reason` ausente y luego `!Object.hasOwn(REASONS, reason)`, con los textos de la spec, y solo entonces cancela y guarda `reason`; `run` pasa `params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/cancel-reason.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancelled-list.test.js`, escrito antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancelled-list.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela Norte lun con `sala-ocupada` y escribe `canceladas`: ve `Norte lun 10:00-12:00 · sala ocupada`; antes de cancelar nada, ve `sin canceladas`.

**Interfaces**:
- Consume: `REASONS` y el campo `reason` de las reservas canceladas (Task 1).
- Produce: `cancelledBookings()` → texto del listado; `run('canceladas', [])` lo devuelve.

**Ficheros**: modificar `src/app.js`; crear `test/cancelled-list.test.js`.

- [ ] **Step 1: Tests RED** — en este orden: `sin canceladas el listado lo dice`: `run('canceladas', [])` → `sin canceladas`; `el listado enseña el motivo`: tras `run('cancelar', ['Norte','lun','sala-ocupada'])`, `run('canceladas', [])` → `Norte lun 10:00-12:00 · sala ocupada`. Ver fallar.
- [ ] **Step 2: Implementación** — `cancelledBookings()`: las reservas con `status === 'cancelled'`, una línea `<sala> <día> <franja> · <REASONS[reason]>` por reserva, unidas con salto de línea y en el orden de `bookings`; sin ninguna, `sin canceladas`. `run('canceladas')` la devuelve.
- [ ] **Step 3: Verificación** — `node --test test/cancelled-list.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): comando canceladas con el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; el patch 0007 (`cancel`) costó 0,5 h
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN `cancelada Norte lun` → Task 1, `con motivo válido cancela`. ✓
- Cancelar con motivo: AND reserva cancelada con el motivo → Task 2, `el listado enseña el motivo` (la Task 1 no lo observa sola: el motivo solo se ve en el listado). ✓
- Sin motivo: THEN texto y AND reserva activa → Task 1, `sin motivo no se cancela` y, tras los rechazos, `con motivo válido cancela`. ✓
- Motivo fuera de la lista: THEN texto y AND reserva activa → Task 1, `un motivo fuera de la lista no se acepta` y el mismo test final. ✓
- Sin reserva antes que el motivo: THEN `sin reserva Sur mar` → Task 1, `cancelar sin reserva lo dice` (existente en `test/cancel.test.js`, sin tocar). ✓
- Listado con motivo → Task 2, `el listado enseña el motivo`. ✓
- Sin canceladas → Task 2, `sin canceladas el listado lo dice`. ✓
- Reglas de la capacidad (límites, avisos): Task 1, los tres tests de rechazo. ✓
- `anular` y `voidBooking` → N/A (no se tocan). ✓
- Review Focus `toString` → Task 1, `un motivo heredado del objeto no vale`. ✓
