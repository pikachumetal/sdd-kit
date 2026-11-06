---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 con la propia sesión (Native), Sonnet con effort medium: son cambios de pocas líneas en un solo fichero y el plan trae los textos exactos. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`), también con dos tasks.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** (la spec no lo dice): responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. Razón: la spec dice que cancelar «pide un motivo»; sin motivo está fuera de la lista.
4. **Orden de las comprobaciones de `cancelar`** (la spec no lo dice): primero si existe la reserva (`sin reserva …`, como hoy), después el motivo. Un motivo inválido no cancela la reserva.
5. **`canceladas` sin ninguna cancelada** (la spec no lo dice): responde «sin canceladas». El filtro es el estado `cancelled` exacto, así que las anuladas (`voided`, de la 0011) no salen; no hay test de eso: con una sola reserva sembrada, `anular` y `cancelar` se excluyen y la spec fija `test/cancel.test.js` como sitio del test, sin fichero nuevo.
6. **Tests existentes**: `test/cancel.test.js` tiene dos tests que llaman a `cancelar` sin motivo. El primero (`cancelar una reserva activa`) cambia a pasar `--motivo`; el segundo sigue igual, porque la reserva se comprueba antes que el motivo. El cambio de contrato de `cancelar` está en el ADDED de la spec, no en un MODIFIED.
7. **Riesgo alto**: ninguno. **Coste estimado**: ~1 h, sin despachar subagentes.
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: en `src/app.js`, `cancelBooking` recibe el motivo, lo valida contra una constante `CANCEL_REASONS` y lo guarda en `booking.reason`; `run` extrae `--motivo` de los parámetros y añade el comando `canceladas`, que filtra `bookings` por `status === 'cancelled'`. Sin ficheros nuevos ni dependencias: el proyecto es un solo fichero de entrada.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo fichero: sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `<sala> <día> — <motivo>` (raya larga con un espacio a cada lado).
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); clean code. Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).
- Tests antes que código (constitution, art. 2).

### De proceso

- Native: la sesión implementa las dos tasks; luego la revisión final de `sdd-verify` sobre toda la rama.
- Un commit por task al quedar limpia su revisión, en castellano, con la atribución que fija el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "inventado"` → mismo aviso y la reserva sigue activa (un `libres` posterior sigue sin contar Norte en esa franja) · Task 1, `un motivo inválido no cancela la reserva`
- `cancelar Sur mar --motivo "otro"` (sin reserva) → «sin reserva Sur mar», como hoy · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí, una constante y dos ramas en `run`; sin abstracciones.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `libres`, `anular` y `reservar` no cambian; el patrón del módulo (funciones exportadas + `run`) se respeta; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, texto en castellano, gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledBookings()` y las dos ramas de `run` (`--motivo` en `cancelar`, comando `canceladas`).
- `test/cancel.test.js` — tests de los dos escenarios; el test de cancelar una reserva activa pasa a llevar `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `freeRooms` y `findBooking` — ya ignoran lo que no está `active`.

### 1.2 Modelo de datos

La reserva cancelada guarda `reason` (string de la lista). Las reservas viven en memoria: sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comando `cancelar <sala> <día> --motivo <motivo>` y comando nuevo `canceladas`, con las respuestas de «Restricciones globales».

### 1.5 UX

No aplica: línea de comandos.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Quien llame a `cancelar` sin `--motivo` recibe ahora un aviso | Media | Bajo | Es lo que pide la spec; decisión 3 |
| `--motivo` al final sin valor (`cancelar Norte lun --motivo`) | Baja | Bajo | El valor es `undefined`, no está en la lista: mismo aviso |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la propia sesión (Native), Sonnet con effort medium
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "inventado"` ve «motivo no válido: cambio de planes, sala ocupada, otro»

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js` (sin cambios).
- Produce: `booking.reason` en la reserva cancelada (string de `CANCEL_REASONS`), que lee la Task 2; `export function cancelBooking(room, day, reason)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, conservando `import { run }`:
  - `cancelar una reserva activa` (existente) pasa a `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` (existente) no cambia: `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  - `un motivo fuera de la lista se rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'inventado'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo inválido no cancela la reserva`: tras el rechazo anterior, `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo aviso, y `libres` sigue → `'Sur'`.
  Los tests de un fichero comparten el estado en memoria: la cancelación válida (`cancelar una reserva activa`) va la última de las de cancelar, después de los rechazos, que no consumen la reserva.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los tests de motivo.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; si `!CANCEL_REASONS.includes(reason)` → `motivo no válido: ${CANCEL_REASONS.join(', ')}`; si no, `booking.status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`.
  - En `run`, la rama `cancelar` obtiene el motivo como el parámetro que sigue a `--motivo` (`params[params.indexOf('--motivo') + 1]`, `undefined` si no hay) y lo pasa a `cancelBooking`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la propia sesión (Native), Sonnet con effort medium
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela Norte lun con «sala ocupada», ejecuta `canceladas` y ve «Norte lun — sala ocupada»

**Interfaces**:
- Consume: `booking.reason` y `booking.status === 'cancelled'` de la Task 1.
- Produce: comando `canceladas`; `function cancelledBookings()` (interna) que devuelve el texto.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js` (estado en memoria compartido por el fichero: una sola reserva activa, Norte lun):
  - `canceladas sin canceladas`: `run('canceladas', [])` → `'sin canceladas'`. Va antes de `cancelar una reserva activa`, que es la que cancela Norte lun.
  - `canceladas enseña el motivo`: después de `cancelar una reserva activa`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los dos tests nuevos (hoy `canceladas` responde `salas`).
- [ ] **Step 3: Implementación** en `src/app.js`: `cancelledBookings()` filtra `bookings` por `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}` y une con `\n`; sin ninguna devuelve `sin canceladas`. En `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias; sin referencia de estimation-log todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo» · AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo fuera de la lista se rechaza`. ✓
- ADDED «El listado de canceladas» · THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo, motivo inválido, sin reserva → Task 1 (`cancelar sin motivo no cancela`, `un motivo inválido no cancela la reserva`, `cancelar sin reserva lo dice`); sin canceladas y anuladas → Task 2 (`canceladas sin canceladas`). ✓
