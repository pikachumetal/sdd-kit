---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Native, la sesión implementa las dos tasks (gama media basta: el plan lleva firmas, textos y tests). La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, porque 2 tasks encadenadas por `cancelBooking`/`reason`, un error lo caza el test de su task y el plan cabe en un contexto.
3. **`cancelar` sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»**: la spec dice que cancelar «pide» un motivo y solo fija la respuesta para uno fuera de la lista; un motivo ausente se trata como fuera de la lista. El test existente «cancelar una reserva activa» (sin motivo) pasa a llevar `--motivo`.
4. **Orden de validación**: primero se busca la reserva y después se valida el motivo, así «cancelar sin reserva lo dice» (`Sur mar`, sin motivo) sigue respondiendo `sin reserva Sur mar` sin tocarlo.
5. **Motivo exacto, sin normalizar**: `"Sala ocupada"` o `"sala  ocupada"` no valen; la lista es cerrada y se compara tal cual.
6. **`canceladas` sin ninguna cancelada responde `sin canceladas`** y con varias, una línea por reserva, en orden de la lista; la spec solo fija el caso de una.
7. **Conflicto con `architecture.md`**: dice «Node 22, sin dependencias externas» y la spec aprobada añade `zod` en `dependencies`. Sigo la spec y la Task 1 actualiza esa línea de `architecture.md`; **la constitution no prohíbe dependencias**, pero conviene que el dev-lead lo valide. Además, el repo no tiene `.gitignore`: la Task 1 lo crea con `node_modules/` para que la instalación de `zod` no entre en el commit.
8. **Riesgos altos**: `npm install zod` necesita red; si falla, la Task 1 se para (sin `zod` no hay motivo validado, y la spec no admite otra librería).
9. **Coste estimado**: ~2,5 h en total (ver Estimación); Native en una sesión, sin despacho de subagentes salvo la revisión final.
10. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Que `cancelar` exija un motivo de la lista cerrada y que `canceladas` lo enseñe.

**Architecture**: `cancelBooking(room, day, reason)` valida `reason` con un `z.enum` de `zod` y lo guarda en la reserva cancelada (`booking.reason`); un comando nuevo `canceladas` filtra `bookings` por `status === 'cancelled'` y formatea `<sala> <día> — <motivo>`. Todo en `src/app.js`, el único fichero de entrada del proyecto.

**Tech Stack**: Node ≥ 20 (ESM), `node --test`, `zod` (dependencia nueva).

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por `cancelBooking`/`reason`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json`, y `architecture.md` dice «sin dependencias externas».

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Textos de respuesta literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga `—`).
- `zod` va en `dependencies` de `package.json`, no en `devDependencies`.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz en castellano (constitution, Art. 4).

### De proceso

- Native; tests antes que código (constitution, Art. 2).
- Commits con la convención del proyecto (`feat:`, `docs:`…), referenciando la 0010, y la atribución que fije el harness.
- Git-flow: se trabaja en `feature/0010-cancel-reason`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → `motivo no válido: cambio de planes, sala ocupada, otro`, no una cancelación sin motivo · Task 1, `cancelar sin motivo`
- `cancelar Norte lun --motivo` (la opción sin valor) → el mismo `motivo no válido…`, sin lanzar un error de `zod` · Task 1, `cancelar con --motivo sin valor`
- `canceladas` sin ninguna reserva cancelada → `sin canceladas`, no una línea vacía · Task 2, `canceladas sin ninguna cancelada`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un `z.enum` y un filtro; sin capas nuevas.
- [x] **YAGNI gate**: nada se abstrae; las anulaciones (`voidBooking`) quedan fuera (0011).
- [x] **Brownfield gate**: `cancelar` cambia de respuesta (ahora lleva motivo) y el test existente se actualiza; `anular`, `libres` y `reservar` no se tocan.
- [x] **Constitution check**: Art. 2 (test primero) y Art. 4 (castellano) respetados; la dependencia nueva choca con `architecture.md`, no con la constitution (decisión 7).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.gitignore` — `node_modules/`, para que la instalación de `zod` no entre en git.

**Modificar**:

- `src/app.js` — `cancelBooking` valida y guarda el motivo; `run` pasa el motivo y añade `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado.
- `package.json` — `zod` en `dependencies` (lo escribe `npm install zod`); `package-lock.json` aparece con él y se commitea.
- `.docs/sdd/steering/architecture.md` — la línea «sin dependencias externas» pasa a decir que la única es `zod`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — las anulaciones del responsable son la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — no cambian.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`; las activas y anuladas no lo tienen.

### 1.6 Dependencias

