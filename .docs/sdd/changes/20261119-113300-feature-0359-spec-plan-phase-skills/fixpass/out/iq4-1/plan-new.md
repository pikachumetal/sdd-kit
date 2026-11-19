---
id: 20261119-175533-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. Modelo por task: Sonnet con effort medium en las dos — el plan trae firmas, textos y tests; la sesión Native los ejecuta. La revisión final de rama va con los ejes de `sdd-verify` (Spec opus+high, Código sonnet+high).
2. Ejecución: Native — 2 tasks encadenadas por la interfaz de `occupancy`, un error lo caza el test de su task y el plan cabe en un contexto.
3. Dos tasks verticales: la 1 entrega el comando con su aviso por el camino feliz; la 2, las entradas inválidas. Parto ahí porque un revisor podría aprobar la una y rechazar la otra.
4. `addBooking` solo guarda en `bookings` con `status: 'active'`; sin validar sala ni día (es ayuda de test, spec decisión 6).
5. Días válidos como constante `DAYS = ['lun', 'mar', 'mie', 'jue', 'vie']` y umbral como `BUSY_THRESHOLD = 3`, ambos en `src/app.js` (spec decisiones 1 y 5).
6. Coste estimado: ~1 h de implementación; sin despachos de subagentes salvo la revisión final.
7. Gate de cierre: tomado literal de `operations.md`.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Añadir el comando `ocupacion <sala> <día>` que cuenta las reservas activas y avisa con 3 o más.

**Architecture**: Una función `occupancy(room, day)` que cuenta `bookings` activas y un formateador que `run` despacha con el comando nuevo. Todo en `src/app.js`, que es el único fichero de entrada del proyecto.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por la interfaz de `occupancy`, un error lo caza el test de su task y el plan cabe en un contexto (`execution: native`, fijado en sdd-kit.json). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade una función y un comando en el fichero existente: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada `src/app.js` (architecture.md).
- Texto de la interfaz en castellano; nombres de código en inglés (spec, decisión 7).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Umbral: 3 reservas activas, inclusivo. Solo cuenta `status === 'active'`.

### De proceso

- Tests antes que código (constitution, Art. 2).
- Commits referenciando la 0012; atribución según el sistema.
- Modelo y effort por task como indica cada una; Haiku no.

## Review Focus

- `ocupacion` sin sala ni día → `uso: ocupacion <sala> <día>`, no un fallo ni `undefined` · Task 2, `uso con argumentos ausentes`
- `ocupacion Norte` con día vacío o `ocupacion norte lun` (minúscula) → `sala desconocida: norte`, sin tolerar mayúsculas · Task 2, `sala en minúsculas es desconocida`
- Dos reservas de una misma sala y día a franjas distintas → cuentan las dos · Task 1, `cuenta franjas distintas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función, un comando, una constante.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `libres`, `cancelar` y `anular` no cambian.
- [x] **Constitution check**: tests primero (Art. 2), flujo SDD (Art. 1), texto en castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/occupancy.test.js` — pruebas de integración por `run`.

**Modificar**:

- `src/app.js` — `addBooking`, `occupancy`, constantes, rama `ocupacion` en `run`.

**NO se tocan**:

- `test/app.test.js`, `test/cancel.test.js` — los comandos existentes no cambian.

### 1.2 a 1.5

No aplican (sin datos persistentes, migraciones, contratos API ni pantalla).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests (`bookings` es de módulo) | Alta | Medio | Cada test usa una sala y un día propios, o `addBooking` sobre un día que ningún otro usa |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Comando `ocupacion` con su aviso

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la sesión lo ejecuta; interpretar prosa pide gama media)
**Tests RED**: hilo principal · `test/occupancy.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/occupancy.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js ocupacion Norte lun` imprime `Norte lun: 1 reserva` (la reserva inicial de Norte el lun) y ningún aviso.

**Interfaces**:
- Consume: `bookings`, `rooms`, `cancelBooking(room, day)`, `voidBooking(room, day)` de `src/app.js`; `run(cmd, params)`.
- Produce: `export function addBooking(room, day, slot)` (añade `{ room, day, slot, status: 'active' }` a `bookings`); `occupancy(room, day)` → número de reservas activas de esa sala y día; `run('ocupacion', [room, day])` → texto de una o dos líneas, la segunda `aviso: <sala> muy ocupada el <día> (<n> reservas)` solo con `n >= BUSY_THRESHOLD`. Singular `1 reserva`, resto `<n> reservas`.

**Ficheros**: modificar `src/app.js`; crear `test/occupancy.test.js`

