---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: la sesión de Native implementa las dos tasks, en gama media (Sonnet, effort medium); el plan trae las firmas, los valores y los tests. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` (o con `--motivo` sin valor) responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. La spec dice que cancelar «pide» un motivo pero no fija este caso; reutilizo el único texto de error que fija.
4. Un motivo no válido se rechaza antes de buscar la reserva: con motivo no válido y sin reserva responde «motivo no válido…», no «sin reserva…». La spec no fija el orden.
5. `canceladas` lista solo las reservas con estado `cancelled`, en el orden en que están, una línea por reserva con el formato «<sala> <día> — <motivo>»; las anuladas (`voided`) no entran (son de la 0011), y lo observa `test/canceladas.test.js`, un fichero aparte (cada fichero corre en su proceso, con el estado limpio). Sin canceladas, responde cadena vacía (como `libres` sin salas).
6. Los dos tests existentes de `cancelar` en `test/cancel.test.js` cambian: ya no hay cancelación sin motivo, así que pasan a cancelar con `--motivo`. Es cambio de comportamiento pedido por la spec, no refactor.
7. Riesgos altos: ninguno. Coste estimado: 1,5 h de implementación, sin subagentes de implementación (solo la revisión final).
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; el comando `canceladas` lo enseña.

**Architecture**: se añade el campo `reason` a la reserva cancelada en `src/app.js` y un comando `canceladas` que filtra por estado. Sin módulos nuevos: el proyecto es un solo fichero de entrada.

**Tech Stack**: Node 22, sin dependencias externas, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato entre módulos: cambia `src/app.js` y su test.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Native: la sesión implementa cada task con TDD (test en rojo, mínimo, verde) y abre/cierra cada una con `sdd task start` / `sdd task done`.
- Un commit por task al quedar limpia su revisión; convención del proyecto (git-flow, rama `feature/0010-cancel-reason`).
- Atribución de commits según las reglas de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "sala ocupada"` con la reserva ya cancelada → «sin reserva Norte lun» (no cancela dos veces ni pisa el motivo) · Task 1, `cancelar sin reserva lo dice`
- Un motivo no válido no cancela: tras la respuesta de error la reserva sigue activa y se puede cancelar con un motivo válido · Task 1, `un motivo fuera de la lista no cancela`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo nuevo, un comando nuevo y una validación contra una lista; nada más simple cabe.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante usada en un solo sitio.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar sin motivo ya no existe); respeta el patrón de `cancelBooking`/`voidBooking` y `run`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `cancelReasons`, `cancelBooking` con motivo, función `cancelledBookings` y ramas de `run` para `cancelar --motivo` y `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan a usar `--motivo`; se añaden los de motivo y listado.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, son de la 0011.
- `test/app.test.js` — `libres` y `reservar` no cambian.
- `scripts/lint.mjs` — el lint solo mira tabuladores en `src/app.js`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string` (uno de `cancelReasons`). En memoria, sin persistencia ni migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica: es un CLI. Contrato de comandos en la spec.

### 1.5 UX

No aplica: salida de texto fijada por la spec.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El estado en memoria se comparte entre los tests del fichero y el orden importa | Media | Bajo | Los tests de `test/cancel.test.js` se escriben en el orden indicado en las tasks y cada uno dice qué estado espera |
| Un `--motivo` sin valor lee un argumento ausente | Baja | Bajo | Test `cancelar sin motivo no cancela` y valor ausente tratado como motivo no válido |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión de Native (Sonnet, effort medium); no se despacha subagente.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend, docs (nada que documentar: `operations.md` no cambia).
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el estado `active`/`cancelled` de `src/app.js` (ya existen).
- Produce: `cancelBooking(room, day, reason)` que devuelve el texto de la spec y deja la reserva con `status: 'cancelled'` y `reason`; la constante `cancelReasons = ['cambio de planes', 'sala ocupada', 'otro']`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Implementación**
  - Tests en `test/cancel.test.js`, en este orden (el estado es compartido; la reserva de Norte del lunes empieza activa):
    - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
    - `un motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones'])` → el mismo texto; y `run('libres', ['10:00-12:00'])` → `'Sur'` (la reserva sigue activa).
    - `cancelar una reserva activa` (sustituye al existente): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
    - `cancelar sin reserva lo dice` (sustituye al existente): `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`; y repetir la cancelación de Norte lun con motivo válido → `'sin reserva Norte lun'`.
  - `src/app.js`: `const cancelReasons = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: si `reason` no está en `cancelReasons` → `` `motivo no válido: ${cancelReasons.join(', ')}` ``; si no hay reserva activa → `` `sin reserva ${room} ${day}` ``; si no, `status = 'cancelled'`, `reason = reason` y `` `cancelada ${room} ${day} (${reason})` ``. En `run`, el motivo es `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está en `params` (si no, `undefined`).
- [ ] **Step 2: Build** — no hay build en este proyecto. Esperado: nada que ejecutar.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en rojo antes de implementar y `ℹ fail 0` después.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión; mensaje en la convención del proyecto, con el id 0010.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión de Native (Sonnet, effort medium); no se despacha subagente.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend.
**Verificación**: `node --test test/cancel.test.js test/canceladas.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no se puede a mano: las reservas viven en memoria y cada ejecución de `node src/app.js` parte de cero, así que `canceladas` en otro proceso sale vacío. Lo observa `node --test test/cancel.test.js`: cancela Norte lun con «sala ocupada» y comprueba que `canceladas` responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: de la Task 1, `cancelBooking(room, day, reason)` (deja `status: 'cancelled'` y `reason`) y `run('cancelar', [sala, día, '--motivo', motivo])`.
- Produce: `cancelledBookings()` que devuelve las líneas «<sala> <día> — <motivo>» de las reservas con `status === 'cancelled'`; `run('canceladas', [])` las une con salto de línea.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`; crear `test/canceladas.test.js` (pasada de fix de la revisión final)

- [ ] **Step 1: Implementación**
  - Tests al final de `test/cancel.test.js` (parten del estado que dejan los de la Task 1: la reserva de Norte del lunes cancelada con «sala ocupada»):
    - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `src/app.js`: `function cancelledBookings()` → `bookings.filter((b) => b.status === 'cancelled').map((b) => `${b.room} ${b.day} — ${b.reason}`)`; en `run`: `if (cmd === 'canceladas') return cancelledBookings().join('\n')`.
- [ ] **Step 2: Build** — no hay build en este proyecto. Esperado: nada que ejecutar.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en rojo antes de implementar y `ℹ fail 0` después.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión; mensaje en la convención del proyecto, con el id 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks sobre un solo fichero, sin dependencias; incertidumbre baja (estado en memoria compartido entre tests); sin estimation-log previo de referencia.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo» · AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `un motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Anulaciones del responsable de sala → N/A (fuera de scope, 0011). ✓
- Review Focus: `cancelar` sin motivo → Task 1, `cancelar sin motivo no cancela`. ✓
- Review Focus: reserva ya cancelada → Task 1, `cancelar sin reserva lo dice`. ✓
- Review Focus: motivo no válido no cancela → Task 1, `un motivo fuera de la lista no cancela`. ✓
- Exclusión de las anuladas del listado (decisión 5) → `test/canceladas.test.js`, `canceladas no lista las anuladas` y `canceladas sin reservas canceladas responde vacío` (añadidos en la pasada de fix de la revisión final). ✓
