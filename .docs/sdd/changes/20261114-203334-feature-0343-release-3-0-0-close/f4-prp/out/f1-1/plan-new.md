---
id: 20261116-135119-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, las dos tasks las hace la sesión (Sonnet, effort medium): son 20 líneas de código con la firma y los tests escritos en el plan. La revisión final de rama no sigue esta política: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Parada tras la Task 1**: el dev-lead pidió «cuando tengas el commit de la Task 1, para». Se hace la Task 1, se commitea y se para; la Task 2 espera su «sigue».
4. **Decisión técnica que la spec no fija**: `bookings` se exporta como `export const bookings` (decisión 18 de la spec); `cancelBooking` queda exportada como hoy; el listado es una función `cancelledList()` no exportada, que se ve solo por `run('canceladas', [])`.
5. **Riesgo alto**: ninguno; el estado en memoria entre tests de un mismo fichero es el único sitio donde se puede equivocar (ver Review Focus).
6. **Coste estimado**: 1,5 h; sin despachos de subagentes en las tasks (solo los de la revisión final).
7. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige y guarda un motivo de la lista, y `canceladas` lista las canceladas con su motivo.

**Architecture**: dos cambios en `src/app.js`: `cancelBooking(room, day, reason)` valida el motivo antes de buscar la reserva y `run` encamina `canceladas`. Sin ficheros de código nuevos ni dependencias; los tests entran por `run`, como los actuales.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia una función y un comando de `src/app.js`; sin módulo, dependencia ni contrato entre módulos o datos nuevos.

## Restricciones globales

### De código

- Motivos literales y en este orden: `cambio de planes`, `sala ocupada`, `otro`; comparación exacta en minúsculas, sin recortar espacios.
- Aviso literal: `motivo requerido: cambio de planes, sala ocupada, otro`.
- El motivo es `params.slice(2).join(' ')`.
- Se comprueba el motivo antes que la reserva.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2); texto de la interfaz en castellano (art. 4).
- Commits: `feat(0010): <qué>`, uno por task, con la atribución que fije la sesión.
- Modelos: la sesión de Native; sin `fable` ni `opus xhigh` en las tasks.

## Review Focus

- `cancelar Norte lun` con reserva y sin motivo → aviso del motivo y la reserva sigue activa (`libres 10:00-12:00` lista Norte) · Task 1, `sin_motivo_no_cancela`
- `cancelar Sur mar` sin reserva y sin motivo → aviso del motivo, no `sin reserva Sur mar` · Task 1, `sin_reserva_y_sin_motivo`
- `cancelar Norte lun Otro` → aviso del motivo · Task 1, `motivo_en_mayusculas_no_vale`
- Estado compartido entre tests de un mismo fichero: los tests que no deben cancelar corren antes del que cancela Norte lun, y los que necesitan otra reserva la siembran con `bookings.push` · Task 1, orden de los tests en `test/cancel.test.js`; Task 2, orden en `test/canceladas.test.js`
- Una reserva anulada no sale en `canceladas` · Task 2, `anulada_no_sale`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí, dos funciones y una constante.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: retrocompatible salvo la forma de `cancelar` (cambio pedido); sigue el patrón de `src/app.js`.
- [x] **Constitution check**: tests antes que código, gate de cierre entero, castellano en la interfaz.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — listado: vacío, una cancelada, dos canceladas.
- `test/canceladas-anulada.test.js` — una reserva anulada no sale en el listado.

**Modificar**:

- `src/app.js` — `export const bookings`, constante `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledList()`, rutas de `run`.
- `test/cancel.test.js` — los dos tests existentes pasan a llevar motivo y se añaden los de la spec.

**NO se tocan**:

