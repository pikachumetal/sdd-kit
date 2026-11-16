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

1. Una sola task, en el hilo principal, sin subagentes — es un script de medida y su informe; no hay interfaces entre tasks.
2. Modelo y effort: el de la sesión (Native). El script es mecánico y la interpretación cabe en gama media; sin `fable` ni `opus xhigh`.
3. Ejecución: Native — ver la línea `Ejecución`.
4. `seed` no existe en el repo (la spec lo nombra como forma de cargar la peor carga): el script de medida carga las 1.000 reservas él mismo, sin tocar `src/app.js`. Lee `src/app.js`, escribe una copia temporal con `export { bookings };` añadido, la importa y rellena `bookings` con 1.000 reservas `active` en `10:00-12:00`. Se mide así el código real de `libres` sin dejar código de producción (el spike no deja ninguno). Si el dev-lead quería otro `seed`, la carga sería otra y habría que repetir la medida.
5. La peor carga recorre `bookings` entera: `some` corta en la primera reserva que casa, así que 999 reservas son de salas ajenas (`Aula-<i>`) y la de `Norte` va la última; `Norte` y `Sur` recorren las 1.000. La spec fija solo franja y estado; el reparto por sala es decisión mía.
6. Aguante: 10 repeticiones seguidas en el mismo proceso, con `performance.now()` por repetición y `process.memoryUsage().heapUsed` acumulado tras cada una; un umbral cumplido con el heap creciendo se dice en el informe.
7. Coste estimado: 1 h, sin despacho de subagentes.
8. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Medir si `libres` responde en < 50 ms con 1.000 reservas activas en la misma franja y dejar la tabla de medidas en `research.md`.

**Architecture**: Un script `measure.mjs` en la carpeta de la spec importa una copia de `src/app.js` que exporta `bookings`, carga la peor carga y mide `run('libres', ['10:00-12:00'])`. La salida en bruto va a `evidence-o1.txt` y `research.md` la resume. Cero cambios en `src/`.

**Tech Stack**: Node ≥ 20 (`node:perf_hooks`, `node:fs`), sin dependencias; `node --test` y `scripts/lint.mjs` del proyecto.

**Spec**: `./spec.md`

**Ejecución**: native, porque 1 task, sin interfaces entre tasks, un error lo caza la propia medida repetida y el plan cabe en un contexto (un spike es siempre Native). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el script vive en la carpeta de la spec y `src/` no cambia.

## Restricciones globales

### De código

- Node ≥ 20, sin dependencias nuevas en `package.json` (`architecture.md`: sin dependencias externas).
- No se modifica `src/app.js` ni ningún fichero de producción: lo que salga del spike va a su propia fila del roadmap.
- Carga de la spec, literal: 1.000 reservas activas en la misma franja (`10:00-12:00`); umbral O1: `libres` responde en < 50 ms.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de la salida y de `research.md` en castellano (constitution, art. 4).

### De proceso

- Native: la sesión implementa la task; la revisión final de rama la hace `sdd-verify` con sus ejes.
- Commits en castellano, convención `tipo(ámbito): …`, con la atribución del kit.
- El informe no da por cumplido un `no cumple` ni un `no medido`; lo simulado por el agente se dice (la validación es «agente», son medidas).

## Review Focus

- `libres` con la franja ocupada en las 1.000 reservas devuelve `Sur` (única sala libre) y no revienta → la medida lo comprueba antes de cronometrar · Task 1, comprobación `assert` de `measure.mjs` sobre el resultado de `run('libres', ['10:00-12:00'])`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un informe; no hay forma más simple de medir el código real.
- [x] **YAGNI gate**: nada se abstrae; un único uso.
- [x] **Brownfield gate**: retrocompatible por construcción, no se toca `src/`.
- [x] **Constitution check**: art. 2 (tests antes que código) no aplica a un spike sin código de producción; el gate de cierre sigue corriendo entero. Art. 4 respetado.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todos en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure.mjs` — carga la peor carga sobre una copia de `src/app.js` y mide `libres`; imprime la salida en bruto.
- `evidence-o1.txt` — salida en bruto de `node measure.mjs`.
- `research.md` — informe calcado de `research-template.md`: §2 Objetivos (O1), §3 Aguante, §4 Recomendación, §5 Lo que sale.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción.
- `test/` — no hay comportamiento nuevo que un test fije.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Medir una copia y no el módulo real | Baja | Media | La copia es `src/app.js` byte a byte más `export { bookings };`; el script lo comprueba (`copia.startsWith(original)`) |
| La copia temporal queda en el repo | Media | Baja | Se escribe en `os.tmpdir()`, no en el árbol |
| Primera repetición lenta por arranque en frío del JIT | Alta | Baja | Se informa de las 10 repeticiones, incluida la primera, sin descartar ninguna |
| `seed` era otra carga distinta de la que simulo | Baja | Media | Está avisado en las decisiones (4) |

### 1.8 Rollout

Directo: no hay despliegue; lo que salga va a su propia fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas e informar

**Tras**: —
**Modelo**: hilo principal (Native), el de la sesión; gama media basta: script corto y mecánico.

**Evidencia**: O1 — `libres` con 1.000 reservas responde en < 50 ms · salida en bruto `evidence-o1.txt` y script `measure.mjs`, ambos en la carpeta de la spec · fila O1 de `research.md` (§2) y tabla de aguante (§3).

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure.mjs` → sale con código 0 y su última línea es `medida: 10 repeticiones` · `node --test` → `ℹ fail 0` · `node scripts/lint.mjs` → `lint: sin hallazgos`
**Se prueba en la aplicación**: no, porque investigación: no cambia nada de lo que el usuario ve ni puede hacer.

