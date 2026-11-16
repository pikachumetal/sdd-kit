---
id: 20261116-140702-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: ambas en el hilo principal (Native), sin subagentes; la revisión final de rama va con `sdd-kit:effort-high` + `opus` (Spec) y `sdd-kit:effort-high` + `sonnet` (Código) — no se quita en Native.
2. Ejecución: native, fijado en `sdd-kit.json` (no se pregunta).
3. Dos tasks: la Task 1 (cancelar con motivo + `seedBookings`) y la Task 2 (`canceladas`), en ese orden porque la Task 2 lee el `reason` que guarda la Task 1.
4. Parada tras el commit de la Task 1: lo dijo el dev-lead («cuando tengas el commit de la Task 1, para»); no se arranca la Task 2 sin su «sigue».
5. Coste estimado: ~1 h de implementación; sin despachos salvo la revisión final.
6. Review Focus: 3 entradas que la spec no fija (ver la sección).

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lo enseña.

**Architecture**: un campo `reason` en la reserva, validado contra la constante `reasons`; `canceladas` filtra `status === 'cancelled'`. Todo en `src/app.js`.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` dentro de su módulo, sin dependencias ni contratos entre módulos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano (constitution, art. 4); mensajes literales de la spec.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Motivos válidos exactamente: `cambio-de-planes`, `sala-ocupada`, `otro`; error literal `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits de la convención del proyecto (`feat: …`), referenciando la 0010.

## Review Focus

- `cancelar Norte lun Otro` (mayúscula) → motivo no válido, sin cancelar · Task 1, `motivo en mayúsculas no es válido`
- `cancelar` con una reserva ya cancelada → `sin reserva`, el motivo original queda · Task 1, `una reserva cancelada no se cancela otra vez`
- `canceladas` con una anulada y una cancelada → solo sale la cancelada · Task 2, `las anuladas no salen en canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y una función.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible solo en `anular`/`libres`; `cancelar` sin motivo rompe a propósito (decisión 18 de la spec).
- [x] **Constitution check**: tests primero, castellano, gate de cierre.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `reasons`, `seedBookings`, `cancelBooking(room, day, reason)`, `cancelledBookings`, comando `canceladas`.
- `test/cancel.test.js` — tests de los escenarios del delta.

**NO se tocan**:

- `test/app.test.js` — no cambia `libres` ni `reservar`.
- `scripts/lint.mjs` — sin cambios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests | alta | tests que dependen del orden | cada test llama a `seedBookings` primero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal, sin subagente (Native).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun sala-ocupada` → `cancelada Norte lun (motivo: sala ocupada)`.

**Interfaces**:
- Consume: nada.
- Produce: `seedBookings(list)`, `cancelBooking(room, day, reason)` y el campo `reason` en la reserva cancelada (la Task 2 lo lee); `reasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, cada uno con `seedBookings([{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }])` antes: `cancelar con motivo cambio-de-planes` (`cancelada Norte lun (motivo: cambio de planes)` y `libres ['10:00-12:00']` → `Norte, Sur`) · `cancelar con motivo sala-ocupada` · `cancelar con motivo otro` · `cancelar sin motivo no cancela` (`motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y `libres` → `Sur`) · `motivo fuera de la lista no cancela` (`aburrimiento`) · `motivo en mayúsculas no es válido` (`Otro`) · `el motivo se comprueba antes que la reserva` (sembrada vacía: `cancelar Sur mar otro` → `sin reserva Sur mar`; `cancelar Sur mar` → error de motivo) · `una reserva cancelada no se cancela otra vez` (segunda con `otro` → `sin reserva Norte lun`). Reescribe los dos tests existentes con motivo. Ejecuta: esperado, rojo.
- [ ] **Step 2: Implementación** — en `src/app.js`: `export function seedBookings(list) { bookings.splice(0, bookings.length, ...list); }`; `reasons` como arriba; `cancelBooking(room, day, reason)` devuelve el error literal si `!Object.hasOwn(reasons, reason)`, después `sin reserva …`, después guarda `booking.reason = reason` y responde `cancelada ${room} ${day} (motivo: ${reasons[reason]})`; `run` pasa `params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node --test && node scripts/lint.mjs` verde.
- [ ] **Step 4: Commit de la task** — `feat: cancelar exige un motivo de la lista (0010)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal, sin subagente (Native).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js canceladas` → `sin canceladas` (cada comando es un proceso nuevo: decisión 10 de la spec).

**Interfaces**:
- Consume: `reason`, `reasons` y `seedBookings` de la Task 1.
- Produce: `cancelledBookings()` y el comando `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — `canceladas enseña el motivo` (Norte lun cancelada por `cambio-de-planes` → `Norte lun 10:00-12:00 · cambio de planes`; tras `cancelar Norte lun otro` (da `sin reserva`), el listado sigue con `cambio de planes`) · `canceladas sin ninguna lo dice` (`sin canceladas`) · `las anuladas no salen en canceladas` (`anular Norte lun` → `sin canceladas`) · `canceladas con varias` (sembradas Norte lun 10:00-12:00 `cancelled`/`otro` y Sur mar 14:00-16:00 `cancelled`/`sala-ocupada` → dos líneas separadas por `\n`, en ese orden). Esperado: rojo.
- [ ] **Step 2: Implementación** — `cancelledBookings()` filtra `status === 'cancelled'` y formatea `${room} ${day} ${slot} · ${reasons[reason]}`; `run('canceladas')` une con `\n` o devuelve `sin canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: listado de canceladas con su motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,0h
- Estimación de implementación: 1,0h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un fichero; sin referencia en el log (proyecto sin features calibradas)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo (THEN + AND `libres`) → Task 1, `cancelar con motivo cambio-de-planes`. ✓
- Cada motivo se acepta · `otro` se acepta → Task 1, tests `sala-ocupada` y `otro`. ✓
- Ausente · fuera de la lista · `Otro` → Task 1, tres tests. ✓
- Motivo antes que reserva → Task 1, `el motivo se comprueba antes que la reserva`. ✓
- Ya cancelada no se cancela otra vez → Task 1, test homónimo; el AND (`canceladas` conserva el motivo) → Task 2, `canceladas enseña el motivo`. ✓
- Listado, vacío, anuladas, varias → Task 2, cuatro tests. ✓
- `anular` sin motivo → N/A (confirmado en spec). ✓
