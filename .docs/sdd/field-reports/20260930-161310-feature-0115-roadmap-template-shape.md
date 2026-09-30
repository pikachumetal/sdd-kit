---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: feature
id: 20260930-161310-feature-0115-roadmap-template-shape
task: 0115
mode: full
date: 2026-09-30
---

# Ticket para el kit — feature 0115: el roadmap en la forma de la plantilla

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans` y `test-driven-development`
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell con Pester), una persona y un agente, con otra sesión trabajando a la vez en la rama de integración
- Modelo del hilo: Opus 5.5, toda la sesión
- Modelos de los subagentes: Sonnet (dos revisores de spec), Opus effort high (revisor final y dos re-revisiones); 10 sujetos headless Sonnet
- Coste en reloj: ~4,5 h de sesión, de ellas ~3 h de implementación
- Coste en tokens: hilo 63,4 M (28,74 $), subagentes 4,0 M (4,54 $), sujetos 2,67 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task que reescribe un registro compartido no tiene camino cuando la base se mueve

- **Qué pasó**: la Task 4 reescribió `roadmap.md` entero. Mientras tanto otra sesión hizo cinco commits en la rama de integración, cuatro sobre ese fichero en su forma antigua. El conflicto abarcaba casi todas las líneas. Hubo que parar, integrar la base, rehacer el script de transformación (elegía filas por número de línea) y pasar otra re-revisión.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «Conflicto solo en los registros»; `skills/sdd-start-feature/SKILL.md` paso 6, comprobación de la base.
- **Por qué el kit no lo evitó**: la receta solo cubre líneas añadidas por los dos lados; si los dos tocan la misma línea, dice «es de una persona». No hay salida para «reaplica la transformación sobre la base nueva». Y el plan no tiene dónde decir que una task reescribe un registro que otras sesiones editan.
- **Coste**: ~25 min de reloj, un script rehecho y una re-revisión en Opus de 900k tokens.
- **Propuesta**: cuando una task reescribe un registro (`roadmap.md`, `changelog.md`), el plan lo declara, la transformación se guarda como script que elige por contenido, y el paso 6 manda comprobar la base justo antes de esa task y otra vez antes de presentar la validación. Sin verificar.
- **Criterio de aceptación**: GIVEN una feature cuya última task reescribe `roadmap.md` y una rama de integración que gana dos filas en ese fichero durante la ejecución · WHEN el agente llega a la validación · THEN ya integró la base y reaplicó la transformación, las dos filas nuevas están en el resultado y el usuario valida el roadmap que se va a fusionar.

### 2. Tres revisiones en Opus para una feature de cuatro tasks

- **Qué pasó**: revisión final (2,3 M tokens), re-revisión del tramo de dos enmiendas aprobadas por el dev-lead (0,5 M) y re-revisión del merge de sincronización (0,9 M). Entre medias, dos commits de arreglos de prosa que el hilo revisó por su cuenta con un ruling, porque uno tocaba dos frases de `tests/<skill>-green.md` y la excepción solo nombra `.docs/` y los `.md` de la raíz.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` pasos 6 y 7, y `skills/sdd-end-feature/SKILL.md` paso 9: «se revisa en el hilo el de solo docs y de menos de 20 líneas… bajo `.docs/` o `*.md` de la raíz».
- **Por qué el kit no lo evitó**: la excepción se define por la ruta. La evidencia de una campaña vive en `tests/*.md` y es prosa. Tercer caso de la fila de deuda «La excepción de re-revisión se define por la ruta del fichero, no por el tipo de cambio».
- **Coste**: ~1,4 M tokens de Opus en re-revisiones y un ruling.
- **Propuesta**: la excepción cubre también los `.md` de evidencia; y una enmienda aprobada por el dev-lead tras la revisión final entra en la pasada de fix, no abre un tramo aparte. Sin verificar.
- **Criterio de aceptación**: GIVEN una revisión final ya vuelta y un commit posterior que cambia dos frases de un `tests/*-green.md` · WHEN el agente prepara la validación · THEN lo revisa en el hilo, lo anota como «revisado en el hilo» y no despacha un revisor.

