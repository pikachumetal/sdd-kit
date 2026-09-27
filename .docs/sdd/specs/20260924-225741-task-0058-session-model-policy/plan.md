---
id: 20260924-225741-task-0058-session-model-policy
task: 0058
title: Plan de implementación — Modelo y effort de la sesión que ejecuta en Native
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Modelo y effort de la sesión que ejecuta en Native

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: tres tasks en serie, cada una necesita la anterior (el RED decide qué guía se escribe, el GREEN mide la guía escrita) y ninguna tiene interfaces de código que un revisor por task proteja. La revisión final de rama, con `sdd-kit:effort-high` + `model: opus`.
2. **Modelo**: la sesión (Opus 5.5) implementa, sin subagentes salvo el revisor final. Los sujetos de `d4` y `p5` corren con `--model opus`, porque la conducta depende de que la sesión sea el modelo más capaz (spec, decisión 8); los de `c1`, con `--model sonnet`, como en la 0057.
3. **Campaña**: 10 sujetos (RED 5, GREEN 5), ~15 $, ~1,5 h; `SUBJECT_CAP=12` (una tanda de REFACTOR de 2 incluida), `COST_CAP=65` común de la 0055, 0057 y 0058, y el fichero `stop` junto al lanzador. El coste de un sujeto Opus no lo sé: el primer sujeto del RED lo mide, y si pasa de 2 $ paro y recalculo la previsión antes del segundo.
4. **Moldes reutilizados**: el repo `salas` de la 0044 (`mold.sh`), el gate del plan de la 0055 (`g2`) y el cierre de la 0057 (`c1`). Las copias van a `red/` de esta task: la campaña es de esta carpeta, y los lanzadores de otras tasks no se tocan.
5. **Recorte**: si un escenario del RED sale limpio, antes de recortar su guía miro de dónde sacó el sujeto la conducta (Art. I), y lo recortado se repite en el GREEN como control.

**Goal**: que la última parada antes de ejecutar ofrezca parar para bajar la sesión a gama media, que el plan Native registre la recomendación y que el walkthrough registre el modelo y el effort de cada fase.

**Architecture**: texto de skill y plantillas, medido con sujetos headless (Art. I) y fijado con un test Pester de literales. Sin código de producto.

**Tech Stack**: skills en Markdown, Pester 5 (`tests/*.Tests.ps1`), sujetos `claude -p` lanzados con bash sobre el molde `salas`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son tres tasks en serie, cada una sobre la salida de la anterior, sin interfaces de código entre ellas. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Literales de la spec, exactos:
  - opción de `pair`: «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media»
  - opción de `delegate`: «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media»
  - frase del plan: «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.»
  - walkthrough: «Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)» y «effort no registrado»
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes.
- No se tocan: `skills/sdd-start-task/references/control-profiles.md`, las init, `migrations/`, `.docs/sdd/roadmap.md` (0061); `skills/sdd-end-release/` (0063); `skills/sdd-end-patch/`, `patch-template.md`, `.docs/sdd/capabilities/` (0067).

### De proceso

