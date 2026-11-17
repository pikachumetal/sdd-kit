---
id: 20260908-135025-task-0000-entorno-por-worktree
task: 0000
title: Plan de implementación — Entorno por worktree
spec: ./spec.md
status: approved
created: 2026-09-08
approved_at: 2026-09-08
---

# Plan de implementación — Entorno por worktree

**Goal**: fijar en el kit el contrato agnóstico del entorno por worktree (plantilla, marcador, tres entradas, predicado), escribir en las skills solo la guidance que el RED reclame, y dejar que el escenario E1 decida si existe la skill `sdd-env`.

**Architecture**: RED primero sobre una fixture "Alybo-like" con scripts stub que dejan rastro en disco (marcador + log): cuatro escenarios, uno por pieza de guidance y uno —E1— que decide la skill. La plantilla se escribe **por subagente** (dogfooding del default de T3: la spec §4.1 es el brief). Las ediciones de skill van en línea porque cada línea es una decisión Art. I sobre lo que el RED mostró. GREEN y A/B de las cuatro skills editadas en una sola tanda. Cierre documental con la decisión pendiente resuelta.

**Tech Stack**: Markdown puro. Subagentes Sonnet sobre fixtures desechables. Evidencia narrativa verificada en disco.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas de la spec y de la constitution. Toda task las hereda; **quien despacha las incluye en el encargo** (paso 6 de `sdd-start-task`).

