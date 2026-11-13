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

1. **Modelo y effort por task**: la sesión implementa las dos tasks en Native, en gama media (Sonnet, effort medium): el plan lleva firmas, textos y asserts, no hay diseño que interpretar. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** (la spec no lo dice): responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. La lista es cerrada y el motivo es obligatorio.
4. **Orden de comprobaciones**: primero la reserva, luego el motivo. `cancelar Sur mar` (sin reserva) sigue respondiendo «sin reserva Sur mar», así que ese test existente no cambia. Un motivo inválido sobre una reserva existente no la cancela.
5. **`canceladas`**: solo estado `cancelled` (no `voided`, que son las anulaciones de la 0011); una línea por reserva, `<sala> <día> — <motivo>`, unidas por salto de línea; sin ninguna responde «sin canceladas» (la spec no lo fija).
6. **`zod`**: `npm install zod` sin fijar versión; el plan solo usa `z.enum(...).safeParse`, igual en 3.x y 4.x. `package.json` gana `dependencies`, aparece `package-lock.json` y se añade `.gitignore` con `node_modules/`.
7. **`architecture.md` dice «sin dependencias externas»**: la spec añade `zod`, así que la Task 1 corrige esa línea. No es una excepción a la constitution (ningún artículo prohíbe dependencias), pero conviene que el dev-lead lo vea.
8. **Spec**: su «Decisiones que he tomado yo» salta del 1 al 3 y declara «sin review de spec» pese a que la propia spec añade una dependencia nueva. Está aprobada y no la toco; queda señalado.
9. **Estado compartido en tests**: `bookings` es estado de módulo y los tests cancelan la misma reserva; la Task 1 exporta `resetBookings()` y los tests lo llaman en `beforeEach`.
10. **Coste estimado**: ~1,5 h de implementación, 2 tasks, sin subagentes de task (solo la revisión final).

Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo con un esquema `zod` (`z.enum`) y guarda `reason` en la reserva cancelada. `run` extrae el valor de `--motivo` de los parámetros y un comando nuevo `canceladas` recorre `bookings` filtrando `status === 'cancelled'`. Todo en `src/app.js`, el único fichero de entrada.

**Tech Stack**: Node ≥ 20 (ESM), `node --test`, `zod` (nueva).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `dependencies` de `package.json`, que contradice «sin dependencias externas» de `architecture.md`.

## Restricciones globales

### De código

- Dependencia nueva `zod` en `dependencies` de `package.json` (spec §Approach); ninguna otra.
- Mensajes literales de la spec: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «Norte lun — sala ocupada».
- Lista de motivos cerrada, en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Node ≥ 20, ESM (`"type": "module"`).
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con una responsabilidad.

### De proceso

- Política de modelos: Native, sesión en gama media; la revisión final de rama con los modelos de `sdd-verify`. Ningún `fable` ni `opus xhigh`.
- Tests antes que código (constitution, art. 2): RED escrito y visto fallar antes de implementar.
- Commits en castellano, convención `feat:` del proyecto; uno por task al quedar limpia.
- Atribución de commits: la que fija el harness (línea `Co-Authored-By`).

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» · Task 1, `cancelar sin motivo lo rechaza`
- Un motivo inválido no cancela la reserva (sigue ocupando la sala y admite una cancelación válida después) · Task 1, `un motivo inválido no cancela la reserva`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `canceladas sin canceladas lo dice`
- `canceladas` no lista las anuladas (`voided`) · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un `z.enum` y un campo `reason`; sin capas nuevas.
- [x] **YAGNI gate**: nada abstracto; un esquema y un filtro.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` pide motivo); sigue el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), gate de cierre `node --test` entero (art. 2).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — ignora `node_modules/`.
- `package-lock.json` — lo genera `npm install`.

**Modificar**:

- `src/app.js` — `cancelBooking(room, day, reason)` con validación `zod` y motivo guardado; `resetBookings()`; `listCancelled()`; `run` interpreta `--motivo` y el comando `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado.
- `package.json` — `dependencies: { zod }`.
- `.docs/sdd/steering/architecture.md` — la línea «sin dependencias externas» pasa a nombrar `zod` como única.
- `.docs/sdd/steering/operations.md` — se añade `npm install` a los comandos (ahora hay dependencia que instalar).

**NO se tocan**:

