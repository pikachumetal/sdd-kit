---
id: 20261112-155842-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar libres por planta
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Filtrar libres por planta

## Decisiones que he tomado yo — valida estas

1. Una sola task: el filtro, sus bordes y la terminología se prueban con el mismo fichero de tests y no hay interfaz entre piezas que un revisor pudiera aprobar por separado.
2. Modelo y effort de la task: la hace el hilo principal (Native), en gama media (Sonnet, effort medium) — el plan lleva firmas, valores y asserts, no hay prosa que interpretar. La revisión final de rama va con el modelo de `sdd-verify`: Spec y Arquitectura no aplica (ver el eje), Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
3. Ejecución: Native, porque es una task única, un error lo caza su propio test y el plan cabe en un contexto.
4. Técnica que la spec no fija: el parseo vive en una función interna `parseLibresArgs(params)` que devuelve `{ slot, floor }` o `{ error }`; así `run` solo decide qué mostrar y los bordes del flag se prueban por `run`, como el resto.
5. Riesgo alto: ninguno. El riesgo medio es romper `libres` sin `--planta`; lo cubre el test existente `libres excluye la sala reservada en la franja`, que no se toca.
6. Coste estimado: ~1 h de implementación; una sesión Native, sin subagentes en la task.
7. La entrada de `PRODUCT.md` (término «Planta») no la observa ningún test: se comprueba en el diff de la task.
8. Review Focus: 5 entradas que la spec no fija del todo, con su comportamiento esperado; ver la sección.

**Goal**: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; sin `--planta`, todas.

**Architecture**: la sala pasa a `{ name, floor }`; `freeRooms(slot, floor)` filtra por franja y, si hay planta, por planta; `parseLibresArgs` extrae franja y planta de los argumentos y detecta los errores.

