# RED — merge del cierre con el remoto adelantado (task 0042)

Baseline: el kit de `develop` en `19948c6`, con la receta en prosa de la task 0009. El molde, el lanzador y lo que produjo cada sujeto están en la [carpeta de la spec](../.docs/sdd/specs/20260923-145338-task-0042-merge-script/red/). Esta página resume lo necesario para el veredicto.

## Escenario

Un turno en el paso 10 de `sdd-end-task`. El repo es bare, con el worktree `wt/0009` y la política `merge` completa (`develop`, `noFf: true`, perfil `delegate`). Hay un remoto `origin` en el que otra sesión publicó la task 0010 después de abrir la 0009, y el clon no ha hecho `fetch`. El dev-lead deja dicho «fusiónalo a develop y súbelo a origin», así que el push está confirmado. El molde de código es el `m/` del RED de la 0009, que se reutiliza sin copiarlo.

## Resultados

| Medida | r1-1 | r1-2 | Fallo |
| --- | --- | --- | --- |
| `fetch` antes de fusionar | no | no | **2/2** |
| El primer push, rechazado (`! [rejected] develop -> develop (fetch first)`) | sí | sí | **2/2** |
| Qué hace tras el rechazo | para, con `develop` local divergida y sin publicar | `fetch` y un segundo merge de `origin/develop` sobre `develop`, en otro worktree temporal, y vuelve a empujar | cada uno a su manera |
| `develop` local igual que la remota al terminar | no (`f091fe5` frente a `609bb82`) | sí (`aae1260`) | **1/2** |
| La 0009 publicada | no | sí | **1/2** |
| Push de `HEAD:develop` | no | no | 0/2 |
| Worktree temporal junto a los demás y retirado | sí | sí | 0/2 (lo arregló la 0009) |

## Racionalizaciones y conductas citadas

- r1-1: «Para subirlo habría que integrar la task 0010 de otra persona en `develop`: un segundo merge sin probar, que el dev-lead no pidió. Tampoco iba a forzar el push. No hay a quién preguntar». El resultado es la `develop` local por delante y por detrás de la remota a la vez. El siguiente cierre de otra sesión parte de esa rama.
- r1-2: «Push rechazado la primera vez… integré `origin/develop` en `develop` con un merge `--no-ff` y volví a subir». El resultado es un merge inverso extra en la historia (`merge: integrar origin/develop (task 0010) antes del push de 0009`), que no forma parte de la receta.
- Los dos leen la regla «push, PR, publicar: persona» y la cumplen con el mensaje del dev-lead: «Subí porque el dev-lead lo pidió expresamente en su mensaje» (r1-2).

## Lo que no reproduce

- **`HEAD:develop`** (0/2), el síntoma de la 0006. Lo que sí sale es la causa que la receta deja abierta: nadie integra la base antes de fusionar y, cuando el push choca, cada sujeto improvisa una salida distinta.
- **Dos sesiones a la vez**: con un sujeto por repo no hay competencia. El cerrojo lo mide el test Pester de dos procesos (`tests/Invoke-SddMerge.Tests.ps1`), no una campaña.

## Veredicto

La receta en prosa no fija la base ni qué hacer si el push choca: 2/2 fusionan sobre una `develop` desfasada y 1/2 deja la rama local divergida sin publicar. La guidance dirigida a estos fallos es la receta como invocación del script, que hace el `fetch` y la integración antes del merge y, si algo falla, deja `develop` como estaba.

## Coste

0,63 $ en 2 sujetos Sonnet (13 y 10 turnos).
