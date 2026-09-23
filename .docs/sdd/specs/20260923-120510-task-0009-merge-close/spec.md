---
id: 20260923-120510-task-0009-merge-close
task: 0009
title: Merge en el cierre
mode: full
status: draft
created: 2026-09-23
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Merge en el cierre

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` («El merge a develop sigue la política declarada»), contrato público (el Art. IV fija la política de merge a los proyectos)
- Mínimo razonable: ninguna — deja sin cubrir que una segunda lectura busque otra salida del worktree temporal que el RED no probó (p. ej. una rama destino sacada en un worktree bloqueado con `git worktree lock`)

1. **Alcance recortado por el RED previo** ([evidencia](red/README.md), 14 sujetos, 7,72 $). Entran los cuatro frentes que fallan: worktree temporal mal colocado o feature cambiada de rama (R1, 3/3), patch que ignora `merge.noFf` (R2, 2/2), informe de la denegación sin comando ni hash (R3, 3/3) y `estimation-log.md` resuelto a mano (R5, 2/2). Quedan fuera, como posible falso negativo, los que pasan sin guidance: cambios sin commitear en el checkout destino (R4, 2/2), suite sobre el resultado del merge (7/7 la corren, porque lo pide `finishing-a-development-branch`), `--no-verify` (0/14) y reintentar tras la denegación (0/3).
2. **El ensayo con `git worktree add --detach` no entra.** Ningún escenario mostró el fallo que evita: el sujeto que fusiona en el worktree temporal ya ejecuta la suite antes de retirarlo. Sin fallo, el Art. I no admite la guidance. Va a deuda con su disparador: una rama destino que avanza con un merge cuya suite falla.
3. **El cierre de patch aplica la política igual que el de task.** Hoy `sdd-end-patch` paso 6 deja siempre el merge al usuario y no lee `sdd-kit.json`: con `noFf: true` declarado, 2/2 sujetos fusionaron en fast-forward. En `delegate` y `unattended`, con el bloque completo, fusiona sin preguntar; sin bloque o en `pair`, pregunta como hoy. El Art. IV cambia de «(hoy, el cierre de task)» a «(el cierre de task y el de patch)». No lo trato como cambio mayor: la convención (el merge sigue la política declarada) no cambia, solo cambia qué skills la aplican.
4. **La receta tiene una sola fuente**: una referencia nueva, `skills/sdd-end-task/references/merge-recipe.md`, enlazada desde el paso 10 de `sdd-end-task` y el paso 6 de `sdd-end-patch`. Lo que gobierna la decisión va en una frase en cada `SKILL.md`: cuándo se usa la receta, dónde va el worktree y lo que nunca se hace. En la 0013 una regla que solo vivía en `references/` se leyó 0 de 2 veces. La descarto en `control-profiles.md` porque ese fichero trata de dónde para el agente, no de comandos.
5. **Dónde va el worktree temporal**: en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, y se retira con `git worktree remove`. El sujeto que lo puso junto al repo bare (`git/wt/`) también falló: «junto a los demás» se define por el worktree de la feature, no por el repo.
6. **La receta sustituye la opción 1 de `finishing-a-development-branch` cuando la rama destino no está sacada en ningún worktree.** Esa opción hace `cd` a la raíz del repo principal y `git checkout <base>`, y en un repo bare esa raíz no es un working tree: 8 de 12 sujetos ejecutaron el comando, recibieron `fatal: not a git repository` e improvisaron. Es el hueco que el Art. IX (regla 3) pide escribir y documentar. El resto de la skill (suite, menú en `pair`, limpieza) sigue siendo de superpowers.
7. **El GREEN mide también la salida «worktree temporal» de la replanificación** (`sdd-start-release` paso 4, fila de deuda de la 0029) con el mismo molde, sin tocar esa skill. Cuesta un escenario (~1 $). Si falla, el arreglo va a la 0039, que es dueña de `sdd-start-release`.
8. **Capacidad del delta**: `control-profiles` (existente). Ahí vive hoy «El merge a develop sigue la política declarada», y los tres requisitos nuevos completan esa política. Descarto `task-flow`: el merge también es del cierre de patch.

### Decisiones tomadas con el dev-lead

- Partir la 0009: esta task se queda con el merge en el cierre, la 0039 recibe la base que se mueve y los puntos de `sdd-start-release`, y la rama preexistente de `nombrado.md` va a deuda con destino patch — «Partir (Recomendada)»
- Campaña RED previa a la spec: cinco frentes, techo 12 $ — «5 frentes, techo 12 $ (Recomendada)»

## Intent

Seis reportes de campo cuentan el mismo cierre: el repo es bare, la rama destino no está sacada en ningún worktree, y cada agente resuelve el merge a mano con un worktree temporal que acaba en el scratchpad, en `%TEMP%` o en el propio worktree de la feature. El RED lo reproduce 3/3. El cierre de patch además ignora la política de merge que el proyecto declaró. Y cuando el entorno deniega el merge, el informe no deja ver si otra sesión movió la rama. Se quiere que los dos cierres lean la política y fusionen con una receta única en esa forma de repo, y que dejen evidencia cuando no pueden fusionar.

## Scope

- Entra: `sdd-end-task` paso 10 y `sdd-end-patch` paso 6 leen `merge.into` y `merge.noFf` y aplican la tabla de gates; receta del merge sin la rama destino sacada; forma del informe de un merge denegado; `estimation-log.md` en conflicto se regenera con el script; texto del Art. IV y de `control-profiles.md` que hoy restringe la política al cierre de task.
- No entra: integrar la base antes de los docs de cierre, detectar otras tasks abiertas y la receta de `changelog.md`, `roadmap.md` y capacidades en conflicto (0039); el ensayo con `--detach` (decisión 2); cambios sin commitear en el checkout destino (R4 pasa); la suite sobre el resultado del merge (la pide superpowers); la rama preexistente en `nombrado.md` (deuda, patch); el merge a `main` y el tag, que siguen siendo de una persona.

## Approach

Los dos pasos de rama delegan en `finishing-a-development-branch`, como hoy, con dos piezas del kit delante. Primero, la política: el paso lee el bloque `merge` y aplica la fila «Merge a develop» de la tabla de gates, que pasa a nombrar también el cierre de patch. Después, la forma del repo: si la rama destino no está sacada en ningún worktree, el paso sigue la receta de `merge-recipe.md` en lugar de la opción 1 de superpowers. La receta crea el worktree temporal junto al de la feature, fusiona con la forma que diga la política, corre la suite como pide superpowers y lo retira. Si el entorno deniega el merge, la receta fija la forma del informe; si hay conflicto en `estimation-log.md`, el paso lo regenera con el script. El RED y el GREEN repiten los escenarios de `red/` sobre el mismo molde. R4 va como control de no regresión (Art. I) y se añade el escenario de `sdd-start-release`.

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — El merge a develop sigue la política declarada** (antes: «GIVEN una task validada (o diferida)…»; «WHEN el agente llega al paso de rama del cierre»)
- GIVEN una task validada (o diferida) o un patch listo para su paso de rama, y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre (paso 10 de `sdd-end-task`, paso 6 de `sdd-end-patch`)
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta

**ADDED — Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás**
- GIVEN un repo en el que `git worktree list` no muestra la rama destino sacada en ningún worktree
- WHEN el cierre fusiona
- THEN crea un worktree temporal de la rama destino en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, fusiona allí y lo retira con `git worktree remove` antes de terminar
- AND el worktree de la feature sigue en su rama, el temporal no se crea en el scratchpad, en `%TEMP%` ni con `mktemp`, y ningún commit usa `--no-verify`

**ADDED — Un merge que el entorno deniega se informa con su evidencia**
- GIVEN una política que autoriza el merge y un entorno que lo deniega (clasificador del harness o hook)
- WHEN el cierre termina
- THEN el informe final cita en un bloque el comando denegado, literal; cita el texto de la denegación y el hash de la rama destino, que sigue sin tocar; y dice que el resto del cierre está hecho
- AND no reintenta el merge con otra herramienta ni con otra forma del comando

**ADDED — Un conflicto en el estimation-log se regenera con el script**
- GIVEN un merge del cierre con conflicto en `estimation-log.md`
- WHEN el agente resuelve los conflictos
- THEN regenera `estimation-log.md` con `Build-EstimationLog.ps1` de `sdd-templates/scripts/`, y no lo edita a mano

**Reglas de la capacidad**
- **Regla ante conflicto**: la task manda sobre la release y la release sobre el proyecto; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge que el entorno deniega no se reintenta: lo desbloquea una persona.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
