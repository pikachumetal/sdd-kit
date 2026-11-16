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

1. Modelo y effort: una sola task, en la sesión (Native, Sonnet, effort medium) — el cambio es un fichero y dos comandos, con textos exactos en la spec; la revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»: la spec dice que cancelar «pide» un motivo y no fija este caso; lo trato como motivo fuera de la lista.
4. Se valida el motivo antes de buscar la reserva: un motivo inválido no cancela nada y no oculta el error con «sin reserva».
5. `canceladas` lista solo el estado `cancelled`; las `voided` (comando `anular`) no salen. Sin canceladas responde cadena vacía: la spec no fija texto y no lo invento.
6. Se exporta `resetBookings()` de `src/app.js` para que cada test parta del mismo estado (las reservas viven en memoria y `cancelar Norte lun` solo puede hacerse una vez). Sin él los tests dependerían del orden.
7. El test existente `cancelar una reserva activa` se actualiza: su texto sin motivo ya no es el contrato (MODIFIED de hecho, la spec lo declara ADDED).
8. La regla «la reserva de otra persona no se toca» (anexo de la spec) no tiene aún concepto de persona en el modelo: se observa como «cancelar otro día no toca la reserva de Norte lun» (ver §4, ⚠).
9. Coste estimado: ~1 h, sin subagentes.
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason`; `cancelBooking(room, day, reason)` valida y guarda; `run` extrae el valor de `--motivo` y despacha `canceladas`. Todo en `src/app.js`, sin dependencias.

**Tech Stack**: Node 22 (`node >=20`), `node --test`, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia el comportamiento de `src/app.js` sin módulo, dependencia ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- Lista de motivos cerrada, en este orden y con estas grafías: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga), «sin reserva <sala> <día>».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2).
- Native: la sesión implementa la task; `sdd task start`/`done` con su ledger; revisión final de rama con `sdd-verify`.
- Commits con la convención del proyecto y la atribución del kit; un commit por hito.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo responde motivo no válido`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- reserva anulada con `anular` → no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas`
- `canceladas` sin ninguna cancelada → cadena vacía, sin fallo · Task 1, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, una función ampliada y un comando.
- [x] **YAGNI gate**: ninguna abstracción nueva; `resetBookings` es el mínimo para tests deterministas.
- [x] **Brownfield gate**: `libres`, `reservar` y `anular` no cambian; el texto de `cancelar` cambia por la spec; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo y lo guarda en la reserva; `run` lee `--motivo` y despacha `canceladas`; se exporta `resetBookings()`.
- `test/cancel.test.js` — los tests de los escenarios de la spec y del Review Focus; el existente `cancelar una reserva activa` pasa a llevar motivo.

**NO se tocan**:

- `scripts/lint.mjs` — sigue valiendo.
- `test/app.test.js` — `libres` y `reservar` no cambian.
- `voidBooking` y el comando `anular` — son de la 0011.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`; las activas no la llevan. Reservas en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica (CLI): `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna. La 0011 (anular) es independiente.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests acoplados por el estado en memoria | Media | Bajo | `resetBookings()` en cada test |
| Motivo con espacios mal extraído de los argumentos | Baja | Medio | Test con `"sala ocupada"` pasado como un único argumento, como lo entrega el shell |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Native, en la sesión (Sonnet, effort medium): la task trae textos y firmas y no interpreta prosa.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend (`src/app.js`), tooling (lint).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)» y `canceladas` (en la misma ejecución del programa) lo lista. Al ser reservas en memoria, entre invocaciones del CLI no persisten; lo observa el test.

**Interfaces**:
- Consume: de `src/app.js`, `findBooking(room, day)` (reserva activa de la sala y día) y el array `bookings` (`{ room, day, slot, status }`, estado inicial: Norte lun 10:00-12:00 `active`).
- Produce: `cancelBooking(room, day, reason)` → string; `listCancelled()` → string (líneas «<sala> <día> — <motivo>» unidas por `\n`); `resetBookings()` → restaura el estado inicial; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `beforeEach(resetBookings)` (de `node:test`):
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte','lun','--motivo','porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo responde motivo no válido`: `run('cancelar', ['Norte','lun'])` → el mismo texto, y `run('libres', ['10:00-12:00'])` sigue siendo `'Sur'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - `cancelar otro día no toca la reserva`: `run('cancelar', ['Norte','mar','--motivo','otro'])` → `'sin reserva Norte mar'`, y `run('libres', ['10:00-12:00'])` sigue siendo `'Sur'`.
  - `canceladas enseña el motivo`: cancelar Norte lun con `sala ocupada`; `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte','lun'])`; `run('canceladas', [])` → `''`.
  - `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`.
  Se ejecuta y se ve fallar (`resetBookings` aún no existe).
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida `REASONS.includes(reason)` antes de `findBooking` y guarda `booking.reason = reason`; `run` toma `reason = params[params.indexOf('--motivo') + 1]` (`undefined` si falta la opción); `'canceladas'` → `listCancelled()`; `export function resetBookings()` reemplaza el contenido de `bookings` por el inicial. Debe evitarse que `--motivo` sin valor tome un valor ajeno: `indexOf` = -1 da `params[0]`, que es la sala y no está en la lista, así que responde «motivo no válido».
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0.5 h
- Estimación de cierre: 0.5 h
- Base de la estimación: 1 task, un fichero de código y uno de tests, textos fijados por la spec; incertidumbre baja. Sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde “cancelada Norte lun (sala ocupada)”» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND «motivo fuera de la lista responde “motivo no válido: …”» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN «responde “Norte lun — sala ocupada”» → Task 1, `canceladas enseña el motivo`. ✓
- Anexo: `quitar` «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo: «la reserva de otra persona no se toca» → Task 1, `cancelar otro día no toca la reserva`. ⚠ el modelo no tiene personas: se observa solo que cancelar otro día no toca la reserva existente (avisado en las decisiones).
- Review Focus: sin motivo → `cancelar sin motivo responde motivo no válido`; sin reserva con motivo → `cancelar sin reserva lo dice`; anuladas → `canceladas no lista las anuladas`; vacío → `canceladas sin canceladas responde vacío`. ✓
