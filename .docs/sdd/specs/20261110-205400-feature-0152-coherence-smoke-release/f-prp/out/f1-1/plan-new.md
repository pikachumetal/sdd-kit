---
id: 20261112-121011-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Native, la sesión implementa las dos tasks (Sonnet, effort medium); son cambios pequeños con el código escrito en el plan. La revisión final de rama va con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. Los tres motivos válidos se prueban por la CLI real (`node src/app.js …` con `execFileSync`) en un fichero aparte, porque la reserva de siembra solo se puede cancelar una vez por proceso y cada fichero de `node --test` corre en el suyo.
4. En `test/cancel.test.js` los tests de fallo van antes que el de éxito: todos necesitan `Norte lun` activa. «La reserva sigue activa» se observa con `run('libres', ['10:00-12:00'])` → `Sur`, y tras cancelar → `Norte, Sur`.
5. Riesgos altos: ninguno. Coste: ~1 h, sin despachos de subagentes salvo la revisión final.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.
7. Parada del dev-lead: tras el commit de la Task 1 («cuando tengas el commit de la Task 1, para»).

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` los enseña.

**Architecture**: todo en `src/app.js`: una constante `CANCEL_REASONS`, la validación al principio de `cancelBooking`, el campo `reason` en la reserva y una función `listCancelled()` que `run` formatea.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto y el estado de una función de `src/app.js`, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Los motivos, literales: `cambio de planes`, `sala ocupada`, `otro`; la comparación distingue mayúsculas.
- Los textos de respuesta, literales de la spec: `cancelada <sala> <día> (motivo: <motivo>)`, `falta el motivo: elige uno de cambio de planes, sala ocupada, otro`, `motivo no válido: <lo escrito>; elige uno de cambio de planes, sala ocupada, otro`, `sin reserva <sala> <día>`, `sin canceladas`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.

### De proceso

- Atribución de commits según la configuración de la sesión; commit de cada task referenciando la 0010.
- Texto de la interfaz y de los documentos en castellano.

## Review Focus

- `cancelar Norte lun otro extra` (argumento sobrante) → cancela con `otro`, ignora `extra` · Task 1, `Ignora_los_argumentos_sobrantes`
- `cancelar Sur mar "x"` (sin reserva y motivo inválido) → `motivo no válido: x; …`, no `sin reserva` · Task 1, `Valida_el_motivo_antes_que_la_reserva`
- Reserva anulada con `anular` → no sale en `canceladas` · Task 2, `Una_anulada_no_sale_en_canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, una validación y un listado.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: retrocompatible solo en `anular`, `libres` y `reservar`; `cancelar` cambia a propósito (decisión 2 de la spec); sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, flujo SDD, castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancel-reasons.test.js` — los tres motivos y el argumento sobrante, por la CLI real.
- `test/cancelled-list.test.js` — `canceladas` tras cancelar.
- `test/cancelled-voided.test.js` — `canceladas` sin canceladas y con una anulada.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()` y el comando `canceladas`.
- `test/cancel.test.js` — los dos tests actuales y los de fallo.

**NO se tocan**:

- `voidBooking` y `anular` — fuera de scope (fila 0011).
- `CHANGELOG.md` — lo escribe el corte de la release.

### 1.2 a 1.6

No aplican: sin datos persistentes, migraciones, API, pantalla ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Test que pasa por orden de ejecución dentro de un fichero | media | bajo | Fallos antes del éxito en `cancel.test.js`; un fichero por reserva de siembra consumida |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); el plan trae el código y los tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, `test/cancel-reasons.test.js`, escritos antes del código y sin commitear: van en el commit de la task; TDD del propio hilo.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js test/cancel-reasons.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun "sala ocupada"` y ve `cancelada Norte lun (motivo: sala ocupada)`; sin motivo, ve `falta el motivo: elige uno de cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` guarda `booking.reason`; `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/cancel-reasons.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (todos con `Norte lun` activa salvo el último par):
  - `Falta_el_motivo`: `run('cancelar', ['Norte', 'lun'])` → `falta el motivo: elige uno de cambio de planes, sala ocupada, otro`, y `run('libres', ['10:00-12:00'])` → `Sur`.
  - `Rechaza_un_motivo_fuera_de_la_lista`: `['Norte','lun','vacaciones']`, `['Norte','lun','Sala ocupada']` y `['Norte','lun','sala','ocupada']` → `motivo no válido: vacaciones; …`, `motivo no válido: Sala ocupada; …`, `motivo no válido: sala; …`; tras ellos, `libres` → `Sur`.
  - `Valida_el_motivo_antes_que_la_reserva`: `['Sur','mar','x']` → `motivo no válido: x; elige uno de cambio de planes, sala ocupada, otro`.
  - `Cancelar_sin_reserva_lo_dice`: `['Sur','mar','otro']` → `sin reserva Sur mar`.
  - `Cancelar_con_motivo`: `['Norte','lun','sala ocupada']` → `cancelada Norte lun (motivo: sala ocupada)`, y `libres` → `Norte, Sur`.
  - `Cancelar_dos_veces_no_encuentra_reserva`: de nuevo `['Norte','lun','otro']` → `sin reserva Norte lun`.
  Sustituye los dos tests actuales por estos. En `test/cancel-reasons.test.js`, una función `cli(...args)` con `execFileSync(process.execPath, ['src/app.js', ...args], { encoding: 'utf8' }).trim()` y un test por motivo: `cancelar Norte lun "<motivo>"` → `cancelada Norte lun (motivo: <motivo>)` para `cambio de planes`, `sala ocupada` y `otro` (cada uno en su proceso), más `Ignora_los_argumentos_sobrantes`: `cancelar Norte lun otro extra` → `cancelada Norte lun (motivo: otro)`.
