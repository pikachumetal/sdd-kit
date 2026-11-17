# Tasks — feature 0307: sdd-verify y sdd-tdd con las tres reglas

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — `sdd-tdd`: las cuatro frases sustituidas | hecha | 06b3653a |
| Task 2 — `sdd-verify`: el cierre a su referencia, K31 y «Running a gate» | hecha | 181e8d30 |
| Task 3 — `encargo-revision.md` en inglés | hecha | 81059456 |

Revisión final: Spec opus+high, con arreglos (2 Important, 1 Minor), 4 sin verificar · Código sonnet+high, con arreglos (3 Minor), 2 sin verificar · Arquitectura no (plan), sobre 81059456
Pasada de fix: juntada en el cierre, 4 hallazgos arreglados sin test RED (texto de skill: kit:copies, kit:own y cli:test 2231/2243), 1 ruling
Re-revisión: 81059456..juntada en el cierre, sdd-kit:effort-high + opus, 6/6 ADDRESSED, 3 Minor adjudicados

## Rulings

Task 1: Ruling: el humo corre con n = 1 (spec, «Previsión de coste») sobre una copia de las baterías en .temp/t7 (n y umbral 1/1 en c1, c1f, t2 y t1b; junctions a tests/headless y build), porque la tabla lleva n = 2; KIT_DIR es una copia de dist/ en .temp/k7 (tech-stack.md, GREEN sin commitear) — coste si es erróneo: un sujeto más por escenario
Task 2: humo c1, c1f y t2, n = 1, 1,79 $ (campaña 2,04 $) — los tres abren references/closing-the-review.md tras cargar sdd-verify; C1 verde (una pasada de fix del Important, re-revisión opus+high, Minor a minor (deferred); el Minor de la re-revisión, CRLF que rompió su propio fix, lo arregla y lo deja en ✋ como sin revisar), C1f verde (Minor en la única pasada, Final: fixed, Pasada de fix: 2 hallazgos), T2a y T2b verdes (tests rojos, --base 389aff8, rooms:test con «(no corrió en la pasada roja)»), L verde
Task 3: Ruling: la traducción de «Sale en segundo plano en cuanto existe el commit de la última task» da «out in the background as soon as the last task's», repetida con dist/skills/sdd-implement/SKILL.md:314 (fila 0296); no se parafrasea (enmienda del 2026-11-05) y va al ticket para la 0311 — coste si es erróneo: una inclusión más en la 0311
Final: Ruling: Review Focus 2 (Minor sin test) sin observar — el Minor de c1f lo reproduce un test, ningún escenario de la batería tiene un Minor que ningún test reproduzca, y la regla ya estaba (feature 0178); se corrige la línea del plan en vez de abrir un escenario fuera de «Dónde se prueba» — si es erróneo, un Minor de nombre se apunta como deferred sin que la batería lo vea
Final: Ruling: «Declined to judge» del eje Spec — bloque del encargo en castellano (decisión 8), c1-1 arregla el Minor de su re-revisión (un sujeto, regla movida sin cambio), tasks.md pendiente en 81059456 (artefacto del cierre), «don't write code to make it pass» legible para un test propio (texto de la decisión 7), citas traducidas (ya eran paráfrasis) — quedan como están — coste si es erróneo: ninguno en conducta
Final: Ruling: «Not verified» de los ejes — kit:skill-size, kit:copies y kit:own los corrió el hilo tras la pasada (sdd-verify 16.768 bytes; sin líneas de esta fila salvo las 4 repetidas con otra fila); cli:test entero 2231/2243; la Confirmación de la ADR 0015 no tiene test en cli/test/kit desde la retirada de los .Tests.ps1, fuera de esta fila — coste si es erróneo: un rojo que vería la CI
Final: Ruling: spec decisión 6 y plan citaban la frase vieja de Verify RED (Minor de la re-revisión) — se corrigen en un commit solo de docs, revisado en el hilo, con su línea de «Enmiendas» sin aprobar — coste si es erróneo: ninguno en conducta
Final: Ruling: «Never skip it, also with a RED you received» poco idiomático, mejor «even for» (Minor de la re-revisión) — se queda: un cambio de la skill tras la re-revisión iría a ✋ sin revisar, y la frase se entiende — coste si es erróneo: una lectura algo torcida
Final: Ruling: enmiendas de las decisiones 4 y 6 sin aprobar (Minor de la re-revisión) — aplican literal «la frase que falla se sustituye, sin añadir otra» y el review.minors: fix; van a ✋ del mensaje final para que el dev-lead las apruebe o las tumbe — coste si es erróneo: revertir dos frases
Final: minor (deferred): closing-the-review.md:37 cuenta «<n> hallazgos RED→GREEN» en Pasada de fix: aunque «Native» admite Minors arreglados sin test (fuera del diff del fix; al ticket)
