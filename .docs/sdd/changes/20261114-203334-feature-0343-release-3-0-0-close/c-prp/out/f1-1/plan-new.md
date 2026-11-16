---
id: 20261115-203316-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace el hilo en Native, en gama media (Sonnet, effort medium): el plan trae firmas, textos y tests escritos.
2. Ejecución: Native, porque son 2 tasks encadenadas por una sola función, un error lo caza el test de su task y el plan cabe en un contexto.
3. `bookings` se exporta de `src/app.js` para que los tests siembren reservas: el módulo guarda el estado en memoria y no hay otra costura. Es un cambio de visibilidad, sin dependencias.
4. Los tests siembran con `bookings.length = 0` y `bookings.push(...)` en cada test, porque el estado persiste entre tests del mismo fichero.
5. Coste estimado: ~1 h, sin despachos.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` los enseña.

**Architecture**: un campo `reason` en la reserva; `cancelBooking(room, day, reason)` valida y guarda; `run` extrae `--motivo`; `canceladas` filtra por estado. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final. El dev-lead pidió parar tras el commit de la Task 1 («cuando tengas el commit de la Task 1, para.»): al tenerlo, para y no sigas con la Task 2 hasta que diga «sigue».

**Eje Arquitectura**: no — solo cambia `src/app.js` y exporta un array que ya existe; sin módulo, dependencia ni contrato nuevo entre módulos.

## Restricciones globales

### De código

- Claves de motivo exactas: `cambio-de-planes`, `sala-ocupada`, `otro`; en pantalla `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: `cancelada <sala> <día> (motivo: <etiqueta>)` · `falta el motivo: usa cambio-de-planes, sala-ocupada u otro` · `motivo no válido «<x>»: usa cambio-de-planes, sala-ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- Sin comentarios que repitan el código ni que citen documentos (spec, task, capacidad); código limpio; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Texto de la interfaz en castellano (constitution, art. 4).

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits referenciando la 0010; al final del mensaje, la línea de atribución del harness.

## Review Focus

- `cancelar Norte lun --motivo` (sin valor) → `falta el motivo: …` · Task 1, `cancelar con --motivo sin valor dice que falta`
- `--motivo` con valor válido pero la reserva ya cancelada → `sin reserva Norte lun` · Task 1, `cancelar dos veces`
- Reserva anulada con `anular` → no sale en `canceladas` · Task 2, `canceladas no incluye las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y una función; no hay forma más simple.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: `anular`, `libres` y `reservar` no se tocan; cambian solo los dos tests de `cancelar`, por decisión 8 de la spec.
- [x] **Constitution check**: tests primero, gate `node --test` entero, texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `export const bookings`; `cancelBooking(room, day, reason)`; `listCancelled()`; `run` extrae `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — los dos tests actuales llevan `--motivo`, más los nuevos de cada task.

**NO se tocan**:

- `scripts/lint.mjs`, `package.json` — sin cambios de herramientas.
- `README.md`, `CHANGELOG.md` — el changelog lo escribe el corte de release.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El estado en memoria se arrastra entre tests | media | tests que dependen del orden | cada test siembra `bookings` desde cero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar exige un motivo de la lista

**Tras**: —
**Modelo**: hilo principal en Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`

