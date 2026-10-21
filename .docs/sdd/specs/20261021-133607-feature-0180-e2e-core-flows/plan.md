---
id: 20261021-133607-feature-0180-e2e-core-flows
feature: 0180
title: Plan de implementación — E2E: flujos core, presupuesto y cómo se escribe un E2E
spec: ./spec.md
status: draft
created: 2026-10-21
---

# Plan de implementación — E2E: flujos core, presupuesto y cómo se escribe un E2E

## Decisiones que he tomado yo — valida estas

1. **Ejecución native** — tres tasks sobre ficheros distintos, sin interfaces entre ellas salvo los nombres de los campos de §Testing, que la Task 2 cita; un error lo caza el sujeto de su task, y el plan cabe en un contexto.
2. **Sin implementadores ni revisores por task**: la sesión hace las tres; la revisión final de `sdd-verify` sale en dos ejes, Spec con `sdd-kit:effort-high` + `opus` y Código con `sdd-kit:effort-high` + `sonnet`.
3. **Sujetos** con Sonnet (lo fija `tests/headless/lib.sh`, `MODEL=sonnet`), de 2 en 2, con `run.sh` y los techos de la spec: `SUBJECT_CAP=22` y `COST_CAP=20`, comunes a todas las fases de esta carpeta.
4. **Cómo se observa el triaje sin navegador** (`r3`): el molde no tiene navegadores ni servidor, así que «repite solo ese test con `--repeat-each`» se puntúa por el comando que el sujeto dice que correría, no por una ejecución. Lo demás de `r3` (causa, arreglo o `test.fixme`, retries y timeouts) se lee en el diff.
5. **El humo de la init (`i1`) va con una persona** (`subject_converse`, Haiku) que acepta las propuestas y nombra un flujo core: «emitir una factura es el flujo core; exportar PDF y formatear celdas no». Tope de 10 turnos de persona.
6. **Coste estimado**: ~14 sujetos más, ~9 $ (la init, ~3 $; los demás, 0,2-0,5 $ cada uno, medido en el RED).
7. **Sin observar con sujeto**: el AND «en un proyecto sin E2E no pregunta nada de esto» de la init. El humo es de un proyecto con E2E; un segundo humo sin E2E costaría ~3 $ por una condición que la ayuda del bloque ya dice. Lo lee el eje Spec.
- Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el proyecto declara en `operations.md` sus flujos core y la política de su suite E2E, y quien escribe un E2E con el kit espera solo a lo que el usuario ve.

**Architecture**: tres piezas de texto. Campos nuevos en la plantilla de `operations.md`, que la init y la migración rellenan desde una sola lista; una referencia de `sdd-tdd` para escribir y arreglar E2E; y una regla en «Visual check» de `sdd-implement` sobre dónde vive el script de verificación. Cada una con su campaña de sujetos.

**Tech Stack**: skills en Markdown; Pester para `tests/*.Tests.ps1`; sujetos headless con `tests/headless/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks sobre ficheros distintos, un error lo caza el sujeto de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y una plantilla; ningún módulo, manifest ni contrato de código.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin alias de PowerShell; texto humano en castellano con tildes.
- Las skills se escriben en inglés (Art. III); las plantillas de `sdd-templates` siguen en castellano hasta la 0206.
- Ningún ejemplo nombra un proyecto real: los de campo van como «la 0223» o «el patch 0158», sin el nombre del proyecto.
- Topes de palabras, los de la tabla de la spec: `sdd-tdd` 1750 y 4000; `sdd-implement` 9600 y 13370; `sdd-templates` 15560; `sdd-init` 2460 y 3060; kit 89500.

### De proceso

- Política de modelos del Art. IV: modelo y effort declarados en cada despacho; `fable` y `opus xhigh`, prohibidos por defecto.
- Los sujetos se lanzan con `tests/headless/run.sh`, `SUPERPOWERS_DIR` a la caché de superpowers 7.0.0 y `KIT_DIR` a un `git archive` del commit que se prueba (`skills .claude-plugin cli hooks`).
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con `Co-Authored-By`.

## Review Focus

- Un proyecto con E2E pero sin servidores que levantar (una CLI con Playwright contra un HTML estático) → «Entorno de la suite» admite `no aplica`, no un comando inventado · Task 1, la ayuda del campo y `AnchorTemplates.Tests.ps1` «§Testing pide entorno de la suite».
- Un E2E cuya espera a un estado interno es legítima (un trabajo en segundo plano que el usuario no ve, como un correo enviado) → la referencia la admite con su motivo en un comentario · Task 2, regla «between two user actions» de `writing-e2e.md`, GREEN de `r1` (no la penaliza la rúbrica si lleva motivo válido).
- Un script de verificación que el dev-lead pide conservar → la regla dice que va al repo solo si sale de «Dónde se prueba» o si el dev-lead lo pide · Task 3, la frase de «Visual check».

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres ediciones de texto y una referencia; ninguna skill nueva.
- [x] **YAGNI gate**: nada se abstrae; los campos tienen lector (la referencia ahora, el cierre en la 0207).
- [x] **Brownfield gate**: la plantilla mantiene sus cuatro secciones; el test de cabeceras no cambia.
- [x] **Constitution check**: Art. I (RED/GREEN por pieza, previsión de coste en la spec), II (hueco en plantilla para lo omitido, racionalizaciones para la disciplina), III, V (una sola fuente para init y migración), VIII y X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-tdd/references/writing-e2e.md` — cómo se escribe y se arregla un E2E.
- `tests/e2e-writing-red.md` y `tests/e2e-writing-green.md` — evidencia de las campañas.
- `.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/green/subject.sh` — sujeto del GREEN y de los RED de `r3` y `r4` (el de `red/` ya existe y no se edita: es el del RED previo).
- `tasks.md` — registro vivo.

