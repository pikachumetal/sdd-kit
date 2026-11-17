---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task** — Task 1 y Task 2 con la sesión en gama media (Sonnet, effort medium): el plan trae las firmas y los umbrales y no hay que interpretar prosa. La revisión final de rama va con el modelo de `sdd-verify`, no con esta política.
2. **Ejecución** — Native, porque un spike lo es siempre (con `execution: native` fijado en `sdd-kit.json` además): 2 tasks encadenadas por el arnés, un error lo caza la salida en bruto de su task y el plan cabe en un contexto.
3. **`seed` no existe en el repo** — la spec dice «cargadas con `seed`» y no hay ningún `seed` en `src/` ni en `scripts/`. `seed` es la función del arnés de la Task 1 (carpeta de la spec); no se toca `src/` (el spike no deja código de producción).
4. **Cómo se carga `bookings`** — `bookings` no se exporta de `src/app.js`. El arnés copia `src/app.js` a una carpeta temporal del SO, le añade `export { bookings };` y lo importa desde allí: se mide el código real sin modificarlo.
5. **Qué es «la peor carga»** — la spec fija 1.000 reservas activas en la misma franja y no dice de qué sala. `seed` deja 1.000 en total (la inicial incluida) todas en `Norte`, franja `10:00-12:00`, días distintos: `Sur` recorre las 1.000 sin encontrar coincidencia (el recorrido más largo de `some`) y `Norte` corta en la primera.
6. **Qué cuenta como una medida** — una medida es una llamada a `run('libres', ['10:00-12:00'])` con `performance.now()`. La primera llamada (fría) se mide aparte y también cuenta para O1: `cumple` solo si todas las medidas, la fría incluida, bajan de 50 ms (se toma el máximo, no la mediana).
7. **Aguante** — 12 repeticiones seguidas de 200 llamadas cada una, en el mismo proceso y con `node --expose-gc`; recurso acumulado = `heapUsed` tras `gc()` al acabar cada repetición.
8. **Coste estimado** — 1,25 h en total (spec y plan 0,5 h + implementación 0,75 h), sin subagentes; timebox del spike: 2 h. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar medido, con la salida en bruto en la carpeta de la spec, si `libres` responde en < 50 ms con 1.000 reservas activas en la misma franja, y recomendar si necesita una caché.

**Architecture**: un arnés de medición (`harness.mjs`) que carga una copia de `src/app.js` y siembra la carga, y un script (`measure-libres.mjs`) con dos modos: `o1` (la medida de O1) y `aguante` (≥ 10 repeticiones con el heap). Todo vive en la carpeta de la spec; `src/` no cambia.

**Tech Stack**: Node 22, sin dependencias externas (`tech-stack.md`); `node:perf_hooks`, `node:fs`, `node:os`.

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike es siempre Native: 2 tasks encadenadas por el arnés, un error lo caza la salida en bruto de su task y el plan cabe en un contexto · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el arnés vive fuera de `src/` y no lo importa nadie.

## Restricciones globales

### De código

- Node 22 sin dependencias externas: nada en `package.json`.
- `src/` no se modifica: el spike no deja código de producción.
- Los ficheros del arnés no se llaman `*.test.*`, `*-test.*`, `test-*` ni `test.*`, para que `node --test` no los recoja.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Texto de salida y de los documentos en castellano.

### De proceso

- Política de modelos: gama media (Sonnet, effort medium) para las dos tasks; sin `fable` ni `opus xhigh`.
- Modo de ejecución: Native (`execution: native` en `sdd-kit.json`).
- Commits con la atribución que fija la sesión; uno por task al quedar limpia su revisión.

## Review Focus

