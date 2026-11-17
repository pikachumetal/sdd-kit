---
id: 20261002-141929-feature-0128-sdd-grilling
feature: 0128
title: Plan de implementación — sdd-grilling, el método de preguntas del kit
spec: ./spec.md
status: approved
created: 2026-10-02
---

# Plan de implementación — `sdd-grilling`

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: las cuatro tasks van en serie, cada una consume lo que deja la anterior (el RED decide la redacción y la redacción decide el GREEN), y las campañas las lanza y las puntúa el hilo, que es quien tiene la rúbrica. Con subagentes, cada implementador tendría que releer spec, batería y transcripciones.
2. **Modelo**: en Native implementa la sesión (Opus 5.5, elegido por el dev-lead al aprobar sin la opción de parar). Los sujetos de la campaña van en Sonnet y la persona de g7 en Haiku (spec, decisión 4). El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
3. **El veredicto de `battery.sh` solo mide la puerta** (la primera skill invocada, `battery.mjs`). La conducta de `sdd-grilling` la puntúo yo con la rúbrica de `battery.md` sobre `texts.txt`. No se toca `battery.mjs`: un juez de rúbrica automático es un juez LLM, descartado en la spec.
4. **El molde se reutiliza**: `subject.sh` copia `tests/batteries/using-sdd/mold-salas`, sin duplicarlo. g2 parte de una carpeta vacía; g8 parte de salas sin `.docs/`.
5. **Hechos del molde que usan los escenarios**: `src/app.js` ya acepta `reservar … --cada-semana` (g4: la petición dice que las reservas semanales «no existen todavía»), y `tech-stack.md` dice «Node 22, sin dependencias externas» y `node --test` (g9: la cobertura con lo que trae Node 22 frente a meter `c8` depende de la documentación de Node).
6. **Controles del GREEN** (spec, decisión 6), ajustados a lo medible:
   - «tabla de claves antes de la primera pregunta»: turno 1 de g7.
   - «la entrevista de `sdd-roadmap` no acaba en spec»: `git status` de g4.
   - «`sdd-consult` no interroga una pregunta puntual»: escenario nuevo `k1`, n=1.
   - `u1` de enrutado.
   - «ramas y worktrees en turnos distintos» no se puede medir: exige llegar a esa pregunta al final de la entrevista de greenfield, y su requisito no cambia. «Una decisión por turno», que lo implica, se mide en g2.
   - Quedan 19 sujetos de GREEN, por debajo de los 22 previstos.
7. **Micro-tests sin script nuevo**: un bucle de `claude -p --model sonnet` en el scratchpad, con `--system-prompt` (la skill o nada) y un mensaje que tienta el fallo. Se anotan en `tests/sdd-grilling-green.md`.
8. **Riesgo alto**: que el RED salga limpio en alguna métrica (Art. I: sin fallo no se escribe la guía). Mitigación: antes de recortar, se mira de dónde sacó cada sujeto la conducta (constitution, Art. I) y, si hace falta, otra tanda dentro del techo.
9. **Coste**: ~48 $ de campaña con techo de 60 $ (spec). ~6 h de sesión.
10. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: crear `sdd-grilling` con su RED y su GREEN, y que las seis skills que entrevistan la invoquen en lugar de repetir su regla de preguntas.

**Architecture**: una sub-skill en inglés, en `skills/sdd-grilling/`, que solo invocan otras skills. Las seis llamantes cambian una línea cada una. La campaña reutiliza `battery.sh` y `lib.sh` y añade la conversación con persona (`subject_converse`) para medir el final de la entrevista.

