---
name: sdd-roadmap
description: Usar cuando hay que meter algo en el roadmap de un proyecto con .docs/sdd/ sin hacerlo todavía — "organízalo para el equipo", "apunta en el roadmap", "no lo arranques", items que el PM creó en el gestor (Azure DevOps, Jira), también los que te han asignado para hacerlos, las notas de una reunión con el cliente, "reordena", "la X va tras la Y", "el cliente ha cambiado una regla de algo ya planificado, actualiza lo que haga falta", "prepara la release N", "qué entra en la siguiente entrega", "dame el prompt de la <id>". No para hacer el trabajo ya (eso es sdd-propose) ni para cerrar una release (eso es sdd-end-release).
---

# sdd-roadmap

## Overview

El kit tiene tres verbos: **planificar** (`sdd-roadmap`) → **hacer** (`sdd-propose`) → **entregar** (`sdd-end-release`). Esta skill es la única puerta de entrada al roadmap: el usuario trae algo, la skill reconoce qué es y deja el roadmap listo para que otro lo arranque, con la definición de lo grande en una propuesta (`proposal.md`) que no se reescribe.

**Principio central: proponer no es decidir.** Traes los cambios ordenados con tu recomendación; qué entra, en qué orden y qué se descarta lo decide el usuario.

**`sdd-roadmap` no arranca nada: ni rama, ni carpeta de feature, ni spec, ni código.** Termina en el roadmap, y en `proposal.md` si toca. El mensaje final dice qué fila va primero y da su prompt de arranque.

## Qué entrada es (lo decides tú, sin preguntarlo)

Mira lo que trae la petición, en este orden:

