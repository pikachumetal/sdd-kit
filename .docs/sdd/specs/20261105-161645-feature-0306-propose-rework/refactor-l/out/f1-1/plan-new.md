---
id: 20261106-114213-feature-0010-motivo-cancelacion
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, las dos tasks las hace la sesión; sin despachos. Ambas son de poco código y traen firmas y asserts escritos.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Ficheros de test: la spec nombra `test/cancel.test.js` para cancelar; el escenario `--cada-semana --motivo otro` y el de `--motivo` repetido cancelan también Norte lun, y la reserva sembrada solo se puede cancelar una vez por proceso. Van en `test/cancel-cada-semana.test.js` y `test/cancel-motivo-repetido.test.js`, por la decisión 17 de la spec.
4. Lectura del motivo: `readReason(flags)` devuelve el texto de pantalla o `undefined`; `Object.hasOwn` evita que `toString` o `__proto__` pasen por motivos válidos.
5. `canceladas` une las líneas con `\n`: la spec dice «una línea por reserva» y no fija el separador.
6. Coste estimado: ~2,5 h en total (bloque de estimación); sin despachos, ~0 tokens de subagentes en las tasks.
7. Review Focus: 3 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` pide un motivo de la lista y el comando `canceladas` lo enseña.

**Architecture**: un solo fichero, `src/app.js`: una tabla `REASONS` de clave de línea de comandos a texto de pantalla, `cancelBooking` valida el motivo antes de buscar la reserva y lo guarda en `reason`, y `listCancelled` filtra por `status === 'cancelled'`.

**Tech Stack**: Node 22 sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto y el despacho de comandos de `src/app.js`; sin módulo, dependencia ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Textos de la interfaz en castellano; nombres internos (`status`, `reason`, `cancelled`) en inglés.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2); cada task: RED, ver fallar, mínimo, ver pasar.
- Un commit por task, al quedar limpia su revisión.
- Atribución de commits según el sistema de la sesión.

## Review Focus

- `cancelar Norte lun --motivo sala-ocupada --motivo otro` → vale el primero: `cancelada Norte lun (sala ocupada)` · Task 1, `usa el primer --motivo`
- `cancelar Norte lun --motivo toString` → `motivo no válido…` y la reserva sigue activa, no un cancelar con un motivo inventado · Task 1, `rechaza un motivo heredado de Object`
- `canceladas` tras `anular Norte lun` → `sin canceladas`, no una línea con motivo `undefined` · Task 2, `no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una tabla y dos funciones en el fichero que ya existe.
- [x] **YAGNI gate**: sin helpers ni abstracciones con menos de 3 usos; `readReason` y `listCancelled` tienen un uso cada una, pero son la unidad testeable.
- [x] **Brownfield gate**: retrocompatible no: `cancelar` sin motivo deja de cancelar, decidido en la spec (decisión 3). Respeta el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, flujo SDD, git-flow, textos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancel-cada-semana.test.js` — `cancelar Norte lun --cada-semana --motivo otro`.
- `test/cancel-motivo-repetido.test.js` — primer `--motivo` gana.
- `test/canceladas-vacia.test.js` — nada cancelado → `sin canceladas`.
- `test/canceladas-con-motivo.test.js` — tras cancelar con `cambio-de-planes`.
- `test/canceladas-anulada.test.js` — tras `anular Norte lun`.

**Modificar**:

- `src/app.js` — `REASONS`, `readReason`, `cancelBooking(room, day, flags)`, `listCancelled`, despacho de `canceladas`.
- `test/cancel.test.js` — los dos tests actuales pasan a llevar motivo; casos de motivo inválido y cancelar dos veces.

**NO se tocan**:

- `libres`, `reservar`, `anular` y `test/app.test.js` — la spec los deja fuera.
- `.docs/sdd/roadmap.md` — lo cierra `sdd-archive`.

### 1.2 Modelo de datos

La reserva cancelada pasa a `{ …, status: 'cancelled', reason: 'sala ocupada' }`; `reason` guarda el texto de pantalla.

### 1.3 Migraciones

No aplica: en memoria.

### 1.4 Contratos API

`cancelar <sala> <día> --motivo <cambio-de-planes|sala-ocupada|otro>` y `canceladas`, tal como los fija la spec.

### 1.5 UX

Solo salida de terminal; los textos exactos están en la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests de un fichero | Media | Tests que dependen del orden | Un fichero por estado de partida; en `cancel.test.js` los que no cancelan van antes |
| El valor de `--motivo` empieza por `--` o falta | Baja | Cancelaría con motivo `undefined` | `readReason` los trata como ausentes; tests en Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con un motivo de la lista

**Tras**: —
**Modelo**: Native: la sesión, sin despacho (`effort` de la sesión, gama media).
**Tests RED**: hilo principal · `test/cancel.test.js`, `test/cancel-cada-semana.test.js`, `test/cancel-motivo-repetido.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

