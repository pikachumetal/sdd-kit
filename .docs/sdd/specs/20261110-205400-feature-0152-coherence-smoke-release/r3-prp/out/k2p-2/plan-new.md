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

1. **Una sola task, en el hilo principal (Native)** — un spike es siempre Native; el trabajo es un script y una tabla, y no hay interfaces entre tasks que revisar por separado.
2. **Modelo y effort**: sin despacho; lo hace la sesión (Sonnet, effort medium). La revisión final de rama va con el modelo de `sdd-verify`, no se quita.
3. **«Cargadas con `seed`» no existe en el código**: `src/app.js` no exporta `bookings` ni tiene un comando `seed`, y `reservar` no añade reservas. Para no tocar producción (un spike no deja código), el script lee `src/app.js`, sustituye la línea `const bookings = [...]` por 1.000 reservas activas en la franja `10:00-12:00` y carga esa copia temporal. Entiendo `seed` como esa siembra del propio script; si querías otra cosa, dímelo antes de la medida.
4. **Cómo se mide**: 10 repeticiones seguidas de `run('libres', ['10:00-12:00'])` con `process.hrtime.bigint()`, más una medición previa de calentamiento descartada y declarada. El recurso acumulado es `process.memoryUsage().heapUsed` tras cada repetición (con `--expose-gc` y `gc()` previo al arranque).
5. **Umbral**: O1 se da `cumple` solo si las 10 repeticiones salen < 50 ms; si alguna no, `no cumple tal como se definió`, aunque la media pase.
6. **Coste estimado**: 1 h; sin subagentes, coste de tokens de una sesión corta.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar medido, con salida en bruto y script reproducible, si `libres` responde en < 50 ms con 1.000 reservas activas en la misma franja, y recomendar si necesita caché.

**Architecture**: script autónomo en la carpeta de la spec que genera una copia temporal de `src/app.js` con la carga sembrada, la importa y cronometra `run`. No toca `src/` ni `test/`.

