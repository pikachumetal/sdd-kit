---
name: sdd-plan
description: Usar cuando hay que meter algo en el roadmap de un proyecto con .docs/sdd/ sin hacerlo todavía — "organízalo para el equipo", "apunta en el roadmap", "no lo arranques", items que el PM creó en el gestor (Azure DevOps, Jira), las notas de una reunión con el cliente, "reordena", "la X va tras la Y", "prepara la release N", "qué entra en la siguiente entrega". No para hacer el trabajo ya (eso es sdd-start-task o sdd-start-patch) ni para cerrar una release (eso es sdd-end-release).
---

# sdd-plan

## Overview

El kit tiene tres verbos: **planificar** (`sdd-plan`) → **hacer** (`sdd-start-task`, `sdd-start-patch`) → **entregar** (`sdd-end-release`). Esta skill es la única puerta de entrada al roadmap: el usuario trae algo, la skill reconoce qué es y deja el roadmap listo para que otro lo arranque, con la definición de lo grande en una propuesta (`proposal.md`) que no se reescribe.

**Principio central: proponer no es decidir.** Traes los cambios ordenados con tu recomendación; qué entra, en qué orden y qué se descarta lo decide el usuario.

**`sdd-plan` no arranca nada: ni rama, ni carpeta de task, ni spec, ni código.** Termina en el roadmap, y en `proposal.md` si toca. El mensaje final dice qué fila va primero y con qué skill se arranca.

## Qué entrada es (lo decides tú, sin preguntarlo)

Mira lo que trae la petición, en este orden:

1. **Items del gestor** — `ids.mode: tracker` en `.docs/sdd/sdd-kit.json` e ids de tickets en la petición.
2. **Una reunión** — notas o acta de una reunión con el cliente.
3. **Preparar una release** — «prepara la release N», «qué entra en la siguiente entrega».
4. **Reordenar o cambiar** — solo habla de filas que ya existen: «reordena», «la X va tras la Y», «quita la Z», o cambia la definición de una propuesta existente.
5. Lo demás, por tamaño: **Algo concreto** si cabe en una feature; **Algo grande** si prevé más de una (el mismo umbral que usa `sdd-start-task` para proponer partir: más de 3 tasks internas).

Frente a `sdd-start-task` decide el verbo: hacerlo ya («añade», «hazme», «arréglalo») es `sdd-start-task`; dejarlo apuntado («apunta», «organízalo», «planifica», «no lo arranques») es esta skill.

## Checklist (crea un todo por paso)

1. **Estado real** — lee `.docs/sdd/roadmap.md` de la rama de integración (`git show develop:.docs/sdd/roadmap.md`, o la que fije la constitution) y, **por cada rama `feature/*`** que liste `git branch --all`, su roadmap (`git show <rama>:.docs/sdd/roadmap.md`): lo que una rama partió o reservó solo está en su roadmap. Lee también `ids.mode` y, si vas a escribir reglas, las `capabilities/` que tocan. Con ese estado, en **cualquier** entrada: una task en marcha (rama `feature/<id>` abierta o 🔄) no se toca —ni su fila ni su spec—, aunque lo nuevo sea de su tema: va a una fila nueva «tras» ella. Una task cerrada (✅ o 🧪) en la rama de integración tampoco recibe trabajo nuevo: va a una fila nueva.
2. **Lo que deja cada entrada** — la sección de abajo que corresponda.
3. **Propón y espera** — en `pair` y `delegate`, presenta las filas, la propuesta y la partición antes de escribirlas, y espera la decisión del usuario. Un «decide tú» o «no hay nadie a quien preguntar» es una decisión delegada: escribe y deja las decisiones que tomaste en la propuesta o en el cuerpo del commit. En `unattended`, la opción más conservadora, registrada igual.
4. **Ids** — en `sequence`, los N ids nuevos (N + 1 si hay propuesta) salen de **una sola** reserva: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Get-NextSddId.ps1" -ProjectRoot "<raíz>" -Reserve -Count N`. Sin `-Reserve` el script solo propone, y otro worktree puede coger el mismo. En `tracker`, el id lo pone el gestor. Nunca un número a ojo.
5. **Publica la reserva** — commitea en la rama de integración las filas nuevas en un commit que solo toca `roadmap.md` (y el `proposal.md` si lo hay): en el worktree donde está sacada (`git worktree list`) o, si no está en ninguno, en un worktree temporal en la misma carpeta que los demás y con nombre corto (en Windows, una ruta larga falla con `Filename too long`). Hasta ese commit la reserva no existe para los demás worktrees.
6. **Cierra** — di qué fila va primero y con qué se arranca (`sdd-start-task` o `sdd-start-patch`). No la arranques.

## Lo que deja cada entrada

### Algo grande

Entrevista con la técnica de `superpowers:brainstorming` —una pregunta por turno, con la recomendada primero, y sin volver a preguntar lo que la petición ya dice o delega— con un override: **la entrevista nunca acaba en spec** ni en `writing-plans`; acaba en `proposal.md` y en filas del roadmap.

