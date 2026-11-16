---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Una sola task** — son dos escenarios sobre un fichero (`src/app.js`) y un test; partirla no deja nada que un revisor pueda rechazar por separado.
2. **Modelo**: Task 1 en Sonnet con effort medium (la firma y los textos los fija el plan). El revisor final de rama va con `sdd-kit:effort-high` + `opus`, también con una sola task.
3. **Ejecución**: native, fijado en sdd-kit.json. Con una sola task no hay interfaces entre tasks que justifiquen subagentes.
4. **Sin `--motivo` responde igual que un motivo fuera de la lista** («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y la lista es cerrada; no cancelar sin motivo es lo coherente. Cambia el comportamiento actual de `cancelar <sala> <día>` a secas.
5. **El motivo se valida antes de buscar la reserva**: con un motivo no válido sobre una sala sin reserva, responde «motivo no válido…», no «sin reserva…».
6. **`canceladas` sin ninguna cancelada responde cadena vacía**, sin texto nuevo que la spec no fija. Solo lista las de estado `cancelled`.
7. **El motivo se guarda en el campo `reason` de la reserva** (`src/app.js` no tiene más modelo que el array `bookings`).
8. **Los dos tests existentes de `cancel.test.js` se actualizan** para pasar `--motivo` (el primero deja de existir tal cual: lo sustituye el THEN de la spec; el segundo conserva su comportamiento «sin reserva»).
9. **Riesgo alto**: ninguno. **Coste estimado**: ~0,5 h; sin despachos salvo el revisor final.
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: todo en `src/app.js`. `cancelBooking` recibe el motivo y lo valida contra una constante `REASONS`; `run` extrae el valor de `--motivo` de los parámetros y añade el comando `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node --test` (`tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque con una sola task no hay interfaces entre tasks · fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto de la interfaz en castellano, con los literales exactos de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (raya larga `—`).
- Lista de motivos cerrada, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo cometido. La constitution del proyecto no tiene artículo de calidad de código: estas dos reglas de comentarios valen igualmente.

### De proceso

- Tests antes que código (Art. 2); gate de cierre `node --test` entero en verde, una vez, en §3.
- Commits en castellano, referenciando la 0010; convención de la constitution (git-flow, rama `feature/0010`).
- Modo de ejecución: native.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo «motivo no válido…» · Task 1, `motivo vacío no es válido`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin canceladas → salida vacía, sin fallar · Task 1, `canceladas sin canceladas devuelve vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` en la reserva y un filtro por estado; sin módulos nuevos.
- [x] **YAGNI gate**: ninguna abstracción nueva; `REASONS` es una constante de un solo uso por la validación y el mensaje.
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo (decisión 4, aprobada en la spec como «pide un motivo»); respeta el patrón de `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (Art. 2), castellano (Art. 4), flujo SDD (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)`, constante `REASONS`, función `cancelledList()`, y `run` (extrae `--motivo`, añade `canceladas`).
- `test/cancel.test.js` — tests de los dos THEN y de las entradas del Review Focus; actualiza los dos existentes.

**NO se tocan**:

- `voidBooking` y el comando `anular` — la anulación del responsable es la 0011.
- `test/app.test.js` — no usa `cancelar`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Sin persistencia: el estado vive en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`. Textos en Restricciones globales.

### 1.5 UX

No aplica (CLI sin pantalla).

### 1.6 Dependencias

Ninguna. La 0011 (anular) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `bookings` es estado compartido en memoria y los tests de un fichero comparten proceso | Media | Bajo | Los tests de `cancel.test.js` van en orden y el de `canceladas` sigue al que cancela Norte lun; se dice en la task |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listar canceladas

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (para el caso de despacho; en native la ejecuta el hilo en Sonnet con effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; Native: TDD del propio hilo.
**Superficies**: backend.
**Verificación**: `node --test test/cancel.test.js` (sale con 0 solo si todo pasa).
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro». `canceladas` no se prueba por línea de comandos (el estado es en memoria y cada invocación arranca vacía): lo cubre `canceladas enseña el motivo` en `test/cancel.test.js`.

**Interfaces**:
- Consume: nada (primera y única task). Código existente: `findBooking(room, day)` devuelve la reserva activa o `undefined`; `run(cmd, params)`.
- Produce: `cancelBooking(room: string, day: string, reason: string): string`; `run('canceladas', []): string`; constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (comparten el array `bookings` del proceso). Todos con `run` y `assert.equal`:
  - `cancelar con motivo fuera de la lista` — `run('cancelar', ['Norte','lun','--motivo','vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo no cancela` — `run('cancelar', ['Norte','lun'])` → el mismo mensaje; y después `run('libres', ['10:00-12:00'])` → `'Sur'` (la reserva sigue activa).
  - `motivo vacío no es válido` — `run('cancelar', ['Norte','lun','--motivo'])` → el mismo mensaje.
  - `cancelar sin reserva lo dice` — `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'` (sustituye al existente).
  - `canceladas sin canceladas devuelve vacío` — `run('canceladas', [])` → `''`.
  - `cancelar con motivo de la lista` — `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` (sustituye al existente).
  - `canceladas enseña el motivo` — `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Guarda una copia de `test/cancel.test.js` fuera del repo.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos; sin sintaxis rota.
- [ ] **Step 3: Implementación** en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida `REASONS.includes(reason)` antes de buscar la reserva, guarda `booking.reason = reason` y responde con el sufijo ` (<motivo>)`; `cancelledList()` filtra `status === 'cancelled'` y une con `\n` líneas `<sala> <día> — <motivo>`; `run` obtiene el motivo como el elemento siguiente a `--motivo` (o `undefined`) y despacha `canceladas`. Los cuerpos los escribe el implementador.
- [ ] **Step 4: Ver GREEN** — `node --test test/cancel.test.js`. Esperado: todo pasa. Compara los tests con la copia de Step 1 (`git diff --no-index`): cualquier cambio no de formato es un ruling.
- [ ] **Step 5: Commit de la task** — `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test`
- [ ] Verificación de los dos escenarios de la spec con `ejecución real`: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y `node src/app.js cancelar Norte lun --motivo vacaciones`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN respuesta + AND motivo no válido) → Task 1, tests `cancelar con motivo de la lista` y `cancelar con motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `canceladas enseña el motivo`. ✓
- No entra: anulaciones del responsable (0011) → N/A (`voidBooking` intacto). ✓
- Review Focus: sin motivo, motivo vacío, sin reserva, sin canceladas → Task 1, cada una con su test. ✓