**Tech Stack**: Node 22, sin dependencias, `node --test` (ver `.docs/sdd/steering/operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque una task única que no depende de ninguna interfaz previa, un error lo caza su propio test y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia un fichero de código y no hay módulo, dependencia ni contrato entre módulos nuevos (`src/app.js` sigue siendo el único fichero de entrada).

## Restricciones globales

### De código

- Node 22 sin dependencias externas; un solo fichero de entrada, `src/app.js`.
- Textos de la interfaz en castellano: `falta la planta: usa --planta <planta>` y `falta la franja: usa libres <franja>`, literales.
- La planta es texto exacto: `'1'`, `'2'`; sin recortar ni normalizar.
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Sin comentarios que repitan el código ni que citen documentos (constitución, spec, task, capacidad); nombres claros en lugar de comentarios.

### De proceso

- Tests antes que código (constitución, artículo 2).
- Commits referenciando la 0012; atribución del kit al final del mensaje.
- Gate de cierre una sola vez, en §3.

## Review Focus

- `libres 14:00-16:00 --planta 2 --planta 1` → `Sur` (vale la primera aparición, no la última) · Task 1, `libres con --planta repetido usa el primero`
- `libres 14:00-16:00 --planta --planta 2` → `falta la planta: usa --planta <planta>` (el valor empieza por `--`) · Task 1, `libres con --planta sin valor`
- `libres 14:00-16:00 --planta ""` → `falta la planta: usa --planta <planta>` (cadena vacía = ausente) · Task 1, `libres con --planta sin valor`
- `libres 14:00-16:00 --planta=2` → `falta la planta: usa --planta <planta>`, no «todas libres» · Task 1, `libres con --planta sin valor`
- `libres --planta 2` → `falta la franja: usa libres <franja>`, no «todas libres» · Task 1, `libres sin franja`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de parseo y un filtro; no hay más simple sin perder los bordes que pide la spec.
- [x] **YAGNI gate**: ninguna abstracción nueva con menos de 3 usos; `parseLibresArgs` es un uso, pero separa el parseo de la salida y se prueba por `run`.
- [x] **Brownfield gate**: retrocompatible (`libres <franja>` igual), respeta el patrón de `src/app.js` y no hay refactor fuera de Scope.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), git-flow (art. 3).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` pasa a `{ name, floor }`; `freeRooms(slot, floor)`; `parseLibresArgs(params)`; `run` usa ambas.
- `test/app.test.js` — los tests de `libres` con y sin `--planta` y sus bordes.
- `PRODUCT.md` — «Planta» en Terminology.

**NO se tocan**:

- `src/app.js` fuera de `libres`: `cancelBooking`, `voidBooking` y el resto de comandos (fuera del Scope de la spec).
- `test/cancel.test.js` — no toca `libres`.
- `CHANGELOG.md` — la entrada la escribe el corte de la release.

### 1.2 Modelo de datos

La sala gana la planta en memoria: `{ name: 'Norte', floor: '1' }`, `{ name: 'Sur', floor: '2' }` (provisional, decisión 1 de la spec). Sin persistencia.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Interfaz de línea de comandos: `libres <franja> [--planta <planta>]`. Salidas y mensajes, en la spec.

### 1.5 UX

No aplica: no cambia ninguna pantalla.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Cambiar la salida de `libres` sin `--planta` | Baja | Alto | El test existente `libres excluye la sala reservada en la franja` y el escenario `Norte, Sur` |
| Que las plantas provisionales no sean las reales | Media | Bajo | Se confirman en la validación; cambiar `floor` en `src/app.js` y en los tests |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Libres filtra por planta

**Tras**: —
**Modelo**: hilo principal, Native, Sonnet con effort medium; sin despacho de subagente.
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend · docs
**Verificación**: `node --test test/app.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: la persona teclea `node src/app.js libres 14:00-16:00 --planta 1` y ve `Norte`; con `--planta 2` ve `Sur`; sin `--planta`, `Norte, Sur`.

**Interfaces**:
- Consume: nada de tasks anteriores. Del código actual, `bookings` (Norte, lun, `10:00-12:00`, `active`) y `run(cmd, params)` de `src/app.js`.
- Produce: `run('libres', params)` con las salidas de la spec.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`, `PRODUCT.md`

- [ ] **Step 1: Tests RED** — en `test/app.test.js`, junto a los existentes, con sus asserts (`assert.equal(run('libres', [...]), '...')`):
  - `libres sin planta lista todas las libres de la franja`: `['14:00-16:00']` → `'Norte, Sur'`.
  - `libres filtra por planta`: `['14:00-16:00', '--planta', '1']` → `'Norte'`; `[..., '--planta', '2']` → `'Sur'`; `['10:00-12:00', '--planta', '1']` → `''`; `['10:00-12:00', '--planta', '2']` → `'Sur'`; `['14:00-16:00', '--otra', '--planta', '2']` → `'Sur'`.
  - `libres con --planta repetido usa el primero`: `['14:00-16:00', '--planta', '2', '--planta', '1']` → `'Sur'`.
  - `libres con planta inexistente da salida vacía`: `--planta 3`, `--planta x` y `--planta 02` → `''`.
  - `libres con --planta sin valor`: `['14:00-16:00', '--planta']`, `[…, '--planta', '--otra']`, `[…, '--planta=2']`, `[…, '--planta', '']` y `[…, '--planta', '--planta', '2']` → `'falta la planta: usa --planta <planta>'`.
  - `libres sin franja`: `['--planta', '2']` → `'falta la franja: usa libres <franja>'`.
  - Ejecutar `node --test test/app.test.js`: ven fallar los de `--planta` (el test existente `libres excluye la sala reservada en la franja` sigue verde).
- [ ] **Step 2: Implementación** — en `src/app.js`:
  - `const rooms = [{ name: 'Norte', floor: '1' }, { name: 'Sur', floor: '2' }];`
  - `function freeRooms(slot, floor)`: devuelve los `name` de las salas sin reserva activa en `slot` y, si `floor !== undefined`, con `room.floor === floor`.
  - `function parseLibresArgs(params)`: devuelve `{ error }` con `'falta la franja: usa libres <franja>'` si `params[0]` empieza por `--`; si no, busca en `params.slice(1)` el primer argumento que es `--planta` o empieza por `--planta=`; sin él → `{ slot, floor: undefined }`; si es `--planta=…` o el siguiente es `undefined`, `''` o empieza por `--` → `{ error: 'falta la planta: usa --planta <planta>' }`; si no → `{ slot, floor: <siguiente> }`.
  - `run`: `libres` llama a `parseLibresArgs(params)` y devuelve `error` o `freeRooms(slot, floor).join(', ')`. Sin tabuladores.
- [ ] **Step 3: Terminología** — en `PRODUCT.md`, Terminology, añadir **Planta**: el nivel del edificio donde está una sala; se compara como texto.
- [ ] **Step 4: Verificación** — `node --test test/app.test.js`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(libres): filtrar por planta con --planta (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 1.5h (con dos rondas de review de la spec)
- Estimación de implementación: 0.75h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.25h
- Base de la estimación: una task, un fichero de código y uno de tests; la incertidumbre está en los bordes del parseo, ya fijados en la spec; sin referencia del estimation-log (aún no existe).
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): `libres 10:00-12:00 --planta 2` da `Sur` y `libres 10:00-12:00` lo de siempre
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «Libres sin filtro» THEN `libres 10:00-12:00` → `Sur` → Task 1, test existente `libres excluye la sala reservada en la franja`. ✓
- «Libres sin filtro» AND `libres 14:00-16:00` → `Norte, Sur` → Task 1, `libres sin planta lista todas las libres de la franja`. ✓
- «Libres filtra por planta» THEN `--planta 1` → `Norte` y AND `--planta 2` → `Sur`, `10:00-12:00 --planta 1` → vacío, `10:00-12:00 --planta 2` → `Sur` → Task 1, `libres filtra por planta`. ✓
- «Libres filtra por planta» AND `--otra --planta 2` → `Sur` → Task 1, `libres filtra por planta`. ✓
- «Libres filtra por planta» AND `--planta 2 --planta 1` → `Sur` → Task 1, `libres con --planta repetido usa el primero`. ✓
- «Planta inexistente» THEN `--planta 3`, `x`, `02` → vacío → Task 1, `libres con planta inexistente da salida vacía`. ✓
- «Planta sin valor» THEN los cinco casos → mensaje → Task 1, `libres con --planta sin valor`. ✓
- «Franja ausente» THEN `libres --planta 2` → `falta la franja: usa libres <franja>` → Task 1, `libres sin franja`. ✓
- Fila «`rooms` y `freeRooms` cambian de forma» → Task 1, los tests por `run` los ejercitan; no hay otro sitio que los nombre (`git grep`, en la spec). ✓
- Término «Planta» en `PRODUCT.md` (decisión 5c) → Task 1, Step 3; sin test, se ve en el diff. ⚠ sin observar por test (avisado en la decisión 7)
- Review Focus (cinco líneas) → Task 1, los tests nombrados en cada línea. ✓
