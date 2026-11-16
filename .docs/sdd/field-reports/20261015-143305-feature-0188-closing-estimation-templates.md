---
kit_version: 2.3.4
superpowers_version: 7.0.0 en los sujetos (SUPERPOWERS_DIR); en la sesión, sin atribuir (varias instalaciones de ámbito proyecto, 6.4.2 y 7.0.0)
lane: feature
id: 20261015-143305-feature-0188-closing-estimation-templates
task: 0188
mode: full
date: 2026-10-15
---

# Ticket para el kit — feature 0188: el «Real» medido, `post hoc` y dos huecos de plantilla

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y CLI en TypeScript)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5, eje Código en Sonnet 5.5; sujetos en Sonnet
- Coste en reloj: 0,99 h de trabajo (3,42 h de reloj, 146 min de espera al dev-lead) frente a 2,5 h estimadas de implementación
- Coste en tokens: 55.850.257 del hilo y 4.817.509 de subagentes; 23,92 $ de sesión y 2,28 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El repaso de coherencia no buscó los requisitos que nombran una etiqueta que la spec cambia

- **Qué pasó**: la decisión 2 de la spec cambió la etiqueta `- Real:` por `- Esfuerzo real:` en §5 de `patch-template.md`. El delta no traía dos requisitos vivos de `capabilities/estimation.md` que nombraban `- Real:`: «La estimación de un patch se escribe antes del fix» (con `- Real:` debajo) y el ejemplo del requisito nuevo de `post hoc`. Los encontraron la revisión final (eje Spec, Important) y la re-revisión (Important fuera de alcance). Costó un `MODIFIED` añadido en la pasada de fix y una corrección en el cierre.
- **Fuente**: `.docs/sdd/specs/20261015-104325-feature-0188-closing-estimation-templates/spec.md`, «Enmiendas» (la del `MODIFIED`); `tasks.md` §Rulings, la línea «Important fuera del alcance de la re-revisión».
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass».
- **Por qué el kit no lo evitó**: el repaso parte de los `MODIFIED` del delta («For each `MODIFIED` in the delta, search outside the spec…»). Un cambio de forma de una plantilla no es un `MODIFIED`, y nadie busca su literal en `capabilities/`. Es la misma familia que la fila de deuda que ya va a la 0185.
- **Coste**: un hallazgo Important en cada una de las dos revisiones, y un requisito de la capacidad corregido en el cierre (`tasks.md` §Rulings).
- **Propuesta**: en el «Coherence pass», si la spec cambia un literal de una plantilla (una etiqueta, un encabezado, una línea fija), buscar ese literal en `capabilities/` y en `skills/`, y que cada resultado quede en el delta o en una decisión con su motivo. Encaja en la 0185.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md`, paso 4 («For each `MODIFIED` in the delta…»).
- **Criterio de aceptación**: GIVEN una spec cuya decisión cambia `- Real:` por `- Esfuerzo real:` en una plantilla, y una capacidad viva con un requisito que dice «con `- Real:` debajo» · WHEN el agente hace el repaso de coherencia · THEN el delta trae el `MODIFIED` de ese requisito, o la decisión dice por qué no.

### 2. Un molde de cierre sin transcripts del trabajo no mide si se pega la línea medida

- **Qué pasó**: el GREEN `p1` (cerrar un patch) no podía comprobar que el agente pegara la línea `Esfuerzo real`: el molde no tenía transcripts de la sesión que hizo el fix, la CLI daba `0,00 h` y los dos sujetos aproximaron con los commits, con razón. El eje Spec lo marcó Important. Hizo falta un escenario `p2` con un transcript sembrado en `~/.claude/projects/<carpeta del molde>/`: 4 sujetos más, una parada para pasar de la previsión de sujetos y una edición de skill que el primer GREEN no había destapado (con la plantilla sola, 1/2).
- **Fuente**: `tests/closing-estimation-green.md`, secciones «Lo que el molde no reproduce» y «p2»; `tasks.md` §Rulings.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Fixtures y baselines». La regla nueva entró en esta feature.
- **Por qué el kit no lo evitó**: la regla «Antes de dar por reproducido un fallo, comprobar que el molde contiene el dato del que la conducta depende» (task 0010) existía, pero no la apliqué al diseñar el GREEN: el dato eran los transcripts, que el molde no puede traer de un repo.
- **Coste**: 0,77 $ y 4 sujetos (`p2`), más una pregunta al dev-lead (Art. I) y una edición de `sdd-end-patch`.
- **Propuesta**: ya escrita en `tech-stack.md` («Un molde que mide lo que la CLI lee de los transcripts necesita transcripts del trabajo…»). Falta llevar la siembra a `tests/headless/lib.sh` como función (`seed_transcript <rama> <entradas>`) que además la borre al terminar: el `subject.sh` de esta feature no la limpiaba.
- **Verificada**: sí — `p2` con el transcript sembrado: la CLI da `0,42 h — reloj de 2 sesiones 0,67 h…` y 3 de 4 sujetos lo pegan (`green/out/p2-*`).
- **Criterio de aceptación**: GIVEN un escenario cuyo THEN depende de `sdd session tokens` · WHEN el `subject.sh` usa `seed_transcript` · THEN la CLI del molde da una cifra distinta de 0 y la carpeta sembrada no queda en `~/.claude/projects/` al acabar.

### 3. Recortar para caber en el tope de palabras cambió una conducta sin RED

- **Qué pasó**: tres ficheros pasaron de su tope durante la feature: `sdd-end-feature` (3004/3000 el `SKILL.md`, 4571/4518 la skill entera), `sdd-end-patch` (2488/2460) y `tech-stack.md` (18804/18800, que bloqueó el pre-commit del cierre). En el primer recorte, la referencia de `sdd-end-feature` perdió «¿No conoces el tiempo? Pregunta…», y un ruling lo dio por «sin cambio de conducta». El eje Spec lo marcó Important, y se restauró en la pasada de fix.
- **Fuente**: la salida de `Invoke-Pester -Path tests/WordBudget.Tests.ps1` en esta sesión (cifras de arriba); `tasks.md` §Rulings, «references/estimation.md… adelgazado».
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md` (el plan no prevé el margen de palabras) y `tests/WordBudget.Tests.ps1`.
- **Por qué el kit no lo evitó**: el plan no dice cuánto margen queda en cada fichero que va a crecer, así que el recorte se improvisa en el momento, y se recorta lo que parece prosa sin mirar si es una instrucción.
- **Coste**: un Important de revisión, tres rondas de recorte y un pre-commit rechazado (sin respaldo de minutos).
- **Propuesta**: que `plan-writing.md` pida, para cada skill o documento con tope que el plan amplía, su recuento actual frente al tope (lo da `WordBudget.Tests.ps1`) y qué se recortará si no cabe, y que el recorte se trate como edición de skill.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan que añade 50 palabras a una skill con 10 de margen · WHEN el agente escribe el plan · THEN la task dice qué frase se recorta y por qué no cambia conducta, antes de implementar.

