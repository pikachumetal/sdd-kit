---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Una sola task, modelo Sonnet con effort medium (`sdd-kit:effort-medium` + `sonnet` si se despachara): cambio de un fichero con firmas y textos fijados por la spec. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. Ejecución `native`, fijado en sdd-kit.json: una task y un fichero; no hay interfaces entre tasks que auditar por separado.
3. `cancelar` valida el motivo antes de buscar la reserva: un motivo ausente o fuera de la lista responde «motivo no válido: …» aunque la reserva no exista. La spec no lo fija; es el orden más simple.
4. Los dos tests existentes de `cancelar` (sin `--motivo`) se actualizan: con el motivo obligatorio su salida cambia. Son consecuencia de la spec, no refactor.
5. `canceladas` lista solo `status === 'cancelled'`; las `voided` (anular) no entran, porque la spec deja las anulaciones fuera (0011).
6. Coste estimado: ~0,5 h; sin despacho de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda como campo `reason` de la reserva al cancelarla; `canceladas` filtra las reservas con estado `cancelled`. Todo en `src/app.js`, sin ficheros nuevos.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de respuesta literales: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Texto de la interfaz en castellano; Node 22 sin dependencias externas.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); código limpio.

### De proceso

- Tests antes que código (constitution 2).
- Git-flow: commits en `feature/0010-cancel-reason`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo otro` sin reserva → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`anular`) y otra cancelada → solo lista la cancelada · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y una función nueva en el fichero existente.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (motivo obligatorio); `anular` y `libres` intactos.
- [x] **Constitution check**: tests primero, castellano, git-flow.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y guarda el motivo; nueva `listCancelled`; `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — escenarios de la spec y ajuste de los dos tests existentes.

**NO se tocan**:

- `test/app.test.js` — no usa `cancelar`.
- `voidBooking` — las anulaciones son de la 0011.

### 1.2 a 1.6

No aplican (sin datos persistentes, API, UX ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo "sala ocupada"` llega partido en dos argumentos si se invoca sin comillas | baja | bajo | el shell entrega el valor entrecomillado como un argumento; el test llama a `run` con el valor entero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native lo ejecuta la sesión)
**Tests RED**: hilo principal · `test/cancel.test.js`, TDD del propio hilo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: la persona usuaria cancela con `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; `canceladas` muestra «Norte lun — sala ocupada». Nota: el estado es en memoria y cada invocación del CLI es un proceso nuevo, así que el listado se comprueba por los tests.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room: string, day: string, reason: string): string`; `listCancelled(): string` (una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`); `run('cancelar', [room, day, '--motivo', reason])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista`: `--motivo 'aburrimiento'` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` es el mismo mensaje.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` es `'sin reserva Sur mar'` (sustituye al test existente).
  - `canceladas enseña el motivo`: tras cancelar Norte lun con «sala ocupada», `run('canceladas', [])` es `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` no contiene `'Norte lun'`.
  - Reemplaza `cancelar una reserva activa` por `cancelar con motivo de la lista`. El estado de `bookings` es compartido entre tests del mismo fichero: ordénalos o reinicia el estado para que cada test parta de la reserva de Norte del lunes (la spec lo da como GIVEN); si no hay forma limpia sin tocar `src/app.js`, exporta `resetBookings()` desde `src/app.js` y úsala en `beforeEach`.
- [ ] **Step 2: Verificar RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos.
- [ ] **Step 3: Implementación** en `src/app.js`: constante `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar la reserva, guarda `booking.reason`; `listCancelled()`; en `run`, el motivo es el valor que sigue a `--motivo` en `params` (`undefined` si falta) y `canceladas` llama a `listCancelled`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: todo verde.
- [ ] **Step 5: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Base de la estimación: 1 task, 1 fichero, sin incertidumbres; el estado compartido entre tests es lo único a vigilar.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los escenarios de la spec (Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1, tests `cancelar con motivo de la lista` y `cancelar con motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope). ✓
- `cancelar` sin motivo → Task 1, `cancelar sin motivo lo rechaza`. ✓
- `cancelar` sin reserva → Task 1, `cancelar sin reserva lo dice`. ✓
- Anuladas fuera del listado → Task 1, `canceladas no lista las anuladas`. ✓
