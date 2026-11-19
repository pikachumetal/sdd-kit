---
id: 20261119-183254-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. Modelo: Task 1 en `sdd-kit:effort-medium` + `sonnet` (la ejecuta la sesión en Native; una función con el comportamiento ya especificado). Revisión final de rama con los ejes de `sdd-verify`.
2. Ejecución: native, porque es una sola task en un fichero, un error lo caza su test y el plan cabe en un contexto. Con una sola task no se ofrece la parada antes de la Task 1.
3. Para montar los GIVEN hace falta crear reservas y hoy no hay forma (`reservar` no crea): se exporta `addBooking(room, day, slot)` en `src/app.js`, que añade una reserva `active`. Es una API nueva usada solo por los tests; decisión mía, la valida el dev-lead.
4. Aislamiento: `node --test` corre cada fichero de test en su proceso, y dentro de `test/occupancy.test.js` cada test usa su propio día (`mar`, `mié`, `jue`, `vie`, `sáb`); no se reinicia `bookings`.
5. Coste estimado: 0,5 h de implementación (ver «Estimación y esfuerzo»); sin despachos, sin coste extra en tokens.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: añadir el comando `ocupacion <sala> <dia>` que cuenta reservas activas y avisa `muy ocupada` con 3 o más.

**Architecture**: una función `occupancy(room, day)` en `src/app.js` sobre `bookings`, más una rama en `run`. Sin ficheros nuevos de producción.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque una sola task en un fichero, un error lo caza su test y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade una función y una rama en `run` del único fichero de entrada, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada `src/app.js` (architecture.md).
- Interfaz y documentos en castellano; nombres de código en inglés (spec, decisión 9).
- Umbral: `BUSY_THRESHOLD = 3`; «muy ocupada» = 3 o más reservas activas.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); código limpio.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2). Commits referenciando la 0012.

## Review Focus

- `ocupacion Norte lun` con la reserva sembrada de Norte lun (`10:00-12:00`) → `1 reserva activa`, sin romperse por el dato existente · Task 1, `Cuenta la reserva sembrada`
- Reservas `cancelled` y `voided` de la misma sala y día → no cuentan · Task 1, `Cancelada y anulada no cuentan`
- Día sin ninguna reserva → `0 reservas activas`, no error · Task 1, `Singular y cero`

---

## Phase -1 — Pre-Implementation Gates

- [x] Simplicity gate: una función y una rama.
- [x] YAGNI gate: nada abstraído; `addBooking` existe solo porque los tests lo necesitan.
- [x] Brownfield gate: no cambia `libres`, `reservar`, `cancelar` ni `anular`.
- [x] Constitution check: tests primero, gate completo, castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/occupancy.test.js` — tests del comando.

**Modificar**:

- `src/app.js` — `BUSY_THRESHOLD`, `occupancy`, `addBooking`, rama `ocupacion` en `run`.

**NO se tocan**:

- `test/app.test.js`, `test/cancel.test.js` — comportamiento existente intacto.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Umbral 3 no es el que quiere el dev-lead | media | bajo | constante única; se valida en la validación |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Comando `ocupacion`

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (la ejecuta la sesión en Native; una función con el comportamiento ya especificado).
**Tests RED**: hilo principal · `test/occupancy.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/occupancy.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — el dev-lead ejecuta `node src/app.js ocupacion Norte lun` y ve `Norte lun: 1 reserva activa`.

**Interfaces**:
- Consume: `bookings` (`{ room, day, slot, status }`, con `status` entre `active`, `cancelled` y `voided`) y `rooms = ['Norte', 'Sur']` de `src/app.js`; `cancelBooking(room, day)` y `voidBooking(room, day)`, ya exportadas (cada una cambia la primera reserva activa de esa sala y día).
- Produce: `addBooking(room, day, slot)` (añade una reserva `active`, devuelve `undefined`), `occupancy(room, day)` → `string`, y el comando `run('ocupacion', [sala, dia])`.

**Ficheros**: crear `test/occupancy.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** — en `test/occupancy.test.js`, importando `run`, `addBooking`, `cancelBooking` y `voidBooking` de `../src/app.js`; cada test usa su propio día:
  - `Cuenta la reserva sembrada`: `run('ocupacion', ['Norte', 'lun'])` es `'Norte lun: 1 reserva activa'`.
  - `Muy ocupada con tres`: tres `addBooking('Norte', 'mar', <franja distinta>)` → `'Norte mar: 3 reservas activas · muy ocupada'`.
  - `Poca ocupación con una cancelada`: tres `addBooking('Norte', 'mié', …)` y un `cancelBooking('Norte', 'mié')` → `'Norte mié: 2 reservas activas'`.
  - `Cancelada y anulada no cuentan`: cuatro `addBooking('Norte', 'jue', …)`, un `cancelBooking` y un `voidBooking` → `'Norte jue: 2 reservas activas'`.
  - `Singular y cero`: un `addBooking('Norte', 'vie', …)` → `'Norte vie: 1 reserva activa'`; `run('ocupacion', ['Norte', 'sáb'])` → `'Norte sáb: 0 reservas activas'`.
  - `Sala desconocida`: `run('ocupacion', ['Este', 'lun'])` es `'sala desconocida Este'`.
  - `Argumentos que faltan`: `run('ocupacion', ['Norte'])` es `'uso: ocupacion <sala> <dia>'`.
- [ ] **Step 2: Ver el RED** — `NO_COLOR=1 node --test test/occupancy.test.js`. Esperado: `ℹ fail` mayor que 0 (no existen `addBooking` ni el comando).
- [ ] **Step 3: Implementación** — en `src/app.js`: `const BUSY_THRESHOLD = 3;`, `export function addBooking(room, day, slot)`, `export function occupancy(room, day)` (cuenta `status === 'active'`; `1` va en singular; añade ` · muy ocupada` si `n >= BUSY_THRESHOLD`) y, en `run`, la rama `ocupacion`: primero uso (sala o día ausentes → `uso: ocupacion <sala> <dia>`), luego sala fuera de `rooms` → `sala desconocida <sala>`, si no `occupancy(...)`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/occupancy.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0012): comando ocupacion con aviso de sala muy ocupada`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,6 h (el gate de cierre, `node --test` más lint, dura ~1 s; el resto es el cierre)
- Base de la estimación: 1 task, 1 fichero de producción y uno de tests; sin `estimation-log.md` que calibre
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Aviso de sala muy ocupada: THEN `3 reservas activas · muy ocupada` → Task 1, `Muy ocupada con tres`. ✓
- Sala con poca ocupación: THEN `2 reservas activas` → Task 1, `Poca ocupación con una cancelada`. ✓
- Sala desconocida → Task 1, `Sala desconocida`. ✓
- Anuladas y borde → Task 1, `Cancelada y anulada no cuentan`. ✓
- Singular y cero → Task 1, `Singular y cero`. ✓
- Argumentos que faltan → Task 1, `Argumentos que faltan`. ✓
- Sin filas de «regla retirada» (nada se retira). ✓
- Review Focus: sembrada → `Cuenta la reserva sembrada`; canceladas/anuladas → `Cancelada y anulada no cuentan`; cero → `Singular y cero`. ✓
