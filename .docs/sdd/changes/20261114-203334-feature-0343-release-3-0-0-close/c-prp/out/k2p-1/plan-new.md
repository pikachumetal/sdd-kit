---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-15
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, la hace esta sesión (Native); `sonnet` con effort `medium`, porque la task es un script de medida de ~40 líneas y un informe, sin diseño abierto.
2. **Ejecución**: Native, fijado en `sdd-kit.json` (y un spike va siempre en Native).
3. **`seed` no existe en el repo**: la spec habla de «cargadas con `seed`», pero `src/app.js` no tiene ningún comando ni función con ese nombre y `bookings` no se exporta. El script de medida hace de `seed`: lee `src/app.js`, le añade `export { bookings };` en una copia temporal y la importa. `src/app.js` queda intacto (el spike no deja código de producción).
4. **Forma de la peor carga** (la spec fija «1.000 reservas activas en la misma franja», no su reparto): las 1.000 van a la sala `Sur`, franja `10:00-12:00`, repartidas en los días `lun`–`vie`. `libres` filtra por sala y franja (no mira el día) y `some` corta al primer acierto, así que `Sur` acierta pronto y `Norte`, libre, recorre las 1.000: es el recorrido más largo que permite el código actual. Se mide `run('libres', ['10:00-12:00'])` en el propio proceso: las reservas viven en memoria y un proceso nuevo del CLI arranca con una sola.
5. **Repeticiones**: 20 seguidas (la plantilla pide ≥ 10), con `node --expose-gc` y un `gc()` antes de cada una para que el recurso acumulado (`heapUsed`) diga si algo crece. Se informan todas, la primera incluida (JIT en frío), y el estado de O1 se decide por el máximo, no por la media.
6. **Coste estimado**: ~0,5 h, sin subagentes.
7. **Review Focus**: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Medir cuánto tarda `libres` con 1.000 reservas activas en la misma franja y dejar la tabla de `research.md` con la recomendación sobre la caché.

**Architecture**: Un script suelto en la carpeta de la spec carga las reservas sobre una copia en memoria de `src/app.js`, llama a `run('libres', …)` 20 veces y escribe la salida en bruto. `research.md` calca esa salida en su plantilla. No se toca ni se añade nada en `src/` ni en `test/`.

**Tech Stack**: Node ≥ 20 (`package.json`), módulos ES, sin dependencias, `node --test` y `scripts/lint.mjs` como gate.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el script vive en la carpeta de la spec y `src/` no cambia.

## Restricciones globales

### De código

- Umbral de O1: `libres` con 1.000 reservas responde en < 50 ms; un valor medido ≥ 50 ms es `no cumple tal como se definió`.
- Carga: 1.000 reservas activas (`status: 'active'`) en la misma franja, `10:00-12:00`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres claros en lugar de comentarios.
- Ningún cambio en `src/` ni en `test/`: el spike no deja código de producción.

### De proceso

- Política de modelos: gama media (Sonnet, effort medium) para la task; `fable` y `opus xhigh` no se usan.
- Commits: convención del proyecto (`tipo(ámbito): resumen` en castellano) con el pie de atribución de la sesión.
- Texto de los documentos en castellano (constitution, art. 4).

## Review Focus

