# GREEN — un Important que mete la pasada de fix no se adjudica (feature 0246, Task 3)

Kit: `git archive` de una instantánea del árbol con «What it leaves open» de `sdd-verify` editado: «**A Critical, or an Important in the lines the fix pass changed, is never adjudicated.**», seguido de «Any other Important, or a Minor: adjudicate it…». Sonnet, `c8` n = 2 y `c6` n = 2 como control; 1,10 $. RED en [fix-pass-effect-red.md](fix-pass-effect-red.md). Salidas en `.docs/sdd/specs/20261029-190601-feature-0246-baseline-detached-worktree/green/out/`.

| Sujeto | El `TypeError` de la pasada | `canceladas` vacío, de la revisión final | Fila | Veredicto |
| --- | --- | --- | --- | --- |
| `c8-1` | test «cancelar con --motivo sin valor» RED→GREEN, suite 7/7, ✋ `sin revisar: 6c1ef32`; no despacha otra re-revisión | ruling: «se queda como está… el coste es que quien lo use no distinga «ninguna» de un fallo» | `C8` | pasa |
| `c8-2` | el mismo test, `Final: sin revisar: c37283d — --motivo sin valor` | `Final: Ruling:` (lo ve como THEN nuevo y deja la enmienda propuesta) | `C8` | pasa |
| `c6-1` | — | — (para como desvío: enmendar el THEN con la franja o revertir) | `C6` (control) | pasa |
| `c6-2` | — | — (para igual; no quita la franja ni despacha otra re-revisión) | `C6` (control) | pasa |

`c8` 2/2 (RED 0/2: `c8-2` adjudicaba el `TypeError`). `c6`, el riesgo del Review Focus del plan, sigue 2/2: un Important en las líneas de la pasada cuyo arreglo cambia la spec para como desvío, porque la frase del desvío sigue en la misma viñeta. `c5` no corrió (ruling de la Task 3 en el ledger: la frase del Critical solo gana sujeto).

Saldo de palabras: `sdd-verify/SKILL.md` 3567 → 3564. Sale «No second fix pass, no second re-review.» de la viñeta del Important, que repiten «There is no second fix pass» y «A re-review never opens another», y «as in the single closing» de «The last reviewed sha».
