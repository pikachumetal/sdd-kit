---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: una sola task, Sonnet con effort medium — el plan lleva firmas, textos y asserts; no hay diseño que interpretar. La revisión final de rama sigue la política de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Orden de comprobaciones en `cancelar` (la spec lo calla): primero se busca la reserva activa y, si no existe, responde `sin reserva <sala> <día>` aunque falte el motivo; después se valida el motivo. Un motivo no válido no cancela nada. Así el test existente «cancelar sin reserva lo dice» sigue igual.
4. `cancelar` sin `--motivo` (la spec lo calla) se trata como motivo fuera de la lista: responde `motivo no válido: cambio de planes, sala ocupada, otro` y no cancela.
5. `canceladas` lista solo el estado `cancelled`; las `voided` (comando `anular`, 0011) no entran. Sin canceladas, responde cadena vacía.
6. El test existente «cancelar una reserva activa» cambia: ya no existe la salida `cancelada Norte lun` sin motivo.
7. Coste estimado: 1 h, ~1 task, sin despacho de subagentes.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y el comando `canceladas` lo enseña.

**Architecture**: el motivo se guarda como campo `reason` en la reserva al pasar a `cancelled`; `canceladas` filtra por ese estado. Todo en `src/app.js`, que ya concentra comandos y datos.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo módulo, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Modelos: Sonnet con effort medium para la task; Opus solo en los ejes Spec y Arquitectura de la revisión final.
- Ejecución: native.
- Commits con la convención del proyecto, referenciando la 0010, y con la atribución que fije la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro`, y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "inventado"` no cancela: tras responder el error, `canceladas` no la lista · Task 1, `un motivo no válido no cancela`
- `canceladas` no lista las reservas anuladas (`voided`) · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un filtro; nada más simple cumple la spec.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante usada en dos sitios (validación y mensaje).
- [x] **Brownfield gate**: retrocompatible salvo la salida de `cancelar`, que la spec cambia; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/void.test.js` — comprueba, en proceso propio, que `canceladas` no lista las anuladas.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledList`, comando `canceladas` en `run`.
- `test/cancel.test.js` — tests de la spec; se adapta el existente de cancelar.

**NO se tocan**:

- `src/app.js` `voidBooking` y `anular` — son de la 0011.
- `test/app.test.js` — no depende de cancelar.
- `scripts/lint.mjs` — solo comprueba tabuladores.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. En memoria; sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica. Contrato de línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor o en otra posición | Baja | Bajo | Se lee el valor que sigue a `--motivo` en `params`; sin valor cuenta como no válido |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Sonnet con effort medium — `subagent_type: sdd-kit:effort-medium` + `model: sonnet` si se despachara; en Native la ejecuta la propia sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/void.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: quien cancela ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `node src/app.js canceladas` y ve «Norte lun — sala ocupada». Cada ejecución es un proceso nuevo con datos en memoria, así que el listado entre procesos se observa solo por los tests.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `cancelada <sala> <día> (<motivo>)`, `sin reserva <sala> <día>` o `motivo no válido: cambio de planes, sala ocupada, otro`; `cancelledList()` devuelve las líneas `<sala> <día> — <motivo>` unidas por salto de línea; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/void.test.js`

- [ ] **Step 1: Tests RED** — `bookings` es estado compartido del proceso y solo existe la reserva `Norte lun`, así que el orden de `test/cancel.test.js` es: primero los rechazos, que no la cancelan, y al final la cancelación. Se mantiene `cancelar sin reserva lo dice` y se elimina `cancelar una reserva activa` (su salida ya no existe). Tests, en este orden:
  - `un motivo fuera de la lista se rechaza`: `assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'inventado']), 'motivo no válido: cambio de planes, sala ocupada, otro')`
  - `cancelar sin motivo no cancela`: `assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro')`
  - `un motivo no válido no cancela`: `assert.equal(run('canceladas', []), '')`
  - `cancelar con motivo de la lista`: `assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)')`
  - `canceladas enseña el motivo`: `assert.equal(run('canceladas', []), 'Norte lun — sala ocupada')`

  Nuevo `test/void.test.js` (proceso propio, estado limpio), test `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])` y `assert.equal(run('canceladas', []), '')`. Ejecuta y comprueba que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: busca la reserva activa (`sin reserva …` si no hay), valida `reason` contra `CANCEL_REASONS` (`motivo no válido: ${CANCEL_REASONS.join(', ')}`), y solo entonces pone `status = 'cancelled'` y `booking.reason = reason`; `cancelledList()` filtra `status === 'cancelled'` y une `${room} ${day} — ${reason}` con `\n`; en `run`, `cancelar` lee `params[params.indexOf('--motivo') + 1]` (`undefined` si falta la bandera o el valor) y `canceladas` llama a `cancelledList()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/void.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, referenciando la 0010: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Base de la estimación: 1 task, un fichero de código y uno de test; sin incertidumbres salvo el estado compartido de los tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar pide un motivo» · AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo fuera de la lista se rechaza`. ✓
- ADDED «El listado enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Scope «No entra: anulaciones (0011)» → N/A, `voidBooking` intacto. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; motivo no válido no cancela → `un motivo no válido no cancela`; anuladas fuera → `canceladas no lista las anuladas`. ✓
