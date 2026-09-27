---
id: 20260923-145338-task-0042-merge-script
task: 0042
title: La receta de merge del cierre como script con cerrojo
mode: full
profile: delegate
status: done
created: 2026-09-23
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — La receta de merge del cierre como script con cerrojo

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna. Señales: contrato público (la interfaz del script la consumen `sdd-end-task` y `sdd-end-patch`). No hay capacidad nueva, no hay `MODIFIED` ni `REMOVED`, toca una sola capacidad, no hay datos ni dependencias nuevos y no hay área sin leer.
- Mínimo razonable: ninguna. Queda sin revisar si la interfaz del script (parámetros y salida) basta para que la receta lo invoque sin interpretar nada. Eso lo mide el GREEN de la receta.

1. **El push solo va con `-Push`**, y el agente lo pasa cuando una persona ha confirmado el push. Así no cambia la regla vigente de `control-profiles` («push, PR, publicar: persona» en los tres perfiles). Sin `-Push`, el script fusiona en local igual, con cerrojo y con la base integrada. *Alternativa*: una clave `merge.push: true` en `sdd-kit.json` que haga del push parte de la política. Quitaría esa parada, así que necesito tu frase literal para escribirla.
2. **Cerrojo**: el fichero `sdd-merge.lock` en `git rev-parse --git-common-dir`, que es el mismo para todos los worktrees del repo. Se crea de forma atómica (`CreateNew`) y guarda quién lo tiene: rama, worktree, PID, máquina y hora. Quien espera lo dice al empezar a esperar y cada vez que cambia el dueño. Comprueba el cerrojo cada 2 s y se rinde a los 30 min (`-LockTimeoutMinutes`), nombrando al dueño. Un cerrojo cuyo PID ya no existe en la misma máquina se toma, y el script lo dice.
3. **Base**: tras coger el cerrojo, el script hace `fetch` del remoto de la rama destino (`branch.<into>.remote`; si no hay, `origin`; si tampoco hay, se salta el paso). Si el remoto avanzó, integra la base: `--ff-only` si es posible y, si la rama local divergió, un merge de la rama remota, que resuelve los conflictos con la misma regla que el merge de la feature.
4. **Conflictos**: si el único fichero en conflicto es `estimation-log.md`, el script lo regenera con `Build-EstimationLog.ps1` de su misma carpeta y termina el merge. Con cualquier otro conflicto, el script aborta el merge y falla con la lista de ficheros.
5. **Verificación**: `-VerifyCommand "<comando>"` se ejecuta en el worktree del merge, después del merge y antes del push. Si falla, falla el script. La receta pide pasar la suite del proyecto. En este repo el hook `pre-merge-commit` ya ejecuta la suite sobre el commit de merge.
6. **Un fallo deja la rama destino como estaba antes de fusionar la feature**: un `reset --hard` al commit anterior, hecho solo en el worktree del merge, que el script creó o comprobó limpio. La base integrada desde el remoto se conserva, porque ya es del remoto. Además no se empuja nada, el worktree temporal se retira y el cerrojo se suelta. El script sale con error y nombra el paso que falló y el motivo.
7. **Rama destino sacada**: si está sacada en un worktree limpio, el script fusiona ahí y no lo retira. Si ese worktree tiene cambios, el script falla con la lista de ficheros y no toca nada. Es la misma regla que la receta vigente.
8. **Interfaz**: `Invoke-SddMerge.ps1 [-ProjectRoot <worktree de la feature>] [-Branch <rama>] [-Push] [-VerifyCommand <cmd>] [-LockTimeoutMinutes <n>]`. Por defecto, `-ProjectRoot` es `.` y `-Branch` es la rama actual de ese worktree. `merge.into` y `merge.noFf` se leen de `.docs/sdd/sdd-kit.json`; sin el bloque `merge`, el script falla. El worktree temporal se llama `merge-<último segmento de la rama>`: `merge-0042` para `feature/0042`. El commit de merge lleva el título `merge: <rama> en <destino>` y un cuerpo de una línea, porque el Art. VI prohíbe los commits de solo título.
9. **La receta pasa a ser una invocación**. `merge-recipe.md` sustituye «Worktree temporal», «Merge», «Conflicto en estimation-log.md» y «Suite y retirada» por la llamada al script y por qué hacer si falla: informar de su mensaje sin rehacer el merge a mano. Conserva «Merge denegado por el entorno». Se ajustan en la misma línea el paso 10 de `sdd-end-task`, el paso 6 de `sdd-end-patch` y la tabla de scripts de `sdd-templates`. Es una edición de skill, así que lleva RED→GREEN (Art. I).
10. **RED/GREEN de la receta**: el molde es un repo con worktrees en el que el remoto avanzó después de abrir la feature y el dev-lead ha confirmado el push. RED: 2 sujetos con la receta vigente. Mido si hacen `fetch`, si empujan `develop` o `HEAD:develop`, y si la `develop` local acaba igual que la remota. GREEN: 2 sujetos con la receta nueva, con las mismas medidas. Paso a mano un control de no regresión de «Merge denegado por el entorno».
11. **Modelos** (tu CLAUDE.md pide confirmarlo antes de paralelizar): el implementador del script es Sonnet 5 con effort high, porque trabaja desde prosa y hay concurrencia. Los revisores de task y el final son Sonnet 5 con effort medium. Los 4 sujetos RED/GREEN son Sonnet 5 con effort medium, 2 en paralelo, dentro del tope de 3 agentes. Los tests Pester los escribo yo en el hilo antes de despachar.

