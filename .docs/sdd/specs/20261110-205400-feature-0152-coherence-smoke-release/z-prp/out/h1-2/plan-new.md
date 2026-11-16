---
id: 20261112-162723-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos tasks las hace la propia sesión (Native), en gama media (Sonnet, effort medium) — la spec fija textos y valores y el cambio es de ~25 líneas en un solo fichero. La revisión final de rama no sigue esta política: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks, no una**: la 1 lleva el filtro con valores válidos (lo que se ve cuando todo va bien); la 2, los avisos y el CHANGELOG. Un revisor podría aprobar el filtro y rechazar los mensajes.
4. **Los tests nuevos viven en `test/libres.test.js`**, no en `test/app.test.js`: dos de ellos mutan las reservas del módulo (cancelar y anular), así que cada uno importa una copia nueva de `src/app.js` con `import('../src/app.js?<etiqueta>')` y no se contaminan entre sí ni con el resto. `test/app.test.js` no cambia: su test `libres excluye la sala reservada en la franja` es el de regresión del requisito 1.
5. **Riesgo alto**: ninguno; el riesgo medio es romper `libres <franja>` sin `--planta` — lo cubren el test existente y los del requisito 1.
6. **Coste**: ~1 h de implementación, sin despachos de subagentes; la revisión final sí despacha 3 ejes (orden de magnitud: ~300k tokens).
7. **`--planta 09` con planta inexistente muestra la planta ya convertida** (`sin salas en la planta 9`) — la spec fija el texto pero no cómo se escribe el número; es el mismo número que se compara.
8. **Review Focus**: 4 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> [--planta <n>]` filtra por planta y avisa de plantas inexistentes o mal escritas; sin `--planta` todo sigue igual.

**Architecture**: cada sala pasa a `{ name, floor }`; `freeRooms(slot, floor)` es el único sitio que decide qué sala sale, y una función `listFree(params)` separa `--planta <valor>` de la franja y compone la respuesta.

**Tech Stack**: Node 22 sin dependencias, `node --test`, un solo fichero de entrada `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia la estructura interna de `src/app.js`; sin módulo nuevo, sin dependencia, sin contrato entre módulos ni datos persistentes.

## Restricciones globales

### De código

- Texto de la interfaz en castellano, literal de la spec: `sin salas en la planta <n>` y `planta no válida: usa un número, p. ej. --planta 1`.
- Salida por `console.log`, código 0, como el resto de respuestas; la «línea vacía» es la cadena `''`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin dependencias nuevas (`architecture.md`).
- La constitution del proyecto no tiene artículo de calidad de código; valen las dos reglas del kit: ningún comentario que repita lo que dice el código, y ninguno que cite documentos (constitution, spec, task, capacidad).

### De proceso

- Método Native fijado en `sdd-kit.json`; commits con la convención del proyecto (`feat:`), uno por task al quedar limpia su revisión.
- Atribución de los commits: la línea `Co-Authored-By` del kit.

## Review Focus

- `libres --planta 14:00-16:00` (la franja como valor de la opción) → `planta no válida: usa un número, p. ej. --planta 1`, no el listado · Task 2, `--planta con una franja como valor`
- `--planta 1.5`, `--planta +2`, `--planta -1` → `planta no válida: usa un número, p. ej. --planta 1` · Task 2, `--planta no entero sin signo es no válida`
- Planta que existe pero tiene todas las salas reservadas en la franja (`libres 10:00-12:00 --planta 1`) → línea vacía, no el mensaje de «sin salas» · Task 1, `planta existente toda reservada da línea vacía`
- Reserva cancelada o anulada no ocupa la sala → `Norte, Sur` · Task 1, `una reserva cancelada no ocupa la sala` y `una reserva anulada no ocupa la sala`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una estructura (`{ name, floor }`) y una función que parsea; sin librería de argumentos.
- [x] **YAGNI gate**: nada se abstrae; la planta es un entero.
- [x] **Brownfield gate**: retrocompatible (`libres <franja>` igual), respeta el patrón del módulo, sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/libres.test.js` — pruebas de `libres` con y sin `--planta`.

**Modificar**:

- `src/app.js` — `rooms` con planta, `freeRooms(slot, floor)`, `listFree(params)` y la llamada desde `run`.
- `CHANGELOG.md` — una línea bajo `Added`.

**NO se tocan**:

- `test/app.test.js` — su test de `libres` sigue valiendo sin cambios (regresión del requisito 1).
- `test/cancel.test.js`, `scripts/lint.mjs` — fuera de scope.
- `.docs/sdd/steering/` — nada que documentar: la planta no cambia `operations.md` ni `architecture.md`.

### 1.2 Modelo de datos

`const rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }];` — memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica; el contrato es la línea de comandos: `libres <franja> [--planta <n>]`.

### 1.5 UX

Solo texto por terminal; los ejemplos con datos están en la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper `libres <franja>` sin `--planta` | Baja | Medio | `test/app.test.js` sin cambios + tests del requisito 1 |
| `--planta` toma la franja como valor | Media | Bajo | Test de Review Focus en la Task 2 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Filtrar libres por planta

**Tras**: —
**Modelo**: la sesión en Native, Sonnet con effort medium; la spec fija todos los valores.
**Tests RED**: hilo principal · `test/libres.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, docs
**Verificación**: `node --test test/libres.test.js` → `ℹ fail 0` · y `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js libres 14:00-16:00 --planta 2` y ve `Sur`; con `libres 14:00-16:00` ve `Norte, Sur`.

