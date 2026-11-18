---
id: 20261118-232645-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, con el código casi dictado por la firma y los tests: sesión en gama media (Sonnet, effort medium). La revisión final de rama va con sus ejes: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Una sola task**: función, comando, validación del día, tests y README se prueban juntos y un revisor no aprobaría una parte sin la otra; por eso no hay `tasks.md`.
4. **Decisión técnica**: `busyRooms` devuelve `[{ room, count }]` en el orden de `rooms`; el comando formatea. Los días válidos van en una constante `DAYS`.
5. **Riesgos altos**: ninguno; `reservar`, `cancelar` y `anular` no se tocan.
6. **Coste**: ~0,5 h de implementación; sin despachos de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `node src/app.js ocupacion <día>` avisa de las salas con 3 o más reservas activas ese día.

**Architecture**: función pura `busyRooms(day, list = bookings)` en `src/app.js` y una rama más en `run`. Sin módulos nuevos.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade una función y una rama dentro de `src/app.js`, sin módulo, dependencia ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- Umbral fijo: `BUSY_THRESHOLD = 3`; los textos son los de la spec, literales.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, sin tabuladores (`scripts/lint.mjs`).
- Interfaz y mensajes en castellano.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits con el id 0012 en el mensaje.

## Review Focus

- `ocupacion` con `bookings` por defecto (1 reserva de Norte el lun) → `sin salas muy ocupadas el lun` · Task 1, `ocupacion con los datos por defecto`
- `ocupacion lun mar` (argumento de sobra) → se ignora el segundo y se trata `lun` · Task 1, `ocupacion ignora argumentos de sobra`
- día en mayúsculas (`LUN`) → `día no válido: LUN`, no se normaliza · Task 1, `ocupacion no normaliza mayusculas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función y una rama.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: retrocompatible; no cambia ningún comando existente.
- [x] **Constitution check**: tests primero, texto en castellano, gate de cierre completo.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/occupancy.test.js` — tests de `busyRooms` y del comando.

**Modificar**:

- `src/app.js` — exporta `bookings`, añade `BUSY_THRESHOLD`, `DAYS`, `busyRooms` y el comando `ocupacion`.
- `README.md` — una línea con el comando.

**NO se tocan**:

- `scripts/lint.mjs`, `package.json`, tests existentes — no cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un test deja reservas sembradas en `bookings` y rompe otros | media | medio | cada test restaura `bookings` con `finally` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Comando `ocupacion`

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la ejecuta la sesión, que va en gama media).
**Tests RED**: hilo principal · `test/occupancy.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: `node --test test/occupancy.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js ocupacion lun` y ve `sin salas muy ocupadas el lun` con los datos por defecto.

**Interfaces**:
- Consume: `rooms = ['Norte', 'Sur']`; `bookings`, elementos `{ room, day, slot, status }` con `status` en `active | cancelled | voided`; `run(cmd, params)`.
- Produce: `export const bookings`; `export function busyRooms(day, list = bookings)` → `Array<{ room: string, count: number }>`, solo salas con `count >= 3`, en el orden de `rooms`, contando solo `status === 'active'`; comando `ocupacion`.

**Ficheros**: crear `test/occupancy.test.js`; modificar `src/app.js`, `README.md`

- [ ] **Step 1: Tests RED** — en `test/occupancy.test.js`, un helper `withBookings(extra, fn)` que añade `extra` a `bookings` y restaura el contenido original en `finally`, y un helper `many(room, day, status, n)`. Un test por THEN:
  - `Norte con 3 activas el lun avisa`: `run('ocupacion', ['lun'])` es `aviso: Norte muy ocupada el lun (3 reservas)`, una sola línea (sin Sur). Con la reserva por defecto de Norte el lun, siembra 2 activas más.
  - `cuenta 4 reservas`: 4 activas de Norte el lun en total → `aviso: Norte muy ocupada el lun (4 reservas)`.
  - `varias salas en el orden de las salas`: Sur 3 y Norte 3 el vie → `aviso: Norte muy ocupada el vie (3 reservas)\naviso: Sur muy ocupada el vie (3 reservas)`.
  - `2 activas no avisan`: 2 de Norte el mar → `sin salas muy ocupadas el mar`.
  - `canceladas no cuentan` y `anuladas no cuentan`: 2 activas + 1 del estado el lun → `sin salas muy ocupadas el lun` (la reserva por defecto cuenta como 1 activa; siembra 1 más).
  - `es por día`: 2 el lun y 2 el mar → `ocupacion lun` sin avisos.
  - `sin día`: `run('ocupacion', [])` es `uso: ocupacion <día>`.
  - `día no válido`: `run('ocupacion', ['xyz'])` es `día no válido: xyz`.
  - los tres del Review Focus: `ocupacion con los datos por defecto`, `ocupacion ignora argumentos de sobra`, `ocupacion no normaliza mayusculas`.
  - `busyRooms` con lista propia: `busyRooms('lun', lista)` devuelve `[{ room: 'Norte', count: 3 }]`.
  Ejecuta `node --test test/occupancy.test.js`. Esperado: falla (RED).
- [ ] **Step 2: Implementación** — en `src/app.js`: `export const bookings`; `const BUSY_THRESHOLD = 3`; `const DAYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']`; `export function busyRooms(day, list = bookings)`; y en `run`: `ocupacion` sin `params[0]` → `uso: ocupacion <día>`; día fuera de `DAYS` → `día no válido: <día>`; sin salas muy ocupadas → `sin salas muy ocupadas el <día>`; con ellas, una línea `aviso: <Sala> muy ocupada el <día> (<n> reservas)` por sala, unidas con `\n`. Una línea en `README.md` con `node src/app.js ocupacion <día>` y qué hace.
- [ ] **Step 3: Verificación** — `node --test test/occupancy.test.js` → `ℹ fail 0`; `node --test` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: aviso de sala muy ocupada (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 1 task, una función y una rama; sin calibración previa en `estimation-log.md`
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- 3 activas el lun → `aviso: Norte muy ocupada el lun (3 reservas)`, sin línea de Sur → Task 1, `Norte con 3 activas el lun avisa`. ✓
- 4 activas → `(4 reservas)` → Task 1, `cuenta 4 reservas`. ✓
- Norte y Sur con aviso, en orden → Task 1, `varias salas en el orden de las salas`. ✓
- 2 activas → `sin salas muy ocupadas el mar` → Task 1, `2 activas no avisan`. ✓
- Canceladas no cuentan · anuladas no cuentan → Task 1, `canceladas no cuentan`, `anuladas no cuentan`. ✓
- Aviso por día → Task 1, `es por día`. ✓
- Falta el día → `uso: ocupacion <día>` → Task 1, `sin día`. ✓
- Día no válido → `día no válido: xyz` → Task 1, `día no válido`. ✓
- Línea del README → sin observar: documentación, el gate no la comprueba (dicho en el Scope de la spec). ⚠
- Review Focus (3 líneas) → Task 1, los tres tests del Step 1. ✓
