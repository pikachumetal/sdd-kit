---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-29
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 en la sesión (Native), Sonnet con effort medium: cada una toca una función de `src/app.js` y el plan trae firmas y asserts. La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`, o con `--motivo` sin valor** responde «motivo no válido: cambio de planes, sala ocupada, otro», como un motivo fuera de la lista. La spec dice que cancelar «pide» un motivo pero no cubre este caso. El motivo se valida antes de buscar la reserva, así que `cancelar Sur mar` sin motivo da «motivo no válido…» y no «sin reserva Sur mar».
4. **`canceladas` sin ninguna cancelada** responde «sin canceladas» (texto nuevo, en la línea de «sin reserva …»); con varias, una por línea con el formato «<sala> <día> — <motivo>». La spec solo fija el caso de una.
5. **Los tests existentes de `cancel.test.js`** se actualizan al nuevo contrato: «cancelada Norte lun» pasa a «cancelada Norte lun (sala ocupada)» y las llamadas añaden `--motivo`.
6. **Riesgo**: el almacén vive en memoria y los tests de un fichero comparten estado. Orden en `test/cancel.test.js`: primero `canceladas` vacío, luego `cancelar` con motivo (cancela Norte lun) y justo después `canceladas` con esa cancelación.
7. **Coste**: ~0,5 h, sin subagentes (Native).
8. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` sigue siendo el único fichero. `cancelBooking` recibe el motivo, lo valida contra `REASONS` y lo guarda en la reserva; una función nueva `cancelledBookings` formatea el listado y `run` enruta el comando `canceladas`.

**Tech Stack**: Node 22, sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos o datos; cambia dos funciones de `src/app.js`.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano; Node 22, sin dependencias externas.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2). Git-flow: trabajo en `feature/0010-cancel-reason`.
- Perfil `delegate`: el plan no es una parada.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo «motivo no válido: …» · Task 1, `cancelar con --motivo sin valor lo rechaza`
- `canceladas` sin ninguna cancelada → «sin canceladas», no una línea vacía · Task 2, `canceladas sin canceladas lo dice`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos ni abstracciones nuevas; dos funciones y una constante.
- [x] **YAGNI gate**: no se añade API para reiniciar el almacén ni se generaliza el formato del listado.
- [x] **Brownfield gate**: retrocompatible solo en lo que la spec cambia (`cancelar` ahora exige motivo); `anular` y `libres` no se tocan; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `optionValue`, `cancelBooking(room, day, reason)`, `cancelledBookings()` y la ruta `canceladas` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios y los tres de Review Focus; actualiza los dos existentes.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable, feature 0011.
- `test/app.test.js`, `test/store.test.js` — no dependen de `cancelar`.

### 1.2 a 1.6

No aplican.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests de `cancel.test.js` dependen del orden por el estado en memoria | Media | Bajo | Orden fijado en la decisión 6; el gate corre el fichero entero |
| `test/app.test.js` o `test/store.test.js` llaman a `cancelar` sin motivo | Baja | Medio | Task 1 busca `cancelar` en `test/` antes de implementar |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (la task trae firmas y asserts).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task; TDD del propio hilo.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `optionValue(params, flag)` → el valor que sigue a `flag` o `undefined`; `cancelBooking(room, day, reason)` que guarda `booking.reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED y búsqueda** — `grep -rn "cancelar" test/` para ver otros llamantes. En `test/cancel.test.js`, en este orden, los tests de `run` (con `assert.equal`):
  - `cancelar con motivo`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar con motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  - `cancelar con --motivo sin valor lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo mensaje.
  - `cancelar sin reserva lo dice` (actualizado): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.

  El primero sustituye a «cancelar una reserva activa». Los rechazos van antes de él en el fichero para que Norte lun siga activa cuando se rechaza; el de éxito se declara el último de los cuatro de motivo. Ejecuta y comprueba que falla.
- [ ] **Step 2: Implementación** — en `src/app.js`: `REASONS` como arriba; `function optionValue(params, flag)` devuelve `params[params.indexOf(flag) + 1]` si el flag está y tiene valor, si no `undefined`; `cancelBooking(room, day, reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` si `reason` no está en `REASONS` (antes de buscar la reserva), `sin reserva …` si no hay, y si no guarda `booking.reason = reason`, pone `cancelled` y devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`: `cancelBooking(params[0], params[1], optionValue(params, '--motivo'))`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` de la Task 1.
- Produce: `cancelledBookings()` → texto con una línea `` `${room} ${day} — ${reason}` `` por reserva cancelada, unidas con `\n`, o `'sin canceladas'` si no hay; la ruta `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`: `canceladas sin canceladas lo dice`, declarado antes de cualquier cancelación: `run('canceladas', [])` → `'sin canceladas'`; y `canceladas enseña el motivo`, declarado justo después de `cancelar con motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`. Ejecuta y comprueba que fallan.
- [ ] **Step 2: Implementación** — `cancelledBookings()` en `src/app.js` con el formato de Interfaces; en `run`, `if (cmd === 'canceladas') return cancelledBookings();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks pequeñas sobre un solo fichero, sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo`. ✓
- AND «motivo fuera de la lista responde «motivo no válido: …»» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado de canceladas enseña el motivo»: THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- «Dónde se prueba» de la spec: por `cancelar` y `canceladas` en `test/cancel.test.js` → ambas tasks. ✓
- Anulaciones del responsable (0011) → N/A (confirmado en spec). ✓
- Review Focus: sin motivo y flag sin valor → Task 1, sus dos tests; sin canceladas → Task 2, `canceladas sin canceladas lo dice`. ✓
