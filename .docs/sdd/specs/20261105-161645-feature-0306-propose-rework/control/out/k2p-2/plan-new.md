---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: done
created: 2026-11-06
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: la única task la hace el hilo principal (Native), en gama media (Sonnet, effort medium): el plan trae el script entero en firmas y asserts. La revisión final de rama no se quita: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, porque un spike es siempre Native (y `sdd-kit.json` fija `native`).
3. **Cómo se carga la peor carga sin tocar producción**: `bookings` es privado en `src/app.js` y no existe ningún `seed`. El script lee `src/app.js`, sustituye la línea que declara `bookings` por las 1.000 reservas y lo importa desde un fichero temporal del SO. Se mide así el `freeRooms` y el `run('libres', …)` reales, sin exportar nada ni editar `src/`.
4. **Distribución de las 1.000 reservas**: todas activas, en la franja `10:00-12:00`; las 999 primeras en `Norte` (días distintos) y la última en `Sur`. Así `Sur` recorre las 1.000 antes de encontrar su reserva: es el recorrido más largo que permite `some`. `libres` devuelve cadena vacía.
5. **Qué es una repetición**: 20 llamadas seguidas a `run('libres', ['10:00-12:00'])` en el mismo proceso, cada una cronometrada con `performance.now()`, con el `heapUsed` tras cada una. La repetición 1 es la fría y se queda en la tabla.
6. **Fuera de la medida**: el arranque de `node` por la CLI no entra; el umbral de la spec es el de la respuesta de `libres` con la carga ya cargada. `research.md` lo dice.
7. **Coste estimado**: ~1 h, sin subagentes, tokens de una sesión corta.

Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: medir cuánto tarda `libres` con 1.000 reservas activas y dejar la tabla de medidas y la recomendación sobre la caché.

**Architecture**: un script de medición en la carpeta de la spec que carga una copia sembrada de `src/app.js` y cronometra `run('libres', …)`. Su salida en bruto y `research.md` se quedan en la carpeta; no se toca código de producción.

**Tech Stack**: Node 22, `node:perf_hooks`, `node:test` solo para el gate; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque 1 sola task, un spike es siempre Native y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato; el script vive en la carpeta de la spec y `src/` no cambia.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); clean code. La constitution del proyecto no tiene artículo de calidad, rige esta regla.
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Peor carga, literal de la spec: «1.000 reservas activas en la misma franja, cargadas con `seed`»; umbral O1: `libres` con 1.000 reservas responde en < 50 ms.
- Sin dependencias externas (`tech-stack.md`); `src/` no se modifica.
- `scripts/lint.mjs` solo mira `src/app.js` (tabuladores): el script nuevo usa espacios.

### De proceso

- Spike: no deja código de producción; lo que salga va a su propia fila del roadmap, no a este spike.
- Native: sesión en gama media; commits según `commit-milestones.md` (apertura, una task, cierre).
- Atribución de commits: la del kit (`Co-Authored-By`).

## Review Focus

- La primera llamada (fría) es la más lenta y no debe esconderse en un promedio → se informa su tiempo aparte, y el máximo de las 20 · Task 1, `bench-libres.mjs` imprime `frio`, `max` y `mediana`.
- Una carga mal sembrada (menos de 1.000 reservas activas, o fuera de la franja) daría una medida optimista → el script aborta si no hay 1.000 activas en la franja · Task 1, `Rechaza_una_carga_con_menos_de_1000_activas_en_la_franja`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y su salida; sin librerías de benchmark.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `src/` no se toca.
- [x] **Constitution check**: tests antes que código (el aborto por carga mal sembrada tiene su test RED); castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `bench-libres.mjs` — siembra la carga, mide y escribe la salida en bruto; exporta `seed()` y `medir()`.
- `bench-libres.test.mjs` — test de la siembra (`node --test` solo lo recoge si se pide su ruta).
- `evidencia-libres.txt` — salida en bruto de una ejecución del script.
- `research.md` — con la plantilla `research-template.md`: objetivos, aguante, recomendación.

**Modificar**: nada.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción.
- `test/` y `scripts/lint.mjs` — la suite del proyecto no cambia.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La sustitución textual de `bookings` deja de coincidir si cambia `src/app.js` | Baja | El script falla alto | El script aborta con mensaje si no encuentra la línea; no mide en silencio |
| 20 llamadas de µs dan ruido de reloj | Media | Cifras poco estables | Se informa la mediana y el máximo, y se repite la ejecución completa una vez para confirmar el orden de magnitud |

### 1.8 Rollout

Directo: no llega a producción; deja `research.md`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: hilo principal en Native, Sonnet con effort medium: el plan trae firmas y asserts.
**Evidencia**: O1 · `evidencia-libres.txt` (salida en bruto) sacada con `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/bench-libres.mjs`, ambos en la carpeta de la spec · fila O1 de `research.md`, calcada de `research-template.md`, con la tabla de aguante (§3) y la recomendación (§4); §5 «Lo que sale» dice si la medida deja un arreglo, con su fila de roadmap por abrir.

