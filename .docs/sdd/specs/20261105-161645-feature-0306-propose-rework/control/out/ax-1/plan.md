---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-05
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, la propia sesión en gama media (Sonnet, effort medium) — las dos tasks son pequeñas y el plan lleva las firmas y los asserts. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» — la spec dice que cancelar «pide» un motivo pero no qué pasa si falta; se trata como un motivo fuera de la lista.
4. Orden de las comprobaciones en `cancelar`: primero la reserva, luego el motivo. Sin reserva responde «sin reserva <sala> <día>» aunque el motivo falte o sea inválido; así el test existente `cancelar sin reserva lo dice` sigue valiendo sin cambios. Un motivo inválido no cancela la reserva.
5. El motivo se compara tal cual, sin distinguir tildes ni mayúsculas: `zod` con `z.enum([...])`.
6. `canceladas` sin ninguna cancelada responde «sin canceladas»; una reserva anulada (`voided`) no aparece, solo las de estado `cancelled`. La spec no fija ninguno de los dos casos.
7. El test existente `cancelar una reserva activa` (sin motivo) contradice la spec nueva: se reescribe en la Task 1 para pasar `--motivo`.
8. `package.json` no tiene `dependencies` y el repo no tiene `.gitignore`: `npm install zod` crearía `node_modules/` sin ignorar. La Task 1 añade `.gitignore` con `node_modules/` antes de instalar, y corrige `tech-stack.md` («sin dependencias externas» deja de ser cierto).
9. Los tests de `test/cancel.test.js` comparten el estado en memoria de `src/app.js` (una sola reserva activa) y node corre los tests de un fichero en orden: el motivo inválido va antes del válido, y `canceladas` va después. Es un acoplamiento por orden, aceptado para no añadir un reset solo para tests (YAGNI).
10. **Coste estimado**: ~2,5 h en total; sin subagentes salvo la revisión final de rama.
11. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y el comando `canceladas` lista cada reserva cancelada con su motivo.

**Architecture**: `src/app.js` valida el motivo con un esquema `zod` (`z.enum`) y guarda el motivo en la reserva al pasarla a `cancelled`. `canceladas` filtra las reservas con estado `cancelled` y formatea `<sala> <día> — <motivo>`. Todo sigue en el único fichero de entrada, como fija `tech-stack.md`.

**Tech Stack**: Node 22, `node --test`, `zod` (nueva, en `dependencies`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `dependencies` de `package.json`.

## Restricciones globales

### De código

- El motivo se valida con `zod`, dependencia nueva en `dependencies` de `package.json` (no en `devDependencies`).
- Lista de motivos, exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code; texto de interfaz en castellano.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2). Native: TDD del propio hilo.
- Commits con la convención del proyecto (`feat:`), un commit por task al quedar limpia su revisión; el de apertura antes del `sdd task start` de la Task 1.
- Atribución de commits según la del entorno (`Co-Authored-By`).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Norte lun --motivo "Sala ocupada"` (otra capitalización) → «motivo no válido: …»; la lista es exacta · Task 1, `cancelar con motivo en otra capitalización lo rechaza`
- Un motivo inválido no cancela: tras él, `cancelar Norte lun --motivo "sala ocupada"` sigue funcionando · Task 1, `cancelar con motivo no válido deja la reserva activa`
- `canceladas` sin canceladas → «sin canceladas»; una reserva anulada con `anular` no aparece · Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un esquema `z.enum` y un filtro; sin capas nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva; sin reset de estado solo para tests.
- [x] **Brownfield gate**: retrocompatible salvo el cambio pedido (`cancelar` exige motivo); respeta el fichero único; sin refactor fuera de scope (no se toca `anular`).
- [x] **Constitution check**: tests antes que código, gate `node --test` entero, castellano en la interfaz.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — `node_modules/`.
- `test/canceladas-vacio.test.js` — `canceladas` sin ninguna cancelada, en un proceso sin estado compartido.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; nueva `cancelledBookings()`; `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado; reescribe el test de cancelar activa.
- `package.json` — `dependencies.zod` (lo escribe `npm install zod`); también `package-lock.json` nuevo.
- `.docs/sdd/tech-stack.md` — dice que `zod` valida el motivo de cancelación y que el proyecto ya no carece de dependencias.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable de sala son la 0011.
- `scripts/lint.mjs` — sigue valiendo tal cual.

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason: string`.

### 1.6 Dependencias

`zod` (npm). Sin specs previas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install zod` sin red o `node_modules/` commiteado | media | medio | `.gitignore` antes de instalar; verificar `git status` antes del commit |
| Tests acoplados por el estado en memoria | media | bajo | Orden documentado en las decisiones; un fallo por orden se ve en la Verificación |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo de la lista

