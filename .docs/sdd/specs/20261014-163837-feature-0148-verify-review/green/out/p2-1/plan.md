---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-14
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, Sonnet con effort medium (`sdd-kit:effort-medium` + `sonnet` si se despachara) — cambia una función y un comando de un fichero, con los textos ya fijados por la spec. La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en sdd-kit.json; una task, un fichero de código, cabe en un contexto.
3. **Sin `--motivo` se trata como motivo no válido**: `cancelar Norte lun` responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. La spec dice que cancelar «pide» un motivo y no fija este caso.
4. **Orden de comprobaciones**: primero la reserva, después el motivo. `cancelar Sur mar` sigue respondiendo «sin reserva Sur mar» aunque no lleve motivo, así el test existente no cambia.
5. **Un motivo no válido no cancela**: la reserva sigue activa.
6. **`canceladas` solo lista estado `cancelled`**: las `voided` (anuladas) no entran, porque la spec habla de «estado cancelada» y las anulaciones son la 0011. Sin test propio: con una sola reserva sembrada la app no permite tener una anulada y una cancelada a la vez; lo cubre el filtro por estado y la revisión final.
7. **`canceladas` sin ninguna cancelada** responde `sin canceladas`; la spec no fija el texto.
8. **Coste**: ~0,5 h de implementación; sin despacho de subagentes en Native.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`reason`) al pasar a `cancelled`; `canceladas` filtra `bookings` por estado. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node 22 sin dependencias, `node --test`, un solo fichero de entrada `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de un comando y añade otro en `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas y nombres que dicen lo que hacen.

### De proceso

- Tests antes que código (constitution, art. 2).
- Un commit por hito; commits con la convención del proyecto (`feat:`) y el id 0010.
- Atribución de commits según el kit.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "vacaciones"` → mensaje de motivo no válido y la reserva NO queda cancelada (una segunda llamada válida la cancela) · Task 1, `un motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → `sin canceladas` · Task 1, `canceladas sin ninguna cancelada`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un comando de filtro; nada más.
- [x] **YAGNI gate**: sin abstracción nueva; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo por lo que la spec cambia (el texto de `cancelar`); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, textos en castellano, flujo SDD.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo; nueva `cancelledBookings`; `run` enruta `canceladas` y pasa `--motivo`.
- `test/cancel.test.js` — escenarios de la spec y los tres de Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, feature 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin relación.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten el estado en memoria del módulo y dependen del orden | Media | Bajo | Orden fijado en la task: primero los casos que no cancelan, luego la cancelación válida, al final `canceladas` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la sesión la hace en gama media: cambia una función y un comando con los textos fijados)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend · tooling (tests)
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `node src/app.js canceladas` — en una sola ejecución las reservas viven en memoria, así que lo comprueba el test, que encadena ambos comandos con `run`.

**Interfaces**:
- Consume: `bookings` (`{ room, day, slot, status }`) y `findBooking(room, day)` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` → `string`; `cancelledBookings()` → `string`; el campo `reason` en la reserva cancelada; el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (comparten el estado en memoria):
  - `cancelar sin reserva lo dice` (existente, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo mensaje.
  - `canceladas sin ninguna cancelada`: `run('canceladas', [])` → `'sin canceladas'` mientras Norte lun siga activa.
  - `cancelar una reserva activa` (sustituye al existente): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver RED**: `node --test test/cancel.test.js` falla por los textos nuevos.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const reasons = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: reserva primero (`sin reserva …`); si `!reasons.includes(reason)` → `` `motivo no válido: ${reasons.join(', ')}` `` sin tocar la reserva; si no, `status = 'cancelled'`, `booking.reason = reason`, `` `cancelada ${room} ${day} (${reason})` ``.
  - `export function cancelledBookings()`: filtra `status === 'cancelled'`, formato `` `${room} ${day} — ${reason}` `` unido por `\n`; sin ninguna → `'sin canceladas'`.
  - `run`: `cancelar` toma el motivo de `params[params.indexOf('--motivo') + 1]` (undefined si no hay `--motivo`); `canceladas` → `cancelledBookings()`.
- [ ] **Step 4: Verificación**: `node --test test/cancel.test.js` en verde.
- [ ] **Step 5: Commit de la task**: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una task, un fichero de código, textos fijados por la spec
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: los dos escenarios ADDED, por `test/cancel.test.js`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN respuesta + AND motivo no válido) → Task 1, tests `cancelar una reserva activa` y `un motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo → `cancelar sin motivo no cancela`; fuera de la lista → `un motivo fuera de la lista no cancela`; sin canceladas → `canceladas sin ninguna cancelada`. ✓
