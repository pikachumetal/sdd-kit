---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Quién canceló sale de `process.env.USUARIO`** — la spec pide «quién canceló» («Ana») pero la app no tiene noción de usuario y el comando `cancelar` de la spec no lleva `--por`. `run(cmd, params, user = process.env.USUARIO ?? 'desconocido')` lo recibe como tercer parámetro, así los tests lo inyectan. No cambia la salida de `cancelar`; sí fija de dónde sale el nombre.
2. **Sin motivo, o `--motivo` sin valor, es «motivo no válido: …»** — la spec dice «cancelar pide un motivo». El motivo se valida antes de buscar la reserva: un motivo malo no cancela nada.
3. **`canceladas` sin ninguna responde «sin canceladas»** — la spec no fija el caso vacío; sigue el estilo de «sin reserva …». Las anuladas (`voided`) no entran: solo estado `cancelled`.
4. **Dos tasks, verticales**: Task 1 cancelar con motivo (guarda motivo y autor), Task 2 `canceladas` que lo lee. Mismo fichero y misma superficie, sin migración: no se propone partir.
5. **Modelo**: Native fijado en `sdd-kit.json`; la sesión ejecuta ambas tasks (Sonnet, effort medium: son ~30 líneas con firmas y textos ya fijados). Revisor final de rama: `sdd-kit:effort-high` + `opus`.
6. **Riesgo**: la app guarda las reservas en memoria, por proceso. Por la CLI, `cancelar` y `canceladas` van en procesos distintos y `canceladas` saldrá siempre vacío; el escenario de la spec solo se puede probar en la suite. No es de esta feature (no hay persistencia en el producto); queda dicho en el guion.
7. **Coste**: ~0,5 h de implementación, sin despachos de implementador (solo el revisor final).
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista y lo guarda con quién canceló; `canceladas` lista las canceladas con ese motivo y autor.

**Architecture**: Todo en `src/app.js`. `cancelBooking` gana `reason` y `user` y los guarda en la reserva; una función nueva `cancelledList()` lee las reservas con estado `cancelled`; `run` parsea `--motivo` y enruta `canceladas`.

**Tech Stack**: Node 22 sin dependencias, `node:test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Motivos válidos, literales y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `<sala> <día> — <motivo> — <quién>` (separador raya con espacios).
- Node 22, sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Texto de la interfaz y de los documentos en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres que se explican solos; funciones cortas con una sola responsabilidad.

### De proceso

- Native: la sesión implementa; Sonnet con effort medium. Revisor final: `sdd-kit:effort-high` + `opus`, también con dos tasks.
- Commits con la convención del proyecto (`feat: …`) y la línea de atribución de Claude al final.

## Review Focus

- `cancelar Norte lun` sin `--motivo`, o `--motivo` como último argumento sin valor → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo o con --motivo vacío es motivo no válido`
- Un motivo no válido no cancela: tras el rechazo, la reserva sigue activa y un `cancelar` correcto la cancela · Task 1, `un motivo no válido no cancela la reserva`
- `cancelar Sur mar --motivo otro` (sin reserva) → «sin reserva Sur mar», como hasta ahora · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `canceladas sin canceladas`
- Una reserva anulada (`anular`) no sale en `canceladas` · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin módulos nuevos ni estructuras nuevas; un campo `reason` y otro `cancelledBy` en la reserva.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante usada en dos sitios (validación y mensaje).
- [x] **Brownfield gate**: respeta el patrón de `src/app.js` (funciones exportadas + `run`); `voidBooking` y `anular` no se tocan (0011).
- [x] **Constitution check**: tests antes que código (Art. 2), textos en castellano (Art. 4); sin comentarios que repitan el código.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — motivos, `cancelBooking` con motivo y autor, `cancelledList`, parseo de `--motivo` y comando `canceladas` en `run`.
- `test/cancel.test.js` — los dos tests existentes de cancelar pasan a la forma con motivo; tests nuevos de cada THEN.

**NO se tocan**:

- `test/app.test.js` — `libres` y `reservar --cada-semana` no cambian.
- `voidBooking` y el comando `anular` en `src/app.js` — son de la 0011.

### 1.2 Modelo de datos

