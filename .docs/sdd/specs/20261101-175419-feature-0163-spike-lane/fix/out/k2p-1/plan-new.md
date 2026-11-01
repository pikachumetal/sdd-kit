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

1. **Modelo y effort por task**: hilo principal en Native, sin despacho; ambas tasks son un script corto y una tabla, así que la sesión va bien en Sonnet con effort medium.
2. **Ejecución**: native (ver la línea `Ejecución`). Un spike siempre es Native.
3. **El `seed` no toca producción**: `bookings` es privada en `src/app.js` y ningún comando crea reservas, así que `measure.mjs` lee el código de `src/app.js`, le añade `export { bookings };` en un fichero temporal del SO y lo importa. Se mide el `freeRooms` real, y `src/app.js` queda intacto.
4. **Qué es «1.000 reservas activas en la misma franja»**: `seed` vacía `bookings` y mete 1.000 reservas `active` de la sala `Norte`, el día `lun` y la franja `10:00-12:00`. `libres 10:00-12:00` tiene que recorrerlas todas para decidir que `Sur` está libre (el `some` no corta). Es el peor caso de esa carga, y la reserva de ejemplo del código se descarta para que sean exactamente 1.000.
5. **Qué es una repetición**: una llamada a `run('libres', ['10:00-12:00'])`, cronometrada con `performance.now()`. La primera, en frío, se anota aparte. O1 se da por cumplido solo si las 10 repeticiones salen < 50 ms.
6. **Recurso acumulado**: `process.memoryUsage().heapUsed` tras cada repetición, con `global.gc()` antes cuando `--expose-gc` está activo (el script lo lanza así).
7. **Riesgo alto**: ninguno; el spike no deja código de producción. El Timebox de `research.md` es de 2 h.
8. **Coste estimado**: 0,5 h de implementación, sin despachar subagentes.
9. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar medido si `libres` con 1.000 reservas activas en la misma franja responde en < 50 ms (O1), con la salida en bruto y la recomendación sobre la caché.

**Architecture**: un script de medida (`measure.mjs`) en la carpeta de la spec carga el `src/app.js` real con las reservas sembradas y cronometra `libres`. Su salida en bruto va a `evidencia/` y los números se pasan a `research.md`.

**Tech Stack**: Node 22 sin dependencias externas (`tech-stack.md`); `node:perf_hooks`, `node:fs`, `node:os`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por el formato de la salida de `measure.mjs`, un error se ve en la propia tabla de medidas y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — sin módulo, dependencia ni contrato nuevos; el script vive en la carpeta de la spec y no entra en `src/`.

## Restricciones globales

### De código

- Peor carga de la spec, literal: 1.000 reservas activas en la misma franja, cargadas con `seed`.
- Umbral de O1, literal: `libres` con 1.000 reservas responde en < 50 ms.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Node ≥ 20, sin dependencias nuevas; `src/` no se modifica.
- Textos de salida y documentos en castellano (constitution, art. 4).

### De proceso

- Native, sin subagentes de task; la revisión final de rama va con el modelo de `sdd-verify`.
- Un spike no deja código de producción: lo que la medida deje a la vista va a su propia fila (`research.md` §5).
- Commits con el convenio del proyecto, referenciando el 0031, y con la atribución que fija la sesión.

## Review Focus

- `libres` devuelve algo distinto de `Sur` con la carga sembrada (la siembra falló o `libres` cambió) → el script aborta con código 1 y no escribe medidas · Task 1, comprobación `seed` dentro de `measure.mjs`.
- La siembra deja un número de reservas activas distinto de 1.000 → el script aborta con código 1 · Task 1, misma comprobación.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y dos ficheros de salida; no se monta un banco de pruebas.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: `src/app.js` no se toca; el script lo lee tal cual.
- [x] **Constitution check**: tests antes que código no aplica a una medida (la «prueba» es el aborto del script ante una siembra errónea); gate de cierre al final.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure.mjs` — `seed`, la medida de O1 y el aguante; escribe su salida en bruto en `evidencia/`.
- `evidencia/o1-libres-1000.txt` — salida en bruto de la medida de O1.
- `evidencia/aguante-libres-1000.txt` — salida en bruto de las 10 repeticiones.
- `research.md` — calcado de `research-template.md`, con las filas medidas.

**Modificar**: nada.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción.
- `scripts/lint.mjs` — solo mira `src/app.js`; no recorre la carpeta de la spec.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Que el ruido del SO mueva una medida alrededor de 50 ms | Baja | Medio | 10 repeticiones seguidas y se informa del máximo, no de la media |
| Que `src/app.js` cambie su forma y el `export` añadido ya no cuadre | Baja | Bajo | El script aborta si no encuentra `bookings` |

### 1.8 Rollout

Directo: no hay despliegue; la decisión de la caché va a una fila del roadmap si la medida la pide.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir O1 con la peor carga

**Tras**: —
**Modelo**: hilo principal en Native; sesión en Sonnet con effort medium, sin despacho.
**Evidencia**: O1 · salida en bruto en `evidencia/o1-libres-1000.txt`, sacada con `node --expose-gc measure.mjs o1` · fila O1 de `research.md` (§2), calcada de su plantilla, con el estado `cumple`, `no cumple tal como se definió` o `no medido`.

**Superficies**: tooling · docs
**Verificación**: `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs o1` → termina con código 0 y su última línea es `medidas: 10`; si la siembra no deja 1.000 activas o `libres` no devuelve `Sur`, termina con código 1 sin escribir el fichero.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd, params)` → `string`; `libres <franja>` devuelve las salas libres separadas por `, ` (con la carga sembrada, `Sur`). `bookings` no se exporta: el script añade `export { bookings };` a una copia temporal.
- Produce: `seed(bookings, n)` en `measure.mjs`, que vacía el array y añade `n` reservas `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`; el formato de línea de la salida, `rep <i> · <ms con 3 decimales> ms · heap <bytes> B`, más la línea `frío: <ms> ms` antes de las repeticiones.

