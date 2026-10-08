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

1. **Modelo y effort por task**: las dos tasks con `sdd-kit:effort-medium` + `sonnet` (gama media: el plan ya trae firmas, textos y asserts). El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: Native, fijado en `sdd-kit.json`. Dos tasks pequeñas sobre un solo fichero, que comparten estado (`bookings`).
3. **`cancelar` sin `--motivo`, o con `--motivo` sin valor, responde igual que un motivo fuera de la lista**: «motivo no válido: cambio de planes, sala ocupada, otro». La spec dice «cancelar pide un motivo» y no fija este caso.
4. **El motivo se valida antes de buscar la reserva**: con motivo inválido la reserva sigue activa, exista o no. Con motivo válido y sin reserva, se mantiene «sin reserva <sala> <día>».
5. **Los dos tests existentes de `cancelar` cambian** para pasar `--motivo`: su salida sin motivo ya no es válida. Es consecuencia de la spec, no un desvío.
6. **`canceladas` sin ninguna cancelada responde «sin canceladas»**; con varias, una línea por reserva, en el orden de la lista. La spec solo fija una línea. Las anuladas (`voided`) no salen: son de 0011.
7. **Coste estimado**: ~1 h, sin subagentes de implementación; el revisor final de rama es el único despacho.
8. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda en la propia reserva (`booking.reason`) al pasar a `cancelled`. `canceladas` filtra `bookings` por ese estado. Todo en `src/app.js`, como el resto de comandos.

**Tech Stack**: Node 22 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exactamente: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (raya larga, con espacios).
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean code: funciones cortas con un solo cometido.

### De proceso

- Tests antes que código (constitution, art. 2). Los tests salen de los THEN de la spec y los escribe el hilo.
- Commits en castellano, referenciando `0010`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo pide uno de la lista`
- `cancelar Norte lun --motivo` (sin valor) → el mismo mensaje, sin excepción · Task 1, `cancelar con --motivo sin valor pide uno de la lista`
- Motivo fuera de la lista no cancela: la reserva sigue activa y un segundo `cancelar` con motivo válido la cancela · Task 1, `un motivo inválido no cancela la reserva`
- `cancelar Sur mar --motivo otro` sin reserva → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice` (con motivo)
- `canceladas` sin ninguna cancelada → «sin canceladas», y una reserva anulada no aparece · Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un campo más de la reserva; sin módulo nuevo.
- [x] **YAGNI gate**: la lista de motivos es una constante; sin abstracción.
- [x] **Brownfield gate**: retrocompatible salvo la salida de `cancelar` sin motivo, que la spec cambia; respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), texto en castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)` con motivo, `cancelledBookings()` y el comando `canceladas` en `run`.
- `test/cancel.test.js` — los tests de los THEN de la spec; los dos existentes pasan a llevar `--motivo`.

**NO se tocan**:

- `test/app.test.js` — no cubre cancelación.
- `voidBooking` y el comando `anular` — son de la 0011.

### 1.2 a 1.6

No aplican: sin schema, migraciones, API, UX ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor lee `undefined` | Media | Bajo | Review Focus: se trata como motivo no válido |
| Romper el patch 0007 (cancelar solo por hora) | Baja | Medio | `findBooking` no se toca; sus tests siguen en verde |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la ejecuta la sesión; el despacho aplica solo si cae en subagentes)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "aburrimiento"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js`, sin cambios.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`; la reserva cancelada queda con `status: 'cancelled'` y `reason: string`. `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Cada test parte de estado limpio: el estado de `bookings` es de módulo, así que los tests que cancelan Norte lun van en el orden indicado o con la reserva restaurada (`status = 'active'`) en el propio test.
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`
  - `motivo fuera de la lista`: `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  - `cancelar sin motivo pide uno de la lista`: `run('cancelar', ['Norte','lun'])` → el mismo mensaje
  - `cancelar con --motivo sin valor pide uno de la lista`: `run('cancelar', ['Norte','lun','--motivo'])` → el mismo mensaje
  - `un motivo inválido no cancela la reserva`: tras el inválido, `run('cancelar', ['Norte','lun','--motivo','otro'])` → `'cancelada Norte lun (otro)'`
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`
  - El test existente `cancelar una reserva activa` pasa a `--motivo 'cambio de planes'` y espera `'cancelada Norte lun (cambio de planes)'`.
  Guarda una copia de los tests fuera del repo. Ejecuta `node --test test/cancel.test.js`. Esperado: FAIL.
- [ ] **Step 2: Implementación** en `src/app.js`: `REASONS`; `cancelBooking(room, day, reason)` valida `REASONS.includes(reason)` antes de `findBooking` y responde `motivo no válido: ${REASONS.join(', ')}`; guarda `booking.reason`; `run` extrae el valor tras `--motivo` de `params` (`undefined` si falta) y lo pasa.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: todos PASS; la copia de los RED coincide con el fichero (`git diff --no-index`).
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js canceladas` y ve «sin canceladas» (cada invocación parte del estado en memoria, sin persistencia); la salida con una cancelada se ve en el test.

**Interfaces**:
- Consume: `bookings` con `status: 'cancelled'` y `reason: string` (Task 1).
- Produce: `cancelledBookings(): string` y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`
  - `canceladas sin canceladas lo dice`: con todas las reservas activas, `run('canceladas', [])` → `'sin canceladas'`
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte','lun'])`, `run('canceladas', [])` → `'sin canceladas'`
  Copia fuera del repo; `node --test test/cancel.test.js`. Esperado: FAIL.
- [ ] **Step 2: Implementación** en `src/app.js`: `cancelledBookings()` devuelve una línea `${room} ${day} — ${reason}` por reserva con `status === 'cancelled'`, unidas por salto de línea, o `sin canceladas` si no hay; `run` despacha `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: todos PASS; RED sin cambios salvo formato.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con motivo`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde.
- [ ] Verificación de los dos escenarios de la spec con ejecución real (`node src/app.js cancelar …`, `node src/app.js canceladas`).
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar pide un motivo de la lista (ADDED) → Task 1. ✓
- Motivo fuera de la lista responde la lista (AND) → Task 1, `motivo fuera de la lista`. ✓
- El listado de canceladas enseña el motivo (ADDED) → Task 2, `canceladas enseña el motivo`. ✓
- «No entra»: anulaciones del responsable (0011) → N/A, `voidBooking` intacto. ✓
- Review Focus → Task 1 (cuatro entradas) y Task 2 (una), con los tests nombrados arriba. ✓
