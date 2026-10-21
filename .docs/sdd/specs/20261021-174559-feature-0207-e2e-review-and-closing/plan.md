---
id: 20261021-174559-feature-0207-e2e-review-and-closing
feature: 0207
title: Plan de implementación — E2E en la revisión y el cierre
spec: ./spec.md
status: draft
created: 2026-10-21
---

# Plan de implementación — E2E en la revisión y el cierre

## Decisiones que he tomado yo — valida estas

1. **Ejecución native**. Son 3 tasks sobre ficheros distintos, sin interfaces entre ellas salvo los nombres de los campos de `operations.md`, que ya fijó la 0180. Un error lo caza el sujeto de su task, y el plan cabe en un contexto.
2. **Sin implementadores ni revisores por task**: la sesión hace las tres. La revisión final de `sdd-verify` sale en dos ejes: Spec con `sdd-kit:effort-high` + `opus` y Código con `sdd-kit:effort-high` + `sonnet`.
3. **Sujetos con Sonnet**, de 2 en 2, con `run.sh` y los techos de la spec: `SUBJECT_CAP=20` y `COST_CAP=15`, comunes a todas las fases de esta carpeta. `KIT_DIR` es una copia del working tree de cada task antes de su commit, como en la 0180: el commit va después de la verificación.
4. **Orden de las tasks**: primero los restos de la 0180 (el más barato, un sujeto), después el eje Código y al final el cierre, que lleva la mayor parte del GREEN.
5. **Coste estimado**: 11 sujetos, ~6 $. Los de `sdd-archive` cuestan ~0,5 $ y los del eje Código ~0,2 $, medido en el RED.
- Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el revisor de código y el cierre comprueban la política E2E que `operations.md` declara desde la 0180.

**Architecture**: tres piezas de texto con sus escenarios de batería:
- un bloque nuevo en el encargo del eje Código;
- una referencia nueva de `sdd-archive` para la suite E2E del cierre, y dos huecos en el 4.1 del walkthrough;
- los restos de la 0180 en la migración y en `writing-e2e.md`.

**Tech Stack**: skills en Markdown; Pester para `tests/*.Tests.ps1`; sujetos headless con `tests/headless/run.sh` y las baterías de `tests/batteries/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks sobre ficheros distintos, un error lo caza el sujeto de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, una plantilla y moldes de batería; ningún módulo, manifest ni contrato de código.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin alias de PowerShell; texto humano en castellano con tildes.
- Las skills se escriben en inglés (Art. III); las plantillas de `sdd-templates` siguen en castellano hasta la 0206.
- Ningún ejemplo nombra un proyecto real: los casos de campo van como «la 0223» o «el patch 0158».
- Topes de palabras, los de la tabla de la spec:
  - `sdd-verify`: 3060 y 9120;
  - `sdd-archive`: 3900 y 6900;
  - `sdd-templates`: 15620;
  - `sdd-tdd`: 4020;
  - kit: 90300.

### De proceso

- Política de modelos del Art. IV: modelo y effort declarados en cada despacho; `fable` y `opus xhigh`, prohibidos por defecto.
- Los sujetos se lanzan con `tests/headless/run.sh`, con:
  - `SUPERPOWERS_DIR` en la caché de superpowers 7.0.0;
  - `SUBJECT_SH` como el `subject.sh` de la batería;
  - `SPEC_DIR` como esta carpeta y `PHASE=green`.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con `Co-Authored-By`.

## Review Focus

- Un proyecto con E2E cuyo «Entorno de la suite» dice `no aplica` (una suite sin servidores) → el cierre no levanta nada y pasa el gate tal cual; el 4.1 dice `Entorno de la suite: no aplica` · Task 3: la referencia lo dice en su paso del entorno; ningún sujeto lo mide (lo lee el eje Spec).
- Un rojo que no es de conexión con el entorno recién levantado (`TimeoutError` de un test) → sigue la receta del rojo de siempre: contraste con la base y búsqueda en la deuda, sin volver a levantar el entorno · Task 3, control `a3r` ×1.
- Un proyecto sin E2E declarados → el encargo del eje Código dice `sin E2E declarados` y el revisor no marca nada de E2E · Task 2, control `f4` ×2.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un bloque en un encargo, una referencia y dos huecos de plantilla; ninguna skill nueva.
- [x] **YAGNI gate**: nada se abstrae; cada pieza tiene su escenario de RED que falla.
- [x] **Brownfield gate**: la plantilla del walkthrough mantiene su forma, y el umbral de 10 min sigue para los proyectos sin presupuesto.
- [x] **Constitution check**: Art. I (RED y GREEN por pieza, previsión de coste en la spec, tramo de batería de verify y archive), Art. II (hueco en plantilla para lo omitido, racionalizaciones para la disciplina), Art. III, Art. V (una sola lista de campos en la plantilla) y Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-archive/references/e2e-suite.md` — cómo corre el cierre la suite E2E: entorno, gate tal cual, fallo de conexión, presupuesto y tanda.
- `tests/e2e-closing-red.md` y `tests/e2e-closing-green.md` — evidencia de las campañas.
- `tasks.md` — registro vivo.

