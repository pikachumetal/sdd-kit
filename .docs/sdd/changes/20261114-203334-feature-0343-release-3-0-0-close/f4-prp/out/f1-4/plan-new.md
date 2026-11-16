---
id: 20261116-141455-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: la sesión implementa ambas (Native), en gama media (Sonnet, effort medium): el plan trae firmas, textos y asserts; la revisión final de rama va con sus ejes (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en sdd-kit.json.
3. Dos tasks, en este orden: Task 1 deja `cancelar` con motivo (y guarda `reason`); Task 2 añade `canceladas`, que es lo único que observa `reason`. Se parte porque un revisor podría aprobar una y rechazar la otra.
4. Los textos exactos (aviso, respuesta, `sin canceladas`) salen de la spec; no hay decisión técnica nueva fuera de ella.
5. Riesgos altos: ninguno; el estado en memoria compartido entre tests de un fichero es el único (decisión 16 de la spec) y el orden de los tests lo resuelve.
6. Coste estimado: ~1,5 h de implementación, sin despachos de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y `canceladas` lo enseña.

**Architecture**: un solo fichero, `src/app.js`. El motivo es un campo `reason` de la reserva, como ya lo es `status`; `listCancelled` filtra `bookings` por `status === 'cancelled'`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` dentro de su módulo único: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Texto de la interfaz en castellano; identificadores en inglés (`reason`, `listCancelled`).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Los motivos, literales: `cambio de planes`, `sala ocupada`, `otro`.

### De proceso

- Tests antes que código (constitución, art. 2). Gate de cierre una sola vez, en §3.
- Commits de la forma `feat(0010): <qué>`, con el trailer de atribución del proyecto.

## Review Focus

- `cancelar Norte lun sala ocupada ya` (argumento sobrante) → `motivo no válido…`, la reserva sigue activa · Task 1, test `motivo con argumento sobrante no vale`
- `canceladas x` (argumento sobrante) → ignora `x` y responde igual que `canceladas` · Task 2, test `canceladas ignora argumentos sobrantes`
- `cancelar` con motivo válido sobre una reserva ya anulada → `sin reserva Norte lun` · Task 2, test `cancelar una anulada dice sin reserva`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: campo `reason` en la reserva; sin estructuras nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva con menos de 3 usos.
- [x] **Brownfield gate**: retrocompatible solo en el estado de las reservas; el cambio de `cancelar` es deliberado (spec, decisión 2); sin refactor fuera de Scope.
- [x] **Constitution check**: flujo SDD, tests primero, castellano en la interfaz.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancel-comillas.test.js` — motivo entre comillas, un solo argumento.
- `test/canceladas.test.js` — listado con una cancelada.
- `test/canceladas-anuladas.test.js` — el listado no incluye anuladas; `cancelar` tras `anular`.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)`, `listCancelled()`, ruta `canceladas` y paso del motivo en `run`.
- `test/cancel.test.js` — los dos tests actuales pasan a la forma con motivo y se añaden los de motivo inválido.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `README.md`, `PRODUCT.md` — no documentan comandos.

### 1.2 Modelo de datos

Reserva cancelada: `{ room, day, slot, status: 'cancelled', reason }`, en memoria.

### 1.5 UX

Salida de terminal; sin pantalla (no hay `§Frontend`).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests de un fichero dependen del estado compartido | Media | Bajo | orden fijado en `cancel.test.js` y un fichero por escenario con reserva semilla |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar exige un motivo de la lista

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium): el plan trae firmas y asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, `test/cancel-comillas.test.js`, escritos antes del código y sin commitear: van en el commit de la task; TDD del propio hilo.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/cancel-comillas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun sala ocupada` imprime `cancelada Norte lun: sala ocupada`; `node src/app.js cancelar Norte lun` imprime `motivo no válido: usa cambio de planes, sala ocupada u otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` y el campo `reason` de la reserva cancelada; Task 2 lo lee.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancel-comillas.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten estado; los inválidos van con la reserva aún activa). `const WARNING = 'motivo no válido: usa cambio de planes, sala ocupada u otro';`
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `WARNING`
  - `cancelar con motivo fuera de la lista no cancela`: `['Norte', 'lun', 'vacaciones']` → `WARNING`
  - `el motivo distingue mayúsculas`: `['Norte', 'lun', 'Sala', 'ocupada']` → `WARNING`
  - `motivo con argumento sobrante no vale`: `['Norte', 'lun', 'sala', 'ocupada', 'ya']` → `WARNING`
  - `el motivo se valida antes que la reserva`: `['Sur', 'mar']` → `WARNING`
  - `cancelar sin reserva lo dice`: `['Sur', 'mar', 'otro']` → `sin reserva Sur mar`
  - `cancelar una reserva activa con motivo`: `['Norte', 'lun', 'sala', 'ocupada']` → `cancelada Norte lun: sala ocupada` (prueba también que los inválidos la dejaron activa)
  - `cancelar dos veces dice sin reserva`: `['Norte', 'lun', 'otro']` → `sin reserva Norte lun`

  En `test/cancel-comillas.test.js`: `run('cancelar', ['Norte', 'lun', 'sala ocupada'])` → `cancelada Norte lun: sala ocupada`. Ejecútalos y comprueba que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`. `cancelBooking(room, day, reason)`: si `!CANCEL_REASONS.includes(reason)` devuelve `motivo no válido: usa cambio de planes, sala ocupada u otro`; después busca la reserva (`sin reserva ${room} ${day}` si no hay); al cancelar fija `booking.reason = reason` y devuelve `cancelada ${room} ${day}: ${reason}`. En `run`: `cancelBooking(params[0], params[1], params.slice(2).join(' '))`.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; esperado `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar exige un motivo de la lista`.

### Task 2 — Listado de canceladas con su motivo

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/canceladas.test.js`, `test/canceladas-anuladas.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/canceladas.test.js test/canceladas-anuladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js canceladas` imprime `sin canceladas` (un proceso nuevo no tiene canceladas; la reserva semilla está activa).

