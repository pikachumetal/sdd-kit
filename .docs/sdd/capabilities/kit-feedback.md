# Capacidad — kit-feedback

Verdad viva del ticket de mejora del kit: lo que un proyecto consumidor escribe sobre el comportamiento del kit al terminar una sesión de trabajo, para el agente que mantiene el kit. Esta capacidad la declaró la spec de la task 0002 en sus «Decisiones que he tomado yo» (decisión 2).

## Requisitos

### El ticket de mejora del kit vive en `.docs/sdd/kit-feedback/`
- GIVEN un proyecto con `.docs/sdd/`
- WHEN `sdd-feedback` genera un ticket
- THEN lo escribe en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md`, con el timestamp en UTC y el id del modo declarado en `sdd-kit.json`, calcado de `kit-feedback-template.md` del skill `sdd-templates`
- AND si la carpeta no existe la crea y avisa una sola vez de que puede ignorarse en git; no edita `.gitignore`

### El ticket se escribe para un agente, no para una persona
- GIVEN una sesión que acaba de ejecutar una task o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta y un criterio de aceptación en forma de escenario
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

### «Sin hallazgos» es una salida válida
- GIVEN una sesión sin fricción atribuible al kit
- WHEN se invoca `sdd-feedback`
- THEN el ticket se escribe igualmente, con «Sin hallazgos» y la sección de lo que funcionó, y no se inventa ninguna fricción para rellenar

### El ticket no lleva el dominio del cliente
- GIVEN un proyecto de cliente
- WHEN se redacta cualquier parte del ticket
- THEN describe el comportamiento del kit sin nombres de cliente, proyecto, producto ni personas, y sin código ni reglas de negocio del dominio
- AND si un hallazgo no se entiende sin un dato del dominio, el dato se sustituye por un descriptor genérico; el hallazgo nunca se omite por privacidad

### El hallazgo separa el hueco del kit del error del ejecutor
- GIVEN un fallo observado durante la sesión
- WHEN se clasifica en el ticket
- THEN va a los hallazgos del kit solo si una regla escrita del kit lo habría evitado; si fue un error del ejecutor, va a su sección propia y no propone cambiar el kit
- AND lo que el agente hizo por iniciativa propia sin que el kit lo pidiera va en su sección, porque es candidato a regla nueva

### El cierre de una task y el de un patch ofrecen el ticket en la misma sesión
- GIVEN un cierre por `sdd-end-task` o `sdd-end-patch` con el resto del checklist terminado
- WHEN el agente da el cierre por cerrado
- THEN ofrece generar el ticket con `sdd-feedback` en esa misma sesión, diciendo que al limpiar el contexto ese conocimiento se pierde
- AND la oferta no es un gate: sin respuesta, el cierre termina y no deja nada pendiente ni anotado en ningún artefacto
- AND si la sesión ya generó su ticket, la oferta no se repite: la skill amplía el ticket existente en vez de crear otro

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/kit-feedback/` en el proyecto consumidor; su destino final en el repo del kit es `.docs/sdd/field-reports/`.
- **Idioma de los nombres**: nombre de fichero en kebab-case, con el slug en la misma convención que las carpetas de spec del proyecto; el contenido del ticket en castellano.
- **Límites**: un ticket por sesión de carril; los hallazgos van ordenados por coste observado.
- **Avisos**: al crear la carpeta por primera vez, la skill avisa de que puede ignorarse en git.
- **Regla ante conflicto**: entre contar el hallazgo y proteger el dominio del cliente manda la privacidad — el hallazgo se despersonaliza, nunca se omite.
