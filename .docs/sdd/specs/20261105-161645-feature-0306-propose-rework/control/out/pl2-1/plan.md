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

1. Una sola task — el cambio son dos funciones en `src/app.js` y sus tests; partirlo no deja nada que un revisor apruebe por separado.
2. Modelo de la task: el de la sesión (Native, gama media) — el plan lleva firmas, textos y asserts; no hay prosa que interpretar.
3. Ejecución Native — una task, un fichero de código, el test de la task caza el error y el plan cabe en un contexto.
4. `cancelar` valida el motivo **antes** de buscar la reserva — la spec no fija el orden; así un motivo inválido nunca cancela. Sin `--motivo` cuenta como motivo inválido (no está en la lista).
5. `canceladas` sin ninguna cancelada responde cadena vacía y con varias une las líneas con `\n` — la spec solo fija una línea.
6. Los tests de `test/cancel.test.js` comparten el estado en memoria de `src/app.js`; el orden de los tests importa y el plan lo fija.
7. «la reserva de otra persona no se toca» (Anexo de la spec): el código no tiene noción de persona, así que nada lo observa; se avisa en §4 (⚠).
8. Coste: ~0,5 h, sin subagentes.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status: 'cancelled'`. `cancelBooking` recibe el motivo y lo valida contra `CANCEL_REASONS`; `run` lo extrae de `--motivo`. `listCancelled()` filtra por estado.

**Tech Stack**: Node 22, sin dependencias, `node --test`; un solo fichero de entrada `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, porque una task sobre un solo fichero, un error lo caza el test de su task y el plan cabe en un contexto, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos o datos; cambia dos funciones de `src/app.js`.

## Restricciones globales

### De código

- Texto de la interfaz en castellano, literal de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada», «sin reserva <sala> <día>».
- Lista de motivos cerrada y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Node ≥ 20, sin dependencias externas; nada de tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: el hilo principal implementa con TDD; commit de la task al quedar limpia su revisión.
- Commits con la convención del proyecto (`feat: …`), referenciando 0010.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `canceladas` sin ninguna cancelada → cadena vacía, sin error · Task 1, `canceladas sin cancelaciones responde vacío`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin abstracciones nuevas; una constante y una función.
- [x] **YAGNI gate**: nada se abstrae con menos de 3 usos.
- [x] **Brownfield gate**: retrocompatible salvo el contrato que la spec cambia (`cancelar` exige motivo); respeta el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope (`voidBooking` y `anular` no se tocan: 0011).
- [x] **Constitution check**: tests antes que código (Art. 2); textos en castellano (Art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)` con validación y `reason` guardado, `listCancelled()`, y `run` con `--motivo` y el comando `canceladas`.
- `test/cancel.test.js` — los tests de la spec y el ajuste de los dos existentes.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — no los afecta.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tests comparten el estado en memoria y un orden distinto rompe el listado | Media | Bajo | Orden fijado en la task; el test de `canceladas` cancela su propia reserva en la misma pasada |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar las canceladas

**Tras**: —
**Modelo**: el de la sesión en Native (gama media: Sonnet, effort medium); el plan trae firmas, textos y asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (lint)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reserva `{ room, day, slot, status }`).
- Produce: `cancelBooking(room, day, reason)` → texto; `listCancelled()` → texto; comando `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (comparten estado):
  - `cancelar con motivo fuera de la lista` : `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela` : `run('cancelar', ['Norte','lun'])` → mismo texto; después `run('libres', ['10:00-12:00'])` → `'Sur'` (Norte sigue reservada).
  - `cancelar una reserva activa` (ajustado): `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo` : `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `cancelar sin reserva lo dice` (ajustado): `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - Primero de todos, antes de cancelar nada: `canceladas sin cancelaciones responde vacío` → `run('canceladas', [])` → `''`.
  Ejecuta y comprueba que fallan por el motivo esperado.
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: si `!CANCEL_REASONS.includes(reason)` → `` `motivo no válido: ${CANCEL_REASONS.join(', ')}` ``; si no hay reserva → `` `sin reserva ${room} ${day}` ``; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `` `cancelada ${room} ${day} (${reason})` ``.
  - `export function listCancelled()`: reservas con `status === 'cancelled'` → `` `${room} ${day} — ${reason}` `` unidas por `\n`.
  - En `run`: `cancelar` toma el motivo de `params[params.indexOf('--motivo') + 1]` (`undefined` si falta la opción) y `canceladas` llama a `listCancelled()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo: `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,3h
- Base de la estimación: 1 task, un fichero de código, sin incertidumbres
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED Cancelar pide un motivo — THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED Cancelar pide un motivo — AND motivo fuera de la lista → Task 1, `cancelar con motivo fuera de la lista`. ✓
- ADDED El listado enseña el motivo — THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anexo `quitar`: sin reserva → «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo `quitar`: la reserva de otra persona no se toca → sin observar: el código no modela personas (avisado en las decisiones, punto 7). ⚠
- Review Focus (3 líneas) → Task 1, tests `cancelar sin motivo no cancela`, `canceladas sin cancelaciones responde vacío`, `cancelar sin reserva lo dice`. ✓