- **Política de modelos** (Art. IV, la de superpowers): modelo **y** effort explícitos en cada despacho; gama media como suelo para revisores e implementadores de prosa; `fable` y `opus xhigh` prohibidos salvo justificación en la task.
- **Sujetos de campaña: Sonnet, effort medium**, como toda la evidencia previa.
- **Ejecución**: default agente (T3). Las tasks de **medición** (RED, GREEN/A/B) van en línea — los subagentes son sujetos, no implementadores. Las de **edición de skill** van en línea porque cada línea es una decisión Art. I sobre el RED. La **plantilla** va por agente: es redacción a partir de una spec cerrada.
- **La skill bajo test se entrega haciéndole leer el fichero del working tree** más su `Base directory`. `superpowers` no se pega: lo resuelve el harness.
- **Prompt neutro**; conducta verificada en disco; n=1 no es veredicto (bisecar y repetir antes de concluir).
- **Molde de fixture sin `.git`**; una copia por run; los worktrees de la fixture se crean en la copia.
- Art. I — ningún cambio de skill sin ciclo de test en `tests/`. **Guidance que el baseline ya cumple no se escribe.**
- Art. VIII — la plantilla se crea en `skills/sdd-templates/templates/`, única fuente.
- Art. IX — el worktree lo gestiona superpowers; el kit no lo reimplementa.
- Art. III / VI — castellano con tildes (también en los mensajes de commit: usar heredoc, no `printf`).

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: lo más simple sería escribir la skill `sdd-env` y la plantilla sin RED. Rechazado: Art. I, y el 50/50 del dev-lead se resuelve con E1, no con opinión.
- [ ] **YAGNI gate**: cero catálogo de entornos por stack; tres campos mínimos en el marcador; la skill solo si E1 falla.
- [ ] **Brownfield gate**: cuatro skills en uso; ninguna cambia de nombre ni de `description`. La plantilla es fichero nuevo, aditivo.
- [ ] **Constitution check**: Art. I, II, IV (predicado observable), VII (dogfooding no aplicable, declarado), VIII, IX.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/environments-template.md` — el contrato (spec §4.1).
- `tests/entorno-worktree-red.md`, `tests/entorno-worktree-green.md` — campaña.
- `skills/sdd-env/SKILL.md` + `tests/sdd-env-red.md` — **solo si E1 falla** (Open question 2 de la spec decide si dentro de esta task).

**Modificar** (solo lo que el RED reclame):

- `skills/sdd-templates/SKILL.md` — fila nueva en la tabla de plantillas.
- `skills/sdd-init-greenfield/SKILL.md` — dos preguntas en el bloque (d) proceso de la entrevista.
- `skills/sdd-init-brownfield/SKILL.md` — paso 1 inventario: cosechar scripts de entorno; paso 5 estructura: `environments.md` si procede.
- `skills/sdd-start-task/SKILL.md` — paso 6: `env:setup` tras el worktree, si existe `environments.md`.
- `skills/sdd-start-task/references/overrides-superpowers.md` — fila `using-git-worktrees`.
- `skills/sdd-end-task/SKILL.md` paso 10 y `skills/sdd-end-patch/SKILL.md` paso 6 — `env:clean` antes de `finishing-a-development-branch`.
- `tests/sdd-start-task-ab.md`, `tests/sdd-end-task-ab.md`, `tests/sdd-end-patch-ab.md`, `tests/sdd-init-greenfield-ab.md`, `tests/sdd-init-brownfield-ab.md` — sección de no-regresión.
- `.docs/sdd/roadmap.md` — T4 ✅ y decisión pendiente resuelta.

**NO se tocan**:

- Ningún script: el kit no lleva `.mjs`. Los de Alybo se citan.
- `using-git-worktrees` ni `finishing-a-development-branch`: son de superpowers.
- La `description` de ninguna skill existente.

### 1.2 / 1.3 / 1.4

No aplican (sin datos, sin migraciones; el contrato del marcador y las entradas es el de la spec §4.1).

---

## 2. Tasks

### Task 1 — Campaña RED

**Modelo**: Sonnet, effort medium (sujetos); orquestación en la sesión.
**Ejecución**: en línea — medición.

**Ficheros**: crear `tests/entorno-worktree-red.md`; fixture "Ledgerly-env" en el scratchpad.

- [ ] **Step 1: Construir la fixture "Ledgerly-env".** Proyecto Node con `.docs/sdd/` completo (constitution con git-flow `feature/<ticket>` desde `develop`), `package.json` con `"env:setup"`, `"env:clean"`, `"env:preflight"` apuntando a `.tools/env-setup.mjs`, `.tools/env-clean.mjs`, `.tools/env-preflight.mjs`. Los tres son **stubs con rastro**: `env-setup` escribe `.sdd-env.json` (`{ticket, state:"active", created}`) y añade una línea `setup <ticket> <ISO>` a `.tools/env-log.txt`; `env-clean` pone `state:"cleaned"` y añade `clean …`; `env-preflight` añade `preflight …` y sale 0. `.docs/sdd/environments.md` calcado de Alybo en corto (~40 líneas: los dos tipos de entorno, el marcador, las tres entradas y "usar los orquestadores, no `git worktree` a pelo"). Molde sin `.git`.
- [ ] **Step 2: Cuatro escenarios.**

  | Id | Montaje | Petición | Qué decide |
  | --- | --- | --- | --- |
  | E1 | Copia con `git init` + `develop`; **worktree ya creado** en `../<copia>.worktrees/feature/123` con rama `feature/123` (simula Orca); sin marcador; **sin skill del kit en el encargo** | «Acabo de abrir este worktree desde Orca. Prepárame el entorno.» | ¿Encuentra `environments.md` y ejecuta `env:setup`? → **si sí, `sdd-env` no se escribe** |
  | E2 | Copia con spec y plan aprobados (una task trivial); `sdd-start-task` **vigente** | «Implementa el plan de `<carpeta>/plan.md`.» | Tras crear el worktree, ¿ejecuta `env:setup`? (predicado en el paso 6) |
  | E3 | Copia con worktree de la task implementada, marcador `active`; `sdd-end-task` **vigente** | «La task está implementada y probada. Ciérrala.» | ¿Ejecuta `env:clean` antes de ofrecer borrar el worktree? |
  | E4 | Copia **sin** `environments.md` pero con los scripts y `package.json`; `sdd-init-brownfield` **vigente** | «Queremos empezar a trabajar con SDD. Déjalo preparado.» | ¿Cosecha los scripts de entorno en un `environments.md`, o los deja como nota suelta en `tech-stack.md`? |

- [ ] **Step 3: Correr** los cuatro en paralelo (un `Workflow`), prompt neutro.
- [ ] **Step 4: Verificar en disco**: `.tools/env-log.txt` (qué entradas se invocaron y en qué orden), `.sdd-env.json` (estado), existencia de `environments.md` en E4, y en E3 si el worktree sigue o se borró.
- [ ] **Step 5: Escribir `tests/entorno-worktree-red.md`** con fallos, racionalizaciones textuales y positivos.
- [ ] **Step 6: Checkpoint contigo** — qué guidance reclama el RED, y la Open question 2 si E1 falla.
- [ ] **Step 7: Commit** — `test(skills): RED del entorno por worktree` (heredoc, con tildes).

### Task 2 — Plantilla `environments-template.md`

**Modelo**: Sonnet, effort medium — redacción a partir de una spec cerrada; gama media como suelo.
*(Ejecución: agente, el default. Es la primera task del kit que se implementa por despacho: dogfooding de T3.)*

**Ficheros**: crear `skills/sdd-templates/templates/environments-template.md`; modificar `skills/sdd-templates/SKILL.md`.

- [ ] **Step 1: Despachar** un subagente con: (1) dónde encaja la task; (2) el brief = spec §4.1 y §4.5 íntegras más el formato de las plantillas hermanas (frontmatter no, bloques de ayuda `>` sí, ver `walkthrough-template.md` como ejemplo); (3) las Restricciones globales de este plan; (4) ruta del fichero a crear; (5) contrato del informe: lista de secciones y confirmación de que cita Alybo sin copiar código.
- [ ] **Step 2: Revisar** (task review de `subagent-driven-development`): la plantilla contiene el marcador con sus tres campos, las tres entradas con su semántica, los dos tipos de entorno, la referencia a Alybo, y ningún script.
- [ ] **Step 3: Fila en `skills/sdd-templates/SKILL.md`**: `[environments-template.md](templates/environments-template.md) | environments.md | Solo si el proyecto usa worktrees Y su entorno necesita más que dependencias`.
- [ ] **Step 4: Commit** — `feat(templates): plantilla del contrato de entorno por worktree`.

### Task 3 — Guidance reclamada por el RED

**Modelo**: ninguno — ediciones en la sesión.
**Ejecución**: en línea — cada línea es una decisión Art. I sobre lo que el RED mostró.

**Ficheros**: los seis `SKILL.md`/`references` del §1.1 "Modificar".

- [ ] **Step 1: `overrides-superpowers.md`** — sustituir la fila `using-git-worktrees` por: `| \`using-git-worktrees\` | El worktree lo crea, instala y borra superpowers (\`using-git-worktrees\`, \`finishing-a-development-branch\`; el borrado lo decide el usuario). El kit añade el **entorno**: si existe \`.docs/sdd/environments.md\`, \`env:setup\` tras crear el worktree y \`env:clean\` antes de borrarlo. |` — se escribe en todo caso: corrige una contradicción, no añade guidance.
- [ ] **Step 2: `sdd-start-task` paso 6** *(si E2 falla)* — añadir tras "default del kit": «Si existe `.docs/sdd/environments.md`, ejecuta `env:setup` tras la creación del worktree y di en el encargo dónde está el marcador.»
- [ ] **Step 3: `sdd-end-task` paso 10 y `sdd-end-patch` paso 6** *(si E3 falla)* — anteponer: «*(si existe `environments.md`)* `env:clean` ANTES de `finishing-a-development-branch`: borrar un worktree con el entorno vivo deja contenedores huérfanos secuestrando puertos.»
- [ ] **Step 4: `sdd-init-brownfield`** *(si E4 falla)* — paso 1: «scripts de entorno por worktree (`env:*`, `worktree:*`) → se cosechan en `environments.md`, calcando `environments-template.md`». `sdd-init-greenfield` paso 1 bloque (d): «¿worktrees? y, si sí, ¿el entorno necesita más que dependencias? — solo con ambas, `environments.md`».
- [ ] **Step 5: `skills/sdd-env/SKILL.md`** *(solo si E1 falla y el dev-lead lo mete en esta task)* — description construida con las frases de E1; cuerpo: leer `environments.md`, ejecutar `env:setup`, reportar el marcador. Con su `tests/sdd-env-red.md`.
- [ ] **Step 6: Verificación** — gates ⛔ y tablas de racionalizaciones intactas en las cuatro skills; `grep -rn "no gestiona worktrees" skills/` vacío.
- [ ] **Step 7: Commit** — `feat(skills): entorno por worktree por predicado sobre environments.md`.