**Modificar**:

- `skills/sdd-verify/references/code-reviewer-prompt.md` — el bloque `## E2E del proyecto`.
- `skills/sdd-verify/SKILL.md` — la fila «Code» de la tabla de ejes.
- `skills/sdd-archive/SKILL.md` — punteros a `e2e-suite.md` en los pasos 1 y 6.
- `skills/sdd-templates/templates/walkthrough-template.md` — 4.1 y 4.3.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — fila «Testing».
- `skills/sdd-tdd/references/writing-e2e.md` — fila de `test.fixme`.
- `tests/batteries/sdd-verify/` — `f5` (ya escrito en el RED); `compose-axis.mjs` rellena el bloque nuevo desde `fixtures/axis-<escenario>.json`.
- `tests/batteries/sdd-archive/` — `e1` y `e2` (ya escritos en el RED).
- `tests/batteries/sdd-upgrade/battery.md` — V13.
- `tests/ClosingVerification.Tests.ps1`, `tests/VerifySkill.Tests.ps1`, `tests/ArchiveSkill.Tests.ps1` y `tests/WordBudget.Tests.ps1`.

**NO se tocan**:

- `skills/sdd-start-feature/SKILL.md` — su paso 7 lo funde la 0206 (decisión 7 de la spec).
- `skills/sdd-templates/templates/operations-template.md` — los campos ya existen desde la 0180.

### 1.6 Dependencias

- La 0180 (cerrada): los campos E2E de `operations-template.md` y `writing-e2e.md`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto de `e1` o `e2` deja un servidor escuchando en la máquina del dev-lead | media | bajo | `subject.sh` llama a `env-down.mjs` al acabar; se comprueban los puertos 4300-4899 tras cada tanda |
| La regla del entorno hace que el cierre levante el entorno ante cualquier rojo | media | medio | el paso dice «fallo de conexión» con sus literales; control `a3r` |

### 1.8 Rollout

Directo: entra en la 3.0.0. La fila «Testing» de la migración la aplica cada proyecto al migrar.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Restos de la 0180: la migración con los seis campos E2E y `test.fixme` con argumentos

**Tras**: —
**Modelo**: Native, la sesión.
**Tests RED**: V13 ampliada en `tests/batteries/sdd-upgrade/battery.md` (fila de rúbrica), medida con `v3` ×1.
**Superficies**: docs (skills) · tooling (batería)
**Verificación**: `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`; `v3` ×1 con V13 en verde.

**Interfaces**:
- Consume: los nombres de los campos E2E de `operations-template.md`: «Flujos core», «Presupuesto E2E», «Retries», «Timeouts», «Entorno de la suite», «Datos».
- Produce: nada.

