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

1. **Modelo y effort por task**: Native, la sesión implementa las dos tasks; sirve gama media (Sonnet, effort medium) porque el plan lleva firmas, textos y tests. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`, o con `--motivo` sin valor, responde como un motivo fuera de la lista** («motivo no válido: cambio de planes, sala ocupada, otro»), y no cancela. La spec solo fija el motivo fuera de la lista; una persona razonable no espera que cancelar siga sin motivo si el objetivo es dejar rastro. Esto cambia el comportamiento ya publicado de `cancelar <sala> <día>` y obliga a actualizar el test existente `cancelar una reserva activa` (sin motivo hoy responde «cancelada Norte lun»). **Si el dev-lead quiere que el motivo sea opcional, es una enmienda a la spec, no un detalle del plan.**
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva Sur mar». Spec calla el orden; así el error de uso no depende del estado de las reservas.
5. **Motivo sin distinguir mayúsculas ni espacios de los bordes** (`" Sala Ocupada "` vale): el texto guardado y mostrado es el de la lista, en minúsculas. Spec calla; es lo que una persona espera de un parámetro de línea de comandos.
6. **Dependencia `zod` en `dependencies` de `package.json`**, como dice la Approach de la spec. `architecture.md` dice hoy «sin dependencias externas»: la Task 1 lo actualiza. Aviso (la spec la tiene decidida, no la reabro): para un enum de tres valores `zod` es mucho; un `includes` sobre un array hace lo mismo sin dependencia. Lo apunto para la revisión del dev-lead, sin cambiar el plan.
7. **`canceladas` lista solo el estado `cancelled`**, no `voided` (anuladas, 0011 queda fuera por el Scope). Sin canceladas, responde `sin canceladas` (spec calla el caso vacío; el texto es mío). Varias, una por línea, en el orden de `bookings`.
8. **Coste estimado**: 2,5 h de implementación (ver Estimación); ~0,10–0,20 USD en tokens con Sonnet medium para las dos tasks y la revisión final.
9. **Dos tasks**: Task 1 (cancelar con motivo y dependencia) y Task 2 (`canceladas`), porque un revisor podría rechazar una y aprobar la otra y cada una tiene su ciclo de test.
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige y guarda un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: Un esquema `zod` (`z.enum`) valida el motivo en `src/app.js`; `cancelBooking` guarda `reason` en la reserva y `run` enruta `canceladas`. Todo en el único fichero de entrada, siguiendo el patrón actual.

**Tech Stack**: Node 22, módulos ES, `node --test`, `zod` (nuevo).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `dependencies` de `package.json`, frente a «Node 22, sin dependencias externas» de `architecture.md`.

## Restricciones globales

### De código

- El motivo se valida con `zod`, dependencia nueva en `dependencies` de `package.json` (spec, Approach).
- Lista cerrada de motivos, literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: `cancelada <sala> <día> (<motivo>)`; `motivo no válido: cambio de planes, sala ocupada, otro`; `<sala> <día> — <motivo>` (raya larga con espacios).
- Texto de la interfaz en castellano (constitution, Art. 4); tests antes que código (Art. 2).
- Sin comentarios que repitan el código ni que citen documentos (spec, task, constitution, capacidad); clean code, funciones cortas.
- Sin refactor fuera de scope: `voidBooking`, `freeRooms` y el resto de `src/app.js` no se tocan.

### De proceso

- Native, gama media (Sonnet, effort medium); commits con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Antes de ejecutar nada, instalar dependencias (`npm install`): no hay `node_modules`.
- Convención de commits y merge: git-flow de la constitution; el cierre lo hace `sdd-archive`.

## Review Focus

- `cancelar Norte lun` (sin `--motivo`) → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `Rejects_missing_reason`
- `cancelar Norte lun --motivo` (flag sin valor) → igual que arriba · Task 1, `Rejects_flag_without_value`
- `cancelar Sur mar --motivo xyz` (motivo inválido y sin reserva) → «motivo no válido…», no «sin reserva» · Task 1, `Validates_reason_before_lookup`
- `cancelar Norte lun --motivo "Sala Ocupada"` → «cancelada Norte lun (sala ocupada)» · Task 1, `Accepts_reason_ignoring_case`
- `canceladas` sin ninguna cancelada, o con una anulada (`voided`) → `sin canceladas`; no lista las anuladas · Task 2, `Lists_none_when_empty` y `Skips_voided`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se puede más simple (array + `includes`), pero la spec fija `zod`; ver decisión 6.
- [x] **YAGNI gate**: ninguna abstracción nueva; un esquema y dos funciones.
- [x] **Brownfield gate**: retrocompatible no del todo: `cancelar` sin motivo deja de funcionar (decisión 3); respeta el patrón de `src/app.js`; sin refactor oportunista.
- [x] **Constitution check**: Art. 1 (flujo SDD), 2 (tests antes que código, gate `node --test` entero), 4 (castellano) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — esquema `reasonSchema`, `cancelBooking(room, day, reason)`, `listCancelled()`, rutas `cancelar` (parseo de `--motivo`) y `canceladas` en `run`.
- `test/cancel.test.js` — actualiza los dos tests existentes a la nueva firma y añade los de motivo y listado.
- `package.json` — `dependencies: { "zod": "<versión que instale npm>" }`.
- `.docs/sdd/steering/architecture.md` — sustituye «sin dependencias externas» por la dependencia `zod`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — fuera de scope (0011).
- `README.md`, `CHANGELOG.md` — los toca el cierre de release, no la feature.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` (uno de la lista). Sin persistencia: viven en memoria.