- `scripts/lint.mjs` — solo mira tabuladores en `src/app.js`.
- `voidBooking` y `anular` — son de la 0011.
- `test/app.test.js` — no cubre cancelar.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Vive en memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` · `canceladas`. Textos en Restricciones globales.

### 1.5 UX

No aplica.

### 1.6 Dependencias

`zod` (nueva, desde npm; la Task 1 necesita red para instalarla). Ninguna spec previa.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install` sin red o `node_modules` ausente | media | `import 'zod'` falla y rompe toda la suite | Step 1 de la Task 1 instala antes de escribir RED; si no hay red, se para y se avisa |
| `node_modules` colado en git | media | repo inflado | `.gitignore` en la Task 1 |
| El test existente `cancelar una reserva activa` deja de ser válido | alta | RED confuso | La Task 1 lo reescribe con `--motivo` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native: la sesión (Sonnet, effort medium); el plan trae firmas y asserts.
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear; Native: TDD del propio hilo.
**Superficies**: backend · tooling · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js` (reservas `{ room, day, slot, status }`).
- Produce: `cancelBooking(room: string, day: string, reason?: string): string`; la reserva cancelada guarda `reason`; `resetBookings(): void` exportada, que restaura la reserva inicial `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/steering/architecture.md`, `.docs/sdd/steering/operations.md`; crear `.gitignore`, `package-lock.json` (generado).

- [ ] **Step 1: Dependencia** — `npm install zod`; crear `.gitignore` con `node_modules/`; en `architecture.md` cambiar «Node 22, sin dependencias externas» por «Node 22; única dependencia externa: `zod`, para validar entradas»; en `operations.md` añadir bajo Comandos «**Instalar**: `npm install`». Esperado: `package.json` con `dependencies.zod`.
- [ ] **Step 2: Tests RED** en `test/cancel.test.js`, con `beforeEach(resetBookings)` (importado de `../src/app.js`):
  - reescribir `cancelar una reserva activa`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`;
  - `cancelar con un motivo fuera de la lista`: `['Norte','lun','--motivo','vacaciones']` → `'motivo no válido: cambio de planes, sala ocupada, otro'`;
  - `cancelar sin motivo lo rechaza`: `['Norte','lun']` → el mismo texto;
  - `un motivo inválido no cancela la reserva`: tras el rechazo, `run('cancelar', ['Norte','lun','--motivo','otro'])` → `'cancelada Norte lun (otro)'`;
  - dejar `cancelar sin reserva lo dice` igual.
  Verlos fallar (`ℹ fail` > 0).
- [ ] **Step 3: Implementación** — en `src/app.js`: `import { z } from 'zod'`; `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `const reasonSchema = z.enum(REASONS)`; `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; si `!reasonSchema.safeParse(reason).success` → `motivo no válido: ${REASONS.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. En `run`, el motivo es el parámetro que sigue a `--motivo` (`undefined` si falta). `resetBookings()` restaura `bookings`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, `feat: cancelar pide un motivo (0010)`.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native: la sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque cada ejecución del CLI arranca con las reservas en memoria y no persiste entre procesos: el listado solo se observa por `run` en el test.

**Interfaces**:
- Consume: reservas canceladas con `reason` y `resetBookings()`, de la Task 1.
- Produce: `listCancelled(): string`; `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`:
  - `canceladas enseña el motivo`: tras `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`;
  - `canceladas sin canceladas lo dice`: sin cancelar nada → `'sin canceladas'`;
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte','lun'])` → `'sin canceladas'`.
  Verlos fallar.
- [ ] **Step 2: Implementación** — `listCancelled(): string` filtra `status === 'cancelled'`, mapea a `${room} ${day} — ${reason}`, une con `\n`, o devuelve `'sin canceladas'` si no hay; `run` despacha `canceladas`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, `feat: listado de canceladas con motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks sobre un fichero de ~30 líneas; incertidumbre en la instalación de `zod` (red) y en el estado compartido entre tests; sin notas de calibración todavía.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con un motivo fuera de la lista`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Capacidad `bookings` (modificada) → el proyecto no tiene `capabilities/`; nada que documentar aparte. N/A. ✓
- Review Focus: sin motivo → Task 1 `cancelar sin motivo lo rechaza`; inválido no cancela → Task 1 `un motivo inválido no cancela la reserva`; sin canceladas → Task 2 `canceladas sin canceladas lo dice`; anuladas → Task 2 `canceladas no lista las anuladas`. ✓
