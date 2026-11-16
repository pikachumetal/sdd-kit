---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos las hace el hilo principal (Native), sin despacho; la sesión va bien en gama media porque el plan lleva firmas, textos y asserts. La revisión final de rama no se quita: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: Native, fijado en `sdd-kit.json`; 2 tasks pequeñas sobre un solo fichero, un error lo caza el test de su task.
3. **Sin `--motivo` se responde igual que con un motivo fuera de la lista** («motivo no válido: …»): la spec dice que cancelar «pide» un motivo y no fija este caso.
4. **El motivo se valida antes de buscar la reserva**: con un motivo inválido la reserva sigue activa y no se consulta el estado.
5. **`canceladas` sin ninguna cancelada responde `sin canceladas`** (la spec no fija el caso vacío); una reserva anulada (`voided`) no sale: solo `cancelled`.
6. **Varias canceladas**: una línea por reserva, en el orden del array, unidas con `\n`.
7. **Los tests de `test/cancel.test.js` comparten el estado en memoria del módulo** y `node --test` los corre en orden dentro del fichero: el orden es parte del contrato (motivo inválido → cancelación válida → `canceladas` → sin reserva).
8. **Los dos tests existentes de `cancel.test.js` cambian de forma**: con motivo obligatorio, `cancelar Norte lun` sin `--motivo` ya no responde `cancelada…`; se reescriben con `--motivo`.
9. **Riesgos altos**: ninguno. **Coste estimado**: ~1,5 h; orden de magnitud bajo (sin subagentes de implementación).
10. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar exige un motivo de una lista cerrada, lo guarda con la reserva y `canceladas` lo enseña.

**Architecture**: en `src/app.js`, `cancelBooking(room, day, reason)` valida el motivo contra una constante `reasons`, lo guarda en `booking.reason` y `listCancelled()` filtra por `status === 'cancelled'`; `run` extrae `--motivo` de los parámetros. Sin ficheros nuevos: el proyecto es un solo fichero de entrada (`architecture.md`).

**Tech Stack**: Node ≥ 20 (`node:test`), sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia la lógica de `cancelar` y añade un comando en el mismo fichero; sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Texto de la interfaz literal de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (guion largo `—`).
- Lista de motivos cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- `src/app.js` sin tabuladores (lo comprueba `scripts/lint.mjs`); Node ≥ 20, sin dependencias.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo cometido.

### De proceso

- Native: la sesión implementa cada task con TDD (test RED visto fallar antes del código) y registra `sdd task start` / `sdd task done`.
- Constitution: texto de interfaz y documentos en castellano; flujo SDD; git-flow en `feature/0010-cancel-reason`.
- Commits: uno por task al quedar limpia su revisión, con el trailer de atribución que fije el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro` y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo "otro"` sin reserva → `sin reserva Sur mar`, no `cancelada…` · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`anular`) y ninguna cancelada → `sin canceladas`, la anulada no aparece · Task 2, `canceladas no lista las anuladas y sin canceladas lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos nuevos, un campo `reason` y una función de listado.
- [x] **YAGNI gate**: la lista de motivos es una constante usada en validación y en el mensaje; nada se abstrae.
- [x] **Brownfield gate**: retrocompatible solo en `anular`, que no cambia; `cancelar` cambia a propósito (motivo obligatorio, spec). Sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, castellano, gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `reasons`, `cancelBooking(room, day, reason)`, `listCancelled()`, extracción de `--motivo` y comando `canceladas` en `run`.
- `test/cancel.test.js` — tests de motivo y de listado (ver §2).

**NO se tocan**:

- `voidBooking` y el comando `anular` — fuera de scope (0011).
- `test/app.test.js`, `test/store.test.js` — no dependen de `cancelar`.

### 1.6 Dependencias

Ninguna: depende solo del estado en memoria de `bookings` (`Norte lun 10:00-12:00` activa).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del fichero | media | bajo | orden fijado en la decisión 7 |
| `--motivo` con el valor sin comillas partido en varios argumentos (`--motivo sala ocupada`) | baja | bajo | el valor es el argumento siguiente a `--motivo`; con comillas llega entero; sin ellas, `sala` no está en la lista y responde `motivo no válido` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho; effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo vacaciones` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`, sin cambios.
- Produce: `const reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`; `booking.reason` guardado en la reserva cancelada.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — `test/cancel.test.js` queda en este orden:

  ```js
  test('cancelar con un motivo fuera de la lista lo rechaza', () => {
    assert.equal(
      run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones']),
      'motivo no válido: cambio de planes, sala ocupada, otro'
    );
  });

  test('cancelar sin motivo lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  });

  test('cancelar una reserva activa con motivo', () => {
    assert.equal(
      run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
      'cancelada Norte lun (sala ocupada)'
    );
  });

  test('cancelar sin reserva lo dice', () => {
    assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
  });
  ```

  Los dos primeros prueban también que la reserva sigue activa: el tercero solo pasa si no se canceló antes. Ejecútalos y míralos fallar.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const reasons = [...]` con la lista de las restricciones; `cancelBooking(room, day, reason)` devuelve `motivo no válido: ${reasons.join(', ')}` si `reasons.includes(reason)` es falso (antes de buscar la reserva), y si no, el `sin reserva …` actual o, tras cancelar, guarda `booking.reason = reason` y devuelve `cancelada ${room} ${day} (${reason})`; en `run`, `cancelar` pasa como motivo el argumento que sigue a `--motivo` (`undefined` si falta).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; lint: `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`, uno solo al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), sin despacho; effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona ejecuta `canceladas` y ve `Norte lun — sala ocupada`.

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` de la Task 1; el estado de la reserva Norte lun cancelada por el test `cancelar una reserva activa con motivo`.
- Produce: `listCancelled()` → `string` (una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`; `sin canceladas` si no hay); comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancelled-empty.test.js`

- [ ] **Step 1: Tests RED** — añadir en `test/cancel.test.js`, tras `cancelar una reserva activa con motivo` y antes de `cancelar sin reserva lo dice`:

  ```js
  test('canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });

  ```

  Para el caso vacío con una reserva anulada, añadir un fichero nuevo `test/cancelled-empty.test.js` (proceso propio, estado limpio):

  ```js
  import { test } from 'node:test';
  import assert from 'node:assert/strict';
  import { run } from '../src/app.js';

  test('canceladas no lista las anuladas y sin canceladas lo dice', () => {
    assert.equal(run('anular', ['Norte', 'lun']), 'anulada Norte lun');
    assert.equal(run('canceladas', []), 'sin canceladas');
  });
  ```

  Ejecútalos y míralos fallar (`canceladas` responde hoy `salas`).
- [ ] **Step 2: Implementación** — `listCancelled()`: filtra `bookings` por `status === 'cancelled'`, mapea a `${b.room} ${b.day} — ${b.reason}`, une con `\n` y devuelve `sin canceladas` si no hay; `run('canceladas')` la llama.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/cancelled-empty.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`, uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; la incertidumbre es solo el estado compartido de los tests.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED «Cancelar pide un motivo» · AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con un motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Spec «Dónde se prueba» (motivo por `cancelar`, listado por `canceladas`, en `test/cancel.test.js`) → Tasks 1 y 2; el caso vacío va en `test/cancelled-empty.test.js` por necesitar estado limpio. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza`; sin reserva con motivo válido → Task 1, `cancelar sin reserva lo dice`; sin canceladas → Task 2, `canceladas no lista las anuladas y sin canceladas lo dice`. ✓
