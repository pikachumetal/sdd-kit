---
id: 20261112-161102-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace el hilo principal (Native), sin despachos; la revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`, Arquitectura no (ver «Eje Arquitectura»).
2. Ejecución: Native, fijado en `sdd-kit.json`.
3. Dos tasks: la 1 es `cancelar` con motivo (valida y guarda `reason`); la 2 es `canceladas`. Son dos porque un revisor podría rechazar el listado y aprobar la cancelación.
4. Los escenarios con `canceladas` en su AND solo se pueden observar cuando existe el comando; la Task 1 los observa de otra forma (una cancelación válida después de una fallida responde `cancelada…`, luego la reserva seguía activa) y la Task 2 observa el AND literal.
5. La Task 2 usa tres ficheros de test (`test/canceladas.test.js`, `test/canceladas-sala-ocupada.test.js`, `test/canceladas-anulada.test.js`): hay una sola reserva en memoria y cada fichero es un proceso con el estado inicial.
6. Coste estimado: 2,3 h en total (ver Estimación); sin despachos de subagentes salvo la revisión final de rama.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` pide un motivo de la lista y `canceladas` lo enseña.

**Architecture**: `src/app.js` ya concentra el comportamiento. Se añade una tabla `reasons` y se pasa el motivo a `cancelBooking`, que valida antes de buscar la reserva y lo guarda en `booking.reason`; `listCancelled` filtra por estado.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos o datos.

## Restricciones globales

### De código

- Los textos son literales de la spec: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, `cancelada <sala> <día> (<motivo con espacios>)`, `sin canceladas`, `<sala> <día> <franja> · <motivo con espacios>`.
- Identificadores de motivo: `cambio-de-planes`, `sala-ocupada`, `otro`; comparación exacta, sin normalizar mayúsculas.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas. La constitution del proyecto no tiene artículo de calidad: valen estas dos reglas.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native: la sesión implementa las dos tasks y el ledger lo lleva `sdd task start` / `sdd task done`.
- Un commit por task, con la convención del repo (`feat: …`) y el pie de atribución del kit.
- Parada pedida por el dev-lead: tras el commit de la Task 1, no seguir con la Task 2 hasta que diga «sigue».

## Review Focus

