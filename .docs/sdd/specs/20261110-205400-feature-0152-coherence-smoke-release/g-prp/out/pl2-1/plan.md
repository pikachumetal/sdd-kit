---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Una sola task** — el cambio entero (`cancelar --motivo` y `canceladas`) vive en `src/app.js` y se prueba en `test/cancel.test.js`; partirlo dejaría una task sin nada observable por sí sola.
2. **Modelo y effort**: la sesión Native en gama media (Sonnet, effort medium); la task trae firmas, textos y tests escritos. La revisión final de rama va con el modelo de `sdd-verify`.
3. **Ejecución**: native, fijado en `sdd-kit.json`.
4. **`cancelar` sin `--motivo`** (la spec lo calla): responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. «Cancelar pide un motivo» y la lista es cerrada. El test de hoy `cancelar una reserva activa` pasa a llevar motivo.
5. **Orden de validación** (la spec lo calla): primero la reserva, luego el motivo. `cancelar Sur mar` sin reserva sigue respondiendo «sin reserva Sur mar», como retiene el anexo de la spec; el test existente `cancelar sin reserva lo dice` no cambia.
6. **Motivo no válido no cancela**: la reserva sigue activa y un `cancelar` posterior con motivo válido funciona.
7. **Solo `cancelled` en `canceladas`**: las `voided` (`anular`, 0011) no entran.
8. **`canceladas` sin ninguna**: responde cadena vacía, como `libres` cuando no hay salas (sin texto inventado); la spec no fija otro.
9. **Anexo de la spec**: `quitar` no existe en el código (ya lo cubre `cancelar`); las dos reglas retiradas se observan en `cancelar`, sin tocar nada más.
10. **Coste estimado**: ~0,5 h, sin despacho de subagentes.
11. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada, lo guarda con la reserva y `canceladas` lo enseña.

**Architecture**: la reserva cancelada conserva su `reason` en el mismo objeto de `bookings` (en memoria, sin esquema nuevo). `cancelBooking` valida y guarda; `cancelledBookings` filtra por `status === 'cancelled'`; `run` extrae `--motivo` de los parámetros.

**Tech Stack**: Node ≥ 20, ESM, `node --test`, sin dependencias (`operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: sin módulo, dependencia ni contrato nuevos entre módulos o datos.

## Restricciones globales

### De código

- La lista de motivos es cerrada y exacta: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>` (raya larga con espacios), `sin reserva <sala> <día>`.
- Node ≥ 20, sin dependencias externas; texto de interfaz en castellano (Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code: funciones cortas con un solo cometido.

### De proceso

- Modo Native; tests antes que código (Art. 2).
- Commits con el atributo `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` al final.
- El gate completo corre una vez, en §3, no en la task.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- `cancelar Norte lun --motivo "sala ocupada"` con motivo inválido antes y válido después → el primero no cancela, el segundo sí · Task 1, `un motivo no válido no cancela la reserva`
- `canceladas` sin reservas canceladas → cadena vacía, y una `voided` no aparece · Task 1, `canceladas sin canceladas responde vacío`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el motivo es un campo más de la reserva; sin tabla ni módulo nuevo.
- [x] **YAGNI gate**: una constante con la lista; sin configuración ni abstracción.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec cambia (cancelar pide motivo); respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 1 (flujo SDD), 2 (tests antes que código, gate verde), 3 (git-flow) y 4 (castellano) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — constante `CANCEL_REASONS`, `cancelBooking(room, day, reason)`, `cancelledBookings()`, y `run` con `--motivo` y `canceladas`.
- `test/cancel.test.js` — tests de motivo y de listado (el test «cancelar una reserva activa» pasa a llevar motivo).

**NO se tocan**:

- `voidBooking` y el comando `anular` — es el alcance de la 0011.
- `test/app.test.js`, `scripts/lint.mjs` — nada que cambiar.

### 1.2 Modelo de datos

La reserva cancelada gana `reason: string`. Sin persistencia: viven en memoria.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

CLI: `cancelar <sala> <día> --motivo <motivo>` y `canceladas` (sin argumentos).

### 1.5 UX

No aplica (sin pantalla).

### 1.6 Dependencias

Ninguna. La 0011 (anulaciones) queda fuera.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `--motivo` sin valor tras la bandera | Baja | Bajo | Se trata como motivo ausente: «motivo no válido…» |
| Estado compartido entre tests (reservas en memoria) | Media | Medio | Los tests cancelan la reserva de Norte lun una sola vez en el orden del fichero, o la reponen al empezar (ver Task 1) |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo y listado de canceladas

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium): la task trae firmas, textos y asserts; sin interpretación de prosa.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · tooling (solo test)
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)».

