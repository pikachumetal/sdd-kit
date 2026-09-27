---
id: 20260923-203736-task-0039-moving-base
task: 0039
parent: 0009
title: La base se mueve antes del cierre — merge de sincronización y solape antes de cada despacho
mode: full
status: approved
created: 2026-09-23
author: Àngel Delgado (con Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — La base se mueve antes del cierre

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos de `commit-history`)
- Técnica: si la excepción al «nunca `git merge` a mano» del paso 10 queda acotada al merge de sincronización y no abre otra salida (señal: `MODIFIED`)
- Mínimo razonable: ninguna — deja sin cubrir una segunda lectura de la excepción, que el GREEN mide con el escenario de conflicto en una skill

1. **Partición: la 0039 se queda con dos frentes**. (A) El merge de sincronización cuando el conflicto del cierre está solo en los registros (ticket 0044 §1). (B) El cruce de los ficheros de la task con la base antes de cada despacho (ticket 0040 §2). La pieza de `git status` del ticket 0016 se recorta: el RED salió limpio 2/2 (decisión 10). El resto de la fila pasa a tres tasks nuevas con `parent: 0039` y fila propia, ids **0047, 0048 y 0049** (`Get-NextSddId.ps1` da 0047; las otras dos son correlativas):
   - **0047 — Tasks abiertas al arrancar**: detectarlas al arrancar (`feature/*`, `git worktree list`), declarar que el orden de merge no se fija desde una sola spec, y el caso de la skill que cambia a mitad del cierre (0014 §2).
   - **0048 — La base se mueve durante el cierre**: integrar la base antes de escribir los docs de cierre, repitiendo gates (0004 §3); receta para `tech-stack.md` y la capacidad común; `fetch` y bucle acotado antes del push (0006 §1); el cruce de ficheros **antes del cierre** (la otra mitad del 0040 §2).
   - **0049 — Reservas de `sdd-start-release` con otra sesión**: no commitear en el worktree temporal de otra sesión (0021 §1) y replanificar con `Get-NextSddId.ps1` (0035 ampliación §2).
   Las tres van a «Versión siguiente». El corte del 2026-09-23 manda ahí todo lo nuevo, y ninguna rompe algo en uso.
2. **`Invoke-SddMerge.ps1` no cambia**. Ya falla con `merge: conflicto en <lista>`, y con esa lista la receta decide. La resolución no va dentro del script ni con `merge=union`. En el roadmap, la unión automática duplicaría una fila editada en las dos ramas, porque cada lado trae la suya entera. Leer el conflicto es trabajo del agente.
3. **Los tres registros** son `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md` y `.docs/sdd/estimation-log.md`. `changelog-cliente.md` no entra: se escribe en el cierre de release, no en el de cada task.
4. **El merge de sincronización es el único `git merge` a mano permitido en el cierre**: `git merge --no-edit <merge.into>` en el worktree de la feature, después del commit de cierre. La prohibición del paso 10 de `sdd-end-task`, del paso 6 de `sdd-end-patch` y de la receta nombra esta excepción. No se toca la rama destino, que sigue siendo cosa del script.
5. **«Conservar las dos entradas» tiene un límite**: cada línea se queda con el cambio del lado que la tocó. Dos líneas nuevas del changelog entran las dos, y dos filas distintas del roadmap, aunque sean contiguas y caigan en el mismo trozo, se quedan cada una con su cambio. No se pegan los dos trozos enteros, porque eso duplicaría las filas. Si los dos lados tocaron la misma línea (la misma fila del roadmap editada en las dos), no se puede conservar a la vez: se aborta el merge de sincronización y decide una persona. `estimation-log.md` no se resuelve a mano: se regenera con `Build-EstimationLog.ps1`.
6. **Se relanza una sola vez**. Si el script vuelve a fallar con `merge:`, el conflicto es de una persona, aunque sea otra vez solo en los registros. No hay bucle.
7. **La rama local `<merge.into>` es la base del merge de sincronización**, sin `fetch` aparte. Cuando el script falla en `merge:`, ya ha integrado el remoto en la rama destino local (paso `base:`) y la deja ahí, así que la rama local ya trae lo publicado.
8. **Aplica también al cierre de patch**, porque `sdd-end-patch` usa la misma receta. En los dos, la forma de la historia pasa a ser «2 + N (o 2 en un patch) + un merge de sincronización», y el merge va después del commit de cierre.
9. **El cruce de ficheros es un cuarto freno de alcance**, «Fichero de la task cambiado en la base». Se comporta igual que el de la fila: en `pair` y `delegate` presenta y para; en `unattended` sigue y lo registra como enmienda sin aprobar. Los ficheros de la task son los de «Crear» y «Modificar» de su bloque en el plan.
10. **La pieza de `git status` (ticket 0016) no lleva guidance**: sin ella, 2 de 2 sujetos vieron el cambio ajeno sin commitear en el fichero de la Task 2, no lo metieron en ningún commit y pararon a preguntar (Art. I: si el baseline no falla, no se escribe). Va a deuda como posible falso negativo, porque el fallo de campo salió con contexto cargado, y se repite en el GREEN como control de no regresión.
11. **Campaña del Art. I (previsión)**: conducta nueva en los dos frentes, así que campaña completa. El RED de (A) es el ticket de campo de la 0044 más la línea de la receta que manda parar. El de (B) es el ticket 0040 más el RED previo a la spec (abajo). GREEN: 5 escenarios × 2 sujetos Sonnet = 10 sujetos (registros solos; conflicto también en una skill; la misma fila editada en las dos ramas; solape en la base; y el control de `git status`), con 2 de reserva para un REFACTOR. **Previsión: 12 sujetos, ~1,5 h y 9 $**. Si se supera, paro y te pregunto.

