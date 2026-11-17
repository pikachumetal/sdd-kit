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

1. **Ejecución**: native, fijado en sdd-kit.json. Dos tasks encadenadas por el motivo guardado, un solo fichero de código y cabe en un contexto.
2. **Modelo y effort por task**: Sonnet con effort medium en las dos; la prosa a interpretar es corta y el plan trae los textos y los asserts. La revisión final de rama va con el modelo de `sdd-verify`.
3. **Sin `--motivo` en `cancelar`** (la spec lo calla): se trata como motivo no válido y responde «motivo no válido: cambio de planes, sala ocupada, otro»; cancelar «pide un motivo».
4. **Orden de validación**: primero el motivo, después la reserva. Con motivo válido y sin reserva responde «sin reserva <sala> <día>» (regla conservada del anexo).
5. **`canceladas` sin canceladas** devuelve la cadena vacía, como `libres` cuando no hay salas; varias, una por línea (`\n`), en el orden en que se cancelaron. Las anuladas (`voided`, 0011) no aparecen.
6. **Regla «la reserva de otra persona no se toca»** del anexo: el código no tiene concepto de propietario, así que nada puede observarla (⚠ en §4). No se inventa uno; queda para 0011.
7. **El test existente `cancelar una reserva activa`** deja de ser válido (sin motivo ya no cancela): se reescribe con `--motivo`, es el MODIFIED de la spec.
8. **Coste**: ~1 h de implementación (ver Estimación). Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason`; `cancelBooking(room, day, reason)` valida y `listCancelled()` filtra por estado. `run` parsea `--motivo` de los parámetros. Todo en `src/app.js`, sin dependencias.

**Tech Stack**: Node 22, `node --test`, sin dependencias (`tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de comandos en `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Motivos válidos, literal y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano (constitution, art. 4).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un nombre que diga lo que hacen.

### De proceso

- Tests antes que código (constitution, art. 2).
- Política de modelos: Sonnet, effort medium; sin `fable` ni `opus xhigh`.
- Ejecución native; un commit por task al quedar limpia su revisión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo "otro"` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → cadena vacía, no «undefined» ni «salas» · Task 2, `canceladas sin canceladas devuelve vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y una función de listado; sin estructuras nuevas.
- [x] **YAGNI gate**: la lista de motivos es una constante, sin abstracción.
- [x] **Brownfield gate**: `anular` y `libres` intactos; el texto de `cancelar` cambia solo con motivo, según la spec.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), rama `feature/0010` (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking` valida el motivo y lo guarda; `listCancelled`; `run` parsea `--motivo` y despacha `canceladas`.
- `test/cancel.test.js` — tests de `cancelar` con motivo y de `canceladas`.

**NO se tocan**:

- `voidBooking` y `anular` — son de 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin cambios de comportamiento.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Sin persistencia (en memoria).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` con espacios llega partido en varios parámetros | Baja | Medio | El shell lo entrega como un solo argumento; el test usa `'sala ocupada'` como un elemento |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Sonnet, effort medium (Native: la propia sesión).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → `string`; la reserva queda `status: 'cancelled'` con `reason`. Constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, reescribe y añade (`run('cancelar', [...])`):
  - `cancelar una reserva activa con motivo`: `['Norte','lun','--motivo','sala ocupada']` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista`: `['Norte','lun','--motivo','aburrimiento']` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `['Norte','lun']` → el mismo texto de motivo no válido.
  - `cancelar sin reserva lo dice`: `['Sur','mar','--motivo','otro']` → `'sin reserva Sur mar'`.
  Como `bookings` es estado compartido en memoria y la reserva de Norte lun solo se cancela una vez, el test de éxito va el último de los que cancelan Norte lun (o los tests de rechazo la comprueban aún activa antes). Ejecútalos y comprueba que fallan.
- [ ] **Step 2: Implementación** — `src/app.js`: `cancelBooking(room, day, reason)`: motivo fuera de `REASONS` (o `undefined`) → `motivo no válido: ${REASONS.join(', ')}`; luego `sin reserva ${room} ${day}`; si no, `status = 'cancelled'`, `reason`, y `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` lee el valor tras `--motivo` de `params` (`params[params.indexOf('--motivo') + 1]`, `undefined` si no está) y lo pasa.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Sonnet, effort medium (Native: la propia sesión).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: no, porque la app guarda en memoria y cada invocación de `node src/app.js` parte de cero; se observa por la salida de `run('canceladas', [])` en el test.

**Interfaces**:
- Consume: reservas con `status: 'cancelled'` y `reason` (Task 1).
- Produce: `listCancelled()` → `string`, una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas con `\n`; `''` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`:
  - `canceladas sin canceladas devuelve vacío`: ejecutado antes de cancelar nada (primer test del fichero que corre, o con las reservas aún activas) → `run('canceladas', [])` es `''`.
  - `canceladas enseña el motivo`: tras cancelar Norte lun con `sala ocupada` → `'Norte lun — sala ocupada'`.
  Compruébalos en rojo (`canceladas` hoy devuelve `'salas'`).
- [ ] **Step 2: Implementación** — `src/app.js`: `listCancelled()` filtra `status === 'cancelled'` (no `voided`); `run('canceladas')` lo devuelve.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks pequeñas en un fichero, sin incertidumbres; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED cancelar · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED cancelar · AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `cancelar con motivo fuera de la lista`. ✓
- ADDED canceladas · THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anexo `quitar`: «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo `quitar`: «la reserva de otra persona no se toca» → sin observar: el código no tiene propietario de reserva (avisado en las decisiones, punto 6). ⚠
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; sin reserva → Task 1, `cancelar sin reserva lo dice`; vacío → Task 2, `canceladas sin canceladas devuelve vacío`. ✓
