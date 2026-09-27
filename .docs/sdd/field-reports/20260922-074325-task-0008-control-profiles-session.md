---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 20260922-074325-task-0008-control-profiles-session
task: 0008
mode: full
date: 2026-09-22
---

<!-- Generado el 2026-09-22 con sdd-feedback al cerrar la task 0008, en la misma sesión. Copia literal de .docs/sdd/kit-feedback/. -->

# Ticket para el kit — task 0008: la campaña de sujetos perdió un tercio del GREEN en escenarios que no medían la guía

## Contexto

- Carril y modo: task full, XL, con dos enmiendas aprobadas durante la ejecución.
- Skills del kit usadas: `sdd-start-task` (pasos 1–7, del working tree), `review-spec.md` (dos revisores), `sdd-templates` (spec, plan, tasks, walkthrough, capability, este ticket), `sdd-end-task`, `add-to-changelog`, la migración `v1.2.0.md` como smoke y `sdd-feedback`. De superpowers: `brainstorming`, `writing-plans`, `subagent-driven-development` y `finishing-a-development-branch` (sustituido por la política de merge nueva).
- Proyecto: el propio kit, con skills en markdown, suite Pester con pre-commit de suite verde, un dev-lead, repo bare con un worktree por rama.
- Modelo del hilo: Opus 5 (1M).
- Modelos de los subagentes: Sonnet (dos revisores de spec, cuatro implementadores, una revisión agrupada y dos revisiones acotadas). Sujetos headless: Sonnet. El effort no se puede declarar en el tool.
- Coste en reloj: ~4,3 h de agente (1,7 h de spec y plan, 2,6 h de implementación y cierre), partido en dos días por el tope semanal de uso; aproximado por las marcas de los commits.
- Coste en tokens: subagentes ~1,23 M (revisores de spec ~211k, implementadores ~660k, revisión agrupada ~222k, re-revisiones ~141k); hilo principal no medido. Sujetos headless: 39,79 $ (RED 8,47 $ con 21 sujetos, GREEN 31,32 $ con 33).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Cinco escenarios del GREEN no medían la guía y hubo que rehacerlos

