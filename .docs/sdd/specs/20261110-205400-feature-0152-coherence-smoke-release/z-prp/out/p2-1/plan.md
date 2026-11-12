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

1. `cancelar` sin `--motivo` mantiene su respuesta actual («cancelada Norte lun») — la spec no dice qué pasa sin motivo y `test/cancel.test.js` ya lo fija; exigirlo rompería esa conducta (brownfield). Esa cancelación no guarda motivo.
2. Un motivo fuera de la lista se rechaza antes de buscar la reserva: no cancela nada y responde lo mismo exista o no la reserva.
3. `canceladas` lista toda reserva en estado `cancelled`; las `voided` (anulaciones, 0011) no entran, como dice el Scope. Una cancelada sin motivo sale como «Norte lun — sin motivo» (corregido tras la revisión final: omitirla contradecía el Approach de la spec; el texto lo confirma el dev-lead).
4. Sin ninguna cancelada, `canceladas` responde la cadena vacía — la spec no fija texto y no se inventa uno.
5. Ejecución: native, fijado en `sdd-kit.json`. Modelo: la propia sesión (Native), sin despachos.
6. Coste estimado: ~0,5 h; sin despacho de subagentes.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` acepta `--motivo` de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`reason`) al pasar a `cancelled`; `canceladas` filtra `bookings` por ese estado. Todo en `src/app.js`, sin ficheros nuevos.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero existente, sin dependencias ni contratos nuevos entre módulos.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits referenciando la feature 0010; atribución según el kit.
- Ejecución native, sin subagentes por task.

## Review Focus

- `cancelar Norte lun --motivo vacaciones` (fuera de lista) → responde «motivo no válido: …» y la reserva sigue activa · Task 1, `cancelar con motivo fuera de la lista no cancela`
- `cancelar Norte lun` sin `--motivo` → «cancelada Norte lun», sin romper el test existente · Task 1, `cancelar una reserva activa` (ya existe) y `cancelar sin motivo no guarda motivo`
- Una reserva anulada (`anular`) no sale en `canceladas` → listado sin ella · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un parámetro opcional y un comando de listado; nada más.
- [x] **YAGNI gate**: sin abstracciones; solo la constante `MOTIVOS`.
- [x] **Brownfield gate**: retrocompatible (`cancelar` sin motivo igual que hoy); sigue el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, castellano, gate `node --test` en verde.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `MOTIVOS`, `cancelBooking(room, day, reason)` con validación y `reason` guardado, `listCancelled()` y los comandos `cancelar --motivo` / `canceladas` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios (por `run`, como los actuales).

**NO se tocan**:

- `voidBooking` y `anular` — anulaciones del responsable de sala son la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin relación.

### 1.2–1.5

No aplican (sin BD, migraciones, API ni UX).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor (`cancelar Norte lun --motivo`) | baja | bajo | `params[i + 1]` es `undefined`, no está en la lista → «motivo no válido…» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sesión Native (Sonnet, effort medium)
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend, tooling (lint)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)»

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `MOTIVOS` (`['cambio de planes', 'sala ocupada', 'otro']`); `cancelBooking(room, day, reason)` — `reason` opcional; guarda `booking.reason`; `run('cancelar', params)` lee `reason` de `params[params.indexOf('--motivo') + 1]` si el flag está.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`, y `run('libres', ['10:00-12:00'])` sigue siendo `'Sur'`.
  - `cancelar sin motivo no guarda motivo`: `run('cancelar', ['Norte', 'lun'])` → `'cancelada Norte lun'`.
  - Los tests comparten el array en memoria: cada uno restaura el estado o usa su propia reserva; el implementador lo resuelve con la API actual (`reservar` no crea reservas, así que se siembra importando `bookings`, que se exporta si hace falta).
  - Ver que fallan.
- [ ] **Step 2: Implementación** — `export const MOTIVOS`; en `cancelBooking(room, day, reason)`: si `reason !== undefined` y no está en `MOTIVOS`, devuelve `motivo no válido: ${MOTIVOS.join(', ')}`; después busca la reserva (`sin reserva …` como hoy), pone `status = 'cancelled'`, guarda `reason` y devuelve `cancelada ${room} ${day}` con ` (${reason})` si hay motivo. En `run`, `cancelar` pasa el motivo leído de `--motivo`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; esperado verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar con motivo`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sesión Native (Sonnet, effort medium)
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend, tooling (lint)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», `canceladas` imprime «Norte lun — sala ocupada»

**Interfaces**:
- Consume: `bookings` con `status: 'cancelled'` y `reason` (Task 1).
- Produce: `listCancelled()` → líneas `${room} ${day} — ${reason ?? 'sin motivo'}` unidas por `\n`; comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED**:
  - `canceladas enseña el motivo`: tras `cancelar Norte lun --motivo "sala ocupada"`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: tras `anular` de una reserva, `run('canceladas', [])` no la contiene.
  - Ver que fallan.
- [ ] **Step 2: Implementación** — `listCancelled()` filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason ?? 'sin motivo'}` y une con `\n`; `run('canceladas')` la devuelve.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; esperado verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas en un fichero, sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar — THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED Cancelar — AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista no cancela`. ✓
- ADDED Listado — THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones fuera de scope → Task 2, `canceladas no lista las anuladas`. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no guarda motivo`; fuera de lista → Task 1; anuladas → Task 2. ✓