- [ ] **Step 2: Ver el RED** — `node --test test/cancel.test.js test/cancel-reasons.test.js`. Esperado: fallan todos los nuevos.
- [ ] **Step 3: Implementación** en `src/app.js`: `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` — si `reason` es `undefined` devuelve `falta el motivo: elige uno de ${CANCEL_REASONS.join(', ')}`; si no está en la lista, `motivo no válido: ${reason}; elige uno de ${CANCEL_REASONS.join(', ')}`; si pasa, busca la reserva (`sin reserva ${room} ${day}`) y la deja con `status = 'cancelled'`, `reason`, devolviendo `cancelada ${room} ${day} (motivo: ${reason})`. `run` pasa `params[2]` como tercer argumento.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js test/cancel-reasons.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`, un solo commit al quedar limpia.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancelled-list.test.js`, `test/cancelled-voided.test.js`, sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancelled-list.test.js test/cancelled-voided.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela y ejecuta `node src/app.js canceladas` en el mismo proceso de la app de prueba; la CLI no persiste entre ejecuciones, así que lo ve en los tests (ver spec, decisión 10).

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` de la Task 1.
- Produce: `listCancelled()` y el comando `canceladas`.

**Ficheros**: modificar `src/app.js`; crear `test/cancelled-list.test.js`, `test/cancelled-voided.test.js`

- [ ] **Step 1: Tests RED** — `test/cancelled-list.test.js`: `Lista_la_cancelada_con_su_motivo`: tras `run('cancelar', ['Norte','lun','sala ocupada'])`, `run('canceladas', [])` → `Norte lun 10:00-12:00 · sala ocupada`. `test/cancelled-voided.test.js`: `Sin_canceladas`: `run('canceladas', [])` → `sin canceladas`, y `Una_anulada_no_sale_en_canceladas`: tras `run('anular', ['Norte','lun'])`, `run('canceladas', [])` → `sin canceladas`.
- [ ] **Step 2: Ver el RED** — Esperado: fallan los tres.
- [ ] **Step 3: Implementación** — `listCancelled()` devuelve `bookings.filter((b) => b.status === 'cancelled')` en orden de inserción; `run('canceladas')` une las líneas `${room} ${day} ${slot} · ${reason}` con salto de línea, o `sin canceladas` si no hay.
- [ ] **Step 4: Verificación** — `node --test test/cancelled-list.test.js test/cancelled-voided.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): comando canceladas con el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un fichero y sin dependencias; sin referencia en el log de estimación
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar con motivo: THEN y AND de `cambio de planes` y `otro` → Task 1, `Cancelar_con_motivo` y los tres tests de `cancel-reasons.test.js`. ✓
- Sin motivo, inválido, capitalización y sin comillas: reserva sigue activa → Task 1, `Falta_el_motivo` y `Rechaza_un_motivo_fuera_de_la_lista` (con `libres`). ✓
- Motivo antes que reserva → Task 1, `Valida_el_motivo_antes_que_la_reserva`. ✓
- Cancelar sin reserva, dos veces o una anulada → Task 1, `Cancelar_sin_reserva_lo_dice` y `Cancelar_dos_veces_no_encuentra_reserva`; la anulada → sin observar: no hay una segunda reserva de siembra y `anular` consume la única (el mismo `findBooking` las trata igual). ⚠ (avisado en la decisión 14 de la spec)
- Listado con motivo y `sin canceladas` → Task 2, `Lista_la_cancelada_con_su_motivo` y `Sin_canceladas`. ✓
- Anuladas no salen → Task 2, `Una_anulada_no_sale_en_canceladas`. ✓
- Argumentos sobrantes → Task 1, `Ignora_los_argumentos_sobrantes`. ✓
- Fila «cancelada <sala> <día>» retirada → Task 1, los tests nuevos sustituyen a los dos de `cancel.test.js`. ✓
- Review Focus → las tres entradas con su test en las tasks 1 y 2. ✓
