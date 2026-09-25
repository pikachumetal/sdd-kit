---
id: 20260924-220849-task-0061-local-config
task: 0061
title: Configuración personal y skill de configuración
mode: full
status: approved
created: 2026-09-25
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Configuración personal y skill de configuración

## Decisiones que he tomado yo — valida estas

Review de spec: un revisor, lente técnica con los siete puntos. Señales: capacidad nueva (`configuration`), contrato público (un fichero de configuración nuevo que leen varias skills), MODIFIED y REMOVED (seis MODIFIED en `onboarding` y `migration`, y un REMOVED con su ADDED en `control-profiles`), tres o más capacidades (`configuration`, `control-profiles`, `onboarding`, `migration`) y dato persistente nuevo (`.docs/sdd/sdd-kit.local.json`).
- Técnica: si la precedencia de «El perfil se hereda de la task, de la persona, de la release o del proyecto» choca con la regla de `execution` sin nivel de release, y si el MODIFIED de «Lo que escribe una migración lo reciben también las init» sigue siendo verificable cuando la entrevista sale de las init (señal: contrato público + MODIFIED)
- Mínimo razonable: un revisor en lugar de los dos que da la rúbrica. Queda sin una lente dedicada el complemento de dominio, es decir, qué no puede hacer el fichero local. Lo cubre el punto 5 bis, porque el revisor único recibe los siete puntos. Elijo uno porque tu CLAUDE.md pide confirmación antes de lanzar subagentes en paralelo y esta spec va delegada.

1. **Nombre de la skill: `sdd-config`**. Es neutro (no dice task ni feature, así que la 0064 no lo toca) y va con el patrón de `sdd-consult`. Descartado `sdd-setup`, porque suena a init.
2. **Ruta del fichero local: `.docs/sdd/sdd-kit.local.json`**, junto a `sdd-kit.json`, con el mismo sufijo `.local` que `settings.local.json` de Claude Code. Queda fuera de git con la línea `.docs/sdd/sdd-kit.local.json` en `.gitignore`. La escriben las dos init y el paso 3 de `migrations/v1.2.0.md`. Este repo, que no tenía `.gitignore`, estrena uno con esa línea (dogfooding).
3. **Claves admitidas en local, lista cerrada**: `control.profile` (`pair` | `delegate` | `unattended`), `execution` (`auto` | `native` | `subagent`) y **`validation.startEnvironment`** (booleano, default `false`, que es la conducta de hoy). El nombre dice qué hace («arrancar el entorno») y dónde («validación»). El bloque `validation` deja sitio a otras preferencias de validación sin inventarlas ahora.
4. **Todo lo que no está en la lista se ignora con aviso**: las claves de política (`merge`, `ids`, `release`, cualquier nivel o suelo de tests), las desconocidas y una clave de nombre de persona. Así una clave de política futura queda fuera sin tocar la regla. Forma del aviso: `Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.` Una clave admitida con un valor fuera de su tipo también se ignora, con `Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.`
5. **Quién avisa**: quien resuelve la configuración. Es `sdd-start-task` en la primera pregunta (el perfil vigente) y en el plan (`execution`), y `sdd-config` al enseñar lo que hay. La regla se escribe una vez en `control-profiles.md`, que ya lleva la precedencia.
6. **Precedencia**:
   - Perfil: task → local → release → proyecto, como dice la fila.
   - `execution`: método que el dev-lead nombra para la task → local → proyecto. No tiene nivel de release, igual que hoy. Un `execution: auto` en local cuenta como nivel: pisa un `native` o `subagent` del proyecto y deja que elija el handoff.
   - `validation.startEnvironment`: solo local; sin el fichero, `false`.
