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

1. **Modelo y effort**: Native, las dos tasks en el hilo principal (Sonnet, effort medium): el plan trae firmas y asserts. La revisión final de rama va con los ejes de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`--motivo` ausente** → mismo mensaje que un motivo fuera de la lista (`motivo no válido: …`). La spec dice que cancelar «pide» un motivo y no fija este caso.
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo xx` responde «motivo no válido…», no «sin reserva…».
5. **`canceladas` sin ninguna cancelada** → `sin canceladas`. Texto nuevo que la spec no fija. Varias canceladas: una línea cada una, unidas con `\n`. Las anuladas (`voided`) no salen, por el filtro; sin test, porque no hay una segunda reserva que anular.
6. **Los dos tests existentes de `cancelar`** pasan a llevar `--motivo`: la spec cambia el contrato de `cancelar`, así que se actualizan, no se borran.
7. **`architecture.md` dice «sin dependencias externas»** y `zod` la rompe: la Task 1 actualiza esa línea (excepción registrada en §1.9).
8. **Riesgo alto**: `.docs/sdd/capabilities/` no existe y la spec declara `bookings` como «Modificada». El `sdd capability merge` de `sdd-archive` puede fallar con `MODIFIED` sobre una capacidad ausente. Hay que resolverlo al cerrar (crear `bookings` o pasar el delta a `ADDED`) y avisar al dev-lead.
9. **Coste**: ~1 h, 2 tasks, sin subagentes de tarea; solo la revisión final de rama.
10. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada, lo guarda con la reserva, y `canceladas` lo enseña.

**Architecture**: `zod` valida el motivo (`z.enum`) en `src/app.js`. La reserva cancelada guarda `reason`. `canceladas` filtra `status === 'cancelled'`.

**Tech Stack**: Node ≥ 20, ESM, `node --test`, `zod` (nueva).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `dependencies` de `package.json`.

## Restricciones globales

### De código

- Dependencia nueva: `zod`, en `dependencies` de `package.json`. Ninguna otra.
- Motivos válidos, literales y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `<sala> <día> — <motivo>` (raya larga con espacios).
- Texto de la interfaz en castellano (Constitution, Art. 4).
- Sin comentarios que repiten el código ni que citan documentos (constitution, spec, task, capacidad); código limpio.

### De proceso

- Tests antes que código (Constitution, Art. 2). Los RED no se commitean: van en el commit de su task.
- Un commit por task, convención del proyecto (`feat: …`), con la atribución que fije el entorno.
- Gate completo solo en §3.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro` · Task 1, `cancelar sin motivo lo rechaza`
- `cancelar Sur mar --motivo xx` (motivo inválido y sin reserva) → `motivo no válido: …` y la reserva no cambia · Task 1, `motivo no válido gana a sin reserva`
- Un motivo no válido no cancela: tras `cancelar Norte lun --motivo xx`, `canceladas` no lista Norte lun · Task 2, `motivo no válido no deja cancelada`
- `canceladas` sin canceladas → `sin canceladas` · Task 2, `canceladas vacío`. Una anulada no sale por el filtro `status === 'cancelled'`; sin una segunda reserva sembrada no hay test que la anule, y no se siembra datos nuevos fuera de la spec.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una validación y un listado, sin capas nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva; una constante con la lista de motivos.
- [x] **Brownfield gate**: `anular` y `libres` no se tocan; solo cambia el contrato de `cancelar`, que la spec manda.
- [x] **Constitution check**: tests primero, castellano, git-flow. Sin conflicto con la constitución. `architecture.md` pide actualización (§1.9).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `MOTIVOS`, validación con `zod`, `reason` en la reserva cancelada, comando `canceladas`.
- `test/cancel.test.js` — tests nuevos y los dos existentes con `--motivo`.
- `package.json` — `zod` en `dependencies` (con `npm install zod`, que crea `package-lock.json`).
- `.docs/sdd/steering/architecture.md` — la línea «sin dependencias externas» pasa a nombrar `zod`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — pertenecen a la 0011.
- `test/app.test.js` — no usa `cancelar`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. En memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`, con los mensajes de «De código».

### 1.5 UX

No aplica.

### 1.6 Dependencias

`zod`, de npm. `node_modules` no existe en el repo: `npm install zod` en la Task 1 lo deja instalado.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `capability merge` falla porque `bookings` no existe | alta | medio | Resolverlo en `sdd-archive` y avisar al dev-lead (decisión 8) |
| `npm install` sin red | baja | alto | Parar y avisar; no vendorizar `zod` |
| Un `--motivo` sin valor (`cancelar Norte lun --motivo`) | media | bajo | `params[idx + 1]` es `undefined` → mismo rechazo que sin motivo |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna a la constitución. `architecture.md` dice «sin dependencias externas»: se actualiza en la Task 1, porque la spec aprobada fija `zod`.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native, hilo principal (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend · tooling (`package.json`) · docs (`architecture.md`)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: sí — `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime `cancelada Norte lun (sala ocupada)`; con `--motivo xx` imprime `motivo no válido: cambio de planes, sala ocupada, otro`. (Cada invocación arranca con las reservas en memoria, así que se ve en una sola ejecución.)

