---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, `sonnet` con effort medium; el código es pequeño y la spec trae las frases exactas. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: Native, fijado en `sdd-kit.json`; con una sola task no hay nada que despachar.
3. **Una sola task**: `cancelar` y `canceladas` tocan el mismo fichero y se prueban en el mismo `test/cancel.test.js`; separarlas dejaría la primera sin nada que enseñar.
4. **`cancelar` sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: …»): la spec dice que cancelar «pide» un motivo y calla este caso. Cambia el test existente `cancelar una reserva activa`, que cancelaba sin motivo.
5. **Motivo inválido no cancela**: la reserva sigue activa y se puede cancelar después con un motivo válido.
6. **`canceladas` solo lista las de estado `cancelled`**: las anuladas (`voided`, 0011) no salen. Sin canceladas responde `sin canceladas`.
7. **Coste estimado**: ~0,5 h de implementación; el único gasto de subagentes es la revisión final de rama.
9. **Orden de validación**: el motivo se valida antes de buscar la reserva; un motivo inválido sobre una reserva inexistente responde «motivo no válido…».
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` guarda un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: el motivo se guarda como campo `reason` de la reserva cancelada, dentro de `src/app.js`. `cancelBooking` valida y recibe el motivo; `listCancelled` genera la salida; `run` extrae `--motivo` de los parámetros y enruta `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque `execution` está fijado en `sdd-kit.json`: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Texto de la interfaz en castellano (constitution, art. 4).
- La constitution no tiene artículo de calidad de código: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.
- Sin dependencias externas; todo en `src/app.js`.

### De proceso

- Modelo de la sesión: Sonnet, effort medium; revisión final de rama con `sdd-kit:effort-high` + `opus`.
- Ejecución por defecto: native.
- Commits con la atribución que fija el kit; un solo commit por task.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- Motivo inválido sobre una reserva activa → no la cancela; un `canceladas` posterior no la lista · Task 1, `un motivo inválido no cancela la reserva`
- `cancelar` de una sala sin reserva con motivo válido → «sin reserva Sur mar», como hoy · Task 1, `cancelar sin reserva lo dice` (con `--motivo`)
- `canceladas` sin ninguna cancelada → «sin canceladas», no una cadena vacía · Task 1, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y dos funciones en el fichero existente.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); respeta el patrón `cancelBooking`/`run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`, `cancelBooking` con motivo, `listCancelled`, enrutado de `canceladas` y de `--motivo` en `run`.
- `test/cancel.test.js` — tests de la spec y de Review Focus; actualiza `cancelar una reserva activa`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin relación.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Datos en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Media | Tests que dependen del orden | Cada test que cancela usa una reserva distinta o los tests del mismo fichero se ordenan por la reserva de Norte lun; documentado en la task |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la sesión la implementa: Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: tooling (CLI de Node)
**Verificación**: `node --test test/cancel.test.js` y `node scripts/lint.mjs`
**Se prueba en la aplicación**: sí, por la CLI: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». Cada invocación arranca con el estado inicial, así que la salida de `canceladas` se comprueba por los tests.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string` y `listCancelled(): string`, exportadas desde `src/app.js`; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

El estado de `bookings` es de módulo: en `test/cancel.test.js` los tests se escriben en el orden en que cancelan la única reserva activa (Norte lun); los que no deben cancelarla (motivo inválido, sin motivo) van antes del que sí.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, con estos nombres y asserts (`run` importado de `../src/app.js`):
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo inválido no cancela la reserva`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`, y después `run('canceladas', [])` → `'sin canceladas'`.
  - `cancelar pide un motivo de la lista` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `el listado de canceladas enseña el motivo`: tras el test anterior, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - Ejecuta `node --test test/cancel.test.js`. Esperado: FALLA en los de motivo y `canceladas`.
- [ ] **Step 2: Implementación** en `src/app.js`: constante `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida primero el motivo y, si no está en la lista, devuelve `motivo no válido: ${CANCEL_REASONS.join(', ')}` sin tocar la reserva; luego busca la reserva (`sin reserva …` como hoy); guarda `booking.reason` y devuelve `cancelada ${room} ${day} (${reason})`; `listCancelled()` une con `\n` las reservas `cancelled` como `${room} ${day} — ${reason}` o devuelve `sin canceladas`; `run` toma el valor tras `--motivo` y enruta `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en verde y `node scripts/lint.mjs` → «lint: sin hallazgos».
- [ ] **Step 4: Commit de la task** — uno solo, `feat: motivo al cancelar (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Base de la estimación: una task, un fichero de código y uno de tests
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1, tests `cancelar pide un motivo de la lista` y `cancelar sin motivo lo rechaza`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `el listado de canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en spec). ✓
- Review Focus (4 líneas) → Task 1, tests nombrados en cada línea. ✓
