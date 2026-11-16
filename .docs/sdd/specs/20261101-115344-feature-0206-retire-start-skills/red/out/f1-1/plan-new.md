---
id: 20261101-121947-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: ambas tasks las hace la sesión en Native, en gama media (Sonnet, effort medium); son cambios de pocas líneas con el código y los tests casi dictados. La revisión final de rama va con `sdd-kit:effort-high`: Spec y Arquitectura con `opus`, Código con `sonnet`.
2. Ejecución: Native, fijado en `sdd-kit.json` (`execution: native`); no se pregunta.
3. Decisión técnica que la spec no fija: el motivo se guarda en el campo `reason` de la reserva y el estado sigue siendo `cancelled`; `canceladas` filtra por ese estado.
4. Los tests de `test/cancel.test.js` comparten la memoria del fichero (una sola reserva sembrada, Norte lun): el orden de declaración importa — los rechazos van antes de la cancelación que sí prospera.
5. Riesgo alto: ninguno. Coste estimado: 1 h de implementación, sin subagentes salvo la revisión final.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lista las canceladas con su motivo.

**Architecture**: un solo fichero, `src/app.js`. `cancelBooking` valida el motivo contra una constante y lo guarda en la reserva; `run` une lo que sigue al día para aceptar el motivo con o sin comillas; `canceladas` filtra las reservas `cancelled`.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y tests: ningún módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Los tres motivos, literales y en minúscula: `cambio de planes`, `sala ocupada`, `otro`; sin normalizar mayúsculas.
- Texto de la interfaz en castellano (Art. 4 de la constitution).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Sin dependencias nuevas.

### De proceso

- Política de modelos: gama media como suelo; `fable` y `opus xhigh` no se usan.
- Ejecución Native con ledger; un commit por task.
- Atribución de commits: la del kit (`Co-Authored-By`).

## Review Focus

- `cancelar Norte lun Otro` (mayúscula) → `motivo no válido: Otro; usa: cambio de planes, sala ocupada, otro`, y la reserva sigue activa · Task 1, `cancelar distingue mayúsculas del motivo`
- `cancelar Norte lun sala ocupada` sin comillas (varios argumentos) → cancela con el motivo `sala ocupada`, no `sala` · Task 1, `cancelar con motivo cancela la reserva`
- `anular Norte lun` y luego `canceladas` → `sin canceladas` · Task 2, `una anulada no sale en canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, un campo y un comando; nada más.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo lo declarado en la spec (cancelar sin motivo ya no cancela); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código; textos en castellano; gate de cierre `node --test && node scripts/lint.mjs`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — listado vacío y anulada, en su propio proceso.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking` con motivo, `canceladas`, rutas de `run`.
- `test/cancel.test.js` — tests de motivo; sustituye «cancelar una reserva activa».

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `scripts/lint.mjs` — solo mira tabuladores.

### 1.5 UX

Salida de terminal con los textos literales de la spec.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests de un mismo fichero | media | bajo | orden fijado en las decisiones; el listado vacío va en otro fichero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: el hilo principal en Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y commiteados con la task.

**Superficies**: backend · tooling
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun sala ocupada` y ve `cancelada Norte lun`; sin el motivo ve `indica un motivo: cambio de planes, sala ocupada, otro` y la reserva sigue.

**Interfaces**:
- Consume: nada
- Produce: `cancelBooking(room, day, reason)` con `reason` de tipo `string` (`''` si no se dio); `bookings[i].reason` en las reservas canceladas; la constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten memoria) y borrando «cancelar una reserva activa»:
  - `cancelar sin reserva lo dice` (el actual): `run('cancelar', ['Sur', 'mar'])` → `sin reserva Sur mar`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `indica un motivo: cambio de planes, sala ocupada, otro`; `run('libres', ['10:00-12:00'])` → `Sur`.
  - `cancelar con un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', 'vacaciones'])` → `motivo no válido: vacaciones; usa: cambio de planes, sala ocupada, otro`; `libres` → `Sur`.
  - `cancelar distingue mayúsculas del motivo`: `run('cancelar', ['Norte', 'lun', 'Otro'])` → `motivo no válido: Otro; usa: cambio de planes, sala ocupada, otro`.
  - `cancelar con motivo cancela la reserva`: `run('cancelar', ['Norte', 'lun', 'sala', 'ocupada'])` → `cancelada Norte lun`; `run('libres', ['10:00-12:00'])` → `Norte, Sur`.
