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

1. **Modelo y effort**: una sola task, Sonnet con effort medium (`sdd-kit:effort-medium` + `sonnet`); el cambio es una función y un comando en un fichero. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en sdd-kit.json; una task sin interfaces entre tasks que justifique subagentes.
3. **`cancelar` sin `--motivo`, o con `--motivo` sin valor, responde «motivo no válido: cambio de planes, sala ocupada, otro»** y no cancela. La spec solo fija el caso de un motivo fuera de la lista; «cancelar pide un motivo» lo extiende al motivo ausente.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo otro` (sin reserva) responde «sin reserva Sur mar»; un motivo inválido nunca llega a tocar la reserva.
5. **`canceladas` sin ninguna reserva cancelada responde «sin canceladas»** (texto que la spec no fija); con varias, una línea por reserva, en el orden de `bookings`.
6. **Los tests existentes de `cancelar` cambian** (`test/cancel.test.js`): ya no pasan sin motivo, así que pasan `--motivo` y esperan la salida nueva.
7. **Riesgo**: el estado (`bookings`) vive en el módulo y se comparte entre los tests del fichero; el orden de los tests en `test/cancel.test.js` importa y queda fijado en la task.
8. **Coste estimado**: ~0,5 h de implementación, un solo hilo, sin despachos.

Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`booking.reason`) al cancelar; `run` extrae el valor de `--motivo` de los parámetros y se lo pasa a `cancelBooking`. `canceladas` filtra `bookings` por `status === 'cancelled'`.

**Tech Stack**: Node 22 sin dependencias, `src/app.js`, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensaje de motivo inválido, literal: `motivo no válido: cambio de planes, sala ocupada, otro`.
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio y funciones cortas.
- `voidBooking` y el comando `anular` no se tocan (las anulaciones son la 0011).

### De proceso

- Tests antes que código (constitution, art. 2); gate de cierre: `node --test` entero en verde.
- Política de modelos: gama media como suelo; Opus solo en la revisión final de rama.
- Commits en castellano o inglés según el historial (`feat: …`), con la atribución que fije el harness.

## Review Focus

- `cancelar Norte lun` (sin `--motivo`) → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo mensaje de motivo no válido · Task 1, `cancelar con --motivo sin valor`
- `cancelar Sur mar --motivo otro` (no hay reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva dice sin reserva`
- `canceladas` sin ninguna cancelada → «sin canceladas», no una cadena vacía · Task 1, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un filtro; sin módulos nuevos.
- [x] **YAGNI gate**: la lista de motivos es una constante usada por la validación y por el mensaje; nada más se abstrae.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); respeta el fichero único `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), git-flow en `feature/0010-cancel-reason` (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; `listCancelled()` nueva; `run` enruta `canceladas` y extrae `--motivo`.
- `test/cancel.test.js` — tests actualizados y nuevos.

**NO se tocan**:

- `voidBooking`, comando `anular` — fuera de scope (0011).
- `test/app.test.js`, `scripts/lint.mjs` — no afectados.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Sin persistencia: los datos viven en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

Solo salida de texto, la de los escenarios de la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests del fichero | Media | Bajo | Orden de tests fijado en la task |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: effort medium, sonnet (`subagent_type: sdd-kit:effort-medium` + `model: sonnet`); en Native lo hace el hilo principal de la sesión.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test` (sale con código distinto de 0 si algo falla)
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con otro motivo ve «motivo no válido: cambio de planes, sala ocupada, otro». `canceladas` se prueba por `run`, porque el estado es en memoria y cada ejecución de la CLI parte de cero.

**Interfaces**:
- Consume: `bookings` (`{ room, day, slot, status }`), `findBooking(room, day)` y `run(cmd, params)` de `src/app.js`.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`; `listCancelled(): string`; `run('canceladas', [])` → `listCancelled()`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (comparten el estado del módulo; la reserva Norte lun se cancela en el penúltimo):
  1. `canceladas sin canceladas`: `run('canceladas', [])` → `'sin canceladas'`
  2. `cancelar sin reserva dice sin reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`
  3. `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  4. `cancelar con --motivo sin valor`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo mensaje
  5. `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → el mismo mensaje
  6. `cancelar con motivo de la lista` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`
  7. `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`

  Borrar `cancelar sin reserva lo dice` (queda cubierto por el 2).
- [ ] **Step 2: Verificar RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests 1 y 3 a 7; el 2 pasa por casualidad con el comportamiento actual.
- [ ] **Step 3: Implementación** en `src/app.js`: constante `reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `motivo no válido: ${reasons.join(', ')}` si `reason` no está en `reasons` (antes de buscar la reserva), y si no, el comportamiento actual con `booking.reason = reason` y salida `cancelada ${room} ${day} (${reason})`; `listCancelled()` devuelve las reservas con `status === 'cancelled'` como `${room} ${day} — ${reason}` unidas por `\n`, o `sin canceladas` si no hay; en `run`, `cancelar` toma `reason` como el elemento que sigue a `--motivo` (`undefined` si falta) y `canceladas` llama a `listCancelled()`.
- [ ] **Step 4: Verificación** — `node --test` entero y `node scripts/lint.mjs`. Esperado: todos los tests en verde, «lint: sin hallazgos».
- [ ] **Step 5: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 1 task, un fichero de código y uno de tests, sin migración ni UI; incertidumbre baja (estado compartido entre tests)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero y `node scripts/lint.mjs`
- [ ] Verificación de los escenarios de la spec: «Cancelar pide un motivo de la lista» y «El listado de canceladas enseña el motivo»
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (respuesta con motivo y mensaje de motivo no válido) → Task 1, tests 5 y 6. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test 7. ✓
- Fuera de scope: anulaciones del responsable de sala (0011) → N/A, `voidBooking` no se toca. ✓
- Review Focus: sin `--motivo` → Task 1, test 3; `--motivo` sin valor → test 4; sin reserva con motivo → test 2; sin canceladas → test 1. ✓
