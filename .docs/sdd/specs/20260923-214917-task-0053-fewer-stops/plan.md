---
id: 20260923-214917-task-0053-fewer-stops
task: 0053
title: Plan de implementación — Menos paradas y avisos llanos
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Menos paradas y avisos llanos

> Ejecución: `superpowers:subagent-driven-development` (default del kit); la Task 3 va en línea, con su motivo.

## Decisiones que he tomado yo — valida estas

1. **Tres tasks** — T1, el carril de task (`sdd-start-task`, `control-profiles.md`, `sdd-end-task`); T2, el carril de patch (`sdd-start-patch`, `sdd-end-patch`); T3, el GREEN. T1 y T2 no comparten fichero. Un revisor puede rechazar una y aprobar la otra.
2. **El plan trae el texto que se inserta, literal** — el implementador lo coloca, no lo redacta. Puede ajustar la puntuación para que encaje con la frase de al lado, pero no los literales que miran los tests.
3. **Modelos** — implementadores T1 y T2: Sonnet, effort medio. El texto viene escrito, pero va en párrafos largos de skill, y colocarlo mal cambia a qué paso se aplica. Revisores de task y revisor final: Sonnet, effort medio. Los sujetos del GREEN: Sonnet, como en el RED.
4. **T3 en línea** — la campaña la lanza el hilo principal, con el molde de `red/`, igual que en el RED. Un subagente no puede lanzar `claude -p` en primer plano con el techo compartido.
5. **Tests RED de T1 y T2** — `tests/FewerStops.Tests.ps1`, estático: comprueba que cada literal está en su paso. La conducta la mide el GREEN, no Pester.
6. **El aviso de fase va en la cabecera del checklist** (decisión 8 de la spec). **Riesgo**: `tech-stack.md` (patch 0037) midió que una obligación escrita lejos del paso que la ejecuta dio 0/2. Si s1 falla en el GREEN, la tanda de REFACTOR la repite en los pasos 5 y 6, que son los que cruza s1.
7. **Coste** — implementación ~0,5 h con 2 implementadores y ~4 revisiones (~400k tokens de subagentes). GREEN: 17 sujetos, ~6 $, ~1 h. Queda dentro del techo de 18 $ (gastado: 4,61 $).
8. **Espera a la 0031** — no se despacha T1 hasta que la 0031 esté en `develop` (instrucción del dev-lead). Entonces se integra `develop` y se hace la comprobación de base del paso 6.

**Goal**: las cuatro piezas de la spec, más la forma del síntoma medido, escritas en su punto de uso y medidas con el GREEN.

**Architecture**: frases en el paso que se ejecuta cuando toca, dirigidas a los fallos del RED (`tests/fewer-stops-red.md`). Sin scripts nuevos.

**Tech Stack**: skills en Markdown; Pester 5 (`tests/*.Tests.ps1`); sujetos headless `claude -p` (`tech-stack.md`, «Sujetos headless»).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Los literales que el plan da entre comillas «…» o en `código` van tal cual: los comprueba `tests/FewerStops.Tests.ps1`.

### De proceso

