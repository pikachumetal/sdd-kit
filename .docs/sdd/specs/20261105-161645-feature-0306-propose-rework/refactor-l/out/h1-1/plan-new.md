---
id: 20261106-114217-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar las salas libres por planta
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Filtrar las salas libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, la hace el hilo principal (Native) sin despachar; la revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no se despacha (ver el eje).
2. **Ejecución**: Native, fijado en `sdd-kit.json` — una task, un fichero de código y uno de tests.
3. **Una sola task**: el filtro y el dato de la planta no se pueden probar por separado (sin planta no hay filtro) y un revisor no aprobaría uno y rechazaría el otro.
4. **Análisis de los argumentos en una función aparte** (`parseLibres`, sin exportar): `run` ya mezcla cuatro comandos y la lectura de la opción, el valor y la franja no cabe en una línea; el parser no cambia a `reservar` ni a `cancelar`.
5. **Valor válido = `/^\d+$/`**: lo fija la spec (entero sin signo); `--planta 0` es válido y da salida vacía, no aviso.
6. **Coste estimado**: ~0,5 h de implementación, sin despachos.
- Review Focus: 2 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> [--planta <n>]` filtra las salas libres por planta; sin `--planta` da lo de hoy.

**Architecture**: cada sala de `rooms` pasa de texto a `{ name, planta }`; `parseLibres(params)` devuelve `{ slot, planta, error }` y `freeRooms(slot, planta)` filtra. `run('libres')` devuelve el aviso si `error`, y si no la lista unida con `, `.

**Tech Stack**: Node 22 sin dependencias, un fichero `src/app.js`, tests con `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos: solo cambia la forma interna de `rooms` y el análisis de argumentos de `libres` dentro de `src/app.js`.

## Restricciones globales

### De código

- La planta es un entero sin signo: `/^\d+$/`; `--planta=<n>`, `abc`, `2.5`, `-1`, vacío o sin valor dan `falta el número de planta`.
- El aviso exacto es `falta el número de planta`; las libres se unen con `, `.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas. La constitution del proyecto no tiene artículo de calidad: valen estas dos reglas.

### De proceso

- Tests antes que código (constitution, art. 2). Gate de cierre una sola vez, en §3.
- Commits en castellano, convención del repo (`feat:`), con la línea `Co-Authored-By` que pide la sesión.

## Review Focus

- `libres 10:00-12:00 --planta 0` → salida vacía, sin aviso (0 es un entero sin signo válido) · Task 1, `libres --planta sin salas libres o inexistente`
- `libres 10:00-12:00 --planta ""` (valor vacío) → `falta el número de planta` · Task 1, `libres --planta sin número da el aviso`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un parser pequeño y un campo; no hay forma más simple que cubra la opción antes o después de la franja.
- [x] **YAGNI gate**: ninguna abstracción nueva con menos de 3 usos; `parseLibres` tiene un uso y existe por legibilidad, no por reutilización.
- [x] **Brownfield gate**: `libres <franja>` sin opción da lo de hoy (el test existente sigue); sin refactor fuera de `rooms` y `libres`.
- [x] **Constitution check**: tests antes que código, texto en castellano, gate completo en verde.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` con `planta`; `parseLibres`; `freeRooms(slot, planta)`; `run('libres')`.
- `test/app.test.js` — los tests de `libres` con `--planta`.

**NO se tocan**:

- `test/cancel.test.js`, `scripts/lint.mjs` — no los afecta.
- `PRODUCT.md` — el término «Planta» lo escribe el cierre (`sdd-archive`).
- `.docs/sdd/changelog.md` — lo escribe el cierre.

### 1.2 Modelo de datos

`rooms = [{ name: 'Norte', planta: 1 }, { name: 'Sur', planta: 2 }]`, en memoria como las reservas.

### 1.3 a 1.6

No aplican (sin migraciones, API, pantalla ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `rooms` cambia de forma y algo más lo usa como texto | Baja | Medio | `git grep "rooms"` solo da `freeRooms`; el test de `libres` sin opción lo pilla |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `libres` filtra por `--planta`

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho; el hilo escribe los tests antes que el código.
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js libres 10:00-12:00 --planta 2` y ve `Sur`; con `--planta 1` no ve nada; con `--planta` a secas ve `falta el número de planta`.

