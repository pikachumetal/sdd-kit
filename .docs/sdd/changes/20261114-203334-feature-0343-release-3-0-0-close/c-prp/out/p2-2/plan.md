---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Una sola task — un cambio en un fichero (`src/app.js`) y una suite (`test/cancel.test.js`); partir motivo y listado no deja a un revisor aprobar una y rechazar la otra.
2. Modelo y effort: Native, la sesión implementa; gama media (Sonnet, effort medium) basta porque la task trae firmas y textos exactos. La revisión final de rama va con el modelo de `sdd-verify`.
3. Ejecución: native, fijado en `sdd-kit.json`.
4. Sin `--motivo`, `cancelar` responde «motivo no válido: …»: la spec dice que cancelar «pide» un motivo y no fija este caso. Por eso los dos tests existentes de `cancelar` pasan a llevar `--motivo`.
5. Las reservas viven en memoria compartida por todo el fichero de test: los tests de `cancelar` y `canceladas` dependen del orden en que están escritos (el primero cancela Norte lun). Se deja así: añadir un reinicio sería código solo para tests (YAGNI).
6. `canceladas` separa las líneas con `\n`; la spec solo fija el formato de una línea. Sin canceladas responde cadena vacía.
7. Riesgo alto: ninguno. Coste estimado: ~0,5 h, sin despacho de subagentes.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `cancelBooking` valida el motivo antes de buscar la reserva y lo guarda en `booking.reason`. `canceladas` filtra `bookings` por `status === 'cancelled'`. Todo en `src/app.js`, sin ficheros nuevos.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el fichero único `src/app.js`; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista de motivos cerrada, en este orden y con estos textos: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga `—`).
- Texto de interfaz y documentos en castellano (Art. 4). Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.

### De proceso

- Atribución de commits según el proyecto; git-flow, rama `feature/0010-cancel-reason`.
- Modo de ejecución: native.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», sin cancelar la reserva · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → cadena vacía · Task 1, `canceladas sin canceladas devuelve vacío` (se escribe la primera, antes de cancelar nada: en el orden del fichero va el primero)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un comando; nada más.
- [x] **YAGNI gate**: sin abstracciones; lista de motivos en una constante.
- [x] **Brownfield gate**: `anular` y `libres` intactos; `cancelar` cambia solo lo que pide la spec.
- [x] **Constitution check**: tests antes que código (Art. 2), castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`, motivo en `cancelBooking`, función `cancelledBookings`, comando `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests existentes llevan `--motivo`; tests nuevos de los escenarios.

**NO se tocan**:

- `test/app.test.js` — no usa `cancelar`.
- `voidBooking` — las anulaciones son la 0011.

### 1.2 a 1.5

No aplican (sin datos persistentes, migraciones, API ni UX).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests acoplados por el estado en memoria | media | bajo | orden de tests fijado en la task |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); no se despacha.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `findBooking(room, day)`, `bookings` y `run(cmd, params)` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` y el comando `canceladas` de `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado en memoria es compartido):
  - `canceladas sin canceladas devuelve vacío`: `assert.equal(run('canceladas', []), '')`.
  - `cancelar sin motivo no cancela`: `assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro')`.
  - `cancelar con motivo de la lista` (sustituye a `cancelar una reserva activa`): `assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)')`.
  - `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin reserva lo dice` (existente, ahora con motivo): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` devuelve `motivo no válido: ${REASONS.join(', ')}` antes de buscar la reserva; si existe, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`.
  - `cancelledBookings()`: devuelve `bookings` con `status === 'cancelled'` formateadas `${b.room} ${b.day} — ${b.reason}` unidas con `\n`.
  - `run`: `cancelar` toma el valor que sigue a `--motivo` en `params` (`params[params.indexOf('--motivo') + 1]`; `undefined` si falta la opción) y lo pasa como `reason`; `canceladas` devuelve `cancelledBookings()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo: `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 1 task, un fichero de código, sin dependencias; sin calibración previa en el log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo de la lista → «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND motivo fuera de la lista → «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista`. ✓
- `canceladas` → «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo, sin reserva y sin canceladas → Task 1, sus tests nombrados arriba. ✓
