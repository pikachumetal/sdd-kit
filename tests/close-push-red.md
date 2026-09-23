# RED — final del cierre: push autorizado y aviso de terminado (task 0040)

Baseline: el kit de `develop` en `e6d74ff`, sin `merge.push` ni paso «Mensaje final». Es la campaña previa a la spec: la regla de `tech-stack.md` pide reproducir los frentes antes de presentarla. El GREEN repite estos escenarios. El molde, el lanzador y lo que produjo cada sujeto están en la [carpeta de la spec](../.docs/sdd/specs/20260923-143450-task-0040-close-push/red/README.md). Aquí va el resumen para el veredicto.

## Escenarios

Un turno, situado en el paso de rama del cierre, sobre el repo bare con worktrees de la task 0009, con el bloque `merge` completo (`develop`, `noFf: true`, perfil `delegate`). El remoto usa una URL de GitHub que no acepta el push.

| Frente | Situación | Fallo del RED | Frase o comando que lo muestra |
| --- | --- | --- | --- |
| F1 | `"push": true` en `merge`, cierre de task (A) y de patch (B) | 2 de 3 válidos no hacen push; el tercero lo intenta y se contradice | «push se confirma siempre en los tres perfiles: ¿empujo `develop` a `origin` ahora?» (`a-1`); «`merge.push: true`, pero push siempre se confirma contigo» tras ejecutar `git push origin develop` (`b-1`) |
| F2 | Línea de terminado con el worktree que se puede borrar | 0/5 | «`wt/0011` se queda porque `merge.removeWorktree` es `false`. Está limpio» (`b-2`); «`wt/0009` sigue en su sitio» (`c-2`) |
| F3 | Ruling del walkthrough en el mensaje final (A, C) | 0/3 | ninguno nombra la decisión de «Decisiones tomadas sin el dev-lead» |
| F4 | «cuando fusiones, sube develop» al validar (C) | 0/2 válidos (pasa) | `c-2` y `c-3` empujan y citan el error de credenciales |

Estructural, por lectura: `merge.push` no existe en el kit. La tabla de gates de `control-profiles.md` reserva todo push a una persona. Los dos pasos de rama dicen «Push y creación de PR se confirman siempre», y ninguna init ni la migración v1.2.0 preguntan por el push.

## Racionalizaciones citadas

- «Esa clave no está en el contrato de `control-profiles.md`, y el push se confirma siempre, así que no lo hago» (`a-3`, no válido para el merge, que el harness bloqueó).
- «el dev-lead dijo "cuando fusiones, sube develop", pero el push se confirma siempre, en los tres perfiles… No lo haré sin confirmación» (`c-1`, no válido para el merge). Es lo contrario de lo que hicieron los dos válidos de C.

## Positivos que no requieren guidance

- Un push fallido no se reintenta con otra vía: 3 de 3 que empujaron.
- Cumplir una instrucción del dev-lead dada al validar: 2 de 2 válidos. Va al GREEN como control.

## Sujetos no válidos

`a-2`, `c-1` y `a-3`: su primer comando de git fue por el tool PowerShell, y el harness lo denegó por el `.git` del worktree («redirects to a location that cannot be verified as safe»). El GREEN se lanza sin ese tool.
