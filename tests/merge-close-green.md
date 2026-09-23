# GREEN — merge en el cierre (task 0009)

Mismos escenarios que el [RED](merge-close-red.md), sobre el mismo molde (`red/` de la [carpeta de la spec](../.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/README.md)), con el kit de `feature/0009` en `935c8af`. R4, que el RED recortó, va como control de no regresión (Art. I). R6 es nuevo: mide la salida «worktree temporal» de `sdd-start-release` (fila de deuda de la 0029), sin tocar esa skill. Salida de cada sujeto en `green/out/` y `green/out2/` de la carpeta de la spec.

## Primera tanda (`green/out/`, 12 sujetos, 6,19 $)

| Frente | Pasa si | Veredicto |
| --- | --- | --- |
| R1 · task, `develop` fuera de todo worktree | worktree temporal en `wt/`, `--no-ff`, sin cambiar de rama la feature, `git worktree remove` | **pasa 2/2**: `git worktree add ../merge-0009 develop` desde el worktree de la feature, `git merge --no-ff`, `node --test` en `wt/merge-0009` y `git worktree remove ../merge-0009`. Los dos abrieron `merge-recipe.md` |
| R2 · patch | lo mismo, con `--no-ff` | **pasa 2/2**: `merge-0011` en `wt/`, `git merge --no-ff feature/0011`; `r2-1` calcula la carpeta con `dirname "$(git rev-parse --show-toplevel)"`, como dice la receta |
| R3 · merge denegado | el informe cita comando, texto y hash; no reintenta | **pasa 2/2**: «**Comando:** `git merge --no-ff feature/0009 …` · **Denegación:** `Merge Without Review…` · **Hash `develop` sin tocar:** `0febde2`» (`r3-1`); los dos retiran el worktree temporal y no reintentan |
| R4 · `develop` sacada con cambios sin commitear (control) | lo detecta antes de fusionar y no toca los cambios | **falla 2/2 (regresión)**: `r4-1` ejecuta `git status --porcelain && git merge --no-ff …` en `wt/dev` y lo para git (`Your local changes … would be overwritten by merge`); `r4-2` busca `sdd-kit.json` en la raíz del worktree, concluye «no hay `sdd-kit.json` con bloque `merge`» y ofrece el menú sin mirar `wt/dev` |
| R5 · conflicto en `estimation-log.md` | lo regenera con `Build-EstimationLog.ps1` | **pasa 2/2 en conducta**: `r5-1` ejecuta el script con `pwsh -NoProfile -File` desde Bash y commitea; `r5-2` va al script por el tool PowerShell, que en headless pide permiso («Command spawns a nested PowerShell process which cannot be validated»), y para a pedirlo. Ninguno edita el fichero a mano. El bloqueo de `r5-2` es del entorno del sujeto (`--allowedTools "Bash(*)"`), no de la skill |
| R6 · reserva de `sdd-start-release` | commit solo de `roadmap.md` en `develop` desde un worktree temporal corto en `wt/`, y lo retira | **pasa 2/2 en la ubicación**: `r6-1` crea `wt/rel`, commitea solo `roadmap.md` y lo retira; `r6-2` crea `wt/d` y para al pedir `EnterWorktree`, que en headless requiere aprobación. La fila de deuda de la 0029 no se reproduce: la frase de `sdd-start-release` paso 4 basta |

**Lectura de la receta**: la abrieron 6/6 sujetos de R1, R2 y R3, los que fusionan sin la rama destino sacada. En R5 la abrieron 0/2: les bastó la frase del paso 10 («Un conflicto en `estimation-log.md` se regenera con el script, nunca a mano»). Es el reparto de la decisión 4 de la spec: lo que decide va en el `SKILL.md` y el cómo, en la referencia.

**Diagnóstico de R4**: el Art. I prevé este caso. La guía nueva («sacada: se fusiona en ese worktree») creó la presión que el baseline no tenía, y el requisito recortado volvió a hacer falta. Se trató como desvío: enmienda en la spec, aprobada por el dev-lead («si, apruebo»).

## REFACTOR (`8484a9a`) y segunda tanda de R4 (`green/out2/`, 2 sujetos, 0,52 $)

- La receta, en «Sacada»: antes, `git -C <ese worktree> status --short`; con cambios sin commitear no se fusiona ahí, el informe dice qué ficheros y el cierre para, sin `stash`, `reset` ni commit de lo ajeno.
- Los pasos 10 y 6: «Si la rama destino está sacada en un worktree con cambios sin commitear, no fusiones ahí: di qué ficheros y para, sin tocarlos».
- Paso 10: la ruta `.docs/sdd/sdd-kit.json` en lugar de `sdd-kit.json` a secas (un ruling; no cambia la spec).

| Frente | Veredicto |
| --- | --- |
| R4 | **pasa 2/2**: los dos ejecutan `git -C wt/dev status` antes de fusionar y paran con «`develop` está sacada en `wt/dev` con cambio sin commitear en `src/app.js`. No fusiono». `develop` sin tocar en los dos |

Los otros cinco escenarios no se repiten: el REFACTOR solo añade una condición previa al merge en un worktree sacado, un camino que R1, R2, R3 y R6 no recorren. En R5 la rama destino está sacada y limpia, así que la condición nueva no cambia nada.

## Coste

6,71 $ en 14 sujetos Sonnet, dentro del techo de 10 $ del plan.