### 3. La sesión ejecutó en el modelo más capaz y el kit no dice cuánto cuesta no bajar

- **Qué pasó**: la oferta de bajar la sesión a gama media salió dos veces (primera pregunta y gate de la spec) y no se eligió. El hilo ejecutó las cuatro tasks en Opus: 28,74 $, casi todo lectura de caché.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` pasos 2 y 4, las opciones «…paras antes de la Task 1 para que baje la sesión a gama media».
- **Por qué el kit no lo evitó**: la opción da el motivo («el hilo es la mayor parte del coste») sin ninguna cifra, y no es la recomendada.
- **Coste**: sin medir; el hilo fue el 86 % del coste de la sesión.
- **Propuesta**: la opción lleva una cifra de referencia del `estimation-log` del proyecto (coste medio del hilo por feature en cada gama). Sin verificar.
- **Criterio de aceptación**: GIVEN una sesión en el modelo más capaz y un log con features ejecutadas en las dos gamas · WHEN sale la primera pregunta con más de una task prevista · THEN la opción de gama media dice el coste medio del hilo en cada gama.

### 4. El paquete del revisor final no cabe cuando un fichero del diff tiene filas muy largas

- **Qué pasó**: el diff de `roadmap.md` pesó 500 KB en 403 líneas. El paquete entero, 513 KB. El hilo lo sacó del paquete con un ruling y una sección «Fuera del paquete», y el revisor lo comprobó en el árbol con Grep y el validador.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final», la receta del paquete y su `EXCLUDE`.
- **Por qué el kit no lo evitó**: la receta excluye carpetas de evidencia y la carpeta de la spec, no ficheros por la longitud de sus líneas. «Tramos de 400 líneas» no acota el tamaño cuando una línea mide 8.000 caracteres.
- **Coste**: un paquete rehecho y un ruling; sin el cambio, el primer `Read` del revisor habría fallado.
- **Propuesta**: la receta mide la línea más larga de cada fichero del diff; si pasa de un umbral, lo saca y lo nombra en «Fuera del paquete», con la instrucción de revisarlo en el árbol.
- **Criterio de aceptación**: GIVEN una rama cuyo diff incluye un fichero con líneas de más de 2.000 caracteres · WHEN el hilo prepara el paquete del revisor final · THEN ese fichero no está en el diff del paquete, aparece en «Fuera del paquete» y el encargo dice cómo revisarlo.

### 5. El worktree del revisor final desapareció a mitad de la revisión

- **Qué pasó**: `review-<id>-<sha>` del primer revisor dejó de existir sin que el hilo lo retirara. El revisor lo avisó y terminó en solo lectura sobre el worktree de la feature, que estaba en el mismo sha. Los worktrees de las dos re-revisiones duraron. Causa sin verificar; la herramienta que gestiona los worktrees de la máquina tiene una papelera propia.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final», el worktree desanclado.
- **Por qué el kit no lo evitó**: el encargo nombra ese directorio como el único en el que trabaja y no dice qué hacer si falta.
- **Coste**: ninguno esta vez; el riesgo es un revisor que lee un árbol que ya avanzó.
- **Propuesta**: una frase de respaldo en el encargo: si el directorio no existe, dilo al principio y trabaja en solo lectura sobre el worktree de la feature, comprobando antes que `HEAD` es el sha que revisas. En las dos re-revisiones se usó y no hizo falta.
- **Criterio de aceptación**: GIVEN un encargo de revisor final anclado a un worktree que se borra durante la revisión · WHEN el revisor va a leerlo · THEN su informe empieza diciéndolo y nombra el árbol y el sha sobre los que terminó.

### 6. El conjunto rápido del pre-commit roza su tope y crece con cada campaña

- **Qué pasó**: el pre-commit pasó de 26 a 28 s con un tope de 30, y `FastSuiteBudget` falló una vez dentro de la suite completa. El test de privacidad de las salidas de sujetos tarda 10 s y recorre todas las salidas versionadas. Se arregló marcando `Slow` los tests del script nuevo, contra una decisión del plan.
- **Dónde en el kit**: no es una skill: `tests/FastSuiteBudget.Tests.ps1` y `tests/SubjectOutputPrivacy.Tests.ps1`, y la regla de `tech-stack.md` «Conjunto rápido y tests `Slow`».
- **Por qué el kit no lo evitó**: la regla dice qué tests van con `Slow` por lo que hacen (crear repos, lanzar procesos), no por lo que crecen.
- **Coste**: una suite completa repetida (8 min) y un ruling.
- **Propuesta**: el test de privacidad mira solo las salidas cambiadas respecto a la rama de integración en el pre-commit, y todas en la suite completa.
- **Criterio de aceptación**: GIVEN una rama que añade las salidas de diez sujetos · WHEN corre el pre-commit · THEN el test de privacidad revisa solo esas salidas y el conjunto rápido no tarda más que antes de la rama.

### 7. El trabajo sin commitear de una task posterior bloquea el commit de la anterior, también si son documentos

- **Qué pasó**: en Native, mientras los sujetos del GREEN corrían en segundo plano, el hilo adelantó documentos de las tasks 3 y 4. El commit de la Task 2 falló dos veces por tests que leen el árbol: uno de nombres de ruta y otro que leía una sección que la Task 4 ya había movido.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6, el párrafo de Native; `skills/sdd-start-feature/references/commit-milestones.md`, «Tests RED sin commitear».
- **Por qué el kit no lo evitó**: la regla habla de tests RED de una task posterior. No dice nada de adelantar trabajo de otra task durante una espera, que es lo que invita a hacer una campaña en segundo plano.
- **Coste**: dos commits rechazados y reordenar los tres commits de task al final.
- **Propuesta**: durante una espera en Native se adelanta solo lo que no toca el árbol que leen los tests (borradores fuera del repo), o se cierra antes la task en curso.
- **Criterio de aceptación**: GIVEN una task con una campaña en segundo plano y una task siguiente de documentos · WHEN el hilo aprovecha la espera · THEN el commit de la task en curso pasa el pre-commit sin depender de ficheros de la siguiente.

### 8. Una afirmación de la fila del roadmap entró en la spec sin comprobar

- **Qué pasó**: la fila decía «comprobado que ninguna skill ni test lee las secciones fuera de la plantilla». Un test leía una de ellas, y lo destapó el pre-commit al migrar.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4, repaso de coherencia: contrasta los `MODIFIED` con el código, no las afirmaciones de estado que trae el enunciado.
- **Por qué el kit no lo evitó**: es la fila de deuda «La propuesta o la cifra de un ticket entra en el roadmap como decidida sin estar verificada»; este es otro caso, con una afirmación del propio roadmap.
- **Coste**: un commit rechazado y un test cambiado.
- **Propuesta**: el repaso de coherencia vuelve a medir toda afirmación «comprobado que…» del enunciado que la spec use como premisa.
- **Criterio de aceptación**: GIVEN una fila que afirma que nada lee cierto fichero y un test que sí lo lee · WHEN el agente escribe la spec · THEN la spec nombra ese test entre lo que cambia.

### 9. Un ensayo en seco del lanzador cuenta como sujeto y como gasto

- **Qué pasó**: con `DRY_RUN=1`, `run.sh` deja `<etiqueta>.tools.txt` con su coste en `<spec>/<fase>/out`, y el recuento de sujetos y de gasto de la campaña lo suma. Hubo que ensayar con `PHASE=dry`, `DRY_COST=0` y borrar la carpeta después.
- **Dónde en el kit**: no es una skill: `tests/headless/run.sh` y `lib.sh`.
- **Por qué el kit no lo evitó**: el ensayo en seco escribe donde escribe una fase real.
- **Coste**: una carpeta que borrar en cada ensayo; si se olvida, el tope de sujetos salta antes de tiempo.
- **Propuesta**: con `DRY_RUN=1` las salidas van a una carpeta fuera de `SPEC_DIR`.
- **Criterio de aceptación**: GIVEN una campaña con 9 sujetos de un tope de 10 · WHEN se ensaya un escenario con `DRY_RUN=1` · THEN el recuento sigue en 9 y el gasto no cambia.

### 10. Tras un rechazo del diálogo de preguntas para aclarar, el agente volvió a usarlo

- **Qué pasó**: durante el diseño, el usuario rechazó tres veces seguidas el diálogo de preguntas cerradas para pedir una aclaración. El agente respondió en texto y volvió a abrir el diálogo en el turno siguiente.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2 y `mission.md` («cada pregunta va con `AskUserQuestion`»).
- **Por qué el kit no lo evitó**: la regla no distingue una decisión cerrada de una conversación de diseño abierta.
- **Coste**: tres diálogos rechazados.
- **Propuesta**: si el usuario rechaza el diálogo para aclarar, la conversación sigue en texto hasta que el diseño esté acordado, y el diálogo vuelve para la aprobación.
- **Criterio de aceptación**: GIVEN un usuario que rechaza el diálogo y escribe una duda abierta · WHEN el agente contesta · THEN acaba con una pregunta en texto, sin abrir el diálogo.

## Lo que hice por iniciativa propia

- **Comprobación fila a fila del merge con un script**, antes de la re-revisión: cada fila de tabla de la base está en el resultado o sale por un motivo de la tabla aprobada. El revisor llegó después al mismo recuento por su cuenta. Funcionó.
- **Mutante para un test señalado como vacío**: quitar el tratamiento del caso límite y ver el test en rojo, antes de darlo por arreglado. Funcionó; el primer intento de mutación, con un `sed` demasiado amplio, no.
- **Frase de respaldo en el encargo del revisor** si su worktree no existe (hallazgo 5).
- **Sección «Fuera del paquete»** en el paquete del revisor final (hallazgo 4).
- **El documento anterior, entero, como artefacto de la feature**: una copia del registro antes de reescribirlo, en la carpeta de la spec. El dev-lead pedía no perder datos; sirvió también de base para reaplicar la migración.
- **Previsión de la campaña antes de la spec y otra vez en la spec**, con el cambio de sujetos declarado como decisión a aprobar.
- **Búsqueda en la web durante el diseño**, cuando el usuario la pidió: tres búsquedas y dos páginas, con las fuentes en la respuesta.

## Funcionó, no tocar

- **Proponer partir en la primera pregunta**: de siete tasks a cuatro, con la otra mitad en una fila con id reservado.
- **El RED antes de la spec**: dos sujetos y 0,61 $ recortaron siete conductas que el baseline ya cumplía y dieron los cuatro pasos que la migración necesitaba.
- **Dos revisores de spec con lentes separadas**: 20 hallazgos, 5 críticos, sin duplicados. El de dominio vio que un concepto nuevo contradecía dos capacidades que la spec no declaraba.
- **El revisor final y su re-graduación por efecto**: un test que no mordía y una aserción que habría roto el pre-commit en el siguiente corte de release.
- **El GREEN hace converger**: dos roadmaps distintos en el RED, casi idénticos en el GREEN; el punto en que seguían divergiendo era un hueco real de la receta.
- **`Invoke-SddMerge.ps1 -Push`**: fusionó y publicó a la primera, dos veces.
- **`tests/headless/lib.sh`**: dos lanzadores de 60 líneas sin copiar ninguno; `DRY_RUN` cazó un molde mal montado antes de gastar.
- **`Measure-SessionTokens.ps1`**: tres líneas pegadas sin retocar.
- **La parada del gate de la migración**: una tabla de destinos y tres preguntas resolvieron lo que en el RED dos sujetos decidieron solos y distinto.

## Errores míos, no huecos del kit

- No volví a comprobar la base antes de la Task 4: el paso 6 lo pide en cada task, y solo lo hice antes de la primera.
- Recomendé un revisor de spec donde la rúbrica pedía dos. El dev-lead eligió dos, y encontraron cinco críticos.
- Propuse en el diseño una sección nueva y un fichero de volcado que la review de spec tumbó: los dos contradecían el principio que la propia feature introducía.
- Un mensaje de commit citaba un sha que acababa de juntar; lo corregí con `--amend` antes de publicar.
- Dos órdenes de shell con `eval` y un heredoc fallaron por las comillas; las rehice con un script en fichero.
