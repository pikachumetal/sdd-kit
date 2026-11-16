---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la propia sesión implementa las dos tasks en gama media (Sonnet, effort medium): el plan trae firmas, valores y tests. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo` (la spec lo calla)**: el motivo es obligatorio, porque la Intent pide «el motivo de cada cancelación». Sin `--motivo`, o con `--motivo` sin valor, responde igual que un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». Consecuencia: el test existente `cancelar una reserva activa` (`cancelar Norte lun` sin motivo) deja de ser válido y la Task 1 lo reescribe con `--motivo "cambio de planes"`. Si prefieres retrocompatibilidad (motivo opcional), dímelo antes de la Task 1.
4. **Orden de validación**: se valida el motivo antes de buscar la reserva; `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva…». La spec no lo fija.
5. **`canceladas` sin ninguna cancelada (la spec lo calla)**: responde «sin canceladas». Lista solo las de estado `cancelled`; las `voided` (anulaciones, feature 0011) no entran, por el Scope.
6. **Varias canceladas**: una línea por reserva, unidas con salto de línea, con el formato `<sala> <día> — <motivo>`.
7. **Datos**: el motivo se guarda en `booking.reason` de la reserva cancelada (Approach de la spec). Sin persistencia: `bookings` es un array en memoria, como hoy.
8. **Tasks**: 2, en orden (`reason` lo produce la Task 1 y lo consume la Task 2). Un revisor podría aprobar el motivo y rechazar el listado.
9. **Gate de cierre**: `node --test` entero en verde (constitution, art. 2); `operations.md` no existe.
10. **Coste estimado**: ~1,5 h en total, sin despachos: una sola sesión.
11. **Spec sin capacidad previa**: no existe `capabilities/`; `bookings` nace con el merge del delta al cerrar (`sdd-archive`).

Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: dos cambios en `src/app.js`: `cancelBooking` valida y guarda el motivo en la reserva, y una función nueva `cancelledBookings` formatea el listado; `run` enruta `--motivo` y el comando `canceladas`. Sin módulos ni dependencias nuevas.

**Tech Stack**: Node 22, sin dependencias externas, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el fichero único `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Respuesta de éxito: `cancelada <sala> <día> (<motivo>)`. Respuesta de motivo inválido: `motivo no válido: cambio de planes, sala ocupada, otro`. Listado: `<sala> <día> — <motivo>` (raya larga con espacios).
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas, sin duplicar la lista de motivos.
- Sin dependencias externas; el código vive en `src/app.js` y los tests en `test/cancel.test.js`.

### De proceso

- Native: la sesión implementa cada task con TDD (RED visto fallar antes del código); el gate completo corre una vez, en §3.
- No usar `fable` ni `opus xhigh` en ninguna task.
- Commits: uno por task al quedar limpia su revisión, en castellano, referenciando la 0010 y con la línea de atribución que fija el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo «motivo no válido…» · Task 1, `cancelar con --motivo sin valor no cancela`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar», sin tocar nada · Task 1, `cancelar sin reserva lo dice` (reescrito con motivo)
- `canceladas` sin ninguna cancelada → «sin canceladas»; una reserva anulada con `anular` no aparece · Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y una función de listado; nada más.
- [x] **YAGNI gate**: la lista de motivos es una constante con un solo uso de validación y otro de mensaje; sin abstracciones.
- [x] **Brownfield gate**: respeta el patrón de `src/app.js`; sin refactor fuera de scope. No es retrocompatible en `cancelar` sin motivo, y es intencionado (decisión 3).
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), carril y ramas conforme a los artículos 1 y 3.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; `cancelledBookings()` nueva; `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de motivo y listado; reescribe los dos tests existentes de `cancelar` para llevar `--motivo`.

**NO se tocan**:

