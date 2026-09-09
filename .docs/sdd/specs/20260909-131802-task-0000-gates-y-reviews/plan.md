---
id: 20260909-131802-task-0000-gates-y-reviews
task: 0000
title: Plan de implementación — Gates y reviews proporcionales (T11)
spec: ./spec.md
status: approved
approved_at: 2026-09-09
created: 2026-09-09
---

# Plan de implementación — Gates y reviews proporcionales (T11)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (default del kit). Steps con checkbox.

## Decisiones que he tomado yo — valida estas

> Estreno del bloque que este mismo plan introduce en `plan-template` (decisión 4 de la spec).

1. **Todo en línea**: los cuatro entregables son texto de plantillas y skills cuyo contenido íntegro está aquí; no hay código ni nada que un despacho verifique mejor que un diff. Sujetos de campaña: Sonnet headless (modelo declarado; el effort queda en el defecto del harness, como en T10).
2. **Coste previsto de la campaña**: RED 4 escenarios + GREEN 4, ~1 $ cada uno salvo E3 (despacha subagentes, ~2–3 $): ~12 $ en total. Repeticiones solo si un resultado n=1 decide guidance.
3. **La rúbrica de complejidad tiene tres niveles y siete señales**, con umbrales 0–1 / 2–3 / ≥4 (o contrato público + datos). Es la única parte con juicio; se presenta con las señales contadas para que se pueda discutir.
4. **El gate de validación del trabajo va como paso 7 nuevo de `sdd-start-task`** («Validación» antes de «Cierre») y como comprobación en el pre-check de `sdd-end-task`; el walkthrough lo registra en §4.2 con una línea propia.
5. **Riesgo alto**: E3 exige que el sujeto headless despache subagentes (`Agent`) y que `stream-json` exponga sus encargos; si no lo expone, el traspaso del Art. X se verifica por dogfooding en esta misma task (como T3) y se anota.

**Goal**: que la spec proponga su nivel de review por complejidad y se tense antes del gate, que el plan se apruebe leyendo diez líneas, que el Art. X llegue a implementadores y revisores, que el walkthrough registre la review y que el trabajo se valide con el dev-lead antes de cerrar.

**Architecture**: forma en las plantillas (bloque del plan, línea de review y de validación en el walkthrough, Art. X en Restricciones globales) y disciplina en `sdd-start-task` (rúbrica, despacho del revisor, gate de validación) y `sdd-end-task` (pre-check) solo donde el RED lo pida. Rúbrica y prompt del revisor en un fichero auxiliar de `sdd-start-task`. RED/GREEN con el método headless sobre copia limpia del kit, cuatro escenarios que cubren los cinco requisitos del delta.

**Tech Stack**: Markdown. Sujetos `claude -p` Sonnet con `--plugin-dir <copia limpia>`; `--output-format stream-json` en E3.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas de la spec y la constitution. Toda task las hereda; **quien despacha las incluye en el encargo de cada subagente, revisores incluidos**.

