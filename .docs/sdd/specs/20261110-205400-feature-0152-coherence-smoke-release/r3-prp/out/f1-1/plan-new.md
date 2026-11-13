---
id: 20261111-193520-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace el hilo principal (Native), en gama media (Sonnet, effort medium) — el plan trae las firmas y los asserts, y cada task es de ~15 líneas. La revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no se despacha (ver Eje Arquitectura).
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Dos tasks: la 1 (cancelar con motivo + `resetBookings`) deja la aplicación usable por sí sola; la 2 (`canceladas`) depende de que ya se guarde el motivo. Tras la Task 1 se para, como pidió el dev-lead: «cuando tengas el commit de la Task 1, para.»
4. Los escenarios de la spec que usan `canceladas` (los dos «sigue enseñando» y «anulada → cancelar → sin canceladas») se prueban en la Task 2, no en la 1: no existe `canceladas` hasta entonces.
5. Coste estimado: ~1,5 h, sin despachos salvo la revisión final.
6. Review Focus: 5 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` pide un motivo de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: todo en `src/app.js`: una constante con los motivos, validación antes de buscar la reserva, campo `reason` en la reserva y un filtro por estado para el listado; `resetBookings()` restaura la reserva sembrada para que los tests no dependan del orden.

**Tech Stack**: Node 22, sin dependencias, `node --test` (`operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y tests: ni módulo, ni dependencia, ni contrato entre módulos o datos nuevos.

## Restricciones globales

### De código

- Node 22, ES modules, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Texto de la interfaz en castellano (constitution, Art. 4); los motivos y mensajes, literales de la spec.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, Art. 2); un commit por task al quedar limpia.
- Commits con la atribución que fije la sesión.
- Modelos: el hilo principal ejecuta las tasks; nada de `fable` ni `opus xhigh` sin justificarlo aquí.

## Review Focus

- `cancelar` sin sala ni día (`cancelar`, `cancelar Norte`) → `motivo no válido: …` (decisión 14) · Task 1, `cancelar sin argumentos responde el error de motivo`
- `cancelar Norte lun Otro` (mayúscula) → `motivo no válido: …` y la reserva sigue activa · Task 1, `un motivo con mayúscula no vale`
- `cancelar Norte lun otro extra` → `motivo no válido: …` · Task 1, `un motivo con palabras de más no vale`
- Volver a cancelar o anular una reserva ya cancelada → `sin reserva Norte lun`, y `canceladas` conserva su motivo · Task 2, `cancelar y anular una cancelada responde sin reserva y conserva el motivo`
- `canceladas` con argumentos → los ignora (decisión 14) · Task 2, `canceladas ignora los argumentos`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, una validación y un filtro; sin modo interactivo.
- [x] **YAGNI gate**: nada se abstrae; `resetBookings()` tiene dos usos reales (los dos ficheros de test).
- [x] **Brownfield gate**: retrocompatible salvo lo declarado (cancelar sin motivo deja de cancelar, decisión 15); sigue el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: flujo SDD (Art. 1), tests primero con gate `node --test` entero (Art. 2), `feature/0010-motivo-cancelar` desde `develop` (Art. 3), interfaz en castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancelled.test.js` — tests del listado `canceladas` y de los escenarios que lo usan.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, listado de canceladas, `resetBookings()`, `run`.
- `test/cancel.test.js` — los dos tests existentes pasan un motivo; escenarios nuevos de `cancelar`.

**NO se tocan**:

- `PRODUCT.md` — la diferencia con «Cancelación» está declarada en la decisión 11 de la spec.
- `CHANGELOG.md` — lo escribe el corte de `sdd-end-release`.
- `test/app.test.js` — no usa `cancelar`.

### 1.2 Modelo de datos

La reserva gana `reason` (cadena, solo en las `cancelled`). Sin migraciones: todo en memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | media | tests que pasan o fallan según el orden | `resetBookings()` en `beforeEach` de los dos ficheros |
| `canceladas` vacío en uso real por comandos sueltos | alta | la fila 0010 se percibe incumplida en la terminal | declarado en la spec (decisiones 11 y 12); se avisa al dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium: el plan trae firmas y asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun "sala ocupada"` responde `cancelada Norte lun (sala ocupada)`; `node src/app.js cancelar Norte lun` responde `motivo no válido: elige cambio de planes, sala ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `export function resetBookings()` (restaura `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }` como única reserva); `export const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`; la reserva cancelada lleva `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `import { test, beforeEach } from 'node:test'`, `import { run, resetBookings } from '../src/app.js'`, `beforeEach(() => resetBookings())` y `const INVALIDO = 'motivo no válido: elige cambio de planes, sala ocupada u otro'`:
  - `cancelar una reserva activa con motivo` → `run('cancelar', ['Norte', 'lun', 'sala ocupada'])` = `cancelada Norte lun (sala ocupada)` y `run('libres', ['10:00-12:00'])` = `Norte, Sur`
  - `cancelar sin reserva lo dice` → `run('cancelar', ['Sur', 'mar', 'otro'])` = `sin reserva Sur mar`
  - `sin motivo no cancela` → `run('cancelar', ['Norte', 'lun'])` = `INVALIDO` y `run('libres', ['10:00-12:00'])` = `Sur`
  - `un motivo fuera de la lista no cancela` → `['Norte', 'lun', 'me aburro']` = `INVALIDO`, `libres` = `Sur`
  - `un motivo con mayúscula no vale` → `['Norte', 'lun', 'Otro']` = `INVALIDO`, `libres` = `Sur`
  - `un motivo con palabras de más no vale` → `['Norte', 'lun', 'otro', 'extra']` = `INVALIDO`, `libres` = `Sur`
  - `un motivo sin comillas se une` → `['Norte', 'lun', 'cambio', 'de', 'planes']` = `cancelada Norte lun (cambio de planes)`
  - `sin reserva y sin motivo responde el error de motivo` → `['Sur', 'mar']` = `INVALIDO` y `['Sur', 'mar', 'me aburro']` = `INVALIDO`
  - `cancelar sin argumentos responde el error de motivo` → `run('cancelar', [])` = `INVALIDO`
  - `anular no pide motivo` → `run('anular', ['Norte', 'lun'])` = `anulada Norte lun`
  - `cancelar una anulada responde sin reserva` → tras `anular Norte lun`, `run('cancelar', ['Norte', 'lun', 'otro'])` = `sin reserva Norte lun`

  Correr `node --test test/cancel.test.js` y ver que falla (no existe `resetBookings`).
