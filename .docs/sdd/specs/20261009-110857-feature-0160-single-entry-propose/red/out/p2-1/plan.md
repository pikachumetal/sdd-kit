---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-09
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Una sola task**: las dos funcionalidades (motivo y listado) tocan un fichero y una superficie (backend), comparten el dato `reason` y el listado no se puede probar sin el motivo guardado; partirlas no deja nada que un revisor pueda rechazar por separado.
2. **`cancelar` sin `--motivo`, o con `--motivo` sin valor, responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela**: la spec dice que cancelar «pide» un motivo pero no qué pasa si falta. Consecuencia: los dos tests que hoy llaman a `cancelar` sin motivo (`cancelar una reserva activa`, `cancelar sin reserva lo dice`) se reescriben con `--motivo`.
3. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar --motivo x` responde «motivo no válido…», no «sin reserva Sur mar». Con motivo válido y sin reserva, sigue «sin reserva Sur mar».
4. **La comparación del motivo es exacta** (minúsculas, tal como están en la lista): «Sala ocupada» es motivo no válido.
5. **`canceladas` sin ninguna cancelada responde «sin canceladas»**, con el patrón de «sin reserva …»; con varias, una línea por reserva en orden de cancelación. Las anuladas (`voided`) no salen.
6. **Los tests parten de un módulo recién importado** (`import('../src/app.js?<n>')`): las reservas viven en memoria y el escenario de `canceladas` usa la misma reserva (Norte lun) que el de `cancelar`; sin módulo nuevo, el resultado dependería del orden de los tests.
7. **Riesgo para la validación**: el estado está en memoria, así que cada `node src/app.js …` es un proceso nuevo. `canceladas` lanzado en otro comando después de `cancelar` responde «sin canceladas»; el escenario de `canceladas` solo se ve en la suite, no en dos comandos de terminal. El guion de la task lo dice.
8. **Modelo y effort**: Native, el hilo ejecuta la task; no hay implementador que despachar. Revisor final: `sdd-kit:effort-high` + `opus`, también con una sola task.
9. **Coste**: ~1 h en total (0,5 h spec y plan, 0,5 h implementación); sin subagentes salvo el revisor final.
10. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda; `canceladas` lista las canceladas con su motivo.

**Architecture**: todo en `src/app.js`, que es el único fichero de entrada. La reserva cancelada guarda `reason`; `cancelBooking` valida contra una constante `CANCEL_REASONS` y `run` extrae el valor tras `--motivo`; `listCancelled` recorre `bookings` con estado `cancelled`.

**Tech Stack**: Node 22, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque es una sola task en un solo fichero y no hay interfaces entre tasks que un subagente tuviera que respetar · fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- Clean code: funciones cortas con un solo cometido, nombres que dicen lo que hacen.
- Texto de la interfaz en castellano; los mensajes, literales de la spec: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>».
- Lista de motivos cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).

### De proceso

- Tests antes que código (constitution, art. 2); el gate de cierre corre una vez, en §3.
- Commits sobre `feature/0010-cancel-reason`, referenciando 0010.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` sin valor → el mismo mensaje · Task 1, `cancelar con --motivo sin valor es motivo no válido`
- Motivo fuera de lista con reserva inexistente → «motivo no válido…», no «sin reserva» · Task 1, `el motivo se valida antes que la reserva`
- `canceladas` sin ninguna cancelada → «sin canceladas», no cadena vacía · Task 1, `canceladas sin canceladas lo dice`
- Una reserva anulada con `anular` no aparece en `canceladas` · Task 1, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una constante, dos funciones pequeñas y un extractor del argumento; nada más.
- [x] **YAGNI gate**: sin abstracciones nuevas; la lista de motivos es una constante, no configuración.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` ahora pide motivo); respeta el patrón de `cancelBooking`/`voidBooking`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (2), castellano (4); el flujo SDD (1) y git-flow (3) se respetan.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `listCancelled()`, rama `canceladas` y extracción de `--motivo` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios y del Review Focus; reescribe los dos tests que cancelan sin motivo.

**NO se tocan**:

- `test/app.test.js` — no cubre `cancelar` ni `canceladas`.
- `voidBooking` y el comando `anular` — las anulaciones del responsable son la 0011.
- `scripts/lint.mjs` — sigue valiendo tal cual.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Sin persistencia: las reservas viven en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica; el contrato es la línea de comandos: `cancelar <sala> <día> --motivo <motivo>` y `canceladas`.

### 1.5 UX

No aplica; salida de texto.

### 1.6 Dependencias

Ninguna. La 0011 (anular reservas de otros) queda fuera y no depende de esta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El estado en memoria impide ver `canceladas` tras `cancelar` en dos comandos | Alta | Bajo | Se avisa en el guion; el escenario se cubre en la suite |
| Tests que dependen del orden por compartir `bookings` | Media | Medio | Módulo recién importado en cada test |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listar las canceladas

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho de implementador. Revisor final: `subagent_type: sdd-kit:effort-high` + `model: opus`.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task; Native: TDD del propio hilo, con copia fuera del repo para compararlos al cerrar.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js && node scripts/lint.mjs`
**Se prueba en la aplicación**: el dev-lead ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro». `canceladas` en un comando aparte responde «sin canceladas» porque cada comando es un proceso nuevo con las reservas en memoria: el listado con motivo («Norte lun — sala ocupada») solo se ve en el test.

