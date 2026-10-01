# Guía de uso del kit SDD

Esta guía es para ti si tienes el kit instalado en tu proyecto y quieres saber cómo se trabaja con él día a día: qué le pides al agente, qué te va a preguntar, qué le contestas y qué queda escrito al final. No explica cómo está hecho el kit por dentro.

Para el porqué del flujo y sus fases, están los otros documentos: [proyectos nuevos](greenfield.md), [codebases existentes](brownfield.md) y el [anexo de evidencia](evidence-and-references.md). Aquí se enlazan en vez de repetirse.

## 1. La idea: tres verbos

Con el kit se trabaja con tres verbos, siempre en este orden:

| Verbo | Skill | Qué haces | Qué queda escrito |
| --- | --- | --- | --- |
| **Planificar** | `sdd-roadmap` | Meter trabajo en el roadmap sin hacerlo todavía: algo grande, algo concreto, los items del gestor, las notas de una reunión, un cambio de orden, la siguiente release | Filas en `.docs/sdd/roadmap.md` con su id y su orden y, si es algo grande o una reunión, una propuesta en `.docs/sdd/specs/<fecha>-proposal-<id>-<nombre>/proposal.md` |
| **Hacer** | `sdd-start-feature` o `sdd-start-patch` | Una fila del roadmap, o lo que acaba de llegar: un patch si la solución ya está fijada (un fallo pequeño y reproducible, un ajuste o una retirada de presentación, o una petición cerrada), una feature si hay que decidir cómo es | La carpeta de la feature (`spec.md`, `plan.md`, `walkthrough.md`) o el `patch.md`, el código, el changelog y la fila del roadmap al día, y el merge en `develop` |
| **Entregar** | `sdd-end-release` | Cortar una versión con lo que ya está cerrado | El changelog sellado, las notas de la versión si hay destinatario, el roadmap colapsado y, cuando tú lo confirmas, el merge a `main` y el tag |

Planificar no hace nada: deja el roadmap listo para que alguien arranque. Hacer arranca una fila y termina con ella fusionada. Entregar publica lo hecho.

No hace falta nombrar ninguna skill. Al empezar cada sesión, el kit le inyecta al agente la skill `using-sdd`, que decide por qué verbo entra lo que escribes. Aparte de los tres verbos hay dos ayudas que no crean trabajo:

- **Preguntar** (`sdd-consult`): «¿por qué…?», «¿se puede…?», «¿dónde tocaría…?». Responde con los documentos del proyecto cargados y no crea ni carpetas ni ramas.
- **Cómo quieres trabajar tú** (`sdd-config`): «me paras mucho», «quiero trabajar en pair solo yo». Tus preferencias van a `.docs/sdd/sdd-kit.local.json`, que no va a git; las del equipo, a `.docs/sdd/sdd-kit.json`.

