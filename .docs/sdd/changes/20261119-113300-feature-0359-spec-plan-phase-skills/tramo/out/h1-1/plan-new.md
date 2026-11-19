---
id: 20261119-160359-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo por task: `sdd-kit:effort-medium` + `sonnet`, ambas** — son cambios pequeños en un fichero con la firma y los tests ya escritos; en Native los hace la propia sesión. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `opus`, Código con `sonnet`).
2. **Ejecución: native** — `execution: native` está fijado en `sdd-kit.json`.
3. **Dos tasks**: la 1 es el filtro con valores válidos y la 2 el rechazo de valores no válidos; una revisión podría aceptar una y rechazar la otra.
4. **Helper `parseLibresArgs(params)` en `src/app.js`**, no en un módulo nuevo: el proyecto tiene un solo fichero de entrada (`architecture.md`).
5. **Tests solo con los datos de arranque** (`bookings` no se exporta): `Norte` reservada lun 10:00-12:00, `Sur` sin reservas; por eso la planta con todas sus salas reservadas se prueba con `--planta 1` a las 10:00-12:00 y no se cambia `bookings`.
6. **Riesgo alto: ninguno.** Riesgo medio: el reparto de plantas de la spec (✋ 1, pendiente) cambia los tests de las dos tasks si el dev-lead lo corrige.
7. **Coste estimado**: 0.7 h de implementación; sin despachos, solo la revisión final de rama (~3 ejes).
8. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta y, sin `--planta`, todo igual que hoy.

**Architecture**: `rooms` pasa de nombres a `{ name, floor }`; `parseLibresArgs` separa franja y planta de los parámetros de `libres`, y `freeRooms(slot, floor)` filtra.

**Tech Stack**: Node 22 sin dependencias, `node --test` (`operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero de entrada, sin módulo ni dependencia nuevos, y la salida de `libres` no cambia sin `--planta`.

## Restricciones globales

### De código

- La opción se llama `--planta`; el valor es un entero con formato `^[1-9][0-9]*$`.
- Salida de `libres`: nombres en el orden de `rooms`, separados por `, `, una línea; vacía si no hay ninguna.
- Aviso literal: `planta no válida: usa --planta <número>`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano; el código, en inglés como hoy (constitution, Art. 4).

### De proceso

- Tests antes que código (constitution, Art. 2).
- Commits en castellano, `feat(0012): …`, con la atribución del encargo.

## Review Focus

- `libres --planta 2` (sin franja) → `Sur`: la franja no se valida y hoy sin franja no se excluye ninguna sala · Task 1, `libres sin franja filtra solo por planta`
- `libres 10:00-12:00 --planta` (opción al final, sin valor) → el aviso, no `Norte, Sur` · Task 2, `--planta sin valor`
- `libres --planta 10:00-12:00` (valor con forma de franja) → el aviso · Task 2, `--planta con forma de franja`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un helper y un campo; sin módulos nuevos.
- [x] **YAGNI gate**: nada se abstrae; sin nombres de planta.
- [x] **Brownfield gate**: sin `--planta` la salida no cambia; el test actual de `libres` queda intacto.
- [x] **Constitution check**: Arts. 1-4 respetados (flujo SDD, tests primero, git-flow, castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `rooms` con `floor`, `parseLibresArgs`, `freeRooms(slot, floor)` y la rama `libres` de `run`.
- `test/app.test.js` — tests de la capacidad `room-availability`.

**NO se tocan**:

- `cancelBooking`, `voidBooking` y `reservar` en `src/app.js`: fuera de alcance, no leen `rooms`.
- `test/cancel.test.js`: no cambia.

### 1.2 Modelo de datos

`rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }]` (reparto pendiente, ✋ 1 de la spec).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El dev-lead corrige el reparto de plantas | media | bajo: cambian valores en los tests | los tests lo declaran en su nombre y constante |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Filtrar `libres` por planta

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native lo hace la sesión.
**Tests RED**: hilo principal · `test/app.test.js`, TDD del propio hilo, en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el dev-lead ejecuta `node src/app.js libres 14:00-16:00 --planta 2` y ve `Sur`.

**Interfaces**:
- Consume: nada.
- Produce: `parseLibresArgs(params: string[]): { slot: string | undefined, floor: number | undefined }` y `freeRooms(slot: string | undefined, floor?: number): string[]`, ambas en `src/app.js`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js`, con `run` importado como hoy:
  - `libres con --planta filtra por planta`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`
  - `libres con --planta antes de la franja`: `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`
  - `libres sin --planta lista todas`: `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`
  - `planta con todas sus salas reservadas`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`
  - `planta sin salas`: `run('libres', ['10:00-12:00', '--planta', '9'])` → `''`
  - `libres sin franja filtra solo por planta`: `run('libres', ['--planta', '2'])` → `'Sur'`
  - Ejecútalos: esperado, rojos los que pasan por `--planta`; los de salida vacía y el de «todas» pueden pasar ya.