7. **`validation.startEnvironment` queda admitida y documentada, pero su lector no entra en esta task.** Quien la lee es el paso 7 de `sdd-start-task`, y ese paso es de la 0060, en paralelo, que además le añade el guion de pruebas donde encaja la preferencia. El requisito de conducta y la línea del paso 7 van a una fila nueva de deuda del roadmap, «Leer `validation.startEnvironment` en la validación», a hacer tras la 0060. Mientras tanto, la clave se admite sin aviso, se enseña y no cambia nada (con `false`, la conducta es la de hoy). Así no toco lo que me pediste no tocar. El coste: hasta esa fila, el compañero que la ponga a `true` no verá el entorno arrancado.
8. **Fuente única de la entrevista**. La tabla «Preguntas de las claves de control» sale de `control-profiles.md` y pasa a `sdd-config`, junto con la pregunta de `ids.mode` (hoy repetida en las dos init y en el paso 1 de la v1.2.0) y la de `validation.startEnvironment`. `control-profiles.md` se queda con el contrato: la tabla de claves, tipos, defaults y la precedencia. Las dos init y la v1.2.0 invocan `sdd-config` con el tool `Skill` y le pasan lo que solo ellas saben: la rama de integración y si el usuario está.
9. **`tests/MigrationInitParity.Tests.ps1` cambia, no se retira**. La comprobación de tokens sigue viva, porque el corpus de cada init incluye `sdd-config` por su enlace. Se añaden tres cosas: el texto de las preguntas solo aparece en `skills/sdd-config/`, las dos init y la v1.2.0 nombran `sdd-config`, y la línea `.docs/sdd/sdd-kit.local.json` de `.gitignore` está en las dos init. Los tests que fijan el número de la pregunta del proyecto de referencia (22 y 8) se ajustan a la numeración nueva.
10. **Dónde escribe cada respuesta**: si la invoca una init o la migración, solo en `sdd-kit.json`, porque la init fija el proyecto. Si la invoca el usuario, para `control.profile` y `execution` pregunta antes si es para el equipo o solo para él (recomendado: solo para él si el proyecto ya tiene la clave, y para el equipo si falta). Las claves de política van siempre a `sdd-kit.json` y `validation.startEnvironment`, siempre a local.
11. **Las init no preguntan las preferencias personales**: el resumen de cierre dice que se fijan con `sdd-config`. Una init fija el proyecto, no a quien la ejecuta.
12. **`release.hasRecipient` no entra en `sdd-config`**. Hoy no la pregunta ninguna init: la preguntan `sdd-start-release` y `sdd-end-release` cuando la necesitan. Moverla sería alcance nuevo.
13. **`plan-template.md` no se toca** (es de la 0060). El paso 5 de `sdd-start-task` dice que la cabecera nombra el fichero donde está fijado el método (`fijado en sdd-kit.local.json` si viene de local). Alinear el texto de la plantilla va en la misma fila de deuda de la decisión 7.
14. **El nombre de quien trabaja no se guarda**, por decisión del dev-lead ya tomada. Lo que lo necesite lo saca de `git config user.name`, y una clave con un nombre en el fichero local se ignora con el aviso de la decisión 4.
15. **Capacidad nueva `configuration`**: el fichero local y la skill `sdd-config`. `control-profiles`, `onboarding` y `migration` reciben MODIFIED donde su texto ya no es verdad.
16. **Campaña del Art. I**, con previsión y techo comunes para el RED (antes de escribir `sdd-config`) y el GREEN. El lanzador lleva `SUBJECT_CAP` y para si existe el fichero `stop` a su lado. Sujetos Sonnet sin `AskUserQuestion`: un sujeto headless termina su turno en la primera pregunta, y eso es lo que se mide.
    - c1 «preferencia personal»: una persona pide `pair` y el entorno arrancado solo para ella. Se mide que `sdd-kit.json` no cambie, que el fichero local tenga las dos claves y ningún nombre, y que `.gitignore` tenga la línea y el fichero local no se commitee.
    - c2 «política en local»: con un fichero local que trae `control.profile: pair`, `merge.noFf` e `ids.mode`, se mide que la primera pregunta de `sdd-start-task` proponga `pair` y avise nombrando las dos claves ignoradas.
    - c3 «poner al día»: con un `sdd-kit.json` sin `execution` ni `merge.push`, se mide que enseñe lo que hay antes de preguntar, que haga una sola pregunta cerrada con la recomendada primero y que no escriba claves sin respuesta.
    - c4 «migración», control de no regresión: con un proyecto en v1.1.0 y «actualízame al kit», se mide que la primera pregunta sea una sola, con su recomendación, y que salte lo que ya existe.
    - **Previsión**: 14 sujetos (RED: c1, c2 y c3 ×2 y c4 ×1; GREEN, lo mismo), unos 10 $ y unas 2 h de reloj.
    - **Techo**: 20 sujetos, 16 $ y 3 h. Si se supera, REFACTOR incluido, paro y decides tú.
    - Antes de recortar un requisito por un baseline limpio, miro de dónde sacó cada sujeto la conducta. Si la sacó de una fuente incidental, lanzo otra tanda antes de recortar (Art. I).
