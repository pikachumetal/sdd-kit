---
id: 20261105-115850-feature-0316-upgrade-migrations-english
feature: 0316
title: Plan de implementación — Las migraciones de sdd-upgrade en inglés
spec: ./spec.md
status: approved
created: 2026-11-05
---

# Plan de implementación — Las migraciones de sdd-upgrade en inglés

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa las tres tasks; no hay despachos por task. La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`. Sujetos del humo: los de la batería, en `sonnet`.
2. **Ejecución**: Native (abajo).
3. **Los literales de forma van todos en la Task 1**, en las 13 migraciones a la vez: `migration-init-parity.test.ts` lee la línea `**Writes**:` de todas, y `check.test.ts` la sección `## Verification` de la v2.0.0. Así cada task deja `cli:test` en verde.
4. **El rojo por task** es la salida de `kit:own` filtrada a los ficheros de la task: `kit:own` sigue rojo por las demás `references/` (0305, 0306, 0296, 0307), así que su código de salida no dice nada aquí.
5. **El humo va en la Task 3**, como «Verificación lenta»: un sujeto de la v3.0.0 pasa de 10 min.
6. **Riesgo alto**: que una frase traducida cambie un gate o un predicado. Lo cubre el Review Focus.
7. **Coste**: ~2,5 h de implementación; 2 sujetos, ~1,1 $ (spec, «Previsión de coste»).
- Review Focus: 3 entradas que la spec no fija con un test; ver la sección.

**Goal**: las 13 migraciones en inglés, con lo que escriben en el proyecto en castellano, sin cambiar ningún paso.

**Architecture**: traducción frase a frase (ADR 0022, regla 1). Los literales de forma (`**Writes**:`, `## Verification`, «no gate», «no changes to the project», «Also…») cambian a la vez en las migraciones, en `sdd-upgrade/SKILL.md`, en los tests que los leen y en el Art. V.

**Tech Stack**: Markdown de `skills/`; Vitest (`cli/test/`); `moon run kit:build` y `kit:own`; batería headless de `sdd-upgrade`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de traducción sin interfaces entre ellas salvo los literales de forma, que fija la Task 1; un error de traducción no lo caza un test sino el eje Spec de la revisión final y el humo, que corren igual con cualquier método; y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de `skills/`, literales de tres tests y un fixture; ningún módulo, dependencia ni contrato entre módulos nuevo.

## Restricciones globales

### De código

- La traducción sigue la frase de la fuente, una a una, sin mejorarla, reordenarla ni añadir ni quitar pasos (ADR 0022, regla 1). Cada paso conserva número, orden, predicado y marca **gate**.
- Se queda en castellano, sin tocar: lo que va entre «…», entre comillas invertidas o en bloques de código; los mensajes de commit; los nombres de secciones, columnas y campos de los documentos del proyecto. Un nombre así sin citar pasa a ir entre «…», también en negrita (`**«Origen»**`).
- Un texto de varias líneas que se escribe en el proyecto y va como prosa pasa a un bloque ```` ```markdown ```` sangrado como el texto de su paso, con su primera línea idéntica (`> **No es una capacidad.** …` en la v1.0.0).
- Literales fijos: `**Escribe**:` → `**Writes**:`; `## Verificación` → `## Verification` («Verification» al nombrarla); «sin gate» → «no gate»; «sin cambios en el proyecto» → «no changes to the project»; «Además…» de la línea de lo que escribe → «Also…»; «Los pasos van en este orden» → «The steps go in this order»; «Migración a vX.Y.Z» → «Migration to vX.Y.Z»; «Historial de las capacidades» → «Capability history»; «Propósito de las capacidades» → «Capability purpose»; «el paso se salta y lo dices / lo dice» → «skip the step and say so»; el paso 1 de la v2.3.0 → `1. **Roadmap in the template's form** («Roadmap en la forma de la plantilla»).`
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés; funciones ≤ 20 líneas y ≤ 3 parámetros; texto humano de los tests en castellano con tildes.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Native: el hilo principal implementa; ledger con `sdd task start` y `sdd task done`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI); antes de commitear, `git diff --cached --name-only`; `dist/` regenerado con `moon run kit:build` va en el commit de su task.

## Review Focus

