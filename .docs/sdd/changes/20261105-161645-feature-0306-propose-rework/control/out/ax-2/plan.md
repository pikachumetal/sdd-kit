---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-06
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Ejecución**: native, fijado en `sdd-kit.json` — 2 tasks encadenadas por la firma de `cancelBooking`, un solo fichero de código y el plan cabe en un contexto.
2. **Modelo y effort por task**: hilo principal en gama media (Sonnet, effort medium) en las dos — el plan lleva firmas, textos y asserts; la revisión final de rama sigue la política de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
3. **`cancelar` sin `--motivo`** (la spec no lo fija) → responde «motivo no válido: cambio de planes, sala ocupada, otro», igual que un motivo fuera de la lista: la spec dice que cancelar «pide un motivo». El test actual `cancelar una reserva activa` (sin motivo) pasa a llevar `--motivo "sala ocupada"`.
4. **La validación va antes de buscar la reserva**: un motivo inválido no cancela nada y no cambia el estado de `bookings`; con motivo inválido y sin reserva, gana «motivo no válido».
5. **La lista es sensible a mayúsculas**: «Sala ocupada» no es válido (la spec da los tres literales en minúscula).
6. **`zod` contradice `tech-stack.md`** («sin dependencias externas»): la spec aprobada fija `zod`; la Task 1 corrige `tech-stack.md` en el mismo commit que añade la dependencia. Versión: la última estable que instale `npm install zod` en `dependencies`, fijada por `package-lock.json`. Instalarla necesita red.
7. **Orden entre tests**: `bookings` vive en memoria y el módulo se comparte dentro de `test/cancel.test.js`; el test del listado (Task 2) lee la cancelación de Norte lun que hace el de la Task 1, y por eso va después en el fichero. Sin reinicio de estado: no hay otro uso que lo justifique (YAGNI).
8. **`anular` (voided) no aparece en `canceladas`**: la spec lista «reservas con estado cancelada»; las anuladas son de la 0011.
9. **Coste estimado**: ~3,5 h en total (ver Estimación); sin despacho de subagentes en las tasks, solo la revisión final de rama (orden de magnitud: unos pocos dólares).
10. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra una lista cerrada y lo guarda; `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: `src/app.js` sigue siendo el único fichero de código. `cancelBooking(room, day, reason)` valida `reason` con un esquema `zod` (`z.enum`) y guarda `reason` en la reserva; `run` extrae el valor que sigue a `--motivo`; un comando nuevo `canceladas` filtra `bookings` por `status === 'cancelled'`.

**Tech Stack**: Node 22, `node --test`, `node scripts/lint.mjs`; nueva dependencia `zod`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — dependencia nueva `zod` en `package.json` (`architecture.md` no existe; la frontera es el manifest).

## Restricciones globales

### De código

- La lista de motivos es cerrada y literal: `cambio de planes`, `sala ocupada`, `otro`.
- Respuestas literales: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios).
- `zod` va en `dependencies` de `package.json`, no en `devDependencies`.
- Texto de la interfaz en castellano.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.

### De proceso

- Tests antes que código (constitution, art. 2); un commit por task al quedar limpia su revisión; apertura y cierre aparte.
- Native: la sesión implementa las dos tasks una tras otra; después, la revisión final de rama de `sdd-verify`.
- Commits con el convenio del proyecto (`feat: …`) referenciando la 0010 y la atribución que fije el entorno.
- El gate completo corre una vez, en §3.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo` (flag sin valor) → el mismo «motivo no válido…» · Task 1, `cancelar con --motivo vacío es motivo no válido`
- Motivo inválido sobre una reserva activa → no la cancela: `libres 10:00-12:00` sigue sin incluir Norte y `canceladas` no la lista · Task 1, `motivo inválido no cambia la reserva`
- `canceladas` sin ninguna cancelada → respuesta vacía, no un error · Task 2, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un esquema `zod` y un filtro; sin capas nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante usada por el esquema y por el mensaje de error.
- [x] **Brownfield gate**: retrocompatible salvo `cancelar` sin motivo, que cambia por spec («pide un motivo»); sigue el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (art. 2), castellano (art. 4), flujo SDD (art. 1); `tech-stack.md` se corrige por la dependencia nueva.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `package-lock.json` — lo genera `npm install zod`.
- `.gitignore` — con `node_modules/`, que hoy no existe y la instalación crea.

**Modificar**:

- `src/app.js` — `cancelBooking` con motivo validado; `run` lee `--motivo`; comando `canceladas`.
- `test/cancel.test.js` — tests de la 0010; el de «cancelar una reserva activa» pasa a llevar motivo.
- `package.json` — `dependencies.zod`.
- `.docs/sdd/tech-stack.md` — «Node 22, sin dependencias externas» pasa a decir que `zod` valida la entrada.

**NO se tocan**:

