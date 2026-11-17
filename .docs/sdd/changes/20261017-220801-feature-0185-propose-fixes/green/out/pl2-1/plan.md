---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-18
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos en Sonnet con effort medium, en el hilo de la sesión y sin despacho: ~15 líneas de código con los textos exactos fijados por la spec. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en sdd-kit.json.
3. Dos tasks: motivo en `cancelar` (Task 1) y comando `canceladas` (Task 2); un revisor podría aprobar una y rechazar la otra, y Task 2 consume el `reason` que produce Task 1.
4. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela (la spec solo fija el motivo fuera de la lista; «pide un motivo» lo hace obligatorio). Se comprueba antes que exista la reserva, así «sin reserva <sala> <día>» no cambia (anexo de la spec) y su test actual sigue verde sin motivo.
5. Un motivo inválido no cancela: la reserva sigue activa (lo observa el test siguiente, que la cancela con un motivo válido).
6. `canceladas` lista solo el estado `cancelled`, no `voided` (las anulaciones son la 0011). Sin ninguna cancelada devuelve cadena vacía: la spec no fija texto y no lo invento.
7. La fila del anexo «la reserva de otra persona no se toca» no tiene qué observar: `src/app.js` no modela personas ni dueños. No se añade código para ella (YAGNI); queda ⚠ en §4.
8. `export const bookings` en `src/app.js` para que un test siembre una segunda reserva activa y la anule: es la única forma de observar que `canceladas` no lista las anuladas, porque `reservar` no crea reservas.
9. El test actual `cancelar una reserva activa` (sin motivo) deja de describir el contrato que la spec modifica: se reescribe en Task 1.
10. Coste estimado: 1 h de implementación; sin despachos salvo la revisión final de rama (pocos dólares).
11. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` es el único fichero. `cancelBooking(room, day, reason)` valida el motivo contra la constante `CANCEL_REASONS` y lo guarda en `booking.reason`; `run` extrae el valor de `--motivo`. Un `cancelledBookings()` nuevo formatea el listado. Las reservas viven en memoria.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero de entrada, sin módulo, dependencia ni contrato nuevos entre módulos.

## Restricciones globales

### De código

- Textos exactos de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Lista de motivos cerrada, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Node 22 sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano.

### De proceso

- Tests antes que código (constitution, art. 2): el RED de cada task se ve fallar antes de implementar.
- Política de modelos: gama media (Sonnet, effort medium) para las tasks; el proyecto no declara modelos prohibidos.
- Commits: apertura, uno por task y cierre; atribución según las reglas del harness.

## Review Focus

- `cancelar Norte lun --motivo "otro motivo"` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `motivo fuera de la lista no cancela` (y `cancelar una reserva activa con motivo`, que la cancela después)
- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `canceladas` con una reserva anulada además de la cancelada → solo lista la cancelada · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, un campo en la reserva y una función de listado.
- [x] **YAGNI gate**: nada se abstrae; sin persistencia ni soporte de "otra persona".
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec modifica (`cancelar` pide motivo); sigue el patrón de `cancelBooking`/`run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, `node --test` entero como gate, texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, `export` de `bookings`, y las ramas `cancelar` y `canceladas` de `run`.
- `test/cancel.test.js` — tests de `cancelar` con motivo y de `canceladas`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin relación.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` junto a `status: 'cancelled'`. Solo en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica (CLI).

### 1.6 Dependencias

Ninguna. El comando `quitar` del anexo ya no existe en el código: su destino es `cancelar`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten el estado en memoria y dependen del orden | media | baja | El orden de los tests en el fichero está fijado en cada task; `node --test` ejecuta los tests de un fichero en orden de declaración |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Sonnet, effort medium; la ejecuta el hilo de la sesión (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: `bookings` con `{ room, day, slot, status }` y `findBooking(room, day)`, que devuelve la reserva `active`.
- Produce: `export function cancelBooking(room, day, reason)`; la reserva cancelada con `reason`; `export const bookings`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — En `test/cancel.test.js`, en este orden (el estado en memoria se comparte): primero `cancelar sin reserva lo dice` (el actual, intacto); después estos tres, que sustituyen a `cancelar una reserva activa`:
  ```js
  test('cancelar sin motivo lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  });
  test('motivo fuera de la lista no cancela', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  });
  test('cancelar una reserva activa con motivo', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });
  ```
- [ ] **Step 2: Implementación** — En `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `export const bookings` (hoy `const`); `cancelBooking(room, day, reason)` comprueba primero la reserva (`sin reserva <sala> <día>`), después `CANCEL_REASONS.includes(reason)` (si no, `motivo no válido: ${CANCEL_REASONS.join(', ')}`, sin tocar la reserva), guarda `booking.reason` y responde `cancelada ${room} ${day} (${reason})`. La rama `cancelar` de `run` pasa como `reason` el parámetro que sigue a `--motivo`, o `undefined` si falta.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: antes de implementar fallan los tres tests nuevos; después, verde, incluido `cancelar sin reserva lo dice`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Sonnet, effort medium; la ejecuta el hilo de la sesión (Native), sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada `node src/app.js` arranca de cero: el listado solo se observa por `run` en el test.

**Interfaces**:
- Consume: `bookings` exportado y reservas canceladas con `reason` (Task 1).
- Produce: `function cancelledBookings(): string` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — Al final de `test/cancel.test.js` (tras la cancelación de Norte lun de Task 1), importando también `bookings`:
  ```js
  test('canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  test('canceladas no lista las anuladas', () => {
    bookings.push({ room: 'Sur', day: 'mar', slot: '10:00-12:00', status: 'active' });
    run('anular', ['Sur', 'mar']);
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  ```
- [ ] **Step 2: Implementación** — `cancelledBookings()` en `src/app.js`: filtra `status === 'cancelled'` y une con `\n` las líneas `${room} ${day} — ${reason}`; la rama `canceladas` de `run` la devuelve.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: antes de implementar fallan los dos tests nuevos (`run('canceladas')` devuelve `salas`); después, verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks en un fichero, textos fijados por la spec; la incertidumbre es el estado compartido entre tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo»: THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anexo `quitar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice` (existente, sigue verde). ✓
- Anexo `quitar`: la reserva de otra persona no se toca → sin observar: el modelo no tiene personas ni dueño (avisado en las decisiones, nº 7). ⚠
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus → Task 1, `cancelar sin motivo lo rechaza` y `motivo fuera de la lista no cancela`; Task 2, `canceladas no lista las anuladas`. ✓
