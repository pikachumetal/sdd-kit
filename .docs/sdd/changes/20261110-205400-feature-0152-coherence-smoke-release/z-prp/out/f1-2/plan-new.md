---
id: 20261112-163730-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo por task: sesión Native en gama media (Sonnet, effort medium); las dos tasks son de unas 20 líneas y la spec fija textos y firmas.
2. Dos tasks encadenadas por `cancelBooking`/`reason`: Task 1 deja la reserva con `reason`, Task 2 la lista.
3. Los tests viven en `test/cancel.test.js` (ya existe y prueba por `run()`); un `beforeEach` con `resetBookings()`.
4. Coste: ~1 h de implementación, ~0,5 h de revisión y cierre; sin despachos de subagentes en las tasks.
5. Review Focus: 3 entradas que la spec no fija (ver la sección).

**Goal**: cancelar exige un motivo de la lista y `canceladas` lo enseña.

**Architecture**: un solo fichero, `src/app.js`: constante `cancelReasons`, validación en `cancelBooking`, `cancelledBookings()` y `resetBookings(list)` para sembrar los tests.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — sin módulo, dependencia ni contrato entre módulos nuevos; `cancelBooking` solo se usa dentro de `src/app.js`.

## Restricciones globales

### De código

- Textos de la interfaz en castellano (constitution, art. 4); los de la spec, literales.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task).
- Sin dependencias externas (architecture.md).
- Motivos: `cambio-de-planes`, `sala-ocupada`, `otro`; se muestran `cambio de planes`, `sala ocupada`, `otro`. Aviso: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

### De proceso

- Tests antes que código (constitution, art. 2); un commit por task, tras su verificación.
- Commits con la convención `feat:` y el trailer de coautoría del kit.

## Review Focus

- `cancelar Norte lun` sin motivo → aviso y la reserva sigue activa · Task 1, `sin motivo avisa y no cancela`
- `cancelar Sur mar vacaciones` sin reserva → aviso de motivo, no `sin reserva` · Task 1, `motivo no válido se comprueba antes que la reserva`
- `resetBookings()` tras cancelar devuelve Norte lun activa (copia, no la misma referencia) · Task 1, `resetBookings restablece de verdad`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tercer argumento posicional, sin parseo de opciones.
- [x] **YAGNI gate**: sin abstracciones; una constante y tres funciones.
- [x] **Brownfield gate**: cambia la firma de `cancelBooking` (sin otros consumidores) y el comportamiento de `cancelar` sin motivo (spec, decisión 2).
- [x] **Constitution check**: tests primero, gate `node --test && node scripts/lint.mjs`, textos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelReasons`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, `resetBookings(list)`, rutas `cancelar` y `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan a la forma con motivo; tests nuevos.
- `CHANGELOG.md` — entrada en `Unreleased` → `Added` (Task 2).

**NO se tocan**:

- `voidBooking` y `anular` — sin motivo (spec, Scope).
- `test/app.test.js` — no depende de `cancelar`.

### 1.2 a 1.6

