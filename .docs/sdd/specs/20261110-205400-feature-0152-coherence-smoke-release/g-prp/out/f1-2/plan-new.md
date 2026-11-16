---
id: 20261112-152425-feature-0010-motivo-cancelar
feature: 0010
title: Plan de implementación — Motivo al cancelar una reserva
spec: ./spec.md
status: approved
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar una reserva

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Task 1 y Task 2 en sonnet con `sdd-kit:effort-medium` — son cambios de ~20 líneas con firmas y tests escritos en el plan; en Native las hace el hilo de la sesión. La revisión final de rama: ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; no se quita en Native.
2. Ejecución: native, fijado en `sdd-kit.json` (`execution: native`).
3. Los tests siembran con `bookings` exportado (hoy es privado): sin él no se pueden sembrar los GIVEN de la spec; se exporta en la Task 1.
4. `canceladas` es la Task 2 y no va con la 1: la spec pide una parada tras la Task 1 y cada task es revisable por separado.
5. Riesgo alto: ninguno; es memoria y texto.
6. Coste: ~0,6 h de implementación; sin despachos de subagentes salvo la revisión final.
7. Review Focus: 3 entradas que la spec no fija bien, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de la lista cerrada y `canceladas` lo enseña.

**Architecture**: la reserva guarda `reason` al pasar a `cancelled`; `cancelBooking(room, day, reason)` valida el motivo antes de buscar la reserva; `canceladas` filtra `bookings` por estado. Sin estructuras nuevas.

