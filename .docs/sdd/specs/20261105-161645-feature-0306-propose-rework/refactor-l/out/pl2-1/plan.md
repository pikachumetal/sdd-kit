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

1. **Modelo y effort**: las dos tasks las hace la sesión (Native), en gama media (Sonnet, effort medium): la firma, los textos y los tests ya vienen escritos en el plan. La revisión final de rama va con los modelos de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** responde «motivo no válido: cambio de planes, sala ocupada, otro»: la spec no lo dice, y un motivo ausente no está en la lista cerrada. El test antiguo `cancelar una reserva activa` (sin motivo) se actualiza a la nueva regla.
4. **Orden de las comprobaciones**: primero el motivo, después la reserva. `cancelar Sur mar --motivo otro` sigue respondiendo «sin reserva Sur mar» (regla conservada de `quitar`); `cancelar Sur mar` sin motivo responde «motivo no válido…».
5. **`canceladas`** lista solo el estado `cancelled`, en orden de inserción, una línea por reserva; las `voided` (anular, 0011) no salen. Sin canceladas responde cadena vacía.
6. **Estado compartido entre tests**: `src/app.js` guarda las reservas en memoria y `node --test` ejecuta los tests de un fichero en orden y en un solo proceso. El test de `canceladas` depende de que el test de cancelar con motivo (que cancela Norte lun) haya corrido antes; el orden queda fijado en el fichero.
7. **Regla «la reserva de otra persona no se toca»**: el código no tiene noción de persona ni de dueño de reserva, así que ningún test la puede observar. Va marcada ⚠ en el self-review: se conserva como está (no se toca nada que la rompa), sin test nuevo.
8. **Coste estimado**: ~1 h de implementación, sin subagentes de task; solo la revisión final de rama.
9. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda como campo `reason` de la reserva al pasar a `cancelled`. `cancelBooking` valida el motivo contra una constante `REASONS` antes de buscar la reserva; `listCancelled` recorre `bookings` y formatea. `run` enruta `cancelar --motivo` y `canceladas`.

**Tech Stack**: Node 22, sin dependencias, `node --test`; un solo fichero de entrada `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando dentro de `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Motivos válidos, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios), «sin reserva <sala> <día>».
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa en orden, con TDD (RED escrito antes del código).
- Commits referenciando la feature 0010; un commit por task al quedar limpia su revisión.
- Atribución de commits según el kit (línea `Co-Authored-By` del harness).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar», no un error de motivo · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`voided`) → no sale en el listado · Task 2, sin test: la API pública no puede producir una `voided` tras cancelar (`anular` solo actúa sobre activas y la única reserva sembrada ya está cancelada); lo cubre la inspección del filtro `status === 'cancelled'` en la revisión final

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y dos funciones; sin capas nuevas.
- [x] **YAGNI gate**: `REASONS` es una constante usada por la validación y el mensaje; sin abstracciones.
- [x] **Brownfield gate**: se respeta el patrón de `src/app.js`; `anular` y `reservar` no se tocan.
- [x] **Constitution check**: tests antes que código (art. 2); textos en castellano (art. 4); flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)` con validación y guardado del motivo, `listCancelled()`, enrutado de `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los tests de motivo y de listado; se actualiza el test antiguo de cancelar.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no cubre cancelar.

### 1.2 Modelo de datos

La reserva en memoria gana `reason` (string) al cancelarse. Sin persistencia ni migración.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | Media | Bajo | Orden fijado en el fichero (decisión 6); cada test dice en su GIVEN qué espera |
| `--motivo` con valor de varias palabras entre comillas | Baja | Medio | `process.argv` ya entrega «sala ocupada» como un solo argumento; el test usa ese formato |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión Native, Sonnet con effort medium: el plan trae firmas, textos y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → string; la reserva cancelada lleva `status: 'cancelled'` y `reason`; `run('cancelar', [room, day, '--motivo', reason])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado es compartido):
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo texto.
  - `cancelar sin reserva lo dice` (actualizado): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar una reserva activa con motivo` (sustituye al antiguo): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  Ejecutar y ver fallar los cuatro por el motivo.
- [ ] **Step 2: Implementación** — `src/app.js`: `const REASONS`; `cancelBooking(room, day, reason)` devuelve el texto de motivo no válido si `!REASONS.includes(reason)`, antes de `findBooking`; si hay reserva, guarda `status = 'cancelled'` y `reason` y responde `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` toma `reason` como el argumento que sigue a `--motivo` (`undefined` si no está).
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona escribe `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `bookings` con `status: 'cancelled'` y `reason` (Task 1); el test depende de que la Task 1 haya cancelado Norte lun antes.
- Produce: `listCancelled()` → string con una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas por `\n`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — al final de `test/cancel.test.js`:
  - `el listado de canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar y ver fallar el test (`canceladas` devuelve `'salas'`).
- [ ] **Step 2: Implementación** — `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'`, formatea y une con `\n`; `run` enruta `canceladas`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): el listado de canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.3h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias; sin estimation-log previo.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- `quitar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- `quitar`: la reserva de otra persona no se toca → sin observar: el código no tiene dueño de reserva (avisado en las decisiones, nº 7). ⚠
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza`; sin reserva con motivo válido → Task 1, `cancelar sin reserva lo dice`; anuladas fuera del listado → sin test, inspección del filtro en la revisión final (avisado en el Review Focus). ⚠
