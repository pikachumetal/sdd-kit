---
kit_version: 2.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260929-091515-feature-0099-frontend-verification
task: 0099
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0099: el cierre choca con los registros y con su propia privacidad

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native, con la validación diferida.
- Skills del kit usadas: `using-sdd` (hook), `sdd-start-feature`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`. Scripts: `Get-CapabilityIndex.ps1`, `Watch-SubagentSilence.ps1`, `Measure-SessionTokens.ps1`, `Build-EstimationLog.ps1`, `Test-Capabilities.ps1` e `Invoke-SddMerge.ps1`. Lanzador `tests/headless/`.
- Proyecto: el propio kit (skills en Markdown y Pester), una persona (dev-lead) más el agente.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: Sonnet (2 revisores de spec y 25 sujetos) y Opus con effort high (revisión final y re-revisión).
- Coste en reloj: ~1,9 h (spec y plan ~0,4 h; implementación y cierre ~1,5 h).
- Coste en tokens: hilo 52,9 M; subagentes 3,0 M; sujetos 11,71 $.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La fuga del `user.name` en la evidencia de los sujetos solo salta en el `pre-merge-commit`

- **Qué pasó**: tres salidas de un escenario (una spec escrita por el sujeto y su `tools.txt`) llevaban el `user.name` de git de la máquina. Los siete `pre-commit` de la rama pasaron. El gate completo desde PowerShell también pasó (1048/0), y no sé por qué no lo marcó. Lo detectó `SubjectOutputPrivacy.Tests.ps1` dentro del hook `pre-merge-commit`, en el worktree temporal de `Invoke-SddMerge.ps1`, **después** del merge de sincronización. Hubo que hacer un commit más y relanzar el script.
- **Dónde en el kit**: el hook `pre-commit` del repo (qué conjunto de tests corre) y `tests/headless/lib.sh` (`subject_save` / `clean`). No localizo de dónde sacó el sujeto el nombre: `subject_launch` fija `user.name=Fixture` con `GIT_CONFIG_*`.
- **Por qué el kit no lo evitó**: el test que protege la privacidad del repo público no corre al commitear la evidencia. `extract.mjs clean` limpia el home, pero no el `user.name`.
- **Coste**: un merge fallido, un commit tras el merge de sincronización (la historia deja de ser 2 + N + merge) y ~5 min.
- **Propuesta**: que `extract.mjs clean` sustituya también el `user.name` de git por `<git-user>`, y que el `pre-commit` ejecute `SubjectOutputPrivacy.Tests.ps1` cuando el commit toca `specs/*/red|green|fix/`.
- **Criterio de aceptación**: GIVEN una salida de sujeto que contiene el `user.name` de la máquina WHEN se commitea en `specs/<feature>/green/out/` THEN el `pre-commit` la rechaza, o la salida ya llega limpia con `<git-user>`.

### 2. El cierre edita prosa del roadmap que el triaje de la base reescribe, y el merge acaba en una pregunta

- **Qué pasó**: el paso 8 de `sdd-end-feature` me llevó a tachar el punto de la feature en la lista «Orden, en serie» de «Versión siguiente». En paralelo, el triaje de otro patch en `develop` borró esa lista entera y pasó el orden a cada fila. La misma línea tocada por los dos lados es, según la receta, conflicto «de una persona»: aborté, pregunté y rehíce el merge de sincronización.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 8 y `references/merge-recipe.md` §Conflicto solo en los registros.
- **Por qué el kit no lo evitó**: el paso 8 dice «marcar el módulo/tarea» sin decir **dónde**, y el estado ya vive en la celda de la fila de la tabla. Tocar además la prosa duplica el estado y abre un conflicto que la receta no resuelve sola.
- **Coste**: una pregunta al dev-lead en pleno cierre y un merge de sincronización rehecho (~5 min).
- **Propuesta**: el paso 8 marca solo la celda de estado de la fila de la feature (y las filas de deuda que salda), nunca listas ni párrafos de orden.
- **Criterio de aceptación**: GIVEN un roadmap con la fila de la feature y una lista de orden que la nombra WHEN se cierra THEN el diff del roadmap del cierre solo cambia la fila y las filas de deuda, y un triaje en la base que reescriba la lista no produce conflicto.

### 3. Juntar el cierre deja colgando los sha de `Pasada de fix:` y `Re-revisión:` en `tasks.md`

- **Qué pasó**: `commit-milestones.md` junta en el commit de cierre los arreglos de la revisión final, pero el paso 6 y el 7 de `sdd-start-feature` piden apuntar en `tasks.md` `Pasada de fix: <sha>` y `Re-revisión: <sha>..<sha>` con los commits del hilo. Tras el `reset --soft` del cierre, esos sha (`7ea5c37`, `21c1f70`) ya no están en la rama.
- **Dónde en el kit**: `skills/sdd-start-feature/references/commit-milestones.md` (fila «Cierre») frente al paso 6 y el 7 de `skills/sdd-start-feature/SKILL.md`.
- **Por qué el kit no lo evitó**: las dos reglas son buenas por separado y nadie las cruzó.
- **Coste**: bajo por ahora: dos referencias rotas en un registro que el cierre de otra sesión podría leer para calcular el tramo sin revisar.
- **Propuesta**: que la receta del cierre reescriba esas líneas con el sha del commit de cierre, o que diga que tras juntarlas quedan como histórico y el tramo se cuenta desde el cierre.
- **Criterio de aceptación**: GIVEN una revisión final con pasada de fix en Native WHEN se junta el cierre THEN ningún sha de `tasks.md` apunta a un commit que no esté en la rama, o el documento dice cuáles son históricos.

### 4. Un sujeto headless no puede abrir sus capturas, y la rúbrica visual no se puede medir

- **Qué pasó**: los sujetos guardaban las capturas fuera del molde (`<run>/shots`, `%TEMP%`), y la lectura de imágenes fuera de su carpeta de trabajo estaba denegada: «no pude abrir las capturas». Uno se las copió a `node_modules/` para leerlas. La rúbrica de composición de la spec quedó sin medir.
- **Dónde en el kit**: `tests/headless/lib.sh`, `build_claude_args` (solo `--add-dir "$KIT"`).
- **Por qué el kit no lo evitó**: el lanzador no prevé sujetos que producen ficheros fuera del molde y necesitan leerlos.
- **Coste**: un requisito de la spec sin evidencia en el GREEN.
- **Propuesta**: `--add-dir "$RUN"` en `build_claude_args`, para que el sujeto lea lo que guarda junto al molde, fuera de git.
- **Criterio de aceptación**: GIVEN un sujeto que guarda una captura en `<run>/shots/` WHEN la abre con `Read` THEN la lee sin denegación, y el sujeto `q1` de la 0099 describe lo que ve en ella.

### 5. `plan-template.md` no tiene la sección «Review Focus» que pide `writing-plans`

- **Qué pasó**: `writing-plans` exige una sección «Review Focus» que `executing-plans` pasa literal al revisor final. La plantilla del kit no la tiene, el plan salió sin ella y el foco del revisor final lo escribí a mano en el encargo.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`.
- **Por qué el kit no lo evitó**: la plantilla es anterior a esa sección de superpowers 6.4.x.
- **Coste**: bajo: un encargo improvisado; con otro agente, un revisor final sin foco.
- **Propuesta**: añadir «## Review Focus» a la plantilla, con su ayuda (cinco entradas que los tests no ejercitan), y que el encargo del revisor final la copie.
- **Criterio de aceptación**: GIVEN un plan calcado de la plantilla WHEN se despacha el revisor final THEN su encargo lleva la sección «Review Focus» del plan literal.

### 6. La tabla `pricing` no tiene el modelo de los revisores de spec

- **Qué pasó**: `Measure-SessionTokens.ps1` dio «Coste de la sesión: sin precio (modelos sin precio: claude-sonnet-5-5)». Los despachos con `model: sonnet` resolvieron a Sonnet 5.5, y la tabla solo lista `claude-sonnet-5`.
- **Dónde en el kit**: `pricing` de `.docs/sdd/sdd-kit.json` de este repo y la plantilla o la migración que lo siembra.
- **Por qué el kit no lo evitó**: la tabla se escribe a mano y no sigue a los alias.
- **Coste**: el coste de la sesión no se mide, y el estimation-log pierde esa columna para esta feature.
- **Propuesta**: añadir `claude-sonnet-5-5` a la tabla y que `Measure-SessionTokens.ps1` avise, con el alias, cuando un modelo usado no tiene precio.
- **Criterio de aceptación**: GIVEN una sesión con un subagente `claude-sonnet-5-5` WHEN se mide THEN el coste sale en dólares.

## Lo que hice por iniciativa propia

- **Probar el detector antes de diseñar la campaña**: `impeccable detect` sobre una tarjeta de 0 px de padding en el scratchpad, 9 s, para saber que el escenario de calidad podía salir en RED y en GREEN. Funcionó: sin ella la campaña habría medido una herramienta sin comprobar.
- **Reproducir a mano un hueco que destapó el RED antes de escribir la guía**: el detector no lleva sesión. Probé el escaneo de un HTML guardado (no carga el CSS) y una URL de entrada con `next=` (sí funciona). Esa prueba decidió el contrato del campo Acceso.
- **Contar señales por sujeto con `grep` sobre `tools.txt`** (detector, viewports, hallazgos, enlaces pedidos, `storageState`) antes de leer los textos. Sirvió para ver en segundos qué sujeto merecía lectura.

## Funcionó, no tocar

- La review de spec con dos lentes encontró 3 críticos reales (renumerar la entrevista rompía un requisito vivo; faltaban el detector que no ejecuta y el escenario sin `§Frontend`).
- El ledger de `executing-plans` junto con `tasks.md`, los vigías de silencio y los RED apartados fuera del repo y comparados con `git diff --no-index`.
- La receta del conflicto «solo en los registros»: acotó bien cuándo el hilo resuelve y cuándo pregunta.
- La rúbrica de review de spec y la regla de preguntar el desvío (la enmienda) sola, antes de la validación.

## Errores míos, no huecos del kit

- Estimé ~15 min por sujeto con navegador y tardaron 1–6: la implementación salió −74 % sobre el plan.
- Filtré una línea con `-like '**Verificación visual**:*'` sin ver que `*` es comodín.
- El `.gitignore` del molde no ignoraba `.auth/`, contra su propia `§Frontend`. Lo cazó la revisión final.
- Cambié una frase del paso 6 con `sed` y rompí el literal que fijaba mi propio test RED.
