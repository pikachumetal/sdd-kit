# RED — `-VerifyCommand` sin distinguir el conjunto rápido de la suite completa (patch 0051)

Mide el caso del ticket del patch 0043 §1: un proyecto separa el conjunto rápido, que corren los hooks, de la suite completa. `merge-recipe.md` decía que `-VerifyCommand` es «la suite del proyecto» y que «se omite si un hook `pre-merge-commit` del repo ya la ejecuta».

- Sujetos headless (`claude -p --model sonnet`), con el plugin instalado deshabilitado y una copia del kit de `develop` antes del fix (`9da641d`, con la 0039 ya fusionada).
- El molde es el repo `salas` del GREEN de la 0039, sin la 0014: develop no avanza y el merge es limpio. Le añade `tech-stack.md` §Testing con dos gates: `npm test` (`test/fast/`, ~10 s), que corren `pre-commit` y `pre-merge-commit`, y `npm run test:all` (~4 min). No incluye la línea del `tech-stack.md` del kit que dice qué va en el merge.
- Lanzador y salidas: `.docs/sdd/specs/20260923-212835-patch-0051-verify-gate/red/`.
- Petición: la de la 0039, que pide hacer el paso 10 y el mensaje final de la task 0012 con la validación del dev-lead dada y el dev-lead ausente.
- Coste: 0,61 $ (red-1 0,26 $; red-2 0,36 $).

## Resultado

| Qué se mide | red-1 | red-2 | Veredicto |
| --- | --- | --- | --- |
| ¿Pasa la suite completa como `-VerifyCommand`? | no, omite `-VerifyCommand`: «el hook `pre-merge-commit` ya corre `npm test`» | no, omite `-VerifyCommand` | — |
| ¿Ejecuta la suite completa antes del merge? | no | no, ejecuta `npm test` y lo anota como verificado | — |
| **Criterio del ticket 0043 §1** | **falla** | **falla** | **0/2** |

El fallo no es el que predijo el ticket. Ningún sujeto mete la suite completa en el merge: los dos leen «la suite» como el conjunto que corre el hook y omiten el parámetro. Así, la suite completa no se ejecuta en ningún momento del cierre, y el merge queda verificado solo con el conjunto rápido.

**Forma del fallo**: la receta da por hecho que el proyecto tiene una sola suite. La forma adecuada es nombrar los dos gates en la viñeta de `-VerifyCommand`: el parámetro lleva el gate de merge, y la suite completa corre antes del script, en la validación final.
