---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 con la sesión (Native), gama media (Sonnet, effort medium): un solo fichero, textos exactos de la spec, sin interpretar prosa. La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»** — la spec no lo fija; un motivo ausente no está en la lista, y la spec dice que cancelar «pide» un motivo. Consecuencia: el test existente `cancelar una reserva activa` (`cancelada Norte lun`, sin motivo) deja de valer y se reescribe con motivo en la Task 1.
4. **Orden de comprobaciones: primero la reserva, después el motivo** — así `cancelar Sur mar` sin reserva sigue respondiendo `sin reserva Sur mar` (test existente intacto) y un motivo inválido no cancela nada.
5. **`canceladas` lista solo el estado `cancelled`** (las `voided` de `anular` no salen: el alcance de anulaciones es la 0011), una línea `<sala> <día> — <motivo>` por reserva, unidas con `\n`; sin ninguna responde `sin canceladas` — la spec no fija el caso vacío.
6. **Riesgos altos**: ninguno; en memoria, sin migración.
7. **Coste estimado**: ~1 h de implementación; sin despachos de subagentes (solo la revisión final).
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar <sala> <día> --motivo <motivo>` guarda el motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda como campo `reason` de la reserva que pasa a `cancelled`, en `src/app.js` (el único fichero de entrada). `canceladas` filtra `bookings` por estado `cancelled`.

**Tech Stack**: Node ≥ 20 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Node ≥ 20, sin dependencias externas; todo en `src/app.js`.
- Texto de la interfaz en castellano; motivos exactos y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution Art. 2); los RED van en el commit de su task.
- Commits: uno por task al quedar limpia su revisión; mensaje en castellano, convención `feat:`, referenciando la 0010.
- Modo de ejecución: Native.

## Review Focus

- `cancelar Norte lun` (sin `--motivo`) → `motivo no válido: cambio de planes, sala ocupada, otro` y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "vacaciones"` → `motivo no válido: …` y la reserva sigue activa (aparece en `libres 10:00-12:00` como ocupada) · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → `sin canceladas`; una reserva anulada no aparece · Task 2, `canceladas sin canceladas` y `canceladas no lista anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un filtro; nada más simple.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante de uso doble (validar y mensaje).
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo (decisión 3, avisada); sigue el patrón del fichero; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (Art. 2), castellano (Art. 4), flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`; `cancelBooking(room, day, reason)` valida y guarda `reason`; `listCancelled()`; `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de ambas tasks; el existente `cancelar una reserva activa` pasa a llevar motivo.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `freeRooms` y `libres` — ya ignoran lo que no está `active`.

### 1.2 Modelo de datos

Campo `reason` (string) en la reserva cancelada; en memoria, sin migración.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `cancelar` sin motivo deja de funcionar para quien lo usaba así | media | bajo | decisión 3 avisada; el mensaje lista los motivos válidos |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: la sesión en Native, Sonnet con effort medium (sin despacho); textos exactos de la spec, un fichero.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo vacaciones` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js` (reserva `{ room, day, slot, status }`).
- Produce: `cancelBooking(room, day, reason)` → `string`; deja la reserva con `status: 'cancelled'` y `reason`. `run('cancelar', [room, day, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Implementación** —
  - Tests (en `test/cancel.test.js`; el reparto de estado entre tests lo resuelve el implementador reiniciando o usando días/salas distintos, porque `bookings` es global del módulo y `cancelar` muta):
    - `cancelar con motivo de la lista` (reescribe `cancelar una reserva activa`): `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `cancelada Norte lun (sala ocupada)`.
    - `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte','lun','--motivo','vacaciones'])` → `motivo no válido: cambio de planes, sala ocupada, otro`, y `run('libres', ['10:00-12:00'])` → `Sur` (la reserva de Norte sigue activa).
    - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → mismo mensaje de motivo no válido; reserva activa.
    - `cancelar sin reserva lo dice` (existente, intacto): `run('cancelar', ['Sur','mar'])` → `sin reserva Sur mar`.
  - `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}` (primero); `reason` fuera de `CANCEL_REASONS` (incluido `undefined`) → `motivo no válido: ${CANCEL_REASONS.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el argumento que sigue a `--motivo` en `params` (`undefined` si falta).
- [ ] **Step 2: Build** — no hay build (Node plano). Esperado: nada que compilar.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — Comando `canceladas`

**Tras**: Task 1
**Modelo**: la sesión en Native, Sonnet con effort medium (sin despacho); filtro y formato exactos de la spec.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona ejecuta `node src/app.js canceladas` y ve `Norte lun — sala ocupada`.

**Interfaces**:
- Consume: `cancelBooking(room, day, reason)` de la Task 1, que deja `status: 'cancelled'` y `reason`.
- Produce: `listCancelled()` → `string` (una línea `<sala> <día> — <motivo>` por reserva con `status === 'cancelled'`, unidas con `\n`; `sin canceladas` si no hay); `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Implementación** —
  - Tests:
    - `canceladas enseña el motivo`: tras `cancelar Norte lun --motivo "sala ocupada"`, `run('canceladas', [])` → `Norte lun — sala ocupada`.
    - `canceladas sin canceladas`: sin cancelaciones previas → `sin canceladas`.
    - `canceladas no lista anuladas`: tras `run('anular', ['Norte','lun'])`, `run('canceladas', [])` → `sin canceladas`.
  - `src/app.js`: `function listCancelled()` filtra `bookings` por `status === 'cancelled'`; `run`: `if (cmd === 'canceladas') return listCancelled();` antes del retorno por defecto.
- [ ] **Step 2: Build** — no hay build. Esperado: nada que compilar.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks en un fichero, textos exactos, sin migración; sin referencia en el estimation-log
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
- AND «un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»» → Task 1, `motivo fuera de la lista no cancela`. ✓
- THEN «`canceladas` responde «Norte lun — sala ocupada»» → Task 2, `canceladas enseña el motivo`. ✓
- «Dónde se prueba»: motivo por `cancelar` y listado por `canceladas`, ambos en `test/cancel.test.js`. ✓
- No entra: anulaciones (0011) → N/A (confirmado en spec); `canceladas no lista anuladas` fija que no se mezclan. ✓
- Review Focus: sin motivo → Task 1 `cancelar sin motivo no cancela`; motivo inválido → Task 1 `motivo fuera de la lista no cancela`; vacío y anuladas → Task 2 `canceladas sin canceladas` y `canceladas no lista anuladas`. ✓
