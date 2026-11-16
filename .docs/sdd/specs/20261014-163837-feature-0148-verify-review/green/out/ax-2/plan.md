---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-14
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en `sdd-kit.json`. Una sola task, sin interfaces entre tasks y el plan cabe en un contexto.
2. **Modelo y effort**: la task va en la sesión, Sonnet con effort medium (el plan trae firmas, textos y asserts). La revisión final de rama sigue la política de `sdd-verify`.
3. **`zod` contradice `tech-stack.md`**: ese documento dice «Node 22, sin dependencias externas» y la spec aprobada fija `zod` en `dependencies`. La task 1 corrige `tech-stack.md` (excepción 1.9) para que el documento no mienta tras el merge. Si preferís validar la lista sin librería, hay que enmendar la spec, no el plan.
4. **`cancelar` sin `--motivo`**: la spec solo da el caso de un motivo fuera de la lista. El plan lo trata igual (responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela), porque el motivo es obligatorio. Los dos tests actuales de `cancelar` sin motivo se actualizan en consecuencia.
5. **`canceladas` sin canceladas** responde `sin canceladas`; con varias, una línea por reserva, en el orden en que se cancelaron. Texto que la spec no fija.
6. **Las anuladas (`voided`) no salen en `canceladas`**: la spec lista «reservas con estado cancelada»; el alcance deja las anulaciones para la 0011.
7. **Instalación**: no hay `node_modules` ni `package-lock.json`; la task ejecuta `npm install zod`, que necesita red. Sin red, la task se para y se dice.
8. **Coste estimado**: ~1 h, una task; la sesión Native gasta unas decenas de miles de tokens.
9. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: cancelar una reserva exige un motivo de una lista cerrada, se guarda con la reserva y el comando `canceladas` lo enseña.

**Architecture**: `cancelBooking` recibe el motivo, lo valida con un esquema `zod` (`z.enum`) y lo guarda en la reserva; `run` extrae `--motivo` de los parámetros. Un comando nuevo `canceladas` filtra `bookings` por `status === 'cancelled'`.

**Tech Stack**: Node 22 (ESM), `node --test`, `zod` nueva en `dependencies`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json` (primera dependencia externa del proyecto).

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de respuesta literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>`.
- `zod` va en `dependencies` de `package.json`, no en `devDependencies`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz y de los documentos en castellano.

### De proceso

