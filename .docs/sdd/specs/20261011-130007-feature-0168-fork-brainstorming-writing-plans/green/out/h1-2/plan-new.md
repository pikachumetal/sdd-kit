---
id: 20261011-135546-feature-0012-libres-planta
feature: 0012
title: Plan de implementación — Filtrar las salas libres por planta
spec: ./spec.md
status: approved
created: 2026-10-11
---

# Plan de implementación — Filtrar las salas libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos tasks en la sesión, Sonnet con effort medium — son cambios de un solo fichero con firma y asserts dados aquí. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en `sdd-kit.json`; con 2 tasks encadenadas por una sola función, cada error lo caza el test de su task.
3. **`rooms` pasa de `string[]` a `{ name, floor }[]`**: la planta vive junto a la sala. `freeRooms` devuelve nombres, no objetos, así que `run` no cambia de forma.
4. **Valor de planta**: es válido si casa con `/^\d+$/`; se convierte con `Number`. `01` vale como 1; `-1`, `1.5`, `abc`, vacío y ausente no valen. La spec dice «entero» y no fija `01` ni los negativos.
5. **Análisis de la orden**: `parseFreeArgs(params)` devuelve `{ slot, floor }` o `{ error }`; la franja es el primer argumento que no es `--planta` ni su valor. Sin `--planta`, `floor` es `undefined` y el filtro no se aplica.
6. **Riesgos altos**: ninguno. El riesgo medio es que las plantas de Norte (1) y Sur (2) no sean las reales; está como decisión 1 de la spec.
7. **Coste estimado**: ~0,5 h, sin despachos de subagentes salvo el revisor final.
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres` acepta `--planta <n>` y limita el listado a las salas libres de esa planta; sin la opción no cambia.

**Architecture**: cada sala lleva su planta en `rooms`. `run('libres', params)` pasa los argumentos por `parseFreeArgs`, que separa franja y planta, y `freeRooms(slot, floor)` filtra por planta antes de excluir las reservadas.

**Tech Stack**: Node 22, sin dependencias, `node --test` (`.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La opción se llama `--planta`; el error es literal `planta no válida: usa un número entero, p. ej. --planta 1`.
- Norte en la planta 1, Sur en la planta 2.
- Sin dependencias externas; todo en `src/app.js` (Node 22).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Textos de interfaz en castellano.

### De proceso

- Tests antes que código: cada task escribe su RED y lo ve fallar.
- Un commit por task, con la convención del proyecto (`feat: …`), sin `--no-verify`.

## Review Focus