Orden en `test/cancel.test.js` (las que no cancelan, primero), con `INVALID = 'motivo no válido: elige cambio-de-planes, sala-ocupada u otro'`:

- `exige motivo`: `run('cancelar', ['Norte','lun'])` → `INVALID`
- `rechaza un motivo fuera de la lista`: `['Norte','lun','--motivo','vacaciones']` → `INVALID`
- `rechaza un motivo heredado de Object`: `['Norte','lun','--motivo','toString']` → `INVALID`
- `rechaza --motivo sin valor`: `['Norte','lun','--motivo']` → `INVALID`
- `rechaza --motivo como valor`: `['Norte','lun','--motivo','--cada-semana']` → `INVALID`
- `rechaza --motivo antes de la sala`: `['--motivo','otro','Norte','lun']` → `INVALID`
- `rechaza el motivo con espacios y con mayúsculas`: `['Norte','lun','--motivo','sala ocupada']` y `['Norte','lun','--motivo','Sala-Ocupada']` → `INVALID`
- `valida el motivo antes que la reserva`: `['Sur','mar']` → `INVALID`
- `sin reserva lo dice`: `['Sur','mar','--motivo','otro']` → `sin reserva Sur mar`
- `cancelar con motivo`: `['Norte','lun','--motivo','sala-ocupada']` → `cancelada Norte lun (sala ocupada)`
- `cancelar dos veces`: `['Norte','lun','--motivo','otro']` → `sin reserva Norte lun`

`test/cancel-cada-semana.test.js`: `ignora --cada-semana`: `['Norte','lun','--cada-semana','--motivo','otro']` → `cancelada Norte lun (otro)`.
`test/cancel-motivo-repetido.test.js`: `usa el primer --motivo`: `['Norte','lun','--motivo','sala-ocupada','--motivo','otro']` → `cancelada Norte lun (sala ocupada)`.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/cancel-cada-semana.test.js test/cancel-motivo-repetido.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin `--motivo` ve `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, flags = [])` guarda `booking.reason` con el texto de pantalla y deja `status: 'cancelled'`; `run('cancelar', params)` llama a `cancelBooking(params[0], params[1], params.slice(2))`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancel-cada-semana.test.js`, `test/cancel-motivo-repetido.test.js`.

- [ ] **Step 1: Implementación** — en `src/app.js`: `const REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `const INVALID_REASON = 'motivo no válido: elige cambio-de-planes, sala-ocupada u otro'`; `function readReason(flags)`: busca el primer `--motivo` con `indexOf`, toma el token siguiente, `undefined` si falta, si empieza por `--` o si `!Object.hasOwn(REASONS, token)`, y si no `REASONS[token]`; `cancelBooking(room, day, flags = [])`: `const reason = readReason(flags)`, si no hay devuelve `INVALID_REASON`, luego busca la reserva (`sin reserva ${room} ${day}`), pone `status = 'cancelled'`, `reason`, y devuelve `` `cancelada ${room} ${day} (${reason})` ``. Escribir antes los tests de arriba, verlos fallar por la razón esperada.
- [ ] **Step 2: Build** — no hay build. Esperado: n/a.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; esperado `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión, referenciando la 0010.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native: la sesión, sin despacho (`effort` de la sesión, gama media).
**Tests RED**: hilo principal · `test/canceladas-vacia.test.js`, `test/canceladas-con-motivo.test.js`, `test/canceladas-anulada.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

