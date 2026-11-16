---
id: 20261116-120120-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Task 1 y Task 2 en gama media (Sonnet, effort medium) — el cuerpo está fijado por la firma y los tests; la revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura opus+high, Código sonnet+high) aunque sea Native.
2. Ejecución: native, porque 2 tasks encadenadas por `cancelBooking` y el estado `cancelled`, un error lo caza el test de su task y el plan cabe en un contexto.
3. Task 1 lleva la validación del motivo y la actualización de los dos tests existentes; Task 2, el listado y el CHANGELOG. Cada una acaba en algo que se prueba por `run(...)`.
4. La lista de motivos y sus etiquetas viven en una sola constante `REASONS` de `src/app.js` (fuente única de la regla «Límites»); el aviso se construye con sus claves.
5. Riesgos altos: ninguno. Coste estimado: ~1 h (ver «Estimación y esfuerzo»).
6. Review Focus: 5 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y la reserva lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` gana una constante `REASONS`, un tercer parámetro en `cancelBooking` y una función `listCancelled`; `run` enruta `canceladas`. Los tests se quedan en `test/cancel.test.js`, la costura existente.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por `cancelBooking` y el estado `cancelled`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y sus tests; ni módulo, ni dependencia, ni contrato entre módulos o datos nuevo.

## Restricciones globales

### De código

- Los tres motivos son `cambio-de-planes`, `sala-ocupada`, `otro`; etiquetas `cambio de planes`, `sala ocupada`, `otro`; aviso literal `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
- Texto de la interfaz en castellano (constitution, Art. IV).
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); clean code.

### De proceso

- Tests antes que código (constitution, Art. II); gate de cierre una sola vez, en §3.
- Un commit por task, con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` al final.
- Git-flow: rama `feature/0010-motivo-cancelar`.

## Review Focus

- `cancelar Norte lun` (sin motivo) con la reserva activa → error del motivo y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar` sin motivo y sin reserva → error del motivo, no `sin reserva` · Task 1, `el motivo se valida antes que la reserva`
- `cancelar Norte lun sala-ocupada` sobre una ya cancelada → `sin reserva Norte lun` y motivo original intacto · Task 1, `cancelar dos veces no cambia el motivo`
- `canceladas` con una cancelada, una activa y una anulada → solo la cancelada · Task 2, `canceladas excluye activas y anuladas`
- `Sala-Ocupada` (mayúsculas) → motivo no válido · Task 1, `el motivo distingue mayúsculas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un atributo de la reserva; sin registro aparte.
- [x] **YAGNI gate**: una constante, sin abstracciones.
- [x] **Brownfield gate**: respeta el patrón de `src/app.js`; sin refactor fuera de scope; el cambio de forma de `cancelar` está declarado en la spec.
- [x] **Constitution check**: Art. II (tests primero), III (git-flow), IV (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `src/app.js` — `export const bookings` (costura de test), `REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()`, rama `canceladas` en `run`.
- `test/cancel.test.js` — tests de los escenarios; actualiza los dos existentes.
- `CHANGELOG.md` — entrada en `### Added` (Task 2).

**NO se tocan**:

- `scripts/lint.mjs` — sigue valiéndole el lint actual.
- `anular` / `voidBooking` — fuera de scope (fila 0011).
- `README.md`, `PRODUCT.md` — sin cambios de términos.

### 1.2 Modelo de datos

La reserva en memoria gana `reason` (la clave de `REASONS`) al cancelarse.

### 1.3 Migraciones

N/A (sin base de datos).

### 1.4 Contratos API

`cancelar <sala> <día> <motivo>` y `canceladas`; respuestas literales en la spec.

### 1.5 UX

