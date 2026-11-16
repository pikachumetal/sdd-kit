---
id: 20261112-125901-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo por task: las dos con `sdd-kit:effort-medium` + `sonnet` (en Native las hace el hilo; el modelo nombra el suelo): ~20 líneas con firma y tests dados. La revisión final de rama va aparte, con los ejes de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`); no se quita en Native.
2. Ejecución: Native, fijado en `sdd-kit.json`; 2 tasks encadenadas por `bookings` y `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto.
3. Dos tasks y no una: la Task 1 es lo que cambia en `cancelar` (se puede rechazar sin mirar `canceladas`); la Task 2, el comando nuevo.
4. `parseReason(params)` es una función interna sin exportar; se prueba por `run`.
5. Riesgo alto: ninguno (sin datos persistentes, sin dependencias). Coste: ~1,25 h de implementación, ~30-60 k tokens de sesión.
6. Review Focus: 3 entradas que la spec no fija del todo (ver la sección).

**Goal**: `cancelar` exige `--motivo` de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: todo en `src/app.js` (Enfoque A de la spec): una constante `REASONS`, `cancelBooking(room, day, reason)` valida y guarda `booking.reason`, `cancelledList()` filtra por estado. `bookings` se exporta como costura de test.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; identificadores internos en inglés como el código actual (`REASONS`, `reason`, `cancelledList`).
- `REASONS = ['cambio-de-planes', 'sala-ocupada', 'otro']`; comparación exacta, sin normalizar mayúsculas.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: el hilo principal implementa; modelos de revisión final según `sdd-verify`.
- Commits con la convención del proyecto (`feat: …`), uno por hito; sin `--no-verify`.
- Atribución de commits según las instrucciones de la sesión.

## Review Focus

