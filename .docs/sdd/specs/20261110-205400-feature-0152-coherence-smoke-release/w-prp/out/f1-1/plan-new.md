---
id: 20261112-211624-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: sesión Native en la gama actual; ambas tasks son pequeñas y el plan lleva las firmas y los textos.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Se parte en dos tasks por la costura de la spec: Task 1 cancela con motivo y lo observa con `libres`; Task 2 añade `canceladas` y observa el motivo guardado. Los AND de «Cancelar una reserva con motivo», «El motivo es obligatorio», «El motivo tiene que ser de la lista» y «Cancelar una reserva que ya no está activa» que usan `canceladas` se prueban en la Task 2.
4. `resetBookings()` exportada desde `src/app.js` restaura la reserva semilla (`Norte lun 10:00-12:00`); los tests la llaman en `beforeEach` (decisión 14 de la spec).
5. Coste: ~1 h, sin despachos; la revisión final de rama la hacen sus ejes.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista y `canceladas` lo enseña.

**Architecture**: un campo `reason` en la reserva y una constante `CANCEL_REASONS` en `src/app.js`; `cancelBooking(room, day, reasonKey)` valida y guarda; `cancelledBookings()` alimenta el comando `canceladas`.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` sin módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Textos de interfaz y motivos exactamente como la spec: `cancelada <sala> <día> (<motivo legible>)`, `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`, `motivo no válido «<motivo>»: elige cambio-de-planes, sala-ocupada u otro`, `sin canceladas`.
- Sin comentarios que repitan el código ni que citen documentos (constitución, spec, task, capacidad); código limpio, sin dependencias nuevas, sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitución, art. 2). Commits en castellano con el estilo `feat:` del proyecto, un commit por task.
- Atribución de commits: la que fija el entorno de la sesión.

## Review Focus

- `cancelar Norte lun otro extra` → cancela con `otro`, ignora el sobrante · Task 1, `ignora argumentos de más`
- `cancelar Norte lun Otro` → `motivo no válido «Otro»: …`, reserva activa · Task 1, `el motivo distingue mayúsculas`
- `canceladas` con argumentos → los ignora y lista igual · Task 2, `canceladas ignora argumentos`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones y un comando.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: respeta el patrón de `run`; el único cambio de contrato es el pedido (motivo obligatorio).
- [x] **Constitution check**: tests primero, gate completo, castellano en la interfaz.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledBookings`, `resetBookings`, comando `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests existentes pasan a la forma nueva y entran los de la spec.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `scripts/lint.mjs` — sigue valiendo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | alta | tests que dependen del orden | `resetBookings()` en `beforeEach` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sesión Native; effort: no disponible en este harness, hereda el de la sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; con `cancelar Norte lun` ve `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `CANCEL_REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reasonKey)` que devuelve el texto de la spec y guarda `reason` (texto legible) en la reserva; `resetBookings()` que restaura la reserva semilla.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `beforeEach(resetBookings)` e importando `resetBookings` de `../src/app.js`; todos por `run`, y «sigue activa» con `run('libres', ['10:00-12:00'])` que devuelve `Sur` si Norte está activa y `Norte, Sur` si no:
  - `cancelar con motivo`: `run('cancelar', ['Norte','lun','sala-ocupada'])` = `cancelada Norte lun (sala ocupada)` y `libres` = `Norte, Sur`.
  - `el motivo es obligatorio`: `run('cancelar', ['Norte','lun'])` = `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`; `libres` = `Sur`.
  - `el motivo tiene que ser de la lista`: `vacaciones` → `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`; `libres` = `Sur`.
  - `el motivo distingue mayúsculas`: `Otro` → `motivo no válido «Otro»: elige cambio-de-planes, sala-ocupada u otro`; `libres` = `Sur`.
  - `el motivo se valida antes de buscar la reserva`: `cancelar Sur mar` = `falta el motivo: …`.
  - `cancelar sin reserva con motivo válido`: `cancelar Sur mar otro` = `sin reserva Sur mar`.
  - `cancelar una que ya no está activa`: cancelar `Norte lun cambio-de-planes` y de nuevo `Norte lun otro` = `sin reserva Norte lun`.
  - `ignora argumentos de más`: `cancelar Norte lun otro extra` = `cancelada Norte lun (otro)`.
  Ejecutar y ver fallar (`resetBookings` no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: la constante `CANCEL_REASONS`; `seedBookings()` que devuelve la reserva semilla, `bookings` pasa a `let` y `resetBookings()` la reasigna; `cancelBooking(room, day, reasonKey)`: sin `reasonKey` → `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`; clave fuera de `CANCEL_REASONS` (comparación exacta, `Object.hasOwn`) → `motivo no válido «${reasonKey}»: elige cambio-de-planes, sala-ocupada u otro`; después busca la activa y, si hay, `status = 'cancelled'`, `reason = CANCEL_REASONS[reasonKey]` y `cancelada ${room} ${day} (${reason})`. `run` pasa `params[2]`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: motivo al cancelar una reserva (0010)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sesión Native; effort: no disponible en este harness, hereda el de la sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ve `Norte lun 10:00-12:00 · cambio de planes` con `canceladas` tras cancelar con `cambio-de-planes`.

**Interfaces**:
- Consume: de la Task 1, `CANCEL_REASONS`, `cancelBooking`, `resetBookings` y el campo `reason`.
- Produce: `cancelledBookings()` que devuelve el texto de `canceladas`; comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — con `beforeEach(resetBookings)`:
  - `canceladas enseña el motivo`: cancelar `Norte lun cambio-de-planes` y `run('canceladas', [])` = `Norte lun 10:00-12:00 · cambio de planes`.
  - `cancelar con motivo se ve en canceladas`: `sala-ocupada` → `Norte lun 10:00-12:00 · sala ocupada`.
  - `cada motivo se enseña con su texto`: `otro` → `Norte lun 10:00-12:00 · otro`.
  - `canceladas no lista anuladas ni activas`: sin nada, y tras `anular Norte lun`, responde `sin canceladas`.
  - `canceladas ignora argumentos`: tras cancelar, `run('canceladas', ['x'])` lista igual.
  - `el motivo obligatorio deja sin cancelar`: tras `cancelar Norte lun` y tras `cancelar Norte lun vacaciones`, `canceladas` = `sin canceladas`.
  - `una ya cancelada conserva su motivo`: tras `cancelar Norte lun cambio-de-planes` y `cancelar Norte lun otro`, `canceladas` = `Norte lun 10:00-12:00 · cambio de planes`.
  Ejecutar y ver fallar.
- [ ] **Step 2: Implementación** — `cancelledBookings()`: filtra `status === 'cancelled'`, une `${room} ${day} ${slot} · ${reason}` con salto de línea; vacío → `sin canceladas`. `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: listado de canceladas con su motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin referencia en el estimation-log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN → Task 1, `cancelar con motivo`; AND `canceladas` → Task 2, `cancelar con motivo se ve en canceladas`. ✓
- El motivo es obligatorio: THEN y AND → Task 1, `el motivo es obligatorio` (AND con `libres`) y Task 2, `el motivo obligatorio deja sin cancelar`. ✓
- El motivo tiene que ser de la lista: THEN y AND → Task 1, `el motivo tiene que ser de la lista`; Task 2, `el motivo obligatorio deja sin cancelar`. ✓
- Se valida antes de buscar → Task 1, `el motivo se valida antes de buscar la reserva`. ✓
- Sin reserva con motivo válido → Task 1, `cancelar sin reserva con motivo válido`. ✓
- Ya no activa: THEN → Task 1, `cancelar una que ya no está activa`; AND → Task 2, `una ya cancelada conserva su motivo`. ✓
- Listado con motivo → Task 2, `canceladas enseña el motivo`; cada motivo → `cada motivo se enseña con su texto`. ✓
- No incluye anuladas ni activas → Task 2, `canceladas no lista anuladas ni activas`. ✓
- Reglas de la capacidad (límites, argumentos de más) → Task 1, `el motivo distingue mayúsculas`, `ignora argumentos de más`; Task 2, `canceladas ignora argumentos`. ✓
- Filas de «Lo que se retira»: forma de dos argumentos → Task 1, `el motivo es obligatorio`; tests existentes → Task 1, reescritos. ✓
- Review Focus → cubierto por los tests nombrados en cada línea. ✓
