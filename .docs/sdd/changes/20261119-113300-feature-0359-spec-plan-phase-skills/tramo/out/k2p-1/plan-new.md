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

1. **`seed` no existe en el repo** — la spec habla de reservas «cargadas con `seed`», pero `src/app.js` no tiene ningún `seed` y `bookings` es un `const` interno sin punto de entrada. Un spike no deja código de producción, así que `seed` es una función del script de medida: copia `src/app.js` a un módulo temporal con `bookings` sustituido y lo importa. `src/` no se toca. ⚠ Si la spec quería un comando `seed` en la app, es otra feature.
2. **Carga concreta**: las 1.000 reservas son `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }` (mismo día y franja, todas de Norte). La spec solo fija «1.000 activas en la misma franja»; con todas en Norte, `libres` recorre las 1.000 para decidir que Sur está libre (el recorrido más largo).
3. **Qué se mide**: la llamada en proceso `run('libres', ['10:00-12:00'])`, no el comando de consola de punta a punta (el arranque de Node no es la respuesta de `libres`). Queda dicho en `research.md`.
4. **Aguante**: 12 repeticiones seguidas (la plantilla pide ≥ 10), con `heapUsed` tras cada una. El veredicto de O1 usa el máximo de las 12, no la media; la primera (en frío) se registra aparte pero cuenta.
5. **Ejecución**: native, fijado en `sdd-kit.json` (y un spike siempre es Native). Una sola task: medir y escribir `research.md` comparten la misma salida en bruto y no hay nada que un revisor pueda aprobar por separado.
6. **Modelo**: la sesión nativa en gama media (Sonnet, effort medium); es mecánico, el plan ya fija las firmas y los valores.
7. **Apertura**: ya está en el commit `fbf20f5` (spec). `plan.md` va en el commit de la Task 1.
8. **Gate de cierre**: `node --test && node scripts/lint.mjs`, literal de `operations.md` §Testing.
9. **Riesgos altos**: ninguno; no hay código de producción. **Coste**: ~1,5 h, sin subagentes en las tasks.
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Medir si `libres` responde en < 50 ms con 1.000 reservas activas en la misma franja y dejar la recomendación (¿caché sí o no?) en `research.md`.

**Architecture**: Un script de medida en la carpeta de la spec carga las 1.000 reservas sobre una copia temporal de `src/app.js`, mide 12 llamadas seguidas a `run('libres', …)` y vuelca la salida en bruto. `research.md`, calcado de su plantilla, resume esas filas.

**Tech Stack**: Node 22 (`engines >=20`), módulos ES, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — el spike no añade módulo, dependencia ni contrato; `src/app.js` queda intacto.

## Restricciones globales

### De código

