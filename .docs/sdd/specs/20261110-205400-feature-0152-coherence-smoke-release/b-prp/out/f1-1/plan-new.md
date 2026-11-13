---
id: 20261111-085359-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en el hilo principal (Native), Sonnet con effort medium — son cambios de pocas líneas con los valores ya fijados en la spec. La revisión final va con sus ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`), también con dos tasks.
2. Ejecución: native, fijado en sdd-kit.json.
3. Las reservas viven en memoria y se comparten dentro de un mismo fichero de test, y solo hay una (`Norte lun`): cada escenario que la cancela con éxito necesita su propio proceso. Por eso los tests van en dos ficheros: `test/cancel.test.js` (escenarios que la dejan activa y el de `cambio de planes`, con su listado) y `test/canceladas.test.js` (el listado y `sala ocupada`) y orden fijo dentro de cada uno.
4. Coste estimado: 0,5 h de implementación; sin despachos de pago salvo la revisión final.
5. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar exige un motivo de una lista cerrada y `canceladas` lo muestra.

**Architecture**: una constante `CANCEL_REASONS` y un parámetro más en `cancelBooking` en `src/app.js`; una función `cancelledBookings()` y su rama en `run`. Sin módulos nuevos.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia una función y añade otra en `src/app.js`; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Los tres motivos, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `falta el motivo: elige cambio de planes, sala ocupada u otro` · `motivo no válido: elige cambio de planes, sala ocupada u otro` · `cancelada Norte lun (motivo: sala ocupada)` · `sin canceladas`.
- Texto de interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.

### De proceso

- Native: la sesión implementa cada task con TDD y un commit por task.
- Convención de commits: `feat: <qué>` (la del repo), con la atribución que pide la sesión.

## Review Focus

- `cancelar` sin ningún argumento → `falta el motivo: elige cambio de planes, sala ocupada u otro`, sin lanzar excepción · Task 1, `cancelar sin argumentos pide el motivo`
- Un motivo vacío o inválido no deja la reserva en `canceladas` · Task 1 (`cancelar sin motivo no cancela`) y Task 2 (`un motivo ausente o no válido no deja la reserva en canceladas`)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: argumento posicional y una constante; sin estructura nueva.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: sigue el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código; texto en castellano; flujo SDD.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — tests del comando `canceladas`, con estado limpio por ser otro proceso.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, ramas de `run`.
- `test/cancel.test.js` — los dos tests actuales llevan motivo; tests nuevos de motivo.

**NO se tocan**:

- `voidBooking` y `anular` — fila 0011.
- `PRODUCT.md` — el término «Cancelación» no cambia.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests de un mismo fichero | Alta | Bajo | Orden de tests y ficheros aparte (decisión 3) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun cambio de planes` y ve `cancelada Norte lun (motivo: cambio de planes)`.

**Interfaces**:
- Consume: nada.
- Produce: `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']` y `cancelBooking(room, day, reason)` en `src/app.js`; la reserva cancelada guarda `reason`. `run('cancelar', params)` llama `cancelBooking(params[0], params[1], params.slice(2).join(' '))`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: RED** — `test/cancel.test.js`, en este orden (el estado es compartido), con `run` como import actual:
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → `falta el motivo: elige cambio de planes, sala ocupada u otro`
  - `cancelar sin argumentos pide el motivo`: `run('cancelar', [])` → el mismo texto
  - `cancelar sin reserva y sin motivo pide el motivo`: `['Sur','mar']` → el mismo texto
  - `cancelar con un motivo fuera de la lista no cancela`: `['Norte','lun','porque','sí']` → `motivo no válido: elige cambio de planes, sala ocupada u otro`
  - `cancelar distingue mayúsculas en el motivo`: `['Norte','lun','Sala','ocupada']` → el mismo texto de motivo no válido
  - `cancelar sin reserva lo dice`: `['Sur','mar','otro']` → `sin reserva Sur mar`
  - `cancelar acepta un motivo de varias palabras` (cancela con éxito, va el último): `['Norte','lun','cambio','de','planes']` → `cancelada Norte lun (motivo: cambio de planes)`, y `run('canceladas', [])` → `Norte lun · cambio de planes`
  Ejecuta y comprueba que fallan.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)` valida primero el motivo (vacío → falta; fuera de `CANCEL_REASONS`, sensible a mayúsculas → no válido), después busca la reserva, guarda `booking.reason` y responde con el motivo entre paréntesis.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: motivo obligatorio al cancelar una reserva`, uno solo.