- [ ] **Step 2: Implementación** — en `src/app.js`: `export const CANCEL_REASONS`; `const seed = () => [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }]`; `let bookings = seed()`; `export function resetBookings() { bookings = seed(); }`; `cancelBooking(room, day, reason)`: si `!CANCEL_REASONS.includes(reason)` devuelve `motivo no válido: elige cambio de planes, sala ocupada u otro` (construido desde la constante); si no hay reserva activa, `sin reserva ${room} ${day}`; si la hay, `status = 'cancelled'`, `reason = reason` y `cancelada ${room} ${day} (${reason})`; en `run`, `cancelBooking(params[0], params[1], params.slice(2).join(' '))`. El resto de funciones no cambia.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node src/app.js cancelar Norte lun "sala ocupada"` → `cancelada Norte lun (sala ocupada)`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancelled.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancelled.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada comando de terminal es un proceso nuevo y las reservas viven en memoria (decisión 12 de la spec): `node src/app.js canceladas` responde `sin canceladas`; el listado con datos se ve por `run()`.

**Interfaces**:
- Consume: `run`, `resetBookings`, `cancelBooking` guardando `reason` (Task 1).
- Produce: `run('canceladas', args)`.

**Ficheros**: crear `test/cancelled.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `test/cancelled.test.js` con `beforeEach(() => resetBookings())`:
  - `canceladas enseña el motivo` → tras `cancelar Norte lun "cambio de planes"`, `run('canceladas', [])` = `Norte lun 10:00-12:00 · cambio de planes`
  - `sin canceladas` → `run('canceladas', [])` = `sin canceladas`
  - `una anulada no sale` → tras `anular Norte lun`, `run('canceladas', [])` = `sin canceladas`
  - `cancelar una anulada deja sin canceladas` → tras `anular Norte lun` y `cancelar Norte lun otro` (= `sin reserva Norte lun`), `canceladas` = `sin canceladas`
  - `cancelar y anular una cancelada responde sin reserva y conserva el motivo` → tras `cancelar Norte lun "sala ocupada"`: `cancelar Norte lun otro` = `sin reserva Norte lun`, `anular Norte lun` = `sin reserva Norte lun`, `canceladas` = `Norte lun 10:00-12:00 · sala ocupada`
  - `canceladas ignora los argumentos` → tras cancelar con `otro`, `run('canceladas', ['Sur'])` = `Norte lun 10:00-12:00 · otro`

  Ver que fallan (`canceladas` responde `salas`).
- [ ] **Step 2: Implementación** — en `run`: `if (cmd === 'canceladas') return cancelledList();`; `cancelledList()` filtra `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} ${b.slot} · ${b.reason}` `` y une con `\n`, o devuelve `sin canceladas` si no hay.
- [ ] **Step 3: Verificación** — `node --test test/cancelled.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero; incertidumbre baja
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Éxito `cancelada Norte lun (sala ocupada)` y `libres` = `Norte, Sur` → Task 1, `cancelar una reserva activa con motivo`. ✓
- Sin motivo → error y sigue activa → Task 1, `sin motivo no cancela`. ✓
- `me aburro`, `Otro`, `otro extra` → error y sigue activa → Task 1, los tres tests con su nombre. ✓
- Sin comillas → Task 1, `un motivo sin comillas se une`. ✓
- `sin reserva Sur mar` con motivo válido → Task 1, `cancelar sin reserva lo dice`. ✓
- Sin reserva y sin motivo o con `me aburro` → error de motivo → Task 1, `sin reserva y sin motivo responde el error de motivo`. ✓
- Ya cancelada → `cancelar` responde `sin reserva` y `canceladas` conserva el motivo → Task 2, `cancelar y anular una cancelada…`. ✓
- `anular` sin motivo → `anulada Norte lun` → Task 1, `anular no pide motivo`. ✓
- `anular` una cancelada → `sin reserva` y conserva el motivo → Task 2, el mismo test. ✓
- Anulada → `cancelar` responde `sin reserva` → Task 1, `cancelar una anulada responde sin reserva`; y `canceladas` = `sin canceladas` → Task 2, `cancelar una anulada deja sin canceladas`. ✓
- Listado con motivo, vacío y sin anuladas → Task 2, sus tres tests. ✓
- Orden de varias canceladas → sin observar: solo existe una reserva sembrada (avisado en la decisión 6 de la spec). ⚠
- «`cancelada <sala> <día>` cambia de forma» y «sin motivo deja de cancelar» → Task 1, los tests con `cancelada Norte lun (…)` e `INVALIDO`. ✓
- Código de salida (decisión 15) → N/A: solo texto, sin cambio. ✓
- Review Focus → cada línea con su test arriba. ✓
