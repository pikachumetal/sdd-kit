---
id: 20261101-163507-feature-0276-triage-by-cause
feature: 0276
title: Plan de implementación — Triaje de la deuda por causa
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Triaje de la deuda por causa

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: la sesión implementa las tres tasks; ejes de la revisión final con el modelo de `sdd-verify`.
2. Ejecución: Native (abajo).
3. Vocabularios en `cli/src/roadmap/debt.ts`, sin fichero nuevo: solo los usa el check, y el test compara la plantilla con ellos.
4. Riesgo alto: que los índices de columna queden mal; lo anclan los tests de forma y de caducidad.
5. Coste estimado: 2,5 h y ~7,5 $ de sujetos.
6. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el triaje junta los casos por causa, y `sdd roadmap check` valida la forma nueva de `debt.md`.

**Architecture**: la forma vive en `debt-template.md` y la comprueba `debt.ts`. La conducta vive en las skills `sdd-roadmap` y `sdd-debugging`, y la migración lleva las celdas nuevas.

**Tech Stack**: TypeScript sin compilar, Vitest y baterías de skills (`tests/headless/battery.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks poco acopladas (solo comparten las cabeceras literales), un error lo caza el test o el escenario de su task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulos, dependencias ni contratos entre módulos; cambia la forma de una tabla que ya valida el mismo módulo.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean Code: nombres en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano en castellano con tildes.
- Causas, literales: `entorno de la máquina`, `carga o paralelismo`, `herramienta del kit`, `regla lejos de su paso`, `decisión que no era del agente`, `fusión de registros`, `prueba o molde`, `defecto del producto`, `sin determinar`.
- Arreglos, literales y en orden: `comprobación automática`, `conectar comprobación`, `mover regla`, `línea nueva`.
- El tope de palabras de `sdd-roadmap` no sube, y el de `sdd-debugging` tampoco sin parar a preguntar.

### De proceso

- Política de modelos: sujetos en Sonnet, `MAX_PARALLEL=1`; `KIT_DIR` es una copia con `git archive`, `RUNS_DIR` es `.temp/r0276` (máximo 100 caracteres).
- Commit por task, tipo/scope en inglés, cuerpo en castellano y atribución del sistema.

## Review Focus

- Una celda «Origen» sin enlaces (`roadmap 2.x`, texto suelto) → cero casos, sin exigir remedio · Task 1, `does not count plain text as cases`
- Fila con prefijo `saldada` y causa inválida escrita → no se valida: el prefijo la exime · Task 1, `exempts a settled row`
- Un «Destino» con `· causa:` y un id en otra marca (`**Actuar → 0149**`) → el aviso de fila cerrada sigue saliendo · Task 1, `warns with the cause suffix`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin sección nueva ni fichero de vocabularios.
- [x] **YAGNI gate**: sin abstracción nueva.
- [x] **Brownfield gate**: `debt.md` no está publicado (2.3.4); sin retrocompatibilidad que guardar.
- [x] **Constitution check**: Art. I (RED, batería, previsión en la spec), Art. V (migración), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-roadmap/mold-salas-3-cause/docs/tickets/2026-10-25-red.md` y `2026-10-27-timeout.md` — el negativo `relanza`.
- `tests/batteries/sdd-roadmap/mold-salas-cause-2x/` — tickets para `c2`.
- `tests/batteries/sdd-debugging/mold-remedy/` — el fallo y la deuda de `d2`.

**Modificar**:

- `skills/sdd-templates/templates/debt-template.md`, `cli/src/roadmap/debt.ts`, `cli/test/roadmap/{debt.test,project,check.test}.ts`.
- `tests/batteries/sdd-roadmap/mold-salas-3{,-plain,-wt,-cause}/.docs/sdd/steering/debt.md`, `tests/batteries/sdd-archive/subject.mjs`.
- `skills/sdd-roadmap/SKILL.md`, `skills/sdd-debugging/SKILL.md`, baterías de `sdd-roadmap` y `sdd-debugging`.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md`, batería de `sdd-upgrade`.

**NO se tocan**:

- `cli/src/merge/keyed.ts`, `cli/src/ids/claim.ts`: «Ítem» sigue en la columna 0, y la renumeración no mira columnas.
- La deuda de este repo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La línea de `sdd-debugging` no cabe en su tope | Alta | Parada | Medir antes; frase mínima; si no cabe, parar y preguntar |
| `v1` cuesta más de lo previsto | Media | Bajo | `COST_CAP` y un solo sujeto |

### 1.8 Rollout

Directo: entra en la 3.0.0, aún sin publicar.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La forma nueva de `debt.md`, en la plantilla y en el check

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/roadmap/debt.test.ts`, `check.test.ts`, sin commitear hasta el commit de la task.
**Superficies**: tooling
**Verificación**: `npx vitest run test/roadmap` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: no, porque es forma de un documento: lo prueba el check.

**Interfaces**:
- Consume: nada.
- Produce: las cabeceras `| Ítem | Causa | Origen | Impacto | Falta | Fecha |`, `| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |` y `| Ítem | Causa | Origen | Motivo | Fecha |`.

**Ficheros**: `debt-template.md`, `cli/src/roadmap/debt.ts`, `cli/test/roadmap/debt.test.ts`, `project.ts`, `check.test.ts`, los `debt.md` de los moldes de `sdd-roadmap`, `tests/batteries/sdd-archive/subject.mjs`.

- [ ] **Step 1: Tests** — en `debt.test.ts`, con los literales de los dos ADDED de `roadmap` de la spec: `rejects a cause out of the list` (línea 8 `mala suerte`, línea 20 `—`), `rejects a fix type out of the list`, `rejects sin determinar in Lista`, `accepts a dash fix only for defecto del producto`, `exempts a settled row`, `requires a remedy with two distinct links` (a.md+b.md y a.md#1+a.md#2 fallan; a.md+a.md y a.md no), `does not count plain text as cases`, `the template names every cause and fix type`. En `check.test.ts`, `warns with the cause suffix`, con `**Actuar** → 0149 · causa: herramienta del kit · arreglo: mover regla`. Actualizar fixtures y cabeceras viejas. Ver el rojo.
- [ ] **Step 2: Implementación** — en `debt.ts`: `CAUSES` y `FIX_TYPES` como arrays exportados con los literales, en el orden de arriba; `HEADERS` nuevos; `DATE_COLUMN`: «Por triar» 2, «En espera» 5, «Descartadas» 4; `causeProblems(row)`, `fixProblems(row, cause)`, `remedyProblems(row)` y `caseCount(origin): number` (enlaces `](destino)` distintos, con ancla). Mensajes, literales de la spec. `isSettled(item)`: empieza por `**[` y lleva `: saldada — `. En la plantilla: cabeceras, ejemplos, una línea de definición por causa, desempate («la causa es la raíz que desaparece con el remedio»), el orden de arreglo y el contraejemplo de `ninguno`.
- [ ] **Step 3: Moldes** — cabeceras nuevas y filas con causa en los `debt.md` de `mold-salas-3`, `-plain`, `-wt` y `-cause`, y en `subject.mjs:357` de `sdd-archive`.
- [ ] **Step 4: Verificación** — Esperado: `Tests  N passed (N)`, sin fallos, y `moon run cli:typecheck` en verde. Si `warnings.ts` no reconoce el sufijo, arreglarlo aquí.
- [ ] **Step 5: Commit de la task**.

### Task 2 — El triaje por causa y la búsqueda en la deuda al depurar

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: el RED son los sujetos: `c1` ya medido (`red/out/`); `d2` se mide antes de editar `sdd-debugging`.
**Superficies**: docs (skills), tooling (baterías)
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`, y las tablas de batería de abajo.
**Se prueba en la aplicación**: no, porque es guía de un agente: la miden los sujetos.

**Interfaces**:
- Consume: las cabeceras de la Task 1.
- Produce: la forma 2.x `**Actuar** → <id> · causa: <causa> · arreglo: <arreglo> · remedio: <remedio>`, `**Esperar 2.º ticket** · causa: <causa> — falta <qué>`, `**Descartada** · causa: <causa>: <motivo>`.

**Ficheros**: `skills/sdd-roadmap/SKILL.md`, `skills/sdd-debugging/SKILL.md`, baterías y moldes de las dos.

- [ ] **Step 1: Moldes** — `mold-salas-3-cause` con las dos filas `relanza` y sus tickets; `salas-cause-2x` (2.x con los dos tickets del `RUNS_DIR` y la fila `**Esperar 2.º ticket** — falta 2.º caso`); `mold-remedy` de `sdd-debugging`: `npm run informe` falla con `ENOENT` sobre `.cache/informes/ocupacion.csv`, y `debt.md` trae la fila de problema de la spec. Escenarios `c2`, `d2`; rúbrica `C1`, `C2`, `D2`, y `M3`, `M6` ampliadas.
- [ ] **Step 2: RED de `d2`** — 2 sujetos sobre `.temp/kit0276`. Esperado: mira la deuda 0 de 2. Si sale limpio, la regla no se escribe y se dice (Art. I: reencuadrar y volver a pedir aprobación).
- [ ] **Step 3: `sdd-roadmap`** — en Triage: causa, 2.º caso por mecanismo con todas las filas y la tanda, filas sin causa, remedio, orden de arreglo; las causas escritas. En la tabla de equivalencias, las formas 2.x. Quitar las cuatro repeticiones del Scope de la spec. Palabras ≤ tope.
- [ ] **Step 4: `sdd-debugging`** — paso en Fase 1 con la frase mínima; el remedio no es la causa raíz. Palabras ≤ tope, o parar.
- [ ] **Step 5: GREEN** — `c1`, `c2`, `m6`, `d2` × 2; controles `m3`, `m5` × 2, `a9` × 1. Esperado: rúbricas sin fallo. Evidencia en `green/` y en `tests/batteries/*/battery.md`, Procedencia.
- [ ] **Step 6: Commit de la task**.

### Task 3 — La migración lleva las celdas nuevas

**Tras**: Task 1, Task 2
**Modelo**: la sesión (Native).
**Tests RED**: rúbrica V3 ampliada; el molde `mold-v2x` gana una fila con `· causa:`.
**Superficies**: docs (migración), tooling (batería)
**Verificación**: `npx vitest run test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`, y `v1` × 1.
**Se prueba en la aplicación**: no, porque es migración de documentos: la mide `v1`.

**Interfaces**:
- Consume: las cabeceras de la Task 1 y las formas 2.x de la Task 2.
- Produce: nada.

**Ficheros**: `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/batteries/sdd-upgrade/battery.md`, `mold-v2x`.

- [ ] **Step 1: Migración** — paso 3: columna de celdas nuevas, extracción de «Falta» y «Motivo» sin marcas, propuesta en la tabla, fila rechazada a «Por triar», remedio con dos o más enlaces, un solo enlace por caso en «Origen».
- [ ] **Step 2: Medición** — `v1` × 1, con la rúbrica V3 ampliada y `sdd roadmap check` en verde.
- [ ] **Step 3: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 2,5 h
- Base de la estimación: 3 tasks, con campaña de sujetos; 0151 como referencia
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `roadmap`, MODIFIED forma, cabeceras, orden, secciones → Task 1, `debt.test.ts`. ✓
- `roadmap`, MODIFIED aviso con sufijo → Task 1, `warns with the cause suffix`. ✓
- `roadmap`, ADDED causa y arreglo, con cada AND → Task 1, los tests de causa, arreglo y plantilla. ✓
- `roadmap`, ADDED remedio → Task 1, `requires a remedy with two distinct links`. ✓
- `planning`, ADDED 2.º caso, con cada AND → Task 2, `c1` (rúbrica C1). La reclasificación por otra categoría → sin molde propio, la mira C1 si un sujeto clasifica distinto. ⚠
- `planning`, ADDED 2.x → Task 2, `c2`. ✓
- `planning`, MODIFIED triaje y 2.x → Task 2, `m3`, `m6`. ✓
- `feature-flow`, ADDED deuda al depurar → Task 2, `d2`; «sin fila, sigue la Fase 1» → `d1` como control. ✓
- `migration`, MODIFIED → Task 3, `v1`. ✓
- Review Focus → Task 1, los tres tests. ✓
