---
id: 20260920-220741-task-0002-sdd-feedback
task: 0002
title: Skill sdd-feedback — el ticket de mejora del kit lo genera el cierre
mode: full
status: approved
created: 2026-09-21
author: Claude (Opus 5) con Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Skill `sdd-feedback`

## Decisiones que he tomado yo — valida estas

1. **Review de spec propuesta: 1 revisor, lente dominio** — señales contadas: capacidad nueva (`kit-feedback`), contrato público (el formato del ticket lo consume un glob y viaja al repo del kit) y regla de visibilidad (privacidad: qué **no** puede contener el ticket en un proyecto de cliente). Tres señales ⇒ un revisor; la lente es dominio porque lo que pesa es la capacidad nueva y la regla de qué se oculta, no un contrato técnico.
2. **Capacidad nueva `kit-feedback`** en `capabilities/` — todo el delta vive ahí, incluida la oferta que hacen los cierres. No toco `task-flow.md`: es fichero caliente de otras cinco tasks de la release y el comportamiento nuevo es de un sustantivo propio.
3. **El fichero del ticket se llama `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md`**: el naming que fija el Art. IV para los artefactos de `.docs/sdd/`, con el id del modo declarado en `sdd-kit.json`. Los `field-reports/` del kit usan el mismo patrón sin hora; el ticket se cosecha con un glob igual y así no hace falta tocar el Art. IV.
4. **La skill no toca `.gitignore`** — ignorar la carpeta es decisión del proyecto. La skill lo dice una vez, cuando crea la carpeta por primera vez.
5. **El cierre ofrece, no obliga** — paso final en `sdd-end-task` y `sdd-end-patch`. Sin respuesta del usuario, el cierre termina y no deja nada pendiente: un gate más en el cierre convertiría el ticket en peaje y se rellenaría en falso.
6. **`sdd-init-*` y `sdd-end-release` quedan fuera** aunque el acta los mencionaba: el roadmap acotó la task a los cierres de task y patch, y esos tres ficheros los reescriben las tasks 0004, 0012 y 0014 de esta misma release.
7. **El peso va en la plantilla, la skill es fina** (Art. I + Art. II): los siete tickets recibidos ya salieron buenos sin skill, así que lo que la skill aporta no es calidad de contenido sino cuatro reglas que ningún ticket traía de serie — «sin hallazgos» honesto, privacidad, misma sesión y hallazgo verificable contra un fichero del kit. Forma del artefacto ⇒ plantilla (`kit-feedback-template.md`), no prosa en la skill.
8. **La skill es invocable a mano** en cualquier punto de la sesión, no solo desde el cierre: el conocimiento caro aparece a menudo a mitad de la ejecución. Si ya hay ticket de esa sesión, se amplía; no nace un segundo.
9. **Los hallazgos van ordenados por coste observado, no por severidad** — es lo que hicieron los mejores tickets recibidos, y quien lee el ticket decide qué arreglar por lo que cuesta cada fricción, no por una etiqueta que pone quien la sufrió.

### Hallazgos de la review

Un revisor, lente dominio (Sonnet, effort medium; 88k tokens). Ocho hallazgos, seis aceptados.

- **Aceptado** — el nombre del fichero sin `HHmmss` contradice el naming del Art. IV y no invoca el trámite de cambio mayor → el ticket adopta `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md` con el id del modo del proyecto (decisión 3).
- **Aceptado** — «el informe final anota que no se generó» no es un artefacto del glosario y no se puede verificar → el THEN ya no anota nada en ningún sitio: sin respuesta el cierre simplemente termina.
- **Aceptado** — el caso límite de una sesión que ya generó su ticket no estaba cubierto → `AND` nuevo en el requisito del cierre y decisión 8.
- **Aceptado** — «ordenados por coste observado» era una decisión de diseño escondida en las reglas → decisión 9.
- **Aceptado** — «el fichero que origina el hallazgo» podía leerse como un fichero del proyecto y filtrar dominio → el requisito dice ahora **del kit**, nunca del repo consumidor.
- **Aceptado** — el Intent prometía «cada carril» y el Scope solo da task y patch → Intent acotado.
- **Rechazado** — «la oferta en el cierre es un `MODIFIED` de `task-flow.md`»: ningún requisito de `task-flow.md` cambia de texto ni de conducta. Los suyos son la validación previa, la fusión del delta y el registro de la review; ninguno dice cuántos pasos tiene el cierre ni qué lo termina. Un paso final aditivo es comportamiento del sustantivo nuevo, y declararlo `MODIFIED` obligaría a reescribir un requisito ajeno para dejarlo igual. Riesgo asumido y declarado: quien lea solo `task-flow.md` no verá la oferta; la task 0003 de esta release reorganiza dónde viven estas reglas y es el sitio donde corregirlo si molesta.
- **Rechazado por arrastre** — «recalcular el nivel de review si hay `MODIFIED`»: sin `MODIFIED`, las señales siguen siendo tres y el nivel, un revisor.

## Intent

El dev-lead lleva siete tickets de mejora del kit pedidos a mano, explicando cada vez el formato, y son la fuente de scope de esta release entera: el uso real devolvió en cuatro días más que las campañas de test en semanas. Hoy nada los pide, no tienen sitio fijo ni forma fija, y se generan solo si alguien se acuerda antes de limpiar el contexto —que es cuando el conocimiento se pierde—. Se quiere que el cierre de una task y el de un patch lo ofrezcan, que caigan siempre en la misma carpeta con el mismo nombre, y que el ticket esté escrito para que lo lea el agente que arreglará el kit.

