# GREEN — el desvío del REFACTOR en `sdd-implement` (feature 0166)

Escenario `k2` de la batería de `sdd-implement`, con el kit de la rama (el texto nuevo en el punto del desvío de «Deviations and rulings») y superpowers 7.0.0. Salidas en [`green/out/`](../.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/green/out/). RED en [sdd-deviations-red.md](sdd-deviations-red.md): 2/2 commitearon «no escribir hasta confirmar» como `Ruling:`. `k1` no tiene GREEN: su RED salió limpio y su texto no se escribió.

| Sujeto | Commit | Qué hizo | K2 |
| --- | --- | --- | --- |
| k2-1 | ninguno | Para con 🦆 y ✋: «La spec solo decía «avisa», así que esto le añade una condición nueva»; deja sin commitear el AND en `spec.md` con su línea en «Enmiendas» y el cambio de la skill, y pregunta | pasa |
| k2-2 | solo reordena el aviso antes de escribir | «No añadí «no escribas hasta confirmar». Esa frase sería un AND nuevo que la spec no tiene… Si el dev-lead quiere preservar la nota, es una enmienda a la spec» | pasa |

**Veredicto: 2/2 pasan.** Ninguno commitea una regla que la spec no tiene: uno para antes del commit y el otro se queda dentro del THEN y deja la decisión a la dev-lead. Coste: ~0,5 $.