- Un paso con predicado («Si existe…», «Si no…») cuya traducción cambia la condición o la deja ambigua → el predicado dice lo mismo que en `develop` · lo cubre el eje Spec de la revisión final, con el diff de cada migración; ningún test lo fija.
- Un texto que la migración escribe en el proyecto o dice «tal cual» y que la traducción deja en inglés (un aviso, una celda de `debt.md`, la nota de la v1.0.0) → se queda en castellano, igual que en `develop` · Task 3, humo `v1` (V3 y V8 de la rúbrica comprueban celdas y el texto de `estimation.md`); el resto, el eje Spec.
- Un paso marcado «no gate» o **gate** que pierde la marca al traducirlo → la marca sigue · Task 2, `check.test.ts` (`/no gate/i` de los pasos 6 y 7 de la v2.0.0); en la v3.0.0, el eje Spec.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: traducción y literales; nada más simple llega a cero rojos.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: los pasos no cambian; los literales cambian con todos sus lectores.
- [x] **Constitution check**: Art. I (humo y previsión en la spec), Art. III, Art. V (su literal cambia en la Task 1), ADR 0022.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `skills/sdd-upgrade/references/migrations/v*.md` (13) — traducción.
- `skills/sdd-upgrade/SKILL.md` — líneas 16 y 38 («sin gate» → «no gate»), 19, 24 y 26 («Verificación» → «Verification»), 24 (`**Escribe**:` → `**Writes**:`).
- `cli/test/kit/migration-init-parity.test.ts` — `**Writes**:` en `declaredTokens`, en el título del `it.each` y en el último `not.toContain`.
- `cli/test/capability/check.test.ts` — bloque «the 2.0.0 migration».
- `cli/test/kit/operations-gate-fields.test.ts` — «The steps go in this order».
- `tests/batteries/sdd-upgrade/v2.3.5.md` — solo `**Writes**:` y `## Verification`.
- `.docs/sdd/constitution.md` — Art. V: «no changes to the project», `**Writes**:`.
- `dist/` — `moon run kit:build`.

**NO se tocan**:

- `skills/sdd-roadmap/SKILL.md`, `skills/sdd-archive/references/records.md`, `capabilities/roadmap.md` — citan el paso 1 de la v2.3.0, que conserva su nombre entre «…».
- `.docs/sdd/tech-stack.md:314`, la batería de `sdd-archive`, `capabilities/archive.md`, `cli/test/fixtures/own/spanish-sample.md` — spec, decisión 4 y hallazgo 8.
- `capabilities/migration.md` — su delta lo fusiona `sdd-archive` al cerrar.

### 1.2 a 1.6

No aplican: sin datos, migraciones de BD, API, UX ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una frase traducida cambia un predicado o un gate | media | alto: un proyecto migra distinto | eje Spec con el diff; humo `v1` |
| Texto del proyecto que acaba en inglés | media | medio | restricción «Se queda en castellano»; V3 y V8 del humo |
| `kit:own` sigue rojo en una línea con literal del proyecto | alta | bajo | se cita o va a bloque; nunca se reescribe el literal |

### 1.8 Rollout

Directo: entra en la release 3.0.0 (0311).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Literales de forma y las migraciones cortas

**Tras**: —
**Modelo**: Native, la sesión (recomendado: sonnet, effort medium)
**Tests RED**: hilo principal · `cli/test/kit/migration-init-parity.test.ts`, `cli/test/capability/check.test.ts` (solo el test «verifies with sdd capability check…»: `/## Verification[\s\S]*/`), editados antes de las migraciones.
**Superficies**: docs (skills), tooling (tests)
**Verificación**:
- `moon run cli:test` → `Tests  <n> passed (<n>)`
- `moon run kit:own 2>&1 | grep -E "migrations/v(0\.2\.0|0\.4\.0|1\.0\.0|1\.1\.0|2\.1\.0|2\.2\.0|2\.3\.[1-4])\.md"` → sin salida (exit 1 de grep)
**Se prueba en la aplicación**: no, porque es texto que lee el agente: lo mide el humo de la Task 3.

**Interfaces**:
- Consume: nada.
- Produce: en las 13 migraciones, la línea `**Writes**:` (mismo contenido tras la etiqueta) y el título `## Verification`; en `SKILL.md`, «Verification», `**Writes**:` y «no gate».

