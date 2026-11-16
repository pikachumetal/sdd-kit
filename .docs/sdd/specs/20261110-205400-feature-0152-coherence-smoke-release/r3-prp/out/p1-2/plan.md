---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: las dos tasks las hace el hilo principal (Native), en gama media (Sonnet, effort medium): el plan trae firmas, valores y tests, y el cambio es de un solo fichero. La revisión final de rama va con los modelos de `sdd-verify`, no con esta política.
2. **Ejecución**: native, fijado en `sdd-kit.json` (`execution`). 2 tasks encadenadas por `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto.
3. `cancelar` sin `--motivo`, o con `--motivo` sin valor, responde igual que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y no fija este caso. Deja de existir la respuesta «cancelada Norte lun» sin motivo: el test que la fijaba (`cancelar una reserva activa`) se reescribe con motivo.
4. Se valida el motivo antes de buscar la reserva: `cancelar Sur mar --motivo "otra cosa"` responde «motivo no válido…», no «sin reserva…». Con motivo válido y sin reserva, sigue «sin reserva Sur mar».
5. `canceladas` lista solo las de estado `cancelled` (no las `voided` de `anular`, que es la 0011), una línea por reserva, unidas con `\n`; sin ninguna, devuelve la cadena vacía (la spec no fija un texto y no invento uno).
6. **Riesgo alto, para el dev-lead**: las reservas viven en memoria y se reinician en cada ejecución de `node src/app.js`. Por la línea de comandos, `cancelar` y `canceladas` son procesos distintos y `canceladas` nunca verá la cancelación. La spec no pide persistencia (No entra no la menciona) y el plan no la añade; el escenario se observa dentro de un mismo proceso, llamando a `run`. Si se quiere que funcione de verdad entre ejecuciones, es otra feature.
7. Los tests de esta feature importan `src/app.js` con una query única (`?n`) para tener las reservas de partida limpias en cada test, sin tocar el código de producción para resetear estado.
8. **Coste estimado**: ~2 h en total (ver «Estimación y esfuerzo»), sin despachos de subagentes en las tasks.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` en el mismo objeto de `bookings`; `cancelBooking` valida y asigna; `listCancelled` filtra por estado y formatea. Todo en `src/app.js`, siguiendo el patrón de `cancelBooking` y `voidBooking`.

**Tech Stack**: Node ≥ 20 (ESM), sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — mismo fichero, sin módulo, dependencia ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; los literales exactos son los de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (con raya `—`).
- Lista de motivos cerrada y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Node ≥ 20, sin dependencias externas, un solo fichero de entrada `src/app.js` (architecture.md).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa cada task con TDD; los commits siguen la convención del proyecto y citan la 0010.
- Cada commit termina con la línea de atribución que fije el entorno.
- `voidBooking` y el comando `anular` no se tocan (0011).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `Rejects_missing_reason`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo mensaje · Task 1, `Rejects_flag_without_value`
- Un motivo inválido no cancela: tras el error, `cancelar … --motivo "sala ocupada"` sí responde «cancelada Norte lun (sala ocupada)» · Task 1, `Invalid_reason_keeps_booking_active`
- `canceladas` tras `anular Norte lun` → vacío, no lista las anuladas · Task 2, `Listing_excludes_voided`
- `canceladas` sin ninguna cancelación → vacío · Task 2, `Listing_empty_without_cancellations`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y dos funciones pequeñas; sin estructura nueva.
- [x] **YAGNI gate**: `REASONS` se usa en dos sitios (validar y mensaje); nada más se abstrae.
- [x] **Brownfield gate**: respeta el patrón de `cancelBooking`/`voidBooking`; el único cambio de comportamiento previo (cancelar sin motivo) está en las decisiones; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (Art. 2); texto en castellano (Art. 4); flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)` valida y guarda `reason`, `listCancelled()`, y `run` enruta `cancelar --motivo` y `canceladas`.
- `test/cancel.test.js` — reescribe los dos tests existentes con motivo y añade los de esta feature.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `freeRooms`, `findBooking` — no cambian.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Solo en memoria; no hay persistencia (decisión 6).

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas` (sin argumentos).

