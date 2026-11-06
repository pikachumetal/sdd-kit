---
id: 20261106-102216-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: las dos tasks las hace el hilo principal (Native, gama media: Sonnet, effort medium); son ~30 líneas en un fichero. La revisión final de rama, cuando se llegue a ella, va con los ejes de `sdd-verify` (Spec y Arquitectura en `sdd-kit:effort-high` + `opus`, Código en `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks**: Task 1 deja `cancelar` con motivo y `resetBookings()`; Task 2 añade `canceladas`. Cada una acaba en algo que se prueba desde la terminal.
4. **Técnica que la spec no fija**: `parseCancelArgs(params)` separa los argumentos posicionales (los que no empiezan por `--` ni son el valor del flag) del motivo; la lista de motivos es un único objeto `REASONS` (valor → texto).
5. **Parada pedida por el dev-lead**: al tener el commit de la Task 1 se para, sin empezar la Task 2 — «cuando tengas el commit de la Task 1, para.»
6. **Coste**: ~1,3 h en total (ver Estimación); sin subagentes en la implementación.
7. Review Focus: 3 entradas que la spec cierra solo en decisiones; ver la sección.

**Goal**: `cancelar` exige `--motivo` de la lista y `canceladas` enseña cada cancelada con su motivo.

**Architecture**: `src/app.js` sigue siendo el único fichero. `cancelBooking(room, day, reason)` valida el motivo antes de buscar la reserva y guarda `reason` junto a `status: 'cancelled'`; `run` parsea los argumentos. `canceladas` filtra `status === 'cancelled'`.

**Tech Stack**: Node 22, sin dependencias, `node --test` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de `cancelar` y añade un comando dentro del mismo fichero, sin módulo, dependencia ni contrato entre módulos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Textos de interfaz en castellano; identificadores de código en inglés (constitution 4; spec, decisión 17).
- Literales exactos de la spec: `cancelada <sala> <día> (<texto del motivo>)`, `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`, `motivo no válido «<valor>»: elige cambio-de-planes, sala-ocupada u otro`, `sin reserva <sala> <día>`, `sin canceladas`, `<sala> <día> <franja> · <texto del motivo>`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Native: la sesión implementa; commits con la convención del proyecto (`feat: …`), referenciando 0010.
- Atribución de commits según el reminder de la sesión.

## Review Focus

- `cancelar Norte lun --motivo` (flag sin valor, último argumento) → `falta el motivo: …` y la reserva sigue activa · Task 1, `rechaza --motivo sin valor`
- `cancelar Norte lun --motivo Otro` (mayúscula) → `motivo no válido «Otro»: …` · Task 1, `distingue mayúsculas en el motivo`
- `cancelar Norte lun --motivo ""` → `falta el motivo: …` · Task 1, `rechaza --motivo vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un objeto de motivos, un parseo, un filtro; sin capas nuevas.
- [x] **YAGNI gate**: nada se abstrae con menos de 3 usos; `REASONS` sirve a validación, respuesta y listado.
- [x] **Brownfield gate**: cambia el contrato de `cancelar` (lo declara la spec, decisión 2); respeta el patrón de `run`; sin refactor fuera de alcance.
- [x] **Constitution check**: tests antes que código (2), castellano en la interfaz (4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `test/cancelled.test.js` — tests del comando `canceladas` (Task 2).

**Modificar**:

- `src/app.js` — `REASONS`, `parseCancelArgs`, `cancelBooking(room, day, reason)`, `resetBookings()`, comando `canceladas`.
- `test/cancel.test.js` — los dos tests actuales pasan a llevar `--motivo`; casos nuevos de rechazo y de motivos.

**NO se tocan**:

- `test/app.test.js` — sigue esperando `libres 10:00-12:00` → `Sur`; no usa `resetBookings()`.
- `voidBooking` y el comando `anular` — preexistentes (spec, decisión 18).

### 1.2 a 1.6

No aplican (sin datos persistentes, migraciones, API, pantallas ni dependencias nuevas).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Alta | Medio | `resetBookings()` antes de cada caso (`beforeEach`) |
| `reason` queda tras `resetBookings()` | Baja | Bajo | el reset sustituye los objetos por la semilla nueva |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: hilo principal (Native); effort medium, sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes de implementar y sin commitear: van en el commit de la task.

**Superficies**: backend, docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`; `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el dev-lead ejecuta `node src/app.js cancelar Norte lun --motivo sala-ocupada` y ve `cancelada Norte lun (sala ocupada)`; sin `--motivo` ve `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`.

**Interfaces**:
- Consume: nada de tasks anteriores; `findBooking(room, day)` y `bookings` de `src/app.js`.
- Produce: `export function resetBookings(): void` (muta `bookings` en sitio con la semilla `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`); `export function cancelBooking(room, day, reason): string`; `const REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; el objeto cancelado lleva `reason` (la clave del flag) y `status: 'cancelled'`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, `import { run, resetBookings } from '../src/app.js'`, `beforeEach(resetBookings)` y estos tests (cada uno con `assert.equal` sobre `run('cancelar', [...])`):
  - `cancela con motivo de la lista`: `['Norte','lun','--motivo','sala-ocupada']` → `cancelada Norte lun (sala ocupada)`; después `run('libres', ['10:00-12:00'])` → `Norte, Sur`.
  - `acepta el flag en cualquier posición`: `['--motivo','otro','Norte','lun']` → `cancelada Norte lun (otro)`.
  - `acepta cambio-de-planes`: → `cancelada Norte lun (cambio de planes)`.
  - `rechaza sin motivo`: `['Norte','lun']` → `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`; `libres 10:00-12:00` → `Sur`.
  - `rechaza --motivo sin valor`, `rechaza --motivo vacío` (`'--motivo',''`) y `rechaza --motivo=otro`: misma respuesta y `libres` → `Sur`.
  - `rechaza un motivo fuera de la lista`: `--motivo vacaciones` → `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`; `libres` → `Sur`.
  - `distingue mayúsculas en el motivo`: `--motivo Otro` → `motivo no válido «Otro»: elige cambio-de-planes, sala-ocupada u otro`.
  - `comprueba el motivo antes que la reserva`: `['Sur','mar']` → `falta el motivo: …`; `['Sur','mar','--motivo','vacaciones']` → `motivo no válido «vacaciones»: …`.
  - `cancelar sin reserva lo dice`: `['Sur','mar','--motivo','otro']` → `sin reserva Sur mar`.
  - `no cancela dos veces`: cancelar Norte lun con `otro` y repetirlo → `sin reserva Norte lun`.
  - `resetBookings repone la semilla`: tras cancelar y `resetBookings()`, `libres 10:00-12:00` → `Sur`.
  Ejecútalos y comprueba que fallan.
- [ ] **Step 2: Implementación** — en `src/app.js`: `REASONS`; `OPTIONS = 'cambio-de-planes, sala-ocupada u otro'`; `parseCancelArgs(params)` → `{ room, day, reason }` (positionales: los que no empiezan por `--` ni siguen a `--motivo`; `reason` es el argumento tras `--motivo` si existe, no vacío y no empieza por `--`, si no `undefined`); `cancelBooking(room, day, reason)` valida `reason` (`undefined` → `falta el motivo: elige ${OPTIONS}`; fuera de `REASONS` con `Object.hasOwn` → `motivo no válido «${reason}»: elige ${OPTIONS}`), después busca la reserva; `resetBookings()`; `run('cancelar', params)` usa `parseCancelArgs`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` en ambos.
- [ ] **Step 4: Commit de la task** — uno solo: `feat: cancelar exige un motivo de la lista (0010)`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: hilo principal (Native); effort medium, sin despacho.
**Tests RED**: hilo principal · `test/cancelled.test.js`, escritos antes de implementar y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancelled.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el dev-lead cancela y ejecuta `canceladas` en una misma sesión de pruebas y ve `Norte lun 10:00-12:00 · cambio de planes`.

**Interfaces**:
- Consume: `resetBookings`, `REASONS`, `reason` y `status: 'cancelled'` de la Task 1.
- Produce: comando `canceladas` en `run`: una línea por reserva cancelada `${room} ${day} ${slot} · ${REASONS[reason]}` unidas con `\n`; `sin canceladas` si no hay.

**Ficheros**: crear `test/cancelled.test.js`; modificar `src/app.js`

- [ ] **Step 1: Tests RED** — `test/cancelled.test.js` con `beforeEach(resetBookings)` y tres tests: `enseña el motivo de la cancelada` (cancelar Norte lun con `cambio-de-planes`; `run('canceladas', [])` → `Norte lun 10:00-12:00 · cambio de planes`), `sin canceladas lo dice` (→ `sin canceladas`), `no lista las anuladas` (`run('anular', ['Norte','lun'])`; `canceladas` → `sin canceladas`). Ejecútalos y comprueba que fallan.
- [ ] **Step 2: Implementación** — función `cancelledList()` y `run('canceladas')`, que ignora los argumentos.
- [ ] **Step 3: Verificación** — `node --test test/cancelled.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks pequeñas en un fichero; sin entradas en `estimation-log.md` con las que calibrar
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar exige un motivo: THEN `cancelada Norte lun (sala ocupada)` y AND `libres` → `Norte, Sur` → Task 1, `cancela con motivo de la lista`. ✓
- Mismo requisito, flag en otra posición y `otro` / `cambio-de-planes` → Task 1, `acepta el flag en cualquier posición`, `acepta cambio-de-planes`. ✓
- Cancelar sin motivo se rechaza (THEN, AND `libres` → `Sur`, `--motivo` sin valor, `--motivo=otro`) → Task 1, `rechaza sin motivo`, `rechaza --motivo sin valor`, `rechaza --motivo=otro`. ✓
- Motivo fuera de la lista → Task 1, `rechaza un motivo fuera de la lista`. ✓
- El motivo se comprueba antes que la reserva (los dos WHEN) → Task 1, `comprueba el motivo antes que la reserva`. ✓
- Sin reserva / ya cancelada → Task 1, `cancelar sin reserva lo dice`, `no cancela dos veces`. ✓
- Listado: cancelada con motivo, vacío, anulada → Task 2, sus tres tests. ✓
- Decisión 13 (mayúsculas, vacío) → Task 1, `distingue mayúsculas en el motivo`, `rechaza --motivo vacío`. ✓
- Decisión 20 (`resetBookings`) → Task 1, `resetBookings repone la semilla`. ✓
- Decisión 21 (`canceladas` ignora argumentos) → sin observar: no hay escenario en la spec; se implementa y no se prueba (avisado en la spec, decisión 21). ⚠
- Tabla «cambia de forma» (`cancelar` sin motivo; respuesta con motivo) → Task 1, `rechaza sin motivo` y `cancela con motivo de la lista`; los dos tests antiguos se adaptan. ✓
- Review Focus → Task 1, `rechaza --motivo sin valor`, `distingue mayúsculas en el motivo`, `rechaza --motivo vacío`. ✓
