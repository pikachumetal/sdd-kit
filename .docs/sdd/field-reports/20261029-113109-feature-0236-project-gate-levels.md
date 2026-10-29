---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261029-113109-feature-0236-project-gate-levels
task: 0236
mode: full
date: 2026-10-29
---

# Ticket para el kit — feature 0236: el gate de los proyectos por niveles y por lo afectado

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (preguntas cerradas), `sdd-parallel-agents`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: dos revisores de la spec (Opus y Sonnet), los ejes Spec (Opus) y Código (Sonnet) de la revisión final, la re-revisión (Opus); 53 sujetos Sonnet
- Coste en reloj: 1,75 h de esfuerzo real frente a 5 h estimadas (walkthrough §2), más el merge tras la CI en rojo
- Coste en tokens: 123.719.839 del hilo y 9.159.087 de subagentes; 41,41 $ de sesión y 23,78 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La previsión de coste de la spec usó un precio por sujeto que `tech-stack.md` ya corregía

- **Qué pasó**: la spec estimó ~11 $ con 0,31 $ por sujeto, el de una feature anterior. `tech-stack.md` dice que un sujeto de `sdd-archive` cuesta ~0,70 $ porque cierra una feature entera. Al escribir el plan salieron ~17 $; el tope subió dos veces con el dev-lead (de 15 $ a 22 $ y a 25 $), y la campaña cerró en 23,78 $.
- **Fuente**: `.docs/sdd/specs/20261029-082734-feature-0236-project-gate-levels/spec.md`, decisión 21 y «Enmiendas»; `.docs/sdd/tech-stack.md`, «Entrega de la skill al sujeto» («Un sujeto de `sdd-archive` cuesta ~0,70 $»); walkthrough §2.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4 (Art. I: la previsión de coste se declara antes del primer sujeto); en este repo, el método vive en `tech-stack.md`.
- **Por qué el kit no lo evitó**: la regla del precio existía y no la apliqué; la previsión no pide desglosar por batería.
- **Coste**: dos paradas al dev-lead por dinero y ~8,8 $ por encima de lo aprobado en la spec (walkthrough §2).
- **Propuesta**: que la línea de previsión de coste de la spec lleve el precio por batería del que sale cada cifra («n sujetos de `sdd-archive` × 0,70 $»), como ya hace la línea de topes de palabras.
- **Verificada**: sí — contrastado con la decisión 21 de la spec y `tech-stack.md`.
- **Criterio de aceptación**: GIVEN una spec cuyos escenarios son 4 de `sdd-archive` y 4 de `sdd-init` WHEN escribe la previsión de coste THEN cada cifra cita su batería y el precio de `tech-stack.md`, y el total sale de esa suma.

### 2. Los moldes de un conflicto de docs no midieron nada: la rama escribía algo falso del proyecto

- **Qué pasó**: en `m1` y `m2`, la rama escribía en `tech-stack.md` que el proyecto tenía un `src/rooms.js` y una dependencia, y el molde no los tiene. El sujeto lo vio y lo corrigió al cerrar, antes de integrar la base, y el conflicto que se medía desapareció: `m2-1` «resolvió» un conflicto de dos valores porque su lado ya no decía nada.
- **Fuente**: `tests/project-gate-levels-green.md`, Task 3, ronda 1; `tests/batteries/sdd-archive/subject.mjs`, `STACK_CHANGES`.
- **Dónde en el kit**: método de las baterías (`.docs/sdd/tech-stack.md`, «Baterías por skill»); el aprendizaje ya va ahí desde esta feature.
- **Por qué el kit no lo evitó**: ninguna regla pedía que el texto plantado fuera cierto en el molde.
- **Coste**: 4 sujetos de `sdd-archive`, ~2,8 $, y una parada por coste (walkthrough §3).
- **Propuesta**: la «Comprobación previa» de un molde nuevo comprueba que lo que planta (un fichero que nombra, una dependencia) existe en el molde.
- **Verificada**: sí — `m1-3` y `m1-4` (texto cierto) juntaron y fusionaron.
- **Criterio de aceptación**: GIVEN un molde cuya rama nombra un fichero que no existe en él WHEN se monta THEN `subject.mjs` sale con `s.die` antes de lanzar el sujeto.

### 3. Un hueco de plantilla de una sola orden ganó a la receta literal del paso

- **Qué pasó**: con la línea `Gate:` literal en el paso 1 de `sdd-archive` (la suite unitaria antes de la flecha), 0 de 3 sujetos la escribieron así, porque calcaban el hueco de `walkthrough-template.md` (4.1), que solo tenía sitio para una orden. Con el hueco cambiado, el sujeto siguiente la escribió bien.
- **Fuente**: `tests/project-gate-levels-green.md`, Task 2, rondas 2 a 4.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, repaso de coherencia («un literal de plantilla […] en `skills/`»).
- **Por qué el kit no lo evitó**: la regla existía: el repaso de coherencia pide buscar cada literal que cambia de forma en `skills/`, y no busqué la línea `Gate:` en las plantillas.
- **Coste**: dos rondas de `g7`, ~2,1 $ (walkthrough §3).
- **Propuesta**: esperar 2.º caso (es «la regla existía y no la apliqué»); si llega, la fila «Lo que se retira o cambia de forma» de la spec nombra las plantillas como sitio que se busca siempre.
- **Verificada**: sí — `g7-7` con el hueco nuevo.
- **Criterio de aceptación**: GIVEN una spec que cambia la forma de la línea `Gate:` WHEN hace el repaso de coherencia THEN su tabla «Lo que se retira o cambia de forma» lista `walkthrough-template.md` y `patch-template.md`.

