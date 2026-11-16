---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261013-130201-patch-0158-menu-vacio-tras-pegar
task: 0158
mode:
date: 2026-10-13
---

# Ticket para el kit — patch 0158: los E2E se lanzaron sin presupuesto de tiempo, sin aislar el entorno y sin el ritmo del usuario

## Contexto

- Carril y modo: patch de fallo de prioridad máxima, reportado por el cliente en el entorno DEV, con release de
  arreglo publicada al cerrar
- Skills del kit usadas: `using-sdd`, `sdd-start-patch`, `sdd-end-patch`, `sdd-roadmap`, `sdd-end-release`,
  `sdd-feedback`; scripts `Get-NextSddId.ps1`, `Merge-CapabilityDelta.ps1`, `Test-Capabilities.ps1`,
  `Test-Roadmap.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`
- Proyecto: monorepo con API .NET, SPA React y un editor de documentos de terceros con plugins propios; suite E2E de
  Playwright contra el entorno levantado (~63 tests, 20–40 s cada uno); varias sesiones de agente a la vez sobre la
  misma rama de integración; `ids.mode: sequence`
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 5 h de patch sin estimación (`patch.md` §5), de ellas ~1 h esperando E2E, más ~1 h de release
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado. El
dev-lead pidió poner el énfasis en los E2E: los hallazgos 1 a 4 son de los E2E y explican por qué la sesión acabó con
el dev-lead sin confianza en el arreglo, aunque el arreglo final era bueno.

## Hallazgos

### 1. Los E2E del agente no reproducían el ritmo del usuario: esperaban al estado interno antes de actuar

- **Qué pasó**: el patch arreglaba el menú contextual; los E2E nuevos pasaban 15/15 con `--repeat-each=3` y se pidió
  la validación. Al validar, el dev-lead encontró en dos minutos un segundo fallo, antiguo, en el mismo flujo: justo
  después de «copiar» un rango, el menú del destino ofrecía y pegaba la copia **anterior** durante ~3 s. Todos los
  E2E de copiar y pegar del proyecto, también los que escribí, hacían `expect.poll(() => copiedRange(request))`
  hasta que el API daba la copia nueva antes de abrir el menú: el test esperaba a que el estado interno estuviera
  listo, y un usuario no espera. El fallo vivía en ese hueco desde hacía tres releases y ningún test lo veía. Lo
  reproduje solo después, con una sonda que abría el menú 1 s después de copiar.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1 («Causa raíz OBLIGATORIA… reproducir») y paso 4
  («Fix mínimo… Verificar que el build del proyecto pasa»); `skills/sdd-end-patch/SKILL.md` paso 0 (la validación se
  pide con el smoke de §4)
- **Por qué el kit no lo evitó**: el kit pide reproducir el fallo reportado, pero no pide repetir el flujo del
  reportero de principio a fin y a ritmo humano antes de pedir la validación, ni avisa de que un E2E que sondea el
  estado del servidor antes de actuar no reproduce lo que vive el usuario. Yo reproduje el síntoma del ticket (el
  menú vacío) y di por bueno el flujo entero.
- **Coste**: una ronda de validación fallida y un segundo arreglo (API y plugin) con sus tests: ~1,5 h; el dev-lead
  vio un «no funciona» delante de una release de prioridad máxima (`patch.md` §1, «En la validación… segundo fallo»;
  §4, filas 9 a 14)
- **Propuesta**: en `sdd-start-patch` paso 4, antes de cerrar el fix de un fallo de UI: «ejecuta una vez el flujo del
  reporte tal como lo hace el usuario, sin esperas a estados internos (sin sondear el API ni el DOM interno entre
  pasos), y anota en §4 el resultado». Y en la guía de E2E (o en `tech-stack.md` §Testing, plantilla): «un E2E que
  espera al servidor entre dos acciones del usuario documenta por qué; cada flujo crítico tiene al menos un test sin
  esa espera».
- **Verificada**: sí — reproducido con una sonda Playwright en pwsh (menú abierto a 1 s de copiar: ofrece la copia
  anterior; a 6 s, la buena) y con el E2E «justo después de copiar otro rango, el documento no ofrece pegar el
  anterior», en rojo sin el arreglo (`Expected: 0 · Received: 1`)
- **Criterio de aceptación**: GIVEN un patch de UI cuyo flujo reportado tiene varios pasos WHEN el agente pide la
  validación THEN §4 de `patch.md` tiene una fila «flujo del reporte a ritmo de usuario» con su resultado, y ningún
  test nuevo del patch espera a un estado interno entre dos acciones del usuario sin una línea que lo justifique.

### 2. Se lanzó la suite E2E entera ×3 (~40 min) sin estimar su duración ni proponer el alcance