**Interfaces**:
- Consume: nada de tasks anteriores; usa `bookings` y `run` de `src/app.js`.
- Produce: `rooms` como `{ name, planta }[]`; `parseLibres(params: string[]): { slot?: string, planta?: number, error?: string }` (sin exportar); `freeRooms(slot: string | undefined, planta?: number): string[]` (nombres de sala).

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js`, con las reservas de siempre (Norte con reserva activa en `10:00-12:00`):
  - `libres sin --planta lista todas las libres`: `run('libres', ['12:00-14:00'])` → `'Norte, Sur'`; `run('libres', [])` → `'Norte, Sur'`.
  - `libres --planta filtra por planta`: `['10:00-12:00', '--planta', '2']` → `'Sur'`; `['10:00-12:00', '--planta', '1']` → `''`; `['12:00-14:00', '--planta', '1']` → `'Norte'`.
  - `libres acepta --planta antes de la franja y sin franja`: `['--planta', '2', '10:00-12:00']` → `'Sur'`; `['--planta', '2']` → `'Sur'`.
  - `libres --planta sin salas libres o inexistente`: `['10:00-12:00', '--planta', '9']` → `''`; `['10:00-12:00', '--planta', '0']` → `''`.
  - `libres --planta sin número da el aviso`: cada una → `'falta el número de planta'`: `['10:00-12:00', '--planta']`, `[..., '--planta', 'abc']`, `[..., '--planta', '2.5']`, `[..., '--planta', '-1']`, `[..., '--planta', '']`, `['--planta', '10:00-12:00']`, `['10:00-12:00', '--planta=2']`.
  - `libres --planta repetida decide la última`: `['10:00-12:00', '--planta', '1', '--planta', '2']` → `'Sur'`; `['10:00-12:00', '--planta', '2', '--planta']` → `'falta el número de planta'`.
  - Los tests existentes de `app.test.js` no se tocan.
- [ ] **Step 2: Ver el rojo** — `node --test test/app.test.js`. Esperado: los tests nuevos fallan (`ℹ fail` > 0), los dos antiguos pasan.
- [ ] **Step 3: Implementación** en `src/app.js`: `rooms` con `planta`; `freeRooms(slot, planta)` filtra por `planta` si viene y devuelve nombres; `parseLibres(params)`: recorre los argumentos, `--planta` toma el siguiente como valor (el último `--planta` decide; `--planta=…` o un valor que no cumple `/^\d+$/` o ausente → `error: 'falta el número de planta'`), la franja es el primer argumento que no es la opción ni su valor; `run('libres', params)` devuelve `error` o `freeRooms(...).join(', ')`.
- [ ] **Step 4: Verificación** — `node --test test/app.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo: `feat: libres filtra por --planta` (0012).

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 1 task, un fichero de código y uno de tests; sin referencia en el estimation-log (no existe todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent): `libres 10:00-12:00` da lo de hoy y `--planta` filtra
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres por franja, THEN `Sur` → Task 1, test existente `libres excluye la sala reservada en la franja`. ✓
- Libres por franja, AND `12:00-14:00` → `Norte, Sur` y `libres` sin franja → Task 1, `libres sin --planta lista todas las libres`. ✓
- Filtrar por planta, THEN `Sur`, AND vacía con planta 1, AND `Norte` con 12:00-14:00 → Task 1, `libres --planta filtra por planta`. ✓
- Filtrar por planta, AND `--planta 2 10:00-12:00` y `--planta 2` sin franja → Task 1, `libres acepta --planta antes de la franja y sin franja`. ✓
- Planta sin salas libres o inexistente → Task 1, `libres --planta sin salas libres o inexistente`. ✓
- Planta sin valor o no número (6 AND de la spec, con `--planta=2`) → Task 1, `libres --planta sin número da el aviso`. ✓
- Planta repetida, THEN `Sur` y AND del aviso → Task 1, `libres --planta repetida decide la última`. ✓
- Regla «Avisos» y «Límites» → Task 1, los mismos tests de aviso y de planta inexistente. ✓
- Término «Planta» en `PRODUCT.md` → sin observar: lo escribe el cierre, no hay test (avisado en la spec, decisión 8). ⚠
- Línea del Review Focus `--planta 0` → Task 1, `libres --planta sin salas libres o inexistente`. ✓
- Línea del Review Focus `--planta ""` → Task 1, `libres --planta sin número da el aviso`. ✓
- Nada se retira (tabla de la spec) → N/A, confirmado en spec. ✓
