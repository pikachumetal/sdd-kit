---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en sdd-kit.json. Dos tasks pequeñas sobre un solo fichero; la sesión las hace sin subagentes y la revisión final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Modelo y effort**: la sesión ejecuta ambas tasks sin bajar el modelo (dos tasks cortas: rehacer la caché cuesta más de lo que ahorra).
3. **`cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»**: la spec dice que cancelar «pide» un motivo y no fija este caso; un motivo ausente es un motivo fuera de la lista. El test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
4. **El motivo se valida antes de buscar la reserva**: con motivo inválido y sin reserva, responde el error de motivo.
5. **`canceladas` lista solo las `cancelled`**, no las `voided` (anulaciones, feature 0011), una por línea; sin ninguna, salida vacía.
6. **Riesgo**: `.docs/sdd/capabilities/` no existe, así que `bookings` se crea al fusionar el delta en el cierre. Riesgo bajo.
7. **Coste**: ~0,5 h, sin subagentes salvo el revisor final.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda en la reserva (`booking.reason`) y `canceladas` filtra por `status === 'cancelled'`. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La lista de motivos es exactamente: `cambio de planes`, `sala ocupada`, `otro`.
- Mensaje de error literal: `motivo no válido: cambio de planes, sala ocupada, otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano.

### De proceso

- Tests antes que código (constitution, art. 2); los tests salen de los THEN de la spec.
- Commits con la convención `feat:`; nunca `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar` con motivo inválido sobre una reserva que existe → la deja activa · Task 1, `un motivo inválido no cancela`
- `canceladas` sin canceladas → salida vacía, no «salas» · Task 2, `canceladas sin ninguna sale vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y un filtro; sin abstracciones.
- [x] **YAGNI gate**: una constante `MOTIVOS`, sin módulo de motivos.
- [x] **Brownfield gate**: retrocompatible salvo el test existente de `cancelar`, que cambia por spec; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), gate `node --test` entero (art. 2).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `MOTIVOS`, `cancelBooking(room, day, reason)`, `listCancelled()`, rama `canceladas` y lectura de `--motivo` en `run`.
- `test/cancel.test.js` — escenarios de la spec y Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable, feature 0011.

### 1.2–1.6

No aplican (sin datos persistentes, API ni UI; sin dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` aún sin fichero en `capabilities/` | alta | bajo | el cierre lo crea al fusionar el delta |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Verificación**: `node --test test/cancel.test.js` → todos en verde
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: nada
- Produce: `cancelBooking(room, day, reason)` guarda `booking.reason` y devuelve el texto de la spec; `MOTIVOS: string[]`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests en RED** en `test/cancel.test.js`, con estos asserts:
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye al test actual sin motivo).
  - `cancelar con un motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `un motivo inválido no cancela`: tras los rechazos anteriores, `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `'cancelada Norte lun (otro)'` (si el test con motivo válido ya canceló la reserva, este test usa su propio orden o aísla el estado).
  - `cancelar sin reserva lo dice`, con `--motivo otro`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
- [ ] **Step 2: Implementación** en `src/app.js`: `const MOTIVOS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida primero el motivo, luego busca la reserva, guarda `booking.reason` y responde `cancelada ${room} ${day} (${reason})`; `run` toma como motivo el argumento que sigue a `--motivo` y lo pasa a `cancelBooking`. `voidBooking` no se toca.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Verificación**: `node --test test/cancel.test.js` → todos en verde
**Se prueba en la aplicación**: no, porque el estado vive en memoria y cada ejecución de `node src/app.js` empieza de cero; la comprobación es el test, que cancela y lista en el mismo proceso.

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` que deja `cancelBooking(room, day, reason)`
- Produce: `listCancelled(): string`, una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas con `\n`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests en RED**:
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin ninguna sale vacío`: sin cancelaciones previas, `run('canceladas', [])` → `''`. El estado es del módulo: el test aísla el estado importando el módulo de nuevo o se coloca antes de los que cancelan, y lo deja escrito.
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` → `''`.
- [ ] **Step 2: Implementación** en `src/app.js`: `listCancelled()` y la rama `if (cmd === 'canceladas') return listCancelled();` en `run`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat: canceladas lista el motivo (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los escenarios de la spec (smoke con una fila por THEN)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar pide un motivo de la lista (THEN «cancelada Norte lun (sala ocupada)» y «motivo no válido…») → Task 1. ✓
- El listado de canceladas enseña el motivo (THEN «Norte lun — sala ocupada») → Task 2. ✓
- No entra: anulaciones (0011) → N/A, `voidBooking` intacto. ✓
- Review Focus: sin motivo y motivo inválido que no cancela → Task 1; listado vacío → Task 2. ✓