- **Qué pasó**: el ticket pedía «los E2E tienen que pasar con `--repeat-each=3`». Lo leí como las tres specs enteras
  (~36 tests × 3 ≈ 108 ejecuciones de 20–40 s, en serie con `--workers 1` porque un estado del servidor es global).
  La lancé dos veces sin decir cuánto tardaría; el dev-lead lo descubrió al preguntar por el tiempo («¿cómo que 40
  min de e2e?») y lo paró. Lo que bastaba: los 5 tests nuevos ×3 (5,4 min, dos grupos en paralelo) y el resto de las
  specs tocadas una vez (6 min, 3 workers). Además, mientras esperaba, cambié el código del plugin y la tanda en
  curso pasó a mezclar versiones (el servidor de desarrollo sirve el plugin en vivo): hubo que pararla y relanzarla.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 4 («Verificar que el build del proyecto pasa»); no hay
  regla sobre el coste en reloj de una verificación ni sobre repetir solo lo nuevo
- **Por qué el kit no lo evitó**: el kit no pide estimar la duración de una tanda larga antes de lanzarla ni avisar
  al usuario, y no distingue «repetir para cazar intermitencias» (tests nuevos o con una carrera conocida) de
  «pasar una vez para descartar regresiones» (el resto). Tampoco dice que, con una tanda en curso, no se toca el
  código que esa tanda sirve.
- **Coste**: ~1 h de reloj esperando o relanzando tandas, dos tandas tiradas, y una feature nueva abierta en el
  roadmap para acelerar los E2E (`patch.md` §4, nota bajo la tabla: «La tanda… se paró a petición del dev-lead»)
- **Propuesta**: en `sdd-start-patch` paso 4 (y el equivalente de `sdd-start-feature`): «antes de una verificación de
  más de ~10 min, di la estimación (tests × duración media ÷ workers) y propone el alcance: lo nuevo o con carrera
  conocida ×N, lo demás ×1; mientras corre, no cambies el código que ejecuta, y si tienes que cambiarlo, para la
  tanda y vuelve a lanzarla». En `tech-stack.md` (plantilla), un campo «duración media de un E2E» y «qué specs comparten
  estado global».
- **Verificada**: sí — contrastado con `skills/sdd-start-patch/SKILL.md` paso 4, que solo pide el build; la duración,
  medida en la sesión (tres specs ×3: ~40 min; nuevos ×3 en dos grupos: 5,4 min)
- **Criterio de aceptación**: GIVEN un ticket que pide «los E2E con `--repeat-each=3`» y una suite de ~100
  ejecuciones de ~30 s WHEN el agente va a verificar THEN dice la estimación y propone repetir solo los tests nuevos
  antes de lanzar nada, y no edita el código servido mientras la tanda corre.

### 3. Los tests del agente corrieron con el mismo usuario que el dev-lead mientras él validaba

- **Qué pasó**: tras el segundo arreglo, mientras el dev-lead validaba a mano en el entorno del worktree, lancé una
  tanda de E2E de copiar y pegar contra el mismo API y con el mismo usuario de test por defecto. Los tests escribían
  en el «rango copiado», que es uno por usuario: al dev-lead el menú le ofreció la copia de mis tests, o ninguna, y
  reportó «ahora ni pega». Antes ya le había pasado lo mismo con la copia que dejó una tanda anterior («me copia lo
  último que habías pegado tú»). Además, una sonda mía arrancada con la salida por defecto vació la carpeta de
  resultados de otra tanda en curso y se perdieron sus trazas.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0 (la validación con el usuario); no hay regla de
  aislamiento entre las ejecuciones del agente y la prueba del usuario
- **Por qué el kit no lo evitó**: el paso 0 dice qué presentar y qué preguntar, pero no que, mientras el usuario
  prueba, el agente no ejecuta nada contra el mismo entorno, ni que los tests del agente no usan el usuario con el
  que prueba la persona. Yo no comprobé qué estado compartían.
- **Coste**: una falsa alarma de «no funciona» en el momento de más tensión y ~15 min de diagnóstico (sin respaldo en
  la spec: el paso no quedó escrito en `patch.md`); trazas de un fallo real perdidas
- **Propuesta**: en `sdd-end-patch` paso 0 (y `sdd-end-feature`): «mientras el usuario valida, no lances tests ni
  sondas contra su entorno; si necesitas ejecutar algo, dilo y espera». En la guía de E2E: «los tests del agente usan
  un usuario de test propio, distinto del de la persona», y «una sonda ad hoc va con su propia carpeta de salida».
- **Verificada**: sin verificar (la interferencia se dedujo del log del API y del orden de las peticiones; no se
  reprodujo a propósito)
- **Criterio de aceptación**: GIVEN el agente acaba de pedir la validación y tiene una tanda pendiente WHEN el
  usuario está probando THEN el agente no lanza la tanda hasta que el usuario responde, o la lanza contra otro
  usuario o entorno y lo dice.

### 4. Se pidió la validación antes de cerrar la verificación, y el guion no cubría el flujo del reporte

- **Qué pasó**: en el paso 0 de `sdd-end-patch` di un guion de cinco pasos y pregunté con `AskUserQuestion`. El guion
  empezaba con lo copiado ya pegado, y no tenía un paso «copia en la hoja y pega enseguida en el documento», que era
  el flujo del reporte. El primer intento de validación encontró el fallo del hallazgo 1. El dev-lead escribió: «MIRA
  QUE LO PODÍAS SACAR TÚ».
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0 («presenta el smoke de `patch.md` §4… y un guion de
  pruebas»)
