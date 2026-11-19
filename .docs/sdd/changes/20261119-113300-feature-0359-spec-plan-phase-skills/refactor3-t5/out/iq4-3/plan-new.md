---
id: 20261119-165657-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: ambas `sdd-kit:effort-medium` + `sonnet` (en Native las hace el hilo; la revisión final va con el modelo de `sdd-verify`: Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`) — el plan trae firmas, textos y tests; no hay interpretación de prosa.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks**: la 1 crea `reservar` y la 2 añade el aviso; un revisor puede aprobar la creación y rechazar el conteo.
4. **Aislamiento de tests**: `bookings` es estado de módulo y no se exporta; cada test usa un día propio (`mar`, `mie`…) y siembra con `run('reservar', …)`; no se añade ningún `reset` a `src/app.js` (YAGNI).
5. **Gate de cierre**: `node --test && node scripts/lint.mjs`, literal de `operations.md`.
6. **Coste**: ~0,5 h de implementación; sin subagentes, solo la revisión final.
- Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `reservar <sala> <día> <franja>` crea la reserva y avisa si la sala llega a 4 reservas activas ese día.

**Architecture**: dos funciones en `src/app.js` (`bookRoom`, `activeCount`) y una rama nueva en `run`, después de la de `--cada-semana`. El aviso se compone al reservar; nada se persiste.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia un fichero (`src/app.js`), sin módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Textos de la interfaz en castellano (constitution §4).
- Tope `OCCUPANCY_THRESHOLD = 4`, constante en `src/app.js`; las reservas `cancelled` y `voided` no cuentan.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones pequeñas.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native, un commit por task al quedar limpia su revisión; mensajes en castellano con `feat:`; terminan con la línea de coautoría que dé el entorno.
- Modelos: ni `fable` ni `opus xhigh` en tasks.

## Review Focus

- `reservar Norte` (sin día ni franja) → `uso: reservar <sala> <día> <franja>`, no una reserva con `undefined` · Task 1, `reservar sin argumentos responde uso`
- `reservar norte mar 09:00-10:00` (minúscula) → `sala desconocida: norte` · Task 1, `reservar con sala en minúscula es desconocida`
- Dos reservas de la misma sala, día y franja → ambas se crean y cuentan (no hay validación de solapes, spec ✋ 8) · Task 2, `dos reservas iguales cuentan dos`
- `reservar Norte --cada-semana` → sigue `reserva semanal creada` · test existente `reservar --cada-semana crea la reserva semanal`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: contar activas con un `filter`, sin estructuras nuevas.
- [x] **YAGNI gate**: ninguna abstracción con menos de 3 usos.
- [x] **Brownfield gate**: `libres`, `cancelar`, `anular` y `--cada-semana` no cambian.
- [x] **Constitution check**: tests antes que código (§2), castellano (§4), flujo SDD (§1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `bookRoom`, `activeCount`, constante y rama de `run`.
- `test/app.test.js` — tests de `reservar`.

**NO se tocan**:

- `test/cancel.test.js` — ya cubre cancelar y anular.
- `scripts/lint.mjs` — sin cambios.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests | media | falsos verdes/rojos | un día distinto por test |
| La rama nueva de `reservar` tapa `--cada-semana` | baja | rompe el test existente | va después de la rama semanal |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `reservar` crea la reserva y valida sus argumentos

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/app.test.js`

**Superficies**: backend
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js reservar Norte mar 09:00-10:00` imprime `reservada Norte mar 09:00-10:00`.

**Interfaces**:
- Consume: `rooms`, `bookings` (`{ room, day, slot, status }`) y `cancelBooking(room, day)` de `src/app.js`.
- Produce: `bookRoom(room, day, slot): string` (texto de la reserva o del error, sin aviso aún); rama `run('reservar', [sala, día, franja])` tras la de `--cada-semana`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js` (importando `run`):
  - `reservar crea la reserva`: `run('reservar', ['Norte','mar','09:00-10:00'])` → `'reservada Norte mar 09:00-10:00'`; después `run('cancelar', ['Norte','mar'])` → `'cancelada Norte mar'`.
  - `reservar sin argumentos responde uso`: `run('reservar', ['Norte','mar'])` → `'uso: reservar <sala> <día> <franja>'`; y `run('cancelar', ['Norte','mar'])` → `'sin reserva Norte mar'` (la del test anterior ya está cancelada y esta no se creó).
  - `reservar con sala desconocida`: `run('reservar', ['Este','mar','09:00-10:00'])` → `'sala desconocida: Este'`.
  - `reservar con sala en minúscula es desconocida`: `['norte','mar','09:00-10:00']` → `'sala desconocida: norte'`.
  - `uso gana a sala desconocida`: `run('reservar', ['Este'])` → `'uso: reservar <sala> <día> <franja>'`.
- [ ] **Step 2: Ejecutar y ver el rojo**: `node --test test/app.test.js` → fallan los nuevos.
- [ ] **Step 3: Código**: `bookRoom(room, day, slot)` en `src/app.js`: sin los tres argumentos → `uso: reservar <sala> <día> <franja>`; sala fuera de `rooms` (sensible a mayúsculas) → `sala desconocida: <sala>`; si no, añade `{ room, day, slot, status: 'active' }` a `bookings` y devuelve `reservada <sala> <día> <franja>`. En `run`, la rama `cmd === 'reservar'` va **después** de la de `--cada-semana`.
- [ ] **Step 4: Verificación**: `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task**: `feat: reservar crea la reserva (0012)`.

### Task 2 — Aviso de sala muy ocupada

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/app.test.js`

**Superficies**: backend
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada invocación de `node src/app.js` arranca con las reservas en memoria vacías (salvo la de ejemplo): el aviso solo se ve encadenando llamadas a `run` en un mismo proceso; la validación del dev-lead usa un script corto de `run` (spec «Validación: dev-lead»).

**Interfaces**:
- Consume: `bookRoom(room, day, slot): string` de la Task 1.
- Produce: `OCCUPANCY_THRESHOLD = 4`; `activeCount(room, day): number`; `bookRoom` añade, tras `reservada …`, una segunda línea `aviso: <sala> está muy ocupada el <día> (<n> reservas)` si `activeCount(room, day) >= OCCUPANCY_THRESHOLD`, unidas por salto de línea.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** (un día propio cada uno, sembrando con `run('reservar', …)`; el último `reservar` de cada caso es el que se comprueba):
  - `avisa al llegar a 4` (`mie`): 3 reservas de Norte con franjas `09:00-10:00`, `10:00-11:00`, `11:00-12:00`; la 4.ª `14:00-15:00` → `'reservada Norte mie 14:00-15:00\naviso: Norte está muy ocupada el mie (4 reservas)'`.
  - `avisa por encima del tope` (`jue`): 4 previas, la 5.ª → termina en `(5 reservas)`.
  - `dos reservas iguales cuentan dos` (`vie`): la misma franja 4 veces, la 4.ª avisa `(4 reservas)`.
  - `no avisa por debajo del tope` (`sab`): 1 previa; la 2.ª → `'reservada Norte sab 14:00-15:00'`; y `cancelar Norte sab` → `'cancelada Norte sab'`.
  - `canceladas y anuladas no cuentan` (`dom`): 4 reservas; `cancelar` y `anular` de Norte dom (quedan 2 activas); la siguiente → solo `reservada …`, sin aviso.
  - `el aviso es por sala` (`d7`): 4 de Norte; `reservar Sur d7 14:00-15:00` → solo `reservada Sur d7 14:00-15:00`.
  - `el aviso no cruza días` (`d8`, `d9`): 4 de Norte en `d8`; `reservar Norte d9 14:00-15:00` → solo `reservada …`.
- [ ] **Step 2: Ejecutar y ver el rojo**: solo fallan los que esperan aviso.
- [ ] **Step 3: Código**: `activeCount(room, day)` cuenta `bookings` con esa sala, día y `status === 'active'`; `bookRoom` la usa tras crear la reserva.
- [ ] **Step 4: Verificación**: `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task**: `feat: avisa de sala muy ocupada al reservar (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks sobre un fichero, tests simples; sin referencia en el log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Aviso al llegar a 4 (THEN y AND «reserva creada») → Task 2, `avisa al llegar a 4`. ✓
- Aviso por encima (`(5 reservas)`) → Task 2, `avisa por encima del tope`. ✓
- Sin aviso por debajo + reserva creada → Task 2, `no avisa por debajo del tope` (`cancelar` prueba la creación). ✓
- Canceladas y anuladas no cuentan + reserva creada → Task 2, `canceladas y anuladas no cuentan`. ✓
- Reservar crea y valida argumentos (THEN y AND) → Task 1, los cinco tests. ✓
- Por sala / no cruza días → Task 2, `el aviso es por sala`, `el aviso no cruza días`. ✓
- `--cada-semana` intacto (No entra) → test existente. ✓
- `libres`, `cancelar`, `anular` sin cambios → tests existentes. ✓
- Review Focus (4 líneas) → Tasks 1 y 2 con los tests nombrados. ✓