### 1.6 Dependencias

`zod` (nueva, `dependencies`). Sin specs previas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install` falla sin red | baja | bloquea Task 1 | pararse y avisar; no sustituir `zod` por otra cosa sin enmienda |
| Motivo opcional era lo que quería el dev-lead | media | rehacer la Task 1 | decisión 3 en ✋ de la spec/plan; fácil de invertir (un test y una rama) |
| `process.argv` con `--motivo "sala ocupada"` llega como un solo argumento | baja | parseo erróneo | `run` recibe `params` ya separado; el test usa `['Norte','lun','--motivo','sala ocupada']` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native: el hilo principal, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (`package.json`) · docs (`architecture.md`)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)` → `string`, guarda `booking.reason`; el motivo guardado es el de la lista, en minúsculas. `run('cancelar', [room, day, '--motivo', value])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/steering/architecture.md`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, actualizar los dos existentes al nuevo contrato y añadir:
  - `cancelar una reserva activa` → `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` igual `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice` → `run('cancelar', ['Sur','mar','--motivo','otro'])` igual `'sin reserva Sur mar'`.
  - `Rejects_unknown_reason`: `['Norte','lun','--motivo','vacaciones']` igual `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `Rejects_missing_reason`: `['Norte','lun']` igual al mismo texto; `Rejects_flag_without_value`: `['Norte','lun','--motivo']` igual al mismo texto.
  - `Validates_reason_before_lookup`: `['Sur','mar','--motivo','xyz']` igual al mismo texto.
  - `Accepts_reason_ignoring_case`: `['Norte','lun','--motivo',' Sala Ocupada ']` igual `'cancelada Norte lun (sala ocupada)'`.
  - Como `bookings` es estado compartido en memoria, cada test que cancela con éxito `Norte lun` va con su reinicio de estado o un orden que no dependa del anterior: exportar `resetBookings()` si hace falta (solo para tests) y decirlo en el commit. Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `npm install zod` (queda en `dependencies`); en `src/app.js`: `const reasonSchema = z.enum(['cambio de planes','sala ocupada','otro'])`; `cancelBooking(room, day, reason)` valida con `reasonSchema.safeParse(reason?.trim().toLowerCase())` antes de `findBooking`, devuelve `motivo no válido: cambio de planes, sala ocupada, otro` si falla, guarda `booking.reason` y responde `cancelada ${room} ${day} (${reason})`; en `run`, `cancelar` extrae el valor tras `--motivo` (`undefined` si falta). Actualizar la línea de estructura de `architecture.md` («Node 22, con una dependencia: `zod`, para validar el motivo de cancelación; un solo fichero de entrada: `src/app.js`»).
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native: el hilo principal, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque la reserva vive en memoria y un proceso de `node src/app.js` por comando no conserva la cancelación entre `cancelar` y `canceladas`: se prueba por `run` en `test/cancel.test.js`, como fija «Dónde se prueba» de la spec.

**Interfaces**:
- Consume: `booking.reason` y `status: 'cancelled'` que deja `cancelBooking` de la Task 1.
- Produce: `listCancelled()` → `string` (líneas `<sala> <día> — <motivo>` unidas con `\n`, o `sin canceladas`); `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js` (tras reiniciar el estado):
  - `Lists_cancelled_with_reason`: cancelar `['Norte','lun','--motivo','sala ocupada']`, luego `run('canceladas', [])` igual `'Norte lun — sala ocupada'`.
  - `Lists_none_when_empty`: sin cancelaciones, `'sin canceladas'`.
  - `Skips_voided`: tras `run('anular', ['Norte','lun'])`, `'sin canceladas'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `listCancelled()` filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}` y une con `\n`; `run` enruta `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas sobre un único fichero; la incertidumbre es el estado compartido en memoria de los tests y la instalación de `zod`; sin estimation-log todavía.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `Rejects_unknown_reason`. ✓
- ADDED «El listado de canceladas enseña el motivo»: THEN responde «Norte lun — sala ocupada» → Task 2, `Lists_cancelled_with_reason`. ✓
- Scope «No entra: anulaciones del responsable de sala» → N/A (confirmado en spec); `Skips_voided` fija que `canceladas` no las mezcla. ✓
- Approach «el motivo se guarda con la reserva cancelada» → sin test que lea `reason` directamente: lo observa `Lists_cancelled_with_reason` a través del listado. ✓
- Review Focus (5 líneas) → Task 1 `Rejects_missing_reason`, `Rejects_flag_without_value`, `Validates_reason_before_lookup`, `Accepts_reason_ignoring_case`; Task 2 `Lists_none_when_empty`, `Skips_voided`. ✓
