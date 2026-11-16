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

1. Una sola task, modelo Sonnet con effort medium (`sdd-kit:effort-medium` + `sonnet`) — el cambio son ~15 líneas en `src/app.js` con los valores ya fijados por la spec; no hay prosa que interpretar. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. Ejecución native, fijado en sdd-kit.json — con una sola task no hay nada que repartir.
3. `cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro») y no cancela — la spec dice que cancelar «pide» un motivo pero no cubre su ausencia; es la lectura mínima. El test `cancelar una reserva activa` de `test/cancel.test.js`, que cancelaba sin motivo, pasa a usar `--motivo`.
4. La validación del motivo va antes de buscar la reserva: `cancelar Sur mar --motivo "otro"` sigue diciendo «sin reserva Sur mar», pero `cancelar Sur mar` sin motivo dice «motivo no válido…» — la spec no fija el orden.
5. `canceladas` lista solo el estado `cancelled`, no `voided` (las anulaciones son de la 0011) y sin reservas canceladas no imprime nada (cadena vacía).
6. El estado del módulo es en memoria y los tests de `cancel.test.js` lo comparten (hay una sola reserva): el orden de los tests es parte del diseño (motivo inválido → cancelar con motivo → listado).
7. Riesgos altos: ninguno. Coste estimado: ~0,5 h, sin despachos salvo el revisor final.

Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status`; `cancelBooking` valida el motivo y `run` extrae el valor de `--motivo` y despacha el comando nuevo `canceladas`. Todo en `src/app.js`, el único fichero de entrada.

**Tech Stack**: Node 22 sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto de la interfaz y de los documentos en castellano (Constitution, art. 4).
- Lista de motivos cerrada, en este orden y con estos textos: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio y funciones cortas.

### De proceso

- Política de modelos: gama media como suelo; `opus` + `sdd-kit:effort-high` solo para el revisor final de rama.
- Ejecución por defecto: native.
- Commits referenciando la feature 0010.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "inventado"` → mismo mensaje y la reserva sigue activa (no aparece en `canceladas`) · Task 1, `cancelar con motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → cadena vacía, no «salas» (el valor por defecto de `run`) · Task 1, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cambio en una función y un comando nuevo; sin abstracciones.
- [x] **YAGNI gate**: la lista de motivos es una constante; no se abstrae nada.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar ahora pide motivo); respeta el patrón de `cancelBooking`/`run`; sin refactor fuera de scope (`voidBooking` no se toca).
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda `reason`; nueva `cancelledBookings()`; `run` lee `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — tests de los THEN de la spec; el existente `cancelar una reserva activa` pasa a llevar motivo.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason` (cadena). Sin persistencia: el estado es en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas` (sin argumentos).

### 1.5 UX

No aplica (CLI).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten el estado en memoria y una sola reserva | alta | bajo | Orden fijo de los tests: inválidos (no cambian el estado) → cancelar → listar |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (la ejecuta la propia sesión native; el valor fija la gama de la sesión)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; Native: TDD del propio hilo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro». Cada ejecución del CLI parte del estado inicial (en memoria), así que `canceladas` se prueba por los tests.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reserva `{ room, day, slot, status }`, estados `active`, `cancelled`, `voided`).
- Produce: `cancelBooking(room, day, reason)` → `string`; `cancelledBookings()` → `string` (líneas `<sala> <día> — <motivo>` separadas por `\n`); comandos `cancelar … --motivo <motivo>` y `canceladas` en `run(cmd, params)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten el estado):
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'inventado'])` → el mismo mensaje.
  - `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`.
  - `cancelar una reserva activa` (sustituye al existente): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `el listado de canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Esperado: todos en RED (el motivo se ignora hoy y `canceladas` devuelve `'salas'`). Guardar copia fuera del repo.
- [ ] **Step 2: Implementación** — en `src/app.js`: constante `reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `motivo no válido: ${reasons.join(', ')}` si `reason` no está en la lista, antes de buscar la reserva; si cancela, guarda `booking.reason = reason` y responde `cancelada ${room} ${day} (${reason})`. `cancelledBookings()` filtra `status === 'cancelled'` y une `${room} ${day} — ${reason}` con `\n`. En `run`, `cancelar` pasa el valor que sigue a `--motivo` (o `undefined`) y `canceladas` llama a `cancelledBookings()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: 6 tests en verde; comparar con la copia de los RED (`git diff --no-index`).
- [ ] **Step 4: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite entera)
- [ ] Verificación de los THEN de la spec con ejecución real del CLI (`cancelar … --motivo`, motivo inválido)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN `cancelada Norte lun (sala ocupada)` y THEN `motivo no válido…`) → Task 1, tests `cancelar una reserva activa` y `cancelar con motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `el listado de canceladas enseña el motivo`. ✓
- «No entra: anulaciones del responsable de sala (0011)» → `voidBooking` en «NO se tocan». ✓
- Review Focus 1 → Task 1, `cancelar sin motivo no cancela`; 2 → `cancelar con motivo fuera de la lista no cancela`; 3 → `canceladas sin canceladas responde vacío`. ✓
