---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-16
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Una sola task — cancelar con motivo y `canceladas` tocan `src/app.js` y `test/cancel.test.js`, comparten el campo `reason` y no hay una frontera donde un revisor rechace una y apruebe la otra.
2. Modelo y effort — Sonnet, effort medium: el plan lleva firmas, textos y tests; no hay prosa que interpretar.
3. Ejecución — native (fijado en `sdd-kit.json`). Sin parada antes de la Task 1: con una sola task no compensa reconstruir la caché al cambiar de modelo.
4. `cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»: la spec dice que cancelar «pide» un motivo y no fija este caso; se trata como motivo fuera de la lista y no se cancela.
5. El motivo se valida antes de buscar la reserva: `cancelar Sur mar --motivo x` responde «motivo no válido…», no «sin reserva Sur mar».
6. `canceladas` lista solo el estado `cancelled`; las `voided` (anular, 0011) no entran. Sin canceladas responde cadena vacía (como `libres` sin salas).
7. El test existente `cancelar una reserva activa` cambia a la forma con `--motivo`, porque la spec modifica el comportamiento de `cancelar`; `cancelar sin reserva lo dice` pasa a llevar un motivo válido para seguir probando lo suyo.
8. Coste estimado: ~0,5 h, orden de magnitud 50k tokens.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado (una sin test, avisada); ver la sección.

**Goal**: `cancelar` guarda un motivo de una lista cerrada y `canceladas` lo muestra.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo contra `reasons` y lo guarda en `booking.reason` junto al estado `cancelled`; `listCancelled()` filtra por ese estado y formatea cada línea. `run` parsea `--motivo` de `params`.

**Tech Stack**: Node (ESM), `node:test`; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el módulo existente; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista de motivos cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- Texto de la interfaz en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2).
- Modelo por defecto Sonnet, effort medium; sin modelos prohibidos por defecto más allá de lo que fije el proyecto.
- Commits: convención del proyecto (`feat: …`), referenciando la 0010, con la atribución que fije la sesión.

## Review Focus

- `cancelar Norte lun` (sin `--motivo`) → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Sur mar --motivo "sala ocupada"` (sin reserva) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` con una reserva anulada (`voided`) → no la lista · sin test: no se puede sembrar una anulada sin exportar `bookings`; lo cubre el filtro `status === 'cancelled'`, que mira la revisión final

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo `reason` y un filtro; nada más.
- [x] **YAGNI gate**: sin abstracciones; una constante `reasons`.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec modifica (`cancelar` ahora exige motivo); respeta el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, texto en castellano, flujo SDD.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `reasons`, `cancelBooking` con motivo, `listCancelled`, ramas `cancelar` y `canceladas` en `run`.
- `test/cancel.test.js` — tests de los escenarios de la spec y del Review Focus.

**NO se tocan**:

- `voidBooking` y `anular` — fuera de scope (0011).
- `test/app.test.js`, `test/store.test.js`, `scripts/lint.mjs` — sin relación.

### 1.2 Modelo de datos

La reserva gana `reason` (string) al cancelarse. En memoria; sin schema.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>`; `canceladas`.

### 1.5 UX

No aplica (CLI).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` con espacios llega partido si la shell no entrecomilla | Baja | Bajo | `run` toma el valor tras `--motivo` como un solo argumento; el test pasa el motivo entero |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Sonnet, effort medium (native: la sesión; sin despacho).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (lint)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; después `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: nada nuevo; usa `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason): string`; `listCancelled(): string`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituir los dos tests actuales y añadir (cada test importa `run` y parte de un estado propio; las reservas viven en memoria, así que el orden importa: los tests que cancelan Norte lun van al final y encadenados):

```js
test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada']), 'sin reserva Sur mar');
});

test('cancelar con motivo fuera de la lista lo rechaza', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin motivo no cancela', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('canceladas sin canceladas devuelve vacío', () => {
  assert.equal(run('canceladas', []), '');
});

test('cancelar con motivo de la lista lo guarda', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

```

  Las reservas viven en memoria y solo hay una (Norte lun): los tests van en este orden y el penúltimo cancela. No se puede sembrar una reserva anulada sin exportar `bookings`, y no se hace por YAGNI.

- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: falla por `cancelar` sin motivo y `canceladas` inexistente.
- [ ] **Step 3: Implementación** — en `src/app.js`: `const reasons = ['cambio de planes', 'sala ocupada', 'otro'];`; `cancelBooking(room, day, reason)`: si `!reasons.includes(reason)` devuelve `motivo no válido: ${reasons.join(', ')}`; si no hay reserva, `sin reserva ${room} ${day}`; si la hay, estado `cancelled`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. `listCancelled()`: `bookings.filter(b => b.status === 'cancelled').map(b => `${b.room} ${b.day} — ${b.reason}`).join('\n')`. En `run`: `cancelar` toma `params[0]`, `params[1]` y el valor que sigue a `--motivo` (`undefined` si falta); `canceladas` devuelve `listCancelled()`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat: motivo al cancelar y comando canceladas (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar pide un motivo de la lista · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista lo guarda`. ✓
- Cancelar pide un motivo de la lista · AND motivo fuera de la lista → «motivo no válido: …» → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- El listado de canceladas enseña el motivo · THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- `anular` (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; sin reserva → `cancelar sin reserva lo dice`. ✓
- Review Focus: anuladas fuera de `canceladas` → sin observar: no hay forma de sembrar una `voided` (avisado en el Review Focus). ⚠
