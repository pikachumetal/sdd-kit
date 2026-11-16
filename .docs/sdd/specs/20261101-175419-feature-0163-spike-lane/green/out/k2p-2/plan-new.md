---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, en el hilo principal, Sonnet con effort medium: el script ya viene especificado línea a línea. La revisión final de rama sigue la política de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native (un spike es siempre Native), una task y un fichero nuevo.
3. **`seed` no existe en el repo**: la spec habla de «cargadas con `seed`» y no hay ningún comando ni función con ese nombre. Lo resuelvo con un script de medición dentro de la carpeta del spike que genera las 1.000 reservas y las inyecta en una copia temporal de `src/app.js`; `src/app.js` no se toca (un spike no deja código de producción).
4. **Peor carga, concretada**: 1.000 reservas `active` en la franja `10:00-12:00`, 998 de salas que no están en el catálogo y las de `Norte` y `Sur` al final del array, para que `some` recorra el array entero con ambas salas (el recorrido más largo posible). Es la carga que confirmó el dev-lead: misma franja, 1.000 activas.
5. **Cómo se mide**: una llamada fría (la primera) y 200 llamadas seguidas a `run('libres', ['10:00-12:00'])` con `performance.now()`; se informan mediana, p95 y máximo. O1 se da por cumplido si el **máximo** de las 200 es < 50 ms (el criterio más estricto, para no esconder un pico).
6. **Qué entrega**: la salida en bruto en `evidencia-o1.txt`, con la línea de veredicto de O1 y la respuesta a «¿necesita caché?» (sí si O1 no se cumple; no si se cumple).
7. **Coste estimado**: 0,4 h, sin subagentes de implementación; la revisión final de rama es el único despacho.
8. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: medir cuánto tarda `libres` con 1.000 reservas activas en la misma franja y dejar la tabla de medidas como evidencia.

**Architecture**: un script de medición en la carpeta del spike carga una copia temporal de `src/app.js` con las reservas sembradas y cronometra `run('libres', …)`. No hay cambios en `src/`.

