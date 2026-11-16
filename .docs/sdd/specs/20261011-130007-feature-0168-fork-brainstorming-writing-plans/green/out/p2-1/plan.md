---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task** — las dos tasks con `sdd-kit:effort-medium` + `sonnet`: cambian un fichero de 36 líneas con el texto exacto en la spec y los tests lo fijan. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución** — native, fijado en sdd-kit.json.
3. **Sin `--motivo`, o `--motivo` sin valor, sobre una reserva activa** — responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa. La spec solo fija el motivo fuera de la lista; «cancelar pide un motivo» lo hace obligatorio.
4. **Orden de las comprobaciones** — primero se busca la reserva y después se valida el motivo: `cancelar Sur mar` sin reserva sigue respondiendo «sin reserva Sur mar», y el test existente `cancelar sin reserva lo dice` no cambia.
5. **El motivo se compara tal cual, en minúsculas** — «Sala ocupada» es motivo no válido.
6. **`canceladas` sin ninguna cancelada** — responde «sin canceladas». La spec no fija ese texto. Las reservas `voided` (anuladas con `anular`) no salen en el listado: la spec dice «estado cancelada».
7. **Tests** — los escenarios van en `test/cancel.test.js`, como fija la spec. Con una sola reserva sembrada en memoria no se puede probar «anulada no sale» en ese fichero (la reserva ya está cancelada), así que ese test y el del listado vacío van en `test/cancelled-list.test.js`, un proceso con el estado limpio.
8. **Riesgos altos** — el estado en memoria se comparte entre los tests de un mismo fichero: el orden en `cancel.test.js` importa (Task 1 y Task 2 lo fijan).
9. **Coste estimado** — 1 h de implementación; sin despachar subagentes en las tasks, un revisor final en Opus.
10. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar una reserva guarda un motivo de la lista cerrada y el comando `canceladas` lo enseña.

**Architecture**: el motivo se guarda en la reserva (`reason`) al pasar a `cancelled`; `cancelBooking` recibe el motivo y lo valida contra `REASONS`; `listCancelled` filtra por `status === 'cancelled'`. Todo en `src/app.js`, sin ficheros nuevos de código.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>».
- Node 22 sin dependencias externas; todo el código en `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Modelos: gama media (Sonnet, effort medium) para implementar; `sdd-kit:effort-high` + `opus` solo para el revisor final. `fable` y `opus xhigh`, prohibidos por defecto.
- Modo de ejecución: native.
- Commits con la convención del proyecto y, al final, `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo responde motivo no válido`
- `cancelar Norte lun --motivo` (sin valor) → «motivo no válido: …» · Task 1, `cancelar con --motivo sin valor responde motivo no válido`
- `--motivo "Sala ocupada"` (otra capitalización) → «motivo no válido: …» · Task 1, `el motivo distingue mayúsculas`
- Un cancelar con motivo no válido no consume la reserva: el cancelar válido posterior funciona · Task 1, `cancelar con motivo válido tras uno no válido`
- `canceladas` con la reserva anulada con `anular` → «sin canceladas» · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y una función de listado; sin estructuras nuevas.
- [x] **YAGNI gate**: sin módulo de motivos ni configuración; una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar exige motivo); `anular` y `libres` no se tocan.
- [x] **Constitution check**: tests antes que código (1 y 2), castellano (4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancelled-list.test.js` — listado de canceladas con el estado limpio: anuladas fuera y listado vacío.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking` con motivo, `listCancelled`, comando `canceladas` y lectura de `--motivo` en `run`.
- `test/cancel.test.js` — escenarios de la spec y casos de motivo no válido.

**NO se tocan**:

- `src/app.js` `voidBooking` y `freeRooms` — fuera del scope (0011 trata las anulaciones).
- `test/app.test.js` — sin relación.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre los tests de `cancel.test.js` | Media | Medio | Orden fijado: no válidos primero, el válido que consume `Norte lun` después, el listado al final |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native lo ejecuta la sesión en gama media)
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada
- Produce: `cancelBooking(room, day, reason)` guarda `reason` en la reserva al cancelarla; `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `run('cancelar', [room, day, '--motivo', reason])`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado en memoria se comparte): `cancelar sin reserva lo dice` (existente, sin cambios); `cancelar sin motivo responde motivo no válido` (`run('cancelar', ['Norte','lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`); `cancelar con --motivo sin valor responde motivo no válido` (`['Norte','lun','--motivo']`, mismo texto); `el motivo distingue mayúsculas` (`['Norte','lun','--motivo','Sala ocupada']`); `un motivo fuera de la lista no cancela` (`'vacaciones'`, mismo texto); `cancelar con motivo de la lista` (`['Norte','lun','--motivo','sala ocupada']` → `'cancelada Norte lun (sala ocupada)'`; sustituye al test `cancelar una reserva activa`, que ya no se sostiene sin motivo). Verlos fallar.
- [ ] **Step 2: Implementación** — `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: busca la reserva (si no hay, `sin reserva ${room} ${day}`), después valida `reason` contra `REASONS` (si no, `motivo no válido: ${REASONS.join(', ')}`), guarda `booking.reason = reason` y responde `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es `params[params.indexOf('--motivo') + 1]` si el flag está, `undefined` si no.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native lo ejecuta la sesión en gama media)
**Tests RED**: hilo principal · `test/cancel.test.js`, `test/cancelled-list.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/cancelled-list.test.js`
**Se prueba en la aplicación**: tras cancelar `Norte lun` con «sala ocupada», el usuario ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `reason` y `status: 'cancelled'` que guarda `cancelBooking` (Task 1)
- Produce: `listCancelled()` → una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`; `'sin canceladas'` si no hay ninguna; comando `canceladas`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancelled-list.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, al final, después del test que cancela `Norte lun`: `canceladas enseña el motivo` (`run('canceladas', [])` → `'Norte lun — sala ocupada'`). En `test/cancelled-list.test.js`: `canceladas no lista las anuladas` (`run('anular', ['Norte','lun'])`, después `run('canceladas', [])` → `'sin canceladas'`). Verlos fallar.
- [ ] **Step 2: Implementación** — `src/app.js`: `listCancelled()` con el filtro `status === 'cancelled'` y el formato de Interfaces; `run('canceladas')` la devuelve.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/cancelled-list.test.js` en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas lista las reservas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero de código; incertidumbre baja; sin estimation-log todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN «cancelada Norte lun (sala ocupada)» y AND «motivo no válido: …») → Task 1. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 2. ✓
- No entra: anulaciones del responsable (0011) → N/A (confirmado en spec). ✓
- Review Focus: sin motivo, `--motivo` sin valor, capitalización, no válido no consume → Task 1; anuladas fuera → Task 2. ✓
