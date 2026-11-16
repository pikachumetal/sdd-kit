---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-14
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task** — las dos tasks en `sonnet` con effort medium (Native, en la sesión): cada una es un cambio de pocas líneas en `src/app.js` con los tests ya escritos. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución** — Native, porque son 2 tasks encadenadas por una sola interfaz (`cancelBooking` guarda `reason`, `listCancelled` la lee), un error lo caza el test de su task y el plan cabe en un contexto.
3. **`zod` contradice `tech-stack.md`** — la spec aprobada (Approach) fija `zod` como dependencia nueva en `dependencies`, y `tech-stack.md` dice «Node 22, sin dependencias externas». Sigo la spec y la Task 1 actualiza esa línea de `tech-stack.md`; si el dev-lead prefiere no tener dependencias, la validación es un `includes` sobre la lista y cambia la spec, no el plan.
4. **Sin `--motivo` → «motivo no válido: …»** — la spec dice que cancelar «pide un motivo» pero no qué responde sin él. Trato la ausencia como motivo fuera de la lista (mismo mensaje). Pide enmienda de la spec si no es lo que se quiere.
5. **El motivo se valida antes de buscar la reserva** — así un motivo inválido responde igual exista o no la reserva, y su test no depende del estado en memoria que dejan otros tests.
6. **Listado vacío → «sin canceladas»** — la spec no fija este texto; sigue el patrón de «sin reserva …». Pide enmienda de la spec si no es lo que se quiere.
7. **Tests existentes** — `cancelar una reserva activa` y `cancelar sin reserva lo dice` llaman a `cancelar` sin `--motivo`; con la spec dejan de ser válidos y se reescriben en la Task 1.
8. **Coste** — ~1,5 h; sin subagentes salvo el revisor final (un contexto, orden de magnitud de 1 $).

Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar una reserva exige un motivo de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida `reason` con un esquema `zod` (`z.enum`), lo guarda en la reserva y `listCancelled()` lee las de estado `cancelled`. El parseo de `--motivo` vive en `run`, como el de `--cada-semana`.

**Tech Stack**: Node ≥ 20 (ESM), un solo fichero `src/app.js`, tests con `node --test`; `zod` como única dependencia.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por la interfaz de la reserva cancelada, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Node ≥ 20, ESM (`"type": "module"`); el motivo se valida con `zod`, dependencia en `dependencies` de `package.json`.
- Lista de motivos, exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `<sala> <día> — <motivo>` (raya larga con un espacio a cada lado).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.

### De proceso

- Tests antes que código (Constitución, art. 2).
- Git-flow: rama `feature/0010-cancel-reason`; commits de task referenciando `0010`.
- Texto de la interfaz y de los documentos en castellano.
- Atribución de commits: la línea `Co-Authored-By` que fija el proyecto.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro` · Task 1, `cancelar sin motivo no es válido`
- Motivo fuera de la lista sobre una reserva que no existe (`cancelar Sur mar --motivo vacaciones`) → `motivo no válido: …`, no `sin reserva` · Task 1, `motivo no válido se comprueba antes que la reserva`
- Motivo con otra capitalización (`Sala ocupada`) → no válido, la lista es exacta · Task 1, mismo test que el anterior, segundo assert
- `canceladas` sin ninguna reserva cancelada → `sin canceladas`, no una línea vacía · Task 2, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función nueva (`listCancelled`) y un parámetro más en `cancelBooking`; nada más.
- [x] **YAGNI gate**: sin módulo de motivos ni abstracción; la lista vive en el esquema.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` ahora exige motivo); sigue el patrón de `run` y sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, gate de cierre completo, git-flow y castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `package-lock.json` — lo genera `npm install zod`.

**Modificar**:

