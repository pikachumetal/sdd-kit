---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: una sola task, hilo principal en Native (Sonnet, effort medium); el cambio es de un fichero y la plan trae firmas y asserts. La revisión final de rama va con los ejes de `sdd-verify` (Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Sin `--motivo` (o `--motivo` sin valor) responde lo mismo que un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». La spec solo fija el caso «fuera de la lista»; pedir el motivo es el objetivo de la feature, así que su ausencia no puede cancelar.
4. El motivo se valida antes de buscar la reserva: `cancelar Sur mar --motivo xx` responde «motivo no válido…», no «sin reserva…».
5. El texto de «cancelada» cambia a `cancelada <sala> <día> (<motivo>)`; el test existente `cancelar una reserva activa` (que esperaba `cancelada Norte lun`) se reescribe, no se mantiene. Es consecuencia directa de la spec.
6. `canceladas` sin ninguna cancelada responde `sin canceladas` (la spec no lo fija). Con varias, una línea por reserva, en orden de cancelación, separadas por `\n`. Las `voided` no entran (la spec dice «estado cancelada»); no se prueba porque la única reserva semilla no permite anular una y cancelar otra sin exportar código solo para tests.
7bis. El motivo se compara exacto, sin distinguir nada: `Sala Ocupada` es motivo no válido (lista cerrada).
7. Los tests comparten el estado en memoria de `src/app.js` y `node --test` ejecuta los tests de un fichero en orden: el orden de `test/cancel.test.js` importa (los que no cancelan, primero; el listado, después de la cancelación). No se añade export de reinicio: sería código solo para tests (YAGNI).
8. Coste estimado: ~1 h de implementación, sin subagentes de tarea.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
10. Commit de apertura: spec y plan van en un commit antes de los tests RED de la Task 1 (lo hace `sdd-implement`).

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `src/app.js` es el único fichero. La reserva cancelada guarda `reason`; `cancelBooking` valida el motivo antes de cancelar; `listCancelled` filtra por `status === 'cancelled'`; `run` lee `--motivo` de los parámetros y despacha `canceladas`.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia un fichero existente (`src/app.js`) y su test; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos cerrada, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: `cancelada Norte lun (sala ocupada)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `Norte lun — sala ocupada` (con raya larga `—`).
- Sin dependencias externas; Node 22.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2); gate de cierre: `node --test && node scripts/lint.mjs`.
- Git-flow: se trabaja en `feature/0010-cancel-reason`.
- Commits con la atribución que fije la sesión; un commit de apertura, uno por task y el de cierre.
- No se pasa un modelo por defecto distinto del declarado en la task.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (sin valor) → mismo mensaje que sin motivo · Task 1, `cancelar con --motivo sin valor no cancela`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → `sin reserva Sur mar`, y `canceladas` no la lista · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no una línea vacía · Task 1, `canceladas sin cancelaciones lo dice`
- `cancelar Norte lun --motivo "Sala Ocupada"` (otra capitalización) → «motivo no válido…», lista cerrada exacta · Task 1, `cancelar con otra capitalización lo rechaza`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, dos funciones nuevas o modificadas, sin abstracciones.
- [x] **YAGNI gate**: una constante `REASONS` y nada más; sin reinicio de estado para tests.
- [x] **Brownfield gate**: sigue el patrón de `app.js` (funciones exportadas + `run`); el único cambio incompatible es el texto de `cancelar`, que fija la spec; sin refactor fuera de scope (`voidBooking` queda igual).
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — motivo en `cancelBooking`, `listCancelled` nueva, ramas de `run`.
- `test/cancel.test.js` — reescribe el test de cancelación y añade los de la feature.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` — fuera de scope (0011).
- `PRODUCT.md`, `README.md`, `CHANGELOG.md`, `ROADMAP.md` — los gestiona el cierre (`sdd-archive`/release).

### 1.2 Modelo de datos

La reserva en memoria gana `reason?: string`, presente solo con `status: 'cancelled'`.

### 1.3 – 1.5

No aplican (sin migraciones, API ni UX gráfica).

### 1.6 Dependencias

Ninguna. Depende de las specs 0005–0007 ya cerradas (`cancelBooking`, `findBooking`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del fichero | media | bajo | Orden de los tests fijado (decisión 7) |
| Argumentos con comillas: `--motivo "sala ocupada"` llega como un solo parámetro desde el shell, pero `run` recibe un array | baja | medio | Los tests llaman a `run` con el motivo como un único elemento del array |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: hilo principal en Native, Sonnet effort medium (sin despacho: la task trae firmas y asserts).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tooling (lint del repo corre en §3)
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; en la misma sesión `canceladas` no persiste (estado en memoria), así que el listado se prueba por los tests, no por el CLI de un solo comando.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reserva inicial `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`); `run(cmd, params)` con `params` ya sin el nombre del comando.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`; `listCancelled(): string`; `run('cancelar', [sala, día, '--motivo', motivo])`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado en memoria se comparte). Sustituye `cancelar una reserva activa`; mantén `cancelar sin reserva lo dice` ajustado a `--motivo`:

  ```js
  const MOTIVOS = 'motivo no válido: cambio de planes, sala ocupada, otro';

  test('canceladas sin cancelaciones lo dice', () => {
    assert.equal(run('canceladas', []), 'sin canceladas');
  });
  test('cancelar con motivo fuera de la lista lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento']), MOTIVOS);
  });
  test('cancelar con otra capitalización lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'Sala Ocupada']), MOTIVOS);
  });
  test('cancelar sin motivo no cancela', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVOS);
  });
  test('cancelar con --motivo sin valor no cancela', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), MOTIVOS);
  });
  test('cancelar sin reserva lo dice', () => {
    assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada']), 'sin reserva Sur mar');
  });
  test('cancelar una reserva activa con motivo', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });
  test('canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  ```

  Ejecuta y confirma que fallan por la razón esperada (RED): `NO_COLOR=1 node --test test/cancel.test.js` → fallan (`canceladas sin cancelaciones`, `fuera de la lista`, `otra capitalización`, `sin motivo`, `--motivo sin valor`, `con motivo`, y `enseña el motivo`: los que ejercen la feature); `cancelar sin reserva lo dice` ya pasa hoy.

- [ ] **Step 2: Implementación en `src/app.js`**
  - `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];` y `const INVALID_REASON = \`motivo no válido: ${REASONS.join(', ')}\`;`
  - `export function cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` devuelve `INVALID_REASON` (antes de buscar la reserva); si no hay reserva activa, `sin reserva ${room} ${day}`; si la hay, `status = 'cancelled'`, `reason = reason` y devuelve `cancelada ${room} ${day} (${reason})`.
  - `export function listCancelled()`: devuelve las reservas `status === 'cancelled'` como `${room} ${day} — ${reason}` unidas por `\n`; sin ninguna, `sin canceladas`.
  - En `run`: `cancelar` lee el motivo como el elemento que sigue a `--motivo` en `params` (`undefined` si falta) y llama a `cancelBooking(params[0], params[1], motivo)`; `canceladas` devuelve `listCancelled()`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 1 task, 1 fichero de código; incertidumbre baja (orden de tests con estado compartido)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED «Cancelar pide un motivo» · AND motivo fuera de la lista → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado enseña el motivo» · THEN `Norte lun — sala ocupada` → Task 1, `canceladas enseña el motivo`. ✓
- Capacidad `bookings` fuera de las dos ADDED (`libres`, `reservar`, `anular`) → N/A (sin cambios; confirmado en spec: «No entra: anulaciones»). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`. ✓
- Review Focus: `--motivo` sin valor → Task 1, `cancelar con --motivo sin valor no cancela`. ✓
- Review Focus: sin reserva → Task 1, `cancelar sin reserva lo dice`. ✓
- Review Focus: sin canceladas → Task 1, `canceladas sin cancelaciones lo dice`. ✓
- Review Focus: otra capitalización → Task 1, `cancelar con otra capitalización lo rechaza`. ✓