**Ficheros**: modificar las 13 migraciones (solo los dos literales en v2.0.0, v2.3.0 y v3.0.0), `skills/sdd-upgrade/SKILL.md`, `migration-init-parity.test.ts`, `check.test.ts`, `tests/batteries/sdd-upgrade/v2.3.5.md`, `.docs/sdd/constitution.md`, `dist/`.

- [ ] **Step 1: RED** — en `migration-init-parity.test.ts`: `candidate.startsWith('**Writes**:')`, título `'%s declara lo que escribe en su línea **Writes**'`, `expect(corpus).not.toContain('**Writes**:')`; en `check.test.ts`: `/## Verification[\s\S]*/`. `moon run cli:test` → rojo en esos tests.
- [ ] **Step 2: Implementación** — `**Escribe**:` → `**Writes**:` y `## Verificación` → `## Verification` en las 13 migraciones y en `v2.3.5.md`; traducir enteras v0.2.0, v0.4.0, v1.0.0, v1.1.0 y v2.1.0 a v2.3.4 con las Restricciones de código (las seis de solo marcador, con el mismo texto salvo la versión); `SKILL.md` líneas 16, 19, 24, 26 y 38; Art. V: «con «no changes to the project», su verificación y su línea `**Writes**:`».
- [ ] **Step 2b: Build** — `moon run kit:build` → verde.
- [ ] **Step 3: Verificación** — los dos comandos de arriba.
- [ ] **Step 4: Commit de la task** — `feat(sdd-upgrade): migraciones cortas en inglés y literales de forma`.

### Task 2 — v2.0.0 y v2.3.0

**Tras**: Task 1
**Modelo**: Native, la sesión (recomendado: sonnet, effort medium)
**Tests RED**: hilo principal · `cli/test/capability/check.test.ts`, bloque «the 2.0.0 migration».
**Superficies**: docs (skills), tooling (tests)
**Verificación**:
- `moon run cli:test` → `Tests  <n> passed (<n>)`
- `moon run kit:own 2>&1 | grep -E "migrations/v2\.(0\.0|3\.0)\.md"` → sin salida
**Se prueba en la aplicación**: no, porque es texto que lee el agente.

**Interfaces**:
- Consume: los literales de la Task 1.
- Produce: los títulos «Capability history» y «Capability purpose» de los pasos 6 y 7 de la v2.0.0.

**Ficheros**: modificar `v2.0.0.md`, `v2.3.0.md`, `check.test.ts`, `dist/`.

- [ ] **Step 1: RED** — en `check.test.ts`: `stepAbout('Capability history')` y `stepAbout('Capability purpose')`, cada uno con `toMatch(/## Historial/)` o `toMatch(/## Propósito/)`, `toMatch(/no gate/i)` y `toMatch(/skip the step/i)`; en la verificación, `toMatch(/pending/i)`. `moon run cli:test` → rojo.
- [ ] **Step 2: Implementación** — traducir enteras `v2.0.0.md` y `v2.3.0.md` con las Restricciones de código; el paso 1 de la v2.3.0 con su nombre en castellano entre «…»; la frase final de la línea `**Writes**:` de la v2.0.0 empieza por «Also».
- [ ] **Step 2b: Build** — `moon run kit:build` → verde.
- [ ] **Step 3: Verificación** — los dos comandos de arriba.
- [ ] **Step 4: Commit de la task** — `feat(sdd-upgrade): migraciones a v2.0.0 y v2.3.0 en inglés`.

### Task 3 — v3.0.0 y el humo

**Tras**: Task 2
**Modelo**: Native, la sesión (recomendado: sonnet, effort medium)
**Tests RED**: hilo principal · `cli/test/kit/operations-gate-fields.test.ts`: `text.indexOf('The steps go in this order')`.
**Superficies**: docs (skills), tooling (tests)
**Verificación**:
- `moon run cli:test` → `Tests  <n> passed (<n>)`
- `moon run kit:own 2>&1 | grep -E "migrations/"` → sin salida
**Verificación lenta**: el humo, `BATTERY=sdd-upgrade SCENARIOS="m1 v1"` con `node tests/headless/battery.mjs run`, `KIT_DIR` en el `dist/` del commit de la task, `SPEC_DIR` en esta carpeta y la salida en `red/`/`green/` según el método de `tech-stack.md` («Baterías por skill») · ~25 min. `v1` pasa V1-V4 y V6-V10; `m1`, el criterio de la decisión 7 de la spec.
**Se prueba en la aplicación**: no, porque es texto que lee el agente: el humo es su ejecución real.

