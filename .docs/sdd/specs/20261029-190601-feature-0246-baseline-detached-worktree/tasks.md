---
id: 20261029-190601-feature-0246-baseline-detached-worktree
title: Tasks — La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete
---

# Tasks — La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La línea base en un worktree desanclado | done | c9384d6e | `w2` RED 0/2 → GREEN 2/2; `w1` control 1/1 |
| 2 | El test afirma el efecto | done, recortada | 97de6276 | RED limpio dos veces (`c7`, `t6`): enmienda del 2026-10-29, sin cambio de skill |
| 3 | La pasada de fix no adjudica lo que mete | done | 3b1f1a80 | `c8` GREEN 2/2; `c6` control 2/2; la regla del valor, recortada (`c9` limpio) |

Revisión final: Spec opus+high, 3 Important · Código sonnet+high, limpia (6 Minor) · Arquitectura no (plan), sobre 3b1f1a80
Pasada de fix: juntada en el cierre, 12 hallazgos (3 Important del eje Spec, 1 Important regradado del eje Código, 8 Minor): S-I1 y S-I2 con control RED→GREEN (`c8` 2/2, `w3` 1/1), el resto suite
Re-revisión: 3b1f1a80..juntada en el cierre, sdd-kit:effort-high + opus, 1 Important nuevo (N1, de la pasada) · Minor: 1 a medias, 1 adjudicado, 5 nuevos
Arreglo de la re-revisión: juntado en el cierre — N1, la rúbrica `C8` vuelve a detectar el arreglo silencioso, con N2, N3 y N5 · sin revisar: juntado en el cierre — la rúbrica C8 y tres textos de evidencia

## Rulings

- Task 2: Ruling: el RED de c8 y c9 (Task 3) corre ahora con el kit del commit de apertura, no con el texto de la Task 2 — la Task 2 solo nombra el efecto en sdd-tdd, sdd-verify Native y plan-writing, que no deciden adjudicar ni el valor del arreglo — si me equivoco, repetir el RED de c8 y c9 (~2 $)
- Task 3: Ruling: el GREEN corre c8 y c6 (n = 2 cada uno) y no c5 — el paso closing arrastra c1-c5 (10 sujetos) y la frase del Critical solo gana sujeto («A Critical, or an Important in the lines the fix pass changed») — si me equivoco, un Critical residual mal tratado que c5 habría visto (~1,2 $ para medirlo)
- Final: Ruling: S-M7 c5 no corre como control — la frase del Critical solo gana sujeto y c8 la ejerce con el mismo verbo; el paso closing arrastra 10 sujetos — coste si me equivoco: un Critical residual mal tratado sin medir
- Final: Ruling: S-M7 c5 no corre como control — la frase del Critical no cambia de sentido, solo gana sujeto; la decisión 9 lo prometía — coste si me equivoco: un Critical residual mal tratado sin medir (~0,6 $ medirlo)
- Final: Ruling: C-M1 <id> sin definir en ../baseline-<id> — misma convención que review-<id> de sdd-verify, y los sujetos la resuelven (baseline-0010) — coste si me equivoco: un nombre de carpeta raro
- Final: Ruling: N4 ../baseline-<id> depende del cwd — la línea base corre desde la raíz del worktree (paso 2 la deja ahí) y w1, w2 y w3 lo resolvieron bien — coste si me equivoco: el worktree nace en otra carpeta y se quita igual
- Final: Ruling: N6 «removed likewise» no dice el paso 2 en el reintento de la integración — hueco anterior a la feature («run the same command in a detached worktree of the integration branch»), sin saldo de palabras para cubrirlo — coste si me equivoco: un reintento sin dependencias sale rojo y da «no es de esta rama» en falso; a deuda
