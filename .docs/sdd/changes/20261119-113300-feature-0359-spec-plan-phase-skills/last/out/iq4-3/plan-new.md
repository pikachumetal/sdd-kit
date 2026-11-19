---
id: 20261119-183945-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en la sesión (Native), Sonnet con effort medium — cambios de ~15 líneas con firmas y tests dados; la revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en `sdd-kit.json` — 2 tasks en un solo fichero de código.
3. Estado de los tests: cada test usa su propio día para no heredar reservas de otro (la lista `bookings` es del módulo y la reserva inicial es Norte lun, que ningún test nuevo cuenta); ningún test nuevo reserva Sur en `10:00-12:00`, para no romper el test de `libres`.
4. Sin cambio en `scripts/lint.mjs` ni en `package.json`.
5. Coste: ~0,5 h de implementación; sin subagentes salvo la revisión final de rama (3 ejes, ~0,5 $ a ojo).
6. Riesgo alto: ninguno. Riesgo menor: que `reservar` con tres argumentos y `--cada-semana` cambie de rama; lo fija un test en la Task 1.
7. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `reservar <sala> <día> <franja>` crea una reserva y avisa cuando la sala llega a 3 o más reservas activas ese día.

**Architecture**: dos cambios en `src/app.js`: una función pura `activeCount` y una función `bookRoom` que `run` invoca cuando `reservar` trae sala, día y franja. El aviso se añade a la confirmación sin bloquearla.

**Tech Stack**: Node 22 sin dependencias; `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: ni módulo nuevo, ni dependencia, ni contrato entre módulos o datos (la forma `{room, day, slot, status}` de la reserva ya existe).

## Restricciones globales

### De código

- Textos de la interfaz en castellano (constitution, art. 4); confirmación `reservada <sala> <día> <franja>` y aviso ` · aviso: <sala> muy ocupada el <día> (<n> reservas)`, literales de la spec.
- Umbral: `BUSY_THRESHOLD = 3`; cuentan solo reservas con `status === 'active'` de la misma sala y día, comparados como cadena exacta.
- Sin dependencias externas; un solo fichero de entrada `src/app.js`; sin tabuladores (lo mira `scripts/lint.mjs`).
- La constitution no tiene artículo de calidad de código: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2); cada task verifica lo suyo y el gate completo corre una vez, en §3.
- Git-flow: commits en `feature/0012-aviso-sala-ocupada`, referenciando 0012.

## Review Focus

- `reservar Norte lun 14:00-16:00 --cada-semana` (con sala, día y franja) → sigue siendo `reserva semanal creada`, no una reserva puntual · Task 1, `reservar con --cada-semana sigue siendo semanal`
- Reservas idénticas (misma sala, día y franja) → cuentan por separado y pueden disparar el aviso · Task 2, `reservas idénticas cuentan por separado`
- La cuarta reserva del día → `(4 reservas)`: el aviso sigue y no bloquea · Task 2, `la cuarta reserva sigue avisando con su cuenta`
- `reservar` sin argumentos → `salas`, sin crear nada · Task 1, `reservar sin argumentos cae en salas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante y dos funciones en el fichero existente.
- [x] **YAGNI gate**: sin umbral configurable ni módulo aparte.
- [x] **Brownfield gate**: retrocompatible (`libres`, `cancelar`, `anular` y `--cada-semana` no cambian); sigue el patrón de `src/app.js`.
- [x] **Constitution check**: tests primero, gate de cierre, git-flow y castellano respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `BUSY_THRESHOLD`, `activeCount`, `bookRoom` y la rama de `reservar` en `run`.
- `test/app.test.js` — tests de reservar y del aviso.
- `test/cancel.test.js` — tests de canceladas y anuladas que no cuentan.

**NO se tocan**:

- `scripts/lint.mjs`, `package.json` — sin cambio de herramientas.
- `.docs/sdd/steering/*` — el comportamiento vive en la capacidad `room-booking`, que crea el cierre.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La rama nueva de `reservar` pisa `--cada-semana` | baja | medio | `--cada-semana` se evalúa primero; test en la Task 1 |
| Estado compartido entre tests del mismo fichero | media | bajo | un día distinto por test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Reservar una sala

**Tras**: —
**Modelo**: Native, la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/app.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js reservar Norte mar 09:00-10:00` imprime `reservada Norte mar 09:00-10:00`; `node src/app.js reservar Norte mar` imprime `salas`.

**Interfaces**:
- Consume: lista `bookings` de `{room, day, slot, status}` y `run(cmd, params)` de `src/app.js`; la rama `--cada-semana` existente.
- Produce: `bookRoom(room, day, slot)` → `string`, `reservada <sala> <día> <franja>` tras añadir `{ room, day, slot, status: 'active' }` a `bookings`; `run('reservar', [sala, día, franja])` la invoca.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js` (importa `run` como ahora):
  - `reservar crea la reserva`: `run('reservar', ['Norte','mar','09:00-10:00'])` es `'reservada Norte mar 09:00-10:00'`, y `run('cancelar', ['Norte','mar'])` es `'cancelada Norte mar'` (prueba que existe).
  - `reservar sin franja cae en salas`: `run('reservar', ['Norte','jue'])` es `'salas'` y `run('cancelar', ['Norte','jue'])` es `'sin reserva Norte jue'`.
  - `reservar sin argumentos cae en salas`: `run('reservar', [])` es `'salas'`.
  - `reservar con --cada-semana sigue siendo semanal`: `run('reservar', ['Norte','lun','14:00-16:00','--cada-semana'])` es `'reserva semanal creada'`.
