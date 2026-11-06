---
id: 20261106-114953-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar salas libres por planta
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Filtrar salas libres por planta

## Decisiones que he tomado yo — valida estas

1. Una sola task — el cambio son ~15 líneas en `src/app.js` y sus tests; partirlo no deja nada que un revisor apruebe por separado.
2. Modelo y effort: Native, la sesión implementa (Sonnet, effort medium basta: el plan lleva las firmas y los asserts). La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
3. Ejecución: native, fijado en `sdd-kit.json`.
4. Las plantas viven en un mapa `floors` junto a `rooms` (`{ Norte: 1, Sur: 2 }`) en vez de convertir `rooms` en objetos — `bookings` y `cancelBooking` comparan `room` como texto y no tienen por qué tocarse.
5. Coste estimado: ~1 h de implementación; sin despachos, solo la revisión final de rama.
6. Review Focus: 1 entrada que la spec no fija con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin `--planta`, la salida no cambia.

**Architecture**: `floors` asocia cada sala a su planta; `freeRooms(slot, floor)` filtra por planta antes de excluir las reservadas, y `run` extrae `--planta` de los argumentos y devuelve los avisos de la spec.

**Tech Stack**: Node 22, sin dependencias, `node --test` — ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada `src/app.js`.
- Textos de la salida en castellano, literales de la spec: `planta desconocida: <valor>`, `falta el número de planta`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- `scripts/lint.mjs` rechaza tabuladores en `src/app.js`: indentar con espacios.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits de la convención del proyecto (`feat:`), uno por task.

## Review Focus

- `libres 10:00-12:00 --planta 0` → `planta desconocida: 0`, no `falta…` ni la lista entera (un `0` no debe tratarse como «sin valor») · Task 1, `Planta_cero_es_desconocida`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un mapa y un parámetro, sin abstracciones nuevas.
- [x] **YAGNI gate**: nada abstraído.
- [x] **Brownfield gate**: sin `--planta` la salida es la de hoy (test de regresión); no se toca `cancelar`, `anular` ni `reservar`.
- [x] **Constitution check**: tests antes que código, textos en castellano, flujo SDD.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/libres-planta.test.js` — tests de `libres` con `--planta`.

**Modificar**:

- `src/app.js` — mapa `floors`, `freeRooms(slot, floor)` y el parseo de `--planta` en `run`.

**NO se tocan**:

- `test/app.test.js` — su test de `libres` sin `--planta` sigue siendo la regresión.
- `scripts/lint.mjs`, `README.md` — sin cambios.

### 1.2 Modelo de datos

`floors = { Norte: 1, Sur: 2 }` en memoria (decisión 1 de la spec).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Las plantas de ejemplo no son las reales | Media | Bajo | Decisión 1 de la spec; se corrige en `floors` al validar |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Filtrar `libres` por planta

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/libres-planta.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend (`src/app.js`)
**Verificación**: `node --test test/libres-planta.test.js test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el dev-lead ejecuta `node src/app.js libres 14:00-16:00 --planta 2` y ve `Sur`; sin `--planta` ve `Norte, Sur`.

**Interfaces**:
- Consume: `run(cmd, params)` y `bookings` de `src/app.js` tal como están (`bookings` tiene `Norte lun 10:00-12:00 active`).
- Produce: `freeRooms(slot, floor)` donde `floor` es `undefined` (sin filtro) o el texto del valor de `--planta`; devuelve la lista de salas libres de esa planta. `run('libres', params)` devuelve `freeRooms(...).join(', ')` o uno de los dos avisos.

**Ficheros**: crear `test/libres-planta.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** — en `test/libres-planta.test.js`, con `run` importado de `../src/app.js` y `assert` estricto (`bookings` trae solo `Norte` reservada de 10:00-12:00):
  - `Libres_sin_planta_no_cambia`: `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `Libres_filtra_por_planta`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'` y con `'1'` → `'Norte'`.
  - `Planta_sin_libres_vacia`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`.
  - `Planta_desconocida`: `['10:00-12:00', '--planta', '9']` → `'planta desconocida: 9'` y `'abc'` → `'planta desconocida: abc'`.
  - `Planta_cero_es_desconocida`: `['10:00-12:00', '--planta', '0']` → `'planta desconocida: 0'`.
  - `Planta_sin_valor`: `['10:00-12:00', '--planta']` → `'falta el número de planta'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const floors = { Norte: 1, Sur: 2 };`; `freeRooms(slot, floor)` filtra primero las salas con `String(floors[room]) === floor` cuando `floor !== undefined`, y después excluye las reservadas; en `run`, para `libres`: `const at = params.indexOf('--planta')`; si `at === -1` → `freeRooms(params[0])`; si `params[at + 1] === undefined` → `'falta el número de planta'`; si ninguna sala tiene esa planta → `` `planta desconocida: ${valor}` ``; si no, `freeRooms(params[0], valor).join(', ')`.
- [ ] **Step 3: Verificación** — `node --test test/libres-planta.test.js test/app.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: filtrar libres por planta (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,75 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task, ~15 líneas y 6 tests; sin referencias en el estimation-log (no existe); incertidumbre baja.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres sin filtro de planta: THEN `Sur` → Task 1, `Libres_sin_planta_no_cambia`. ✓
- Libres filtradas por planta: THEN `Sur` y AND `Norte` con `--planta 1` → Task 1, `Libres_filtra_por_planta`. ✓
- Planta sin salas libres: THEN cadena vacía → Task 1, `Planta_sin_libres_vacia`. ✓
- Planta desconocida: THEN `9` y AND `abc` → Task 1, `Planta_desconocida`. ✓
- Planta sin valor: THEN `falta el número de planta` → Task 1, `Planta_sin_valor`. ✓
- Tabla «cambia de forma» (`rooms`): sin cambio de forma, `floors` se añade al lado → Task 1, `Libres_sin_planta_no_cambia`. ✓
- Review Focus (`--planta 0`) → Task 1, `Planta_cero_es_desconocida`. ✓