**Tech Stack**: Node 22, sin dependencias (`tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade un script de medición en la carpeta del spike; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- La carga de O1 es exactamente 1.000 reservas `active` en la franja `10:00-12:00`; el límite es 50 ms.
- `src/app.js` no se modifica: el script trabaja sobre una copia en el directorio temporal.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, nombres que se explican solos.
- Texto de salida del script en castellano (constitution, art. 4).

### De proceso

- Native: la implementa el hilo principal, Sonnet con effort medium.
- Un spike no deja código de producción: lo que sale va a su propia fila del roadmap.
- Commits con la atribución que fija el kit.

## Review Focus

- La carga no llega a aplicarse (la regex no encuentra `const bookings` y se mide con la reserva de serie) → el script aborta con error, no mide · Task 1, comprobación `libres` devuelve cadena vacía (ambas salas ocupadas) antes de cronometrar.
- Primera llamada más lenta que las siguientes (JIT) → se informa aparte como «fría» y entra en el máximo · Task 1, la línea `fría` de `evidencia-o1.txt`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script, sin abstracciones.
- [x] **YAGNI gate**: sin parámetros por línea de comandos; constantes con nombre.
- [x] **Brownfield gate**: sin cambios en `src/`.
- [x] **Constitution check**: arts. 1–4 respetados; el gate de cierre es el de operations.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` — siembra, mide y escribe la evidencia.
- `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/evidencia-o1.txt` — salida en bruto de la ejecución.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — es lo medido; un spike no lo cambia.
- `test/` — no hay comportamiento nuevo que testear.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Ruido de la máquina en la medida | media | un máximo falso por encima de 50 ms | se informan mediana y p95 junto al máximo; si el máximo es el único que falla, se repite una vez y se anotan ambas |
| El script de la carpeta del spike lo recoja `node --test` | baja | gate de cierre ejecuta la medición | el nombre `medir-libres.mjs` no casa con los patrones de `node --test` |

### 1.8 Rollout

Directo: no hay despliegue; la entrega es la evidencia.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: Sonnet con effort medium, en el hilo principal (Native: sin despacho).
**Evidencia**: O1 · `evidencia-o1.txt`, en la carpeta de la spec.

**Superficies**: tooling
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → termina con código 0 y su última línea es `O1: cumple (máximo <x> ms, límite 50 ms)` o `O1: no cumple (máximo <x> ms, límite 50 ms)`; ambos son un resultado válido. Un código distinto de 0 es un fallo del script, no una medida.
**Se prueba en la aplicación**: no, porque es una investigación: no cambia ninguna aplicación.

**Interfaces**:
- Consume: de `src/app.js`, la línea `const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];` (se sustituye en la copia) y `export function run(cmd, params)`; `run('libres', ['10:00-12:00'])` devuelve los nombres de las salas libres separados por `, `, o `''` si no hay ninguna.
- Produce: `evidencia-o1.txt` con, en este orden: la carga (`reservas: 1000`, `franja: 10:00-12:00`), `fría: <x> ms`, `mediana: <x> ms`, `p95: <x> ms`, `máximo: <x> ms`, y la línea `O1: cumple|no cumple (máximo <x> ms, límite 50 ms)`; después `¿Necesita caché?: no|sí, porque O1 <cumple|no cumple>`.

**Ficheros**: crear `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs`

- [ ] **Step 1: Script** — constantes `RESERVAS = 1000`, `FRANJA = '10:00-12:00'`, `REPETICIONES = 200`, `LIMITE_MS = 50`. Funciones: `sembrar()` devuelve el literal del array: 998 reservas `{ room: 'Sala-<i>', day: 'lun', slot: FRANJA, status: 'active' }` y después una de `Norte` y una de `Sur`, con `day: 'lun'`. `cargarAppSembrada()` lee `src/app.js`, sustituye con `source.replace(/^const bookings = \[.*\];$/m, …)` y **lanza un error si el texto no cambia**, escribe la copia como `app.mjs` en un `fs.mkdtempSync(path.join(os.tmpdir(), 'libres-'))` e importa con `import(pathToFileURL(copia).href)`. Antes de cronometrar comprueba que `run('libres', [FRANJA]) === ''`; si no, lanza error. Mide la llamada fría y las `REPETICIONES` siguientes con `performance.now()`, calcula mediana, p95 y máximo, imprime las líneas de «Produce» y escribe lo mismo en `evidencia-o1.txt` junto al script con `fs.writeFileSync`. Borra el directorio temporal al terminar.
- [ ] **Step 2: Build** — no aplica (sin build). Esperado: n/a.
- [ ] **Step 3: Verificación** — ejecutar el comando de «Verificación». Esperado: código 0, `evidencia-o1.txt` con las siete líneas de «Produce» y el veredicto. Si el máximo falla y la mediana no, repetir una vez y anotar ambas ejecuciones en el fichero.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: `docs(sdd): medidas del spike 0031` con el script y la evidencia.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,4 h (aproximado)
- Estimación de implementación: 0,4 h
- Base de la estimación: 1 task, un script de unas 50 líneas y una ejecución; sin referencia en el estimation-log.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su fila de medida en `evidencia-o1.txt`
- [ ] Spec satisfecha: cada objetivo tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, líneas `máximo` y `O1:` de `evidencia-o1.txt`. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, `sembrar()` y la comprobación `run(...) === ''` antes de medir (el `seed` no existe: decisión 3). ✓
- Decisión que desbloquea: si `libres` necesita una caché → Task 1, línea `¿Necesita caché?` de `evidencia-o1.txt`. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus, carga no aplicada → Task 1, el error de `cargarAppSembrada()` y la comprobación previa. ✓
- Review Focus, llamada fría → Task 1, línea `fría` de `evidencia-o1.txt`. ✓
