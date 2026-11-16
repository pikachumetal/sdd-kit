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

1. **Modelo y effort por task**: Native, las dos tasks las hace la sesión en gama media (Sonnet, effort medium): el plan trae firmas, textos y tests. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. Se valida el motivo **antes** de buscar la reserva: `cancelar Sur mar --motivo xyz` responde «motivo no válido…», no «sin reserva…». La spec no fija el orden; así quien se equivoca de forma ve el error de forma primero.
4. `cancelar` sin `--motivo` (o con `--motivo` sin valor) responde igual que un motivo fuera de la lista. La spec dice que cancelar «pide» un motivo; hacerlo opcional dejaría reservas canceladas sin rastro, que es lo que se quiere evitar.
5. Consecuencia: los dos tests existentes de `cancelar` (`test/cancel.test.js`) pasan `--motivo`; el texto de «sin reserva» no cambia.
6. `canceladas` sin ninguna reserva cancelada responde «sin canceladas» (la spec lo calla). Una reserva anulada (`voided`) no cuenta como cancelada.
7. Varias canceladas: una línea por reserva, en el orden de la lista de reservas, separadas por `\n`.
8. Los tests usan una instancia fresca del módulo (`import('../src/app.js?<n>')`) porque las reservas viven en memoria y se comparten dentro de un fichero; así no se añade código de producción solo para reiniciar el estado.
9. **Sin observar**: «la reserva de otra persona no se toca» (Anexo de la spec). El código no modela dueños de reserva; el test más cercano comprueba que cancelar otro día no toca la reserva existente. Se avisa aquí antes de ejecutar; el dueño de la reserva llega con la 0011.
10. **Coste estimado**: ~2 h con la sesión en Native; sin despacho de subagentes, salvo la revisión final de rama.
11. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo.

**Architecture**: `cancelBooking(room, day, reason)` valida el motivo contra una constante `REASONS`, y lo guarda en `booking.reason` al pasar a `cancelled`. `run` extrae el valor de `--motivo` de `params`. `listCancelled()` filtra `status === 'cancelled'` y formatea cada línea; `run('canceladas')` la expone.

