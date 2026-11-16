---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: la sesión Native ejecuta las dos tasks en gama media (Sonnet, effort medium) — el plan lleva firmas, textos y tests, no hay prosa que interpretar. La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Sin `--motivo` equivale a motivo no válido**: la spec solo define el motivo fuera de la lista; `cancelar Norte lun` a secas responde «motivo no válido: cambio de planes, sala ocupada, otro» (el motivo es obligatorio: «cancelar pide un motivo»).
4. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo "otro"` sin reserva sigue diciendo «sin reserva Sur mar»; `cancelar Sur mar` sin motivo dice «motivo no válido…». Por eso el test existente «cancelar sin reserva lo dice» pasa a llevar `--motivo`.
5. **`canceladas` solo lista estado `cancelled`**: las `voided` (anular) no entran; una línea `<sala> <día> — <motivo>` por reserva, en orden de reserva; sin canceladas, salida vacía (la spec no fija un texto y no se inventa).
6. **`zod` es la primera dependencia del proyecto**: `architecture.md` decía «sin dependencias externas»; la Task 1 actualiza esa línea. No hay `.gitignore` ni `node_modules`: la Task 1 añade `.gitignore` con `node_modules/` para no commitear la instalación.
7. **Capacidad `bookings`**: no existe `capabilities/bookings.md`; la spec usa solo `ADDED`, así que `sdd-archive` la crea con el merge (el «Modificadas» de la spec se lee como «tocada»).
8. **Riesgos altos**: ninguno; la dependencia nueva es el único punto con red (`npm install zod`).
9. **Coste estimado**: ~1 h, 2 tasks, una sola sesión; sin subagentes salvo la revisión final.
10. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: `src/app.js` sigue siendo el único fichero de código. El motivo se valida con un esquema `zod` (`z.enum`) y se guarda en la reserva (`reason`) al pasar a `cancelled`; `canceladas` filtra por ese estado.

**Tech Stack**: Node ≥ 20 (ESM), `node --test`, `zod`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json` (contradice la línea «sin dependencias externas» de `architecture.md`, que la Task 1 corrige).

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga).
- `zod` en `dependencies` de `package.json`, no en `devDependencies`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas. La constitution del proyecto no tiene artículo de calidad: estas son las dos reglas de comentarios.
- Texto de la interfaz en castellano (Art. 4 de la constitution).

### De proceso

- Native, sesión en gama media; la revisión final de rama con el modelo de `sdd-verify`.
- Tests antes que código (Art. 2): RED visto antes de implementar.
- Commits: `feat(0010): <qué>`, uno por task, con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo lo rechaza`
- Motivo no válido sobre una reserva existente → la reserva NO se cancela (no sale en `canceladas`) · Task 1, `cancelar una reserva activa` (va después de los rechazos y solo pasa si la reserva seguía activa)
- Reserva anulada con `anular` → no sale en `canceladas` · Task 2, `canceladas no enseña las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero, un esquema `z.enum`, un campo `reason`.
- [x] **YAGNI gate**: sin abstracciones nuevas; la lista de motivos vive en una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que pide la spec (`cancelar` ahora exige motivo); respeta el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (tests primero) respetado; Art. 4 (castellano) respetado; sin artículo que prohíba dependencias.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — `node_modules/`.

**Modificar**:

- `src/app.js` — `export const bookings` (para sembrar en tests), esquema del motivo, `cancelBooking(room, day, reason)`, `listCancelled()`, `--motivo` en `run`, comando `canceladas`.
- `test/cancel.test.js` — los dos tests existentes pasan a llevar `--motivo` y se añaden los de la spec.
- `package.json` + `package-lock.json` — `zod` en `dependencies`.
- `.docs/sdd/steering/architecture.md` — la línea de dependencias.
- `.docs/sdd/steering/operations.md` — línea `Instalar: npm install`.

**NO se tocan**:

- `scripts/lint.mjs` — solo mira tabuladores en `src/app.js`.
- `voidBooking` y el comando `anular` — fuera de scope (0011).
- `test/app.test.js` — no toca cancelar.

### 1.2 Modelo de datos

La reserva cancelada guarda `reason` (string) junto a `status: 'cancelled'`. Sin persistencia: viven en memoria.

### 1.6 Dependencias