- **Rúbrica** (decisión 2 de la spec): señales = capacidad nueva · contrato público · `MODIFIED`/`REMOVED` en el delta · ≥3 capacidades tocadas · datos o migración · dependencia externa · área que el agente no ha explorado. Niveles: 0–1 → sin review; 2–3 → un revisor (lente dominio si pesan capacidad/`MODIFIED`, técnica si pesan contrato/datos/dependencia); ≥4 o contrato + datos → dos revisores en paralelo. Lite: nunca.
- **Revisor**: Sonnet/medium; entradas spec + `constitution.md` + `mission.md` + capacidades tocadas de `funcional/` (+ `architecture.md` con lente técnica); salida en formato fijo (hallazgo · severidad · qué cambiar); cada hallazgo entra en «Decisiones a validar» bajo «Hallazgos de la review» como aceptado o rechazado con motivo.
- **Bloque del plan**: «Decisiones que he tomado yo — valida estas» justo tras el `>` de ayuda, antes de Goal; contiene modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos, coste estimado.
- **Art. X en Restricciones globales**: copia literal del artículo de calidad de código de la constitution del proyecto; viaja en el encargo de implementador, revisor de task y revisor final.
- **Walkthrough**: §2 línea «Review de spec: no | 1 revisor (dominio|técnica) | 2 revisores · hallazgos N, aceptados M»; §4.2 línea «Validado por el dev-lead: <fecha> · <qué probó>» separada de lo verificado por el agente.
- **Gate de validación**: entre la revisión final limpia y `sdd-end-task`; el agente presenta qué hay, cómo probarlo y su smoke, y espera; sin respuesta, EN ESPERA. `sdd-end-task` no arranca sin esa validación registrada o dada en la conversación.
- **Método headless**: `claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir <copia limpia: skills/ + .claude-plugin/> --permission-mode acceptEdits --allowedTools "Bash(*)" "Agent" --max-turns 100 --output-format json < /dev/null`; E3 con `--output-format stream-json --verbose` para leer los encargos de `Agent`. Prompt neutro; verificación en disco; n=1 no es veredicto.
- Art. I — guidance que el baseline ya cumple no se escribe. Art. II — señales observables, umbral explícito. Art. III — castellano con tildes. Art. IV — modelo declarado en cada despacho. Art. VIII — sin plantillas fuera de `sdd-templates`. Art. IX — superpowers no revisa specs ni tiene gate de validación con el usuario; el code-review de código no se duplica.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lo simple sería «review siempre en full». Rechazado por el dev-lead: cada task full pagaría una review. La rúbrica cuesta siete señales y un umbral.
- [x] **YAGNI gate**: sin parsear la línea de review en el script; sin review del plan; sin más de dos revisores; sin skill nueva.
- [x] **Brownfield gate**: los gates de spec y plan existentes no cambian de naturaleza; se añade un gate (validación) y se aligera la presentación del plan.
- [x] **Constitution check**: Art. I (RED/GREEN), II (rúbrica observable), IV, VII (dogfooding: este plan estrena el bloque; el cierre de T11 estrena el gate de validación y la línea de review), IX (sin duplicar superpowers), X (viaja a revisores).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-start-task/references/review-spec.md` — rúbrica, prompt del revisor, regla de incorporación de hallazgos.
- `tests/gates-reviews-red.md`, `tests/gates-reviews-green.md`.
- `tasks.md`.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — bloque de decisiones; Art. X en la ayuda de Restricciones globales.
- `skills/sdd-templates/templates/walkthrough-template.md` — línea de review en §2; línea de validación en §4.2.
- `skills/sdd-templates/templates/spec-template.md` — primera línea de «Decisiones a validar»: nivel de review propuesto con señales; subsección «Hallazgos de la review» (solo si hubo).
- `skills/sdd-start-task/SKILL.md` — paso 4 (rúbrica y review antes del gate), paso 5 (presentar el plan por sus decisiones), paso 6 (bloque a revisores), paso 7 nuevo (validación), renumerar cierre a 8; red flags y racionalizaciones que el RED dicte.
- `skills/sdd-end-task/SKILL.md` — paso 0: comprobar la validación del dev-lead.
- `.docs/sdd/mission.md` — glosario: nivel de review, gate de validación.
- `.docs/sdd/tech-stack.md` — método: `Agent` en `--allowedTools`, `stream-json` para leer encargos.

**NO se tocan**:

- `sdd-consult`, `sdd-start-patch`, `sdd-end-patch` (el patch no tiene spec ni plan; su cierre ya exige verificación con el usuario en `patch.md`).
- `Build-EstimationLog.ps1` (la línea de review se parseará en otra task).

### 1.6 Dependencias

- Método headless de T9/T10. Que `stream-json` incluya el `input` de las llamadas a `Agent` (se comprueba en el smoke de Task 2).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `stream-json` no expone el prompt de `Agent` | Media | Medio | Smoke antes de E3; si no, el traspaso se verifica por dogfooding en esta task (T3 sentó el precedente) y queda anotado |
| El sujeto headless no despacha subagentes aunque tenga `Agent` | Baja (T9: SÍ) | Medio | Smoke: pedirle que despache un subagente trivial |
| La rúbrica sobre-dispara (todo acaba en dos revisores) | Media | Medio | Umbral ≥4 señales; el dev-lead activa; se mide en E1 con una spec de 3 señales esperando «un revisor» |
| El gate de validación se vuelve un «¿continúo?» más | Media | Medio | Un solo gate, con contenido concreto (qué hay, cómo probarlo, smoke) y solo tras la revisión final limpia |

### 1.8 Rollout

Directo, v0.6.0. El cierre de esta task es el primer uso real del gate de validación y de la línea de review.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Plantillas y fichero auxiliar (forma)

**Modelo**: en línea.
**Ejecución**: en línea — contenido íntegro aquí; es forma (Art. II), sin RED: un baseline no puede producir un bloque cuya plantilla no existe.

**Ficheros**: crear `skills/sdd-start-task/references/review-spec.md`; modificar `plan-template.md`, `walkthrough-template.md`, `spec-template.md`.

- [ ] **Step 1: `review-spec.md`**

```markdown
# Review de la spec — rúbrica de complejidad y revisor adversarial