- La llamada fría (JIT) puede pasar de 50 ms aunque la mediana no → se mide aparte y entra en O1 → Task 1, `o1` imprime `fría=` y el máximo la incluye.
- Una siembra que no deja 1.000 activas en la franja daría una medida de otra carga → el arnés aborta con salida 1 si `bookings` no tiene 1.000 reservas activas en la franja o si `libres` no devuelve `Sur` · Task 1, comprobación de siembra de `o1`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos ficheros, sin dependencias.
- [x] **YAGNI gate**: ninguna abstracción con menos de 3 usos; solo la carga peor, sin variantes.
- [x] **Brownfield gate**: `src/` intacto.
- [x] **Constitution check**: tests antes que código no aplica a un spike (no hay código de producción); gate de cierre `node --test` entero en verde; texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

Todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/` (`$SPEC` abajo).

**Crear**:

- `$SPEC/harness.mjs` — carga la copia de `src/app.js` y siembra la carga.
- `$SPEC/measure-libres.mjs` — CLI con los modos `o1` y `aguante`; escribe la evidencia.
- `$SPEC/evidencia-o1.txt` — salida en bruto de O1.
- `$SPEC/evidencia-aguante.txt` — salida en bruto del aguante.
- `$SPEC/research.md` — del `research-template.md`: objetivos, aguante, recomendación.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción; se mide una copia.
- `test/` y `scripts/lint.mjs` — el gate no cambia.

### 1.2 a 1.5

No aplican (sin datos, migraciones, API ni UX).

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El ruido de la máquina da un máximo espurio > 50 ms | Media | Un falso `no cumple` | Se registran todas las medidas y el máximo; si un valor aislado rompe el umbral, se repite `o1` y se dice en `research.md` |
| `libres` tarda microsegundos y la medida cae en la resolución del reloj | Alta | Cifras `0.00` poco informativas | 200 llamadas por repetición: se reporta mediana y máximo por llamada con `performance.now()` (resolución sub-ms) |

### 1.8 Rollout

Directo: no hay nada que desplegar. Lo que salga (p. ej. una caché) va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Arnés y medida de O1

**Tras**: —
**Modelo**: sesión en gama media (Sonnet, effort medium); Native, sin despacho.
**Evidencia**: O1 · `$SPEC/evidencia-o1.txt`

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure-libres.mjs o1` → sale con 0 y su última línea es `O1 medido: max=<x> ms (umbral 50 ms)`
**Se prueba en la aplicación**: no, porque es una medición: el spike no cambia ninguna aplicación.

**Interfaces**:
- Consume: nada. De `src/app.js`: `run(cmd: string, params: string[]): string` (exportada) y `bookings: Array<{room, day, slot, status}>` (privada; el arnés la exporta en la copia). `run('libres', ['10:00-12:00'])` devuelve los nombres de las salas libres separados por `, `.
- Produce:
  - `harness.mjs`: `export const SLOT = '10:00-12:00'`; `export async function loadApp(): Promise<{ run, bookings }>` (copia `src/app.js` a un directorio de `os.tmpdir()` como `app.mjs` con `export { bookings };` añadido, y lo importa); `export function seed(bookings, total = 1000): void` (añade reservas `{ room: 'Norte', day: 'd' + i, slot: SLOT, status: 'active' }` hasta que `bookings.length === total`).
  - `measure-libres.mjs o1`: escribe `evidencia-o1.txt` con una línea `fría=<ms>`, una línea por llamada medida (200 llamadas tras la fría) y la última `O1 medido: max=<x> ms (umbral 50 ms)`, donde `max` incluye la fría. Sale con 1 si la comprobación de siembra falla.

**Ficheros**: crear `$SPEC/harness.mjs`, `$SPEC/measure-libres.mjs`, `$SPEC/evidencia-o1.txt`

- [ ] **Step 1: Implementación** — `harness.mjs` con las dos funciones de Interfaces. En `measure-libres.mjs o1`: cargar con `loadApp()`, sembrar, comprobar que hay 1.000 reservas activas en `SLOT` y que `run('libres', [SLOT])` devuelve `Sur` (si no, mensaje en stderr y salida 1), medir la llamada fría y 200 más con `performance.now()` y escribir la evidencia en bruto.
- [ ] **Step 2: Build** — no aplica (sin build en el proyecto).
- [ ] **Step 3: Verificación** — ejecutar el comando de «Verificación». Esperado: salida 0, `evidencia-o1.txt` con 202 líneas (fría, 200 medidas, resumen) y la última `O1 medido: max=<x> ms (umbral 50 ms)`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `chore(spike-0031): arnés y medida de O1`.