- [ ] **Step 2: Implementación** — `rooms` con `{ name, floor }` según §1.2; `parseLibresArgs` quita `--planta` y su valor de `params` (en cualquier posición), convierte el valor con `Number` y toma como `slot` el primer parámetro restante; `freeRooms(slot, floor)` filtra por `floor` solo si viene y devuelve nombres; la rama `libres` de `run` une con `', '`.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0012): libres filtra por --planta`.

### Task 2 — Rechazar `--planta` no válida

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native lo hace la sesión.
**Tests RED**: hilo principal · `test/app.test.js`, TDD del propio hilo, en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el dev-lead ejecuta `node src/app.js libres 10:00-12:00 --planta alta` y ve `planta no válida: usa --planta <número>`.

**Interfaces**:
- Consume: `parseLibresArgs(params)` de la Task 1, que devuelve `{ slot, floor }` y que esta task amplía; `run('libres', params)` la usa.
- Produce: `parseLibresArgs` devuelve `{ error: string }` con el aviso literal cuando `--planta` no es válida, y `run` lo devuelve tal cual.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js`; todos esperan `'planta no válida: usa --planta <número>'`:
  - `--planta sin valor`: `['10:00-12:00', '--planta']`
  - `--planta no numérica`: `['10:00-12:00', '--planta', 'alta']`
  - `--planta cero`: `['10:00-12:00', '--planta', '0']`
  - `--planta con cero a la izquierda`: `['10:00-12:00', '--planta', '02']`
  - `--planta negativa`: `['10:00-12:00', '--planta', '-1']`
  - `--planta decimal`: `['10:00-12:00', '--planta', '2.5']`
  - `--planta con forma de franja`: `['--planta', '10:00-12:00']`
  - `--planta repetida`: `['10:00-12:00', '--planta', '1', '--planta', '2']`
  - `el aviso prima sin franja`: `['--planta', '0']`
  - Ejecútalos: esperado, rojos.
- [ ] **Step 2: Implementación** — en `parseLibresArgs`, valida cada valor de `--planta` con `^[1-9][0-9]*$` y rechaza la opción repetida o sin valor devolviendo `{ error: 'planta no válida: usa --planta <número>' }`; `run` devuelve `error` si existe, antes de filtrar.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0012): libres rechaza --planta no válida`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.6h
- Estimación de implementación: 0.7h
- Estimación de revisión: 0.2h
- Estimación de cierre: 0.2h
- Base de la estimación: 2 tasks en un fichero, 15 tests pequeños; sin incertidumbre técnica; sin referencia previa en el log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): `libres 10:00-12:00 --planta 2` → `Sur` y `libres 10:00-12:00` → `Sur`, como hoy
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres de una franja · `libres 10:00-12:00` → `Sur` → test existente «libres excluye la sala reservada en la franja», sin cambios. ✓
- Filtrar libres por planta · `--planta 2` → `Sur` → Task 1, `libres con --planta filtra por planta`. ✓
- · AND `--planta 2 14:00-16:00` → `Sur` → Task 1, `libres con --planta antes de la franja`. ✓
- Sin `--planta`, todas las libres → `Norte, Sur` → Task 1, `libres sin --planta lista todas`. ✓
- Planta con todas sus salas reservadas → vacío → Task 1, `planta con todas sus salas reservadas`. ✓
- Planta sin salas → vacío → Task 1, `planta sin salas`. ✓
- Planta no válida (sin valor, `alta`, `0`, `02`, `-1`, `2.5`, forma de franja, repetida) → aviso → Task 2, un test por caso. ✓
- El aviso de planta prima (`--planta 0` sin franja) → Task 2, `el aviso prima sin franja`. ✓
- `rooms` pasa a `{ name, floor }` y la franja deja de ser `params[0]` → Task 1, resuelto por `parseLibresArgs` y probado por sus tests. ✓
- Review Focus: `libres --planta 2` → Task 1, `libres sin franja filtra solo por planta`; `--planta` sin valor → Task 2, `--planta sin valor`; valor con forma de franja → Task 2, `--planta con forma de franja`. ✓
