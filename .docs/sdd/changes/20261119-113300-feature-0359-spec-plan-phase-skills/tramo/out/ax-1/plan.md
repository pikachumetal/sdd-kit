---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: ambas tasks con `sdd-kit:effort-medium` + `sonnet` como referencia; en Native las hace la sesión (gama media). Son cambios pequeños sobre un solo fichero.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** (la spec calla): responde lo mismo que un motivo fuera de la lista, «motivo no válido: cambio de planes, sala ocupada, otro», y no cancela nada. Por eso el test existente `cancelar una reserva activa` (que cancelaba sin motivo) se reescribe con `--motivo`. Es coherente con «Cancelar pide un motivo».
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo x` responde «motivo no válido…», no «sin reserva Sur mar». `cancelar Sur mar --motivo "sala ocupada"` sigue respondiendo «sin reserva Sur mar».
5. **Choque con `architecture.md`**: dice «Node 22, sin dependencias externas» y la spec añade `zod` a `dependencies`. La spec ya decidió usar `zod`; el plan lo ejecuta y corrige esa línea de `architecture.md` en la Task 1 (§1.9). Una lista cerrada de tres valores se valida igual con un `includes`; si el dev-lead prefiere cumplir `architecture.md` tal cual, hay que enmendar la spec antes de ejecutar.
6. **`canceladas` solo lista estado `cancelled`**: las `voided` (anular) no salen. Sin reservas canceladas responde cadena vacía, como `libres` sin salas libres. Varias canceladas: una línea cada una, en orden de reserva, separadas por `\n`.
7. **Riesgos altos**: ninguno; la dependencia nueva es el único riesgo (decisión 5).
8. **Coste**: ~1 h de implementación en Native; sin despachos.
9. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
10. **Hueco en la spec**: su lista de decisiones numera 1 y 3 (falta la 2). No cambia el plan; se avisa.
11. **Carpeta**: el plan va junto a la spec, en `.docs/sdd/specs/…`, que es donde este proyecto guarda las suyas.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo con un esquema `zod` (`z.enum`), lo guarda en la reserva (`reason`) al pasarla a `cancelled`, y `listCancelled()` filtra por ese estado. `run` enruta `cancelar --motivo` y `canceladas`. Todo sigue en `src/app.js`, patrón del módulo.

**Tech Stack**: Node >=20 (ESM), `node --test`, `zod` (nueva en `dependencies`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `dependencies` de `package.json`, contra «sin dependencias externas» de `architecture.md`.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- El motivo se valida con la librería `zod`, dependencia nueva en `dependencies` de `package.json`.
- El motivo se guarda con la reserva cancelada; `canceladas` lista las reservas con estado cancelada.
- Mensajes exactos: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Texto de la interfaz en castellano (constitution, art. 4).
- No entran las anulaciones del responsable de sala (0011): `voidBooking` y `anular` no se tocan.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2).
- Git-flow: se trabaja en `feature/0010-cancel-reason`.
- Commits: abren con el commit de apertura (spec + plan), uno por task al quedar limpia su revisión, y el de cierre; atribución según el reminder del harness.
- Política de modelos: gama media por defecto; `fable` y `opus xhigh` solo con justificación.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `--motivo` con otra capitalización (`"Sala ocupada"`) → «motivo no válido: …»; la lista es exacta · Task 1, `motivo con otra capitalización no vale`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar», y con motivo inválido gana «motivo no válido…» · Task 1, `sin reserva con motivo válido lo dice` y `motivo inválido gana a sin reserva`
- `canceladas` sin canceladas → cadena vacía · Task 2, `canceladas vacío sin canceladas`
- Una reserva anulada con `anular` → no sale en `canceladas` · sin test (el fixture no permite sembrarla sin romper los demás); lo cubre el filtro por estado `cancelled` en la revisión final de Task 2

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí; un fichero, dos funciones.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo que `cancelar` sin motivo deja de cancelar (decisión 3, pedido por la spec); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: arts. 1-4 respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo, `listCancelled`, enrutado en `run`.
- `test/cancel.test.js` — tests del motivo y de `canceladas`; el test de cancelar activa pasa a llevar `--motivo`.
- `package.json` — `dependencies.zod`.
- `package-lock.json` — lo genera `npm install zod`.
- `.docs/sdd/steering/architecture.md` — la línea de «sin dependencias externas» pasa a mencionar `zod`.

**NO se tocan**:

- `voidBooking` / `anular` — son la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin cambio.

### 1.2 Modelo de datos

La reserva en memoria gana `reason?: string`, solo con estado `cancelled`.

### 1.3 Migraciones

N/A: sin base de datos.

### 1.4 Contratos API

N/A.

### 1.5 UX

N/A: salida de CLI, textos en las Restricciones.

### 1.6 Dependencias

`zod` (npm, última 3.x/4.x estable al instalar); sin specs previas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `zod` choca con «sin dependencias externas» | Alta | Baja | Se actualiza `architecture.md` (decisión 5) |
| Estado en memoria compartido entre tests | Media | Media | Cada test cancela una reserva distinta, o cancela y comprueba en el mismo test; el estado es de módulo |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna. (La desviación es de `architecture.md`, no de un artículo: ver decisión 5.)

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la sesión, gama media).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo x` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada. Estado actual: `bookings` en memoria, `findBooking(room, day)`, `run(cmd, params)`.
- Produce: `cancelBooking(room: string, day: string, reason: string | undefined): string` (exportada); la reserva cancelada lleva `reason`. Constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `package-lock.json`, `.docs/sdd/steering/architecture.md`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (se reescribe `cancelar una reserva activa`):
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'x'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje de motivo no válido.
  - `motivo con otra capitalización no vale`: `--motivo 'Sala ocupada'` → el mismo mensaje.
  - `motivo inválido gana a sin reserva`: `run('cancelar', ['Sur', 'mar', '--motivo', 'x'])` → mensaje de motivo no válido.
  - `sin reserva con motivo válido lo dice` (se conserva `cancelar sin reserva lo dice` con `--motivo 'otro'`): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - Orden: los tests que no cancelan la reserva de Norte van antes del que la cancela, porque el estado es de módulo (`node --test` ejecuta los tests de un fichero en orden).
