---
id: 20261106-100919-feature-0012-planta-libres
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 con `subagent_type: sdd-kit:effort-medium` + `model: sonnet` si hubiera despacho; en Native las hace el hilo en gama media. Cambio pequeño en un fichero con la firma y los tests ya fijados: no pide más.
2. **Ejecución**: native, porque 2 tasks encadenadas por una misma función (`splitFloorOption`), un error lo caza el test de su task y el plan cabe en un contexto.
3. **Dos tasks, no una**: la Task 1 entrega el filtro con la franja y sin ella; la Task 2 añade los dos errores. Un revisor podría aprobar el filtro y rechazar el texto de los errores.
4. **Técnica que la spec no fija**: `rooms` pasa a `[{ name, floor }]`; la planta se compara como texto contra `String(floor)`, así `02` y `1.5` caen en «desconocida» sin lógica extra.
5. **Parada**: el dev-lead pidió parar tras la spec y el plan, antes de implementar; no se invoca `sdd-implement`. Al retomar, el opening (spec + plan) va en su commit antes de los RED de la Task 1.
6. **Coste estimado**: ~1 h de implementación; sin despachos en Native salvo la revisión final de rama.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres [franja] [--planta <n>]` filtra por planta; sin `--planta` todo sigue igual.

**Architecture**: `rooms` lleva la planta de cada sala en `src/app.js`; una función `splitFloorOption(params)` separa `--planta <n>` de los parámetros posicionales y `run` filtra con ella.

**Tech Stack**: Node 22 sin dependencias, un solo fichero de entrada `src/app.js`; tests con `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por una misma función, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos; solo cambia `src/app.js` y su test.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; todo en `src/app.js` (`tech-stack.md`).
- Textos de interfaz en castellano, literales de la spec: `planta desconocida: <valor>` y `falta el valor de --planta`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.
- `scripts/lint.mjs` falla si `src/app.js` tiene tabuladores: indentar con espacios.

### De proceso

- TDD: RED escrito y visto fallar antes del código (`sdd-tdd`).
- Un commit por task, convención del proyecto; atribución según el kit.

## Review Focus

- `libres --planta 2` (sin franja) → `Sur`, no un error por franja ausente · Task 1, `libres --planta 2 sin franja`
- `libres 14:00-16:00 --planta 02` → `planta desconocida: 02` (no se normaliza el número) · Task 2, `planta con ceros a la izquierda es desconocida`
- `libres --planta` (opción sola, sin franja ni valor) → `falta el valor de --planta`, no `planta desconocida: undefined` · Task 2, `falta el valor sin franja`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función y un campo; sin parser de opciones genérico.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `libres` sin `--planta` da lo de hoy; el test existente sigue verde sin tocarlo.
- [x] **Constitution check**: artículos 1 a 4 respetados (SDD, tests antes que código, git-flow, castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno de producción.

**Modificar**:

- `src/app.js` — `rooms` con planta; `splitFloorOption`; `freeRooms(slot, floor)`; rama `libres` de `run`.
- `test/app.test.js` — los tests de las dos tasks, junto al de `libres` existente.

**NO se tocan**:

- `reservar`, `cancelar`, `anular` en `src/app.js` — fuera del Scope.
- `PRODUCT.md`, `.docs/sdd/changelog.md` — los escribe el cierre.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Que `Norte`=1 y `Sur`=2 no sea el dato real | Media | Bajo | Está en ✋ de la spec; se confirma en la validación y es un valor en `rooms` |
| Romper `libres <franja>` al sacar la franja de `params[0]` | Baja | Medio | El test existente sigue sin cambios y corre en la Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Filtrar `libres` por planta

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, el hilo en gama media)
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task

Tests nuevos en `test/app.test.js` (más el existente `libres excluye la sala reservada en la franja`, que no cambia):

- `libres sin franja ocupada lista todas`: `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`
- `libres --planta 1`: `run('libres', ['14:00-16:00', '--planta', '1'])` → `'Norte'`
- `libres --planta 2`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`
- `libres con --planta antes de la franja`: `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`
- `libres --planta 2 sin franja`: `run('libres', ['--planta', '2'])` → `'Sur'`
- `planta sin salas libres`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`

