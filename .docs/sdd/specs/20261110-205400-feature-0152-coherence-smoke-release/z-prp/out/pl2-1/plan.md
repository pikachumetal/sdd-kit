---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace la sesión en Native, en gama media (Sonnet, effort medium); cada una trae su código y sus tests escritos en el plan. La revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: Native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo`, o con `--motivo` sin valor, responde lo mismo que con un motivo fuera de la lista: la spec dice que cancelar «pide» un motivo y no fija este caso. La reserva queda activa.
4. Con motivo no válido y sin reserva, gana el motivo: se valida la entrada antes de buscar la reserva.
5. `canceladas` sin ninguna cancelada responde cadena vacía; con varias, una línea por reserva, en el orden en que están. La spec no lo fija; con la reserva única de partida solo se prueba el caso vacío.
6. `canceladas` no lista las `voided` (las anulaciones son de la 0011, fuera de scope).
7. Los tests de `test/cancel.test.js` importan `../src/app.js` con un sufijo de consulta (`?v=<n>`) para tener un estado de reservas limpio en cada test; así no hay código de producción solo para los tests ni orden entre tests.
8. El test existente «cancelar una reserva activa» se reescribe con `--motivo`: el comando ya no cancela sin motivo.
9. Coste estimado: ~1,5 h en total; sin despachos, solo la revisión final de rama.
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: Todo en `src/app.js`: `cancelBooking` recibe el motivo y lo guarda en la reserva cancelada; una función nueva lista las canceladas, y `run` enruta `canceladas`. Sin módulos nuevos.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el fichero único `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos cerrada, con estos textos exactos: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de salida literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios), `sin reserva <sala> <día>`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Texto de la interfaz y de los documentos en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo cometido.

### De proceso

- Native: la sesión implementa cada task, TDD (test en rojo antes del código), en gama media (Sonnet, effort medium); no se despachan subagentes salvo el caso de compactación de la línea `Ejecución`.
- Un commit por task al quedar limpia su revisión; mensajes en castellano, terminados con la línea `Co-Authored-By` que fija el proyecto.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Norte lun --motivo` (sin valor) → el mismo mensaje de motivo no válido · Task 1, `cancelar con --motivo sin valor lo rechaza`
- `cancelar Sur lun --motivo otro` (la reserva es de Norte) → «sin reserva Sur lun» y la de Norte no se toca · Task 1, `cancelar no toca la reserva de otra sala`
- `canceladas` sin ninguna cancelada → salida vacía · Task 2, `canceladas sin canceladas responde vacío`
- `canceladas` tras `anular Norte lun` → salida vacía, las anuladas no salen · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un parámetro nuevo, una constante y una función; nada más.
- [x] **YAGNI gate**: sin abstracciones; ni módulo de motivos ni formato configurable.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (cancelar exige motivo); respeta el patrón de `cancelBooking`/`run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2); flujo SDD (art. 1); castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`, motivo en `cancelBooking`, función `cancelledBookings`, rutas de `run`.
- `test/cancel.test.js` — tests de motivo y de listado; el existente se reescribe con motivo.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no cambia `libres` ni `reservar`.

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason` (cadena). En memoria; sin schema.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests del mismo fichero (la reserva de Norte se cancela una vez) | Alta | Medio | Import con `?v=<n>` en cada test (decisión 7) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native, la sesión: gama media (Sonnet, effort medium); la task trae el código y los tests escritos.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo aburrimiento` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` guarda `booking.reason = reason`; las reservas canceladas tienen `status: 'cancelled'` y `reason` ∈ `REASONS`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con el helper `let n = 0; const freshApp = () => import(`../src/app.js?v=${n++}`);` y cada test con `const { run } = await freshApp();`. Sustituye el test «cancelar una reserva activa» por estos (los de sin reserva pasan a llevar motivo):
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista lo rechaza`: `['Norte', 'lun', '--motivo', 'aburrimiento']` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza y no cancela`: `['Norte', 'lun']` → el mismo mensaje; después `['Norte', 'lun', '--motivo', 'otro']` → `'cancelada Norte lun (otro)'`.
  - `cancelar con --motivo sin valor lo rechaza`: `['Norte', 'lun', '--motivo']` → el mismo mensaje.
  - `cancelar sin reserva lo dice`: `['Sur', 'mar', '--motivo', 'otro']` → `'sin reserva Sur mar'`.
  - `cancelar no toca la reserva de otra sala`: `['Sur', 'lun', '--motivo', 'otro']` → `'sin reserva Sur lun'`; después `['Norte', 'lun', '--motivo', 'otro']` → `'cancelada Norte lun (otro)'`.
  Ejecuta `node --test test/cancel.test.js` y comprueba que fallan los nuevos.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];` · `function reasonOf(params)` devuelve el elemento que sigue a `--motivo` o `undefined` · `cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` devuelve `motivo no válido: ${REASONS.join(', ')}` antes de buscar la reserva; al cancelar guarda `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` `` · en `run`, `cancelar` pasa `reasonOf(params)`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native, la sesión: gama media (Sonnet, effort medium); la task trae el código y los tests escritos.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada» en la misma sesión, la persona ejecuta `canceladas` y ve «Norte lun — sala ocupada» (la CLI no conserva estado entre ejecuciones; se ve por el test sobre `run`).

**Interfaces**:
- Consume: reservas con `status: 'cancelled'` y `reason` (Task 1).
- Produce: `cancelledBookings()` → cadena con una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas por `\n`; `''` si no hay; `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `freshApp`:
  - `canceladas enseña el motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`; `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])`; `run('canceladas', [])` → `''`.
  Ejecuta y comprueba que fallan (hoy `run` devuelve `'salas'`).
- [ ] **Step 2: Implementación** — `function cancelledBookings()`: filtra `bookings` por `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` `` y une con `\n`; en `run`, `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; incertidumbre baja; sin features previas comparables en el log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde «cancelada Norte lun (sala ocupada)»» → Task 1, `cancelar con motivo de la lista`. ✓
- AND «un motivo fuera de la lista responde «motivo no válido: …»» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN «`canceladas` responde «Norte lun — sala ocupada»» → Task 2, `canceladas enseña el motivo`. ✓
- Regla retirada «sin reserva responde «sin reserva <sala> <día>»» → Task 1, `cancelar sin reserva lo dice`. ✓
- Regla retirada «la reserva de otra persona no se toca» → Task 1, `cancelar no toca la reserva de otra sala` (el código no tiene dueño de reserva; se observa por sala). ✓
- Review Focus: sin motivo, `--motivo` sin valor → Task 1; vacío y anuladas → Task 2, tests con esos nombres. ✓