- **Qué pasó**: de 33 sujetos del GREEN, 11 se invalidaron por causas del escenario, no del kit. (a) Con «acaba la task 0009» ningún sujeto cargó una skill del kit, así que los dos brazos corrieron sin kit. (b) Un molde contradecía su propio plan: vetaba un fichero «que comparte otra task», pero ese fichero nacía en el commit de la task medida. (c) Un segundo turno fijo, «apruebo la spec», llegaba sin spec, porque la guía nueva ya no deja escribirla en el primer turno. (d) «Trabaja la release» se entendió como cerrarla. (e) La copia del kit decía la misma versión que el proyecto, y la migración no tenía nada que hacer. Cada caso se vio al leer los resultados, después de pagar los sujetos.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` del repo del kit, §Fixtures y baselines y §Sujetos headless. Tiene reglas sueltas (el orden de los mensajes, el ruido del molde), pero ninguna comprobación previa al lanzamiento.
- **Por qué el kit no lo evitó**: las reglas del método se escriben después de cada fallo, una a una, y se leen como narrativa. Nada obliga a revisar un escenario contra una lista antes de lanzarlo.
- **Coste**: ~8 $ de sujetos invalidados y ~45 min de relanzamientos y renombrados. E4 tuvo que repetirse también en el brazo RED.
- **Propuesta**: una lista de comprobación previa por escenario en `tech-stack.md`, con cinco preguntas: ¿el turno 1 carga la skill que se mide? ¿Lo que el plan da por preexistente está en el commit base? ¿El turno 2 encaja con lo que el sujeto hará en el turno 1 con la guía nueva? ¿La petición tiene una sola lectura? ¿La copia del kit tiene la versión que el escenario necesita? Y una comprobación posterior: el stream muestra que el sujeto cargó la skill.
- **Criterio de aceptación**: GIVEN una campaña GREEN con un escenario de mitad de flujo cuya petición no dispara ninguna skill, WHEN el agente la prepara, THEN la lista lo detecta antes de lanzar y el escenario se reformula para situar al sujeto dentro del flujo.

### 2. Un requisito recortado por el RED volvió a fallar en el GREEN

- **Qué pasó**: «Elegir un alcance no aprueba la spec» pasó 2/2 en el RED y se recortó (Art. I). En el GREEN, la guía nueva de `delegate` («desde la aprobación el agente trabaja solo») hizo que 1 de 2 sujetos tomara «vale, que solo valide X» como aprobación e implementara. Hizo falta una segunda enmienda y otra task.
- **Dónde en el kit**: `.docs/sdd/constitution.md` Art. I (el recorte) y `tech-stack.md` («Un baseline que no falla es evidencia válida de que la guidance sobra»).
- **Por qué el kit no lo evitó**: el Art. I trata el recorte como definitivo. No prevé que la guía de otro requisito cree la presión que el baseline no tenía.
- **Coste**: una enmienda, un implementador más (~108k tokens), una revisión acotada y cuatro sujetos.
- **Propuesta**: un requisito recortado por el RED se repite en el GREEN como control de no regresión (ya anotado en `tech-stack.md` en el cierre), y una frase en el Art. I: el recorte vale para la guía que no se escribe, no para dejar de medir.
- **Criterio de aceptación**: GIVEN una task con un requisito recortado por el RED y guía nueva que toca el mismo gate, WHEN el agente escribe el plan del GREEN, THEN el requisito recortado tiene su escenario de control.

### 3. El roadmap de la task cambió en `develop` a mitad de ejecución y nada lo detecta

- **Qué pasó**: con las Tasks 2 y 3 ya despachadas, el dev-lead añadió una hipótesis nueva a la fila de la task en `develop` (partir las tasks grandes). Me enteré porque me lo dijo. Se tramitó como enmienda (RED, task nueva, GREEN). Sin el aviso, habría aparecido en conflicto al integrar la base antes de los docs de cierre, con la implementación ya terminada.
- **Dónde en el kit**: no se localiza en una skill. La comprobación de la base existe como regla 4 de ejecución del roadmap del repo, solo antes de los docs de cierre y del merge (y es alcance de la task 0009).
- **Por qué el kit no lo evitó**: la fila del roadmap es el enunciado de la task, pero nadie la vuelve a leer después del gate de la spec.
- **Coste**: bajo en esta sesión, gracias al aviso. Sin él, una enmienda tardía o un requisito perdido.
- **Propuesta**: en el paso 6, antes de despachar cada task del plan, comparar la fila de la task en la base con la que leyó la spec. Si cambió, es un posible desvío y se trata con el gate de desvío. Candidato a la task 0009 (tasks en paralelo y base que se mueve).
- **Criterio de aceptación**: GIVEN una task en ejecución cuya fila del roadmap cambia en la base, WHEN el agente va a despachar la siguiente task del plan, THEN detecta el cambio y lo presenta como posible enmienda antes de seguir.

### 4. El encargo del implementador no prohíbe `git stash`, y la pila es compartida entre worktrees

- **Qué pasó**: un implementador usó un `git stash` temporal para ver su RED. La pila quedó vacía y no pasó nada, pero la pila de stash es común a todos los worktrees del repo y a las demás sesiones.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md`, «Encargo del implementador». Solo lleva el bloque de Restricciones globales y el contrato de tests.
- **Por qué el kit no lo evitó**: el plan sí prohíbe `git add -A`, pero nadie pensó en el stash. Solo lo prohibí en el mensaje de fix, después de verlo.
- **Coste**: ninguno esta vez; en el peor caso, trabajo de otra sesión perdido.
- **Propuesta**: una línea en las Restricciones globales de la plantilla del plan o en el encargo del implementador: «nunca `git stash` (la pila es común a todos los worktrees); para apartar trabajo, un commit WIP». Encaja con las reglas fijas del implementador de la task 0005.
- **Criterio de aceptación**: GIVEN un implementador que necesita ver su test en rojo con el código previo, WHEN trabaja en un worktree de un repo con varios, THEN usa un commit temporal o un checkout de ficheros, no `git stash`.

### 5. Un corte por el tope de uso dejó subagentes a medias sin procedimiento de reanudación