**Superficies**: tooling · docs
**Verificación**: `node --test .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/bench-libres.test.mjs` → `ℹ fail 0` · `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/bench-libres.mjs` → sale con código 0 y su última línea es `ok: 20 repeticiones`.
**Se prueba en la aplicación**: no, porque es una investigación sin cambio en la aplicación.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd: string, params: string[]): string` (con `run('libres', ['10:00-12:00'])` devuelve los nombres de las salas libres separados por `, `); la línea `const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];`, que `seed()` sustituye.
- Produce: `seed(source: string, count = 1000): string` — devuelve el código de `src/app.js` con `bookings` sustituida por `count` reservas `{ room, day: 'd<i>', slot: '10:00-12:00', status: 'active' }` (las `count - 1` primeras en `Norte`, la última en `Sur`); lanza `Error('seed: no encuentro la declaración de bookings')` si no hay línea que sustituir. `medir(run, repeticiones = 20): { tiempos: number[], heap: number[] }`, en ms y bytes.

**Ficheros**: crear `bench-libres.mjs`, `bench-libres.test.mjs`, `evidencia-libres.txt`, `research.md` (todos en la carpeta de la spec).

- [ ] **Step 1: Test RED de la siembra** — en `bench-libres.test.mjs`, con `node:test` y `node:assert/strict`:
  - `Siembra_1000_activas_en_la_franja`: `const code = seed(readFileSync('src/app.js', 'utf8'))`; se importa desde un `.mjs` temporal (`os.tmpdir()`, `data:` no vale por el `import.meta`); `run('libres', ['10:00-12:00'])` devuelve `''` (ambas salas ocupadas).
  - `Rechaza_una_carga_distinta_de_1000`: `assert.throws(() => seed('const otra = [];'), /no encuentro la declaración de bookings/)`.
  - `Sur_recorre_las_1000`: en el código sembrado, la reserva de `Sur` es la de índice 999 (`assert.match(code, /room: 'Sur'[^}]*\}\s*\]/)`).
  Esperado en RED: fallan los tres (`seed` no existe).
- [ ] **Step 2: Implementación** — `seed` y `medir` con las firmas de arriba en `bench-libres.mjs`; al ejecutarlo como programa: lee `src/app.js`, siembra, escribe el código en un temporal, lo importa, sin llamada de calentamiento (la primera es la fría y se informa), 20 repeticiones con `performance.now()` y `process.memoryUsage().heapUsed`, e imprime la tabla `repetición | ms | heapUsed`, y `frio`, `mediana`, `max`, `umbral O1: < 50 ms → cumple | no cumple tal como se definió`, y la línea final `ok: 20 repeticiones`. Sin `global.gc` ni tamaños distintos de 1.000.
- [ ] **Step 3: Verificación** — el test en verde (`ℹ fail 0`), y el script con su salida guardada: `node …/bench-libres.mjs | tee …/evidencia-libres.txt` (en Bash, con `NO_COLOR=1`); repetir la ejecución una segunda vez y comprobar que el orden de magnitud coincide; si no, decirlo en `research.md`.
- [ ] **Step 4: `research.md`** — copiar `research-template.md`; §2 una fila O1 con estado `cumple` | `no cumple tal como se definió` | `no medido` según la salida, con la cifra y `evidencia-libres.txt`; §3 con las 20 filas y, si el `heapUsed` crece, decirlo; §4 solo con filas medidas (recomendar caché o no, y si arrancar `libres` a toda la oficina); §5 con el arreglo que deje a la vista, si lo hay, con su fila de roadmap por abrir. Dejar escrito qué no entra en la medida (arranque de `node`).
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión (`sdd-implement/references/commit-milestones.md`): `docs(spike-0031): medidas de libres con 1.000 reservas`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 1 task, un script corto y un informe; sin calibración previa (`estimation.md` no tiene notas)
- Confianza: media — lo incierto es la estabilidad de cifras de µs

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (O1): `research.md` §2 tiene la fila O1 con su estado y `evidencia-libres.txt`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, `research.md` §4 con la recomendación. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` con la mediana, el máximo y el frío de `evidencia-libres.txt`. ✓
- Peor carga: 1.000 activas en la misma franja con `seed` → Task 1, `Siembra_1000_activas_en_la_franja` y `Rechaza_una_carga_distinta_de_1000`. ✓
- Decisión que desbloquea (si `libres` necesita caché antes de abrirlo a toda la oficina) → Task 1, `research.md` §4 «Elegida». ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: primera llamada fría → Task 1, `bench-libres.mjs` imprime `frio`, `mediana` y `max`; carga mal sembrada → `Rechaza_una_carga_con_menos_de_1000_activas_en_la_franja`. ✓
