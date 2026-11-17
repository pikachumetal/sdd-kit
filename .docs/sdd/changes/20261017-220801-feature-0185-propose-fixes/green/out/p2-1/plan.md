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

1. **Modelo y effort por task**: las dos tasks las hace la sesión (Native), en gama media (Sonnet, effort medium): el plan trae firmas, asserts y orden de tests. La revisión final de rama no sigue esta política: Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, fijado en `sdd-kit.json`; además son 2 tasks sobre un solo fichero, encadenadas por un campo, y el plan cabe en un contexto.
3. **`cancelar` sin `--motivo`** (la spec no lo fija): responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela, porque «cancelar pide un motivo». El test existente `cancelar una reserva activa` pasa a llevar `--motivo`.
4. **Orden de comprobaciones** (la spec no lo fija): primero la reserva, luego el motivo. `cancelar Sur mar` (sin reserva) sigue respondiendo «sin reserva Sur mar» aunque falte el motivo; así el test existente `cancelar sin reserva lo dice` no cambia.
5. **`canceladas` sin canceladas** devuelve la cadena vacía: no invento un texto visible que la spec no da.
6. **Estado compartido en los tests**: `bookings` vive en memoria y no se reinicia entre tests del mismo fichero; el orden de los tests de `test/cancel.test.js` es parte del diseño (ver las tasks). No añado un `reset` exportado (YAGNI).
7. **Riesgo para la validación**: las reservas viven en memoria y cada `node src/app.js …` es un proceso nuevo, así que `canceladas` lanzado a mano en otra invocación siempre sale vacío. El escenario «El listado enseña el motivo» solo se observa dentro de un proceso (los tests). No es un fallo del plan, es el motor actual.
8. **Sin observar**: que `canceladas` excluya las anuladas (`voided`): no hay forma de sembrar una segunda reserva activa sin tocar el motor. El filtro es `status === 'cancelled'`; queda para la revisión de código.
9. **Coste estimado**: ~0,5 h, sin despachos (Native).
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` en el mismo objeto de `bookings`; `cancelBooking` valida contra una constante `REASONS`; `canceladas` filtra por `status === 'cancelled'`. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node 22, sin dependencias; `node --test`; `scripts/lint.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y sus tests: sin módulo, dependencia ni contrato nuevo entre módulos.

## Restricciones globales

### De código

- Texto de la interfaz en castellano, con los literales exactos de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (guion largo).
- Lista de motivos cerrada y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- `src/app.js` sin tabuladores (lo comprueba `scripts/lint.mjs`).
- Node sin dependencias externas; un solo fichero de entrada `src/app.js`.

### De proceso

- Política de modelos: gama media para las tasks (Sonnet, effort medium); los ejes de la revisión final, los de `sdd-verify`.
- Modo de ejecución: native.
- Commits: uno por task; mensaje en castellano y terminado en `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- Un motivo fuera de la lista no cancela: tras «motivo no válido» la sala sigue ocupada (`libres 10:00-12:00` → `Sur`) · Task 1, `un motivo fuera de la lista no cancela`
- `cancelar` de una reserva inexistente → «sin reserva …», no «motivo no válido» · Task 1, `cancelar sin reserva lo dice` (sin cambios)
- `canceladas` sin ninguna cancelada → cadena vacía, sin error · Task 2, `canceladas sin canceladas devuelve vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un filtro; nada más.
- [x] **YAGNI gate**: sin abstracciones nuevas; una constante y dos funciones.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (la respuesta de `cancelar`); respeta el patrón de `app.js`; sin refactor fuera de scope. `voidBooking` y la 0011 quedan fuera.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()` y los dos ramales de `run`.
- `test/cancel.test.js` — tests de los dos escenarios y el existente adaptado.

**NO se tocan**:

- `voidBooking` en `src/app.js` — las anulaciones del responsable son la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.
- `PRODUCT.md`, `README.md` — no citan el texto de `cancelar`; el término «Cancelación» no cambia.

### 1.2–1.4, 1.6

No aplican: sin datos persistentes, migraciones, API ni dependencias.

### 1.5 UX

No aplica: salida de terminal, con los textos de las Restricciones globales.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del fichero | Alta | Medio | Orden de tests fijado en las tasks |
| `canceladas` no observable a mano entre invocaciones | Cierta | Bajo | Avisado en las decisiones; se valida con los tests |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y commiteados con la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` y `node scripts/lint.mjs`; esperado: tests verdes y «lint: sin hallazgos».
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` devuelve `string`; la reserva cancelada lleva `reason` (uno de `REASONS`) y `status: 'cancelled'`. `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (el estado se comparte y la reserva de Norte lun solo existe hasta que se cancela):
  - `cancelar sin reserva lo dice` (existente, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo mensaje, y `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar una reserva activa` (existente, adaptado): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
- [ ] **Step 2: Ver los RED fallar** — `node --test test/cancel.test.js`; esperado: fallan los tres que llevan motivo.
- [ ] **Step 3: Implementación** en `src/app.js`: constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` busca la reserva (si no hay, `sin reserva ${room} ${day}`), después valida `REASONS.includes(reason)` (si no, `motivo no válido: ${REASONS.join(', ')}`, sin tocar la reserva) y, si pasa, guarda `status = 'cancelled'` y `reason` y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el ramal `cancelar` lee el valor que sigue a `--motivo` en `params` (`undefined` si falta) y lo pasa como tercer argumento.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` y `node scripts/lint.mjs`; esperado: verdes.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y commiteados con la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` y `node scripts/lint.mjs`; esperado: verdes.
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada invocación de `node src/app.js` es un proceso nuevo: `canceladas` solo muestra «Norte lun — sala ocupada» dentro del proceso de los tests (decisión 7).

**Interfaces**:
- Consume: de la Task 1, las reservas con `status: 'cancelled'` y `reason`.
- Produce: `listCancelled()` devuelve `string`, una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas con `\n`; `''` si no hay. `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas sin canceladas devuelve vacío`: el primero del fichero, antes de cualquier test que cancele: `run('canceladas', [])` → `''`.
  - `canceladas enseña el motivo`: después de `cancelar una reserva activa`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
- [ ] **Step 2: Ver los RED fallar** — `node --test test/cancel.test.js`; esperado: ambos fallan (hoy `canceladas` responde `'salas'`).
- [ ] **Step 3: Implementación** en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'`; `run` responde `listCancelled()` al comando `canceladas`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` y `node scripts/lint.mjs`; esperado: verdes.
- [ ] **Step 5: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un fichero; incertidumbre baja (estado compartido entre tests); sin `estimation-log.md` todavía.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo» · AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo fuera de la lista no cancela` (además comprueba que no cancela). ✓
- ADDED «El listado enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Excluir las anuladas de `canceladas` → sin observar: no hay forma de sembrar otra reserva activa (avisado en la decisión 8). ⚠
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza`; motivo inválido no cancela → Task 1, `un motivo fuera de la lista no cancela`; sin reserva → Task 1, `cancelar sin reserva lo dice`; sin canceladas → Task 2, `canceladas sin canceladas devuelve vacío`. ✓
