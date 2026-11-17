---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task** — Native: las dos tasks las hace la sesión, sin despacho. La revisión final de rama no se quita: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución** — native, porque un spike siempre lo es (la spec lo fija); además son 2 tasks encadenadas por un fichero de salida, un error lo caza la revisión de la task y el plan cabe en un contexto.
3. **Cómo se siembra la carga** — `src/app.js` no exporta `bookings` ni tiene `seed`, y el spike no deja código de producción. El script lee `src/app.js` como texto, sustituye el literal inicial de `bookings` por las 1.000 reservas y carga esa copia desde `os.tmpdir()`. La medida es del `freeRooms` real, no de una reimplementación.
4. **Forma de la peor carga** — la spec dice «1.000 reservas activas en la misma franja» y no dice en qué sala. Con dos salas, las 1.000 van en `Norte` en días distintos (`d1`…`d1000`), franja `10:00-12:00`: `Norte` corta en la primera y `Sur` recorre las 1.000 enteras, que es el recorrido más largo posible de `some`.
5. **Qué es una repetición del aguante** — una llamada a `run('libres', ['10:00-12:00'])` cronometrada con `performance.now()`, con `process.memoryUsage().heapUsed` tras ella. 12 repeticiones seguidas (≥ 10) en el mismo proceso. Fuera de alcance: el arranque del proceso, porque el CLI no puede cargar la semilla.
6. **Umbral** — O1 cumple si las 12 repeticiones salen < 50 ms; se informa también la mediana y el máximo. Si el heap crece de forma sostenida, se dice en la fila aunque el umbral se cumpla.
7. **Riesgo alto** — ninguno: no toca producción. **Coste estimado**: ~1,5 h, sin despacho de subagentes.
8. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Dejar medido, con salida en bruto y `research.md`, si `libres` con 1.000 reservas activas responde en < 50 ms, para decidir si necesita caché.

**Architecture**: Un script de medida en la carpeta de la spec que carga una copia sembrada de `src/app.js` y cronometra `run('libres', …)`. La salida en bruto va a un fichero y `research.md` la resume fila a fila. No se toca `src/`.

**Tech Stack**: Node ≥ 20, ES modules, `node:test` para el gate; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque es un spike (siempre Native), 2 tasks encadenadas por el fichero de medidas, un error lo caza la revisión de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: un script suelto en la carpeta de la spec y un `research.md`.

## Restricciones globales

### De código

- Node ≥ 20, sin dependencias externas (`architecture.md`).
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- No se modifica `src/` ni `test/`: el spike no deja código de producción.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Carga: 1.000 reservas activas en la misma franja, cargadas con `seed`; objetivo O1: `libres` responde en < 50 ms.

### De proceso

- Native; sin despacho de subagentes en las tasks.
- Commits con la convención del proyecto (`tipo(ámbito): …`, en castellano), terminados con la atribución `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Un commit por hito: apertura, una por task y cierre.

## Review Focus

- Con la semilla, `libres` devuelve solo `Sur` (`Norte` ocupada en la franja) → la medida sale de una carga que de verdad ocupa la franja, no de una vacía · Task 1, `bench-libres.mjs` aborta con código 1 si la respuesta no es `Sur` o si la copia sembrada no tiene 1.000 reservas activas
- Un `libres` más lento que 50 ms en alguna repetición → `no cumple tal como se definió`, aunque la mediana pase · Task 2, fila O1 de `research.md`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento; nada más.
- [x] **YAGNI gate**: sin abstracciones; el script es de un solo uso.
- [x] **Brownfield gate**: no cambia `src/`; retrocompatible por construcción.
- [x] **Constitution check**: art. 2 (gate de cierre `node --test` entero en verde) en §3; art. 4 castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `bench-libres.mjs` — siembra la copia de `src/app.js`, mide las 12 repeticiones e imprime una línea por repetición.
- `libres-medidas.txt` — salida en bruto del script, tal cual.
- `research.md` — calcado de `research-template.md`: objetivos, aguante, recomendación y lo que sale.
- `tasks.md` — registro vivo de las 2 tasks.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción; se carga como copia sembrada.
- `test/` — no hay comportamiento nuevo que testear; la evidencia es la medida.
- `scripts/lint.mjs` — solo mira `src/app.js`.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El literal de `bookings` en `src/app.js` cambia y la sustitución no encuentra nada | Baja | Medida sobre carga vacía | El script aborta (código 1) si la copia no queda con 1.000 reservas activas o si `libres` no devuelve `Sur` |
| Ruido de calentamiento del motor en la primera repetición | Media | Una repetición atípica | Se informan las 12 sin descartar ninguna; el máximo cuenta para el umbral |

### 1.8 Rollout

Directo: no llega a producción; lo que sale va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: Native: la sesión (gama media, effort medium); sin despacho.
**Evidencia**: O1 · salida en bruto `libres-medidas.txt` y el script `bench-libres.mjs`, ambos en la carpeta de la spec · fila O1 y tabla de aguante de `research.md` (Task 2).

**Superficies**: tooling
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/bench-libres.mjs` → sale con código 0 e imprime 12 líneas `rep <n> <ms> ms heap <bytes>` y una final `semilla 1000 reservas activas · libres = Sur`.
**Se prueba en la aplicación**: no, porque es un spike sin cambio visible: la evidencia es la medida.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd, params)` exportado y el literal `const bookings = [ … ];` (una reserva es `{ room, day, slot, status }`; franja `'10:00-12:00'`, estado `'active'`).
- Produce: `libres-medidas.txt`, una línea por repetición `rep <n> <ms con 3 decimales> ms heap <bytes>` más la línea final de la semilla.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/bench-libres.mjs` y `libres-medidas.txt`