- `PRODUCT.md` — la decisión 15 de la spec deja las 24 h y las definiciones como están.
- `CHANGELOG.md` y `ROADMAP.md` — los toca el cierre.

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason` (cadena). Sin migración: todo vive en memoria.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> <motivo…>` (motivo obligatorio) y `canceladas` (sin argumentos).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | media | tests que pasan por orden | orden fijado y siembra con `bookings.push` (Review Focus) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión de Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend.
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun` y ve `motivo requerido: cambio de planes, sala ocupada, otro`; con `node src/app.js cancelar Norte lun sala ocupada` ve `cancelada Norte lun`.

**Interfaces**:
- Consume: nada.
- Produce: `export const bookings` (array de `{ room, day, slot, status, reason? }`); `cancelBooking(room, day, reason)` que devuelve `motivo requerido: cambio de planes, sala ocupada, otro` | `sin reserva <sala> <día>` | `cancelada <sala> <día>`, y deja `status = 'cancelled'` y `reason` en la reserva; `run('cancelar', params)` pasa `params.slice(2).join(' ')`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, importando `{ run, bookings }`, en este orden (el estado es del proceso del fichero): `sin_motivo_no_cancela` (`run('cancelar', ['Norte','lun'])` → aviso, y `run('libres', ['10:00-12:00'])` incluye `Norte`); `motivo_fuera_de_lista_no_cancela` (`['Norte','lun','aburrimiento']` → aviso); `motivo_en_mayusculas_no_vale` (`['Norte','lun','Otro']` → aviso); `sin_reserva_y_sin_motivo` (`['Sur','mar']` → aviso); `sin_reserva_con_motivo` (`['Sur','mar','otro']` → `sin reserva Sur mar`); `motivo_entrecomillado` (siembra `bookings.push({ room: 'Sur', day: 'mar', slot: '14:00-15:00', status: 'active' })`; `['Sur','mar','sala ocupada']` → `cancelada Sur mar`, y esa reserva tiene `reason === 'sala ocupada'`); `motivo_en_varias_palabras` (`['Norte','lun','cambio','de','planes']` → `cancelada Norte lun`, `reason === 'cambio de planes'`); `ya_cancelada_dice_sin_reserva` (`['Norte','lun','otro']` → `sin reserva Norte lun`). Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `export const bookings`; `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: si `!CANCEL_REASONS.includes(reason)` devuelve el aviso literal; después busca la reserva activa; al cancelar guarda `status = 'cancelled'` y `reason`. En `run`, `cancelar` pasa `params.slice(2).join(' ')`. El texto de éxito no cambia.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión de Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/canceladas.test.js`, `test/canceladas-anulada.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend.
**Verificación**: `node --test test/canceladas.test.js test/canceladas-anulada.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js canceladas` y ve `sin canceladas`.

**Interfaces**:
- Consume: `export const bookings`, `cancelBooking(room, day, reason)`, el campo `reason` y `status` de la Task 1.
- Produce: `run('canceladas', [])` → líneas `<sala> <día> <franja> · <motivo>` en el orden de `bookings`, o `sin canceladas`.

**Ficheros**: modificar `src/app.js`; crear `test/canceladas.test.js`, `test/canceladas-anulada.test.js`

- [ ] **Step 1: Tests RED** — `test/canceladas.test.js`, en este orden: `vacio` (`run('canceladas', [])` → `sin canceladas`); `una_cancelada` (`run('cancelar', ['Norte','lun','cambio de planes'])`, luego `canceladas` → `Norte lun 10:00-12:00 · cambio de planes`); `dos_canceladas_en_orden` (siembra `bookings.push({ room: 'Sur', day: 'mar', slot: '14:00-15:00', status: 'active' })`, `cancelar Sur mar otro`, `canceladas` → `Norte lun 10:00-12:00 · cambio de planes\nSur mar 14:00-15:00 · otro`). `test/canceladas-anulada.test.js`: `anulada_no_sale` (`run('anular', ['Norte','lun'])`, `canceladas` → `sin canceladas`). Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `cancelledList()`: filtra `bookings` por `status === 'cancelled'`, las une con `\n` en formato `${room} ${day} ${slot} · ${reason}`, o `sin canceladas` si no hay; `run('canceladas')` la devuelve.
- [ ] **Step 3: Verificación** — el comando de «Verificación» → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de reservas canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un solo fichero de código; sin historial en `estimation-log.md`.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): toda cancelación nueva queda con motivo y `canceladas` los enseña
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `cancelar Norte lun sala ocupada` → `cancelada Norte lun` → Task 1, `motivo_entrecomillado` y `motivo_en_varias_palabras`. ✓
- AND queda cancelada con el motivo (y `canceladas` lo enseña) → Task 1 (`reason` guardado) y Task 2, `una_cancelada`. ✓
- AND vale igual entrecomillado → Task 1, `motivo_entrecomillado`. ✓
- Sin motivo → aviso y reserva activa → Task 1, `sin_motivo_no_cancela`. ✓
- Motivo fuera de lista → Task 1, `motivo_fuera_de_lista_no_cancela`. ✓
- `Otro` → Task 1, `motivo_en_mayusculas_no_vale`. ✓
- Sin reserva con motivo → `sin reserva Sur mar` → Task 1, `sin_reserva_con_motivo`. ✓
- Sin reserva y sin motivo → aviso → Task 1, `sin_reserva_y_sin_motivo`. ✓
- Ya cancelada → `sin reserva Norte lun` → Task 1, `ya_cancelada_dice_sin_reserva`. ✓
- Listado con una cancelada → Task 2, `una_cancelada`. ✓
- Listado con dos, en orden → Task 2, `dos_canceladas_en_orden`. ✓
- Listado vacío → Task 2, `vacio`. ✓
- Anulada fuera del listado → Task 2, `anulada_no_sale`. ✓
- Forma `cancelar <sala> <día>` retirada → Task 1, los tests de `test/cancel.test.js` ya llevan motivo. ✓
- Entrada del changelog → N/A en las tasks: la escribe el cierre (decisión 21). ✓
- Líneas del Review Focus → Task 1 y Task 2, los tests nombrados. ✓
