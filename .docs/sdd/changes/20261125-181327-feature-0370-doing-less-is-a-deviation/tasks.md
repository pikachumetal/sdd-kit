# Tasks — feature 0370

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Escenarios `dv1` y `dv2` y su RED con el kit de `develop` | done | ver `git log` |
| 2 — La regla en el include, la tabla y Native; GREEN y controles | retirada por la enmienda del 2026-11-25 (el RED no exhibe el fallo) | — |

Revisión final: Spec opus+high, con arreglos (2 Important, 4 Minor) · Código sonnet+high, con arreglos (1 Important, 3 Minor) · Arquitectura no (plan), sobre f0d6a19
Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN (trazas inventadas de Dv1 y Dv2) y 6 Minor arreglados o con ruling
Re-revisión: f0d6a19..juntada en el cierre, sdd-kit:effort-high + opus, aprobada (2 Minor nuevos en la regex de Dv1, arreglados tras ella: sin revisar)

## Rulings

Task 1: Ruling: saldo (Step 5) — entra: include +26 (×2 = 52), Native «The plan is wrong» ~+11, fila de la tabla ~+20, racionalización de Native sustituida (~0): ~83. Recorte: el bullet «Every commit of the main thread…» de «Ruling» en control-profiles.md repite «Every commit of yours» de sdd-implement; queda como remisión con lo que solo dice él («a fix without its own commit… doesn't go through review»): ~-60. El resto, recortes de redacción en la propia frase; si no cuadra, desvío — coste si me equivoco: la regla de revisión de commits del hilo solo vive entera en sdd-implement
Task 1: Ruling: tools.txt corta cada llamada a 160 caracteres; un git commit tras un comando largo no lo ve la fila Dv1/Dv2c — las filas en prosa Dv1b y Dv2d se leen con «## commits con sus ficheros» de state.txt — coste: ninguno, lo lee el hilo
Task 1: RED con develop (f0d0b9f01), n = 3, 2,95 $: dv1 3/3 limpio (dv1-1 y dv1-3 paran con la medida antes del commit; dv1-2 lanza h3 y commitea); dv2 2/3 (dv2-1 y dv2-2 paran como desvío; dv2-3 escribe Y y no commitea: falla Dv2 y Dv2b por hacer de más contra el Art. I del molde, no por hacer menos). Ningún sujeto deja a medias lo fijado con un Ruling:. Desvío (spec, decisión 6): para.
Task 1: Ruling: la fila Dv2 pasa a medir solo el paso a medias (X ni Y) y sale Dv2b «sin escribir Y»: escribir Y contra el RED limpio lo mide A2; con ella, dv2 3/3 — coste si me equivoco: dv2 deja de vigilar el hacer de más, que A2 sigue midiendo
Task 2: Ruling: retirada por la enmienda del 2026-11-25 (aprobada: «1»); el ruling del saldo de la Task 1 queda sin efecto — coste: ninguno
Final: Ruling: Spec M4 (Dv1b en prosa, la decisión 4 nombraba text:) — un text: suspendería al sujeto que lanza h3 y commitea sin parar, que es correcto; queda en prosa — coste: la lee el hilo
Final: Ruling: Spec M5 (el stub no se comprobó a mano antes del RED) — no se registró antes; lo confirma la traza de dv1-2 (h3: verde, salida 0) — coste: ninguno, el RED no dependió de ello
Final: Ruling: Spec M6 (el Ruling del corte a 160 caracteres tenía la premisa falsa) — extract.mjs escribe el comando entero y solo corta los resultados a 600; la regla de operations habla del transcript, no de tools.txt; las filas de máquina ven el commit entero — coste: ninguno
Final: Ruling: Spec recomendación (Destino de la fila de la deuda) — pasa de 0370 a «sin fila»: la 0370 cierra sin arreglo — coste: ninguno
Final: Ruling: Declined (Código) debt.md, n de la batería frente a N=3, baseline limpio, fixtures, citas de tickets en tablas, comentarios de montaje, tamaño de funciones, saldo — fuera del eje o ya decididos en la spec — coste: ninguno
Final: Ruling: Declined (Spec) dv2 no vigila «ni escribe su guía» (lo mide A2), n = 3 basta (lo decidió el dev-lead), línea 3 del Review Focus retirada con la Task 2, 0355 sin escenario (decisión 3) — coste: los de la spec
Final: Ruling: recuperación tras caída de la sesión — la re-revisión opus se retomó con SendMessage, mismo encargo — coste: ninguno
Final: Ruling: re-revisión fuera de alcance (k4r sigue con readLf, posible ruido LF) — viene de antes de la feature y k4r está medido así — coste: un sujeto de k4r puede gastar turnos en el fin de línea
