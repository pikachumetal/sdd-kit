---
id: 20261111-201731-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos tasks las hace el hilo principal (Native), sin despacho; la sesión recomendada es Sonnet con effort medium, porque el plan trae firmas, valores y tests. La revisión final de rama no se quita: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: Native — ver la línea `Ejecución`.
3. **Tests con estado limpio**: los tests que cancelan la reserva sembrada importan `src/app.js` con una cadena de consulta distinta (`import('../src/app.js?t1')`), porque las reservas viven en memoria en el módulo; es una decisión técnica que la spec solo enuncia (sección «Dónde se prueba»).
4. **Claves de motivo con `Object.hasOwn`**: así `--motivo constructor` o `toString` no pasan por la tabla; lo cubre un test.
5. **Orden de las tasks**: Task 1 deja `cancelar` con motivo y los tests de `cancel.test.js` reescritos; Task 2 añade `canceladas`. Cada una acaba con su fichero de tests en verde.
6. **Coste estimado**: ~1,5 h de implementación; la sesión Native consume del orden de 150–250 k tokens; la revisión final despacha 2 ejes (~100 k tokens cada uno).
7. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lo muestra.

**Architecture**: todo en `src/app.js`: una tabla de motivos, `cancelBooking` con un tercer parámetro validado antes de buscar la reserva, `listCancelled()` y dos cambios en `run`. Sin ficheros nuevos de producción.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto y el comportamiento de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas. La constitution del proyecto no tiene artículo de calidad: valen estas dos reglas.
- Las claves de motivo son exactamente `cambio-de-planes`, `sala-ocupada`, `otro`; el error es literalmente `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
- Texto de la interfaz en castellano (constitution, Art. 4); identificadores internos en inglés como el código actual.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Política de modelos: gama media como suelo; la revisión final como en la decisión 1.
- Modo de ejecución: Native; un commit por task al quedar limpia.
- Mensajes de commit en castellano, con el prefijo `feat:` y referencia a la 0010.

## Review Focus

- `cancelar Norte lun --motivo constructor` (una clave heredada del prototipo del objeto) → `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, la reserva sigue activa · Task 1, `rechaza una clave heredada del prototipo`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí, una tabla y dos funciones pequeñas.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: rompe `cancelar` sin motivo por decisión 4 de la spec; sin refactor oportunista.
- [x] **Constitution check**: tests antes que código (Art. 2), castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — tests del comando `canceladas` (Task 2).

**Modificar**:

- `src/app.js` — tabla de motivos, `cancelBooking(room, day, reasonKey)`, `listCancelled()`, lectura de `--motivo` y comando `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests actuales se reescriben con `--motivo` y se añaden los escenarios de cancelar.
- `ROADMAP.md` — la fila 0010 pasa a 🔄 al abrir (en el commit de apertura).

**NO se tocan**:

- `scripts/lint.mjs`, `test/app.test.js`, `README.md`, `.docs/sdd/steering/operations.md` — no documentan ni prueban comandos de cancelación.

### 1.2 a 1.4

No aplica: sin modelo de datos persistente, migraciones ni API.

### 1.5 UX

No aplica: salida de terminal, textos fijados en la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | alta | un test pasa o falla por el orden | importación con cadena de consulta distinta en cada test que cancela |
| `--motivo` sin valor o al final lee `undefined` | media | un `undefined` pasa como motivo | `Object.hasOwn(reasons, reasonKey)` rechaza `undefined`; hay test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium, sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend, docs (`ROADMAP.md` ya en el commit de apertura).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0`.
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo sala-ocupada` imprime `cancelada Norte lun (motivo: sala ocupada)`; sin `--motivo` imprime `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` tal como están (`status` vale `active`, `cancelled` o `voided`).
- Produce: `export function cancelBooking(room, day, reasonKey)` que devuelve el texto de la spec y deja `booking.status = 'cancelled'` y `booking.reason = reasonKey`; la constante `reasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; en `run`, `cmd === 'cancelar'` llama a `cancelBooking(params[0], params[1], reasonFrom(params))` con `reasonFrom(params)` = `params[params.indexOf('--motivo') + 1]` si `--motivo` está, `undefined` si no.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituye los dos tests actuales. Cada test que cancela la reserva sembrada toma su propio módulo: `const load = (n) => import(`../src/app.js?t${n}`)` y `const { run } = await load(1)`, con `n` distinto. Tests, con sus asserts (todas las salidas literales de la spec):
  - `cancela con sala-ocupada`: `run('cancelar', ['Norte','lun','--motivo','sala-ocupada'])` → `cancelada Norte lun (motivo: sala ocupada)` y `run('libres', ['10:00-12:00'])` → `Norte, Sur`.
  - `cancela con cambio-de-planes` → `cancelada Norte lun (motivo: cambio de planes)`; `cancela con otro` → `cancelada Norte lun (motivo: otro)`.
  - `sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` y `libres` → `Sur`.
  - `motivo fuera de lista no cancela` (`aburrimiento`), `motivo con mayúscula no vale` (`Otro`), `motivo sin valor no cancela` (`['Norte','lun','--motivo']`), `rechaza una clave heredada del prototipo` (`constructor`): mismo error y `libres` → `Sur`.
  - `sin motivo y sin reserva da el error del motivo`: `['Sur','mar']` → el error del motivo.
  - `con motivo repetido vale el primero`: `['Norte','lun','--motivo','otro','--motivo','sala-ocupada']` → `cancelada Norte lun (motivo: otro)`.
  - `sin reserva lo dice`: `['Sur','mar','--motivo','otro']` → `sin reserva Sur mar`.
  - `cancelar dos veces`: tras cancelar Norte lun con `otro`, `['Norte','lun','--motivo','sala-ocupada']` → `sin reserva Norte lun`.
  - `cancelar una anulada`: `run('anular', ['Norte','lun'])` y luego `['Norte','lun','--motivo','otro']` → `sin reserva Norte lun`.
  Ejecuta `node --test test/cancel.test.js` y comprueba que falla (RED).