**Interfaces**:
- Consume: `bookings`, `findBooking(room, day)` de `src/app.js` (reserva activa o `undefined`).
- Produce: `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` → cadena; `cancelledBookings()` → cadena (una línea por reserva, separadas por `\n`).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js`. Como las reservas viven en memoria y el módulo es compartido, los tests que cancelan Norte lun se ordenan para que solo el primero la cancele con éxito. Estado inicial: Norte lun activa.
  - `cancelar sin motivo no cancela`: `run('cancelar', ['Norte', 'lun'])` → `'motivo no válido: cambio de planes, sala ocupada, otro'`.
  - `un motivo no válido no cancela la reserva`: `run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí'])` → el mismo texto de error; después `run('libres', ['10:00-12:00'])` → `'Sur'` (la reserva sigue activa).
  - `cancelar sin reserva lo dice` (ya existe, no cambia): `run('cancelar', ['Sur', 'mar'])` → `'sin reserva Sur mar'`.
  - `canceladas sin canceladas responde vacío`: `run('canceladas', [])` → `''`.
  - `cancelar con motivo de la lista` (sustituye a `cancelar una reserva activa`): `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`.
  - `canceladas enseña el motivo`: `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  Ejecutar y ver que fallan.
- [ ] **Step 2: Implementación** en `src/app.js`:
  - `const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];`
  - `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; si `!CANCEL_REASONS.includes(reason)` → `motivo no válido: ${CANCEL_REASONS.join(', ')}`; si no, `status = 'cancelled'`, `booking.reason = reason`, devuelve `cancelada ${room} ${day} (${reason})`.
  - `cancelledBookings()`: `bookings.filter((b) => b.status === 'cancelled').map((b) => `${b.room} ${b.day} — ${b.reason}`).join('\n')`.
  - En `run`: `cancelar` toma el motivo como el valor que sigue a `--motivo` en `params` (`undefined` si falta la bandera o el valor); `canceladas` devuelve `cancelledBookings()`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(0010): motivo al cancelar y listado de canceladas`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 1 task, un fichero de código y uno de test; sin incertidumbres técnicas, sin referencia previa en el log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cancelar pide un motivo» · THEN responde «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- ADDED «Cancelar pide un motivo» · AND un motivo fuera de la lista responde «motivo no válido: …» → Task 1, `un motivo no válido no cancela la reserva` y `cancelar sin motivo no cancela`. ✓
- ADDED «El listado enseña el motivo» · THEN responde «Norte lun — sala ocupada» → Task 1, `canceladas enseña el motivo`. ✓
- Anexo `quitar` · sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Anexo `quitar` · la reserva de otra persona no se toca → sin observar: el sistema no tiene noción de dueño de la reserva (no hay usuarios ni campo propietario), así que ningún test puede ejercitarla (avisado: decisión 9). ⚠
- Anulaciones (0011) → N/A (fuera de scope en la spec). ✓
- Review Focus (3 líneas) → Task 1, tests `cancelar sin motivo no cancela`, `un motivo no válido no cancela la reserva`, `canceladas sin canceladas responde vacío`. ✓
