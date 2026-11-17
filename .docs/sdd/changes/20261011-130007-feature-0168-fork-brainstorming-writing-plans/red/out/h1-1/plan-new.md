---
id: 20261011-132123-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar las salas libres por planta
spec: ./spec.md
status: approved
created: 2026-10-11
---

# Plan de implementación — Filtrar las salas libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 en la propia sesión (Native), Sonnet con effort medium — un cambio de ~25 líneas en un solo fichero. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en sdd-kit.json.
3. **Una sola task**: una superficie (`src/app.js`), sin migración ni capas; partirla en dos solo añadiría un commit.
4. **`rooms` pasa de lista de nombres a lista de objetos `{ name, floor }`**: `freeRooms` es el único que la lee. La alternativa, un mapa aparte nombre→planta, duplica la lista de salas.
5. **La planta se compara como texto** (`'2' === room.floor`): el CLI recibe texto y no hace falta convertir. Una planta `02` no coincide con la 2; no hay validación del formato en la spec y no la añado.
6. **Riesgos altos**: ninguno. El valor que más pesa (Norte en 1, Sur en 2) es inventado y está marcado en la spec, punto 1.
7. **Coste estimado**: 0,5 h de implementación; sin subagentes salvo el revisor final.
8. **Review Focus**: 3 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> [--planta <n>]` lista solo las salas libres de esa planta.

**Architecture**: `run` pasa los parámetros de `libres` a una función que separa la franja de la opción `--planta`; `freeRooms` recibe la planta y filtra antes de quitar las ocupadas.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto de la salida en castellano, literal: `sin salas en la planta <n>` y `falta el número de planta`.
- Sin dependencias externas; todo en `src/app.js` (`tech-stack.md`).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.

### De proceso

- Tests antes que código (constitution, Art. 2).
- Commits sobre `feature/0012-libres-por-planta`, referenciando la 0012.

## Review Focus

- `libres 14:00-16:00 --planta` (sin número, al final) → `falta el número de planta`, no `Norte, Sur` ni una excepción · Task 1, `libres sin número de planta avisa`
- `libres --planta 2 14:00-16:00` (opción antes de la franja) → `Sur`, como con la opción al final · Task 1, `la planta puede ir antes de la franja`
- `libres 14:00-16:00 --planta --planta` (el valor es otra opción) → sin prueba; la spec no lo cubre y queda fuera de alcance, anotado aquí para el revisor final · Task 1, ninguno

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de parseo y un filtro; sin clases ni módulos nuevos.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: sin `--planta`, la salida de `libres` no cambia (el test existente lo fija); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, texto en castellano, git-flow en `feature/0012-libres-por-planta`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/floor.test.js` — tests de `libres` con y sin `--planta`.

**Modificar**:

- `src/app.js` — `rooms` con planta; `freeRooms(slot, floor)`; separar franja y opción en `run`.

**NO se tocan**:

- `test/app.test.js`, `test/cancel.test.js` — sus aserciones siguen valiendo tal cual.
- `PRODUCT.md`, `README.md` — sin término nuevo (spec, punto 6).

### 1.2 Modelo de datos

`rooms`: `[{ name: 'Norte', floor: '1' }, { name: 'Sur', floor: '2' }]`. En memoria; no hay persistencia.

### 1.4 Contratos API

`libres <franja> [--planta <n>]`, opción en cualquier posición. Salida: nombres separados por `, `; línea vacía si no queda ninguna; `sin salas en la planta <n>` si ninguna sala está en esa planta; `falta el número de planta` si `--planta` no lleva valor.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Las plantas reales no son Norte=1, Sur=2 | Alta | Bajo | Se corrige en el dato de `rooms` y en los tests; marcado en la spec, punto 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `libres --planta`

**Tras**: —
**Modelo**: la propia sesión (Native), Sonnet con effort medium. Revisor final: `subagent_type: sdd-kit:effort-high` + `model: opus`.
**Tests RED**: hilo principal · `test/floor.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/floor.test.js test/app.test.js`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 14:00-16:00 --planta 2` y ve `Sur`; con `--planta 1` ve `Norte`; sin `--planta` ve `Norte, Sur`.

**Interfaces**:
- Consume: `rooms`, `bookings` y `freeRooms(slot)` de `src/app.js`; `run(cmd, params)` exportada.
- Produce: `freeRooms(slot, floor)` con `floor` opcional (texto); `run('libres', params)` con la opción.

**Ficheros**: crear `test/floor.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** en `test/floor.test.js`, con `import { run } from '../src/app.js'` y el estilo de `test/app.test.js`:
  - `libres filtra por planta`: `assert.equal(run('libres', ['14:00-16:00', '--planta', '2']), 'Sur')` y `assert.equal(run('libres', ['14:00-16:00', '--planta', '1']), 'Norte')`
  - `libres sin planta lista todas`: `assert.equal(run('libres', ['14:00-16:00']), 'Norte, Sur')`
  - `la planta puede ir antes de la franja`: `assert.equal(run('libres', ['--planta', '2', '14:00-16:00']), 'Sur')`
  - `planta con todas las salas ocupadas`: `assert.equal(run('libres', ['10:00-12:00', '--planta', '1']), '')`
  - `planta sin salas`: `assert.equal(run('libres', ['14:00-16:00', '--planta', '5']), 'sin salas en la planta 5')`
  - `libres sin número de planta avisa`: `assert.equal(run('libres', ['14:00-16:00', '--planta']), 'falta el número de planta')`

  Esperado: fallan (el primero devuelve `Norte, Sur`).
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `rooms` como `{ name, floor }` con `Norte` → `'1'` y `Sur` → `'2'`.
  - `freeRooms(slot, floor)`: con `floor` definido, parte de las salas de esa planta; devuelve nombres.
  - En `run`, para `libres`: la franja es el primer parámetro que no es `--planta` ni su valor; el valor es el que sigue a `--planta`. Si `--planta` es el último parámetro, devuelve `falta el número de planta`; si ninguna sala está en esa planta, `sin salas en la planta <n>`; en otro caso, `freeRooms(...).join(', ')`.
- [ ] **Step 3: Verificación** — `node --test test/floor.test.js test/app.test.js`. Esperado: verde, incluido `libres excluye la sala reservada en la franja`.
- [ ] **Step 4: Commit de la task** — `feat: libres --planta (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una task, un fichero de código y uno de test; sin migración.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (escenarios del delta)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Salas libres en una franja → Task 1, `libres sin planta lista todas`. ✓
- Salas libres de una planta → Task 1, `libres filtra por planta`, `la planta puede ir antes de la franja`. ✓
- Planta con todas las salas ocupadas → Task 1, `planta con todas las salas ocupadas`. ✓
- Planta sin salas → Task 1, `planta sin salas`. ✓
- Planta sin número → Task 1, `libres sin número de planta avisa`. ✓
- Review Focus: primera y segunda línea → Task 1, sus tests. La tercera queda fuera de alcance, dicho en la sección. ✓