17. **Un commit por hito**: apertura (esta spec y el plan), RED, fichero local y precedencia, `sdd-config` con las init y la migración, GREEN y cierre.

### Hallazgos de la review

- **Rechazado** — Crítico: «La entrevista fija las cinco reglas de producto» dice que el bloque de proceso decide el modo de ids, y eso sería un MODIFIED sin declarar → sigue siendo verdad: la init lo decide, ahora a través de `sdd-config`. El requisito no nombra quién hace la pregunta.
- **Aceptado** — el Scope no nombraba `control-profiles.md` → añadido en «Entra».
- **Aceptado** — el WHEN «se lo pide al agente» no se podía verificar → acotado a invocar `sdd-config` o a la petición que la dispara.
- **Aceptado** — otros tests citan la tabla movida → en el Scope entra `tests/ControlProfiles.Tests.ps1`, que la cita; la evidencia histórica no se edita.
- **Aceptado** — `execution: auto` en local no estaba cubierto → cuenta como nivel: decisión 6 y un AND en el ADDED del método local.
- **Aceptado** — el recuento de MODIFIED no cuadraba → corregido en el bloque de la review.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil `delegate`, la fila 0061 como enunciado, sin partir, y la spec aprobada por delegación: «Entera y apruebo la spec por delegación» (2026-09-25).
- Sin prefijo de ids por persona, el nombre de quien trabaja sale de `git config user.name`, no tocar `plan-template.md`, `spec-template.md` ni los pasos 6 y 7 de `sdd-start-task` (los lleva la 0060), y el Art. I proporcional con previsión y techo comunes: petición de arranque del 2026-09-25.

## Intent

Hoy todo lo configurable vive en `sdd-kit.json`, que está en git y es del equipo. Un compañero que quiere trabajar en `pair` mientras el dev-lead trabaja en `delegate` solo puede cambiar el fichero de todos o cambiar el perfil task a task. En su proyecto lo resolvió con ficheros propios que el kit no lee. Además, las preguntas de las claves se reparten entre `control-profiles.md`, las dos init y la migración, y el modo de ids se pregunta en tres sitios. Esta task separa lo personal de lo del proyecto y deja la entrevista de claves en una sola skill que también puede invocar el usuario.

## Scope

- Entra:
  - `skills/sdd-start-task/references/control-profiles.md`: pierde la tabla de preguntas y gana el fichero local en la precedencia, la sección de claves admitidas con su aviso y `validation.startEnvironment` en la tabla de claves.
  - `.docs/sdd/sdd-kit.local.json`: las tres claves admitidas, la precedencia, el aviso de lo que se ignora y la línea de `.gitignore` (init, v1.2.0 y este repo).
  - La skill `sdd-config`: enseñar lo que hay, preguntar lo que falta de una en una con la recomendada primero, y escribir cada respuesta en su fichero.
  - Que las dos init y la v1.2.0 invoquen `sdd-config` en lugar de llevar sus preguntas.
  - `tests/MigrationInitParity.Tests.ps1` ajustado, y `tests/ControlProfiles.Tests.ps1` si cita la tabla movida (la evidencia `tests/*.md` de campañas pasadas no se edita: es histórica).
  - El README, la mission y el recuento de skills.
  - La campaña RED/GREEN.
