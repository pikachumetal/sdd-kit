---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Una sola task, Sonnet con effort medium** — dos escenarios en un único fichero (`src/app.js`) y el segundo depende del primero (el motivo guardado); partirlas no daría dos entregas que un revisor pudiera aprobar por separado.
2. **Ejecución: native**, fijado en `sdd-kit.json`. Con una sola task no se ofrece parar antes de la Task 1 para cambiar de modelo.
3. **`cancelar` sin `--motivo`, o con `--motivo` sin valor, responde el mismo «motivo no válido: cambio de planes, sala ocupada, otro»** — la spec dice que cancelar «pide» un motivo y solo fija la respuesta a uno fuera de la lista.
4. **Primero se busca la reserva y después se valida el motivo** — así `cancelar Sur mar` (sin reserva) sigue respondiendo «sin reserva Sur mar», como en el test existente.
5. **El test existente `cancelar una reserva activa` cambia** — hoy llama a `cancelar` sin motivo y con la decisión 3 pasaría a ser inválido; pasa a llevar `--motivo "sala ocupada"` y a esperar «cancelada Norte lun (sala ocupada)».
6. **`canceladas` sin ninguna cancelada responde «sin canceladas»**, y con varias, una línea por reserva en orden de reserva. Solo cuenta el estado `cancelled`, no `voided` (las anulaciones son de la 0011).
7. **Coste estimado**: 1 h; sin subagentes salvo la revisión final de rama.
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` guarda un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status`. `cancelBooking(room, day, reason)` valida el motivo contra una constante `CANCEL_REASONS`; `run` extrae `--motivo` de los parámetros y un nuevo `cancelledBookings()` alimenta el comando `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node:test`; un único fichero de entrada, `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (guion largo `—`).
- Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (`scripts/lint.mjs` falla si los hay).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo propósito.

### De proceso

- Tests antes que código (constitution, art. 2). Gate de cierre: `node --test` entero en verde.
- Commits en castellano, convención `feat:` / `test:`, referenciando la 0010; sin `--no-verify`.
- Los commits terminan con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (sin valor) → mismo mensaje, no «cancelada … (undefined)» · Task 1, `cancelar con --motivo sin valor es motivo no válido`
- `canceladas` sin ninguna cancelada → «sin canceladas», no una línea en blanco · Task 1, `canceladas sin canceladas lo dice`
- `canceladas` tras `anular` → la reserva anulada no aparece · Task 1, `canceladas no lista las anuladas` (en `test/cancel-void.test.js`)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason`, una constante y un comando; sin módulos nuevos.
- [x] **YAGNI gate**: no se abstrae nada; la lista de motivos es una constante usada en dos sitios.
- [x] **Brownfield gate**: retrocompatible salvo el test de `cancelar` que la spec cambia (decisión 5); sigue el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancel-void.test.js` — comprobar que `canceladas` no lista las anuladas, con estado de módulo limpio.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, `cancelledBookings`, y los comandos `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — tests del motivo y del listado; ajuste del test existente.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable son la 0011.
- `scripts/lint.mjs`, `package.json` — sin cambios de tooling.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`, solo presente cuando `status === 'cancelled'`. Datos en memoria; sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica: salida de texto.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper el test existente de `cancelar` sin motivo | alta | bajo | Se ajusta a propósito (decisión 5) |
| `--motivo` sin valor produce «undefined» | media | medio | Test en Review Focus |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar las canceladas

**Tras**: —
**Modelo**: Sonnet con effort medium, en la propia sesión (Native; sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de la implementación y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling
**Verificación**: `node --test` (sale con código distinto de 0 si algo falla) y `node scripts/lint.mjs`
**Se prueba en la aplicación**: quien opera ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `node src/app.js canceladas` en la misma ejecución lo lista como «Norte lun — sala ocupada». Al ser los datos en memoria, el listado entre ejecuciones se prueba con `run()` en los tests.

**Interfaces**:
- Consume: nada nuevo; parte de `bookings`, `findBooking(room, day)` y `run(cmd, params)` de `src/app.js`.
- Produce: `export function cancelBooking(room: string, day: string, reason?: string): string`, `export function cancelledBookings(): string`, y los comandos de `run`: `cancelar <sala> <día> [--motivo <motivo>]`, `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancel-void.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. `bookings` es estado de módulo y solo hay una reserva activa (Norte lun): los tests corren en este orden y solo el penúltimo la cancela. Tests, con sus asserts:
  - `cancelar sin reserva lo dice` (sin cambios): `run('cancelar', ['Sur', 'mar'])` es `'sin reserva Sur mar'`.
  - `canceladas sin canceladas lo dice`: `run('canceladas', [])` es `'sin canceladas'`.
  - `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` es ese mismo mensaje y `run('libres', ['10:00-12:00'])` sigue sin incluir `Norte`.
  - `cancelar con --motivo sin valor es motivo no válido`: `run('cancelar', ['Norte', 'lun', '--motivo'])` es ese mismo mensaje.
  - `cancelar una reserva activa` (ajustado): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`.
  - `el listado de canceladas enseña el motivo`: `run('canceladas', [])` es `'Norte lun — sala ocupada'`.

  Y en `test/cancel-void.test.js` (fichero aparte para tener estado limpio), `canceladas no lista las anuladas`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` es `'sin canceladas'`.
- [ ] **Step 2: Ver los tests en rojo** — `node --test test/cancel.test.js`. Esperado: FAIL en los tests nuevos y en el ajustado; los de «sin reserva» siguen verdes.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.
  - `cancelBooking(room, day, reason)`: primero `findBooking` (sin reserva → `sin reserva ${room} ${day}`); después, si `reason` no está en `CANCEL_REASONS`, devuelve `motivo no válido: ${CANCEL_REASONS.join(', ')}` sin tocar la reserva; si es válido, pone `status = 'cancelled'`, `reason`, y devuelve `cancelada ${room} ${day} (${reason})`.
  - `cancelledBookings()`: filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}`, une con `\n`; sin ninguna, `'sin canceladas'`.
  - En `run`: `cancelar` lee el motivo con `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está presente (si no, `undefined`); `canceladas` devuelve `cancelledBookings()`.
- [ ] **Step 4: Verificación** — `node --test` y `node scripts/lint.mjs`. Esperado: todo en verde y «lint: sin hallazgos».
- [ ] **Step 5: Commit de la task** — uno solo, con la convención del proyecto: `feat: cancelar pide un motivo y canceladas lo lista (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Base de la estimación: una task, un fichero de código y uno de tests, sin estimation-log previo aplicable
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde y `node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1 (`cancelar una reserva activa`, `cancelar con motivo fuera de la lista`). ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1 (`el listado de canceladas enseña el motivo`). ✓
- Anulaciones del responsable (No entra) → N/A (0011). ✓
- Review Focus: sin motivo, `--motivo` sin valor, listado vacío, anuladas → Task 1, un test cada una. ✓