**Interfaces**:
- Consume: el campo `reason` de Task 1.
- Produce: `listCancelled()` y la ruta `canceladas`.

**Ficheros**: modificar `src/app.js`; crear `test/canceladas.test.js`, `test/canceladas-anuladas.test.js`.

- [ ] **Step 1: Tests RED** — `test/canceladas.test.js`, en orden: `sin canceladas al principio`: `run('canceladas', [])` → `sin canceladas`; `el listado enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', 'sala', 'ocupada'])`, `run('canceladas', [])` → `Norte lun 10:00-12:00: sala ocupada`; `canceladas ignora argumentos sobrantes`: `run('canceladas', ['x'])` → `Norte lun 10:00-12:00: sala ocupada`. `test/canceladas-anuladas.test.js`, en orden: `el listado no incluye anuladas`: `run('anular', ['Norte', 'lun'])`, luego `run('canceladas', [])` → `sin canceladas`; `cancelar una anulada dice sin reserva`: `run('cancelar', ['Norte', 'lun', 'otro'])` → `sin reserva Norte lun`. Ejecútalos y comprueba que fallan (el primero devuelve `salas`).
- [ ] **Step 2: Implementación** — `listCancelled()` en `src/app.js`: filtra `bookings` por `status === 'cancelled'`, mapea a `${b.room} ${b.day} ${b.slot}: ${b.reason}`, las une con `\n`; sin ninguna devuelve `sin canceladas`. Ruta en `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; esperado `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1,0 h
- Estimación de implementación: 1,0 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas sobre un fichero de ~35 líneas; sin referencia en el log de calibración
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent: ninguna cancelada nueva sin motivo de la lista; el motivo se ve en `salas canceladas`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN `cancelada Norte lun: sala ocupada` → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND la reserva queda cancelada con ese motivo → Task 2, `el listado enseña el motivo` (única observación del campo). ✓
- AND motivo entre comillas → Task 1, `test/cancel-comillas.test.js`. ✓
- Motivo ausente: THEN aviso → Task 1, `cancelar sin motivo no cancela`; AND sigue activa → `cancelar una reserva activa con motivo` pasa después. ✓
- AND `vacaciones` → Task 1, `cancelar con motivo fuera de la lista no cancela`. ✓
- AND `Sala ocupada` → Task 1, `el motivo distingue mayúsculas`. ✓
- AND `cancelar Sur mar` sin motivo → Task 1, `el motivo se valida antes que la reserva`. ✓
- Sin reserva: THEN `sin reserva Sur mar` → Task 1, `cancelar sin reserva lo dice`. ✓
- AND ya cancelada → Task 1, `cancelar dos veces dice sin reserva` (el motivo no cambia: no hay forma de cambiarlo sin reserva activa; lo observa Task 2 con el listado inalterado). ✓
- AND anulada → Task 2, `cancelar una anulada dice sin reserva`. ✓
- Listado: THEN línea con motivo → Task 2, `el listado enseña el motivo`; AND `sin canceladas` → `sin canceladas al principio`. ✓
- Listado sin anuladas → Task 2, `el listado no incluye anuladas`. ✓
- Reglas de la capacidad (datos en memoria, lista cerrada, avisos, conflicto) → Tasks 1 y 2, por los mismos tests. ✓
- Separador `\n` y orden entre varias canceladas → sin observar: una sola reserva semilla; avisado en la decisión 18 de la spec. ⚠
- Fila «cambia de forma» (firma de `cancelBooking`, respuesta, `cancelar` sin motivo) → Task 1, los tests de arriba. ✓
- Review Focus → Task 1 `motivo con argumento sobrante no vale`; Task 2 `canceladas ignora argumentos sobrantes` y `cancelar una anulada dice sin reserva`. ✓