### Task 2 — Listar las canceladas con su motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/canceladas.test.js`, sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada `node src/app.js` empieza limpio: el listado se ve en los tests (`run`), no en dos ejecuciones sueltas de la terminal.

**Interfaces**:
- Consume: `cancelBooking(room, day, reason)` y `booking.reason` de la Task 1.
- Produce: `cancelledBookings()` en `src/app.js`, y `run('canceladas', [])` → líneas `<sala> <día> · <motivo>` unidas por salto de línea, o `sin canceladas`.

**Ficheros**: crear `test/canceladas.test.js`; modificar `src/app.js`

- [ ] **Step 1: RED** — `test/canceladas.test.js`, en este orden:
  - `sin canceladas lo dice`: `run('canceladas', [])` → `sin canceladas` (Norte lun sigue activa)
  - `un motivo ausente o no válido no deja la reserva en canceladas`: `run('cancelar', ['Norte','lun'])`, `['Norte','lun','porque','sí']` y `['Norte','lun','Sala','ocupada']`, y luego `run('canceladas', [])` → `sin canceladas`
  - `canceladas muestra el motivo`: `run('cancelar', ['Norte','lun','sala','ocupada'])` → `cancelada Norte lun (motivo: sala ocupada)`, y `run('canceladas', [])` → `Norte lun · sala ocupada`
  - `cancelar una reserva ya cancelada conserva el primer motivo`: `run('cancelar', ['Norte','lun','otro'])` → `sin reserva Norte lun`, y `run('canceladas', [])` → `Norte lun · sala ocupada`
- [ ] **Step 2: Implementación** — `cancelledBookings()` filtra `status === 'cancelled'` en orden de `bookings`; rama `canceladas` en `run`.
- [ ] **Step 3: Verificación** — `node --test test/canceladas.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: listar las reservas canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin histórico de calibración.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `cancelar Norte lun sala ocupada` → `cancelada Norte lun (motivo: sala ocupada)` y queda cancelada con ese motivo → Task 2, `canceladas muestra el motivo` (respuesta y listado). ✓
- `cancelar Norte lun cambio de planes` → `cancelada Norte lun (motivo: cambio de planes)` → Task 1, `cancelar acepta un motivo de varias palabras`. ✓
- `cancelar Norte lun` → `falta el motivo: …` → Task 1, `cancelar sin motivo no cancela`; AND `canceladas` → `sin canceladas` → Task 2, `sin canceladas lo dice`. ✓
- `cancelar Norte lun porque sí` → `motivo no válido: …` → Task 1, `cancelar con un motivo fuera de la lista no cancela`; AND `canceladas` → `sin canceladas` → Task 2, `un motivo ausente o no válido no deja la reserva en canceladas`. ✓
- `cancelar Norte lun Sala ocupada` → motivo no válido → Task 1, `cancelar distingue mayúsculas en el motivo`. ✓
- `cancelar Sur mar` → falta el motivo → Task 1, `cancelar sin reserva y sin motivo pide el motivo`. ✓
- `cancelar Sur mar otro` → `sin reserva Sur mar` → Task 1, `cancelar sin reserva lo dice`. ✓
- Cancelar una ya cancelada → `sin reserva Norte lun` y `canceladas` conserva `Norte lun · sala ocupada` → Task 2, `cancelar una reserva ya cancelada conserva el primer motivo`. ✓
- `canceladas` con una cancelada → `Norte lun · sala ocupada` → Task 2, `canceladas muestra el motivo`. ✓
- `canceladas` con Norte lun activa y ninguna cancelada → `sin canceladas` → Task 2, `sin canceladas lo dice`. ✓
- Fila 0011 / `anular` → N/A (fuera de scope en la spec). ✓
- Review Focus → Task 1 (`cancelar sin argumentos pide el motivo`, `cancelar sin motivo no cancela`) y Task 2 (`un motivo ausente o no válido no deja la reserva en canceladas`). ✓