**Interfaces**:
- Consume: nada; parte de `bookings`, `findBooking(room, day)` y `run(cmd, params)` de `src/app.js`, con `params` como array de argumentos (`['Norte', 'lun', '--motivo', 'sala ocupada']`).
- Produce: `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room: string, day: string, reason?: string): string`; `listCancelled(): string`; `run('canceladas', [])` devuelve lo de `listCancelled()`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, con `const freshRun = async () => (await import(`../src/app.js?${Math.random()}`)).run;` para partir de un módulo nuevo:
  - `cancelar con motivo de la lista` → `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` es `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista` → con `--motivo vacaciones` es `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `canceladas enseña el motivo` → tras cancelar Norte lun con `sala ocupada`, `run('canceladas', [])` es `'Norte lun — sala ocupada'`.
  - Los cinco del Review Focus con sus nombres, asserts con los literales de arriba: sin motivo y `--motivo` sin valor dan «motivo no válido…» y después `cancelar … --motivo otro` sigue dando `'cancelada Norte lun (otro)'`; `cancelar Sur mar --motivo vacaciones` da «motivo no válido…»; `canceladas` recién arrancado da `'sin canceladas'`; tras `anular Norte lun`, `canceladas` da `'sin canceladas'`.
  - Reescribe `cancelar una reserva activa` (ahora con `--motivo otro` → `'cancelada Norte lun (otro)'`) y `cancelar sin reserva lo dice` (`['Sur', 'mar', '--motivo', 'otro']` → `'sin reserva Sur mar'`).
- [ ] **Step 2: Ver los RED** — `node --test test/cancel.test.js`. Esperado: fallan los tests nuevos y los dos reescritos, por la salida sin motivo y por `canceladas` desconocido.
- [ ] **Step 3: Implementación en `src/app.js`** — `CANCEL_REASONS`; `cancelBooking(room, day, reason)` valida `CANCEL_REASONS.includes(reason)` antes de `findBooking` y guarda `booking.reason`; `listCancelled()` une con `\n` las líneas `<sala> <día> — <motivo>` de las reservas `cancelled`, o `'sin canceladas'`; en `run`, el motivo es el elemento que sigue a `--motivo` (`undefined` si falta) y `canceladas` llama a `listCancelled()`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js && node scripts/lint.mjs`. Esperado: todos los tests en verde y «lint: sin hallazgos».
- [ ] **Step 5: Commit de la task** — comparar los RED con la copia (`git diff --no-index`), commit único `feat(0010): motivo al cancelar y listado de canceladas` y `sdd task done` con el comando de «Verificación».

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una task, un fichero de código y uno de tests, sin dependencias; la incertidumbre es el estado en memoria al probar a mano.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» (respuesta con motivo y rechazo fuera de lista) → Task 1, `cancelar con motivo de la lista` y `motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» → Task 1, `canceladas enseña el motivo`. ✓
- No entra: anulaciones del responsable de sala (0011) → N/A, `voidBooking` intacto. ✓
- Review Focus (5 entradas) → Task 1, un test por línea. ✓
