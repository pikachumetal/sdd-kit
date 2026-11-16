# Tasks — feature 0284

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El test compara contra el tope nominal | hecha | `e889ce23` |
| 2 — La regla 6 cuenta el saldo sobre las skills que toca | hecha | `470dae16` |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia (3 Minor adjudicados) · Arquitectura no (plan), sobre 470dae16

## Rulings

- Task 1: Ruling: la Verificación corre como `pnpm --dir cli exec vitest run …` y no con `cd cli;` — `sdd task done` lanza un solo comando sin shell — si es un error, nada: el test es el mismo
- Final: Ruling: Código Minor 1 · el test del GIVEN usa los literales 3692 y 3600 — son las cifras del criterio de la fila 0284 y del ticket de la 0276, y el nombre del test dice qué comprueba; nombrarlas no añade intención — coste si está mal: ninguno funcional
- Final: Ruling: Código Minor 2 · topes exactos, sin holgura — es la decisión 2 de la spec aprobada, no un defecto del código — coste si está mal: toda edición que sume palabras toca la tabla, que es lo que se pide
- Final: Ruling: Código Minor 3 · paréntesis anidados en la regla 6 de CLAUDE.md — la frase es literal del «Después» aprobado en la decisión 6; cambiarla sería una enmienda por legibilidad sin efecto — coste si está mal: una lectura algo más lenta de la regla
- Final: Ruling: Spec «no verificado» · que el RED corriera en rojo — verificado en la sesión: con el factor, `AssertionError: expected [Function] to throw an error`, 1 failed | 77 passed (78) — coste si está mal: ninguno
- Final: Ruling: Spec «no verificado» · `moon run cli:typecheck` — verificado en la sesión: `Tasks: 1 completed`, exit 0 — coste si está mal: ninguno
- Final: Ruling: Spec «no verificado» · `kit:build kit:copies kit:own kit:skill-size` contra el baseline — verificado en la sesión: `kit:own` con las mismas 24 frases del baseline, `kit:copies` y `kit:skill-size` en verde — coste si está mal: ninguno
- Final: Ruling: Spec «no verificado» · la base cambia antes del cierre — se comprueba en el cierre, tras `sdd merge --sync`, con la decisión 8 — coste si está mal: rojo del gate tras sincronizar, que se re-mide
- Final: Ruling: Spec «no verificado» · `dist/` construido sobre `3b179f84` — `moon run kit:build` corrió en la sesión antes de medir y la rama no toca `skills/` — coste si está mal: ninguno
- Final: Ruling: Spec «Declined» · `tasks.md` en «pendiente» en `470dae16` — se actualiza y entra en el commit de cierre — coste si está mal: ninguno
- Final: Ruling: Spec «Declined» · filas del roadmap — las marca `sdd-archive` — coste si está mal: ninguno
- Final: Ruling: Spec «Declined» · `tech-stack.md` en su tope — consecuencia aceptada en la decisión 5; el cierre la aplica con el requisito de `archive` — coste si está mal: una pieza vieja sale al volcar un aprendizaje
- Final: Ruling: Spec «Declined» · `kit:own` en rojo — de la 0311, fuera de alcance — coste si está mal: ninguno nuevo
- Final: Ruling: Spec recomendación · `sdd-templates` exacto sigue en rojo cuando una regla pasa a una plantilla hasta que su spec suba el tope — es lo que pide el requisito de `feature-flow` (fila con el tope propuesto); «no alarga» se refiere al saldo de la regla 6 — coste si está mal: sorpresa en campo, que iría al ticket
- Final: Ruling: Código «Declined» · cifras contra lo medido, decisiones de la spec y tabla en un fichero de config — los dos primeros los cubre el eje Spec (15 cifras a 0 de su tope con `measure.mjs`); el tercero es la forma del repo — coste si está mal: ninguno
