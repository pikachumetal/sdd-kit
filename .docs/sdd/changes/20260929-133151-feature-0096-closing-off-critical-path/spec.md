---
id: 20260929-133151-feature-0096-closing-off-critical-path
feature: 0096
title: El cierre fuera del camino crítico
mode: full
status: approved
created: 2026-09-29
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-29
---

# Spec — El cierre fuera del camino crítico

## Capacidades

- Modificadas: `feature-flow` — el revisor final se despacha en segundo plano con el commit de la última task, sobre un worktree desanclado; los borradores de cierre se escriben mientras revisa; lo cambiado tras la validación se separa de lo validado; el último revisado tras juntar el cierre
- Modificadas: `commit-history` — el commit de cierre deja en `tasks.md` solo shas alcanzables desde la rama

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (dos requisitos de feature-flow, uno de commit-history) · tamaño: ~120 líneas en 8 ficheros
- Técnica: si cada literal nuevo (`review-<id>-<sha corto>`, «juntada en el cierre», «cambiado después de tu prueba») llega a todos los ficheros del Scope que lo aplican (señal: MODIFIED)
- Mínimo razonable: ninguna, con el repaso de coherencia del hilo — deja sin mirar por otra mano si el orden nuevo del paso 7 choca con las paradas de `pair`
```

1. **Partida en dos** — la mitad del revisor proporcional es la [0108](../../roadmap.md#versión-siguiente) (`parent: 0096`), con fila propia. Esta feature no cambia el modelo ni el effort del revisor final.
2. **Entra la deuda «Juntar el cierre deja en `tasks.md` un sha que ya no existe»** (tres casos): toca `commit-milestones.md` y los pasos 9 y 10 de `sdd-end-feature`, los mismos ficheros. Es lo primero que sale si el RED se encarece.
3. **Orden del paso 7: revisión antes que validación, pero en paralelo con el resto.** El revisor final sale en segundo plano en cuanto existe el commit de la última task (en SDD, juntado tras su revisión limpia). Mientras revisa, el hilo hace la verificación visual y escribe los borradores. La validación se presenta cuando vuelve la revisión y, si la hay, su pasada de fix. Descartado: presentar la validación sin esperar al revisor. Así el caso de la feature 0001 (arreglos del revisor sobre UI ya probada) sería lo normal y no la excepción.
4. **Aislamiento: worktree desanclado.** Todo revisor final y toda re-revisión trabajan en `git worktree add --detach <padre de los worktrees>/review-<id>-<sha corto> <sha>`. Allí se construye el paquete, y el encargo dice que no mire ramas ni commits posteriores. El hilo retira el worktree al volver el revisor. Solo con la frase `git log <sha>` quedaría aislado git, pero no los `Read` del árbol, que el hilo sigue cambiando con fixes visuales y borradores. Mismo patrón que el `merge-<id>` del script de merge.
5. **Borradores en su sitio final y sin commitear**: `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog. Sin validación no se commitean. El roadmap no se adelanta: es una línea, y la base se mueve (0048).
6. ~~**Literal único: «cambiado después de tu prueba».**~~ *Retirada por la enmienda del 2026-09-29.* La fila del roadmap usaba también «no validado por ti». Me quedo con uno porque dice qué pasó y no pide al lector deducirlo. Va en la verificación del walkthrough y en el mensaje final, uno por commit con salida observable posterior a la validación.
7. **Lo cambiado tras la validación se lista, no se re-pregunta** *(queda como conducta vigente, sin guía nueva: enmienda del 2026-09-29)*. Ni en `delegate` ni en `pair` se para a revalidar. El dev-lead lo lee en el mensaje final y el merge a `develop` no es una publicación. Una pasada de fix que pide el usuario tras validar es una enmienda de proceso, no el «second fix pass» que prohíbe `executing-plans`: se hace y pasa por la re-revisión del tramo.
8. **Sha alcanzable sin escribir el sha de cierre.** Un commit no puede contener su propio hash. Al juntar el cierre, las líneas `Pasada de fix:`, `Re-revisión:` y `Revisión final:` cuyo sha cae en el tramo juntado se reescriben como «juntada en el cierre», sin sha. Tras el cierre, el último revisado es el commit de cierre. No se añade script de comprobación: es una regla de texto con su escenario en el GREEN.
9. **Fuera: el gate de cierre en paralelo con el revisor** (iniciativa del agente en el ticket 0001). Lo que corre la suite y cuántas veces es de la 0097.
10. **Previsión de campaña (Art. I), RED y GREEN juntos**: 3 escenarios con 2 sujetos Sonnet por fase: c1 revisor en segundo plano con verificación visual pendiente, c2 arreglo pedido tras la validación y c3 cierre con pasada de fix y re-revisión en el tramo. Son 12 sujetos, ~2 $ cada uno (c1 despacha un revisor), **~24 $ y ~2,5 h**. **Techo: 15 sujetos y 35 $**, una tanda de REFACTOR incluida. Controles del GREEN: la pasada de fix de la revisión final no abre re-revisión (c1) y un commit posterior a la validación sí la abre (c2). Pasos que cambian y su escenario: `sdd-start-feature` pasos 6 y 7 → c1, c2 · `encargo-revision.md` «Revisor final» → c1 · `control-profiles.md` (pasada de fix, último revisado) → c2, c3 · `overrides-superpowers.md` (`executing-plans`) → c1, c2 · `commit-milestones.md` (Cierre, hash) → c3 · `sdd-end-feature` pasos 0, 1, 9, 10 y 12 → c2, c3 · `walkthrough-template.md` (verificación) → c2.

