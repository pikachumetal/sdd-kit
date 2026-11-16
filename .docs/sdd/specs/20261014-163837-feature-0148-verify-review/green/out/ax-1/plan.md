---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-10-14
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en sdd-kit.json; 2 tasks, la sesión va en gama media (Sonnet, effort medium), sin subagentes por task.
2. **`cancelar` sin `--motivo`** responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro»): la spec dice que cancelar «pide» un motivo y no fija este caso. Por eso los dos tests existentes de `test/cancel.test.js` pasan a llevar `--motivo`.
3. **Orden de validación**: primero el motivo, después la reserva: `cancelar Sur mar --motivo vacaciones` responde «motivo no válido…», no «sin reserva Sur mar».
4. **`canceladas` sin ninguna cancelada** responde cadena vacía; con varias, una por línea. Solo cuenta el estado `cancelled`: las `voided` (anular, feature 0011) no salen.
5. **`zod`** (la spec lo fija) entra con `npm install zod`, que crea `package-lock.json`. Como `node_modules/` no está ignorado, se añade `.gitignore` con esa línea. `tech-stack.md` dice «sin dependencias externas»: la Task 1 lo corrige.
6. **Riesgo alto**: ninguno; el cambio es de un fichero de código.
7. **Coste estimado**: ~1 h de implementación, sin despacho de subagentes.
8. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar una reserva exige un motivo de una lista cerrada y `canceladas` lo enseña.

**Architecture**: `src/app.js` valida el motivo con un esquema `zod` (`z.enum`), lo guarda en la reserva cancelada (`booking.reason`) y `canceladas` filtra por `status === 'cancelled'`. Sin ficheros nuevos de código.

**Tech Stack**: Node 22, ESM, `node --test`; dependencia nueva `zod`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json`

## Restricciones globales

### De código

- Motivos válidos, literales y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de la interfaz en castellano: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios).
- Node 22, ESM; `zod` en `dependencies` de `package.json`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2). Ejecución `native`; un commit por task con la convención del proyecto.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- Un motivo inválido no cancela: la reserva sigue activa y un `cancelar` posterior con motivo válido responde «cancelada Norte lun (otro)» · Task 1, `motivo inválido no cancela la reserva`
- `cancelar Sur mar --motivo otro` sin reserva → «sin reserva Sur mar» · Task 1, `cancelar sin reserva lo dice`
- `canceladas` sin canceladas → cadena vacía; una reserva `voided` no sale · Task 2, `canceladas sin canceladas responde vacío` y `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un esquema y un filtro; sin módulo nuevo.
- [x] **YAGNI gate**: sin abstracción; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec pide (motivo obligatorio); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: flujo SDD, tests antes que código, textos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — ignora `node_modules/`.

**Modificar**:

- `src/app.js` — validación del motivo, `booking.reason`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, comandos `cancelar` y `canceladas`.
- `test/cancel.test.js` — escenarios de la spec y los tests existentes con `--motivo`.
- `package.json`, `package-lock.json` — `zod` en `dependencies`.
- `.docs/sdd/tech-stack.md` — la línea «sin dependencias externas» pasa a nombrar `zod`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la feature 0011.
- `scripts/lint.mjs`, `test/app.test.js` — sin relación.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. En memoria; sin migración.

### 1.6 Dependencias

`zod`, última estable, con `npm install zod`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `node --test` sin `node_modules` en un clon limpio | media | alto | `npm install` en la Task 1; el gate se corre ya instalado |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: la sesión (Native), Sonnet con effort medium; la task trae las firmas y los textos.
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend · docs
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones`, «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` de `src/app.js` (devuelve la reserva `active` o `undefined`).
- Produce: `cancelBooking(room, day, reason)` → string; guarda `booking.reason` y `booking.status = 'cancelled'`. Constantes `reasons = ['cambio de planes', 'sala ocupada', 'otro']` y `reasonSchema = z.enum(reasons)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/tech-stack.md`; crear `.gitignore`.

- [ ] **Step 1: RED** — en `test/cancel.test.js`: cambiar los dos tests existentes a `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'` y `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`; añadir `cancelar con motivo fuera de la lista` (`'--motivo', 'vacaciones'` → `'motivo no válido: cambio de planes, sala ocupada, otro'`), `cancelar sin motivo lo rechaza` (mismo texto) y `motivo inválido no cancela la reserva` (tras el rechazo, `cancelar ... --motivo otro` responde `'cancelada Norte lun (otro)'`). Ejecutar y ver fallar.
- [ ] **Step 2: Implementación** — `npm install zod`; `.gitignore` con `node_modules/`; en `src/app.js` importar `z` de `zod`, declarar la constante y el esquema de «Interfaces»; en `run`, `cancelar` toma el valor que sigue a `--motivo` en `params` (`undefined` si falta), lo valida con `reasonSchema.safeParse` antes de buscar la reserva y responde con los textos de «Restricciones globales». Actualizar la línea de dependencias de `tech-stack.md`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: la sesión (Native), Sonnet con effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js`
**Se prueba en la aplicación**: el estado vive en memoria, así que se prueba por `run` en una misma ejecución: tras cancelar Norte lun con «sala ocupada», `canceladas` responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `bookings` y `booking.reason` de la Task 1.
- Produce: `cancelledBookings()` → string: una línea `<room> <day> — <reason>` por reserva con `status === 'cancelled'`, unidas por `\n`; `''` si no hay. Comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: RED** — `canceladas muestra el motivo` (cancelar Norte lun con `sala ocupada`; `run('canceladas', [])` → `'Norte lun — sala ocupada'`), `canceladas sin canceladas responde vacío` y `canceladas no lista las anuladas` (`anular` de una reserva no añade línea). El estado es de módulo y lo comparten los tests: cada uno parte de lo que supone y el orden o el aislamiento se resuelve en el propio fichero. Ver fallar.
- [ ] **Step 2: Implementación** — `cancelledBookings()` y el comando `canceladas` en `run`, con el formato de «Interfaces».
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` en verde.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks pequeñas en un fichero y una dependencia nueva; referencia: patch 0007 (0,5h)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: un THEN por escenario, con ejecución real de `cancelar` y `canceladas`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN + AND motivo inválido) → Task 1. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 2. ✓
- No entra: anulaciones (0011) → N/A, `voidBooking` intacto. ✓
- Review Focus: sin motivo, inválido no cancela, sin reserva → Task 1; vacío y anuladas → Task 2. ✓
