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

1. **Modelo y effort**: Task 1 en la sesión, Sonnet con effort medium — un script corto de medición, sin código de producción. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native — un spike siempre lo es.
3. **`seed` no existe en el código**: la spec habla de cargar las reservas «con `seed`», pero `src/app.js` no tiene ningún `seed` ni exporta `bookings`, y un spike no deja código de producción. El script de medida hace el seed: lee `src/app.js`, sustituye la línea `const bookings = [...]` por 1.000 reservas activas y lo importa desde un fichero temporal. Producción queda intacta.
4. **Forma de la peor carga**: las 1.000 reservas son de `Norte`, `lun`, `10:00-12:00`, `active`. Así `Sur` queda libre y su `some` recorre las 1.000 sin encontrar coincidencia, que es el recorrido más largo de `freeRooms`. La consulta es `libres 10:00-12:00`.
5. **Aguante**: 10 repeticiones seguidas (§3 de `research.md`), con `heapUsed` tras cada una como «recurso acumulado».
6. **Coste estimado**: ~1 h, sin subagentes.
7. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: Medir cuánto tarda `libres` con 1.000 reservas activas en la misma franja y dejar la tabla en `research.md`.

**Architecture**: Un script Node en la carpeta de la spec carga `src/app.js` con el seed inyectado, mide `run('libres', ['10:00-12:00'])` 10 veces y escribe la salida en bruto; `research.md` la resume contra O1.

**Tech Stack**: Node 22, `node:test`, sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, porque 1 sola task sin interfaces entre tasks, un error lo caza el propio script (aborta si el seed no cargó) y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el script vive junto a la spec y no toca `src/`.

## Restricciones globales

### De código

- Node ≥ 20, ESM, sin dependencias externas (`architecture.md`: «sin dependencias externas»).
- Peor carga: 1.000 reservas activas en la misma franja (spec §Objetivos).
- Umbral de O1: `libres` responde en < 50 ms.
- No se modifica `src/app.js` ni `test/`: el spike no deja código de producción.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Texto de salida y documentos en castellano (constitution, art. 4).

### De proceso

- Native, un spike nunca se despacha. Commits con la convención del proyecto (`tipo(sdd): …`).
- Atribución de commits: la de la sesión.

## Review Focus

- El seed no carga (cambia la línea `const bookings` de `src/app.js`) → el script aborta con código 1 y un mensaje, no mide 2 reservas dando por bueno un tiempo ridículo · Task 1, el script comprueba que el resultado de `libres` sea `Sur` y que `bookings` tenga 1.000 antes de medir; verificación: ejecutar el script.
- Una repetición ≥ 50 ms o `heapUsed` creciendo entre repeticiones → se escribe en la fila de §2 y §3, no se redondea a «cumple» · Task 1, el script imprime `cumple` solo si las 10 repeticiones son < 50 ms.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un `research.md`.
- [x] **YAGNI gate**: sin framework de benchmark ni abstracciones.
- [x] **Brownfield gate**: `src/` y `test/` quedan intactos.
- [x] **Constitution check**: art. 1 (flujo SDD, spike), 2 (gate `node --test` en verde, §3), 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — carga `src/app.js` con 1.000 reservas inyectadas, mide 10 repeticiones de `libres`, imprime la salida en bruto y la línea de resultado.
- `medidas-libres.txt` — salida en bruto del script, tal cual.
- `research.md` — trazado de `research-template.md`: objetivos, aguante, recomendación, lo que sale.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — es lo medido; el seed se inyecta en una copia temporal.
- `test/` — el spike no añade comportamiento.

### 1.6 Dependencias

Ninguna fuera de Node.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La sustitución de `const bookings` no encuentra la línea y mide la carga de 1 reserva | Baja | Alto: una medida falsa | El script comprueba 1.000 reservas y resultado `Sur` antes de medir; si no, sale con 1 |
| Ruido del arranque de Node en la primera repetición | Media | Bajo | Se dejan las 10 repeticiones, se informa la mayor, y la primera se marca como fría |

### 1.8 Rollout

Directo: no llega a producción; deja evidencia y, si procede, una fila del roadmap.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: sesión Native, Sonnet, effort medium (spike: lo ejecuta el hilo principal)
**Evidencia**: O1 · salida en bruto en `medidas-libres.txt`, script `medir-libres.mjs`, ambos en la carpeta de la spec · filas de `research.md` §2 y §3, calcado de su plantilla

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → sale con 0 y su última línea es `RESULTADO O1 cumple` o `RESULTADO O1 no cumple`, con `max=<n> ms`; si el seed no cargó, sale con 1 y `seed: …`
**Se prueba en la aplicación**: no, porque es una medición: la aplicación no cambia.

**Interfaces**:
- Consume: `run(cmd, params)` exportada por `src/app.js`; la línea `const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];` que el script sustituye.
- Produce: `medidas-libres.txt` con una línea por repetición `rep <n> <ms> ms heap <bytes>` y la línea de resultado; `research.md` con O1.

**Ficheros**: crear `medir-libres.mjs`, `medidas-libres.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script** — `medir-libres.mjs`: lee `../../../../src/app.js` con `readFileSync`, sustituye con una expresión regular `const bookings = [...]` por un array de 1.000 `{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }`, lo escribe en `os.tmpdir()` y lo importa con `import()`. Antes de medir comprueba que `run('libres', ['10:00-12:00'])` sea `'Sur'`; si no, `console.error('seed: …')` y `process.exit(1)`. Mide 10 repeticiones seguidas con `performance.now()`, imprime `rep <n> <ms> ms heap <heapUsed>` y, al final, `RESULTADO O1 cumple max=<ms> ms` si todas son < 50, o `RESULTADO O1 no cumple max=<ms> ms`. Borra el fichero temporal al acabar.
- [ ] **Step 2: Medir** — ejecutar el script y guardar la salida literal: `node …/medir-libres.mjs > …/medidas-libres.txt`. Esperado: salida 0, 10 líneas `rep` y la de `RESULTADO`.
- [ ] **Step 3: `research.md`** — trazado de `research-template.md` (`timeboxed: 2h`): §2 con O1 y su estado según `medidas-libres.txt`, con la cifra máxima; §3 con las 10 repeticiones y `heapUsed`, diciendo si el recurso crece; §4 recomendación citando solo filas medidas, respondiendo «si `libres` necesita una caché antes de abrirlo a toda la oficina»; §5 `nada` o una fila del roadmap por abrir.
- [ ] **Step 4: Verificación** — repetir el comando de «Verificación» y comprobar que `RESULTADO O1` coincide con `research.md`.
- [ ] **Step 5: Commit de la task** — `docs(sdd): medidas de libres con 1.000 reservas (0031)`.

---

## Estimación y esfuerzo

- Tipo: chore
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 0,5h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 1 task, script corto sin dependencias, sin referencia previa en el estimation-log
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec: O1 con su estado en `research.md` §2
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, línea `RESULTADO O1` y fila O1 de `research.md` §2. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, comprobación de 1.000 reservas y resultado `Sur` antes de medir (decisión 3: el `seed` lo hace el script). ✓
- Decisión que desbloquea: si `libres` necesita una caché → Task 1, `research.md` §4. ✓
- Aguante con la peor carga → Task 1, 10 repeticiones en `research.md` §3. ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Review Focus: seed que no carga → Task 1, comprobación del script; umbral y recurso creciente → Task 1, línea `RESULTADO` y §3. ✓
