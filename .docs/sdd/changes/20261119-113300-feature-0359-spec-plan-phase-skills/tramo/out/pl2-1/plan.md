---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 en el hilo principal (Native), gama media (sonnet, effort medium) — un solo fichero de código y la firma y los textos van en el plan.
2. **Ejecución**: native, fijado en `sdd-kit.json`; con una sola task no hay interfaces entre tasks que revisar por separado.
3. **Orden de validación**: el motivo se valida antes de buscar la reserva. `cancelar Sur mar --motivo x` responde el error de motivo, no «sin reserva»; así un motivo inválido nunca consume ni oculta la reserva.
4. **`--motivo` ausente o sin valor** (`cancelar Norte lun`, `cancelar Norte lun --motivo`) responde lo mismo que un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». La spec dice «cancelar pide un motivo» y calla este caso.
5. **`canceladas` sin ninguna cancelación** responde «sin canceladas» (texto mío, la spec lo calla); con varias, una línea por reserva, en orden de cancelación. Solo cuenta el estado `cancelled`: las `voided` (anulaciones, 0011) no salen.
6. **Los tests comparten el estado en memoria** de `src/app.js` y `node --test` ejecuta los de un fichero en orden: `test/cancel.test.js` va ordenado (listado vacío → motivos inválidos → cancelación → listado → sin reserva) y la Task 1 lo fija; no se añade ningún reset exportado (YAGNI).
7. **Sin observar** ⚠: la fila 2 del anexo («la reserva de otra persona no se toca») no tiene test posible: el modelo de reserva no guarda a nombre de quién está (`src/app.js`), y la spec no lo añade. Se conserva solo en el sentido de que `cancelar` no cambia su regla de búsqueda por sala y día; queda sin observar hasta que el modelo tenga responsable (0011).
8. **Los tests existentes de `cancelar`** se reescriben con `--motivo`: sin él ya no pasan por diseño (decisión 4). El de «sin reserva» conserva su texto literal (anexo, fila 1).
9. **Riesgos altos**: ninguno. **Coste**: ~0,5 h, sin despacho de subagentes.
10. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva, y el nuevo comando `canceladas` lista las canceladas con su motivo.

**Architecture**: `cancelBooking` valida el motivo contra la lista, lo guarda en la reserva (`reason`) al pasarla a `cancelled`, y `run` extrae el valor de `--motivo`. Una función nueva `cancelledBookings` formatea el listado a partir de las reservas con estado `cancelled`.

**Tech Stack**: Node 22, ESM, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando dentro de `src/app.js`: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: «cancelada Norte lun (sala ocupada)» · «motivo no válido: cambio de planes, sala ocupada, otro» · «Norte lun — sala ocupada» (raya `—` entre día y motivo) · «sin reserva <sala> <día>».
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- No se toca `voidBooking` ni el comando `anular` (anulaciones: 0011).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: funciones cortas, nombres que dicen lo que hacen.

### De proceso

