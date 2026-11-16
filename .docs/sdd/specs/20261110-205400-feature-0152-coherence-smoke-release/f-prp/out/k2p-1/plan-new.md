---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Spike — ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 las hace la sesión (Native, sin despacho); no hay subagente que elegir. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`), también con dos tasks.
2. **Ejecución**: Native, porque un spike es siempre Native (ver línea `Ejecución`).
3. **«Cargadas con `seed`»**: en el repo no existe ningún `seed` (ni comando ni función). `seed` es una función del propio script de medida, no código de producción: añade 1.000 reservas activas a `bookings`.
4. **Peor carga concreta**: las 1.000 reservas van en la sala `Norte`, misma franja `10:00-12:00`, días `d0001`…`d1000`, y se consulta esa franja. `freeRooms` recorre `bookings` con `some` y corta en la primera coincidencia: con `Norte` el recorrido es corto, pero para `Sur` no hay coincidencia y recorre las 1.000 enteras. Es la carga más cara de la forma «1.000 activas en la misma franja». Si el dev-lead entendía otro reparto entre salas, se cambia el script y se repite.
5. **Acceso a `bookings`**: `src/app.js` no la exporta y un spike no toca producción. El script copia `src/app.js` a un directorio temporal como `app-medida.mjs`, le añade al final `export { bookings };` y lo importa. Se mide el código real, sin duplicarlo.
6. **Qué es una repetición y cuándo cumple O1**: una repetición es una llamada a `run('libres', ['10:00-12:00'])` cronometrada con `process.hrtime.bigint()`; 20 repeticiones seguidas (la spec no fija el número; §3 de la plantilla pide ≥ 10), sin descartar la primera (la fría cuenta). O1 cumple si **todas** son < 50 ms, no la mediana.
7. **Salida y código de salida**: el script imprime una tabla por repetición, el máximo, la mediana y una última línea `O1: cumple` o `O1: no cumple tal como se definió`. Sale con 0 si midió, aunque no cumpla (un `no cumple` es un resultado, no un fallo del script); sale con 1 solo si `libres` no devuelve `Sur` bajo carga o si hay un error.
8. **Dónde vive la evidencia**: la spec está en `.docs/sdd/specs/<id>/` y no en `changes/`; el script (`medir-libres.mjs`), la salida en bruto (`medidas-libres.txt`) y `research.md` van en esa misma carpeta, junto a la spec.
9. **Riesgos altos**: ninguno; es una medida local de segundos y no toca producción.
10. **Coste estimado**: 0,75 h de implementación; sin despacho de subagentes, solo la revisión final de rama (orden de magnitud: unos pocos dólares).
11. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Medir cuánto tarda `libres` con 1.000 reservas activas en la misma franja y dejar la tabla y la recomendación de si hace falta caché.

**Architecture**: Un script de medida (`medir-libres.mjs`) importa una copia de `src/app.js` con `bookings` exportada, siembra la peor carga y cronometra `run('libres', …)`. Su salida en bruto se guarda en `medidas-libres.txt` y `research.md` la resume con la plantilla de research. `src/` queda intacto.

**Tech Stack**: Node 22 sin dependencias externas (`node:fs`, `node:os`, `node:path`, `node:url`, `node:perf_hooks`); `node --test` para la suite del proyecto.

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike es siempre Native, aunque `execution` no lo diga: 2 tasks encadenadas por un único fichero (la Task 2 lee la salida de la Task 1), un error lo caza el script de la Task 1 y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia en un manifest ni contrato entre módulos o datos: un script suelto en la carpeta de la spec y un documento; `src/app.js` no se toca.

## Restricciones globales

### De código

- Node 22, sin dependencias externas (`architecture.md`); el script solo usa módulos `node:`.
- Umbral de la spec, literal: «`libres` con 1.000 reservas responde en < 50 ms» (O1).
- Peor carga de la spec, literal: «1.000 reservas activas en la misma franja, cargadas con `seed`».
- Ningún cambio en `src/`: un spike no deja código de producción.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas con un solo propósito.

### De proceso

- Native: la sesión implementa cada task con `sdd task start` / `sdd task done` sobre el ledger.
- Política de modelos: sesión en gama media; los ejes Spec y Arquitectura de la revisión final con el modelo más capaz (decisión 1).
- Commits en castellano, convención `tipo(ámbito): …` del repo (`docs(sdd): …`); atribución de commits según el proyecto.

## Review Focus

- `libres` devuelve algo distinto de `Sur` con 1.000 reservas → el script sale con 1 y no imprime `O1:`, en vez de dar por buena una medida de una función que falla · Task 1, comprobación `assert.equal(run('libres', [slot]), 'Sur')` antes de cronometrar
- Una sola repetición lenta (la primera, en frío) con el resto rápidas → O1 sigue evaluándose sobre el máximo de las 20, no sobre la mediana · Task 1, línea `máximo` y veredicto de `O1:` en la salida
- El tiempo cumple pero la memoria crece repetición a repetición → se dice en `research.md`, no se da por limpio · Task 1, columna «Recurso acumulado» (`heapUsed`) y Task 2, §3

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento; nada más simple mide el código real.
- [x] **YAGNI gate**: sin abstracciones; `seed` y `medir` son dos funciones de un solo uso.
- [x] **Brownfield gate**: retrocompatible por construcción, `src/` intacto; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 1 (flujo SDD), 2 (el gate de cierre `node --test` entero sigue verde porque no se toca producción) y 4 (castellano) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` — siembra la peor carga, cronometra `libres` 20 veces y escribe la tabla y el veredicto de O1 por la salida estándar.
- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medidas-libres.txt` — salida en bruto del script, tal cual.
- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/research.md` — resultado calcado de `research-template.md`.
- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/tasks.md` — registro vivo (el plan tiene más de una task).

**Modificar**:

- `ROADMAP.md` — solo si `research.md` §5 saca un cambio: una fila por abrir; con «nada», no se toca.

**NO se tocan**:

- `src/app.js` — un spike no deja código de producción; el script lee una copia.
- `test/` — no hay comportamiento nuevo que testear; la evidencia es la medida.
- `scripts/lint.mjs` — solo mira `src/app.js`.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna. Usa `run` y `bookings` de `src/app.js` tal como están hoy.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La medida es tan pequeña que no distingue de ruido (µs) | alta | bajo | `hrtime.bigint()` y salida en ms con 3 decimales; el umbral es 50 ms, órdenes de magnitud por encima |
| La carga que se mide no es la que el dev-lead imaginaba | media | medio | la decisión 4 la deja escrita; la spec la confirmó como «1.000 en la misma franja» y el script se repite con otro reparto |
| `src/app.js` cambia y la copia temporal deja de exportar bien | baja | bajo | la copia se hace en cada ejecución, no se guarda |

### 1.8 Rollout

Directo: no hay nada que llegue a producción. Lo que salga va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.

**Evidencia**: O1 · salida en bruto `medidas-libres.txt` y el script `medir-libres.mjs` que la saca, en la carpeta de la spec · filas de `research.md` §2 y §3 (Task 2).

**Superficies**: tooling
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → sale con 0 y su última línea es `O1: cumple` o `O1: no cumple tal como se definió` (el veredicto lo da la medida, no el plan); sin `NO_COLOR` que fijar, el script no pinta.
**Se prueba en la aplicación**: no, porque investigación: no cambia ninguna aplicación.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd: string, params: string[]): string` y `bookings: Array<{ room, day, slot, status }>` (esta última exportada solo en la copia temporal).
- Produce: `medidas-libres.txt` con, en este orden: la carga (`reservas: 1000`, `franja: 10:00-12:00`, `sala: Norte`), una fila por repetición con columnas `Repetición | Tiempo (ms) | Recurso acumulado (heapUsed MB)`, las líneas `máximo: <ms>` y `mediana: <ms>`, y la línea final `O1: cumple` | `O1: no cumple tal como se definió`.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs`, `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medidas-libres.txt`

- [ ] **Step 1: Implementación** — `medir-libres.mjs`:
  - `async function cargarApp(): Promise<{ run, bookings }>`: lee `../../../../src/app.js` relativo al script, escribe `app-medida.mjs` en `mkdtempSync(join(tmpdir(), 'libres-'))` con `export { bookings };` añadido al final, y la importa con `import(pathToFileURL(ruta).href)`.
  - `function seed(bookings, total = 1000): void`: vacía `bookings` y añade `total` reservas `{ room: 'Norte', day: 'd0001'…, slot: '10:00-12:00', status: 'active' }` (día con `padStart(4, '0')`).
  - `function medir(run, repeticiones = 20): Array<{ n, ms, heapMB }>`: antes del bucle `assert.equal(run('libres', ['10:00-12:00']), 'Sur')` con `node:assert/strict` (esta llamada no cuenta); luego `repeticiones` veces cronometra `run('libres', ['10:00-12:00'])` con `process.hrtime.bigint()` y anota `process.memoryUsage().heapUsed / 1048576`.
  - Imprime la tabla, `máximo: <ms con 3 decimales>`, `mediana: <ms con 3 decimales>` y `O1: cumple` si el máximo es < 50, si no `O1: no cumple tal como se definió`. El `assert` que falla o cualquier error sale con código 1 (el proceso no atrapa la excepción).
- [ ] **Step 2: Build** — no aplica: sin compilación. Esperado: `node --check .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` sin salida.
- [ ] **Step 3: Verificación** — ejecutar el script y guardar la salida: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs > .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medidas-libres.txt`. Esperado: código 0; el fichero tiene 20 filas de repetición, `máximo`, `mediana` y la línea `O1:`; `git status --short src` vacío.
- [ ] **Step 4: Commit de la task** — uno solo, `docs(sdd): medir libres con 1.000 reservas (spike 0031)`.