- Art. IV: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos.
- Art. I: previsión y techo de la decisión 3; el lanzador los aplica.
- Un commit por hito (`commit-milestones.md`); commits con tipo/scope en inglés y cuerpo en castellano.
- Con la campaña en marcha, el hilo no commitea (tech-stack, task 0021).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una opción en dos gates, una frase en la plantilla del plan y un placeholder en la del walkthrough.
- [x] **YAGNI gate**: sin columna nueva en el estimation-log ni cambio en `Build-EstimationLog.ps1`.
- [x] **Brownfield gate**: la etiqueta «Modelo del hilo» no cambia; el gate de `pair` sigue siendo una sola pregunta.
- [x] **Constitution check**: Art. I (campaña), Art. IV (una frase), Art. IX (se cita `executing-plans`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20260924-225741-task-0058-session-model-policy/red/` — `run.sh`, `subject.sh`, `tools.mjs`, `texts.mjs` y `out/` de la campaña.
- `tests/session-model-red.md` y `tests/session-model-green.md` — evidencia.
- `tests/SessionModel.Tests.ps1` — literales de la guía.

**Modificar**:

- `.docs/sdd/constitution.md` — Art. IV, una frase tras la del revisor final de Native.
- `skills/sdd-start-task/SKILL.md` — gate del paso 4 (opción de `delegate`) y gate del paso 5 (opción de `pair`).
- `skills/sdd-templates/templates/plan-template.md` — línea `Ejecución`, frase con Native.
- `skills/sdd-templates/templates/walkthrough-template.md` — placeholder de «Modelo del hilo».
- `.docs/sdd/tech-stack.md` — lo aprendido en la campaña, si lo hay.

**NO se tocan**: los de «De código».

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto Opus cuesta mucho más de lo previsto | media | medio | parar tras el primero si pasa de 2 $ (decisión 3) |
| El sujeto sabe que es headless y no ofrece opciones de gate | baja | medio | la petición dice que el dev-lead leerá el mensaje y contestará, como en la 0055 |
| `capabilities/` cambia en `develop` por la 0067 | media | bajo | la fusión se hace en el cierre, tras integrar `develop` |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED de la campaña

**Modelo**: la sesión, Opus 5.5 (Native, sin despacho). Sujetos: `d4` y `p5` con `--model opus`; `c1` con `--model sonnet`.
**Tests RED**: la campaña es el RED; no hay test Pester en esta task.
**Superficies**: tooling (lanzador), docs (evidencia).
**Verificación**: `DRY=1` de cada escenario muestra el estado del molde; tras la campaña, `red/out/` tiene `state`, `tools` y `texts` de 5 sujetos.
**Se prueba en la aplicación**: no, porque es la medida previa a la guía: la comprobación es leer `tests/session-model-red.md`.

**Interfaces**:
- Consume: el molde `salas` (`20260923-191212-task-0044-commit-per-milestone/green/mold.sh`: `base_files`, `spec_files`, `plan_files`), el de la 0057 (`20260924-105352-task-0057-native-adapt/red/mold.sh`: `native_plan`, `native_tasks_done`, `final_review_recorded`) y los extractores `tools.mjs` y `texts.mjs` de la 0055.
- Produce: `red/run.sh` y `red/subject.sh` con los escenarios `d4`, `p5` y `c1`, que la Task 3 relanza con `KIT_DIR` apuntando al kit con la guía; y `tests/session-model-red.md` con el veredicto por escenario.

**Ficheros**: crear `red/run.sh`, `red/subject.sh`, `red/tools.mjs`, `red/texts.mjs`, `tests/session-model-red.md`.

- [ ] **Step 1: Lanzador** — copia de `run.sh` de la 0060, con `COST_CAP` sumando `*-task-005[578]-*/*/out/*.tools.txt` (el techo común) y `SUBJECT_CAP=12` contando solo los de esta carpeta; `MODEL` por escenario lo fija `subject.sh`.
- [ ] **Step 2: Sujeto** — `subject.sh` con tres escenarios:
  - `d4`: `feature/0012` con `spec_files`, la spec en `status: draft` y la fila de Aprobaciones en `pendiente`; perfil `delegate`. Petición: «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está escrita y repasada en `<spec>`. Toca el gate del paso 4: preséntala al dev-lead y para. El dev-lead leerá tu mensaje y, si le preguntas algo, contestará en el siguiente.» `--model opus`, `--max-turns 30`.
  - `p5`: el `g2` de la 0055 (spec aprobada, perfil `pair`, paso 5 hasta justo antes de la Task 1). `--model opus`.
  - `c1`: el `c1` de la 0057, con la petición de cierre ampliada: «La spec y el plan se hicieron con Opus 5.5, effort medium; antes de la Task 1 cambié con `/model` a Sonnet 5, effort medium.» `--model sonnet`. El estado guarda la línea «Modelo del hilo» del walkthrough.
- [ ] **Step 3: DRY** — `DRY=1` de los tres: el molde tiene lo que la conducta necesita (tech-stack, task 0010).
- [ ] **Step 4: RED** — `SCENARIOS="d4" SUBJECT=1`, mirar el coste (decisión 3); después `d4-2`, `p5-1`, `p5-2`, `c1-1`, en segundo plano. Kit: copia del working tree **antes** de la guía.
- [ ] **Step 5: Evidencia** — `tests/session-model-red.md`: por escenario y sujeto, si ofrece la opción (o menciona el modelo de la sesión), de dónde lo sacó, y qué escribe en «Modelo del hilo»; racionalizaciones textuales; coste y turnos; veredicto y recortes.
- [ ] **Step 6: Commit de la task** — `test(session-model): RED de la política de modelo de la sesión`.

### Task 2 — Guía y test de literales

**Modelo**: la sesión, Opus 5.5 (Native, sin despacho).
**Tests RED**: `tests/SessionModel.Tests.ps1`, escrito antes de tocar la guía y visto en rojo; copia en el scratchpad para compararla con `git diff --no-index` al cerrar.
**Superficies**: docs (skill, plantillas, constitution), tooling (test).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SessionModel.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es la guía; lo prueba el GREEN de la Task 3.

**Interfaces**:
- Consume: los recortes de `tests/session-model-red.md`: un escenario recortado pierde su guía y su test de literal.
- Produce: los literales de «De código», en `skills/sdd-start-task/SKILL.md` (pasos 4 y 5), `plan-template.md`, `walkthrough-template.md` y el Art. IV.

**Ficheros**: crear `tests/SessionModel.Tests.ps1`; modificar `.docs/sdd/constitution.md`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-templates/templates/walkthrough-template.md`.

- [ ] **Step 1: Test RED** — un `It` por THEN:
  - el paso 4 de `sdd-start-task` contiene la opción de `delegate`, literal;
  - el paso 5 contiene la opción de `pair`, literal;
  - la línea `Ejecución` de `plan-template.md` contiene la frase del plan, literal;
  - «Modelo del hilo» de `walkthrough-template.md` pide modelo y effort por fase y nombra «effort no registrado»;
  - el Art. IV nombra la gama media para la sesión de Native y dice que bajar solo el effort de Opus no es gama media.
  Con `Get-SkillStep` como en `NativeAdapt.Tests.ps1`. Ver los cinco en rojo.
- [ ] **Step 2: Paso 4** — tras «…la pregunta va sola, en su propia línea, al final de la presentación.» del gate: «En `delegate`, si la sesión va con el modelo más capaz, la pregunta ofrece además, sin ser la recomendada, «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media»: la sesión no puede cambiar su modelo, y tras aprobar ya no hay otra parada donde el usuario pueda hacerlo (Art. IV). Si la elige, escribes el plan, juntas la apertura en su commit y, con Native, terminas el turno diciendo el cambio (`/model`, Sonnet con effort medium) y que diga «sigue».» + la cifra del RED.
- [ ] **Step 3: Paso 5** — tras las opciones del gate de `pair`: «Si el método recomendado o fijado es Native y la sesión va con el modelo más capaz, añade, sin ser la recomendada, «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media»; si la elige, juntas la apertura y terminas el turno igual que en el paso 4.» + la cifra del RED.
- [ ] **Step 4: Plantillas** — en `plan-template.md`, tras la frase del cambio de método: «· con native, añade también: La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.» En `walkthrough-template.md`: `- Modelo del hilo: <modelo y effort; si cambiaron, los de cada fase: «Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)»; «effort no registrado» si no lo sabes, nunca uno supuesto>`.
- [ ] **Step 5: Art. IV** — tras «…es el techo por defecto.»: «La sesión que ejecuta en Native es el implementador, y su modelo lo elige el usuario: el kit le recomienda gama media, Sonnet con effort medium, porque `executing-plans` «runs well on a mid-tier session model», y se lo ofrece en la última parada antes de ejecutar. Bajar solo el effort de Opus no es gama media: piensa menos, pero cada token cuesta como Opus. El walkthrough registra el modelo y el effort de cada fase; el ahorro se mide, no se supone.»
- [ ] **Step 6: Verificación** — el test en verde; comparar el test con su copia (`git diff --no-index`).
- [ ] **Step 7: Commit de la task** — `feat(sdd-start-task): ofrecer bajar la sesión a gama media antes de ejecutar en Native`.

### Task 3 — GREEN y evidencia

**Modelo**: la sesión, Opus 5.5 (Native, sin despacho). Sujetos como en la Task 1.
**Tests RED**: la campaña GREEN es la medida; el test Pester de la Task 2 no cambia.
**Superficies**: tooling (campaña), docs (evidencia, tech-stack).
**Verificación**: `red/out/` (con `OUT_NAME=green`, `green/out/`) tiene 5 sujetos más; `tests/session-model-green.md` escrito.
**Se prueba en la aplicación**: no, porque es la medida de la guía: la comprobación es leer `tests/session-model-green.md`.

**Interfaces**:
- Consume: `red/run.sh` y `red/subject.sh` de la Task 1; la guía de la Task 2.
- Produce: `tests/session-model-green.md` con veredicto por THEN.

**Ficheros**: crear `tests/session-model-green.md`; modificar `.docs/sdd/tech-stack.md` si hay aprendizaje.

- [ ] **Step 1: GREEN** — copia del kit con la guía; `OUT_NAME=green SCENARIOS="d4 p5 c1"`, sujetos 1 y 2 de `d4` y `p5`, 1 de `c1`, en segundo plano. Si la guía falla y queda techo, una tanda de REFACTOR (≤ 2 sujetos) tras corregirla.
- [ ] **Step 2: Evidencia** — `tests/session-model-green.md` con el veredicto por THEN, frente al RED, y los controles de lo recortado.
- [ ] **Step 3: tech-stack** — lo aprendido, si lo hay (por ejemplo, el coste de un sujeto Opus).
- [ ] **Step 4: Commit de la task** — `test(session-model): GREEN de la política de modelo de la sesión`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0.75h
- Estimación de implementación: 2h
- Base de la estimación: tres tasks, una campaña de 10 sujetos en segundo plano; la 0057 (~20 sujetos) y la 0060 son la referencia; mediana docs 0.52
- Confianza: media (coste de sujetos Opus sin medir)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (con los `Slow`).
- [ ] Revisión final de rama con `sdd-kit:effort-high` + `model: opus`.
- [ ] Guion de pruebas al dev-lead (paso 7).
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- El gate del plan en `pair` ofrece parar para bajar la sesión → Task 2 (Step 3), medido en `p5` (Tasks 1 y 3). ✓
- El gate de la spec en `delegate` ofrece parar tras el plan → Task 2 (Step 2), medido en `d4`. ✓
- Con Native, el plan registra el modelo recomendado → Task 2 (Step 4), medido en `p5` (escribe el plan). ✓
- El walkthrough registra modelo y effort por fase → Task 2 (Step 4), medido en `c1`. ✓
- Art. IV → Task 2 (Step 5), test de literal. ✓
- AND «si el usuario la elige…» → sin sujeto (spec, decisión 8); lo prueba la validación final. ✓
- AND «si aprueba sin esa opción, sigue sin parar» → conducta vigente, medida en la 0055 y la 0057; sin sujeto nuevo. ✓
