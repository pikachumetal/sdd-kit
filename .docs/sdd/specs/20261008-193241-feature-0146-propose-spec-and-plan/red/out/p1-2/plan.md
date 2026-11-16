---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en `sdd-kit.json`. Son 2 tasks pequeñas sobre un solo fichero, así que no compensa un subagente por task. Sin gate de plan: el perfil es `delegate`.
2. **Modelo y effort**: no se despacha ningún subagente. Las dos tasks las hace la sesión. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
3. **Sin `--motivo` o con `--motivo` sin valor, `cancelar` responde «motivo no válido: cambio de planes, sala ocupada, otro»** y no cancela. La spec solo fija el caso de un motivo fuera de la lista; «cancelar pide un motivo» sin motivo es el mismo caso, y dejar cancelar sin él deja rastro vacío, que es lo que la feature quiere evitar.
4. **`sin reserva <sala> <día>` tiene prioridad sobre «motivo no válido»**: se busca la reserva primero. Así el test existente `cancelar sin reserva lo dice` (sin motivo) sigue valiendo tal cual.
5. **El motivo se compara tal cual, sin normalizar mayúsculas**: «Sala ocupada» no es válido. La lista es cerrada y la spec la escribe en minúsculas.
6. **El test `cancelar una reserva activa` cambia**: pasa a ser el THEN de la spec («cancelada Norte lun (sala ocupada)»). Su salida antigua (`cancelada Norte lun`) deja de existir.
7. **`canceladas` sin ninguna cancelada responde cadena vacía**, como `libres` cuando no hay salas. No cae en el `salas` por defecto. Varias canceladas van una por línea, en el orden de `bookings`.
8. **Las reservas anuladas (`voided`) no salen en `canceladas`**: la spec dice «estado cancelada», y `anular` es la 0011.
9. **Los tests comparten el estado en memoria de `src/app.js`** y solo hay una reserva (Norte lun), que se puede cancelar una vez por proceso. El orden de los tests en `test/cancel.test.js` es parte del diseño: ver Task 2.

**Riesgos altos**: ninguno.
**Coste estimado**: ~0,5 h, sin subagentes.
**Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada, lo guarda con la reserva, y `canceladas` lista las canceladas con su motivo.

**Architecture**: El motivo se guarda en el campo `reason` de la reserva al pasar a `cancelled`. `run` extrae el valor tras `--motivo` de los parámetros y se lo pasa a `cancelBooking`. `canceladas` es una función nueva que filtra `bookings` por estado.

**Tech Stack**: Node 22, sin dependencias, `node --test`. Todo en `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; todo el código en `src/app.js`.
- Texto de la interfaz en castellano, literal como en la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Lista de motivos, en este orden y en minúsculas: `cambio de planes`, `sala ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean code; la constitution del proyecto no tiene artículo de calidad.

### De proceso

- Ejecución native; el revisor final va con `sdd-kit:effort-high` + `opus`.
- Commits: convención del proyecto (`feat: …`), referenciando 0010, terminados con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Norte lun --motivo` (sin valor) → el mismo «motivo no válido…» · Task 1, `cancelar con --motivo sin valor lo rechaza`
- `--motivo "Sala ocupada"` (otra capitalización) → «motivo no válido…», no se normaliza · Task 1, `cancelar rechaza el motivo con otra capitalización`
- `cancelar Sur mar --motivo "otro"` (sin reserva, motivo válido) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice` (el existente, ampliado con motivo)
- `canceladas` sin ninguna cancelada → cadena vacía, no el `salas` por defecto · Task 2, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y una función de listado; sin tipos ni módulos nuevos.
- [x] **YAGNI gate**: la lista de motivos es una constante con un uso; no se abstrae nada más.
- [x] **Brownfield gate**: retrocompatible salvo la salida de `cancelar` sin motivo, que es el cambio pedido; patrón del módulo respetado (funciones exportadas + `run`); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (Art. 2), interfaz en castellano (Art. 4), cambio por flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)` con validación y guardado del motivo, `cancelledBookings()`, y el cableado de `--motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los tests de los THEN de la spec y de las entradas del Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son la 0011.
- `test/app.test.js` — no depende de `cancelar`.
- `PRODUCT.md`, `README.md` — sin cambio de contrato documentado fuera de la capacidad.

