---
id: 20261111-200105-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar salas libres por planta
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Filtrar salas libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, las dos tasks las hace la sesión (Sonnet, effort medium); la Task 1 trae las firmas y el algoritmo de lectura de argumentos escritos, la Task 2 es texto. La revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; no se quita aunque sean dos tasks, porque en Native es la única revisión independiente.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Decisión técnica que la spec no fija**: la lectura de argumentos va en una función pura `parseLibres(params)` de `src/app.js` (no un fichero nuevo: el proyecto tiene un solo fichero de entrada, `architecture.md`), y devuelve `{ slot, planta }` o `{ error }`. Se exporta para probarla sola.
4. **Riesgos altos**: ninguno; el cambio es ~20 líneas y la salida sin `--planta` la fija el test existente.
5. **Coste estimado**: ~1 h; sin despachos, solo la revisión final.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
7. **Gate de cierre**: el de `operations.md` §Testing, literal.
8. **Cláusula que nada observa**: «si todas están reservadas en la franja, la salida es vacía» de «Libres de una franja»: `bookings` no se exporta y solo tiene una reserva, así que ningún test llega a ese estado; lo cubre el mismo filtro que `planta sin salas libres`. Sin test propio por no ampliar el alcance.

**Goal**: `salas libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin la opción, la salida no cambia.

**Architecture**: `rooms` pasa de nombres a `{ name, planta }`; `freeRooms(slot, planta)` filtra por planta cuando se la pasan; `run` delega la lectura de argumentos de `libres` en `parseLibres` y traduce sus errores a los avisos de la spec.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` dentro de su estructura actual: sin módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Texto de la interfaz y de los documentos en castellano (constitution, art. 4); los avisos, literales de la spec: `no existe la planta <n>`, `--planta necesita un número de planta`, `--planta solo se admite una vez`.
- Plantas: `Norte` → 1, `Sur` → 2.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas y con un solo cometido.
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).

### De proceso

- Native, sin subagentes de implementación; commits de la task con el trailer de atribución del proyecto.
- Política de modelos: gama media para las tasks; `fable` y `opus xhigh` prohibidos por defecto.

## Review Focus

- `salas libres 10:00-12:00 --planta` (opción al final, sin valor) → `--planta necesita un número de planta`, no una excepción · Task 1, `planta sin valor al final`
- `salas libres --planta 10:00-12:00` (el valor se come la franja) → mismo aviso, no «sin franja» · Task 1, `valor que parece franja`
- `--planta x --planta 2` → aviso de repetición, no el de valor · Task 1, `repetida gana a valor inválido`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función pura y un filtro, sin módulo nuevo.
- [x] **YAGNI gate**: nada abstraído; `parseLibres` tiene un solo uso real pero aísla lo que se prueba.
- [x] **Brownfield gate**: retrocompatible (la salida sin `--planta` no cambia, test existente); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2); texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/libres-planta.test.js` — tests de los THEN de `room-availability`.

**Modificar**:

- `src/app.js` — `rooms` con planta, `freeRooms(slot, planta)`, `parseLibres`, rama `libres` de `run`.
- `PRODUCT.md` — término «Planta».
- `CHANGELOG.md` — línea en `[Unreleased] / Added`.

**NO se tocan**:

- `test/app.test.js` — su test de `libres` debe seguir verde sin cambios.
- `test/cancel.test.js`, `scripts/lint.mjs` — fuera del alcance.

### 1.2 Modelo de datos

`rooms = [{ name: 'Norte', planta: 1 }, { name: 'Sur', planta: 2 }]`, en memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` compara `room` por nombre y `rooms` ya no son cadenas | Media | Alta | `freeRooms` compara `b.room === room.name`; el test existente lo caza |
| Plantas inventadas no son las reales | Alta | Baja | Decisión 1 de la spec, para que el dev-lead la corrija |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Filtro `--planta` en `libres`

**Tras**: —
**Modelo**: Native: la sesión, Sonnet con effort medium (la task trae firmas y algoritmo escritos).
**Tests RED**: hilo principal · `test/libres-planta.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/libres-planta.test.js test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js libres 10:00-12:00 --planta 2` y ve `Sur`; con `--planta 9`, `no existe la planta 9`.

**Interfaces**:
- Consume: nada de tasks anteriores. Hoy: `rooms` de cadenas, `freeRooms(slot)`, `run(cmd, params)` en `src/app.js`; `bookings` guarda `room` por nombre.
- Produce: `rooms` con `{ name, planta }`; `freeRooms(slot, planta)` (`planta` opcional, número); `export function parseLibres(params)` → `{ slot, planta }` (`planta` es `undefined` sin la opción, si no un número) | `{ error: string }` con uno de los tres avisos de la spec.

