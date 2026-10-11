---
id: 20261011-134908-feature-0012-libres-por-planta
feature: 0012
title: Plan de implementación — Filtrar las salas libres por planta
spec: ./spec.md
status: draft
created: 2026-10-11
---

# Plan de implementación — Filtrar las salas libres por planta

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 en `sdd-kit:effort-medium` + `sonnet`, hechas por la propia sesión (Native). Son cambios de ~15 líneas en un solo fichero con la firma y los asserts ya escritos en el plan. El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **Dos tasks**: la 1 lleva la planta como dato y el filtro con una planta válida (lo que se ve en el listado); la 2, los dos avisos. Un revisor puede aprobar el filtro y rechazar los avisos.
4. **Forma de `libres`**: `run('libres', params)` recorre `params` una vez; `--planta` y el valor que le sigue no cuentan como franja, y la franja es el primer argumento que queda. Si `--planta` aparece dos veces, vale la última (la spec no lo fija).
5. **`libres --planta 1` sin franja**: sin cambio de comportamiento de `libres` sin franja (hoy lista las salas sin reserva activa con franja `undefined`, es decir, todas); con planta, las de esa planta. Lo fija un test para que no cambie sin querer.
6. **Riesgos altos**: ninguno. El comportamiento de `libres` sin `--planta` queda pinchado por el test existente de `test/app.test.js`, que se mantiene.
7. **Coste estimado**: ~0,75 h; sin subagentes salvo el revisor final de rama (orden de ~100k tokens).
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `libres` acepta `--planta <n>` y filtra las salas libres por planta, con avisos para una planta sin salas y para un valor ausente o inválido.

**Architecture**: cada sala pasa de ser un nombre a `{ name, floor }`; `run` separa la opción de `libres` de la franja con una función propia y `freeRooms` recibe la planta opcional. Un solo fichero de código y uno de tests.

