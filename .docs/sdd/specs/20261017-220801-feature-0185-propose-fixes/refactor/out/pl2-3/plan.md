---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-10-18
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, en la sesión (Native), Sonnet con effort medium; el plan trae firmas, textos y tests. La revisión final de rama va con el modelo de `sdd-verify` (ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, porque es una sola task en un solo fichero de código, un error lo caza el test de su task y el plan cabe en un contexto.
3. **`--motivo` ausente, sin valor o fuera de la lista** responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela nada: la spec solo fija el caso «fuera de la lista», y «cancelar pide un motivo» obliga a tratar la ausencia igual.
4. **Orden de comprobaciones en `cancelar`**: primero el motivo, luego la reserva. Con motivo inválido y sin reserva responde lo del motivo.
5. **`canceladas` sin ninguna cancelada responde cadena vacía**; con varias, una por línea en orden de cancelación; solo salen las de estado cancelada (ni activas ni anuladas).
6. **Los tests de `test/cancel.test.js` comparten el estado en memoria** (las reservas viven en `src/app.js`) y dependen de su orden; no se añade un `reset` solo para tests (YAGNI). El orden está escrito en la task.
7. **Test existente `cancelar una reserva activa`**: se sustituye por el de la spec (con `--motivo`), porque `cancelar` sin motivo ya no cancela.
8. **Coste estimado**: ~0,5 h de implementación, sin subagentes.
9. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo contra la constante `REASONS` y lo guarda en la reserva (`reason`); `run` extrae el valor de `--motivo`; un `cancelledBookings()` formatea el listado que `run('canceladas')` devuelve.

**Tech Stack**: Node 22, sin dependencias; `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, porque una sola task en un solo fichero de código, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el comportamiento de comandos en `src/app.js`: ni módulo, ni dependencia, ni contrato nuevo entre módulos o datos.

## Restricciones globales

### De código

- Lista de motivos, literal y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: «cancelada <sala> <día> (<motivo>)» · «motivo no válido: cambio de planes, sala ocupada, otro» · «<sala> <día> — <motivo>» (raya larga `—`) · «sin reserva <sala> <día>».
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas con un solo cometido.
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).

### De proceso

- Política de modelos: gama media (Sonnet, effort medium) para la sesión que ejecuta; `fable` y `opus xhigh` no se usan.
- Ejecución: native. Tests antes que código (constitution, art. 2).
- Commits: uno por task al quedar limpia su revisión, con el trailer de coautoría del kit.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro», la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `--motivo` como último argumento, sin valor → igual que sin motivo · Task 1, `cancelar con --motivo sin valor`
- Motivo fuera de la lista con reserva existente → no la cancela: un `cancelar` válido después sí responde «cancelada» · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` sin ninguna cancelada (la reserva sigue activa) → cadena vacía, no «salas» ni error, y no lista la activa · Task 1, `canceladas sin canceladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: estado en el propio objeto de la reserva, sin estructuras nuevas.
- [x] **YAGNI gate**: sin abstracción nueva más allá de `REASONS` y una función de listado.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (`cancelar` ahora exige motivo); sigue el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4); gate de cierre `node --test` entero en verde.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking(room, day, reason)` con motivo, `cancelledBookings()` y los comandos `cancelar --motivo` y `canceladas` en `run`.
- `test/cancel.test.js` — los tests de la spec y de las entradas del Review Focus, en el orden de la task.

**NO se tocan**:

- `src/app.js` → `voidBooking` y `anular` — fuera de scope (0011).
- `test/app.test.js` — `libres` y `reservar` no cambian.
- `README.md`, `PRODUCT.md` — no mencionan `cancelar`.

### 1.2 a 1.6

No aplican.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests dependientes del orden por el estado en memoria | Media | Bajo | Orden escrito en la task; un solo fichero de tests |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: sesión Native, Sonnet con effort medium (`subagent_type: sdd-kit:effort-medium` + `model: sonnet` si hubiera que despacharla).
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (el lint corre en el gate de cierre)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; en una sesión que conserve el estado, `canceladas` enseña «Norte lun — sala ocupada». (El estado es en memoria: cada ejecución de `node src/app.js` arranca de cero, así que el listado se comprueba por los tests.)

**Interfaces**:
- Consume: `bookings` (`{ room, day, slot, status }`, `status` ∈ `active | cancelled | voided`), `findBooking(room, day)` y `run(cmd, params)` de `src/app.js`.
- Produce: `REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → string; la reserva cancelada lleva `reason`; `cancelledBookings()` → string con una línea «<sala> <día> — <motivo>» por reserva con `status === 'cancelled'`, unidas por `\n`; `run('cancelar', [room, day, '--motivo', reason])` y `run('canceladas', [])`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`, en este orden (comparten el estado en memoria; sustituyen a `cancelar una reserva activa`, y `cancelar sin reserva lo dice` pasa a llevar `--motivo`):
  1. `canceladas sin canceladas`: `run('canceladas', [])` → `''`.
  2. `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  3. `cancelar con --motivo sin valor`: `run('cancelar', ['Norte', 'lun', '--motivo'])` → el mismo texto.
  4. `motivo fuera de la lista no cancela`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo texto; y `run('canceladas', [])` sigue en `''`.
  5. `cancelar sin reserva lo dice`: `run('cancelar', ['Sur', 'mar', '--motivo', 'otro'])` → `'sin reserva Sur mar'`.
  6. `cancelar pide un motivo de la lista`: `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  7. `el listado de canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar: fallan 1, 2, 3, 4, 6 y 7 (el 5 ya pasa); ver el fallo antes de seguir.
- [ ] **Step 2: Implementación** en `src/app.js`: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];` · `cancelBooking(room, day, reason)`: si `!REASONS.includes(reason)` devuelve `` `motivo no válido: ${REASONS.join(', ')}` `` antes de buscar la reserva; si no hay reserva, `sin reserva ${room} ${day}`; si la hay, `status = 'cancelled'`, `reason`, y devuelve `` `cancelada ${room} ${day} (${reason})` `` · `cancelledBookings()` filtra `status === 'cancelled'` y une con `\n` · en `run`: `cancelar` toma `reason = params[params.indexOf('--motivo') + 1]` solo si `--motivo` está en `params` (si no, `undefined`), y `canceladas` devuelve `cancelledBookings()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: motivo al cancelar (0010)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 1 task, un fichero de código y un fichero de tests, sin incertidumbres técnicas; sin `estimation-log.md` de referencia
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo», THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar pide un motivo de la lista`. ✓
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» → Task 1, `motivo fuera de la lista no cancela`. ✓
- ADDED «El listado enseña el motivo», THEN responde «Norte lun — sala ocupada» → Task 1, `el listado de canceladas enseña el motivo`. ✓
- Anexo, `quitar` → `cancelar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo, `quitar` → `cancelar`: la reserva de otra persona no se toca → sin observar: el modelo de reservas no tiene propietario y `quitar` no existe en el código, así que ningún test puede ejercitarlo (avisado aquí; el dev-lead lo valida con este plan). ⚠
- Fuera de scope (anulaciones del responsable, 0011) → N/A (confirmado en spec). ✓
- Review Focus (4 líneas) → Task 1, tests 2, 3, 4 y 1. ✓
