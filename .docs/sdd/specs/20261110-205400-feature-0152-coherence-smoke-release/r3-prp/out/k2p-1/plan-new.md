---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-11
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: ambas tasks con la sesión (Native, un spike lo es siempre), gama media (Sonnet, effort medium): una es un script corto y la otra volcar cifras en una plantilla. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`), también con dos tasks.
2. **Ejecución**: native, porque un spike lo es siempre (ver la línea `Ejecución`).
3. **Cómo se siembra**: `seed` no existe en el repo y `bookings` es privado en `src/app.js`; `reservar` no crea reservas reales. El script lee `src/app.js`, sustituye solo la línea de `bookings` por 1.000 reservas generadas y evalúa esa copia en la carpeta temporal del sistema. Mide así el código real de `freeRooms` sin tocar producción (un spike no deja código de producción).
4. **Reparto de la carga**: la spec fija «1.000 activas en la misma franja» (`10:00-12:00`), no su reparto: las 1.000 en `Norte` y ninguna en `Sur`, con un día distinto cada una (`d0`…`d999`), todas `status: 'active'`, para que `libres` recorra la lista entera al comprobar `Sur` (corregido tras la revisión final: el reparto alterno inicial cortaba `some()` enseguida).
5. **Medida**: 5 llamadas de calentamiento descartadas y 10 repeticiones medidas seguidas, cada una con `performance.now()` alrededor de `run('libres', ['10:00-12:00'])`, y `process.memoryUsage().heapUsed` tras cada una como recurso acumulado. El umbral del O1 se compara con el máximo de las 10, no con la media.
6. **Dónde queda la evidencia**: script y salida en bruto en la carpeta de la spec (`medir-libres.mjs`, `medidas-libres.txt`); no entran en `src/` ni en `test/`. El nombre del script no casa con los patrones de `node --test`.
7. **Riesgos altos**: ninguno; la medida depende de la máquina, y `research.md` anota la versión de Node.
8. **Coste estimado**: 1,5 h, sin subagentes de task; la revisión final despacha 3 ejes.
9. **Review Focus**: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar la tabla de medidas de `libres` con 1.000 reservas y la recomendación sobre la caché, en `research.md`.

**Architecture**: un script de medida fuera de `src/` que carga una copia sembrada del módulo y repite la llamada; `research.md` copia su salida. Sin dependencias.

**Tech Stack**: Node 22, `node:perf_hooks` y `node:fs` (sin dependencias externas, según `architecture.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque un spike lo es siempre; 2 tasks encadenadas (la 2 copia la salida de la 1), un error lo caza la verificación de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato; el script vive en la carpeta de la spec y no toca `src/`.

## Restricciones globales

### De código

- La carga es la de la spec: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`; el objetivo es O1, `libres` responde en < 50 ms.
- Node 22, sin dependencias externas (`architecture.md`).
- `src/` y `test/` no se modifican: un spike no deja código de producción.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- Texto de salida y documentos en castellano (constitution, art. 4).

### De proceso

- Native: la sesión implementa cada task, en gama media.
- Commits en castellano con la convención del proyecto (`docs(sdd): …`, `feat: …`), con la atribución que fije el harness.
- Un hito, un commit: apertura (spec + plan + tasks), una por task y el cierre.

## Review Focus

- La siembra no sustituye `bookings` y el módulo arranca con la reserva original → el script sale con 1 y no mide · Task 1, comprobación `sembradas: 1000 activas en 10:00-12:00` antes de medir (verificación: la línea literal en `medidas-libres.txt`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento; sin infraestructura de benchmarks.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: producción intacta.
- [x] **Constitution check**: arts. 2 (la evidencia antes que la recomendación) y 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — siembra la copia del módulo y mide; imprime la salida en bruto.
- `medidas-libres.txt` — salida en bruto del script.
- `research.md` — objetivos, aguante, recomendación y lo que sale, calcado de `research-template.md`.

**Modificar**: nada fuera de la carpeta del spike.

**NO se tocan**:

- `src/app.js` — se mide tal cual; la siembra trabaja sobre una copia.
- `test/` — el spike no añade tests de producción.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La máquina añade ruido a una medida de milisegundos | media | baja | 5 calentamientos, 10 repeticiones y se compara el máximo |
| La siembra no sustituye `bookings` y se mide la carga original | baja | alta | el script cuenta las activas sembradas y aborta si no son 1.000 |

### 1.8 Rollout

Directo: no hay despliegue; lo que sale va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Sembrar 1.000 reservas y medir `libres`

**Tras**: —
**Modelo**: sesión (Native), Sonnet con effort medium.
**Evidencia**: O1 · salida en bruto `medidas-libres.txt`, sacada con `medir-libres.mjs`, ambos en la carpeta de la spec · filas de `research.md` §2 y §3 (Task 2).

**Superficies**: tooling
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs > .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medidas-libres.txt` sale con 0, y `medidas-libres.txt` contiene `sembradas: 1000 activas en 10:00-12:00` y `repeticiones medidas: 10`.
**Se prueba en la aplicación**: no, porque es un spike de medida: no cambia ninguna aplicación.

