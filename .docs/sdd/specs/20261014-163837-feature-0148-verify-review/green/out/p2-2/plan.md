---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 con la sesión (Sonnet, effort medium): cambian una función y un comando de `src/app.js` y el plan lleva firmas y asserts. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y no fija este caso. Consecuencia: el test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva…». La spec no fija el orden.
5. **`canceladas` sin ninguna cancelada responde `sin canceladas`** (texto en castellano, como `sin reserva`); con varias, una línea por reserva en orden de cancelación. La spec solo fija el caso de una.
6. **Las reservas `voided` (anuladas, 0011) no salen en `canceladas`**: la spec deja las anulaciones fuera de scope.
7. **Coste estimado**: 1 h de implementación, sin subagentes de implementación; la revisión final despacha tres ejes (orden de magnitud: unos pocos dólares).
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda en la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo vive en la propia reserva (`booking.reason`) y `cancelBooking` lo recibe como tercer parámetro; `run` extrae el valor de `--motivo` de los argumentos. `canceladas` filtra `bookings` por `status === 'cancelled'`. Todo en `src/app.js`, sin ficheros nuevos.

**Tech Stack**: Node 22, sin dependencias externas, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de dos comandos dentro de `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos o datos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Texto de la interfaz en castellano (constitution, art. 4); sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones pequeñas.

### De proceso

- Tests antes que código (constitution, art. 2).
- Modo de ejecución: native, el hilo principal implementa las tasks.
- Un commit por task al quedar limpia su revisión; mensajes con la atribución del proyecto.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Norte lun --motivo "sala ocupada"` con motivo válido sobre una reserva inexistente → «sin reserva Sur mar»; con motivo inválido sobre una inexistente → «motivo no válido…» (se valida primero) · Task 1, `motivo no válido se rechaza antes de buscar la reserva`
- `canceladas` sin cancelaciones → `sin canceladas` · Task 2, `canceladas sin cancelaciones lo dice`
- Una reserva anulada con `anular` no aparece en `canceladas` · Task 2, `canceladas no incluye las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y un filtro; nada más simple cumple la spec.
- [x] **YAGNI gate**: ninguna abstracción nueva; una constante con la lista de motivos.
- [x] **Brownfield gate**: retrocompatible salvo la decisión 3 (el motivo pasa a ser obligatorio, que es lo que pide la spec); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo y lo guarda en la reserva; nueva función `cancelledBookings`; se exporta `bookings` para sembrar en tests; `run` interpreta `--motivo` y el comando `canceladas`.
- `test/cancel.test.js` — tests de los dos escenarios de la spec; el existente de cancelar pasa a llevar `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva gana `reason` (cadena de la lista) al cancelarse. Las reservas en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica: el contrato es la salida de la línea de comandos, fijada en la spec.

### 1.5 UX

No aplica: salida de texto.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Hacer obligatorio el motivo rompe a quien llame a `cancelar` sin él | media | bajo | Decisión 3 validada por el dev-lead; el test existente se actualiza en la Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión (Sonnet, effort medium); es una task de una función con asserts escritos en el plan.
**Tests RED**: hilo principal (Native, TDD) · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → cadena; la reserva cancelada lleva `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (el primero sustituye al existente `cancelar una reserva activa`; el estado en memoria es compartido, así que cada test usa una reserva distinta o el orden del fichero lo respeta: la reserva de Norte lun solo se cancela una vez):
  - `cancelar sin motivo lo rechaza y no cancela`: `run('cancelar', ['Norte', 'lun'])` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `motivo no válido se rechaza antes de buscar la reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'vacaciones'])` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` (existente, ahora con `'--motivo', 'otro'`): `'sin reserva Sur mar'`.
  Orden en el fichero: los dos rechazos y el de «sin reserva» antes del que cancela Norte lun de verdad.
- [ ] **Step 2: Ver los tests fallar** — `node --test test/cancel.test.js`. Esperado: rojo por el motivo no validado.
- [ ] **Step 3: Implementación** en `src/app.js`: constante `REASONS`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` si `!REASONS.includes(reason)`, antes de `findBooking`, y al cancelar guarda `booking.reason = reason` y responde `` `cancelada ${room} ${day} (${reason})` ``; en `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` (`undefined` si no hay flag).
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: verde.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión (Sonnet, effort medium); un filtro y un formato.
**Tests RED**: hilo principal (Native, TDD) · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `node src/app.js canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `bookings` con `status: 'cancelled'` y `reason` (Task 1); `voidBooking` deja `status: 'voided'`.
- Produce: `cancelledBookings()` → cadena con una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`, o `sin canceladas` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (el estado en memoria es compartido):
  - `canceladas sin cancelaciones lo dice`: `run('canceladas', [])` es `'sin canceladas'`.
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` (la cancelación de la Task 1; si ese test ya la hizo, basta la aserción), `run('canceladas', [])` es `'Norte lun — sala ocupada'`.
  - `canceladas no incluye las anuladas`: se siembra con `bookings.push({ room: 'Sur', day: 'mié', slot: '10:00-12:00', status: 'active' })` (`bookings` pasa a exportarse de `src/app.js` para sembrar), se ejecuta `run('anular', ['Sur', 'mié'])` y `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver los tests fallar** — `node --test test/cancel.test.js`. Esperado: rojo; `canceladas` responde `salas`.
- [ ] **Step 3: Implementación** en `src/app.js`: `cancelledBookings()` filtra `status === 'cancelled'`, formatea `` `${b.room} ${b.day} — ${b.reason}` `` y une con `\n`, o devuelve `'sin canceladas'`; `run` mapea `canceladas` a ella; `bookings` pasa a `export const`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: verde.
- [ ] **Step 5: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin incertidumbres técnicas; el patch 0007 en `cancel` costó 0,5 h.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (motivo válido y motivo fuera de la lista) → Task 1. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 2. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo y orden de validación → Task 1; sin canceladas y anuladas excluidas → Task 2. ✓