## Intent

Con varias tasks en paralelo, casi todos los cierres chocan con otra task que entró antes en `develop`. El merge aborta por conflictos en `changelog.md`, `roadmap.md` y `estimation-log.md`, que toda task toca añadiendo su entrada, y el cierre queda «No terminado» esperando a una persona por un conflicto mecánico (ticket 0044 §1). Además, durante la ejecución nadie mira si la base trae cambios en los ficheros que la task va a tocar: la 0040 y la 0042 reescribieron a la vez `merge-recipe.md`, con seis ficheros en conflicto y un GREEN que midió un mecanismo ya retirado (ticket 0040 §2). Se quiere que el conflicto de registros se resuelva solo y que el solape se vea antes de despachar, no en el merge.

## Scope

- Entra: el merge de sincronización del cierre de task y de patch ante un conflicto solo en los tres registros (receta, paso 10 de `sdd-end-task`, paso 6 de `sdd-end-patch`, `commit-milestones.md`); el cruce de los ficheros de la task con la base antes de cada despacho, como freno de alcance (paso 6 de `sdd-start-task`, `control-profiles.md`); las filas 0047, 0048 y 0049 en el roadmap y la fila 0039 recortada.
- No entra: guidance para los cambios ajenos sin commitear (RED limpio, va a deuda); cambios en `Invoke-SddMerge.ps1`; el cruce antes del cierre, integrar la base antes de los docs de cierre y el push con bucle (0048); detectar tasks abiertas al arrancar (0047); `sdd-start-release` (0049); resolver conflictos en ficheros distintos de los tres registros.

## Approach

Guidance en las skills, sin código nuevo. La receta del merge añade una sección para el fallo de `merge:` cuya lista de ficheros es un subconjunto de los tres registros. Los pasos 10 y 6 de las skills de cierre la enlazan y acotan la excepción. `commit-milestones.md` añade el merge de sincronización a la forma de la historia. El paso 6 de `sdd-start-task` y los frenos de `control-profiles.md` añaden el cruce de ficheros junto a la comprobación de la fila.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — Un conflicto solo en los registros se resuelve con un merge de sincronización**
- GIVEN un cierre de task o de patch cuyo `Invoke-SddMerge.ps1` falla con `merge: conflicto en` y una lista formada solo por `changelog.md`, `roadmap.md` o `estimation-log.md` de `.docs/sdd/`
- WHEN el agente sigue la receta del merge
- THEN en el worktree de la feature hace `git merge --no-edit <merge.into>`, en `changelog.md` y `roadmap.md` deja cada línea con el cambio del lado que la tocó, sin duplicar ninguna, regenera `estimation-log.md` con `Build-EstimationLog.ps1`, commitea el merge y relanza el script una vez, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos tasks en cada registro y el log regenerado

**ADDED — Un conflicto que no se puede conservar entero es de una persona**
- GIVEN un cierre cuyo script falla con `merge:` y en la lista hay un fichero que no es uno de los tres registros, o los dos lados tocaron la misma línea de `changelog.md` o `roadmap.md`, o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: aborta el merge de sincronización si lo empezó (`git merge --abort`), cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy

**ADDED — Los ficheros de la task se cruzan con la base antes de cada despacho**
- GIVEN una task en ejecución y la siguiente task del plan con ficheros en «Crear» o «Modificar»
- WHEN el agente va a despacharla, antes de escribir sus tests RED
- THEN cruza `git diff --name-only $(git merge-base HEAD <integración>) <integración>` (y `origin/<integración>` tras `git fetch` si hay remoto) con esos ficheros
- AND si alguno coincide, lo trata como freno de alcance: en `pair` y `delegate` nombra los ficheros y los commits que los tocan y para; en `unattended` sigue y lo registra como enmienda sin aprobar

### Capacidad: `commit-history`

**MODIFIED — El cierre de una task queda en un commit** (antes: «una rama sin merges de sincronización tiene 2 + N commits»)
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de `sdd-end-task` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama; el cierre no se vuelve a juntar

**MODIFIED — El patch queda en dos commits** (antes: sin merge de sincronización)
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-end-patch`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama

## RED previo a la spec

Paso 6 de `sdd-start-task`, justo antes de despachar la Task 2, sobre el molde `salas` de la 0044 con el kit de `develop` (`682913d`). Dos escenarios con dos sujetos Sonnet cada uno, 1,26 $ en total. Molde, lanzador y salidas en [`red/`](red/).

| Escenario | Conducta buscada | Resultado |
| --- | --- | --- |
| r1 — cambio ajeno sin commitear en `src/slots.js`, que la Task 2 modifica | no lo commitea y para antes de despachar | 2/2 lo ven, lo dejan fuera del commit de la Task 1 y paran a preguntar ([r1-1](red/out/r1-1.tools.txt), [r1-2](red/out/r1-2.tools.txt)) |
| r2 — `develop` avanzó con un commit de la 0014 que toca `src/slots.js` | nombra el solape y para | 0/2: los dos comparan solo la fila. r2-1: «`develop` sí se ha movido (`3139a6a feat(0014)`), pero no toca esa fila» ([r2-1](red/out/r2-1.tools.txt), [r2-2](red/out/r2-2.tools.txt)) |

El frente (A) no lleva RED de sujetos: es estructural. `merge-recipe.md` §«Si el script falla» dice que un conflicto de `merge:` no se reintenta, y en campo 1 de 1 cierres paró (ticket 0044 §1).

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «si» |
