---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260925-124307-patch-0075-patch-close-validation
task: 0075
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0075: la parada de validación en `sdd-end-patch`

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; `Get-NextSddId.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1`
- Proyecto: el propio kit (Markdown, Pester sobre pwsh 7, lanzadores bash de sujetos headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet en los 8 sujetos headless del RED/GREEN (2,58 $)
- Coste en reloj: ~1 h hasta el merge
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El merge de sincronización para siempre en las filas acumulativas del roadmap

- **Qué pasó**: `Invoke-SddMerge.ps1` dio conflicto en `roadmap.md` y `estimation-log.md`. Tres trozos: dos eran filas distintas y se resolvían solos; el tercero era la fila 0015, que acumula piezas de muchos tickets en una sola línea. Este patch marcó una pieza de en medio como saldada, y `develop` había añadido dos piezas al final de la misma línea. Los cambios no se pisaban, pero la receta dice «si los dos lados tocaron la misma línea, `git merge --abort` […] es de una persona». Aborté, pregunté al dev-lead con la resolución concreta, eligió «resuélvelo tú» y rehíce el merge.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md`, «Conflicto solo en los registros», punto 4.
- **Por qué el kit no lo evitó**: la receta decide por línea, y una fila acumulativa es una sola línea para git. Cualquier cierre que salde una pieza en línea (la tercera forma del formato de cierre de `roadmap-template.md`) mientras otra rama triaja tickets en la misma fila choca siempre.
- **Coste**: bajo. Una pregunta y un merge rehecho. En `unattended` o con el dev-lead ausente, el merge queda PENDIENTE.
- **Propuesta**: en el punto 4, una excepción. Si la línea de un lado es la de la base con texto insertado, y la del otro también, sin solaparse, se aplican las dos inserciones y se dice en el mensaje final. Alternativa: partir la 0015, como su propia fila ya pide.
- **Criterio de aceptación**: GIVEN un cierre que marca una pieza en línea en una fila, y la integración que añadió texto al final de esa misma fila, WHEN el script da conflicto solo en los registros, THEN el agente resuelve con las dos inserciones sin parar, y el diff contra la integración muestra solo la marca.

### 2. `-VerifyCommand` se ejecuta dentro de `pwsh -Command`, y la receta no lo dice

- **Qué pasó**: pasé `-VerifyCommand 'pwsh -NoProfile -Command "$r = Invoke-Pester …; if ($r.FailedCount) { exit 1 }"'`. El script lo ejecuta con `& pwsh -NoProfile -Command $Command`, así que el `pwsh` exterior expandió `$r` antes de tiempo y la verificación falló con «código de salida 1». Con el comando PowerShell tal cual, sin `pwsh` delante, fusionó a la primera.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md`, la línea de `-VerifyCommand` y el ejemplo `-VerifyCommand "pwsh -NoProfile -Command Invoke-Pester"` de la ayuda de `Invoke-SddMerge.ps1`. Tampoco el `tech-stack.md` del repo declara el gate de merge como comando literal: solo dice «el conjunto rápido».
- **Por qué el kit no lo evitó**: el ejemplo anida un `pwsh` que funciona sin variables, y enseña esa forma.
- **Coste**: bajo. Un lanzamiento fallido, sin tocar `develop`.
- **Propuesta**: la receta dice que el valor se ejecuta con `pwsh -NoProfile -Command <valor>` y que se pasa el comando PowerShell sin `pwsh` delante. El ejemplo de la ayuda queda en `-VerifyCommand "Invoke-Pester"`. Y el `tech-stack.md` del repo declara el comando literal del gate rápido.
- **Criterio de aceptación**: GIVEN un gate que necesita una variable (`$r.FailedCount`), WHEN el agente cierra siguiendo la receta, THEN la primera llamada a `Invoke-SddMerge.ps1` verifica y fusiona.

### 3. El volcado `rama:ruta` de un lanzador falla en Git Bash, y el `tools.mjs` de la 0055 deja el usuario

- **Qué pasó**: el lanzador de este patch (derivado del de la 0067) volcaba `git show feature/0013:<ruta>` para ver `patch.md` y el roadmap de la rama. En Git Bash la conversión de rutas de MSYS lo convirtió en `feature\0013;.docs\…`, y el `state.txt` salió vacío en los ocho runs. Lo arreglé con `MSYS2_ARG_CONV_EXCL='*'` y recogí de nuevo de los repos del scratchpad. Además, el `tools.mjs` de la 0055 dejaba el usuario en el nombre de la carpeta de Claude Code (`C--Users-<user>-AppData…`); las salidas pasaron por `tools.mjs --clean` de la 0009.
- **Dónde en el kit**: no es una skill. Son los lanzadores de las carpetas `specs/*/red/`. El patch 0076 (fusionado durante esta sesión) crea un lanzador de referencia en `tests/headless`, que puede haberlo resuelto: no lo comprobé.
- **Por qué el kit no lo evitó**: cada campaña copia el lanzador de otra carpeta, con sus defectos.
- **Coste**: bajo. Un rato de recogida; sin la copia de los repos en el scratchpad, habría que relanzar 8 sujetos (~2,6 $).
- **Propuesta**: que el lanzador de referencia de la 0076 vuelque ficheros de una rama con `MSYS2_ARG_CONV_EXCL` y limpie con `tools.mjs --clean`.
- **Criterio de aceptación**: GIVEN el lanzador de referencia en Git Bash, WHEN vuelca `git show <rama>:<ruta>`, THEN el `state.txt` trae el fichero, y `SubjectOutputPrivacy.Tests.ps1` pasa sin limpiar a mano.

## Lo que hice por iniciativa propia

- La validación entró como **paso 0**, igual que el de `sdd-end-task`, y no como paso nuevo entre el 1 y el 6. Renumerar rompía anclas de `CommitMilestones.Tests.ps1` y `RoadmapClosing.Tests.ps1`, y las citas «paso 6 de `sdd-end-patch`» de `merge-recipe.md` y `control-profiles.md`. Funcionó: 0 tests tocados por numeración.
- Probé las anclas Pester nuevas contra la copia del kit sin el fix (`SDD_KIT_ROOT=<copia>`): 3 en rojo antes, verdes después. Es el RED de las anclas sin commitear un test en rojo.
- Ante el conflicto en la misma línea, aborté y pregunté con la resolución concreta como opción recomendada, no con un «¿qué hago?». El dev-lead la eligió.
- Dogfooding del paso 0 en este mismo cierre: el harness sirvió el `sdd-end-patch` del arranque, sin el paso 0; seguí el de la rama y paré a preguntar la validación antes de tocar nada.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md` del repo: si la sesión editó la skill que va a seguir, contrastar el texto del harness con el de la rama. Sin ella, este cierre habría fusionado sin la parada que el patch acababa de añadir.
- `Get-NextSddId.ps1 -Reserve` y el renombrado de la rama antes del primer commit.
- `Invoke-SddMerge.ps1`: detectó el conflicto solo en los registros, no dejó worktree temporal ni tocó `develop` al fallar, y publicó a la primera con el comando bien pasado.
- `Build-EstimationLog.ps1` tras el merge de sincronización: una sola fila nueva frente a `develop`.
- `Test-Capabilities.ps1` sobre las dos capacidades modificadas.

## Errores míos, no huecos del kit

- Un `python -` para editar un fichero se colgó 120 s (el stub de la tienda de Windows, ya anotado en el ticket del patch 0072).
- El lanzador usaba `$OUT` relativo tras `cd "$R"`: los dos primeros runs no escribieron sus salidas.
- Edité el lanzador con sujetos en marcha, contra lo que avisa `tech-stack.md` (task 0005). No rompió los runs porque la recogida fue a mano.
- Pasé código PowerShell con `$` y paréntesis por un heredoc de la herramienta Bash, y falló al parsear; con la herramienta PowerShell fue a la primera.