Texto de terminal; sin `§Frontend`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El test existente `cancelar Sur mar` cambia de significado | Alta | Bajo | Task 1 lo actualiza a `cancelar Sur mar otro` y añade el de «sin motivo» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la propia sesión en gama media).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, docs (no aplica a docs en esta task).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin motivo ve `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reason)` que guarda `booking.reason = reason`; las reservas canceladas llevan `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `import { run } from '../src/app.js'` y un `node:test` por escenario (cada test parte de las reservas en memoria del módulo; como el estado es compartido, cada test usa su sala/día propio o el orden está fijado por el nombre del fichero: ver Nota):
  - `cancelar con motivo` → `run('cancelar', ['Norte','lun','sala-ocupada'])` = `cancelada Norte lun (sala ocupada)`.
  - `cancelar sin motivo no cancela` → `run('cancelar', ['Norte','lun'])` = `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`; después `run('libres', ['10:00-12:00'])` sigue sin `Norte`.
  - `el motivo de la lista` → `lluvia` da el mismo aviso; `Sala-Ocupada` también.
  - `el motivo se valida antes que la reserva` → `run('cancelar', ['Sur','mar'])` = el aviso.
  - `sin reserva` → `run('cancelar', ['Sur','mar','otro'])` = `sin reserva Sur mar`.
  - `cancelar dos veces no cambia el motivo` → tras cancelar Norte lun con `otro`, `cancelar Norte lun sala-ocupada` = `sin reserva Norte lun`.
  - `etiquetas` → `cambio-de-planes` → `(cambio de planes)`, `otro` → `(otro)`.

  Aislamiento: `src/app.js` exporta `bookings` (`export const bookings`) como costura de test; un `beforeEach` hace `bookings.splice(0, bookings.length, { room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' })` para partir siempre de la reserva sembrada.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: los tests nuevos fallan, por el motivo esperado.
- [ ] **Step 3: Implementación** — en `src/app.js`: `const REASONS = {...}`; `cancelBooking(room, day, reason)`: si `!Object.hasOwn(REASONS, reason)` devuelve `` `motivo no válido: usa ${keys con ', ' salvo el último con ' u '}` `` (literal de la spec); luego busca la reserva; `sin reserva …` como hoy; al cancelar `booking.status = 'cancelled'; booking.reason = reason;` y devuelve `` `cancelada ${room} ${day} (${REASONS[reason]})` ``. `run` pasa `params[2]`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): motivo obligatorio al cancelar una reserva`.

### Task 2 — Listar canceladas

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la propia sesión).
**Tests RED**: hilo principal · `test/cancel.test.js`.

**Superficies**: backend, docs.
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ve `Norte lun 10:00-12:00 — cambio de planes` con `canceladas` tras cancelar; `sin canceladas` si no hay ninguna.

**Interfaces**:
- Consume: `REASONS`, `booking.reason`, `status` (`cancelled` / `voided` / `active`).
- Produce: `listCancelled()` → string con una línea por cancelada `<sala> <día> <franja> — <etiqueta>`, en el orden de `bookings`, o `sin canceladas`; rama `if (cmd === 'canceladas') return listCancelled();` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `CHANGELOG.md`

- [ ] **Step 1: Tests RED** — `canceladas` sin canceladas = `sin canceladas`; con Norte lun cancelada por `cambio-de-planes` = `Norte lun 10:00-12:00 — cambio de planes`; `canceladas excluye activas y anuladas` y orden (varias): las reservas extra (Sur mar, Norte mie) se añaden a `bookings` en el propio test; una anulada con `run('anular', ['Norte','lun'])` → `sin canceladas`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`.
- [ ] **Step 3: Implementación** — `listCancelled()` filtra `status === 'cancelled'` y une con `\n`; `CHANGELOG.md`: bajo `### Added`, `- Motivo al cancelar una reserva y listado de canceladas (\`salas canceladas\`). [feature 0010](.docs/sdd/changes/20261116-120120-feature-0010-motivo-cancelar/)`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): listado de reservas canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0,7h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 2 tasks pequeñas sobre un fichero de ~30 líneas, referencia task 0006 y patch 0007
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo (THEN + AND) → Task 1, `cancelar con motivo` (el AND, `canceladas` en Task 2). ✓
- Etiquetas de cambio de planes y de otro → Task 1, `etiquetas`. ✓
- Motivo obligatorio / de la lista (+ mayúsculas) → Task 1, `cancelar sin motivo no cancela`, `el motivo de la lista`. ✓
- Motivo antes que reserva → Task 1, `el motivo se valida antes que la reserva`. ✓
- Cancelar sin reserva → Task 1, `sin reserva`. ✓
- Cancelar dos veces (THEN + AND motivo intacto) → Task 1, `cancelar dos veces no cambia el motivo` (el AND se observa con `canceladas` tras la segunda llamada, en Task 2). ✓
- Listar canceladas, varias, sin canceladas, anuladas → Task 2. ✓
- Entrada de CHANGELOG (decisión 14) → Task 2, Step 3. ✓
- Review Focus → cubierto arriba. ✓