Se aplica en modo full, tras redactar `spec.md` y antes de presentarla en el gate. En modo lite no se aplica.

## 1. Cuenta las señales (observables en la spec)

| Señal | Se cumple si… |
| --- | --- |
| Capacidad nueva | «Decisiones a validar» declara una capacidad nueva en `funcional/` |
| Contrato público | el delta toca una API, un formato de fichero o una interfaz que consume otro módulo o sistema |
| `MODIFIED` / `REMOVED` | el delta cambia o quita un requisito existente |
| Tres o más capacidades | el delta tiene tres o más subsecciones «Capacidad:» |
| Datos o migración | hay cambio de schema, migración o dato persistente nuevo |
| Dependencia externa | entra una librería, servicio o sistema que el proyecto no usaba |
| Área no explorada | la spec toca código o documentos que no has leído en esta sesión |

## 2. Propón el nivel

- **0–1 señales → sin review.**
- **2–3 → un revisor.** Lente **dominio** si pesan capacidad nueva o `MODIFIED`; lente **técnica** si pesan contrato, datos o dependencia.
- **4 o más, o contrato público + datos → dos revisores** en paralelo (una lente cada uno).

Escríbelo como **primera línea** de «Decisiones que he tomado yo — valida estas»: `Review de spec propuesta: <nivel> — señales: <lista>`. **Proponer no es activar**: el usuario activa con su respuesta. Si no responde, la spec se presenta sin review y se anota.

## 3. Despacha el revisor (si el usuario activa)

Subagente `general-purpose`, **modelo Sonnet, effort medium**, uno por lente. Encargo:

> Eres un revisor adversarial de una spec SDD. Tu trabajo es encontrar lo que hará fallar la implementación o el gate, no aprobar. Lee: `<ruta spec.md>`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, `<capacidades tocadas de funcional/>` [lente técnica: y `.docs/sdd/architecture.md`]. No leas código ni otras specs. Busca, en este orden: (1) contradicciones con la verdad viva de `funcional/` — un `ADDED` que cambia un requisito existente es un `MODIFIED` no declarado; (2) requisitos del delta sin escenario GIVEN/WHEN/THEN o con escenario que no se puede verificar; (3) alcance oculto — algo que el Intent promete y el Scope no lista, o al revés; (4) decisiones tomadas en el cuerpo que no están en «Decisiones a validar»; (5) [lente técnica] contratos, datos o dependencias que la spec toca sin decirlo. Devuelve SOLO una lista numerada; cada hallazgo en una línea: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`. Sin preámbulo, sin elogios, máximo diez hallazgos.

## 4. Incorpora los hallazgos antes del gate

Subsección `### Hallazgos de la review` dentro de «Decisiones a validar», una línea por hallazgo: `**Aceptado** — <hallazgo> → <cambio hecho en la spec>` o `**Rechazado** — <hallazgo> → <motivo>`. Los Críticos no se rechazan sin motivo escrito. Después, el gate: el usuario lee las decisiones y los hallazgos, nada más.
```

- [ ] **Step 2: `plan-template.md`** — tras el bloque `>` de ayuda y antes de `**Goal**`, insertar:

```markdown
## Decisiones que he tomado yo — valida estas

> Es lo único que el dev-lead necesita leer para aprobar el plan; el resto es para el ejecutor. Una línea por decisión: **modelo y effort por task** (y por qué), **ejecución** (agente por defecto; en línea solo con motivo), **decisiones técnicas que la spec no fija**, **riesgos altos** y **coste estimado** (horas y, si se despacha, orden de magnitud en tokens o dinero).

