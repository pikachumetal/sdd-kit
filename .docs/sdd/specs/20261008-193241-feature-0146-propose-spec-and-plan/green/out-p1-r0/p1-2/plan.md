---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, la hace la sesión (Native); sin subagentes de implementación. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en sdd-kit.json. Una task de dos funciones en un fichero: un subagente por task no aporta nada.
3. **`cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela.** La spec dice que cancelar «pide» un motivo pero no cubre la omisión; es el mismo caso que un motivo fuera de la lista. Consecuencia: el test existente `cancelar una reserva activa` (sin motivo) deja de describir el comportamiento y se reescribe con `--motivo "sala ocupada"`.
4. **Orden de validación: primero la reserva, luego el motivo.** `cancelar Sur mar` sin reserva sigue respondiendo `sin reserva Sur mar` (el test existente `cancelar sin reserva lo dice` no cambia).
5. **Un motivo no válido no cancela la reserva** (queda `active`).
6. **`canceladas` sin ninguna cancelada responde `sin canceladas`**; solo lista el estado `cancelled`, no `voided` (anulaciones: 0011).
7. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
8. Coste estimado: ~0,5 h, una task, sin despachos.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`booking.reason`) al pasar a `cancelled`. `cancelBooking` valida y guarda; una función nueva `cancelledBookings` produce el listado; `run` extrae `--motivo` de los parámetros y enruta `canceladas`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Motivos válidos, literales y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (guion largo `—`).
- Sin dependencias externas; todo en `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Tests antes que código (Art. 2 de la constitution); gate de cierre: `node --test` entero en verde.
- Commits sobre `feature/0010-cancel-reason`, con el id `0010` en el mensaje.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → igual que sin motivo · Task 1, `cancelar con --motivo sin valor no cancela`
- Motivo fuera de la lista no cancela: tras `--motivo "aburrimiento"`, un `cancelar Norte lun --motivo otro` posterior sí encuentra la reserva activa · Task 1, `motivo no válido deja la reserva activa`
- `canceladas` sin canceladas → `sin canceladas`, no una línea vacía · Task 1, `canceladas sin canceladas`
- Una reserva anulada (`anular`) no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y una función de listado; sin módulos nuevos.
- [x] **YAGNI gate**: la lista de motivos es una constante; no se abstrae nada.
- [x] **Brownfield gate**: retrocompatible salvo la omisión del motivo (decisión 3); sigue el patrón de `src/app.js`; `voidBooking` no se toca.
- [x] **Constitution check**: tests antes que código (Art. 2), castellano (Art. 4), flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)`, nueva `cancelledBookings()`, constante `REASONS`, y `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de los dos escenarios de la spec y del Review Focus; reescribe `cancelar una reserva activa`.

**NO se tocan**:

- `test/app.test.js` — no cubre cancelación.
- `voidBooking` y el comando `anular` — anulaciones del responsable, feature 0011.

### 1.2 Modelo de datos

La reserva gana `reason` (string, solo en `cancelled`). Datos en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica (CLI de texto).

### 1.6 Dependencias

Ninguna. La 0011 queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Quien cancelaba sin motivo recibe ahora un error | media | bajo | Decisión 3 a validar; el mensaje lista los motivos válidos |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: la sesión Native (sin despacho); revisor final `subagent_type: sdd-kit:effort-high` + `model: opus`.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: sí: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». (La reserva vive en memoria por proceso: `canceladas` en otra ejecución sale vacía; el listado se prueba por `run`.)

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`; `cancelledBookings(): string`; `run('cancelar', [room, day, '--motivo', reason])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (guarda una copia fuera del repo). Los tests comparten el estado en memoria de `bookings` (Norte lun activa), así que cada test que cancela usa un día/sala distintos o se ordena a propósito:
  - `cancelar con motivo` — `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `cancelada Norte lun (sala ocupada)` (reescribe `cancelar una reserva activa`).
  - `canceladas enseña el motivo` — tras el anterior, `run('canceladas', [])` → `Norte lun — sala ocupada`.
  - `motivo fuera de la lista` — con reserva activa, `--motivo "aburrimiento"` → `motivo no válido: cambio de planes, sala ocupada, otro`.
  - `cancelar sin motivo no cancela` y `cancelar con --motivo sin valor no cancela` — mismo mensaje.
  - `motivo no válido deja la reserva activa` — tras uno inválido, `cancelar … --motivo otro` → `cancelada … (otro)`.
  - `canceladas sin canceladas` → `sin canceladas` (primero del fichero).
  - `canceladas no lista las anuladas` — tras `anular`, no aparece.
  - `cancelar sin reserva lo dice` se mantiene tal cual.
  Aislamiento: las reservas viven en el array `bookings` del módulo y `reservar` no crea reservas sueltas. Para que cada test tenga su reserva activa, exporta `addBooking(room: string, day: string, slot: string): void` desde `src/app.js` (añade `{room, day, slot, status: 'active'}`); regístralo como ruling. `canceladas sin canceladas` y el escenario de la spec (Norte lun) van primero en el fichero.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos.
- [ ] **Step 3: Implementación** en `src/app.js`: `const REASONS = ['cambio de planes','sala ocupada','otro']`; `cancelBooking(room, day, reason)` comprueba primero la reserva (`sin reserva …`), luego `REASONS.includes(reason)` (si no, `motivo no válido: ${REASONS.join(', ')}`), y solo entonces fija `status='cancelled'` y `reason`; `cancelledBookings()` une con `\n` las líneas `${room} ${day} — ${reason}` de las `cancelled`, o `sin canceladas`; `run` toma el valor tras `--motivo` (undefined si falta) y enruta `canceladas`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: todo verde, exit 0.
- [ ] **Step 5: Comparar RED y commit** — `git diff --no-index` entre la copia y los tests finales (solo formato); commit único `feat(0010): motivo al cancelar y listado de canceladas`; después `sdd task done`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los dos escenarios de la spec por `run` y por la CLI
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (respuesta y motivo inválido) → Task 1. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1. ✓
- «No entra: anulaciones» → N/A, `voidBooking` intacta. ✓
- Review Focus (5 líneas) → Task 1, tests nombrados. ✓