- `canceladas-vacia`, `sin canceladas`: `run('canceladas', [])` → `sin canceladas`
- `canceladas-con-motivo`, `lista la cancelada con su motivo`: tras `run('cancelar', ['Norte','lun','--motivo','cambio-de-planes'])`, `run('canceladas', [])` → `Norte lun 10:00-12:00 · cambio de planes`
- `canceladas-anulada`, `no lista las anuladas`: tras `run('anular', ['Norte','lun'])`, `run('canceladas', [])` → `sin canceladas`

**Superficies**: backend
**Verificación**: `node --test test/canceladas-vacia.test.js test/canceladas-con-motivo.test.js test/canceladas-anulada.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js canceladas` y ve `sin canceladas`: cada ejecución empieza de cero (decisión 9 de la spec), así que el listado con datos solo se ve dentro de una ejecución.

**Interfaces**:
- Consume: `booking.status === 'cancelled'` y `booking.reason` de la Task 1.
- Produce: `run('canceladas', [])` → líneas `<sala> <día> <franja> · <motivo>` unidas con `\n`, o `sin canceladas`.

**Ficheros**: modificar `src/app.js`; crear los tres tests.

- [ ] **Step 1: Implementación** — `function listCancelled()`: `bookings.filter((b) => b.status === 'cancelled').map((b) => `${b.room} ${b.day} ${b.slot} · ${b.reason}`)`; devuelve las líneas unidas con `\n`, o `'sin canceladas'` si no hay; en `run`: `if (cmd === 'canceladas') return listCancelled();`. Escribir antes los tests y verlos fallar.
- [ ] **Step 2: Build** — no hay build. Esperado: n/a.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; esperado `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión, referenciando la 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un fichero; la incertidumbre es el aislamiento de los tests por el estado en memoria; sin referencia en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `cancelar Norte lun --motivo sala-ocupada` → `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar con motivo`. ✓
- AND la reserva deja de estar activa y guarda el motivo → Task 1, `cancelar dos veces` (la segunda responde `sin reserva`) y Task 2, `lista la cancelada con su motivo` (lee `reason`). ✓
- Sin motivo → `INVALID` y la reserva sigue activa → Task 1, `exige motivo` (los tests que no cancelan van antes de `cancelar con motivo`, que da `cancelada` solo si seguía activa). ✓
- Motivo fuera de la lista → Task 1, `rechaza un motivo fuera de la lista`. ✓
- `--motivo` sin valor, antes de la sala o con `--cada-semana` como valor → Task 1, `rechaza --motivo sin valor`, `rechaza --motivo antes de la sala`, `rechaza --motivo como valor`. ✓
- Motivo con espacios o con mayúsculas → Task 1, `rechaza el motivo con espacios y con mayúsculas`. ✓
- `--cada-semana --motivo otro` → `cancelada Norte lun (otro)` → Task 1, `ignora --cada-semana`. ✓
- Sin reserva con motivo → `sin reserva Sur mar` → Task 1, `sin reserva lo dice`. ✓
- Sin reserva y sin motivo → `INVALID` → Task 1, `valida el motivo antes que la reserva`. ✓
- Ya cancelada → `sin reserva Norte lun` → Task 1, `cancelar dos veces`. ✓
- `canceladas` con una cancelada → Task 2, `lista la cancelada con su motivo`. ✓
- `canceladas` sin ninguna → Task 2, `sin canceladas`. ✓
- `canceladas` con una anulada → Task 2, `no lista las anuladas`. ✓
- Reglas de la capacidad: primer `--motivo` gana → Task 1, `usa el primer --motivo`. ✓
- Fila retirada: `cancelar` sin motivo deja de cancelar → Task 1, `exige motivo` y los tests actuales de `cancel.test.js` reescritos con motivo. ✓
- Verificación en la terminal real → «Se prueba en la aplicación» de cada task, en la validación. ✓
- Review Focus: primer `--motivo`, `toString`, anuladas → Task 1 `usa el primer --motivo` y `rechaza un motivo heredado de Object`; Task 2 `no lista las anuladas`. ✓