### 1.5 UX

No aplica: salida de línea de comandos, literales en las restricciones.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) es independiente y no se toca.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `canceladas` no ve cancelaciones de otro proceso (estado en memoria) | Alta | Medio | Decisión 6: avisado al dev-lead; los tests lo observan en un mismo proceso |
| Tests que comparten estado del módulo y dependen del orden | Media | Bajo | Decisión 7: importación fresca por test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet, effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "otra cosa"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `export const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`, y la reserva cancelada queda con `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con el helper `let n = 0; const fresh = async () => (await import(`../src/app.js?${n++}`)).run;`. Reescribe `cancelar una reserva activa` y `cancelar sin reserva lo dice` con motivo (`['Sur', 'mar', '--motivo', 'otro']` → `'sin reserva Sur mar'`) y añade:
  - `Cancels_with_listed_reason`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `Rejects_reason_outside_list`: `--motivo 'por gusto'` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `Rejects_missing_reason`: sin `--motivo` → el mismo mensaje.
  - `Rejects_flag_without_value`: `['Norte', 'lun', '--motivo']` → el mismo mensaje.
  - `Invalid_reason_keeps_booking_active`: tras un motivo inválido, el cancelar válido responde `'cancelada Norte lun (sala ocupada)'`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos y los reescritos.
- [ ] **Step 3: Implementación** — en `src/app.js`: `REASONS` (arriba) y `cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` ``; después busca la reserva (`sin reserva …` si no hay), pone `status = 'cancelled'`, `reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`, el motivo es `params[params.indexOf('--motivo') + 1]` cuando el flag está, y `undefined` si no. Un `indexOf` que da `-1` no debe leer `params[0]`.
- [ ] **Step 4: Build** — no hay build. Esperado: nada que compilar.
- [ ] **Step 5: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — uno solo al quedar limpia la revisión, citando la 0010.

---

### Task 2 — Listado de canceladas con motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet, effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: dentro de un mismo proceso (límite de la decisión 6), tras cancelar Norte lun con «sala ocupada», `canceladas` responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: de la Task 1, la reserva cancelada con `status: 'cancelled'` y `reason`; `cancelBooking(room, day, reason)`.
- Produce: `listCancelled()` → `string` (una línea `` `${room} ${day} — ${reason}` `` por reserva cancelada, unidas con `\n`; `''` si no hay).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — con el helper `fresh` de la Task 1:
  - `Listing_shows_reason`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `Listing_excludes_voided`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` → `''`.
  - `Listing_empty_without_cancellations`: en una instancia nueva, `run('canceladas', [])` → `''`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los tres (hoy `canceladas` responde `'salas'`).
- [ ] **Step 3: Implementación** — en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'` y formatea como arriba; en `run`, `if (cmd === 'canceladas') return listCancelled();` antes del `return 'salas'`.
- [ ] **Step 4: Build** — no hay build. Esperado: nada que compilar.
- [ ] **Step 5: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 6: Commit de la task** — uno solo al quedar limpia la revisión, citando la 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks en un solo fichero, patrón ya existente (`cancelBooking`); la incertidumbre es la persistencia en memoria (decisión 6), que no se implementa. Sin calibración previa en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, Art. 2; no hay `operations.md`)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `Cancels_with_listed_reason`. ✓
- · AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `Rejects_reason_outside_list`. ✓
- ADDED «El listado de canceladas enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 2, `Listing_shows_reason`. ✓
- Respuesta retirada «cancelada Norte lun» sin motivo → Task 1, `Rejects_missing_reason` y los dos tests reescritos con motivo. ✓
- Anulaciones del responsable (0011) → N/A (No entra en la spec). ✓
- Review Focus: `Rejects_missing_reason`, `Rejects_flag_without_value`, `Invalid_reason_keeps_booking_active` (Task 1); `Listing_excludes_voided`, `Listing_empty_without_cancellations` (Task 2). ✓