- Tests antes que código (constitution, art. 2).
- Commits en castellano, un commit por task, sin `--no-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- Motivo fuera de la lista → misma respuesta y la reserva sigue activa (no queda cancelada a medias) · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada → `sin canceladas`, no una cadena vacía · Task 1, `canceladas sin canceladas`
- Una reserva anulada (`anular`) no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un solo fichero de código, sin capas nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva; el esquema `zod` se usa en un único sitio.
- [x] **Brownfield gate**: retrocompatible salvo que `cancelar` sin motivo deja de cancelar (lo exige la spec: «cancelar pide un motivo»); sigue el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, gate de cierre `node --test` entero, git-flow, castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `package-lock.json` — lo genera `npm install zod`.

**Modificar**:

- `src/app.js` — motivo en `cancelBooking`, comando `canceladas`, extracción de `--motivo` en `run`.
- `test/cancel.test.js` — los escenarios de la spec y los de Review Focus; los dos tests actuales de `cancelar` pasan a llevar motivo.
- `package.json` — `dependencies.zod`.
- `.docs/sdd/tech-stack.md` — la línea «sin dependencias externas» deja de ser cierta.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones son de la 0011.
- `freeRooms` y `libres` — una reserva cancelada ya no ocupa la sala y eso no cambia.
- `scripts/lint.mjs` — sigue valiendo tal cual.

### 1.2 Modelo de datos

La reserva cancelada gana el campo `reason` (string, uno de la lista). Memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica. Contrato de línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica (solo línea de comandos).

### 1.6 Dependencias

`zod`, nueva, de runtime.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Sin red, `npm install zod` falla | baja | la task no arranca | la task se para y lo dice; no se simula la librería |
| `--motivo "sala ocupada"` llega partido en dos parámetros si el shell no respeta las comillas | baja | motivo no válido | `run` toma el valor tras `--motivo` y une lo que queda hasta el final con espacios |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna a la constitution. Sí a `tech-stack.md` («sin dependencias externas»): la fija la spec aprobada y la task 1 reescribe la línea.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (la task trae firmas, textos y asserts)
**Tests RED**: hilo principal · `test/cancel.test.js`, TDD del propio hilo

**Superficies**: backend · tooling · docs
**Verificación**: `node --test test/cancel.test.js` y `node scripts/lint.mjs`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista ve «motivo no válido: cambio de planes, sala ocupada, otro»; en una sesión con la reserva ya cancelada, `canceladas` responde «Norte lun — sala ocupada». Las reservas viven en memoria: la última comprobación solo se ve por `run` en los tests, no entre dos invocaciones del proceso.

**Interfaces**:
- Consume: nada.
- Produce: `cancelBooking(room, day, reason)` → string; `listCancelled()` → string; `run('cancelar', [sala, día, '--motivo', ...motivo])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/tech-stack.md`; crear `package-lock.json`

- [ ] **Step 1: RED** — en `test/cancel.test.js`, sustituir los dos tests actuales y añadir, con sus asserts:
  - `cancelar con motivo de la lista`: `run('cancelar', ['Norte','lun','--motivo','sala','ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte','lun','--motivo','aburrimiento'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`, y `run('libres', ['10:00-12:00'])` sigue `'Sur'`.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte','lun'])` → el mismo mensaje de motivo no válido.
  - `cancelar sin reserva lo dice`: `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - `canceladas enseña el motivo`: tras cancelar Norte lun con «sala ocupada», `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `canceladas sin canceladas`: `run('canceladas', [])` → `'sin canceladas'`.
  - `canceladas no lista las anuladas`: tras `run('anular', ['Norte','lun'])`, `run('canceladas', [])` → `'sin canceladas'`.
  Los tests comparten el estado en memoria del módulo: ordenar los casos o sembrar una reserva distinta por test para que no se pisen. Ejecutar `node --test test/cancel.test.js` y ver que fallan.
- [ ] **Step 2: Implementación** — `npm install zod`. En `src/app.js`: `import { z } from 'zod'`; `const reasonSchema = z.enum(['cambio de planes', 'sala ocupada', 'otro'])`; `cancelBooking(room, day, reason)` valida con `reasonSchema.safeParse(reason)`, devuelve `motivo no válido: cambio de planes, sala ocupada, otro` si falla (antes de buscar la reserva), y si pasa guarda `booking.reason`; `listCancelled()` filtra por `status === 'cancelled'` y devuelve las líneas `${room} ${day} — ${reason}` unidas con `\n`, o `sin canceladas`; `run` añade `canceladas` y pasa a `cancelBooking` el texto que sigue a `--motivo` (los parámetros restantes unidos con espacio, `undefined` si no hay `--motivo`).
- [ ] **Step 3: Documentación** — `.docs/sdd/tech-stack.md`: sustituir «sin dependencias externas» por que la única dependencia externa es `zod`, para validar los motivos de cancelación.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js` y `node scripts/lint.mjs`. Esperado: verdes.
- [ ] **Step 5: Commit de la task** — uno solo, en castellano, referenciando la 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Base de la estimación: una task en un solo fichero de código, una dependencia nueva que instalar, sin referencia en el `estimation-log` para una feature de este tipo
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (THEN «cancelada Norte lun (sala ocupada)») → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar…» (AND motivo fuera de la lista) → Task 1, `motivo fuera de la lista no cancela`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, `canceladas enseña el motivo`. ✓
- Approach: `zod` en `dependencies` → Task 1, Step 2 y `package.json`. ✓
- Dónde se prueba: `test/cancel.test.js` → Task 1. ✓
- Anulaciones del responsable (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus: las cuatro entradas → Task 1, sus tests de Step 1. ✓
