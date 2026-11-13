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

1. **Modelo y effort**: Native, la sesión implementa las dos tasks en gama media (Sonnet, effort medium): los textos y las firmas ya van escritos en el plan. La revisión final de rama no sigue esta política: sus ejes Spec y Arquitectura van con `sdd-kit:effort-high` + `opus` y Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json` (`execution: native`).
3. **Sin `--motivo`**: `cancelar Norte lun` a secas responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. La spec dice que cancelar «pide un motivo» y no fija este caso; lo trato como motivo fuera de la lista.
4. **Orden de comprobaciones**: primero que exista la reserva (`sin reserva …`), después el motivo. Así el test existente «cancelar sin reserva lo dice» sigue como está.
5. **Motivo exacto**: se compara literal con la lista (minúsculas, tal como la escribe la spec); «Sala ocupada» no vale. `--motivo` sin valor es motivo no válido.
6. **`canceladas` sin canceladas** responde `sin canceladas` (texto mío; la spec no lo fija). Con varias, una línea `<sala> <día> — <motivo>` por reserva, en orden de reserva. Las `voided` (comando `anular`) no salen: son del 0011.
7. **Estado compartido de los tests**: `app.js` guarda las reservas en memoria y los tests de un fichero comparten proceso. Exporto `resetBookings()` (restaura la reserva de Norte del lunes) y lo llaman con `beforeEach`; sin él, el primer test que cancela Norte lun deja a los demás sin reserva y el resultado depende del orden. Tres o más usos reales en `cancel.test.js`.
8. **Test existente que cambia**: `cancelar una reserva activa` esperaba `cancelada Norte lun`; pasa a llevar `--motivo "sala ocupada"` y a esperar `cancelada Norte lun (sala ocupada)`. Es el efecto directo de la spec, no un refactor.
9. **Spec: dos cabos que no toco** (está aprobada): el delta declara `bookings` como «Modificadas» pero `.docs/sdd/capabilities/` no existe, y sus escenarios son `ADDED`, aunque el primero cambia la respuesta de `cancelar` de «cancelada Norte lun» a «cancelada Norte lun (sala ocupada)». Lo recojo para `sdd-archive`: el merge de capacidades tendrá que crear `bookings`, y esa respuesta anterior no tiene escenario que retirar. Además la numeración de «Decisiones» de la spec salta del 1 al 3. Si el dev-lead quiere enmendar, que lo diga antes de cerrar.
10. **Riesgos altos**: ninguno.
11. **Coste estimado**: ~1 h, 2 tasks, sin subagentes de implementación; solo los de la revisión final.
12. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva, y el nuevo comando `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status: 'cancelled'`. `cancelBooking` valida el motivo antes de cambiar el estado; `canceladas` filtra `status === 'cancelled'`. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node ≥ 22 (`engines` ≥ 20), ESM, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un comando más y un campo en `src/app.js`, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs` falla).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas. La constitution del proyecto no tiene artículo de calidad: valen esas dos reglas.

### De proceso

