---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Una sola task** — el cambio toca `src/app.js` y `test/cancel.test.js`, dos escenarios de una misma capacidad y una sola superficie; partirlo dejaría la primera task sin nada que probar. Sin `tasks.md`.
2. **Ejecución: native**, fijado en `sdd-kit.json`. Modelo: la sesión ejecuta la task; el revisor final de rama va con `sdd-kit:effort-high` + `opus`, la única revisión independiente de Native.
3. **`cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»** y no cancela. La spec dice que cancelar «pide» un motivo pero no qué pasa sin él; tratar la ausencia como motivo fuera de la lista es lo que menos inventa. Consecuencia: el test existente `cancelar una reserva activa` (`cancelar Norte lun` → «cancelada Norte lun») deja de ser cierto y se reescribe con `--motivo "sala ocupada"`.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo "otro"` sin reserva sigue diciendo «sin reserva Sur mar», pero `cancelar Sur mar` sin motivo dice «motivo no válido…». Un motivo inválido nunca cancela.
5. **`canceladas` sin ninguna cancelada responde `sin canceladas`**; el texto no sale de la spec. Lista solo estado `cancelled` (las `voided` son de la 0011), una línea por reserva, en el orden en que se cancelaron.
6. **Riesgos altos**: ninguno. **Coste estimado**: ~0,5 h, sin despachos salvo el revisor final.
7. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y el comando nuevo `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda su `reason` junto al `status`. `cancelBooking` valida el motivo y lo guarda; una función nueva `cancelledList` recorre `bookings` filtrando `status === 'cancelled'`. `run` extrae el valor tras `--motivo` y despacha `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node:test`. Un único fichero de entrada, `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, porque la feature es una sola task y no hay interfaces entre tasks que proteger · fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: nombres que dicen qué hacen, funciones cortas.
- Texto de la interfaz en castellano, con los literales exactos de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (guion largo `—`).
- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Node 22, sin dependencias externas; todo sigue en `src/app.js`.

### De proceso

- Tests antes que código (constitution, Art. 2); el gate de cierre, `node --test` entero, corre una vez en §3.
- Commits git-flow sobre `feature/0010-cancel-reason`, referenciando 0010.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `--motivo` sin valor (último argumento) o con un motivo fuera de la lista → «motivo no válido: …», y un `cancelar ... --motivo "sala ocupada"` posterior sí cancela · Task 1, `motivo inválido no cancela la reserva`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no cadena vacía · Task 1, `canceladas sin cancelaciones`
- Una reserva anulada (`anular`) no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas`
- Varias canceladas → una línea por reserva, en el orden en que se cancelaron · Task 1, `canceladas lista varias en orden`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos nuevos, una función más y un parseo de un flag.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante con un solo uso de validación y otro de mensaje.
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo, que cambia por spec («cancelar pide un motivo»); sigue el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (Art. 2), castellano (Art. 4), flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `src/app.js` — `cancelBooking` valida y guarda el motivo; `cancelledList` y `resetBookings` nuevas; `run` lee `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — escenarios de la spec y Review Focus; reescribe `cancelar una reserva activa`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no cubre cancelar.

### 1.2 a 1.6

No aplican: sin datos persistentes, migraciones, API, UX ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` es memoria de proceso: un test que cancela la reserva de Norte afecta al siguiente | alta | media | `resetBookings()` exportada y `beforeEach` en `test/cancel.test.js` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: la sesión (Native); sin despacho. Revisor final: `subagent_type: sdd-kit:effort-high` + `model: opus`.
**Tests RED**: TDD del propio hilo · `test/cancel.test.js`, copia fuera del repo antes de implementar, sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: sí — `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)» (cada invocación arranca con su estado en memoria, así que `canceladas` por CLI solo se ve dentro del mismo proceso: se prueba por `run` en el test).

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reservas `{ room, day, slot, status }`).
- Produce:
  - `export const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`
  - `export function cancelBooking(room, day, reason)` → string
  - `export function cancelledList()` → string
  - `export function resetBookings()` → restaura `bookings` a la reserva sembrada de Norte (`lun`, `10:00-12:00`, activa) más una activa `Sur mar`, `09:00-10:00`
  - `run('cancelar', [room, day, '--motivo', reason])` y `run('canceladas', [])`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, uno por THEN y por línea del Review Focus. Reescribe `cancelar una reserva activa`; mantén `cancelar sin reserva lo dice` (`run('cancelar', ['Sur','mar','--motivo','otro'])` → `sin reserva Sur mar`). Constante de test: `const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro'`. Orden de los tests (comparten `bookings` en memoria):
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` === `INVALID`.
  - `motivo inválido no cancela la reserva`: `['Norte','lun','--motivo','aburrimiento']` === `INVALID`; `['Norte','lun','--motivo']` === `INVALID`.
  - `cancelar con motivo de la lista`: `['Norte','lun','--motivo','sala ocupada']` === `cancelada Norte lun (sala ocupada)`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` === `Norte lun — sala ocupada`.
  - `canceladas no lista las anuladas`: `voidBooking('Norte','lun')` y luego `run('canceladas', [])` === `sin canceladas`.
  - `canceladas lista varias en orden`: cancela `Sur mar` con `otro` y luego `Norte lun` con `sala ocupada` → `Sur mar — otro\nNorte lun — sala ocupada`.
  - `canceladas sin cancelaciones`: `run('canceladas', [])` === `sin canceladas`.
  - Los tests comparten `bookings` en memoria: `beforeEach(resetBookings)` los aísla.
- [ ] **Step 2: Ver los RED** — `node --test test/cancel.test.js` falla en los tests nuevos y en el reescrito.
- [ ] **Step 3: Implementación** en `src/app.js`: las firmas de Interfaces; `cancelBooking` valida `CANCEL_REASONS.includes(reason)` antes de `findBooking`, guarda `booking.reason`, responde `cancelada ${room} ${day} (${reason})`; `cancelledList()` mapea las `cancelled` a `${room} ${day} — ${reason}` unidas por `\n`, o `sin canceladas` si no hay; `run` toma como motivo el valor que sigue a `--motivo` (`undefined` si falta) y despacha `canceladas`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` verde.
- [ ] **Step 5: Commit de la task** — `feat: motivo al cancelar y listado de canceladas (0010)`, tras comparar la copia de los RED con `git diff --no-index` y `sdd task done`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Smoke por THEN de la spec: `node src/app.js cancelar Norte lun --motivo "sala ocupada"`, `... --motivo "aburrimiento"` (rechazo provocado de verdad) y `canceladas` dentro de un mismo proceso
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN respuesta y AND motivo fuera de lista) → Task 1, tests `cancelar con motivo de la lista` y `motivo inválido no cancela la reserva`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, `canceladas enseña el motivo`. ✓
- No entra: anulaciones (0011) → `voidBooking` intacto, N/A. ✓
- Review Focus (5 entradas) → Task 1, un test cada una. ✓
