---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la propia sesión en Sonnet con effort medium para las 2 tasks; el plan lleva firmas, textos y tests, no hay prosa que interpretar. La revisión final de rama va con los modelos de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Lo que la spec no fija y este plan decide (⚠ pendiente de tu confirmación: cambia lo que ve quien usa el comando)**:
   - `cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo. Consecuencia: el test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
   - Orden de comprobación: primero que exista la reserva (`sin reserva <sala> <día>`, como hoy, también sin motivo), después el motivo. Con motivo no válido la reserva sigue activa.
   - `canceladas` sin ninguna cancelada responde cadena vacía; con varias, una línea por reserva, en orden de la lista. Las anuladas (`voided`) no salen: la spec dice «estado cancelada».
4. **Decisión técnica interna (rulado, no cambia la salida)**: se exporta `resetBookings()` desde `src/app.js` para que cada test de `test/cancel.test.js` parta de la reserva de Norte del lunes; el estado es de módulo y el primer test ya la cancela, así que sin reset el GIVEN de los escenarios nuevos no se cumpliría.
5. **Riesgo alto**: ninguno; un solo fichero de código, sin datos persistentes.
6. **Coste**: ~1,5 h; Native, sin despachos, del orden de una sesión corta.
7. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda con la reserva; el comando `canceladas` lista las canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo contra `REASONS` y lo guarda en `booking.reason`; `run` extrae el valor tras `--motivo` y enruta `canceladas` a `listCancelled()`. Todo en `src/app.js`, el único fichero de entrada del proyecto.

**Tech Stack**: Node 22 sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos o datos nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `<sala> <día> — <motivo>` (raya larga, espacios a ambos lados).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas y de una sola responsabilidad.
- Texto de la interfaz en castellano.

### De proceso

- Native: el hilo implementa las 2 tasks en orden; TDD del propio hilo; un commit por task al quedar limpia su revisión.
- Modelos: gama media como suelo; `fable` y `opus xhigh` solo con justificación escrita.
- Atribución de commits: la del entorno, al final del mensaje.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo "otro"` (sin reserva) → «sin reserva Sur mar», no el error de motivo · Task 1, `sin reserva gana al motivo`
- Motivo no válido con reserva → la reserva sigue activa: un `cancelar` posterior con motivo válido responde «cancelada…» · Task 1, `motivo no válido deja la reserva activa`
- `canceladas` sin ninguna cancelada → cadena vacía · Task 2, `canceladas sin canceladas`
- Reserva anulada (`anular`) → no sale en `canceladas` · Task 2, `canceladas no lista anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lista de motivos como constante y estado en el propio objeto reserva; sin clases ni ficheros nuevos.
- [x] **YAGNI gate**: nada se abstrae; `resetBookings()` solo existe porque los tests lo necesitan.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); sigue el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope. `anular` (0011) no se toca.
- [x] **Constitution check**: tests antes que código (art. 2), flujo SDD (art. 1), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`; `cancelBooking(room, day, reason)` valida y guarda `reason`; `listCancelled()`; `resetBookings()`; `run` extrae `--motivo` y enruta `canceladas`.
- `test/cancel.test.js` — los 2 tests existentes pasan a llevar `--motivo` donde cancelan; escenarios y Review Focus nuevos; `beforeEach(resetBookings)`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.

### 1.6 Dependencias

Ninguna; la 0011 toca `src/app.js` pero otra región (`voidBooking`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado de módulo compartido entre tests | Alta | Medio | `resetBookings()` en `beforeEach` |
| Conflicto con la 0011 en `src/app.js` | Media | Bajo | regiones distintas; la comprobación de la base de `sdd-implement` lo avisa |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` deja `booking.status = 'cancelled'` y `booking.reason = reason`; `resetBookings()` restaura la reserva `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, `beforeEach(resetBookings)` y:
  - `cancelar con motivo de la lista` — `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista` — `--motivo 'por gusto'` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela` — `['Norte', 'lun']` → el mismo mensaje.
  - `motivo no válido deja la reserva activa` — tras el no válido, `['Norte', 'lun', '--motivo', 'otro']` → `'cancelada Norte lun (otro)'`.
  - `sin reserva gana al motivo` — `['Sur', 'mar', '--motivo', 'otro']` → `'sin reserva Sur mar'`.
  - Los dos tests existentes: el primero pasa a `['Norte', 'lun', '--motivo', 'otro']` → `'cancelada Norte lun (otro)'`; el segundo no cambia.
  Verlos fallar por la razón esperada.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; `reason` fuera de `REASONS` → `motivo no válido: ${REASONS.join(', ')}` sin tocar la reserva; si no, guarda estado y motivo y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el valor que sigue a `--motivo` en `params` (`undefined` si no está).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión; convención del proyecto, referenciando la 0010.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque el estado vive en memoria y cada ejecución del CLI parte de la reserva inicial: se prueba por `run`, como el resto del proyecto.

**Interfaces**:
- Consume: de la Task 1, `booking.reason`, `booking.status === 'cancelled'` y `resetBookings()`.
- Produce: `listCancelled()` → líneas `<sala> <día> — <motivo>` unidas con `\n`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas enseña el motivo` — `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` y `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas` — `run('canceladas', [])` → `''`.
  - `canceladas no lista anuladas` — `run('anular', ['Norte', 'lun'])` y `run('canceladas', [])` → `''`.
  Verlos fallar por la razón esperada.
- [ ] **Step 2: Implementación** — `listCancelled()` filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}`, une con `'\n'`; `run` enruta `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks en un solo fichero, sin dependencias; incertidumbre baja salvo los 3 puntos de la decisión 3. Sin `estimation-log.md` de referencia.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar pide un motivo · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED Cancelar pide un motivo · AND motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista`. ✓
- ADDED El listado enseña el motivo · THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Capacidad `bookings`: no existe `capabilities/` en el proyecto; no hay regla retirada. N/A. ✓
- Review Focus (5 líneas) → Task 1: `cancelar sin motivo no cancela`, `sin reserva gana al motivo`, `motivo no válido deja la reserva activa`; Task 2: `canceladas sin canceladas`, `canceladas no lista anuladas`. ✓