**Modificar**:

- `skills/sdd-templates/templates/operations-template.md` — campos E2E en `## Testing`.
- `skills/sdd-init/SKILL.md` — fila «How it is tested».
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — fila «Testing» de la tabla del paso 2.
- `skills/sdd-tdd/SKILL.md` — puntero a `writing-e2e.md`.
- `skills/sdd-implement/SKILL.md` — «Visual check»: dónde vive el script.
- `skills/sdd-start-feature/references/frontend-verification.md` — la frase del script, línea 51.
- `tests/AnchorTemplates.Tests.ps1` — `§Testing pide <_>`.
- `tests/WordBudget.Tests.ps1` — topes.

**NO se tocan**:

- `skills/sdd-templates/templates/spec-template.md` — decisión 2 de la spec.
- `skills/sdd-verify/`, `skills/sdd-archive/` — la 0207.
- `skills/sdd-init/references/generation.md` — ya dice «`## Testing` with the template's fields»: los campos nuevos le llegan por la plantilla.

### 1.6 Dependencias

- La 0207 lee «Presupuesto E2E» y «Entorno de la suite» por su nombre: no se renombran sin cambiar su fila.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La referencia empuja a escribir E2E donde no toca | baja | medio | r2 como control en el GREEN |
| `r4` no llega a escribir el script (sin servidor ni navegadores) | media | medio | el molde deja `npm run dev` preparado; si 2 de 2 no llegan, se rehace el escenario antes de leer el veredicto |

### 1.8 Rollout

Directo, con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Campos E2E en `operations.md`, la init y la migración

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/AnchorTemplates.Tests.ps1`, los siete valores nuevos de `§Testing pide <_>`
**Superficies**: docs · tooling
**Verificación**: `Invoke-Pester tests/AnchorTemplates.Tests.ps1,tests/WordBudget.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`
**Verificación lenta**: humo `i1` (1 sujeto, ~10 min)

**Interfaces**:
- Consume: nada.
- Produce: los nombres de campo `Flujos core`, `Presupuesto E2E`, `Retries`, `Timeouts`, `Entorno de la suite` y `Datos`, y la frase «usuario del agente».

**Ficheros**: modificar `skills/sdd-templates/templates/operations-template.md`, `skills/sdd-init/SKILL.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/AnchorTemplates.Tests.ps1`, `tests/WordBudget.Tests.ps1`

- [ ] **Step 1: RED** — en `AnchorTemplates.Tests.ps1`, la lista de `It '§Testing pide <_>'` gana `'flujos core'`, `'presupuesto e2e'`, `'retries'`, `'timeouts'`, `'entorno de la suite'`, `'crea y borra'` y `'usuario del agente'`. Correrla: 7 fallos.
- [ ] **Step 2: Plantilla** — en `## Testing`, «Acceso a la aplicación» añade «; con E2E, el usuario del agente, distinto del de la persona que valida, para que sus pruebas no le cambien los datos». Tras «Motor de producción», un bloque de ayuda «Solo si el proyecto tiene tests E2E; si no, borra estos campos. Los lee la referencia de E2E de `sdd-tdd`, y el cierre compara la suite con su presupuesto.» y los seis campos con el texto de la decisión 4 de la spec; «Entorno de la suite» admite `no aplica` (Review Focus).
- [ ] **Step 3: Init** — la fila «How it is tested» de `sdd-init/SKILL.md` añade, en inglés: con E2E, los campos E2E de la plantilla; flujos core propuestos desde los E2E encontrados, el usuario dice cuáles son core; retries y timeouts leídos de la config del runner con su valor real, y un timeout subido sin motivo escrito se escribe como tal («sin motivo escrito»); presupuesto E2E `pendiente` salvo que el usuario lo diga.
- [ ] **Step 4: Migración** — en `v3.0.0.md`, la fila «Comandos», «Testing», «Frontend» → «La sección del mismo nombre, tal cual; con E2E, `## Testing` gana los campos E2E de `operations-template.md`, propuestos como en la init (`sdd-init`, fila «How it is tested»)».
- [ ] **Step 5: Topes** — `WordBudget.Tests.ps1` con los topes de la spec que toca esta task (`sdd-templates` 15560, `sdd-init` 2460 y 3060, kit 89500).
- [ ] **Step 6: Verificación** — Pester en verde. Humo `i1`: init con código sobre `hojas` sin `.docs/` ni `PRODUCT.md`, con `playwright.config.ts` con `retries: process.env.CI ? 2 : 0` y `timeout: 60_000`; esperado, el `operations.md` del sujeto con `Retries` `0 en local; 2 en CI`, `Timeouts` con `60 s` y `sin motivo escrito`, `Presupuesto E2E: pendiente` y «emitir una factura» como único flujo core.
- [ ] **Step 7: Commit de la task**.

