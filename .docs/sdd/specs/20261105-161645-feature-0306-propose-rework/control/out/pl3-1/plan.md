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

1. **Modelo y effort por task**: Native, las hace la sesión (Sonnet, effort medium); son cambios de pocas líneas en un solo fichero y el plan lleva la firma y los asserts. La revisión final de rama va con `sdd-kit:effort-high` + `opus` (Spec y Arquitectura) y `sdd-kit:effort-high` + `sonnet` (Código).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Orden de las comprobaciones en `cancelar`**: primero la reserva, después el motivo. Así `cancelar Sur mar` sin motivo sigue diciendo «sin reserva Sur mar» y el test existente no cambia.
4. **`cancelar` sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: …») y no cancela. La spec dice «pide un motivo» y no dice qué pasa sin él.
5. **`canceladas` sin ninguna** responde «sin canceladas», en la línea de «sin reserva …». La spec no lo fija.
6. **Varias canceladas**: una línea cada una, unidas con salto de línea, en el orden de `bookings`.
7. **El test existente `cancelar una reserva activa` se modifica**: pasa a llevar `--motivo` porque su salida cambia a «cancelada Norte lun (sala ocupada)». Es el test de la ADDED 1.
8. **Los tests de `test/cancel.test.js` comparten el estado en memoria** (`bookings` es de módulo y solo hay la reserva de Norte del lunes). Dependen del orden del fichero y las dos tasks lo respetan (ver Step 1 de cada una). No añado un `reset` exportado: lo evita el orden y no hay tercer uso.
9. **Sin observar**: que una reserva anulada no sale en `canceladas`. Con una sola reserva sembrada no se puede anular una y cancelar otra. Lo cubre el filtro por `status === 'cancelled'` que fija la spec, no un test (avisado en §4).
10. **Coste estimado**: ~1 h de implementación y revisión en total, sin subagentes salvo los 3 ejes de la revisión final.

Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige `--motivo` de una lista cerrada, lo guarda con la reserva y el comando `canceladas` lo muestra.

**Architecture**: la reserva cancelada guarda `reason`; `cancelBooking` valida y asigna, y `listCancelled` filtra por `status === 'cancelled'`. Todo en `src/app.js`, que es el único fichero de entrada del proyecto.

**Tech Stack**: Node 22, sin dependencias; tests con `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos: solo cambia `src/app.js` y su test.

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de salida literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Sin dependencias externas; un solo fichero de entrada, `src/app.js`; sin tabuladores en él (lo mira `scripts/lint.mjs`).
- Los comentarios no repiten lo que dice el código ni citan documentos (constitution, spec, task, capacidad). Código claro, funciones cortas, nombres que dicen lo que hacen.
- Texto de la interfaz y de los documentos en castellano.

### De proceso

- Native: la sesión implementa las dos tasks, una tras otra, con TDD: RED visto antes del código.
- Commits con la convención del proyecto (`feat: …`, `docs: …`) y, al final, la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Sin `--no-verify`.
- Un commit por task, al quedar limpia su revisión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Norte lun --motivo "vacaciones"` (fuera de la lista) no cancela: la reserva sigue activa, así que el `cancelar` con motivo válido que le sigue sí la cancela · Task 1, `un motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → «sin canceladas», no una línea vacía · Task 2, `canceladas sin ninguna lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin estructuras nuevas; un campo `reason` y una función.
- [x] **YAGNI gate**: no se abstrae nada; sin `reset` exportado ni constante compartida fuera de `src/app.js`.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` ahora exige motivo); respeta el patrón de `cancelBooking` y `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida el motivo y lo guarda; `listCancelled()` nueva; `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de las dos ADDED de la spec, más los tres del Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable son la 0011.
- `test/app.test.js`, `test/store.test.js` — no dependen de `cancelar`.
- `scripts/lint.mjs` — solo mira tabuladores.

### 1.2 Modelo de datos

La reserva cancelada lleva `reason: string`, uno de los tres motivos. No hay persistencia: las reservas viven en memoria.

### 1.6 Dependencias

Ninguna. La 0011 (anular) es independiente: no toca `cancelBooking`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests dependen del orden del fichero por el estado compartido | Media | Bajo | El orden se fija en las tasks; si un test se añade en medio, falla en rojo y se ve |
| `--motivo "sala ocupada"` llega al `run` como un solo argumento | Baja | Medio | El test lo pasa como un solo elemento, como lo entrega el shell |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Native: la hace la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime `cancelada Norte lun (sala ocupada)`; con `--motivo vacaciones` imprime `motivo no válido: cambio de planes, sala ocupada, otro`. Cada invocación del CLI parte de las reservas sembradas, así que se prueba una por proceso.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → `string`; la reserva cancelada queda con `status: 'cancelled'` y `reason`. `run('cancelar', [room, day, '--motivo', reason])`. La constante `reasons = ['cambio de planes', 'sala ocupada', 'otro']` en `src/app.js`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden:
  1. `cancelar sin reserva lo dice` (existente, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  2. `cancelar sin motivo lo rechaza y no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  3. `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo texto de motivo no válido.
  4. `cancelar una reserva activa` (existente, modificado): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`. Si 2 o 3 hubieran cancelado la reserva, este falla: así se comprueba que no cancelaron.
