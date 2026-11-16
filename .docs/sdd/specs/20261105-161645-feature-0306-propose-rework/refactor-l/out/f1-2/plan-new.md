---
id: 20261106-115012-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, las implementa esta sesión; las dos tasks son cortas y el plan lleva las firmas y los tests, así que van bien en gama media. La revisión final de rama no se quita: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Pieza de prueba nueva en `src/app.js`**: `resetBookings(seed)`. Los escenarios de la spec necesitan reservas activas distintas (cancelar `Norte lun` con tres motivos, una anulada, dos canceladas) y `src/app.js` guarda una sola reserva en memoria; sin poder sembrarlas, los tests dependerían del orden. Es código que solo usan los tests y no cambia nada de lo que ve quien usa el comando.
4. **Orden de las comprobaciones** (decisión 5 de la spec): `run` valida el motivo antes de buscar la reserva; lo cubre el test `sin motivo y sin reserva avisa del motivo` de la Task 1.
5. **Coste estimado**: ~2 h en total, sin despachar subagentes en las tasks. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada, lo guarda en la reserva, y `canceladas` lo enseña.

**Architecture**: todo en `src/app.js`. Una constante con la lista de motivos, `cancelBooking` recibe el motivo ya leído de `--motivo` por `run`, y `listCancelled` filtra por `status === 'cancelled'`.

**Tech Stack**: Node 22 sin dependencias; tests con `node:test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato nuevos entre módulos.

## Restricciones globales

### De código

- Node 22 sin dependencias externas; un solo fichero de entrada, `src/app.js` (`tech-stack.md`).
- Texto de la interfaz y de los documentos en castellano (constitución, art. 4).
- Valores de la lista exactos: `cambio-de-planes` → `cambio de planes`, `sala-ocupada` → `sala ocupada`, `otro` → `otro`. Aviso literal: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitución, spec, task, capacidad); código limpio.
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs` lo comprueba).

### De proceso

- Tests antes que código (constitución, art. 2). Un commit por task.
- Commits con la convención del proyecto, `feat: …`.

## Review Focus

- `cancelar Norte lun --motivo toString` (un nombre que existe en los objetos de JavaScript) → `motivo no válido: …`, no una cancelación con un motivo inventado · Task 1, `motivo heredado de Object no vale`
- `cancelar Norte lun --motivo --otra` (el valor es otra opción) → `motivo no válido: …` y la reserva sigue activa · Task 1, `motivo seguido de otra opción`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones y un comando.
- [x] **YAGNI gate**: sin texto libre ni orden por fecha de cancelación.
- [x] **Brownfield gate**: respeta el patrón del módulo (`run` despacha por comando); el único cambio de contrato es el de la spec.
- [x] **Constitution check**: tests antes que código; gate de cierre `node --test && node scripts/lint.mjs`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — tests del comando `canceladas` (Task 2).

**Modificar**:

- `src/app.js` — lista de motivos, `resetBookings`, `cancelBooking` con motivo, `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan `--motivo`; tests nuevos del motivo.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar --cada-semana` no cambian.
- `.docs/sdd/capabilities/` — la capacidad `booking-cancellation` la crea la fusión del cierre, no una task.
- `PRODUCT.md` — el término «Motivo de cancelación» lo añade el cierre.

### 1.2 a 1.6

