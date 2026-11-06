---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo por task: la sesión en gama media (Sonnet, effort medium) — dos tasks pequeñas sobre un solo fichero, con el código determinado por la firma y los tests. La revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y no fija este caso. El test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
4. Orden de comprobaciones en `cancelar`: primero que exista la reserva activa (`sin reserva …`, como hoy), después el motivo. Así `cancelar Sur mar` sigue respondiendo `sin reserva Sur mar` y una reserva inexistente no se queda con un motivo inválido guardado.
5. `canceladas` lista solo el estado `cancelled`; las `voided` (anulaciones, 0011) no entran. Sin canceladas responde `sin canceladas`: texto que la spec calla, lo fijo yo.
6. Un motivo se compara exacto con la lista (`cambio de planes`, `sala ocupada`, `otro`), sin distinguir nada más; se guarda en `booking.reason`.
7. Riesgos altos: ninguno. Coste estimado: ~1 h, sin despacho de subagentes.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda en la reserva al pasar a `cancelled` (`booking.reason`); `canceladas` filtra por ese estado y formatea `<sala> <día> — <motivo>`. Todo en `src/app.js`, que ya concentra los comandos.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos; solo cambia `cancelar` y añade un comando en el mismo fichero.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `cancelada Norte lun (sala ocupada)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `Norte lun — sala ocupada` (con raya larga `—`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code. Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native: la sesión implementa cada task en orden; TDD (test RED antes del código).
- Commits: convención del proyecto (`feat: …`), uno por task al quedar limpia su revisión y uno de cierre; con la atribución que fije el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro`, y la reserva sigue activa · Task 1, `cancelar_sin_motivo_lo_rechaza`
- `cancelar Norte lun --motivo "inventado"` → mismo mensaje y la reserva sigue activa (un siguiente `cancelar` con motivo válido responde `cancelada…`) · Task 1, `motivo_invalido_no_cancela`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no una cadena vacía · Task 2, `canceladas_sin_ninguna`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin estructuras nuevas; un campo `reason` y un comando.
- [x] **YAGNI gate**: la lista de motivos es una constante con un solo uso de validación; sin abstracciones.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec pide (cancelar pide motivo); sigue el patrón de `cancelBooking`/`run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas-vacio.test.js` — `canceladas_sin_ninguna`, en un fichero propio porque el estado del módulo se comparte entre tests del mismo fichero.

**Modificar**:

- `src/app.js` — constante `REASONS`, `cancelBooking(room, day, reason)` con validación y `reason`, `cancelledBookings()` y el comando `canceladas` en `run`; `run('cancelar')` extrae el valor de `--motivo`.
- `test/cancel.test.js` — los tests de la spec y los del Review Focus; el existente `cancelar una reserva activa` lleva `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js`, `test/store.test.js`, `scripts/lint.mjs` — sin cambio de comportamiento que les afecte.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. En memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` · `canceladas`.

### 1.5 UX

No aplica (terminal).

### 1.6 Dependencias

Ninguna; la 0011 queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Quien ya usa `cancelar <sala> <día>` sin motivo recibe error | media | bajo | Es lo que pide la spec; el mensaje lista los motivos válidos |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión nativa en gama media (Sonnet, effort medium); no se despacha subagente.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tooling
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo "x"` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` que deja `booking.status = 'cancelled'` y `booking.reason = reason`; constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `cancelar una reserva activa`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye al test existente de ese nombre).
  - `motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'inventado'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar_sin_motivo_lo_rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `motivo_invalido_no_cancela`: tras el rechazo de `inventado`, `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'])` → `'cancelada Norte lun (otro)'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; si `!REASONS.includes(reason)` → `motivo no válido: ${REASONS.join(', ')}` sin tocar la reserva; si no, `status = 'cancelled'`, `reason`, y `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` cuando el flag existe y `undefined` si no.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — Listado de canceladas con su motivo

**Tras**: Task 1
**Modelo**: la sesión nativa en gama media (Sonnet, effort medium); no se despacha subagente.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend, tooling
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona cancela Norte lun con «sala ocupada» y ejecuta `canceladas`: ve `Norte lun — sala ocupada`.

**Interfaces**:
- Consume: `booking.status === 'cancelled'` y `booking.reason` de la Task 1.
- Produce: `cancelledBookings()` → texto del listado; comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/canceladas-vacio.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas_sin_ninguna`: `run('canceladas', [])` sin cancelaciones → `'sin canceladas'`.
  Como el estado es del módulo y se comparte entre tests, `canceladas_sin_ninguna` va en un fichero propio `test/canceladas-vacio.test.js` (proceso aislado de `node --test`) y su comando se añade a «Verificación». Ejecutarlos y ver que fallan.
- [ ] **Step 2: Implementación** — `cancelledBookings()`: filtra `status === 'cancelled'`, mapea `${room} ${day} — ${reason}`, une con `\n`; sin resultados devuelve `sin canceladas`. En `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/canceladas-vacio.test.js` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias; sin referencia en `estimation-log.md`
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde `cancelada Norte lun (sala ocupada)`» → Task 1, `cancelar una reserva activa`. ✓
- AND «un motivo fuera de la lista responde `motivo no válido: …`» → Task 1, `motivo fuera de la lista`. ✓
- THEN «`canceladas` responde `Norte lun — sala ocupada`» → Task 2, `canceladas enseña el motivo` (cancela por `cancelar` y lee la salida de `canceladas`, no el campo escrito). ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: sin motivo → Task 1, `cancelar_sin_motivo_lo_rechaza` · motivo inválido no cancela → Task 1, `motivo_invalido_no_cancela` · sin canceladas → Task 2, `canceladas_sin_ninguna`. ✓
