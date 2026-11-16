---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, Native en la sesión actual; sirve Sonnet con effort medium, porque el plan trae firmas, textos y asserts. La revisión final de rama sigue la política de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Orden de comprobaciones en `cancelar`**: primero «sin reserva», después el motivo. Así el texto retirado de `quitar` («sin reserva <sala> <día>») se conserva idéntico, también sin `--motivo`, y un motivo inválido no cancela nada.
4. **`cancelar` sin `--motivo` (con reserva)**: responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. La spec dice que «cancelar pide un motivo» y no cubre este caso; lo fijo como motivo no válido.
5. **Formato de `canceladas`**: una línea `<sala> <día> — <motivo>` por reserva con estado `cancelled`, unidas con `\n`; sin canceladas, cadena vacía. Las `voided` (de `anular`) no entran: es la 0011.
6. **Regla retirada «la reserva de otra persona no se toca»**: el código no tiene propietario de reserva. Lo observa el test de que cancelar otro día no toca la reserva activa (es lo que ya cubre el parche 0007); el propietario llega con la 0011. ⚠ Aviso al dev-lead.
7. **Test existente `cancelar una reserva activa`**: cambia a incluir `--motivo`, porque su salida sin motivo deja de existir.
8. **Coste**: ~0,5 h, una task, sin subagentes.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda en la propia reserva (`reason`) al pasar a `cancelled`; `canceladas` filtra `bookings` por ese estado. Todo en `src/app.js`, sin ficheros nuevos.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo fichero; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Texto de la interfaz en castellano, literal de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (con raya larga).
- Lista de motivos cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits en castellano, convención del proyecto; sin `--no-verify`.
- Atribución de commits: la que fija el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` con reserva activa → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo vacaciones` → «motivo no válido: …» y la reserva sigue activa (no aparece en `canceladas`) · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → cadena vacía, no `undefined` ni cabecera · Task 1, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: campo `reason` en la reserva y un filtro; nada más.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, castellano, gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida el motivo y lo guarda; `listCancelled()`; `run` enruta `cancelar --motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de la spec; se actualiza el existente.

**NO se tocan**:

- `voidBooking` y `anular` — son de la 0011.
- `freeRooms` — ya ignora lo que no está `active`.

### 1.2–1.5

No aplican (sin datos persistentes, migraciones, API ni UX más allá de la salida de texto).

### 1.6 Dependencias

Parche 0007 (`cancelar` solo toca la reserva del día pedido): se conserva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | media | tests que dependen del orden | cada test cancela y consulta en el mismo test; los que cambian estado usan combinaciones sala/día distintas |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Sonnet con effort medium (`subagent_type: sdd-kit:effort-medium` + `model: sonnet` si se despachara; en Native lo hace la sesión).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.
**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». Con el estado en memoria, `canceladas` desde otra ejecución sale vacío: se ve en los tests, no en la CLI.

**Interfaces**:
- Consume: `bookings`, `findBooking(room, day)` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` → `string`; `listCancelled()` → `string`; `run('canceladas', [])`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (el estado es compartido en memoria y `node:test` los ejecuta en orden):
  1. `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`.
  2. `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  3. `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo texto; y `run('canceladas', [])` sigue `''`.
  4. `cancelar otro día no toca la reserva activa`: `run('cancelar', ['Norte', 'mar', '--motivo', 'otro'])` → `'sin reserva Norte mar'`.
  5. `cancelar una reserva activa` (el existente, actualizado): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`; y `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  6. `cancelar sin reserva lo dice` (sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  Ejecutarlos y ver que fallan (RED).
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; motivo fuera de `REASONS` (o `undefined`) → `motivo no válido: ${REASONS.join(', ')}`; si no, `status = 'cancelled'`, `reason`, y `cancelada ${room} ${day} (${reason})`.
  - `export function listCancelled()`: reservas `cancelled` → `${room} ${day} — ${reason}` unidas con `\n`.
  - `run`: `cancelar` lee el motivo tras `--motivo`; `canceladas` → `listCancelled()`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, tras su revisión limpia, referenciando la 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: una task en un solo fichero; sin incertidumbres salvo el estado compartido en memoria de los tests
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
- AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela`. ✓
- THEN `canceladas` «Norte lun — sala ocupada» → Task 1, `cancelar una reserva activa` (segunda aserción). ✓
- `quitar`: «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- `quitar`: «la reserva de otra persona no se toca» → Task 1, `cancelar otro día no toca la reserva activa` (sin propietario en el código; avisado en las decisiones). ⚠
- Review Focus (3 líneas) → Task 1, tests nombrados arriba. ✓
