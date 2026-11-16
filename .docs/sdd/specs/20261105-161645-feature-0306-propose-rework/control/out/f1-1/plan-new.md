---
id: 20261106-094640-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, las ejecuta el hilo principal; sin despachos. La revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native, porque 2 tasks encadenadas por la constante de motivos y `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto.
3. **Parada**: el dev-lead pidió parar cuando exista el commit de la Task 1; la sesión no sigue con la Task 2 hasta que diga «sigue».
4. **Técnica que la spec no fija**: `cancelBooking(room, day, args)` recibe los argumentos tras sala y día; solo `['--motivo', clave]` exacto es válido (decisión 10 de la spec). `reason` guarda la clave.
5. **Coste**: ~1,5 h de implementación; sin despachos.
6. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige `--motivo` de una lista cerrada y `canceladas` lista las canceladas con su motivo.

**Architecture**: la reserva guarda `reason` al pasar a `cancelled`; el listado filtra por `status === 'cancelled'`. Un único fichero de producción, `src/app.js`.

**Tech Stack**: Node 22 sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por la constante de motivos y `cancelBooking`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js` y los tests; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Las claves de motivo son exactamente `cambio-de-planes`, `sala-ocupada` y `otro`; los textos mostrados, `cambio de planes`, `sala ocupada` y `otro`.
- Aviso literal: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code. Textos de la interfaz en castellano (constitution, art. 4).

### De proceso

- Tests antes que código (constitution, art. 2). Gate de cierre: `node --test && node scripts/lint.mjs`.
- Commits de la convención del proyecto, referenciando 0010.

## Review Focus

- `cancelar Norte lun --motivo` (opción sin valor) → aviso de motivo y la reserva sigue activa · Task 1, test `opción sin valor`
- `cancelar Norte lun --motivo=otro` → aviso de motivo · Task 1, test `forma con igual`
- `cancelar Norte lun --motivo otro extra` (argumento sobrante) → aviso de motivo · Task 1, test `argumento sobrante`
- `cancelar` sobre una reserva ya cancelada → `sin reserva`, sin cambiar el motivo · Task 1, test `ya cancelada`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, una comprobación y un comando.
- [x] **YAGNI gate**: sin registro aparte ni reset exportado.
- [x] **Brownfield gate**: `cancelar` sin motivo deja de cancelar, aceptado en la decisión 2 de la spec; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero, castellano, gate de cierre.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/canceladas.test.js` y `test/canceladas-otro.test.js` — texto de `sala-ocupada` y `otro` en `cancelar` y en `canceladas` (un proceso por estado).
- `test/canceladas-vacio.test.js` — `sin canceladas` y anulada excluida (proceso propio).

**Modificar**:

- `src/app.js` — constante de motivos, `cancelBooking` con motivo, comando `canceladas`.
- `test/cancel.test.js` — los dos tests actuales con `--motivo` y los nuevos de la Task 1.

**NO se tocan**:

- `src/app.js` `voidBooking`, `freeRooms` — `anular` es la fila 0011.
- `.docs/sdd/changelog.md` — la entrada de v0.3.0 es histórica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests | Media | Medio | Un fichero de test por estado (`node --test` los corre en procesos distintos) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión nativa (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, tests
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun · sala ocupada`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, options)` con `options` = argumentos tras sala y día; `booking.reason` con la clave; constante `REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', 'otro': 'otro' }` en `src/app.js`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, por `run('cancelar', [...])`:
  - `cancelar con motivo`: `['Norte','lun','--motivo','cambio-de-planes']` → `cancelada Norte lun · cambio de planes`; después `run('libres', ['10:00-12:00'])` → `Norte, Sur`.
  - `sin motivo`, `clave inválida`, `opción sin valor`, `forma con igual`, `argumento sobrante`, `clave en mayúsculas`: cada uno con `run('cancelar', ['Norte','lun', ...])` → `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`; van antes de `cancelar con motivo` en el fichero (la reserva debe seguir activa), y `ya cancelada` va después.
  - `motivo inválido sin reserva`: `['Sur','mar','--motivo','aburrimiento']` → el aviso.
  - `sin reserva`: `['Sur','mar','--motivo','otro']` → `sin reserva Sur mar`.
  - `ya cancelada`: tras `cancelar con motivo`, `['Norte','lun','--motivo','otro']` → `sin reserva Norte lun`.
  - Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** — `REASONS` en `src/app.js`; `cancelBooking(room, day, options = [])`: valida primero que `options` sea exactamente `['--motivo', clave]` con `clave` en `REASONS`, si no devuelve el aviso; después `findBooking`, `sin reserva` si no hay; si hay, `status = 'cancelled'`, `reason = clave`, devuelve `cancelada ${room} ${day} · ${REASONS[clave]}`. En `run`, `cancelar` pasa `params.slice(2)`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`; `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `feat: motivo al cancelar una reserva (0010, Task 1)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión nativa (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/canceladas.test.js`, `test/canceladas-otro.test.js`, `test/canceladas-vacio.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend, tests
**Verificación**: `node --test test/canceladas.test.js test/canceladas-otro.test.js test/canceladas-vacio.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js canceladas` en una sesión nueva y ve `sin canceladas`.

**Interfaces**:
- Consume: `booking.reason` y `REASONS` de la Task 1.
- Produce: comando `canceladas` en `run`.

**Ficheros**: crear `test/canceladas.test.js`, `test/canceladas-otro.test.js`, `test/canceladas-vacio.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `canceladas.test.js`: `run('cancelar', ['Norte','lun','--motivo','sala-ocupada'])` → `cancelada Norte lun · sala ocupada`, y `run('canceladas', [])` → `Norte lun · sala ocupada`. `canceladas-otro.test.js`: `--motivo otro` → `cancelada Norte lun · otro`, y `canceladas` → `Norte lun · otro`. `canceladas-vacio.test.js`: `run('canceladas', [])` → `sin canceladas`, y tras `run('anular', ['Norte','lun'])` → `sin canceladas`. Ejecutar y ver que fallan (los de `cancelar` ya pasan tras la Task 1; fallan los de `canceladas`).
- [ ] **Step 2: Implementación** — función `cancelledList()` que filtra `status === 'cancelled'`, mapea a `${room} ${day} · ${REASONS[reason]}`, une con salto de línea o devuelve `sin canceladas`; `run` la enlaza con `canceladas`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat: listado de canceladas (0010, Task 2)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks, un solo fichero de producción, sin incertidumbres; sin referencia en el log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN `cancelada Norte lun · cambio de planes` y AND `libres 10:00-12:00` → Task 1, `cancelar con motivo`. ✓
- Textos de las tres claves: `sala-ocupada` y `otro` en la respuesta de `cancelar` → Task 2, `canceladas.test.js` y `canceladas-otro.test.js`; `cambio-de-planes` → Task 1. ✓
- Motivo obligatorio: sin `--motivo`, clave inválida, sin valor, con igual, mayúsculas, la reserva sigue activa → Task 1, tests homónimos. ✓
- Motivo inválido sin reserva → Task 1, `motivo inválido sin reserva`. ✓
- Cancelar sin reserva y ya cancelada → Task 1, `sin reserva` y `ya cancelada`. ✓
- Listado: una cancelada, `sin canceladas`, anulada excluida → Task 2. ✓
- Orden del listado (decisión 12) → sin observar con dos líneas (avisado en la spec). ⚠
- Línea retirada `cancelada <sala> <día>` → Task 1, los tests existentes reescritos. ✓
- Review Focus: 4 entradas → Task 1, sus tests. ✓