### Task 4 — GREEN + A/B de no-regresión

**Modelo**: Sonnet, effort medium (sujetos).
**Ejecución**: en línea — medición.

**Ficheros**: crear `tests/entorno-worktree-green.md`; ampliar los cinco `-ab.md`.

- [ ] **Step 1: GREEN** — los escenarios que fallaron en el RED, con la guidance escrita. Copias frescas.
- [ ] **Step 2: A/B** — control = commit anterior a la Task 3, tratamiento = HEAD, sobre los escenarios que cada `-ab.md` ya documenta: `sdd-start-task` (A, B, L, E5), `sdd-end-task` (cierre), `sdd-end-patch` (su GREEN), `sdd-init-greenfield` (gate de entrevista), `sdd-init-brownfield` (Ledgerly con derivas).
- [ ] **Step 3: Verificar en disco**; bisecar y repetir donde haya diferencia.
- [ ] **Step 4: Escribir la evidencia.**
- [ ] **Step 5: Checkpoint contigo.**
- [ ] **Step 6: Commit** — `test(skills): GREEN del entorno por worktree y no-regresión de las skills editadas`.

### Task 5 — Cierre documental

**Modelo**: ninguno.
**Ejecución**: en línea.

- [ ] **Step 1: Roadmap** — T4 con el resultado (incluido el veredicto de E1 sobre la skill), y la decisión pendiente "¿el contrato de worktrees va al kit o a nivel 2?" **resuelta** con fecha en "Decisiones tomadas".
- [ ] **Step 2: `architecture.md`** — `environments.md` entra en la lista de módulos por predicado, junto a `estimation.md` y `changelog.md`; `mission.md` glosario: "entorno por worktree".
- [ ] **Step 3: Verificación** — `grep -rn "environments.md" skills/ .docs/sdd/*.md` coherente: todas las menciones describen el mismo predicado.
- [ ] **Step 4: Commit** — `docs(sdd): T4 cerrada y decisión de nivel resuelta`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: **2 h** (rango 1,5–3)
- Base de la estimación: 5 tasks; una fixture nueva con worktree y tres stubs (**20 min presupuestados por fixture**, lección de T3: los costes de entorno se estiman por fixture, no como suplemento fijo); ~4 runs RED + ~12 GREEN/A/B en paralelo; una task por despacho (nueva forma de coste: el tiempo del subagente más la revisión); seis ficheros de evidencia. T3, de forma parecida, cerró en ~1,5 h.
- Confianza: media

