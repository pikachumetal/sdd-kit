---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace la sesión (Native), en gama media (Sonnet, effort medium) — son un fichero y unas pocas líneas, y el plan trae firmas y asserts. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo`, o con `--motivo` sin valor, responde lo mismo que un motivo fuera de la lista («motivo no válido: …») y no cancela: la spec dice que cancelar «pide» un motivo y no fija este caso.
4. El motivo se valida antes de buscar la reserva: `cancelar Sur mar --motivo "x"` responde «motivo no válido…», no «sin reserva Sur mar». La spec no fija el orden.
5. `canceladas` solo lista reservas en estado `cancelled` (no las `voided` de `anular`) y sin ninguna cancelada responde cadena vacía; una línea por reserva, en orden de cancelación, unidas con `\n`.
6. El test existente `cancelar una reserva activa` (`test/cancel.test.js`) cambia: sin motivo ya no cancela, así que pasa a usar `--motivo "sala ocupada"`. Es consecuencia directa del primer escenario, no un cambio de alcance.
7. El estado de `bookings` es de módulo y compartido por los tests de un fichero: el orden de los tests de `test/cancel.test.js` importa (los de motivo inválido, que no cancelan, van antes del que cancela Norte lun). No se añade ningún `reset` (YAGNI).
8. Riesgo alto: ninguno. Coste estimado: ~1,5 h; sin despachos, coste de tokens el de una sesión corta.
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección. Una (canceladas excluye anuladas) no tiene test posible con este fixture.
10. La spec numera sus decisiones 1 y 3 (falta la 2); no afecta al plan y no se toca: está aprobada.

**Goal**: `cancelar` exige un motivo de la lista cerrada y el nuevo comando `canceladas` lista cada reserva cancelada con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status`, en `src/app.js`; `run` extrae el motivo del argumento `--motivo` y `cancelBooking` lo valida contra una constante `CANCEL_REASONS`. `canceladas` filtra `bookings` por `status === 'cancelled'`. Sin dependencias ni ficheros nuevos.