- `cancelar Norte lun --motivo --otra` → `motivo no válido: --otra (usa cambio-de-planes, sala-ocupada, otro)`, no cancela · Task 1, `rechaza una opción como valor del motivo`
- `cancelar Norte lun --motivo ""` → `falta el motivo: …`, no `motivo no válido: ` con valor vacío · Task 1, `valor vacío cuenta como falta`
- `canceladas` con parámetros de más (`canceladas Norte`) → lista igual, los ignora · Task 2, `canceladas ignora los parámetros`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, una constante, dos funciones.
- [x] **YAGNI gate**: nada abstraído; sin módulo nuevo.
- [x] **Brownfield gate**: retrocompatible solo en `anular`, `libres` y `reservar`; `cancelar` sin motivo deja de cancelar por decisión de la spec (1); sigue el patrón del fichero; sin refactor fuera de scope.
- [x] **Constitution check**: artículos 1-4 respetados (tests antes que código, gate de cierre, git-flow, castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancelled.test.js` — pruebas del comando `canceladas`.

**Modificar**:

- `src/app.js` — exporta `bookings`; `REASONS`; `cancelBooking` con motivo; `cancelledList`; `run` enruta `canceladas` y pasa el motivo.
- `test/cancel.test.js` — sustituye las dos pruebas actuales y añade las del motivo.

**NO se tocan**:

- `PRODUCT.md` — la terminología no cambia (decisión 20 de la spec).
- `CHANGELOG.md` — lo escribe el cierre de la release.
- `test/app.test.js`, `scripts/lint.mjs` — sin cambio.

### 1.2–1.6

No aplican (sin datos persistentes, migraciones, API ni dependencias nuevas).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten `bookings` dentro de un fichero | media | un test pasa por orden, no por lógica | cada test siembra con `seed(...)` (`bookings.length = 0` y `push`) |
| `--motivo` sin valor se lee como la sala siguiente | baja | aviso equivocado | `parseReason` lee solo `params[indexOf('--motivo') + 1]` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, el hilo principal)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — quien cancela escribe `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (motivo: sala ocupada)`; sin `--motivo` ve `falta el motivo: cambio-de-planes, sala-ocupada, otro`.

**Interfaces**:
- Consume: nada nuevo; `findBooking(room, day)` y `bookings` de `src/app.js`.
- Produce: `export const bookings`; `const REASONS = ['cambio-de-planes', 'sala-ocupada', 'otro']`; `export function cancelBooking(room, day, reason)` → string; `bookings[i].reason` (string, solo en las canceladas).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con
  ```js
  import { run, bookings } from '../src/app.js';
  const row = (room, day, slot, status = 'active', reason) => ({ room, day, slot, status, ...(reason && { reason }) });
  const seed = (...rows) => { bookings.length = 0; bookings.push(...rows); };
  ```
  Tests (cada uno hace `seed(...)` primero; «sigue activa» = `run('libres', ['10:00-12:00'])` devuelve `'Sur'`):
  - `cancelar con motivo`: `seed(row('Norte','lun','10:00-12:00'))`; `run('cancelar',['Norte','lun','--motivo','sala-ocupada'])` = `'cancelada Norte lun (motivo: sala ocupada)'` y luego `libres` = `'Norte, Sur'`.
  - `sin motivo no cancela`: `run('cancelar',['Norte','lun'])` = `'falta el motivo: cambio-de-planes, sala-ocupada, otro'`; sigue activa.
  - `--motivo sin valor cuenta como falta`: `['Norte','lun','--motivo']`, mismo texto; sigue activa.
  - `valor vacío cuenta como falta`: `['Norte','lun','--motivo','']`, mismo texto; sigue activa.
  - `rechaza una opción como valor del motivo`: `['Norte','lun','--motivo','--otra']` = `'motivo no válido: --otra (usa cambio-de-planes, sala-ocupada, otro)'`; sigue activa.
  - `rechaza un motivo fuera de la lista`: `'lluvia'` → `'motivo no válido: lluvia (usa cambio-de-planes, sala-ocupada, otro)'`; sigue activa.
  - `no normaliza mayúsculas`: `'Sala-Ocupada'` → `'motivo no válido: Sala-Ocupada (usa cambio-de-planes, sala-ocupada, otro)'`; sigue activa.
  - `sin reserva con motivo válido`: `seed()`; `['Sur','mar','--motivo','otro']` = `'sin reserva Sur mar'`.
  - `sin reserva y sin motivo avisa del motivo`: `seed()`; `['Sur','mar']` = `'falta el motivo: cambio-de-planes, sala-ocupada, otro'`.
  - `sin reserva y motivo inválido avisa del motivo`: `seed()`; `['Sur','mar','--motivo','lluvia']` = `'motivo no válido: lluvia (usa cambio-de-planes, sala-ocupada, otro)'`.
  - `cancelar una ya cancelada`: `seed(row('Norte','lun','10:00-12:00','cancelled','otro'))`; `['Norte','lun','--motivo','sala-ocupada']` = `'sin reserva Norte lun'`.
  - `anular sigue igual`: `seed(row('Norte','lun','10:00-12:00'))`; `run('anular',['Norte','lun'])` = `'anulada Norte lun'`.
  Se retiran las dos pruebas actuales (`cancelar una reserva activa`, `cancelar sin reserva lo dice`).
- [ ] **Step 2: Ver el RED** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: falla (`bookings` no exportado).
- [ ] **Step 3: Implementación** en `src/app.js`: `export const bookings = [...]` (el array actual); `const REASONS = [...]`; `function parseReason(params)`: `const i = params.indexOf('--motivo'); return i === -1 ? undefined : params[i + 1];`; `cancelBooking(room, day, reason)`: si `!reason` → `` `falta el motivo: ${REASONS.join(', ')}` ``; si `!REASONS.includes(reason)` → `` `motivo no válido: ${reason} (usa ${REASONS.join(', ')})` ``; después `findBooking`; sin reserva → `sin reserva ${room} ${day}`; si hay, `status = 'cancelled'`, `booking.reason = reason` y `` `cancelada ${room} ${day} (motivo: ${reason.replaceAll('-', ' ')})` ``. `run`: `cancelBooking(params[0], params[1], parseReason(params))`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia: `feat: motivo obligatorio al cancelar una reserva (0010)`.

### Task 2 — Listar las canceladas con su motivo

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, el hilo principal)
**Tests RED**: hilo principal · `test/cancelled.test.js`, escritos antes del código y sin commitear

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancelled.test.js test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque la memoria no persiste entre ejecuciones: `canceladas` desde la terminal solo ve las reservas de esa ejecución y de fábrica no hay ninguna cancelada (`sin canceladas`); se prueba por `run` con reservas sembradas.

**Interfaces**:
- Consume: de la Task 1, `bookings` exportado, `REASONS`, `booking.reason`, `cancelBooking`.
- Produce: `function cancelledList()` → string; `run('canceladas', _)` la devuelve.

**Ficheros**: crear `test/cancelled.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `test/cancelled.test.js` con los mismos `row` y `seed` de la Task 1:
  - `lista las canceladas con su motivo`: `seed(row('Norte','lun','10:00-12:00','cancelled','cambio-de-planes'), row('Sur','mar','14:00-15:00','cancelled','otro'), row('Sur','jue','10:00-12:00','voided'))`; `run('canceladas', [])` = `'Norte lun 10:00-12:00 · cambio de planes\nSur mar 14:00-15:00 · otro'`.
  - `sin canceladas`: `seed(row('Norte','lun','10:00-12:00'))`; `run('canceladas', [])` = `'sin canceladas'`.
  - `canceladas ignora los parámetros`: la siembra del primero; `run('canceladas', ['Norte'])` = el mismo texto de dos líneas.
  - `una ya cancelada conserva su motivo`: `seed(row('Norte','lun','10:00-12:00','cancelled','otro'))`; `run('cancelar',['Norte','lun','--motivo','sala-ocupada'])`; `run('canceladas', [])` = `'Norte lun 10:00-12:00 · otro'`.
  - `anular no aparece en canceladas`: `seed(row('Norte','lun','10:00-12:00'))`; `run('anular',['Norte','lun'])`; `run('canceladas', [])` = `'sin canceladas'`.
- [ ] **Step 2: Ver el RED** — `NO_COLOR=1 node --test test/cancelled.test.js`. Esperado: falla (`run('canceladas')` devuelve `salas`).
- [ ] **Step 3: Implementación** en `src/app.js`: `function cancelledList()` filtra `status === 'cancelled'` en el orden del array, une `` `${room} ${day} ${slot} · ${reason.replaceAll('-', ' ')}` `` con `\n`, y devuelve `sin canceladas` si no hay; `run`: `if (cmd === 'canceladas') return cancelledList();`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancelled.test.js test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1,25h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks, ~25 líneas de código y ~25 tests en un solo fichero fuente; la incertidumbre es el estado compartido entre tests.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Cancelar con motivo»: THEN `cancelada Norte lun (motivo: sala ocupada)` y AND `libres` → `Norte, Sur` → Task 1, `cancelar con motivo`. ✓
- «Cancelar exige un motivo»: sin `--motivo`, sin valor, vacío, `--otra`, `lluvia`, `Sala-Ocupada`, cada THEN y «sigue activa» → Task 1, los seis tests de rechazo. ✓
- «Cancelar sin reserva lo dice»: tres casos → Task 1, `sin reserva …` (tres tests). ✓
- «Cancelar una ya cancelada»: THEN → Task 1, `cancelar una ya cancelada`; AND `canceladas` → Task 2, `una ya cancelada conserva su motivo`. ✓
- «Anular sigue igual»: THEN → Task 1, `anular sigue igual`; AND `canceladas` → Task 2, `anular no aparece en canceladas`. ✓
- «Listar las canceladas»: dos líneas, anulada fuera, orden → Task 2, `lista las canceladas con su motivo`; `sin canceladas` → Task 2, `sin canceladas`. ✓
- Decisión 15 (`canceladas` ignora `params`) → Task 2, `canceladas ignora los parámetros`. ✓
- Fila «bookings exportado» de «Lo que se retira o cambia de forma» → Task 1, todos los tests importan `bookings` desde `src/app.js`. ✓
- Review Focus: tres líneas → Task 1 (`rechaza una opción como valor del motivo`, `valor vacío cuenta como falta`) y Task 2 (`canceladas ignora los parámetros`). ✓
- Aspectos sin cambios (`libres`, `reservar`, `anular`) → N/A (confirmado en spec). ✓
