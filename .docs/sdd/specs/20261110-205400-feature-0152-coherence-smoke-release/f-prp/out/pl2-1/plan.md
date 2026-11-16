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

1. **Una sola task, en Native, Sonnet con effort medium** — el cambio cabe en `src/app.js` y `test/cancel.test.js`; no hay interfaz entre tasks que revisar por separado.
2. **Ejecución: native** — una task, un fichero de código, un error lo caza el test de la task y el plan cabe en un contexto.
3. **El motivo es obligatorio en `cancelar`** — la spec dice «cancelar pide un motivo» pero no qué pasa sin `--motivo`. Sin él responde lo mismo que con un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». Los dos tests de `test/cancel.test.js` que hoy llaman a `cancelar` sin motivo pasan a llevarlo: es un cambio de comportamiento ya previsto por la spec, no una regresión.
4. **El motivo se valida antes de buscar la reserva** — un motivo inválido responde «motivo no válido…» aunque no haya reserva; «sin reserva <sala> <día>» sale solo con motivo válido. Texto de «sin reserva» sin cambios.
5. **`canceladas` lista solo el estado `cancelled`** — las `voided` (comando `anular`, 0011) no salen. Sin canceladas responde cadena vacía, como `libres` cuando no hay sala. Una línea por reserva, `<sala> <día> — <motivo>`, separadas por `\n`.
6. **El motivo se guarda como `reason` en la reserva** — `bookings[i].reason`; `anular` no lo toca.
7. **Estado compartido entre tests** — `bookings` vive en memoria del módulo y la reserva de Norte del lunes es única: los tests de `cancel.test.js` van en este orden (motivo inválido, sin reserva, cancelada, listado) porque el listado depende de la cancelación anterior.
8. **Coste estimado**: ~1,5 h en total; sin subagentes de tarea, solo la revisión final de rama.
9. **Aviso sobre la spec (no bloquea)**: los dos `ADDED` del delta describen `cancelar` con motivo, que ya existe; el cambio de su respuesta («cancelada Norte lun» → «cancelada Norte lun (sala ocupada)») es en rigor un `MODIFIED`, y la numeración de «Decisiones que he tomado yo» salta de 1 a 3. Y la regla retirada «la reserva de otra persona no se toca» no tiene dónde probarse (ver §4). Se corrigen en la spec al cerrar o antes, si el dev-lead lo prefiere.
10. **Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.**

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda; el comando nuevo `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: un solo módulo, `src/app.js`. `cancelBooking(room, day, reason)` valida el motivo contra una constante `CANCEL_REASONS`, lo guarda en la reserva y `run` extrae `--motivo` de los argumentos; `listCancelled()` filtra por estado `cancelled`. Sin dependencias ni módulos nuevos.

**Tech Stack**: Node 22 (`engines >=20`), ESM, `node --test`, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, porque una sola task en un fichero de código, un error lo caza el test de su task y el plan cabe en un contexto · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato nuevos entre módulos o datos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>», «sin reserva <sala> <día>».
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Texto de la interfaz en castellano (constitution, Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Tests antes que código (constitution, Art. 2).
- Modo de ejecución por defecto: native; commits con la convención del proyecto y la atribución que fije la sesión.
- Git-flow: rama `feature/0010-cancel-reason`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`voided`) → no la lista · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones y un `if` en `run`.
- [x] **YAGNI gate**: sin abstracción nueva.
- [x] **Brownfield gate**: respeta el patrón de `cancelBooking`/`voidBooking`; `anular` intacto; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (Art. 2), castellano (Art. 4), flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, `listCancelled`, `--motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los tests del escenario nuevo y los dos existentes con `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no toca `cancelar`.
- `README.md` y `CHANGELOG.md` — el changelog lo escribe el cierre de la release.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Memoria, sin migración.

### 1.6 Dependencias

Parte de la 0007 (cancelación por sala y día). Sin servicios ni librerías.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten `bookings` y dependen del orden | media | bajo | Orden fijado en la decisión 7; el listado asegura su GIVEN con el test de cancelación previo |
| Un motivo con espacios llega partido si no se cita | baja | bajo | Se lee el argumento siguiente a `--motivo`; el shell lo entrega entero si va entre comillas |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: sesión Native (Sonnet, effort medium); sin despacho de subagente.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `canceladas` en el mismo proceso vería «Norte lun — sala ocupada» (el estado vive en memoria: dentro de un proceso).

**Interfaces**:
- Consume: nada (parte de `findBooking(room, day)` y `bookings` de `src/app.js`).
- Produce: `export const bookings` (la lista que ya existe, ahora exportada); `export const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `export function cancelBooking(room, day, reason)`; `export function listCancelled()` → `string`; `run('canceladas', [])` y `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden y con estos asserts:
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con un motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo texto.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar una reserva activa pide el motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: último del fichero; hace `bookings.push({ room: 'Sur', day: 'mar', slot: '10:00-12:00', status: 'voided' })` y comprueba que `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'`. Para sembrarla, `src/app.js` pasa a exportar `bookings` (`export const bookings`).
  Los dos tests actuales de `cancelar` se sustituyen por `cancelar una reserva activa pide el motivo` y `cancelar sin reserva lo dice`.
- [ ] **Step 2: Ver los RED** — `node --test test/cancel.test.js` falla por las respuestas nuevas.
- [ ] **Step 3: Implementación** en `src/app.js`: `CANCEL_REASONS`; `cancelBooking(room, day, reason)` valida primero `CANCEL_REASONS.includes(reason)` (si no, `motivo no válido: ${CANCEL_REASONS.join(', ')}`), luego `findBooking` (sin reserva → texto actual), guarda `booking.reason = reason`, `status = 'cancelled'` y devuelve `cancelada ${room} ${day} (${reason})`; `listCancelled()` filtra `status === 'cancelled'` y devuelve `` `${room} ${day} — ${reason}` `` unidas por `\n`; en `run`, `cancelar` lee el valor tras `--motivo` (`params[params.indexOf('--motivo') + 1]`, `undefined` si falta) y `canceladas` llama a `listCancelled()`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.25h
- Estimación de cierre: 0.25h
- Base de la estimación: 1 task, 1 fichero de código, sin incertidumbre técnica; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)»
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar pide un motivo — THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa pide el motivo`. ✓
- ADDED Cancelar pide un motivo — AND motivo fuera de la lista → «motivo no válido: …» → Task 1, `cancelar con un motivo fuera de la lista lo rechaza`. ✓
- ADDED El listado enseña el motivo — THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- `quitar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- `quitar`: la reserva de otra persona no se toca → sin observar: el código no tiene noción de propietario de la reserva y la spec no la introduce (avisado en las decisiones, punto 9). ⚠
- No entra: anulaciones del responsable de sala → N/A (0011; `voidBooking` intacto). ✓
- Review Focus → Task 1, `cancelar sin motivo lo rechaza`, `cancelar sin reserva lo dice` y `canceladas no lista las anuladas`. ✓
