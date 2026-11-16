---
id: 20261116-112124-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos en `sdd-kit:effort-medium` + `sonnet` — son cambios de ~15 líneas con el código casi determinado por los tests; no hace falta más gama.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks**: la 1 trae el filtro entero con valor válido; la 2 añade el caso «sin valor». Se parte ahí porque son dos comportamientos con tests propios y la 2 toca solo el lector de argumentos.
4. **Lector de argumentos**: una función `parseLibres(params)` en `src/app.js` que devuelve `{ slot, floor }`. Sin ficheros nuevos: el proyecto es un solo fichero (architecture.md).
5. **Antes de la Task 1**: confirmar con el dev-lead las plantas de Norte y Sur (decisión 1 de la spec: Norte 1, Sur 2 son valores de ejemplo). Los tests las fijan.
6. **Coste estimado**: 0,5 h de implementación; sin despachos, sin coste de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin la opción, nada cambia.

**Architecture**: la planta pasa a ser un campo de cada sala (`rooms`); `run` separa `--planta` de la franja con `parseLibres` y `freeRooms(slot, floor)` filtra.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia un fichero y no añade módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Node ≥ 20, ES modules, sin dependencias externas (`package.json`, `architecture.md`).
- Texto de la interfaz en castellano (constitution, art. 4): los mensajes son literales de la spec, `sin salas en la planta <valor>` y `falta la planta: usa --planta <número>`.
- Sin comentarios que repitan el código ni que citen documentos (spec, task, constitution); clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- `run` devuelve siempre una cadena; «ninguna libre» es la cadena vacía.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits con la convención del proyecto, un commit por task, con el trailer de atribución de la sesión.
- Modelos: sin Haiku ni `fable`/`opus xhigh` en las tasks.

## Review Focus

- `libres 10:00-12:00 --planta 3` (planta inexistente con franja ocupada) → `sin salas en la planta 3`, no la cadena vacía · Task 1, `sin salas gana a la franja`
- `libres --planta 14:00-16:00` → el valor es `14:00-16:00` y sale `sin salas en la planta 14:00-16:00`, no un error de franja · Task 1, `valor con forma de franja`
- `libres 14:00-16:00 --planta --otra` → `falta la planta: usa --planta <número>`, no `sin salas en la planta --otra` · Task 2, `planta seguida de otra opción`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de lectura y un campo nuevo; no hay forma más simple.
- [x] **YAGNI gate**: nada se abstrae; `parseLibres` tiene un solo uso y se queda porque aísla el orden de los argumentos.
- [x] **Brownfield gate**: `libres` sin `--planta` da la misma salida (test existente de `app.test.js` lo fija); sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano en la interfaz (art. 4), gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` pasa a `[{ name: 'Norte', floor: '1' }, { name: 'Sur', floor: '2' }]`; `freeRooms(slot, floor)`; `parseLibres(params)`; la rama `libres` de `run`.
- `test/app.test.js` — los tests de `libres`, junto al existente.

**NO se tocan**:

- `scripts/lint.mjs`, `package.json` — sin cambios de herramientas.
- `CHANGELOG.md` — lo escribe el corte de release, no la feature.
- `bookings` y las demás ramas de `run` de `src/app.js` — otros comandos no cambian.

### 1.2 Modelo de datos

La planta vive en cada sala, en memoria; `bookings` no cambia.

### 1.3–1.5

No aplican (sin migraciones, API ni pantalla).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Las plantas de ejemplo no son las reales | alta | los escenarios y los datos cambian | confirmarlas antes de la Task 1; son una constante en `rooms` |
| La salida de `libres` sin planta cambia sin querer | baja | rompe a quien ya la use | el test existente de `libres` y el escenario «Listar» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — `libres` filtra por planta

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes de empezar y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 14:00-16:00 --planta 1` y ve `Norte`.

