---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Sonnet con effort medium en las dos; el plan trae firmas y asserts, no hay prosa que interpretar. La revisión final de rama va con los modelos de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»: la spec dice que cancelar «pide» un motivo y no fija el caso. Los dos tests existentes de `test/cancel.test.js` pasan a llevar `--motivo`.
4. El motivo se valida antes de buscar la reserva: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva…».
5. `canceladas` lista solo el estado `cancelled` (no las `voided` de `anular`) y, sin ninguna, responde cadena vacía; con varias, una línea por reserva, separadas por `\n`. La spec no fija ninguno de los tres.
6. Gate de cierre: el de la constitution (`operations.md` no existe): `node --test` entero en verde.
7. Coste estimado: 1 h, sin despacho de subagentes en la implementación.
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: todo en `src/app.js`: `cancelBooking(room, day, reason)` valida contra la constante `CANCEL_REASONS` y guarda `reason` en la reserva; `listCancelled()` filtra por estado. `run` extrae el valor tras `--motivo` y enruta `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node:test` (`architecture.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos cerrada, en este orden y con este texto: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Sin dependencias nuevas; Node >=20, ESM.
- Texto de interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas de una sola responsabilidad.

### De proceso

- Native: la sesión implementa cada task con TDD (RED visto, GREEN, commit único por task al quedar limpia).
- Atribución de commits según el recordatorio del harness; mensajes referenciando la feature 0010.
- Gate completo solo en §3.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar_sin_motivo_lo_rechaza`
- `cancelar Sur mar --motivo "xyz"` (sin reserva y motivo inválido) → «motivo no válido…», no «sin reserva» · Task 1, `motivo_invalido_gana_a_sin_reserva`
- `canceladas` sin ninguna cancelada → cadena vacía · Task 2, `canceladas_sin_canceladas_es_vacio`
- Reserva anulada con `anular` no aparece en `canceladas` · Task 2, `canceladas_no_lista_las_anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos funciones y una constante en el fichero existente.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); `anular` y `libres` intactos; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`, `cancelBooking` con motivo, `listCancelled`, enrutado de `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests existentes pasan a llevar `--motivo`; tests nuevos de la Task 1.

**Crear**:

- `test/cancelled-list.test.js`, `test/cancelled-empty.test.js` — tests de `canceladas`, uno por fichero para partir de estado de módulo limpio.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` — fuera de scope (0011).

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason` (cadena). En memoria; sin schema.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica; CLI.

### 1.5 UX

No aplica; salida de texto fijada por la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests existentes de `cancelar` fallan al exigir motivo | Alta | Bajo | Se actualizan en la Task 1 con `--motivo` |
| Motivo con espacios mal extraído de `params` | Media | Medio | Se toma el elemento siguiente a `--motivo`; test con «sala ocupada» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Sonnet, effort medium (Native: la sesión; `subagent_type: sdd-kit:effort-medium` + `model: sonnet` solo si se despacha tras compactación)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista, ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` que fija `booking.reason = reason` y `status = 'cancelled'`; `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `cancelar_con_motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye al test «cancelar una reserva activa»).
  - `cancelar_sin_reserva_lo_dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'` (sustituye al existente).
  - `motivo_fuera_de_la_lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'xyz'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar_sin_motivo_lo_rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `motivo_invalido_gana_a_sin_reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'xyz'])` → el mismo mensaje.
  - Como `bookings` es estado de módulo, cada test que cancela la reserva de Norte lun debe ir en un fichero o usar una reserva distinta; los que rechazan no cancelan, y solo `cancelar_con_motivo` cancela Norte lun.
- [ ] **Step 2: RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos.
- [ ] **Step 3: Implementación** — en `src/app.js`: `const CANCEL_REASONS`; `cancelBooking(room, day, reason)` valida `CANCEL_REASONS.includes(reason)` antes de `findBooking` y devuelve `` `motivo no válido: ${CANCEL_REASONS.join(', ')}` ``; éxito devuelve `` `cancelada ${room} ${day} (${reason})` ``; `run` pasa `params[params.indexOf('--motivo') + 1]` (`undefined` si no hay flag, que no está en la lista).
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, referenciando la 0010.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Sonnet, effort medium (Native: la sesión)
**Tests RED**: hilo principal · `test/cancelled-list.test.js`, `test/cancelled-empty.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.reason` y `status = 'cancelled'` de la Task 1.
- Produce: `listCancelled()` → cadena con una línea `` `${room} ${day} — ${reason}` `` por reserva cancelada, unidas con `\n`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`; crear `test/cancelled-list.test.js`, `test/cancelled-empty.test.js`

- [ ] **Step 1: Tests RED** — `bookings` es estado de módulo y `node --test` corre cada fichero en su proceso, así que cada fichero parte limpio:
  - `test/cancelled-list.test.js`, `canceladas_enseña_el_motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `test/cancelled-empty.test.js`, `canceladas_sin_canceladas_es_vacio`: `run('canceladas', [])` → `''`; y `canceladas_no_lista_las_anuladas`, después, con `run('anular', ['Norte', 'lun'])` y `run('canceladas', [])` → `''`.
- [ ] **Step 2: RED** — `node --test test/cancelled-list.test.js test/cancelled-empty.test.js`. Esperado: fallan.
- [ ] **Step 3: Implementación** — `listCancelled()` filtra `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` `` y une con `\n`; `run` enruta `canceladas`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, referenciando la 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks en un solo fichero, sin incertidumbres técnicas; sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; `operations.md` no existe)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo de la lista → THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar_con_motivo`. ✓
- AND motivo fuera de la lista → «motivo no válido: …» → Task 1, `motivo_fuera_de_la_lista`. ✓
- Listado → THEN «Norte lun — sala ocupada» → Task 2, `canceladas_enseña_el_motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo, motivo inválido sin reserva → Task 1; vacío y anuladas → Task 2. ✓