- `src/app.js` — esquema del motivo, `cancelBooking(room, day, reason)`, `listCancelled()` y los comandos `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — tests del motivo y del listado.
- `package.json` — `dependencies.zod`.
- `.docs/sdd/tech-stack.md` — la línea «sin dependencias externas» pasa a decir que `zod` valida el motivo.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable de sala son la 0011.
- `test/app.test.js` — no toca `cancelar`.
- `scripts/lint.mjs` — sin cambios; el gate lo corre tal cual.

### 1.2 Modelo de datos

La reserva en memoria gana `reason` (string) al cancelarse; las reservas activas no lo llevan.

### 1.3 Migraciones

No aplica: las reservas viven en memoria.

### 1.4 Contratos API

No aplica: CLI (`node src/app.js <comando> <argumentos>`).

### 1.5 UX

No aplica: sin pantallas.

### 1.6 Dependencias

`zod` (última versión estable de la serie 3 o 4 que instale `npm install zod`), en `dependencies`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install` sin red o el registro no responde | Baja | Medio | Se ve en el Step 1 de la Task 1; sin `zod` no se sigue y se avisa |
| Estado compartido en memoria entre tests del mismo fichero | Media | Bajo | Orden de los tests fijado en las tasks; el motivo inválido no depende de la reserva |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native lo hace la sesión, en gama media)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend · tooling · docs
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo vacaciones` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada
- Produce: `cancelBooking(room: string, day: string, reason: string): string` — guarda `booking.reason = reason` al pasar a `cancelled`; `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/tech-stack.md`; crear `package-lock.json`

- [ ] **Step 1: Dependencia** — `npm install zod` (añade `dependencies.zod` y `package-lock.json`). En `.docs/sdd/tech-stack.md`, la línea «Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.» pasa a «Node 22; `zod` valida el motivo de cancelación, sin otras dependencias externas. Un solo fichero de entrada: `src/app.js`.».
- [ ] **Step 2: Tests RED** — en `test/cancel.test.js`, reemplaza los dos tests existentes por estos, en este orden (el estado en memoria se comparte en el fichero y la reserva de Norte lun se cancela una sola vez):
  - `cancelar sin motivo no es válido`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `motivo no válido se comprueba antes que la reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'vacaciones'])` y `run('cancelar', ['Norte', 'lun', '--motivo', 'Sala ocupada'])` → ambos `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  Ejecuta `node --test test/cancel.test.js` y comprueba que falla.
- [ ] **Step 3: Implementación** — en `src/app.js`: `import { z } from 'zod'`; `const cancelReason = z.enum(['cambio de planes', 'sala ocupada', 'otro'])`; `cancelBooking(room, day, reason)` valida con `cancelReason.safeParse(reason)` antes de buscar la reserva y devuelve `motivo no válido: cambio de planes, sala ocupada, otro` si falla; si pasa y hay reserva, guarda `booking.reason` y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` (que es `undefined` sin la opción).
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: 4 tests en verde.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native lo hace la sesión, en gama media)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona ejecuta `canceladas` y ve `Norte lun — sala ocupada`.

**Interfaces**:
- Consume: `booking.reason` y `booking.status === 'cancelled'` que deja `cancelBooking` (Task 1).
- Produce: `listCancelled(): string` — una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`; `'sin canceladas'` si no hay ninguna. `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, el test `canceladas sin canceladas` va el primero del fichero (antes de cualquier cancelación): `run('canceladas', [])` → `'sin canceladas'`; y `canceladas enseña el motivo` va el último, tras `cancelar con motivo de la lista`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`. Ejecuta `node --test test/cancel.test.js` y comprueba que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'` y formatea con `${room} ${day} — ${reason}`; `run` la devuelve para `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: 6 tests en verde.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; la incertidumbre es la instalación de `zod` y el estado compartido entre tests; sin referencia en el estimation-log (sin calibración todavía).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN responde «cancelada Norte lun (sala ocupada)») → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar pide un motivo de la lista» (AND motivo fuera de la lista responde «motivo no válido: …») → Task 1, `motivo no válido se comprueba antes que la reserva`. ✓
- ADDED «El listado de canceladas enseña el motivo» (THEN responde «Norte lun — sala ocupada») → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin `--motivo` → Task 1, `cancelar sin motivo no es válido`; motivo inválido sin reserva y capitalización → Task 1, `motivo no válido se comprueba antes que la reserva`; listado vacío → Task 2, `canceladas sin canceladas`. ✓