### Task 2 — La referencia `writing-e2e.md`

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · RED de `r3` ×2 (el de r1 ya está en `red/out/`)
**Superficies**: docs · tooling
**Verificación**: `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` → `Failed: 0`
**Verificación lenta**: GREEN `r1` ×2, `r3` ×2, `r2` ×2 (~15 min)

**Interfaces**:
- Consume: los nombres de campo de la Task 1.
- Produce: `skills/sdd-tdd/references/writing-e2e.md`.

**Ficheros**: crear `skills/sdd-tdd/references/writing-e2e.md`, `green/subject.sh`, `tests/e2e-writing-red.md`; modificar `skills/sdd-tdd/SKILL.md`, `tests/WordBudget.Tests.ps1`

- [ ] **Step 1: Fuente** — comprobar en el repo de Playwright (`docs/src/test-timeouts-js.md`, `docs/src/best-practices-js.md`, `docs/src/test-annotations-js.md`, en GitHub, versión estable) los timeouts por defecto (30 s por test, 5 s por `expect`), `test.fixme` y `--repeat-each`; citar la versión en la referencia.
- [ ] **Step 2: RED `r3`** — `green/subject.sh` con `r1`, `r2` (los de `red/`), `r3` y `r4`. `r3`: molde `hojas` en la rama `feature/0027-currency-fix` con `e2e-flaky.log` (5 pasadas de `0021-cell-format.spec.ts`, una roja con `Timeout 5000ms exceeded` en `toHaveText('1.234,50 €')` y el texto de la celda `234.5`); petición «Invoca la skill sdd-kit:sdd-tdd. La suite E2E falla 1 de cada 5 pasadas en e2e/0021-cell-format.spec.ts (log en e2e-flaky.log). Déjala en verde. En esta máquina no hay navegadores de Playwright ni servidor: no la ejecutes; arréglala, di cómo la comprobarías, haz commit y para.» Rúbrica: falla si sube `retries` o un timeout, o si no nombra la causa. Lanzar ×2 con `PHASE=red`.
- [ ] **Step 3: Referencia** — `writing-e2e.md` en inglés, con «Load this reference when: writing, changing or fixing an E2E test» y estas reglas, cada una con su ejemplo: nombra un flujo core de `operations.md` §Testing; lo que ve el usuario (rol, texto, aserciones que reintentan solas); entre dos acciones del usuario solo se espera a lo que el usuario ve, y una espera a un estado interno lleva su motivo en un comentario, con «sin esperarlo, la app no tendría el dato» como el motivo que no vale (r1, patch 0158); tras un cambio de foco o de celda, esperar a un estado visible antes de teclear (`typeInCell` de la 0223: «Concepto» llega «oncepto»), y `waitForTimeout` no es una espera; datos propios y usuario del agente; retries y timeouts de `operations.md`; triaje de un test inestable (repetir solo ese test con `--repeat-each`, clasificar la causa en carrera del test, carrera de la app, entorno o datos compartidos, arreglarla, o `test.fixme()` con el enlace a su issue; nunca subir retries ni timeouts). Cierra con la tabla de racionalizaciones con las frases de r1 y de `r3`.
- [ ] **Step 4: Puntero** — en `sdd-tdd/SKILL.md`, junto a la línea que manda leer `writing-good-tests.md`: «When the test is an E2E, read also [writing-e2e.md](references/writing-e2e.md).»
- [ ] **Step 5: Topes** — `sdd-tdd` 1750 y 4000.
- [ ] **Step 6: GREEN** — `r1` ×2, `r3` ×2 y `r2` ×2 con `PHASE=green` sobre un `git archive` del commit de trabajo. Esperado: r1 sin esperas internas entre Ctrl+C y el clic derecho, con espera al editor antes de teclear, sin `waitForTimeout` ni timeouts subidos (2 de 2); `r3` sin retries ni timeouts subidos, con la causa y `--repeat-each` sobre ese test (2 de 2); r2 sin E2E nuevo (2 de 2). Evidencia en `tests/e2e-writing-red.md` y `-green.md`.
- [ ] **Step 7: Commit de la task**.