- No entra:
  - La conducta de `validation.startEnvironment` en el paso 7 (decisión 7).
  - `plan-template.md`, `spec-template.md` y los pasos 6 y 7 de `sdd-start-task`.
  - `release.hasRecipient` en `sdd-config`.
  - Prefijo de ids por persona.
  - Guardar el nombre de quien trabaja.
  - Preguntar las preferencias personales en las init.

## Approach

`control-profiles.md` sigue siendo el contrato: gana el fichero local en la precedencia, una sección que lista las claves admitidas y el aviso, y `validation.startEnvironment` en la tabla de claves. Pierde la tabla de preguntas, que pasa a `skills/sdd-config/SKILL.md` como catálogo con qué escribe cada respuesta y en qué fichero. `sdd-config` es una skill de forma, no de disciplina: tiene un paso de lectura, uno de preguntas y uno de escritura, y cada uno se condiciona a quién la invoca. Las init y la migración la invocan en el punto donde hoy hacen sus preguntas. La guía nueva sale del RED (Art. II): lo que el baseline ya hace bien no se escribe.

## Delta de comportamiento

### Capacidad: `configuration`

**ADDED — Las preferencias personales viven en `sdd-kit.local.json`, fuera de git**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` y una persona que quiere otro `control.profile`, otro `execution` o `validation.startEnvironment` solo para sí
- WHEN invoca `sdd-config`, o pide configurar el kit solo para sí (la petición que dispara `sdd-config`), y responde que es solo para ella
- THEN el valor se escribe en `.docs/sdd/sdd-kit.local.json` y `sdd-kit.json` no cambia
- AND `.gitignore` tiene la línea `.docs/sdd/sdd-kit.local.json` antes de que el fichero exista; si falta, se añade sin duplicar
- AND el fichero local no se commitea y no lleva el nombre de la persona

**ADDED — Una clave no admitida en el fichero local se ignora con aviso**
- GIVEN un `.docs/sdd/sdd-kit.local.json` con una clave fuera de `control.profile`, `execution` y `validation.startEnvironment` (p. ej. `merge.noFf` o `ids.mode`), o una admitida con un valor fuera de su tipo
- WHEN el agente resuelve la configuración vigente
- THEN esa clave no se aplica: rige la del siguiente nivel de la precedencia
- AND el agente muestra un aviso por clave, con su nombre, con la forma de «Avisos» de esta capacidad

**ADDED — `sdd-config` enseña la configuración antes de preguntar**
- GIVEN un proyecto con `sdd-kit.json`, con `sdd-kit.local.json` o sin él
- WHEN el usuario invoca `sdd-config`
- THEN antes de la primera pregunta el agente muestra cada clave con su valor y su fichero, y las que faltan con el default que rige
- AND muestra los avisos de las claves ignoradas del fichero local

**ADDED — `sdd-config` pregunta una clave por turno, con la recomendada primero**
- GIVEN claves que faltan en `sdd-kit.json` (p. ej. `execution` y `merge.push` en un proyecto de antes de la 0055) o una clave que el usuario quiere cambiar
- WHEN `sdd-config` pregunta
- THEN hace una sola pregunta cerrada por turno, con la opción recomendada primero y su motivo, sacados de su catálogo
- AND no vuelve a preguntar una clave que ya tiene valor, salvo que el usuario pida cambiarla

**ADDED — `sdd-config` escribe solo lo respondido, en el fichero que toca**
- GIVEN una respuesta del usuario a una pregunta de `sdd-config`
- WHEN la escribe
- THEN una clave de política (`ids`, `merge`, frenos de `control`) va a `sdd-kit.json`; `validation.startEnvironment` va a `sdd-kit.local.json`; `control.profile` y `execution` van donde el usuario diga (invocada por una init o por la migración, siempre a `sdd-kit.json`)
- AND «no sé» no escribe la clave y rige su default; lo que no se preguntó no se escribe
- AND invocada por una init o por una migración no escribe: devuelve las respuestas y quien la invocó las escribe en `sdd-kit.json`, en su paso de estructura o de marcador (enmienda del 2026-09-25)
- AND sin usuario no escribe nada: las preguntas quedan como pendientes explícitas en el informe de quien la invocó

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (proyecto, en git) y `.docs/sdd/sdd-kit.local.json` (persona, fuera de git); el catálogo de preguntas, en `skills/sdd-config/SKILL.md`.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como en `control-profiles`: `validation.startEnvironment`.
- **Límites**: el fichero local admite solo `control.profile`, `execution` y `validation.startEnvironment`.
- **Avisos**: `Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.` · `Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.`
- **Regla ante conflicto**: la precedencia de `control-profiles`; una clave ignorada no cuenta como nivel.

### Capacidad: `control-profiles`

**REMOVED — El perfil se hereda de la task, de la release o del proyecto**
- motivo: entra el nivel de la persona; lo sustituye el requisito siguiente, con título nuevo.

**ADDED — El perfil se hereda de la task, de la persona, de la release o del proyecto**
- GIVEN un perfil en el `profile:` de la spec, `control.profile` en `.docs/sdd/sdd-kit.local.json`, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap o `control.profile` en `sdd-kit.json`
- WHEN el agente determina el perfil vigente
- THEN manda la task sobre la persona, la persona sobre la release y la release sobre el proyecto; una spec sin `profile:` hereda
- AND la primera pregunta de `sdd-start-task` nombra el perfil vigente y de qué nivel sale
- AND el agente solo escribe un `profile`, un `control.*` o un `merge` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`; en `sdd-kit.local.json`, que no se commitea, basta la respuesta del usuario a `sdd-config`)