### Task 2 — Recomendación en `research.md`

**Tras**: Task 1
**Modelo**: la sesión Native (Sonnet, effort medium); sin despacho.

**Evidencia**: O1 · `medidas-libres.txt` y `medir-libres.mjs` · filas de `research.md` §2 (O1) y §3 (aguante).

**Superficies**: docs
**Verificación**: `node --test` → `ℹ fail 0` (la suite del proyecto sigue verde: la task no toca código) y `git diff --stat main -- src test` sin líneas.
**Se prueba en la aplicación**: no, porque investigación: no cambia ninguna aplicación.

**Interfaces**:
- Consume: `medidas-libres.txt` de la Task 1 (carga, 20 filas, `máximo`, `mediana`, `O1:`) y la plantilla `research-template.md` de `sdd-templates`.
- Produce: `research.md` en la carpeta de la spec, con `status: draft`, y, si la medida deja un arreglo a la vista, la fila del roadmap por abrir.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/research.md`; modificar `ROADMAP.md` solo si §5 sale con un cambio.

- [ ] **Step 1: Implementación** — `research.md` calcado de la plantilla, con frontmatter `feature: 0031`, `spec: ./spec.md`. §1: la pregunta de la spec. §2: una fila, `O1 — libres con 1.000 reservas responde en < 50 ms`, estado `cumple`, `no cumple tal como se definió` o `no medido` según la línea `O1:` de `medidas-libres.txt`, con el máximo y la mediana en «Detalle» y `medidas-libres.txt` en «Evidencia». §3: la carga de la spec y las 20 filas copiadas de la salida; si `heapUsed` crece de la primera a la última, se dice aunque cumpla el umbral. §4: elegida, descartadas y por qué, solo con filas medidas, respondiendo a «Si `libres` necesita una caché antes de abrirlo a toda la oficina». §5: «nada» o el cambio con su fila del roadmap por abrir.
- [ ] **Step 2: Build** — no aplica. Esperado: `research.md` sin bloques de ayuda (`>`) de la plantilla.
- [ ] **Step 3: Verificación** — `node --test` y `git diff --stat main -- src test`. Esperado: `ℹ fail 0`; el diff sin líneas.
- [ ] **Step 4: Commit de la task** — uno solo, `docs(sdd): recomendación del spike 0031 sobre la caché de libres`.

---

## Estimación y esfuerzo

- Tipo: chore
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,75 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks, un script de ~40 líneas y un documento; incertidumbre baja (medida local, sin dependencias); sin referencia de estimation-log todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su fila en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — «`libres` con 1.000 reservas responde en < 50 ms» → Task 1, línea `O1:` y `máximo` de `medidas-libres.txt`; Task 2, fila O1 de `research.md` §2. ✓
- Peor carga — «1.000 reservas activas en la misma franja, cargadas con `seed`» → Task 1, `seed(bookings, 1000)` y la cabecera `reservas: 1000` de la salida; `seed` no existe en el repo, decisión 3. ✓
- Pregunta — «¿Aguanta `libres` 1.000 reservas?» → Task 2, `research.md` §1 y §2. ✓
- Decisión que desbloquea — «si `libres` necesita una caché antes de abrirlo a toda la oficina» → Task 2, `research.md` §4 (elegida, descartadas). ✓
- Validación «agente — son medidas» → Task 1, salida del script y Task 2, filas de §2 y §3. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus, `libres` distinto de `Sur` bajo carga → Task 1, `assert.equal` previo al cronometraje. ✓
- Review Focus, repetición en frío lenta → Task 1, `máximo` y veredicto de `O1:`. ✓
- Review Focus, memoria creciente → Task 1, columna `heapUsed`; Task 2, §3. ✓
