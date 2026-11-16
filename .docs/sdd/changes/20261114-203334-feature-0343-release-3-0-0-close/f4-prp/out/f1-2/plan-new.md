---
id: 20261116-135858-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en Sonnet, effort medium — cada task es una función corta con sus tests escritos en el plan; la revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en `sdd-kit.json` — dos tasks encadenadas por `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto.
3. `parseCancel` es una función interna de `src/app.js`, sin exportar: `run` la usa y los tests pasan por `run`.
4. El aviso de falta de motivo y el de motivo no válido comparten la constante `reasonHelp = 'elige cambio de planes, sala ocupada u otro'`.
5. Riesgos altos: ninguno; las reservas viven en memoria y no hay datos que migrar.
6. Coste estimado: ~1 h de implementación; sin despachos de subagentes.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista de tres y `canceladas` lista cada cancelación con su motivo.

**Architecture**: el motivo vive en la propia reserva (`reason`), como ya vive su estado; `cancelBooking` valida y guarda, `listCancelled` filtra por `status: 'cancelled'`. `resetBookings` permite sembrar reservas en los tests.

**Tech Stack**: Node 22, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y no añade módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Los motivos son exactamente `cambio de planes`, `sala ocupada` y `otro`, comparados literalmente.
- Los textos de aviso son los de «Reglas de la capacidad» de la spec, literales.
- Sin comentarios que repitan el código ni que citen documentos (constitución, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Tests antes que código; commits de task según `commit-milestones.md`, con el id 0010.
- Gate de cierre una sola vez, en §3.

## Review Focus

- `cancelar Norte lun --motivo ""` → `falta el motivo: …`, la reserva sigue activa · Task 1, `motivo vacío cuenta como ausente`
- `cancelar Norte lun --motivo --otro` → `motivo no válido: "--otro"; …` · Task 1, `valor que empieza por -- es no válido`
- `canceladas` tras anular y cancelar en orden inverso al de guardado → solo las canceladas, en el orden de las reservas · Task 2, `canceladas respeta el orden de las reservas y excluye anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo en la reserva es la opción más simple (Approach A).
- [x] **YAGNI gate**: ninguna abstracción nueva; `parseCancel` tiene un solo uso y se justifica por aislar el parseo.
- [x] **Brownfield gate**: `cancelar <sala> <día>` sin motivo cambia a propósito (decisión 4 de la spec); `anular` y `libres` no se tocan.
- [x] **Constitution check**: tests antes que código y texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `bookings` pasa a `let`; `resetBookings`, `parseCancel`, `cancelBooking` con motivo, `listCancelled` y el comando `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests actuales pasan a la forma con motivo; tests nuevos de cada escenario.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `ROADMAP.md`, `CHANGELOG.md` — los toca el cierre y el corte de la release.

### 1.2 a 1.6

No aplican (sin datos persistentes, migraciones, API ni pantalla).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests que se contaminan por reservas compartidas en el proceso | media | tests intermitentes | `resetBookings()` en cada test de `cancel.test.js` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la sesión lo hace sola; sirve de referencia).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend (CLI), tooling (lint).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`.
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime `cancelada Norte lun (sala ocupada)`; sin `--motivo` imprime `falta el motivo: elige cambio de planes, sala ocupada u otro`.