- Tests antes que código (constitution, art. 2); aquí, la comprobación de la carga va antes que la medida.
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Node 22, sin dependencias externas (`architecture.md`); `engines >=20` en `package.json`.
- Un spike no deja código de producción: `src/` queda sin cambios (`git diff --stat -- src` vacío).
- Sin tabuladores en `src/app.js` (lo comprueba `scripts/lint.mjs`).
- Objetivo O1 y peor carga, literales de la spec: «`libres` con 1.000 reservas responde en < 50 ms» · «1.000 reservas activas en la misma franja, cargadas con `seed`».
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Native: la sesión implementa todas las tasks; la revisión final de `sdd-verify` revisa la rama.
- La constitution no declara política de modelos: gama media como suelo.
- Commits: `docs(sdd):` / `feat:` en castellano, referenciando 0031; acaban con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- La carga no se aplica (cambia el literal de `bookings` en `src/app.js` y el reemplazo no casa) → el script falla con código 1 antes de medir, no mide la reserva única por defecto · Task 1, comprobación `seed` falla si no hay 1.000 activas en la franja
- Menos o más de 1.000 reservas activas cargadas → igual: código 1 y mensaje con el recuento real · Task 1, comprobación del recuento
- Primera llamada en frío mucho más lenta que las demás → cuenta para el máximo y se ve en su fila, no se oculta con la media · Task 1, línea `rep 1` en la salida
- Memoria que crece entre repeticiones aunque el tiempo cumpla → se dice en `research.md` §3 con la columna de `heapUsed` · Task 1, columna `heapUsed` de `libres-raw.txt`
- Umbral superado (≥ 50 ms) → O1 es `no cumple tal como se definió` y la recomendación es caché, sin darlo por cumplido · Task 1, línea final `O1: no cumple` y fila de `research.md`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script, una task, sin código en `src/`.
- [x] **YAGNI gate**: nada se abstrae; una función `seed` con un solo uso.
- [x] **Brownfield gate**: no se toca `src/`; sin refactor.
- [x] **Constitution check**: tests antes que código (art. 2), castellano (art. 4), gate de cierre `node --test` entero.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todos en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure-libres.mjs` — carga las 1.000 reservas, mide 12 llamadas y escribe la salida en bruto.
- `libres-raw.txt` — salida en bruto del script, sin editar.
- `research.md` — calcado de la plantilla de research: objetivos, aguante, recomendación.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — es el sistema medido; el spike no deja código de producción.
- `test/` y `scripts/lint.mjs` — no hay comportamiento nuevo que probar ni regla de lint nueva.
- `ROADMAP.md` — lo que salga de la medida se apunta como fila por abrir en `research.md` §5; `sdd-archive` la lleva.

### 1.2 a 1.5

No aplican: sin datos persistentes, migraciones, API ni UX.

### 1.6 Dependencias

Ninguna. Mide `freeRooms` de `src/app.js` tal como está en `main`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Medir una carga distinta de la confirmada | media | alto | El script comprueba el recuento antes de medir y sale con 1 si no es 1.000 |
| Ruido de la máquina al cronometrar | media | medio | 12 repeticiones; veredicto con el máximo, no la media |
| La spec esperaba un `seed` en la app | baja | medio | Decisión 1, avisada al dev-lead |

### 1.8 Rollout

Directo: no hay despliegue; el entregable es `research.md`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y escribir el research

**Tras**: —
**Modelo**: sesión nativa, Sonnet effort medium (mecánico: el plan fija firmas, valores y formato de salida).
**Evidencia**: objetivo O1 · `libres-raw.txt` (salida en bruto) y `measure-libres.mjs` (el script que la saca), en la carpeta de la spec · fila O1 y tabla de aguante de `research.md`, calcado de su plantilla.

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure-libres.mjs` → código 0 y última línea `O1: cumple` o `O1: no cumple` (ninguna otra) · `git diff --stat -- src` → vacío · `node --test` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque es una investigación: no cambia ninguna aplicación.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd: string, params: string[]): string` (exportada; `run('libres', [slot])` devuelve las salas libres separadas por `, `) y la línea `const bookings = [...];` que el script sustituye. No consume nada de otras tasks.
- Produce: `libres-raw.txt` con este formato, que `research.md` cita:
  ```
  carga: 1000 reservas activas en 10:00-12:00 (Norte)
  rep <n> ms=<ms con 3 decimales> heapUsed=<bytes>      (n = 1..12)
  max_ms=<ms con 3 decimales>
  O1: <cumple|no cumple>
  ```

**Ficheros**: crear `measure-libres.mjs`, `libres-raw.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script de medida** — `measure-libres.mjs`, sin argumentos, ejecutable con `node` desde la raíz del repo. Piezas (el cuerpo lo escribe el implementador):
  - Constantes: `SLOT = '10:00-12:00'`, `N = 1000`, `REPS = 12`, `LIMIT_MS = 50`; reserva de carga `{ room: 'Norte', day: 'lun', slot: SLOT, status: 'active' }`.
  - `seed(source: string, n: number): string` — devuelve `source` con la línea que casa `/^const bookings = \[.*\];$/m` sustituida por un array de `n` reservas de carga; si no casa, lanza `Error('seed: no encuentro la línea const bookings en src/app.js')`.
  - Carga: lee `src/app.js` desde su ruta relativa a `import.meta.url` (`../../../../src/app.js`), escribe `seed(...)` en un `.mjs` dentro de `os.tmpdir()`, lo importa con `import(pathToFileURL(...))`, sin pasar argumentos al proceso (el módulo no imprime nada).
  - Comprobación previa: cuenta con `source` ya sustituido las apariciones de `status: 'active'` en la línea de `bookings`; si no son exactamente `N`, escribe a stderr `carga: <recuento real> reservas activas, esperaba 1000` y `process.exit(1)` sin medir.
  - Medida: `REPS` llamadas seguidas a `run('libres', [SLOT])` cronometradas con `process.hrtime.bigint()`, y `process.memoryUsage().heapUsed` tras cada una; comprueba que cada respuesta es `'Sur'`.
  - Salida: el formato de «Produce»; `O1: cumple` si `max_ms < LIMIT_MS`, si no `O1: no cumple`. Código 0 en ambos casos.

  El script exporta `seed` y solo ejecuta la medida cuando es el módulo principal (`import.meta.url === pathToFileURL(process.argv[1]).href`), para poder probar `seed` aparte.