**Tech Stack**: Node 22, sin dependencias, tests con `node --test` (`.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Valores literales de la spec: `--planta <n>` con `<n>` entero positivo; Norte → planta 1, Sur → planta 2; avisos `no hay salas en la planta <n>` y `falta el número de planta`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres claros en vez de comentarios. Texto de interfaz en castellano; identificadores en inglés, como el fichero actual.
- Solo se toca `src/app.js` y `test/app.test.js`; `cancelBooking`, `voidBooking` y `findBooking` no cambian.
- El listado de `libres` sin `--planta` no cambia: `libres 10:00-12:00` → `Sur`.

### De proceso

- Política de modelos: gama media (Sonnet, effort medium) para las tasks; el revisor final de rama, `sdd-kit:effort-high` + `opus`, también con dos tasks.
- Commits con la convención del proyecto (`feat: …`, castellano), un commit por hito, sin `--no-verify`.

## Review Focus

- `libres --planta 14:00-16:00` (el valor de la opción es la franja) → `falta el número de planta`, no filtra por la franja como si fuera una planta · Task 2, `planta_con_franja_como_valor_pide_numero`
- `libres 14:00-16:00 --planta 0`, `--planta -1` y `--planta 1.5` → `falta el número de planta` (solo valen enteros positivos) · Task 2, `planta_no_entera_positiva_pide_numero`
- `libres --planta 1` sin franja → lista las salas de la planta 1 como `libres` sin franja lista hoy todas, sin tomar `--planta` ni `1` por franja · Task 1, `sin_franja_filtra_solo_por_planta`
- `libres 10:00-12:00 --planta 1` (Norte reservada) → línea vacía, igual que `libres` cuando no queda ninguna, no el aviso de planta sin salas · Task 1, `planta_sin_libres_responde_vacio`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función de parseo y un parámetro nuevo; sin clases ni módulo nuevo.
- [x] **YAGNI gate**: no se abstrae un parser de opciones general; solo `--planta`, con un uso real.
- [x] **Brownfield gate**: retrocompatible (`libres` sin opción igual), sigue el patrón del fichero, sin refactor fuera de alcance.
- [x] **Constitution check**: tests antes que código (art. 2), texto en castellano (art. 4), gate de cierre en §3.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `rooms` pasa a objetos con planta; `freeRooms(slot, floor)`; `parseFreeArgs(params)`; la rama `libres` de `run`.
- `test/app.test.js` — tests de `libres` con `--planta` y de los avisos.

**NO se tocan**:

- `scripts/lint.mjs` — solo comprueba tabuladores en `src/app.js`; sigue valiendo.
- `.docs/sdd/` salvo esta carpeta — la capacidad `free-rooms`, el changelog y el roadmap los escribe el cierre.

### 1.2 Modelo de datos

Solo en memoria: `const rooms = [{ name: 'Norte', floor: 1 }, { name: 'Sur', floor: 2 }];`.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

Interfaz de línea de comandos: `libres <franja> [--planta <n>]` y `libres --planta <n> <franja>`.

### 1.5 UX

Salida por consola: nombres separados por `, `; línea vacía si no queda ninguna; los dos avisos de la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tomar la franja o el número de planta equivocados al recorrer `params` | Media | Medio | Tests de los dos órdenes y de los valores raros (Review Focus) |
| Cambiar `rooms` rompe `freeRooms` y su test actual | Baja | Bajo | El test existente de `libres` corre en cada task |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Planta como dato de la sala y filtro `--planta <n>`

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native la hace la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: backend
**Verificación**: `node --test test/app.test.js`
**Se prueba en la aplicación**: `node src/app.js libres 14:00-16:00 --planta 1` muestra `Norte`; con `--planta 2`, `Sur`; sin `--planta`, `Norte, Sur`.

**Interfaces**:
- Consume: nada.
- Produce: `parseFreeArgs(params: string[]): { slot: string | undefined, floor: number | undefined, error: string | undefined }`; `freeRooms(slot: string | undefined, floor?: number): string[]`. `error` es `falta el número de planta` cuando `--planta` no lleva un entero positivo (lo rellena la Task 2; en esta task es siempre `undefined`).

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED** en `test/app.test.js` (se mantienen los dos actuales):
  ```js
  test('planta filtra las libres de la franja', () => {
    assert.equal(run('libres', ['14:00-16:00', '--planta', '1']), 'Norte');
    assert.equal(run('libres', ['14:00-16:00', '--planta', '2']), 'Sur');
  });
  test('planta antes de la franja da lo mismo', () => {
    assert.equal(run('libres', ['--planta', '1', '14:00-16:00']), 'Norte');
  });
  test('sin planta lista todas las libres de la franja', () => {
    assert.equal(run('libres', ['14:00-16:00']), 'Norte, Sur');
  });
  test('planta_sin_libres_responde_vacio', () => {
    assert.equal(run('libres', ['10:00-12:00', '--planta', '1']), '');
    assert.equal(run('libres', ['10:00-12:00', '--planta', '2']), 'Sur');
  });
  test('sin_franja_filtra_solo_por_planta', () => {
    assert.equal(run('libres', ['--planta', '1']), 'Norte');
  });
  ```
  Esperado: fallan los tres primeros con `--planta` (hoy `run` toma `--planta` o `1` como franja) y pasan los demás o fallan según el orden; el test existente sigue en verde.
- [ ] **Step 2: Implementación** en `src/app.js`: `rooms` como `{ name, floor }`; `freeRooms(slot, floor)` filtra por `floor` solo si viene definido y devuelve nombres; `parseFreeArgs(params)` recorre `params` saltando `--planta` y su valor (la última aparición gana) y toma la franja del primer argumento restante; la rama `libres` de `run` llama a `parseFreeArgs` y a `freeRooms(...).join(', ')`.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js`. Esperado: todo verde.
- [ ] **Step 4: Commit de la task** — `feat: libres filtra por planta (0012)`; uno solo, al quedar limpia su revisión.

### Task 2 — Avisos de planta sin salas y de valor ausente o inválido

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en Native, la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/app.test.js`, escritos antes del código y sin commitear.

**Superficies**: backend
**Verificación**: `node --test test/app.test.js`
**Se prueba en la aplicación**: `node src/app.js libres 14:00-16:00 --planta 3` muestra `no hay salas en la planta 3`; `... --planta` y `... --planta x` muestran `falta el número de planta`.

**Interfaces**:
- Consume: `parseFreeArgs` y `freeRooms` de la Task 1.
- Produce: `parseFreeArgs` rellena `error = 'falta el número de planta'` si `--planta` no lleva un entero positivo (`/^[1-9]\d*$/`); `run` responde `no hay salas en la planta <n>` si ninguna sala tiene esa planta.

**Ficheros**: modificar `src/app.js`, `test/app.test.js`

- [ ] **Step 1: Tests RED**:
  ```js
  test('planta sin salas avisa', () => {
    assert.equal(run('libres', ['14:00-16:00', '--planta', '3']), 'no hay salas en la planta 3');
  });
  test('planta sin valor pide el número', () => {
    assert.equal(run('libres', ['14:00-16:00', '--planta']), 'falta el número de planta');
    assert.equal(run('libres', ['14:00-16:00', '--planta', 'x']), 'falta el número de planta');
  });
  test('planta_con_franja_como_valor_pide_numero', () => {
    assert.equal(run('libres', ['--planta', '14:00-16:00']), 'falta el número de planta');
  });
  test('planta_no_entera_positiva_pide_numero', () => {
    for (const value of ['0', '-1', '1.5']) {
      assert.equal(run('libres', ['14:00-16:00', '--planta', value]), 'falta el número de planta');
    }
  });
  ```
  Esperado: los cuatro fallan antes de implementar.
- [ ] **Step 2: Implementación** en `src/app.js`: validar el valor en `parseFreeArgs`; en `run`, devolver `error` si lo hay y, si `floor` está definido y ninguna sala lo tiene, `no hay salas en la planta ${floor}`; el orden es error → planta sin salas → listado.
- [ ] **Step 3: Verificación** — `node --test test/app.test.js`. Esperado: todo verde, incluidos los tests de la Task 1.
- [ ] **Step 4: Commit de la task** — `feat: avisos de planta en libres (0012)`.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,75 h
- Base de la estimación: 2 tasks pequeñas en un solo fichero, sin dependencias; la incertidumbre es el recorrido de `params` (Review Focus)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: una fila por THEN de `free-rooms`, ejecutando `node src/app.js libres …` con cada entrada de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Listar las salas libres de una franja (`Sur` / `Norte, Sur`) → Task 1, tests `sin planta lista todas las libres de la franja` y el `libres excluye la sala reservada en la franja` existente. ✓
- Filtrar por planta: `--planta 1` → `Norte`, `--planta 2` → `Sur`, opción antes de la franja, `10:00-12:00 --planta 2` → `Sur`, `10:00-12:00 --planta 1` → vacío → Task 1. ✓
- `--planta 3` → `no hay salas en la planta 3` → Task 2. ✓
- `--planta` y `--planta x` → `falta el número de planta` → Task 2. ✓
- Sin `--planta`, `Norte, Sur` → Task 1. ✓
- Review Focus: las cuatro entradas → Task 1 (2) y Task 2 (2) con su test. ✓