**Tech Stack**: Node 22 sin dependencias externas, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json` · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un solo fichero existente (`src/app.js`), sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada: `src/app.js` (`architecture.md`).
- Lista de motivos cerrada, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de interfaz en castellano, literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (el guion es `—`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Native: la sesión implementa cada task con TDD (RED visto fallar antes del código); `execution: native` fijado en `sdd-kit.json`.
- Tests antes que código (constitution, art. 2); texto de interfaz y documentos en castellano (art. 4).
- Commits: uno por task al quedar limpia su revisión; mensaje convencional (`feat: …`) con la atribución de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (sin valor) → mismo mensaje, reserva activa · Task 1, `cancelar con --motivo sin valor no cancela`
- `canceladas` con una reserva solo activa → salida vacía, no la lista de activas · Task 2, `canceladas sin ninguna cancelada responde vacío`
- `canceladas` con una reserva anulada por `anular` → no aparece (filtra por `cancelled`): sin test, porque el fixture solo tiene una reserva y no se puede anular y cancelar la misma; lo cubre la revisión del código de `cancelledList`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un solo fichero, una constante y dos ramas en `run`.
- [x] **YAGNI gate**: sin abstracciones nuevas; sin `reset` de estado para tests.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` ahora exige motivo); sigue el patrón de `run` y de `voidBooking`; sin refactor oportunista.
- [x] **Constitution check**: arts. 1, 2 y 4 respetados (flujo SDD, tests primero, castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledList()` y las ramas `cancelar` y `canceladas` de `run`.
- `test/cancel.test.js` — ajusta el test existente y añade los de motivo y de `canceladas`.

**NO se tocan**:

- `test/app.test.js`, `test/store.test.js` — no ejercitan `cancelar` ni `canceladas`.
- `voidBooking` y el comando `anular` — son de la 0011.
- `README.md`, `CHANGELOG.md` — el changelog lo mueve el cierre de release.

### 1.2 Modelo de datos

Cada reserva en `bookings` gana `reason?: string`, puesta solo al cancelar. En memoria, sin migración.

### 1.6 Dependencias

Ninguna. Previa: 0007 (cancelación por sala y día), ya cerrada.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado de módulo compartido entre tests del fichero | media | un test falla según el orden | decisión 7: el orden está fijado en las tasks |
| Cambiar el test existente parece quitar cobertura | baja | — | decisión 6: sigue cubriendo la cancelación con motivo |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); la task trae las firmas, los valores y los asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "x"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js`.
- Produce: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` que, con motivo válido, pone `status = 'cancelled'` y `reason = reason`; `run('cancelar', [room, day, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (los que no cancelan, antes):
  - `cancelar con motivo fuera de la lista` → `run('cancelar', ['Norte', 'lun', '--motivo', 'x'])` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela` → `run('cancelar', ['Norte', 'lun'])` es ese mismo mensaje.
  - `cancelar con --motivo sin valor no cancela` → `run('cancelar', ['Norte', 'lun', '--motivo'])` es ese mismo mensaje.
  - `cancelar una reserva activa` (el existente, ajustado) → `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`; al ir después de los tres anteriores, prueba también que no cancelaron.
  - `cancelar sin reserva lo dice` (existente, con motivo) → `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` es `'sin reserva Sur mar'`.
  Ejecuta `node --test test/cancel.test.js` y verifica que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `CANCEL_REASONS`; `cancelBooking(room, day, reason)` responde `motivo no válido: ${CANCEL_REASONS.join(', ')}` si `reason` no está en la lista, `sin reserva …` si no hay reserva activa y, si no, cancela guardando `reason` y responde `cancelada ${room} ${day} (${reason})`; la rama `cancelar` de `run` toma `params[params.indexOf('--motivo') + 1]` (`undefined` si no hay `--motivo` o no tiene valor).
- [ ] **Step 3: Build** — no hay build (Node sin transpilar). Esperado: n/a.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium); la task trae las firmas, los valores y los asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada invocación de `node src/app.js` arranca con las reservas en memoria de partida y no conserva una cancelación hecha antes; solo se ve a través de los tests, que comparten el módulo.

**Interfaces**:
- Consume: `bookings` con `status` y `reason` (Task 1); `voidBooking` / `anular` de `src/app.js` para la entrada de las anuladas.
- Produce: `run('canceladas', [])` → líneas `${room} ${day} — ${reason}`, una por reserva con `status === 'cancelled'`, en orden de `bookings`, unidas con `'\n'`; cadena vacía si no hay ninguna.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin ninguna cancelada responde vacío` → colocado antes de `cancelar una reserva activa`, con Norte lun aún activa: `run('canceladas', [])` es `''` (una reserva activa no aparece).
  - `canceladas enseña el motivo` → al final del fichero, tras cancelar Norte lun con «sala ocupada»: `run('canceladas', [])` es `'Norte lun — sala ocupada'`.
  Ejecuta `node --test test/cancel.test.js` y verifica que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `cancelledList()` que filtra `bookings` por `status === 'cancelled'` y mapea a `${room} ${day} — ${reason}`; rama `if (cmd === 'canceladas') return cancelledList()` en `run`.
- [ ] **Step 3: Build** — no hay build. Esperado: n/a.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks en un fichero, sin dependencias ni migración; el estimation-log del proyecto no tiene features de referencia.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND «motivo no válido: cambio de planes, sala ocupada, otro» ante un motivo fuera de la lista → Task 1, `cancelar con motivo fuera de la lista`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Decisión 1 de la spec (lista cerrada) → Task 1, el mensaje de error enumera la lista y `CANCEL_REASONS` la fija. ✓
- No entra: anulaciones del responsable (0011) → N/A (confirmado en spec); `anular` no se toca. ✓
- Review Focus: sin motivo y `--motivo` sin valor → Task 1, `cancelar sin motivo no cancela` y `cancelar con --motivo sin valor no cancela`. ✓
- Review Focus: canceladas vacía con solo activas → Task 2, `canceladas sin ninguna cancelada responde vacío`. ✓
- Review Focus: canceladas excluye anuladas → sin observar: el fixture no permite sembrarla (avisado en el Review Focus; lo mira la revisión de código). ⚠