`zod` (nueva, `dependencies`). Sin servicios externos.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install zod` sin red | baja | media | la Task 1 se para y se avisa; no se cambia de librería |
| Los tests de `cancel.test.js` comparten las reservas en memoria | alta | media | el orden del fichero es contrato: primero los que no cancelan, luego el que cancela `Norte lun`, al final `canceladas` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native, sesión en gama media (Sonnet, effort medium): el plan lleva los textos y los tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (dependencia) · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve `cancelada Norte lun (sala ocupada)`; con `--motivo aburrimiento` ve `motivo no válido: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: `findBooking(room, day)` y `run(cmd, params)` de `src/app.js`, tal como están.
- Produce: `cancelBooking(room, day, reason)` → `string`; guarda `booking.reason` al cancelar. `run('cancelar', [sala, día, '--motivo', motivo])`.

**Ficheros**: crear `.gitignore`; modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/steering/architecture.md`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, en este orden (el estado en memoria se comparte y solo hay una reserva activa):

  ```js
  const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

  test('cancelar con un motivo fuera de la lista', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento']), INVALID);
  });

  test('cancelar sin motivo', () => {
    assert.equal(run('cancelar', ['Norte', 'lun']), INVALID);
  });

  test('cancelar con --motivo sin valor', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), INVALID);
  });

  test('cancelar sin reserva lo dice', () => {
    assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
  });

  test('cancelar una reserva activa con motivo', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });
  ```

  Sustituye el test «cancelar una reserva activa» por el último; «cancelar sin reserva lo dice» queda igual. Ejecuta y comprueba que fallan por la razón esperada.
- [ ] **Step 2: Implementación** — `npm install zod` (deja `"dependencies": {"zod": …}` en `package.json` y crea `package-lock.json`); `.gitignore` con `node_modules/`. En `src/app.js`:
  - `import { z } from 'zod';` y `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `export function cancelBooking(room, day, reason)`: tras `findBooking` (y su `sin reserva …`), `z.enum(REASONS).safeParse(reason)`; si falla devuelve `` `motivo no válido: ${REASONS.join(', ')}` ``; si pasa, `booking.status = 'cancelled'`, `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``.
  - en `run`, `cancelar` extrae el motivo como `params[params.indexOf('--motivo') + 1]` solo si `--motivo` está y tiene valor (`undefined` en otro caso) y lo pasa a `cancelBooking`.
  - `.docs/sdd/steering/architecture.md`: «Node 22, sin dependencias externas» → «Node 22; única dependencia externa: `zod` (validación del motivo de cancelación)».
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`; y `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): cancelar pide un motivo de la lista`.

---

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native, sesión en gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada invocación del CLI arranca con la de Norte activa: `canceladas` solo enseña el motivo dentro de un mismo proceso; se comprueba con el test `el listado de canceladas enseña el motivo` (deuda registrada en `debt.md`).

**Interfaces**:
- Consume: `booking.status === 'cancelled'` y `booking.reason`, producidos por la Task 1.
- Produce: `listCancelled()` → `string` (una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas con `\n`; `sin canceladas` si no hay); `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`: `canceladas sin ninguna cancelada` va **el primero del fichero** (antes de cualquier cancelación) y `el listado de canceladas enseña el motivo` va **al final**, tras «cancelar una reserva activa con motivo»:

  ```js
  test('canceladas sin ninguna cancelada', () => {
    assert.equal(run('canceladas', []), 'sin canceladas');
  });

  test('el listado de canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  ```

  Ejecuta y comprueba que fallan (hoy `run` responde `salas`).
- [ ] **Step 2: Implementación** — en `src/app.js`, `listCancelled()`: filtra `bookings` por `status === 'cancelled'`, mapea a `` `${b.room} ${b.day} — ${b.reason}` `` y une con `\n`; sin resultados devuelve `sin canceladas`. En `run`: `if (cmd === 'canceladas') return listCancelled();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat(0010): canceladas enseña el motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,75h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, una dependencia nueva; sin notas de calibración en `estimation.md`
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo de la lista» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- ADDED «Cancelar pide un motivo de la lista» · AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `cancelar con un motivo fuera de la lista`. ✓
- ADDED «El listado de canceladas enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 2, `el listado de canceladas enseña el motivo`. ✓
- Scope «No entra: anulaciones del responsable de sala (0011)» → N/A, `voidBooking` y `anular` no se tocan. ✓
- Approach «`zod` en `dependencies` de `package.json`» → Task 1, Step 2 (`npm install zod`), comprobado al revisar el diff de `package.json`. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo`; `--motivo` sin valor → Task 1, `cancelar con --motivo sin valor`; sin canceladas → Task 2, `canceladas sin ninguna cancelada`. ✓