- [ ] **Step 2: Prueba negativa de la carga** — antes de dar por bueno el script: `node -e "import('./<carpeta>/measure-libres.mjs').then(m => m.seed('const x = 1;', 1000))"` → lanza `seed: no encuentro la línea const bookings en src/app.js` y no mide. Esperado: ese mensaje y código distinto de 0.
- [ ] **Step 3: Medida** — `node <carpeta>/measure-libres.mjs | Tee-Object libres-raw.txt` (o `> libres-raw.txt` en bash), en la carpeta de la spec. Esperado: código 0, 12 líneas `rep`, `max_ms` y la línea `O1:`. El fichero no se edita a mano.
- [ ] **Step 4: `research.md`** — calcado de `research-template.md` (front matter con `id`, `spec: ./spec.md`, `status: draft`, `created: 2026-11-19`, `timeboxed: 2h`), en castellano, sin bloques de ayuda:
  - §1 Pregunta: la de la spec.
  - §2 Objetivos: fila `O1 — libres con 1.000 reservas responde en < 50 ms` con estado `cumple` o `no cumple tal como se definió` según `max_ms` de `libres-raw.txt`, detalle con la cifra (`max_ms`, rep 1 en frío) y evidencia `libres-raw.txt`. Dice que se midió la llamada en proceso, no el comando de consola de punta a punta.
  - §3 Aguante: carga literal de la spec; una fila por repetición (`rep`, tiempo, `heapUsed`) copiada de `libres-raw.txt`; si `heapUsed` crece entre la 1 y la 12, se dice.
  - §4 Recomendación: solo cita filas medidas. `Elegida`: no cachear (si cumple) o cachear / no abrir a toda la oficina sin caché (si no cumple), con la decisión que desbloquea la spec: «si `libres` necesita una caché antes de abrirlo a toda la oficina». `Descartadas`: la otra opción y por qué.
  - §5 Lo que sale: la fila de roadmap por abrir (p. ej. «caché de `libres`») o `nada`; `seed` como comando de la app queda como `nada` salvo que el dev-lead lo pida (decisión 1).
- [ ] **Step 5: Verificación** — los comandos de «Verificación»: el script (código 0, última línea `O1: …`), `git diff --stat -- src` vacío, `node --test` → `ℹ fail 0`, `node scripts/lint.mjs` → `lint: sin hallazgos`.
- [ ] **Step 6: Commit de la task** — uno solo, con `plan.md`, `measure-libres.mjs`, `libres-raw.txt` y `research.md`: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`, con la atribución de «De proceso».

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task, un script de ~40 líneas y un documento; la incertidumbre es la medida, no el trabajo
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su estado y cifra en `research.md` §2
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, `research.md` §2 y §4 con las filas de `libres-raw.txt`. ✓
- O1 — responde en < 50 ms → Task 1, línea `max_ms` y `O1:` de `libres-raw.txt` (12 repeticiones). ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, comprobación del recuento (sale con 1 si no son 1.000) y línea `carga:` de la salida. ⚠ `seed` no existe en el repo: es una función del script (decisión 1, avisada).
- Decisión que desbloquea: ¿caché antes de abrirlo a toda la oficina? → Task 1, `research.md` §4, `Elegida`. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Validación por agente: son medidas → Task 1, salida en bruto sin editar. ✓
- Review Focus (5 líneas) → Task 1: fallo del reemplazo y recuento (Step 1 y 2), fila `rep 1`, columna `heapUsed`, línea `O1: no cumple`. ✓