**Ficheros**: crear `test/libres-planta.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — en `test/libres-planta.test.js`, con `run` de `../src/app.js` y `assert.equal`, un test por requisito (nombres literales):
  - `libres por planta` → `run('libres', ['10:00-12:00', '--planta', '2'])` es `'Sur'`; `run('libres', ['14:00-16:00', '--planta', '1'])` es `'Norte'`; `run('libres', ['--planta', '2', '10:00-12:00'])` es `'Sur'`.
  - `planta sin salas libres` → `run('libres', ['10:00-12:00', '--planta', '1'])` es `''`.
  - `planta inexistente` → `['10:00-12:00', '--planta', '9']` da `'no existe la planta 9'`; con `'0'`, `'no existe la planta 0'`.
  - `planta sin valor al final` → `['10:00-12:00', '--planta']` da `'--planta necesita un número de planta'`.
  - `valor que parece franja` → `['--planta', '10:00-12:00']` da el mismo aviso; también con `'2.5'` y `'-1'`.
  - `repetida gana a valor inválido` → `['10:00-12:00', '--planta', '1', '--planta', '2']` da `'--planta solo se admite una vez'`; y `['10:00-12:00', '--planta', 'x', '--planta', '2']` da el mismo.
  - `sin franja` → `['--planta', '2']` es `'Sur'`; `run('libres', [])` es `'Norte, Sur'`.
  - `ceros delante` → `['10:00-12:00', '--planta', '02']` es `'Sur'`.
  - `sin planta, todas las libres` → `['14:00-16:00']` es `'Norte, Sur'`.
  Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `rooms` como en §1.2; `freeRooms(slot, planta)` filtra `rooms` por `planta === undefined || room.planta === planta`, excluye las ocupadas comparando `b.room === room.name` y devuelve nombres; `parseLibres(params)`: si `--planta` aparece más de una vez → `{ error: '--planta solo se admite una vez' }`; si aparece una vez, su valor es el elemento siguiente (se consume siempre) y debe cumplir `/^\d+$/`, si no → `{ error: '--planta necesita un número de planta' }`; el valor pasa por `Number`; `slot` es el primer elemento restante. En `run`, rama `libres`: si hay `error`, devuélvelo; si `planta` no coincide con la de ninguna sala → ``no existe la planta ${planta}``; si no, `freeRooms(slot, planta).join(', ')`.
- [ ] **Step 3: Verificación** — `node --test test/libres-planta.test.js test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(libres): filtrar por planta con --planta (0012)`.

### Task 2 — Vocabulario y changelog

**Tras**: Task 1
**Modelo**: Native: la sesión, Sonnet con effort medium (texto).

**Superficies**: docs
**Verificación**: `git grep -n "Planta" -- PRODUCT.md CHANGELOG.md` → una línea en `PRODUCT.md` y otra en `CHANGELOG.md`; `node --test && node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es documentación: no cambia lo que la persona ve en la terminal.

**Interfaces**:
- Consume: el comando `--planta` de la Task 1 (nombre y uso).
- Produce: nada que otra task use.

**Ficheros**: modificar `PRODUCT.md`, `CHANGELOG.md`

- [ ] **Step 1: Implementación** — en `PRODUCT.md`, bajo «Terminology», `- **Planta**: altura del edificio en la que está una sala; un número entero (1, 2…). _Evitar_: nivel, piso.`; en `CHANGELOG.md`, bajo `[Unreleased]` → `### Added`: `- Filtro de salas libres por planta (`salas libres 10:00-12:00 --planta 2`). [feature 0012](.docs/sdd/changes/20261111-200105-feature-0012-libres-por-planta/)`.
- [ ] **Step 2: Verificación** — los comandos de «Verificación».
- [ ] **Step 3: Commit de la task** — `docs: término Planta y changelog de libres por planta (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks, ~20 líneas de código y ~40 de tests en un solo fichero de entrada; sin estimation-log previo del que calibrar.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent): con `--planta N` solo salen las libres de esa planta, y sin la opción la salida no cambia
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Libres de una franja»: `Sur`; vacía si todas reservadas; `Norte, Sur` en otra franja y sin franja → Task 1, `sin planta, todas las libres`, `sin franja` y el test existente de `test/app.test.js`. ✓ (la salida vacía con todas reservadas: ninguna reserva más en los datos; se observa con `planta sin salas libres`, que solo reserva una — ⚠ sin observar con las dos reservadas: avisado, el código es el mismo filtro)
- «Libres de una planta»: `Sur`; `Norte` en otra franja; `--planta` antes de la franja; solo el nombre → Task 1, `libres por planta`. ✓
- «Planta sin salas libres»: vacía, sin aviso, y otra franja da `Norte` → Task 1, `planta sin salas libres` y `libres por planta`. ✓
- «Planta que no existe»: `9` y `0` → Task 1, `planta inexistente`. ✓
- «Planta sin número»: sin valor, `10:00-12:00`, `2.5`, `-1`, y repetición gana → Task 1, `planta sin valor al final`, `valor que parece franja`, `repetida gana a valor inválido`. ✓
- «Planta repetida» → Task 1, `repetida gana a valor inválido`. ✓
- «Planta sin franja o con ceros» → Task 1, `sin franja`, `ceros delante`. ✓
- Reglas de la capacidad (datos en memoria, castellano, límites, avisos) → Task 1, los literales de los tests. ✓
- Vocabulario y changelog (Scope) → Task 2, `git grep`. ✓
- Review Focus → Task 1: `planta sin valor al final`, `valor que parece franja`, `repetida gana a valor inválido`. ✓