- `libres 14:00-16:00 --planta -1` → `planta no válida: usa un número entero, p. ej. --planta 1`, no un listado · Task 2, `planta negativa no es válida`
- `libres 14:00-16:00 --planta` (sin valor, última posición) → el mismo texto · Task 2, `planta sin valor no es válida`
- `libres --planta 2 14:00-16:00` → `Sur`; el valor `2` no se toma por la franja · Task 1, `la opción puede ir antes de la franja`
- `libres 14:00-16:00 --planta 01` → `Norte`, como `--planta 1` · Task 2, `planta con cero a la izquierda vale como el número`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de análisis y un filtro; nada más.
- [x] **YAGNI gate**: sin abstracciones; no se generaliza a otros filtros.
- [x] **Brownfield gate**: retrocompatible (`libres <franja>` sin opción da lo de siempre); respeta el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` con planta; `parseFreeArgs`; `freeRooms(slot, floor)`; rama `libres` de `run`.
- `test/app.test.js` — tests de los escenarios de la spec.

**NO se tocan**:

- `test/cancel.test.js`, `scripts/lint.mjs` — fuera de alcance.
- `PRODUCT.md` — el término «Planta» lo escribe el cierre (`sdd-end-feature`).
- `README.md` — no documenta comandos.

### 1.2 Modelo de datos

`rooms`: `[{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }]`. Las reservas no cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Plantas de Norte y Sur distintas de las reales | Media | Bajo | Decisión 1 de la spec, a validar; es un dato en un solo sitio |
| Romper `libres <franja>` sin opción | Baja | Medio | El test «sin planta, todas las salas» y el existente `libres excluye la sala reservada` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Filtrar por planta

**Tras**: —
**Modelo**: sesión Sonnet, effort medium (Native).
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes y commiteados con la task.

**Superficies**: backend
**Verificación**: `node --test test/app.test.js`
**Se prueba en la aplicación**: `node src/app.js libres 14:00-16:00 --planta 2` imprime `Sur`; con `--planta 1`, `Norte`; sin la opción, `Norte, Sur`.

**Interfaces**:
- Consume: `rooms`, `bookings` y `freeRooms(slot)` de `src/app.js`; `run(cmd, params)`.
- Produce: `rooms: { name: string, floor: number }[]`; `parseFreeArgs(params: string[]): { slot: string | undefined, floor: number | undefined } | { error: string }` (en esta task solo devuelve la primera forma); `freeRooms(slot: string | undefined, floor?: number): string[]`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** — en `test/app.test.js`, con `run` y `assert.equal`:
  - `libres con planta lista solo las salas de esa planta`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`; con `'1'` → `'Norte'`.
  - `libres sin planta lista todas las salas`: `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`.
  - `el filtro de planta respeta las reservas`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`.
  - `una planta sin salas sale vacía`: `run('libres', ['14:00-16:00', '--planta', '7'])` → `''`.
  - `la opción puede ir antes de la franja`: `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`.
  Verlos fallar (los de planta; el de «sin planta» ya pasa).
- [ ] **Step 2: Implementación** — `rooms` con `{ name, floor }`; `parseFreeArgs` quita `--planta` y su valor y toma la franja como el primer argumento restante, convirtiendo el valor con `Number`; `freeRooms(slot, floor)` filtra por `floor` si viene y devuelve nombres; `run` usa ambos. El valor aún no se valida (Task 2).
- [ ] **Step 3: Verificación** — `node --test test/app.test.js` en verde, incluido `libres excluye la sala reservada en la franja`.
- [ ] **Step 4: Commit de la task** — `feat: filtrar libres por planta (0012)`.

### Task 2 — Planta no válida

**Tras**: Task 1
**Modelo**: sesión Sonnet, effort medium (Native).
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes y commiteados con la task.

**Superficies**: backend
**Verificación**: `node --test test/app.test.js`
**Se prueba en la aplicación**: `node src/app.js libres 14:00-16:00 --planta abc` imprime `planta no válida: usa un número entero, p. ej. --planta 1`.

**Interfaces**:
- Consume: `parseFreeArgs` y `run` de la Task 1.
- Produce: `parseFreeArgs` devuelve `{ error: 'planta no válida: usa un número entero, p. ej. --planta 1' }` cuando `--planta` no tiene valor o este no casa con `/^\d+$/`; `run('libres', …)` devuelve ese texto.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** — todos con `run('libres', …)` y el texto literal de error, salvo el último:
  - `planta no numérica no es válida`: `['14:00-16:00', '--planta', 'abc']`.
  - `planta con decimales no es válida`: `['14:00-16:00', '--planta', '1.5']`.
  - `planta negativa no es válida`: `['14:00-16:00', '--planta', '-1']`.
  - `planta sin valor no es válida`: `['14:00-16:00', '--planta']`.
  - `planta con cero a la izquierda vale como el número`: `['14:00-16:00', '--planta', '01']` → `'Norte'`.
  Verlos fallar.
- [ ] **Step 2: Implementación** — validar el valor en `parseFreeArgs` con `/^\d+$/` y devolver `{ error }`; `run` devuelve `error` tal cual cuando existe.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js` en verde.
- [ ] **Step 4: Commit de la task** — `feat: avisar de planta no válida en libres (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks en un solo fichero, con interfaz y asserts dados; referencia, la feature 0006 (`libres` por franja, 1 h real)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: una fila por THEN del delta de `free-rooms`, ejecutadas con `node src/app.js libres …`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Listado de libres por franja → Task 1 (`libres sin planta lista todas las salas` y el test existente). ✓
- Filtro por planta → Task 1, `libres con planta lista solo las salas de esa planta`. ✓
- Sin planta, todas las salas → Task 1, `libres sin planta lista todas las salas`. ✓
- El filtro de planta respeta las reservas → Task 1, `el filtro de planta respeta las reservas`. ✓
- Planta sin salas → Task 1, `una planta sin salas sale vacía`. ✓
- Planta no válida → Task 2, `planta no numérica no es válida` y `planta sin valor no es válida`. ✓
- Opción antes de la franja → Task 1, `la opción puede ir antes de la franja`. ✓
- Reglas de la capacidad (aviso literal, planta entera) → Task 2. ✓
- Término «Planta» en el glosario → N/A en el plan: lo escribe el cierre. ✓
- Review Focus: `--planta -1`, `--planta` sin valor, opción antes de la franja y `01` → Tasks 2, 2, 1 y 2 con su test. ✓