- [ ] **Step 2: Ver los RED fallar** — `node --test test/cancel.test.js`. Esperado: fallan los tres de rechazo y el de motivo; el de «sin reserva» pasa.
- [ ] **Step 3: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` comprueba la reserva primero (`sin reserva <sala> <día>`), luego `reason === ''` (`indica un motivo: ${REASONS.join(', ')}`), luego que esté en `REASONS` (`motivo no válido: ${reason}; usa: ${REASONS.join(', ')}`), y si pasa fija `status = 'cancelled'` y `reason`; `run` pasa `params.slice(2).join(' ')` como tercer argumento.
- [ ] **Step 4: Build** — no hay build. Esperado: nada que construir.
- [ ] **Step 5: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — `feat: motivo al cancelar una reserva (0010)`, con el `Co-Authored-By` del kit.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: el hilo principal en Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js` y `test/canceladas.test.js`, escritos antes del código.

**Superficies**: backend · tooling
**Verificación**: `node --test test/cancel.test.js test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js canceladas` y ve `sin canceladas`.

**Interfaces**:
- Consume: `bookings[i].reason` y el estado `cancelled` de la Task 1
- Produce: el comando `canceladas`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/canceladas.test.js`

- [ ] **Step 1: Tests RED** — al final de `test/cancel.test.js`: `canceladas enseña el motivo`: `run('canceladas', [])` → `Norte lun 10:00-12:00 · motivo: sala ocupada`. En `test/canceladas.test.js`, en este orden: `sin canceladas el listado lo dice`: `run('canceladas', [])` → `sin canceladas`; `una anulada no sale en canceladas`: `run('anular', ['Norte', 'lun'])`, luego `run('canceladas', [])` → `sin canceladas`.
- [ ] **Step 2: Ver los RED fallar** — `node --test test/cancel.test.js test/canceladas.test.js`. Esperado: los tres fallan (el comando devuelve `salas`).
- [ ] **Step 3: Implementación** — en `src/app.js`: función `cancelledList()` que devuelve las reservas `cancelled` como líneas `${room} ${day} ${slot} · motivo: ${reason}` unidas por salto de línea, o `sin canceladas` si no hay; ruta `canceladas` en `run`.
- [ ] **Step 4: Build** — no hay build.
- [ ] **Step 5: Verificación** — `node --test test/cancel.test.js test/canceladas.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — `feat: listado de canceladas con su motivo (0010)`, con el `Co-Authored-By` del kit.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,6 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin referencia en estimation-log (no existe aún)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN `cancelada Norte lun` → Task 1, `cancelar con motivo cancela la reserva`. ✓
- Cancelar exige un motivo: AND `libres` pasa a `Norte, Sur` → Task 1, mismo test. ✓
- Sin motivo: THEN el mensaje y AND `libres` sigue `Sur` → Task 1, `cancelar sin motivo no cancela`. ✓
- Fuera de la lista: THEN, AND `libres`, AND `Otro` → Task 1, `…fuera de la lista no cancela` y `…distingue mayúsculas…`. ✓
- Sin reserva antes que el motivo → Task 1, `cancelar sin reserva lo dice`. ✓
- Listado con motivo → Task 2, `canceladas enseña el motivo`. ✓
- Listado vacío → Task 2, `sin canceladas el listado lo dice`. ✓
- Anuladas fuera → Task 2, `una anulada no sale en canceladas`. ✓
- Fila «cancelar sin motivo deja de cancelar» de la spec → Task 1 sustituye «cancelar una reserva activa». ✓
- Líneas del Review Focus → Task 1 y Task 2, tests nombrados arriba. ✓