**Tech Stack**: Node 22 sin dependencias, `node:test`; un solo fichero `src/app.js`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia la lógica de `cancelar` y añade un comando en el mismo fichero; sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Lista de motivos cerrada, literal de la spec: `cambio de planes`, `sala ocupada`, `otro`.
- Textos literales: «cancelada <sala> <día> (<motivo>)», «motivo no válido: cambio de planes, sala ocupada, otro», «<sala> <día> — <motivo>» (raya larga con espacios), «sin reserva <sala> <día>».
- Texto de la interfaz en castellano (constitución, Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, funciones cortas.

### De proceso

- Tests antes que código (constitución, Art. 2); el gate completo corre una vez, en §3.
- Commits: uno por task al quedar limpia su revisión, con la atribución que fije el entorno.
- Native, la sesión implementa; revisión final de rama con `sdd-verify`.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `Rechaza_cancelar_sin_motivo`
- `cancelar Norte lun --motivo` (sin valor) → el mismo texto de motivo no válido · Task 1, `Rechaza_motivo_sin_valor`
- Motivo fuera de la lista no cancela: tras el error, `cancelar Norte lun --motivo "otro"` sí cancela · Task 1, `Motivo_invalido_no_cancela`
- `canceladas` sin ninguna cancelada → «sin canceladas» · Task 2, `Canceladas_vacio`
- Una reserva anulada no aparece en `canceladas` · Task 2, `Canceladas_ignora_anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo en la reserva y una función de listado; sin estructura nueva.
- [x] **YAGNI gate**: ninguna abstracción nueva más allá de la constante `REASONS`.
- [x] **Brownfield gate**: `anular` y `libres` quedan intactos; el cambio de `cancelar` es el de la spec; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero (Art. 2), castellano (Art. 4), sin saltarse el flujo (Art. 1).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `REASONS`, `cancelBooking` con motivo, `listCancelled`, ramas de `run`.
- `test/cancel.test.js` — los dos tests existentes pasan `--motivo`; tests nuevos de cada escenario.

**NO se tocan**:

- `voidBooking` y el comando `anular` — es la 0011.
- `scripts/lint.mjs` — solo mira tabuladores.

### 1.2 Modelo de datos

La reserva gana `reason?: string`, presente solo con `status: 'cancelled'`. Sin persistencia: las reservas viven en memoria.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Estado en memoria compartido entre tests del mismo fichero | Media | Tests que dependen del orden | Instancia fresca del módulo por test |
| Motivo con espacios mal partido por `params` | Baja | `--motivo "sala ocupada"` falla | El shell entrega el valor como un solo argumento; test con `sala ocupada` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar con motivo

**Tras**: —
**Modelo**: Native: la sesión (Sonnet, effort medium); la task trae firmas, textos y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: quien ejecuta `node src/app.js cancelar Norte lun --motivo "sala ocupada"` ve «cancelada Norte lun (sala ocupada)»; con `--motivo vacaciones` ve «motivo no válido: cambio de planes, sala ocupada, otro».

**Interfaces**:
- Consume: nada (parte de `cancelBooking(room, day)` de `src/app.js`).
- Produce: `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`: devuelve «motivo no válido: cambio de planes, sala ocupada, otro» si `reason` no está en `REASONS`, «sin reserva <sala> <día>» si no hay reserva activa, y si no, guarda `booking.reason = reason`, pone `status = 'cancelled'` y devuelve «cancelada <sala> <día> (<motivo>)». `run('cancelar', [sala, día, '--motivo', valor])` pasa `valor` (o `undefined` si falta la bandera o el valor).

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con el helper `const fresh = (n) => import(`../src/app.js?${n}`)` (una instancia por test) y `const MOTIVOS = 'cambio de planes, sala ocupada, otro'`:
  - `cancelar una reserva activa` (existente, actualizado): `run('cancelar', ['Norte','lun','--motivo','cambio de planes'])` → `'cancelada Norte lun (cambio de planes)'`.
  - `cancelar sin reserva lo dice` (existente, actualizado): `run('cancelar', ['Sur','mar','--motivo','otro'])` → `'sin reserva Sur mar'`.
  - `Cancelar_pide_motivo_de_la_lista`: `['Norte','lun','--motivo','sala ocupada']` → `'cancelada Norte lun (sala ocupada)'`.
  - `Rechaza_motivo_fuera_de_la_lista`: `['Norte','lun','--motivo','vacaciones']` → `` `motivo no válido: ${MOTIVOS}` ``.
  - `Rechaza_cancelar_sin_motivo`: `['Norte','lun']` → `` `motivo no válido: ${MOTIVOS}` ``; luego `['Norte','lun','--motivo','otro']` → `'cancelada Norte lun (otro)'`.
  - `Rechaza_motivo_sin_valor`: `['Norte','lun','--motivo']` → `` `motivo no válido: ${MOTIVOS}` ``.
  - `Motivo_invalido_no_cancela`: tras `--motivo vacaciones`, `['Norte','lun','--motivo','otro']` → `'cancelada Norte lun (otro)'`.
  - `Cancelar_otro_dia_no_toca_la_reserva`: `['Norte','mar','--motivo','otro']` → `'sin reserva Norte mar'`, y `['Norte','lun','--motivo','otro']` → `'cancelada Norte lun (otro)'`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los textos nuevos.
- [ ] **Step 3: Implementación** — `REASONS`, `cancelBooking(room, day, reason)` y la rama de `run` según «Produce»; el valor de `--motivo` es el elemento siguiente a la bandera en `params`.
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión; `feat(0010): cancelar pide un motivo`.

### Task 2 — Listado de canceladas

**Tras**: Task 1
**Modelo**: Native: la sesión (Sonnet, effort medium); la task trae firmas, textos y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque las reservas viven en memoria y cada `node src/app.js …` es un proceso nuevo: `canceladas` en una segunda ejecución siempre responde «sin canceladas». Lo que se puede comprobar es `Canceladas_enseña_el_motivo` (cancelar y listar en el mismo proceso).

**Interfaces**:
- Consume: `booking.reason` y `status === 'cancelled'` que deja `cancelBooking(room, day, reason)` en `src/app.js`; las reservas se cancelan con `run('cancelar', [sala, día, '--motivo', valor])`.
- Produce: `listCancelled()`: una línea «<sala> <día> — <motivo>» por reserva con `status === 'cancelled'`, unidas por `\n`, en el orden de `bookings`; «sin canceladas» si no hay ninguna. `run('canceladas', [])` devuelve `listCancelled()`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** — en `test/cancel.test.js`, con el mismo helper `fresh`:
  - `Canceladas_enseña_el_motivo`: `cancelar Norte lun --motivo "sala ocupada"`, luego `run('canceladas', [])` → `'Norte lun — sala ocupada'`.
  - `Canceladas_vacio`: `run('canceladas', [])` en instancia fresca → `'sin canceladas'`.
  - `Canceladas_ignora_anuladas`: `run('anular', ['Norte','lun'])`, luego `run('canceladas', [])` → `'sin canceladas'`.
- [ ] **Step 2: Ver fallar** — `node --test test/cancel.test.js`. Esperado: fallan los tres (hoy `canceladas` responde «salas»).
- [ ] **Step 3: Implementación** — `listCancelled()` y la rama `canceladas` de `run`, según «Produce».
- [ ] **Step 4: Verificación** — `node --test test/cancel.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión; `feat(0010): comando canceladas con motivo`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero; sin referencia en el estimation-log (no existe todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «responde «cancelada Norte lun (sala ocupada)»» → Task 1, `Cancelar_pide_motivo_de_la_lista`. ✓
- AND «un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»» → Task 1, `Rechaza_motivo_fuera_de_la_lista`. ✓
- THEN «responde «Norte lun — sala ocupada»» → Task 2, `Canceladas_enseña_el_motivo`. ✓
- Fila `quitar`: sin reserva responde «sin reserva <sala> <día>» → Task 1, `cancelar sin reserva lo dice`. ✓
- Fila `quitar`: la reserva de otra persona no se toca → sin observar: el código no modela dueños (avisado en las decisiones, punto 9); `Cancelar_otro_dia_no_toca_la_reserva` es lo más cercano. ⚠
- Review Focus: las cinco líneas → `Rechaza_cancelar_sin_motivo`, `Rechaza_motivo_sin_valor`, `Motivo_invalido_no_cancela` (Task 1), `Canceladas_vacio`, `Canceladas_ignora_anuladas` (Task 2). ✓