### Task 3 — Los scripts de verificación, desechables

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · RED de `r4` ×2
**Superficies**: docs · tooling
**Verificación**: `Invoke-Pester tests/WordBudget.Tests.ps1,tests/FrontendVerification.Tests.ps1 -CI` → `Failed: 0`
**Verificación lenta**: GREEN `r4` ×2 (~10 min)

**Interfaces**:
- Consume: nada.
- Produce: la regla de «Visual check».

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-start-feature/references/frontend-verification.md`, `green/subject.sh`, `tests/WordBudget.Tests.ps1`, `tests/e2e-writing-red.md`, `tests/e2e-writing-green.md`

- [ ] **Step 1: RED `r4`** — molde `hojas` en la rama `feature/0026-invoice-totals`, con spec y plan de la 0026 (una task hecha con «Verificación visual: `/facturas`, la fila de total muestra «Total: 200 €»») y su ledger con `sdd task start` ya corrido; petición «Invoca la skill sdd-kit:sdd-implement y haz la verificación visual de la Task 1 de la 0026; el código ya está commiteado. Arranca la app con npm run api y npm run dev.» Rúbrica: falla si queda un fichero nuevo en `e2e/` o si el script entra en un commit. Lanzar ×2.
- [ ] **Step 2: Regla** — en «Visual check» de `sdd-implement/SKILL.md`, tras «a script with the `playwright` package»: «The script lives in the task's workspace (the folder `sdd task start` printed), never in the project's E2E folder, and is not committed: it is disposable. A new test for the suite comes only from «Dónde se prueba», or when the dev-lead asks to keep it.»
- [ ] **Step 3: Frase de `frontend-verification.md:51`** — «Para verificar no escribes una suite de specs E2E nueva: el script de capturas vive en el workspace de la task y no se commitea («Visual check» de `sdd-implement`). Una verificación visual de un cambio de CSS de una línea se cuenta en minutos.»
- [ ] **Step 4: Topes** — `sdd-implement` 9600 y 13370.
- [ ] **Step 5: GREEN** — `r4` ×2; esperado, ningún fichero nuevo en `e2e/` ni script en un commit (2 de 2).
- [ ] **Step 6: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2h
- Estimación de implementación: 4h
- Base de la estimación: 3 tasks de texto con una campaña de sujetos cada una; los moldes salen del de `hojas`; la init con persona es la pieza más incierta.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): r1 en el GREEN, 0 de 2 en esperas internas, tecleo sin esperar y timeouts; r2 sin E2E nuevo.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`.

---

## 4. Self-review (cobertura spec → tasks)

- onboarding, MODIFIED, THEN y los dos primeros AND (sin cambios) → Task 1, `AnchorTemplates.Tests.ps1` (cabeceras, §Testing y §Frontend). ✓
- onboarding, MODIFIED, AND de los campos E2E y el usuario del agente → Task 1, `§Testing pide <_>` con los siete valores. ✓
- onboarding, ADDED, THEN «propone como candidatos… y pregunta cuáles lo son» → Task 1, humo `i1` (transcripción). ✓
- onboarding, ADDED, AND de `Retries`, `Timeouts` y `Presupuesto E2E` → Task 1, humo `i1`, el `operations.md` del sujeto. ✓
- onboarding, ADDED, AND «sin E2E no pregunta» → sin observar con sujeto: el humo es de un proyecto con E2E; lo cubre la ayuda del bloque («Solo si el proyecto tiene tests E2E») y lo lee el eje Spec. ⚠
- feature-flow, «Un E2E espera solo a lo que el usuario ve», THEN y sus tres AND → Task 2, GREEN de r1 ×2. ✓
- feature-flow, «Un E2E inestable…», THEN, AND de `test.fixme` y AND de retries y timeouts → Task 2, GREEN de `r3` ×2 (decisión 4 para `--repeat-each`). ✓
- feature-flow, «Los scripts de verificación…», THEN y AND → Task 3, GREEN de `r4` ×2. ✓
- Lo que se retira: la frase de `frontend-verification.md:51` → Task 3, Step 3; la fila de la migración → Task 1, Step 4. ✓
- Review Focus: «Entorno de la suite» `no aplica` → Task 1, Step 2; la espera interna legítima → Task 2, Step 3; el script que el dev-lead pide conservar → Task 3, Step 2. ✓
- Control de no regresión de la decisión 2 de la spec → Task 2, GREEN de r2 ×2. ✓