**Ficheros**: crear `measure.mjs`, `evidencia/o1-libres-1000.txt`, `research.md` (§1 y §2).

- [ ] **Step 1: Implementación** — `measure.mjs`: `loadApp()` (lee `../../../../src/app.js`, añade `export { bookings };`, lo escribe en `os.tmpdir()` y lo importa; aborta con código 1 si el texto no contiene `const bookings`); `seed(bookings, n)`; `comprobar(app, bookings)` (`bookings.filter(b => b.status === 'active').length === 1000` y `app.run('libres', ['10:00-12:00']) === 'Sur'`, o `process.exit(1)`); modo `o1`: una llamada en frío anotada como `frío: …`, luego 10 repeticiones consecutivas con la línea de `Interfaces`, y al final `medidas: 10`. La salida va a stdout y el script la guarda en `evidencia/o1-libres-1000.txt`.
- [ ] **Step 2: Build** — no aplica (Node sin build).
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: código 0, `medidas: 10`, fichero escrito. Con la primera pasada, pegar el máximo y el estado en la fila O1: `cumple` si las 10 < 50 ms; `no cumple tal como se definió` si alguna ≥ 50 ms.
- [ ] **Step 4: Commit de la task** — uno solo, con la convención del proyecto, referenciando el 0031.

### Task 2 — Aguante y recomendación

**Tras**: Task 1
**Modelo**: hilo principal en Native; sesión en Sonnet con effort medium, sin despacho.
**Evidencia**: aguante de O1 · salida en bruto en `evidencia/aguante-libres-1000.txt`, sacada con `node --expose-gc measure.mjs aguante` · tabla de `research.md` §3 y recomendación en §4 y §5.

**Superficies**: tooling · docs
**Verificación**: `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs aguante` → código 0 y última línea `medidas: 10`. Después, `node --test && node scripts/lint.mjs` no se corre aquí: va en §3.

**Interfaces**:
- Consume: de la Task 1, `loadApp()`, `seed(bookings, n)`, `comprobar(app, bookings)` y el formato de línea `rep <i> · <ms> ms · heap <bytes> B`.
- Produce: el modo `aguante` de `measure.mjs`: carga una vez, siembra 1.000, y hace ≥ 10 repeticiones seguidas con `global.gc()` antes de leer el `heapUsed`; los datos de la tabla de `research.md` §3 salen de ahí.

**Ficheros**: modificar `measure.mjs`; crear `evidencia/aguante-libres-1000.txt`; completar `research.md` (§3, §4 y §5).

- [ ] **Step 1: Implementación** — modo `aguante` en `measure.mjs`, reutilizando `loadApp`, `seed` y `comprobar`; no vuelve a sembrar entre repeticiones. Pasar a `research.md` §3 la tabla `Repetición · Tiempo · Recurso acumulado`, con una frase si el heap crece de forma sostenida.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: código 0, `medidas: 10`. Rellenar §4 solo con filas medidas: «necesita caché» si algún objetivo da `no cumple tal como se definió`; «no necesita caché» si O1 `cumple` y el recurso no crece; si no hay medida, `no medido`. §5: `nada`, o el cambio con su fila abierta en `sdd-roadmap`.
- [ ] **Step 4: Commit de la task** — uno solo, con la convención del proyecto, referenciando el 0031.

---

## Estimación y esfuerzo

- Tipo: chore
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: 2 tasks, un script de unas 60 líneas y una tabla; la incertidumbre es el ruido de la medida, no el código; sin referencia en estimation-log todavía.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su estado y su cifra en `research.md`
- [ ] Spec satisfecha: cada objetivo y la decisión que desbloquea tienen su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` con el máximo de las 10 repeticiones y `evidencia/o1-libres-1000.txt`. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, `seed` y `comprobar` abortan si no hay exactamente 1.000 activas. ✓
- Decisión que desbloquea: si `libres` necesita una caché antes de abrirlo a toda la oficina → Task 2, `research.md` §4 con «Elegida» y las filas que la sostienen. ✓
- Capacidades: ninguna, porque investigación → N/A (confirmado en spec). ✓
- Aguante (plantilla de research, objetivo de rendimiento) → Task 2, tabla de §3 con 10 repeticiones y recurso acumulado. ✓
- Review Focus: `libres` distinto de `Sur` → Task 1, `comprobar`. ✓
- Review Focus: siembra ≠ 1.000 activas → Task 1, `comprobar`. ✓
