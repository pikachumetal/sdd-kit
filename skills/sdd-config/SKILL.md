---
name: sdd-config
description: Usar cuando hay que crear, revisar o poner al día la configuración del kit SDD de un proyecto con .docs/sdd/ — "configura el kit", "revisa la configuración", "quiero trabajar en pair solo yo", "déjamelo configurado para mí", una preferencia personal que no debe cambiar la del equipo — o cuando una init o una migración llega a las claves del kit y la invoca.
argument-hint: "<qué quieres configurar>"
---

# sdd-config

## Overview

La configuración del kit vive en dos ficheros. `.docs/sdd/sdd-kit.json` es del proyecto y está en git. `.docs/sdd/sdd-kit.local.json` es de cada persona y no va a git. Esta skill es la única entrevista de claves del kit: la invoca el usuario, y la invocan `sdd-init-greenfield`, `sdd-init-brownfield` y las migraciones en lugar de llevar sus propias preguntas. Qué admite cada fichero, la precedencia y los avisos están en el contrato: [control-profiles.md](../sdd-start-task/references/control-profiles.md).

## Pasos

1. **Leer y enseñar** — lee `.docs/sdd/sdd-kit.json` y `.docs/sdd/sdd-kit.local.json` (búscalo aunque no aparezca al listar la carpeta). Antes de la primera pregunta, enseña una tabla con cada clave del catálogo: su valor y el fichero de donde sale, o «falta» y el default que rige. Debajo, un aviso por cada clave del fichero local que se ignora, con la línea literal del contrato. Si te invoca una init o una migración, la tabla lleva solo lo que ya existe.
2. **Preguntar** — solo lo que falta, o lo que el usuario pide cambiar. **Una pregunta cerrada por turno**, con la opción recomendada primero y su motivo, sacados del catálogo. Una clave con valor no se vuelve a preguntar salvo que el usuario lo pida. Si el usuario invoca la skill por su cuenta, pregunta antes a quién aplica `control.profile` o `execution`: «¿para todo el equipo (`sdd-kit.json`) o solo para ti (`sdd-kit.local.json`)?». Recomienda «solo para ti» si el proyecto ya tiene la clave, y «para el equipo» si falta.
3. **Escribir** — cada respuesta, en su fichero (columna «Fichero» del catálogo). Si te invoca una init o la migración, escribe solo en `sdd-kit.json`: una init fija el proyecto, no a quien la ejecuta. «No sé» no escribe la clave y rige su default, y lo que no se preguntó no se escribe. Esa respuesta es la frase del usuario: anotarla no es el atajo autoconcedido. Antes de crear `.docs/sdd/sdd-kit.local.json`, comprueba que `.gitignore` tiene esa línea y añádela si falta, sin duplicar. El fichero local no se commitea ni lleva el nombre de nadie: el nombre sale de `git config user.name`.
4. **Sin usuario** — no escribas nada. Devuelve a quien te invocó la lista de preguntas pendientes, para su informe o su resumen de cierre. Rigen los defaults.

## Catálogo

| # | Pregunta | Recomendada y motivo | Escribe | Fichero |
| --- | --- | --- | --- | --- |
| 1 | ¿Cómo se numeran las tasks: ids del gestor de tickets (`tracker`) o secuencia propia del proyecto (`sequence`)? | Recomendado `tracker` si hay gestor de tickets: el id enlaza la task con su ticket. Sin gestor, `sequence` | la respuesta: `ids.mode`; «no sé»: nada, y rige `tracker` | `sdd-kit.json` |
| 2 | ¿Con qué perfil de control trabajáis: `pair`, `delegate` o `unattended`? | Recomendado `delegate`: para en la spec, en los desvíos y en la validación, y se ahorra el gate del plan; con menos paradas, la 0.6.0 cerró tres tasks en un día | `control.profile` | el que diga el usuario; en una init o una migración, `sdd-kit.json` |
| 3 | Al cerrar una task, ¿fusiono a `<rama de integración>` con `--no-ff` y dejo que el worktree lo borre una persona? | Recomendado sí: `--no-ff` deja la task en un commit que se revierte de una vez, y borrar un worktree es irreversible si quedan cambios sin commit | «sí»: `merge` entero (`into`: la rama, `noFf: true`, `removeWorktree: false`); otra combinación dicha entera: esa; «no» o «no sé»: nada, y el cierre de task pregunta | `sdd-kit.json` |
| 4 | Tras fusionar en `<rama de integración>`, ¿hago push de esa rama a su remoto sin preguntar? | Recomendado sí si la convención es `main` estable y `develop` de integración (git-flow): la rama de integración es compartida, y un merge sin push no lo ve nadie más; la rama estable, los tags y cualquier otro push siguen siendo de una persona. Con otra convención, sin recomendación | «sí»: `merge.push: true`; «no»: `merge.push: false`; «no sé»: nada, y el cierre no hace push | `sdd-kit.json` |
| 5 | ¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, y aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo? | Recomendado sí: son los defaults del kit; su conducta la define la task 0022 | «sí» o números propios: `control.maxParallelAgents`, `control.silence.betweenStepsMinutes`, `control.silence.longCommandMinutes`; «no sé»: nada, y rigen los defaults | `sdd-kit.json` |
| 6 | ¿Cómo se ejecutan los planes: `auto` (cada plan recomienda su método), `native` (en la sesión; tras una compactación con dos o más tasks pendientes, lo que queda va con subagentes) o `subagent` (siempre con subagentes)? | Recomendado `auto`: el handoff de `writing-plans` pesa cada plan: Native es lo más barato, y los subagentes quedan para los planes largos o cuando se quiere revisión por task | la respuesta: `execution`; «no sé»: nada, y rige `auto` | el que diga el usuario; en una init o una migración, `sdd-kit.json` |
| 7 | Cuando te toque validar una task, ¿quieres que arranque el entorno antes de darte el guion de pruebas? | Recomendado no, el default: la validación te dice cómo arrancarlo. Sí, si prefieres encontrarte la aplicación levantada | «sí»: `validation.startEnvironment: true`; «no»: `false`; «no sé»: nada | `sdd-kit.local.json` |

- **Quién pregunta qué**: una init o una migración hacen de la 1 a la 6, en ese orden y saltando las que ya tienen clave. La 7 es personal: solo la hace el usuario que invoca la skill.
- **Rama de integración** de las preguntas 3 y 4: la de la convención de ramas (greenfield) o la que se ve en el repo (brownfield); la pasa quien invoca. Si la integración va directa a la rama estable, la 3 no se hace y `merge` queda sin declarar: el merge a la rama estable lo decide siempre una persona.
- **Push** de la pregunta 4: solo se hace si la 3 dejó `merge` declarado. Sin `merge`, no hay merge que empujar.
- **Claves de política**: `ids`, `merge`, los frenos y cualquier otra que no sea `control.profile`, `execution` o `validation.startEnvironment` van siempre a `sdd-kit.json`. Si el usuario pide una solo para él, explícale que es del proyecto y ofrécele cambiarla para el equipo.
