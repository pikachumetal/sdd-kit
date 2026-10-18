---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-18
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, en la sesión (Native). La revisión final de rama no se quita: sus ejes van con `sdd-kit:effort-high` + `opus` (Spec) y `sdd-kit:effort-high` + `sonnet` (Código).
2. **Ejecución**: native, porque es una task única en un solo fichero de código, un error lo caza su test y el plan cabe en un contexto. Con una sola task no se ofrece parar para bajar de modelo.
3. **Orden de las comprobaciones en `cancelar`**: primero la reserva, después el motivo. Así «sin reserva <sala> <día>» se conserva igual que en `quitar` (anexo de la spec) y no cambia para quien no pasa motivo.
4. **`cancelar` sin `--motivo`** (o con `--motivo` sin valor) responde igual que un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro». La spec dice que cancelar «pide» motivo y no fija este caso.
5. **Un motivo no válido no cancela**: la reserva sigue activa.
6. **`canceladas`** lista solo el estado `cancelled` (las `voided` quedan fuera, son de 0011), una por línea, en el orden de la reserva; sin canceladas responde cadena vacía, como `libres` cuando no hay salas.
7. **Tests compartiendo estado**: las reservas viven en memoria con una única semilla (Norte lun), así que los tests de `test/cancel.test.js` van en orden: motivo no válido, cancelar con motivo, `canceladas`, sin reserva. El test existente «cancelar una reserva activa» pasa a llevar `--motivo`, porque su comportamiento sin motivo cambia por la spec.
8. **Coste estimado**: 0.5 h de implementación, sin subagentes de task.
9. **Sin observar** (⚠ en §4): que `canceladas` excluya las anuladas y que `cancelar` respete la reserva de otra persona; ninguna tiene semilla ni modelo en la app.
10. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda como campo `reason` de la reserva cancelada, en `src/app.js`. `cancelBooking` valida contra una lista constante; `canceladas` filtra por estado.

**Tech Stack**: Node 22 sin dependencias, un solo fichero de entrada (`src/app.js`), tests con `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque una task única en un fichero, un error lo caza su test y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo módulo, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios), «sin reserva <sala> <día>».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.
- Texto de la interfaz en castellano.

### De proceso

- Sin política de modelos propia del proyecto: gama media para la sesión que ejecuta; Opus solo en los ejes Spec y Arquitectura de la revisión final.
- Modo de ejecución: native (`sdd-kit.json`).
- Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar` con motivo no válido no cancela: Norte lun sigue reservada → `libres 10:00-12:00` sigue respondiendo «Sur» · Task 1, `un motivo no válido no cancela la reserva`
- `canceladas` sin canceladas → cadena vacía · Task 1, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y un comando; sin abstracciones nuevas.
- [x] **YAGNI gate**: la lista de motivos es una constante, sin configuración.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` exige motivo); respeta el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` valida y guarda el motivo; función `cancelledBookings`; rama `canceladas` en `run`.
- `test/cancel.test.js` — los tests de los escenarios de la spec.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.

### 1.2 Modelo de datos

La reserva cancelada gana `reason` (cadena de la lista). En memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

`cancelar <sala> <día> --motivo <motivo>` y `canceladas`, con los textos de «Restricciones globales».

### 1.5 UX

No aplica: salida de consola.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests que comparten la semilla en memoria dependen del orden | Media | Bajo | Orden fijado en la task y en la decisión 7 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: sesión Native (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (lint)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reserva con `room`, `day`, `slot`, `status`).
- Produce: `cancelBooking(room, day, reason)` → cadena; `cancelledBookings()` → cadena con una línea `<sala> <día> — <motivo>` por reserva con `status === 'cancelled'`, unidas con `\n`; `run('canceladas', [])`; el motivo se lee de `params[params.indexOf('--motivo') + 1]` (`undefined` si falta).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten la semilla en memoria):
  - `canceladas sin canceladas responde vacío` (primero del fichero): `run('canceladas', [])` → `''`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo no válido no cancela la reserva`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo texto; y `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar una reserva activa con motivo` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `cancelar sin reserva lo dice` (existente, al final): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  Ejecutarlos y ver fallar los nuevos.
- [ ] **Step 2: Implementación** — en `src/app.js`: constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` comprueba primero la reserva (`sin reserva …`), después `REASONS.includes(reason)` (si no, `motivo no válido: ${REASONS.join(', ')}`), y solo entonces fija `status = 'cancelled'` y `reason`; `cancelledBookings()`; `run` pasa el motivo a `cancelBooking` y responde `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — un solo commit al quedar limpia su revisión, con la convención del proyecto referenciando 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5 h
- Estimación de implementación: 0.5 h
- Base de la estimación: 1 task, 1 fichero de código, sin incertidumbres; sin `estimation-log.md` de referencia.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND «motivo no válido: …» → Task 1, `cancelar sin motivo lo rechaza` y `un motivo no válido no cancela la reserva` (este con motivo fuera de la lista). ✓
- ADDED «El listado enseña el motivo» · THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anexo `quitar` · «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo `quitar` · la reserva de otra persona no se toca → sin observar: la app no modela personas (el comando `anular` de otras es 0011); el comportamiento actual de `cancelar` no cambia (avisado aquí). ⚠
- Review Focus → Task 1, `cancelar sin motivo lo rechaza`, `un motivo no válido no cancela la reserva`, `canceladas sin canceladas responde vacío`. ✓
- `canceladas` no lista las anuladas (decisión 6) → sin observar: la semilla no tiene reserva anulable y `anular` es de 0011; lo fija el filtro `status === 'cancelled'` (avisado en las decisiones). ⚠
