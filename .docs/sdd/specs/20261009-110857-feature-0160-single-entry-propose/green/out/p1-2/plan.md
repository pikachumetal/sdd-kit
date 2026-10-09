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

1. **Modelo y effort**: las dos tasks las hace el hilo principal (Native), en Sonnet con effort medium: son cambios pequeños en un fichero y el plan trae firmas, textos y asserts. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: Native, fijado en sdd-kit.json. Dos tasks sobre `src/app.js`, la segunda depende de la forma en que la primera guarda el motivo; no compensa un contexto fresco por task.
3. **Sin `--motivo` en `cancelar`**: responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»). La spec dice que cancelar «pide» un motivo y no fija este caso.
4. **Orden de comprobaciones**: primero el motivo, después la reserva. `cancelar Sur mar --motivo "sala ocupada"` sigue respondiendo «sin reserva Sur mar».
5. **`canceladas` sin ninguna**: responde «sin canceladas» (texto que la spec no fija). Varias canceladas: una línea por reserva, en el orden en que se cancelaron.
6. **`canceladas` solo lista `status === 'cancelled'`**: las anuladas (`voided`) no entran; son el alcance de la 0011.
7. **Tests existentes**: `test/cancel.test.js` cambia sus dos tests para pasar `--motivo`, porque el comportamiento antiguo («cancelada Norte lun» sin motivo») deja de existir.
8. **Coste**: ~0,5 h, sin subagentes salvo la revisión final.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva cancelada guarda `reason` junto a `status`. `cancelBooking` valida el motivo contra una constante `cancelReasons` antes de buscar la reserva; `run` extrae el valor de `--motivo`; `cancelledBookings()` filtra por estado. Todo en `src/app.js`.

**Tech Stack**: Node 22 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks acopladas en un solo fichero · fijado en sdd-kit.json: native. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; un solo fichero de entrada: `src/app.js`.
- Lista de motivos cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, con los literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (Constitution, art. 2); el gate de cierre es `node --test` entero en verde.
- Modelos: gama media como suelo; `fable` y `opus xhigh` no se usan.
- Commits en castellano, convención del repo (`feat:`), referenciando 0010; atribución según la configuración de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo pide uno de la lista`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo mensaje de motivo no válido · Task 1, `cancelar con --motivo sin valor es motivo no válido`
- Motivo inválido sobre una reserva que sí existe → no la cancela: un `canceladas` posterior no la lista · Task 1, `un motivo no válido no cancela la reserva`
- Reserva anulada (`anular`) → no sale en `canceladas` · Task 2, `canceladas no lista las anuladas`
- Sin canceladas → «sin canceladas», no una salida vacía · Task 2, `canceladas sin ninguna lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos nuevos; una constante y una función en el fichero existente.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: sigue el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope.
- [x] **Constitution check**: arts. 1 (flujo SDD), 2 (tests antes que código) y 4 (castellano) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelReasons`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, y el despacho de `cancelar` y `canceladas` en `run`.
- `test/cancel.test.js` — tests del motivo y del listado; actualiza los dos existentes.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `freeRooms`, `reservar` — no cambian.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Datos en memoria; sin persistencia ni migración.

### 1.3 a 1.5

No aplican.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor o fuera de sitio | Media | Bajo | Review Focus, Task 1 |
| Romper los tests actuales de `cancelar` | Alta | Bajo | Se actualizan en la Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`; `node scripts/lint.mjs`
**Se prueba en la aplicación**: la persona escribe `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "x"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`, que deja `booking.status = 'cancelled'` y `booking.reason = reason`; `cancelReasons: string[]` = `['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Los dos existentes pasan a usar `['Norte', 'lun', '--motivo', 'sala ocupada']` y `['Sur', 'mar', '--motivo', 'sala ocupada']`. Nuevos, con estos asserts:
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista`: `--motivo 'aburrimiento'` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo pide uno de la lista`: `run('cancelar', ['Norte','lun'])` → el mismo mensaje.
  - `cancelar con --motivo sin valor es motivo no válido`: `run('cancelar', ['Norte','lun','--motivo'])` → el mismo mensaje.
  - `un motivo no válido no cancela la reserva`: tras el rechazo, `run('cancelar', ['Norte','lun','--motivo','otro'])` → `'cancelada Norte lun (otro)'`.
  - Los tests comparten el estado en memoria de `src/app.js`: cada uno que cancela la reserva de Norte lun va el último de su grupo o se ordena para no depender de otro.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)` en `src/app.js`: devuelve el mensaje de motivo no válido si `reason` no está en `cancelReasons`, después `sin reserva …` si no hay reserva activa, y si no cancela guardando `reason` y responde `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` pasa el valor que sigue a `--motivo` en `params` (`undefined` si falta).
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación». Esperado: tests en verde, `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`; `node scripts/lint.mjs`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», la persona escribe `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: las reservas con `status === 'cancelled'` y `reason` que deja `cancelBooking` de la Task 1.
- Produce: `cancelledBookings(): string` y el comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas enseña el motivo`: tras cancelar Norte lun con «sala ocupada», `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas`: tras `run('anular', [...])` de otra reserva, `run('canceladas', [])` no la contiene.
  - `canceladas sin ninguna lo dice`: sin cancelaciones, `run('canceladas', [])` → `'sin canceladas'`. Este test necesita un estado sin cancelaciones: va antes de los que cancelan, o el módulo expone un reinicio solo si ya existe; no se añade API solo para el test.
- [ ] **Step 2: Implementación** — `cancelledBookings(): string` en `src/app.js`: una línea `${room} ${day} — ${reason}` por reserva con `status === 'cancelled'`, unidas con `\n`, o `'sin canceladas'` si no hay. `run` despacha `canceladas` a ella.
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación». Esperado: verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de reservas canceladas con su motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un fichero, sin migración ni UI
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` y `node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): los dos escenarios `ADDED` ejecutados por el CLI (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (éxito y motivo inválido) → Task 1. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 2. ✓
- No entra: anulaciones del responsable (0011) → N/A (confirmado en spec). ✓
- `--motivo` ausente o sin valor → Task 1, tests `cancelar sin motivo pide uno de la lista` y `cancelar con --motivo sin valor es motivo no válido`. ✓
- Motivo inválido no cancela → Task 1, `un motivo no válido no cancela la reserva`. ✓
- Anuladas fuera del listado → Task 2, `canceladas no lista las anuladas`. ✓
- Sin canceladas → Task 2, `canceladas sin ninguna lo dice`. ✓