---

## 3. Validación final

- [ ] Sin build: frontmatter válido en las skills tocadas, enlaces a `references/` y a la plantilla resolviendo.
- [ ] Los 8 criterios de éxito de la spec §2 verificados uno a uno.
- [ ] Ninguna guidance escrita sin fallo en el RED (Art. I), salvo la fila del override, que corrige una contradicción.
- [ ] Cierre por `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- Criterio 1 (plantilla) → Task 2. ✓
- Criterio 2 (entrevista en `init-*`) → Task 3 Step 4; medido en E4. ✓
- Criterio 3 (`env:setup` en start-task) → Task 3 Step 2; medido en E2. ✓
- Criterio 4 (`env:clean` en end-task/end-patch) → Task 3 Step 3; medido en E3. ✓
- Criterio 5 (override) → Task 3 Step 1. ✓
- Criterio 6 (skill solo si E1 falla) → Task 1 E1 + Task 3 Step 5. ✓
- Criterio 7 (no-regresión) → Task 4 Step 2. ✓
- Criterio 8 (decisión pendiente resuelta) → Task 5 Step 1. ✓
- Spec §4.5 "preflight falla" → fixture stub sale 0; el caso de fallo no se simula (no hay guidance que lo reclame) — declarado. ✓
- Spec §4.5 "marcador `cleaned` → `env:setup` idempotente" → plantilla, Task 2 Step 2. ✓
- Spec §10 Open question 1 (modelo) → Restricciones globales. ✓ · Open question 2 (skill dentro o fuera) → Task 1 Step 6. ✓
