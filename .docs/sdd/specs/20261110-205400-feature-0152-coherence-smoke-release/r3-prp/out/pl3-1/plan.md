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

1. **Modelo y effort por task**: las dos las hace la sesión (Native) en gama media (Sonnet, effort medium): el plan trae firmas, valores y tests. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`--motivo` es obligatorio**: la spec dice que cancelar «pide» un motivo pero no qué pasa sin él. Sin `--motivo` responde lo mismo que con un motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro».
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva Sur mar».
5. **`canceladas` solo lista las de estado `cancelled`** (no las `voided` de `anular`), una por línea con el formato de la spec, en el orden de `bookings`; sin ninguna responde cadena vacía, como `libres` sin salas.
6. **Los dos tests antiguos de `test/cancel.test.js` cambian** (ya no hay `cancelar` sin motivo): pasan a llevar `--motivo`. No hay otra reserva que cancelar: el estado vive en memoria y es compartido, así que `Norte lun` se cancela una sola vez en el fichero y el test de `canceladas` va después, en el mismo fichero.
7. **Riesgos altos**: ninguno. **Coste**: ~0,75 h de implementación, sin subagentes.
8. **Gate de cierre**: `node --test && node scripts/lint.mjs`, el de `operations.md` §Testing; incluye `store.test.js` (~40 s).
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cada cancelación deja su motivo (de una lista cerrada) y `canceladas` lo enseña.

**Architecture**: `cancelBooking` recibe el motivo, lo valida contra una lista cerrada y lo guarda en la reserva junto al estado `cancelled`; `run` lo saca de `--motivo`. `listCancelled()` recorre `bookings` con ese estado. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `cancelBooking` y añade una función en `src/app.js`: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de salida literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (raya larga `—`).
- Texto de la interfaz en castellano (constitution, art. 4); `src/app.js` sin tabuladores (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, sin abstracciones con menos de 3 usos.

### De proceso

- Native, sesión en gama media; commits con la convención del proyecto (`feat:`…) y la atribución que fije el entorno.
- Los tests RED se escriben antes del código y van en el commit de su task, no antes.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo "sala ocupada"` sin reserva → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- Motivo inválido no cancela: tras `cancelar Norte lun --motivo xyz`, `libres 10:00-12:00` sigue sin incluir Norte y la reserva sigue activa · Task 1, `un motivo fuera de la lista no cancela`
- `canceladas` sin canceladas → cadena vacía, no «undefined» ni «salas» · Task 2, `canceladas sin ninguna responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, una función y un parámetro; nada más.
- [x] **YAGNI gate**: sin abstracciones nuevas; `listCancelled` tiene un uso y es la capacidad pedida.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); respeta el patrón de `src/app.js`; sin refactor fuera de scope (`voidBooking` queda como está).
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelReasons`, `cancelBooking(room, day, reason)`, `listCancelled()`, y `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — los dos tests actuales llevan `--motivo`; tests nuevos de motivo y de `canceladas`.

**NO se tocan**:

- `src/app.js` `voidBooking` y el comando `anular` — la anulación por responsable es la 0011.
- `test/app.test.js`, `test/store.test.js` — no dependen de `cancelar` (se comprueba con el gate).

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason: string`; en memoria, sin migración.

### 1.3 Migraciones

No aplica: las reservas viven en memoria.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica: es línea de comandos.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones del responsable) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests: cancelar `Norte lun` dos veces da «sin reserva» | media | un test falla por el orden | `Norte lun` se cancela una sola vez en el fichero; `canceladas` va después (decisión 6) |
| `store.test.js` toca `cancelar` | baja | gate rojo | se detecta en el gate de §3 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native: la sesión, Sonnet con effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "porque sí"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` guarda `booking.reason = reason` al pasar a `cancelled`; `cancelReasons = ['cambio de planes', 'sala ocupada', 'otro']`. Las reservas canceladas llevan `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (se sustituyen los dos actuales):
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo mensaje, y `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  Ese orden: el único que cancela `Norte lun` es el último. Verlos fallar: `node --test test/cancel.test.js`.
- [ ] **Step 2: Implementación** en `src/app.js`: `const cancelReasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${cancelReasons.join(', ')}` `` si `reason` no está en la lista (antes de buscar la reserva), `sin reserva ${room} ${day}` si no hay, y si no guarda `reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está (si no, `undefined`).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`, uno solo al quedar limpia la revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native: la sesión, Sonnet con effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: la persona, con `Norte lun` cancelada por «sala ocupada», ejecuta `canceladas` y ve «Norte lun — sala ocupada». (La CLI de un solo comando no conserva el estado entre ejecuciones: se ve a través de `run` en el test.)

**Interfaces**:
- Consume: de la Task 1, las reservas con `status: 'cancelled'` y `reason`.
- Produce: `listCancelled(): string` y el comando `canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas sin ninguna responde vacío`, **antes** del test que cancela `Norte lun`: `run('canceladas', [])` → `''`.
  - `el listado de canceladas enseña el motivo`, **después** de él: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Verlos fallar.
- [ ] **Step 2: Implementación** en `src/app.js`: `listCancelled()` filtra `bookings` por `status === 'cancelled'`, mapea a `` `${room} ${day} — ${reason}` `` y une con `'\n'`; `run` responde `listCancelled()` para `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,75 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias ni migración; sin entradas en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar pide un motivo» · AND «motivo no válido: …» → Task 1, `un motivo fuera de la lista no cancela` y `cancelar sin motivo lo rechaza`. ✓
- ADDED «El listado enseña el motivo» · THEN «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- Sin tabla de «regla retirada» en la spec → N/A. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo lo rechaza`; sin reserva → Task 1, `cancelar sin reserva lo dice`; motivo inválido no cancela → Task 1, `un motivo fuera de la lista no cancela`; listado vacío → Task 2, `canceladas sin ninguna responde vacío`. ✓
