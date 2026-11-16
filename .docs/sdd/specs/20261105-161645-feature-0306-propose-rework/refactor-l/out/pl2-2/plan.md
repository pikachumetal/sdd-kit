---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 con `sdd-kit:effort-medium` + `sonnet` — el plan trae firmas y asserts; no hay prosa que interpretar. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`, o con motivo fuera de la lista** → «motivo no válido: cambio de planes, sala ocupada, otro»; la spec solo fija el segundo caso y pedir motivo implica el primero.
4. **Orden de comprobaciones**: primero la reserva, luego el motivo. Así «sin reserva <sala> <día>» (regla conservada de `quitar`) sale con su texto aunque falte el motivo, y el test existente «cancelar sin reserva lo dice» no cambia.
5. **Se reescribe el test «cancelar una reserva activa»**: hoy espera «cancelada Norte lun» sin motivo, lo que la spec cambia (ADDED: la respuesta lleva el motivo).
6. **`canceladas` lista solo estado `cancelled`**, no las `voided` (0011 las trata aparte); una línea por reserva, separadas por salto de línea; sin canceladas devuelve cadena vacía.
7. **Sin observar**: «la reserva de otra persona no se toca» — el código no tiene propietario de reserva, así que ningún test puede observarla hoy; la regla la hará observable la 0011. ⚠
8. **Coste**: ~1 h de implementación y revisión; una sola sesión, sin subagentes en las tasks.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y el nuevo comando `canceladas` lo enseña.

**Architecture**: el motivo se guarda como campo `reason` de la reserva al pasar a `cancelled`; `canceladas` filtra por ese estado. Todo en `src/app.js`, sin módulos nuevos.

**Tech Stack**: Node ≥ 20, ESM, `node --test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json` · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando en el mismo módulo; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- La lista de motivos es exactamente: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios), `sin reserva <sala> <día>`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code. La constitution del proyecto no tiene artículo de calidad.

### De proceso

- Modo native, TDD del propio hilo; sin política de modelos más allá de la línea de decisiones.
- Commits con la convención del proyecto (`feat: …`), sin `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- `canceladas` tras una reserva anulada (`voided`) → no aparece · Task 1, `canceladas no lista las anuladas`
- `canceladas` sin ninguna cancelada → cadena vacía, sin error · Task 1, `canceladas sin canceladas devuelve vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y un filtro; nada más simple.
- [x] **YAGNI gate**: sin abstracción nueva; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo el cambio pedido (el motivo pasa a ser obligatorio); respeta el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: sin artículos que afecten a este plan.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking` valida el motivo y lo guarda; nueva `canceledList()` y comando `canceladas` en `run`; `cancelar` lee `--motivo`.
- `test/cancel.test.js` — tests del motivo y del listado.

**NO se tocan**:

- `voidBooking` / `anular` — anulaciones del responsable, feature 0011.
- `test/app.test.js`, `scripts/lint.mjs` — sin cambios.

### 1.2 Modelo de datos

La reserva gana `reason` (string) al cancelarse. En memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

`cancelar <sala> <día> --motivo <motivo>` · `canceladas`.

### 1.5 UX

No aplica (CLI).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` con espacios llega partido en `argv` | Baja | Bajo | `run` recibe el valor ya como un solo parámetro (`"sala ocupada"` entrecomillado en el shell); el test lo pasa como un elemento |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la ejecuta la sesión, gama media)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar; van en el commit de la task.

**Superficies**: backend · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)» y, después de cancelar en la misma ejecución, `canceladas` lo lista (el estado es en memoria: lo observa el test, no dos ejecuciones del CLI).

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room, day, reason)`, `canceledList()` → `string`, y los comandos `cancelar … --motivo` y `canceladas` en `run(cmd, params)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (reemplaza «cancelar una reserva activa» y mantiene «cancelar sin reserva lo dice»):

  ```js
  test('cancelar con motivo lo muestra', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });
  test('cancelar con motivo fuera de la lista lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  });
  test('cancelar sin motivo lo rechaza', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  });
  test('canceladas enseña el motivo', () => {
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  test('canceladas no lista las anuladas', () => {
    run('anular', ['Norte', 'lun']);
    assert.equal(run('canceladas', []), '');
  });
  test('canceladas sin canceladas devuelve vacío', () => {
    assert.equal(run('canceladas', []), '');
  });
  ```

  Como `bookings` es estado de módulo compartido, cada test que cancela o anula usa su propio import dinámico (`await import('../src/app.js?<nombre-del-test>')`) para empezar con la reserva activa; los tests async lo declaran así. Ejecútalos y comprueba que fallan por la razón esperada (no por el import).
- [ ] **Step 2: Implementación** en `src/app.js`: constante `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; `reason` fuera de `REASONS` (incluido `undefined`) → `motivo no válido: ${REASONS.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. `canceledList()` devuelve `bookings.filter(status === 'cancelled').map(b => `${b.room} ${b.day} — ${b.reason}`).join('\n')`. En `run`: `cancelar` toma el valor que sigue a `--motivo` en `params` (`undefined` si falta); `canceladas` llama a `canceledList()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: motivo al cancelar y listado de canceladas (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0.5h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 1 task sobre un fichero, sin incertidumbres técnicas; sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo lo muestra`. ✓
- AND «motivo no válido: …» (fuera de la lista) → Task 1, `cancelar con motivo fuera de la lista lo rechaza`. ✓
- THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Regla `quitar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice` (existente, se mantiene). ✓
- Regla `quitar`: la reserva de otra persona no se toca → sin observar: el código no tiene propietario de reserva (avisado en las decisiones, punto 7). ⚠
- Review Focus (3 líneas) → Task 1, tests `cancelar sin motivo lo rechaza`, `canceladas no lista las anuladas`, `canceladas sin canceladas devuelve vacío`. ✓