**Interfaces**:
- Consume: `bookings` y `rooms` de `src/app.js`; `cancelBooking(room, day)` y `voidBooking(room, day)` (exportadas).
- Produce: `rooms` como `{ name: string, floor: number }[]`; `freeRooms(slot, floor)` con `floor: number | undefined` → `string[]`; `listFree(params: string[]): string`, que `run('libres', params)` devuelve tal cual.

**Ficheros**: crear `test/libres.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** — en `test/libres.test.js`, con `import { test } from 'node:test'`, `import assert from 'node:assert/strict'` y `import { run } from '../src/app.js'`; la reserva inicial es Norte `lun 10:00-12:00` activa. Un test por línea, `assert.equal(run('libres', [...]), <esperado>)`:
  - `libres sin --planta lista todas las libres`: `['14:00-16:00']` → `'Norte, Sur'`
  - `--planta 2 deja solo Sur`: `['14:00-16:00', '--planta', '2']` → `'Sur'`
  - `--planta 1 deja solo Norte`: `['14:00-16:00', '--planta', '1']` → `'Norte'`
  - `--planta vale antes de la franja`: `['--planta', '2', '14:00-16:00']` → `'Sur'`
  - `--planta 02 vale como la 2`: `['14:00-16:00', '--planta', '02']` → `'Sur'`
  - `--planta sin franja filtra igual`: `['--planta', '2']` → `'Sur'`
  - `planta existente toda reservada da línea vacía`: `['10:00-12:00', '--planta', '1']` → `''`
  - `una reserva cancelada no ocupa la sala`: `const { run: fresh, cancelBooking } = await import('../src/app.js?cancelada')`; `cancelBooking('Norte', 'lun')`; `fresh('libres', ['10:00-12:00'])` → `'Norte, Sur'`
  - `una reserva anulada no ocupa la sala`: igual con `?anulada` y `voidBooking('Norte', 'lun')`.
  Ejecuta `node --test test/libres.test.js` y comprueba que fallan los de `--planta` (los demás ya pasan).
- [ ] **Step 2: Implementación** — en `src/app.js`: `rooms` como en §1.2; `freeRooms(slot, floor)` filtra primero por planta si `floor !== undefined` y después como hoy por reserva activa en esa franja, devolviendo los nombres; `listFree(params)` quita `--planta` y el valor que le sigue de `params`, toma la primera posición restante como franja, convierte el valor con `Number` si es una cadena de dígitos, y devuelve `freeRooms(slot, floor).join(', ')`; `run` usa `listFree(params)` para `libres`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación». Esperado: `ℹ fail 0` en ambos.
- [ ] **Step 4: Commit de la task** — `feat: libres filtra por planta con --planta`, con la atribución del kit.

---

### Task 2 — Avisos de planta no válida o sin salas, y CHANGELOG

**Tras**: Task 1
**Modelo**: la sesión en Native, Sonnet con effort medium; los textos están literales en la spec.
**Tests RED**: hilo principal · `test/libres.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, docs
**Verificación**: `node --test test/libres.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js libres 14:00-16:00 --planta 9` y ve `sin salas en la planta 9`; con `--planta abc`, ve `planta no válida: usa un número, p. ej. --planta 1`.

