---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Native, la sesión hace las dos tasks en Sonnet con effort medium — el plan trae firmas, textos y asserts, no hay prosa que interpretar. La revisión final de rama va con los modelos de `sdd-verify` (Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native, fijado en `sdd-kit.json`.
3. Cancelar sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» — la spec no dice si el motivo es obligatorio; el título «Cancelar pide un motivo» lo apunta. Cambia el comportamiento de hoy: los dos tests existentes de `test/cancel.test.js` pasan a llevar motivo.
4. El motivo se valida antes de buscar la reserva: un motivo malo responde «motivo no válido…» aunque la reserva no exista.
5. `canceladas` sin ninguna cancelada responde «sin canceladas»; con varias, una línea por reserva, separadas por `\n`. Las anuladas (`voided`) no entran: son de la 0011.
6. Los tests de `test/cancel.test.js` comparten el estado del módulo (una sola reserva, Norte lun): el test de `canceladas` va después del que cancela, y ese orden es su GIVEN. Sin `reset` exportado: YAGNI.
7. Riesgos altos: ninguno. Coste estimado: ~1,75 h, sin subagentes de implementación; tokens: orden de decenas de miles.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y el nuevo comando `canceladas` lo enseña.

**Architecture**: la reserva cancelada guarda `reason` junto a `status: 'cancelled'` en `src/app.js`; `cancelar` valida el motivo contra `REASONS` y `canceladas` filtra por estado. Sin ficheros ni dependencias nuevas.

**Tech Stack**: Node 22, `node:test`, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` (un fichero de entrada), sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas de una sola responsabilidad.
- Texto de la interfaz en castellano (Art. 4 de la constitution).

### De proceso

- Tests antes que código (Art. 2): RED escrito y visto fallar antes de la implementación.
- Sin dependencias externas (`architecture.md`).
- Commits con la convención del proyecto (`feat: …`) y la atribución de la sesión; nunca `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `canceladas sin cancelaciones lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, dos funciones nuevas, sin abstracciones.
- [x] **YAGNI gate**: ni `reset` de estado ni lista de motivos configurable.
- [x] **Brownfield gate**: retrocompatible salvo lo decidido en la 3 (cancelar sin motivo deja de valer); respeta el patrón de `src/app.js`; sin refactor fuera de scope (`voidBooking` intacto).
- [x] **Constitution check**: Art. 1 (flujo SDD), Art. 2 (tests antes, gate `node --test`), Art. 3 (rama `feature/0010-cancel-reason`), Art. 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)` valida y guarda `reason`, `listCancelled()`, y `run` enruta `--motivo` y `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan a llevar motivo; tests nuevos de motivo y de `canceladas`.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` — anulaciones del responsable, feature 0011.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. En memoria, sin schema ni migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comandos de la CLI:

- `cancelar <sala> <día> --motivo <motivo>`
- `canceladas`

### 1.5 UX

No aplica: salida de texto.

### 1.6 Dependencias

Ninguna. La 0011 toca `anular`, no `cancelar`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests del mismo fichero | media | bajo | el orden de los tests es el GIVEN de `canceladas` (decisión 6) |
| `--motivo` sin valor detrás (`cancelar Norte lun --motivo`) | baja | bajo | el valor es `undefined`, no está en la lista: «motivo no válido…» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión, en Native (Sonnet, effort medium); no se despacha.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista, ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` de `src/app.js` (devuelve la reserva activa o `undefined`).
- Produce: `cancelBooking(room, day, reason)` → `string`; `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; la reserva cancelada queda con `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `import { run } from '../src/app.js'`:
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada'])` → `'sin reserva Sur mar'` (sustituye al test actual sin motivo).
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye a «cancelar una reserva activa»; este es el que cancela Norte lun).
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo texto.
  Los dos rechazos van antes del test que cancela, para que la reserva siga activa y el rechazo no lo cause un «sin reserva». Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` primero comprueba `REASONS.includes(reason)` (si no, devuelve `motivo no válido: ${REASONS.join(', ')}`), luego busca la reserva (`sin reserva ${room} ${day}`), fija `status = 'cancelled'` y `reason`, y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` como motivo (`undefined` si falta la opción o el valor).
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`; uno solo al quedar limpia su revisión.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión, en Native (Sonnet, effort medium); no se despacha.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona, con Norte lun cancelada por «sala ocupada», escribe `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: de la Task 1, las reservas con `status: 'cancelled'` y `reason`.
- Produce: `listCancelled()` → `string`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin cancelaciones lo dice`: va **antes** del test que cancela; `run('canceladas', [])` → `'sin canceladas'`.
  - `el listado de canceladas enseña el motivo`: va **después** del test que cancela; `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}` y une con `'\n'`; sin ninguna devuelve `'sin canceladas'`. `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con el motivo (0010)`; uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75h
- Estimación de implementación: 0,75h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks en un solo fichero, sin dependencias; `estimation-log.md` sin calibración todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, Art. 2; no hay `operations.md`)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- Tabla «regla retirada → dónde vive ahora»: la spec no retira ninguna regla (el delta solo tiene ADDED): N/A. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza`; sin reserva → Task 1, `cancelar sin reserva lo dice`; sin canceladas → Task 2, `canceladas sin cancelaciones lo dice`. ✓
