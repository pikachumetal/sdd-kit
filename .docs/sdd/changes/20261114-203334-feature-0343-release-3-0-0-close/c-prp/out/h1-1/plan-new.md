---
id: 20261115-194129-feature-0012-libres-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: una sola task, la hace el hilo principal en Native, sin despacho; la sesión va bien en gama media (Sonnet, effort medium) porque el plan trae las firmas, los valores y los tests. La revisión final de rama no se quita: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Una task y no dos (análisis de argumentos por un lado y filtro por otro): los dos cambios están en `src/app.js` y los mismos tests los prueban de punta a punta; un revisor no aprobaría uno y rechazaría el otro.
4. Los tests nuevos van en `test/libres-planta.test.js`; el test actual de `libres` en `test/app.test.js` no se toca (cubre la línea de base).
5. La opción se busca con `params.indexOf('--planta')`; la repetición con `params.indexOf('--planta', i + 1)`. Es una decisión técnica que la spec no fija y no cambia lo que ve quien usa el comando.
6. Coste estimado: ~1,5 h en total (ver «Estimación y esfuerzo»); sin despachos, salvo los tres de la revisión final.
7. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> [--planta <n>]` filtra por planta y avisa si la planta no es válida; sin `--planta` devuelve lo de hoy.

**Architecture**: cada sala guarda su planta (`{ name, floor }`); `run` extrae y valida `--planta` antes de calcular la franja y `freeRooms` filtra por planta además de por reservas. Todo en `src/app.js`, el único fichero de entrada (`architecture.md`).

**Tech Stack**: Node 22 sin dependencias; tests con `node --test` (`operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia la forma interna de `rooms` y el análisis de argumentos de `libres` dentro de `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos o datos.

## Restricciones globales

### De código

- Node ≥ 20, sin dependencias externas; un solo fichero de entrada, `src/app.js` (`architecture.md`).
- Texto de la interfaz en castellano (constitution, art. 4); el aviso es literal: `planta no válida: usa un número, p. ej. --planta 1`.
- Planta válida: entero positivo escrito solo con dígitos y sin cero a la izquierda (`/^[1-9][0-9]*$/`); Norte = 1, Sur = 2.
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas. La constitution del proyecto no tiene artículo de calidad: valen estas dos reglas de comentarios.

### De proceso

- Tests antes que código (constitution, art. 2): RED escrito y visto fallar antes de implementar.
- Commits referenciando la feature 0012; la atribución es la del entorno.
- Modo de ejecución: Native, con ledger y una revisión final.

## Review Focus

- `libres --planta 14:00-16:00` (el valor es una franja) → el aviso, no una lista ni «sin franja» · Task 1, `valor_que_es_franja_avisa`
- `libres foo --planta alta` → el aviso gana a una franja que no coincide con nada · Task 1, `aviso_gana_a_franja_rara`
- `libres 14:00-16:00 --planta 1 --planta 1` (repetida con el mismo valor) → el aviso · Task 1, `planta_repetida_igual_avisa`
- `libres --planta 2` sin franja → `Sur`, filtra solo por planta · Task 1, `sin_franja_filtra_por_planta`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí, un fichero, dos funciones tocadas, sin módulo nuevo.
- [x] **YAGNI gate**: ninguna abstracción nueva; una función pequeña de validación con un uso real.
- [x] **Brownfield gate**: retrocompatible: sin `--planta` la salida no cambia (AND de línea de base); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), git-flow (art. 3), castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/libres-planta.test.js` — los tests de `--planta` por `run('libres', [...])`.

**Modificar**:

- `src/app.js` — `rooms` pasa a `[{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }]`; `freeRooms(slot, floor)` filtra también por planta; `run` extrae y valida `--planta`.

**NO se tocan**:

- `test/app.test.js` — su test de `libres` es la línea de base y debe seguir verde sin cambios.
- `PRODUCT.md` — el término «Planta» y la definición de Sala los escribe el cierre (spec, «Términos y ADR»).
- `README.md`, `CHANGELOG.md` — el changelog lo escribe el corte de la release.

### 1.2 Modelo de datos

La planta de cada sala es un dato fijo en memoria; sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comando: `libres <franja> [--planta <n>]`, con `--planta <n>` antes o después de la franja. Salidas: nombres separados por `, `, `''` si no hay ninguna, o el aviso.

### 1.5 UX

Salida de texto de la CLI; sin pantalla.

### 1.6 Dependencias

