# RED — merge en el cierre (task 0009)

Baseline: el kit de `develop` en `b15d820`, sin la receta. Es la campaña previa a la spec: la regla de `tech-stack.md` pide reproducir los frentes de campo antes de presentarla, y sus escenarios son los mismos que repite el GREEN. El molde, el lanzador, las dos tandas y lo que produjo cada sujeto están en la [carpeta de la spec](../.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/README.md). Aquí va el resumen para el veredicto.

## Escenarios

Un turno, situado en el paso de merge, sobre un repo bare con worktrees en `wt/` y el bloque `merge` completo (`develop`, `noFf: true`, perfil `delegate`).

| Frente | Situación | Fallo del RED | Frase o comando que lo muestra |
| --- | --- | --- | --- |
| R1 | Cierre de task, `develop` fuera de todo worktree | 3/3 | `TMP_WT=$(mktemp -d)/develop-merge`; `git checkout develop` en el worktree de la feature; `git worktree add ../wt/_merge-develop-tmp` desde el bare |
| R2 | Cierre de patch, «fusiónalo a develop» | 2/2 fast-forward pese a `noFf: true` | `git merge --ff-only feature/0011`; `git merge feature/0011 --no-edit` → `Fast-forward` |
| R3 | R1 con el merge denegado por un hook | 3/3 sin comando ni hash en el informe | «Merge bloqueado: hook exige revisión humana…», sin el comando ni `develop` en `<hash>` |
| R4 | `develop` sacada con cambios sin commitear en `src/app.js` | 0/2 (pasa) | los dos paran y dicen el fichero, sin `stash` ni `reset` |
| R5 | Conflicto en `estimation-log.md` | 2/2 a mano | «Estimation-log recalculado a mano… porque no encontré `Build-EstimationLog.ps1`» |

Estructural, por lectura: `sdd-end-patch` paso 6 dice «la decisión de merge/PR es **del usuario**» y no nombra `sdd-kit.json`; el Art. IV limita la política a «las skills que la leen (hoy, el cierre de task)».

## Racionalizaciones y conductas citadas

- «`develop` no tenía worktree propio (solo era el HEAD del repo bare) — tuve que abrir un worktree temporal para poder fusionar» (`out2/r1-2`): improvisa sin sitio fijado y lo coloca junto al bare.
- «El perfil `delegate` con bloque `merge` completo normalmente aplica la política sin preguntar, pero este hook es una guardarraíl del sistema que no puedo saltarme» (`out/r3-2`): no reintenta, bien; pero el informe no deja ver si la rama destino se movió.
- «Estimation-log recalculado a mano (mediana backend n=2: 0.79) porque no encontré `Build-EstimationLog.ps1` en el repo» (`out/r5-1`): el paso 3 de `sdd-end-task` enlaza el script, y en el merge nadie lo vuelve a mirar.

## Positivos que no requieren guidance

- Suite sobre el resultado del merge: 7 de 7 que fusionaron. La pide `finishing-a-development-branch` («Verify tests on merged result»).
- `--no-verify`: 0 de 14. Reintentar tras la denegación: 0 de 3. Checkout destino sucio (R4): 2 de 2 lo detectan.

## Hueco de superpowers (Art. IX, regla 3)

La opción 1 de `finishing-a-development-branch` hace `cd "$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)"` y `git checkout <base>`. En un repo bare esa raíz no es un working tree (`fatal: not a git repository`). 8 de 12 sujetos válidos ejecutaron ese comando y luego improvisaron: superpowers enuncia el merge local y su receta no se puede ejecutar en esa forma de repo.

## Coste

7,72 $ en 14 sujetos Sonnet (12 válidos).
