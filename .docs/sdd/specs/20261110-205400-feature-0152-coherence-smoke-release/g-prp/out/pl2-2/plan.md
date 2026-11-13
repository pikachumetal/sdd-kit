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

1. **Modelo y effort por task**: Task 1 y Task 2 las hace la sesión (Native), en gama media (Sonnet, effort medium): el plan trae las firmas, los textos y los tests. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. **Orden de comprobación en `cancelar`**: primero la reserva, después el motivo. Así `cancelar Sur mar` sin `--motivo` sigue respondiendo «sin reserva Sur mar» (la fila `quitar` del anexo dice «mismo texto») y su test actual no cambia. La spec no fija el orden.
4. **`cancelar` sin `--motivo`** sobre una reserva activa responde «motivo no válido: cambio de planes, sala ocupada, otro», como un motivo fuera de la lista. La spec no lo dice; es lo mínimo coherente con «cancelar pide un motivo» y no cancela nada.
5. **`canceladas` sin canceladas** responde la cadena vacía (la app imprime una línea en blanco). La spec no lo dice; no se inventa un texto nuevo.
6. **El texto de éxito de `cancelar` cambia** de «cancelada Norte lun» a «cancelada Norte lun (sala ocupada)»: el test actual `cancelar una reserva activa` se actualiza en Task 1. La spec lo escribe como `ADDED`; es en realidad un cambio de un comportamiento existente. Se avisa al dev-lead para la enmienda de la spec o la capacidad al cerrar; no se bloquea la ejecución.
7. **«La reserva de otra persona no se toca»** (anexo): el modelo no tiene personas, solo sala y día. Se observa como «cancelar otra sala o día no toca la reserva de Norte lun». Interpretación mía.
8. **Orden de tests en `test/cancel.test.js`**: el estado vive en memoria y se comparte entre los tests del fichero, que `node --test` ejecuta en orden de declaración. Los tests que no mutan van antes; el que cancela Norte lun va el último de la Task 1, y el de `canceladas` de la Task 2 va tras él. Una nota del test lo dice.
9. **Riesgos altos**: ninguno. Un fichero de código, sin dependencias ni datos persistentes.
10. **Coste estimado**: ~0,75 h de implementación en la sesión; sin despachos, sin coste de subagentes salvo la revisión final de ejes.
11. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; el comando `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` es el único fichero. `cancelBooking` recibe el motivo y lo guarda en la reserva; `run` lo saca de `--motivo`. Una función nueva `cancelledBookings` filtra por estado `cancelled` y `run` la expone como `canceladas`.

