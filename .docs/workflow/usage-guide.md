# Guía de uso del kit SDD

Esta guía es para ti si tienes el kit instalado en tu proyecto y quieres saber cómo se trabaja con él día a día: qué le pides al agente, qué te va a preguntar, qué le contestas y qué queda escrito al final. No explica cómo está hecho el kit por dentro.

Para el porqué del flujo y sus fases, están los otros documentos: [proyectos nuevos](greenfield.md), [codebases existentes](brownfield.md) y el [anexo de evidencia](evidence-and-references.md). Aquí se enlazan en vez de repetirse.

## 1. La idea en una página

Le pides las cosas al agente en lenguaje normal. Al empezar cada sesión, el kit le inyecta la skill `using-sdd`, que decide por qué carril entra lo que escribes, así que no hace falta nombrar ninguna skill.

Hay cuatro carriles de trabajo y dos ayudas:

| Carril | Para qué | Qué deja y dónde |
| --- | --- | --- |
| Consulta (`sdd-consult`) | Preguntar, entender, probar si algo se puede hacer | Nada: la respuesta se queda en la conversación. Si hay que cambiar un documento, te lo propone y espera tu sí |
| Patch (`sdd-start-patch`, `sdd-end-patch`) | Un fallo pequeño y reproducible | `.docs/sdd/specs/<fecha>-patch-<id>-<nombre>/patch.md` con el síntoma, la causa, el fix y cómo se verificó. En git, dos commits: el fix y el cierre |
| Feature (`sdd-start-feature`, `sdd-end-feature`) | Cualquier cambio con comportamiento, aunque sea pequeño | `.docs/sdd/specs/<fecha>-feature-<id>-<nombre>/` con `spec.md`, `plan.md`, `tasks.md` si hay varias tasks y `walkthrough.md`. Lo que cambia del producto se fusiona en `.docs/sdd/capabilities/` |
| Release (`sdd-end-release`) | Cortar una versión con lo que ya está cerrado | El changelog sellado, las notas para quien recibe la entrega en `.docs/sdd/releases/vX.Y.Z/` (si hay destinatario) y el roadmap colapsado. El merge a `main` y el tag los confirmas tú |

- **Planificar sin hacer** (`sdd-roadmap`): apunta trabajo en el roadmap, parte lo grande en features, procesa las notas de una reunión o prepara la siguiente release. No arranca nada; al acabar te dice qué fila va primero.
- **Cómo quieres trabajar tú** (`sdd-config`): tus preferencias van a `.docs/sdd/sdd-kit.local.json`, que no va a git. Las del equipo, a `.docs/sdd/sdd-kit.json`.