**Tech Stack**: Node 22 (≥ 20), ESM, `node:test`, sin dependencias (`architecture.md`, `operations.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato; solo un script y su evidencia en la carpeta de la spec.

## Restricciones globales

### De código

- Un spike no deja código de producción: `src/` y `test/` quedan intactos.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin dependencias nuevas: solo Node estándar.
- Texto de salida y documentos en castellano (constitution, art. 4).

### De proceso

- Modo de ejecución: Native, siempre en un spike.
- Revisión final de rama: ejes Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`.
- Commits con la convención del proyecto (`tipo(ámbito): resumen` en castellano) y la atribución que fija el entorno.

## Review Focus

- La copia temporal no sustituye la línea de `bookings` (formato de `app.js` cambia) → el script falla con error claro y salida distinta de 0, no mide el estado de 1 reserva · Task 1, comprobación `Falla_si_no_encuentra_la_línea_de_bookings` en el propio script.
- `libres` con la franja saturada devuelve lista vacía, no un error → la salida bruta guarda el resultado de `run` en cada repetición y la fila de `research.md` lo cita · Task 1, aserción `resultado === ''` dentro del script.
- El tiempo cumple pero la memoria crece repetición a repetición → se dice en `research.md` §3 aunque O1 cumpla · Task 1, columna «Recurso acumulado» de la salida.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y una tabla; nada más.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: sin cambios en `src/`; retrocompatible por construcción.
- [x] **Constitution check**: art. 1 (flujo SDD), 2 (el gate de cierre sigue verde, no se toca código), 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — siembra 1.000 reservas en una copia temporal de `src/app.js`, la importa, calienta una vez y mide 10 repeticiones; imprime la tabla en bruto y sale con 1 si falta la línea a sustituir.
- `salida-libres.txt` — salida en bruto de la ejecución del script.
- `research.md` — trazado de `research-template.md`: objetivos, aguante, recomendación y lo que sale.

**Modificar**:

- `plan.md` y `spec.md` — solo el estado, al cerrar.

**NO se tocan**:

- `src/app.js`, `test/*` — un spike no deja código de producción.
- `ROADMAP.md` — la fila de lo que salga se abre al cerrar, no aquí.

### 1.2 a 1.5

No aplican: sin datos, migraciones, contratos ni UX.

### 1.6 Dependencias

Ninguna fuera de Node. La spec 0031 es independiente de las filas 0010, 0011 y 0008 del roadmap.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La medida en una máquina concreta no vale para la oficina | media | medio | declarar máquina y versión de Node en `research.md`; el umbral es de 50 ms, la medida esperada es de órdenes de magnitud menos |
| El calentamiento del JIT sesga la primera repetición | alta | bajo | una pasada previa descartada y declarada; las 10 restantes se reportan todas |
| Sembrar por sustitución de texto rompe si `app.js` cambia | baja | bajo | el script falla con salida 1 si no encuentra la línea (Review Focus) |

### 1.8 Rollout

Directo: no llega a producción; lo que salga va a su propia fila.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y dejar la evidencia

**Tras**: —
**Modelo**: hilo principal (Native), sin despacho; Sonnet, effort medium.

**Evidencia**: O1 · `salida-libres.txt` y script `medir-libres.mjs`, en la carpeta de la spec · fila O1 y tabla de aguante de `research.md`, calcado de su plantilla.

**Superficies**: tooling · docs
**Verificación**: `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → sale con 0 e imprime 10 filas de repetición y la línea `resultado: ''`; `node --test` → `ℹ fail 0`
**Se prueba en la aplicación**: no, porque investigación: no cambia nada que vea el usuario.

**Interfaces**:
- Consume: `run(cmd, params)` de `src/app.js` — `run('libres', ['10:00-12:00'])` devuelve la lista de salas libres como texto separado por comas, `''` si no hay ninguna; la línea `const bookings = [...]` de `src/app.js`, que la copia temporal sustituye.
- Produce: `salida-libres.txt` con una fila `repetición · ms · heapUsed` por repetición, y la fila O1 de `research.md`.

**Ficheros**: crear `medir-libres.mjs`, `salida-libres.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script** — `medir-libres.mjs`: lee `src/app.js`; sustituye con una expresión regular la línea `const bookings = ...;` por un array de 1.000 `{ room: 'Norte' | 'Sur' alternando, day: 'lun', slot: '10:00-12:00', status: 'active' }`; si no hay coincidencia, `console.error` y `process.exit(1)`; escribe la copia en `os.tmpdir()` como `.mjs` y la importa; una pasada de calentamiento descartada; luego 10 repeticiones de `run('libres', ['10:00-12:00'])` con `process.hrtime.bigint()`, `gc()` previo y `heapUsed` tras cada una; imprime `repetición · ms · heapUsed` y `resultado: '<salida de run>'`; borra la copia temporal.
- [ ] **Step 2: Ejecución** — correr el script y guardar la salida literal en `salida-libres.txt` con la versión de Node y la fecha. Esperado: 10 filas, salida 0.
- [ ] **Step 3: Research** — rellenar `research.md` desde `research-template.md`: fila O1 con el estado por las reglas de la plantilla (`cumple` solo si las 10 < 50 ms), tabla de aguante con las 10 filas, recomendación (caché sí o no, citando filas) y «Lo que sale»: nada, o la fila del roadmap por abrir.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; esperado: script con salida 0 y `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1h
- Estimación de revisión: 0.5h
- Estimación de cierre: 0.5h
- Base de la estimación: 1 task, un script de unos 30 líneas y una tabla; sin referencia en el estimation-log (sin notas de calibración todavía)
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su estado en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, fila O1 y recomendación de `research.md`. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, las 10 repeticiones de `salida-libres.txt` frente al umbral de 50 ms. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, el script siembra 1.000 con `slot: '10:00-12:00'`; la salida bruta lo declara y `resultado: ''` confirma la franja saturada. ✓ (la siembra es por sustitución en copia temporal: ver decisión 3)
- Decisión que desbloquea (¿necesita caché antes de abrirlo a toda la oficina?) → Task 1, recomendación de `research.md` §4. ✓
- Validación: agente → medidas en `research.md`, sin guion de validación. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus → Task 1: comprobación de la línea de `bookings` y aserción `resultado === ''` en el script, y columna de recurso acumulado. ✓