La reserva en memoria gana `reason: string` y `cancelledBy: string`, rellenos al cancelar. Sin persistencia.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`. Salidas literales en las restricciones.

### 1.5 UX

No aplica: salida de consola.

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) es posterior y no comparte código nuevo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Alta | Medio | Cada test que cancela usa un módulo fresco: `await import('../src/app.js?<n>')` |
| `canceladas` vacío por la CLI (procesos separados) | Alta | Bajo | Dicho en el guion; la verificación es la suite |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar pide un motivo

**Modelo**: sesión Native, Sonnet con effort medium (sin despacho; el revisor final va con `subagent_type: sdd-kit:effort-high` + `model: opus`)
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task; Native: TDD del propio hilo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo "aburrimiento"` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada.
- Produce: `export const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `export function cancelBooking(room: string, day: string, reason: string | undefined, user: string): string`, que deja en la reserva `reason` y `cancelledBy`; `run(cmd: string, params: string[], user?: string): string`, con `user` por defecto `process.env.USUARIO ?? 'desconocido'`. Reserva sembrada: `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Helper `const fresh = (n) => import(`../src/app.js?${n}`)` para estado limpio. Los dos tests existentes pasan a esta forma y los nuevos son:
  - `cancelar una reserva activa con motivo`: `const { run } = await fresh(1)`; `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'], 'Ana')` → `'cancelada Norte lun (sala ocupada)'`.
  - `un motivo fuera de la lista es motivo no válido`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'], 'Ana')` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo o con --motivo vacío es motivo no válido`: `['Norte', 'lun']` y `['Norte', 'lun', '--motivo']` dan el mismo mensaje.
  - `un motivo no válido no cancela la reserva`: tras el rechazo, `run('cancelar', ['Norte', 'lun', '--motivo', 'otro'], 'Ana')` → `'cancelada Norte lun (otro)'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'], 'Ana')` → `'sin reserva Sur mar'`.

  Esperado: FAIL (sin motivo el código devuelve `cancelada Norte lun`).
- [ ] **Step 2: Implementación** en `src/app.js`: `REASONS`; `cancelBooking(room, day, reason, user)` valida el motivo con `REASONS.includes` **antes** de buscar la reserva, devuelve los textos literales y guarda `reason` y `cancelledBy`; en `run`, el motivo es el argumento que sigue a `--motivo` (`undefined` si no hay) y `user` es el tercer parámetro con su valor por defecto.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: todos en verde.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`; uno solo, al quedar limpia la revisión.

### Task 2 — Listado de canceladas

**Modelo**: sesión Native, Sonnet con effort medium
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task; Native: TDD del propio hilo

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: no desde la CLI, porque las reservas viven en memoria de cada proceso y `canceladas` en un proceso nuevo responde `sin canceladas`; la comprobación que sí se puede hacer es la suite (`canceladas enseña el motivo y quién canceló`) y ejecutar `node src/app.js canceladas` para ver `sin canceladas`.

**Interfaces**:
- Consume: de la Task 1, `cancelBooking(room, day, reason, user)` que deja `reason` y `cancelledBy` en la reserva con `status: 'cancelled'`; `run(cmd, params, user?)`; reserva sembrada `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; `voidBooking` deja `status: 'voided'`.
- Produce: `export function cancelledList(): string`, una línea `<sala> <día> — <motivo> — <quién>` por reserva con estado `cancelled`, unidas con `\n`, o `'sin canceladas'` si no hay; `run('canceladas', [])` la devuelve.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, cada uno con `fresh(n)`:
  - `canceladas enseña el motivo y quién canceló`: cancelar `['Norte', 'lun', '--motivo', 'sala ocupada']` como `'Ana'`; `run('canceladas', [])` → `'Norte lun — sala ocupada — Ana'`.
  - `canceladas sin canceladas`: `run('canceladas', [])` → `'sin canceladas'`.
  - `canceladas no lista las anuladas`: `run('anular', ['Norte', 'lun'])` y luego `run('canceladas', [])` → `'sin canceladas'`.
  - `sin usuario, quién canceló es desconocido`: con `delete process.env.USUARIO` y `run('cancelar', [...])` sin tercer argumento, `canceladas` → `'Norte lun — otro — desconocido'`.

  Esperado: FAIL (`canceladas` cae en `'salas'`).
- [ ] **Step 2: Implementación** `cancelledList(): string` en `src/app.js`, y `if (cmd === 'canceladas') return cancelledList();` en `run`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: todos en verde.
- [ ] **Step 4: Commit de la task** — `feat: comando canceladas con motivo y autor (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` (suite entera)
- [ ] Verificación de los THEN de la spec: los dos escenarios y el rechazo del motivo, ejecutados con `node src/app.js cancelar …` donde se puede (Task 1) y con la suite para `canceladas`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (respuesta con motivo) → Task 1, `cancelar una reserva activa con motivo`. ✓
- … AND motivo fuera de la lista → Task 1, `un motivo fuera de la lista es motivo no válido`. ✓
- ADDED «El listado de canceladas enseña el motivo y quién canceló» → Task 2, `canceladas enseña el motivo y quién canceló`. ✓
- No entra: anulaciones del responsable (0011) → N/A, `voidBooking` intacto. ✓
- Sin motivo / `--motivo` vacío → Task 1, `cancelar sin motivo o con --motivo vacío es motivo no válido`. ✓
- Motivo no válido no cancela → Task 1, `un motivo no válido no cancela la reserva`. ✓
- Sin reserva → Task 1, `cancelar sin reserva lo dice`. ✓
- Listado vacío → Task 2, `canceladas sin canceladas`. ✓
- Anuladas fuera del listado → Task 2, `canceladas no lista las anuladas`. ✓