- [ ] **Step 1: Implementación** — `bench-libres.mjs`:
  - `seedBookings(count)` → `Array<{ room: 'Norte', day: 'd<i>', slot: '10:00-12:00', status: 'active' }>` con `i` de 1 a `count`.
  - `loadSeeded(count)` → lee `src/app.js` como texto, sustituye `const bookings = [...];` por las reservas de `seedBookings`, la escribe en `os.tmpdir()` como `.mjs` y la importa; devuelve `run`. Sin `command` en `argv` el módulo no imprime nada.
  - Antes de medir, aborta con `process.exit(1)` si el número de `status: 'active'` de la copia no es 1.000 o si `run('libres', ['10:00-12:00'])` no devuelve `Sur`.
  - 12 repeticiones seguidas: `performance.now()` alrededor de `run('libres', ['10:00-12:00'])` y `process.memoryUsage().heapUsed` tras ella; imprime `rep <n> <ms toFixed(3)> ms heap <bytes>`.
  - Línea final `semilla 1000 reservas activas · libres = Sur`.
- [ ] **Step 2: Build** — no aplica (sin compilación).
- [ ] **Step 3: Verificación** — ejecutar el comando de «Verificación» redirigiendo la salida a `libres-medidas.txt` (`> …/libres-medidas.txt`). Esperado: código 0, 13 líneas, ninguna medida inventada a mano. Corre otra vez con la semilla rota a propósito (p. ej. `count` 999) para ver que aborta con código 1, y deshazlo.
- [ ] **Step 4: Commit de la task** — `chore(spike-0031): medir libres con 1.000 reservas`, uno solo al quedar limpia su revisión.

### Task 2 — Escribir `research.md`

**Tras**: Task 1
**Modelo**: Native: la sesión (gama media, effort medium); sin despacho.
**Evidencia**: O1 · `research.md` cita `libres-medidas.txt` fila a fila · calcado de `research-template.md` de `sdd-templates`.

**Superficies**: docs
**Verificación**: `node --test` → `ℹ fail 0` y `node scripts/lint.mjs` → `lint: sin hallazgos`; más el cotejo manual de que cada cifra de `research.md` está en `libres-medidas.txt`.
**Se prueba en la aplicación**: no, porque es un spike sin cambio visible.

**Interfaces**:
- Consume: `libres-medidas.txt` de la Task 1 (12 líneas `rep <n> <ms> ms heap <bytes>` y la de la semilla).
- Produce: `research.md` con §2 Objetivos (fila O1: `cumple`, `no cumple tal como se definió` o `no medido`), §3 Aguante (carga de la spec y las 12 repeticiones con tiempo y heap acumulado), §4 Recomendación (si `libres` necesita caché, o «no seguir»; solo cita filas medidas) y §5 Lo que sale (cambio → fila del roadmap por abrir, o `nada`).

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/research.md`

- [ ] **Step 1: Implementación** — rellenar `research.md` con la frontmatter `id`, `title`, `spec: ./spec.md`, `status: draft`, `created: 2026-11-12`, `timeboxed: 2h`. En §2 el estado de O1 sale de comparar el máximo de las 12 repeticiones con 50 ms. En §3 la carga es «1.000 reservas activas en la misma franja, cargadas con `seed`» y, si el heap crece de forma sostenida, la fila lo dice. En §4 la decisión que desbloquea la spec: si `libres` necesita una caché antes de abrirlo a toda la oficina. Aviso explícito de que la medida es de una llamada en proceso y no incluye el arranque del CLI.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; esperado `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — `docs(spike-0031): research de libres con 1.000 reservas`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 2 tasks pequeñas, un script de unas 40 líneas y un documento; incertidumbre baja, sin referencia previa en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su estado en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ¿Aguanta `libres` 1.000 reservas? → Task 1, las 12 líneas de `libres-medidas.txt`; Task 2, fila O1 de `research.md`. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, tiempo por repetición; Task 2, estado de O1 contra el máximo. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, la semilla y su comprobación previa (1.000 activas, `libres = Sur`). ✓
- Decisión que desbloquea (¿caché?) → Task 2, §4 Recomendación. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: semilla efectiva → Task 1, comprobación previa del script; umbral por máximo → Task 2, fila O1. ✓