**Tech Stack**: Markdown (skills), Bash/Git Bash (`tests/headless/`), Node (`extract.mjs`), Pester 5 (`tests/*.Tests.ps1`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en serie y las campañas las lanza y puntúa el hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el *porqué* no deducible.
- Art. X: sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`).
- Art. X: nombres descriptivos en inglés, funciones de 20 líneas o menos y 3 parámetros o menos, early returns, sin duplicación, sin alias de PowerShell. Los textos humanos (mensajes, avisos, ayuda) van en castellano con tildes.
- `skills/sdd-grilling/SKILL.md` y `NOTICE` van en inglés (enmienda del Art. III). Tests, evidencia y `.docs/sdd/` van en castellano.
- Topes: `sdd-grilling` con `SkillMd = 600; Total = 600`; kit en `54480`. Los topes de las seis llamantes no suben.
- La `description` de `sdd-grilling` empieza por «Use when», en tercera persona, y no resume el proceso (`superpowers:writing-skills`).
- Congelación de la 0121: en `sdd-consult`, `sdd-roadmap`, `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-config` y `sdd-start-feature` solo cambia la regla de preguntas.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho. `fable` y `opus xhigh` están prohibidos sin justificación.
- Techo de la campaña: 70 ejecuciones y 60 $, que cuenta RED, micro-tests y GREEN (`SUBJECT_CAP`/`COST_CAP` de `run.sh` con `SPEC_DIR` de esta carpeta). Si se supera, se para y decide el dev-lead.
- Commits: tipo/scope en inglés, cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- El usuario contesta dos decisiones en un mensaje («A, y la de antes también 🅱️») → se registran las dos y la segunda no se vuelve a preguntar · Task 1: la hoja de g7 contesta así en su turno 2; fila «sin repreguntar lo contestado» de la rúbrica.
- La búsqueda externa no está disponible (sin red, sin la herramienta) → la pregunta dice que no pudo comprobarlo y marca el dato como no verificado, sin inventarlo · Task 2: línea en `SKILL.md`; la revisión final lo comprueba leyéndola.
- El usuario escribe en inglés → pregunta en inglés · revisión final leyendo «talk to the user in their language».
- Una decisión de sí o no sin coste detrás («¿sigo?») → va con diálogo, no con un bloque de texto de dos alternativas · revisión final; en headless no hay `AskUserQuestion`.
- El usuario contesta con el icono de una pregunta anterior («la 🅰️ de antes») → el agente nombra qué entendió antes de seguir · revisión final.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill, una línea por llamante y una función en `lib.sh`. `battery.mjs` no se toca.
- [x] **YAGNI gate**: la clave de rondas y el idioma configurable de la documentación, al backlog.
- [x] **Constitution check**: Art. I (RED antes, previsión con techo, GREEN con controles), Art. III (enmendado), Art. IX (`brainstorming` lleva el flujo y la skill pone la forma), Art. XI (los docs, a su sitio).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-grilling/SKILL.md` — la skill, en inglés.
- `skills/sdd-grilling/NOTICE` — copyright y texto íntegro de la MIT de `mattpocock/skills`.
- `THIRD_PARTY_NOTICES.md` — índice de una línea.
- `tests/batteries/sdd-grilling/battery.md` — escenarios, rúbrica y procedencia.
- `tests/batteries/sdd-grilling/subject.sh` — sujeto de la batería.
- `tests/batteries/sdd-grilling/persona-g7.md` — hoja de respuestas de la persona de g7.
- `tests/sdd-grilling-red.md`, `tests/sdd-grilling-green.md` — evidencia.
- `.docs/sdd/capabilities/interviewing.md` — la crea el cierre al fusionar el delta (`sdd-end-feature`), no una task.

**Modificar**:

- `tests/headless/lib.sh` — `subject_converse`.
- `tests/headless/extract.mjs` — modo `last`.
- `tests/HeadlessLauncher.Tests.ps1` — el test de `subject_converse`.
- `tests/WordBudget.Tests.ps1` — topes.
- `skills/sdd-consult/SKILL.md`, `skills/sdd-roadmap/SKILL.md`, `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-config/SKILL.md`, `skills/sdd-start-feature/SKILL.md` (paso 4), `skills/sdd-start-feature/references/overrides-superpowers.md` — la regla de preguntas.
- `.docs/sdd/constitution.md` (Art. III), `.docs/sdd/mission.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md`, `README.md`, `CLAUDE.md`, `.docs/sdd/roadmap.md` (dos filas de backlog).

**NO se tocan**:

- `tests/headless/battery.mjs`, `run.sh` y `battery.sh` — bastan tal cual (decisión 3).
- `skills/using-sdd/SKILL.md` — su «una sola pregunta» es la regla de duda del enrutado.
- `skills/sdd-start-feature/references/control-profiles.md` — las paradas no cambian.
- Las plantillas de `sdd-templates` — la devolución cae en secciones que ya existen.

### 1.6 Dependencias

`superpowers` 6.4.2 (`brainstorming`, `executing-plans`). Desaparece la dependencia opcional de `grilling` de `mattpocock/skills`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| RED limpio en alguna métrica | media | se escribe guía sin fallo | Art. I: ver de dónde sale la conducta antes de recortar; tanda extra dentro del techo |
| La persona en bucle no para | baja | coste | tope de 8 turnos y `SUBJECT_TIMEOUT` |
| `sdd-start-feature` o greenfield pasan de su tope al cambiar la línea | media | pre-commit rojo | la línea nueva no es más larga que la que sustituye; se mide con `WordBudget` en la task |
| La línea de invocación no carga la skill (ver `mattpocock/skills`, «grill-with-docs never loaded grilling») | media | GREEN rojo | la línea nombra la skill con `Skill` y su motivo; el GREEN lo ve en `tools.txt` |

### 1.8 Rollout

Directo, en la release siguiente. `sdd-init-brownfield/references/migrations/vX.Y.Z.md` lo escribe el corte de la release: la feature no cambia la estructura de `.docs/sdd/` de los proyectos.

### 1.9 Excepciones a la constitution

Ninguna. El Art. III se enmienda, no se exceptúa.

---

## 2. Tasks

### Task 1 — RED: batería, persona en bucle y baseline

**Modelo**: la sesión (Native). Sujetos: `MODEL=sonnet`; persona: `haiku`.
**Tests RED**: el hilo (Native, TDD del propio hilo): primero el test de `subject_converse`, después la batería.
**Superficies**: tooling, tests.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es infraestructura de la campaña y evidencia: la conducta se prueba en el GREEN.

**Interfaces**:
- Consume: `subject_init`, `subject_launch`, `subject_resume`, `subject_save`, `put_kit_marker`, `run_claude` de `lib.sh`; `battery.mjs field` y `verdict`.
- Produce: `subject_converse <hoja de la persona> <turnos máximos>` en `lib.sh`. Reanuda la sesión del sujeto hasta que su último texto no acabe en pregunta o hasta llegar al tope, y suma el coste de Haiku al último `RESULTADO`. `node extract.mjs last <stream.jsonl>` imprime el último texto del asistente. Batería `tests/batteries/sdd-grilling/` con ids g1–g9, k1 y u1.

**Ficheros**: crear `tests/batteries/sdd-grilling/{battery.md,subject.sh,persona-g7.md}`, `tests/sdd-grilling-red.md`; modificar `tests/headless/lib.sh`, `tests/headless/extract.mjs`, `tests/HeadlessLauncher.Tests.ps1`.

- [ ] **Step 1: Tests de la persona en bucle** en `HeadlessLauncher.Tests.ps1`, bajo `Describe 'Conversación con persona (lib.sh)' -Tag 'Slow'`, en seco (`DRY_RUN=1`):
  - `It 'subject_converse reanuda hasta que el sujeto deja de preguntar'`: un stream falso cuyo segundo texto no acaba en `?` → `(Get-ChildItem $runs -Filter '*.resume.args').Count | Should -Be 1`.
  - `It 'subject_converse para en el tope de turnos'`: textos que siempre acaban en `?`, con tope 3 → 3 reanudaciones como mucho.
  - `It 'subject_converse suma el coste de la persona al último RESULTADO'`: `DRY_COST=0.5` y persona en seco a 0.01 → el último `RESULTADO` vale más que el del sujeto solo.
  - `It 'extract.mjs last devuelve el último texto del asistente'`.
- [ ] **Step 2: Ejecutar y ver el RED.** `Invoke-Pester tests/HeadlessLauncher.Tests.ps1 -FullNameFilter '*persona*','*last*'` → falla porque `subject_converse` no existe.
- [ ] **Step 3: Implementar** `subject_converse` en `lib.sh` (≤ 20 líneas; helpers si pasa) y el modo `last` en `extract.mjs`. La persona: `claude -p --model haiku --output-format json` con el prompt «Eres el usuario de esta hoja: <hoja>. Contesta en castellano solo lo que el agente pregunta, en una o dos frases; lo que la hoja no dice, «no sé».» y el último texto del sujeto. En seco, la respuesta es fija.
- [ ] **Step 4: Ejecutar y ver el GREEN** de los cuatro tests.
- [ ] **Step 5: Batería.** `battery.md` con la cabecera de `battery.mjs` (`Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia`) y estas filas (Esperado = primera skill):
  - g1, `sdd-consult` · «Pensémoslo bien antes de tocar nada: ¿cómo enfocarías dejar reservar medias horas?» · salas · n=2.
  - g2, `sdd-init-greenfield` · «Empezamos un proyecto nuevo: una app para que las clínicas gestionen sus citas. Prepara el proyecto para trabajar con SDD.» · vacio · n=2.
  - g3, `sdd-start-feature` · «Añade una lista de espera para cuando la sala que quiero está ocupada.» · salas · n=2.
  - g4, `sdd-roadmap` · «Apunta en el roadmap, sin arrancarlo: reservas semanales, que todavía no existen, y un aviso por correo al responsable de cada sala.» · salas · n=2.
  - g5 = g2 con `TURN2` «decide tú lo que puedas» · n=2.
  - g6 = g3 con `TURN2` «no, espera, explícamelo mejor» · n=2.
  - g7, `sdd-config` · «Revisa la configuración del kit y ponla al día.» · salas sin `execution`, `merge.push` ni `validation.mode` · persona en bucle con `persona-g7.md`, tope 8 · n=2.
  - g8, `sdd-init-brownfield` · «Quiero empezar a trabajar con SDD en este proyecto.» · salas sin `.docs/` · n=1.
  - g9, `sdd-consult` · «Pensemos cómo medir la cobertura de los tests: ¿nos vale lo que trae Node o metemos c8?» · salas · `EXTRA_ALLOWED="WebSearch WebFetch"` · n=2.
  - Controles solo del GREEN: k1, `sdd-consult` · «¿Dónde se cancelan las reservas?» · salas · n=1; u1, `sdd-consult` · «Pensemos bien cómo debería funcionar la lista de espera.» · salas · n=1.

  Sección «Rúbrica»: una fila por requisito de la tabla de la decisión 4 de la spec, con lo que cuenta como fallo. Por ejemplo: «más de una decisión en el último mensaje del turno» o «recomendación cuya razón no cita nada de este caso». Sección «Procedencia» vacía, que llena la Task 4.

  `persona-g7.md`: «`execution`: lo que recomiendes. `merge.push`: sí, y de paso la de quién valida, en campo (contesta las dos juntas). `validation.mode`: lo que hayas dicho.»
- [ ] **Step 6: `subject.sh`**, calcado del de `using-sdd`: `subject_init … "$(cell Esperado | sed 's/^sdd-kit://')"`. El molde según `Molde` (`salas`, `vacio`, `salas-sin-docs`, `salas-config`). `TURN2` y `EXTRA_ALLOWED` por id con un `case`. En g7, `subject_launch` + `subject_converse "$HERE/persona-g7.md" 8`.
- [ ] **Step 7: Lanzar el RED** con el kit del `HEAD` sin `sdd-grilling` (copia limpia en el scratchpad con `git worktree add --detach`):
  `BATTERY=sdd-grilling STEPS="sdd-consult sdd-init-greenfield sdd-start-feature sdd-roadmap sdd-config sdd-init-brownfield" SPEC_DIR=.docs/sdd/specs/20261002-141929-feature-0128-sdd-grilling PHASE=red KIT_DIR=<copia> RUNS_DIR=<scratchpad>/runs SUBJECT_CAP=70 COST_CAP=60 SUPERPOWERS_DIR=<superpowers 6.4.2> bash tests/headless/battery.sh`, en segundo plano y con su vigía. Sin k1 ni u1.
- [ ] **Step 8: Puntuar** cada `texts.txt` con la rúbrica y escribir `tests/sdd-grilling-red.md`: tabla escenario × fila de la rúbrica (pasa/falla con la cita literal), las racionalizaciones textuales y el coste. Si una fila sale limpia en todos, se anota de dónde sacó cada sujeto la conducta (Art. I) antes de decidir.
- [ ] **Step 9: Commit de la task** (`test(sdd-grilling): batería y RED del método de preguntas`).

### Task 2 — La skill, su licencia y los micro-tests

**Modelo**: la sesión (Native). Micro-tests: `claude -p --model sonnet`.
**Tests RED**: los fallos de `tests/sdd-grilling-red.md` (Task 1) y el control sin guía de los micro-tests.
**Superficies**: skills, tests.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque la skill no la invoca nadie hasta la Task 3; se mide en la Task 4.

**Interfaces**:
- Consume: la rúbrica y los fallos de `tests/sdd-grilling-red.md`.
- Produce: la skill `sdd-grilling` (nombre exacto), invocable con `Skill`. Devuelve en su texto tres listas: «decided by the user», «decided by me (with reason)» y «pending», escritas en el idioma del usuario.

**Ficheros**: crear `skills/sdd-grilling/SKILL.md`, `skills/sdd-grilling/NOTICE`, `THIRD_PARTY_NOTICES.md`; modificar `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: `NOTICE`** con la cabecera «Portions of this skill are adapted from the `grilling` skill of https://github.com/mattpocock/skills.» y el texto íntegro de su `LICENSE` («MIT License / Copyright (c) 2026 Matt Pocock / …»), copiado de `gh api repos/mattpocock/skills/contents/LICENSE`. `THIRD_PARTY_NOTICES.md`: «`skills/sdd-grilling/` adapta `grilling` de Matt Pocock (MIT); el aviso, en su `NOTICE`.»
- [ ] **Step 2: `SKILL.md`**, en inglés y de 500 palabras o menos:
  - frontmatter `name: sdd-grilling` y `description: Use when another sdd-kit skill needs decisions from the user during an interview — the kit's questioning method, invoked from a fixed step, not on its own.`;
  - una sección por requisito de `interviewing` de la spec, con la forma que pida su fallo del RED (Art. II: receta para los fallos de forma, prohibición con racionalizaciones para los de disciplina);
  - «talk to the user in their language»;
  - la cita a `NOTICE`;
  - solo las racionalizaciones que el RED dio literalmente.
  - Lo que el RED dio limpio no se escribe, salvo que su conducta viniera de una fuente incidental.
- [ ] **Step 3: Micro-tests** de «alternativas reales, sin paja» y «descubrimiento sin hechos, sin recomendación»: 5 ejecuciones con `--system-prompt "$(cat skills/sdd-grilling/SKILL.md)"` y 5 sin él, con un mensaje que tienta el fallo de cada una. Se lee a mano cada caso marcado. Resultado y variantes en `tests/sdd-grilling-green.md` § «Micro-tests». Si la guía no separa del control, se reescribe la frase y se repite (dentro del techo).
- [ ] **Step 4: Topes.** `'sdd-grilling' = @{ SkillMd = 600; Total = 600 }` y `Kit = 54480` en `WordBudget.Tests.ps1`. Ejecutar la verificación → verde.
- [ ] **Step 5: Commit de la task** (`feat(sdd-grilling): método de preguntas del kit, adaptado de grilling`).

### Task 3 — Las seis llamantes y los documentos

**Modelo**: la sesión (Native).
**Tests RED**: los escenarios de la Task 1 sobre cada llamante, que se relanzan en la Task 4.
**Superficies**: skills, docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1, tests/WorkflowDocs.Tests.ps1 -Output Detailed"` y `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Roadmap.ps1 -Path .docs/sdd/roadmap.md`.
**Se prueba en la aplicación**: no, porque es texto de skills; se prueba en la Task 4.

**Interfaces**:
- Consume: la skill `sdd-grilling` (Task 2).
- Produce: la frase de invocación, igual en las seis: «Ask with the `sdd-grilling` skill (invoke it with `Skill`)», traducida al castellano en las skills que siguen en castellano: «Pregunta con la skill `sdd-grilling` (invócala con `Skill`)».

**Ficheros**: los siete de skills y los siete de docs de §1.1.

- [ ] **Step 1: Sustituir la regla** en cada llamante. El texto vigente de cada una, leído antes de tocarla:
  - `sdd-consult`: la línea 21 y las líneas 32 y 41 con `grilling` → `sdd-grilling`, quitando «interroga una a una».
  - `sdd-roadmap` línea 42: «una pregunta por turno, con la recomendada primero» → la frase de invocación.
  - `sdd-init-greenfield` líneas 12 y 24, `sdd-init-brownfield` línea 28: «Cada turno termina con una sola pregunta» / «o `grilling`» → la frase de invocación, manteniendo «o con un solo documento para aprobar».
  - `sdd-config` línea 16: «Una pregunta cerrada por turno» → la frase de invocación, más «la recomendada y su motivo, del catálogo».
  - `sdd-start-feature` paso 4: tras «invoca la skill `superpowers:brainstorming`», «; sus preguntas al usuario siguen `sdd-grilling`».
  - `overrides-superpowers.md`: una fila `brainstorming`: «Only one question per message» → las preguntas siguen `sdd-grilling`.
  - Ninguna línea queda más larga que la que sustituye.
- [ ] **Step 2: Documentos.**
  - `constitution.md` Art. III: la segunda frase, por el texto literal de la decisión 2 de la spec.
  - `mission.md`: «cada pregunta va con `AskUserQuestion`: …» → «cada decisión de diseño va en texto con `sdd-grilling`; las operativas, con `AskUserQuestion`», y el recuento de skills de proceso.
  - `tech-stack.md`: la dependencia de `grilling` fuera.
  - `architecture.md`: 15 skills, con `sdd-grilling` como sub-skill.
  - `README.md`: la fila de `grilling` fuera de Dependencias, y `sdd-grilling` en la lista de skills.
  - `CLAUDE.md`: «las 14 skills» → «las 15 skills».
  - `roadmap.md`: dos filas de backlog, la clave de rondas en `sdd-kit.local.json` (con la nota de `mattpocock/skills` #997) y el idioma de la documentación configurable en `sdd-kit.json`.
- [ ] **Step 3: Verificación** → verde.
- [ ] **Step 4: Commit de la task** (`feat(skills): las entrevistas preguntan con sdd-grilling`).

### Task 4 — GREEN, controles y procedencia

**Modelo**: la sesión (Native). Sujetos: Sonnet; persona: Haiku.
**Tests RED**: la batería de la Task 1, ahora con k1 y u1.
**Superficies**: tests.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Battery.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es la evidencia del GREEN.

**Interfaces**:
- Consume: la batería y `subject_converse` (Task 1), la skill (Task 2), las llamantes (Task 3).
- Produce: `tests/sdd-grilling-green.md` y la «Procedencia» de `battery.md`.

**Ficheros**: modificar `tests/batteries/sdd-grilling/battery.md`, `tests/sdd-grilling-green.md`.

- [ ] **Step 1: Lanzar el GREEN** con una copia limpia del kit en el `HEAD` de la Task 3, `PHASE=green` y todos los pasos, con k1 y u1. Mismo techo, que cuenta las dos fases.
- [ ] **Step 2: Puntuar** con la misma rúbrica. Tabla RED → GREEN por escenario y fila, más los controles: tabla de claves en el turno 1 de g7, sin spec en g4, k1 sin interrogatorio y u1 por `sdd-consult`. Sumar la fila de idioma.
- [ ] **Step 3: REFACTOR** si una fila sigue roja. Racionalización nueva → contra en la skill → relanzar solo ese escenario (dentro del techo; si no cabe, para y decide el dev-lead).
- [ ] **Step 4: Procedencia** en `battery.md`: cada regla de `sdd-grilling` → origen (fila del RED, ticket, decisión del dev-lead) → escenarios.
- [ ] **Step 5: Commit de la task** (`test(sdd-grilling): GREEN del método de preguntas`).

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 3h (brainstorm en dos días, review de spec y plan)
- Estimación de implementación: 6h
- Base de la estimación: 4 tasks. Dos campañas de ~20 sujetos con puntuación a mano (~1,5 h cada una), una función nueva de `lib.sh` con su test y siete ediciones de una línea. Incertidumbre: un RED limpio que obligue a otra tanda.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo: `pwsh -NoProfile -Command "Invoke-Pester tests -Output Detailed"` (la suite entera, incluidas las `Slow`).
- [ ] Cada THEN de la spec con su fila en el smoke (`suite`, `ejecución real` o `no probado`): la evidencia del GREEN es la ejecución real.
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- `interviewing`: los 13 ADDED → Task 2 (texto), Task 4 (medida). Los no medidos, con su motivo, en la decisión 4 de la spec. ✓
- `configuration` MODIFIED → Task 3 (`sdd-config`), Task 4 (g7). ✓
- `onboarding` MODIFIED → Task 3 (las dos init), Task 4 (g2, g8). ✓
- `feature-flow` ADDED → Task 3 (paso 4 y override), Task 4 (g3, g5, g6). ✓
- Licencia → Task 2, step 1. ✓
- Enmienda del Art. III, `mission.md` y docs → Task 3, step 2. ✓
- Topes → Task 2, step 4. ✓
- Filas de backlog → Task 3, step 2. Filas de deuda absorbidas → el cierre las marca (`sdd-end-feature`). ✓
- Review Focus → la línea de g7 en la Task 1; el resto, en la revisión final. ✓
