# GREEN — `-VerifyCommand` es el gate de merge y la suite completa corre antes (patch 0051)

Repite el RED ([verify-gate-red.md](verify-gate-red.md)) con el mismo molde, la misma petición y el kit con el fix. El fix es la viñeta `-VerifyCommand` de `merge-recipe.md`: el parámetro es el gate de merge que declara `tech-stack.md` §Testing (el conjunto rápido si el proyecto separa), la suite completa se ejecuta antes de llamar al script y la omisión por hook no la alcanza.

- Salidas: `.docs/sdd/specs/20260923-212835-patch-0051-verify-gate/green/out/`.
- Coste: 0,57 $ (green-1 0,28 $; green-2 0,29 $).

## Resultado

| Qué se mide | green-1 | green-2 | Veredicto |
| --- | --- | --- | --- |
| ¿Ejecuta la suite completa antes del script? | sí, `npm run test:all` (2/2) | sí, `npm run test:all` (2/2), anotado como verificado por él | — |
| ¿`-VerifyCommand` es el gate rápido y no la suite completa? | sí, `-VerifyCommand "npm test"` | sí, `-VerifyCommand "npm test"` | — |
| ¿El mensaje final da el resultado de la suite completa? | sí | sí | — |
| **Criterio del ticket 0043 §1** | **cumple** | **cumple** | **2/2** |

Los dos pasan `-VerifyCommand "npm test"` aunque el hook ya lo corre. green-2 cree que `.githooks` no está activo en su worktree. Repetir el gate rápido cuesta segundos y no es el fallo que se mide, así que no se toca.

Ancla Pester: `tests/ControlProfiles.Tests.ps1`, «la receta pasa como -VerifyCommand el gate de merge…». Falla con el texto anterior (`Expected regular expression '-VerifyCommand "<gate de merge>"'`) y pasa con el fix.
