---
id: 20261111-191356-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las dos las hace el hilo de la sesión (Native), en gama media (Sonnet, effort medium) — el plan lleva firmas, regex y asserts, y no hay prosa que interpretar. La revisión final de rama no sigue esta política: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: Native, fijado en `sdd-kit.json`.
3. Dos tasks: la Task 1 entrega el filtro con planta válida y el modelo de sala con planta; la Task 2 entrega la validación y el error. Un revisor podría aprobar el filtro y rechazar la validación.
4. Decisión técnica que la spec no fija: `run` delega el análisis de los argumentos de `libres` en una función `parseLibresArgs(params)` del mismo fichero (no se exporta), para que `run` siga siendo una cadena de `if`.
5. Riesgo alto: ninguno. El riesgo medio es que la validación acepte `2abc` o `1.5` con `parseInt`/`Number`; lo cierra la regex `/^[1-9]\d*$/` y sus tests en la Task 2.
6. Coste estimado: ~1,5 h en total (ver «Estimación y esfuerzo»); sin despachos en paralelo, solo la revisión final de 3 ejes.
7. Una cláusula nada la observa en test: que el error salga con código 0 (decisión 5 de la spec). Los tests llaman a `run`, que devuelve el texto; no hay `process.exit` en `src/app.js`, y lo confirma la validación del dev-lead tecleando el comando.
8. Review Focus: 5 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin `--planta`, todas, como hoy; un valor de planta inválido da `planta no válida: usa un número entero positivo`.

**Architecture**: cada sala de `rooms` pasa a ser `{ name, planta }`; `freeRooms(slot, planta)` filtra por planta si viene; `parseLibresArgs` separa `--planta` y su valor de la franja y valida el valor.

**Tech Stack**: Node 22, ES modules, sin dependencias; tests con `node:test` y `node:assert/strict`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` dentro de su módulo, sin dependencias nuevas ni contrato entre módulos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js` (`architecture.md`).
- Texto de la interfaz en castellano; el mensaje de error es literal: `planta no válida: usa un número entero positivo`.
- Validación de la planta con `/^[1-9]\d*$/` sobre el texto completo del valor.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- La constitution no tiene artículo de calidad de código; valen las dos reglas de comentarios: ningún comentario que repita lo que ya dice el código, ninguno que cite documentos del proyecto (constitution, spec, task, capacidad).

### De proceso

- Política de modelos: hilo de la sesión en gama media para las dos tasks; los ejes de la revisión final, los de la decisión 1.
- Un commit por task, al quedar limpia su revisión; mensajes en castellano, referenciando la feature 0012.
- Los commits terminan con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `libres 14:00-16:00 --planta 10` → cadena vacía, no el error (10 es un entero positivo válido; una regex de un solo dígito lo rechazaría) · Task 2, `acepta una planta de dos dígitos`
- `libres --planta 14:00-16:00` → `planta no válida: usa un número entero positivo`, no una lista de salas con la franja vacía · Task 2, `la franja como valor de --planta es un error`
- `libres 14:00-16:00 --planta 1 --planta 2` → el mismo error, no gana la última · Task 2, `--planta repetida es un error`
- `libres 14:00-16:00 --planta=2` → el mismo error, no se toma como franja · Task 2, `--planta=2 es un error`
- `libres` sin franja ni planta → `Norte, Sur`, como hoy · Task 1, `libres sin franja lista todas las salas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de análisis y un campo más por sala; no hay capa nueva.
- [x] **YAGNI gate**: nada se abstrae; `parseLibresArgs` tiene un solo uso y existe para que `run` no mezcle análisis y listado.
- [x] **Brownfield gate**: retrocompatible: `libres <franja>` da lo mismo; `rooms` solo lo lee `freeRooms`; sin refactor fuera de scope (el bug de que `libres` ignore el día no se toca).
- [x] **Constitution check**: tests antes que código (Art. 2); texto en castellano (Art. 4); el cambio pasa por spec y plan (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/libres.test.js` — tests de `run('libres', …)` con y sin `--planta` y con valores inválidos.

**Modificar**:

- `src/app.js` — `rooms` pasa a `[{ name: 'Norte', planta: 1 }, { name: 'Sur', planta: 2 }]`; `freeRooms(slot, planta)`; nueva `parseLibresArgs(params)`; `run` usa `parseLibresArgs` en la rama `libres`.

**NO se tocan**:

- `test/app.test.js`, `test/cancel.test.js` — siguen valiendo: `libres` sin planta da lo mismo.
- `PRODUCT.md`, `CHANGELOG.md` — los escriben el cierre y el corte de release.
- `scripts/lint.mjs` — no cambia.

