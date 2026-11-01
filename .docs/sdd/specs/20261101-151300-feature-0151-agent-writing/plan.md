---
id: 20261101-151300-feature-0151-agent-writing
feature: 0151
title: Plan de implementación — sdd-agent-writing
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — `sdd-agent-writing`

## Decisiones que he tomado yo — valida estas

1. Modelo: la sesión implementa las tres tasks (Opus 5.5 en esta sesión; el dev-lead eligió no bajarla). Sujetos: sonnet. Revisión final: Spec opus+high, Código sonnet+high.
2. Ejecución: native; motivo abajo.
3. Los tres frentes de la decisión 7 de la spec se miden con tres escenarios nuevos, `h1`, `m1` y `c1`, antes de escribir su regla.
4. Riesgo alto: que el fork fiel pase de 8.470 palabras; se recorta primero lo de plataforma, y lo demás se para como desvío.
5. Coste: ~2,5 h; hasta 17,5 $ de sujetos por el techo, ~4 $ al precio medido.
6. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: una skill del kit para escribir y probar lo que lee un agente, sin citas a superpowers.

**Architecture**: fork de `writing-for-agents` y `writing-skills` en tres ficheros, con lo propio del kit solo donde un RED falló. El cableado va después del GREEN, y la retirada de las copias de desarrollo la última.

**Tech Stack**: Markdown, baterías de `tests/headless/`, Vitest en `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas sobre los mismos textos, un error lo caza la batería o `skills.test.ts`, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade una skill con la anatomía de `architecture.md`, sin módulo, manifest ni contrato nuevos.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos; nombres en inglés, funciones de 20 líneas y 3 parámetros como máximo, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes.
- Skill en inglés (Art. III); `description` solo con cuándo usarla.
- Topes: `sdd-agent-writing` `skillMd: 2000`, `total: 8470`; `using-sdd` y `sdd-archive`, sin cambio.

### De proceso

- Sujetos con `MAX_PARALLEL=1` salvo la línea de la spec, que permite hasta 3; `KIT_DIR` desde `git archive`; `RUNS_DIR=.temp/r0151`; sonnet.
- Techo acumulado: 18,66 $. Si se supera, para y decide el dev-lead (Art. I).
- Commits con la atribución de la sesión.

## Review Focus

- Una petición de editar una skill que ya existe, sin pedir una nueva → sigue entrando por `sdd-propose`, y la puerta nueva solo cubre crear · Task 2, tramo de la puerta de `using-sdd` (control con una petición de cambio).
- Skill sin carpeta `.claude/skills/` en el proyecto → la crea allí, sin tocar `skills/` · Task 1, `p1` del molde de migraciones, leyendo su `git status`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin CLI ni plantilla nuevas.
- [x] **YAGNI gate**: ninguna abstracción.
- [x] **Brownfield gate**: `using-sdd` gana una fila; el resto no cambia de forma.
- [x] **Constitution check**: Art. I (RED y previsión en la spec), Art. III, Art. IX (fork con texto de fuente y `NOTICE`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-agent-writing/SKILL.md` — estilo, de `writing-for-agents`, con punteros a las referencias.
- `skills/sdd-agent-writing/references/skill-mechanics.md` — frontmatter, invocación, descubrimiento y la forma según el fallo.
- `skills/sdd-agent-writing/references/skill-testing.md` — prueba ligera en un proyecto y RED/GREEN en el kit, previsión.
- `skills/sdd-agent-writing/NOTICE` — avisos MIT de las dos fuentes.

**Modificar**:

- `tests/batteries/sdd-agent-writing/` — molde de migraciones, escenarios `h1`, `m1`, `c1`, procedencia.
- `skills/using-sdd/SKILL.md` — una fila en «Gates».
- `skills/sdd-archive/references/aprendizajes-skills.md` — el puntero.
- `README.md`, `CLAUDE.md`, `THIRD_PARTY_NOTICES.md`, `skills-lock.json`, `.docs/sdd/architecture.md`, `.docs/sdd/roadmap.md`.
- `cli/test/kit/word-budget.test.ts`, `cli/test/kit/skills.test.ts`.

**NO se tocan**:

- `.docs/sdd/tech-stack.md` — sigue siendo el método de este repo.
- `.claude-plugin/plugin.json` — la dependencia se queda (decisión 10 de la spec).

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La fila de `using-sdd` roba peticiones de cambio | Media | Alto | Control en su tramo |
| `p1` sigue yendo a `sdd-propose` con la `description` sola | Media | Medio | La fila de la tabla |

### 1.8 Rollout

Directo, con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La skill en GREEN