### Task 2 — Aguante y research.md

**Tras**: Task 1
**Modelo**: sesión en gama media (Sonnet, effort medium); Native, sin despacho.
**Evidencia**: O1 (aguante) · `$SPEC/evidencia-aguante.txt`

**Superficies**: tooling · docs
**Verificación**: `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure-libres.mjs aguante` → sale con 0 y su última línea es `Aguante: 12 repeticiones; max=<x> ms; heap <a> → <b> MB`
**Se prueba en la aplicación**: no, porque es una medición: el spike no cambia ninguna aplicación.

**Interfaces**:
- Consume: de la Task 1, `SLOT`, `loadApp()` y `seed(bookings, total)` de `harness.mjs`, y la misma comprobación de siembra de `o1`; `evidencia-o1.txt` para rellenar la fila de O1.
- Produce: `measure-libres.mjs aguante`: escribe `evidencia-aguante.txt` con una línea por repetición `rep=<n> mediana=<ms> max=<ms> heap=<MB>` (12 repeticiones de 200 llamadas, `global.gc()` antes de leer `process.memoryUsage().heapUsed`) y la última `Aguante: 12 repeticiones; max=<x> ms; heap <a> → <b> MB`. Y `research.md`.

**Ficheros**: modificar `$SPEC/measure-libres.mjs`; crear `$SPEC/evidencia-aguante.txt`, `$SPEC/research.md`

- [ ] **Step 1: Implementación** — añadir el modo `aguante` a `measure-libres.mjs` (sin `--expose-gc` sale con 1 y lo dice). Ejecutarlo y, con las dos evidencias, redactar `research.md` del `research-template.md` (sin bloques de ayuda): §1 la pregunta de la spec; §2 una fila para O1 con estado `cumple`, `no cumple tal como se definió` o `no medido` según `evidencia-o1.txt` y `evidencia-aguante.txt`, con sus cifras; §3 la tabla de las 12 repeticiones con la carga de la spec, diciendo si el heap crece; §4 la recomendación (¿caché antes de abrir `libres` a toda la oficina?) citando solo filas medidas; §5 lo que sale (`nada`, o el cambio y su fila de roadmap).
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — ejecutar el comando de «Verificación». Esperado: salida 0, `evidencia-aguante.txt` con 12 líneas `rep=` y el resumen; `research.md` con las cifras de ambas evidencias.
- [ ] **Step 4: Commit de la task** — `docs(spike-0031): aguante de libres y research.md`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,75 h
- Base de la estimación: 2 tasks, un arnés de ~40 líneas y dos ejecuciones; incertidumbre baja (la medida en sí es de milisegundos), el grueso es redactar `research.md`; sin referencia en `estimation-log.md` para spikes.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: O1 con su estado y cifra en `research.md` §2, con `evidencia-o1.txt` y `evidencia-aguante.txt` como salida en bruto
- [ ] Spec satisfecha: la pregunta, O1, la peor carga confirmada y la decisión que desbloquea tienen su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 2, `research.md` §4 con la recomendación. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, `evidencia-o1.txt` (máximo, fría incluida) y Task 2, `evidencia-aguante.txt`; fila de O1 en `research.md` §2. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, `seed` y la comprobación de siembra (1.000 activas en la franja, `Sur` libre). ✓ (decisión 3: `seed` es del arnés)
- Decisión que desbloquea: «si `libres` necesita una caché» → Task 2, `research.md` §4. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: llamada fría → Task 1, línea `fría=` incluida en el máximo. ✓
- Review Focus: siembra incorrecta → Task 1, comprobación de siembra de `o1` (salida 1). ✓