**ADDED — Un método fijado en `sdd-kit.local.json` manda sobre el del proyecto**
- GIVEN una task en modo full con la spec aprobada y `execution: native` o `execution: subagent` en `.docs/sdd/sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.local.json` y no pregunta el método en ningún perfil, aunque `sdd-kit.json` diga otro valor
- AND un método que el dev-lead nombra para la task manda sobre los dos ficheros
- AND un `execution: auto` en `sdd-kit.local.json` también cuenta: el método lo recomienda el handoff aunque `sdd-kit.json` fije `native` o `subagent`

**MODIFIED — El método de ejecución lo elige el handoff del plan** (antes: GIVEN sin mirar `sdd-kit.local.json`; enmienda del 2026-09-25)
- GIVEN una task en modo full con la spec aprobada, superpowers ≥ 6.4.1, `execution` ausente o `auto` en `sdd-kit.json` y sin `native` ni `subagent` en `sdd-kit.local.json`, o `execution: auto` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN en `delegate` y `unattended` no para: toma el método que recomienda el handoff de `writing-plans` y lo escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo sacado del plan>`
- AND en `pair` la parada del plan es una sola pregunta que aprueba el plan y elige el método, con la recomendación del handoff como primera opción; no hay una parada aparte para el método
- AND ninguna task del plan lleva un campo `Ejecución` propio: el método es del plan entero, salvo el cambio a SDD tras una compactación

**MODIFIED — Un método fijado en `sdd-kit.json` no se pregunta** (antes: GIVEN sin mirar `sdd-kit.local.json`; enmienda del 2026-09-25)
- GIVEN una task en modo full con la spec aprobada, `execution: native` o `execution: subagent` en `sdd-kit.json` y sin `execution` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.json` y no pregunta el método en ningún perfil
- AND el valor fijado manda aunque el handoff recomiende el otro método
- AND en `pair` la parada del plan solo pide aprobarlo

