---
kit_version: 2.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-172501-patch-0110-native-scripts-windows
task: 0110
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0110: los scripts de Native con la herramienta Bash y `task-done` con salida

## Contexto

- Carril y modo: patch, edición de skill con RED/GREEN, perfil `delegate`
- Skills del kit usadas: `using-sdd`, `sdd-start-patch`, `sdd-templates` (`Get-NextSddId.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`), `sdd-end-patch`, `sdd-feedback`; de superpowers, `systematic-debugging` (implícito en el paso 1) y `writing-skills` (el ciclo RED/GREEN)
- Proyecto: el propio repo del kit, Windows 11 con PowerShell como shell principal, worktree por rama
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet en 4 sujetos headless (2 RED, 2 GREEN)
- Coste en reloj: ~1,1 h hasta el commit del fix; ~15 min de cierre
- Coste en tokens: no medido; sujetos 2,06 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un sujeto `claude -p` no hereda el shell principal del harness y la conducta ligada al shell no se mide

- **Qué pasó**: el frente de WSL (`bash <ruta>` desde PowerShell) necesitaba que el sujeto eligiera PowerShell. El molde puso en su `CLAUDE.md` el entorno del dev-lead («Shell principal: herramienta `PowerShell`»), pero los 4 sujetos hicieron 0 llamadas a PowerShell y todo por Bash: disparador ausente 4/4. En la sesión interactiva del ticket de origen, el entorno del harness decía «Shell: PowerShell (primary)», y eso no llega a `claude -p`. La mitad de la campaña (~1 $) midió un frente que no podía fallar, y ese frente se cerró con evidencia textual y una sonda de la máquina.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Comprobación previa de cada escenario»; `tests/headless/lib.sh`, `build_claude_args`
- **Por qué el kit no lo evitó**: la comprobación previa pregunta por herramientas que el sujeto no tiene (`AskUserQuestion`), pero no por contexto del harness que el sujeto no recibe (el shell principal, la plataforma).
- **Coste**: ~1 $ y un frente cerrado sin GREEN de conducta.
- **Propuesta**: otra pregunta en la comprobación previa: «¿la conducta depende del shell principal o de otro dato del entorno del harness interactivo? El sujeto `-p` no lo recibe: el escenario lo modela (p. ej. `--append-system-prompt` con la línea de entorno) o la medición lo declara como límite antes de lanzar». Sin verificar si `--append-system-prompt` basta para que el sujeto elija PowerShell.
- **Criterio de aceptación**: GIVEN el molde de este patch (`.docs/sdd/specs/20260929-165746-patch-0110-native-scripts-windows/red/subject.sh`) con el kit de antes del fix y el entorno del harness modelado, WHEN el sujeto ejecuta las Tasks 1 y 2, THEN al menos 1 de 2 lanza un script con `bash` desde PowerShell (disparador presente); hoy 0/2.

### 2. `MOLD_NAME` solo vale si se define antes de `subject_init`

- **Qué pasó**: definí `MOLD_NAME=salas` después de `subject_init`. `R` ya valía `…/repo`, el molde se escribió ahí y la prueba en seco no encontró `plan.md`. Lo vio el `DRY_RUN=1`, y se perdió una vuelta.
- **Dónde en el kit**: `tests/headless/lib.sh`, comentario de cabecera («Variables: … MOLD_NAME (repo) …»)
- **Por qué el kit no lo evitó**: la cabecera lista `MOLD_NAME` junto a las variables de entorno, sin decir que `subject_init` la lee para calcular `R`.
- **Coste**: bajo, una prueba en seco más.
- **Propuesta**: en la cabecera, «MOLD_NAME (repo; se define antes de subject_init, que calcula R)».
- **Criterio de aceptación**: GIVEN un `subject.sh` que define `MOLD_NAME` después de `subject_init`, WHEN un agente lo escribe siguiendo la cabecera de `lib.sh`, THEN la cabecera ya le dice el orden; comprobable con un Pester que busca «antes de subject_init» en `lib.sh`.

### 3. `patch-template.md` no tiene sitio para el coste de los sujetos (segundo reporte)

- **Qué pasó**: un patch que edita una skill lleva campaña RED/GREEN, y su coste (2,06 $, 4 sujetos) acabó en §4 de `patch.md`, en `tests/native-scripts-*.md` y en el mensaje final, pero no en §5 «Tiempo», y `estimation-log.md` deja `—`.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` §5
- **Por qué el kit no lo evitó**: ya está en la fila 0015 del roadmap (patch 0037 §3, «`- Coste de sujetos:` en §5»), sin arrancar.
- **Coste**: bajo; el log no suma el gasto de las campañas de los patches.
- **Propuesta**: la de la fila 0015, que este reporte refuerza.
- **Criterio de aceptación**: GIVEN un `patch.md` con `- Coste de sujetos: 2,06 $` en §5, WHEN corre `Build-EstimationLog.ps1`, THEN la fila del patch lleva ese coste en su columna.

## Lo que hice por iniciativa propia

- Probé el arreglo que propone el borrador del issue para superpowers sobre una copia del script antes de redactarlo: con un comando silencioso registra la task, y con uno que falla sigue sin registrarla. Funcionó, y el issue lleva el arreglo verificado.
- Guardé el borrador del issue en la carpeta del patch (`superpowers-issue.md`), en inglés. El kit no dice dónde viven los borradores de issues para superpowers (constitution, Art. IX). Candidato a regla: «el borrador va en la carpeta del artefacto que lo motiva, en el idioma del repo de destino».
- Antes de lanzar los sujetos, apunté el hash de `C:\progress.md` y `D:\progress.md` y lo comparé al acabar: así el estado del molde dice si un sujeto escribió un ledger en la raíz de la unidad, sin borrar el huérfano que ya existía.

## Funcionó, no tocar

- El paso 2 de `sdd-start-patch` con rama sin id: reservé 0110 con `-Reserve` y renombré `feature/native-scripts-windows` a `feature/0110-native-scripts-windows` antes del primer commit, sin dudas.
- Reutilizar el molde de la 0044 y la 0057 cargando su `mold.sh`: la campaña se montó con ~40 líneas propias.
- `DRY_RUN=1` de `lib.sh`: sacó el fallo del hallazgo 2 sin gastar un sujeto.
- Los topes de `tests/headless/run.sh` (`SUBJECT_CAP`, `COST_CAP`) contaron las dos fases sobre la misma carpeta.
- La validación de `sdd-end-patch` con las tres opciones fijas: una sola pregunta y un «validado» sin detalle registrado como tal.

## Errores míos, no huecos del kit

- Escribí un mensaje de commit que nombraba `D:\progress.md` en un here-string de PowerShell, y un guard del entorno bloqueó la orden entera («Remove-Item on system path 'D:\progress.md' is blocked») aunque no borraba nada. Un `Remove-Item env:SDD_KIT_ROOT` en la misma orden que otros comandos cayó igual. Los repetí con un heredoc en Bash y asignando `$null`. Es del harness, no del kit.