**Tech Stack**: Node 22 sin dependencias, `node --test` (ver `.docs/sdd/steering/operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no hay módulo, dependencia ni contrato nuevo entre módulos; solo cambian `src/app.js` y su test.

## Restricciones globales

### De código

- Texto de la interfaz en castellano; lista de motivos exacta y en este orden: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales: `falta el motivo: cambio de planes, sala ocupada, otro` · `motivo no válido: <valor>; usa: cambio de planes, sala ocupada, otro` · `cancelada <sala> <día> (<motivo>)` · `sin canceladas`.
- Sin dependencias externas; Node 22; sin tabuladores en `src/app.js` (lo mira `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Tests antes que código (constitution, art. 2); gate de cierre en §3, una vez.
- Commits en castellano, un commit por task al quedar limpia su revisión; referencia al ticket 0010.
- Política de modelos del proyecto: la del bloque de decisiones; sin `fable` ni `opus xhigh`.

## Review Focus

- `cancelar Norte lun --motivo --cada-semana` → trata el valor como ausente y responde `falta el motivo: …`; no cancela · Task 1, `Rechaza_motivo_que_empieza_por_guiones`
- `cancelar Norte lun --motivo ""` → `falta el motivo: …` · Task 1, `Rechaza_motivo_vacio`
- `canceladas` con una reserva anulada y otra activa → no las lista · Task 2, `Canceladas_no_incluye_anuladas_ni_activas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y una constante; no hay forma más simple.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: respeta el patrón de `src/app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests antes que código, castellano, git-flow.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `CANCEL_REASONS`, `cancelBooking` con motivo, extracción de `--motivo` en `run`, export de `bookings`, comando `canceladas`.
- `test/cancel.test.js` — los dos tests actuales pasan motivo y siembran; tests nuevos de motivo y de listado.

**NO se tocan**:

- `test/app.test.js` — no depende de `cancelar`.
- `PRODUCT.md` — la Terminology no cambia (decisión 19 de la spec).
- `CHANGELOG.md` — la entrada la escribe el cierre de la release.

### 1.2 Modelo de datos

La reserva gana `reason` (cadena de `CANCEL_REASONS`) al pasar a `cancelled`. Sin migración: memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado compartido entre tests del mismo fichero | media | tests que pasan por orden | cada test llama a `seed()` y deja `bookings` a su medida |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: sonnet con `sdd-kit:effort-medium`, la hace el hilo en Native; cambio acotado con firmas y tests ya escritos.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` imprime `cancelada Norte lun (sala ocupada)`; sin `--motivo` imprime `falta el motivo: cambio de planes, sala ocupada, otro`.

**Interfaces**:
- Consume: nada
- Produce: `export const bookings` (el array vivo, para sembrar), `export const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`, `cancelBooking(room, day, reason)`; la reserva cancelada lleva `reason`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con este helper al principio:

```js
import { run, bookings } from '../src/app.js';

function seed(...rows) {
  bookings.length = 0;
  for (const [room, day, slot] of rows) bookings.push({ room, day, slot, status: 'active' });
}
const FALTA = 'falta el motivo: cambio de planes, sala ocupada, otro';
```

  Tests (cada uno llama a `seed(...)`), con sus asserts:
  - `Cancela_con_motivo`: `seed(['Norte','lun','10:00-12:00'])`; `run('cancelar',['Norte','lun','--motivo','sala ocupada'])` → `'cancelada Norte lun (sala ocupada)'`; `bookings[0].status` → `'cancelled'` y `bookings[0].reason` → `'sala ocupada'`.
  - `Sin_motivo_no_cancela`: `run('cancelar',['Norte','lun'])` → `FALTA`; `bookings[0].status` → `'active'`.
  - `Motivo_fuera_de_lista`: `--motivo 'me aburro'` → `'motivo no válido: me aburro; usa: cambio de planes, sala ocupada, otro'`; sigue `'active'`.
  - `Motivo_con_otra_capitalizacion`: `'Sala ocupada'` → `'motivo no válido: Sala ocupada; usa: cambio de planes, sala ocupada, otro'`; sigue `'active'`.
  - `Motivo_sin_valor`: `['Norte','lun','--motivo']` → `FALTA`; sigue `'active'`.
  - `Rechaza_motivo_vacio`: `['Norte','lun','--motivo','']` → `FALTA`.
  - `Rechaza_motivo_que_empieza_por_guiones`: `['Norte','lun','--motivo','--cada-semana']` → `FALTA`.
  - `Cancelar_una_ya_cancelada`: sembrar Norte lun, `cancelar … --motivo otro`; luego `cancelar … --motivo 'sala ocupada'` → `'sin reserva Norte lun'`; `bookings[0].reason` → `'otro'`.
  - `Cancelar_sin_reserva_lo_dice`: `seed()`; `run('cancelar',['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - `Motivo_se_valida_antes_que_la_reserva`: `seed()`; `run('cancelar',['Sur','mar'])` → `FALTA`.

  Quitar los dos tests actuales (los sustituyen `Cancela_con_motivo` y `Cancelar_sin_reserva_lo_dice`). Ejecutar y ver todos fallar (sin `bookings` exportado, el import ya falla).
- [ ] **Step 2: Implementación** — en `src/app.js`: `export const bookings`; `export const CANCEL_REASONS`; `cancelBooking(room, day, reason)`: si `!reason` devuelve el mensaje de falta; si `!CANCEL_REASONS.includes(reason)` el de no válido; luego `findBooking`, y al cancelar guarda `booking.reason = reason` y devuelve `` `cancelada ${room} ${day} (${reason})` ``. En `run`, el motivo es `params[i + 1]` con `i = params.indexOf('--motivo')`, y vale `undefined` si `i < 0`, falta el valor, es `''` o empieza por `--`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión, en castellano, referenciando el ticket 0010.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: sonnet con `sdd-kit:effort-medium`, la hace el hilo en Native; una función de filtro con formato fijado.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el comando solo ve el estado de la sesión, que no persiste entre ejecuciones de `node src/app.js`: `node src/app.js canceladas` imprime `sin canceladas`; el listado con datos se observa en los tests.

**Interfaces**:
- Consume: `bookings` y `reason` de la Task 1.
- Produce: `run('canceladas', [])` → líneas `<sala> <día> <franja> · <motivo>` unidas por `\n`, o `sin canceladas`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — con `seed` y `FALTA` de la Task 1:
  - `Canceladas_enseña_el_motivo`: `seed(['Sur','mar','14:00-15:00'],['Norte','lun','10:00-12:00'])`; cancelar primero Norte lun con `'cambio de planes'` y luego Sur mar con `'otro'`; `run('canceladas',[])` → `'Sur mar 14:00-15:00 · otro\nNorte lun 10:00-12:00 · cambio de planes'`.
  - `Sin_canceladas`: `seed(['Norte','lun','10:00-12:00'])`; `run('canceladas',[])` → `'sin canceladas'`.
  - `Canceladas_no_incluye_anuladas_ni_activas`: `seed(['Norte','lun','10:00-12:00'],['Sur','mar','14:00-15:00'],['Sur','mie','09:00-10:00'])`; `run('anular',['Norte','lun'])`; `cancelar Sur mar --motivo 'sala ocupada'`; `run('canceladas',[])` → `'Sur mar 14:00-15:00 · sala ocupada'`.

  Ejecutar y ver fallar los tres.
- [ ] **Step 2: Implementación** — en `src/app.js`, `listCancelled()` filtra `bookings` por `status === 'cancelled'` y une con `\n` las líneas `` `${b.room} ${b.day} ${b.slot} · ${b.reason}` ``, o devuelve `'sin canceladas'`; `run` la enruta con `cmd === 'canceladas'`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión, en castellano, referenciando el ticket 0010.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 0,6h
- Estimación de revisión: 0,2h
- Estimación de cierre: 0,2h
- Base de la estimación: 2 tasks pequeñas sobre un fichero de 35 líneas; sin referencia en el estimation-log (no hay features cerradas con calibración).
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cancelar pide un motivo: THEN `cancelada Norte lun (sala ocupada)` y AND la reserva queda cancelada con ese motivo → Task 1, `Cancela_con_motivo`. ✓
- Cancelar sin motivo: THEN `falta el motivo…` y AND sigue activa → Task 1, `Sin_motivo_no_cancela`. ✓
- Motivo fuera de la lista: THEN `motivo no válido: me aburro; …` y AND sigue activa → Task 1, `Motivo_fuera_de_lista`. ✓
- Otra capitalización: THEN y AND → Task 1, `Motivo_con_otra_capitalizacion`. ✓
- `--motivo` sin valor: THEN y AND → Task 1, `Motivo_sin_valor`; decisión 15 (`""` y `--…`) → `Rechaza_motivo_vacio`, `Rechaza_motivo_que_empieza_por_guiones`. ✓
- Ya cancelada: THEN `sin reserva Norte lun` y AND el motivo sigue siendo `otro` → Task 1, `Cancelar_una_ya_cancelada`. ✓
- Cancelar sin reserva: THEN `sin reserva Sur mar` → Task 1, `Cancelar_sin_reserva_lo_dice`. ✓
- Motivo antes que reserva: THEN `falta el motivo…` → Task 1, `Motivo_se_valida_antes_que_la_reserva`. ✓
- Listado enseña el motivo: THEN dos líneas en el orden de la lista → Task 2, `Canceladas_enseña_el_motivo`. ✓
- Sin canceladas: THEN `sin canceladas` → Task 2, `Sin_canceladas`. ✓
- El listado no incluye las anuladas: THEN solo `Sur mar 14:00-15:00 · sala ocupada` → Task 2, `Canceladas_no_incluye_anuladas_ni_activas`. ✓
- Decisión 20 (dos activas de la misma sala y día → la primera) → sin observar: lo hace `findBooking` hoy y ningún escenario de la spec lo exige; ningún test nuevo lo pinta (avisado aquí). ⚠
- Fila de la tabla «cambia de forma» (test `cancelar una reserva activa` y `cancelar sin reserva lo dice`) → Task 1, los dos tests actuales se sustituyen por `Cancela_con_motivo` y `Cancelar_sin_reserva_lo_dice`. ✓
- Review Focus → Task 1 (`Rechaza_motivo_que_empieza_por_guiones`, `Rechaza_motivo_vacio`) y Task 2 (`Canceladas_no_incluye_anuladas_ni_activas`). ✓