**Interfaces**:
- Consume: de `src/app.js`, `run(cmd, params)` y la línea `const bookings = [...]` (cada reserva `{ room, day, slot, status }`, `status: 'active'`); franja `10:00-12:00`.
- Produce: `medidas-libres.txt` con, en este orden, la línea `sembradas: 1000 activas en 10:00-12:00`, la línea `reparto: 1000 en Norte, ninguna en Sur`, la línea `node: <versión>`, una línea por repetición `repeticion <n> · <ms con 3 decimales> ms · heapUsed <bytes>`, y las líneas `repeticiones medidas: 10` y `maximo: <ms> ms`.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs`

- [ ] **Step 1: Implementación** — `medir-libres.mjs`: `seed(source)` lee `src/app.js` (ruta relativa a `import.meta.url`), reemplaza la línea que empieza por `const bookings =` por un array de 1.000 `{ room, day, slot: '10:00-12:00', status: 'active' }` (las 1.000 en `Norte`, `day: 'd' + índice`), escribe la copia en `os.tmpdir()` como `.mjs` y la importa. Cuenta las reservas activas de la franja en el array sembrado; si no son 1.000, `console.error` y `process.exit(1)`. Imprime las líneas de «Produce». Calentamiento: 5 llamadas a `run('libres', ['10:00-12:00'])` sin imprimir; después 10 repeticiones, cada una con `performance.now()` antes y después y `process.memoryUsage().heapUsed`. `maximo` es el mayor de las 10.
- [ ] **Step 2: Build** — no hay build en el proyecto. Esperado: `node --check` del script sale con 0.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: sale con 0 y las dos líneas literales; si la siembra falla, sale con 1 y no imprime repeticiones.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `feat: medir libres con 1.000 reservas (spike 0031)`.

### Task 2 — Escribir `research.md` con la tabla y la recomendación

**Tras**: Task 1
**Modelo**: sesión (Native), Sonnet con effort medium.
**Evidencia**: O1 · `medidas-libres.txt` (Task 1) · filas de `research.md` §2 y §3.

**Superficies**: docs
**Verificación**: `node --test` → `ℹ fail 0`, y `node scripts/lint.mjs` → `lint: sin hallazgos` (la suite del proyecto sigue verde porque producción no se tocó).
**Se prueba en la aplicación**: no, porque es documentación de una medida.

**Interfaces**:
- Consume: de la Task 1, las líneas de `medidas-libres.txt` (`repeticion <n> · <ms> ms · heapUsed <bytes>`, `maximo: <ms> ms`, `node: <versión>`).
- Produce: `research.md` con las secciones de `research-template.md` (§1 pregunta, §2 objetivos, §3 aguante, §4 recomendación, §5 lo que sale).

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/research.md`

- [ ] **Step 1: Implementación** — traza `research-template.md`: §2 con la fila `O1 — libres con 1.000 reservas responde en < 50 ms` y estado `cumple` si el máximo de las 10 repeticiones es < 50 ms, `no cumple tal como se definió` si no, con la cifra y `medidas-libres.txt` como evidencia; §3 con la carga de la spec y las 10 filas (tiempo y `heapUsed`), diciendo si el recurso crece; §4 solo con filas medidas, respondiendo si `libres` necesita caché antes de abrirlo a toda la oficina; §5 con el cambio que salga y su fila por abrir, o `nada`. Anota la versión de Node.
- [ ] **Step 2: Build** — no hay build. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación». Esperado: `ℹ fail 0` y `lint: sin hallazgos`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `docs(sdd): research del spike 0031 con la recomendación`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks (un script de ~40 líneas y un documento), sin referencias de spikes en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Objetivos): O1 con su fila en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 2, `research.md` §4 con la recomendación. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, líneas `repeticion` y `maximo` de `medidas-libres.txt`; Task 2, fila O1 de §2. ✓
- Peor carga: 1.000 reservas activas en la misma franja, con `seed` → Task 1, línea `sembradas: 1000 activas en 10:00-12:00`; Task 2, §3 con la carga. ✓
- Decisión que desbloquea (caché antes de abrirlo a toda la oficina) → Task 2, `research.md` §4 y §5. ✓
- Capacidades: ninguna, porque investigación → N/A (confirmado en spec). ✓
- Review Focus (la siembra no sustituye `bookings`) → Task 1, comprobación de las 1.000 activas con salida 1. ✓
