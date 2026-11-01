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

1. **Modelo y effort por task**: Task 1 y Task 2, Sonnet con effort medium — el plan lleva firmas, mensajes y asserts; no hay prosa que interpretar. La revisión final de rama no sigue esta política: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`zod` choca con `tech-stack.md`**: la spec aprobada fija `zod` (dependencia nueva en `dependencies`), pero `tech-stack.md` dice «sin dependencias externas». La Task 1 actualiza esa línea para que el documento no mienta; la dependencia no se discute aquí.
4. **Sin `.gitignore`** en el repo: la Task 1 lo crea con `node_modules/` antes de instalar `zod`, para que `node_modules` no entre en el commit. `package-lock.json` sí se commitea.
5. **Lo que la spec calla y el plan fija** (observable, ver Review Focus): cancelar sin `--motivo`, o con `--motivo` sin valor, responde igual que un motivo fuera de la lista; el motivo se valida antes de buscar la reserva; la lista es exacta (`Sala ocupada` no vale); `canceladas` sin canceladas responde vacío, como `libres` cuando no queda sala; solo salen las de estado cancelada, no las anuladas.
6. **Tests con estado compartido**: `bookings` vive en memoria y hay una sola reserva (Norte lun), así que un solo test puede cancelarla. Los tests de `cancel.test.js` se escriben en el orden indicado y todos usan «sala ocupada».
7. **Riesgo alto**: `npm install zod` necesita red. Sin ella la Task 1 se para; no se sustituye `zod` por otra cosa.
8. **Coste estimado**: 1,5 h de implementación, 2 tasks; sin despacho de subagentes en las tasks.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` gana `REASONS` (la lista), un esquema `zod` que la valida y el campo `reason` de la reserva cancelada; `cancelBooking` recibe el motivo y `run` extrae `--motivo` de los parámetros. `canceladas` es un comando más de `run` que filtra por estado.

**Tech Stack**: Node 22, `node --test`; `zod` como única dependencia.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json`

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · línea de `canceladas`: `<sala> <día> — <motivo>` (raya larga con espacios).
- `zod` va en `dependencies` de `package.json`, no en `devDependencies`.
- Texto de la interfaz y de los documentos en castellano (constitución, Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.

### De proceso

- Política de modelos: Sonnet con effort medium para las tasks; `fable` y `opus xhigh` prohibidos salvo justificación escrita.
- Modo de ejecución: native.
- Commits: uno por task, en castellano, con `feat:`/`docs:` y referencia a la 0010; cada commit termina con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro`, y la reserva sigue activa · Task 1, `cancelar sin motivo`
- `cancelar Norte lun --motivo` (sin valor) → el mismo mensaje · Task 1, `cancelar con --motivo sin valor`
- `--motivo "Sala ocupada"` (otras mayúsculas) → el mismo mensaje, la lista es exacta · Task 1, `motivo fuera de la lista` (segundo assert)
- `cancelar Sur mar --motivo roto` (sin reserva y motivo malo) → `motivo no válido: …`, no `sin reserva` · Task 1, `el motivo se valida antes que la reserva`
- `canceladas` sin ninguna cancelada → respuesta vacía, no un error · Task 2, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks, cambios en un solo fichero de código; sin capa nueva.
- [x] **YAGNI gate**: `REASONS` y el esquema tienen un uso cada uno; no se abstrae nada más.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec pide (cancelar ahora exige motivo; los dos tests existentes de `cancelar` se actualizan); `anular` y `libres` no se tocan.
- [x] **Constitution check**: tests antes que código (1, 2); gate de cierre `node --test` entero (2); flujo SDD (1); castellano (4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — `node_modules/`.
- `package-lock.json` — lo genera `npm install zod`.

**Modificar**:

- `src/app.js` — `REASONS`, esquema `zod`, `cancelBooking(room, day, reason)`, extracción de `--motivo`, comando `canceladas`.
- `test/cancel.test.js` — escenarios de la spec y los de Review Focus.
- `package.json` — `dependencies.zod`.
- `.docs/sdd/tech-stack.md` — la línea «sin dependencias externas» pasa a nombrar `zod` y para qué.

**NO se tocan**:

- `src/app.js`: `voidBooking`, `freeRooms`, el comando `anular` — son de la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian (otro proceso, otro estado).
- `scripts/lint.mjs` — solo mira tabuladores en `src/app.js`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` (uno de `REASONS`); las activas y anuladas no lo tienen.

### 1.3–1.5

No aplican (sin migraciones, API ni UX más allá de la salida de la terminal).

### 1.6 Dependencias

`zod` (última estable que resuelva `npm install zod`), en `dependencies`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Sin red para `npm install zod` | Baja | Alto | La Task 1 se para y lo dice; no se cambia de librería sin enmienda |
| Estado en memoria compartido entre tests | Media | Medio | Orden de tests fijado en las tasks; todos cancelan con «sala ocupada» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: Native: hilo principal, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend · tooling (`package.json`, `.gitignore`) · docs (`tech-stack.md`)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo vacaciones` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: `cancelBooking(room, day)` y `findBooking(room, day)` de `src/app.js` tal como están; `run(cmd, params)` con `params` como array de argumentos ya separados.
- Produce: `export const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `export function cancelBooking(room, day, reason)` → `string`, que guarda `booking.reason = reason`; `run('cancelar', [room, day, '--motivo', motivo])`. Las reservas canceladas tienen `status: 'cancelled'` y `reason`.

**Ficheros**: crear `.gitignore`; modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `package-lock.json`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Tests RED** — reemplaza el contenido de `test/cancel.test.js` por estos tests, en este orden (la Task 2 añade los suyos):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones']), INVALIDO);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'Sala ocupada']), INVALIDO);
});

