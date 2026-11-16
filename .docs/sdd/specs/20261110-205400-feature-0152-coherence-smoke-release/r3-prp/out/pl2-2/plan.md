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

1. **Modelo y effort**: una sola task, la hace el hilo principal en Native; gama media (Sonnet, effort medium) basta porque el plan lleva firmas, textos y asserts. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Sin `--motivo` se trata como motivo no válido**: la spec solo habla de un motivo fuera de la lista; un `cancelar` sin motivo no puede cancelar, porque entonces la lista cerrada no obligaría a nada. Responde lo mismo que un motivo fuera de la lista y no cancela.
4. **Orden de comprobaciones: primero la reserva, luego el motivo**: la tabla de reglas retiradas conserva «sin reserva <sala> <día>» con el mismo texto, así que `cancelar Sur mar` sin motivo sigue respondiendo «sin reserva Sur mar» (el test existente no cambia).
5. **`canceladas` sin ninguna responde «sin canceladas»** y con varias, una línea por reserva, en el orden en que se reservaron. La spec solo fija el caso de una; el texto vacío no dice nada a quien lo lee.
6. **`canceladas` solo lista las de estado `cancelled`**: las `voided` de `anular` quedan fuera (la 0011 es de las anulaciones).
7. **Las tablas de datos son módulo: el estado se comparte entre los tests de `test/cancel.test.js`**. Cada fichero de test corre en su propio proceso, así que el orden de los tests dentro del fichero es el que fija el estado (`Norte lun` activa → cancelada). No se añade un `reset` al código de producción para eso; el orden va escrito en la task.
8. **Fila «la reserva de otra persona no se toca» del anexo de la spec**: el modelo no tiene dueño de reserva (`bookings` guarda sala, día, franja y estado), así que no hay nada que observar; lo más cercano, que cancelar un día no toca otro, no lo observa ningún test del árbol (la revisión final lo comprobó: el patch 0007 no dejó test en test/cancel.test.js); queda como enmienda propuesta a la spec. Se avisa aquí y no se inventa un concepto de dueño. ⚠
9. **Los comandos `quitar` del anexo no existen en el repo** (`git grep quitar` no encuentra nada): la regla «sin reserva» ya vive en `cancelar` y su test existente la observa.
10. **Riesgos altos**: ninguno. **Coste**: ~0,5 h de implementación, sin subagentes; orden de magnitud de tokens bajo (un fichero de código, un fichero de test).
11. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` pide un motivo de la lista cerrada y el comando `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`reason`) al cancelarla; `canceladas` filtra las reservas por estado `cancelled` y las pinta. Todo en `src/app.js`, que es el único fichero de entrada del proyecto, sin dependencias.

**Tech Stack**: Node 22 (`engines >=20`), módulos ES, `node:test`; sin dependencias externas ni base de datos (reservas en memoria).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y su test, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- La lista de motivos es cerrada y de este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de salida literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga, con un espacio a cada lado).
- Texto de la interfaz en castellano (constitution, art. 4); sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con una sola responsabilidad.

### De proceso