Casi todo lo del kit acaba en `.docs/sdd/`. Los documentos de anclaje (mission, constitution, tech-stack, architecture, capabilities, roadmap) los lee el agente al arrancar cada tarea; qué es cada uno lo cuenta [greenfield](greenfield.md#11-documentación-de-anclaje).

## 2. Planificar: el roadmap es la entrada

El roadmap es el índice del proyecto: lo leen todas las skills, y cada fila es el enunciado de una feature o un patch. Todo lo que no vas a hacer ahora mismo entra por `sdd-roadmap`. La señal está en el verbo que usas: «apunta», «organízalo», «planifica», «no lo arranques» es planificar; «añade», «hazme», «arréglalo» es hacer.

`sdd-roadmap` reconoce sola qué le traes. Hay cinco entradas, más preparar una release:

| Lo que traes | Frases de ejemplo | Qué hace |
| --- | --- | --- |
| **Algo grande y difuso** | «Quiero que los clientes puedan pagar a plazos», «organízalo para el equipo» | Te entrevista, una pregunta por turno. Escribe una propuesta (`proposal.md`) con el porqué, las reglas de negocio con ejemplos con datos y el reparto en features, cada una con su id y su «tras NNNN». La entrevista nunca acaba en spec: acaba en la propuesta y en las filas |
| **Algo concreto** | «Apunta lo del filtro por estado en pedidos, no lo arranques» | Una fila, sin propuesta. Una épica de una sola feature es una feature |
| **Items del gestor** | «Estos son los PBI 4512 a 4516 que me ha asignado el PM» | Cada item entra con su id del gestor. Si uno parece duplicar una fila, te lo pregunta: no borra ni fusiona nada sin ti. Si uno es grande, te propone ya cómo partirlo, para que el PM cree los hijos en el gestor |
| **Una reunión con el cliente** | Pegas las notas de la reunión de ayer | Una propuesta con el acta literal (fecha, asistentes, notas). Cada cosa nueva que pide el cliente es una fila; lo que descarta queda `⏸️ aparcada`, sin borrarse; el orden que pide se aplica a lo pendiente |
| **Reordenar o cambiar** | «La 0014 va tras la 0012», «quita la 0020», «el cliente ha cambiado la regla del descuento» | Solo toca las filas que nombras. Si cambia una regla ya acordada, añade una enmienda fechada a la propuesta y reparte solo lo pendiente. Una feature cerrada o en marcha no se toca: lo que el cambio le pida va a una fila nueva «tras» ella |
| **Preparar una release** | «Prepara la release 3», «qué entra en la siguiente entrega» | Inventario (backlog, deuda, lo que quedó de la anterior), orden por riesgo con los bloqueos marcados y una sección `## Release <N>` con las filas que decidas tú |

Tres cosas que conviene saber:

- **Propone, no decide.** En `pair` y en `delegate` te enseña las filas y la propuesta antes de escribirlas, y espera tu respuesta. Si le dices «decide tú», escribe y deja apuntadas las decisiones que tomó.
- **Los ids no se inventan.** Con gestor (Azure DevOps, Jira: `ids.mode: tracker`), el id es el del gestor. Sin gestor (`ids.mode: sequence`), `sdd-roadmap` reserva de una vez los ids de todo lo que apunta y publica la reserva con un commit en `develop` que solo toca el roadmap. Hasta ese commit, los demás worktrees no ven la reserva.
- **Termina diciéndote qué fila va primero** y con qué skill se arranca. No arranca nada: ni rama, ni carpeta, ni spec.

Cuando abres el worktree de esa fila y arrancas `sdd-start-feature` en la rama `feature/<id>-<nombre>`, el agente toma la fila como enunciado. Si la fila dice «`proposal: <id>`», lee también la propuesta: ahí están las reglas y sus ejemplos.

## 3. Hacer: feature o patch

Llega algo, o arrancas una fila, y lo escribes tal cual. El agente elige la puerta por lo que dices:

| Lo que escribes | Por dónde entra |
| --- | --- |
| «Añade el filtro por estado en el listado de pedidos», «es una tontería, hazlo rápido», o `/sdd-start-feature` en la rama de una fila | Feature |
| «El total del carrito no suma el envío cuando hay cupón» | Patch |
| «Apunta en el roadmap lo de la exportación, no lo arranques» | Planificar (sección 2) |
| «¿Por qué las reservas caducan a las 24 h?», «pruébalo rápido» | Consulta |
| «Corrige la errata del botón» | Directo, sin skill: una edición sin comportamiento no abre carril |

Si lo que escribes no dice qué es ni cuánto abarca («hay que mejorar las reservas»), el agente te hace una sola pregunta sobre eso, con su recomendación, y elige la puerta con tu respuesta.

**Patch o feature.** Lo decide quién fija la solución, no los minutos. Un patch es un cambio pequeño cuya solución ya está fijada antes de empezar. Hay tres casos:

- **Un fallo determinista**: la solución la fija la causa raíz. «Es un bug» no lo convierte en patch: lo decide lo que encuentra la investigación. Si el agente no consigue reproducir el fallo, para ahí y te lo cuenta, sin abrir rama ni carpeta.
- **Un ajuste o una retirada solo de presentación**: la solución la fija tu petición.
- **Una petición cerrada**: un ticket o tú decís qué cambia en lo que el usuario ve o puede hacer («que Cancelar lleve al listado», «cambia "Guardar" por "Guardar y cerrar"»).

Si el agente tendría que decidir algo que se ve (qué texto, dónde, con qué regla), es una feature, aunque sea pequeña y aunque pidas un patch: «avisa cuando el total pase de 1.000 €» lo es. Cada decisión del patch queda en `patch.md` con su autor (el ticket, tú, o el agente sin ti), y una decisión visible que el agente tomó sin ti lo pasa a feature. Si el diff pasa de 10 ficheros o de 300 líneas de código, el agente para y te pregunta si sigue como patch.

**Ajuste visual.** Toca plantillas o estilos y nada más: mueve, envuelve o cambia la clase de elementos, sin añadir bindings, eventos, textos, claves de i18n, TypeScript, API, datos ni capacidades. En lugar de la causa raíz, el `patch.md` lleva la intención en una frase, y la verificación es una captura que el agente te enseña al validar.

**Algo grande no se hace de golpe.** Si pides varias cosas a la vez, o una que el agente partiría en varias features, te propondrá pasarla por el roadmap (sección 2) y arrancar después cada feature por separado.

**Una sesión por tarea.** Cada feature o patch empieza en una conversación nueva, en su worktree: el agente vuelve a leer los documentos de anclaje, y el contexto limpio le sale más barato que arrastrar la tarea anterior.

Lo que pasa en una feature, en orden:

1. **La primera pregunta**: confirma carril, modo, perfil y enunciado (sección 4).
2. **La spec**: te la enseña empezando por las decisiones que tomó sin ti, y espera tu aprobación.
3. **El plan y la implementación**: con el perfil por defecto, sin pararte, salvo desvíos. Los tests se escriben antes que el código.
4. **La validación**: te presenta lo hecho con un guion de pruebas y te pregunta qué has probado (sección 5).
5. **El cierre**: walkthrough, changelog, roadmap y merge en `develop` (sección 5).

Un patch es igual, pero más corto: un solo documento (`patch.md` con síntoma, causa, fix y verificación; en un ajuste visual, la intención en lugar de la causa, y en una petición cerrada, la solución fijada con su autor), sin spec ni plan, y su validación al cerrar.

## 4. Qué te pregunta el agente y qué contestar

### La primera pregunta

Al arrancar una feature, el primer mensaje del agente es una sola pregunta que confirma varias cosas a la vez:

- **El carril**: feature, o el que le haya parecido (a veces te propone que sea un patch o una consulta).
- **El modo, lite o full.** Lite es una spec corta y sin plan, para cambios acotados. Solo te lo ofrece si se cumplen todas estas condiciones, y te las cita una a una: el flujo que se toca ya existe y se puede leer, no cambia contratos públicos, no cambia el esquema de datos (una migración solo de datos, idempotente y reversible, no lo descarta, pero la spec la nombra), cabe en un módulo y, si el proyecto estima, la estimación no pasa de media jornada. Lite no se salta ni la aprobación de la spec ni la validación.
- **El perfil de control** (abajo), y de dónde sale: de la feature, de tu `sdd-kit.local.json`, de la release o del proyecto.
- **Partir la feature**, si el agente prevé muchas tasks. Con 3 o menos no lo propone nunca; con más de 5, siempre; con 4 o 5, solo si tocan capacidades o superficies distintas (base de datos, interfaz, API) o llevan migración. Partir crea filas nuevas en el roadmap. Si lo propone, «seguir entera» también es una respuesta válida, y no te lo vuelve a preguntar.
- **Aprobar la spec por delegación**: «apruebo la spec por delegación, nos vemos en la validación». Elígela si te vas a ausentar. El agente aprueba la spec por ti, apunta tu frase y la fecha, y no vuelve a pararte por la spec. El resto de paradas de tu perfil sigue igual.
- **Bajar de modelo**, pegado a la opción anterior: si la sesión va con el modelo más caro y el plan va a tener varias tasks, una variante de la delegación añade parar antes de la primera task para que cambies a Sonnet con effort medium (`/model`). El caro se guarda para la revisión final. Si no delegas la spec, la misma opción te llega al aprobarla (en `delegate`) o al aprobar el plan (en `pair`).

Si una parte no la entiendes (por ejemplo, si te propone partir y no sabes si habla de lo que pediste o de toda la fila del roadmap), pregúntaselo antes de elegir: aclararlo ahí cuesta un mensaje, y corregirlo con la spec escrita cuesta bastante más.

### Los perfiles

| Perfil | Dónde para el agente |
| --- | --- |
| `pair` | En la spec, en el plan, tras cada task (con un guion para probarla), en los desvíos, en la validación y antes del merge |
| `delegate` (el de defecto) | En la spec, en los desvíos y en la validación. El plan lo escribe y sigue sin preguntarte |
| `unattended` | En ningún punto hasta terminar la release. Aprueba él las specs con las decisiones apuntadas, resuelve los desvíos por la opción más conservadora y deja la validación para la release. Conviene con el trabajo bien definido: si una pregunta de la entrevista no tiene respuesta en los documentos del proyecto, aparca la feature y sigue con la siguiente |

En los tres, el merge a `main`, el tag, un push que no sea el de la rama de integración y abrir un PR los decides tú.

El perfil del proyecto está en `sdd-kit.json`. Si quieres otro para ti, díselo a `sdd-config`, y si es para una sola feature, cámbialo en la primera pregunta.

### Aprobar la spec

El agente te enseña la spec empezando por el bloque «Decisiones que he tomado yo — valida estas». Es lo único que necesitas leer para aprobar. La pregunta va sola al final.

Aprueba con «sí», «apruebo» o una opción cuyo texto diga que apruebas. Otras respuestas no cuentan:

- «Sigue», «adelante» u «ok» no están en esa lista, y el agente puede no tomarlas como aprobación. Si quieres aprobar, di «apruebo».
- Elegir un alcance («que solo valide X») o contestar otra pregunta del mismo turno no aprueba la spec.
- Si no contestas, la feature se queda esperando. El agente no la da por aprobada porque tardes.

Si quieres cambios, dilo. El agente corrige la spec y te la vuelve a presentar.

### Desvíos y frenos

Una vez aprobada la spec, el agente vuelve a parar si algo cambiaría lo aprobado: un requisito, un escenario, el alcance. Te propone el cambio como enmienda y espera tu respuesta.

También para en cuatro casos que no cambian la spec, pero conviene que los decidas tú: el tercer arreglo que descubre fuera del plan, una decisión que cambia lo que ve el usuario y la spec no fija, que otra rama haya cambiado en la base la fila de tu feature en el roadmap, o que la base haya cambiado un fichero que va a tocar la task. Estos dos últimos salen mucho en paralelo (sección 7).

Lo demás lo decide él sin pararte (otro orden, un fichero que no pensaba tocar, un arreglo pequeño) y te lo cuenta al final en «Me salí del plan en…».

Mientras espera a un subagente o a un comando largo, el agente vigila que no se haya colgado. Si pasan los minutos de `control.silence` (en `sdd-kit.json`) sin señales, lo para, lo relanza una vez salvo que esté esperando un permiso, y te avisa con el diagnóstico. Un segundo cuelgue ya no se relanza: el agente para o aparca la task.

## 5. Validar y cerrar

### Validar de verdad

El agente lanza la revisión final en segundo plano en cuanto commitea la última task, sobre ese commit, y mientras tanto hace la verificación visual y escribe los borradores del cierre. La validación te llega cuando la revisión vuelve. Si deja una decisión que es tuya (de producto o de alcance), te la pregunta antes, sola, en su propio turno. Después para lo que haya arrancado y te presenta el trabajo, empezando por «Me salí del plan en…», con las decisiones que tomó durante la ejecución. Luego vienen:

- Qué hay.
- El guion de pruebas, que es lo que harás tú: pasos numerados, cada uno con una acción y lo que debería pasar, empezando por cómo arrancar la aplicación. Si prefieres encontrarla ya levantada, pídeselo a `sdd-config` (`validation.startEnvironment`). Si alguna task cambió lo que se ve, antes del guion van las capturas y, si el proyecto declara un detector en `tech-stack.md` §Frontend, su salida en escritorio y en móvil; sin detector, el agente te avisa de que la composición no está medida.
- El smoke, que es lo que ya hizo él: una fila por escenario de la spec, con su evidencia: `suite` (lo cubre un test), `ejecución real` (lo probó en la aplicación) o `no probado`. Lo que se ve en una pantalla, una respuesta o un fichero solo cuenta como verificado con `ejecución real`.

**Validar es decir qué has probado y que funciona**: «he filtrado por Pendiente y Enviado, y el listado cambia bien». Un «sí» a secas también vale, y queda escrito tal cual, con la nota de que no detallaste.

No es validar:

- «Cierra la tarea» o «ciérralo»: es la orden de cerrar. El agente te presentará el trabajo y te preguntará igual.
- «Está implementada», «los tests pasan», «la revisión está limpia»: eso es lo que ha comprobado el agente, no tú.

Si no contestas, la feature se queda en espera con el smoke escrito. No se cierra, no se fusiona y no se marca en el roadmap.

**Validación en campo.** Si el proyecto no tiene una pantalla ni un uso que puedas probar al cerrar, como el propio kit, puede declararlo con `"validation": {"mode": "field"}` en `sdd-kit.json` (`sdd-config` te lo pregunta, y recomienda `manual` salvo en ese caso). Entonces el agente no para a pedirte la validación: hace la misma verificación de siempre (revisión final, smoke por escenario y suite), la registra como «Validación en campo» y cierra; la validación humana llega con el uso, por los tickets de `sdd-feedback`.

### Diferir con disparador

Si no puedes probarlo ahora, puedes diferir. Vale si estás delante con el trabajo presentado, dices que lo probarás más tarde y hay un disparador con dueño: una feature, una release o un uso concreto, y quién lo prueba.

La pregunta de validación ya trae la opción con el disparador relleno, por ejemplo «Diferir: lo pruebo en la primera exportación del informe mensual, a cargo del dev-lead». Elegirla sin escribir nada basta. Si prefieres otro disparador, escríbelo. Un «cuando acabes, lo difieres» dicho a mitad de la implementación no vale: el trabajo todavía no existe.

Con la validación diferida, la feature se cierra y se fusiona, pero su fila del roadmap lleva `🧪 validación diferida a <disparador>` en vez de ✅. Cuando lo pruebes, díselo al agente y la fila pasa a ✅ con una adenda en el walkthrough. En `unattended` no hay pregunta: todo se difiere a la release.

### El cierre

Validado el trabajo (o diferido), el cierre lo hace `sdd-end-feature` de un tirón:

- escribe el `walkthrough.md` con lo que se hizo, cómo se verificó, el tiempo real, el coste de la sesión y las decisiones que tomó sin ti;
- lleva los aprendizajes a los documentos que los guardan y fusiona el comportamiento nuevo en `capabilities/`;
- actualiza el changelog, la fila del roadmap y el registro de estimaciones, si el proyecto los tiene;
- fusiona en `develop` con el script del kit, según la política del bloque `merge` de `sdd-kit.json`, y hace el push si esa política lo permite (si la rama no tiene remoto, fusiona igual y te dice «push: no hecho: sin remoto»). Si el proyecto no tiene el bloque `merge` completo, o tu perfil es `pair`, te pregunta antes de fusionar;
- termina con una línea que dice si está **Terminado** (rama fusionada, push hecho o por qué no, y que puedes borrar el worktree) o **No terminado** y qué falta.

El patch cierra igual, más corto, con `sdd-end-patch`: primero te pide la validación con tres opciones (validado, diferir o no funciona) y después fusiona. Ningún cierre fusiona a `main` ni pone tags: eso es entregar (sección 6).

### El ticket para el kit

Al cerrar, el agente te ofrece escribir un ticket de mejora del kit con `sdd-feedback`: dónde se atascó, qué regla no cubría el caso, qué funcionó. Se escribe en la misma sesión porque al limpiar el contexto se pierde lo aprendido. Queda en `.docs/sdd/kit-feedback/`, sin nombres de cliente, de proyecto ni de personas. Si el cierre fue limpio, el ticket tiene tres líneas; si no, cada propuesta dice si se comprobó.

Si no lo quieres, dile que no. Lo que no conviene es pedir «no generes más tickets» cuando lo que quieres es que el trabajo salga limpio: el agente puede leerlo como «no ofrezcas el ticket» y perderse lo que el kit tenía que aprender de esa sesión. Para que llegue a quien mantiene el kit, abre un issue en su repositorio con el ticket.

## 6. Entregar: cortar la release

Cuando lo cerrado vale una versión, pide «cierra la release» o «prepara la entrega». `sdd-end-release` corta lo hecho, como la rama de release de git-flow. No importa si la release se preparó antes con `sdd-roadmap` o si has ido cerrando features sueltas: el corte es el mismo, en cinco pasos.

1. **Alcance y versión.** Te propone qué entra y qué pasa a la siguiente, y la versión. La confirmas tú. Si el proyecto no tiene decidido si la release se entrega a alguien distinto de quien la hace (`release.hasRecipient`), te lo pregunta una vez. Si hay registro de estimaciones, te ofrece la retro en una línea: solo se hace si la pides.
2. **Changelog sellado.** `[Unreleased]` pasa a `[X.Y.Z] - fecha`.
3. **Notas de la versión y email**, solo si hay destinatario. Van en `.docs/sdd/releases/vX.Y.Z/`, destiladas del changelog y contadas por lo que gana quien la usa, sin ids ni jerga. El email es un borrador: lo envías tú.
4. **Roadmap colapsado.** Antes de tocarlo pasa el validador del roadmap: si una sección no es de la plantilla (por ejemplo, una «Versión siguiente» con el trabajo de la release), no corta desde ella; te lo dice y te propone ordenarlo con la migración, que espera tu visto bueno. Antes de resumir la sección de la release, rescata lo que sigue vivo. Si hay features con la validación diferida a esta release, o a esta release desde una anterior, te pregunta qué probaste: las que nombras quedan validadas; las que no, ganan un disparador nuevo y su id pasa a la línea `validaciones pendientes:` del resumen de la release. Lo publicado sale de las tablas, y el corte no sigue hasta que el validador dice `Roadmap válido`.
5. **Versión, merge y tag.** Sube la versión, deja la rama lista y te presenta el merge a `main`, el tag y el push. Esperan tu «sí». Después fusiona `main` de vuelta en `develop`.

El feedback de una demo o una reunión no se procesa en el corte: eso es planificar (sección 2).

## 7. Trabajo en paralelo y problemas típicos

### Varias tareas a la vez

**Un worktree por feature o por patch.** Cada tarea en su carpeta y su rama, `feature/<id>-<nombre>`, sacada de `develop`. Así dos sesiones no se pisan los ficheros.

**Los ids se reservan, no se calculan a ojo.** En un proyecto con secuencia propia, el id sale de la fila del roadmap o, si no tiene fila, de `Get-NextSddId.ps1 -Reserve`. Lo hace el agente. Sin `-Reserve` el script solo propone un número, y otro worktree que calcule a la vez se llevaría el mismo.

**La rama tiene que llevar su id.** Si abres el worktree con una rama sin id (`feature/filtro-pedidos`) y sin commits, el agente la renombra a `feature/<id>-filtro-pedidos` antes del primer commit y te lo dice. Si la rama trae un número que no es el suyo, díselo antes de empezar.

**No trabajes sobre `develop`.** Si `develop` no está sacada en ningún worktree, el merge del cierre se hace en uno temporal, `merge-<id>`, que el script crea y borra; si está sacada en un worktree limpio, fusiona ahí. Si la tienes sacada con cambios sin commitear, el merge se para con `destino sacado:` y la lista de ficheros, y no los toca.

**Cuando la base se mueve.** Antes de cada task, el agente mira si `develop` ha cambiado la fila de tu feature o algún fichero que la task va a tocar. Si pasa, para y te lo enseña con los commits que lo cambiaron. Si el solapamiento era el previsto, díselo y sigue.

**Conflictos en los registros.** `changelog.md`, `roadmap.md` y `estimation-log.md` los tocan todas las features, y chocan a menudo al fusionar. El script del merge los resuelve solo, sin soltar su turno: cuando cada lado solo añade filas o líneas nuevas, entran todas, y el `estimation-log.md` se regenera. Así varias sesiones pueden cerrar a la vez. Si los dos lados cambiaron la misma línea, o el conflicto está en otro fichero, para y te lo deja a ti.

### Uso otra carpeta de configuración (`CLAUDE_CONFIG_DIR`)

Si arrancas Claude Code con `CLAUDE_CONFIG_DIR` apuntando a otra carpeta (por ejemplo, una por cuenta), esa carpeta tiene sus propios plugins. El kit y superpowers tienen que estar instalados en la configuración con la que abres la sesión, no solo en `~/.claude`. Fija también ahí `model` en `settings.json`: sin él, una sesión puede arrancar en el modelo más caro.

Al medir los tokens de la sesión en el cierre, el script busca los transcripts en `CLAUDE_CONFIG_DIR`, en `~/.claude` y en cualquier `~/.claude-*`. Si aun así el walkthrough sale con «no medido», pídele al agente que lo repita pasando `-ProjectsRoot <tu carpeta de configuración>/projects`.

### Las skills no cargan, o llegan viejas

- **El kit aparece deshabilitado**: falta superpowers o su marketplace. Añade `obra/superpowers-marketplace` antes que el del kit y reinstala (pasos en el [README](../../README.md#instalación)). Si tenías `superpowers@claude-plugins-official`, desinstálalo: con los dos, las skills salen duplicadas.
- **El agente no entra por el carril que toca**: `using-sdd` la inyecta un hook al empezar la sesión, solo si el proyecto tiene `.docs/sdd/`. Si instalaste las skills con `npx skills add`, no hay hook: nombra la skill en la petición («con `sdd-start-feature`, añade…»).
- **Tras actualizar el kit, el agente sigue con la versión anterior** o nombra una skill que ya no existe (la 2.0.0 renombró las skills de «task» a «feature»): una sesión sirve las skills con el texto que tenían al arrancar. Actualiza con `/plugin marketplace update`, abre una sesión nueva y, si el proyecto viene de una versión anterior, pide «ponme el proyecto al día con `sdd-init-brownfield`». Desde la 2.2.0, el arranque de la sesión te avisa de los dos casos: si el kit cargado es más viejo que el del proyecto, con el comando para actualizarlo, y si el proyecto tiene migraciones pendientes, con esa misma frase.

### El merge del cierre falla

El merge lo hace un script, y su mensaje empieza por el paso que falló. La rama `develop` queda como estaba antes: no se fusiona ni se publica nada a medias.

| Empieza por | Qué pasa | Qué haces |
| --- | --- | --- |
| `merge: conflicto en` solo `changelog.md`, `roadmap.md` o `estimation-log.md` | Los dos lados cambiaron la misma línea de un registro (las filas nuevas ya las une el script) | Decide con el agente cómo combinar esa línea |
| `merge: conflicto en` otro fichero | Dos features tocaron lo mismo | Lo resuelves tú o decides con el agente |
| `push:` o `base:` | Otra sesión publicó mientras tanto | Nada: el agente relanza una vez, desde el remoto nuevo |
| `destino sacado:` con una lista de ficheros | `develop` está sacada con cambios sin commitear | Commitea o descarta esos cambios donde estén, y pide el merge otra vez |
| `destino sacado: ya existe '…merge-<id>'` | Quedó la carpeta de un merge anterior, con contenido o todavía registrada como worktree | Mira qué hay dentro antes de borrarla. Si está vacía y no es un worktree, el script ya la borra solo |
| `verificación:` | Los tests fallan sobre el resultado del merge | Es un fallo real: se arregla antes de volver a fusionar |
| `cerrojo:` | Otra sesión lleva mucho rato fusionando | Espera a que acabe o mira qué sesión es |
| `política:` | Falta `sdd-kit.json`, o a su bloque `merge` le falta `into` o `noFf` | Complétalo con `sdd-config` y pide el merge otra vez |

En ningún caso el agente rehace el merge a mano con `git merge`, `git pull` o `git push`, ni usa `--force`. Si un permiso de tu entorno le deniega el merge, no lo reintenta: te da el comando exacto y el texto de la denegación para que lo lances tú.

---

*Esta guía describe el kit tal como funciona en la versión indicada; cuando una release cambia un carril, una pregunta o una regla que aquí se cuenta, se actualiza en el mismo cierre. Última revisión: kit v2.3.0, octubre de 2026.*