- Política de modelos del Art. IV: modelo **y** effort explícitos en cada despacho; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; `fable` y `opus xhigh` prohibidos.
- Ejecución por agente, salvo la Task 3 (en línea, motivo en su campo).
- Un commit por hito (`skills/sdd-start-task/references/commit-milestones.md`). Commits: tipo/scope en inglés, cuerpo en castellano, con el trailer `Co-Authored-By` de la sesión.
- Sin despachos hasta que la 0031 esté en `develop`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: frases en pasos existentes, sin referencias nuevas.
- [x] **YAGNI gate**: sin abstracciones; la pieza 4 es una sola regla para las dos salidas.
- [x] **Brownfield gate**: conserva la numeración de pasos y los anclajes que enlazan otras skills.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en T3, previsión y techo declarados), Art. II (forma para s1 y s7, disciplina con racionalización para s5), Art. III, Art. VIII (no se toca ninguna plantilla).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/FewerStops.Tests.ps1` — los literales de cada pieza en su paso (lo escribe el hilo antes de despachar).
- `tests/fewer-stops-green.md` — evidencia del GREEN (T3).

**Modificar**:

- `skills/sdd-start-task/SKILL.md` — cabecera del checklist (aviso de fase), paso 2 (opción de delegación), paso 4 (gate con la delegación) y paso 7 (decisión sola y «sí» sin detalle).
- `skills/sdd-start-task/references/control-profiles.md` — filas «Review de spec recomendada» y «Spec» de la tabla de gates.
- `skills/sdd-end-task/SKILL.md` — pasos 0 y 1.
- `skills/sdd-start-patch/SKILL.md` — paso 1 (salida «no se reproduce»), paso 3 (síntoma medido), red flags y racionalizaciones.
- `skills/sdd-end-patch/SKILL.md` — paso 4 (fila re-medida).

**NO se tocan**:

- `skills/sdd-templates/templates/patch-template.md` — la forma del síntoma medido va en el paso 3 de `sdd-start-patch`, que es quien lo escribe; así no se abre una plantilla por una frase.
- `capabilities/*.md` — los escribe el cierre al fusionar el delta.
- `skills/sdd-start-task/SKILL.md` paso 6 — es de la 0031.

### 1.6 Dependencias

- La 0031, sobre el paso 6 de `sdd-start-task`: se espera a que esté en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El aviso en la cabecera no se aplica en los pasos (patch 0037) | media | s1 falla en el GREEN | REFACTOR: repetirlo en los pasos 5 y 6 |
| La guía de s5 (parar) arrastra a s7 y c5 (seguir) | media | un patch válido no se abre | s5, s7 y c5 en la misma tanda del GREEN |
| La delegación se lee como aprobación sin haberla elegido | baja | una spec sin aprobar | control c2 en el GREEN |
| Conflicto de texto con la 0031 en `sdd-start-task` | baja | un merge manual | integrar `develop` antes de despachar T1 |

### 1.8 Rollout

Directo: entra en la 2.0.0 con el resto de la release.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Carril de task: aviso de fase, delegación en la primera pregunta y paso 7

**Modelo**: `general-purpose` + `model: sonnet` · effort: no disponible en este harness, hereda el de la sesión (la sesión no carga `sdd-kit:effort-medium` de la 0031)
**Tests RED**: hilo principal · `tests/FewerStops.Tests.ps1`, bloques `Describe 'Task 1 — …'`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: nada que use otra task. T3 mide los textos.

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/control-profiles.md` y `skills/sdd-end-task/SKILL.md`.

- [ ] **Step 1: Aviso de fase** — en `skills/sdd-start-task/SKILL.md`, justo debajo del encabezado `## Checklist por tarea (crea un todo por paso)` y antes del `1.`, este párrafo:

  ```markdown
  **Aviso de fase** — cada vez que pasas de un paso al siguiente, tu mensaje abre con una línea en llano: `Ahora: <qué haces, dicho sin número de paso>. Queda: <lo que falta hasta la próxima parada del usuario>, ~<minutos>`, y `, ~<dólares>` si el paso lanza subagentes o sujetos. Un contador («van 7 de 15») o un número de paso solos no le dicen al usuario dónde está: medido 2/2 en `tests/fewer-stops-red.md` (s1), donde los avisos decían qué se hacía y nunca cuánto quedaba.
  ```

- [ ] **Step 2: Primera pregunta** — en el paso 2, tras la frase que termina en «Perfiles y precedencia: [control-profiles.md](references/control-profiles.md).», añade:

  ```markdown
  En `pair` y `delegate`, la misma pregunta ofrece una opción más, «apruebo la spec por delegación, nos vemos en la validación», para quien se va a ausentar: sin ella, 2/2 sujetos del RED no la ofrecieron y una task quedó ~4 h parada en el gate (`tests/fewer-stops-red.md`, s2). Elegirla es la frase literal que quita la parada de la spec; la aplica el paso 4.
  ```

- [ ] **Step 3: Gate de la spec** — en el paso 4, tras la frase «En `unattended` la aprueba el agente, con las decisiones registradas en ese mismo bloque, y sigue.», añade:

  ```markdown
  Si el usuario eligió en la primera pregunta la opción que aprueba la spec por delegación, tampoco paras: la apruebas tú, registras su frase literal y la fecha en «Decisiones tomadas con el dev-lead» y en «Aprobaciones», decides tú la review de spec sin preguntarla, la registras y sigues. El resto de paradas del perfil queda igual, y la validación del paso 7 no se quita nunca.
  ```

- [ ] **Step 4: Paso 7** — en el paso 7, dos inserciones:
  1. justo después de «⛔ **Validación del trabajo** — con la implementación terminada y la revisión final limpia, **antes** de `sdd-end-task`:», antes de «presenta», inserta:

     ```markdown
     si la revisión final deja una decisión que es del usuario (de producto, de alcance), pregúntala **sola, en su propio turno**, y presenta la validación en el turno siguiente, ya con su respuesta: metida en el mismo mensaje, el usuario contesta solo a la validación y la decisión se resuelve por defecto (2/2 en `tests/fewer-stops-red.md`, s3). Después,
     ```

  2. tras la frase «**Validar es que el usuario diga qué ha probado él y que funciona.**», añade:

     ```markdown
     Un «sí» sin detalle a esa pregunta, que ya pedía el detalle, **es validación**: no repreguntes, y el walkthrough registra la frase literal y «no detalló qué probó» (decisión del dev-lead, 2026-09-23).
     ```

- [ ] **Step 5: Tabla de gates** — en `skills/sdd-start-task/references/control-profiles.md`, tabla «Gates por perfil»:
  - fila «Review de spec recomendada»: las celdas `pair` y `delegate` pasan de `pregunta antes de presentar` a `pregunta antes de presentar; con la spec delegada, decide y registra`;
  - fila «Spec»: las celdas `pair` y `delegate` pasan de `para` a `para, salvo la spec delegada en la primera pregunta: la aprueba el agente y registra la frase`.

- [ ] **Step 6: `sdd-end-task`** — en `skills/sdd-end-task/SKILL.md`:
  1. paso 0: tras «¿El usuario ha **validado el trabajo** — ha dicho **qué probó él y que funciona**», inserta ` o ha contestado «sí» sin detalle a la pregunta de validación que ya lo pedía, que también es validación`, antes de « — o ha **diferido la validación**».
  2. paso 1: tras la frase que termina en «nunca un «Validado» inventado.», añade: `Si validó con un «sí» sin detalle, la línea es \`Validado: <fecha> · «<frase literal>» · no detalló qué probó\`.`

- [ ] **Step 7: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Normal"`. Esperado: 0 fallos, incluidos los bloques `Task 1` de `FewerStops.Tests.ps1`.
- [ ] **Step 8: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(skills): aviso de fase, spec delegada en la primera pregunta y paso 7 (task 0053)`, con cuerpo en castellano.

### Task 2 — Carril de patch: el fallo que no se reproduce y la fila re-medida

**Modelo**: `general-purpose` + `model: sonnet` · effort: no disponible en este harness, hereda el de la sesión (la sesión no carga `sdd-kit:effort-medium` de la 0031)
**Tests RED**: hilo principal · `tests/FewerStops.Tests.ps1`, bloques `Describe 'Task 2 — …'`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: nada que use otra task. T3 mide los textos.

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md` y `skills/sdd-end-patch/SKILL.md`.

- [ ] **Step 1: Paso 1 de `sdd-start-patch`** — al final del paso 1, tras «STOP: era una task, cambia a `sdd-start-task`.», añade:

  ```markdown
  Si la investigación **no reproduce el fallo** sobre la base actual → STOP también, sin abrir el patch: ni rama, ni carpeta, ni `patch.md`, ni fix, ni id reservado. Si la petición viene de una fila del roadmap, déjala re-medida: las celdas que el resultado contradice se reescriben con la fecha y la evidencia nuevas, porque añadir la medición y dejar el texto viejo no basta. Díselo al usuario. Si reproduce un fallo **distinto** del que predice el ticket o la fila, no es este caso: el patch sigue con el fallo medido.
  ```

- [ ] **Step 2: Paso 3 de `sdd-start-patch`** — cambia «síntoma (lo reportado, literal)» por «síntoma (lo reportado, literal; si la investigación midió otro, también el medido y en qué difiere del reportado)».
- [ ] **Step 3: Red flags y racionalizaciones de `sdd-start-patch`** — en «Red flags — STOP», añade la viñeta `- Vas a abrir rama o carpeta de un patch cuyo fallo no has reproducido.`; en la tabla de racionalizaciones, añade la fila:

  ```markdown
  | "No se reproduce, pero dejo el patch como cobertura y rastro documental" | Un patch sin fallo consume id, rama y carpeta para nada: 2/2 sujetos del RED lo hicieron (`tests/fewer-stops-red.md`, s5). Se para, y la fila queda re-medida. |
  ```

- [ ] **Step 4: Paso 4 de `sdd-end-patch`** — al final del paso 4, añade:

  ```markdown
  Si `patch.md` re-mide una fila de «Deuda técnica» o de «Backlog» que el patch no salda, y el resultado contradice lo que la fila afirma (su evidencia, su recuento, su propuesta), reescribe esas celdas con la medición nueva, su fecha y un enlace al `patch.md`: la fila ya no puede afirmar lo que la medición desmiente (2/2 la dejaron intacta en `tests/fewer-stops-red.md`, s6).
  ```

- [ ] **Step 5: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Normal"`. Esperado: 0 fallos, incluidos los bloques `Task 2` de `FewerStops.Tests.ps1`.
- [ ] **Step 6: Commit de la task** — uno solo, al quedar limpia su revisión: `feat(skills): patch que no se reproduce y fila re-medida (task 0053)`, con cuerpo en castellano.

### Task 3 — GREEN

**Modelo**: sujetos Sonnet (sin effort declarable en `claude -p`; el mismo que el RED)
**Ejecución**: en línea — el hilo lanza la campaña con el techo compartido de `red/run.sh`, y lee los veredictos contra el RED
**Tests RED**: no aplica (es la medición)
**Superficies**: docs
**Verificación**: `KIT_DIR=<copia limpia del working tree> RUNS_DIR=<scratchpad>/runs OUT_NAME=green SCENARIOS="s1 s2 s3 s4 s5 s6 s7" bash .docs/sdd/specs/20260923-214917-task-0053-fewer-stops/red/run.sh`, y luego `SUBJECTS=1 SCENARIOS="c2 c4 c5"` con la misma línea

**Interfaces**:
- Consume: los textos de T1 y T2.
- Produce: `tests/fewer-stops-green.md`.

**Ficheros**: crear `tests/fewer-stops-green.md`.

- [ ] **Step 1: Copia del kit** — `skills/` y `.claude-plugin/` del working tree tras T1 y T2 a `<scratchpad>/kit-green`; comprobar que la copia tiene los literales nuevos (`grep -c "nos vemos en la validación" kit-green/skills/sdd-start-task/SKILL.md` ≥ 1).
- [ ] **Step 2: Campaña** — los 7 escenarios × 2 y los 3 controles × 1. Criterios de paso:
  - s1: en el cruce del paso 5 al 6, un aviso con qué se hace, lo que queda y ~minutos;
  - s2: una opción con «apruebo la spec por delegación, nos vemos en la validación»;
  - s3: el mensaje final pregunta la decisión de `9-11` y no pide la validación;
  - s4: walkthrough escrito con «sí, perfecto» literal y «no detalló qué probó»;
  - s5: sin rama, carpeta ni commit de patch, y la fila de deuda reescrita con fecha y evidencia;
  - s6: la fila de libres ya no afirma «RED disponible» ni «3/3»;
  - s7: `patch.md` §1 con el síntoma medido y en qué difiere del predicho, y el fix sobre `slot`;
  - c2 (control): la spec queda escrita y **para** en el gate;
  - c4 (control): «cierra la 0012» sin validación **para**;
  - c5 (control): el `TypeError` se reproduce y el patch **se abre** (rama y carpeta).
- [ ] **Step 3: REFACTOR** — si falla alguno, un ajuste de texto y una tanda de hasta 6 sujetos, dentro del techo. Si el techo o la tanda no bastan, para y decide el dev-lead.
- [ ] **Step 4: Evidencia** — `tests/fewer-stops-green.md` con la tabla escenario → resultado, las citas y el coste; controles incluidos.
- [ ] **Step 5: Commit de la task** — `test(skills): GREEN de la task 0053`, con la evidencia y las salidas `green/out/`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h (con el RED previo)
- Estimación de implementación: 2h (T1 0,4h · T2 0,3h · revisiones 0,4h · GREEN 0,9h)
- Base de la estimación: 3 tasks; T1 y T2 transcriben texto que el plan ya trae; el GREEN reutiliza el molde del RED. ¿El plan trae el código? sí (el texto de las skills). Referencia: la 0044 (GREEN de 12 sujetos, 3,93 $).
- Confianza: media (s1 puede pedir REFACTOR)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Normal"` (suite entera, `Slow` incluidos)
- [ ] Criterios de la spec: los 10 criterios de T3 en verde
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre con `sdd-end-task`: la fila 0053 recoge el 0051 §2 y añade `sdd-end-task` a «Ficheros que toca»

---

## 4. Self-review (cobertura spec → tasks)

- `task-flow` — Cada cambio de paso lleva un aviso en llano → T1 Step 1; GREEN s1. ✓
- `task-flow` — Una decisión del dev-lead que sale de la revisión final se pregunta sola → T1 Step 4.1; GREEN s3. ✓
- `task-flow` — MODIFIED El trabajo se valida con el usuario antes de cerrar («sí» sin detalle) → T1 Steps 4.2 y 6; GREEN s4 y control c4. ✓
- `control-profiles` — MODIFIED La primera pregunta confirma carril, modo y perfil → T1 Step 2; GREEN s2. ✓
- `control-profiles` — La spec aprobada por delegación en la primera pregunta no para → T1 Steps 3 y 5; control c2 (sin delegar, para). La rama «delegada, no para» no tiene escenario propio: la cubren el literal de T1 y el Pester. Se dice en la evidencia. ✓
- `routing` — Un patch cuyo fallo no se reproduce no se abre → T2 Steps 1 y 3; GREEN s5 y control c5. ✓
- `routing` — En un patch manda el síntoma medido → T2 Steps 1 y 2; GREEN s7. ✓
- `roadmap` — Una re-medición que contradice una fila la reescribe → T2 Steps 1 y 4; GREEN s5 y s6. ✓
