---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: task
id: 20260923-203931-task-0046-estimation-stats
task: 0046
mode: lite
date: 2026-09-23
---

# Ticket para el kit — task 0046: task lite de un script, con cierre que chocó en el merge

## Contexto

- Carril y modo: task lite, perfil `delegate`
- Skills del kit usadas: `sdd-start-task`, `sdd-templates`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, y las plantillas y el script `review-package` de `subagent-driven-development`
- Proyecto: el propio repo del kit (Markdown y un script PowerShell con tests Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (implementador, revisor final, re-revisor del fix)
- Coste en reloj: ~1,1 h de hilo (0,75 h de implementación y cierre)
- Coste en tokens: hilo no medido; subagentes ~295k

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La skill arrancó desde la caché del plugin, dos versiones por detrás

- **Qué pasó**: `/sdd-kit:sdd-start-task` cargó el texto de `sdd-kit/1.1.0` de la caché. El del working tree tenía la primera pregunta (carril, modo y perfil), los frenos de alcance y el encargo con «De código». El hilo lo detectó por la regla 2 del `CLAUDE.md` del repo, leyó `skills/sdd-start-task/SKILL.md` de la rama y siguió ese. `sdd-end-task` lo leyó igual, del working tree.
- **Dónde en el kit**: `Start-KitSession.ps1`, y el hook `SessionStart` del repo (`.claude/hooks/Test-KitSessionSource.ps1`), que se fusionó con la 0016 mientras esta sesión corría.
- **Por qué el kit no lo evitó**: la sesión no salió del script, y el aviso del hook aún no existía en esta rama.
- **Coste**: dos lecturas extra de skills (~15k tokens). Sin la regla del `CLAUDE.md`, la task habría seguido un flujo de dos versiones atrás.
- **Propuesta**: ninguna nueva. Comprobar que el hook de la 0016 cubre el caso de una sesión abierta en un worktree creado antes de la fusión del hook.
- **Criterio de aceptación**: GIVEN una sesión abierta sin `Start-KitSession.ps1` en un worktree cuya rama ya contiene el hook, WHEN arranca, THEN el primer mensaje del sistema avisa de que las skills vienen de la caché.

### 2. El merge del cierre choca siempre en changelog, roadmap y log cuando van tasks en paralelo, y la receta manda parar

- **Qué pasó**: `Invoke-SddMerge.ps1` falló con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.`: la 0016 y la 0044 se fusionaron durante la task. Los tres conflictos eran de líneas vecinas: entradas añadidas en el mismo hueco, filas vecinas cerradas y un log generado. La receta dice que un conflicto de `merge:` lo resuelve una persona, así que el hilo preguntó. El dev-lead eligió integrar `develop` en la rama, lo mismo que había hecho la 0044 (`e920e0a`). Luego el script fusionó al segundo intento.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md`, «Si el script falla», y `Invoke-SddMerge.ps1`, que ya regenera `estimation-log.md` pero se para antes si hay otros conflictos.
- **Por qué el kit no lo evitó**: la receta trata igual un conflicto de código que uno de documentos de solo añadir, cuando con tasks en paralelo el segundo caso es la norma.
- **Coste**: una pregunta al dev-lead y ~10 min de hilo. Dos tasks seguidas (la 0044 y esta) resolvieron el mismo tipo de conflicto a mano.
- **Propuesta**: el script, o la receta, resuelve por unión los conflictos de `changelog.md` y `roadmap.md` cuando cada lado solo añade o cambia filas distintas, y regenera el log. Si una fila de la task cambió en la base, sigue siendo freno de alcance. Cualquier otro conflicto se para como hoy.
- **Criterio de aceptación**: GIVEN una rama con una entrada nueva en `[Unreleased]` y su fila cerrada, y un destino con otra entrada en el mismo hueco y la fila vecina cerrada, WHEN se ejecuta `Invoke-SddMerge.ps1`, THEN fusiona sin preguntar y conserva las dos entradas y las dos filas. AND si el destino cambió la fila de la task, falla con un mensaje que lo nombra.

### 3. `review-package` pide un `PLAN_FILE` que en modo lite no existe

- **Qué pasó**: `review-package` de superpowers se usa como `review-package PLAN_FILE BASE HEAD [OUTFILE]`. En lite no hay `plan.md`, y el hilo le pasó `spec.md`.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md`, «Revisor final» («Lee el paquete de review `<ruta que imprime review-package>`»), sin instrucción para lite.
- **Por qué el kit no lo evitó**: la cabecera del revisor final supone un plan.
- **Coste**: un turno de prueba y error.
- **Propuesta**: una frase en `encargo-revision.md`: «En modo lite, `PLAN_FILE` es `spec.md`».
- **Criterio de aceptación**: GIVEN una task lite con la implementación terminada, WHEN el hilo prepara la revisión final, THEN invoca `review-package` con `spec.md` a la primera.

### 4. «Commitea los tests RED» contra el pre-commit, cuando el RED amplía un fichero de test que ya existe

- **Qué pasó**: el paso 6 dice que el hilo escribe los tests RED y los commitea, y el pre-commit del repo rechaza la suite en rojo. La salida está en `tech-stack.md` (aparcar los tests en la carpeta de la spec), pero habla de tests nuevos. Aquí el RED ampliaba `Build-EstimationLog.Tests.ps1`, así que el hilo aparcó el fichero entero y el implementador lo sustituyó con `git mv -f`.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6; la deuda ya está abierta en el roadmap (T20) y la 0044 toca la misma zona.
- **Por qué el kit no lo evitó**: la regla vive en `tech-stack.md` de este repo, no en la skill, y no cubre ampliar un fichero.
- **Coste**: bajo. Un commit de más para corregir el aparcado.
- **Propuesta**: al resolver la deuda, que la regla diga «aparca el fichero de test entero si el RED lo modifica».
- **Criterio de aceptación**: GIVEN un RED que añade tests a un fichero existente en un repo con pre-commit de suite verde, WHEN el hilo commitea el RED, THEN el commit pasa el hook y el encargo nombra el fichero aparcado como contrato.

### 5. ¿«Sí, perfecto» valida?

- **Qué pasó**: a «¿Lo has probado y funciona? Dime qué has mirado», el dev-lead respondió «sis perfecto». El hilo lo tomó como validación y registró la frase literal con «No detalló qué probó».
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 7 («Validar es que el usuario diga qué ha probado él y que funciona»).
- **Por qué el kit no lo evitó**: la regla no dice qué hacer con un «sí» sin detalle a una pregunta que ya pedía el detalle.
- **Coste**: ninguno medido; es riesgo de registro, no de flujo.
- **Propuesta**: decidir y escribirlo: o un «sí» a esa pregunta basta y el walkthrough lo registra así, o se repregunta una sola vez.
- **Criterio de aceptación**: GIVEN el paso 7 presentado y el usuario responde «sí, perfecto», WHEN el hilo decide, THEN hace lo que diga la regla escrita, igual en 2 de 2 sujetos.

## Lo que hice por iniciativa propia

- Antes de resolver el conflicto del merge, comparé la fila 0046 del roadmap entre la base y `develop`, para no pasar por alto un freno de alcance escondido en el conflicto. Funcionó y es barato: podría ir en la propuesta del hallazgo 2.
- Diseñé los datos de test con n = 21 para que (n − 1)·p fuera entero en cada percentil: los valores esperados salen exactos, sin empates de redondeo. Aprendizaje volcado en `tech-stack.md`.
- Una restricción del dev-lead («los 37 tests siguen en verde») chocaba con un requisito suyo (p25–p75 en la tabla por tipo). Lo puse como decisión 1 de la spec y no lo resolví en silencio. Lo aprobó con la spec.

## Funcionó, no tocar

- La primera pregunta sola (carril, modo con las condiciones citadas, perfil): una respuesta y seguir.
- El bloque «Decisiones que he tomado yo» como apertura del gate: aprobación con un «si».
- La cabecera de `encargo-revision.md`: el revisor final auditó parámetros y líneas contra el Art. X y verificó a mano toda la aritmética de los tests.
- La re-revisión del commit del hilo principal: rápida (1 min, 70k tokens) y justificada.

## Errores míos, no huecos del kit

- Escribí el helper de test con 6 parámetros, por encima del límite de 3 del Art. X. Lo vi al montar el encargo, antes de despachar, y costó un commit extra.
