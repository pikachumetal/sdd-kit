---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-19
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Una sola task, Native.** Un script y un informe; no hay interfaces entre tasks ni nada que revisar por separado.
2. **Modelo de la task**: `sdd-kit:effort-medium` + `sonnet` (en Native la ejecuta la sesión; la revisión final sigue la política de `sdd-verify`).
3. **La carga se siembra sin tocar `src/app.js`.** La spec dice «cargadas con `seed`», pero el repo no tiene ningún `seed` y `bookings` no se exporta. El script lee `src/app.js`, sustituye el literal inicial de `bookings` por 1.000 reservas generadas y carga esa copia desde `os.tmpdir()`. Mide el código real de `freeRooms` sin dejar código de producción (regla del spike). Si prefieres que `seed` exista como comando, es otra fila del roadmap.
4. **La carga es la que confirmó el dev-lead**: 1.000 reservas `active` en la misma franja `10:00-12:00`, repartidas entre `Norte` y `Sur` (500 cada una, `day` distinto por reserva).
5. **Qué se mide**: el tiempo de una llamada `run('libres', ['10:00-12:00'])` con `performance.now()`; 12 repeticiones seguidas (≥ 10 que pide la plantilla), con `heapUsed` tras cada una. La repetición 1 se queda en la tabla, no se descarta.
6. **Riesgo**: con solo 2 salas y un `filter`/`some`, lo esperable es muy por debajo de 50 ms; si sale así se dice tal cual, sin dar por probada una caché innecesaria.
7. **Coste estimado**: ~0,5 h, sin subagentes de implementación (solo la revisión final de rama).
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Dejar medido si `libres` con 1.000 reservas activas en la misma franja responde en < 50 ms, y qué implica para abrir una caché.

**Architecture**: Un script de medida en la carpeta de la spec importa una copia de `src/app.js` con la carga sembrada y llama a `run('libres', …)`. Su salida en bruto es la evidencia; `research.md` la resume contra O1.

**Tech Stack**: Node ≥ 20 (`node:perf_hooks`, `node:fs`, `node:os`), sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike es siempre Native (y `sdd-kit.json` fija `execution: native`): una sola task, sin interfaces entre tasks, un error lo caza la propia salida de la medida y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato; el script solo lee `src/app.js`.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Carga: 1.000 reservas activas en la misma franja, cargadas con `seed` (la spec; ver decisión 3 para el cómo). Umbral: O1 — < 50 ms.
- El spike no deja código de producción: `src/` y `test/` quedan intactos.

### De proceso

- Native: la sesión implementa la task; sin despacho de implementadores.
- Commits con la convención del proyecto (`tipo(sdd): …`, en castellano) y el trailer de atribución.

## Review Focus

- Una repetición fría (la 1) mucho más lenta que las demás → se muestra en la tabla y se cita en el detalle de O1, no se oculta en un promedio · Task 1, el script imprime las 12 filas sin descartar ninguna.
- La copia sembrada no contiene exactamente 1.000 reservas `active` en la franja → el script aborta con código ≠ 0 antes de medir · Task 1, comprobación del recuento previa a la medida.
- Recurso creciendo entre repeticiones aunque el tiempo cumpla → se dice en la sección 3 de `research.md` · Task 1, columna `heapUsed` de la tabla.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un informe.
- [x] **YAGNI gate**: ninguna abstracción.
- [x] **Brownfield gate**: `src/` y `test/` no se tocan.
- [x] **Constitution check**: art. 1 (flujo SDD), 2 (el gate corre entero al cierre), 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure.mjs` — siembra la carga, mide y escribe la salida en bruto.
- `evidence/libres-1000.txt` — salida en bruto de `measure.mjs`.
- `research.md` — informe calcado de `research-template.md` del kit.

**NO se tocan**:

- `src/app.js`, `test/*` — el spike no deja código de producción.
- `scripts/lint.mjs` — solo mira `src/app.js`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La sustitución del literal `bookings` no encuentra la línea si cambia `src/app.js` | Baja | El script falla | Comprueba el recuento de 1.000 `active` antes de medir y sale ≠ 0 |
| Ruido del temporizador con llamadas de microsegundos | Media | Cifras poco significativas | Tabla con las 12 repeticiones; se dice que está muy por debajo del umbral, sin sobreafirmar |

### 1.8 Rollout

Directo: sin código de producción.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y escribir el informe

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, la sesión).
**Evidencia**: O1 — `libres` con 1.000 reservas responde en < 50 ms · salida en bruto `evidence/libres-1000.txt`, sacada por `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs` · fila O1 de `research.md`.

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs` → sale con código 0 e imprime `carga: 1000 reservas active en 10:00-12:00` y 12 filas `rep N: <ms> ms · heapUsed <bytes>`.
**Se prueba en la aplicación**: no, porque es un spike: no cambia ninguna aplicación.

**Interfaces**:
- Consume: `run(cmd, params)` de `src/app.js` — `run('libres', ['10:00-12:00'])` devuelve las salas libres como texto; el literal inicial `const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];`.
- Produce: nada para otras tasks.

**Ficheros**: crear `measure.mjs`, `evidence/libres-1000.txt`, `research.md` (rutas de §1.1).

- [ ] **Step 1: Script de medida** — `measure.mjs`, sin exports. Lee `src/app.js` (ruta relativa a `import.meta.url`), reemplaza la línea `const bookings = [...]` por un array de 1.000 `{ room, day: 'd<i>', slot: '10:00-12:00', status: 'active' }` con `room` alternando `Norte`/`Sur`, escribe la copia en `os.tmpdir()` y la importa. Antes de medir comprueba que hay 1.000 reservas `active` en `10:00-12:00`; si no, `process.exit(1)`. Imprime `carga: 1000 reservas active en 10:00-12:00`, y 12 repeticiones seguidas, cada una `rep N: <ms con 3 decimales> ms · heapUsed <bytes>`, midiendo con `performance.now()` una llamada `run('libres', ['10:00-12:00'])`. Termina con `p50`, `máx` y `umbral O1: 50 ms → cumple|no cumple`.
- [ ] **Step 2: Ejecutar y guardar la evidencia** — `node …/measure.mjs | tee …/evidence/libres-1000.txt`. Esperado: código 0 y las 12 filas.
- [ ] **Step 3: Informe** — `research.md` calcado de `research-template.md`, con `status: done`: §1 la pregunta de la spec; §2 la fila O1 con su estado, la cifra medida (p50 y máx) y el fichero de evidencia; §3 la tabla de las 12 repeticiones con `heapUsed`, diciendo si el recurso crece; §4 la recomendación sobre la caché citando solo filas medidas (la decisión que desbloquea); §5 «nada» salvo que la medida deje a la vista un arreglo, que va como fila del roadmap por abrir.
- [ ] **Step 4: Commit de la task** — `docs(sdd): medir libres con 1.000 reservas (spike 0031)`; uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task, un script de unas 40 líneas, sin incertidumbre técnica
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su fila medida
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` con `evidence/libres-1000.txt`. ✓
- Peor carga confirmada (1.000 reservas activas en la misma franja) → Task 1, comprobación del recuento previa a la medida. ✓
- Decisión que desbloquea (¿caché antes de abrirlo a la oficina?) → Task 1, §4 de `research.md`. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus (3 líneas) → Task 1, filas impresas / recuento previo / columna `heapUsed`. ✓
