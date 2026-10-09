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

1. **Modelo y effort**: una sola task, Sonnet con effort medium (`sdd-kit:effort-medium` + `sonnet`): son dos funciones en un fichero y la spec trae los textos exactos. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en `sdd-kit.json`. Una task, un fichero de código: no hay interfaces entre tasks que proteger.
3. **Sin `--motivo`** (la spec lo calla): `cancelar Norte lun` responde «falta el motivo: cambio de planes, sala ocupada, otro» y no cancela. Sale de «cancelar pide un motivo».
4. **Motivo no válido o ausente no cancela**: la reserva sigue activa. La spec solo fija el mensaje; que no cancele es lo que esperaría cualquiera.
5. **`canceladas` solo lista las de estado `cancelled`**: las `voided` (anuladas) no entran; la 0011 es quien toca las anulaciones. Una línea por reserva, en orden de alta; sin ninguna responde «sin canceladas». No hay test de anuladas: con una sola reserva de partida no se puede sembrar sin exportar el estado.
6. **El test de hoy `cancelar una reserva activa` cambia**: espera «cancelada Norte lun» sin motivo y la spec lo modifica; pasa a llevar `--motivo`.
7. **Riesgos y coste**: bajo; el estado de `bookings` es de módulo y los tests lo comparten, así que su orden en `test/cancel.test.js` importa. ~0,5 h.
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar exige un motivo de la lista cerrada, lo guarda con la reserva y `canceladas` lo enseña.

**Architecture**: `cancelBooking` recibe el motivo y lo guarda en `booking.reason`; `run` lee `--motivo` de los parámetros; una función nueva `cancelledBookings()` formatea el listado. Todo en `src/app.js`, el fichero de entrada único del proyecto.

**Tech Stack**: Node 22 sin dependencias; `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (guion largo).
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres claros, funciones cortas.

### De proceso

- Tests antes que código (constitution, art. 2). Gate de cierre: `node --test` entero en verde.
- Commits con la convención del proyecto, referenciando 0010.
- Modelos: Sonnet medium para la task; Opus high solo para la revisión final.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «falta el motivo: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo pide uno y no cancela`
- `--motivo` como último argumento, sin valor → igual que sin motivo · Task 1, `cancelar con --motivo sin valor pide el motivo`
- Motivo no válido → el mensaje de la spec y la reserva sigue activa (un cancelar válido después funciona) · Task 1, `un motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → «sin canceladas», no una línea vacía · Task 1, `canceladas sin ninguna lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un campo de la reserva; sin tipos ni módulos nuevos.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, textos en castellano, gate `node --test`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo, `cancelledBookings`, rama `canceladas` y lectura de `--motivo` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios y del Review Focus; el test de hoy pasa a llevar motivo.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — no dependen de la cancelación.

### 1.2 Modelo de datos

La reserva gana `reason` (string), puesto al cancelar.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

Línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten el estado de `bookings` y se rompen por el orden | Media | Bajo | Orden fijo en `cancel.test.js`: primero lo que no cancela, luego la cancelación válida y después `canceladas` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en native lo hace la sesión. Dos funciones con los textos fijados por la spec.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; van en el commit de la task.

**Superficies**: backend (`src/app.js`) y tests.
**Verificación**: `node --test test/cancel.test.js` (falla si algo falla).
**Se prueba en la aplicación**: sí: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)»; `canceladas` se prueba por `run`, porque cada invocación de la CLI parte del estado inicial.

**Interfaces**:
- Consume: `findBooking(room, day)` y el estado `bookings` de `src/app.js`.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`, `cancelledBookings(): string` y los comandos `cancelar … --motivo <m>` y `canceladas` en `run(cmd, params)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (el estado es compartido), cada uno con `assert.equal(run(...), ...)`:
  - `canceladas sin ninguna lo dice`: `run('canceladas', [])` → `'sin canceladas'`.
  - `cancelar sin motivo pide uno y no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'falta el motivo: cambio de planes, sala ocupada, otro'`.
  - `cancelar con --motivo sin valor pide el motivo`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo texto.
  - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con motivo de la lista` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `el listado de canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - Se mantiene `cancelar sin reserva lo dice`, pasando `--motivo otro` en `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
- [ ] **Step 2: Ver el rojo** — `node --test test/cancel.test.js`. Esperado: falla.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.
  - `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}` (se comprueba primero); `reason` ausente → `falta el motivo: ${CANCEL_REASONS.join(', ')}`; fuera de la lista → `motivo no válido: ${CANCEL_REASONS.join(', ')}`; válido → estado `cancelled`, `booking.reason = reason`, `cancelada ${room} ${day} (${reason})`.
  - `cancelledBookings()`: líneas `${room} ${day} — ${reason}` unidas por `\n` para las de estado `cancelled`; vacío → `sin canceladas`.
  - `run`: `cancelar` lee el valor tras `--motivo` (`undefined` si falta o va al final); `canceladas` llama a `cancelledBookings()`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: todos pasan.
- [ ] **Step 5: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

No aplica: el proyecto no tiene `estimation.md` activo en este flujo.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los criterios de éxito de la spec (los dos escenarios ADDED)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1, `cancelar con motivo de la lista` y `un motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, `el listado de canceladas enseña el motivo`. ✓
- No entra: anulaciones (0011) → N/A, `voidBooking` intacto. ✓
- Review Focus → Task 1: `cancelar sin motivo pide uno y no cancela`, `cancelar con --motivo sin valor pide el motivo`, `un motivo fuera de la lista no cancela`, `canceladas sin ninguna lo dice`. ✓