### Decisiones tomadas con el dev-lead

- Partir la 0096 y sacar el revisor proporcional a su propia fila — «Partir: (a) ahora (Recomendada)», 2026-09-29
- Aprobación de la spec, con review «ninguna» — «Apruebo (Recomendada)», 2026-09-29

## Intent

Hoy el revisor final sale tras la última task, la verificación visual y la presentación. En la feature 0001 de un proyecto del equipo, desde «validado» hasta el merge pasaron ~25 min, contra ~37 min de desarrollo, y la pasada de fix cambió UI que el usuario ya había probado. Se quiere que la revisión y los registros de cierre corran mientras el hilo verifica, que el revisor no vea el `HEAD` que avanza (en la feature 0027 de document-manager, 3 de 4 pasadas vieron el arreglo posterior), que lo cambiado tras validar se diga, y que `tasks.md` no apunte a shas que el cierre borra (tres casos).

## Scope

- Entra: `skills/sdd-start-feature/SKILL.md` (paso 6: el revisor final en segundo plano y su línea `Revisión final:`; paso 7: orden de revisión, verificación y borradores, y el último revisado)
- Entra: `skills/sdd-start-feature/references/encargo-revision.md` («Revisor final»: el worktree desanclado y la frase del encargo, también para la re-revisión)
- Entra: `skills/sdd-start-feature/references/control-profiles.md` (la viñeta de la pasada de fix y el último revisado)
- Entra: `skills/sdd-start-feature/references/overrides-superpowers.md` (fila `executing-plans`: la revisión final en segundo plano; fila `subagent-driven-development`: la revisión final en segundo plano)
- Entra: `skills/sdd-start-feature/references/commit-milestones.md` (fila «Cierre» y «El hash en los artefactos»)
- Entra: `skills/sdd-end-feature/SKILL.md` (paso 0: los borradores ya escritos; paso 9: el último revisado tras juntar; paso 10: reescribir las líneas al juntar)
- Entra: evidencia RED/GREEN en `tests/` y en la carpeta de esta spec; bump de versión y changelog en el cierre
- No entra: el modelo y el effort del revisor final (0108) · cuántas veces corre la suite y el gate en paralelo (0097) · la base que se mueve durante el cierre (0048) · un script que compruebe los shas de `tasks.md` · `sdd-end-patch` (un patch no tiene revisor final de rama)

## Approach

Se reordena el tramo entre el commit de la última task y la presentación de la validación: se despacha, y el trabajo del hilo corre mientras el revisor lee un sha fijo en su propio worktree. El cierre gana dos reglas de registro: separar lo posterior a la validación y reescribir las líneas de revisión que el squash deja huérfanas. Todo es texto de skills. Cada paso nuevo se mide con los escenarios c1-c3 de la decisión 10.

## Delta de comportamiento

### Capacidad: `feature-flow`

