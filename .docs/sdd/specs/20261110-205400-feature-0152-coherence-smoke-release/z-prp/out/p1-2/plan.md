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

1. **Modelo y effort**: una sola task, `sonnet` con effort medium: el plan lleva firmas, textos y tests escritos; no hay prosa que interpretar. La revisión final de rama sigue la política de `sdd-verify` (ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json` (una task, un fichero de código).
3. **`cancelar` sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: …»): la spec dice que cancelar «pide» un motivo y no fija este caso. Por eso el test existente `cancelar una reserva activa` (sin motivo) pasa a llevarlo.
4. **Orden de validación**: primero el motivo, luego la reserva. Una cancelación sin motivo válido no mira si la reserva existe.
5. **`canceladas` sin ninguna cancelada** responde `sin canceladas` (la spec no lo fija; sigue el estilo de `sin reserva …`).
6. **`canceladas` lista solo las de estado `cancelled`**, no las `voided` de `anular` (la 0011 es la de las anulaciones). Una por línea, `<sala> <día> — <motivo>`, en el orden de la reserva.
7. **Riesgos altos**: ninguno. Coste estimado: 1 h; sin despacho de subagentes.
8. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; el comando `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status`. `cancelBooking` recibe el motivo ya extraído de `--motivo` por `run`, y valida contra una constante `REASONS`. `canceladas` filtra `bookings` por `status === 'cancelled'`.

**Tech Stack**: Node 22 sin dependencias, un solo fichero de entrada `src/app.js`, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano (constitución, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin dependencias externas (`architecture.md`).

### De proceso

- Tests antes que código (constitución, art. 2).
- Modelo por defecto de las tasks: gama media; `fable` y `opus xhigh` exigen justificación.
- Commits en castellano, `feat:`/`docs:`, con la atribución del kit al final.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo pide uno de la lista`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 1, `canceladas sin canceladas lo dice`
- `canceladas` no lista las anuladas (`voided`) → solo `cancelled` · sin test: no hay una segunda reserva activa que sembrar sin API nueva; lo cubre el filtro `status === 'cancelled'`, que el revisor comprueba en `src/app.js`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo más en la reserva, una constante y un comando.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar exige motivo); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, texto en castellano, gate `node --test`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)`, función `cancelledList()`, y `run` extrae `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — tests de la spec; el existente `cancelar una reserva activa` pasa a llevar motivo.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y `anular` — son de la 0011.
- `scripts/lint.mjs` — sin cambios.

### 1.2 a 1.5

No aplican (sin datos persistentes, migraciones, API ni UX más allá de la salida de línea de comandos).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests de `cancel.test.js` comparten el estado de `bookings` (un solo proceso por fichero) | media | bajo | El orden de los tests es parte del contrato: los que no cancelan van antes del que cancela, y `canceladas` va después |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la ejecuta el hilo principal; el dato vale si se retoma con subagente)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela con `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; luego `canceladas` le responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: nada de otras tasks; usa `findBooking(room, day)` y `bookings` de `src/app.js`.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`; `cancelledList()` → `string`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten `bookings`):
  - `canceladas sin canceladas lo dice`: `run('canceladas', [])` → `'sin canceladas'`
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  - `cancelar sin motivo pide uno de la lista`: `run('cancelar', ['Norte', 'lun'])` → el mismo texto, y después `run('canceladas', [])` sigue en `'sin canceladas'`
  - `cancelar sin reserva lo dice` (el existente, con motivo): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`
  - `cancelar una reserva activa con motivo` (sustituye al existente): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`

  Ejecuta `node --test test/cancel.test.js` y comprueba que fallan por lo esperado.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` si `reason` no está en `REASONS` (antes de buscar la reserva), y si cancela guarda `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``; `cancelledList()` filtra `status === 'cancelled'`, mapea a `` `${room} ${day} — ${reason}` `` y las une con `\n`, o `'sin canceladas'` si no hay; `run` toma el motivo del valor que sigue a `--motivo` en `params` (`undefined` si falta) y añade `if (cmd === 'canceladas') return cancelledList();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: motivo al cancelar y listado de canceladas (0010)`, uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 1 task, un fichero de código, sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde
- [ ] Verificación de los criterios de éxito de la spec (§Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «responde «cancelada Norte lun (sala ocupada)»» → Task 1, `cancelar una reserva activa con motivo`. ✓
- «un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- «`canceladas` responde «Norte lun — sala ocupada»» → Task 1, `canceladas enseña el motivo`. ✓
- «anulaciones del responsable de sala» (no entra, 0011) → N/A (confirmado en spec). ✓
- `cancelar` sin motivo → Task 1, `cancelar sin motivo pide uno de la lista`. ✓
- `canceladas` vacío → Task 1, `canceladas sin canceladas lo dice`. ✓
- `canceladas` sin las anuladas → sin observar: no hay una segunda reserva activa que sembrar sin API nueva (avisado en las decisiones y el Review Focus). ⚠