**Interfaces**:
- Consume: `src/app.js`, que exporta `run(cmd, params)` (`run('libres', [franja])` devuelve los nombres de sala libres separados por `, `) y tiene `const bookings = [{ room, day, slot, status }]` sin exportar.
- Produce: `evidence-o1.txt` y `research.md`; nada que otra task use.

**Ficheros**: crear `measure.mjs`, `evidence-o1.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script de medida** — `measure.mjs`:
  - Lee `src/app.js` (ruta relativa a `import.meta.url`), escribe en `os.tmpdir()` una copia con `\nexport { bookings };` añadida y la importa con `import()`.
  - Carga la peor carga: vacía `bookings` y la rellena con 1.000 reservas `{ room: i < 999 ? `Aula-${i}` : 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`.
  - Comprueba antes de cronometrar `assert.equal(run('libres', ['10:00-12:00']), 'Sur')` (Review Focus) y `assert.equal(bookings.length, 1000)`.
  - 10 repeticiones seguidas: tiempo de `run('libres', ['10:00-12:00'])` con `performance.now()` y `process.memoryUsage().heapUsed` tras cada una; imprime una línea `rep <n> · <ms> ms · heap <bytes> B` por repetición.
  - Imprime `p. máx: <ms> ms · umbral 50 ms · <cumple|no cumple>` y, la última, `medida: 10 repeticiones`; sale con código 1 si falla una comprobación, no si supera el umbral (eso es un resultado).
- [ ] **Step 2: Medir** — `node …/measure.mjs > …/evidence-o1.txt`. Esperado: código 0 y 10 filas de repetición. Si el resultado es `no cumple`, no se ajusta la carga ni el umbral: se informa.
- [ ] **Step 3: Informe** — `research.md` calcado de `research-template.md` (frontmatter con `id`, `spec: ./spec.md`, `created: 2026-11-12`): §1 la pregunta de la spec; §2 fila O1 con estado `cumple`, `no cumple tal como se definió` o `no medido`, el máximo medido como detalle y `evidence-o1.txt` como evidencia; §3 la carga y las 10 filas (tiempo y heap acumulado), diciendo si el heap crece; §4 recomendación (¿necesita `libres` caché antes de abrirlo a toda la oficina?) solo con filas medidas; §5 lo que sale, o `nada`. Se declara que la medida es del agente con datos sembrados, no con una persona.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»: el script, `node --test` y `node scripts/lint.mjs`, con los resultados esperados de arriba.
- [ ] **Step 5: Commit de la task** — `docs(sdd): medir libres con 1.000 reservas (spike 0031)`, con `measure.mjs`, `evidence-o1.txt` y `research.md`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 0.7h
- Estimación de revisión: 0.2h
- Estimación de cierre: 0.2h
- Base de la estimación: 1 task, un script de unas 30 líneas y un informe; sin referencia en el estimation-log (sin notas de calibración todavía)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su estado en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, `research.md` §1 y §4 con la recomendación. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` y `evidence-o1.txt`. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, Step 1 (la carga la hace `measure.mjs`; `seed` no existe y se avisa en las decisiones). ✓
- Decisión que desbloquea: si `libres` necesita caché → Task 1, `research.md` §4. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: franja con 1.000 reservas devuelve `Sur` → Task 1, `assert` de `measure.mjs`. ✓