**Interfaces**:
- Consume: nada.
- Produce: `export const bookings` (array de `{ room, day, slot, status, reason? }`); `cancelBooking(room, day, reason)` que devuelve el texto; `run('cancelar', [sala, día, '--motivo', clave])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `import { run, bookings } from '../src/app.js'` y un `seed()` que haga `bookings.length = 0` y añada `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`:
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala-ocupada'])` → `cancelada Norte lun (motivo: sala ocupada)`; con `cambio-de-planes` → `(motivo: cambio de planes)`; con `otro` → `(motivo: otro)`; la reserva queda con `status` `cancelled` y `reason` la clave.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `falta el motivo: usa cambio-de-planes, sala-ocupada u otro` y `status` sigue `active`.
  - `cancelar con --motivo sin valor dice que falta`: `['Norte', 'lun', '--motivo']` → el mismo texto.
  - `cancelar con motivo desconocido`: `--motivo aburrimiento` → `motivo no válido «aburrimiento»: usa cambio-de-planes, sala-ocupada u otro`, reserva activa.
  - `el motivo se valida antes de buscar la reserva`: `['Sur', 'mar']` → `falta el motivo: …`; `['Sur', 'mar', '--motivo', 'aburrimiento']` → `motivo no válido «aburrimiento»: …`.
  - `cancelar una reserva que no existe lo dice`: `['Sur', 'mar', '--motivo', 'otro']` → `sin reserva Sur mar`.
  - `cancelar dos veces`: la segunda llamada → `sin reserva Norte lun`.
  Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `export const bookings`; `const REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reason)`: sin `reason` (undefined) → `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`; `reason` fuera de `REASONS` → `motivo no válido «${reason}»: usa cambio-de-planes, sala-ocupada u otro`; después busca la reserva y, si no hay, `sin reserva ${room} ${day}`; si hay, `status = 'cancelled'`, `reason = reason`, y devuelve `cancelada ${room} ${day} (motivo: ${REASONS[reason]})`. En `run`, `reason` es el elemento tras `--motivo` (undefined si falta el flag o no hay valor), y `cancelar` llama `cancelBooking(params[0], params[1], reason)`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listar las canceladas con su motivo

**Tras**: Task 1
**Modelo**: hilo principal en Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`

**Interfaces**:
- Consume: `bookings` y el `reason` que guarda `cancelBooking` (Task 1), y el mapa `REASONS` de `src/app.js`.
- Produce: `run('canceladas', [])` → líneas `<sala> <día> <franja> · <etiqueta>` separadas por salto de línea, en orden de cancelación; `sin canceladas` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — con `bookings` sembrado `Norte lun 10:00-12:00`, `Sur mar 14:00-16:00`, `Norte mié 09:00-10:00` (todas `active`):
  - `canceladas lista por orden de cancelación`: cancelar Sur mar con `otro`, después Norte lun con `sala-ocupada` → `Sur mar 14:00-16:00 · otro\nNorte lun 10:00-12:00 · sala ocupada`.
  - `canceladas no incluye las anuladas`: además `run('anular', ['Norte', 'mié'])` → no aparece la línea de Norte mié.
  - `canceladas sin ninguna`: → `sin canceladas`.
  Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — el orden de cancelación exige registrar cuándo se cancela: `cancelBooking` añade `cancelledAt = ++cancelCounter` (contador de módulo) y `canceladas` filtra `status === 'cancelled'`, ordena por `cancelledAt` y formatea con `REASONS`. En `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,2h
- Estimación de cierre: 0,2h
- Base de la estimación: 2 tasks pequeñas en un fichero; incertidumbre baja; el log de estimación del proyecto no tiene features comparables.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo de la lista: THEN y AND (`cambio-de-planes`, `otro`) → Task 1, `cancelar una reserva activa con motivo`. ✓
- Cancelar sin motivo válido: THEN, AND `--motivo` sin valor y AND `aburrimiento` → Task 1, `cancelar sin motivo no cancela`, `…sin valor…`, `…motivo desconocido`. ✓
- El motivo se valida antes de buscar la reserva: THEN y AND → Task 1, `el motivo se valida antes de buscar la reserva`. ✓
- Cancelar una reserva que no existe: THEN y AND (dos veces) → Task 1, `…no existe lo dice`, `cancelar dos veces`. ✓
- Listar las canceladas: THEN, orden y sin anuladas → Task 2, `canceladas lista por orden de cancelación`, `…no incluye las anuladas`; AND `sin canceladas` → `canceladas sin ninguna`. ✓
- Fila retirada «cancelar sin motivo deja de cancelar» y «salida sin motivo» → Task 1, los dos tests actuales pasan a llevar `--motivo` y el test `cancelar sin motivo no cancela` lo fija. ✓
- `anular`, `libres`, `reservar` sin cambios → N/A (confirmado en spec). ✓
- Review Focus → Task 1 (`…sin valor…`, `cancelar dos veces`) y Task 2 (`…anuladas`). ✓
