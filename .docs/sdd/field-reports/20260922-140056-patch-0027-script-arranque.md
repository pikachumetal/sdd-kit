---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: patch
id: 20260922-140056-patch-0027-script-arranque
task: 0027
mode: delegate
date: 2026-09-22
---

# Ticket para el kit — patch 0027: el id de la rama propia cuenta como ocupado, y el merge en repo bare sigue sin receta en el cierre

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-templates` (`patch-template.md`, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`); todas leídas del working tree, no de la caché
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5
- Modelos de los subagentes: no aplica; dos sesiones interactivas de Opus 5 en terminales de Orca para la verificación (~0,5 $)
- Coste en reloj: ~25 min
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Get-NextSddId.ps1` cuenta como ocupado el id de la rama en la que ya estás

- **Qué pasó**: la sesión arrancó en `feature/0027`, una rama creada para este trabajo antes de empezar. Ninguna fila del roadmap ni carpeta de `specs/` usaba el 0027. `Get-NextSddId.ps1` devolvió `0028`, porque lee `git branch --all` (línea 76) y la rama actual cuenta como id tomado. Usé el 0027 a mano y lo dejé explicado en el `patch.md`.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1` y el paso 2 de `skills/sdd-start-patch/SKILL.md` («el id reservado en la fila del roadmap, o el que devuelve `Get-NextSddId.ps1` si no tiene fila»). Lo mismo vale para `sdd-start-task` y `nombrado.md`.
- **Por qué el kit no lo evitó**: el paso 2 solo reconoce la reserva en la fila del roadmap. No contempla que la reserva sea la propia rama, que es lo que pasa cuando Orca, o el dev-lead, crea el worktree con el id en el nombre.
- **Coste**: bajo si el agente se da cuenta. Si sigue el script al pie de la letra, la rama `feature/0027` acaba con la carpeta `patch-0028`, y la secuencia deja un hueco en el 0027.
- **Propuesta**: si la rama actual es `feature/<id>` y ese id no aparece en `specs/` ni en otra rama, el script lo devuelve como el id de esta sesión. Alternativa sin tocar el script: una línea en el paso 2 y en `nombrado.md` que diga «si la rama actual ya lleva id, ese es el tuyo».
- **Criterio de aceptación**: GIVEN un repo en modo `sequence` con la rama actual `feature/0027` y ningún otro uso del 0027, WHEN se ejecuta `Get-NextSddId.ps1`, THEN devuelve `0027`.

### 2. El merge `--no-ff` en repo bare sigue sin receta en `sdd-end-patch`

- **Qué pasó**: el dev-lead pidió el merge `--no-ff`. `develop` no estaba en ningún worktree y el repo principal es bare. Seguí la receta de la fila 0009 del roadmap: worktree temporal en ruta corta (`D:\code\.worktrees\sdd-kit\m0027`), merge y borrado del worktree. Funcionó a la primera, porque `develop` no había avanzado desde la rama.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 6, que delega en `finishing-a-development-branch` igual que el paso 10 de `sdd-end-task`.
- **Por qué el kit no lo evitó**: la receta vive solo en la fila de backlog de la 0009, no en la skill. Es otro reporte más para esa fila, y el primero del carril patch.
- **Coste**: nulo esta vez, porque leí la fila. Sin ella, `git checkout develop` falla en un repo bare, o el merge se hace en el worktree de otra rama.
- **Propuesta**: cuando la 0009 escriba la receta, que la cite también `sdd-end-patch` paso 6, no solo `sdd-end-task`.
- **Criterio de aceptación**: GIVEN un repo bare con `develop` fuera de cualquier worktree, WHEN `sdd-end-patch` hace el merge que pide el dev-lead, THEN lo hace en un worktree temporal de ruta corta, pasa el hook y borra el worktree.

## Lo que hice por iniciativa propia

- Antes de escribir el script como forma oficial, verifiqué el punto que pedía el dev-lead con dos sesiones interactivas reales, lanzadas en terminales de Orca con `orca terminal create/send/read`. Con el script, el `Base directory` apuntaba al worktree. Con `claude` a secas, a la caché 1.1.0. En la sesión con script, la `description` de `sdd-start-patch` coincidía con la de la rama, así que la versión publicada no se cuela a la vez. Esta forma de probar una sesión interactiva desde un agente sirve para otras verificaciones y podría ir a `tech-stack.md`.
- El script usa `--plugin-dir $PSScriptRoot` en vez de `.`, para que no dependa de la carpeta desde la que se lance.
- Cambié también la sección «Desarrollo» del README para que cite el script, aunque quedaba fuera del alcance pedido. Así la receta no queda escrita en dos sitios.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md`: leí `sdd-start-patch` y `sdd-end-patch` del working tree desde el principio, y la versión de la caché no llegó a ejecutarse.
- `Build-EstimationLog.ps1` regeneró el log desde `patch.md` §5.
- El hook de pre-commit pasó la suite completa en los dos commits (291 pasan, 0 fallan).

## Errores míos, no huecos del kit

- Inserté las filas del roadmap y del changelog con `String.Replace` buscando `\n`, y los ficheros usan CRLF. El reemplazo no hizo nada y no dio error. Lo vi en el `git diff --stat` y lo rehíce con una regex `\r?\n`.
- En el `patch.md` normalicé la ortografía de la frase del dev-lead que cité como literal. La corregí para dejarla tal como la escribió.
