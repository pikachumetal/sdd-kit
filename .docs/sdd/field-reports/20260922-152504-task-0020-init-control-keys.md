---
kit_version: 1.1.0 (sdd-kit.json del repo; skills del working tree de feature/0020, camino a 1.2.0)
superpowers_version: 6.3.0
lane: task
id: 20260922-152504-task-0020-init-control-keys
task: 0020
mode: full
date: 2026-09-22
---

# Ticket para el kit — task 0020: claves de control en las entrevistas de las init

## Contexto

- Carril y modo: task full, perfil `delegate`
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task` y `sdd-feedback` (las del working tree; ver «Funcionó»), `sdd-init-greenfield` y `sdd-init-brownfield` como objeto de medida, `add-to-changelog` (leída)
- Proyecto: el propio kit (skills en Markdown, tests Pester y un repo bare con worktrees); una persona
- Modelo del hilo: Opus 5 (1M)
- Modelos de los subagentes: un revisor final Sonnet (~125k tokens); sujetos headless Sonnet con simulador Haiku
- Coste en reloj: ~1,3 h desde el arranque hasta el merge
- Coste en tokens: 125k del revisor; campañas de sujetos, 36,13 $ (RED 9,83 $ y GREEN 26,30 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El techo de una campaña de entrevista simulada no se puede aplicar, y la persona sigue más allá del escenario

- **Qué pasó**: el GREEN se estimó en ~17 $ con un techo de 22 $ y costó 26,30 $. Al cerrar la init, un sujeto ofreció como «siguiente paso natural» arrancar `sdd-start-task`. La persona Haiku contestó «Adelante…» y el sujeto abrió una task: cuatro turnos y ~6,5 $ fuera del escenario. Los sujetos corren desacoplados, así que el hilo solo se enteró al final.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Entrevista simulada», y el lanzador de referencia `red/driver.py` de la task 0012. La lección ya está volcada en `tech-stack.md`; el lanzador de referencia sigue sin cambiar.
- **Por qué el kit no lo evitó**: la persona solo sabía responder FIN cuando el agente no preguntaba nada, y un «¿seguimos con X?» cuenta como pregunta. El lanzador no tiene techo por sujeto.
- **Coste**: 4,30 $ por encima del techo aprobado por el dev-lead.
- **Propuesta**: en el lanzador de referencia, un corte cuando el coste acumulado del sujeto pasa de un techo que se le pasa por argumento. Y en la instrucción de la persona: «si el agente da la inicialización por terminada, responde FIN aunque te ofrezca un siguiente paso».
- **Criterio de aceptación**: GIVEN un sujeto que cierra la init y ofrece arrancar una task, WHEN la persona recibe ese turno, THEN responde FIN y el lanzador para; y GIVEN un techo de 5 $ por sujeto, WHEN el coste acumulado lo pasa, THEN el lanzador corta ese sujeto y deja constancia en `state.txt`.

### 2. El paso 10 de `sdd-end-task` no cubre un repo bare con worktrees ni un log autogenerado en conflicto

- **Qué pasó**: con el bloque `merge` completo, el cierre fusiona a `develop`, pero `develop` no estaba en ningún worktree (el repo es bare) y había avanzado cinco commits. El primer worktree temporal, en el scratchpad, falló por ruta larga («Filename too long»); el segundo, junto a los worktrees del repo, funcionó. El merge tuvo conflicto en `estimation-log.md`, que es autogenerado: se resolvió regenerándolo con `Build-EstimationLog.ps1`, sin editarlo a mano.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md`, paso 10, y `skills/sdd-start-task/references/overrides-superpowers.md` (la entrada de `finishing-a-development-branch`).
- **Por qué el kit no lo evitó**: el paso 10 dice «aplicar la política», pero no dónde se ejecuta el merge cuando la rama destino no está en ningún checkout, ni que un fichero autogenerado en conflicto se regenera en vez de resolverse a mano.
- **Coste**: un intento fallido y un conflicto razonado a mano; bajo, pero se repetirá en cada cierre de este repo.
- **Propuesta**: una línea en el paso 10: «si la rama destino no está en ningún worktree, créalo temporal con una ruta corta junto a los del repo, fusiona ahí y quítalo; un `estimation-log.md` en conflicto se regenera con el script». Antes, RED: dos sujetos cerrando sobre un repo bare con `develop` adelantado.
- **Criterio de aceptación**: GIVEN un repo bare con la task en un worktree, `develop` adelantado y conflicto en `estimation-log.md`, WHEN el cierre aplica el bloque `merge`, THEN el sujeto fusiona en un worktree temporal de ruta corta, regenera el log con el script y quita el worktree temporal, no el de la task.

### 3. La validación diferida con un disparador vago obliga al agente a concretarlo