- [ ] **Step 1: Tests RED** — en `test/occupancy.test.js`, importando `run`, `addBooking`, `cancelBooking`, `voidBooking`; cada test usa un día propio de `lun mar mie jue vie` para no compartir estado, salvo el de otra sala. Tests y asserts (`assert.equal(run('ocupacion', ['Norte', 'mie']), …)`):
  - `aviso al llegar al umbral`: 3 activas Norte mie → `'Norte mie: 3 reservas\naviso: Norte muy ocupada el mie (3 reservas)'`.
  - `el aviso lleva el número real`: 4 activas Norte jue → `'Norte jue: 4 reservas\naviso: Norte muy ocupada el jue (4 reservas)'`.
  - `sin aviso por debajo del umbral`: 2 activas Norte vie → `'Norte vie: 2 reservas'`.
  - `una reserva`: la reserva inicial de Norte lun → `'Norte lun: 1 reserva'`.
  - `cero reservas`: Sur mar sin reservas → `'Sur mar: 0 reservas'`.
  - `canceladas no cuentan`: 2 activas + 1 cancelada con `cancelBooking` en Norte vie… usa un día que ningún otro test use; resultado `'<día>: 2 reservas'` sin aviso. (Si hacen falta más días, usa las franjas y salas: una sala distinta por test.)
  - `anuladas no cuentan`: igual con `voidBooking`.
  - `otra sala u otro día no cuentan`: Norte con 2 un día y 3 otro, Sur con 3 el primero → el comando de Norte del primer día da `2 reservas` sin aviso.
  - `cuenta franjas distintas`: 2 reservas de Sur a `09:00-10:00` y `10:00-11:00` el mismo día → `2 reservas`.
  Nota: `cancelBooking` y `voidBooking` actúan sobre la primera activa de esa sala y día, así que para cancelar o anular una de varias se llama una vez por reserva.
- [ ] **Step 2: Rojo** — ejecutar la verificación. Esperado: falla (`ocupacion` devuelve `salas`).
- [ ] **Step 3: Implementación** — en `src/app.js`: `export function addBooking(room, day, slot)`, `function occupancy(room, day)`, constante `BUSY_THRESHOLD = 3` y la rama `if (cmd === 'ocupacion') return showOccupancy(params[0], params[1])` en `run`, con `showOccupancy` que formatea según Interfaces. El cuerpo lo escribe el implementador.
- [ ] **Step 4: Verificación** — la de la task. Esperado `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: comando ocupacion con aviso de sala muy ocupada (0012)`.

---

### Task 2 — Entrada inválida

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (mismo criterio: texto exacto de la spec, pero hay que interpretar el orden de las comprobaciones)
**Tests RED**: hilo principal · `test/occupancy.test.js`, añadidos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/occupancy.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js ocupacion Oeste lun` imprime `sala desconocida: Oeste`.

**Interfaces**:
- Consume: `showOccupancy(room, day)` de la Task 1, `rooms`.
- Produce: constante `DAYS = ['lun', 'mar', 'mie', 'jue', 'vie']`; orden de comprobación en `showOccupancy`: argumentos ausentes → `uso: ocupacion <sala> <día>`; sala fuera de `rooms` → `sala desconocida: <sala>`; día fuera de `DAYS` → `día desconocido: <día>`.

**Ficheros**: modificar `src/app.js`, `test/occupancy.test.js`

- [ ] **Step 1: Tests RED** — en `test/occupancy.test.js`:
  - `sala desconocida`: `run('ocupacion', ['Oeste', 'lun'])` → `'sala desconocida: Oeste'`.
  - `día desconocido`: `run('ocupacion', ['Norte', 'xyz'])` → `'día desconocido: xyz'`.
  - `uso con argumentos ausentes`: `run('ocupacion', ['Norte'])` y `run('ocupacion', [])` → `'uso: ocupacion <sala> <día>'`.
  - `sala en minúsculas es desconocida`: `run('ocupacion', ['norte', 'lun'])` → `'sala desconocida: norte'`.
- [ ] **Step 2: Rojo** — ejecutar la verificación. Esperado: falla en los cuatro.
- [ ] **Step 3: Implementación** — `DAYS` y las tres comprobaciones al principio de `showOccupancy`, en el orden de Interfaces.
- [ ] **Step 4: Verificación** — la de la task. Esperado `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: validar la entrada de ocupacion (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias; incertidumbre baja salvo el estado compartido entre tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): `ocupacion Norte lun` con 3 activas avisa; con 2, no
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Aviso al llegar al umbral (THEN) → Task 1, `aviso al llegar al umbral`. ✓
- El aviso lleva el número real (THEN) → Task 1, `el aviso lleva el número real`. ✓
- Sin aviso por debajo del umbral (THEN) → Task 1, `sin aviso por debajo del umbral`. ✓
- Una reserva (THEN) → Task 1, `una reserva`. ✓
- Cero reservas (THEN) → Task 1, `cero reservas`. ✓
- Las canceladas no cuentan (THEN) → Task 1, `canceladas no cuentan`. ✓
- Las anuladas no cuentan (THEN) → Task 1, `anuladas no cuentan`. ✓
- Otra sala u otro día no cuentan (THEN) → Task 1, `otra sala u otro día no cuentan`. ✓
- Entrada inválida (los tres THEN) → Task 2, `sala desconocida`, `día desconocido`, `uso con argumentos ausentes`. ✓
- Reglas de la capacidad (umbral inclusivo 3, solo activas) → Task 1, tests de 3 y 2. ✓
- Sin cambios en `libres`, `cancelar`, `anular` → N/A (confirmado en spec). ✓
- Líneas del Review Focus → Task 1 `cuenta franjas distintas`; Task 2 `uso con argumentos ausentes`, `sala en minúsculas es desconocida`. ✓
