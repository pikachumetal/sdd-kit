---
id: 20261119-183549-feature-0012-aviso-sala-ocupada
feature: 0012
title: Plan de implementación — Aviso de sala muy ocupada
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Aviso de sala muy ocupada

## Decisiones que he tomado yo — valida estas

1. Modelo y effort de la Task 1: Sonnet, effort medium (`sdd-kit:effort-medium` + `sonnet`) — una sola task, escrita casi entera en el plan, sin interpretar prosa. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `opus`, Código con `sonnet`).
2. Ejecución: native, una sola task en un solo fichero (ver «Ejecución»).
3. Una sola task: el aviso no se puede probar sin `reservar`, y `reservar` sin el aviso no se entrega; un revisor no podría rechazar una y aprobar la otra.
4. Los tests solo usan `run` (como `test/app.test.js`): el estado (`bookings`) es global del módulo y no se exporta. Cada test usa un día propio (`mie`, `jue`, `vie`, `sab`, `dom`) para no contaminarse; `node --test` corre cada fichero en su propio proceso, así que el estado de `cancel.test.js` no se mezcla.
5. Sala, día y franja se toman literales de `params`; sin validación (spec, decisión 7).
6. Coste estimado: ~1,5 h en total; Native en una sesión, sin despachos de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `reservar {sala} {día} {franja}` crea una reserva activa y, si la sala llega a 4 o más reservas activas ese día, añade el aviso.

**Architecture**: dos funciones nuevas en `src/app.js` —`activeCount` y `bookRoom`— y una línea de despacho en `run`, detrás de la del stub `--cada-semana`. `bookRoom` añade la reserva a `bookings` y cuenta las activas de esa sala y día.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque 1 task, sin interfaces entre tasks, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Umbral de «muy ocupada»: 4 o más reservas activas por sala y día, contando la nueva.
- Aviso literal: `aviso: {sala} está muy ocupada el {día} ({n} reservas)`, en otra línea tras `reservada {sala} {día} {franja}`.
- Solo cuentan las reservas con `status === 'active'`, de la misma sala y el mismo día; la franja no interviene.
- El stub `reservar … --cada-semana` no cambia y se despacha antes.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio. Texto de la interfaz en castellano.

### De proceso

- Tests antes que código (constitution, regla 2). Commits referenciando 0012, con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Modelos: gama media para la task; el más capaz solo en los ejes Spec y Arquitectura de la revisión final.

## Review Focus