`zod` (última estable 3.x/4.x que instale `npm install zod`); requiere red una vez.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install` sin red o sin `node_modules` en el worktree | media | bloquea la Task 1 | instalarlo en el Step 1 antes de los tests; si falla, parar y avisar |
| El parseo de `--motivo` rompe motivos con espacios | baja | cancelación rechazada | el valor es el argumento siguiente a `--motivo` (el shell ya agrupa `"sala ocupada"`); test con ese motivo |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: sesión Native, Sonnet, effort medium (el plan trae firmas y tests).
**Tests RED**: hilo principal · `test/cancel.test.js`, TDD del propio hilo.

**Superficies**: backend · tooling · docs
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo "aburrimiento"` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`.
- Produce: `cancelBooking(room: string, day: string, reason: string | undefined): string`; la reserva cancelada lleva `reason`; `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: crear `.gitignore`; modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `package-lock.json`, `architecture.md`, `operations.md`.

- [ ] **Step 1: Dependencia** — `npm install zod`; comprobar que `package.json` la lleva en `dependencies`. Crear `.gitignore` con `node_modules/`. En `architecture.md` sustituir «sin dependencias externas» por «una dependencia externa: `zod`, para validar entradas»; en `operations.md` añadir `- **Instalar**: \`npm install\`` bajo «Comandos».
- [ ] **Step 2: Tests RED** en `test/cancel.test.js` (escritos antes del código, vistos fallar):
  - `cancelar una reserva activa`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  - `cancelar con un motivo fuera de la lista lo rechaza`: `run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `cancelar sin motivo lo rechaza`: `run('cancelar', ['Norte', 'lun'])` → el mismo mensaje.
  
  Nota: la reserva de Norte del lunes es estado compartido del módulo; los tests que cancelan la de Norte lun van en orden o con el rechazo antes de la cancelación efectiva, para que el rechazo se observe sobre una reserva activa. Ejecutar y ver `fail` > 0.
- [ ] **Step 3: Implementación** en `src/app.js`: `import { z } from 'zod'`; `const reasons = ['cambio de planes', 'sala ocupada', 'otro']`; `const reasonSchema = z.enum(reasons)`; `cancelBooking(room, day, reason)`: `reasonSchema.safeParse(reason)`, si falla devuelve `motivo no válido: ${reasons.join(', ')}`; si no hay reserva `sin reserva ${room} ${day}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`. En `run`, `cancelar` extrae el motivo como el argumento siguiente a `--motivo` (`undefined` si no está).
- [ ] **Step 4: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — `feat(0010): cancelar pide un motivo de la lista`, con las líneas de atribución.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: sesión Native, Sonnet, effort medium.
**Tests RED**: hilo principal · `test/cancel.test.js`, TDD del propio hilo.

**Superficies**: backend
**Verificación**: `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `canceladas` tras cancelar Norte lun con «sala ocupada» y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `reason` y `status: 'cancelled'` de la Task 1; `run('cancelar', …)`.
- Produce: `listCancelled(): string` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** (vistos fallar):
  - `el listado de canceladas enseña el motivo`: tras `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`, `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas no enseña las anuladas`: `bookings.push({ room: 'Sur', day: 'mar', slot: '10:00-12:00', status: 'active' })`, `run('anular', ['Sur', 'mar'])` y `run('canceladas', [])` sigue siendo `'Norte lun — sala ocupada'`.
  
  Los tests comparten el estado del módulo y `node:test` los ejecuta en orden de definición: los de rechazo de la Task 1 van antes del que cancela Norte lun. `bookings` pasa a exportarse (`export const bookings`) para sembrar la reserva de Sur.
- [ ] **Step 2: Implementación** — `listCancelled()`: `bookings.filter((b) => b.status === 'cancelled').map((b) => \`${b.room} ${b.day} — ${b.reason}\`).join('\n')`; en `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `NO_COLOR=1 node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): listado de canceladas con motivo`, con las líneas de atribución.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa`. ✓
- ADDED «Cancelar pide un motivo» · AND motivo fuera de la lista → mensaje de error → Task 1, `cancelar con un motivo fuera de la lista lo rechaza`. ✓
- ADDED «El listado de canceladas» · THEN «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- «Approach»: `zod` en `dependencies` → Task 1, Step 1 (se comprueba en `package.json`). ✓
- «Dónde se prueba»: ambos tests en `test/cancel.test.js`. ✓
- No entra: anulaciones del responsable (0011) → N/A (confirmado en spec). ✓
- Review Focus (3 líneas) → Task 1 `cancelar sin motivo lo rechaza` y `cancelar una reserva activa` (tras los rechazos); Task 2 `canceladas no enseña las anuladas`. ✓
