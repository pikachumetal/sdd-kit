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

1. **Modelo y effort por task** — Task 1 y Task 2 las hace el hilo principal (Native) en Sonnet, effort medium: cada una toca una función de `src/app.js` y su test. La revisión final de rama va con el modelo de `sdd-verify` (ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución** — native, fijado en `sdd-kit.json`.
3. **Orden de comprobación en `cancelar`** — primero se busca la reserva y después se valida el motivo: la regla retirada de `quitar` («sin reserva <sala> <día>», mismo texto) no cambia y su test de hoy sigue valiendo sin tocarlo. La spec no fija el orden.
4. **`cancelar` sin `--motivo`** — responde «motivo no válido: cambio de planes, sala ocupada, otro», como un motivo fuera de la lista: «pide un motivo» de la capacidad. La spec solo cita el motivo fuera de la lista.
5. **Un motivo no válido no cancela** — la reserva sigue activa y se puede cancelar después con un motivo válido.
6. **`canceladas`** — una línea por reserva con estado `cancelled`, unidas con salto de línea; sin canceladas responde cadena vacía; las `voided` (anular, 0011) no salen, pero ningún test lo observa: el estado vive en memoria y solo `anular` las crea, sin una reserva activa que anular tras la cancelación (⚠ en §4). La spec no fija ninguno de los tres.
7. **Dónde se guarda el motivo** — campo `reason` de la propia reserva en memoria (`bookings` de `src/app.js`), sin estructura nueva.
8. **Regla «la reserva de otra persona no se toca»** — el código no tiene noción de persona: las reservas se identifican por sala y día. Lo único observable es que cancelar una no toca otra de distinta sala o día; lo cubre el Review Focus, y la cláusula literal queda sin observar (⚠ en §4).
9. **Test existente `cancelar una reserva activa`** — su respuesta cambia por esta feature («cancelada Norte lun» pasa a llevar el motivo): se reescribe en la Task 1 con el texto de la spec, no se añade uno duplicado.
10. **Orden de los tests** — `bookings` es estado de módulo y hay una sola reserva activa; los tests de `test/cancel.test.js` van en el orden de la spec (motivo inválido, cancelación válida, listado) y el de `canceladas` depende de la cancelación válida anterior.
11. **Coste estimado** — 1,5 h; sin subagentes, coste de tokens de una sesión corta.
12. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Que `cancelar` exija un motivo de una lista cerrada y que el comando `canceladas` lo enseñe.

**Architecture**: El motivo se guarda como campo `reason` de la reserva cancelada, en el array `bookings` de `src/app.js`; `canceladas` filtra ese array por estado. Sin ficheros ni dependencias nuevos: el proyecto es un único fichero de entrada.

**Tech Stack**: Node 22, `node --test`, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga `—`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: nombres que dicen lo que hacen, funciones cortas.
- Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native: el hilo principal implementa cada task con TDD (RED, GREEN, commit).
- Un commit por task, al quedar limpia su revisión; mensajes convencionales (`feat: …`) referenciando 0010.
- Atribución de commits según las instrucciones de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "sala ocupada"` con motivo fuera de la lista (p. ej. `aburrimiento`) → mismo aviso y la reserva sigue activa (una cancelación válida posterior la cancela) · Task 1, `motivo fuera de la lista no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar», regla retirada de `quitar` intacta · Task 1, `cancelar sin reserva lo dice`
- Cancelar en otro día de la misma sala (lo más cercano a «la de otra persona») → «sin reserva Norte mar» y la de Norte lun sigue activa · Task 1, `cancelar no toca otras reservas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un filtro; nada más simple cumple la spec.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante usada en dos sitios (validación y aviso).
- [x] **Brownfield gate**: retrocompatible salvo el texto de `cancelar`, que la spec cambia; respeta el patrón de `src/app.js` (función exportada + rama en `run`); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo y lo guarda en `reason`; nueva `listCancelled`; `run` extrae `--motivo` de los parámetros de `cancelar` y atiende `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no toca `cancelar` ni `canceladas`.
- `scripts/lint.mjs` — sin cambios en lo que comprueba.

### 1.2 Modelo de datos

Campo `reason` (cadena) en la reserva con estado `cancelled`; en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`. Textos en la spec.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) es independiente.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado de módulo compartido entre tests: el orden altera el resultado | Media | Bajo | Tests en el orden de la spec dentro de `test/cancel.test.js` (decisión 10) |
| `--motivo` con valor de varias palabras mal extraído de `params` | Media | Medio | `run` toma el elemento siguiente a `--motivo`; el test usa `"sala ocupada"` como un solo parámetro |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet, effort medium: una función y su rama en `run`, con los textos ya dados.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo aburrimiento` o sin motivo ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada (parte de `findBooking(room, day)` y de `bookings` de `src/app.js`).
- Produce: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`; en la reserva cancelada, `reason` con el motivo; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden:
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → el mismo texto.
  - `cancelar sin reserva lo dice` (el actual, con `--motivo otro`): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar no toca otras reservas`: `run('cancelar', ['Norte', 'mar', '--motivo', 'otro'])` → `'sin reserva Norte mar'` (misma sala, otro día); el test siguiente demuestra que la de Norte lun seguía activa.
  - `cancelar una reserva activa` (reescribe el actual): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`; demuestra además que los intentos anteriores (sin motivo, motivo inválido, otro día) no cancelaron la reserva.
  Ejecuta y comprueba que fallan por el texto, no por un error de sintaxis.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)` en `src/app.js`: sin reserva activa → `sin reserva ${room} ${day}`; `reason` fuera de `CANCEL_REASONS` (o `undefined`) → `motivo no válido: ${CANCEL_REASONS.join(', ')}`; si no, estado `cancelled`, `booking.reason = reason`, retorna `cancelada ${room} ${day} (${reason})`. En `run`, la rama `cancelar` pasa `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está en `params`, o `undefined` si no.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet, effort medium: un filtro y su rama en `run`.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona escribe `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: de la Task 1, el campo `reason` de las reservas con `status: 'cancelled'` en `bookings`, y el orden de los tests de `test/cancel.test.js` (la cancelación de Norte lun ya hecha).
- Produce: `listCancelled()` → `string` (líneas `<sala> <día> — <motivo>` unidas con `\n`, cadena vacía si no hay); `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — al final de `test/cancel.test.js`:
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecuta y comprueba que falla porque `canceladas` responde `'salas'`.
- [ ] **Step 2: Implementación** — `listCancelled()` en `src/app.js`: filtra `bookings` por `status === 'cancelled'` y mapea a `${room} ${day} — ${reason}`; `run` atiende `cmd === 'canceladas'` con `listCancelled()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: el listado de canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas sobre un único fichero, sin dependencias ni datos persistentes; incertidumbre baja (el orden de los tests con estado compartido). Sin `estimation-log` de referencia.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela` y `cancelar sin motivo no cancela`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Regla retirada de `quitar` «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Regla retirada de `quitar` «la reserva de otra persona no se toca» → sin observar: el código no tiene noción de persona (avisado en las decisiones, nº 8); el test `cancelar no toca otras reservas` fija lo más cercano. ⚠
- Anuladas fuera del listado (decisión 6) → sin observar: sin API para sembrar una reserva anulada en los tests (avisado en las decisiones). ⚠
- Anulaciones (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela` ✓ · motivo fuera de la lista → Task 1, `motivo fuera de la lista no cancela` ✓ · sin reserva → Task 1, `cancelar sin reserva lo dice` ✓ · otras reservas → Task 1, `cancelar no toca otras reservas` ✓
