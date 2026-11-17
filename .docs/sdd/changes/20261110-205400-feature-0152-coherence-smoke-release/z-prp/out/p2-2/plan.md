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

1. Modelo por task: `sdd-kit:effort-low` + `sonnet` no aplica en Native; la sesión implementa ambas tasks (cambios de pocas líneas en un fichero) — la revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar <sala> <día>` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela: la spec pide un motivo de la lista y calla este caso. El test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
4. `cancelar` con motivo válido pero sin reserva activa responde «sin reserva <sala> <día>» (el comportamiento de hoy); el motivo se valida antes.
5. `canceladas` sin ninguna cancelada responde «sin canceladas»; las anuladas (`voided`) no se listan (son de la 0011).
6. Coste estimado: ~1 h; sin subagentes.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda en la reserva (`reason`) al pasar a `cancelled`; `canceladas` filtra por ese estado. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node ≥ 20, ESM, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code. Texto de interfaz en castellano.

### De proceso

- Native, un commit por task al quedar limpia su revisión; tests antes que código (Art. 2).
- Commits con la atribución que fija el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», la reserva sigue activa · Task 1, `Rejects_missing_reason`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `Reports_no_booking_with_valid_reason`
- `canceladas` sin canceladas, o con una anulada → «sin canceladas» · Task 2, `Lists_none_when_no_cancelled` y `Lists_none_when_only_voided`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y un comando.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo el cambio pedido (motivo obligatorio); respeta el patrón de `run`.
- [x] **Constitution check**: tests primero, texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)`, constante `reasons`, función `cancelledList()`, rama `canceladas` y parseo de `--motivo` en `run`.
- `test/cancel.test.js` — tests de ambas tasks; el existente pasa a llevar `--motivo`.

**NO se tocan**:

- `voidBooking` y `anular` — son de la 0011.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Motivo con espacios mal parseado (`--motivo "sala ocupada"`) | Media | Medio | `run` recibe el valor ya como un solo argumento; test con «sala ocupada» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: nada
- Produce: `cancelBooking(room, day, reason)` guarda `booking.reason`; `const reasons = ['cambio de planes', 'sala ocupada', 'otro']`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED y implementación** — tests: `cancelar una reserva activa con motivo` (`run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`), `Rejects_invalid_reason` (`--motivo vacaciones` → `'motivo no válido: cambio de planes, sala ocupada, otro'`), `Rejects_missing_reason` (sin `--motivo`, mismo texto, y `libres 10:00-12:00` sigue sin Norte), `Reports_no_booking_with_valid_reason` (`['Sur','mar','--motivo','otro']` → `'sin reserva Sur mar'`); el test existente `cancelar sin reserva lo dice` pasa a esta última. Implementar: en `run`, `reason = params[params.indexOf('--motivo') + 1]` (undefined si falta); `cancelBooking` valida contra `reasons` antes de buscar la reserva.
- [ ] **Step 2: Build** — no aplica (sin build). Esperado: verde.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», `canceladas` responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` de la Task 1
- Produce: `run('canceladas', [])` → líneas `<sala> <día> — <motivo>` unidas por `\n`, o `'sin canceladas'`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED y implementación** — tests: `El listado de canceladas enseña el motivo` (cancelar Norte lun con «sala ocupada» y `run('canceladas', [])` → `'Norte lun — sala ocupada'`), `Lists_none_when_no_cancelled` (con estado limpio o solo anuladas → `'sin canceladas'`; el estado es un módulo compartido: el test que cancela corre el último o restaura la reserva). Implementar `cancelledList()` y la rama `canceladas` en `run`.
- [ ] **Step 2: Build** — no aplica. Esperado: verde.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `Rejects_invalid_reason`. ✓
- THEN `canceladas` responde «Norte lun — sala ocupada» → Task 2, `El listado de canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus → Task 1 `Rejects_missing_reason`, `Reports_no_booking_with_valid_reason`; Task 2 `Lists_none_when_no_cancelled`, `Lists_none_when_only_voided`. ✓
