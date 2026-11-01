---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Dos tasks, las dos con Sonnet y effort medium (`sdd-kit:effort-medium` + `sonnet` si se despachara): son 15 líneas de un solo fichero y el plan lleva ya el texto exacto. Sin `fable` ni `opus`. La revisión final de rama sigue la política de `sdd-verify`, no esta.
2. Ejecución: native, fijado en `sdd-kit.json`. Dos tasks encadenadas por el mismo fichero y el mismo estado en memoria; un error lo caza el test de su task.
3. El motivo se valida **antes** de buscar la reserva: `cancelar Sur mar --motivo otro` responde «sin reserva Sur mar», y `cancelar Sur mar` sin `--motivo` responde «motivo no válido: …». La spec solo fija el motivo fuera de la lista; un motivo ausente se trata como fuera de la lista.
4. `canceladas` sin ninguna reserva cancelada responde «sin canceladas». La spec no lo dice; sigue el estilo de «sin reserva …».
5. Con varias canceladas, `canceladas` imprime una línea «<sala> <día> — <motivo>» por reserva, en el orden de `bookings`.
6. Los tests de `test/cancel.test.js` comparten el estado en memoria de `src/app.js` y solo hay una reserva (Norte lun): el orden de los tests importa y se fija en el plan (vacío → motivo inválido → cancelada → listado). El test existente «cancelar una reserva activa» se reescribe, porque su `cancelar Norte lun` sin motivo ya no es válido.
7. Sin observar: que una reserva anulada (`voided`) no sale en `canceladas`. Con una sola reserva en los datos no hay forma de probarlo sin reiniciar el estado; lo cubre el filtro `status === 'cancelled'` y lo revisa la revisión final.
8. Coste estimado: 0,75 h de implementación, sin despacho de subagentes.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: Todo en `src/app.js`, que ya concentra los comandos. `cancelBooking` recibe el motivo y lo guarda en `booking.reason`; `run` extrae `--motivo` de los parámetros. `listCancelled` filtra `status === 'cancelled'`.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de dos comandos en un fichero existente, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y su texto exacto, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Mensaje de motivo inválido, literal: `motivo no válido: cambio de planes, sala ocupada, otro`.
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.

### De proceso

- Tests antes que código (constitution, art. 2): cada task escribe sus tests RED antes de implementar.
- Modelo por task: Sonnet con effort medium; sin `fable` ni `opus xhigh`.
- Commits: uno por task, tras su revisión limpia; el mensaje termina con la atribución indicada por la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro`, y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo vacaciones` → motivo no válido, y la reserva sigue activa (un cancelar posterior con motivo válido funciona) · Task 1, `motivo fuera de la lista no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva) → `sin reserva Sur mar` · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no una cadena vacía · Task 2, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un filtro; sin módulos nuevos.
- [x] **YAGNI gate**: la lista de motivos es una constante; sin configuración ni abstracción.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar sin motivo deja de valer); respeta el patrón de `src/app.js`; sin refactor fuera de scope. `voidBooking` y `anular` no se tocan (0011).
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), flujo SDD (art. 1), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)` con validación y guardado, `listCancelled()`, y `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de ambos comandos, en el orden de §2.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable son la 0011.
- `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` (uno de `REASONS`). Las reservas activas no lo llevan.

### 1.3 Migraciones

No aplica: datos en memoria.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica: salida de línea de comandos.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten estado y una reordenación los rompe | Media | Bajo | El orden va fijado en §2; cada test dice de qué estado parte |
| `--motivo` sin valor detrás (`cancelar Norte lun --motivo`) | Baja | Bajo | Se trata como motivo ausente: motivo no válido |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (si se despachara; en native lo hace la sesión)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona que gestiona las salas ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve el motivo no válido.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room: string, day: string, reason: string | undefined): string` (exportada); la reserva cancelada lleva `reason`; `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten estado; solo el último cancela):
  - `cancelar sin reserva lo dice` (existente, con motivo): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo mensaje.
  - `cancelar con motivo de la lista` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` comprueba primero `REASONS.includes(reason)` (si no, el mensaje literal de las restricciones), luego la reserva, guarda `booking.reason = reason` y responde `` `cancelada ${room} ${day} (${reason})` ``; en `run`, el motivo es el valor que sigue a `--motivo` en `params` (`undefined` si falta).
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (si se despachara)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: de la Task 1, las reservas de `bookings` con `status === 'cancelled'` y su `reason`; el orden de los tests de `test/cancel.test.js`, donde el cancelar con motivo ya corrió.
- Produce: `listCancelled(): string` y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin canceladas`, colocado **al principio del fichero**, antes de cualquier cancelación: `run('canceladas', [])` → `'sin canceladas'`.
  - `canceladas enseña el motivo`, colocado **después** de `cancelar con motivo de la lista`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `listCancelled()` en `src/app.js`: filtra `status === 'cancelled'`, una línea `` `${room} ${day} — ${reason}` `` por reserva unidas con salto de línea, y `'sin canceladas'` si no hay; `run('canceladas')` la llama.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,75 h
- Base de la estimación: 2 tasks de unas 15 líneas en un solo fichero, sin dependencias; la incertidumbre es el estado compartido de los tests. Sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; `operations.md` no existe y `tech-stack.md` no declara §Testing)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo de la lista: THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- Cancelar: AND motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela`. ✓
- Listado: THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Que `canceladas` excluye las anuladas → sin observar: una sola reserva en los datos (avisado en las decisiones, punto 7). ⚠
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- `cancelar` sin `--motivo` → Task 1, `cancelar sin motivo no cancela`. ✓
- `cancelar` sin reserva → Task 1, `cancelar sin reserva lo dice`. ✓
- `canceladas` vacío → Task 2, `canceladas sin canceladas`. ✓
