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

1. **Modelo y effort**: una sola task, en el hilo principal, Sonnet con effort medium — es un script corto de medida y la redacción de `research.md`; la revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`; un spike va siempre en Native.
3. **Cómo se siembra la carga**: `bookings` no se exporta de `src/app.js`, no hay comando `seed` y `reservar` no añade reservas, así que la spec no se puede cumplir tocando solo la CLI. El script lee `src/app.js`, sustituye la línea `const bookings = …` por 1.000 reservas activas en la franja `10:00-12:00` y carga ese texto como módulo en memoria. Mide el código real de `libres` sin tocar `src/` ni escribir ficheros temporales. Si la línea cambia y la sustitución no encaja, el script sale con código 1.
4. **Qué entiendo por «`seed`» de la spec**: la función `seed()` del propio script, no un comando de la aplicación.
5. **Peor carga dentro de lo que confirmó el dev-lead** («1.000 reservas activas en la misma franja»): 999 reservas de Norte y la de Sur al final del array. `libres` recorre las 1.000 para decidir Sur; con Sur al principio, `some` cortaría en la primera.
6. **Qué se mide**: la respuesta en proceso de `run('libres', ['10:00-12:00'])`, con `process.hrtime.bigint()`. No incluye el arranque de Node de `node src/app.js libres`; lo digo en el apartado 4 de `research.md`.
7. **Aguante**: 20 repeticiones seguidas, sin descartar la primera (en frío): un `cumple` tiene que valer también con ella. Recurso acumulado: `heapUsed` tras cada repetición.
8. **Coste estimado**: 1,5 h en total, sin subagentes ni dinero que contar; el consumo de tokens es el de una sesión media.
9. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar medido si `libres` con 1.000 reservas responde en < 50 ms (O1), con la salida en bruto y la recomendación sobre la caché.

**Architecture**: script de medida suelto en la carpeta de la spec; carga `src/app.js` con la reserva sembrada y repite la llamada. El spike no deja código de producción.

**Tech Stack**: Node 22 (`>=20` en `package.json`), módulos ES, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, ni dependencia en un manifest, ni contrato entre módulos o datos; el script vive en la carpeta de la spec.

## Restricciones globales

### De código

- No se modifica nada de `src/` ni de `test/`: el spike no deja código de producción.
- Sin dependencias nuevas; `node:perf_hooks`/`process` bastan.
- La carga es la de la spec: 1.000 reservas activas en la misma franja, `10:00-12:00`.
- Mínimo 10 repeticiones seguidas; este plan fija 20.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio y nombres que se explican solos.
- Texto de salida y de los documentos en castellano (constitution, art. 4).

### De proceso

- Native: el hilo principal implementa la task y la revisión final de `sdd-verify` mira la rama entera.
- Commits en castellano, con el convenio del repo (`tipo(ámbito): …`) y la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Un nombre de fichero que contenga `test` haría que `node --test` ejecute el script: el script se llama `medir-libres.mjs`.

## Review Focus

- `src/app.js` cambia de forma y la sustitución de `const bookings = …` ya no encaja → el script sale con código 1 y dice qué línea no encontró, no mide una carga vacía · Task 1, el propio script (`process.exit(1)` si la sustitución no cambia el texto) y la verificación que lo prueba con una copia rota.
- La carga sembrada no es la confirmada (menos de 1.000 activas o franja distinta) → el script sale con código 1: `libres` tiene que devolver cadena vacía, porque con las dos salas ocupadas no queda ninguna libre · Task 1, comprobación previa a medir.
- Un umbral cumplido con el recurso creciendo → se dice en el apartado 3 de `research.md` con la columna «Recurso acumulado» · Task 1, verificación de `research.md` (revisión final del eje Spec).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un informe; no hay forma más simple de medir el código real.
- [x] **YAGNI gate**: sin abstracciones; una función `seed()` y un bucle.
- [x] **Brownfield gate**: retrocompatible, no toca `src/` ni `test/`.
- [x] **Constitution check**: respeta los artículos 1 (flujo SDD), 2 (el gate de cierre `node --test` sigue entero en verde) y 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — siembra las 1.000 reservas, comprueba la carga, repite 20 veces `libres` y escribe la tabla de aguante.
- `medidas.txt` — salida en bruto del script (evidencia de O1).
- `research.md` — informe calcado de `research-template.md`: objetivos, aguante, recomendación y lo que sale.

**Modificar**: nada.

**NO se tocan**:

- `src/app.js` — se mide tal cual; no se exporta `bookings` ni se añade `seed`. Si la medida pide un cambio, va a `research.md` §5 como fila por abrir.
- `test/` — no hay comportamiento nuevo que testear.
- `.docs/sdd/steering/` — el spike no cambia reglas ni arquitectura.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna: depende solo de `src/app.js` (existente).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La medida en proceso no refleja el tiempo de `node src/app.js libres` (arranque de Node, cerca de los 50 ms) | alta | medio | Se dice en `research.md` §4; el arranque no depende de `libres` ni de las reservas |
| Ruido de un solo equipo (GC, otros procesos) | media | bajo | 20 repeticiones seguidas, se publica el máximo y no solo la media |
| Cambio en `src/app.js` que rompa la sustitución | baja | medio | El script sale con código 1 (Review Focus) |

### 1.8 Rollout

Directo: no hay despliegue; lo que sale es un informe.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y redactar la investigación

**Tras**: —
**Modelo**: hilo principal (Native), Sonnet con effort medium: no hay despacho de subagente.

**Evidencia**: O1 — `libres` con 1.000 reservas responde en < 50 ms · salida en bruto `medidas.txt` y script `medir-libres.mjs`, en la carpeta de la spec · filas O1 del apartado 2 y tabla del apartado 3 de `research.md`, calcado de `research-template.md`.

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs > .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medidas.txt` → código 0 y `medidas.txt` con la línea `repeticiones: 20`. Prueba negativa: `node <script> <copia de src/app.js sin la línea const bookings>` sale con código 1.
**Se prueba en la aplicación**: no, porque investigación: no cambia lo que ve ni puede hacer el usuario.