### 4. El «Real» desde el arranque de la sesión se compara con una estimación que no cubre la spec

- **Qué pasó**: con la decisión de esta feature, el real de una feature cuenta desde el arranque de la sesión, con la spec y el plan dentro. Pero `walkthrough-template.md` §2 y el log lo comparan con «Estimación de implementación (del plan)», que no los incluye. Al medir esta misma feature: 0,99 h reales frente a 2,5 h estimadas de implementación.
- **Fuente**: `walkthrough.md` §2 de la feature 0188; `cli/src/estimation/fields.ts` (`ESTIMATE_LABEL` lee «Estimación de implementación»).
- **Dónde en el kit**: `skills/sdd-templates/templates/walkthrough-template.md` §2 y `plan-template.md`, «Estimación y esfuerzo».
- **Por qué el kit no lo evitó**: la decisión del dev-lead fijó desde dónde cuenta el real, y ni la spec ni la revisión miraron con qué estimado se compara.
- **Coste**: los ratios de las features dejan de ser comparables con los anteriores a la 0188 (sin respaldo de cifra: la muestra es de una fila).
- **Propuesta**: llevado a la fila 0192 (desglose por fases); mientras tanto, que la estimación comparada sea «Esfuerzo spec + plan» más la de implementación.
- **Verificada**: sí — contrastado con `walkthrough-template.md` §2 y `fields.ts`.
- **Criterio de aceptación**: GIVEN un plan con spec + plan 0,5 h e implementación 1 h, y un real medido de 1,5 h desde el arranque · WHEN se genera el log · THEN el ratio de esa fila es 1, no 1,5.

## Lo que hice por iniciativa propia

- Medir el «Real» con la CLI en vez de escribir una regla en prosa (decisión 1 de la spec, aprobada): los sujetos que la ejecutan pegan la línea (`f1` 1/1, `p2` 3/4).
- Leer el transcript de la propia sesión antes de implementar destapó que la respuesta a `AskUserQuestion` llega como `tool_result`: una enmienda antes de la Task 1 en vez de un fallo en campo.
- Ejecutar `sdd session tokens --json` y `sdd estimation log` a mano antes de dar una fila del smoke por buena: dos filas escritas de memoria no eran exactas.

## Funcionó, no tocar

- `delegate` con `validation.mode: field`: paradas solo en la spec, las dos enmiendas y el techo de sujetos del Art. I; el resto, rulings.
- La regla del Art. I «baseline limpio no se escribe» recortó la regla de `post hoc` de `sdd-end-patch` con evidencia, y el GREEN posterior mostró dónde sí hacía falta texto.
- La receta del merge con conflicto solo en los registros: se resolvió por fila contra la base y `sdd merge --push` pasó a la segunda.
- `sdd ledger rulings` volcó al `tasks.md` 29 líneas sin perder ninguna.

## Menores

- Desde la herramienta PowerShell, `bash` es el de WSL: `execvpe(/bin/bash) failed: No such file or directory`; la regla existe para Pester (`tests/Resolve-Bash.ps1`), no para lanzar `tests/headless/run.sh` — `tests/headless/run.sh` (uso).
- La línea base del gate salió en rojo por `FastSuiteBudget` con la máquina cargada (42 s frente a 30 s); en el gate de cierre, ya con el mutex de la 0190 en `develop`, salió en verde — `.docs/sdd/tech-stack.md`, §Testing.
- `run.sh` lanzado con `&` desde una llamada de Bash sin `run_in_background` no avisa al acabar: hizo falta un bucle de espera aparte — `tests/headless/run.sh` (uso).