**Interfaces**:
- Consume: nada de tasks anteriores. Hoy `rooms` es `['Norte', 'Sur']`, `freeRooms(slot)` filtra por franja y `run('libres', params)` usa `params[0]` como franja.
- Produce: `parseLibres(params)` → `{ slot, floor }` donde `floor` es `undefined` si no hay `--planta`; `freeRooms(slot, floor)` → lista de nombres; `run('libres', …)` devuelve la cadena.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** — en `test/app.test.js`, un test por escenario de la spec, con `assert.equal(run('libres', [...]), '...')`:
  - `libres sin planta lista las libres de la franja`: `['10:00-12:00']` → `Sur`; `['14:00-16:00']` → `Norte, Sur`.
  - `planta filtra las libres`: `['14:00-16:00', '--planta', '1']` → `Norte`; `['--planta', '2', '14:00-16:00']` → `Sur`.
  - `planta con salas todas ocupadas`: `['10:00-12:00', '--planta', '1']` → `''`.
  - `planta sin salas`: `--planta 3` → `sin salas en la planta 3`; `x` → `sin salas en la planta x`; `01` → `sin salas en la planta 01`; `''` → `sin salas en la planta `.
  - `sin salas gana a la franja`: `['10:00-12:00', '--planta', '3']` → `sin salas en la planta 3`.
  - `valor con forma de franja`: `['--planta', '14:00-16:00']` → `sin salas en la planta 14:00-16:00`.
  - `planta repetida`: `['14:00-16:00', '--planta', '1', '--planta', '2']` → `Sur`.
  Ejecutar y ver que fallan (el test sin planta ya pasa hoy: es la regresión congelada).
- [ ] **Step 2: Implementación** — firmas: `function parseLibres(params)`: recorre `params`; un `--planta` seguido de un argumento que no empieza por `--` fija `floor` (la última vez gana) y consume ese argumento; el primer argumento restante es `slot`. `function freeRooms(slot, floor)`: filtra por `floor` si no es `undefined` (comparación `===` con el texto) y por franja como hoy, y devuelve los nombres. En `run`, la rama `libres`: si `floor !== undefined` y ninguna sala tiene esa planta, devuelve `` `sin salas en la planta ${floor}` ``; si no, `freeRooms(slot, floor).join(', ')`. Un `--planta` sin valor aquí no se trata (Task 2).
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, con la convención del proyecto (`feat:`), referenciando la 0012.

### Task 2 — `--planta` sin valor

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes de empezar y sin commitear.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 14:00-16:00 --planta` y ve `falta la planta: usa --planta <número>`.

**Interfaces**:
- Consume: `parseLibres(params)` y la rama `libres` de `run` de la Task 1.
- Produce: `parseLibres` devuelve además `missingFloor: true` cuando hay un `--planta` sin valor (último argumento o seguido de uno que empieza por `--`); `run` lo comprueba antes que «sin salas».

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** — `planta sin valor`: `['14:00-16:00', '--planta']` → `falta la planta: usa --planta <número>`; `planta seguida de otra opción`: `['14:00-16:00', '--planta', '--otra']` → el mismo mensaje. Ver que fallan.
- [ ] **Step 2: Implementación** — `parseLibres` marca `missingFloor` en esos dos casos; en `run`, si `missingFloor`, devuelve `'falta la planta: usa --planta <número>'` antes de mirar las salas. Si un `--planta` sin valor aparece antes de otro con valor válido, cuenta el último con valor (regla «última gana»).
- [ ] **Step 3: Verificación** — gate de la task: los dos comandos de arriba.
- [ ] **Step 4: Commit de la task** — uno solo, `feat:`, referenciando la 0012.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero; sin referencia en `estimation-log` (el proyecto no tiene calibración todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Listar las salas libres de una franja»: THEN `Sur` y AND `Norte, Sur` → Task 1, `libres sin planta lista las libres de la franja`. ✓
- «Filtrar por planta»: THEN `Norte` y AND `Sur` con la opción antes de la franja → Task 1, `planta filtra las libres`. ✓
- «Planta con salas, todas ocupadas»: THEN cadena vacía → Task 1, `planta con salas todas ocupadas`. ✓
- «Planta sin salas»: THEN y los AND `x`, `01` y `""` → Task 1, `planta sin salas`. ✓
- «Sin salas gana a la franja» → Task 1, `sin salas gana a la franja`. ✓
- «Planta sin valor»: THEN y AND `--otra` → Task 2, `planta sin valor` y `planta seguida de otra opción`. ✓
- «Valor de planta que parece una franja» → Task 1, `valor con forma de franja`. ✓
- «Planta repetida» → Task 1, `planta repetida`. ✓
- Precedencia «falta la planta» sobre «sin salas» (decisión 12) → Task 2, `run` la comprueba primero; la cubre `planta sin valor`. ✓
- Fila de «Lo que se retira o cambia de forma» (`rooms`, `freeRooms`) → Task 1, los tests de planta pasan solo con la forma nueva; `git grep -n "rooms"` en `src` no deja usos de la forma vieja. ✓
- Libres sin franja con `--planta` → N/A: fuera de contrato (decisión 12). ✓
- Review Focus: tres líneas → Task 1 (dos) y Task 2 (una), con el test nombrado. ✓