- La propuesta vive en `.docs/sdd/specs/<yyyyMMdd-HHmmss>-proposal-<id>-<slug>/proposal.md`, calcada de `proposal-template.md` del skill `sdd-templates` con `source: interview`.
- Cada regla de negocio lleva un ejemplo con datos de entrada y de salida.
- El reparto lista las features en su orden, cada una con su id y su «tras NNNN».
- Cada feature es una fila del roadmap con «`proposal: <id>`» y su «tras NNNN» en la celda «Ítem».
- Las reglas **no** van al roadmap: el roadmap es el índice que leen todas las skills; la definición vive en la propuesta.

### Algo concreto

Una fila, sin propuesta: en «Próximo» con id si se va a hacer, en «Backlog» si no, o donde diga el usuario. Una épica de una sola feature es una feature.

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
6. **Sección** — `## Release <N>` en el roadmap, con la cabecera literal de `roadmap-template.md`: `| id | Task | Origen | Ficheros que toca | Estado |`. La celda «Ficheros que toca» nombra los ficheros o módulos previstos, leídos del código; si aún no existen, la carpeta o el módulo donde irán, nunca «por definir»: el freno de alcance la usa para ver solapes. En `sequence`, cada fila con su id reservado (paso 4 del checklist). Sin gestor, el roadmap es la única fuente del scope; con gestor, la fuente es él.

## Red flags — STOP

- Vas a crear una rama, una carpeta de task o una `spec.md` desde esta skill.
- Vas a borrar una fila, sustituirla por un item del gestor o fusionar dos sin que el usuario lo diga.
- Vas a dejar las reglas de negocio de algo grande en un bloque del roadmap.
- Vas a apuntar un item grande del gestor con «trocear al arrancarlo» en vez de proponer ya la partición.
- Vas a recoger una reunión sin guardar sus notas literales.
- Vas a reescribir una regla de una propuesta en vez de añadir una enmienda fechada.
- Vas a reabrir una feature cerrada o en marcha porque la definición cambió.
- Vas a editar la fila o la spec de una task en marcha para meterle trabajo nuevo.
- Vas a escribir en el roadmap un id que no viene del gestor ni de `Get-NextSddId.ps1 -Reserve`.
- Vas a marcar una release «comprometida» sin que el usuario lo diga, o con bloqueos externos abiertos.
- Estás planificando con el roadmap de tu worktree sin haber leído el de la rama de integración y el de las ramas `feature/*`.

| Racionalización | Realidad |
| --- | --- |
| «Cada task lleva su spec y plan al arrancarla; las decisiones comunes las dejo en un bloque del roadmap» | El roadmap es el índice que leen todas las skills. Las reglas y su porqué van a `proposal.md`, con ejemplos con datos: 2 de 2 sujetos del RED las dejaron sueltas en el roadmap y sin datos (`tests/sdd-plan-red.md`, p1). |
| «El item de Azure y la fila son lo mismo; dejo una sola fila» | Borrar o sustituir una fila es una decisión del usuario, no una limpieza: 2 de 2 sujetos sustituyeron la 0013 por la 4514 sin preguntar (p3). Pregunta el duplicado. |
| «Es una épica; ya se trocea al arrancarla» | Al arrancarla nadie mira el roadmap entero. La partición se propone ahora, para que el PM cree los hijos (p3, 2 de 2). |
| «Las notas ya están reflejadas en las filas» | Las filas dicen qué hacer, no qué dijo el cliente. Sin acta, la siguiente discusión no tiene de dónde leer (p4, 2 de 2 sin acta). |
| «La 0012 está descartada; la quito del roadmap» | Un descarte es `⏸️ aparcada: descartada por <quién>, <fecha>`. Borrarla pierde el porqué (p4-1). |
| «El ejemplo de la propuesta estaba incompleto; lo reescribo» | La propuesta es histórica: el cambio va a «Enmiendas» con su fecha. Reescribirla borra lo que se acordó antes (p10, 2 de 2). |
| «Ya que tengo el cambio claro, arranco la task y escribo la spec» | Planificar no es hacer. `sdd-plan` termina en el roadmap; 2 de 2 sujetos abrieron rama y spec sin que nadie lo pidiera (p10). |
| «"Prepara la release" es cerrar la release» | Preparar es decidir qué entra; cerrar es `sdd-end-release`. 2 de 2 sujetos sin esta skill acabaron en el cierre (p6). |
| «El triage del acta ya lo decidió; marco la release comprometida» | El triage decidió el destino de cada petición; comprometer el hito, su orden y su estado es otra decisión del usuario. |
| «El cliente dijo que todo es importante» | Énfasis verbal no es priorización. Se registra y se decide con criterio de producto. |
| «Arrastro la deuda técnica entera, así se salda» | La deuda entra por prerrequisito o por decisión explícita, no por inercia: infla el scope. |
| «Congelo el scope en un documento aparte» | El roadmap versionado ya es auditable. La propuesta es la definición de lo grande, no una copia del scope. |
| «La nota es del tema de la task en marcha; la agrupo en su fila» | Su rama está editando esa fila y esa spec. Agruparla ahí provoca el conflicto al cerrarla y le cambia un scope aprobado: va a una fila nueva «tras» ella. |
| «El roadmap de mi worktree es el estado real» | Es el de tu base. Otra rama puede haber cerrado, partido o reservado; sin leerla, repites ids o amplías tasks cerradas. |
| «Pongo el siguiente número libre para adelantar» | Un id inventado se confunde con uno reservado para siempre. El id lo da el gestor o `Get-NextSddId.ps1 -Reserve`. |
