---
id: 20261119-175857-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 en el hilo principal (Native), sesión en gama media — un cambio de una función con tests escritos por la propia sesión. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`), que Native no quita.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Sembrar reservas en los tests**: se exporta `bookings` desde `src/app.js` y cada test guarda y restaura su contenido; es lo mínimo para probar por `run`, sin función nueva de reservar (YAGNI).
4. **Umbral**: constante `BUSY_THRESHOLD = 3` en `src/app.js`.
5. **Coste estimado**: 0,5 h, una sola task, sin despachos.
6. **Riesgos altos**: ninguno.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres` añade una línea `aviso:` por cada sala con 3 o más reservas activas.

**Architecture**: una función pura `busyRooms()` cuenta las reservas `active` por sala en `src/app.js`; `run('libres')` une el listado y los avisos con saltos de línea.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json` · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia la salida de un comando en un único fichero, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada `src/app.js` (`architecture.md`).
- Texto de la interfaz en castellano; el aviso es literalmente `aviso: <sala> muy ocupada (<n> reservas activas)`.
- Muy ocupada = 3 o más reservas con `status: 'active'` de la sala, sin distinguir día.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.

### De proceso

- Tests antes que código (constitution, art. 2); gate de cierre `node --test && node scripts/lint.mjs`.
- Sin política de modelos propia del proyecto: gama media para la sesión.
- Commits con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Dos salas con 3 o más reservas activas → una línea `aviso:` por sala, en el orden de `rooms` (Norte, Sur) · Task 1, `avisa de cada sala muy ocupada, una línea por sala`
- Sala muy ocupada que además está libre en la franja → avisa igual (decisión 5 de la spec) · Task 1, `avisa también si la sala está libre en la franja`
- Ninguna sala libre y una muy ocupada → la primera línea queda vacía, como hoy con el listado vacío, y el aviso va debajo · Task 1, `listado vacío mantiene su línea y el aviso va debajo`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función y un join.
- [x] **YAGNI gate**: sin abstracciones; solo se exporta `bookings` para probar.
- [x] **Brownfield gate**: la salida sin aviso no cambia; respeta el patrón del fichero.
- [x] **Constitution check**: tests primero, castellano, git-flow.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `export` de `bookings`, constante `BUSY_THRESHOLD`, función `busyRooms()` y `run('libres')` con los avisos.
- `test/app.test.js` — tests del aviso.

**NO se tocan**:

- `cancelBooking`, `voidBooking` y `reservar` en `src/app.js` — fuera de alcance (spec, «No entra»).
- `CHANGELOG.md` — lo escribe el cierre de la release.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El test existente de `libres` cambia por el estado compartido | baja | bajo | cada test nuevo guarda y restaura `bookings` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Aviso de sala muy ocupada en `libres`

**Tras**: —
**Modelo**: hilo principal, Native (gama media: Sonnet, effort medium).
**Tests RED**: hilo principal · `test/app.test.js`, TDD del propio hilo.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js libres 10:00-12:00` sale como hoy (`Sur`) con el estado inicial, sin aviso.

**Interfaces**:
- Consume: `bookings` (lista de `{ room, day, slot, status }`), `rooms = ['Norte', 'Sur']`, `freeRooms(slot)`.
- Produce: `export const bookings`; `busyRooms(): string[]` devuelve las líneas `aviso: <sala> muy ocupada (<n> reservas activas)` en el orden de `rooms`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js`, con `import { run, bookings } from '../src/app.js'` y un `beforeEach`/`afterEach` que guardan (`bookings.splice(0)`) y restauran `bookings`; cada test siembra con `bookings.push({ room, day, slot, status })`. Consulta siempre `run('libres', ['10:00-12:00'])`:
  - `avisa de sala con 3 reservas activas`: Norte lun, mar, mié activas en `10:00-12:00` → `'Sur\naviso: Norte muy ocupada (3 reservas activas)'`.
  - `sin aviso con 2 reservas activas`: Norte lun, mar activas en `10:00-12:00` → `'Sur'`.
  - `las no activas no cuentan`: Norte lun, mar activas, mié `cancelled`, jue `voided`, todas en `10:00-12:00` → `'Sur'`.
  - `avisa de cada sala muy ocupada, una línea por sala`: Norte y Sur con lun, mar, mié activas en `10:00-12:00` → `'\naviso: Norte muy ocupada (3 reservas activas)\naviso: Sur muy ocupada (3 reservas activas)'`.
  - `avisa también si la sala está libre en la franja`: Norte con lun, mar, mié activas en `14:00-16:00` → `'Norte, Sur\naviso: Norte muy ocupada (3 reservas activas)'`.
  - `listado vacío mantiene su línea y el aviso va debajo`: Norte con lun, mar, mié activas y Sur con lun activa, todas en `10:00-12:00` → `'\naviso: Norte muy ocupada (3 reservas activas)'`.
- [ ] **Step 2: Ver el RED** — `NO_COLOR=1 node --test test/app.test.js`. Esperado: fallan los tests de aviso (`ℹ fail` mayor que 0) y los demás pasan.
- [ ] **Step 3: Implementación** en `src/app.js`: `export const bookings`; `const BUSY_THRESHOLD = 3`; `function busyRooms()` según Interfaces; `run('libres')` devuelve `[freeRooms(params[0]).join(', '), ...busyRooms()].join('\n')`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/app.test.js` → `ℹ fail 0`; `node src/app.js libres 10:00-12:00` → `Sur`.
- [ ] **Step 5: Commit de la task** — `feat(0012): aviso de sala muy ocupada en libres`, uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.25h
- Estimación de cierre: 0.25h
- Base de la estimación: una task, una función y un join; sin histórico en `estimation-log.md`.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): con Norte a 3 reservas activas `libres` avisa; con 2, la salida no cambia
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «Aviso de sala muy ocupada» (`Sur` y línea `aviso: Norte muy ocupada (3 reservas activas)`) → Task 1, `avisa de sala con 3 reservas activas`. ✓
- THEN «Sin aviso por debajo del umbral» → Task 1, `sin aviso con 2 reservas activas`. ✓
- THEN «Las reservas no activas no cuentan» → Task 1, `las no activas no cuentan`. ✓
- Regla Avisos (una línea por sala, en `libres`) → Task 1, `avisa de cada sala muy ocupada, una línea por sala`. ✓
- Salida sin aviso sin cambios → Task 1, el test existente `libres excluye la sala reservada en la franja`. ✓
- Tabla «Lo que se retira o cambia de forma» → N/A, ninguna regla retirada; `CHANGELOG.md` lo escribe el cierre de la release. ✓
- Review Focus → Task 1, tests nombrados arriba. ✓