No aplican (sin datos persistentes, migraciones, API ni UI; sin dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado global compartido entre tests | media | tests dependientes del orden | `resetBookings()` en `beforeEach`; plantilla inicial inmutable |
| `reset` sin copia profunda | media | el reset no restablece | copias de cada objeto; test `resetBookings restablece de verdad` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend (`src/app.js`).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun sala-ocupada` → `cancelada Norte lun · sala ocupada`; sin motivo → `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → texto; `resetBookings(list?)`; la reserva cancelada lleva `reason` (clave kebab-case).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `beforeEach(() => resetBookings())` (import de `resetBookings` desde `../src/app.js`) y siembra con `resetBookings([{ room, day, slot: '10:00-12:00', status: 'active' }, …])` donde haga falta:
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte','lun','sala-ocupada'])` → `cancelada Norte lun · sala ocupada`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur','mar','otro'])` → `sin reserva Sur mar`.
  - `sin motivo avisa y no cancela`: `run('cancelar', ['Norte','lun'])` → el aviso; después `run('cancelar', ['Norte','lun','otro'])` → `cancelada Norte lun · otro`.
  - `motivo fuera de la lista avisa`: `vacaciones` y `Otro` → el aviso.
  - `motivo no válido se comprueba antes que la reserva`: `run('cancelar', ['Sur','mar','vacaciones'])` → el aviso.
  - `argumento sobrante se ignora`: `run('cancelar', ['Norte','lun','otro','extra'])` → `cancelada Norte lun · otro`.
  - `resetBookings restablece de verdad`: cancelar Norte lun, `resetBookings()`, cancelar otra vez → `cancelada Norte lun · otro`.
  Ejecutar y ver fallar.
- [ ] **Step 2: Implementación** — `const cancelReasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reason)`: motivo que no sea clave propia de `cancelReasons` (`Object.hasOwn`, comparación exacta) → aviso; luego busca; sin reserva → `sin reserva ${room} ${day}`; si no, `status = 'cancelled'`, `reason`, devuelve `cancelada ${room} ${day} · ${cancelReasons[reason]}`. `initialBookings` es la plantilla `[{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }]`, que nunca se muta; `let bookings = initialBookings.map((b) => ({ ...b }))`; `resetBookings(list = initialBookings)` reasigna `bookings` con copias (`list.map((b) => ({ ...b }))`). `run`: `cancelar` pasa `params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node --test` entero en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sesión Native, Sonnet con effort medium (sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend, docs (`CHANGELOG.md`).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada ejecución del CLI empieza de cero (reservas en memoria): se prueba por `run()` en el mismo proceso (spec, decisión 8).

**Interfaces**:
- Consume: `reason` de la reserva y `resetBookings(list)` de la Task 1; `voidBooking` existente.
- Produce: `cancelledBookings()` → texto de `canceladas`; comando `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `CHANGELOG.md`.

- [ ] **Step 1: Tests RED** — `canceladas` lista con motivo y sin anuladas: sembrar Norte lun, Sur mar y Norte mié (`slot: '10:00-12:00'`, `status: 'active'`), `cancelar Norte lun sala-ocupada`, `cancelar Sur mar cambio-de-planes`, `anular Norte mié`, `run('canceladas', [])` → `Norte lun · sala ocupada\nSur mar · cambio de planes`; y `sin canceladas` sin ninguna cancelada. Ver fallar.
- [ ] **Step 2: Implementación** — `cancelledBookings()`: reservas con `status === 'cancelled'`, en el orden de la lista, `${room} ${day} · ${cancelReasons[reason]}` unidas por `\n`; vacío → `sin canceladas`. `run`: `canceladas` → `cancelledBookings()`. `CHANGELOG.md`: «Motivo al cancelar una reserva (`salas cancelar <sala> <día> <motivo>`) y listado `salas canceladas`.» con enlace a esta carpeta.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de reservas canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin referencia en estimation-log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN `cancelada Norte lun · sala ocupada` y AND motivos admitidos → Task 1, `cancelar una reserva activa con motivo`, `sin motivo avisa y no cancela` (el `otro` posterior). ✓
- Sin motivo → aviso y sigue activa → Task 1, `sin motivo avisa y no cancela`. ✓
- Fuera de lista y mayúscula → Task 1, `motivo fuera de la lista avisa`; AND argumento sobrante → `argumento sobrante se ignora`. ✓
- Motivo antes que reserva → Task 1, `motivo no válido se comprueba antes que la reserva`. ✓
- Sin reserva preservado → Task 1, `cancelar sin reserva lo dice`. ✓
- Listado: dos líneas sin la anulada y `sin canceladas` → Task 2, los dos tests de `canceladas`. ✓
- Fila de «Lo que se retira»: `cancelar` sin motivo y salida nueva → Task 1, los tests de arriba. ✓
- `anular` sin cambios → N/A (spec, Scope). ✓
- Review Focus → Task 1: `sin motivo avisa y no cancela`, `motivo no válido se comprueba antes que la reserva`, `resetBookings restablece de verdad`. ✓
