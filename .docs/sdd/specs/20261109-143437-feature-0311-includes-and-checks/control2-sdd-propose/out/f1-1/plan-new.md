---
id: 20261109-194713-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Una sola task: validar el motivo, guardarlo, exportar `bookings`, actualizar los tests y el README son un único cambio que un revisor aprobaría o rechazaría entero; partirlo dejaría `cancelar` a medias.
2. Modelo de la task: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` si hubiera despacho; en Native la implementa el hilo en gama media, porque el plan trae firmas, textos y asserts. La revisión final no se quita: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
3. Ejecución: native, fijado en `sdd-kit.json`.
4. Los tests siembran la reserva con `bookings.splice(0, bookings.length, {...})` antes de cada caso, para que el orden no importe.
5. Coste estimado: ~1 h de implementación; sin despachos salvo la revisión final.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.
7. Parada pedida por el dev-lead: tras el commit de la Task 1, antes de la revisión final y del cierre — «cuando tengas el commit de la Task 1, para».
8. Gate de cierre: `node --test && node scripts/lint.mjs`, de `operations.md` §Testing.

**Goal**: `cancelar <sala> <día> <motivo>` exige un motivo de la lista, lo guarda en la reserva y avisa si falta o no vale.

**Architecture**: `cancelBooking(room, day, reason)` valida contra la constante `CANCEL_REASONS` antes de buscar la reserva; `run` pasa `params[2]`. `bookings` se exporta para que los tests siembren y lean.

**Tech Stack**: Node 22 sin dependencias; `node --test`; un solo fichero de entrada, `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y exporta un array del mismo módulo; sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Motivos literales: `cambio de planes`, `sala ocupada`, `otro`; aviso literal: `motivo no válido: elige cambio de planes, sala ocupada u otro`.
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Texto de la interfaz y de los documentos en castellano; identificadores en inglés.
- Commit de la task con la convención del proyecto referenciando la fila 0010; pie de atribución del kit.

## Review Focus

- `cancelar Norte lun "me aburro"` → aviso del motivo y la reserva sigue activa · Task 1, `cancelar con motivo fuera de la lista no cancela`
- `cancelar Sur mar "me aburro"` (sin reserva) → gana el aviso del motivo · Task 1, `motivo inválido sin reserva avisa del motivo`
- `cancelar Norte lun` dos veces → la segunda dice `sin reserva Norte lun` y `reason` no cambia · Task 1, `cancelar dos veces conserva el primer motivo`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, un parámetro, un `if`.
- [x] **YAGNI gate**: sin abstracción nueva.
- [x] **Brownfield gate**: retrocompatible solo en `anular`, que no cambia; `cancelar` cambia a propósito (spec). Sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (Art. 2), castellano en la interfaz (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `run` pasa `params[2]`, `export const bookings`.
- `test/cancel.test.js` — los dos tests actuales se adaptan y se añaden los de la spec.
- `README.md` — sintaxis de `cancelar` con los tres motivos.

**NO se tocan**:

- `voidBooking` y el comando `anular` — es la fila 0011.
- `freeRooms` y `libres` — no cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` compartido entre tests | Media | Tests que dependen del orden | Sembrar con `splice` en cada test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: native, hilo principal en gama media (Sonnet, effort medium)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend (`src/app.js`), docs (`README.md`)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `otra cosa` ve `motivo no válido: elige cambio de planes, sala ocupada u otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js`; estado `active`.
- Produce: `CANCEL_REASONS: string[]`, `cancelBooking(room, day, reason): string`, `export const bookings`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `README.md`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `import { run, bookings } from '../src/app.js'` y un `seed(...)` que hace `bookings.splice(0, bookings.length, ...)` con `{ room, day, slot: '10:00-12:00', status: 'active' }`:
  - `cancelar con motivo guarda el motivo`: siembra Norte lun; `run('cancelar', ['Norte','lun','sala ocupada'])` es `cancelada Norte lun (sala ocupada)`; `bookings[0].status` es `cancelled` y `bookings[0].reason` es `sala ocupada`.
  - `cancelar con motivo fuera de la lista no cancela`: `['Norte','lun','me aburro']` y `['Norte','lun','Sala ocupada']` dan el aviso; `bookings[0].status` sigue `active`.
  - `cancelar sin motivo no cancela`: `['Norte','lun']` da el aviso; sigue `active`.
  - `motivo sin comillas no vale`: `['Norte','lun','sala','ocupada']` da el aviso.
  - `argumentos sobrantes se ignoran`: `['Norte','lun','otro','extra']` es `cancelada Norte lun (otro)`.
  - `cancelar sin reserva lo dice`: siembra solo Norte lun; `['Sur','mar','otro']` es `sin reserva Sur mar`.
  - `motivo inválido sin reserva avisa del motivo`: `['Sur','mar','me aburro']` da el aviso.
  - `cancelar dos veces conserva el primer motivo`: cancela con `otro` y otra vez con `sala ocupada`; la segunda es `sin reserva Norte lun` y `reason` sigue `otro`.
  Ejecuta `node --test test/cancel.test.js` y comprueba que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];` `export const bookings = [...]` (el array actual); `cancelBooking(room, day, reason)` devuelve `motivo no válido: elige ${lista}` — con la lista unida como `cambio de planes, sala ocupada u otro` — si `!CANCEL_REASONS.includes(reason)`, antes de `findBooking`; al cancelar guarda `booking.reason = reason` y devuelve `cancelada ${room} ${day} (${reason})`; `run` llama a `cancelBooking(params[0], params[1], params[2])`. En `README.md`, la línea `node src/app.js cancelar <sala> <día> "<motivo>"` con los tres motivos.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node --test` entero sigue en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): motivo al cancelar una reserva`, con el pie de atribución.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 1 task, un fichero de código y uno de tests; sin precedente en el log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): ninguna reserva cancelada sin motivo; ningún motivo fuera de la lista guardado
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo → `cancelada Norte lun (sala ocupada)` y `reason` guardado → Task 1, `cancelar con motivo guarda el motivo`. ✓
- Motivo fuera de la lista (y exacto, mayúsculas) → aviso y sigue activa → Task 1, `cancelar con motivo fuera de la lista no cancela`. ✓
- Sin motivo → aviso y sigue activa → Task 1, `cancelar sin motivo no cancela`. ✓
- Sin reserva → `sin reserva Sur mar` → Task 1, `cancelar sin reserva lo dice`. ✓
- Motivo inválido y sin reserva → aviso del motivo → Task 1, `motivo inválido sin reserva avisa del motivo`. ✓
- Cancelar dos veces → `sin reserva` y motivo intacto → Task 1, `cancelar dos veces conserva el primer motivo`. ✓
- Motivo exacto → Task 1, mismo test que «fuera de la lista» (`Sala ocupada`). ✓
- Motivo sin comillas → Task 1, `motivo sin comillas no vale`. ✓
- Argumentos sobrantes → Task 1, `argumentos sobrantes se ignoran`. ✓
- El punto de entrada real con comillas → sin observar por test: lo comprueba el dev-lead en la validación (avisado en spec ✋ 12). ⚠
- Corrección de la fila 0010 y fila de backlog → las hace `sdd-archive` al cerrar. ✓
- Review Focus (3 líneas) → Task 1, los tests nombrados. ✓