**ADDED — El revisor final sale en segundo plano con el commit de la última task**
- GIVEN una feature Native con una task que cambia la UI, cuyo commit `a1b2c3d` acaba de hacerse, y su «Verificación visual» pendiente
- WHEN el hilo cierra esa task
- THEN el siguiente despacho es el revisor final en segundo plano sobre `a1b2c3d`, antes de arrancar la aplicación para la verificación visual
- AND mientras el revisor trabaja, el hilo hace la verificación visual y escribe los borradores de cierre: `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog, todos sin commitear
- AND la validación se presenta cuando vuelve el revisor sin Critical ni Important abiertos (tras su pasada de fix, si la hay), no antes
- AND en SDD el disparador es el commit juntado de la última task, tras su revisión limpia

**ADDED — El revisor final trabaja aislado en el sha que revisa**
- GIVEN el revisor final despachado sobre `a1b2c3d` y el hilo que commitea después `e4f5a6b` (un fix de la verificación visual)
- WHEN el revisor lee el código y el historial
- THEN trabaja en un worktree desanclado `review-0096-a1b2c3d` creado con `git worktree add --detach` en `a1b2c3d`, con el paquete construido allí, y su encargo le dice que no mire ramas ni commits posteriores
- AND su informe no cita `e4f5a6b`
- AND lo mismo vale para la re-revisión de un tramo: su worktree se ancla en el último sha del tramo
- AND el hilo retira el worktree con `git worktree remove` al volver el revisor

**ADDED — Lo cambiado tras la validación se separa de lo validado**
- GIVEN una feature validada con «probé borrar un fichero y funciona» y, después, a petición del dev-lead, un commit `c7d8e9f` que cambia el texto del error «No se pudo borrar» por «El fichero ya no existe»
- WHEN se cierra
- THEN el commit pasa por la re-revisión del tramo antes del walkthrough
- AND la verificación del walkthrough y el mensaje final dicen que el dev-lead probó la versión anterior y qué verificó el agente del cambio (`c7d8e9f`), separado de la línea de validación
- AND el hilo no para a pedir otra validación

**MODIFIED — El cierre no repite la revisión final de Native** (antes: el último revisado siempre era un sha de `tasks.md`)
- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión final de rama `sobre a1b2c3d`, y después de ese commit solo hay commits de los que se revisan en el hilo
- WHEN se entra en `sdd-end-feature`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué modelo
- AND si después de `a1b2c3d` hay un commit del hilo `e4f5a6b` que cambia `src/slots.js`, antes de escribir el walkthrough despacha la re-revisión del tramo `a1b2c3d..HEAD` con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND el commit con el que compara `HEAD` es el último revisado: el segundo sha de la `Re-revisión:` más reciente; si no hay, el de `Pasada de fix:`; si no hay, el `sobre` de `Revisión final:`; y si la línea dice «juntada en el cierre», el commit de cierre
- AND la pasada de fix exime solo sus propios commits: si entre el `sobre a1b2c3d` y el primer commit de la pasada hay un commit del hilo `b2c3d4e` que cambia `src/slots.js`, hecho mientras el revisor trabajaba, el último revisado es `a1b2c3d` y la re-revisión cubre `a1b2c3d..HEAD`
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe del revisor de esta sesión) lanza `requesting-code-review`

### Capacidad: `commit-history`

**MODIFIED — El cierre de una feature queda en un commit** (añade la reescritura de las líneas de revisión)
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de `sdd-end-feature` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama; el cierre no se vuelve a juntar
- AND antes de juntar, cada línea `Pasada de fix:`, `Re-revisión:` o `Revisión final:` de `tasks.md` cuyo sha cae en el tramo que se junta se reescribe sin sha: `Pasada de fix: 7ea5c37, 1 hallazgo RED→GREEN` pasa a `Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN`, y `Re-revisión: 7ea5c37..21c1f70, sdd-kit:effort-high + opus, limpia` pasa a `Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia`
- AND tras el commit de cierre, `git merge-base --is-ancestor <sha> HEAD` sale bien para todo sha de `tasks.md`

## Enmiendas

- 2026-09-29 — La pasada de fix de la revisión final exime solo sus propios commits: si entre el `sobre` de `Revisión final:` y el primer commit de la pasada hay commits del hilo que no se revisan en el hilo (un fix de la verificación visual hecho mientras el revisor trabajaba), la re-revisión del paso 7 cubre `<sobre>..HEAD` y no `<pasada>..HEAD`. Y un commit del hilo sin task abierta ya no «entra en la revisión final», anclada antes: entra en la re-revisión del tramo. Cambia la cadena del último revisado del MODIFIED «El cierre no repite la revisión final de Native» (un AND nuevo) y las frases de `SKILL.md` paso 6 («Desvío y ruling»), `control-profiles.md` y `overrides-superpowers.md` — hallazgo Important de la revisión final: con el revisor en segundo plano, un commit hecho mientras revisa y seguido de una pasada de fix no lo revisa nadie — aprobada: «Apruebo y se mide (Recomendada)», con el escenario c4 (1 sujeto RED y 1 GREEN)

- 2026-09-29 — Se retira la guía de «cambiado después de tu prueba» (decisiones 6 y 7, requisito ADDED «Lo cambiado tras la validación se separa de lo validado»). El requisito pasa a describir la conducta vigente, sin literal fijo: el walkthrough y el mensaje final dicen que el dev-lead probó la versión anterior y qué verificó el agente del cambio. Se mide como control en el GREEN (c2). Se quitan del Scope la plantilla del walkthrough y los pasos 1 y 12 de `sdd-end-feature`, y de `overrides-superpowers.md` la frase de la enmienda de proceso, que no se midió — el RED c2 pasa 2/2: el paso 1 de `sdd-end-feature` ya separa «verificado por ti» de «reportado por el usuario», y sin fallo no se escribe guía (Art. I) — aprobada: «Apruebo la enmienda (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-29 | aprobada: «Apruebo (Recomendada)» |