### Decisiones tomadas con el dev-lead

- Carril task en vez de patch, porque la receta cambia y eso exige RED→GREEN — «Task 0042 completa (Recommended)», 2026-09-23.
- Modo full, perfil delegate — «Full, perfil delegate (Recommended)», 2026-09-23.

## Intent

Hoy el merge del cierre es prosa (`merge-recipe.md`) y cada agente la aplica a su manera. Casi en cada cierre, dos sesiones publican en `develop` a la vez. Hoy la sesión de la 0006 empujó `HEAD:develop` a `origin` y la `develop` local se quedó atrás. Se quiere un script que haga la receta siempre igual: con turno (cerrojo), con la base al día, con el push de la rama y no de `HEAD`, y sin dejar restos cuando algo falla.

## Scope

- Entra: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`; `tests/Invoke-SddMerge.Tests.ps1`, con dos procesos que compiten y rutas con tildes; `merge-recipe.md` reescrita para llamar al script; el paso 10 de `sdd-end-task`, el paso 6 de `sdd-end-patch` y la tabla de scripts de `sdd-templates`; la evidencia RED/GREEN en `tests/`; el delta en `capabilities/control-profiles.md`.
- No entra: el merge a `main` ni el tag, que los decide una persona; crear PRs; el borrado del worktree de la feature (`merge.removeWorktree`, que sigue igual); `sdd-end-release`; cambiar el hook `pre-merge-commit`.

## Approach

Un script PowerShell en `sdd-templates/scripts/`, junto a `Build-EstimationLog.ps1` y `Get-NextSddId.ps1`, que se ejecuta desde el kit y no se copia al proyecto. Lee la salida de git con UTF-8, porque la regla de la 0010 en `tech-stack.md` lo exige para las rutas con tildes. Toda la secuencia va dentro de un `try/finally`: el cerrojo se toma, se integra la base, se fusiona, se verifica y se empuja, y el `finally` retira el worktree y suelta el cerrojo pase lo que pase. Los tests Pester montan en `$TestDrive`, bajo una carpeta con tildes, un remoto bare, un repo bare con worktrees y dos ramas de feature. Lanzan dos `pwsh` a la vez y comprueban el orden de los merges.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El merge del cierre espera su turno**
- GIVEN dos cierres del mismo repo que fusionan en `merge.into` a la vez, desde worktrees distintos
- WHEN los dos ejecutan `Invoke-SddMerge.ps1`
- THEN el segundo espera y dice quién tiene el cerrojo (rama y worktree); fusiona cuando el primero lo suelta, sobre la rama destino que dejó el primero
- AND si el cerrojo no se libera en `-LockTimeoutMinutes`, el script falla nombrando al dueño y no toca nada; un cerrojo de un proceso que ya no existe en la misma máquina se toma, y el script lo dice

**ADDED — El merge del cierre parte de la rama destino publicada**
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND si el único conflicto es `estimation-log.md`, lo regenera con `Build-EstimationLog.ps1`; con cualquier otro conflicto, falla con la lista de ficheros

**ADDED — El push del cierre publica la rama destino**
- GIVEN un merge del cierre cuyo push ha confirmado una persona
- WHEN el script empuja
- THEN empuja la rama destino por su nombre (`git push <remoto> <destino>`), nunca `HEAD:<destino>`, y al terminar la rama local y la remota apuntan al mismo commit
- AND sin la confirmación, el script fusiona en local y no empuja

**ADDED — Un merge del cierre que falla deja la rama destino como estaba**
- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «ok» (push con `-Push` confirmado, decisión 1; sin `merge.push`) |
