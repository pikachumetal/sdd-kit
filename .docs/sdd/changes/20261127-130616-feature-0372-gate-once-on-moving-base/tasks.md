# Tasks — feature 0372

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — g8 y av2 con la base que trae un manifiesto, y su RED | done | 389ff4b05 |
| 2 — La base que trae un manifiesto no repite la gate entera; GREEN | done | ef255ccf5 |

Revisión final: Spec opus+high, con arreglos (2 Important, 5 Minor) · Código sonnet+high, con arreglos (1 Important, 3 Minor) · Arquitectura no (plan), sobre ef255cc
Pasada de fix: juntada en el cierre, 2 Important y 4 Minor arreglados (medición g8 N=1 1/1; dist/ reconstruido), 3 Minor con ruling
Re-revisión: ef255cc..juntada en el cierre, sdd-kit:effort-high + opus, aprobada (1 Minor nuevo, con ruling)

## Rulings

Task 1: Ruling: RED de av2 1/1 — el sujeto encuentra el rojo de la rama antes de la sincronización (gate con --affected sobre la rama), así que AV2b no discrimina la regla vieja; av2 queda como control, como dice «Dónde se prueba», y AV2b sigue en la rúbrica para el GREEN — coste si me equivoco: AV2b no protege el cruce; lo hace G8a/G8b en g8
Task 1: Ruling: RED de g8 0/2 por la rúbrica, pero solo g8-2 exhibe la regla vieja (gate entera); g8-1 falla G8b por la forma de la línea Gate:, no por la regla — el RED vale por g8-2; el GREEN dirá si G8b pasa con la forma del kit — coste: si el GREEN falla solo por forma, G8b mide formato además de la regla
Task 1: Ruling: Step 2b sin `dry-run` de battery.mjs para inspeccionar el molde: DRY_RUN=1 KEEP_MOLD=1 y merge a mano en el molde conservado; g8: nada cruza (base solo rooms:test); av2: bookings:test cruza y sale rojo — coste: ninguno
Task 2: Ruling: GREEN 1.ª tanda g8 0/2 — g8-2 corrió la gate entera «porque la base trajo package.json (Sin filtro)» y g8-1 corrió bookings:test por el mismo motivo; ninguno leyó closing-suite.md, decidieron con el paso 6. Clase (Art. II): excepción sin contraejemplo — «cambia el build» era la salida fácil. Reescrita la frase del paso 6 como predicado (corre solo una tarea cuyos inputs lo tienen y que toca la rama) con el contraejemplo; mismo comportamiento, ningún THEN cambia. Segunda tanda N=2 (decisión 13, contingencia) — coste si me equivoco: 0,94 $ más
Task 2: Ruling: G8b de g8-1 (green2) con los nombres de tarea entre backticks (`` `bookings:test`: saltada (…) ``) cuenta como pasa: el porqué de cada tarea es el literal y la forma de la línea es la del kit — coste si me equivoco: G8b más laxo que su letra
Final: Ruling: Código m1 el literal del paso 9 sin `(sin filtro: cambia el build)` — el paso 6 ya no corre nunca sin filtro (la gate de cierre no se repite; tras --sync ni la base ni la rama la repiten entera), así que el literal no necesita el caso — coste si me equivoco: un cierre sin gate previa escribiría la marca fuera del literal
Final: Ruling: Spec m5 el AND de pnpm-lock.yaml input de launcher:test sin escenario — es el cruce vigente (una tarea que solo toca la base sale `saltada (solo la toca la base)`), que g5 ya mide con scripts/launcher/run.sh — coste: el predicado con un lockfile como input no tiene sujeto propio
Final: Ruling: Spec m7 AV2b sin RED que discrimine — av2 es control (ruling de la Task 1); AV2b sí discriminó la primera redacción del GREEN (green/ av2 0/1) — coste: ninguno nuevo
Final: Ruling: Código «Declined» un «Sin filtro» de la base que no es input de ninguna tarea no corre nada — es el enfoque A aprobado y la decisión 11 de la spec — coste: el de la decisión 11
Final: Ruling: Spec «Declined» g8-1 repite la gate de cierre antes del commit de cierre — conducta del paso 6 previa a esta feature; va al ticket — coste: tiempo en campo
Final: Ruling: Minor de la re-revisión — el predicado del paso 6 («runs only a task whose inputs hold it and that the branch touches») no nombra la base para un «Sin filtro» de la rama; la frase anterior del mismo punto («no gate task in both diffs … nothing runs») y closing-suite.md («run only the tasks both select») lo acotan, y un arreglo tras la re-revisión quedaría sin revisar — coste si me equivoco: un cierre con un manifiesto de la rama corre una tarea que solo toca la rama