- [ ] **Step 2: RED** — `node --test test/cancel.test.js`. Esperado: fallan 2, 3 y 4 (1 pasa).
- [ ] **Step 3: Implementación** — en `src/app.js`: `const reasons = ['cambio de planes', 'sala ocupada', 'otro'];` · `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; con ella, si `reason` no está en `reasons` → `motivo no válido: ${reasons.join(', ')}` sin tocar la reserva; si está, `status = 'cancelled'`, `reason`, y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es `params[params.indexOf('--motivo') + 1]` y es `undefined` si no hay `--motivo`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native: la hace la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el CLI parte de las reservas sembradas en cada proceso, así que no puede ver una cancelación de otro proceso; lo observa solo el test. `node src/app.js canceladas` imprime `sin canceladas`.

**Interfaces**:
- Consume: de la Task 1, `bookings` con `status: 'cancelled'` y `reason`.
- Produce: `listCancelled()` → `string`: `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`; `sin canceladas` si no hay. `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  1. `canceladas sin ninguna lo dice`, **antes** del test `cancelar una reserva activa` (la reserva de Norte aún está activa): `run('canceladas', [])` → `'sin canceladas'`.
  2. `canceladas enseña el motivo`, **después** de él: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
- [ ] **Step 2: RED** — `node --test test/cancel.test.js`. Esperado: fallan los dos nuevos (el comando cae en el `'salas'` por defecto).
- [ ] **Step 3: Implementación** — `listCancelled()` en `src/app.js`: filtra `bookings` por `status === 'cancelled'` y, si no hay, devuelve `sin canceladas`; si hay, `${room} ${day} — ${reason}` unidas con `\n`. `run('canceladas')` la llama.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): el listado de canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.25h
- Estimación de cierre: 0.25h
- Base de la estimación: 2 tasks de pocas líneas en un solo fichero; incertidumbre baja, solo el orden de los tests con estado compartido
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED 1, THEN «responde `cancelada Norte lun (sala ocupada)`» → Task 1, `cancelar una reserva activa`. ✓
- ADDED 1, AND «motivo fuera de la lista responde `motivo no válido: …`» → Task 1, `un motivo fuera de la lista no cancela`. ✓
- ADDED 2, THEN «responde `Norte lun — sala ocupada`» → Task 2, `canceladas enseña el motivo`. ✓
- «Una anulada no sale en canceladas» (de la Approach: lista las de estado cancelada) → sin observar: con una sola reserva sembrada no se puede anular una y cancelar otra (avisado en las decisiones, nº 9). ⚠
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza y no cancela`; fuera de lista → Task 1, `un motivo fuera de la lista no cancela`; sin canceladas → Task 2, `canceladas sin ninguna lo dice`. ✓
