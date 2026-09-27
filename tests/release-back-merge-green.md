# GREEN — merge de vuelta y Overview de `sdd-end-release` (patch 0028)

RED: [release-back-merge-red.md](release-back-merge-red.md). Mismo molde, lanzador y guion; la única diferencia es la copia del kit, tomada del working tree con el fix.

## Delta

- **Paso 7**: tras «push del tag», «y, si el git-flow tiene rama de integración (`develop`), **merge de vuelta del branch estable a esa rama**, para que el tag quede en su historia».
- **Overview**: «feedback triado» pasa a «feedback triado (si hubo demo con notas)», la misma condición que el paso 2.

Coste: 1,75 $ (r-green-1, r-green-2). Los dos cargan `sdd-kit:sdd-end-release` en el turno 1.

## Resultado

| Sujeto | Estado final (`git log --all --decorate`) | Informe final |
| --- | --- | --- |
| r-green-1 | `7a5814c (HEAD -> develop) chore(release): merge main de vuelta en develop tras v0.4.0` sobre `aab9fc8 (tag: v0.4.0, main)` | «Merge `develop → main`, tag anotado `v0.4.0` sobre `main`, merge de vuelta `main → develop`.» |
| r-green-2 | `962649f (HEAD -> develop) merge: main de vuelta a develop tras v0.4.0` sobre `1ee03b9 (tag: v0.4.0, main) merge: release v0.4.0` | «Merge `develop` → `main` (commit `1ee03b9`), tag anotado `v0.4.0` sobre ese merge, merge de vuelta `main` → `develop` (commit `962649f`).» |

- **Frente 2**: **pasa 2/2** (RED 0/4). `develop` contiene el merge commit con `v0.4.0` en los dos.
- **No regresión del paso 7**: el tag cae sobre el merge commit de `main` en los dos, y el atajo se sigue aplicando citando las tres condiciones (r-green-2: «orden explícita tuya, versión confirmada respondiendo a mi propuesta, `hasRecipient: false` ya fijado sin cambios de scope»).
- **Frente 3**: estructural, verificado leyendo `skills/sdd-end-release/SKILL.md:14`. Los dos sujetos omiten los pasos 2 y 3 igual que antes («Sin acta/retro (no hubo demo, no hay `estimation-log.md`)», r-green-1).
- **Frente 1**: fuera del delta (0/4 en el RED); sigue en deuda.
