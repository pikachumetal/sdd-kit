---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 con `sdd-kit:effort-medium` + `sonnet`; el código cabe en un fichero y los tests traen los valores literales. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** (la spec no lo fija): responde «motivo no válido: cambio de planes, sala ocupada, otro», como un motivo fuera de la lista. Primero se comprueba que hay reserva: `cancelar Sur mar` sigue respondiendo «sin reserva Sur mar», sin motivo o con él.
4. **Test existente `cancelar una reserva activa`**: ya no cumple el comportamiento (pide motivo); se actualiza para pasar `--motivo "sala ocupada"` y esperar «cancelada Norte lun (sala ocupada)», el valor del THEN de la spec. La spec lo declara en «Modificadas: bookings».
5. **`canceladas`**: una línea por reserva con estado `cancelled`, `<sala> <día> — <motivo>`, unidas con salto de línea. Las `voided` (anulaciones, 0011) no entran. Sin canceladas devuelve cadena vacía.
6. **Coste estimado**: ~1 h; sin subagentes de tasks, solo los de la revisión final.
7. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.
8. La spec numera sus decisiones 1 y 3 (falta la 2); no cambia nada del plan.

**Goal**: cancelar exige un motivo de una lista cerrada, lo guarda con la reserva y `canceladas` lo lista.

**Architecture**: el motivo se guarda como campo `reason` de la reserva cancelada, en `src/app.js`. `cancelBooking(room, day, reason)` valida contra la lista y `run` parsea `--motivo`; `canceladas` filtra las reservas con estado `cancelled`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y sus tests: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de salida literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano.

### De proceso

- Tests antes que código; commit de la task uno solo, al quedar limpia su revisión.
- Commits con la atribución del harness.
- No se toca `voidBooking` ni `anular` (0011).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar», no el error de motivo · Task 1, `cancelar sin reserva lo dice` (sigue pasando)
- Una reserva anulada con `anular` no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas` (`test/void.test.js`)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y un comando de filtro; nada más simple.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo, que la spec cambia; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (Art. 2); texto en castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/void.test.js` — `canceladas` no lista las anuladas (proceso aparte, estado limpio).

**Modificar**:

- `src/app.js` — `cancelBooking` valida y guarda el motivo; `listCancelled`; `run` parsea `--motivo` y enruta `canceladas`.
- `test/cancel.test.js` — tests de los escenarios de la spec.

**NO se tocan**:

- `voidBooking` y `anular` — son de la 0011.
- `test/store.test.js`, `test/app.test.js` — no dependen de `cancelar`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Memoria, sin migración.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor detrás (`params` termina en `--motivo`) | Baja | Baja | `undefined` no está en la lista: responde «motivo no válido» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (Native: lo ejecuta la sesión)
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/void.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; la salida de `canceladas` es un comando aparte en la misma ejecución de la sesión (las reservas viven en memoria), por eso el listado se prueba por `run`.

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)`, `listCancelled()`, comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/void.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (`run` es la API pública; el estado es compartido en el proceso, así que cada test que cancela usa su propia reserva o el orden del fichero lo contempla):
  - `cancelar una reserva activa` (modificado): `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista`: antes de cancelar, con la reserva de Norte lun activa, `run('cancelar', ['Norte','lun','--motivo','porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → mismo mensaje; después `run('libres', ['10:00-12:00'])` sigue sin incluir Norte.
  - `cancelar sin reserva lo dice` (sin cambios): `run('cancelar', ['Sur','mar'])` → `'sin reserva Sur mar'`.
  - `canceladas enseña el motivo`: tras cancelar Norte lun con «sala ocupada», `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: se anula una reserva con `anular` y `run('canceladas', [])` no la contiene.

  Cada fichero de test corre en su propio proceso, con estado limpio. Dentro de `cancel.test.js` el orden importa: los tests de motivo inválido y sin motivo van antes del que cancela Norte lun; `canceladas enseña el motivo` va después de él. `canceladas no lista las anuladas` va en `test/void.test.js` (nuevo): `run('anular', ['Norte','lun'])` y `run('canceladas', [])` → `''`.
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const reasons = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `cancelBooking(room, day, reason)`: primero `findBooking`; si no hay → `sin reserva ${room} ${day}`; si `!reasons.includes(reason)` → `motivo no válido: ${reasons.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`.
  - `listCancelled()`: `bookings.filter(b => b.status === 'cancelled').map(b => `${b.room} ${b.day} — ${b.reason}`).join('\n')`.
  - `run`: `cancelar` toma `reason = params[params.indexOf('--motivo') + 1]` cuando `--motivo` está (si no está, `undefined`); `canceladas` → `listCancelled()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js test/void.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 1 task en un fichero, sin dependencias; la incertidumbre es el estado compartido en memoria entre tests.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED cancelar con motivo: THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND motivo fuera de la lista → Task 1, `cancelar con motivo fuera de la lista`. ✓
- ADDED listado: THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Capacidad `bookings` en `capabilities/`: no existe en el proyecto → N/A. ✓
- Review Focus (3 líneas) → Task 1, tests `cancelar sin motivo no cancela`, `cancelar sin reserva lo dice`, `canceladas no lista las anuladas`. ✓