- Tests antes que código (constitution, art. 2): la task empieza por los tests en rojo.
- Git-flow: la rama es `feature/0010-cancel-reason`; un commit por task al quedar limpia su revisión.
- Atribución de commits: la del harness.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "no existe"` → el mismo mensaje y la reserva sigue activa (el `cancelar` siguiente con motivo válido la cancela) · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` antes de cancelar nada → «sin canceladas», no una línea vacía · Task 1, `canceladas sin canceladas`
- `cancelar Sur mar` (sin reserva, sin motivo) → «sin reserva Sur mar», no el aviso del motivo · Task 1, `cancelar sin reserva lo dice` (existente, sin cambios)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo más en la reserva y un comando que filtra; no hay estructura nueva.
- [x] **YAGNI gate**: no se abstrae nada; la lista de motivos es una constante usada por un solo comando.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia a propósito (`cancelar` exige motivo); respeta el patrón de `src/app.js` (función por comando, `run` despacha); sin refactor fuera de scope, `anular` intacto.
- [x] **Constitution check**: art. 1 (flujo SDD), 2 (tests antes, gate de cierre), 3 (git-flow), 4 (castellano) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe el motivo y lo guarda; nueva `cancelledBookings()`; `run` lee `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — los tests de la spec, y `cancelar una reserva activa` pasa a llevar motivo.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `scripts/lint.mjs` — el lint no cambia.

### 1.2 Modelo de datos

La reserva en memoria gana `reason` (texto de la lista) al pasar a `cancelled`. Sin persistencia ni migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica; la interfaz es la salida de `run(cmd, params)`, descrita en la task.

### 1.5 UX

No aplica: salida de texto de una línea por reserva.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) no depende de esta ni al revés.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El estado compartido entre tests hace que un test pase o falle según el orden | Media | Bajo | La task fija el orden de los tests y el Review Focus los pinza uno por uno |
| Quien usaba `cancelar <sala> <día>` sin motivo recibe ahora el aviso | Alta | Bajo | Cambio pedido por la spec; el aviso lista los motivos válidos |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar las canceladas

**Tras**: —
**Modelo**: hilo principal en Native (Sonnet, effort medium): una sola task con el código y los asserts fijados abajo.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (el lint del repo lee `src/app.js`)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con otro motivo ve «motivo no válido: cambio de planes, sala ocupada, otro»; y `canceladas` le responde «Norte lun — sala ocupada» (una invocación por proceso reinicia las reservas en memoria, así que lo ve encadenado en los tests).

**Interfaces**:
- Consume: de `src/app.js` actual, `findBooking(room, day)` (reserva activa o `undefined`), el array `bookings` con `{ room, day, slot, status }` y `run(cmd, params)`; nada de otras tasks.
- Produce: `cancelBooking(room, day, reason)` → `string`; `cancelledBookings()` → `string`; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten el estado del módulo; `Norte lun` empieza activa y `Sur mar` no existe):
  - `canceladas sin canceladas`: `assert.equal(run('canceladas', []), 'sin canceladas')`
  - `cancelar sin motivo no cancela`: `assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro')`
  - `motivo fuera de la lista no cancela`: `assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'no existe']), 'motivo no válido: cambio de planes, sala ocupada, otro')`
  - `cancelar una reserva activa` (existente, ahora con motivo): `assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)')`
  - `cancelar sin reserva lo dice` (existente, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`
  - `canceladas enseña el motivo`: `assert.equal(run('canceladas', []), 'Norte lun — sala ocupada')`

  Ejecutar `node --test test/cancel.test.js` y ver los fallos por la razón esperada (`cancelar` sin motivo hoy cancela; `canceladas` hoy responde `salas`).
- [ ] **Step 2: Implementación** — en `src/app.js`: constante `reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` comprueba primero la reserva (`sin reserva <sala> <día>`), luego `reasons.includes(reason)` (si no, `motivo no válido: ${reasons.join(', ')}`, sin tocar la reserva) y, si todo va bien, guarda `status = 'cancelled'` y `reason` y devuelve `cancelada ${room} ${day} (${reason})`; `cancelledBookings()` filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}`, une con `\n` y devuelve `sin canceladas` si no hay ninguna; en `run`, `cancelar` toma el motivo de `params[params.indexOf('--motivo') + 1]` (`undefined` si no está la opción) y `canceladas` llama a `cancelledBookings()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión; mensaje con la convención del proyecto: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: una task, un fichero de código y uno de test, sin dependencias; la incertidumbre es solo el estado compartido entre tests. Sin estimation-log previo con que calibrar.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo de la lista» · AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela` (y la reserva sigue activa porque el test siguiente la cancela). ✓
- ADDED «El listado de canceladas enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Fila del anexo «sin reserva <sala> <día>» → `cancelar` → Task 1, `cancelar sin reserva lo dice`. ✓
- Fila del anexo «la reserva de otra persona no se toca» → sin observar: el modelo no tiene dueño de reserva (avisado en las decisiones, punto 8). ⚠
- Scope «No entra: anulaciones del responsable de sala (0011)» → N/A (`voidBooking` en «NO se tocan»). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; fuera de la lista → `motivo fuera de la lista no cancela`; sin canceladas → `canceladas sin canceladas`; sin reserva → `cancelar sin reserva lo dice`. ✓