Casi todo lo del kit acaba en `.docs/sdd/`. Los documentos de anclaje (mission, constitution, tech-stack, architecture, capabilities, roadmap) los lee el agente al arrancar cada tarea; qué es cada uno lo cuenta [greenfield](greenfield.md#11-documentación-de-anclaje).

## 2. Un día normal

Llega algo y lo escribes tal cual. El agente elige la puerta por lo que dices:

| Lo que escribes | Por dónde entra |
| --- | --- |
| «¿Por qué las reservas caducan a las 24 h?», «¿se puede exportar a CSV?», «pruébalo rápido» | Consulta |
| «El total del carrito no suma el envío cuando hay cupón» | Patch |
| «Añade el filtro por estado en el listado de pedidos», «es una tontería, hazlo rápido» | Feature |
| «Apunta en el roadmap lo de la exportación, no lo arranques», las notas de la reunión de ayer, «reordena: la 0014 va tras la 0012» | Planificar |
| «Cierra la release», «prepara la entrega» | Release |
| «Me paras mucho», «quiero trabajar en pair solo yo» | Configuración |
| «Corrige la errata del botón» | Directo, sin skill: una edición sin comportamiento no abre carril |

Si lo que escribes no dice qué es ni cuánto abarca («hay que mejorar las reservas»), el agente te hace una sola pregunta sobre eso, con su recomendación, y elige la puerta con tu respuesta.

**Patch o feature.** Un patch es un fallo determinista, de menos de media hora y sin nada que interpretar: se sabe qué debería pasar y no pasa. En cuanto el arreglo exige decidir cómo debería comportarse algo, o toca varios sitios, es una feature, y el agente cambia de carril y te lo dice. «Es un bug» no lo convierte en patch: lo decide lo que encuentra la investigación. Si el agente no consigue reproducir el fallo, para ahí y te lo cuenta, sin abrir rama ni carpeta.

**Algo grande.** Si pides varias cosas a la vez, o una que el agente partiría en varias features, lo mejor es pasarlo por el roadmap: «organízalo para el equipo». `sdd-roadmap` te entrevista, escribe la propuesta y deja las filas con su id y su orden. Después arrancas cada una por separado.

**Una sesión por tarea.** Cada feature o patch empieza en una conversación nueva: el agente vuelve a leer los documentos de anclaje, y el contexto limpio le sale más barato que arrastrar la tarea anterior.

## 3. Qué te pregunta el agente y qué contestar

### La primera pregunta

Al arrancar una feature, el primer mensaje del agente es una sola pregunta que confirma varias cosas a la vez:

- **El carril**: feature, o el que le haya parecido (a veces te propone que sea un patch o una consulta).
- **El modo, lite o full.** Lite es una spec corta y sin plan, para cambios acotados. Solo te lo ofrece si se cumplen todas estas condiciones, y te las cita una a una: el flujo que se toca ya existe y se puede leer, no cambia contratos públicos, no toca el esquema de datos ni exige migración, cabe en un módulo y, si el proyecto estima, la estimación no pasa de media jornada. Lite no se salta ni la aprobación de la spec ni la validación.
- **El perfil de control** (abajo), y de dónde sale: de la feature, de tu `sdd-kit.local.json`, de la release o del proyecto.
- **Partir la feature**, si el agente prevé muchas tasks. Con 3 o menos no lo propone nunca; con más de 5, siempre; con 4 o 5, solo si tocan superficies distintas (base de datos, interfaz, API) o llevan migración. Si lo propone, «seguir entera» también es una respuesta válida, y no te lo vuelve a preguntar.
- **Aprobar la spec por delegación**: «apruebo la spec por delegación, nos vemos en la validación». Elígela si te vas a ausentar. El agente aprueba la spec por ti, apunta tu frase y la fecha, y ya no para hasta la validación, salvo un desvío.
- **Bajar de modelo**: si la sesión va con el modelo más caro y el plan va a tener varias tasks, te ofrece parar antes de la primera para que cambies a Sonnet con effort medium (`/model`). En ejecución Native la sesión hace todas las tasks, y el modelo medio basta; el caro se guarda para la revisión final.

Si en tu petición ya dijiste «decide tú el método», la pregunta llega igual. Contéstala en un clic, con la opción de delegar la spec.

Si una parte no la entiendes (por ejemplo, si te propone partir y no sabes si habla de lo que pediste o de toda la fila del roadmap), pregúntaselo antes de elegir: aclararlo ahí cuesta un mensaje, y corregirlo con la spec escrita cuesta bastante más.

### Los perfiles

| Perfil | Dónde para el agente |
| --- | --- |
| `pair` | En la spec, en el plan, tras cada task (con un guion para probarla), en los desvíos, en la validación y antes del merge |
| `delegate` (el de defecto) | En la spec, en los desvíos y en la validación. El plan lo escribe y sigue sin preguntarte |
| `unattended` | En ningún punto hasta terminar la release. Aprueba él las specs con las decisiones apuntadas, resuelve los desvíos por la opción más conservadora y deja la validación para un único smoke de la release. Solo vale con el trabajo bien definido en el roadmap |

En los tres, el merge a `main`, el tag, un push que no sea el de la rama de integración y abrir un PR los decides tú.

El perfil del proyecto está en `sdd-kit.json`. Si quieres otro para ti, díselo a `sdd-config` («quiero trabajar en pair solo yo»), y si es para una sola feature, cámbialo en la primera pregunta.

### Aprobar la spec

El agente te enseña la spec empezando por el bloque «Decisiones que he tomado yo — valida estas». Es lo único que necesitas leer para aprobar. La pregunta va sola al final.

Aprueba con «sí», «apruebo» o una opción cuyo texto diga que apruebas. Otras respuestas no cuentan:

- «Sigue», «adelante» u «ok» no están en esa lista, y el agente puede no tomarlas como aprobación. Si quieres aprobar, di «apruebo».
- Elegir un alcance («que solo valide X») o contestar otra pregunta del mismo turno no aprueba la spec.
- Si no contestas, la feature se queda esperando. El agente no la da por aprobada porque tardes.

Si quieres cambios, dilo. El agente corrige la spec y te la vuelve a presentar.

### Desvíos y frenos

Una vez aprobada la spec, el agente vuelve a parar si algo cambiaría lo aprobado: un requisito, un escenario, el alcance. Te propone el cambio como enmienda y espera tu respuesta.

También para en cuatro casos que no cambian la spec, pero conviene que los decidas tú: el tercer arreglo que descubre fuera del plan, una decisión que cambia lo que ve el usuario y la spec no fija, que otra rama haya cambiado en la base la fila de tu feature en el roadmap, o que la base haya cambiado un fichero que va a tocar la task. Estos dos últimos salen mucho en paralelo (sección 5).

Lo demás lo decide él sin pararte (otro orden, un fichero que no pensaba tocar, un arreglo pequeño) y te lo cuenta al final en «Me salí del plan en…».

## 4. Validar de verdad

Cuando termina, el agente para lo que haya arrancado y te presenta el trabajo en este orden:

1. «Me salí del plan en…», con las decisiones que tomó durante la ejecución.
2. Qué hay.
3. El smoke: una fila por escenario de la spec, con su evidencia: `suite` (lo cubre un test), `ejecución real` (lo probó en la aplicación) o `no probado`. Lo que se ve en una pantalla, una respuesta o un fichero solo cuenta como verificado con `ejecución real`.
4. El guion de pruebas, que es lo que harás tú: pasos numerados, cada uno con una acción y lo que debería pasar, empezando por cómo arrancar la aplicación. Si prefieres encontrarla ya levantada, pídeselo a `sdd-config` (`validation.startEnvironment`).

**Validar es decir qué has probado y que funciona**: «he filtrado por Pendiente y Enviado, y el listado cambia bien». Un «sí» a secas a esa pregunta también vale, y queda escrito tal cual, con la nota de que no detallaste.

No es validar:

- «Cierra la tarea» o «ciérralo»: es la orden de cerrar. El agente te presentará el trabajo y te preguntará igual.
- «Está implementada», «los tests pasan», «la revisión está limpia»: eso es lo que ha comprobado el agente, no tú.

Si no contestas, la feature se queda en espera con el smoke escrito. No se cierra, no se fusiona y no se marca en el roadmap.

### Diferir con disparador

Si no puedes probarlo ahora, puedes diferir. Vale si se cumplen tres cosas a la vez:

1. Estás delante y tienes el trabajo presentado.
2. Dices que lo probarás más tarde.
3. Hay un disparador con dueño: una feature, una release o un uso concreto, y quién lo prueba.

La pregunta de validación ya trae la opción con el disparador relleno, por ejemplo «Diferir: lo pruebo en la primera exportación del informe mensual, a cargo del dev-lead». Elegirla sin escribir nada basta: es tu frase y es el disparador. Si prefieres otro, escríbelo.

Díselo cuando te pregunte, con el trabajo delante. Un «cuando acabes, lo difieres» dicho a mitad de la implementación no cumple la primera condición: el trabajo todavía no existe.

Con la validación diferida, la feature se cierra y se fusiona, pero su fila del roadmap lleva `🧪 validación diferida a <disparador>` en vez de ✅. Cuando lo pruebes, díselo al agente y la fila pasa a ✅ con una adenda en el walkthrough. Las que siguen en 🧪 al cortar la release se validan en su smoke.

En `unattended` no hay pregunta: todo se difiere al smoke de la release.

## 5. Trabajo en paralelo

**Un worktree por feature o por patch.** Cada tarea en su carpeta y su rama, `feature/<id>-<nombre>`, sacada de `develop`. Así dos sesiones no se pisan los ficheros.

**Los ids se reservan, no se calculan a ojo.** En un proyecto con secuencia propia (`ids.mode: sequence`), el id sale de la fila del roadmap o, si no tiene fila, de `Get-NextSddId.ps1 -Reserve`. Lo hace el agente. Sin `-Reserve` el script solo propone un número, y otro worktree que calcule a la vez se llevaría el mismo. `sdd-roadmap` reserva de una vez los ids de todo lo que apunta.

**La rama tiene que llevar su id.** Si abres el worktree con una rama sin id (`feature/filtro-pedidos`) y sin commits, el agente la renombra a `feature/<id>-filtro-pedidos` antes del primer commit y te lo dice. Si la rama trae un número que no es el suyo (por ejemplo, el de otra feature ya cerrada), díselo antes de empezar. La regla de renombrado solo cubre la rama sin id, y un número ajeno en la rama confunde a cualquiera que lea el historial.

**`develop` no se trabaja en ningún worktree.** El merge del cierre se hace en un worktree temporal `merge-<id>` que el script crea y borra. Si tienes `develop` sacada en algún sitio con cambios sin commitear, el merge se para con `destino sacado:` y la lista de ficheros, y no los toca: son tuyos o de otra sesión.

**Cuando la base se mueve.** Antes de cada task, el agente mira si `develop` ha cambiado la fila de tu feature o algún fichero que la task va a tocar. Si pasa, para y te lo enseña con los commits que lo cambiaron. Para aunque tú ya supieras que otra feature tocaba el mismo fichero: el freno compara ficheros, no partes de un fichero. Si el solapamiento era el previsto, díselo y sigue.

**Conflictos en los registros.** `changelog.md`, `roadmap.md` y `estimation-log.md` los tocan todas las features, y chocan a menudo al fusionar. El agente los resuelve solo: en el changelog y el roadmap, cada línea se queda con el cambio de su lado y las filas nuevas entran todas; el `estimation-log.md` no se edita, se regenera. Después relanza el merge una vez. Si los dos lados tocaron la misma línea, o el conflicto está en cualquier otro fichero, para y te lo deja a ti.

## 6. Cerrar y el ticket para el kit

Validado el trabajo (o diferido), el cierre lo hace `sdd-end-feature` de un tirón:

- escribe el `walkthrough.md` con lo que se hizo, cómo se verificó, el tiempo real y las decisiones que tomó sin ti;
- lleva los aprendizajes a los documentos que los guardan y fusiona el comportamiento nuevo en `capabilities/`;
- actualiza el changelog, el roadmap y el registro de estimaciones, si el proyecto los tiene;
- fusiona en `develop` con el script del kit, según la política del bloque `merge` de `sdd-kit.json`, y hace el push si esa política lo permite;
- termina con una línea que dice si está **Terminado** (rama fusionada, push hecho o por qué no, y que puedes borrar el worktree) o **No terminado** y qué falta.

El patch cierra igual, más corto, con `sdd-end-patch`: primero te pide la validación con tres opciones (validado, diferir o no funciona) y después fusiona.

En ningún carril fusiona a `main` ni pone tags: eso se hace al cortar la release, y lo confirmas tú.

### El ticket para el kit

Al cerrar, el agente te ofrece escribir un ticket de mejora del kit con `sdd-feedback`: dónde se atascó, qué regla no cubría el caso, qué funcionó. Se escribe en la misma sesión porque al limpiar el contexto se pierde lo aprendido. Queda en `.docs/sdd/kit-feedback/`, sin nombres de cliente, de proyecto ni de personas.

Si no lo quieres, dile que no. Lo que no conviene es pedir «no generes más tickets» cuando lo que quieres es que el trabajo salga limpio: el agente puede leerlo como «no ofrezcas el ticket» y perderse lo que el kit tenía que aprender de esa sesión. Si el ticket sale sin hallazgos, también sirve.

Para que llegue a quien mantiene el kit, abre un issue en su repositorio con el ticket.

## 7. Problemas típicos

### Uso otra carpeta de configuración (`CLAUDE_CONFIG_DIR`)

Si arrancas Claude Code con `CLAUDE_CONFIG_DIR` apuntando a otra carpeta (por ejemplo, una por cuenta), esa carpeta tiene sus propios plugins. El kit y superpowers tienen que estar instalados en la configuración con la que abres la sesión, no solo en `~/.claude`.

Al medir los tokens de la sesión en el cierre, el script busca los transcripts en `CLAUDE_CONFIG_DIR`, en `~/.claude` y en cualquier `~/.claude-*`. Si aun así el walkthrough sale con «no medido», pídele al agente que lo repita pasando `-ProjectsRoot <tu carpeta de configuración>/projects`.

### Las skills no cargan, o llegan viejas

- **El kit aparece deshabilitado**: falta superpowers o su marketplace. Añade `obra/superpowers-marketplace` antes que el del kit y reinstala (pasos en el [README](../../README.md#instalación)). Si tenías `superpowers@claude-plugins-official`, desinstálalo: con los dos, las skills salen duplicadas.
- **El agente no entra por el carril que toca**: `using-sdd` la inyecta un hook al empezar la sesión, solo si el proyecto tiene `.docs/sdd/`. Si instalaste las skills con `npx skills add`, no hay hook: el agente se guía solo por las descripciones de las skills. Nombra la skill en la petición («con `sdd-start-feature`, añade…»).
- **Tras actualizar el kit, el agente sigue con la versión anterior** o nombra una skill que ya no existe (la 2.0.0 renombró las skills de «task» a «feature»): una sesión sirve las skills con el texto que tenían al arrancar. Actualiza con `/plugin marketplace update`, abre una sesión nueva y, si el proyecto viene de una versión anterior, pide «ponme el proyecto al día con `sdd-init-brownfield`», que aplica las migraciones.

### El merge del cierre falla

El merge lo hace un script, y su mensaje empieza por el paso que falló. La rama `develop` queda como estaba antes: no se fusiona ni se publica nada a medias.

| Empieza por | Qué pasa | Qué haces |
| --- | --- | --- |
| `merge: conflicto en` solo `changelog.md`, `roadmap.md` o `estimation-log.md` | Otra feature fusionó antes | Nada: el agente sincroniza y relanza una vez (sección 5) |
| `merge: conflicto en` otro fichero | Dos features tocaron lo mismo | Lo resuelves tú o decides con el agente |
| `push:` o `base:` | Otra sesión publicó mientras tanto | Nada: el agente relanza una vez, desde el remoto nuevo |
| `destino sacado:` con una lista de ficheros | `develop` está sacada con cambios sin commitear | Commitea o descarta esos cambios donde estén, y pide el merge otra vez |
| `destino sacado: ya existe '…merge-<id>'` | Quedó la carpeta de un merge anterior, con contenido o todavía registrada como worktree | Mira qué hay dentro antes de borrarla. Si está vacía y no es un worktree, el script ya la borra solo |
| `verificación:` | Los tests fallan sobre el resultado del merge | Es un fallo real: se arregla antes de volver a fusionar |
| `cerrojo:` | Otra sesión lleva mucho rato fusionando | Espera a que acabe o mira qué sesión es |

En ningún caso el agente rehace el merge a mano con `git merge`, `git pull` o `git push`, ni usa `--force`. Si un permiso de tu entorno le deniega el merge, no lo reintenta: te da el comando exacto y el texto de la denegación para que lo lances tú.

---

*Esta guía describe el kit tal como funciona en la versión indicada; cuando una release cambia un carril, una pregunta o una regla que aquí se cuenta, se actualiza en el mismo cierre. Última revisión: kit v2.0.0, septiembre de 2026.*