No aplican: sin datos persistentes, migraciones, API ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `reasons[valor]` acepta `toString` o `constructor` | Media | Medio | `Object.hasOwn(reasons, valor)`; test en Review Focus |
| El estado en memoria se filtra entre tests del mismo fichero | Alta | Bajo | `resetBookings` en cada test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin `--motivo` ve `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `resetBookings(seed)`, que sustituye las reservas en memoria por `seed` (por defecto, la reserva inicial `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`); `cancelBooking(room, day, reason)` con `reason` ya leído; las reservas canceladas llevan `reason` con la clave de la lista (`'sala-ocupada'`); `reasons`, un objeto `{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `beforeEach(() => resetBookings())` de `node:test`, estos tests (los dos existentes pasan `--motivo otro` y `--motivo cambio-de-planes` según su caso):
  - `cancelar con sala-ocupada` → `run('cancelar', ['Norte','lun','--motivo','sala-ocupada'])` es `cancelada Norte lun (sala ocupada)`
  - `cancelar con cambio-de-planes` → `cancelada Norte lun (cambio de planes)`
  - `cancelar con otro` → `cancelada Norte lun (otro)`
  - `sin motivo avisa y no cancela` → `run('cancelar', ['Norte','lun'])` es el aviso, y luego `run('cancelar', ['Norte','lun','--motivo','otro'])` sigue dando `cancelada Norte lun (otro)`
  - `motivo fuera de la lista` → `--motivo aburrimiento` da el aviso
  - `motivo sin valor` → `['Norte','lun','--motivo']` da el aviso
  - `motivo con mayúsculas no vale` → `--motivo Sala-Ocupada` da el aviso
  - `motivo repetido manda el primero` → `['Norte','lun','--motivo','otro','--motivo','sala-ocupada']` da `cancelada Norte lun (otro)`
  - `motivo heredado de Object no vale` → `--motivo toString` da el aviso
  - `motivo seguido de otra opción` → `['Norte','lun','--motivo','--otra']` da el aviso y la reserva sigue activa
  - `sin reserva con motivo válido` → `run('cancelar', ['Sur','mar','--motivo','otro'])` es `sin reserva Sur mar`
  - `sin motivo y sin reserva avisa del motivo` → `run('cancelar', ['Sur','mar'])` es el aviso
  - `reserva ya cancelada no cambia su motivo` → tras cancelar con `cambio-de-planes`, `cancelar Norte lun --motivo otro` da `sin reserva Norte lun`; el motivo guardado lo comprueba la Task 2 con `canceladas`
  Ejecútalos: `node --test test/cancel.test.js` falla (`resetBookings` no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: `export const reasons`; `export function resetBookings(seed = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }])` sustituye el contenido del array `bookings` (que pasa a `let` o se vacía y rellena); `readReason(params)` devuelve el valor que sigue a la primera `--motivo`, o `undefined` si no hay valor o el valor empieza por `--`; `cancelBooking(room, day, reason)` primero comprueba `Object.hasOwn(reasons, reason)` y devuelve el aviso si no, luego busca la reserva y, si la hay, pone `status = 'cancelled'`, `reason`, y devuelve `cancelada ${room} ${day} (${reasons[reason]})`; `run` llama a `cancelBooking(params[0], params[1], readReason(params))`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node src/app.js cancelar Norte lun --motivo sala-ocupada` imprime `cancelada Norte lun (sala ocupada)`.
- [ ] **Step 4: Commit de la task** — uno solo: `feat: cancelar exige un motivo de la lista (0010)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/canceladas.test.js`, escritos antes de implementar y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar `Norte lun` con `cambio-de-planes`, `canceladas` muestra `Norte lun · cambio de planes`; sin canceladas muestra `sin canceladas`.

**Interfaces**:
- Consume: `resetBookings(seed)`, `cancelBooking(room, day, reason)` y `reasons` de la Task 1; las reservas canceladas llevan `reason`.
- Produce: `listCancelled()` y el comando `canceladas` en `run`.

**Ficheros**: crear `test/canceladas.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — en `test/canceladas.test.js`, con `beforeEach(() => resetBookings(seed))` y `seed` de reservas `Norte lun`, `Sur mar` y `Norte mie`, todas activas:
  - `una cancelada` → tras `run('cancelar', ['Norte','lun','--motivo','cambio-de-planes'])`, `run('canceladas', [])` es `Norte lun · cambio de planes`
  - `dos canceladas en el orden de las reservas` → se cancela primero `Sur mar --motivo otro` y luego `Norte lun --motivo cambio-de-planes`; `canceladas` es `Norte lun · cambio de planes\nSur mar · otro`
  - `una anulada no aparece` → `run('anular', ['Norte','lun'])` y `canceladas` es `sin canceladas`
  - `ninguna cancelada` → `canceladas` es `sin canceladas`
  - `sin motivo no se crea ninguna cancelada` → `run('cancelar', ['Sur','mar'])` y `canceladas` es `sin canceladas`
  - `la reserva ya cancelada conserva su motivo` → cancelar `Norte lun` con `cambio-de-planes`, luego otra vez con `otro` (`sin reserva Norte lun`), y `canceladas` sigue en `Norte lun · cambio de planes`
  Ejecútalos: `node --test test/canceladas.test.js` falla (el comando no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'`, las une con `\n` como `${room} ${day} · ${reasons[reason]}` y devuelve `sin canceladas` si no hay ninguna; `run` añade `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `node --test test/canceladas.test.js` → `ℹ fail 0`; `node --test test/cancel.test.js` sigue en `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo: `feat: listado de canceladas con su motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 0,75h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks cortas sobre un fichero de ~35 líneas; sin referencia en el estimation-log (no existe todavía)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con `sala-ocupada` → `cancelada Norte lun (sala ocupada)` y reserva cancelada con motivo → Task 1, `cancelar con sala-ocupada`; el motivo guardado lo observa Task 2, `una cancelada`. ✓
- Respuesta con `cambio-de-planes` y con `otro` → Task 1, `cancelar con cambio-de-planes` y `cancelar con otro`. ✓
- Sin motivo → aviso y reserva sigue activa → Task 1, `sin motivo avisa y no cancela`. ✓
- Motivo fuera de la lista → aviso y sigue activa → Task 1, `motivo fuera de la lista`. ✓
- `--motivo` sin valor, con mayúsculas y repetido → Task 1, `motivo sin valor`, `motivo con mayúsculas no vale`, `motivo repetido manda el primero`. ✓
- Sin reserva con motivo válido → `sin reserva Sur mar` → Task 1, `sin reserva con motivo válido`. ✓
- Sin reserva y sin motivo → aviso, y `canceladas` sin canceladas → Task 1, `sin motivo y sin reserva avisa del motivo`; Task 2, `sin motivo no se crea ninguna cancelada`. ✓
- Ya cancelada → `sin reserva Norte lun` y el motivo no cambia → Task 1, `reserva ya cancelada no cambia su motivo`; Task 2, `la reserva ya cancelada conserva su motivo`. ✓
- `canceladas` con una, con dos en el orden de las reservas, con una anulada, con ninguna → Task 2, `una cancelada`, `dos canceladas en el orden de las reservas`, `una anulada no aparece`, `ninguna cancelada`. ✓
- Reglas de la capacidad (datos en memoria, lista cerrada, aviso, sin motivo no se cancela) → Task 1, los tests de aviso. ✓
- Reservas semanales y regla de 24 h → N/A (fuera del Scope de la spec). ✓
- Review Focus: `toString` y `--otra` → Task 1, `motivo heredado de Object no vale` y `motivo seguido de otra opción`. ✓