- `test/app.test.js` — no cubre `cancelar`.
- `voidBooking` y el comando `anular` — fuera de Scope (feature 0011).
- `scripts/lint.mjs`, `package.json` — sin cambios de herramientas.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` (uno de la lista). En memoria; sin schema.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica. El contrato es la línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica: salida de texto de la CLI.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Que el dev-lead quisiera el motivo opcional | Media | Medio: hay que revertir el test reescrito | Decisión 3 visible arriba; el cambio es una línea |
| `--motivo` en otra posición de los argumentos | Baja | Bajo | Se busca el flag con `indexOf`, no por posición fija |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona que reserva ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "aburrimiento"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` de `src/app.js` (devuelve la reserva `active` o `undefined`).
- Produce: `resetBookings()` (restaura el estado inicial, para los tests); `cancelBooking(room, day, reason)` → string; deja `booking.status = 'cancelled'` y `booking.reason = reason`. `run('cancelar', params)` lee el valor que sigue a `--motivo` en `params`. La constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']` la usa también el mensaje de error.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `run` importado de `../src/app.js`:
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mensaje de motivo no válido, y después `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `'cancelada Norte lun (otro)'` (la reserva seguía activa).
  - `cancelar con --motivo sin valor no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mensaje de motivo no válido.
  - Reescribe `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada'])` → `'sin reserva Sur mar'`.
  - Elimina `cancelar una reserva activa`: lo cubre `cancelar con motivo de la lista`.
  - Las reservas son estado compartido en memoria: los tests llaman a `resetBookings()` en `beforeEach` para tener Norte lun activa en cada uno.
  - Ejecuta y comprueba que fallan (RED).
- [ ] **Step 2: Implementación** — en `src/app.js`:
  - `export function resetBookings()` — restaura `bookings` al estado inicial (la reserva de Norte lun, 10:00-12:00, `active`).
  - `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.
  - `export function cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` → `` `motivo no válido: ${REASONS.join(', ')}` ``; después, sin reserva → `` `sin reserva ${room} ${day}` ``; si no, `status = 'cancelled'`, `reason`, y `` `cancelada ${room} ${day} (${reason})` ``.
  - En `run`: `const i = params.indexOf('--motivo'); const reason = i === -1 ? undefined : params[i + 1];` y `cancelBooking(params[0], params[1], reason)`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión: `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona que reserva cancela Norte lun con «sala ocupada», ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.status` y `booking.reason` que deja `cancelBooking` (Task 1); `resetBookings()` para los tests; `voidBooking(room, day)` existente para el test de anuladas.
- Produce: `cancelledBookings()` → string: una línea `` `${room} ${day} — ${reason}` `` por reserva con `status === 'cancelled'`, unidas con `'\n'`; sin ninguna, `'sin canceladas'`. `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `resetBookings()` en `beforeEach`:
  - `canceladas enseña el motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` y `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas lo dice`: `run('canceladas', [])` → `'sin canceladas'`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])` y `run('canceladas', [])` → `'sin canceladas'`.
  - Ejecuta y comprueba que fallan (RED).
- [ ] **Step 2: Implementación** — en `src/app.js`: `export function cancelledBookings()` según Interfaces, y en `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks pequeñas en un único fichero, sin dependencias; incertidumbre baja (decisiones 3-5 sin fijar por la spec); sin referencia en `estimation-log` aún
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; `operations.md` no existe)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde «cancelada Norte lun (sala ocupada)»» → Task 1, `cancelar con motivo de la lista`. ✓
- AND «un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»» → Task 1, `cancelar con motivo fuera de la lista`. ✓
- THEN «`canceladas` responde «Norte lun — sala ocupada»» → Task 2, `canceladas enseña el motivo`. ✓
- Scope «no entra: anulaciones del responsable» → Task 2, `canceladas no lista las anuladas`. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; flag sin valor → Task 1, `cancelar con --motivo sin valor no cancela`; sin reserva → Task 1, `cancelar sin reserva lo dice`; sin canceladas y anuladas → Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`. ✓
