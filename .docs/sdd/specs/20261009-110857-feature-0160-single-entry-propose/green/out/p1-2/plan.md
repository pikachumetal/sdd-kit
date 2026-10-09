---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, la hace la propia sesión en Native (Sonnet, effort medium): es un cambio de un fichero con firmas y textos fijados por la spec. El revisor final de rama va con `sdd-kit:effort-high` + `opus`; es la única revisión independiente de Native.
2. **Ejecución**: native, fijado en sdd-kit.json. Una task, sin interfaces entre tasks que revisar por separado.
3. **Sin `--motivo`, `cancelar` se comporta como hoy** (`cancelada Norte lun`) y `canceladas` lo enseña como `Norte lun — sin motivo`. La spec no dice qué pasa sin motivo; mantener lo de hoy no rompe el test existente `cancelar una reserva activa`. Si se quiere el motivo obligatorio, es una enmienda de la spec.
4. **El motivo se valida antes de buscar la reserva**: un motivo inválido responde «motivo no válido: …» y no cancela nada, exista o no la reserva.
5. **`resetBookings()` exportada de `src/app.js`** para que los tests partan de la reserva de Norte del lunes: el estado es de módulo y el test existente ya cancela esa reserva. Solo la usan los tests.
6. **`canceladas` lista solo el estado `cancelled`**: las `voided` (anular, 0011) no entran, como dice el Approach. Sin canceladas responde `sin canceladas`.
7. **Riesgos**: bajos; un fichero. **Coste**: ~0,5 h de implementación, sin subagentes salvo el revisor final.
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` acepta `--motivo` de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: el motivo se guarda en el objeto de la reserva (`reason`) al pasar a `cancelled`. `run` extrae `--motivo` de los parámetros y `listCancelled` filtra por estado.

**Tech Stack**: Node 22, sin dependencias, `src/app.js`, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Lista de motivos cerrada, en este orden y con estas grafías: `cambio de planes`, `sala ocupada`, `otro`.
- Textos exactos: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio. Texto de interfaz en castellano (Art. 4).

### De proceso

- Tests antes que código (Art. 2). Gate de cierre: `node --test` entero en verde.
- Commits con la convención del proyecto (`feat: …`); un commit por hito.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → como hoy, `cancelada Norte lun` · Task 1, `cancelar sin motivo conserva el comportamiento`
- `cancelar Norte lun --motivo` (sin valor) → `motivo no válido: …`, sin cancelar · Task 1, `motivo sin valor no es válido y no cancela`
- Motivo inválido no cancela: tras «motivo no válido», `cancelar Norte lun --motivo otro` aún cancela · Task 1, `un motivo no válido no cancela la reserva`
- `canceladas` sin ninguna cancelada → `sin canceladas`; una anulada no sale · Task 1, `canceladas sin canceladas` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, sin parser de opciones genérico.
- [x] **YAGNI gate**: ninguna abstracción nueva; solo la constante de motivos.
- [x] **Brownfield gate**: retrocompatible (sin `--motivo` igual que hoy); respeta el patrón de funciones exportadas de `app.js`.
- [x] **Constitution check**: Art. 2 (tests primero, gate `node --test`), Art. 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — motivo en `cancelBooking`, `listCancelled`, `resetBookings`, ramas `canceladas` y `--motivo` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios y del Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no depende de la cancelación.

### 1.2 a 1.6

No aplican (sin datos persistentes, migraciones, API ni UX). Dependencias: ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado de módulo compartido entre tests | Media | Bajo | `resetBookings()` en cada test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; Native: TDD del propio hilo.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; en otra ejecución con el mismo proceso no hay estado persistente, así que `canceladas` se comprueba en los tests.

**Interfaces**:
- Consume: nada.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room: string, day: string, reason?: string): string`; `listCancelled(): string`; `resetBookings(): void`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, con `beforeEach(resetBookings)` (importado de `../src/app.js`):
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `cancelada Norte lun (sala ocupada)`.
  - `motivo fuera de la lista`: `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → `motivo no válido: cambio de planes, sala ocupada, otro`.
  - `canceladas enseña el motivo`: tras cancelar con «sala ocupada», `run('canceladas', [])` → `Norte lun — sala ocupada`.
  - `cancelar sin motivo conserva el comportamiento`: `run('cancelar', ['Norte','lun'])` → `cancelada Norte lun`; luego `canceladas` → `Norte lun — sin motivo`.
  - `motivo sin valor no es válido y no cancela`: `run('cancelar', ['Norte','lun','--motivo'])` → `motivo no válido: cambio de planes, sala ocupada, otro`.
  - `un motivo no válido no cancela la reserva`: tras un motivo inválido, `cancelar Norte lun --motivo otro` → `cancelada Norte lun (otro)`.
  - `canceladas sin canceladas`: `run('canceladas', [])` → `sin canceladas`.
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte','lun'])`, `canceladas` → `sin canceladas`.
  - Los dos tests existentes pasan a usar el mismo `beforeEach`.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos; los dos existentes siguen pasando.
- [ ] **Step 3: Implementación** en `src/app.js`: las firmas de Interfaces; `cancelBooking` guarda `booking.reason = reason` y responde con ` (<motivo>)` solo si hay motivo; `run('cancelar', params)` toma el valor que sigue a `--motivo` (`undefined` si falta) y, si la bandera está y el valor no es de `REASONS`, responde el texto de «motivo no válido» sin buscar la reserva; `run('canceladas')` devuelve `listCancelled()`; `listCancelled` une con `\n` las reservas `cancelled` como `<sala> <día> — <motivo o sin motivo>`, o `sin canceladas`; `resetBookings` restaura la reserva inicial (Norte, lun, 10:00-12:00, activa) en el mismo array.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: todos en verde.
- [ ] **Step 5: Commit de la task** — `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 1 task, 1 fichero de código, sin incertidumbres; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` y `node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1, `cancelar con motivo de la lista` y `motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, `canceladas enseña el motivo`. ✓
- No entra: anulaciones del responsable (0011) → N/A (confirmado en spec). ✓
- Review Focus → Task 1, tests `cancelar sin motivo conserva el comportamiento`, `motivo sin valor no es válido y no cancela`, `un motivo no válido no cancela la reserva`, `canceladas sin canceladas`, `canceladas no lista las anuladas`. ✓