test('cancelar sin motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALIDO);
});

test('cancelar con --motivo sin valor', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), INVALIDO);
});

test('el motivo se valida antes que la reserva', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'roto']), INVALIDO);
});

test('cancelar con motivo de la lista', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
```

  Ejecuta `node --test test/cancel.test.js` y comprueba que falla (`ℹ fail` > 0).
- [ ] **Step 2: Implementación** — crea `.gitignore` con `node_modules/`; ejecuta `npm install zod`; en `src/app.js` añade `import { z } from 'zod';` al principio, `export const REASONS` y `const reasonSchema = z.enum(REASONS)`; cambia `cancelBooking(room, day, reason)` para guardar `booking.reason = reason` y responder `` `cancelada ${room} ${day} (${reason})` ``; en `run`, el comando `cancelar` lee el valor que sigue a `--motivo` en `params` (`undefined` si no está o no tiene valor), valida con `reasonSchema.safeParse` **antes** de buscar la reserva y, si falla, responde `` `motivo no válido: ${REASONS.join(', ')}` ``. En `.docs/sdd/tech-stack.md`, sustituye «sin dependencias externas» por la única dependencia `zod`, para validar el motivo de cancelar.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`; `git status` no muestra `node_modules`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`, con `package.json`, `package-lock.json`, `.gitignore`, `tech-stack.md`, `src/app.js` y el test.

### Task 2 — Listado de canceladas con su motivo

**Tras**: Task 1
**Modelo**: Native: hilo principal, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no por terminal: las reservas viven en memoria y cada `node src/app.js …` es un proceso nuevo, así que `canceladas` en una ejecución aparte responde vacío. Se comprueba con el test `canceladas enseña el motivo`, que cancela y lista en el mismo proceso.

**Interfaces**:
- Consume: de la Task 1, las reservas con `status: 'cancelled'` y `reason`; el array `bookings` de `src/app.js`.
- Produce: `export function cancelledBookings()` → `string`, una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`, y `''` si no hay ninguna; `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, añade al **principio** (antes de cualquier cancelación, porque el estado es compartido) y al **final** del fichero:

```js
test('canceladas sin canceladas responde vacío', () => {
  assert.equal(run('canceladas', []), '');
});
```

```js
test('canceladas enseña el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
```

  Ejecuta `node --test test/cancel.test.js` y comprueba que fallan los dos (`run` devuelve `'salas'`).
- [ ] **Step 2: Implementación** — en `src/app.js`, `cancelledBookings()` filtra `bookings` por `status === 'cancelled'`, formatea cada una como `` `${b.room} ${b.day} — ${b.reason}` `` y une con `'\n'`; `run` la devuelve para `canceladas`. Las reservas anuladas no salen.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas lista el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75 h (aproximado)
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks en un solo fichero de código; la incertidumbre es `npm install` y el estado compartido de los tests; sin `estimation-log.md` que calibre
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista`. ✓
- THEN `canceladas` responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Approach: «el motivo se guarda con la reserva cancelada» → Task 2, el mismo test: el listado lee el motivo guardado, no uno recibido. ✓
- Scope «No entra: anulaciones» → N/A, `voidBooking` y `anular` no se tocan (confirmado en spec). ✓
- Review Focus: sin motivo, `--motivo` sin valor, otras mayúsculas, motivo antes que reserva → Task 1 (cuatro tests); `canceladas` vacío → Task 2. ✓
