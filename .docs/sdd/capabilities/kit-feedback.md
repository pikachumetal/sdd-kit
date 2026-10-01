# Capacidad — kit-feedback

## Propósito

El ticket de mejora del kit: lo que un proyecto consumidor escribe sobre el comportamiento del kit al terminar una sesión de trabajo, para el agente que mantiene el kit.

## Requisitos

### El ticket de mejora del kit vive en `.docs/sdd/kit-feedback/`
- GIVEN un proyecto con `.docs/sdd/`
- WHEN `sdd-feedback` genera un ticket
- THEN lo escribe en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>.md`, con el timestamp en UTC y el id del modo declarado en `sdd-kit.json`, calcado de `kit-feedback-template.md` del skill `sdd-templates`
- AND si la carpeta no existe la crea y avisa una sola vez de que puede ignorarse en git; no edita `.gitignore`
- AND si ya existe el ticket de esa misma feature o patch lo amplía; si la sesión ya escribió el de la feature A y ahora genera el de la B, nace `<ts>-feature-B-<slug>.md` y el de A no cambia

### El ticket se escribe para un agente, no para una persona
- GIVEN una sesión que acaba de ejecutar una feature o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta, la línea «Verificada» con `sí — <cómo>` o `sin verificar`, y un criterio de aceptación en forma de escenario
- AND si el hallazgo cita un fallo de ejecución, «Qué pasó» da el comando exacto, el shell y la línea de error: «`./scripts/check-docs.sh` en PowerShell → `The term './scripts/check-docs.sh' is not recognized`»
- AND una causa de coste cita la spec, el walkthrough o el commit que la respalda; con solo una frase del dev-lead, el coste da la cifra y marca la causa «sin respaldo»
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

### «Sin hallazgos» es una salida válida
- GIVEN una sesión sin ningún hallazgo por encima del umbral de menores y con el coste en reloj dentro del techo de la estimación
- WHEN se invoca `sdd-feedback`
- THEN el ticket es el mínimo: la cabecera y tres líneas (contexto · coste frente a la estimación · «Nada que reportar» o lo hecho por iniciativa propia), sin las demás secciones, y no se inventa ninguna fricción para rellenar
- AND si hubo menores, van debajo en su lista

### El ticket no lleva el dominio del cliente
- GIVEN un proyecto de cliente
- WHEN se redacta cualquier parte del ticket
- THEN describe el comportamiento del kit sin nombres de cliente, proyecto, producto ni personas, y sin código ni reglas de negocio del dominio
- AND si un hallazgo no se entiende sin un dato del dominio, el dato se sustituye por un descriptor genérico; el hallazgo nunca se omite por privacidad

### El hallazgo separa el hueco del kit del error del ejecutor
- GIVEN un fallo observado durante la sesión
- WHEN se clasifica en el ticket
- THEN si una regla, un paso o una plantilla del kit lo pudo evitar, es un hallazgo con su ruta del kit; si no —un error del agente que ninguna regla evitaría, o un fallo del harness o del shell sin relación con el kit—, no va al ticket
- AND lo que el agente hizo por iniciativa propia sin que el kit lo pidiera va en su sección, porque es candidato a regla nueva

### Lo de coste bajo va en una lista de menores
- GIVEN una fricción de menos de ~10 min que no se repitió en la sesión
- WHEN se redacta el ticket
- THEN va en la sección final «Menores», en una línea con qué pasó y la ruta del kit, sin criterio de aceptación
- AND si se repitió o costó más, es un hallazgo con todas sus líneas

### El ticket pasa el lint de docs del proyecto antes del commit
- GIVEN un proyecto que declara un lint de documentación (en `tech-stack.md`, su gate de docs o su pre-commit), por ejemplo markdownlint con MD013 a 200 caracteres
- WHEN `sdd-feedback` guarda el ticket
- THEN ejecuta ese lint sobre el ticket y lo arregla hasta que pasa, antes de que el cierre lo commitee
- AND sin lint de docs declarado, lo dice en una línea al entregar el ticket

### El cierre de una feature y el de un patch ofrecen el ticket en la misma sesión
- GIVEN un cierre por `sdd-end-feature` o `sdd-end-patch` con el resto del checklist terminado
- WHEN el agente da el cierre por cerrado
- THEN ofrece generar el ticket con `sdd-feedback` en esa misma sesión, diciendo que al limpiar el contexto ese conocimiento se pierde
- AND la oferta no es un gate: sin respuesta, el cierre termina y no deja nada pendiente ni anotado en ningún artefacto
- AND si esa feature o ese patch ya tiene su ticket, la oferta no se repite; si la sesión generó el de otra feature, la oferta se hace igual

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/kit-feedback/` en el proyecto consumidor; su destino final en el repo del kit es `.docs/sdd/field-reports/`.
- **Idioma de los nombres**: nombre de fichero en kebab-case, con el slug en la misma convención que las carpetas de spec del proyecto; el contenido del ticket en castellano.
- **Límites**: un ticket por feature o patch; los hallazgos van ordenados por coste observado y los menores, en una línea cada uno al final.
- **Avisos**: al crear la carpeta por primera vez, la skill avisa de que puede ignorarse en git.
- **Regla ante conflicto**: entre contar el hallazgo y proteger el dominio del cliente manda la privacidad — el hallazgo se despersonaliza, nunca se omite.