- [ ] **Step 2: Rojo** — `NO_COLOR=1 node --test test/app.test.js`. Esperado: falla el primero; el resto ya pasa y documenta lo que no debe romperse.
- [ ] **Step 3: Implementación** — en `src/app.js`: `function bookRoom(room, day, slot)` que añade la reserva activa y devuelve el texto de la spec; en `run`, tras la línea de `--cada-semana`, `if (cmd === 'reservar')` con sala, día y franja presentes → `bookRoom(...)`; si falta alguno, sigue cayendo en `'salas'`.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0012): reservar crea una reserva` (uno solo al quedar limpia su revisión).

### Task 2 — Aviso de sala muy ocupada

**Tras**: Task 1
**Modelo**: Native, la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/app.test.js`, `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/app.test.js test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque la reserva vive en memoria y cada `node src/app.js` empieza de cero: el aviso solo se ve encadenando llamadas dentro de `run`, que es lo que ejercen los tests.

**Interfaces**:
- Consume: `bookRoom(room, day, slot)` de la Task 1; `cancelar` y `anular` ya existentes (cambian el `status` de la primera reserva activa de la sala y día a `cancelled` / `voided`).
- Produce: `BUSY_THRESHOLD = 3`; `activeCount(room, day)` → `number` de reservas con `status === 'active'` de esa sala y día; `bookRoom` añade ` · aviso: <sala> muy ocupada el <día> (<n> reservas)` a la confirmación cuando `activeCount` (con la nueva ya añadida) ≥ `BUSY_THRESHOLD`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED**, cada uno con su día propio. Con `res = (d, s) => run('reservar', ['Norte', d, s])`:
  - `avisa al llegar a 3` (`mie`): `res('mie','08:00-09:00')` y `res('mie','09:00-10:00')` sin aviso; la tercera, `res('mie','14:00-16:00')`, es `'reservada Norte mie 14:00-16:00 · aviso: Norte muy ocupada el mie (3 reservas)'`.
  - `sin aviso bajo el umbral` (`vie`): la segunda reserva del día es `'reservada Norte vie 14:00-16:00'`.
  - `la cuarta reserva sigue avisando con su cuenta` (`sab`): la cuarta termina en `(4 reservas)`.
  - `reservas idénticas cuentan por separado` (`dom`): tres `res('dom','10:00-12:00')` iguales; la tercera lleva `(3 reservas)`.
  - `otra sala no cuenta` (`jue`): dos `run('reservar', ['Sur','jue', …])` y luego `res('jue','14:00-16:00')` es `'reservada Norte jue 14:00-16:00'`.
  - `otro día no cuenta` (`d1`, `d2`): dos reservas de Norte el `d1`, y `res('d2','14:00-16:00')` es `'reservada Norte d2 14:00-16:00'`.
  - En `test/cancel.test.js`, `las canceladas no cuentan` (`mar`): una reserva, `cancelar Norte mar`, otras dos, y la tercera nueva termina en `aviso: Norte muy ocupada el mar (3 reservas)`; `las anuladas no cuentan` (`mie`): una reserva, `anular Norte mie`, una activa y otra: la última es `'reservada Norte mie 14:00-16:00'`, sin aviso.
- [ ] **Step 2: Rojo** — `NO_COLOR=1 node --test test/app.test.js test/cancel.test.js`. Esperado: fallan los que esperan aviso (`avisa…`, `cuarta…`, `idénticas…`, `canceladas…`); los de «sin aviso» ya pasan.
- [ ] **Step 3: Implementación** — `const BUSY_THRESHOLD = 3` y `function activeCount(room, day)` en `src/app.js`; `bookRoom` añade el aviso con el texto literal de la spec.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0012): aviso de sala muy ocupada`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks, ~15 líneas de código y ~45 de tests en un fichero; sin incertidumbres técnicas; sin entradas en el log de calibración.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): la reserva que alcanza 3 lleva el aviso; con menos, no
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Reservar una sala: THEN `reservada Norte mar 09:00-10:00` → Task 1, `reservar crea la reserva`. ✓
- Aviso: THEN con `(3 reservas)` y reserva hecha → Task 2, `avisa al llegar a 3`. ✓
- Sin aviso bajo el umbral → Task 2, `sin aviso bajo el umbral`. ✓
- Las canceladas no cuentan → Task 2, `las canceladas no cuentan`. ✓
- Las anuladas no cuentan → Task 2, `las anuladas no cuentan`. ✓
- Otra sala no cuenta → Task 2, `otra sala no cuenta`. ✓
- Otro día no cuenta → Task 2, `otro día no cuenta`. ✓
- Faltan argumentos → Task 1, `reservar sin franja cae en salas` y `reservar sin argumentos cae en salas`. ✓
- Decisión 8 (idénticas cuentan por separado) → Task 2, `reservas idénticas cuentan por separado`. ✓
- Fila «`reservar` sin `--cada-semana` deja de caer en `salas`» → Task 1, `reservar crea la reserva`. ✓
- `--cada-semana`, `libres` y `cancelar` sin cambios → N/A (confirmado en spec); `--cada-semana` lo guarda `reservar con --cada-semana sigue siendo semanal`. ✓
- Review Focus → Tasks 1 y 2 (cuatro tests nombrados arriba). ✓