**Interfaces**:
- Consume: `run(cmd, params)`, `findBooking(room, day)` y `freeRooms(slot)` de `src/app.js`.
- Produce: `resetBookings(list?)`, `cancelBooking(room, day, reason)` (la reserva cancelada guarda `reason`) y `parseCancel(params) → { room, day, reason }`, que quita `--motivo` y su valor de los parámetros.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `beforeEach(() => resetBookings())` y `import { run, resetBookings } from '../src/app.js'`. Un test por cláusula de la spec, con estos asserts:
  - `cancelar con motivo`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` = `cancelada Norte lun (sala ocupada)`; `run('libres', ['10:00-12:00'])` = `Norte, Sur`; `run('canceladas', [])` = `Norte lun · sala ocupada` (este último aserto lo verifica la Task 2: aquí solo los dos primeros).
  - `los otros dos motivos`: `cambio de planes` y `otro` responden `cancelada Norte lun (cambio de planes)` y `cancelada Norte lun (otro)` (con `resetBookings()` entre ambos).
  - `sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` = `falta el motivo: elige cambio de planes, sala ocupada u otro`; `libres` sigue `Sur`.
  - `motivo vacío cuenta como ausente`: `['Norte','lun','--motivo','']` = el mismo aviso. `--motivo` último sin valor: igual.
  - `motivo fuera de la lista`: `--motivo me aburro` = `motivo no válido: "me aburro"; elige cambio de planes, sala ocupada u otro`; `libres` sigue `Sur`. `Otro` = `motivo no válido: "Otro"; …`. Sin comillas (`['Norte','lun','--motivo','sala','ocupada']`) = `motivo no válido: "sala"; …`.
  - `valor que empieza por -- es no válido`: `--motivo --otro` = `motivo no válido: "--otro"; …`.
  - `el motivo se comprueba antes que la reserva`: `run('cancelar', ['Sur','mar'])` = el aviso de falta de motivo.
  - `reserva no activa`: `['Sur','mar','--motivo','otro']` = `sin reserva Sur mar`; cancelar `Norte lun` dos veces con motivo válido da `sin reserva Norte lun` la segunda.
  Los dos tests actuales de `test/cancel.test.js` desaparecen: los sustituyen `cancelar con motivo` y `reserva no activa`. Ejecuta y comprueba que fallan por la razón esperada (`resetBookings` no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: `let bookings = seed()` con `seed()` que devuelve la reserva `Norte lun 10:00-12:00` activa; `export function resetBookings(list = seed())` copia cada reserva; `const reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `reasonHelp`; `parseCancel`; `cancelBooking(room, day, reason)` valida primero (`falta el motivo: ${reasonHelp}` si `reason` es undefined o vacío; `motivo no válido: "${reason}"; ${reasonHelp}` si no está en `reasons`), después `findBooking`, y al cancelar guarda `booking.reason = reason` y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` usa `parseCancel`.
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación»; esperado verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear hasta el commit de la task.

**Superficies**: backend (CLI), tooling (lint).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`.
**Se prueba en la aplicación**: `node src/app.js canceladas` imprime `sin canceladas` al arrancar.

**Interfaces**:
- Consume: `resetBookings(list)`, `cancelBooking` y el campo `reason` de la Task 1.
- Produce: `listCancelled() → string` y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas lista el motivo guardado`: tras cancelar `Norte lun` con cada motivo (reseteando entre ellos), `run('canceladas', [])` = `Norte lun · sala ocupada`, `Norte lun · cambio de planes` y `Norte lun · otro` respectivamente.
  - `sin canceladas`: `run('canceladas', [])` = `sin canceladas`; también tras un `cancelar` sin motivo.
  - `canceladas respeta el orden de las reservas y excluye anuladas`: `resetBookings([Sur mar, Norte lun, Norte mié])` (los tres `10:00-12:00` salvo `Norte mié`, `14:00-16:00`, todos activos); cancelar `Norte lun` con `sala ocupada` y luego `Sur mar` con `otro`; `anular Norte mié`; `run('canceladas', [])` = `Sur mar · otro\nNorte lun · sala ocupada`.
  - `canceladas ignora argumentos`: `run('canceladas', ['x'])` igual que sin ellos.
  Ejecuta y comprueba que fallan (devuelven `salas`).
- [ ] **Step 2: Implementación** — `listCancelled()` filtra `status === 'cancelled'`, une `${room} ${day} · ${reason}` con `\n`, y devuelve `sin canceladas` si no hay ninguna; `run` responde `canceladas` con ella.
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación»; esperado verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): comando canceladas con el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero; sin referencias en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN (respuesta, `libres`, `canceladas`) → Task 1 `cancelar con motivo` (respuesta y `libres`) y Task 2 `canceladas lista el motivo guardado` (`canceladas`). ✓
- Los otros dos motivos: AND → Task 1 `los otros dos motivos` y Task 2 `canceladas lista el motivo guardado`. ✓
- Sin motivo: THEN y AND (último parámetro, vacío) → Task 1 `sin motivo no cancela`, `motivo vacío cuenta como ausente`; `canceladas` = `sin canceladas` → Task 2 `sin canceladas`. ✓
- Motivo fuera de la lista: THEN y los dos AND → Task 1 `motivo fuera de la lista`. ✓
- Motivo antes que reserva → Task 1 `el motivo se comprueba antes que la reserva`. ✓
- Reserva no activa y doble cancelación → Task 1 `reserva no activa`. ✓
- Listado: THEN, AND `sin canceladas`, AND argumentos → Task 2 `canceladas respeta el orden…`, `sin canceladas`, `canceladas ignora argumentos`. ✓
- Reglas de la capacidad (tres motivos, avisos, comprobación previa) → los textos literales de las Tasks 1 y 2. ✓
- Filas «lo que se retira o cambia de forma» → Task 1 sustituye los dos tests de `test/cancel.test.js`. ✓
- `anular` sin cambios → N/A (confirmado en spec). ✓
- Review Focus → Task 1 `motivo vacío cuenta como ausente` y `valor que empieza por -- es no válido`; Task 2 `canceladas respeta el orden…`. ✓
