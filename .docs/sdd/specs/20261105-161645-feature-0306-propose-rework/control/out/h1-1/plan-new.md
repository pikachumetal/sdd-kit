---
id: 20261105-212201-feature-0012-libres-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. **Una sola task**: el cambio son ~15 líneas en `src/app.js` y sus tests en `test/app.test.js`; partirlo en dos no daría dos revisiones distintas.
2. **Modelo de la task**: la ejecuta la propia sesión (Native), gama media (Sonnet, effort medium): el plan trae las firmas, los valores y los asserts. La revisión final de rama no se quita: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
3. **Ejecución**: native, fijado en `sdd-kit.json`.
4. **Decisiones técnicas que la spec no fija**: `parseFloor(params)` devuelve `{ rest, floor, hasFloor }` con `floor` como texto sin interpretar (`undefined` si falta el valor); la comprobación de dígitos y de existencia está en `run`. «Existe» = alguna sala de `rooms` tiene esa planta.
5. **Riesgos altos**: ninguno; no hay persistencia ni dependencias.
6. **Coste estimado**: ~1 h de implementación; sin despachos de implementador (Native), solo la revisión final.
7. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin `--planta`, todas.

**Architecture**: `rooms` pasa a objetos `{ name, floor }`; `freeRooms(slot, floor)` filtra por planta solo si `floor` viene; `parseFloor` separa la opción de los argumentos y `run` valida y compone la salida.

**Tech Stack**: Node 22, sin dependencias, `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia una función y un dato dentro de `src/app.js`: sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; todo en `src/app.js` (un solo fichero de entrada).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Texto de la interfaz en castellano: `sin salas en la planta <n>` y `planta no válida: usa un número`, literales.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Tests antes que código (constitution, Art. 2).
- Commits con el trailer de atribución del kit; un commit por task al quedar limpia su revisión.

## Review Focus

- `libres 14:00-16:00 --planta` (opción al final, sin valor) → `planta no válida: usa un número`, no la lista entera · Task 1, `libres: --planta sin valor`
- `libres --planta 10:00-12:00` (la franja se come como valor) → `planta no válida: usa un número` · Task 1, `libres: --planta con una franja como valor`
- `--planta 0` (solo dígitos, sin sala) → `sin salas en la planta 0`, no el error de formato · Task 1, `libres: planta 0 existe como número pero sin salas`
- `libres --planta 2` sin franja → se comporta como `libres` sin franja de hoy (ninguna reserva coincide), filtrado por planta: `Sur` · Task 1, `libres: --planta sin franja`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un asistente y un parámetro opcional; sin parser genérico.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: sin `--planta` la salida es la de hoy (test existente intacto); sin refactor fuera de `rooms`/`freeRooms`.
- [x] **Constitution check**: tests antes que código, texto en castellano, flujo SDD.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` con planta, `freeRooms(slot, floor)`, `parseFloor(params)` y la rama `libres` de `run`.
- `test/app.test.js` — los tests de `libres` con `--planta`.

**NO se tocan**:

- `scripts/lint.mjs` — el lint no cambia.
- `.docs/sdd/changelog.md` y `PRODUCT.md` — los escribe el cierre (`sdd-archive`), no la task.

### 1.2 Modelo de datos

`rooms`: `[{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }]`. Sin persistencia: los datos viven en memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Cambiar la salida de `libres` sin `--planta` | Baja | Alto | El test existente `libres excluye la sala reservada en la franja` y el de `14:00-16:00` sin opción |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `libres` con `--planta`