- Native: la sesión implementa cada task con `sdd task start` / `sdd task done`; RED antes que código (constitution, art. 2).
- Commit por milestone (apertura, una por task, cierre), en castellano, con el pie `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Sin `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- Motivo fuera de la lista (`--motivo vacaciones`) → mismo mensaje y la reserva sigue activa (se puede cancelar después con un motivo válido) · Task 1, `un motivo no válido no cancela la reserva`
- `--motivo "Sala ocupada"` (mayúsculas) → motivo no válido, comparación exacta · Task 1, `el motivo se compara literal`
- `canceladas` sin ninguna cancelada → `sin canceladas` · Task 2, `canceladas sin canceladas`
- Reserva anulada con `anular` → no aparece en `canceladas` · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: sí, un campo y un comando; `resetBookings` es la única pieza añadida y la justifica el estado compartido.
- [ ] **YAGNI gate**: sin abstracciones nuevas; la lista de motivos es una constante.
- [ ] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (la respuesta de `cancelar`); sin refactor fuera de scope.
- [ ] **Constitution check**: tests antes que código (art. 2), git-flow (art. 3), interfaz en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)` valida y guarda `reason`, `canceledList()` para el comando `canceladas`, `resetBookings()`, y el despacho de `run`.
- `test/cancel.test.js` — `beforeEach(resetBookings)`, el test existente con motivo y los tests nuevos.

**NO se tocan**:

- `test/app.test.js` — no usa `cancelar` ni `canceladas`.
- `voidBooking` y el comando `anular` — son del 0011.
- `scripts/lint.mjs` — solo lee `src/app.js`.

### 1.2 a 1.6

No aplican (sin datos persistentes, migraciones, API, UX ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | Alta | Medio | `resetBookings()` en `beforeEach` (Task 1) |
| `--motivo` con espacios llega partido | Baja | Medio | `process.argv` ya entrega `"sala ocupada"` como un solo argumento; los tests pasan el array con el valor entero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); el plan trae las firmas y los textos.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona escribe `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada (parte de `findBooking(room, day)` y de las reservas en memoria de `src/app.js`).
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`; `resetBookings()` → `void`, restaura `bookings` a la reserva `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; `reason` guardado en la reserva cancelada.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, `beforeEach(() => resetBookings())` e import de `resetBookings`. Tests, con `run('cancelar', [...])`:
  - `cancelar una reserva activa` (existente, cambia): `['Norte', 'lun', '--motivo', 'sala ocupada']` → `cancelada Norte lun (sala ocupada)`.
  - `cancelar sin reserva lo dice` (existente, sin cambios): `['Sur', 'mar']` → `sin reserva Sur mar`.
  - `un motivo fuera de la lista se rechaza`: `['Norte', 'lun', '--motivo', 'vacaciones']` → `motivo no válido: cambio de planes, sala ocupada, otro`.
  - `un motivo no válido no cancela la reserva`: tras el rechazo, `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `cancelada Norte lun (otro)`.
  - `cancelar sin motivo no cancela`: `['Norte', 'lun']` → el mismo mensaje de motivo no válido; después, cancelar con `otro` responde `cancelada Norte lun (otro)`.
  - `el motivo se compara literal`: `--motivo 'Sala ocupada'` → motivo no válido.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`; fallan los nuevos y el de `(sala ocupada)` (`resetBookings` aún no existe: falla en el import).
- [ ] **Step 3: Implementación mínima** — en `src/app.js`: `REASONS`; `resetBookings()`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; `reason` fuera de `REASONS` → `motivo no válido: ${REASONS.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el valor que sigue a `--motivo` (`undefined` si falta la opción o el valor): `cancelBooking(params[0], params[1], motivo)`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión (`commit-milestones.md`): `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona escribe `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `cancelBooking(room, day, reason)`, `reason` guardado en la reserva y `resetBookings()` de la Task 1.
- Produce: comando `canceladas` en `run(cmd, params)` → `string`; `listCancelled()` → `string`: una línea `${room} ${day} — ${reason}` por reserva con `status === 'cancelled'`, unidas con `\n`, o `sin canceladas` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `el listado de canceladas enseña el motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, luego `run('canceladas', [])` → `Norte lun — sala ocupada`.
  - `canceladas sin canceladas`: `run('canceladas', [])` → `sin canceladas`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])`, luego `run('canceladas', [])` → `sin canceladas`.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`; los tres fallan (`canceladas` cae en `salas`).
- [ ] **Step 3: Implementación mínima** — `listCancelled()` y la rama `if (cmd === 'canceladas') return listCancelled();` en `run`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: el listado de canceladas enseña el motivo (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; no hay `operations.md`) → `ℹ fail 0`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo»: AND motivo fuera de la lista → mensaje de motivo no válido → Task 1, `un motivo fuera de la lista se rechaza`. ✓
- ADDED «El listado enseña el motivo»: THEN `Norte lun — sala ocupada` → Task 2, `el listado de canceladas enseña el motivo`. ✓
- «No entra: anulaciones del responsable (0011)» → N/A, `voidBooking` no se toca. ✓
- Línea 1 del Review Focus → Task 1, `cancelar sin motivo no cancela`. ✓
- Línea 2 → Task 1, `un motivo no válido no cancela la reserva`. ✓
- Línea 3 → Task 1, `el motivo se compara literal`. ✓
- Línea 4 → Task 2, `canceladas sin canceladas`. ✓
- Línea 5 → Task 2, `canceladas no lista las anuladas`. ✓