**Ficheros**: modificar `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `skills/sdd-tdd/references/writing-e2e.md`, `tests/batteries/sdd-upgrade/battery.md`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: V13** — la fila de rúbrica falla también si `## Testing` no lleva «Entorno de la suite» y «Datos» con un valor o `pendiente`.
- [ ] **Step 2: Migración** — la fila «Testing» de `v3.0.0.md` nombra los seis campos. «Entorno de la suite» sale del script que levanta lo que la suite necesita, si existe (`env:up`, `docker compose up`), con la comprobación de que responde; si no, `pendiente`. «Datos» es `pendiente` salvo que el dev-lead lo diga.
- [ ] **Step 3: `writing-e2e.md`** — la fila «Retries: 2 makes the suite green» pasa a: «It makes the failure invisible. Triage it, or declare it `test.fixme('<title>', { annotation: { type: 'issue', description: '<url>' } }, …)`.» Sube el tope de `sdd-tdd` a 4020.
- [ ] **Step 4: Verificación** — `v3` ×1 (`BATTERY=sdd-upgrade`, `STEPS` del escenario) y los Pester.
- [ ] **Step 5: Commit de la task**.

### Task 2 — El eje Código marca los E2E que no siguen la política del proyecto

**Tras**: —
**Modelo**: Native, la sesión.
**Tests RED**: `f5` ×2 (rúbrica Q5), ya en rojo (RED previo, 2 de 2); `VerifySkill.Tests.ps1`, «el encargo del eje Código lleva el bloque E2E».
**Superficies**: docs (skills) · tooling (batería, Pester)
**Verificación**: `Invoke-Pester tests/VerifySkill.Tests.ps1, tests/WordBudget.Tests.ps1 -CI` → `Failed: 0`; `f5` ×2 con Q5 en verde; `f4` ×2 con Q en verde.

**Interfaces**:
- Consume: nada.
- Produce: el placeholder `<«Flujos core», «Retries» y «Timeouts» de operations.md §Testing, literales, o «sin E2E declarados»>` del encargo, que `compose-axis.mjs` rellena desde `fixtures/axis-f4.json` (`sin E2E declarados`) y `fixtures/axis-f5.json` (los campos del molde `hojas`).