- `cancelar Sur mar otro extra` → los argumentos de más se ignoran y responde `sin reserva Sur mar` · Task 1, `ignora argumentos de más`
- `cancelar Norte lun Otro` (mayúscula) → `motivo no válido: …`, la comparación es exacta · Task 1, `motivo fuera de la lista no cancela`
- `cancelar Norte lun otro` sobre una reserva ya cancelada → `sin reserva Norte lun` y el listado no cambia · Task 2, `una cancelada no se vuelve a cancelar`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una tabla y dos funciones; no hay forma más simple que cumpla la lista.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: retrocompatible no (la orden sin motivo deja de valer, por decisión del dev-lead); respeta el patrón del módulo; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (1, 2), gate de cierre (3), castellano en la interfaz (4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` — `canceladas` sin canceladas tras fallos, con una cancelada y tras un segundo cancelar.
- `test/canceladas-sala-ocupada.test.js` — el listado con el motivo `sala-ocupada`.
- `test/canceladas-anulada.test.js` — una anulada no se lista.

**Modificar**:

- `src/app.js` — tabla `reasons`, `cancelBooking(room, day, reason)`, `listCancelled()`, rutas de `run`.
- `test/cancel.test.js` — los tests de `cancelar` con motivo.

**NO se tocan**:

- `README.md`, `CHANGELOG.md` — el changelog lo escribe el corte de la release.
- `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva en memoria gana el campo `reason` al cancelarse. Sin migración.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests de un mismo fichero (una sola reserva) | media | un test pasa por el orden y no por el código | el orden de cada fichero está fijado en la task; un fichero por estado de partida |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin motivo ve `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` que guarda `booking.reason` con el identificador (`'sala-ocupada'`), y la tabla `reasons` de `src/app.js`: `{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', 'otro': 'otro' }`; `run('cancelar', [sala, día, motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — sustituir el contenido de `test/cancel.test.js` por, en este orden (comparten estado):
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` es `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
  - `motivo fuera de la lista no cancela`: `['Norte','lun','aburrimiento']` y `['Norte','lun','Otro']` dan el mismo texto.
  - `el motivo se valida antes que la reserva`: `['Sur','mar']` da `motivo no válido: …`; `['Sur','mar','otro']` da `sin reserva Sur mar`.
  - `ignora argumentos de más`: `['Sur','mar','otro','extra']` da `sin reserva Sur mar`.
  - `cancelar con motivo cancela`: `['Norte','lun','sala-ocupada']` da `cancelada Norte lun (sala ocupada)` (prueba también que los fallos anteriores no cancelaron).
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const reasons = {…}` (arriba); `cancelBooking(room, day, reason)` devuelve el texto de motivo no válido si `reasons[reason]` no existe, antes de `findBooking`; al cancelar, `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reasons[reason]})` ``; `run` pasa `params[2]`. Usar `Object.hasOwn(reasons, reason)` para que `toString` no valga.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo; `feat: cancelar pide un motivo de la lista (0010)`, con los tests; `tasks.md` con la Task 1 a `done`.

### Task 2 — Listar las canceladas con su motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native); sin despacho.
**Tests RED**: hilo principal · `test/canceladas.test.js`, `test/canceladas-sala-ocupada.test.js`, `test/canceladas-anulada.test.js`.
**Superficies**: backend
**Verificación**: `node --test test/canceladas.test.js test/canceladas-sala-ocupada.test.js test/canceladas-anulada.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar con `cambio-de-planes`, `canceladas` imprime `Norte lun 10:00-12:00 · cambio de planes`.

**Interfaces**:
- Consume: `reasons`, `booking.reason` y el estado `cancelled` de la Task 1.
- Produce: `listCancelled()` y la ruta `run('canceladas', [])`.

**Ficheros**: crear los tres tests; modificar `src/app.js`

- [ ] **Step 1: Tests RED**, cada fichero en su orden:
  - `test/canceladas.test.js`: `sin canceladas con la reserva activa` (`run('canceladas', [])` es `sin canceladas`, tras un `cancelar Norte lun` sin motivo y otro con `aburrimiento`); `lista la cancelada con su motivo` (cancelar `['Norte','lun','cambio-de-planes']`, luego `Norte lun 10:00-12:00 · cambio de planes`); `una cancelada no se vuelve a cancelar` (`['Norte','lun','otro']` da `sin reserva Norte lun` y `canceladas` sigue igual).
  - `test/canceladas-sala-ocupada.test.js`: cancelar con `sala-ocupada`; `canceladas` es `Norte lun 10:00-12:00 · sala ocupada`.
  - `test/canceladas-anulada.test.js`: `run('anular', ['Norte','lun'])`; `canceladas` es `sin canceladas`.
- [ ] **Step 2: Implementación** — `listCancelled()`: filtra `bookings` por `status === 'cancelled'`, formatea `` `${room} ${day} ${slot} · ${reasons[reason]}` `` y une con `\n`; vacío da `sin canceladas`. `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — uno solo; `feat: comando canceladas con el motivo (0010)`; `tasks.md` con la Task 2 a `done`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,4 h
- Base de la estimación: 2 tasks pequeñas sobre un fichero de 35 líneas; las dos últimas features del proyecto (0005, 0006) costaron 1 h cada una.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN `cancelada Norte lun (sala ocupada)` → Task 1, `cancelar con motivo cancela`. ✓
- Cancelar exige un motivo: AND `canceladas` responde `…· sala ocupada` → Task 2, `test/canceladas-sala-ocupada.test.js`. ✓
- Motivo ausente: THEN → Task 1, `cancelar sin motivo no cancela`; AND `sin canceladas` → Task 2, `sin canceladas con la reserva activa` (tras el fallo). ✓
- Motivo fuera de la lista: THEN (`aburrimiento` y `Otro`) → Task 1, `motivo fuera de la lista no cancela`; AND → Task 2, el mismo test. ✓
- Motivo antes que reserva: ambos THEN → Task 1, `el motivo se valida antes que la reserva`. ✓
- Ya cancelada: THEN y AND → Task 2, `una cancelada no se vuelve a cancelar`. ✓
- Listar con motivo: THEN → Task 2, `lista la cancelada con su motivo`; AND «una línea por cancelada» → sin observar: solo existe una reserva en memoria (avisado en la decisión 4 y en la spec). ⚠
- Sin canceladas → Task 2, `sin canceladas con la reserva activa`. ✓
- Anuladas no se listan → Task 2, `test/canceladas-anulada.test.js`. ✓
- «Lo que se retira»: `cancelar` sin motivo y respuesta sin motivo → Task 1, los tests nuevos sustituyen a los de `test/cancel.test.js:5-10`. ✓
- Review Focus → `ignora argumentos de más` y `motivo fuera de la lista no cancela` (Task 1), `una cancelada no se vuelve a cancelar` (Task 2). ✓
