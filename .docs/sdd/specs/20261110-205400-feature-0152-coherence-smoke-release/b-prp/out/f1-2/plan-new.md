---
id: 20261111-085915-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace el hilo principal (Native), en gama media (Sonnet, effort medium) — son cambios de pocas líneas con la firma y los tests ya fijados. La revisión final de rama va con sus ejes de `sdd-verify`: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, fijado en sdd-kit.json.
3. Dos tasks: la 1 cambia `cancelar` (y deja `resetBookings()`); la 2 añade `canceladas`. Una revisora podría aprobar una y rechazar la otra.
4. `resetBookings()` restablece el array `bookings` con `splice` para no cambiar la referencia que usan `freeRooms` y `findBooking`.
5. Coste estimado: ~1,2 h; sin despachos de subagentes salvo la revisión final.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lo enseña.

**Architecture**: un solo fichero, `src/app.js`. `cancelBooking` valida el motivo antes de buscar la reserva y guarda la etiqueta legible en `reason`; `cancelledBookings` filtra `status === 'cancelled'`; `run` enruta `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de un comando en el único fichero, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Motivos de la línea de comandos: `cambio-de-planes`, `sala-ocupada`, `otro`; etiquetas guardadas y mostradas: `cambio de planes`, `sala ocupada`, `otro`.
- Aviso literal: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Commits en castellano, estilo del proyecto (`feat: …`), uno por hito.
- Texto de la interfaz en castellano (constitution, art. 4).

## Review Focus

- `cancelar Norte lun Otro` (mayúscula) → `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`, no cancela · Task 1, `rechaza un motivo con mayúscula`
- `cancelar Norte lun otro extra` (argumento sobrante) → `cancelada Norte lun (otro)` · Task 1, `ignora argumentos sobrantes`
- `canceladas extra` (parámetro sobrante) → igual que sin parámetro · Task 2, `canceladas ignora parámetros`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tercer argumento posicional, sin parser nuevo.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: se actualizan los dos tests de `cancelar` que cambian de forma; `reservar` y `libres` no se tocan.
- [x] **Constitution check**: tests antes que código; gate `node --test` entero; texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — tests del comando `canceladas` (Task 2).

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo, `resetBookings`, `cancelledBookings`, enrutado de `canceladas`.
- `test/cancel.test.js` — los dos tests actuales pasan a pedir motivo, más los nuevos.

**NO se tocan**:

- `scripts/lint.mjs` — sigue valiendo.
- `voidBooking` y `reservar` — fuera de alcance (fila 0011).

### 1.2 Modelo de datos

La reserva gana el campo `reason` (etiqueta legible) al cancelarse. En memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests | Media | Medio | `resetBookings()` al empezar cada test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal en Native (sin despacho)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de la implementación y sin commitear: van en el commit de la task

**Superficies**: backend, docs (ninguna)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin motivo ve `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason): string`; `resetBookings(): void`; las reservas canceladas llevan `reason` con la etiqueta legible (`'cambio de planes' | 'sala ocupada' | 'otro'`).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

Tests (todos empiezan con `resetBookings()` en un `beforeEach`):

- `cancela con sala-ocupada` → `run('cancelar', ['Norte','lun','sala-ocupada'])` = `cancelada Norte lun (sala ocupada)`; y `run('libres', ['10:00-12:00'])` = `Norte, Sur`.
- `cancela con cambio-de-planes` → `cancelada Norte lun (cambio de planes)`.
- `cancela con otro` → `cancelada Norte lun (otro)`.
- `sin motivo no cancela` → `run('cancelar', ['Norte','lun'])` = `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`; `run('libres', ['10:00-12:00'])` = `Sur`.
- `rechaza un motivo fuera de la lista` → con `aburrimiento`, el mismo aviso.
- `rechaza un motivo con mayúscula` → con `Otro`, el mismo aviso.
- `ignora argumentos sobrantes` → `['Norte','lun','otro','extra']` = `cancelada Norte lun (otro)`.
- `sin reserva lo dice` → `['Sur','mar','otro']` = `sin reserva Sur mar`.
- `el motivo se comprueba antes que la reserva` → `['Sur','mar','aburrimiento']` = el aviso del motivo.

- [ ] **Step 1: RED** — escribir esos tests en `test/cancel.test.js` (importando `resetBookings`), copia fuera del repo, y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const reasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }` (con `Object.hasOwn` para validar); `cancelBooking(room, day, reason)` valida primero y guarda `booking.reason`; `resetBookings()` = `bookings.splice(0, bookings.length, seedBooking())`; `run` pasa `params[2]` a `cancelar`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: motivo obligatorio al cancelar (0010)`; uno solo, junta los intermedios.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal en Native (sin despacho)
**Tests RED**: hilo principal · `test/canceladas.test.js`, escritos antes de implementar y sin commitear

**Superficies**: backend
**Verificación**: `node --test test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ve `sin canceladas` si no hay ninguna; tras cancelar `Norte lun` con `sala-ocupada` en la misma ejecución, `canceladas` enseña `Norte lun · sala ocupada` (la memoria no persiste entre ejecuciones: se ve en los tests).