- `reservar Norte lun` (sin franja) → el comando no se rompe: contesta `reservada Norte lun undefined` sin lanzar; no se valida (spec, «No entra») · Task 1, `reservar sin franja no lanza`
- `reservar Norte lun 15:00-16:00` repetido dos veces → se crean dos reservas y ambas cuentan (no se validan solapes) · Task 1, `reservar repetido cuenta las dos`
- `reservar … --cada-semana` → sigue contestando `reserva semanal creada`, sin aviso · Task 1, `el stub semanal no cambia` (ya lo cubre `test/app.test.js`; el test del stub se vuelve a correr en la verificación)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos funciones pequeñas y una línea de despacho.
- [x] **YAGNI gate**: sin umbral configurable ni validaciones.
- [x] **Brownfield gate**: retrocompatible; el stub y `cancelar`, `anular` y `libres` no cambian.
- [x] **Constitution check**: tests primero (regla 2); texto en castellano (regla 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/reservar.test.js` — tests de `reservar` y su aviso, por `run`.

**Modificar**:

- `src/app.js` — `activeCount`, `bookRoom` y el despacho de `reservar` en `run`.

**NO se tocan**:

- `test/app.test.js`, `test/cancel.test.js` — su comportamiento no cambia.
- `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

Sin cambios: las reservas siguen en memoria en `bookings`; `bookRoom` añade `{ room, day, slot, status: 'active' }`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El umbral (4) no es el que quiere el dev-lead | media | bajo | está marcado «pendiente» en la spec; es una constante |
| Estado global compartido entre tests del mismo fichero | media | bajo | un día distinto por test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Reservar y avisar de sala muy ocupada

**Tras**: —
**Modelo**: Sonnet, effort medium — `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la ejecuta el hilo principal).
**Tests RED**: hilo principal · `test/reservar.test.js`, escrito antes del código y sin commitear: va en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/reservar.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — el usuario ejecuta `node src/app.js reservar Norte lun 15:00-16:00`; con una sola reserva ese día ve solo «reservada Norte lun 15:00-16:00».

**Interfaces**:
- Consume: nada (parte de `bookings`, `findBooking`, `freeRooms` y `run` de `src/app.js`).
- Produce: `run('reservar', [sala, día, franja])` → `string`; sin aviso es `reservada {sala} {día} {franja}`; con aviso, esa línea, `\n` y `aviso: {sala} está muy ocupada el {día} ({n} reservas)`.

**Ficheros**: crear `test/reservar.test.js`; modificar `src/app.js`.

- [ ] **Step 1: Tests RED** — en `test/reservar.test.js`, importando `run` de `../src/app.js`, un `test` por escenario (sala y día propios; las reservas previas se siembran con `run('reservar', …)`; `res(sala, día, franja)` es un auxiliar local que llama a `run('reservar', [sala, día, franja])`):
  - `reservar crea la reserva activa`: `run('reservar', ['Sur','mar','09:00-10:00'])` → `'reservada Sur mar 09:00-10:00'`, y `run('libres', ['09:00-10:00'])` → `'Norte'`.
  - `el aviso sale al llegar a 4`: 3 reservas Norte `mie` y una cuarta → `'reservada Norte mie 15:00-16:00\naviso: Norte está muy ocupada el mie (4 reservas)'`.
  - `el aviso sigue en la quinta`: Norte `jue`, 4 previas y una quinta → termina en `'aviso: Norte está muy ocupada el jue (5 reservas)'`.
  - `sin aviso con una reserva`: Norte `vie`, la primera → `'reservada Norte vie 15:00-16:00'`.
  - `las canceladas no suman`: Norte `sab`, 4 reservas, `run('cancelar', ['Norte','sab'])` dos veces, y una nueva (3 activas) → `'reservada Norte sab 20:00-21:00'`.
  - `otro día no suma`: Norte `dom` con 2 reservas y `mar` con 3 (primero `res('Norte','mar',…)` ×3); `res('Norte','dom',…)` → sin aviso.
  - `otra sala no suma`: Sur con 4 reservas `lun` y `res('Norte','lun',…)` con las 2 previas de Norte `lun` (la sembrada y esta) → sin aviso.
  - `el aviso no bloquea`: tras el aviso de Norte `mie`, `run('libres', ['15:00-16:00'])` no incluye `Norte`.
  - `reservar sin franja no lanza` y `reservar repetido cuenta las dos` (Review Focus).
  Esperado: fallan (hoy `reservar` sin `--cada-semana` devuelve `'salas'`).
- [ ] **Step 2: Ejecutar los tests RED** — `node --test test/reservar.test.js` → falla con `ℹ fail` > 0.
- [ ] **Step 3: Implementación** — en `src/app.js`:
  - `const BUSY_THRESHOLD = 4;`
  - `function activeCount(room, day)` → `number`, reservas con `status === 'active'` de esa sala y día.
  - `export function bookRoom(room, day, slot)` → `string`: añade `{ room, day, slot, status: 'active' }` a `bookings`, cuenta con `activeCount` y devuelve `reservada ${room} ${day} ${slot}`; si el conteo es `>= BUSY_THRESHOLD`, añade `\naviso: ${room} está muy ocupada el ${day} (${n} reservas)`.
  - En `run`: justo después de la línea del stub `--cada-semana`, `if (cmd === 'reservar') return bookRoom(params[0], params[1], params[2]);`.
- [ ] **Step 4: Verificación** — `node --test test/reservar.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0` (el stub no cambia).
- [ ] **Step 5: Commit de la task** — `feat(0012): reservar con aviso de sala muy ocupada`, con la atribución del proyecto.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 1 task, un fichero de código y uno de tests; sin referencia previa en el `estimation-log` para este tipo.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Reservar crea la reserva activa: THEN `reservada Sur mar 09:00-10:00` y AND `libres` sin Sur → Task 1, `reservar crea la reserva activa`. ✓
- Aviso al alcanzar el umbral: THEN la respuesta con el aviso `(4 reservas)` → Task 1, `el aviso sale al llegar a 4`. ✓
- El aviso sigue por encima del umbral: THEN `(5 reservas)` → Task 1, `el aviso sigue en la quinta`. ✓
- Sin aviso por debajo del umbral → Task 1, `sin aviso con una reserva`. ✓
- Las canceladas no suman → Task 1, `las canceladas no suman`. ✓
- Otro día no suma → Task 1, `otro día no suma`. ✓
- Otra sala no suma → Task 1, `otra sala no suma`. ✓
- El aviso no bloquea: THEN y AND `libres` sin Norte → Task 1, `el aviso no bloquea`. ✓
- Reglas de la capacidad (umbral, aviso literal) → Task 1, constantes y tests de texto exacto. ✓
- Filas de «Lo que se retira o cambia de forma» → N/A: nada se retira; el stub se conserva (Review Focus). ✓
- Líneas del Review Focus → Task 1, `reservar sin franja no lanza`, `reservar repetido cuenta las dos`, y la suite `test/app.test.js` para el stub. ✓