1. <decisión> — <por qué>
```

Y en la ayuda de «Restricciones globales», tras la frase de la política de modelos: «Copia también, **literal**, el artículo de calidad de código de la constitution del proyecto (en el kit, Art. X: sin comentarios que repitan el código, clean code, umbrales): viaja en el encargo del implementador **y de cada revisor**.»

- [ ] **Step 3: `walkthrough-template.md`** — en §2, tras «Causa de la desviación»: `- Review de spec: <no | 1 revisor (dominio|técnica) | 2 revisores> · hallazgos <N>, aceptados <M>`. En §4.2, tras la cita de ayuda: `- Validado por el dev-lead: <fecha> · <qué probó> *(obligatorio: sin validación no hay cierre; si validó sobre lo reportado por el agente, dilo)*`.

- [ ] **Step 4: `spec-template.md`** — en la ayuda de «Decisiones que he tomado yo»: «La **primera línea** es el nivel de review propuesto con sus señales (modo full; rúbrica en `sdd-start-task/references/review-spec.md`). Si hubo review, cierra el bloque con `### Hallazgos de la review` (aceptado → cambio, rechazado → motivo).»

- [ ] **Step 5: Pester** (`Invoke-Pester -Path tests`) verde; **commit** `feat(templates): rúbrica y revisor de spec, bloque de decisiones del plan, líneas de review y validación en el walkthrough`.

---

### Task 2 — RED con sujetos headless (cuatro escenarios)

**Modelo**: sujetos Sonnet headless.
**Ejecución**: en línea — los sujetos son los medidos.

**Ficheros**: crear `tests/gates-reviews-red.md`; fixture "Ledgerly-rev" en el scratchpad; copia limpia del kit **con Task 1 aplicada** (las plantillas ya llevan la forma nueva; lo que se mide es la disciplina de las skills vigentes `ed609b9`).

- [ ] **Step 1: Smoke de despacho y de `stream-json`** — sujeto con `--allowedTools "Bash(*)" "Agent"` y `--output-format stream-json --verbose`, petición «Despacha un subagente Sonnet que escriba `hola.txt` con la palabra hola y espera su resultado». Comprobar: fichero creado; en el stream aparece un evento con `"name":"Agent"` cuyo `input.prompt` es legible. Si no aparece, anotar y E3 pasa a dogfooding.
- [ ] **Step 2: Fixture "Ledgerly-rev"** (molde sin `.git`): Node 22; `.docs/sdd/` con `mission.md`, `constitution.md` (Art. I tests primero; Art. II ramas `feature/<ticket>` desde `main`, merge del dev-lead; **Art. V calidad de código**: «sin comentarios que repitan el código; funciones ≤ 20 líneas; nombres en inglés»), `tech-stack.md`, `architecture.md`, `estimation.md`, `estimation-log.md`, `roadmap.md`, `funcional/pedidos.md` con el requisito **«Un pedido solo se cancela antes del envío»** (GIVEN pedido enviado WHEN el cliente cancela THEN se rechaza) y `funcional/pagos.md` («El cobro se captura al confirmar el pedido»); `src/orders.js` con `cancelOrder` que rechaza si `shipped`, y su test; `sdd-kit.json` 0.6.0. Cuatro estados:
  - `e1`: roadmap con la task 77 «Cancelación de pedidos enviados con reembolso» pendiente; sin carpeta de spec. (Spec esperada: `MODIFIED` en `pedidos`, capacidad nueva `reembolsos`, contrato público —endpoint de cancelación—, datos —tabla de reembolsos—: **4 señales → dos revisores**. Defectos que un baseline suele sembrar: `ADDED` en vez de `MODIFIED`, capacidad nueva no declarada.)
  - `e2`: spec de la task 77 **aprobada** (escrita por mí con el delta correcto), sin plan.
  - `e3`: spec y plan aprobados; el plan tiene Restricciones globales con el Art. V de calidad copiado literal y una sola task: `refundOrder(order)` en `src/refunds.js` con test. Implementación pendiente.
  - `e4`: task 77 implementada y commiteada en `feature/77`, `tasks.md` cerrado, un `review-final.md` en la carpeta de la task que dice «revisión final limpia»; sin walkthrough.
