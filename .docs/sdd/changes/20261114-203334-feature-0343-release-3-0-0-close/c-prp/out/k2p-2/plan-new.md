---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: done
created: 2026-11-16
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Task 1 con Sonnet, effort medium — el script es corto y el plan trae su diseño; la revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json` (y un spike es siempre Native).
3. **Cómo se carga la `seed` sin tocar producción**: `bookings` no se exporta de `src/app.js`, y un spike no deja código de producción. El script copia `src/app.js` a un directorio temporal con la lista inicial `bookings` sustituida por las 1.000 reservas y lo importa; se mide el `run('libres', …)` real, no una réplica.
4. **Forma de la peor carga**: 1.000 reservas activas en `10:00-12:00`, todas de la sala `Sur` y en días distintos (`d0001`…`d1000`). Así consultar `Norte` en esa franja recorre las 1.000 sin cortocircuitar con un acierto temprano. Sigue siendo «1.000 activas en la misma franja» de la spec; si el dev-lead la quería repartida entre salas, `Norte` y `Sur` alternas cortocircuitaría y mediría menos.
5. **Qué se mide**: 10 repeticiones seguidas (la plantilla de research lo exige para rendimiento) de `run('libres', ['10:00-12:00'])`, con `performance.now()`, más el heap usado tras cada una como «recurso acumulado». Umbral: < 50 ms cada repetición (O1).
6. **Dónde queda la evidencia**: `measure-libres.mjs` y `evidencia/libres-1000.txt` junto a la spec; la fila de `research.md` apunta a esa salida.
7. **Coste estimado**: ~0,5 h, sin subagentes en el desarrollo; la revisión final de rama añade los ejes del kit.
8. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Dejar medido si `libres` con 1.000 reservas activas en la misma franja responde en < 50 ms, y qué decisión sobre la caché se desprende.

**Architecture**: Un script de medida fuera de `src/` importa una copia sembrada de `src/app.js` y cronometra `run('libres', …)` en 10 repeticiones. La salida en bruto y la tabla de `research.md` son lo único que sale; `src/` no cambia.

**Tech Stack**: Node ≥ 20, sin dependencias externas (`node:fs`, `node:os`, `node:perf_hooks`, `node:url`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el script de medida vive junto a la spec y `src/app.js` queda intacto.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio y funciones cortas (la constitution del proyecto no tiene artículo de calidad, valen estas dos reglas).
- Node ≥ 20 y sin dependencias externas (`architecture.md`).
- Texto de salida y de los documentos en castellano (constitution, art. 4).
- Sin tabuladores en `src/app.js` (`scripts/lint.mjs`); este spike no lo toca.
- Franja: `10:00-12:00`; reservas: 1.000, todas `status: 'active'`; umbral de O1: < 50 ms.

### De proceso

- Un spike no deja código de producción: ningún cambio en `src/` ni en `test/`.
- Modelo por defecto: Sonnet, effort medium; `fable` y `opus xhigh` solo con justificación escrita.
- Commits en castellano, con la atribución del kit al final.

## Review Focus

- La copia sembrada no se importa de la caché de módulos de un run anterior ni deja ficheros tras medir → el script usa un directorio temporal nuevo por ejecución y lo borra al acabar; `git status` queda limpio salvo los ficheros de la spec · Task 1, comprobación de `git status` en Verificación.
- Si una repetición pasa de 50 ms o el heap crece de forma sostenida → la fila de O1 dice `no cumple tal como se definió` y el aguante lo dice, no se redondea a «cumple» · Task 1, filas de la tabla de aguante de `research.md`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento; nada más.
- [x] **YAGNI gate**: sin parametrizar el número de reservas ni la franja más allá de lo que mide el spike.
- [x] **Brownfield gate**: `src/` y `test/` intactos.
- [x] **Constitution check**: castellano, SDD del kit, gate de cierre sin cambios.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `measure-libres.mjs` — siembra la copia de `src/app.js`, hace las 10 repeticiones y escribe la salida en bruto.
- `evidencia/libres-1000.txt` — salida en bruto de la última ejecución del script.
- `research.md` — trazado de `research-template.md`: objetivos, aguante, recomendación y lo que sale.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — es lo medido; se mide una copia sembrada, no se edita.
- `test/`, `scripts/lint.mjs` — el spike no añade tests de producción.

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
| La sustitución de `bookings` en la copia no encuentra la línea y se mide con 1 reserva | Baja | Alto | El script falla si la cadena a sustituir no aparece y escribe en la salida cuántas reservas activas tiene la copia |
| La primera repetición paga el arranque del módulo y distorsiona | Media | Medio | Se importa y se hace una llamada de calentamiento no contada antes de las 10 repeticiones; se dice en `research.md` |
| 50 ms en esta máquina no es 50 ms en la de la oficina | Media | Medio | `research.md` anota la versión de Node y la máquina; la recomendación cita solo filas medidas |

### 1.8 Rollout

Directo: no hay nada que desplegar.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas y dejar la evidencia

**Tras**: —
**Modelo**: Sonnet, effort medium — hilo principal en Native, sin despacho.
**Evidencia**: O1 — `libres` con 1.000 reservas responde en < 50 ms · salida en bruto `evidencia/libres-1000.txt`, sacada con `node measure-libres.mjs` (ambos en la carpeta de la spec) · fila de O1 y tabla de aguante de `research.md`, calcadas de `research-template.md`.

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure-libres.mjs` → sale con código 0 y su última línea es `reservas activas en la franja: 1000`; `git status --short` → solo ficheros bajo `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`.
**Se prueba en la aplicación**: no, porque es un spike: no cambia nada de lo que ve el usuario.

