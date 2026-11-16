---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Sonnet, effort medium en las dos — el plan lleva firmas y asserts, no hay prosa que interpretar. La revisión final de rama sigue la política de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` sobre una reserva activa responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela: la spec dice que cancelar «pide» un motivo. El test existente «cancelar una reserva activa» pasa a llevar `--motivo`.
4. Orden de comprobación: primero la reserva (`sin reserva <sala> <día>`, como hoy), después el motivo. Así el test «cancelar sin reserva lo dice» no cambia.
5. `canceladas` lista solo el estado `cancelled` (no las `voided` de `anular`, que es la 0011), una por línea, `<sala> <día> — <motivo>`. Sin canceladas responde «sin canceladas» (texto que la spec no fija, siguiendo «sin reserva …»).
6. Coste estimado: 1 h, sin despacho de subagentes.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lo enseña.

**Architecture**: la reserva cancelada guarda su `reason` en el mismo objeto de `bookings` de `src/app.js`; `cancelBooking` valida y guarda, `listCancelled` lee, `run` solo despacha y extrae `--motivo`.

**Tech Stack**: Node 22 sin dependencias, un solo fichero `src/app.js`, tests con `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el fichero existente; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista cerrada de motivos, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensaje de motivo inválido, literal: `motivo no válido: cambio de planes, sala ocupada, otro`.
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2).
- Modelo: Sonnet, effort medium, sin `fable` ni `opus xhigh`.
- Commits referenciando la 0010; atribución según el sistema.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: …` y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza y no cancela`
- `cancelar Norte lun --motivo "vacaciones"` → `motivo no válido: …` y la reserva sigue activa (el listado no la muestra) · Task 1, `un motivo inválido no cancela la reserva`
- `canceladas` sin ninguna cancelada → `sin canceladas` · Task 2, `canceladas sin canceladas lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y una función; sin abstracciones.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: retrocompatible salvo que `cancelar` ahora exige motivo (pedido por la spec); sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, gate `node --test`, castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; `listCancelled()` nuevo; `run` extrae `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — los tests de la 0010 (Dónde se prueba de la spec).

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `README.md`, `PRODUCT.md` — sin texto de `cancelar` que cambiar.

### 1.2 a 1.6

No aplica (sin datos persistentes, migraciones, API, UX ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper el test existente de `cancelar` | Alta | Bajo | Se actualiza en Task 1 a llevar `--motivo` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: `sonnet`, effort medium (el plan trae firmas y asserts; en Native lo hace la sesión).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)`; la reserva cancelada lleva `reason` (string de la lista); `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `cancelar una reserva activa` pasa a `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` no cambia.
  - `un motivo inválido no cancela la reserva`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`, y después `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `'cancelada Norte lun (otro)'`.
  - `cancelar sin motivo lo rechaza y no cancela`: igual con `['Norte', 'lun']`.
  Los tests comparten el estado en memoria de `bookings`: cada test que cancela Norte lun se escribe para que el orden no lo rompa (el rechazo va antes de la cancelación efectiva, o usa Sur con una reserva sembrada por la API del módulo si hace falta).
- [ ] **Step 2: Ver los tests fallar** con el comando de «Verificación».
- [ ] **Step 3: Implementación** en `src/app.js`: constante `reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` — sin reserva activa → `sin reserva <sala> <día>`; motivo fuera de `reasons` o `undefined` → mensaje literal de «De código»; si no, `status = 'cancelled'`, `reason = reason`, devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`, el motivo es el parámetro que sigue a `--motivo` (`undefined` si falta).
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas con motivo

**Tras**: Task 1
**Modelo**: `sonnet`, effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js canceladas` y ve una línea por reserva cancelada, p. ej. «Norte lun — sala ocupada»; sin canceladas ve «sin canceladas».

**Interfaces**:
- Consume: `reason` y `status === 'cancelled'` de las reservas, de la Task 1.
- Produce: `listCancelled()` → string; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED**:
  - `el listado de canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas lo dice`: `run('canceladas', [])` sin cancelaciones previas → `'sin canceladas'` (el test se aísla del estado compartido: va el primero del fichero o importa el módulo fresco con `import(`../src/app.js?${Date.now()}`)`).
- [ ] **Step 2: Ver los tests fallar**.
- [ ] **Step 3: Implementación** en `src/app.js`: `listCancelled()` filtra `status === 'cancelled'`, mapea a `` `${room} ${day} — ${reason}` `` y une con `'\n'`; vacío → `'sin canceladas'`. `run('canceladas')` la llama.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): listado de canceladas con motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; `operations.md` y `tech-stack.md` no lo declaran)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo inválido no cancela la reserva`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- Review Focus (3 líneas) → Task 1 `cancelar sin motivo lo rechaza y no cancela`, `un motivo inválido no cancela la reserva`; Task 2 `canceladas sin canceladas lo dice`. ✓