**Interfaces**:
- Consume: `src/app.js`, que exporta `run(cmd, params)`; `run('libres', ['10:00-12:00'])` devuelve los nombres de las salas libres separados por coma, o cadena vacía si no hay ninguna. La línea a sustituir es `const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];`.
- Produce: `medidas.txt` y `research.md`, que la revisión final y `sdd-archive` leen.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs`, `medidas.txt`, `research.md`

- [ ] **Step 1: Script de medida** — `medir-libres.mjs`:
  - `seed(): Booking[]` devuelve 1.000 reservas `{ room, day, slot: '10:00-12:00', status: 'active' }`: las 999 primeras de `Norte` con días distintos y la última de `Sur`.
  - `loadApp(bookings, appPath): Promise<{ run }>` lee `appPath`, que es el primer argumento del script o, sin él, `../../../../src/app.js` relativo al script; sustituye con `source.replace(/^const bookings = .*$/m, 'const bookings = ' + JSON.stringify(bookings) + ';')`; si el texto no cambia, escribe `no encuentro la línea const bookings en src/app.js` en stderr y sale con 1; carga el resultado con `import('data:text/javascript,' + encodeURIComponent(source))`.
  - Antes de medir: `run('libres', ['10:00-12:00'])` tiene que devolver `''`; si no, sale con 1 diciendo que la carga no es la confirmada.
  - Mide 20 repeticiones seguidas, la primera en frío, con `process.hrtime.bigint()`; cada una imprime `repetición <n>: <ms> ms · heapUsed <MB> MB`.
  - Imprime la carga (`carga: 1000 activas, Sur en la posición 1000`), `repeticiones: 20`, el máximo, la mediana y si `max < 50` (`O1: cumple` o `O1: no cumple tal como se definió`).
- [ ] **Step 2: Ejecutar y guardar la evidencia** — la orden de «Verificación». Esperado: código 0, 20 filas, `repeticiones: 20`. Después, la prueba negativa sobre la copia rota. Esperado: código 1 y el mensaje de la línea no encontrada.
- [ ] **Step 3: `research.md`** — calcado de `research-template.md`: §1 la pregunta de la spec; §2 la fila O1 con la cifra medida y `medidas.txt`; §3 la tabla de 20 repeticiones con «Recurso acumulado» y, si `heapUsed` crece, dicho; §4 la recomendación (solo cita filas medidas) con la salvedad del arranque de Node; §5 lo que sale: `nada` o la fila del roadmap por abrir. `status: draft` hasta el cierre.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task, un script de unas 40 líneas y un informe; sin referencia en el estimation-log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su fila medida o `no cumple tal como se definió` en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, fila O1 de `research.md` §2 con la cifra de `medidas.txt`. ✓
- O1 — responde en < 50 ms → Task 1, `O1: cumple` o `no cumple tal como se definió` en `medidas.txt`, con el máximo de las 20 repeticiones. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, `seed()` y la comprobación previa (`libres` devuelve `''`); `carga: 1000 activas, Sur en la posición 1000` en la salida. ✓
- Aguante ≥ 10 repeticiones seguidas → Task 1, 20 filas en `research.md` §3 y `repeticiones: 20`. ✓
- Decisión que desbloquea: si `libres` necesita caché → Task 1, `research.md` §4, que solo cita filas medidas. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus (3 entradas) → Task 1, salida con código 1 si la sustitución no encaja o la carga no es la confirmada, y columna «Recurso acumulado» en `research.md` §3. ✓
