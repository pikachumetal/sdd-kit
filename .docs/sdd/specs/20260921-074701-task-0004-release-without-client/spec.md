---
id: 20260921-074701-task-0004-release-without-client
task: 0004
title: Carril release opcional y fuera de un contexto de cliente
mode: full
status: approved
created: 2026-09-21
author: Claude (Opus 5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Carril release opcional y fuera de un contexto de cliente

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor, lente dominio — señales: capacidad nueva (`release-flow`), contrato público y dato persistente (el campo `release.hasRecipient` de `sdd-kit.json`, que leen las dos skills del carril)
- Dominio: si las tres condiciones de «Merge y tag sin segunda ronda» se pueden comprobar sin interpretar al usuario, si queda algún camino para que un `vX.Y.Z` asumido pase el gate, si un cierre sin apertura deja algún paso sin dueño y si el cambio de `true` a `false` a mitad de release deja algún hueco (señal: capacidad nueva)
- Técnica (descartada): si el campo nuevo convive con `version` e `ids` sin migración (señal: contrato + dato); lo cubre el requisito «El proyecto declara si sus releases tienen destinatario»
- Mínimo razonable: sin review — deja sin mirar si «sin destinatario» o «sin apertura» abren una puerta a que el agente se conceda el atajo solo, justo el tipo de fallo que el gate existe para frenar
```

Activada por el dev-lead el 2026-09-21: un revisor, lente dominio (Sonnet; el tool `Agent` no expone effort, desviación anotada).

### Hallazgos de la review

1. **Aceptado** — Crítico: el delta mete un dato, un aviso y una regla ante conflicto sin «Reglas de la capacidad» → subsección añadida con las cinco entradas.
2. **Aceptado** — Crítico: la condición (a) «cierre autorizado» no tenía predicado observable → decisión 9 bis. Es un mensaje del usuario que ordena el cierre, citado literal, y un disparo de la skill por la `description` no cuenta.
3. **Aceptado** — Crítico: el agente podía escribir `hasRecipient: false` y concederse el atajo → el campo solo lo escribe o cambia el usuario (decisión 7, un AND nuevo y la condición (c)), y el gate completo se mantiene si lo escribió el agente.
4. **Aceptado** — Importante: la excepción del red flag de la carpeta vivía solo en prosa → ADDED «La carpeta de la release existe solo si tiene contenido».
5. **Aceptado** — Importante: el AND del id de una task no planificada duplicaba `task-ids.md` → remite a ella por nombre de requisito.
6. **Aceptado** — Menor: nombres reales de proyectos en la decisión 6 → «los proyectos ya instalados».
7. **Aceptado** — Menor: `smoke: pendiente` no estaba en las decisiones → añadido a la decisión 13.

### Recorte tras el RED (Art. I, 2026-09-21) — pendiente de reaprobación

La evidencia está en `tests/release-flow-red.md`: 10 sujetos, 10,17 $. Llevan guía los requisitos cuyo fallo mostró el RED:

- **Release notes sin destinatario**: fallaron 4 de 4.
- **«Comprometida» preguntada sin definir**: falló 1 de 2, y los 2 usaron los términos sin definirlos.
- **Smoke contado distinto** que en el caso de campo.
- **Lista de tickets**: ausente en 2 de 2.
- **Segunda ronda de merge y tag**: falló 2 de 2 en E5, que reproduce el orden del caso de campo.

Se quedan **sin guía nueva**, porque el baseline ya los cumple: cierre sin apertura, versión propuesta desde el changelog, bump con el tooling o sin fichero, y acta sin fuente. Siguen en el delta porque describen comportamiento verificado del kit, y la capacidad los recoge igual. El test determinista pierde la aserción del bump.

**Modelo acordado con el dev-lead (2026-09-21)**, cita literal: «vamos haciendo tarea con start-* y en algún momento end-release, el user dice la versión, y cortamos Unreleased y luego seguimos con start-* etc.»

1. **Modo incremental = trabajar con task y patch sin abrir release.** `sdd-start-release` es opcional: es la vía ideal para *generar* las tasks, pero no es requisito. `sdd-end-release` es el **corte de publicación** (por ejemplo, al subir a producción), y se lanza haya habido apertura o no. Por eso no hay un interruptor «carril activo / inactivo». Descarto la propuesta anterior de usar la clave `release` como predicado del carril, porque con este modelo no hay nada que activar.
2. **El changelog no cambia.** `add-to-changelog` y `sdd-end-patch` siguen escribiendo en `[Unreleased]`, y el corte lo hace `sdd-end-release` cuando el usuario publica. Entre dos cortes, `[Unreleased]` es literalmente lo no publicado.
3. **Cierre sin apertura.** Si el roadmap no tiene sección de la release (no se abrió con `sdd-start-release`), el scope que se congela en el paso 1 es el contenido de `[Unreleased]`. El paso 6 no colapsa nada: añade la entrada a «Releases cerradas». El predicado observable es la existencia de esa sección en el roadmap.
4. **Origen de las tasks sin apertura**: filas del Backlog del roadmap o trabajo no planificado. En modo `sequence`, el id lo da `Get-NextSddId.ps1` (task 0001), sin fila reservada. Hoy ya funciona así; esta spec solo lo declara en la capacidad.
5. **Ninguna skill de task o patch presupone el carril.** Verificado en este worktree: `sdd-start-task`, `sdd-end-task`, `sdd-start-patch` y `sdd-end-patch` no lo nombran. `add-to-changelog:44` y `sdd-end-patch:18` solo dejan el corte a `sdd-end-release`, lo que encaja con el modelo. No se editan.
6. **Con o sin destinatario es configuración del proyecto** en `.docs/sdd/sdd-kit.json`: `"release": { "hasRecipient": true | false }`. Es un booleano y no el nombre, para que el nombre del cliente no quede en un fichero de configuración. Si el campo falta, la primera skill del carril que se ejecute (`sdd-start-release` o `sdd-end-release`) lo pregunta una vez y lo escribe. Así no hace falta migración: los proyectos ya instalados contestarán una vez en su próximo cierre. Este repo recibe `hasRecipient: true`, porque el kit se entrega al equipo.
7. **Cambiar el valor no es un problema, pero lo cambia el usuario.** Basta con editar el campo, a mano o pidiéndoselo al agente. Cada skill aplica el valor que tiene en ese momento, sin migración y sin reescribir releases pasadas. El agente **nunca** escribe el campo por su cuenta: solo con la respuesta explícita del usuario. Así el atajo del gate no se lo puede conceder él.
8. **«Destinatario»** es la persona o el grupo, distinto de quien hace la release, que la recibe: un cliente, el equipo que instala el kit. Un desarrollador que publica su propia herramienta no tiene destinatario.
9. **El Art. IV no se reescribe.** El merge sigue siendo decisión del usuario. Cuando se cumplen las tres condiciones, la decisión ya está tomada: el usuario autorizó el cierre y escribió la versión. Lo que desaparece es la segunda pregunta.
9 bis. **Cierre autorizado** = un mensaje del usuario en esta conversación que ordena el cierre («cierra la release», o `/sdd-end-release` invocado por él), citado literal en el resumen de cierre. Una invocación de la skill que el agente dispara solo porque lo sugiere la `description` («el changelog acumula tasks») no cuenta.
10. **Versión confirmada de forma explícita** significa que el usuario escribe o acepta la versión exacta **respondiendo a la propuesta del paso 1**. Que el encargo nombre la versión sigue sin contar. La pregunta de versión se hace siempre, y es la que frenó el `v0.1.0` asumido.
11. **Comprometida** = scope prometido al destinatario, normalmente con fecha. **En preparación** = cualquier otro caso. Con `hasRecipient: false`, el estado es «en preparación» y no se pregunta.
12. **Sin destinatario, sin release notes ni email.** Basta el changelog sellado, y el paso «Comunicar» no aplica. El red flag «`.docs/sdd/releases/vX.Y.Z/` no existe al terminar» se exige solo si hay destinatario o acta.
13. **Smoke de release** = lo que se ejecuta sobre la rama integrada antes del cierre para comprobar que lo entregado funciona: la suite más un uso real (arrancar, instalar, invocar). **Hallazgo** = defecto en el comportamiento que entrega la release **detectado por ese smoke**, se corrija o no dentro de la release. Lo encontrado dentro de una task antes de su cierre ya está en su walkthrough y no cuenta. La línea es `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`. Si no se ejecutó, `smoke: pendiente`, que es la salida honesta que ya prevé `notas-y-roadmap.md`: el número no se inventa.
14. **Capacidad nueva `release-flow`**, solo con los requisitos de este delta y sin volcado del resto del carril.
15. **Cada punto entra solo si su RED falla (Art. I).** En el ticket de campo, el agente ya acertó sin guía con M2 (no hizo email) y con M3 (no creó fichero de versión). Si el baseline acierta, ese punto se recorta y vuelvo a pedir aprobación del alcance.
16. **Fixtures con rutas cortas**: cada ruta de la evidencia queda por debajo de 140 caracteres relativos, con carpetas del tipo `red/e1/` (aviso del dev-lead, 2026-09-21).
17. **Roles en un equipo** (conversación con el dev-lead, 2026-09-21). Planificar es del PM o el PO: con un gestor (Jira, Azure DevOps), las tareas se dan de alta allí y `sdd-start-release` no se usa. El dev hace las tareas una a una con `sdd-start-task` o `sdd-start-patch` y el id del ticket (`ids.mode: tracker`). El corte (develop → main, tag, changelog, roadmap) es `sdd-end-release`. En un equipo de uno, `sdd-start-release` sigue siendo la vía cómoda para generar las tareas. La skill no modela roles: «el usuario» es quien la ejecuta.
18. **Con gestor, el roadmap no es la fuente del scope.** La fuente es el gestor, y el roadmap guarda las releases cerradas, la deuda técnica y el backlog propio sin replicarlo. El hueco que eso destapa en el paso 8 de `sdd-end-task` («marcar el módulo/tarea» cuando la task no tiene fila) va a una **task aparte**, que se registra en el roadmap al cerrar esta: `sdd-end-task` es un fichero caliente de la task 0003.
19. **La versión se propone desde el changelog**, como hacen `release-please` y `changesets`. `Removed` o un cambio incompatible propone major, `Added` o `Changed` propone minor, y si solo hay `Fixed` propone patch. En pre-1.0 aplica `versionado.md`. La propuesta va con su motivo y la confirma el usuario (decisión 10): se contesta con un «sí», pero se pregunta siempre.
20. **Lista de tickets para el PM.** En modo `tracker`, el resumen de cierre lista los ids de ticket que entran en `[Unreleased]`, para marcarlos en el campo de versión del gestor (Fix Version en Jira, el campo equivalente en Azure DevOps).
21. **No se pregunta por lo que no ha pasado.** El acta solo se escribe si hay fuente: transcripción o notas que aporta el usuario, o un fichero en `.docs/sdd/releases/vX.Y.Z/`. Sin fuente, el paso se omite sin preguntar si hubo demo. La retro sigue con su predicado (`estimation-log.md`). En T18 el agente se paraba a preguntarlo y hubo que decirle «no hubo demo» de antemano.
22. **Bump con el tooling del proyecto.** Los proyectos del equipo guardan la versión en `package.json` y/o `dependencies.props` y la editan con un script de Node (dev-lead, 2026-09-21). Si `tech-stack.md` declara el comando de versión, se usa ese. Si no lo declara pero hay ficheros de versión, se actualizan esos ficheros y el resumen de cierre propone declarar el comando en `tech-stack.md`. Sin fichero de versión, la versión vive en el tag y en el changelog (M3).

## Intent

El kit tiene que poder trabajar sin releases, solo con task y patch, y publicar cuando el usuario quiera. Hoy eso funciona de hecho, pero no está declarado, y `sdd-end-release` supone que la release se abrió antes. Además, el carril supone cliente, fecha y varias personas. En un proyecto de una sola persona:
- pide una segunda confirmación de merge y tag sin información nueva;
- pregunta «comprometida o en preparación», y el dev-lead respondió «no te entiendo»;
- pide release notes y email sin nadie a quien enviarlos;
- pide un bump de versión sin fichero de versión.

La línea de smoke tampoco dice qué se cuenta, así que la métrica que defiende «release pequeña primero» no es comparable entre releases. Se quiere que el carril sea opcional y que se adapte a si hay destinatario, sin perder los gates que frenan errores reales.

## Scope

- Entra:
  - El modo incremental declarado: `sdd-start-release` opcional y `sdd-end-release` como corte de publicación sin apertura previa (pasos 1 y 6).
  - El campo `release.hasRecipient` de `sdd-kit.json`: lo pregunta y lo escribe la primera skill del carril que lo necesite, y este repo recibe su valor.
  - El gate de merge y tag acotado por tres condiciones comprobables: paso 7 y tabla de racionalizaciones.
  - La definición de comprometida y en preparación.
  - Release notes y email solo con destinatario: pasos 5 y 8, `notas-y-roadmap.md` y red flags.
  - El bump con el comando que declara `tech-stack.md`, con los ficheros de versión o sin fichero: paso 7 y `versionado.md`.
  - La versión propuesta desde el changelog y la lista de tickets en modo `tracker`: pasos 1 y 7.
  - El acta solo con fuente, sin preguntar por la demo: paso 2.
  - Los roles y el roadmap con gestor: una frase en el Overview de cada skill del carril.
  - La definición de smoke y hallazgo, en `notas-y-roadmap.md`.
  - La capacidad `release-flow`.
- No entra:
  - Editar `sdd-init-*` ni la pregunta de la entrevista «¿trabajas por releases o de forma incremental?», que son de la task 0012.
  - Reescribir el Art. IV.
  - Cambiar `release-notes-template.md`, `add-to-changelog` o las skills de task y patch.
  - El paso 8 de `sdd-end-task` con tareas que solo existen en el gestor: va a una task aparte.
  - Una migración `v1.2.0` para el campo.

## Approach

Toda la guía nueva está condicionada a dos predicados observables (Art. II): la existencia de la sección de la release en el roadmap (apertura sí o no) y el campo `release.hasRecipient` de `sdd-kit.json` (destinatario sí o no). Con apertura y con `true`, el carril se comporta exactamente como hoy. El gate acotado es guía de disciplina: condiciones enumeradas, red flag y racionalización para el caso en que falta una. Las definiciones (comprometida, smoke, hallazgo) son guía de forma: una línea cada una, en el punto de uso. Proceso: RED por punto con sujetos headless sobre un fixture de proyecto unipersonal, más un escenario de control con una condición ausente, porque el atajo no puede dispararse de más. Después, GREEN con los mismos escenarios.

## Delta de comportamiento

### Capacidad: `release-flow`

**ADDED — El carril release es opcional**
- GIVEN un proyecto que trabaja solo con task y patch, sin sección de release abierta en el roadmap
- WHEN se cierran tasks y patches
- THEN sus entradas van a `[Unreleased]` y ninguna skill de task o patch pide abrir una release
- AND el id de una task sin fila reservada sigue lo que ya declara `capabilities/task-ids.md` («Una task no planificada obtiene su id con un script determinista»); esta capacidad no lo repite

**ADDED — Se puede cerrar una release que no se abrió** *(sin guía nueva: el RED ya lo cumple 6/6)*
- GIVEN un roadmap sin sección de la release y un `[Unreleased]` con entradas
- WHEN el usuario lanza `sdd-end-release` para publicar
- THEN el scope que se congela es el contenido de `[Unreleased]`, el agente propone la versión y espera a que el usuario la confirme
- AND el paso del roadmap añade la entrada a «Releases cerradas» sin colapsar ninguna sección

**ADDED — El proyecto declara si sus releases tienen destinatario**
- GIVEN un `.docs/sdd/sdd-kit.json` sin `release.hasRecipient`
- WHEN se ejecuta `sdd-start-release` o `sdd-end-release`
- THEN el agente pregunta una sola vez si la release se entrega a alguien distinto de quien la hace, y escribe la respuesta en `release.hasRecipient` sin tocar los demás campos
- AND con el campo ya presente no se pregunta
- AND el agente no escribe ni cambia el campo sin una respuesta o petición explícita del usuario

**ADDED — El valor vigente del campo es el que se aplica**
- GIVEN un proyecto que cambia `release.hasRecipient` de `true` a `false`, o al revés, aunque sea con una release abierta
- WHEN se ejecuta `sdd-start-release` o `sdd-end-release`
- THEN la skill aplica el valor que tiene el campo en ese momento, sin migración y sin reescribir releases pasadas

**ADDED — Sin destinatario no se pregunta si la release está comprometida**
- GIVEN `release.hasRecipient: false`
- WHEN `sdd-start-release` llega al estado de la release
- THEN el estado es «en preparación» y no se pregunta
- AND con `true`, la pregunta usa las definiciones: comprometida = scope prometido al destinatario, normalmente con fecha; en preparación = cualquier otro caso

**ADDED — Merge y tag sin segunda ronda cuando la decisión ya está tomada**
- GIVEN un cierre con `sdd-end-release` en el que se cumplen las tres condiciones: (a) un mensaje del usuario en esta conversación ordena el cierre; (b) el usuario ha escrito o aceptado la versión exacta respondiendo a la propuesta del paso 1; (c) `sdd-kit.json` tiene `release.hasRecipient: false`, escrito por respuesta o petición explícita del usuario, y no se ha movido ningún item del scope desde la orden de cierre
- WHEN se llega al paso de versión y tag
- THEN el agente presenta el resumen de cierre citando literal la orden de cierre y la respuesta de versión, y ejecuta el merge y el tag en el mismo turno, sin pedir otra confirmación

**ADDED — Sin una de las tres condiciones, el gate de merge y tag se mantiene**
- GIVEN un cierre con `sdd-end-release` en el que falta cualquiera de las tres condiciones (la skill la disparó el agente sin orden del usuario, la versión la ha supuesto el agente o solo venía en el encargo, `hasRecipient` es `true`, el agente escribió `false` sin respuesta del usuario, o se movió scope)
- WHEN se llega al paso de versión y tag
- THEN el agente prepara el merge y el tag, los presenta y espera la confirmación explícita, como hasta ahora

**ADDED — Sin destinatario no hay release notes ni email**
- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escriben `release-notes.md` ni el borrador de email, el paso «Comunicar» no aplica y la entrada del roadmap enlaza al changelog (y al acta si existe)

**ADDED — La carpeta de la release existe solo si tiene contenido**
- GIVEN `release.hasRecipient: false` y un cierre sin acta (no hubo demo ni retro)
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- AND con destinatario o con acta, la carpeta sigue siendo obligatoria

**ADDED — El bump usa el tooling del proyecto** *(sin guía nueva: el RED ya lo cumple 2/2)*
- GIVEN un `tech-stack.md` que declara el comando que cambia la versión (p. ej. un script de Node)
- WHEN se llega al bump
- THEN se ejecuta ese comando con la versión confirmada y no se editan los ficheros a mano
- AND si no hay comando declarado pero sí ficheros de versión (`package.json`, `*.props`, `*.csproj`, `plugin.json`, etc.), se actualizan esos ficheros y el resumen de cierre propone declarar el comando en `tech-stack.md`

**ADDED — Sin fichero de versión, la versión vive en el tag y en el changelog** *(sin guía nueva: el RED ya lo cumple 4/4)*
- GIVEN un proyecto sin fichero de versión ni comando declarado
- WHEN se llega al bump
- THEN no se crea ningún fichero para la versión: la registran el tag anotado y la cabecera del changelog sellado

**ADDED — La versión se propone desde el changelog** *(sin guía nueva: el RED ya lo cumple 6/6)*
- GIVEN un `[Unreleased]` con entradas
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la propuesta sale de las secciones de `[Unreleased]` (`Removed` o incompatible → major; `Added` o `Changed` → minor; solo `Fixed` → patch; en pre-1.0, según `versionado.md`) y va con su motivo
- AND la versión sigue esperando la confirmación explícita del usuario

**ADDED — En modo tracker, el cierre lista los tickets**
- GIVEN `ids.mode: tracker`
- WHEN se presenta el resumen de cierre
- THEN incluye los ids de ticket de las entradas de `[Unreleased]` que entran en la versión

**ADDED — El acta solo se escribe si hay fuente** *(sin guía nueva: sin destinatario, el RED ya lo cumple 4/4)*
- GIVEN un cierre sin transcripción ni notas aportadas por el usuario y sin fichero de fuente en `.docs/sdd/releases/vX.Y.Z/`
- WHEN `sdd-end-release` llega al acta
- THEN omite el paso sin preguntar si hubo demo o reunión

**ADDED — La línea de smoke se cuenta igual en todas las releases**
- GIVEN el cierre de una release
- WHEN se escribe la línea de smoke en el roadmap
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

**Reglas de la capacidad**
- **Dónde viven los datos**: si la release tiene destinatario vive en `.docs/sdd/sdd-kit.json` (`release.hasRecipient`, booleano), junto a `version` e `ids`. El nombre del destinatario no se guarda en la configuración.
- **Idioma de los nombres**: la clave va en inglés camelCase, como `ids.mode`.
- **Límites**: no aplica.
- **Avisos**: una sola pregunta cuando falta el campo, la hace la primera skill del carril que lo necesita. No hay ninguna otra.
- **Regla ante conflicto**: manda el valor vigente del campo al ejecutarse cada skill. Solo lo escribe o lo cambia el usuario, directamente o respondiendo al agente. Si falta el campo o hay duda sobre quién lo escribió, se aplica el gate completo.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada: «si, si lo ves claro adelante» (tras añadir roles, versión propuesta, lista de tickets, acta sin pregunta y bump con tooling) |