**Tras**: —
**Modelo**: la propia sesión (Native), Sonnet con effort medium: el plan trae firmas, valores y asserts.
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend (`src/app.js`), tests.
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 10:00-12:00 --planta 2` y ve `Sur`; con `--planta 1` ve una línea vacía; con `--planta 9`, `sin salas en la planta 9`.

**Interfaces**:
- Consume: `bookings` y `rooms` de `src/app.js`; `run(cmd, params)` exportada, que devuelve el texto de salida.
- Produce: `freeRooms(slot, floor)` (`floor` número o `undefined`, devuelve nombres); `parseFloor(params)` → `{ rest: string[], floor: string | undefined, hasFloor: boolean }`; ambas internas, no exportadas.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** — en `test/app.test.js`, `import { run }` ya existe. Añadir un test por escenario de la spec (todos fallan hoy):
  - `libres sin planta lista todas las libres de la franja`: `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`
  - `libres filtra por planta`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`
  - `libres acepta --planta antes de la franja`: `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`
  - `libres: --planta repetido gana la última`: `run('libres', ['14:00-16:00', '--planta', '1', '--planta', '2'])` → `'Sur'`
  - `libres: planta sin libres`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`
  - `libres: planta sin salas`: `run('libres', ['14:00-16:00', '--planta', '9'])` → `'sin salas en la planta 9'`
  - `libres: planta 0 existe como número pero sin salas`: `run('libres', ['14:00-16:00', '--planta', '0'])` → `'sin salas en la planta 0'`
  - `libres: --planta sin valor`: `run('libres', ['14:00-16:00', '--planta'])` → `'planta no válida: usa un número'`
  - `libres: --planta con valor no numérico`: para cada valor de `['dos', '-1', '2.5']`, `run('libres', ['14:00-16:00', '--planta', v])` → `'planta no válida: usa un número'`
  - `libres: --planta con una franja como valor`: `run('libres', ['--planta', '10:00-12:00'])` → `'planta no válida: usa un número'`
  - `libres: --planta sin franja`: `run('libres', ['--planta', '2'])` → `'Sur'`
  Ejecutar `node --test test/app.test.js` y ver los fallos por el motivo esperado (no por sintaxis).
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }];`
  - `function freeRooms(slot, floor)`: filtra `rooms` por `floor === undefined || room.floor === floor`, además de la condición actual de reservas (`b.room === room.name`), y devuelve los nombres.
  - `function parseFloor(params)`: recorre `params`; cada `--planta` toma el elemento siguiente como valor (`undefined` si no hay) y se descarta junto a él; la última aparición gana; el resto va a `rest`. Devuelve `{ rest, floor }`.
  - En `run`, rama `libres`: `const { rest, floor } = parseFloor(params)`; si hubo `--planta` y `floor` no cumple `/^\d+$/` → `'planta no válida: usa un número'`; si cumple y ninguna sala de `rooms` tiene `room.floor === Number(floor)` → `` `sin salas en la planta ${floor}` ``; si no, `freeRooms(rest[0], floor === undefined ? undefined : Number(floor)).join(', ')`. Distinguir «no hubo `--planta`» de «hubo sin valor» devolviendo también `hasFloor` desde `parseFloor` (`{ rest, floor, hasFloor }`).
- [ ] **Step 3: Verificación** — `node --test test/app.test.js`. Esperado: `ℹ fail 0`, con el test original de `libres` en verde.
- [ ] **Step 4: Commit de la task** — `feat: libres filtra por planta con --planta (0012)`, con el trailer de atribución.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 1 task, ~15 líneas y 11 tests; sin incertidumbres; sin `estimation-log.md` todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: `node src/app.js libres 10:00-12:00 --planta 2` → `Sur`; sin `--planta` → `Sur`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres sin planta: THEN `Sur` (franja 10:00-12:00) → Task 1, test existente `libres excluye la sala reservada en la franja`. ✓
- Libres sin planta: AND `14:00-16:00` → `Norte, Sur` → Task 1, `libres sin planta lista todas las libres de la franja`. ✓
- Libres filtra por planta: THEN `Sur` → Task 1, `libres filtra por planta`. ✓
- AND `--planta` antes de la franja → Task 1, `libres acepta --planta antes de la franja`. ✓
- AND `--planta 1 --planta 2` gana la última → Task 1, `libres: --planta repetido gana la última`. ✓
- Planta sin libres: THEN línea vacía → Task 1, `libres: planta sin libres`. ✓
- Planta sin salas: THEN `sin salas en la planta 9` → Task 1, `libres: planta sin salas`. ✓
- Planta no válida: THEN el mensaje, para `--planta` sin valor, `dos`, `-1`, `2.5` y una franja como valor → Task 1, los cuatro tests de `--planta` inválido. ✓
- Regla «Límites»: solo dígitos → Task 1, `libres: planta 0 existe como número pero sin salas`. ✓
- Término «Planta» en `PRODUCT.md` → lo escribe el cierre. N/A para la task. ✓
- Review Focus (4 líneas) → Task 1: `--planta sin valor`, `con una franja como valor`, `planta 0…` y `--planta sin franja`. ✓