- Primera repetición en frío más lenta que el resto → se informa en la tabla de aguante y el estado de O1 usa el máximo de las 20, no la media · Task 1, la fila `max` del resumen y la tabla de §3 de `research.md`.
- El script cambia `src/app.js` al exportar `bookings` → no: trabaja sobre una copia temporal y `git diff --stat -- src test` sale vacío · Task 1, comprobación de «Verificación».
- Con `heapUsed` creciendo repetición a repetición, aunque el tiempo cumpla → se dice en §3 y la recomendación no lo da por limpio · Task 1, columna «Recurso acumulado» de `research.md`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un informe; sin infraestructura de benchmark.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `src/` y `test/` intactos.
- [x] **Constitution check**: tests antes que código no aplica (no hay código de producción); el gate de cierre corre entero en §3; documentos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure.mjs` — carga las 1.000 reservas sobre la copia temporal de `src/app.js`, mide 20 repeticiones de `libres` y escribe la salida en bruto.
- `libres-medidas.txt` — salida en bruto de `measure.mjs` (evidencia).
- `research.md` — plantilla `research-template.md`: fila de O1, tabla de aguante, recomendación y «Lo que sale».

**Modificar**: nada.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción; el script trabaja sobre una copia temporal.
- `test/` — sin código nuevo no hay test nuevo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La copia temporal de `app.js` ejecuta el CLI al importarse | Baja | Ruido en la salida | Se importa sin argumentos: `if (command)` no corre |
| Ruido de la máquina (otra carga) | Media | Un máximo falso por encima de 50 ms | Se repite la tanda entera una vez si algún valor roza el umbral y se dice en el informe |

### 1.8 Rollout

Directo: no llega a producción; lo que salga va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y escribir el informe

**Tras**: —
**Modelo**: Native, esta sesión: `sonnet` con effort `medium`.

**Evidencia**: O1 · salida en bruto `libres-medidas.txt` y el script `measure.mjs` que la saca, en la carpeta de la spec · fila de O1 y tabla de aguante de `research.md`, calcadas de su plantilla.

**Superficies**: tooling · docs
**Verificación**:

- `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs` → sale con 0 y su última línea es `RESUMEN n=20 max=<ms> umbral=50`.
- `git diff --stat -- src test` → sin salida.

**Se prueba en la aplicación**: no, porque investigación: no cambia ninguna aplicación.

**Interfaces**:
- Consume: `run(cmd, params)` de `src/app.js` (`run('libres', ['10:00-12:00'])` devuelve los nombres de las salas libres separados por coma) y su array `bookings` de `{ room, day, slot, status }`, que `measure.mjs` expone con `export { bookings };` en una copia temporal.
- Produce: `libres-medidas.txt` con una línea por repetición, `rep=<n> ms=<tiempo> heapUsed=<bytes>`, y la línea final `RESUMEN n=20 max=<ms> umbral=50`.

**Ficheros**: crear `measure.mjs`, `libres-medidas.txt`, `research.md` (en la carpeta de la spec).

- [ ] **Step 1: Script** — `measure.mjs`: escribe `<tmp>/app-medida.mjs` con el texto de `src/app.js` más `\nexport { bookings };`, la importa con `await import(pathToFileURL(...))` y vacía `bookings`; añade 1.000 reservas `{ room: 'Sur', day: ['lun','mar','mie','jue','vie'][i % 5], slot: '10:00-12:00', status: 'active' }`; hace 20 repeticiones, cada una con `globalThis.gc()` antes, midiendo con `performance.now()` solo la llamada a `run`; imprime `rep=<n> ms=<tiempo con 3 decimales> heapUsed=<process.memoryUsage().heapUsed>` y, al final, comprueba que la última llamada devolvió `Norte` (si no, sale con código 1: la carga no es la peor) e imprime `RESUMEN n=20 max=<ms> umbral=50`. Borra la copia temporal al terminar.
- [ ] **Step 2: Medir** — ejecutar el comando de «Verificación» redirigiendo la salida a `libres-medidas.txt`. Esperado: salida 0, 20 líneas `rep=` y el `RESUMEN`. Si un valor ≥ 40 ms, repetir la tanda una vez y decirlo en el informe.
- [ ] **Step 3: Informe** — `research.md` calcado de `research-template.md`: fila O1 con estado `cumple` si `max` < 50, `no cumple tal como se definió` si no, con la cifra y `libres-medidas.txt`; §3 con las 20 repeticiones y su `heapUsed` (y si crece, dicho); §4 con la recomendación sobre la caché citando solo filas medidas; §5 «nada» o la fila de roadmap por abrir.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; `git diff --stat -- src test` vacío.
- [ ] **Step 5: Commit de la task** — uno solo, con la convención del proyecto: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 1 task, un script de ~40 líneas y un informe; sin referencia en el estimation-log (sin notas de calibración todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con estado y cifra en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` (valor `max` del `RESUMEN`). ✓
- Peor carga: 1.000 reservas activas en la misma franja → Task 1, el script sale con código 1 si `libres` no devuelve `Norte` con la carga montada. ✓
- Decisión que desbloquea: si `libres` necesita una caché → Task 1, §4 de `research.md`, que cita solo filas medidas. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: primera repetición en frío → Task 1, tabla de §3; script que no toca `src/` → `git diff --stat -- src test`; `heapUsed` creciente → columna de §3. ✓