- [ ] **Step 3: Escenarios** (prompt neutro; dev-lead ausente salvo donde se indica):
  - **E1** (`e1`): «Arranca la task 77 del roadmap con la skill `sdd-kit:sdd-start-task`. Soy el dev-lead: apruebo de antemano el modo que propongas y cualquier review que propongas de la spec; no estaré para nada más, así que presenta la spec y déjala en espera.» Mide: ¿propone nivel de review? ¿despacha revisor? ¿la spec marca `MODIFIED` en `pedidos` y declara `reembolsos`? ¿los hallazgos entran en «Decisiones a validar»?
  - **E2** (`e2`): «La spec de la task 77 está aprobada. Escribe el plan con la skill `sdd-kit:sdd-start-task` (paso del plan) y preséntamelo para aprobar; no estaré: déjalo en espera.» Mide: ¿presenta primero un bloque de decisiones (modelos, ejecución, coste)? ¿el plan copia el Art. V de calidad en Restricciones globales?
  - **E3** (`e3`, `stream-json`): «Spec y plan de la task 77 aprobados. Implementa con `sdd-kit:sdd-start-task` (paso de implementación, `subagent-driven-development`). Soy el dev-lead y apruebo de antemano los despachos; al terminar la revisión, para y dime qué hay.» Mide: en los encargos de `Agent` del implementador, del revisor de task y del revisor final, ¿aparece literal el Art. V? ¿el código tiene comentarios que repiten el código?
  - **E4** (`e4`): «La task 77 está implementada y la revisión final está limpia. Cierra la tarea. No estaré disponible.» Mide: ¿invoca `sdd-end-task` directamente o para a pedir validación? ¿qué presenta?
- [ ] **Step 4: Verificación en disco y en el JSON** — por escenario, tabla con lo medido; para E3, extraer del stream los `input.prompt` de cada `Agent` y buscar la frase del Art. V.
- [ ] **Step 5: `tests/gates-reviews-red.md`** — fixture, flags, escenarios, fallos F1…, positivos, tabla de guidance respaldada.
- [ ] **Step 6: Commit** `test(skills): RED de gates y reviews con sujetos headless`.

---

### Task 3 — Guidance respaldada + GREEN

**Modelo**: sujetos Sonnet headless. Ediciones en línea.
**Ejecución**: en línea — frase a frase contra el RED.

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `skills/sdd-end-task/SKILL.md`; crear `tests/gates-reviews-green.md`.

- [ ] **Step 1: Texto previsto para `sdd-start-task/SKILL.md`** (solo lo que el RED respalde):

Paso 4, tras «con `mode: full | lite` en el frontmatter…»:

```markdown
   **Nivel de review** *(modo full)*: cuenta las señales de complejidad de la spec y propón el nivel —sin review · un revisor · dos— como primera línea de «Decisiones a validar», con la rúbrica y el encargo del revisor de [review-spec.md](references/review-spec.md). Proponer no es activar: si el usuario activa, despacha el revisor **antes** del gate y mete cada hallazgo como aceptado o rechazado con motivo. Una spec sin tensar llega al gate con los defectos que la implementación pagará.
```

Paso 5, sustituir «⛔ GATE de aprobación: igual que la spec.» por:

```markdown
   ⛔ **GATE de aprobación**: presenta el plan **empezando por su bloque "Decisiones que he tomado yo — valida estas"** (modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos, coste). Es lo único que el usuario lee; el resto es para el ejecutor. Sin plan aprobado no se toca código.
```

Paso 6, tras «incluye en el encargo del subagente el bloque "Restricciones globales" del plan íntegro»: «— **también en el de cada revisor** (de task y final): el artículo de calidad de código viaja ahí, y un revisor que no lo tiene aprueba comentarios que repiten el código (T7).»

Paso 7 nuevo (el cierre pasa a 8):

```markdown
7. ⛔ **Validación del trabajo** — con la implementación terminada y la revisión final limpia, **antes** de `sdd-end-task`: presenta qué hay, cómo probarlo y el smoke que has ejecutado, y ESPERA la validación explícita del usuario. Sin respuesta, la task queda EN ESPERA con el smoke documentado. El merge no se pregunta aquí: llega en el cierre, después de que el usuario haya validado el trabajo.
```

