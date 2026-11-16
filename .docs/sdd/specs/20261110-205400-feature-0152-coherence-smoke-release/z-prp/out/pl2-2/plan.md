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

1. **Modelo y effort por task**: Task 1 y Task 2 con la sesión (Native), gama media, effort medium — son cambios de unas 15 líneas en un solo fichero, con la firma y los tests ya fijados aquí.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista** («motivo no válido: cambio de planes, sala ocupada, otro»): la spec cierra la lista y no dice si el motivo es opcional; lo trato como obligatorio. Se valida el motivo antes de buscar la reserva.
4. **«sin reserva <sala> <día>» se conserva** (tabla de reglas retiradas de la spec) y sale cuando el motivo es válido y no hay reserva activa.
5. **`canceladas` sin ninguna cancelación responde «sin canceladas»**: la spec no fija ese texto; es visible, validadlo.
6. **`canceladas` lista solo el estado `cancelled`**: las `voided` (anular) quedan fuera, son de la 0011.
7. **Los tests de `test/cancel.test.js` comparten el estado en memoria del módulo**: el test de `canceladas` cancela él mismo antes de listar, con el mismo motivo, para no depender del orden.
8. **Riesgos altos**: ninguno. **Coste estimado**: ~0,5 h de implementación, sin subagentes.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: `cancelBooking` guarda `reason` en la reserva al pasarla a `cancelled`; `run` extrae el valor de `--motivo` y despacha `canceladas` a una función nueva que filtra por estado. Sin ficheros nuevos.

**Tech Stack**: Node 22, ESM, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de dos comandos en `src/app.js`: sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es exactamente: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga), «sin reserva <sala> <día>».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.
- Textos de interfaz en castellano.

### De proceso

- Native: la sesión implementa cada task con TDD (RED antes del código), una tras otra.
- Commits referenciando la feature 0010; uno por task al quedar limpia su revisión.
- Política de modelos: gama media (Sonnet, effort medium) para las tasks.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar», no «cancelada» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelación → «sin canceladas» · Task 2, `canceladas sin cancelaciones`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un filtro; nada más simple.
- [x] **YAGNI gate**: sin abstracciones; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` exige motivo); respeta el estilo de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), textos en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo; `cancelledBookings`; `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de `cancelar` pasan a llevar motivo; tests nuevos de motivo y de `canceladas`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no toca `cancelar` ni `canceladas`.
- `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Datos en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica (CLI): `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests de `cancel.test.js` dependen del orden por el estado compartido | media | bajo | El test de `canceladas` cancela antes de listar (decisión 7) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: la sesión nativa, gama media (Sonnet, effort medium); no se despacha.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → string; guarda `booking.reason = reason`. `const reasons = ['cambio de planes', 'sala ocupada', 'otro']`. `run('cancelar', params)` lee el valor que sigue a `--motivo` en `params` (`undefined` si falta).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`; ajusta los dos existentes y añade:
  - `cancelar una reserva activa`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `assert.equal(..., 'cancelada Norte lun (sala ocupada)')`
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`
  - `cancelar con motivo fuera de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → el mismo texto de motivo no válido; y `run('libres', ['10:00-12:00'])` sigue en `'Sur'`.
  - Orden en el fichero: los de motivo inválido/ausente primero, luego el que cancela de verdad (comparten estado).
  Ejecútalos y mira que fallen.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)` en `src/app.js`: si `!reasons.includes(reason)` devuelve `motivo no válido: ${reasons.join(', ')}`; si no hay reserva, `sin reserva ${room} ${day}`; si hay, `status = 'cancelled'`, `reason`, y devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` pasa `params[params.indexOf('--motivo') + 1]` cuando `--motivo` está, `undefined` si no.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: la sesión nativa, gama media (Sonnet, effort medium); no se despacha.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend · tests
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `canceladas` y ve «Norte lun — sala ocupada» (en la CLI cada proceso parte de cero: en la aplicación real se ve tras cancelar en el mismo proceso, y lo cubre el test).

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` de la Task 1.
- Produce: `cancelledBookings()` → string: una línea `${room} ${day} — ${reason}` por reserva `cancelled`, unidas por `\n`; `sin canceladas` si no hay; `run('canceladas')` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas enseña el motivo`: cancela `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` (da igual si ya estaba cancelada) y `assert.equal(run('canceladas', []), 'Norte lun — sala ocupada')`.
  - `canceladas sin cancelaciones`: primer test del fichero, antes de que ninguno cancele (estado compartido): `run('canceladas', [])` → `'sin canceladas'`. Los que cancelan van después.
  Ejecútalos y mira que fallen.
- [ ] **Step 2: Implementación** — `cancelledBookings()` en `src/app.js` con el filtro `status === 'cancelled'`; rama `if (cmd === 'canceladas') return cancelledBookings();` en `run`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 2 tasks en un solo fichero de 35 líneas; sin incertidumbres; estimation-log sin calibración todavía.
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
- AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista`. ✓
- THEN `canceladas` responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Regla retirada `quitar`: sin reserva responde «sin reserva <sala> <día>» → `cancelar`, Task 1, `cancelar sin reserva lo dice`. ✓
- Regla retirada `quitar`: la reserva de otra persona no se toca → sin observar: el modelo no tiene dueño de reserva y la spec no define «otra persona»; `cancelar` solo cancela la reserva activa de la sala y el día pedidos (avisado: validadlo en la spec). ⚠
- `canceladas` excluye las anuladas (decisión 6) → sin observar: no hay forma de crear una reserva anulada sin una activa y el estado es privado; lo fija el filtro `status === 'cancelled'` y lo revisa el eje Código. ⚠
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; sin reserva → Task 1, `cancelar sin reserva lo dice`; sin cancelaciones → Task 2, `canceladas sin cancelaciones`. ✓
