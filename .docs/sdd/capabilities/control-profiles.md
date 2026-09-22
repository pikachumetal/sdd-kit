# Capacidad — control-profiles

Verdad viva de cuánto para el agente a esperar al dev: los perfiles de control, los gates de cada uno, el desvío, la aprobación, la validación diferida y la política de merge. La declaró la spec de la task 0008 en sus «Decisiones que he tomado yo» (decisión 1). La tabla que las skills aplican vive en `skills/sdd-start-task/references/control-profiles.md`; aquí está el comportamiento observable.

## Requisitos

### El perfil de control decide dónde para el agente
- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una task
- THEN para en estos puntos y en ningún otro: `pair` en la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND en los tres perfiles se confirman siempre las acciones hacia fuera (push, PR, publicar), y el merge a `main` y el tag los decide una persona

### El perfil se hereda de la task, de la release o del proyecto
- GIVEN un perfil en el `profile:` de la spec, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap o `control.profile`
- WHEN el agente determina el perfil vigente
- THEN manda la task sobre la release, y la release sobre el proyecto; una spec sin `profile:` hereda
- AND el agente solo escribe un `profile`, un `control.*` o un `merge` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`)

### La primera pregunta confirma carril, modo y perfil
- GIVEN una task que arranca con usuario presente
- WHEN el agente termina de leer el contexto
- THEN su primera pregunta, sola en su turno, confirma carril y modo, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta task
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, la pregunta propone esa fila como enunciado

### La primera pregunta propone partir una task grande
- GIVEN una task cuyo enunciado, leído con el código que toca, prevé más de 3 tasks internas en el plan
- WHEN el agente formula la primera pregunta de la entrevista
- THEN propone partirla en tasks con fila propia en el roadmap, con la partición y el motivo, como opción recomendada junto a seguir entera
- AND el usuario decide; si sigue entera, no se vuelve a proponer en esa task

### Una respuesta cuenta como aprobación solo si aprueba
- GIVEN un gate de aprobación (spec, plan en `pair`, enmienda)
- WHEN el usuario responde
- THEN cuenta como aprobación un «sí» o un «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba
- AND elegir un alcance o responder a otra pregunta no aprueba: el agente pregunta la aprobación en una línea

### Un cambio a la spec aprobada es un desvío
- GIVEN una spec aprobada y una ejecución en curso
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope o un «No entra»
- THEN en `pair` y `delegate` el agente para, propone el cambio como entrada de `## Enmiendas` en la spec y espera la aprobación
- AND en `unattended` elige la opción más conservadora, la registra como enmienda sin aprobar y, si no hay opción que no bloquee, aparca la task (`⏸️ aparcada: <motivo>`)

### Salir del plan es un ruling visible
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal)
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso o, si no queda ninguna, de la revisión final de rama
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

### La validación puede diferirse con condiciones
- GIVEN una task verificada por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una task en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) o sin disparador con dueño no hay diferido: la task sigue esperando la validación
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** y pasa la fila a ✅

### En `unattended`, lo que falta aparca la task
- GIVEN una task en `unattended`
- WHEN una pregunta de la entrevista no tiene respuesta en los documentos del proyecto
- THEN la task queda `⏸️ aparcada: <pregunta>` en el roadmap y el agente sigue con la siguiente task de la release
- AND al terminar la release entrega un solo informe: tasks cerradas, decisiones, enmiendas sin aprobar y tasks aparcadas

### El merge a develop sigue la política declarada
- GIVEN una task validada (o diferida) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre
- THEN en `delegate` y `unattended` aplica la política sin preguntar; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge`); el perfil de la task, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: `control.maxParallelAgents` 3 y `control.silence` 8 y 20 minutos por defecto; su conducta la define la task 0005. Umbral para proponer partir una task: más de 3 tasks internas previstas.
- **Avisos**: no aplica.
- **Regla ante conflicto**: la task manda sobre la release y la release sobre el proyecto; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona.

## Historial

- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED Una respuesta cuenta como aprobación solo si aprueba (enmienda)
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED La primera pregunta propone partir una task grande (enmienda)
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED El perfil de control decide dónde para el agente · El perfil se hereda de la task, de la release o del proyecto · La primera pregunta confirma carril, modo y perfil · Un cambio a la spec aprobada es un desvío · Salir del plan es un ruling visible · La validación puede diferirse con condiciones · En `unattended`, lo que falta aparca la task · El merge a develop sigue la política declarada