- **Qué pasó**: el dev-lead difirió con «se prueba en uso asi que diferido». La condición 3 exige un disparador con dueño que nombre el usuario. El agente lo concretó («la primera init o migración a v1.2.0 en un proyecto real del equipo, con el dev-lead como dueño») y lo señaló en el informe para que el dev-lead pudiera corregirlo. En este repo, «en uso» es el disparador de siempre (la 0008 cerró igual).
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md`, «Validación diferida», condición 3.
- **Por qué el kit no lo evitó**: la regla no dice qué hacer cuando el usuario nombra un tipo de disparador («en uso») sin dueño ni momento: preguntar otra vez o concretarlo y decirlo.
- **Coste**: bajo. El riesgo es un disparador inventado que nadie reconoce.
- **Propuesta**: «si el usuario nombra el tipo de disparador sin concretarlo (p. ej. "en uso"), el agente lo concreta con el uso más próximo y lo dice en la misma respuesta de cierre, para que el usuario lo corrija». O bien: preguntar solo eso. Decide el dev-lead.
- **Criterio de aceptación**: GIVEN un dev-lead que difiere con «se prueba en uso», WHEN el agente cierra, THEN el walkthrough lleva un disparador concreto y el mensaje de cierre lo señala como concretado por el agente, o el agente lo pregunta en una línea; nunca un disparador «uso» a secas.

### 4. Aparcar el test RED no tiene sentido en una task en línea sin commit intermedio

- **Qué pasó**: el plan copió la regla de aparcar el test RED en la carpeta de la spec y moverlo con `git mv`. La task fue en línea y entre el RED y el verde no hubo commit, así que el agente no lo aparcó. El revisor final lo marcó como Important por no dejar rastro del rojo en git, y quedó registrado como ruling.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «El pre-commit de este repo corre la suite entera…», y `skills/sdd-templates/templates/plan-template.md`, campo `Tests RED` («`en línea`: TDD del propio hilo»).
- **Por qué el kit no lo evitó**: la regla de aparcar existe para no commitear en rojo, pero no dice qué deja como evidencia del rojo cuando no se commitea.
- **Coste**: un Important de revisión y un ruling.
- **Propuesta**: en una task en línea, la evidencia del rojo es la salida de la ejecución fallida, copiada en `tasks.md` o en el walkthrough; el aparcado solo aplica cuando el test se despacha a otro implementador.
- **Criterio de aceptación**: GIVEN una task en línea con un test estructural nuevo, WHEN el hilo lo ejecuta en rojo y lo pone en verde en el mismo commit, THEN `tasks.md` recoge la línea del fallo y el revisor final no lo marca.

### 5. Una pregunta que solo hace una migración nunca llega a un proyecto recién inicializado

- **Qué pasó**: la init escribe en `sdd-kit.json` la versión mayor de `migrations/`, así que la migración de esa versión no se aplica nunca a un proyecto nuevo. Las claves de control solo las preguntaba la v1.2.0, y 0 de 7 sujetos de init las preguntaron. Esta task lo corrigió para las claves, pero la regla general no está escrita donde se escriben las migraciones.
- **Dónde en el kit**: `skills/sdd-init-brownfield/references/migrations/README.md` (no lo dice) y `.docs/sdd/constitution.md`, Art. V. El aprendizaje se volcó en `tech-stack.md`, «Aprendizajes por task».
- **Por qué el kit no lo evitó**: el Art. V exige una migración por cambio estructural, pero no exige que la init haga lo mismo.
- **Coste**: una task entera (la 0020) para cerrar el hueco de una sola migración.
- **Propuesta**: una frase en `migrations/README.md` o en el Art. V: «toda pregunta o dato que añade una migración va también en las init, desde una sola fuente».
- **Criterio de aceptación**: GIVEN una migración nueva que pregunta un campo de `sdd-kit.json`, WHEN un sujeto hace una init con el kit de esa versión, THEN pregunta ese campo; un test estructural podría comprobar que cada clave que escribe una migración aparece también en las dos init.

## Lo que hice por iniciativa propia

- **Usé los streams del GREEN de la 0012 como RED de greenfield**, sin coste: los cinco `sdd-kit.json` salían sin `control`. Funcionó; es la regla «Un stream previo puede ser el RED de otra task», aplicada a disco en lugar de a stream.
- **Una sola fuente para tres skills** (el bloque en `control-profiles.md`) y un test estructural que vigila que se enlaza y no se copia. Funcionó: los seis sujetos del GREEN hicieron las preguntas con el texto del bloque.
- **Corregí el lanzador de referencia** para que reconozca «FIN.» con punto. En el RED, la persona lo escribió así y el lanzador gastó cuatro turnos vacíos.

## Funcionó, no tocar

- La regla del `CLAUDE.md` del repo de contrastar la skill cargada con `skills/<nombre>/SKILL.md` de la rama. La sesión no salió de `Start-KitSession.ps1` y el harness cargó `sdd-start-task` y `sdd-end-task` desde la caché 1.1.0, que no tienen la primera pregunta ni la validación diferida. El contraste lo detectó las dos veces, y `sdd-feedback`, que no está en la caché, se leyó del working tree.
- La primera pregunta sola de `sdd-start-task` (carril, modo y perfil en un turno) y la regla de reproducir los frentes antes de la spec: los dos frentes entraron medidos y la spec se aprobó al primer intento.
- La comprobación previa de seis puntos: detectó el molde G3, cuya constitution contradecía sus ramas.

## Errores míos, no huecos del kit

- Estimé el GREEN con el coste del RED sin sumar los turnos que puede añadir la persona tras el cierre, y me comprometí a un techo que no tenía cómo aplicar.
- El primer script de fusión de capacidades asumía que el último bloque de la spec acababa en otro requisito, falló a medias y dejó `onboarding.md` escrito sin `migration.md`. Se arregló en el acto.
- Lancé el worktree temporal del merge en el scratchpad sabiendo, por el patch 0023, que las rutas largas fallan.