**Interfaces**:
- Consume: `findBooking(room, day)` de `src/app.js`.
- Produce: `cancelBooking(room, day, motivo)` → `string`; `MOTIVOS` (constante del módulo); `bookings[i].reason` en las canceladas.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/steering/architecture.md`.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Los dos existentes pasan a `['Norte', 'lun', '--motivo', 'sala ocupada']` y `['Sur', 'mar', '--motivo', 'otro']`, con las mismas respuestas salvo `cancelada Norte lun (sala ocupada)`. Nuevos:
  - `cancelar con motivo de la lista` → `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista` → `run('cancelar', ['Norte','lun','--motivo','xx'])` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza` → `run('cancelar', ['Norte','lun'])` es el mismo mensaje.
  - `motivo no válido gana a sin reserva` → `run('cancelar', ['Sur','mar','--motivo','xx'])` es el mismo mensaje.
  Ejecutarlos y ver que fallan (RED).
- [ ] **Step 2: Implementación**. `npm install zod`. En `src/app.js`: `import { z } from 'zod';`, `const MOTIVOS = ['cambio de planes', 'sala ocupada', 'otro'];` y `const motivoSchema = z.enum(MOTIVOS);`. `cancelBooking(room, day, motivo)`: si `motivoSchema.safeParse(motivo).success` es falso, devuelve `` `motivo no válido: ${MOTIVOS.join(', ')}` ``; si no hay reserva, `sin reserva ${room} ${day}`; si la hay, la marca `cancelled`, guarda `reason = motivo` y devuelve `` `cancelada ${room} ${day} (${motivo})` ``. En `run`, el motivo es `params[params.indexOf('--motivo') + 1]` solo si el flag está, y `undefined` si no. Sala y día siguen siendo `params[0]` y `params[1]`. En `architecture.md`, «Node 22, sin dependencias externas» pasa a «Node 22; única dependencia externa: `zod` (valida el motivo de `cancelar`)».
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`.

### Task 2 — Listado de canceladas con motivo

**Tras**: Task 1
**Modelo**: Native, hilo principal (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque el estado vive en memoria y cada ejecución del CLI arranca limpia: solo los tests, que llaman a `run` en el mismo proceso, ven `cancelar` y `canceladas` juntos.

**Interfaces**:
- Consume: `bookings[i].reason` y `status === 'cancelled'` de la Task 1.
- Produce: `listCancelled()` → `string`; comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Los tests comparten el estado en memoria del módulo: cada uno parte de lo que dejaron los anteriores, así que se escriben en este orden y los dos primeros van antes de cualquier cancelación válida de Norte lun.
  - `canceladas vacío` → `run('canceladas', [])` es `'sin canceladas'`. Va antes de cualquier cancelación válida.
  - `motivo no válido no deja cancelada` → tras `run('cancelar', ['Norte','lun','--motivo','xx'])`, `run('canceladas', [])` sigue siendo `'sin canceladas'`.
  - `canceladas enseña el motivo` → tras `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])`, `run('canceladas', [])` es `'Norte lun — sala ocupada'`.
  Ejecutarlos y ver que fallan (RED).
- [ ] **Step 2: Implementación**. `listCancelled()` en `src/app.js`: filtra `bookings` con `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` ``, une con `\n`; si no hay ninguna, `'sin canceladas'`. En `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas lista el motivo (0010)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND «un motivo fuera de la lista responde motivo no válido: …» → Task 1, `motivo fuera de la lista`. ✓
- THEN «responde Norte lun — sala ocupada» (GIVEN cancelada con «sala ocupada») → Task 2, `canceladas enseña el motivo`. ✓
- Capacidad `bookings` (MODIFIED) → sin task: la capacidad no existe en `.docs/sdd/capabilities/`. ⚠ Avisado en las decisiones (8); se resuelve en `sdd-archive`.
- Review Focus: sin motivo → Task 1 `cancelar sin motivo lo rechaza`; motivo inválido gana a sin reserva → Task 1 `motivo no válido gana a sin reserva`; inválido no cancela → Task 2 `motivo no válido no deja cancelada`; vacío → Task 2 `canceladas vacío`; anuladas → sin test, por el filtro (avisado en las decisiones, 5). ✓