**Interfaces**:
- Consume: `listFree(params)` de la Task 1; `rooms` con `floor`.
- Produce: `listFree` devuelve, además, los dos mensajes de la spec; sin interfaz nueva.

**Ficheros**: modificar `test/libres.test.js`, `src/app.js`, `CHANGELOG.md`.

- [ ] **Step 1: Tests RED** — añade a `test/libres.test.js`:
  - `--planta sin salas avisa`: `['14:00-16:00', '--planta', '9']` → `'sin salas en la planta 9'`
  - `--planta no entero sin signo es no válida`: para cada valor de `['abc', '-1', '1.5', '+2']`, `['14:00-16:00', '--planta', valor]` → `'planta no válida: usa un número, p. ej. --planta 1'`
  - `--planta sin valor es no válida`: `['14:00-16:00', '--planta']` → el mismo mensaje
  - `--planta con una franja como valor`: `['--planta', '14:00-16:00']` → el mismo mensaje
  Ejecuta y comprueba que los cuatro fallan.
- [ ] **Step 2: Implementación** — en `listFree`: si hay `--planta` y el valor falta o no cumple `/^\d+$/`, devuelve `planta no válida: usa un número, p. ej. --planta 1`; si el número no coincide con ninguna planta de `rooms` (antes de mirar reservas), devuelve `sin salas en la planta <n>` con el número ya convertido (`--planta 09` → `sin salas en la planta 9`). En `CHANGELOG.md`, bajo `### Added` de `[Unreleased]`: `- Filtro de salas libres por planta (\`salas libres 10:00-12:00 --planta 2\`). [feature 0012](.docs/sdd/changes/20261112-162723-feature-0012-libres-por-planta/)`.
- [ ] **Step 3: Verificación** — `node --test test/libres.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: avisos de planta no válida o sin salas`, con la atribución del kit.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks en un solo fichero de ~35 líneas; sin referencia en el estimation-log (no existe todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: `libres 14:00-16:00` sigue dando `Norte, Sur`; `libres 14:00-16:00 --planta 2` da `Sur`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Requisito 1: THEN `libres 10:00-12:00` → `Sur` → `test/app.test.js` sin cambios (regresión). ✓
- Requisito 1: AND `libres 14:00-16:00` → `Norte, Sur` → Task 1, `libres sin --planta lista todas las libres`. ✓
- Requisito 1: AND reserva cancelada o anulada → Task 1, `una reserva cancelada no ocupa la sala` y `una reserva anulada no ocupa la sala`. ✓
- Requisito 2: THEN `--planta 2` → `Sur` → Task 1, `--planta 2 deja solo Sur`. ✓
- Requisito 2: AND `--planta 1` → `Norte` → Task 1, `--planta 1 deja solo Norte`. ✓
- Requisito 2: AND `--planta 2` antes de la franja → Task 1, `--planta vale antes de la franja`. ✓
- Requisito 2: AND `--planta 02` → `Sur` → Task 1, `--planta 02 vale como la 2`. ✓
- Requisito 2: AND `libres --planta 2` → `Sur` → Task 1, `--planta sin franja filtra igual`. ✓
- Requisito 2: AND planta toda reservada → línea vacía → Task 1, `planta existente toda reservada da línea vacía`. ✓
- Requisito 3: THEN `--planta 9` → `sin salas en la planta 9` → Task 2, `--planta sin salas avisa`. ✓
- Requisito 3: AND `--planta abc` y `-1` → mensaje → Task 2, `--planta no entero sin signo es no válida`. ✓
- Requisito 3: AND `--planta` sin valor → mensaje → Task 2, `--planta sin valor es no válida`. ✓
- Reglas de la capacidad (datos en `rooms`, límites, avisos) → Tasks 1 y 2, los mismos tests. ✓
- Línea en `CHANGELOG.md` (Scope) → Task 2, Step 2; lo comprueba la lectura del diff en la revisión final. ⚠ sin test: es texto de documentación.
- Fila 3 de «cambia de forma» (`libres` ya no toma `params[0]` con `--planta`) → Task 1, `--planta vale antes de la franja`. ✓
- `--planta` repetido → N/A (fuera de scope en la spec). ✓
- Review Focus: las 4 líneas → Task 1 (2) y Task 2 (2), con los tests nombrados. ✓