**Interfaces**:
- Consume: `resetBookings()`, `run`, el campo `reason` y `status: 'cancelled'` de Task 1.
- Produce: `cancelledBookings(): string`; `run('canceladas', _)`.

**Ficheros**: crear `test/canceladas.test.js`; modificar `src/app.js`

Tests (con `resetBookings()` en `beforeEach`):

- `sin canceladas` → `run('canceladas', [])` = `sin canceladas`.
- `lista la cancelada con su motivo` → tras `cancelar Norte lun sala-ocupada`, `canceladas` = `Norte lun · sala ocupada`.
- `un motivo inválido deja sin canceladas` → tras `cancelar Norte lun aburrimiento`, `canceladas` = `sin canceladas`.
- `las anuladas no salen` → tras `anular Norte lun`, `canceladas` = `sin canceladas`.
- `canceladas ignora parámetros` → `run('canceladas', ['extra'])` = `sin canceladas`.

- [ ] **Step 1: RED** — escribir los tests y ver que fallan.
- [ ] **Step 2: Implementación** — `cancelledBookings()` filtra `status === 'cancelled'`, mapea a `${room} ${day} · ${reason}`, une con `\n`, o `sin canceladas`; `run` enruta `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/canceladas.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: listado de canceladas con su motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0,7h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,4h
- Base de la estimación: 2 tasks pequeñas en un fichero, sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN `cancelada Norte lun (sala ocupada)` → Task 1, `cancela con sala-ocupada`. ✓
- AND deja de estar activa y `canceladas` la lista con `sala ocupada` → Task 1 (`libres` = `Norte, Sur`) y Task 2, `lista la cancelada con su motivo`. ✓
- AND `cambio-de-planes` y `otro` → Task 1, `cancela con cambio-de-planes` y `cancela con otro`. ✓
- Motivo ausente o inválido: THEN aviso → Task 1, `sin motivo no cancela` y `rechaza un motivo fuera de la lista`. ✓
- AND la reserva sigue activa: `canceladas` = `sin canceladas` → Task 1 (`libres` = `Sur`) y Task 2, `un motivo inválido deja sin canceladas`. ✓
- Motivo antes que reserva: THEN `sin reserva Sur mar` y AND aviso → Task 1, `sin reserva lo dice` y `el motivo se comprueba antes que la reserva`. ✓
- Listado: THEN `Norte lun · sala ocupada`, AND `sin canceladas` → Task 2, `lista la cancelada con su motivo` y `sin canceladas`. ✓
- Las anulaciones no salen → Task 2, `las anuladas no salen`. ✓
- Fila «cancelar sin motivo» y «respuesta sin sufijo» de «Lo que se retira» → Task 1, los dos tests actuales reescritos. ✓
- Review Focus → Task 1 (`rechaza un motivo con mayúscula`, `ignora argumentos sobrantes`) y Task 2 (`canceladas ignora parámetros`). ✓
