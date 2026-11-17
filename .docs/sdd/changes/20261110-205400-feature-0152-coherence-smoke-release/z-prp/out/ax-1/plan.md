---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Native, la sesión implementa las 2 tasks (Sonnet, effort medium): el diseño está en el plan y son cambios pequeños en un solo fichero. La revisión final de rama va con el modelo de `sdd-verify`.
2. Ejecución: native, fijado en `sdd-kit.json`.
3. `cancelar` sin `--motivo` responde lo mismo que un motivo fuera de la lista («motivo no válido: cambio de planes, sala ocupada, otro») y no cancela: la spec dice que cancelar «pide» un motivo y no fija este caso. El test existente `cancelar una reserva activa` pasa a usar el motivo.
4. Un motivo no válido no cancela la reserva: sigue activa y se puede cancelar después con un motivo válido.
5. `canceladas` sin ninguna reserva cancelada responde `sin canceladas` (la spec no lo fija; sigue el estilo de `sin reserva …`). Solo lista las de estado `cancelled`, no las `voided`.
6. `zod` se instala con `npm install zod` en la Task 1 (no hay `node_modules` ni `dependencies` todavía). `architecture.md` dice «sin dependencias externas»: la Task 1 lo actualiza.
7. Coste estimado: ~2 h entre las dos tasks; sin despachos, así que sin coste en subagentes.
8. Gate de cierre: el de `operations.md`, sin cambios.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `src/app.js` valida el motivo con un esquema `zod` (`z.enum`) y lo guarda en la reserva al pasarla a `cancelled`. `canceladas` recorre `bookings` filtrando por ese estado. Un solo fichero, como fija `architecture.md`.

**Tech Stack**: Node ≥ 20 (ESM), `node --test`, `zod` (nueva).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json`, que contradice «sin dependencias externas» de `architecture.md`.

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- La dependencia `zod` va en `dependencies` de `package.json` (no en `devDependencies`).
- Mensajes literales de la spec: `cancelada Norte lun (sala ocupada)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `Norte lun — sala ocupada`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Native: la sesión implementa en orden; modelo medio (Sonnet, effort medium).
- Commits referenciando la feature 0010; atribución según el reminder de la sesión.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `Cancelar_sin_motivo_pide_motivo`
- Tras un motivo no válido, la reserva sigue activa: `cancelar Norte lun --motivo "sala ocupada"` después funciona · Task 1, `Motivo_no_valido_no_cancela`
- `canceladas` sin canceladas → `sin canceladas` · Task 2, `Canceladas_sin_ninguna`

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: un esquema `z.enum` y un filtro; nada más.
- [ ] **YAGNI gate**: sin abstracciones nuevas.
- [ ] **Brownfield gate**: retrocompatible salvo lo que la spec cambia a propósito (`cancelar` ahora pide motivo); respeta el patrón de `run`; sin refactor fuera de scope (`anular` no se toca).
- [ ] **Constitution check**: tests antes que código (2); texto en castellano (4).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` valida y guarda el motivo; nueva `listCancelled()`; `run` enruta `canceladas` y pasa `--motivo`.
- `test/cancel.test.js` — tests de motivo y de listado; el existente pasa a llevar motivo.
- `package.json` — `dependencies.zod`.
- `package-lock.json` — se crea con `npm install`.
- `.docs/sdd/steering/architecture.md` — «sin dependencias externas» pasa a mencionar `zod`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — anulaciones del responsable de sala, feature 0011.

### 1.2 Modelo de datos

La reserva cancelada gana `reason` (string de la lista). En memoria, sin schema.

### 1.6 Dependencias

`zod` (nueva). Sin servicios externos.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El test existente `cancelar una reserva activa` deja de valer sin motivo | alta | bajo | Se actualiza en la Task 1 |
| Estado compartido en memoria entre tests del mismo fichero | media | medio | El orden de los tests está fijado en las tasks |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Native: la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con un motivo fuera de la lista ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → string; la reserva queda con `status: 'cancelled'` y `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/steering/architecture.md`; crear `package-lock.json`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado es compartido):
  1. `Cancelar_sin_motivo_pide_motivo`: `run('cancelar', ['Norte','lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  2. `Motivo_no_valido_no_cancela`: `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → el mismo mensaje.
  3. `Cancelar_con_motivo` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`; con esto queda probado que la reserva seguía activa tras 1 y 2.
  4. `cancelar sin reserva lo dice` se mantiene: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  Ejecutar y ver que 1–3 fallan.
- [ ] **Step 2: Implementación** — `npm install zod`; en `src/app.js`: `import { z } from 'zod'`; `const reasonSchema = z.enum(['cambio de planes', 'sala ocupada', 'otro'])`; `cancelBooking(room, day, reason)` devuelve `motivo no válido: cambio de planes, sala ocupada, otro` si `reasonSchema.safeParse(reason)` falla, antes de buscar la reserva; si pasa y hay reserva, guarda `reason` y responde `cancelada ${room} ${day} (${reason})`; `run` lee el valor siguiente a `--motivo` en `params`. Actualizar `architecture.md`: Node 22 con `zod` como única dependencia externa.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native: la sesión (Sonnet, effort medium); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `canceladas` tras cancelar Norte del lunes con «sala ocupada» y ve `Norte lun — sala ocupada`.

**Interfaces**:
- Consume: reservas con `status: 'cancelled'` y `reason` (Task 1).
- Produce: `listCancelled()` → string, una línea `${room} ${day} — ${reason}` por reserva cancelada, unidas con `\n`; `sin canceladas` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`: `Canceladas_sin_ninguna` va el primero del fichero (antes de cualquier cancelación): `run('canceladas', [])` → `'sin canceladas'`; `Canceladas_enseña_el_motivo` va al final, tras `Cancelar_con_motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`. Ver que fallan.
- [ ] **Step 2: Implementación** — `listCancelled()` en `src/app.js` filtrando `status === 'cancelled'`; `run` enruta `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): comando canceladas con el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks en un solo fichero, una dependencia nueva; incertidumbre baja
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo»: THEN `cancelada Norte lun (sala ocupada)` → Task 1, `Cancelar_con_motivo`. ✓
- AND motivo fuera de la lista responde `motivo no válido: …` → Task 1, `Motivo_no_valido_no_cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo»: THEN `Norte lun — sala ocupada` → Task 2, `Canceladas_enseña_el_motivo`. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: sin motivo → Task 1, `Cancelar_sin_motivo_pide_motivo`; motivo no válido no cancela → Task 1, `Motivo_no_valido_no_cancela`; sin canceladas → Task 2, `Canceladas_sin_ninguna`. ✓
- La spec no trae tabla «regla retirada → dónde vive ahora». ✓