### 4. La pasada de fix metió dos Important y la regla solo dejaba adjudicarlos

- **Qué pasó**: la re-revisión dio por resueltos los 10 hallazgos, pero encontró dos Important que había metido la propia pasada: la frase «una rama solo de docs no corre nada» alcanzaba a la línea base y al carril config, y el `--verify` del merge entraba en «Running a gate» contra una decisión de la spec. «Closing the review» manda adjudicarlos, sin segunda pasada. Los arreglé en un commit posterior, que quedó `sin revisar`.
- **Fuente**: walkthrough §3 («sin revisar: juntado en el cierre»); `tasks.md`, línea `Re-revisión:` y el ruling de N1 y N2.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review», «What it leaves open».
- **Por qué el kit no lo evitó**: la regla no distingue un Important que deja el código revisado de uno que mete la pasada de fix.
- **Coste**: un commit de skill sin revisor llega al merge.
- **Propuesta**: un Important que la re-revisión atribuye a la propia pasada de fix se arregla en el hilo, con un test que lo reproduce, y va a ✋ como `sin revisar`; no se adjudica.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una re-revisión que marca un Important nuevo en el diff de la pasada de fix WHEN el hilo cierra la revisión THEN lo arregla y lo lleva a ✋ como `sin revisar`, sin ruling que lo deje en pie.

### 5. Un conflicto dentro de un requisito de `capabilities/` paró el merge por dos cambios que no se tocaban

- **Qué pasó**: `sdd merge --push` dio `merge: conflicto en .docs/sdd/capabilities/control-profiles.md.`. Otra feature había cambiado el THEN de un requisito y esta rama sus AND; git los agrupó en el mismo trozo. La regla nueva de esta feature deja `capabilities/` fuera de lo que resuelve el agente, así que paró para el dev-lead, que eligió juntarlos.
- **Fuente**: salida de `node cli/bin/sdd.js merge --project-root … --push --verify …` → `merge: conflicto en .docs/sdd/capabilities/control-profiles.md.`; commit `607d8ef8`.
- **Dónde en el kit**: `cli/src/merge/` (la unión de los registros y del add/add de requisitos) y `skills/sdd-archive/SKILL.md` paso 6.
- **Por qué el kit no lo evitó**: la CLI une requisitos añadidos al final, no líneas distintas dentro de un mismo requisito.
- **Coste**: una parada al dev-lead en `delegate` y ~10 min.
- **Propuesta**: que `sdd merge` junte, dentro de un requisito, un trozo donde cada lado cambia líneas `- THEN`/`- AND` distintas sin tocar las del otro.
- **Verificada**: sí — reproducido con `sdd merge --sync` en Git Bash → `base: conflicto en .docs/sdd/capabilities/control-profiles.md.`.
- **Criterio de aceptación**: GIVEN un requisito cuyo THEN cambia la base y cuyos AND cambia la rama WHEN `sdd merge --sync` THEN queda el THEN de la base y los AND de la rama, sin conflicto.

### 6. Un script de reemplazo duplicó 150 líneas de la migración que medían los sujetos

- **Qué pasó**: edité `v3.0.0.md` con un script de Node y `String.replace`; el texto nuevo llevaba `` $` `` y se insertó el texto anterior al trozo. La copia del kit del GREEN salió con 150 líneas duplicadas, y `v4` y `g2` se repitieron.
- **Fuente**: `tests/project-gate-levels-green.md`, Task 1, ronda 1; ruling de la Task 1 en `tasks.md`.
- **Dónde en el kit**: la restricción «El texto de skills y referencias se edita con `Edit`, no con scripts de reemplazo» del plan (ticket del patch 0220 §4).
- **Por qué el kit no lo evitó**: la regla existía, en el bloque «De código» del plan, y no la apliqué en la sesión que ejecuta.
- **Coste**: ~1,5 $ de sujetos repetidos.
- **Propuesta**: esperar 2.º caso; si llega, la regla sube a `skills/sdd-implement/SKILL.md` (Native loop, paso 2), donde se edita.
- **Verificada**: sí — `wc -l` dio 323 líneas frente a 171 de `HEAD`.
- **Criterio de aceptación**: GIVEN una task de Native que edita una skill WHEN la sesión cambia un párrafo THEN usa `Edit`, y su `tools.txt` no tiene `String.replace` sobre `skills/`.

## Lo que hice por iniciativa propia

- Partí la regla tras un rojo en una batería barata (`sdd-verify`, `t1` y `t2`, ~0,35 $ por sujeto) en vez de cerrar una feature entera con `sdd-archive`: midió la regla con la mitad de coste.
- Probé el molde de `t1` y `t2` en seco (`DRY_RUN=1`) antes de gastar en sujetos: comprobó que la pasada roja salía.

## Funcionó, no tocar

- La regla 7 de `CLAUDE.md` (mirar la CI de `develop` antes de fusionar) paró un merge sobre una CI en rojo ajena a la rama; con la CI en verde, el merge siguió sin rehacer nada.
- «Una regla que solo vive en una referencia no se lee» (`tech-stack.md`): `g7` pasó de 0/2 a correr la suite unitaria al subir las condiciones al paso 1.

## Menores

- Un sujeto de `k6` no cargó ninguna skill (`Glob` → `Edit`) y no midió nada; el segundo sí — no localizado.
- Un `git merge` a secas antes de `sdd merge --sync` dejó en conflicto también los registros; lo deshice — `skills/sdd-archive/references/merge-recipe.md`.
- Un heredoc con `\n` en Git Bash metió saltos reales en `subject.mjs`; arreglado con `Edit` — no localizado.
