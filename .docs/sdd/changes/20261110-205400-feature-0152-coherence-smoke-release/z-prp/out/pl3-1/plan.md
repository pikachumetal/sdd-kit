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

1. Modelo y effort: Task 1 con Sonnet, effort medium (la hace la sesión en Native; el cambio cabe en un fichero y la spec fija los textos). La revisión final de rama va con `sdd-kit:effort-high` + `opus` (ejes Spec y Arquitectura) y `sdd-kit:effort-high` + `sonnet` (eje Código).
2. Ejecución: native, fijado en `sdd-kit.json`.
3. El motivo es obligatorio: `cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista («motivo no válido: …»). La spec solo dice «cancelar pide un motivo» y calla este caso.
4. El motivo se valida antes de buscar la reserva: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva Sur mar». La spec no fija el orden.
5. Los dos tests existentes de `test/cancel.test.js` pasan a llevar `--motivo`: su comportamiento sin motivo deja de existir por la decisión 3. Es el único cambio a tests ya escritos.
6. `canceladas` solo lista el estado `cancelled` (no `voided`, que es de la 0011); una línea por reserva, separadas por salto de línea; sin ninguna, responde «sin canceladas».
7. Coste estimado: ~1 h de implementación, sin subagentes.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` en el mismo objeto de `bookings` de `src/app.js`; `cancelBooking` valida contra una constante `REASONS` y `listCancelled` lee las reservas con `status === 'cancelled'`. `run` extrae `--motivo` de los parámetros.

**Tech Stack**: Node 22, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` dentro de su módulo único: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Texto de la interfaz en castellano; los textos son los de la spec, literales: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo cometido.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits en castellano, con el id de la feature: `feat(0010): …`.
- Atribución de commits según las reglas del harness.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 1, `canceladas sin canceladas lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin estructura nueva; un campo y dos funciones en el fichero existente.
- [x] **YAGNI gate**: sin abstracciones; una constante y una función de listado.
- [x] **Brownfield gate**: retrocompatible salvo el motivo obligatorio (decisión 3, pedido por la spec); respeta el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()` y el despacho de `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los tests de los dos escenarios, más los casos del Review Focus; los dos existentes pasan a llevar `--motivo`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `test/app.test.js`, `test/store.test.js` — sin relación.

### 1.2 a 1.5

No aplican (sin base de datos, migraciones, API ni pantallas).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo "sala ocupada"` llega partido en varios parámetros | Baja | Medio | `process.argv` ya entrega el valor entrecomillado como uno solo; el test usa `['Norte','lun','--motivo','sala ocupada']` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar canceladas

**Tras**: —
**Modelo**: Sonnet, effort medium; la hace el hilo principal en Native (sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `node src/app.js canceladas` solo en el mismo proceso, porque las reservas viven en memoria (la prueba de punta a punta es el test).

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`, con reservas `{ room, day, slot, status }`.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason): string`; `listCancelled(): string`; la reserva cancelada lleva `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con `run` importado de `../src/app.js`:
  - `cancelar una reserva activa`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte','lun'])` → el mismo texto.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - `canceladas enseña el motivo`: tras cancelar Norte lun con «sala ocupada», `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas lo dice`: sin ninguna cancelada → `'sin canceladas'`. Los tests de `canceladas` fijan su estado de partida explícitamente, porque las reservas viven en memoria y comparten módulo entre tests.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve el texto de motivo no válido si `reason` no está en `REASONS` (antes de buscar la reserva), `sin reserva …` si no existe, y si no guarda `booking.reason = reason` y responde ``cancelada ${room} ${day} (${reason})``; `listCancelled()` une con `\n` las líneas ``${room} ${day} — ${reason}`` de las reservas `cancelled`, o `'sin canceladas'`; en `run`, `cancelar` toma el valor tras `--motivo` (o `undefined`) y `canceladas` llama a `listCancelled`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 1 task en un fichero, textos fijados por la spec; incertidumbre baja; sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado enseña el motivo»: THEN responde «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → `cancelar sin motivo lo rechaza`; sin reserva → `cancelar sin reserva lo dice`; sin canceladas → `canceladas sin canceladas lo dice`. ✓
