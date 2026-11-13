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

1. **Modelo y effort**: las dos tasks las hace el hilo principal (Native) en gama media (Sonnet, effort medium): el plan trae firmas, textos y tests, y no hay prosa que interpretar. La revisión final de rama va con los modelos de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista** («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y no fija este caso. Cambia el comportamiento de hoy, así que los dos tests existentes de `test/cancel.test.js` pasan a llevar `--motivo`.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva Sur mar». La spec no fija el orden.
5. **`canceladas` sin ninguna cancelada responde «sin canceladas»**: la spec no fija este caso. Las anuladas (`voided`, 0011) no salen: solo las de estado `cancelled`.
6. **Riesgos altos**: ninguno; un solo fichero de producción, sin dependencias.
7. **Coste estimado**: 1,5 h de implementación; sin subagentes de tasks, solo la revisión final de rama.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar guarda un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: `cancelBooking` recibe el motivo, lo valida contra una lista cerrada y lo guarda en la reserva cancelada (`reason`). `run` lo lee de `--motivo` y añade el comando `canceladas`, que lista las reservas de estado `cancelled`. Todo en `src/app.js`, como el resto del proyecto.

**Tech Stack**: Node 22, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json` · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: ni módulo, ni dependencia, ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa cada task con `sdd task start` / `sdd task done`, en gama media.
- Commits en castellano, un commit por task al quedar limpia su revisión, con la convención `feat:` del proyecto y la atribución que fije la sesión.
- Perfil `delegate`: sin parada tras cada task; sí ante una desviación de la spec.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Sur mar --motivo xyz` (sin reserva y motivo inválido) → «motivo no válido…», no «sin reserva» · Task 1, `el motivo se valida antes de buscar la reserva`
- `canceladas` sin ninguna cancelada → «sin canceladas»; una reserva anulada no sale · Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un comando de lectura; nada más simple.
- [x] **YAGNI gate**: la lista de motivos es una constante, sin abstracción.
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo, decidido arriba (decisión 3); respeta el patrón de `src/app.js` (funciones exportadas + `run`); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, motivo en `cancelBooking`, lectura de `--motivo` en `run`, función `cancelledBookings` y comando `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan a llevar `--motivo`; tests nuevos de motivo y de listado (en el mismo fichero, como fija la spec en «Dónde se prueba»).

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, feature 0011.
- `test/app.test.js` — no cubre cancelar.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Las reservas en memoria no se persisten: sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica: comando de terminal.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten `bookings` y dependen del orden del fichero | Media | Bajo | El orden está fijado en el Step 1 de la Task 1; Node ejecuta los tests de un fichero en orden. |
| Un motivo con espacios llega partido en `params` | Baja | Medio | Se lee `params[params.indexOf('--motivo') + 1]`: el shell entrega «sala ocupada» como un solo argumento; el test pasa el motivo como un solo elemento. |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium; el plan trae firmas, textos y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista, o sin motivo, ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js`, tal como están.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → `string`; la reserva cancelada lleva `reason`; `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, los dos existentes pasan a `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` y `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`. Nuevos, con `const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro'`:
  - `cancelar con un motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'xyz'])` → `INVALID`.
  - `cancelar sin motivo lo rechaza y no cancela`: `run('cancelar', ['Norte', 'lun'])` → `INVALID`; la reserva sigue activa porque `cancelar una reserva activa`, que va después, la cancela con éxito.
  - `el motivo se valida antes de buscar la reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'xyz'])` → `INVALID`.
  `bookings` es estado compartido del módulo y solo existe Norte lun: el fichero se ordena para que haya una sola cancelación con éxito de Norte lun, la de `cancelar una reserva activa`, tras los rechazos (así «sin motivo no cancela» queda probado: la cancelación posterior sigue funcionando; los rechazos no consumen la reserva). Orden del fichero: rechazos, `canceladas sin canceladas lo dice` (Task 2), `cancelar una reserva activa`, `cancelar sin reserva lo dice`, y los tests de listado de la Task 2.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos y el de «cancelar una reserva activa».
- [ ] **Step 3: Implementación mínima** — en `src/app.js`: `const REASONS = [...]`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` si `!REASONS.includes(reason)`, antes de `findBooking`; al cancelar guarda `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``; en `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` (`undefined` si falta la opción).
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: cancelar pide un motivo de la lista` (0010).

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium; el plan trae firmas, textos y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada» en la misma ejecución, `canceladas` muestra «Norte lun — sala ocupada»; sin ninguna cancelada, «sin canceladas».

**Interfaces**:
- Consume: `bookings` con `status: 'cancelled'` y `reason` (Task 1); `run(cmd, params)`.
- Produce: `cancelledBookings()` → `string` (una línea `` `${room} ${day} — ${reason}` `` por reserva cancelada, unidas con `\n`; `'sin canceladas'` si no hay); `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin canceladas lo dice`: `run('canceladas', [])` → `'sin canceladas'`, el primero del fichero que se ejecuta con el estado inicial (Node ejecuta los tests de un fichero en orden).
  - `el listado de canceladas enseña el motivo`: con Norte lun cancelada por `cancelar una reserva activa` (motivo «sala ocupada»), `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: con Norte lun ya cancelada, `run('anular', ['Norte', 'lun'])` → `'sin reserva Norte lun'` y `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'` (solo estado `cancelled`; `voided` no entra al listado).
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js`. Esperado: fallan los tres (`run('canceladas')` devuelve `'salas'`).
- [ ] **Step 3: Implementación mínima** — en `src/app.js`: `function cancelledBookings()` filtra `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` ``, une con `'\n'`, y devuelve `'sin canceladas'` si no hay; `run` añade `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: el listado de canceladas enseña el motivo` (0010).

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks en un fichero, sin dependencias; la incertidumbre es el estado compartido de `bookings` entre tests.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde “cancelada Norte lun (sala ocupada)”» → Task 1, `cancelar una reserva activa`. ✓
- AND «un motivo fuera de la lista responde “motivo no válido: …”» → Task 1, `cancelar con un motivo fuera de la lista lo rechaza`. ✓
- THEN «`canceladas` responde “Norte lun — sala ocupada”» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- `anular` y las anulaciones (0011) → N/A (confirmado en spec, «No entra»). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza y no cancela`. ✓
- Review Focus: orden de validación → Task 1, `el motivo se valida antes de buscar la reserva`. ✓
- Review Focus: sin canceladas y anuladas → Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`. ✓