- [ ] **Step 2: Ver los tests fallar**: `node --test test/cancel.test.js`. Esperado: fallan los de motivo.
- [ ] **Step 3: Dependencia**: `npm install zod`. Esperado: `package.json` con `"dependencies": { "zod": "<versión instalada>" }` y `package-lock.json` creado.
- [ ] **Step 4: Implementación** en `src/app.js`: `import { z } from 'zod'`; `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `const reasonSchema = z.enum(REASONS)`; `cancelBooking(room, day, reason)` valida con `reasonSchema.safeParse(reason)` antes de `findBooking`, devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` si falla, guarda `booking.reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`, el comando `cancelar` lee el motivo como el valor que sigue a `--motivo` en `params` (`undefined` si no está) y llama `cancelBooking(params[0], params[1], motivo)`.
- [ ] **Step 5: Documentar la dependencia**: en `.docs/sdd/steering/architecture.md`, la línea de Node pasa a «Node 22; única dependencia externa: `zod`, valida el motivo de `cancelar`».
- [ ] **Step 6: Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 7: Commit de la task**: `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: la sesión, gama media).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela Norte lun con «sala ocupada» y ejecuta `canceladas` en la misma sesión; ve «Norte lun — sala ocupada». (El estado es en memoria: son dos órdenes en un mismo proceso, solo observable por los tests.)

**Interfaces**:
- Consume: de la Task 1, las reservas canceladas con `reason`, y `cancelBooking(room, day, reason)`.
- Produce: `listCancelled(): string` (exportada) y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas vacío sin canceladas`: `run('canceladas', [])` → `''`. Va el primero del fichero, antes de cualquier test que cancele, porque el estado es de módulo.
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` (si la Task 1 no la dejó ya cancelada en el mismo test), `run('canceladas', [])` → `'Norte lun — sala ocupada'` (guion largo `—`).
  - Las anuladas no tienen test: el fixture solo trae una reserva y anularla impediría los demás tests sin un reinicio de estado que sería código nuevo (YAGNI). Lo cubre el filtro `status === 'cancelled'` y la revisión final.
- [ ] **Step 2: Ver los tests fallar**: `node --test test/cancel.test.js`. Esperado: fallan los de `canceladas`.
- [ ] **Step 3: Implementación** en `src/app.js`: `export function listCancelled()` filtra `bookings` con `status === 'cancelled'` y devuelve `` `${room} ${day} — ${reason}` `` unidos por `\n`; `run('canceladas')` lo llama.
- [ ] **Step 4: Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task**: `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; incertidumbre: instalar `zod` y el estado en memoria compartido entre tests; sin estimation-log previo
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED Cancelar · AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista`. ✓
- ADDED Listado · THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- «El motivo se guarda con la reserva» → Task 2, `canceladas enseña el motivo` lo observa por la salida. ✓
- Dependencia `zod` en `dependencies` → Task 1, Step 3 (`package.json`). Sin test que lo mire: lo observa el import en `src/app.js` al correr cualquier test. ✓
- No entra 0011 → N/A (confirmado en spec). ✓
- Review Focus: sin motivo → Task 1 `cancelar sin motivo no cancela`; capitalización → `motivo con otra capitalización no vale`; orden de validación → `motivo inválido gana a sin reserva`, `sin reserva con motivo válido lo dice`; canceladas vacío/anuladas → Task 2 `canceladas vacío sin canceladas`; anuladas → sin test, avisado en el Review Focus. ✓
