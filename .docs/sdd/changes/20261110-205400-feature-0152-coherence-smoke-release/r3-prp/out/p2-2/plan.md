---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos tasks las hace la propia sesión (Native), sin despacho; la revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native — 2 tasks sobre un solo fichero de código, un error lo caza el test de su task y el plan cabe en un contexto.
3. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa: la spec dice que cancelar «pide» un motivo y no fija este caso.
4. Orden de las comprobaciones en `cancelar`: primero que exista la reserva, después el motivo. Así `cancelar Sur mar` sigue respondiendo «sin reserva Sur mar», como fija hoy `test/cancel.test.js`, y ese test no cambia.
5. `canceladas` lista solo el estado `cancelled`: las `voided` (anular, 0011) no entran. Una línea por reserva, separadas por salto de línea; sin canceladas, salida vacía.
6. El motivo se compara tal cual, sin distinguir nada: «Sala ocupada» no es válido. La spec da la lista en minúsculas.
7. `gate de cierre`: `node --test && node scripts/lint.mjs`, literal de `operations.md`.
8. Coste estimado: ~1 h de implementación; sin despacho, sin coste extra en tokens.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda con la reserva; `canceladas` enseña las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` en el mismo objeto de `bookings` de `src/app.js`; `canceladas` filtra por `status === 'cancelled'`. Sin módulos ni capas nuevas: el fichero ya contiene `cancelBooking` y `run`.

**Tech Stack**: Node ≥ 20, ESM, `node --test`; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por el campo `reason` de la reserva, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: «cancelada Norte lun (sala ocupada)» · «motivo no válido: cambio de planes, sala ocupada, otro» · «Norte lun — sala ocupada» (guion largo `—`).
- Texto de la interfaz en castellano (constitution, art. 4); sin tabuladores en `src/app.js` (`scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa las dos tasks una tras otra; TDD (tests RED antes del código, constitution art. 2).
- Commits en castellano, un commit por task al quedar limpia su revisión.
- Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Norte lun --motivo "Sala ocupada"` (mayúscula) → «motivo no válido…», la reserva sigue activa · Task 1, `un motivo fuera de la lista no cancela`
- `cancelar Sur mar --motivo "otro"` sin reserva → «sin reserva Sur mar», no el error de motivo · Task 1, `cancelar sin reserva lo dice` (el test que ya existe, sin cambios)
- `canceladas` sin ninguna cancelada → salida vacía, no un error; y una reserva anulada (`anular`) no aparece · Task 2, `canceladas sin canceladas no lista nada`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí; un campo y un filtro.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (cancelar ahora exige motivo); sigue el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda `reason`; `run` lee `--motivo` y despacha `canceladas`; nueva `listCancelled()`.
- `test/cancel.test.js` — tests de motivo y de listado.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.

### 1.2 Modelo de datos

Cada reserva cancelada gana `reason: string` (uno de la lista). En memoria, sin migración.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Las reservas viven en memoria y los tests de un fichero comparten estado: cancelar Norte lun en un test afecta a los siguientes | Alta | Medio | Orden fijo en `cancel.test.js`: primero los tests que dejan la reserva activa (sin motivo, motivo inválido), luego el que cancela, luego `canceladas`; la Task 2 se apoya en esa cancelación |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho; gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tooling
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con otro motivo ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada (`findBooking(room, day)` y `bookings` ya existen en `src/app.js`).
- Produce: `cancelBooking(room, day, reason)` → string; la reserva cancelada queda con `status: 'cancelled'` y `reason`. `run('cancelar', [room, day, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, antes del test existente `cancelar una reserva activa` (que se reescribe), en este orden:
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'Sala ocupada'])` → el mismo mensaje.
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye al test existente de ese nombre).
  - `cancelar sin reserva lo dice` queda como está: `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  Ejecutarlos y ver que los tres primeros fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; `reason` fuera de `REASONS` (incluido `undefined`) → `motivo no válido: ${REASONS.join(', ')}` sin tocar la reserva; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el valor que sigue a `--motivo` en `params` (`undefined` si no está) y se pasa como tercer argumento.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`, con la línea de atribución.

### Task 2 — Listado de canceladas con motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), sin despacho; gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tooling
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `node src/app.js canceladas` y ve «Norte lun — sala ocupada». (Cada ejecución arranca con las reservas en memoria: la comprobación en la aplicación se hace con los tests, que comparten proceso.)

**Interfaces**:
- Consume: de la Task 1, las reservas canceladas con `status: 'cancelled'` y `reason`.
- Produce: `listCancelled()` → string, una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas con `\n`; `''` si no hay. `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, después del test que cancela Norte lun con motivo:
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas no lista nada`: `listCancelled([{ room: 'Sur', day: 'mar', status: 'voided' }])` → `''` (vacío y anulada fuera del listado); importa `listCancelled` de `../src/app.js`.
  Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `export function listCancelled(list = bookings)` filtra `status === 'cancelled'`, mapea a `${b.room} ${b.day} — ${b.reason}` y une con `\n`; en `run`, `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas enseña el motivo (0010)`, con la línea de atribución.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; sin estimation-log con referencias todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar, THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED Cancelar, AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo fuera de la lista no cancela`. ✓
- ADDED Listado, THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- «Scope: no entra anulaciones del responsable (0011)» → N/A (`voidBooking` no se toca). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza` · motivo en mayúscula → Task 1, `un motivo fuera de la lista no cancela` · sin reserva → Task 1, `cancelar sin reserva lo dice` · listado vacío y anuladas → Task 2, `canceladas sin canceladas no lista nada`. ✓