**Interfaces**:
- Consume: `run(cmd, params)` exportado por `src/app.js`; `run('libres', ['10:00-12:00'])` devuelve las salas libres separadas por coma.
- Produce: `evidencia/libres-1000.txt` con una línea por repetición `rep <n> <ms con 3 decimales> ms heap <MB con 2 decimales> MB`, y como última línea `reservas activas en la franja: <n>`.

**Ficheros**: crear `measure-libres.mjs`, `evidencia/libres-1000.txt`, `research.md` (todos en la carpeta de la spec).

- [ ] **Step 1: Script** — `measure-libres.mjs`: lee `src/app.js`; sustituye la línea `const bookings = [...]` por `const bookings = Array.from({ length: 1000 }, (_, i) => ({ room: 'Sur', day: 'd' + String(i + 1).padStart(4, '0'), slot: '10:00-12:00', status: 'active' }));` y falla con código 1 si la línea original no está; escribe la copia como `app.mjs` en un `mkdtempSync` de `os.tmpdir()`; la importa, hace una llamada de calentamiento no contada y luego 10 repeticiones seguidas de `run('libres', ['10:00-12:00'])` cronometradas con `performance.now()`, anotando `process.memoryUsage().heapUsed`; comprueba que el resultado es `Norte` (las 1.000 son de `Sur`); imprime y escribe en `evidencia/libres-1000.txt` las líneas del contrato; borra el directorio temporal en un `finally`; sale con código 1 si alguna repetición pasa de 50 ms.
- [ ] **Step 2: Ejecución** — correrlo con `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/measure-libres.mjs`. Esperado: 10 líneas `rep` y `reservas activas en la franja: 1000`. Si sale con 1 por superar 50 ms, la evidencia se guarda igual y la fila de O1 dice `no cumple tal como se definió`.
- [ ] **Step 3: `research.md`** — trazar `research-template.md`: §1 la pregunta de la spec; §2 fila O1 con la cifra máxima y la mediana medidas y el fichero de evidencia; §3 carga «1.000 reservas activas en `10:00-12:00`, todas de `Sur`, cargadas con la seed del script» y las 10 filas de repetición con su heap; §4 recomendación citando solo filas medidas (caché sí o no antes de abrirlo a la oficina, o «no seguir»); §5 lo que sale (una fila de roadmap por abrir si la medida deja un arreglo a la vista, o `nada`). Anotar Node (`node -v`) y que la primera llamada es calentamiento.
- [ ] **Step 4: Verificación** — los comandos de «Verificación» de esta task, con su resultado esperado.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,25 h
- Estimación de cierre: 0,25 h
- Base de la estimación: 1 task, un script de ~40 líneas y un documento; incertidumbre baja, sin referencia en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 tiene fila en `research.md` con su cifra y su evidencia
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Pregunta «¿aguanta `libres` 1.000 reservas?» → Task 1, §4 de `research.md` responde con filas medidas. ✓
- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, fila O1 de `research.md` y las 10 líneas `rep` de `evidencia/libres-1000.txt`. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, Step 1 (la seed) y la última línea `reservas activas en la franja: 1000` de la evidencia. ✓
- Decisión que desbloquea: si `libres` necesita caché antes de abrirlo a toda la oficina → Task 1, Step 3, §4 de `research.md`. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus, copia sin restos → Task 1, `git status --short` de Verificación. ✓
- Review Focus, umbral superado o heap creciente → Task 1, §3 de `research.md`. ✓