**Tech Stack**: Node 22, sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y su test: sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- La lista de motivos es cerrada y va en este orden y con estas grafías: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga), «sin reserva <sala> <día>».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean code: funciones cortas, nombres que dicen lo que hacen. El proyecto no tiene artículo de calidad en su constitution.
- Texto de la interfaz en castellano; sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native: la sesión implementa cada task con TDD (`sdd-tdd`) y un commit por task al quedar limpia (`commit-milestones.md`).
- Commits con la convención del proyecto (`feat: …`) y, si hay atribución, la que fije el entorno.
- Sin `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur lun --motivo otro` (otra sala, mismo día) → «sin reserva Sur lun» y Norte lun sigue reservada · Task 1, `cancelar otra sala no toca la reserva de Norte`
- Motivo con otra grafía (`Sala ocupada`) → «motivo no válido: …»; la lista distingue mayúsculas · Task 1, `cancelar con motivo fuera de la lista` (usa `Sala ocupada`)
- `canceladas` sin ninguna cancelada → cadena vacía, no «undefined» ni error · Task 2, `canceladas sin cancelaciones`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un array y un filtro; sin clases ni módulos.
- [x] **YAGNI gate**: sin abstracción nueva; `anular` (0011) no se toca.
- [x] **Brownfield gate**: retrocompatible salvo el texto de éxito de `cancelar`, que la spec cambia; sigue el patrón de funciones exportadas de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), flujo SDD (art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: nada.

**Modificar**:

- `src/app.js` — motivos, `cancelBooking` con motivo, `cancelledBookings`, rutas `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — tests de motivo y de `canceladas`; actualiza el de éxito.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, es la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — no cambian.

### 1.2–1.6

No aplican (sin base de datos, migraciones, API, UX ni dependencias nuevas).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del fichero | Media | Bajo | Orden de declaración fijado (decisión 8) |
| `--motivo` como último argumento sin valor (`params[i+1]` indefinido) | Baja | Bajo | Indefinido no está en la lista: «motivo no válido» |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión Native, Sonnet con effort medium; sin despacho (el plan trae firmas, textos y tests).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend (tooling de tests incluido)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime `cancelada Norte lun (sala ocupada)`; con `--motivo "porque sí"` imprime `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js` (reserva activa de Norte lun, 10:00-12:00).
- Produce: `cancelBooking(room, day, reason)`: guarda `booking.reason` y deja `status: 'cancelled'`; la reserva cancelada lleva `reason` (lo usa Task 2). `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden de declaración (los que no mutan, primero):
  - `cancelar cuando no hay reserva lo dice` (el actual, sin cambios): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  - `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'Sala ocupada'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje; `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar otra sala no toca la reserva de Norte`: `run('cancelar', ['Sur', 'lun', '--motivo', 'otro'])` → `'sin reserva Sur lun'`; `run('libres', ['10:00-12:00'])` → `'Sur'`.
  - `cancelar una reserva activa con motivo` (sustituye a `cancelar una reserva activa`; muta el estado, va el último): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  Verlos fallar: `node --test test/cancel.test.js` → `ℹ fail` mayor que 0 (los dos de motivo inválido y el de éxito).
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const reasons = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: sin reserva activa → `` `sin reserva ${room} ${day}` ``; `!reasons.includes(reason)` → `` `motivo no válido: ${reasons.join(', ')}` ``; si no, `status = 'cancelled'`, `reason`, y devuelve `` `cancelada ${room} ${day} (${reason})` ``.
  - `run`: `cancelar` llama `cancelBooking(params[0], params[1], optionValue(params, '--motivo'))` con `function optionValue(params, name)` que devuelve `params[params.indexOf(name) + 1]` si `name` está y `undefined` si no.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; smoke de la línea «Se prueba en la aplicación».
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`, un solo commit al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión Native, Sonnet con effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque el estado vive en memoria y cada `node src/app.js` arranca vacío de cancelaciones: se observa por el test, que cancela y lista en el mismo proceso.

**Interfaces**:
- Consume: reservas con `status: 'cancelled'` y `reason` (de Task 1).
- Produce: `cancelledBookings()` → líneas `` `${room} ${day} — ${reason}` `` unidas por `\n`, cadena vacía si no hay; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas sin cancelaciones` — declarado **antes** de `cancelar una reserva activa con motivo`: `run('canceladas', [])` → `''`.
  - `canceladas enseña el motivo` — declarado **después** de ese test: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Con un comentario de una línea sobre el orden, que explique el porqué (el estado compartido), sin citar documentos. Verlos fallar: ambos devuelven `'salas'`.
- [ ] **Step 2: Implementación** en `src/app.js`: `export function cancelledBookings()` con `bookings.filter((b) => b.status === 'cancelled').map((b) => ``${b.room} ${b.day} — ${b.reason}``).join('\n')`; en `run`: `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: el listado de canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,75 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero; sin entradas previas en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde «cancelada Norte lun (sala ocupada)»» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND «un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»» → Task 1, `cancelar con motivo fuera de la lista`. ✓
- THEN «responde «Norte lun — sala ocupada»» → Task 2, `canceladas enseña el motivo`. ✓
- «Dónde se prueba»: motivo por el comando `cancelar` y listado por la salida de `canceladas`, los dos en `test/cancel.test.js`. ✓
- Anexo, `quitar`: «sin reserva <sala> <día>» → Task 1, `cancelar cuando no hay reserva lo dice` (`'sin reserva Sur mar'`). ✓
- Anexo, `quitar`: «la reserva de otra persona no se toca» → Task 1, `cancelar otra sala no toca la reserva de Norte` (interpretación, decisión 7). ✓
- No entra: anulaciones (0011) → N/A (confirmado en spec); `voidBooking` intacto. ✓
- Que `canceladas` no lista las anuladas → sin observar: ninguna reserva sembrada se anula sin mutar Norte lun; lo fija el filtro `status === 'cancelled'` (avisado). ⚠
- Review Focus: motivo ausente → Task 1, `cancelar sin motivo no cancela`; otra sala → `cancelar otra sala no toca la reserva de Norte`; grafía → `cancelar con motivo fuera de la lista`; sin canceladas → Task 2, `canceladas sin cancelaciones`. ✓
