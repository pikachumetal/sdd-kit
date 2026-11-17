---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, las ejecuta la sesión en gama media (Sonnet, effort medium); son cambios de pocas líneas en un fichero y el plan trae textos y asserts. La revisión final de rama va con el modelo de `sdd-verify` (ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Sin `--motivo` o con valor vacío**: responde «motivo no válido: cambio de planes, sala ocupada, otro», igual que un motivo fuera de la lista; la spec dice que cancelar «pide» un motivo y no fija este caso.
4. **Orden de comprobaciones en `cancelar`**: primero que exista la reserva (`sin reserva <sala> <día>`, como hoy), después el motivo. Así el test existente «cancelar sin reserva lo dice» sigue verde sin tocarlo.
5. **`canceladas` sin ninguna cancelada**: responde `sin canceladas`; la spec no lo fija.
6. **`canceladas` solo lista estado `cancelled`**: las `voided` (anulaciones, 0011) no salen. Varias canceladas, una línea cada una, separadas por salto de línea.
7. **Test existente «cancelar una reserva activa»**: se actualiza para pasar `--motivo`; su assert cambia a `cancelada Norte lun (sala ocupada)` porque el comportamiento de `cancelar` cambia por spec.
8. **Coste estimado**: ~1 h en total, 2 tasks; sin subagentes salvo la revisión final.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda en la propia reserva (`booking.reason`) al pasar a `cancelled`; `canceladas` filtra por ese estado. Todo en `src/app.js`, que es el único fichero de entrada.

**Tech Stack**: Node 22, sin dependencias externas, `node:test`; `src/app.js` y `test/cancel.test.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto y los parámetros de `cancelar` y añade un comando en `src/app.js`; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Lista de motivos, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>`.
- Texto de la interfaz en castellano (Art. 4). Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); código limpio, funciones cortas.
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`).

### De proceso

- Tests antes que código (Art. 2). Un commit por task al quedar limpia su revisión; convención del proyecto: `feat: ...`.
- `voidBooking` y el comando `anular` no se tocan (0011).
- Atribución de commits según las reglas del harness.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Norte lun --motivo "sala ocupada"` con motivo inválido no cancela: tras `--motivo vacaciones`, un `cancelar` válido posterior sigue encontrando la reserva · Task 1, `un motivo inválido no cancela la reserva`
- `cancelar Sur mar --motivo otro` sin reserva → `sin reserva Sur mar` (no el error de motivo) · Task 1, `cancelar sin reserva lo dice` (existente) y `sin reserva gana al motivo inválido`
- `canceladas` sin ninguna cancelada → `sin canceladas`; una anulada (`voided`) no aparece · Task 2, `canceladas sin canceladas` y `canceladas ignora las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un campo de la reserva; sin módulos ni estructuras nuevas.
- [x] **YAGNI gate**: sin abstracción; una constante con la lista de motivos.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); respeta el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, gate `node --test`, git-flow, castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas-vacio.test.js`, `test/canceladas-anuladas.test.js` — casos de `canceladas` que piden estado en memoria limpio.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo; `run` lo extrae de `--motivo`; nuevo `listCancelled` y comando `canceladas`.
- `test/cancel.test.js` — tests de los dos escenarios de la spec y del Review Focus de `cancelar`.

**NO se tocan**:

- `voidBooking` / `anular` en `src/app.js` — anulaciones del responsable, 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.

### 1.2 Modelo de datos

La reserva gana `reason` (cadena) al cancelarse. Sin persistencia: las reservas viven en memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` con valor de varias palabras mal tomado de `params` | Media | Medio | `run` lee el valor tras `--motivo` como un solo argumento (`"sala ocupada"` llega como un elemento); test con ese valor |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native: la sesión, Sonnet con effort medium; trabajo mecánico acotado.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y `cancelBooking(room, day)` actuales de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` que devuelve `cancelada <sala> <día> (<motivo>)`, `sin reserva <sala> <día>` o `motivo no válido: cambio de planes, sala ocupada, otro`, y deja `booking.reason` con el motivo; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Las reservas viven en memoria y se comparten entre los tests de un fichero, y la de Norte lun solo se cancela con éxito una vez: los rechazos (sin efecto) van primero y el éxito al final.
  - `cancelar sin reserva lo dice` (existente, sin cambios).
  - `sin reserva gana al motivo inválido`: `run('cancelar', ['Sur', 'mar', '--motivo', 'vacaciones'])` → `'sin reserva Sur mar'`.
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza y no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `cancelar una reserva activa` (el existente, al final): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`; como va tras los rechazos, también prueba que no cancelaron.
- [ ] **Step 2: Implementación** — constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: busca la reserva (`sin reserva …` si no hay), valida `REASONS.includes(reason)` (mensaje literal de la spec si no), pone `status = 'cancelled'` y `reason`. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` como motivo (`undefined` si no hay `--motivo`).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native: la sesión, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` que deja `cancelBooking(room, day, reason)` de la Task 1; la reserva de Norte lun, 10:00-12:00.
- Produce: `listCancelled()` que devuelve las canceladas, una por línea con formato `<sala> <día> — <motivo>`, o `sin canceladas`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/canceladas-vacio.test.js`, `test/canceladas-anuladas.test.js`

- [ ] **Step 1: Tests RED**:
  - En `test/cancel.test.js`, al final (tras el test que cancela Norte lun con «sala ocupada»): `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - Los casos que piden estado limpio van en su propio fichero, porque `node --test` ejecuta cada fichero en un proceso: `test/canceladas-vacio.test.js`, `canceladas sin canceladas`: `run('canceladas', [])` → `'sin canceladas'`; `test/canceladas-anuladas.test.js`, `canceladas ignora las anuladas`: tras `run('anular', ['Norte', 'lun'])`, `run('canceladas', [])` → `'sin canceladas'`.
- [ ] **Step 2: Implementación** — `listCancelled()` filtra `bookings` por `status === 'cancelled'`, mapea a `` `${room} ${day} — ${reason}` `` y une con `\n`; vacío → `sin canceladas`. `run`: `if (cmd === 'canceladas') return listCancelled();` antes del `return 'salas'`.
- [ ] **Step 3: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: el listado de canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 0,75 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks en un fichero, sin incertidumbre técnica salvo el estado compartido entre tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, Art. 2)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar — THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED Cancelar — AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- ADDED Listado — THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza y no cancela`; inválido no cancela → mismo test y el rechazo previo al éxito; sin reserva gana → `sin reserva gana al motivo inválido`; sin canceladas y anuladas → Task 2, `canceladas sin canceladas` y `canceladas ignora las anuladas`. ✓