**Tras**: —
**Modelo**: Native: la propia sesión, gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.
**Superficies**: backend · docs
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` que guarda `booking.reason`; las reservas canceladas llevan `status: 'cancelled'` y `reason` (la Task 2 las lee); `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: crear `.gitignore`; modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Dependencia** — crear `.gitignore` con `node_modules/`; ejecutar `npm install zod`; comprobar con `git status` que `node_modules/` no aparece y que `dependencies.zod` está en `package.json`. Actualizar `tech-stack.md`.
- [ ] **Step 2: Tests RED** en `test/cancel.test.js`, en este orden. Se reescribe `cancelar una reserva activa`, que pasa a `cancelar con motivo no válido deja la reserva activa` (no hay un test de cancelar con motivo válido sin más: lo cubre el siguiente):
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar con motivo en otra capitalización lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'Sala ocupada'])` → el mismo mensaje.
  - `cancelar con motivo no válido deja la reserva activa`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo mensaje y `run('libres', ['10:00-12:00'])` sigue sin incluir `Norte`.
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` (existente, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`. Va el último, tras el test que cancela.
  Esperado: fallan por la razón correcta (mensajes distintos), no por un error de importación.
- [ ] **Step 3: Implementación** en `src/app.js`: `import { z } from 'zod'`; `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `const reasonSchema = z.enum(REASONS)`; `export function cancelBooking(room, day, reason)` — primero `findBooking`, sin reserva → `sin reserva ${room} ${day}`; luego `reasonSchema.safeParse(reason)`, si falla → `motivo no válido: ${REASONS.join(', ')}`; si pasa, `status = 'cancelled'`, `reason = parsed.data`, devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el valor que sigue a `--motivo` en `params` (`undefined` si no está).
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`; antes, `git status` sin `node_modules/`.

### Task 2 — Comando `canceladas`

**Tras**: Task 1
**Modelo**: Native: la propia sesión, gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: el usuario cancela Norte lun con «sala ocupada» y ejecuta `node src/app.js canceladas`; ve «Norte lun — sala ocupada». (Con el estado en memoria, cada invocación del CLI es un proceso nuevo: la comprobación en la aplicación es la del test, que ejecuta ambos comandos en el mismo proceso.)

**Interfaces**:
- Consume: de la Task 1, las reservas con `status: 'cancelled'` y `reason`; `run('cancelar', …)`.
- Produce: `export function cancelledBookings()` → `string` con una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas por `\n`, o `sin canceladas`; `run('canceladas', [])` la devuelve.

**Ficheros**: crear `test/canceladas-vacio.test.js`; modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** al final de `test/cancel.test.js`, después de los de la Task 1 (dependen del orden: `Norte lun` ya está cancelada con «sala ocupada»):
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: `run('anular', ['Sur', 'mar'])` → `'sin reserva Sur mar'` y `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas lo dice`: va en un fichero propio, `test/canceladas-vacio.test.js` (proceso nuevo, sin estado compartido): `run('canceladas', [])` → `'sin canceladas'`.
  Esperado: fallan porque `run` devuelve `'salas'`.
- [ ] **Step 2: Implementación** en `src/app.js`: `export function cancelledBookings()` — filtra `bookings` por `status === 'cancelled'`, mapea a `${b.room} ${b.day} — ${b.reason}`, `join('\n')`; si no hay ninguna, `'sin canceladas'`. En `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js test/canceladas-vacio.test.js` → `ℹ fail 0`; `node scripts/lint.mjs`.
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, una dependencia nueva; sin calibración previa en `estimation-log.md`
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND «motivo fuera de la lista responde el aviso» → Task 1, `cancelar con motivo en otra capitalización lo rechaza` y `cancelar con motivo no válido deja la reserva activa`. ✓
- ADDED «El listado enseña el motivo»: THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Scope «No entra: anulaciones» → N/A, `voidBooking` intacta (comprobada por `canceladas no lista las anuladas`). ✓
- Approach «`zod` en `dependencies`» → Task 1, Step 1 (la comprobación es `git diff package.json`; sin test automático). ✓
- Review Focus: motivo ausente → Task 1, `cancelar sin motivo lo rechaza`; capitalización → `cancelar con motivo en otra capitalización lo rechaza`; motivo inválido no cancela → `cancelar con motivo no válido deja la reserva activa`; sin canceladas y anuladas → Task 2, `canceladas sin canceladas lo dice` y `canceladas no lista las anuladas`. ✓
