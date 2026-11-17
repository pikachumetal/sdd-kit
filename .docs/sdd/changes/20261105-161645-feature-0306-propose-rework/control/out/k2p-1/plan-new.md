---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **`seed` no existe en el código** — la spec dice «cargadas con `seed`», pero `src/app.js` no tiene ningún `seed` y `bookings` no se exporta. El script de medida copia `src/app.js` a un directorio temporal, le añade las 999 reservas tras la declaración de `bookings` y mide esa copia: se mide el `freeRooms` real y no se toca producción. Si el dev-lead se refería a otro `seed`, se cambia aquí.
2. **Forma de la carga** — 1.000 reservas activas en `10:00-12:00` (la original más 999, todas de `Norte`, `day` distinto). `Sur` queda libre, así que su `some()` recorre las 1.000: es el peor caso de `freeRooms` para la franja confirmada.
3. **Aguante** — 12 repeticiones seguidas (la spec exige ≥ 10), la primera en frío y sin calentamiento previo, midiendo el tiempo de `run('libres', ['10:00-12:00'])` con `performance.now()` y `heapUsed` tras `gc()`. O1 solo es `cumple` si **todas** las repeticiones, la fría incluida, bajan de 50 ms.
4. **Ejecución** — native, fijado en `sdd-kit.json` (y un spike es siempre Native). Modelo: la propia sesión; una sola task, sin subagentes. Revisión final de rama con los ejes de `sdd-verify`.
5. **Coste estimado** — 0,5 h, sin despachos.
6. **Review Focus** — 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar medido si `libres` aguanta 1.000 reservas activas en < 50 ms, con la tabla y la recomendación sobre la caché.

**Architecture**: un script de medida en la carpeta de la spec que prepara una copia sembrada de `src/app.js`, repite la llamada y escribe la salida en bruto; la tabla de `research.md` sale de esa salida. No hay código de producción.

**Tech Stack**: Node 22, `node:perf_hooks`, `node:fs`, `node:os`; sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no se añade módulo, dependencia ni contrato; solo un script y un `research.md` en la carpeta de la spec.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- No se modifica nada bajo `src/`: el spike no deja código de producción.
- Umbral de O1: < 50 ms; carga: 1.000 reservas activas en la misma franja.

### De proceso

- Atribución de commits: la del proyecto (`Co-Authored-By` del kit).
- Un spike es siempre Native, `delegate`: sin paradas intermedias.

## Review Focus

- Primera repetición en frío más lenta que las siguientes → se registra y cuenta para O1 igual que las demás, sin descartarla · Task 1, la salida en bruto lista las 12 filas y la fila de `research.md` cita el máximo.
- Memoria creciendo entre repeticiones aunque el tiempo cumpla → se dice en el Detalle de O1 y en la Recomendación · Task 1, columna «Recurso acumulado» de `research.md` §3.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento, sin más.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: `src/` intacto.
- [x] **Constitution check**: tests antes que código no aplica a un spike sin código de producción; gate de cierre intacto; documentos en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — prepara la copia sembrada de `src/app.js`, hace las 12 repeticiones y escribe `medidas.txt`.
- `medidas.txt` — salida en bruto del script.
- `research.md` — tabla de objetivos, aguante y recomendación, calcado de `research-template.md`.

**Modificar**: nada.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción.
- `test/` — no hay comportamiento nuevo que probar.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La copia sembrada difiere del `seed` que el dev-lead tenía en mente | Media | Medida de otra carga | Decisión 1, a validar |
| 1.000 reservas miden por debajo del ruido del reloj | Media | Cifras de 0,0x ms poco informativas | Se registran con 3 decimales; el veredicto se apoya en el máximo |

### 1.8 Rollout

Directo: no hay despliegue; lo que sale va a su fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: native, la propia sesión (Sonnet, effort medium).

**Evidencia**: O1 · salida en bruto `medidas.txt` y el script `medir-libres.mjs`, en la carpeta de la spec · fila O1 y tabla §3 de `research.md`.

**Superficies**: tooling · docs
**Verificación**: `node --expose-gc .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → sale con 0 y su última línea es `medidas: 12 repeticiones, 1000 reservas`; `git diff --stat -- src` → vacío.
**Se prueba en la aplicación**: no, porque no cambia ninguna aplicación: es una medida.

**Interfaces**:
- Consume: `run(cmd, params)` de `src/app.js` (`run('libres', ['10:00-12:00'])` → `'Sur'`) a través de la copia sembrada.
- Produce: `medidas.txt` con una línea por repetición `rep <n> · <ms con 3 decimales> ms · heapUsed <bytes>`, más la línea final `medidas: <n> repeticiones, <m> reservas`.

**Ficheros**: crear `medir-libres.mjs`, `medidas.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script** — `medir-libres.mjs`: lee `src/app.js` (ruta relativa a `import.meta.url`, subiendo a la raíz del repo); sustituye la línea `const bookings = [...]` por ella más un bucle que añade 999 reservas `{ room: 'Norte', day: 'd'+i, slot: '10:00-12:00', status: 'active' }` y `export const bookingCount = bookings.length;`; la escribe como `app.mjs` en `mkdtemp(os.tmpdir())` e `import()`a; aborta con código 1 si `bookingCount !== 1000` o si `run('libres', ['10:00-12:00'])` no devuelve `'Sur'`. Bucle de 12 repeticiones seguidas: `global.gc()`, `heapUsed` previo, `performance.now()` alrededor de `run(...)`, imprime y acumula la línea `rep <n> · <ms> ms · heapUsed <bytes>`. Cierra con `medidas: 12 repeticiones, 1000 reservas`. Borra el directorio temporal.
- [ ] **Step 2: Ejecutar** — correr la Verificación con la salida redirigida: `... | tee medidas.txt`; comprobar la línea final y que `src/` no cambia.
- [ ] **Step 3: research.md** — calcado de `research-template.md` (`timeboxed: 2h`): §1 la pregunta de la spec; §2 fila O1 con estado según la regla de la plantilla (`cumple` solo si las 12 bajan de 50 ms; si no, `no cumple tal como se definió`), el máximo y la mediana en el Detalle, y `medidas.txt` como Evidencia; §3 la carga de la spec y las 12 filas con tiempo y `heapUsed`, diciendo si el recurso crece; §4 la recomendación sobre la caché citando solo filas medidas; §5 `nada` o la fila de roadmap por abrir.
- [ ] **Step 4: Commit de la task** — uno solo: `docs(sdd): medir libres con 1.000 reservas (spike 0031)`, con la atribución del kit.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,2 h
- Estimación de cierre: 0,2 h
- Base de la estimación: 1 task, sin código de producción, sin referencias en el estimation-log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): fila O1 de `research.md` con estado y evidencia
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, filas `rep 1…12` de `medidas.txt` y fila O1 de `research.md`. ✓
- Peor carga: 1.000 reservas activas en la misma franja → Task 1, el script aborta si `bookingCount !== 1000` y la línea final lo declara. ✓
- «Decisión que desbloquea»: si `libres` necesita caché → Task 1, `research.md` §4 con filas medidas. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: primera repetición en frío → Task 1, las 12 filas de `medidas.txt`. ✓
- Review Focus: recurso creciente → Task 1, columna «Recurso acumulado» de `research.md` §3. ✓