- `src/app.js` `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no depende de `cancelar`.
- `scripts/lint.mjs` — solo mira tabuladores en `src/app.js`.

### 1.2 Modelo de datos

La reserva cancelada gana `reason` (cadena de la lista); las demás no lo tienen. En memoria, sin migración.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Comandos de línea:

- `cancelar <sala> <día> --motivo <motivo>` → `cancelada <sala> <día> (<motivo>)` · `motivo no válido: cambio de planes, sala ocupada, otro` · `sin reserva <sala> <día>`.
- `canceladas` → una línea `<sala> <día> — <motivo>` por reserva cancelada, unidas por salto de línea; cadena vacía si no hay.

### 1.5 UX

No aplica (línea de comandos).

### 1.6 Dependencias

`zod` (nueva). Sin specs previas. La 0011 (anular) es independiente.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `npm install zod` sin red | media | bloquea la Task 1 | parar y avisar al dev-lead; no sustituir `zod` por validación a mano (contradiría la spec aprobada) |
| Tests compartiendo estado en memoria | media | un test depende de otro | orden fijado y dicho en la decisión 7 |
| `tech-stack.md` y la spec se contradicen | alta | documentación falsa | Task 1 corrige el documento |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: hilo principal, Sonnet con effort medium (Native); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling · docs
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona escribe `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: `findBooking(room, day)` y el array `bookings` de `src/app.js`; `run(cmd, params)`.
- Produce: `cancelBooking(room: string, day: string, reason: string | undefined): string` que guarda `booking.reason`; cada reserva cancelada lleva `reason` (la Task 2 lo lee).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`, `package.json`, `.docs/sdd/tech-stack.md`; crear `package-lock.json`, `.gitignore`.

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, sustituir `cancelar una reserva activa` y mantener `cancelar sin reserva lo dice`; añadir:
  ```js
  const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

  test('cancelar una reserva activa con motivo', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  });
  test('un motivo fuera de la lista no es válido', () => {
    assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'vacaciones']), INVALID);
  });
  test('cancelar sin motivo no cancela', () => {
    assert.equal(run('cancelar', ['Sur', 'mar']), INVALID);
  });
  test('cancelar con --motivo vacío es motivo no válido', () => {
    assert.equal(run('cancelar', ['Sur', 'mar', '--motivo']), INVALID);
  });
  test('motivo inválido no cambia la reserva', () => {
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'vacaciones']), INVALID);
    assert.equal(run('libres', ['10:00-12:00']), 'Sur');
  });
  ```
  El test de la reserva activa con motivo va el primero del fichero que cancela Norte lun y los de motivo inválido sobre Norte lun, **antes** de él, para que la reserva siga activa; `cancelar sin reserva lo dice` se queda con `Sur mar --motivo "otro"` → `sin reserva Sur mar`. Ejecutar: fallan.
- [ ] **Step 2: Implementación** — `npm install zod` (en `dependencies`; crea `package-lock.json`); `.gitignore` con `node_modules/`; en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`, `const reasonSchema = z.enum(REASONS)`, `cancelBooking(room, day, reason)` valida con `reasonSchema.safeParse(reason)` antes de `findBooking` y devuelve `motivo no válido: ${REASONS.join(', ')}` si falla; guarda `booking.reason`; `run` toma `params[params.indexOf('--motivo') + 1]` (indefinido si el flag falta o es el último) y se lo pasa. `tech-stack.md`: sustituir «sin dependencias externas» por «`zod` para validar la entrada; sin otras dependencias».
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: cancelar pide un motivo de la lista (0010)`; los intermedios se juntan.

### Task 2 — Listado de canceladas con motivo

**Tras**: Task 1
**Modelo**: hilo principal, Sonnet con effort medium (Native); sin despacho.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona cancela Norte lun con «sala ocupada» y `canceladas` le responde «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `bookings[].status === 'cancelled'` y `bookings[].reason` de la Task 1.
- Produce: `run('canceladas', [])` → líneas `<room> <day> — <reason>` unidas por `\n`; `''` si no hay.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`.

- [ ] **Step 1: Tests RED** — al final de `test/cancel.test.js` (tras la cancelación de Norte lun de la Task 1):
  ```js
  test('canceladas enseña el motivo', () => {
    assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
  });
  ```
  y, **antes** de cualquier cancelación con éxito (primero del fichero), `canceladas sin canceladas responde vacío`: `assert.equal(run('canceladas', []), '')`. Ejecutar: fallan (hoy `run` responde `salas`).
- [ ] **Step 2: Implementación** — `function cancelledList()` que filtra `bookings` por `status === 'cancelled'` y mapea `` `${b.room} ${b.day} — ${b.reason}` ``; `run('canceladas')` la devuelve con `.join('\n')`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — `feat: canceladas enseña el motivo (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks pequeñas sobre un fichero; incertidumbre en la instalación de `zod` y en el estado compartido entre tests; sin estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar una reserva activa con motivo`. ✓
- AND «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `un motivo fuera de la lista no es válido`. ✓
- THEN «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Scope «No entra: anulaciones» → N/A (confirmado en spec). ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; flag sin valor → `cancelar con --motivo vacío es motivo no válido`; inválido no cambia la reserva → `motivo inválido no cambia la reserva`; sin canceladas → Task 2, `canceladas sin canceladas responde vacío`. ✓
