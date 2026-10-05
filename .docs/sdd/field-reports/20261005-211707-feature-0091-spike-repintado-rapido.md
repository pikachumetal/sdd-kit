---
kit_version: 2.3.2
superpowers_version: 6.4.2
lane: feature
id: 20261005-211707-feature-0091-spike-repintado-rapido
task: 0091
mode: full
date: 2026-10-05
---

# Ticket para el kit — feature 0091: spike de medida con research, revisado solo al final

## Contexto

- Carril y modo: feature full (spike de medida; la salida es `research.md`, sin código que se conserve).
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`;
  de superpowers, `brainstorming`, `writing-plans` y `executing-plans` (Native).
- Proyecto: aplicación web interna, frontend SPA, API .NET y un editor de documentos embebido; una persona.
- Modelo del hilo: Opus 5.5 (effort subido a xhigh a mitad por el dev-lead).
- Modelos de los subagentes: Opus 5.5 (`sdd-kit:effort-high`), solo el revisor final.
- Coste en reloj: 5,5 h de implementación frente a 6,5 h estimadas (walkthrough §2), más 0,4 h de spec y plan.
- Coste en tokens: hilo 89.424.504; subagentes 1.664.287 en 1 despacho.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El research de un spike llega a la revisión final sin contrastar cada objetivo de la spec con lo medido

- **Qué pasó**: la revisión final devolvió «Ready with fixes» con 12 Important. Casi todos eran afirmaciones del
  research que daban un objetivo de la spec por cumplido sin haberlo medido, o cifras de una variante atribuidas a
  otra. Hizo falta una pasada de fix de texto y, a petición del dev-lead, dos medidas más antes de validar.
- **Dónde en el kit**: `skills/sdd-templates/templates/research-template.md` (no tiene sección que cruce los
  objetivos o decisiones de la spec con su evidencia); `skills/sdd-start-feature/SKILL.md` paso 4 (la rúbrica de
  review de spec da «ninguna» en un spike, y es correcto: lo que falla es el research, no la spec).
- **Por qué el kit no lo evitó**: la plantilla pide «Recomendación» y «Aprendizajes clave», pero no una tabla
  «objetivo de la spec → medido / no medido / no cumple, con su fichero de resultados». El smoke por THEN del paso 7
  existe, pero solo se escribe después, al presentar la validación.
- **Coste**: ~15 min de la pasada de fix (commit de corrección del research, juntado en el cierre `751c7d0`) y ~45
  min de medidas extra (walkthrough §3, «Medirlos ahora»).
- **Propuesta**: añadir a `research-template.md` una sección obligatoria «Objetivos de la spec frente a lo medido»,
  con una fila por objetivo o decisión: `medido (fichero de evidencia) | no medido (motivo) | no cumple`. La
  recomendación solo puede citar filas `medido`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un spike cuya spec fija cinco objetivos numéricos y uno no se midió, WHEN el
  agente escribe el research con la plantilla, THEN el research tiene una fila `no medido` para ese objetivo y la
  recomendación no lo da por cumplido.

### 2. El paquete de la revisión final excluye justo el entregable de un spike

- **Qué pasó**: la receta de `encargo-revision.md` excluye la carpeta de la spec. En un spike, `research.md` vive ahí
  y es todo el entregable: el paquete quedó en 72 líneas (dos palabras de diccionario y unos aprendizajes), y hubo que
  escribir a mano en el encargo que leyera el research y los resultados en bruto.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, sección «Revisor final», receta
  del paquete (`EXCLUDE` con la carpeta de la feature).
- **Por qué el kit no lo evitó**: la exclusión está pensada para que no entren la evidencia de campañas ni la spec y
  el plan, que llegan por otro lado; no contempla que el entregable sea un `.md` de esa carpeta.
- **Coste**: ~5 min de redactar el encargo a mano, sin respaldo en ningún artefacto; el riesgo era una revisión que no
  leyera el research.
- **Propuesta**: si la carpeta tiene `research.md` (o la spec dice spike), la receta lo deja fuera de `EXCLUDE`, o el
  encargo añade «lee además `research.md` y contrasta sus cifras con la evidencia».
- **Verificada**: sí — contrastado con la receta de `encargo-revision.md` (la línea `EXCLUDE=(...<carpeta de la
  feature>/**)`).
- **Criterio de aceptación**: GIVEN una feature cuya carpeta contiene `research.md`, WHEN el hilo prepara el paquete
  del revisor final con la receta, THEN el diff de `research.md` está en el paquete o el encargo lo nombra
  explícitamente.

### 3. El merge se para por un conflicto en ficheros de solo añadir entre dos spikes de la misma ola

- **Qué pasó**: `Invoke-SddMerge.ps1` falló con `merge: conflicto en .cspell/custom-words.txt,
  .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md, .docs/sdd/tech-stack.md.` (PowerShell 7).
  Otro spike de la misma ola se había fusionado antes; los dos añadían al final de `tech-stack.md` («Aprendizajes
  de…») y del diccionario. La receta solo resuelve conflictos en los tres registros, así que el cierre paró y
  necesitó otro turno del dev-lead.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «Conflicto solo en los registros», paso 1.
- **Por qué el kit no lo evitó**: la lista de ficheros que el agente puede resolver no incluye los de solo añadir
  (una sección «Aprendizajes de la feature X» al final de `tech-stack.md`, una palabra en el diccionario).
- **Coste**: un turno del dev-lead y el cierre «No terminado» (mensaje final del cierre).
- **Propuesta**: ampliar la sección a los conflictos en los que los dos lados solo **añaden** líneas sin tocar las
  existentes: se quedan las dos adiciones. El paso 4 («misma línea → persona») sigue igual.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN dos features que añaden cada una su sección de aprendizajes al final del mismo doc
  vivo y una palabra al diccionario, WHEN la segunda cierra y el script falla en `merge:`, THEN el agente resuelve
  quedándose con las dos adiciones y relanza el script, sin parar al dev-lead.

### 4. Un plan de spike no encaja en las tasks TDD de la plantilla ni en `task-done`

- **Qué pasó**: las 7 tasks llevaban «Tests RED: no aplica» y una «Verificación» artificial
  (`test -s results/<x>.jsonl`). Seis tasks no tenían commit (solo resultados en scratch), así que el ledger se
  rellenó a mano para ellas y `task-done` solo se usó en la última.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` (task con Tests RED, build y commit por
  task); `skills/sdd-start-feature/SKILL.md` paso 6 (ledger y `task-done` por task).
- **Por qué el kit no lo evitó**: no hay variante de plan para tasks de medida cuya salida es evidencia fuera del repo.
- **Coste**: ~10 min de adaptar el plan y el ledger (plan §2 y ledger del workspace), sin respaldo más fino.
- **Propuesta**: una variante «spike» en la plantilla del plan: tasks de medida con «Evidencia» (ruta del fichero de
  resultados y su forma) en vez de Tests RED, sin commit propio, y una línea de ledger
  `Task N: medida (evidencia: <ruta>, <n> filas)` que el paso 6 acepte.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un spike con cinco tasks de medida, WHEN el agente escribe el plan con la
  plantilla, THEN ninguna task lleva «Tests RED: no aplica» y el ledger registra cada task sin commit sin escribirlo a
  mano.

## Lo que hice por iniciativa propia

- Para la pregunta «¿cómo se siente?», grabé el editor en vídeo mientras se tecleaba durante el repintado y medí la
  latencia de cada tecla. Destapó un defecto real (teclas perdidas) que ningún tiempo de repintado mostraba.
- Verificar cada trozo de un comando por lotes (que devuelva cuántos elementos aplicó) tras ver que el editor
  descartaba comandos sin avisar. Evitó dar por buenas cifras que no habían escrito nada.
- Leer otro proyecto del equipo con el mismo editor para buscar soluciones, sin copiar código. Resolvió un fallo
  concreto (dónde insertar una tabla en un control).

## Funcionó, no tocar

- Lanzar la revisión final en segundo plano en un worktree desanclado y escribir mientras los borradores de cierre.
- Preguntar sola, en su propio turno, la decisión de alcance que dejó la revisión final: el dev-lead eligió medir
  ahora.
- Parar los procesos por el puerto en que escuchan: hubo cinco arranques y paradas sin tocar procesos ajenos.
- La validación con un «sí» sin detalle registrada como tal, con su frase literal.

## Menores

- La frase literal del dev-lead en el walkthrough rompe el corrector ortográfico del proyecto por sus erratas, y el
  commit de cierre se juntó antes de ver el lint en rojo — `skills/sdd-end-feature/SKILL.md` paso 1.
- La primera pregunta tuvo que justificar por qué un spike va como feature y no por `sdd-consult` —
  `skills/sdd-start-feature/SKILL.md` paso 2.