### 1.2 Modelo de datos

Cada reserva gana el campo opcional `reason: string`, que se escribe solo al cancelar. En memoria; no hay persistencia ni migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>`; `canceladas` (sin parámetros).

### 1.5 UX

No aplica: solo salida de texto, ya fijada por la spec.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) es posterior y no se mezcla.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests con una sola reserva | Media | Bajo | El orden de los tests está fijado en la Task 2 |
| `--motivo` leído con el valor en otra posición | Baja | Bajo | Se toma el parámetro siguiente a `--motivo`, en cualquier posición |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar pide un motivo de la lista

**Modelo**: sesión Native, sin despacho (gama media, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · docs (no hay otra).
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` existente; devuelve la reserva activa o `undefined`.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string` (exportada) y `REASONS: string[]` = `['cambio de planes', 'sala ocupada', 'otro']`; la reserva cancelada queda con `status: 'cancelled'` y `reason`. `run('cancelar', params)` toma el motivo del parámetro que sigue a `--motivo`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden. El primero ya existe y se amplía con motivo; el del THEN de cancelar con éxito va el último de la task, porque cancela Norte lun y solo hay una reserva por proceso:
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar con un motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `cancelar con --motivo sin valor lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo mensaje.
  - `cancelar rechaza el motivo con otra capitalización`: `'--motivo', 'Sala ocupada'` → el mismo mensaje.
  - `cancelar una reserva activa con motivo` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  Ejecutar `node --test test/cancel.test.js`. Esperado: FAIL en los cuatro tests de rechazo y en el de cancelar con éxito.
- [ ] **Step 2: Implementación** en `src/app.js`: `REASONS`; `cancelBooking(room, day, reason)` busca la reserva (si no hay, `sin reserva <sala> <día>`), valida `reason` contra `REASONS` por igualdad exacta (si no, el mensaje de motivo no válido, sin tocar la reserva), y guarda `status` y `reason`; en `run`, el motivo es `params[params.indexOf('--motivo') + 1]` (`undefined` si falta la opción o no hay valor).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: todos los tests de la task en verde.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Modelo**: sesión Native, sin despacho (gama media, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend.
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: no, porque el estado vive en memoria y cada ejecución de la CLI arranca con la reserva Norte lun activa: `canceladas` en un proceso nuevo responde vacío. La comprobación que sí se puede hacer es la salida de `run` en el test, que es la que fija la spec.

**Interfaces**:
- Consume: de la Task 1, `cancelBooking(room, day, reason)` y el campo `reason` de la reserva cancelada.
- Produce: `cancelledBookings(): string` (exportada): una línea `<sala> <día> — <motivo>` por reserva con `status: 'cancelled'`, separadas por `\n`, o `''` si no hay. `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`. Va **antes** del test `cancelar una reserva activa con motivo` (es el único momento en que no hay canceladas).
  - `el listado de canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`. Va **al final** del fichero, después del test que cancela Norte lun; su GIVEN lo establece ese test.
  Ejecutar `node --test test/cancel.test.js`. Esperado: FAIL en ambos (`canceladas` cae en `salas`).
- [ ] **Step 2: Implementación** en `src/app.js`: `cancelledBookings()` y la rama `canceladas` en `run`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat: canceladas lista las reservas con su motivo (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los THEN de la spec con ejecución real: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y `node src/app.js cancelar Norte lun --motivo vacaciones`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN «cancelada Norte lun (sala ocupada)») → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED, AND «motivo no válido: …» → Task 1, `cancelar con un motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- No entra: anulaciones del responsable de sala (0011) → N/A, `voidBooking` intacta. ✓
- Review Focus: sin motivo, `--motivo` sin valor, capitalización, sin reserva → Task 1; listado vacío → Task 2. ✓
- Escenarios de la spec sin task: ninguno. ✓