- **Por qué el kit no lo evitó**: el kit pide un guion, pero no que el agente lo ejecute antes él mismo, de principio
  a fin, ni que el guion empiece por los pasos literales del reporte.
- **Coste**: incluido en el hallazgo 1; además, dos turnos de reproche del dev-lead (sin respaldo en la spec)
- **Propuesta**: en `sdd-end-patch` paso 0: «el guion empieza por los pasos literales del reporte; antes de
  presentarlo, ejecútalo tú en el entorno (navegador o E2E) y escribe en §4 que lo hiciste».
- **Verificada**: sí — contrastado con `skills/sdd-end-patch/SKILL.md` paso 0, que no pide ejecutar el guion
- **Criterio de aceptación**: GIVEN un fallo reportado con pasos de reproducción WHEN el agente pide la validación THEN
  el guion empieza por esos pasos y §4 tiene una fila «guion ejecutado por el agente» con su resultado.

### 5. La pregunta al dev-lead sobre la solución fijada se hizo en términos de API, no de lo que ve el usuario

- **Qué pasó**: la investigación demostró que la solución del ticket («si un control falla al medirse, no contarlo»)
  dejaba un hueco: el usuario podría insertar encima de un elemento protegido. Lo pregunté con `AskUserQuestion` en
  términos de `IntersectWith`, rangos y posiciones. El dev-lead rechazó la primera pregunta para aclararla, y en la
  segunda contestó «No sé, no entiendo lo que me dices… lo que quiero es que funcione».
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 3 (decisiones con autor; «pregúntala cerrada al
  dev-lead»)
- **Por qué el kit no lo evitó**: el kit pide preguntar cerrado, pero no que cada opción se describa por lo que el
  usuario ve o puede hacer, con la jerga técnica fuera de la etiqueta.
- **Coste**: tres turnos de ida y vuelta, ~10 min, y la decisión quedó como «lo que quiero es que funcione», que no
  elige entre las opciones (`patch.md` §3, Decisiones)
- **Propuesta**: en el paso 3: «cada opción dice qué verá o podrá hacer el usuario («con todo seleccionado, el menú no
  deja insertar encima»); el detalle técnico va en la descripción, nunca en la etiqueta».
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una decisión técnica con efecto visible WHEN el agente la pregunta al dev-lead
  THEN cada etiqueta describe el comportamiento visible y ninguna nombra una API.

## Lo que hice por iniciativa propia

- El test sin navegador ejecuta en el motor del editor la función real del plugin, leída de su fichero con una
  expresión regular, no una copia. Detectó el fallo (3 de 4 en rojo) y no puede divergir del plugin. Candidato a regla
  para los plugins que corren dentro de un editor de terceros.
- Un vigilante de consola en los E2E (`watchMeasureErrors`): el arreglo deja `console.error` donde antes se tragaba la
  excepción, y los E2E fallan si aparece. Una excepción tragada en el futuro no pasaría en silencio aunque el menú
  saliera.
- Antes de aplicar la solución del ticket, medí si cubría el caso contrario (selección que sí toca el elemento): ahí
  salió el hueco del hallazgo 5.
- La fila del roadmap para acelerar los E2E (con `sdd-roadmap`) se abrió en la misma sesión, a petición del dev-lead.

## Funcionó, no tocar

- El oráculo de los E2E es el fichero que guarda el editor al cerrar, no el DOM: así se detectó que el primer arreglo
  insertaba en el sitio equivocado (2 de 3 en el E2E), algo que comprobar solo el menú no habría visto.
- La regla de `sdd-start-patch` de no implementar la hipótesis del reporte sin confirmarla: la hipótesis era correcta
  en la causa, pero la medición mostró que su arreglo era inseguro.
- `Invoke-SddMerge.ps1` con `-VerifyCommand`: integró la rama destino (con una feature de otra sesión que tocaba el
  mismo plugin), pasó los dos gates sobre el resultado y publicó sin intervención.
- `sdd-end-release` paso 1: la regla de versionado hizo proponer v0.10.0 frente a la v0.9.1 pedida; el dev-lead eligió
  con la información delante.

## Menores

- Tras el merge, `[Unreleased]` del changelog quedó con dos secciones `### Fixed` (una de cada rama), sin conflicto
  que lo avisara; se juntaron al sellar la release — `skills/sdd-end-feature/references/merge-recipe.md`
- `git push origin main v0.9.1` en Git Bash → `! [remote rejected] v0.9.1 -> v0.9.1 (failed)`; un segundo push de
  la rama y del tag por separado entró sin cambios — `skills/sdd-end-release/SKILL.md` paso 5
- `git worktree remove --force` del worktree temporal de la release, con dependencias instaladas, → `Filename too
  long`; salió con `cmd /c rd /s /q "\\?\<ruta>"` — `skills/sdd-end-release/SKILL.md` paso 5 (no dice dónde
  preparar la rama ni cómo retirarla)
- `env:clean` se hizo después del merge, no antes como pide el paso 6 — `skills/sdd-end-patch/SKILL.md` paso 6