## Scope

- **Entra**: skill `sdd-feedback`; plantilla `kit-feedback-template.md` en `sdd-templates`; carpeta `.docs/sdd/kit-feedback/`; paso de oferta en `sdd-end-task` y `sdd-end-patch`; entrada de la skill y de la plantilla en el índice de `sdd-templates` y en el catálogo del README; evidencia RED/GREEN (Art. I).
- **No entra**: `sdd-init-*` (0012, 0014), carril release (0004), `.gitignore` automático, script de cosecha de tickets, y la triada de los tickets una vez en el kit (eso es el carril release). Los dos cierres ganan un paso final; ningún requisito ya escrito de `task-flow.md` cambia, así que ese fichero no se toca.

## Approach

Una skill fina sobre una plantilla pesada. La skill ordena qué mirar en la sesión (el flujo que se ejecutó, no el código del proyecto), impone las cuatro reglas que el baseline no traía y manda calcar la plantilla; la plantilla fija la forma que hizo útiles a los mejores tickets recibidos: cabecera con versiones y sesión, hallazgos por prioridad con campos fijos y verificables, y las tres secciones que el baseline produjo de forma desigual —qué funcionó, qué hizo el agente por iniciativa propia, y los errores del ejecutor separados de los huecos del kit—.

Los cierres de task y patch añaden un paso de oferta al final, después de que el trabajo esté cerrado: ofrecer antes contaminaría el checklist con una decisión que no afecta al cierre.

## Delta de comportamiento

### Capacidad: `kit-feedback`

**ADDED — El ticket de mejora del kit vive en `.docs/sdd/kit-feedback/`**
- GIVEN un proyecto con `.docs/sdd/`
- WHEN `sdd-feedback` genera un ticket
- THEN lo escribe en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md`, con el timestamp en UTC y el id del modo declarado en `sdd-kit.json`, calcado de `kit-feedback-template.md` del skill `sdd-templates`
- AND si la carpeta no existe la crea y avisa una sola vez de que puede ignorarse en git; no edita `.gitignore`

**ADDED — El ticket se escribe para un agente, no para una persona**
- GIVEN una sesión que acaba de ejecutar una task o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta y un criterio de aceptación en forma de escenario
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

**ADDED — «Sin hallazgos» es una salida válida**
- GIVEN una sesión sin fricción atribuible al kit
- WHEN se invoca `sdd-feedback`
- THEN el ticket se escribe igualmente, con «Sin hallazgos» y la sección de lo que funcionó, y no se inventa ninguna fricción para rellenar

**ADDED — El ticket no lleva el dominio del cliente**
- GIVEN un proyecto de cliente
- WHEN se redacta cualquier parte del ticket
- THEN describe el comportamiento del kit sin nombres de cliente, proyecto, producto ni personas, y sin código ni reglas de negocio del dominio
- AND si un hallazgo no se entiende sin un dato del dominio, el dato se sustituye por un descriptor genérico; el hallazgo nunca se omite por privacidad

**ADDED — El hallazgo separa el hueco del kit del error del ejecutor**
- GIVEN un fallo observado durante la sesión
- WHEN se clasifica en el ticket
- THEN va a los hallazgos del kit solo si una regla escrita del kit lo habría evitado; si fue un error del ejecutor, va a su sección propia y no propone cambiar el kit
- AND lo que el agente hizo por iniciativa propia sin que el kit lo pidiera va en su sección, porque es candidato a regla nueva

**ADDED — El cierre de una task y el de un patch ofrecen el ticket en la misma sesión**
- GIVEN un cierre por `sdd-end-task` o `sdd-end-patch` con el resto del checklist terminado
- WHEN el agente da el cierre por cerrado
- THEN ofrece generar el ticket con `sdd-feedback` en esa misma sesión, diciendo que al limpiar el contexto ese conocimiento se pierde
- AND la oferta no es un gate: sin respuesta, el cierre termina y no deja nada pendiente ni anotado en ningún artefacto
- AND si la sesión ya generó su ticket, la oferta no se repite: la skill amplía el ticket existente en vez de crear otro

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/kit-feedback/` en el proyecto consumidor; su destino final en el repo del kit es `.docs/sdd/field-reports/`.
- **Idioma de los nombres**: nombre de fichero y slug en inglés kebab-case; el contenido del ticket en castellano.
- **Límites**: un ticket por sesión de carril; los hallazgos van ordenados por coste observado.
- **Avisos**: al crear la carpeta por primera vez, la skill avisa de que puede ignorarse en git.
- **Regla ante conflicto**: entre contar el hallazgo y proteger el dominio del cliente manda la privacidad — el hallazgo se despersonaliza, nunca se omite.

## Enmiendas

- **2026-09-21 — recorte del RED (Art. I)**, sin cambio de comportamiento observable. La decisión 7 atribuía a la skill cuatro reglas; el RED (`tests/kit-feedback-red.md`) confirmó el fallo de privacidad y de la oferta en el cierre, y destapó otros dos de forma (ningún hallazgo traía criterio de aceptación y la iniciativa propia se diluía en la prosa). En cambio, **no inventar fricciones** y **separar el hueco del kit del error propio** ya los cumplía el baseline, 2 de 2. Esos dos requisitos del delta se mantienen tal cual, pero los garantiza la forma de la plantilla (salida «Sin hallazgos» explícita y sección de errores propios), no una regla de la skill. El GREEN comprueba que la plantilla no empuja a rellenar.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada |
