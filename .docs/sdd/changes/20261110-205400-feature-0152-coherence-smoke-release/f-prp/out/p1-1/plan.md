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

1. Modelo y effort por task: el hilo principal de la sesión, sin subagentes; ambas tasks son un cambio corto en `src/app.js` con el código y los textos fijados por la spec. La revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. El motivo se valida **antes** de buscar la reserva: `cancelar` sin `--motivo`, o con uno fuera de la lista, responde «motivo no válido: cambio de planes, sala ocupada, otro» aunque la sala no tenga reserva. La spec no fija el orden; así la validación no depende del estado de las reservas.
4. `cancelar` sin `--motivo` es motivo no válido (la spec dice que cancelar «pide» un motivo). Cambia el test existente `cancelar una reserva activa`, que cancelaba sin motivo.
5. `canceladas` lista solo el estado `cancelled` (no las `voided`), una línea por reserva, en el orden de `bookings`; sin ninguna responde «sin canceladas» (texto que la spec calla, ver Review Focus).
6. El motivo se guarda en la reserva como `reason`.
7. Riesgos altos: ninguno. Coste estimado: 1 h, sin despacho de subagentes.
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` enseña las reservas canceladas con su motivo.

**Architecture**: `cancelBooking` recibe el motivo, lo valida contra una constante `CANCEL_REASONS` y lo guarda en la reserva; `run` extrae el valor tras `--motivo`. `canceladas` es un comando nuevo de `run` que filtra `bookings` por `status === 'cancelled'`. Todo en `src/app.js`, el único fichero de entrada.

**Tech Stack**: Node ≥ 20, sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; los literales de la spec, exactos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (el guion es `—`).
- Lista de motivos cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Sin dependencias externas; un solo fichero de entrada: `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa cada task, TDD (RED visto antes del código) y un commit por task al quedar limpia su revisión.
- Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `canceladas sin canceladas lo dice`
- una reserva anulada (`anular`) no aparece en `canceladas` → por inspección del filtro `status === 'cancelled'` en la revisión: no se puede sembrar una anulada sin consumir la única reserva activa

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks sobre un fichero, sin abstracciones nuevas salvo la constante de motivos.
- [x] **YAGNI gate**: nada se abstrae con menos de 3 usos.
- [x] **Brownfield gate**: respeta el patrón de `src/app.js`; sin refactor fuera de scope. Retrocompatibilidad: `cancelar` sin motivo deja de funcionar, que es lo que pide la spec.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; `run` lee `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado; los dos existentes pasan a llevar `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, es la 0011.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` es estado de módulo: los tests comparten reservas | Media | Bajo | Cada test cancela una reserva distinta o lee el estado que dejó el anterior, en el orden del fichero (ver Task 2) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal de la sesión (Native), gama media.
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reservas `{ room, day, slot, status }`).
- Produce: `export function cancelBooking(room, day, reason)`; la reserva cancelada lleva `reason`; `run('cancelar', [room, day, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituir los dos tests existentes por:
  - `cancelar con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`
  - `cancelar con motivo fuera de la lista lo rechaza`: `['Norte', 'lun', '--motivo', 'aburrimiento']` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  - `cancelar sin motivo lo rechaza`: `['Norte', 'lun']` → el mismo texto
  - `cancelar sin reserva lo dice`: `['Sur', 'mar', '--motivo', 'otro']` → `'sin reserva Sur mar'`

  Orden en el fichero: los dos de rechazo antes de `cancelar con motivo` (que consume la reserva de Norte lun). Ver cada uno fallar.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${CANCEL_REASONS.join(', ')}` `` si `reason` no está en la lista, antes de buscar la reserva; guarda `booking.reason = reason` y responde `` `cancelada ${room} ${day} (${reason})` ``. En `run`, `reason` es el elemento tras `--motivo` en `params` (`undefined` si no está).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: hilo principal de la sesión (Native), gama media.
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.reason` y `status: 'cancelled'` de la Task 1.
- Produce: `export function cancelledBookings()` → texto: una línea `` `${room} ${day} — ${reason}` `` por reserva cancelada, unidas con `\n`, o `sin canceladas`; `run('canceladas', [])` lo devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden, tras los de la Task 1:
  - `canceladas sin canceladas lo dice`: el primero del fichero, antes de cancelar nada: `run('canceladas', [])` → `'sin canceladas'`.
  - `canceladas enseña el motivo`: tras `cancelar con motivo` (Norte lun, «sala ocupada») `run('canceladas', [])` → `'Norte lun — sala ocupada'`.

  Ver fallar ambos.
- [ ] **Step 2: Implementación** — en `src/app.js`: `cancelledBookings()` filtra `bookings` por `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` `` y une con `\n`; si no hay, `'sin canceladas'`. `run`: `if (cmd === 'canceladas') return cancelledBookings();` antes del `return 'salas'` final.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.25h
- Estimación de cierre: 0.25h
- Base de la estimación: 2 tasks cortas sobre un fichero, sin incertidumbre; sin estimation-log previo
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; no hay `operations.md`)
- [ ] Verificación de los criterios de éxito de la spec (Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo`. ✓
- AND motivo fuera de la lista → «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN `canceladas` → «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza` ✓; sin reserva → Task 1, `cancelar sin reserva lo dice` ✓; sin canceladas → Task 2, `canceladas sin canceladas lo dice` ✓; anulada fuera del listado → inspección del filtro en la revisión ⚠ (avisado en las decisiones).