### 1.2 Modelo de datos

Solo en memoria: cada sala gana el campo `planta` (entero). Sin `data-model.md`.

### 1.3 Migraciones

No aplica: no hay base de datos.

### 1.4 Contratos API

La CLI gana la opción `--planta <n>` en `libres`; el contrato completo está en la spec (capacidad `room-availability`).

### 1.5 UX

No aplica: salida de texto de la terminal, sin pantallas.

### 1.6 Dependencias

Ninguna nueva. Specs previas: la 0006 (`libres` por franja).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La validación acepta `2abc` o `1.5` | Media | Medio: un filtro silencioso en vez del error | Regex `/^[1-9]\d*$/` sobre el texto completo y un test por forma (Task 2) |
| Los tests de `libres` dependen del estado en memoria | Baja | Bajo | `node --test` corre cada fichero en su proceso; el estado inicial solo tiene la reserva de Norte en 10:00-12:00 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — `libres --planta <n>` filtra por planta

**Tras**: —
**Modelo**: hilo de la sesión, Sonnet con effort medium (Native, sin despacho).
**Tests RED**: hilo principal · `test/libres.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/libres.test.js` → `ℹ fail 0` · `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona teclea `node src/app.js libres 14:00-16:00 --planta 2` y ve `Sur`; con `--planta 1`, `Norte`; sin `--planta`, `Norte, Sur`.

**Interfaces**:
- Consume: nada de tasks anteriores. Parte de `src/app.js` actual: `rooms = ['Norte', 'Sur']`, `freeRooms(slot)`, `run(cmd, params)`.
- Produce: `rooms = [{ name: 'Norte', planta: 1 }, { name: 'Sur', planta: 2 }]`; `freeRooms(slot, planta)` donde `planta` es un entero o `undefined`; `parseLibresArgs(params)` → `{ slot, planta }` (no exportada); la Task 2 le añade el error.

**Ficheros**: crear `test/libres.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — en `test/libres.test.js`, con `import { run } from '../src/app.js'`, un test por fila:
  - `libres sin planta devuelve las libres de la franja`: `run('libres', ['10:00-12:00'])` → `'Sur'` y `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`
  - `libres sin franja lista todas las salas`: `run('libres', [])` → `'Norte, Sur'`
  - `libres filtra por planta 2`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`
  - `libres filtra por planta 1`: `run('libres', ['14:00-16:00', '--planta', '1'])` → `'Norte'`
  - `la opción puede ir antes de la franja`: `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`
  - `sin franja se filtra por planta`: `run('libres', ['--planta', '2'])` → `'Sur'` y `run('libres', ['--planta', '1'])` → `'Norte'`
  - `planta con la sala ocupada da cadena vacía`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`
  - `planta sin salas da cadena vacía`: `run('libres', ['14:00-16:00', '--planta', '9'])` → `''`
  Ejecutar `node --test test/libres.test.js`: fallan los de `--planta` (hoy la salida ignora la opción).
- [ ] **Step 2: Implementación** — en `src/app.js`: `rooms` como en «Produce»; `freeRooms(slot, planta)` conserva el filtro actual por reservas activas y añade, si `planta !== undefined`, `room.planta === planta`, y devuelve los nombres; `parseLibresArgs(params)` recorre `params`: `--planta` toma el siguiente argumento y lo convierte con `Number`; el primer argumento restante es la franja; `run` en `libres` llama a `parseLibresArgs` y `freeRooms(slot, planta).join(', ')`. Sin validación todavía: es la Task 2.
- [ ] **Step 3: Verificación** — `node --test test/libres.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0` (el `libres` actual sigue dando `Sur`).
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0012): libres filtra por planta`.

---

### Task 2 — Planta no válida da el error

**Tras**: Task 1
**Modelo**: hilo de la sesión, Sonnet con effort medium (Native, sin despacho).
**Tests RED**: hilo principal · `test/libres.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/libres.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona teclea `node src/app.js libres 14:00-16:00 --planta dos` y ve `planta no válida: usa un número entero positivo`; con `--planta 10` ve una línea vacía, sin error.

**Interfaces**:
- Consume: `parseLibresArgs(params)` → `{ slot, planta }` y `freeRooms(slot, planta)` de la Task 1.
- Produce: `parseLibresArgs(params)` → `{ slot, planta }` o `{ error }` con `error === 'planta no válida: usa un número entero positivo'`; `run` devuelve ese texto sin listar salas cuando hay `error`.

**Ficheros**: modificar `test/libres.test.js`, `src/app.js`