- [ ] **Step 2: Implementación** — en `src/app.js`: `reasons` como arriba; `cancelBooking(room, day, reasonKey)` primero `if (!Object.hasOwn(reasons, reasonKey)) return 'motivo no válido: elige cambio-de-planes, sala-ocupada u otro'`, luego busca la reserva (`sin reserva ${room} ${day}`), marca `cancelled`, guarda `reason` y devuelve `cancelada ${room} ${day} (motivo: ${reasons[reasonKey]})`; `reasonFrom` y la llamada en `run`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0` y `node --test test/app.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar exige un motivo de la lista (0010)`, solo con `src/app.js` y `test/cancel.test.js`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium, sin despacho.
**Tests RED**: hilo principal · `test/canceladas.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend.
**Verificación**: `node --test test/canceladas.test.js` → `ℹ fail 0`; `node --test test/cancel.test.js` → `ℹ fail 0`.
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada ejecución de `node src/app.js` parte del estado inicial: la CLI no puede cancelar y listar en dos invocaciones; se prueba por `run()`.

**Interfaces**:
- Consume: de la Task 1, `reasons` y el campo `reason` de las reservas canceladas; `status` `cancelled` y `voided`.
- Produce: `export function listCancelled()` que devuelve el texto del comando: una línea `${room} ${day} ${slot} · ${reasons[reason]}` por reserva con `status === 'cancelled'`, unidas por salto de línea, o `sin canceladas` si no hay; en `run`, `cmd === 'canceladas'` devuelve `listCancelled()` y ignora los parámetros.

**Ficheros**: crear `test/canceladas.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `test/canceladas.test.js`, con la misma `load(n)` por test y estos asserts: `muestra el motivo` (cancelar Norte lun con `sala-ocupada` → `canceladas` = `Norte lun 10:00-12:00 · sala ocupada`); `muestra otro` (con `otro` → `Norte lun 10:00-12:00 · otro`); `sin cancelaciones` (estado inicial → `sin canceladas`); `no lista las anuladas` (`run('anular', ['Norte','lun'])` → `sin canceladas`); `ignora los argumentos de sobra` (`run('canceladas', ['ignorado'])` tras cancelar con `otro` → `Norte lun 10:00-12:00 · otro`). Ejecuta y comprueba que falla.
- [ ] **Step 2: Implementación** — `listCancelled()` y la rama de `run`.
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,5 h (incluye dos rondas de revisión de la spec)
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks en un solo fichero de producción, ~40 líneas de código y ~100 de tests; la incertidumbre es el estado en memoria de los tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN y AND de «La cancelación exige un motivo de la lista» (sala-ocupada, `libres` → `Norte, Sur`) → Task 1, `cancela con sala-ocupada`. ✓
- THEN de `cambio-de-planes` y de `otro` → Task 1, `cancela con cambio-de-planes` y `cancela con otro`. ✓
- THEN y AND de sin motivo, fuera de lista, sin valor y `Otro` (error y `libres` → `Sur`) → Task 1, `sin motivo no cancela`, `motivo fuera de lista no cancela`, `motivo sin valor no cancela`, `motivo con mayúscula no vale`. ✓
- THEN de `cancelar Sur mar` sin motivo → Task 1, `sin motivo y sin reserva da el error del motivo`. ✓
- THEN de motivo repetido → Task 1, `con motivo repetido vale el primero`. ✓
- THEN de «Cancelar una reserva que no está activa» (sin reserva, ya cancelada, anulada) → Task 1, `sin reserva lo dice`, `cancelar dos veces`, `cancelar una anulada`. ✓
- THEN de «El listado de canceladas enseña el motivo» (`sala-ocupada`, `otro`, sin canceladas, anulada) y los argumentos de sobra → Task 2, `muestra el motivo`, `muestra otro`, `sin cancelaciones`, `no lista las anuladas`, `ignora los argumentos de sobra`. ✓
- Fila «cancelar sin motivo deja de cancelar» y «salida `cancelada <sala> <día>`» → Task 1, los tests reescritos de `test/cancel.test.js`. ✓
- Fila «comando `canceladas` en `run`» → Task 2. ✓
- Orden de `canceladas` con dos canceladas → sin observar: la spec lo declara en la decisión 13 (avisado en las decisiones de la spec). ⚠
- Review Focus (`constructor`) → Task 1, `rechaza una clave heredada del prototipo`. ✓