**Ficheros**: modificar `skills/sdd-verify/references/code-reviewer-prompt.md`, `skills/sdd-verify/SKILL.md`, `tests/batteries/sdd-verify/fixtures/axis-f4.json` y `axis-f5.json`, `tests/VerifySkill.Tests.ps1`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Pester RED** — en `VerifySkill.Tests.ps1`, un `It` que exige en `code-reviewer-prompt.md` el encabezado `## E2E del proyecto`, el placeholder y el literal `sin E2E declarados`. Verlo fallar.
- [ ] **Step 2: Encargo** — en el bloque de texto de `code-reviewer-prompt.md`, tras «Restricciones de código», va `## E2E del proyecto` con el placeholder, en castellano, como la cabecera. Dentro de «What to Check», en inglés, la sección **E2E tests** dice que, con los campos E2E en el encargo, son Important:
  1. a new E2E test that names none of the core flows;
  2. a retry or timeout raised above the declared value, in a test or in the runner's config, without its reason written in `operations.md`;
  3. a wait on internal state (an API poll, a store, an attribute the user doesn't see) between two user actions, without a reason in a comment.

  Lleva el contraejemplo de Art. II: «without waiting, the app wouldn't have the data yet» is not a reason, it is the failure the test exists to catch. Con `sin E2E declarados`, ninguno aplica. Y una línea: «A wait the test needs is not a strength.»
- [ ] **Step 3: Tabla de ejes** — fila «Code» de `sdd-verify`: «the E2E fields of `operations.md` §Testing («Flujos core», «Retries», «Timeouts»), literal, or `sin E2E declarados`; neither the spec nor the ADRs».
- [ ] **Step 4: Fixtures** — el placeholder en `axis-f4.json` → `sin E2E declarados`; en `axis-f5.json` → las cinco líneas de §Testing del molde `hojas` («Flujos core» con sus tres líneas, «Retries», «Timeouts»).
- [ ] **Step 5: Verificación** — Pester; `f5` ×2 y `f4` ×2 (`PHASE=green`).
- [ ] **Step 6: Commit de la task**.

### Task 3 — La suite E2E del cierre: entorno, gate tal cual, presupuesto y tanda

**Tras**: —
**Modelo**: Native, la sesión.
**Tests RED**: `e1` ×2 (E1, E2, E3) y `e2` ×2 (E4), ya en rojo (RED previo); `ClosingVerification.Tests.ps1` con los literales nuevos del 4.1; `ArchiveSkill.Tests.ps1`, «`sdd-archive` nombra `e2e-suite.md`».
**Superficies**: docs (skills, plantilla) · tooling (Pester)
**Verificación**: `Invoke-Pester tests/ClosingVerification.Tests.ps1, tests/ArchiveSkill.Tests.ps1, tests/WordBudget.Tests.ps1 -CI` → `Failed: 0`; `e1` ×2, `e2` ×2, `a3r` ×1 y `a1` ×1 con sus filas de rúbrica en verde.

**Interfaces**:
- Consume: los campos «Entorno de la suite», «Presupuesto E2E» y el «Gate de cierre» de `operations.md` §Testing.
- Produce: nada.

**Ficheros**: crear `skills/sdd-archive/references/e2e-suite.md`; modificar `skills/sdd-archive/SKILL.md`, `skills/sdd-templates/templates/walkthrough-template.md`, `tests/ClosingVerification.Tests.ps1`, `tests/ArchiveSkill.Tests.ps1`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Pester RED** — `ClosingVerification.Tests.ps1` exige en el 4.1 los literales `configuración: <la del gate | lo que se añadió>`, `Entorno de la suite:` y `E2E: <duración> de <Presupuesto E2E>`, y en el 4.3 `pasa de su presupuesto`. `ArchiveSkill.Tests.ps1` exige que `SKILL.md` nombre `references/e2e-suite.md`. Verlos fallar.
- [ ] **Step 2: `e2e-suite.md`** — la forma de `merge-recipe.md`: cuándo se carga (`operations.md` §Testing declara los campos E2E) y cinco pasos en orden:
  1. **Environment** — antes de cada pasada que cuenta para el cierre, ejecuta «Entorno de la suite» desde esta sesión y su comprobación en verde. Un servidor que ya escuchaba no cuenta, aunque responda: puede servir otro árbol o datos de otra pasada. Con `no aplica`, nada que levantar.
  2. **The gate as declared** — el comando literal, sin variables, opciones ni trucos que no declara (traza, CPU, analizadores, un atajo del README). La configuración va al 4.1.
  3. **A connection failure** (`ECONNREFUSED`, `ERR_CONNECTION_REFUSED`, un 502 del proxy) — levanta el entorno otra vez, compruébalo y repite la pasada antes de abrir código o contrastar con la base. Si persiste con el entorno comprobado, o el rojo es otro, sigue «A red suite» de `merge-recipe.md`.
  4. **Budget** — la duración de la suite E2E contra «Presupuesto E2E». Si lo pasa, fila de deuda con la duración y el presupuesto, también si ya lo pasaba sin la rama. Con `pendiente`, la duración medida, sin deuda.
  5. **A repeated batch** — antes de lanzarla: los tests de la tanda con su motivo (nuevos o cambiados por la rama ×N; los demás de los ficheros que toca ×1; nada de los que no toca) y la estimación, ejecuciones × duración media ÷ workers. Con la tanda en marcha, no edites lo que ejecuta (`src/`, los tests, la config del runner).

  Tabla de racionalizaciones con «It was already over before» (`e1-1`), «The branch touches both specs» (`e2-1`), «The old server answers, so the environment is up» (`e1-2`) y «The README trick is faster and the result is the same».
- [ ] **Step 3: Punteros** — paso 1 de `sdd-archive`, viñeta de `validation.mode: field`: «With E2E fields in `operations.md` §Testing, the suite runs as [e2e-suite.md](references/e2e-suite.md) says.»; paso 6, junto a «The full suite runs again»: «(E2E: [e2e-suite.md](references/e2e-suite.md))». Sube el tope a 3900 y 6900.
- [ ] **Step 4: Plantilla** — en el 4.1 de `walkthrough-template.md`:
  - `- Suite completa: \`<comando>\` → <resultado> · <duración> · configuración: <la del gate | lo que se añadió> *(sin «Presupuesto E2E», si pasa de 10 min, apúntalo en 4.3 como deuda del proyecto, con la duración)*`;
  - `- Entorno de la suite: \`<comando>\` · <comprobación> → <resultado>, levantado en esta sesión *(solo con E2E)*`;
  - `- E2E: <duración> de <Presupuesto E2E> *(solo con E2E; si lo pasa, apúntalo en 4.3 como deuda del proyecto)*`.

  En el 4.3: `- Suite que pasa de su presupuesto (o, sin presupuesto, de 10 min): <duración> — deuda del proyecto *(omitir si no pasa)*.` Sube el tope de `sdd-templates` a 15620.
- [ ] **Step 5: Verificación** — Pester; `e1` ×2, `e2` ×2, `a3r` ×1, `a1` ×1 (`PHASE=green`); puertos libres tras cada tanda.
- [ ] **Step 6: Commit de la task** — con `tests/e2e-closing-red.md` y `tests/e2e-closing-green.md`, y el tope del kit a 90300.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 3h
- Base de la estimación: 3 tasks de texto con 11 sujetos (las esperas de las tandas, ~40 min); la 0180, de tamaño parecido, estimó 4 h y tardó 2,8 h
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- verification · los ejes, con «el eje Código, el paquete y los campos E2E…» → Task 2, `VerifySkill.Tests.ps1` y `f5` (el encargo compuesto lleva el bloque). ✓
- verification · los dos tests sin flujo core, Important → Task 2, `f5` Q5. ✓
- verification · los timeouts subidos sin motivo, Important → Task 2, `f5` Q5. ✓
- verification · la espera a `savedStatus`, Important → Task 2, `f5` Q5. ✓
- verification · con `sin E2E declarados`, ninguno → Task 2, control `f4` Q. ✓
- archive · `env-up` y `/health` antes de la primera pasada → Task 3, `e1` E1. ✓
- archive · el gate literal, sin `E2E_TRACE` → Task 3, `e1` E2. ✓
- archive · ante `ERR_CONNECTION_REFUSED`, levantar y repetir antes del código → Task 3, `e1` E1. ✓
- archive · `E2E: 48 s de 0,5 min` en el 4.1 → Task 3, `e1` E3 y `ClosingVerification.Tests.ps1`. ✓
- archive · la fila de deuda del presupuesto → Task 3, `e1` E3. ✓
- archive · con `pendiente`, sin deuda → sin observar con sujeto: la referencia lo dice; lo lee el eje Spec. ⚠
- archive · la tanda: estimación y alcance antes → Task 3, `e2` E4. ✓
- archive · no repite `free.e2e.mjs` → Task 3, `e2` E4. ✓
- archive · no edita `src/` ni `e2e/` con la tanda en marcha → Task 3, `e2` E4 (orden de `tools.txt`). ✓
- archive · el 4.1 con su configuración → Task 3, `e1` E2, `a1` A1 y `ClosingVerification.Tests.ps1`. ✓
- archive · el 4.1 con el entorno y la duración frente al presupuesto → Task 3, `e1` E2-E3 y `ClosingVerification.Tests.ps1`. ✓
- archive · el 4.3 con la suite sobre su presupuesto o los 10 min → Task 3, `ClosingVerification.Tests.ps1`. ✓
- archive · «Límites» con los topes nuevos → Task 3, `WordBudget.Tests.ps1`. ✓
- migration · seis campos, con «Entorno de la suite» y «Datos» → Task 1, `v3` V13. ✓
- «Lo que se retira…»: «solo el paquete» → Task 2; «10 min» → Task 3; la fila de cuatro campos → Task 1; `test.fixme()` → Task 1. ✓
