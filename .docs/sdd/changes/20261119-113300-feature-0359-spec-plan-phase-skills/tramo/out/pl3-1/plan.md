---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Una sola task — los dos escenarios de la spec tocan `cancelBooking`, `run` y el mismo fichero de test; partirlos no daría dos entregables que un revisor pudiera aceptar por separado.
2. Modelo de la task: `sdd-kit:effort-medium` + `sonnet` — el plan trae firmas, textos y asserts; no hay que interpretar prosa. La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`), también con una sola task.
3. Ejecución native, fijada en `sdd-kit.json`.
4. `--motivo` es obligatorio: `cancelar Norte lun` sin motivo responde con el mismo texto que un motivo fuera de la lista (la spec dice «cancelar pide un motivo»). El test que ya existía, `cancelar una reserva activa`, deja de valer tal cual y se actualiza en la task.
5. La validación del motivo va antes de buscar la reserva: `cancelar Sur mar --motivo "x"` responde «motivo no válido…», no «sin reserva». Elección mía; la spec no lo fija.
6. `canceladas` lista solo las de estado `cancelled`, no las `voided` (anulaciones, fuera de scope por la 0011).
7. Sin `canceladas` vacías fijadas por la spec: sin reservas canceladas responde cadena vacía (como `libres` cuando no hay ninguna). Entra en el Review Focus.
8. Riesgo alto: ninguno. Coste estimado: ~1 h; sin subagentes de implementación.
9. Gate de cierre: el de `operations.md` §Testing, literal.
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y el comando `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: El motivo se guarda en la propia reserva (`reason`) al pasar a `cancelled`. `run` extrae el valor de `--motivo` de los argumentos y `canceladas` filtra `bookings` por estado. Todo en `src/app.js`, el único fichero de entrada.

**Tech Stack**: Node 22, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque una sola task, sin interfaces entre tasks, un error lo caza el test de su task y el plan cabe de sobra en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de un fichero existente; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js` (architecture.md).
- Texto de la interfaz en castellano (constitution, art. 4).
- La lista de motivos es cerrada y su orden, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código; gate de cierre: `node --test` entero en verde (constitution, art. 2).
- Git-flow: la rama es `feature/0010-cancel-reason`.
- Los commits terminan con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo «motivo no válido…» · Task 1, `cancelar con --motivo sin valor`
- `canceladas` sin ninguna cancelada → cadena vacía, sin fallar · Task 1, `canceladas sin canceladas`
- Reserva anulada con `anular` → no sale en `canceladas` · Task 1, `canceladas no lista las anuladas`
- Motivo válido pero reserva inexistente → «sin reserva Sur mar» · Task 1, `cancelar sin reserva sigue diciéndolo`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un campo más de la reserva; sin tablas ni módulos.
- [x] **YAGNI gate**: una constante con la lista y un filtro; sin abstracciones.
- [x] **Brownfield gate**: `cancelar` sin motivo cambia de respuesta (decidido en la spec: «pide un motivo»); `libres`, `reservar` y `anular` no se tocan.
- [x] **Constitution check**: tests antes que código, castellano, git-flow.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe el motivo, lo valida y lo guarda; nuevo `listCancelled`; `run` conecta `--motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de la task, y se actualizan los dos existentes.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, feature 0011.
- `test/app.test.js`, `test/store.test.js` — no dependen de `cancelar`.

### 1.2 Modelo de datos

La reserva gana `reason` (string, solo presente si `status === 'cancelled'`). En memoria; sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un test existente asume `cancelar` sin motivo | Alta | Bajo | Se actualizan en la Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en native lo hace la sesión, que va en gama media
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task (Native: TDD del propio hilo)

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona usuaria ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)». Con `cancelar` y `canceladas` en una misma invocación el estado en memoria se pierde, así que el listado se prueba por `run`, como el resto de tests.

**Interfaces**:
- Consume: nada. Usa lo que ya hay en `src/app.js`: `bookings` (`{ room, day, slot, status }`), `findBooking(room, day)` (solo `active`), `run(cmd, params)`.
- Produce:
  - `export const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`
  - `export function cancelBooking(room, day, reason)` → `string`
  - `export function listCancelled()` → `string`, una línea por reserva cancelada, unidas con `\n`
  - `run('cancelar', [room, day, '--motivo', reason])` y `run('canceladas', [])`

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituye los dos tests existentes por estos y añade el resto. Cada test parte de un estado fresco: `bookings` es estado de módulo, así que cada test hace `const { run } = await import('../src/app.js?t=<nombre del test>')` (una query distinta por test) en vez del `import` estático de cabecera.
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo`: tras la cancelación anterior, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo texto de motivo no válido, y `run('libres', ['10:00-12:00'])` sigue sin incluir Norte (la reserva sigue activa).
  - `cancelar con --motivo sin valor`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo texto.
  - `cancelar sin reserva sigue diciéndolo`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `canceladas sin canceladas`: en estado fresco, `run('canceladas', [])` → `''`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])` y luego `run('canceladas', [])` → `''`.
- [ ] **Step 2: Ver los tests en rojo** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: fallan, y por la razón buscada (la respuesta no trae motivo / `canceladas` devuelve `'salas'`), no por un error de sintaxis.
- [ ] **Step 3: Implementación** — en `src/app.js`, con las firmas de Interfaces:
  - `cancelBooking(room, day, reason)`: si `reason` no está en `CANCEL_REASONS` responde `` `motivo no válido: ${CANCEL_REASONS.join(', ')}` `` (antes de buscar la reserva); si no hay reserva activa, `sin reserva ${room} ${day}`; si la hay, la pasa a `cancelled`, guarda `reason` y responde `` `cancelada ${room} ${day} (${reason})` ``.
  - `listCancelled()`: líneas `` `${room} ${day} — ${reason}` `` de las reservas con `status === 'cancelled'`, unidas con `'\n'`.
  - `run`: `cancelar` toma el valor que sigue a `--motivo` en `params` (`undefined` si falta el flag o no tiene valor) y lo pasa a `cancelBooking`; `canceladas` devuelve `listCancelled()`.
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión (`sdd-implement/references/commit-milestones.md`): `feat(bookings): motivo al cancelar y listado de canceladas (0010)`, con la línea `Co-Authored-By` de Restricciones globales.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 1 task, 1 fichero de código y 1 de test, sin incertidumbres técnicas; sin referencia en el estimation-log (aún sin notas de calibración).
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): los dos escenarios del Delta de comportamiento
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo», THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED «Cancelar pide un motivo», AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista`. ✓
- ADDED «El listado enseña el motivo», THEN responde «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anulaciones (`anular`, 0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → `cancelar sin motivo no cancela`; flag sin valor → `cancelar con --motivo sin valor`; sin canceladas → `canceladas sin canceladas`; anuladas → `canceladas no lista las anuladas`; reserva inexistente → `cancelar sin reserva sigue diciéndolo`. ✓
- «Dónde se prueba» de la spec: motivo y listado, ambos en `test/cancel.test.js`. ✓