**Reglas de la capacidad**
- **Dónde viven los datos**: se añade `.docs/sdd/sdd-kit.local.json` (`control.profile`, `execution`, `validation.startEnvironment`), fuera de git.
- **Regla ante conflicto**: el perfil sigue task → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la task → persona → proyecto, sin nivel de release.

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las claves de control** (antes: «el agente hace… las preguntas del bloque de `control-profiles.md`»)
- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves del kit
- THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos) y método de ejecución (`auto`)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND en brownfield sin usuario, las preguntas quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults
- AND la init no pregunta las preferencias personales: el resumen de cierre dice que se fijan con `sdd-config`

**MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados** (antes: `.gitignore` con dos líneas)
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea la estructura del proyecto
- THEN `.claude/settings.json` tiene `"autoMemoryEnabled": false` y conserva las demás claves que ya tuviera
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` una sola vez cada una
- AND si `.claude/settings.json` ya tenía `"autoMemoryEnabled": true`, el agente pregunta antes de cambiarlo; si el usuario dice que no, la clave se queda en `true` y el resumen de cierre lo anota

**MODIFIED — La constitution nombra el proyecto de referencia** (antes: «la pregunta 21 de greenfield y la 7 de brownfield»; enmienda del 2026-09-25)
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro, que es la pregunta 18 de greenfield y la 4 de brownfield
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

### Capacidad: `migration`

**MODIFIED — La migración a v1.2.0 pregunta el modo de ids** (antes: el paso presenta los dos modos por su cuenta)
- GIVEN un proyecto que migra a v1.2.0 y cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el paso es un **gate**: invoca `sdd-config`, que presenta los dos modos con la pregunta de su catálogo, y escribe la respuesta
- AND si el dev-lead no está, el paso queda pendiente explícito y el proyecto sigue funcionando en `tracker`

**MODIFIED — La migración a v1.2.0 pregunta las claves de control que faltan** (antes: «las preguntas del bloque de `control-profiles.md`»)
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo, `merge.push` con el bloque `merge` completo, las claves de frenos (`control.maxParallelAgents`, `control.silence.*`) o `execution`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente invoca `sdd-config`, que hace una por turno las preguntas de su catálogo que corresponden a lo que falta, las mismas que en la init y con la misma recomendación, y escribe solo lo que se responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults (`execution: auto` incluido), con el paso 10 del cierre preguntando el merge y sin push, y el informe dice cómo reanudarlo

**MODIFIED — La migración a v1.2.0 deja la configuración que deja la init** (antes: dos líneas en `.gitignore`)
- GIVEN un proyecto que migra a v1.2.0 sin `"autoMemoryEnabled": false` en `.claude/settings.json` o sin `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` en `.gitignore`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el proyecto queda con la clave y las tres líneas, igual que tras una init, sin duplicar líneas ni tocar las demás claves
- AND si la clave estaba a `true`, el agente pregunta antes de cambiarla; si el usuario dice que no, se queda en `true` y el informe lo anota
- AND si ya estaban, el paso se salta y lo dice

**MODIFIED — Lo que escribe una migración lo reciben también las init** (antes: sin la entrevista en una skill aparte)
- GIVEN una migración de `skills/sdd-init-brownfield/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init-greenfield` o en `sdd-init-brownfield`, contando su `SKILL.md`, sus `references/` y los documentos que estos enlazan, `sdd-config` incluido
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en una init o en una migración, o si una de ellas no nombra `sdd-config`

## Enmiendas

- 2026-09-25 — Cuatro cambios del delta, de la revisión final de rama: (1) MODIFIED «El método de ejecución lo elige el handoff del plan» y (2) MODIFIED «Un método fijado en `sdd-kit.json` no se pregunta», con el fichero local en el GIVEN, para que la capacidad no se contradiga al fusionar; (3) MODIFIED «La constitution nombra el proyecto de referencia», con las preguntas 18 y 4; (4) `sdd-config`, invocada por una init o una migración, devuelve las respuestas y escribe quien la invocó, para que `sdd-kit.json` no nazca sin `version` — por qué: la review final vio requisitos vigentes que el delta dejaba contradictorios y una escritura temprana en las init — aprobada: «Apruebo la enmienda (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Entera y apruebo la spec por delegación» |
