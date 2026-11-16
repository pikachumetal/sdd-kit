---
id: 20261015-110000-feature-0031-free-rooms-load
feature: 0031
title: Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-10-15
---

# Plan de implementación — Spike: ¿aguanta `libres` 1.000 reservas?

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: una sola task, la hace la sesión (Native) sin despacho; la revisión final de rama va con el modelo de `sdd-verify` (Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`), también con una task.
2. **Ejecución**: native, fijado en `sdd-kit.json` (y un spike es siempre Native).
3. **La carga no usa un comando `seed`**: la spec dice «cargadas con `seed`», pero `src/app.js` no tiene ese comando y `bookings` no se exporta. Crearlo sería código de producción, y un spike no lo deja. El script de medida hace de `seed`: lee `src/app.js`, sustituye la línea `const bookings = …` por 1.000 reservas activas en una copia temporal y la importa. `src/app.js` no cambia. Si prefieres un `seed` real, es otra fila del roadmap.
4. **Peor carga concreta** (dentro de lo que confirmó el dev-lead, «1.000 reservas activas en la misma franja»): las 1.000 son de `Norte` en `10:00-12:00`, y se consulta esa franja. `Norte` sale al primer acierto, pero `Sur` recorre las 1.000: es el recorrido completo de `freeRooms`.
5. **Una repetición = una llamada a `libres`**, cronometrada con `process.hrtime.bigint()`. La primera, en frío, cuenta como repetición 1 (sin calentamiento descartado). 12 repeticiones seguidas (la spec exige ≥ 10 en «Aguante»); «recurso acumulado» = `process.memoryUsage().heapUsed` tras cada una.
6. **Riesgos altos**: ninguno. Una llamada de este tamaño puede medirse en microsegundos; la tabla lo dirá con su cifra, sin redondear a 0.
7. **Coste estimado**: ~1 h de implementación, sin subagentes (coste de tokens: el de una sesión corta).
8. Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar la tabla de medidas de `libres` con 1.000 reservas y una recomendación sobre si necesita caché.

**Architecture**: un script de medida en la carpeta de la spec importa una copia temporal de `src/app.js` con la carga sembrada, mide y escribe la salida en bruto; `research.md` la resume. Nada de producción cambia.

**Tech Stack**: Node 22, `node:test`, sin dependencias externas.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato: el script vive en la carpeta de la spec y no toca `src/`.

## Restricciones globales

### De código

- Node 22, sin dependencias externas (`architecture.md`).
- Texto de la interfaz y de los documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio.
- No se modifica nada bajo `src/`: el spike no deja código de producción.

### De proceso

- Native: la sesión implementa la task; la revisión final de `sdd-verify` revisa la rama por ejes.
- Commits en castellano con la convención del proyecto (`tipo(ámbito): …`) y la atribución del kit.

## Review Focus

- La medida deja `src/app.js` intacto (el script sustituye el array solo en la copia temporal) → `git diff --exit-code -- src` sin salida, y la copia se borra · Task 1, verificación `git diff --exit-code -- src`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y un documento; nada más.
- [x] **YAGNI gate**: no se crea `seed` ni se abstrae el script.
- [x] **Brownfield gate**: sin cambios en `src/`, retrocompatible por construcción.
- [x] **Constitution check**: art. 1 (flujo SDD), art. 2 (gate de cierre `node --test` en verde), art. 4 (castellano).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (todo en `.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/`):

- `medir-libres.mjs` — carga 1.000 reservas en una copia temporal de `src/app.js`, llama 12 veces a `libres` y escribe una línea por repetición.
- `evidencia/libres-1000.txt` — salida en bruto del script.
- `research.md` — calcado de `research-template.md`: objetivo O1, aguante, recomendación y lo que sale.

**Modificar**: ninguno.

**NO se tocan**:

- `src/app.js` — el spike no deja código de producción.
- `test/` — no hay comportamiento nuevo que testear; la evidencia es la medida.

### 1.2 a 1.6

No aplican (sin datos, migraciones, API, UX ni dependencias).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La sustitución de `const bookings = …` no encuentra la línea y mide con 1 reserva | baja | alto | el script falla si el regex no casa y escribe en su salida cuántas reservas tenía la copia |
| Ruido de arranque falsea la repetición 1 | media | bajo | se deja la repetición 1 en frío en la tabla, rotulada |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Medir `libres` con 1.000 reservas

**Tras**: —
**Modelo**: la sesión Native, sin despacho (gama media: Sonnet, effort medium).
**Evidencia**: O1 (`libres` con 1.000 reservas responde en < 50 ms) · `evidencia/libres-1000.txt`, que saca `medir-libres.mjs` · filas O1 y «Aguante» de `research.md`.

**Superficies**: tooling · docs
**Verificación**: `node .docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load/medir-libres.mjs` → termina con código 0 y la salida lleva `reservas: 1000` y 12 líneas `rep`; `git diff --exit-code -- src` → sin salida y código 0.
**Se prueba en la aplicación**: no, porque investigación: no cambia lo que ve el usuario.

**Interfaces**:
- Consume: `run(cmd, params)` exportada por `src/app.js`; la línea `const bookings = [...]` de ese fichero (que el script sustituye en una copia).
- Produce: `evidencia/libres-1000.txt` con el formato:
  `reservas: 1000` · `rep <n> ms=<decimal con 3 cifras> heapUsed=<bytes>` ×12 · `max ms=<…>` .

**Ficheros**: crear `medir-libres.mjs`, `evidencia/libres-1000.txt`, `research.md` en la carpeta de la spec.

- [ ] **Step 1: Script** — `medir-libres.mjs` (ESM, sin dependencias):
  - lee `../../../../src/app.js` desde `import.meta.url`;
  - sustituye con `/^const bookings = .*$/m` por `const bookings = Array.from({ length: 1000 }, () => ({ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }));`; si no casa, `process.exit(1)` con mensaje;
  - escribe la copia en `os.tmpdir()` como `app-1000.mjs`, la importa dinámicamente y la borra al terminar (también si falla);
  - imprime `reservas: 1000`; ejecuta 12 veces `run('libres', ['10:00-12:00'])` seguidas, cada una cronometrada con `process.hrtime.bigint()`, e imprime `rep <n> ms=<x.xxx> heapUsed=<bytes>`; al final `max ms=<x.xxx>`.
- [ ] **Step 2: Medir** — `node …/medir-libres.mjs > …/evidencia/libres-1000.txt` (creando `evidencia/`). Esperado: código 0, 12 repeticiones, `reservas: 1000`.
- [ ] **Step 3: research.md** — calcado de `research-template.md`, con `status: draft`: fila O1 con `cumple` si `max ms` < 50, `no cumple tal como se definió` si no (con su cifra), la tabla «Aguante» con las 12 repeticiones (diciendo si `heapUsed` crece), la recomendación citando solo filas medidas («abrir `libres` sin caché» o «cachear») y «Lo que sale»: `nada`, salvo que la medida muestre un arreglo.
- [ ] **Step 4: Verificación** — los dos comandos de «Verificación», con el resultado esperado.
- [ ] **Step 5: Commit de la task** — `docs(sdd): medir libres con 1.000 reservas (spike 0031)`; uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,25h
- Estimación de cierre: 0,25h
- Base de la estimación: 1 task, un script corto y un documento; incertidumbre baja
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): O1 con su fila en `research.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 — `libres` con 1.000 reservas responde en < 50 ms → Task 1, filas O1 y «Aguante» de `research.md` con la salida de `evidencia/libres-1000.txt`. ✓
- Peor carga: 1.000 reservas activas en la misma franja, cargadas con `seed` → Task 1, línea `reservas: 1000` de la salida; la carga no usa un `seed` real (decisión 3). ✓
- Decisión que desbloquea (¿necesita caché?) → Task 1, recomendación de `research.md`. ✓
- Review Focus (`src/` intacto) → Task 1, `git diff --exit-code -- src`. ✓
