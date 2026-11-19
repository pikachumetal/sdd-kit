---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 con la propia sesión en Native (Sonnet, effort medium): una sola task con firmas y asserts ya escritos. La revisión final de rama va con los modelos de `sdd-verify`, no con esta política.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Orden de comprobaciones en `cancelar`** (la spec lo calla): primero se busca la reserva y después se valida el motivo. Así `cancelar Sur mar` sin reserva sigue respondiendo «sin reserva Sur mar» y el test existente `cancelar sin reserva lo dice` no cambia.
4. **`cancelar` sin `--motivo`** (la spec lo calla): se trata como motivo fuera de la lista y responde «motivo no válido: cambio de planes, sala ocupada, otro»; la reserva sigue activa.
5. **`canceladas` sin canceladas** (la spec lo calla): responde «sin canceladas», en la línea de «sin reserva …». Con varias, una línea por reserva unidas con `\n`. Solo cuentan las de estado `cancelled`: las `voided` (anular, 0011) no salen.
6. **Test existente `cancelar una reserva activa`**: pasa a llevar `--motivo`, porque la spec cambia lo que responde `cancelar`; es el único test que se modifica.
7. **Riesgos altos**: ninguno; las reservas viven en memoria, así que los tests de `test/cancel.test.js` comparten estado y su orden en el fichero importa (anotado en la Task 1).
8. **Coste**: ~0,5 h de implementación; sin despachos.
9. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `cancelBooking` recibe el motivo, lo valida contra la lista y lo guarda en la reserva cancelada; una función nueva lista las reservas con estado `cancelled`. `run` interpreta `--motivo` y despacha `canceladas`.

**Tech Stack**: Node 22 sin dependencias externas, `node --test`; un solo fichero de entrada, `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade `canceladas` dentro de `src/app.js`; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Node 22, sin dependencias externas; todo en `src/app.js`.
- Lista de motivos cerrada, en este orden y con estas grafías: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano, literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada» (con raya larga `—`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.
- `scripts/lint.mjs`: sin tabuladores en `src/app.js`.

### De proceso

- Ejecución native; la sesión implementa la task y el hilo corre el gate.
- Commits de la task: uno solo al quedar limpia su revisión; convención del proyecto referenciando la 0010.
- Atribución de commits según el recordatorio de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) y `--motivo "Sala Ocupada"` (otra grafía) → «motivo no válido: …»; la lista es exacta · Task 1, `cancelar con motivo vacío o con otra grafía no cancela`
- `cancelar Sur mar --motivo otro` (sin reserva, motivo válido) → «sin reserva Sur mar» · Task 1, `cancelar sin reserva con motivo válido lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas», no cadena vacía · Task 1, `canceladas sin canceladas lo dice`
- Cancelar dos veces la misma reserva → la segunda responde «sin reserva Norte lun» y `canceladas` no la duplica · Task 1, `cancelar dos veces no duplica en canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, una función de listado y el parseo de un flag; sin estructuras nuevas.
- [x] **YAGNI gate**: sin abstracción nueva; la lista de motivos es una constante de uso único.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — motivos, `cancelBooking` con motivo, listado de canceladas, `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — los tests de la Task 1.

**NO se tocan**:

- `voidBooking` y `anular` — las anulaciones son de la 0011.
- `test/app.test.js` — no depende de `cancelar`.
- `scripts/lint.mjs` — solo se ejecuta.

### 1.2 Modelo de datos

La reserva cancelada guarda `reason` junto a `status: 'cancelled'`. En memoria, sin migración.

### 1.3 – 1.6

No aplica.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Media | Bajo | Orden de los tests fijado en la Task 1 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: la propia sesión en Native, Sonnet con effort medium; sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` y `cancelledBookings()` en `src/app.js`; `run('cancelar', [sala, día, '--motivo', motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado es compartido: hay una sola reserva, Norte lun, activa al empezar). El test `cancelar una reserva activa` se sustituye por `cancelar con motivo de la lista`; `cancelar sin reserva lo dice` queda tal cual.

  ```js
  test('canceladas sin canceladas lo dice', () => {
    assert.equal(run('canceladas', []), 'sin canceladas');
  });

  test('cancelar sin motivo no cancela', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
    assert.equal(run('canceladas', []), 'sin canceladas');
  });

  test('cancelar con motivo fuera de la lista no cancela', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), 'motivo no válido: cambio de planes, sala ocupada, otro');
    assert.equal(run('canceladas', []), 'sin canceladas');
  });

  test('cancelar con motivo vacío o con otra grafía no cancela', () => {
    const invalido = 'motivo no válido: cambio de planes, sala ocupada, otro';
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), invalido);
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'Sala Ocupada']), invalido);
  });

  test('cancelar sin reserva con motivo válido lo dice', () => {
    assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
  });

  test('cancelar sin reserva lo dice', () => {
    assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
  });

  test('cancelar con motivo de la lista', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });

  test('canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });

  test('cancelar dos veces no duplica en canceladas', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'sin reserva Norte lun');
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  ```

- [ ] **Step 2: Ver los tests en rojo** — `node --test test/cancel.test.js`. Esperado: `ℹ fail` mayor que 0, por el comportamiento que falta y no por un error de sintaxis.
- [ ] **Step 3: Implementación** en `src/app.js`; los cuerpos los escribe el implementador:
  - `const MOTIVOS = ['cambio de planes', 'sala ocupada', 'otro']` — constante, sin exportar.
  - `export function cancelBooking(room, day, reason)` — sin reserva activa → `sin reserva ${room} ${day}`; si `reason` no está en `MOTIVOS` → `motivo no válido: ${MOTIVOS.join(', ')}` sin tocar la reserva; si no, pone `status = 'cancelled'`, guarda `reason` y responde `cancelada ${room} ${day} (${reason})`.
  - `export function cancelledBookings()` — una línea `${room} ${day} — ${reason}` por reserva con `status === 'cancelled'`, unidas con `\n`; sin ninguna, `sin canceladas`.
  - `run`: `cancelar` toma el motivo del valor que sigue a `--motivo` (`undefined` si falta el flag o el valor) y llama a `cancelBooking(params[0], params[1], motivo)`; `canceladas` devuelve `cancelledBookings()`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión; mensaje con la convención del proyecto, referenciando la 0010 (`feat: motivo al cancelar (0010)`).

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h (aproximado)
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task sobre un solo fichero, sin dependencias ni migración; sin estimation-log todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista», THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar pide un motivo de la lista», AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `cancelar con motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo», THEN «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`. ✓
- Review Focus: flag sin valor y otra grafía → Task 1, `cancelar con motivo vacío o con otra grafía no cancela`. ✓
- Review Focus: sin reserva con motivo válido → Task 1, `cancelar sin reserva con motivo válido lo dice`. ✓
- Review Focus: `canceladas` vacía → Task 1, `canceladas sin canceladas lo dice`. ✓
- Review Focus: cancelar dos veces → Task 1, `cancelar dos veces no duplica en canceladas`. ✓
