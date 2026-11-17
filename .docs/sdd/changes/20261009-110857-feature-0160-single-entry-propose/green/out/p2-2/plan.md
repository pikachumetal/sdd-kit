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

1. **Modelo y effort**: una sola task, con el código casi determinado por la spec → Sonnet, effort medium. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en sdd-kit.json; una task sobre un solo fichero no gana nada con un subagente por task.
3. **Decisión técnica**: el motivo se guarda en `booking.reason` y `cancelBooking(room, day, reason)` valida la lista antes de buscar la reserva.
4. **Cancelar sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: …»): la spec dice que cancelar «pide» un motivo. El test existente `cancelar una reserva activa` se actualiza a la nueva forma.
5. **`canceladas` sin canceladas** responde `sin canceladas`; las reservas anuladas (`voided`) no salen: la 0011 es suya.
6. **Riesgos altos**: ninguno. **Coste**: ~0,5 h, sin subagentes de implementación.
7. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: Todo vive en `src/app.js`, en el estilo actual de funciones exportadas más el despacho de `run`. El motivo se guarda en la propia reserva cancelada y `canceladas` filtra por `status === 'cancelled'`.

**Tech Stack**: Node 22 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: `cancelada Norte lun (sala ocupada)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `Norte lun — sala ocupada` (con raya larga).
- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Política de modelos: gama media como suelo; el revisor final, `opus` con `sdd-kit:effort-high`.
- Modo de ejecución por defecto del proyecto: native (`sdd-kit.json`).
- Commits en castellano, con el id `0010`, y con la línea `Co-Authored-By` que fije el entorno.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», sin cancelar · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (sin valor) → el mismo mensaje · Task 1, `cancelar con --motivo sin valor no cancela`
- Motivo válido pero sin reserva (`cancelar Sur mar --motivo otro`) → `sin reserva Sur mar` · Task 1, `cancelar sin reserva con motivo válido lo dice`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no una línea vacía · Task 1, `canceladas sin canceladas lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos nuevos; un campo y una función.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); sin refactor fuera de scope, `anular` intacto.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` recibe y valida el motivo; nueva `listCancelled`; `run` despacha `cancelar --motivo` y `canceladas`.
- `test/cancel.test.js` — escenarios de la spec y Review Focus.

**NO se tocan**:

- `voidBooking` y el comando `anular` — es la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — no cambia su comportamiento.

### 1.2 Modelo de datos

Las reservas, en memoria, ganan `reason` (string) al cancelarse. Sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comando `cancelar <sala> <día> --motivo <motivo>` y comando `canceladas`.

### 1.5 UX

No aplica: CLI.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Romper el test existente de cancelar | alta | baja | Se actualiza en la Task 1 a la nueva forma |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Sonnet con effort medium (native: lo hace el hilo principal; con subagente sería `subagent_type: sdd-kit:effort-medium` + `model: sonnet`)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código; Native: TDD del propio hilo

**Superficies**: backend (`src/app.js`)
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `node src/app.js canceladas` y ve «Norte lun — sala ocupada» (cada ejecución arranca con la reserva de Norte del lunes en memoria, así que el listado se prueba por los tests).

**Interfaces**:
- Consume: nada (`findBooking`, `bookings` ya existen en `src/app.js`).
- Produce: `export function cancelBooking(room, day, reason)`; `export function listCancelled()`; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`; el existente `cancelar una reserva activa` pasa a la nueva forma. Cada test que cancela usa `run` y el estado en memoria se comparte dentro del fichero, así que se ordenan: los de motivo inválido y sin reserva primero, la cancelación válida de Norte lun después, y `canceladas` al final.
  - `cancelar una reserva activa con motivo`: `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`
  - `motivo fuera de la lista`: `run('cancelar', ['Norte','lun','--motivo','porque sí'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → el mismo mensaje
  - `cancelar con --motivo sin valor no cancela`: `run('cancelar', ['Norte','lun','--motivo'])` → el mismo mensaje
  - `cancelar sin reserva con motivo válido lo dice`: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`
  - `canceladas sin canceladas lo dice` (antes de la cancelación válida): `run('canceladas', [])` → `'sin canceladas'`
  - `canceladas enseña el motivo` (tras la cancelación válida): `run('canceladas', [])` → `'Norte lun — sala ocupada'`
  - Elimina `cancelar una reserva activa` y `cancelar sin reserva lo dice` antiguos, sustituidos por los de arriba.
- [ ] **Step 2: Ver RED** — `node --test test/cancel.test.js`. Esperado: los tests nuevos fallan, ninguno por error de sintaxis.
- [ ] **Step 3: Implementación** en `src/app.js`:
  - `const cancelReasons = ['cambio de planes', 'sala ocupada', 'otro']`
  - `export function cancelBooking(room, day, reason)`: motivo fuera de `cancelReasons` → `` `motivo no válido: ${cancelReasons.join(', ')}` ``; después `sin reserva …`; si no, guarda `booking.reason` y responde `` `cancelada ${room} ${day} (${reason})` ``.
  - `export function listCancelled()`: líneas `` `${room} ${day} — ${reason}` `` de las reservas `cancelled`, unidas con `\n`; sin ninguna, `'sin canceladas'`.
  - `run`: `cancelar` toma el valor que sigue a `--motivo` (`undefined` si falta o no hay valor) y lo pasa a `cancelBooking`; `canceladas` llama a `listCancelled`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: todos en verde.
- [ ] **Step 5: Commit de la task** — `feat(0010): motivo al cancelar y listado de canceladas`, un solo commit con spec, plan y código ya aprobados.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Base de la estimación: 1 task, un fichero y un test, sin incertidumbres; sin referencia en el estimation-log (calibración vacía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» → Task 1, tests `cancelar una reserva activa con motivo` y `motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, test `canceladas enseña el motivo`. ✓
- No entra: anulaciones del responsable (0011) → N/A, `voidBooking` intacta. ✓
- Review Focus → Task 1, los cuatro tests de su sección. ✓
