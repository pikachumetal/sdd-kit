---
id: 20261111-090422-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Dos tasks, en este orden: la 1 cambia `cancelar` (motivo, validación, campo `reason`, `bookings` exportado) y la 2 añade `canceladas` — la 2 consume el campo `reason` de la 1.
2. Modelo por task: `sdd-kit:effort-medium` + `sonnet` (Native: la sesión las hace; el plan lleva el diseño).
3. Ejecución: Native, fijada en `sdd-kit.json`.
4. Parada: tras el commit de la Task 1 se para y se informa, por la frase del dev-lead «cuando tengas el commit de la Task 1, para»; la Task 2 sigue cuando diga «sigue».
5. Riesgos altos: ninguno. Coste: ~1 h entre las dos tasks, sin despachos.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lista las canceladas con su motivo.

**Architecture**: un campo `reason` en la reserva; constante `reasons` (clave tecleada → texto mostrado); `canceladas` filtra por estado `cancelled`. Todo en `src/app.js`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y su test; sin módulo, dependencia ni contrato nuevos entre módulos.

## Restricciones globales

### De código

- Motivos literales: `cambio-de-planes`, `sala-ocupada`, `otro`; se muestran como «cambio de planes», «sala ocupada», «otro».
- Validar con `Object.hasOwn(reasons, reason)`.
- Identificadores de código en inglés; mensajes en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); clean code.

### De proceso

- Tests antes que código (Art. 2 de la constitution). Un commit por task, al quedar limpia.
- Commits: `feat(0010): <qué>`, con la atribución del kit.

## Review Focus

- `cancelar Norte lun constructor` → `motivo no válido: …`, la reserva sigue activa · Task 1, `rechaza constructor como motivo`
- `cancelar Norte lun sala ocupada` (el texto mostrado, con espacio) → `motivo no válido: …` · Task 1, `rechaza el motivo con espacios`
- `cancelar` sobre una reserva ya cancelada con motivo válido → `sin reserva Norte lun` · Task 1, `no cancela dos veces`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y un filtro.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: retrocompatibilidad rota a propósito (decisión 2 de la spec); sigue el patrón de `src/app.js`.
- [x] **Constitution check**: tests primero, gate de cierre, textos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `reasons`, `bookings` exportado, `cancelBooking(room, day, reason)`, `cancelledList()` y las ramas `cancelar` y `canceladas` de `run`.
- `test/cancel.test.js` — los dos tests existentes con motivo y los nuevos.

**NO se tocan**:

- `voidBooking` y la rama `anular`: es la 0011.
- `scripts/lint.mjs`, `test/app.test.js`: sin cambios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests (`bookings` en memoria) | Media | Bajo | Cada test siembra con `seed(...)`, que vacía `bookings` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la sesión; la task trae las firmas y los textos)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun sala-ocupada` → `cancelada Norte lun (sala ocupada)`; `node src/app.js cancelar Norte lun` → `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `export const bookings` (array de `{ room, day, slot, status, reason? }`); `cancelBooking(room, day, reason)` que guarda `booking.reason = reason` (la clave tecleada); `reasons` (`{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `seed(...bookings)` que hace `bookings.length = 0; bookings.push(...nuevas)` e importando `bookings` de `../src/app.js`:
  - `cancelar con cada motivo` (tres, cada uno sembrando `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`): `run('cancelar', ['Norte', 'lun', 'cambio-de-planes'])` → `cancelada Norte lun (cambio de planes)`; `sala-ocupada` → `(sala ocupada)`; `otro` → `(otro)`; y `bookings[0].reason` es la clave tecleada.
  - `rechaza sin motivo y fuera de la lista`: `['Norte','lun']` y `['Norte','lun','aburrimiento']` → `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, y `bookings[0].status === 'active'`.
  - `rechaza constructor como motivo`, `rechaza Otro con mayúscula`, `rechaza el motivo con espacios` (`['Norte','lun','sala','ocupada']`): mismo aviso.
  - `el motivo se comprueba antes que la reserva`: `['Sur','mar']` → el aviso de motivo.
  - `sin reserva con motivo válido`: `['Sur','mar','otro']` → `sin reserva Sur mar`.
  - `no cancela dos veces`: cancelar `Norte lun otro` y repetir → `sin reserva Norte lun`.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`. Esperado: fallan.
- [ ] **Step 3: Implementación** — en `src/app.js`: `export const bookings`; `const reasons`; `cancelBooking(room, day, reason)` devuelve el aviso si `!Object.hasOwn(reasons, reason)`, después `sin reserva …`, y si no `status = 'cancelled'`, `reason = reason` y `cancelada ${room} ${day} (${reasons[reason]})`; la rama `cancelar` de `run` pasa `params[2]`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada ejecución del CLI arranca de cero (decisión 11 de la spec): se prueba por `run()` y el dev-lead lo valida con `node -e "import('./src/app.js').then(m => { m.run('cancelar',['Norte','lun','otro']); console.log(m.run('canceladas',[])) })"` → `Norte lun · otro`.

**Interfaces**:
- Consume: `bookings` y el campo `reason` de la Task 1; `reasons`.
- Produce: comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — `canceladas lista las canceladas con su motivo` (siembra Norte lun `cancelled` con `reason: 'sala-ocupada'`, Norte mie `active`, Sur mar `voided`, Sur jue `cancelled` con `reason: 'otro'`): `run('canceladas', [])` → `'Norte lun · sala ocupada\nSur jue · otro'`; `canceladas sin ninguna` → `sin canceladas`; `cancelar y listar`: sembrar Norte lun activa, `cancelar … cambio-de-planes`, `canceladas` → `Norte lun · cambio de planes`.
- [ ] **Step 2: Ver el RED** — esperado: fallan.
- [ ] **Step 3: Implementación** — rama `canceladas` de `run`: filtrar `status === 'cancelled'`, `${room} ${day} · ${reasons[reason]}` unidas con `\n`, o `sin canceladas`.
- [ ] **Step 4: Verificación** — esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): comando canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Cancelar con motivo» THEN y AND de `sala-ocupada`/`otro` → Task 1, `cancelar con cada motivo`. ✓
- «Cancelar con motivo» AND `canceladas` muestra el motivo → Task 2, `cancelar y listar`. ✓
- «Exige un motivo» THEN → Task 1, `rechaza sin motivo y fuera de la lista` (también comprueba que la reserva sigue activa). ✓
- «Exige un motivo» AND `Sur mar` sin motivo → Task 1, `el motivo se comprueba antes que la reserva`. ✓
- «Exige un motivo» AND `Otro`, `constructor`, motivo con espacios → Task 1, los tres tests de rechazo. ✓
- «Sin reserva activa» THEN → Task 1, `sin reserva con motivo válido`; AND ya cancelada → `no cancela dos veces`. ✓
- «Listado» THEN y AND (anulada y activa no aparecen) → Task 2, `canceladas lista las canceladas con su motivo`; AND `sin canceladas` → Task 2, `canceladas sin ninguna`. ✓
- Fila «`cancelBooking(room, day)` cambia de firma» → Task 1, Step 3 (único uso: `run`). ✓
- Review Focus: las tres líneas → Task 1, tests nombrados arriba. ✓