**Tras**: —
**Modelo**: sesión (native); sujetos `sonnet`.
**Tests RED**: hilo principal · `h1`, `m1`, `c1` y `p1` en `tests/batteries/sdd-agent-writing/battery.md`.
**Superficies**: docs · tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`; `battery.mjs run` con `PHASE=green` → p1, t1 y b1 con `verde` en la puerta y R1, R2, R5 y R6 sin fallo.
**Se prueba en la aplicación**: no, porque base común: el kit no es una aplicación con pantalla.

**Interfaces**:
- Consume: `tests/batteries/sdd-agent-writing/` y el RED de `red/out/`.
- Produce: skill `sdd-kit:sdd-agent-writing` y sus dos referencias.

**Ficheros**: los de la skill, la batería y `cli/test/kit/word-budget.test.ts` (`'sdd-agent-writing': { skillMd: 2000, total: 8470 }`).

- [ ] **Step 1: RED** — añadir `db/migrations/0001-rooms.sql` al molde; escenarios `h1` (devolver texto de una fuente a un fork: busca frases absolutas que choquen con las paradas), `m1` (la forma de un mensaje que estructura otra skill se escribe donde se invoca), `c1` (comprobación previa: el molde deja ver el disparador); lanzar p1, h1, m1, c1 con `n = 2`, y calificar con filas nuevas R9, R10 y R11 escritas antes de lanzar.
- [ ] **Step 2: Fork** — copiar el texto de las fuentes, en el reparto de §1.1, con la tabla de procedencia en `battery.md` (entra · ya está · se descarta con motivo); añadir lo propio solo para R1, R2, R5, R6 y los frentes en rojo del Step 1.
- [ ] **Step 3: GREEN** — lanzar los escenarios con `n = 2`, y `f1` y `b2` como control con `n = 1`.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Cableado

**Tras**: Task 1
**Modelo**: sesión (native); sujetos `sonnet`.
**Tests RED**: hilo principal · `skills.test.ts`, que deja de exigir `cited.length` mayor que cero; tramo de la puerta de `using-sdd`.
**Superficies**: docs · tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`; `BATTERY=using-sdd STEPS="<paso de la puerta>"`, verde; `p1` verde.
**Se prueba en la aplicación**: no, porque base común: el kit no es una aplicación con pantalla.

**Interfaces**:
- Consume: skill `sdd-kit:sdd-agent-writing`.
- Produce: citas a superpowers en `skills/` iguales a 0.

**Ficheros**: `skills/using-sdd/SKILL.md`, `skills/sdd-archive/references/aprendizajes-skills.md`, `README.md`, `CLAUDE.md`, `cli/test/kit/skills.test.ts`, `.docs/sdd/architecture.md`.

- [ ] **Step 1: Implementación** — fila en «Gates» de `using-sdd`: crear una skill → `sdd-kit:sdd-agent-writing`. `aprendizajes-skills.md:11` nombra `sdd-agent-writing`. `README.md:182`: `El kit invoca 0 skills de superpowers: ninguna.`, y `sdd-agent-writing` en el catálogo. `CLAUDE.md`: «las 21 skills» y cargar `sdd-agent-writing` al editar una skill. Árbol de `architecture.md`.
- [ ] **Step 2: Build** — no aplica: sin build.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Retirar las copias de desarrollo

**Tras**: Task 2
**Modelo**: sesión (native).
**Tests RED**: ninguno: retirada mecánica, cubierta por `skills.test.ts` y un `git grep`.
**Superficies**: tooling · docs
**Verificación**: `git grep -n -E "writing-for-agents|writing-skills" -- . ":!.docs/sdd/specs" ":!.docs/sdd/field-reports" ":!tests"` solo devuelve la procedencia en `THIRD_PARTY_NOTICES.md` y `skills/sdd-agent-writing/`; `npx vitest run test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque refactor: solo mueve la fuente.

**Interfaces**:
- Consume: la skill en GREEN.
- Produce: nada.

**Ficheros**: `.agents/skills/writing-skills/`, `.agents/skills/writing-for-agents/`, `.claude/skills/` (dos enlaces), `skills-lock.json`, `THIRD_PARTY_NOTICES.md`.

- [ ] **Step 1: Implementación** — borrar por nombre exacto; mover los avisos a la lista del plugin; ajustar las filas de la deuda según lo medido.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 2,5 h
- Base de la estimación: 3 tasks, fork de ~8.000 palabras, una campaña de hasta 35 sujetos; la 0173 y la 0272 como referencia
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Primera skill invocada es `sdd-agent-writing` → Task 2, `p1`, puerta. ✓
- `description` sin resumir el proceso → Task 1, `p1`, R2. ✓
- No da la skill por hecha sin escenario → Task 1, `p1`, R1. ✓
- Traspaso: nombra, lo primero del paso y prohíbe seguir → Task 1, `t1`, R5. ✓
- Previsión con REFACTOR y partida; el total no sale en 4,50 $ → Task 1, `b1`, R6. ✓
- Routing: crear una skill va a `sdd-kit:sdd-agent-writing` → Task 2, tramo de `using-sdd` y `p1`. ✓
- Tabla «Lo que se retira»: `aprendizajes-skills.md`, `README.md`, `skills.test.ts`, `CLAUDE.md` → Task 2; copias de desarrollo y avisos → Task 3, `git grep`. ✓
- Review Focus → Task 2 y Task 1, indicados arriba. ✓