- **Qué pasó**: el tope semanal de uso cortó una re-revisión en marcha y marcó como fallado un implementador que ya había entregado su commit. Al día siguiente la ejecución se retomó con el ledger de `subagent-driven-development` y `git log`, y la re-revisión se relanzó entera.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6: no hay sección de recuperación (alcance ya previsto de la task 0009, «Recuperación»).
- **Por qué el kit no lo evitó**: la recuperación solo contempla que la máquina caiga, no un corte por cuota con notificaciones de fallo de agentes que ya habían terminado.
- **Coste**: una re-revisión repetida (~60k tokens) y un turno para distinguir un fallo real de uno tardío.
- **Propuesta**: añadir a la sección «Recuperación» de la 0009 el caso del corte por cuota: una notificación de fallo de un agente cuyo informe ya llegó se ignora; el resto se relanza con el mismo encargo.
- **Criterio de aceptación**: GIVEN una ejecución cortada por cuota con un agente que ya entregó y otro a medias, WHEN la sesión se reanuda, THEN el agente relanza solo el que estaba a medias y lo anota en el ledger.

### 6. Un sujeto headless escribió a la sesión que lo medía

- **Qué pasó**: un sujeto del GREEN usó la mensajería de agentes, encontró la sesión viva que dirigía la campaña y le mandó un aviso de coordinación sobre un fichero del molde. Llegó con la etiqueta de «otra sesión de Claude».
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` §Sujetos headless (ya anotado en el cierre).
- **Por qué el kit no lo evitó**: el lanzador de sujetos permite `Agent` y no limita las herramientas de mensajería.
- **Coste**: nulo esta vez; el hilo lo reconoció. Con otro hilo, podía actuar sobre el aviso.
- **Propuesta**: lanzar los sujetos con las herramientas de mensajería entre sesiones bloqueadas (`--disallowedTools`), salvo que el escenario las mida.
- **Criterio de aceptación**: GIVEN un sujeto headless con una razón para coordinarse con otra sesión, WHEN corre, THEN no puede listar ni escribir a sesiones vivas de la máquina.

## Lo que hice por iniciativa propia

- **RED previo a la spec con dos sujetos solo para la conducta que no se verifica leyendo** (la oferta de lite). Los frentes estructurales se verificaron con fichero y línea. Funcionó: 1,59 $ y el frente cayó a deuda antes de diseñar nada.
- **Aplicar la migración nueva al propio repo como smoke del cierre**, dejando que el paso 10 fusionara con la política recién escrita. Funcionó: probó migración y política en uso real sin sujetos.
- **Comprobar en el stream qué skills cargó cada sujeto** antes de dar un veredicto de E4. Así se descubrió que los dos brazos corrían sin kit.
- **Añadir un escenario propio para E7** cuando la evidencia prevista (specs escritas por el molde) no servía. Funcionó: 2/2 con dos señales.
- **Renombrar carpetas de evidencia** (`green/o`, `m-cm`, sufijos cortos) para respetar el tope de 140 caracteres, en lugar de dejar rutas largas.

## Funcionó, no tocar

- **El gate de desvío y `## Enmiendas`**, estrenados en la propia task: dos cambios de alcance con el dev-lead, cada uno con su RED, su task y su GREEN, sin reescribir la spec.
- **La revisión agrupada** que pidió el dev-lead: un Important real (un encabezado que contradecía `unattended`) por ~222k tokens, frente a cuatro revisiones por task.
- **La review de spec con dos lentes**: 14 hallazgos, 5 Críticos, todos aceptados, sin duplicados.
- **Los tests del hilo aparcados en `red/` y movidos por cada implementador**: cuatro implementadores, ningún `--no-verify` y ningún test editado.

## Errores míos, no huecos del kit

- Un `git commit -F` con una ruta equivocada tomó como mensaje el contenido del fichero `.git` del worktree. Corregido con `--amend` antes de publicar.
- Una ruta de salida relativa en el lanzador de sujetos escribió `out/` dentro de la copia de un run.
- Escribí un veredicto de E7 sin comprobarlo en disco. Lo vi al verificar y lo rehíce con un escenario propio.
- Un comando de PowerShell con here-string chocó con el hook de borrado de la máquina, pese a estar documentado en `tech-stack.md`.