**Superficies**: backend (CLI)
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 14:00-16:00 --planta 1` y ve `Norte`; sin `--planta` ve `Norte, Sur`.

**Interfaces**:
- Consume: nada.
- Produce: `splitFloorOption(params)` → `{ floor, rest }`, con `floor` el texto que siguió a `--planta` (o `undefined` si no vino) y `rest` los demás parámetros en su orden; `freeRooms(slot, floor)` filtra por `String(room.floor) === floor` cuando `floor` no es `undefined`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: RED** — escribir los seis tests; ejecutar `node --test test/app.test.js`. Esperado: los de `--planta` fallan (hoy la franja se toma de `params[0]`, así que `--planta` se trata como franja y devuelve `'Norte, Sur'`).
- [ ] **Step 2: Implementación** — `const rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }];` · `function splitFloorOption(params)` · `freeRooms(slot, floor)` devuelve nombres y filtra por planta; la rama `libres` de `run` hace `const { floor, rest } = splitFloorOption(params); return freeRooms(rest[0], floor).join(', ');`.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0012): libres filtra por --planta`.

### Task 2 — Rechazar una planta inválida o sin valor

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, el hilo en gama media)
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task

- `planta desconocida`: `run('libres', ['14:00-16:00', '--planta', '9'])` → `'planta desconocida: 9'`
- `planta no numérica es desconocida`: con `abc` → `'planta desconocida: abc'`; con `1.5` → `'planta desconocida: 1.5'`
- `planta con ceros a la izquierda es desconocida`: con `02` → `'planta desconocida: 02'`
- `falta el valor`: `run('libres', ['14:00-16:00', '--planta'])` → `'falta el valor de --planta'`
- `falta el valor sin franja`: `run('libres', ['--planta'])` → `'falta el valor de --planta'`

**Superficies**: backend (CLI)
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js libres 14:00-16:00 --planta 9` y ve `planta desconocida: 9`; con `--planta` al final ve `falta el valor de --planta`.

**Interfaces**:
- Consume: `splitFloorOption(params)` y `freeRooms(slot, floor)` de la Task 1.
- Produce: `splitFloorOption` devuelve además `missingValue: true` cuando `--planta` es el último parámetro; la rama `libres` devuelve `falta el valor de --planta` en ese caso y `planta desconocida: <floor>` cuando `floor` no coincide con ninguna `String(room.floor)`.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: RED** — escribir los cinco tests; ejecutar `node --test test/app.test.js`. Esperado: fallan (hoy `--planta 9` devuelve `''` y `--planta` sin valor, una lista sin filtrar o un error de la Task 1).
- [ ] **Step 2: Implementación** — `missingValue` en `splitFloorOption`; en la rama `libres`, antes de filtrar: si `missingValue`, devolver `falta el valor de --planta`; si `floor !== undefined` y ninguna sala tiene `String(room.floor) === floor`, devolver `planta desconocida: ${floor}`.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js`. Esperado: `ℹ fail 0`, con los seis tests de la Task 1 incluidos.
- [ ] **Step 4: Commit de la task** — `feat(0012): libres rechaza planta inválida o sin valor`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.7h
- Estimación de implementación: 0.8h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks pequeñas en un fichero; referencia la 0006 (`free`), 1h reales; sin log de calibración todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): `libres 10:00-12:00 --planta 2` → `Sur`; sin `--planta`, igual que hoy
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Listar las salas libres de una franja»: THEN `libres 10:00-12:00` → `Sur` → test existente, corre en Task 1 ✓; AND `libres 14:00-16:00` → `Norte, Sur` → Task 1, `libres sin franja ocupada lista todas` ✓
- «Filtrar libres por planta»: THEN `--planta 1` → `Norte` → Task 1 ✓; AND `--planta 2` → `Sur` → Task 1 ✓; AND opción antes de la franja → Task 1 ✓; AND sin franja → Task 1, `libres --planta 2 sin franja` ✓
- «Planta sin salas libres»: THEN `""` → Task 1, `planta sin salas libres` ✓
- «Rechazar una planta inválida»: THEN `9` → Task 2, `planta desconocida` ✓; AND `abc`, `1.5` → Task 2, `planta no numérica es desconocida` ✓; AND `02` → Task 2, `planta con ceros a la izquierda es desconocida` ✓
- «Rechazar `--planta` sin valor»: THEN → Task 2, `falta el valor` ✓
- Sin `--planta`, la salida no cambia (Intent) → test existente y `libres sin franja ocupada lista todas` ✓
- Línea del Review Focus 1 → Task 1; 2 y 3 → Task 2 ✓
- «Lo que se retira o cambia de forma»: `rooms` y el primer parámetro de `libres` → Task 1, Step 2 ✓
