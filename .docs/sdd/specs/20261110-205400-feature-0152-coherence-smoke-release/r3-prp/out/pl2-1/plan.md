---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en `sdd-kit.json`; 2 tasks encadenadas por el campo `reason` de la reserva, en un solo fichero que cabe en un contexto.
2. **Modelo por task**: Sonnet, effort medium en las dos (prosa corta, el plan lleva los tests y los textos); la revisión final de rama sigue la política de `sdd-verify`.
3. **`cancelar` sin `--motivo`**: la spec no lo dice. Responde lo mismo que con un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro») y no cancela. El test de hoy `cancelar una reserva activa` (sin motivo) pasa a llevar motivo: su comportamiento queda retirado por la spec («cancelar pide un motivo»).
4. **Orden de validación**: primero el motivo, después la búsqueda de la reserva; `cancelar Sur mar --motivo otro` sigue respondiendo «sin reserva Sur mar».
5. **`resetBookings()`** se exporta de `src/app.js` para que cada test parta de la reserva de Norte del lunes: las reservas viven en memoria y un test que cancela estropearía al siguiente. Es la única API nueva.
6. **`canceladas` sin canceladas** responde cadena vacía, y las reservas anuladas (`anular`, estado `voided`) no salen: solo `status === 'cancelled'`. Varias canceladas, una por línea.
7. **Fila del anexo «la reserva de otra persona no se toca»**: el código no tiene noción de propietario, así que ningún test la puede observar (⚠ en §4). Queda para la 0011.
8. **Gate de cierre**: `node --test && node scripts/lint.mjs`, literal de `operations.md`.
9. **Coste estimado**: ~1,5 h de implementación, sin subagentes.
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo es un campo `reason` de la reserva cancelada en `src/app.js`, validado contra una lista constante antes de tocar el estado. `canceladas` filtra por `status === 'cancelled'`.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos; toca dos funciones de `src/app.js`.

## Restricciones globales

### De código

- La lista de motivos es cerrada y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «sin reserva <sala> <día>», «<sala> <día> — <motivo>» (raya larga).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Native: la sesión implementa cada task con TDD (RED visto fallar, mínimo, verde) y una revisión final de rama con `sdd-verify`.
- Commits en castellano, referenciando la 0010; un commit por task al quedar limpia.
- Los textos de la interfaz y de los documentos, en castellano (constitution, art. 4).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- Motivo fuera de la lista → no cancela: repetir con un motivo válido responde «cancelada Norte lun (otro)» · Task 1, `motivo fuera de la lista no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar», no el error de motivo · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`anular`) → no sale en el listado · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y una función nuevos, sin capas.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante con un uso real por comando.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec retira (cancelar sin motivo); respeta el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), sin tocar `anular` (0011).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe el motivo y lo valida; nuevas `cancelledBookings()` y `resetBookings()`; `run` entiende `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de motivo y de `canceladas`, con `beforeEach(resetBookings)`.

**NO se tocan**:

- `voidBooking` / `anular` — la 0011 lo redefine.
- `test/app.test.js` — `libres` y `reservar` no cambian.
- `.docs/sdd/steering/*` — la pieza técnica no cambia la estructura; el comportamiento vive en la capacidad `bookings`.

### 1.2–1.5

No aplican (sin base de datos, migraciones, API ni pantalla).

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) es posterior y no depende de esta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | Alta | Medio | `resetBookings()` en `beforeEach` |
| Parsear `--motivo` mal con argumentos de varias palabras | Baja | Medio | El shell ya entrega «sala ocupada» como un solo argumento; test con el valor de la spec |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: sesión native, Sonnet con effort medium (sin despacho a subagente).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend · tests.
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `cancelBooking(room, day)`, `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)`; el campo `reason` en la reserva cancelada; `resetBookings(): void` exportada, que deja `bookings` con `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; la constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`: importar `beforeEach` de `node:test` y `resetBookings` de `../src/app.js`; `beforeEach(resetBookings)`; sustituir los dos tests de hoy por:

```js
test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('motivo fuera de la lista no cancela', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones']);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('cancelar sin motivo no cancela', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
```

  Ejecutar `node --test test/cancel.test.js` y ver que falla (`resetBookings` no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `export function resetBookings()` que reasigna el contenido de `bookings` a la reserva semilla (`bookings.splice(0, bookings.length, seed)`); `cancelBooking(room, day, reason)` devuelve `motivo no válido: ${REASONS.join(', ')}` si `reason` no está en `REASONS`, antes de buscar la reserva; si la reserva no existe, `sin reserva ${room} ${day}`; si existe, guarda `status = 'cancelled'` y `reason`, y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` extrae el valor que sigue a `--motivo` (`undefined` si no está) y llama a `cancelBooking(params[0], params[1], reason)`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)».
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: «feat(0010): cancelar pide un motivo de la lista».

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: sesión native, Sonnet con effort medium (sin despacho a subagente).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend · tests.
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela Norte del lunes con «sala ocupada» y `node src/app.js canceladas` muestra «Norte lun — sala ocupada» (en la CLI el estado es en memoria: se comprueba con el test, que encadena los dos comandos).

**Interfaces**:
- Consume: `REASONS`, `bookings` y el campo `reason` de la Task 1; `run('cancelar', …)` y `run('anular', …)`.
- Produce: `cancelledBookings(): string` (una línea `<sala> <día> — <motivo>` por reserva con `status === 'cancelled'`, unidas por salto de línea) y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — añadir a `test/cancel.test.js`:

```js
test('canceladas enseña el motivo', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas no lista las anuladas', () => {
  run('anular', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), '');
});
```

  Ejecutar y ver que fallan (`run` devuelve `salas`).
- [ ] **Step 2: Implementación** — en `src/app.js`: `function cancelledBookings()` filtra `bookings` por `status === 'cancelled'`, formatea `${room} ${day} — ${reason}` y une con `'\n'`; `run` responde `cancelledBookings()` al comando `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: «feat(0010): canceladas enseña el motivo».

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un fichero; sin referencia en el estimation-log (sin notas de calibración todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con un motivo de la lista`. ✓
- AND «motivo fuera de la lista responde “motivo no válido: …”» → Task 1, `motivo fuera de la lista`. ✓
- ADDED «El listado enseña el motivo»: THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Fila del anexo `quitar`: «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice` (busca la regla en `cancelar`). ✓
- Fila del anexo `quitar`: «la reserva de otra persona no se toca» → sin observar: el código no tiene propietario de reserva (avisado en las decisiones, punto 7). ⚠
- `anular` y las anulaciones del responsable → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; motivo inválido no cancela → Task 1, `motivo fuera de la lista no cancela`; sin reserva con motivo válido → Task 1, `cancelar sin reserva lo dice`; anuladas fuera del listado → Task 2, `canceladas no lista las anuladas`. ✓