Ninguna. Parte de la spec 0006 (`libres`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Que la franja se tome antes de quitar `--planta <n>` y salga el valor como franja | media | alto | el orden va fijado en la task (valor, validar, quitar, franja) y lo prueba `valor_que_es_franja_avisa` |
| Que `[].join(', ')` no sea `''` en algún camino | baja | bajo | `planta_sin_salas` y `planta_no_rescata_sala_ocupada` comparan con `''` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `libres` filtra por planta y avisa si no es válida

**Tras**: —
**Modelo**: hilo principal en Native, sin despacho (gama media: Sonnet, effort medium); el plan trae firmas, valores y tests.
**Tests RED**: hilo principal · `test/libres-planta.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tooling (el lint del gate).
**Verificación**: `node --test test/libres-planta.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0` (la línea de base sigue verde).
**Se prueba en la aplicación**: sí: quien usa `node src/app.js libres 14:00-16:00 --planta 2` ve `Sur`; con `--planta 1`, `Norte`; con `--planta alta`, `planta no válida: usa un número, p. ej. --planta 1`.

**Interfaces**:
- Consume: `bookings` (Norte reservada el `lun` en `10:00-12:00`, estado `active`) y `run(cmd, params)` de `src/app.js`, tal como están.
- Produce: `freeRooms(slot, floor)` (`floor` es un número o `undefined`; devuelve `[{ name, floor }]`) y el contrato del comando `libres` de §1.4.

**Ficheros**: crear `test/libres-planta.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** — en `test/libres-planta.test.js`, con `import { run } from '../src/app.js'` y `assert.equal`; el aviso es `const aviso = 'planta no válida: usa un número, p. ej. --planta 1'`. Los tests no llaman a `reservar`:
  - `planta_filtra_libres`: `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'`; con `'1'` → `'Norte'`; `run('libres', ['--planta', '2', '14:00-16:00'])` → `'Sur'`.
  - `sin_planta_lista_todas`: `run('libres', ['14:00-16:00'])` → `'Norte, Sur'`; `run('libres', [])` → `'Norte, Sur'`.
  - `sin_franja_filtra_por_planta`: `run('libres', ['--planta', '2'])` → `'Sur'`.
  - `planta_no_rescata_sala_ocupada`: `run('libres', ['10:00-12:00', '--planta', '1'])` → `''`.
  - `planta_sin_salas`: `run('libres', ['10:00-12:00', '--planta', '3'])` → `''`.
  - `planta_sin_valor_avisa`: `run('libres', ['14:00-16:00', '--planta'])` → `aviso`.
  - `valor_que_es_franja_avisa`: `run('libres', ['--planta', '14:00-16:00'])` → `aviso`.
  - `planta_no_entera_avisa`: para `alta`, `0`, `-1`, `1.5`, `01` → `aviso`; y `run('libres', ['14:00-16:00', '--planta', '2'])` → `'Sur'` (no es el aviso).
  - `aviso_gana_a_franja_rara`: `run('libres', ['foo', '--planta', 'alta'])` → `aviso`.
  - `planta_repetida_avisa`: `['14:00-16:00', '--planta', '1', '--planta', '2']` → `aviso`.
  - `planta_repetida_igual_avisa`: `['14:00-16:00', '--planta', '1', '--planta', '1']` y `['14:00-16:00', '--planta', '1', '--planta']` → `aviso`.
  Ejecutarlos y ver que fallan (RED), cada uno por la razón esperada. Esperado: `ℹ fail` > 0.
- [ ] **Step 2: Implementación** — en `src/app.js`:
  - `const rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }];`
  - `function freeRooms(slot, floor)`: filtra `rooms` por `floor === undefined || room.floor === floor` y por que no haya una reserva activa de `room.name` en `slot` (la condición actual, con `room.name` en vez de `room`); devuelve las salas.
  - `function parseFloor(params)`: devuelve `{ floor, rest }` o `{ error: aviso }`. Busca `i = params.indexOf('--planta')`; sin `--planta`, `{ floor: undefined, rest: params }`. Con `--planta`: si `params.indexOf('--planta', i + 1) !== -1` → `{ error }`; el valor es `params[i + 1]`: si no cumple `/^[1-9][0-9]*$/` (o es `undefined`) → `{ error }`; si cumple, `floor = Number(valor)` y `rest` es `params` sin las posiciones `i` e `i + 1`.
  - En `run`: `if (cmd === 'libres')` llama a `parseFloor(params)`; con `error` devuelve el aviso; si no, `freeRooms(rest[0], floor).map((room) => room.name).join(', ')`. El resto de comandos no cambian.
- [ ] **Step 3: Verificación** — `node --test test/libres-planta.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(libres): filtrar por --planta (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 1 task en un fichero, 12 tests pequeños; sin estimation-log previo con que calibrar.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): `libres 14:00-16:00 --planta 2` → `Sur`; sin `--planta`, lo de hoy.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Libres de una franja (línea de base: `libres 10:00-12:00` → `Sur`) → Task 1, `node --test test/app.test.js` (test actual de `libres`, sin cambios). ✓
- Libres de una planta, THEN `--planta 2` → `Sur` y AND `--planta 1` → `Norte` → Task 1, `planta_filtra_libres`. ✓
- AND `--planta 2` antes de la franja → `Sur` → Task 1, `planta_filtra_libres`. ✓
- AND sin franja `--planta 2` → `Sur` → Task 1, `sin_franja_filtra_por_planta`. ✓
- AND sin `--planta` → `Norte, Sur` y sin franja ni `--planta` → `Norte, Sur` → Task 1, `sin_planta_lista_todas`. ✓
- La planta no rescata una sala ocupada → `''` → Task 1, `planta_no_rescata_sala_ocupada`. ✓
- Planta sin salas → `''` → Task 1, `planta_sin_salas`. ✓
- Planta sin valor y AND `--planta 14:00-16:00` → aviso → Task 1, `planta_sin_valor_avisa` y `valor_que_es_franja_avisa`. ✓
- Planta no entera, AND `0`, `-1`, `1.5`, `01`, AND `--planta 2` no avisa, AND `foo --planta alta` → Task 1, `planta_no_entera_avisa` y `aviso_gana_a_franja_rara`. ✓
- Planta repetida y ANDs `1 1` y `1 --planta` → Task 1, `planta_repetida_avisa` y `planta_repetida_igual_avisa`. ✓
- Reglas de la capacidad (límites, aviso, orden de salida `Norte, Sur`) → Task 1, los mismos tests. ✓
- Fila de «Lo que se retira o cambia de forma» (`rooms` pasa a objetos) → Task 1, los tests de `libres` y `node --test test/app.test.js` en verde: si `rooms` se leyera en otro sitio, fallarían. ✓
- `reservar`, `cancelar`, `anular`, la forma `--planta=<n>` → N/A (confirmado en spec, «No entra»). ✓
- Línea del Review Focus (4) → Task 1, `valor_que_es_franja_avisa`, `aviso_gana_a_franja_rara`, `planta_repetida_igual_avisa`, `sin_franja_filtra_por_planta`. ✓
