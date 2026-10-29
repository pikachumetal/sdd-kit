---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261029-123531-patch-0247-ledger-rulings-and-done-count
task: 0247
mode:
date: 2026-10-29
---

# Ticket para el kit — patch 0247: la coordinación reagrupó una fila con su rama en cierre y el merge chocó

## Contexto

- Carril y modo: patch
- Skills del kit usadas: sdd-propose, sdd-start-patch, sdd-debugging, sdd-archive, add-to-changelog, sdd-feedback
- Proyecto: el propio kit (plugin de Claude Code, CLI en TypeScript con vitest y moon), un dev-lead con varias sesiones en worktrees a la vez
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,30 h frente a 0,5 h + 0,2 h del gate estimadas
- Coste en tokens: 4,19 $ en el hilo

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La sesión de coordinación reagrupó filas de Próximo con sus ramas ya en cierre

- **Qué pasó**: con el fix y el cierre de la 0247 commiteados, la sesión `develop` hizo `0491da49` («juntar los patches de Próximo en cinco filas»): la fila 0247 absorbió la 0252, que se cerraba a la vez en su propio worktree. `sdd merge --push` paró con `merge: conflicto en .docs/sdd/roadmap.md.`. Hubo que acordar entre las tres sesiones quién fusionaba primero, deshacer la absorción en la fila 0247 y hacer dos `--sync` más.
- **Fuente**: `git show 0491da49 --format=%B -s` («0247 absorbe la 0252: menores de la CLI (ledger y watch)»); `git worktree list` → `patch/0252-watch-command-runs-command` abierta; salida de `node cli/bin/sdd.js merge --project-root … --push`.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, el reordenado y la reagrupación de filas («reordena», «la X va tras la Y»); no comprueba si una fila tiene rama abierta.
- **Por qué el kit no lo evitó**: ningún paso de `sdd-roadmap` mira las ramas o los worktrees abiertos (`git worktree list`, `git branch -r`, el id publicado por `sdd id claim`) antes de cambiar el alcance de una fila.
- **Coste**: una parada del dev-lead y un mensaje de enfado («Hablad entre vosotros joder que cada dia trabajamos peor»), unos 15 min de coordinación y dos `--sync`; respaldo: los commits `cc71dd98` y el que devuelve la fila 0247 a su texto previo, en la rama `patch/0247-ledger-rulings-and-done-count`.
- **Propuesta**: en `sdd-roadmap`, antes de juntar, partir o cambiar el alcance de una fila de Próximo, listar las ramas `feature/<id>-*` y `patch/<id>-*` (locales y del remoto): con rama, la fila no se toca y la absorción va a una fila nueva o se pregunta. Sustituye la línea del reordenado, sin alargar la skill.
- **Verificada**: sí — contrastado con `skills/sdd-roadmap/SKILL.md` (sin mención de ramas abiertas al reagrupar)
- **Criterio de aceptación**: GIVEN las filas 0247 y 0252 de Próximo con `patch/0247-…` y `patch/0252-…` en el remoto WHEN `sdd-roadmap` junta los patches de Próximo en grupos THEN no mete la 0252 dentro de la 0247 y dice que las dos tienen rama abierta.

### 2. Ante un conflicto que cambiaba el alcance, pregunté al dev-lead en vez de hablar antes con las sesiones

- **Qué pasó**: con el merge parado, abrí un `AskUserQuestion` al dev-lead sobre la 0252 sin mirar `ListAgents`; la 0252 ya estaba cerrándose en su sesión. El dev-lead lo rechazó («de que me habals? 252 esta cerandose»). Después, al avisar a `develop`, cité mal la regla 6 de `CLAUDE.md` (dije que pedía empujar todo commit de coordinación; solo los de ticket y de triaje), y `develop` lo corrigió.
- **Fuente**: esta sesión; `CLAUDE.md` regla 6 («Los dos commits, el del ticket y el del triaje, los empuja enseguida sin preguntar»).
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, la tabla de salidas (`merge: conflicto en <files>.`); no localizado un paso que diga con quién hablar cuando el conflicto viene de otra sesión.
- **Por qué el kit no lo evitó**: la receta manda resolver o dejar «No terminado» para una persona; no dice que, si el lado contrario es un commit de otra sesión viva, se le pregunte a ella antes que al dev-lead.
- **Coste**: una parada del dev-lead y una corrección de una sesión a otra; sin respaldo en commits.
- **Propuesta**: en la fila `merge: conflicto en` de la receta, cambiar la acción: «si el lado del destino es de otra sesión (`ListAgents`), pregúntale antes de parar al dev-lead».
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un `merge: conflicto en .docs/sdd/roadmap.md.` cuyo lado del destino es un commit de la sesión `develop`, listada en `ListAgents` WHEN el cierre lo encuentra THEN manda un `SendMessage` a esa sesión antes de preguntar nada al dev-lead.

## Lo que hice por iniciativa propia

- Extraje `resultLine` de `completionLine` (`cli/src/tasks/done.ts`) para probarla sin git; funcionó: el RED falló por la causa y el GREEN no tocó los tests lentos.

## Funcionó, no tocar

- `sdd merge --verify`: integró la `develop` local y cruzó lo que tocaban la rama y la base (`verificación: corre cli:test cli:typecheck kit:test-headless (las tocan la rama y la base)`), y avisó del commit ajeno que publicaba.
- El contraste de un rojo de `sdd-archive` paso 6: dos timeouts de 5 s pasaron 57/57 en la rama y en la base a la vez, y el cierre siguió.

## Menores

- `sdd merge` sin `--verify` no integra la `develop` local con commits sin publicar: el conflicto salió en el merge (`merge: conflicto en`) y no en la rama, donde `--sync` lo deja resolver — `skills/sdd-archive/references/merge-recipe.md`
- El `git commit --amend` del commit de cierre dejó sin ancestro el sha que yo había citado en `patch.md` y en la deuda; lo vi y lo reescribí — `skills/sdd-archive/SKILL.md` paso 5
- `patch.md` §5 lleva 0,06 h de `sdd session tokens`, tomado antes del gate y de la coordinación; al acabar, la misma línea da 0,30 h — `skills/sdd-archive/SKILL.md` paso 2
- Al rellenar la fila 0247 con PowerShell quité un carácter de más (`S |✅ |`) y `roadmap check` no lo vio — no localizado
