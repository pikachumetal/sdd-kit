---
id: 20261112-212159-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace el hilo principal (Native), sin despacho; la revisión final de rama sí despacha sus ejes (Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`) — es la única revisión independiente de Native.
2. Ejecución: Native, fijado en `sdd-kit.json`; 2 tasks pequeñas en un solo fichero de código.
3. `CANCEL_REASONS` es un array exportado de `src/app.js` (`['cambio-de-planes', 'sala-ocupada', 'otro']`) y el texto «elige …» se construye con él, para que el aviso y la validación no se separen.
4. Validación estricta: sin normalizar mayúsculas ni espacios (`Otro` no es válido); la spec no lo decía, lo fija el test `rechaza_motivo_con_mayusculas`.
5. Los tests siembran `bookings` (exportado) con `bookings.length = 0` y `bookings.push(...)` en un `beforeEach`; el array es el mismo, así que `freeRooms` lo ve.
6. Coste estimado: ~1 h de implementación, sin despachos salvo la revisión final.
7. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada, lo guarda en la reserva, y `canceladas` lo muestra.

**Architecture**: todo en `src/app.js`: una constante `CANCEL_REASONS`, `cancelBooking(room, day, reason)` que valida el motivo antes de buscar la reserva, y una función `cancelledList()` que filtra `bookings` por `cancelled`. Los tests entran por `run`, como los actuales.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero, sin módulo ni dependencia nuevos; exportar `bookings` y `CANCEL_REASONS` es solo para los tests.

## Restricciones globales

### De código

- Textos de la interfaz en castellano, tal cual los de la spec: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y `motivo no válido «<valor>»: elige cambio-de-planes, sala-ocupada u otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Sin dependencias nuevas; `src/app.js` sin tabuladores (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2); RED visto fallar antes de implementar.
- Commits con la convención del proyecto (`feat: …`), referenciando la 0010.
- Cada task, un solo commit al quedar limpia.

## Review Focus

- `cancelar` sin argumentos (`run('cancelar', [])`) → `falta el motivo…`, no `sin reserva undefined undefined` · Task 1, `cancelar_sin_argumentos_pide_el_motivo`
- Motivo con mayúsculas (`Otro`) → `motivo no válido «Otro»…` y la reserva sigue activa · Task 1, `rechaza_motivo_con_mayusculas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante y dos funciones; sin flags ni estado nuevo.
- [x] **YAGNI gate**: nada se abstrae; `CANCEL_REASONS` se usa en la validación y en el aviso.
- [x] **Brownfield gate**: la forma de dos argumentos de `cancelar` cambia a propósito (spec); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, git-flow, textos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancelled-list.test.js` — escenarios de `canceladas`.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledList`, comando `canceladas` en `run`, export de `bookings`.
- `test/cancel.test.js` — escenarios de `cancelar` con motivo (sustituye a los dos tests de hoy).

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `README.md`, `CHANGELOG.md` — el changelog se escribe al cortar la release.

### 1.2 Modelo de datos

La reserva en memoria gana el campo `reason` (cadena) al cancelarse.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests se contaminan por el estado de módulo compartido | media | falsos verdes o rojos | `beforeEach` que vacía y siembra `bookings` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `cancelar` exige un motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0` · smoke: `node src/app.js cancelar Norte lun sala-ocupada` imprime `cancelada Norte lun (motivo: sala-ocupada)`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (motivo: sala-ocupada)`; con `node src/app.js cancelar Norte lun` ve `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `export const CANCEL_REASONS = ['cambio-de-planes', 'sala-ocupada', 'otro']`, `export const bookings`, `cancelBooking(room, day, reason)` que devuelve el texto de respuesta y guarda `booking.reason`; `run('cancelar', [room, day, reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — `test/cancel.test.js` importa `{ run, bookings }` de `../src/app.js` y un `beforeEach` que hace `bookings.length = 0; bookings.push({ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' })`. Tests (nombre → asserts, con `assert.equal`):
  - `cancela_con_motivo_y_libera_la_sala`: `run('cancelar', ['Norte', 'lun', 'sala-ocupada'])` → `'cancelada Norte lun (motivo: sala-ocupada)'`; luego `run('libres', ['10:00-12:00'])` → `'Norte, Sur'`.
  - `sin_motivo_no_cancela`: `run('cancelar', ['Norte', 'lun'])` → `'falta el motivo: elige cambio-de-planes, sala-ocupada u otro'`; `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `motivo_fuera_de_la_lista_no_cancela`: `run('cancelar', ['Norte', 'lun', 'vacaciones'])` → `'motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro'`; libres → `'Sur'`.
  - `motivo_de_dos_palabras_toma_la_primera`: `run('cancelar', ['Norte', 'lun', 'sala', 'ocupada'])` → `'motivo no válido «sala»: elige cambio-de-planes, sala-ocupada u otro'`.
  - `motivo_vacio_cuenta_como_sin_motivo`: `run('cancelar', ['Norte', 'lun', ''])` → `'falta el motivo: elige cambio-de-planes, sala-ocupada u otro'`.
  - `ignora_argumentos_de_mas`: `run('cancelar', ['Norte', 'lun', 'otro', 'extra'])` → `'cancelada Norte lun (motivo: otro)'`.
  - `motivo_se_comprueba_antes_que_la_reserva`: con `bookings.length = 0` en el test: `run('cancelar', ['Sur', 'mar'])` → `'falta el motivo: elige cambio-de-planes, sala-ocupada u otro'`; `run('cancelar', ['Sur', 'mar', 'vacaciones'])` → `'motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro'`; `run('cancelar', ['Sur', 'mar', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar_sin_argumentos_pide_el_motivo` (Review Focus): `run('cancelar', [])` → `'falta el motivo: elige cambio-de-planes, sala-ocupada u otro'`.
  - `rechaza_motivo_con_mayusculas` (Review Focus): `run('cancelar', ['Norte', 'lun', 'Otro'])` → `'motivo no válido «Otro»: elige cambio-de-planes, sala-ocupada u otro'`; libres → `'Sur'`.
  Ejecutar `node --test test/cancel.test.js`; esperado: fallan (rojo) por el motivo.
- [ ] **Step 2: Implementación** — en `src/app.js`: exportar `bookings` y `CANCEL_REASONS`; `cancelBooking(room, day, reason)` primero valida: sin `reason` (undefined o `''`) → `falta el motivo: elige <lista>`; `reason` fuera de `CANCEL_REASONS` → `motivo no válido «<reason>»: elige <lista>`, donde `<lista>` es `cambio-de-planes, sala-ocupada u otro` construido con `CANCEL_REASONS`; luego busca la reserva (`sin reserva <room> <day>` si no existe), la marca `cancelled`, guarda `reason` y devuelve `cancelada <room> <day> (motivo: <reason>)`. `run('cancelar', params)` pasa `params[0], params[1], params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; smoke de «Se prueba en la aplicación».
- [ ] **Step 4: Commit de la task** — `feat: cancelar exige un motivo de la lista (0010)`.

### Task 2 — Comando `canceladas`

**Tras**: Task 1
**Modelo**: hilo principal (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancelled-list.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancelled-list.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria (decisión 9 de la spec): `canceladas` solo ve cancelaciones del mismo proceso y se observa en el test, no desde la terminal.

**Interfaces**:
- Consume: `bookings` (array exportado), `cancelBooking` y `run('anular', …)` de `src/app.js`.
- Produce: `run('canceladas', [])` → líneas `<sala> <día> <franja> · <motivo>` unidas con `\n`, en el orden de `bookings`, solo estado `cancelled`; `sin canceladas` si no hay ninguna.

**Ficheros**: crear `test/cancelled-list.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `test/cancelled-list.test.js` con un `beforeEach` que vacía `bookings` y siembra `Norte lun 10:00-12:00` y `Sur mar 09:00-10:00` (ambas `active`):
  - `lista_las_canceladas_con_su_motivo_en_el_orden_de_la_lista`: `run('cancelar', ['Sur', 'mar', 'otro'])` y luego `run('cancelar', ['Norte', 'lun', 'sala-ocupada'])`; `run('canceladas', [])` → `'Norte lun 10:00-12:00 · sala-ocupada\nSur mar 09:00-10:00 · otro'`.
  - `sin_canceladas_lo_dice_y_la_anulada_no_cuenta`: `run('anular', ['Norte', 'lun'])`; `run('canceladas', [])` → `'sin canceladas'`.
  - `la_anulada_no_sale_junto_a_una_cancelada`: `run('anular', ['Norte', 'lun'])` y `run('cancelar', ['Sur', 'mar', 'otro'])`; `run('canceladas', [])` → `'Sur mar 09:00-10:00 · otro'`.
  Ejecutar; esperado: fallan (rojo) porque `canceladas` devuelve `salas`.
- [ ] **Step 2: Implementación** — `cancelledList()` en `src/app.js`: filtra `bookings` por `status === 'cancelled'`, mapea a `` `${room} ${day} ${slot} · ${reason}` ``, une con `\n`, y devuelve `sin canceladas` si el filtro queda vacío; `run('canceladas')` la llama.
- [ ] **Step 3: Verificación** — `node --test test/cancelled-list.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,0h
- Estimación de implementación: 1,0h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 2 tasks pequeñas en un fichero; sin referencia en el log (`estimation-log.md` aún no tiene features de este tipo)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN `cancelada Norte lun (motivo: sala-ocupada)` → Task 1, `cancela_con_motivo_y_libera_la_sala`; AND `libres` → `Norte, Sur` → mismo test. ✓
- Sin motivo válido: THEN `falta el motivo…` y AND sigue activa → Task 1, `sin_motivo_no_cancela`; `vacaciones` → `motivo_fuera_de_la_lista_no_cancela`; `sala ocupada` → `motivo_de_dos_palabras_toma_la_primera`; `""` → `motivo_vacio_cuenta_como_sin_motivo`; `otro extra` → `ignora_argumentos_de_mas`. ✓
- Motivo antes que reserva: los tres THEN → Task 1, `motivo_se_comprueba_antes_que_la_reserva`. ✓
- Listado: dos líneas con `\n` y orden de la lista → Task 2, `lista_las_canceladas_con_su_motivo_en_el_orden_de_la_lista`; `sin canceladas` → `sin_canceladas_lo_dice_y_la_anulada_no_cuenta`; cancelada + anulada → `la_anulada_no_sale_junto_a_una_cancelada`. ✓
- Reglas de la capacidad (lista cerrada, avisos, orden de comprobación) → Task 1, tests anteriores. ✓
- Filas de «retira o cambia de forma»: `cancelar` de dos argumentos y `cancelada <sala> <día>` → Task 1, los tests nuevos sustituyen a los dos de hoy en `test/cancel.test.js`. ✓
- `anular` sin cambios → N/A (confirmado en spec). ✓
- Review Focus: `cancelar_sin_argumentos_pide_el_motivo` y `rechaza_motivo_con_mayusculas` → Task 1. ✓