- Native: el hilo principal implementa; el modelo más capaz queda para los ejes Spec y Arquitectura de la revisión final.
- Commits con la convención del proyecto (`feat: …`) y la atribución que fije el harness; sin `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», sin cancelar · Task 1, `cancelar sin motivo pide uno de la lista`
- `cancelar Norte lun --motivo` (sin valor) → el mismo mensaje de motivo no válido · Task 1, `cancelar con --motivo sin valor`
- Motivo inválido sobre una reserva que no existe (`cancelar Sur mar --motivo x`) → el error de motivo, no «sin reserva» · Task 1, `motivo no válido gana a sin reserva`
- `canceladas` sin ninguna cancelación → «sin canceladas», no una línea vacía · Task 1, `canceladas sin cancelaciones lo dice`
- Cancelar dos veces la misma reserva con motivo válido → «sin reserva Norte lun» y el listado no duplica ni cambia el motivo · Task 1, `cancelar una reserva ya cancelada no la repite`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones y un comando en el fichero existente.
- [x] **YAGNI gate**: sin abstracciones; sin reset de estado exportado para los tests.
- [x] **Brownfield gate**: respeta el patrón del módulo (`run` despacha por comando); `anular` y `voidBooking` quedan intactos.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante de motivos, `cancelBooking` con motivo, `cancelledBookings`, comandos `cancelar` (con `--motivo`) y `canceladas` en `run`.
- `test/cancel.test.js` — reescribe los dos tests existentes con `--motivo` y añade los de la spec y el Review Focus.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` en `src/app.js` — anulaciones del responsable, feature 0011.
- `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva gana el campo `reason` (cadena), puesto al cancelar; las activas no lo tienen. Sin persistencia: las reservas viven en memoria.

### 1.3 a 1.5

No aplican (sin migraciones, API ni UX más allá del texto de la terminal).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Media | Bajo | Orden fijado de los tests (decisión 6) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: hilo principal (Native), sonnet, effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: de `src/app.js`, `findBooking(room, day)` (devuelve la reserva `active` o `undefined`) y `bookings` (reservas con `room`, `day`, `slot`, `status`).
- Produce: `cancelBooking(room, day, reason)` → `string`; `cancelledBookings()` → `string`; comandos `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten el estado en memoria; el primero va antes de cualquier cancelación), con `run` y `assert.equal` como los actuales, con `const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';`:
  1. `canceladas sin cancelaciones lo dice` → `run('canceladas', [])` = `'sin canceladas'`
  2. `cancelar sin motivo pide uno de la lista` → `run('cancelar', ['Norte', 'lun'])` = `INVALID`
  3. `cancelar con --motivo sin valor` → `run('cancelar', ['Norte', 'lun', '--motivo'])` = `INVALID`
  4. `cancelar con un motivo fuera de la lista` → `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` = `INVALID`
  5. `motivo no válido gana a sin reserva` → `run('cancelar', ['Sur', 'mar', '--motivo', 'x'])` = `INVALID`
  6. `cancelar una reserva activa` (reescrito) → `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` = `'cancelada Norte lun (sala ocupada)'`
  7. `canceladas enseña el motivo` → `run('canceladas', [])` = `'Norte lun — sala ocupada'`
  8. `cancelar sin reserva lo dice` (reescrito) → `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` = `'sin reserva Sur mar'`
  9. `cancelar una reserva ya cancelada no la repite` → `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` = `'sin reserva Norte lun'`, y después `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests 1 a 7; el 8 y el 9 pueden pasar ya con el código actual (la respuesta «sin reserva» no cambia), y no es un fallo del RED.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: primero, si `reason` no está en `CANCEL_REASONS`, devuelve `` `motivo no válido: ${CANCEL_REASONS.join(', ')}` ``; después busca la reserva activa (`sin reserva ${room} ${day}` si no hay); la pasa a `cancelled`, guarda `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``.
  - `export function cancelledBookings()`: las reservas con `status === 'cancelled'`, una línea `` `${room} ${day} — ${reason}` `` cada una, unidas con `'\n'`; sin ninguna, `'sin canceladas'`.
  - En `run`: `cancelar` toma el motivo de `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está en `params` (si no, `undefined`) y llama `cancelBooking(params[0], params[1], motivo)`; `canceladas` devuelve `cancelledBookings()`. `anular` queda igual.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 1 task, un fichero de código y uno de tests, comportamiento y textos fijados en la spec.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED cancelar · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED cancelar · AND motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `cancelar con un motivo fuera de la lista`. ✓
- ADDED canceladas · THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo` (el GIVEN lo pone `cancelar una reserva activa`, que va antes). ✓
- Anexo, fila 1 (`sin reserva <sala> <día>`, mismo texto) → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo, fila 2 (la reserva de otra persona no se toca) → sin observar: la reserva no guarda a nombre de quién está (avisado en las decisiones, 7). ⚠
- `anular` / anulaciones → N/A (fuera de scope, 0011). ✓
- Review Focus (5 líneas) → Task 1, tests 2, 3, 5, 1 y 9. ✓
