# Campaña RED/GREEN — task 0042

- **Molde**: el `m/` del RED de la task 0009 (`../../20260923-120510-task-0009-merge-close/red/m`), capas `base`, `t9` y `c9`, sin copiarlo.
- **Repo** (`subject.sh`): un remoto bare `git/origin.git` y un clon bare `git/salas.git` con `wt/0009`. Tras sacar el worktree, otro clon publica en `origin/develop` el commit `merge: task 0010, nota de uso`. El clon bare no hace `fetch`, así que su `origin/develop` queda atrás.
- **Petición** (`run.sh`): el paso 10 de `sdd-end-task` con la task validada y el mensaje del dev-lead «fusiónalo a develop y súbelo a origin».
- **Escenarios**: `r1`, y `d1`, que es `r1` con `deny-merge.js` denegando `git merge` y `Invoke-SddMerge`.
- **Kit**: en el RED, `git archive develop skills .claude-plugin` en `19948c6`; en el GREEN, `skills/` y `.claude-plugin/` del working tree de `feature/0042`.
- **Salida**: `out/<etiqueta>.state.txt` (develop local y remota antes y después, si coinciden, grafos y estado de los worktrees) y `out/<etiqueta>.tools.txt` (tool calls y mensaje final). Los streams completos se quedan en el scratchpad y no se versionan.

Uso: `KIT_DIR=<kit> RUNS_DIR=<scratchpad> OUT_NAME=out SCENARIOS="r1" SUBJECTS="1 2" bash run.sh`.