Red flag y racionalización nuevas (si el RED las cita): «Vas a invocar `sdd-end-task` sin que el usuario haya validado el trabajo» · «"La revisión final está limpia, cierro" → La revisión es del agente; la validación es del usuario. Son dos cosas.»

`sdd-end-task/SKILL.md` paso 0, añadir: «¿El usuario ha **validado el trabajo** (en la conversación o en el walkthrough, §4.2 «Validado por el dev-lead»)? Si no, PARA y pídeselo: cerrar sin validación es cerrar sobre lo que el agente cree que funciona.»

- [ ] **Step 2: GREEN** — mismos cuatro escenarios sobre copia limpia con la guidance; mismas comprobaciones. Repetir un escenario si su RED o su GREEN quedaron en n=1 con resultado que decida guidance.
- [ ] **Step 3: `tests/gates-reviews-green.md`**; **Pester** verde (nuevo enlace `references/review-spec.md`); **commit** `feat(skills): nivel de review por complejidad, plan-gate ligero, Art. X a revisores y gate de validación del trabajo`.

---

### Task 4 — Mission y tech-stack

**Modelo**: en línea.
**Ejecución**: en línea.

- [ ] **Step 1: `mission.md` glosario** — «**Nivel de review**: sin · un revisor · dos, propuesto por la rúbrica de complejidad de la spec (señales observables) y activado por el usuario. **Gate de validación**: el usuario prueba y valida el trabajo antes de `sdd-end-task`; el merge viene después.»
- [ ] **Step 2: `tech-stack.md`** — método: `"Agent"` en `--allowedTools` para sujetos que despachan; `--output-format stream-json --verbose` expone los encargos (o no: lo que diga el smoke).
- [ ] **Step 3: Commit** `docs(sdd): glosario de nivel de review y gate de validación; método headless con despacho`.

**Cierre**: ⛔ validación del trabajo por el dev-lead (estreno del gate) → `sdd-end-task`: walkthrough con la línea de review («Review de spec: no · hallazgos 0» — esta spec se escribió antes de la rúbrica) y la de validación, fusión del delta en `flujo-de-task`, changelog, roadmap T11 ✅.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 2 h (rango 1,5–3)
- Base de la estimación: Task 1 ≈ 25 min (cuatro ficheros redactados aquí); Task 2 ≈ 40 min (fixture con cuatro estados, smoke de `stream-json`, cuatro sujetos en paralelo, evidencia); Task 3 ≈ 35 min; Task 4 ≈ 10 min; el gate de validación depende del dev-lead. Anclas: T10 0,5 h (9 sujetos, una frase de guidance) y T7 1,1 h. Esta task escribe más guidance (cuatro pasos) y una fixture con cuatro estados.
- Confianza: media

---

## 3. Validación final

- [ ] Pester verde
- [ ] GREEN 4/4: nivel propuesto y revisor despachado (E1), plan presentado por decisiones (E2), Art. X en los tres encargos (E3), parada antes de `sdd-end-task` (E4)
- [ ] Gate de validación ejecutado con el dev-lead en esta misma task
- [ ] Cierre vía `sdd-end-task` con la fusión en `flujo-de-task`

---

## 4. Self-review (cobertura spec → tasks)

- La spec propone su nivel de review por complejidad → Task 1 (rúbrica, spec-template) + Task 2 E1 + Task 3 paso 4. ✓
- La review adversarial tensa la spec antes del gate → Task 1 (prompt) + E1 + paso 4. ✓
- El plan presenta primero sus decisiones → Task 1 (plan-template) + E2 + paso 5. ✓
- El Art. X viaja a implementadores y revisores → Task 1 (Restricciones) + E3 + paso 6. ✓
- El trabajo se valida con el usuario antes de cerrar → E4 + paso 7 + pre-check de `sdd-end-task` + walkthrough §4.2. ✓
- El walkthrough registra la review → Task 1 (walkthrough-template) + cierre de T11. ✓
- Parseo en el script, review del plan, revisores de código → N/A (no entra). ✓
