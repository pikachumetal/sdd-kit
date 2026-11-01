---
id: 20261101-122824-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: la sesión Native implementa las dos; gama media (Sonnet, effort medium), porque el plan lleva el diseño.
2. **Ejecución**: native, porque son 2 tasks sobre un solo fichero y la segunda consume la forma de la reserva de la primera.
3. **Decisión técnica que la spec no fija**: el motivo se guarda en `booking.reason` con el texto con espacios (`sala ocupada`); la lista es una constante `REASONS` de código→texto en `src/app.js`.
4. **Parseo de `--motivo`**: se busca `--motivo` en `params` y se toma el valor siguiente; sala y día siguen siendo `params[0]` y `params[1]`.
5. **Riesgo alto**: ninguno. **Coste**: ~0,5 h, sin subagentes.
6. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar exige un motivo de la lista y `canceladas` los enseña.

**Architecture**: un solo fichero, `src/app.js`: `cancelBooking(room, day, reason)` valida y guarda; `cancelledBookings()` alimenta el comando `canceladas`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas sobre `src/app.js`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de un comando en el único fichero de código; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; los códigos de motivo son exactamente `cambio-de-planes`, `sala-ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin dependencias externas; Node 22.

### De proceso

- Modelos: gama media para la sesión; ejes Spec y Arquitectura de la revisión final en Opus.
- Commits: uno por task, tras su revisión limpia.

## Review Focus

- `cancelar Norte lun --motivo` (sin valor tras la opción) → `indica un motivo: cambio-de-planes, sala-ocupada u otro`, no un fallo · Task 1, `cancelar con --motivo sin valor`
- `cancelar` con motivo no válido sobre una reserva activa → la reserva sigue activa y `canceladas` no la lista · Task 2, `motivo no válido no cancela`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante y dos funciones.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: cambia el comportamiento de `cancelar` a propósito (decisión 3 de la spec); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código; texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo, `cancelledBookings`, comando `canceladas`.
- `test/cancel.test.js` — tests de `cancelar` con motivo y del listado.

**NO se tocan**:

- `voidBooking` y `anular` — fuera de scope (0011).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper los tests actuales de `cancelar` | Alta (esperado) | Bajo | La Task 1 los actualiza al nuevo comportamiento |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sesión Native, `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin motivo ve `indica un motivo: cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` (`reason`: código o `undefined`) que guarda `booking.reason` con el texto con espacios; constante `REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`: `cancelar con motivo` (`run('cancelar', ['Norte','lun','--motivo','sala-ocupada'])` → `cancelada Norte lun (sala ocupada)`); `cancelar sin motivo` y `cancelar con motivo no válido` (`--motivo aburrimiento`) → `indica un motivo: cambio-de-planes, sala-ocupada u otro`; `cancelar con --motivo sin valor` → el mismo aviso; `cancelar sin reserva` (`Sur mar --motivo otro`) → `sin reserva Sur mar`; sin motivo y sin reserva (`Sur mar`) → el aviso del motivo. Verlos fallar.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)`: si `reason` no es clave de `REASONS`, devuelve el aviso; si no hay reserva, `sin reserva …`; si la hay, `status = 'cancelled'`, `reason = REASONS[reason]` y devuelve `cancelada ${room} ${day} (${REASONS[reason]})`. En `run`, `reason` es el valor tras `--motivo` en `params`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sesión Native, `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo principal · `test/cancel.test.js`.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con `sala-ocupada`, `canceladas` responde `Norte lun 10:00-12:00 · sala ocupada`.

**Interfaces**:
- Consume: `booking.reason` y `status: 'cancelled'` de la Task 1.
- Produce: `cancelledBookings()` → líneas `<sala> <día> <franja> · <motivo>`; comando `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — `canceladas lista el motivo` (tras cancelar Norte lun con `sala-ocupada` → `Norte lun 10:00-12:00 · sala ocupada`); `sin canceladas` (estado inicial); `una anulada no aparece`; `motivo no válido no cancela` (la reserva sigue y `canceladas` no la lista). Las reservas son estado de módulo: el orden de los tests importa, y `sin canceladas` va antes de cancelar nada.
- [ ] **Step 2: Implementación** — `cancelledBookings()` y la rama `canceladas` en `run`: `sin canceladas` si no hay, líneas unidas por salto de línea si las hay, en orden de cancelación.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): comando canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,4 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; sin estimation-log previo.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN cancelar con motivo → `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar con motivo`. ✓
- THEN la reserva queda cancelada con ese motivo → Task 2, `canceladas lista el motivo`. ✓
- THEN sin motivo / no válido → aviso → Task 1, `cancelar sin motivo`, `cancelar con motivo no válido`. ✓
- AND la reserva sigue activa → Task 2, `motivo no válido no cancela`. ✓
- AND sin motivo y sin reserva → aviso → Task 1, test del aviso sin reserva. ✓
- THEN cancelar sin reserva → `sin reserva Sur mar` → Task 1, `cancelar sin reserva`. ✓
- THEN `canceladas` con formato → Task 2, `canceladas lista el motivo`. ✓
- AND `sin canceladas` → Task 2, `sin canceladas`. ✓
- AND una anulada no aparece → Task 2, `una anulada no aparece`. ✓
- Review Focus `--motivo` sin valor → Task 1. ✓ · motivo no válido no cancela → Task 2. ✓