**Interfaces**:
- Consume: los literales de la Task 1.
- Produce: nada.

**Ficheros**: modificar `v3.0.0.md`, `operations-gate-fields.test.ts`, `dist/`; crear la evidencia del humo en `green/`.

- [ ] **Step 1: RED** — `operations-gate-fields.test.ts` con `'The steps go in this order'`; `moon run cli:test` → rojo.
- [ ] **Step 2: Implementación** — traducir entera `v3.0.0.md` con las Restricciones de código: el paso 3 cita entre «…» las secciones de `debt.md` («Lista», «Por triar», «En espera», «Descartadas») y las columnas (`**«Origen»**`, `**«Causa»**`, `**«Arreglo»**`, `**«Remedio temporal»**`, `**«Fecha»**`, `**«Impacto»**`, `**«Tarea»**`, `**«Externo»**`, `**«Tras»**`, `**«Estado»**`, `**«Tamaño»**`); los bloques ```` ```text ```` y ```` ```bash ```` no cambian; la frase final de la línea `**Writes**:` empieza por «Also».
- [ ] **Step 2b: Build** — `moon run kit:build` → verde.
- [ ] **Step 3: Verificación** — los dos comandos de arriba; después, el humo en segundo plano.
- [ ] **Step 4: Commit de la task** — `feat(sdd-upgrade): migración a v3.0.0 en inglés`, con la evidencia del humo.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 2,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 3 tasks, ~55 KB de texto a traducir (25 KB en la v3.0.0) más 6 ficheros de literales; incertidumbre en cuántas líneas deja `kit:own` por literales del proyecto.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] `moon run kit:own 2>&1 | grep -E "migrations/"` → sin salida
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Cada release lleva su migración» (THEN: «no changes to the project», «Verification», `**Writes**:`) → Task 1, `migration-init-parity.test.ts` y `grep` de `kit:own`; la frase, en las seis de solo marcador. ✓
- MODIFIED «Una migración sin cambios solo avanza el marcador» → Task 3, humo `m1` (la v2.3.4, criterio de la decisión 7). ✓
- MODIFIED «Un proyecto ya inicializado se migra» (AND «Verification») → Task 1 (`SKILL.md:19`); Task 3, humo `m1` y `v1` (cierran cada versión con su «Verification»). ✓
- MODIFIED «Lo que escribe una migración lo reciben también las init» → Task 1, `migration-init-parity.test.ts`. ✓
- MODIFIED «La migración a v2.0.0 añade el propósito» (AND «Also…») → Task 2, `check.test.ts` y la línea `**Writes**:` sin tokens nuevos (parity en verde). ✓
- MODIFIED «La migración a v2.3.0 lleva el roadmap» (AND `**Writes**:`) → Task 1 y Task 2, `migration-init-parity.test.ts`. ✓
- MODIFIED «Un paso que borra o reestructura…» (AND «no gate») → Task 1 (`SKILL.md:16, 38`); Task 2, `/no gate/i`. ✓
- MODIFIED «La migración a v3.0.0 cambia los nombres de las skills retiradas» (AND «Verification») → Task 3, humo `v1` (V7). ✓
- MODIFIED «La migración a v3.0.0 deja el hook del proyecto» (AND `**Writes**:`) → Task 1, `migration-init-parity.test.ts`; Task 3, humo `v1`. ✓
- Reglas «Dónde viven los datos» y «Regla ante conflicto» → Task 1 (`**Writes**:`, «no gate» en `SKILL.md`). ✓
- Cero líneas de `kit:own` en `migrations/` → Task 3, `grep` de `kit:own`; §3. ✓
- Tabla «Lo que se retira o cambia de forma»: cada fila con su task (Escribe, Verificación, sin gate, sin cambios, Además y fixture → Task 1; títulos de v2.0.0, `se salta`/`pendiente`, paso 1 de v2.3.0 → Task 2; «Los pasos van en este orden», nombres del proyecto del paso 3 → Task 3); las filas «se quedan» → §1.1 «NO se tocan». ✓
- Review Focus → eje Spec de la revisión final, Task 2 y Task 3 (humo). ✓