- [ ] **Step 1: Tests RED** — en `test/libres.test.js`, con la constante `ERROR = 'planta no válida: usa un número entero positivo'`:
  - `planta sin valor es un error`: `run('libres', ['14:00-16:00', '--planta'])` → `ERROR`
  - `planta no entera es un error`, una aserción por valor: `run('libres', ['14:00-16:00', '--planta', v])` → `ERROR` para `v` en `a`, `0`, `-1`, `1.5`, `2abc`, `02`, `+2`
  - `--planta=2 es un error`: `run('libres', ['14:00-16:00', '--planta=2'])` → `ERROR`
  - `--planta repetida es un error`: `run('libres', ['14:00-16:00', '--planta', '1', '--planta', '2'])` → `ERROR`
  - `la franja como valor de --planta es un error`: `run('libres', ['--planta', '14:00-16:00'])` → `ERROR`
  - `acepta una planta de dos dígitos`: `run('libres', ['14:00-16:00', '--planta', '10'])` → `''`
  Ejecutar `node --test test/libres.test.js`: fallan los de error (hoy `Number('a')` da `NaN` y la salida es vacía o una lista).
- [ ] **Step 2: Implementación** — en `parseLibresArgs`: el valor que sigue a `--planta` debe existir y cumplir `/^[1-9]\d*$/` (entonces `planta = Number(valor)`); si falta o no cumple, devuelve `{ error }`; una segunda `--planta` devuelve `{ error }`; un argumento que empieza por `--planta=` devuelve `{ error }`; `run` devuelve `error` tal cual cuando existe.
- [ ] **Step 3: Verificación** — `node --test test/libres.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0012): libres valida la planta`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,0 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero de código y uno de tests; la incertidumbre está en el análisis de argumentos; sin `estimation-log.md` todavía, sin referencia de calibración
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): `libres 10:00-12:00 --planta 2` da `Sur`; `libres 10:00-12:00` da `Sur` como hoy
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres sin filtro · THEN `libres 10:00-12:00` da `Sur` → Task 1, `libres sin planta devuelve las libres de la franja`. ✓
- Libres sin filtro · AND `libres 14:00-16:00` da `Norte, Sur` → Task 1, nuevo test en `libres sin planta…` con la franja `14:00-16:00` (añadir la segunda aserción en el Step 1). ✓
- Libres sin filtro · AND `libres` sin franja da `Norte, Sur` → Task 1, `libres sin franja lista todas las salas`. ✓
- Libres por planta · THEN `--planta 2` da `Sur` → Task 1, `libres filtra por planta 2`. ✓
- Libres por planta · AND `--planta 1` da `Norte` → Task 1, `libres filtra por planta 1`. ✓
- Libres por planta · AND opción antes de la franja → Task 1, `la opción puede ir antes de la franja`. ✓
- Libres por planta · AND sin franja, `--planta 2` da `Sur` y `--planta 1` da `Norte` → Task 1, `sin franja se filtra por planta`. ✓
- Libres por planta · AND `10:00-12:00 --planta 1` da vacía → Task 1, `planta con la sala ocupada da cadena vacía`. ✓
- Libres por planta · AND `--planta 9` da vacía → Task 1, `planta sin salas da cadena vacía`. ✓
- Libres por planta · AND `--planta 10` da vacía, no el error → Task 2, `acepta una planta de dos dígitos`. ✓
- Planta no válida · THEN el texto, sin listar salas, para `--planta` sin valor, `a`, `0`, `-1`, `1.5`, `2abc`, `02`, `+2` → Task 2, `planta sin valor es un error` y `planta no entera es un error`. ✓
- Planta no válida · `--planta=2` → Task 2, `--planta=2 es un error`. ✓
- Planta no válida · `--planta 1 --planta 2` → Task 2, `--planta repetida es un error`. ✓
- Planta no válida · `libres --planta 14:00-16:00` → Task 2, `la franja como valor de --planta es un error`. ✓
- Reglas de la capacidad · orden de `rooms` y separador `, ` → Task 1, las aserciones de `Norte, Sur`. ✓
- Reglas de la capacidad · el error sale por la salida normal (código 0) → sin observar con un test de proceso: los tests llaman a `run`, que devuelve el texto; `console.log` lo imprime y no hay `process.exit` (avisado aquí, en las decisiones). ⚠
- «Lo que se retira o cambia de forma»: `rooms` interno → Task 1, los tests de `test/app.test.js` siguen en verde. ✓
- Sin cambios: `reservar`, `cancelar` y `anular` → N/A (confirmado en spec). ✓
- Review Focus → `--planta 10`, franja como valor, repetida y `=` en Task 2; `libres` sin franja en Task 1. ✓