1. **Dar el prompt de una fila** — «dame el prompt de la <id>»: lee la fila, su propuesta con sus enmiendas y `.docs/sdd/sdd-kit.json`, y da el prompt de arranque calcado de [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md). Nada más: no escribes, no reservas, no publicas ni commiteas. Si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/<id>-*` abierta), dilo en vez de dar el prompt (`tests/sdd-explore-0161-red.md`, m1).
2. **Items del gestor** — `ids.mode: tracker` en `.docs/sdd/sdd-kit.json` e ids de tickets en la petición.
3. **Una reunión** — notas o acta de una reunión con el cliente.
4. **Preparar una release** — «prepara la release N», «qué entra en la siguiente entrega».
5. **Reordenar o cambiar** — solo habla de filas que ya existen: «reordena», «la X va tras la Y», «quita la Z», o cambia la definición de una propuesta existente.
6. Lo demás, por tamaño: **Algo concreto** si cabe en una feature; **Algo grande** si prevé más de una (el mismo umbral que usa `sdd-propose` para proponer partir: más de 5 tasks internas, o 4 o 5 que tocan capacidades o superficies distintas —BD, UI, API— o alguna con migración; con 3 o menos, nunca).

Frente a `sdd-propose` decide el verbo: hacerlo ya («añade», «hazme», «arréglalo») es `sdd-propose`; dejarlo apuntado («apunta», «organízalo», «planifica», «no lo arranques») es esta skill.

## Checklist (crea un todo por paso)

1. **Estado real** — lee `.docs/sdd/roadmap.md` de la rama de integración (`git show develop:.docs/sdd/roadmap.md`, o la que fije la constitution) y, **por cada rama `feature/*`** que liste `git branch --all`, su roadmap (`git show <rama>:.docs/sdd/roadmap.md`): lo que una rama partió o reservó solo está en su roadmap. Lee también `ids.mode` y, si vas a escribir reglas o nombrar capacidades, ejecuta `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` y lee las que, por su propósito, tocan: el nombre del fichero no dice dónde vive una regla, y sin índice 1 de 2 sujetos repartió en `bookings` la regla de no presentarse, que ya vivía en `house-rules` (`tests/capabilities-index-red.md`, r). Con ese estado, en **cualquier** entrada: una feature en marcha (rama `feature/<id>` abierta o 🔄) no se toca —ni su fila ni su spec—, aunque lo nuevo sea de su tema: va a una fila nueva «tras» ella. Una feature cerrada (✅ o 🧪) en la rama de integración tampoco recibe trabajo nuevo: va a una fila nueva.
2. **Lo que deja cada entrada** — la sección de abajo que corresponda.
3. **Propón y espera** — en `pair` y `delegate`, presenta las filas, la propuesta y la partición antes de escribirlas, y espera la decisión del usuario. Un «decide tú» o «no hay nadie a quien preguntar» es una decisión delegada: escribe y deja las decisiones que tomaste en la propuesta o en el cuerpo del commit. En `unattended`, la opción más conservadora, registrada igual.
4. **Ids** — en `sequence`, los N ids nuevos (N + 1 si hay propuesta) salen de **una sola** reserva: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" id next --project-root "<raíz>" --reserve --count N`. Sin `--reserve` el script solo propone, y otro worktree puede coger el mismo. En `tracker`, el id lo pone el gestor. Nunca un número a ojo.
5. **Comprueba la forma** — tras escribir en el roadmap y antes de commitear, ejecuta `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`. Un fallo en una línea que escribiste lo corriges en el roadmap, nunca en el validador. Un fallo en una línea que no tocaste no lo arreglas: lo listas en tu mensaje como forma heredada, pendiente del paso «Roadmap en la forma de la plantilla» de la migración a v2.3.0. En el RED, 2 de 2 sujetos no lo ejecutaron y dejaron el roadmap en rojo (P3).
6. **Publica la reserva** — ejecuta `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap publish --project-root "<raíz>" --message "<mensaje>" .docs/sdd/roadmap.md` (más el `proposal.md` si lo hay): commitea en la rama de integración solo esos ficheros, con el cerrojo de `sdd merge`, en el worktree donde está sacada o en uno temporal si no está en ninguno. La rama sale de `merge.into` de `sdd-kit.json`, o de `--into`. Hasta ese commit la reserva no existe para los demás worktrees.
7. **Cierra** — di qué fila va primero y da su prompt de arranque, calcado de [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md), también con «apunta, no lo arranques»: el prompt no arranca nada. Termina con «si prefieres hacerlo en esta sesión, di "arráncalo"»; con «arráncalo», invoca `sdd-propose` con esa fila. Sin esa frase, no la arranques (`tests/sdd-explore-0161-red.md`, m2 y m3: 4 de 4 cerraron nombrando la skill, sin prompt).

## Lo que deja cada entrada

### Algo grande

Entrevista con la técnica de `superpowers:brainstorming` —sus preguntas, con la skill `sdd-grilling` (invócala con `Skill`)— con un override: **la entrevista nunca acaba en spec** ni en `writing-plans`; acaba en `proposal.md` y en filas del roadmap.

- La propuesta vive en `.docs/sdd/specs/<yyyyMMdd-HHmmss>-proposal-<id>-<slug>/proposal.md`, calcada de `proposal-template.md` del skill `sdd-templates` con `source: interview`.
- Cada regla de negocio lleva un ejemplo con datos de entrada y de salida.
- El reparto lista las features en su orden, cada una con su id y su «tras NNNN».
- Cada feature es una fila del roadmap con «`proposal: <id>`» y su «tras NNNN» en la celda «Ítem».
- Las reglas **no** van al roadmap: el roadmap es el índice que leen todas las skills; la definición vive en la propuesta.

### Algo concreto

Una fila, sin propuesta: en «Próximo» con id si se va a hacer, en «Backlog» si no, o en la sección de la plantilla que diga el usuario. Una épica de una sola feature es una feature. Un patch pendiente es una fila de «Próximo» con «Patch:» al inicio del ítem; la sección «Patches» es el registro de los cerrados.

Si el usuario pide una sección que no está en `roadmap-template.md` («abre una sección "Ideas del cliente"»), no la creas: la fila va a la sección de la plantilla equivalente —lo que aún no se ha decidido hacer, al Backlog— y tu mensaje dice que la plantilla no la admite y dónde ha ido. En el RED, 2 de 2 sujetos crearon la sección con su línea de prosa porque «me lo pediste» (`tests/release-close-roadmap-red.md`, P1).

### Items del gestor

- Cada item entra con **su** id del gestor. No reservas nada con el script.
- Una fila que ya existe no se toca: si un item parece duplicar una fila, lo preguntas; no borras, sustituyes ni fusionas sin preguntar.
- Un item grande (varias features) se parte **ahora**: en la misma respuesta propones los hijos para que el PM los cree en el gestor. En el roadmap no pones ids inventados para ellos: la fila del item lleva la partición propuesta hasta que existan.

### Una reunión

- Propuesta con `source: meeting`: fecha, asistentes y las **notas literales** en «Acta», y cada regla nueva en «Reglas de negocio» con su ejemplo con datos.
- Cada cosa nueva que pide el cliente es una fila con id reservado y «`proposal: <id>`».
- Lo que el cliente descarta queda `⏸️ aparcada: descartada por <quién>, <fecha>`: no se borra.
- El orden que pide el cliente se aplica a las filas pendientes.
- No abres una sección de release que nadie pidió.

### Reordenar o cambiar

- Cambias solo las filas que nombra la petición; el resto queda igual.
- Una dependencia va en la celda «Ítem» como «tras NNNN», sin columna nueva ni columna de responsable.
- **Si cambia la definición de una propuesta**: añades una entrada fechada en «Enmiendas» (qué regla cambia, el valor anterior y el nuevo con su ejemplo con datos, quién lo pidió) y **no reescribes** «Reglas de negocio» ni el acta. Re-partes **solo lo pendiente**: una feature cerrada (✅ o 🧪) o en marcha (rama `feature/<id>` abierta o 🔄) no se toca, y lo que el cambio le pida va a una fila nueva «tras» ella. Una feature nueva entra también en el reparto de la propuesta; una que se aparca se marca ahí, sin borrarla.

### Preparar una release

1. **Inventario** — el Backlog, la deuda técnica, y el acta y los action items de la retro de la release anterior si existe `.docs/sdd/releases/<última>/feedback.md`. La deuda técnica entra solo si es prerrequisito verificable de un item del scope o por decisión explícita del usuario, no en bloque.
2. **Orden** — riesgo primero, después coste-beneficio, contando dependencias, con los **bloqueos marcados** (🔒 + qué decisión falta + quién la debe).
3. **Scope** — lo decide el usuario, item a item o por bloques. La presión de un stakeholder («todo es importante») se registra, no se obedece.
4. **Destinatario** — si `sdd-kit.json` no tiene `release.hasRecipient`, pregunta una vez si la release se entrega a alguien distinto de quien la hace y escribe la respuesta en ese campo, fusionando sin tocar el resto; con el campo presente, aplica su valor sin preguntar. Nunca lo escribes sin respuesta explícita.
5. **Estado** — **comprometida** (scope prometido al destinatario, normalmente con fecha) solo si el usuario lo dice y no hay bloqueos externos; si no, **en preparación**. Con `release.hasRecipient: false`, siempre en preparación, sin preguntar.
6. **Sección** — `## Release <N>` en el roadmap, con la cabecera literal de `roadmap-template.md`: `| id | Feature | Origen | Ficheros que toca | Estado |`. La celda «Ficheros que toca» nombra los ficheros o módulos previstos, leídos del código; si aún no existen, la carpeta o el módulo donde irán, nunca «por definir»: el freno de alcance la usa para ver solapes. En `sequence`, cada fila con su id reservado (paso 4 del checklist). Sin gestor, el roadmap es la única fuente del scope; con gestor, la fuente es él.

## Red flags — STOP

- Vas a crear una rama, una carpeta de feature o una `spec.md` desde esta skill.
- Vas a abrir una sección que no está en `roadmap-template.md` porque el usuario la pidió, o a commitear sin que `sdd roadmap check` haya pasado por lo que escribiste.
- Vas a borrar una fila, sustituirla por un item del gestor o fusionar dos sin que el usuario lo diga.
- Vas a dejar las reglas de negocio de algo grande en un bloque del roadmap.
- Vas a apuntar un item grande del gestor con «trocear al arrancarlo» en vez de proponer ya la partición.
- Vas a recoger una reunión sin guardar sus notas literales.
- Vas a reescribir una regla de una propuesta en vez de añadir una enmienda fechada.
- Vas a reabrir una feature cerrada o en marcha porque la definición cambió.
- Vas a editar la fila o la spec de una feature en marcha para meterle trabajo nuevo.
- Vas a escribir en el roadmap un id que no viene del gestor ni de `sdd id next --reserve`.
- Vas a marcar una release «comprometida» sin que el usuario lo diga, o con bloqueos externos abiertos.
- Estás planificando con el roadmap de tu worktree sin haber leído el de la rama de integración y el de las ramas `feature/*`.

| Racionalización | Realidad |
| --- | --- |
| «Cada feature lleva su spec y plan al arrancarla; las decisiones comunes las dejo en un bloque del roadmap» | El roadmap es el índice que leen todas las skills. Las reglas y su porqué van a `proposal.md`, con ejemplos con datos: 2 de 2 sujetos del RED las dejaron sueltas en el roadmap y sin datos (`tests/sdd-roadmap-red.md`, p1). |
| «El item de Azure y la fila son lo mismo; dejo una sola fila» | Borrar o sustituir una fila es una decisión del usuario, no una limpieza: 2 de 2 sujetos sustituyeron la 0013 por la 4514 sin preguntar (p3). Pregunta el duplicado. |
| «Es una épica; ya se trocea al arrancarla» | Al arrancarla nadie mira el roadmap entero. La partición se propone ahora, para que el PM cree los hijos (p3, 2 de 2). |
| «Las notas ya están reflejadas en las filas» | Las filas dicen qué hacer, no qué dijo el cliente. Sin acta, la siguiente discusión no tiene de dónde leer (p4, 2 de 2 sin acta). |
| «La 0012 está descartada; la quito del roadmap» | Un descarte es `⏸️ aparcada: descartada por <quién>, <fecha>`. Borrarla pierde el porqué (p4-1). |
| «El ejemplo de la propuesta estaba incompleto; lo reescribo» | La propuesta es histórica: el cambio va a «Enmiendas» con su fecha. Reescribirla borra lo que se acordó antes (p10, 2 de 2). |
| «Ya que tengo el cambio claro, arranco la feature y escribo la spec» | Planificar no es hacer. `sdd-roadmap` termina en el roadmap; 2 de 2 sujetos abrieron rama y spec sin que nadie lo pidiera (p10). |
| «"Prepara la release" es cerrar la release» | Preparar es decidir qué entra; cerrar es `sdd-end-release`. 2 de 2 sujetos sin esta skill acabaron en el cierre (p6). |
| «El triage del acta ya lo decidió; marco la release comprometida» | El triage decidió el destino de cada petición; comprometer el hito, su orden y su estado es otra decisión del usuario. |
| «El cliente dijo que todo es importante» | Énfasis verbal no es priorización. Se registra y se decide con criterio de producto. |
| «Arrastro la deuda técnica entera, así se salda» | La deuda entra por prerrequisito o por decisión explícita, no por inercia: infla el scope. |
| «Congelo el scope en un documento aparte» | El roadmap versionado ya es auditable. La propuesta es la definición de lo grande, no una copia del scope. |
| «La nota es del tema de la feature en marcha; la agrupo en su fila» | Su rama está editando esa fila y esa spec. Agruparla ahí provoca el conflicto al cerrarla y le cambia un scope aprobado: va a una fila nueva «tras» ella. |
| «El roadmap de mi worktree es el estado real» | Es el de tu base. Otra rama puede haber cerrado, partido o reservado; sin leerla, repites ids o amplías features cerradas. |
| «Pongo el siguiente número libre para adelantar» | Un id inventado se confunde con uno reservado para siempre. El id lo da el gestor o `sdd id next --reserve`. |
